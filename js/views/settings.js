// 설정 화면 — 톱니바퀴 버튼에서 진입.
// 라우트: #settings
//
// 항목:
//   - 후리가나 표시 ON/OFF
//   - 이미지 카드 단계형 학습 ON/OFF
//   - 회상 시간 3 / 5 / 7 초
//   - 목표 레벨 N5 / N4 / N3 / N2
//
// 데이터 초기화 같은 위험한 액션은 이번 버전에 포함하지 않는다.

import { getState } from '../storage.js';
import { getVoiceStatus, refreshVoices, onVoiceStatusChange, ttsAvailable } from '../tts.js';
import { getHelpEnabled, setHelpEnabled } from '../state.js';
import {
  getFuriganaEnabled, setFuriganaEnabled,
  getVocabWarmupEnabled, setVocabWarmupEnabled,
  getVocabRecallSeconds, setVocabRecallSeconds,
  getStoryRomajiEnabled, setStoryRomajiEnabled,
  getStoryTranslationEnabled, setStoryTranslationEnabled,
  getThemeMode, setThemeMode,
  setLevel,
} from '../state.js';
import { applyTheme } from '../theme.js';
import { showToast, renderLevelPill, escape } from '../ui.js';
import {
  authAvailable, initAuth, getCurrentUser,
  signInWithEmail, signUpWithEmail, logout,
} from '../authService.js';
import { logAction } from '../actionLogger.js';
import { getInitStatus } from '../firebaseClient.js';

const LEVELS = ['N5', 'N4', 'N3', 'N2'];
const THEME_OPTIONS = [['system', '시스템'], ['light', '라이트'], ['dark', '다크']];

export function renderSettings({ screen }) {
  document.getElementById('topTitle').textContent = '설정';
  draw(screen);
}

