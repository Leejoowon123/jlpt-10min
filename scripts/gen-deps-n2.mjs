// N2 reading/listening/stories 의존성 테이블 생성기 (유지보수 대상 도구 — 버전 관리에 포함).
//   ※ 임시 파일이 아니다. N2 콘텐츠를 추가/수정할 때마다 재실행해 의존성을 다시 베이크한다.
//
// 사용법:
//   1) node scripts/gen-deps-n2.mjs       → _deps2_{reading,listening,stories}.json 출력
//   2) 출력 JSON 을 js/data/{reading,listening,stories}.js 의
//      const READING_DEPS_N2 / LISTENING_DEPS_N2 / STORY_DEPS_N2 = {...} 에 그대로 베이크
//      (각 파일 하단의 `for (const it of ...) Object.assign(it, DEPS[it.id])` 가 런타임 주입)
//   3) node smoke.mjs 로 핵심 의존성 0건 없음 / 질문어 누출 0 확인
//   * 베이크된 테이블은 항상 이 생성기의 출력과 일치해야 한다(라운드 45 검증: mismatch 0).
//
// 정책: N2 의존성은 N5/N4/N3/N2 모두 참조 가능 (N2 는 최상위 목표 레벨). N1 금지.
//   - 의존성은 **본문(passage/script)에서만** 도출(질문어 누출 방지, 라운드 43).
//   vocabIds(핵심): N2 단어 / optionalVocabIds(보조): N3/N4/N5 단어
//   grammarIds(핵심): 탐지 가능한 N2 문형 / optionalGrammarIds: 탐지 가능한 N3 문형
import { vocab } from '../js/data/vocab.js';
import { grammar } from '../js/data/grammar.js';
import { reading } from '../js/data/reading.js';
import { listening } from '../js/data/listening.js';
import { stories } from '../js/data/stories.js';
import { writeFileSync } from 'node:fs';

// N2 문형 — 과탐 위험이 낮은 패턴만 (をもって/として 등 짧은 과탐형은 제외)
const N2_GRAMMAR_PATTERNS = [
  ['g_n2_1', /のみならず/], ['g_n2_2', /にともなって|に伴って/], ['g_n2_3', /にあたって/],
  ['g_n2_4', /に応じて/], ['g_n2_5', /に先立って/], ['g_n2_6', /を契機に/],
  ['g_n2_7', /からすると|からすれば/], ['g_n2_8', /ことなしに/], ['g_n2_9', /抜きには/],
  ['g_n2_10', /にこたえて/], ['g_n2_12', /にわたって/], ['g_n2_13', /を問わず/],
  ['g_n2_14', /はもとより/], ['g_n2_16', /ずにはいられない/], ['g_n2_17', /てからでないと/],
  ['g_n2_18', /以上は|以上、/], ['g_n2_19', /とはいえ/], ['g_n2_20', /つつも/],
  ['g_n2_21', /だけのことはある/], ['g_n2_22', /ものなら/],
  // 라운드 42 (N2 1차 확장) 추가 — 과탐 위험이 낮은 패턴만
  ['g_n2_23', /ないことには/], ['g_n2_24', /にもかかわらず/], ['g_n2_25', /どころか/],
  ['g_n2_26', /かのよう/], ['g_n2_27', /に限らず/], ['g_n2_28', /次第で/],
  ['g_n2_29', /た上で/], ['g_n2_30', /ばかりか/], ['g_n2_31', /にしろ/],
  ['g_n2_32', /にせよ/], ['g_n2_33', /のもとで/], ['g_n2_34', /にもまして/],
  ['g_n2_35', /にひきかえ/], ['g_n2_36', /とあれば/], ['g_n2_37', /てこそ/],
  ['g_n2_38', /にあって/], ['g_n2_39', /ところに/], ['g_n2_40', /ことだし/],
];
// 하위(N3) 문형 일부 — optional 로만 사용 (탐지 가능한 안전 패턴)
const N3_GRAMMAR_PATTERNS = [
  ['g_n3_5', /おかげで/], ['g_n3_6', /せいで/], ['g_n3_11', /について/], ['g_n3_28', /ということだ|ということです/],
  ['g_n3_36', /しかない|しかあり/], ['g_n3_45', /につれて/], ['g_n3_67', /だけでなく/],
  ['g_n3_88', /ながらも/], ['g_n3_89', /つつ/], ['g_n3_90', /得る|得ます/],
];

