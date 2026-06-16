# 콘텐츠 작성 가이드

본 가이드는 JLPT 10분 앱의 학습 콘텐츠를 새로 작성하거나 확장할 때 따라야 할 원칙·형식·금지 사항을 정리한다.

---

## 1. 무료 / 저작권 원칙 (가장 중요)

- **모든 예문·번역·해설·청해 스크립트는 본 프로젝트용 신규 창작**.
- **금지** — JLPT 기출 문제집(시판 교재 포함, 예: 完全マスター/総まとめ/Try!/新完全マスター 등),
  상용 학습 앱 콘텐츠, 출판된 학습 자료, 사이트의 비공개 라이선스 자료를
  **그대로 복사하거나 번안하지 않는다**.
- **외부 사전 데이터 미사용** — JMdict / KANJIDIC2 / Tatoeba 등은 스키마만 호환 유지. 임포트 시
  반드시 라이선스 표기 자동화(아직 도입 안 함, 향후 작업).
- **유료 API / 외부 LLM 사용 금지** — 콘텐츠 생성에 ChatGPT / Claude / Gemini 같은 LLM 을 직접 호출하지 않는다.
  도구로 참고할 수는 있으나 그 출력을 그대로 데이터로 넣지 않는다.
- 본 저장소의 모든 코드/콘텐츠는 본 프로젝트용 창작이며 외부 라이선스 데이터는 포함하지 않는다.

## 2. JLPT 공식 단어/한자 목록은 비공개

JLPT 공식은 N5~N2 의 확정 어휘/한자/문법 목록을 공개하지 않는다. 본 앱의 [`levelTargets`](../js/data/levelTargets.js)
는 일반적으로 통용되는 **권장 누적 학습량** 을 채택한 목표치이며, 콘텐츠를 추가할 때는
"공식 시험 범위" 가 아니라 *해당 레벨 학습자에게 적합한 빈도/난이도* 를 기준으로 판단한다.

## 3. 영역별 작성 규칙

### 3.1 vocab (단어)

스키마:
```js
{ id, level, word, reading, meaningKo,
  exampleSentence, exampleTranslation,
  mnemonicText, imageKey, tags[] }
```

- **word** — 표준 형태(사전형). 동사라면 사전형(예: `行く`), 형용사라면 기본형(예: `安い`).
- **reading** — 全히라가나로 작성. 한자 위 후리가나 의도.
- **meaningKo** — 1~2개의 짧은 한국어 의미. 동의어가 여럿이면 `/` 로 구분.
- **exampleSentence** — **레벨 적합**한 짧은 일본어 예문. 더 어려운 한자/표현이 들어가지 않게.
  N5 는 1~12자, N4 는 1~16자, N3 는 1~20자 정도가 목표 길이.
- **exampleTranslation** — 자연스러운 한국어. 직역보다는 의역이 좋지만 본문 의미를 왜곡하지 않음.
- **mnemonicText** — 단어 의미를 떠올리게 하는 짧은 한국어 힌트(시각적 묘사). 정답을 직접 알려주지 않음.
- **imageKey** — [`mnemonic.js#PALETTE`](../js/mnemonic.js) 의 키 중 하나. 없으면 `default`.
- **tags** — 분류 태그 배열(예: `['명사','시간']`). 검색/필터 용도.

### 3.2 grammar (문법)

스키마:
```js
{ id, level, pattern, meaningKo, explanation, examples:[{ja,ko}], similarGrammarIds[], tags[] }
```

- **pattern** — `〜は〜です` 같은 한자/가나 + `〜` 자리표시자.
- **explanation** — 한국어로 사용 상황·뉘앙스·접속 형태를 1~3문장 안에서.
- **examples** — 최소 1개. 2개를 권장 (긍정 + 변형/반례).
- **similarGrammarIds** — 비교 학습용 짝(`grammarPairs.js` 에 해당 페어 추가 시).
- 정답 한국어 의미는 prompt 에 노출되지 않도록 `meaningKo` 로 분리(이미 buildQuestion 이 처리).

### 3.3 reading (독해)

스키마:
```js
{ id, level, title, passage, question, choices[4], answerIndex, explanation, tags[] }
```

- **passage** — N5 는 2~5문장, N4 는 4~8문장, N3 는 6~12문장 정도.
- **question** — 본문에서 직접 답을 찾을 수 있는 사실 확인형이 N5 / N4. N3~ 부터 추론형.
- **choices** — 4개. 모두 의미 있는 distractor (단순 어휘 다르기 X). 정답 텍스트가 본문 안에 있어도 OK (지문 특성).
- **answerIndex** — choices 의 0~3 범위.
- **explanation** — 왜 정답인지 + 다른 선택지가 왜 틀린지 짧게.

