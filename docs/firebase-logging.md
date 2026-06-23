# Firebase 로그인 + 최소 행동 로그 (테스트 단계)

## 현재 상태

- **테스트 브랜치에서 Firebase 연결 검증용** — Realtime Database 는 테스트 모드 rules.
- 운영(main 머지) 전에 반드시 아래 운영 rules 초안으로 교체할 것.
- 로그인 없이도 앱의 **모든 기능** 사용 가능 — 강제 로그인 없음.

## 구성

| 파일 | 역할 |
| --- | --- |
| `js/firebaseConfig.js` | 웹 config (placeholder — Console 값으로 채움). `isFirebaseConfigured()` |
| `js/firebaseClient.js` | lazy CDN ESM import. 실패 시 null — 앱 기능 유지 |
| `js/authService.js` | Email/Password 가입·로그인·로그아웃. 비밀번호 저장 금지 |
| `js/actionLogger.js` | 최소 행동 로그. fire-and-forget, 빈도 제한 |

## 기록하는 것 (이벤트 화이트리스트)

`app_open`(하루 1회) · `login_success` · `logout` · `study_start` ·
`story_open` · `story_complete` · `vocab_card_answered` · `grammar_answered` ·
`conversation_start` · `firebase_test`

이 외 타입은 `logAction` 이 거부한다.

## 기록하지 않는 것

- **비밀번호** (어디에도 저장 안 함 — Firebase SDK 세션만)
- **이메일 원문** (actionLogs 에는 uid/anon id 만)
- **STT 음성/인식 텍스트 원문**
- **학습 답변 원문** (correct true/false 만)
- **학습 데이터 전체** (진도 동기화 아님 — localStorage 진도와 완전 분리)
- meta 는 itemType/itemId/storyId/correct/method 만, 문자열 64자 제한

## DB 구조 (라운드 20 — 활동 노드 분리)

```
actionLogs/{YYYY-MM-DD}/{eventId}
  { type, at(ms), userKey, userType: 'signed-in'|'anonymous', level, route, meta }

userActivity/{uid}              ← 로그인 사용자만
  { firstSeenAt, lastSeenAt, lastEventType, signedIn: true }

anonymousActivity/{anonKey}     ← 비로그인 사용자 (분리 — rules 와 일치)
  { firstSeenAt, lastSeenAt, lastEventType, signedIn: false }
```

- `userKey`: 로그인 시 Firebase uid, 비로그인 시 localStorage 의
  `jlpt10min:anonId` (무작위 문자열 — 개인정보 아님).
- `eventId`: timestamp(base36) + random suffix.

## 실제 브라우저 + Firebase Console 확인 절차 (수동 QA)

1. `js/firebaseConfig.js` 의 `databaseURL` 이 **Console → Realtime Database 상단 URL 과 일치**하는지 확인 (리전별로 다름 — 다르면 조용히 실패).
2. Authentication → Settings → **Authorized domains** 에 배포 도메인 추가
   (`<user>.github.io`, 로컬 테스트는 `localhost` 기본 포함).
3. GitHub Pages(테스트 브랜치 배포) 또는 `python -m http.server` 로 앱 접속.
4. ⚙ 설정 → 계정 — 상태 배지가 "Firebase 연결 준비됨" 인지 확인
   ("초기화 실패" 면 config/네트워크 점검).
5. **회원가입** (테스트 계정) → 배지 "로그인됨" + 이메일 표시.
6. **로그아웃** → 폼 복귀. **로그인** 재시도 → 성공.
7. (라운드 21 — 로그 테스트 버튼은 제거됨) 대신 학습 행동을 1회 수행한 뒤
   Console 에서 actionLogs 기록을 직접 확인. 개발자는 브라우저 콘솔에서
   `import('./js/actionLogger.js').then(m => m._sendTestLogForTest().then(console.log))` 로도 확인 가능.
8. 이야기 열기 / 학습 시작 / 단어 카드 1문제 답변.
9. Firebase Console → Realtime Database 에서 확인:
   - `actionLogs/{오늘 날짜}` — firebase_test / story_open / study_start / vocab_card_answered / login_success
   - `userActivity/{uid}` (로그인 행동) / `anonymousActivity/{anonKey}` (비로그인 행동)
10. **로그 내용 점검**: 이메일/비밀번호/답변 원문이 어디에도 없는지 — userKey 는 uid 또는 anon_ 문자열만.

