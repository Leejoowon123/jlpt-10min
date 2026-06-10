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
const N5_MIN = { vocab: 250, grammar: 45, reading: 25, listening: 25, pairs: 8 };
for (const [k, min] of Object.entries(N5_MIN)) {
  ok(`N5 ${k} >= ${min} (대량1차)`, counts[k].N5 >= min, `actual=${counts[k].N5}`);
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
// 임계치 — N5 대량1차 기준 (N5 sentenceBank ≥ 150)
const n5Sentences = sentenceBank.filter(s => s.level === 'N5').length;
ok(`sentenceBank: N5 >= 150 (대량1차)`, n5Sentences >= 150, `actual=${n5Sentences}`);
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
//   - 명백한 오류는 ok() 로 실패 처리. 품질 경고는 console.log 로만.
//   - 향후 N5 500 / N4 확장 시에도 같은 기준 적용.
const warnings = [];
const warn = (msg) => warnings.push(msg);

console.log('\n=== 콘텐츠 품질 감사 ===');

// vocab.word 중복 → 명백한 오류로 실패
const _wordSeen = new Map();
for (const v of vocab) {
  const key = `${v.level}:${v.word}`;
  if (_wordSeen.has(key)) {
    ok(`vocab.word 중복 금지 ${v.id} vs ${_wordSeen.get(key)}: "${v.word}"`, false);
  } else {
    _wordSeen.set(key, v.id);
  }
}
ok('vocab.word 모두 고유 (레벨 내)', true); // sentinel — 위 루프가 실패하면 이미 errs에 추가

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

// vocab.exampleSentence 중복 → 경고 (같은 예문을 여러 vocab이 공유)
const _sentSeen = {};
for (const v of vocab) {
  const s = v.exampleSentence;
  (_sentSeen[s] = _sentSeen[s] || []).push(`${v.id}:${v.word}`);
}
const sentDups = Object.entries(_sentSeen).filter(([, arr]) => arr.length >= 2);
if (sentDups.length) {
  warn(`vocab exampleSentence 중복: ${sentDups.length}건`);
  for (const [s, ids] of sentDups.slice(0, 5)) warn(`  "${s}" — ${ids.join(', ')}`);
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
const KANJI_RE = /[一-鿿]/g;
const hardKanji = [];
for (const v of vocab.filter(x => x.level === 'N5')) {
  const k = (v.exampleSentence.match(KANJI_RE) || []).length;
  if (k >= 5) hardKanji.push({ id: v.id, word: v.word, kanjiCount: k, text: v.exampleSentence });
}
if (hardKanji.length) {
  hardKanji.sort((a, b) => b.kanjiCount - a.kanjiCount);
  warn(`N5 예문 한자 ≥5개: ${hardKanji.length}건 (난이도 검토 필요 후보)`);
  for (const x of hardKanji.slice(0, 5)) warn(`  ${x.id} (한자 ${x.kanjiCount}) ${x.word}: ${x.text}`);
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

// reading/listening choices 안 중복은 기존 check 가 잡음 — 보강:
//   choices 가 본문/scenario 와 무관하게 진짜 의미 있는지 정도만 경고.
let _shortChoices = 0;
for (const x of [...reading, ...listening]) {
  for (const c of x.choices) {
    if (!c || c.trim().length === 0) _shortChoices++;
  }
}
if (_shortChoices) warn(`reading/listening 빈 choice: ${_shortChoices}건`);

// sentenceBank.ja 중복 → 경고
const _sbSeen = {};
for (const s of sentenceBank) {
  (_sbSeen[s.ja] = _sbSeen[s.ja] || []).push(s.id);
}
const sbDups = Object.entries(_sbSeen).filter(([, arr]) => arr.length >= 2);
if (sbDups.length) {
  warn(`sentenceBank.ja 중복: ${sbDups.length}건`);
  for (const [s, ids] of sbDups.slice(0, 5)) warn(`  "${s}" — ${ids.join(', ')}`);
}

// 출력
console.log(`  품질 경고 수: ${warnings.length}`);
if (warnings.length) {
  console.log('  WARNINGS (상위 20):');
  for (const w of warnings.slice(0, 20)) console.log(`    - ${w}`);
}

// ── imageKey 중복 리포트 상세 (단어 예시 포함) ───────────────────
// ── 한자 데이터 검증 ──────────────────────────────────────────────
const { kanji } = await import('./js/data/kanji.js');
const { kanaChart } = await import('./js/data/kana.js');

ok('kanji is array', Array.isArray(kanji));
const _n5KanjiCount = kanji.filter(k => k.level === 'N5').length;
ok('N5 kanji >= 50 (대량1차)', _n5KanjiCount >= 50, `actual=${_n5KanjiCount}`);

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
ok('N4 vocab example furigana ≥ 80%',    pct(cN4V) >= 80, `pct=${pct(cN4V)}%`);
ok('N4 grammar example furigana ≥ 80%',  pct(cN4G) >= 80, `pct=${pct(cN4G)}%`);
ok('N4 reading passage furigana ≥ 80%',  pct(cN4R) >= 80, `pct=${pct(cN4R)}%`);
ok('N4 listening script furigana ≥ 80%', pct(cN4L) >= 80, `pct=${pct(cN4L)}%`);
ok('N4 sentenceBank furigana ≥ 80%',     pct(cN4S) >= 80, `pct=${pct(cN4S)}%`);

// N4 1차 시드 — 수량 sentinel
ok('N4 vocab ≥ 250',         vocab.filter(v=>v.level==='N4').length >= 250,
   `count=${vocab.filter(v=>v.level==='N4').length}`);
ok('N4 grammar ≥ 40',        grammar.filter(g=>g.level==='N4').length >= 40,
   `count=${grammar.filter(g=>g.level==='N4').length}`);
ok('N4 reading ≥ 20',        reading.filter(r=>r.level==='N4').length >= 20,
   `count=${reading.filter(r=>r.level==='N4').length}`);
ok('N4 listening ≥ 20',      listening.filter(l=>l.level==='N4').length >= 20,
   `count=${listening.filter(l=>l.level==='N4').length}`);
ok('N4 sentenceBank ≥ 100',  sentenceBank.filter(s=>s.level==='N4').length >= 100,
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
ok('stories — N4 이야기 ≥ 4',
   getStoriesForListing().filter(s => s.level === 'N4').length >= 4,
   `count=${getStoriesForListing().filter(s => s.level === 'N4').length}`);
ok('stories — N4 단편 소설 ≥ 2',
   getNovelsForListing().filter(s => s.level === 'N4').length >= 2,
   `count=${getNovelsForListing().filter(s => s.level === 'N4').length}`);
// N4 kanji + conversation topics
const { kanji: _kanji } = await import('./js/data/kanji.js');
ok('N4 kanji ≥ 100',
   _kanji.filter(k => k.level === 'N4').length >= 100,
   `count=${_kanji.filter(k => k.level === 'N4').length}`);
const { conversationTopics: _convs } = await import('./js/data/conversationTopics.js');
ok('N4 conversationTopics ≥ 6',
   _convs.filter(t => t.level === 'N4').length >= 6,
   `count=${_convs.filter(t => t.level === 'N4').length}`);

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
// logAction 단위 — mock writer 로 기록/스로틀/하루1회 검증
logger._setWriterForTest(async () => {});
logger._resetThrottleForTest();
const _logWrites = [];
logger._setWriterForTest(async (path, value) => { _logWrites.push({ path, value }); });
logger.logAction('study_start', { itemType: 'vocab', method: 'image' });
await new Promise(r => setTimeout(r, 10));
ok('logAction: actionLogs + 활동 노드 2건 기록 (비로그인 → anonymousActivity)',
   _logWrites.length === 2 &&
   _logWrites.some(w => w.path.startsWith('actionLogs/')) &&
   _logWrites.some(w => w.path.startsWith('anonymousActivity/')),
   `writes=${_logWrites.map(w=>w.path).join(',')}`);
ok('logAction: userType anonymous (비로그인)',
   _logWrites.find(w => w.path.startsWith('actionLogs/'))?.value.userType === 'anonymous');
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
// 테스트 전용 export + anonymousActivity 분리 (라운드 21: 공개 sendTestLog 제거)
ok('actionLogger: _sendTestLogForTest (테스트 전용) export',
   typeof logger._sendTestLogForTest === 'function');
ok('actionLogger: 공개 sendTestLog 제거됨', logger.sendTestLog === undefined);
ok('actionLogger: anonymousActivity/ 경로 분리', /anonymousActivity\//.test(loggerSrc));
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

if (errs.length) {
  console.log('\nERRORS:');
  for (const e of errs) console.log(' -', e);
  process.exit(1);
} else {
  console.log('\nALL CHECKS PASSED');
  if (warnings.length) {
    console.log(`(${warnings.length} quality warnings — see audit section)`);
  }
}

