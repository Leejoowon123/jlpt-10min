// 회화 연습 뷰 (0.1 프로토타입).
//   list    — 주제 목록 + 준비도 + 시작/미리보기 버튼
//   topic   — 질문 → TTS 재생 / 한국어 토글 → 텍스트 답변 → 평가 결과
//   summary — 평균 점수 + 다시 / 목록 이동
import { getConversationReadiness } from '../conversationReadiness.js';
import { createEngine } from '../conversationEngine.js';
import { getState } from '../storage.js';
import { speak, stopSpeaking, ttsAvailable } from '../tts.js';
import { sttAvailable, createSttSession } from '../stt.js';
import {
  recordConversationAttempt, markConversationCompleted, getConversationProgress,
} from '../state.js';
import { escape } from '../ui.js';
import { renderJa } from '../furigana.js';

let mode = 'list';            // 'list' | 'topic' | 'summary'
let engine = null;            // createEngine 인스턴스
let lastEvaluation = null;    // 직전 평가 결과
let answerInputValue = '';    // 입력 textarea 값 임시 보존
let sttSession = null;        // 진행 화면에서만 살아 있는 STT 핸들

/** 외부(테스트/탭 진입)에서 강제로 초기 상태로 되돌릴 때 사용. */
export function resetConversation() {
  if (sttSession) { try { sttSession.stop(); } catch {} sttSession = null; }
  mode = 'list';
  engine = null;
  lastEvaluation = null;
  answerInputValue = '';
}

export function renderConversation({ screen, params }) {
  document.getElementById('topTitle').textContent = '회화 연습';
  // params[0] === 'list' 면 강제 초기화.
  if (params && params[0] === 'list') resetConversation();

  if (mode === 'topic' && engine)    return drawTopic(screen);
  if (mode === 'summary' && engine)  return drawSummary(screen);
  mode = 'list';
  drawList(screen);
}

// ────────────────────────────────────────────────────────────────────────────
function drawList(screen) {
  const s = getState();
  const level = s.userProgress.targetLevel || 'N5';
  const items = getConversationReadiness(level);
  screen.innerHTML = '';

  const intro = document.createElement('div');
  intro.className = 'card';
  intro.style.padding = '12px 14px';
  intro.innerHTML = `
    <h2 style="margin:0;font-size:14px">회화 연습 <span class="muted" style="font-weight:400;font-size:12px">· ${level}</span></h2>
    <p class="muted" style="margin:4px 0 0;font-size:12px">텍스트 입력 · 무료 TTS · 규칙 기반 평가 (0.1 프로토타입)</p>
  `;
  screen.appendChild(intro);

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.innerHTML = `<div class="e-icon">📭</div>이 레벨엔 회화 주제가 없습니다.`;
    screen.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'list';
  for (const it of items) {
    const row = document.createElement('div');
    row.className = 'row conv-row';
    const status = it.ready ? '준비 완료' : '학습 필요';
    const statusCls = it.ready ? 'good' : 'warn';
    const stored = getConversationProgress(it.topicId);
    const scoreLine = stored
      ? `<div class="s">최근 ${stored.lastScore}점 · 최고 ${stored.bestScore}점 · 완료 ${stored.completedCount}회</div>`
      : '';
    // sentenceBank 커버리지 — 회화 미리보기 정보.
    const sentLine = (typeof it.relatedSentenceCount === 'number')
      ? `<div class="s">관련 문장 ${it.relatedSentenceCount}개 · 학습 ${it.knownSentenceCount}개${
           it.partialSentenceCount ? ` · 일부 ${it.partialSentenceCount}개` : ''
         }</div>`
      : '';
    row.innerHTML = `
      <div class="main">
        <div class="t">
          ${escape(it.titleKo)}
          <span class="badge ${statusCls}">${status}</span>
        </div>
        <div class="s">준비도 ${it.percent}% · 단어 ${it.vocabKnown}/${it.vocabTotal} · 문법 ${it.grammarKnown}/${it.grammarTotal}</div>
        ${sentLine}
        ${scoreLine}
        <div class="bar" style="margin-top:6px;height:4px"><div style="width:${it.percent}%"></div></div>
      </div>
      <div class="actions" style="flex-direction:column;gap:4px">
        <button class="icon-btn" data-act="start" title="시작" ${it.ready ? '' : 'disabled'}>▶</button>
        <button class="icon-btn" data-act="preview" title="연습 미리보기">👁</button>
      </div>
    `;
    row.querySelector('[data-act="start"]').addEventListener('click', () => {
      if (!it.ready) return;
      startTopic(it.topicId, screen);
    });
    row.querySelector('[data-act="preview"]').addEventListener('click', () => {
      // 준비도 무시하고 미리보기 — 학습 확인용.
      startTopic(it.topicId, screen);
    });
    list.appendChild(row);
  }
  screen.appendChild(list);
}

