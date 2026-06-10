# JLPT 10분 — 무료 일본어 학습 MVP

하루 10분, JLPT N5~N2 학습 흐름을 **완전 무료**로 구현한 모바일 우선 SPA.
빌드 도구 없음 · 유료 API 없음 · 서버 없음 — 정적 호스팅(GitHub Pages)만으로 동작.

## 현재 상태

- **N5 안정화 완료** — 어휘 250 / 문법 45 / 독해·청해 25 / 한자 50 / 이야기 8 / sentenceBank 150 / 회화 주제 10
- **N4 1차 시드 완료** — 어휘 250 / 문법 40 / 독해·청해 20 / 한자 100 / 이야기 6 / sentenceBank 100 / 회화 주제 6
- 후리가나 커버율: N5/N4 전 영역 99~100% (smoke 가 매 실행 검증)
- 테스트: smoke(정적·데이터) + qa(jsdom 670+ 어서션) + GitHub Actions CI

## 주요 기능

- **오늘의 10분** — 단어/문법/독해/청해 10문항 자동 큐 + SM-2 SRS 복습
- **단어 이미지 카드 단계형 학습** — 노출→회상(3/5/7초)→확인→퀴즈 5단계
- **이야기/단편 소설 스토리 플레이어** — 후리가나+로마자+해석 3단 본문, 문단별/전체 TTS 재생, 인라인 핵심 단어, 진행 저장, 학습 연결·복귀
- **후리가나 ON/OFF** — 자동 사전 + 명시 readings, 읽기 가림 학습 지원
- **한자 카드 / 가나(50음도) 표** — 음·훈독, 예시 단어, 셀 클릭 TTS
- **회화 모듈 (오프라인)** — sentenceBank 기반 피드백, Web Speech STT 프로토타입
- **라이트/다크/시스템 테마** + 모바일 360px 대응
- **Firebase (선택)** — 이메일 로그인 + 최소 행동 로그. 로그인 없이 전 기능 사용 가능

상세: [docs/features.md](docs/features.md)

## 빠른 실행

ES Module 사용으로 `file://` 직접 열기 불가 — 아무 정적 서버나 OK.

```powershell
# 옵션 A — Python
cd D:\TEST
python -m http.server 5173
# → http://localhost:5173

# 옵션 B — Node
npx serve .
```

VSCode Live Server 등도 동일하게 동작.

## 테스트

```bash
npm install        # jsdom (최초 1회)
node smoke.mjs     # 데이터 무결성 + 후리가나 커버율 + 정적/보안 검사
node qa.mjs        # jsdom DOM 시나리오 (139 시나리오)
```

둘 다 통과해야 PR 가능 — CI 가 동일 명령을 자동 실행.
상세: [docs/qa-and-review.md](docs/qa-and-review.md)

## 브랜치 / 배포 (요약)

| 브랜치 | 역할 |
| --- | --- |
| `main` | GitHub Pages 배포 — smoke+qa CI 게이트 |
| `N4` 등 | 개발 브랜치 → PR 로 머지 |

상세 (CI 설정·branch protection·public repo 주의): [docs/development-workflow.md](docs/development-workflow.md)

## Firebase (선택 기능 — 행동 로그용)

이메일 로그인 + 최소 행동 로그(`app_open`, `study_start` 등 화이트리스트).
**로그인 없이 모든 기능 사용 가능.** 비밀번호/이메일 원문/답변 원문은 어디에도 저장하지 않음.
테스트 전용 버튼은 배포 UI 에 없음 (검증은 문서의 수동 QA 절차).
Web config 는 public 가능 — service account/Admin key 는 절대 커밋 금지.

**운영 rules 적용 위치**: Firebase Console → Build → **Realtime Database → Rules 탭** → 붙여넣기 → Publish.
(Firestore Rules 아님 주의. 테스트 모드 rules 로 main 배포 금지 — 머지 전 Publish 필수.)

상세 (연결 방법·DB 구조·운영 rules·main 병합 체크리스트): [docs/firebase-logging.md](docs/firebase-logging.md)

## 문서

| 문서 | 내용 |
| --- | --- |
| [docs/features.md](docs/features.md) | 기능 명세 — 화면·학습 UX·커리큘럼·노출 규칙·TTS 정책·스토리 플레이어·회화 |
| [docs/data-models.md](docs/data-models.md) | 데이터 스키마 — vocab/grammar/kanji/stories/sentenceBank/로그 구조 |
| [docs/content-policy.md](docs/content-policy.md) | 무료 운영·original 콘텐츠 원칙·이미지 라이선스·권장 학습량 |
| [docs/development-workflow.md](docs/development-workflow.md) | 브랜치 운영·CI·Pages 배포·public repo 보안 |
| [docs/qa-and-review.md](docs/qa-and-review.md) | 테스트 체계·회귀 위험 영역·PR 체크리스트·리뷰 포인트 |
| [docs/firebase-logging.md](docs/firebase-logging.md) | Firebase 로그인·행동 로그·운영 rules |
| [docs/data-loading-plan.md](docs/data-loading-plan.md) | JSON 분리·dataLoader·contentRepository 점진 이전 |
| [docs/browser-qa-checklist.md](docs/browser-qa-checklist.md) | 실제 브라우저 수동 QA 체크리스트 |
| [docs/asset-licenses.md](docs/asset-licenses.md) | 이미지 자산 라이선스 기록 |
| [docs/content-authoring-guide.md](docs/content-authoring-guide.md) | 콘텐츠 작성 실무 가이드 |
| [docs/offline-conversation.md](docs/offline-conversation.md) | 회화 모듈 어댑터 설계 |
| [docs/next-roadmap.md](docs/next-roadmap.md) | 단계별 로드맵 + TODO |
| [docs/n5-expansion-plan.md](docs/n5-expansion-plan.md) | N5 확장 라운드 기록 |

## 라이선스 / 콘텐츠 원칙 (요약)

- 모든 콘텐츠(예문·이야기·한자 설명·이미지)는 **본 프로젝트용 직접 창작 (original)**
- 기출·시판 교재·상용 앱 콘텐츠 복사/번역/각색 **금지**
- 유료 API·외부 LLM·외부 사전 API **미사용** — TTS/STT 는 브라우저 무료 Web Speech API 만
- 출처/라이선스 상세: [LICENSE_NOTES.md](LICENSE_NOTES.md) · [docs/content-policy.md](docs/content-policy.md)
