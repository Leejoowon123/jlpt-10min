# 콘텐츠 데이터 로딩 경량화 계획

라운드 16 설계 문서. 대용량 콘텐츠를 레벨별/영역별 JSON 으로 분리하고
필요한 것만 동적 로드하는 구조로 점진 이전한다.

---

## 1. 왜 JS 배열만으로는 한계가 있는가

현재 모든 콘텐츠는 `js/data/*.js` 의 **정적 import** 다.

```
js/data 합계: ~431 KB (라운드 14 기준, N5+N4)
  vocab.js          140 KB
  sentenceBank.js    71 KB
  grammar.js         46 KB
  stories.js         40 KB
  kanji.js           36 KB
  reading.js         33 KB
  listening.js       25 KB
  conversationTopics 22 KB
  grammarPairs       10 KB
```

문제:
- **초기 파싱 비용** — ES 모듈 정적 import 는 첫 화면 전에 전부 다운로드+파싱된다.
  N3/N2 까지 확장하면 1MB+ JS 가 모바일 첫 진입을 막는다.
- **JS 파싱은 JSON 파싱보다 느리다** — 같은 데이터라도 `JSON.parse` 가
  JS 엔진의 전체 구문 분석보다 수 배 빠르다 (V8 공식 권장).
- **부분 로드 불가** — 사용자가 N5 만 학습해도 N2 데이터까지 파싱.
- **캐시 무효화 단위가 큼** — 단어 하나 고치면 140KB vocab.js 전체 재다운로드.

JSON 분리 후:
- 앱 shell(JS 로직)은 ~수십 KB 로 축소, 첫 페인트 빨라짐.
- 레벨 전환 시에만 해당 JSON fetch — 한 파일 20~140KB.
- Service Worker 가 JSON 을 개별 캐시 → 오프라인 + 부분 갱신.

## 2. 디렉터리 구조

```
data/
  n5/
    vocab.json            ← js/data/vocab.js 의 N5 항목과 동일 스키마
    grammar.json
    reading.json
    listening.json
    kanji.json
    stories.json
    sentenceBank.json
    grammarPairs.json
    conversationTopics.json
  n4/
    (동일 구성)            ← 현재 stories.json 1개 (검증용 샘플)
  n3/ n2/                  ← 향후
```

규칙:
- 경로는 **index.html 기준 상대 경로** `data/n5/vocab.json`.
  GitHub Pages 의 `/<repo>/` 하위 경로에서도 동작하고, hash route(`#study/...`)
  와 충돌하지 않는다 (hash 는 서버로 전송되지 않음).
- 각 JSON 은 **그 레벨의 항목만 담은 배열** — 스키마는 JS 원본과 100% 동일.
- **StoryItem 필수 필드 (라운드 18+)**: `bodyRomaji[]` (bodyJa 와 길이 일치, 문단별 로마자).
  JSON-first 로 새 스토리를 작성할 때도 반드시 포함 — smoke 가 길이/non-empty 검증.
- **StoryItem 선택 필드**: `coverImage {src, altKo, licenseId}` — licenseId 는
  docs/asset-licenses.md 에 기록 필수 (smoke 검증), src 는 assets/ 내 파일만.
- JSON 은 JS 원본에서 **생성** 한다 (수기 동기화 금지):
  ```bash
  node -e "import('./js/data/stories.js').then(({stories}) =>
    require('fs').writeFileSync('data/n4/stories.json',
      JSON.stringify(stories.filter(s=>s.level==='N4'), null, 1)))"
  ```
  smoke 가 JSON ↔ JS 원본의 항목 수/sourceType 동기화를 검증한다 (drift 방지).

## 3. dataLoader API (`js/dataLoader.js`)

```js
import { loadVocab, loadStories, preloadLevel, clearDataCache } from './dataLoader.js';

const n4Vocab   = await loadVocab('N4');        // JSON 우선, 실패 시 JS fallback
const n4Stories = await loadStories('N4');
await preloadLevel('N4');                        // 9개 영역 전부 워밍 (레벨 전환/PWA)
clearDataCache();                                // 테스트 격리 / 강제 재로드
```

