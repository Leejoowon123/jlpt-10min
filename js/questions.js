// 학습 항목 → 4지선다 문제로 변환. itemType: 'vocab' | 'grammar' | 'reading' | 'listening'
import { vocab } from './data/vocab.js';
import { grammar } from './data/grammar.js';
import { reading } from './data/reading.js';
import { listening } from './data/listening.js';

export const allItems = { vocab, grammar, reading, listening };

export function findItem(itemType, itemId) {
  const list = allItems[itemType];
  if (!list) return null;
  return list.find(x => x.id === itemId) || null;
}

// PRNG: 안정적인 셔플이 필요할 때만. 기본은 Math.random.
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(pool, correctValue, key, n = 3) {
  const candidates = pool.filter(v => v[key] !== correctValue);
  return shuffled(candidates).slice(0, n).map(v => v[key]);
}

// Build a question that hides answer/explanation; UI reveals after select.
// Returns: { itemType, itemId, prompt, context?, choices, answerIndex, explanation, extra }
export function buildQuestion(itemType, itemId) {
  if (itemType === 'vocab') {
    const v = findItem('vocab', itemId);
    if (!v) return null;
    const sameLevel = vocab.filter(x => x.level === v.level && x.id !== v.id);
    const distractors = shuffled(sameLevel).slice(0, 3).map(x => x.meaningKo);
    const choices = shuffled([v.meaningKo, ...distractors]);
    return {
      itemType, itemId,
      // 선택 전: 일본어 예문만 노출 (한국어 번역은 정답 힌트가 되므로 숨김).
      // 후리가나 readings 는 일본어 읽기 보조이므로 함께 제공 — 정답 누출 위험 없음.
      context: { ja: v.exampleSentence, readings: v.exampleReadings || [] },
      prompt: `「${v.word}」(${v.reading})의 뜻으로 가장 알맞은 것은?`,
      choices,
      answerIndex: choices.indexOf(v.meaningKo),
      // 선택 후 해설에 단어 뜻 + 예문 + 예문 번역까지 포함
      explanation:
        `${v.word}(${v.reading}) = ${v.meaningKo}\n` +
        `예문: ${v.exampleSentence}\n` +
        `해석: ${v.exampleTranslation}`,
      extra: { mnemonicText: v.mnemonicText, imageKey: v.imageKey, word: v.word, reading: v.reading, level: v.level },
    };
  }

  if (itemType === 'grammar') {
    const g = findItem('grammar', itemId);
    if (!g) return null;
    const ex = g.examples[0];
    // distractor 우선순위: 같은 레벨 → 그래도 모자라면 다른 레벨에서 보충.
    // N3/N2 처럼 같은 레벨 항목이 2개뿐인 경우를 위한 폴백.
    const sameLevel = grammar.filter(x => x.level === g.level && x.id !== g.id && x.meaningKo !== g.meaningKo);
    let pool = shuffled(sameLevel).slice(0, 3);
    if (pool.length < 3) {
      const other = grammar.filter(x => x.id !== g.id && x.meaningKo !== g.meaningKo && !pool.some(p => p.id === x.id));
      pool = pool.concat(shuffled(other).slice(0, 3 - pool.length));
    }
    const distractors = pool.map(x => x.meaningKo);
    const choices = shuffled([g.meaningKo, ...distractors]);
    return {
      itemType, itemId,
      // 선택 전: 일본어 예문만. 번역은 정답을 알려주는 셈이므로 해설로 미룸.
      context: ex ? { ja: ex.ja, readings: ex.readings || [] } : null,
      prompt: `문법 「${g.pattern}」 의 의미로 가장 알맞은 것은?`,
      choices,
      answerIndex: choices.indexOf(g.meaningKo),
      explanation:
        `${g.pattern} — ${g.meaningKo}\n${g.explanation}` +
        (ex ? `\n예문: ${ex.ja}\n해석: ${ex.ko}` : ''),
      extra: { pattern: g.pattern, level: g.level, similarGrammarIds: g.similarGrammarIds },
    };
  }

  if (itemType === 'reading') {
    const r = findItem('reading', itemId);
    if (!r) return null;
    return {
      itemType, itemId,
      context: { ja: r.passage, readings: r.passageReadings || [] },
      prompt: r.question,
      promptReadings: r.questionReadings || [],
      choices: r.choices.slice(),
      answerIndex: r.answerIndex,
      explanation: r.explanation,
      extra: { title: r.title, level: r.level },
    };
  }

  if (itemType === 'listening') {
    const l = findItem('listening', itemId);
    if (!l) return null;
    return {
      itemType, itemId,
      context: null, // 청해는 스크립트를 처음엔 숨김 (오디오 우선)
      prompt: l.question,
      promptReadings: l.questionReadings || [],
      choices: l.choices.slice(),
      answerIndex: l.answerIndex,
      explanation: l.explanation,
      extra: {
        scenario: l.scenario,
        script: l.script,
        scriptReadings: l.scriptReadings || [],
        level: l.level, isListening: true,
      },
    };
  }

  return null;
}
