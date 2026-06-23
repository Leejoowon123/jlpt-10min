// 베타 피드백 + 관리자 데이터 접근 — Realtime Database.
//
// 보안 원칙 (중요):
//   - 관리자 식별은 Firebase UID 기준. DB 의 admins/{uid}===true 를 읽어 판정한다.
//   - 프론트의 이메일 비교/이스터에그는 "숨김 UI" 일 뿐 보안이 아니다 — 실제 권한은
//     Realtime Database Rules 가 강제한다(feedback read = admin only 등). docs/admin.md 참조.
//   - ADMIN_EMAIL_HINT 는 화면 표시용 문구일 뿐 권한 판정에 쓰지 않는다.
//
// 프라이버시:
//   - feedback 는 사용자가 직접 입력한 텍스트이므로 저장된다(개인정보 입력 금지 안내를 UI 에 표시).
//   - userEmail / 비밀번호는 저장하지 않는다. uid 만 저장.
//   - actionLogs 와 분리 — 피드백 본문은 actionLogs 에 절대 남기지 않는다.

import { getFirebaseApp, getDatabaseModule, isFirebaseConfigured } from './firebaseClient.js';
import { getCurrentUser } from './authService.js';
import { APP_VERSION, getPlatformLabel } from './appMeta.js';

// 화면 표시용 후보 이메일 — 보안 아님(실제 권한은 admins/{uid} + rules).
export const ADMIN_EMAIL_HINT = 'joowon582@gmail.com';

// 중복 전송 가드(로컬) — 무료 범위 보호 + 오발송 방지.
export const FEEDBACK_COOLDOWN_MS = 5000;      // 연속 전송 최소 간격
export const FEEDBACK_DAILY_LIMIT = 10;        // 하루 최대 전송 수(로컬 가드)
const LAST_AT_KEY = 'jlpt10min:lastFeedbackAt';
const DAY_KEY = 'jlpt10min:feedbackDay';

const TEXT_MAX = 1000;   // 입력 텍스트 상한(과도한 저장 방지)
const RECENT_ACTIVE_DAYS = 7;

// ── DB 접근 추상화 (테스트 주입 가능) ────────────────────────────────────────
// { read(path)->Promise<any>, write(path,value)->Promise<void> }
let dbOverride = null;
export function _setDbForTest(o) { dbOverride = o; }
export function _resetDbForTest() { dbOverride = null; }

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

function dbAccess() {
  return dbOverride || { read: realRead, write: realWrite };
}

