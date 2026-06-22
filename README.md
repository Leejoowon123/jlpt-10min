# JLPT10M — 무료 일본어 학습 앱

하루 10분, JLPT N5~N2 학습 흐름을 **완전 무료**로 구현한 모바일 우선 SPA. (브랜드명 **JLPT10M**)
빌드 도구 없음 · 유료 API 없음 · 서버 없음 — 정적 호스팅(GitHub Pages)만으로 동작.
디자인: 먹색(ink) + 주홍(vermilion) + 종이(washi) 팔레트, 라이트/다크 테마. (비공식 학습 앱 — JLPT 주관 기관과 무관)

## 현재 상태

**N5·N4·N3·N2 전 레벨 콘텐츠 완성 — 릴리스 후보(공개 베타 가능).**
누적 어휘 5002 / 한자 1000, 레벨별 문법·독해·청해·문장·회화·이야기 목표 100% 달성.
후리가나 100% · 의존성 전수 태깅 · N1급 혼입 0 · 전역 중복 0 · unreviewed 경고 0.

**앱 사용에는 이메일 로그인이 필요합니다(라운드 50).** 첫 진입 시 로그인/회원가입 화면이 표시되며,
로그인 후 홈·학습·복습·이야기·단편·설정에 접근할 수 있습니다. 학습 콘텐츠(N5~N2)는 앱에 포함되어 있고,
Firebase 는 **인증과 최소 행동 로그** 용도로만 쓰입니다(이메일/비밀번호/답변 원문은 저장하지 않음).

- 상세 현황: [docs/content-status.md](docs/content-status.md) (자동 리포트 `npm run content:report`)
- 배포 전 점검: [docs/release-checklist.md](docs/release-checklist.md)
- 데이터는 레벨별 JSON 분리 진행 중(`data/<레벨>/vocab.json` + `dataLoader` fallback, 1차 인프라 완료 — [docs/data-loading-plan.md](docs/data-loading-plan.md))
- 다음 단계(제품화): 브라우저 전체 QA → 데이터 경량화(정적 import 제거) → 모바일 패키징

## 주요 기능

- **오늘의 10분** — 단어/문법/독해/청해 10문항 자동 큐 + SM-2 SRS 복습
- **단어 이미지 카드 단계형 학습** — 노출→회상(3/5/7초)→확인→퀴즈 5단계
- **이야기/단편 소설 스토리 플레이어** — 후리가나+로마자+해석 3단 본문, 문단별/전체 TTS 재생, 인라인 핵심 단어, 진행 저장, 학습 연결·복귀
- **후리가나 ON/OFF** — 자동 사전 + 명시 readings, 읽기 가림 학습 지원
- **한자 카드 / 가나(50음도) 표** — 음·훈독, 예시 단어, 셀 클릭 TTS
- **회화 모듈 (오프라인)** — sentenceBank 기반 피드백, Web Speech STT 프로토타입
- **라이트/다크/시스템 테마** + 모바일 360px 대응
- **PWA 설치 가능** — 모바일 홈 화면에 추가, 재방문 시 앱 shell 오프라인 로드
- **이메일 로그인 필수** — Firebase Email/Password 인증 게이트 + 최소 행동 로그(signed-in 전용)
- **TTS 어댑터** — 웹/PWA 는 Web Speech, **APK(Capacitor)는 Android 네이티브 TTS 우선**(WebView 음성 감지 한계 우회)

상세: [docs/features.md](docs/features.md)

## PWA 설치

모바일 Chrome(Android) / 데스크톱 Chrome·Edge에서 **홈 화면에 추가 / 설치** 가능.
- `manifest.json` + `service-worker.js`(앱 shell **cache-first**) — 첫 방문은 온라인 필요, **재방문 시 오프라인에서도 앱 로드**.
- 콘텐츠는 현재 정적 import 라 shell 캐시에 포함 → 오프라인 학습 동작. Firebase 로그인/로그·TTS/STT는 온라인/브라우저 지원에 의존(오프라인 시 학습은 계속).
- 아이콘은 `assets/icons/`(`node tools/gen-icons.mjs` 로 재생성). 설계: [docs/pwa-plan.md](docs/pwa-plan.md).