| API | 역할 |
| --- | --- |
| `loadLevelData(level, type)` | 범용 진입점. level ∈ N5~N2, type ∈ 9개 영역. invalid 는 throw |
| `loadVocab/Grammar/Reading/Listening/Kanji/Stories/SentenceBank/GrammarPairs/ConversationTopics(level)` | 편의 wrapper |
| `preloadLevel(level)` | 한 레벨 전 영역 Promise.all |
| `clearDataCache()` | 메모리 캐시 초기화 |
| `jsonPathFor(level, type)` | `data/n5/vocab.json` 경로 생성 (SW 캐시 목록 생성에 재사용) |
| `_setFetchForTest(fn)` / `_resetFetchForTest()` | Node 테스트에서 fetch 주입 |

동작 순서:
1. 메모리 캐시 hit → 즉시 반환 (Promise 캐시 — 동시 호출도 fetch 1회).
2. `fetch('data/<lvl>/<type>.json')` — 200 이고 배열이면 사용.
3. 404 / 네트워크 실패 / 비배열 / fetch 불가 환경(Node) → **JS fallback**:
   `js/data/<type>.js` 를 dynamic import 후 `level` 필터.

→ **JSON 이 없거나 깨져도 앱은 절대 죽지 않는다.** 회귀 위험 0 인 이유.

## 4. 점진 이전 순서

| 단계 | 내용 | 상태 |
| --- | --- | --- |
| 1 | dataLoader + 문서 + N4 stories.json 샘플 1개로 fetch 검증 | ✅ 라운드 16 |
| 2 | **contentRepository compatibility layer + storyView/study 전환** | ✅ 라운드 17 |
| 3 | N4 신규 콘텐츠(2차 확장분)부터 JSON-first 작성 | 예정 |
| 4 | N5 대용량 영역(vocab/sentenceBank)을 JSON 이전, JS 는 fallback 유지 | 예정 |
| 5 | smoke/qa 안정 확인 후 JS data 를 compatibility wrapper 로 축소 | 최종 |

### 기존 코드 호환 — A안 (compatibility layer) — ✅ 구현됨 (`js/contentRepository.js`)

현재 30+ 파일이 `import { vocab } from '../data/vocab.js'` 정적 import 를 쓴다.
이를 한 번에 async 로 바꾸면 모든 화면이 깨진다. 대신:

- `js/contentRepository.js` 가 "현재 메모리에 있는 데이터" 의 단일 창구.
  초기값은 기존 JS 정적 데이터, `preloadRepositoryLevel(level)` 완료 시
  해당 level/type 슬라이스가 dataLoader 결과(JSON 우선)로 교체.
- 화면 코드는 `getVocab(level)` / `findItem(type, id)` **동기 호출** — async 전파 없음.
- qa/smoke 는 기존 import 경로가 유지되는 한 그대로 통과.

**동기 getter + async preload 를 함께 제공하는 이유:**
- 동기 getter 가 없으면 모든 render 함수가 async 가 되어 라우터/qa/이벤트 핸들러
  전체에 await 가 전파된다 (회귀 위험 大).
- JS base 데이터가 즉시 있으므로 "loading 상태" 자체가 필요 없다 — preload 는
  백그라운드 업그레이드일 뿐. N5 정적 데이터를 제거하는 5단계에 가서야
  최초 부팅 시 한 번의 await(부트스트랩)가 필요해진다.
- reset 세대(generation) 가드로 테스트 격리 시 in-flight preload 의 stale 쓰기 차단.

**라운드 17 전환 완료 범위:**
- `storyView.js` — stories 목록/detail/핵심 단어/문법 탭 모두 repository 경유.
  `../data/stories.js` / `../data/vocab.js` / `../data/grammar.js` 직접 import 제거.
  진입 시 `warmRepository()` 가 목표 레벨을 백그라운드 preload — JSON 이 실제 화면에 연결됨.
- `study.js` — 단일 카드 진입(`startSingleVocabCard`/`startSingleGrammar`)과
  `setFocusFromId` lookup 을 `repoFindItem` 으로 전환. 목록 필터(TYPES.data)는 다음 라운드.
- `questions.js` — 미전환 (오늘의 10분/SRS 와 결합되어 있어 다음 라운드에서 신중히).

**정적 import 가 남아 있는 파일 (다음 전환 대상):**
`questions.js`, `curriculum.js`, `contentStats.js`, `sentenceAccess.js`,
`conversationReadiness.js`, `conversationEngine.js`, `study.js`(목록 필터),
`home.js`, `review.js`, `grammarCompare.js`, `conversation.js`, `kanjiView.js`,
`vocabCardView.js`, `furigana.js`(자동 사전), smoke/qa(테스트는 원본 직접 검증이 정당).

B안(화면별 async 전환)을 쓰지 않는 이유: today/study/story 가 서로 데이터를
공유(즐겨찾기, SRS 큐)하므로 부분 async 화는 경계 버그를 만든다.

