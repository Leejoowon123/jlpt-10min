// 이야기 / 단편 소설 — 스토리 학습 플레이어.
//
// 라우트:
//   #stories            — 이야기 목록
//   #novels             — 단편 소설 목록
//   #story/<id>         — 본문 (이야기/단편 공용 detail)
//
// 재생 모드:
//   playingMode === 'none'      — 정지
//   playingMode === 'single'    — 특정 문단 1회 재생 (자동 다음 없음)
//   playingMode === 'sequence'  — 현재 index 부터 마지막 문단까지 순차 재생
//                                  (각 문단 사이 STORY_SENTENCE_PAUSE_MS 쉼)
//
// 정책:
//   - 한국어 해석은 "해석" 탭 또는 본문 토글에서만 노출. 기본 탭(이야기) 에는 부재.
//   - 후리가나 ON/OFF 는 renderJa 가 자동 적용.
//   - 라우트 이동/뒤로/다른 story 진입 시 stopStoryAudio 호출 — 타이머·TTS 모두 정리.

// 데이터 접근은 contentRepository 경유 (라운드 17) — 직접 ../data/*.js import 금지.
// preloadRepositoryLevel 완료 후에는 data/<level>/stories.json 데이터가 사용된다.
import {
  getAllItems, findItem, findVocab, findGrammar,
  preloadRepositoryLevel, isRepositoryLevelLoaded,
} from '../contentRepository.js';
import { getState } from '../storage.js';
import { speak, stopSpeaking } from '../tts.js';
import { renderJa } from '../furigana.js';
import { containsKanji } from '../furigana.js';
import { escape, showToast } from '../ui.js';
import { navigate } from '../router.js';
import {
  getStoryProgress, setStoryLastIndex, markStoryCompleted, noteStoryOpened,
  getFuriganaEnabled,
  getStoryHideCompleted, setStoryHideCompleted,
  getStoryRomajiEnabled, getStoryTranslationEnabled,
} from '../state.js';
import { setStudyReturnRoute } from '../studyReturn.js';
import { logAction } from '../actionLogger.js';

const LEVELS = ['ALL', 'N5', 'N4', 'N3', 'N2'];

/** 문단 사이 쉼. 문장 단위 확장을 고려해 sentence 라 이름지었지만 현재는 문단 단위. */
export const STORY_SENTENCE_PAUSE_MS = 700;

/** 허용 속도. localStorage 영속 키: jlpt10min:storyTtsRate */
const STORY_RATE_ALLOWED = [0.75, 1, 1.25];
const STORY_RATE_DEFAULT = 1;
const STORY_RATE_KEY = 'jlpt10min:storyTtsRate';

// 목록별 필터 상태 — level/tag 는 in-memory, hideCompleted 는 storage 영속.
const listState = {
  stories: { level: null, tag: '' },
  novels:  { level: null, tag: '' },
};

// ── 플레이어 module-level state ───────────────────────────────────────────
let playingMode  = 'none';   // 'none' | 'single' | 'sequence'
let activeIndex  = -1;
let pauseTimer   = null;
let storyRate    = loadRate();
let currentStoryId = null;
let currentTab   = 'story';  // 'story' | 'vocab' | 'grammar' | 'ko'
let activeStory  = null;     // 캐시 — 타이머 콜백에서 사용

function loadRate() {
  try {
    const v = parseFloat(globalThis.localStorage?.getItem(STORY_RATE_KEY));
    return STORY_RATE_ALLOWED.includes(v) ? v : STORY_RATE_DEFAULT;
  } catch { return STORY_RATE_DEFAULT; }
}
function saveRate(r) {
  try { globalThis.localStorage?.setItem(STORY_RATE_KEY, String(r)); } catch {}
}

