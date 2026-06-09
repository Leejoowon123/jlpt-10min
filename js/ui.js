// 공용 UI 유틸 — 토스트, 레벨 셀렉터.
import { getState, update } from './storage.js';
import { setLevel } from './state.js';

let toastTimer = null;
export function showToast(message) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  if (toastTimer) clearTimeout(toastTimer);
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = message;
  document.body.appendChild(t);
  toastTimer = setTimeout(() => t.remove(), 1800);
}

export function renderLevelPill() {
  const pill = document.getElementById('levelPill');
  if (!pill) return;
  const s = getState();
  pill.textContent = s.userProgress.targetLevel || 'N5';
  pill.onclick = () => {
    const order = ['N5','N4','N3','N2'];
    const cur = s.userProgress.targetLevel || 'N5';
    const next = order[(order.indexOf(cur) + 1) % order.length];
    setLevel(next);
    renderLevelPill();
    showToast(`목표 레벨: ${next}`);
    // 현재 화면 새로고침
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };
}

export function escape(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

/** 학습 영역 한국어 라벨 — 뱃지/요약 등 여러 뷰에서 재사용. */
export function typeLabel(itemType) {
  return { vocab:'단어', grammar:'문법', reading:'독해', listening:'청해' }[itemType] || '';
}
