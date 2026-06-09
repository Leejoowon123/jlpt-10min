// sentenceBank 접근 유틸.
// 회화 엔진/단어 학습/UI 어디에서나 "배운 어휘·문법 범위 안의 문장" 만 골라낼 수 있게 한다.

import { sentenceBank } from './data/sentenceBank.js';
import { conversationTopics } from './data/conversationTopics.js';
import { grammar } from './data/grammar.js';

/** reviewStates 에 itemId 가 있으면 "학습 경험 있음". */
function isKnown(reviewStates, itemId) {
  return !!(reviewStates && reviewStates[itemId]);
}
/** correctCount > 0 이면 "익숙함". */
function isFamiliar(reviewStates, itemId) {
  const st = reviewStates && reviewStates[itemId];
  return !!(st && st.correctCount > 0);
}

/** 레벨 필터 (해당 레벨만 정확히). */
export function getSentencesByLevel(level) {
  return sentenceBank.filter(s => s.level === level);
}

/** canUseInConversation === true 인 문장만. */
export function getConversationUsableSentences(level) {
  return getSentencesByLevel(level).filter(s => s.canUseInConversation);
}

/**
 * "배운 문장" — 문장이 요구하는 vocab/grammar 가 모두 reviewStates 안에 있을 때.
 * 요구 항목이 0개인 문장은 known 으로 인정하지 않는다 (판정 근거 부족).
 */
export function getKnownSentences(level, reviewStates) {
  return getSentencesByLevel(level).filter(s => sentenceIsKnown(s, reviewStates));
}

export function sentenceIsKnown(sentence, reviewStates) {
  if (!reviewStates) return false;
  const totalRefs = (sentence.vocabIds?.length || 0) + (sentence.grammarIds?.length || 0);
  if (totalRefs === 0) return false;
  const allVocabKnown   = (sentence.vocabIds   || []).every(id => isKnown(reviewStates, id));
  const allGrammarKnown = (sentence.grammarIds || []).every(id => isKnown(reviewStates, id));
  return allVocabKnown && allGrammarKnown;
}

/** 문장 1개의 학습 비율 (0~1). 학습된 ref 개수 / 전체 ref 개수. */
export function sentenceLearnedRatio(sentence, reviewStates) {
  const refs = [...(sentence.vocabIds || []), ...(sentence.grammarIds || [])];
  if (refs.length === 0) return 0;
  const learned = refs.filter(id => isKnown(reviewStates, id)).length;
  return learned / refs.length;
}

/**
 * 회화 주제에 "연관된" 문장.
 *  - 주제 레벨과 동일 + canUseInConversation
 *  - 주제의 requiredVocabIds 또는 requiredGrammarIds 와 한 개라도 겹침
 *  - 또는 문장의 sourceId === topicId (직접 출처가 그 주제)
 */
export function getSentencesForTopic(topicId, reviewStates) {
  const topic = conversationTopics.find(t => t.id === topicId);
  if (!topic) return [];
  const tVocab   = new Set(topic.requiredVocabIds   || []);
  const tGrammar = new Set(topic.requiredGrammarIds || []);

  const pool = getConversationUsableSentences(topic.level);
  return pool.filter(s => {
    if (s.sourceType === 'conversation' && s.sourceId === topicId) return true;
    if ((s.vocabIds   || []).some(id => tVocab.has(id)))   return true;
    if ((s.grammarIds || []).some(id => tGrammar.has(id))) return true;
    return false;
  });
}

/** 주제에 연관된 전체/학습됨/부분/잠금 개수. */
export function topicSentenceCoverage(topicId, reviewStates) {
  const groups = getPracticeSentencesForTopic(topicId, reviewStates);
  return {
    relatedCount: groups.known.length + groups.partial.length + groups.locked.length,
    knownCount:   groups.known.length,
    partialCount: groups.partial.length,
    lockedCount:  groups.locked.length,
    relatedIds:   [...groups.known, ...groups.partial, ...groups.locked].map(s => s.id),
  };
}

/**
 * 한 문장의 사용자 입장에서 본 분류.
 *   - 'known'   — refs 가 모두 reviewStates 안에 있거나, refs 자체가 없음(일반 표현)
 *   - 'partial' — refs 일부가 reviewStates 안에 있음 (부분 학습)
 *   - 'locked'  — refs 가 있지만 어느 것도 학습 안 됨
 */
export function classifyForUser(sentence, reviewStates) {
  const refs = [...(sentence.vocabIds || []), ...(sentence.grammarIds || [])];
  if (refs.length === 0) return 'known';
  const rs = reviewStates || {};
  const matched = refs.filter(id => !!rs[id]).length;
  if (matched === refs.length) return 'known';
  if (matched > 0)             return 'partial';
  return 'locked';
}

/** getSentencesForTopic 결과 중 sentenceIsKnown true 만. */
export function getKnownSentencesForTopic(topicId, reviewStates) {
  return getSentencesForTopic(topicId, reviewStates)
    .filter(s => sentenceIsKnown(s, reviewStates));
}

/**
 * 주제에 연관된 문장들을 학습 정도로 묶어 반환.
 * UI 의 "관련 표현 더 보기" / "잠긴 표현 N개" 표시에 사용.
 *
 * @returns {{known: SentenceItem[], partial: SentenceItem[], locked: SentenceItem[]}}
 */
export function getPracticeSentencesForTopic(topicId, reviewStates) {
  const related = getSentencesForTopic(topicId, reviewStates);
  const out = { known: [], partial: [], locked: [] };
  for (const s of related) {
    const cls = classifyForUser(s, reviewStates);
    out[cls].push(s);
  }
  return out;
}

/**
 * 평가 결과에 동봉할 "학습한 문장 기반 모범 답안" 1개를 선택.
 * 우선순위 (점수 가중):
 *   1) 주제와 관련 (getSentencesForTopic 통과) — 진입 조건
 *   2) question.expectedPatterns 의 패턴이 sentence.grammarIds 와 매칭
 *   3) sentenceIsKnown 인 문장 중에서만 후보
 *   4) canUseInConversation === true (getSentencesForTopic 가 이미 보장)
 *
 * 학습한 문장이 없으면 null 반환 → 호출자가 question.sampleAnswers[0] 로 폴백.
 * 절대 새 문장을 생성하지 않는다.
 *
 * @returns {SentenceItem|null}
 */
export function pickBestSampleSentence(topicId, question, reviewStates) {
  const known = getKnownSentencesForTopic(topicId, reviewStates);
  if (known.length === 0) return null;

  // expected pattern 라벨(예: '〜は〜です') → grammar id 매핑
  const expectedGrammarIds = new Set();
  for (const p of (question?.expectedPatterns || [])) {
    const g = grammar.find(gi => gi.pattern === p);
    if (g) expectedGrammarIds.add(g.id);
  }

  const topic = conversationTopics.find(t => t.id === topicId);
  const topicTags = new Set(topic?.situationTags || []);

  const scored = known.map(s => {
    let score = 0;
    if ((s.grammarIds   || []).some(gid => expectedGrammarIds.has(gid))) score += 10;
    if ((s.situationTags || []).some(t => topicTags.has(t))) score += 5;
    // 직접 출처가 이 주제면 약간의 가점
    if (s.sourceType === 'conversation' && s.sourceId === topicId) score += 3;
    return { sentence: s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].sentence;
}
