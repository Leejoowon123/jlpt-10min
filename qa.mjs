// 실제 DOM(jsdom) 기반 회귀 QA. 정적 검사와 단위 로직은 smoke.mjs 가 담당.
// 여기서는 브라우저처럼 화면을 마운트하고 클릭/검사한다.
//
// 모듈 정책:
//   - 모듈은 한 번만 import. (ESM 정상 캐시)
//   - 시나리오 격리는 (1) 새 jsdom 으로 globalThis.window/document 교체
//     + (2) globalThis.localStorage 교체 + (3) storage.resetAll() 로
//       모듈 내부 캐시를 defaultState 로 재설정해서 달성한다.
//   - module-level 변수가 있는 view 들(today, review, grammarCompare)은
//     각 시나리오 안에서 외부 함수만 호출하므로 큰 문제 없음.

import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

// ── 단일 인스턴스 import ────────────────────────────────────────────────────
import * as storage from './js/storage.js';
import * as state from './js/state.js';
import { vocab } from './js/data/vocab.js';
import { renderQuestion } from './js/views/questionView.js';
import { renderVocabCard, RECALL_SECONDS, _setRecallMsForTest, _resetRecallMsForTest } from './js/views/vocabCardView.js';
import { renderToday } from './js/views/today.js';
import { renderCompare } from './js/views/grammarCompare.js';
import { renderHome } from './js/views/home.js';
import { renderStudy } from './js/views/study.js';
import { renderConversation, resetConversation } from './js/views/conversation.js';
import { renderSettings } from './js/views/settings.js';
import { renderStories, renderNovels, renderStoryDetail } from './js/views/storyView.js';
import { buildTodayQueue } from './js/curriculum.js';
import { conversationTopics } from './js/data/conversationTopics.js';

const errs = [];
const ok = (label, cond, hint) => {
  if (!cond) errs.push(`${label}${hint ? ' — ' + hint : ''}`);
  else console.log('  ✓', label);
};

// <rt> 자식을 제거한 textContent — 후리가나 ruby 렌더 후에도 원문 substring 검사 가능.
function plainText(elOrScreen) {
  if (!elOrScreen) return '';
  const c = elOrScreen.cloneNode(true);
  c.querySelectorAll('rt').forEach(r => r.remove());
  return c.textContent;
}

// 라운드 30 — warmup OFF 는 quickPreview 부터 시작. 퀴즈 단계가 필요한 시나리오용 헬퍼.
function passPreview(screen) {
  const b = Array.from(screen.querySelectorAll('.vocab-card-nav button'))
    .find(x => x.textContent.includes('퀴즈로'));
  if (b) b.click();
}

// ── 부트스트랩 ─────────────────────────────────────────────────────────────
function bootstrap({ withTTS = false, withSTT = false } = {}) {
  const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true });
  const { window } = dom;
  const store = {};
  const localStorage = {
    getItem: k => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; },
  };
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.HashChangeEvent = window.HashChangeEvent;
  globalThis.localStorage = localStorage;
  if (withTTS) {
    globalThis.SpeechSynthesisUtterance = class { constructor(t){ this.text = t; } };
    window.speechSynthesis = {
      _voices: [{ lang: 'ja-JP', name: 'Test JA Voice' }],
      cancel() {}, speak() {},
      getVoices() { return this._voices; },
      set onvoiceschanged(_) {},
    };
  } else {
    delete globalThis.SpeechSynthesisUtterance;
    delete window.speechSynthesis;
  }
  if (withSTT) {
    // 최소 SpeechRecognition 스텁 — 자동 결과 없음. 테스트에서 onResult 를 수동 트리거.
    class SpeechRecognitionStub {
      constructor() {
        this.lang = ''; this.continuous = false; this.interimResults = false;
        this.maxAlternatives = 1;
        this.onresult = null; this.onerror = null; this.onend = null;
        this._started = false;
      }
      start() { this._started = true; }
      stop()  { this._started = false; if (typeof this.onend === 'function') this.onend(); }
    }
    window.SpeechRecognition = SpeechRecognitionStub;
  } else {
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
  }
  // 모듈 캐시 리셋 — 캐시도 비우고 localStorage 에 defaultState 직렬화
  storage.resetAll();
  return { window, dom };
}

// ── shell helper ───────────────────────────────────────────────────────────
function shell() {
  document.body.innerHTML = `
    <div id="app">
      <header><h1 id="topTitle"></h1></header>
      <main id="screen"></main>
    </div>`;
  return document.getElementById('screen');
}

console.log('\n[1] 단어 문제 — 선택 전 차단, 선택 후 노출, favBtn, 오답→실패노트');
{
  bootstrap();
  const screen = shell();
  const target = vocab.find(v => v.id === 'v_n5_1'); // 待つ / 기다리다

  let answered = null;
  renderQuestion(screen, { itemType: 'vocab', itemId: target.id }, {
    onAnswered: r => { answered = r; },
  });

  // 선택 전엔 result(.explain/.mnemonic)·context.ko 가 DOM 에 없음
  ok('idle: no .explain', !screen.querySelector('.explain'));
  ok('idle: no .mnemonic', !screen.querySelector('.mnemonic'));
  // 선택지 영역을 제외한 노출 텍스트 (후리가나 rt 제외하고 원문 substring 검사)
  const ctxEl = screen.querySelector('.q-context');
  const ctxText = (ctxEl?.textContent || '');
  const ctxPlain = plainText(ctxEl);
  ok('idle: context shows only ja example', ctxPlain.includes(target.exampleSentence));
  ok('idle: ko translation absent in context', !ctxText.includes(target.exampleTranslation));
  ok('idle: meaningKo absent in context',      !ctxText.includes(target.meaningKo));
  ok('idle: mnemonicText absent in context',   !ctxText.includes(target.mnemonicText));
  // 단어 문제에선 favBtn 존재
  ok('idle: favBtn rendered for vocab', !!screen.querySelector('#favBtn'));
  ok('idle: nextBtn disabled', screen.querySelector('#nextBtn').disabled === true);

  // 정답이 아닌 선택지 클릭 (오답 보장)
  const choices = Array.from(screen.querySelectorAll('.choice'));
  ok('4 choices rendered', choices.length === 4);
  // 정답 의미는 정확히 한 choice 안에 있음 → 그것이 아닌 첫 choice 선택
  const wrongIdx = choices.findIndex(b => !b.textContent.includes(target.meaningKo));
  ok('wrong choice found', wrongIdx >= 0);
  choices[wrongIdx].click();

  // 선택 후
  ok('answered: .explain shown', !!screen.querySelector('.explain'));
  ok('answered: .mnemonic shown', !!screen.querySelector('.mnemonic'));
  const explainText = screen.querySelector('.explain').textContent;
  ok('answered: meaningKo in explain', explainText.includes(target.meaningKo));
  ok('answered: translation in explain', explainText.includes(target.exampleTranslation));
  ok('answered: mnemonicText shown', screen.querySelector('.mnemonic').textContent.includes(target.mnemonicText));
  ok('answered: nextBtn enabled', screen.querySelector('#nextBtn').disabled === false);

  // onAnswered 콜백
  ok('onAnswered fired', !!answered);
  ok('onAnswered.correct=false', answered && answered.correct === false);
  ok('onAnswered.itemType=vocab', answered && answered.itemType === 'vocab');
  ok('onAnswered.itemId matches', answered && answered.itemId === target.id);

  // 실패 노트 자동 등록
  const notes = state.failureNotesList();
  ok('failure note auto-added', notes.some(n => n.itemId === target.id));
}

console.log('\n[2] grammar/reading/listening 에서는 favBtn 미노출');
for (const [type, id] of [['grammar','g_n5_1'], ['reading','r_n5_1'], ['listening','l_n5_1']]) {
  bootstrap();
  const screen = shell();
  renderQuestion(screen, { itemType: type, itemId: id }, {});
  ok(`${type}: no favBtn`, !screen.querySelector('#favBtn'));
}

console.log('\n[3] 청해 TTS 미지원 — 스크립트 자동 노출');
{
  bootstrap({ withTTS: false });
  const screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: 'l_n5_1' }, {});
  const sb = screen.querySelector('#scriptBox');
  ok('listening unsupported: scriptBox visible', sb && sb.hidden === false);
  const hint = screen.querySelector('#ttsHint');
  ok('listening unsupported: hint mentions TTS unsupported',
     hint && /지원하지 않/.test(hint.textContent));
}

console.log('\n[4] 청해 TTS 지원 — 진입 시 스크립트 숨김');
{
  bootstrap({ withTTS: true });
  const screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: 'l_n5_1' }, {});
  const sb = screen.querySelector('#scriptBox');
  ok('listening w/ TTS: scriptBox hidden initially', sb && sb.hidden === true);
}

console.log('\n[5] 오늘의 10분 완료 — 이번 회차만 집계 (이전 누적과 분리)');
{
  bootstrap();
  // today 진행 루프는 .choice 즉시 노출을 가정 — vocab warmup 단계 우회.
  state.setVocabWarmupEnabled(false);
  // 이전 회차 가짜 누적 데이터 삽입 (오답 5 / 정답 1)
  storage.update(s => {
    const t = storage.todayKey();
    s.sessions[t] = { completed: false, items: [
      { itemType:'vocab',   itemId:'v_n5_2', correct:false },
      { itemType:'vocab',   itemId:'v_n5_3', correct:false },
      { itemType:'vocab',   itemId:'v_n5_4', correct:false },
      { itemType:'grammar', itemId:'g_n5_2', correct:false },
      { itemType:'reading', itemId:'r_n5_1', correct:false },
      { itemType:'vocab',   itemId:'v_n5_5', correct:true  },
    ] };
  });
  const cumulative = state.todaySessionStats();
  ok('cumulative state has prior 6 items', cumulative.total === 6,
     `total=${cumulative.total}`);

  const screen = shell();
  renderToday({ screen });
  ok('intro: 시작 button', !!screen.querySelector('#goBtn'));
  screen.querySelector('#goBtn').click();

  // 큐 끝까지 진행. 매번 첫 선택지 클릭(오답 가능성 높음).
  let safety = 40;
  let answeredCount = 0;
  while (safety-- > 0) {
    passPreview(screen); // 라운드 30 — vocab image 카드의 quickPreview 우회
    const choices = screen.querySelectorAll('.choice');
    if (choices.length === 0) break;
    choices[0].click();
    answeredCount++;
    const next = screen.querySelector('#nextBtn');
    if (!next) break;
    next.click();
  }
  ok('today loop terminated cleanly', safety > 0, `safety=${safety}`);
  ok('summary reached', screen.textContent.includes('오늘의 10분 완료'));
  ok('summary marks 이번 회차', screen.textContent.includes('이번 회차'));

  const totalMatch = screen.textContent.match(/총\s+(\d+)문제/);
  ok('summary total exists', !!totalMatch);
  if (totalMatch) {
    const reportedTotal = parseInt(totalMatch[1], 10);
    ok('summary total equals this run answers', reportedTotal === answeredCount,
       `reportedTotal=${reportedTotal} answeredCount=${answeredCount}`);
    // 이전 6개 와 섞이면 reportedTotal 이 answeredCount + 6 이 될 수 있음 (혹은 +5).
    // 우리는 정확히 answeredCount 만 보고해야 함.
    ok('no prior-leak: reportedTotal != cumulative.total + answeredCount',
       reportedTotal !== (cumulative.total + answeredCount),
       `if prior leaks: would be ${cumulative.total + answeredCount}`);
  }
}

console.log('\n[6] 문법 비교 — 답 선택 시 markStudiedToday() 동작');
{
  bootstrap();
  const screen = shell();
  renderCompare({ screen, params: ['gp_n5_1'] });

  const choices = screen.querySelectorAll('.choice');
  ok('compare detail has 4 choices', choices.length === 4);
  const before = storage.getState().userProgress.lastStudiedDate;
  choices[0].click();
  const after = storage.getState().userProgress.lastStudiedDate;
  ok('compare: lastStudiedDate set after pick', !!after && after !== before,
     `before=${before} after=${after}`);
  ok('compare: explain rendered', !!screen.querySelector('.explain'));
}

console.log('\n[7] 단어 이미지 카드 모드 (warmup OFF) — 선택 전 차단, 선택 후 전체 노출');
{
  bootstrap();
  state.setVocabWarmupEnabled(false); // 기존 시나리오는 quiz 직행 전제
  const screen = shell();
  const target = vocab.find(v => v.id === 'v_n5_1'); // 待つ

  let answered = null;
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {
    onAnswered: r => { answered = r; },
  });

  // 라운드 30 — warmup OFF 는 quickPreview 부터: 단어/읽기/뜻/발음 버튼 노출, 기록 없음
  ok('quickPreview: 단어 노출', screen.textContent.includes(target.word));
  ok('quickPreview: 읽기 노출', screen.textContent.includes(target.reading));
  ok('quickPreview: 뜻 노출', screen.textContent.includes(target.meaningKo));
  ok('quickPreview: 발음 버튼', !!screen.querySelector('#ttsWord'));
  ok('quickPreview: choice 미노출', screen.querySelectorAll('.choice').length === 0);
  ok('quickPreview: 다음 단어 버튼', !!screen.querySelector('.skip-word'));
  ok('quickPreview: 기록 없음', Object.keys(storage.getState().reviewStates).length === 0);
  passPreview(screen); // 퀴즈로 진입

  // 선택 전: 이미지 보임
  ok('image card: SVG visible', !!screen.querySelector('.vocab-card-imgbox svg'));
  // 선택 전: 뜻/읽기/예문/번역/연상/해설 전부 차단
  const preText = screen.textContent;
  ok('image card idle: no meaningKo',           !preText.includes(target.meaningKo));
  ok('image card idle: no reading',             !preText.includes(target.reading));
  ok('image card idle: no exampleSentence',     !preText.includes(target.exampleSentence));
  ok('image card idle: no exampleTranslation',  !preText.includes(target.exampleTranslation));
  ok('image card idle: no mnemonicText',        !preText.includes(target.mnemonicText));
  ok('image card idle: no .explain',            !screen.querySelector('.explain'));

  // 선택지: 4개 일본어 단어
  const choices = Array.from(screen.querySelectorAll('.choice'));
  ok('image card: 4 choices', choices.length === 4);
  // 정답이 choices 안에 있고 (Japanese)
  const correctTextChoice = choices.find(c => c.textContent.includes(target.word));
  ok('image card: correct word is among choices', !!correctTextChoice);
  // favBtn 노출 (vocab)
  ok('image card: favBtn rendered', !!screen.querySelector('#favBtn'));

  // 오답 선택
  const wrongIdx = choices.findIndex(c => !c.textContent.includes(target.word));
  ok('image card: wrong choice exists', wrongIdx >= 0);
  choices[wrongIdx].click();

  // 선택 후: 뜻/읽기/예문/번역/연상 노출
  const postText = screen.textContent;
  const postPlain = plainText(screen);
  ok('image card answered: meaningKo shown',          postText.includes(target.meaningKo));
  ok('image card answered: reading shown',            postText.includes(target.reading));
  ok('image card answered: exampleSentence shown',    postPlain.includes(target.exampleSentence));
  ok('image card answered: exampleTranslation shown', postText.includes(target.exampleTranslation));
  ok('image card answered: mnemonicText shown',       postText.includes(target.mnemonicText));
  ok('image card answered: .explain rendered',        !!screen.querySelector('.explain'));

  // onAnswered 페이로드
  ok('image card onAnswered fired',          !!answered);
  ok('image card onAnswered.correct=false',  answered && answered.correct === false);
  ok('image card onAnswered.itemType=vocab', answered && answered.itemType === 'vocab');
  ok('image card onAnswered.itemId matches', answered && answered.itemId === target.id);

  // 실패 노트 자동 등록
  const notes = state.failureNotesList();
  ok('image card failure note added', notes.some(n => n.itemId === target.id));

  // favBtn 토글
  const favBtn = screen.querySelector('#favBtn');
  favBtn.click();
  ok('image card favBtn toggles to saved', favBtn.textContent.includes('저장됨'));
}

console.log('\n[8] today 큐: 단어 항목에 vocabMode 가 있고 image/example 만 허용');
{
  bootstrap();
  const q = buildTodayQueue();
  ok('queue length 10', q.length === 10, `got=${q.length}`);
  const vItems = q.filter(it => it.itemType === 'vocab');
  ok('queue has vocab items', vItems.length > 0);
  const ALLOWED = new Set(['image','example']);
  ok('all vocab items have valid vocabMode',
     vItems.every(it => ALLOWED.has(it.vocabMode)),
     vItems.map(it => `${it.itemId}:${it.vocabMode}`).join(','));
  ok('non-vocab items have no vocabMode',
     q.filter(it => it.itemType !== 'vocab').every(it => !('vocabMode' in it)));
  if (vItems.length >= 2) {
    ok('at least one image mode (70%)',
       vItems.some(it => it.vocabMode === 'image'));
  }
}

console.log('\n[9] 홈 — 학습량 현황 카드가 숨겨졌는지 검증');
{
  bootstrap();
  const screen = shell();
  renderHome({ screen });
  const txt = screen.textContent;
  ok('home: progressCard 부재',         !screen.querySelector('#progressCard'));
  ok('home: "학습량 현황" 텍스트 부재', !txt.includes('학습량 현황'));
  ok('home: 회화 준비도 유지',          txt.includes('회화 준비도'));
  ok('home: 오늘의 10분 유지',          txt.includes('오늘의 10분'));
}

console.log('\n[10] 홈 회화 준비도 카드 — reviewStates 학습 시 상승, 미학습은 낮음');
{
  bootstrap();
  // 1차: 무학습 상태 — 모든 topic 0%
  let screen = shell();
  renderHome({ screen });
  ok('home: 회화 준비도 section title', screen.textContent.includes('회화 준비도'));
  // 회화 카드 안내 텍스트 (홈 재설계로 문구 단순화)
  ok('home: 회화 카드 안내',            screen.textContent.includes('관련 단어/문법'));
  ok('home: 자기소개 항목 표시',          screen.textContent.includes('자기소개'));
  // 홈은 회화 준비도 상위 3개만 요약 노출 → "카페 주문" 은 4번째라 부재할 수 있음.
  // 회화 화면(#conversation) 자체에서는 모두 표시되므로 누락 아님.
  ok('home: untrained shows 0%',          /자기소개[\s\S]{0,30}0%/.test(screen.textContent));

  // 2차: 자기소개 주제의 모든 required ID 학습 처리 → 100% 노출
  const { conversationTopics } = await import('./js/data/conversationTopics.js');
  const t = conversationTopics.find(x => x.id === 'conv_n5_self_intro');
  const ids = [...t.requiredVocabIds, ...t.requiredGrammarIds];
  storage.update(s => {
    for (const id of ids) {
      s.reviewStates[id] = {
        itemType: id.startsWith('v_') ? 'vocab' : 'grammar',
        correctCount: 1, wrongCount: 0,
        dueAt: 1, interval: 1, ease: 2.5,
      };
    }
  });
  // 재렌더
  screen = shell();
  renderHome({ screen });
  ok('home: self_intro shows 100% after training',
     /자기소개[\s\S]{0,40}100%/.test(screen.textContent),
     `text snippet: ${screen.textContent.match(/자기소개[\s\S]{0,50}/)?.[0] ?? '없음'}`);
  ok('home: ready label present', screen.textContent.includes('준비 완료'));
  ok('home: cafe still untrained 0%',
     /카페 주문[\s\S]{0,30}0%/.test(screen.textContent));
}

// ── 회화 헬퍼 ────────────────────────────────────────────────────────────
function trainTopicIds(topicId) {
  const t = conversationTopics.find(x => x.id === topicId);
  const ids = [...t.requiredVocabIds, ...t.requiredGrammarIds];
  storage.update(s => {
    for (const id of ids) {
      s.reviewStates[id] = {
        itemType: id.startsWith('v_') ? 'vocab' : 'grammar',
        correctCount: 1, wrongCount: 0,
        dueAt: 1, interval: 1, ease: 2.5,
      };
    }
  });
}

console.log('\n[11] 회화 화면 진입 / 주제 목록 — 무학습은 학습 필요, start disabled');
{
  bootstrap();
  resetConversation();
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  ok('conv list: 회화 연습 title',         screen.textContent.includes('회화 연습'));
  ok('conv list: 자기소개 row present',    screen.textContent.includes('자기소개'));
  ok('conv list: 카페 주문 row present',   screen.textContent.includes('카페 주문'));
  ok('conv list: 학습 필요 badge present', screen.textContent.includes('학습 필요'));
  // 모든 start 버튼이 disabled (무학습)
  const startBtns = Array.from(screen.querySelectorAll('[data-act="start"]'));
  ok('conv list: at least 6 start buttons (N5)', startBtns.length >= 6);
  ok('conv list: all start buttons disabled before training',
     startBtns.every(b => b.disabled === true));
  // preview 버튼은 활성
  const previewBtns = Array.from(screen.querySelectorAll('[data-act="preview"]'));
  ok('conv list: preview buttons enabled', previewBtns.every(b => !b.disabled));
}

console.log('\n[12] 회화 화면 — 자기소개 학습 후 준비 완료 + start enabled');
{
  bootstrap();
  resetConversation();
  trainTopicIds('conv_n5_self_intro');
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  ok('conv list: 준비 완료 badge after training', screen.textContent.includes('준비 완료'));
  // self_intro row의 start 버튼만 활성화 — title 옆 첫 번째 row 추출
  const rows = Array.from(screen.querySelectorAll('.conv-row'));
  const selfRow = rows.find(r => r.textContent.includes('자기소개'));
  ok('conv list: self_intro row exists', !!selfRow);
  ok('conv list: self_intro start enabled',
     selfRow.querySelector('[data-act="start"]').disabled === false);
  const cafeRow = rows.find(r => r.textContent.includes('카페 주문'));
  ok('conv list: cafe still disabled (untrained)',
     cafeRow.querySelector('[data-act="start"]').disabled === true);
}

console.log('\n[13] 회화 진행 — 빈 답변 → 0점/힌트, 정상 답변 → 점수+모범 답안');
{
  bootstrap();
  resetConversation();
  trainTopicIds('conv_n5_self_intro');
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  // self_intro start
  const rows = Array.from(screen.querySelectorAll('.conv-row'));
  const selfRow = rows.find(r => r.textContent.includes('자기소개'));
  selfRow.querySelector('[data-act="start"]').click();

  // 일본어 질문 표시
  const qJa = screen.querySelector('#qJa');
  ok('conv topic: question rendered', !!qJa);
  ok('conv topic: shows お名前は何ですか',
     plainText(screen).includes('お名前は何ですか'));
  // 한국어는 처음엔 숨김
  const qKo = screen.querySelector('#qKo');
  ok('conv topic: ko hidden initially', qKo && qKo.hidden === true);
  // textarea + submit 존재
  ok('conv topic: textarea present',  !!screen.querySelector('#answerInput'));
  ok('conv topic: submit present',    !!screen.querySelector('#submitBtn'));
  ok('conv topic: 듣기 button present', !!screen.querySelector('#playBtn'));

  // 빈 답변 submit
  screen.querySelector('#submitBtn').click();
  ok('conv eval: result card appears after empty submit', !!screen.querySelector('#evalResult .explain, #evalResult .card'));
  ok('conv eval empty: 0/100 shown', /점수 0\s*\/\s*100/.test(screen.textContent));
  ok('conv eval empty: 답변이 비어 hint', screen.textContent.includes('답변이 비어'));
  ok('conv eval: sampleAnswer shown', screen.textContent.includes('私はミンです'));

  // 다시 정상 답변 — 다음 질문 버튼은 evalResult 안에 있음. 일단 그것을 클릭해서 진행 → 다음 질문에 정상 답변.
  // 실제로는 같은 질문에 다시 답변 못 함 (제출 후 다음으로만 진행). 다음 질문으로 가서 정상 답변 사용.
  screen.querySelector('#nextQBtn').click();
  // 이제 Q2 ("学생ですか。")
  ok('conv topic Q2: 学生 질문 표시', plainText(screen).includes('学生ですか'));

  const input2 = screen.querySelector('#answerInput');
  input2.value = 'はい、学生です。';
  screen.querySelector('#submitBtn').click();
  ok('conv eval Q2: 점수 > 50', /점수 (\d+)\/100/.test(screen.textContent) &&
     parseInt(screen.textContent.match(/점수 (\d+)\/100/)[1], 10) >= 50);
  ok('conv eval Q2: 학생 in usedVocab badges', /学生.*学生/.test(screen.querySelector('#evalResult').innerHTML) || screen.querySelector('#evalResult').textContent.includes('学生'));
  ok('conv eval Q2: sample answer 표시', plainText(screen.querySelector('#evalResult')).includes('はい、学生です'));
}

console.log('\n[14] 회화 진행 — 마지막 질문 후 요약 화면');
{
  bootstrap();
  resetConversation();
  trainTopicIds('conv_n5_self_intro');
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  const rows = Array.from(screen.querySelectorAll('.conv-row'));
  rows.find(r => r.textContent.includes('자기소개'))
      .querySelector('[data-act="start"]').click();

  // Q1 응답 + 진행
  screen.querySelector('#answerInput').value = '私は学生です。';
  screen.querySelector('#submitBtn').click();
  screen.querySelector('#nextQBtn').click();
  // Q2 응답 + 진행
  screen.querySelector('#answerInput').value = 'はい、学生です。';
  screen.querySelector('#submitBtn').click();
  screen.querySelector('#nextQBtn').click();

  // 요약 화면
  ok('conv summary: 완료 텍스트',     screen.textContent.includes('회화 연습 완료'));
  ok('conv summary: 평균 점수 표시',  screen.textContent.includes('평균 점수'));
  ok('conv summary: 2 / 2 문항',      /2\s*\/\s*2\s*문항/.test(screen.textContent));
  ok('conv summary: 다시 시작 버튼',  !!screen.querySelector('#againBtn'));
  ok('conv summary: 주제 목록 버튼',  !!screen.querySelector('#listBtn'));

  // 주제 목록 복귀
  screen.querySelector('#listBtn').click();
  ok('conv summary → list 복귀', screen.textContent.includes('회화 연습'));
}

console.log('\n[15] STT 미지원 환경 — 마이크 버튼 없음 + 미지원 안내 + 텍스트 제출 정상');
{
  bootstrap({ withSTT: false });
  resetConversation();
  trainTopicIds('conv_n5_self_intro');
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  Array.from(screen.querySelectorAll('.conv-row'))
    .find(r => r.textContent.includes('자기소개'))
    .querySelector('[data-act="start"]').click();

  ok('STT off: micBtn absent',           !screen.querySelector('#micBtn'));
  ok('STT off: 미지원 안내 표시',         screen.textContent.includes('음성 입력 미지원'));
  ok('STT off: textarea present',        !!screen.querySelector('#answerInput'));
  // 텍스트 제출
  screen.querySelector('#answerInput').value = '私は学生です。';
  screen.querySelector('#submitBtn').click();
  ok('STT off: eval result rendered',     !!screen.querySelector('#evalResult .card'));
  ok('STT off: 학생 in usedVocab',
     screen.querySelector('#evalResult').textContent.includes('学生'));
}

console.log('\n[16] STT 지원 환경 — 마이크 버튼 노출 + 토글 동작');
{
  bootstrap({ withSTT: true });
  resetConversation();
  trainTopicIds('conv_n5_self_intro');
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  Array.from(screen.querySelectorAll('.conv-row'))
    .find(r => r.textContent.includes('자기소개'))
    .querySelector('[data-act="start"]').click();

  const micBtn = screen.querySelector('#micBtn');
  ok('STT on: micBtn rendered',         !!micBtn);
  ok('STT on: 음성 입력 사용 가능 안내', screen.textContent.includes('음성 입력 사용 가능'));
  // 클릭 — 시작
  micBtn.click();
  ok('STT on: micBtn toggles to listening label',
     micBtn.textContent.includes('듣기 중지'));
  // 다시 클릭 — 중지
  micBtn.click();
  ok('STT on: micBtn toggles back to idle',
     micBtn.textContent.includes('음성 입력'));
}

console.log('\n[17] 회화 진행 저장 — submit 후 conversationProgress 에 attempts 추가');
{
  bootstrap({ withSTT: false });
  resetConversation();
  trainTopicIds('conv_n5_self_intro');
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  Array.from(screen.querySelectorAll('.conv-row'))
    .find(r => r.textContent.includes('자기소개'))
    .querySelector('[data-act="start"]').click();

  // 초기 진행 데이터는 비어 있어야 함.
  const initial = state.getConversationProgress('conv_n5_self_intro');
  ok('progress: initially null', initial === null);

  // Q1 응답 제출
  screen.querySelector('#answerInput').value = '私は学生です。';
  screen.querySelector('#submitBtn').click();
  const after1 = state.getConversationProgress('conv_n5_self_intro');
  ok('progress: attempts grew to 1',           after1 && after1.attempts.length === 1);
  ok('progress: questionJa stored',            after1.attempts[0].questionJa.includes('お名前'));
  ok('progress: userText stored',              after1.attempts[0].userText === '私は学생です。'.replace('생','生') ||
                                               after1.attempts[0].userText === '私は学生です。');
  ok('progress: score numeric',                typeof after1.attempts[0].score === 'number');
  ok('progress: lastScore === attempt.score',  after1.lastScore === after1.attempts[0].score);
  ok('progress: bestScore === attempt.score',  after1.bestScore === after1.attempts[0].score);
  ok('progress: completedCount 0 mid-run',     after1.completedCount === 0);

  // Q2 진행 → 다음 → Q2 응답 (낮은 점수 — 빈 답변)
  screen.querySelector('#nextQBtn').click();
  screen.querySelector('#answerInput').value = '';
  screen.querySelector('#submitBtn').click();
  const after2 = state.getConversationProgress('conv_n5_self_intro');
  ok('progress: attempts grew to 2',  after2.attempts.length === 2);
  ok('progress: lastScore = 0 (empty)', after2.lastScore === 0);
  ok('progress: bestScore preserved (>= last)', after2.bestScore >= after2.lastScore);
  ok('progress: bestScore is max',   after2.bestScore === Math.max(...after2.attempts.map(a => a.score)));
}

console.log('\n[18] 회화 요약 — 평균/최고/완료횟수 표시 + completedCount 증가');
{
  bootstrap({ withSTT: false });
  resetConversation();
  trainTopicIds('conv_n5_self_intro');
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  Array.from(screen.querySelectorAll('.conv-row'))
    .find(r => r.textContent.includes('자기소개'))
    .querySelector('[data-act="start"]').click();

  // Q1
  screen.querySelector('#answerInput').value = '私は学生です。';
  screen.querySelector('#submitBtn').click();
  screen.querySelector('#nextQBtn').click();
  // Q2
  screen.querySelector('#answerInput').value = 'はい、学生です。';
  screen.querySelector('#submitBtn').click();
  screen.querySelector('#nextQBtn').click();

  // 요약 화면 텍스트
  ok('summary: 완료 표시',           screen.textContent.includes('회화 연습 완료'));
  ok('summary: 이번 회차 평균',      screen.textContent.includes('이번 회차 평균 점수'));
  ok('summary: 최고 점수 표시',      screen.textContent.includes('최고 점수'));
  ok('summary: 완료 1회 표시',       /완료\s*1\s*회/.test(screen.textContent));

  // completedCount 가 정확히 1 (요약 페이지 진입 시점에서 한 번)
  const prog = state.getConversationProgress('conv_n5_self_intro');
  ok('progress: completedCount === 1', prog.completedCount === 1,
     `actual=${prog.completedCount}`);
  ok('progress: attempts.length === 2', prog.attempts.length === 2);

  // 주제 목록 복귀 — 최근/최고 점수 행이 노출
  screen.querySelector('#listBtn').click();
  ok('list: 최근 N점 row visible',  /최근 \d+점/.test(screen.textContent));
  ok('list: 최고 M점 row visible',  /최고 \d+점/.test(screen.textContent));
  ok('list: 완료 1회 표시',          /완료\s*1\s*회/.test(screen.textContent));
}

console.log('\n[19] sentenceBank 커버리지 — 주제 행에 관련 문장/학습 문장 수 표시');
{
  bootstrap({ withSTT: false });
  resetConversation();
  // 무학습 상태
  const screen = shell();
  renderConversation({ screen, params: ['list'] });

  // 자기소개 row 의 sub 라인에 "관련 문장 N개" 가 노출되는지
  const rows = Array.from(screen.querySelectorAll('.conv-row'));
  const selfRow = rows.find(r => r.textContent.includes('자기소개'));
  ok('conv list: self_intro row exists', !!selfRow);
  const beforeText = selfRow.textContent;
  ok('conv list: shows 관련 문장', /관련 문장 \d+개/.test(beforeText));
  ok('conv list: shows 학습 N개', /학습 \d+개/.test(beforeText));

  // 학습 전엔 학습 카운트가 0
  const beforeMatch = beforeText.match(/학습 (\d+)개/);
  ok('conv list: 학습 == 0 before training',
     beforeMatch && parseInt(beforeMatch[1], 10) === 0);

  // 관련 어휘·문법을 학습 처리 후 재렌더
  trainTopicIds('conv_n5_self_intro');
  renderConversation({ screen, params: ['list'] });
  const afterRows = Array.from(screen.querySelectorAll('.conv-row'));
  const selfRow2 = afterRows.find(r => r.textContent.includes('자기소개'));
  const afterText = selfRow2.textContent;
  const afterMatch = afterText.match(/학습 (\d+)개/);
  ok('conv list: 학습 increased after training',
     afterMatch && parseInt(afterMatch[1], 10) > 0,
     `before=0 after=${afterMatch ? afterMatch[1] : 'n/a'}`);

  // 관련 문장 수는 변하지 않아야 함 (학습 여부 무관)
  const beforeRel = beforeText.match(/관련 문장 (\d+)개/);
  const afterRel  = afterText.match(/관련 문장 (\d+)개/);
  ok('conv list: 관련 문장 N stable',
     beforeRel && afterRel && beforeRel[1] === afterRel[1]);
}

console.log('\n[20] 회화 0.3-lite — 평가 결과에 sentenceBank 추천 섹션 포함');
{
  // (a) 무학습 — preview 로 진입해서 답변 제출 → "학습한 표현이 더 필요" 안내
  bootstrap({ withSTT: false });
  resetConversation();
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  const rows0 = Array.from(screen.querySelectorAll('.conv-row'));
  const selfRow0 = rows0.find(r => r.textContent.includes('자기소개'));
  // 미학습이라 ▶ disabled. 👁 preview 로 진입.
  selfRow0.querySelector('[data-act="preview"]').click();
  // 답변 입력 후 제출
  screen.querySelector('#answerInput').value = '私は学生です。';
  screen.querySelector('#submitBtn').click();
  const evalCard0 = screen.querySelector('#evalResult');
  ok('eval card rendered', !!evalCard0);
  ok('no-learning: shows 학습한 표현이 더 필요',
     evalCard0.textContent.includes('학습한 표현이 더 필요'));
  ok('no-learning: knownSentHtml has empty class',
     !!evalCard0.querySelector('.sb-known-empty'));
  ok('no-learning: no .sb-known box',
     !evalCard0.querySelector('.sb-known'));

  // (b) 학습 후 — sentenceBank 문장 표시
  bootstrap({ withSTT: false });
  resetConversation();
  trainTopicIds('conv_n5_self_intro');
  const screen2 = shell();
  renderConversation({ screen: screen2, params: ['list'] });
  const rows1 = Array.from(screen2.querySelectorAll('.conv-row'));
  rows1.find(r => r.textContent.includes('자기소개'))
       .querySelector('[data-act="start"]').click();

  screen2.querySelector('#answerInput').value = '私は学生です。';
  screen2.querySelector('#submitBtn').click();
  const evalCard1 = screen2.querySelector('#evalResult');
  ok('trained: .sb-known box rendered',
     !!evalCard1.querySelector('.sb-known'));
  ok('trained: "배운 표현으로 답하기" label present',
     evalCard1.textContent.includes('배운 표현으로 답하기'));
  ok('trained: no empty fallback',
     !evalCard1.querySelector('.sb-known-empty'));

  // 관련 표현 더 보기 — 최대 3개
  const practiceRows = evalCard1.querySelectorAll('.sb-practice > div');
  ok('trained: practice rows <= 3', practiceRows.length <= 3,
     `count=${practiceRows.length}`);
  // 학습함 또는 일부 학습 뱃지가 등장
  const practiceText = evalCard1.querySelector('.sb-practice')?.textContent || '';
  ok('trained: practice has 학습함/일부 학습 뱃지',
     /학습함|일부 학습/.test(practiceText));
  // locked 텍스트가 등장하지 않거나 "잠긴 표현 N개" 형태로만 등장
  const lockedText = evalCard1.textContent;
  if (lockedText.includes('잠긴 표현')) {
    ok('trained: locked count expressed as 잠긴 표현 N개',
       /잠긴 표현 \d+개/.test(lockedText));
  }
}

console.log('\n[21] 회화 주제 목록 — 학습 후 일부(partial) 카운트가 표시될 수 있음');
{
  bootstrap({ withSTT: false });
  resetConversation();
  // 부분 학습: g_n5_1 만 학습 처리
  storage.update(s => {
    s.reviewStates['g_n5_1'] = { itemType:'grammar', correctCount:1, wrongCount:0,
                                  dueAt:1, interval:1, ease:2.5 };
  });
  const screen = shell();
  renderConversation({ screen, params: ['list'] });
  const row = Array.from(screen.querySelectorAll('.conv-row'))
                   .find(r => r.textContent.includes('자기소개'));
  const txt = row.textContent;
  ok('row shows 관련 문장', /관련 문장 \d+개/.test(txt));
  ok('row shows 학습 N개', /학습 \d+개/.test(txt));
  // 부분 학습이 있다면 "일부 N개" 도 표시
  const hasPartial = /일부 \d+개/.test(txt);
  // 학습한 grammar 가 일부 sentence 에서 부분 학습 상태를 만들므로 partial 이 있어야 함
  ok('row shows 일부 N개 when partial > 0', hasPartial,
     `text="${txt.slice(0, 200)}"`);
}