### 3.4 listening (청해) — **TTS 친화 작성**

스키마:
```js
{ id, level, scenario, script, question, choices[4], answerIndex, explanation, tags[] }
```

- **script 길이** — N5 1~3턴 / 30자 내외. Web Speech API TTS 가 자연스럽게 읽도록 짧게.
- **턴 구분자** — `'A — B'` 또는 `' — '` 양식으로 2인 대화 구성. (현재 단일 음성으로 합성됨 — 0.5 단계에서 분리 예정.)
- **어색한 한자 회피** — TTS 가 잘못 읽는 한자가 있으면 가나 표기 또는 다른 단어로 대체.
- **숫자** — 일본어 표기(`三時` 또는 `さんじ`) 또는 아라비아 숫자 모두 가능 — Web Speech 는 둘 다 ja-JP 로 처리.
- **scenario** — 어떤 상황인지 1줄 한국어 또는 짧은 일본어 라벨.

### 3.5 conversationTopics (회화 주제)

스키마:
```js
{ id, level, titleKo, situationTags[],
  requiredVocabIds[], requiredGrammarIds[],
  starterQuestions:[{ja, ko, expectedPatterns[], sampleAnswers:[{ja,ko}]}],
  repairHints:[{issue, ko, exampleJa}] }
```

- **requiredVocabIds / requiredGrammarIds** — **모두 실제 id 참조** (smoke 가 검증).
  주제 진행에 정말 필요한 핵심 항목만 (5~10개 이내).
- **starterQuestions** — 2~5개. 첫 인사/식별형 → 후속 확장.
  - `expectedPatterns` — `localEvaluator.PATTERN_REGEX` 의 키 중 하나.
- **sampleAnswers** — 학습자 레벨에 적합한 짧은 모범 답안. 새 어휘/문법을 도입하지 않음.
- **repairHints** — 자주 발생하는 학습자 오류 + 한국어 안내.

### 3.6 sentenceBank (학습 문장 은행)

스키마:
```js
{ id, level, ja, ko,
  sourceType, sourceId,
  vocabIds[], grammarIds[],
  situationTags[], canUseInConversation }
```

- **sourceType / sourceId** — 이미 존재하는 데이터에서 가져온 문장만 등록. 새 문장을 임의 추가하지 않음.
  - `'vocab'`/`'grammar'`/`'reading'`/`'listening'`/`'conversation'` 중 하나.
  - `sourceId` 는 해당 데이터셋의 실제 id (smoke 가 매번 검증).
- **vocabIds / grammarIds** — 문장이 *실제로* 사용하는 학습 항목 id 만 태깅. 활용형까지 인식 가능
  (예: `寒かった` → `v_n5_58 寒い`).
- **canUseInConversation** — 회화 모범 답안/예시로 그대로 보여줘도 되는 문장만 `true`.
  설명용/메타 문장(예: 「は」と「が」の違い…) 은 `false`.
- **situationTags** — `'자기소개'`, `'가족'`, `'카페'`, … 회화 주제와 짝지을 수 있는 자유 태그.

## 4. 레벨별 난이도 기준

| 레벨 | 한자 범위 | 문장 길이(평균) | 화제 |
| --- | --- | --- | --- |
| N5 | 기초 한자 (約100자 누적) | 짧고 단순. 1~12자 본문 | 인사·가족·일과·길안내·식음 |
| N4 | 일상 한자 (約300자 누적) | 1~16자 본문 | 일상 회화, 짧은 글, 가벼운 비교 |
| N3 | 사회적 한자 (約600자 누적) | 1~20자 본문 | 일상~가벼운 시사, 추론형 |
| N2 | 시사 한자 (約1000자 누적) | 1~30자 본문 | 신문 기사·평론적 표현 |

위 한자 수는 권장 누적이며 공식 확정 목록이 아님.

## 5. 회화에 재사용 가능한 문장 태깅 기준

`sentenceBank` 의 `canUseInConversation` 은 다음을 만족해야 `true`:

1. **자연스러운 회화 일본어** — 문법 설명/예문 비교용 단편 X.
2. **레벨 적합** — 그 레벨 학습자가 실제 사용·이해 가능.
3. **새 어휘 미도입** — 이 문장 안의 모든 핵심 단어는 같은 레벨 이하의 `vocab` 에 존재 (또는 이름/가타카나 등 학습 부담 낮은 요소).
4. **자기 완결적** — 앞뒤 맥락 없이도 한 문장으로 통한다.