// ── 인라인 하이라이트 렌더 ────────────────────────────────────────────────
// 한 문단의 일본어 텍스트를 받아 (1) 명시 readings 후리가나 + (2) 명시 highlights
// 를 동시에 적용한 HTML 을 만든다.
//
// 처리 순서 (긴 매칭 우선):
//   1. highlights — 후보 entries: {text, reading, meaningKo, vocabId, kind, hlIdx}
//      매칭되면 .story-inline-hl 버튼으로 wrap. 내부에는 후리가나 ruby (ON 일 때).
//   2. furigana 자동 사전 — renderJa 로 그 외 한자 매칭 처리.
//
// 후리가나 토글 OFF 시 ruby 없이 text 만 escape 후 highlight wrap.
// XSS — text/reading/meaningKo 모두 escape.
//
// 데이터 속성:
//   data-line-idx="<paragraph idx>"  data-hl-idx="<hl idx in paragraph>"
// 클릭 시 storyView 의 highlight 패널 표시.
export function renderStoryLineWithHighlights(text, readings, highlights, lineIdx) {
  if (!text || typeof text !== 'string') return '';
  const furiOn = getFuriganaEnabled();
  // hl 정렬: 긴 단어 우선 — 日本語 가 日本 보다 먼저 매칭되도록.
  const hls = (highlights || [])
    .map((h, i) => ({ ...h, _idx: i }))
    .filter(h => h && h.text)
    .sort((a, b) => b.text.length - a.text.length);

  const out = [];
  let i = 0;
  while (i < text.length) {
    // 1) highlight 우선 매칭
    let matched = null;
    for (const h of hls) {
      if (text.startsWith(h.text, i)) { matched = h; break; }
    }
    if (matched) {
      const innerHtml = furiOn && containsKanji(matched.text) && matched.reading
        ? `<ruby>${escapeHtml(matched.text)}<rt>${escapeHtml(matched.reading)}</rt></ruby>`
        : escapeHtml(matched.text);
      out.push(
        `<button type="button" class="story-inline-hl chip"` +
        ` data-line-idx="${lineIdx}" data-hl-idx="${matched._idx}"` +
        ` aria-label="핵심 단어 ${escapeHtml(matched.text)}"` +
        ` title="${escapeHtml(matched.meaningKo || '')}">${innerHtml}</button>`
      );
      i += matched.text.length;
      continue;
    }
    // 2) furigana 자동 사전 — 다음 highlight 가 나올 때까지 또는 끝까지의 segment 를 renderJa 에 위임.
    let nextHlAt = -1;
    if (hls.length) {
      let best = text.length;
      for (const h of hls) {
        const at = text.indexOf(h.text, i);
        if (at >= 0 && at < best) best = at;
      }
      nextHlAt = best;
    } else {
      nextHlAt = text.length;
    }
    const segment = text.slice(i, nextHlAt);
    if (segment) {
      out.push(renderJa(segment, readings || []));
    }
    i = nextHlAt;
  }
  return out.join('');
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function clearStoryPauseTimer() {
  if (pauseTimer !== null) { clearTimeout(pauseTimer); pauseTimer = null; }
}

/** TTS 중단 + 타이머 정리 + 재생 상태 reset. route cleanup 에서 호출. */
export function stopStoryAudio() {
  playingMode = 'none';
  // activeIndex 는 보존 — 다음 재생 시 같은 위치에서 이어 듣기 위함.
  // 단, 외부에서 명시적 정지 후 active highlight 도 해제하고 싶다면 setActiveLine(-1).
  clearStoryPauseTimer();
  stopSpeaking();
}

function defaultLevel() {
  return getState().userProgress.targetLevel || 'N5';
}

// ── repository 기반 데이터 헬퍼 ──────────────────────────────────────────
// 동기 getter — 시작 직후엔 JS 정적 데이터, preload 후엔 JSON 데이터.
function getStoriesForListing() {
  return getAllItems('stories').filter(s => s.type === 'daily_story' || s.type === 'news_style');
}
function getNovelsForListing() {
  return getAllItems('stories').filter(s => s.type === 'short_story');
}
function findStory(id) {
  return findItem('stories', id);
}

// 목표 레벨의 JSON 을 백그라운드 preload — 실패해도 무시 (JS fallback 이 이미 화면에 있음).
// 데이터가 JSON 으로 교체되어도 스키마가 동일하므로 재렌더 불필요.
function warmRepository() {
  const lvl = defaultLevel();
  if (!isRepositoryLevelLoaded(lvl)) {
    preloadRepositoryLevel(lvl).catch(() => {});
  }
}

function typeLabel(t) {
  return t === 'daily_story' ? '생활 이야기'
       : t === 'news_style'  ? '뉴스 스타일'
       : t === 'short_story' ? '단편 소설'
       : t || '';
}

// ── 진입점 ────────────────────────────────────────────────────────────────
export function renderStories({ screen, params }) {
  document.getElementById('topTitle').textContent = '이야기';
  stopStoryAudio();
  warmRepository();
  if (params && params[0]) return drawDetail(screen, params[0]);
  drawList(screen, 'stories', getStoriesForListing());
}

export function renderNovels({ screen, params }) {
  document.getElementById('topTitle').textContent = '단편 소설';
  stopStoryAudio();
  warmRepository();
  if (params && params[0]) return drawDetail(screen, params[0]);
  drawList(screen, 'novels', getNovelsForListing());
}

export function renderStoryDetail({ screen, params }) {
  stopStoryAudio();
  warmRepository();
  drawDetail(screen, params[0]);
}

// ── 목록 ──────────────────────────────────────────────────────────────────
function drawList(screen, key, allItems) {
  const st = listState[key];
  if (!st.level) st.level = defaultLevel();
  screen.innerHTML = '';

  const intro = document.createElement('section');
  intro.className = 'card';
  intro.style.padding = '12px 14px';
  intro.innerHTML = `
    <h2 style="margin:0;font-size:14px">${key === 'stories' ? '이야기' : '단편 소설'}</h2>
    <p class="muted" style="margin:4px 0 0;font-size:12px">${key === 'stories'
      ? '짧은 생활 이야기 / 쉬운 뉴스 스타일 읽기.'
      : '조금 더 긴 창작 단편.'}</p>
    <p class="muted" style="margin:4px 0 0;font-size:11px">전체 콘텐츠는 본 프로젝트용 직접 창작 (외부 기사 미사용).</p>
  `;
  screen.appendChild(intro);

  const lf = document.createElement('div');
  lf.className = 'filters';
  LEVELS.forEach(L => {
    const b = document.createElement('button');
    b.className = 'chip' + ((st.level === L) ? ' active' : '');
    b.textContent = L;
    b.onclick = () => { st.level = L; drawList(screen, key, allItems); };
    lf.appendChild(b);
  });
  screen.appendChild(lf);

  const tagSet = new Set();
  for (const s of allItems) for (const t of (s.tags || [])) tagSet.add(t);
  const tags = Array.from(tagSet).slice(0, 8);
  if (tags.length) {
    const tf = document.createElement('div');
    tf.className = 'filters';
    [''].concat(tags).forEach(t => {
      const b = document.createElement('button');
      b.className = 'chip' + (st.tag === t ? ' active' : '');
      b.textContent = t === '' ? '전체 태그' : t;
      b.onclick = () => { st.tag = t; drawList(screen, key, allItems); };
      tf.appendChild(b);
    });
    screen.appendChild(tf);
  }

  // 진행도 요약 + 완료 항목 숨기기 토글 (영속) — 한 줄.
  const hideCompleted = getStoryHideCompleted();
  let doneCount = 0, inProgressCount = 0;
  for (const item of allItems) {
    const prog = getStoryProgress(item.id);
    if (prog.completed) doneCount++;
    else if (prog.lastIndex > 0) inProgressCount++;
  }
  const summaryRow = document.createElement('div');
  summaryRow.className = 'story-list-summary';
  summaryRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin:6px 0 4px;flex-wrap:wrap;font-size:12px';
  summaryRow.innerHTML = `
    <span class="muted" id="storyProgressSummary">
      완료 ${doneCount}편 · 읽는 중 ${inProgressCount}편
    </span>
    <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer">
      <input type="checkbox" id="hideCompletedToggle" ${hideCompleted ? 'checked' : ''} style="margin:0">
      <span>완료한 ${key === 'stories' ? '이야기' : '단편'} 숨기기</span>
    </label>
  `;
  screen.appendChild(summaryRow);
  summaryRow.querySelector('#hideCompletedToggle').addEventListener('change', (e) => {
    setStoryHideCompleted(!!e.target.checked);
    drawList(screen, key, allItems);
  });

  const items = allItems.filter(s =>
    (st.level === 'ALL' || s.level === st.level) &&
    (st.tag === '' || (s.tags || []).includes(st.tag)) &&
    (!hideCompleted || !getStoryProgress(s.id).completed)
  );

  const list = document.createElement('div');
  list.className = 'list';
  list.id = key === 'stories' ? 'storyList' : 'novelList';
  if (!items.length) {
    list.innerHTML = `<div class="empty"><div class="e-icon">📭</div>해당 조건의 ${key === 'stories' ? '이야기' : '단편'}이 없습니다.</div>`;
  } else {
    for (const s of items) {
      const row = document.createElement('div');
      row.className = 'row';
      row.dataset.storyId = s.id;
      const prog = getStoryProgress(s.id);
      const isDone = !!prog.completed;
      const total  = (s.bodyJa || []).length;
      const doneBadge = isDone ? `<span class="badge good story-done-badge" title="학습 완료">✓ 완료</span>` : '';
      const progressLabel = (!isDone && prog.lastIndex > 0)
        ? ` · <span class="story-progress-note">마지막 ${prog.lastIndex + 1}/${total} 문단</span>`
        : '';
      row.classList.toggle('done', isDone);
      row.dataset.completed = isDone ? '1' : '0';
      // coverImage 가 있으면 썸네일, 없으면 기존 텍스트만 (fallback).
      const thumb = s.coverImage?.src
        ? `<img class="story-cover-thumb" src="${escape(s.coverImage.src)}"
               alt="${escape(s.coverImage.altKo || '')}"
               onerror="this.style.display='none'">`
        : '';
      row.innerHTML = `
        ${thumb}
        <div class="main">
          <div class="t">
            <span class="badge">${escape(s.level)}</span>
            ${doneBadge}
            ${escape(s.titleJa)} <span class="muted">— ${escape(s.titleKo)}</span>
          </div>
          <div class="s">${escape(s.summaryKo)} · 약 ${s.estimatedMinutes}분${progressLabel}</div>
        </div>
        <div class="actions"><button class="icon-btn" data-act="open" title="읽기">▶</button></div>
      `;
      row.onclick = () => { navigate('story/' + s.id); };
      list.appendChild(row);
    }
  }
  screen.appendChild(list);
}

// ── 본문 (스토리 학습 플레이어) ───────────────────────────────────────────
function drawDetail(screen, id) {
  const s = findStory(id);
  if (!s) {
    screen.innerHTML = `<div class="empty"><div class="e-icon">📭</div>이야기를 찾을 수 없습니다.</div>`;
    return;
  }
  document.getElementById('topTitle').textContent = s.titleKo;
  // 신규 mount 는 lastIndex 복원/이야기 탭부터. 탭 전환은 같은 mount 안에서만 유지.
  const storyChanged = currentStoryId !== s.id;
  currentStoryId = s.id;
  if (storyChanged || !screen.querySelector('#storyTabs')) {
    currentTab  = 'story';
    // storyProgress.lastIndex 복원 — 없으면 -1
    const prog = getStoryProgress(s.id);
    activeIndex = (prog && Number.isInteger(prog.lastIndex) && prog.lastIndex > 0)
      ? Math.min(prog.lastIndex, (s.bodyJa || []).length - 1) : -1;
    // 진입 기록
    noteStoryOpened(s.id);
    // 행동 로그 — 같은 story 단기 중복은 actionLogger 가 차단.
    logAction('story_open', { storyId: s.id });
  }
  activeStory = s;
  screen.innerHTML = '';
  screen.classList.add('has-story-player');   // CSS padding-bottom 적용
  screen.id = 'screen'; // 안전

  const isNovel = s.type === 'short_story';

  // 뒤로
  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.id = 'storyBackBtn';
  back.textContent = isNovel ? '← 단편 소설 목록' : '← 이야기 목록';
  back.style.marginBottom = '10px';
  back.onclick = () => { stopStoryAudio(); navigate(isNovel ? 'novels' : 'stories'); };
  screen.appendChild(back);

  // 헤더
  const prog = getStoryProgress(s.id);
  const isDone = !!prog.completed;
  const header = document.createElement('div');
  header.className = 'card';
  header.style.padding = '12px 14px';
  const coverHtml = s.coverImage?.src
    ? `<img class="story-cover" src="${escape(s.coverImage.src)}"
           alt="${escape(s.coverImage.altKo || '')}"
           onerror="this.style.display='none'">`
    : '';
  header.innerHTML = `
    ${coverHtml}
    <h2 style="margin:0;font-size:16px">${escape(s.titleJa)}</h2>
    <p class="muted" style="margin:4px 0 0;font-size:12px">${escape(s.titleKo)} · ${s.level} · 약 ${s.estimatedMinutes}분 · ${escape(typeLabel(s.type))}</p>
    <p class="muted" style="margin:6px 0 0;font-size:11px">${escape(s.summaryKo)}</p>
    <div class="btn-row" style="margin-top:8px;gap:6px;flex-wrap:wrap">
      <button class="btn small" id="storyMarkDoneBtn" aria-pressed="${isDone}">
        ${isDone ? '✓ 학습 완료됨 (취소)' : '학습 완료로 표시'}
      </button>
      ${prog.lastIndex > 0
        ? `<span class="muted" style="font-size:11px;align-self:center">마지막 위치 ${prog.lastIndex + 1}</span>`
        : ''}
    </div>
  `;
  screen.appendChild(header);
  header.querySelector('#storyMarkDoneBtn').addEventListener('click', () => {
    // getStoryProgress 는 live 객체를 반환하므로 mutate 전에 boolean 을 캡처해야 한다.
    const wasCompleted = !!getStoryProgress(s.id).completed;
    markStoryCompleted(s.id, !wasCompleted);
    if (!wasCompleted) logAction('story_complete', { storyId: s.id });
    showToast(wasCompleted ? '완료 취소' : '학습 완료로 표시');
    drawDetail(screen, s.id);
  });

  // 탭 바
  const tabs = document.createElement('div');
  tabs.className = 'filters story-tabs';
  tabs.id = 'storyTabs';
  // 해석은 본문 줄 아래 기본 표시되므로 'ko' 탭은 "전체 해석" 보조 탭으로 축소.
  const TAB_LIST = [
    ['story', '이야기'], ['vocab', '핵심 단어'],
    ['grammar', '문법'], ['ko', '전체 해석'],
  ];
  for (const [k, label] of TAB_LIST) {
    const b = document.createElement('button');
    b.className = 'chip' + (currentTab === k ? ' active' : '');
    b.dataset.tab = k;
    b.textContent = label;
    b.addEventListener('click', () => {
      currentTab = k;
      drawDetail(screen, s.id);
    });
    tabs.appendChild(b);
  }
  screen.appendChild(tabs);

  // 탭 본문
  const body = document.createElement('section');
  body.className = 'card';
  body.id = 'storyTabBody';
  body.style.padding = '12px 14px';
  screen.appendChild(body);

  if (currentTab === 'story') paintStoryTab(body, s);
  else if (currentTab === 'vocab')   paintVocabTab(body, s);
  else if (currentTab === 'grammar') paintGrammarTab(body, s);
  else if (currentTab === 'ko')      paintKoTab(body, s);

  // 하단 고정 플레이어
  drawBottomPlayer(screen, s);

  // 진입 시 activeIndex 가 유효하면 active 표시 복원
  if (currentTab === 'story' && activeIndex >= 0) {
    setActiveLine(activeIndex);
  }
}

// ── 이야기 탭 ──────────────────────────────────────────────────────────────
function paintStoryTab(container, s) {
  container.innerHTML = '';
  container.style.lineHeight = '1.9';
  container.id = 'storyBody';

  const paragraphs = s.bodyJa || [];
  const readings   = s.bodyReadings || [];
  const highlights = s.bodyHighlights || [];
  const romaji     = s.bodyRomaji || [];
  const koLines    = s.bodyKo || [];
  const showRomaji = getStoryRomajiEnabled();
  const showKo     = getStoryTranslationEnabled();

  paragraphs.forEach((para, idx) => {
    const line = document.createElement('div');
    line.className = 'story-line';
    line.dataset.idx = String(idx);

    const ja = document.createElement('p');
    ja.className = 'story-ja';
    ja.style.cssText = 'margin:0;font-size:15px';
    // 본문 안 직접 하이라이트 (긴 매칭 우선 + 후리가나 통합)
    ja.innerHTML = renderStoryLineWithHighlights(para, readings[idx] || [], highlights[idx] || [], idx);
    line.appendChild(ja);

    // 로마자 줄 — 설정 ON + 데이터 존재 시
    if (showRomaji && romaji[idx]) {
      const rm = document.createElement('p');
      rm.className = 'story-romaji';
      rm.textContent = romaji[idx];
      line.appendChild(rm);
    }

    // 한국어 해석 줄 — 일본어 바로 아래 기본 표시 (설정으로 OFF 가능)
    if (showKo && koLines[idx]) {
      const ko = document.createElement('p');
      ko.className = 'story-ko-inline';
      ko.textContent = koLines[idx];
      line.appendChild(ko);
    }

    // 문단별 단일 재생 버튼
    const ctrl = document.createElement('div');
    ctrl.className = 'btn-row story-line-controls';
    ctrl.style.cssText = 'margin-top:4px;gap:6px';
    ctrl.innerHTML = `
      <button class="btn tts-btn small" data-line-play="${idx}"
              aria-label="이 문단 듣기" title="이 문단 듣기">🔊 이 문단 듣기</button>
      <span class="story-line-badge" hidden>재생 중</span>
    `;
    line.appendChild(ctrl);

    // 하이라이트 클릭 시 표시할 정보 패널 (초기 hidden)
    const panel = document.createElement('div');
    panel.className = 'story-hl-panel';
    panel.hidden = true;
    line.appendChild(panel);

    container.appendChild(line);
  });

  // 본문 재생 버튼 핸들러
  container.querySelectorAll('[data-line-play]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.linePlay, 10);
      playSingleLine(idx);
    });
  });

  // 인라인 하이라이트 클릭 핸들러
  container.querySelectorAll('.story-inline-hl').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const lineIdx = parseInt(el.dataset.lineIdx, 10);
      const hlIdx   = parseInt(el.dataset.hlIdx, 10);
      const h = (s.bodyHighlights?.[lineIdx] || [])[hlIdx];
      if (!h) return;
      const lineEl = container.querySelector(`.story-line[data-idx="${lineIdx}"]`);
      showHighlightPanel(lineEl, h);
    });
  });
}