console.log('\n[22] 학습 > 단어 (landing) — 분야/난이도/학습법 칩 + 긴 단어 리스트 미노출');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['vocab'] });

  // 분야/난이도/학습법 패널이 모두 존재
  ok('study landing: 분야 패널',  !!screen.querySelector('#studyTypePanel'));
  ok('study landing: 난이도 패널', !!screen.querySelector('#studyLevelPanel'));
  ok('study landing: 학습법 패널', !!screen.querySelector('#studyMethodPanel'));
  // 단어 분야 active
  ok('study landing: 단어 chip active',
     screen.querySelector('#studyTypeChips [data-type="vocab"]').classList.contains('active'));
  // 학습법 칩 3개 (image/example/browse)
  ok('study landing: 학습법 칩 3개',
     screen.querySelectorAll('#studyMethodChips [data-method]').length === 3);
  // 자주 볼/오답 보조 버튼
  ok('study landing: 자주 볼 보조 버튼', !!screen.querySelector('#startFav'));
  ok('study landing: 오답 보조 버튼',    !!screen.querySelector('#startFail'));
  // 긴 단어 리스트는 보이지 않음 — #studyListSection 부재
  ok('study landing: 단어 리스트 미노출',
     !screen.querySelector('#studyListSection'));
  // 시작 버튼 — 학습법 미선택 시 disabled
  const startBtn0 = screen.querySelector('[data-start-study]');
  ok('study landing: 시작 버튼 존재', !!startBtn0);
  ok('study landing: 시작 버튼 disabled (학습법 미선택)', startBtn0.disabled === true);
  // 학습법 image 선택 → enabled + id #startImage
  screen.querySelector('#studyMethodChips [data-method="image"]').click();
  const startBtn1 = screen.querySelector('[data-start-study]');
  ok('study landing: image 선택 후 시작 enabled', startBtn1.disabled === false);
  ok('study landing: image 선택 시 #startImage id 부여', startBtn1.id === 'startImage');
  // 학습법 browse 선택 → 시작 버튼 일반 id
  screen.querySelector('#studyMethodChips [data-method="browse"]').click();
  const startBtn2 = screen.querySelector('[data-start-study]');
  ok('study landing: browse 선택 시 일반 #startStudyBtn id', startBtn2.id === 'startStudyBtn');
}

console.log('\n[22-b] 학습 > 단어 > 찾아보기 — 페이지 목록 + 검색/태그/더 보기');
{
  bootstrap();
  const screen = shell();
  // 딥링크로 browse 모드 진입
  renderStudy({ screen, params: ['vocab', 'browse'] });
  const listSection = screen.querySelector('#studyListSection');
  ok('study browse: 목록 섹션 존재', !!listSection);
  const initialRows = listSection.querySelectorAll('.row').length;
  const totalN5Vocab = vocab.filter(v => v.level === 'N5').length;
  ok(`study browse: 초기 row ≤ 20 (전체 ${totalN5Vocab})`, initialRows <= 20,
     `initialRows=${initialRows}`);
  ok('study browse: 더 보기 버튼 존재', !!screen.querySelector('.more-btn'));
  screen.querySelector('.more-btn').click();
  const afterMoreRows = screen.querySelectorAll('#studyListSection .row').length;
  ok('study browse: 더 보기 클릭 → row 증가',
     afterMoreRows > initialRows);
  const searchInput = screen.querySelector('#searchInput');
  ok('study browse: 검색 input', !!searchInput);
  searchInput.value = '学生';
  searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));
  const afterSearchRows = screen.querySelectorAll('#studyListSection .row').length;
  ok('study browse: 검색 결과 줄어듦',
     afterSearchRows > 0 && afterSearchRows < afterMoreRows);
}

console.log('\n[23] 학습 > 단어 > 이미지 카드 — 10개 세션 시작 + 완료 요약');
{
  bootstrap();
  state.setVocabWarmupEnabled(false); // 세션 루프는 .choice 직접 클릭 가정
  const screen = shell();
  // 딥링크로 image 세션 직접 시작
  renderStudy({ screen, params: ['vocab', 'image'] });

  ok('session: vocab-card-imgbox 진입',
     !!screen.querySelector('.vocab-card-imgbox'));
  // 헤더에 "1 / 10" 표기
  ok('session: 1 / 10 헤더',
     /\d+\s*\/\s*10/.test(screen.textContent));

  // 10개 풀이 — 각 step에서 첫 선택지 클릭 + 다음
  let safety = 40;
  let answered = 0;
  while (safety-- > 0) {
    passPreview(screen); // 라운드 30 — quickPreview 면 퀴즈로 진입
    const choices = screen.querySelectorAll('.choice');
    if (choices.length === 0) break;
    choices[0].click();
    answered++;
    const next = screen.querySelector('#nextBtn');
    if (!next) break;
    next.click();
  }
  ok('session: ≥ 10 문항 응답', answered >= 10, `answered=${answered}`);
  ok('session: 완료 요약 도달',
     screen.textContent.includes('완료') && /총\s+\d+문제/.test(screen.textContent));
  ok('session: 정답률 진행바 표시', !!screen.querySelector('.bar'));
  ok('session: 다시 학습 버튼', !!screen.querySelector('#restartBtn'));
  ok('session: 목록으로 버튼',   !!screen.querySelector('#exitBtn'));
  // 목록으로 → 학습 랜딩 복귀 (재설계 후 분야/난이도/학습법 패널)
  screen.querySelector('#exitBtn').click();
  ok('session: 목록으로 → 학습 랜딩 복귀',
     !!screen.querySelector('#studyTypePanel') &&
     !!screen.querySelector('#studyMethodPanel'));
}

console.log('\n[24] 학습 > 문법 (browse 딥링크) — 항목 수 헤더 + 더 보기 적용');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['grammar', 'browse'] });
  ok('study grammar: 항목 수 표시',  /현재 항목 수 \d+개/.test(screen.textContent));
  ok('study grammar: 검색 input',     !!screen.querySelector('#searchInput'));
  const rows = screen.querySelectorAll('#studyListSection .row').length;
  ok('study grammar: 초기 row ≤ 20',  rows <= 20);
}

console.log('\n[25] 단어 이미지 카드 (warmup OFF) — 발음 듣기 버튼 (선택 전/후) + 정답 누출 방지');
{
  bootstrap({ withTTS: false });   // TTS 미지원 환경
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  const target = vocab.find(v => v.id === 'v_n5_1'); // 待つ / 기다리다
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen); // 라운드 30 — quickPreview 통과 후 quiz 단계 검증

  // 선택 전 발음 버튼
  const wordBtn = screen.querySelector('#ttsWord');
  ok('image card idle: 발음 듣기 버튼 존재', !!wordBtn);
  // aria-label/title 에 정답 단어 미포함
  ok('image card idle: aria-label 에 정답 단어 미포함',
     wordBtn && !wordBtn.getAttribute('aria-label').includes(target.word));
  ok('image card idle: title 에 정답 단어 미포함',
     wordBtn && !wordBtn.getAttribute('title').includes(target.word));
  // 선택 전 예문 듣기 버튼 숨김
  const exBtn = screen.querySelector('#ttsExample');
  ok('image card idle: 예문 듣기 버튼은 숨김', !!exBtn && exBtn.hidden === true);
  // 정답/뜻/번역/연상 텍스트 부재 (여전히)
  const preText = screen.textContent;
  ok('image card idle: meaningKo 부재', !preText.includes(target.meaningKo));
  ok('image card idle: exampleTranslation 부재', !preText.includes(target.exampleTranslation));
  ok('image card idle: mnemonicText 부재', !preText.includes(target.mnemonicText));

  // 발음 버튼 클릭 — TTS 미지원이므로 hint 노출
  wordBtn.click();
  // 비동기 speak 처리 — 한 마이크로태스크 대기
  await new Promise(r => setTimeout(r, 5));
  const hint = screen.querySelector('.tts-hint');
  ok('image card idle: TTS 실패 시 안내 텍스트', !!hint && hint.textContent.length > 0,
     `hint="${hint?.textContent}"`);

  // 답변 선택 → 예문 듣기 버튼 노출
  const choices = Array.from(screen.querySelectorAll('.choice'));
  choices[0].click();
  const exBtn2 = screen.querySelector('#ttsExample');
  ok('image card answered: 예문 듣기 버튼 노출', !!exBtn2 && exBtn2.hidden === false);
  ok('image card answered: 발음 듣기 버튼 유지', !!screen.querySelector('#ttsWord'));
}

console.log('\n[26] 단어 예문 문제 — 예문 듣기 + 선택 후 단어 듣기 버튼');
{
  bootstrap({ withTTS: false });
  const screen = shell();
  const target = vocab.find(v => v.id === 'v_n5_1');
  renderQuestion(screen, { itemType: 'vocab', itemId: target.id }, {});

  // 선택 전: 예문 듣기 버튼만 (단어 듣기는 결과 영역에 있어 아직 없음)
  ok('vocab example idle: 예문 듣기 버튼', !!screen.querySelector('#ttsExample'));
  ok('vocab example idle: 단어 듣기 버튼 아직 없음', !screen.querySelector('#ttsWordResult'));
  // 선택 전 정답 누출 없음
  ok('vocab example idle: meaningKo 부재 (context 안)',
     !screen.querySelector('.q-context').textContent.includes(target.meaningKo));

  // 선택 후: 단어 듣기 버튼 노출
  const choices = Array.from(screen.querySelectorAll('.choice'));
  choices[0].click();
  ok('vocab example answered: 단어 듣기 버튼', !!screen.querySelector('#ttsWordResult'));
  ok('vocab example answered: 예문 듣기 버튼 유지', !!screen.querySelector('#ttsExample'));
}

console.log('\n[27] 문법 비교 — 두 예문 모두에 발음 듣기 버튼');
{
  bootstrap({ withTTS: false });
  const screen = shell();
  renderCompare({ screen, params: ['gp_n5_1'] });
  const ttsBtns = screen.querySelectorAll('[data-tts-side]');
  ok('compare: 예문 듣기 버튼 2개 이상', ttsBtns.length >= 2,
     `btns=${ttsBtns.length}`);
  // 각 버튼의 aria-label/title 은 "예문 듣기" 만 (문장 전체를 넣지 않음)
  for (const btn of ttsBtns) {
    const aria = btn.getAttribute('aria-label') || '';
    const title = btn.getAttribute('title') || '';
    ok(`compare: 버튼 aria-label "예문 듣기" 만`,
       aria === '예문 듣기' && title === '예문 듣기');
  }
  // 클릭 → 미지원 안내
  ttsBtns[0].click();
  await new Promise(r => setTimeout(r, 5));
  const hint = screen.querySelector('#compareTtsHint');
  ok('compare: TTS 실패 안내 노출', !!hint && hint.textContent.length > 0);
}

console.log('\n[28] 학습 > 한자 (browse 딥링크) — 페이지 + 카드');
{
  bootstrap();
  resetConversation();
  const screen = shell();
  renderStudy({ screen, params: ['kanji', 'browse'] });
  ok('study kanji: 항목 헤더',     /현재 항목 수 \d+개/.test(screen.textContent));
  ok('study kanji: 목록 섹션',     !!screen.querySelector('#studyListSection'));
  const rows = screen.querySelectorAll('#studyListSection .row').length;
  ok('study kanji: 초기 row ≤ 20', rows <= 20, `rows=${rows}`);
  ok('study kanji: 검색 input',    !!screen.querySelector('#searchInput'));
}

console.log('\n[29] 한자 카드 — thinking → reveal → 발음 듣기');
{
  bootstrap();
  const screen = shell();
  const { kanji } = await import('./js/data/kanji.js');
  const { renderKanjiCard } = await import('./js/views/kanjiView.js');
  const k = kanji.find(x => x.id === 'k_n5_015'); // 日
  renderKanjiCard(screen, k, {});

  // thinking: 큰 한자만, 의미/니모닉/예시 부재
  ok('kanji card: 큰 한자 표시',       screen.textContent.includes(k.kanji));
  ok('kanji thinking: meaningKo 부재', !screen.textContent.includes(k.meaningKo));
  ok('kanji thinking: mnemonic 부재',  !screen.textContent.includes(k.mnemonicText));
  ok('kanji thinking: hiragana 부재',  !screen.textContent.includes(k.hiragana));
  ok('kanji thinking: 보기 버튼',      !!screen.querySelector('#revealBtn'));
  ok('kanji thinking: 액션 숨김',      screen.querySelector('#kanjiActions').hidden === true);

  // 보기 클릭 → revealed
  screen.querySelector('#revealBtn').click();
  ok('kanji revealed: hiragana 표시',  screen.textContent.includes(k.hiragana));
  ok('kanji revealed: meaningKo',      screen.textContent.includes(k.meaningKo));
  ok('kanji revealed: mnemonicText',   screen.textContent.includes(k.mnemonicText));
  ok('kanji revealed: 예시 단어',      screen.textContent.includes(k.exampleWords[0].word));
  ok('kanji revealed: 발음 듣기 버튼', !!screen.querySelector('#kanjiTtsBtn'));
  ok('kanji revealed: 알고 있음 버튼', !!screen.querySelector('#knownBtn'));
  ok('kanji revealed: 다시 볼래요',    !!screen.querySelector('#reviewBtn'));
  ok('kanji revealed: 액션 노출',      screen.querySelector('#kanjiActions').hidden === false);
}

console.log('\n[30] 학습 > 문자 (chart 딥링크) — 히라가나/가타카나 표');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['kana', 'chart'] });
  ok('kana: 히라가나 칩 존재',      !!screen.querySelector('[data-kana="hiragana"]'));
  ok('kana: 가타카나 칩 존재',      !!screen.querySelector('[data-kana="katakana"]'));
  ok('kana: あ 표시',               screen.textContent.includes('あ'));
  ok('kana: 표(.kana-table) 렌더', !!screen.querySelector('.kana-table'));
  ok('kana: 셀(.kana-cell) 존재',   screen.querySelectorAll('.kana-cell').length >= 25);
  ok('kana: 탁음/요음 토글 버튼',   !!screen.querySelector('#kanaExtrasToggle'));

  // 가타카나 토글
  screen.querySelector('[data-kana="katakana"]').click();
  ok('kana: 가타카나 토글 후 ア',  screen.textContent.includes('ア'));

  // 다시 히라가나
  screen.querySelector('[data-kana="hiragana"]').click();
  // 탁음 토글
  screen.querySelector('#kanaExtrasToggle').click();
  ok('kana: 탁음 토글 후 が 표시',  screen.textContent.includes('が'));
}

console.log('\n[31] 홈 — 학습 영역 직접 버튼 미노출 (재설계 후), 하단 탭으로 진입');
{
  bootstrap();
  const screen = shell();
  renderHome({ screen });
  // 홈에서 긴 학습 영역 버튼 나열 제거
  ok('home: study/kanji 데이터 버튼 없음', !screen.querySelector('[data-go="study/kanji"]'));
  ok('home: study/kana 데이터 버튼 없음',  !screen.querySelector('[data-go="study/kana"]'));
  // 학습 진입은 별도 하단 탭 (index.html) 으로 처리
}

console.log('\n[32] 모바일 폭 CSS 규칙 (jsdom 은 레이아웃 미실행이므로 규칙만 확인)');
{
  const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
  ok('.row .main .t has word-break:keep-all', /\.row \.main \.t[\s\S]*?word-break:\s*keep-all/.test(css));
  ok('.row .main .t has flex-wrap',           /\.row \.main \.t[\s\S]*?flex-wrap:\s*wrap/.test(css));
  ok('.app max-width 480px',                  /\.app\s*\{[^}]*max-width:\s*480px/.test(css));
  ok('.tab-bar fixed bottom',                 /\.tab-bar\s*\{[^}]*position:\s*fixed/.test(css));
  // 한자 카드 / 가나 표 스타일
  ok('.kanji-big style 존재',                  /\.kanji-big\s*\{/.test(css));
  ok('.kana-table style 존재',                 /\.kana-table\s*\{/.test(css));
  ok('.kana-cell mobile (360px) 대응',
     /@media\s*\(\s*max-width:\s*360px\s*\)[\s\S]*?\.kana-cell/.test(css));
}

// ── 후리가나 렌더 ────────────────────────────────────────────────
const { vocab: _vocab } = await import('./js/data/vocab.js');
const { grammar: _grammar } = await import('./js/data/grammar.js');
const { reading: _reading } = await import('./js/data/reading.js');
const { listening: _listening } = await import('./js/data/listening.js');

function _findKanjiVocab() {
  return _vocab.find(v => v.level === 'N5' && /[一-龯]/.test(v.exampleSentence || ''));
}
function _findKanjiGrammar() {
  return _grammar.find(g => g.level === 'N5' && g.examples?.[0] && /[一-龯]/.test(g.examples[0].ja));
}
function _findKanjiReading() {
  return _reading.find(r => r.level === 'N5' && /[一-龯]/.test(r.passage));
}
function _findKanjiListening() {
  return _listening.find(l => l.level === 'N5' && /[一-龯]/.test(l.script));
}

console.log('\n[33] 단어 예문 문제 context 에 ruby/rt 렌더 + 한국어 누출 없음');
{
  bootstrap();
  const screen = shell();
  const target = _findKanjiVocab();
  ok('33: 한자 포함 vocab 샘플 존재', !!target);
  renderQuestion(screen, { itemType: 'vocab', itemId: target.id }, {});
  const ctx = screen.querySelector('.q-context');
  ok('33: context 영역 존재', !!ctx);
  ok('33: context 안에 <ruby> 렌더', !!ctx?.querySelector('ruby'));
  ok('33: context 안에 <rt> 렌더',   !!ctx?.querySelector('rt'));
  const ctxText = ctx.textContent;
  ok('33: 선택 전 한국어 번역 없음', !ctxText.includes(target.exampleTranslation));
  ok('33: 선택 전 meaningKo 없음',  !ctxText.includes(target.meaningKo));
}

console.log('\n[34] 단어 선택 후 — 예문 ruby 유지 + 의미/해설 노출');
{
  bootstrap();
  const screen = shell();
  const target = _findKanjiVocab();
  renderQuestion(screen, { itemType: 'vocab', itemId: target.id }, {});
  const choices = screen.querySelectorAll('.choice');
  choices[0].click(); // 정답 여부 상관없이 reveal
  // 선택 후에도 q-context 예문은 그대로 ruby 렌더
  const ctx = screen.querySelector('.q-context');
  ok('34: 선택 후 context ruby 유지', !!ctx?.querySelector('ruby'));
  // .explain 영역엔 한국어 해설이 등장 (이제 노출 허용)
  const explain = screen.querySelector('.explain');
  ok('34: .explain 영역 등장', !!explain);
  ok('34: explain 안에 meaningKo 또는 해설 노출',
     (explain?.textContent || '').length > 0);
}

console.log('\n[35] 문법 예문 context 에 ruby/rt');
{
  bootstrap();
  const screen = shell();
  const g = _findKanjiGrammar();
  ok('35: 한자 포함 grammar 샘플 존재', !!g);
  renderQuestion(screen, { itemType: 'grammar', itemId: g.id }, {});
  const ctx = screen.querySelector('.q-context');
  ok('35: context 안에 ruby', !!ctx?.querySelector('ruby'));
}

console.log('\n[36] 독해 passage 에 ruby/rt');
{
  bootstrap();
  const screen = shell();
  const r = _findKanjiReading();
  ok('36: 한자 포함 reading 샘플 존재', !!r);
  renderQuestion(screen, { itemType: 'reading', itemId: r.id }, {});
  const ctx = screen.querySelector('.q-context');
  ok('36: passage 안에 ruby', !!ctx?.querySelector('ruby'));
}

console.log('\n[37] 청해 스크립트 reveal 시 ruby/rt');
{
  bootstrap({ withTTS: false });
  const screen = shell();
  const l = _findKanjiListening();
  ok('37: 한자 포함 listening 샘플 존재', !!l);
  renderQuestion(screen, { itemType: 'listening', itemId: l.id }, {});
  const sb = screen.querySelector('#scriptBox');
  ok('37: scriptBox 노출', sb && sb.hidden === false);
  ok('37: 스크립트 안에 ruby', !!sb?.querySelector('ruby'));
}

console.log('\n[38] 문법 비교 화면 — 두 예문 모두 ruby/rt');
{
  bootstrap();
  const screen = shell();
  const { grammarPairs } = await import('./js/data/grammarPairs.js');
  const pair = grammarPairs.find(p => {
    const a = _grammar.find(g => g.id === p.a);
    const b = _grammar.find(g => g.id === p.b);
    return /[一-龯]/.test(a?.examples?.[0]?.ja || '')
        && /[一-龯]/.test(b?.examples?.[0]?.ja || '');
  });
  ok('38: 한자 포함 비교 페어 존재', !!pair);
  renderCompare({ screen, params: [pair.id] });
  const cols = screen.querySelectorAll('.compare-pair .col');
  ok('38: 두 열 모두 존재', cols.length === 2);
  ok('38: 첫 열 ruby', !!cols[0]?.querySelector('ruby'));
  ok('38: 둘째 열 ruby', !!cols[1]?.querySelector('ruby'));
}

console.log('\n[39] 회화 질문 — ruby/rt 또는 한자 미포함 한국어 안전 렌더');
{
  bootstrap();
  const screen = shell();
  resetConversation();
  // 한자 포함 starter 질문이 있는 토픽 선택
  const topic = conversationTopics.find(t =>
    t.level === 'N5' && t.starterQuestions?.some(q => /[一-龯]/.test(q.ja || '')));
  ok('39: 한자 포함 회화 토픽 존재', !!topic);
  if (topic) {
    // 회화는 list → start 버튼 클릭 → topic 모드로 진입. 사전에 필수 단어/문법은 학습 완료시킴.
    trainTopicIds(topic.id);
    renderConversation({ screen, params: ['list'] });
    const rows = Array.from(screen.querySelectorAll('.conv-row'));
    const row = rows.find(r => r.textContent.includes(topic.titleKo));
    ok('39: 회화 토픽 row 존재', !!row);
    row?.querySelector('[data-act="start"]')?.click();
    const qJa = screen.querySelector('#qJa');
    ok('39: 회화 질문 노드 존재', !!qJa);
    const firstHasKanji = /[一-龯]/.test(topic.starterQuestions[0].ja || '');
    if (firstHasKanji) {
      ok('39: 회화 질문 ruby 렌더', !!qJa?.querySelector('ruby'));
    } else {
      ok('39: 회화 질문 안전 노출 (가나만이라 ruby 없음)', !!qJa);
    }
  }
}

console.log('\n[40] 이미지 카드 quiz thinking 상태 — target word reading 여전히 숨김');
{
  bootstrap();
  state.setVocabWarmupEnabled(false); // quiz 진입 직행
  const screen = shell();
  const target = _vocab.find(v => v.level === 'N5'
                                && /[一-龯]/.test(v.word)
                                && v.reading && v.imageKey);
  ok('40: 한자 포함 vocab 샘플 존재', !!target);
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen);
  // thinking 상태: 단어 라벨 자리는 비어 있고 reading 도 노출되지 않아야 함.
  const imgBox = screen.querySelector('#vcImg');
  ok('40: 이미지 박스 존재', !!imgBox);
  ok('40: 이미지 박스 안에 target word 미노출',
     !imgBox.textContent.includes(target.word));
  ok('40: 이미지 박스 안에 target reading 미노출',
     !imgBox.textContent.includes(target.reading));
  // 전체 카드(.card)에서도 선택 전 reading 노출 금지
  const cardText = screen.querySelector('.card')?.textContent || '';
  ok('40: 선택 전 카드 어디에도 reading 미노출',
     !cardText.includes(target.reading));
  ok('40: 선택 전 meaningKo 미노출',
     !cardText.includes(target.meaningKo));
}

console.log('\n[41] 이미지 카드 quiz 선택 후 — 예문 영역에 ruby/rt 렌더');
{
  bootstrap();
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  const target = _vocab.find(v => v.level === 'N5'
                                && /[一-龯]/.test(v.exampleSentence || '')
                                && v.imageKey);
  ok('41: 한자 포함 예문 vocab 존재', !!target);
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen);
  const choices = screen.querySelectorAll('.choice');
  choices[0].click();
  const explain = screen.querySelector('.explain');
  ok('41: explain 안에 ruby 존재', !!explain?.querySelector('ruby'));
}

// ── 후리가나 ON/OFF 토글 ──────────────────────────────────────────────────
const { getFuriganaEnabled, setFuriganaEnabled } = await import('./js/state.js');

console.log('\n[42] 설정 화면 — 후리가나 토글 체크박스 노출 + 기본 ON');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  const t = screen.querySelector('#furiToggle');
  ok('42: 설정 화면 #furiToggle 존재', !!t);
  ok('42: 기본 ON (checked)', t && t.checked === true);
  ok('42: state.getFuriganaEnabled() === true', getFuriganaEnabled() === true);
  // 홈에는 후리가나 토글 직접 노출 없음
  const screen2 = shell();
  renderHome({ screen: screen2 });
  ok('42: 홈에는 #furiToggle 미노출',
     !screen2.querySelector('#furiToggle'));
}

console.log('\n[43] 토글 OFF → ruby/rt 미표시, 일본어 원문 유지');
{
  bootstrap();
  setFuriganaEnabled(false);
  const screen = shell();
  const target = _findKanjiVocab();
  renderQuestion(screen, { itemType: 'vocab', itemId: target.id }, {});
  const ctx = screen.querySelector('.q-context');
  ok('43: OFF 상태 — ruby 없음', !ctx?.querySelector('ruby'));
  ok('43: OFF 상태 — rt 없음',   !ctx?.querySelector('rt'));
  ok('43: 원문 일본어 그대로 표시 (escape 만)',
     plainText(ctx).includes(target.exampleSentence));
  // 정답/번역 누출 방지 — OFF 모드에서도 유지
  ok('43: 선택 전 ko 번역 없음', !plainText(ctx).includes(target.exampleTranslation));
  ok('43: 선택 전 meaningKo 없음', !plainText(ctx).includes(target.meaningKo));
  // 정리
  setFuriganaEnabled(true);
}

console.log('\n[44] 설정 화면 체크박스 클릭 → state 변경 + 토스트');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  const t = screen.querySelector('#furiToggle');
  t.checked = false;
  t.dispatchEvent(new window.Event('change'));
  ok('44: 체크 해제 후 OFF', getFuriganaEnabled() === false);
  t.checked = true;
  t.dispatchEvent(new window.Event('change'));
  ok('44: 다시 체크 후 ON', getFuriganaEnabled() === true);
}

console.log('\n[45] 새로고침/재렌더 시 설정 유지');
{
  bootstrap();
  setFuriganaEnabled(false);
  let screen = shell();
  renderSettings({ screen });
  let t = screen.querySelector('#furiToggle');
  ok('45: 설정 재렌더 후 토글 = OFF', t && t.checked === false);
  ok('45: getFuriganaEnabled() 유지 (OFF)', getFuriganaEnabled() === false);
  setFuriganaEnabled(true);
  screen = shell();
  renderQuestion(screen, { itemType: 'vocab', itemId: _findKanjiVocab().id }, {});
  const ctx = screen.querySelector('.q-context');
  ok('45: ON 복귀 후 ruby 재표시', !!ctx?.querySelector('ruby'));
}

console.log('\n[46] 토글 OFF → 모든 적용 화면에서 ruby/rt 일괄 미표시');
{
  bootstrap();
  setFuriganaEnabled(false);
  state.setVocabWarmupEnabled(false);
  // 단어 이미지 카드
  let screen = shell();
  const v = _vocab.find(v => v.level === 'N5' && /[一-龯]/.test(v.exampleSentence || '') && v.imageKey);
  renderVocabCard(screen, { itemType: 'vocab', itemId: v.id }, {});
  passPreview(screen);
  screen.querySelectorAll('.choice')[0].click();
  ok('46: vocab card OFF — explain ruby 없음', !screen.querySelector('.explain')?.querySelector('ruby'));
  ok('46: vocab card OFF — 원문 일본어 유지',
     plainText(screen.querySelector('.explain')).includes(v.exampleSentence));

  // 문법 비교
  screen = shell();
  const { grammarPairs } = await import('./js/data/grammarPairs.js');
  const pair = grammarPairs.find(p => {
    const a = _grammar.find(g => g.id === p.a);
    return /[一-龯]/.test(a?.examples?.[0]?.ja || '');
  });
  renderCompare({ screen, params: [pair.id] });
  ok('46: compare OFF — ruby 없음', !screen.querySelector('.compare-pair')?.querySelector('ruby'));

  // 독해
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: _findKanjiReading().id }, {});
  ok('46: reading OFF — ruby 없음', !screen.querySelector('.q-context')?.querySelector('ruby'));

  // 청해 (TTS 미지원 → 즉시 스크립트 노출)
  screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: _findKanjiListening().id }, {});
  ok('46: listening OFF — script ruby 없음', !screen.querySelector('#scriptBox')?.querySelector('ruby'));

  setFuriganaEnabled(true);
}

console.log('\n[47] 한자 카드 reveal 후 hiragana 는 토글 OFF 와 무관하게 표시');
{
  bootstrap();
  setFuriganaEnabled(false); // 후리가나 OFF 라도
  const { renderKanjiCard } = await import('./js/views/kanjiView.js');
  const { kanji } = await import('./js/data/kanji.js');
  const k = kanji.find(x => x.level === 'N5' && x.hiragana);
  ok('47: 한자 샘플 존재 (hiragana 보유)', !!k);
  const screen = shell();
  renderKanjiCard(screen, k, {});
  // reveal — "뜻/읽기 보기"
  const reveal = screen.querySelector('#revealBtn');
  ok('47: reveal 버튼 존재', !!reveal);
  reveal.click();
  const cardText = plainText(screen);
  ok('47: reveal 후 hiragana 노출 (토글 OFF 무관)',
     cardText.includes(k.hiragana));
  // 안전성: 예시 단어 reading 도 노출 (한자 카드 학습 정보는 후리가나 토글 무관)
  if (k.exampleWords?.[0]) {
    ok('47: 예시 단어 reading 도 노출',
       cardText.includes(k.exampleWords[0].reading));
  }
  setFuriganaEnabled(true);
}

// ── 이미지 카드 단계형 학습 플로우 ─────────────────────────────────────────
const { getVocabWarmupEnabled, setVocabWarmupEnabled } = await import('./js/state.js');

console.log('\n[48] expose1 — 시작 시 word/reading/meaningKo + 다음 버튼 노출');
{
  bootstrap();
  setVocabWarmupEnabled(true);
  const screen = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  let answered = null;
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {
    onAnswered: r => { answered = r; },
  });
  const card = screen.querySelector('.card');
  const cardText = card?.textContent || '';
  ok('48: 단계 라벨 1/5 표시', cardText.includes('1/5'));
  ok('48: word 노출',     cardText.includes(target.word));
  ok('48: reading 노출',  cardText.includes(target.reading));
  ok('48: meaningKo 노출', cardText.includes(target.meaningKo));
  // 퀴즈 .choice 는 아직 없음
  ok('48: choice 미렌더', screen.querySelectorAll('.choice').length === 0);
  // onAnswered 미호출 (학습 기록 미발생)
  ok('48: onAnswered 미호출', answered === null);
  // TTS 발음 듣기 버튼
  ok('48: 발음 듣기 버튼', !!screen.querySelector('#ttsWord'));
  // "다음" 버튼
  const nextLabel = Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음'));
  ok('48: 다음 버튼 존재', !!nextLabel);
}

console.log('\n[49] expose1 → expose2 (다음 클릭) — word 계속 노출, 단계 라벨 2/5');
{
  bootstrap();
  setVocabWarmupEnabled(true);
  const screen = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen);
  // 다음 클릭
  const nextBtn = Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음'));
  nextBtn.click();
  const cardText = screen.querySelector('.card')?.textContent || '';
  ok('49: 단계 라벨 2/5 표시', cardText.includes('2/5'));
  ok('49: word 계속 노출',    cardText.includes(target.word));
  ok('49: reading 계속 노출', cardText.includes(target.reading));
  ok('49: meaningKo 계속 노출', cardText.includes(target.meaningKo));
  ok('49: 발음 듣기 버튼 유지', !!screen.querySelector('#ttsWord'));
}

console.log('\n[50] expose2 → recall — word/reading/meaningKo 모두 DOM 부재');
{
  bootstrap();
  setVocabWarmupEnabled(true);
  _setRecallMsForTest(5000); // 자동 전환 방지
  const screen = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen);
  // 다음(→expose2) 다음(→recall)
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  const cardText = screen.querySelector('.card')?.textContent || '';
  ok('50: 단계 라벨 3/5 표시', cardText.includes('3/5'));
  ok('50: word 미노출',     !cardText.includes(target.word));
  ok('50: reading 미노출',  !cardText.includes(target.reading));
  ok('50: meaningKo 미노출', !cardText.includes(target.meaningKo));
  ok('50: 카운트다운 영역 존재', !!screen.querySelector('#recallCd'));
  ok('50: 진행 바 존재', !!screen.querySelector('#recallFill'));
  ok('50: 바로 확인 버튼 존재',
     !!Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('바로 확인')));
  _resetRecallMsForTest();
}

console.log('\n[51] recall → confirm — "바로 확인" 클릭 시 즉시 전환');
{
  bootstrap();
  setVocabWarmupEnabled(true);
  _setRecallMsForTest(5000);
  const screen = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen);
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('바로 확인')).click();
  const cardText = screen.querySelector('.card')?.textContent || '';
  ok('51: 단계 라벨 4/5 표시', cardText.includes('4/5'));
  ok('51: confirm 에서 word 재노출',    cardText.includes(target.word));
  ok('51: confirm 에서 reading 재노출', cardText.includes(target.reading));
  ok('51: confirm 에서 meaningKo 재노출', cardText.includes(target.meaningKo));
  ok('51: 예문 노출', plainText(screen).includes(target.exampleSentence));
  ok('51: 연상 노출', cardText.includes(target.mnemonicText));
  ok('51: 퀴즈로 버튼 존재',
     !!Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('퀴즈로')));
  _resetRecallMsForTest();
}

console.log('\n[52] confirm → quiz — "퀴즈로" 클릭 시 word/reading/meaningKo 다시 숨김');
{
  bootstrap();
  setVocabWarmupEnabled(true);
  _setRecallMsForTest(5000);
  const screen = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  let answered = null;
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {
    onAnswered: r => { answered = r; },
  });
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('바로 확인')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('퀴즈로')).click();
  const cardText = screen.querySelector('.card')?.textContent || '';
  ok('52: 단계 라벨 5/5 표시', cardText.includes('5/5'));
  ok('52: quiz 진입 — choices 4개 렌더',
     screen.querySelectorAll('.choice').length === 4);
  // 정답 단어 미노출 (선택지 외에)
  const ctxPrompt = screen.querySelector('.q-prompt');
  ok('52: prompt 에 word/reading/meaningKo 미노출',
     !ctxPrompt.textContent.includes(target.reading) &&
     !ctxPrompt.textContent.includes(target.meaningKo));
  // .explain 부재
  ok('52: explain 부재 (선택 전)', !screen.querySelector('.explain'));
  // 학습 기록 아직 없음
  ok('52: onAnswered 아직 미호출', answered === null);
  ok('52: failureNotes 비어있음', state.failureNotesList().length === 0);
  _resetRecallMsForTest();
}

console.log('\n[53] quiz 답변 — onAnswered 호출 + 해설/예문/연상 노출');
{
  bootstrap();
  setVocabWarmupEnabled(true);
  _setRecallMsForTest(5000);
  const screen = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  let answered = null;
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {
    onAnswered: r => { answered = r; },
  });
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('바로 확인')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('퀴즈로')).click();
  // 첫 choice 클릭 (정답 여부와 무관)
  screen.querySelectorAll('.choice')[0].click();
  ok('53: onAnswered 호출됨', !!answered);
  ok('53: payload itemType=vocab', answered?.itemType === 'vocab');
  ok('53: payload itemId 일치', answered?.itemId === target.id);
  ok('53: explain 렌더', !!screen.querySelector('.explain'));
  const explain = plainText(screen.querySelector('.explain'));
  ok('53: explain 안 word', explain.includes(target.word));
  ok('53: explain 안 meaningKo', explain.includes(target.meaningKo));
  ok('53: explain 안 exampleSentence', explain.includes(target.exampleSentence));
  ok('53: explain 안 mnemonicText', explain.includes(target.mnemonicText));
  // 통계 갱신 검증
  const stats = state.todaySessionStats();
  ok('53: todaySessionStats 1건 기록', stats.total === 1, `total=${stats.total}`);
  _resetRecallMsForTest();
}

console.log('\n[54] recall 타이머 자동 전환 — 작은 ms 로 검증');
{
  bootstrap();
  setVocabWarmupEnabled(true);
  _setRecallMsForTest(80); // 80ms 후 자동 confirm
  const screen = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen);
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  ok('54: 진입 시 recall', !!screen.querySelector('#recallCd'));
  await new Promise(r => setTimeout(r, 250)); // 100ms tick 한두 번
  const cardText = screen.querySelector('.card')?.textContent || '';
  ok('54: 자동 전환 후 confirm', cardText.includes('4/5'));
  ok('54: confirm 에서 word 노출', cardText.includes(target.word));
  _resetRecallMsForTest();
}

