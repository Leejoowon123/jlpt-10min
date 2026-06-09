// 회화 주제별 학습 준비도 계산.
// 사용자가 학습 경험을 쌓은 vocab/grammar 비율을 보고, 해당 주제를 회화로 진행할
// 준비가 얼마나 되어 있는지 0~100% 로 반환한다.
//
// MVP 기준 (단순):
//   - reviewStates 에 해당 itemId 가 존재하면 "학습 경험 있음" → 1점.
//   - 추후 확장 시 correctCount / wrongCount 가중치 도입 가능.
import { conversationTopics } from './data/conversationTopics.js';
import { getState } from './storage.js';
import { topicSentenceCoverage } from './sentenceAccess.js';

const READY_THRESHOLD = 70;

function known(rs, id) { return !!rs[id]; }
function familiar(rs, id) {
  const r = rs[id];
  return !!r && r.correctCount > 0;
}

/**
 * @param {string} [level] — 필터. 미지정 시 전 레벨.
 * @returns {Array<{
 *   topicId:string, titleKo:string, level:string, ready:boolean,
 *   vocabKnown:number, vocabTotal:number,
 *   grammarKnown:number, grammarTotal:number,
 *   percent:number,
 * }>}
 */
export function getConversationReadiness(level) {
  const rs = (getState().reviewStates) || {};
  return conversationTopics
    .filter(t => !level || t.level === level)
    .map(t => {
      const vT = t.requiredVocabIds.length;
      const gT = t.requiredGrammarIds.length;
      const vK = t.requiredVocabIds.filter(id => known(rs, id)).length;
      const gK = t.requiredGrammarIds.filter(id => known(rs, id)).length;
      const total = vT + gT;
      const know = vK + gK;
      const percent = total === 0 ? 0 : Math.round(know / total * 100);
      // sentenceBank 커버리지: 주제와 연관된 문장 / 그 중 학습한 문장.
      // UI 가 과하게 노출하지 않도록 별도 필드로 분리.
      const cov = topicSentenceCoverage(t.id, rs);
      return {
        topicId: t.id,
        titleKo: t.titleKo,
        level: t.level,
        ready: percent >= READY_THRESHOLD,
        vocabKnown: vK, vocabTotal: vT,
        grammarKnown: gK, grammarTotal: gT,
        percent,
        relatedSentenceCount: cov.relatedCount,
        knownSentenceCount:   cov.knownCount,
        partialSentenceCount: cov.partialCount,
        lockedSentenceCount:  cov.lockedCount,
      };
    });
}

/** 사용자에게 "이 주제는 본격적인 학습이 더 필요" 라고 표기할 임계치. UI 노출용. */
export const READINESS_READY_THRESHOLD = READY_THRESHOLD;

// (향후 확장 자리) 더 정밀한 평가가 필요할 때 옵션을 추가 가능:
//   - 'familiar' 가중치 사용
//   - 최근 학습 시점 가중치
//   - 실패 노트에 있으면 패널티 등
export function _internal_familiarityBased(level) {
  const rs = (getState().reviewStates) || {};
  return conversationTopics
    .filter(t => !level || t.level === level)
    .map(t => {
      const ids = [...t.requiredVocabIds, ...t.requiredGrammarIds];
      const fam = ids.filter(id => familiar(rs, id)).length;
      return { topicId: t.id, familiarPercent: ids.length === 0 ? 0 : Math.round(fam / ids.length * 100) };
    });
}
