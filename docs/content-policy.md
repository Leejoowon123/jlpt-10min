# 콘텐츠 / 운영 정책 (Content Policy)

무료 운영·라이선스·콘텐츠 작성 기준의 source of truth. (README 에서 이동)
작성 실무 가이드: [content-authoring-guide.md](./content-authoring-guide.md)

## 사용한 무료 기술/라이브러리

- **의존성 0개**. 순수 HTML / CSS / ES Modules.
- **Web Speech API** (`SpeechSynthesisUtterance`, `lang='ja-JP'`) — 브라우저 내장 무료 TTS.
- 단어 연상 이미지는 **인라인 SVG** 동적 생성. 이미지 생성 API 없음.
- `localStorage` 영속화.
- 외부 사전 데이터 미사용. JMdict / KANJIDIC2 임포트 가이드는 [LICENSE_NOTES.md](../LICENSE_NOTES.md).


### 콘텐츠 작성 원칙
- **본 프로젝트용 직접 창작** — 외부 기사·소설·교재·기출 복사/번역/각색 금지.
- 해당 레벨(N5/N4 등) 어휘·문법 중심. bodyJa 3~7문단.
- bodyKo 와 bodyJa 문단 수 일치.
- 모든 한자 명시 readings 1회 이상 등장 시 bodyReadings 에 등록.
- 문단당 bodyHighlights 1~3개. text 는 본문에 실제 등장. vocabId 가 있으면 vocab 에 존재.
- TTS 가 자연스럽게 읽을 수 있는 짧은 문장.

### N4 1차 시드 (라운드 14)
N4 학습 엔진이 N5 와 동일하게 작동하도록 1차 시드 콘텐츠를 확장:
| 카테고리 | 수량 |
| --- | --- |
| N4 vocab | **250** |
| N4 grammar | **40** |
| N4 reading | **20** |
| N4 listening | **20** |
| N4 sentenceBank | **100** |
| N4 grammarPairs | **8** (기존 1 + 신규 7) |
| N4 kanji | **100** |
| N4 stories (daily/news) | **4** |
| N4 short_story | **2** |
| N4 conversationTopics | **6** |

후리가나 커버율 (라운드 14 측정):
- vocab/grammar/reading/listening/sentenceBank/story 모두 **100%** 또는 99% 이상.
- smoke 의 sentinel 은 N4 모든 카테고리 ≥ 80%.

N5 커버율 (vocab/grammar/reading/listening/sentenceBank 100%, story body 100%) — 회귀 없음.

오늘의 10분:
- 단어 슬롯 분배는 기존 그대로 (`vocabMode: 'image' | 'example'`, 기본 70% 이미지). 회차 통계는 **퀴즈 답변 수 기준** 으로만 집계되므로 노출/회상/확인 단계가 통계에 영향 없음.


## 권장 학습량 (앱 자체 기준)

**JLPT 공식은 어휘/한자 확정 목록을 공개하지 않습니다.** 아래 수치는 일반적으로 통용되는
누적 학습량을 본 앱의 *권장 목표치* 로 채택한 값입니다. ([js/data/levelTargets.js](../js/data/levelTargets.js))

| 레벨 | 어휘(누적) | 한자(누적) | 문법 | 독해 | 청해 |
| --- | --- | --- | --- | --- | --- |
| N5 | 500   | 100   | 40~60   | 40~60   | 40~60 |
| N4 | 1,400 | 300   | 80~120  | 60~100  | 60~100 |
| N3 | 2,700 | 600   | 120~180 | 80~140  | 80~140 |
| N2 | 5,000 | 1,000 | 180~250 | 120~200 | 120~200 |

위 권장 학습량 대비 진행률은 **앱 UI 에서 표시하지 않습니다** — 사용자는 학습 흐름에 집중하고,
콘텐츠 목표/진행 현황은 `smoke.mjs` 출력 (`progress vs targets`) 과 내부 [`js/contentStats.js`](../js/contentStats.js)
의 `progressFor` 로 관리합니다. (홈 화면에는 오늘의 10분 · 회화 준비도 · 학습 영역 진입만 노출.)

## 현재 콘텐츠 / 목표 대비

**N5 대량 확장 1차 완료** — 어휘 250 / 문법 45 / 독해·청해 25 / 회화 주제 10 / sentenceBank 150.
N4 / N3 / N2 는 여전히 구조 검증용 샘플 단계.

| 영역 | N5 | N4 | N3 | N2 | 합계 |
| --- | --- | --- | --- | --- | --- |
| 단어 | **250** | 10 | 5 | 5 | 270 |
| 문법 | **45** | 4 | 2 | 2 | 53 |
| 독해 | **25** | 1 | 1 | 1 | 28 |
| 청해 | **25** | 1 | 1 | 1 | 28 |
| 회화 주제 | **10** | 0 | 0 | 0 | 10 |
| 문법 비교 페어 | **8** | 1 | 1 | 1 | 11 *(동결)* |
| sentenceBank (전 레벨 합) | — | — | — | — | **150** (N5 150) |
| mnemonic 팔레트 imageKey | — | — | — | — | **185+** |
| 한자 | **50** | 0 | 0 | 0 | 50 *(권장 N5 100, 50% 도달)* |