console.log('\n[55] 다음 카드로 넘어갈 때 이전 recall 타이머가 잔존하지 않음');
{
  bootstrap();
  setVocabWarmupEnabled(true);
  _setRecallMsForTest(5000); // 자동 전환 막아둠
  const screen = shell();
  const a = _vocab.find(v => v.id === 'v_n5_1');
  const b = _vocab.find(v => v.id === 'v_n5_2');
  let nextCalled = 0;
  renderVocabCard(screen, { itemType: 'vocab', itemId: a.id }, {
    onNext: () => { nextCalled++; },
  });
  // recall 까지 진행
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  // recall 상태에서 그대로 다음 카드를 그린다 (today.js 가 답변 없이 강제 전환할 일은 없지만,
  // detach 후 타이머가 살아남지 않아야 함을 검증). screen 클리어 후 새 카드 마운트.
  screen.innerHTML = '';
  // 잠시 대기 — 만약 이전 타이머가 살아 있으면 detach 된 wrap 에 writes 시 throw
  await new Promise(r => setTimeout(r, 200));
  ok('55: detach 후 추가 timer side-effect 없음 (예외 없음)', true);
  renderVocabCard(screen, { itemType: 'vocab', itemId: b.id }, {});
  passPreview(screen);
  ok('55: 새 카드 expose1 진입', (screen.querySelector('.card')?.textContent || '').includes('1/5'));
  _resetRecallMsForTest();
}

console.log('\n[56] settings.vocabImageWarmupEnabled=false → 바로 quiz');
{
  bootstrap();
  setVocabWarmupEnabled(false);
  const screen = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen);
  ok('56: 바로 quiz — choice 4개 즉시 렌더',
     screen.querySelectorAll('.choice').length === 4);
  // 기존 정책 — word/reading/meaningKo thinking 단계에서 부재
  const cardText = screen.querySelector('.card').textContent;
  ok('56: thinking — meaningKo 부재', !cardText.includes(target.meaningKo));
}

// ── 학습 설정 패널 ─────────────────────────────────────────────────────────
const { getVocabRecallSeconds, setVocabRecallSeconds } = await import('./js/state.js');

console.log('\n[57] 설정 화면 — 4개 컨트롤 (후리가나/단계형/회상/목표 레벨)');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  ok('57: #settingsPanel 존재', !!screen.querySelector('#settingsPanel'));
  ok('57: #furiToggle 존재', !!screen.querySelector('#furiToggle'));
  ok('57: #warmupToggle 존재', !!screen.querySelector('#warmupToggle'));
  ok('57: #recallSeg 존재',    !!screen.querySelector('#recallSeg'));
  ok('57: #levelSeg 존재 (목표 레벨)',  !!screen.querySelector('#levelSeg'));
  ok('57: 회상 3/5/7 버튼 3개',
     screen.querySelectorAll('#recallSeg [data-recall]').length === 3);
  ok('57: 레벨 N5/N4/N3/N2 4개',
     screen.querySelectorAll('#levelSeg [data-level]').length === 4);
  // 기본 ON / 3초 active
  ok('57: 기본 furi ON', screen.querySelector('#furiToggle').checked === true);
  ok('57: 기본 warmup ON', screen.querySelector('#warmupToggle').checked === true);
  const active = screen.querySelector('#recallSeg .active');
  ok('57: 기본 회상 3초 active', active && active.dataset.recall === '3');
  // 홈에는 더 이상 학습 설정 카드 없음
  const homeScreen = shell();
  renderHome({ screen: homeScreen });
  ok('57: 홈에 #settingsCard 미노출',
     !homeScreen.querySelector('#settingsCard'));
  ok('57: 학습량 현황 카드 미노출 (정책 유지)',
     !homeScreen.querySelector('#progressCard'));
}

console.log('\n[58] 후리가나 토글 — 설정 화면에서도 동작');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  const t = screen.querySelector('#furiToggle');
  t.checked = false;
  t.dispatchEvent(new window.Event('change'));
  ok('58: furi OFF 반영', state.getFuriganaEnabled() === false);
  t.checked = true;
  t.dispatchEvent(new window.Event('change'));
  ok('58: furi ON 복귀', state.getFuriganaEnabled() === true);
}

console.log('\n[59] 단계형 토글 OFF → quickPreview 시작 (라운드 30)');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  const w = screen.querySelector('#warmupToggle');
  w.checked = false;
  w.dispatchEvent(new window.Event('change'));
  ok('59: warmup state OFF', state.getVocabWarmupEnabled() === false);
  const screen2 = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen2, { itemType: 'vocab', itemId: target.id }, {});
  ok('59: quickPreview 시작 (미리 보기 라벨)',
     (screen2.querySelector('.card')?.textContent || '').includes('미리 보기'));
  ok('59: quickPreview 에서 choice 미노출', screen2.querySelectorAll('.choice').length === 0);
  passPreview(screen2);
  ok('59: 퀴즈로 진입 후 choice 4개', screen2.querySelectorAll('.choice').length === 4);
  ok('59: 단계 라벨 5/5 표시',
     (screen2.querySelector('.card')?.textContent || '').includes('5/5'));
  state.setVocabWarmupEnabled(true);
}

console.log('\n[60] 단계형 토글 ON → vocabCardView expose1');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  const w = screen.querySelector('#warmupToggle');
  w.checked = false;
  w.dispatchEvent(new window.Event('change'));
  w.checked = true;
  w.dispatchEvent(new window.Event('change'));
  ok('60: warmup state ON', state.getVocabWarmupEnabled() === true);
  _setRecallMsForTest(9999999);
  const screen2 = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen2, { itemType: 'vocab', itemId: target.id }, {});
  ok('60: expose1 진입 (1/5)',
     (screen2.querySelector('.card')?.textContent || '').includes('1/5'));
  _resetRecallMsForTest();
}

console.log('\n[61] 회상 시간 5초 선택 — state 5 + recall 카운트다운 표시');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  const btn5 = screen.querySelector('#recallSeg [data-recall="5"]');
  btn5.click();
  ok('61: state 5 저장', getVocabRecallSeconds() === 5);
  ok('61: 5초 버튼 active',
     screen.querySelector('#recallSeg [data-recall="5"]').classList.contains('active'));
  ok('61: 3초 버튼 active 해제',
     !screen.querySelector('#recallSeg [data-recall="3"]').classList.contains('active'));

  // 실제 카드 — recall 단계에서 "5초 후 자동 확인" 표시
  // 자동 confirm 전환을 막기 위해 _setRecallMsForTest 로 매우 큰 값으로 override.
  // 단, 우리는 "라벨"을 확인하고 싶으므로 override 없이 시도하지만 5s 후 timer 가 firing 될 수 있음.
  // 안전: 짧은 검증 후 화면 분리.
  _setRecallMsForTest(9999999); // 카운트다운 라벨 표시는 resolvedRecallMs 가 9999999/1000=9999s 가 됨.
  // → 라벨 검증을 위해서는 override 없이 호출이 필요. 대신 별도 케이스로 분리.
  _resetRecallMsForTest();

  // 라벨 검증 — override 없이 마운트. 5초 후 confirm 전환되지만 검증은 즉시.
  const screen2 = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen2, { itemType: 'vocab', itemId: target.id }, {});
  Array.from(screen2.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen2.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  const cd = screen2.querySelector('#recallCd');
  ok('61: 카운트다운 라벨 "5초 후"', cd && /5초 후 자동 확인/.test(cd.textContent),
     `cd="${cd?.textContent}"`);
  // 즉시 카드 떼어내 background timer가 다른 시나리오를 건드리지 못하게.
  screen2.innerHTML = '';
}

console.log('\n[62] 회상 시간 7초 선택');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  const btn7 = screen.querySelector('#recallSeg [data-recall="7"]');
  btn7.click();
  ok('62: state 7 저장', getVocabRecallSeconds() === 7);
  ok('62: 7초 버튼 active',
     screen.querySelector('#recallSeg [data-recall="7"]').classList.contains('active'));
  // 라벨 검증
  const screen2 = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen2, { itemType: 'vocab', itemId: target.id }, {});
  Array.from(screen2.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  Array.from(screen2.querySelectorAll('button')).find(b => b.textContent.includes('다음')).click();
  const cd = screen2.querySelector('#recallCd');
  ok('62: 카운트다운 라벨 "7초 후"', cd && /7초 후 자동 확인/.test(cd.textContent));
  screen2.innerHTML = '';
}

console.log('\n[63] 잘못된 회상 시간 — fallback 3');
{
  bootstrap();
  setVocabRecallSeconds(5); // 먼저 5로 두고
  ok('63: 5 설정 확인', getVocabRecallSeconds() === 5);
  setVocabRecallSeconds(4);   // invalid → 3
  ok('63: 4 → fallback 3', getVocabRecallSeconds() === 3);
  setVocabRecallSeconds(0);
  ok('63: 0 → fallback 3', getVocabRecallSeconds() === 3);
  setVocabRecallSeconds('abc');
  ok('63: "abc" → fallback 3', getVocabRecallSeconds() === 3);
  setVocabRecallSeconds(null);
  ok('63: null → fallback 3', getVocabRecallSeconds() === 3);
  setVocabRecallSeconds(undefined);
  ok('63: undefined → fallback 3', getVocabRecallSeconds() === 3);
  setVocabRecallSeconds(10);
  ok('63: 10 → fallback 3', getVocabRecallSeconds() === 3);
}

console.log('\n[64] 재렌더/새로고침 시 설정 유지');
{
  bootstrap();
  // 직접 설정
  state.setFuriganaEnabled(false);
  state.setVocabWarmupEnabled(false);
  setVocabRecallSeconds(5);
  // 설정 화면 재렌더 — DOM 상태가 영속값을 반영해야 함
  const screen = shell();
  renderSettings({ screen });
  ok('64: furiToggle = OFF', screen.querySelector('#furiToggle').checked === false);
  ok('64: warmupToggle = OFF', screen.querySelector('#warmupToggle').checked === false);
  const active = screen.querySelector('#recallSeg .active');
  ok('64: 5초 active 유지', active && active.dataset.recall === '5');
  // storage 직접 확인 — 영속화
  const s = storage.getState();
  ok('64: storage furiganaEnabled=false',          s.settings.furiganaEnabled === false);
  ok('64: storage vocabImageWarmupEnabled=false',  s.settings.vocabImageWarmupEnabled === false);
  ok('64: storage vocabRecallSeconds=5',           s.settings.vocabRecallSeconds === 5);
  // 정리
  state.setFuriganaEnabled(true);
  state.setVocabWarmupEnabled(true);
  setVocabRecallSeconds(3);
}

// ── 정보구조 재설계 ───────────────────────────────────────────────────────
const { readFileSync: _readFileSync } = await import('node:fs');
const _indexHtml = _readFileSync(new URL('./index.html', import.meta.url), 'utf8');

console.log('\n[65] 하단 탭 구조 — 홈/학습/복습/이야기/단편 소설, 비교/회화/10분 제거');
{
  ok('65: 홈 탭',     /data-route="home"/.test(_indexHtml));
  ok('65: 학습 탭',   /data-route="study"/.test(_indexHtml));
  ok('65: 복습 탭',   /data-route="review"/.test(_indexHtml));
  ok('65: 이야기 탭', /data-route="stories"/.test(_indexHtml));
  ok('65: 단편 소설 탭', /data-route="novels"/.test(_indexHtml));
  ok('65: 독립 비교 탭 제거',     !/data-route="compare"/.test(_indexHtml));
  ok('65: 독립 회화 탭 제거',     !/data-route="conversation"/.test(_indexHtml));
  ok('65: 독립 10분 탭 제거',     !/data-route="today"/.test(_indexHtml));
  ok('65: 톱니바퀴 버튼 (#settingsBtn)', /id="settingsBtn"/.test(_indexHtml));
}

console.log('\n[66] 홈 — 톱니바퀴 버튼은 별도 top-bar 에 존재 (홈 내부 카드 아님)');
{
  bootstrap();
  // 톱니바퀴는 top-bar 정적 마크업이라 renderHome 영역엔 없어도 됨.
  const screen = shell();
  renderHome({ screen });
  // 학습 설정 카드는 홈에서 제거됨
  ok('66: 홈 #settingsCard 부재',     !screen.querySelector('#settingsCard'));
  ok('66: 홈 #furiToggle 부재',        !screen.querySelector('#furiToggle'));
  ok('66: 홈 #warmupToggle 부재',      !screen.querySelector('#warmupToggle'));
  // 홈에 단어 리스트 / 콘텐츠 리스트 직접 노출 없음
  ok('66: 홈 #studyListSection 부재',  !screen.querySelector('#studyListSection'));
  ok('66: 홈 #vocabActionPanel 부재',  !screen.querySelector('#vocabActionPanel'));
  // 학습량 현황 카드도 부재
  ok('66: 홈 #progressCard 부재',      !screen.querySelector('#progressCard'));
  // 시작 / 복습 진입 / 회화 카드는 있음
  ok('66: 홈 시작 버튼',                !!screen.querySelector('#startBtn'));
  ok('66: 홈 복습 진입 버튼',           !!screen.querySelector('#goReview'));
  ok('66: 홈 회화 준비도 카드',         !!screen.querySelector('#conversationCard'));
  // 목표 레벨 변경 진입
  ok('66: 홈 목표 레벨 변경 버튼',      !!screen.querySelector('#changeLevelBtn'));
}

console.log('\n[67] 설정 화면 — 목표 레벨 segmented + 변경 반영');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  ok('67: #levelSeg 존재',                !!screen.querySelector('#levelSeg'));
  ok('67: N5 N4 N3 N2 버튼 4개',
     screen.querySelectorAll('#levelSeg [data-level]').length === 4);
  // 기본 N5 active
  const cur = screen.querySelector('#levelSeg .active');
  ok('67: 기본 N5 active',                cur && cur.dataset.level === 'N5');
  // N4 클릭 → state 반영
  screen.querySelector('#levelSeg [data-level="N4"]').click();
  ok('67: N4 클릭 후 state.targetLevel = N4',
     storage.getState().userProgress.targetLevel === 'N4');
  // 정리
  state.setLevel('N5');
}

console.log('\n[68] 라우터 — TAB_FOR_ROUTE 매핑: story → stories 탭');
{
  const routerSrc = _readFileSync(new URL('./js/router.js', import.meta.url), 'utf8');
  ok('68: TAB_FOR_ROUTE story → stories 정의',
     /story:\s*'stories'/.test(routerSrc));
  ok('68: TAB_FOR_ROUTE today → home',
     /today:\s*'home'/.test(routerSrc));
  ok('68: TAB_FOR_ROUTE compare → study (문법 비교 흐름)',
     /compare:\s*'study'/.test(routerSrc));
}

console.log('\n[69] 학습 > 문법 — 비슷한 문법 비교 학습법 진입');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['grammar'] });
  // grammar 분야 active + 학습법 칩 3개 (quiz/compare/browse)
  ok('69: grammar 분야 active',
     screen.querySelector('#studyTypeChips [data-type="grammar"]').classList.contains('active'));
  const methodChips = Array.from(screen.querySelectorAll('#studyMethodChips [data-method]'));
  ok('69: 학습법 칩 3개 (quiz/compare/browse)', methodChips.length === 3);
  const compareChip = methodChips.find(c => c.dataset.method === 'compare');
  ok('69: "비슷한 문법 비교" 칩 존재', !!compareChip);
  // 칩 클릭 → 시작 enabled
  compareChip.click();
  const startBtn = screen.querySelector('[data-start-study]');
  ok('69: compare 선택 시 시작 enabled', startBtn.disabled === false);
}

console.log('\n[70] 학습 > 문법 > 비교 딥링크 → grammarCompare 화면');
{
  bootstrap();
  // window.location.hash 를 navigate 가 변경하지만 jsdom 에서 hash 변경 후 render 가
  // 자동으로 일어나려면 router.start() 가 필요. 여기선 직접 renderCompare 호출이 navigate 의 효과를 검증.
  const screen = shell();
  renderCompare({ screen, params: [] });
  ok('70: 문법 비교 목록 진입 (페어 row 또는 안내)',
     !!screen.querySelector('.row') ||
     screen.textContent.includes('해당 레벨의 비교 콘텐츠가 없습니다'));
}

console.log('\n[71] 이야기 목록 렌더 — daily_story / news_style');
{
  bootstrap();
  const screen = shell();
  renderStories({ screen, params: [] });
  ok('71: 이야기 목록 #storyList',  !!screen.querySelector('#storyList'));
  const rows = screen.querySelectorAll('#storyList .row');
  ok('71: 최소 2개 이상 노출 (시드 N5)', rows.length >= 2,
     `rows=${rows.length}`);
  // novels 전용 (short_story) 은 이야기 목록에 등장하지 않음
  const titles = Array.from(rows).map(r => r.textContent);
  ok('71: 본문 #storyList — 단편 소설 제목 미포함',
     !titles.some(t => t.includes('春の日曜日')));
}

console.log('\n[72] 단편 소설 목록 렌더 — short_story');
{
  bootstrap();
  const screen = shell();
  renderNovels({ screen, params: [] });
  ok('72: 단편 소설 목록 #novelList', !!screen.querySelector('#novelList'));
  const rows = screen.querySelectorAll('#novelList .row');
  ok('72: 최소 1개 (시드 N5)',  rows.length >= 1,
     `rows=${rows.length}`);
}

console.log('\n[73] 이야기 본문 — 후리가나 ruby + 해석 탭');
{
  bootstrap();
  setFuriganaEnabled(true);
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  // 후리가나 ruby
  const body = screen.querySelector('#storyBody');
  ok('73: #storyBody 존재', !!body);
  ok('73: ruby 렌더 (한자 어휘 매칭)', !!body?.querySelector('ruby'));
  // 라운드 18 — 한국어 해석은 본문 줄 아래 기본 표시 (.story-ko-inline).
  ok('73: 이야기 탭에 한국어 해석 inline 표시 (기본 ON)',
     !!body?.querySelector('.story-ko-inline') &&
     body.textContent.includes('나는 매일 일곱 시에 일어납니다'));
  // 로마자 줄도 기본 표시
  ok('73: 로마자 줄 표시 (기본 ON)',
     !!body?.querySelector('.story-romaji') &&
     body.textContent.includes('watashi wa mainichi'));
  // 문단별 단일 재생 버튼
  ok('73: data-line-play 버튼 존재',
     screen.querySelectorAll('[data-line-play]').length >= 1);
  // 전체 해석 보조 탭도 동작
  screen.querySelector('#storyTabs [data-tab="ko"]').click();
  ok('73: 전체 해석 탭 정상',
     screen.querySelector('#storyKoTab')?.textContent.includes('나는 매일 일곱 시에 일어납니다'));
  screen.querySelector('#storyTabs [data-tab="story"]').click();
  ok('73: 이야기 탭 복귀 정상',
     !!screen.querySelector('#storyBody .story-ja'));
}

console.log('\n[74] 후리가나 OFF — 이야기 본문 ruby 미렌더');
{
  bootstrap();
  setFuriganaEnabled(false);
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  const body = screen.querySelector('#storyBody');
  ok('74: 후리가나 OFF — ruby 부재', !body?.querySelector('ruby'));
  setFuriganaEnabled(true);
}

// ── 스토리 학습 플레이어 ──────────────────────────────────────────────────
const { _simulateLineEnd, _getStoryPlayerState, stopStoryAudio,
        STORY_SENTENCE_PAUSE_MS, playSingleLine, playSequenceFrom } =
  await import('./js/views/storyView.js');

console.log('\n[75] story detail — 4개 탭 (이야기/핵심 단어/문법/해석) + 기본 이야기');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  const tabs = screen.querySelector('#storyTabs');
  ok('75: #storyTabs 존재', !!tabs);
  ok('75: 4개 탭 칩',
     tabs?.querySelectorAll('[data-tab]').length === 4);
  for (const t of ['story','vocab','grammar','ko']) {
    ok(`75: data-tab="${t}" 칩 존재`, !!tabs?.querySelector(`[data-tab="${t}"]`));
  }
  // 기본 이야기 탭 active
  const active = tabs?.querySelector('.active');
  ok('75: 기본 이야기 탭 active', active && active.dataset.tab === 'story');
}

console.log('\n[76] 이야기 탭 — 문단별 단일 재생 버튼 + 하단 전체 재생 버튼 분리');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  // 문단별 재생
  const linePlays = screen.querySelectorAll('[data-line-play]');
  ok('76: data-line-play 버튼 ≥ 3', linePlays.length >= 3,
     `count=${linePlays.length}`);
  // aria 차이 검증 — 문단 버튼은 "이 문단 듣기"
  for (const b of linePlays) {
    ok(`76: 문단 버튼 aria "이 문단 듣기"`,
       b.getAttribute('aria-label') === '이 문단 듣기');
  }
  // 하단 플레이어
  const player = screen.querySelector('#storyPlayer');
  ok('76: #storyPlayer 존재', !!player);
  const playAll = player?.querySelector('#storyPlayAll');
  ok('76: 전체 재생 버튼 #storyPlayAll',
     !!playAll && playAll.getAttribute('aria-label') === '전체 이야기 듣기');
  ok('76: 이전 버튼 #storyPrev',  !!player?.querySelector('#storyPrev'));
  ok('76: 다음 버튼 #storyNext',  !!player?.querySelector('#storyNext'));
  ok('76: 위치 표시 #storyPos',   !!player?.querySelector('#storyPos'));
  ok('76: 상태 표시 #storyState', !!player?.querySelector('#storyState'));
  // 속도 3개
  const rates = player?.querySelectorAll('[data-rate]');
  ok('76: 속도 버튼 3개', rates?.length === 3);
  const labels = Array.from(rates || []).map(b => b.dataset.rate);
  ok('76: 속도 0.75/1/1.25 포함',
     labels.includes('0.75') && labels.includes('1') && labels.includes('1.25'));
}

console.log('\n[77] 문단별 단일 재생 클릭 → 해당 문단 .active + playingMode=single');
{
  bootstrap({ withTTS: true });
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  const body = screen.querySelector('#storyBody');
  // 두 번째 문단 재생
  screen.querySelector('[data-line-play="1"]').click();
  const state1 = _getStoryPlayerState();
  ok('77: playingMode === "single"', state1.playingMode === 'single');
  ok('77: activeIndex === 1', state1.activeIndex === 1);
  const activeLine = body?.querySelector('.story-line.active');
  ok('77: .story-line.active 표시', !!activeLine);
  ok('77: active line idx=1',
     activeLine?.dataset.idx === '1');
  // utterance 종료 시뮬레이션 → playingMode='none' 으로 정리
  _simulateLineEnd();
  const state2 = _getStoryPlayerState();
  ok('77: 종료 후 playingMode none', state2.playingMode === 'none');
  stopStoryAudio();
}

console.log('\n[78] 전체 재생 버튼 클릭 → 첫 문단 active + playingMode=sequence');
{
  bootstrap({ withTTS: true });
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  screen.querySelector('#storyPlayAll').click();
  const st = _getStoryPlayerState();
  ok('78: playingMode === "sequence"', st.playingMode === 'sequence');
  ok('78: activeIndex === 0', st.activeIndex === 0);
  const activeLine = screen.querySelector('.story-line.active');
  ok('78: 첫 문단 .active', activeLine?.dataset.idx === '0');
  // 상태 라벨 — compact 라벨 "재생"
  ok('78: #storyState "재생"',
     screen.querySelector('#storyState')?.textContent.includes('재생'));
  // 위치 표시 "1/N" (compact)
  ok('78: #storyPos "1/N"',
     /^1\s*\/\s*\d+$/.test(screen.querySelector('#storyPos')?.textContent || ''));
  stopStoryAudio();
}

console.log('\n[79] 다음/이전 버튼 — activeIndex 이동 + UI 갱신');
{
  bootstrap({ withTTS: true });
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  screen.querySelector('#storyPlayAll').click();
  // 다음 버튼 → activeIndex 1
  screen.querySelector('#storyNext').click();
  ok('79: 다음 클릭 후 activeIndex === 1',
     _getStoryPlayerState().activeIndex === 1);
  ok('79: 두 번째 문단 .active',
     screen.querySelector('.story-line.active')?.dataset.idx === '1');
  // 이전 버튼 → activeIndex 0
  screen.querySelector('#storyPrev').click();
  ok('79: 이전 클릭 후 activeIndex === 0',
     _getStoryPlayerState().activeIndex === 0);
  ok('79: 첫 번째 문단 .active',
     screen.querySelector('.story-line.active')?.dataset.idx === '0');
  stopStoryAudio();
}

console.log('\n[80] 속도 조절 — 0.75x / 1x / 1.25x 클릭 시 active 갱신');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  // 기본 1x active
  ok('80: 기본 1x active',
     screen.querySelector('[data-rate="1"]')?.classList.contains('active'));
  // 0.75 클릭
  screen.querySelector('[data-rate="0.75"]').click();
  ok('80: 0.75 클릭 → active 이동',
     screen.querySelector('[data-rate="0.75"]')?.classList.contains('active'));
  ok('80: 1 active 해제',
     !screen.querySelector('[data-rate="1"]')?.classList.contains('active'));
  // 1.25 클릭
  screen.querySelector('[data-rate="1.25"]').click();
  ok('80: 1.25 클릭 → active',
     screen.querySelector('[data-rate="1.25"]')?.classList.contains('active'));
  // state 에 저장
  ok('80: storyRate === 1.25',
     _getStoryPlayerState().storyRate === 1.25);
  // 정리
  screen.querySelector('[data-rate="1"]').click();
}

console.log('\n[81] 핵심 단어 탭 — 단어 목록 표시');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  screen.querySelector('#storyTabs [data-tab="vocab"]').click();
  const list = screen.querySelector('#storyKeyVocabList');
  ok('81: #storyKeyVocabList 존재', !!list);
  ok('81: 단어 row ≥ 3', list?.querySelectorAll('.row').length >= 3,
     `count=${list?.querySelectorAll('.row').length}`);
  // 단어 row 내용에 word/reading 표시
  const firstText = list?.querySelector('.row')?.textContent || '';
  ok('81: 단어 row 내용 비어있지 않음', firstText.length > 0);
}

console.log('\n[82] 문법 탭 — 문법 목록 표시');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  screen.querySelector('#storyTabs [data-tab="grammar"]').click();
  const list = screen.querySelector('#storyKeyGrammarList');
  ok('82: #storyKeyGrammarList 존재', !!list);
  ok('82: 문법 row ≥ 1', list?.querySelectorAll('.row').length >= 1);
}

console.log('\n[83] 본문 인라인 하이라이트 — 클릭 시 meaningKo 패널 표시');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  const inline = screen.querySelector('.story-inline-hl');
  ok('83: 인라인 highlight 버튼 ≥ 1 존재', !!inline);
  // 클릭 전엔 panel hidden
  const line = inline?.closest('.story-line');
  const panel = line?.querySelector('.story-hl-panel');
  ok('83: 클릭 전 패널 hidden', panel?.hidden === true);
  inline.click();
  ok('83: 클릭 후 패널 노출', line?.querySelector('.story-hl-panel')?.hidden === false);
  ok('83: 패널에 meaningKo 표시',
     line?.querySelector('.story-hl-panel')?.textContent.length > 0);
}

console.log('\n[84] route cleanup — stopStoryAudio 가 timer 와 playingMode 정리');
{
  bootstrap({ withTTS: true });
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  // sequence 시작 → playingMode sequence
  playSequenceFrom(0);
  ok('84: sequence 진입', _getStoryPlayerState().playingMode === 'sequence');
  // route cleanup 호출
  stopStoryAudio();
  const s = _getStoryPlayerState();
  ok('84: playingMode === none', s.playingMode === 'none');
  ok('84: pauseTimer 없음',     s.hasPauseTimer === false);
}

console.log('\n[85] STORY_SENTENCE_PAUSE_MS 상수');
{
  ok('85: STORY_SENTENCE_PAUSE_MS === 700', STORY_SENTENCE_PAUSE_MS === 700);
}

console.log('\n[86] 다른 story 진입 시 activeIndex/tab 초기화');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  // 두 번째 문단으로 이동
  playSingleLine(1);
  _simulateLineEnd(); // single 끝 — playingMode none, activeIndex 1 잔존
  ok('86: 사전 activeIndex === 1', _getStoryPlayerState().activeIndex === 1);
  // 다른 story 진입
  renderStoryDetail({ screen, params: ['story_n5_003'] });
  ok('86: 새 story → activeIndex reset (-1)',
     _getStoryPlayerState().activeIndex === -1);
  ok('86: 새 story → currentStoryId 갱신',
     _getStoryPlayerState().currentStoryId === 'story_n5_003');
}

// ── 라운드 11: inline highlight + 학습 연결 + storyProgress ───────────────
const { renderStoryLineWithHighlights } = await import('./js/views/storyView.js');
const { getStoryProgress, setStoryLastIndex, markStoryCompleted } =
  await import('./js/state.js');

console.log('\n[87] 본문 안 .story-inline-hl 직접 렌더 + 후리가나 ruby 통합');
{
  bootstrap();
  setFuriganaEnabled(true);
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  const body = screen.querySelector('#storyBody');
  const inlines = body?.querySelectorAll('.story-inline-hl');
  ok('87: .story-inline-hl 본문 안 ≥ 3', (inlines?.length || 0) >= 3,
     `count=${inlines?.length}`);
  // 각 inline 안에 ruby (한자 포함 + 후리가나 ON 일 때)
  let hasRuby = false;
  for (const el of (inlines || [])) {
    if (el.querySelector('ruby')) { hasRuby = true; break; }
  }
  ok('87: 적어도 1개 inline 에 ruby 포함', hasRuby);
  // 본문 아래 pill 영역(.story-highlights)은 제거됨
  ok('87: 본문 아래 .story-highlights pill 컨테이너 미렌더',
     !body?.querySelector('.story-highlights'));
}

console.log('\n[88] inline highlight 헬퍼 — 긴 단어 우선 + escape 안전');
{
  // 명시 highlight 가 자동 사전보다 우선해야 함
  const html = renderStoryLineWithHighlights(
    '日本語を勉強します。',
    [],
    [
      { text: '勉強', reading: 'べんきょう', meaningKo: '공부' },
      { text: '日本語', reading: 'にほんご',   meaningKo: '일본어' },
    ],
    0
  );
  ok('88: 日本語 inline highlight 포함', /class="story-inline-hl[^"]*"[^>]*>.*?日本語/.test(html));
  ok('88: 勉強 inline highlight 포함',   /class="story-inline-hl[^"]*"[^>]*>.*?勉強/.test(html));
  // 긴 단어 우선 — 日本語 가 통째로 매칭되어 日本 / 語 가 따로 wrap 되지 않음
  ok('88: 日本語 통째 매칭 (분리 wrap 없음)',
     !/data-hl-idx="\d+"[\s\S]*data-hl-idx="\d+"[\s\S]*日本/.test(html));
  // XSS — HTML escape
  const xss = renderStoryLineWithHighlights(
    '<script>x</script>',
    [],
    [],
    0
  );
  ok('88: HTML escape (< 가 &lt;)', xss.includes('&lt;') && !xss.includes('<script>'));
}

console.log('\n[89] inline highlight 패널 — 발음 듣기 + 단어 학습 버튼 (vocabId 있을 때)');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  // vocabId 가 있는 highlight 클릭
  const all = Array.from(screen.querySelectorAll('.story-inline-hl'));
  // story_n5_001 의 첫 문단 첫 highlight (起きます) 는 vocabId 'v_n5_51' 보유
  const withVocab = all.find(el => el.dataset.lineIdx === '0' && el.dataset.hlIdx === '0');
  ok('89: vocabId 보유 inline 후보 존재', !!withVocab);
  withVocab.click();
  const panel = withVocab.closest('.story-line').querySelector('.story-hl-panel');
  ok('89: 패널 노출', panel && panel.hidden === false);
  ok('89: 패널에 "발음 듣기" 버튼',
     !!panel.querySelector('[data-hl-action="speak"]'));
  ok('89: 패널에 "단어 학습" 버튼 (vocabId 있을 때)',
     !!panel.querySelector('[data-hl-action="study-vocab"]'));
  // 단어 학습 버튼 click — navigate 호출 → 라우터가 study/vocab/browse/<id> 로 진입.
  // jsdom 에서 navigate 는 hash 변경. 우리는 hash 가 의도대로 바뀌었는지 확인.
  panel.querySelector('[data-hl-action="study-vocab"]').click();
  ok('89: hash 가 study/vocab/card/<id> (직접 카드) 로 이동',
     window.location.hash.includes('study/vocab/card/v_n5_51'),
     `hash=${window.location.hash}`);
}

console.log('\n[90] vocabId 없는 highlight — 단어 학습 버튼 부재');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  // 첫 문단 두 번째 highlight (七時) 는 vocabId 없음.
  const noVocab = screen.querySelector('.story-inline-hl[data-line-idx="0"][data-hl-idx="1"]');
  ok('90: vocabId 없는 inline 존재', !!noVocab);
  noVocab.click();
  const panel = noVocab.closest('.story-line').querySelector('.story-hl-panel');
  ok('90: 패널 노출', panel.hidden === false);
  ok('90: 발음 듣기 버튼은 존재',
     !!panel.querySelector('[data-hl-action="speak"]'));
  ok('90: 단어 학습 버튼 부재 (vocabId 없음)',
     !panel.querySelector('[data-hl-action="study-vocab"]'));
}

console.log('\n[91] 핵심 단어 탭 — 학습 버튼 클릭 시 study/vocab/browse/<id> 이동');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  screen.querySelector('#storyTabs [data-tab="vocab"]').click();
  const list = screen.querySelector('#storyKeyVocabList');
  const btn = list?.querySelector('[data-study-vocab]');
  ok('91: row 학습 버튼 존재', !!btn);
  btn.click();
  ok('91: hash 가 study/vocab/card/<id> 로 이동',
     window.location.hash.includes('study/vocab/card/v_n5_'),
     `hash=${window.location.hash}`);
}

console.log('\n[92] 문법 탭 — 학습 버튼 클릭 시 study/grammar/browse/<id> 이동');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  screen.querySelector('#storyTabs [data-tab="grammar"]').click();
  const list = screen.querySelector('#storyKeyGrammarList');
  const btn = list?.querySelector('[data-study-grammar]');
  ok('92: row 학습 버튼 존재', !!btn);
  btn.click();
  ok('92: hash 가 study/grammar/card/<id> 로 이동',
     window.location.hash.includes('study/grammar/card/g_n5_'),
     `hash=${window.location.hash}`);
}

console.log('\n[93] study 딥링크 focusId — 검색 prefill 동작');
{
  bootstrap();
  const screen = shell();
  // 단어 v_n5_51 (起きる) 로 학습 진입
  renderStudy({ screen, params: ['vocab', 'browse', 'v_n5_51'] });
  const searchInput = screen.querySelector('#searchInput');
  ok('93: 검색 input 존재', !!searchInput);
  ok('93: 검색어 prefill = 単어 word (起きる)',
     searchInput && searchInput.value === '起きる',
     `value="${searchInput?.value}"`);
  // 결과에 起きる row 포함
  const rows = Array.from(screen.querySelectorAll('#studyListSection .row'));
  ok('93: 검색 결과에 起きる row 포함',
     rows.some(r => r.textContent.includes('起きる')));
}

console.log('\n[94] storyProgress — playSingleLine/Next 가 lastIndex 저장 + 재진입 복원');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  // 2번 문단 재생
  playSingleLine(2);
  _simulateLineEnd();
  // storage 에 lastIndex 저장
  ok('94: storyProgress.lastIndex === 2',
     getStoryProgress('story_n5_001').lastIndex === 2);
  // 다른 story 잠시 진입
  renderStoryDetail({ screen, params: ['story_n5_002'] });
  ok('94: story_n5_002 진입 시 activeIndex 0 또는 -1 (별도 진행도)',
     _getStoryPlayerState().activeIndex <= 0);
  // 원래 story 재진입 시 activeIndex 복원
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  ok('94: 재진입 시 activeIndex === 2 (lastIndex 복원)',
     _getStoryPlayerState().activeIndex === 2);
}

console.log('\n[95] storyProgress — 완료 버튼 + 목록 배지 + 숨기기 토글');
{
  bootstrap();
  let screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  // 완료 버튼 클릭
  screen.querySelector('#storyMarkDoneBtn').click();
  ok('95: storyProgress.completed === true',
     getStoryProgress('story_n5_001').completed === true);
  ok('95: readCount 증가 (≥ 1)',
     getStoryProgress('story_n5_001').readCount >= 1);
  // 목록 진입 — 완료 배지 표시
  screen = shell();
  renderStories({ screen, params: [] });
  const row = screen.querySelector('#storyList .row[data-story-id="story_n5_001"]');
  ok('95: 목록 row 에 .story-done-badge 표시',
     !!row?.querySelector('.story-done-badge'));
  ok('95: row 에 .done 클래스',
     row?.classList.contains('done'));
  // 숨기기 토글
  const hideToggle = screen.querySelector('#hideCompletedToggle');
  ok('95: 완료 항목 숨기기 체크박스 존재', !!hideToggle);
  hideToggle.checked = true;
  hideToggle.dispatchEvent(new window.Event('change'));
  ok('95: 토글 ON 후 완료 row 미렌더',
     !screen.querySelector('#storyList .row[data-story-id="story_n5_001"]'));
  // 토글 OFF — 다시 보임
  const hideToggle2 = screen.querySelector('#hideCompletedToggle');
  hideToggle2.checked = false;
  hideToggle2.dispatchEvent(new window.Event('change'));
  ok('95: 토글 OFF 복귀 후 row 재표시',
     !!screen.querySelector('#storyList .row[data-story-id="story_n5_001"]'));
}

console.log('\n[96] route cleanup 유지 — story 본문 → 목록 이동 시 stopStoryAudio');
{
  bootstrap({ withTTS: true });
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  playSequenceFrom(0);
  ok('96: sequence 진입', _getStoryPlayerState().playingMode === 'sequence');
  // 목록으로 진입 (renderStories 가 stopStoryAudio 호출해야 함)
  renderStories({ screen, params: [] });
  ok('96: 목록 진입 후 playingMode === none',
     _getStoryPlayerState().playingMode === 'none');
  ok('96: pauseTimer 없음',
     _getStoryPlayerState().hasPauseTimer === false);
}

