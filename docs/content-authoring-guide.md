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

### N3 완성 확정 / 회귀 방지 (라운드 39)

- **N3 완성 기준 (smoke 잠금)**: 누적 vocab ≥2700 · 누적 kanji ≥600 · grammar ≥120 ·
  reading ≥80 · listening ≥80 · 후리가나 100% · 의존성 전수 태깅 · 전역 중복 0 ·
  N2 참조 0 · unreviewed 0. 한 레벨을 "완성" 선언하려면 이 형태의 기준 블록을 smoke 에 둔다.
- **회귀 방지 검증을 데이터 라운드마다 유지**: ① 필드 손상 흔적(타입·끝 구두점·배열잔재)
  ② sourceId 전수 무결성 ③ scriptReadings 가 script 에만 존재 ④ 선택지 N2급 패턴 0.
  이 4가지는 라운드 38 에서 실제 발생한 손상을 잡아낸 검증이므로 상위 레벨(N2)에도 그대로 적용.
- **학습범위 밖 한자 정책 (최종 확정)**: 기준 62 / **한도 75**. 1300 어휘 규모에서 하위 빈출
  한자(彼 등) 가 자연 발생하는 분포를 수용하되, N2 한자 대량 유입은 막는 안전선.

## 14. N2 작성 기준 (라운드 40 — 0차 시드)

- **N2 의존성은 N5/N4/N3/N2 모두 참조 가능** (N2 는 최상위 목표 레벨). N1 id 참조는 금지지만
  현재 N1 데이터가 없으므로, gen-deps-n2 는 "미등록 id"를 N1 취급해 자동 배제한다.
- N2 도 처음부터 explicit readings(후리가나 100% 목표) + romaji 런타임 변환 + 의존성 필드.
  빌더 V2/k2/r2/l2/s2 를 사용 (N3 의 V3/k3/r3/l3/s3 와 동일 패턴, id 접두사만 v_n2_/k_n2_ 등).
- **N1급 문법 금지** — んばかり / ものともせず / べからず / まじき / ずくめ / きらいがある /
  をよそに / んがため / や否や / が早いか / ごとき / に至って 등. smoke 가 N2 전 영역 스캔(blocking).
  (べきだ·つつある 등은 N3 문형이므로 N2 콘텐츠에서는 허용 — N3 HARD 스캔과 구분.)
- **같은 문형의 레벨 이동 절차**: 하위 레벨에 이미 있는 패턴이 상위 레벨 시드에 남아 있으면
  (예: によって) 상위에서 다른 N2 문형으로 재정의하고 pair/similar 참조를 재매핑한다.
- gen-deps-n2.mjs 의 탐지 패턴은 과탐 위험이 낮은 것만 (として/をもって 등 짧은 과탐형 제외).
- **라운드 41 N1 스캔 확정 목록** (smoke `N1PAT`, N2 전 영역 blocking): 위 목록 +
  ずにはおかない/すまない · いかんによらず · いかんに(関|かか)わらず · を禁じ得ない ·
  ではあるまいし · を余儀なく · うる限り · ないまでも · であれ(、。) · ともなると · とあって ·
  涙ながらに · きっての · の極み · たるもの · たりとも · そばから · まみれ.
  **오탐 제거**: 踏まえ(N3)·なりに(N2)·べく·단독 まじき 직전 lookbehind 는 정상 N2/N3
  형태를 잡으므로 스캔에서 뺐다. ながらに 는 涙ながらに 한정으로 좁혔다.

## N2 1차 확장 메모 (라운드 42)

- 신규 kanji 의 exampleWords 는 반드시 **실존 vocab.word**(해당 한자 포함)에서 자동 도출한다 —
  생성기가 vocab 전수에서 char→word 맵을 만들어 검증(미존재/문자 불포함이면 생성 중단).
- 확장 문법(g_n2_23~40)은 `scripts/gen-deps-n2.mjs` 의 `N2_GRAMMAR_PATTERNS` 에 과탐 위험이
  낮은 패턴만 추가해야 reading/listening/story 의존성에 자동 반영된다 (上で→`/た上で/`, 次第で 처럼 좁게).
- **전역 단어 충돌 주의**: N2 확장 시 흔한 한자어(制度·環境·改善·交渉 등)는 이미 N3 이하에 존재한다.
  생성기에 기존 vocab.word 집합과의 충돌 가드를 넣어 0건을 보장하라 (라운드 42에서 최초 후보
  195개 중 91개가 충돌 → 고유 N2 단어로 교체).
- **커밋되지 않은 작업 보호**: 라운드 콘텐츠는 working tree 에만 있을 수 있으므로
  `git checkout <file>` 같은 파괴적 명령을 절대 쓰지 말 것 (라운드 42에서 vocab.js 0차 시드를
  되돌렸다가 트랜스크립트에서 복구한 사례 — 생성 전후로 무결성 스냅샷을 확인하라).