## 무료 범위 보호

- `app_open` — 하루 1회 (`jlpt10min:appOpenLogged` localStorage marker).
- 같은 (type + 대상) 이벤트 — `ACTION_LOG_MIN_INTERVAL_MS = 3000` 내 중복 차단.
- answer 로그는 vocab/grammar 만 (영역 샘플 한정).
- Firebase 미설정/실패 시 즉시 noop — 호출 비용 0.

## 운영 rules 초안 (라운드 20 보강판 — ⚠ 폐기, 아래 "라운드 60 현행" 으로 대체)

> ⚠ 이 블록은 **역사적 기록**이다(actionLogs 쓰기 허용 시절). **적용하지 말 것** — 현행 rules 는
> 아래 "운영 rules — actionLogs 폐지 + userActivity 단일화 (라운드 60, 현행)" 을 사용한다.

```json
{
  "rules": {
    "actionLogs": {
      "$date": {
        "$eventId": {
          ".read": false,
          ".write": "newData.exists()",
          ".validate": "newData.hasChildren(['type','at','userKey','userType'])"
        }
      }
    },
    "userActivity": {
      "$userKey": {
        ".read": false,
        ".write": "auth != null && auth.uid === $userKey",
        ".validate": "newData.hasChildren(['lastSeenAt','lastEventType','signedIn'])"
      }
    },
    "anonymousActivity": {
      "$anonKey": {
        ".read": false,
        ".write": "newData.exists()",
        ".validate": "newData.hasChildren(['lastSeenAt','lastEventType','signedIn'])"
      }
    },
    ".read": false,
    ".write": false
  }
}
```

설명:
- `actionLogs` — 쓰기는 허용하되 `.validate` 로 필수 필드 스키마 강제, 삭제 불가(`newData.exists()`), 읽기 전면 차단.
- `userActivity` — **로그인한 본인(uid 일치)만** 쓰기 가능. 익명 위장 쓰기 차단.
- `anonymousActivity` — 비로그인 로그용. 스키마 검증만 (익명 특성상 본인 확인 불가).
- 루트 기본 `.read/.write: false` — 위 노드 외 전부 차단.

## 운영 rules — actionLogs 폐지 + userActivity 단일화 (라운드 60, **현행**)

**라운드 60 정책 전환**: 상세 행동 로그(`actionLogs`)를 **폐지**한다 — 무료 **Spark** 운영(쓰기/저장 절감)과 프라이버시를 위해
사용자당 `userActivity/{uid}` **한 노드만** 갱신한다(가입/접속/세션/이용시간 요약). `actionLogs`·`anonymousActivity`
모두 **read/write false**. 클라이언트(`actionLogger.logAction`)도 더 이상 `actionLogs` 에 쓰지 않는다.

아래 JSON 을 **Firebase Console → Build → Realtime Database → Rules 탭**에 붙여넣고 Publish (Firestore Rules 아님,
테스트 모드 rules 금지):

```json
{
  "rules": {
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      ".write": false,
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).val() === true)"
      }
    },
    "feedback": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      ".write": false,
      "$feedbackId": {
        ".write": "auth != null && !data.exists() && newData.child('uid').val() === auth.uid",
        ".validate": "newData.hasChildren(['createdAt','uid'])"
      }
    },
    "userActivity": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      "$userKey": {
        ".read": "auth != null && auth.uid === $userKey",
        ".write": "auth != null && auth.uid === $userKey",
        ".validate": "newData.hasChildren(['lastSeenAt','lastEventType','signedIn'])"
      }
    },
    "actionLogs": {
      ".read": false,
      ".write": false
    },
    "anonymousActivity": {
      ".read": false,
      ".write": false
    },
    ".read": false,
    ".write": false
  }
}
```