## 5. GitHub Pages / PWA / APK 호환성

| 환경 | fetch `data/*.json` | JS fallback | 비고 |
| --- | --- | --- | --- |
| GitHub Pages | ✅ 정적 파일 그대로 서빙 | 불필요 | 상대 경로라 `/<repo>/` 하위에서도 OK |
| PWA (Service Worker) | ✅ SW 캐시에서 응답 | 오프라인 첫 진입 시 사용 | 아래 캐시 전략 |
| APK (WebView/Capacitor) | ✅ 번들 내 자산 fetch 가능 | file:// 제약 시 사용 | Capacitor 는 http(s) 스킴 제공 |
| 로컬 `python -m http.server` | ✅ | 불필요 | 기존 개발 흐름 유지 |
| Node (smoke/qa) | ✗ (window 없음) | ✅ 자동 | `_setFetchForTest` 로 fetch 경로도 테스트 |

### PWA 캐시 전략 (향후 service worker)

- **앱 shell** (`index.html`, `styles.css`, `js/**`): **cache-first**
  — 버전 해시로 무효화. 오프라인 즉시 부팅.
- **`data/**/*.json`**: **stale-while-revalidate**
  — 캐시본으로 즉시 렌더 + 백그라운드 재검증. 콘텐츠 갱신이 다음 방문에 반영.
  완전 오프라인 학습이 우선이면 cache-first 로 바꿔도 무방 (콘텐츠는 불변에 가까움).
- `jsonPathFor()` 로 전체 JSON 경로 목록을 만들어 SW install 시 프리캐시 가능.

## 6. IndexedDB 는 언제 필요한가

지금은 **불필요**. 콘텐츠는 읽기 전용 정적 자산이라 SW Cache Storage 로 충분하다.
IndexedDB 가 필요해지는 시점:
- 사용자 생성 데이터가 localStorage 5MB 한도에 접근할 때
  (storyProgress/SRS 기록이 수만 건 — 현재 구조로는 수년치).
- 콘텐츠 전문 검색 인덱스를 클라이언트에 두고 싶을 때.
- 백그라운드 동기화로 대용량 콘텐츠 패치를 받을 때.

그 전까지는 "정적 JSON + SW 캐시 + localStorage" 3단 구성이 가장 단순하고 무료다.

## 7. 용량/성능 예상

| 시나리오 | 초기 JS | 지연 로드 |
| --- | --- | --- |
| 현재 (전부 정적) | ~431 KB | 0 |
| N4 JSON 이전 후 | ~250 KB | N4 ~180 KB (필요 시) |
| N5 까지 이전 후 | ~60 KB (로직만) | 레벨당 200~250 KB |
| N3/N2 추가 후 | ~60 KB 유지 | 레벨당 200~250 KB × 4 |

→ 콘텐츠가 4배가 되어도 **초기 로드는 오히려 1/7 로 감소**.
smoke 의 `=== 데이터 용량 리포트 ===` 가 매 실행마다 현황을 출력한다.

## 8. 실측 현황 + 병목 우선순위 (라운드 48 — N5~N2 완성 후)

실측: `js/data` 정적 import 합계 **~2.9MB(raw) / ~0.79MB(gzip)**, js 전체 ~3.3MB. 컴퓨트는 빠름 —
모듈 import+parse ~104ms(Node), 오늘의 10분 큐 생성 ~3ms, 추천 생성 ~3ms. **병목은 초기 다운로드/파싱뿐.**
hot path(`contentRepository`/`contentReadiness`/`curriculum`)가 전부 정적 import 라 dataLoader 미적용.
분리된 JSON 은 `data/n4/stories.json` 1개뿐.