## N2 1차 안정화 메모 (라운드 43)

- **의존성은 본문(passage/script)에서만** — `gen-deps-n2.mjs` 는 질문(question) 텍스트를 의존성
  도출에 쓰지 않는다. 질문의 일반어(正しい/どれ/何 등)가 핵심 vocabId 로 새면 학습 동선이 흐려진다.
  (라운드 43에서 l_n2_1 의 핵심 vocab 에 正しい 가 섞인 것을 발견·차단.)
- **복구 데이터 검증 필수** — 트랜스크립트에서 복구한 데이터는 "최종본"이 아닐 수 있다. 복구 후
  반드시 readings 정합/romaji/괄호 reading/인코딩 손상을 전수 검증하라. (라운드 43에서 v_n2_77
  `かくしん(核心)` 괄호 reading 아티팩트를 발견·복원.) smoke 라운드 43 블록이 이를 상시 잠근다.
- **레거시 단계별 동일 문형** — 같은 문형을 하위 두 레벨에서 가르치는 것(예: 〜方 N5+N4)은 의도적
  설계이므로 잠금된 하위 콘텐츠를 건드리지 않는다. smoke 는 reviewedWarning 으로만 추적하고,
  blocking 은 **해당 라운드 레벨이 새 중복을 도입하지 않았는지**로 좁혀 검사한다.

## N2 2차 확장 메모 (라운드 44)

- **대량 어휘 확장은 배치 생성기로** — `_vbatch.py` + `_vdata_<letter>.py` 구조로 100개 단위 배치를
  추가하고, 각 배치가 라이브 vocab.js 의 word 집합과 충돌을 검사해 0을 보장한 뒤에만 삽입한다.
  흔한 한자어(政権 등은 OK이나 制度·環境·改善류)는 N3 이하와 대량 충돌하므로, 더 전문적/희소한
  N2 어휘를 고르고 가드가 잡은 충돌은 즉시 교체한다(라운드 44에서 배치별 11~29건 차단).
- **reading+meaningKo 조합 중복 금지** — word/한자가 달라도 (읽기+한국어 뜻)이 같으면 퀴즈에서
  구분 불가. 동철동의(課程↔過程, 養殖↔洋食 등)는 meaningKo gloss 를 차별화한다(smoke blocking).
- **N1급 자가검사** — 신규 문법은 생성기에서 smoke 와 동일한 `N1PAT` 로 self-check 한 뒤 삽입한다
  (をよそに·とあって·ないまでも·たりとも 등은 N2 에서 금지).
- **장문 독해** — 200자 이상 passage 는 questionView 가 `.q-context.long-passage` 클래스를 부여한다.
  2차에서 ≥3개를 유지(smoke sentinel).

## N2 2차 안정화 메모 (라운드 45)

- **imageKey 집중도 관리** — 대량 확장 후 최다 imageKey 가 10%에 근접하면(라운드 44에서 tool 9.6%)
  의미에 더 맞는 키로 분산한다(司法→book·暗号→eye·駆動→up·触媒→water 등). smoke 가 ≤10% blocking.
  3차 확장 전, 현재 최다는 mind 8.4%·tool 7.1% — mind/arrow 에 추가 집중되지 않도록 키를 고루 배분.
- **N1 경계는 과차단도 점검** — `N1PAT` 가 정당한 N2 문형(g_n2_1~80)을 막지 않는지 확인(라운드 45:
  과차단 0). N2 허용 ↔ N1 금지 경계:
  - **N2 허용**: にすぎない·にほかならない·ものがある·わけだ·わけがない·まい·ぶり·かたわら·がてら·
    かたがた·ともなく·たって·ところで·なくして·ゆえに·に基づいて·をめぐって 등 + べきだ·つつある(N3급).
  - **N1 금지(N1PAT)**: をよそに·んがため·たりとも·ずにはおかない·ないまでも·とあって·ともなると·
    に至って·ごとき·きっての·であれ(、。)·や否が·が早いか·べからず·まじき·の極み 등.
- **gen-deps-n2 는 영속 도구** — `scripts/gen-deps-n2.mjs` 는 임시 파일이 아니다. N2 콘텐츠 변경 시
  재실행→재베이크→smoke 확인. 베이크 테이블은 항상 생성기 출력과 일치해야 한다(라운드 45 mismatch 0).

## N2 3차 마무리 확장 메모 (라운드 46)

- **대량 어휘는 알파벳 배치로** — `_vbatch.py <letter>` + `_vdata_<letter>.py`(L~Y)로 100개 단위 삽입.
  각 배치는 라이브 vocab.js word 집합과 충돌 가드를 통과해야만 삽입(1400 신규 단어 전역 중복 0).
  4800단어 베이스에서는 흔한 N2/N3 한자어가 이미 다수 존재 → 도메인 테마(정치·경제·사회·환경·과학·
  기술·의료·교육·문화·언어·심리·법·직장·생활) + 생산적 접미(〜化/〜性/〜的/〜力/〜感/〜度) + 전문어로 회피.