설명:
- `admins` — **Console 에서만 관리**(`.write:false`). 관리자 식별은 **UID 기준**(`admins/{uid}===true`). 각 사용자는 자기 노드만, 관리자는 전체를 읽는다. 설정 절차는 [admin.md](admin.md).
- `feedback` — 로그인 사용자가 **자기 uid 로 신규 작성만**(`!data.exists()` → 수정/삭제 불가). 읽기는 **admin only**. 저장 필드는 `rating, good, bad, wish, bug, contactOk, appVersion, platform, createdAt, uid` (필수 검증은 `createdAt`/`uid` 만 — 나머지는 선택값이라 강제하지 않아 쓰기 실패를 막는다). 이메일/비밀번호는 저장하지 않음.
- `userActivity` — 로그인 **본인(uid 일치)만 쓰기/읽기** + **admin 전체 읽기**(대시보드 집계). 저장 필드는 `firstSeenAt, createdAt, lastSeenAt, lastEventType, signedIn, sessionCount, totalActiveMs, lastRoute, platform, appVersion`. `.validate` 는 `lastSeenAt/lastEventType/signedIn` 만 요구.
- `actionLogs` — **폐지(read/write false)**. 상세 행동 로그를 저장/조회하지 않는다(Spark 절감 + 프라이버시). 관리자 페이지도 읽지 않는다.
- `anonymousActivity` — **폐지(read/write false)**. 기존 데이터는 삭제하지 않고 보존(코드에서 더 이상 쓰지 않음).
- 루트 기본 `.read/.write: false`.

#### payload ↔ rules 정합 최종 확인 (라운드 60)
실제 코드 출력과 위 rules 를 대조 — **일치 확인**:

| 노드 | 실제 payload | rules 요구 | 정합 |
| --- | --- | --- | --- |
| userActivity | `{firstSeenAt, createdAt, lastSeenAt, lastEventType, signedIn:true, sessionCount, totalActiveMs, lastRoute, platform, appVersion}` | `auth.uid===$userKey` · `.validate [lastSeenAt,lastEventType,signedIn]` | ✅ |
| feedback | `{rating, good, bad, wish, bug, contactOk, appVersion, platform, createdAt, uid}` | `!data.exists()` · `uid===auth.uid` · `.validate [createdAt,uid]` | ✅ |
| actionLogs | (쓰기 없음 — 폐지) | `.write:false` | ✅ |
| anonymousActivity | (쓰기 없음 — 폐지) | `.write:false` | ✅ |

> 비로그인 시 `resolveUser()→null→logAction noop`. `logAction` 은 `userActivity/{uid}` 한 노드만 갱신하며 `actionLogs` 에 쓰지 않는다.
> smoke(`actionLogs 미기록` / `userActivity allowlist`) + qa [134]/[235]/[245] 가 이 정합을 상시 잠근다.

### Authorized domains (로그인 필수 → 필수 확인)
Firebase Console → Authentication → Settings → **Authorized domains** 에 배포 도메인이 있어야 이메일 로그인이 동작한다:
- `localhost` (기본 포함 — 로컬 개발)
- **GitHub Pages 도메인** `leejoowon123.github.io` (공개 배포 — 없으면 로그인 팝업/요청이 차단되어 앱 진입 불가)

### 비밀번호 재설정 (라운드 52)
로그인 화면 **"비밀번호를 잊으셨나요?"** → `authService.resetPassword(email)` → Firebase `sendPasswordResetEmail`.
- **이메일 템플릿**: Firebase Console → Authentication → **Templates → 비밀번호 재설정(Password reset)** 에서 발신자명/제목/본문/언어를 수정할 수 있다. (기본 영문 → 필요 시 한국어로 변경 권장)
- **Authorized domains**: 재설정 메일의 링크가 동작하려면 위 Authorized domains 에 배포 도메인이 등록돼 있어야 한다.
- **무료 범위/요청 제한**: Firebase Auth 무료 쿼터 내에서 발송되나, 동일 이메일/IP 의 과도한 요청은 `auth/too-many-requests` 로 제한된다(앱은 한국어 안내).
- **프라이버시**: 재설정 요청은 `actionLogs` 에 **기록하지 않는다**(이메일 미기록). 존재하지 않는 계정(`user-not-found`)도 중립 성공 메시지로 응답해 계정 존재 여부를 과도하게 노출하지 않는다.

### payload ↔ rules 일치 확인 (라운드 21 점검 완료)

| 노드 | rules `.validate` 필수 | 코드 payload | 일치 |
| --- | --- | --- | --- |
| actionLogs | type, at, userKey, userType | type, at, userKey, userType, level, route, meta | ✅ (필수 4종 항상 포함) |
| userActivity | lastSeenAt, lastEventType, signedIn | firstSeenAt, lastSeenAt, lastEventType, signedIn | ✅ |
| anonymousActivity | lastSeenAt, lastEventType, signedIn | firstSeenAt, lastSeenAt, lastEventType, signedIn | ✅ |

