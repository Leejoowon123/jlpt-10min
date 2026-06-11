// 콘텐츠 현황 리포트 — 최종 목표(levelTargets) 대비 현재 수량/부족분/진행률.
//
// 사용:
//   node scripts/content-report.mjs            → 콘솔에 Markdown 출력
//   npm run content:report                     → 동일
//
// 원칙:
//   - 수량 산출은 smoke.mjs 와 동일하게 js/data/*.js 를 직접 집계 (단일 기준).
//   - 어휘/한자는 "누적" 목표 (N4 목표 1400 = N5+N4 합산으로 평가).
//   - 문법/독해/청해는 레벨별 범위 목표 (min~max).
//   - 최종 목표 미달은 실패가 아니라 현황 — docs/content-status.md 에 붙여넣기 쉬운 표 생성.

import { vocab } from '../js/data/vocab.js';
import { grammar } from '../js/data/grammar.js';
import { reading } from '../js/data/reading.js';
import { listening } from '../js/data/listening.js';
import { kanji } from '../js/data/kanji.js';
import { stories } from '../js/data/stories.js';
import { sentenceBank } from '../js/data/sentenceBank.js';
import { grammarPairs } from '../js/data/grammarPairs.js';
import { conversationTopics } from '../js/data/conversationTopics.js';
import { levelTargets } from '../js/data/levelTargets.js';

const LEVELS = ['N5', 'N4', 'N3', 'N2'];

const count = (arr, level) => arr.filter(i => i.level === level).length;

/** 누적 카운트 — N4 = N5+N4, N3 = N5+N4+N3 ... */
function cumulative(arr, level) {
  const upto = LEVELS.slice(0, LEVELS.indexOf(level) + 1);
  return arr.filter(i => upto.includes(i.level)).length;
}

const pct = (cur, target) => target > 0 ? Math.round(cur / target * 100) : 0;
const lack = (cur, target) => Math.max(0, target - cur);

/** 레벨별 핵심 콘텐츠 현황 객체 — smoke 가 동일 산출을 검증한다. */
export function computeCoreStatus() {
  return levelTargets.map(t => {
    const L = t.level;
    const vocabCum = cumulative(vocab, L);
    const kanjiCum = cumulative(kanji, L);
    const g = count(grammar, L);
    const r = count(reading, L);
    const li = count(listening, L);
    return {
      level: L,
      vocab:  { cur: vocabCum, target: t.targetVocab, lack: lack(vocabCum, t.targetVocab), pct: pct(vocabCum, t.targetVocab) },
      kanji:  { cur: kanjiCum, target: t.targetKanji, lack: lack(kanjiCum, t.targetKanji), pct: pct(kanjiCum, t.targetKanji) },
      grammar:   { cur: g,  min: t.targetGrammarMin,   max: t.targetGrammarMax,   lack: lack(g, t.targetGrammarMin),    pct: pct(g, t.targetGrammarMin) },
      reading:   { cur: r,  min: t.targetReadingMin,   max: t.targetReadingMax,   lack: lack(r, t.targetReadingMin),    pct: pct(r, t.targetReadingMin) },
      listening: { cur: li, min: t.targetListeningMin, max: t.targetListeningMax, lack: lack(li, t.targetListeningMin), pct: pct(li, t.targetListeningMin) },
    };
  });
}

/** 보조 콘텐츠 현황 (레벨별 단순 카운트). */
export function computeAuxStatus() {
  return LEVELS.map(L => ({
    level: L,
    sentenceBank: count(sentenceBank, L),
    sentenceBankConv: sentenceBank.filter(s => s.level === L && s.canUseInConversation).length,
    stories: stories.filter(s => s.level === L && s.type !== 'short_story').length,
    shortStories: stories.filter(s => s.level === L && s.type === 'short_story').length,
    conversationTopics: count(conversationTopics, L),
    grammarPairs: count(grammarPairs, L),
  }));
}

function bar(p) {
  const filled = Math.min(10, Math.round(p / 10));
  return '█'.repeat(filled) + '░'.repeat(10 - filled);
}

export function renderMarkdown() {
  const today = new Date().toISOString().slice(0, 10);
  const core = computeCoreStatus();
  const aux = computeAuxStatus();
  const out = [];

  out.push(`<!-- 자동 생성: npm run content:report (기준일 ${today}) -->`);
  out.push('');
  out.push('### 표 1 — 핵심 학습 콘텐츠 (최종 목표 대비)');
  out.push('');
  out.push('| 레벨 | 영역 | 현재 | 목표 | 부족 | 진행률 |');
  out.push('| --- | --- | ---: | ---: | ---: | --- |');
  for (const row of core) {
    out.push(`| ${row.level} | vocab(누적) | ${row.vocab.cur} | ${row.vocab.target} | ${row.vocab.lack} | ${bar(row.vocab.pct)} ${row.vocab.pct}% |`);
    out.push(`| ${row.level} | kanji(누적) | ${row.kanji.cur} | ${row.kanji.target} | ${row.kanji.lack} | ${bar(row.kanji.pct)} ${row.kanji.pct}% |`);
    out.push(`| ${row.level} | grammar | ${row.grammar.cur} | ${row.grammar.min}~${row.grammar.max} | ${row.grammar.lack} | ${bar(row.grammar.pct)} ${row.grammar.pct}% |`);
    out.push(`| ${row.level} | reading | ${row.reading.cur} | ${row.reading.min}~${row.reading.max} | ${row.reading.lack} | ${bar(row.reading.pct)} ${row.reading.pct}% |`);
    out.push(`| ${row.level} | listening | ${row.listening.cur} | ${row.listening.min}~${row.listening.max} | ${row.listening.lack} | ${bar(row.listening.pct)} ${row.listening.pct}% |`);
  }
  out.push('');
  out.push('진행률은 범위 목표의 경우 **min 기준**. 100% 초과는 100%로 표시하지 않고 실값 유지.');
  out.push('');
  out.push('### 표 2 — 보조 콘텐츠');
  out.push('');
  out.push('| 레벨 | sentenceBank (회화 가능) | 이야기 | 단편 | 회화 주제 | 문법 페어 |');
  out.push('| --- | ---: | ---: | ---: | ---: | ---: |');
  for (const row of aux) {
    out.push(`| ${row.level} | ${row.sentenceBank} (${row.sentenceBankConv}) | ${row.stories} | ${row.shortStories} | ${row.conversationTopics} | ${row.grammarPairs} |`);
  }
  out.push('');
  out.push('후리가나 커버율은 `node smoke.mjs` 의 `=== N5/N4 후리가나 커버율 ===` 섹션 참조.');
  return out.join('\n');
}

// 직접 실행 시 콘솔 출력
const isMain = process.argv[1] && import.meta.url.endsWith(
  process.argv[1].replace(/\\/g, '/').split('/').pop());
if (isMain) {
  console.log(renderMarkdown());
}
