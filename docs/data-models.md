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
