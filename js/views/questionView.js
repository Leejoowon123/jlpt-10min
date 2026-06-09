// 공용 문제 풀이 화면.
// states: 'idle' (정답 선택 전, 모든 힌트/해설/번역/연상카드 숨김)
//       → 'answered' (정답/오답 + 예문 번역 + 연상카드 + 해설 + 액션)
import { buildQuestion } from '../questions.js';
import { speak, ttsAvailable, stopSpeaking, hasJaVoice } from '../tts.js';
import { mnemonicSvg } from '../mnemonic.js';
import { recordResult } from '../srs.js';
import { toggleFavorite, isFavorite, recordSessionItem, markStudiedToday } from '../state.js';
import { showToast } from '../ui.js';
import { renderJa } from '../furigana.js';

/**
 * @param {HTMLElement} root
 * @param {{itemType:string,itemId:string}} item
 * @param {{
 *   onNext?: ()=>void,
 *   onAnswered?: (r:{correct:boolean,itemType:string,itemId:string})=>void,
 *   headerLabel?: string,
 * }} cb
 *
 * onAnswered 는 사용자가 답을 선택한 순간 호출된다.
 * today.js 같은 호출자가 이번 세션 결과만 따로 집계할 수 있도록 함.
 * 호출자가 콜백을 주지 않아도 동작에는 영향이 없다.
 */
