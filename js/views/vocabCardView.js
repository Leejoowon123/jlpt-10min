// 단어 이미지 카드 — 단계형 학습 플로우.
//
// 단계 (state machine):
//   expose1  — 사진 + 단어 + reading + 뜻 (1회차 노출). 자동 TTS 시도 + 발음 듣기 버튼.
//   expose2  — 사진 + 단어 + reading + 뜻 (2회차 노출). "한 번 더" 라벨.
//   recall   — 사진만. 단어/reading/뜻/예문/연상 모두 DOM 부재. 3초 카운트다운 + "바로 확인".
//   confirm  — 사진 + 단어 + reading + 뜻 + 예문 + 연상. "퀴즈로" 진입 버튼.
//   quiz     — 기존 4지선다. 선택 전 단어/reading/뜻/연상 모두 DOM 부재.
//   answered — 정답/오답 표시 + 단어 라벨 복원 + .explain. recordResult/onAnswered 는 여기서만.
//
// 정책:
//   - expose/recall/confirm 단계에서는 onAnswered, recordResult, markStudiedToday, recordSessionItem
//     모두 호출하지 않음. 학습 기록은 quiz 답변 시점에만.
//   - recall/quiz thinking 단계에서는 target word/reading/meaningKo 가 DOM 텍스트에도 없도록 유지.
//   - 후리가나 토글(renderJa) 은 예문 표시 단계(confirm/answered)에만 영향.
//   - settings.vocabImageWarmupEnabled === false 면 expose1 ~ confirm 을 건너뛰고 곧장 quiz 로.
//
// 호환성:
//   - 시그니처는 그대로: renderVocabCard(root, item, cb).
//   - today.js / study.js 의 onAnswered, onNext 콜백은 변경 없이 동작.

import { vocab } from '../data/vocab.js';
import { mnemonicSvg } from '../mnemonic.js';
import { recordResult } from '../srs.js';
import { toggleFavorite, isFavorite, recordSessionItem, markStudiedToday,
         getVocabWarmupEnabled, getVocabRecallSeconds } from '../state.js';
import { showToast } from '../ui.js';
import { speak, stopSpeaking } from '../tts.js';
import { renderJa } from '../furigana.js';

/** recall 단계 카운트다운 기본 초 — 사용자가 3/5/7 중 선택. 상수는 문서/테스트용. */
export const RECALL_SECONDS = 3;

/** 테스트 전용 — getVocabRecallSeconds() 결과를 무시하고 ms 단위 강제 override.
 *  null 이면 override 비활성. */
let _testRecallMsOverride = null;
export function _setRecallMsForTest(ms) { _testRecallMsOverride = Math.max(0, ms | 0); }
export function _resetRecallMsForTest() { _testRecallMsOverride = null; }

/** 실제 recall 단계가 사용할 ms — 테스트 override 우선, 없으면 state 설정값. */
function resolvedRecallMs() {
  if (_testRecallMsOverride !== null) return _testRecallMsOverride;
  return getVocabRecallSeconds() * 1000;
}

const STEP_LABELS = {
  expose1: '1/5 보기',
  expose2: '2/5 한 번 더',
  recall:  '3/5 떠올리기',
  confirm: '4/5 확인',
  quiz:    '5/5 퀴즈',
};

function findVocab(id) { return vocab.find(v => v.id === id) || null; }