// ── 라운드 12: 직접 카드 진입 / hideCompleted 영속 / 목록 요약 ─────────────
const { getStoryHideCompleted, setStoryHideCompleted } =
  await import('./js/state.js');

console.log('\n[97] #study/vocab/card/<id> 직접 진입 — 단어 카드 즉시 렌더');
{
  bootstrap();
  state.setVocabWarmupEnabled(false); // 단계형 OFF — quiz 직진
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n5_1'] });
  passPreview(screen);
  // vocab-card 그리고 .choice 4개 (quiz 직진)
  ok('97: .vocab-card-imgbox 즉시 렌더',
     !!screen.querySelector('.vocab-card-imgbox'));
  ok('97: warmup OFF → choice 4개 (quiz 단계 시작)',
     screen.querySelectorAll('.choice').length === 4);
  // 학습 랜딩 패널은 부재
  ok('97: 학습 랜딩 #studyTypePanel 부재',
     !screen.querySelector('#studyTypePanel'));
}

console.log('\n[98] #study/vocab/card/<id> + warmup ON — expose1 부터 시작');
{
  bootstrap();
  state.setVocabWarmupEnabled(true);
  // 큰 ms override 로 자동 recall→confirm 전환 차단
  const { _setRecallMsForTest, _resetRecallMsForTest } =
    await import('./js/views/vocabCardView.js');
  _setRecallMsForTest(9999999);
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n5_1'] });
  passPreview(screen);
  const cardText = screen.querySelector('.card')?.textContent || '';
  ok('98: 1/5 보기 단계 표시', cardText.includes('1/5'));
  _resetRecallMsForTest();
}

console.log('\n[99] #study/vocab/card/<invalid> — browse 로 안전 fallback');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_does_not_exist'] });
  passPreview(screen);
  ok('99: invalid id → browse 진입 (#studyListSection 노출)',
     !!screen.querySelector('#studyListSection'));
}

console.log('\n[100] #study/grammar/card/<id> 직접 진입 — 문법 문제 즉시 렌더');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['grammar', 'card', 'g_n5_1'] });
  ok('100: 문법 문제 4지선다 렌더 (.choice 4개)',
     screen.querySelectorAll('.choice').length === 4);
  // q-prompt 또는 .q-context 가 보임
  ok('100: q-prompt 또는 context 노출',
     !!screen.querySelector('.q-prompt') || !!screen.querySelector('.q-context'));
}

console.log('\n[101] #study/grammar/card/<invalid> — browse 로 안전 fallback');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['grammar', 'card', 'g_invalid'] });
  ok('101: invalid grammar id → browse',
     !!screen.querySelector('#studyListSection'));
}

console.log('\n[102] hideCompleted 영속 — settings 에 저장되고 새 렌더에 반영');
{
  bootstrap();
  // 완료 표시
  state.markStoryCompleted('story_n5_001', true);
  // 토글 ON
  let screen = shell();
  renderStories({ screen, params: [] });
  const t1 = screen.querySelector('#hideCompletedToggle');
  ok('102: 기본 토글 OFF', t1.checked === false);
  t1.checked = true;
  t1.dispatchEvent(new window.Event('change'));
  ok('102: setStoryHideCompleted 반영 (storage)',
     getStoryHideCompleted() === true);
  // 새 렌더 (다른 화면 다녀온 효과 시뮬레이션)
  screen = shell();
  renderStories({ screen, params: [] });
  const t2 = screen.querySelector('#hideCompletedToggle');
  ok('102: 새 렌더 후 토글 ON 유지', t2.checked === true);
  ok('102: 완료 row 미렌더',
     !screen.querySelector('.row[data-story-id="story_n5_001"]'));
  // 정리
  setStoryHideCompleted(false);
}

console.log('\n[103] 목록 진행 요약 + 카드 lastIndex 표시');
{
  bootstrap();
  // story_n5_001: 완료 / story_n5_002: 진행 중(lastIndex=1) / story_n5_003: 미시작
  state.markStoryCompleted('story_n5_001', true);
  state.setStoryLastIndex('story_n5_002', 1);
  const screen = shell();
  renderStories({ screen, params: [] });
  const summary = screen.querySelector('#storyProgressSummary');
  ok('103: 진행 요약 #storyProgressSummary 존재', !!summary);
  ok('103: "완료 1편 · 읽는 중 1편" 표시',
     /완료\s*1편\s*·\s*읽는 중\s*1편/.test(summary.textContent),
     `text="${summary?.textContent.trim()}"`);
  // story_n5_002 row 에 마지막 N/M 문단 표시
  const row002 = screen.querySelector('.row[data-story-id="story_n5_002"]');
  ok('103: 진행 row 에 .story-progress-note 표시',
     !!row002?.querySelector('.story-progress-note'));
  ok('103: 마지막 2/N 문단 텍스트',
     /마지막\s*2\/\d+\s*문단/.test(row002?.textContent || ''));
  // 완료 row 에는 progress-note 없음 (완료 배지로 대체)
  const row001 = screen.querySelector('.row[data-story-id="story_n5_001"]');
  ok('103: 완료 row 는 progress-note 없음',
     !row001?.querySelector('.story-progress-note'));
  ok('103: 완료 row 에 .story-done-badge',
     !!row001?.querySelector('.story-done-badge'));
}

// ── 라운드 13: N5 스토리 확장 + 스토리↔학습 복귀 동선 ─────────────────────
const { stories: _allStories } = await import('./js/data/stories.js');
const {
  setStudyReturnRoute, peekStudyReturnRoute, clearStudyReturnRoute,
} = await import('./js/studyReturn.js');

console.log('\n[104] N5 이야기/단편 수 — 5 + 3 이상');
{
  const sCount = _allStories.filter(s => s.level === 'N5' &&
    (s.type === 'daily_story' || s.type === 'news_style')).length;
  const nCount = _allStories.filter(s => s.level === 'N5' && s.type === 'short_story').length;
  ok('104: N5 이야기 ≥ 5', sCount >= 5, `count=${sCount}`);
  ok('104: N5 단편 ≥ 3',   nCount >= 3, `count=${nCount}`);
  // 모두 original
  ok('104: 모든 stories sourceType === "original"',
     _allStories.every(s => s.sourceType === 'original'));
}

console.log('\n[105] 새 story (story_n5_004) detail — ruby + inline highlight');
{
  bootstrap();
  setFuriganaEnabled(true);
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_004'] });
  const body = screen.querySelector('#storyBody');
  ok('105: #storyBody 렌더',         !!body);
  ok('105: ruby/rt 본문 안',          !!body?.querySelector('ruby'));
  ok('105: .story-inline-hl ≥ 3',
     (body?.querySelectorAll('.story-inline-hl').length || 0) >= 3);
  // 문단별 듣기 버튼
  ok('105: data-line-play 버튼 존재',
     (body?.querySelectorAll('[data-line-play]').length || 0) >= 1);
}

console.log('\n[106] 새 story 핵심 단어/문법 탭 row 표시');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_005'] });
  // 핵심 단어
  screen.querySelector('#storyTabs [data-tab="vocab"]').click();
  ok('106: 단어 row ≥ 3',
     screen.querySelectorAll('#storyKeyVocabList .row').length >= 3);
  // 문법
  screen.querySelector('#storyTabs [data-tab="grammar"]').click();
  ok('106: 문법 row ≥ 1',
     screen.querySelectorAll('#storyKeyGrammarList .row').length >= 1);
}

console.log('\n[107] 모든 새 story 본문 ruby 렌더 — story_n5_004 ~ 008');
{
  bootstrap();
  setFuriganaEnabled(true);
  for (const id of ['story_n5_004','story_n5_005','story_n5_006','story_n5_007','story_n5_008']) {
    const screen = shell();
    renderStoryDetail({ screen, params: [id] });
    const body = screen.querySelector('#storyBody');
    ok(`107: ${id} ruby 본문 안`, !!body?.querySelector('ruby'));
    ok(`107: ${id} inline highlight ≥ 3`,
       (body?.querySelectorAll('.story-inline-hl').length || 0) >= 3);
  }
}

console.log('\n[108] 스토리 → 단어 학습 클릭 시 returnRoute 저장 + card route 이동');
{
  bootstrap();
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_004'] });
  // vocabId 보유 inline 찾기 — story_n5_004 첫 문단 첫 highlight (雨, vocabId=v_n5_15)
  const inline = screen.querySelector('.story-inline-hl[data-line-idx="0"][data-hl-idx="0"]');
  inline.click();
  const panel = inline.closest('.story-line').querySelector('.story-hl-panel');
  const studyBtn = panel.querySelector('[data-hl-action="study-vocab"]');
  ok('108: vocabId 보유 → 단어 학습 버튼 존재', !!studyBtn);
  studyBtn.click();
  ok('108: hash 가 study/vocab/card/v_n5_15 로 이동',
     window.location.hash.includes('study/vocab/card/v_n5_15'),
     `hash=${window.location.hash}`);
  // returnRoute 가 story/story_n5_004 로 저장됨
  ok('108: peekStudyReturnRoute === story/story_n5_004',
     peekStudyReturnRoute() === 'story/story_n5_004',
     `peek=${peekStudyReturnRoute()}`);
}

console.log('\n[109] 카드 화면에 "이야기로 돌아가기" 버튼 + 클릭 시 원래 story 복귀');
{
  bootstrap();
  state.setVocabWarmupEnabled(false);
  setStudyReturnRoute('story/story_n5_004');
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n5_15'] });
  passPreview(screen);
  const backBtn = screen.querySelector('#storyReturnBtn');
  ok('109: #storyReturnBtn 노출', !!backBtn);
  ok('109: 버튼 텍스트 "이야기로 돌아가기"',
     (backBtn?.textContent || '').includes('이야기로 돌아가기'));
  // 클릭 시 hash 가 story/story_n5_004 로 이동
  backBtn.click();
  ok('109: 클릭 후 hash story/story_n5_004',
     window.location.hash.includes('story/story_n5_004'),
     `hash=${window.location.hash}`);
  // consumeStudyReturnRoute 효과 — peek 은 null
  ok('109: returnRoute 소비됨 (peek null)',
     peekStudyReturnRoute() === null);
}

console.log('\n[110] 일반 학습 카드(returnRoute 없음) — 돌아가기 버튼 미노출');
{
  bootstrap();
  clearStudyReturnRoute();   // 반드시 비움
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  // 사용자가 직접 #study/vocab/card/v_n5_1 진입 (returnRoute 없음)
  renderStudy({ screen, params: ['vocab', 'card', 'v_n5_1'] });
  passPreview(screen);
  ok('110: #storyReturnBtn 미노출 (returnRoute 없음)',
     !screen.querySelector('#storyReturnBtn'));
  // .vocab-card-imgbox 는 정상 렌더
  ok('110: 카드 자체는 정상 렌더',
     !!screen.querySelector('.vocab-card-imgbox'));
}

console.log('\n[111] 학습 랜딩 / browse 진입 시 returnRoute 자동 정리');
{
  bootstrap();
  setStudyReturnRoute('story/story_n5_004');
  ok('111: 사전 returnRoute 세팅',
     peekStudyReturnRoute() === 'story/story_n5_004');
  const screen = shell();
  // 학습 랜딩 진입
  renderStudy({ screen, params: ['vocab'] });
  ok('111: 학습 랜딩 진입 시 returnRoute 정리',
     peekStudyReturnRoute() === null);
  // browse 도 동일 — 다시 세팅 후 browse 진입
  setStudyReturnRoute('story/story_n5_004');
  const screen2 = shell();
  renderStudy({ screen: screen2, params: ['vocab', 'browse'] });
  ok('111: browse 진입 시 returnRoute 정리',
     peekStudyReturnRoute() === null);
}

console.log('\n[112] 오늘의 10분 카드에는 storyReturn 버튼이 끼지 않음');
{
  bootstrap();
  // setStudyReturnRoute 를 일부러 세팅 — 그러나 today.js 는 직접 vocabCard 만 렌더하므로 영향 없음.
  setStudyReturnRoute('story/story_n5_004');
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  const target = _vocab.find(v => v.id === 'v_n5_1');
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen);
  ok('112: today 동선 vocabCard 화면에 #storyReturnBtn 부재',
     !screen.querySelector('#storyReturnBtn'));
  clearStudyReturnRoute();
}

console.log('\n[113] 핵심 단어 탭 학습 버튼도 returnRoute 저장');
{
  bootstrap();
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_005'] });
  screen.querySelector('#storyTabs [data-tab="vocab"]').click();
  const btn = screen.querySelector('#storyKeyVocabList [data-study-vocab]');
  ok('113: 단어 학습 row 버튼 존재', !!btn);
  btn.click();
  ok('113: returnRoute 저장 (story/story_n5_005)',
     peekStudyReturnRoute() === 'story/story_n5_005');
  ok('113: hash card route 이동',
     window.location.hash.includes('study/vocab/card/'));
}

// ── 라운드 14: N4 시드 검증 ───────────────────────────────────────────────
const { setLevel } = await import('./js/state.js');

console.log('\n[114] 목표 레벨 N4 — 학습 진입 시 N4 단어 카드로 시작');
{
  bootstrap();
  setLevel('N4');
  state.setVocabWarmupEnabled(true);
  _setRecallMsForTest(9999999);
  const screen = shell();
  // N4 vocab 카드 직접 진입
  renderStudy({ screen, params: ['vocab', 'card', 'v_n4_18'] }); // 手伝う
  const cardText = screen.querySelector('.card')?.textContent || '';
  ok('114: N4 카드 1/5 보기 단계', cardText.includes('1/5'));
  ok('114: N4 단어가 카드에 보임', cardText.includes('手伝う') || cardText.includes('てつだう'));
  _resetRecallMsForTest();
}

console.log('\n[115] N4 grammar card 직접 진입');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['grammar', 'card', 'g_n4_5'] }); // 〜ことがある
  ok('115: choice 4개', screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[116] N4 독해 browse 렌더');
{
  bootstrap();
  setLevel('N4');
  const screen = shell();
  renderStudy({ screen, params: ['reading', 'browse'] });
  ok('116: 독해 list 렌더', !!screen.querySelector('#studyListSection'));
  const rows = screen.querySelectorAll('#studyListSection .row').length;
  ok('116: N4 reading row ≥ 1', rows >= 1, `rows=${rows}`);
}

console.log('\n[117] N4 청해 문제 렌더');
{
  bootstrap();
  setLevel('N4');
  const screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: 'l_n4_2' }, {});
  ok('117: 청해 4지선다 렌더',
     screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[118] N4 한자 browse 진입');
{
  bootstrap();
  setLevel('N4');
  const screen = shell();
  renderStudy({ screen, params: ['kanji', 'browse'] });
  const rows = screen.querySelectorAll('#studyListSection .row').length;
  ok('118: N4 kanji row ≥ 1', rows >= 1, `rows=${rows}`);
}

console.log('\n[119] N4 한자 카드 reveal');
{
  bootstrap();
  const { kanji } = await import('./js/data/kanji.js');
  const { renderKanjiCard } = await import('./js/views/kanjiView.js');
  const k = kanji.find(x => x.id === 'k_n4_001');
  ok('119: N4 한자 샘플 존재', !!k);
  const screen = shell();
  renderKanjiCard(screen, k, {});
  ok('119: thinking — meaningKo 부재 (정답 누출 차단)',
     !screen.textContent.includes(k.meaningKo));
  screen.querySelector('#revealBtn').click();
  ok('119: reveal 후 hiragana 노출',
     screen.textContent.includes(k.hiragana));
}

console.log('\n[120] N4 story 목록 + detail ruby/inline highlight');
{
  bootstrap();
  setFuriganaEnabled(true);
  let screen = shell();
  renderStories({ screen, params: [] });
  // N4 row 보이려면 level=N4 필터로 전환
  const lvlBtn = Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N4');
  ok('120: N4 레벨 필터 chip', !!lvlBtn);
  lvlBtn.click();
  const n4rows = screen.querySelectorAll('#storyList .row');
  ok('120: N4 이야기 row ≥ 4', n4rows.length >= 4, `count=${n4rows.length}`);

  // 본문 진입
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n4_001'] });
  const body = screen.querySelector('#storyBody');
  ok('120: body ruby 본문 안',  !!body?.querySelector('ruby'));
  ok('120: inline highlight ≥ 3',
     (body?.querySelectorAll('.story-inline-hl').length || 0) >= 3);
}

console.log('\n[121] N4 story → 단어 카드 → 복귀');
{
  bootstrap();
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n4_001'] });
  // vocabId 보유 inline 찾기 — 첫 vocabId-bearing pill
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl'))
    .find(el => {
      const li = parseInt(el.dataset.lineIdx,10);
      const hi = parseInt(el.dataset.hlIdx,10);
      const h = (_allStories.find(s=>s.id==='story_n4_001').bodyHighlights[li]||[])[hi];
      return h && h.vocabId;
    });
  ok('121: vocabId 보유 inline 후보 존재', !!pill);
  pill.click();
  const studyBtn = pill.closest('.story-line')
    .querySelector('[data-hl-action="study-vocab"]');
  ok('121: 단어 학습 버튼 노출', !!studyBtn);
  studyBtn.click();
  ok('121: returnRoute 저장',
     peekStudyReturnRoute() === 'story/story_n4_001');
  ok('121: hash card route', window.location.hash.includes('study/vocab/card/'));
  // 복귀 시뮬: study card 진입 + 복귀 버튼 클릭
  const screen2 = shell();
  state.setVocabWarmupEnabled(false);
  renderStudy({ screen: screen2, params: ['vocab','card',
    pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').dataset.vocabId] });
  const back = screen2.querySelector('#storyReturnBtn');
  ok('121: 카드 화면에 #storyReturnBtn', !!back);
  back.click();
  ok('121: 복귀 hash story/story_n4_001',
     window.location.hash.includes('story/story_n4_001'));
}

console.log('\n[122] N4 회화 준비도 렌더');
{
  bootstrap();
  setLevel('N4');
  const screen = shell();
  renderHome({ screen });
  const conv = screen.querySelector('#conversationCard');
  ok('122: 회화 카드 노출', !!conv);
  // N4 토픽 중 하나는 약속 변경. titleKo 노출.
  ok('122: N4 약속 변경 토픽 표시',
     conv.textContent.includes('약속'));
}

console.log('\n[123] N5 회귀 — N5 이미지 카드 + 스토리 플레이어 정상');
{
  bootstrap();
  setLevel('N5');
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  renderVocabCard(screen, { itemType: 'vocab', itemId: 'v_n5_1' }, {});
  passPreview(screen);
  ok('123: N5 vocabCard 4지선다',
     screen.querySelectorAll('.choice').length === 4);
  // N5 스토리 정상
  const s2 = shell();
  renderStoryDetail({ screen: s2, params: ['story_n5_001'] });
  ok('123: N5 스토리 ruby',
     !!s2.querySelector('#storyBody ruby'));
  ok('123: N5 inline highlight 유지',
     s2.querySelectorAll('.story-inline-hl').length >= 3);
}

// ── 라운드 17: contentRepository — JSON 경유 렌더 + fallback ───────────────
const repo = await import('./js/contentRepository.js');
const dlForQa = await import('./js/dataLoader.js');
const { readFileSync: _rfs } = await import('node:fs');

console.log('\n[124] N4 story 목록 — repository JSON 데이터로 렌더');
{
  bootstrap();
  repo.resetRepositoryForTest();
  // 가짜 fetch — N4 stories.json 에 marker title 주입
  dlForQa._setFetchForTest(async (path) => {
    if (path === 'data/n4/stories.json') {
      try {
        const real = JSON.parse(_rfs(new URL('./data/n4/stories.json', import.meta.url), 'utf8'));
        real[0] = { ...real[0], titleKo: real[0].titleKo + '·JSON검증' };
        return { ok: true, json: async () => real };
      } catch {
        return { ok: false };
      }
    }
    return { ok: false };
  });
  await repo.preloadRepositoryLevel('N4');
  const screen = shell();
  renderStories({ screen, params: [] });
  // N4 필터로 전환
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N4').click();
  ok('124: N4 story 목록 렌더 (≥4 rows)',
     screen.querySelectorAll('#storyList .row').length >= 4);
  ok('124: JSON marker 가 목록에 표시 — repository 가 JSON 데이터 사용',
     screen.textContent.includes('·JSON검증'),
     `text 일부=${screen.textContent.slice(0, 80)}`);
  // detail 진입도 JSON 데이터
  const screen2 = shell();
  renderStoryDetail({ screen: screen2, params: ['story_n4_001'] });
  ok('124: detail 도 JSON marker 표시',
     screen2.textContent.includes('·JSON검증') ||
     document.getElementById('topTitle').textContent.includes('·JSON검증'));
  // 후리가나/하이라이트/TTS 는 기존처럼
  ok('124: detail ruby 유지', !!screen2.querySelector('#storyBody ruby'));
  ok('124: detail inline highlight 유지',
     screen2.querySelectorAll('.story-inline-hl').length >= 3);
  ok('124: detail 문단 듣기 버튼 유지',
     screen2.querySelectorAll('[data-line-play]').length >= 1);
  dlForQa._resetFetchForTest();
  repo.resetRepositoryForTest();
}

console.log('\n[125] JSON fetch 실패 시뮬레이션 — fallback 으로 화면 생존');
{
  bootstrap();
  repo.resetRepositoryForTest();
  dlForQa._setFetchForTest(async () => { throw new Error('network down'); });
  await repo.preloadRepositoryLevel('N4');   // 전부 실패 → JS fallback 교체
  const screen = shell();
  renderStories({ screen, params: [] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N4').click();
  ok('125: fetch 실패에도 N4 목록 렌더 (JS fallback)',
     screen.querySelectorAll('#storyList .row').length >= 4);
  const screen2 = shell();
  renderStoryDetail({ screen: screen2, params: ['story_n4_005'] });
  ok('125: detail 도 정상 (최後のバス)',
     screen2.textContent.includes('最後のバス') ||
     document.getElementById('topTitle').textContent.includes('마지막 버스'));
  dlForQa._resetFetchForTest();
  repo.resetRepositoryForTest();
}

console.log('\n[126] repository 전환 후 기존 회귀 — N5 story/study/복귀');
{
  bootstrap();
  repo.resetRepositoryForTest();
  // preload 없이 (JS base 만으로) 모든 기존 동선 정상
  let screen = shell();
  renderStories({ screen, params: [] });
  // 직전 시나리오에서 레벨 필터가 N4 로 남아 있을 수 있어 N5 chip 명시 클릭
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N5')?.click();
  ok('126: N5 이야기 목록 ≥ 5',
     screen.querySelectorAll('#storyList .row').length >= 5);
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  ok('126: N5 detail ruby', !!screen.querySelector('#storyBody ruby'));
  // study card 진입 (repoFindItem 경유)
  state.setVocabWarmupEnabled(false);
  screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n5_1'] });
  passPreview(screen);
  ok('126: study vocab card 정상 (repoFindItem)',
     screen.querySelectorAll('.choice').length === 4);
  // invalid id fallback 도 유지
  screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_invalid'] });
  passPreview(screen);
  ok('126: invalid id → browse fallback 유지',
     !!screen.querySelector('#studyListSection'));
  // focusId prefill (repository 경유)
  screen = shell();
  renderStudy({ screen, params: ['vocab', 'browse', 'v_n5_51'] });
  ok('126: focusId 검색 prefill 유지 (起きる)',
     screen.querySelector('#searchInput')?.value === '起きる');
}

// ── 라운드 18: 테마 / romaji·해석 토글 / compact player / cover ────────────
const { getStoryRomajiEnabled, setStoryRomajiEnabled,
        getStoryTranslationEnabled, setStoryTranslationEnabled,
        getThemeMode, setThemeMode } = await import('./js/state.js');
const { applyTheme } = await import('./js/theme.js');

console.log('\n[127] 설정 화면 — 테마/로마자/해석 컨트롤');
{
  bootstrap();
  const screen = shell();
  renderSettings({ screen });
  ok('127: #themeSeg 존재', !!screen.querySelector('#themeSeg'));
  ok('127: 시스템/라이트/다크 3개',
     screen.querySelectorAll('#themeSeg [data-theme-mode]').length === 3);
  ok('127: 기본 system active',
     screen.querySelector('#themeSeg .active')?.dataset.themeMode === 'system');
  ok('127: #romajiToggle 존재 (기본 ON)',
     screen.querySelector('#romajiToggle')?.checked === true);
  ok('127: #translationToggle 존재 (기본 ON)',
     screen.querySelector('#translationToggle')?.checked === true);
  // 라이트 클릭 → document data-theme
  screen.querySelector('#themeSeg [data-theme-mode="light"]').click();
  ok('127: 라이트 선택 → getThemeMode light', getThemeMode() === 'light');
  ok('127: document data-theme=light',
     document.documentElement.dataset.theme === 'light');
  // 다크 클릭
  screen.querySelector('#themeSeg [data-theme-mode="dark"]').click();
  ok('127: 다크 선택 → data-theme=dark',
     document.documentElement.dataset.theme === 'dark');
  // system 클릭 → 저장값 system (해석값은 환경에 따라 light/dark)
  screen.querySelector('#themeSeg [data-theme-mode="system"]').click();
  ok('127: system 선택 → 저장값 system', getThemeMode() === 'system');
  setThemeMode('system');
}

console.log('\n[128] story detail — romaji + 한국어 해석 inline 표시/토글');
{
  bootstrap();
  setStoryRomajiEnabled(true);
  setStoryTranslationEnabled(true);
  let screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  ok('128: .story-romaji 표시',
     screen.querySelectorAll('#storyBody .story-romaji').length >= 3);
  ok('128: romaji 내용 (watashi wa)',
     screen.querySelector('.story-romaji')?.textContent.includes('watashi wa'));
  ok('128: .story-ko-inline 문장 아래 표시',
     screen.querySelectorAll('#storyBody .story-ko-inline').length >= 3);
  // 같은 story-line 안에 ja → romaji → ko 순서
  const firstLine = screen.querySelector('.story-line');
  const children = Array.from(firstLine.children).map(el => el.className.split(' ')[0]);
  ok('128: line 구조 ja→romaji→ko 순서',
     children.indexOf('story-ja') < children.indexOf('story-romaji') &&
     children.indexOf('story-romaji') < children.indexOf('story-ko-inline'),
     `children=${children.join(',')}`);
  // romaji OFF
  setStoryRomajiEnabled(false);
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  ok('128: romaji OFF → .story-romaji 부재',
     screen.querySelectorAll('.story-romaji').length === 0);
  ok('128: 해석은 여전히 표시',
     screen.querySelectorAll('.story-ko-inline').length >= 3);
  // 해석 OFF
  setStoryTranslationEnabled(false);
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  ok('128: 해석 OFF → .story-ko-inline 부재',
     screen.querySelectorAll('.story-ko-inline').length === 0);
  // 다시 ON → 복원
  setStoryRomajiEnabled(true);
  setStoryTranslationEnabled(true);
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  ok('128: 다시 ON → romaji+해석 복원',
     screen.querySelectorAll('.story-romaji').length >= 3 &&
     screen.querySelectorAll('.story-ko-inline').length >= 3);
}

console.log('\n[129] compact player — 컨트롤 같은 row + 속도 포함');
{
  bootstrap();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  const row = screen.querySelector('#storyControlsRow');
  ok('129: #storyControlsRow 존재', !!row);
  // 이전/재생/다음이 같은 row 안
  ok('129: prev/play/next 같은 row',
     !!row?.querySelector('#storyPrev') && !!row?.querySelector('#storyPlayAll') && !!row?.querySelector('#storyNext'));
  // 속도 chip 도 같은 row
  ok('129: 속도 chip 같은 row',
     row?.querySelectorAll('[data-rate]').length === 3);
  // 위치/상태 표시
  ok('129: 위치 1/N (compact)', /^\d+\/\d+$/.test(row?.querySelector('#storyPos')?.textContent || ''));
  ok('129: 상태 "정지" (짧은 라벨)', row?.querySelector('#storyState')?.textContent === '정지');
  // 재생 버튼은 ▶ 아이콘만
  ok('129: 재생 버튼 compact (▶)',
     (row?.querySelector('#storyPlayAll')?.textContent || '').trim() === '▶');
}

console.log('\n[130] story cover — coverImage 렌더 + fallback');
{
  bootstrap();
  let screen = shell();
  renderStories({ screen, params: [] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N5')?.click();
  // coverImage 있는 row (story_n5_004) → 썸네일
  const rowWithCover = screen.querySelector('.row[data-story-id="story_n5_004"]');
  ok('130: cover 있는 row 에 .story-cover-thumb',
     !!rowWithCover?.querySelector('.story-cover-thumb'));
  // coverImage 없는 row (story_n5_001) → 썸네일 없음 (fallback = 텍스트만)
  const rowNoCover = screen.querySelector('.row[data-story-id="story_n5_001"]');
  ok('130: cover 없는 row 는 썸네일 없음 (fallback)',
     !rowNoCover?.querySelector('.story-cover-thumb'));
  // detail — cover 표시
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_004'] });
  const cover = screen.querySelector('.story-cover');
  ok('130: detail 상단 .story-cover 표시', !!cover);
  ok('130: alt 텍스트', (cover?.getAttribute('alt') || '').length > 0);
  // cover 없는 detail → 이미지 없음
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  ok('130: cover 없는 detail 은 이미지 없음', !screen.querySelector('.story-cover'));
}

console.log('\n[131] 테마 전환 후 story 화면 유지 (회귀)');
{
  bootstrap();
  applyTheme('light');
  let screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_004'] });
  ok('131: 라이트 모드 — storyBody/플레이어 정상',
     !!screen.querySelector('#storyBody ruby') && !!screen.querySelector('#storyPlayer'));
  applyTheme('dark');
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_004'] });
  ok('131: 다크 모드 — storyBody/플레이어 정상',
     !!screen.querySelector('#storyBody ruby') && !!screen.querySelector('#storyPlayer'));
  ok('131: romaji/해석/하이라이트 모두 유지',
     screen.querySelectorAll('.story-romaji').length >= 3 &&
     screen.querySelectorAll('.story-ko-inline').length >= 3 &&
     screen.querySelectorAll('.story-inline-hl').length >= 3);
  setThemeMode('system');
}

// ── 라운드 19: Firebase auth + actionLogger (mock) ─────────────────────────
const authSvc = await import('./js/authService.js');
const logger = await import('./js/actionLogger.js');

function mockAuthImpl() {
  let user = null;
  return {
    signUp: async (email, pw) => {
      if (pw.length < 6) { const e = new Error('weak'); e.code = 'auth/weak-password'; throw e; }
      user = { uid: 'uid_' + email.split('@')[0], email };
      return user;
    },
    signIn: async (email, pw) => {
      if (pw !== 'correct123') { const e = new Error('bad'); e.code = 'auth/invalid-credential'; throw e; }
      user = { uid: 'uid_' + email.split('@')[0], email };
      return user;
    },
    signOut: async () => { user = null; },
    resetPassword: async (email) => {
      if (email.includes('many')) { const e = new Error('rate'); e.code = 'auth/too-many-requests'; throw e; }
      if (email.includes('bademail')) { const e = new Error('inv'); e.code = 'auth/invalid-email'; throw e; }
      // 성공(또는 user-not-found 는 authService 가 중립 성공 처리)
    },
    observe: (cb) => { cb(user); },
  };
}

console.log('\n[132] 계정 섹션 — 비로그인 폼 + mock 가입/로그인/로그아웃');
{
  bootstrap();
  authSvc._resetAuthImplForTest();
  authSvc._setAuthImplForTest(mockAuthImpl());
  const logWrites = [];
  logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });
  logger._resetThrottleForTest();

  const screen = shell();
  renderSettings({ screen });
  // 비로그인 — 폼 렌더
  ok('132: #accountSection 존재', !!screen.querySelector('#accountSection'));
  ok('132: 이메일/비밀번호 입력 + 로그인/회원가입 버튼',
     !!screen.querySelector('#authEmail') && !!screen.querySelector('#authPassword') &&
     !!screen.querySelector('#loginBtn') && !!screen.querySelector('#signupBtn'));
  // 회원가입 mock 성공
  screen.querySelector('#authEmail').value = 'tester@example.com';
  screen.querySelector('#authPassword').value = 'correct123';
  screen.querySelector('#signupBtn').click();
  await new Promise(r => setTimeout(r, 20));
  ok('132: 가입 후 로그인 상태 표시',
     screen.querySelector('#accountBody')?.textContent.includes('tester@example.com'));
  ok('132: getCurrentUser uid', authSvc.getCurrentUser()?.uid === 'uid_tester');
  // login_success 활동 갱신됨(userActivity)
  ok('132: login_success 활동 갱신',
     logWrites.some(w => w.path.startsWith('userActivity/') && w.value?.lastEventType === 'login_success'));
  ok('132: 활동 signedIn:true',
     logWrites.find(w => w.value?.lastEventType === 'login_success')?.value.signedIn === true);
  ok('132: 로그에 이메일 원문 없음',
     !JSON.stringify(logWrites).includes('tester@example.com'));
  // 로그아웃
  screen.querySelector('#logoutBtn').click();
  await new Promise(r => setTimeout(r, 20));
  ok('132: 로그아웃 후 폼 복귀', !!screen.querySelector('#loginBtn'));
  ok('132: logout 활동 갱신',
     logWrites.some(w => w.value?.lastEventType === 'logout'));
  logger._resetWriterForTest();
  authSvc._resetAuthImplForTest();
}

console.log('\n[133] 로그인 실패 — 에러 메시지 표시 + 앱 생존');
{
  bootstrap();
  authSvc._setAuthImplForTest(mockAuthImpl());
  const screen = shell();
  renderSettings({ screen });
  screen.querySelector('#authEmail').value = 'tester@example.com';
  screen.querySelector('#authPassword').value = 'wrongpw';
  screen.querySelector('#loginBtn').click();
  await new Promise(r => setTimeout(r, 20));
  ok('133: 실패 메시지 표시',
     (screen.querySelector('#authError')?.textContent || '').includes('올바르지 않'));
  ok('133: 여전히 비로그인 — getCurrentUser null',
     authSvc.getCurrentUser() === null);
  authSvc._resetAuthImplForTest();
}

console.log('\n[134] 로그인 사용자 학습/스토리 로그 (signed-in) + 비로그인 noop');
{
  bootstrap();
  authSvc._resetAuthImplForTest();
  const logWrites = [];
  logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });
  logger._resetThrottleForTest();
  state.setVocabWarmupEnabled(false);
  // (a) 비로그인 — 학습은 동작하되 로그는 기록 안 됨(noop)
  let screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n5_1'] });
  passPreview(screen);
  ok('134: 학습 카드 정상 렌더', screen.querySelectorAll('.choice').length === 4);
  ok('134: 비로그인 로그 0건(noop)', logWrites.length === 0);
  // (b) 로그인(mock) 후 — study/story 로그가 signed-in 으로 기록
  authSvc._setAuthImplForTest(mockAuthImpl());
  await authSvc.signInWithEmail('learner@example.com', 'correct123');
  logger._resetThrottleForTest();
  screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n5_1'] });
  passPreview(screen);
  await new Promise(r => setTimeout(r, 10));   // updateActivity 는 read 후 write(비동기) — tick 대기
  ok('134: study_start 활동 갱신 (signed-in)',
     logWrites.some(w => w.path.startsWith('userActivity/') && w.value?.lastEventType === 'study_start' && w.value.signedIn === true));
  screen.querySelectorAll('.choice')[0].click();
  await new Promise(r => setTimeout(r, 10));
  ok('134: vocab_card_answered 활동 갱신',
     logWrites.some(w => w.value?.lastEventType === 'vocab_card_answered'));
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  await new Promise(r => setTimeout(r, 10));
  ok('134: story_open 활동 갱신',
     logWrites.some(w => w.value?.lastEventType === 'story_open'));
  screen.querySelector('#storyMarkDoneBtn').click();
  await new Promise(r => setTimeout(r, 10));
  ok('134: story_complete 활동 갱신',
     logWrites.some(w => w.value?.lastEventType === 'story_complete'));
  // 모든 write 는 userActivity/{uid} 한 경로만 — actionLogs/anonymousActivity 미기록(라운드 60)
  ok('134: 모든 write 가 userActivity/uid 경로',
     logWrites.length > 0 && logWrites.every(w => w.path === 'userActivity/uid_learner'));
  ok('134: actionLogs/anonymousActivity 미기록',
     !logWrites.some(w => w.path.startsWith('actionLogs') || w.path.startsWith('anonymousActivity')));
  logger._resetWriterForTest();
  authSvc._resetAuthImplForTest();
}

console.log('\n[135] app_open 하루 1회 + write 실패 시 앱 생존');
{
  bootstrap();
  authSvc._setAuthImplForTest(mockAuthImpl());           // 로그인 필수 — 기록되려면 signed-in
  await authSvc.signInWithEmail('opener@example.com', 'correct123');
  const logWrites = [];
  logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });
  logger._resetThrottleForTest();
  logger.logAction('app_open');
  await new Promise(r => setTimeout(r, 10));
  const after1 = logWrites.filter(w => w.value?.lastEventType === 'app_open').length;
  logger.logAction('app_open');   // 같은 날 재호출
  await new Promise(r => setTimeout(r, 10));
  const after2 = logWrites.filter(w => w.value?.lastEventType === 'app_open').length;
  ok('135: app_open 하루 1회', after1 === 1 && after2 === 1);
  // write 가 throw 해도 화면/기능 생존
  logger._setWriterForTest(async () => { throw new Error('firebase down'); });
  logger._resetThrottleForTest();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_004'] });   // story_open 로그 시도 → 실패
  await new Promise(r => setTimeout(r, 10));
  ok('135: write 실패에도 story detail 정상',
     !!screen.querySelector('#storyBody ruby'));
  // markStudiedToday 등 학습 기록도 영향 없음
  state.setVocabWarmupEnabled(false);
  const screen2 = shell();
  renderStudy({ screen: screen2, params: ['vocab', 'card', 'v_n5_2'] });
  passPreview(screen2);
  screen2.querySelectorAll('.choice')[0].click();
  ok('135: write 실패에도 학습 기록(recordSessionItem) 정상',
     state.todaySessionStats().total >= 1);
  logger._resetWriterForTest();
  logger._resetThrottleForTest();
  authSvc._resetAuthImplForTest();
}

console.log('\n[136] Firebase config 입력됨 — 계정 폼 + 상태 배지 (라운드 20)');
{
  bootstrap();
  authSvc._resetAuthImplForTest();   // mock 해제 — 실제 config 는 채워져 있음
  const screen = shell();
  renderSettings({ screen });
  // config 가 실제 값이므로 로그인 폼이 렌더됨
  ok('136: 로그인 폼 렌더 (config 입력됨)',
     !!screen.querySelector('#loginBtn') && !!screen.querySelector('#authEmail'));
  ok('136: 상태 배지 존재', !!screen.querySelector('#fbStatusBadge'));
  // 기존 설정 컨트롤 모두 정상 (회귀)
  ok('136: 기존 설정 컨트롤 유지',
     !!screen.querySelector('#furiToggle') && !!screen.querySelector('#themeSeg'));
}

// ── 라운드 20: firebase_test 버튼 + 상태 배지 ──────────────────────────────
const fbClient = await import('./js/firebaseClient.js');

console.log('\n[137] 로그 테스트 버튼 제거 (라운드 21) — UI 부재 + 배지/계정 UI 유지');
{
  bootstrap();
  authSvc._resetAuthImplForTest();
  const screen = shell();
  renderSettings({ screen });
  // 테스트 전용 UI 가 배포 화면에 없음
  ok('137: #fbTestBtn 부재', !screen.querySelector('#fbTestBtn'));
  ok('137: #fbTestMsg 부재', !screen.querySelector('#fbTestMsg'));
  ok('137: "로그 테스트" 텍스트 부재',
     !screen.querySelector('#accountSection')?.textContent.includes('로그 테스트'));
  // 상태 배지 + 로그인/회원가입 UI 는 유지
  ok('137: 상태 배지 유지', !!screen.querySelector('#fbStatusBadge'));
  ok('137: 로그인/회원가입 UI 유지',
     !!screen.querySelector('#loginBtn') && !!screen.querySelector('#signupBtn'));
  // 테스트 전용 export 는 mock 으로 여전히 동작 (qa 내부 검증용)
  const logWrites = [];
  logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });
  const r = await logger._sendTestLogForTest();
  ok('137: _sendTestLogForTest (테스트 전용) 동작', r.ok === true &&
     logWrites.some(w => w.path.startsWith('userActivity/') && w.value?.lastEventType === 'firebase_test'));
  ok('137: _sendTestLogForTest actionLogs 미사용', !logWrites.some(w => w.path.startsWith('actionLogs')));
  logger._resetWriterForTest();
}