function makeId() {
  return Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function todayKeyUtc() {
  return new Date().toISOString().slice(0, 10);
}

function clampText(v) {
  return typeof v === 'string' ? v.trim().slice(0, TEXT_MAX) : '';
}

// ── 피드백 전송 ──────────────────────────────────────────────────────────────
/**
 * 피드백 저장 — feedback/{feedbackId}. fire-and-forget 아님: 결과를 반환해 UI 가 성공/실패를 안내.
 * @param {{rating?:number, good?:string, bad?:string, wish?:string, bug?:string, contactOk?:boolean}} input
 * @returns {Promise<{ok:true, feedbackId:string}|{ok:false, error:string}>}
 */
export async function submitFeedback(input = {}) {
  const u = getCurrentUser();
  if (!u || !u.uid) return { ok: false, error: '로그인 후 이용해 주세요.' };

  const rating = Number(input.rating) || 0;
  const good = clampText(input.good);
  const bad = clampText(input.bad);
  const wish = clampText(input.wish);
  const bug = clampText(input.bug);
  // 최소 내용 검증 — 별점 또는 텍스트 중 하나는 있어야 함.
  if (!(rating >= 1 && rating <= 5) && !good && !bad && !wish && !bug) {
    return { ok: false, error: '만족도 또는 의견을 한 가지 이상 입력해 주세요.' };
  }

  // 로컬 중복/빈도 가드.
  const guard = cooldownState();
  if (guard.blocked) return { ok: false, error: guard.reason };

  const payload = {
    rating: rating >= 1 && rating <= 5 ? rating : null,
    good, bad, wish, bug,
    contactOk: !!input.contactOk,
    appVersion: APP_VERSION,
    platform: getPlatformLabel(),
    createdAt: Date.now(),
    uid: u.uid,            // userEmail/비밀번호는 저장하지 않는다
  };

  try {
    const feedbackId = makeId();
    await dbAccess().write(`feedback/${feedbackId}`, payload);
    markSent();
    return { ok: true, feedbackId };
  } catch {
    return { ok: false, error: '전송에 실패했습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.' };
  }
}

function cooldownState() {
  try {
    const ls = globalThis.localStorage;
    if (!ls) return { blocked: false };
    const now = Date.now();
    const last = Number(ls.getItem(LAST_AT_KEY)) || 0;
    if (now - last < FEEDBACK_COOLDOWN_MS) {
      return { blocked: true, reason: '잠시 후 다시 시도해 주세요.' };
    }
    const today = todayKeyUtc();
    const rec = (ls.getItem(DAY_KEY) || '').split(':');
    if (rec[0] === today && Number(rec[1]) >= FEEDBACK_DAILY_LIMIT) {
      return { blocked: true, reason: '오늘 보낼 수 있는 피드백 수를 초과했습니다. 내일 다시 시도해 주세요.' };
    }
    return { blocked: false };
  } catch { return { blocked: false }; }
}

function markSent() {
  try {
    const ls = globalThis.localStorage;
    if (!ls) return;
    const now = Date.now();
    ls.setItem(LAST_AT_KEY, String(now));
    const today = todayKeyUtc();
    const rec = (ls.getItem(DAY_KEY) || '').split(':');
    const count = rec[0] === today ? (Number(rec[1]) || 0) + 1 : 1;
    ls.setItem(DAY_KEY, `${today}:${count}`);
  } catch { /* localStorage 불가 — 가드 생략(전송 자체는 성공) */ }
}

// ── 관리자 권한 / 데이터 ──────────────────────────────────────────────────────
/**
 * 관리자 여부 — DB 의 admins/{현재 uid} === true 로 판정(UID 기준, 이메일 비교 아님).
 * 권한이 없거나 읽기 실패(rules 차단 포함) 시 false. 절대 throw 하지 않는다.
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  const u = getCurrentUser();
  if (!u || !u.uid) return false;
  try {
    const v = await dbAccess().read(`admins/${u.uid}`);
    return v === true;
  } catch {
    return false;   // rules 가 막거나 네트워크 실패 — 권한 없음으로 간주(보안 기본값)
  }
}

// 활동 상태 임계값 — 관리자 UI 에서 lastSeenAt 기준으로 계산(실시간 presence 저장 안 함).
export const ACTIVE_NOW_MS = 5 * 60 * 1000;        // 5분 이내: 활동중
export const ACTIVE_RECENT_MS = 30 * 60 * 1000;    // 30분 이내: 최근 활동

/**
 * 관리자 대시보드용 요약 — **userActivity + feedback 만** 읽어 집계(읽기 전용).
 * actionLogs 는 폐지되어 읽지 않는다(라운드 60). rules 가 admin 만 읽도록 강제하므로
 * 비관리자 호출은 read 단계에서 차단된다.
 * @returns {Promise<{userCount, activeNowCount, active24hCount, active7dCount, activities, feedback}>}
 */
export async function getAdminSummary({ feedbackLimit = 50 } = {}) {
  const db = dbAccess();
  const [userActivityRaw, feedbackRaw] = await Promise.all([
    db.read('userActivity').catch(() => null),
    db.read('feedback').catch(() => null),
  ]);

  const userActivity = userActivityRaw || {};
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const activities = Object.entries(userActivity).map(([uid, a]) => ({
    uid,
    firstSeenAt: a?.firstSeenAt || a?.createdAt || 0,
    createdAt: a?.createdAt || a?.firstSeenAt || 0,
    lastSeenAt: a?.lastSeenAt || 0,
    lastEventType: a?.lastEventType || '',
    sessionCount: a?.sessionCount || 0,
    totalActiveMs: a?.totalActiveMs || 0,
    platform: a?.platform || '',
    appVersion: a?.appVersion || '',
  })).sort((x, y) => y.lastSeenAt - x.lastSeenAt);

  const userCount = activities.length;
  const activeNowCount = activities.filter(a => now - a.lastSeenAt <= ACTIVE_NOW_MS).length;
  const active24hCount = activities.filter(a => now - a.lastSeenAt <= DAY).length;
  const active7dCount = activities.filter(a => now - a.lastSeenAt <= RECENT_ACTIVE_DAYS * DAY).length;

  const feedbackObj = feedbackRaw || {};
  const feedback = Object.entries(feedbackObj).map(([id, f]) => ({ id, ...(f || {}) }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, feedbackLimit);

  return { userCount, activeNowCount, active24hCount, active7dCount, activities, feedback };
}
