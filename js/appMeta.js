// 앱 메타 정보 — 버전/플랫폼. 피드백 payload·관리자·진단 표시에 공용 사용.
// 버전은 수동 관리(콘텐츠 아님). 플랫폼은 platform.js 환경 감지를 재사용.

import { isCapacitor, capacitorPlatform } from './platform.js';

export const APP_VERSION = '1.0.0-beta';

/** 'app-android' | 'app-ios' | 'app-web' | 'web' — 피드백/진단 표시용(개인정보 아님). */
export function getPlatformLabel() {
  try {
    if (isCapacitor()) return 'app-' + String(capacitorPlatform() || 'unknown').toLowerCase();
    return 'web';
  } catch { return 'web'; }
}
