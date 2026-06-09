// 설정 화면 — 톱니바퀴 버튼에서 진입.
// 라우트: #settings
//
// 항목:
//   - 후리가나 표시 ON/OFF
//   - 이미지 카드 단계형 학습 ON/OFF
//   - 회상 시간 3 / 5 / 7 초
//   - 목표 레벨 N5 / N4 / N3 / N2
//
// 데이터 초기화 같은 위험한 액션은 이번 버전에 포함하지 않는다.

import { getState } from '../storage.js';
import {
  getFuriganaEnabled, setFuriganaEnabled,
  getVocabWarmupEnabled, setVocabWarmupEnabled,
  getVocabRecallSeconds, setVocabRecallSeconds,
  setLevel,
} from '../state.js';
import { showToast, renderLevelPill } from '../ui.js';

const LEVELS = ['N5', 'N4', 'N3', 'N2'];

export function renderSettings({ screen }) {
  document.getElementById('topTitle').textContent = '설정';
  draw(screen);
}

function draw(screen) {
  const level   = getState().userProgress.targetLevel || 'N5';
  const furi    = getFuriganaEnabled();
  const warmup  = getVocabWarmupEnabled();
  const recall  = getVocabRecallSeconds();

  screen.innerHTML = `
    <section class="card" id="settingsPanel">
      <h2 style="margin:0 0 10px;font-size:15px">설정</h2>

      <label class="settings-row" style="display:flex;align-items:center;gap:10px;margin:6px 0;flex-wrap:wrap;cursor:pointer">
        <input type="checkbox" id="furiToggle" ${furi ? 'checked' : ''} style="margin:0">
        <span style="flex:1;font-size:13px">후리가나 표시</span>
        <span class="muted" style="font-size:11px">한자 위 읽기 보조</span>
      </label>

      <label class="settings-row" style="display:flex;align-items:center;gap:10px;margin:6px 0;flex-wrap:wrap;cursor:pointer">
        <input type="checkbox" id="warmupToggle" ${warmup ? 'checked' : ''} style="margin:0">
        <span style="flex:1;font-size:13px">이미지 카드 단계형 학습</span>
        <span class="muted" style="font-size:11px">노출 → 회상 → 확인 → 퀴즈</span>
      </label>

      <div class="settings-row" style="display:flex;align-items:center;gap:10px;margin:8px 0;flex-wrap:wrap">
        <span style="flex:0 0 auto;font-size:13px">회상 시간</span>
        <div id="recallSeg" class="filters" style="margin:0;flex:1 1 auto">
          ${[3, 5, 7].map(n => `
            <button class="chip${recall === n ? ' active' : ''}" data-recall="${n}" type="button">${n}초</button>
          `).join('')}
        </div>
      </div>

      <div class="settings-row" style="display:flex;align-items:center;gap:10px;margin:8px 0;flex-wrap:wrap">
        <span style="flex:0 0 auto;font-size:13px">목표 레벨</span>
        <div id="levelSeg" class="filters" style="margin:0;flex:1 1 auto">
          ${LEVELS.map(L => `
            <button class="chip${level === L ? ' active' : ''}" data-level="${L}" type="button">${L}</button>
          `).join('')}
        </div>
      </div>

      <p class="muted" style="margin:10px 0 0;font-size:11px">
        설정은 자동 저장됩니다 · 데이터 초기화는 추후 별도 화면에서 제공 예정
      </p>
    </section>
  `;

  // ── handlers ──
  screen.querySelector('#furiToggle').addEventListener('change', (e) => {
    const v = setFuriganaEnabled(e.target.checked);
    showToast(v ? '후리가나 표시 ON' : '후리가나 표시 OFF');
  });
  screen.querySelector('#warmupToggle').addEventListener('change', (e) => {
    const v = setVocabWarmupEnabled(e.target.checked);
    showToast(v ? '단계형 학습 ON' : '단계형 학습 OFF');
  });
  screen.querySelectorAll('#recallSeg [data-recall]').forEach(btn => {
    btn.addEventListener('click', () => {
      const n = parseInt(btn.dataset.recall, 10);
      const applied = setVocabRecallSeconds(n);
      screen.querySelectorAll('#recallSeg [data-recall]').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.recall, 10) === applied);
      });
      showToast(`회상 시간 ${applied}초`);
    });
  });
  screen.querySelectorAll('#levelSeg [data-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      const L = btn.dataset.level;
      setLevel(L);
      screen.querySelectorAll('#levelSeg [data-level]').forEach(b => {
        b.classList.toggle('active', b.dataset.level === L);
      });
      // 상단 레벨 핀 갱신
      try { renderLevelPill(); } catch (_) {}
      showToast(`목표 레벨 ${L}`);
    });
  });
}
