// 최소 행동 로그 — Realtime Database 기록.
//
// 목표: "사용자가 어떤 행동을 했다" 는 최소 사실만 기록.
//   - 학습 진도 동기화 아님 (localStorage 진도와 완전 분리).
//   - 클릭 전체 추적 아님 — 허용된 이벤트 타입만, 빈도 제한과 함께.
//   - 개인정보/이메일 원문/답변 원문/STT 텍스트·음성 저장 금지.
//
// 무료 범위 보호:
//   - app_open 은 하루 1회 (localStorage marker).
//   - 같은 (type + 대상) 이벤트는 ACTION_LOG_MIN_INTERVAL_MS 안에 1회만.
//   - 실패는 조용히 무시 — 앱 기능에 영향 없음. 모든 호출은 fire-and-forget.
//
// DB 구조:
//   actionLogs/{YYYY-MM-DD}/{eventId}   = { type, at, userKey, userType, level, route, meta }
//   userActivity/{uid}                  = 로그인 사용자 활동 (signed-in 만)
//   anonymousActivity/{anonKey}         = 비로그인 사용자 활동 (분리 — rules 와 일치)

import { getFirebaseApp, getDatabaseModule, isFirebaseConfigured } from './firebaseClient.js';
import { getCurrentUser } from './authService.js';
import { getState } from './storage.js';

export const ACTION_LOG_MIN_INTERVAL_MS = 3000;
export const APP_OPEN_LOG_ONCE_PER_DAY = true;

const ANON_ID_KEY = 'jlpt10min:anonId';
const APP_OPEN_MARKER_KEY = 'jlpt10min:appOpenLogged';

// 허용 이벤트 화이트리스트 — 이 외 타입은 기록하지 않는다.
export const ALLOWED_EVENTS = [
  'app_open', 'login_success', 'logout',
  'study_start', 'story_open', 'story_complete',
  'vocab_card_answered', 'grammar_answered',
  'conversation_start', 'firebase_test',
];

// in-memory throttle: `${type}:${targetKey}` → 마지막 기록 ms
const lastLoggedAt = new Map();

// writer: async (path, value) => void — 실제 Firebase 또는 테스트 mock.
let writerOverride = null;
export function _setWriterForTest(fn) { writerOverride = fn; }
export function _resetWriterForTest() { writerOverride = null; }
export function _resetThrottleForTest() {
  lastLoggedAt.clear();
  try { globalThis.localStorage?.removeItem(APP_OPEN_MARKER_KEY); } catch {}
}

/** 비로그인 사용자 식별용 익명 id — localStorage 영속. 개인정보 아님(무작위 문자열). */
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

// 로그인 필수 정책(라운드 50): signed-in 사용자만 기록. 비로그인이면 null → logAction noop.
// userKey 는 Firebase uid 만 사용. (익명 userKey / anonymous 활동 경로는 폐기 — 신규 쓰기 없음)
function resolveUser() {
  const u = getCurrentUser();
  if (u && u.uid) return { userKey: u.uid, userType: 'signed-in' };
  return null;
}

function todayKeyUtc() {
  return new Date().toISOString().slice(0, 10);   // YYYY-MM-DD
}