| 파일/영역 | 크기(raw/gzip) | 병목 위험도 | 즉시 수정 | 추천 개선안 |
| --- | --- | --- | :---: | --- |
| `js/data/vocab.js` | 1.2MB / ~343KB | **높음**(단일 최대) | 아니오 | `data/<lv>/vocab.json` 분리 + 레벨별 lazy — 1순위 |
| `js/data/sentenceBank.js` | 408KB | 중간 | 아니오 | 회화 진입 시 lazy — 2순위 |
| `js/data/reading.js` | 368KB | 중간 | 아니오 | 레벨별 분리(독해 진입 시) |
| `js/data/listening.js` | 272KB | 중간 | 아니오 | 레벨별 분리(청해 진입 시) |
| `js/data/grammar.js` | 228KB | 낮음 | 아니오 | 자주 참조 — 후순위 |
| `js/data/stories.js` | 196KB | 낮음 | 아니오 | story 진입 시 lazy(n4 이미 JSON) |
| `js/data/kanji.js` | 156KB | 낮음 | 아니오 | 한자 화면 진입 시 |
| 초기 import+parse | ~104ms(Node) | 낮음 | 아니오 | 네트워크가 실질 비용 — SW 캐시(PWA)로 재방문 0 |
| 큐/추천/검색 컴퓨트 | ~3ms | **낮음** | 아니오 | 현 구조 유지 — N2 2300 에서도 빠름 |
| `contentRepository` 정적 import | 전량 로드 | 중간 | 아니오 | `loadLevelData` 점진 전환(회귀 위험 → 베타 후) |

**판정**: 성능은 **공개 베타 블로커 아님**(기능 정상·컴퓨트 빠름·gzip 0.8MB). 우선순위 1) PWA SW 캐시(재방문 비용 0,
docs/pwa-plan.md) → 2) vocab.js JSON 분리(첫 로드 최대 절감) → 3) reading/listening/sentenceBank 레벨별 lazy.
`jsonPathFor`/`VALID_LEVELS`/`VALID_TYPES`(dataLoader)로 PWA precache 목록·분리 경로를 코드 재사용(smoke 라운드 48 가드).

## 9. vocab JSON 분리 — 1차 인프라 완료 (라운드 53)

**완료한 것 (안전·무회귀):**
- `data/{n5,n4,n3,n2}/vocab.json` 생성(`tools/gen-vocab-json.mjs`, 단일 진실원 `js/data/vocab.js` 에서 추출).
  레벨별 count **500 / 902 / 1300 / 2300 = 5002**, gzip **34 / 74 / 132 / 175 KB**(활성 레벨만 전송).
- `dataLoader.loadVocab(level)` — JSON 우선 fetch → 실패/404/비배열/오프라인 시 `js/data/vocab.js` **fallback**, Promise 캐시. (구조는 기존 `loadLevelData` 그대로)
- **drift 잠금**: smoke 라운드 53 가 JSON ≡ JS 를 매 실행 검증 — 총합/레벨 count/id 순서·값/word·reading·meaningKo/전역 중복 0/imageKey palette. JSON 이 JS 와 어긋나면 CI 실패.
- SW `CACHE_VERSION` v2 — `data/*.json` 은 기존 stale-while-revalidate 로 캐시(앱 shell 과 분리, precache 아님).
- qa [239]: JSON 경로 로드·렌더·romaji 유지 + fetch 실패/비배열 → fallback.

**이번 라운드에서 하지 않은 것 (의도적 — 다음 단계):**
- **`js/data/vocab.js` 정적 import 제거 안 함.** 현재 8개 모듈이 정적 import
  (`contentRepository`/`contentStats`/`curriculum`/`furigana`/`localEvaluator`/`questions` + view 2) +
  `study.js` 가 모듈 init 에 `SECTIONS.vocab.data = vocab` 로 동기 바인딩. 따라서 **초기 로딩 절감은 아직 0**
  (정적 import 가 vocab.js 를 그대로 파싱). JSON 경로·fallback·drift 잠금만 선 구축.
- **실제 절감(~343KB gzip 첫 로드)** 은 정적 import 를 제거하고 위 소비자들을 `loadVocab(level)` 비동기/지연으로
  전환하는 **다음 라운드**에 발생. 그때 큐/추천/의존성의 동기 결합을 함께 async 화해야 하므로 범위가 크다.

**다음 단계(우선순위):**
1. **vocab 정적 import 제거** — `contentRepository` 를 `loadLevelData` 부트스트랩으로 전환(레벨 진입 시 로드 + 로딩 상태), 동기 소비자(curriculum/questions/furigana/localEvaluator)에 await 전파. **이것이 실제 첫 로드 절감 라운드.**
2. **sentenceBank(408KB)** → 회화 진입 시 lazy(`data/<lv>/sentenceBank.json`).
3. **reading(368KB)/listening(272KB)** → 독해/청해 진입 시 레벨별 lazy.
- 각 단계는 본 라운드와 동일하게 JSON 생성 → dataLoader → drift smoke → SW → qa fallback 순으로 진행.
- smoke/qa/content-report 는 **JS import 기반 유지**(단일 진실원). JSON 은 런타임 로드용 사본 + drift 로 잠금.
