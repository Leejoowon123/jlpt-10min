// 콘텐츠 데이터 로더 — 레벨별/영역별 JSON 동적 로드 + JS 데이터 fallback.
//
// 배경 (라운드 16):
//   현재 모든 콘텐츠는 js/data/*.js 정적 import (~440KB JS). N3/N2 확장 시
//   초기 파싱 비용이 커지므로, 대용량 콘텐츠는 data/<level>/<type>.json 으로
//   분리하고 필요한 레벨/영역만 fetch 하는 구조로 점진 이전한다.
//
// 설계 원칙:
//   1. fetch 우선, 실패 시 기존 JS 데이터 fallback — 회귀 위험 0.
//      (JSON 미작성 영역 / 오프라인 첫 진입 / file:// 환경 모두 안전)
//   2. 메모리 캐시 — 같은 JSON 을 두 번 fetch 하지 않음.
//   3. 반환 스키마는 기존 JS 배열과 동일 — 화면 코드 수정 불필요.
//   4. GitHub Pages 호환 — 상대 경로 `data/n5/vocab.json` (hash route 와 충돌 없음).
//   5. 서버/API 불필요 — 정적 호스팅 + Service Worker 캐시만으로 동작.
//
// 점진 이전 순서 (docs/data-loading-plan.md):
//   N4 신규 JSON → N5 일부 이전 → JS data 는 compatibility wrapper 로 축소.

export const VALID_LEVELS = ['N5', 'N4', 'N3', 'N2'];
export const VALID_TYPES = [
  'vocab', 'grammar', 'reading', 'listening', 'kanji',
  'stories', 'sentenceBank', 'grammarPairs', 'conversationTopics',
];

// type → JS fallback 모듈 경로 + named export
const JS_FALLBACK = {
  vocab:              { path: './data/vocab.js',              name: 'vocab' },
  grammar:            { path: './data/grammar.js',            name: 'grammar' },
  reading:            { path: './data/reading.js',            name: 'reading' },
  listening:          { path: './data/listening.js',          name: 'listening' },
  kanji:              { path: './data/kanji.js',              name: 'kanji' },
  stories:            { path: './data/stories.js',            name: 'stories' },
  sentenceBank:       { path: './data/sentenceBank.js',       name: 'sentenceBank' },
  grammarPairs:       { path: './data/grammarPairs.js',       name: 'grammarPairs' },
  conversationTopics: { path: './data/conversationTopics.js', name: 'conversationTopics' },
};

// 메모리 캐시: `${level}:${type}` → Promise<array>
// Promise 자체를 캐시해 동시 호출도 fetch 1회로 합쳐진다.
const cache = new Map();

// 테스트 backdoor — Node 환경에서 fetch 경로를 검증할 때 주입.
let _fetchImpl = null;
export function _setFetchForTest(fn) { _fetchImpl = fn; }
export function _resetFetchForTest() { _fetchImpl = null; }

function resolveFetch() {
  if (_fetchImpl) return _fetchImpl;
  // 브라우저(또는 fetch 가용 환경)에서만. Node smoke 는 기본적으로 fallback 경로.
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    return window.fetch.bind(window);
  }
  return null;
}

function assertValid(level, type) {
  if (!VALID_LEVELS.includes(level)) {
    throw new Error(`dataLoader: invalid level "${level}" (allowed: ${VALID_LEVELS.join(', ')})`);
  }
  if (!VALID_TYPES.includes(type)) {
    throw new Error(`dataLoader: invalid type "${type}" (allowed: ${VALID_TYPES.join(', ')})`);
  }
}

/** JSON 경로 — index.html 기준 상대 경로. GitHub Pages 하위 경로에서도 동작. */
export function jsonPathFor(level, type) {
  return `data/${level.toLowerCase()}/${type}.json`;
}

async function fetchJson(level, type) {
  const f = resolveFetch();
  if (!f) return null;                       // fetch 불가 환경 → fallback
  try {
    const res = await f(jsonPathFor(level, type), { cache: 'no-cache' });
    if (!res || !res.ok) return null;        // 404 등 → fallback
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;                             // 네트워크/파싱 실패 → fallback
  }
}

async function loadFromJsFallback(level, type) {
  const def = JS_FALLBACK[type];
  const mod = await import(def.path);
  const all = mod[def.name] || [];
  return all.filter(item => item.level === level);
}

/**
 * 레벨/영역 데이터 로드. JSON 우선, 실패 시 JS fallback.
 * 반환 배열의 스키마는 기존 js/data/*.js 와 동일.
 * @returns {Promise<Array>}
 */
export function loadLevelData(level, type) {
  assertValid(level, type);
  const key = `${level}:${type}`;
  if (cache.has(key)) return cache.get(key);
  const p = (async () => {
    const fromJson = await fetchJson(level, type);
    if (fromJson) return fromJson;
    return loadFromJsFallback(level, type);
  })();
  cache.set(key, p);
  // 실패한 Promise 가 캐시에 남지 않도록 — reject 시 캐시 제거 후 재시도 가능.
  p.catch(() => cache.delete(key));
  return p;
}

// ── 편의 wrapper ───────────────────────────────────────────────────────────
export const loadVocab              = (level) => loadLevelData(level, 'vocab');
export const loadGrammar            = (level) => loadLevelData(level, 'grammar');
export const loadReading            = (level) => loadLevelData(level, 'reading');
export const loadListening          = (level) => loadLevelData(level, 'listening');
export const loadKanji              = (level) => loadLevelData(level, 'kanji');
export const loadStories            = (level) => loadLevelData(level, 'stories');
export const loadSentenceBank       = (level) => loadLevelData(level, 'sentenceBank');
export const loadGrammarPairs       = (level) => loadLevelData(level, 'grammarPairs');
export const loadConversationTopics = (level) => loadLevelData(level, 'conversationTopics');

/** 한 레벨의 모든 영역을 미리 로드 (PWA 오프라인 대비 / 레벨 전환 시 워밍). */
export function preloadLevel(level) {
  if (!VALID_LEVELS.includes(level)) {
    return Promise.reject(new Error(`dataLoader: invalid level "${level}"`));
  }
  return Promise.all(VALID_TYPES.map(t => loadLevelData(level, t)));
}

/** 캐시 비우기 — 테스트 격리 / 콘텐츠 갱신 후 강제 재로드용. */
export function clearDataCache() {
  cache.clear();
}

/** 테스트/디버그 — 현재 캐시 키 목록. */
export function _cacheKeys() {
  return Array.from(cache.keys());
}
