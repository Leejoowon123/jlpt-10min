# 다음 로드맵

본 문서는 현재 상태 이후의 단계별 우선순위를 정리한다.
세부 라운드 분배는 각 단계 문서로 분리:
- N5: [n5-expansion-plan.md](./n5-expansion-plan.md)
- 콘텐츠 작성 규칙: [content-authoring-guide.md](./content-authoring-guide.md)
- 회화 모듈 어댑터 설계: [offline-conversation.md](./offline-conversation.md)
- 브라우저 QA 체크리스트: [browser-qa-checklist.md](./browser-qa-checklist.md)

---

## 단계별 우선순위

### 1. N5 대량1차 안정화 (현재 진행 중)

- ✅ 콘텐츠 품질 감사 (smoke 의 `=== 콘텐츠 품질 감사 ===` 섹션 — 13건 경미한 경고)
- ✅ imageKey 중복 상세 리포트
- ✅ study.js 순수 함수 분리 (`applyFilter`, `getVisibleSlice`)
- ✅ 브라우저 QA 체크리스트 결과 표
- ⏳ **실제 브라우저 1회 점검** (수동, 사용자 환경에서)

### 2. 실제 브라우저 QA

`docs/browser-qa-checklist.md` 의 결과 표를 따라 Chrome / Edge / Safari + 모바일 폭 360×740 에서 1회 점검.

**우선 검증 영역**
- 발음 듣기 버튼 (일본어 voice 가용성)
- STT 마이크 권한 흐름 (Chrome)
- 단어 250개 환경에서 학습>단어 진입 속도 / 검색 응답성
- 회화 10개 주제 진입·진행
- 청해 TTS 음성 자연스러움

**발견된 이슈는 우선 분류**
- 데이터 수정 → 즉시
- UI 수정 → 작은 PR
- 자동 회귀 가능 → `qa.mjs` 시나리오로 승격

### 3. N5 대량2차 — 권장 학습량 (250 → 500)

[n5-expansion-plan.md](./n5-expansion-plan.md) 의 "다음 라운드 — N5 대량 2차" 참조.

- 단어 500 / 문법 60 / 독해·청해 50 / 회화 주제 15+ / sentenceBank 300+
- mnemonic palette 220+ — max imageKey share ≤ 8% 유지
- smoke 임계치 동기 상향

### 4. 한자 데이터 모델 도입 (1차 완료 — N5 50자 + 문자 표)

✅ **완료**:
- `js/data/kanji.js` — N5 한자 50개
- `js/data/kana.js` — 히라가나/가타카나 50음도 + 탁음/요음
- `js/views/kanjiView.js` — 카드 학습 (생각해보기 → 보기 → 알고있음/다시 볼래요)
- `js/views/kanaChart.js` — 표 (셀 클릭 TTS)
- `study.js`: kanji / kana 영역 통합 (type tab)
- `home.js`: 학습 영역 카드에 "한자" / "문자" 버튼
- smoke: 한자 무결성·imageKey 매핑·가나 표 검증
- qa: 한자 카드 thinking→reveal 흐름·가나 표 토글

⏭ **다음 라운드 (N5 한자 100자 까지)**:
- 추가 50자 — 동사 어간 자주 등장하는 한자, 시간 단위(時 등), 신체 부위 등.
- 한자 카드를 오늘의 10분 큐에 일부 섞기 검토.
- 한자 ↔ vocab.exampleWords 양방향 링크 (학습 흐름 연결).

**현재 스키마**:
```js
// js/data/kanji.js
{
  id: 'k_n5_001',
  level: 'N5',
  kanji: '人',
  onYomi: ['ジン','ニン'],
  kunYomi: ['ひと'],
  meaningKo: '사람',
  strokes: 2,
  radicals: ['人'],
  exampleWords: ['v_n5_131','v_n5_132'],  // vocab id 참조
  mnemonicText: '서 있는 사람의 옆모습.',
  imageKey: 'person',
  tags: ['기본','부수'],
}
```

**새 학습 모드 후보**
- 한자 카드 (이미지 + 음/훈 + 예시 단어)
- 한자 → 단어 매칭
- 부수 학습

**smoke 검증**
- 한자 id 유일성
- 예시 단어 ref 무결성
- 레벨별 카운트

### 5. N4 1차 확장 (라운드 14 완료)

