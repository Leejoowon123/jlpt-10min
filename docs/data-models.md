# 데이터 모델 (Data Models)

모든 콘텐츠/로그 데이터 스키마의 source of truth. (README 에서 이동)
로딩 구조(dataLoader/contentRepository/JSON 분리)는 [data-loading-plan.md](./data-loading-plan.md) 참조.

## 파일 구조

```
D:\TEST\
  index.html                       앱 셸 (탑바, 화면 컨테이너, 하단 탭)
  styles.css                       전체 스타일 (모바일 우선, 다크 테마)
  README.md                        이 파일
  LICENSE_NOTES.md                 데이터 라이선스 메모
  package.json                     {"type":"module"}  ← node ESM 테스트용
  smoke.mjs                        회귀 테스트
  js/
    app.js                         엔트리. 라우트 등록 후 start()
    router.js                      해시 라우터
    storage.js                     localStorage 단일키(jlpt10min:v1) 영속화
    state.js                       즐겨찾기/실패노트/세션 진행 액션
    srs.js                         SM-2류 SRS. recordResult가 실패노트도 자동 등록
    questions.js                   학습 항목 → 4지선다 빌드
    curriculum.js                  하루 10분 규칙 + 단어 vocabMode 70/30 분배
    contentStats.js                레벨별 콘텐츠 수 + 목표 대비 progressFor
    conversationReadiness.js       회화 주제별 학습 준비도 + sentenceBank 커버리지
    sentenceAccess.js              sentenceBank 조회 유틸 (known/forTopic/coverage)
    localEvaluator.js              회화 답변 규칙 기반 평가 (정중체/짧은답변/비일본어 힌트)
    conversationEngine.js          회화 한 주제 진행 상태 관리
    stt.js                         Web Speech SpeechRecognition 어댑터 (안전 폴백)
    tts.js                         Web Speech API 래퍼 + hasJaVoice 사전 감지
    mnemonic.js                    동적 SVG 연상 카드 (이모지 + 색상 18종)
    ui.js                          토스트 / 레벨 칩 / escape / typeLabel
    views/
      home.js                      홈 (오늘 통계 + 회화 준비도 + 학습 영역 진입). 학습량 현황 카드는 UI에서 숨김.
      today.js                     오늘의 10분 플로우 + 완료 요약. 단어는 vocabMode 분기
      study.js                     영역별/레벨별 학습 목록 + 단어 모드 토글
      review.js                    실패 노트 / 자주 볼 단어 / 오늘 복습
      grammarCompare.js            비슷한 문법 비교 학습
      questionView.js              공용 문제 풀이 카드 (정답 선택 전 모든 힌트/번역 숨김)
      vocabCardView.js             단어 이미지 카드 모드 — 이미지 → 단어 4지선다 → 전체 노출
      conversation.js              회화 주제 목록 / 진행 / 요약
    data/
      vocab.js  grammar.js  reading.js  listening.js  grammarPairs.js
      levelTargets.js              레벨별 권장 학습 목표치
      conversationTopics.js        회화 주제 + 필요 어휘/문법/질문
      sentenceBank.js              학습 문장 은행 (sourceId / vocabIds / grammarIds / canUseInConversation)
docs/
  offline-conversation.md          오프라인 회화 어댑터 설계
  content-authoring-guide.md       콘텐츠 작성 가이드 (라이선스/스키마/금지사항)
  n5-expansion-plan.md             N5 라운드 기록 + 다음 라운드 (대량2차: 500)
  browser-qa-checklist.md          실제 브라우저 수동 QA 체크리스트 + 결과 기록 표
  next-roadmap.md                  단계별 우선순위 (안정화→브라우저QA→대량2차→한자→N4→모바일)
  data-loading-plan.md             콘텐츠 JSON 분리 + dataLoader 점진 이전 계획 (라운드 16)
data/
  n4/stories.json                  레벨별 JSON (lazy fetch 대상 — dataLoader 가 로드, JS fallback 보장)
js/dataLoader.js                   레벨/영역별 JSON 동적 로더 (fetch 우선 + JS data fallback + 메모리 캐시)
js/contentRepository.js            데이터 접근 계층 — 동기 getter(getVocab/findItem 등) + async preload.
                                   시작 시 JS 정적 데이터, preloadRepositoryLevel 후 JSON 데이터로 교체.
                                   storyView/study(card lookup) 가 사용. N4 이후 신규 콘텐츠는 JSON-first 작성 예정.
```


## 데이터 모델

`storage.js` 의 단일 키 `jlpt10min:v1` 아래 JSON.

