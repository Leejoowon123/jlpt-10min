// 비슷한 문법 비교: 페어 → 차이 설명 → 예문 → 선택 문제 → 해설.
import { grammarPairs } from '../data/grammarPairs.js';
import { grammar } from '../data/grammar.js';
import { recordResult } from '../srs.js';
import { recordSessionItem, markStudiedToday } from '../state.js';
import { speak, stopSpeaking } from '../tts.js';
import { renderJa } from '../furigana.js';
import { escape, showToast } from '../ui.js';
import { getState } from '../storage.js';

let activePairId = null;
let pickedIndex = -1;

export function renderCompare({ screen, params }) {
  document.getElementById('topTitle').textContent = '문법 비교';
  activePairId = params[0] || null;
  pickedIndex = -1;
  draw(screen);
}

function draw(screen) {
  if (activePairId) return drawDetail(screen);

  const level = getState().userProgress.targetLevel || 'N5';
  screen.innerHTML = '';

  // 짧은 학습 맥락 (장황한 사용법 설명은 의도적으로 생략)
  const intro = document.createElement('div');
  intro.className = 'card';
  intro.style.padding = '12px 14px';
  intro.innerHTML = `
    <h2 style="margin:0;font-size:14px">비슷한 문법 비교 학습</h2>
    <p class="muted" style="margin:4px 0 0;font-size:12px">두 문법의 차이를 확인하고 문제로 점검합니다.</p>
  `;
  screen.appendChild(intro);

  const filters = document.createElement('div');
  filters.className = 'filters';
  ['ALL','N5','N4','N3','N2'].forEach(L => {
    const b = document.createElement('button');
    b.className = 'chip' + ((window._cmpFilter || 'ALL') === L ? ' active' : '');
    b.textContent = L;
    b.onclick = () => { window._cmpFilter = L; draw(screen); };
    filters.appendChild(b);
  });
  screen.appendChild(filters);

  const cur = window._cmpFilter || 'ALL';
  const list = document.createElement('div');
  list.className = 'list';

  const pairs = grammarPairs.filter(p => cur === 'ALL' ? true : p.level === cur);
  if (!pairs.length) {
    list.innerHTML = `<div class="empty"><div class="e-icon">📭</div>해당 레벨의 비교 콘텐츠가 없습니다.</div>`;
  } else {
    pairs.forEach(p => {
      const a = grammar.find(g => g.id === p.a);
      const b = grammar.find(g => g.id === p.b);
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `
        <div class="main">
          <div class="t">${escape(a?.pattern || p.a)} <span class="muted">vs</span> ${escape(b?.pattern || p.b)}</div>
          <div class="s">${escape(p.level)} · ${escape((a?.meaningKo || '') + ' / ' + (b?.meaningKo || ''))}</div>
        </div>
        <div class="actions"><button class="icon-btn" title="비교 보기">▶</button></div>
      `;
      row.onclick = () => { stopSpeaking(); activePairId = p.id; pickedIndex = -1; draw(screen); };
      list.appendChild(row);
    });
  }
  screen.appendChild(list);
}

