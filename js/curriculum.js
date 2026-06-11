// 하루 10분 큐레이터: 규칙 기반. AI/외부 API 없음.
// 비율: 복습 40%, 새 단어 25%, 문법 15%, 독해/청해 20%
// 3일 이상 학습 안했으면 복습 비중 증가, 자주 볼 단어 1개 섞기.
// 타입별 데이터가 부족하면 다른 타입으로 보충해 TARGET_COUNT 에 최대한 근접시킨다.
import { vocab } from './data/vocab.js';
import { grammar } from './data/grammar.js';
import { reading } from './data/reading.js';
import { listening } from './data/listening.js';
import { getState, daysBetween, todayKey } from './storage.js';
import { getDueItems } from './srs.js';
import { classifyContentReadiness } from './contentReadiness.js';

const TARGET_COUNT = 10;

function byLevelOrEasier(items, level) {
  const order = ['N5','N4','N3','N2'];
  const idx = order.indexOf(level);
  const allowed = new Set(order.slice(0, idx + 1));
  return items.filter(i => allowed.has(i.level));
}

function shuffled(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

function pickReview(count, excludeIds) {
  const state = getState();
  const dueItems = getDueItems();
  const failureIds = new Set(Object.keys(state.failureNotes));
  const ex = excludeIds || new Set();
  const sorted = dueItems
    .filter(d => !ex.has(d.itemId))
    .sort((a, b) => {
      const af = failureIds.has(a.itemId) ? 1 : 0;
      const bf = failureIds.has(b.itemId) ? 1 : 0;
      if (af !== bf) return bf - af;
      return a.dueAt - b.dueAt;
    });
  return sorted.slice(0, count).map(x => ({ itemType: x.itemType, itemId: x.itemId, source: 'review' }));
}

function pickNew(itemType, list, level, count, excludeIds) {
  if (count <= 0) return [];
  const state = getState();
  const seen = new Set(Object.keys(state.reviewStates));
  const ex = excludeIds || new Set();
  const fresh = byLevelOrEasier(list, level).filter(i => !seen.has(i.id) && !ex.has(i.id));
  // 신규가 없으면 이미 본 항목 중에서 채움 (복습 효과)
  const pool = fresh.length > 0 ? fresh : byLevelOrEasier(list, level).filter(i => !ex.has(i.id));
  // 독해/청해는 학습 준비도가 높은(ready/good_next) 항목을 우선 배치 (라운드 29).
  //   그룹 내에서는 기존처럼 셔플 — 준비도가 전부 낮아도 fallback 으로 큐는 채워진다.
  if (itemType === 'reading' || itemType === 'listening') {
    const rs = state.reviewStates || {};
    const groups = { ready: [], good_next: [], locked: [] };
    for (const i of pool) groups[classifyContentReadiness(i, rs)].push(i);
    const ordered = [...shuffled(groups.ready), ...shuffled(groups.good_next), ...shuffled(groups.locked)];
    return ordered.slice(0, count).map(i => ({ itemType, itemId: i.id, source: 'new' }));
  }
  return shuffled(pool).slice(0, count).map(i => ({ itemType, itemId: i.id, source: 'new' }));
}

function pickFavorite(count, excludeIds) {
  // "자주 볼 단어" — vocab favorite 만 오늘 큐에 섞는다.
  // 구버전 데이터에 들어 있는 비단어 즐겨찾기는 무시.
  const s = getState();
  const ex = excludeIds || new Set();
  const favs = Object.entries(s.favorites)
    .filter(([id, v]) => v.itemType === 'vocab' && !ex.has(id))
    .map(([itemId, v]) => ({ itemType: v.itemType, itemId, source: 'favorite' }));
  return shuffled(favs).slice(0, count);
}

function pushItems(queue, used, items) {
  for (const it of items) {
    if (!used.has(it.itemId)) {
      queue.push(it);
      used.add(it.itemId);
    }
  }
}

export function buildTodayQueue() {
  const s = getState();
  const level = s.userProgress.targetLevel || 'N5';
  const last = s.userProgress.lastStudiedDate;
  const today = todayKey();
  const idleDays = last ? Math.abs(daysBetween(last, today)) : 99;

  // 비율 결정
  let ratios = { review: 0.4, newVocab: 0.25, grammar: 0.15, rc: 0.2 };
  if (idleDays >= 3) {
    ratios = { review: 0.6, newVocab: 0.15, grammar: 0.1, rc: 0.15 };
  }
  const dueCount = getDueItems().length;
  if (dueCount === 0) {
    ratios = { review: 0, newVocab: 0.5, grammar: 0.25, rc: 0.25 };
  }

  const n = TARGET_COUNT;
  const slots = {
    review:   Math.round(n * ratios.review),
    newVocab: Math.round(n * ratios.newVocab),
    grammar:  Math.round(n * ratios.grammar),
    rc:       Math.round(n * ratios.rc),
  };
  let total = slots.review + slots.newVocab + slots.grammar + slots.rc;
  while (total < n) { slots.newVocab++; total++; }
  while (total > n) { slots.newVocab = Math.max(0, slots.newVocab - 1); total--; }

  const queue = [];
  const used = new Set();

  // 1차: 비율에 따라 슬롯 채우기
  pushItems(queue, used, pickReview(slots.review, used));
  pushItems(queue, used, pickNew('vocab', vocab, level, slots.newVocab, used));
  pushItems(queue, used, pickNew('grammar', grammar, level, slots.grammar, used));

  const rcHalf = Math.ceil(slots.rc / 2);
  pushItems(queue, used, pickNew('reading', reading, level, rcHalf, used));
  pushItems(queue, used, pickNew('listening', listening, level, slots.rc - rcHalf, used));

  // 자주 볼 단어 1개 (있다면)
  pushItems(queue, used, pickFavorite(1, used));

  // 2차: 타입별 데이터 부족으로 빈 슬롯이 생긴 경우 다른 소스로 보충.
  // 우선순위: 추가 복습 → 추가 청해 → 추가 독해 → 추가 문법 → 추가 단어 → 자주 볼.
  // 마지막에는 전체 풀(필터 없음)에서라도 채워 가능한 한 TARGET_COUNT 에 도달한다.
  const fillers = [
    () => pickReview(n - queue.length, used),
    () => pickNew('listening', listening, level, n - queue.length, used),
    () => pickNew('reading',   reading,   level, n - queue.length, used),
    () => pickNew('grammar',   grammar,   level, n - queue.length, used),
    () => pickNew('vocab',     vocab,     level, n - queue.length, used),
    () => pickFavorite(n - queue.length, used),
  ];
  for (const f of fillers) {
    if (queue.length >= n) break;
    pushItems(queue, used, f());
  }

  // 마지막 보루: 레벨 필터 무시하고 데이터셋 전체에서 모자란 만큼 끌어옴.
  if (queue.length < n) {
    const allLevels = 'N2';
    const finalFillers = [
      () => pickNew('vocab',     vocab,     allLevels, n - queue.length, used),
      () => pickNew('grammar',   grammar,   allLevels, n - queue.length, used),
      () => pickNew('reading',   reading,   allLevels, n - queue.length, used),
      () => pickNew('listening', listening, allLevels, n - queue.length, used),
    ];
    for (const f of finalFillers) {
      if (queue.length >= n) break;
      pushItems(queue, used, f());
    }
  }

  const final = queue.slice(0, n);

  // 단어 슬롯의 학습 모드 분배: 70% 이미지 카드 / 30% 예문 문제 (반올림).
  // vocab 가 아닌 항목은 vocabMode 미설정 — today.js 가 image 분기에서만 vocabCardView 로 라우팅.
  const vocabIdx = final
    .map((it, i) => it.itemType === 'vocab' ? i : -1)
    .filter(i => i >= 0);
  if (vocabIdx.length > 0) {
    const exampleN = Math.max(0, Math.round(vocabIdx.length * 0.3));
    const exampleSet = new Set(shuffled(vocabIdx).slice(0, exampleN));
    for (const i of vocabIdx) {
      final[i].vocabMode = exampleSet.has(i) ? 'example' : 'image';
    }
  }
  return final;
}

/**
 * @param {Array} [queue] — 이미 만들어진 오늘의 큐. 미지정 시 새로 생성한다.
 *   today.js 처럼 같은 큐로 미리보기와 실제 학습이 일치해야 하는 곳은 큐를 넘겨라.
 */
export function previewBreakdown(queue) {
  const q = queue || buildTodayQueue();
  const grouped = { review: 0, vocab: 0, grammar: 0, reading: 0, listening: 0, favorite: 0 };
  q.forEach(it => {
    if (it.source === 'review') grouped.review++;
    else if (it.source === 'favorite') grouped.favorite++;
    else grouped[it.itemType]++;
  });
  return { total: q.length, ...grouped };
}
