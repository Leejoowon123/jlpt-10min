# Play Console 내부 테스트 제출 체크리스트 (라운드 63)

Google Play **내부 테스트** 트랙에 JLPT10M 을 올리기 위한 제출 준비. 빌드/서명은 [android-release.md](android-release.md) 참조.

## 1. 앱 기본 정보

- 앱 이름: **JLPT10M**
- 패키지명(applicationId): **`com.jlpt10m.app`** (확정 후 변경 불가 — capacitor.config.json 의 appId 와 일치)
- 카테고리: 교육
- 무료 앱 · **광고 없음** · **인앱 결제 없음** · **외부 유료 API 없음**
- **로그인 필요 앱** — 이메일/비밀번호(Firebase Authentication). 비로그인 시 학습 화면 진입 불가.

## 2. 개인정보처리방침 URL (필수)

- 정적 페이지: [privacy.html](../privacy.html) → GitHub Pages 게시 URL
  - 예: `https://leejoowon123.github.io/jlpt-10min/privacy.html` (실제 Pages 경로로 확인)
- Play Console → **앱 콘텐츠 → 개인정보처리방침** 에 위 URL 입력.

## 3. 데이터 보안(Data safety) 신고 초안

Play Console → **앱 콘텐츠 → 데이터 보안**. 아래 기준으로 신고(전송 중 암호화 HTTPS, 사용자 삭제 요청 가능):

| 데이터 유형 | 수집? | 목적 | 비고 |
| --- | --- | --- | --- |
| **이메일 주소** | 예 | 계정 관리 | Firebase Auth 로그인 |
| **사용자 ID**(Firebase UID) | 예 | 앱 기능 · 계정 관리 | 이메일 아닌 식별자 |
| **앱 활동/상호작용**(userActivity 요약) | 예 | 앱 기능 · 분석 | 가입/접속/세션/이용시간 요약 |
| **사용자가 입력한 피드백** | 예 | 앱 기능 · 고객 지원 | rating/good/bad/wish/bug 등 |
| 위치 | 아니오 | — | 수집 안 함 |
| 연락처 | 아니오 | — | 수집 안 함 |
| 사진/동영상/파일 | 아니오 | — | 수집 안 함 |
| 결제 정보 | 아니오 | — | 수집 안 함 |
| 음성/오디오(STT 원문) | 아니오 | — | **저장 안 함** |
| 학습 답변 원문 | 아니오 | — | 정답 여부만, 원문 미저장 |

- **데이터 삭제 요청 경로 제공**: 가입 이메일과 함께 `joowon582@gmail.com` 으로 요청 → 계정/활동/피드백 삭제(가능 범위).

## 4. 콘텐츠 등급 / 대상

- **아동 대상 앱 아님** — 일반 학습 앱으로 분류(만 14세 미만은 보호자 동의 안내). "어린이용(Designed for Families)" 트랙 아님.
- 콘텐츠 등급 설문: 폭력/성적 콘텐츠 없음, 사용자 생성 콘텐츠는 피드백(비공개, 관리자만 열람).

## 5. 테스트 계정 (리뷰/내부 테스터용)

- 리뷰어가 로그인할 수 있도록 **테스트 계정 1개**를 준비해 Play Console "앱 액세스(App access)" 에 등록한다.
  - 이메일: 예) `tester@example.com` (실제 발급 계정 사용)
  - **비밀번호는 본 문서/저장소에 적지 말 것** — Play Console 입력란에 직접 넣거나 안전한 채널로만 전달.
- 내부 테스터: 이메일 목록(또는 Google 그룹) 등록 → 옵트인 링크 공유.

## 6. 업로드 / 배포 순서

1. [android-release.yml](../.github/workflows/android-release.yml) 로 **서명된 AAB**(`JLPT10M-release.aab`) 생성.
2. Realtime Database **운영 Rules Publish** 확인([firebase-logging.md](firebase-logging.md) 라운드 60 현행) + `admins/{uid}` 등록([admin.md](admin.md)).
3. Play Console → 앱 만들기(JLPT10M / com.jlpt10m.app).
4. **테스트 → 내부 테스트 → 새 버전** → AAB 업로드(Play 앱 서명 권장).
5. 앱 콘텐츠: 개인정보처리방침 URL, 데이터 보안, 콘텐츠 등급, 앱 액세스(테스트 계정), 타겟층 작성.
6. 검토 제출 → 통과 후 내부 테스터에게 링크 공유.

## 7. 제출 전 최종 확인

- [ ] `privacy.html` 이 게시 URL 로 열림(로그인 전에도 접근 가능)
- [ ] 앱 로그인/회원가입/비밀번호 재설정 동작(WebView + Firebase Auth, Authorized domains 에 `localhost` 포함)
- [ ] 운영 Rules Publish 완료(actionLogs/anonymousActivity read/write false)
- [ ] 데이터 보안 신고 = 위 표와 일치
- [ ] 테스트 계정 비밀번호는 문서/저장소에 없음(안전 채널)
- [ ] keystore/AAB/APK 가 git 에 커밋되지 않음