export function renderQuestion(root, item, cb) {
  const q = buildQuestion(item.itemType, item.itemId);
  if (!q) {
    root.innerHTML = `<div class="empty"><div class="e-icon">📭</div>콘텐츠를 찾을 수 없습니다.</div>`;
    return;
  }

  let state = 'idle';
  let pickedIndex = -1;
  const isVocab = q.itemType === 'vocab';
  const isListening = !!q.extra?.isListening;

  const wrap = document.createElement('div');
  wrap.className = 'card';

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px';
  header.innerHTML = `
    <span class="badge">${q.extra?.level ?? ''} ${labelOf(q.itemType)}</span>
    <span class="muted" id="qProgress">${cb?.headerLabel ?? ''}</span>
  `;
  wrap.appendChild(header);

  // 청해: 오디오 영역. TTS 결과에 따라 스크립트 노출 여부가 결정된다.
  if (isListening) {
    const audio = document.createElement('div');
    audio.className = 'audio-bar';
    audio.innerHTML = `
      <button class="play" id="ttsPlay" aria-label="재생">▶</button>
      <div class="label">
        <div>${escape(q.extra.scenario || '회화')}</div>
        <div class="muted" id="ttsHint">${ttsAvailable()
          ? '버튼을 눌러 오디오를 재생하세요.'
          : '이 브라우저는 TTS를 지원하지 않습니다. 스크립트를 표시합니다.'}</div>
      </div>
      <button class="icon-btn" id="scriptToggle" title="스크립트 보기/숨기기">👁</button>
    `;
    wrap.appendChild(audio);

    const scriptBox = document.createElement('div');
    scriptBox.className = 'q-context';
    scriptBox.id = 'scriptBox';
    scriptBox.hidden = ttsAvailable(); // TTS 가능하면 처음엔 숨김. 안되면 처음부터 표시.
    // 청해 스크립트에 후리가나 적용 (TTS 가능 시 처음엔 hidden, 선택 후 노출)
    scriptBox.innerHTML = `<div class="ja">${renderJa(q.extra.script, q.extra.scriptReadings || [])}</div>`;
    wrap.appendChild(scriptBox);
  } else if (q.context) {
    // 선택 전엔 일본어 원문만. 한국어 번역은 explanation 으로 미룬다.
    // 일본어 원문에는 후리가나 적용 — 한자 읽기 보조 (정답 누출 없음).
    const ctx = document.createElement('div');
    ctx.className = 'q-context';
    // 단어 예문 문제 — 일본어 예문은 이미 보이므로 듣기 버튼 허용.
    const playExampleBtn = isVocab
      ? `<button class="btn tts-btn small" id="ttsExample"
                 aria-label="예문 듣기" title="예문 듣기" style="margin-top:6px">🔊 예문 듣기</button>`
      : '';
    ctx.innerHTML = `<div class="ja">${renderJa(q.context.ja, q.context.readings || [])}</div>${playExampleBtn}`;
    wrap.appendChild(ctx);
    if (isVocab) {
      const hint = document.createElement('p');
      hint.className = 'muted tts-hint';
      hint.id = 'ttsHintQuestion';
      hint.style.cssText = 'font-size:11px;margin:4px 0 0;min-height:1em';
      ctx.appendChild(hint);
      ctx.querySelector('#ttsExample').addEventListener('click', async () => {
        const r = await speak(q.context.ja);
        handleTtsResult(r, hint);
      });
    }
  }

  // 문제
  const prompt = document.createElement('div');
  prompt.className = 'q-prompt';
  prompt.textContent = q.prompt;
  wrap.appendChild(prompt);

  // 선택지
  const choices = document.createElement('div');
  choices.className = 'choices';
  q.choices.forEach((text, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.dataset.idx = String(idx);
    btn.innerHTML = `<span class="key">${'ABCD'[idx]}</span><span>${escape(text)}</span>`;
    btn.addEventListener('click', () => onPick(idx));
    choices.appendChild(btn);
  });
  wrap.appendChild(choices);

  // 결과/해설 자리 — 선택 전엔 비워둔다. (정답 누출 방지)
  const result = document.createElement('div');
  result.id = 'qResult';
  wrap.appendChild(result);

  // 액션: 자주 볼 단어 버튼은 단어 학습에서만 노출.
  const actions = document.createElement('div');
  actions.className = 'btn-row';
  actions.style.marginTop = '12px';
  actions.innerHTML = `
    ${isVocab ? `<button class="btn ghost" id="favBtn" title="자주 볼 단어">${isFavorite(item.itemId) ? '⭐ 저장됨' : '☆ 자주 볼'}</button>` : ''}
    <button class="btn primary" id="nextBtn" disabled>다음 →</button>
  `;
  wrap.appendChild(actions);

  root.appendChild(wrap);

  // ===== handlers =====
  function onPick(idx) {
    if (state !== 'idle') return;
    pickedIndex = idx;
    const correct = idx === q.answerIndex;
    state = 'answered';

    Array.from(choices.querySelectorAll('.choice')).forEach((el, i) => {
      el.disabled = true;
      if (i === q.answerIndex) el.classList.add('correct');
      else if (i === idx) el.classList.add('wrong');
    });

    // 청해는 답을 고른 후엔 스크립트 자동 노출
    if (isListening) {
      const sb = wrap.querySelector('#scriptBox');
      if (sb && sb.hidden) sb.hidden = false;
    }

    // 단어: 선택 후에만 연상 이미지(니모닉)를 표시 — 정답 힌트가 되지 않도록 함.
    const mnemonicHtml = (isVocab && q.extra?.imageKey)
      ? `<div class="mnemonic">${mnemonicSvg(q.extra.imageKey, q.extra.word)}` +
        `<div class="m-text">${escape(q.extra.mnemonicText || '')}</div></div>`
      : '';

    // 단어 문제 — 선택 후 단어 발음 듣기 버튼 표시.
    const wordTtsHtml = (isVocab && q.extra?.word)
      ? `<button class="btn tts-btn small" id="ttsWordResult"
                 aria-label="단어 발음 듣기" title="단어 발음 듣기"
                 style="margin-top:6px">🔊 단어 듣기</button>
         <p class="muted tts-hint" id="ttsHintResult" style="font-size:11px;margin:4px 0 0;min-height:1em"></p>`
      : '';

    result.innerHTML = `
      ${mnemonicHtml}
      <div class="explain">
        <h3>${correct ? '✅ 정답입니다' : '❌ 오답입니다'}</h3>
        <p>${escape(q.explanation).replace(/\n/g, '<br>')}</p>
        ${wordTtsHtml}
        ${q.extra?.similarGrammarIds?.length
          ? `<p class="muted">비슷한 문법: ${q.extra.similarGrammarIds.join(', ')} (문법비교 탭에서 학습 가능)</p>`
          : ''}
      </div>
    `;
    if (isVocab && q.extra?.word) {
      const btn = result.querySelector('#ttsWordResult');
      const hint = result.querySelector('#ttsHintResult');
      btn.addEventListener('click', async () => {
        const r = await speak(q.extra.word);
        handleTtsResult(r, hint);
      });
    }

    // 영속화
    recordResult(item.itemId, item.itemType, correct);
    recordSessionItem(item.itemType, item.itemId, correct);
    // 실제로 답을 제출했을 때만 학습 기록을 인정한다 (단순 화면 진입은 무시).
    // markStudiedToday 자체가 같은 날 호출 시 idempotent.
    markStudiedToday();

    // 호출자에게 이번 답 결과 알림 (today.js 의 회차별 집계에 사용).
    // 콜백이 던지더라도 본 화면 상태는 망가지지 않도록 try/catch.
    try { cb?.onAnswered?.({ correct, itemType: item.itemType, itemId: item.itemId }); }
    catch (e) { console.warn('onAnswered handler threw', e); }

    if (!correct) showToast('실패 노트에 추가되었습니다');

    const nextBtn = wrap.querySelector('#nextBtn');
    nextBtn.disabled = false;
    nextBtn.focus();
  }

  if (isVocab) {
    wrap.querySelector('#favBtn').addEventListener('click', () => {
      const added = toggleFavorite(item.itemType, item.itemId);
      wrap.querySelector('#favBtn').textContent = added ? '⭐ 저장됨' : '☆ 자주 볼';
      showToast(added ? '자주 볼 단어에 추가' : '자주 볼 단어에서 제거');
    });
  }

  wrap.querySelector('#nextBtn').addEventListener('click', () => {
    stopSpeaking();
    cb?.onNext?.();
  });

  if (isListening) {
    const playBtn = wrap.querySelector('#ttsPlay');
    const toggle = wrap.querySelector('#scriptToggle');
    const hint = wrap.querySelector('#ttsHint');

    // 사전 감지: 화면 렌더 직후 일본어 voice 가용성을 비동기로 확인.
    // 없으면 사용자가 재생 버튼을 누르기 전에 미리 안내 + 스크립트 노출.
    // (남은 한계 — README 와 ttsAvailable 주석 참고: 일부 브라우저는 voices 가
    //  영구적으로 늦게 로드되어 첫 렌더 시점엔 빈 배열을 반환할 수 있다.
    //  이 때는 재생 시점 fallback 으로 다시 안내된다.)
    if (ttsAvailable()) {
      hasJaVoice().then(has => {
        if (!has && state === 'idle') {
          hint.textContent = '일본어 TTS 음성을 찾을 수 없습니다. 스크립트를 표시합니다.';
          const sb = wrap.querySelector('#scriptBox');
          if (sb) sb.hidden = false;
        }
      }).catch(() => {/* swallow — 재생 시점 fallback 으로 처리됨 */});
    }

    playBtn.addEventListener('click', async () => {
      const res = await speak(q.extra.script);
      if (!res.ok) {
        // 일본어 voice 없음 / 미지원 / 합성 실패 → 스크립트 폴백
        const msg = res.reason === 'no-ja-voice'
          ? '일본어 TTS 음성을 찾을 수 없습니다. 스크립트를 표시합니다.'
          : 'TTS를 사용할 수 없습니다. 스크립트를 표시합니다.';
        hint.textContent = msg;
        const sb = wrap.querySelector('#scriptBox');
        if (sb) sb.hidden = false;
      }
    });
    toggle.addEventListener('click', () => {
      const sb = wrap.querySelector('#scriptBox');
      if (!sb) return;
      sb.hidden = !sb.hidden;
    });
  }
}

function handleTtsResult(r, hintEl) {
  if (!hintEl) return;
  if (r && r.ok) { hintEl.textContent = ''; return; }
  const reason = r && r.reason;
  hintEl.textContent =
    reason === 'no-ja-voice' ? '일본어 TTS 음성을 찾을 수 없습니다.' :
    reason === 'unsupported' ? '이 브라우저는 TTS를 지원하지 않습니다.' :
    reason === 'not-allowed' ? '음성 권한이 필요합니다.' :
                                'TTS 를 사용할 수 없습니다.';
}

function labelOf(t) {
  return { vocab:'단어', grammar:'문법', reading:'독해', listening:'청해' }[t] || '';
}

function escape(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
