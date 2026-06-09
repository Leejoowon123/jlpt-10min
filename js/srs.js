// 단순화된 SM-2 류 SRS. interval(일), ease, dueAt(ms epoch).
import { getState, update } from './storage.js';

export function getReviewState(itemId, itemType) {
  const s = getState();
  return s.reviewStates[itemId] || {
    itemType, correctCount: 0, wrongCount: 0,
    dueAt: 0, interval: 0, ease: 2.5,
  };
}

export function recordResult(itemId, itemType, correct) {
  update(s => {
    const cur = s.reviewStates[itemId] || {
      itemType, correctCount: 0, wrongCount: 0,
      dueAt: 0, interval: 0, ease: 2.5,
    };
    if (correct) {
      cur.correctCount++;
      if (cur.interval <= 0) cur.interval = 1;
      else if (cur.interval === 1) cur.interval = 3;
      else cur.interval = Math.round(cur.interval * cur.ease);
      cur.ease = Math.min(2.8, cur.ease + 0.05);
    } else {
      cur.wrongCount++;
      cur.interval = 1;
      cur.ease = Math.max(1.3, cur.ease - 0.2);

      // 실패 노트 자동 등록
      const fn = s.failureNotes[itemId] || { itemType, wrongCount: 0, lastWrongAt: 0, reason: '' };
      fn.wrongCount += 1;
      fn.lastWrongAt = Date.now();
      s.failureNotes[itemId] = fn;
    }
    cur.dueAt = Date.now() + cur.interval * 86400000;
    s.reviewStates[itemId] = cur;
  });
}

export function getDueItems(now = Date.now()) {
  const s = getState();
  return Object.entries(s.reviewStates)
    .filter(([, st]) => st.dueAt && st.dueAt <= now)
    .map(([itemId, st]) => ({ itemId, ...st }));
}

export function getDueCount() {
  return getDueItems().length;
}
