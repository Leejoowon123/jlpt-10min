// 복습 탭: 실패 노트 / 자주 볼 단어 / 오늘 due
// 각 모드는 표시할 정보가 다르므로 모드별로 row 빌더를 분리한다.
import { failureNotesList, favoritesList, removeFailureNote } from '../state.js';
import { getDueItems } from '../srs.js';
import { findItem } from '../questions.js';
import { renderQuestion } from './questionView.js';
import { escape, showToast, typeLabel } from '../ui.js';
import { renderJa } from '../furigana.js';

let mode = 'failure'; // failure | favorite | due
let active = null;    // { type, id } when answering

export function renderReview({ screen }) {
  document.getElementById('topTitle').textContent = '복습';
  draw(screen);
}

function draw(screen) {
  if (active) return drawQuestion(screen);

  screen.innerHTML = '';
  const tabs = document.createElement('div');
  tabs.className = 'filters';
  [
    ['failure','실패 노트'],
    ['favorite','자주 볼 단어'],
    ['due','오늘 복습'],
  ].forEach(([k, l]) => {
    const b = document.createElement('button');
    b.className = 'chip' + (mode === k ? ' active' : '');
    b.textContent = l;
    b.onclick = () => { mode = k; draw(screen); };
    tabs.appendChild(b);
  });
  screen.appendChild(tabs);

  const list = document.createElement('div');
  list.className = 'list';
  const items = collect(mode);
  if (!items.length) {
    list.innerHTML = `<div class="empty"><div class="e-icon">✅</div>${emptyLabel()}</div>`;
  } else {
    items.forEach(meta => {
      const row = buildRow(mode, meta);
      if (row) list.appendChild(row);
    });
  }
  screen.appendChild(list);
}

function emptyLabel() {
  if (mode === 'failure') return '실패 노트가 비어있어요. 잘 하고 있어요!';
  if (mode === 'favorite') return '자주 볼 단어가 없습니다. 단어 학습 중 ⭐로 추가하세요.';
  return '오늘 복습할 항목이 없습니다.';
}

function collect(m) {
  if (m === 'failure') {
    return failureNotesList().map(n => ({
      itemType: n.itemType, itemId: n.itemId,
      wrongCount: n.wrongCount,
    }));
  }
  if (m === 'favorite') {
    // state.favoritesList 가 이미 vocab 만 필터링.
    return favoritesList().map(f => ({
      itemType: f.itemType, itemId: f.itemId,
    }));
  }
  // due — dueAt/correctCount/wrongCount 그대로 노출
  return getDueItems().map(d => ({
    itemType: d.itemType, itemId: d.itemId,
    dueAt: d.dueAt,
    correctCount: d.correctCount,
    wrongCount: d.wrongCount,
  }));
}

function buildRow(m, meta) {
  const screen = document.getElementById('screen');
  const it = findItem(meta.itemType, meta.itemId);
  if (!it) return null; // 데이터에서 사라진 항목 (구버전 잔재)

  const row = document.createElement('div');
  row.className = 'row';

  let titleHtml = '', subHtml = '';

  if (m === 'failure') {
    titleHtml = `<span class="badge bad">${typeLabel(meta.itemType)}</span> ${escape(headlineOf(meta.itemType, it))}`;
    subHtml = `${escape(detailOf(meta.itemType, it))} · ${meta.wrongCount}회 오답`;
  } else if (m === 'favorite') {
    // 단어만 도착 — word / reading / 뜻 / 예문 (예문은 후리가나 렌더)
    titleHtml = `<span class="badge">단어</span> ${escape(it.word)} <span class="muted">(${escape(it.reading)})</span>`;
    subHtml = `${escape(it.meaningKo)}<br><span class="muted">예: ${renderJa(it.exampleSentence, it.exampleReadings || [])}</span>`;
  } else {
    // due
    const overdueLabel = dueLabel(meta.dueAt);
    titleHtml = `<span class="badge">${typeLabel(meta.itemType)}</span> ${escape(headlineOf(meta.itemType, it))}`;
    subHtml = `정답 ${meta.correctCount} · 오답 ${meta.wrongCount} · <span class="badge ${overdueLabel.cls}">${overdueLabel.text}</span>`;
  }

  row.innerHTML = `
    <div class="main">
      <div class="t">${titleHtml}</div>
      <div class="s">${subHtml}</div>
    </div>
    <div class="actions">
      <button class="icon-btn" data-act="solve" title="문제 풀이">▶</button>
      ${m === 'failure' ? `<button class="icon-btn" data-act="remove" title="실패노트에서 제거">✓</button>` : ''}
    </div>
  `;

  row.querySelector('[data-act="solve"]').addEventListener('click', () => {
    active = { type: meta.itemType, id: meta.itemId };
    drawQuestion(screen);
  });
  const rm = row.querySelector('[data-act="remove"]');
  if (rm) rm.addEventListener('click', () => {
    removeFailureNote(meta.itemId);
    showToast('실패 노트에서 제거');
    draw(screen);
  });
  return row;
}

function headlineOf(t, it) {
  if (t === 'vocab')     return `${it.word} (${it.reading})`;
  if (t === 'grammar')   return it.pattern;
  if (t === 'reading')   return it.title;
  if (t === 'listening') return it.scenario;
  return it.id;
}
function detailOf(t, it) {
  if (t === 'vocab')     return it.meaningKo;
  if (t === 'grammar')   return it.meaningKo;
  if (t === 'reading')   return (it.passage || '').slice(0, 28) + '…';
  if (t === 'listening') return (it.script  || '').slice(0, 28) + '…';
  return '';
}

// dueAt 과 현재 시각 차이를 사람이 읽기 좋은 라벨로.
function dueLabel(dueAt) {
  const ms = Date.now() - (dueAt || 0);
  const days = Math.floor(ms / 86400000);
  if (days >= 1) return { text: `${days}일 지남`, cls: 'bad' };
  // 같은 날(미만 24시간 지남)이면 "오늘"
  if (ms >= 0)   return { text: '오늘 복습', cls: 'warn' };
  // 미래(아직 due 아님) — getDueItems 는 안 주지만 안전 처리
  return { text: '예정', cls: '' };
}

function drawQuestion(screen) {
  screen.innerHTML = '';
  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.textContent = '← 목록으로';
  back.style.marginBottom = '10px';
  back.onclick = () => { active = null; draw(screen); };
  screen.appendChild(back);
  renderQuestion(screen, { itemType: active.type, itemId: active.id }, {
    onNext: () => { active = null; draw(screen); },
  });
}