function showHighlightPanel(lineEl, h) {
  if (!lineEl) return;
  const p = lineEl.querySelector('.story-hl-panel');
  if (!p) return;
  // 같은 단어 두 번 누르면 닫힘
  if (!p.hidden && p.dataset.text === h.text) { p.hidden = true; p.innerHTML = ''; return; }
  p.dataset.text = h.text;
  p.hidden = false;
  const vocabBtn = h.vocabId
    ? `<button class="btn small" data-hl-action="study-vocab" data-vocab-id="${escape(h.vocabId)}">단어 학습 →</button>`
    : '';
  p.innerHTML = `
    <div class="story-hl-info">
      <p style="margin:0;font-size:14px">
        <strong>${escape(h.text)}</strong>
        <span class="muted">(${escape(h.reading || '')})</span> — ${escape(h.meaningKo || '')}
      </p>
      <div class="btn-row" style="margin-top:6px;gap:6px;flex-wrap:wrap">
        <button class="btn small" data-hl-action="speak" data-text="${escape(h.text)}"
                aria-label="발음 듣기" title="발음 듣기">🔊 발음 듣기</button>
        ${vocabBtn}
      </div>
    </div>
  `;
  // 핸들러
  p.querySelector('[data-hl-action="speak"]')?.addEventListener('click', async () => {
    const r = await speak(h.text, { rate: storyRate });
    if (r && !r.ok) showStoryTtsHint(r);
  });
  p.querySelector('[data-hl-action="study-vocab"]')?.addEventListener('click', () => {
    const id = h.vocabId;
    if (!id) return;
    stopStoryAudio();
    if (currentStoryId) setStudyReturnRoute('story/' + currentStoryId);
    navigate('study/vocab/card/' + id);
  });
}