설명용·예시 비교용·메타 문장은 `false` 로 저장하고 sentenceBank 에는 두되 회화 풀에서 자동 제외된다.

## 6. ID 명명 규칙

| 영역 | 형식 | 예 |
| --- | --- | --- |
| vocab        | `v_N{level}_{seq}`  | `v_n5_19` |
| grammar      | `g_N{level}_{seq}`  | `g_n5_11` |
| reading      | `r_N{level}_{seq}`  | `r_n5_2` |
| listening    | `l_N{level}_{seq}`  | `l_n5_8` |
| grammarPairs | `gp_N{level}_{seq}` | `gp_n5_3` |
| conversation | `conv_N{level}_{slug}` | `conv_n5_self_intro` |
| sentenceBank | `sent_N{level}_{seq3}` | `sent_n5_007` |

`seq` 는 단순 증가. 절대 재사용하지 않음 — 기존 항목을 지워도 새 항목은 새 번호.

## 7. 검증 — 추가 후 반드시 실행

```
node smoke.mjs    # 데이터 무결성 + 참조 검증 + N5 임계치
node qa.mjs       # DOM 시나리오 회귀
```

`smoke.mjs` 가 자동 강제하는 규칙:
- 모든 id 유일성 (전 영역)
- level ∈ {N5, N4, N3, N2}
- 필수 필드 존재
- 모든 참조(`sourceId`, `requiredVocabIds`, `requiredGrammarIds`, …) 가 실재 id
- choices.length === 4, answerIndex 범위, 선택지 중복 없음
- 정답 한국어 / 예문 번역 / 해설이 선택 전 노출 텍스트에 누출되지 않음
- N5 콘텐츠 1차 임계치 (단어 60+ / 문법 20+ / 독해·청해·페어 8+ / 회화 주제 6+ / sentenceBank 40+)

## 8. 금지 사항 요약

- ❌ 기출 문제집 / 시판 교재 / 상용 앱 문장 복사·번안
- ❌ 외부 라이선스 사전 데이터 직접 임포트 (스키마만 호환 유지)
- ❌ 유료 API / 외부 LLM 으로 콘텐츠 자동 생성 후 그대로 등록
- ❌ JLPT 공식 확정 어휘/한자 목록이라고 주장하는 표기
- ❌ sentenceBank 에 새 어휘/문법을 임의 도입 (다른 데이터의 항목 위에서만 작성)
- ❌ `canUseInConversation: true` 인 설명용 문장 등록

위반은 회화 엔진의 안전 제약(학습한 단어/문법 안에서만 진행)을 무너뜨릴 수 있다.

## 9. N4 콘텐츠 작성 기준 (라운드 22 보강)

N5 기준에 더해 다음을 따른다:

**어휘 (vocab)**
- N5 기초 단어(行く/食べる 등)와 중복 금지 — N4 는 자타동사 짝(始める/始まる, 変える/変わる),
  복합동사(乗り換える/引き出す), 한자 2자 명사(予約/相談/紹介/残業) 중심.
- 예문 1~16자 내외, N4 문법(〜てしまう/〜ておく 등)을 섞으면 좋음.
- `exampleReadings` 또는 `COMMON_FURIGANA` 로 후리가나 커버율 80%+ 유지 (smoke sentinel).

**문법 (grammar)**
- examples 의 readings 명시 권장 (자동 사전이 N4 한자를 모두 커버하지 못함).
- similarGrammarIds 로 비교 페어 후보 연결 (〜そうです/〜ようです 등).

**독해/청해**
- 약속 변경·안내문·메모·교통 같은 실생활 텍스트 톤.
- 청해 script 는 Web Speech TTS 가 한 호흡에 읽을 수 있는 1~2문장.

**스토리**
- bodyJa 4~7문단, **bodyRomaji 필수** (문단 수 일치 — smoke 검증).
- bodyHighlights 의 vocabId 는 가능하면 N4 vocab 참조 (학습 연결 동선).
- keyVocabularyIds ≥ 5, keyGrammarIds ≥ 2.

**회화 주제**
- requiredVocabIds/GrammarIds 는 실제 N4 항목 (N5 공통 문법 혼용 가능).
- situationTags 가 sentenceBank 의 태그와 교집합을 갖도록 — 주제당 회화 가능 문장
  **3개 이상 매칭** (smoke 가 자동 검증).

