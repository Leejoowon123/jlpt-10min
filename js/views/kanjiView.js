// 한자 학습 카드.
// 흐름:
//   thinking — 큰 한자 + "뜻/읽기 보기" 버튼만. 의미/읽기/예시/니모닉 모두 DOM 부재.
//   revealed — 히라가나·한국어 의미·음/훈독·획수·부수·예시 단어·니모닉·발음 듣기 + 알고있음/다시 볼래요.
// 발음 듣기: 첫 예시 단어 (`exampleWords[0].word`) 를 일본어 TTS 로 재생. 미지원 시 안내.
//
// onAnswered 콜백 없음 — 알고 있음/다시 볼래요는 onKnown/onReview 로 전달.
// 호출자 (study.js) 가 srs.recordResult(id,'kanji', correct) 로 영속화.

import { speak, stopSpeaking } from '../tts.js';
import { escape } from '../ui.js';

/**
 * @param {HTMLElement} root
 * @param {KanjiItem} k
 * @param {{
 *   onNext?: ()=>void,
 *   onKnown?: ()=>void,
 *   onReview?: ()=>void,
 *   headerLabel?: string,
 * }} cb
 */
export function renderKanjiCard(root, k, cb) {
  if (!k) {
    root.innerHTML = `<div class="empty"><div class="e-icon">📭</div>한자를 찾을 수 없습니다.</div>`;
    return;
  }
  let state = 'thinking';

  const wrap = document.createElement('div');
  wrap.className = 'card kanji-card';

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px';
  header.innerHTML = `
    <span class="badge">${k.level} 한자</span>
    <span class="muted">${escape(cb?.headerLabel ?? '')}</span>
  `;
  wrap.appendChild(header);

  // 큰 한자
  const big = document.createElement('div');
  big.className = 'kanji-big';
  big.textContent = k.kanji;
  wrap.appendChild(big);

  // 안내 + "뜻/읽기 보기"
  const prompt = document.createElement('p');
  prompt.className = 'muted kanji-prompt';
  prompt.style.cssText = 'text-align:center;margin:6px 0 12px;font-size:13px';
  prompt.textContent = '히라가나 / 의미 / 음·훈독을 떠올려 보세요.';
  wrap.appendChild(prompt);

  const revealBtn = document.createElement('button');
  revealBtn.className = 'btn primary';
  revealBtn.id = 'revealBtn';
  revealBtn.textContent = '뜻 / 읽기 보기';
  wrap.appendChild(revealBtn);

  // result 영역 — thinking 상태에선 비어 있음.
  const result = document.createElement('div');
  result.id = 'kanjiResult';
  wrap.appendChild(result);

  // 액션 (revealed 후 표시)
  const actions = document.createElement('div');
  actions.id = 'kanjiActions';
  actions.hidden = true;
  actions.className = 'btn-row';
  actions.style.marginTop = '12px';
  actions.innerHTML = `
    <button class="btn danger" id="reviewBtn">🔁 다시 볼래요</button>
    <button class="btn good"   id="knownBtn">✅ 알고 있음</button>
  `;
  wrap.appendChild(actions);

  root.appendChild(wrap);

  // 보기 버튼 → revealed 상태로 전환
  revealBtn.addEventListener('click', () => {
    if (state !== 'thinking') return;
    state = 'revealed';
    revealBtn.hidden = true;
    prompt.hidden = true;

    const exampleHtml = (k.exampleWords || []).map(w =>
      `<li><strong>${escape(w.word)}</strong> <span class="muted">(${escape(w.reading)})</span> — ${escape(w.meaningKo)}</li>`
    ).join('');

    result.innerHTML = `
      <div class="explain">
        <div class="kanji-hira">${escape(k.hiragana)}</div>
        <p class="kanji-meaning">${escape(k.meaningKo)}</p>
        <div class="kanji-meta">
          <span class="muted">음독</span><span>${escape((k.onyomi  || []).join(', ') || '—')}</span>
          <span class="muted">훈독</span><span>${escape((k.kunyomi || []).join(', ') || '—')}</span>
          <span class="muted">획수</span><span>${k.strokeCount}획</span>
          <span class="muted">부수</span><span>${escape(k.radical || '—')}</span>
        </div>
        <p style="margin:8px 0 6px;font-size:13px"><strong>예시 단어</strong></p>
        <ul class="kanji-examples">${exampleHtml || '<li class="muted">예시 단어 없음</li>'}</ul>
        <p class="muted" style="font-size:12px;margin-top:8px">연상: ${escape(k.mnemonicText)}</p>
        <div class="btn-row" style="margin-top:10px">
          <button class="btn tts-btn" id="kanjiTtsBtn"
                  aria-label="예시 단어 발음 듣기" title="예시 단어 발음 듣기">
            🔊 발음 듣기
          </button>
        </div>
        <p class="muted tts-hint" id="kanjiTtsHint" style="font-size:11px;margin-top:4px;min-height:1em"></p>
      </div>
    `;
    actions.hidden = false;

    // TTS — 한자 자체보다 첫 예시 단어를 읽도록 (단어 발음이 학습에 더 유용).
    const ttsBtn  = result.querySelector('#kanjiTtsBtn');
    const ttsHint = result.querySelector('#kanjiTtsHint');
    ttsBtn.addEventListener('click', async () => {
      const text = (k.exampleWords && k.exampleWords[0])
        ? k.exampleWords[0].word
        : k.kanji;
      const r = await speak(text);
      if (r && r.ok) { ttsHint.textContent = ''; return; }
      const reason = r && r.reason;
      ttsHint.textContent =
        reason === 'no-ja-voice' ? '일본어 TTS 음성을 찾을 수 없습니다.' :
        reason === 'unsupported' ? '이 브라우저는 TTS를 지원하지 않습니다.' :
                                    'TTS 를 사용할 수 없습니다.';
    });
  });

  actions.querySelector('#reviewBtn').addEventListener('click', () => {
    stopSpeaking();
    try { cb?.onReview?.(); } catch (e) { console.warn('onReview threw', e); }
    cb?.onNext?.();
  });
  actions.querySelector('#knownBtn').addEventListener('click', () => {
    stopSpeaking();
    try { cb?.onKnown?.(); } catch (e) { console.warn('onKnown threw', e); }
    cb?.onNext?.();
  });
}
