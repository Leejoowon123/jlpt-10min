// 학습 탭 — 학습 시작 중심 UI + 보조 목록.
//
// 변경(콘텐츠 확장 대응):
//   - 단어 탭 진입 시 전체 N5 단어를 한꺼번에 늘어놓지 않는다.
//   - 상단: 단어 학습 카드 (총 개수 + 4개 학습 액션) + 모드 칩(이미지/예문)
//   - 그 아래: 검색 input + 태그 chip + 20개 단위 페이지 목록 + 더 보기.
//   - 문법/독해/청해 탭에도 동일 페이지 구조 + 검색 + 항목 수 헤더.
//   - 단어 10개 학습 세션: 필터링 풀 또는 자주 볼 단어 / 오답 단어 풀에서 시작.
//
// 스케일링 — N5 250 → N5 500 → N4/N3/N2 확장까지 안전한 구조:
//   - filteredItems()    : O(N) 필터 + tag/search 조건. N이 1000~3000 이어도 즉시.
//   - drawList()         : visible 개수(PAGE_SIZE=20)만 DOM 생성. 더보기 시 추가 PAGE_SIZE.
//   - drawList 재호출 시 #studyListSection 만 교체 → 입력 포커스 유지.
//   - studySession.queue : 최대 SESSION_TARGET(10) 항목만 — 풀 크기에 무관.
//   - 단어/문법/독해/청해 4영역 각각 listState 독립 (검색·태그·visible 분리).
// N5 500 시점에 PAGE_SIZE 그대로(20) 충분 — UI 가 한 번에 20개만 그림. 풀 확장이 DOM 부담을 키우지 않음.

import { vocab } from '../data/vocab.js';
import { helpCard } from '../helpContent.js';
import { speak } from '../tts.js';
import { grammar } from '../data/grammar.js';
import { reading } from '../data/reading.js';
import { listening } from '../data/listening.js';
import { kanji } from '../data/kanji.js';
import { renderQuestion } from './questionView.js';
import { renderVocabCard } from './vocabCardView.js';
import { renderKanjiCard } from './kanjiView.js';
import { renderKanaChart, resetKana } from './kanaChart.js';
import { getState } from '../storage.js';
import { favoritesList, failureNotesList, markStudiedToday } from '../state.js';
import { recordResult } from '../srs.js';
import { getLearnedCoverage, classifyContentReadiness } from '../contentReadiness.js';
import { getVocabRomaji } from '../romaji.js';
import { escape, showToast } from '../ui.js';
import { navigate } from '../router.js';
import { peekStudyReturnRoute, consumeStudyReturnRoute, clearStudyReturnRoute } from '../studyReturn.js';
// 단일 항목 lookup 은 repository 경유 (라운드 17 — preload 후 JSON 데이터 사용).
// 목록 필터링(TYPES.data)은 다음 라운드에서 전환.
import { findItem as repoFindItem } from '../contentRepository.js';
import { logAction } from '../actionLogger.js';

const TYPES = {
  vocab:     { label:'단어', data: vocab },
  grammar:   { label:'문법', data: grammar },
  reading:   { label:'독해', data: reading },
  listening: { label:'청해', data: listening },
  kanji:     { label:'한자', data: kanji },
  kana:      { label:'문자', data: null }, // 표 자체 — 검색/태그 미사용
};
const PAGE_SIZE = 20;          // 목록 한 페이지 항목 수
const SESSION_TARGET = 10;     // 단어 학습 세션 크기
const TOP_VOCAB_TAGS = ['명사','동사','형용사','가족','시간','장소','음식','학교'];

let currentType  = null;       // null → 분야 선택 단계(랜딩)
let currentLevel = null;
let currentItem  = null;       // { type, id } — 단일 항목 풀이
let vocabMode    = 'image';    // 'image' | 'example' (browse 진입 후 행동에 영향)
let currentMethod = null;      // 학습법 (image | example | browse | quiz | compare | cards | chart | card)
let pendingFocusId = null;     // 딥링크로 들어온 단어/문법 id (card / browse 진입 시 사용)

// 분야별 학습법 — 랜딩에 칩으로 노출되는 항목.
const METHODS = {
  vocab:     ['image', 'example', 'browse'],
  grammar:   ['quiz', 'compare', 'browse'],
  reading:   ['browse'],
  listening: ['browse'],
  kanji:     ['cards', 'browse'],
  kana:      ['chart'],
};

