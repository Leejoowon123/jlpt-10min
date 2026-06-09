# 오프라인 AI 회화 모듈 — 설계 문서

> **상태 (0.2):** 텍스트 입력 (기본) + Web Speech STT 프로토타입 + 규칙 기반 평가 +
> Web Speech TTS + 주제별 진행 저장.
>
> **⚠️ Web Speech API `SpeechRecognition` 은 사양상 오프라인 보장이 없다.**
> 대부분 브라우저 구현이 음성을 외부 서버로 전송한다. 따라서 0.2 의 STT 는 진정한
> 오프라인이 아니며, **텍스트 입력이 항상 기본 안전 경로**다. 진정한 온디바이스 동작은
> 향후 스마트폰 네이티브 앱(Android `SpeechRecognizer` / iOS `SFSpeechRecognizer`) 에서
> 같은 어댑터 인터페이스를 구현하여 교체한다.

## 0. 운영 제약 (불변)

- **유료 API 금지**. Anthropic / OpenAI / Google / 유료 TTS / 유료 STT 사용하지 않는다.
- **온디바이스 우선**. STT/평가/TTS 는 가능한 한 브라우저 내장 또는 WebAssembly 로컬 모델.
- **콘텐츠 제약**. AI 가 던지는 질문과 정답 예시는 사용자가 이미 학습할 수 있는
  N5~N2 어휘·문법 안에서만 구성. 새로운 단어 도입은 회화 모듈이 책임지지 않음.
- **STT/평가/TTS 실패 시 안전 폴백** — 텍스트 입력으로 대체, 평가 실패 시 "다시 한 번
  시도하세요" 안내, TTS 미지원 시 일본어 텍스트 노출.

## 1. 데이터 (`js/data/conversationTopics.js`)

```ts
interface ConversationTopic {
  id: string;                    // 'conv_n5_self_intro'
  level: 'N5'|'N4'|'N3'|'N2';
  titleKo: string;               // '자기소개'
  situationTags: string[];
  requiredVocabIds: string[];    // data/vocab.js 의 id 참조
  requiredGrammarIds: string[];  // data/grammar.js 의 id 참조
  starterQuestions: Array<{
    ja: string;
    ko: string;
    expectedPatterns: string[];  // 자유 형식 패턴 hint — 평가기가 참고
    sampleAnswers: Array<{ ja: string; ko: string }>;
  }>;
  repairHints: Array<{
    issue: string;               // 분류 코드 ('missing_desu', 'arimasu_vs_imasu', ...)
    ko: string;                  // 사용자에게 보여줄 한국어 설명
    exampleJa: string;
  }>;
}
```

**무결성** — `requiredVocabIds` / `requiredGrammarIds` 는 실재하는 학습 항목 id 만
허용한다. `smoke.mjs` 가 참조 무결성을 자동 검증.

## 2. 회화 준비도 (`js/conversationReadiness.js`)

```ts
function getConversationReadiness(level?: string): Array<{
  topicId, titleKo, level,
  ready: boolean,           // percent >= 70
  vocabKnown, vocabTotal,
  grammarKnown, grammarTotal,
  percent: 0..100,
}>;
```

**판정 규칙 (MVP)**: `reviewStates[id]` 가 존재하면 "학습 경험 있음" = 1점.
추후 옵션:
- `correctCount > 0` 만 인정 → 더 엄격
- `wrongCount` 가 많으면 패널티
- 최근 학습 시점 가중치

## 3. 오프라인 회화 엔진 인터페이스 (미구현)

### 3.1 OfflineConversationEngine

```ts
interface OfflineConversationEngine {
  startTopic(topicId: string): Promise<void>;
    // 주제 시작. 첫 starterQuestion 을 큐에 올린다.

  getNextQuestion(): { ja: string; ko: string } | null;
    // AI 가 다음에 던질 질문. 큐가 비면 null.

  evaluateAnswer(userText: string): {
    accepted: boolean;
    detectedVocab: string[];
    detectedGrammar: string[];
    issues: Array<{ issue: string; ko: string; exampleJa: string }>;
  };

  getCorrection(): { ja: string; ko: string } | null;
    // 마지막 답변에 대한 자연스러운 모범 답안. evaluateAnswer 후에만 의미 있음.

  getNextPrompt(): { ja: string; ko: string } | null;
    // 대화 이어가기. 사용자가 답한 내용을 받아 자연스러운 다음 발화 (질문/맞장구).
}
```