// ── 핵심 단어 탭 ──────────────────────────────────────────────────────────
function paintVocabTab(container, s) {
  container.innerHTML = '';
  const ids = s.keyVocabularyIds || [];
  if (!ids.length) {
    container.innerHTML = `<p class="muted" style="margin:0;font-size:13px">핵심 단어 정보가 없습니다.</p>`;
    return;
  }
  container.innerHTML = `<h3 style="margin:0 0 8px;font-size:13px">핵심 단어 (${ids.length})</h3>`;
  const list = document.createElement('div');
  list.className = 'list';
  list.id = 'storyKeyVocabList';
  for (const id of ids) {
    const v = findVocab(id);
    if (!v) continue;
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.vocabId = id;
    row.innerHTML = `
      <div class="main">
        <div class="t">${escape(v.word)} <span class="muted">(${escape(v.reading)})</span></div>
        <div class="s">${escape(v.meaningKo)}</div>
      </div>
      <div class="actions">
        <button class="btn small" data-study-vocab="${escape(id)}"
                aria-label="단어 학습">단어 학습 →</button>
      </div>
    `;
    list.appendChild(row);
  }
  container.appendChild(list);
  // 학습 버튼 핸들러 — 단어 찾아보기로 점프 (해당 단어가 prefill 검색됨)
  container.querySelectorAll('[data-study-vocab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.studyVocab;
      stopStoryAudio();
      if (currentStoryId) setStudyReturnRoute('story/' + currentStoryId);
      navigate('study/vocab/card/' + id);
    });
  });
}