**라운드 14** 에서 N4 1차 시드 완료:
- vocab 250, grammar 40, reading 20, listening 20, sentenceBank 100, grammarPairs 8, kanji 100, stories 4+novels 2, conversationTopics 6.
- 모든 카테고리 후리가나 커버율 ≥ 80%, 대부분 100%.
- N5 회귀 0.

다음 N4 2차 확장 후보:
- vocab 250 → 500 (어휘 깊이)
- grammar 40 → 80 (N4 문법 확장)
- 이야기/단편 추가 콘텐츠
- N4 conversationTopics 추가 6 개 (총 12)

### 5a. (deprecated) 이전 N4 1차 확장 노트

N5 1차 임계치 패턴 재사용:
- vocab 60+ / grammar 20+ / reading·listening 8+ / sentenceBank 30+ / 회화 주제 4+
- 그 후 N4 대량1차 (200+ / 40+ / 20+ / 100+)

### 6. N3 / N2 확장

동일 패턴. 콘텐츠 작성 가이드 그대로 적용.

### 7. 이야기 / 단편 소설 — Readle 스타일 읽기 콘텐츠 확장

진행:
- **라운드 9** — 정보구조 + 시드 (N5 이야기 2 / 단편 1).
- **라운드 10** — 스토리 학습 플레이어 (탭 / 단일+연속 재생 / 700ms pause / 0.75–1.25x / active line).
- **라운드 11** — 인라인 하이라이트 + storyProgress (`lastIndex` / `completed` / `readCount`) + 학습 연결 검색 prefill.
- **라운드 12** — 단어/문법 **직접 카드 진입** + `hideCompleted` 영속화 + 목록 진행 요약 + 모바일 안전 CSS 보강.
- **라운드 13** — **N5 콘텐츠 1차 확장 완료 (이야기 5 / 단편 3)** + 스토리↔학습↔스토리 **복귀 동선** (`js/studyReturn.js` + 카드 화면 "← 이야기로 돌아가기" 버튼). story body 후리가나 커버율 100%.

다음 확장 단계:

- **N5 이야기 5건 + 단편 3건 확장** — 봄/여름/가을/겨울/특별 주제. 동네 공원/학교 행사/계절 소재. *외부 기사 복사·인용 금지*.
- **N4 이야기 추가** — 이야기 4건 + 단편 2건. 한자/문법 깊이 N4 기준.
- **본문 단어 클릭 → 단어 학습 연결** — 하이라이트 pill 또는 인라인 단어 클릭 시 해당 단어의 이미지 카드 학습으로 점프. 현재는 표시만, 라우팅 미연결.
- **shadowing 모드** — 문단 재생 → 학습자 따라 말하기 → 자동 다음 문단. STT 어댑터(있을 때) 와 결합한 발음 점수.
- **오프라인 저장 / PWA** — manifest + service worker 로 이야기/단편 본문을 오프라인 학습 가능하게.
- **주제별 읽기 (태그 라우팅)** — `#stories?tag=공원` 류로 필터 깊은 링크. 현재는 화면 안에서 태그 칩 클릭으로 처리.
- **단어/문법 양방향 연결** — 본문에서 칩 클릭 시 단어 카드 / 문법 문제로 이동. 현재는 표시만, 라우팅 미연결.
- **문단 TTS UX 보강** — 자동 다음 문단 재생 옵션, 재생 속도 조절.
- **해석 토글 세분화** — 문단별 토글 가능. 현재는 전체 토글만.
- **오프라인 저장 / PWA** — manifest + service worker 로 이야기/단편 본문을 오프라인 학습 가능하게.
- **검색** — 본문 텍스트/제목 검색. 콘텐츠가 늘어나면 필수.
- **읽음 표시** — 이미 읽은 이야기를 표시. SRS 와 별개의 가벼운 진행 추적.

운영 원칙 (반드시 유지):
- 모든 콘텐츠는 **본 프로젝트용 직접 창작 (original)**. 외부 뉴스 / 출판물 / 상용 학습 자료의 복사·번역·각색은 모두 금지.
- 외부 API / LLM / 사전 / 크롤러 미사용. TTS 만 브라우저 무료 API.
- 시험/퀴즈로 변질시키지 않음 — 읽기 전용.

