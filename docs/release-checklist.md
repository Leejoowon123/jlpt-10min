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
- [ ] 활동 요약 payload(`userActivity`): allowlist 필드(firstSeenAt/createdAt/lastSeenAt/lastEventType/signedIn/sessionCount/totalActiveMs/lastRoute/platform/appVersion)만 — 이메일/비밀번호/답변 원문/STT 원문/이름/meta 상세 0 (smoke·qa 가드). **actionLogs/anonymousActivity 는 폐지(read/write false)** — 상세 로그 미저장(라운드 60)
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
- [ ] **TTS 테스트 재생** — 설정 → 음성 상태 → **「테스트 재생」** 클릭 시 「日本語」 가 실제로 들리고 "테스트 재생 성공" 표시
- [ ] **TTS(네이티브)** — 음성 상태 **"네이티브 TTS 사용 가능"** / 단어 발음 / 예문 발음 / 이야기 전체 재생 / 청해 듣기 / 속도 조절
- [ ] **TTS 실패 시 진단** — 테스트 재생 실패 시 reason(플러그인 미등록/메서드 없음/오류 message)·진단(플러그인·speak·마지막 오류) 표시
- [ ] **TTS 일본어 음성 미설치 시** — Android 설정 → 텍스트 음성 변환에서 일본어 음성 설치 안내가 보이고, 설치 후 재생되는지
- [ ] **(빌드 로그) 플러그인 등록 확인** — Actions run 의 Diagnostics step 에서 `npm ls @capacitor-community/text-to-speech` / `npx cap ls` 출력 + **`capacitor.plugins.json` 에 `TextToSpeech` 포함**(`OK: …등록됨` 줄) 확인 — 미등록(`WARN`)이면 APK 에 네이티브 TTS 가 빠진 것
- [ ] **(설정 진단) 플러그인 경로** — 음성 상태 진단 줄의 플러그인 경로가 `확정등록`(`plugins-map`) 또는 `프록시`(`register-plugin`) 로 보이고, 「테스트 재생」으로 실제 소리를 확정
- [ ] **STT** 인식 — 동작 여부(미지원 시 텍스트 폴백 동작 확인 → 다음 라운드 네이티브 검토)
- [ ] **Firebase 로그** — 온라인 시 actionLogs/userActivity 기록(원문 미기록 유지)
- [ ] **오프라인 실행** — 로그인 세션 있으면 앱 shell+학습 동작 / 로그 실패 비차단

## 4-f. 베타 피드백 / 관리자 (라운드 59 — 수동)

- [ ] **rules Publish** — [docs/admin.md](admin.md) 의 admins/feedback 포함 운영 rules 를 Realtime Database → Rules 에 적용·Publish (Firestore 아님)
- [ ] **관리자 UID 등록(다중)** — 관리자 계정(`jlpt10m@gmail.com` 등)으로 로그인 → Console → Authentication → Users 에서 UID 확인 → Realtime Database 데이터 탭에 `admins/{uid}: true`(**Boolean**) 추가. 현재 UID 2개: `SifCVwklMhMX36YhaC9jke2kosr2`, `QF4R89i3FQb0bMYe3uwXsxGddc72`
- [ ] **피드백 전송** — 설정 → "의견 보내기" → 만족도/텍스트 입력 → 전송 성공 안내 / 빈 내용 시 오류 안내 / 5초 쿨다운 동작
- [ ] **개인정보 안내** — 피드백 영역에 "비밀번호·개인정보 입력 금지" 문구 표시, 이메일이 저장되지 않음(`feedback/{id}` 에 uid 만)
- [ ] **관리자 진입** — 설정 화면 버전 줄 **7회 탭** → `#admin` → 관리자 계정이면 대시보드(가입자/활동/피드백), 비관리자면 "접근 권한이 없습니다" + 홈 복귀
- [ ] **권한 보호(중요)** — 비관리자 계정으로 `#admin` 직접 접근 시 데이터가 보이지 않음(rules 가 feedback/userActivity/actionLogs 읽기 차단). 프론트 검사만이 아님을 확인
- [ ] **읽기 전용** — 관리자 페이지에 삭제/차단 버튼이 없음(이번 라운드 정책)
- [ ] **로그 분리** — `actionLogs` 에 피드백 본문이 섞이지 않음(피드백은 `feedback/` 노드에만 저장)

## 4-g. 라운드 60 — Rules 적용 + APK 재빌드 (로그 단순화 후 필수)

순서대로 진행(상세: [docs/admin.md](admin.md)):

- [ ] **Rules Publish** — [firebase-logging.md](firebase-logging.md) "라운드 60 현행" rules 를 Realtime Database → **Rules** 탭에 붙여넣고 Publish (Firestore 아님). `actionLogs`/`anonymousActivity` = `read/write false`, `userActivity`/`feedback` = 본인 write + admin read
- [ ] **관리자 UID 확인(다중)** — 데이터 탭에 `admins/SifCVwklMhMX36YhaC9jke2kosr2 = true` + `admins/QF4R89i3FQb0bMYe3uwXsxGddc72 = true`(둘 다 Boolean) 가 있는지
- [ ] **새 APK 빌드** — GitHub Actions "Android APK (debug)" 재실행 → artifact 다운로드(JS 변경 반영)
- [ ] **설치 후 로그인** — 이메일 로그인 동작
- [ ] **학습 1회 진행** — 단어/문법/스토리 중 하나 수행
- [ ] **userActivity 갱신 확인** — Console → 데이터 → `userActivity/{내 uid}` 에 lastSeenAt/lastEventType/sessionCount/totalActiveMs/platform/appVersion 갱신
- [ ] **피드백 전송** — 설정 → "의견 보내기" → `feedback/{id}` 생성(이메일 미저장)
- [ ] **관리자 페이지 확인** — 버전 줄 7회 탭 → userActivity 통계(활동중/24h/7d) + 피드백 목록 표시, **actionLogs 섹션 없음**
- [ ] **actionLogs 신규 데이터 없음** — 학습/피드백 후 Console 에 `actionLogs` 신규 노드가 생기지 않는지(폐지 확인)
- [ ] **(선택) 기존 데이터 정리** — 백업 후 `actionLogs`/`anonymousActivity` 노드 수동 삭제(앱 영향 없음). `userActivity`/`feedback`/`admins` 는 삭제 금지

