// N4 reading/listening/stories 의존성 테이블 생성기 (라운드 29 — 1회성 베이크 도구)
// 본문 텍스트에서 vocab 단어(원형/어간) 와 정규식으로 탐지 가능한 문법 패턴을 찾아
// vocabIds(핵심: N4) / optionalVocabIds(보조: N5) / grammarIds(N4) / optionalGrammarIds(N5)
// 테이블을 emit 한다. 결과는 데이터 파일 끝에 Object.assign 루프로 베이크된다.
import { vocab } from '../js/data/vocab.js';
import { reading } from '../js/data/reading.js';
import { listening } from '../js/data/listening.js';
import { stories } from '../js/data/stories.js';
import { writeFileSync } from 'node:fs';

const N4_GRAMMAR_PATTERNS = [
  ['g_n4_1', /て(しまい|しまっ|しまう)|でしま/],
  ['g_n4_2', /て(おき|おいて|おく)/],
  ['g_n4_7', /てみ(ま|た|て|る)/],
  ['g_n4_8', /そうです|そうだ/],
  ['g_n4_12', /すぎ(て|る|ま)/],
  ['g_n4_17', /ので/],
  ['g_n4_19', /かもしれ/],
  ['g_n4_20', /ことにし/],
  ['g_n4_21', /ことにな(り|っ)/],
  ['g_n4_38', /と思い/],
  ['g_n4_39', /つもり/],
  ['g_n4_43', /てもら(い|え|っ)/],
  ['g_n4_42', /てくれ/],
  ['g_n4_44', /(ら)?れまし|られて/],
  ['g_n4_50', /予定です/],
  ['g_n4_51', /かどうか/],
  ['g_n4_52', /でしょう/],
  ['g_n4_56', /たばかり/],
  ['g_n4_59', /ほうがいい/],
  ['g_n4_61', /ていただけ/],
  ['g_n4_62', /ことになってい/],
  ['g_n4_63', /場合/],
  ['g_n4_66', /という/],
  ['g_n4_68', /のため|ため、/],
  ['g_n4_69', /によると/],
  ['g_n4_70', /そうにない/],
  ['g_n4_71', /[おご][一-鿿ぁ-ゖー]{1,6}ください/],
  ['g_n4_73', /たまま|のまま/],
  ['g_n4_74', /ずに/],
  ['g_n4_75', /なくてはいけ/],
  ['g_n4_79', /(降り|泣き|走り)出し/],
  ['g_n4_80', /にします|にしましょう/],
  ['g_n4_81', /がします|がする/],
  ['g_n4_82', /ばよかった/],
  ['g_n4_83', /[一-鿿]中です|[一-鿿]中で/],
];
const N5_GRAMMAR_PATTERNS = [
  ['g_n5_13', /てください|でください/],
  ['g_n5_10', /ましょう/],
  ['g_n5_11', /ませんか/],
  ['g_n5_12', /たいです|たいんです|たいと/],
  ['g_n5_14', /てもいいです/],
  ['g_n5_7', /があります/],
  ['g_n5_8', /がいます/],
  ['g_n5_16', /から、|ですから/],
];

// 단어 매칭 — 원형 그대로 또는 어간(마지막 1자 제거, 한자 포함 2자+).
const HAS_KANJI = /[一-鿿]/;
const entries = vocab
  .filter(v => v.level === 'N4' || v.level === 'N5')
  .map(v => {
    // 어간 매칭은 "한자 포함 + 2자 이상 어간" 일 때만 (kana 전용 단어는 오탐 위험).
    const kanji = HAS_KANJI.test(v.word);
    const stem = kanji && v.word.length >= 2 ? v.word.slice(0, -1) : null;
    return { id: v.id, level: v.level, word: v.word, kanji,
             stem: stem && stem.length >= 2 ? stem : null };
  })
  .sort((a, b) => b.word.length - a.word.length);

function findVocab(text) {
  const n4 = [], n5 = [];
  for (const e of entries) {
    let hit = false;
    if (e.kanji && e.word.length === 1) {
      // 단일 한자 단어 — 다른 한자와 붙어 있으면(복합어 일부) 제외. 한자 1자는 regex 메타문자 없음.
      hit = new RegExp('(?<![一-鿿])' + e.word + '(?![一-鿿])').test(text);
    } else {
      hit = text.includes(e.word) || (e.stem && text.includes(e.stem));
    }
    if (hit) (e.level === 'N4' ? n4 : n5).push(e.id);
  }
  return { n4: n4.slice(0, 8), n5: n5.slice(0, 8) };
}
function findGrammar(text) {
  const n4 = [], n5 = [];
  for (const [id, re] of N4_GRAMMAR_PATTERNS) if (re.test(text)) n4.push(id);
  for (const [id, re] of N5_GRAMMAR_PATTERNS) if (re.test(text)) n5.push(id);
  return { n4: n4.slice(0, 5), n5: n5.slice(0, 5) };
}

function depsFor(text) {
  const v = findVocab(text);
  const g = findGrammar(text);
  // 핵심 의존성 최소 1개 보장 — N4 단어가 없으면 가장 긴 N5 단어를 핵심으로 승격
  let core = v.n4, opt = v.n5;
  if (core.length === 0 && opt.length > 0) { core = opt.slice(0, 3); opt = opt.slice(3); }
  return {
    vocabIds: core, grammarIds: g.n4,
    optionalVocabIds: opt, optionalGrammarIds: g.n5,
    requiredCoverage: 0.7,
  };
}

function emitTable(items, textPick) {
  const out = {};
  for (const it of items) out[it.id] = depsFor(textPick(it));
  return JSON.stringify(out, null, 0);
}

const rTable = emitTable(reading.filter(r => r.level === 'N4'), r => r.passage + ' ' + r.question);
const lTable = emitTable(listening.filter(l => l.level === 'N4'), l => l.script + ' ' + l.question);
// 스토리: vocabularyIds 전체(핵심+보조 합산, key 유지), grammarIds 는 기존과 탐지 병합
const sTable = {};
for (const s of stories.filter(x => x.level === 'N4')) {
  const text = s.bodyJa.join(' ');
  const v = findVocab(text);
  const g = findGrammar(text);
  sTable[s.id] = {
    vocabularyIds: [...new Set([...(s.keyVocabularyIds || []), ...v.n4, ...v.n5])].slice(0, 20),
    grammarIds: [...new Set([...(s.grammarIds || []), ...g.n4])].slice(0, 8),
  };
}

writeFileSync('_deps_reading.json', rTable, 'utf-8');
writeFileSync('_deps_listening.json', lTable, 'utf-8');
writeFileSync('_deps_stories.json', JSON.stringify(sTable, null, 0), 'utf-8');
console.log('reading:', reading.filter(r => r.level === 'N4').length,
  '/ listening:', listening.filter(l => l.level === 'N4').length,
  '/ stories:', Object.keys(sTable).length);
// 샘플 출력
const sample = JSON.parse(rTable);
console.log('샘플 r_n4_21:', JSON.stringify(sample['r_n4_21']));
console.log('샘플 r_n4_45:', JSON.stringify(sample['r_n4_45']));
