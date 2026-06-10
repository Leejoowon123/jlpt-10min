// 콘텐츠 저장소 — 화면 코드의 단일 데이터 접근 계층 (라운드 17, 2단계).
//
// 문제: 30+ 파일이 js/data/*.js 를 정적 import → JSON 분리(dataLoader)를 해도
//       화면이 그 데이터를 쓰지 않으면 의미가 없고, 전부 async 로 바꾸면 위험.
//
// 해법: 동기 getter + 비동기 preload 의 이중 인터페이스.
//   - 시작 직후: 기존 JS 정적 데이터를 **동기 반환** — 화면 코드는 await 불필요,
//     기존 render 흐름/qa 시나리오가 그대로 동작한다.
//   - preloadRepositoryLevel(level) 완료 후: 해당 level/type 슬라이스가
//     dataLoader 결과(JSON 우선, 실패 시 JS fallback)로 교체된다.
//     이후의 동기 getter 호출은 교체된 데이터를 반환.
//   - JSON 과 JS 가 동기화되어 있는 한 (smoke 의 drift 검증) 화면 차이는 없고,
//     N5 정적 데이터를 제거하는 마지막 단계에서도 getter 시그니처는 불변.
//
// 점진 이전: storyView → study(card lookup) → questions.js → 나머지.
// 최종 단계에서 BASE 의 정적 import 를 dataLoader 부트스트랩으로 대체하면
// js/data/*.js 는 compatibility wrapper 로 축소된다.

import { vocab } from './data/vocab.js';
import { grammar } from './data/grammar.js';
import { reading } from './data/reading.js';
import { listening } from './data/listening.js';
import { kanji } from './data/kanji.js';
import { stories } from './data/stories.js';
import { sentenceBank } from './data/sentenceBank.js';
import { grammarPairs } from './data/grammarPairs.js';
import { conversationTopics } from './data/conversationTopics.js';
import {
  loadLevelData, clearDataCache,
  VALID_LEVELS, VALID_TYPES,
} from './dataLoader.js';

// 기존 JS 정적 데이터 — 부트스트랩 베이스. (최종 단계에서 제거 대상)
const BASE = {
  vocab, grammar, reading, listening, kanji,
  stories, sentenceBank, grammarPairs, conversationTopics,
};

// preload 로 교체된 슬라이스: `${level}:${type}` → array
const overrides = new Map();
// preload 가 끝난 레벨
const loadedLevels = new Set();
// id lookup 인덱스 — `${type}:${id}` → item. overrides 변경 시 무효화.
let idIndex = null;
// reset 세대 — reset 이후에 완료되는 이전 preload 가 stale 데이터를 쓰지 않도록 가드.
let generation = 0;

function assertType(type) {
  if (!VALID_TYPES.includes(type)) {
    throw new Error(`contentRepository: invalid type "${type}"`);
  }
}
function assertLevel(level) {
  if (!VALID_LEVELS.includes(level)) {
    throw new Error(`contentRepository: invalid level "${level}"`);
  }
}

/** 특정 레벨/영역의 항목 배열 — 동기. override 있으면 그것, 없으면 JS base 필터. */
export function getItems(type, level) {
  assertType(type);
  assertLevel(level);
  const key = `${level}:${type}`;
  if (overrides.has(key)) return overrides.get(key);
  return BASE[type].filter(item => item.level === level);
}

/** 영역의 전체 레벨 병합 배열 — 동기. 목록 화면(이야기 ALL 필터 등)용. */
export function getAllItems(type) {
  assertType(type);
  const out = [];
  for (const lvl of VALID_LEVELS) out.push(...getItems(type, lvl));
  return out;
}

// ── 편의 getter ────────────────────────────────────────────────────────────
export const getVocab              = (level) => getItems('vocab', level);
export const getGrammar            = (level) => getItems('grammar', level);
export const getReading            = (level) => getItems('reading', level);
export const getListening          = (level) => getItems('listening', level);
export const getKanji              = (level) => getItems('kanji', level);
export const getStories            = (level) => getItems('stories', level);
export const getSentenceBank       = (level) => getItems('sentenceBank', level);
export const getGrammarPairs       = (level) => getItems('grammarPairs', level);
export const getConversationTopics = (level) => getItems('conversationTopics', level);

// ── id lookup ──────────────────────────────────────────────────────────────
function buildIndex() {
  idIndex = new Map();
  for (const type of VALID_TYPES) {
    for (const item of getAllItems(type)) {
      if (item && item.id) idIndex.set(`${type}:${item.id}`, item);
    }
  }
}

/** type 내에서 id 로 항목 검색 — O(1) (인덱스 lazy build). 없으면 null. */
export function findItem(type, id) {
  assertType(type);
  if (!id) return null;
  if (!idIndex) buildIndex();
  return idIndex.get(`${type}:${id}`) || null;
}

export const findVocab   = (id) => findItem('vocab', id);
export const findGrammar = (id) => findItem('grammar', id);
export const findStory   = (id) => findItem('stories', id);

// ── preload (JSON 교체) ────────────────────────────────────────────────────
/**
 * 한 레벨의 전 영역을 dataLoader 로 로드해 repository 슬라이스를 교체.
 * dataLoader 가 내부에서 JSON 우선 + JS fallback 을 처리하므로,
 * JSON 이 없는 영역도 안전하게 동일 데이터로 채워진다.
 */
export async function preloadRepositoryLevel(level) {
  assertLevel(level);
  const gen = generation;    // 시작 시점 세대 기록
  const results = await Promise.all(VALID_TYPES.map(async (type) => {
    try {
      const arr = await loadLevelData(level, type);
      return [type, arr];
    } catch {
      return [type, null];   // 영역 하나 실패해도 나머지는 교체
    }
  }));
  // reset 이 끼어들었으면 stale 결과 폐기 — 새 세대의 preload 만 반영.
  if (gen !== generation) return false;
  for (const [type, arr] of results) {
    if (Array.isArray(arr)) overrides.set(`${level}:${type}`, arr);
  }
  loadedLevels.add(level);
  idIndex = null;            // lookup 인덱스 재구축
  return true;
}

/** preload 가 완료된 레벨인지. 화면이 중복 preload 를 피할 때 사용. */
export function isRepositoryLevelLoaded(level) {
  return loadedLevels.has(level);
}

/** 테스트 격리 — overrides/인덱스/dataLoader 캐시 모두 초기화.
 *  세대를 올려 reset 이전에 시작된 in-flight preload 의 stale 쓰기를 차단. */
export function resetRepositoryForTest() {
  generation++;
  overrides.clear();
  loadedLevels.clear();
  idIndex = null;
  clearDataCache();
}
