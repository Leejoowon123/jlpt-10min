/* JLPT 10분 — 최소 Service Worker (PWA shell 캐시).
 * 전략:
 *   - same-origin GET 만 처리. 그 외(POST, cross-origin)는 건드리지 않고 네트워크로 통과.
 *   - 앱 shell(HTML/CSS/JS/manifest/icons): cache-first + 백그라운드 갱신 보조.
 *   - 콘텐츠 data/**.json: stale-while-revalidate (현재 대부분 js/data/*.js 정적 import 라 shell 에 포함됨).
 *   - Firebase(googleapis/gstatic/firebaseio/firebasedatabase) · Web Speech 는 캐시하지 않음(네트워크/브라우저 기능).
 *   - 어떤 실패도 학습 흐름을 막지 않도록 방어 — 캐시 미스 시 네트워크, 둘 다 실패해도 throw 전파 안 함.
 * GitHub Pages 하위 경로 호환: 모든 경로는 SW 스코프 기준 상대(`./`) — 절대경로(`/`) 미사용.
 */
const CACHE_VERSION = 'jlpt10min-v2';   // v2: 레벨별 data/<lv>/vocab.json 도입(SWR 대상)

// 스코프 기준 상대 경로 (서브패스 배포 안전). registration.scope 가 base.
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './js/app.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

// 캐시 제외 호스트 — Firebase / 구글 / 외부.
const NO_CACHE_HOST = /(^|\.)(googleapis\.com|gstatic\.com|firebaseio\.com|firebasedatabase\.app|firebaseinstallations\.googleapis\.com|google-analytics\.com)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL).catch(() => { /* 일부 자산 실패해도 설치 진행 */ }))
      .then(() => self.skipWaiting())
      .catch(() => { /* 설치 실패해도 앱은 네트워크로 동작 */ })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .catch(() => {})
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // same-origin GET 만 처리. 그 외는 통과(기본 네트워크).
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch { return; }
  if (url.origin !== self.location.origin) return;          // cross-origin(Firebase 등) → network-only
  if (NO_CACHE_HOST.test(url.hostname)) return;             // 방어적 이중 체크

  // 콘텐츠 JSON → stale-while-revalidate
  if (url.pathname.endsWith('.json') && url.pathname.includes('/data/')) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }
  // 앱 shell / 그 외 same-origin GET → cache-first
  event.respondWith(cacheFirst(req));
});

function cacheFirst(req) {
  return caches.open(CACHE_VERSION).then((cache) =>
    cache.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') cache.put(req, res.clone()).catch(() => {});
        return res;
      }).catch(() => hit || Response.error());
    })
  );
}

function staleWhileRevalidate(req) {
  return caches.open(CACHE_VERSION).then((cache) =>
    cache.match(req).then((hit) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') cache.put(req, res.clone()).catch(() => {});
        return res;
      }).catch(() => hit || Response.error());
      return hit || network;
    })
  );
}
