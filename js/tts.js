// 무료 TTS — 어댑터 구조 (라운드 57):
//   · 웹/PWA: Web Speech API (기존 그대로 — 회귀 없음).
//   · Capacitor Android(APK): @capacitor-community/text-to-speech 네이티브 플러그인 우선.
//   · 미지원: 안전 폴백(호출부가 스크립트/텍스트 폴백).
// 공개 API(speak/stopSpeaking/ttsAvailable/hasJaVoice/refreshVoices/getVoiceStatus/onVoiceStatusChange/isJaVoice)는
// 그대로 유지 — 화면 호출부 변경 0. 환경에 따라 내부에서 native/web 어댑터를 선택한다.
//
// 라운드 30(웹 음성 감지 안정화) 로직은 web 어댑터로 보존:
//   getVoices() 지연 로드 대비 — 즉시 확인 + voiceschanged + 재시도 루프 + 수동 refresh + 캐시.

import { useNativeTts, nativeTtsPlugin, isCapacitor, getNativeTtsDiagnostics } from './platform.js';

let lastNativeError = null;      // 마지막 네이티브 오류 message (진단용)
let nativeLangKey = 'lang';      // speak 옵션 키 — 테스트 재생이 작동하는 키를 학습(lang|language|locale)

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
// 상태는 "플러그인 + speak 메서드 존재" 기준으로 판단(getSupportedLanguages 결과에 의존하지 않음 —
// 실기기에서 언어목록 형식/누락으로 false negative 가 났던 라운드 57 문제 수정). 실제 발화 검증은 테스트 재생.

/** ja-JP speak 옵션 후보 — 플러그인별 키 차이(lang/language/locale) 호환. */
function nativeSpeakOpts(text, rate, langKey) {
  const o = { text: String(text == null ? '' : text) };
  o[langKey] = 'ja-JP';
  if (rate != null) o.rate = rate;
  return o;
}

/** 네이티브 상태 코드 산출 — plugin/speak 존재 여부 기준. */
function nativeStatusCode() {
  const p = nativeTtsPlugin();
  if (!p) return 'native-unavailable';                 // reason: native-plugin-missing
  if (typeof p.speak !== 'function') return 'native-unavailable'; // reason: native-method-missing
  return 'native-ready';
}

/** 비동기 감지(음성 다시 감지 버튼) — plugin/speak 우선, 그 다음 언어목록을 '정보성'으로 확인.
 *  언어목록이 ja 를 확인 못 해도 전체 실패로 보지 않고 native-language-unknown(테스트 재생 권유)로 표시. */
async function nativeDetect() {
  setStatus('detecting');
  const base = nativeStatusCode();          // native-ready | native-unavailable (plugin/speak 기준)
  if (base !== 'native-ready') { setStatus(base); return base; }
  // plugin+speak 는 있음 → 언어목록은 보조 신호로만.
  const p = nativeTtsPlugin();
  try {
    if (p && typeof p.getSupportedLanguages === 'function') {
      const res = await p.getSupportedLanguages();
      const langs = (res && (res.languages || res)) || [];
      if (Array.isArray(langs) && langs.length && !langs.some(l => /^ja([-_]|$)/i.test(String(l)))) {
        setStatus('native-language-unknown');   // 목록에 ja 없음 — 테스트 재생으로 확인 권유
        return 'native-language-unknown';
      }
    }
  } catch { /* 목록 확인 실패 → ready 유지(speak 테스트가 진실) */ }
  setStatus('native-ready');
  return 'native-ready';
}

/**
 * 네이티브 speak. awaitDone=true 면 발화 완료까지 await + 옵션키 후보를 순차 시도(테스트 재생용, 신뢰도↑).
 * @returns {Promise<{ok:boolean, reason?:string, message?:string}>}
 */
