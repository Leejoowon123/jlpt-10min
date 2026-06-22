// 무료 TTS — 어댑터 구조 (라운드 57):
//   · 웹/PWA: Web Speech API (기존 그대로 — 회귀 없음).
//   · Capacitor Android(APK): @capacitor-community/text-to-speech 네이티브 플러그인 우선.
//   · 미지원: 안전 폴백(호출부가 스크립트/텍스트 폴백).
// 공개 API(speak/stopSpeaking/ttsAvailable/hasJaVoice/refreshVoices/getVoiceStatus/onVoiceStatusChange/isJaVoice)는
// 그대로 유지 — 화면 호출부 변경 0. 환경에 따라 내부에서 native/web 어댑터를 선택한다.
//
// 라운드 30(웹 음성 감지 안정화) 로직은 web 어댑터로 보존:
//   getVoices() 지연 로드 대비 — 즉시 확인 + voiceschanged + 재시도 루프 + 수동 refresh + 캐시.

import { useNativeTts, nativeTtsPlugin, isCapacitor } from './platform.js';

let cachedVoice = null;          // (web) 감지된 일본어 voice
// 상태: web = 'detecting'|'ja-found'|'no-ja'|'unsupported' / native = 'native-ready'|'native-unavailable'
let voiceStatus = 'detecting';
let detectPromise = null;
let listenersBound = false;
const statusSubscribers = new Set();

const DEFAULT_RETRY_DELAYS = [0, 250, 500, 1000, 2000];
let RETRY_DELAYS = DEFAULT_RETRY_DELAYS;
export function _setRetryDelaysForTest(arr) { RETRY_DELAYS = arr; }
export function _resetRetryDelaysForTest() { RETRY_DELAYS = DEFAULT_RETRY_DELAYS; }

// ── Web Speech 가용성(내부) — 공개 ttsAvailable 과 구분 ──────────────────────
function webTtsAvailable() {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof SpeechSynthesisUtterance !== 'undefined';
}

/** TTS 사용 가능 여부 — 네이티브(Capacitor) 또는 Web Speech. */
export function ttsAvailable() {
  return useNativeTts() || webTtsAvailable();
}

/** 일본어 voice 판정(web) — lang(ja/ja-JP) 우선, name(Japanese/Japan/日本) 보조. */
export function isJaVoice(v) {
  if (!v) return false;
  if (/^ja([-_]|$)/i.test(v.lang || '')) return true;
  return /japanese|japan|日本/i.test(v.name || '');
}

function setStatus(next) {
  if (voiceStatus === next) return;
  voiceStatus = next;
  for (const cb of statusSubscribers) { try { cb(next); } catch {} }
}

// ── 네이티브(Capacitor) 어댑터 ───────────────────────────────────────────────
/** 네이티브 TTS 가 ja-JP 를 지원하는지 — 언어목록 API 있으면 확인, 없으면 ready 로 간주. */
async function nativeHasJa() {
  const p = nativeTtsPlugin();
  if (!p) return false;
  try {
    if (typeof p.getSupportedLanguages === 'function') {
      const res = await p.getSupportedLanguages();
      const langs = (res && (res.languages || res)) || [];
      if (Array.isArray(langs) && langs.length) {
        return langs.some(l => /^ja([-_]|$)/i.test(String(l)));
      }
    }
  } catch { /* 언어목록 확인 실패 → ready 로 간주(speak 시 실패하면 안내) */ }
  return true; // 목록 API 없음/실패 → native-ready 로 간주
}

async function nativeDetect() {
  const p = nativeTtsPlugin();
  if (!p) { setStatus('native-unavailable'); return 'native-unavailable'; }
  setStatus('detecting');
  const ok = await nativeHasJa();
  const st = ok ? 'native-ready' : 'native-unavailable';
  setStatus(st);
  return st;
}

async function nativeSpeak(text, opts = {}) {
  const p = nativeTtsPlugin();
  if (!p) {
    if (webTtsAvailable()) return webSpeak(text, opts); // 플러그인 없으면 web 폴백
    return { ok: false, reason: 'native-unavailable' };
  }
  try {
    try { await Promise.resolve(p.stop && p.stop()); } catch { /* 이전 발화 정지 실패 무시 */ }
    const speakP = p.speak({ text, lang: 'ja-JP', rate: opts.rate ?? 1.0, pitch: opts.pitch ?? 1.0 });
    // speak 는 발화 완료 시 resolve — onEnd 연결(스토리 연속 재생 등).
    Promise.resolve(speakP)
      .then(() => { try { opts.onEnd?.(); } catch {} })
      .catch(() => {
        try { opts.onEnd?.(); } catch {}
        try { opts.onPlaybackError?.({ reason: 'native-error' }); } catch {}
      });
    return { ok: true };
  } catch (e) {
    // 네이티브 speak 실패 → web 폴백 시도, 없으면 안내.
    if (webTtsAvailable()) return webSpeak(text, opts);
    return { ok: false, reason: 'native-error', error: e };
  }
}

