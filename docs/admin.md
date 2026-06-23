# 관리자 페이지 + 베타 피드백 (라운드 59)

베타 운영용 **읽기 전용 관리자 대시보드**와 **사용자 피드백 수집** 기능. 콘텐츠 변경 없음.

## 핵심 보안 원칙

> **프론트엔드 검사는 보안이 아니다.** 이스터에그 진입과 이메일 비교는 "숨김 UI"일 뿐이며,
> 실제 데이터 보호는 **Firebase Realtime Database Rules** 가 담당한다.

- 관리자 식별은 **Firebase UID 기준** — DB 의 `admins/{uid} === true` 로 판정(이메일 비교 아님).
- `#admin` 진입은 설정 화면의 **버전 줄 7회 탭(이스터에그)** 으로만 노출 — 일반 메뉴/탭에 없음. 하지만 이는 보호 수단이 아니다.
- 비관리자가 `#admin` 에 직접 접근해도: ① `isAdmin()` 이 false → "접근 권한이 없습니다", ② 설령 UI 를 우회해도 rules 가 `feedback`/`userActivity`/`actionLogs` 읽기를 admin 으로 차단.
- 코드의 `ADMIN_EMAIL_HINT`(`joowon582@gmail.com`)는 **화면 표시용**일 뿐 권한 판정에 쓰지 않는다.

## joowon582@gmail.com 을 관리자로 만들기 (사용자 수동 작업)

1. 앱에서 **`joowon582@gmail.com` 으로 회원가입/로그인** 한다(이메일 로그인 필수 앱).
2. **Firebase Console → Authentication → Users** 에서 해당 계정의 **User UID** 를 복사한다.
   - 이 프로젝트의 현재 관리자 UID: **`SifCVwklMhMX36YhaC9jke2kosr2`** (joowon582@gmail.com). Console 의 값과 일치하는지 반드시 확인 — 다르면 계정을 다시 만들었거나 다른 프로젝트일 수 있다.
3. **Firebase Console → Build → Realtime Database → 데이터(Data) 탭** 에서 다음 노드를 추가한다:
   ```
   admins
     └─ SifCVwklMhMX36YhaC9jke2kosr2 : true     ← Boolean true (문자열 "true" 아님)
   ```
   (또는 rules 에 임시로 `ADMIN_UID` 를 넣어 가져오는 방식도 가능하나, **데이터 노드 `admins/{uid}` 방식 권장** — 코드 수정/재배포 없이 관리자 추가/회수 가능.)
4. 아래 **운영 rules** 를 **Rules 탭** 에 붙여넣고 **Publish**.
5. 앱에서 설정 화면 → **버전 줄을 7번 연속 탭** → 관리자 대시보드가 보이면 성공.

> **왜 이메일이 아니라 UID 인가**: 이메일은 변경/위장 가능하고 클라이언트가 자유롭게 보낼 수 있어 신뢰할 수 없다.
> UID 는 Firebase Auth 가 발급/검증하는 식별자라 rules 의 `auth.uid` 와 직접 대조할 수 있다.
> 코드의 `ADMIN_EMAIL_HINT`(`joowon582@gmail.com`)는 표시용 문구일 뿐, 권한 판정은 위 UID + rules 가 한다.

> ### ⚠ 꼭 확인 — 관리자가 안 될 때 1순위 원인
> - 관리자 판정은 **Firebase UID 기준**이다(이메일 아님).
> - **반드시 Realtime Database 의 "데이터(Data)" 탭**에 `admins/{내 UID} = true` 노드를 **데이터로** 추가해야 한다.
>   앱의 `isAdmin()`([js/feedbackService.js](../js/feedbackService.js))은 **DB 의 `admins/{uid}` 값을 읽어** 판정한다.
> - **Rules 텍스트에 UID 를 넣는 것만으로는 `isAdmin()` 이 true 가 되지 않는다.** Rules 는 "누가 무엇을 읽고 쓸 수 있는가"만
>   강제할 뿐, 앱이 읽는 **데이터 노드 자체**(`admins/{uid}`)를 만들어 주지는 않는다. 데이터 노드가 없으면 `isAdmin()` 은 false →
>   관리자 페이지는 "접근 권한이 없습니다".
> - 값은 **Boolean `true`** 여야 한다. **문자열 `"true"` 는 안 된다**(`isAdmin()` 은 `=== true` 로 비교).
> - 즉 **둘 다 필요**: ① 데이터 노드 `admins/{uid}=true`(앱의 isAdmin 통과용) + ② 운영 Rules Publish(서버 읽기 권한 enforcement용).

## Rules 적용 절차 (Firebase Console — 그대로 따라하기)

1. **Firebase Console**(console.firebase.google.com) → 프로젝트 **jlpt-10min** 선택.
2. 좌측 **Build → Realtime Database** → 상단 **"Rules"** 탭. (⚠ **Firestore Rules 아님** — 좌측 메뉴에서 Firestore 와 혼동 금지)
3. 아래 [firebase-logging.md](firebase-logging.md) 의 **"라운드 60 현행"** 전체 rules JSON 을 복사해 붙여넣는다(테스트 모드 rules 금지).
4. **"게시(Publish)"** 클릭 — 즉시 반영(별도 배포 절차 없음).
5. **데이터 탭**에서 `admins/SifCVwklMhMX36YhaC9jke2kosr2 = true` 가 있는지 확인.
6. 정합 체크: 새 rules 는 `actionLogs`/`anonymousActivity` 가 **`read/write false`**, `userActivity`/`feedback` 는 본인 write + admin read.

