// 콘텐츠 학습 준비도 / 추천 유틸 (라운드 29 안정화).
//
// 데이터의 학습 의존성 필드(vocabIds/grammarIds — 핵심, optional* — 보조)를 바탕으로
// "이 독해/청해/이야기/회화 주제를 지금 하기에 얼마나 준비됐는가" 를 계산한다.
//
// 원칙:
//   - 의존성 필드가 없는 항목(N5 등 미태깅)은 'ready' 취급 — 기능 저하 없는 안전 기본값.
//   - "학습함" 판정은 reviewStates 에 해당 id 가 존재하는지 (1회 이상 노출).
//   - 분류 임계치는 상수로 관리. UI/추천/큐가 모두 같은 기준을 쓴다.
//   - locked 라도 진입을 막지 않는다 — UI 는 안내만 한다.
import { reading } from './data/reading.js';
import { listening } from './data/listening.js';
import { stories } from './data/stories.js';
import { conversationTopics } from './data/conversationTopics.js';
import { sentenceBank } from './data/sentenceBank.js';

/** 분류 임계치 — 핵심 의존성 학습 비율 기준. */
export const READINESS_READY_RATIO = 0.8;       // 이상 → 'ready'
export const READINESS_GOOD_NEXT_RATIO = 0.5;   // 이상 → 'good_next', 미만 → 'locked'
export const DEFAULT_REQUIRED_COVERAGE = 0.7;   // 항목별 requiredCoverage 기본값

function byId(list) { const m = new Map(); for (const x of list) m.set(x.id, x); return m; }
const READING_BY_ID = byId(reading);
const LISTENING_BY_ID = byId(listening);
const STORY_BY_ID = byId(stories);
const TOPIC_BY_ID = byId(conversationTopics);
const SENTENCE_BY_ID = byId(sentenceBank);

/**
 * 항목의 학습 의존성 — { vocabIds, grammarIds, optionalVocabIds, optionalGrammarIds }.
 * itemType: 'reading' | 'listening' | 'story' | 'conversationTopic' | 'sentence'
 * 알 수 없는 항목은 null.
 */
export function getItemDependency(itemType, itemId) {
  if (itemType === 'reading' || itemType === 'listening') {
    const it = (itemType === 'reading' ? READING_BY_ID : LISTENING_BY_ID).get(itemId);
    if (!it) return null;
    return {
      vocabIds: it.vocabIds || [], grammarIds: it.grammarIds || [],
      optionalVocabIds: it.optionalVocabIds || [], optionalGrammarIds: it.optionalGrammarIds || [],
      requiredCoverage: it.requiredCoverage || DEFAULT_REQUIRED_COVERAGE,
    };
  }
  if (itemType === 'story') {
    const s = STORY_BY_ID.get(itemId);
    if (!s) return null;
    return {
      // 핵심 = 학습 연결 UI 에도 노출되는 key*, 전체 = vocabularyIds/grammarIds
      vocabIds: s.keyVocabularyIds || [], grammarIds: s.keyGrammarIds || [],
      optionalVocabIds: (s.vocabularyIds || []).filter(id => !(s.keyVocabularyIds || []).includes(id)),
      optionalGrammarIds: (s.grammarIds || []).filter(id => !(s.keyGrammarIds || []).includes(id)),
      requiredCoverage: DEFAULT_REQUIRED_COVERAGE,
    };
  }
  if (itemType === 'conversationTopic') {
    const t = TOPIC_BY_ID.get(itemId);
    if (!t) return null;
    return {
      vocabIds: t.requiredVocabIds || [], grammarIds: t.requiredGrammarIds || [],
      optionalVocabIds: t.optionalVocabIds || [], optionalGrammarIds: t.optionalGrammarIds || [],
      requiredCoverage: DEFAULT_REQUIRED_COVERAGE,
    };
  }
  if (itemType === 'sentence') {
    const s = SENTENCE_BY_ID.get(itemId);
    if (!s) return null;
    return {
      vocabIds: s.vocabIds || [], grammarIds: s.grammarIds || [],
      optionalVocabIds: [], optionalGrammarIds: [],
      requiredCoverage: DEFAULT_REQUIRED_COVERAGE,
    };
  }
  return null;
}

/**
 * 핵심 의존성 대비 학습 커버리지.
 * @param {{vocabIds?:string[],grammarIds?:string[]}} item — 의존성 필드를 가진 데이터 항목 또는 getItemDependency 결과
 * @param {Object} reviewStates — storage state.reviewStates
 */
