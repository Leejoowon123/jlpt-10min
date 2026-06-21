// 엔트리. 라우터 등록 + 인증 게이트 + 레벨 칩 + 첫 화면.
import { register, start, navigate, setAuthGate, consumePendingRoute } from './router.js';
import { renderHome } from './views/home.js';
import { renderToday } from './views/today.js';
import { renderStudy } from './views/study.js';
import { renderReview } from './views/review.js';
import { renderCompare } from './views/grammarCompare.js';
import { renderConversation } from './views/conversation.js';
import { renderStories, renderNovels, renderStoryDetail } from './views/storyView.js';
import { renderSettings } from './views/settings.js';
import { renderLevelPill } from './ui.js';
import { initTheme } from './theme.js';
import { logAction } from './actionLogger.js';
import { registerServiceWorker } from './pwa.js';
import { initAuth, observeAuth, getCurrentUser } from './authService.js';
import { renderAuthGate, renderAuthLoading } from './views/authGate.js';

// 주요 탭
register('home',         renderHome);
register('study',        renderStudy);
register('review',       renderReview);
register('stories',      renderStories);
register('novels',       renderNovels);

// 보조/하위 라우트
register('today',        renderToday);              // 홈 시작 버튼 → 오늘의 10분
register('settings',     renderSettings);           // 톱니바퀴 진입
register('story',        renderStoryDetail);        // #story/<id>
register('compare',      renderCompare);            // #study/grammar/compare 가 navigate('compare') 함
register('conversation', renderConversation);       // 직접 라우트만 (탭에서는 제거)

initTheme();          // 테마 동적 전환 + system 모드 OS 변경 감지
renderLevelPill();
// 톱니바퀴 → 설정
const gear = document.getElementById('settingsBtn');
if (gear) gear.addEventListener('click', () => navigate('settings'));

// ── 인증 게이트 (라운드 50 — 로그인 필수) ────────────────────────────────
// 게이트: 로그인 사용자만 통과. 비로그인이면 라우터가 로그인 화면만 렌더.
setAuthGate(() => !!getCurrentUser(), renderAuthGate);

// 인증 확인 중에는 로딩 화면 + 앱 UI(탭/헤더) 숨김.
const _screen = document.getElementById('screen');
if (_screen) renderAuthLoading({ screen: _screen });
document.body.classList.add('auth-locked');

let _booted = false;
let _prevSignedIn = false;
function applySignedState() {
  if (getCurrentUser()) {
    document.body.classList.remove('auth-locked');
    const pending = consumePendingRoute();
    navigate(pending && pending !== 'authgate' ? pending : 'home');
  } else {
    document.body.classList.add('auth-locked');
    navigate('home');            // 게이트가 가로채 로그인 화면 렌더
  }
}

observeAuth((user) => {
  const signedIn = !!user;
  if (signedIn && !_prevSignedIn) logAction('app_open');   // 로그인/세션 복원 시 1회(하루 1회 제한)
  _prevSignedIn = signedIn;
  if (_booted) applySignedState();    // 부팅 후 로그인/로그아웃 전환 처리
});

// 첫 인증 상태 확정 후 부팅 — 로그인 화면 깜빡임 방지.
initAuth().then(() => {
  _booted = true;
  start();                 // 현재 hash route 렌더 — 게이트가 로그인/홈으로 분기
  applySignedState();      // 부팅 시점 상태 반영(로그인되어 있으면 의도 route 복귀)
}).catch(() => {
  _booted = true;
  start();                 // 초기화 실패해도 앱은 뜨고 게이트가 안내 표시(크래시 없음)
});

// PWA — Service Worker 등록 (미지원/실패 시 조용히 통과, 학습 흐름 비차단)
registerServiceWorker();
