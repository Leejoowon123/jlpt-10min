// PWA Service Worker 등록 — 방어적/조용한 실패. 학습 흐름을 절대 막지 않는다.
//
// - serviceWorker 미지원(구브라우저/비보안 컨텍스트/jsdom)에서는 아무 일도 하지 않고 false 반환.
// - 등록 실패는 console.warn 까지만 — throw 전파 없음.
// - 경로는 상대(`./service-worker.js`, scope `./`) — GitHub Pages 하위 경로 안전.
// - 테스트용으로 nav 를 주입할 수 있다(미지원 환경 mock 검증).

export function registerServiceWorker(nav) {
  const n = nav || (typeof navigator !== 'undefined' ? navigator : undefined);
  try {
    if (!n || !('serviceWorker' in n) || typeof n.serviceWorker.register !== 'function') {
      return false; // 미지원 — 조용히 통과
    }
    const p = n.serviceWorker.register('./service-worker.js', { scope: './' });
    if (p && typeof p.then === 'function') {
      p.then(() => { /* 등록 성공 */ })
       .catch((e) => { try { console.warn('[pwa] SW 등록 실패(무시):', e && e.message); } catch { /* noop */ } });
    }
    return true; // 등록 시도함
  } catch (e) {
    try { console.warn('[pwa] SW 등록 예외(무시):', e && e.message); } catch { /* noop */ }
    return false;
  }
}