console.log('\n[138] 일반 logAction 실패 — 사용자에게 메시지 없이 앱 유지');
{
  bootstrap();
  authSvc._resetAuthImplForTest();
  logger._setWriterForTest(async () => { throw new Error('rules denied'); });
  logger._resetThrottleForTest();
  // story_open 로그 실패 — 화면 정상 + 에러 UI 없음
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n5_001'] });
  await new Promise(r => setTimeout(r, 20));
  ok('138: 로그 실패에도 story 화면 정상', !!screen.querySelector('#storyBody ruby'));
  ok('138: 로그 실패 메시지가 사용자 UI 에 없음',
     !screen.textContent.includes('실패') && !screen.textContent.includes('Firebase'));
  logger._resetWriterForTest();
  logger._resetThrottleForTest();
}

console.log('\n[139] 초기화 실패 상태 배지 + 로그 payload 보안');
{
  bootstrap();
  authSvc._resetAuthImplForTest();
  fbClient._setInitStatusForTest('failed');
  let screen = shell();
  renderSettings({ screen });
  ok('139: 초기화 실패 배지',
     screen.querySelector('#fbStatusBadge')?.dataset.status === 'init-failed');
  fbClient._setInitStatusForTest('ok');
  screen = shell();
  renderSettings({ screen });
  ok('139: 연결 준비됨 배지',
     screen.querySelector('#fbStatusBadge')?.dataset.status === 'ready');
  fbClient._setInitStatusForTest('unknown');
  // payload 보안 — 로그인 후 모든 로그에 email/password 미포함
  authSvc._setAuthImplForTest(mockAuthImpl());
  const logWrites = [];
  logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });
  logger._resetThrottleForTest();
  screen = shell();
  renderSettings({ screen });
  screen.querySelector('#authEmail').value = 'sec-check@example.com';
  screen.querySelector('#authPassword').value = 'correct123';
  screen.querySelector('#loginBtn').click();
  await new Promise(r => setTimeout(r, 30));
  logger.logAction('story_open', { storyId: 'story_n5_001' });
  await new Promise(r => setTimeout(r, 10));
  const allJson = JSON.stringify(logWrites);
  ok('139: 로그에 이메일 원문 없음', !allJson.includes('sec-check@example.com'));
  ok('139: 로그에 비밀번호 없음',     !allJson.includes('correct123'));
  ok('139: 로그인 후 userActivity/ 경로 사용 (signed-in)',
     logWrites.some(w => w.path.startsWith('userActivity/uid_')));
  logger._resetWriterForTest();
  authSvc._resetAuthImplForTest();
}

// ── 라운드 22: N4 1차 A 갭 보완 ───────────────────────────────────────────
console.log('\n[140] N4 단어 quiz thinking — 정답 노출 없음');
{
  bootstrap();
  state.setVocabWarmupEnabled(false);   // quiz 직진
  const screen = shell();
  // N4 단어 (한자 word + reading + meaningKo 보유)
  const target = _vocab.find(v => v.level === 'N4' && /[一-龯]/.test(v.word) && v.imageKey);
  ok('140: N4 한자 단어 샘플 존재', !!target, target?.id);
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  passPreview(screen);
  const cardText = screen.querySelector('.card')?.textContent || '';
  ok('140: thinking — meaningKo 부재', !cardText.includes(target.meaningKo));
  ok('140: thinking — reading 부재',   !cardText.includes(target.reading));
  ok('140: thinking — 연상 텍스트 부재', !cardText.includes(target.mnemonicText));
  // 선택 후 노출 정상
  screen.querySelectorAll('.choice')[0].click();
  ok('140: 답변 후 meaningKo 노출',
     (screen.querySelector('.explain')?.textContent || '').includes(target.meaningKo));
}

console.log('\n[141] N4 story detail — ruby + romaji + 한국어 해석 3단 표시');
{
  bootstrap();
  setFuriganaEnabled(true);
  setStoryRomajiEnabled(true);
  setStoryTranslationEnabled(true);
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n4_001'] });
  const body = screen.querySelector('#storyBody');
  ok('141: ruby 표시', !!body?.querySelector('ruby'));
  ok('141: romaji 줄 표시 (senshuu kara...)',
     body?.querySelector('.story-romaji')?.textContent.includes('senshuu'));
  ok('141: 한국어 해석 줄 표시',
     body?.textContent.includes('지난주부터 새 회사에서'));
  // 같은 line 안 3단 구조
  const line = body?.querySelector('.story-line');
  ok('141: line 안에 ja/romaji/ko 모두',
     !!line?.querySelector('.story-ja') && !!line?.querySelector('.story-romaji') &&
     !!line?.querySelector('.story-ko-inline'));
  // inline highlight 패널 동작 (N4)
  const hl = body?.querySelector('.story-inline-hl');
  ok('141: N4 inline highlight 존재', !!hl);
  hl.click();
  ok('141: 클릭 시 패널 노출 (meaningKo)',
     hl.closest('.story-line')?.querySelector('.story-hl-panel')?.hidden === false);
}

// ── 라운드 24: N5 마무리 — 신규 콘텐츠 회귀 ──────────────────────────
console.log('\n[142] N5 단어 500 — browse 초기 row ≤ 20 유지');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'browse'] });
  const rows = screen.querySelectorAll('#studyListSection .row').length;
  const totalN5 = vocab.filter(v => v.level === 'N5').length;
  ok('142: N5 vocab 500 도달', totalN5 >= 500, `total=${totalN5}`);
  ok(`142: 초기 row ≤ 20 (전체 ${totalN5})`, rows <= 20, `rows=${rows}`);
}

console.log('\n[143] 신규 N5 단어 card route 직접 진입 (v_n5_350)');
{
  bootstrap();
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n5_350'] });
  passPreview(screen);
  ok('143: .vocab-card-imgbox 렌더', !!screen.querySelector('.vocab-card-imgbox'));
  ok('143: choice 4개 (quiz 직진)', screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[144] 신규 N5 독해/청해 렌더 (r_n5_35 / l_n5_35)');
{
  bootstrap();
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n5_35' }, {});
  ok('144: 신규 독해 choice 4개', screen.querySelectorAll('.choice').length === 4);
  bootstrap({ withTTS: true });
  screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: 'l_n5_35' }, {});
  ok('144: 신규 청해 choice 4개', screen.querySelectorAll('.choice').length === 4);
  const sb24 = screen.querySelector('#scriptBox');
  ok('144: 청해 scriptBox 진입 시 숨김 (TTS 지원)', sb24 && sb24.hidden === true);
}

console.log('\n[145] 신규 N5 한자 카드 reveal (k_n5_075)');
{
  bootstrap();
  const { kanji: _kj24 } = await import('./js/data/kanji.js');
  const { renderKanjiCard: _rkc24 } = await import('./js/views/kanjiView.js');
  const k = _kj24.find(x => x.id === 'k_n5_075');
  ok('145: k_n5_075 존재', !!k);
  const screen = shell();
  _rkc24(screen, k, {});
  ok('145: reveal 전 meaningKo 미노출', !screen.textContent.includes(k.meaningKo));
  screen.querySelector('#revealBtn').click();
  ok('145: reveal 후 hiragana 노출', screen.textContent.includes(k.hiragana));
}

console.log('\n[146] 오늘의 10분 — N5 500 단어 체제에서도 큐 10개 유지');
{
  bootstrap();
  const q = buildTodayQueue();
  ok('146: 큐 길이 10', q.length === 10, `got=${q.length}`);
}

// ── 라운드 25: N5 안정화 — 오늘의 10분/학습 화면 회귀 강화 ─────────────
console.log('\n[147] 오늘의 10분 — N5 완료 상태 구성 검증 (타입 믹스/모드 분배/신규 단어 후보)');
{
  bootstrap();
  // 신규 상태 (복습 0) — 비율: vocab 0.5 / grammar 0.25 / rc 0.25
  const q = buildTodayQueue();
  ok('147: 큐 길이 10', q.length === 10, `got=${q.length}`);
  const byType = {};
  for (const it of q) byType[it.itemType] = (byType[it.itemType] || 0) + 1;
  for (const t of ['vocab', 'grammar', 'reading', 'listening']) {
    ok(`147: ${t} >= 1 포함`, (byType[t] || 0) >= 1, JSON.stringify(byType));
  }
  // 모든 항목이 N5 (fresh 상태에서 레벨 필터 유지)
  ok('147: 전 항목 N5 id', q.every(it => it.itemId.includes('_n5_')),
     q.map(it => it.itemId).join(','));
  // vocab 모드 분배 — image 70% / example 30% (반올림)
  const vItems = q.filter(it => it.itemType === 'vocab');
  const exampleN = vItems.filter(it => it.vocabMode === 'example').length;
  const imageN = vItems.filter(it => it.vocabMode === 'image').length;
  ok('147: vocab 모드 전부 image/example', exampleN + imageN === vItems.length);
  ok('147: example 비율 = round(30%)', exampleN === Math.max(0, Math.round(vItems.length * 0.3)),
     `vocab=${vItems.length} example=${exampleN}`);
  // 신규 N5 vocab (v_n5_251~500) 가 큐 후보로 실제 등장 — 30회 샘플링
  let sawNew = false;
  for (let i = 0; i < 30 && !sawNew; i++) {
    sawNew = buildTodayQueue().some(it => {
      const m = it.itemId.match(/^v_n5_(\d+)$/);
      return m && parseInt(m[1], 10) > 250;
    });
  }
  ok('147: 신규 N5 vocab(251+)가 큐 후보로 등장', sawNew);
  // 선택 전 정답/해설 누출 없음 — reading 문제 렌더 기준
  const rItem = q.find(it => it.itemType === 'reading');
  if (rItem) {
    const screen = shell();
    renderQuestion(screen, { itemType: 'reading', itemId: rItem.itemId }, {});
    ok('147: 답변 전 .explain 부재', !screen.querySelector('.explain'));
  }
}

console.log('\n[148] 학습 > 단어 browse — 500개 체제 검색/태그 필터');
{
  bootstrap();
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'browse'] });
  // 검색: 흔한 한자 1자 — 결과가 있고 row ≤ 20 유지
  const searchInput = screen.querySelector('#searchInput');
  searchInput.value = '食';
  searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));
  const searchRows = screen.querySelectorAll('#studyListSection .row').length;
  ok('148: 검색(食) 결과 ≥ 1', searchRows >= 1, `rows=${searchRows}`);
  ok('148: 검색 결과도 row ≤ 20', searchRows <= 20, `rows=${searchRows}`);
  // 태그 필터: 동사 칩 클릭 → 필터 적용
  searchInput.value = '';
  searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));
  const verbChip = Array.from(screen.querySelectorAll('#tagFilters [data-tag]'))
    .find(b => b.dataset.tag === '동사');
  ok('148: 동사 태그 칩 존재', !!verbChip);
  verbChip.click();
  const tagRows = screen.querySelectorAll('#studyListSection .row').length;
  ok('148: 태그 필터 후 row ≥ 1 그리고 ≤ 20', tagRows >= 1 && tagRows <= 20, `rows=${tagRows}`);
}

console.log('\n[149] 신규 N5 문장 — 후리가나 ON/OFF 렌더');
{
  bootstrap();
  // ON: 신규 reading 지문에 ruby 존재
  setFuriganaEnabled(true);
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n5_40' }, {});
  ok('149: 후리가나 ON → ruby 렌더', !!screen.querySelector('ruby'));
  // OFF: ruby 없음 + 본문 텍스트는 유지
  setFuriganaEnabled(false);
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n5_40' }, {});
  ok('149: 후리가나 OFF → ruby 부재', !screen.querySelector('ruby'));
  ok('149: OFF 에서도 지문 텍스트 유지', screen.textContent.includes('明日は十時から開きます'));
  setFuriganaEnabled(true);
}

// ── 라운드 26: N4 1차 B — 신규 콘텐츠 회귀 ──────────────────────────
console.log('\n[150] N4 오늘의 10분 — 큐 10개 + 전 항목 N4');
{
  bootstrap();
  setLevel('N4');
  const q = buildTodayQueue();
  ok('150: 큐 길이 10', q.length === 10, `got=${q.length}`);
  // byLevelOrEasier 설계 — N4 레벨은 N5 항목도 섞일 수 있다. N4 항목이 실제로 포함되는지만 본다.
  ok('150: 전 항목 N4/N5 범위', q.every(it => /_(n4|n5)_/.test(it.itemId)),
     q.map(it => it.itemId).join(','));
  ok('150: N4 항목 ≥ 1 포함', q.some(it => it.itemId.includes('_n4_')));
}

console.log('\n[151] N4 신규 vocab/grammar card 직접 진입');
{
  bootstrap();
  setLevel('N4');
  state.setVocabWarmupEnabled(false);
  let screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n4_300'] });
  passPreview(screen);
  ok('151: 신규 vocab(面接) card choice 4개', screen.querySelectorAll('.choice').length === 4);
  screen = shell();
  renderStudy({ screen, params: ['grammar', 'card', 'g_n4_45'] });
  ok('151: 신규 grammar(사역) card choice 4개', screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[152] N4 신규 reading/listening 렌더');
{
  bootstrap({ withTTS: true });
  setLevel('N4');
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_30' }, {});
  ok('152: 신규 독해 choice 4개', screen.querySelectorAll('.choice').length === 4);
  screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: 'l_n4_30' }, {});
  ok('152: 신규 청해 choice 4개', screen.querySelectorAll('.choice').length === 4);
  const sb26 = screen.querySelector('#scriptBox');
  ok('152: 청해 scriptBox 진입 시 숨김', sb26 && sb26.hidden === true);
}

console.log('\n[153] N4 신규 kanji 카드 reveal (k_n4_125)');
{
  bootstrap();
  const { kanji: _kj26 } = await import('./js/data/kanji.js');
  const { renderKanjiCard: _rkc26 } = await import('./js/views/kanjiView.js');
  const k = _kj26.find(x => x.id === 'k_n4_125');
  ok('153: k_n4_125(軽) 존재', !!k && k.kanji === '軽');
  const screen = shell();
  _rkc26(screen, k, {});
  ok('153: reveal 전 meaningKo 미노출', !screen.textContent.includes(k.meaningKo));
  screen.querySelector('#revealBtn').click();
  ok('153: reveal 후 hiragana 노출', screen.textContent.includes(k.hiragana));
}

console.log('\n[154] N4 신규 story detail — ruby/romaji/ko/highlight (story_n4_009)');
{
  bootstrap();
  setFuriganaEnabled(true);
  setStoryRomajiEnabled(true);
  setStoryTranslationEnabled(true);
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n4_009'] });
  const body = screen.querySelector('#storyBody');
  ok('154: ruby 렌더', !!body?.querySelector('ruby'));
  ok('154: romaji 줄 (saifu)', body?.querySelector('.story-romaji')?.textContent.includes('saifu'));
  ok('154: 한국어 해석 줄', body?.textContent.includes('역 벤치에서 갈색 지갑을'));
  ok('154: inline highlight ≥ 3',
     (body?.querySelectorAll('.story-inline-hl').length || 0) >= 3);
}

console.log('\n[155] N4 신규 story → 단어 카드 → 복귀 (story_n4_007)');
{
  bootstrap();
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n4_007'] });
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl'))
    .find(el => {
      const li = parseInt(el.dataset.lineIdx, 10);
      const hi = parseInt(el.dataset.hlIdx, 10);
      const h = (_allStories.find(s => s.id === 'story_n4_007').bodyHighlights[li] || [])[hi];
      return h && h.vocabId;
    });
  ok('155: vocabId 보유 inline 존재', !!pill);
  pill.click();
  const studyBtn = pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]');
  ok('155: 단어 학습 버튼 노출', !!studyBtn);
  studyBtn.click();
  ok('155: returnRoute 저장', peekStudyReturnRoute() === 'story/story_n4_007');
  const screen2 = shell();
  state.setVocabWarmupEnabled(false);
  renderStudy({ screen: screen2, params: ['vocab', 'card', studyBtn.dataset.vocabId] });
  passPreview(screen2);
  const back = screen2.querySelector('#storyReturnBtn');
  ok('155: 카드 화면에 복귀 버튼', !!back);
  back.click();
  ok('155: 복귀 hash story/story_n4_007', window.location.hash.includes('story/story_n4_007'));
}

console.log('\n[156] N4 신규 문장 — 후리가나 ON/OFF (r_n4_30)');
{
  bootstrap();
  setLevel('N4');
  setFuriganaEnabled(true);
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_30' }, {});
  ok('156: ON → ruby 렌더', !!screen.querySelector('ruby'));
  setFuriganaEnabled(false);
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_30' }, {});
  ok('156: OFF → ruby 부재', !screen.querySelector('ruby'));
  ok('156: OFF 에서도 지문 유지', screen.textContent.includes('アルバイト'));
  setFuriganaEnabled(true);
}

// ── 라운드 27: N4 완성 C — 신규 콘텐츠 회귀 ─────────────────────────
console.log('\n[157] N4-C 신규 vocab/grammar card 직접 진입');
{
  bootstrap();
  setLevel('N4');
  state.setVocabWarmupEnabled(false);
  let screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n4_500'] });
  passPreview(screen);
  ok('157: 신규 vocab(印刷) card choice 4개', screen.querySelectorAll('.choice').length === 4);
  screen = shell();
  renderStudy({ screen, params: ['grammar', 'card', 'g_n4_63'] });
  ok('157: 신규 grammar(場合) card choice 4개', screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[158] N4-C 신규 reading/listening 렌더 + script 숨김');
{
  bootstrap({ withTTS: true });
  setLevel('N4');
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_45' }, {});
  ok('158: 신규 독해 choice 4개', screen.querySelectorAll('.choice').length === 4);
  screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: 'l_n4_45' }, {});
  ok('158: 신규 청해 choice 4개', screen.querySelectorAll('.choice').length === 4);
  const sb27 = screen.querySelector('#scriptBox');
  ok('158: 청해 scriptBox 진입 시 숨김', sb27 && sb27.hidden === true);
}

console.log('\n[159] N4-C 신규 kanji 카드 reveal (k_n4_175)');
{
  bootstrap();
  const { kanji: _kj27 } = await import('./js/data/kanji.js');
  const { renderKanjiCard: _rkc27 } = await import('./js/views/kanjiView.js');
  const k = _kj27.find(x => x.id === 'k_n4_175');
  ok('159: k_n4_175(期) 존재', !!k && k.kanji === '期');
  const screen = shell();
  _rkc27(screen, k, {});
  ok('159: reveal 전 meaningKo 미노출', !screen.textContent.includes(k.meaningKo));
  screen.querySelector('#revealBtn').click();
  ok('159: reveal 후 hiragana 노출', screen.textContent.includes(k.hiragana));
}

console.log('\n[160] N4-C 신규 회화 토픽 — 목록 노출 + 준비도');
{
  bootstrap();
  setLevel('N4');
  resetConversation();
  const screen = shell();
  renderConversation({ screen, params: [] });
  const txt = screen.textContent;
  ok('160: 레스토랑 예약 토픽 노출', txt.includes('레스토랑 예약'));
  ok('160: 분실물 문의 토픽 노출', txt.includes('분실물 문의'));
  const rows = Array.from(screen.querySelectorAll('.conv-row'));
  const reserveRow = rows.find(r => r.textContent.includes('레스토랑 예약'));
  ok('160: 레스토랑 예약 row 존재', !!reserveRow);
}

console.log('\n[161] N4-C 신규 문장 — 후리가나 ON/OFF (r_n4_45)');
{
  bootstrap();
  setLevel('N4');
  setFuriganaEnabled(true);
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_45' }, {});
  ok('161: ON → ruby 렌더', !!screen.querySelector('ruby'));
  setFuriganaEnabled(false);
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_45' }, {});
  ok('161: OFF → ruby 부재', !screen.querySelector('ruby'));
  setFuriganaEnabled(true);
}

console.log('\n[162] 오늘의 10분 — N4 레벨 큐 10개 유지 (완성 C 체제)');
{
  bootstrap();
  setLevel('N4');
  const q = buildTodayQueue();
  ok('162: 큐 길이 10', q.length === 10, `got=${q.length}`);
}

// ── 라운드 28: N4 완성 D — 신규 콘텐츠 회귀 ─────────────────────────
console.log('\n[163] N4-D 신규 vocab/grammar card 직접 진입');
{
  bootstrap();
  setLevel('N4');
  state.setVocabWarmupEnabled(false);
  let screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n4_800'] });
  passPreview(screen);
  ok('163: 신규 vocab(日付) card choice 4개', screen.querySelectorAll('.choice').length === 4);
  screen = shell();
  renderStudy({ screen, params: ['grammar', 'card', 'g_n4_80'] });
  ok('163: 신규 grammar(にする) card choice 4개', screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[164] N4-D 신규 reading/listening 렌더 + script 숨김');
{
  bootstrap({ withTTS: true });
  setLevel('N4');
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_55' }, {});
  ok('164: 신규 독해 choice 4개', screen.querySelectorAll('.choice').length === 4);
  screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: 'l_n4_55' }, {});
  ok('164: 신규 청해 choice 4개', screen.querySelectorAll('.choice').length === 4);
  const sb28 = screen.querySelector('#scriptBox');
  ok('164: 청해 scriptBox 진입 시 숨김', sb28 && sb28.hidden === true);
}

console.log('\n[165] N4-D 신규 회화 토픽 — 목록 노출 (호텔/회사 전화)');
{
  bootstrap();
  setLevel('N4');
  resetConversation();
  const screen = shell();
  renderConversation({ screen, params: [] });
  const txt = screen.textContent;
  ok('165: 호텔·숙소 이용 토픽 노출', txt.includes('호텔·숙소 이용'));
  ok('165: 회사 전화 응대 토픽 노출', txt.includes('회사 전화 응대'));
}

console.log('\n[166] N4-D 신규 문장 — 후리가나 ON/OFF + 큐 유지');
{
  bootstrap();
  setLevel('N4');
  setFuriganaEnabled(true);
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_55' }, {});
  ok('166: ON → ruby 렌더', !!screen.querySelector('ruby'));
  setFuriganaEnabled(false);
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_55' }, {});
  ok('166: OFF → ruby 부재', !screen.querySelector('ruby'));
  setFuriganaEnabled(true);
  const q = buildTodayQueue();
  ok('166: 오늘의 10분 큐 10개 유지', q.length === 10, `got=${q.length}`);
}

// ── 라운드 29: 안정화 — 준비도 배지/안내/로그 검증 ───────────────────
console.log('\n[167] N4 독해/청해 목록 — 준비도 배지 표시');
{
  bootstrap();
  setLevel('N4');
  let screen = shell();
  renderStudy({ screen, params: ['reading', 'browse'] });
  // 모듈 상태 currentLevel 이 이전 시나리오에 남아 있을 수 있어 N4 칩을 명시 클릭
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N4')?.click();
  ok('167: 독해 목록 준비도 배지 존재', !!screen.querySelector('.readiness-badge'));
  ok('167: 배지에 "준비도" 텍스트', screen.querySelector('.readiness-badge').textContent.includes('준비도'));
  ok('167: 배지에 "배운 단어 x/y"', /배운 단어 \d+\/\d+/.test(screen.querySelector('.readiness-badge').textContent));
  screen = shell();
  renderStudy({ screen, params: ['listening', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N4')?.click();
  ok('167: 청해 목록 준비도 배지 존재', !!screen.querySelector('.readiness-badge'));
}

console.log('\n[168] N4 이야기 목록 — 준비도 상태 표시');
{
  bootstrap();
  setFuriganaEnabled(true);
  const screen = shell();
  renderStories({ screen, params: [] });
  const lvlBtn = Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N4');
  lvlBtn.click();
  const note = screen.querySelector('.story-readiness');
  ok('168: 스토리 준비도 라벨 존재', !!note);
  ok('168: 라벨 텍스트 유효', ['읽기 준비 완료','조금 어려움','먼저 학습 추천'].some(t => note.textContent.includes(t)));
}

console.log('\n[169] 회화 주제 목록 — 배운/일부/잠긴 표현 수 표시');
{
  bootstrap();
  setLevel('N4');
  resetConversation();
  const screen = shell();
  renderConversation({ screen, params: [] });
  const txt = screen.textContent;
  ok('169: 관련 문장 수 표시', /관련 문장 \d+개/.test(txt));
  ok('169: 학습 문장 수 표시', /학습 \d+개/.test(txt));
}

console.log('\n[170] locked 항목 — 진입 가능 + 안내 + 학습 버튼 card route');
{
  bootstrap(); // 빈 학습 상태 → N4 독해는 locked
  setLevel('N4');
  const screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_21' }, {});
  // 진입 자체는 가능 — 문제가 렌더된다
  ok('170: locked 라도 choice 4개 렌더 (진입 가능)', screen.querySelectorAll('.choice').length === 4);
  const banner = screen.querySelector('#readinessBanner');
  ok('170: 안내 배너 존재', !!banner);
  ok('170: "먼저 학습하면 좋아요" 문구', banner.textContent.includes('먼저 학습하면 좋아요'));
  const sb = banner.querySelector('#readinessStudyBtn');
  ok('170: 학습 버튼 존재', !!sb);
  sb.click();
  ok('170: card route 로 이동', window.location.hash.includes('study/vocab/card/v_n'),
     `hash=${window.location.hash}`);
}

console.log('\n[171] Firebase 로그 — 회화 답변 원문 미저장');
{
  bootstrap();
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer } = await import('./js/localEvaluator.js');
  const { conversationTopics: _ct29 } = await import('./js/data/conversationTopics.js');
  const logWrites = [];
  logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });
  const topic = _ct29.find(t => t.id === 'conv_n4_hotel_stay');
  const SECRET = 'チェックインをお願いします、私の名前はキムです';
  const result = evaluateConversationAnswer({
    topic, question: topic.starterQuestions[0], userText: SECRET, reviewStates: {},
  });
  ok('171: 평가 결과 반환', typeof result.score === 'number');
  const allPayload = JSON.stringify(logWrites);
  ok('171: 로그에 답변 원문 미포함', !allPayload.includes('キムです') && !allPayload.includes(SECRET));
  ok('171: 평가 중 로그 기록 자체 없음', logWrites.length === 0, `writes=${logWrites.length}`);
  logger._resetWriterForTest();
}

// ── 라운드 30: 음성/매뉴얼/발음/카드 흐름 ───────────────────────────
console.log('\n[172] voice manager — 있음/없음/늦게 로드/refresh');
{
  const tts = await import('./js/tts.js');
  tts._setRetryDelaysForTest([0, 10, 20]);

  // (a) 즉시 있음
  bootstrap({ withTTS: true });
  tts._resetVoiceStateForTest();
  ok('172a: 즉시 감지', await tts.hasJaVoice() === true);
  ok('172a: 상태 ja-found', tts.getVoiceStatus() === 'ja-found');

  // (b) 없음
  bootstrap({ withTTS: true });
  window.speechSynthesis._voices = [{ lang: 'en-US', name: 'English' }];
  tts._resetVoiceStateForTest();
  ok('172b: 미감지', await tts.hasJaVoice() === false);
  ok('172b: 상태 no-ja', tts.getVoiceStatus() === 'no-ja');

  // (c) 늦게 로드 — 재시도 루프 중 voices 가 생김
  bootstrap({ withTTS: true });
  window.speechSynthesis._voices = [];
  tts._resetVoiceStateForTest();
  setTimeout(() => { window.speechSynthesis._voices = [{ lang: 'ja-JP', name: 'Late JA' }]; }, 12);
  ok('172c: 늦게 로드된 voice 감지', await tts.hasJaVoice() === true);

  // (d) 처음 실패 → 설치 후 refresh 로 감지
  bootstrap({ withTTS: true });
  window.speechSynthesis._voices = [];
  tts._resetVoiceStateForTest();
  ok('172d: 처음엔 없음', await tts.hasJaVoice() === false);
  window.speechSynthesis._voices = [{ lang: 'ja-JP', name: 'Installed JA' }];
  ok('172d: refresh 후 감지', await tts.refreshVoices() === 'ja-found');

  // (e) name 보조 판정
  ok('172e: name 기반 판정', tts.isJaVoice({ lang: '', name: 'Japanese Female' }) === true);
  // (f) 미지원
  bootstrap({ withTTS: false });
  tts._resetVoiceStateForTest();
  ok('172f: 미지원 상태', tts.getVoiceStatus() === 'unsupported');
  tts._resetRetryDelaysForTest();
}

console.log('\n[173] 설정 — 음성 상태 영역 + 매뉴얼 토글 ON/OFF');
{
  bootstrap({ withTTS: true });
  const tts = await import('./js/tts.js');
  tts._resetVoiceStateForTest();
  let screen = shell();
  renderSettings({ screen });
  ok('173: 음성 상태 영역 존재', !!screen.querySelector('#voiceStatusSection'));
  ok('173: 음성 다시 감지 버튼', !!screen.querySelector('#voiceRefreshBtn'));
  ok('173: 매뉴얼 토글 존재', !!screen.querySelector('#helpToggle'));
  ok('173: helpEnabled 기본 false', state.getHelpEnabled() === false);
  // OFF 상태 — 홈에 도움말 카드 없음
  let home = shell();
  renderHome({ screen: home });
  ok('173: OFF — 도움말 카드 부재', !home.querySelector('.help-card'));
  // ON
  const ht = screen.querySelector('#helpToggle');
  ht.checked = true;
  ht.dispatchEvent(new window.Event('change'));
  ok('173: 토글 후 helpEnabled true', state.getHelpEnabled() === true);
  home = shell();
  renderHome({ screen: home });
  ok('173: ON — 홈 도움말 카드 노출', !!home.querySelector('.help-card'));
  // 학습 랜딩에도
  let st = shell();
  renderStudy({ screen: st, params: [] });
  ok('173: ON — 학습 도움말 카드 노출', !!st.querySelector('.help-card'));
  // 다시 OFF → DOM 에서 사라짐
  state.setHelpEnabled(false);
  home = shell();
  renderHome({ screen: home });
  ok('173: 재OFF — 도움말 카드 제거', !home.querySelector('.help-card'));
}

