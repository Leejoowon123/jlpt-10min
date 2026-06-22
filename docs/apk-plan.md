# APK 패키징 (Capacitor 1차 구성 — 빌드는 사용자 환경에서)

**상태 (라운드 55)**: ✅ **Capacitor 구성 1차 완료** — `capacitor.config.json` + webDir 빌드 스크립트 + npm 스크립트 +
SW/Capacitor 가드 추가. ⚠️ **디버그 APK 빌드는 본 개발 환경에서 미수행**(JDK·Android SDK·Studio 부재) →
아래 "빌드 절차"를 **JDK17+/Android Studio 가 설치된 환경**에서 실행하면 디버그 APK 생성 가능.
**앱 이름**: JLPT10M · **appId**: `com.jlpt10m.app` · **webDir**: `www`

## 0. 1차 구성 결과 / 빌드 절차 (라운드 55)

추가/구성된 것:
- `capacitor.config.json` — `{ appId: com.jlpt10m.app, appName: JLPT10M, webDir: "www", bundledWebRuntime: false, server.androidScheme: "https" }`.
- `tools/build-www.mjs` — 정적 앱(빌드 단계 없음)을 `www/` 로 복사(index.html·styles.css·manifest.json·service-worker.js + `js/`·`data/`·`assets/`). `www/`·`android/` 는 `.gitignore`(빌드 산출물).
- npm 스크립트: `cap:copy`(www 빌드) · `cap:sync`(www→android 동기화) · `cap:open`(Android Studio) · `cap:build:android`(www+sync+gradlew assembleDebug).
- `js/pwa.js` `isCapacitor()` — 네이티브 WebView 에서 Service Worker 등록을 건너뜀(번들 자산 사용, WebView SW 불안정).
- Capacitor 의존성은 CI/lock 영향을 피하려 `package.json` deps 에 **미기재** — 사용자가 빌드 시 설치.

**빌드 절차 (JDK17+ & Android Studio/SDK 환경):**
```bash
# 1) Capacitor 설치 (네트워크 필요 — 대규모 의존성)
npm i -D @capacitor/cli@^6
npm i @capacitor/core@^6 @capacitor/android@^6
# 2) webDir 빌드 + Android 프로젝트 생성 (최초 1회)
node tools/build-www.mjs
npx cap add android            # android/ 생성 (capacitor.config.json 의 appId/appName 사용)
# 3) 동기화 + 디버그 APK
npm run cap:sync               # = build-www + npx cap sync android
cd android && ./gradlew assembleDebug      # Windows: gradlew.bat assembleDebug
#   → APK: android/app/build/outputs/apk/debug/app-debug.apk
# 또는 Android Studio 로 열어서 Run:
npm run cap:open
```

**실기기 설치:** `adb install android/app/build/outputs/apk/debug/app-debug.apk` 또는 APK 를 기기로 전송 후 설치(알 수 없는 출처 허용).

**아이콘:** 우선 기존 `assets/icons/*.png`(먹+주홍 印)를 사용. Capacitor Android adaptive icon 으로의 변환(`@capacitor/assets` 또는 `res/mipmap`)은 **다음 라운드 TODO**.

## 0-A. Android Studio 없이 GitHub Actions 로 APK 만들기 (라운드 56)

로컬에 JDK/Android Studio 가 없어도 **GitHub Actions 서버(ubuntu-latest, Android SDK 사전 설치)**에서 debug APK 를 빌드한다. 워크플로: `.github/workflows/android-apk.yml`.

**APK 받는 법:**
1. GitHub 저장소 → **Actions** 탭.
2. 왼쪽에서 **"Android APK (debug)"** 워크플로 선택.
3. 오른쪽 **Run workflow** → (브랜치 선택) → **Run workflow** 클릭.
4. 빌드 완료(초록 ✓) 후 해당 run 페이지 하단 **Artifacts → `jlpt10m-debug-apk`** 다운로드(zip) → 압축 풀면 `JLPT10M-debug.apk`.