function makeEventId() {
  return Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

async function realWriter(path, value) {
  // 실패는 throw — logAction 은 .catch 로 무시, _sendTestLogForTest 는 결과로 보고.
  if (!isFirebaseConfigured()) throw new Error('not-configured');
  const app = await getFirebaseApp();
  const mod = await getDatabaseModule();
  if (!app || !mod) throw new Error('firebase-unavailable');
  const db = mod.getDatabase(app);
  await mod.set(mod.ref(db, path), value);
}

async function write(path, value) {
  const w = writerOverride || realWriter;
  await w(path, value);
}

/**
 * 행동 로그 기록 — fire-and-forget. 절대 throw 하지 않는다.
 * @param {string} type   ALLOWED_EVENTS 중 하나
 * @param {object} meta   최소 메타 (itemType/itemId/storyId/correct 등) — 원문 텍스트 금지
 */
export function logAction(type, meta = {}) {
  try {
    if (!ALLOWED_EVENTS.includes(type)) return;
    if (!writerOverride && !isFirebaseConfigured()) return;   // 미설정 → noop
    const resolved = resolveUser();
    if (!resolved) return;                                    // 로그인 필수 — 비로그인이면 기록 안 함
    const { userKey, userType } = resolved;

    // app_open: 하루 1회
    if (type === 'app_open' && APP_OPEN_LOG_ONCE_PER_DAY) {
      const today = todayKeyUtc();
      try {
        if (globalThis.localStorage?.getItem(APP_OPEN_MARKER_KEY) === today) return;
        globalThis.localStorage?.setItem(APP_OPEN_MARKER_KEY, today);
      } catch { /* localStorage 불가 → 그래도 기록 시도 */ }
    }

    // 같은 (type+대상) 단기 중복 방지
    const targetKey = meta.storyId || meta.itemId || meta.route || '';
    const throttleKey = `${type}:${targetKey}`;
    const now = Date.now();
    const prev = lastLoggedAt.get(throttleKey) || 0;
    if (now - prev < ACTION_LOG_MIN_INTERVAL_MS) return;
    lastLoggedAt.set(throttleKey, now);

    const level = (() => {
      try { return getState().userProgress.targetLevel || 'N5'; } catch { return 'N5'; }
    })();
    const route = (() => {
      try { return (typeof window !== 'undefined' && window.location?.hash) || ''; } catch { return ''; }
    })();

    const event = {
      type,
      at: now,            // 실 운영에서는 serverTimestamp 로 교체 가능 — MVP 는 클라이언트 ms
      userKey,
      userType,
      level,
      route,
      meta: sanitizeMeta(meta),
    };

    const date = todayKeyUtc();
    const eventId = makeEventId();

    // fire-and-forget — 실패는 조용히 무시.
    write(`actionLogs/${date}/${eventId}`, event).catch(() => {});
    // 활동 노드 — 로그인 사용자만 (signed-in 전용 정책). 익명 활동 경로는 폐기.
    write(`userActivity/${userKey}`, {
      firstSeenAt: now,    // 운영 rules 에서 기존값 보존하려면 transaction — MVP 는 단순 set
      lastSeenAt: now,
      lastEventType: type,
      signedIn: true,
    }).catch(() => {});
  } catch {
    /* 어떤 실패도 앱 기능을 막지 않는다 */
  }
}

/**
 * 연결 테스트 — **테스트 전용** (라운드 21: 공개 UI 의 "로그 테스트" 버튼 제거됨).
 * qa/수동 콘솔 검증에서만 사용. logAction 과 달리 결과를 반환하며 스로틀 미적용.
 * @returns {Promise<{ok:boolean, error?:string}>}
 */
export async function _sendTestLogForTest() {
  try {
    if (!writerOverride && !isFirebaseConfigured()) {
      return { ok: false, error: 'Firebase 설정이 필요합니다.' };
    }
    // 테스트 전용 — 비로그인 상태에서도 연결 점검이 되도록 fallback(운영 UI 에는 노출 안 됨).
    const { userKey, userType } = resolveUser() || { userKey: 'test', userType: 'signed-in' };
    const now = Date.now();
    const event = {
      type: 'firebase_test',
      at: now, userKey, userType,
      level: (() => { try { return getState().userProgress.targetLevel || 'N5'; } catch { return 'N5'; } })(),
      route: (() => { try { return (typeof window !== 'undefined' && window.location?.hash) || ''; } catch { return ''; } })(),
      meta: { method: 'manual' },
    };
    await write(`actionLogs/${todayKeyUtc()}/${makeEventId()}`, event);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: '전송 실패 — databaseURL/rules 를 확인하세요.' };
  }
}

/** meta 최소화 — 허용 키만 통과, 문자열은 짧게 자름 (원문 텍스트 저장 방지). */
function sanitizeMeta(meta) {
  const out = {};
  for (const k of ['itemType', 'itemId', 'storyId', 'correct', 'method']) {
    if (meta[k] === undefined || meta[k] === null) continue;
    const v = meta[k];
    out[k] = typeof v === 'string' ? v.slice(0, 64) : v;
  }
  return out;
}
