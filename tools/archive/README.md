# tools/archive — 콘텐츠 일회성 생성기 보관소

라운드 40~47에서 N2 콘텐츠를 생성/수정할 때 쓴 **일회성 스크립트와 중간 산출물**을 보관한다.
콘텐츠가 동결(N5~N2 완성)되어 더 이상 런타임/CI에서 사용하지 않으므로 루트에서 이곳으로 이동했다.

> 이 디렉터리의 `_gen_*.py` / `_vdata_*.py` / `_vbatch.py` / `_allpats.json` / `_deps2_*.json` 은
> `.gitignore` 로 추적 제외된다(디스크 보존, git status 노이즈 없음). 이 `README.md` 만 추적된다.

## 보관 파일

| 파일 | 용도 |
| --- | --- |
| `_gen_kanji4.py` | N2 kanji k_n2_301~400 생성기 |
| `_gen_n1fix.py` | N2 grammar N1급 29문형 → 검증된 N2 문형 교체 + pairs 재작성 |
| `_gen_rl3.py` | N2 reading/listening 3차 생성기 |
| `_gen_sent3.py` | N2 sentenceBank 3차 생성기 |
| `_gen_story3.py` | N2 stories story_n2_011~018 생성기 |
| `_gen_topics3.py` | N2 conversationTopics 3차 생성기 |
| `_vbatch.py` | vocab 배치 삽입기(충돌 가드 + 집계 함수 갱신) |
| `_vdata_L.py ~ _vdata_Y.py` (14) | vocab 배치 데이터(알파벳 배치 L~Y) |
| `_allpats.json` | grammar 패턴 점검 중간 산출 |
| `_deps2_{reading,listening,stories}.json` | `scripts/gen-deps-n2.mjs` 의 중간 출력(재실행 시 루트에 재생성됨) |

## 주의

- **`scripts/gen-deps-n2.mjs` 는 보관 대상이 아니다** — 영속 유지보수 도구로 `scripts/` 에 추적 유지된다.
  N2 콘텐츠(reading/listening/stories) 변경 시 재실행 → `_deps2_*.json` 출력 → 각 데이터 파일의
  `*_DEPS_N2` const 에 재베이크한다.
- 콘텐츠 재생성 이력이 더 이상 필요 없다고 확정되면 이 디렉터리째 삭제해도 앱/테스트에 영향 없다
  (런타임 import 0건 — `node smoke.mjs` 의 "임시 생성기 런타임 import 0" 가드로 잠금).