N5 대량1차 임계치는 `smoke.mjs` 가 매 실행 시 강제. `smoke` 출력에 `progress vs targets`,
`related sentences per topic`, `N5 imageKey 분포 분석`(TOP 20 포함) 이 매번 표시됨.

### N5 imageKey 다양성 (대량1차 결과)

| 지표 | Before (2.2) | After (대량1차) |
| --- | --- | --- |
| N5 vocab 총수 | 130 | **250** |
| unique imageKey | 87 | **185** |
| duplicate groups (≥2) | 20 | 35 |
| words in dup groups | 63 | 100 |
| duplicate beyond first | 43 | 65 |
| max share (≤8%) | family 7 (5.4%) | family 8 (**3.2%**) |

신규 imageKey ≥ 90종 추가 (`mnemonic.js`) — 가족별 / 숫자별 / 요일별 / 신체 부위 / 동사 / 색 등 고유 아이콘. 단어 250개 중 185가 서로 다른 imageKey 사용.


## 콘텐츠 확장 로드맵

전체 로드맵 → [docs/next-roadmap.md](./next-roadmap.md).
N5 라운드 상세 → [docs/n5-expansion-plan.md](./n5-expansion-plan.md).

**현재 위치**: N5 대량1차 완료 → 안정화 단계.
**다음 단계**: 실제 브라우저 QA ([docs/browser-qa-checklist.md](./browser-qa-checklist.md)) → N5 대량2차 (어휘 500).

1. **N5 권장 학습량까지 확장** — 어휘 500 / 문법 60 / 독해 60 / 청해 60.
2. **N4 1차 확장** — 어휘/문법/독해/청해 임계치 N4 적용.
3. **N3 확장**
4. **N2 확장**
5. **한자 데이터 추가** — `KanjiItem` 모델 도입(부수·획수·온/훈독·예시 단어), 한자 카드 학습 모드 추가.
6. **오프라인 AI 회화 모듈** — STT → 로컬 평가 → TTS 어댑터로 단계 결합. 설계는 [docs/offline-conversation.md](./offline-conversation.md).


### 안전 제약

- AI 질문 / 모범 답안 / 교정은 **모두 `conversationTopics` 안의 데이터 만 사용**.
- "AI" 라는 용어는 UI에서 거의 쓰지 않음 — "회화 연습" 으로 표현.
- 준비도 70% 미만 주제는 시작 버튼이 disabled. 학습 확인용 "연습 미리보기"(👁) 만 활성.
- TTS 실패/일본어 voice 부재 시 안내 메시지 + 텍스트 그대로 노출.
- 외부 네트워크 호출 0 (smoke/qa 자동 검증).

### 향후 확장 로드맵

1. (현재) 텍스트 입력 + 규칙 기반 평가 + Web Speech TTS.
2. **STT 어댑터 결합** — Web Speech `SpeechRecognition` (ja-JP) 우선, 미지원 시 텍스트 폴백.
3. **평가기 정밀화** — 정규식 → 형태소 분석 (kuromoji.js) 또는 온디바이스 작은 transformer.
4. **N4 / N3 / N2 주제 추가**.
5. **회화 진행도 저장** — `conversationProgress[topicId]` 를 storage 에 누적.

설계 상세: [docs/offline-conversation.md](./offline-conversation.md).


### 유료 API 미사용 확인

Anthropic / OpenAI / Google / 유료 TTS / 유료 STT / 유료 LLM **모두 사용 안 함**.
평가는 정규식, TTS 는 브라우저 내장 무료 API, STT 는 추후 단계에서도 무료 기술만 검토.

콘텐츠 작성 원칙:

- 모든 예문·번역·해설·청해 스크립트는 본 프로젝트용 창작 샘플.
- 기출 문제집 / 시판 교재 / 상용 앱 콘텐츠 복사 금지.
- 레벨에 맞춰 짧은 문장(2~5문장 독해, 1~3턴 청해 대화), 레벨 범위 밖 한자 회피.
- 청해 스크립트는 Web Speech API TTS 합성 시 어색하지 않도록 자연스러운 회화체.
- 외부 사전 데이터(JMdict / KANJIDIC2) 는 아직 임포트하지 않음 — 스키마만 호환. 가이드는 [LICENSE_NOTES.md](../LICENSE_NOTES.md).


## 이미지 자산 라이선스 정책

[asset-licenses.md](./asset-licenses.md) 가 source of truth —
직접 창작 SVG 우선, 외부 무료 이미지(Openverse/Wikimedia/Unsplash/Pexels/Pixabay)는
개별 약관 확인 + 파일 저장(hotlink 금지) + 문서 기록 후에만 사용.
인물/로고 사진 회피, 기출/교재/상용 앱 이미지 복사 금지.
