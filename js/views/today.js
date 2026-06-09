// 오늘의 10분 플로우. 큐를 만들고 questionView 를 항목별로 렌더.
// 완료 화면(showSummary)은 "이번 회차" 기준으로만 집계한다.
//   - todaySessionStats / todayWrongItems 는 같은 날 누적이라 멀티-런 시 섞일 수 있음.
//   - 이번 회차 결과는 모듈 로컬 sessionResults 에 별도로 모은다.
//   - state.sessions[t].items 누적 로그는 그대로 유지 (다른 분석 용도).
import { buildTodayQueue, previewBreakdown } from '../curriculum.js';
import { renderQuestion } from './questionView.js';
import { renderVocabCard } from './vocabCardView.js';
import { completeSessionToday } from '../state.js';
import { navigate } from '../router.js';
import { findItem } from '../questions.js';
import { escape, typeLabel } from '../ui.js';

let queue = [];
let index = 0;
/** @type {Array<{correct:boolean,itemType:string,itemId:string}>} */
let sessionResults = [];

export function renderToday({ screen }) {
  document.getElementById('topTitle').textContent = '오늘의 10분';

  // 화면 진입 = 새 회차 시작. 큐와 회차별 결과 모두 초기화.
  // 실제 학습 기록(markStudiedToday)은 사용자가 첫 답을 제출했을 때만 갱신됨.
  queue = buildTodayQueue();
  index = 0;
  sessionResults = [];
  showIntro(screen);
}

function showIntro(screen) {
  // 미리보기와 실제 학습 구성이 어긋나지 않도록 동일 큐에서 집계한다.
  const b = previewBreakdown(queue);
  screen.innerHTML = `
    <section class="card">
      <h2>오늘의 학습 구성</h2>
      <p class="muted">총 ${b.total}문제 (약 10분)</p>
      <ul class="muted" style="line-height:1.7">
        <li>복습 ${b.review}개</li>
        <li>새 단어 ${b.vocab}개 · 문법 ${b.grammar}개</li>
        <li>독해 ${b.reading}개 · 청해 ${b.listening}개</li>
        ${b.favorite ? `<li>자주 볼 단어 ${b.favorite}개</li>` : ''}
      </ul>
      <button class="btn primary" id="goBtn">시작</button>
    </section>
  `;
  screen.querySelector('#goBtn').addEventListener('click', () => renderCurrent(screen));
}

function renderCurrent(screen) {
  screen.innerHTML = '';
  if (index >= queue.length) {
    showSummary(screen);
    return;
  }
  const item = queue[index];
  // 단어 + 이미지 카드 모드 → vocabCardView. 그 외에는 기존 questionView.
  const isImageVocab = item.itemType === 'vocab' && item.vocabMode === 'image';
  const renderFn = isImageVocab ? renderVocabCard : renderQuestion;
  renderFn(screen, item, {
    headerLabel: `${index + 1} / ${queue.length}`,
    onAnswered: (r) => {
      // 이번 회차에 한해 결과 누적. state.sessions 누적과는 독립.
      sessionResults.push(r);
    },
    onNext: () => {
      index++;
      renderCurrent(screen);
    },
  });
}

function showSummary(screen) {
  completeSessionToday();

  // 이번 회차만 집계 — 같은 날 여러 번 돌려도 이전 회차와 섞이지 않음.
  const total = sessionResults.length;
  const correct = sessionResults.filter(r => r.correct).length;
  const wrong = total - correct;
  const accuracy = total > 0 ? Math.round(correct / total * 100) : 0;

  // 같은 항목을 한 회차에서 두 번 풀 일은 없지만, 안전하게 중복 제거.
  const wrongs = [];
  const seen = new Set();
  for (const r of sessionResults) {
    if (r.correct) continue;
    const key = `${r.itemType}:${r.itemId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    wrongs.push({ itemType: r.itemType, itemId: r.itemId });
  }

  const wrongRowsHtml = wrongs.length === 0
    ? `<div class="empty" style="padding:18px 8px">
         <div class="e-icon">✨</div>
         <div>오답 없이 완주! 잘했어요.</div>
       </div>`
    : `<div class="list">
         ${wrongs.map(w => {
           const it = findItem(w.itemType, w.itemId);
           if (!it) return '';
           const title = titleOf(w.itemType, it);
           const sub = subOf(w.itemType, it);
           return `<div class="row">
             <div class="main">
               <div class="t">
                 <span class="badge bad">${typeLabel(w.itemType)}</span>
                 ${escape(title)}
               </div>
               <div class="s">${escape(sub)}</div>
             </div>
           </div>`;
         }).join('')}
       </div>`;

  screen.innerHTML = `
    <section class="card" style="text-align:center">
      <div style="font-size:42px">🎉</div>
      <h2 style="margin:6px 0 4px">오늘의 10분 완료!</h2>
      <p class="muted" style="margin:0 0 10px">
        총 ${total}문제 ·
        <span style="color:var(--good);font-weight:700">정답 ${correct}</span> ·
        <span style="color:var(--bad);font-weight:700">오답 ${wrong}</span>
      </p>
      <div class="bar" style="margin:0 auto 6px;max-width:240px"><div style="width:${accuracy}%"></div></div>
      <p class="muted" style="margin:0;font-size:12px">정답률 ${accuracy}%</p>
      <p class="muted" style="margin:6px 0 0;font-size:11px">(이번 회차 기준)</p>
    </section>

    <section class="card">
      <h2 style="margin:0 0 10px">오답 항목 ${wrongs.length > 0 ? `<span class="muted" style="font-weight:400;font-size:13px">· ${wrongs.length}개</span>` : ''}</h2>
      ${wrongRowsHtml}
    </section>

    <div class="btn-row">
      <button class="btn" id="reviewBtn">실패 노트로</button>
      <button class="btn primary" id="homeBtn">홈으로</button>
    </div>
  `;
  screen.querySelector('#homeBtn').addEventListener('click', () => navigate('home'));
  screen.querySelector('#reviewBtn').addEventListener('click', () => navigate('review'));
}

// 요약/복습 목록에서 공통으로 쓰는 항목 라벨링.
function titleOf(t, it) {
  if (t === 'vocab')     return `${it.word} (${it.reading})`;
  if (t === 'grammar')   return it.pattern;
  if (t === 'reading')   return it.title;
  if (t === 'listening') return it.scenario;
  return it.id;
}
function subOf(t, it) {
  if (t === 'vocab')     return it.meaningKo;
  if (t === 'grammar')   return it.meaningKo;
  if (t === 'reading')   return (it.passage || '').slice(0, 36) + '…';
  if (t === 'listening') return (it.script  || '').slice(0, 36) + '…';
  return '';
}
