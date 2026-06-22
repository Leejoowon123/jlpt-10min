# 릴리스 체크리스트 — 공개 베타 배포 전

**대상**: N5~N2 전 레벨 콘텐츠 완성(라운드 47) 이후 GitHub Pages 공개 베타.
**기준일**: 2026-06-17 (라운드 48 — 릴리스 후보 안정화).

> 원칙: 콘텐츠 추가 없음. destructive git 금지. 자동 게이트(smoke/qa/content-report)가 통과해야 머지·배포.

## 1. 자동 게이트 (CI 필수)

- [ ] `node --check` 전체 JS/MJS 통과
- [ ] `node smoke.mjs` → ALL CHECKS PASSED (N2 완성 선언 기준 블록 + 릴리스 구조 가드 포함)
- [ ] `node qa.mjs` → ALL SCENARIOS PASSED ([235] 릴리스 안정화 포함)
- [ ] `npm run content:report` → N5~N2 전 영역 100%, smoke 산출값과 일치

## 2. 콘텐츠 완성 확인 (smoke sentinel 로 잠금)

- [ ] 누적 vocab ≥ 5000 (현재 5002) · 누적 kanji ≥ 1000 (현재 1000)
- [ ] N2 grammar 180 / pairs 45 / reading 120 / listening 120 / sentenceBank 600(회화 600) / topics 18 / stories 18(short_story 8)
- [ ] 후리가나 100% · 의존성 전수(stale bake 0) · gen-deps mismatch 0
- [ ] 전역 word/kanji/pattern 중복 0 · vocab 예문·reading+meaningKo·sentenceBank.ja 중복 0
- [ ] N1PAT 0 · imageKey 최다 ≤10% · unreviewed 0

## 3. 보안 / 프라이버시 (배포 전 필수)

- [ ] `js/firebaseConfig.js` 는 **web config 만** — service account JSON / Admin SDK 키 부재 (web apiKey 는 public 가능)
- [ ] 행동 로그 payload: `sanitizeMeta` allowlist(itemType/itemId/storyId/correct/method)만 — 이메일/비밀번호/답변 원문/STT 원문/이름 0 (smoke·qa 가드)
- [ ] userKey = Firebase uid 또는 익명 visitorId — **이메일 아님**
- [ ] 로그인 없이 전 학습 기능 동작 · 로그 실패가 학습 흐름을 막지 않음(fire-and-forget)
- [ ] Realtime Database **운영 rules** 가 Console 에 Publish 됨 (테스트 모드 rules 로 배포 금지) — docs/firebase-logging.md
- [ ] `git log`/저장소에 service-account JSON / .env 비밀키 미커밋

## 4. 실제 브라우저 QA (수동 — docs/browser-qa-checklist.md)

- [ ] GitHub Pages 실제 URL 접속 (배포 도메인)
- [ ] Chrome / Edge / Android Chrome · 모바일 360px 폭
- [ ] 홈/학습/복습/이야기/단편/설정 · N5~N2 레벨 전환
- [ ] 단어 이미지 카드 단계형(quickPreview→quiz) · romaji/후리가나 토글
- [ ] TTS 음성 감지/재감지/실패 안내 · 발음 버튼
- [ ] 스토리 플레이어(문단별/전체 재생·현재 문장·속도·본문 비가림)
- [ ] 회화 STT 지원/미지원 폴백
- [ ] Firebase 로그인/로그아웃/로그 기록 · 원문·이메일·비번 로그 미기록

## 4-c. 로그인 필수 / 인증 게이트 (라운드 50)

- [ ] 비로그인 첫 진입 → **로그인 화면만** 노출(홈/탭/헤더 숨김), `#study` 등 직접 접근도 차단
- [ ] **회원가입**(새 이메일/6자+ 비번) → 즉시 로그인 + 홈 진입
- [ ] **로그인**(기존 계정) → 의도했던 route 로 복귀(없으면 홈)
- [ ] 잘못된 비번/이메일 → 한국어 오류 메시지, 앱 생존(크래시 없음)
- [ ] **로그아웃**(설정) → 즉시 로그인 화면, 이후 hash 접근도 게이트 차단
- [ ] **비밀번호 재설정**: "비밀번호를 잊으셨나요?" → 빈 이메일 안내 / 유효 이메일 → 성공 토스트 / 형식 오류 한국어
- [ ] 비밀번호 재설정 **실제 메일 수신** 확인 → 링크에서 새 비밀번호 설정 후 로그인
- [ ] Firebase Console → Authentication → **Templates(비밀번호 재설정)** 발신/문구 확인(필요 시 한국어)
- [ ] Firebase **Authentication → Authorized domains** 에 배포 도메인(`leejoowon123.github.io`) 등록 — 없으면 로그인/재설정 링크 불가
- [ ] **운영 rules Publish**(로그인 필수판: actionLogs `auth!=null`, anonymousActivity `.write:false`) — docs/firebase-logging.md
- [ ] 로그에 이메일/비밀번호/답변 원문/STT 원문 미기록(signed-in 전용, meta allowlist)
- [ ] 오프라인에서 로그인 화면 → "온라인 연결 필요" 안내 / 로그인 세션 있으면 오프라인 학습 동작

