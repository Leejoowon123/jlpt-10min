# Android Release 서명 빌드 + Play 내부 테스트 (라운드 62)

GitHub Actions 에서 **서명된 release AAB**(+선택 APK)를 만들고 **Google Play 내부 테스트**로 배포하는 절차.
keystore 비밀값은 **저장소에 넣지 않고 GitHub Secrets** 로만 다룬다.

> 워크플로: [.github/workflows/android-release.yml](../.github/workflows/android-release.yml) ·
> 서명 주입 스크립트: [tools/inject-signing.mjs](../tools/inject-signing.mjs) · debug 빌드는 기존 [android-apk.yml](../.github/workflows/android-apk.yml) 유지.

## 0. AAB vs APK — 산출물 전략

| 산출물 | 용도 | 비고 |
| --- | --- | --- |
| **release AAB** (`bundleRelease`) | **Google Play 내부 테스트 업로드(권장)** | Play 가 기기별 APK 를 생성. Play 배포 표준 |
| release APK (`assembleRelease`, 선택) | 직접 설치(사이드로드) 검증 | 워크플로 입력 `build_apk=true` 일 때만 |
| debug APK (기존) | **내부 개발 전용** | 디버그 키 서명 — **공개/Play 배포 금지** |

→ **Play 내부 테스트는 AAB 우선**, 직접 설치 검증이 필요할 때만 release APK 를 함께 만든다.

## 1. keystore 생성 (최초 1회, 로컬에서)

```bash
keytool -genkeypair -v \
  -keystore jlpt10m-release.jks \
  -alias jlpt10m \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass <STORE_PW> -keypass <KEY_PW> \
  -dname "CN=JLPT10M, OU=App, O=JLPT10M, C=KR"
```

- **`jlpt10m-release.jks` 와 비밀번호는 안전하게 보관**(분실 시 같은 앱으로 업데이트 불가). **저장소 커밋 금지**(`.gitignore` 가 `*.jks`/`*.keystore`/`*.aab`/`*.apk`/`key.properties` 제외).
- `validity 10000`(약 27년) — Play 업로드 키 요건 충족.

## 2. base64 인코딩 → GitHub Secrets 등록

keystore 를 한 줄 base64 로 만든다:

```bash
# macOS/Linux
base64 -w0 jlpt10m-release.jks > keystore.b64     # (-w0 없으면: base64 jlpt10m-release.jks | tr -d '\n')
# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("jlpt10m-release.jks")) > keystore.b64
```

GitHub 저장소 → **Settings → Secrets and variables → Actions → New repository secret** 에 4개 등록:

| Secret 이름 | 값 |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | `keystore.b64` 내용(base64 문자열) |
| `ANDROID_KEYSTORE_PASSWORD` | 스토어 비밀번호(`-storepass`) |
| `ANDROID_KEY_ALIAS` | 키 별칭(`jlpt10m`) |
| `ANDROID_KEY_PASSWORD` | 키 비밀번호(`-keypass`) |

> 워크플로의 **Verify signing secrets** 단계가 4개 중 하나라도 없으면 **명확한 에러로 즉시 실패**한다(자원 낭비 방지).
> 빌드 후 **Cleanup secrets** 단계가 러너의 keystore/key.properties 를 삭제한다.

## 3. release 빌드 실행

Actions 탭 → **"Android Release (AAB/APK)"** → Run workflow.
- 기본: AAB 만 빌드 → artifact `jlpt10m-release-aab`(`JLPT10M-release.aab`).
- `build_apk` 체크 시: release APK 도 빌드 → artifact `jlpt10m-release-apk`.

내부 동작: checkout → setup-node 22 → setup-java 17 → `npm install` → `build-www` → (`android/` 없으면 `cap add android`) → `cap sync` → keystore 복원 + `key.properties` 생성 → `node tools/inject-signing.mjs`(signingConfigs 주입) → `./gradlew bundleRelease` → artifact 업로드.

## 4. android/ 커밋 — Option A vs B (이번 라운드 판단)

- **현재(Option B)**: `android/` 미커밋 → CI 가 매 실행 `cap add android` 로 생성하고, `tools/inject-signing.mjs` 가
  생성된 `android/app/build.gradle` 에 `signingConfigs.release` 를 **멱등 주입**한다. **추가 커밋 없이 release 서명이 동작**한다.
- **권장(Option A — 안정성↑)**: release/Play 배포를 본격화하면 한 번 생성된 `android/` 를 **커밋**(`.gitignore` 의 `android/` 제거)하는 것을 권장.
  이유: ① 빌드 결정성/버전 고정(Capacitor·Gradle 템플릿 변화로 주입 위치가 흔들릴 위험 제거), ② `versionCode`/`versionName` 을 명시 관리,
  ③ Play 업로드는 동일 산출물 재현이 중요. 단, `android/app/build/`·`.gradle/`·`key.properties`·`*.keystore` 는 계속 ignore.

