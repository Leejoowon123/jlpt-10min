// 해시 라우터. routes: 'home' | 'today' | 'study' | 'review' | 'compare' | 'study/<type>' | 'compare/<pairId>'
const routes = new Map();
let currentRoute = '';

// ── 인증 게이트 (라운드 50) ──────────────────────────────────────────────
// guard() === true 면 통과, false 면 gateRenderer 로 로그인 화면을 렌더하고 의도 route 를 보관.
let authGuard = null;       // () => boolean
let gateRenderer = null;    // ({ screen }) => void
let pendingRoute = null;    // 로그인 후 복귀할 route

export function setAuthGate(guardFn, renderFn) {
  authGuard = guardFn;
  gateRenderer = renderFn;
}
/** 로그인 후 복귀용 — 보관된 route 를 꺼내고 비운다. */
export function consumePendingRoute() {
  const r = pendingRoute;
  pendingRoute = null;
  return r;
}

export function register(name, handler) {
  routes.set(name, handler);
}

export function navigate(route) {
  if (route.startsWith('#')) route = route.slice(1);
  if (window.location.hash !== '#' + route) {
    window.location.hash = '#' + route;
  } else {
    render(route);
  }
}

export function back() {
  if (history.length > 1) history.back();
  else navigate('home');
}

export function currentName() {
  const r = currentRoute || 'home';
  return r.split('/')[0];
}

function render(route) {
  currentRoute = route;
  const [name, ...rest] = route.split('/');
  const screen = document.getElementById('screen');

  // 인증 게이트 — 비로그인이면 의도 route 보관 후 로그인 화면만 렌더, 앱 UI(탭/헤더) 숨김.
  if (authGuard && !authGuard()) {
    if (name && name !== 'authgate') pendingRoute = route;
    try { document.body.classList.add('auth-locked'); } catch { /* */ }
    if (screen) screen.innerHTML = '';
    if (gateRenderer) gateRenderer({ screen });
    updateTabs('');
    const back = document.getElementById('backBtn');
    if (back) back.hidden = true;
    return;
  }
  try { document.body.classList.remove('auth-locked'); } catch { /* */ }

  const handler = routes.get(name) || routes.get('home');
  if (screen) screen.innerHTML = '';
  if (handler) handler({ screen, params: rest });
  updateTabs(name);
}

// 라우트 → 활성화할 탭 매핑 (하위 화면이 탭의 active 상태에 영향을 주도록).
const TAB_FOR_ROUTE = {
  home: 'home',
  today: 'home',
  study: 'study',
  compare: 'study',          // 학습 > 문법 > 비교 흐름
  review: 'review',
  stories: 'stories',
  story: 'stories',          // story/<id> 도 이야기 탭 강조
  novels: 'novels',
  settings: '',              // 탭 외 화면 — 모든 탭 비활성
  conversation: '',          // 보조 라우트
};

function updateTabs(name) {
  const activeTab = TAB_FOR_ROUTE.hasOwnProperty(name) ? TAB_FOR_ROUTE[name] : name;
  document.querySelectorAll('.tab').forEach(b => {
    b.classList.toggle('active', b.dataset.route === activeTab);
  });
  const back = document.getElementById('backBtn');
  if (back) back.hidden = name === 'home';
}

export function start() {
  window.addEventListener('hashchange', () => {
    render((window.location.hash || '#home').slice(1));
  });
  document.querySelectorAll('.tab').forEach(b => {
    b.addEventListener('click', () => navigate(b.dataset.route));
  });
  document.getElementById('backBtn').addEventListener('click', () => back());
  render((window.location.hash || '#home').slice(1));
}