// 딥링크로만 허용되는 학습법 — 랜딩 칩에는 노출하지 않지만 URL 로 직접 진입 가능.
// `card` 는 특정 id (focusParam) 와 함께 와야 작동하며, 없거나 invalid 면 browse 로 fallback.
const DEEP_LINK_METHODS = {
  vocab:     new Set(['image', 'example', 'browse', 'card']),
  grammar:   new Set(['quiz', 'compare', 'browse', 'card']),
  reading:   new Set(['browse']),
  listening: new Set(['browse']),
  kanji:     new Set(['cards', 'browse']),
  kana:      new Set(['chart']),
};
const METHOD_LABELS = {
  image:   '이미지 카드 단계형',
  example: '예문 문제',
  browse:  '찾아보기',
  quiz:    '문법 문제',
  compare: '비슷한 문법 비교',
  cards:   '한자 카드',
  chart:   '히라가나/가타카나 표',
};

// 영역별 목록 상태 (검색·태그·표시 수)
const listState = {
  vocab:     { visible: PAGE_SIZE, search: '', tag: '' },
  grammar:   { visible: PAGE_SIZE, search: '', tag: '' },
  reading:   { visible: PAGE_SIZE, search: '', tag: '' },
  listening: { visible: PAGE_SIZE, search: '', tag: '' },
  kanji:     { visible: PAGE_SIZE, search: '', tag: '' },
};

// 단어 10개 학습 세션 상태 (오늘의 10분과는 독립)
let studySession = null;       // { mode, source, queue, index, results, label }

// ── helpers ─────────────────────────────────────────────────────────────
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function searchFields(type, it) {
  if (type === 'vocab')     return [it.word, it.reading, it.meaningKo, it.exampleSentence];
  if (type === 'grammar')   return [it.pattern, it.meaningKo, it.explanation];
  if (type === 'reading')   return [it.title, it.passage, it.question];
  if (type === 'listening') return [it.scenario, it.script, it.question];
  if (type === 'kanji') {
    const exs = (it.exampleWords || []).map(w => `${w.word} ${w.reading} ${w.meaningKo}`).join(' ');
    return [it.kanji, it.hiragana, it.meaningKo, ...(it.tags || []), exs];
  }
  return [];
}

// ── 순수 함수 (테스트/재사용 용이) ─────────────────────────────────
/**
 * @param {Array} list — 영역 데이터 (vocab/grammar/reading/listening)
 * @param {string} type
 * @param {{level:string, tag:string, search:string}} criteria
 * @returns 필터링된 항목 배열
 */
