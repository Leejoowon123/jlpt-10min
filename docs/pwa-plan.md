# PWA / 오프라인 도입 — 최소 구현 완료 (라운드 49)

**상태**: ✅ **최소 구현 완료**. 아래 §1~§7 계획대로 manifest + service worker + 아이콘 + 등록을 추가했다.
**목표**: GitHub Pages 정적 호스팅에서 동작하는 최소 PWA — 앱 shell 오프라인 + 콘텐츠 캐시. 학습은 오프라인에서도 가능, Firebase 로그인/로그는 온라인에서만.

## 0. 구현 결과 (라운드 49)

| 추가 파일 | 내용 |
| --- | --- |
| `manifest.json` | name/short_name/start_url·scope(`./` 상대)/display standalone/theme·background `#0f172a`/icons 4종 |
| `service-worker.js` | CACHE_VERSION 상수, install precache(shell), activate 구버전 정리, fetch=same-origin GET만(앱 shell cache-first / `data/*.json` SWR), cross-origin·Firebase network-only, 전 구간 `.catch` 방어 |
| `js/pwa.js` | `registerServiceWorker(nav?)` — 미지원/실패 시 false·throw 없음(학습 비차단), 상대경로 `./service-worker.js` scope `./` |
| `assets/icons/icon-{192,512}.png` + `-maskable` | 순수 Node(`tools/gen-icons.mjs`, zlib PNG)로 생성 — 네이비 배경 + 흰 원 + 빨간 점(외부 이미지/API 0) |
| `index.html` | `<link rel="manifest">` + `apple-touch-icon` |
| `js/app.js` | `start()` 후 `registerServiceWorker()` 호출(가드됨) |

검증: smoke 라운드 49 PWA 블록(manifest 유효·상대경로·아이콘 PNG 존재·SW 구조·Firebase 캐시 금지·등록 방어) + qa [236](등록 mock 미지원/실패/성공 + 렌더 회귀). `node smoke.mjs`·`node qa.mjs` 통과.

> 미적용(의도): 콘텐츠 JSON lazy 분리는 이번 라운드 범위 밖(정적 import 유지). 분리 시 SWR 경로가 그대로 활성화된다.

## 1. 범위 (최소 구현)

| 항목 | 내용 |
| --- | --- |
| `manifest.json` | name/short_name/start_url(상대)/display:standalone/theme_color/background_color/icons |
| `service-worker.js` | install 시 앱 shell precache, fetch 전략 분기 |
| 앱 shell | `index.html` + `js/**/*.js`(현재 정적 import 체인) → **cache-first** |
| 콘텐츠 | `data/**/*.json`(분리 완료분) → **stale-while-revalidate** |
| 등록 | `index.html` 인라인 스크립트에서 `navigator.serviceWorker.register('./service-worker.js')` (지원 시) |

## 2. 캐시 전략

- **cache-first (앱 shell)**: `index.html`, `js/app.js` 및 정적 import 되는 `js/**/*.js`(데이터 `js/data/*.js` 포함). 버전 변경 시 SW `CACHE_VERSION` 올려 무효화.
- **stale-while-revalidate (콘텐츠 JSON)**: `data/<level>/<type>.json`. 캐시 즉시 응답 + 백그라운드 갱신.
- **network-only (제외)**: Firebase(`*.firebaseio.com`, `*.googleapis.com`), Web Speech(TTS/STT)는 캐시하지 않음 — 온라인 전용.

## 3. precache 목록 도출 (dataLoader 재사용)

`js/dataLoader.js` 의 `jsonPathFor(level, type)` + `VALID_LEVELS` × `VALID_TYPES` 로 콘텐츠 캐시 후보 경로를 **코드로 생성** 가능(smoke 라운드 48 가드가 이 도출 가능성을 잠금). SW 빌드시 동일 함수 형식(`data/<lv>/<type>.json`)을 재사용한다.
> 단, 현재 분리된 JSON 은 `data/n4/stories.json` 1개뿐 — 나머지는 `js/data/*.js` 정적 import. 앱 shell cache-first 가 `js/data/*.js` 를 캐시하므로 **JSON 분리 미완 상태에서도 오프라인 학습은 동작**한다(데이터가 shell 에 포함됨).

## 4. 오프라인 동작 원칙

- 앱 shell + `js/data/*.js` 캐시 → **로그인 세션이 있으면 오프라인에서 N5~N2 학습/이야기/회화(로컬 평가) 동작.**
- Firebase 로그인/행동 로그 → 온라인에서만. 오프라인/실패 시 `logAction` 은 fire-and-forget 으로 조용히 noop, 학습 계속.
- TTS/STT → 브라우저/기기 Web Speech 지원에 의존. 미지원 시 기존 폴백 UI 유지(캐시와 무관).

### 로그인 필수 정책 하의 오프라인 한계 (라운드 50)

- **첫 사용 / 로그아웃 상태에서는 온라인 로그인이 필요**하다 — 인증 게이트가 막으므로 오프라인 첫 진입 불가.
  로그인 화면은 오프라인 시 "온라인 연결 필요" 안내를 표시한다.
- **이미 로그인한 세션이 Firebase Auth persistence(IndexedDB/localStorage)에 남아 있으면**, 오프라인에서도
  `getCurrentUser()` 가 사용자(또는 SDK 캐시 사용자)를 반환해 앱 shell + 로컬 학습 데이터로 학습을 계속할 수 있다.
  (단, 토큰 만료/강제 로그아웃 동기화는 온라인 복귀 시 반영.)
- 행동 로그는 오프라인에서 실패해도 학습을 막지 않는다(noop).

## 5. GitHub Pages 호환 주의

- `start_url`·SW scope·캐시 경로 모두 **상대 경로**(서브패스 배포 대비). hash 라우팅(`#/...`)이라 SW 라우팅 충돌 없음.
- SW 파일은 사이트 루트(또는 배포 루트)에 위치해야 scope 가 전체를 덮는다.
- HTTPS 필수 — GitHub Pages 는 기본 HTTPS 제공.

## 6. 단계 (권장 순서)

1. `manifest.json` + 아이콘 + `<link rel="manifest">` → 설치 가능(A2HS) 확보.
2. `service-worker.js` 앱 shell cache-first(정적 자산 목록) → 오프라인 첫 동작.
3. 콘텐츠 JSON stale-while-revalidate(분리 진행분과 함께).
4. 업데이트 UX(새 버전 감지 → 새로고침 안내) — 선택.

## 7. 검증 포인트 (구현 시)

- 오프라인 토글 후 새로고침 → 앱 로드 + 학습 가능
- Firebase 미연결 상태에서 학습 흐름 정상(로그 noop)
- SW 버전업 시 캐시 무효화 동작
- Lighthouse PWA 항목(installable/offline) 통과

## 8. 우선순위

**중간** — 공개 베타에는 필수 아님(현재도 정적 호스팅 동작). 다만 모바일 재방문 체감·오프라인 학습 가치가 커 베타 직후 1순위 제품화 작업으로 권장. JSON 분리(docs/data-loading-plan.md)와 함께 진행하면 캐시 효율이 좋아진다.
