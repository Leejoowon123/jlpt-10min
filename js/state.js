// 즐겨찾기/실패노트/세션 진행을 다루는 액션들
import { getState, update, todayKey } from './storage.js';

export function setLevel(level) {
  update(s => { s.userProgress.targetLevel = level; });
}

export function toggleFavorite(itemType, itemId) {
  let added = false;
  update(s => {
    if (s.favorites[itemId]) {
      delete s.favorites[itemId];
    } else {
      s.favorites[itemId] = { itemType, memo: '', createdAt: Date.now() };
      added = true;
    }
  });
  return added;
}

export function isFavorite(itemId) {
  return Boolean(getState().favorites[itemId]);
}

export function favoritesList() {
  // 요구사항: "자주 볼 단어". 구버전에 남은 비단어 즐겨찾기는 UI에서 숨긴다.
  // (storage 자체는 보존 — A안. 마이그레이션은 하지 않음.)
  const s = getState();
  return Object.entries(s.favorites)
    .filter(([, v]) => v.itemType === 'vocab')
    .map(([itemId, v]) => ({ itemId, ...v }));
}

export function failureNotesList() {
  const s = getState();
  return Object.entries(s.failureNotes)
    .map(([itemId, v]) => ({ itemId, ...v }))
    .sort((a, b) => b.lastWrongAt - a.lastWrongAt);
}

export function removeFailureNote(itemId) {
  update(s => { delete s.failureNotes[itemId]; });
}

export function markStudiedToday() {
  update(s => {
    const t = todayKey();
    const prev = s.userProgress.lastStudiedDate;
    if (prev !== t) {
      // streak: 직전 날짜가 어제이면 +1, 아니면 1
      const y = new Date(t + 'T00:00:00');
      const prevDate = prev ? new Date(prev + 'T00:00:00') : null;
      const isConsecutive = prevDate && (y - prevDate) === 86400000;
      s.userProgress.streakDays = isConsecutive ? (s.userProgress.streakDays || 0) + 1 : 1;
      s.userProgress.lastStudiedDate = t;
      s.userProgress.totalSessions = (s.userProgress.totalSessions || 0) + 1;
    }
    s.sessions[t] = s.sessions[t] || { completed: false, items: [] };
  });
}

export function recordSessionItem(itemType, itemId, correct) {
  update(s => {
    const t = todayKey();
    s.sessions[t] = s.sessions[t] || { completed: false, items: [] };
    s.sessions[t].items.push({ itemType, itemId, correct });
  });
}

export function completeSessionToday() {
  update(s => {
    const t = todayKey();
    s.sessions[t] = s.sessions[t] || { completed: false, items: [] };
    s.sessions[t].completed = true;
  });
}

