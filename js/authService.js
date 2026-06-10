// 이메일/비밀번호 인증 서비스 — Firebase Auth 래퍼.
//
// 원칙:
//   - 로그인하지 않아도 앱의 모든 기능 사용 가능 (강제 로그인 없음).
//   - 비밀번호는 어디에도 저장하지 않는다 (localStorage 금지 — Firebase SDK 가 세션 관리).
//   - Firebase 미설정/로드 실패 시 authAvailable() === false — 계정 UI 는 안내만 표시.
//   - Google 로그인은 이번 라운드 제외.
//
// 테스트: _setAuthImplForTest(impl) 로 mock 주입 — qa 는 실제 네트워크를 쓰지 않는다.

import { getFirebaseApp, getAuthModule, isFirebaseConfigured } from './firebaseClient.js';

let currentUser = null;          // { uid, email } | null
const observers = new Set();
let initialized = false;

// 실제 또는 mock 구현: { signUp(email,pw), signIn(email,pw), signOut(), observe(cb) }
let impl = null;
let implIsMock = false;

export function _setAuthImplForTest(mockImpl) {
  impl = mockImpl;
  implIsMock = true;
  initialized = false;
  currentUser = null;
}
export function _resetAuthImplForTest() {
  impl = null;
  implIsMock = false;
  initialized = false;
  currentUser = null;
  observers.clear();
}

/** 인증 기능 사용 가능 여부 — config 채워짐 또는 테스트 mock 주입. */
export function authAvailable() {
  return implIsMock || isFirebaseConfigured();
}

function notify() {
  for (const cb of observers) {
    try { cb(currentUser); } catch { /* observer 오류 무시 */ }
  }
}

async function buildRealImpl() {
  const app = await getFirebaseApp();
  const mod = await getAuthModule();
  if (!app || !mod) return null;
  const auth = mod.getAuth(app);
  return {
    signUp: async (email, pw) => {
      const cred = await mod.createUserWithEmailAndPassword(auth, email, pw);
      return { uid: cred.user.uid, email: cred.user.email };
    },
    signIn: async (email, pw) => {
      const cred = await mod.signInWithEmailAndPassword(auth, email, pw);
      return { uid: cred.user.uid, email: cred.user.email };
    },
    signOut: () => mod.signOut(auth),
    observe: (cb) => mod.onAuthStateChanged(auth,
      u => cb(u ? { uid: u.uid, email: u.email } : null)),
  };
}

/** 인증 초기화 — 상태 감시 시작. 실패해도 throw 하지 않음. */
export async function initAuth() {
  if (initialized) return authAvailable();
  initialized = true;
  try {
    if (!impl) impl = await buildRealImpl();
    if (impl && impl.observe) {
      impl.observe(u => { currentUser = u; notify(); });
    }
    return !!impl;
  } catch {
    impl = null;
    return false;
  }
}

/** 로그인 상태 변경 구독. 즉시 1회 현재 상태로 호출. 해제 함수 반환. */
export function observeAuth(callback) {
  observers.add(callback);
  try { callback(currentUser); } catch { /* ignore */ }
  return () => observers.delete(callback);
}

export function getCurrentUser() {
  return currentUser;
}

/** Firebase 에러 코드 → 한국어 안내. */
function friendlyError(e) {
  const code = e?.code || '';
  if (code.includes('invalid-email'))        return '이메일 형식이 올바르지 않습니다.';
  if (code.includes('email-already-in-use')) return '이미 가입된 이메일입니다.';
  if (code.includes('weak-password'))        return '비밀번호는 6자 이상이어야 합니다.';
  if (code.includes('invalid-credential') ||
      code.includes('wrong-password') ||
      code.includes('user-not-found'))       return '이메일 또는 비밀번호가 올바르지 않습니다.';
  if (code.includes('too-many-requests'))    return '시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.';
  if (code.includes('network'))              return '네트워크 오류입니다. 연결을 확인해 주세요.';
  return '요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.';
}

/** @returns {Promise<{ok:true,user}|{ok:false,error:string}>} */
export async function signUpWithEmail(email, password) {
  if (!impl) await initAuth();
  if (!impl) return { ok: false, error: 'Firebase 가 설정되지 않았습니다.' };
  try {
    const user = await impl.signUp(email, password);
    currentUser = user;
    notify();
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
}

/** @returns {Promise<{ok:true,user}|{ok:false,error:string}>} */
export async function signInWithEmail(email, password) {
  if (!impl) await initAuth();
  if (!impl) return { ok: false, error: 'Firebase 가 설정되지 않았습니다.' };
  try {
    const user = await impl.signIn(email, password);
    currentUser = user;
    notify();
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
}

export async function logout() {
  try {
    if (impl && impl.signOut) await impl.signOut();
  } catch { /* 로그아웃 실패해도 로컬 상태는 비움 */ }
  currentUser = null;
  notify();
  return { ok: true };
}
