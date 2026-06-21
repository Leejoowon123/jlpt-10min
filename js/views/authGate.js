// 인증 게이트 화면 (라운드 50) — 로그인 필수.
// 비로그인 시 이 화면만 노출. 로그인/회원가입 성공 → authService notify → app.js 가 의도 route 로 복귀.
//
// 보안:
//   - 비밀번호는 성공/실패 후 입력값을 비운다. localStorage/로그 저장 없음.
//   - Firebase 미설정/초기화 실패 시 안내만 표시(앱 크래시 없음).
//   - 테스트용 로그 전송 버튼 없음. Google/소셜 로그인 없음.

import { authAvailable, signInWithEmail, signUpWithEmail, resetPassword } from '../authService.js';
import { logAction } from '../actionLogger.js';
import { showToast, escape } from '../ui.js';

/** 인증 확인 중 로딩 화면. */
export function renderAuthLoading({ screen }) {
  if (!screen) return;
  screen.innerHTML = `
    <section class="card auth-card" style="max-width:420px;margin:14vh auto 0;text-align:center">
      <div class="auth-brand" style="font-size:28px;font-weight:800;margin-bottom:6px">JLPT 10분</div>
      <p class="muted" id="authLoadingMsg">로그인 상태 확인 중…</p>
    </section>`;
}

function isOffline() {
  try { return typeof navigator !== 'undefined' && navigator.onLine === false; }
  catch { return false; }
}

/** 로그인/회원가입 단일 화면. */
export function renderAuthGate({ screen }) {
  if (!screen) return;

  // Firebase 미설정/초기화 실패 — 안내만(앱 비차단).
  if (!authAvailable()) {
    screen.innerHTML = `
      <section class="card auth-card" style="max-width:420px;margin:12vh auto 0;text-align:center">
        <div class="auth-brand" style="font-size:28px;font-weight:800;margin-bottom:6px">JLPT 10분</div>
        <p style="margin:0 0 8px"><span class="badge" data-status="unconfigured">로그인 불가</span></p>
        <p class="muted" style="font-size:13px;margin:0">
          인증 서비스가 설정되지 않아 로그인할 수 없습니다.<br>
          잠시 후 다시 시도하거나 관리자에게 문의해 주세요.
        </p>
      </section>`;
    return;
  }

  const offlineNote = isOffline()
    ? `<p class="muted" id="authOffline" style="margin:0 0 8px;font-size:12px;color:var(--bad)">오프라인 상태입니다 — 로그인에는 온라인 연결이 필요합니다.</p>`
    : '';

  screen.innerHTML = `
    <section class="card auth-card" style="max-width:420px;margin:10vh auto 0">
      <div class="auth-brand" style="font-size:28px;font-weight:800;text-align:center;margin-bottom:2px">JLPT 10분</div>
      <p class="muted" style="text-align:center;margin:0 0 14px;font-size:13px">
        하루 10분 일본어 학습 · 이메일 로그인 후 이용
      </p>
      ${offlineNote}
      <div style="display:flex;flex-direction:column;gap:8px">
        <input class="search-input" id="authEmail" type="email"
               placeholder="이메일" autocomplete="email" inputmode="email">
        <input class="search-input" id="authPassword" type="password"
               placeholder="비밀번호 (6자 이상)" autocomplete="current-password">
        <p class="muted" id="authError" style="margin:0;font-size:12px;min-height:1em;color:var(--bad)"></p>
        <div class="btn-row">
          <button class="btn primary" id="loginBtn" style="flex:1">로그인</button>
          <button class="btn" id="signupBtn" style="flex:1">회원가입</button>
        </div>
        <button type="button" id="forgotBtn"
                style="background:none;border:0;color:var(--muted);font-size:12px;text-decoration:underline;cursor:pointer;padding:4px;align-self:center">
          비밀번호를 잊으셨나요?
        </button>
      </div>
      <p class="muted" style="margin:14px 0 0;font-size:11px;text-align:center">
        비밀번호는 저장하지 않습니다 · 학습 콘텐츠는 앱에 포함되어 있습니다
      </p>
    </section>`;

  const emailEl = screen.querySelector('#authEmail');
  const pwEl    = screen.querySelector('#authPassword');
  const errEl   = screen.querySelector('#authError');
  const loginBtn = screen.querySelector('#loginBtn');
  const signupBtn = screen.querySelector('#signupBtn');

  async function handle(action) {
    errEl.textContent = '';
    const email = (emailEl.value || '').trim();
    const pw = pwEl.value || '';
    if (!email || !pw) { errEl.textContent = '이메일과 비밀번호를 입력해 주세요.'; return; }
    if (isOffline()) { errEl.textContent = '오프라인 상태입니다 — 온라인 연결 후 다시 시도해 주세요.'; return; }
    loginBtn.disabled = true; signupBtn.disabled = true;
    const r = action === 'signup'
      ? await signUpWithEmail(email, pw)
      : await signInWithEmail(email, pw);
    pwEl.value = '';                          // 비밀번호 즉시 제거 — 저장 금지
    if (r.ok) {
      logAction('login_success');             // 원문/이메일 미기록 (meta allowlist)
      showToast(action === 'signup' ? '가입 완료 — 로그인되었습니다' : '로그인되었습니다');
      // 이후 화면 전환은 authService → observeAuth(app.js) 가 처리(의도 route 복귀).
    } else {
      errEl.textContent = r.error;
      loginBtn.disabled = false; signupBtn.disabled = false;
    }
  }
  loginBtn.addEventListener('click', () => handle('login'));
  signupBtn.addEventListener('click', () => handle('signup'));
  // Enter 키 → 로그인
  pwEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handle('login'); });

  // 비밀번호 재설정 — 이메일로 재설정 메일 발송(로그인 불필요). 이메일/비번 저장·로그 없음.
  const forgotBtn = screen.querySelector('#forgotBtn');
  forgotBtn.addEventListener('click', async () => {
    errEl.textContent = '';
    const email = (emailEl.value || '').trim();
    if (!email) { errEl.textContent = '이메일을 입력해 주세요.'; return; }
    if (isOffline()) { errEl.textContent = '오프라인 상태입니다 — 온라인 연결 후 다시 시도해 주세요.'; return; }
    forgotBtn.disabled = true; loginBtn.disabled = true; signupBtn.disabled = true;
    const r = await resetPassword(email);     // resetPassword 는 actionLogs 를 남기지 않는다
    forgotBtn.disabled = false; loginBtn.disabled = false; signupBtn.disabled = false;
    if (r.ok) { showToast(r.message); }        // 성공/중립 안내(계정 존재 비노출)
    else { errEl.textContent = r.error; }
  });
}
