// 무료 TTS: Web Speech API. 미지원 환경에서는 안전 폴백.
//
// 라운드 30 — 음성 감지 안정화 (voice manager):
//   브라우저가 설치된 음성 목록을 늦게(비동기로) 불러오는 경우가 많아
//   getVoices() 를 한 번만 보고 판단하면 "설치했는데 감지 안 됨" 이 생긴다.
//   대응: 즉시 확인 + voiceschanged 이벤트 + 짧은 재시도 루프 + 수동 refresh + 캐시.
//   일본어 voice 가 없어도 흐름은 막지 않는다 (호출부가 스크립트/텍스트 폴백).

let cachedVoice = null;          // 감지된 일본어 voice (찾으면 캐시)
let voiceStatus = 'detecting';   // 'detecting' | 'ja-found' | 'no-ja' | 'unsupported'
let detectPromise = null;        // 진행 중인 감지 루프
let listenersBound = false;
const statusSubscribers = new Set();

// 재시도 간격(ms) — 합계 ~3.8초. voiceschanged 가 먼저 오면 즉시 종료.
const DEFAULT_RETRY_DELAYS = [0, 250, 500, 1000, 2000];
let RETRY_DELAYS = DEFAULT_RETRY_DELAYS;
/** 테스트 전용 — 재시도 지연 단축. */
export function _setRetryDelaysForTest(arr) { RETRY_DELAYS = arr; }
export function _resetRetryDelaysForTest() { RETRY_DELAYS = DEFAULT_RETRY_DELAYS; }

export function ttsAvailable() {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof SpeechSynthesisUtterance !== 'undefined';
}

/** 일본어 voice 판정 — lang(ja/ja-JP) 우선, name(Japanese/Japan/日本) 보조. */
export function isJaVoice(v) {
  if (!v) return false;
  if (/^ja([-_]|$)/i.test(v.lang || '')) return true;
  return /japanese|japan|日本/i.test(v.name || '');
}

function findJaVoice() {
  if (!ttsAvailable()) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  return voices.find(v => /ja[-_]?JP/i.test(v.lang || ''))
    || voices.find(v => /^ja/i.test(v.lang || ''))
    || voices.find(v => isJaVoice(v))
    || null;
}

function setStatus(next) {
  if (voiceStatus === next) return;
  voiceStatus = next;
  for (const cb of statusSubscribers) { try { cb(next); } catch {} }
}

function bindVoicesChanged() {
  if (listenersBound || !ttsAvailable()) return;
  listenersBound = true;
  const synth = window.speechSynthesis;
  const onChange = () => {
    const v = findJaVoice();
    if (v) { cachedVoice = v; setStatus('ja-found'); }
  };
  // addEventListener 우선 (덮어쓰기 없음), 없으면 onvoiceschanged 폴백.
  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', onChange);
  } else {
    try { synth.onvoiceschanged = onChange; } catch {}
  }
}

/**
 * 감지 루프 — 즉시 확인 후 RETRY_DELAYS 간격으로 재시도.
 * voiceschanged 리스너가 먼저 찾으면 루프는 조기 종료된다.
 */
function detectLoop() {
  if (!ttsAvailable()) { setStatus('unsupported'); return Promise.resolve(null); }
  if (detectPromise) return detectPromise;
  bindVoicesChanged();
  setStatus(cachedVoice ? 'ja-found' : 'detecting');
  detectPromise = (async () => {
    for (const delay of RETRY_DELAYS) {
      if (delay > 0) await new Promise(r => setTimeout(r, delay));
      if (cachedVoice) break; // voiceschanged 가 먼저 찾음
      const v = findJaVoice();
      if (v) { cachedVoice = v; break; }
    }
    setStatus(cachedVoice ? 'ja-found' : 'no-ja');
    detectPromise = null;
    return cachedVoice;
  })();
  return detectPromise;
}

/**
 * 수동 "음성 다시 감지" — 캐시를 비우고 감지 루프를 다시 돈다.
 * 설정 화면의 [음성 다시 감지] 버튼이 호출.
 */
export async function refreshVoices() {
  cachedVoice = null;
  detectPromise = null;
  await detectLoop();
  return getVoiceStatus();
}

/** 현재 감지 상태 스냅샷 (동기). */
export function getVoiceStatus() {
  if (!ttsAvailable()) return 'unsupported';
  return voiceStatus;
}

/** 상태 변화 구독 — 설정 화면 갱신용. 해제 함수 반환. */
export function onVoiceStatusChange(cb) {
  statusSubscribers.add(cb);
  return () => statusSubscribers.delete(cb);
}

async function pickJaVoice() {
  if (cachedVoice) return cachedVoice;
  return detectLoop();
}

export async function speak(text, opts = {}) {
  if (!ttsAvailable()) {
    return { ok: false, reason: 'unsupported' };
  }
  try {
    // speak 시점에 마지막으로 한 번 더 확인 — 늦게 로드된 voice 회수.
    let v = cachedVoice || findJaVoice();
    if (v) { cachedVoice = v; setStatus('ja-found'); }
    else v = await pickJaVoice();
    // Web Speech API 자체는 있지만 일본어 음성이 설치되어 있지 않은 환경은
    // 사실상 일본어 학습 용도로는 사용 불가 — 폴백으로 안내한다.
    if (!v) return { ok: false, reason: 'no-ja-voice' };

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 1;
    u.voice = v;
    // 호출자가 utterance 종료 시점을 알아야 하는 경우 (예: 스토리 연속 재생) onEnd 콜백 지원.
    if (typeof opts.onEnd === 'function') {
      u.onend  = () => { try { opts.onEnd(); } catch {} };
    }
    // 재생 오류 — voice 없음과 구분되는 "자동 재생 정책/재생 실패" 신호.
    u.onerror = () => {
      try { opts.onEnd?.(); } catch {}
      try { opts.onPlaybackError?.({ reason: 'playback-error' }); } catch {}
    };
    window.speechSynthesis.speak(u);
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: 'error', error: e };
  }
}

export function stopSpeaking() {
  if (ttsAvailable()) window.speechSynthesis.cancel();
}

/**
 * Web Speech API 존재 + 일본어 voice 설치 여부까지 확인.
 * 청해 화면 진입 시 사전 폴백 안내를 띄우는 데 사용한다.
 * 브라우저 voices 로드는 비동기일 수 있어 Promise 로 반환.
 */
export async function hasJaVoice() {
  if (!ttsAvailable()) return false;
  const v = await pickJaVoice();
  return !!v;
}

/** 테스트 전용 — 모듈 캐시/상태 초기화 (qa 시나리오 격리). */
export function _resetVoiceStateForTest() {
  cachedVoice = null;
  voiceStatus = 'detecting';
  detectPromise = null;
  listenersBound = false;
  statusSubscribers.clear();
}
