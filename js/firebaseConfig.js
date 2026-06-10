// Firebase 웹 앱 설정 — jlpt-10min 프로젝트 실제 값.
//
// ⚠ Web config(apiKey 등)는 public 저장소에 올라가도 되는 값이다 — 식별자이지 비밀키가 아니다.
//   인증/보안은 Realtime Database rules 와 Authentication 설정이 담당한다.
// ⚠ 절대 커밋 금지: service account JSON, Admin SDK 키, 서버 비밀키.
//
// databaseURL:
//   Firebase Console → Realtime Database 화면 상단에 표시되는 URL 을 그대로 사용.
//   미국(us-central1) 기본:  https://<project>-default-rtdb.firebaseio.com
//   그 외 리전(예: asia-southeast1): https://<project>-default-rtdb.<region>.firebasedatabase.app
//   아래 값이 Console 표시와 다르면 반드시 교체할 것 — 다르면 로그 기록이 조용히 실패한다.
//   (검증: docs/firebase-logging.md 의 수동 QA 절차 참조)

export const firebaseConfig = {
  apiKey:            'AIzaSyAPqOHMBychAmzCgb6Fbt0AUYH3Rw8DA1A',
  authDomain:        'jlpt-10min.firebaseapp.com',
  databaseURL:       'https://jlpt-10min-default-rtdb.firebaseio.com',
  projectId:         'jlpt-10min',
  storageBucket:     'jlpt-10min.firebasestorage.app',
  messagingSenderId: '241545324874',
  appId:             '1:241545324874:web:c857032833c5748531f9b3',
  measurementId:     'G-HKPRD6GCYN',   // Analytics 용 (optional — 현재 미사용)
};

/** config 가 실제 값으로 채워졌는지. placeholder 상태면 Firebase 기능 전체 비활성. */
export function isFirebaseConfigured() {
  return !!firebaseConfig.apiKey
    && !firebaseConfig.apiKey.startsWith('YOUR_')
    && !!firebaseConfig.databaseURL
    && !firebaseConfig.databaseURL.startsWith('YOUR_');
}
