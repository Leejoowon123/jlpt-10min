// 실행 환경 감지 — pwa.js / tts.js 공용. (라운드 57)
// 웹/PWA vs Capacitor 네이티브 WebView 분기에 사용. 방어적 — 어떤 접근도 throw 하지 않는다.

/** Capacitor(네이티브 WebView) 환경인가. */
export function isCapacitor() {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.Capacitor) return true;
    if (typeof location !== 'undefined' && location.protocol === 'capacitor:') return true;
    return false;
  } catch { return false; }
}

/** Capacitor 플랫폼 문자열 — 'android' | 'ios' | 'web'. */
export function capacitorPlatform() {
  try {
    const cap = globalThis.Capacitor;
    if (!cap) return 'web';
    if (typeof cap.getPlatform === 'function') return cap.getPlatform();
    if (cap.platform) return cap.platform;
    if (typeof cap.isNativePlatform === 'function') return cap.isNativePlatform() ? 'android' : 'web';
    return 'web';
  } catch { return 'web'; }
}

/** Android 네이티브(Capacitor) 환경인가. */
export function isAndroidCapacitor() {
  return isCapacitor() && String(capacitorPlatform()).toLowerCase() === 'android';
}

/** 주입된 Capacitor TextToSpeech 플러그인 핸들(없으면 null). */
export function nativeTtsPlugin() {
  try { return (globalThis.Capacitor && globalThis.Capacitor.Plugins && globalThis.Capacitor.Plugins.TextToSpeech) || null; }
  catch { return null; }
}

/** 네이티브 TTS 사용 조건 — Capacitor + TextToSpeech 플러그인 주입됨. */
export function useNativeTts() {
  return isCapacitor() && !!nativeTtsPlugin();
}

/** Capacitor 진단 스냅샷 — 설정 화면/로그에서 원인 파악용. (방어적) */
export function getCapacitorDiagnostics() {
  const out = { hasCapacitor: false, platform: 'web', pluginKeys: [], hasPlugins: false };
  try {
    const cap = globalThis.Capacitor;
    out.hasCapacitor = !!cap;
    out.platform = capacitorPlatform();
    if (cap && cap.Plugins) {
      out.hasPlugins = true;
      try { out.pluginKeys = Object.keys(cap.Plugins); } catch { out.pluginKeys = []; }
    }
  } catch { /* noop */ }
  return out;
}

/** 네이티브 TTS 진단 — 플러그인/메서드 존재 여부. (방어적) */
export function getNativeTtsDiagnostics() {
  const p = nativeTtsPlugin();
  return {
    capacitor: isCapacitor(),
    platform: capacitorPlatform(),
    pluginPresent: !!p,
    hasSpeak: !!(p && typeof p.speak === 'function'),
    hasStop: !!(p && typeof p.stop === 'function'),
    hasGetLanguages: !!(p && typeof p.getSupportedLanguages === 'function'),
    pluginKeys: getCapacitorDiagnostics().pluginKeys,
  };
}