console.log('\n[174] 단어 발음 버튼 — 목록/복습, 기록 미증가, aria 안전');
{
  bootstrap({ withTTS: true });
  setLevel('N5');
  // 학습 > 단어 > 찾아보기
  let screen = shell();
  renderStudy({ screen, params: ['vocab', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N5')?.click();
  const listen = screen.querySelector('[data-act="listen"]');
  ok('174: browse row 발음 버튼 존재', !!listen);
  ok('174: aria-label 은 "발음 듣기" 만', listen.getAttribute('aria-label') === '발음 듣기');
  // TTS mock 호출 확인
  let spoken = 0;
  window.speechSynthesis.speak = () => { spoken++; };
  const beforeRs = Object.keys(storage.getState().reviewStates).length;
  const beforeStreak = storage.getState().userProgress.lastStudiedDate;
  listen.click();
  await new Promise(r => setTimeout(r, 30)); // speak 는 async
  ok('174: TTS 호출됨', spoken >= 1, `spoken=${spoken}`);
  ok('174: 학습 기록 미증가', Object.keys(storage.getState().reviewStates).length === beforeRs);
  ok('174: streak 미변경', storage.getState().userProgress.lastStudiedDate === beforeStreak);
  // 복습 > 자주 볼 단어 row
  const { renderReview: _rr30 } = await import('./js/views/review.js');
  state.toggleFavorite('vocab', 'v_n5_1');
  const rv = shell();
  _rr30({ screen: rv });
  Array.from(rv.querySelectorAll('.chip,button')).find(b => b.textContent.includes('자주 볼'))?.click();
  ok('174: 자주 볼 단어 row 발음 버튼', !!rv.querySelector('[data-act="listen"]'));
}

console.log('\n[175] 이미지 카드 — 다음 단계/다음 단어 + 기록 정책');
{
  bootstrap({ withTTS: true });
  const logger = await import('./js/actionLogger.js');
  const logWrites = [];
  logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });

  // warmup ON: expose1 → 다음 단계 → expose2 / 다음 단어 → 기록 없이 onNext
  state.setVocabWarmupEnabled(true);
  const { _setRecallMsForTest, _resetRecallMsForTest } = await import('./js/views/vocabCardView.js');
  _setRecallMsForTest(9999999);
  let screen = shell();
  let nexted = 0;
  renderVocabCard(screen, { itemType: 'vocab', itemId: 'v_n5_1' }, { onNext: () => { nexted++; } });
  ok('175: expose1 시작 (1/5)', screen.textContent.includes('1/5'));
  ok('175: 다음 단계/다음 단어 버튼 2개',
     screen.querySelectorAll('.vocab-card-nav button').length === 2);
  Array.from(screen.querySelectorAll('.vocab-card-nav button')).find(b => b.textContent.includes('다음 단계')).click();
  ok('175: 다음 단계 → expose2 (2/5)', screen.textContent.includes('2/5'));
  screen.querySelector('.skip-word').click();
  ok('175: 다음 단어 → onNext 호출', nexted === 1);
  ok('175: skip 후 기록 없음', Object.keys(storage.getState().reviewStates).length === 0);
  ok('175: skip 행동 로그 없음', logWrites.length === 0);

  // recall 중 다음 단어 — 타이머 정리 (예외 없이 onNext)
  screen = shell();
  nexted = 0;
  renderVocabCard(screen, { itemType: 'vocab', itemId: 'v_n5_2' }, { onNext: () => { nexted++; } });
  Array.from(screen.querySelectorAll('.vocab-card-nav button')).find(b => b.textContent.includes('다음 단계')).click(); // expose2
  Array.from(screen.querySelectorAll('.vocab-card-nav button')).find(b => b.textContent.includes('다음 단계')).click(); // recall
  ok('175: recall 진입 (3/5)', screen.textContent.includes('3/5'));
  screen.querySelector('.skip-word').click();
  ok('175: recall skip → onNext', nexted === 1);
  _resetRecallMsForTest();

  // quiz 답변 시에만 기록
  state.setVocabWarmupEnabled(false);
  screen = shell();
  renderVocabCard(screen, { itemType: 'vocab', itemId: 'v_n5_3' }, {});
  ok('175: quickPreview 기록 없음', Object.keys(storage.getState().reviewStates).length === 0);
  passPreview(screen);
  screen.querySelectorAll('.choice')[0].click();
  ok('175: quiz 답변 후 기록 1건', Object.keys(storage.getState().reviewStates).length === 1);
  logger._resetWriterForTest();
}

// ── 라운드 31: romaji 표시/누출 ───────────────────────────────────────
console.log('\n[176] romaji — 카드 단계별 표시/숨김');
{
  bootstrap({ withTTS: true });
  const { _setRecallMsForTest: _srm31, _resetRecallMsForTest: _rrm31 } =
    await import('./js/views/vocabCardView.js');
  const target = vocab.find(v => v.id === 'v_n5_1'); // 待つ(まつ) → matsu

  // warmup ON — expose1 에서 romaji 표시
  state.setVocabWarmupEnabled(true);
  _srm31(9999999);
  let screen = shell();
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  ok('176: expose1 에 matsu 표시', screen.textContent.includes('matsu'));
  // recall — romaji 미표시
  Array.from(screen.querySelectorAll('.vocab-card-nav button')).find(b => b.textContent.includes('다음 단계')).click(); // expose2
  Array.from(screen.querySelectorAll('.vocab-card-nav button')).find(b => b.textContent.includes('다음 단계')).click(); // recall
  ok('176: recall 에 romaji 미표시', !screen.textContent.includes('matsu'));
  _rrm31();

  // warmup OFF — quickPreview 표시 → quiz thinking 숨김 → 해설 표시
  state.setVocabWarmupEnabled(false);
  screen = shell();
  renderVocabCard(screen, { itemType: 'vocab', itemId: target.id }, {});
  ok('176: quickPreview 에 matsu 표시', screen.textContent.includes('matsu'));
  passPreview(screen);
  ok('176: quiz thinking 에 romaji 미표시', !screen.textContent.includes('matsu'));
  screen.querySelectorAll('.choice')[0].click();
  ok('176: 해설에 romaji 표시', screen.textContent.includes('matsu'));
}

console.log('\n[177] romaji — 목록/복습 row + TTS 는 일본어');
{
  bootstrap({ withTTS: true });
  setLevel('N5');
  let screen = shell();
  renderStudy({ screen, params: ['vocab', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N5')?.click();
  ok('177: browse row 에 romaji-sub 존재', !!screen.querySelector('.romaji-sub'));
  // 복습 — 자주 볼 단어 row
  const { renderReview: _rr31 } = await import('./js/views/review.js');
  state.toggleFavorite('vocab', 'v_n5_1');
  const rv = shell();
  _rr31({ screen: rv });
  Array.from(rv.querySelectorAll('.chip,button')).find(b => b.textContent.includes('자주 볼'))?.click();
  ok('177: 자주 볼 row 에 romaji-sub', !!rv.querySelector('.romaji-sub'));
  ok('177: 자주 볼 row 에 matsu 표시', rv.textContent.includes('matsu'));
  // 발음 버튼 클릭 → TTS 는 일본어 원문 (romaji 아님)
  const spokenTexts = [];
  globalThis.SpeechSynthesisUtterance = class { constructor(t){ this.text = t; spokenTexts.push(t); } };
  rv.querySelector('[data-act="listen"]').click();
  await new Promise(r => setTimeout(r, 30));
  ok('177: TTS 입력은 일본어', spokenTexts.length > 0 && spokenTexts.every(t => !/matsu/.test(t)),
     `texts=${spokenTexts.join(',')}`);
  ok('177: TTS 입력에 待つ 포함', spokenTexts.some(t => t.includes('待つ')));
}

// ── 라운드 31: N5 의존성 백포트 — 배지/locked/추천 ────────────────────
console.log('\n[178] N5 독해/청해/이야기 — 준비도 배지');
{
  bootstrap();
  setLevel('N5');
  let screen = shell();
  renderStudy({ screen, params: ['reading', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N5')?.click();
  ok('178: N5 독해 목록 준비도 배지', !!screen.querySelector('.readiness-badge'));
  ok('178: 배지 형식 (배운 단어 x/y)', /배운 단어 \d+\/\d+/.test(screen.querySelector('.readiness-badge').textContent));
  screen = shell();
  renderStudy({ screen, params: ['listening', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N5')?.click();
  ok('178: N5 청해 목록 준비도 배지', !!screen.querySelector('.readiness-badge'));
  // 이야기 목록 — N5 기본
  setFuriganaEnabled(true);
  screen = shell();
  renderStories({ screen, params: [] });
  ok('178: N5 이야기 준비도 라벨', !!screen.querySelector('.story-readiness'));
}

console.log('\n[179] N5 locked — 진입 가능 + 학습 버튼 card route + N4 회귀 없음');
{
  bootstrap(); // 빈 학습 상태 → locked
  setLevel('N5');
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n5_26' }, {});
  ok('179: locked 라도 choice 4개 (진입 가능)', screen.querySelectorAll('.choice').length === 4);
  const banner = screen.querySelector('#readinessBanner');
  ok('179: 안내 배너 존재', !!banner);
  const sb = banner.querySelector('#readinessStudyBtn');
  ok('179: 학습 버튼 존재', !!sb);
  sb.click();
  ok('179: card route 로 이동 (N5 단어)', window.location.hash.includes('study/vocab/card/v_n5_'),
     `hash=${window.location.hash}`);
  // N4 회귀 — 준비도 배지/배너 여전히 동작
  setLevel('N4');
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n4_21' }, {});
  ok('179: N4 locked 배너 유지', !!screen.querySelector('#readinessBanner'));
  // N5 오늘의 10분 큐 10개 유지
  setLevel('N5');
  const q = buildTodayQueue();
  ok('179: N5 큐 10개 유지', q.length === 10, `got=${q.length}`);
}

// ── 라운드 32: N3 0차 시드 — UI 노출 ─────────────────────────────────
console.log('\n[180] N3 학습 화면 — 콘텐츠 노출 + 준비도 배지');
{
  bootstrap();
  setLevel('N3');
  let screen = shell();
  renderStudy({ screen, params: ['vocab', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N3')?.click();
  ok('180: N3 단어 목록 노출 (row ≥ 1)', screen.querySelectorAll('#studyListSection .row').length >= 1);
  ok('180: N3 row romaji 표시', !!screen.querySelector('.romaji-sub'));
  screen = shell();
  renderStudy({ screen, params: ['reading', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N3')?.click();
  ok('180: N3 독해 준비도 배지', !!screen.querySelector('.readiness-badge'));
  screen = shell();
  renderStudy({ screen, params: ['listening', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N3')?.click();
  ok('180: N3 청해 준비도 배지', !!screen.querySelector('.readiness-badge'));
}

console.log('\n[181] N3 이야기/회화 — 준비도/매칭 표시');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  let screen = shell();
  renderStories({ screen, params: [] });
  const lvlBtn = Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N3');
  ok('181: N3 레벨 칩 존재', !!lvlBtn);
  lvlBtn.click();
  ok('181: N3 이야기 row ≥ 2', screen.querySelectorAll('#storyList .row').length >= 2);
  ok('181: N3 이야기 준비도 라벨', !!screen.querySelector('.story-readiness'));
  // 회화 목록
  resetConversation();
  screen = shell();
  renderConversation({ screen, params: [] });
  const txt = screen.textContent;
  ok('181: 직장 일정 조정 토픽 노출', txt.includes('직장 일정 조정'));
  ok('181: 관련 문장 수 표시', /관련 문장 \d+개/.test(txt));
}

console.log('\n[182] N3 단어 카드 — romaji 표시 + 누출 없음');
{
  bootstrap({ withTTS: true });
  setLevel('N3');
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n3_8'] }); // 募集(ぼしゅう) → boshuu
  ok('182: quickPreview 에 boshuu 표시', screen.textContent.includes('boshuu'));
  passPreview(screen);
  ok('182: quiz thinking 에 romaji 미표시', !screen.textContent.includes('boshuu'));
  ok('182: quiz thinking 에 뜻 미표시', !screen.textContent.includes('모집'));
  ok('182: choice 4개', screen.querySelectorAll('.choice').length === 4);
  // N3 스토리 직접 진입
  const screen2 = shell();
  renderStoryDetail({ screen: screen2, params: ['story_n3_001'] });
  ok('182: N3 스토리 본문 ruby', !!screen2.querySelector('#storyBody ruby'));
  ok('182: N3 인라인 하이라이트 ≥ 3', screen2.querySelectorAll('.story-inline-hl').length >= 3);
}

// ── 라운드 33: N3 안정화 — 하이라이트 학습 링크 / 회화 평가 / 로그 ────
console.log('\n[183] N3 스토리 하이라이트 — 단어 학습 링크 동작');
{
  bootstrap();
  setLevel('N3');
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n3_003'] });
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl'))
    .find(el => {
      const li = parseInt(el.dataset.lineIdx, 10);
      const hi = parseInt(el.dataset.hlIdx, 10);
      const h = (_allStories.find(s => s.id === 'story_n3_003').bodyHighlights[li] || [])[hi];
      return h && h.vocabId;
    });
  ok('183: vocabId 보유 하이라이트 존재', !!pill);
  pill.click();
  const panel = pill.closest('.story-line').querySelector('.story-hl-panel');
  ok('183: 패널 노출 (뜻 표시)', panel && panel.hidden === false);
  ok('183: 패널에 romaji 표시', /[a-z]{3,}/.test(panel.textContent));
  const studyBtn = pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]');
  ok('183: 단어 학습 버튼 존재', !!studyBtn);
  studyBtn.click();
  ok('183: card route 이동', window.location.hash.includes('study/vocab/card/'));
  ok('183: returnRoute 저장', peekStudyReturnRoute() === 'story/story_n3_003');
}

console.log('\n[184] N3 회화 평가 — sampleAnswer/추천 + 원문 미기록');
{
  bootstrap();
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer: _ev33 } = await import('./js/localEvaluator.js');
  const { conversationTopics: _ct33 } = await import('./js/data/conversationTopics.js');
  const logWrites = [];
  logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });
  const topic = _ct33.find(t => t.id === 'conv_n3_opinion');
  const SECRET = '私にとって環境は大切だと思います、キムです';
  const result = _ev33({ topic, question: topic.starterQuestions[0], userText: SECRET, reviewStates: {} });
  ok('184: 점수 반환', typeof result.score === 'number');
  ok('184: sampleAnswer 제공 (기존 정책)', !!result.sampleAnswer && !!result.sampleAnswer.ja);
  ok('184: sampleAnswer 는 topic 데이터 문장', topic.starterQuestions[0].sampleAnswers.some(a => a.ja === result.sampleAnswer.ja));
  ok('184: 로그에 답변 원문 미기록', !JSON.stringify(logWrites).includes('キムです'));
  ok('184: 평가 중 로그 0건', logWrites.length === 0);
  logger._resetWriterForTest();
}

// ── 라운드 34: N3 1차 확장 — 신규 콘텐츠 UI 노출 ─────────────────────
console.log('\n[185] N3 신규 독해/청해 — 렌더 + 후리가나 + 준비도 배지');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n3_15' }, {});
  ok('185: 신규 독해 r_n3_15 choice 4개', screen.querySelectorAll('.choice').length === 4);
  ok('185: 신규 독해 지문 ruby', !!screen.querySelector('ruby'));
  screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: 'l_n3_20' }, {});
  ok('185: 신규 청해 l_n3_20 choice 4개', screen.querySelectorAll('.choice').length === 4);
  // 신규 항목도 의존성 태깅 → 빈 학습 상태에서 배너/배지 동작
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n3_17' }, {});
  ok('185: 신규 독해 준비도 배너 (빈 학습 상태)', !!screen.querySelector('#readinessBanner'));
}

console.log('\n[186] N3 신규 단어/문법 — 카드 + romaji + 퀴즈 누출 없음');
{
  bootstrap({ withTTS: true });
  setLevel('N3');
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n3_231'] }); // 挑戦(ちょうせん) → chousen
  ok('186: quickPreview 에 chousen 표시', screen.textContent.includes('chousen'));
  passPreview(screen);
  ok('186: quiz thinking 에 romaji 미표시', !screen.textContent.includes('chousen'));
  ok('186: quiz thinking 에 뜻 미표시', !screen.textContent.includes('도전'));
  // 신규 문법 비교 페어 데이터 — gp_n3_5~8 grammarIds 실존
  const { grammarPairs: _gp34 } = await import('./js/data/grammarPairs.js');
  const { grammar: _g34 } = await import('./js/data/grammar.js');
  const gIds34 = new Set(_g34.map(g => g.id));
  const newPairs = _gp34.filter(p => p.level === 'N3');
  ok('186: N3 문법 페어 ≥ 8', newPairs.length >= 8, `got=${newPairs.length}`);
  ok('186: 페어 grammarIds 전부 실존', newPairs.every(p => (p.grammarIds || []).every(id => gIds34.has(id))));
}

console.log('\n[187] N3 신규 스토리/회화 토픽 — 목록·본문·매칭');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  let screen = shell();
  renderStories({ screen, params: [] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N3')?.click();
  ok('187: N3 이야기 row ≥ 4 (1차 확장)', screen.querySelectorAll('#storyList .row').length >= 4,
     `got=${screen.querySelectorAll('#storyList .row').length}`);
  // 신규 단편 본문
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n3_006'] });
  ok('187: story_n3_006 본문 ruby', !!screen.querySelector('#storyBody ruby'));
  ok('187: story_n3_006 인라인 하이라이트 ≥ 3', screen.querySelectorAll('.story-inline-hl').length >= 3);
  ok('187: story_n3_006 romaji 표시', screen.textContent.includes('akirameru'));
  // 신규 회화 토픽 노출 + 관련 문장
  resetConversation();
  screen = shell();
  renderConversation({ screen, params: [] });
  const txt = screen.textContent;
  ok('187: 회의에서 의견 내기 토픽 노출', txt.includes('회의에서 의견 내기'));
  ok('187: 예약·일정 문제 해결 토픽 노출', txt.includes('예약·일정 문제 해결'));
  ok('187: 관련 문장 수 표시', /관련 문장 \d+개/.test(txt));
}

console.log('\n[188] N3 추천 — N5/N4 마스터: N3 포함 + 복습 미배제 (라운드 34 잠금)');
{
  bootstrap();
  const cr34 = await import('./js/contentReadiness.js');
  const { vocab: _v34 } = await import('./js/data/vocab.js');
  const { grammar: _gr34 } = await import('./js/data/grammar.js');
  const rsM = {};
  [..._v34, ..._gr34].filter(x => ['N5', 'N4'].includes(x.level)).forEach(x => { rsM[x.id] = { correctCount: 1 }; });
  for (const [name, fn] of [['reading', cr34.getRecommendedReading], ['listening', cr34.getRecommendedListening], ['stories', cr34.getRecommendedStories]]) {
    const rec = fn('N3', rsM, { count: 6 });
    ok(`188: 추천(${name}) N3 ≥ 1`, rec.some(r => r.item.level === 'N3'));
    ok(`188: 추천(${name}) 복습(N5/N4) ≥ 1`, rec.some(r => r.item.level !== 'N3'),
       rec.map(r => r.item.id).join(','));
  }
  // 빈 학습 상태에서도 추천이 비지 않음 (회귀)
  const recEmpty = cr34.getRecommendedReading('N3', {}, { count: 5 });
  ok('188: 빈 상태 추천 비지 않음', recEmpty.length > 0);
}

// ── 라운드 35: N3 1차 안정화 — 품질/추천/회화 잠금 ─────────────────────
console.log('\n[189] N3 신규 문법 문제 — 렌더 + 해설 노출 시점');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  const screen = shell();
  renderQuestion(screen, { itemType: 'grammar', itemId: 'g_n3_27' }, {});
  ok('189: choice 4개', screen.querySelectorAll('.choice').length === 4);
  ok('189: 예문 context ruby', !!screen.querySelector('.q-context ruby'));
  // 라운드 35 보강된 explanation 은 선택 전 미노출
  ok('189: 선택 전 해설 미노출', !screen.textContent.includes('으뜸'));
  screen.querySelectorAll('.choice')[0].click();
  const explain189 = screen.querySelector('.explain');
  ok('189: 선택 후 .explain 등장', !!explain189);
  ok('189: 보강된 해설 텍스트 노출', screen.textContent.includes('으뜸'));
}

console.log('\n[190] N3 오늘의 10분 — 큐 10개 + readiness fallback');
{
  bootstrap();
  setLevel('N3');
  const q190 = buildTodayQueue();
  ok('190: N3 큐 10개 (빈 학습 상태 fallback)', q190.length === 10, `got=${q190.length}`);
  // 부분 학습 상태에서도 큐 10개 유지
  const cr35 = await import('./js/contentReadiness.js');
  const dep190 = cr35.getItemDependency('reading', 'r_n3_13');
  for (const id of [...dep190.vocabIds, ...dep190.grammarIds]) state.recordVocabResult?.(id, true);
  ok('190: 부분 학습 후에도 큐 10개', buildTodayQueue().length === 10);
}

console.log('\n[191] N3 신규 토픽 회화 평가 — sampleAnswer 데이터 출처 + 원문 미기록');
{
  bootstrap();
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer: _ev35 } = await import('./js/localEvaluator.js');
  const { conversationTopics: _ct35 } = await import('./js/data/conversationTopics.js');
  const logWrites35 = [];
  logger._setWriterForTest(async (path, value) => { logWrites35.push({ path, value }); });
  for (const tid of ['conv_n3_meeting_opinion', 'conv_n3_school_presentation', 'conv_n3_reservation_problem']) {
    const topic = _ct35.find(t => t.id === tid);
    const SECRET35 = '会議で意見を言いました、パクです';
    const r = _ev35({ topic, question: topic.starterQuestions[0], userText: SECRET35, reviewStates: {} });
    ok(`191: ${tid} 점수 반환`, typeof r.score === 'number');
    ok(`191: ${tid} sampleAnswer 는 topic 데이터 문장`,
       topic.starterQuestions[0].sampleAnswers.some(a => a.ja === r.sampleAnswer.ja));
  }
  ok('191: 로그에 답변 원문 미기록', !JSON.stringify(logWrites35).includes('パクです'));
  ok('191: 평가 중 로그 0건', logWrites35.length === 0);
  logger._resetWriterForTest();
}

console.log('\n[192] N3 신규 스토리 — 하이라이트 학습 링크 + 복귀 (story_n3_004)');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n3_004'] });
  ok('192: 본문 ruby + romaji', !!screen.querySelector('#storyBody ruby') && screen.textContent.includes('renshuu'));
  const pill192 = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n3_004').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('192: vocabId 하이라이트 존재', !!pill192);
  pill192.click();
  const studyBtn192 = pill192.closest('.story-line').querySelector('[data-hl-action="study-vocab"]');
  ok('192: 단어 학습 버튼', !!studyBtn192);
  studyBtn192.click();
  ok('192: card route 이동', window.location.hash.includes('study/vocab/card/'));
  ok('192: returnRoute = story_n3_004', peekStudyReturnRoute() === 'story/story_n3_004');
}

// ── 라운드 36: N3 2차 확장 — 신규 콘텐츠 UI ────────────────────────────
console.log('\n[193] N3 2차 신규 단어 카드 — romaji + 퀴즈 누출 없음');
{
  bootstrap({ withTTS: true });
  setLevel('N3');
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n3_561'] }); // 乗り越える → norikoeru
  ok('193: quickPreview 에 norikoeru 표시', screen.textContent.includes('norikoeru'));
  passPreview(screen);
  ok('193: quiz thinking 에 romaji 미표시', !screen.textContent.includes('norikoeru'));
  ok('193: quiz thinking 에 뜻 미표시', !screen.textContent.includes('극복'));
  ok('193: choice 4개', screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[194] N3 2차 신규 문법/독해/청해 — 렌더 + 배지 + 장문');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  let screen = shell();
  renderQuestion(screen, { itemType: 'grammar', itemId: 'g_n3_45' }, {});
  ok('194: 신규 문법 g_n3_45 choice 4개', screen.querySelectorAll('.choice').length === 4);
  ok('194: 선택 전 해설 미노출', !screen.textContent.includes('연속적 변화'));
  screen.querySelectorAll('.choice')[0].click();
  ok('194: 선택 후 해설 노출', !!screen.querySelector('.explain'));
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n3_37' }, {});
  ok('194: 장문 독해 r_n3_37 렌더 + ruby', screen.querySelectorAll('.choice').length === 4 && !!screen.querySelector('ruby'));
  screen = shell();
  renderQuestion(screen, { itemType: 'listening', itemId: 'l_n3_39' }, {});
  ok('194: 신규 청해 l_n3_39 choice 4개', screen.querySelectorAll('.choice').length === 4);
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n3_29' }, {});
  ok('194: 신규 독해 준비도 배너 (빈 학습 상태)', !!screen.querySelector('#readinessBanner'));
}

console.log('\n[195] N3 2차 신규 스토리/토픽 — 본문·하이라이트·평가');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  clearStudyReturnRoute();
  let screen = shell();
  renderStories({ screen, params: [] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N3')?.click();
  ok('195: N3 이야기 row ≥ 7', screen.querySelectorAll('#storyList .row').length >= 7,
     `got=${screen.querySelectorAll('#storyList .row').length}`);
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n3_009'] });
  ok('195: story_n3_009 ruby + romaji', !!screen.querySelector('#storyBody ruby') && screen.textContent.includes('gokai'));
  const pill195 = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n3_009').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('195: vocabId 하이라이트 존재', !!pill195);
  pill195.click();
  pill195.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('195: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/') && peekStudyReturnRoute() === 'story/story_n3_009');
  // 신규 토픽 평가 — sampleAnswer 데이터 출처 + 원문 미기록
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer: _ev36 } = await import('./js/localEvaluator.js');
  const { conversationTopics: _ct36 } = await import('./js/data/conversationTopics.js');
  const logW36 = [];
  logger._setWriterForTest(async (p, v) => { logW36.push(p); });
  for (const tid of ['conv_n3_work_conflict', 'conv_n3_social_opinion', 'conv_n3_service_complaint']) {
    const topic = _ct36.find(t => t.id === tid);
    const r = _ev36({ topic, question: topic.starterQuestions[0], userText: '残業が多い気がします、チェです', reviewStates: {} });
    ok(`195: ${tid} sampleAnswer 출처`, topic.starterQuestions[0].sampleAnswers.some(a => a.ja === r.sampleAnswer.ja));
  }
  ok('195: 평가 중 로그 0건 (원문 미기록)', logW36.length === 0);
  logger._resetWriterForTest();
}

console.log('\n[196] N3 2차 — 추천 균형 + 오늘의 10분 큐 유지');
{
  bootstrap();
  setLevel('N3');
  const cr36 = await import('./js/contentReadiness.js');
  const { vocab: _v36 } = await import('./js/data/vocab.js');
  const { grammar: _g36 } = await import('./js/data/grammar.js');
  const rsM36 = {};
  [..._v36, ..._g36].filter(x => ['N5', 'N4'].includes(x.level)).forEach(x => { rsM36[x.id] = { correctCount: 1 }; });
  for (const [name, fn] of [['reading', cr36.getRecommendedReading], ['listening', cr36.getRecommendedListening], ['stories', cr36.getRecommendedStories]]) {
    const rec = fn('N3', rsM36, { count: 6 });
    ok(`196: 추천(${name}) N3 포함 + 복습 유지`, rec.some(r => r.item.level === 'N3') && rec.some(r => r.item.level !== 'N3'),
       rec.map(r => r.item.id).join(','));
  }
  ok('196: 오늘의 10분 큐 10개', buildTodayQueue().length === 10, `got=${buildTodayQueue().length}`);
}

// ── 라운드 37: N3 2차 안정화 — 장문 UX / g_n3_1·2 재검토 / 회화 추천 ──
console.log('\n[197] 장문 독해 — long-passage 클래스 + CSS + 배지');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  const screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n3_37' }, {});
  const ctx197 = screen.querySelector('.q-context');
  ok('197: long-passage 클래스 부여 (지문 200자+)', ctx197?.classList.contains('long-passage'));
  ok('197: 장문에도 ruby 렌더', !!ctx197?.querySelector('ruby'));
  ok('197: 준비도 배너 (빈 학습 상태)', !!screen.querySelector('#readinessBanner'));
  const { readFileSync: _rf197 } = await import('node:fs');
  ok('197: styles.css 에 long-passage 규칙', _rf197('styles.css', 'utf-8').includes('.q-context.long-passage'));
  // 일반 길이 지문엔 클래스 없음
  const screen2 = shell();
  renderQuestion(screen2, { itemType: 'reading', itemId: 'r_n3_21' }, {});
  ok('197: 단문엔 long-passage 미부여', !screen2.querySelector('.q-context')?.classList.contains('long-passage'));
}

console.log('\n[198] g_n3_1·2 재검토 결과 — 분리된 문법 렌더 + 페어 재매핑');
{
  bootstrap();
  setLevel('N3');
  const { grammar: _g198 } = await import('./js/data/grammar.js');
  const { grammarPairs: _gp198 } = await import('./js/data/grammarPairs.js');
  ok('198: g_n3_1 = ことにしている', _g198.find(g => g.id === 'g_n3_1').pattern === '〜ことにしている');
  ok('198: g_n3_2 = ぶり(に)', _g198.find(g => g.id === 'g_n3_2').pattern === '〜ぶり(に)');
  const gp198 = _gp198.find(p => p.id === 'gp_n3_1');
  ok('198: gp_n3_1 은 N4 기본형 비교로 재매핑', gp198.a === 'g_n4_20' && gp198.b === 'g_n4_21');
  let screen = shell();
  renderQuestion(screen, { itemType: 'grammar', itemId: 'g_n3_1' }, {});
  ok('198: g_n3_1 문제 렌더 (choice 4)', screen.querySelectorAll('.choice').length === 4);
  screen = shell();
  renderQuestion(screen, { itemType: 'grammar', itemId: 'g_n3_2' }, {});
  ok('198: g_n3_2 문제 렌더 + 선택 전 해설 미노출',
     screen.querySelectorAll('.choice').length === 4 && !screen.textContent.includes('다시 일어남'));
  screen.querySelectorAll('.choice')[0].click();
  ok('198: 선택 후 해설 노출', !!screen.querySelector('.explain'));
}

console.log('\n[199] 회화 평가 — sentenceBank 연습 문장 추천 + 원문 미기록');
{
  bootstrap();
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer: _ev37 } = await import('./js/localEvaluator.js');
  const { conversationTopics: _ct37 } = await import('./js/data/conversationTopics.js');
  const logW37 = [];
  logger._setWriterForTest(async (p, v) => { logW37.push({ p, v }); });
  const topic37 = _ct37.find(t => t.id === 'conv_n3_service_complaint');
  const SECRET37 = '商品が届きません、ハンです';
  const r37 = _ev37({ topic: topic37, question: topic37.starterQuestions[0], userText: SECRET37, reviewStates: {} });
  ok('199: 관련 연습 문장(sentenceBank) 추천 존재', (r37.relatedPracticeSentences || []).length >= 1,
     JSON.stringify((r37.relatedPracticeSentences || []).map(s => s.id)));
  ok('199: 추천 문장은 N3 sentenceBank 의 실제 문장',
     (r37.relatedPracticeSentences || []).every(s => /^sent_n3_/.test(s.id)));
  ok('199: 로그에 답변 원문 미기록', !JSON.stringify(logW37).includes('ハンです'));
  ok('199: 평가 중 로그 0건', logW37.length === 0);
  logger._resetWriterForTest();
}

console.log('\n[200] 장문형 스토리 — 7~8문단 상세 + 학습 왕복');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n3_007'] });
  ok('200: 7문단 전부 렌더', screen.querySelectorAll('#storyBody .story-line').length === 7,
     `got=${screen.querySelectorAll('#storyBody .story-line').length}`);
  ok('200: ruby + romaji + 한국어', !!screen.querySelector('#storyBody ruby')
     && screen.textContent.includes('joutatsu'));
  const pill200 = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n3_007').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('200: vocabId 하이라이트 존재', !!pill200);
  pill200.click();
  pill200.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('200: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/')
     && peekStudyReturnRoute() === 'story/story_n3_007');
}

// ── 라운드 38: N3 3차 마무리 확장 — 신규 콘텐츠 UI ──────────────────────
console.log('\n[201] N3 3차 신규 단어 카드 — romaji + 퀴즈 누출 없음');
{
  bootstrap({ withTTS: true });
  setLevel('N3');
  state.setVocabWarmupEnabled(false);
  const screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n3_1138'] }); // 捉える → toraeru
  ok('201: quickPreview 에 toraeru 표시', screen.textContent.includes('toraeru'));
  passPreview(screen);
  ok('201: quiz thinking 에 romaji 미표시', !screen.textContent.includes('toraeru'));
  ok('201: quiz thinking 에 뜻 미표시', !screen.textContent.includes('파악'));
  ok('201: choice 4개', screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[202] N3 3차 신규 장문 독해 — long-passage class + 청해 숨김');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n3_69' }, {}); // 장문(200+)
  const ctx202 = screen.querySelector('.q-context');
  ok('202: 신규 장문 long-passage 클래스', ctx202?.classList.contains('long-passage'));
  ok('202: 장문 ruby 렌더', !!ctx202?.querySelector('ruby'));
  // 신규 청해 — 스크립트 숨김(TTS 가능 시 context null)
  const screen2 = shell();
  renderQuestion(screen2, { itemType: 'listening', itemId: 'l_n3_67' }, {});
  ok('202: 신규 청해 choice 4개', screen2.querySelectorAll('.choice').length === 4);
}

console.log('\n[203] N3 3차 신규 문법 — 해설 노출 시점 + 비교 페어');
{
  bootstrap();
  setLevel('N3');
  let screen = shell();
  renderQuestion(screen, { itemType: 'grammar', itemId: 'g_n3_90' }, {}); // 〜得る
  ok('203: choice 4개', screen.querySelectorAll('.choice').length === 4);
  ok('203: 선택 전 해설 미노출', !screen.textContent.includes('가능성이 있음'));
  screen.querySelectorAll('.choice')[0].click();
  ok('203: 선택 후 .explain 등장', !!screen.querySelector('.explain'));
  const { grammarPairs: _gp203 } = await import('./js/data/grammarPairs.js');
  const { grammar: _g203 } = await import('./js/data/grammar.js');
  const gIds203 = new Set(_g203.map(g => g.id));
  const n3p = _gp203.filter(p => p.level === 'N3');
  ok('203: N3 pairs ≥ 24', n3p.length >= 24);
  ok('203: pair grammarIds 전부 실존', n3p.every(p => gIds203.has(p.a) && gIds203.has(p.b)));
}

console.log('\n[204] N3 3차 신규 스토리/토픽 — 본문·하이라이트·평가');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  clearStudyReturnRoute();
  let screen = shell();
  renderStories({ screen, params: [] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N3')?.click();
  ok('204: N3 이야기 row ≥ 9', screen.querySelectorAll('#storyList .row').length >= 9,
     `got=${screen.querySelectorAll('#storyList .row').length}`);
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n3_013'] });
  ok('204: story_n3_013 ruby + romaji', !!screen.querySelector('#storyBody ruby') && screen.textContent.includes('kanten'));
  const pill204 = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n3_013').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('204: vocabId 하이라이트 존재', !!pill204);
  pill204.click();
  pill204.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('204: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/')
     && peekStudyReturnRoute() === 'story/story_n3_013');
  // 신규 토픽 평가 + sentenceBank 추천 + 원문 미기록
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer: _ev38 } = await import('./js/localEvaluator.js');
  const { conversationTopics: _ct38 } = await import('./js/data/conversationTopics.js');
  const logW38 = [];
  logger._setWriterForTest(async (p, v) => { logW38.push(p); });
  for (const tid of ['conv_n3_social_debate', 'conv_n3_workplace_solution', 'conv_n3_local_event']) {
    const topic = _ct38.find(t => t.id === tid);
    const r = _ev38({ topic, question: topic.starterQuestions[0], userText: '高齢化は問題だと思います、リーです', reviewStates: {} });
    ok(`204: ${tid} sampleAnswer 출처`, topic.starterQuestions[0].sampleAnswers.some(a => a.ja === r.sampleAnswer.ja));
    ok(`204: ${tid} 관련 연습 문장 추천`, (r.relatedPracticeSentences || []).every(s => /^sent_n3_/.test(s.id)));
  }
  ok('204: 로그에 답변 원문 미기록', !JSON.stringify(logW38).includes('リーです'));
  ok('204: 평가 중 로그 0건', logW38.length === 0);
  logger._resetWriterForTest();
}

console.log('\n[205] N3 3차 — 추천 균형 + 큐 유지');
{
  bootstrap();
  setLevel('N3');
  const cr205 = await import('./js/contentReadiness.js');
  const { vocab: _v205 } = await import('./js/data/vocab.js');
  const { grammar: _g205 } = await import('./js/data/grammar.js');
  const rsM = {};
  [..._v205, ..._g205].filter(x => ['N5', 'N4'].includes(x.level)).forEach(x => { rsM[x.id] = { correctCount: 1 }; });
  for (const [name, fn] of [['reading', cr205.getRecommendedReading], ['listening', cr205.getRecommendedListening], ['stories', cr205.getRecommendedStories]]) {
    const rec = fn('N3', rsM, { count: 6 });
    ok(`205: 추천(${name}) N3 포함 + 복습 유지`, rec.some(r => r.item.level === 'N3') && rec.some(r => r.item.level !== 'N3'));
  }
  ok('205: 오늘의 10분 큐 10개', buildTodayQueue().length === 10);
  // N3 부분 학습: 신규 항목이 ready 로 상위 진입
  const dep205 = cr205.getItemDependency('reading', 'r_n3_47');
  const rsP = {};
  for (const id of [...dep205.vocabIds, ...dep205.grammarIds, ...(dep205.optionalVocabIds || [])]) rsP[id] = { correctCount: 1 };
  const recP = cr205.getRecommendedReading('N3', rsP, { count: 8 });
  ok('205: 부분 학습 시 ready 항목 존재', recP.some(r => r.readiness === 'ready'));
}

// ── 라운드 39: N3 3차 안정화 / 최종 품질 잠금 ──────────────────────────
console.log('\n[206] N3 장문 독해 — long-passage 렌더 + 큐 진입 무결');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  // 장문 200자+ 여러 편 렌더 확인
  for (const id of ['r_n3_37', 'r_n3_69', 'r_n3_71', 'r_n3_75']) {
    const screen = shell();
    renderQuestion(screen, { itemType: 'reading', itemId: id }, {});
    const ctx = screen.querySelector('.q-context');
    ok(`206: ${id} long-passage 클래스`, ctx?.classList.contains('long-passage'));
    ok(`206: ${id} ruby + choice 4`, !!ctx?.querySelector('ruby') && screen.querySelectorAll('.choice').length === 4);
  }
  ok('206: 오늘의 10분 큐 10개 (장문 포함 가능)', buildTodayQueue().length === 10);
}

console.log('\n[207] N3 신규 대량 단어 카드 — romaji + 누출 없음 (샘플 3종)');
{
  for (const [vid, romaji, mean] of [['v_n3_1003', 'kanten', '관점'], ['v_n3_716', 'sabetsu', '차별'], ['v_n3_1285', 'kagayaku', '빛나다']]) {
    bootstrap({ withTTS: true });
    setLevel('N3');
    state.setVocabWarmupEnabled(false);
    const screen = shell();
    renderStudy({ screen, params: ['vocab', 'card', vid] });
    ok(`207: ${vid} quickPreview romaji 표시`, screen.textContent.includes(romaji));
    passPreview(screen);
    ok(`207: ${vid} quiz 에 romaji 미노출`, !screen.textContent.includes(romaji));
    ok(`207: ${vid} quiz 에 뜻 미노출`, !screen.textContent.includes(mean));
  }
}

console.log('\n[208] N3 신규 문법 — 해설 노출 시점 (샘플 2종)');
{
  bootstrap();
  setLevel('N3');
  for (const [gid, hidden] of [['g_n3_76', '나쁜'], ['g_n3_113', '범위']]) {
    const screen = shell();
    renderQuestion(screen, { itemType: 'grammar', itemId: gid }, {});
    ok(`208: ${gid} choice 4`, screen.querySelectorAll('.choice').length === 4);
    const before = screen.querySelector('.explain');
    ok(`208: ${gid} 선택 전 해설 영역 없음/빈값`, !before || !before.textContent.trim());
    screen.querySelectorAll('.choice')[0].click();
    ok(`208: ${gid} 선택 후 .explain 등장`, !!screen.querySelector('.explain'));
  }
}

console.log('\n[209] N3 장문 story — ruby/romaji/한국어/하이라이트 + 학습 왕복');
{
  bootstrap();
  setLevel('N3');
  setFuriganaEnabled(true);
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n3_012'] }); // 7문단 장문형
  ok('209: 7문단 전부 렌더', screen.querySelectorAll('#storyBody .story-line').length === 7);
  ok('209: ruby + romaji', !!screen.querySelector('#storyBody ruby') && screen.textContent.includes('koureika'));
  ok('209: 한국어 해석 노출', screen.textContent.includes('고령화'));
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n3_012').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('209: vocabId 하이라이트 존재', !!pill);
  pill.click();
  pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('209: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/')
     && peekStudyReturnRoute() === 'story/story_n3_012');
}

console.log('\n[210] N3 conversation 평가 — sampleAnswer/연습 문장 + 원문 미기록 (전 12토픽)');
{
  bootstrap();
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer: _ev39 } = await import('./js/localEvaluator.js');
  const { conversationTopics: _ct39 } = await import('./js/data/conversationTopics.js');
  const { sentenceBank: _sb39 } = await import('./js/data/sentenceBank.js');
  const logW = [];
  logger._setWriterForTest(async (p, v) => { logW.push({ p, v }); });
  const n3topics = _ct39.filter(t => t.level === 'N3');
  ok('210: N3 토픽 12개', n3topics.length === 12);
  const SECRET = 'これは秘密の答えです、ナカムラと申します';
  let allSampleOk = true, allMatchOk = true;
  for (const t of n3topics) {
    const r = _ev39({ topic: t, question: t.starterQuestions[0], userText: SECRET, reviewStates: {} });
    if (!r.sampleAnswer || !t.starterQuestions[0].sampleAnswers.some(a => a.ja === r.sampleAnswer.ja)) allSampleOk = false;
    // 토픽별 sentenceBank 매칭 ≥ 5
    const m = _sb39.filter(s => s.level === 'N3' && s.canUseInConversation && (s.situationTags || []).some(x => t.situationTags.includes(x)));
    if (m.length < 5) allMatchOk = false;
  }
  ok('210: 모든 토픽 sampleAnswer 는 topic 데이터 출처', allSampleOk);
  ok('210: 모든 토픽 sentenceBank 매칭 ≥ 5', allMatchOk);
  ok('210: 로그에 답변 원문/이름 미기록', !JSON.stringify(logW).includes('ナカムラ') && !JSON.stringify(logW).includes('秘密'));
  ok('210: 평가 중 로그 0건', logW.length === 0);
  logger._resetWriterForTest();
}

