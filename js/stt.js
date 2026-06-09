// 브라우저 Web Speech API STT 어댑터 (오프라인 보장 없음).
//
// 인터페이스:
//   sttAvailable() : boolean
//   createSttSession({ lang='ja-JP', onResult, onError, onEnd }) → session
//     session.start() / session.stop() / session.isListening()
//     session.ok      — 생성 성공 여부
//     session.reason  — 실패 시 사유
//
// 미지원 또는 생성 실패 시:
//   - 앱이 깨지지 않도록 안전한 no-op 세션을 반환한다.
//   - 호출자는 ok===false 와 reason 으로 분기.
//
// 향후 스마트폰 앱에서는 Android SpeechRecognizer / iOS SFSpeechRecognizer 어댑터로
// 동일 인터페이스 구현체를 교체하면 된다.

export function sttAvailable() {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

const NOOP_SESSION = Object.freeze({
  ok: false,
  reason: 'unsupported',
  start() {},
  stop() {},
  isListening() { return false; },
});

/**
 * @param {{
 *   lang?: string,
 *   onResult?: (r:{interim:string, final:string, isFinal:boolean})=>void,
 *   onError?: (e:{reason:string, raw?:any, error?:any})=>void,
 *   onEnd?: ()=>void,
 * }} opts
 */
export function createSttSession(opts = {}) {
  const { lang = 'ja-JP', onResult, onError, onEnd } = opts;

  if (!sttAvailable()) {
    return NOOP_SESSION;
  }

  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec;
  try {
    rec = new Ctor();
  } catch (e) {
    return Object.freeze({
      ok: false, reason: 'ctor-failed',
      start() {}, stop() {}, isListening() { return false; },
    });
  }

  try {
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
  } catch { /* 일부 구현에선 setter 가 throw — 무시하고 계속 */ }

  let listening = false;

  rec.onresult = (ev) => {
    let interim = '', finalText = '';
    try {
      for (let i = ev.resultIndex ?? 0; i < (ev.results?.length ?? 0); i++) {
        const r = ev.results[i];
        if (!r || !r[0]) continue;
        if (r.isFinal) finalText += r[0].transcript;
        else            interim += r[0].transcript;
      }
    } catch { /* ignore parse errors */ }
    try { onResult?.({ interim, final: finalText, isFinal: !!finalText }); }
    catch (e) { console.warn('stt onResult handler threw', e); }
  };

  rec.onerror = (ev) => {
    // 표준 error 코드:
    //   'not-allowed' | 'service-not-allowed' | 'no-speech' |
    //   'network' | 'audio-capture' | 'aborted' | 'bad-grammar' | 'language-not-supported'
    const reason = (ev && ev.error) || 'error';
    try { onError?.({ reason, raw: ev }); }
    catch (e) { console.warn('stt onError handler threw', e); }
  };

  rec.onend = () => {
    listening = false;
    try { onEnd?.(); }
    catch (e) { console.warn('stt onEnd handler threw', e); }
  };

  return {
    ok: true,
    reason: null,
    start() {
      try {
        rec.start();
        listening = true;
      } catch (e) {
        listening = false;
        try { onError?.({ reason: 'start-failed', error: e }); } catch {}
      }
    },
    stop() {
      try { rec.stop(); } catch { /* already stopped */ }
      // listening 상태는 onend 에서 false 로 마무리. 즉시 false 처리.
      listening = false;
    },
    isListening() { return listening; },
  };
}
