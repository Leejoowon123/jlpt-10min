// 최소 활동 요약 — Realtime Database. (라운드 60 — actionLogs 폐지, userActivity 단일화)
//
// 정책 전환(라운드 60):
//   - 상세 행동 로그(actionLogs/{date}/{eventId})를 **더 이상 기록하지 않는다**(무료 Spark 운영 + 프라이버시).
//   - signed-in 사용자당 userActivity/{uid} **한 노드만** 갱신 — 가입/접속/세션/이용시간 요약.
//   - anonymousActivity 경로에도 쓰지 않는다(라운드 50부터 폐기).
//
// 저장하지 않는 것(유지):
//   - 이메일/비밀번호/답변 원문/STT 원문/학습 진도. meta 상세값도 userActivity 에 반영하지 않는다.
//   - 화면에 보이는 식별자는 uid 뿐(경로 키). 이벤트는 lastEventType(유형명)만 남긴다.
//
// 실패는 조용히 무시 — 모든 호출은 fire-and-forget, 앱 기능 비차단.
//
// DB 구조(현행):
//   userActivity/{uid} = {
//     firstSeenAt, createdAt, lastSeenAt, lastEventType, signedIn,
//     sessionCount, totalActiveMs, lastRoute, platform, appVersion
//   }

import { getFirebaseApp, getDatabaseModule, isFirebaseConfigured } from './firebaseClient.js';
import { getCurrentUser } from './authService.js';
import { APP_VERSION, getPlatformLabel } from './appMeta.js';

export const ACTION_LOG_MIN_INTERVAL_MS = 3000;
export const APP_OPEN_LOG_ONCE_PER_DAY = true;
export const SESSION_GAP_MS = 30 * 60 * 1000;   // 30분 무활동 → 새 세션으로 계산

// userActivity 에 저장하는 필드 화이트리스트 — 이 외 값은 절대 저장하지 않는다(가드/테스트 공용).
export const USER_ACTIVITY_FIELDS = [
  'firstSeenAt', 'createdAt', 'lastSeenAt', 'lastEventType', 'signedIn',
  'sessionCount', 'totalActiveMs', 'lastRoute', 'platform', 'appVersion',
];

const ANON_ID_KEY = 'jlpt10min:anonId';
const APP_OPEN_MARKER_KEY = 'jlpt10min:appOpenLogged';

// 허용 이벤트 화이트리스트 — 이 외 타입은 활동 갱신을 일으키지 않는다.
export const ALLOWED_EVENTS = [
  'app_open', 'login_success', 'logout',
  'study_start', 'story_open', 'story_complete',
  'vocab_card_answered', 'grammar_answered',
  'conversation_start', 'firebase_test',
];

// in-memory throttle: type → 마지막 기록 ms
const lastLoggedAt = new Map();

// 테스트 주입: write(path,value) / read(path)->value. (기존 호환: writerOverride 만 줘도 동작 — read 는 null)
let writerOverride = null;
let readerOverride = null;
export function _setWriterForTest(fn) { writerOverride = fn; }
export function _setReaderForTest(fn) { readerOverride = fn; }
export function _resetWriterForTest() { writerOverride = null; }
export function _resetReaderForTest() { readerOverride = null; }
export function _resetThrottleForTest() {
  lastLoggedAt.clear();
  try { globalThis.localStorage?.removeItem(APP_OPEN_MARKER_KEY); } catch {}
}

