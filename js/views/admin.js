// 관리자 페이지 — route: #admin (일반 메뉴/탭에 노출하지 않음, 이스터에그로만 진입).
//
// 보안: 진입 자체는 "숨김" 일 뿐 권한 보호가 아니다. 실제 권한은
//   (1) 클라이언트: isAdmin() 이 admins/{uid}===true 를 DB 에서 확인,
//   (2) 서버: Realtime Database Rules 가 feedback/userActivity/actionLogs 읽기를 admin 으로 제한.
// 비관리자는 권한 확인 실패 + rules 읽기 차단으로 데이터에 접근할 수 없다.
//
// 이번 라운드는 읽기 전용 — 삭제/차단 기능 없음.

import { getCurrentUser } from '../authService.js';
import { isAdmin, getAdminSummary, ACTIVE_NOW_MS, ACTIVE_RECENT_MS } from '../feedbackService.js';
import { navigate } from '../router.js';
import { showToast, escape } from '../ui.js';

export function renderAdmin({ screen }) {
  if (!screen) return;
  document.getElementById('topTitle') && (document.getElementById('topTitle').textContent = '관리자');

  screen.innerHTML = `
    <section class="card" id="adminPanel">
      <h2 style="margin:0 0 8px;font-size:15px">관리자</h2>
      <p class="muted" id="adminStatus" style="font-size:13px;margin:0">권한 확인 중…</p>
    </section>`;

  const statusEl = screen.querySelector('#adminStatus');

  isAdmin().then((allowed) => {
    if (!allowed) { renderDenied(screen); return; }
    statusEl.textContent = '데이터 불러오는 중…';
    getAdminSummary()
      .then((summary) => renderDashboard(screen, summary))
      .catch(() => {
        statusEl.textContent = '데이터를 불러오지 못했습니다. (rules/네트워크 확인)';
        statusEl.className = 'voice-status-bad';
      });
  }).catch(() => renderDenied(screen));
}

function renderDenied(screen) {
  screen.innerHTML = `
    <section class="card" style="max-width:420px;margin:10vh auto 0;text-align:center">
      <h2 style="margin:0 0 8px;font-size:15px">접근 권한이 없습니다</h2>
      <p class="muted" id="adminDenied" style="font-size:13px;margin:0 0 12px">
        이 페이지는 관리자만 이용할 수 있습니다.
      </p>
      <button class="btn primary" id="adminHomeBtn" type="button">홈으로</button>
    </section>`;
  screen.querySelector('#adminHomeBtn').addEventListener('click', () => navigate('home'));
}

function fmtTime(ms) {
  if (!ms) return '-';
  try { return new Date(ms).toISOString().slice(0, 16).replace('T', ' '); }
  catch { return '-'; }
}

function fmtDate(ms) {
  if (!ms) return '-';
  try { return new Date(ms).toISOString().slice(0, 10); }
  catch { return '-'; }
}