async function nativeSpeak(text, opts = {}, awaitDone = false) {
  const p = nativeTtsPlugin();
  // 플러그인/메서드 부재는 원인을 명확히 — web 폴백으로 가리지 않는다(APK WebView Web Speech 는 불안정).
  if (!p) { lastNativeError = 'TextToSpeech 플러그인 미등록'; setStatus('native-unavailable'); return { ok: false, reason: 'native-plugin-missing' }; }
  if (typeof p.speak !== 'function') { lastNativeError = 'speak 메서드 없음'; setStatus('native-unavailable'); return { ok: false, reason: 'native-method-missing' }; }
  try { await Promise.resolve(p.stop && p.stop()); } catch { /* 이전 발화 정지 무시 */ }

  // 학습된 키 우선, 그 외 후보. awaitDone 일 때만 여러 키를 시도(완료까지 await 가능).
  const keys = awaitDone ? [nativeLangKey, 'lang', 'language', 'locale'].filter((k, i, a) => a.indexOf(k) === i) : [nativeLangKey];
  let lastErr = null;
  for (const key of keys) {
    const optObj = nativeSpeakOpts(text, opts.rate, key);
    try {
      const pr = Promise.resolve(p.speak(optObj));
      if (awaitDone) {
        await pr;                       // 완료까지 대기 — 실패 시 catch 로 다음 키 시도
        nativeLangKey = key;            // 작동 키 학습
        lastNativeError = null;
        setStatus('native-ready');
        return { ok: true };
      }
      // 일반 재생: fire-and-forget. 완료 시 onEnd, 실패 시 onPlaybackError + 진단 기록.
      pr.then(() => { try { opts.onEnd?.(); } catch {} })
        .catch((e) => {
          lastNativeError = (e && e.message) || 'native speak error';
          try { opts.onEnd?.(); } catch {}
          try { opts.onPlaybackError?.({ reason: 'native-error', message: lastNativeError }); } catch {}
        });
      setStatus('native-ready');
      return { ok: true };
    } catch (e) {
      lastErr = e;                       // sync throw(또는 await reject) → 다음 키
    }
  }
  // 전 키 실패
  lastNativeError = (lastErr && lastErr.message) || 'native speak 실패';
  if (!awaitDone && webTtsAvailable()) return webSpeak(text, opts);   // 일반 재생은 web 폴백 시도
  setStatus('native-unavailable');
  return { ok: false, reason: 'native-error', message: lastNativeError };
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

function webVoiceListEmpty() {
  if (!webTtsAvailable()) return false;
  try { return (window.speechSynthesis.getVoices() || []).length === 0; }
  catch { return false; }
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
    // Some mobile browsers expose an empty getVoices() list even though
    // speechSynthesis can still route by utterance.lang. If the list is merely
    // empty, try a lang-only utterance instead of declaring failure. If voices
    // exist but none are Japanese, keep the stricter no-ja-voice result.
    const allowLangFallback = !v && webVoiceListEmpty();
    if (!v && !allowLangFallback) return { ok: false, reason: 'no-ja-voice' };

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 1;
    if (v) u.voice = v;
    else setStatus('web-language-fallback');
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
  if (isCapacitor()) { return await nativeDetect(); }   // 세부 상태(native-language-unknown 포함) 반환
  cachedVoice = null;
  detectPromise = null;
  await detectLoop();
  return getVoiceStatus();
}

/** 현재 상태 스냅샷(동기). Capacitor 는 plugin/speak 존재 기준(native-ready/native-unavailable). */
export function getVoiceStatus() {
  if (isCapacitor()) return nativeStatusCode();
  if (!webTtsAvailable()) return 'unsupported';
  return voiceStatus;
}

/**
 * 테스트 재생 — 실제 speak 가 동작하는지 확인(상태 감지보다 신뢰도 높음).
 * 네이티브: 발화 완료까지 await + 옵션키 후보 시도. 웹: speak 결과.
 * @returns {Promise<{ok:boolean, reason?:string, message?:string}>}
 */
export async function speakTest(text = '日本語') {
  if (isCapacitor()) {
    const r = await nativeSpeak(text, { rate: 1.0 }, true);   // awaitDone
    setStatus(r.ok ? 'native-ready' : 'native-unavailable');
    return r;
  }
  return webSpeak(text, {});
}

/** TTS 진단 스냅샷 — 설정 화면 "진단 정보" 표시용. */
export function getTtsDiagnostics() {
  if (isCapacitor()) {
    const d = getNativeTtsDiagnostics();
    return {
      mode: 'native',
      status: nativeStatusCode(),
      pluginPresent: d.pluginPresent,
      hasSpeak: d.hasSpeak,
      hasStop: d.hasStop,
      hasGetLanguages: d.hasGetLanguages,
      hasRegisterPlugin: d.hasRegisterPlugin,
      pluginKeys: d.pluginKeys,
      platform: d.platform,
      langKey: nativeLangKey,
      lastError: lastNativeError,
    };
  }
  return { mode: 'web', status: getVoiceStatus(), webAvailable: webTtsAvailable(), lastError: null };
}

export function onVoiceStatusChange(cb) {
  statusSubscribers.add(cb);
  return () => statusSubscribers.delete(cb);
}

export async function speak(text, opts = {}) {
  if (isCapacitor()) return nativeSpeak(text, opts);
  return webSpeak(text, opts);
}

export function stopSpeaking() {
  if (isCapacitor()) { nativeStop(); return; }
  if (webTtsAvailable()) window.speechSynthesis.cancel();
}

/** ja-JP 음성/언어 지원 확인. 네이티브: plugin+speak 존재 / 웹: voice 설치 확인. */
export async function hasJaVoice() {
  if (isCapacitor()) return nativeStatusCode() === 'native-ready';
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
