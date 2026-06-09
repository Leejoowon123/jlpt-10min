// 규칙 기반 일본어 회화 답변 평가기 (LLM/외부 API 미사용).
// 1차 구현 — 어휘 매칭 + 정규식 기반 문법 패턴 검출.
// 추후 온디바이스 LLM 도입 시 같은 평가 인터페이스를 유지하며 내부 구현만 교체.

import { vocab } from './data/vocab.js';
import { pickBestSampleSentence, getPracticeSentencesForTopic } from './sentenceAccess.js';
import { getState } from './storage.js';

/** 공백/구두점 정리 + 양끝 trim. 본격적인 형태소 정규화는 추후 확장. */
export function normalizeJapanese(text) {
  if (typeof text !== 'string') return '';
  return text
    .trim()
    .replace(/[\s　]+/g, ' ')         // 전각/반각 공백 → 단일 반각 공백
    .replace(/,/g, '、')                   // 반각 콤마 → 일본어 쉼표
    .replace(/(?<!\.)\.(?!\.)/g, '。');    // 반각 마침표(연속 아닌 경우만) → 일본어 마침표
}

/** 일본어 문자(히라가나/가타카나/한자) 개수. */
function countJpChars(s) {
  return (s.match(/[぀-ゟ゠-ヿ一-鿿]/g) || []).length;
}

/** 답변 안에서 주제의 필수 vocab.word / reading 이 사용됐는지 검출. */
export function detectKnownVocabulary(text, vocabIds) {
  const norm = text || '';
  const out = [];
  for (const id of vocabIds || []) {
    const v = vocab.find(x => x.id === id);
    if (!v) continue;
    if (norm.includes(v.word) || norm.includes(v.reading)) {
      out.push({ id, word: v.word, reading: v.reading, meaningKo: v.meaningKo });
    }
  }
  return out;
}

// 자주 등장할 회화 패턴의 정규식 매핑.
// expectedPatterns 에 들어 있는 라벨을 키로 사용. 누락된 라벨은 매칭 실패로 처리.
const PATTERN_REGEX = {
  '〜は〜です':              /は[\s\S]*?です/,
  '〜が〜です':              /が[\s\S]*?です/,
  '〜です':                  /です/,
  '〜を〜ます':              /を[\s\S]*?ます/,
  '〜ています':              /ています/,
  '〜たいです':              /たいです/,
  '〜が好きです':            /が好きです/,
  '〜ましょう':              /ましょう/,
  '〜ませんか':              /ませんか/,
  '〜てください':            /てください/,
  '〜てもいいです':          /てもいいです/,
  '〜てはいけません':        /てはいけません/,
  '〜があります':            /があります/,
  '〜がいます':              /がいます/,
  '〜はいません':            /はいません|いません/,
  '〜から':                  /から/,
  '〜まで':                  /まで/,
  '〜にあります':            /にあります/,
  '〜人です':                /[一二三四五六七八九十0-9０-９]+人です/,
  '〜時に':                  /時に/,
  '〜時に起きます':          /時に起きます/,
  '〜をください':            /をください/,
  '〜をお願いします':        /をお願いします/,
  '〜じゃありません':        /じゃありません/,
  'はい':                    /^はい/,
  'いいえ':                  /^いいえ/,
  'あそこです':              /あそこです/,
  'いいですね':              /いいですね/,
  'はい、〜です':            /^はい[、\s][\s\S]*です/,
  'いいえ、〜じゃありません': /^いいえ[、\s][\s\S]*じゃありません/,
  'はい〜ましょう':          /^はい[\s\S]*ましょう|ましょう/,
};

/**
 * 답변에서 expectedPatterns 중 매칭되는 라벨을 반환.
 * (requiredGrammarIds 는 향후 형태소 분석 도입 후 활용 자리 — 현재는 hint 전용.)
 */
export function detectGrammarPattern(text, _grammarIds, expectedPatterns) {
  const norm = text || '';
  const out = [];
  for (const p of expectedPatterns || []) {
    const re = PATTERN_REGEX[p];
    if (re && re.test(norm)) out.push(p);
  }
  return out;
}

function buildMissingVocab(topic) {
  return (topic?.requiredVocabIds || []).map(id => {
    const v = vocab.find(x => x.id === id);
    return v ? { id, word: v.word, reading: v.reading } : { id };
  });
}

/**
 * 평가 결과에 동봉할 sentenceBank 기반 추천 묶음.
 * - knownSampleSentence: 사용자가 학습한 표현 중 1개 (없으면 null)
 * - relatedPracticeSentences: known+partial 합산 후 최대 3개 (locked 제외)
 *
 * 추천은 sentenceBank 안의 항목으로만 구성. 새 문장 생성 없음.
 */
function buildSentenceRecommendations(topic, question, reviewStates) {
  if (!topic) {
    return { knownSampleSentence: null, relatedPracticeSentences: [], lockedSentenceCount: 0 };
  }
  const known = pickBestSampleSentence(topic.id, question, reviewStates);
  const groups = getPracticeSentencesForTopic(topic.id, reviewStates);
  const knownId = known?.id || null;
  const related = [
    ...groups.known
      .filter(s => s.id !== knownId)
      .map(s => ({ id: s.id, ja: s.ja, ko: s.ko, status: 'known' })),
    ...groups.partial
      .filter(s => s.id !== knownId)
      .map(s => ({ id: s.id, ja: s.ja, ko: s.ko, status: 'partial' })),
  ].slice(0, 3);
  return {
    knownSampleSentence: known
      ? { id: known.id, ja: known.ja, ko: known.ko }
      : null,
    relatedPracticeSentences: related,
    lockedSentenceCount: groups.locked.length,
  };
}

