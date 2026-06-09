// 히라가나/가타카나 표 학습 보조 화면.
// - 토글: 히라가나 / 가타카나
// - 기본 50음도 (5열 그리드)
// - 탁음·반탁음·요음은 토글 버튼으로 접기/펴기
// - 각 글자를 누르면 무료 Web Speech API 로 발음 재생, 미지원 시 hint
import { kanaChart } from '../data/kana.js';
import { speak, stopSpeaking } from '../tts.js';
import { escape } from '../ui.js';

let currentScript = 'hiragana';  // 'hiragana' | 'katakana'
let showExtras    = false;        // 탁음/요음 접기

/** 외부 (테스트 / 다른 라우트 진입) 에서 초기 상태 강제. */
export function resetKana() {
  currentScript = 'hiragana';
  showExtras = false;
}

export function renderKanaChart(root) {
  draw(root);
}

function draw(root) {
  root.innerHTML = '';

  // 스크립트 토글
  const tabs = document.createElement('div');
  tabs.className = 'filters';
  for (const [k, lab] of [['hiragana','히라가나'], ['katakana','가타카나']]) {
    const b = document.createElement('button');
    b.className = 'chip' + (currentScript === k ? ' active' : '');
    b.dataset.kana = k;
    b.textContent = lab;
    b.onclick = () => { currentScript = k; draw(root); };
    tabs.appendChild(b);
  }
  root.appendChild(tabs);

  const intro = document.createElement('p');
  intro.className = 'muted';
  intro.style.cssText = 'margin:4px 0 10px;font-size:12px';
  intro.textContent = '각 글자를 누르면 발음을 들을 수 있습니다 (무료 TTS).';
  root.appendChild(intro);

  const baseKey = currentScript === 'hiragana' ? 'hiraganaBase' : 'katakanaBase';
  const dakuKey = currentScript === 'hiragana' ? 'hiraganaDakuten' : 'katakanaDakuten';
  const youKey  = currentScript === 'hiragana' ? 'hiraganaYouon'   : 'katakanaYouon';

  // 기본 50음도
  const baseCard = document.createElement('section');
  baseCard.className = 'card';
  baseCard.innerHTML = `<h2 style="margin:0 0 8px;font-size:14px">${currentScript === 'hiragana' ? '히라가나' : '가타카나'} 기본 50음도</h2>`;
  baseCard.appendChild(buildTable(kanaChart[baseKey], 5));
  root.appendChild(baseCard);

  // 탁음·요음 토글
  const toggle = document.createElement('button');
  toggle.className = 'btn ghost';
  toggle.id = 'kanaExtrasToggle';
  toggle.textContent = showExtras ? '탁음·요음 숨기기' : '탁음·반탁음·요음 보기';
  toggle.style.marginTop = '10px';
  toggle.onclick = () => { showExtras = !showExtras; draw(root); };
  root.appendChild(toggle);

  if (showExtras) {
    const extras = document.createElement('section');
    extras.className = 'card';
    extras.style.marginTop = '10px';
    extras.innerHTML = `<h2 style="margin:0 0 8px;font-size:14px">탁음 / 반탁음</h2>`;
    extras.appendChild(buildTable(kanaChart[dakuKey], 5));
    const youH = document.createElement('h2');
    youH.style.cssText = 'margin:14px 0 8px;font-size:14px';
    youH.textContent = '요음';
    extras.appendChild(youH);
    extras.appendChild(buildTable(kanaChart[youKey], 3));
    root.appendChild(extras);
  }

  // TTS hint (실패 시 표시)
  const hint = document.createElement('p');
  hint.className = 'muted tts-hint';
  hint.id = 'kanaHint';
  hint.style.cssText = 'font-size:11px;margin-top:8px;min-height:1em';
  root.appendChild(hint);
}

function buildTable(rows, cols) {
  const table = document.createElement('div');
  table.className = 'kana-table';
  table.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (const row of rows) {
    for (const cell of row) {
      const el = document.createElement('button');
      if (!cell) {
        el.className = 'kana-cell empty';
        el.setAttribute('aria-hidden', 'true');
        el.tabIndex = -1;
      } else {
        el.className = 'kana-cell';
        el.setAttribute('aria-label', `${cell.ch} (${cell.ro}) 발음 듣기`);
        el.innerHTML = `<div class="ch">${escape(cell.ch)}</div><div class="ro">${escape(cell.ro)}</div>`;
        el.addEventListener('click', async () => {
          stopSpeaking();
          const r = await speak(cell.ch);
          const hintEl = document.querySelector('#kanaHint');
          if (!hintEl) return;
          if (r && r.ok) { hintEl.textContent = ''; return; }
          const reason = r && r.reason;
          hintEl.textContent =
            reason === 'no-ja-voice' ? '일본어 TTS 음성을 찾을 수 없습니다.' :
            reason === 'unsupported' ? '이 브라우저는 TTS를 지원하지 않습니다.' :
                                        'TTS 를 사용할 수 없습니다.';
        });
      }
      table.appendChild(el);
    }
  }
  return table;
}