// ── 문법 탭 ──────────────────────────────────────────────────────────────
function paintGrammarTab(container, s) {
  container.innerHTML = '';
  const ids = s.keyGrammarIds || [];
  if (!ids.length) {
    container.innerHTML = `<p class="muted" style="margin:0;font-size:13px">관련 문법 정보가 없습니다.</p>`;
    return;
  }
  container.innerHTML = `<h3 style="margin:0 0 8px;font-size:13px">관련 문법 (${ids.length})</h3>`;
  const list = document.createElement('div');
  list.className = 'list';
  list.id = 'storyKeyGrammarList';
  for (const id of ids) {
    const g = findGrammar(id);
    if (!g) continue;
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.grammarId = id;
    row.innerHTML = `
      <div class="main">
        <div class="t">${escape(g.pattern)}</div>
        <div class="s">${escape(g.meaningKo || '')}</div>
      </div>
      <div class="actions">
        <button class="btn small" data-study-grammar="${escape(id)}"
                aria-label="문법 학습">문법 학습 →</button>
      </div>
    `;
    list.appendChild(row);
  }
  container.appendChild(list);
  container.querySelectorAll('[data-study-grammar]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.studyGrammar;
      stopStoryAudio();
      if (currentStoryId) setStudyReturnRoute('story/' + currentStoryId);
      navigate('study/grammar/card/' + id);
    });
  });
}