- **동철동의 glose 차별화 필수** — 동음이의 한자어쌍(規程↔規定·受給↔需給·景観↔警官·試行↔施行·校外↔郊外·
  肩書き↔肩書·申込↔申し込み)은 (읽기+meaningKo) 조합이 같으면 smoke blocking → meaningKo 에 괄호 gloss 부여.
- **활용형 표제어는 명사형 예문으로** — 持ち越し/引き継ぎ 류 연용형 명사는 예문이 동사형(持ち越す)이면
  readings.text(持ち越し)가 문장에 없어 정합 오류. 예문을 "〜の持ち越しを認める" 식 명사형으로 작성.
- **stories 의존성 = keyVocab + 본문 자동탐지** — story.vocabularyIds/grammarIds 는 런타임에
  `STORY_DEPS_N2` 가 Object.assign 으로 덮어쓴다(원본 객체 값은 무시). 따라서 신규 story 는
  keyVocabularyIds(실존 vocab) + grammarIds(실존)만 정확히 쓰고, 삽입 후 gen-deps-n2 재베이크로 확정한다.
  bodyHighlights 의 vocabId 는 별도(런타임 보존)이므로 실존 vocab.word→id 로 검증해 작성한다.
- **베이크 stale 주의** — 이전 라운드에서 reading/listening/story 를 추가했어도 `*_DEPS_N2` const 가
  옛 개수(예: 50/50/10)에 머물 수 있다. 콘텐츠 수 변경 후 반드시 gen-deps 재실행→3개 const 전량 재베이크.
- **N1 경계 재점검은 안정화에서** — 신규 100문형(g_n2_81~180)은 smoke `N1PAT` 0 통과하나, 일부 문형
  (てやまない·を皮切りに·ないではおかない·たら最後·ずじまい·が関の山 등)은 레퍼런스별 N2/N1 판정이 갈린다.
  확장 라운드는 수량+게이트 통과까지, **N2/N1 경계 재분류는 3차 안정화 라운드의 전수 감사 항목**으로 둔다.

## N2 3차 안정화 / 최종 품질 잠금 메모 (라운드 47)

- **N1→N2 문형 교체는 같은 id 유지 + 참조 재매핑** — 문형을 빼고 새로 넣으면 id 가 바뀌어 pairs/
  sentenceBank 참조가 깨진다. `_gen_n1fix.py` 처럼 **같은 g_n2 id 의 객체 내용만 교체**하고, 그 id 를 참조하는
  grammarPairs(이번엔 8건)는 새 문형 비교로 재작성한다. reading/listening/story 는 g_n2_81~180 을 참조하지
  않으므로(gen-deps 는 g_n2_1~40 만 사용) 영향 없음 — 단 반드시 참조 스캔으로 재확인할 것.
- **교체 N2 문형은 "전 레벨 부재" 가 조건** — 흔한 N2 문형(くせに·たびに·だらけ·に対して 등)은 이미 N3 에
  있어 추가하면 교차 레벨 pattern 중복이 된다. 교체 후보는 **N5~N2 전 패턴 집합과 exact-match 부재**인지
  검사한 뒤 채택한다(さえ〜ば·に関する·に対する·をめぐる·をきっかけとして·きる·ぬく·ほどだ·気味だ 등).
- **N1 경계 판정 기록** — 6개 필수(てやまない·を皮切りに·ないではおかない·たら最後·ずじまい·が関の山)는
  전부 N1→교체. 경계상 N2 방어 가능(にしたところで·と思いきや·てからというもの·うが〜うが·はさておき·
  ともなれば·生まれながらに)은 reviewed 유지. 판정표는 `docs/content-status.md` 참조.
- **smoke `N1PAT` 영구 확장** — 교체로 데이터가 깨끗해진 직후, 재유입을 막도록 N1 마커를 N1PAT 에 추가한다.
  단 **짧고 흔한 동사화 어미(めく·ぶる·なり·べく·ものを·手前)는 오탐**(ひらめく·しゃぶる·果物を 등) 위험이
  있어 N1PAT 에 넣지 않는다 — 다자(多字) 고유 마커(てやまない·を皮切り·ないではおか·たら最後·が関の山 등)만 추가.
- **N2 완성 선언 기준은 smoke 블록으로 잠금** — 누적/영역 수량 + 후리가나 + 의존성(stale bake 차단) +
  중복 0 + N1PAT 0 + imageKey ≤10% + unreviewed 0 + gen-deps mismatch 0 을 한 블록에서 blocking 으로 검증.