## Android APK (개발 빌드 — Capacitor)

정적 웹앱을 Capacitor 로 Android 패키징할 수 있게 1차 구성 완료(`capacitor.config.json`, `appId=com.jlpt10m.app`, `webDir=www`).
**JDK17+ / Android Studio·SDK 환경**에서:

```bash
npm i -D @capacitor/cli@^6 && npm i @capacitor/core@^6 @capacitor/android@^6   # 최초 1회(네트워크)
node tools/build-www.mjs && npx cap add android        # android/ 생성
npm run cap:sync && (cd android && ./gradlew assembleDebug)   # 디버그 APK
```

**Android Studio 없이** 빌드하려면 → GitHub **Actions** 탭 → **"Android APK (debug)"** → **Run workflow** →
완료 후 **Artifacts → `jlpt10m-debug-apk`** 다운로드(서버에서 빌드, `.github/workflows/android-apk.yml`).

`www/`·`android/` 는 빌드 산출물(.gitignore). debug APK 는 테스트용(release/Play 배포는 별도 서명 키 필요).
빌드 절차·실기기 설치·Firebase/TTS/STT 확인·한계: [docs/apk-plan.md](docs/apk-plan.md).

## 빠른 실행

ES Module 사용으로 `file://` 직접 열기 불가 — 아무 정적 서버나 OK.

```powershell
# 옵션 A — Python
cd D:\TEST
python -m http.server 5173
# → http://localhost:5173

# 옵션 B — Node
npx serve .
```

VSCode Live Server 등도 동일하게 동작.

## 배포 (GitHub Pages)

- 저장소: <https://github.com/Leejoowon123/jlpt-10min>
- 공개 URL: <https://leejoowon123.github.io/jlpt-10min/> (repo Settings → Pages, `main` 브랜치 기준)
- 빌드 도구 없음 — 정적 파일 그대로 서빙. hash 라우팅이라 SPA 리라이트 설정 불필요.
- `main` 머지 = 배포. smoke+qa CI 게이트 통과 필수. 상세: [docs/development-workflow.md](docs/development-workflow.md)

## 테스트

```bash
npm install        # jsdom (최초 1회)
node smoke.mjs     # 데이터 무결성 + 후리가나 커버율 + 정적/보안 검사 + 완성/릴리스 sentinel
node qa.mjs        # jsdom DOM 시나리오 (243 시나리오)
npm run content:report   # 최종 목표 대비 콘텐츠 현황
```

셋 다 통과해야 PR 가능 — CI 가 동일 명령을 자동 실행. 상세: [docs/qa-and-review.md](docs/qa-and-review.md)

## Firebase (인증 필수 + 행동 로그)

이메일 로그인 게이트 + 최소 행동 로그(`app_open`, `login_success`, `logout`, `study_start`, `story_open`,
`story_complete`, `vocab_card_answered`, `grammar_answered` 화이트리스트, **signed-in 전용**).
**앱 사용에 로그인이 필요합니다.** 비밀번호/이메일 원문/답변 원문/STT 원문은 어디에도 저장하지 않음
(로그 meta 는 itemType/itemId/storyId/correct/method allowlist, userKey=Firebase uid).
테스트 전용 버튼은 배포 UI 에 없음. Web config 는 public 가능 — service account/Admin key 는 절대 커밋 금지.