function nativeStop() {
  const p = nativeTtsPlugin();
  try { p && p.stop && p.stop(); } catch { /* noop */ }
}

// ── Web 어댑터 (기존 라운드 30 로직 보존) ────────────────────────────────────
function findJaVoice() {
  if (!webTtsAvailable()) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  return voices.find(v => /ja[-_]?JP/i.test(v.lang || ''))
    || voices.find(v => /^ja/i.test(v.lang || ''))
    || voices.find(v => isJaVoice(v))
    || null;
}

function bindVoicesChanged() {
  if (listenersBound || !webTtsAvailable()) return;
  listenersBound = true;
  const synth = window.speechSynthesis;
  const onChange = () => {
    const v = findJaVoice();
    if (v) { cachedVoice = v; setStatus('ja-found'); }
  };
  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', onChange);
  } else {
    try { synth.onvoiceschanged = onChange; } catch {}
  }
}

function detectLoop() {
  if (!webTtsAvailable()) { setStatus('unsupported'); return Promise.resolve(null); }
  if (detectPromise) return detectPromise;
  bindVoicesChanged();
  setStatus(cachedVoice ? 'ja-found' : 'detecting');
  detectPromise = (async () => {
    for (const delay of RETRY_DELAYS) {
      if (delay > 0) await new Promise(r => setTimeout(r, delay));
      if (cachedVoice) break;
      const v = findJaVoice();
      if (v) { cachedVoice = v; break; }
    }
    setStatus(cachedVoice ? 'ja-found' : 'no-ja');
    detectPromise = null;
    return cachedVoice;
  })();
  return detectPromise;
}

async function pickJaVoice() {
  if (cachedVoice) return cachedVoice;
  return detectLoop();
}

async function webSpeak(text, opts = {}) {
  if (!webTtsAvailable()) return { ok: false, reason: 'unsupported' };
  try {
    let v = cachedVoice || findJaVoice();
    if (v) { cachedVoice = v; setStatus('ja-found'); }
    else v = await pickJaVoice();
    if (!v) return { ok: false, reason: 'no-ja-voice' };

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 1;
    u.voice = v;
    if (typeof opts.onEnd === 'function') {
      u.onend = () => { try { opts.onEnd(); } catch {} };
    }
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

// ── 공개 API (어댑터 분기) ───────────────────────────────────────────────────

/** 수동 "음성 다시 감지" — 네이티브: 플러그인/언어 재확인 / 웹: 캐시 비우고 감지 루프. */
export async function refreshVoices() {
  if (useNativeTts()) { await nativeDetect(); return getVoiceStatus(); }
  cachedVoice = null;
  detectPromise = null;
  await detectLoop();
  return getVoiceStatus();
}

/** 현재 상태 스냅샷(동기). 네이티브 환경은 native-ready / native-unavailable. */
export function getVoiceStatus() {
  if (useNativeTts()) {
    if (voiceStatus !== 'native-ready' && voiceStatus !== 'native-unavailable') return 'native-ready';
    return voiceStatus;
  }
  if (isCapacitor()) return 'native-unavailable';   // Capacitor 인데 플러그인 미주입
  if (!webTtsAvailable()) return 'unsupported';
  return voiceStatus;
}

export function onVoiceStatusChange(cb) {
  statusSubscribers.add(cb);
  return () => statusSubscribers.delete(cb);
}

export async function speak(text, opts = {}) {
  if (useNativeTts()) return nativeSpeak(text, opts);
  return webSpeak(text, opts);
}

export function stopSpeaking() {
  if (useNativeTts()) { nativeStop(); return; }
  if (webTtsAvailable()) window.speechSynthesis.cancel();
}

/** ja-JP 음성/언어 지원 확인. 네이티브: 언어목록(또는 ready 간주) / 웹: voice 설치 확인. */
export async function hasJaVoice() {
  if (useNativeTts()) return nativeHasJa();
  if (!webTtsAvailable()) return false;
  const v = await pickJaVoice();
  return !!v;
}

/** 테스트 전용 — 모듈 캐시/상태 초기화. */
export function _resetVoiceStateForTest() {
  cachedVoice = null;
  voiceStatus = 'detecting';
  detectPromise = null;
  listenersBound = false;
  statusSubscribers.clear();
}