function drawDetail(screen) {
  const p = grammarPairs.find(x => x.id === activePairId);
  if (!p) { activePairId = null; return draw(screen); }
  const a = grammar.find(g => g.id === p.a);
  const b = grammar.find(g => g.id === p.b);
  screen.innerHTML = '';

  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.textContent = '← 목록으로';
  back.style.marginBottom = '10px';
  back.onclick = () => { stopSpeaking(); activePairId = null; draw(screen); };
  screen.appendChild(back);

  const card = document.createElement('div');
  card.className = 'card';
  const aJa = a?.examples?.[0]?.ja || '';
  const bJa = b?.examples?.[0]?.ja || '';
  const aReadings = a?.examples?.[0]?.readings || [];
  const bReadings = b?.examples?.[0]?.readings || [];
  card.innerHTML = `
    <p class="muted" style="margin:0 0 6px;font-size:12px">비슷한 문법 비교</p>
    <span class="badge">${p.level}</span>
    <div class="compare-pair" style="margin-top:10px">
      <div class="col">
        <div class="pattern">${escape(a?.pattern || '')}</div>
        <div class="muted">${escape(a?.meaningKo || '')}</div>
        <div style="margin-top:6px;font-size:13px">${renderJa(aJa, aReadings)}</div>
        <div class="muted" style="font-size:12px">${escape(a?.examples?.[0]?.ko || '')}</div>
        ${aJa ? `<button class="btn tts-btn small" data-tts-side="a"
                         aria-label="예문 듣기" title="예문 듣기">🔊 예문 듣기</button>` : ''}
      </div>
      <div class="col">
        <div class="pattern">${escape(b?.pattern || '')}</div>
        <div class="muted">${escape(b?.meaningKo || '')}</div>
        <div style="margin-top:6px;font-size:13px">${renderJa(bJa, bReadings)}</div>
        <div class="muted" style="font-size:12px">${escape(b?.examples?.[0]?.ko || '')}</div>
        ${bJa ? `<button class="btn tts-btn small" data-tts-side="b"
                         aria-label="예문 듣기" title="예문 듣기">🔊 예문 듣기</button>` : ''}
      </div>
    </div>
    <p class="muted tts-hint" id="compareTtsHint" style="font-size:11px;margin:6px 0 0;min-height:1em"></p>
    <div class="explain" style="margin-top:12px">
      <h3>차이점</h3>
      <p>${escape(p.differenceKo)}</p>
    </div>
  `;
  screen.appendChild(card);
  const ttsHint = card.querySelector('#compareTtsHint');
  card.querySelectorAll('[data-tts-side]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const side = btn.dataset.ttsSide;
      const text = side === 'a' ? aJa : bJa;
      if (!text) return;
      const r = await speak(text);
      handleTtsResultLocal(r, ttsHint);
    });
  });

  const qCard = document.createElement('div');
  qCard.className = 'card';
  // 비교 문제 본문은 일본어 문장 일부가 한자를 포함할 수 있어 furigana 적용.
  qCard.innerHTML = `<div class="q-prompt">${renderJa(p.question, p.questionReadings || [])}</div>`;
  const choices = document.createElement('div');
  choices.className = 'choices';
  p.choices.forEach((c, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.innerHTML = `<span class="key">${'ABCD'[idx]}</span><span>${escape(c)}</span>`;
    btn.onclick = () => pick(idx, p, choices, qCard);
    choices.appendChild(btn);
  });
  qCard.appendChild(choices);
  const resBox = document.createElement('div'); resBox.id = 'cmpResult'; qCard.appendChild(resBox);
  screen.appendChild(qCard);
}

function pick(idx, p, choices, qCard) {
  if (pickedIndex !== -1) return;
  pickedIndex = idx;
  const correct = idx === p.answerIndex;
  Array.from(choices.querySelectorAll('.choice')).forEach((el, i) => {
    el.disabled = true;
    if (i === p.answerIndex) el.classList.add('correct');
    else if (i === idx) el.classList.add('wrong');
  });
  const res = qCard.querySelector('#cmpResult');
  res.innerHTML = `
    <div class="explain">
      <h3>${correct ? '✅ 정답' : '❌ 오답'}</h3>
      <p>${escape(p.explanation)}</p>
    </div>
  `;
  // 비교 페어 학습 결과는 두 문법 항목에 모두 기록
  recordResult(p.a, 'grammar', correct);
  recordResult(p.b, 'grammar', correct);
  recordSessionItem('grammar', p.a, correct);
  // 일반 questionView 와 동일하게 답 제출 시점에 학습 기록을 인정한다.
  markStudiedToday();
  if (!correct) showToast('실패 노트에 추가되었습니다');
}

function handleTtsResultLocal(r, hintEl) {
  if (!hintEl) return;
  if (r && r.ok) { hintEl.textContent = ''; return; }
  const reason = r && r.reason;
  hintEl.textContent =
    reason === 'no-ja-voice' ? '일본어 TTS 음성을 찾을 수 없습니다.' :
    reason === 'unsupported' ? '이 브라우저는 TTS를 지원하지 않습니다.' :
                                'TTS 를 사용할 수 없습니다.';
}