**공개 베타 가입 방법**: 배포 URL 접속 → 로그인 화면에서 이메일/비밀번호(6자 이상) 입력 → **회원가입** →
바로 로그인됨. (소셜 로그인 없음. Firebase Console → Authentication → Authorized domains 에 배포 도메인 등록 필요.)
**비밀번호 재설정**: 로그인 화면의 **"비밀번호를 잊으셨나요?"** → 이메일 입력 → 재설정 메일 발송(Firebase
`sendPasswordResetEmail`). 재설정 요청은 로그에 기록하지 않으며 이메일은 저장하지 않음.

**운영 rules 적용 위치**: Firebase Console → Build → **Realtime Database → Rules 탭** → 붙여넣기 → Publish.
(Firestore Rules 아님 주의. 테스트 모드 rules 로 main 배포 금지 — 머지 전 Publish 필수.)

상세 (연결 방법·DB 구조·운영 rules·main 병합 체크리스트): [docs/firebase-logging.md](docs/firebase-logging.md)

## 문서

| 문서 | 내용 |
| --- | --- |
| [docs/features.md](docs/features.md) | 기능 명세 — 화면·학습 UX·커리큘럼·노출 규칙·TTS 정책·스토리 플레이어·회화 |
| [docs/data-models.md](docs/data-models.md) | 데이터 스키마 — vocab/grammar/kanji/stories/sentenceBank/로그 구조 |
| [docs/content-policy.md](docs/content-policy.md) | 무료 운영·original 콘텐츠 원칙·이미지 라이선스·권장 학습량 |
| [docs/development-workflow.md](docs/development-workflow.md) | 브랜치 운영·CI·Pages 배포·public repo 보안 |
| [docs/qa-and-review.md](docs/qa-and-review.md) | 테스트 체계·회귀 위험 영역·PR 체크리스트·리뷰 포인트 |
| [docs/firebase-logging.md](docs/firebase-logging.md) | Firebase 로그인·행동 로그·운영 rules |
| [docs/data-loading-plan.md](docs/data-loading-plan.md) | JSON 분리·dataLoader 점진 이전 + 성능 병목 우선순위 |
| [docs/pwa-plan.md](docs/pwa-plan.md) | PWA/오프라인 최소 구현 계획(캐시 전략·precache 도출) |
| [docs/pwa-install.md](docs/pwa-install.md) | 사용자용 앱 설치 안내(Android/PC/iPhone) + 로그인·오프라인 한계 |
| [docs/release-checklist.md](docs/release-checklist.md) | 공개 베타 배포 전 릴리스 체크리스트 |
| [docs/apk-plan.md](docs/apk-plan.md) | APK 패키징 계획(Capacitor 추천·사전 점검) — **계획 중** |
| [docs/browser-qa-checklist.md](docs/browser-qa-checklist.md) | 실제 브라우저 수동 QA 체크리스트 |
| [docs/asset-licenses.md](docs/asset-licenses.md) | 이미지 자산 라이선스 기록 |
| [docs/content-authoring-guide.md](docs/content-authoring-guide.md) | 콘텐츠 작성 실무 가이드 |
| [docs/offline-conversation.md](docs/offline-conversation.md) | 회화 모듈 어댑터 설계 |
| [docs/content-status.md](docs/content-status.md) | 최종 목표 대비 콘텐츠 현황 (자동 리포트 기반) |
| [docs/next-roadmap.md](docs/next-roadmap.md) | 단계별 로드맵 + TODO |
| [docs/n5-expansion-plan.md](docs/n5-expansion-plan.md) | N5 확장 라운드 기록 |

## 라이선스 / 콘텐츠 원칙 (요약)

- 모든 콘텐츠(예문·이야기·한자 설명·이미지)는 **본 프로젝트용 직접 창작 (original)**
- 기출·시판 교재·상용 앱 콘텐츠 복사/번역/각색 **금지**
- 유료 API·외부 LLM·외부 사전 API **미사용** — TTS/STT 는 브라우저 무료 Web Speech API 만
- 출처/라이선스 상세: [LICENSE_NOTES.md](LICENSE_NOTES.md) · [docs/content-policy.md](docs/content-policy.md)