// ── 해석 탭 ──────────────────────────────────────────────────────────────
function paintKoTab(container, s) {
  container.innerHTML = '';
  container.style.lineHeight = '1.9';
  const wrap = document.createElement('div');
  wrap.id = 'storyKoTab';
  const para = s.bodyKo || [];
  if (!para.length) {
    wrap.innerHTML = `<p class="muted" style="margin:0;font-size:13px">한국어 번역이 없습니다.</p>`;
  } else {
    wrap.innerHTML = para.map((line, i) => `
      <div class="story-ko-line" data-idx="${i}">
        <p style="margin:0;font-size:14px">${escape(line)}</p>
      </div>
    `).join('');
  }
  container.appendChild(wrap);
}

// ── 하단 고정 플레이어 ───────────────────────────────────────────────────
function drawBottomPlayer(screen, s) {
  // 중복 마운트 방지
  const old = document.getElementById('storyPlayer');
  if (old) old.remove();

  const total = (s.bodyJa || []).length;
  const cur   = Math.max(0, activeIndex) + 1;

  const player = document.createElement('div');
  player.id = 'storyPlayer';
  player.className = 'story-player';
  // compact — 이전/재생/다음/위치/속도를 한 줄(좁은 폭은 자연 줄바꿈)로.
  player.innerHTML = `
    <div class="story-player-row story-player-main" id="storyControlsRow">
      <button class="player-btn" id="storyPrev" aria-label="이전 문단" title="이전 문단">⏮</button>
      <button class="player-btn primary" id="storyPlayAll"
              aria-label="전체 이야기 듣기" title="전체 이야기 듣기">▶</button>
      <button class="player-btn" id="storyNext" aria-label="다음 문단" title="다음 문단">⏭</button>
      <span class="story-player-pos muted" id="storyPos">${cur}/${total}</span>
      <span class="story-player-state muted" id="storyState">정지</span>
      <span class="story-player-rates" id="storyRateRow">
        ${STORY_RATE_ALLOWED.map(r => `
          <button class="chip${r === storyRate ? ' active' : ''}" data-rate="${r}" type="button">${r}x</button>
        `).join('')}
      </span>
    </div>
    <p class="muted tts-hint" id="storyTtsHint" style="font-size:10px;margin:2px 0 0;min-height:0"></p>
  `;
  screen.appendChild(player);

  // 핸들러
  player.querySelector('#storyPlayAll').addEventListener('click', () => {
    if (playingMode === 'sequence') {
      stopStoryAudio();
      updatePlayerUi();
      return;
    }
    const start = activeIndex >= 0 ? activeIndex : 0;
    playSequenceFrom(start);
  });
  player.querySelector('#storyPrev').addEventListener('click', () => {
    if (activeIndex <= 0) return;
    if (playingMode === 'sequence') {
      stopStoryAudio();
      activeIndex--;
      playSequenceFrom(activeIndex);
    } else {
      activeIndex--;
      setActiveLine(activeIndex);
      updatePlayerUi();
    }
  });
  player.querySelector('#storyNext').addEventListener('click', () => {
    if (activeIndex + 1 >= total) return;
    if (playingMode === 'sequence') {
      stopStoryAudio();
      activeIndex++;
      playSequenceFrom(activeIndex);
    } else {
      activeIndex++;
      setActiveLine(activeIndex);
      updatePlayerUi();
    }
  });
  player.querySelectorAll('[data-rate]').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = parseFloat(btn.dataset.rate);
      if (!STORY_RATE_ALLOWED.includes(r)) return;
      storyRate = r;
      saveRate(r);
      player.querySelectorAll('[data-rate]').forEach(b => {
        b.classList.toggle('active', parseFloat(b.dataset.rate) === r);
      });
    });
  });

  updatePlayerUi();
}

