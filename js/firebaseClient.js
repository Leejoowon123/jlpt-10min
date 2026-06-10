// Firebase lazy 초기화 — CDN ESM dynamic import (번들러 없음).
//
// 원칙:
//   - 앱 시작 시 Firebase 를 로드하지 않는다. 처음 필요할 때 1회 import.
//   - config 미설정 / import 실패 / 네트워크 실패 → null 반환. 앱 기능은 계속 동작.
//   - Analytics 는 optional — 이번 라운드 미사용.
//   - Node(smoke/qa) 환경에서는 https import 가 불가능 → 항상 null (mock 주입으로 테스트).

import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig.js';

const CDN = 'https://www.gstatic.com/firebasejs/10.12.0';

let appPromise = null;
let authModPromise = null;
let dbModPromise = null;

// 초기화 결과 추적 — 설정 화면의 연결 상태 배지에 사용.
// 'unknown'(시도 전) | 'ok' | 'failed'
let initStatus = 'unknown';
export function getInitStatus() { return initStatus; }
export function _setInitStatusForTest(s) { initStatus = s; }

/** Firebase App 인스턴스 (또는 null). 실패해도 throw 하지 않는다. */
export function getFirebaseApp() {
  if (!isFirebaseConfigured()) return Promise.resolve(null);
  if (!appPromise) {
    appPromise = (async () => {
      try {
        const { initializeApp } = await import(`${CDN}/firebase-app.js`);
        const app = initializeApp(firebaseConfig);
        initStatus = 'ok';
        return app;
      } catch {
        initStatus = 'failed';   // CDN 로드 실패 / 미지원 환경(Node)
        return null;
      }
    })();
  }
  return appPromise;
}

/** firebase-auth 모듈 (또는 null). */
export function getAuthModule() {
  if (!isFirebaseConfigured()) return Promise.resolve(null);
  if (!authModPromise) {
    authModPromise = import(`${CDN}/firebase-auth.js`).catch(() => null);
  }
  return authModPromise;
}

/** firebase-database 모듈 (또는 null). */
export function getDatabaseModule() {
  if (!isFirebaseConfigured()) return Promise.resolve(null);
  if (!dbModPromise) {
    dbModPromise = import(`${CDN}/firebase-database.js`).catch(() => null);
  }
  return dbModPromise;
}

export { isFirebaseConfigured };