### 3.2 STT Adapter

```ts
interface STTAdapter {
  startListening(opts?: { lang?: 'ja-JP' }): Promise<void>;
  stopListening(): Promise<void>;
  getTranscript(): string;       // 누적된 인식 텍스트
  isSupported(): boolean;
  onResult(handler: (text: string, isFinal: boolean) => void): void;
}
```

**1차 구현 후보**: 브라우저 표준 `SpeechRecognition` (Web Speech API).
- 데스크톱 Chrome/Edge: `webkitSpeechRecognition` 로 ja-JP 가능.
- iOS/Safari: 제한적 — 폴백 필요.
- 폴백: 텍스트 입력 모드 (`<textarea>` 로 답변 직접 타이핑).

### 3.3 TTS Adapter

```ts
interface TTSAdapter {
  speak(text: string, lang?: 'ja-JP'): Promise<{ ok: boolean; reason?: string }>;
  stop(): void;
  hasVoiceFor(lang: string): Promise<boolean>;
}
```

기존 `js/tts.js` 를 그대로 어댑터 구현체로 승격. 일본어 voice 미설치 시
`{ok:false, reason:'no-ja-voice'}` 폴백은 이미 정의됨.

### 3.4 Local Evaluator

```ts
interface LocalEvaluator {
  normalizeJapanese(text: string): string;
    // ふりがな 정규화, 전각/반각 통일, 끝 공백 제거 등

  detectKnownVocabulary(text: string, scopeLevel?: string): string[];
    // 사용자가 학습 범위 안에서 사용한 단어 id 반환 (data/vocab.js word 매칭)

  detectGrammarPattern(text: string): string[];
    // 정규식 등으로 〜です / 〜ています 등 검출 → grammar id 후보 반환

  compareExpectedPattern(text: string, expectedPatterns: string[]): {
    matched: string[];
    missing: string[];
  };

  produceCorrection(text: string, topicId: string): {
    natural: { ja: string; ko: string };
    issues: Array<{ issue: string; ko: string; exampleJa: string }>;
  };
}
```

**1차 구현 후보** (LLM 없이 규칙 기반):
- 형태소 분석 라이브러리는 모두 무겁다 (kuromoji.js ≈ 12MB 사전).
- MVP: 정규식 + word 리스트 매칭. 충분히 단순한 표현 검출에는 가능.
- 2차: 온디바이스 작은 transformer (예: WebLLM, ONNX) 도입 시 어댑터 교체만으로 가능.

## 4. 데이터 흐름 (한 턴)

```
1. AI:    engine.getNextQuestion()  → {ja, ko}
2. TTS:   ttsAdapter.speak(question.ja)
3. STT:   sttAdapter.startListening() → onResult(transcript)
4. USER:  답변 종료 (음성 또는 텍스트 입력)
5. 평가:  result = engine.evaluateAnswer(transcript)
            - evaluator.normalizeJapanese
            - evaluator.detectKnownVocabulary
            - evaluator.compareExpectedPattern
            - evaluator.produceCorrection
6. 피드백 UI: result.issues 의 ko 안내 + natural 모범 답안 노출
7. TTS:   모범 답안 합성 (선택)
8. AI:    engine.getNextPrompt()  → 다음 질문/맞장구
9. 반복
```

## 5. 화면 (예정)

| 상태 | UI |
| --- | --- |
| 주제 선택 | 회화 준비도 카드에서 주제 클릭 → 시작 |
| 듣기 대기 | AI 질문 (일본어 + 한국어 토글) + 마이크 버튼 |
| 답변 중 | 음성 파형 + 실시간 transcript |
| 평가 | 정답 확인 + issues + natural 모범 답안 |
| 진행 | "다음 질문" 또는 "다시 답변" |

## 6. 0.1 구현 매핑