**1차 A 임계치** (라운드 14 달성치 — 역사 기록):
vocab 250 / grammar 40 / reading·listening 20 / sentenceBank 100(회화 가능 25+) /
pairs 8 / kanji 100 / stories 4+2 / topics 6.

## 10. N4 1차 B 작성 기준 (라운드 26 보강)

1차 A 기준에 더해:

- **후리가나는 100%가 기준** — 모든 신규 항목에 explicit readings 를 작성한다.
  smoke 가 N4 도 `== 100%` sentinel 로 잠그므로, 자동 사전 의존은 더 이상 허용되지 않는다.
- **readings 의 text 는 대상 문장에 실제 존재해야 한다** (blocking 검증).
  질문(question)용 단어를 scriptReadings/passageReadings 에 넣지 말 것 —
  선택지(choices) 단어도 마찬가지.
- **신규 단어는 빌더 패턴** (`V4()` + `R()`) 으로 추가 — id 는 `v_n4_251` 이후 연번.
- **자타동사 짝은 반드시 둘 다** 추가하고 tags 에 `'자타동사'` 를 붙인다.
- **수수표현/수동/사역/가능 문법** (g_n4_41~46) 을 sentenceBank 예문에 적극 재사용 —
  비교 페어(gp_n4_10~12)와 연결.
- **N4 스토리는 JS(stories.js)에 추가한 뒤 data/n4/stories.json 을 재생성**:
  `node -e "import('./js/data/stories.js').then(({stories})=>require('fs').writeFileSync('data/n4/stories.json', JSON.stringify(stories.filter(s=>s.level==='N4'), null, 2)+'
','utf-8'))"`
  (JS↔JSON drift 는 smoke 가 검증).
- **imageKey 분산** — 한 키가 신규 추가분의 8% 를 넘지 않게.

**1차 B 임계치** (smoke sentinel — 라운드 26 달성치 기준):
vocab 400 / grammar 60 / reading·listening 40 / sentenceBank 180 /
kanji 150 / stories 6+4 / 후리가나 전 영역 == 100%.

## 11. 중복/유사 중복 작성 주의 (라운드 27 보강)

- **word 는 전역(全레벨) 고유** — 같은 단어를 다른 레벨에 다시 만들지 말 것.
  smoke 가 blocking 으로 차단한다. 상위 레벨에서 필요하면 기존 항목을 참조(vocabIds)로 연결.
- **exampleSentence / sentenceBank.ja 완전 중복 금지** (blocking).
  vocab 예문을 sentenceBank 에 재사용할 때는 반드시 sourceId 또는 vocabIds 로 연결 —
  연결 없는 동일 문장은 "무관 복사 의심" 경고로 표면화된다.
- **유사 예문(편집거리≤2)은 허용되는 패턴이 따로 있다** — 「Xが痛いです」류 최소 문형 공유는
  서로 다른 표제어를 가르치는 한 의도적 패턴으로 reviewed. 단, 같은 표제어 계열에서
  거의 같은 문장을 또 만들지는 말 것 (검수 비용 증가).
- **한자 문자는 전역 고유** (blocking). 추가 전에 기존 300자 목록과 대조.
- **reading/listening choices 는 항목 내 중복 금지** (blocking).
- N4 콘텐츠에 N3/N2 급 문법(に違いない/ばかりか/べきだ 등)을 넣으면 경고로 표면화된다.

**완성 C 임계치** (smoke sentinel — 라운드 27 달성치 기준):
vocab 650 / kanji 200 / grammar 75 / reading·listening 50 / sentenceBank 230 /
topics 8 / 후리가나 == 100% / 전역 중복 0.

## 12. 학습 의존성(vocabIds/grammarIds) 작성 기준 (라운드 29 안정화)

reading/listening/story/conversationTopics 는 학습 준비도 계산용 의존성 필드를 갖는다.

- **vocabIds / grammarIds (핵심)** — 본문(지문/스크립트)과 문제 이해에 꼭 필요한 항목만.
  **본문에 실제 등장하는 핵심 단어만 태깅**한다. 선택지·질문에만 나오는 단어는 넣지 않는다.
