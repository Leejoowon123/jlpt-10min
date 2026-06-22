// 브라우저 외에서 모듈 그래프와 핵심 로직을 검증.
// localStorage / window 가 없어 발생할 만한 곳은 stub.
globalThis.localStorage = {
  _s: {},
  getItem(k) { return this._s[k] ?? null; },
  setItem(k, v) { this._s[k] = String(v); },
  removeItem(k) { delete this._s[k]; },
};

const errs = [];
function ok(label, cond, detail) {
  if (!cond) { errs.push(`${label}${detail ? ' — ' + detail : ''}`); }
}

// 1) 데이터 모듈
const { vocab } = await import('./js/data/vocab.js');
const { grammar } = await import('./js/data/grammar.js');
const { reading } = await import('./js/data/reading.js');
const { listening } = await import('./js/data/listening.js');
const { grammarPairs } = await import('./js/data/grammarPairs.js');
console.log(`vocab=${vocab.length} grammar=${grammar.length} reading=${reading.length} listening=${listening.length} pairs=${grammarPairs.length}`);

// ── 콘텐츠 감사: 레벨별 개수 + N5 최소 임계치 ─────────────────────────
function countBy(items) {
  const m = { N5: 0, N4: 0, N3: 0, N2: 0 };
  for (const it of items) m[it.level] = (m[it.level] || 0) + 1;
  return m;
}
const counts = {
  vocab:     countBy(vocab),
  grammar:   countBy(grammar),
  reading:   countBy(reading),
  listening: countBy(listening),
  pairs:     countBy(grammarPairs),
};
console.log('\n=== content counts (by level) ===');
for (const [area, m] of Object.entries(counts)) {
  console.log(`  ${area.padEnd(10)} N5=${m.N5}  N4=${m.N4}  N3=${m.N3}  N2=${m.N2}`);
}
console.log('');
// N5 임계치 — N5 대량 확장 1차 완료 기준.
//   1차:    vocab 60  / grammar 20 / reading·listening·pairs 8
//   2.1:    vocab 100 / grammar 30 / reading·listening 12 / pairs 8 (페어 동결)
//   2.2:    vocab 130 / grammar 35 / reading·listening 16 / pairs 8 (페어 동결)
//   대량1차: vocab 250 / grammar 45 / reading·listening 25 / pairs 8 (페어 동결)
//   N5마무리(라운드 24): vocab 500 / kanji 100 / reading·listening 40 / sentenceBank 220
const N5_MIN = { vocab: 500, grammar: 45, reading: 40, listening: 40, pairs: 8 };
for (const [k, min] of Object.entries(N5_MIN)) {
  ok(`N5 ${k} >= ${min} (N5마무리)`, counts[k].N5 >= min, `actual=${counts[k].N5}`);
}

// 2) 데이터 무결성
const levels = new Set(['N5','N4','N3','N2']);
for (const v of vocab) {
  ok(`vocab ${v.id} level`, levels.has(v.level));
  for (const k of ['word','reading','meaningKo','exampleSentence','exampleTranslation','mnemonicText','imageKey']) {
    ok(`vocab ${v.id} field ${k}`, !!v[k]);
  }
  ok(`vocab ${v.id} tags is array`, Array.isArray(v.tags));
}
for (const g of grammar) {
  ok(`grammar ${g.id} level`, levels.has(g.level));
  ok(`grammar ${g.id} core`, g.pattern && g.meaningKo && g.explanation);
  ok(`grammar ${g.id} examples`, Array.isArray(g.examples) && g.examples.length > 0);
  ok(`grammar ${g.id} tags is array`, Array.isArray(g.tags));
}
for (const r of reading) {
  ok(`reading ${r.id} level`, levels.has(r.level));
  ok(`reading ${r.id} answerIndex`, typeof r.answerIndex === 'number' && r.answerIndex >= 0 && r.answerIndex < r.choices.length);
}
for (const l of listening) {
  ok(`listening ${l.id} script`, !!l.script);
  ok(`listening ${l.id} answerIndex`, typeof l.answerIndex === 'number' && l.answerIndex >= 0 && l.answerIndex < l.choices.length);
}
const gIds = new Set(grammar.map(g => g.id));
for (const p of grammarPairs) {
  ok(`pair ${p.id} a`, gIds.has(p.a));
  ok(`pair ${p.id} b`, gIds.has(p.b));
  ok(`pair ${p.id} answerIndex`, p.answerIndex >= 0 && p.answerIndex < p.choices.length);
}
const ids = new Set();
for (const v of [...vocab, ...grammar, ...reading, ...listening]) {
  ok(`id duplicate ${v.id}`, !ids.has(v.id));
  ids.add(v.id);
}

// 3) buildQuestion — 정답이 choices 에 있고, 선택 전 노출 텍스트(context+prompt)에는
//    정답·번역·해설 어떤 것도 들어 있지 않아야 한다.
const { buildQuestion } = await import('./js/questions.js');
function checkQuestion(itemType, itemId) {
  const q = buildQuestion(itemType, itemId);
  ok(`build ${itemId}`, !!q);
  if (!q) return;
  ok(`${itemId} choices=4`, q.choices.length === 4);
  ok(`${itemId} answerIndex`, q.answerIndex >= 0 && q.answerIndex < q.choices.length);
  ok(`${itemId} no dup choices`, new Set(q.choices).size === q.choices.length);

  // 선택 전 노출되는 표면 텍스트
  const pre = [
    q.prompt || '',
    q.context?.ja || '',
    q.extra?.scenario || '',
  ].join('\n');
  ok(`${itemId} no context.ko`, !('ko' in (q.context || {})), 'context.ko leaks');
  ok(`${itemId} no explanation pre`, !pre.includes(q.explanation || '###IMPOSSIBLE###'));
  // 독해는 지문에 정답 단서가 들어있는 게 정상이므로 "정답 텍스트 노출 없음" 검사를 스킵.
  // vocab/grammar: 정답 한국어 + 예문 번역이 선택 전 노출 텍스트에 섞이지 않아야 함.
  if (itemType === 'vocab' || itemType === 'grammar') {
    const correct = q.choices[q.answerIndex];
    ok(`${itemId} no correct meaning in pre`, !pre.includes(correct));
    const item = (itemType === 'vocab' ? vocab : grammar).find(x => x.id === itemId);
    const koTrans = itemType === 'vocab' ? item.exampleTranslation : item.examples[0]?.ko;
    if (koTrans) ok(`${itemId} no ko translation in pre`, !pre.includes(koTrans));
  }
  // listening: TTS 가능 환경에서 스크립트는 처음 숨김 — context 가 null 이어야 함
  if (itemType === 'listening') {
    ok(`${itemId} listening no pre context`, !q.context);
  }
}
vocab.forEach(v => checkQuestion('vocab', v.id));
grammar.forEach(g => checkQuestion('grammar', g.id));
reading.forEach(r => checkQuestion('reading', r.id));
listening.forEach(l => checkQuestion('listening', l.id));

// 단어 explanation: 단어 뜻 + 예문 + 예문 번역 모두 포함
for (const v of vocab) {
  const q = buildQuestion('vocab', v.id);
  ok(`vocab ${v.id} explanation has meaning`, q.explanation.includes(v.meaningKo));
  ok(`vocab ${v.id} explanation has example`, q.explanation.includes(v.exampleSentence));
  ok(`vocab ${v.id} explanation has translation`, q.explanation.includes(v.exampleTranslation));
}
// 문법 explanation: 예문 번역 포함
for (const g of grammar) {
  const q = buildQuestion('grammar', g.id);
  if (g.examples[0]) {
    ok(`grammar ${g.id} explanation has example.ko`, q.explanation.includes(g.examples[0].ko));
  }
}

// 4) curriculum — cold start 에서 10개 채워야 함
const { buildTodayQueue, previewBreakdown } = await import('./js/curriculum.js');
const q1 = buildTodayQueue();
console.log('cold start queue:', q1.length, 'breakdown:', previewBreakdown(q1));
ok('cold start queue==10', q1.length === 10, `got ${q1.length}`);
// 중복 itemId 없음
const qIds = new Set();
let dup = false;
for (const it of q1) { if (qIds.has(it.itemId)) dup = true; qIds.add(it.itemId); }
ok('queue unique itemIds', !dup);

// previewBreakdown(queue) === based on that queue
const pb = previewBreakdown(q1);
ok('previewBreakdown total matches queue', pb.total === q1.length);

// vocabMode: vocab 항목에만 설정 + 값은 image|example 만 허용
const ALLOWED_MODES = new Set(['image', 'example']);
let vocabSeen = 0, vocabImage = 0, vocabExample = 0;
for (const it of q1) {
  if (it.itemType === 'vocab') {
    vocabSeen++;
    ok(`vocab queue item ${it.itemId} has vocabMode`, ALLOWED_MODES.has(it.vocabMode),
       `vocabMode=${it.vocabMode}`);
    if (it.vocabMode === 'image')   vocabImage++;
    if (it.vocabMode === 'example') vocabExample++;
  } else {
    ok(`non-vocab item ${it.itemId} has no vocabMode`, !('vocabMode' in it));
  }
}
console.log(`vocab in queue: ${vocabSeen} (image=${vocabImage} example=${vocabExample})`);
if (vocabSeen >= 2) {
  // 70/30 분배 ≥ 1 image 보장 (round 적용)
  ok('at least one image mode when vocab>=2', vocabImage >= 1);
}

// 5) levelTargets 스키마
const { levelTargets, targetFor } = await import('./js/data/levelTargets.js');
ok('levelTargets is 4 levels', levelTargets.length === 4);
for (const t of levelTargets) {
  ok(`target ${t.level} schema`,
     ['level','targetVocab','targetKanji',
      'targetGrammarMin','targetGrammarMax',
      'targetReadingMin','targetReadingMax',
      'targetListeningMin','targetListeningMax',
      'descriptionKo'].every(k => k in t),
     `missing keys: ${['level','targetVocab','targetKanji','targetGrammarMin','targetGrammarMax','targetReadingMin','targetReadingMax','targetListeningMin','targetListeningMax','descriptionKo'].filter(k => !(k in t)).join(',')}`);
  ok(`target ${t.level} vocab>0`, t.targetVocab > 0);
  ok(`target ${t.level} kanji>0`, t.targetKanji > 0);
  ok(`target ${t.level} grammar min<=max`, t.targetGrammarMin <= t.targetGrammarMax);
  ok(`target ${t.level} reading min<=max`, t.targetReadingMin <= t.targetReadingMax);
  ok(`target ${t.level} listening min<=max`, t.targetListeningMin <= t.targetListeningMax);
}
// 누적 수치는 단조 증가 (N5 < N4 < N3 < N2)
const order = ['N5','N4','N3','N2'];
for (let i = 1; i < order.length; i++) {
  const a = targetFor(order[i-1]), b = targetFor(order[i]);
  ok(`vocab cumulative ${order[i-1]}<${order[i]}`, a.targetVocab < b.targetVocab);
  ok(`kanji cumulative ${order[i-1]}<${order[i]}`, a.targetKanji < b.targetKanji);
}

// 6) contentStats — progressFor 출력 + 실제 데이터와 일치 검증
const { progressFor } = await import('./js/contentStats.js');

// progressFor 가 실제 콘텐츠 카운트와 일치
const _pN5 = progressFor('N5');
const _actVocabN5    = vocab.filter(v => v.level === 'N5').length;
const _actGrammarN5  = grammar.filter(g => g.level === 'N5').length;
const _actReadingN5  = reading.filter(r => r.level === 'N5').length;
const _actListenN5   = listening.filter(l => l.level === 'N5').length;
ok('progressFor N5 vocab.have == 실제 N5 vocab',
   _pN5.vocab.have === _actVocabN5, `${_pN5.vocab.have} vs ${_actVocabN5}`);
ok('progressFor N5 grammar.have == 실제 N5 grammar',
   _pN5.grammar.have === _actGrammarN5);
ok('progressFor N5 reading.have == 실제 N5 reading',
   _pN5.reading.have === _actReadingN5);
ok('progressFor N5 listening.have == 실제 N5 listening',
   _pN5.listening.have === _actListenN5);

