// 홈 — 깔끔한 시작 화면.
//
// 정보구조 정리 (라운드 8):
//   - 학습 설정 카드는 제거됨 — 톱니바퀴(#settingsBtn) → #settings 화면에서 관리.
//   - 학습량 현황 카드 미노출 정책 유지.
//   - 긴 학습 영역 버튼 나열·콘텐츠 리스트 직접 노출 금지.
//
// 남긴 카드:
//   1. 오늘의 10분 시작 + 진행 표시
//   2. 목표 레벨 + 변경 진입 (설정 화면으로)
//   3. 회화 준비도 요약
//   4. 최근 복습/실패 노트 간단 요약

import { getState } from '../storage.js';
import { helpCard } from '../helpContent.js';
import { getDueCount } from '../srs.js';
import { favoritesList, failureNotesList, todaySessionStats } from '../state.js';
import { navigate } from '../router.js';
import { escape } from '../ui.js';
import { getConversationReadiness } from '../conversationReadiness.js';

export function renderHome({ screen }) {
  document.getElementById('topTitle').textContent = 'JLPT 10분';
  const s = getState();
  const due = getDueCount();
  const favs = favoritesList().length;
  const fails = failureNotesList().length;
  const ts = todaySessionStats();
  const level = s.userProgress.targetLevel || 'N5';
  const streak = s.userProgress.streakDays || 0;
  const progress = ts.total === 0 ? 0 : Math.round(ts.correct / Math.max(ts.total, 1) * 100);

  screen.innerHTML = `
    <section class="card" id="todayCard">
      <h2 style="margin:0 0 4px">오늘의 10분</h2>
      <p class="muted" style="margin:0 0 8px;font-size:12px">
        목표 레벨 <strong>${level}</strong> · 연속 ${streak}일
        <button class="btn ghost" id="changeLevelBtn"
                style="margin-left:6px;padding:2px 8px;font-size:11px">변경</button>
      </p>
      <div class="bar" style="margin:6px 0"><div style="width:${progress}%"></div></div>
      <div class="muted" style="margin-bottom:10px;font-size:12px">
        ${ts.total > 0 ? `오늘 ${ts.total}개 풀이 · 정답 ${ts.correct}` : '아직 오늘 학습을 시작하지 않았어요.'}
        ${ts.completed ? ' · ✅ 완료' : ''}
      </div>
      <button class="btn primary" id="startBtn">시작 →</button>
    </section>

    <section class="card" id="reviewSummaryCard">
      <h2 style="margin:0 0 6px;font-size:14px">복습 / 자주 볼 단어</h2>
      <div class="grid-3">
        <div class="stat"><div class="n">${due}</div><div class="l">오늘 복습</div></div>
        <div class="stat"><div class="n">${fails}</div><div class="l">실패 노트</div></div>
        <div class="stat"><div class="n">${favs}</div><div class="l">자주 볼 단어</div></div>
      </div>
      <button class="btn ghost" id="goReview" style="margin-top:8px">복습 화면으로 →</button>
    </section>

    <section class="card" id="conversationCard">
      <h2 style="margin:0 0 4px;font-size:14px">회화 준비도 <span class="muted" style="font-weight:400;font-size:12px">· ${level}</span></h2>
      <p class="muted" style="margin:0 0 8px;font-size:11px">관련 단어/문법이 채워질수록 준비도가 올라갑니다.</p>
      <div class="progress-list" id="convList">${renderConvList(level)}</div>
    </section>

    <p class="muted" style="text-align:center;margin-top:18px;font-size:11px">
      ${escape('샘플 콘텐츠 기반 MVP — 자세한 출처/라이선스는 LICENSE_NOTES.md')}
    </p>
  `;

  screen.querySelector('#startBtn').addEventListener('click', () => navigate('today'));
  screen.querySelector('#goReview').addEventListener('click', () => navigate('review'));
  screen.querySelector('#changeLevelBtn').addEventListener('click', () => navigate('settings'));
  { const hc = helpCard('home'); if (hc) screen.prepend(hc); }
}

function renderConvList(level) {
  const topics = getConversationReadiness(level);
  if (!topics.length) {
    return `<p class="muted" style="margin:0;font-size:13px">이 레벨엔 아직 회화 주제 데이터가 없습니다.</p>`;
  }
  // 최대 3개만 요약 — 회화 풀 자체가 늘어나도 홈 카드가 길어지지 않게.
  const head = topics.slice(0, 3);
  return head.map(t => {
    const note = t.ready ? '준비 완료' : '학습 필요';
    return `
      <div class="progress-row">
        <div class="progress-head">
          <span class="progress-label">${escape(t.titleKo)}</span>
          <span class="progress-nums">${t.percent}% <span class="muted progress-note">${note}</span></span>
        </div>
        <div class="bar"><div style="width:${t.percent}%"></div></div>
      </div>
    `;
  }).join('');
}