/** 오늘 세션에서 오답으로 기록된 항목들(중복 제거). 완료 화면 요약에 사용. */
export function todayWrongItems() {
  const s = getState();
  const t = todayKey();
  const sess = s.sessions[t];
  if (!sess) return [];
  const seen = new Set();
  const out = [];
  for (const i of sess.items) {
    if (i.correct) continue;
    const key = `${i.itemType}:${i.itemId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ itemType: i.itemType, itemId: i.itemId });
  }
  return out;
}

// ─── 회화 진행 ──────────────────────────────────────────────────────────
/**
 * @param {string} topicId
 * @param {{ questionJa:string, userText:string, score:number, ok:boolean, createdAt?:number }} attempt
 */
export function recordConversationAttempt(topicId, attempt) {
  update(s => {
    s.conversationProgress = s.conversationProgress || {};
    const p = s.conversationProgress[topicId] || {
      attempts: [], lastScore: 0, bestScore: 0, completedCount: 0, updatedAt: 0,
    };
    const a = {
      questionJa: String(attempt.questionJa ?? ''),
      userText:   String(attempt.userText   ?? ''),
      score:      Number(attempt.score      ?? 0),
      ok:         !!attempt.ok,
      createdAt:  attempt.createdAt ?? Date.now(),
    };
    p.attempts.push(a);
    // attempts 누적 상한 — 메모리/스토리지 보호.
    if (p.attempts.length > 100) p.attempts.splice(0, p.attempts.length - 100);
    p.lastScore = a.score;
    p.bestScore = Math.max(p.bestScore || 0, a.score);
    p.updatedAt = Date.now();
    s.conversationProgress[topicId] = p;
  });
}

export function markConversationCompleted(topicId) {
  update(s => {
    s.conversationProgress = s.conversationProgress || {};
    const p = s.conversationProgress[topicId] || {
      attempts: [], lastScore: 0, bestScore: 0, completedCount: 0, updatedAt: 0,
    };
    p.completedCount = (p.completedCount || 0) + 1;
    p.updatedAt = Date.now();
    s.conversationProgress[topicId] = p;
  });
}

/** @returns {null | {attempts, lastScore, bestScore, completedCount, updatedAt}} */
export function getConversationProgress(topicId) {
  const s = getState();
  return (s.conversationProgress && s.conversationProgress[topicId]) || null;
}

// ─── 스토리 진행도 ────────────────────────────────────────────────────────
function _emptyStoryEntry() {
  return { lastIndex: 0, completed: false, lastOpenedAt: null, readCount: 0 };
}

/** @returns {{lastIndex, completed, lastOpenedAt, readCount}} */
export function getStoryProgress(storyId) {
  const s = getState();
  return (s.storyProgress && s.storyProgress[storyId]) || _emptyStoryEntry();
}

/** 마지막으로 읽던 문단 index 저장. lastOpenedAt 도 함께 갱신. */
export function setStoryLastIndex(storyId, idx) {
  update(s => {
    s.storyProgress = s.storyProgress || {};
    const e = s.storyProgress[storyId] || _emptyStoryEntry();
    e.lastIndex = Math.max(0, idx | 0);
    e.lastOpenedAt = todayKey();
    s.storyProgress[storyId] = e;
  });
}

/** 학습 완료 표시. true 로 설정 시 readCount 증가. */
export function markStoryCompleted(storyId, completed = true) {
  update(s => {
    s.storyProgress = s.storyProgress || {};
    const e = s.storyProgress[storyId] || _emptyStoryEntry();
    const wasCompleted = e.completed;
    e.completed = !!completed;
    e.lastOpenedAt = todayKey();
    if (e.completed && !wasCompleted) e.readCount = (e.readCount || 0) + 1;
    s.storyProgress[storyId] = e;
  });
}

/** 이야기/단편 목록의 "완료 항목 숨기기" 토글 — 영속. */
export function getStoryHideCompleted() {
  const s = getState();
  return !!(s.settings && s.settings.storyHideCompleted);
}
export function setStoryHideCompleted(v) {
  const next = !!v;
  update(s => {
    s.settings = s.settings || {};
    s.settings.storyHideCompleted = next;
  });
  return next;
}

/** 스토리 진입 시 호출 — lastOpenedAt 갱신. */
export function noteStoryOpened(storyId) {
  update(s => {
    s.storyProgress = s.storyProgress || {};
    const e = s.storyProgress[storyId] || _emptyStoryEntry();
    e.lastOpenedAt = todayKey();
    s.storyProgress[storyId] = e;
  });
}

// ─── UI 설정 (후리가나 등) ───────────────────────────────────────────────
/** 후리가나 표시 여부. 미설정/구버전 데이터는 true(ON) 로 간주. */
export function getFuriganaEnabled() {
  const s = getState();
  const v = s.settings && s.settings.furiganaEnabled;
  // 명시적으로 false 인 경우에만 OFF. (undefined/null 도 ON 으로.)
  return v !== false;
}

/** 후리가나 ON/OFF 저장. */
export function setFuriganaEnabled(enabled) {
  const next = !!enabled;
  update(s => {
    s.settings = s.settings || {};
    s.settings.furiganaEnabled = next;
  });
  return next;
}

/** 단어 이미지 카드 단계형 학습 (expose1→expose2→recall→confirm→quiz) ON/OFF.
 *  미설정/구버전 데이터는 true(ON) 로 간주. OFF 면 기존처럼 바로 퀴즈로. */
export function getVocabWarmupEnabled() {
  const s = getState();
  const v = s.settings && s.settings.vocabImageWarmupEnabled;
  return v !== false;
}

export function setVocabWarmupEnabled(enabled) {
  const next = !!enabled;
  update(s => {
    s.settings = s.settings || {};
    s.settings.vocabImageWarmupEnabled = next;
  });
  return next;
}

/** 단어 이미지 카드 recall 단계의 카운트다운 초. 허용값: 3 | 5 | 7. */
const RECALL_ALLOWED = [3, 5, 7];
const RECALL_DEFAULT = 3;

export function getVocabRecallSeconds() {
  const s = getState();
  const v = s.settings && s.settings.vocabRecallSeconds;
  return RECALL_ALLOWED.includes(v) ? v : RECALL_DEFAULT;
}

/** 잘못된 값(허용 외 / 문자열 / undefined)은 기본 3 초로 fallback. */
export function setVocabRecallSeconds(seconds) {
  const next = RECALL_ALLOWED.includes(seconds) ? seconds : RECALL_DEFAULT;
  update(s => {
    s.settings = s.settings || {};
    s.settings.vocabRecallSeconds = next;
  });
  return next;
}

export function todaySessionStats() {
  const s = getState();
  const t = todayKey();
  const sess = s.sessions[t];
  if (!sess) return { total: 0, correct: 0, wrong: 0, completed: false };
  const correct = sess.items.filter(i => i.correct).length;
  return {
    total: sess.items.length,
    correct,
    wrong: sess.items.length - correct,
    completed: !!sess.completed,
  };
}