export function applyFilter(list, type, { level, tag, search }) {
  const base = list.filter(x => x.level === level);
  return base.filter(it => {
    if (tag) {
      const tags = it.tags || [];
      if (!tags.includes(tag)) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const hay = searchFields(type, it).filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/**
 * 페이지 visible 슬라이스. 풀이 커도 visible 만 만들어진 DOM 부담은 일정.
 * @returns {{shown: Array, hasMore: boolean, remaining: number}}
 */
export function getVisibleSlice(all, visible) {
  const shown = all.slice(0, visible);
  return { shown, hasMore: all.length > visible, remaining: all.length - visible };
}

function filteredItems(type) {
  return applyFilter(TYPES[type].data, type, {
    level: currentLevel,
    tag: listState[type].tag,
    search: listState[type].search,
  });
}

function vocabFavoritePool() {
  const ids = new Set(favoritesList().filter(f => f.itemType === 'vocab').map(f => f.itemId));
  return vocab.filter(v => ids.has(v.id));
}
function vocabFailurePool() {
  const ids = new Set(failureNotesList().filter(n => n.itemType === 'vocab').map(n => n.itemId));
  return vocab.filter(v => ids.has(v.id));
}

// ── entry ───────────────────────────────────────────────────────────────
export function renderStudy({ screen, params }) {
  document.getElementById('topTitle').textContent = '학습';
  const typeParam   = params && params[0];
  const methodParam = params && params[1];
  const focusParam  = params && params[2];  // 딥링크 — 특정 항목 prefill (vocab id / grammar id)

  currentType   = (typeParam && TYPES[typeParam]) ? typeParam : null;
  currentLevel  = currentLevel || (getState().userProgress.targetLevel || 'N5');
  currentItem   = null;
  studySession  = null;
  currentMethod = null;
  pendingFocusId = focusParam || null;
  // 새 entry — listState 의 search/tag/visible 모두 초기화 (테스트 격리·UX 모두 명확).
  for (const k in listState) { listState[k].visible = PAGE_SIZE; listState[k].search = ''; listState[k].tag = ''; }
  if (currentType === 'kana') resetKana();

  // focus id 가 들어왔으면 browse 모드 검색에 prefill — 단어/문법 찾아보기 동선.
  if (currentType && focusParam) {
    setFocusFromId(currentType, focusParam);
  }

  // 딥링크 — #study/<type>/<method> 형태 직접 진입 시 학습법 자동 적용.
  // 'card' 는 DEEP_LINK_METHODS 에만 포함 (랜딩 칩 미노출).
  if (currentType && methodParam && DEEP_LINK_METHODS[currentType]?.has(methodParam)) {
    currentMethod = methodParam;
    return applyMethod(screen);
  }
  drawLanding(screen);
}

/** 스토리 등 외부 화면에서 특정 항목으로 점프할 때 search 를 채워 browse 로 안내. */
function setFocusFromId(type, id) {
  // repository lookup — kana 등 repository 미관리 타입은 null 반환되어 무시.
  let item = null;
  try { item = repoFindItem(type, id); } catch { item = null; }
  if (!item) return;
  const key = type === 'vocab' ? (item.word || '') :
              type === 'grammar' ? (item.pattern || '') :
              type === 'kanji' ? (item.kanji || '') : '';
  if (key) listState[type].search = key;
}

/** 학습 분야 → 난이도 → 학습법 → 시작 버튼 (단일 화면 랜딩). */
function drawLanding(screen) {
  clearStudyReturnRoute();  // 랜딩에 도달하면 스토리 복귀 컨텍스트 종료.
  screen.innerHTML = '';

  // 분야
  const typeBox = document.createElement('section');
  typeBox.className = 'card';
  typeBox.id = 'studyTypePanel';
  typeBox.style.padding = '12px 14px';
  typeBox.innerHTML = `<h2 style="margin:0 0 6px;font-size:14px">학습 분야</h2>`;
  const tFilters = document.createElement('div');
  tFilters.className = 'filters';
  tFilters.id = 'studyTypeChips';
  Object.entries(TYPES).forEach(([k, v]) => {
    const b = document.createElement('button');
    b.className = 'chip' + (k === currentType ? ' active' : '');
    b.textContent = v.label;
    b.dataset.type = k;
    b.onclick = () => {
      currentType = k;
      currentMethod = null;
      if (k === 'kana') resetKana();
      drawLanding(screen);
    };
    tFilters.appendChild(b);
  });
  typeBox.appendChild(tFilters);
  screen.appendChild(typeBox);

  // 난이도 — kana 는 불필요
  if (currentType && currentType !== 'kana') {
    const lvlBox = document.createElement('section');
    lvlBox.className = 'card';
    lvlBox.id = 'studyLevelPanel';
    lvlBox.style.padding = '12px 14px';
    lvlBox.innerHTML = `<h2 style="margin:0 0 6px;font-size:14px">난이도</h2>`;
    const lFilters = document.createElement('div');
    lFilters.className = 'filters';
    lFilters.id = 'studyLevelChips';
    ['N5','N4','N3','N2'].forEach(L => {
      const b = document.createElement('button');
      b.className = 'chip' + (L === currentLevel ? ' active' : '');
      b.textContent = L;
      b.dataset.level = L;
      b.onclick = () => {
        currentLevel = L;
        for (const t in listState) listState[t].visible = PAGE_SIZE;
        drawLanding(screen);
      };
      lFilters.appendChild(b);
    });
    lvlBox.appendChild(lFilters);
    screen.appendChild(lvlBox);
  }

  // 학습법
  if (currentType) {
    const mBox = document.createElement('section');
    mBox.className = 'card';
    mBox.id = 'studyMethodPanel';
    mBox.style.padding = '12px 14px';
    mBox.innerHTML = `<h2 style="margin:0 0 6px;font-size:14px">학습법</h2>`;
    const mFilters = document.createElement('div');
    mFilters.className = 'filters';
    mFilters.id = 'studyMethodChips';
    METHODS[currentType].forEach(m => {
      const b = document.createElement('button');
      b.className = 'chip' + (m === currentMethod ? ' active' : '');
      b.textContent = METHOD_LABELS[m] || m;
      b.dataset.method = m;
      b.onclick = () => { currentMethod = m; drawLanding(screen); };
      mFilters.appendChild(b);
    });
    mBox.appendChild(mFilters);
    screen.appendChild(mBox);
  }

  // 시작
  const startBox = document.createElement('div');
  startBox.className = 'btn-row';
  startBox.style.cssText = 'margin-top:12px;justify-content:center';
  const startBtn = document.createElement('button');
  startBtn.className = 'btn primary';
  startBtn.id = startBtnIdFor(currentType, currentMethod);
  startBtn.dataset.startStudy = '1';
  startBtn.textContent = '시작 →';
  startBtn.disabled = !(currentType && (currentType === 'kana' || currentMethod));
  startBtn.addEventListener('click', () => {
    if (currentType === 'kana') { currentMethod = 'chart'; }
    if (!currentMethod) return;
    applyMethod(screen);
  });
  startBox.appendChild(startBtn);
  screen.appendChild(startBox);

  if (currentType === 'vocab') {
    // 자주 볼 / 오답 복습 빠른 진입 (학습법 칩 하단 보조 영역).
    const favCount  = vocabFavoritePool().length;
    const failCount = vocabFailurePool().length;
    const aux = document.createElement('div');
    aux.className = 'btn-row';
    aux.style.cssText = 'margin-top:10px;flex-wrap:wrap;gap:6px;justify-content:center';
    aux.innerHTML = `
      <button class="btn" id="startFav"  ${favCount  === 0 ? 'disabled' : ''}>⭐ 자주 볼 ${favCount}개</button>
      <button class="btn" id="startFail" ${failCount === 0 ? 'disabled' : ''}>❌ 오답 ${failCount}개</button>
    `;
    aux.querySelector('#startFav').onclick  = () => { if (favCount  > 0) startSession('image', 'favorite'); };
    aux.querySelector('#startFail').onclick = () => { if (failCount > 0) startSession('image', 'failure'); };
    screen.appendChild(aux);
  }
  { const hc = helpCard('study'); if (hc) screen.prepend(hc); }
}

/** 학습법 분기. */
function applyMethod(screen) {
  // card 모드 가 아니면 return route 정리 — 학습 랜딩/세션/browse 동선에는 복귀 버튼이 끼지 않게.
  const isCard = (currentMethod === 'card');
  if (!isCard) clearStudyReturnRoute();

  // 학습 시작 행동 로그 — 실패해도 학습 흐름에 영향 없음 (fire-and-forget).
  logAction('study_start', { itemType: currentType, method: currentMethod });

  if (currentType === 'vocab') {
    if (currentMethod === 'image')   return startSession('image', 'filtered');
    if (currentMethod === 'example') return startSession('example', 'filtered');
    if (currentMethod === 'card')    { startSingleVocabCard(screen); maybePrependStoryReturnButton(screen); return; }
    if (currentMethod === 'browse')  { vocabMode = 'image'; return drawBrowse(screen); }
  }
  if (currentType === 'grammar') {
    if (currentMethod === 'compare') { navigate('compare'); return; }
    if (currentMethod === 'card')    { startSingleGrammar(screen); maybePrependStoryReturnButton(screen); return; }
    if (currentMethod === 'quiz' || currentMethod === 'browse') return drawBrowse(screen);
  }
  if (currentType === 'reading' || currentType === 'listening') return drawBrowse(screen);
  if (currentType === 'kanji') return drawBrowse(screen);
  if (currentType === 'kana')  return drawKana(screen);
  drawLanding(screen);
}

// ── 단일 단어 카드 직접 진입 (#study/vocab/card/<id>) ──────────────────────
// 없는/잘못된 id 는 browse 로 안전 fallback.
function startSingleVocabCard(screen) {
  const id = pendingFocusId;
  const v  = id && repoFindItem('vocab', id);
  if (!v) {
    showToast('단어를 찾을 수 없어 찾아보기로 이동합니다');
    currentMethod = 'browse';
    return drawBrowse(screen);
  }
  vocabMode = 'image';
  currentItem = { type: 'vocab', id: v.id };
  drawQuestion(screen);
}

function startSingleGrammar(screen) {
  const id = pendingFocusId;
  const g  = id && repoFindItem('grammar', id);
  if (!g) {
    showToast('문법을 찾을 수 없어 찾아보기로 이동합니다');
    currentMethod = 'browse';
    return drawBrowse(screen);
  }
  currentItem = { type: 'grammar', id: g.id };
  drawQuestion(screen);
}

/** 카드 모드(상단)에 "이야기로 돌아가기" 버튼을 prepend. returnRoute 가 있을 때만. */
function maybePrependStoryReturnButton(screen) {
  const route = peekStudyReturnRoute();
  if (!route) return;
  // 이미 있다면 중복 방지
  if (screen.querySelector('#storyReturnBtn')) return;
  const btn = document.createElement('button');
  btn.className = 'btn ghost small';
  btn.id = 'storyReturnBtn';
  btn.style.cssText = 'margin-bottom:8px';
  btn.textContent = '← 이야기로 돌아가기';
  btn.addEventListener('click', () => {
    const r = consumeStudyReturnRoute();
    if (r) navigate(r);
  });
  screen.prepend(btn);
}

function drawKana(screen) {
  screen.innerHTML = '';
  drawBackToLanding(screen);
  drawGenericHeader(screen);
  const wrap = document.createElement('div');
  screen.appendChild(wrap);
  renderKanaChart(wrap);
}

/** 찾아보기/목록 모드 — 기존 검색·태그·페이지 UI. */
function drawBrowse(screen) {
  if (currentItem)   return drawQuestion(screen);
  if (studySession)  return drawStudySession(screen);
  screen.innerHTML = '';
  drawBackToLanding(screen);
  drawLevelTabs(screen);
  if (currentType === 'vocab') drawVocabModeTabs(screen);
  drawGenericHeader(screen);
  drawSearchFilter(screen);
  drawList(screen);
}

function drawBackToLanding(screen) {
  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.id = 'studyBackBtn';
  back.textContent = '← 학습 선택';
  back.style.marginBottom = '8px';
  back.onclick = () => {
    currentItem = null;
    studySession = null;
    currentMethod = null;
    drawLanding(screen);
  };
  screen.appendChild(back);
}

function startBtnIdFor(type, method) {
  if (type === 'vocab' && method === 'image')   return 'startImage';
  if (type === 'vocab' && method === 'example') return 'startExample';
  return 'startStudyBtn';
}

// 외부에서 호출되는 경우는 없지만, browse 안에서의 draw() 호출 호환을 위해 유지.
function draw(screen) {
  if (currentItem)   return drawQuestion(screen);
  if (studySession)  return drawStudySession(screen);
  // 학습법이 없는 상태로 draw 가 다시 호출되면 (e.g. 세션 종료 후), 랜딩으로 복귀.
  if (!currentMethod) return drawLanding(screen);
  // 한자/문법/독해/청해/단어 browse 모드에서의 부분 갱신 → 그대로 browse 유지.
  drawBrowse(screen);
}

// ── tabs ────────────────────────────────────────────────────────────────
function drawTypeTabs(screen) {
  const tabs = document.createElement('div');
  tabs.className = 'filters';
  Object.entries(TYPES).forEach(([k, v]) => {
    const b = document.createElement('button');
    b.className = 'chip' + (k === currentType ? ' active' : '');
    b.textContent = v.label;
    b.onclick = () => { currentType = k; draw(screen); };
    tabs.appendChild(b);
  });
  screen.appendChild(tabs);
}
function drawLevelTabs(screen) {
  const tabs = document.createElement('div');
  tabs.className = 'filters';
  ['N5','N4','N3','N2'].forEach(L => {
    const b = document.createElement('button');
    b.className = 'chip' + (L === currentLevel ? ' active' : '');
    b.textContent = L;
    b.onclick = () => {
      currentLevel = L;
      for (const t in listState) listState[t].visible = PAGE_SIZE;
      draw(screen);
    };
    tabs.appendChild(b);
  });
  screen.appendChild(tabs);
}
function drawVocabModeTabs(screen) {
  const tabs = document.createElement('div');
  tabs.className = 'filters';
  tabs.id = 'vocabModeTabs';
  [['image','이미지 카드'], ['example','예문 문제']].forEach(([k, label]) => {
    const b = document.createElement('button');
    b.className = 'chip' + (vocabMode === k ? ' active' : '');
    b.textContent = label;
    b.onclick = () => { vocabMode = k; draw(screen); };
    tabs.appendChild(b);
  });
  screen.appendChild(tabs);
}

// ── 학습 액션 헤더 ──────────────────────────────────────────────────────
function drawVocabActionPanel(screen) {
  const totalCount = vocab.filter(v => v.level === currentLevel).length;
  const favCount   = vocabFavoritePool().length;
  const failCount  = vocabFailurePool().length;

  const card = document.createElement('section');
  card.className = 'card';
  card.id = 'vocabActionPanel';
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline">
      <h2 style="margin:0;font-size:14px">단어 학습 · ${currentLevel}</h2>
      <span class="muted" style="font-size:12px">현재 단어 수 ${totalCount}개</span>
    </div>
    <p class="muted" style="margin:4px 0 10px;font-size:11px">학습 시작이 우선 · 목록은 아래에서 검색·필터</p>
    <div class="action-grid">
      <button class="btn primary" id="startImage">🃏 이미지 카드 ${SESSION_TARGET}개</button>
      <button class="btn primary" id="startExample">📝 예문 문제 ${SESSION_TARGET}개</button>
      <button class="btn" id="startFav"  ${favCount  === 0 ? 'disabled' : ''}>⭐ 자주 볼 ${favCount}개</button>
      <button class="btn" id="startFail" ${failCount === 0 ? 'disabled' : ''}>❌ 오답 ${failCount}개</button>
    </div>
  `;
  screen.appendChild(card);
  card.querySelector('#startImage').onclick   = () => startSession('image', 'filtered');
  card.querySelector('#startExample').onclick = () => startSession('example', 'filtered');
  card.querySelector('#startFav').onclick     = () => { if (favCount  > 0) startSession('image', 'favorite'); };
  card.querySelector('#startFail').onclick    = () => { if (failCount > 0) startSession('image', 'failure');  };
}
function drawGenericHeader(screen) {
  const def = TYPES[currentType];
  // kana 는 목록이 없으므로 헤더만 다르게.
  if (currentType === 'kana') {
    const card = document.createElement('section');
    card.className = 'card';
    card.innerHTML = `
      <h2 style="margin:0;font-size:14px">문자 · 히라가나/가타카나</h2>
      <p class="muted" style="margin:4px 0 0;font-size:11px">표를 보고 발음을 들어보세요.</p>
    `;
    screen.appendChild(card);
    return;
  }
  const total = (def.data || []).filter(x => x.level === currentLevel).length;
  const card = document.createElement('section');
  card.className = 'card';
  const subText = currentType === 'kanji'
    ? '아래 목록에서 한자를 선택해 카드 학습을 시작하세요.'
    : '아래 목록에서 항목을 선택해 학습하세요.';
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline">
      <h2 style="margin:0;font-size:14px">${def.label} 학습 · ${currentLevel}</h2>
      <span class="muted" style="font-size:12px">현재 항목 수 ${total}개</span>
    </div>
    <p class="muted" style="margin:4px 0 0;font-size:11px">${subText}</p>
  `;
  screen.appendChild(card);
}

// ── 검색·태그 필터 ──────────────────────────────────────────────────────
function drawSearchFilter(screen) {
  const st = listState[currentType];

  // 태그 chip 후보
  const allTags = new Set();
  for (const it of TYPES[currentType].data.filter(x => x.level === currentLevel)) {
    for (const t of (it.tags || [])) allTags.add(t);
  }
  let tags;
  if (currentType === 'vocab') {
    tags = TOP_VOCAB_TAGS.filter(t => allTags.has(t));
  } else {
    tags = Array.from(allTags).slice(0, 8);
  }

  const card = document.createElement('div');
  card.className = 'card';
  card.id = 'searchFilterCard';
  const placeholder = currentType === 'vocab'
    ? '검색 — 단어/읽기/뜻/예문'
    : '검색 — 텍스트';
  const tagChips = ['', ...tags].map(t => `
    <button class="chip${st.tag === t ? ' active' : ''}" data-tag="${escape(t)}">
      ${t === '' ? '전체' : escape(t)}
    </button>
  `).join('');
  card.innerHTML = `
    <input class="search-input" id="searchInput" type="search"
           placeholder="${placeholder}" value="${escape(st.search)}" />
    <div class="filters" id="tagFilters" style="margin-top:8px">${tagChips}</div>
  `;
  screen.appendChild(card);

  const input = card.querySelector('#searchInput');
  input.addEventListener('input', () => {
    st.search = input.value;
    st.visible = PAGE_SIZE;
    drawList(screen);          // 부분 갱신 — 입력 포커스 유지
  });
  card.querySelectorAll('[data-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      st.tag = btn.dataset.tag;
      st.visible = PAGE_SIZE;
      draw(screen);            // 칩 active 상태도 갱신
    });
  });
}

// ── 페이지 목록 ─────────────────────────────────────────────────────────
function drawList(screen) {
  const old = screen.querySelector('#studyListSection');
  if (old) old.remove();

  const section = document.createElement('section');
  section.id = 'studyListSection';
  section.style.marginTop = '10px';

  const all = filteredItems(currentType);
  const st  = listState[currentType];
  const { shown, hasMore, remaining } = getVisibleSlice(all, st.visible);

  const header = document.createElement('p');
  header.className = 'muted';
  header.style.cssText = 'margin:0 0 6px;font-size:12px';
  header.textContent = `총 ${all.length}개 — ${shown.length}개 표시`;
  section.appendChild(header);

  if (shown.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.innerHTML = `<div class="e-icon">📭</div>일치하는 항목이 없습니다.`;
    section.appendChild(empty);
  } else {
    const list = document.createElement('div');
    list.className = 'list';
    shown.forEach(it => list.appendChild(rowFor(currentType, it)));
    section.appendChild(list);

    if (hasMore) {
      const more = document.createElement('button');
      more.className = 'btn more-btn';
      more.style.marginTop = '8px';
      more.textContent = `더 보기 (${remaining}개 남음)`;
      more.onclick = () => {
        st.visible += PAGE_SIZE;
        drawList(screen);
      };
      section.appendChild(more);
    }
  }

  screen.appendChild(section);
  { const key = (currentType === 'reading' || currentType === 'listening') ? 'readingListening'
      : currentType === 'grammar' ? 'grammar' : null;
    const hc = key && helpCard(key); if (hc) screen.prepend(hc); }
}

function rowFor(type, it) {
  const row = document.createElement('div');
  row.className = 'row';
  let title = '', sub = '';
  let titleIsHtml = false;
  if (type === 'vocab')     { title = `${escape(it.word)} · ${escape(it.reading)} · <span class="muted romaji-sub">${escape(getVocabRomaji(it))}</span>`; titleIsHtml = true; sub = it.meaningKo + ' · ' + it.exampleSentence; }
  if (type === 'grammar')   { title = it.pattern;   sub = it.meaningKo; }
  if (type === 'reading')   { title = it.title;     sub = it.passage.slice(0, 36) + '…'; }
  if (type === 'listening') { title = it.scenario;  sub = it.script.slice(0, 36) + '…'; }
  if (type === 'kanji')     { title = `${it.kanji}  ${it.hiragana}`; sub = `${it.meaningKo} · ${it.strokeCount}획 · 부수 ${it.radical}`; }
  // 독해/청해 — 학습 준비도 배지 (의존성 태깅이 있는 항목만)
  let badge = '';
  if ((type === 'reading' || type === 'listening') && (it.vocabIds || it.grammarIds)) {
    const rs = (getState().reviewStates) || {};
    const cov = getLearnedCoverage(it, rs);
    const cls = classifyContentReadiness(it, rs);
    const pct = Math.round(cov.totalKnownRatio * 100);
    const newCount = cov.missingVocabIds.length;
    const color = cls === 'ready' ? 'var(--good)' : cls === 'good_next' ? 'var(--accent)' : 'var(--muted)';
    badge = `<div class="s readiness-badge" style="font-size:11px;color:${color}">`
      + `준비도 ${pct}% · 배운 단어 ${cov.vocabKnown}/${cov.vocabTotal}`
      + (cov.grammarTotal ? ` · 문법 ${cov.grammarKnown}/${cov.grammarTotal}` : '')
      + (newCount > 0 ? ` · 새 단어 ${newCount}개` : '')
      + `</div>`;
  }
  row.innerHTML = `
    <div class="main">
      <div class="t">${titleIsHtml ? title : escape(title)}</div>
      <div class="s row-sub-2line">${escape(sub)}</div>
      ${badge}
    </div>
    <div class="actions">
      ${type === 'vocab' ? '<button class="icon-btn" data-act="listen" title="발음 듣기" aria-label="발음 듣기">🔊</button>' : ''}
      <button class="icon-btn" data-act="start" title="문제 풀이">▶</button>
    </div>
  `;
  const listenBtn = row.querySelector('[data-act="listen"]');
  if (listenBtn) listenBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // 학습 진입과 충돌 방지 — 발음만 재생, 학습 기록 없음
    speak(it.word);
  });
  row.querySelector('[data-act="start"]').addEventListener('click', () => {
    currentItem = { type, id: it.id };
    drawQuestion(document.getElementById('screen'));
  });
  return row;
}