```ts
{
  userProgress: { targetLevel, lastStudiedDate, totalSessions, streakDays }
  reviewStates: { [itemId]: { itemType, correctCount, wrongCount, dueAt, interval, ease } }
  failureNotes: { [itemId]: { itemType, wrongCount, lastWrongAt, reason } }
  favorites:    { [itemId]: { itemType, memo, createdAt } }   // 단어만 신규 추가
  sessions:     { [YYYY-MM-DD]: { completed, items:[{itemType,itemId,correct}] } }
  seenItemIds:  { ... } // 예약 필드
}
```

각 학습 항목(`VocabItem`/`GrammarItem`/`ReadingItem`/`ListeningItem`) 은 `data/*.js` 에 분리. `LearningQuestion` 은 런타임에 [questions.js#buildQuestion](../js/questions.js) 가 합성.


## 한자 데이터 모델

```ts
{
  id, level, kanji,
  hiragana,         // 대표 학습용 읽기 (필수)
  meaningKo,
  onyomi:  string[],  // 음독 (카타카나)
  kunyomi: string[],  // 훈독 (히라가나)
  strokeCount, radical,
  tags: string[],
  exampleWords: { word, reading, meaningKo }[],
  mnemonicText, imageKey,
}
```

- **N5 50자** 우선 추가 — 숫자 / 요일·자연 / 사람·가족 / 형용사 / 학교 / 위치 / 자연.
- 예시 단어는 기존 N5 vocab 과 연결.
- 모든 데이터는 본 프로젝트용 창작.


## 학습 문장 은행 (sentenceBank)

회화 엔진이 향후 **"사용자가 배운 문장만"** 사용하도록 지원하는 인덱스.
[`js/data/sentenceBank.js`](../js/data/sentenceBank.js) (N5 현재 50개).

```js
{ id, level, ja, ko,
  sourceType,        // 'vocab'|'grammar'|'reading'|'listening'|'conversation'
  sourceId,          // 해당 데이터셋의 실제 id (smoke 가 무결성 검증)
  vocabIds[], grammarIds[],
  situationTags[],
  canUseInConversation }
```

- **모든 문장은 기존 데이터(vocab/grammar/reading/listening/conversation) 의 항목에서 파생** —
  새 어휘·문법 임의 도입 금지.
- `canUseInConversation: true` 인 문장만 회화 모범 답안/예시 풀에 노출 가능.
- 회화 주제 행에 **관련 문장 N개 · 학습한 표현 M개** 가 자동 표시 (vocab/grammar 매칭 기반).

조회 유틸: [`js/sentenceAccess.js`](../js/sentenceAccess.js)
- `getSentencesByLevel(level)`
- `getConversationUsableSentences(level)`
- `getKnownSentences(level, reviewStates)`
- `getSentencesForTopic(topicId, reviewStates)`
- `topicSentenceCoverage(topicId, reviewStates)` — `{relatedCount, knownCount, relatedIds}`

회화 엔진은 추후 (0.3 이후) **getKnownSentences / getSentencesForTopic 으로 모범 답안/예시 선택 범위를 제한** 할 예정. 본 단계에서는 데이터 구조와 화면 노출만 준비.


## StoryItem (이야기/단편)

스키마 상세는 [features.md](./features.md) 의 "이야기 / 단편 소설" 섹션과
[data-loading-plan.md](./data-loading-plan.md) (bodyRomaji 필수 / coverImage 선택) 참조.
핵심 필드: bodyJa / bodyReadings / **bodyRomaji**(문단 수 일치) / bodyKo /
bodyHighlights / keyVocabularyIds / keyGrammarIds / coverImage{src,altKo,licenseId} / sourceType:'original'.

## Firebase 로그 구조

actionLogs / userActivity / anonymousActivity 스키마와 rules 는
[firebase-logging.md](./firebase-logging.md) 가 source of truth.

## dataLoader / contentRepository 개요

- `js/dataLoader.js` — 레벨/영역별 JSON fetch 우선 + JS fallback + 메모리 캐시.
- `js/contentRepository.js` — 동기 getter + async preload 호환 계층.
상세: [data-loading-plan.md](./data-loading-plan.md)

## 콘텐츠 학습 의존성 + 준비도 (라운드 29)

### 의존성 필드

| 필드 | 대상 | 의미 |
| --- | --- | --- |
| `vocabIds` / `grammarIds` | reading, listening | 본문·문제 이해에 필요한 **핵심** 항목 (N4 콘텐츠는 N4/N5 만 참조) |
| `optionalVocabIds` / `optionalGrammarIds` | reading, listening | 몰라도 전체 이해 가능한 **보조** 항목 |
| `requiredCoverage` | reading, listening | 준비 판정 커버 기준 (기본 0.7) |
| `keyVocabularyIds` / `keyGrammarIds` | stories | 학습 연결 UI 노출용 핵심 |
| `vocabularyIds` / `grammarIds` | stories | 추천/준비도 계산용 전체(준핵심) |
| `requiredVocabIds` / `requiredGrammarIds` | conversationTopics | 회화 필수 항목 (기존) |

### readiness 계산 (js/contentReadiness.js)

- "학습함" = `reviewStates[id]` 존재 (1회 이상 노출).
- `totalKnownRatio` = (배운 핵심 vocab + grammar) / (전체 핵심 vocab + grammar). 의존성 없으면 1.
- 분류: `ready` ≥ 0.8 / `good_next` ≥ 0.5 / `locked` < 0.5 (상수 `READINESS_READY_RATIO` 등).
- 추천 정렬: ① ready+미완료 (ratio 낮은 순 — 너무 쉬운 것 후순위) ② good_next (missing 적은 순)
  ③ locked (missing 적은 순, 추천이 비지 않게 포함). N4 레벨 풀은 N4+N5.
- locked 여도 진입은 막지 않는다 — UI 는 "먼저 학습하면 좋아요" 안내 + 학습 버튼만 제공.
- 오늘의 10분: 독해/청해 신규 후보를 ready → good_next → locked 순으로 배치 (그룹 내 셔플,
  fallback 유지로 큐 10개 보장).

### 레벨별 의존성 참조 규칙 (라운드 32 확정)

| 콘텐츠 레벨 | 의존성으로 참조 가능한 레벨 |
| --- | --- |
| N5 | N5 만 |
| N4 | N4 + N5 |
| N3 | N3 + N4 + N5 (N2 금지) |

추천 풀(levelPool)도 같은 누적 규칙: N3 추천은 N5/N4/N3 콘텐츠를 함께 정렬한다.

### readiness 분류 보강 (라운드 33)

- 핵심 비율 < 0.5 라도 **기초(optional) 의존성을 80% 이상 학습**했으면 locked → good_next 승격
  (`OPTIONAL_FOUNDATION_RATIO`). N5/N4 를 마친 사용자에게 N3 콘텐츠가 자연스럽게 열린다.
- 추천 정렬에 **목표 레벨 소가중치**(`TARGET_LEVEL_BONUS`, 같은 클래스 내 순서만 조정) +
  **목표 레벨 최소 슬롯**(상위 n 에 목표 레벨 ≥ min(2, 보유 수) 보장, 꼬리 교체 방식).
  복습(N5/N4) 항목은 배제되지 않는다.
- **복습 최소 슬롯 (라운드 34)** — 목표 레벨 항목이 늘어 상위 n 을 전부 차지하는 경우,
  꼬리 1 슬롯을 최상위 하위 레벨(복습) 항목으로 교체해 "복습 배제 금지" 를 양방향으로 보장
  (`ensureTargetLevel` 내 역방향 가드, smoke/qa [188] 잠금).

### N3 의존성 베이크 이력

- 라운드 32: `READING_DEPS_N3` / `LISTENING_DEPS_N3` / `STORY_DEPS_N3` (r/l_n3_1~9, story 1~3).
- 라운드 33: r_n3_1/2 핵심 의존성 수동 승격 (베이크 뒤 패치 블록).
- 라운드 34: `*_DEPS_N3_R34` — 신규 id(r/l_n3_10~20, story_n3_004~006)만 담은 별도 테이블을
  파일 끝에 추가. 기존 테이블/수동 패치는 그대로 유지된다 (Object.assign 순서 보장).
- 라운드 35: 추천 회귀를 smoke 가 3개 상태로 검증 — ① 빈 학습(locked 라도 추천 비지 않음),
  ② N5/N4 마스터(N3 ≥ 1 + 복습 ≥ 1), ③ N3 부분 학습(완료한 항목의 의존 콘텐츠가
  ready 로 상위 진입, locked 독점 금지).
- 라운드 36: `*_DEPS_N3_R36` — 신규 id(r/l_n3_21~40, story_n3_007~010)만 담은 별도 테이블.
  gen-deps-n3 탐지 패턴 24종 추가(g_n3_41~70 중 안전한 것만). N5/N4 마스터 기준 분포:
  reading ready 1 / good_next 39 / locked 0, listening ready 14 / good_next 26 / locked 0,
  stories good_next 7 / locked 3 — 기초 승격(OPTIONAL_FOUNDATION_RATIO) 덕에 locked 독점 없음.
- 라운드 37: grammar id 의미 변경 시 참조 재매핑 절차 확립 — g_n3_1/2 재정의에 따라
  sentenceBank(sourceId/grammarIds)·stories(grammarIds + 베이크 테이블)·grammarPairs(a/b)·
  similarGrammarIds 를 전부 추적해 N4 기본형 id 로 이관. grammar 패턴은
  "레벨 교차 동일 0" 이 blocking 이므로, 같은 문형의 레벨 이동은 반드시 이 절차를 따른다.
- 라운드 38: `*_DEPS_N3_R38` — 신규 id(r/l_n3_41~80, story_n3_011~014)만 별도 테이블.
  N3 누적 vocab 2702/2700 달성으로 어휘 목표 완료. N5/N4 마스터 기준 분포:
  reading ready 1 / good_next 79 / locked 0, listening ready 22 / good_next 58 / locked 0,
  stories good_next 7 / locked 7 — 장문/심화 story 가 늘어 locked 가 생기지만(의존 어휘 미학습),
  전 영역 good_next 이상이 다수라 N5/N4 수료자에게 자연스럽게 열린다. 큐 fallback·복습 슬롯 유지.
- 라운드 39 (N3 완성): 데이터 무결성 회귀 방지를 smoke blocking 으로 상설화 —
  sourceId 전수 무결성(7개 sourceType), 필드 시프트(sourceId 타입), scriptReadings⊆script,
  선택지 N2 패턴 0. 이는 데이터 일괄 편집(특히 전역 문자열 치환)이 일으키는 필드 손상을
  CI 단계에서 잡는다. N2 시드부터도 동일 검증을 레벨별로 둔다.
- 라운드 40 (N2 0차 시드): `READING_DEPS_N2`/`LISTENING_DEPS_N2`/`STORY_DEPS_N2` 베이크
  (`scripts/gen-deps-n2.mjs`, N5~N2 참조 허용·N1 미등록 자동 배제). 레벨 누적 참조 규칙 확장:
  | 콘텐츠 레벨 | 참조 가능 | 추천 풀(levelPool) |
  | --- | --- | --- |
  | N2 | N5+N4+N3+N2 (N1 금지) | N5~N2 누적 |
  N3 마스터 기준 N2 분포: reading ready 2/good_next 7/locked 0 — 추천에 N2+하위 복습 공존.
  grammar distractor 의 meaningKo dedup 누락(flaky)을 buildQuestion 에서 영구 수정.
- 라운드 41 (N2 0차 안정화): 데이터 변동 없음(품질 잠금). smoke `N1PAT` 를 N2 전 영역
  blocking 스캔으로 확정(오탐 패턴 제거), 청해 verbatim 10자+·N2 meaningKo 동일 warning
  추가. l_n2_8 청해 정답 verbatim 1건 paraphrase. N2 는 구조 검증 단계 유지.
- 라운드 42 (N2 1차 확장): vocab 300/kanji 200/grammar 40(+pairs 10)/reading·listening 각 20/
  sentenceBank 120/topics 6/stories 6 로 확장. `gen-deps-n2.mjs` 의 `N2_GRAMMAR_PATTERNS` 에
  g_n2_23~40 추가 후 READING/LISTENING/STORY_DEPS_N2 재베이크(핵심 의존성 0건 없음). 신규
  kanji exampleWords 는 vocab 전수 char→word 맵에서 검증해 실존 단어만 참조. N2 sentinel
  floor 를 1차 수치로 상향(smoke 라운드 42 블록). N2 는 구조 검증 단계 유지.
- 라운드 43 (N2 1차 안정화): 데이터 변동 최소(품질 잠금). **gen-deps-n2 가 의존성을 본문
  (passage/script)에서만 도출**하도록 변경 — 질문(question)의 일반어(正しい/どれ 등)가 핵심
  vocabId 로 새던 것을 차단하고 전 영역 재베이크(핵심 0건 없음, 질문어 누출 0). 복구된
  v_n2_77 reading 괄호 아티팩트 복원, v_n2_181 meaningKo 차별화. smoke 라운드 43 블록 추가
  (복구 v_n2_6~105 무결성 / N2 reading 괄호 금지 / N2 grammar.pattern 전역 유일 / 핵심 vocab
  본문 등장 / exampleSentence 중복 0). 레거시 N5↔N4 동일 문형 4종은 reviewedWarning 으로 추적.

- 라운드 44 (N2 2차 확장): vocab 900/kanji 300/grammar 80(+pairs 20)/reading·listening 각 50/
  sentenceBank 320/topics 10/stories 10 로 확장. 600개 어휘 확장은 배치 생성기(_vbatch.py +
  _vdata_F~K)로 수행하며, 각 배치가 라이브 vocab.js 의 word 집합과 충돌을 검사(0 보장)한다.
  신규 smoke blocking: **vocab reading+meaningKo 조합 중복 0**(전역 — 동철동의 중복 차단).
  smoke 라운드 44 sentinel(2차 floor) + 장문 200자+ ≥3 추가. N2 는 안정화 단계 유지.

- 라운드 46 (N2 3차 마무리 확장): vocab 2300(누적 5002)/kanji 400(누적 1000)/grammar 180(+pairs 45)/
  reading·listening 각 120(장문 200자+ 18편)/sentenceBank 600(회화 600)/topics 18/stories 18
  (short_story 8) 로 확장 — 핵심 5개 영역 + 누적(vocab 5000·kanji 1000) 목표 100% 달성.
  어휘 확장은 배치 생성기(_vbatch.py + _vdata_L~Y)로 수행(배치별 충돌 가드, 전역 word 중복 0).
  reading/listening/story 의존성은 `scripts/gen-deps-n2.mjs` 재실행→재베이크로 120/120/18 전수 갱신
  (이전 베이크가 50/50/10 으로 stale 했던 것을 전량 최신화, 핵심 의존성 0건 없음). 동철동의 동음어
  glose 차별화 7건(規程↔規定·受給↔需給·景観↔警官·試行↔施行·校外↔郊外·肩書き↔肩書·申込↔申し込み),
  활용형 readings 정합 5건(持ち越し 등 명사형 예문화), 예문 중복 2건 해소, "이사" 3중복(取締役→이사(임원)).
  smoke 라운드 46 sentinel(3차 floor + 누적 5000/1000 + short_story ≥6 + 장문 ≥15) + qa [233] 추가.
  ⚠️ grammar 80→180 신규 100문형은 smoke `N1PAT` 0 통과 — 단 일부 N2/N1 경계 문형(てやまない·を皮切りに·
  ないではおかない 등)은 레퍼런스별 판정이 갈려 **3차 안정화 라운드에서 재분류 검토 대상**으로 표시.

- 라운드 47 (N2 3차 안정화/최종 품질 잠금): 콘텐츠 수량 추가 0. grammar 신규 100문형 중 **N1급 29문형을
  검증된 N2 문형으로 교체**(같은 id 유지·참조 재매핑) + 영향 pairs 8건 재작성 — `_gen_n1fix.py` 로
  (a)신규 패턴이 **전 레벨**(N3 포함) 부재인지, (b)`N1PAT` 비매치인지, (c)readings 정합인지 검증 후 in-place
  치환. 교체 N2 문형은 deck/N3에 없는 さえ〜ば·上に·ないかぎり·に関する·に対する·をめぐる·をきっかけとして·
  きる·ぬく·ほどだ 등. stories 3편 keyVocab ≥5 보강 후 gen-deps 재베이크(mismatch 0). conversationTopics
  전 질문 sentenceBank 연계 ≥1(policy_debate Q1 → sent_n2_055). smoke `N1PAT` 확장(てやまない·を皮切り·
  ないではおか·たら最後·ずじまい·が関の山·はおろか·ようものなら 등 영구 차단) + smoke 라운드 47 **N2 완성
  선언 기준 블록**(blocking, stale bake 차단 포함) + qa [234]. **N5~N2 전 레벨 콘텐츠 완성.**

## gen-deps-n2.mjs — N2 의존성 생성기 (유지보수 도구)

`scripts/gen-deps-n2.mjs` 는 **임시 파일이 아니라 버전 관리에 포함되는 유지보수 도구**다.
N2 reading/listening/stories 의 의존성(vocabIds/grammarIds/optional*/requiredCoverage)을
**본문(passage/script)에서만** 자동 도출한다(질문어 누출 방지).

- 실행: `node scripts/gen-deps-n2.mjs` → `_deps2_{reading,listening,stories}.json` 출력.
- 베이크: 출력 JSON 을 각 데이터 파일의 `const READING_DEPS_N2 / LISTENING_DEPS_N2 /
  STORY_DEPS_N2 = {...}` 에 교체. 파일 하단의 `Object.assign` 루프가 런타임에 주입한다.
- 검증: 베이크된 테이블은 항상 생성기 출력과 일치해야 한다(라운드 45 재검증 결과 mismatch 0).
- N2 콘텐츠를 추가/수정하면 반드시 재실행 → 재베이크 → `node smoke.mjs` 로 핵심 의존성 0건 없음 확인.
- (N3 용은 `scripts/gen-deps-n3.mjs`, 같은 정책.)