- **optionalVocabIds / optionalGrammarIds (보조)** — 몰라도 전체 이해가 가능한 항목 (주로 N5 기초어).
- **문법은 해당 문장 이해에 필요한 문형만 태깅** — 단순히 비슷해 보이는 패턴을 넣지 않는다.
- **상위 레벨(N3/N2) 문법/단어 혼입 금지** — N4 콘텐츠의 의존성은 N4/N5 만 참조 (smoke blocking).
- **N5 콘텐츠의 의존성은 N5 만 참조** (N4 포함 금지 — smoke blocking).
- **N5/N4 reading/listening/story 는 의존성 필드가 필수** — 신규 항목 추가 시
  gen-deps(-n5).mjs 초안 → 검수 → 베이크. 태깅 없는 항목은 smoke 전수 검사에서 실패한다.
- requiredCoverage 는 기본 0.7 — 특별히 쉬운/어려운 항목만 조정.
- 신규 작성 시 `node scripts/gen-deps.mjs` 로 초안을 생성한 뒤 **반드시 눈으로 검수**하고 베이크.
- 스토리: keyVocabularyIds/keyGrammarIds = 학습 연결 UI 에 보여줄 핵심,
  vocabularyIds/grammarIds = 추천/준비도 계산용 전체(준핵심 포함).

## 13. N3 작성 기준 (라운드 32 — 0차 시드)

- **N3 콘텐츠의 의존성은 N5/N4/N3 만 참조** — N2 id 참조는 smoke blocking.
- N3 도 N5/N4 와 동일하게: explicit readings 필수(후리가나 100% 목표, sentinel ≥90%),
  의존성 필드 필수(gen-deps-n3.mjs 초안 → 검수 → 베이크), romaji 는 런타임 변환.
- 문법은 N3 핵심 문형만 — N2급(に違いない/ばかりか/べきだ 등) 혼입 금지.
- N4 와 헷갈리는 문형은 similarGrammarIds 또는 grammarPairs 로 연결
  (おかげで/せいで, うちに/間に, みたいだ/ようだ 등).
- **0차 임계치** (smoke sentinel): vocab 100 / kanji 100 / grammar 20 / reading·listening 8 /
  sentenceBank 50(회화 40) / topics 3 / stories 3.
- **1차 임계치** (라운드 34 상향): vocab 300 / kanji 200 / grammar 40(+pairs 8) /
  reading·listening 각 20 / sentenceBank 120(회화 100) / topics 6 / stories 6(이야기 4+단편 2).
  신규 reading/listening/story 는 의존성 태깅 전수 (핵심 ≥ 1, smoke blocking).

### N3 0차 안정화에서 확정된 작성 규칙 (라운드 33)

- 유의어로 meaningKo 가 겹칠 때는 괄호 보충으로 구분 — 「任せる (일을) 맡기다」 vs 「預ける 맡기다(보관)」.
  (퀴즈 선택지는 meaningKo 텍스트 기준 dedupe 되지만, 표기 자체도 구분하는 것이 좋다.)
- 청해 화자 구분은 " — " 표기 통일 (전 레벨 공통 관행).
- 독해 의견문에서 「べきだ」 등 N2급 패턴 금지 — 「たほうがいい」 사용.

### N3 1차 확장에서 확정된 작성 규칙 (라운드 34)

- **questionReadings/scriptReadings 에 질문용 단어 혼입 금지** — readings 의 text 는
  반드시 대상 문장(passage/script)에 실제로 존재해야 한다 (smoke blocking 이 잡지만,
  작성 단계에서 지문/질문 readings 를 분리해서 쓰는 습관이 더 싸다).
- sentenceBank 의 sourceType 은 vocab/grammar/reading/listening/conversation 만 유효 —
  특정 소스가 없는 회화 문장은 'conversation' + 관련 토픽 id 로 연결한다.
- gen-deps 류 생성기는 콘텐츠 라운드마다 신규 문법 패턴을 따라가야 한다 — 단,
  って/きる/かける처럼 과탐(false positive) 위험이 큰 짧은 패턴은 테이블에 넣지 않는다.
- 재베이크는 신규 id 만 별도 테이블(`*_R34` 식)로 추가 — 기존 베이크와 수동 보강 코드를
  덮어쓰지 않는다.

### N3 1차 안정화에서 확정된 작성 규칙 (라운드 35)

- **meaningKo 는 레벨 교차로도 유일해야 한다** — 하위 레벨에 같은 뜻 단어가 있으면
  뉘앙스를 괄호로 구분 (全然 "전혀" ↔ 全く "완전히, (부정과 함께) 전혀"). smoke blocking.
- **grammar explanation 은 15자 이상** — 형태(접속)·사용 장면·근접 문형과의 차이 중
  최소 1가지를 담는다. "최상급 표현." 같은 한 줄 요약 금지. smoke blocking.