export function getLearnedCoverage(item, reviewStates) {
  const rs = reviewStates || {};
  const vIds = item.vocabIds || [];
  const gIds = item.grammarIds || [];
  const vocabKnown = vIds.filter(id => !!rs[id]).length;
  const grammarKnown = gIds.filter(id => !!rs[id]).length;
  const total = vIds.length + gIds.length;
  const known = vocabKnown + grammarKnown;
  return {
    vocabTotal: vIds.length, vocabKnown,
    grammarTotal: gIds.length, grammarKnown,
    totalKnownRatio: total === 0 ? 1 : known / total,
    missingVocabIds: vIds.filter(id => !rs[id]),
    missingGrammarIds: gIds.filter(id => !rs[id]),
  };
}

/**
 * 'ready' | 'good_next' | 'locked'.
 * 의존성이 없는 항목은 'ready' (안전 기본값).
 */
export function classifyContentReadiness(item, reviewStates) {
  const cov = getLearnedCoverage(item, reviewStates);
  if (cov.vocabTotal + cov.grammarTotal === 0) return 'ready';
  if (cov.totalKnownRatio >= READINESS_READY_RATIO) return 'ready';
  if (cov.totalKnownRatio >= READINESS_GOOD_NEXT_RATIO) return 'good_next';
  return 'locked';
}

// ── 추천 ─────────────────────────────────────────────────────────────
// 정책: "대부분 배웠고 새 항목이 조금 있는" 콘텐츠 우선.
//   1순위: ready + 미완료 (totalKnownRatio 낮은 순 — 너무 쉬운 것 후순위)
//   2순위: good_next (missing 수 적은 순)
//   3순위: locked (missing 수 적은 순) — 추천이 비지 않게 후순위로 포함
function levelPool(list, level) {
  const allow = level === 'N4' ? ['N4', 'N5'] : [level];
  return list.filter(x => allow.includes(x.level));
}

function rankItems(items, reviewStates, completedIds) {
  const done = completedIds || new Set();
  const scored = items.map(it => {
    const cov = getLearnedCoverage(it, reviewStates);
    const cls = classifyContentReadiness(it, reviewStates);
    const missing = cov.missingVocabIds.length + cov.missingGrammarIds.length;
    const completed = done.has(it.id) || !!(reviewStates || {})[it.id];
    // 클래스 우선 → 미완료 우선 → ready 는 "새 항목이 있는" 쪽 우선(ratio 낮은 순),
    // good_next/locked 는 missing 적은 순.
    const clsRank = cls === 'ready' ? 0 : cls === 'good_next' ? 1 : 2;
    const inner = cls === 'ready' ? cov.totalKnownRatio : missing;
    return { item: it, readiness: cls, coverage: cov, completed,
             _key: [clsRank, completed ? 1 : 0, inner] };
  });
  scored.sort((a, b) => {
    for (let i = 0; i < a._key.length; i++) {
      if (a._key[i] !== b._key[i]) return a._key[i] - b._key[i];
    }
    return 0;
  });
  return scored.map(({ _key, ...rest }) => rest);
}

export function getRecommendedReading(level, reviewStates, opts) {
  const n = (opts && opts.count) || 5;
  return rankItems(levelPool(reading, level), reviewStates, opts && opts.completedIds).slice(0, n);
}
export function getRecommendedListening(level, reviewStates, opts) {
  const n = (opts && opts.count) || 5;
  return rankItems(levelPool(listening, level), reviewStates, opts && opts.completedIds).slice(0, n);
}
export function getRecommendedStories(level, reviewStates, opts) {
  const n = (opts && opts.count) || 5;
  return rankItems(levelPool(stories, level), reviewStates, opts && opts.completedIds).slice(0, n);
}
export function getRecommendedConversationTopics(level, reviewStates, opts) {
  const n = (opts && opts.count) || 5;
  const pool = levelPool(conversationTopics, level).map(t => ({
    ...t, ...getItemDependency('conversationTopic', t.id),
  }));
  return rankItems(pool, reviewStates, opts && opts.completedIds).slice(0, n);
}

/** UI 배지용 짧은 라벨. */
export function readinessLabel(cls) {
  if (cls === 'ready') return '준비 완료';
  if (cls === 'good_next') return '조금 어려움';
  return '먼저 학습 추천';
}