// ── 단일 항목 풀이 ─────────────────────────────────────────────────────
function drawQuestion(screen) {
  screen.innerHTML = '';
  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.textContent = '← 목록으로';
  back.style.marginBottom = '10px';
  back.onclick = () => { currentItem = null; draw(screen); };
  screen.appendChild(back);

  // 한자 — 별도 카드 뷰. 학습 결과는 srs.recordResult(id, 'kanji', correct) 로 영속화.
  if (currentItem.type === 'kanji') {
    const k = kanji.find(x => x.id === currentItem.id);
    renderKanjiCard(screen, k, {
      onKnown:  () => { recordResult(k.id, 'kanji', true);  markStudiedToday(); },
      onReview: () => { recordResult(k.id, 'kanji', false); markStudiedToday(); },
      onNext:   () => { currentItem = null; draw(screen); },
    });
    return;
  }

  const useImage = currentItem.type === 'vocab' && vocabMode === 'image';
  const renderFn = useImage ? renderVocabCard : renderQuestion;
  renderFn(screen, { itemType: currentItem.type, itemId: currentItem.id }, {
    onNext: () => { currentItem = null; draw(screen); },
  });
}

// ── 단어 10개 학습 세션 ─────────────────────────────────────────────────
function startSession(mode, source) {
  let pool, label;
  if (source === 'filtered')      { pool = filteredItems('vocab');  label = mode === 'image' ? '단어 이미지 카드' : '단어 예문 문제'; }
  else if (source === 'favorite') { pool = vocabFavoritePool();     label = '자주 볼 단어 복습'; }
  else if (source === 'failure')  { pool = vocabFailurePool();      label = '오답 단어 복습'; }
  else                            { pool = [];                       label = ''; }

  if (pool.length === 0) {
    showToast('학습 가능한 단어가 없습니다');
    return;
  }
  const queue = shuffled(pool).slice(0, SESSION_TARGET)
    .map(v => ({ itemType: 'vocab', itemId: v.id }));
  studySession = { mode, source, queue, index: 0, results: [], label };
  drawStudySession(document.getElementById('screen'));
}