- **N4 와 혼동되는 N3 문형은 similarGrammarIds 나 grammarPairs 로 연결** — 비교 대상이
  덱에 없는 경우(현재 かわりに 1건)만 예외로 두고 smoke 가 "미연결 ≤ 1" 로 잠금.
- **독해 정답 선택지는 본문 문장을 10자 이상 그대로 복사하지 않는다** — 패러프레이즈로
  이해를 확인 (smoke unreviewed 경고). 청해는 듣고 찾는 형식이므로 verbatim 허용.
- **오답 선택지에도 N2급 패턴(べきだ 등) 금지** — 본문 스캔 대상 밖이지만 노출은 동일하다.
- sentenceBank 의 vocabIds 단어는 문장 표기와 일치시킨다 (ごみ/ゴミ 같은
  가나-가타카나 불일치 금지).

### N3 2차 확장에서 확정된 작성 규칙 (라운드 36)

- **2차 임계치** (smoke sentinel): vocab 600 / kanji 300 / grammar 70(+pairs 16) /
  reading·listening 각 40 / sentenceBank 220(회화 180) / topics 9 /
  stories 10(이야기 6+단편 3) / 장문 독해(지문 200자+) 3편.
- **대량 추가 전에 기존 전체 word 목록을 덤프해서 대조** — 1467개 한자 단어 목록을 먼저
  뽑아 두고 작성하면 충돌이 한 자릿수로 줄어든다 (이번 라운드 교차 이슈 1건).
- **문법 패턴명에 한국어 뜻을 넣지 않는다** — 퀴즈 화면에 패턴명이 노출되므로
  meaningKo 와 겹치면 정답 누출이 된다 ('〜らしい (전형·〜답다)' → '〜らしい (전형)').
- 새 문법을 추가하면 gen-deps-n3 의 탐지 테이블도 같이 갱신한다 (과탐 위험 패턴 제외).
- 신규 grammar 는 작성 시점에 similarGrammarIds 또는 pair 를 반드시 부여한다
  (smoke "미연결 0" 잠금 — かわりに 예외도 にかわって 신설로 해소됨).

### N3 2차 안정화에서 확정된 작성 규칙 (라운드 37)

- **grammar 패턴은 레벨 교차로도 유일해야 한다** (smoke blocking). 하위 레벨과 같은
  문형이 필요하면 확장형으로 차별화한다 — ことにする(N4) vs ことにしている(N3 습관).
- **학습범위 밖 한자 정책 (확정)**: 하위 빈출 한자(彼/活/困/誰 등)는 후리가나 100%
  전제로 예문에 허용(기준 46/한도 60). N2권 한자(鞄/遺跡/排/罰 등)는 예문에서 금지.
- **청해 정답도 10자 이상 verbatim 금지** — 시간/숫자/짧은 구는 표준 형식으로 허용.
- **회화 가능(canUseInConversation) 문장은 32자 이하** (blocking).
- 지문 200자+ 독해는 long-passage 클래스로 가독성 스타일이 자동 적용된다 —
  장문 작성 시 별도 처리 불필요, 줄 길이만 신경 쓸 것.

### N3 3차 마무리 확장에서 확정된 작성 규칙 (라운드 38)

- **대량 어휘 추가 전 도메인 포화도 점검** — 생활/건강/기초 동작 영역은 N5~N4와 겹치기
  쉽다. 후보 단어 배열을 만들어 `vocab.word` Set 과 대조하는 사전 검증 스크립트를 먼저
  돌리고, 중복이 많으면 추상/논리/사회/복합동사/부사 등 저중복 도메인으로 전환한다.
- **데이터 일괄 편집은 반드시 라인 단위로** — `String.replace` 의 전역 첫 매칭은 다른
  엔트리의 동일 토큰(특히 id 문자열)을 잘못 건드려 sourceId/필드를 손상시킨다. id 제거·
  치환은 대상 라인만 잡아 처리하거나, 충분한 좌우 문맥을 포함한 유일 문자열로 매칭한다.
- **학습범위 밖 한자 정책 (라운드 38 갱신)**: 기준 62 / 한도 75. 彼/誰/塔 등 하위 빈출
  한자는 후리가나 100% 전제로 허용, N2권 한자는 여전히 예문 금지.
- 장문 독해는 지문 **200자 이상**일 때만 long-passage UX가 켜진다 — "장문" 태그만으로는
  부족하니, 장문 의도면 본문을 200자 이상으로 작성한다.