> **이번 라운드 결론**: Option B 로 **동작은 보장**(주입 스크립트로 서명 가능). 다만 **Play 정식 배포 단계에서는 Option A(android/ 커밋) 전환을 권장**한다.
> 이번엔 무리하게 android/ 전체를 커밋하지 않고, 전환은 다음 단계 선택지로 남긴다.

## 5. Google Play 내부 테스트 배포 절차

1. **Google Play 개발자 계정**(1회 등록비 $25) 준비.
2. **Play Console → 앱 만들기** → 앱 이름 **JLPT10M**, 기본 언어, 앱/게임=앱, 무료.
3. 패키지명 **`com.jlpt10m.app`** (capacitor.config.json 의 appId 와 일치 — 확정 후 변경 불가).
4. **테스트 → 내부 테스트 → 새 버전 만들기** → **AAB 업로드**(`JLPT10M-release.aab`).
   - 최초 업로드 시 **Play 앱 서명** 사용 권장(업로드 키 ≠ 앱 서명 키 — Play 가 서명 키 관리).
5. **테스터** 추가 — 이메일 목록(또는 Google 그룹) 등록 → **테스트 링크(옵트인 URL)** 공유.
6. **앱 콘텐츠(정책) 작성**(내부 테스트도 일부 요구):
   - **개인정보처리방침 URL** 필요(아래 6-1).
   - **데이터 보안(Data safety)**: 수집 항목 신고 — **이메일 주소**(계정 인증), **앱 활동 요약**(userActivity), **사용자 입력 피드백**(feedback). 모두 **계정 기능/앱 기능** 목적, 전송 암호화(HTTPS), 사용자 삭제 요청 경로 명시.
   - **로그인 필요 앱**임을 명시(리뷰어용 테스트 계정 제공 권장).
7. 검토 통과 후 내부 테스터가 링크로 설치/업데이트.

> **상세 제출 체크리스트(데이터 보안 신고 표·테스트 계정·콘텐츠 등급)**: [play-console-checklist.md](play-console-checklist.md).
> **개인정보처리방침 URL**: [privacy.html](../privacy.html) 를 GitHub Pages 로 게시 → 예 `https://leejoowon123.github.io/jlpt-10min/privacy.html` → Play Console "앱 콘텐츠 → 개인정보처리방침" 에 입력.

### 6-1. 개인정보처리방침 / 데이터 수집 고지(준비 필요)

앱이 사용하는 것을 명시:
- **Firebase Authentication(이메일/비밀번호)** — 로그인. 비밀번호는 앱이 저장하지 않음(Firebase 관리).
- **Firebase Realtime Database** — `userActivity`(가입/접속/세션/이용시간 요약, **uid 기준**), `feedback`(사용자 입력 의견). **이메일 원문·답변 원문·STT 원문 미저장**. 상세 행동 로그(actionLogs) 미수집(라운드 60).
- **앱 사용에 이메일 로그인이 필요**하다는 점.
- 데이터 보관/삭제 요청 연락 경로.

## 6. 보안 / 정책 (필독)

- **debug APK 는 공개/Play 배포 금지** — 디버그 키 서명, 내부 개발용.
- **release AAB/APK 만 외부 배포 후보** — 위 release keystore 로 서명.
- **keystore/`.jks`/`.aab`/`.apk`/`key.properties` 는 git 커밋 금지**(`.gitignore` 강제 + smoke 가드).
- 서명 비밀값은 **GitHub Secrets** 로만 주입(워크플로 로그/저장소 평문 없음).
- **Firebase web config(apiKey 등)는 public 가능** — 식별자이지 비밀키 아님. service account/Admin key 는 절대 커밋 금지.
- **Realtime Database 운영 Rules 유지** — [firebase-logging.md](firebase-logging.md) "라운드 60 현행"(actionLogs/anonymousActivity read/write false, userActivity/feedback 본인 write + admin read). 관리자 UID: [admin.md](admin.md).

## 7. debug APK vs release AAB 차이 요약

| 항목 | debug APK | release AAB |
| --- | --- | --- |
| 서명 키 | 자동 디버그 키 | **자체 release keystore**(Secrets) |
| 용도 | 내부 개발/사이드로드 | **Play 내부 테스트/배포** |
| Play Protect 경고 | 상대적으로 잦음 | 서명/Play 경유로 완화 |
| 최적화 | 디버그 | release(`bundleRelease`) |
| 워크플로 | android-apk.yml | android-release.yml |
