// 테마 적용 모듈 — 'system' | 'light' | 'dark'.
//
// 구조:
//   - styles.css 의 :root = 다크 팔레트(기존 기본). [data-theme="light"] 가 라이트 오버라이드.
//   - index.html <head> 의 인라인 스크립트가 첫 페인트 전에 data-theme 를 설정해
//     라이트 사용자의 다크 플래시를 방지. 이 모듈은 그 이후의 동적 전환을 담당.
//   - system 모드일 때 OS prefers-color-scheme 변경을 실시간 반영.

import { getThemeMode } from './state.js';

/** 설정값(또는 인자)을 실제 'light'|'dark' 로 해석. system → OS 설정. */
export function resolveThemeMode(mode) {
  const m = mode || getThemeMode();
  if (m === 'light' || m === 'dark') return m;
  try {
    if (typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch { /* matchMedia 미지원 → 다크 기본 */ }
  return 'dark';
}

/** data-theme 를 즉시 적용. 반환값은 해석된 'light'|'dark'. */
export function applyTheme(mode) {
  const resolved = resolveThemeMode(mode);
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.dataset.theme = resolved;
  }
  return resolved;
}

let mediaListener = null;

/** 앱 시작 시 1회 — 현재 설정 적용 + system 모드의 OS 변경 감지. */
export function initTheme() {
  applyTheme();
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      if (mediaListener && mq.removeEventListener) {
        mq.removeEventListener('change', mediaListener);
      }
      mediaListener = () => {
        if (getThemeMode() === 'system') applyTheme();
      };
      if (mq.addEventListener) mq.addEventListener('change', mediaListener);
    }
  } catch { /* 미지원 환경 무시 */ }
}