const HAS_KANJI = /[一-鿿]/;
const entries = vocab
  .filter(v => ['N5', 'N4', 'N3', 'N2'].includes(v.level))
  .map(v => {
    const kanji = HAS_KANJI.test(v.word);
    const stem = kanji && v.word.length >= 2 ? v.word.slice(0, -1) : null;
    return { id: v.id, level: v.level, word: v.word, kanji,
             stem: stem && stem.length >= 2 ? stem : null };
  })
  .sort((a, b) => b.word.length - a.word.length);

function findVocab(text) {
  const n2 = [], lower = [];
  for (const e of entries) {
    let hit = false;
    if (e.kanji && e.word.length === 1) {
      hit = new RegExp('(?<![一-鿿])' + e.word + '(?![一-鿿])').test(text);
    } else {
      hit = text.includes(e.word) || (e.stem && text.includes(e.stem));
    }
    if (hit) (e.level === 'N2' ? n2 : lower).push(e.id);
  }
  return { n2: n2.slice(0, 8), lower: lower.slice(0, 8) };
}
function findGrammar(text) {
  const n2 = [], lower = [];
  for (const [id, re] of N2_GRAMMAR_PATTERNS) if (re.test(text)) n2.push(id);
  for (const [id, re] of N3_GRAMMAR_PATTERNS) if (re.test(text)) lower.push(id);
  return { n2: n2.slice(0, 4), lower: lower.slice(0, 4) };
}
function depsFor(text) {
  const v = findVocab(text);
  const g = findGrammar(text);
  let core = v.n2, opt = v.lower;
  if (core.length === 0 && opt.length > 0) { core = opt.slice(0, 3); opt = opt.slice(3); }
  return { vocabIds: core, grammarIds: g.n2,
           optionalVocabIds: opt, optionalGrammarIds: g.lower, requiredCoverage: 0.7 };
}

const rT = {}, lT = {}, sT = {};
// 의존성은 본문(passage/script)에서만 도출 — 질문(question)의 일반 어휘(正しい/どれ 등)가
// 핵심 vocab 으로 새는 것을 방지 (라운드 43 안정화).
for (const r of reading.filter(x => x.level === 'N2')) rT[r.id] = depsFor(r.passage);
for (const l of listening.filter(x => x.level === 'N2')) lT[l.id] = depsFor(l.script);
for (const s of stories.filter(x => x.level === 'N2')) {
  const text = s.bodyJa.join(' ');
  const v = findVocab(text);
  const g = findGrammar(text);
  sT[s.id] = {
    vocabularyIds: [...new Set([...(s.keyVocabularyIds || []), ...v.n2, ...v.lower])].slice(0, 20),
    grammarIds: [...new Set([...(s.grammarIds || []), ...g.n2])].slice(0, 8),
  };
}
writeFileSync('_deps2_reading.json', JSON.stringify(rT), 'utf-8');
writeFileSync('_deps2_listening.json', JSON.stringify(lT), 'utf-8');
writeFileSync('_deps2_stories.json', JSON.stringify(sT), 'utf-8');
let core0 = 0, sum = 0, n = 0;
for (const t of [rT, lT]) for (const d of Object.values(t)) { n++; const c = d.vocabIds.length + d.grammarIds.length; sum += c; if (!c) core0++; }
console.log('r:', Object.keys(rT).length, '/ l:', Object.keys(lT).length, '/ s:', Object.keys(sT).length,
  '/ 핵심0:', core0, '/ 평균:', (sum / n).toFixed(1));
