// N3 reading/listening/stories 의존성 테이블 생성기 (라운드 32 — 1회성 베이크 도구)
// N3 콘텐츠의 의존성은 N5/N4/N3 만 참조 (N2 금지).
//   vocabIds(핵심): N3 단어 / optionalVocabIds(보조): N4/N5 단어
//   grammarIds(핵심): 탐지 가능한 N3 문형 / optionalGrammarIds: N4/N5 문형
import { vocab } from '../js/data/vocab.js';
import { grammar } from '../js/data/grammar.js';
import { reading } from '../js/data/reading.js';
import { listening } from '../js/data/listening.js';
import { stories } from '../js/data/stories.js';
import { writeFileSync } from 'node:fs';

const N3_GRAMMAR_PATTERNS = [
  ['g_n3_3', /うちに/], ['g_n3_4', /たびに/], ['g_n3_5', /おかげで/], ['g_n3_6', /せいで/],
  ['g_n3_7', /くせに/], ['g_n3_8', /たとたん/], ['g_n3_9', /ば[\s\S]{0,10}ほど/],
  ['g_n3_10', /にとって/], ['g_n3_11', /について/], ['g_n3_12', /に比べて/],
  ['g_n3_13', /みたいで|みたいだ|みたいです/], ['g_n3_14', /っぽい/], ['g_n3_15', /がち/],
  ['g_n3_16', /気味/], ['g_n3_18', /ところでした|ところだった/], ['g_n3_19', /ことはありません|ことはない/],
  ['g_n3_20', /わけにはいき/],
  // 라운드 34 — 신규 문법 (탐지 가능한 패턴만)
  ['g_n3_21', /とおりに/], ['g_n3_22', /かわりに/], ['g_n3_23', /最中/], ['g_n3_24', /うえに/],
  ['g_n3_25', /おきに/], ['g_n3_27', /ほど[\s\S]{0,12}(はあり|はない|ものはな)/],
  ['g_n3_28', /ということだ|ということです/], ['g_n3_32', /づらい/],
  ['g_n3_35', /こそ/], ['g_n3_36', /しかない|しかあり/], ['g_n3_37', /はもちろん/],
  ['g_n3_38', /てほしい|でほしい/], ['g_n3_39', /ようとし/], ['g_n3_40', /にしては/],
  // 라운드 36 — 신규 문법 (탐지 가능한 패턴만; たて/きり/がる/ことだ 등 과탐 위험 제외)
  ['g_n3_41', /にかわって/], ['g_n3_42', /に対して/], ['g_n3_43', /によって/],
  ['g_n3_44', /にしたがって/], ['g_n3_45', /につれて/], ['g_n3_46', /とともに/],
  ['g_n3_47', /向け/], ['g_n3_48', /向き/], ['g_n3_49', /っぱなし/], ['g_n3_50', /だらけ/],
  ['g_n3_53', /として/], ['g_n3_54', /とすれば|としたら/], ['g_n3_55', /としても/],
  ['g_n3_56', /わりに/], ['g_n3_58', /ばかりでなく/], ['g_n3_59', /せいか/],
  ['g_n3_60', /つもりだった/], ['g_n3_62', /ふりをし/], ['g_n3_64', /ないことはな/],
  ['g_n3_65', /る一方だ|る一方です/], ['g_n3_66', /一方で/], ['g_n3_67', /だけでなく/],
  ['g_n3_69', /たうえで/], ['g_n3_70', /とは限/],
];
const LOWER_GRAMMAR_PATTERNS = [
  ['g_n4_61', /ていただけ/], ['g_n4_1', /てしまい|でしま/], ['g_n4_17', /ので/],
  ['g_n4_8', /そうです|そうだ/], ['g_n4_69', /によると/], ['g_n5_13', /てください/],
  ['g_n5_10', /ましょう/],
];

const HAS_KANJI = /[一-鿿]/;
const entries = vocab
  .filter(v => ['N5', 'N4', 'N3'].includes(v.level))
  .map(v => {
    const kanji = HAS_KANJI.test(v.word);
    const stem = kanji && v.word.length >= 2 ? v.word.slice(0, -1) : null;
    return { id: v.id, level: v.level, word: v.word, kanji,
             stem: stem && stem.length >= 2 ? stem : null };
  })
  .sort((a, b) => b.word.length - a.word.length);

function findVocab(text) {
  const n3 = [], lower = [];
  for (const e of entries) {
    let hit = false;
    if (e.kanji && e.word.length === 1) {
      hit = new RegExp('(?<![一-鿿])' + e.word + '(?![一-鿿])').test(text);
    } else {
      hit = text.includes(e.word) || (e.stem && text.includes(e.stem));
    }
    if (hit) (e.level === 'N3' ? n3 : lower).push(e.id);
  }
  return { n3: n3.slice(0, 8), lower: lower.slice(0, 8) };
}
function findGrammar(text) {
  const n3 = [], lower = [];
  for (const [id, re] of N3_GRAMMAR_PATTERNS) if (re.test(text)) n3.push(id);
  for (const [id, re] of LOWER_GRAMMAR_PATTERNS) if (re.test(text)) lower.push(id);
  return { n3: n3.slice(0, 4), lower: lower.slice(0, 4) };
}
function depsFor(text) {
  const v = findVocab(text);
  const g = findGrammar(text);
  let core = v.n3, opt = v.lower;
  if (core.length === 0 && opt.length > 0) { core = opt.slice(0, 3); opt = opt.slice(3); }
  return { vocabIds: core, grammarIds: g.n3,
           optionalVocabIds: opt, optionalGrammarIds: g.lower, requiredCoverage: 0.7 };
}

const rT = {}, lT = {}, sT = {};
for (const r of reading.filter(x => x.level === 'N3')) rT[r.id] = depsFor(r.passage + ' ' + r.question);
for (const l of listening.filter(x => x.level === 'N3')) lT[l.id] = depsFor(l.script + ' ' + l.question);
for (const s of stories.filter(x => x.level === 'N3')) {
  const text = s.bodyJa.join(' ');
  const v = findVocab(text);
  const g = findGrammar(text);
  sT[s.id] = {
    vocabularyIds: [...new Set([...(s.keyVocabularyIds || []), ...v.n3, ...v.lower])].slice(0, 20),
    grammarIds: [...new Set([...(s.grammarIds || []), ...g.n3])].slice(0, 8),
  };
}
writeFileSync('_deps3_reading.json', JSON.stringify(rT), 'utf-8');
writeFileSync('_deps3_listening.json', JSON.stringify(lT), 'utf-8');
writeFileSync('_deps3_stories.json', JSON.stringify(sT), 'utf-8');
let core0 = 0, sum = 0, n = 0;
for (const t of [rT, lT]) for (const d of Object.values(t)) { n++; const c = d.vocabIds.length + d.grammarIds.length; sum += c; if (!c) core0++; }
console.log('r:', Object.keys(rT).length, '/ l:', Object.keys(lT).length, '/ s:', Object.keys(sT).length,
  '/ 핵심0:', core0, '/ 평균:', (sum/n).toFixed(1));