// ────────────────────────────────────────────────────────────────────────────
function startTopic(topicId, screen) {
  engine = createEngine(topicId);
  if (!engine) return;
  mode = 'topic';
  lastEvaluation = null;
  answerInputValue = '';
  drawTopic(screen);
}

function drawTopic(screen) {
  if (!engine) { mode = 'list'; return drawList(screen); }
  if (engine.isDone()) { mode = 'summary'; return drawSummary(screen); }
  const q = engine.currentQuestion();
  if (!q) { mode = 'summary'; return drawSummary(screen); }

  screen.innerHTML = '';

  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.textContent = '← 주제 목록';
  back.style.marginBottom = '10px';
  back.onclick = () => {
    stopSpeaking();
    engine = null;
    mode = 'list';
    drawList(screen);
  };
  screen.appendChild(back);

  const qCard = document.createElement('div');
  qCard.className = 'card';
  qCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span class="badge">${engine.topic.level} ${escape(engine.topic.titleKo)}</span>
      <span class="muted">${engine.currentIndex() + 1} / ${engine.totalQuestions()}</span>
    </div>
    <div class="q-prompt" style="margin-top:10px" id="qJa">${renderJa(q.ja, q.readings || [])}</div>
    <div class="muted q-ko" id="qKo" hidden style="font-size:13px;margin-top:-6px">${escape(q.ko)}</div>
    <div class="btn-row" style="margin-top:8px">
      <button class="btn" id="playBtn">▶ 듣기</button>
      <button class="btn ghost" id="toggleKo">한국어 보기</button>
    </div>
    <div class="muted" id="ttsHintConv" style="font-size:11px;margin-top:6px;display:none"></div>
  `;
  screen.appendChild(qCard);

  const ansCard = document.createElement('div');
  ansCard.className = 'card';
  const sttSupported = sttAvailable();
  ansCard.innerHTML = `
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--accent-2)">내 답변 (일본어)</h3>
    <textarea id="answerInput" rows="3" placeholder="ここに日本語で答えてください…"
      class="conv-input"></textarea>
    <div class="muted" id="micStatus" style="font-size:11px;margin-top:4px">
      ${sttSupported
        ? '🎤 음성 입력 사용 가능 (마이크 권한 필요 · 오프라인 보장 없음)'
        : '음성 입력 미지원 · 텍스트로 입력하세요.'}
    </div>
    <div class="btn-row" style="margin-top:10px">
      ${sttSupported ? '<button class="btn" id="micBtn">🎤 음성 입력</button>' : ''}
      <button class="btn primary" id="submitBtn">제출</button>
    </div>
  `;
  screen.appendChild(ansCard);

  const resultBox = document.createElement('div');
  resultBox.id = 'evalResult';
  screen.appendChild(resultBox);

  // 직전에 평가했던 결과가 살아 있으면 다시 그려 둠 (다음 질문으로 넘어가지 않은 채 되돌아왔을 때).
  if (lastEvaluation) showEvaluation(resultBox, lastEvaluation);

  // ── handlers ──
  qCard.querySelector('#playBtn').addEventListener('click', async () => {
    const r = await speak(q.ja);
    if (!r.ok) {
      const hint = qCard.querySelector('#ttsHintConv');
      hint.style.display = 'block';
      hint.textContent = r.reason === 'no-ja-voice'
        ? '일본어 TTS 음성을 찾을 수 없습니다.'
        : 'TTS 를 사용할 수 없습니다.';
    }
  });
  qCard.querySelector('#toggleKo').addEventListener('click', () => {
    const ko = qCard.querySelector('#qKo');
    ko.hidden = !ko.hidden;
  });

  const input = ansCard.querySelector('#answerInput');
  input.value = answerInputValue;
  input.addEventListener('input', () => { answerInputValue = input.value; });

  // ── 마이크 토글 (STT 지원 시) ──
  const micBtn = ansCard.querySelector('#micBtn');
  const micStatus = ansCard.querySelector('#micStatus');
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (sttSession && sttSession.isListening?.()) {
        try { sttSession.stop(); } catch {}
        sttSession = null;
        micBtn.textContent = '🎤 음성 입력';
        return;
      }
      sttSession = createSttSession({
        lang: 'ja-JP',
        onResult: ({ interim, final, isFinal }) => {
          if (isFinal && final) {
            input.value = (input.value ? input.value + ' ' : '') + final;
            answerInputValue = input.value;
            micStatus.textContent = '🎤 인식 완료 — 텍스트를 확인하고 수정하세요.';
          } else if (interim) {
            micStatus.textContent = `🎤 듣는 중… ${interim}`;
          }
        },
        onError: (e) => {
          const map = {
            'not-allowed':           '마이크 권한이 거부되었습니다.',
            'service-not-allowed':   '음성 인식 서비스가 차단되었습니다.',
            'no-speech':             '음성을 인식하지 못했습니다.',
            'network':               '네트워크 문제로 인식이 실패했습니다.',
            'audio-capture':         '마이크를 찾을 수 없습니다.',
            'language-not-supported':'일본어 인식을 지원하지 않습니다.',
            'aborted':               '음성 입력이 중단되었습니다.',
            'start-failed':          '음성 입력을 시작할 수 없습니다.',
          };
          micStatus.textContent = (map[e.reason] || '음성 인식 실패.') + ' 텍스트로 입력해도 됩니다.';
          if (micBtn) micBtn.textContent = '🎤 음성 입력';
          sttSession = null;
        },
        onEnd: () => {
          if (micBtn) micBtn.textContent = '🎤 음성 입력';
        },
      });
      if (!sttSession.ok) {
        micStatus.textContent = '음성 입력 미지원 · 텍스트로 입력하세요.';
        sttSession = null;
        return;
      }
      sttSession.start();
      micBtn.textContent = '⏹ 듣기 중지';
      micStatus.textContent = '🎤 듣는 중…';
    });
  }

  ansCard.querySelector('#submitBtn').addEventListener('click', () => {
    // 진행 중인 STT 가 있으면 정리.
    if (sttSession) { try { sttSession.stop(); } catch {} sttSession = null; }
    const text = input.value;
    const result = engine.submitAnswer(text);
    lastEvaluation = result;
    // 진행 저장 — topic 별 attempts 누적.
    recordConversationAttempt(engine.topic.id, {
      questionJa: q.ja,
      userText: text,
      score: result?.score ?? 0,
      ok: !!result?.ok,
    });
    showEvaluation(resultBox, result);
  });
}

function showEvaluation(box, result) {
  if (!result) { box.innerHTML = ''; return; }
  box.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';
  const score = result.score || 0;
  const verdict = result.ok ? '✅ 표현 적합' : (score >= 50 ? '⚠️ 부분 적합' : '❌ 다시 시도');

  const usedHtml = result.usedVocab.length === 0
    ? '<span class="muted">없음</span>'
    : result.usedVocab.map(v => `<span class="badge">${escape(v.word)} (${escape(v.reading)})</span>`).join(' ');
  const detectedHtml = result.detectedPatterns.length === 0
    ? '<span class="muted">없음</span>'
    : result.detectedPatterns.map(p => `<span class="badge good">${escape(p)}</span>`).join(' ');
  const missingHtml = result.missingPatterns.length === 0
    ? '<span class="muted">없음</span>'
    : result.missingPatterns.map(p => `<span class="badge warn">${escape(p)}</span>`).join(' ');
  const hintsHtml = result.hints.length === 0
    ? ''
    : `<ul style="margin:6px 0;padding-left:18px">${
        result.hints.map(h =>
          `<li>${escape(h.ko)}${h.exampleJa ? ` <span class="muted">예: ${escape(h.exampleJa)}</span>` : ''}</li>`
        ).join('')
      }</ul>`;
  const sampleHtml = result.sampleAnswer
    ? `<p style="margin:6px 0"><strong>모범 답안</strong>: ${renderJa(result.sampleAnswer.ja)}<br>
       <span class="muted">${escape(result.sampleAnswer.ko)}</span></p>`
    : '';

  // sentenceBank 기반 추천 — 학습한 표현
  const knownSentHtml = result.knownSampleSentence
    ? `<div class="sb-known" style="margin:10px 0;padding:8px 10px;border-radius:8px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.3)">
         <p style="margin:0 0 4px;font-size:12px;color:var(--good);font-weight:700">배운 표현으로 답하기</p>
         <p style="margin:0">${renderJa(result.knownSampleSentence.ja)}<br>
            <span class="muted">${escape(result.knownSampleSentence.ko)}</span></p>
       </div>`
    : `<p class="muted sb-known-empty" style="margin:10px 0;font-size:12px">
         배운 표현으로 답하기 — 이 주제에 학습한 표현이 더 필요합니다.
       </p>`;

  // 관련 표현 더 보기 (최대 3개, locked 제외)
  const practiceList = (result.relatedPracticeSentences || []).slice(0, 3);
  const practiceHtml = practiceList.length > 0
    ? `<div class="sb-practice" style="margin-top:10px">
         <p style="margin:0 0 6px;font-size:12px"><strong>관련 표현 더 보기</strong></p>
         ${practiceList.map(s => {
           const cls = s.status === 'known' ? 'good' : 'warn';
           const lbl = s.status === 'known' ? '학습함' : '일부 학습';
           return `<div style="margin:4px 0;font-size:13px;line-height:1.45">
             <span class="badge ${cls}">${lbl}</span>
             ${renderJa(s.ja)} <span class="muted">— ${escape(s.ko)}</span>
           </div>`;
         }).join('')}
         ${(result.lockedSentenceCount || 0) > 0
           ? `<p class="muted" style="margin:6px 0 0;font-size:11px">잠긴 표현 ${result.lockedSentenceCount}개 — 어휘/문법 학습 후 열림</p>`
           : ''}
       </div>`
    : ((result.lockedSentenceCount || 0) > 0
        ? `<p class="muted" style="margin:10px 0 0;font-size:11px">관련 잠긴 표현 ${result.lockedSentenceCount}개 — 어휘/문법 학습 후 열림</p>`
        : '');

  card.innerHTML = `
    <h3 style="margin:0 0 6px;font-size:13px;color:var(--accent-2)">평가 결과</h3>
    <p style="margin:0"><strong>${verdict}</strong> · 점수 ${score}/100</p>
    <div class="bar" style="margin:6px 0 12px"><div style="width:${score}%"></div></div>
    <p style="margin:6px 0 4px;font-size:13px"><strong>사용한 학습 단어</strong></p>
    <div>${usedHtml}</div>
    <p style="margin:10px 0 4px;font-size:13px"><strong>감지된 문법 패턴</strong></p>
    <div>${detectedHtml}</div>
    <p style="margin:10px 0 4px;font-size:13px"><strong>부족한 표현</strong></p>
    <div>${missingHtml}</div>
    ${hintsHtml ? `<p style="margin:10px 0 4px;font-size:13px"><strong>교정 힌트</strong></p>${hintsHtml}` : ''}
    ${sampleHtml ? `<div class="explain" style="margin-top:10px">${sampleHtml}</div>` : ''}
    ${knownSentHtml}
    ${practiceHtml}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn primary" id="nextQBtn">다음 질문 →</button>
    </div>
  `;
  box.appendChild(card);
  card.querySelector('#nextQBtn').addEventListener('click', () => {
    engine.next();
    if (engine.isDone()) {
      // 마지막 질문 직후 정확히 1회 완료 카운트 증가 (다시 그릴 때 중복 증가 방지).
      markConversationCompleted(engine.topic.id);
      mode = 'summary';
      drawSummary(document.getElementById('screen'));
    } else {
      answerInputValue = '';
      lastEvaluation = null;
      drawTopic(document.getElementById('screen'));
    }
  });
}

// ────────────────────────────────────────────────────────────────────────────
function drawSummary(screen) {
  if (!engine) { mode = 'list'; return drawList(screen); }
  const s = engine.summary();
  const stored = getConversationProgress(engine.topic.id);
  const bestScore = stored?.bestScore ?? s.averageScore;
  const completedCount = stored?.completedCount ?? 1;
  screen.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';
  card.style.textAlign = 'center';
  card.innerHTML = `
    <div style="font-size:42px">🗣</div>
    <h2 style="margin:6px 0 4px">회화 연습 완료</h2>
    <p class="muted" style="margin:0">주제: ${escape(s.titleKo)}</p>
    <p class="muted" style="margin:4px 0 4px">
      이번 회차 평균 점수
      <strong style="color:var(--accent-2)">${s.averageScore}</strong>
      · ${s.totalAnswered} / ${s.totalQuestions} 문항
    </p>
    <p class="muted" style="margin:0 0 10px;font-size:12px">
      최고 점수 <strong>${bestScore}</strong> · 완료 ${completedCount}회
    </p>
    <div class="btn-row">
      <button class="btn" id="againBtn">다시 시작</button>
      <button class="btn primary" id="listBtn">주제 목록</button>
    </div>
  `;
  screen.appendChild(card);
  card.querySelector('#againBtn').addEventListener('click', () => {
    const topicId = engine.topic.id;
    engine = null;
    startTopic(topicId, screen);
  });
  card.querySelector('#listBtn').addEventListener('click', () => {
    engine = null;
    mode = 'list';
    drawList(screen);
  });
}