## 기존 actionLogs / anonymousActivity 데이터 정리 (선택 — 수동, 코드 자동삭제 금지)

라운드 60부터 `actionLogs`/`anonymousActivity` 에는 **신규 쓰기가 없다**(rules 가 `write:false`). 과거에 쌓인 데이터는
앱 동작에 영향이 없으므로 그대로 둬도 되지만, 저장량을 회수하려면 **Console 에서 수동 삭제**할 수 있다(코드로 자동 삭제하지 않는다):

1. (권장) **삭제 전 백업** — Console → Realtime Database → 우측 **⋮ → JSON 내보내기(Export JSON)** 로 전체 백업.
2. **Console → Build → Realtime Database → 데이터(Data) 탭**.
3. `actionLogs` 노드에 마우스를 올려 **× (삭제)** → 확인.
4. `anonymousActivity` 노드도 동일하게 **삭제**.
5. **삭제해도 앱 기능·관리자 페이지에 영향 없음**(둘 다 더 이상 읽지/쓰지 않음).
6. ⚠ **`userActivity` / `feedback` / `admins` 노드는 삭제하지 말 것** — 활동 요약·피드백·관리자 권한이 사라진다.

## 운영 Rules (admins / feedback 추가분 — Publish 필요)

전체 rules 는 [firebase-logging.md](firebase-logging.md) 의 "운영 rules — 로그인 필수 정책(현행)" 에 통합되어 있다.
관리자/피드백 관련 핵심 부분:

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
    }
  }
}
```

> 전체 rules(루트 기본 `.read/.write:false` 포함)는 [firebase-logging.md](firebase-logging.md) 의 "라운드 60 현행" 블록이 단일 소스다.

설명:
- `admins` — Console 에서만 관리(`.write:false`). 각 사용자는 자기 `admins/{uid}` 만 읽어 본인 권한을 확인하고, 관리자는 전체를 읽는다.
- `feedback` — **로그인 사용자가 자기 uid 로 신규 작성만**(`!data.exists()` → 수정/덮어쓰기 불가). 읽기는 **admin only**. 필드: `rating, good, bad, wish, bug, contactOk, appVersion, platform, createdAt, uid`(필수 검증은 `createdAt`/`uid`).
- `userActivity` — 본인 쓰기/읽기 + **admin 전체 읽기**(대시보드 집계용).
- `actionLogs` / `anonymousActivity` — **폐지(read/write false)**. 상세 로그를 저장/조회하지 않는다(라운드 60 — Spark 절감 + 프라이버시).

## 관리자 대시보드에서 보는 것 (읽기 전용 · userActivity 중심)

- 총 사용자 수, **활동중(5분)** · 최근 24시간 · 최근 7일 활동 수
- `userActivity` 목록 — uid · 가입일(createdAt/firstSeenAt) · 최근 접속(lastSeenAt) · **활동 상태**(5분 내 활동중 / 30분 내 최근 활동 / 그 외 비활동, lastSeenAt 기준 계산) · 세션 수(sessionCount) · 누적 이용시간(totalActiveMs, 근사) · 최근 이벤트(lastEventType) · 플랫폼/버전 · **uid 복사**
- 피드백 목록/상세(만족도 · 좋은 점/불편한 점/추가 희망/오류 · 플랫폼/버전/시각 · uid)
- **상세 행동 로그(actionLogs) 표시 없음** — 폐지됨
- **삭제/차단/사용자 관리 write 기능 없음**(읽기 전용)

> **활동중 여부는 실시간 presence 로 DB 에 저장하지 않는다** — 관리자 UI 가 `lastSeenAt` 으로 계산한다.
> `onDisconnect` presence 는 다음 라운드 후보(베타에서는 과투자 회피).
> **동시성 한계**: `userActivity` 갱신은 get→set 방식이라 동시 접속 시 마지막 쓰기가 이긴다(세션/이용시간 근사). 베타 허용 한계로 문서화하며, 정밀화가 필요하면 transaction/서버 집계로 상향.

## 피드백 저장 구조 / 프라이버시

```
feedback/{feedbackId}
  { rating(1~5|null), good, bad, wish, bug, contactOk, appVersion, platform, createdAt, uid }
```

- 사용자가 직접 입력한 텍스트이므로 저장된다 — 설정 화면에 **"비밀번호·개인정보 입력 금지"** 안내 표시.
- **userEmail/비밀번호는 저장하지 않는다**(uid 만).
- **`actionLogs` 와 분리** — 피드백 본문은 `actionLogs` 에 절대 남기지 않는다(혼동 금지).
- 로컬 가드: 연속 전송 5초 쿨다운 + 하루 10회 제한(무료 범위/오발송 보호). 전송 실패는 사용자에게 안내(조용히 삼키지 않음).