function draw(screen) {
  const level   = getState().userProgress.targetLevel || 'N5';
  const furi    = getFuriganaEnabled();
  const warmup  = getVocabWarmupEnabled();
  const recall  = getVocabRecallSeconds();
  const romaji  = getStoryRomajiEnabled();
  const koLine  = getStoryTranslationEnabled();
  const theme   = getThemeMode();

  screen.innerHTML = `
    <section class="card" id="settingsPanel">
      <h2 style="margin:0 0 10px;font-size:15px">설정</h2>

      <label class="settings-row" style="display:flex;align-items:center;gap:10px;margin:6px 0;flex-wrap:wrap;cursor:pointer">
        <input type="checkbox" id="furiToggle" ${furi ? 'checked' : ''} style="margin:0">
        <span style="flex:1;font-size:13px">후리가나 표시</span>
        <span class="muted" style="font-size:11px">한자 위 읽기 보조</span>
      </label>

      <label class="settings-row" style="display:flex;align-items:center;gap:10px;margin:6px 0;flex-wrap:wrap;cursor:pointer">
        <input type="checkbox" id="warmupToggle" ${warmup ? 'checked' : ''} style="margin:0">
        <span style="flex:1;font-size:13px">이미지 카드 단계형 학습</span>
        <span class="muted" style="font-size:11px">노출 → 회상 → 확인 → 퀴즈</span>
      </label>

      <div class="settings-row" style="display:flex;align-items:center;gap:10px;margin:8px 0;flex-wrap:wrap">
        <span style="flex:0 0 auto;font-size:13px">회상 시간</span>
        <div id="recallSeg" class="filters" style="margin:0;flex:1 1 auto">
          ${[3, 5, 7].map(n => `
            <button class="chip${recall === n ? ' active' : ''}" data-recall="${n}" type="button">${n}초</button>
          `).join('')}
        </div>
      </div>

      <div class="settings-row" style="display:flex;align-items:center;gap:10px;margin:8px 0;flex-wrap:wrap">
        <span style="flex:0 0 auto;font-size:13px">목표 레벨</span>
        <div id="levelSeg" class="filters" style="margin:0;flex:1 1 auto">
          ${LEVELS.map(L => `
            <button class="chip${level === L ? ' active' : ''}" data-level="${L}" type="button">${L}</button>
          `).join('')}
        </div>
      </div>

      <label class="settings-row" style="display:flex;align-items:center;gap:10px;margin:6px 0;flex-wrap:wrap;cursor:pointer">
        <input type="checkbox" id="romajiToggle" ${romaji ? 'checked' : ''} style="margin:0">
        <span style="flex:1;font-size:13px">이야기 로마자 표시</span>
        <span class="muted" style="font-size:11px">문장 아래 발음 줄</span>
      </label>

      <label class="settings-row" style="display:flex;align-items:center;gap:10px;margin:6px 0;flex-wrap:wrap;cursor:pointer">
        <input type="checkbox" id="translationToggle" ${koLine ? 'checked' : ''} style="margin:0">
        <span style="flex:1;font-size:13px">이야기 해석 표시</span>
        <span class="muted" style="font-size:11px">문장 아래 한국어 줄</span>
      </label>

      <div class="settings-row" style="display:flex;align-items:center;gap:10px;margin:8px 0;flex-wrap:wrap">
        <span style="flex:0 0 auto;font-size:13px">테마</span>
        <div id="themeSeg" class="filters" style="margin:0;flex:1 1 auto">
          ${THEME_OPTIONS.map(([k, label]) => `
            <button class="chip${theme === k ? ' active' : ''}" data-theme-mode="${k}" type="button">${label}</button>
          `).join('')}
        </div>
      </div>

      <label class="settings-row" style="display:flex;align-items:center;gap:10px;margin:6px 0;flex-wrap:wrap;cursor:pointer">
        <input type="checkbox" id="helpToggle" ${getHelpEnabled() ? 'checked' : ''} style="margin:0">
        <span style="flex:1;font-size:13px">사용 매뉴얼 표시</span>
        <span class="muted" style="font-size:11px">화면별 도움말 카드</span>
      </label>

      <div class="settings-row" id="voiceStatusSection" style="margin:10px 0 0;padding-top:8px;border-top:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span style="flex:0 0 auto;font-size:13px">음성 상태</span>
          <span id="voiceStatusText" class="muted" style="flex:1;font-size:12px">확인 중…</span>
          <button class="btn" id="voiceRefreshBtn" type="button" style="font-size:12px;padding:4px 10px">음성 다시 감지</button>
        </div>
        <p class="muted" id="voiceStatusHint" style="margin:6px 0 0;font-size:11px;display:none">
          브라우저가 설치된 일본어 음성을 늦게 불러올 수 있습니다.
          「음성 다시 감지」를 눌러보세요. 계속 안 되면 Chrome/Edge/Safari 의 음성 설정을 확인하세요.
          (재생이 안 되는 경우는 음성 없음과 달리, 브라우저의 자동 재생 정책 때문일 수 있습니다 —
          화면을 한 번 탭한 뒤 다시 시도하세요.)
        </p>
      </div>

      <p class="muted" style="margin:10px 0 0;font-size:11px">
        설정은 자동 저장됩니다 · 데이터 초기화는 추후 별도 화면에서 제공 예정
      </p>
    </section>

    <section class="card" id="accountSection">
      <h2 style="margin:0 0 8px;font-size:14px">계정</h2>
      <div id="accountBody"></div>
      <p class="muted" style="margin:8px 0 0;font-size:11px">
        로그인 없이도 모든 기능을 사용할 수 있습니다 ·
        비밀번호는 저장하지 않으며, 로그인 시 최소 행동 로그만 기록됩니다
      </p>
    </section>
  `;

  drawAccount(screen);

  // ── handlers ──
  screen.querySelector('#furiToggle').addEventListener('change', (e) => {
    const v = setFuriganaEnabled(e.target.checked);
    showToast(v ? '후리가나 표시 ON' : '후리가나 표시 OFF');
  });
  screen.querySelector('#warmupToggle').addEventListener('change', (e) => {
    const v = setVocabWarmupEnabled(e.target.checked);
    showToast(v ? '단계형 학습 ON' : '단계형 학습 OFF');
  });
  screen.querySelector('#romajiToggle').addEventListener('change', (e) => {
    const v = setStoryRomajiEnabled(e.target.checked);
    showToast(v ? '로마자 표시 ON' : '로마자 표시 OFF');
  });
  screen.querySelector('#helpToggle').addEventListener('change', (e) => {
    const v = setHelpEnabled(e.target.checked);
    showToast(v ? '사용 매뉴얼 ON' : '사용 매뉴얼 OFF');
  });

  // ── 음성 상태 (라운드 30) ──
  const vsText = screen.querySelector('#voiceStatusText');
  const vsHint = screen.querySelector('#voiceStatusHint');
  function paintVoiceStatus(st) {
    const map = {
      'ja-found':    ['일본어 음성 감지됨 ✓', 'voice-status-ok', false],
      'no-ja':       ['일본어 음성 없음', 'voice-status-bad', true],
      'detecting':   ['감지 중…', 'voice-status-wait', false],
      'unsupported': ['브라우저 미지원', 'voice-status-bad', true],
    };
    const [label, cls, showHint] = map[st] || map['detecting'];
    vsText.textContent = label;
    vsText.className = cls;
    vsHint.style.display = showHint ? '' : 'none';
  }
  paintVoiceStatus(getVoiceStatus());
  const unsubVoice = onVoiceStatusChange(paintVoiceStatus);
  screen.querySelector('#voiceRefreshBtn').addEventListener('click', async () => {
    paintVoiceStatus('detecting');
    const st = await refreshVoices();
    paintVoiceStatus(st);
    showToast(st === 'ja-found' ? '일본어 음성을 찾았습니다' : '음성 감지를 다시 시도했습니다');
  });

  screen.querySelector('#translationToggle').addEventListener('change', (e) => {
    const v = setStoryTranslationEnabled(e.target.checked);
    showToast(v ? '해석 표시 ON' : '해석 표시 OFF');
  });
  screen.querySelectorAll('#themeSeg [data-theme-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = setThemeMode(btn.dataset.themeMode);
      applyTheme(mode);                       // 즉시 반영
      screen.querySelectorAll('#themeSeg [data-theme-mode]').forEach(b => {
        b.classList.toggle('active', b.dataset.themeMode === mode);
      });
      showToast(`테마: ${mode === 'system' ? '시스템' : mode === 'light' ? '라이트' : '다크'}`);
    });
  });
  screen.querySelectorAll('#recallSeg [data-recall]').forEach(btn => {
    btn.addEventListener('click', () => {
      const n = parseInt(btn.dataset.recall, 10);
      const applied = setVocabRecallSeconds(n);
      screen.querySelectorAll('#recallSeg [data-recall]').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.recall, 10) === applied);
      });
      showToast(`회상 시간 ${applied}초`);
    });
  });
  screen.querySelectorAll('#levelSeg [data-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      const L = btn.dataset.level;
      setLevel(L);
      screen.querySelectorAll('#levelSeg [data-level]').forEach(b => {
        b.classList.toggle('active', b.dataset.level === L);
      });
      // 상단 레벨 핀 갱신
      try { renderLevelPill(); } catch (_) {}
      showToast(`목표 레벨 ${L}`);
    });
  });
}