function updatePlayerUi() {
  const total = (activeStory?.bodyJa || []).length;
  const cur   = Math.max(0, activeIndex) + 1;
  const pos   = document.getElementById('storyPos');
  const state = document.getElementById('storyState');
  const play  = document.getElementById('storyPlayAll');
  if (pos)   pos.textContent = `${cur}/${total}`;
  // 상태 텍스트는 짧게 — compact 폭 유지.
  if (state) state.textContent =
    playingMode === 'sequence' ? '재생' :
    playingMode === 'single'   ? '문단' : '정지';
  if (play) {
    play.textContent = playingMode === 'sequence' ? '⏸' : '▶';
    play.setAttribute('aria-label',
      playingMode === 'sequence' ? '전체 이야기 일시정지' : '전체 이야기 듣기');
    play.setAttribute('title',
      playingMode === 'sequence' ? '일시정지' : '전체 이야기 듣기');
  }
}

// ── active line 표시 ──────────────────────────────────────────────────────
function setActiveLine(idx) {
  const body = document.getElementById('storyBody');
  if (!body) return;
  body.querySelectorAll('.story-line').forEach(el => {
    const i = parseInt(el.dataset.idx, 10);
    const on = i === idx;
    el.classList.toggle('active', on);
    const badge = el.querySelector('.story-line-badge');
    if (badge) badge.hidden = !on || playingMode === 'none';
    if (on && typeof el.scrollIntoView === 'function') {
      try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (_) {}
    }
  });
  // storyProgress.lastIndex 저장 — 0 이상의 유효 인덱스만.
  if (idx >= 0 && activeStory) {
    try { setStoryLastIndex(activeStory.id, idx); } catch (_) {}
  }
}

