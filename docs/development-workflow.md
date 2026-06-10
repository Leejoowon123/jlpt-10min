# 개발 워크플로 / 브랜치 운영

main = GitHub Pages 배포 브랜치. 모든 변경은 smoke+qa 통과가 강제된다.
(README 에서 이동 — source of truth 는 이 문서)

## 브랜치 운영 / GitHub Pages 배포

| 브랜치 | 역할 |
| --- | --- |
| **`main`** | **GitHub Pages 배포 소스**. 모든 변경은 PR 또는 직접 push 모두 `.github/workflows/qa.yml` 의 smoke+qa 통과가 강제됨. |
| `N4` 등 | 개발 브랜치. 자유롭게 작업 → PR 로 main 에 머지. |

### PR 전 로컬 체크 (필수)
```bash
npm install            # jsdom 최초 1회
node smoke.mjs         # 데이터 무결성 + 후리가나 커버율
node qa.mjs            # jsdom UI 회귀 (594+ 시나리오)
```
둘 다 통과해야 PR 가능. CI 가 동일 명령을 자동 재실행한다 — 로컬에서 깨지면 PR 도 빨간 X.

### CI 워크플로 (`.github/workflows/qa.yml`)
| 트리거 | 동작 |
| --- | --- |
| `pull_request` → `main` | smoke + qa 실행, PR 페이지에 ✓/✗ 표시 |
| `push` → `main` | 머지/직접 push 직후 회귀 차단 |
| `workflow_dispatch` | Actions 탭에서 수동 실행 가능 |
- Node 22, ubuntu-latest, 10분 타임아웃.
- `concurrency` 로 같은 ref 의 진행 중 워크플로 자동 취소.
- `permissions: contents: read` — 토큰 권한 최소화.

GitHub Pages 배포 설정은 그대로 (main 브랜치). 워크플로는 배포에 개입하지 않는다 — QA 게이트 역할만.


## GitHub Pages 배포 방식

- Settings → Pages → Deploy from branch → `main` / root.
- 빌드 단계 없음 — 정적 파일 그대로 서빙. ES Module 이므로 `file://` 직접 열기는 불가.
- 워크플로(qa.yml)는 배포에 개입하지 않음 — QA 게이트 역할만.

## Branch protection 권장 설정

Settings → Branches → `main`:
- Require a pull request before merging
- Require status checks to pass → **smoke + qa** 체크 선택
- (선택) Include administrators

## Public repo 주의사항

- Firebase **Web config 는 public 가능** (apiKey 는 식별자 — 비밀키 아님).
- **절대 커밋 금지**: service account JSON, Admin SDK private key, 서버 비밀키, `.env`.
- smoke 가 `PRIVATE KEY`/`service_account` 패턴을 매 실행 검사한다.
- Firebase 상세: [firebase-logging.md](./firebase-logging.md)
