# 기능 명세 (Features)

앱의 모든 화면/학습 동작의 source of truth. (README 에서 이동)
데이터 스키마는 [data-models.md](./data-models.md), 콘텐츠 규칙은 [content-policy.md](./content-policy.md) 참조.

## 브랜딩 / 테마 (라운드 54)

- **브랜드명**: **JLPT10M** (텍스트 워드마크 — "JLPT" + 주홍 강조 "10M", `.wm-accent`). 공식 JLPT/일본 정부/국기 로고와 무관한 비공식 학습 앱.
- **팔레트**: 먹색(ink) + 주홍(vermilion `--accent`) + 종이(washi) 톤. 다크=먹 배경(`#1b1815`), 라이트=종이 배경(`#f6f1e7`). 디자인 토큰은 `styles.css` `:root`/`[data-theme]` 변수로 관리(한 가지 네이비 단색 탈피).
- **컴포넌트 통일**: `.btn.primary`(주홍 솔리드)·`.chip.active`(주홍 선택 강조)·카드/여백 정돈. 모바일 360px 밀도 고려.
- **아이콘**: 먹 배경 + 종이 원 + 주홍 점(印/seal 느낌). `tools/gen-icons.mjs` 로 재생성. manifest theme/background = `#1b1815`.

## 로그인 필수 정책 (라운드 50)

- **앱 사용에 이메일 로그인이 필요하다.** 진입 시 `app.js` 가 `initAuth()`/`observeAuth()` 로 인증 상태를
  확인하고, 확인 중에는 로딩 화면(`renderAuthLoading`), 비로그인이면 로그인/회원가입 화면(`renderAuthGate`,
  [js/views/authGate.js](../js/views/authGate.js))만 노출한다. 상단 헤더/하단 탭은 `body.auth-locked` 로 숨김.
- **라우팅 게이트**: `router.js` 의 `setAuthGate(guard, gateRenderer)` — `guard()===false`(비로그인)면 어떤
  hash route(`#study` 등 직접 접근 포함)도 로그인 화면으로 막고, 의도 route 를 `pendingRoute` 에 보관한다.
  로그인 성공 시 `consumePendingRoute()` 로 원래 route 복귀(없으면 home).
- **로그아웃**: 설정 화면의 로그아웃 → 즉시 로그인 화면으로 전환(이후 hash 접근도 게이트가 차단).
- **인증 수단**: 이메일/비밀번호만. Google/소셜 로그인 없음. 비밀번호는 입력 후 즉시 비우고 저장하지 않음.
- **미설정/오프라인**: Firebase 미설정/초기화 실패 시 로그인 화면이 안내만 표시(앱 크래시 없음). 오프라인이면
  "온라인 연결 필요" 안내. 단, 이미 로그인 세션이 Auth persistence 에 남아 있으면 오프라인에서도 앱 진입 가능.
- **행동 로그**: signed-in 사용자만 기록(`actionLogger`), userKey=Firebase uid, anonymousActivity 폐기.
  상세: [firebase-logging.md](./firebase-logging.md).

## 구현된 기능

