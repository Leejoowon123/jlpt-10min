// Android 빌드 설정 주입 — Option B(android/ 미커밋, CI 가 cap add 로 생성)에서
// 생성된 프로젝트에 compileSdk/targetSdk + versionCode/versionName 을 안정적으로 주입한다.
//
// 왜 필요한가:
//   - cap add android 가 만드는 기본값은 targetSdk 34 / versionCode 1 / versionName "1.0".
//   - Google Play 는 최신 target API(35+)를 요구하고, versionCode 1 고정이면 두 번째 업로드부터 거부된다.
//   - 따라서 release 빌드 전에 이 값들을 환경변수(워크플로) 기준으로 덮어쓴다.
//
// 환경변수(없으면 안전한 기본값):
//   ANDROID_COMPILE_SDK  (기본 35)
//   ANDROID_TARGET_SDK   (기본 35)   ← Play target API 요구: https://developer.android.com/google/play/requirements/target-sdk
//   ANDROID_VERSION_CODE (기본 1, 경고)  ← Play 재업로드 충돌 방지: 단조 증가 필요(워크플로가 run number 주입)
//   ANDROID_VERSION_NAME (기본 js/appMeta.js 의 APP_VERSION)
//
// 실행: node tools/inject-android-config.mjs   (android-release.yml 의 cap sync 이후)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { APP_VERSION } from '../js/appMeta.js';

const VARS = new URL('../android/variables.gradle', import.meta.url);
const APP_GRADLE = new URL('../android/app/build.gradle', import.meta.url);

if (!existsSync(VARS) || !existsSync(APP_GRADLE)) {
  console.error('inject-android-config: android/ 프로젝트가 없습니다 — cap add/sync 를 먼저 실행하세요.');
  process.exit(1);
}

const compileSdk = String(parseInt(process.env.ANDROID_COMPILE_SDK || '35', 10) || 35);
const targetSdk = String(parseInt(process.env.ANDROID_TARGET_SDK || '35', 10) || 35);
const versionName = (process.env.ANDROID_VERSION_NAME || APP_VERSION || '1.0.0').trim();

let versionCode = parseInt(process.env.ANDROID_VERSION_CODE || '', 10);
if (!Number.isInteger(versionCode) || versionCode < 1) {
  versionCode = 1;
  console.warn('inject-android-config: ⚠ ANDROID_VERSION_CODE 미지정 → 1 사용(재업로드 충돌 위험). 워크플로가 run number 를 주입해야 합니다.');
}

// 1) variables.gradle — compileSdk/targetSdk.
let vars = readFileSync(VARS, 'utf8');
if (/compileSdkVersion\s*=\s*\d+/.test(vars)) vars = vars.replace(/compileSdkVersion\s*=\s*\d+/, `compileSdkVersion = ${compileSdk}`);
else console.warn('inject-android-config: variables.gradle 에 compileSdkVersion 없음');
if (/targetSdkVersion\s*=\s*\d+/.test(vars)) vars = vars.replace(/targetSdkVersion\s*=\s*\d+/, `targetSdkVersion = ${targetSdk}`);
else console.warn('inject-android-config: variables.gradle 에 targetSdkVersion 없음');
writeFileSync(VARS, vars);

// 2) app/build.gradle — versionCode/versionName.
let app = readFileSync(APP_GRADLE, 'utf8');
if (/versionCode\s+\d+/.test(app)) app = app.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
else console.warn('inject-android-config: build.gradle 에 versionCode 없음');
if (/versionName\s+"[^"]*"/.test(app)) app = app.replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`);
else console.warn('inject-android-config: build.gradle 에 versionName 없음');
writeFileSync(APP_GRADLE, app);

// 워크플로 로그에서 최종값 확인용(명확히 출력).
console.log('==== Android 빌드 설정 주입 완료 ====');
console.log(`compileSdkVersion = ${compileSdk}`);
console.log(`targetSdkVersion  = ${targetSdk}`);
console.log(`versionCode       = ${versionCode}`);
console.log(`versionName       = ${versionName}`);
