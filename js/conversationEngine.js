// 회화 한 주제의 진행 상태를 관리하는 경량 엔진. 외부 API 호출 없음.
// 질문은 오직 conversationTopics.starterQuestions 안에서만 선택한다 — 새로운 어휘/문법을
// 임의 생성하지 않는다 (모듈 제약).
import { conversationTopics } from './data/conversationTopics.js';
import { evaluateConversationAnswer } from './localEvaluator.js';

/**
 * @param {string} topicId
 * @returns {null | object} — 엔진 인스턴스. topic id 가 없으면 null.
 */
export function createEngine(topicId) {
  const topic = conversationTopics.find(t => t.id === topicId);
  if (!topic) return null;

  let qIndex = 0;
  /** @type {Array<{question:object, userText:string, evaluation:object}>} */
  const turns = [];

  function currentQuestion() {
    return topic.starterQuestions[qIndex] || null;
  }

  function submitAnswer(userText) {
    const q = currentQuestion();
    if (!q) return null;
    const evaluation = evaluateConversationAnswer({ topic, question: q, userText });
    turns.push({ question: q, userText: String(userText ?? ''), evaluation });
    return evaluation;
  }

  function next() {
    if (qIndex < topic.starterQuestions.length) qIndex++;
    return currentQuestion();
  }

  function isDone() {
    return qIndex >= topic.starterQuestions.length;
  }

  function summary() {
    const total = turns.length;
    const avg = total === 0
      ? 0
      : Math.round(turns.reduce((a, t) => a + (t.evaluation?.score || 0), 0) / total);
    return {
      topicId: topic.id,
      titleKo: topic.titleKo,
      level: topic.level,
      totalAnswered: total,
      totalQuestions: topic.starterQuestions.length,
      averageScore: avg,
      turns: turns.slice(),
    };
  }

  return {
    topic,
    currentQuestion,
    currentIndex: () => qIndex,
    totalQuestions: () => topic.starterQuestions.length,
    submitAnswer,
    next,
    isDone,
    summary,
  };
}

// 향후 conversationProgress 저장이 필요해지면 여기 또는 별도 어댑터에서 storage 연동.
// 현재 MVP 0.1 은 메모리 상태만 유지.