// ── 계정 섹션 ──────────────────────────────────────────────────────────────

/** Firebase 연결 상태 배지 HTML — 미설정/연결 준비됨/초기화 실패/로그인됨/비로그인. */
function statusBadgeHtml() {
  if (!authAvailable()) {
    return `<span class="badge" id="fbStatusBadge" data-status="unconfigured">Firebase 미설정</span>`;
  }
  const user = getCurrentUser();
  if (user) {
    return `<span class="badge good" id="fbStatusBadge" data-status="signed-in">로그인됨</span>`;
  }
  const init = getInitStatus();
  if (init === 'failed') {
    return `<span class="badge bad" id="fbStatusBadge" data-status="init-failed">Firebase 초기화 실패</span>`;
  }
  if (init === 'ok') {
    return `<span class="badge good" id="fbStatusBadge" data-status="ready">Firebase 연결 준비됨 · 비로그인</span>`;
  }
  return `<span class="badge" id="fbStatusBadge" data-status="checking">연결 확인 중 · 비로그인</span>`;
}

// (라운드 21) "로그 테스트" 버튼은 main 배포 전 제거됨 — 연결 검증은
// docs/firebase-logging.md 의 수동 QA 절차 + qa mock 테스트로 수행한다.

function drawAccount(screen) {
  const body = screen.querySelector('#accountBody');
  if (!body) return;

  if (!authAvailable()) {
    body.innerHTML = `
      <p style="margin:0 0 6px">${statusBadgeHtml()}</p>
      <p class="muted" style="margin:0;font-size:12px">
        Firebase 가 설정되지 않아 계정 기능이 비활성 상태입니다.
        (js/firebaseConfig.js 에 config 입력 시 활성화)
      </p>`;
    return;
  }

  // 인증 상태 감시 시작 (lazy — 계정 섹션 진입 시 1회).
  // 초기화 완료 후 상태 배지만 갱신 (성공/실패 반영).
  initAuth().then(() => {
    const badge = screen.querySelector('#fbStatusBadge');
    if (badge && badge.dataset.status === 'checking') {
      const wrap = badge.parentElement;
      if (wrap) wrap.innerHTML = statusBadgeHtml();
    }
  }).catch(() => {});

  const user = getCurrentUser();
  if (user) {
    body.innerHTML = `
      <p style="margin:0 0 8px;font-size:13px">
        ${statusBadgeHtml()}
        <span id="accountEmail" style="margin-left:6px">${escape(user.email || user.uid)}</span>
      </p>
      <button class="btn" id="logoutBtn">로그아웃</button>
    `;
    body.querySelector('#logoutBtn').addEventListener('click', async () => {
      await logout();
      logAction('logout');
      showToast('로그아웃되었습니다');
      drawAccount(screen);
    });
    return;
  }

  body.innerHTML = `
    <p style="margin:0 0 8px">${statusBadgeHtml()}</p>
    <div style="display:flex;flex-direction:column;gap:8px">
      <input class="search-input" id="authEmail" type="email"
             placeholder="이메일" autocomplete="email">
      <input class="search-input" id="authPassword" type="password"
             placeholder="비밀번호 (6자 이상)" autocomplete="current-password">
      <p class="muted" id="authError" style="margin:0;font-size:12px;min-height:1em;color:var(--bad)"></p>
      <div class="btn-row">
        <button class="btn primary" id="loginBtn">로그인</button>
        <button class="btn" id="signupBtn">회원가입</button>
      </div>
    </div>
  `;
  const emailEl = body.querySelector('#authEmail');
  const pwEl    = body.querySelector('#authPassword');
  const errEl   = body.querySelector('#authError');

  async function handle(action) {
    errEl.textContent = '';
    const email = emailEl.value.trim();
    const pw = pwEl.value;
    if (!email || !pw) { errEl.textContent = '이메일과 비밀번호를 입력해 주세요.'; return; }
    const r = action === 'signup'
      ? await signUpWithEmail(email, pw)
      : await signInWithEmail(email, pw);
    if (r.ok) {
      pwEl.value = '';                     // 비밀번호는 즉시 제거 — 저장 금지
      logAction('login_success');
      showToast(action === 'signup' ? '가입 완료 — 로그인되었습니다' : '로그인되었습니다');
      drawAccount(screen);
    } else {
      errEl.textContent = r.error;
    }
  }
  body.querySelector('#loginBtn').addEventListener('click', () => handle('login'));
  body.querySelector('#signupBtn').addEventListener('click', () => handle('signup'));
}
