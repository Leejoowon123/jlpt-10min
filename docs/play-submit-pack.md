# Play 제출 직전 패키지 (라운드 69)

개발자 계정 **인증 대기 중** — 아직 Play Console 앱은 만들지 않은 상태. 인증이 풀리면 **이 문서 하나로 입력/업로드**가 끝나도록
현재 준비된 자료(등록 문구·스크린샷·개인정보처리방침·AAB/APK·Firebase 운영)를 한곳에 모은 제출 직전 체크 패키지.

> 연관 문서: 등록 문구 [store-listing.md](store-listing.md) · 제출 절차 [play-console-checklist.md](play-console-checklist.md) ·
> 빌드/서명 [android-release.md](android-release.md) · 관리자 [admin.md](admin.md) · Rules [firebase-logging.md](firebase-logging.md) · 방침 [privacy.html](../privacy.html)

## A. Play Console 입력 값 요약 (복사용)

| 입력란 | 값 |
| --- | --- |
| 앱 이름 | **JLPT10M** |
| 패키지명(applicationId) | `com.jlpt10m.app` |
| 카테고리 | 교육(Education) |
| 가격 / 광고 / 인앱결제 | 무료 / 없음 / 없음 |
| 기본 언어 | 한국어 |
| 짧은 설명 | [store-listing.md](store-listing.md) §2 (54자) |
| 긴 설명 | [store-listing.md](store-listing.md) §3 (≤4000자) |
| 개인정보처리방침 URL | `https://leejoowon123.github.io/jlpt-10min/privacy.html` ※실제 Pages 경로 확인 |
| 개발자 연락처 이메일 | **jlpt10m@gmail.com** |
| 콘텐츠 등급 | 일반 학습 앱(폭력/성적 없음), 아동 대상 아님 |
| 타깃 SDK | 35 (release 워크플로 자동 주입) |

## B. 업로드할 파일 목록

| 파일 | 무엇 | 출처 |
| --- | --- | --- |
| `JLPT10M-release.aab` | **내부 테스트 업로드용(필수)** | Actions "Android Release" → artifact `jlpt10m-release-aab` |
| `JLPT10M-release.apk` | 직접 설치 검증용(선택) | 같은 워크플로에서 `build_apk=true` → artifact `jlpt10m-release-apk` |
| 스크린샷 PNG ×4~5 | 등록정보 그래픽 | 아래 §C 규칙대로 캡처 |
| (선택) 512 아이콘 | 등록정보 고해상도 아이콘 | `assets/icons/icon-512.png` |

> debug APK(`JLPT10M-debug.apk`, artifact `jlpt10m-debug-apk`)는 **개발용 — Play 업로드 금지**.
> `*.aab`/`*.apk`/`*.keystore`/`key.properties` 는 git 커밋 금지(.gitignore 강제).

### AAB/APK artifact 보관 위치
- GitHub → **Actions → "Android Release (AAB/APK)" → 해당 run → Artifacts**.
- artifact 보관 기간 14일(워크플로 `retention-days`). 만료 전 다운로드해 로컬/안전 저장소에 보관.
- 동일 빌드 재현이 필요하면 같은 ref + 같은 `version_code` 입력으로 재실행(versionCode 미입력 시 run number 라 값이 바뀜).

## C. 스크린샷 파일명 규칙

- 형식: PNG, 9:16(권장 1080×1920), 모바일 360px 폭 기준 잘림 없음. 더미 계정으로 캡처(개인정보 노출 금지).
- 파일명(정렬·식별용):

| 파일명 | 화면 |
| --- | --- |
| `01-login.png` | 로그인 |
| `02-home.png` | 홈 |
| `03-vocab-card.png` | 단어 카드 |
| `04-story-player.png` | 이야기 플레이어 |
| `05-settings.png` (또는 `05-review.png`) | 설정 또는 복습 |