// home.js — 학습량 현황 카드(progressCard) 가 앱 UI에서 숨겨졌음을 검증.
// (contentStats 기반 progress 검증은 위쪽 progressFor 호출로 별도 유지)
const homeSrc = readFileSync(new URL('./js/views/home.js', import.meta.url), 'utf8');
const homeCode = homeSrc.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
ok('home.js: progressCard 부재',  !/id=["']progressCard["']/.test(homeCode));
ok('home.js: 학습량 현황 문구 부재', !/학습량 현황/.test(homeCode));
ok('home.js: progressFor import 부재',
   !/import[^;]*progressFor/.test(homeCode));
// 카드는 사라졌으니 N5 카운트 하드코딩 검사는 자동 무관 — 그래도 paranoid 로 한 번 더.
for (const [name, n] of [
  ['N5 vocab', _actVocabN5], ['N5 grammar', _actGrammarN5],
  ['N5 reading', _actReadingN5], ['N5 listening', _actListenN5],
]) {
  const re = new RegExp(`(?<![\\d.])${n}(?!\\d)(?!\\s*(?:px|em|%|rem|vh|vw))`);
  ok(`home.js: no hardcoded ${name} count (${n})`, !re.test(homeCode));
}

// study.js — 페이지화 + 세션 상수 정적 검사
const studySrc = readFileSync(new URL('./js/views/study.js', import.meta.url), 'utf8');
const studyCode = studySrc.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
ok('study.js: PAGE_SIZE 상수 존재',
   /const\s+PAGE_SIZE\s*=\s*\d+/.test(studyCode));
// 안정화 라운드: 순수 함수 분리 (applyFilter, getVisibleSlice).
ok('study.js: applyFilter export',   /export\s+function\s+applyFilter\s*\(/.test(studyCode));
ok('study.js: getVisibleSlice export', /export\s+function\s+getVisibleSlice\s*\(/.test(studyCode));

// 실제 로직 검증 — applyFilter 동작
const studyMod = await import('./js/views/study.js');
const _testList = vocab.filter(v => v.level === 'N5').slice(0, 50);
const _filtered = studyMod.applyFilter(_testList, 'vocab', { level: 'N5', tag: '', search: '' });
ok('applyFilter level 필터 정상', _filtered.length === _testList.length);
const _tagFiltered = studyMod.applyFilter(_testList, 'vocab', { level: 'N5', tag: '동사', search: '' });
ok('applyFilter tag 필터 정상',
   _tagFiltered.every(v => (v.tags || []).includes('동사')));
const _slice = studyMod.getVisibleSlice([1,2,3,4,5,6,7], 3);
ok('getVisibleSlice shown==3', _slice.shown.length === 3);
ok('getVisibleSlice hasMore true', _slice.hasMore === true);
ok('getVisibleSlice remaining 4', _slice.remaining === 4);
const _slice2 = studyMod.getVisibleSlice([1,2,3], 10);
ok('getVisibleSlice short list hasMore false', _slice2.hasMore === false);
ok('study.js: SESSION_TARGET 상수 존재',
   /const\s+SESSION_TARGET\s*=\s*\d+/.test(studyCode));
ok('study.js: 목록을 slice(0, visible) 로 제한',
   /\.slice\(0,\s*[a-zA-Z_.]*visible\)/.test(studyCode));
ok('study.js: 세션 startSession 함수 존재',
   /function\s+startSession\s*\(/.test(studyCode));
ok('study.js: 검색 input 사용',
   /search-input/.test(studyCode));
ok('study.js: 더 보기 버튼 사용',
   /more-btn/.test(studyCode));
console.log('\n=== progress vs targets ===');
for (const L of order) {
  const p = progressFor(L);
  console.log(`  ${L}  vocab ${p.vocab.have}/${p.vocab.target}` +
    `  kanji ${p.kanji.have}/${p.kanji.target}` +
    `  grammar ${p.grammar.have}/${p.grammar.min}~${p.grammar.max}` +
    `  reading ${p.reading.have}/${p.reading.min}~${p.reading.max}` +
    `  listening ${p.listening.have}/${p.listening.min}~${p.listening.max}`);
}

// 7) conversationTopics — 스키마/참조 무결성
const { conversationTopics } = await import('./js/data/conversationTopics.js');
ok('conversationTopics non-empty', conversationTopics.length > 0);
const topicIds = new Set();
const vocabIdSet = new Set(vocab.map(v => v.id));
const grammarIdSet = new Set(grammar.map(g => g.id));
for (const t of conversationTopics) {
  ok(`topic ${t.id} unique`,           !topicIds.has(t.id)); topicIds.add(t.id);
  ok(`topic ${t.id} level valid`,      levels.has(t.level));
  ok(`topic ${t.id} titleKo`,          !!t.titleKo);
  ok(`topic ${t.id} situationTags arr`, Array.isArray(t.situationTags));
  ok(`topic ${t.id} requiredVocabIds non-empty`,
     Array.isArray(t.requiredVocabIds) && t.requiredVocabIds.length > 0);
  ok(`topic ${t.id} requiredGrammarIds non-empty`,
     Array.isArray(t.requiredGrammarIds) && t.requiredGrammarIds.length > 0);
  for (const id of t.requiredVocabIds) {
    ok(`topic ${t.id} vocab ref ${id}`, vocabIdSet.has(id));
  }
  for (const id of t.requiredGrammarIds) {
    ok(`topic ${t.id} grammar ref ${id}`, grammarIdSet.has(id));
  }
  ok(`topic ${t.id} starterQuestions non-empty`,
     Array.isArray(t.starterQuestions) && t.starterQuestions.length > 0);
  for (const [i, q] of t.starterQuestions.entries()) {
    ok(`topic ${t.id} starter[${i}].ja`,  !!q.ja);
    ok(`topic ${t.id} starter[${i}].ko`,  !!q.ko);
    ok(`topic ${t.id} starter[${i}].sampleAnswers non-empty`,
       Array.isArray(q.sampleAnswers) && q.sampleAnswers.length > 0);
  }
  ok(`topic ${t.id} repairHints arr`, Array.isArray(t.repairHints));
}
// N5 주제 ≥ 6 (목표치)
const n5Topics = conversationTopics.filter(t => t.level === 'N5');
ok('conv topics N5 >= 6', n5Topics.length >= 6, `actual=${n5Topics.length}`);

// 8) conversationReadiness — 무학습 시 0%, 학습 시 상승
const { getConversationReadiness } = await import('./js/conversationReadiness.js');
// 위 5)에서 v_n5_1 만 wrong 으로 등록되어 있음. 새 storage 로 분리 — 그냥 추가 reviewState 주입.
const { update: updateStore } = await import('./js/storage.js');
// 자기소개 주제 모든 ID 학습 처리
const selfIntro = conversationTopics.find(t => t.id === 'conv_n5_self_intro');
const allIds = [...selfIntro.requiredVocabIds, ...selfIntro.requiredGrammarIds];
updateStore(s => {
  for (const id of allIds) {
    s.reviewStates[id] = s.reviewStates[id] || {
      itemType: id.startsWith('v_') ? 'vocab' : 'grammar',
      correctCount: 1, wrongCount: 0, dueAt: Date.now() + 86400000, interval: 1, ease: 2.5,
    };
  }
});
const rd = getConversationReadiness('N5');
const selfRd = rd.find(r => r.topicId === 'conv_n5_self_intro');
ok('readiness: self_intro 100% after training', selfRd && selfRd.percent === 100,
   `percent=${selfRd?.percent}`);
ok('readiness: self_intro marked ready', selfRd?.ready === true);
const cafeRd = rd.find(r => r.topicId === 'conv_n5_cafe');
ok('readiness: cafe untrained low', cafeRd && cafeRd.percent < 70,
   `percent=${cafeRd?.percent}`);

console.log('\n=== conversation readiness (N5) ===');
for (const r of rd) {
  console.log(`  ${r.titleKo.padEnd(8)}  ${String(r.percent).padStart(3)}% ` +
    `(vocab ${r.vocabKnown}/${r.vocabTotal}  grammar ${r.grammarKnown}/${r.grammarTotal})`);
}

// 9) localEvaluator + conversationEngine — 0.1 프로토타입
const { evaluateConversationAnswer, normalizeJapanese, detectKnownVocabulary, detectGrammarPattern }
  = await import('./js/localEvaluator.js');
const { createEngine } = await import('./js/conversationEngine.js');

ok('normalizeJapanese trims',
   normalizeJapanese('  はい です  ') === 'はい です');
ok('normalizeJapanese non-string → empty',
   normalizeJapanese(undefined) === '' && normalizeJapanese(null) === '');

const topicSelf = conversationTopics.find(t => t.id === 'conv_n5_self_intro');

// 빈 답변
const emptyEval = evaluateConversationAnswer({ topic: topicSelf, question: topicSelf.starterQuestions[0], userText: '' });
ok('eval empty: score === 0', emptyEval.score === 0);
ok('eval empty: ok === false', emptyEval.ok === false);
ok('eval empty: empty_answer hint', emptyEval.hints.some(h => h.issue === 'empty_answer'));
ok('eval empty: sampleAnswer present', !!emptyEval.sampleAnswer);

// 정상 답변 — 어휘 + 패턴
const goodEval = evaluateConversationAnswer({
  topic: topicSelf, question: topicSelf.starterQuestions[0],
  userText: '私は学生です。',
});
ok('eval good: score > empty', goodEval.score > emptyEval.score);
ok('eval good: usedVocab includes 学生',
   goodEval.usedVocab.some(v => v.id === 'v_n5_19'));
ok('eval good: detected 〜は〜です',
   goodEval.detectedPatterns.includes('〜は〜です'));
ok('eval good: sampleAnswer present', !!goodEval.sampleAnswer);

// 패턴은 있지만 어휘 미사용
const partialEval = evaluateConversationAnswer({
  topic: topicSelf, question: topicSelf.starterQuestions[0],
  userText: '私はミンです。',
});
ok('eval partial: score >= 50 (pattern only)', partialEval.score >= 50);
ok('eval partial: 〜は〜です detected', partialEval.detectedPatterns.includes('〜は〜です'));

// detect helpers
const detect = detectKnownVocabulary('野菜と肉を食べます。', topicSelf.requiredVocabIds);
ok('detect: word matching works (no match here for self_intro vocab)', detect.length === 0);

const familyTopic = conversationTopics.find(t => t.id === 'conv_n5_family');
const detect2 = detectKnownVocabulary('父と母がいます。', familyTopic.requiredVocabIds);
ok('detect: family vocab matched (父+母)', detect2.length === 2);

const patAB = detectGrammarPattern('はい、学生です。', [], ['〜は〜です','はい、〜です']);
ok('detectGrammarPattern: 「はい、〜です」 matched', patAB.includes('はい、〜です'));

// ConversationEngine
const eng = createEngine('conv_n5_self_intro');
ok('engine created for valid topic', !!eng);
ok('engine bad topic null', createEngine('not_exists') === null);
ok('engine total = starter count', eng.totalQuestions() === topicSelf.starterQuestions.length);
ok('engine starts at Q1', eng.currentIndex() === 0);
const r1 = eng.submitAnswer('私は学生です。');
ok('engine submitAnswer returns evaluation', !!r1 && typeof r1.score === 'number');
eng.next();
ok('engine after next: index advanced', eng.currentIndex() === 1);
eng.submitAnswer('はい、学生です。');
eng.next();
ok('engine isDone after all', eng.isDone());
const sum = eng.summary();
ok('engine summary totals',
   sum.totalAnswered === 2 && sum.totalQuestions === topicSelf.starterQuestions.length);
ok('engine summary avg > 0', sum.averageScore > 0);
ok('engine summary: turns array', Array.isArray(sum.turns) && sum.turns.length === 2);

// 회화 엔진이 외부 starterQuestions 만 사용하는지 — 구조 확인 (turn.question.ja === topic.starterQuestions[i].ja)
for (let i = 0; i < sum.turns.length; i++) {
  ok(`engine turn[${i}] uses starterQuestions only`,
     sum.turns[i].question.ja === topicSelf.starterQuestions[i].ja);
}

// 10) STT adapter — Node 환경에서 안전 폴백
const stt = await import('./js/stt.js');
ok('stt: sttAvailable false in Node',  stt.sttAvailable() === false);
const sttSession = stt.createSttSession({ lang: 'ja-JP' });
ok('stt: session.ok false in Node',    sttSession.ok === false);
ok('stt: session.reason unsupported',  sttSession.reason === 'unsupported');
ok('stt: session.start no-throw',      (() => { try { sttSession.start(); return true; } catch { return false; } })());
ok('stt: session.stop no-throw',       (() => { try { sttSession.stop(); return true; } catch { return false; } })());
ok('stt: isListening false',           sttSession.isListening() === false);

// 11) storage defaultState includes conversationProgress
const stateMod = await import('./js/state.js');
const storageMod = await import('./js/storage.js');
const s0 = storageMod.getState();
ok('storage: conversationProgress defaultState exists',
   s0.conversationProgress && typeof s0.conversationProgress === 'object');

// 12) recordConversationAttempt + markCompleted
stateMod.recordConversationAttempt('conv_n5_self_intro', {
  questionJa: 'お名前は何ですか。',
  userText: '私は学生です。',
  score: 80, ok: true,
});
stateMod.recordConversationAttempt('conv_n5_self_intro', {
  questionJa: '学生ですか。',
  userText: 'はい、学生です。',
  score: 70, ok: true,
});
const prog1 = stateMod.getConversationProgress('conv_n5_self_intro');
ok('progress: attempts recorded', prog1 && prog1.attempts.length === 2);
ok('progress: lastScore = last attempt', prog1.lastScore === 70);
ok('progress: bestScore = max', prog1.bestScore === 80);
ok('progress: completedCount initial 0', prog1.completedCount === 0);

stateMod.markConversationCompleted('conv_n5_self_intro');
const prog2 = stateMod.getConversationProgress('conv_n5_self_intro');
ok('progress: completedCount=1 after mark', prog2.completedCount === 1);
ok('progress: bestScore preserved after mark', prog2.bestScore === 80);

// 13) LocalEvaluator — short / non-japanese / polite-ending detection
const evalShort = evaluateConversationAnswer({
  topic: topicSelf, question: topicSelf.starterQuestions[0], userText: 'はい',
});
ok('eval short: too_short hint',
   evalShort.hints.some(h => h.issue === 'too_short'));
ok('eval short: score capped <= 40',
   evalShort.score <= 40);

const evalNotJp = evaluateConversationAnswer({
  topic: topicSelf, question: topicSelf.starterQuestions[0], userText: 'hello world',
});
ok('eval non-jp: not_japanese hint',
   evalNotJp.hints.some(h => h.issue === 'not_japanese'));

const evalImpolite = evaluateConversationAnswer({
  topic: topicSelf, question: topicSelf.starterQuestions[0], userText: '私は学生',
});
ok('eval impolite: polite_ending or missing_desu hint',
   evalImpolite.hints.some(h => h.issue === 'polite_ending' || h.issue === 'missing_desu'));

// でした 종결 인식 — 정중체로 인정되어 hint 미발생.
const evalDeshita = evaluateConversationAnswer({
  topic: topicSelf, question: topicSelf.starterQuestions[0], userText: '私は学生でした。',
});
ok('eval でした: not flagged as impolite',
   !evalDeshita.hints.some(h => h.issue === 'polite_ending' || h.issue === 'missing_desu'));

// 14) sentenceBank 무결성 + 임계치
const { sentenceBank } = await import('./js/data/sentenceBank.js');
const sentenceAccess = await import('./js/sentenceAccess.js');

console.log(`\n=== sentenceBank: total=${sentenceBank.length} ===`);

const VALID_SOURCE = new Set(['vocab','grammar','reading','listening','conversation']);
// vocabIdSet, grammarIdSet 은 위쪽에서 이미 선언됨 (라인 ~211) — 재사용.
const readingIdSet   = new Set(reading.map(r => r.id));
const listeningIdSet = new Set(listening.map(l => l.id));
const topicIdSet     = new Set(conversationTopics.map(t => t.id));

const sentIds = new Set();
let trueConvCount = 0;
for (const s of sentenceBank) {
  ok(`sentence ${s.id}: id unique`, !sentIds.has(s.id));
  sentIds.add(s.id);
  ok(`sentence ${s.id}: level valid`, levels.has(s.level));
  ok(`sentence ${s.id}: sourceType valid`, VALID_SOURCE.has(s.sourceType));
  // sourceId 가 실존하는지
  const inSet =
    (s.sourceType === 'vocab'        && vocabIdSet.has(s.sourceId)) ||
    (s.sourceType === 'grammar'      && grammarIdSet.has(s.sourceId)) ||
    (s.sourceType === 'reading'      && readingIdSet.has(s.sourceId)) ||
    (s.sourceType === 'listening'    && listeningIdSet.has(s.sourceId)) ||
    (s.sourceType === 'conversation' && topicIdSet.has(s.sourceId));
  ok(`sentence ${s.id}: sourceId ${s.sourceId} exists in ${s.sourceType}`, inSet);
  // vocabIds / grammarIds 참조
  for (const vid of (s.vocabIds || [])) {
    ok(`sentence ${s.id}: vocabId ${vid} exists`, vocabIdSet.has(vid));
  }
  for (const gid of (s.grammarIds || [])) {
    ok(`sentence ${s.id}: grammarId ${gid} exists`, grammarIdSet.has(gid));
  }
  ok(`sentence ${s.id}: ja non-empty`, !!s.ja && s.ja.length > 0);
  ok(`sentence ${s.id}: ko non-empty`, !!s.ko && s.ko.length > 0);
  ok(`sentence ${s.id}: situationTags array`, Array.isArray(s.situationTags));
  ok(`sentence ${s.id}: canUseInConversation boolean`, typeof s.canUseInConversation === 'boolean');
  if (s.canUseInConversation) trueConvCount++;
}
// 임계치 — N5 마무리 기준 (N5 sentenceBank ≥ 220, 회화 가능 ≥ 120)
const n5Sentences = sentenceBank.filter(s => s.level === 'N5').length;
ok(`sentenceBank: N5 >= 220 (N5마무리)`, n5Sentences >= 220, `actual=${n5Sentences}`);
const n5ConvSentences = sentenceBank.filter(s => s.level === 'N5' && s.canUseInConversation === true).length;
ok(`sentenceBank: N5 회화 가능 >= 120 (N5마무리)`, n5ConvSentences >= 120, `actual=${n5ConvSentences}`);
ok(`sentenceBank: canUseInConversation==true >= 20`, trueConvCount >= 20, `actual=${trueConvCount}`);
ok(`sentenceBank: total >= 150`, sentenceBank.length >= 150, `actual=${sentenceBank.length}`);

// sentenceAccess 유틸
ok('getSentencesByLevel(N5) returns array', Array.isArray(sentenceAccess.getSentencesByLevel('N5')));
const convPool = sentenceAccess.getConversationUsableSentences('N5');
ok('getConversationUsableSentences(N5) >= 20', convPool.length >= 20);
const forTopic = sentenceAccess.getSentencesForTopic('conv_n5_self_intro', {});
ok('getSentencesForTopic returns array', Array.isArray(forTopic));
ok('getSentencesForTopic(self_intro) > 0', forTopic.length > 0,
   `length=${forTopic.length}`);

// known 카운트 변화
const noKnowledge = sentenceAccess.getKnownSentences('N5', {});
ok('getKnownSentences with empty rs === 0', noKnowledge.length === 0);
const rsLearned = {};
// 학생/명전 등 self_intro 관련 어휘/문법 학습 처리
for (const id of ['v_n5_19','v_n5_20','g_n5_1']) rsLearned[id] = { correctCount: 1, wrongCount: 0 };
const someKnown = sentenceAccess.getKnownSentences('N5', rsLearned);
ok('getKnownSentences with partial rs > 0', someKnown.length > 0,
   `learned=${someKnown.length}`);

// topicSentenceCoverage
const cov0 = sentenceAccess.topicSentenceCoverage('conv_n5_self_intro', {});
const cov1 = sentenceAccess.topicSentenceCoverage('conv_n5_self_intro', rsLearned);
ok('coverage relatedCount stable', cov0.relatedCount === cov1.relatedCount);
ok('coverage knownCount increases with learning', cov1.knownCount > cov0.knownCount,
   `before=${cov0.knownCount} after=${cov1.knownCount}`);

// conversationReadiness 가 sentence count 노출
const rdLearned = (await import('./js/conversationReadiness.js')).getConversationReadiness('N5');
const selfReadiness = rdLearned.find(r => r.topicId === 'conv_n5_self_intro');
ok('readiness exposes relatedSentenceCount', typeof selfReadiness.relatedSentenceCount === 'number');
ok('readiness exposes knownSentenceCount',   typeof selfReadiness.knownSentenceCount   === 'number');
ok('readiness exposes partialSentenceCount', typeof selfReadiness.partialSentenceCount === 'number');

// 2.1 라운드 — 회화 주제별 relatedSentenceCount 가 ≥ 1 (콘텐츠 부족 회피).
// 6개 주제 중 최소 3개는 사실상 더 많아져야 한다 (작성 시 의도).
const allRd = rdLearned;
// N5 회화 주제 — 대량1차 라운드에서 4개 추가 (총 10개 이상).
const N5_CONV_TOPIC_IDS = [
  'conv_n5_self_intro','conv_n5_family','conv_n5_cafe',
  'conv_n5_directions','conv_n5_appointment','conv_n5_weather_routine',
  'conv_n5_school_life','conv_n5_shopping','conv_n5_phone','conv_n5_hospital',
];
const n5ConvTopicCount = conversationTopics.filter(t => t.level === 'N5').length;
ok('N5 conversationTopics >= 10 (대량1차)', n5ConvTopicCount >= 10,
   `actual=${n5ConvTopicCount}`);
console.log('\n=== related sentences per topic (대량1차) ===');
for (const tid of N5_CONV_TOPIC_IDS) {
  const r = allRd.find(x => x.topicId === tid);
  if (r) console.log(`  ${tid.padEnd(28)}  related=${r.relatedSentenceCount}`);
  ok(`topic ${tid}: relatedSentenceCount >= 5`,
     r && r.relatedSentenceCount >= 5,
     `actual=${r?.relatedSentenceCount}`);
}

// 15) 회화 0.3-lite — sentenceBank 추천 함수
const { getKnownSentencesForTopic, getPracticeSentencesForTopic, pickBestSampleSentence, classifyForUser }
  = sentenceAccess;

// 학습 전 상태 - 모든 ref 가진 문장은 locked
const groupsEmpty = getPracticeSentencesForTopic('conv_n5_self_intro', {});
ok('getPracticeSentencesForTopic returns object',
   groupsEmpty && Array.isArray(groupsEmpty.known) && Array.isArray(groupsEmpty.partial) && Array.isArray(groupsEmpty.locked));
ok('empty rs: known empty (mostly)', groupsEmpty.known.length === 0 || groupsEmpty.known.every(s => !s.vocabIds.length && !s.grammarIds.length));
ok('empty rs: locked has entries', groupsEmpty.locked.length > 0);

const knownEmpty = getKnownSentencesForTopic('conv_n5_self_intro', {});
ok('getKnownSentencesForTopic empty when no rs',
   knownEmpty.length === 0 || knownEmpty.every(s => (!s.vocabIds.length && !s.grammarIds.length)));

// 무학습 상태에서 pickBestSampleSentence 는 null
const bestEmpty = pickBestSampleSentence('conv_n5_self_intro',
  conversationTopics.find(t => t.id === 'conv_n5_self_intro').starterQuestions[0], {});
ok('pickBestSampleSentence: null when no known', bestEmpty === null);

// 학습 후
const rsTrained = {};
const targetTopic = conversationTopics.find(t => t.id === 'conv_n5_self_intro');
for (const id of [...targetTopic.requiredVocabIds, ...targetTopic.requiredGrammarIds]) {
  rsTrained[id] = { correctCount: 1, wrongCount: 0 };
}
const groupsAfter = getPracticeSentencesForTopic('conv_n5_self_intro', rsTrained);
ok('trained: known has entries',  groupsAfter.known.length > 0,
   `known=${groupsAfter.known.length}`);

const bestAfter = pickBestSampleSentence('conv_n5_self_intro',
  targetTopic.starterQuestions[0], rsTrained);
ok('pickBestSampleSentence returns a sentenceBank entry after training',
   !!bestAfter && typeof bestAfter.ja === 'string' && bestAfter.id.startsWith('sent_'));

// classifyForUser — 부분 학습 상태 만들기
const rsPartial = { 'g_n5_1': { correctCount: 1, wrongCount: 0 } };
const someSent = sentenceBank.find(s => s.grammarIds.includes('g_n5_1') && s.vocabIds.length > 0);
ok('classifyForUser partial when 일부만 학습',
   classifyForUser(someSent, rsPartial) === 'partial');
const sentRefFree = sentenceBank.find(s => (s.vocabIds.length + s.grammarIds.length) === 0);
ok('classifyForUser known for ref-less sentence',
   !sentRefFree || classifyForUser(sentRefFree, {}) === 'known');

// 16) evaluateConversationAnswer 결과 확장 — knownSampleSentence / relatedPracticeSentences
const evalNoLearning = evaluateConversationAnswer({
  topic: targetTopic, question: targetTopic.starterQuestions[0],
  userText: '私は学生です。', reviewStates: {},
});
ok('eval no-learning has knownSampleSentence field',
   'knownSampleSentence' in evalNoLearning);
ok('eval no-learning knownSampleSentence === null',
   evalNoLearning.knownSampleSentence === null);
ok('eval no-learning relatedPracticeSentences is array',
   Array.isArray(evalNoLearning.relatedPracticeSentences));
ok('eval no-learning sampleAnswer fallback present',
   !!evalNoLearning.sampleAnswer);

const evalAfter = evaluateConversationAnswer({
  topic: targetTopic, question: targetTopic.starterQuestions[0],
  userText: '私は学生です。', reviewStates: rsTrained,
});
ok('eval trained has knownSampleSentence object',
   evalAfter.knownSampleSentence && typeof evalAfter.knownSampleSentence.ja === 'string');
ok('eval trained relatedPracticeSentences <= 3',
   evalAfter.relatedPracticeSentences.length <= 3);
ok('eval trained relatedPracticeSentences entries have ja/ko/status',
   evalAfter.relatedPracticeSentences.every(s => s.ja && s.ko && (s.status === 'known' || s.status === 'partial')));
// 추천 문장은 모두 sentenceBank 출처
const sentenceBankIds = new Set(sentenceBank.map(s => s.id));
ok('eval trained: knownSampleSentence id in sentenceBank',
   sentenceBankIds.has(evalAfter.knownSampleSentence.id));
ok('eval trained: all related are sentenceBank ids',
   evalAfter.relatedPracticeSentences.every(s => sentenceBankIds.has(s.id)));
// knownSampleSentence 와 relatedPracticeSentences 가 중복되지 않음
ok('eval trained: known not duplicated in related',
   !evalAfter.relatedPracticeSentences.some(s => s.id === evalAfter.knownSampleSentence.id));

// 5) SRS recordResult + 실패노트 자동 등록
const { recordResult } = await import('./js/srs.js');
const { failureNotesList, markStudiedToday } = await import('./js/state.js');
const { getState } = await import('./js/storage.js');

const before = getState().userProgress.totalSessions || 0;
// markStudiedToday 가 idempotent 인지: 같은 날 두 번 호출해도 sessions/streak 가 1번만 증가
markStudiedToday();
markStudiedToday();
const after = getState().userProgress.totalSessions || 0;
ok('markStudiedToday idempotent', (after - before) === 1, `delta=${after - before}`);

recordResult('v_n5_1', 'vocab', false);
const fns = failureNotesList();
ok('failure note auto-register', fns.find(x => x.itemId === 'v_n5_1'));

// favorites: 구버전 호환 — 비단어 favorite 이 storage 에 들어 있어도
// UI/큐레이션 양쪽에서 무시되어야 한다.
const { toggleFavorite, favoritesList } = await import('./js/state.js');
toggleFavorite('vocab',   'v_n5_2');   // 단어 — 보여야 함
toggleFavorite('grammar', 'g_n5_1');   // 비단어 — 숨겨져야 함
toggleFavorite('reading', 'r_n5_1');   // 비단어 — 숨겨져야 함
const favList = favoritesList();
ok('favoritesList vocab only', favList.every(f => f.itemType === 'vocab'),
   'leaks: ' + favList.filter(f => f.itemType !== 'vocab').map(f => f.itemId).join(','));
ok('favoritesList contains v_n5_2', favList.some(f => f.itemId === 'v_n5_2'));

// 큐레이션도 vocab favorite 만 섞어야 한다.
// state 의 reviewStates 로 다른 항목이 신규 풀에서 빠지지 않게, 별도 인스턴스로 검사.
// 단순 정적 검사로 대체 — pickFavorite 내부에서 itemType === 'vocab' 필터 존재 확인.
const curriculumSrc = readFileSync(new URL('./js/curriculum.js', import.meta.url), 'utf8');
ok('pickFavorite filters vocab',
   /pickFavorite[\s\S]*?itemType\s*===\s*'vocab'/.test(curriculumSrc));

// 6) TTS 모듈 (window 없음 → unsupported 폴백)
const { ttsAvailable, speak } = await import('./js/tts.js');
ok('ttsAvailable false in node', ttsAvailable() === false);
const r = await speak('テスト');
ok('speak fallback', r.ok === false && r.reason === 'unsupported', `reason=${r.reason}`);

// 7) mnemonic
const { mnemonicSvg, knownImageKeys } = await import('./js/mnemonic.js');
const svg = mnemonicSvg('food', '食べる');
ok('mnemonic svg', svg.startsWith('<svg'));

// imageKey 다양성 — N5 단어가 늘어남에 따라 시각 반복을 줄이기 위함.
const _palette = knownImageKeys();
ok('mnemonic palette size >= 120 (대량1차)', _palette.size >= 120, `size=${_palette.size}`);
const n5VocabAll = vocab.filter(v => v.level === 'N5');
const n5Keys = new Set(n5VocabAll.map(v => v.imageKey));
ok('N5 vocab imageKey unique >= 110 (대량1차)', n5Keys.size >= 110, `unique=${n5Keys.size}`);
const n5KeyCounts = {};
for (const v of n5VocabAll) n5KeyCounts[v.imageKey] = (n5KeyCounts[v.imageKey] || 0) + 1;
const maxKey = Object.entries(n5KeyCounts).sort((a,b)=>b[1]-a[1])[0];
const maxRatio = maxKey[1] / n5VocabAll.length;
ok(`N5 vocab 가장 많이 쓰인 imageKey share <= 8% (${maxKey[0]}=${maxKey[1]}/${n5VocabAll.length})`,
   maxRatio <= 0.08);
// 모든 vocab.imageKey 가 mnemonic 팔레트 안에 있어 (또는 default 폴백) 안전하게 렌더.
let unknownKey = null;
for (const v of vocab) {
  if (!_palette.has(v.imageKey) && v.imageKey !== 'default') {
    unknownKey = `${v.id}:${v.imageKey}`;
    break;
  }
}
ok('vocab.imageKey 가 mnemonic 팔레트에 존재 (또는 default)', !unknownKey,
   unknownKey ? `unknown: ${unknownKey}` : '');

// ── N5 imageKey 분포 분석 (요약 리포트) ───────────────────────────
const _n5Total       = n5VocabAll.length;
const _n5UniqueKeys  = n5Keys.size;
const _n5Sorted      = Object.entries(n5KeyCounts).sort((a, b) => b[1] - a[1]);
const _dupGroups     = _n5Sorted.filter(([, n]) => n >= 2).length;
const _wordsInDup    = _n5Sorted.filter(([, n]) => n >= 2).reduce((s, [, n]) => s + n, 0);
const _dupBeyondOne  = _n5Sorted.filter(([, n]) => n >= 2).reduce((s, [, n]) => s + (n - 1), 0);
console.log('\n=== N5 imageKey 분포 분석 ===');
console.log(`  N5 vocab:                  ${_n5Total}`);
console.log(`  unique imageKey:           ${_n5UniqueKeys}`);
console.log(`  duplicate groups (>=2):    ${_dupGroups}`);
console.log(`  words in dup groups:       ${_wordsInDup}`);
console.log(`  duplicate beyond first:    ${_dupBeyondOne}`);
console.log('  TOP 20 imageKey:');
for (const [k, n] of _n5Sorted.slice(0, 20)) {
  console.log(`    ${k.padEnd(16)} ${n}`);
}

// 8) questionView 소스 확인 (정적 검사): favBtn 가 vocab 일 때만 렌더되는지 코드 패턴 확인
import { readFileSync } from 'node:fs';
const qvSrc = readFileSync(new URL('./js/views/questionView.js', import.meta.url), 'utf8');
ok('favBtn vocab only', /isVocab\s*\?\s*`<button class="btn ghost" id="favBtn"/.test(qvSrc));
ok('markStudiedToday in onPick', qvSrc.includes('markStudiedToday()'));
ok('no context.ko output', !qvSrc.includes('${escape(q.context.ko)}'));
ok('mnemonic moved to result', /result\.innerHTML\s*=\s*`[\s\S]*mnemonicHtml/.test(qvSrc));

const compareSrc = readFileSync(new URL('./js/views/grammarCompare.js', import.meta.url), 'utf8');
const compareCode = compareSrc.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
ok('compare imports markStudiedToday', /import[^;]*markStudiedToday/.test(compareCode));
ok('compare calls markStudiedToday', /markStudiedToday\s*\(\s*\)/.test(compareCode));

const todaySrc = readFileSync(new URL('./js/views/today.js', import.meta.url), 'utf8');
// 코멘트가 아닌 실행 코드에서 markStudiedToday 가 호출되지 않아야 한다.
const todayCodeOnly = todaySrc.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
ok('today no markStudiedToday call in code', !/markStudiedToday\s*\(/.test(todayCodeOnly));
ok('today no markStudiedToday import', !/import[^;]*markStudiedToday/.test(todayCodeOnly));
ok('today passes queue to preview', /previewBreakdown\(queue\)/.test(todaySrc));

// ── 이번 회차 격리: sessionResults 모듈 로컬 배열 + onAnswered 콜백 + 회차별 집계 ──
ok('today has sessionResults module state', /let\s+sessionResults\s*=/.test(todayCodeOnly));
ok('today resets sessionResults on entry', /sessionResults\s*=\s*\[\s*\]/.test(todayCodeOnly));
ok('today wires onAnswered to renderQuestion',
   /onAnswered\s*:\s*\([^)]*\)\s*=>\s*\{[\s\S]*?sessionResults\.push/.test(todayCodeOnly));
// 완료 화면은 누적 누적 헬퍼(state)가 아닌 회차 배열을 기준으로 집계해야 한다.
ok('today summary uses session-local stats',
   !/todaySessionStats\s*\(/.test(todayCodeOnly) && !/todayWrongItems\s*\(/.test(todayCodeOnly));
ok('today summary computes correct/wrong from sessionResults',
   /sessionResults\.filter\([^)]*r\.correct\)/.test(todayCodeOnly));

// questionView 가 onAnswered 콜백을 호출하는지 (correct/itemType/itemId 시그니처)
const qvCodeOnly = qvSrc.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
ok('questionView calls onAnswered with payload',
   /onAnswered\s*\?\.\s*\(\s*\{[^}]*correct[^}]*itemType[^}]*itemId[^}]*\}\s*\)/.test(qvCodeOnly));

// ── 콘텐츠 품질 감사 (실패가 아닌 경고 위주) ─────────────────────
//   - 명백한 오류는 ok() 로 실패 처리 (blocking).
//   - 경고는 2단 분류 (라운드 25 안정화):
//       unreviewed — 아직 판정하지 않은 신규 경고. 0 으로 줄이는 것이 목표.
//       reviewed   — 검토 후 의도적으로 유지하기로 판정한 경고 (사유는 docs/content-status.md).
//   - 향후 N5 500 / N4 확장 시에도 같은 기준 적용.
const warnings = [];
const warn = (msg) => warnings.push(msg);
const reviewedWarnings = [];
const warnReviewed = (msg) => reviewedWarnings.push(msg);

console.log('\n=== 콘텐츠 품질 감사 ===');

// vocab.word 전역 중복 → 명백한 오류로 실패 (라운드 27 — 레벨 교차 중복도 금지)
const _wordSeen = new Map();
for (const v of vocab) {
  if (_wordSeen.has(v.word)) {
    ok(`vocab.word 전역 중복 금지 ${v.id} vs ${_wordSeen.get(v.word)}: "${v.word}"`, false);
  } else {
    _wordSeen.set(v.word, v.id);
  }
}
ok('vocab.word 전역 고유 (레벨 교차 포함)', true); // sentinel — 위 루프가 실패하면 이미 errs에 추가

// reading + meaningKo 조합 중복 → 경고 (동철이의어/사실상 같은 항목 검토용)
{
  const _rmSeen = new Map();
  const _rmDups = [];
  for (const v of vocab) {
    const key = `${v.reading}|${v.meaningKo}`;
    if (_rmSeen.has(key)) _rmDups.push(`${_rmSeen.get(key)} vs ${v.id}: ${v.reading}/${v.meaningKo}`);
    else _rmSeen.set(key, v.id);
  }
  if (_rmDups.length) {
    warn(`vocab reading+meaningKo 조합 중복: ${_rmDups.length}건`);
    for (const d of _rmDups.slice(0, 5)) warn(`  ${d}`);
  }
}

// meaningKo 완전 동일 쌍 → reviewed 리포트 (라운드 28 판정):
//   한국어 뜻이 같아도 단어가 다르면 유의어쌍(車/自動車) 또는 한국어 동철이의
//   (書く 쓰다[write] / 苦い 쓰다[bitter])로 의도적 — 검토 후 유지. 수가 급증하면 재검토.
{
  const _mkSeen = new Map();
  let _mkPairs = 0;
  for (const v of vocab) {
    if (_mkSeen.has(v.meaningKo)) _mkPairs++;
    else _mkSeen.set(v.meaningKo, v.word);
  }
  if (_mkPairs) warnReviewed(`vocab meaningKo 동일 쌍 (유의어/한국어 동철이의 — 검토 후 유지): ${_mkPairs}건`);
}

// vocab.meaningKo 과다 중복 → 경고 (3개 이상 같은 의미)
const _meaningCount = {};
for (const v of vocab) {
  const k = v.meaningKo;
  (_meaningCount[k] = _meaningCount[k] || []).push(`${v.id}:${v.word}`);
}
const meaningDups = Object.entries(_meaningCount).filter(([, arr]) => arr.length >= 3);
if (meaningDups.length) {
  warn(`vocab meaningKo 과다 중복 (≥3): ${meaningDups.length}건`);
  for (const [m, ids] of meaningDups.slice(0, 5)) warn(`  "${m}" — ${ids.join(', ')}`);
}

// vocab.exampleSentence 완전 중복 → 명백한 오류로 실패 (라운드 27 상향)
const _sentSeen = {};
for (const v of vocab) {
  const s = v.exampleSentence;
  (_sentSeen[s] = _sentSeen[s] || []).push(`${v.id}:${v.word}`);
}
const sentDups = Object.entries(_sentSeen).filter(([, arr]) => arr.length >= 2);
for (const [s, ids] of sentDups) {
  ok(`vocab exampleSentence 완전 중복 금지: "${s}" — ${ids.join(', ')}`, false);
}
ok('vocab exampleSentence 완전 중복 0', true);

// 유사 exampleSentence 후보 → 경고 (공백/구두점 제거 후 편집거리 ≤2)
//   같은 단어쌍을 가르치는 사실상 같은 예문을 찾기 위한 리포트.
{
  const norm = (s) => (s || '').replace(/[、。!?！？\s]/g, '');
  function editDist2(a, b) {
    // 편집거리 ≤2 인지 빠르게 판정 (밴드 폭 2)
    if (Math.abs(a.length - b.length) > 2) return false;
    const m = a.length, n = b.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      let rowMin = i;
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > 2) return false;
      prev = cur;
    }
    return prev[n] <= 2;
  }
  const entries = vocab.filter(v => v.exampleSentence)
    .map(v => ({ id: v.id, word: v.word, n: norm(v.exampleSentence) }));
  // 길이 버킷으로 비교 횟수 제한
  const byLen = new Map();
  for (const e of entries) {
    for (const L of [e.n.length - 1, e.n.length, e.n.length + 1, e.n.length + 2]) {
      if (!byLen.has(L)) byLen.set(L, []);
    }
    byLen.get(e.n.length).push(e);
  }
  const similar = [];
  for (let i = 0; i < entries.length; i++) {
    const a = entries[i];
    for (let dl = 0; dl <= 2; dl++) {
      for (const b of (byLen.get(a.n.length + dl) || [])) {
        if (b === a) continue;
        if (dl === 0 && entries.indexOf(b) <= i) continue; // 같은 버킷 중복 비교 방지
        if (a.n === b.n) continue; // 완전 중복은 위에서 blocking
        if (a.n.length >= 6 && editDist2(a.n, b.n)) {
          similar.push(`${a.id}(${a.word}) ≈ ${b.id}(${b.word})`);
          if (similar.length >= 30) break;
        }
      }
      if (similar.length >= 30) break;
    }
    if (similar.length >= 30) break;
  }
  // 라운드 27 판정: 전수 검토 결과 전부 "최소 문형 공유" (Xが痛いです / Xを買いました 등)
  //   — 서로 다른 표제어를 같은 기초 문형으로 가르치는 의도적 패턴. 완전 중복은
  //   위의 blocking 검증이 별도로 차단하므로 이 범주는 검토 후 유지.
  if (similar.length) {
    warnReviewed(`vocab 유사 예문 (최소 문형 공유 — 검토 후 유지, 상위 30 표집): ${similar.length}건`);
  }
}

// vocab.exampleTranslation 누락 또는 너무 짧음
let _emptyTrans = 0;
for (const v of vocab) {
  if (!v.exampleTranslation || v.exampleTranslation.trim().length < 2) _emptyTrans++;
}
if (_emptyTrans) warn(`vocab exampleTranslation 비어있거나 너무 짧음: ${_emptyTrans}건`);

// 너무 긴 exampleSentence (N5 기준 30자 이상)
const longSentences = [];
for (const v of vocab.filter(x => x.level === 'N5')) {
  if (v.exampleSentence.length >= 30) {
    longSentences.push({ id: v.id, word: v.word, len: v.exampleSentence.length, text: v.exampleSentence });
  }
}
if (longSentences.length) {
  longSentences.sort((a, b) => b.len - a.len);
  warn(`N5 예문 ≥30자: ${longSentences.length}건`);
  for (const x of longSentences.slice(0, 5)) warn(`  ${x.id} (${x.len}자) ${x.word}: ${x.text}`);
}

// N5치고 어려운 한자 후보 — 예문 한자 개수 ≥5
//   라운드 25 판정 기준: 예문의 모든 한자가 "N5 학습 범위"
//   (N5 한자 덱 100자 ∪ N5 단어 표제어 한자) 안이고 후리가나 100% 이면
//   학습 대상 노출이므로 "검토 후 유지" (reviewed). 범위 밖 한자가 섞이면 unreviewed.
const KANJI_RE = /[一-鿿]/g;
const { kanji: _kanjiForAudit } = await import('./js/data/kanji.js');
const _n5LearnableKanji = new Set();
for (const k of _kanjiForAudit.filter(x => x.level === 'N5')) _n5LearnableKanji.add(k.kanji);
for (const v of vocab.filter(x => x.level === 'N5')) {
  for (const c of (v.word.match(KANJI_RE) || [])) _n5LearnableKanji.add(c);
}
const hardKanjiReviewed = [];
const hardKanjiUnreviewed = [];
for (const v of vocab.filter(x => x.level === 'N5')) {
  const ks = v.exampleSentence.match(KANJI_RE) || [];
  if (ks.length < 5) continue;
  const outside = [...new Set(ks)].filter(c => !_n5LearnableKanji.has(c));
  const entry = { id: v.id, word: v.word, kanjiCount: ks.length, outside, text: v.exampleSentence };
  (outside.length ? hardKanjiUnreviewed : hardKanjiReviewed).push(entry);
}
if (hardKanjiReviewed.length) {
  warnReviewed(`N5 예문 한자 ≥5개 (전부 N5 학습 범위 내 — 검토 후 유지): ${hardKanjiReviewed.length}건`);
}
if (hardKanjiUnreviewed.length) {
  hardKanjiUnreviewed.sort((a, b) => b.kanjiCount - a.kanjiCount);
  warn(`N5 예문에 N5 학습 범위 밖 한자: ${hardKanjiUnreviewed.length}건 (예문 수정 필요)`);
  for (const x of hardKanjiUnreviewed.slice(0, 5))
    warn(`  ${x.id} ${x.word} 밖:[${x.outside.join('')}] ${x.text}`);
}

// grammar.pattern 중복
const _patSeen = new Map();
for (const g of grammar) {
  const key = `${g.level}:${g.pattern}`;
  if (_patSeen.has(key)) {
    ok(`grammar.pattern 중복 금지 ${g.id} vs ${_patSeen.get(key)}: "${g.pattern}"`, false);
  } else {
    _patSeen.set(key, g.id);
  }
}
ok('grammar.pattern 모두 고유 (레벨 내)', true);

// reading/listening choices — 빈 choice 경고 + 항목 내 중복 blocking (라운드 27)
let _shortChoices = 0;
for (const x of [...reading, ...listening]) {
  for (const c of x.choices) {
    if (!c || c.trim().length === 0) _shortChoices++;
  }
  if (new Set(x.choices).size !== x.choices.length) {
    ok(`choices 항목 내 중복 금지: ${x.id}`, false);
  }
}
ok('reading/listening choices 항목 내 중복 0', true);
if (_shortChoices) warn(`reading/listening 빈 choice: ${_shortChoices}건`);

// sentenceBank.ja 완전 중복 → 명백한 오류로 실패 (라운드 27 상향)
const _sbSeen = {};
for (const s of sentenceBank) {
  (_sbSeen[s.ja] = _sbSeen[s.ja] || []).push(s.id);
}
const sbDups = Object.entries(_sbSeen).filter(([, arr]) => arr.length >= 2);
for (const [s, ids] of sbDups) {
  ok(`sentenceBank.ja 완전 중복 금지: "${s}" — ${ids.join(', ')}`, false);
}
ok('sentenceBank.ja 완전 중복 0', true);

// vocab 예문 ↔ sentenceBank.ja 완전 중복 — 분류 (라운드 27 판정):
//   sentenceBank 는 설계상 vocab 예문을 sourceId/vocabIds 로 연결해 재사용한다.
//   (1) 연결 있음 → 의도된 재사용 (reviewed)
//   (2) 연결 없지만 문장이 그 표제어를 포함 → 정당한 우연 재사용 (reviewed)
//   (3) 연결도 없고 표제어도 없음 → 무관한 복사 의심 (unreviewed)
{
  const sbByJa = new Map(sentenceBank.map(s => [s.ja, s]));
  let linkedReuse = 0, containsReuse = 0;
  const suspicious = [];
  for (const v of vocab) {
    const s = v.exampleSentence && sbByJa.get(v.exampleSentence);
    if (!s) continue;
    if (s.sourceId === v.id || (s.vocabIds || []).includes(v.id)) linkedReuse++;
    else if (s.ja.includes(v.word) ||
             (v.word.length >= 2 && s.ja.includes(v.word.slice(0, -1)))) containsReuse++; // 동사 활용형(言う→言って) 허용
    else suspicious.push(`${v.id}(${v.word}) = ${s.id}`);
  }
  if (linkedReuse + containsReuse > 0) {
    warnReviewed(`vocab 예문 ↔ sentenceBank 재사용 (소스 연결 ${linkedReuse} + 표제어 포함 ${containsReuse} — 설계상 의도)`);
  }
  if (suspicious.length) {
    warn(`vocab 예문 ↔ sentenceBank 무관 복사 의심: ${suspicious.length}건`);
    for (const c of suspicious.slice(0, 5)) warn(`  ${c}`);
  }
}

// N4 콘텐츠에 N3/N2 급 문법 패턴 혼입 후보 → 경고
{
  const HARD_PATTERNS = /(に違いない|ばかりか|ものだから|ものだ。|べきだ|ざるを得|としたら|に関して|に対して|どころか|つつある|を通じて|につき)/;
  const hits = [];
  for (const v of vocab.filter(x => x.level === 'N4')) {
    if (HARD_PATTERNS.test(v.exampleSentence)) hits.push(`vocab ${v.id}: ${v.exampleSentence}`);
  }
  for (const s of sentenceBank.filter(x => x.level === 'N4')) {
    if (HARD_PATTERNS.test(s.ja)) hits.push(`sent ${s.id}: ${s.ja}`);
  }
  if (hits.length) {
    warn(`N4 콘텐츠에 N3/N2 급 문법 패턴 후보: ${hits.length}건`);
    for (const h of hits.slice(0, 5)) warn(`  ${h}`);
  }
}

// 출력 — blocking 은 ok() 실패로 이미 처리. 여기서는 경고 2단 분류 출력.
console.log(`  unreviewed 경고: ${warnings.length}건 (목표 0)`);
if (warnings.length) {
  console.log('  UNREVIEWED WARNINGS (상위 20):');
  for (const w of warnings.slice(0, 20)) console.log(`    - ${w}`);
}
console.log(`  reviewed 경고 (검토 후 유지): ${reviewedWarnings.length}건`);
for (const w of reviewedWarnings) console.log(`    - ${w}`);

// ── imageKey 중복 리포트 상세 (단어 예시 포함) ───────────────────
// ── 한자 데이터 검증 ──────────────────────────────────────────────
const { kanji } = await import('./js/data/kanji.js');
const { kanaChart } = await import('./js/data/kana.js');

ok('kanji is array', Array.isArray(kanji));
const _n5KanjiCount = kanji.filter(k => k.level === 'N5').length;
ok('N5 kanji >= 100 (N5마무리)', _n5KanjiCount >= 100, `actual=${_n5KanjiCount}`);

const _kanjiSeen = new Set();
const KANJI_LEVELS = new Set(['N5','N4','N3','N2']);
const KANJI_REQ_FIELDS = ['kanji','hiragana','meaningKo','onyomi','kunyomi','strokeCount','radical','tags','exampleWords','mnemonicText','imageKey'];
for (const k of kanji) {
  ok(`kanji ${k.id} id unique`, !_kanjiSeen.has(k.id));
  _kanjiSeen.add(k.id);
  ok(`kanji ${k.id} level valid`, KANJI_LEVELS.has(k.level));
  for (const f of KANJI_REQ_FIELDS) {
    ok(`kanji ${k.id} field ${f}`, k[f] !== undefined && k[f] !== null);
  }
  ok(`kanji ${k.id} hiragana non-empty`,
     typeof k.hiragana === 'string' && k.hiragana.length > 0);
  ok(`kanji ${k.id} onyomi array`,  Array.isArray(k.onyomi));
  ok(`kanji ${k.id} kunyomi array`, Array.isArray(k.kunyomi));
  ok(`kanji ${k.id} strokeCount >= 1`,
     Number.isFinite(k.strokeCount) && k.strokeCount >= 1);
  ok(`kanji ${k.id} tags array`,    Array.isArray(k.tags));
  ok(`kanji ${k.id} exampleWords >= 1`,
     Array.isArray(k.exampleWords) && k.exampleWords.length >= 1);
  for (const w of k.exampleWords) {
    ok(`kanji ${k.id} exampleWord.word`,     typeof w.word === 'string' && w.word.length > 0);
    ok(`kanji ${k.id} exampleWord.reading`,  typeof w.reading === 'string' && w.reading.length > 0);
    ok(`kanji ${k.id} exampleWord.meaningKo`,typeof w.meaningKo === 'string' && w.meaningKo.length > 0);
  }
  ok(`kanji ${k.id} imageKey in palette or default`,
     _palette.has(k.imageKey) || k.imageKey === 'default');
}

// 가나 표 검증
ok('kanaChart hiraganaBase >= 10 rows',
   Array.isArray(kanaChart.hiraganaBase) && kanaChart.hiraganaBase.length >= 10);
ok('kanaChart katakanaBase >= 10 rows',
   Array.isArray(kanaChart.katakanaBase) && kanaChart.katakanaBase.length >= 10);
ok('kanaChart hiragana 첫 칸 あ', kanaChart.hiraganaBase[0]?.[0]?.ch === 'あ');
ok('kanaChart katakana 첫 칸 ア', kanaChart.katakanaBase[0]?.[0]?.ch === 'ア');
ok('kanaChart dakuten 존재 (탁음/반탁음)',
   Array.isArray(kanaChart.hiraganaDakuten) && Array.isArray(kanaChart.katakanaDakuten));
ok('kanaChart youon 존재 (요음)',
   Array.isArray(kanaChart.hiraganaYouon) && Array.isArray(kanaChart.katakanaYouon));

// progressFor 가 kanji.have 를 실제 카운트로 반환하는지
const _pN5K = progressFor('N5');
ok('progressFor N5 kanji.have == 실제 N5 kanji 카운트',
   _pN5K.kanji.have === _n5KanjiCount);

// ── 후리가나 유틸 + 커버율 ────────────────────────────────────────
const { renderFuriganaText, hasFurigana, containsKanji, _resetFuriganaCache } = await import('./js/furigana.js');
_resetFuriganaCache();

// 단위: ruby/rt 생성
const _ruby1 = renderFuriganaText('日本語を勉強します。', []);
ok('furigana: ruby 태그 생성', /<ruby>.*<rt>.*<\/rt><\/ruby>/.test(_ruby1));
ok('furigana: 日本語 매칭', _ruby1.includes('にほんご'));
ok('furigana: 勉強 매칭', _ruby1.includes('べんきょう'));

// 한자 없으면 plain text (escape 만)
const _plain = renderFuriganaText('ひらがなだけです。', []);
ok('furigana: 가나만 ruby 없음', !/<ruby>/.test(_plain));

// HTML escape
const _xss = renderFuriganaText('<script>alert(1)</script>', []);
ok('furigana: HTML escape', !_xss.includes('<script>'));
ok('furigana: escape 결과 &lt; 포함', _xss.includes('&lt;'));

// 긴 매칭 우선 — 日本語 가 日本 보다 먼저
const _long = renderFuriganaText('日本語', []);
ok('furigana: 긴 단어 우선 (日本語 통째)',
   _long.includes('にほんご') && !_long.includes('にほん<'));

// 명시 readings 우선
const _custom = renderFuriganaText('日本', [{ text: '日本', reading: 'カスタム' }]);
ok('furigana: 명시 readings 우선', _custom.includes('カスタム'));

// 빈 입력
ok('furigana: 빈 문자열 → 빈 결과', renderFuriganaText('', []) === '');
ok('furigana: null → 빈 결과',     renderFuriganaText(null, []) === '');

// 커버율 측정
function coverageFor(level, items, jaPick, readingsPick) {
  let withKanji = 0;
  let covered = 0;
  for (const it of items) {
    if (level && it.level !== level) continue;
    const ja = jaPick(it);
    if (!ja) continue;
    if (!containsKanji(ja)) continue;
    withKanji++;
    const readings = readingsPick ? (readingsPick(it) || []) : [];
    if (hasFurigana(ja, readings)) covered++;
  }
  return { withKanji, covered };
}
const covVocab = coverageFor('N5', vocab,
  v => v.exampleSentence, v => v.exampleReadings);
const covGrammar = coverageFor('N5', grammar,
  g => g.examples?.[0]?.ja, g => g.examples?.[0]?.readings);
const covReading = coverageFor('N5', reading,
  r => r.passage, r => r.passageReadings);
const covListen = coverageFor('N5', listening,
  l => l.script, l => l.scriptReadings);
const covSent = coverageFor('N5', sentenceBank,
  s => s.ja, s => s.readings);

console.log('\n=== N5 후리가나 커버율 ===');
console.log(`  vocab    example: ${covVocab.covered}/${covVocab.withKanji}`);
console.log(`  grammar  example: ${covGrammar.covered}/${covGrammar.withKanji}`);
console.log(`  reading  passage: ${covReading.covered}/${covReading.withKanji}`);
console.log(`  listen   script:  ${covListen.covered}/${covListen.withKanji}`);
console.log(`  sentence ja:      ${covSent.covered}/${covSent.withKanji}`);

// 최소 커버율 (자동 사전 활용 시) — 명백한 실패만 잡는 sentinel.
function pct(o) { return o.withKanji === 0 ? 100 : Math.round(o.covered / o.withKanji * 100); }
ok(`N5 vocab example furigana 커버율 >= 80%`, pct(covVocab) >= 80, `pct=${pct(covVocab)}%`);
ok(`N5 sentenceBank furigana 커버율 >= 70%`, pct(covSent) >= 70, `pct=${pct(covSent)}%`);

// 라운드 5 보강 후 — 모든 카테고리 100% 목표.
ok(`N5 vocab example furigana 커버율 == 100%`,    pct(covVocab)   === 100, `pct=${pct(covVocab)}%`);
ok(`N5 grammar example furigana 커버율 == 100%`,  pct(covGrammar) === 100, `pct=${pct(covGrammar)}%`);
ok(`N5 reading passage furigana 커버율 == 100%`,  pct(covReading) === 100, `pct=${pct(covReading)}%`);
ok(`N5 listening script furigana 커버율 == 100%`, pct(covListen)  === 100, `pct=${pct(covListen)}%`);
ok(`N5 sentenceBank ja furigana 커버율 == 100%`,  pct(covSent)    === 100, `pct=${pct(covSent)}%`);

// ── readings 정합 검증 (라운드 25 안정화 — blocking) ──────────────────
//   명시 readings 의 text 는 반드시 대상 문장 안에 실제로 존재해야 한다.
//   (질문용 단어를 scriptReadings 에 넣는 식의 혼입 방지.)
{
  let stale = 0;
  const staleSamples = [];
  const checkReadings = (items, jaPick, readingsPick, label) => {
    for (const it of items) {
      const ja = jaPick(it);
      if (!ja) continue;
      for (const r of (readingsPick(it) || [])) {
        if (!ja.includes(r.text)) {
          stale++;
          if (staleSamples.length < 5) staleSamples.push(`${label} ${it.id}: '${r.text}'`);
        }
      }
    }
  };
  checkReadings(vocab,        v => v.exampleSentence, v => v.exampleReadings,  'vocab');
  checkReadings(reading,      r => r.passage,         r => r.passageReadings,  'reading');
  checkReadings(reading,      r => r.question,        r => r.questionReadings, 'reading.q');
  checkReadings(listening,    l => l.script,          l => l.scriptReadings,   'listening');
  checkReadings(sentenceBank, s => s.ja,              s => s.readings,         'sentence');
  ok('명시 readings text 가 모두 대상 문장에 존재', stale === 0,
     `stale=${stale} ${staleSamples.join(' / ')}`);
}

// ── N4 후리가나 커버율 (라운드 14) ─────────────────────────────────────
const cN4V = coverageFor('N4', vocab,    v => v.exampleSentence, v => v.exampleReadings);
const cN4G = coverageFor('N4', grammar,  g => g.examples?.[0]?.ja, g => g.examples?.[0]?.readings);
const cN4R = coverageFor('N4', reading,  r => r.passage,  r => r.passageReadings);
const cN4L = coverageFor('N4', listening,l => l.script,   l => l.scriptReadings);
const cN4S = coverageFor('N4', sentenceBank, s => s.ja,   s => s.readings);
console.log(`\n=== N4 후리가나 커버율 ===`);
console.log(`  vocab    example: ${cN4V.covered}/${cN4V.withKanji}  (${pct(cN4V)}%)`);
console.log(`  grammar  example: ${cN4G.covered}/${cN4G.withKanji}  (${pct(cN4G)}%)`);
console.log(`  reading  passage: ${cN4R.covered}/${cN4R.withKanji}  (${pct(cN4R)}%)`);
console.log(`  listen   script:  ${cN4L.covered}/${cN4L.withKanji}  (${pct(cN4L)}%)`);
console.log(`  sentence ja:      ${cN4S.covered}/${cN4S.withKanji}  (${pct(cN4S)}%)`);
ok('N4 vocab example furigana == 100% (1차 B)',    pct(cN4V) === 100, `pct=${pct(cN4V)}%`);
ok('N4 grammar example furigana == 100% (1차 B)',  pct(cN4G) === 100, `pct=${pct(cN4G)}%`);
ok('N4 reading passage furigana == 100% (1차 B)',  pct(cN4R) === 100, `pct=${pct(cN4R)}%`);
ok('N4 listening script furigana == 100% (1차 B)', pct(cN4L) === 100, `pct=${pct(cN4L)}%`);
ok('N4 sentenceBank furigana == 100% (1차 B)',     pct(cN4S) === 100, `pct=${pct(cN4S)}%`);

// N4 1차 시드 — 수량 sentinel
ok('N4 vocab ≥ 900 (완성 D)',         vocab.filter(v=>v.level==='N4').length >= 900,
   `count=${vocab.filter(v=>v.level==='N4').length}`);
ok('N4 grammar ≥ 85 (완성 D)',        grammar.filter(g=>g.level==='N4').length >= 85,
   `count=${grammar.filter(g=>g.level==='N4').length}`);
ok('N4 reading ≥ 60 (완성 D)',        reading.filter(r=>r.level==='N4').length >= 60,
   `count=${reading.filter(r=>r.level==='N4').length}`);
ok('N4 listening ≥ 60 (완성 D)',      listening.filter(l=>l.level==='N4').length >= 60,
   `count=${listening.filter(l=>l.level==='N4').length}`);
ok('N4 sentenceBank ≥ 300 (완성 D)',  sentenceBank.filter(s=>s.level==='N4').length >= 300,
   `count=${sentenceBank.filter(s=>s.level==='N4').length}`);
ok('N4 grammarPairs ≥ 8',    grammarPairs.filter(p=>p.level==='N4').length >= 8,
   `count=${grammarPairs.filter(p=>p.level==='N4').length}`);

// 긴 단어 우선 매칭 추가 검증 — 라운드 5 보강된 항목까지 함께
const _lm1 = renderFuriganaText('日本語', []);
ok('긴 단어 우선: 日本語 통째 매칭', _lm1.includes('にほんご'));
const _lm2 = renderFuriganaText('好きです', []);
ok('긴 단어 우선: 好きです (好き 와 분리 안 됨)',
   _lm2.includes('すきです') || (_lm2.match(/<rt>/g)?.length === 1));
const _lm3 = renderFuriganaText('閉めました', []);
ok('긴 단어 우선: 閉めました 통째',
   _lm3.includes('しめました') || (_lm3.match(/<rt>/g)?.length === 1));
// 명시 readings 가 자동 사전을 덮어쓰는지 (긴 매칭 우선과 별개)
const _ov = renderFuriganaText('日本', [{ text: '日本', reading: 'にっぽん' }]);
ok('명시 readings 가 자동 사전 우선', _ov.includes('にっぽん'));

// ── 후리가나 토글 (storage/state) ─────────────────────────────────────────
const _state = await import('./js/state.js');
const _store = await import('./js/storage.js');
// 기본값: 미설정 상태에서 ON
_store.resetAll();
ok('기본값: getFuriganaEnabled() === true', _state.getFuriganaEnabled() === true);
// renderJa import — 토글 OFF 시 plain text
const { renderJa } = await import('./js/furigana.js');
const sampleJa = '日本語を勉強します。';
const _onHtml = renderJa(sampleJa);
ok('토글 ON: renderJa 결과에 ruby 포함',
   _onHtml.includes('<ruby>') && _onHtml.includes('<rt>'));
_state.setFuriganaEnabled(false);
ok('setFuriganaEnabled(false) 반영', _state.getFuriganaEnabled() === false);
const _offHtml = renderJa(sampleJa);
ok('토글 OFF: ruby/rt 미포함', !_offHtml.includes('<ruby>') && !_offHtml.includes('<rt>'));
// 원문 가나/한자 보존
ok('토글 OFF: 원문 문자 보존', _offHtml.includes('日本語') && _offHtml.includes('勉強'));
// XSS 안전 — OFF 일 때도 escape
ok('토글 OFF: HTML escape 유지', renderJa('<b>x</b>').includes('&lt;'));
// 다시 ON
_state.setFuriganaEnabled(true);
ok('setFuriganaEnabled(true) 복귀', _state.getFuriganaEnabled() === true);
ok('토글 다시 ON: ruby 재포함', renderJa(sampleJa).includes('<ruby>'));
// 영속화 — 직접 storage 조회
_state.setFuriganaEnabled(false);
const _s = _store.getState();
ok('settings.furiganaEnabled 영속화', _s.settings && _s.settings.furiganaEnabled === false);
// 정리: 다시 ON
_state.setFuriganaEnabled(true);

// ── 이미지 카드 단계형 학습 — 정적/단위 검증 ──────────────────────────────
const vcvSrc = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/views/vocabCardView.js', import.meta.url), 'utf8'));

// 1) 단계 상태 식별자가 코드에 모두 존재
for (const st of ['expose1', 'expose2', 'recall', 'confirm', 'quiz', 'answered']) {
  ok(`vocabCardView 단계 식별자 존재: ${st}`, vcvSrc.includes(`'${st}'`),
     `not found: '${st}'`);
}
// 2) RECALL_SECONDS 상수로 분리
ok('vocabCardView: RECALL_SECONDS 상수 export',
   /export const RECALL_SECONDS\s*=\s*\d+/.test(vcvSrc));
const { RECALL_SECONDS } = await import('./js/views/vocabCardView.js');
ok('vocabCardView: RECALL_SECONDS === 3', RECALL_SECONDS === 3);

// 3) onAnswered 호출은 onPick 경로(즉 quiz 답변 시점) 1군데에서만 시작.
//    expose/recall/confirm 페인터가 onAnswered/recordResult/markStudiedToday 를 호출하지 않는지 정적 확인.
const exposeMatch = vcvSrc.match(/function\s+paintExpose\s*\([\s\S]*?\n\s*\}\n/);
const recallMatch = vcvSrc.match(/function\s+paintRecall\s*\([\s\S]*?\n\s*\}\n/);
const confirmMatch = vcvSrc.match(/function\s+paintConfirm\s*\([\s\S]*?\n\s*\}\n/);
ok('paintExpose 정의 캡처', !!exposeMatch);
ok('paintRecall 정의 캡처', !!recallMatch);
ok('paintConfirm 정의 캡처', !!confirmMatch);
for (const [name, m] of [['paintExpose', exposeMatch], ['paintRecall', recallMatch], ['paintConfirm', confirmMatch]]) {
  const body = m ? m[0] : '';
  ok(`${name}: onAnswered 미호출`,     !/onAnswered\s*\?\.\(/.test(body) && !/cb\?\.\s*onAnswered/.test(body));
  ok(`${name}: recordResult 미호출`,   !/recordResult\s*\(/.test(body));
  ok(`${name}: markStudiedToday 미호출`,!/markStudiedToday\s*\(/.test(body));
  ok(`${name}: recordSessionItem 미호출`, !/recordSessionItem\s*\(/.test(body));
}
// onPick 안에서는 위 호출들이 존재해야 함 — 함수 시작 인덱스 이후의 텍스트로 검사 (정확한 본문 분리 대신
// "선언 이후 어디엔가 호출 코드가 있는지" 만 확인. 위 paint*** 정적 검사로 expose/recall/confirm 에는
// 없음이 보장됨.)
const onPickIdx = vcvSrc.indexOf('function onPick');
ok('onPick 정의 위치', onPickIdx >= 0);
const afterOnPick = onPickIdx >= 0 ? vcvSrc.slice(onPickIdx) : '';
ok('onPick: onAnswered 호출 존재',     /onAnswered\?\.\(/.test(afterOnPick));
ok('onPick: recordResult 호출 존재',   /recordResult\(/.test(afterOnPick));
ok('onPick: markStudiedToday 호출 존재', /markStudiedToday\(/.test(afterOnPick));
ok('onPick: recordSessionItem 호출 존재', /recordSessionItem\(/.test(afterOnPick));

// 4) 타이머 정리 — clearInterval 호출 존재
ok('vocabCardView: clearInterval 호출 존재', /clearInterval\(/.test(vcvSrc));
ok('vocabCardView: setInterval 호출 존재',   /setInterval\(/.test(vcvSrc));
ok('vocabCardView: wrap.isConnected 가드',   /isConnected/.test(vcvSrc));

// 5) settings 기본값 — 학습 설정 3개 (furi/warmup/recall)
_store.resetAll();
const _defSettings = _store.getState().settings;
ok('defaultState.settings.furiganaEnabled === true',
   _defSettings.furiganaEnabled === true);
ok('defaultState.settings.vocabImageWarmupEnabled === true',
   _defSettings.vocabImageWarmupEnabled === true);
ok('defaultState.settings.vocabRecallSeconds === 3',
   _defSettings.vocabRecallSeconds === 3);

// warmup
ok('settings.vocabImageWarmupEnabled 기본 true',
   _state.getVocabWarmupEnabled() === true);
_state.setVocabWarmupEnabled(false);
ok('setVocabWarmupEnabled(false) 반영',
   _state.getVocabWarmupEnabled() === false);
_state.setVocabWarmupEnabled(true);
ok('setVocabWarmupEnabled(true) 복귀',
   _state.getVocabWarmupEnabled() === true);
ok('settings 영속화 — getState().settings.vocabImageWarmupEnabled true',
   _store.getState().settings.vocabImageWarmupEnabled === true);

// recall seconds — get/set + 허용값 + fallback
ok('getVocabRecallSeconds() 기본 3', _state.getVocabRecallSeconds() === 3);
_state.setVocabRecallSeconds(5);
ok('setVocabRecallSeconds(5) 반영',  _state.getVocabRecallSeconds() === 5);
_state.setVocabRecallSeconds(7);
ok('setVocabRecallSeconds(7) 반영',  _state.getVocabRecallSeconds() === 7);
_state.setVocabRecallSeconds(3);
ok('setVocabRecallSeconds(3) 복귀',  _state.getVocabRecallSeconds() === 3);
// fallback
for (const bad of [0, 1, 2, 4, 6, 8, 100, -1, '5', null, undefined, NaN, {}]) {
  _state.setVocabRecallSeconds(bad);
  ok(`invalid 입력 ${JSON.stringify(bad)} → fallback 3`,
     _state.getVocabRecallSeconds() === 3);
}
// storage 직접 검사
_state.setVocabRecallSeconds(5);
ok('storage 영속 — settings.vocabRecallSeconds === 5',
   _store.getState().settings.vocabRecallSeconds === 5);
_state.setVocabRecallSeconds(3); // 정리

// 6) vocabCardView 가 getVocabRecallSeconds 를 import 해서 사용하는지 정적 검사
ok('vocabCardView: getVocabRecallSeconds import',
   /import\s*\{[^}]*getVocabRecallSeconds[^}]*\}\s*from\s*['"]\.\.\/state\.js['"]/.test(vcvSrc));
ok('vocabCardView: getVocabRecallSeconds 호출',
   /getVocabRecallSeconds\(\)/.test(vcvSrc));
// resolvedRecallMs 헬퍼로 분리되어 있는지
ok('vocabCardView: resolvedRecallMs 함수 분리',
   /function\s+resolvedRecallMs\s*\(/.test(vcvSrc));

// buildQuestion 이 context.readings 를 전달하는지 (위에서 이미 import 함)
const _qV = buildQuestion('vocab', vocab[0].id);
ok('buildQuestion vocab: context.readings 배열', Array.isArray(_qV.context.readings));
const _gWithEx = grammar.find(g => g.examples && g.examples[0]);
if (_gWithEx) {
  const _qG = buildQuestion('grammar', _gWithEx.id);
  ok('buildQuestion grammar: context.readings 배열',
     !_qG.context || Array.isArray(_qG.context.readings));
}
const _qR = buildQuestion('reading', reading.filter(r => r.level === 'N5')[0].id);
ok('buildQuestion reading: context.readings 배열', Array.isArray(_qR.context.readings));
const _qL = buildQuestion('listening', listening.filter(l => l.level === 'N5')[0].id);
ok('buildQuestion listening: scriptReadings 배열', Array.isArray(_qL.extra.scriptReadings));

console.log('\n=== imageKey 중복 상세 ===');
const _byKey = {};
for (const v of vocab.filter(x => x.level === 'N5')) {
  (_byKey[v.imageKey] = _byKey[v.imageKey] || []).push(v.word);
}
const _byKeyDups = Object.entries(_byKey)
  .filter(([, arr]) => arr.length >= 2)
  .sort((a, b) => b[1].length - a[1].length);
console.log(`  중복 imageKey: ${_byKeyDups.length}건`);
for (const [k, words] of _byKeyDups.slice(0, 10)) {
  const sample = words.slice(0, 5).join(', ') + (words.length > 5 ? ` … (+${words.length - 5})` : '');
  console.log(`    ${k.padEnd(14)} ×${words.length}: ${sample}`);
}
console.log('  다음 확장 시 피해야 할 상위 키 (avoid):',
  _byKeyDups.slice(0, 5).map(([k, w]) => `${k}(${w.length})`).join(', '));

// ── stories 데이터 스키마 ─────────────────────────────────────────────────
const { stories, getStoriesForListing, getNovelsForListing } = await import('./js/data/stories.js');
ok('stories: 배열', Array.isArray(stories));
const storyIds = new Set();
const TYPES_ALLOWED = new Set(['daily_story', 'news_style', 'short_story']);
for (const s of stories) {
  ok(`stories[${s.id}]: id 형식`, /^story_[a-z0-9]+_\d+$/.test(s.id || ''));
  ok(`stories[${s.id}]: id 유일`, !storyIds.has(s.id));
  storyIds.add(s.id);
  ok(`stories[${s.id}]: type 허용값`, TYPES_ALLOWED.has(s.type),
     `type=${s.type}`);
  ok(`stories[${s.id}]: level`,         ['N5','N4','N3','N2'].includes(s.level));
  ok(`stories[${s.id}]: titleJa 비어있지 않음`,  typeof s.titleJa === 'string' && s.titleJa.length > 0);
  ok(`stories[${s.id}]: titleKo 비어있지 않음`,  typeof s.titleKo === 'string' && s.titleKo.length > 0);
  ok(`stories[${s.id}]: summaryKo 비어있지 않음`, typeof s.summaryKo === 'string' && s.summaryKo.length > 0);
  ok(`stories[${s.id}]: bodyJa 배열 (≥1 문단)`,  Array.isArray(s.bodyJa) && s.bodyJa.length >= 1);
  ok(`stories[${s.id}]: bodyKo 배열`,            Array.isArray(s.bodyKo));
  ok(`stories[${s.id}]: bodyJa/bodyKo 문단 수 일치`,
     s.bodyJa.length === s.bodyKo.length,
     `ja=${s.bodyJa.length} ko=${s.bodyKo.length}`);
  ok(`stories[${s.id}]: bodyReadings 배열 (있을 때 ja 길이와 일치)`,
     !s.bodyReadings || (Array.isArray(s.bodyReadings) && s.bodyReadings.length === s.bodyJa.length));
  ok(`stories[${s.id}]: vocabularyIds 배열`,     Array.isArray(s.vocabularyIds || []));
  ok(`stories[${s.id}]: grammarIds 배열`,        Array.isArray(s.grammarIds || []));
  ok(`stories[${s.id}]: tags 배열`,              Array.isArray(s.tags || []));
  ok(`stories[${s.id}]: estimatedMinutes 양수`,  typeof s.estimatedMinutes === 'number' && s.estimatedMinutes > 0);
  ok(`stories[${s.id}]: sourceType === 'original'`, s.sourceType === 'original');
  // 참조 무결성
  const vocabIdSet = new Set(vocab.map(v => v.id));
  for (const id of (s.vocabularyIds || [])) {
    ok(`stories[${s.id}]: vocab ref ${id} 존재`, vocabIdSet.has(id));
  }
  const gIdSet = new Set(grammar.map(g => g.id));
  for (const id of (s.grammarIds || [])) {
    ok(`stories[${s.id}]: grammar ref ${id} 존재`, gIdSet.has(id));
  }
}

// 시드 최소량 — 라운드 13 확장 후
ok('stories — N5 이야기(daily/news) ≥ 5',
   getStoriesForListing().filter(s => s.level === 'N5').length >= 5,
   `count=${getStoriesForListing().filter(s => s.level === 'N5').length}`);
ok('stories — N5 단편 소설 ≥ 3',
   getNovelsForListing().filter(s => s.level === 'N5').length >= 3,
   `count=${getNovelsForListing().filter(s => s.level === 'N5').length}`);

// 라운드 14 — N4 stories / novels
ok('stories — N4 이야기 ≥ 6 (1차 B)',
   getStoriesForListing().filter(s => s.level === 'N4').length >= 6,
   `count=${getStoriesForListing().filter(s => s.level === 'N4').length}`);
ok('stories — N4 단편 소설 ≥ 4 (1차 B)',
   getNovelsForListing().filter(s => s.level === 'N4').length >= 4,
   `count=${getNovelsForListing().filter(s => s.level === 'N4').length}`);
// N4 kanji + conversation topics
const { kanji: _kanji } = await import('./js/data/kanji.js');
ok('N4 kanji ≥ 200 (완성 C)',
   _kanji.filter(k => k.level === 'N4').length >= 200,
   `count=${_kanji.filter(k => k.level === 'N4').length}`);
const { conversationTopics: _convs } = await import('./js/data/conversationTopics.js');
ok('N4 conversationTopics ≥ 10 (완성 D)',
   _convs.filter(t => t.level === 'N4').length >= 10,
   `count=${_convs.filter(t => t.level === 'N4').length}`);

// 라운드 22 (N4 1차 A 점검) — N4 토픽별 sentenceBank 매칭 ≥ 3 (situationTags 교집합 기준)
for (const t of _convs.filter(x => x.level === 'N4')) {
  const tags = new Set(t.situationTags || []);
  const matched = sentenceBank.filter(x =>
    x.level === 'N4' && x.canUseInConversation &&
    (x.situationTags || []).some(tag => tags.has(tag)));
  ok(`N4 topic ${t.id}: 회화 가능 문장 매칭 ≥ 3`, matched.length >= 3,
     `matched=${matched.length}`);
}
// N4 sentenceBank canUseInConversation ≥ 25
ok('N4 sentenceBank canUseInConversation ≥ 25',
   sentenceBank.filter(s => s.level === 'N4' && s.canUseInConversation).length >= 25);

// ── 라운드 23: content-report ↔ smoke 수량 일치 + levelTargets 무결성 ─────
const report = await import('./scripts/content-report.mjs');
const _core = report.computeCoreStatus();
const _n5row = _core.find(r => r.level === 'N5');
const _n4row = _core.find(r => r.level === 'N4');
ok('content-report: N5 vocab 누적 == smoke 집계',
   _n5row.vocab.cur === vocab.filter(v => v.level === 'N5').length);
ok('content-report: N4 vocab 누적 == N5+N4 합산',
   _n4row.vocab.cur === vocab.filter(v => ['N5','N4'].includes(v.level)).length);
ok('content-report: N4 grammar == smoke 집계',
   _n4row.grammar.cur === grammar.filter(g => g.level === 'N4').length);
ok('content-report: N4 reading/listening == smoke 집계',
   _n4row.reading.cur === reading.filter(r => r.level === 'N4').length &&
   _n4row.listening.cur === listening.filter(l => l.level === 'N4').length);
const _aux = report.computeAuxStatus();
const _n4aux = _aux.find(r => r.level === 'N4');
ok('content-report: N4 보조 콘텐츠 == smoke 집계',
   _n4aux.sentenceBank === sentenceBank.filter(s => s.level === 'N4').length &&
   _n4aux.stories + _n4aux.shortStories === stories.filter(s => s.level === 'N4').length &&
   _n4aux.conversationTopics === _convs.filter(t => t.level === 'N4').length);
// levelTargets 기준 무결성 — 실수로 목표치가 깨지면 실패
const { levelTargets: _lt } = await import('./js/data/levelTargets.js');
ok('levelTargets: 4개 레벨 정의', _lt.length === 4 &&
   ['N5','N4','N3','N2'].every(L => _lt.some(t => t.level === L)));
ok('levelTargets: 누적 목표 단조 증가 (vocab/kanji)',
   _lt[0].targetVocab < _lt[1].targetVocab && _lt[1].targetVocab < _lt[2].targetVocab &&
   _lt[2].targetVocab < _lt[3].targetVocab &&
   _lt[0].targetKanji < _lt[1].targetKanji && _lt[2].targetKanji < _lt[3].targetKanji);
ok('levelTargets: 범위 목표 min ≤ max',
   _lt.every(t => t.targetGrammarMin <= t.targetGrammarMax &&
                  t.targetReadingMin <= t.targetReadingMax &&
                  t.targetListeningMin <= t.targetListeningMax));
// renderMarkdown 이 표를 생성하는지 (문서 갱신 가능성 보장)
const _md = report.renderMarkdown();
ok('content-report: Markdown 표 생성',
   _md.includes('| 레벨 | 영역 |') && _md.includes('| N5 | vocab(누적) |'));
// docs/content-status.md 존재 + 기준 설명 포함 (_fs 는 뒤에서 선언되므로 지역 import)
const _fs23 = await import('node:fs');
const statusDoc = _fs23.readFileSync(new URL('./docs/content-status.md', import.meta.url), 'utf8');
ok('content-status.md: 존재 + 누적/범위/내부 목표치 설명',
   /누적/.test(statusDoc) && /공식 확정 목록이 아니/.test(statusDoc) &&
   /min~max|범위 목표/.test(statusDoc));

// ── N5 stories body 후리가나 커버율 ──────────────────────────────────────
const _allN5Stories = stories.filter(s => s.level === 'N5');
let totalKanjiPara = 0, coveredPara = 0;
for (const s of _allN5Stories) {
  for (let i = 0; i < s.bodyJa.length; i++) {
    const ja = s.bodyJa[i];
    if (!containsKanji(ja)) continue;
    totalKanjiPara++;
    const rd = (s.bodyReadings || [])[i] || [];
    if (hasFurigana(ja, rd)) coveredPara++;
  }
}
const _pctStory = totalKanjiPara === 0 ? 100 : Math.round(coveredPara / totalKanjiPara * 100);
console.log(`\n=== N5 story body 후리가나 커버율 ===`);
console.log(`  paragraph: ${coveredPara}/${totalKanjiPara}  (${_pctStory}%)`);
ok('N5 story body 후리가나 커버율 >= 90%', _pctStory >= 90, `pct=${_pctStory}%`);

// N4 story body 후리가나 커버율
const _n4Stories = stories.filter(s => s.level === 'N4');
let tn4 = 0, cn4 = 0;
for (const s of _n4Stories) {
  for (let i = 0; i < s.bodyJa.length; i++) {
    const ja = s.bodyJa[i];
    if (!containsKanji(ja)) continue;
    tn4++;
    const rd = (s.bodyReadings || [])[i] || [];
    if (hasFurigana(ja, rd)) cn4++;
  }
}
const _pctN4Story = tn4 === 0 ? 100 : Math.round(cn4 / tn4 * 100);
console.log(`\n=== N4 story body 후리가나 커버율 ===`);
console.log(`  paragraph: ${cn4}/${tn4}  (${_pctN4Story}%)`);
ok('N4 story body 후리가나 커버율 >= 80%', _pctN4Story >= 80, `pct=${_pctN4Story}%`);

// 스토리 학습 플레이어용 확장 필드 — keyVocabularyIds / keyGrammarIds / bodyHighlights
for (const s of stories) {
  ok(`stories[${s.id}]: keyVocabularyIds ≥ 3`,
     Array.isArray(s.keyVocabularyIds) && s.keyVocabularyIds.length >= 3,
     `count=${(s.keyVocabularyIds || []).length}`);
  ok(`stories[${s.id}]: keyGrammarIds ≥ 1`,
     Array.isArray(s.keyGrammarIds) && s.keyGrammarIds.length >= 1);
  // 참조 무결성
  const vSet = new Set(vocab.map(v => v.id));
  for (const id of (s.keyVocabularyIds || [])) {
    ok(`stories[${s.id}]: keyVocab ref ${id} 존재`, vSet.has(id));
  }
  const gSet = new Set(grammar.map(g => g.id));
  for (const id of (s.keyGrammarIds || [])) {
    ok(`stories[${s.id}]: keyGrammar ref ${id} 존재`, gSet.has(id));
  }
  // bodyHighlights
  ok(`stories[${s.id}]: bodyHighlights 배열`,
     Array.isArray(s.bodyHighlights));
  ok(`stories[${s.id}]: bodyHighlights 길이 == bodyJa 길이`,
     s.bodyHighlights.length === s.bodyJa.length);
  let totalHl = 0;
  for (let i = 0; i < s.bodyHighlights.length; i++) {
    const arr = s.bodyHighlights[i] || [];
    for (const h of arr) {
      ok(`stories[${s.id}][${i}]: hl.text 존재`,    typeof h.text === 'string' && h.text.length > 0);
      ok(`stories[${s.id}][${i}]: hl.meaningKo 존재`, typeof h.meaningKo === 'string' && h.meaningKo.length > 0);
      ok(`stories[${s.id}][${i}]: hl.text 본문에 등장`,
         (s.bodyJa[i] || '').includes(h.text),
         `text="${h.text}" para="${s.bodyJa[i]}"`);
      if (h.vocabId) ok(`stories[${s.id}]: hl.vocabId ${h.vocabId} 존재`, vSet.has(h.vocabId));
      totalHl++;
    }
  }
  ok(`stories[${s.id}]: bodyHighlights 총 ≥ 3`,
     totalHl >= 3, `total=${totalHl}`);
}

// ── 스토리 학습 플레이어 — 정적 검사 ──────────────────────────────────────
const storyViewSrc = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/views/storyView.js', import.meta.url), 'utf8'));
ok('storyView: STORY_SENTENCE_PAUSE_MS === 700',
   /STORY_SENTENCE_PAUSE_MS\s*=\s*700/.test(storyViewSrc));
ok('storyView: playingMode 식별자 "single" 존재',
   /['"]single['"]/.test(storyViewSrc));
ok('storyView: playingMode 식별자 "sequence" 존재',
   /['"]sequence['"]/.test(storyViewSrc));
ok('storyView: playSingleLine 함수',
   /function\s+playSingleLine\s*\(|export\s+function\s+playSingleLine\s*\(/.test(storyViewSrc));
ok('storyView: playSequenceFrom 함수',
   /function\s+playSequenceFrom\s*\(|export\s+function\s+playSequenceFrom\s*\(/.test(storyViewSrc));
ok('storyView: playCurrentInSequence 함수 (내부 헬퍼)',
   /function\s+playCurrentInSequence\s*\(/.test(storyViewSrc));
ok('storyView: stopStoryAudio 함수',
   /export\s+function\s+stopStoryAudio\s*\(/.test(storyViewSrc));
ok('storyView: clearStoryPauseTimer 함수',
   /function\s+clearStoryPauseTimer\s*\(/.test(storyViewSrc));
ok('storyView: setActiveLine 함수',
   /function\s+setActiveLine\s*\(/.test(storyViewSrc));
ok('storyView: clearTimeout 호출 (pause cleanup)',
   /clearTimeout\(/.test(storyViewSrc));
ok('storyView: setTimeout(\\.{,5}STORY_SENTENCE_PAUSE_MS) — pause timer',
   /setTimeout\([^,]+,\s*STORY_SENTENCE_PAUSE_MS\s*\)/.test(storyViewSrc));
ok('storyView: stopStoryAudio 가 clearStoryPauseTimer 호출',
   /function\s+stopStoryAudio[\s\S]*?clearStoryPauseTimer\(\)/.test(storyViewSrc));

// CSS — active line + 인라인 하이라이트
const cssSrc = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./styles.css', import.meta.url), 'utf8'));
ok('styles.css: .story-line.active 선택자',  /\.story-line\.active\s*\{/.test(cssSrc));
ok('styles.css: .story-player fixed/sticky',
   /\.story-player\s*\{[^}]*position:\s*(fixed|sticky)/.test(cssSrc));
ok('styles.css: 360px 모바일 .story-player',
   /@media\s*\([^)]*360px[\s\S]*\.story-player/.test(cssSrc));
ok('styles.css: .has-story-player padding-bottom',
   /\.has-story-player\s*\{[^}]*padding-bottom/.test(cssSrc));
ok('styles.css: .story-inline-hl 선택자',
   /\.story-inline-hl\s*\{/.test(cssSrc));
ok('styles.css: .story-hl-panel 선택자',
   /\.story-hl-panel\s*\{/.test(cssSrc));
ok('styles.css: 360px 모바일 .story-inline-hl 대응',
   /@media\s*\([^)]*360px[\s\S]*\.story-inline-hl/.test(cssSrc));

// ── 라운드 11: storyProgress + 학습 연결 + inline highlight 정적 검사 ─────
ok('storage: defaultState.storyProgress 필드',
   /storyProgress:\s*\{\s*\}/.test(await import('node:fs').then(fs =>
     fs.readFileSync(new URL('./js/storage.js', import.meta.url), 'utf8'))));
const stateSrc = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/state.js', import.meta.url), 'utf8'));
ok('state.js: getStoryProgress export',  /export\s+function\s+getStoryProgress/.test(stateSrc));
ok('state.js: setStoryLastIndex export', /export\s+function\s+setStoryLastIndex/.test(stateSrc));
ok('state.js: markStoryCompleted export',/export\s+function\s+markStoryCompleted/.test(stateSrc));
ok('state.js: noteStoryOpened export',   /export\s+function\s+noteStoryOpened/.test(stateSrc));

// 동작 단위 — defaultState + get/set
_store.resetAll();
const _state2 = await import('./js/state.js');
ok('storyProgress 기본 — 미존재 entry get 시 lastIndex 0 / completed false',
   _state2.getStoryProgress('xxx').lastIndex === 0 && _state2.getStoryProgress('xxx').completed === false);
_state2.setStoryLastIndex('story_test', 4);
ok('setStoryLastIndex(4) — lastIndex 4 저장',
   _state2.getStoryProgress('story_test').lastIndex === 4);
_state2.markStoryCompleted('story_test', true);
ok('markStoryCompleted(true) — completed true',
   _state2.getStoryProgress('story_test').completed === true);
ok('markStoryCompleted(true) — readCount 증가',
   _state2.getStoryProgress('story_test').readCount >= 1);
_state2.markStoryCompleted('story_test', false);
ok('markStoryCompleted(false) — 취소',
   _state2.getStoryProgress('story_test').completed === false);
// invalid index → 0 으로 clamp
_state2.setStoryLastIndex('story_test', -3);
ok('setStoryLastIndex(-3) — clamp 0',
   _state2.getStoryProgress('story_test').lastIndex === 0);
_store.resetAll();

// storyView 정적 검사 — 인라인 헬퍼 + 학습 navigate
ok('storyView: renderStoryLineWithHighlights export',
   /export\s+function\s+renderStoryLineWithHighlights/.test(storyViewSrc));
ok('storyView: data-study-vocab 학습 버튼 마크업',
   /data-study-vocab/.test(storyViewSrc));
ok('storyView: data-study-grammar 학습 버튼 마크업',
   /data-study-grammar/.test(storyViewSrc));
ok('storyView: study/vocab navigate (card 또는 browse 라우트 사용)',
   /navigate\(['"]study\/vocab\/(card|browse)\//.test(storyViewSrc));
ok('storyView: study/grammar navigate (card 또는 browse 라우트 사용)',
   /navigate\(['"]study\/grammar\/(card|browse)\//.test(storyViewSrc));
ok('storyView: setStoryLastIndex 호출',
   /setStoryLastIndex\(/.test(storyViewSrc));
ok('storyView: markStoryCompleted 호출',
   /markStoryCompleted\(/.test(storyViewSrc));
ok('storyView: noteStoryOpened 호출',
   /noteStoryOpened\(/.test(storyViewSrc));

// study.js — focusId 처리
const studyJsSrc2 = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/views/study.js', import.meta.url), 'utf8'));
ok('study.js: focusParam 받음 (params[2])',
   /params\s*&&\s*params\[2\]|params\?\.\[2\]/.test(studyJsSrc2));
ok('study.js: setFocusFromId 함수',
   /function\s+setFocusFromId\s*\(/.test(studyJsSrc2));

// ── 라운드 12: card deep link + hideCompleted 영속 + summary ──────────────
ok('study.js: DEEP_LINK_METHODS 정의',
   /DEEP_LINK_METHODS/.test(studyJsSrc2));
ok('study.js: vocab card 딥링크 포함',
   /vocab:\s*new Set\(\[[^\]]*['"]card['"][^\]]*\]\)/.test(studyJsSrc2));
ok('study.js: grammar card 딥링크 포함',
   /grammar:\s*new Set\(\[[^\]]*['"]card['"][^\]]*\]\)/.test(studyJsSrc2));
ok('study.js: startSingleVocabCard 함수',
   /function\s+startSingleVocabCard\s*\(/.test(studyJsSrc2));
ok('study.js: startSingleGrammar 함수',
   /function\s+startSingleGrammar\s*\(/.test(studyJsSrc2));
ok('study.js: invalid id → browse fallback (startSingleVocabCard 안)',
   /function\s+startSingleVocabCard[\s\S]*?currentMethod\s*=\s*['"]browse['"][\s\S]*?return\s+drawBrowse/.test(studyJsSrc2));
ok('study.js: invalid id → browse fallback (startSingleGrammar 안)',
   /function\s+startSingleGrammar[\s\S]*?currentMethod\s*=\s*['"]browse['"][\s\S]*?return\s+drawBrowse/.test(studyJsSrc2));
ok('study.js: pendingFocusId 모듈 변수',
   /let\s+pendingFocusId\s*=/.test(studyJsSrc2));

// storyView — 학습 연결 라우트가 card 로 갱신됐는지
ok('storyView: navigate study/vocab/card 사용',
   /navigate\(['"]study\/vocab\/card\//.test(storyViewSrc));
ok('storyView: navigate study/grammar/card 사용',
   /navigate\(['"]study\/grammar\/card\//.test(storyViewSrc));

// ── 라운드 13: storyReturn 모듈 + 동선 정적 검사 ─────────────────────────
const studyReturnSrc = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/studyReturn.js', import.meta.url), 'utf8'));
ok('studyReturn: setStudyReturnRoute export',
   /export\s+function\s+setStudyReturnRoute/.test(studyReturnSrc));
ok('studyReturn: peekStudyReturnRoute export',
   /export\s+function\s+peekStudyReturnRoute/.test(studyReturnSrc));
ok('studyReturn: consumeStudyReturnRoute export',
   /export\s+function\s+consumeStudyReturnRoute/.test(studyReturnSrc));
ok('studyReturn: clearStudyReturnRoute export',
   /export\s+function\s+clearStudyReturnRoute/.test(studyReturnSrc));
// storyView 가 setStudyReturnRoute 호출
ok('storyView: setStudyReturnRoute 호출',
   /setStudyReturnRoute\(/.test(storyViewSrc));
// study.js — card 모드에서 maybePrependStoryReturnButton 호출 + 다른 모드에서 clearStudyReturnRoute
ok('study.js: peekStudyReturnRoute import/호출',
   /peekStudyReturnRoute\(/.test(studyJsSrc2));
ok('study.js: maybePrependStoryReturnButton 함수',
   /function\s+maybePrependStoryReturnButton\s*\(/.test(studyJsSrc2));
ok('study.js: drawLanding 안 clearStudyReturnRoute 호출',
   /function\s+drawLanding[\s\S]*?clearStudyReturnRoute\(\)/.test(studyJsSrc2));
ok('study.js: applyMethod 안 비-card 진입 시 clearStudyReturnRoute',
   /isCard[\s\S]*?clearStudyReturnRoute/.test(studyJsSrc2) ||
   /!isCard[\s\S]*?clearStudyReturnRoute/.test(studyJsSrc2));
// today.js / vocabCardView.js 는 storyReturn 모듈에 의존하지 않음 → 일반 학습/오늘의 10분 동선이 오염되지 않음.
const todayJsSrc = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/views/today.js', import.meta.url), 'utf8'));
ok('today.js: storyReturn 미사용',
   !/studyReturn|peekStudyReturnRoute|setStudyReturnRoute/.test(todayJsSrc));
const vcvSrc2 = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/views/vocabCardView.js', import.meta.url), 'utf8'));
ok('vocabCardView: storyReturn 미사용',
   !/studyReturn|peekStudyReturnRoute|setStudyReturnRoute/.test(vcvSrc2));

// storyView — 진행도 요약 마크업
ok('storyView: storyProgressSummary id 마크업',
   /storyProgressSummary/.test(storyViewSrc));
ok('storyView: story-progress-note 마크업',
   /story-progress-note/.test(storyViewSrc));

// settings.storyHideCompleted 기본값 + API
const storageSrcAfter = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/storage.js', import.meta.url), 'utf8'));
ok('storage: defaultState.settings.storyHideCompleted 기본 false',
   /storyHideCompleted:\s*false/.test(storageSrcAfter));
ok('state.js: getStoryHideCompleted export',
   /export\s+function\s+getStoryHideCompleted/.test(stateSrc));
ok('state.js: setStoryHideCompleted export',
   /export\s+function\s+setStoryHideCompleted/.test(stateSrc));

// 동작 단위 — hideCompleted 영속
_store.resetAll();
const _state3 = await import('./js/state.js');
ok('hideCompleted 기본 false', _state3.getStoryHideCompleted() === false);
_state3.setStoryHideCompleted(true);
ok('hideCompleted true 저장',  _state3.getStoryHideCompleted() === true);
ok('storage 직접 검사', _store.getState().settings.storyHideCompleted === true);
_state3.setStoryHideCompleted(false);

// CSS — 모바일 안전 보강
ok('styles.css: .has-story-player padding-bottom 존재 (라운드 18 compact: 120px)',
   /\.has-story-player\s*\{[^}]*padding-bottom:\s*120px/.test(cssSrc));
ok('styles.css: .story-player .btn nowrap',
   /\.story-player .btn[\s\S]{0,40}white-space:\s*nowrap/.test(cssSrc));
ok('styles.css: .story-hl-panel overflow 처리',
   /\.story-hl-panel[\s\S]*?(overflow-wrap|word-break)/.test(cssSrc));

// ── 정보구조 (index.html / router.js) 정적 검사 ─────────────────────────
const indexHtml = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8'));
ok('index.html: home 탭',     /data-route="home"/.test(indexHtml));
ok('index.html: study 탭',    /data-route="study"/.test(indexHtml));
ok('index.html: review 탭',   /data-route="review"/.test(indexHtml));
ok('index.html: stories 탭',  /data-route="stories"/.test(indexHtml));
ok('index.html: novels 탭',   /data-route="novels"/.test(indexHtml));
ok('index.html: today 독립 탭 제거',         !/data-route="today"/.test(indexHtml));
ok('index.html: compare 독립 탭 제거',       !/data-route="compare"/.test(indexHtml));
ok('index.html: conversation 독립 탭 제거', !/data-route="conversation"/.test(indexHtml));
ok('index.html: 톱니바퀴 #settingsBtn',     /id="settingsBtn"/.test(indexHtml));

const appJsSrc = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/app.js', import.meta.url), 'utf8'));
ok('app.js: stories 핸들러 등록',  /register\(['"]stories['"]/.test(appJsSrc));
ok('app.js: novels 핸들러 등록',   /register\(['"]novels['"]/.test(appJsSrc));
ok('app.js: settings 핸들러 등록', /register\(['"]settings['"]/.test(appJsSrc));
ok('app.js: story 상세 핸들러',    /register\(['"]story['"]/.test(appJsSrc));
ok('app.js: compare 보조 등록 유지', /register\(['"]compare['"]/.test(appJsSrc));

// study.js — 비교 흐름이 학습 > 문법 > compare 메서드로 진입되도록 method 칩 정의
const studyJsSrc = await import('node:fs').then(fs =>
  fs.readFileSync(new URL('./js/views/study.js', import.meta.url), 'utf8'));
ok('study.js: METHODS.grammar 에 compare 포함',
   /grammar:\s*\[[^\]]*['"]compare['"][^\]]*\]/.test(studyJsSrc));
ok('study.js: applyMethod 가 compare 시 navigate("compare")',
   /currentMethod\s*===\s*['"]compare['"][\s\S]*navigate\(['"]compare['"]/.test(studyJsSrc));

// ── 라운드 16: dataLoader + 데이터 용량 리포트 ───────────────────────────
const _fs = await import('node:fs');

// 1) 용량 리포트 — JS data vs JSON data
console.log('\n=== 데이터 용량 리포트 ===');
let jsTotal = 0;
const jsDataDir = new URL('./js/data/', import.meta.url);
for (const f of _fs.readdirSync(jsDataDir)) {
  if (!f.endsWith('.js')) continue;
  const size = _fs.statSync(new URL(f, jsDataDir)).size;
  jsTotal += size;
}
console.log(`  js/data/*.js (정적 import — 초기 파싱 대상): ${(jsTotal/1024).toFixed(0)} KB`);
let jsonTotal = 0, jsonFiles = 0;
const dataDir = new URL('./data/', import.meta.url);
if (_fs.existsSync(dataDir)) {
  for (const lvl of _fs.readdirSync(dataDir)) {
    const lvlDir = new URL(`${lvl}/`, dataDir);
    if (!_fs.statSync(lvlDir).isDirectory()) continue;
    for (const f of _fs.readdirSync(lvlDir)) {
      if (!f.endsWith('.json')) continue;
      const size = _fs.statSync(new URL(f, lvlDir)).size;
      jsonTotal += size; jsonFiles++;
      console.log(`  data/${lvl}/${f}: ${(size/1024).toFixed(1)} KB (lazy fetch 대상)`);
    }
  }
}
console.log(`  JSON 합계: ${(jsonTotal/1024).toFixed(0)} KB (${jsonFiles}개 파일)`);
console.log(`  레벨별 item count: vocab N5=${vocab.filter(v=>v.level==='N5').length}/N4=${vocab.filter(v=>v.level==='N4').length},` +
  ` grammar N5=${grammar.filter(g=>g.level==='N5').length}/N4=${grammar.filter(g=>g.level==='N4').length},` +
  ` stories N5=${stories.filter(s=>s.level==='N5').length}/N4=${stories.filter(s=>s.level==='N4').length}`);

// 2) dataLoader 단위 검증
const dl = await import('./js/dataLoader.js');
dl.clearDataCache();
// fallback 경로 (Node — fetch 없음)
const _dlStories = await dl.loadStories('N4');
ok('dataLoader: fallback 경로 N4 stories 로드',
   Array.isArray(_dlStories) && _dlStories.length >= 6,
   `count=${_dlStories.length}`);
const _dlVocab = await dl.loadVocab('N5');
ok('dataLoader: fallback 경로 N5 vocab 로드 (스키마 동일)',
   _dlVocab.length === vocab.filter(v=>v.level==='N5').length &&
   typeof _dlVocab[0].word === 'string');
// fetch 경로 — 가짜 fetch 주입으로 실제 JSON 파일 검증
dl.clearDataCache();
dl._setFetchForTest(async (path) => {
  const url = new URL(path, import.meta.url);
  if (!_fs.existsSync(url)) return { ok: false };
  return { ok: true, json: async () => JSON.parse(_fs.readFileSync(url, 'utf8')) };
});
const _dlJsonStories = await dl.loadStories('N4');
ok('dataLoader: fetch 경로 — data/n4/stories.json 로드',
   _dlJsonStories.length === stories.filter(s=>s.level==='N4').length);
ok('dataLoader: JSON 스키마 == JS 스키마 (id 일치)',
   _dlJsonStories.every((s,i) => s.id === stories.filter(x=>x.level==='N4')[i].id));
// JSON 부재 영역 → 자동 JS fallback
const _dlKanji = await dl.loadKanji('N4');
ok('dataLoader: JSON 부재 시 JS fallback (N4 kanji)',
   _dlKanji.length >= 100);
// 캐시 — 같은 Promise 반환
ok('dataLoader: 메모리 캐시 (동일 참조)',
   (await dl.loadStories('N4')) === _dlJsonStories);
// invalid 검증
let _threw = false;
try { dl.loadLevelData('N9', 'vocab'); } catch { _threw = true; }
ok('dataLoader: invalid level throw', _threw);
_threw = false;
try { dl.loadLevelData('N5', 'unknown'); } catch { _threw = true; }
ok('dataLoader: invalid type throw', _threw);
dl._resetFetchForTest();
dl.clearDataCache();

// 2b) contentRepository — 동기 getter + preload 교체 검증 (라운드 17)
const repo = await import('./js/contentRepository.js');
repo.resetRepositoryForTest();
// 동기 getter — preload 전에는 JS base
ok('repository: getStories("N4") 동기 배열',
   Array.isArray(repo.getStories('N4')) && repo.getStories('N4').length >= 6);
ok('repository: getVocab("N5") == JS 원본 수',
   repo.getVocab('N5').length === vocab.filter(v=>v.level==='N5').length);
ok('repository: getAllItems("stories") 전 레벨 병합',
   repo.getAllItems('stories').length === stories.length);
// findItem / findVocab / findGrammar
ok('repository: findVocab 기존 id', repo.findVocab('v_n5_1')?.word === '待つ');
ok('repository: findGrammar 기존 id', repo.findGrammar('g_n4_5')?.pattern.includes('ことがある'));
ok('repository: findItem 미존재 id → null', repo.findItem('vocab', 'v_none') === null);
// invalid 방어
let _rThrew = false;
try { repo.getItems('unknown', 'N5'); } catch { _rThrew = true; }
ok('repository: invalid type throw', _rThrew);
_rThrew = false;
try { repo.getItems('vocab', 'N9'); } catch { _rThrew = true; }
ok('repository: invalid level throw', _rThrew);
// preload — 가짜 fetch 로 JSON 우선 경로 (marker 로 교체 확인)
repo.resetRepositoryForTest();
dl._setFetchForTest(async (path) => {
  if (path === 'data/n4/stories.json') {
    const real = JSON.parse(_fs.readFileSync(new URL('./data/n4/stories.json', import.meta.url), 'utf8'));
    real[0] = { ...real[0], titleKo: real[0].titleKo + ' (JSON)' };  // marker
    return { ok: true, json: async () => real };
  }
  return { ok: false };  // 나머지 영역 → JS fallback
});
ok('repository: preload 전 isRepositoryLevelLoaded false',
   repo.isRepositoryLevelLoaded('N4') === false);
await repo.preloadRepositoryLevel('N4');
ok('repository: preload 후 isRepositoryLevelLoaded true',
   repo.isRepositoryLevelLoaded('N4') === true);
ok('repository: preload 후 N4 stories 가 JSON 데이터 (marker 확인)',
   repo.getStories('N4')[0].titleKo.endsWith('(JSON)'));
ok('repository: JSON 부재 영역(N4 vocab)은 JS fallback 으로 교체',
   repo.getVocab('N4').length === vocab.filter(v=>v.level==='N4').length);
ok('repository: preload 후 findItem 도 JSON 데이터 반영',
   repo.findStory(repo.getStories('N4')[0].id)?.titleKo.endsWith('(JSON)'));
// fetch 전부 실패해도 동작 (fallback)
repo.resetRepositoryForTest();
dl._setFetchForTest(async () => { throw new Error('network down'); });
await repo.preloadRepositoryLevel('N4');
ok('repository: fetch 전부 실패 시에도 getStories 동작 (JS fallback)',
   repo.getStories('N4').length >= 6);
// reset
dl._resetFetchForTest();
repo.resetRepositoryForTest();
ok('repository: reset 후 loadedLevels 비움',
   repo.isRepositoryLevelLoaded('N4') === false);

// 2c) storyView 가 ../data/stories.js 직접 import 를 끊었는지 정적 검사
const storyViewSrc2 = _fs.readFileSync(new URL('./js/views/storyView.js', import.meta.url), 'utf8');
ok('storyView: ../data/stories.js 직접 import 제거',
   !/from\s+['"]\.\.\/data\/stories\.js['"]/.test(storyViewSrc2));
ok('storyView: ../data/vocab.js 직접 import 제거',
   !/from\s+['"]\.\.\/data\/vocab\.js['"]/.test(storyViewSrc2));
ok('storyView: contentRepository import 사용',
   /from\s+['"]\.\.\/contentRepository\.js['"]/.test(storyViewSrc2));
ok('storyView: warmRepository (preload) 호출',
   /preloadRepositoryLevel\(/.test(storyViewSrc2));
// study.js — 카드 lookup repository 전환
const studySrc3 = _fs.readFileSync(new URL('./js/views/study.js', import.meta.url), 'utf8');
ok('study.js: repoFindItem 으로 card lookup',
   /repoFindItem\(['"]vocab['"]/.test(studySrc3) && /repoFindItem\(['"]grammar['"]/.test(studySrc3));

// ── 라운드 18: bodyRomaji / 테마 / romaji·해석 설정 / coverImage / compact player ──
// bodyRomaji — 전 스토리 필수
for (const s of stories) {
  ok(`stories[${s.id}]: bodyRomaji 배열`, Array.isArray(s.bodyRomaji));
  ok(`stories[${s.id}]: bodyRomaji 길이 == bodyJa`,
     s.bodyRomaji?.length === s.bodyJa.length,
     `romaji=${s.bodyRomaji?.length} ja=${s.bodyJa.length}`);
  ok(`stories[${s.id}]: bodyRomaji non-empty`,
     (s.bodyRomaji || []).every(r => typeof r === 'string' && r.trim().length > 0));
}

// 설정 기본값
_store.resetAll();
const _defS18 = _store.getState().settings;
ok('settings.storyRomajiEnabled 기본 true',       _defS18.storyRomajiEnabled === true);
ok('settings.storyTranslationEnabled 기본 true',  _defS18.storyTranslationEnabled === true);
ok('settings.themeMode 기본 system',              _defS18.themeMode === 'system');
// state API
ok('getStoryRomajiEnabled 기본 true',      _state.getStoryRomajiEnabled() === true);
ok('getStoryTranslationEnabled 기본 true', _state.getStoryTranslationEnabled() === true);
ok('getThemeMode 기본 system',             _state.getThemeMode() === 'system');
_state.setStoryRomajiEnabled(false);
ok('setStoryRomajiEnabled(false)',         _state.getStoryRomajiEnabled() === false);
_state.setStoryTranslationEnabled(false);
ok('setStoryTranslationEnabled(false)',    _state.getStoryTranslationEnabled() === false);
_state.setThemeMode('light');
ok('setThemeMode(light)',                  _state.getThemeMode() === 'light');
_state.setThemeMode('dark');
ok('setThemeMode(dark)',                   _state.getThemeMode() === 'dark');
_state.setThemeMode('weird');
ok('themeMode invalid → system fallback',  _state.getThemeMode() === 'system');
_store.resetAll();

// theme.js — resolveThemeMode (Node: matchMedia 없음 → dark 기본)
const themeMod = await import('./js/theme.js');
ok('theme: resolveThemeMode("light") === light', themeMod.resolveThemeMode('light') === 'light');
ok('theme: resolveThemeMode("dark") === dark',   themeMod.resolveThemeMode('dark') === 'dark');
ok('theme: system(no matchMedia) → dark',        themeMod.resolveThemeMode('system') === 'dark');

// storyView — romaji/해석 렌더 경로 + compact player 정적 검사
const svSrc18 = _fs.readFileSync(new URL('./js/views/storyView.js', import.meta.url), 'utf8');
ok('storyView: .story-romaji 렌더 경로',    /story-romaji/.test(svSrc18));
ok('storyView: .story-ko-inline 렌더 경로', /story-ko-inline/.test(svSrc18));
ok('storyView: getStoryRomajiEnabled 사용', /getStoryRomajiEnabled/.test(svSrc18));
ok('storyView: getStoryTranslationEnabled 사용', /getStoryTranslationEnabled/.test(svSrc18));
ok('storyView: compact controls row (storyControlsRow)', /storyControlsRow/.test(svSrc18));
ok('storyView: 이전/재생/다음 같은 row (storyPrev/PlayAll/Next 동일 컨테이너)',
   /story-player-main[\s\S]{0,400}storyPrev[\s\S]{0,200}storyPlayAll[\s\S]{0,200}storyNext/.test(svSrc18));
ok('storyView: 속도 chip 이 compact row 안',
   /storyControlsRow[\s\S]{0,900}data-rate/.test(svSrc18));
ok('storyView: coverImage 렌더 (story-cover)', /story-cover/.test(svSrc18));

// CSS — 테마 변수/셀렉터 + compact padding
const css18 = _fs.readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
ok('CSS: [data-theme="light"] 셀렉터', /\[data-theme="light"\]/.test(css18));
ok('CSS: [data-theme="dark"] 셀렉터',  /\[data-theme="dark"\]/.test(css18));
ok('CSS: --bar-bg 변수',               /--bar-bg:/.test(css18));
ok('CSS: .story-romaji 스타일',        /\.story-romaji\s*\{/.test(css18));
ok('CSS: .story-ko-inline 스타일',     /\.story-ko-inline\s*\{/.test(css18));
ok('CSS: has-story-player padding 120px (compact)',
   /\.has-story-player\s*\{?\s*padding-bottom:\s*120px/.test(css18) ||
   /has-story-player \{ padding-bottom: 120px/.test(css18));
ok('CSS: .player-btn 스타일',          /\.player-btn\s*\{/.test(css18));
ok('CSS: .story-cover 스타일',         /\.story-cover\s*\{/.test(css18));

// index.html — 노플래시 인라인 테마 스크립트
const idx18 = _fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
ok('index.html: 인라인 테마 스크립트 (dataset.theme)',
   /dataset\.theme/.test(idx18) && /prefers-color-scheme/.test(idx18));

// coverImage — 스키마 + 파일 존재 + 라이선스 기록
const licenseDoc = _fs.readFileSync(new URL('./docs/asset-licenses.md', import.meta.url), 'utf8');
let coverCount = 0;
for (const s of stories) {
  if (!s.coverImage) continue;
  coverCount++;
  ok(`stories[${s.id}]: coverImage.src/altKo/licenseId 존재`,
     typeof s.coverImage.src === 'string' && s.coverImage.src.length > 0 &&
     typeof s.coverImage.altKo === 'string' && s.coverImage.altKo.length > 0 &&
     typeof s.coverImage.licenseId === 'string' && s.coverImage.licenseId.length > 0);
  ok(`stories[${s.id}]: coverImage 파일 존재 (${s.coverImage.src})`,
     _fs.existsSync(new URL('./' + s.coverImage.src, import.meta.url)));
  ok(`stories[${s.id}]: 라이선스 문서에 ${s.coverImage.licenseId} 기록`,
     licenseDoc.includes(s.coverImage.licenseId));
}
ok('coverImage 샘플 2~3개 적용', coverCount >= 2 && coverCount <= 4, `count=${coverCount}`);

// ── 라운드 19: Firebase auth + actionLogger ──────────────────────────────
ok('firebaseConfig.js 존재',
   _fs.existsSync(new URL('./js/firebaseConfig.js', import.meta.url)));
const authSvc = await import('./js/authService.js');
for (const fn of ['initAuth','observeAuth','getCurrentUser','signUpWithEmail','signInWithEmail','logout','authAvailable']) {
  ok(`authService: ${fn} export`, typeof authSvc[fn] === 'function');
}
const logger = await import('./js/actionLogger.js');
for (const fn of ['logAction','getAnonymousVisitorId']) {
  ok(`actionLogger: ${fn} export`, typeof logger[fn] === 'function');
}
ok('actionLogger: ACTION_LOG_MIN_INTERVAL_MS === 3000',
   logger.ACTION_LOG_MIN_INTERVAL_MS === 3000);
ok('actionLogger: APP_OPEN_LOG_ONCE_PER_DAY === true',
   logger.APP_OPEN_LOG_ONCE_PER_DAY === true);
const loggerSrc = _fs.readFileSync(new URL('./js/actionLogger.js', import.meta.url), 'utf8');
ok('actionLogger: actionLogs/ 경로 문자열', /actionLogs\//.test(loggerSrc));
ok('actionLogger: userActivity/ 경로 문자열', /userActivity\//.test(loggerSrc));
ok('actionLogger: logAction 전체 try/catch 격리',
   /export function logAction[\s\S]*?try \{[\s\S]*?\} catch \{/.test(loggerSrc));
ok('actionLogger: write fire-and-forget (.catch)',
   /write\([\s\S]*?\)\.catch\(\(\) => \{\}\)/.test(loggerSrc));
// 금지 패턴 — 차단/동기화/Google 로그인 미구현 확인
const fbAll = [loggerSrc,
  _fs.readFileSync(new URL('./js/authService.js', import.meta.url), 'utf8'),
  _fs.readFileSync(new URL('./js/firebaseClient.js', import.meta.url), 'utf8')].join('\n');
ok('금지: registrationOpen/maxUsers/accessBlock 코드 없음',
   !/registrationOpen|maxUsers|accessBlock/.test(fbAll));
ok('금지: syncService/progress sync 코드 없음',
   !/syncService|syncProgress|progressSync/.test(fbAll));
ok('금지: Google 로그인 API 없음',
   !/GoogleAuthProvider|signInWithPopup|signInWithRedirect/.test(fbAll));
ok('금지: 비밀번호 localStorage 저장 없음',
   !/localStorage[\s\S]{0,40}password/i.test(fbAll));
// logAction 단위 — 로그인 필수 정책(라운드 50): 비로그인 noop / 로그인 시 signed-in 만 기록
logger._resetThrottleForTest();
const _logWrites = [];
logger._setWriterForTest(async (path, value) => { _logWrites.push({ path, value }); });
// (1) 비로그인 → 기록 안 함
logger.logAction('study_start', { itemType: 'vocab', method: 'image' });
await new Promise(r => setTimeout(r, 10));
ok('logAction: 비로그인 시 기록 안 함(noop)', _logWrites.length === 0,
   `writes=${_logWrites.map(w=>w.path).join(',')}`);
// (2) 로그인(mock) 후 → actionLogs + userActivity (anonymousActivity 없음)
authSvc._setAuthImplForTest({ signIn: async () => ({ uid: 'uTest1', email: 'qa@example.com' }), observe() {} });
await authSvc.signInWithEmail('qa@example.com', 'pw123456');
logger._resetThrottleForTest();
logger.logAction('study_start', { itemType: 'vocab', method: 'image' });
await new Promise(r => setTimeout(r, 10));
ok('logAction: 로그인 시 actionLogs+userActivity 2건',
   _logWrites.length === 2 &&
   _logWrites.some(w => w.path.startsWith('actionLogs/')) &&
   _logWrites.some(w => w.path.startsWith('userActivity/')),
   `writes=${_logWrites.map(w=>w.path).join(',')}`);
ok('logAction: anonymousActivity 미기록 (정책: signed-in 전용)',
   !_logWrites.some(w => w.path.startsWith('anonymousActivity')));
ok('logAction: userType signed-in',
   _logWrites.find(w => w.path.startsWith('actionLogs/'))?.value.userType === 'signed-in');
ok('logAction: userKey = uid (이메일 아님)',
   _logWrites.find(w => w.path.startsWith('actionLogs/'))?.value.userKey === 'uTest1');
// 스로틀 — 같은 이벤트 즉시 재호출은 무시
logger.logAction('study_start', { itemType: 'vocab', method: 'image' });
await new Promise(r => setTimeout(r, 10));
ok('logAction: 3초 내 중복 차단', _logWrites.length === 2);
// 허용 외 타입 거부
logger.logAction('click_everything', {});
await new Promise(r => setTimeout(r, 10));
ok('logAction: 화이트리스트 외 타입 거부', _logWrites.length === 2);
// meta sanitize — 원문 텍스트 키 제거
logger._resetThrottleForTest();
logger.logAction('story_open', { storyId: 'story_n5_001', answerText: '原文', sttText: 'x' });
await new Promise(r => setTimeout(r, 10));
const _storyEv = _logWrites.find(w => w.value?.type === 'story_open');
ok('logAction: meta 화이트리스트 외 키 제거 (answerText/sttText)',
   _storyEv && !('answerText' in _storyEv.value.meta) && !('sttText' in _storyEv.value.meta));
logger._resetWriterForTest();
logger._resetThrottleForTest();
authSvc._resetAuthImplForTest();

// ── 라운드 20: public repo 보안 정적 검증 + 실연결 준비 ───────────────────
const fbCfgSrc = _fs.readFileSync(new URL('./js/firebaseConfig.js', import.meta.url), 'utf8');
// Admin SDK / service account 흔적 금지 — 전체 js 디렉터리 스캔
let secViolations = [];
function scanDir(dirUrl) {
  for (const f of _fs.readdirSync(dirUrl)) {
    const u = new URL(f + (f.includes('.') ? '' : '/'), dirUrl);
    if (_fs.statSync(u).isDirectory()) { scanDir(new URL(f + '/', dirUrl)); continue; }
    if (!f.endsWith('.js') && !f.endsWith('.json') && !f.endsWith('.html')) continue;
    const src = _fs.readFileSync(u, 'utf8');
    if (/PRIVATE KEY|private_key|client_email|service[-_]account/i.test(src)) {
      secViolations.push(`${f}`);
    }
  }
}
scanDir(new URL('./js/', import.meta.url));
scanDir(new URL('./data/', import.meta.url));
ok('보안: PRIVATE KEY / service account / client_email 패턴 없음',
   secViolations.length === 0, `found in: ${secViolations.join(',')}`);
ok('보안: firebaseConfig 에 Admin SDK 필드 없음',
   !/private_key|client_email|token_uri|auth_provider/.test(fbCfgSrc));
ok('보안: password localStorage 저장 패턴 없음 (전체 재확인)',
   !/localStorage[\s\S]{0,60}(password|비밀번호)/i.test(
     _fs.readFileSync(new URL('./js/views/settings.js', import.meta.url), 'utf8')));
// meta 화이트리스트에 email/password/text 키 없음
ok('보안: sanitizeMeta 화이트리스트에 email/password/text 원문 키 없음',
   !/['"](email|password|answerText|sttText|userText)['"]/.test(
     loggerSrc.match(/function sanitizeMeta[\s\S]*?\n\}/)?.[0] || ''));
// config 실제 값 입력 확인 + databaseURL 존재
const fbCfg = await import('./js/firebaseConfig.js');
ok('firebaseConfig: 실제 config 입력됨 (isFirebaseConfigured true)',
   fbCfg.isFirebaseConfigured() === true);
ok('firebaseConfig: databaseURL 존재',
   typeof fbCfg.firebaseConfig.databaseURL === 'string' &&
   fbCfg.firebaseConfig.databaseURL.startsWith('https://'));
// 테스트 전용 export + 공개 sendTestLog 제거 (라운드 21)
ok('actionLogger: _sendTestLogForTest (테스트 전용) export',
   typeof logger._sendTestLogForTest === 'function');
ok('actionLogger: 공개 sendTestLog 제거됨', logger.sendTestLog === undefined);
// 라운드 50 — 로그인 필수 정책: anonymousActivity 신규 쓰기 코드 없음
ok('actionLogger: anonymousActivity 쓰기 경로 폐기(신규 write 없음)',
   !/write\(\s*[`'"]anonymousActivity/.test(loggerSrc) && !/anonymousActivity\/\$\{/.test(loggerSrc));
ok('actionLogger: resolveUser 비로그인 → null (signed-in 전용)',
   /return null;/.test(loggerSrc.match(/function resolveUser[\s\S]*?\n\}/)?.[0] || ''));
ok('actionLogger: userActivity signedIn:true 고정',
   /signedIn:\s*true/.test(loggerSrc));
// firebaseClient 상태 추적
const fbCl = await import('./js/firebaseClient.js');
ok('firebaseClient: getInitStatus export', typeof fbCl.getInitStatus === 'function');
// settings — 상태 배지 유지 + 테스트 버튼/문구 제거 (라운드 21)
const settingsSrc20 = _fs.readFileSync(new URL('./js/views/settings.js', import.meta.url), 'utf8');
ok('settings: fbStatusBadge 마크업 유지', /fbStatusBadge/.test(settingsSrc20));
ok('settings: fbTestBtn 제거됨', !/id="fbTestBtn"/.test(settingsSrc20));
ok('settings: "로그 테스트" 버튼 텍스트 제거됨',
   !/>로그 테스트</.test(settingsSrc20));
ok('settings: Console 확인 테스트 문구 제거됨 (Console > actionLogs 안내)',
   !/Console > Realtime Database > actionLogs/.test(settingsSrc20));
ok('settings: _sendTestLogForTest 를 UI 에서 미사용',
   !/_sendTestLogForTest/.test(settingsSrc20));
// 운영 rules 초안이 문서에 보강되었는지
const fbDoc20 = _fs.readFileSync(new URL('./docs/firebase-logging.md', import.meta.url), 'utf8');
ok('firebase-logging.md: .validate rules 초안 포함', /\.validate/.test(fbDoc20));
ok('firebase-logging.md: anonymousActivity rules 포함', /anonymousActivity/.test(fbDoc20));
ok('firebase-logging.md: App Check 언급', /App Check/.test(fbDoc20));
// 라운드 21 — Console rules 적용 위치 + main 병합 체크리스트 + payload 일치 노트
ok('firebase-logging.md: Realtime Database → Rules 위치 설명',
   /Realtime Database[\s\S]{0,80}Rules/.test(fbDoc20) && /Publish/.test(fbDoc20));
ok('firebase-logging.md: main 병합 전 체크리스트 존재',
   /main 머지 전 체크리스트|main 병합 전 체크리스트/.test(fbDoc20));
ok('firebase-logging.md: payload↔rules 일치 노트 (meta 비필수 이유)',
   /meta[\s\S]{0,120}(비필수|요구하지 않)/.test(fbDoc20));

// 3) data/n4/stories.json 이 JS 원본과 동기화되어 있는지 (drift 방지)
const _jsonRaw = JSON.parse(_fs.readFileSync(new URL('./data/n4/stories.json', import.meta.url), 'utf8'));
ok('data/n4/stories.json — JS 원본과 항목 수 일치',
   _jsonRaw.length === stories.filter(s=>s.level==='N4').length);
ok('data/n4/stories.json — sourceType 모두 original',
   _jsonRaw.every(s => s.sourceType === 'original'));


// ── 라운드 29: 콘텐츠 의존성 + 준비도 유틸 검증 ─────────────────────────
{
  const _vSet = new Set(vocab.map(v => v.id));
  const _gSet = new Set(grammar.map(g => g.id));
  const _vLevel = new Map(vocab.map(v => [v.id, v.level]));
  const _gLevel = new Map(grammar.map(g => [g.id, g.level]));
  const ALLOWED_N4_DEP_LEVELS = new Set(['N4', 'N5']);

  let _depBad = 0, _depLevelBad = 0, _depCore0 = 0, _depTagged = 0;
  for (const [label, items] of [['reading', reading], ['listening', listening]]) {
    for (const it of items.filter(x => x.level === 'N4')) {
      const vAll = [...(it.vocabIds || []), ...(it.optionalVocabIds || [])];
      const gAll = [...(it.grammarIds || []), ...(it.optionalGrammarIds || [])];
      if (it.vocabIds || it.grammarIds) _depTagged++;
      for (const id of vAll) {
        if (!_vSet.has(id)) { ok(`${label} ${it.id}: dep vocab ${id} 존재`, false); _depBad++; }
        else if (!ALLOWED_N4_DEP_LEVELS.has(_vLevel.get(id))) { ok(`${label} ${it.id}: dep vocab ${id} 레벨(N4/N5)`, false); _depLevelBad++; }
      }
      for (const id of gAll) {
        if (!_gSet.has(id)) { ok(`${label} ${it.id}: dep grammar ${id} 존재`, false); _depBad++; }
        else if (!ALLOWED_N4_DEP_LEVELS.has(_gLevel.get(id))) { ok(`${label} ${it.id}: dep grammar ${id} 레벨(N4/N5)`, false); _depLevelBad++; }
      }
      if (((it.vocabIds || []).length + (it.grammarIds || []).length) === 0) {
        ok(`${label} ${it.id}: 핵심 의존성 ≥ 1`, false); _depCore0++;
      }
    }
  }
  ok('N4 reading/listening 의존성 참조 무결성 0 오류', _depBad === 0);
  ok('N4 의존성 레벨 검사 (N3/N2 혼입 0)', _depLevelBad === 0);
  ok('N4 reading/listening 핵심 의존성 0건 없음', _depCore0 === 0);
  ok('N4 reading/listening 의존성 태깅 == 전수',
     _depTagged === reading.filter(r=>r.level==='N4').length + listening.filter(l=>l.level==='N4').length,
     `tagged=${_depTagged}`);

  let _stBad = 0;
  const { stories: _storiesDep } = await import('./js/data/stories.js');
  for (const s of _storiesDep.filter(x => x.level === 'N4')) {
    for (const id of (s.vocabularyIds || [])) if (!_vSet.has(id)) { ok(`story ${s.id}: vocabularyIds ${id} 존재`, false); _stBad++; }
    for (const id of (s.grammarIds || [])) if (!_gSet.has(id)) { ok(`story ${s.id}: grammarIds ${id} 존재`, false); _stBad++; }
    ok(`story ${s.id}: vocabularyIds 보강됨 (≥ 5)`, (s.vocabularyIds || []).length >= 5,
       `count=${(s.vocabularyIds || []).length}`);
  }
  ok('story 의존성 참조 무결성 0 오류', _stBad === 0);

  const { conversationTopics: _topicsDep } = await import('./js/data/conversationTopics.js');
  let _tpBad = 0;
  for (const t of _topicsDep) {
    for (const id of (t.optionalVocabIds || [])) if (!_vSet.has(id)) _tpBad++;
    for (const id of (t.optionalGrammarIds || [])) if (!_gSet.has(id)) _tpBad++;
  }
  ok('conversationTopics optional ids 참조 무결성', _tpBad === 0);

  const cr = await import('./js/contentReadiness.js');
  const mockItem = { vocabIds: ['a','b','c','d'], grammarIds: ['e'] };
  const allKnown = { a:1,b:1,c:1,d:1,e:1 };
  const fourKnown = { a:1,b:1,c:1,d:1 };
  const threeKnown = { a:1,b:1,c:1 };
  const twoKnown = { a:1,b:1 };
  ok('readiness: 100% → ready', cr.classifyContentReadiness(mockItem, allKnown) === 'ready');
  ok('readiness: 0.8 경계 → ready', cr.classifyContentReadiness(mockItem, fourKnown) === 'ready');
  ok('readiness: 0.6 → good_next', cr.classifyContentReadiness(mockItem, threeKnown) === 'good_next');
  ok('readiness: 0.4 → locked', cr.classifyContentReadiness(mockItem, twoKnown) === 'locked');
  ok('readiness: 의존성 없음 → ready', cr.classifyContentReadiness({}, {}) === 'ready');
  const _covT = cr.getLearnedCoverage(mockItem, threeKnown);
  ok('coverage: 필드 정합', _covT.vocabTotal === 4 && _covT.vocabKnown === 3 && _covT.grammarTotal === 1
     && _covT.grammarKnown === 0 && _covT.missingVocabIds.length === 1 && _covT.missingGrammarIds.length === 1);
  ok('dependency: reading', (cr.getItemDependency('reading', 'r_n4_21')?.vocabIds || []).length >= 1);
  ok('dependency: listening', (cr.getItemDependency('listening', 'l_n4_21')?.vocabIds || []).length >= 1);
  ok('dependency: story', (cr.getItemDependency('story', 'story_n4_007')?.vocabIds || []).length >= 1);
  ok('dependency: conversationTopic', (cr.getItemDependency('conversationTopic', 'conv_n4_hotel_stay')?.vocabIds || []).length >= 1);
  for (const [name, fn] of [['reading', cr.getRecommendedReading], ['listening', cr.getRecommendedListening],
                            ['stories', cr.getRecommendedStories], ['topics', cr.getRecommendedConversationTopics]]) {
    const rec = fn('N4', {}, { count: 5 });
    ok(`추천(${name}): 빈 배열 아님`, rec.length > 0, `len=${rec.length}`);
    ok(`추천(${name}): readiness 필드 보유`, rec.every(r => ['ready','good_next','locked'].includes(r.readiness)));
  }
  const dep21 = cr.getItemDependency('reading', 'r_n4_21');
  const simRs = {};
  [...dep21.vocabIds, ...dep21.grammarIds].forEach(id => { simRs[id] = { correctCount: 1 }; });
  const recSim = cr.getRecommendedReading('N4', simRs, { count: 60 });
  const idx21 = recSim.findIndex(r => r.item.id === 'r_n4_21');
  const firstLocked = recSim.findIndex(r => r.readiness === 'locked');
  ok('추천: 학습 완비 항목(r_n4_21)이 locked 보다 앞', idx21 >= 0 && (firstLocked === -1 || idx21 < firstLocked),
     `idx21=${idx21} firstLocked=${firstLocked}`);
}


// ── 라운드 30: 음성 안정화 / 매뉴얼 / 발음 버튼 / 카드 흐름 정적 검증 ────
{
  const _fs30 = await import('node:fs');
  const ttsSrc = _fs30.readFileSync(new URL('./js/tts.js', import.meta.url), 'utf8');
  // voice manager API
  ok('tts: refreshVoices export', /export async function refreshVoices/.test(ttsSrc));
  ok('tts: getVoiceStatus export', /export function getVoiceStatus/.test(ttsSrc));
  ok('tts: onVoiceStatusChange export', /export function onVoiceStatusChange/.test(ttsSrc));
  ok('tts: voiceschanged 리스너', /voiceschanged/.test(ttsSrc));
  ok('tts: 재시도 루프 (RETRY_DELAYS)', /RETRY_DELAYS/.test(ttsSrc));
  ok('tts: name 보조 판정 (Japanese/日本)', /japanese\|japan\|日本/i.test(ttsSrc));
  ok('tts: speak 시 마지막 재확인', /cachedVoice \|\| findJaVoice\(\)/.test(ttsSrc));
  ok('tts: 자동재생 실패 분리 (playback-error)', /playback-error/.test(ttsSrc));

  const settingsSrc = _fs30.readFileSync(new URL('./js/views/settings.js', import.meta.url), 'utf8');
  ok('settings: 음성 상태 영역', /voiceStatusSection/.test(settingsSrc));
  ok('settings: 음성 다시 감지 버튼', /voiceRefreshBtn/.test(settingsSrc));
  ok('settings: 매뉴얼 토글', /helpToggle/.test(settingsSrc));
  ok('settings: 안내 문구 (늦게 불러올 수)', /늦게 불러올 수/.test(settingsSrc));

  // helpEnabled API + 기본 false
  const { getHelpEnabled, setHelpEnabled } = await import('./js/state.js');
  ok('state: getHelpEnabled/setHelpEnabled 존재',
     typeof getHelpEnabled === 'function' && typeof setHelpEnabled === 'function');
  const stateSrc = _fs30.readFileSync(new URL('./js/state.js', import.meta.url), 'utf8');
  ok('state: helpEnabled 기본 false (=== true 비교)', /helpEnabled === true/.test(stateSrc));
  const { _helpKeys } = await import('./js/helpContent.js');
  ok('helpContent: 8개 화면 키', _helpKeys.length >= 8, `keys=${_helpKeys.length}`);

  // vocabCardView 카드 흐름 정책
  const vcSrc = _fs30.readFileSync(new URL('./js/views/vocabCardView.js', import.meta.url), 'utf8');
  ok('vocabCard: quickPreview 상태 존재', /quickPreview/.test(vcSrc));
  ok('vocabCard: warmup OFF → quickPreview 시작',
     /warmupEnabled \? 'expose1' : 'quickPreview'/.test(vcSrc));
  // 학습 기록 호출은 onPick(quiz 답변) 안에서만 — recordResult 호출이 정확히 1곳
  ok('vocabCard: recordResult 호출 1곳 (onPick 내)',
     (vcSrc.match(/recordResult\(/g) || []).length === 1, // 호출 1곳 (import 는 매칭 안 됨)
     `count=${(vcSrc.match(/recordResult\(/g) || []).length}`);
  ok('vocabCard: markStudiedToday 호출 1곳',
     (vcSrc.match(/markStudiedToday\(\)/g) || []).length === 1);
  // skip 경로 — skipWord 함수 본문에 기록/로그 없음
  const skipBody = (vcSrc.match(/function skipWord\(\) \{[\s\S]*?\n  \}/) || [''])[0];
  ok('vocabCard: skipWord 존재', skipBody.length > 0);
  ok('vocabCard: skipWord 에 recordResult 없음', !/recordResult/.test(skipBody));
  ok('vocabCard: skipWord 에 logAction 없음', !/logAction/.test(skipBody));
  ok('vocabCard: skipWord 가 타이머/음성 정리', /clearRecallTimer/.test(skipBody) && /stopSpeaking/.test(skipBody));
  // 테스트 훅 유지
  ok('vocabCard: _setRecallMsForTest 유지', /_setRecallMsForTest/.test(vcSrc));

  // CSS — 모바일 wrap
  const cssSrc = _fs30.readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
  ok('css: vocab-card-nav flex-wrap', /\.vocab-card-nav[\s\S]{0,120}flex-wrap:\s*wrap/.test(cssSrc));
  ok('css: help-card 스타일', /\.help-card/.test(cssSrc));
}


// ── 라운드 31: romaji 변환 유틸 + 표시/누출 정책 ─────────────────────────
{
  const { kanaToRomaji, getVocabRomaji } = await import('./js/romaji.js');
  // 단위 테스트 — 변환 기준 고정
  const cases = [
    ['まつ', 'matsu'], ['がっこう', 'gakkou'], ['しゃしん', 'shashin'],
    ['ちょっと', 'chotto'], ['りょこう', 'ryokou'], ['コーヒー', 'koohii'],
    ['まっちゃ', 'matcha'], ['ぎゅうにゅう', 'gyuunyuu'], ['キャンセル', 'kyanseru'],
    ['ん', 'n'], ['ぱん', 'pan'],
  ];
  for (const [input, expected] of cases) {
    ok(`romaji: ${input} → ${expected}`, kanaToRomaji(input) === expected,
       `got=${kanaToRomaji(input)}`);
  }
  ok('romaji: 빈 값 안전', kanaToRomaji('') === '' && kanaToRomaji(null) === '' && kanaToRomaji(undefined) === '');
  ok('romaji: 비문자열 안전', kanaToRomaji(123) === '');
  ok('romaji: override 우선', getVocabRomaji({ reading: 'まつ', romaji: 'MATSU' }) === 'MATSU');
  ok('romaji: 런타임 변환', getVocabRomaji({ reading: 'まつ' }) === 'matsu');

  const _fs31 = await import('node:fs');
  const vcSrc31 = _fs31.readFileSync(new URL('./js/views/vocabCardView.js', import.meta.url), 'utf8');
  ok('vocabCard: getVocabRomaji 사용', /getVocabRomaji/.test(vcSrc31));
  // recall/quiz 페인터에는 romaji 헬퍼 미사용 (누출 방지 정적 확인)
  const recallBody31 = (vcSrc31.match(/function paintRecall\(\) \{[\s\S]*?\n  \}/) || [''])[0];
  const quizBody31 = (vcSrc31.match(/function paintQuiz\(\) \{[\s\S]*?\n  \}/) || [''])[0];
  ok('vocabCard: paintRecall 에 romaji 없음', recallBody31.length > 0 && !/getVocabRomaji|romaji/i.test(recallBody31));
  ok('vocabCard: paintQuiz 에 romaji 없음', quizBody31.length > 0 && !/getVocabRomaji|romaji/i.test(quizBody31));
  // aria-label/title 에 word/reading/romaji/meaningKo 미주입 — 발음 버튼은 고정 라벨만
  ok('vocabCard: 발음 버튼 aria 고정 라벨', /aria-label="발음 듣기"/.test(vcSrc31));
  ok('vocabCard: aria-label 에 변수 주입 없음', !/aria-label="\$\{/.test(vcSrc31));
  const studySrc31 = _fs31.readFileSync(new URL('./js/views/study.js', import.meta.url), 'utf8');
  ok('study: row romaji 표시', /romaji-sub/.test(studySrc31));
  ok('study: listen 버튼 aria 고정', /aria-label="발음 듣기"/.test(studySrc31));
  const reviewSrc31 = _fs31.readFileSync(new URL('./js/views/review.js', import.meta.url), 'utf8');
  ok('review: row romaji 표시', /romaji-sub/.test(reviewSrc31));
  const cssSrc31 = _fs31.readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
  ok('css: romaji-sub 보조 스타일', /\.romaji-sub/.test(cssSrc31));
  // TTS 에 romaji 미전달 — speak( 호출에 romaji 변수 없음 (정적)
  ok('vocabCard: speak 에 romaji 미전달', !/speak\([^)]*[rR]omaji/.test(vcSrc31));
}


// ── 라운드 31: N5 의존성 백포트 검증 ─────────────────────────────────────
{
  const _vSet5 = new Map(vocab.map(v => [v.id, v.level]));
  const _gSet5 = new Map(grammar.map(g => [g.id, g.level]));

  // N5 reading/listening — 전수 태깅 + 참조 무결성 + N5 만 참조 + 핵심 ≥1 (blocking)
  let _tag5 = 0, _bad5 = 0, _lvl5 = 0, _core05 = 0;
  for (const [label, items] of [['reading', reading], ['listening', listening]]) {
    for (const it of items.filter(x => x.level === 'N5')) {
      if (it.vocabIds || it.grammarIds) _tag5++;
      for (const id of [...(it.vocabIds || []), ...(it.optionalVocabIds || [])]) {
        if (!_vSet5.has(id)) { ok(`N5 ${label} ${it.id}: dep vocab ${id} 존재`, false); _bad5++; }
        else if (_vSet5.get(id) !== 'N5') { ok(`N5 ${label} ${it.id}: dep ${id} 는 N5 만 허용`, false); _lvl5++; }
      }
      for (const id of [...(it.grammarIds || []), ...(it.optionalGrammarIds || [])]) {
        if (!_gSet5.has(id)) { ok(`N5 ${label} ${it.id}: dep grammar ${id} 존재`, false); _bad5++; }
        else if (_gSet5.get(id) !== 'N5') { ok(`N5 ${label} ${it.id}: dep ${id} 는 N5 만 허용`, false); _lvl5++; }
      }
      if (((it.vocabIds || []).length + (it.grammarIds || []).length) === 0) {
        ok(`N5 ${label} ${it.id}: 핵심 의존성 ≥ 1`, false); _core05++;
      }
    }
  }
  ok('N5 reading/listening 의존성 태깅 == 전수 (80)', _tag5 === 80, `tagged=${_tag5}`);
  ok('N5 의존성 참조 무결성 0 오류', _bad5 === 0);
  ok('N5 의존성 N4/N3/N2 참조 0 (N5 만)', _lvl5 === 0);
  ok('N5 핵심 의존성 0건 없음', _core05 === 0);

  // N5 story — vocabularyIds/grammarIds/key* 무결성 + N5 만 참조
  const { stories: _st5 } = await import('./js/data/stories.js');
  let _stBad5 = 0;
  for (const s of _st5.filter(x => x.level === 'N5')) {
    for (const id of [...(s.vocabularyIds || []), ...(s.keyVocabularyIds || [])]) {
      if (_vSet5.get(id) !== 'N5') { ok(`N5 story ${s.id}: vocab ref ${id} N5 만`, false); _stBad5++; }
    }
    for (const id of [...(s.grammarIds || []), ...(s.keyGrammarIds || [])]) {
      if (_gSet5.get(id) !== 'N5') { ok(`N5 story ${s.id}: grammar ref ${id} N5 만`, false); _stBad5++; }
    }
    ok(`N5 story ${s.id}: vocabularyIds 보강 (≥ 5)`, (s.vocabularyIds || []).length >= 5,
       `count=${(s.vocabularyIds || []).length}`);
  }
  ok('N5 story 의존성 무결성 0 오류', _stBad5 === 0);

  // readiness 유틸 — N5 동작
  const cr5 = await import('./js/contentReadiness.js');
  ok('N5 dependency: reading', (cr5.getItemDependency('reading', 'r_n5_26')?.vocabIds || []).length >= 1);
  ok('N5 dependency: listening', (cr5.getItemDependency('listening', 'l_n5_26')?.vocabIds || []).length >= 1);
  const _firstN5Story = _st5.find(s => s.level === 'N5');
  ok('N5 dependency: story', (cr5.getItemDependency('story', _firstN5Story.id)?.vocabIds || []).length >= 1);
  for (const [name, fn] of [['reading', cr5.getRecommendedReading], ['listening', cr5.getRecommendedListening],
                            ['stories', cr5.getRecommendedStories]]) {
    const rec = fn('N5', {}, { count: 5 });
    ok(`N5 추천(${name}): 빈 배열 아님`, rec.length > 0, `len=${rec.length}`);
    ok(`N5 추천(${name}): readiness 분류 유효`, rec.every(r => ['ready','good_next','locked'].includes(r.readiness)));
  }
  // 분류 동작 — r_n5_26 의존성 전부 학습 → ready 가 locked 앞
  const dep26 = cr5.getItemDependency('reading', 'r_n5_26');
  const simRs5 = {};
  [...dep26.vocabIds, ...dep26.grammarIds].forEach(id => { simRs5[id] = { correctCount: 1 }; });
  ok('N5 분류: 전부 학습 → ready', cr5.classifyContentReadiness(dep26, simRs5) === 'ready');
  ok('N5 분류: 빈 상태 → locked', cr5.classifyContentReadiness(dep26, {}) === 'locked');
  const recSim5 = cr5.getRecommendedReading('N5', simRs5, { count: 40 });
  const i26 = recSim5.findIndex(r => r.item.id === 'r_n5_26');
  const iLock5 = recSim5.findIndex(r => r.readiness === 'locked');
  ok('N5 추천: ready(r_n5_26)가 locked 보다 앞', i26 >= 0 && (iLock5 === -1 || i26 < iLock5),
     `i26=${i26} iLock=${iLock5}`);
}


// ── 라운드 32: N3 0차 시드 검증 ─────────────────────────────────────────
{
  // 수량 sentinel — N3 0차
  ok('N3 vocab ≥ 100 (0차)', vocab.filter(v => v.level === 'N3').length >= 100,
     `actual=${vocab.filter(v => v.level === 'N3').length}`);
  ok('N3 grammar ≥ 20 (0차)', grammar.filter(g => g.level === 'N3').length >= 20,
     `actual=${grammar.filter(g => g.level === 'N3').length}`);
  ok('N3 reading ≥ 8 (0차)', reading.filter(r => r.level === 'N3').length >= 8);
  ok('N3 listening ≥ 8 (0차)', listening.filter(l => l.level === 'N3').length >= 8);
  ok('N3 sentenceBank ≥ 50 (0차)', sentenceBank.filter(s => s.level === 'N3').length >= 50);
  ok('N3 sentenceBank 회화 가능 ≥ 40', sentenceBank.filter(s => s.level === 'N3' && s.canUseInConversation).length >= 40);
  const { kanji: _k32 } = await import('./js/data/kanji.js');
  ok('N3 kanji ≥ 100 (0차)', _k32.filter(k => k.level === 'N3').length >= 100,
     `actual=${_k32.filter(k => k.level === 'N3').length}`);
  const { conversationTopics: _t32 } = await import('./js/data/conversationTopics.js');
  ok('N3 conversationTopics ≥ 3 (0차)', _t32.filter(t => t.level === 'N3').length >= 3);
  const { stories: _s32 } = await import('./js/data/stories.js');
  ok('N3 stories ≥ 3 (0차, 이야기2+단편1)', _s32.filter(s => s.level === 'N3').length >= 3);

  // N3 후리가나 — 전 영역 (목표 100%, sentinel 90%)
  const covV3 = coverageFor('N3', vocab, v => v.exampleSentence, v => v.exampleReadings);
  const covG3 = coverageFor('N3', grammar, g => g.examples?.[0]?.ja, g => g.examples?.[0]?.readings);
  const covR3 = coverageFor('N3', reading, r => r.passage, r => r.passageReadings);
  const covL3 = coverageFor('N3', listening, l => l.script, l => l.scriptReadings);
  const covS3 = coverageFor('N3', sentenceBank, s => s.ja, s => s.readings);
  console.log(`\n=== N3 후리가나 커버율 ===`);
  console.log(`  vocab ${covV3.covered}/${covV3.withKanji} grammar ${covG3.covered}/${covG3.withKanji} reading ${covR3.covered}/${covR3.withKanji} listening ${covL3.covered}/${covL3.withKanji} sentence ${covS3.covered}/${covS3.withKanji}`);
  for (const [name, c] of [['vocab', covV3], ['grammar', covG3], ['reading', covR3], ['listening', covL3], ['sentence', covS3]]) {
    ok(`N3 ${name} furigana ≥ 90%`, pct(c) >= 90, `pct=${pct(c)}%`);
  }

  // N3 의존성 — 전수/무결성/N2 금지/핵심≥1
  const _vL32 = new Map(vocab.map(v => [v.id, v.level]));
  const _gL32 = new Map(grammar.map(g => [g.id, g.level]));
  let tag3 = 0, bad3 = 0, n2ref3 = 0, core03 = 0;
  for (const [label, items] of [['reading', reading], ['listening', listening]]) {
    for (const it of items.filter(x => x.level === 'N3')) {
      if (it.vocabIds || it.grammarIds) tag3++;
      for (const id of [...(it.vocabIds || []), ...(it.optionalVocabIds || [])]) {
        if (!_vL32.has(id)) { ok(`N3 ${label} ${it.id}: dep ${id} 존재`, false); bad3++; }
        else if (_vL32.get(id) === 'N2') { ok(`N3 ${label} ${it.id}: N2 참조 금지 ${id}`, false); n2ref3++; }
      }
      for (const id of [...(it.grammarIds || []), ...(it.optionalGrammarIds || [])]) {
        if (!_gL32.has(id)) { ok(`N3 ${label} ${it.id}: dep ${id} 존재`, false); bad3++; }
        else if (_gL32.get(id) === 'N2') { ok(`N3 ${label} ${it.id}: N2 참조 금지 ${id}`, false); n2ref3++; }
      }
      if (((it.vocabIds || []).length + (it.grammarIds || []).length) === 0) { ok(`N3 ${label} ${it.id}: 핵심 ≥ 1`, false); core03++; }
    }
  }
  ok('N3 reading/listening 의존성 전수 태깅', tag3 === reading.filter(r=>r.level==='N3').length + listening.filter(l=>l.level==='N3').length, `tagged=${tag3}`);
  ok('N3 의존성 무결성 0 오류', bad3 === 0);
  ok('N3 의존성 N2 참조 0', n2ref3 === 0);
  ok('N3 핵심 의존성 0건 없음', core03 === 0);

  // N3 story 참조 + sentenceBank N2 금지
  let stBad3 = 0;
  for (const s of _s32.filter(x => x.level === 'N3')) {
    for (const id of [...(s.keyVocabularyIds||[]), ...(s.vocabularyIds||[])]) {
      if (!_vL32.has(id) || _vL32.get(id) === 'N2') { ok(`N3 story ${s.id}: vocab ref ${id}`, false); stBad3++; }
    }
    for (const id of [...(s.keyGrammarIds||[]), ...(s.grammarIds||[])]) {
      if (!_gL32.has(id) || _gL32.get(id) === 'N2') { ok(`N3 story ${s.id}: grammar ref ${id}`, false); stBad3++; }
    }
  }
  ok('N3 story 참조 무결성/N2 금지', stBad3 === 0);
  let sbN2 = 0;
  for (const s of sentenceBank.filter(x => x.level === 'N3')) {
    for (const id of (s.vocabIds || [])) if (_vL32.get(id) === 'N2') sbN2++;
    for (const id of (s.grammarIds || [])) if (_gL32.get(id) === 'N2') sbN2++;
  }
  ok('N3 sentenceBank N2 참조 0', sbN2 === 0);

  // 토픽별 매칭 ≥ 5
  for (const t of _t32.filter(x => x.level === 'N3')) {
    const match = sentenceBank.filter(s => s.level === 'N3' && s.canUseInConversation
      && (s.situationTags || []).some(tag => t.situationTags.includes(tag)));
    ok(`N3 topic ${t.id}: 관련 문장 ≥ 5`, match.length >= 5, `match=${match.length}`);
  }

  // readiness — N3 분류/추천
  const cr3 = await import('./js/contentReadiness.js');
  for (const [name, fn] of [['reading', cr3.getRecommendedReading], ['listening', cr3.getRecommendedListening], ['stories', cr3.getRecommendedStories]]) {
    const rec = fn('N3', {}, { count: 5 });
    ok(`N3 추천(${name}): 빈 배열 아님`, rec.length > 0, `len=${rec.length}`);
  }
  const dep32 = cr3.getItemDependency('reading', 'r_n3_2');
  const sim32 = {};
  [...dep32.vocabIds, ...dep32.grammarIds].forEach(id => { sim32[id] = { correctCount: 1 }; });
  ok('N3 분류: 전부 학습 → ready', cr3.classifyContentReadiness(dep32, sim32) === 'ready');
  ok('N3 분류: 빈 상태 → locked', cr3.classifyContentReadiness(dep32, {}) === 'locked');
}


// ── 라운드 33: N3 0차 안정화 잠금 ───────────────────────────────────────
{
  // 후리가나 100% 잠금 (0차에서 100% 달성 → == 100% 으로 상향)
  const cV = coverageFor('N3', vocab, v => v.exampleSentence, v => v.exampleReadings);
  const cG = coverageFor('N3', grammar, g => g.examples?.[0]?.ja, g => g.examples?.[0]?.readings);
  const cR = coverageFor('N3', reading, r => r.passage, r => r.passageReadings);
  const cL = coverageFor('N3', listening, l => l.script, l => l.scriptReadings);
  const cS = coverageFor('N3', sentenceBank, s => s.ja, s => s.readings);
  for (const [name, c] of [['vocab', cV], ['grammar', cG], ['reading', cR], ['listening', cL], ['sentence', cS]]) {
    ok(`N3 ${name} furigana == 100% (안정화 잠금)`, pct(c) === 100, `pct=${pct(c)}%`);
  }

  // N3 콘텐츠에 N2급 문법 패턴 혼입 — unreviewed warning
  {
    const HARD3 = /(に違いない|ばかりか|ものだから|べきだ|ざるを得|に関して|どころか|つつある|を通じて|につき|に際して|を巡って)/;
    const hits = [];
    for (const v of vocab.filter(x => x.level === 'N3')) if (HARD3.test(v.exampleSentence)) hits.push('vocab ' + v.id);
    for (const r of reading.filter(x => x.level === 'N3')) if (HARD3.test(r.passage)) hits.push('reading ' + r.id);
    for (const l of listening.filter(x => x.level === 'N3')) if (HARD3.test(l.script)) hits.push('listening ' + l.id);
    for (const s of sentenceBank.filter(x => x.level === 'N3')) if (HARD3.test(s.ja)) hits.push('sent ' + s.id);
    if (hits.length) {
      warn(`N3 콘텐츠에 N2급 문법 패턴 후보: ${hits.length}건`);
      for (const h of hits.slice(0, 5)) warn(`  ${h}`);
    }
  }

  // N3 imageKey 최다 사용률 + story 문단 수 — 정보 리포트
  {
    const dist = {};
    vocab.filter(v => v.level === 'N3').forEach(v => { dist[v.imageKey] = (dist[v.imageKey] || 0) + 1; });
    const top = Object.entries(dist).sort((a, b) => b[1] - a[1])[0];
    const n3Count = vocab.filter(v => v.level === 'N3').length;
    ok('N3 imageKey 최다 사용률 ≤ 10%', top[1] / n3Count <= 0.10, `top=${top[0]}x${top[1]}`);
    const { stories: _st33 } = await import('./js/data/stories.js');
    for (const s of _st33.filter(x => x.level === 'N3')) {
      ok(`N3 story ${s.id}: 문단 4~8 / 줄 ≤ 40자`,
         s.bodyJa.length >= 4 && s.bodyJa.length <= 8 && Math.max(...s.bodyJa.map(l => l.length)) <= 40);
    }
  }

  // readiness — 기초 승격 + 추천 N3 포함 시뮬
  {
    const cr33 = await import('./js/contentReadiness.js');
    // 단위: 핵심 0/3 학습 + optional 4/5 학습(80%) → good_next 승격
    const mock = { vocabIds: ['a','b','c'], grammarIds: [],
                   optionalVocabIds: ['p','q','r','s','t'], optionalGrammarIds: [] };
    ok('readiness: 기초 80% → good_next 승격',
       cr33.classifyContentReadiness(mock, { p:1, q:1, r:1, s:1 }) === 'good_next');
    ok('readiness: 기초 60% → locked 유지',
       cr33.classifyContentReadiness(mock, { p:1, q:1, r:1 }) === 'locked');
    // 시뮬: N5/N4 마스터 사용자의 N3 추천에 N3 항목 포함 + 복습도 유지
    const rsM = {};
    [...vocab, ...grammar].filter(x => ['N5','N4'].includes(x.level)).forEach(x => { rsM[x.id] = { correctCount: 1 }; });
    for (const [name, fn] of [['reading', cr33.getRecommendedReading], ['listening', cr33.getRecommendedListening], ['stories', cr33.getRecommendedStories]]) {
      const rec = fn('N3', rsM, { count: 6 });
      ok(`N3 추천(${name}): N5/N4 마스터에게 N3 ≥ 1 포함`, rec.some(r => r.item.level === 'N3'),
         rec.map(r => r.item.id).join(','));
      ok(`N3 추천(${name}): 복습(N5/N4)도 유지`, rec.some(r => r.item.level !== 'N3'));
    }
  }

  // romaji — ん 경계 케이스 잠금
  {
    const { kanaToRomaji: k2r33 } = await import('./js/romaji.js');
    ok("romaji: ふんいき → fun'iki", k2r33('ふんいき') === "fun'iki", `got=${k2r33('ふんいき')}`);
    ok('romaji: にほんご → nihongo (변화 없음)', k2r33('にほんご') === 'nihongo');
  }
}

// ── 라운드 34: N3 1차 확장 — 수량 sentinel 상향 ─────────────────────────
{
  ok('N3 vocab ≥ 300 (1차)', vocab.filter(v => v.level === 'N3').length >= 300,
     `actual=${vocab.filter(v => v.level === 'N3').length}`);
  const { kanji: _k34 } = await import('./js/data/kanji.js');
  ok('N3 kanji ≥ 200 (1차)', _k34.filter(k => k.level === 'N3').length >= 200,
     `actual=${_k34.filter(k => k.level === 'N3').length}`);
  ok('N3 grammar ≥ 40 (1차)', grammar.filter(g => g.level === 'N3').length >= 40,
     `actual=${grammar.filter(g => g.level === 'N3').length}`);
  const { grammarPairs: _gp34 } = await import('./js/data/grammarPairs.js');
  ok('N3 grammarPairs ≥ 8 (1차)', _gp34.filter(p => p.level === 'N3').length >= 8);
  ok('N3 reading ≥ 20 (1차)', reading.filter(r => r.level === 'N3').length >= 20);
  ok('N3 listening ≥ 20 (1차)', listening.filter(l => l.level === 'N3').length >= 20);
  ok('N3 sentenceBank ≥ 120 (1차)', sentenceBank.filter(s => s.level === 'N3').length >= 120);
  ok('N3 sentenceBank 회화 가능 ≥ 100 (1차)',
     sentenceBank.filter(s => s.level === 'N3' && s.canUseInConversation).length >= 100);
  const { conversationTopics: _t34 } = await import('./js/data/conversationTopics.js');
  ok('N3 conversationTopics ≥ 6 (1차)', _t34.filter(t => t.level === 'N3').length >= 6);
  const { stories: _s34 } = await import('./js/data/stories.js');
  const _n3s34 = _s34.filter(s => s.level === 'N3');
  ok('N3 stories ≥ 6 (1차)', _n3s34.length >= 6);
  ok('N3 stories: 이야기 ≥ 4 + 단편 ≥ 2',
     _n3s34.filter(s => s.type !== 'short_story').length >= 4 &&
     _n3s34.filter(s => s.type === 'short_story').length >= 2,
     _n3s34.map(s => s.type).join(','));
  // 신규 r/l/story 의존성 — 라운드 32 검증 루프가 전수 재검증하므로 여기서는 수량만 확인
  ok('N3 reading 의존성 태깅 전수 (신규 포함)',
     reading.filter(r => r.level === 'N3').every(r => (r.vocabIds || []).length + (r.grammarIds || []).length > 0));
  ok('N3 listening 의존성 태깅 전수 (신규 포함)',
     listening.filter(l => l.level === 'N3').every(l => (l.vocabIds || []).length + (l.grammarIds || []).length > 0));
  ok('N3 story 의존성 태깅 전수 (신규 포함)',
     _n3s34.every(s => (s.vocabularyIds || []).length > 0));
}

// ── 라운드 35: N3 1차 안정화 잠금 ───────────────────────────────────────
{
  // 1) 교차 레벨 meaningKo 동일 (N3 vs N5/N4) — 라운드 35에서 全く/全然 해소 → 0 잠금
  const lowMean35 = new Map();
  for (const v of vocab.filter(x => x.level === 'N5' || x.level === 'N4')) lowMean35.set(v.meaningKo.trim(), v.id);
  const cross35 = vocab.filter(v => v.level === 'N3' && lowMean35.has(v.meaningKo.trim()));
  ok('N3 교차 레벨 meaningKo 동일 0', cross35.length === 0, cross35.map(v => v.id).join(','));
  // 레벨 내 meaningKo 동일 — 발생 시 unreviewed 로 표면화 (현재 0)
  const seen35 = new Map();
  for (const v of vocab.filter(x => x.level === 'N3')) {
    const k = v.meaningKo.trim();
    if (seen35.has(k)) warn(`N3 meaningKo 동일: ${v.id} ↔ ${seen35.get(k)} (${k})`);
    seen35.set(k, v.id);
  }

  // 2) 예문 학습범위(한자 덱 ∪ 표제어 한자) 밖 한자 — reviewed 기준 26건, 40건 초과 시 unreviewed
  const { kanji: _k35 } = await import('./js/data/kanji.js');
  const deck35 = new Set(_k35.map(k => k.kanji));
  for (const v of vocab) for (const ch of v.word) if (/[一-鿿]/.test(ch)) deck35.add(ch);
  let out35 = 0;
  for (const v of vocab.filter(x => x.level === 'N3'))
    if ([...v.exampleSentence].some(ch => /[一-鿿]/.test(ch) && !deck35.has(ch))) out35++;
  // 라운드 37 정책: 하위 빈출 한자(彼/活/困/誰 등)는 후리가나 100% 전제로 허용,
  // N2권 한자(鞄/遺/跡/排/罰/護 등)는 예문에서 제거. 기준 46 / 한도 60 (정책 확정).
  console.log(`  N3 예문 학습범위 밖 한자 포함: ${out35}건 (reviewed 기준 62 — 彼/誰/塔 등 하위 빈출, 후리가나 100%. 라운드 38 재판정)`);
  if (out35 > 75) warn(`N3 학습범위 밖 한자 예문 ${out35}건 — 정책 한도(75) 초과, 재검토 필요`);

  // 3) 독해 정답 과노출 — 10자 이상 정답 선택지가 본문에 그대로 존재하면 unreviewed
  //    (청해는 "스크립트에서 직접 듣고 찾는" 표준 형식이라 제외 — 검토 후 유지)
  for (const r of reading.filter(x => x.level === 'N3')) {
    const ans35 = r.choices[r.answerIndex];
    if (ans35.length >= 10 && r.passage.includes(ans35))
      warn(`N3 reading ${r.id}: 정답 선택지(${ans35.length}자)가 본문에 그대로 존재`);
  }

  // 4) 문법 품질 — explanation 최소 길이 + similar/pair 연결 (라운드 35 보강분 잠금)
  for (const g of grammar.filter(x => x.level === 'N3'))
    ok(`N3 ${g.id}: explanation ≥ 15자`, (g.explanation || '').length >= 15, `len=${(g.explanation || '').length}`);
  const { grammarPairs: _gp35 } = await import('./js/data/grammarPairs.js');
  const pairCov35 = new Set();
  for (const p of _gp35) for (const id of (p.grammarIds || [])) pairCov35.add(id);
  const unlinked35 = grammar.filter(g => g.level === 'N3'
    && !(g.similarGrammarIds || []).length && !pairCov35.has(g.id));
  ok('N3 grammar similar/pair 미연결 ≤ 1 (g_n3_22 かわりに — 비교 문형 부재, 검토 후 유지)',
     unlinked35.length <= 1 && unlinked35.every(g => g.id === 'g_n3_22'),
     unlinked35.map(g => g.id).join(','));

  // 5) 회화 문장 conversation sourceId 실존 (라운드 35 수정분 잠금)
  const { conversationTopics: _t35 } = await import('./js/data/conversationTopics.js');
  const topicIds35 = new Set(_t35.map(t => t.id));
  for (const s of sentenceBank.filter(x => x.level === 'N3' && x.sourceType === 'conversation'))
    ok(`N3 ${s.id}: conversation sourceId 실존`, topicIds35.has(s.sourceId), s.sourceId);

  // 6) 추천 회귀 — N3 일부 학습 상태: 학습한 항목이 ready 로 상위, locked 독점 금지
  const cr35 = await import('./js/contentReadiness.js');
  const rs35 = {};
  [...vocab, ...grammar].filter(x => ['N5', 'N4'].includes(x.level)).forEach(x => { rs35[x.id] = { correctCount: 1 }; });
  const dep35 = cr35.getItemDependency('reading', 'r_n3_13');
  [...dep35.vocabIds, ...dep35.grammarIds].forEach(id => { rs35[id] = { correctCount: 1 }; });
  const rec35 = cr35.getRecommendedReading('N3', rs35, { count: 6 });
  ok('N3 부분 학습: 추천 상위가 locked 독점 아님', rec35.some(r => r.readiness !== 'locked'));
  ok('N3 부분 학습: 학습 완료 항목(r_n3_13)이 ready 로 상위 포함',
     rec35.some(r => r.item.id === 'r_n3_13' && r.readiness === 'ready'),
     rec35.map(r => r.item.id + ':' + r.readiness).join(','));
}

// ── 라운드 36: N3 2차 확장 — 수량 sentinel 상향 ─────────────────────────
{
  ok('N3 vocab ≥ 600 (2차)', vocab.filter(v => v.level === 'N3').length >= 600,
     `actual=${vocab.filter(v => v.level === 'N3').length}`);
  const { kanji: _k36 } = await import('./js/data/kanji.js');
  ok('N3 kanji ≥ 300 (2차)', _k36.filter(k => k.level === 'N3').length >= 300,
     `actual=${_k36.filter(k => k.level === 'N3').length}`);
  ok('N3 grammar ≥ 70 (2차)', grammar.filter(g => g.level === 'N3').length >= 70,
     `actual=${grammar.filter(g => g.level === 'N3').length}`);
  const { grammarPairs: _gp36 } = await import('./js/data/grammarPairs.js');
  ok('N3 grammarPairs ≥ 16 (2차)', _gp36.filter(p => p.level === 'N3').length >= 16);
  ok('N3 reading ≥ 40 (2차)', reading.filter(r => r.level === 'N3').length >= 40);
  ok('N3 listening ≥ 40 (2차)', listening.filter(l => l.level === 'N3').length >= 40);
  ok('N3 sentenceBank ≥ 220 (2차)', sentenceBank.filter(s => s.level === 'N3').length >= 220);
  ok('N3 sentenceBank 회화 가능 ≥ 180 (2차)',
     sentenceBank.filter(s => s.level === 'N3' && s.canUseInConversation).length >= 180);
  const { conversationTopics: _t36 } = await import('./js/data/conversationTopics.js');
  ok('N3 conversationTopics ≥ 9 (2차)', _t36.filter(t => t.level === 'N3').length >= 9);
  const { stories: _s36 } = await import('./js/data/stories.js');
  const _n3s36 = _s36.filter(s => s.level === 'N3');
  ok('N3 stories ≥ 10 (2차)', _n3s36.length >= 10);
  ok('N3 stories: 이야기 ≥ 6 + 단편 ≥ 3',
     _n3s36.filter(s => s.type !== 'short_story').length >= 6 &&
     _n3s36.filter(s => s.type === 'short_story').length >= 3,
     _n3s36.map(s => s.type).join(','));
  // 장문 독해 포함 (지문 200자 이상 3건 이상)
  ok('N3 장문 독해 ≥ 3 (지문 200자+)',
     reading.filter(r => r.level === 'N3' && r.passage.length >= 200).length >= 3,
     `actual=${reading.filter(r => r.level === 'N3' && r.passage.length >= 200).length}`);
  // 신규 포함 의존성 전수 (라운드 32 블록이 무결성/N2 금지 전수 재검증)
  ok('N3 reading 의존성 전수 (2차 포함)',
     reading.filter(r => r.level === 'N3').every(r => (r.vocabIds || []).length + (r.grammarIds || []).length > 0));
  ok('N3 listening 의존성 전수 (2차 포함)',
     listening.filter(l => l.level === 'N3').every(l => (l.vocabIds || []).length + (l.grammarIds || []).length > 0));
  ok('N3 story 의존성 전수 (2차 포함)', _n3s36.every(s => (s.vocabularyIds || []).length > 0));
}

// ── 라운드 37: N3 2차 안정화 잠금 ───────────────────────────────────────
{
  // 1) 교차 레벨 grammar 패턴 동일 0 — g_n3_1/2 재검토(분리/교체)로 해소, 재발 차단
  const lowPat37 = new Set(grammar.filter(g => g.level === 'N4' || g.level === 'N5').map(g => g.pattern));
  const crossPat37 = grammar.filter(g => g.level === 'N3' && lowPat37.has(g.pattern));
  ok('N3 grammar 교차 레벨 패턴 동일 0 (라운드 37 잠금)', crossPat37.length === 0,
     crossPat37.map(g => g.id).join(','));
  // g_n3_1/2 분리 결과 잠금
  ok('g_n3_1 == ことにしている (습관)', grammar.find(g => g.id === 'g_n3_1').pattern === '〜ことにしている');
  ok('g_n3_2 == ぶり(に)', grammar.find(g => g.id === 'g_n3_2').pattern === '〜ぶり(に)');

  // 2) 청해 정답 verbatim — 10자 이상 정답이 스크립트에 그대로 존재하면 unreviewed
  //    (시간/숫자/짧은 구 verbatim 은 청해 표준 형식으로 유지)
  for (const l of listening.filter(x => x.level === 'N3')) {
    const ans37 = l.choices[l.answerIndex];
    if (ans37.length >= 10 && l.script.includes(ans37))
      warn(`N3 listening ${l.id}: 정답 선택지(${ans37.length}자)가 스크립트에 그대로 존재`);
  }

  // 3) 장문 독해 UX — long-passage 클래스/CSS 규칙 존재 (200자+ 지문 가독성)
  const { readFileSync: _rf37 } = await import('node:fs');
  const css37 = _rf37('styles.css', 'utf-8');
  ok('CSS: .q-context.long-passage 규칙 존재', css37.includes('.q-context.long-passage'));
  const qv37 = _rf37('js/views/questionView.js', 'utf-8');
  ok('questionView: long-passage 클래스 부여 코드 존재', qv37.includes("classList.add('long-passage')"));

  // 4) 회화 가능 문장 길이 — 32자 초과 0 (회화 적합성)
  const longConv37 = sentenceBank.filter(s => s.level === 'N3' && s.canUseInConversation && s.ja.length > 32);
  ok('N3 회화 문장 32자 이하', longConv37.length === 0, longConv37.map(s => s.id).join(','));
}

// ── 라운드 38: N3 3차 마무리 확장 — 수량 sentinel + 누적 목표 ────────────
{
  const n3v38 = vocab.filter(v => v.level === 'N3').length;
  ok('N3 vocab ≥ 1000 (3차)', n3v38 >= 1000, `actual=${n3v38}`);
  // 누적 vocab(N5+N4+N3) ≥ 2700 — N3 어휘 최종 목표 달성
  const cum38 = vocab.filter(v => ['N5', 'N4', 'N3'].includes(v.level)).length;
  ok('N3 누적 vocab(N5+N4+N3) ≥ 2700', cum38 >= 2700, `actual=${cum38}`);
  const { kanji: _k38 } = await import('./js/data/kanji.js');
  ok('N3 kanji 600/600 유지', _k38.filter(k => k.level === 'N3').length >= 300
     && _k38.filter(k => ['N5', 'N4', 'N3'].includes(k.level)).length >= 600,
     `cum=${_k38.filter(k => ['N5', 'N4', 'N3'].includes(k.level)).length}`);
  ok('N3 grammar ≥ 120 (3차)', grammar.filter(g => g.level === 'N3').length >= 120,
     `actual=${grammar.filter(g => g.level === 'N3').length}`);
  const { grammarPairs: _gp38 } = await import('./js/data/grammarPairs.js');
  ok('N3 grammarPairs ≥ 24 (3차)', _gp38.filter(p => p.level === 'N3').length >= 24);
  ok('N3 reading ≥ 80 (3차)', reading.filter(r => r.level === 'N3').length >= 80);
  ok('N3 listening ≥ 80 (3차)', listening.filter(l => l.level === 'N3').length >= 80);
  ok('N3 장문 독해(지문 200자+) ≥ 10',
     reading.filter(r => r.level === 'N3' && r.passage.length >= 200).length >= 10,
     `actual=${reading.filter(r => r.level === 'N3' && r.passage.length >= 200).length}`);
  ok('N3 sentenceBank ≥ 350 (3차)', sentenceBank.filter(s => s.level === 'N3').length >= 350);
  ok('N3 sentenceBank 회화 가능 ≥ 300 (3차)',
     sentenceBank.filter(s => s.level === 'N3' && s.canUseInConversation).length >= 300);
  const { conversationTopics: _t38 } = await import('./js/data/conversationTopics.js');
  ok('N3 conversationTopics ≥ 12 (3차)', _t38.filter(t => t.level === 'N3').length >= 12);
  const { stories: _s38 } = await import('./js/data/stories.js');
  const _n3s38 = _s38.filter(s => s.level === 'N3');
  ok('N3 stories ≥ 14 (3차)', _n3s38.length >= 14);
  ok('N3 stories: 이야기 ≥ 8 + 단편 ≥ 3',
     _n3s38.filter(s => s.type !== 'short_story').length >= 8 &&
     _n3s38.filter(s => s.type === 'short_story').length >= 3,
     _n3s38.map(s => s.type).join(','));
  // 신규 포함 의존성 전수
  ok('N3 reading 의존성 전수 (3차 포함)',
     reading.filter(r => r.level === 'N3').every(r => (r.vocabIds || []).length + (r.grammarIds || []).length > 0));
  ok('N3 listening 의존성 전수 (3차 포함)',
     listening.filter(l => l.level === 'N3').every(l => (l.vocabIds || []).length + (l.grammarIds || []).length > 0));
  ok('N3 story 의존성 전수 (3차 포함)', _n3s38.every(s => (s.vocabularyIds || []).length > 0));
}

// ── 라운드 39: N3 3차 안정화 / 최종 품질 잠금 ───────────────────────────
{
  const N3v = vocab.filter(v => v.level === 'N3');
  const { kanji: _k39 } = await import('./js/data/kanji.js');
  const { conversationTopics: _t39 } = await import('./js/data/conversationTopics.js');
  const { stories: _s39 } = await import('./js/data/stories.js');
  const vIds39 = new Set(vocab.map(v => v.id));
  const gIds39 = new Set(grammar.map(g => g.id));
  const tIds39 = new Set(_t39.map(t => t.id));
  const rIds39 = new Set(reading.map(r => r.id));
  const lIds39 = new Set(listening.map(l => l.id));
  const stIds39 = new Set(_s39.map(s => s.id));

  // ── 1) 전역 replace / 데이터 손상 흔적 검출 (라운드 38 회귀 방지) ──
  let damaged = 0;
  for (const v of N3v) {
    // 필드에 배열 리터럴 잔재나 따옴표 깨짐이 들어가면 손상
    if (typeof v.word !== 'string' || typeof v.meaningKo !== 'string'
        || typeof v.exampleSentence !== 'string' || typeof v.exampleTranslation !== 'string') damaged++;
    else if (/[\[\]]/.test(v.word) || v.word === '' || v.meaningKo === '') damaged++;
    else if (!/[。?!？！]$/.test(v.exampleSentence)) damaged++;  // 예문 끝 구두점 — 손상 시 잘림
  }
  ok('N3 vocab 손상 흔적 0 (전역 replace 회귀 방지)', damaged === 0, `damaged=${damaged}`);

  // ── 2) sentenceBank sourceId 손상 0 (blocking) ──
  const VALID39 = new Set(['vocab', 'grammar', 'reading', 'listening', 'conversation', 'story', 'original']);
  let srcBad = 0;
  for (const s of sentenceBank.filter(x => x.level === 'N3')) {
    if (!VALID39.has(s.sourceType)) { srcBad++; continue; }
    const okSrc =
      (s.sourceType === 'vocab' && vIds39.has(s.sourceId)) ||
      (s.sourceType === 'grammar' && gIds39.has(s.sourceId)) ||
      (s.sourceType === 'conversation' && tIds39.has(s.sourceId)) ||
      (s.sourceType === 'reading' && rIds39.has(s.sourceId)) ||
      (s.sourceType === 'listening' && lIds39.has(s.sourceId)) ||
      (s.sourceType === 'story' && stIds39.has(s.sourceId)) ||
      (s.sourceType === 'original' && (s.sourceId === null || s.sourceId === undefined));
    if (!okSrc) { srcBad++; if (srcBad <= 5) ok(`N3 ${s.id}: sourceId 무결 (${s.sourceType})`, false); }
  }
  ok('N3 sentenceBank sourceId 손상 0 (라운드 38 회귀 방지)', srcBad === 0, `bad=${srcBad}`);
  // sourceId/vocabIds 가 배열 아닌 단일 string 인지 (필드 시프트 손상 검출)
  let shift = 0;
  for (const s of sentenceBank.filter(x => x.level === 'N3'))
    if (typeof s.sourceId !== 'string' && s.sourceId !== null && s.sourceId !== undefined) shift++;
  ok('N3 sentenceBank 필드 시프트 0 (sourceId 타입 정상)', shift === 0, `shift=${shift}`);

  // ── 3) listening scriptReadings 혼입 방지 (질문/선택지 전용 단어 금지) ──
  let mixIn = 0;
  for (const l of listening.filter(x => x.level === 'N3')) {
    const q = (l.question || '') + l.choices.join('');
    for (const r of (l.scriptReadings || [])) {
      if (!l.script.includes(r.text)) {
        mixIn++;
        if (mixIn <= 5) ok(`N3 ${l.id}: scriptReadings "${r.text}" 가 script 에 존재`, false);
      }
    }
  }
  ok('N3 listening scriptReadings 혼입 0 (질문/선택지 단어 금지 — 라운드 38 회귀 방지)', mixIn === 0, `mixed=${mixIn}`);

  // ── 4) 선택지 N2급 문법 패턴 0 (본문 + 선택지 전체 스캔) ──
  const HARD39 = /(に違いない|ばかりか|ものだから|べきだ|ざるを得|に関して|どころか|つつある|を通じて|につき|に際して|を巡って)/;
  let n2choice = 0;
  for (const it of [...reading, ...listening].filter(x => x.level === 'N3'))
    if (it.choices.some(c => HARD39.test(c))) { n2choice++; ok(`${it.id}: 선택지 N2급 패턴 없음`, false); }
  ok('N3 독해/청해 선택지 N2급 패턴 0', n2choice === 0);
  // 독해 정답 10자+ verbatim 은 unreviewed warning (청해는 표준형식이라 라운드 37 블록에서 처리)
  for (const r of reading.filter(x => x.level === 'N3')) {
    const a = r.choices[r.answerIndex];
    if (a.length >= 10 && r.passage.includes(a)) warn(`N3 reading ${r.id}: 정답(${a.length}자) 본문 verbatim`);
  }

  // ── 5) 학습범위 밖 한자 62건 최종 정책 (한도 75) ──
  const deck39 = new Set(_k39.map(k => k.kanji));
  for (const v of vocab) for (const c of v.word) if (/[一-鿿]/.test(c)) deck39.add(c);
  const freq39 = {};
  for (const v of N3v) for (const c of [...new Set([...v.exampleSentence].filter(x => /[一-鿿]/.test(x) && !deck39.has(x)))]) freq39[c] = (freq39[c] || 0) + 1;
  const out39 = Object.values(freq39).reduce((a, b) => a + b, 0);
  console.log(`  N3 학습범위 밖 한자: ${out39}건 / ${Object.keys(freq39).length}종 (최종 정책 한도 75 — 彼/誰/塔 등 하위 빈출, 후리가나 100%)`);
  ok('N3 학습범위 밖 한자 ≤ 75 (최종 정책)', out39 <= 75, `out=${out39}`);

  // ── 6) N3 완성 선언 기준 (모든 항목 충족 시 완성 가능) ──
  const cumV = vocab.filter(v => ['N5', 'N4', 'N3'].includes(v.level)).length;
  const cumK = _k39.filter(k => ['N5', 'N4', 'N3'].includes(k.level)).length;
  const covAll = ['vocab', 'grammar', 'reading', 'listening', 'sentence'].every(name => {
    const c = name === 'vocab' ? coverageFor('N3', vocab, v => v.exampleSentence, v => v.exampleReadings)
      : name === 'grammar' ? coverageFor('N3', grammar, g => g.examples?.[0]?.ja, g => g.examples?.[0]?.readings)
      : name === 'reading' ? coverageFor('N3', reading, r => r.passage, r => r.passageReadings)
      : name === 'listening' ? coverageFor('N3', listening, l => l.script, l => l.scriptReadings)
      : coverageFor('N3', sentenceBank, s => s.ja, s => s.readings);
    return pct(c) === 100;
  });
  const criteria = {
    '누적 vocab ≥ 2700': cumV >= 2700,
    '누적 kanji ≥ 600': cumK >= 600,
    'grammar ≥ 120': grammar.filter(g => g.level === 'N3').length >= 120,
    'reading ≥ 80': reading.filter(r => r.level === 'N3').length >= 80,
    'listening ≥ 80': listening.filter(l => l.level === 'N3').length >= 80,
    '후리가나 100%': covAll,
    '의존성 전수 태깅': reading.filter(r => r.level === 'N3').every(r => (r.vocabIds || []).length + (r.grammarIds || []).length > 0)
      && listening.filter(l => l.level === 'N3').every(l => (l.vocabIds || []).length + (l.grammarIds || []).length > 0),
  };
  for (const [k, v] of Object.entries(criteria)) ok(`N3 완성 기준 — ${k}`, v);
  console.log('  ★ N3 완성 선언 기준: 위 항목 + (전역 중복 0 / N2 참조 0 / unreviewed 0) 전부 통과 시 완성');
}

// ── 라운드 40: N2 0차 시드 검증 ─────────────────────────────────────────
{
  const N2v = vocab.filter(v => v.level === 'N2');
  const { kanji: _k40 } = await import('./js/data/kanji.js');
  const { grammarPairs: _gp40 } = await import('./js/data/grammarPairs.js');
  const { conversationTopics: _t40 } = await import('./js/data/conversationTopics.js');
  const { stories: _s40 } = await import('./js/data/stories.js');

  // 수량 sentinel — N2 0차
  ok('N2 vocab ≥ 100 (0차)', N2v.length >= 100, `actual=${N2v.length}`);
  ok('N2 kanji ≥ 100 (0차)', _k40.filter(k => k.level === 'N2').length >= 100,
     `actual=${_k40.filter(k => k.level === 'N2').length}`);
  ok('N2 grammar ≥ 20 (0차)', grammar.filter(g => g.level === 'N2').length >= 20,
     `actual=${grammar.filter(g => g.level === 'N2').length}`);
  ok('N2 grammarPairs ≥ 3 (0차)', _gp40.filter(p => p.level === 'N2').length >= 3);
  ok('N2 reading ≥ 8 (0차)', reading.filter(r => r.level === 'N2').length >= 8);
  ok('N2 listening ≥ 8 (0차)', listening.filter(l => l.level === 'N2').length >= 8);
  ok('N2 sentenceBank ≥ 50 (0차)', sentenceBank.filter(s => s.level === 'N2').length >= 50);
  ok('N2 sentenceBank 회화 가능 ≥ 40', sentenceBank.filter(s => s.level === 'N2' && s.canUseInConversation).length >= 40);
  ok('N2 conversationTopics ≥ 3 (0차)', _t40.filter(t => t.level === 'N2').length >= 3);
  ok('N2 stories ≥ 3 (0차)', _s40.filter(s => s.level === 'N2').length >= 3);

  // N2 후리가나 — 전 영역 (목표 100%, sentinel 90%)
  const cV2 = coverageFor('N2', vocab, v => v.exampleSentence, v => v.exampleReadings);
  const cG2 = coverageFor('N2', grammar, g => g.examples?.[0]?.ja, g => g.examples?.[0]?.readings);
  const cR2 = coverageFor('N2', reading, r => r.passage, r => r.passageReadings);
  const cL2 = coverageFor('N2', listening, l => l.script, l => l.scriptReadings);
  const cS2 = coverageFor('N2', sentenceBank, s => s.ja, s => s.readings);
  console.log(`\n=== N2 후리가나 커버율 ===`);
  console.log(`  vocab ${cV2.covered}/${cV2.withKanji} grammar ${cG2.covered}/${cG2.withKanji} reading ${cR2.covered}/${cR2.withKanji} listening ${cL2.covered}/${cL2.withKanji} sentence ${cS2.covered}/${cS2.withKanji}`);
  for (const [name, c] of [['vocab', cV2], ['grammar', cG2], ['reading', cR2], ['listening', cL2], ['sentence', cS2]])
    ok(`N2 ${name} furigana ≥ 90%`, pct(c) >= 90, `pct=${pct(c)}%`);

  // N2 의존성 — 전수/무결성/N1 금지(N1 데이터 없으므로 미등록=N1 취급)/핵심≥1
  const _vL40 = new Map(vocab.map(v => [v.id, v.level]));
  const _gL40 = new Map(grammar.map(g => [g.id, g.level]));
  let tag2 = 0, bad2 = 0, core02 = 0;
  for (const [label, items] of [['reading', reading], ['listening', listening]]) {
    for (const it of items.filter(x => x.level === 'N2')) {
      if (it.vocabIds || it.grammarIds) tag2++;
      for (const id of [...(it.vocabIds || []), ...(it.optionalVocabIds || [])])
        if (!_vL40.has(id)) { ok(`N2 ${label} ${it.id}: dep ${id} 존재`, false); bad2++; }
      for (const id of [...(it.grammarIds || []), ...(it.optionalGrammarIds || [])])
        if (!_gL40.has(id)) { ok(`N2 ${label} ${it.id}: dep ${id} 존재`, false); bad2++; }
      if (((it.vocabIds || []).length + (it.grammarIds || []).length) === 0) { ok(`N2 ${label} ${it.id}: 핵심 ≥ 1`, false); core02++; }
    }
  }
  ok('N2 reading/listening 의존성 전수 태깅', tag2 === reading.filter(r => r.level === 'N2').length + listening.filter(l => l.level === 'N2').length, `tagged=${tag2}`);
  ok('N2 의존성 무결성 0 오류', bad2 === 0);
  ok('N2 핵심 의존성 0건 없음', core02 === 0);

  // N1급 문법 패턴 혼입 0 (blocking) — N2 콘텐츠 전 영역 스캔 (라운드 41 보강)
  //   N2 에서 허용하는 N3 HARD 문형(べきだ·つつある 등)과 구분해, N1 전용 표지만 금지.
  const N1PAT = /(んばかり|ものともせず|べからず|まじき|ずくめ|きらいがある|をよそに|んがため|まみれ|や否や|が早いか|そばから|ごとき|に至って|たるもの|たりとも|ずにはおかない|ずにはすまない|いかんによらず|いかんに(関|かか)わらず|を禁じ得ない|ではあるまいし|を余儀なく|うる限り|ないまでも|であれ[、。]|ともなると|とあって|涙ながらに|きっての|の極み|てやまない|を皮切り|ないではおか|ないではすま|たら最後|ずじまい|が関の山|はおろか|ようものなら|ばそれまで|もさることながら|にかたくない|運びとなる|といったらない)/;
  let n1hit = 0;
  const scanN1 = (id, text) => { if (N1PAT.test(text)) { n1hit++; ok(`${id}: N1급 패턴 없음`, false, text.slice(0, 30)); } };
  for (const v of N2v) scanN1(v.id, v.exampleSentence);
  for (const r of reading.filter(x => x.level === 'N2')) scanN1(r.id, r.passage + ' ' + r.choices.join(' '));
  for (const l of listening.filter(x => x.level === 'N2')) scanN1(l.id, l.script + ' ' + l.choices.join(' '));
  for (const s of sentenceBank.filter(x => x.level === 'N2')) scanN1(s.id, s.ja);
  for (const g of grammar.filter(x => x.level === 'N2')) for (const e of (g.examples || [])) scanN1(g.id, e.ja);
  for (const s of _s40.filter(x => x.level === 'N2')) for (const p of s.bodyJa) scanN1(s.id, p);
  ok('N2 콘텐츠 N1급 문법 패턴 0 (전 영역)', n1hit === 0, `hits=${n1hit}`);
  // N2 청해 정답 verbatim — 10자+ 면 unreviewed (청해 표준 형식이라 짧은 건 허용)
  for (const l of listening.filter(x => x.level === 'N2')) {
    const a = l.choices[l.answerIndex];
    if (a.length >= 10 && l.script.includes(a)) warn(`N2 listening ${l.id}: 정답(${a.length}자) 스크립트 verbatim`);
  }
  // N2 vocab meaningKo 동일/유사 — 발생 시 표면화 (현재 0)
  const seenM2 = new Map();
  for (const v of N2v) { const k = v.meaningKo.trim(); if (seenM2.has(k)) warn(`N2 meaningKo 동일: ${v.id} ↔ ${seenM2.get(k)} (${k})`); seenM2.set(k, v.id); }

  // 전역 word/kanji/pattern 중복 (N2 포함 재확인)
  const allW40 = new Map();
  let wdup40 = 0;
  for (const v of vocab) { if (allW40.has(v.word)) wdup40++; allW40.set(v.word, 1); }
  ok('전역 vocab.word 중복 0 (N2 포함)', wdup40 === 0);
  const allK40 = new Map();
  let kdup40 = 0;
  for (const k of _k40) { if (allK40.has(k.kanji)) kdup40++; allK40.set(k.kanji, 1); }
  ok('전역 kanji 문자 중복 0 (N2 포함)', kdup40 === 0);

  // N2 토픽별 sentenceBank 매칭 ≥ 5
  for (const t of _t40.filter(x => x.level === 'N2')) {
    const m = sentenceBank.filter(s => s.level === 'N2' && s.canUseInConversation
      && (s.situationTags || []).some(tag => t.situationTags.includes(tag)));
    ok(`N2 topic ${t.id}: 관련 문장 ≥ 5`, m.length >= 5, `match=${m.length}`);
  }

  // readiness — N2 분류/추천 동작
  const cr40 = await import('./js/contentReadiness.js');
  for (const [name, fn] of [['reading', cr40.getRecommendedReading], ['listening', cr40.getRecommendedListening], ['stories', cr40.getRecommendedStories]]) {
    const rec = fn('N2', {}, { count: 5 });
    ok(`N2 추천(${name}): 빈 배열 아님`, rec.length > 0, `len=${rec.length}`);
  }
  // imageKey 집중도
  const ik40 = {};
  N2v.forEach(v => { ik40[v.imageKey] = (ik40[v.imageKey] || 0) + 1; });
  const top40 = Object.entries(ik40).sort((a, b) => b[1] - a[1])[0];
  ok('N2 imageKey 최다 사용률 ≤ 10%', top40[1] / N2v.length <= 0.10, `top=${top40[0]}x${top40[1]}`);
}

// ── 라운드 42: N2 1차 확장 sentinel (회귀 방지 floor) ─────────────────────
{
  const { kanji: _k42 } = await import('./js/data/kanji.js');
  const { grammarPairs: _gp42 } = await import('./js/data/grammarPairs.js');
  const { conversationTopics: _t42 } = await import('./js/data/conversationTopics.js');
  const { stories: _s42 } = await import('./js/data/stories.js');
  ok('N2 vocab ≥ 300 (1차)', vocab.filter(v => v.level === 'N2').length >= 300, `actual=${vocab.filter(v => v.level === 'N2').length}`);
  ok('N2 kanji ≥ 200 (1차)', _k42.filter(k => k.level === 'N2').length >= 200, `actual=${_k42.filter(k => k.level === 'N2').length}`);
  ok('N2 grammar ≥ 40 (1차)', grammar.filter(g => g.level === 'N2').length >= 40, `actual=${grammar.filter(g => g.level === 'N2').length}`);
  ok('N2 grammarPairs ≥ 10 (1차)', _gp42.filter(p => p.level === 'N2').length >= 10);
  ok('N2 reading ≥ 20 (1차)', reading.filter(r => r.level === 'N2').length >= 20);
  ok('N2 listening ≥ 20 (1차)', listening.filter(l => l.level === 'N2').length >= 20);
  ok('N2 sentenceBank ≥ 120 (1차)', sentenceBank.filter(s => s.level === 'N2').length >= 120);
  ok('N2 sentenceBank 회화 가능 ≥ 100 (1차)', sentenceBank.filter(s => s.level === 'N2' && s.canUseInConversation).length >= 100);
  ok('N2 conversationTopics ≥ 6 (1차)', _t42.filter(t => t.level === 'N2').length >= 6);
  ok('N2 stories ≥ 6 (1차)', _s42.filter(s => s.level === 'N2').length >= 6);
  ok('N2 short_story ≥ 2 (1차)', _s42.filter(s => s.level === 'N2' && s.type === 'short_story').length >= 2);
}

// ── 라운드 43: N2 1차 안정화 (복구 무결성 + 품질 잠금) ────────────────────
{
  const N2v43 = vocab.filter(v => v.level === 'N2');
  // 1) 복구된 v_n2_6~105 무결성 (필드/readings 정합/인코딩/괄호 reading)
  const recovered = N2v43.filter(v => { const n = +v.id.split('_')[2]; return n >= 6 && n <= 105; });
  ok('복구 v_n2_6~105 = 100개', recovered.length === 100, `actual=${recovered.length}`);
  let recBad = 0;
  for (const v of recovered) {
    for (const f of ['word', 'reading', 'meaningKo', 'exampleSentence', 'exampleTranslation', 'mnemonicText', 'imageKey']) {
      if (!v[f] || !String(v[f]).trim()) { recBad++; ok(`복구 ${v.id}: ${f} 존재`, false); }
    }
    if (!Array.isArray(v.tags) || !v.tags.length) { recBad++; ok(`복구 ${v.id}: tags`, false); }
    for (const r of (v.exampleReadings || [])) if (!v.exampleSentence.includes(r.text)) { recBad++; ok(`복구 ${v.id}: readings "${r.text}" 본문`, false); }
    for (const f of ['word', 'reading', 'meaningKo', 'exampleSentence', 'exampleTranslation']) if (String(v[f]).includes('�')) { recBad++; ok(`복구 ${v.id}: ${f} 인코딩 손상`, false); }
  }
  ok('복구 v_n2_6~105 무결성 0 오류', recBad === 0);
  // 2) N2 vocab reading 괄호 금지 (romaji 깨짐 방지 — 복구 아티팩트 차단)
  let parenR = 0;
  for (const v of N2v43) if (/[()（）]/.test(v.reading)) { parenR++; ok(`N2 ${v.id}: reading 괄호 없음 (${v.reading})`, false); }
  ok('N2 vocab reading 괄호 0', parenR === 0);
  // 3) N2 grammar.pattern 전역 유일 (N2 가 도입한 중복 0)
  const _gp43 = new Map();
  for (const g of grammar) { if (!_gp43.has(g.pattern)) _gp43.set(g.pattern, []); _gp43.get(g.pattern).push(g.id); }
  let n2patDup = 0;
  for (const g of grammar.filter(x => x.level === 'N2')) if (_gp43.get(g.pattern).length > 1) { n2patDup++; ok(`N2 grammar ${g.id}: pattern 전역 유일`, false); }
  ok('N2 grammar.pattern 전역 유일 (N2 도입 중복 0)', n2patDup === 0);
  // 레거시 N5↔N4 동일 문형(〜方/〜ながら/〜まで/〜でしょう) — 의도적 단계별 반복, reviewed
  const legacyDup = [...(_gp43)].filter(([p, ids]) => ids.length > 1 && !ids.some(id => /_n2_/.test(id)));
  if (legacyDup.length) warnReviewed(`레거시 N5↔N4 동일 문형 ${legacyDup.length}종 (단계별 반복, 검토 후 유지): ${legacyDup.map(([p]) => p).join(', ')}`);
  // 4) N2 reading/listening 핵심 vocabIds 가 본문/스크립트에 실제 등장 (질문어 누출 차단)
  const _wmap = new Map(vocab.map(v => [v.id, v.word]));
  let leak = 0;
  for (const [items, key] of [[reading, 'passage'], [listening, 'script']]) {
    for (const it of items.filter(x => x.level === 'N2')) {
      const t = it[key] || '';
      for (const id of (it.vocabIds || [])) {
        const w = _wmap.get(id); if (!w || !containsKanji(w)) continue;
        const stem = w.length >= 2 ? w.slice(0, -1) : w;
        if (!t.includes(w) && !(stem.length >= 2 && t.includes(stem))) { leak++; ok(`N2 ${it.id}: 핵심 vocab ${id}(${w}) 본문 등장`, false); }
      }
    }
  }
  ok('N2 독해/청해 핵심 vocab 본문 등장 (질문어 누출 0)', leak === 0);
  // 5) N2 vocab.exampleSentence 완전 중복 0
  const _es = new Map(); let esDup = 0;
  for (const v of N2v43) { if (_es.has(v.exampleSentence)) { esDup++; ok(`N2 exampleSentence 중복 ${v.id} vs ${_es.get(v.exampleSentence)}`, false); } else _es.set(v.exampleSentence, v.id); }
  ok('N2 vocab.exampleSentence 완전 중복 0', esDup === 0);
  // 6) N2 vocab reading+meaningKo 조합 중복 0 (전역) — 동철동의 중복 차단
  const _combo = new Map(); let comboDup = 0;
  for (const v of vocab) { const k = v.reading + '|' + v.meaningKo; if (_combo.has(k)) { comboDup++; ok(`vocab reading+meaningKo 조합 중복 ${v.id} vs ${_combo.get(k)}`, false); } else _combo.set(k, v.id); }
  ok('vocab reading+meaningKo 조합 중복 0 (전역)', comboDup === 0);
}

// ── 라운드 44: N2 2차 확장 sentinel (회귀 방지 floor) ────────────────────
{
  const { kanji: _k44 } = await import('./js/data/kanji.js');
  const { grammarPairs: _gp44 } = await import('./js/data/grammarPairs.js');
  const { conversationTopics: _t44 } = await import('./js/data/conversationTopics.js');
  const { stories: _s44 } = await import('./js/data/stories.js');
  ok('N2 vocab ≥ 900 (2차)', vocab.filter(v => v.level === 'N2').length >= 900, `actual=${vocab.filter(v => v.level === 'N2').length}`);
  ok('N2 kanji ≥ 300 (2차)', _k44.filter(k => k.level === 'N2').length >= 300, `actual=${_k44.filter(k => k.level === 'N2').length}`);
  ok('N2 grammar ≥ 80 (2차)', grammar.filter(g => g.level === 'N2').length >= 80, `actual=${grammar.filter(g => g.level === 'N2').length}`);
  ok('N2 grammarPairs ≥ 20 (2차)', _gp44.filter(p => p.level === 'N2').length >= 20);
  ok('N2 reading ≥ 50 (2차)', reading.filter(r => r.level === 'N2').length >= 50);
  ok('N2 listening ≥ 50 (2차)', listening.filter(l => l.level === 'N2').length >= 50);
  ok('N2 sentenceBank ≥ 320 (2차)', sentenceBank.filter(s => s.level === 'N2').length >= 320);
  ok('N2 sentenceBank 회화 가능 ≥ 280 (2차)', sentenceBank.filter(s => s.level === 'N2' && s.canUseInConversation).length >= 280);
  ok('N2 conversationTopics ≥ 10 (2차)', _t44.filter(t => t.level === 'N2').length >= 10);
  ok('N2 stories ≥ 10 (2차)', _s44.filter(s => s.level === 'N2').length >= 10);
  ok('N2 reading 장문(200자+) ≥ 3', reading.filter(r => r.level === 'N2' && (r.passage || '').length >= 200).length >= 3);
}

// ── 라운드 46: N2 3차 마무리 확장 sentinel (회귀 방지 floor + 누적 목표) ──────
{
  const { kanji: _k46 } = await import('./js/data/kanji.js');
  const { grammarPairs: _gp46 } = await import('./js/data/grammarPairs.js');
  const { conversationTopics: _t46 } = await import('./js/data/conversationTopics.js');
  const { stories: _s46 } = await import('./js/data/stories.js');
  const _n2v46 = vocab.filter(v => v.level === 'N2').length;
  ok('N2 vocab ≥ 2300 (3차)', _n2v46 >= 2300, `actual=${_n2v46}`);
  ok('N2 vocab 누적 ≥ 5000 (3차)', vocab.length >= 5000, `actual=${vocab.length}`);
  ok('N2 kanji ≥ 400 (3차)', _k46.filter(k => k.level === 'N2').length >= 400, `actual=${_k46.filter(k => k.level === 'N2').length}`);
  ok('N2 kanji 누적 ≥ 1000 (3차)', _k46.length >= 1000, `actual=${_k46.length}`);
  ok('N2 grammar ≥ 180 (3차)', grammar.filter(g => g.level === 'N2').length >= 180, `actual=${grammar.filter(g => g.level === 'N2').length}`);
  ok('N2 grammarPairs ≥ 45 (3차)', _gp46.filter(p => p.level === 'N2').length >= 45, `actual=${_gp46.filter(p => p.level === 'N2').length}`);
  ok('N2 reading ≥ 120 (3차)', reading.filter(r => r.level === 'N2').length >= 120);
  ok('N2 listening ≥ 120 (3차)', listening.filter(l => l.level === 'N2').length >= 120);
  ok('N2 sentenceBank ≥ 600 (3차)', sentenceBank.filter(s => s.level === 'N2').length >= 600);
  ok('N2 sentenceBank 회화 가능 ≥ 500 (3차)', sentenceBank.filter(s => s.level === 'N2' && s.canUseInConversation).length >= 500);
  ok('N2 conversationTopics ≥ 18 (3차)', _t46.filter(t => t.level === 'N2').length >= 18);
  ok('N2 stories ≥ 18 (3차)', _s46.filter(s => s.level === 'N2').length >= 18);
  ok('N2 short_story ≥ 6 (3차)', _s46.filter(s => s.level === 'N2' && s.type === 'short_story').length >= 6,
    `actual=${_s46.filter(s => s.level === 'N2' && s.type === 'short_story').length}`);
  ok('N2 reading 장문(200자+) ≥ 15', reading.filter(r => r.level === 'N2' && (r.passage || '').length >= 200).length >= 15,
    `actual=${reading.filter(r => r.level === 'N2' && (r.passage || '').length >= 200).length}`);
  ok('N2 reading 의존성 핵심 전수 (3차 포함)', reading.filter(r => r.level === 'N2').every(r => (r.vocabIds || []).length > 0));
  ok('N2 listening 의존성 핵심 전수 (3차 포함)', listening.filter(l => l.level === 'N2').every(l => (l.vocabIds || []).length > 0));
  ok('N2 story 의존성 전수 (3차 포함)', _s46.filter(s => s.level === 'N2').every(s => (s.vocabularyIds || []).length > 0));
}

// ── 라운드 47: N2 3차 안정화 / 완성 선언 기준 (최종 품질 잠금) ──────────────
{
  const { kanji: _k47 } = await import('./js/data/kanji.js');
  const { grammarPairs: _gp47 } = await import('./js/data/grammarPairs.js');
  const { conversationTopics: _t47 } = await import('./js/data/conversationTopics.js');
  const { stories: _s47 } = await import('./js/data/stories.js');
  const n2v = vocab.filter(v => v.level === 'N2');
  const n2r = reading.filter(r => r.level === 'N2');
  const n2l = listening.filter(l => l.level === 'N2');
  const n2sb = sentenceBank.filter(s => s.level === 'N2');
  const n2st = _s47.filter(s => s.level === 'N2');
  // deps 적용 전수 (stale bake 차단 — 신규 항목이 베이크 누락이면 vocabIds 필드 부재)
  const depsApplied = n2r.every(r => Array.isArray(r.vocabIds))
    && n2l.every(l => Array.isArray(l.vocabIds))
    && n2st.every(s => Array.isArray(s.vocabularyIds));
  const completion = {
    '누적 vocab ≥ 5000': vocab.length >= 5000,
    '누적 kanji ≥ 1000': _k47.length >= 1000,
    'N2 grammar ≥ 180': grammar.filter(g => g.level === 'N2').length >= 180,
    'N2 grammarPairs ≥ 45': _gp47.filter(p => p.level === 'N2').length >= 45,
    'N2 reading ≥ 120': n2r.length >= 120,
    'N2 listening ≥ 120': n2l.length >= 120,
    'N2 sentenceBank ≥ 600': n2sb.length >= 600,
    'N2 회화 가능 ≥ 500': n2sb.filter(s => s.canUseInConversation).length >= 500,
    'N2 conversationTopics ≥ 18': _t47.filter(t => t.level === 'N2').length >= 18,
    'N2 stories ≥ 18': n2st.length >= 18,
    'N2 short_story ≥ 6': n2st.filter(s => s.type === 'short_story').length >= 6,
    'N2 reading/listening/story 의존성 전수(stale bake 0)': depsApplied,
  };
  for (const [k, v] of Object.entries(completion)) ok(`N2 완성 기준 — ${k}`, v);
  console.log('  ★ N2 완성 선언 기준: 위 항목 + (전역 word/kanji/pattern 중복 0 / vocab 예문·reading+meaningKo 조합·sentenceBank.ja 중복 0 / N1PAT 0 / imageKey ≤10% / unreviewed 0) 전부 통과 시 N2 완성. → 통과 시 N5~N2 전 레벨 콘텐츠 완성.');
}

// ── 라운드 48: 릴리스 후보 안정화 — 구조 가드 (PWA 캐시 목록 도출 가능성) ──────
{
  const dl = await import('./js/dataLoader.js');
  // jsonPathFor 가 모든 level×type 조합에 대해 data/<lv>/<type>.json 을 반환 → PWA precache 목록 재사용 가능
  let pathBad = 0;
  const pwaPaths = [];
  for (const lv of dl.VALID_LEVELS) for (const ty of dl.VALID_TYPES) {
    const p = dl.jsonPathFor(lv, ty);
    if (p !== `data/${lv.toLowerCase()}/${ty}.json`) pathBad++;
    pwaPaths.push(p);
  }
  ok('릴리스 — jsonPathFor 전 조합 PWA 경로 도출', pathBad === 0, `bad=${pathBad}`);
  ok('릴리스 — PWA precache 후보 경로 수 = level×type', pwaPaths.length === dl.VALID_LEVELS.length * dl.VALID_TYPES.length);
  // actionLogger sanitizeMeta 가 allowlist 외 키(민감정보)를 제거하는지 — 로그 payload 보안 가드
  const logger = await import('./js/actionLogger.js');
  logger._resetThrottleForTest();
  let captured = null;
  logger._setWriterForTest(async (path, value) => { if (path.startsWith('actionLogs/')) captured = value; });
  logger.logAction('vocab_card_answered', {
    itemType: 'vocab', itemId: 'v_n2_1', correct: true,
    email: 'user@example.com', password: 'secret123', userText: '원문답변', transcript: 'STT원문', name: '홍길동',
  });
  logger._resetWriterForTest();
  const metaKeys = captured ? Object.keys(captured.meta) : [];
  const leak = captured ? JSON.stringify(captured).match(/user@example|secret123|원문답변|STT원문|홍길동/) : null;
  ok('릴리스 — 로그 meta allowlist 외 키 제거', metaKeys.every(k => ['itemType', 'itemId', 'storyId', 'correct', 'method'].includes(k)), `keys=${metaKeys.join(',')}`);
  ok('릴리스 — 로그 payload 민감정보(이메일/비번/답변/STT/이름) 0', !leak);

  // 임시 생성기/중간 산출물이 런타임 코드에서 import/참조되지 않는지 (배포 코드 격리)
  const fs48 = await import('node:fs');
  const FORBIDDEN = /(_gen_[a-z0-9]+|_vdata_[A-Z]|_vbatch|_deps2_[a-z]+|_allpats)/;
  const scanDir = (dir) => {
    let bad = [];
    for (const ent of fs48.readdirSync(new URL(dir, import.meta.url), { withFileTypes: true })) {
      if (ent.name === 'data') continue; // 데이터 모듈은 별도(콘텐츠) — 검사 대상은 로직 코드
      const rel = `${dir}${ent.name}`;
      if (ent.isDirectory()) { bad = bad.concat(scanDir(`${rel}/`)); continue; }
      if (!ent.name.endsWith('.js')) continue;
      const src = fs48.readFileSync(new URL(rel, import.meta.url), 'utf8');
      for (const line of src.split('\n')) {
        if ((line.includes('import') || line.includes('require') || line.includes('fetch')) && FORBIDDEN.test(line)) bad.push(`${rel}: ${line.trim().slice(0, 60)}`);
      }
    }
    return bad;
  };
  const tempRefs = scanDir('./js/');
  const idxSrc = fs48.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
  if (FORBIDDEN.test(idxSrc)) tempRefs.push('index.html');
  ok('릴리스 — 임시 생성기/중간산출물 런타임 import 0', tempRefs.length === 0, tempRefs.join(' | '));
}

// ── 라운드 49: PWA 최소 구현 정적 검증 ───────────────────────────────────────
{
  const fs49 = await import('node:fs');
  const read = (p) => { try { return fs49.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return null; } };
  const exists = (p) => { try { fs49.accessSync(new URL(p, import.meta.url)); return true; } catch { return false; } };

  // manifest.json 존재 + 유효 + 상대경로 + 아이콘 연결
  const mfRaw = read('./manifest.json');
  ok('PWA — manifest.json 존재', !!mfRaw);
  let mf = null; try { mf = JSON.parse(mfRaw); } catch { /* */ }
  ok('PWA — manifest 유효 JSON', !!mf);
  if (mf) {
    ok('PWA — start_url 상대경로', typeof mf.start_url === 'string' && !mf.start_url.startsWith('/'), `start_url=${mf.start_url}`);
    ok('PWA — scope 상대경로', typeof mf.scope === 'string' && !mf.scope.startsWith('/'), `scope=${mf.scope}`);
    ok('PWA — display standalone', mf.display === 'standalone');
    ok('PWA — theme/background_color 앱 색상(먹색 #1b1815)', mf.theme_color === '#1b1815' && mf.background_color === '#1b1815');
    const icons = mf.icons || [];
    ok('PWA — manifest 아이콘 192/512 연결', icons.some(i => /192/.test(i.sizes)) && icons.some(i => /512/.test(i.sizes)));
    ok('PWA — manifest 아이콘 경로 상대', icons.every(i => typeof i.src === 'string' && !i.src.startsWith('/')));
    ok('PWA — maskable 아이콘 포함', icons.some(i => (i.purpose || '').includes('maskable')));
  }
  // 아이콘 파일 실제 존재 + PNG 시그니처
  for (const ic of ['icon-192.png', 'icon-512.png', 'icon-192-maskable.png', 'icon-512-maskable.png']) {
    const buf = (() => { try { return fs49.readFileSync(new URL(`./assets/icons/${ic}`, import.meta.url)); } catch { return null; } })();
    const sigOk = buf && buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    ok(`PWA — 아이콘 ${ic} 존재(PNG)`, !!sigOk);
  }
  // index.html 에 manifest 연결
  const idx = read('./index.html') || '';
  ok('PWA — index.html manifest 연결', /<link[^>]+rel=["']manifest["'][^>]+href=["']\.\/manifest\.json/.test(idx));
  // service-worker.js 존재 + 핵심 구조
  const sw = read('./service-worker.js');
  ok('PWA — service-worker.js 존재', !!sw);
  if (sw) {
    ok('PWA — SW 캐시 버전 상수', /CACHE_VERSION\s*=/.test(sw));
    ok('PWA — SW activate 구버전 캐시 정리', /activate/.test(sw) && /caches\.delete/.test(sw));
    ok('PWA — SW same-origin GET 만 처리', /method\s*!==\s*['"]GET['"]/.test(sw) && /url\.origin\s*!==\s*self\.location\.origin/.test(sw));
    // Firebase/gstatic 캐시 금지 — cross-origin 은 fetch 핸들러에서 early-return(network-only)
    ok('PWA — SW Firebase/gstatic 캐시 안 함(네트워크 통과)', /firebaseio|googleapis|gstatic/.test(sw) && /url\.origin\s*!==\s*self\.location\.origin\)\s*return/.test(sw));
    ok('PWA — SW 방어적(실패 무시 .catch)', (sw.match(/\.catch\(/g) || []).length >= 3);
  }
  // SW 등록 모듈
  const pwa = read('./js/pwa.js') || '';
  ok('PWA — 등록 모듈 미지원 환경 방어', /serviceWorker' in n|'serviceWorker'\s*in\s*n/.test(pwa) && /return false/.test(pwa));
  ok('PWA — app.js 가 SW 등록 호출', /registerServiceWorker\(\)/.test(read('./js/app.js') || ''));
}

// ── 라운드 50: 로그인 필수 / 인증 게이트 정적 검증 ───────────────────────────
{
  const fs50 = await import('node:fs');
  const read = (p) => { try { return fs50.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return null; } };
  // router 게이트 API
  const routerSrc = read('./js/router.js') || '';
  ok('인증 — router setAuthGate/consumePendingRoute export', /export function setAuthGate/.test(routerSrc) && /export function consumePendingRoute/.test(routerSrc));
  ok('인증 — router render 가 authGuard 로 게이트', /authGuard\s*&&\s*!authGuard\(\)/.test(routerSrc) && /gateRenderer/.test(routerSrc));
  ok('인증 — 비통과 시 의도 route 보관(pendingRoute)', /pendingRoute\s*=\s*route/.test(routerSrc));
  // authGate 뷰
  const gateSrc = read('./js/views/authGate.js') || '';
  ok('인증 — authGate renderAuthGate/renderAuthLoading export', /export function renderAuthGate/.test(gateSrc) && /export function renderAuthLoading/.test(gateSrc));
  ok('인증 — 로그인/회원가입 버튼 존재', /id="loginBtn"/.test(gateSrc) && /id="signupBtn"/.test(gateSrc));
  ok('인증 — 비밀번호 입력 후 비움(저장 금지)', /pwEl\.value\s*=\s*''/.test(gateSrc));
  ok('인증 — 미설정/오프라인 안내', /authAvailable\(\)/.test(gateSrc) && /오프라인/.test(gateSrc));
  ok('인증 — Google/소셜 로그인 API 미사용', !/GoogleAuthProvider|signInWithPopup|signInWithRedirect|OAuthProvider/.test(gateSrc));
  ok('인증 — 테스트 로그 버튼 없음', !/로그 테스트|sendTestLog|testLog/.test(gateSrc));
  // app.js 배선
  const appSrc = read('./js/app.js') || '';
  ok('인증 — app.js setAuthGate(getCurrentUser) 배선', /setAuthGate\(\s*\(\)\s*=>\s*!!getCurrentUser\(\)/.test(appSrc));
  ok('인증 — app.js initAuth 후 부팅(start)', /initAuth\(\)\.then/.test(appSrc) && /start\(\)/.test(appSrc));
  ok('인증 — app.js auth-locked 토글', /auth-locked/.test(appSrc));
  ok('인증 — app.js app_open 은 로그인 시점', /signedIn\s*&&\s*!_prevSignedIn\)\s*logAction\('app_open'\)/.test(appSrc));
  // "로그인 없이 사용 가능" 문구 제거 확인 (게이트/설정)
  ok('인증 — 게이트/설정에 "로그인 없이" 문구 없음', !/로그인 없이도/.test(gateSrc) && !/로그인 없이도/.test(read('./js/views/settings.js') || ''));
  // CSS — auth-locked 헤더/탭 숨김
  ok('인증 — styles.css auth-locked 헤더/탭 숨김', /auth-locked\s+\.top-bar/.test(read('./styles.css') || '') && /auth-locked\s+\.tab-bar/.test(read('./styles.css') || ''));
  // firebase-logging 문서 — auth required rules 정책
  const fbDoc = read('./docs/firebase-logging.md') || '';
  ok('문서 — firebase-logging auth required rules', /auth\s*!=\s*null/.test(fbDoc) && /로그인 필수|signed-in only|signed-in 전용/.test(fbDoc));
  ok('문서 — firebase-logging anonymousActivity deprecated', /anonymousActivity[\s\S]{0,80}(deprecated|폐기|false)/i.test(fbDoc));
  ok('문서 — firebase-logging payload↔rules 정합 확인표(라운드 51)', /payload\s*↔\s*rules 정합|payload ↔ rules/.test(fbDoc));
}

// ── 라운드 51: 공개 베타 준비 — 설치 안내 + 체크리스트 문서 가드 ────────────
{
  const fs51 = await import('node:fs');
  const read = (p) => { try { return fs51.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return null; } };
  const exists = (p) => { try { fs51.accessSync(new URL(p, import.meta.url)); return true; } catch { return false; } };
  // 사용자용 PWA 설치 안내 문서
  const install = read('./docs/pwa-install.md');
  ok('베타 — docs/pwa-install.md 존재', !!install);
  if (install) {
    ok('베타 — 설치 안내: Android/PC/iPhone 모두 포함', /Android/.test(install) && /(PC|데스크톱|Edge)/.test(install) && /(iPhone|iPad|Safari)/.test(install));
    ok('베타 — 설치 안내: 첫 사용 온라인 로그인 필요 명시', /온라인 로그인|온라인 연결/.test(install) && /로그인/.test(install));
  }
  // release-checklist 로그인 필수 + PWA 설치 QA 항목
  const rc = read('./docs/release-checklist.md') || '';
  ok('베타 — release-checklist 로그인 필수 QA(4-c)', /로그인 필수 \/ 인증 게이트|인증 게이트/.test(rc) && /Authorized domains/.test(rc) && /운영 rules Publish/.test(rc));
  ok('베타 — release-checklist PWA 설치/오프라인 항목', /Service Worker|설치 가능|오프라인 새로고침/.test(rc));
  // browser-qa-checklist 로그인+PWA 수동 항목
  const bq = read('./docs/browser-qa-checklist.md') || '';
  ok('베타 — browser-qa 로그인/PWA 수동 항목', /로그인 필수 \+ PWA 설치 수동 QA|Android Chrome PWA 설치/.test(bq) && /#study.*차단|직접 접근.*차단/.test(bq));
  // README 에 설치 안내 + 로그인 필수 안내
  const rm = read('./README.md') || '';
  ok('베타 — README 로그인 필수 + 설치 안내 링크', /이메일 로그인이 필요|로그인 필수/.test(rm) && /pwa-install\.md/.test(rm));
}

// ── 라운드 52: 비밀번호 재설정 정적 검증 ────────────────────────────────────
{
  const authSvc52 = await import('./js/authService.js');
  const fs52 = await import('node:fs');
  const read = (p) => { try { return fs52.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
  // resetPassword export + sendPasswordResetEmail 사용
  ok('재설정 — authService.resetPassword export', typeof authSvc52.resetPassword === 'function');
  const authSrc = read('./js/authService.js');
  ok('재설정 — sendPasswordResetEmail 사용', /sendPasswordResetEmail/.test(authSrc));
  ok('재설정 — user-not-found 중립 성공(enumeration 방지)', /user-not-found[\s\S]{0,160}ok:\s*true/.test(authSrc));
  // 동작: 미주입 mock 으로 export 호출이 throw 하지 않고 객체 반환
  const r0 = await authSvc52.resetPassword('');
  ok('재설정 — 빈 이메일 → 안내(throw 없음)', r0 && r0.ok === false && /이메일을 입력/.test(r0.error));
  // authGate reset UI + reset 핸들러가 logAction 호출 안 함
  const gateSrc = read('./js/views/authGate.js');
  ok('재설정 — authGate 에 #forgotBtn(잊으셨나요) UI', /id="forgotBtn"/.test(gateSrc) && /잊으셨나요/.test(gateSrc));
  ok('재설정 — authGate reset 핸들러가 resetPassword 호출', /resetPassword\(/.test(gateSrc));
  // reset 흐름은 로그 미기록: ALLOWED_EVENTS 에 password/reset 이벤트 없음 + authGate forgot 핸들러에 logAction 없음
  const loggerSrc52 = read('./js/actionLogger.js');
  ok('재설정 — 로그 이벤트에 reset/password 없음', !/password_reset|reset_password|'reset'|"reset"/.test(loggerSrc52.match(/ALLOWED_EVENTS[\s\S]*?\]/)?.[0] || loggerSrc52));
  const forgotHandler = gateSrc.match(/forgotBtn\.addEventListener[\s\S]*?\}\);/)?.[0] || '';
  ok('재설정 — forgot 핸들러에 logAction 없음(이메일 미기록)', !/logAction/.test(forgotHandler));
  // 이메일/비밀번호 localStorage 저장 패턴 없음(재확인)
  ok('재설정 — authGate localStorage 에 email/password 저장 없음',
     !/localStorage[\s\S]{0,40}(email|password|비밀번호)/i.test(gateSrc));
}

// ── 라운드 53: vocab JSON 분리 drift 검증 (JSON ≡ JS 단일 진실원) ────────────
{
  const fs53 = await import('node:fs');
  const LEVELS = ['N5', 'N4', 'N3', 'N2'];
  let jsonTotal = 0;
  const allIds = new Set(), allWords = new Set();
  let dupId = 0, dupWord = 0, badImg = 0, parseFail = 0, fieldMismatch = 0, countMismatch = 0, idOrderMismatch = 0;
  for (const lv of LEVELS) {
    let arr = null;
    try { arr = JSON.parse(fs53.readFileSync(new URL(`./data/${lv.toLowerCase()}/vocab.json`, import.meta.url), 'utf8')); }
    catch { parseFail++; continue; }
    const js = vocab.filter(v => v.level === lv);
    if (!Array.isArray(arr) || arr.length !== js.length) { countMismatch++; continue; }
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i], b = js[i];
      if (a.id !== b.id) { idOrderMismatch++; }
      if (a.word !== b.word || a.reading !== b.reading || a.meaningKo !== b.meaningKo) fieldMismatch++;
      if (allIds.has(a.id)) dupId++; else allIds.add(a.id);
      if (allWords.has(a.word)) dupWord++; else allWords.add(a.word);
      if (!_palette.has(a.imageKey) && a.imageKey !== 'default') badImg++;
    }
    jsonTotal += arr.length;
  }
  ok('JSON drift — 4개 레벨 파일 parse 성공', parseFail === 0, `parseFail=${parseFail}`);
  ok('JSON drift — 레벨별 count == JS', countMismatch === 0, `mismatch=${countMismatch}`);
  ok('JSON drift — 총합 == JS vocab.length', jsonTotal === vocab.length, `json=${jsonTotal} js=${vocab.length}`);
  ok('JSON drift — id 순서/값 일치', idOrderMismatch === 0, `mismatch=${idOrderMismatch}`);
  ok('JSON drift — word/reading/meaningKo 일치', fieldMismatch === 0, `mismatch=${fieldMismatch}`);
  ok('JSON drift — 전역 id 중복 0', dupId === 0, `dup=${dupId}`);
  ok('JSON drift — 전역 word 중복 0', dupWord === 0, `dup=${dupWord}`);
  ok('JSON drift — imageKey 가 palette/default', badImg === 0, `bad=${badImg}`);
  ok('JSON drift — id/word 고유 합계 == 총합', allIds.size === jsonTotal && allWords.size === jsonTotal);
  // dataLoader.loadVocab: JSON 우선 + 실패 시 JS fallback (구조 정적 검증)
  const dlSrc = fs53.readFileSync(new URL('./js/dataLoader.js', import.meta.url), 'utf8');
  ok('JSON drift — dataLoader.loadVocab export', /export const loadVocab\b/.test(dlSrc));
  ok('JSON drift — dataLoader JSON-first + JS fallback', /fetchJson\(level, type\)/.test(dlSrc) && /loadFromJsFallback/.test(dlSrc));
  ok('JSON drift — jsonPathFor data/<lv>/<type>.json', /data\/\$\{level\.toLowerCase\(\)\}\/\$\{type\}\.json/.test(dlSrc));
}

// ── 라운드 54: JLPT10M 브랜딩 + APK 계획 정적 검증 ──────────────────────────
{
  const fs54 = await import('node:fs');
  const read = (p) => { try { return fs54.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
  // 브랜드명 JLPT10M 반영 (manifest / index / README)
  const mf = JSON.parse(read('./manifest.json') || '{}');
  ok('브랜드 — manifest short_name=JLPT10M', mf.short_name === 'JLPT10M');
  ok('브랜드 — manifest name 에 JLPT10M', /JLPT10M/.test(mf.name || ''));
  ok('브랜드 — index.html 헤더/타이틀 JLPT10M', /JLPT10M|JLPT<span class="wm-accent">10M/.test(read('./index.html')));
  ok('브랜드 — authGate 로그인 화면 JLPT10M', /JLPT10M|wm-accent">10M/.test(read('./js/views/authGate.js')));
  ok('브랜드 — README JLPT10M', /JLPT10M/.test(read('./README.md')));
  // 디자인 토큰 — 먹/주홍/종이 팔레트 (한 가지 네이비만 아님)
  const css = read('./styles.css');
  ok('브랜드 — styles.css 주홍 accent 토큰', /--accent:\s*#e2533f/.test(css) && /--accent:\s*#d8432e/.test(css));
  ok('브랜드 — styles.css 라이트=종이/다크=먹 배경', /--bg:\s*#f6f1e7/.test(css) && /--bg:\s*#1b1815/.test(css));
  ok('브랜드 — 구 네이비(#0f172a) 잔존 토큰 없음', !/--bg:\s*#0f172a/.test(css));
  // 공식 JLPT/일본 정부 로고 사칭 문구 없음
  const brandFiles = [read('./index.html'), read('./js/views/authGate.js'), read('./manifest.json'), read('./README.md')].join('\n');
  ok('브랜드 — 공식 JLPT/정부 로고 사칭 문구 없음', !/공식 JLPT|official JLPT|JLPT 공식|일본 정부|文部科学省|国際交流基金/.test(brandFiles));
  // 아이콘 brand 팔레트(먹 배경) — gen-icons 색상
  ok('브랜드 — gen-icons 먹/종이/주홍 팔레트', /#1b1815 먹색/.test(read('./tools/gen-icons.mjs')) && /#d8432e 주홍/.test(read('./tools/gen-icons.mjs')));
  // APK 계획 문서
  const apk = read('./docs/apk-plan.md');
  ok('문서 — docs/apk-plan.md 존재', !!apk);
  ok('문서 — apk-plan Capacitor/TWA 비교 + package id', /Capacitor/.test(apk) && /TWA/.test(apk) && /com\.jlpt10m\.app/.test(apk));
  ok('문서 — apk-plan Firebase/STT/SW 사전점검', /Authorized domains/.test(apk) && /SpeechRecognition|STT/.test(apk) && /Service Worker|SW/.test(apk));
  // 로그인 필수 정책 문구 유지 (회귀 방지)
  ok('브랜드 — 로그인 필수 문구 유지', /로그인 후 이용|이메일 로그인/.test(read('./js/views/authGate.js')) && !/로그인 없이도/.test(read('./js/views/authGate.js')));
}

// ── 라운드 55: Capacitor APK 패키징 구성 정적 검증 ──────────────────────────
{
  const fs55 = await import('node:fs');
  const read = (p) => { try { return fs55.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
  const exists = (p) => { try { fs55.accessSync(new URL(p, import.meta.url)); return true; } catch { return false; } };
  // capacitor.config.json
  const capRaw = read('./capacitor.config.json');
  ok('APK — capacitor.config.json 존재', !!capRaw);
  let cap = null; try { cap = JSON.parse(capRaw); } catch { /* */ }
  ok('APK — config 유효 JSON', !!cap);
  if (cap) {
    ok('APK — appId com.jlpt10m.app', cap.appId === 'com.jlpt10m.app');
    ok('APK — appName JLPT10M', cap.appName === 'JLPT10M');
    ok('APK — webDir www', cap.webDir === 'www');
    ok('APK — bundledWebRuntime false', cap.bundledWebRuntime === false);
    ok('APK — androidScheme https(로컬 origin)', cap.server && cap.server.androidScheme === 'https');
  }
  // www 빌드 스크립트가 필수 자산을 포함
  const bw = read('./tools/build-www.mjs');
  ok('APK — tools/build-www.mjs 존재', !!bw);
  ok('APK — build-www 필수 자산 복사(index/js/data/assets/manifest/sw/styles)',
     /index\.html/.test(bw) && /'js'/.test(bw) && /'data'/.test(bw) && /'assets'/.test(bw) && /manifest\.json/.test(bw) && /service-worker\.js/.test(bw) && /styles\.css/.test(bw));
  // package.json scripts + Capacitor devDependencies(APK 빌드/로컬 sync에 필요)
  const pkg = JSON.parse(read('./package.json') || '{}');
  const sc = pkg.scripts || {};
  ok('APK — npm scripts cap:copy/sync/open/build', !!sc['cap:copy'] && !!sc['cap:sync'] && !!sc['cap:open'] && !!sc['cap:build:android']);
  const devCap = Object.keys(pkg.devDependencies || {});
  ok('APK — capacitor devDependencies(core/android/cli)',
     devCap.includes('@capacitor/core') && devCap.includes('@capacitor/android') && devCap.includes('@capacitor/cli'));
  ok('APK — capacitor 는 runtime dependencies 가 아님',
     !(pkg.dependencies && Object.keys(pkg.dependencies).some(k => k.startsWith('@capacitor'))));
  // pwa.js Capacitor 가드
  const pwaSrc = read('./js/pwa.js');
  ok('APK — pwa.js isCapacitor 감지 + SW 건너뜀', /export function isCapacitor/.test(pwaSrc) && /if \(isCapacitor\(\)\) return false/.test(pwaSrc));
  // .gitignore 빌드 산출물 제외
  const gi = read('./.gitignore');
  ok('APK — .gitignore www/ + android/ 제외', /^www\/$/m.test(gi) && /^android\/$/m.test(gi));
  // android/ 는 사용자 생성 산출물 — 있으면 build.gradle 유효, 없으면 user 단계(비차단)
  const androidExists = exists('./android');
  ok('APK — android/ (있으면) capacitor 프로젝트 / 없으면 user 빌드 단계',
     !androidExists || exists('./android/app/build.gradle') || exists('./android/build.gradle'));
  // 문서
  const apk = read('./docs/apk-plan.md');
  ok('APK — apk-plan 1차 구현 상태 + 설정/빌드 절차', /webDir|capacitor\.config/.test(apk) && /assembleDebug|cap add android|gradlew/.test(apk));
}

// ── 라운드 56: GitHub Actions APK 빌드 워크플로 정적 검증 ────────────────────
{
  const fs56 = await import('node:fs');
  const read = (p) => { try { return fs56.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
  const wf = read('./.github/workflows/android-apk.yml');
  ok('CI — android-apk.yml 존재', !!wf);
  ok('CI — workflow_dispatch 수동 실행', /workflow_dispatch:/.test(wf));
  ok('CI — ubuntu-latest 러너', /runs-on:\s*ubuntu-latest/.test(wf));
  ok('CI — setup-java JDK 17', /setup-java/.test(wf) && /java-version:\s*'?17'?/.test(wf));
  ok('CI — setup-node', /setup-node/.test(wf));
  ok('CI — webDir 빌드(build-www) 단계', /tools\/build-www\.mjs/.test(wf));
  ok('CI — cap sync android 단계', /cap sync android/.test(wf));
  ok('CI — gradlew assembleDebug', /gradlew assembleDebug/.test(wf));
  ok('CI — upload-artifact', /upload-artifact/.test(wf));
  ok('CI — artifact 이름 jlpt10m-debug-apk', /name:\s*jlpt10m-debug-apk/.test(wf));
  ok('CI — debug APK 경로(app-debug.apk)', /app\/build\/outputs\/apk\/debug\/app-debug\.apk/.test(wf));
  ok('CI — APK rename(JLPT10M-debug.apk)', /JLPT10M-debug\.apk/.test(wf));
  ok('CI — android/ 있으면 사용/없으면 cap add(Option A/B)', /if \[ ! -d android \]/.test(wf) && /cap add android/.test(wf));
  // 보안 — keystore/jks/release 서명키가 워크플로/저장소에 커밋되지 않음
  ok('CI — keystore/jks 파일 미커밋', !fs56.existsSync(new URL('./release.keystore', import.meta.url)) && !fs56.existsSync(new URL('./app.keystore', import.meta.url)));
  ok('CI — .gitignore 가 *.keystore/*.jks 제외', /\*\.keystore/.test(read('./.gitignore')) && /\*\.jks/.test(read('./.gitignore')));
  ok('CI — 워크플로에 평문 서명키/비밀번호 없음', !/storePassword|keyPassword|signingConfig[\s\S]{0,80}password/i.test(wf));
  // qa(테스트) CI 는 optional 생략으로 경량 유지
  ok('CI — qa.yml 이 --omit=optional 로 경량 설치', /--omit=optional/.test(read('./.github/workflows/qa.yml')));
}

// ── 라운드 57: 네이티브 TTS 어댑터 정적 검증 ───────────────────────────────
{
  const fs57 = await import('node:fs');
  const read = (p) => { try { return fs57.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
  // platform.js 공용 감지
  const plat = read('./js/platform.js');
  ok('TTS — platform.js isCapacitor/isAndroidCapacitor/useNativeTts/nativeTtsPlugin', !!plat &&
     /export function isCapacitor/.test(plat) && /export function isAndroidCapacitor/.test(plat) &&
     /export function useNativeTts/.test(plat) && /export function nativeTtsPlugin/.test(plat));
  const platMod = await import('./js/platform.js');
  ok('TTS — 웹 환경 useNativeTts=false(Capacitor 미주입)', platMod.useNativeTts() === false && platMod.isCapacitor() === false);
  // pwa.js 가 platform 공용 감지 사용(회귀 없음)
  ok('TTS — pwa.js platform.isCapacitor 공용 사용', /from '\.\/platform\.js'/.test(read('./js/pwa.js')) && /export function isCapacitor/.test(read('./js/pwa.js')));
  // tts.js 어댑터 구조
  const ttsSrc = read('./js/tts.js');
  ok('TTS — tts.js native/web 어댑터(nativeSpeak/webSpeak)', /async function nativeSpeak/.test(ttsSrc) && /async function webSpeak/.test(ttsSrc));
  ok('TTS — speak/stop 가 Capacitor 로 분기', /if \(isCapacitor\(\)\) return nativeSpeak/.test(ttsSrc) && /if \(isCapacitor\(\)\) \{ nativeStop\(\)/.test(ttsSrc));
  ok('TTS — Capacitor 에서 Web Speech 만 의존하지 않음(plugin 사용)', /nativeTtsPlugin\(\)/.test(ttsSrc) && /p\.speak\(/.test(ttsSrc));
  ok('TTS — 네이티브 상태값 native-ready/native-unavailable', /native-ready/.test(ttsSrc) && /native-unavailable/.test(ttsSrc));
  ok('TTS — 기존 web reason 유지(no-ja-voice/unsupported)', /no-ja-voice/.test(ttsSrc) && /'unsupported'/.test(ttsSrc));
  ok('TTS — 공개 API 유지(speak/stopSpeaking/hasJaVoice/refreshVoices/getVoiceStatus/onVoiceStatusChange/ttsAvailable)',
     ['export async function speak', 'export function stopSpeaking', 'export async function hasJaVoice',
      'export async function refreshVoices', 'export function getVoiceStatus', 'export function onVoiceStatusChange',
      'export function ttsAvailable'].every(s => ttsSrc.includes(s)));
  // 설정 화면 네이티브 안내 문구
  const setSrc = read('./js/views/settings.js');
  ok('TTS — settings native-ready/native-unavailable 매핑 + Android TTS 안내', /native-ready/.test(setSrc) && /native-unavailable/.test(setSrc) && /텍스트 음성 변환|네이티브 TTS/.test(setSrc));
  // 플러그인 devDependencies(APK 빌드/로컬 sync에 필요)
  const pkg = JSON.parse(read('./package.json') || '{}');
  ok('TTS — @capacitor-community/text-to-speech devDependencies', !!(pkg.devDependencies && pkg.devDependencies['@capacitor-community/text-to-speech']));
  ok('TTS — TTS 플러그인이 runtime dependencies 에는 없음',
     !(pkg.dependencies && pkg.dependencies['@capacitor-community/text-to-speech']) &&
     !!(pkg.devDependencies && pkg.devDependencies['@capacitor-community/text-to-speech']));
  // APK 워크플로는 full npm install(optional 포함) — 플러그인 설치됨
  const apkWf = read('./.github/workflows/android-apk.yml');
  ok('TTS — android-apk.yml npm install(optional 포함, --omit 아님)', /npm install --no-audit --no-fund/.test(apkWf) && !/--omit=optional/.test(apkWf));
}

// ── 라운드 58: 네이티브 TTS 상태/재생 수정 정적 검증 ──────────────────────────
{
  const fs58 = await import('node:fs');
  const read = (p) => { try { return fs58.readFileSync(new URL(p, import.meta.url), 'utf8'); } catch { return ''; } };
  const ttsSrc = read('./js/tts.js');
  const platSrc = read('./js/platform.js');
  const setSrc = read('./js/views/settings.js');
  const apkWf = read('./.github/workflows/android-apk.yml');
  // 상태가 getSupportedLanguages 성공에만 의존하지 않음 — plugin/speak 존재 기준
  ok('TTSfix — 상태는 plugin/speak 존재 기준(nativeStatusCode)', /function nativeStatusCode/.test(ttsSrc) && /typeof p\.speak !== 'function'/.test(ttsSrc));
  ok('TTSfix — getVoiceStatus 가 getSupportedLanguages 에 의존 안 함', !/getSupportedLanguages[\s\S]{0,200}getVoiceStatus/.test(ttsSrc) && /getVoiceStatus[\s\S]{0,80}nativeStatusCode\(\)/.test(ttsSrc));
  // reason 구분 문자열
  ok('TTSfix — native reason: plugin-missing/method-missing/native-error', /native-plugin-missing/.test(ttsSrc) && /native-method-missing/.test(ttsSrc) && /'native-error'/.test(ttsSrc));
  ok('TTSfix — native-language-unknown 상태 구분', /native-language-unknown/.test(ttsSrc) && /native-language-unknown/.test(setSrc));
  // 테스트 재생 / 진단 export
  ok('TTSfix — speakTest / getTtsDiagnostics export', /export async function speakTest/.test(ttsSrc) && /export function getTtsDiagnostics/.test(ttsSrc));
  // speak 옵션 키 호환(lang/language/locale) fallback
  ok('TTSfix — speak 옵션키 호환(lang/language/locale)', /'language'/.test(ttsSrc) && /'locale'/.test(ttsSrc) && /nativeLangKey/.test(ttsSrc));
  // platform 진단
  ok('TTSfix — platform 진단 함수', /export function getCapacitorDiagnostics/.test(platSrc) && /export function getNativeTtsDiagnostics/.test(platSrc));
  // 설정 테스트 재생 버튼 + 진단 표시
  ok('TTSfix — settings 테스트 재생 버튼(#voiceTestBtn)', /id="voiceTestBtn"/.test(setSrc) && /speakTest\(/.test(setSrc));
  ok('TTSfix — settings 진단/실패 reason 표시', /getTtsDiagnostics/.test(setSrc) && /native-plugin-missing/.test(setSrc));
  // Web Speech 기존 reason 유지(회귀)
  ok('TTSfix — Web reason 유지(no-ja-voice/playback-error/unsupported)', /no-ja-voice/.test(ttsSrc) && /playback-error/.test(ttsSrc) && /'unsupported'/.test(ttsSrc));
  // android-apk.yml 진단 step
  ok('TTSfix — android-apk.yml npm ls / cap ls 진단 step', /npm ls @capacitor-community\/text-to-speech/.test(apkWf) && /npx cap ls/.test(apkWf));
  // (라운드 59) CI 가 "설치/감지" 뿐 아니라 "APK 에 실제 등록"까지 증명 — capacitor.plugins.json + gradle 출력
  ok('TTSfix — android-apk.yml 가 capacitor.plugins.json/gradle 등록 증명',
     /capacitor\.plugins\.json/.test(apkWf) && /capacitor\.settings\.gradle|capacitor\.build\.gradle/.test(apkWf));
  // (라운드 59) 플러그인 해석 경로(plugins-map vs register-plugin) — 프록시 존재 ≠ 동작 구분
  ok('TTSfix — platform.js pluginSource(plugins-map/register-plugin) 노출',
     /export function nativeTtsPluginSource/.test(platSrc) && /'plugins-map'/.test(platSrc) && /'register-plugin'/.test(platSrc));
  ok('TTSfix — getNativeTtsDiagnostics 가 pluginSource 포함', /pluginSource:/.test(platSrc));
  ok('TTSfix — tts/settings 가 pluginSource 전달/표시', /pluginSource:/.test(ttsSrc) && /pluginSource/.test(setSrc));
  // (라운드 59) native-error 실패 시 Android 음성 데이터 안내
  ok('TTSfix — settings native-error → 음성 데이터 안내', /native-error[\s\S]{0,120}텍스트 음성 변환/.test(setSrc));
}

if (errs.length) {
  console.log('\nERRORS:');
  for (const e of errs) console.log(' -', e);
  process.exit(1);
} else {
  console.log('\nALL CHECKS PASSED');
  if (warnings.length) {
    console.log(`(${warnings.length} unreviewed quality warnings — see audit section)`);
  } else if (reviewedWarnings.length) {
    console.log(`(unreviewed 0 / reviewed ${reviewedWarnings.length} — 검토 후 유지, docs/content-status.md 참조)`);
  }
}

