// localStorage 영속화 래퍼. 모든 데이터는 단일 키 아래 JSON 으로 저장.
const KEY = 'jlpt10min:v1';

const defaultState = () => ({
  userProgress: {
    targetLevel: 'N5',        // N5 | N4 | N3 | N2
    lastStudiedDate: null,     // 'YYYY-MM-DD'
    totalSessions: 0,
    streakDays: 0,
  },
  // ReviewState: itemId -> { itemType, correctCount, wrongCount, dueAt(ms), interval(days), ease }
  reviewStates: {},
  // FailureNote: itemId -> { itemType, wrongCount, lastWrongAt, reason }
  failureNotes: {},
  // FavoriteItem: itemId -> { itemType, memo, createdAt }
  favorites: {},
  // DailySession: 'YYYY-MM-DD' -> { completed: bool, items: [{itemType,itemId,correct}] }
  sessions: {},
  // 마지막으로 본 새 단어/문법 id 추적 (커리큘럼이 새 항목 고를 때 사용)
  seenItemIds: {},
  // 회화 진행도: { [topicId]: { attempts[], lastScore, bestScore, completedCount, updatedAt } }
  conversationProgress: {},
  // 스토리 진행도: { [storyId]: { lastIndex, completed, lastOpenedAt, readCount } }
  storyProgress: {},
  // UI 설정 — 학습 설정 카드에서 사용자가 조정.
  // 구버전 localStorage 에 일부 필드가 없어도 state.get*Enabled() 가 안전한 기본값으로 대체.
  settings: {
    furiganaEnabled: true,        // 후리가나 ON/OFF (기본 ON)
    vocabImageWarmupEnabled: true,// 이미지 카드 단계형 학습 (기본 ON)
    vocabRecallSeconds: 3,        // recall 카운트다운 (3 | 5 | 7)
    storyHideCompleted: false,    // 이야기/단편 목록에서 완료한 항목 숨김 (기본 OFF)
    storyRomajiEnabled: true,     // 스토리 본문 로마자 줄 표시 (기본 ON)
    storyTranslationEnabled: true,// 스토리 본문 한국어 해석 줄 표시 (기본 ON)
    themeMode: 'system',          // 'system' | 'light' | 'dark'
  },
});

let cache = null;

function load() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    cache = defaultState();
  }
  return cache;
}

function save() {
  if (!cache) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('localStorage 저장 실패', e);
  }
}

export function getState() { return load(); }

export function update(mutator) {
  const s = load();
  mutator(s);
  save();
  return s;
}

export function resetAll() {
  cache = defaultState();
  save();
}

export function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysBetween(aIso, bIso) {
  if (!aIso || !bIso) return 0;
  const a = new Date(aIso + 'T00:00:00');
  const b = new Date(bIso + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}