### 7b. 콘텐츠 데이터 로딩 경량화 (라운드 16 — 설계 + 최소 구현 완료)

상세: [data-loading-plan.md](./data-loading-plan.md)

- ✅ `js/dataLoader.js` — JSON fetch 우선 + JS fallback + 메모리 캐시. 9개 영역 × N5~N2.
- ✅ `data/n4/stories.json` — 첫 샘플. smoke 가 JS 원본과 동기화(drift) 검증.
- ✅ smoke 데이터 용량 리포트 (`=== 데이터 용량 리포트 ===`).
- ✅ (라운드 17) `js/contentRepository.js` — 동기 getter + async preload compatibility layer.
  storyView 전면 전환 + study 카드 lookup 전환. N4 stories JSON 이 실제 화면에 연결됨 (qa[124] 검증).
- ✅ (라운드 18) 스토리 본문 3단 구조 (ja/romaji/ko inline) + 테마 (system/light/dark)
  + compact player + 이미지 자산 구조 (assets/ + asset-licenses.md + coverImage 샘플 3).
- ⏳ 다음: ① N4 신규 콘텐츠 JSON-first 작성 (bodyRomaji 필수) → ② N5 vocab/sentenceBank JSON 이전
  → ③ PWA service worker JSON 캐시 → ④ JS data 파일 compatibility wrapper 축소
  → ⑤ 외부 무료 이미지 수동 선정 라운드 (asset-licenses.md 체크리스트 기반).
- PWA service worker 도입 시: 앱 shell cache-first, `data/**/*.json` stale-while-revalidate.

### 8. 모바일 앱 전환 검토

웹 PWA 대 네이티브 (React Native / Capacitor / Tauri Mobile) 비교.

**중요 결정 포인트**:
- STT: 모바일 OS 내부 STT 어댑터 (Android `SpeechRecognizer` / iOS `SFSpeechRecognizer`) 가 진정한 온디바이스 동작 보장.
- TTS: 같은 인터페이스로 OS 내부 TTS.
- localStorage: 모바일에서도 동등한 키-값 영속화 필요. PWA 면 동일, 네이티브면 SQLite/AsyncStorage.
- 콘텐츠 정적 자산은 그대로 — `js/data/*.js` 그대로 번들.

**우선 옵션 (가벼움 순)**:
1. PWA 매니페스트 + 서비스워커 — 기존 코드 거의 그대로, 홈 스크린 추가 가능
2. Capacitor — 웹 코드 그대로 + 네이티브 API 어댑터만 추가
3. React Native / Tauri Mobile — 큰 리팩터링 필요

## 트랙 별 우선순위

콘텐츠 트랙과 기능 트랙을 분리해 진행 가능:

**콘텐츠 트랙**:
1 → 3 → 5 → 6 (N5 → N4 → N3 → N2 순차)

**기능 트랙**:
1 → 2 → 4 → 7 (안정화 → 브라우저 QA → 한자 모델 → 모바일)

**현재 상태에서 추천 다음 작업**:
- **2. 실제 브라우저 QA** — 한자 카드 + 가나 표 + 발음 듣기까지 시각/체감 확인.
- 그 후 **N5 한자 50 → 100자** 또는 **3. N5 대량2차 콘텐츠** 중 선택.


## (이관) 구 README 의 남은 TODO 목록


- [ ] 콘텐츠 확장 (특히 N3/N2 단어/문법/독해/청해)
- [ ] JMdict/KANJIDIC2 등 공개 라이선스 데이터 임포트 스크립트
- [ ] `getVoices()` 가 영구 지연 로드되는 브라우저용 보강 (이벤트 기반 재감지)
- [ ] 사용자 직접 단어/문장 추가 UI
- [ ] 한자(부수·필순) 카드 (모델 확장 필요)
- [ ] 청해 다이얼로그 2인 음성 분리
- [ ] 통계 대시보드 (주간 정답률, 영역별 분포)
- [ ] PWA(매니페스트 + 서비스워커, 오프라인)
- [ ] 데이터 export/import (JSON 백업)
- [ ] `FailureNote.reason` / `FavoriteItem.memo` 입력 UI (필드만 존재)
- [ ] i18n (현재 UI 라벨 한국어 하드코딩)
- [ ] 구버전 비단어 favorites 클리어용 storage 마이그레이션 (현재는 UI/큐에서 단순 숨김)