function drawStudySession(screen) {
  if (!studySession) return;
  if (studySession.index >= studySession.queue.length) {
    return drawStudySessionSummary(screen);
  }
  screen.innerHTML = '';
  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.textContent = '← 종료';
  back.style.marginBottom = '10px';
  back.onclick = () => { studySession = null; draw(screen); };
  screen.appendChild(back);

  const item = studySession.queue[studySession.index];
  const render = studySession.mode === 'image' ? renderVocabCard : renderQuestion;
  render(screen, item, {
    headerLabel: `${studySession.label} · ${studySession.index + 1} / ${studySession.queue.length}`,
    onAnswered: r => studySession.results.push(r),
    onNext: () => {
      studySession.index++;
      drawStudySession(screen);
    },
  });
}

function drawStudySessionSummary(screen) {
  const sess = studySession;
  const total = sess.results.length;
  const correct = sess.results.filter(r => r.correct).length;
  const wrong = total - correct;
  const accuracy = total > 0 ? Math.round(correct / total * 100) : 0;

  // 오답 항목 (중복 제거)
  const wrongIds = new Set();
  const wrongItems = [];
  for (const r of sess.results) {
    if (r.correct) continue;
    if (wrongIds.has(r.itemId)) continue;
    wrongIds.add(r.itemId);
    const v = vocab.find(x => x.id === r.itemId);
    if (v) wrongItems.push(v);
  }

  screen.innerHTML = '';
  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.textContent = '← 학습 화면';
  back.style.marginBottom = '10px';
  back.onclick = () => { studySession = null; draw(screen); };
  screen.appendChild(back);

  const card = document.createElement('section');
  card.className = 'card';
  card.style.textAlign = 'center';
  card.innerHTML = `
    <div style="font-size:38px">📚</div>
    <h2 style="margin:6px 0 4px">${escape(sess.label)} 완료</h2>
    <p class="muted" style="margin:0 0 10px">
      총 ${total}문제 ·
      <span style="color:var(--good);font-weight:700">정답 ${correct}</span> ·
      <span style="color:var(--bad);font-weight:700">오답 ${wrong}</span>
    </p>
    <div class="bar" style="margin:0 auto 6px;max-width:240px"><div style="width:${accuracy}%"></div></div>
    <p class="muted" style="margin:0;font-size:12px">정답률 ${accuracy}%</p>
  `;
  screen.appendChild(card);

  if (wrongItems.length > 0) {
    const wCard = document.createElement('section');
    wCard.className = 'card';
    wCard.innerHTML =
      `<h2 style="margin:0 0 8px;font-size:14px">오답 단어 ${wrongItems.length}개</h2>` +
      `<div class="list">${wrongItems.map(v => `
        <div class="row"><div class="main">
          <div class="t">${escape(v.word)} <span class="muted">(${escape(v.reading)})</span></div>
          <div class="s">${escape(v.meaningKo)}</div>
        </div></div>`).join('')}</div>`;
    screen.appendChild(wCard);
  }

  const actions = document.createElement('div');
  actions.className = 'btn-row';
  actions.innerHTML = `
    <button class="btn" id="restartBtn">다시 학습</button>
    <button class="btn primary" id="exitBtn">목록으로</button>
  `;
  screen.appendChild(actions);
  actions.querySelector('#restartBtn').onclick = () => {
    const { mode, source } = sess;
    studySession = null;
    startSession(mode, source);
  };
  actions.querySelector('#exitBtn').onclick = () => {
    studySession = null;
    currentMethod = null;       // 학습 랜딩 복귀
    drawLanding(screen);
  };
}
