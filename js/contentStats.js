// 현재 콘텐츠 수와 levelTargets 비교 유틸.
import { vocab } from './data/vocab.js';
import { grammar } from './data/grammar.js';
import { reading } from './data/reading.js';
import { listening } from './data/listening.js';
import { grammarPairs } from './data/grammarPairs.js';
import { kanji } from './data/kanji.js';
import { targetFor } from './data/levelTargets.js';

const LEVELS = ['N5','N4','N3','N2'];

function bucketByLevel(items) {
  const m = { N5: 0, N4: 0, N3: 0, N2: 0 };
  for (const it of items) m[it.level] = (m[it.level] || 0) + 1;
  return m;
}

/** 영역별·레벨별 콘텐츠 개수. */
export function contentCounts() {
  return {
    vocab:     bucketByLevel(vocab),
    grammar:   bucketByLevel(grammar),
    reading:   bucketByLevel(reading),
    listening: bucketByLevel(listening),
    pairs:     bucketByLevel(grammarPairs),
    kanji:     bucketByLevel(kanji),
  };
}

/**
 * 특정 레벨의 진행 상황. UI 의 "학습량 현황" 카드에 그대로 사용.
 *
 * 어휘/한자는 누적 목표(N4=1400 = N5+N4 합) 와 비교한다.
 * 현재 앱이 한자 데이터를 아직 가지고 있지 않아 한자 have=0.
 */
export function progressFor(level) {
  const t = targetFor(level);
  const c = contentCounts();
  const idx = LEVELS.indexOf(level);

  // 누적 합 (어휘/한자 — N5..해당레벨)
  let cumVocab = 0;
  for (let i = 0; i <= idx; i++) cumVocab += (c.vocab[LEVELS[i]] || 0);
  let cumKanji = 0;
  for (let i = 0; i <= idx; i++) cumKanji += (c.kanji[LEVELS[i]] || 0);

  return {
    level,
    descriptionKo: t?.descriptionKo ?? '',
    // 누적 비교
    vocab: { have: cumVocab,            target: t?.targetVocab ?? 0 },
    kanji: { have: cumKanji,            target: t?.targetKanji ?? 0,
             note: cumKanji === 0 ? '한자 카드 준비 중' : '' },
    // 단일 레벨 비교 (해당 레벨 콘텐츠만)
    grammar:   { have: c.grammar[level]   || 0, min: t?.targetGrammarMin   ?? 0, max: t?.targetGrammarMax   ?? 0 },
    reading:   { have: c.reading[level]   || 0, min: t?.targetReadingMin   ?? 0, max: t?.targetReadingMax   ?? 0 },
    listening: { have: c.listening[level] || 0, min: t?.targetListeningMin ?? 0, max: t?.targetListeningMax ?? 0 },
  };
}

/** 0~1 사이 비율 (target=0 이면 0). */
export function ratio(have, target) {
  if (!target) return 0;
  return Math.min(1, have / target);
}