## 4-b. PWA (라운드 49 — DevTools 수동)

- [ ] **DevTools → Application → Manifest** — 이름/아이콘/theme 로드, 오류 0
- [ ] **Application → Service Workers** — `service-worker.js` **activated and running**
- [ ] **설치 가능** — 주소창 설치 아이콘 / "홈 화면에 추가" 노출(installable)
- [ ] **오프라인 새로고침** — DevTools Network `Offline` 체크 후 새로고침 → 앱 shell 로드 + 학습 가능
- [ ] 오프라인에서 Firebase 로그인/로그 실패해도 학습 흐름 정상(noop)
- [ ] (Lighthouse) PWA: installable / offline 통과 — 선택
- [ ] **배포 후 `data/n5/vocab.json` ~ `data/n2/vocab.json` 200 응답 확인**(DevTools Network 또는 직접 URL) — 404 면 dataLoader 가 JS fallback 으로 동작하나, JSON 경로 활성화를 위해 200 권장

## 4-d. 디자인 / 브랜딩 (라운드 54 — 수동)

- [ ] 로그인/헤더에 **JLPT10M** 워드마크 표시(주홍 "10M" 강조)
- [ ] **라이트(종이) / 다크(먹) 모드** 둘 다 텍스트 대비·카드·버튼 정상(깨짐 없음)
- [ ] **360px 모바일** — 버튼/카드/하단 탭/스토리 플레이어 답답하지 않고 겹침 없음
- [ ] 주요 버튼(`.btn.primary`)·선택 칩(`.chip.active`) 주홍 강조 일관
- [ ] **PWA 아이콘**(먹+종이+주홍 印) — 홈 화면/설치 시 식별 가능, 공식 JLPT/국기처럼 보이지 않음
- [ ] 단어 카드/스토리 플레이어 위계(발음·romaji·후리가나·다음) 정돈

## 4-e. Android APK (Capacitor — 실기기 수동, 빌드 환경 필요)

- [ ] `npm i` capacitor + `npx cap add android` + `gradlew assembleDebug` → `app-debug.apk` 생성
- [ ] APK **설치**(adb 또는 기기 전송) → 앱 실행, 스플래시/아이콘(JLPT10M) 정상
- [ ] **로그인** — 이메일/비번 로그인·회원가입 동작(WebView + Firebase Auth)
      - 실패 시: Firebase Authorized domains 에 `localhost`(androidScheme https) 확인 / 인터넷 권한 / 네트워크
- [ ] **학습 시작** — 홈→오늘의 10분→단어/문법/독해/청해 렌더(번들 자산)
- [ ] **PWA/SW** — `isCapacitor()` 로 SW 미등록, 그래도 앱 정상(번들 자산 로드)
- [ ] **TTS** 재생 / **STT** 인식 — 동작 여부(미지원 시 텍스트 폴백 동작 확인 → 다음 라운드 네이티브 검토)
- [ ] **Firebase 로그** — 온라인 시 actionLogs/userActivity 기록(원문 미기록 유지)
- [ ] **오프라인 실행** — 로그인 세션 있으면 앱 shell+학습 동작 / 로그 실패 비차단

## 5. 성능 (블로커 아님 — 모니터링)

- [ ] 첫 로딩: 정적 import JS ~3.3MB(gzip ~0.8MB) — 모바일 4G 체감 확인
- [ ] 오늘의 10분 큐 생성 < 50ms · 추천 생성 < 50ms (현재 ~3ms)
- [ ] 장문 독해/스토리 렌더 지연 없음
- 개선 계획: docs/data-loading-plan.md (JSON 분리 우선순위), docs/pwa-plan.md (캐시)

## 6. 배포 판정

- **블로커 0** 이면 → **공개 베타 가능**.
- 블로커 발견 시: 해당 항목만 최소 수정 → 자동 게이트 재통과 → 재판정.

## 현재 판정 (라운드 48)

자동 게이트 4종 통과 · 콘텐츠 완성 잠금 · 보안/프라이버시 코드 레벨 통과(가드 추가). **남은 블로커: 코드 0건.**
수동 항목(실제 브라우저 QA·Firebase 운영 rules Publish 확인)만 배포 직전 1회 수행하면 **공개 베타 가능**.