**폰에 설치:**
- APK 를 Android 폰으로 전송(USB/클라우드/링크) → 파일 탭 → 설치.
- 최초 설치 시 **"알 수 없는 앱 설치 허용"**(설정 → 앱 → 특수 접근 → 알 수 없는 앱 설치)으로 해당 앱(파일관리자/브라우저) 허용.
- 또는 PC 에서 `adb install JLPT10M-debug.apk`.

**워크플로 동작:** checkout → setup-node → setup-java 17 → `npm install`(Capacitor 포함) → `node tools/build-www.mjs` → (`android/` 없으면 `npx cap add android`) → `npx cap sync android` → `cd android && ./gradlew assembleDebug` → APK rename → `upload-artifact`.

**android/ 커밋 전략:**
- **현재(Option B)**: `android/` 미커밋 → CI 가 매 실행 `npx cap add android` 로 생성(이 환경에 JDK/CLI 가 없어 사전 생성 불가했음). 안정적이나 약간 느림.
- **권장 업그레이드(Option A)**: 한 번 빌드가 성공한 뒤(또는 JDK/Studio 환경에서) 생성된 `android/` 를 커밋하면 CI 가 재사용 → 더 빠르고 버전 고정. 그 경우 `.gitignore` 의 `android/` 줄을 제거하고 커밋. (단, `android/app/build/`·`.gradle/` 등 빌드 산출물은 계속 무시 권장.)

## 0-B. 보안 — debug APK vs release (라운드 56)

- **debug APK**(이번 라운드): Android **디버그 키**로 자동 서명되는 **테스트 전용**. 사이드로드 설치/내부 검증용. **공개/Play 배포 금지**.
- **release APK/AAB**(추후): 자체 **release keystore** 로 서명 필요. keystore/비밀번호는 **절대 저장소·워크플로 평문 커밋 금지** → GitHub **Secrets** + `signingConfigs` 로 주입. `.gitignore` 가 `*.keystore`·`*.jks`·`*.apk` 제외.
- 본 워크플로는 `assembleDebug` 만 수행 — 서명 키를 다루지 않는다.

## 9. 알려진 한계 / 실기기 확인 항목 (라운드 55)
- **Firebase Email Auth**: WebView 에서 동작 예상(REST 기반)이나 실기기 검증 필요. Authorized domains 에 `localhost`(androidScheme https → `https://localhost`) 가 있어야 함.
- **Service Worker**: `isCapacitor()` 로 등록 건너뜀 → 번들 자산이 첫 로드 제공. SW 미동작이 앱을 깨지 않음(가드).
- **TTS/STT(Web Speech)**: Android WebView 에서 불안정/미지원 가능. 미지원 시 STT 는 텍스트 입력 폴백. 네이티브 전환은 다음 라운드.
- **INTERNET 권한**: `cap add android` 가 생성하는 AndroidManifest 에 기본 포함. RECORD_AUDIO 는 네이티브 STT 도입 전까지 보류.

---

## (이하 라운드 54 검토 단계 기록)
**package id 후보**: `com.jlpt10m.app`

현재 앱은 정적 SPA + PWA(manifest/service-worker) + Firebase Email Auth + Realtime Database 로그 + Web Speech(TTS/STT) 구성. GitHub Pages 배포 중. APK 는 이 웹앱을 Android 로 패키징하는 것이 목표.

## 1. 방식 비교

### A. PWA / TWA (Trusted Web Activity)
- **장점**: 현재 PWA(GitHub Pages)를 거의 그대로 앱으로 감쌈. Chrome 엔진 사용(Web Speech/SW 호환성 ↑). 유지보수 = 웹 1벌. Bubblewrap 으로 APK 생성 간단.
- **단점**: Play 배포 시 `assetlinks.json`(Digital Asset Links) 도메인 검증 필요. 본질적으로 웹 의존(오프라인/네이티브 확장 제한). 사이드로드 APK 직접 배포보다 Play 중심.

### B. Capacitor (WebView 패키징)
- **장점**: 정적 앱을 Android WebView 앱으로 패키징. **APK 직접 설치/배포 용이**. 추후 네이티브 STT/TTS·파일 저장·알림·오프라인 AI 회화를 플러그인/브릿지로 확장 가능. 웹 자산을 앱에 번들(오프라인 첫 실행 가능).
- **단점**: Android Studio/JDK/Gradle 빌드 환경 필요. **Android System WebView 는 Web Speech API(특히 STT `SpeechRecognition`) 지원이 제한적**일 수 있음 → 네이티브 플러그인 필요. SW 동작이 브라우저와 달라 별도 검증 필요.

