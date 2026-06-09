// 해시 라우터. routes: 'home' | 'today' | 'study' | 'review' | 'compare' | 'study/<type>' | 'compare/<pairId>'
const routes = new Map();
let currentRoute = '';

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
  const handler = routes.get(name) || routes.get('home');
  const screen = document.getElementById('screen');
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
