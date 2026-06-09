// 무료 TTS: Web Speech API. 미지원 환경에서는 안전 폴백.
let cachedVoice = null;
let voicesReadyPromise = null;

// Web Speech API 객체 존재 여부만 동기로 확인한다.
// 일본어 voice 설치 여부는 비동기 — hasJaVoice() 또는 speak() 결과의
// `reason: 'no-ja-voice'` 로 확인해야 한다. (voices 가 늦게 로드되는 브라우저 존재.)
export function ttsAvailable() {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof SpeechSynthesisUtterance !== 'undefined';
}

function ensureVoicesLoaded() {
  if (!ttsAvailable()) return Promise.resolve([]);
  if (voicesReadyPromise) return voicesReadyPromise;
  voicesReadyPromise = new Promise(resolve => {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length) return resolve(list);
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      resolve(v || []);
    };
    window.speechSynthesis.onvoiceschanged = handler;
    // 타임아웃 폴백
    setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 1500);
  });
  return voicesReadyPromise;
}

async function pickJaVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = await ensureVoicesLoaded();
  cachedVoice = voices.find(v => /ja(-|_)?JP/i.test(v.lang))
    || voices.find(v => /^ja/i.test(v.lang))
    || null;
  return cachedVoice;
}

export async function speak(text, opts = {}) {
  if (!ttsAvailable()) {
    return { ok: false, reason: 'unsupported' };
  }
  try {
    const v = await pickJaVoice();
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
      u.onerror = () => { try { opts.onEnd(); } catch {} };
    }
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