| 인터페이스 | 0.1 구현 위치 | 비고 |
| --- | --- | --- |
| OfflineConversationEngine | [js/conversationEngine.js](../js/conversationEngine.js) `createEngine(topicId)` | 메모리 상태. storage 영속화는 다음 단계. |
| LocalEvaluator           | [js/localEvaluator.js](../js/localEvaluator.js) `evaluateConversationAnswer` | 정규식 + word 매칭. expected OR 의미. |
| TTSAdapter               | [js/tts.js](../js/tts.js) `speak/stop/hasJaVoice` | 이미 구현 — 그대로 어댑터로 승격. |
| STTAdapter               | **미구현** | 0.2 단계. 현재는 `<textarea>` 텍스트 입력으로 대체. |
| 회화 진행 화면           | [js/views/conversation.js](../js/views/conversation.js) | 주제 목록 → 진행 → 요약. |

## 7. 0.1 흐름 (구현된 상태)

```
1. 사용자 회화 탭 진입 → 주제 목록 (준비도 표시).
2. 준비 완료 주제 선택 → engine = createEngine(topicId)
3. AI 질문 표시 (engine.currentQuestion().ja) + ▶ 듣기(TTS) + 한국어 토글
4. 사용자 textarea 입력 → 제출
5. localEvaluator.evaluateConversationAnswer({topic, question, userText})
     - normalizeJapanese(공백 정리)
     - detectKnownVocabulary(필수 어휘 word/reading 검출)
     - detectGrammarPattern(expectedPatterns 정규식 매칭)
     - 점수 = 30(non-empty) + 25(vocab) + 25(pattern) + 20(both)
     - hints = missing_pattern / polite_ending / repairHints 매핑
6. 평가 결과 표시 (점수 bar + 사용 어휘/패턴/부족/힌트/모범 답안)
7. 다음 질문 버튼 → engine.next(). isDone() 면 요약 화면.
```

## 8. 단계별 로드맵

1. ✅ **0.1**: 데이터 + 준비도 + 텍스트 입력 + 규칙 기반 평가 + Web Speech TTS + 진행 UI.
2. ✅ **0.2**: STT 어댑터 (Web Speech) 프로토타입 + 마이크 토글 UI + 미지원/오류 폴백 +
   `conversationProgress` storage 저장 + 평가기 한국어 힌트 보강 (too_short / not_japanese / 정중체 종결 확장).
3. ✅ **0.3-lite — sentenceBank 결합**: `pickBestSampleSentence` / `getPracticeSentencesForTopic`
   를 도입해 평가 결과에 "배운 표현으로 답하기 (knownSampleSentence)" + "관련 표현 더 보기
   (최대 3개 · known/partial)" 노출. **모범 답안 생성 없음 — 오직 sentenceBank / conversationTopics 안의 문장만 사용**.
   주제 목록 행에 partial 카운트 추가. LLM / 형태소 분석은 도입 안 함.
4. **0.3 (full) — 평가기 정밀화**: 형태소 분석 (kuromoji.js 등) 옵션 + 더 풍부한 repairHints 매칭 +
   어휘 활용형 인식 (학생 → 学生たち 등).
4. **0.4 — N4 / N3 / N2 주제 확장**: 각 레벨별 6~10개 주제.
5. **0.5 — 네이티브 앱 STT/TTS 어댑터**: Android `SpeechRecognizer` / iOS `SFSpeechRecognizer`
   를 동일 `STTAdapter` 인터페이스로 구현. 시스템 TTS 도 동일.
6. **장기** — 온디바이스 LLM (WebLLM / ONNX small models) 평가기 어댑터 도입.

## 9. 어댑터 교체 전략 — 모바일 마이그레이션

| 어댑터 | 0.2 (현재) | 모바일 네이티브 (목표) |
| --- | --- | --- |
| TTSAdapter | `js/tts.js` (Web Speech API) | OS 내부 TTS (Android `TextToSpeech` / iOS `AVSpeechSynthesizer`) |
| STTAdapter | `js/stt.js` (Web Speech, 네트워크 의존) | OS 내부 STT (Android `SpeechRecognizer` 온디바이스 / iOS `SFSpeechRecognizer` on-device 모드) |
| LocalEvaluator | `js/localEvaluator.js` (정규식 + word 매칭) | 온디바이스 형태소 분석 또는 LLM (WebLLM/ONNX) |
| Engine | `js/conversationEngine.js` (메모리) | 동일 인터페이스. 진행 저장은 0.2에서 이미 storage 영속화. |

호출자(view) 는 어댑터 인터페이스 ABI 만 사용하므로 구현체 교체 시 view 코드 변경 없음.