function shuffled(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

function escape(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function handleTtsResult(r, hintEl) {
  if (!hintEl) return;
  if (r && r.ok) { hintEl.textContent = ''; return; }
  const reason = r && r.reason;
  hintEl.textContent =
    reason === 'no-ja-voice' ? '일본어 TTS 음성을 찾을 수 없습니다.' :
    reason === 'unsupported' ? '이 브라우저는 TTS를 지원하지 않습니다.' :
    reason === 'not-allowed' ? '마이크/음성 권한이 필요합니다.' :
                                'TTS 를 사용할 수 없습니다.';
}

/**
 * @param {HTMLElement} root
 * @param {{itemType:'vocab', itemId:string}} item
 * @param {{
 *   onNext?: ()=>void,
 *   onAnswered?: (r:{correct:boolean,itemType:string,itemId:string})=>void,
 *   headerLabel?: string,
 * }} cb
 */
export function renderVocabCard(root, item, cb) {
  const v = findVocab(item.itemId);
  if (!v) {
    root.innerHTML = `<div class="empty"><div class="e-icon">📭</div>단어를 찾을 수 없습니다.</div>`;
    return;
  }

  // 4지선다 — quiz 단계 진입 시 사용.
  const sameLevel = vocab.filter(x => x.level === v.level && x.id !== v.id && x.word !== v.word);
  let pool = shuffled(sameLevel).slice(0, 3);
  if (pool.length < 3) {
    const other = vocab.filter(x => x.id !== v.id && x.word !== v.word && !pool.some(p => p.id === x.id));
    pool = pool.concat(shuffled(other).slice(0, 3 - pool.length));
  }
  const usedWords = new Set([v.word]);
  const distractorWords = [];
  for (const p of pool) {
    if (!usedWords.has(p.word)) { distractorWords.push(p.word); usedWords.add(p.word); }
    if (distractorWords.length === 3) break;
  }
  const choices = shuffled([v.word, ...distractorWords]);
  const answerIndex = choices.indexOf(v.word);

  // 단계 진입점.
  const warmupEnabled = getVocabWarmupEnabled();
  let state = warmupEnabled ? 'expose1' : 'quiz';
  let recallTimer = null;

  // 카드 컨테이너 — paint() 가 매번 wrap.innerHTML 으로 다시 그림.
  const wrap = document.createElement('div');
  wrap.className = 'card vocab-card';
  root.appendChild(wrap);

  paint();

  // ───────────────────────────────────────────────
  function clearRecallTimer() {
    if (recallTimer !== null) {
      clearInterval(recallTimer);
      recallTimer = null;
    }
  }

  function goto(nextState) {
    clearRecallTimer();
    stopSpeaking();
    state = nextState;
    paint();
  }

  function paint() {
    // 매 단계 전환마다 wrap 전체 재구성.
    clearRecallTimer();
    wrap.innerHTML = '';
    const stepLabel = STEP_LABELS[state] || '';
    wrap.appendChild(buildHeader(v.level, cb?.headerLabel, stepLabel));

    if (state === 'expose1' || state === 'expose2') paintExpose();
    else if (state === 'recall')   paintRecall();
    else if (state === 'confirm')  paintConfirm();
    else if (state === 'quiz')     paintQuiz();
    else if (state === 'answered') paintAnswered();
  }

  // ── 노출 1 / 노출 2 ─────────────────────────────
  function paintExpose() {
    appendImage(true);
    appendWordInfo({ withExample: false, withMnemonic: false });
    const ttsHint = appendTtsRow({ withExampleBtn: false });
    appendNavRow([
      ['btn primary', '다음 →', () => goto(state === 'expose1' ? 'expose2' : 'recall')],
    ]);
    // 자동 재생 시도 — 실패해도 무시 (브라우저 정책).
    void tryAutoplay(ttsHint);
  }

  // ── 회상 ─────────────────────────────────────
  function paintRecall() {
    // 이미지 라벨 비움 — 단어 미노출
    appendImage(false);

    const prompt = document.createElement('p');
    prompt.className = 'q-prompt';
    prompt.style.cssText = 'text-align:center;margin:6px 0 10px;font-size:13px';
    prompt.textContent = '이 이미지에 어울리는 단어를 떠올려 보세요.';
    wrap.appendChild(prompt);

    const cd = document.createElement('div');
    cd.id = 'recallCd';
    cd.className = 'muted';
    cd.style.cssText = 'text-align:center;font-size:13px;margin:0 0 6px';
    const ms = resolvedRecallMs();
    const totalSec = Math.max(1, Math.ceil(ms / 1000));
    cd.textContent = `${totalSec}초 후 자동 확인`;
    wrap.appendChild(cd);

    const bar = document.createElement('div');
    bar.className = 'recall-bar';
    bar.style.cssText = 'width:100%;height:4px;background:#eee;border-radius:2px;overflow:hidden;margin-bottom:12px';
    const fill = document.createElement('div');
    fill.id = 'recallFill';
    fill.style.cssText = 'height:100%;width:0%;background:var(--accent,#4a8);transition:width 200ms linear';
    bar.appendChild(fill);
    wrap.appendChild(bar);

    appendNavRow([
      ['btn ghost', '바로 확인 →', () => { clearRecallTimer(); goto('confirm'); }],
    ]);

    // 타이머 — 0 ms 면 즉시 전환 (테스트용 가속화 케이스 안전망).
    if (ms <= 0) {
      goto('confirm');
      return;
    }
    const startMs = Date.now();
    recallTimer = setInterval(() => {
      // 카드 DOM 이 detach 된 상태(다음 카드로 넘어감)면 즉시 정리.
      if (!wrap.isConnected) { clearRecallTimer(); return; }
      const elapsed = Date.now() - startMs;
      const remainMs = Math.max(0, ms - elapsed);
      const remainSec = Math.ceil(remainMs / 1000);
      const pct = Math.min(100, (elapsed / ms) * 100);
      const f = wrap.querySelector('#recallFill');
      const c = wrap.querySelector('#recallCd');
      if (f) f.style.width = pct + '%';
      if (c) c.textContent = remainMs > 0 ? `${remainSec}초 후 자동 확인` : '확인 중...';
      if (remainMs <= 0) {
        clearRecallTimer();
        goto('confirm');
      }
    }, 100);
  }

  // ── 확인 ─────────────────────────────────────
  function paintConfirm() {
    appendImage(true);
    appendWordInfo({ withExample: true, withMnemonic: true });
    appendTtsRow({ withExampleBtn: true });
    appendNavRow([
      ['btn primary', '퀴즈로 →', () => goto('quiz')],
    ]);
  }

  // ── 퀴즈 (기존 thinking) ─────────────────────
  function paintQuiz() {
    appendImage(false);

    const prompt = document.createElement('div');
    prompt.className = 'q-prompt';
    prompt.style.textAlign = 'center';
    prompt.textContent = '이미지와 연결되는 단어를 고르세요.';
    wrap.appendChild(prompt);

    // TTS 발음 듣기 (정답 단어 텍스트는 aria/title 에 미노출 — 기존 정책 유지).
    appendTtsRow({ withExampleBtn: false, exampleHidden: true });

    const choicesEl = document.createElement('div');
    choicesEl.className = 'choices';
    choices.forEach((text, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.innerHTML = `<span class="key">${'ABCD'[idx]}</span><span>${escape(text)}</span>`;
      btn.addEventListener('click', () => onPick(idx));
      choicesEl.appendChild(btn);
    });
    wrap.appendChild(choicesEl);

    // result(.explain) 영역은 비워둠.
    const result = document.createElement('div');
    result.id = 'qResult';
    wrap.appendChild(result);

    appendFavAndNextRow({ nextEnabled: false });
  }

  // ── 답변 ─────────────────────────────────────
  // pickedIdx 는 paintAnswered 에 전달되지 않고, onPick 안에서 자체적으로 처리.
  function paintAnswered() {
    // 사용 안 함 — onPick 이 paintQuiz 의 DOM 을 in-place 로 갱신.
  }

  // ── 헬퍼들 ───────────────────────────────────
  function appendImage(withLabel) {
    const img = document.createElement('div');
    img.id = 'vcImg';
    img.className = 'vocab-card-imgbox';
    img.innerHTML = mnemonicSvg(v.imageKey, withLabel ? v.word : '');
    wrap.appendChild(img);
  }

  function appendWordInfo({ withExample, withMnemonic }) {
    const box = document.createElement('div');
    box.className = 'vocab-info';
    box.style.cssText = 'text-align:center;margin:8px 0';
    let html = `
      <p style="margin:0;font-size:16px"><strong>${escape(v.word)}</strong>
         <span class="muted">(${escape(v.reading)})</span></p>
      <p class="muted" style="margin:4px 0 0;font-size:13px">${escape(v.meaningKo)}</p>
    `;
    if (withExample) {
      html += `
        <p style="margin:8px 0 0;font-size:13px">예문: ${renderJa(v.exampleSentence, v.exampleReadings || [])}</p>
        <p class="muted" style="margin:2px 0 0;font-size:12px">${escape(v.exampleTranslation)}</p>
      `;
    }
    if (withMnemonic) {
      html += `<p class="muted" style="margin:6px 0 0;font-size:12px">연상: ${escape(v.mnemonicText)}</p>`;
    }
    box.innerHTML = html;
    wrap.appendChild(box);
  }

  function appendTtsRow({ withExampleBtn, exampleHidden = false }) {
    const ttsRow = document.createElement('div');
    ttsRow.className = 'tts-row';
    ttsRow.innerHTML = `
      <button class="btn tts-btn" id="ttsWord" aria-label="발음 듣기" title="발음 듣기">
        🔊 발음 듣기
      </button>
      <button class="btn tts-btn" id="ttsExample" aria-label="예문 듣기" title="예문 듣기"
              ${withExampleBtn ? '' : (exampleHidden ? 'hidden' : 'hidden')}>
        🔊 예문 듣기
      </button>
    `;
    wrap.appendChild(ttsRow);

    const ttsHint = document.createElement('p');
    ttsHint.className = 'muted tts-hint';
    ttsHint.style.cssText = 'font-size:11px;margin:4px 0 8px;min-height:1em';
    wrap.appendChild(ttsHint);

    ttsRow.querySelector('#ttsWord').addEventListener('click', async () => {
      const r = await speak(v.word);
      handleTtsResult(r, ttsHint);
    });
    if (withExampleBtn) {
      ttsRow.querySelector('#ttsExample').addEventListener('click', async () => {
        const r = await speak(v.exampleSentence);
        handleTtsResult(r, ttsHint);
      });
    }
    return ttsHint;
  }

  function appendNavRow(buttons) {
    const row = document.createElement('div');
    row.className = 'btn-row';
    row.style.marginTop = '12px';
    for (const [cls, label, onClick] of buttons) {
      const btn = document.createElement('button');
      btn.className = cls;
      btn.textContent = label;
      btn.addEventListener('click', onClick);
      row.appendChild(btn);
    }
    wrap.appendChild(row);
  }

  function appendFavAndNextRow({ nextEnabled }) {
    const actions = document.createElement('div');
    actions.className = 'btn-row';
    actions.style.marginTop = '12px';
    actions.innerHTML = `
      <button class="btn ghost" id="favBtn">${isFavorite(item.itemId) ? '⭐ 저장됨' : '☆ 자주 볼'}</button>
      <button class="btn primary" id="nextBtn" ${nextEnabled ? '' : 'disabled'}>다음 →</button>
    `;
    wrap.appendChild(actions);

    actions.querySelector('#favBtn').addEventListener('click', () => {
      const added = toggleFavorite('vocab', item.itemId);
      actions.querySelector('#favBtn').textContent = added ? '⭐ 저장됨' : '☆ 자주 볼';
      showToast(added ? '자주 볼 단어에 추가' : '자주 볼 단어에서 제거');
    });
    actions.querySelector('#nextBtn').addEventListener('click', () => {
      stopSpeaking();
      clearRecallTimer();
      cb?.onNext?.();
    });
  }

  async function tryAutoplay(ttsHint) {
    try {
      const r = await speak(v.word);
      // 자동 재생 실패는 학습 흐름을 막지 않음 — hint 만 갱신.
      if (r && !r.ok) handleTtsResult(r, ttsHint);
    } catch (_) { /* silent */ }
  }

  // ── 퀴즈 답변 ────────────────────────────────
  function onPick(idx) {
    if (state !== 'quiz') return;
    state = 'answered';
    const correct = idx === answerIndex;

    Array.from(wrap.querySelectorAll('.choice')).forEach((el, i) => {
      el.disabled = true;
      if (i === answerIndex) el.classList.add('correct');
      else if (i === idx) el.classList.add('wrong');
    });

    // 이미지에 단어 라벨 복원
    const imgBox = wrap.querySelector('#vcImg');
    if (imgBox) imgBox.innerHTML = mnemonicSvg(v.imageKey, v.word);

    // 예문 듣기 버튼 노출
    const exBtn = wrap.querySelector('#ttsExample');
    if (exBtn) {
      exBtn.hidden = false;
      exBtn.addEventListener('click', async () => {
        const r = await speak(v.exampleSentence);
        const hint = wrap.querySelector('.tts-hint');
        handleTtsResult(r, hint);
      });
    }

    // .explain 채우기
    const result = wrap.querySelector('#qResult');
    if (result) {
      result.innerHTML = `
        <div class="explain">
          <h3>${correct ? '✅ 정답입니다' : '❌ 오답입니다'}</h3>
          <p><strong>${escape(v.word)}</strong> <span class="muted">(${escape(v.reading)})</span> — ${escape(v.meaningKo)}</p>
          <p>예문: ${renderJa(v.exampleSentence, v.exampleReadings || [])}<br>해석: ${escape(v.exampleTranslation)}</p>
          <p class="muted">연상: ${escape(v.mnemonicText)}</p>
        </div>
      `;
    }

    // 학습 기록 — quiz 답변 시점에만.
    recordResult(item.itemId, 'vocab', correct);
    recordSessionItem('vocab', item.itemId, correct);
    markStudiedToday();
    try { cb?.onAnswered?.({ correct, itemType: 'vocab', itemId: item.itemId }); }
    catch (e) { console.warn('onAnswered threw', e); }

    if (!correct) showToast('실패 노트에 추가되었습니다');

    const nextBtn = wrap.querySelector('#nextBtn');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.focus();
    }
  }
}

function buildHeader(level, headerLabel, stepLabel) {
  const header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:6px;flex-wrap:wrap';
  header.innerHTML = `
    <span class="badge">${level} 단어 카드</span>
    <span class="muted" style="font-size:12px">${stepLabel ? escape(stepLabel) + ' · ' : ''}${escape(headerLabel ?? '')}</span>
  `;
  return header;
}