/** 누적 이용시간(근사) — 분 단위. */
function fmtDuration(ms) {
  if (!ms || ms < 0) return '0분';
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min}분`;
  const h = Math.floor(min / 60);
  return `${h}시간 ${min % 60}분`;
}

/** lastSeenAt 기준 활동 상태(실시간 presence 저장 없이 계산). */
function activityStatus(lastSeenAt) {
  const gap = Date.now() - (lastSeenAt || 0);
  if (lastSeenAt && gap <= ACTIVE_NOW_MS) return { label: '활동중', cls: 'good' };
  if (lastSeenAt && gap <= ACTIVE_RECENT_MS) return { label: '최근 활동', cls: '' };
  return { label: '비활동', cls: '' };
}

function renderDashboard(screen, s) {
  const u = getCurrentUser();
  const rows = (s.activities || []).slice(0, 100).map(a => {
    const st = activityStatus(a.lastSeenAt);
    return `
    <tr>
      <td style="font-family:monospace;font-size:11px">${escape(a.uid)}</td>
      <td style="font-size:11px;white-space:nowrap">${fmtDate(a.createdAt || a.firstSeenAt)}</td>
      <td style="font-size:11px;white-space:nowrap">${fmtTime(a.lastSeenAt)}</td>
      <td><span class="badge ${st.cls}">${st.label}</span></td>
      <td style="font-size:11px;text-align:right">${a.sessionCount || 0}</td>
      <td style="font-size:11px;white-space:nowrap">${fmtDuration(a.totalActiveMs)}</td>
      <td style="font-size:11px">${escape(a.lastEventType || '-')}</td>
      <td style="font-size:10px">${escape(a.platform || '')}${a.appVersion ? ' · ' + escape(a.appVersion) : ''}</td>
      <td><button class="btn copy-uid" data-uid="${escape(a.uid)}" type="button" style="font-size:10px;padding:2px 6px">복사</button></td>
    </tr>`;
  }).join('');

  const fbCards = (s.feedback || []).map(f => `
    <div class="card" style="margin:6px 0;padding:8px">
      <div style="font-size:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <span class="badge ${f.rating >= 4 ? 'good' : f.rating <= 2 && f.rating ? 'bad' : ''}">만족도 ${f.rating ? f.rating + '/5' : '-'}</span>
        <span class="muted" style="font-size:11px">${escape(f.platform || '')} · ${escape(f.appVersion || '')} · ${fmtTime(f.createdAt)}</span>
        ${f.contactOk ? '<span class="badge">연락가능</span>' : ''}
      </div>
      ${f.good ? `<p style="margin:6px 0 0;font-size:12px"><b>좋은 점</b> ${escape(f.good)}</p>` : ''}
      ${f.bad ? `<p style="margin:4px 0 0;font-size:12px"><b>불편한 점</b> ${escape(f.bad)}</p>` : ''}
      ${f.wish ? `<p style="margin:4px 0 0;font-size:12px"><b>추가 희망</b> ${escape(f.wish)}</p>` : ''}
      ${f.bug ? `<p style="margin:4px 0 0;font-size:12px"><b>오류 제보</b> ${escape(f.bug)}</p>` : ''}
      <p class="muted" style="margin:4px 0 0;font-size:10px;font-family:monospace">uid ${escape(f.uid || '-')}</p>
    </div>`).join('') || '<p class="muted" style="font-size:12px;margin:6px 0 0">피드백이 아직 없습니다.</p>';

  screen.innerHTML = `
    <section class="card" id="adminPanel">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <h2 style="margin:0;font-size:15px;flex:1">관리자 대시보드</h2>
        <button class="btn" id="adminHomeBtn" type="button" style="font-size:12px;padding:4px 10px">홈으로</button>
      </div>
      <p class="muted" style="margin:6px 0 0;font-size:11px">읽기 전용 · 본인 ${escape(u?.email || u?.uid || '')} · 상세 행동 로그(actionLogs)는 저장하지 않음</p>
      <div style="display:flex;gap:8px;margin:10px 0;flex-wrap:wrap">
        <div class="card" style="flex:1;min-width:90px;padding:10px;text-align:center">
          <div style="font-size:22px;font-weight:800" id="adminUserCount">${s.userCount}</div>
          <div class="muted" style="font-size:11px">총 사용자</div>
        </div>
        <div class="card" style="flex:1;min-width:90px;padding:10px;text-align:center">
          <div style="font-size:22px;font-weight:800" id="adminActiveNow">${s.activeNowCount}</div>
          <div class="muted" style="font-size:11px">활동중(5분)</div>
        </div>
        <div class="card" style="flex:1;min-width:90px;padding:10px;text-align:center">
          <div style="font-size:22px;font-weight:800" id="adminActive24h">${s.active24hCount}</div>
          <div class="muted" style="font-size:11px">최근 24시간</div>
        </div>
        <div class="card" style="flex:1;min-width:90px;padding:10px;text-align:center">
          <div style="font-size:22px;font-weight:800" id="adminActive7d">${s.active7dCount}</div>
          <div class="muted" style="font-size:11px">최근 7일</div>
        </div>
        <div class="card" style="flex:1;min-width:90px;padding:10px;text-align:center">
          <div style="font-size:22px;font-weight:800" id="adminFbCount">${(s.feedback || []).length}</div>
          <div class="muted" style="font-size:11px">피드백</div>
        </div>
      </div>

      <h3 style="margin:12px 0 4px;font-size:13px">사용자 활동 (userActivity)</h3>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse" id="adminActivityTable">
          <thead><tr style="text-align:left">
            <th style="font-size:11px">uid</th><th style="font-size:11px">가입일</th><th style="font-size:11px">최근 접속</th>
            <th style="font-size:11px">상태</th><th style="font-size:11px">세션</th><th style="font-size:11px">이용시간</th>
            <th style="font-size:11px">최근 이벤트</th><th style="font-size:11px">플랫폼</th><th></th>
          </tr></thead>
          <tbody>${rows || '<tr><td colspan="9" class="muted" style="font-size:12px">활동 기록 없음</td></tr>'}</tbody>
        </table>
      </div>
      <p class="muted" style="margin:4px 0 0;font-size:10px">이용시간은 30분 무활동을 세션 경계로 본 근사값(heartbeat/presence 미사용)</p>

      <h3 style="margin:12px 0 4px;font-size:13px">피드백 (feedback)</h3>
      <div id="adminFeedbackList">${fbCards}</div>
    </section>`;

  screen.querySelector('#adminHomeBtn').addEventListener('click', () => navigate('home'));
  screen.querySelectorAll('.copy-uid').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid || '';
      try { navigator.clipboard?.writeText(uid); } catch { /* clipboard 불가 */ }
      showToast('uid 복사됨');
    });
  });
}