/**
 * @returns {{
 *   ok:boolean, score:number,
 *   usedVocab:Array, missingVocab:Array,
 *   detectedPatterns:string[], missingPatterns:string[],
 *   hints:Array<{issue:string, ko:string, exampleJa:string}>,
 *   sampleAnswer:{ja:string, ko:string}|null,
 * }}
 */
export function evaluateConversationAnswer({ topic, question, userText, reviewStates }) {
  const norm = normalizeJapanese(userText || '');
  const expected = question?.expectedPatterns || [];
  const sample = question?.sampleAnswers?.[0] || null;
  // reviewStates 미전달 시 현재 storage 의 값 사용. 평가기에 명시적으로 주입할 수 있게 옵션화.
  const rs = reviewStates ?? ((getState().reviewStates) || {});
  const recs = buildSentenceRecommendations(topic, question, rs);

  // 빈 답변 — 점수 0 + 안내 힌트.
  if (!norm) {
    return {
      ok: false,
      score: 0,
      usedVocab: [],
      missingVocab: buildMissingVocab(topic),
      detectedPatterns: [],
      missingPatterns: expected,
      hints: [{
        issue: 'empty_answer',
        ko: '답변이 비어 있습니다. 짧게라도 일본어로 답해 보세요.',
        exampleJa: sample?.ja || '',
      }],
      sampleAnswer: sample,
      knownSampleSentence: recs.knownSampleSentence,
      relatedPracticeSentences: recs.relatedPracticeSentences,
      lockedSentenceCount: recs.lockedSentenceCount,
    };
  }

  const jpCount = countJpChars(norm);
  const totalNonSpace = norm.replace(/\s/g, '').length;

  // 일본어 문자 0개인 경우 — 짧은 안내 후 반환.
  if (totalNonSpace > 0 && jpCount === 0) {
    return {
      ok: false,
      score: 5,
      usedVocab: [],
      missingVocab: buildMissingVocab(topic),
      detectedPatterns: [],
      missingPatterns: expected,
      hints: [{
        issue: 'not_japanese',
        ko: '일본어 문자(히라가나·가타카나·한자)로 답해 보세요.',
        exampleJa: sample?.ja || '',
      }],
      sampleAnswer: sample,
      knownSampleSentence: recs.knownSampleSentence,
      relatedPracticeSentences: recs.relatedPracticeSentences,
      lockedSentenceCount: recs.lockedSentenceCount,
    };
  }

  const usedVocab = detectKnownVocabulary(norm, topic?.requiredVocabIds || []);
  const usedIds = new Set(usedVocab.map(v => v.id));
  const missingVocab = (topic?.requiredVocabIds || [])
    .filter(id => !usedIds.has(id))
    .map(id => {
      const v = vocab.find(x => x.id === id);
      return v ? { id, word: v.word, reading: v.reading } : { id };
    });

  const detectedPatterns = detectGrammarPattern(norm, topic?.requiredGrammarIds, expected);
  // OR 의미 — expected 중 하나라도 맞으면 missing 은 비움.
  const anyPatternHit = detectedPatterns.length > 0;
  const missingPatterns = anyPatternHit ? [] : expected;

  // 점수 — 단순 가중치 합. 0~100.
  let score = 30; // 비어있지 않다는 가점
  if (usedVocab.length > 0) score += 25;
  if (anyPatternHit)        score += 25;
  if (usedVocab.length > 0 && anyPatternHit) score += 20;
  const tooShort = jpCount < 3;
  if (tooShort) score = Math.min(score, 40); // 너무 짧으면 캡
  score = Math.min(100, Math.max(0, score));

  // 힌트 모음. repairHints 우선 사용.
  const hints = [];
  if (tooShort) {
    hints.push({
      issue: 'too_short',
      ko: '답변이 너무 짧습니다. 한 문장 정도로 답해 보세요.',
      exampleJa: sample?.ja || '',
    });
  }
  if (!anyPatternHit && expected.length > 0) {
    hints.push({
      issue: 'missing_pattern',
      ko: `이런 표현을 시도해 보세요: ${expected.join(', ')}`,
      exampleJa: sample?.ja || '',
    });
  }
  // 정중체 마무리 부재 안내 — です/でした/ます/ました/ません/ませんでした 등.
  const politeEnd = /(です|でした|ます|ました|ません|ませんでした|でしょう|ましょう|ますか|ですか|ですね|ませんか)[。.\s!?！？]*$/;
  if (!politeEnd.test(norm)) {
    const desuHint = topic?.repairHints?.find(h => h.issue === 'missing_desu');
    hints.push(desuHint || {
      issue: 'polite_ending',
      ko: '문장 끝을 「です」「ます」 형태로 마무리하면 더 자연스럽습니다.',
      exampleJa: sample?.ja || '',
    });
  }
  // 사물·동물 분류 미스 — 犬/猫에 あります 사용 등.
  if (/犬があります|猫があります|友だちがあります|父があります|母があります/.test(norm)) {
    const h = topic?.repairHints?.find(h => h.issue === 'arimasu_vs_imasu');
    if (h) hints.push(h);
  }

  return {
    ok: score >= 70 && anyPatternHit,
    score,
    usedVocab,
    missingVocab,
    detectedPatterns,
    missingPatterns,
    hints,
    sampleAnswer: sample,
    knownSampleSentence: recs.knownSampleSentence,
    relatedPracticeSentences: recs.relatedPracticeSentences,
    lockedSentenceCount: recs.lockedSentenceCount,
  };
}