| 요구사항 | 구현 위치 |
| --- | --- |
| N5~N2 레벨 구분 | `data/*.js#level`, `study.js` 레벨 칩, 상단 레벨 칩 ([ui.js](../js/ui.js)) |
| 언어지식 / 독해 / 청해 | `data/vocab.js` `grammar.js` `reading.js` `listening.js` + `study.js` |
| 하루 10분 학습 루틴 | [curriculum.js](../js/curriculum.js) + [views/today.js](../js/views/today.js) |
| 예문 기반 단어 학습 | `vocab.js#exampleSentence`+`exampleTranslation` + questionView 컨텍스트 박스 |
| 이미지 연상법 | [mnemonic.js](../js/mnemonic.js) 동적 SVG. **선택 후**에만 노출 (정답 힌트 누출 방지) |
| 무료 TTS | [tts.js](../js/tts.js) Web Speech API + `hasJaVoice()` 사전 감지 + 다중 폴백 |
| 실패 노트 | [srs.js#recordResult](../js/srs.js) 자동 등록, [review.js](../js/views/review.js) 모드 |
| 자주 볼 단어 | 단어 학습 화면의 ⭐ 버튼만으로 토글, `favoritesList`/`pickFavorite` 모두 vocab 필터 |
| 비슷한 문법 비교 | [grammarPairs.js](../js/data/grammarPairs.js) + [grammarCompare.js](../js/views/grammarCompare.js) |
| 문제 → 선택 → 정답/해설 | [questionView.js](../js/views/questionView.js) state 머신 |

## 학습 UX 흐름

1. (단어/문법/독해) **일본어 원문만** 노출. 한국어 번역, 정답, 해설, 연상 카드는 전부 DOM 에 없음.
2. 청해는 오디오 버튼만 노출. `hasJaVoice()` 비동기 감지로 일본어 음성이 없으면 사전 안내 + 스크립트 자동 노출.
3. 문제 + 4지선다.
4. 사용자가 선택 → 선택한 칩에 ✅/❌ 강조.
5. **선택 후** 한국어 예문 번역·해설·연상 카드(단어)가 result 영역에 일괄 표시됨.
6. 오답이면 토스트 안내 + 실패 노트 자동 등록.
7. 단어 학습이면 ⭐ 버튼으로 자주 볼 단어 토글.
8. 다음 버튼으로 진행. 답을 **제출한 시점**에만 `markStudiedToday()` 호출(화면 진입만으로 streak 안 늘어남).

## 하루 10분 커리큘럼 규칙

[curriculum.js](../js/curriculum.js):

- 기본: 복습 40% / 새 단어 25% / 문법 15% / 독해·청해 20% (= 4 / 2-3 / 1-2 / 2 = 10개)
- 마지막 학습이 3일 이상 전 → 복습 60% / 새 15% / 문법 10% / RC 15%
- due 가 0개(콜드스타트) → 신규 위주 (50% / 25% / 25%)
- 자주 볼 단어 1개를 슬롯과 별개로 섞음 (vocab 만)
- **타입별 데이터 부족 시 다른 타입으로 보충**해 TARGET_COUNT(10) 에 최대한 가깝게 맞춤 (2차 `fillers` → 3차 레벨 필터까지 무시한 `finalFillers`)
- 중복 itemId 차단
- `previewBreakdown(queue)` — 미리보기와 실제 학습이 같은 큐를 기준으로 보고

## 정답·번역·연상 카드 노출 규칙

선택 전 노출 텍스트(prompt + context.ja + audio scenario)에는 다음이 **절대 들어가지 않음** (smoke 가 자동 검증):

- 정답 한국어 의미 (vocab/grammar)
- 예문 한국어 번역
- `explanation` 본문
- 단어 연상 카드 (`mnemonicText`/이미지)

선택 후에만 `result.innerHTML` 안에서 일괄 노출:

- 단어: 연상 카드 + 단어 뜻 + 예문 + 예문 번역
- 문법: 패턴 + 의미 + 설명 + 예문 한국어
- 독해/청해: 해설 + (청해는 스크립트 자동 노출)

독해는 지문 자체에 답이 들어있는 게 정상이므로 "정답 텍스트 없음" 검증을 의도적으로 스킵.

## TTS 어댑터 정책 (라운드 57)

`js/tts.js` 는 **어댑터 구조** — 공개 API(`speak`/`stopSpeaking`/`ttsAvailable`/`hasJaVoice`/`refreshVoices`/`getVoiceStatus`/`onVoiceStatusChange`)는 동일하고 환경에 따라 내부 어댑터를 선택(`js/platform.js` `useNativeTts()`):

| 환경 | 어댑터 | 음성 상태값 |
| --- | --- | --- |
| 웹 / PWA | Web Speech API(기존 라운드 30 감지 로직 그대로) | `ja-found` / `no-ja` / `detecting` / `unsupported` |
| Capacitor Android(APK) | **네이티브 `@capacitor-community/text-to-speech`** 우선 | `native-ready` / `native-unavailable` |

- APK 에서 WebView Web Speech 가 일본어 voice 를 못 잡는 문제 → 네이티브 TTS(`TextToSpeech.speak({lang:'ja-JP'})`)로 우회. 설정 화면이 환경별 문구(웹: 음성 감지 / APK: 네이티브 TTS + Android TTS 설치 안내)로 표시.
- 네이티브 speak 실패 시 web 가능하면 web, 아니면 `{ok:false, reason:'native-error'}`. 외부 유료 TTS/API 미사용. 상세: [apk-plan.md](./apk-plan.md) §0-C.

## TTS 폴백 정책 (Web 어댑터)

| 상황 | 결과 | UI |
| --- | --- | --- |
| Web Speech API 없음 | `ttsAvailable() === false` | 청해 렌더 즉시 스크립트 자동 노출 + 안내 |
| API 있음 + 일본어 voice 있음 | 정상 재생 | 버튼 → 음성 출력 |
| API 있음 + 일본어 voice 없음 | `hasJaVoice() === false` 또는 `speak() → {ok:false, reason:'no-ja-voice'}` | 두 단계 폴백: ① 화면 진입 직후 사전 감지로 스크립트 노출, ② 그래도 잡히면 재생 시점 fallback 으로 안내 |
| 합성 중 예외 | `{ok:false, reason:'error'}` | 일반 폴백 메시지 + 스크립트 노출 |

`getVoices()` 가 영구적으로 비어있는 일부 브라우저(특히 일부 리눅스/임베디드)는 1차 사전 감지를 통과하지 못할 수 있어, **재생 시점 fallback 이 항상 안전망**으로 동작함. 코드 주석에도 명시.


## 화면별 정보

| 화면 | 표시 |
| --- | --- |
| 홈 | 정답률 진행바, 연속 학습일, 오늘 복습 / 실패 노트 / 자주 볼 단어 개수, 영역별 진입 카드 |
| 오늘의 10분 인트로 | **실제 큐 기준** 비율 요약 |
| 오늘의 10분 진행 | `n/total` 프로그레스, 정답 선택 전 모든 힌트 차단 |
| 오늘의 10분 완료 | **이번 회차** 기준 총 문제 / 정답 / 오답 + 정답률 바 + 오답 항목 리스트(타입 뱃지) + 실패 노트/홈 이동 버튼. 같은 날 여러 번 실행해도 이전 회차와 섞이지 않음 (today.js 내부 sessionResults) |
| 학습 | 영역 칩(단어/문법/독해/청해) + 레벨 칩 + 항목 리스트 |
| 복습 — 실패 노트 | 타입 뱃지(빨강) + 항목명 + 의미/지문 발췌 + N회 오답 + ✓ 제거 |
| 복습 — 자주 볼 단어 | 단어 뱃지 + 단어(읽기) + 한국어 의미 + 예문 |
| 복습 — 오늘 복습 | 타입 뱃지 + 항목명 + 정답/오답 횟수 + due 상태 뱃지(`오늘 복습` 노랑 / `N일 지남` 빨강) |
| 문법 비교 | 상단에 "비슷한 문법 비교 학습" 컨텍스트 + 레벨 필터 + 페어 리스트 |
| 문법 비교 상세 | 페어 차이 설명 → 두 문법 예문 → 선택 문제 → 해설. 답 제출 시 양쪽 항목에 SRS 기록 |

## 학습 화면 UX (콘텐츠 확장 대응)

> **콘텐츠가 늘어나도 UI가 긴 목록으로 무너지지 않게 설계.**

- **홈 학습량 현황**: 앱 UI에서 **숨김 처리** — 학습자가 매번 진척을 노출 받을 필요는 없다는 판단.
  콘텐츠 목표/진행 현황은 `smoke.mjs` 출력(`progress vs targets`) 과 내부 `js/contentStats.js#progressFor` 로 관리. 진행률 자동 집계 로직과 `levelTargets` 데이터는 그대로 유지.
- **학습 > 단어** — 학습 시작 중심 구조:
  - 상단: 현재 단어 수 + 모드 칩(이미지 카드 / 예문 문제) + 4개 학습 액션 (이미지 10개 / 예문 10개 / ⭐ 자주 볼 N개 / ❌ 오답 N개)
  - 아래: 검색 input + 태그 chip (전체/명사/동사/형용사/가족/시간/장소/음식/학교) + **20개 단위 목록 + "더 보기"**
  - 단어 탭 진입 시 절대 전체(현재 101개)가 한꺼번에 늘어지지 않음 — 첫 화면 최대 20개.
- **학습 > 문법/독해/청해** — 동일한 페이지화 + 검색 + 항목 수 헤더 공통 적용.
- **단어 10개 학습 세션**: 오늘의 10분과 독립. SRS / 실패 노트 / 자주 볼 단어 기록은 그대로 반영. 완료 시 정답률 + 오답 단어 리스트 + 다시 학습 / 목록으로 이동.

## 발음 듣기 (무료 TTS)

모든 발음 재생은 [`js/tts.js`](../js/tts.js) 의 Web Speech API 기반 — 외부 유료 TTS 사용 안 함.
일본어 voice 부재 시 안내 메시지로 자동 폴백.

| 위치 | 동작 |
| --- | --- |
| 단어 이미지 카드 | 선택 전 **🔊 발음 듣기** (정답 단어를 텍스트로 노출하지 않음 — aria-label/title 도 `"발음 듣기"` 로만). 선택 후 **🔊 예문 듣기** 버튼 추가 노출. |
| 단어 예문 문제 | 선택 전 일본어 예문 옆에 **🔊 예문 듣기**. 선택 후 해설 영역에 **🔊 단어 듣기** 추가. |
| 문법 비교 상세 | 좌/우 두 문법 예문 각각에 **🔊 예문 듣기** 버튼. |
| 청해 | 기존 오디오 바 그대로 (이미 TTS 결합). |

뒤로가기 / 다음 / 세션 종료 / 다른 비교 선택 시 자동으로 `stopSpeaking()` 호출.

## 단어 이미지 다양화

`mnemonic.js` 의 PALETTE 가 **80여 종 imageKey** 를 제공 — 가족·요일별·계절·각종 동사/형용사가
고유 색·이모지 조합. N5 vocab 의 imageKey 가 한 키에 몰리지 않도록 분산.

| 검증 | 기준 |
| --- | --- |
| `mnemonic palette size` | ≥ 60 |
| `N5 vocab unique imageKey` | ≥ 20 |
| 가장 많이 쓰인 imageKey share | ≤ 20% (현재 family 6/101 = 5.9%) |
| 모든 vocab.imageKey | mnemonic 팔레트에 존재 또는 `default` 폴백 |

요일별 imageKey (mon/tue/wed/thu/fri/sat/sun) 는 한자 의미(月=달/火=불/水=물/木=나무/金=금/土=흙/日=해) 와
시각적으로 일치하는 이모지·색상으로 구분 — 학습자가 이미지를 보고 어느 요일인지 식별 가능.


## 한자 학습 + 문자(가나) 표 — 화면
### 한자 학습 화면 ([js/views/kanjiView.js](../js/views/kanjiView.js))

`#study/kanji` — 한자 목록 (검색 + 태그 + 20개 페이지) + 카드 학습:

```
큰 한자 (예: 日)
"히라가나 / 의미 / 음·훈독을 떠올려 보세요."
[뜻 / 읽기 보기]

  → (클릭 후)

  ひ
  날, 해, 일본
  음독  ニチ, ジツ
  훈독  ひ, か
  획수  4획
  부수  日
  예시 단어
    日本 (にほん) — 일본
    日曜日 (にちようび) — 일요일
  연상: 해(日)가 떠 있는 모양으로 기억합니다.
  [🔊 발음 듣기]     ← 첫 예시 단어 (日本) 를 일본어 TTS 로
  [🔁 다시 볼래요][✅ 알고 있음]
```

- 선택 전엔 히라가나·의미·니모닉·예시 모두 DOM 부재 (정답 누출 차단).
- "다시 볼래요" → `recordResult(id,'kanji',false)` 로 실패 노트에 자동 등록 (UI는 기존 그대로, findItem 미매칭이라 review 탭에 표시되진 않음).
- "알고 있음" → `recordResult(id,'kanji',true)` 로 SRS 반영.
- TTS 미지원 시 기존 fallback hint.

### 문자(가나) 표 ([js/views/kanaChart.js](../js/views/kanaChart.js))

`#study/kana` — 학습 메뉴의 "문자" 영역:

- 토글: 히라가나 / 가타카나
- 기본 50음도 (5열 그리드) + "탁음·반탁음·요음 보기" 토글
- 각 셀: `あ / a` 형태로 문자 + 로마자
- **셀 클릭 시 무료 Web Speech API 로 발음 재생**
- 모바일 360px 폭에서 셀 크기 자동 축소 (미디어 쿼리)
- TTS 미지원 시 hint

### 콘텐츠 카운트 관리 정책

- 앱 UI 에서는 **학습량 현황 카드를 표시하지 않음** (이전 라운드부터 정책 유지).
- 한자 카운트도 동일 — `levelTargets.targetKanji = 100` 기준, 현재 50자는 `smoke.mjs` 출력 + `contentStats.progressFor(level).kanji` 로만 확인.


## 후리가나(읽기 보조) — `js/furigana.js`

문장에 등장하는 한자에 히라가나 읽기를 ruby/rt 로 덧붙이는 무료 운영 도구.
**유료 API · 외부 LLM · 외부 사전 API 미사용** — 모든 매칭은
프로젝트 내부 데이터(`vocab.word→reading`, `kanji.exampleWords[].word→reading`)
+ `COMMON_FURIGANA` 사전(자주 등장하는 N5 단어 ~150개를 수기 등록)
+ 데이터에 직접 작성된 명시 `readings`만 사용한다.

### 데이터 source 우선순위 (변경 금지)
1. **명시 readings 가 항상 최우선** — 데이터 항목에 `readings: [{text, reading}]` 가 있으면 자동 사전을 덮어쓴다.
2. `vocab.word → vocab.reading` 자동 사전
3. `kanji.exampleWords[].word → reading` 자동 사전
4. `COMMON_FURIGANA` (가나 표제어 vocab 의 예문에 등장하는 한자 어휘 보강)

매칭은 위 단계에서 만들어진 단일 통합 사전을 **긴 단어 우선 그리디** 로 적용한다.
(`日本語` → `日本` 보다 먼저 매칭됨, `好きです` → `好き` 보다 먼저)

```js
import { renderFuriganaText, hasFurigana, plainJa } from './furigana.js';
renderFuriganaText('日本語を勉強します。', [])
// → '<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>します。'
```

- **API**
  - `renderFuriganaText(text, readings?)` — HTML escape 후 ruby/rt 삽입. 입력이 비면 빈 문자열.
  - `hasFurigana(text, readings?)` — 한자가 자동/명시 사전으로 어느 정도 커버되는지 boolean.
  - `containsKanji(text)` — 한자 포함 여부.
  - `plainJa(text)` — escape 만 (ruby 없이).
- **매칭 규칙**
  - 명시 `readings` (예: `[{text:'日本',reading:'にっぽん'}]`) 가 자동 사전보다 우선.
  - 가장 긴 단어부터 매칭 (`日本語` → `日本` 보다 먼저).
  - 같은 단어가 한 문장에 여러 번 나오면 모두 적용.
  - 한자가 없는 부분은 escape 만.
- **XSS** — 모든 출력은 `&<>"'` escape 후 삽입.
- **kanji 모듈과 분리** — `js/data/kanji.js` 는 *한자 카드* 학습용 데이터.
  `furigana.js` + 각 데이터의 readings 는 *예문 안 한자에 읽기를 덧붙이는* 보조.

### 적용 화면
- `js/views/questionView.js` — vocab/grammar/reading 예문, listening 스크립트(reveal 후)
- `js/views/vocabCardView.js` — 이미지 카드 **선택 후** 예문 / 단어 thinking 상태에서는 reading 비공개 유지
- `js/views/grammarCompare.js` — 두 예문 + 비교 문제 본문
- `js/views/conversation.js` — 회화 질문 / 모범답안 / 알고있는 문장 / 추천 연습 문장
- `js/views/review.js` — 자주 볼 단어 row 의 예문

### 누출 방지 규칙 (유지)
- 한국어 의미·번역·해설은 **선택 전 DOM 부재** — 변경 없음.
- 히라가나 읽기는 일본어 보조라 표시 허용 — *단* 이미지 카드 **thinking 상태**에서는
  target 단어 자체의 reading을 노출하지 않는다 (qa [40] 으로 검증).

### 커버율 정책
- `smoke.mjs` 가 매번 vocab/grammar/reading/listening/sentenceBank 별 커버율을 출력한다.
- **현재 N5 모든 카테고리 100% 커버** (라운드 5 보강).
  - vocab example 246/246, grammar example 45/45, reading passage 25/25, listening script 25/25, sentenceBank ja 147/147
- 신규 콘텐츠가 들어오면 위 sentinel 이 자동으로 회귀 차단.
- 100% 매칭을 영구히 약속하지는 않으며, 한 번 깨지면 다음 라운드에서 데이터 또는 `COMMON_FURIGANA` 로 메운다.

### 후리가나 ON/OFF 토글
- **홈 화면 "학습 설정" 카드**에서 사용자가 켜고 끌 수 있다.
- 기본값 ON. `localStorage`(`jlpt10min:v1` → `settings.furiganaEnabled`) 에 저장되어
  새로고침 후에도 유지.
- OFF 의 용도는 **"읽기 가림 학습"** — 한자 읽기를 가린 채 본인의 기억을 시험하고
  싶을 때.
- OFF 상태에서도:
  - 일본어 원문은 빠지지 않고 그대로 표시.
  - 한국어 의미/번역/연상 텍스트는 여전히 선택 전 미노출 (누출 방지 정책 유지).
  - 이미지 카드 thinking 상태는 변동 없음 (단어/읽기 모두 가림).
- **한자 카드(`kanjiView`) 의 `hiragana` 필드는 후리가나 토글과 무관** — reveal 후 항상 표시.
  한자 카드 안의 히라가나는 *학습 정보 본문* 이지 *보조 표기* 가 아니기 때문.

API:
- `state.getFuriganaEnabled()` / `state.setFuriganaEnabled(bool)`
- `furigana.renderJa(text, readings?)` — view 진입점. 토글 ON → `renderFuriganaText`, OFF → escape only.
- `furigana.renderFuriganaText(text, readings?)` — 순수 함수, 항상 ruby/rt 생성 (테스트·커버율 측정에서 사용).


## 학습 방식

| 영역 | 출제 방식 |
| --- | --- |
| **단어** | **이미지 카드 암기(기본)** + **예문 문제(보조)**. 학습 화면에서 모드 토글. |
| **한자** | **카드 학습** (생각해보기 → 보기 → 알고있음/다시 볼래요). 예시 단어 TTS 재생. |
| **문자(가나)** | **표 학습 보조**. 히라가나/가타카나 토글 + 탁음/요음 접기. 셀 클릭 시 TTS. |
| 문법 | 예문 + 4지선다 (선택 전 한국어 번역 차단) |
| 독해 | 지문 + 4지선다 |
| 청해 | TTS 재생 + 4지선다. 스크립트는 정답 선택 후 또는 TTS 미지원 시 노출. |
| 문법 비교 | 두 패턴의 차이 설명 → 예문 → 선택 문제 |

### 단어 이미지 카드 모드 (단계형 학습 플로우)

`settings.vocabImageWarmupEnabled = true` (기본값) 일 때 다음 5단계 진행:

| 단계 | 라벨 | 화면 | 학습 기록 |
| --- | --- | --- | --- |
| **1. 노출 1** | `1/5 보기` | 이미지 + 단어 + reading + 뜻 + 🔊 발음 듣기 (자동 재생 시도) | 미발생 |
| **2. 노출 2** | `2/5 한 번 더` | 동일 + "한 번 더" 라벨 + 🔊 발음 듣기 | 미발생 |
| **3. 회상** | `3/5 떠올리기` | 이미지만. 단어/reading/뜻 모두 DOM 부재. 3초 카운트다운 + "바로 확인" 건너뛰기 버튼 | 미발생 |
| **4. 확인** | `4/5 확인` | 이미지 + 단어 + reading + 뜻 + 예문 + 연상 + 🔊 발음 듣기 / 🔊 예문 듣기 + "퀴즈로" 버튼 | 미발생 |
| **5. 퀴즈** | `5/5 퀴즈` | 4지선다 (단어/reading/뜻 다시 숨김). 선택 후 .explain 노출 | **여기서만** `recordResult` / `recordSessionItem` / `markStudiedToday` / `onAnswered` |

원칙:
- 학습 기록(SRS · 오늘 회차 통계 · 실패 노트) 은 **5단계 퀴즈 답변 시점에만** 갱신. 노출/회상/확인은 학습 진도에 영향 없음.
- **회상(3) 과 퀴즈 답변 전(5 thinking)** 에서는 target word/reading/meaningKo 가 DOM 텍스트에도, aria-label/title 에도 노출되지 않는다.
- **퀴즈 답변 전에는 정답 정보가 다시 숨겨진다** — 노출(1,2)/확인(4) 단계에서 잠시 보여준 뒤, 퀴즈(5) 진입 시 다시 가린다. (정답을 4지선다에서 다시 한 번 떠올리도록.)

발음 듣기:
- 노출 1 진입 시 `speak(v.word)` 를 자동으로 한 번 시도. 브라우저 autoplay 정책으로 실패할 수 있으므로 `🔊 발음 듣기` 버튼을 항상 제공. TTS 미지원/no-ja-voice 케이스는 기존 hint 메시지를 그대로 사용.
- 퀴즈 thinking 단계의 발음 듣기 버튼은 `aria-label/title` 에 정답 단어를 노출하지 않는다 (스크린리더 누출 방지).

타이머:
- `RECALL_SECONDS = 3` 상수 (vocabCardView.js 상단 export). 100 ms 마다 진행 바 갱신.
- "바로 확인" 클릭 또는 카드 detach 시 즉시 `clearInterval`.
- 다음 카드로 넘어갈 때 이전 closure 의 `recallTimer` 가 잔존하지 않음 — `wrap.isConnected` 가드 + onNext 시점 `clearRecallTimer` 호출 + 새 카드 호출 시 새 closure.

설정:
- 홈 "학습 설정" 카드에서 **이미지 카드 단계형 학습** 토글 + **회상 시간** 3/5/7초 세그먼트로 조작.
- API: `state.getVocabWarmupEnabled()` / `setVocabWarmupEnabled(bool)` / `getVocabRecallSeconds()` / `setVocabRecallSeconds(3|5|7)`.
- `localStorage` 의 `jlpt10min:v1 → settings.vocabImageWarmupEnabled / vocabRecallSeconds` 에 저장.
- 단계형 OFF 설정 시 expose1~confirm 4단계를 건너뛰고 바로 5단계 퀴즈로 진입 (이전 동작 호환).
- 회상 시간은 **3 / 5 / 7 초** 중 하나만 허용. 잘못된 값은 자동으로 3 으로 fallback.

### 정보구조 / 메뉴 (라운드 9 재설계)

#### 하단 탭 (5개)
| 탭 | 라우트 | 역할 |
| --- | --- | --- |
| 홈 | `#home` | 시작 / 요약 / 회화 준비도 / 복습 요약 |
| 학습 | `#study` | 분야 → 난이도 → 학습법 선택 → 시작 |
| 복습 | `#review` | 실패 노트 / 자주 볼 단어 / 오늘 due |
| 이야기 | `#stories` | 짧은 생활 이야기 / 쉬운 뉴스 스타일 (Readle 풍 읽기) |
| 단편 소설 | `#novels` | 조금 더 긴 창작 단편 |

비교(`#compare`) / 회화(`#conversation`) / 10분(`#today`) 은 **독립 탭에서 제거** — 하위 흐름으로만 접근:
- 문법 비교 → 학습 > 문법 > "비슷한 문법 비교" (`#study/grammar/compare`)
- 오늘의 10분 → 홈 카드의 "시작 →" 버튼
- 회화 → (직접 라우트 `#conversation` 만 유지, 탭은 없음. 추후 별도 탭으로 부활 가능.)

#### 설정 화면 (`#settings`)
**상단 top-bar 의 ⚙ 톱니바퀴 버튼** 으로 진입. 홈 카드가 아님.

| 항목 | 컨트롤 | 기본값 | 설명 |
| --- | --- | --- | --- |
| 후리가나 표시 | 체크박스 (`#furiToggle`) | ON | OFF = "읽기 가림 학습" |
| 이미지 카드 단계형 학습 | 체크박스 (`#warmupToggle`) | ON | OFF 면 바로 퀴즈 진입 |
| 회상 시간 | 세그먼트 (`#recallSeg`) | 3초 | 3/5/7초 |
| 목표 레벨 | 세그먼트 (`#levelSeg`) | N5 | N5/N4/N3/N2 — 변경 시 상단 레벨 핀 즉시 동기화 |

모든 설정은 `localStorage` 의 `jlpt10min:v1 → settings.*` 에 즉시 저장. 변경 시 토스트 피드백. 데이터 초기화 액션은 이번 버전에 포함하지 않음 (위험 액션).

#### 학습 화면 (`#study`)
**랜딩** — 한 화면에 다음 3개 패널 + 시작 버튼:
1. `#studyTypePanel` — 분야 칩 (단어 / 문법 / 독해 / 청해 / 한자 / 문자)
2. `#studyLevelPanel` — 난이도 칩 (N5 / N4 / N3 / N2)
3. `#studyMethodPanel` — 학습법 칩 (분야별 다름, 표 참조)
4. 시작 버튼 (`[data-start-study]`) — 학습법 선택 시 enabled. 단어 + image/example 선택 시 id 가 각각 `#startImage` / `#startExample` 로 부여 (테스트·즐겨찾기 단축 호환).

| 분야 | 학습법 칩 | 기능 |
| --- | --- | --- |
| 단어 | 이미지 카드 단계형 / 예문 문제 / 찾아보기 | 처음 두 개는 10문항 세션, "찾아보기" 는 검색·태그 목록 |
| 문법 | 문법 문제 / 비슷한 문법 비교 / 찾아보기 | "비슷한 문법 비교" → `#compare` |
| 독해 | 짧은 지문 학습 (browse) | 목록에서 지문 선택 |
| 청해 | 듣고 고르기 (browse) | 목록에서 항목 선택 |
| 한자 | 한자 카드 / 찾아보기 | 둘 다 목록 → 카드 진입 |
| 문자 | 히라가나/가타카나 표 (chart) | 표 직행 |

**딥링크** — `#study/<type>/<method>` 형식으로 학습법 단계를 건너뛰고 직접 시작 가능.
예: `#study/vocab/image`, `#study/grammar/compare`, `#study/kana/chart`.

**홈 화면에는 학습 영역 버튼 나열을 두지 않는다.** 학습 진입은 하단 학습 탭으로 통일.


### 이야기 / 단편 소설 — Readle 스타일 읽기 기반

`js/data/stories.js` — 본 프로젝트용 직접 창작 콘텐츠만 (외부 뉴스 기사 복사·크롤링 금지).

**StoryItem 스키마:**
```js
{
  id: 'story_n5_001',
  type: 'daily_story' | 'news_style' | 'short_story',
  level: 'N5' | 'N4' | 'N3' | 'N2',
  titleJa, titleKo, summaryKo,
  bodyJa: ['문단1', '문단2', ...],
  bodyReadings: [[{text,reading}, ...], ...],
  bodyKo: ['번역1', ...],          // 해석 보기 클릭 후에만 노출
  vocabularyIds: ['v_n5_...'],
  grammarIds: ['g_n5_...'],
  tags: [...],
  estimatedMinutes: 3,
  sourceType: 'original',
}
```

**메뉴 분리:**
- `이야기 (#stories)` — `daily_story` + `news_style` 타입
- `단편 소설 (#novels)` — `short_story` 타입

**본문 줄 구조 (라운드 18):** 각 문단은 3단으로 표시 —
```
日本語 + 후리가나 + 인라인 하이라이트   (.story-ja)
watashi wa mainichi shichi-ji ni ...     (.story-romaji   — 설정 OFF 가능)
나는 매일 일곱 시에 일어납니다.          (.story-ko-inline — 설정 OFF 가능)
```
- 설정: `storyRomajiEnabled` / `storyTranslationEnabled` (기본 둘 다 ON, ⚙ 설정 화면 토글).
- 데이터: `bodyRomaji[]` 필수 필드 (bodyJa 와 길이 일치). 로마자 표기 원칙 — っ는 자음 중복(kitte), は 조사→wa, へ 조사→e, を→o, 장음 おう→ou, 초급자가 읽기 쉬운 일관 표기 우선.
- 기존 "해석" 탭은 "전체 해석" 보조 탭으로 축소.

**테마 (라운드 18):** ⚙ 설정 → 테마 [시스템][라이트][다크].
- `settings.themeMode` ('system' 기본) → `js/theme.js` 가 `document.documentElement.dataset.theme` 적용.
- system 은 `prefers-color-scheme` 실시간 반영. index.html head 인라인 스크립트가 첫 페인트 전에 적용 (다크 플래시 방지).
- 색상은 전부 CSS 변수 — `:root`(다크 기본) + `[data-theme="light"]` 오버라이드.

**Compact 플레이어 (라운드 18):** `[⏮][▶][⏭] 2/5 정지 [0.75x][1x][1.25x]` 한 줄 (좁은 폭 자연 줄바꿈, 최대 2줄). `.has-story-player` padding-bottom 220→120px. 전체 재생/700ms pause/단일 재생/cleanup 동작은 동일.

**이미지 자산 (라운드 18):** `assets/images/stories/*.svg` — 직접 창작 SVG placeholder 3개 (rain-morning / cafe-friends / station-map). StoryItem 선택 필드 `coverImage {src, altKo, licenseId}` — 있으면 목록 썸네일 + 상세 상단 표시, 없거나 로드 실패 시 기존 표시로 fallback. 모든 자산은 [docs/asset-licenses.md](./asset-licenses.md) 에 기록 필수 (smoke 검증). 외부 이미지 hotlink 금지, 직접 창작 > CC0 > CC BY 우선순위.

**본문 화면 (`#story/<id>`) — 스토리 학습 플레이어:**

탭 4개로 본문/학습 정보 분리:
| 탭 | 역할 |
| --- | --- |
| 이야기 | 본문 (후리가나 ON/OFF 반영) + 문단별 단일 재생 + 하이라이트 pill |
| 핵심 단어 | `keyVocabularyIds` 기반 카드형 단어 목록 |
| 문법 | `keyGrammarIds` 기반 문법 목록 |
| 해석 | 전체 한국어 번역 |

**기본 탭은 "이야기"** — 한국어 번역은 해석 탭으로 진입하지 않는 한 DOM 에 부재. 누출 방지 정책 유지.

**재생 모드 분리:**
- **단일 문단 재생** — 문단마다 `🔊 이 문단 듣기` 버튼 (aria-label `"이 문단 듣기"`). 해당 문단만 재생, 자동 다음 없음. 진행 중인 전체 재생을 멈추고 single 모드로 전환.
- **전체 이야기 연속 재생** — 화면 하단 고정 플레이어 (`#storyPlayer`) 의 `▶ 전체 이야기 듣기` 버튼. 현재 `activeIndex` 부터 마지막 문단까지 순서대로 재생. **문단 사이 `STORY_SENTENCE_PAUSE_MS = 700ms` 쉼**. 마지막 문단 종료 시 자동 정지.

**플레이어 컨트롤 (하단 고정):**
- ⏮ 이전 문단 / ▶ 전체 재생 (또는 ⏸ 일시정지) / ⏭ 다음 문단
- 위치 표시 `<현재> / <총>`, 상태 표시 (정지 / 재생 중 / 문단 재생 중)
- 속도 세그먼트 [0.75x][1x][1.25x] — `localStorage.jlpt10min:storyTtsRate` 영속
- TTS fallback hint 영역

**현재 읽는 문단 표시:**
- `.story-line.active` 클래스 + 왼쪽 accent border + 은은한 배경
- "재생 중" 배지 (.story-line-badge)
- `scrollIntoView({ block: 'center', behavior: 'smooth' })` 자동 스크롤
- 후리가나 ruby/rt 와 충돌 없는 CSS

**하이라이트 / 핵심 단어 (라운드 11):**
- `bodyHighlights[paragraphIdx]` 에 문단별 1~3개 하이라이트 객체.
- **본문 안 직접 하이라이트** — `renderStoryLineWithHighlights(text, readings, highlights, lineIdx)` 헬퍼가 일본어 텍스트 위에 highlight `text` 를 `<button class="story-inline-hl">` 으로 wrap. 후리가나 ruby/rt 와 충돌 없이 통합 렌더 (긴 단어 우선 매칭, HTML escape 안전).
- 클릭 시 해당 문단 아래 `.story-hl-panel` 에 일본어/reading/한국어 의미 + **🔊 발음 듣기** 버튼 + (vocabId 있을 때) **단어 학습** 버튼 노출.
- 같은 단어 두 번 누르면 패널 닫힘.

**단어/문법 학습 연결 (라운드 12):**
- 인라인 highlight 패널의 "단어 학습" / 핵심 단어 탭 row "단어 학습" / 문법 탭 row "문법 학습" 버튼 → 모두 **직접 카드 진입**.
- 라우트:
  - `#study/vocab/card/<id>` — 해당 단어 이미지 카드 학습으로 직진. `settings.vocabImageWarmupEnabled` 설정을 따름 (ON → expose1 부터 / OFF → quiz 직진).
  - `#study/grammar/card/<id>` — 해당 문법의 4지선다 문제 화면.
- **Invalid id fallback** — `study.js` 의 `startSingleVocabCard` / `startSingleGrammar` 가 id 를 vocab/grammar 에서 찾지 못하면 토스트 + 자동 browse 모드로 fallback.
- 기존 `#study/vocab/browse/<id>` / `#study/grammar/browse/<id>` 라우트 (검색 prefill) 도 그대로 유지 — 외부 URL 호환.
- 학습법 칩 (랜딩) 에는 `card` 가 노출되지 않음 — 딥링크 전용 메서드 (`DEEP_LINK_METHODS`).

**스토리 ↔ 학습 ↔ 스토리 복귀 동선 (라운드 13):**
- 별도 모듈 `js/studyReturn.js` — `setStudyReturnRoute(route)` / `peekStudyReturnRoute()` / `consumeStudyReturnRoute()` / `clearStudyReturnRoute()`.
- 스토리에서 "단어 학습 →" / "문법 학습 →" 클릭 시 `setStudyReturnRoute('story/' + currentStoryId)` 호출 후 navigate.
- `study.js` 의 `startSingleVocabCard` / `startSingleGrammar` 가 카드 마운트 직후 `maybePrependStoryReturnButton(screen)` 으로 화면 상단에 **"← 이야기로 돌아가기"** 버튼 prepend.
- 버튼 클릭 → `consumeStudyReturnRoute()` 로 한 번 소비 후 `navigate(route)` → 원래 스토리 detail 로 복귀.
- 일반 동선 격리:
  - **학습 랜딩 진입 / browse 진입 / 세션 시작** 시 `clearStudyReturnRoute()` 자동 호출 — 다음 카드 진입에 영향 없음.
  - **today.js / vocabCardView.js / questionView.js 는 studyReturn 모듈을 import 하지 않음** — 오늘의 10분 / 일반 학습 카드에는 복귀 버튼이 끼지 않음. smoke 정적 검사로 회귀 차단 (시나리오 [112] 동작 검증).
- 깨지거나 빈 returnRoute 는 무시 — setStudyReturnRoute 는 string 길이 검증.

**storyProgress 저장:**
```js
storyProgress: {
  [storyId]: {
    lastIndex: 2,           // 마지막으로 active 였던 문단
    completed: true,        // 학습 완료 표시
    lastOpenedAt: '2026-06-09',
    readCount: 1,           // completed → true 로 바뀔 때 +1
  }
}
```
- API: `state.getStoryProgress(id)` / `setStoryLastIndex(id, idx)` / `markStoryCompleted(id, bool)` / `noteStoryOpened(id)`.
- 본문 진입 시 `lastIndex` 자동 복원 (`> 0` 일 때 activeIndex 로 세팅).
- 매 active line 갱신마다 `setStoryLastIndex` 호출 — playSingleLine / playSequenceFrom / ⏮ ⏭ / 인라인 클릭 모두 자동 저장.
- 헤더의 **"학습 완료로 표시"** 버튼 → `markStoryCompleted` toggle.
- 오늘의 10분 / SRS 통계와 분리 — 별도 영속.

**완료 / 숨기기 (라운드 12: 영속화):**
- 목록 row 좌측에 `✓ 완료` 배지 (`.story-done-badge`) + 흐린 row (`.row.done`).
- 목록 상단에 `완료한 이야기 숨기기` 체크박스 — `settings.storyHideCompleted` 에 영속. 새로고침 후에도 유지. 이야기/단편 공통 설정.
- 목록 상단 진행 요약: `완료 N편 · 읽는 중 M편` (각 컨테이너별 집계). 홈에는 표시하지 않음 — 깔끔함 우선.
- 진행 중 row 의 sub 텍스트에 `· 마지막 N/총 문단` 표시 (lastIndex>0 이면서 미완료일 때).

**속도 조절 안내:** 현재 재생 중인 utterance 의 rate 는 Web Speech API 한계로 변경되지 않는다 — **속도 변경은 다음 문단부터 반영**.

**라우트 cleanup:**
- `stopStoryAudio()` — playingMode='none', `clearStoryPauseTimer()`, `stopSpeaking()`
- `renderStories` / `renderNovels` / `renderStoryDetail` 진입 시점에 모두 호출.
- 다른 story 진입 시 `activeIndex = -1`, 탭 이야기로 복귀.

**시험/퀴즈 기능 없음 — 읽기 전용.**

**시드 (라운드 13 1차 확장 완료):**

이야기 (5건):
- story_n5_001 "私の朝" (daily) — 아침 일과
- story_n5_002 "公園に新しい花" (news) — 공원에 핀 새 꽃 (가상 기사)
- story_n5_004 "雨の朝" (daily) — 비 오는 아침 등굣길
- story_n5_005 "スーパーで買い物" (daily) — 어머니와 슈퍼에서 장보기
- story_n5_006 "駅で道を聞きました" (news) — 역에서 길을 안내한 가상 기사

단편 소설 (3건):
- story_n5_003 "春の日曜日" — 봄 일요일, 친구와 공원에서 보낸 하루
- story_n5_007 "小さい手紙" — 책상 위 작은 편지가 마음을 따뜻하게 한 단편
- story_n5_008 "失くした傘" — 잃어버린 우산을 다시 찾은 단편

**N5 story body 후리가나 커버율 100%** (33/33 문단). 모든 콘텐츠 `sourceType: 'original'`, 외부 기사/소설/교재 미사용. 추가 콘텐츠는 N5 → N4 → N3 → N2 순으로 직접 창작 확장.


### 단어 예문 문제 모드 (보조)

- 일본어 예문 → 단어 뜻 4지선다.
- 선택 전 한국어 번역·해설·연상 카드 모두 차단.
- 선택 후 모든 정보 노출.


## 회화 모듈 (0.3-lite — sentenceBank 기반 피드백)

> **현재 상태**: 0.2 기능 위에 **`sentenceBank` 기반 추천 시스템** 결합.
> 평가 결과 화면이 사용자가 학습한 표현을 우선 모범 답안 후보로 보여주고,
> 관련 표현(학습함 / 일부 학습)을 함께 제시함. LLM/형태소 분석은 **아직 도입 안 함**.

### 핵심 정책

- **모범 답안은 절대 생성하지 않음** — `conversationTopics.sampleAnswers` 또는
  `sentenceBank` 에 이미 존재하는 문장만 골라 보여준다.
- `evaluateConversationAnswer` 결과에 세 필드 추가:
  - `sampleAnswer` — 기존 `conversationTopics.sampleAnswers[0]` (항상 표시)
  - `knownSampleSentence` — `sentenceBank` 에서 고른 *학습한* 문장 (없으면 null)
  - `relatedPracticeSentences` — 관련 known + partial 합산 최대 3개 (locked 제외)
- UI 노출은 **답변 제출 후** 피드백 영역에서만. 질문 전부터 대량 노출 안 함.
- 콘텐츠가 늘어날수록 자동으로 회화 피드백 품질이 좋아지는 구조.

### 새 sentenceAccess 함수

```ts
classifyForUser(sentence, reviewStates)        : 'known' | 'partial' | 'locked'
getKnownSentencesForTopic(topicId, rs)         : SentenceItem[]
getPracticeSentencesForTopic(topicId, rs)      : { known[], partial[], locked[] }
pickBestSampleSentence(topicId, question, rs)  : SentenceItem | null
topicSentenceCoverage(topicId, rs)             : { relatedCount, knownCount, partialCount, lockedCount, relatedIds }
```

`pickBestSampleSentence` 우선순위:
1. 주제와 관련 (`getSentencesForTopic` 통과)
2. `question.expectedPatterns` 의 패턴이 `sentence.grammarIds` 와 매칭 시 +10
3. `topic.situationTags` 와 `sentence.situationTags` 겹침 시 +5
4. `sourceType === 'conversation' && sourceId === topicId` 직접 출처 +3
5. **학습한(`sentenceIsKnown`) 문장만 후보** — 미학습이면 null 반환

### 회화 진행 결과 화면 (제출 후)

```
점수 80/100  [|||||||||||||]
사용한 학습 단어 / 감지된 문법 패턴 / 부족한 표현 / 교정 힌트
모범 답안: 私はミンです。 (저는 민입니다.)
─────────────────────────────
[배운 표현으로 답하기]   ←  sentenceBank 의 학습한 문장 1개
私は学生です。
저는 학생입니다.
─────────────────────────────
관련 표현 더 보기 (최대 3개)
  [학습함] お名前は何ですか。 — 성함이 어떻게 되십니까?
  [일부 학습] 私の家族は四人です。 — 우리 가족은 네 명입니다.
  잠긴 표현 4개 — 어휘/문법 학습 후 열림
[다음 질문 →]
```

미학습 시 "배운 표현으로 답하기" 자리에 `학습한 표현이 더 필요합니다.` 안내. 잠긴 표현은
개수만 알리고 텍스트는 노출하지 않음 (학습 동기 보존).

### 주제 목록 행

기존 `관련 문장 N개 · 학습한 표현 M개` 에서 partial 카운트 추가:
```
관련 문장 11개 · 학습 3개 · 일부 4개
```

## 회화 모듈 (0.2 — STT 프로토타입 + 진행 저장)

> **현재 상태**: **텍스트 입력 (기본) + Web Speech STT 프로토타입 + 규칙 기반 평가 +
> Web Speech TTS + 주제별 진행 저장**. LLM/외부 API/유료 API 미사용. 회화 질문은
> `conversationTopics.starterQuestions` 안에서만 사용 — 새로운 어휘/문법을 임의 생성하지 않음.

### 0.2 추가 / 변경

- **STT 어댑터** [`js/stt.js`](../js/stt.js) — `sttAvailable()` / `createSttSession({lang, onResult, onError, onEnd})`.
  Web Speech API(`window.SpeechRecognition` 또는 `webkitSpeechRecognition`) 위에 안전한 폴백 래퍼.
  미지원/생성 실패/마이크 권한 거부/네트워크 오류 등 `reason` 으로 구분.
- **마이크 UI** — 회화 진행 화면 답변 카드에 🎤 음성 입력 버튼. 토글로 시작/중지.
  중간 인식(interim) 텍스트는 상태 라벨, 최종(final) 결과는 textarea 에 자동 추가 → 사용자가 텍스트 수정 후 제출.
- **STT 미지원** 시 "음성 입력 미지원 · 텍스트로 입력하세요" 안내 + textarea 만 노출.
- **회화 진행 저장** — `storage.conversationProgress[topicId]` 에 `{ attempts[], lastScore, bestScore, completedCount, updatedAt }` 누적.
  - 매 답변 제출 시 `recordConversationAttempt()` 호출 — attempts 누적 상한 100개.
  - 마지막 질문 다음 클릭 시 `markConversationCompleted()` 한 번 호출 — `completedCount++`.
  - 주제 목록 행에 "최근 N점 · 최고 M점 · 완료 K회" 표시.
  - 요약 화면에 "이번 회차 평균 점수 / 최고 점수 / 완료 횟수" 표시.
- **LocalEvaluator 보강** — `normalizeJapanese` 가 반각 콤마/마침표를 일본어 구두점으로 정규화. 
  `です/でした/ます/ました/ません/ませんでした` 등 정중체 종결 인식 확장. 
  너무 짧은 답변(`too_short`) 점수 캡(40) + 힌트. 일본어 미사용(`not_japanese`) 별도 힌트.

### Web Speech SpeechRecognition 의 한계

> **⚠️ Web Speech API 의 `SpeechRecognition` 은 사양상 오프라인 보장이 없다.**
> 대부분의 데스크톱 Chrome / Edge / Safari 구현은 **음성 데이터를 외부 서버로 전송하여
> 인식한 결과를 반환**한다. 따라서 회화 0.2 의 STT 프로토타입은 *완전한 오프라인 동작*
> 을 보장하지 않는다 — 네트워크가 없으면 `network` reason 으로 실패할 수 있다.
>
> 텍스트 입력 폴백이 항상 기본 안전 경로 — 마이크 권한 거부 / 미지원 / 네트워크 실패 /
> 인식 실패 어떤 시나리오에서도 사용자는 textarea 로 답변을 제출할 수 있다.
>
> 향후 모바일 네이티브 앱(Android / iOS)에서는 **OS 내부 STT (Android `SpeechRecognizer`,
> iOS `SFSpeechRecognizer`)** 를 같은 인터페이스로 어댑터 교체하여 진정한 온디바이스 동작
> 으로 갈 수 있다. 마찬가지로 평가기는 **온디바이스 LLM/형태소 분석**, TTS 는 OS 내부
> TTS 로 교체될 예정.

### 0.1 → 0.2 무변경 부분

회화 질문/모범답안 데이터 제약, 규칙 기반 평가, Web Speech TTS, 70% 임계치, 미준비 주제
시작 버튼 disabled, "AI" 라는 표현 자제 등 0.1 의 안전 제약은 그대로 유지.


### 모듈 구성

- **데이터** [`js/data/conversationTopics.js`](../js/data/conversationTopics.js) — N5 6주제(자기소개/가족/카페/길묻기/약속/날씨·일과). 각 주제마다 `requiredVocabIds`, `requiredGrammarIds`(실제 학습 항목 id 참조 — smoke 가 자동 검증), `starterQuestions`, `sampleAnswers`, `repairHints`.
- **준비도** [`js/conversationReadiness.js`](../js/conversationReadiness.js) — `reviewStates` 를 보고 주제별 학습 비율 계산. 70% 이상이면 `ready: true`.
- **평가기** [`js/localEvaluator.js`](../js/localEvaluator.js) — `normalizeJapanese`, `detectKnownVocabulary`, `detectGrammarPattern` (정규식), `evaluateConversationAnswer`. 모두 로컬 규칙 기반.
- **엔진** [`js/conversationEngine.js`](../js/conversationEngine.js) — `createEngine(topicId)` → `currentQuestion / submitAnswer / next / isDone / summary`. 메모리 상태.
- **뷰** [`js/views/conversation.js`](../js/views/conversation.js) — 주제 목록 → 진행 화면(질문+TTS+텍스트 입력+평가) → 요약.
- **라우트** `#conversation` — 하단 탭 "회화" 또는 홈 카드에서 진입.

### 회화 화면 흐름

```
[주제 목록]
  자기소개  100% · 준비 완료    [▶][👁]
  가족       40% · 학습 필요    [▷ disabled][👁]
  ...

[진행]
  Q1. お名前は何ですか。       [▶ 듣기][한국어 보기]
  내 답변 (일본어)
  [ textarea — 私は学생です。 ]
  [제출]

[평가 결과]
  ⚠️ 부분 적합 · 점수 80/100
  사용한 학습 단어: [学生 (がくせい)]
  감지된 문법 패턴: [〜は〜です]
  부족한 표현: 없음
  교정 힌트: 문장 끝 마무리 확인…
  모범 답안: 私はミンです。 (저는 민입니다.)
  [다음 질문 →]

[요약]
  🗣 회화 연습 완료 · 평균 점수 80 · 2/2 문항
  [다시 시작][주제 목록]
```


## 관련 문서
- 회화 어댑터 설계: [offline-conversation.md](./offline-conversation.md)
- 브라우저 수동 QA: [browser-qa-checklist.md](./browser-qa-checklist.md)

## 라운드 30 — 음성/매뉴얼/발음/단어 카드 UX

### Web Speech 음성 감지 안정화 (js/tts.js voice manager)
- 즉시 getVoices() + `voiceschanged` 이벤트 + 재시도 루프(0/250/500/1000/2000ms) + 캐시.
- speak() 호출 시 마지막으로 한 번 더 재확인 — 늦게 로드된 음성 회수.
- 설정 화면 「음성 상태」: 감지됨/없음/감지 중/미지원 + [음성 다시 감지] 버튼.
- 자동 재생 실패(브라우저 정책, `playback-error`)와 voice 없음(`no-ja-voice`)은 별개 메시지.
- 일본어 voice 가 없어도 흐름을 막지 않음 — 기존 스크립트/텍스트 폴백 유지.

### 사용 매뉴얼 토글 (settings.helpEnabled, 기본 OFF)
- 설정 「사용 매뉴얼 표시」 ON 시 8개 화면(홈/학습/단어 카드/문법/독해·청해/복습/이야기/회화)에
  접이식(details) 도움말 카드. OFF 시 DOM 에서 제거.

### 단어 발음 버튼
- 학습>단어>찾아보기 row · 복습(실패 노트/자주 볼 단어/오늘 복습)의 vocab row 에 🔊 버튼.
- aria-label/title 은 "발음 듣기" 고정 (단어/뜻 미포함 — 정답 누출 방지).
- 클릭은 발음만 — 학습 기록/정답/오답/streak/행동 로그 변화 없음.

### 단어 이미지 카드 흐름 (라운드 30 변경)
| 단계형 | 흐름 |
| --- | --- |
| ON | expose1 → expose2 → recall(3/5/7초) → confirm → quiz → answered |
| OFF | **quickPreview**(이미지+단어+읽기+뜻+발음) → quiz → answered |

- 모든 비퀴즈 단계에 [다음 단계/바로 확인/퀴즈로] + **[다음 단어 ⏭]** 두 버튼.
- 「다음 단계」= 같은 단어의 다음 단계. 「다음 단어」= skip — 정답/오답/실패 노트/정답률/
  행동 로그 모두 기록하지 않고 다음 카드로 (마지막 단어면 세션 요약).
- 학습 기록(recordResult/recordSessionItem/markStudiedToday/onAnswered)은 **quiz 답변 시점에만**.
- 단계 전환·다음 단어 시 stopSpeaking() + recall 타이머 정리.

## 라운드 31 — 단어 발음 보조 (romaji) + N5 의존성 백포트

### 단어 발음 보조: 히라가나 + romaji 표시
- `js/romaji.js` `kanaToRomaji()` — 기본 오십음/탁음·반탁음/요음(きゃ)/촉음(っ→자음 중복,
  っち→tch)/장음(ー→직전 모음 반복)/ん→n. 조사 발음 특수처리 없음 (reading 그대로 변환).
- `getVocabRomaji(v)` — `v.romaji` override 우선, 없으면 reading 런타임 변환 (데이터 수동 추가 없음).
- 표시: 카드(expose/quickPreview/confirm/해설) `待つ（まつ · matsu）`, 목록 row `待つ · まつ · matsu`,
  복습 row, 단어 예문 문제 해설, 스토리 하이라이트 패널. `.romaji-sub` 보조 스타일(작고 muted).
- 누출 방지: recall/quiz thinking 에 미표시, aria-label/title 미주입. TTS 는 일본어 원문만 (romaji 미전달).

### N5 의존성 백포트
- N5 reading/listening 80건 전수에 vocabIds/grammarIds/optional*/requiredCoverage(0.7) 태깅
  (`scripts/gen-deps-n5.mjs` 생성·검수 후 베이크). **N5 콘텐츠는 N5 id 만 참조** (smoke blocking).
- N5 스토리 8건 vocabularyIds/grammarIds 보강. 준비도 배지/스토리 라벨/locked 안내가 N5 에서도 동작.