`meta`/`route` 를 rules 필수로 요구하지 않는 이유:
- RTDB 는 **빈 객체(`meta: {}`)를 저장 시 제거**한다 — app_open/login_success/logout 처럼
  meta 가 빈 이벤트는 `hasChildren(['meta'])` 검증에 걸려 거부된다. 따라서 meta 는 비필수.
- `route` 도 빈 문자열일 수 있어 필수로 강제하지 않는다 (빈 문자열 자체는 저장됨).
즉 **rules 가 코드 payload 를 거부하는 케이스 없음** — qa mock + 수동 절차로 재확인.

## Firebase Console 에서 rules 적용 위치

```
Firebase Console (console.firebase.google.com)
→ 프로젝트(jlpt-10min) 선택
→ 좌측 Build → Realtime Database
→ 상단 "Rules" 탭
→ 위 운영 rules JSON 붙여넣기
→ "Publish(게시)" 클릭
```

⚠ 주의:
- **Firestore Rules 가 아니라 Realtime Database Rules** — 좌측 메뉴에서 Firestore 와 혼동 금지.
- 테스트 모드 rules(전체 open / 30일 만료형) 그대로 **main 배포 금지**.
- main merge 전 Publish 필수 — Publish 즉시 반영, 배포 절차 별도 없음.

한계 (명시):
- **클라이언트 전용 정적 앱에서는 익명 write 남용을 완전히 막기 어렵다** —
  actionLogs/anonymousActivity 는 스키마만 맞으면 누구나 쓸 수 있다.
- 운영 전 **App Check**(reCAPTCHA v3/Enterprise) 적용을 검토 — config 만으로의
  대량 봇 쓰기를 차단하는 현실적 수단.
- 더 강한 방어가 필요하면 Cloud Functions 경유 기록(서버 검증)으로 이전.

### App Check 도입 분류 (라운드 48)

- **지금 필수: 아니오.** 공개 베타 차단 요인이 아니다. 근거 — (1) 로그는 행동 메타(allowlist)만 기록,
  민감정보 0 이라 유출 위험이 낮고, (2) 운영 Realtime DB rules 가 스키마/경로를 제약하며,
  (3) 로그인 없이도 학습이 전부 동작해 로그 자체가 핵심 기능이 아니다.
- **나중에 권장: 예.** 익명 write 남용/봇 대량 쓰기 방어를 위해 베타 운영 중 트래픽을 보고
  reCAPTCHA v3 기반 App Check 적용을 권장. 비용 0(무료 쿼터 내), 정적 앱 호환.
- **에스컬레이션 기준**: anonymousActivity/actionLogs 에 비정상 대량 쓰기가 관측되면 App Check → 그래도
  부족하면 Cloud Functions 서버 검증 기록으로 단계 상향.

## main 병합 전 체크리스트 (라운드 21 최종판)

- [ ] Realtime Database → Rules 에 위 운영 rules 적용 (위치: 위 "Console 에서 rules 적용 위치")
- [ ] **Publish 완료** (테스트 모드 rules 로 main 배포 금지)
- [ ] Authorized domains 에 GitHub Pages 도메인(`<user>.github.io`) 등록
- [ ] `databaseURL` 이 Console 의 Realtime Database URL 과 일치
- [ ] 테스트 브랜치에서 로그인/로그아웃 확인
- [ ] 테스트 브랜치에서 학습/스토리 행동 로그가 actionLogs 에 기록되는지 확인
- [ ] 로그에 이메일/비밀번호/답변 원문이 없는지 확인
- [ ] **로그 테스트 버튼이 UI 에서 제거됐는지 확인** (라운드 21 — smoke 가 자동 검증)
- [ ] `node smoke.mjs` + `node qa.mjs` 통과
- [ ] App Check 적용 여부 결정 (남용 방어 — 선택)
- [ ] 테스트 중 쌓인 actionLogs 정리 (선택)
- [ ] PR merge

## public GitHub 주의사항

- **Firebase Web config 는 public 가능** — apiKey 는 식별자이지 비밀키가 아니다.
- **절대 커밋 금지**: service account JSON, Admin SDK private key, 서버 비밀키.
- Realtime Database rules 가 전체 open(`.read/.write: true`) 상태로 운영되면 위험 —
  현재는 테스트 브랜치 검증용이며, main 머지 전 위 운영 rules 로 교체한다.