// ── 재생 헬퍼 ─────────────────────────────────────────────────────────────
export function playSingleLine(idx) {
  const s = activeStory;
  if (!s) return;
  if (idx < 0 || idx >= (s.bodyJa || []).length) return;
  // 전체 재생 중이면 멈추고 single 으로 전환.
  stopStoryAudio();
  playingMode = 'single';
  activeIndex = idx;
  setActiveLine(idx);
  updatePlayerUi();
  speakLine(s.bodyJa[idx], () => {
    if (playingMode === 'single') {
      playingMode = 'none';
      updatePlayerUi();
      // single 끝나면 badge 만 끈다. active highlight 는 유지.
      const body = document.getElementById('storyBody');
      body?.querySelectorAll('.story-line-badge').forEach(b => { b.hidden = true; });
    }
  });
}

export function playSequenceFrom(idx) {
  const s = activeStory;
  if (!s) return;
  if (idx < 0) idx = 0;
  if (idx >= (s.bodyJa || []).length) return stopStoryAudio();
  stopStoryAudio();
  playingMode = 'sequence';
  playCurrentInSequence(idx);
}

function playCurrentInSequence(idx) {
  const s = activeStory;
  if (!s || playingMode !== 'sequence') return;
  activeIndex = idx;
  setActiveLine(idx);
  updatePlayerUi();
  speakLine(s.bodyJa[idx], () => {
    if (playingMode !== 'sequence') return;
    // 마지막 문단이면 정지
    if (idx + 1 >= s.bodyJa.length) {
      playingMode = 'none';
      updatePlayerUi();
      const body = document.getElementById('storyBody');
      body?.querySelectorAll('.story-line-badge').forEach(b => { b.hidden = true; });
      return;
    }
    // pause 후 다음
    clearStoryPauseTimer();
    pauseTimer = setTimeout(() => {
      pauseTimer = null;
      if (playingMode !== 'sequence') return;
      playCurrentInSequence(idx + 1);
    }, STORY_SENTENCE_PAUSE_MS);
  });
}

/** 한 문단을 발음. onEnd 콜백 (단일/연속 모두 사용). */
function speakLine(text, onEnd) {
  speak(text, { rate: storyRate, onEnd })
    .then(r => {
      if (!r || !r.ok) {
        showStoryTtsHint(r);
        // TTS 실패 — 정지 처리. onEnd 도 호출.
        playingMode = 'none';
        updatePlayerUi();
        if (typeof onEnd === 'function') onEnd();
      }
    })
    .catch(() => {
      playingMode = 'none';
      updatePlayerUi();
      if (typeof onEnd === 'function') onEnd();
    });
}

function showStoryTtsHint(r) {
  const hintEl = document.getElementById('storyTtsHint');
  if (!hintEl) return;
  if (r && r.ok) { hintEl.textContent = ''; return; }
  const reason = r && r.reason;
  hintEl.textContent =
    reason === 'no-ja-voice' ? '일본어 TTS 음성을 찾을 수 없습니다.' :
    reason === 'unsupported' ? '이 브라우저는 TTS를 지원하지 않습니다.' :
                                'TTS 를 사용할 수 없습니다.';
}

// ── 테스트 backdoor ──────────────────────────────────────────────────────
/** 테스트 전용 — utterance 종료를 강제로 시뮬레이션. */
export function _simulateLineEnd() {
  // 시퀀스 진행 중이면 다음 문단으로 advance. single 이면 정지.
  if (playingMode === 'sequence') {
    const s = activeStory;
    if (!s) return;
    if (activeIndex + 1 >= s.bodyJa.length) {
      playingMode = 'none';
      updatePlayerUi();
      return;
    }
    clearStoryPauseTimer();
    pauseTimer = setTimeout(() => {
      pauseTimer = null;
      if (playingMode !== 'sequence') return;
      playCurrentInSequence(activeIndex + 1);
    }, STORY_SENTENCE_PAUSE_MS);
  } else if (playingMode === 'single') {
    playingMode = 'none';
    updatePlayerUi();
  }
}

/** 테스트 전용 — 내부 state 노출. */
export function _getStoryPlayerState() {
  return { playingMode, activeIndex, storyRate, currentStoryId, currentTab,
           hasPauseTimer: pauseTimer !== null };
}