## 2. 추천

**Capacitor 추천.** 근거: ① APK 직접 설치/배포가 목표, ② 장기적으로 네이티브 STT/TTS·오프라인 회화·알림 확장 여지, ③ 웹 자산 번들로 오프라인 첫 실행. TWA 는 "Play 중심 + 순수 웹" 이면 더 단순하지만, 본 프로젝트의 확장 방향(네이티브 음성/오프라인)과는 Capacitor 가 부합.
> 단기적으로 "빠르게 Play 등록만" 이 목표라면 TWA(Bubblewrap)도 병행 옵션으로 남긴다.

## 3. 사전 점검 체크리스트 (빌드 전)

### 환경
- [ ] Android Studio 설치 (SDK/AVD)
- [ ] JDK 17+ (Capacitor/Gradle 요구)
- [ ] Node + `@capacitor/core`,`@capacitor/cli`,`@capacitor/android`

### 앱 메타
- [ ] package id: `com.jlpt10m.app` (확정 시 변경 어려움 — 신중)
- [ ] 앱 이름: **JLPT10M** / 아이콘: `assets/icons/icon-{192,512}.png`(+maskable) 재사용 → Android adaptive icon 으로 변환
- [ ] `webDir` = 정적 루트(현재 저장소 루트: index.html/js/styles.css/assets/data) 번들 대상 결정

### Firebase / 인증 (핵심 검증 포인트)
- [ ] **Email/Password Auth 가 WebView/Capacitor 에서 동작하는지** — `signInWithEmailAndPassword` 는 REST 기반이라 일반적으로 동작하나 실기기 검증 필요.
- [ ] **Authorized domains**: 웹 origin(`leejoowon123.github.io`) 외에, Capacitor 는 `http://localhost` 또는 `https://localhost`(혹은 커스텀 scheme `capacitor://`)로 동작 → Firebase Auth 설정에서 해당 origin 허용/검증 필요.
- [ ] `sendPasswordResetEmail` 의 재설정 링크가 웹(배포 도메인)으로 열리는지(앱 내/외 브라우저).
- [ ] Realtime Database 로그(actionLogs/userActivity) — 네트워크 가능 시 동작, rules 동일 적용.

### PWA / SW / 음성
- [ ] **Service Worker**: WebView 에서 SW 동작이 브라우저와 다를 수 있음 → Capacitor 는 자산 번들이 1차 캐시이므로 SW 의존도 낮춤. 별도 검증.
- [ ] **TTS(`speechSynthesis`)**: WebView 에서 가용성 확인. 미지원 시 네이티브 TTS 플러그인 검토.
- [ ] **STT(`SpeechRecognition`)**: Android WebView 미지원 가능성 높음 → 네이티브 음성인식 플러그인(예: `@capacitor-community/speech-recognition`) 브릿지 검토. 미지원 시 기존 텍스트 폴백 유지.
- [ ] 딥링크/뒤로가기(hardware back) → hash 라우팅과 Android back 버튼 연동(`@capacitor/app` `backButton`).

### 배포
- [ ] 서명 키(keystore) 생성·보관(분실 시 업데이트 불가) — 저장소에 커밋 금지.
- [ ] 사이드로드 APK 배포 vs Play 등록 결정.

## 4. 이번 라운드 결론 / 다음 단계
- 결론: **Capacitor 로 진행 권장**, 단 STT/SW/Authorized domains 는 실기기 검증 필요 항목으로 식별.
- 다음 라운드: Capacitor 프로젝트 스캐폴드(`npx cap init` / `add android`) → 디버그 APK 빌드 → 실기기에서 로그인/로그/TTS/STT/오프라인 검증 → 이슈별 네이티브 브릿지 결정.
- 콘텐츠/웹 코드는 그대로 재사용(웹이 단일 진실원). APK 는 "패키징 레이어"로만 추가.