> ⚠ **관리자 화면(#admin) 스크린샷 금지.** 캡처 가이드 상세: [store-listing.md](store-listing.md) §7.

## D. 테스트 계정 준비 항목

- [ ] 리뷰어용 **일반 테스트 계정 1개** 발급(예 `tester@example.com`) — 실제 로그인 가능
- [ ] 비밀번호는 **문서/저장소에 미기재** — Play Console "앱 액세스" 입력란/안전 채널로만 전달
- [ ] 테스트 계정은 **관리자 아님**(admins 노드에 추가하지 않음)
- [ ] 내부 테스터 이메일 목록(또는 Google 그룹) 준비

## E. Firebase 운영 확인 항목

- [ ] **운영 Rules Publish** — [firebase-logging.md](firebase-logging.md) "라운드 60 현행"(actionLogs/anonymousActivity `read/write false`, feedback 본인 write·admin read, userActivity 본인 read·write + admin read)
- [ ] **관리자 UID 2개 데이터 등록**(Boolean `true`, 문자열 "true" 금지):
  - `admins/SifCVwklMhMX36YhaC9jke2kosr2 = true`
  - `admins/QF4R89i3FQb0bMYe3uwXsxGddc72 = true`  (jlpt10m@gmail.com)
- [ ] **Authorized domains** 에 `localhost` 포함(androidScheme https → `https://localhost`) — 없으면 APK 로그인 불가
- [ ] 로그인 후 `userActivity/{uid}` 갱신 / 피드백 `feedback/{id}` 생성 / **actionLogs 신규 노드 미생성** 확인

## F. Data Safety 입력 요약

전송 암호화(HTTPS) · 사용자 삭제 요청 가능. [store-listing.md](store-listing.md) §6 / [privacy.html](../privacy.html) 와 **동일하게** 입력:

| 데이터 | 수집 | 목적 |
| --- | --- | --- |
| 이메일 주소 | 예 | 계정 관리 |
| 사용자 ID(Firebase UID) | 예 | 앱 기능·계정 관리 |
| 앱 활동(userActivity 요약) | 예 | 앱 기능·분석 |
| 사용자 피드백(feedback) | 예 | 앱 기능·고객 지원 |
| 비밀번호 원문 / 학습 답변 원문 / STT 음성·인식 원문 | **아니오** | 저장 안 함 |
| 결제 / 위치 / 연락처 / 사진·동영상·파일 | **아니오** | 미사용 |

- 데이터 삭제 요청: `jlpt10m@gmail.com`(앱 내 설정 → "계정 및 데이터 삭제 요청"과 동일).

## G. 앱 액세스(App access) 입력 문구 (복사용)

```
이 앱은 모든 기능 이용에 이메일 로그인이 필요합니다.
아래 테스트 계정으로 로그인하면 홈·학습(단어/문법/독해/청해)·이야기·복습·설정 등 모든 화면을 확인할 수 있습니다.

테스트 계정 이메일: (리뷰어용 발급 계정)
비밀번호: (Play Console 이 입력란에 직접 입력)

비고: 관리자 전용 화면은 일반 사용자/리뷰어에게 노출되지 않으며 앱 평가와 무관합니다.
```

## H. 인증 해제 후 진행 순서 (1~20)

1. 서명 keystore 생성([android-release.md](android-release.md) §1) — 아직 없으면.
2. base64 인코딩 후 GitHub Secrets 4종 등록(`ANDROID_KEYSTORE_BASE64`/`_PASSWORD`/`KEY_ALIAS`/`KEY_PASSWORD`).
3. Firebase Console → Realtime Database → **Rules Publish**(현행 운영 rules).
4. Firebase 데이터 탭에 **admins UID 2개**(Boolean true) 등록.
5. Authorized domains 에 `localhost` 확인.
6. GitHub Actions **"Android Release"** 실행 → AAB 생성(필요 시 `build_apk=true`).
7. "Configure Android" 로그에서 **targetSdk 35 / versionCode(run number) / versionName** 확인.
8. artifact `jlpt10m-release-aab` 다운로드 → `JLPT10M-release.aab` 확보.
9. (선택) release APK 실기기 설치 → 로그인/학습/TTS 테스트 재생/피드백/삭제 요청 경로 확인.
10. privacy.html 을 GitHub Pages 에 게시 → **URL 접속 확인**(로그인 전에도 열림).
11. Play Console 인증 완료 확인 → **앱 만들기**(JLPT10M, 한국어, 앱/무료).
12. 패키지명 `com.jlpt10m.app` 설정(확정 후 변경 불가 — 신중).
13. **내부 테스트 트랙 생성** → AAB 업로드(Play 앱 서명 권장).
14. 등록정보 입력 — 짧은/긴 설명·아이콘·스크린샷(§C, 관리자 화면 제외).
15. **개인정보처리방침 URL** 입력(§A).
16. **Data Safety** 작성(§F — privacy 와 일치).
17. **콘텐츠 등급 설문** + 타깃층(아동 아님) + 광고 없음 선언.
18. **앱 액세스** 에 테스트 계정 등록(§D·G) — 비번은 입력란에 직접.
19. 내부 테스터 이메일/그룹 등록 → 검토 제출.
20. 통과 후 **옵트인 링크 공유** → 테스터 설치/피드백 → (이상 없으면) 다음 트랙 승격 검토.

## I. 내부 테스트 제출 전 최종 확인 (제출 게이트)

- [ ] AAB 빌드됨 · versionCode 가 이전 업로드보다 큼(또는 첫 업로드)
- [ ] targetSdk 35 · 런처 아이콘 = 기본(Capacitor) 유지(라운드 66 정책)
- [ ] privacy.html 게시 URL 접속됨 · 라이트/다크 글자 가독 OK · 로그인 전 접근
- [ ] 짧은 설명 ≤80자 · 긴 설명 ≤4000자 · 비공식 안내 포함 · 공식 사칭 표현 없음
- [ ] Data Safety = privacy = store-listing §6 일치
- [ ] 광고/인앱결제 없음 · 위치/연락처/사진/파일 권한 없음
- [ ] 운영 Rules Publish · admins UID 2개 등록 · Authorized domains localhost
- [ ] actionLogs/anonymousActivity 신규 데이터 없음(폐지 유지)
- [ ] 테스트 계정 발급 · 앱 액세스 등록 · 비번 비기재 · 관리자 권한 미부여
- [ ] 스크린샷 4~5장 · 관리자 화면/개인정보 미포함
- [ ] 개발자 연락처 = jlpt10m@gmail.com (전 채널 통일)
- [ ] keystore/AAB/APK/key.properties git 미커밋
- [ ] node smoke.mjs / node qa.mjs / npm run content:report 통과
