// PWA Service Worker 등록 — 방어적/조용한 실패. 학습 흐름을 절대 막지 않는다.
//
// - serviceWorker 미지원(구브라우저/비보안 컨텍스트/jsdom)에서는 아무 일도 하지 않고 false 반환.
// - Capacitor/네이티브 WebView 에서는 앱 번들이 로컬 자산을 제공하므로 SW 등록을 건너뛴다(WebView SW 불안정).
// - 등록 실패는 console.warn 까지만 — throw 전파 없음.
// - 경로는 상대(`./service-worker.js`, scope `./`) — GitHub Pages 하위 경로 안전.
// - 테스트용으로 nav 를 주입할 수 있다(미지원 환경 mock 검증).

import { isCapacitor as _isCapacitor } from './platform.js';

/** Capacitor/네이티브 WebView 환경 감지 — SW/PWA 분기용. (공용 감지: platform.js) */
export function isCapacitor() {
  return _isCapacitor();
}

export function registerServiceWorker(nav) {
  const n = nav || (typeof navigator !== 'undefined' ? navigator : undefined);
  try {
    if (isCapacitor()) return false; // 네이티브 앱 — 번들 자산 사용, SW 미등록
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