/** 비로그인 식별용 익명 id(localStorage) — 개인정보 아님. (DB 익명 활동 기록과 무관, 호환 유지용) */
export function getAnonymousVisitorId() {
  try {
    let id = globalThis.localStorage?.getItem(ANON_ID_KEY);
    if (!id) {
      id = 'anon_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      globalThis.localStorage?.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return 'anon_volatile';
  }
}

// 로그인 필수 정책: signed-in 사용자만. 비로그인이면 null → noop.
function resolveUser() {
  const u = getCurrentUser();
  if (u && u.uid) return { userKey: u.uid };
  return null;
}

function todayKeyUtc() {
  return new Date().toISOString().slice(0, 10);
}

function currentRoute() {
  try { return (typeof window !== 'undefined' && window.location?.hash) || ''; }
  catch { return ''; }
}

async function realRead(path) {
  if (!isFirebaseConfigured()) throw new Error('not-configured');
  const app = await getFirebaseApp();
  const mod = await getDatabaseModule();
  if (!app || !mod) throw new Error('firebase-unavailable');
  const db = mod.getDatabase(app);
  const snap = await mod.get(mod.ref(db, path));
  return snap && snap.exists() ? snap.val() : null;
}

async function realWrite(path, value) {
  if (!isFirebaseConfigured()) throw new Error('not-configured');
  const app = await getFirebaseApp();
  const mod = await getDatabaseModule();
  if (!app || !mod) throw new Error('firebase-unavailable');
  const db = mod.getDatabase(app);
  await mod.set(mod.ref(db, path), value);
}

async function read(path) {
  if (readerOverride) return readerOverride(path);
  if (writerOverride) return null;       // 테스트(writer 만 주입) → 신규 사용자로 취급
  return realRead(path);
}
async function write(path, value) {
  const w = writerOverride || realWrite;
  await w(path, value);
}

/**
 * userActivity/{uid} 갱신 — 기존값을 읽어 firstSeenAt/createdAt 보존 + 세션/이용시간 누적.
 * 동시성: get→set 방식(완벽한 동시성 보장 아님 — 베타 한계, docs/firebase-logging.md 문서화).
 */
async function updateActivity(userKey, type) {
  const path = `userActivity/${userKey}`;
  let prev = {};
  try { prev = (await read(path)) || {}; } catch { prev = {}; }

  const now = Date.now();
  const firstSeenAt = prev.firstSeenAt || now;
  const createdAt = prev.createdAt || prev.firstSeenAt || now;   // 최초 1회만 — 덮어쓰지 않음
  let sessionCount = Number(prev.sessionCount) || 0;
  let totalActiveMs = Number(prev.totalActiveMs) || 0;

  const gap = prev.lastSeenAt ? now - prev.lastSeenAt : Infinity;
  if (gap > SESSION_GAP_MS) {
    sessionCount += 1;            // 새 세션(최초 접속 포함)
  } else {
    totalActiveMs += gap;         // 세션 내 활동시간 근사 누적(heartbeat 없이)
  }

  const next = {
    firstSeenAt, createdAt,
    lastSeenAt: now,
    lastEventType: type,          // 유형명만 — 답변/원문/meta 상세는 저장하지 않음
    signedIn: true,
    sessionCount,
    totalActiveMs,
    lastRoute: currentRoute(),
    platform: getPlatformLabel(),
    appVersion: APP_VERSION,
  };
  await write(path, next);
}

/**
 * 활동 기록 — fire-and-forget. 절대 throw 하지 않는다. actionLogs 에는 쓰지 않는다.
 * @param {string} type   ALLOWED_EVENTS 중 하나
 * @param {object} _meta  (호환용 — 더 이상 저장하지 않음)
 */
export function logAction(type, _meta = {}) {
  try {
    if (!ALLOWED_EVENTS.includes(type)) return;
    if (!writerOverride && !isFirebaseConfigured()) return;   // 미설정 → noop
    const resolved = resolveUser();
    if (!resolved) return;                                    // 로그인 필수 — 비로그인 noop
    const { userKey } = resolved;

    // app_open: 하루 1회(세션 카운트 과다 방지 + write 절감)
    if (type === 'app_open' && APP_OPEN_LOG_ONCE_PER_DAY) {
      const today = todayKeyUtc();
      try {
        if (globalThis.localStorage?.getItem(APP_OPEN_MARKER_KEY) === today) return;
        globalThis.localStorage?.setItem(APP_OPEN_MARKER_KEY, today);
      } catch { /* localStorage 불가 → 그래도 갱신 시도 */ }
    }

    // 같은 type 단기 중복 방지(write 절감) — 대상별 구분 없이 유형 단위.
    const now = Date.now();
    const prev = lastLoggedAt.get(type) || 0;
    if (now - prev < ACTION_LOG_MIN_INTERVAL_MS) return;
    lastLoggedAt.set(type, now);

    // userActivity 단일 노드만 갱신 — fire-and-forget.
    updateActivity(userKey, type).catch(() => {});
  } catch {
    /* 어떤 실패도 앱 기능을 막지 않는다 */
  }
}

/**
 * 연결 테스트 — **테스트 전용**(운영 UI 미노출). actionLogs 가 아니라 userActivity 갱신으로 점검.
 * @returns {Promise<{ok:boolean, error?:string}>}
 */
export async function _sendTestLogForTest() {
  try {
    if (!writerOverride && !isFirebaseConfigured()) {
      return { ok: false, error: 'Firebase 설정이 필요합니다.' };
    }
    const { userKey } = resolveUser() || { userKey: 'test' };
    await updateActivity(userKey, 'firebase_test');
    return { ok: true };
  } catch {
    return { ok: false, error: '전송 실패 — databaseURL/rules 를 확인하세요.' };
  }
}