## 4-h. Play 내부 테스트 제출 (라운드 63 — 개인정보처리방침/데이터 보안)

상세: [docs/play-console-checklist.md](play-console-checklist.md) · 방침 본문: [privacy.html](../privacy.html)

- [ ] **privacy.html 접근 확인** — GitHub Pages URL(예 `https://leejoowon123.github.io/jlpt-10min/privacy.html`)이 열림
- [ ] **로그인 전 privacy 링크** — 로그인 화면 하단 "개인정보처리방침" 링크가 보이고 열림(비로그인 접근 가능)
- [ ] **설정 화면 privacy 링크** — 설정 하단에도 링크 노출
- [ ] **APK/PWA 에서 동작** — WebView 에서도 `./privacy.html` 열림(번들 포함)
- [ ] **Play Console 개인정보처리방침 URL 입력**
- [ ] **Data safety 신고 작성** — 이메일(계정관리)/UID(앱기능)/앱 활동(앱기능·분석)/피드백(앱기능·고객지원), 위치·연락처·사진·결제·STT·답변원문 = 수집 안 함
- [ ] **테스트 계정 준비** — 이메일 등록(앱 액세스), 비밀번호는 문서/저장소에 적지 않고 안전 채널로 전달
- [ ] 광고 없음 · 인앱결제 없음 · 아동 대상 아님 확인

## 4-i. 빌드 설정 / 버전 / 아이콘 / 삭제경로 (라운드 65 — 자동 주입 + 수동 확인)

상세: [docs/android-release.md](android-release.md) §3-A·3-B · [play-console-checklist.md](play-console-checklist.md)

- [ ] **targetSdk/compileSdk = 35** — release 워크플로 "Configure Android" 로그 확인 (Play target API: <https://developer.android.com/google/play/requirements/target-sdk>, 연도별 최소 레벨 **공식 재확인**)
- [ ] **versionCode 단조 증가** — run number 또는 입력값. 같은 versionCode 재업로드 금지 확인
- [ ] **versionName = APP_VERSION**(또는 입력) — 로그에서 확인
- [ ] **런처 아이콘 = 기본(Capacitor 생성) 아이콘 유지**(라운드 66 — 강제 주입 제거) — 설치 후 홈 화면 아이콘 확인. (브랜드 아이콘은 추후 @capacitor/assets 로 선택 적용)
- [ ] **계정/데이터 삭제 요청 경로** — 설정 화면에 노출 + privacy.html §6 동일 안내, uid 자동 포함
- [ ] Play 512 등록 아이콘 = `assets/icons/icon-512.png` 사용

## 4-j. Play 배포 직전 최종 게이트 (라운드 66)

마감 점검 — 아래가 모두 OK 면 내부 테스트/배포 진행:

- [ ] **관리자 접근** — 관리자 계정(`jlpt10m@gmail.com` 등) 로그인 → 데이터 탭 `admins/{uid}=true`(Boolean) → 설정 버전 줄 7회 탭 → 대시보드 표시. (Rules만으로는 isAdmin 안 됨 — [admin.md](admin.md) 경고 참조)
- [ ] **개인정보처리방침 URL** — `privacy.html` 게시 URL 이 열리고 **글자가 잘 보임**(라이트/다크 대비), 로그인 전에도 접근
- [ ] **Android 런처 아이콘 정책** — **기본(Capacitor) 아이콘 유지**(강제 주입 제거 확인). PWA 아이콘은 기존 유지
- [ ] **release APK 실기기 테스트** — `build_apk=true` 로 빌드한 release APK 설치 → 로그인/학습/TTS 테스트 재생/피드백/관리자/삭제 요청 경로 확인
- [ ] **release AAB 내부 테스트 업로드** — Play Console 내부 테스트 트랙에 AAB 업로드(versionCode 단조 증가 확인)
- [ ] **스토어 등록 자료** — [docs/store-listing.md](store-listing.md)의 짧은/긴 설명·태그·Data Safety·스크린샷(관리자 화면 제외) 준비, 개발자 연락처 jlpt10m@gmail.com
- [ ] **제출 직전 패키지** — [docs/play-submit-pack.md](play-submit-pack.md)로 입력값·파일·테스트계정·Firebase·인증 후 1~20단계·최종 게이트 일괄 확인
- [ ] **Firebase 확인** — 운영 Rules Publish / `admins/{uid}` 존재 / 로그인 후 `userActivity/{uid}` 갱신 / 피드백 `feedback/{id}` 생성
- [ ] **actionLogs 미생성** — 학습·피드백 후 Console 에 `actionLogs` 신규 노드가 **생기지 않음**(폐지 유지), `anonymousActivity` 도 없음

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