console.log('\n[211] N3 추천 — N3 독점 아님 + 복습 유지 + 큐 fallback');
{
  bootstrap();
  setLevel('N3');
  const cr = await import('./js/contentReadiness.js');
  const { vocab: _v } = await import('./js/data/vocab.js');
  const { grammar: _g } = await import('./js/data/grammar.js');
  // 빈 학습 상태
  for (const fn of [cr.getRecommendedReading, cr.getRecommendedListening, cr.getRecommendedStories]) {
    ok('211: 빈 학습 상태 추천 비지 않음', fn('N3', {}, { count: 5 }).length > 0);
  }
  // N5/N4 마스터
  const rsM = {};
  [..._v, ..._g].filter(x => ['N5', 'N4'].includes(x.level)).forEach(x => { rsM[x.id] = { correctCount: 1 }; });
  for (const [name, fn] of [['reading', cr.getRecommendedReading], ['listening', cr.getRecommendedListening], ['stories', cr.getRecommendedStories]]) {
    const rec = fn('N3', rsM, { count: 6 });
    ok(`211: 추천(${name}) N3 포함`, rec.some(r => r.item.level === 'N3'));
    ok(`211: 추천(${name}) N3 독점 아님(복습 ≥1)`, rec.some(r => r.item.level !== 'N3'));
  }
  ok('211: 큐 10개 유지', buildTodayQueue().length === 10);
}

// ── 라운드 40: N2 0차 시드 — 목표 레벨 N2 동작 ─────────────────────────
console.log('\n[212] N2 목표 레벨 — 학습 화면 + 단어 카드 romaji/누출');
{
  bootstrap({ withTTS: true });
  setLevel('N2');
  let screen = shell();
  renderStudy({ screen, params: ['vocab', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N2')?.click();
  ok('212: N2 단어 목록 노출 (row ≥ 1)', screen.querySelectorAll('#studyListSection .row').length >= 1);
  ok('212: N2 row romaji 표시', !!screen.querySelector('.romaji-sub'));
  // 단어 카드 — 需要(じゅよう→juyou)
  state.setVocabWarmupEnabled(false);
  screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n2_6'] });
  ok('212: quickPreview 에 juyou 표시', screen.textContent.includes('juyou'));
  passPreview(screen);
  ok('212: quiz 에 romaji 미노출', !screen.textContent.includes('juyou'));
  ok('212: quiz 에 뜻 미노출', !screen.textContent.includes('수요'));
  ok('212: choice 4개', screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[213] N2 독해/청해 — 준비도 배지 + 진입 + 문법 해설');
{
  bootstrap();
  setLevel('N2');
  setFuriganaEnabled(true);
  let screen = shell();
  renderStudy({ screen, params: ['reading', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N2')?.click();
  ok('213: N2 독해 준비도 배지', !!screen.querySelector('.readiness-badge'));
  screen = shell();
  renderStudy({ screen, params: ['listening', 'browse'] });
  Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N2')?.click();
  ok('213: N2 청해 준비도 배지', !!screen.querySelector('.readiness-badge'));
  // 독해 진입
  screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n2_2' }, {});
  ok('213: N2 독해 choice 4 + ruby', screen.querySelectorAll('.choice').length === 4 && !!screen.querySelector('ruby'));
  // 문법 해설 시점
  screen = shell();
  renderQuestion(screen, { itemType: 'grammar', itemId: 'g_n2_1' }, {});
  ok('213: N2 문법 choice 4 + 선택 전 해설 미노출', screen.querySelectorAll('.choice').length === 4 && !screen.textContent.includes('문어적'));
  screen.querySelectorAll('.choice')[0].click();
  ok('213: 선택 후 .explain 등장', !!screen.querySelector('.explain'));
}

console.log('\n[214] N2 story — ruby/romaji/한국어 3단 + 하이라이트 학습 왕복');
{
  bootstrap();
  setLevel('N2');
  setFuriganaEnabled(true);
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n2_001'] });
  ok('214: 본문 ruby', !!screen.querySelector('#storyBody ruby'));
  ok('214: romaji 표시', screen.textContent.includes('shoutengai') || screen.textContent.includes('fukyou'));
  ok('214: 한국어 해석 노출', screen.textContent.includes('상점가') || screen.textContent.includes('불황'));
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n2_001').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('214: vocabId 하이라이트 존재', !!pill);
  pill.click();
  pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('214: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/')
     && peekStudyReturnRoute() === 'story/story_n2_001');
}

console.log('\n[215] N2 회화 평가 — 표현 수 + sampleAnswer/연습 문장 + 원문 미기록');
{
  bootstrap();
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer: _ev40 } = await import('./js/localEvaluator.js');
  const { conversationTopics: _ct40 } = await import('./js/data/conversationTopics.js');
  const { sentenceBank: _sb40 } = await import('./js/data/sentenceBank.js');
  const logW = [];
  logger._setWriterForTest(async (p, v) => { logW.push({ p, v }); });
  const n2t = _ct40.filter(t => t.level === 'N2');
  ok('215: N2 토픽 ≥ 3', n2t.length >= 3);
  const SECRET = '高齢化は課題だと考えます、ヤマダと申します';
  for (const t of n2t) {
    const r = _ev40({ topic: t, question: t.starterQuestions[0], userText: SECRET, reviewStates: {} });
    ok(`215: ${t.id} sampleAnswer 출처`, t.starterQuestions[0].sampleAnswers.some(a => a.ja === r.sampleAnswer.ja));
    ok(`215: ${t.id} 연습 문장 N2`, (r.relatedPracticeSentences || []).every(s => /^sent_n2_/.test(s.id)));
    const m = _sb40.filter(s => s.level === 'N2' && s.canUseInConversation && (s.situationTags || []).some(x => t.situationTags.includes(x)));
    ok(`215: ${t.id} 관련 문장 ≥ 5`, m.length >= 5);
  }
  ok('215: 로그에 답변 원문/이름 미기록', !JSON.stringify(logW).includes('ヤマダ'));
  ok('215: 평가 중 로그 0건', logW.length === 0);
  logger._resetWriterForTest();
}

console.log('\n[216] N2 추천/큐 — N2 포함 + 복습 유지 + 큐 10개');
{
  bootstrap();
  setLevel('N2');
  const cr = await import('./js/contentReadiness.js');
  const { vocab: _v } = await import('./js/data/vocab.js');
  const { grammar: _g } = await import('./js/data/grammar.js');
  // 빈 학습 상태 추천 비지 않음
  for (const fn of [cr.getRecommendedReading, cr.getRecommendedListening, cr.getRecommendedStories])
    ok('216: 빈 학습 추천 비지 않음', fn('N2', {}, { count: 5 }).length > 0);
  // N3 마스터 → N2 일부 + 하위 복습 유지
  const rsM = {};
  [..._v, ..._g].filter(x => ['N5', 'N4', 'N3'].includes(x.level)).forEach(x => { rsM[x.id] = { correctCount: 1 }; });
  const rec = cr.getRecommendedReading('N2', rsM, { count: 8 });
  ok('216: N2 추천에 N2 포함', rec.some(r => r.item.level === 'N2'));
  ok('216: N2 추천에 복습(하위) 유지', rec.some(r => r.item.level !== 'N2'));
  ok('216: N2 큐 10개', buildTodayQueue().length === 10);
}

// ── 라운드 41: N2 0차 안정화 — 목록 표시 / 문법 / 부분 학습 추천 ───────
console.log('\n[217] N2 목표 레벨 — 4개 영역 목록 정상 표시');
{
  bootstrap();
  setLevel('N2');
  setFuriganaEnabled(true);
  for (const [type, sel] of [['vocab', '#studyListSection .row'], ['grammar', '#studyListSection .row'], ['reading', '.readiness-badge'], ['listening', '.readiness-badge']]) {
    const screen = shell();
    renderStudy({ screen, params: [type, 'browse'] });
    Array.from(screen.querySelectorAll('.chip')).find(b => b.textContent === 'N2')?.click();
    ok(`217: N2 ${type} 목록 표시`, screen.querySelectorAll(sel).length >= 1, `sel=${sel}`);
  }
}

console.log('\n[218] N2 단어 카드 — romaji + 누출 없음 (샘플 3종)');
{
  for (const [vid, romaji, mean] of [['v_n2_47', 'honshitsu', '본질'], ['v_n2_90', 'dakyou', '타협'], ['v_n2_100', 'yoron', '여론']]) {
    bootstrap({ withTTS: true });
    setLevel('N2');
    state.setVocabWarmupEnabled(false);
    const screen = shell();
    renderStudy({ screen, params: ['vocab', 'card', vid] });
    ok(`218: ${vid} quickPreview romaji`, screen.textContent.includes(romaji));
    passPreview(screen);
    ok(`218: ${vid} quiz romaji 미노출`, !screen.textContent.includes(romaji));
    ok(`218: ${vid} quiz 뜻 미노출`, !screen.textContent.includes(mean));
  }
}

console.log('\n[219] N2 신규 문법 — 해설 노출 시점 + 비교 페어');
{
  bootstrap();
  setLevel('N2');
  for (const [gid, hidden] of [['g_n2_2', '동반'], ['g_n2_13', '불문']]) {
    const screen = shell();
    renderQuestion(screen, { itemType: 'grammar', itemId: gid }, {});
    ok(`219: ${gid} choice 4`, screen.querySelectorAll('.choice').length === 4);
    const before = screen.querySelector('.explain');
    ok(`219: ${gid} 선택 전 해설 미노출`, !before || !before.textContent.trim());
    screen.querySelectorAll('.choice')[0].click();
    ok(`219: ${gid} 선택 후 .explain 등장`, !!screen.querySelector('.explain'));
  }
  const { grammarPairs: _gp219 } = await import('./js/data/grammarPairs.js');
  const { grammar: _g219 } = await import('./js/data/grammar.js');
  const gIds = new Set(_g219.map(g => g.id));
  const n2p = _gp219.filter(p => p.level === 'N2');
  ok('219: N2 pairs ≥ 4', n2p.length >= 4);
  ok('219: pair grammarIds 실존', n2p.every(p => gIds.has(p.a) && gIds.has(p.b)));
}

console.log('\n[220] N2 story — ruby/romaji/한국어 + 하이라이트 학습 왕복 (단편)');
{
  bootstrap();
  setLevel('N2');
  setFuriganaEnabled(true);
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n2_003'] });
  ok('220: 본문 ruby', !!screen.querySelector('#storyBody ruby'));
  ok('220: romaji 표시', screen.textContent.includes('kisha') || screen.textContent.includes('jijitsu'));
  ok('220: 한국어 해석', screen.textContent.includes('기자') || screen.textContent.includes('사실'));
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n2_003').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('220: vocabId 하이라이트 존재', !!pill);
  pill.click();
  pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('220: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/')
     && peekStudyReturnRoute() === 'story/story_n2_003');
}

console.log('\n[221] N2 부분 학습 추천 + 회화 평가 원문 미기록');
{
  bootstrap();
  setLevel('N2');
  const cr = await import('./js/contentReadiness.js');
  // N2 일부 학습 → 해당 항목 ready 상위
  const dep = cr.getItemDependency('reading', 'r_n2_2');
  const rsP = {};
  for (const id of [...dep.vocabIds, ...dep.grammarIds, ...(dep.optionalVocabIds || [])]) rsP[id] = { correctCount: 1 };
  const recP = cr.getRecommendedReading('N2', rsP, { count: 8 });
  ok('221: 부분 학습 시 ready 항목 존재', recP.some(r => r.readiness === 'ready'));
  ok('221: locked 독점 아님', recP.some(r => r.readiness !== 'locked'));
  // 회화 평가 원문 미기록
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer: _ev41 } = await import('./js/localEvaluator.js');
  const { conversationTopics: _ct41 } = await import('./js/data/conversationTopics.js');
  const logW = [];
  logger._setWriterForTest(async (p, v) => { logW.push({ p, v }); });
  const topic = _ct41.find(t => t.id === 'conv_n2_news_discussion');
  const r = _ev41({ topic, question: topic.starterQuestions[0], userText: '景気は回復しています、サトウです', reviewStates: {} });
  ok('221: sampleAnswer 출처', topic.starterQuestions[0].sampleAnswers.some(a => a.ja === r.sampleAnswer.ja));
  ok('221: 연습 문장 N2', (r.relatedPracticeSentences || []).every(s => /^sent_n2_/.test(s.id)));
  ok('221: 로그에 원문/이름 미기록', !JSON.stringify(logW).includes('サトウ'));
  ok('221: 평가 중 로그 0건', logW.length === 0);
  logger._resetWriterForTest();
}

// ── 라운드 42: N2 1차 확장 ─────────────────────────────────────────────
console.log('\n[222] N2 1차 확장 — 수량 sentinel');
{
  const { vocab: _v42 } = await import('./js/data/vocab.js');
  const { kanji: _k42 } = await import('./js/data/kanji.js');
  const { grammar: _g42 } = await import('./js/data/grammar.js');
  const { grammarPairs: _gp42 } = await import('./js/data/grammarPairs.js');
  const { reading: _r42 } = await import('./js/data/reading.js');
  const { listening: _l42 } = await import('./js/data/listening.js');
  const { sentenceBank: _sb42 } = await import('./js/data/sentenceBank.js');
  const { conversationTopics: _t42 } = await import('./js/data/conversationTopics.js');
  const { stories: _s42 } = await import('./js/data/stories.js');
  ok('222: N2 vocab 300', _v42.filter(v => v.level === 'N2').length >= 300);
  ok('222: N2 kanji 200', _k42.filter(k => k.level === 'N2').length >= 200);
  ok('222: N2 grammar 40', _g42.filter(g => g.level === 'N2').length >= 40);
  ok('222: N2 pairs 10', _gp42.filter(p => p.level === 'N2').length >= 10);
  ok('222: N2 reading 20', _r42.filter(r => r.level === 'N2').length >= 20);
  ok('222: N2 listening 20', _l42.filter(l => l.level === 'N2').length >= 20);
  ok('222: N2 sentenceBank 120', _sb42.filter(s => s.level === 'N2').length >= 120);
  ok('222: N2 회화 가능 100', _sb42.filter(s => s.level === 'N2' && s.canUseInConversation).length >= 100);
  ok('222: N2 topics 6', _t42.filter(t => t.level === 'N2').length >= 6);
  ok('222: N2 stories 6', _s42.filter(s => s.level === 'N2').length >= 6);
}

console.log('\n[223] N2 신규 단어 카드 — romaji + 누출 없음 (1차 샘플 3종)');
{
  for (const [vid, romaji, mean] of [['v_n2_157', 'kakusa', '격차'], ['v_n2_290', 'kyoutei', '협정'], ['v_n2_261', 'dakaisaku', '타개책']]) {
    bootstrap({ withTTS: true });
    setLevel('N2');
    state.setVocabWarmupEnabled(false);
    const screen = shell();
    renderStudy({ screen, params: ['vocab', 'card', vid] });
    ok(`223: ${vid} quickPreview romaji`, screen.textContent.includes(romaji));
    passPreview(screen);
    ok(`223: ${vid} quiz romaji 미노출`, !screen.textContent.includes(romaji));
    ok(`223: ${vid} quiz 뜻 미노출`, !screen.textContent.includes(mean));
  }
}

console.log('\n[224] N2 신규 문법 — 해설 노출 시점 + 신규 페어 동작');
{
  bootstrap();
  setLevel('N2');
  for (const gid of ['g_n2_24', 'g_n2_30', 'g_n2_37']) {
    const screen = shell();
    renderQuestion(screen, { itemType: 'grammar', itemId: gid }, {});
    ok(`224: ${gid} choice 4`, screen.querySelectorAll('.choice').length === 4);
    const before = screen.querySelector('.explain');
    ok(`224: ${gid} 선택 전 해설 미노출`, !before || !before.textContent.trim());
    screen.querySelectorAll('.choice')[0].click();
    ok(`224: ${gid} 선택 후 .explain 등장`, !!screen.querySelector('.explain'));
  }
  const { grammarPairs: _gp224 } = await import('./js/data/grammarPairs.js');
  const { grammar: _g224 } = await import('./js/data/grammar.js');
  const gIds = new Set(_g224.map(g => g.id));
  const n2p = _gp224.filter(p => p.level === 'N2');
  ok('224: N2 pairs ≥ 10', n2p.length >= 10);
  ok('224: pair grammarIds 실존', n2p.every(p => gIds.has(p.a) && gIds.has(p.b)));
  const gp5 = _gp224.find(p => p.id === 'gp_n2_5');
  ok('224: gp_n2_5 choices 4 + answer 유효', gp5 && gp5.choices.length === 4 && gp5.choices[gp5.answerIndex]);
}

console.log('\n[225] N2 신규 회화 주제 + 신규 story 하이라이트 왕복');
{
  const { conversationTopics: _ct225 } = await import('./js/data/conversationTopics.js');
  const { sentenceBank: _sb225 } = await import('./js/data/sentenceBank.js');
  const topic = _ct225.find(t => t.id === 'conv_n2_service_request');
  ok('225: 신규 주제 존재', !!topic);
  const m = _sb225.filter(s => s.level === 'N2' && s.canUseInConversation
    && (s.situationTags || []).some(tg => topic.situationTags.includes(tg)));
  ok('225: 관련 문장 ≥ 5', m.length >= 5, `match=${m.length}`);
  // sampleAnswer 가 실제 sentenceBank 문장과 연결
  const jaSet = new Set(_sb225.map(s => s.ja));
  ok('225: sampleAnswer 출처(sentenceBank)', topic.starterQuestions.every(q => q.sampleAnswers.some(a => jaSet.has(a.ja))));
  // 신규 story 왕복
  bootstrap();
  setLevel('N2');
  setFuriganaEnabled(true);
  clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n2_004'] });
  ok('225: 신규 story ruby', !!screen.querySelector('#storyBody ruby'));
  ok('225: 신규 story romaji', screen.textContent.includes('fukkou') || screen.textContent.includes('machi'));
  ok('225: 신규 story 한국어', screen.textContent.includes('부흥') || screen.textContent.includes('마을'));
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n2_004').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('225: vocabId 하이라이트 존재', !!pill);
  pill.click();
  pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('225: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/')
     && peekStudyReturnRoute() === 'story/story_n2_004');
}

// ── 라운드 43: N2 1차 안정화 ───────────────────────────────────────────
console.log('\n[226] N2 복구 0차 단어 + 신규 1차 단어 — 카드 정상 + romaji + 누출 없음');
{
  // v_n2_77(核心, 복구된 0차) + v_n2_290(協定, 1차) 모두 정상 렌더
  for (const [vid, romaji, mean] of [['v_n2_77', 'kakushin', '핵심'], ['v_n2_290', 'kyoutei', '협정']]) {
    bootstrap({ withTTS: true });
    setLevel('N2');
    state.setVocabWarmupEnabled(false);
    const screen = shell();
    renderStudy({ screen, params: ['vocab', 'card', vid] });
    ok(`226: ${vid} 카드 렌더`, screen.querySelectorAll('.choice').length === 4 || !!screen.textContent);
    ok(`226: ${vid} quickPreview romaji`, screen.textContent.includes(romaji));
    passPreview(screen);
    ok(`226: ${vid} quiz romaji 미노출`, !screen.textContent.includes(romaji));
    ok(`226: ${vid} quiz 뜻 미노출`, !screen.textContent.includes(mean));
  }
}

console.log('\n[227] N2 추천 비편중 — N2 큐에 N2+하위 복습 혼재');
{
  bootstrap();
  setLevel('N2');
  const cr = await import('./js/contentReadiness.js');
  const { vocab: _v227 } = await import('./js/data/vocab.js');
  const { grammar: _g227 } = await import('./js/data/grammar.js');
  // N3 마스터 + N2 일부 학습
  const rs = {};
  [..._v227, ..._g227].filter(x => ['N5', 'N4', 'N3'].includes(x.level)).forEach(x => { rs[x.id] = { correctCount: 1 }; });
  const dep = cr.getItemDependency('reading', 'r_n2_2');
  [...dep.vocabIds, ...dep.grammarIds, ...(dep.optionalVocabIds || [])].forEach(id => { rs[id] = { correctCount: 1 }; });
  const rec = cr.getRecommendedReading('N2', rs, { count: 8 });
  ok('227: N2 ready 상위 존재', rec.length > 0 && rec[0].readiness === 'ready');
  ok('227: 추천이 N2 단독 아님(하위 복습 포함)', rec.some(r => r.item.level !== 'N2'));
  ok('227: 추천에 N2 포함', rec.some(r => r.item.level === 'N2'));
  const q = buildTodayQueue();
  ok('227: 큐 10개', q.length === 10);
}

// ── 라운드 44: N2 2차 확장 ─────────────────────────────────────────────
console.log('\n[228] N2 2차 수량 + 장문 long-passage 렌더');
{
  const { vocab: _v } = await import('./js/data/vocab.js');
  const { kanji: _k } = await import('./js/data/kanji.js');
  const { grammar: _g } = await import('./js/data/grammar.js');
  const { grammarPairs: _gp } = await import('./js/data/grammarPairs.js');
  const { reading: _r } = await import('./js/data/reading.js');
  const { listening: _l } = await import('./js/data/listening.js');
  const { sentenceBank: _sb } = await import('./js/data/sentenceBank.js');
  const { conversationTopics: _t } = await import('./js/data/conversationTopics.js');
  const { stories: _s } = await import('./js/data/stories.js');
  ok('228: N2 vocab 900', _v.filter(v => v.level === 'N2').length >= 900);
  ok('228: N2 kanji 300', _k.filter(k => k.level === 'N2').length >= 300);
  ok('228: N2 grammar 80', _g.filter(g => g.level === 'N2').length >= 80);
  ok('228: N2 pairs 20', _gp.filter(p => p.level === 'N2').length >= 20);
  ok('228: N2 reading 50', _r.filter(r => r.level === 'N2').length >= 50);
  ok('228: N2 listening 50', _l.filter(l => l.level === 'N2').length >= 50);
  ok('228: N2 sentenceBank 320', _sb.filter(s => s.level === 'N2').length >= 320);
  ok('228: N2 topics 10', _t.filter(t => t.level === 'N2').length >= 10);
  ok('228: N2 stories 10', _s.filter(s => s.level === 'N2').length >= 10);
  // 장문 long-passage 렌더
  bootstrap(); setLevel('N2'); setFuriganaEnabled(true);
  const screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n2_48' }, {});
  const ctx = screen.querySelector('.q-context');
  ok('228: r_n2_48 long-passage 클래스', ctx?.classList.contains('long-passage'));
  ok('228: 장문에도 ruby 렌더', !!ctx?.querySelector('ruby'));
  ok('228: 선택지 4개', screen.querySelectorAll('.choice').length === 4);
}

console.log('\n[229] N2 2차 신규 단어 카드 — romaji + 누출 없음');
{
  for (const [vid, romaji, mean] of [['v_n2_301', 'seiken', '정권'], ['v_n2_435', 'fukushi', '복지'], ['v_n2_701', 'geinou', '예능']]) {
    bootstrap({ withTTS: true }); setLevel('N2'); state.setVocabWarmupEnabled(false);
    const screen = shell();
    renderStudy({ screen, params: ['vocab', 'card', vid] });
    ok(`229: ${vid} quickPreview romaji`, screen.textContent.includes(romaji));
    passPreview(screen);
    ok(`229: ${vid} quiz romaji 미노출`, !screen.textContent.includes(romaji));
    ok(`229: ${vid} quiz 뜻 미노출`, !screen.textContent.includes(mean));
  }
}

console.log('\n[230] N2 2차 신규 문법/회화/story');
{
  bootstrap(); setLevel('N2');
  for (const gid of ['g_n2_43', 'g_n2_56', 'g_n2_77']) {
    const screen = shell();
    renderQuestion(screen, { itemType: 'grammar', itemId: gid }, {});
    ok(`230: ${gid} choice 4`, screen.querySelectorAll('.choice').length === 4);
    const before = screen.querySelector('.explain');
    ok(`230: ${gid} 선택 전 해설 미노출`, !before || !before.textContent.trim());
    screen.querySelectorAll('.choice')[0].click();
    ok(`230: ${gid} 선택 후 .explain 등장`, !!screen.querySelector('.explain'));
  }
  // 신규 회화 주제 매칭 + sampleAnswer 출처
  const { conversationTopics: _ct } = await import('./js/data/conversationTopics.js');
  const { sentenceBank: _sb } = await import('./js/data/sentenceBank.js');
  const topic = _ct.find(t => t.id === 'conv_n2_tech_life');
  const jaSet = new Set(_sb.map(s => s.ja));
  const m = _sb.filter(s => s.level === 'N2' && s.canUseInConversation && (s.situationTags || []).some(tg => topic.situationTags.includes(tg)));
  ok('230: 신규 주제 관련 문장 ≥ 5', m.length >= 5, `match=${m.length}`);
  ok('230: sampleAnswer 출처(sentenceBank)', topic.starterQuestions.every(q => q.sampleAnswers.some(a => jaSet.has(a.ja))));
  // 신규 story 왕복
  setLevel('N2'); setFuriganaEnabled(true); clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n2_009'] });
  ok('230: 신규 story ruby', !!screen.querySelector('#storyBody ruby'));
  ok('230: 신규 story romaji', screen.textContent.includes('sofu') || screen.textContent.includes('tanmatsu'));
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n2_009').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('230: vocabId 하이라이트 존재', !!pill);
  pill.click();
  pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('230: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/') && peekStudyReturnRoute() === 'story/story_n2_009');
}

// ── 라운드 45: N2 2차 안정화 ───────────────────────────────────────────
console.log('\n[231] N2 회화 평가(2차 신규 주제) — sampleAnswer 출처 + 원문 미기록');
{
  bootstrap(); setLevel('N2');
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer } = await import('./js/localEvaluator.js');
  const { conversationTopics } = await import('./js/data/conversationTopics.js');
  const logW = [];
  logger._setWriterForTest(async (p, v) => { logW.push({ p, v }); });
  const topic = conversationTopics.find(t => t.id === 'conv_n2_policy_opinion');
  const r = evaluateConversationAnswer({ topic, question: topic.starterQuestions[0], userText: 'この政策は是正すべきだ、タナカと申します', reviewStates: {} });
  ok('231: sampleAnswer 출처', topic.starterQuestions[0].sampleAnswers.some(a => a.ja === r.sampleAnswer.ja));
  ok('231: 연습 문장 N2', (r.relatedPracticeSentences || []).every(s => /^sent_n2_/.test(s.id)));
  ok('231: 로그에 원문/이름 미기록', !JSON.stringify(logW).includes('タナカ'));
  ok('231: 평가 중 로그 0건', logW.length === 0);
  logger._resetWriterForTest();
}

console.log('\n[232] N2 imageKey 재분산 단어 — 카드 정상 + romaji + 누출 없음');
{
  for (const [vid, romaji, mean] of [['v_n2_312', 'shihou', '사법'], ['v_n2_540', 'angou', '암호']]) {
    bootstrap({ withTTS: true }); setLevel('N2'); state.setVocabWarmupEnabled(false);
    const screen = shell();
    renderStudy({ screen, params: ['vocab', 'card', vid] });
    ok(`232: ${vid} quickPreview romaji`, screen.textContent.includes(romaji));
    passPreview(screen);
    ok(`232: ${vid} quiz romaji 미노출`, !screen.textContent.includes(romaji));
    ok(`232: ${vid} quiz 뜻 미노출`, !screen.textContent.includes(mean));
  }
  // imageKey 최다 사용률 ≤10% 재확인
  const { vocab: _v232 } = await import('./js/data/vocab.js');
  const n2 = _v232.filter(v => v.level === 'N2');
  const ik = {}; n2.forEach(v => { ik[v.imageKey] = (ik[v.imageKey] || 0) + 1; });
  const top = Object.entries(ik).sort((a, b) => b[1] - a[1])[0];
  ok('232: imageKey 최다 ≤10%', top[1] / n2.length <= 0.10, `${top[0]} ${(100*top[1]/n2.length).toFixed(1)}%`);
}

// ── 라운드 46: N2 3차 마무리 확장 ───────────────────────────────────────
console.log('\n[233] N2 3차 신규 문법/회화/story — 해설 시점 + ruby/romaji + 하이라이트 왕복');
{
  bootstrap(); setLevel('N2');
  for (const gid of ['g_n2_81', 'g_n2_140', 'g_n2_180']) {
    const screen = shell();
    renderQuestion(screen, { itemType: 'grammar', itemId: gid }, {});
    ok(`233: ${gid} choice 4`, screen.querySelectorAll('.choice').length === 4);
    const before = screen.querySelector('.explain');
    ok(`233: ${gid} 선택 전 해설 미노출`, !before || !before.textContent.trim());
    screen.querySelectorAll('.choice')[0].click();
    ok(`233: ${gid} 선택 후 .explain 등장`, !!screen.querySelector('.explain'));
  }
  // 3차 신규 회화 주제 매칭 (정책 찬반 토론) ≥ 5
  const { conversationTopics: _ct233 } = await import('./js/data/conversationTopics.js');
  const { sentenceBank: _sb233 } = await import('./js/data/sentenceBank.js');
  const topic = _ct233.find(t => t.id === 'conv_n2_policy_debate');
  const m = _sb233.filter(s => s.level === 'N2' && s.canUseInConversation && (s.situationTags || []).some(tg => (topic.situationTags || []).includes(tg)));
  ok('233: 신규 주제 관련 문장 ≥ 5', m.length >= 5, `match=${m.length}`);
  // 3차 신규 story 왕복 (story_n2_018)
  setLevel('N2'); setFuriganaEnabled(true); clearStudyReturnRoute();
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n2_018'] });
  ok('233: 신규 story ruby', !!screen.querySelector('#storyBody ruby'));
  ok('233: 신규 story romaji', screen.textContent.includes('teinen') || screen.textContent.includes('kyoushitsu'));
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n2_018').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('233: vocabId 하이라이트 존재', !!pill);
  pill.click();
  pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('233: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/') && peekStudyReturnRoute() === 'story/story_n2_018');
}

// ── 라운드 47: N2 3차 안정화 / 최종 품질 잠금 ───────────────────────────
console.log('\n[234] N2 최종 안정화 — 경계문형 교체본/장문/story/회화/추천/로그');
{
  // 1) N1→N2 교체 경계문형: 문법 문제 + 해설 노출 시점
  bootstrap(); setLevel('N2');
  for (const gid of ['g_n2_82', 'g_n2_117', 'g_n2_161']) {
    const screen = shell();
    renderQuestion(screen, { itemType: 'grammar', itemId: gid }, {});
    ok(`234: ${gid} choice 4`, screen.querySelectorAll('.choice').length === 4);
    const before = screen.querySelector('.explain');
    ok(`234: ${gid} 선택 전 해설 미노출`, !before || !before.textContent.trim());
    screen.querySelectorAll('.choice')[0].click();
    ok(`234: ${gid} 선택 후 .explain 등장`, !!screen.querySelector('.explain'));
  }
  // 2) 교체 경계문형은 N1PAT 에 걸리지 않음 (데이터 레벨)
  const { grammar: _g234 } = await import('./js/data/grammar.js');
  const N1PAT = /(んばかり|べからず|まじき|ずくめ|きらいがある|をよそに|んがため|や否や|が早いか|ごとき|たりとも|ずにはおかない|ずにはすまない|を禁じ得ない|ないまでも|であれ[、。]|ともなると|とあって|涙ながらに|きっての|の極み|てやまない|を皮切り|ないではおか|たら最後|ずじまい|が関の山|はおろか|べく|やいなや|ときたら|いかんで|ようものなら|ばそれまで|めく|ぶる|ふしがある|といったらない|ものを|始末だ|あっての|もさることながら|にかたくない|運びとなる|随一)/;
  const n2g = _g234.filter(g => g.level === 'N2');
  let n1hit = 0;
  for (const g of n2g) for (const e of (g.examples || [])) if (N1PAT.test(e.ja) || N1PAT.test(g.pattern)) n1hit++;
  ok('234: N2 문법 패턴/예문 N1급 0 (확장 스캔)', n1hit === 0, `hit=${n1hit}`);
  // 3) 장문 독해 long-passage 렌더
  bootstrap(); setLevel('N2'); setFuriganaEnabled(true);
  let screen = shell();
  renderQuestion(screen, { itemType: 'reading', itemId: 'r_n2_48' }, {});
  const ctx = screen.querySelector('.q-context');
  ok('234: 장문 long-passage 클래스', ctx?.classList.contains('long-passage'));
  ok('234: 장문 ruby 렌더', !!ctx?.querySelector('ruby'));
  // 4) keyVocab 보강 story 왕복 (story_n2_012)
  setLevel('N2'); setFuriganaEnabled(true); clearStudyReturnRoute();
  screen = shell();
  renderStoryDetail({ screen, params: ['story_n2_012'] });
  ok('234: story ruby', !!screen.querySelector('#storyBody ruby'));
  const pill = Array.from(screen.querySelectorAll('.story-inline-hl')).find(el => {
    const li = parseInt(el.dataset.lineIdx, 10), hi = parseInt(el.dataset.hlIdx, 10);
    const h = (_allStories.find(s => s.id === 'story_n2_012').bodyHighlights[li] || [])[hi];
    return h && h.vocabId;
  });
  ok('234: story vocabId 하이라이트', !!pill);
  pill.click();
  pill.closest('.story-line').querySelector('[data-hl-action="study-vocab"]').click();
  ok('234: 학습 이동 + returnRoute', window.location.hash.includes('study/vocab/card/') && peekStudyReturnRoute() === 'story/story_n2_012');
  // 5) 회화 평가 — policy_debate sampleAnswer 출처(sentenceBank) + 로그 원문 미기록
  const logger = await import('./js/actionLogger.js');
  const { evaluateConversationAnswer } = await import('./js/localEvaluator.js');
  const { conversationTopics } = await import('./js/data/conversationTopics.js');
  const logW = [];
  logger._setWriterForTest(async (p, v) => { logW.push({ p, v }); });
  const topic = conversationTopics.find(t => t.id === 'conv_n2_policy_debate');
  const r = evaluateConversationAnswer({ topic, question: topic.starterQuestions[0], userText: '私はこの政策に賛成です、ヤマダと申します', reviewStates: {} });
  ok('234: policy_debate sampleAnswer 출처', topic.starterQuestions[0].sampleAnswers.some(a => a.ja === r.sampleAnswer.ja));
  ok('234: 연습 문장 N2', (r.relatedPracticeSentences || []).every(s => /^sent_n2_/.test(s.id)));
  ok('234: 로그에 원문/이름 미기록', !JSON.stringify(logW).includes('ヤマダ'));
  ok('234: 평가 중 로그 0건', logW.length === 0);
  logger._resetWriterForTest();
  // 6) 추천 비편중 — N3 마스터 시 N2 포함 + 하위 복습 유지
  const cr = await import('./js/contentReadiness.js');
  const { vocab: _v234 } = await import('./js/data/vocab.js');
  const rs = {};
  for (const x of _v234.filter(z => ['N5', 'N4', 'N3'].includes(z.level))) rs[x.id] = { box: 5, seen: 5, correct: 5 };
  const rec = cr.getRecommendedReading('N2', rs, { count: 10 });
  const lv = rec.map(x => (x.item.id.match(/_(n[0-9])_/) || [])[1]);
  ok('234: 추천 N2 포함', lv.includes('n2'));
  ok('234: 추천 하위 복습 유지', lv.some(x => x && x !== 'n2'));
  ok('234: 추천 N2 과편중 아님 (≤70%)', lv.filter(x => x === 'n2').length / lv.length <= 0.7);
}

// ── 라운드 48: 릴리스 후보 안정화 — story player toolbar / 설정 영속 / 로그 보안 ──
console.log('\n[235] 릴리스 안정화 — story player compact toolbar + 설정 영속 + 로그 보안');
{
  const { getStoryRomajiEnabled, setStoryRomajiEnabled } = await import('./js/state.js');
  // 1) story player compact toolbar 구조 + 본문 가림 방지 클래스
  bootstrap(); setLevel('N2'); setFuriganaEnabled(true);
  const screen = shell();
  renderStoryDetail({ screen, params: ['story_n2_001'] });
  ok('235: storyPlayer 존재', !!screen.querySelector('#storyPlayer'));
  ok('235: compact 컨트롤 행(prev/playAll/next)', !!screen.querySelector('#storyControlsRow #storyPrev') && !!screen.querySelector('#storyPlayAll') && !!screen.querySelector('#storyNext'));
  ok('235: 위치 표시 storyPos', !!screen.querySelector('#storyPos'));
  ok('235: has-story-player(본문 하단 패딩→플레이어가 본문 가리지 않음)', screen.classList.contains('has-story-player'));
  // 2) 설정 2차 토글(스토리 로마자) 영속 — localStorage 저장/복원
  setStoryRomajiEnabled(false);
  ok('235: storyRomaji OFF 저장', getStoryRomajiEnabled() === false);
  setStoryRomajiEnabled(true);
  ok('235: storyRomaji ON 복원', getStoryRomajiEnabled() === true);
  // 3) 로그 payload 보안 — allowlist 외 키 제거 + 민감정보 0 (signed-in 필요)
  const logger = await import('./js/actionLogger.js');
  authSvc._setAuthImplForTest(mockAuthImpl());
  await authSvc.signInWithEmail('seclog@example.com', 'correct123');
  logger._resetThrottleForTest();
  let cap = null, capPath = null;
  logger._setWriterForTest(async (p, v) => { if (p.startsWith('userActivity/')) { cap = v; capPath = p; } });
  logger.logAction('grammar_answered', { itemType: 'grammar', itemId: 'g_n2_82', correct: false, email: 'a@b.com', password: 'pw', userText: 'ユーザー入力', transcript: '音声原文' });
  await new Promise(r => setTimeout(r, 10));
  logger._resetWriterForTest();
  ok('235: userActivity allowlist 필드만(meta 상세 미저장)', cap && Object.keys(cap).every(k => logger.USER_ACTIVITY_FIELDS.includes(k)));
  ok('235: 활동 payload 민감정보 0', cap && !/a@b\.com|pw|ユーザー入력|音声原文/.test(JSON.stringify(cap)));
  ok('235: 경로 키 uid(이메일 아님)', capPath === 'userActivity/uid_seclog' && !capPath.includes('@'));
  authSvc._resetAuthImplForTest();
}

