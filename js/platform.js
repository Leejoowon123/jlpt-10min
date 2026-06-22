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

let registeredTextToSpeech = null;
let lastPluginSource = 'none';   // 'plugins-map' | 'register-plugin' | 'none' — 마지막 nativeTtsPlugin() 해석 경로

/** 주입된 Capacitor TextToSpeech 플러그인 핸들(없으면 null). */
export function nativeTtsPlugin() {
  try {
    const cap = globalThis.Capacitor;
    if (!cap) { lastPluginSource = 'none'; return null; }
    const direct = cap.Plugins && cap.Plugins.TextToSpeech;
    if (direct) { lastPluginSource = 'plugins-map'; return direct; }   // 네이티브가 확정 등록한 핸들
    // Capacitor v3+ often exposes native plugins through registerPlugin()
    // instead of pre-populating Capacitor.Plugins, especially in non-bundled
    // static apps. Cache the proxy so repeated diagnostics/speak calls use the
    // same bridge object.
    // 주의: registerPlugin() 은 네이티브 등록 여부와 무관하게 항상 프록시를 돌려준다(존재 ≠ 동작).
    // 따라서 이 경로의 '있음' 은 잠정 신호이며, 실제 동작 확인은 speak 테스트가 담당한다.
    if (!registeredTextToSpeech && typeof cap.registerPlugin === 'function') {
      registeredTextToSpeech = cap.registerPlugin('TextToSpeech');
    }
    if (registeredTextToSpeech) { lastPluginSource = 'register-plugin'; return registeredTextToSpeech; }
    lastPluginSource = 'none';
    return null;
  } catch { lastPluginSource = 'none'; return null; }
}

/** 마지막 plugin 해석 경로 — 'plugins-map'(네이티브 확정) | 'register-plugin'(프록시·잠정) | 'none'. */
export function nativeTtsPluginSource() {
  nativeTtsPlugin();   // 최신 경로로 갱신
  return lastPluginSource;
}

/** 네이티브 TTS 사용 조건 — Capacitor + TextToSpeech 플러그인 주입됨. */
export function useNativeTts() {
  return isCapacitor() && !!nativeTtsPlugin();
}

/** Capacitor 진단 스냅샷 — 설정 화면/로그에서 원인 파악용. (방어적) */
export function getCapacitorDiagnostics() {
  const out = { hasCapacitor: false, platform: 'web', pluginKeys: [], hasPlugins: false, hasRegisterPlugin: false };
  try {
    const cap = globalThis.Capacitor;
    out.hasCapacitor = !!cap;
    out.platform = capacitorPlatform();
    out.hasRegisterPlugin = !!(cap && typeof cap.registerPlugin === 'function');
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
    hasRegisterPlugin: getCapacitorDiagnostics().hasRegisterPlugin,
    pluginSource: lastPluginSource,   // 어떤 경로로 플러그인을 찾았는가(확정 등록 vs 프록시)
  };
}
