// N5 reading/listening/stories 의존성 테이블 생성기 (라운드 31 백포트 — 1회성 베이크 도구)
// N5 콘텐츠의 의존성은 N5 id 만 참조한다 (N4/N3/N2 금지).
//   vocabIds: 핵심 (최장 매칭 상위 6) / optionalVocabIds: 보조 (다음 6)
//   grammarIds: 정규식 탐지 가능한 N5 문형 (상위 4) / optionalGrammarIds: []
import { vocab } from '../js/data/vocab.js';
import { reading } from '../js/data/reading.js';
import { listening } from '../js/data/listening.js';
import { stories } from '../js/data/stories.js';
import { writeFileSync } from 'node:fs';

const N5_GRAMMAR_PATTERNS = [
  ['g_n5_13', /てください|でください/],
  ['g_n5_10', /ましょう/],
  ['g_n5_11', /ませんか/],
  ['g_n5_12', /たいです|たいんです|たいと/],
  ['g_n5_14', /てもいいです/],
  ['g_n5_15', /てはいけません/],
  ['g_n5_7', /があります/],
  ['g_n5_8', /がいます/],
  ['g_n5_5', /ています|でいます/],
  ['g_n5_16', /から、|ですから/],
  ['g_n5_17', /まで/],
  ['g_n5_26', /より[\s\S]{0,8}ほうが/],
  ['g_n5_28', /前に/],
  ['g_n5_29', /後で/],
  ['g_n5_31', /だけ/],
  ['g_n5_35', /でしょう/],
  ['g_n5_40', /まだ/],
  ['g_n5_41', /もう/],
];

const HAS_KANJI = /[一-鿿]/;
const entries = vocab
  .filter(v => v.level === 'N5')
  .map(v => {
    const kanji = HAS_KANJI.test(v.word);
    const stem = kanji && v.word.length >= 2 ? v.word.slice(0, -1) : null;
    return { id: v.id, word: v.word, kanji, stem: stem && stem.length >= 2 ? stem : null };
  })
  .sort((a, b) => b.word.length - a.word.length);

function findVocab(text) {
  const hits = [];
  for (const e of entries) {
    let hit = false;
    if (e.kanji && e.word.length === 1) {
      hit = new RegExp('(?<![一-鿿])' + e.word + '(?![一-鿿])').test(text);
    } else {
      hit = text.includes(e.word) || (e.stem && text.includes(e.stem));
    }
    if (hit) hits.push(e.id);
  }
  return hits;
}
function findGrammar(text) {
  const out = [];
  for (const [id, re] of N5_GRAMMAR_PATTERNS) if (re.test(text)) out.push(id);
  return out.slice(0, 4);
}

function depsFor(text) {
  const v = findVocab(text);
  return {
    vocabIds: v.slice(0, 6),
    grammarIds: findGrammar(text),
    optionalVocabIds: v.slice(6, 12),
    optionalGrammarIds: [],
    requiredCoverage: 0.7,
  };
}

function emitTable(items, textPick) {
  const out = {};
  for (const it of items) out[it.id] = depsFor(textPick(it));
  return out;
}

const rTable = emitTable(reading.filter(r => r.level === 'N5'), r => r.passage + ' ' + r.question);
const lTable = emitTable(listening.filter(l => l.level === 'N5'), l => l.script + ' ' + l.question);
const sTable = {};
for (const s of stories.filter(x => x.level === 'N5')) {
  const text = s.bodyJa.join(' ');
  const v = findVocab(text);
  const g = findGrammar(text);
  sTable[s.id] = {
    vocabularyIds: [...new Set([...(s.keyVocabularyIds || []), ...v])].slice(0, 20),
    grammarIds: [...new Set([...(s.grammarIds || []), ...g])].slice(0, 8),
  };
}

writeFileSync('_deps5_reading.json', JSON.stringify(rTable), 'utf-8');
writeFileSync('_deps5_listening.json', JSON.stringify(lTable), 'utf-8');
writeFileSync('_deps5_stories.json', JSON.stringify(sTable), 'utf-8');

// 통계
let core0 = 0, total = 0, sum = 0;
for (const t of [rTable, lTable]) for (const d of Object.values(t)) {
  total++; const n = d.vocabIds.length + d.grammarIds.length; sum += n;
  if (n === 0) core0++;
}
console.log('reading:', Object.keys(rTable).length, '/ listening:', Object.keys(lTable).length,
  '/ stories:', Object.keys(sTable).length, '/ 핵심 0건:', core0, '/ 평균 핵심:', (sum/total).toFixed(1));
console.log('샘플 r_n5_26:', JSON.stringify(rTable['r_n5_26']));