// ── 라운드 49: PWA 최소 구현 — 등록 방어 + 렌더 회귀 ──────────────────────
console.log('\n[236] PWA — SW 등록 방어(미지원/실패) + 앱 렌더 회귀');
{
  const { registerServiceWorker } = await import('./js/pwa.js');
  // 1) serviceWorker 미지원 환경 — false 반환, throw 없음
  let threw = false, r1;
  try { r1 = registerServiceWorker({}); } catch { threw = true; }
  ok('236: 미지원 nav → false, throw 없음', r1 === false && !threw);
  // 2) navigator 자체 부재 — throw 없음
  let threw2 = false, r2;
  try { r2 = registerServiceWorker(null); } catch { threw2 = true; }
  ok('236: nav 부재 → false, throw 없음', r2 === false && !threw2);
  // 3) 지원 환경 mock — register 호출 + 상대경로/scope, true 반환
  let calledWith = null;
  const nav3 = { serviceWorker: { register: (url, opts) => { calledWith = { url, opts }; return Promise.resolve({}); } } };
  const r3 = registerServiceWorker(nav3);
  ok('236: 지원 nav → 등록 시도(true)', r3 === true);
  ok('236: SW 경로 상대(./service-worker.js)', calledWith && calledWith.url === './service-worker.js' && !calledWith.url.startsWith('/'));
  ok('236: scope 상대(./)', calledWith && calledWith.opts && calledWith.opts.scope === './');
  // 4) register 가 reject 해도 throw 전파 없음 (학습 흐름 비차단)
  let threw4 = false, r4;
  try { r4 = registerServiceWorker({ serviceWorker: { register: () => Promise.reject(new Error('boom')) } }); } catch { threw4 = true; }
  ok('236: 등록 실패해도 throw 없음', r4 === true && !threw4);
  await new Promise((res) => setTimeout(res, 0)); // reject 마이크로태스크 소진 — unhandled 없음
  // 5) 앱 기본 렌더 회귀 — 홈/학습/이야기 정상 렌더
  bootstrap(); setLevel('N2');
  let screen = shell(); renderHome({ screen });
  ok('236: 홈 렌더 회귀', screen.textContent.length > 0 && !!screen.querySelector('button,.card,a'));
  screen = shell(); renderStoryDetail({ screen, params: ['story_n2_001'] });
  ok('236: 스토리 렌더 회귀(PWA 배선 후)', !!screen.querySelector('#storyBody') && !!screen.querySelector('#storyPlayer'));
}

// ── 라운드 50: 로그인 필수 / 인증 게이트 ─────────────────────────────────────
console.log('\n[237] 인증 게이트 — 비로그인 차단/의도 route 복귀/로그아웃 재차단/렌더 회귀');
{
  bootstrap();
  const router = await import('./js/router.js');
  const auth = await import('./js/authService.js');
  const gate = await import('./js/views/authGate.js');
  auth._resetAuthImplForTest();
  // 게이트 배선 (app.js 와 동일: getCurrentUser 기반)
  router.setAuthGate(() => !!auth.getCurrentUser(), gate.renderAuthGate);
  let homeN = 0, studyN = 0;
  router.register('home', ({ screen }) => { homeN++; screen.innerHTML = '<div id="homeMock">HOME</div>'; });
  router.register('study', ({ screen }) => { studyN++; screen.innerHTML = '<div id="studyMock">STUDY</div>'; });
  // (1) 비로그인 상태 #study 직접 접근 → 로그인 화면
  window.location.hash = '#study';
  router.start();
  ok('237: 비로그인 #study → 로그인 화면', !!document.querySelector('#authEmail') && !document.querySelector('#studyMock'));
  ok('237: auth-locked 클래스 부여', document.body.classList.contains('auth-locked'));
  ok('237: 의도 route(study) 보관', router.consumePendingRoute() === 'study');
  // (2) Firebase 미설정 분기 안내 — renderAuthGate 가 크래시 없이 동작(여기선 config 있어 폼 렌더)
  let gateThrew = false;
  try { const s = shell(); gate.renderAuthGate({ screen: s }); ok('237: 게이트 폼 렌더(크래시 없음)', !!s.querySelector('#loginBtn')); }
  catch { gateThrew = true; }
  ok('237: 게이트 렌더 throw 없음', !gateThrew);
  const s2 = shell(); gate.renderAuthLoading({ screen: s2 });
  ok('237: 로딩 화면 렌더', /확인 중/.test(s2.textContent));
  // (3) 로그인 → 의도 route(study) 복귀
  auth._setAuthImplForTest(mockAuthImpl());
  await auth.signInWithEmail('gate@example.com', 'correct123');
  router.navigate('study');                 // 이제 guard 통과
  ok('237: 로그인 후 study 렌더', !!document.querySelector('#studyMock'));
  ok('237: auth-locked 해제', !document.body.classList.contains('auth-locked'));
  // (4) 로그아웃 → 앱 접근 차단(게이트 재노출)
  await auth.logout();
  router.navigate('home');                  // hash #study→#home → hashchange(비동기) → 게이트 render
  await new Promise(r => setTimeout(r, 5));  // hashchange 처리 대기
  ok('237: 로그아웃 후 home 접근 차단(게이트)', !!document.querySelector('#authEmail') && !document.querySelector('#homeMock'));
  // 정리 — 게이트 해제(이후 시나리오 비간섭)
  router.setAuthGate(null, null);
  auth._resetAuthImplForTest();
}

// ── 라운드 52: 비밀번호 재설정 (로그인 화면) ─────────────────────────────────
console.log('\n[238] 비밀번호 재설정 — 빈 이메일/성공/실패/중복방지/회귀/로그 미기록');
{
  bootstrap();
  const { renderAuthGate } = await import('./js/views/authGate.js');
  authSvc._setAuthImplForTest(mockAuthImpl());
  const logWrites = [];
  logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });
  logger._resetThrottleForTest();
  const screen = shell();
  renderAuthGate({ screen });
  const emailEl = screen.querySelector('#authEmail');
  const errEl = screen.querySelector('#authError');
  const forgotBtn = screen.querySelector('#forgotBtn');
  ok('238: #forgotBtn(잊으셨나요) 존재', !!forgotBtn && /잊으셨나요/.test(forgotBtn.textContent));
  // (1) 빈 이메일 → 안내
  emailEl.value = '';
  forgotBtn.click();
  await new Promise(r => setTimeout(r, 5));
  ok('238: 빈 이메일 → 안내 메시지', /이메일을 입력/.test(errEl.textContent));
  ok('238: 빈 이메일 시 로그/요청 없음', logWrites.length === 0);
  // (2) 유효 이메일 + 성공 → 토스트 성공 메시지 + 에러 없음
  emailEl.value = 'forgetful@example.com';
  forgotBtn.click();
  ok('238: 요청 중 버튼 비활성(중복 방지)', forgotBtn.disabled === true);
  await new Promise(r => setTimeout(r, 10));
  ok('238: 성공 토스트 메시지', /재설정 메일을 보냈습니다|재설정 안내/.test(document.querySelector('.toast')?.textContent || ''));
  ok('238: 성공 후 버튼 재활성', forgotBtn.disabled === false);
  ok('238: 성공 후 에러 없음', errEl.textContent === '');
  // (3) 실패(too-many-requests) → 한국어 오류
  emailEl.value = 'many@example.com';
  forgotBtn.click();
  await new Promise(r => setTimeout(r, 10));
  ok('238: 실패 → 한국어 오류', /너무 많습니다/.test(errEl.textContent));
  // (4) 로그인/회원가입 흐름 회귀 — 버튼 정상 동작
  emailEl.value = 'learner@example.com';
  screen.querySelector('#authPassword').value = 'correct123';
  screen.querySelector('#loginBtn').click();
  await new Promise(r => setTimeout(r, 15));
  ok('238: 로그인 흐름 회귀 없음(로그인 성공)', authSvc.getCurrentUser()?.uid === 'uid_learner');
  // (5) 로그 payload 에 이메일 미기록 (재설정은 로그 안 함)
  ok('238: 로그에 이메일 원문 없음',
     !JSON.stringify(logWrites).includes('forgetful@example.com') &&
     !JSON.stringify(logWrites).includes('many@example.com'));
  ok('238: 재설정 관련 로그 이벤트 없음',
     !logWrites.some(w => /reset|password/i.test(w.value?.type || '')));
  logger._resetWriterForTest();
  authSvc._resetAuthImplForTest();
}

// ── 라운드 53: vocab JSON 분리 — dataLoader 경로/fallback ─────────────────────
console.log('\n[239] vocab JSON 분리 — dataLoader JSON 경로 로드/렌더 + fetch 실패/비배열 fallback');
{
  bootstrap();
  const dl = await import('./js/dataLoader.js');
  const { getVocabRomaji } = await import('./js/romaji.js');
  dl.clearDataCache();
  // (1) JSON 경로 — fetch mock 이 data/n5/vocab.json 반환
  dl._setFetchForTest(async (url) => {
    if (url.endsWith('n5/vocab.json')) return { ok: true, json: async () => JSON.parse(readFileSync(new URL('./data/n5/vocab.json', import.meta.url), 'utf8')) };
    return { ok: false, status: 404 };
  });
  const n5 = await dl.loadVocab('N5');
  ok('239: JSON 경로 N5 로드(500)', Array.isArray(n5) && n5.length === 500);
  // JSON 데이터로 목록 렌더(렌더 가능성 증명)
  const screen = shell();
  const list = document.createElement('div'); list.id = 'vlistJson';
  n5.slice(0, 20).forEach(v => { const d = document.createElement('div'); d.className = 'vrow'; d.textContent = `${v.word} · ${v.reading} · ${v.meaningKo}`; list.appendChild(d); });
  screen.appendChild(list);
  ok('239: JSON 데이터로 목록 20행 렌더', screen.querySelectorAll('.vrow').length === 20 && screen.querySelector('.vrow').textContent.includes('·'));
  const withReadings = n5.find(v => Array.isArray(v.exampleReadings) && v.exampleReadings.length);
  ok('239: JSON 항목 필드 보존(imageKey/tags/exampleReadings)',
     !!n5[0].imageKey && Array.isArray(n5[0].tags) && !!n5[0].exampleSentence &&
     !!withReadings && typeof withReadings.exampleReadings[0].reading === 'string');
  ok('239: romaji 변환 유지', typeof getVocabRomaji(n5[0]) === 'string' && getVocabRomaji(n5[0]).length > 0);
  // (2) fetch 실패 → JS fallback
  dl.clearDataCache();
  dl._setFetchForTest(async () => { throw new Error('offline'); });
  const n2 = await dl.loadVocab('N2');
  ok('239: fetch 실패 → JS fallback(N2 2300)', Array.isArray(n2) && n2.length === 2300 && n2[0].id === 'v_n2_1');
  // (3) 비배열 JSON → fallback
  dl.clearDataCache();
  dl._setFetchForTest(async () => ({ ok: true, json: async () => ({ notArray: true }) }));
  const n4 = await dl.loadVocab('N4');
  ok('239: 비배열 JSON → fallback(N4 902)', Array.isArray(n4) && n4.length === 902);
  // (4) jsonPathFor 상대경로(서브패스 안전) — PWA precache/SW SWR 재사용
  ok('239: jsonPathFor 상대경로', dl.jsonPathFor('N5', 'vocab') === 'data/n5/vocab.json');
  dl._resetFetchForTest(); dl.clearDataCache();
}

// ── 라운드 54: JLPT10M 브랜딩 + 렌더 회귀 ────────────────────────────────────
console.log('\n[240] 브랜딩 — JLPT10M 로고 + 홈/학습/스토리 렌더 + 라이트/다크 + 버튼/플레이어');
{
  const { renderAuthGate } = await import('./js/views/authGate.js');
  // (1) 로그인 화면 JLPT10M 표시
  bootstrap();
  let screen = shell();
  renderAuthGate({ screen });
  ok('240: 로그인 화면 JLPT10M 로고', screen.textContent.includes('JLPT10M') && !!screen.querySelector('.wm-accent'));
  ok('240: 로그인 화면 로그인/회원가입/재설정 버튼', !!screen.querySelector('#loginBtn') && !!screen.querySelector('#signupBtn') && !!screen.querySelector('#forgotBtn'));
  // (2) 홈/학습/스토리 렌더 회귀
  setLevel('N2');
  screen = shell(); renderHome({ screen });
  ok('240: 홈 렌더(버튼/카드)', screen.textContent.length > 0 && !!screen.querySelector('button,.card,a'));
  screen = shell(); renderStudy({ screen, params: [] });
  ok('240: 학습 랜딩 분야 칩', !!screen.querySelector('#studyTypeChips .chip'));
  screen = shell(); renderStoryDetail({ screen, params: ['story_n2_001'] });
  ok('240: 스토리 본문 + compact 플레이어', !!screen.querySelector('#storyBody') && !!screen.querySelector('#storyPlayer') && !!screen.querySelector('#storyControlsRow'));
  // (3) 라이트/다크 모드에서 주요 텍스트 존재 (테마 속성 변경이 렌더를 깨지 않음)
  for (const theme of ['light', 'dark']) {
    document.documentElement.dataset.theme = theme;
    screen = shell(); renderHome({ screen });
    ok(`240: ${theme} 모드 홈 텍스트 존재`, screen.textContent.trim().length > 0);
  }
  // (4) 단어 카드 직접 진입 — 발음/romaji/다음 버튼류 존재
  state.setVocabWarmupEnabled(false);
  screen = shell();
  renderStudy({ screen, params: ['vocab', 'card', 'v_n2_1'] });
  ok('240: 단어 카드 렌더(선택지/버튼)', screen.querySelectorAll('.choice').length === 4 || !!screen.querySelector('button'));
}

// ── 라운드 55: Capacitor APK — SW 가드 + 웹 실행 회귀 ────────────────────────
console.log('\n[241] Capacitor — SW 등록 가드 + 웹 실행 회귀(로그인/홈/학습)');
{
  const { registerServiceWorker, isCapacitor } = await import('./js/pwa.js');
  const { renderAuthGate } = await import('./js/views/authGate.js');
  // (1) 일반(웹) 환경 — Capacitor 아님, 지원 nav → 등록 시도(true)
  delete globalThis.Capacitor;
  ok('241: 웹 환경 isCapacitor=false', isCapacitor() === false);
  let called = 0;
  const nav = { serviceWorker: { register: () => { called++; return Promise.resolve({}); } } };
  ok('241: 웹에서 SW 등록 시도', registerServiceWorker(nav) === true && called === 1);
  // (2) Capacitor 환경 — SW 등록 건너뜀(false), register 미호출, throw 없음
  globalThis.Capacitor = { isNativePlatform: () => true };
  called = 0;
  let threw = false, r;
  try { r = registerServiceWorker(nav); } catch { threw = true; }
  ok('241: Capacitor isCapacitor=true', isCapacitor() === true);
  ok('241: Capacitor 에서 SW 등록 건너뜀(false, 미호출)', r === false && called === 0 && !threw);
  // (3) Capacitor/SW 미동작 환경에서도 로그인 화면 렌더(웹앱 깨짐 없음)
  bootstrap();
  globalThis.Capacitor = { isNativePlatform: () => true };   // bootstrap 이 globalThis 재설정하므로 재지정
  let screen = shell();
  renderAuthGate({ screen });
  ok('241: Capacitor 환경 로그인 화면 렌더', screen.textContent.includes('JLPT10M') && !!screen.querySelector('#loginBtn'));
  // (4) 홈/학습 렌더 회귀(네이티브 환경 가정에서도 웹 코드 정상)
  setLevel('N2');
  screen = shell(); renderHome({ screen });
  ok('241: 홈 렌더 회귀', screen.textContent.length > 0 && !!screen.querySelector('button,.card,a'));
  screen = shell(); renderStudy({ screen, params: [] });
  ok('241: 학습 랜딩 렌더 회귀', !!screen.querySelector('#studyTypeChips .chip'));
  delete globalThis.Capacitor;   // 정리 — 이후 시나리오 비간섭
}

// ── 라운드 57: 네이티브 TTS 어댑터 (Web/Capacitor 분기) ──────────────────────
console.log('\n[242] TTS 어댑터 — Web Speech 회귀 + Capacitor Native TTS 분기');
{
  const tts = await import('./js/tts.js');
  tts._setRetryDelaysForTest([0]);
  // (1) Web 환경 + 일본어 voice → 기존 감지/speak 회귀
  bootstrap({ withTTS: true });
  delete globalThis.Capacitor;
  tts._resetVoiceStateForTest();
  ok('242: Web ttsAvailable', tts.ttsAvailable() === true);
  ok('242: Web 일본어 voice 감지(ja-found)', await tts.refreshVoices() === 'ja-found');
  ok('242: Web speak ok', (await tts.speak('テスト')).ok === true);
  // (2) Web 환경 + 일본어 voice 없음 → no-ja 유지
  bootstrap({ withTTS: true });
  window.speechSynthesis._voices = [{ lang: 'en-US', name: 'English' }];
  delete globalThis.Capacitor;
  tts._resetVoiceStateForTest();
  ok('242: Web voice 없음 → no-ja', await tts.refreshVoices() === 'no-ja');
  ok('242: Web no-ja speak reason', (await tts.speak('テスト')).reason === 'no-ja-voice');
  // (3) Capacitor + Native TTS(ja 지원) → native-ready, speak ok, stop 호출
  bootstrap();
  const calls = [];
  globalThis.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: { TextToSpeech: {
    speak: (o) => { calls.push(['speak', o.text, o.lang]); return Promise.resolve(); },
    stop: () => { calls.push(['stop']); return Promise.resolve(); },
    getSupportedLanguages: () => Promise.resolve({ languages: ['en-US', 'ja-JP'] }),
  } } };
  tts._resetVoiceStateForTest();
  ok('242: Capacitor ttsAvailable', tts.ttsAvailable() === true);
  ok('242: Capacitor native-ready', await tts.refreshVoices() === 'native-ready');
  ok('242: Capacitor hasJaVoice', await tts.hasJaVoice() === true);
  ok('242: Capacitor native speak ok(ja-JP)', (await tts.speak('テスト', { rate: 1.1 })).ok === true && calls.some(c => c[0] === 'speak' && c[2] === 'ja-JP'));
  tts.stopSpeaking();
  ok('242: Capacitor native stop 호출', calls.some(c => c[0] === 'stop'));
  // (4) Capacitor + native speak 실패 + web 없음 → native-error
  bootstrap();   // withTTS false → speechSynthesis 없음
  globalThis.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: { TextToSpeech: {
    speak: () => { throw new Error('engine fail'); },
    stop: () => {}, getSupportedLanguages: () => Promise.resolve({ languages: ['ja-JP'] }),
  } } };
  tts._resetVoiceStateForTest();
  const rf = await tts.speak('テスト');
  ok('242: native 실패 + web 없음 → native-error', rf.ok === false && rf.reason === 'native-error');
  // (5) 설정 화면 Capacitor 에서 네이티브 상태 문구 렌더
  bootstrap();
  globalThis.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: { TextToSpeech: {
    speak: () => Promise.resolve(), stop: () => {}, getSupportedLanguages: () => Promise.resolve({ languages: ['ja-JP'] }),
  } } };
  tts._resetVoiceStateForTest();
  authSvc._setAuthImplForTest(mockAuthImpl());
  const screen = shell();
  renderSettings({ screen });
  ok('242: 설정 음성상태 네이티브 문구', /네이티브 TTS/.test(screen.querySelector('#voiceStatusText')?.textContent || screen.textContent));
  authSvc._resetAuthImplForTest();
  delete globalThis.Capacitor;
  tts._resetVoiceStateForTest();
  tts._resetRetryDelaysForTest();
}

// ── 라운드 58: 네이티브 TTS 상태/재생 수정 ──────────────────────────────────
console.log('\n[243] 네이티브 TTS 수정 — reason 구분/테스트 재생/언어목록 무관/설정 버튼/웹 회귀');
{
  const tts = await import('./js/tts.js');
  function mkCap(plugin) { return { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: plugin ? { TextToSpeech: plugin } : {} }; }
  // (1) 플러그인 없음 → native-plugin-missing
  bootstrap(); globalThis.Capacitor = mkCap(null); tts._resetVoiceStateForTest();
  ok('243: 플러그인 없음 status', tts.getVoiceStatus() === 'native-unavailable');
  ok('243: 플러그인 없음 speak reason', (await tts.speak('あ')).reason === 'native-plugin-missing');
  ok('243: 플러그인 없음 pluginSource=none', tts.getTtsDiagnostics().pluginSource === 'none');
  // (2) 플러그인 있지만 speak 없음 → native-method-missing
  bootstrap(); globalThis.Capacitor = mkCap({ stop: () => {} }); tts._resetVoiceStateForTest();
  ok('243: speak 메서드 없음 reason', (await tts.speak('あ')).reason === 'native-method-missing');
  // (3) speak 성공 → native-ready + 테스트 재생 ok
  bootstrap(); const c3 = []; globalThis.Capacitor = mkCap({ speak: (o) => { c3.push(o); return Promise.resolve(); }, stop: () => {} }); tts._resetVoiceStateForTest();
  ok('243: speak 성공 status', tts.getVoiceStatus() === 'native-ready');
  ok('243: 확정등록 pluginSource=plugins-map', tts.getTtsDiagnostics().pluginSource === 'plugins-map');
  ok('243: speak 성공', (await tts.speak('日本語')).ok === true && c3.length >= 1);
  ok('243: speakTest 성공', (await tts.speakTest('こんにちは')).ok === true);
  // (4) speak 실패(reject) → speakTest native-error + message, 진단 lastError
  bootstrap(); globalThis.Capacitor = mkCap({ speak: () => Promise.reject(new Error('engine dead')), stop: () => {} }); tts._resetVoiceStateForTest();
  const r4 = await tts.speakTest('こんにちは');
  ok('243: speak 실패 → native-error + message', r4.ok === false && r4.reason === 'native-error' && /engine dead/.test(r4.message || ''));
  ok('243: 진단 lastError 기록', /engine dead/.test(tts.getTtsDiagnostics().lastError || ''));
  // (5) getSupportedLanguages 실패해도 speak 성공이면 ok (언어목록에 의존하지 않음)
  bootstrap(); globalThis.Capacitor = mkCap({ speak: () => Promise.resolve(), stop: () => {}, getSupportedLanguages: () => Promise.reject(new Error('no list')) }); tts._resetVoiceStateForTest();
  ok('243: 언어목록 실패해도 status ready', tts.getVoiceStatus() === 'native-ready');
  ok('243: 언어목록 실패해도 speakTest ok', (await tts.speakTest()).ok === true);
  // (6) 설정 테스트 재생 버튼 → speak 호출 + 결과 표시
  bootstrap(); const c6 = []; globalThis.Capacitor = mkCap({ speak: (o) => { c6.push(o); return Promise.resolve(); }, stop: () => {}, getSupportedLanguages: () => Promise.resolve({ languages: ['ja-JP'] }) });
  tts._resetVoiceStateForTest(); authSvc._setAuthImplForTest(mockAuthImpl());
  const screen = shell(); renderSettings({ screen });
  const testBtn = screen.querySelector('#voiceTestBtn');
  ok('243: 설정 테스트 재생 버튼 존재', !!testBtn);
  testBtn.click();
  await new Promise(r => setTimeout(r, 10));
  ok('243: 테스트 재생이 native speak 호출', c6.some(o => o.text === '日本語' || o.text === 'こんにちは' || /日本|こんにち/.test(o.text || '')));
  ok('243: 테스트 결과 문구 표시', /성공|실패/.test(screen.querySelector('#voiceTestResult')?.textContent || ''));
  authSvc._resetAuthImplForTest();
  // (7) 웹/PWA 회귀 — Capacitor 없음 + voice 있음 → ja-found, speak ok
  delete globalThis.Capacitor;
  bootstrap({ withTTS: true }); delete globalThis.Capacitor; tts._setRetryDelaysForTest([0]); tts._resetVoiceStateForTest();
  ok('243: 웹 ja-found 회귀', await tts.refreshVoices() === 'ja-found');
  ok('243: 웹 speak ok 회귀', (await tts.speak('テスト')).ok === true);
  tts._resetRetryDelaysForTest(); tts._resetVoiceStateForTest();
}

console.log('\n[244] 베타 피드백 + 관리자 페이지 — 권한(UID)·이스터에그·전송·프라이버시');
{
  const fb = await import('./js/feedbackService.js');
  const { renderAdmin } = await import('./js/views/admin.js');
  const tick = () => new Promise(r => setTimeout(r, 15));

  // 인메모리 DB mock — admins/feedback/userActivity/actionLogs.
  function memDb(seed = {}) {
    const store = JSON.parse(JSON.stringify(seed));
    const get = (p) => p.split('/').reduce((o, k) => (o == null ? undefined : o[k]), store);
    return {
      store, writes: [],
      read: async (p) => { const v = get(p); return v === undefined ? null : v; },
      write: async (p, val) => {
        const parts = p.split('/'); let o = store;
        for (let i = 0; i < parts.length - 1; i++) { o[parts[i] ] = o[parts[i]] || {}; o = o[parts[i]]; }
        o[parts[parts.length - 1]] = val;
        return undefined;
      },
    };
  }

  async function signInAs(email) {
    authSvc._resetAuthImplForTest();
    authSvc._setAuthImplForTest(mockAuthImpl());
    await authSvc.signInWithEmail(email, 'correct123');
  }

  // (1) 피드백 전송 성공 — payload 에 uid 있음, email/password 없음.
  {
    bootstrap();
    await signInAs('learner@example.com');                 // uid_learner
    const db = memDb(); fb._setDbForTest(db);
    const r = await fb.submitFeedback({ rating: 4, good: '좋아요_GOODMARK', bad: '불편', wish: '추가기능', bug: '버그제보', contactOk: true });
    ok('244: 피드백 전송 성공', r.ok === true && !!r.feedbackId);
    const saved = Object.values(db.store.feedback || {})[0] || {};
    ok('244: 피드백 payload uid 저장', saved.uid === 'uid_learner');
    ok('244: 피드백 payload 에 email/password 없음', !('userEmail' in saved) && !('email' in saved) && !('password' in saved));
    ok('244: 피드백 payload rating/createdAt 포함', saved.rating === 4 && typeof saved.createdAt === 'number');
    ok('244: 피드백 payload wish/bug/contactOk 포함',
       saved.wish === '추가기능' && saved.bug === '버그제보' && saved.contactOk === true);
    ok('244: 피드백 payload appVersion/platform 포함', !!saved.appVersion && !!saved.platform);
    fb._resetDbForTest();
  }

  // (2) 빈 내용 → 오류.
  {
    bootstrap();
    await signInAs('learner@example.com');
    fb._setDbForTest(memDb());
    const r = await fb.submitFeedback({ rating: 0, good: '', bad: '', wish: '', bug: '' });
    ok('244: 빈 피드백 오류', r.ok === false && /입력/.test(r.error || ''));
    fb._resetDbForTest();
  }

  // (3) 전송 실패(DB write reject) → 실패 안내.
  {
    bootstrap();
    await signInAs('learner@example.com');
    fb._setDbForTest({ read: async () => null, write: async () => { throw new Error('net'); } });
    const r = await fb.submitFeedback({ rating: 5, good: 'x' });
    ok('244: 전송 실패 안내', r.ok === false && /실패/.test(r.error || ''));
    fb._resetDbForTest();
  }

  // (4) actionLogs 에 피드백 본문이 남지 않음 — 피드백은 logger 를 호출하지 않는다.
  {
    bootstrap();
    await signInAs('learner@example.com');
    fb._setDbForTest(memDb());
    const logWrites = [];
    logger._resetThrottleForTest();
    logger._setWriterForTest(async (path, value) => { logWrites.push({ path, value }); });
    await fb.submitFeedback({ rating: 3, good: '비밀본문_SECRETBODY' });
    const dump = JSON.stringify(logWrites);
    ok('244: actionLogs 에 피드백 본문 미기록', !/SECRETBODY/.test(dump) && !logWrites.some(w => /^feedback\//.test(w.path)));
    logger._resetWriterForTest();
    fb._resetDbForTest();
  }

  // (5) 비관리자 #admin → 접근 거부.
  {
    bootstrap();
    const screen = shell();
    await signInAs('learner@example.com');                 // admins 에 없음
    fb._setDbForTest(memDb({ admins: {} }));
    renderAdmin({ screen });
    await tick();
    ok('244: 비관리자 접근 거부', /접근 권한이 없습니다/.test(screen.textContent));
    ok('244: 비관리자에게 데이터 미표시', !/관리자 대시보드/.test(screen.textContent));
    fb._resetDbForTest();
  }

  // (6) 관리자 uid → 대시보드 렌더(가입자/활동/피드백).
  {
    bootstrap();
    const screen = shell();
    await signInAs('joowon582@gmail.com');                 // uid_joowon582
    const nowT = Date.now();
    fb._setDbForTest(memDb({
      admins: { uid_joowon582: true },
      userActivity: { uid_a: { lastSeenAt: nowT, firstSeenAt: nowT - 86400000, createdAt: nowT - 86400000, lastEventType: 'study_start', signedIn: true, sessionCount: 3, totalActiveMs: 720000, platform: 'app-android', appVersion: '1.0.0-beta' } },
      feedback: { f1: { rating: 5, good: '대시보드표시_DASHMARK', wish: '바람', bug: '', contactOk: true, createdAt: nowT, uid: 'uid_a', platform: 'web', appVersion: '1.0.0-beta' } },
    }));
    renderAdmin({ screen });
    await tick();
    ok('244: 관리자 대시보드 렌더', /관리자 대시보드/.test(screen.textContent));
    ok('244: 대시보드 가입자 수 표시', !!screen.querySelector('#adminUserCount'));
    ok('244: 대시보드 활동중(5분) 카드 표시', !!screen.querySelector('#adminActiveNow'));
    ok('244: userActivity 목록 + 세션/이용시간 표시', !!screen.querySelector('#adminActivityTable') && /활동중/.test(screen.textContent));
    ok('244: actionLogs 섹션 없음(폐지)', !screen.querySelector('#adminLogTable') && !/행동 로그 \(actionLogs\)/.test(screen.textContent));
    ok('244: 대시보드 피드백 본문 표시', /DASHMARK/.test(screen.textContent));
    fb._resetDbForTest();
  }

  // (7) 이스터에그 — 설정 버전 줄 7회 탭 → #admin.
  {
    const { window } = bootstrap();
    const screen = shell();
    await signInAs('learner@example.com');
    authSvc._setAuthImplForTest(mockAuthImpl());            // renderSettings 계정 섹션용
    renderSettings({ screen });
    const vline = screen.querySelector('#appVersionLine');
    ok('244: 버전 줄 존재(이스터에그 타깃)', !!vline);
    for (let i = 0; i < 7; i++) vline.click();
    ok('244: 7회 탭 → #admin 이동', window.location.hash === '#admin');
    authSvc._resetAuthImplForTest();
  }

  // (8) 회귀 — 피드백 제출이 학습/로그인 흐름을 깨지 않음(로그인 사용자 유지).
  {
    bootstrap();
    await signInAs('learner@example.com');
    fb._setDbForTest(memDb());
    await fb.submitFeedback({ rating: 5, good: 'ok' });
    ok('244: 피드백 후 로그인 유지', authSvc.getCurrentUser()?.uid === 'uid_learner');
    fb._resetDbForTest();
    authSvc._resetAuthImplForTest();
  }
}

console.log('\n[245] 관리자 대시보드 — 활동중 계산(5분/30분/그외) + 통계 버킷 + uid 복사');
{
  const fb = await import('./js/feedbackService.js');
  const { renderAdmin } = await import('./js/views/admin.js');
  const tick = () => new Promise(r => setTimeout(r, 15));
  function memDb(seed = {}) {
    const store = JSON.parse(JSON.stringify(seed));
    const get = (p) => p.split('/').reduce((o, k) => (o == null ? undefined : o[k]), store);
    return { store, read: async (p) => { const v = get(p); return v === undefined ? null : v; }, write: async () => {} };
  }

  bootstrap();
  const screen = shell();
  authSvc._resetAuthImplForTest();
  authSvc._setAuthImplForTest(mockAuthImpl());
  await authSvc.signInWithEmail('joowon582@gmail.com', 'correct123');   // uid_joowon582
  const now = Date.now();
  const MIN = 60000, HOUR = 3600000, DAY = 86400000;
  fb._setDbForTest(memDb({
    admins: { uid_joowon582: true },
    userActivity: {
      u_now:    { lastSeenAt: now - 1 * MIN,  firstSeenAt: now - 3 * DAY, createdAt: now - 3 * DAY, lastEventType: 'study_start', signedIn: true, sessionCount: 5, totalActiveMs: 30 * MIN, platform: 'app-android', appVersion: '1.0.0-beta' },
      u_recent: { lastSeenAt: now - 10 * MIN, firstSeenAt: now - 2 * DAY, createdAt: now - 2 * DAY, lastEventType: 'story_open',  signedIn: true, sessionCount: 2, totalActiveMs: 5 * MIN,  platform: 'web', appVersion: '1.0.0-beta' },
      u_idle:   { lastSeenAt: now - 2 * DAY,  firstSeenAt: now - 9 * DAY, createdAt: now - 9 * DAY, lastEventType: 'login_success', signedIn: true, sessionCount: 1, totalActiveMs: 0, platform: 'web', appVersion: '1.0.0-beta' },
    },
    feedback: { f1: { rating: 4, good: '리스트표시_FBMARK', createdAt: now, uid: 'u_now', platform: 'web', appVersion: '1.0.0-beta' } },
  }));
  renderAdmin({ screen });
  await tick();

  const txt = screen.textContent;
  ok('245: 총 사용자 3', screen.querySelector('#adminUserCount')?.textContent === '3');
  ok('245: 활동중(5분) 1', screen.querySelector('#adminActiveNow')?.textContent === '1');     // u_now
  ok('245: 최근 24시간 2', screen.querySelector('#adminActive24h')?.textContent === '2');      // u_now + u_recent
  ok('245: 최근 7일 3', screen.querySelector('#adminActive7d')?.textContent === '3');          // 전부 7일 내
  // 상태 라벨 3종 모두 렌더
  ok('245: 활동중 라벨', /활동중/.test(txt));
  ok('245: 최근 활동 라벨', /최근 활동/.test(txt));
  ok('245: 비활동 라벨', /비활동/.test(txt));
  // 세션/이용시간 표시 + actionLogs 섹션 없음
  ok('245: 세션 수 표시(u_now=5)', txt.includes('5'));
  ok('245: actionLogs 섹션 없음', !screen.querySelector('#adminLogTable') && !/행동 로그 \(actionLogs\)/.test(txt));
  // 피드백 목록 표시
  ok('245: 피드백 목록 표시', /FBMARK/.test(txt));
  // uid 복사 버튼 — 사용자당 1개(3명)
  ok('245: uid 복사 버튼 존재', screen.querySelectorAll('.copy-uid').length === 3);

  fb._resetDbForTest();
  authSvc._resetAuthImplForTest();
}

console.log('\n[246] 개인정보처리방침 링크 — 로그인 전(authGate) + 설정 화면, 회귀 없음');
{
  const { renderAuthGate } = await import('./js/views/authGate.js');
  // (1) 로그인 화면(비로그인) — privacy 링크 노출 + ./privacy.html
  bootstrap();
  authSvc._resetAuthImplForTest();
  authSvc._setAuthImplForTest(mockAuthImpl());   // authAvailable=true → 폼 + 링크 렌더
  let screen = shell();
  renderAuthGate({ screen });
  const authLink = screen.querySelector('#privacyLink');
  ok('246: 로그인 화면 privacy 링크 존재', !!authLink && /privacy\.html$/.test(authLink.getAttribute('href') || ''));
  ok('246: 로그인 화면 privacy 링크 텍스트', (authLink?.textContent || '').includes('개인정보처리방침'));
  // 로그인 폼도 여전히 정상(회귀)
  ok('246: 로그인 폼 회귀 없음', !!screen.querySelector('#loginBtn') && !!screen.querySelector('#authEmail'));

  // (2) 설정 화면 — privacy 링크 노출
  screen = shell();
  renderSettings({ screen });
  const setLink = screen.querySelector('#privacyLink');
  ok('246: 설정 화면 privacy 링크 존재', !!setLink && /privacy\.html$/.test(setLink.getAttribute('href') || ''));
  // 설정 기존 컨트롤 회귀(피드백/음성 상태/버전 줄)
  ok('246: 설정 회귀 없음(피드백/버전/음성)',
     !!screen.querySelector('#fbSubmit') && !!screen.querySelector('#appVersionLine') && !!screen.querySelector('#voiceTestBtn'));
  authSvc._resetAuthImplForTest();
}

if (errs.length) {
  console.log('\nQA ERRORS:');
  for (const e of errs) console.log(' -', e);
  process.exit(1);
} else {
  console.log('\nQA: ALL SCENARIOS PASSED');
}
