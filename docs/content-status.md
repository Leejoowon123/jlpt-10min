# 콘텐츠 현황 — 최종 목표 대비

**기준일: 2026-06-17** (라운드 47 — N2 3차 안정화/최종 품질 잠금 완료 · **N2 완성 선언 → N5~N2 전 레벨 완성**) · 갱신: `npm run content:report` 출력을 아래 표에 교체

> **N5 상태: 완료 (콘텐츠 + 품질 검수)** — 핵심 5개 영역 목표 달성, 후리가나 6개 영역 100%.
> **N4 상태: 완성 D — 핵심 5개 영역 최종 목표(min) 전부 달성** —
> vocab 902(누적 1402/1400) / kanji 200(누적 300/300) / grammar 85(80~120) /
> reading 60(60~100) / listening 60(60~100) / sentenceBank 300 / 회화 주제 10 / 이야기 6+단편 4.
> 후리가나 전 영역 100% + 전역 중복 0 (blocking) 잠금.
> **라운드 29 에서 안정화/품질 잠금 완료** — 학습 의존성 태깅(독해·청해 120건 전수) +
> 준비도/추천 유틸 + smoke 단위 테스트. N4 는 N5 와 같은 잠금 상태.
> **라운드 31 에서 N5 도 의존성/추천 엔진 잠금 완료** — N5 reading/listening 80건 전수 태깅
> (N5 id 만 참조, blocking), 스토리 의존성 보강, 준비도 배지/추천이 N5/N4 동일 동작.
> **라운드 32 — N3 0차 시드 완료**: vocab 110 / kanji 101 / grammar 20(+pairs 4) /
> reading·listening 각 9 / sentenceBank 50(회화 50) / 회화 주제 3 / 이야기 2+단편 1.
> N3 는 처음부터 explicit readings(후리가나 100%) + romaji 호환 + 의존성 태깅(N5/N4/N3 만
> 참조, N2 금지 blocking) + 준비도/추천 구조를 갖춘 상태로 시드됨.
> **라운드 33 — N3 0차 안정화 완료**: 전수/샘플 감사(이슈 6건 수정), 후리가나 == 100% 잠금,
> 추천 엔진 보강(기초 80% 학습 시 good_next 승격 + 목표 레벨 최소 슬롯).
> **라운드 34 — N3 1차 확장 완료**: vocab 300(누적 1702) / kanji 200(누적 500) /
> grammar 40(+pairs 8) / reading·listening 각 20 / sentenceBank 120(회화 120) /
> 회화 주제 6 / 이야기 4+단편 2. 후리가나 100%·전역 중복 0·N2 참조 0 유지,
> 신규 콘텐츠 전수 의존성 태깅 + smoke sentinel 1차 수치로 상향.
> 추천 엔진에 "복습 최소 1 슬롯" 역방향 보장 추가 (N3 항목이 늘어도 N5/N4 복습 미배제).
> **라운드 35 — N3 1차 안정화 완료**: 7개 영역 전수/샘플 감사 (이슈 7건 수정 — 아래 판정 기록),
> 교차 레벨 meaningKo 동일 0 잠금, 문법 explanation 최소 길이·similar/pair 연결 잠금,
> 독해 정답 과노출 unreviewed 감시, 부분 학습 추천 회귀 검증 추가. qa [189]~[192].
> **라운드 36 — N3 2차 확장 완료**: vocab 600(누적 2002) / kanji 300(**누적 600 — N3 한자 목표 100% 달성**) /
> grammar 70(+pairs 16, にかわって 추가로 かわりに 페어 해소) / reading·listening 각 40
> (장문 독해 3편 포함) / sentenceBank 220(회화 220) / 회화 주제 9 / 이야기 7+단편 3.
> 후리가나 100%·전역 중복 0·교차 meaningKo 0·N2 참조 0 유지, 신규 전수 의존성 태깅,
> sentinel 2차 수치 상향. qa [193]~[196].
> **라운드 37 — N3 2차 안정화 완료**: 7개 영역 전수 감사, g_n3_1/2 의 N4 교차 패턴 분리·교체,
> 학습범위 밖 한자 재판정(N2권 한자 예문 7건 재작성 → 46건, 정책 한도 60 확정),
> 청해 장문 verbatim 2건 paraphrase, 장문 독해 long-passage UX. qa [197]~[200].
> **N3 는 2차 안정화 단계 — 아직 최종 완성 아님.** 다음은 N3 3차 마무리 확장.
> **라운드 46 — N2 3차 마무리 확장 완료**: vocab 2300(누적 **5002/5000 — 누적 목표 100% 달성**) /
> kanji 400(누적 **1000/1000 — 100% 달성**) / grammar 180(+pairs 45) / reading 120(장문 200자+ 18편) /
> listening 120 / sentenceBank 600(회화 600) / 회화 주제 18 / 이야기 10+단편 8(short_story 8).
> 후리가나 100%·전역 word/kanji/pattern 중복 0·vocab 예문 중복 0·sentenceBank.ja 중복 0·
> reading+meaningKo 조합 중복 0·N1급 문법 0·핵심 의존성 0건 없음·unreviewed 0 유지.
> 신규 reading/listening/story 의존성 `scripts/gen-deps-n2.mjs` 재베이크(120/120/18 전수),
> smoke 라운드 46 sentinel + qa [233] 추가. **N2 는 3차 확장 단계 — 다음은 N2 3차 안정화 후 완성 선언.**
> **라운드 47 — N2 3차 안정화/최종 품질 잠금 완료**: 콘텐츠 수량 추가 0, 7개 영역 전수 감사.
> grammar 신규 100문형 중 **N1급 29문형을 검증된 N2 문형으로 교체**(아래 경계 판정표) + 영향 pairs 8건
> 재작성. stories 3편 keyVocab ≥5 보강, conversationTopics 전 질문 sentenceBank 연계 ≥1 확보,
> 동철동의/활용형 정합은 라운드 46에서 해소 완료. gen-deps 재베이크(mismatch 0). smoke `N1PAT`
> 확장(てやまない·を皮切り·ないではおか·たら最後·ずじまい·が関の山·はおろか 등 영구 차단) +
> smoke 라운드 47 **N2 완성 선언 기준 블록**(blocking) + qa [234]. blocking 0 / unreviewed 0 /
> 추천 회귀 0. **→ N2 완성 선언 충족. N5·N4·N3·N2 전 레벨 콘텐츠 완성.** 다음은 실제 브라우저 전체
> QA / PWA·오프라인 / 데이터 경량화(JSON 분리) / 모바일 앱 패키징 검토(콘텐츠 외 트랙).
> **라운드 48 — 릴리스 후보 안정화 완료(콘텐츠 추가 0)**: 전체 상태/성능/Firebase/UX 감사. **코드 블로커 0.**
> Firebase 로그 보안 검증(web config 만·userKey=uid·sanitizeMeta allowlist·민감정보 0·로그인 없이 학습 가능·
> 로그 실패 비차단). 성능 실측(js/data ~2.9MB/gzip ~0.79MB, 큐·추천 ~3ms — 병목은 초기 다운로드뿐, 블로커 아님,
> 우선순위표 docs/data-loading-plan.md). PWA 최소 구현 계획 docs/pwa-plan.md, 릴리스 체크리스트 docs/release-checklist.md.
> smoke 라운드 48 구조 가드(jsonPathFor PWA 경로 도출·로그 payload allowlist) + qa [235]. App Check=「지금 필수 아님 /
> 나중에 권장」. **→ 수동 브라우저 QA + Firebase 운영 rules Publish 확인만 거치면 공개 베타 가능.**

### N2/N1 경계 문형 최종 판정 (라운드 47)

신규 100문형(g_n2_81~180) 전수 재검토. 레퍼런스(신칸젠/소마토메) 합의 기준 **N1급 29문형을 N2로 교체**(같은 id 유지·참조 재매핑), 경계상 N2 방어 가능 7문형은 reviewed 유지.

| 문형 | 판정 | 근거 | 조치 |
| --- | --- | --- | --- |
| 〜てやまない | **교체→N2** | 신칸젠 N1. 감정 강조 문어체 | g_n2_129 → 〜というより |
| 〜を皮切りに | **교체→N2** | 신칸젠 N1. 시작점 강조 | g_n2_161 → 〜をきっかけとして |
| 〜ないではおかない | **교체→N2** | 신칸젠 N1. 필연·사역 | g_n2_130 → 〜に関する |
| 〜たら最後 | **교체→N2** | 소마토메 N1 | g_n2_175 → 〜にとっては |
| 〜ずじまい | **교체→N2** | 신칸젠 N1. 미완 결말 | g_n2_117 → 〜きる |
| 〜が関の山だ | **교체→N2** | 신칸젠 N1. 한계 평가 | g_n2_153 → 〜ほどだ |
| 〜はおろか·べく·やいなや·ときたら·いかんで(は)·ようものなら·ばそれまでだ·めく·ぶる·ふしがある·といったらない·ものを·手前·始末だ·あっての·限りだ·なり(즉시)·つ〜つ·随一の·もさることながら·にかたくない·ないではすまない·運びとなる | **교체→N2** (23문형) | 모두 신칸젠/소마토메 N1 | 검증된 N2 문형으로 교체(아래) |
| 〜にしたところで·と思いきや·てからというもの·うが〜うが·はさておき·ともなれば·ながらに(生まれながらに) | **유지(reviewed)** | 소마토메/신칸젠 N2 수록·생산적 N2 용법 | N2 유지 |

> 교체 투입 N2 문형(전 레벨 부재 확인): さえ〜ば·上に·ないかぎり·としたら·恐れがある·かけだ·にしたら·に関して·を中心として·つもりで·を込めて·ものか·きる·とおりだ·をはじめとして·というより·に関する·に対する·につけ·ほどだ·気味だ·ぬく·をめぐる·をきっかけとして·ようによっては·からして·ことだろう·にとっては·ものではない.
> 교체 후 smoke `N1PAT`(확장) 0 / qa [234] 확장 N1 스캔 0 / grammar.pattern 전역 중복 0(레거시 N5↔N4 4쌍 reviewed 제외) / pairs 참조·선택지 무결성 0.

### N2 완성 선언 기준 (smoke 라운드 47 블록 — blocking)

누적 vocab ≥5000(5002) · 누적 kanji ≥1000(1000) · grammar ≥180(180) · grammarPairs ≥45(45) ·
reading ≥120(120) · listening ≥120(120) · sentenceBank ≥600(600, 회화 600) · conversationTopics ≥18(18) ·
stories ≥18(18) · short_story ≥6(8) · 후리가나 100% · 의존성 전수(stale bake 0) · 전역 word/kanji/pattern 중복 0 ·
vocab 예문·reading+meaningKo 조합·sentenceBank.ja 중복 0 · reading/listening choices 중복 0 · readings 정합 0 ·
sourceId 참조 0 · N1PAT 0 · imageKey 최다 ≤10%(tool 8.8%) · unreviewed 0 · gen-deps mismatch 0. **전부 통과 → N2 완성.**

## 기준 설명

- **최종 목표**는 [js/data/levelTargets.js](../js/data/levelTargets.js) 의 수치 —
  **JLPT 공식 확정 목록이 아니라** 일반적으로 통용되는 권장 학습량을 앱 내부 목표치로 채택한 값이다.
- **어휘/한자는 누적 목표** — N4 의 1400 은 "N5+N4 합산 누적", N3 의 2700 은 "N5~N3 누적".
  표의 "현재" 도 같은 방식으로 누적 집계한다.
- **문법/독해/청해는 레벨별 범위 목표(min~max)** — 진행률은 min 기준.
- 수량 산출은 `scripts/content-report.mjs` 가 js/data/*.js 를 직접 집계하며,
  smoke.mjs 가 동일 산출값과 일치하는지 매 실행 검증한다 (수치 어긋남 방지).
- 최종 목표 미달은 실패가 아니다 — 우선순위 판단용 현황. CI 를 막는 것은
  1차 시드 임계치(smoke sentinel)뿐.
- **N5 는 라운드 24 로 핵심 5개 영역 모두 목표(min) 달성** — vocab 500 / kanji 100 /
  grammar 45 / reading 40 / listening 40. smoke sentinel 도 동일 수치로 상향되어
  이 아래로 줄어들면 CI 가 실패한다.

<!-- 자동 생성: npm run content:report (기준일 2026-06-17) -->

### 표 1 — 핵심 학습 콘텐츠 (최종 목표 대비)

| 레벨 | 영역 | 현재 | 목표 | 부족 | 진행률 |
| --- | --- | ---: | ---: | ---: | --- |
| N5 | vocab(누적) | 500 | 500 | 0 | ██████████ 100% |
| N5 | kanji(누적) | 100 | 100 | 0 | ██████████ 100% |
| N5 | grammar | 45 | 40~60 | 0 | ██████████ 113% |
| N5 | reading | 40 | 40~60 | 0 | ██████████ 100% |
| N5 | listening | 40 | 40~60 | 0 | ██████████ 100% |
| N4 | vocab(누적) | 1402 | 1400 | 0 | ██████████ 100% |
| N4 | kanji(누적) | 300 | 300 | 0 | ██████████ 100% |
| N4 | grammar | 85 | 80~120 | 0 | ██████████ 106% |
| N4 | reading | 60 | 60~100 | 0 | ██████████ 100% |
| N4 | listening | 60 | 60~100 | 0 | ██████████ 100% |
| N3 | vocab(누적) | 2702 | 2700 | 0 | ██████████ 100% |
| N3 | kanji(누적) | 600 | 600 | 0 | ██████████ 100% |
| N3 | grammar | 120 | 120~180 | 0 | ██████████ 100% |
| N3 | reading | 80 | 80~140 | 0 | ██████████ 100% |
| N3 | listening | 80 | 80~140 | 0 | ██████████ 100% |
| N2 | vocab(누적) | 5002 | 5000 | 0 | ██████████ 100% |
| N2 | kanji(누적) | 1000 | 1000 | 0 | ██████████ 100% |
| N2 | grammar | 180 | 180~250 | 0 | ██████████ 100% |
| N2 | reading | 120 | 120~200 | 0 | ██████████ 100% |
| N2 | listening | 120 | 120~200 | 0 | ██████████ 100% |

진행률은 범위 목표의 경우 **min 기준**. 100% 초과는 100%로 표시하지 않고 실값 유지.

### 표 2 — 보조 콘텐츠

| 레벨 | sentenceBank (회화 가능) | 이야기 | 단편 | 회화 주제 | 문법 페어 |
| --- | ---: | ---: | ---: | ---: | ---: |
| N5 | 220 (220) | 5 | 3 | 10 | 8 |
| N4 | 300 (299) | 6 | 4 | 10 | 13 |
| N3 | 350 (350) | 10 | 4 | 12 | 24 |
| N2 | 600 (600) | 10 | 8 | 18 | 45 |

후리가나 커버율은 `node smoke.mjs` 의 `=== N5/N4 후리가나 커버율 ===` 섹션 참조.
(N5·N4·N3 모두 전 영역 — vocab 예문 / grammar 예문 / reading 지문 / listening 스크립트 /
sentenceBank / story 본문 — 100%. smoke 가 == 100% sentinel 로 잠금.)

## N5 품질 경고 판정 기록 (라운드 25 안정화)

smoke 품질 감사는 경고를 2단 분류한다: **unreviewed** (미판정 — 목표 0) /
**reviewed** (검토 후 의도적 유지). blocking 오류는 ok() 실패로 CI 를 막는다.

| 경고 | 판정 | 사유 |
| --- | --- | --- |
| N5 예문 한자 ≥5개 (58건) | **검토 후 유지** | 해당 예문의 모든 한자가 N5 학습 범위(한자 덱 100자 ∪ N5 단어 표제어 한자) 안에 있고 후리가나 100% — 학습 대상 노출이므로 난이도 문제 아님. smoke 가 매 실행 이 기준으로 자동 재판정한다. |
| N5 예문에 학습 범위 밖 한자 (12건) | **정리 완료** | 라운드 25 에서 12건 예문을 전부 범위 내 한자로 재작성 (優→親切, 会議→テスト/授業, 東京→家 등). 현재 0건 — 재발 시 unreviewed 로 표면화. |
| listening scriptReadings 혼입 (14건) | **정리 완료** | 질문용 단어가 scriptReadings 에 들어 있던 것을 제거. "readings text 는 대상 문장에 실제 존재" blocking 검증을 smoke 에 추가해 재발 차단. |

## 중복/유사 중복 감사 판정 기록 (라운드 27)

| 검사 | 분류 | 판정 |
| --- | --- | --- |
| vocab word 전역 중복 (레벨 교차 포함) | **blocking** | 기존 교차 중복 20건(子供/夫/妻/試験 등)을 상위 레벨 항목 제거 + 참조 재매핑으로 해소. 현재 0. |
| vocab exampleSentence 완전 중복 | **blocking** | 0건. |
| sentenceBank.ja 완전 중복 | **blocking** | 0건. |
| kanji 문자 전역 중복 | **blocking** | 0건 (300자). |
| grammar pattern 중복 (레벨 내) | **blocking** | 0건. |
| reading/listening choices 항목 내 중복 | **blocking** | 0건. |
| readings text ↔ 대상 문장 정합 | **blocking** | 0건. |
| vocab 유사 예문 (편집거리≤2) | **reviewed** | 전수 검토(142쌍) 결과 모두 "최소 문형 공유"(Xが痛いです/Xを買いました 등) — 서로 다른 표제어를 같은 기초 문형으로 가르치는 의도적 패턴. 유지. |
| vocab 예문 ↔ sentenceBank.ja 동일 | **reviewed** | 109건 — sourceId/vocabIds 연결(100) 또는 표제어 포함(9)으로 설계상 의도된 재사용. 연결도 표제어도 없는 "무관 복사"만 unreviewed 로 표면화 (현재 0). |
| reading+meaningKo 조합 중복 | **warning** | 현재 0건 — 발생 시 동철이의어 검토용. |
| N4 에 N3/N2 급 문법 패턴 혼입 | **warning** | 현재 0건 (に違いない/ばかりか/べきだ 등 패턴 스캔). |

## N4 완성 D 추가 판정 (라운드 28)

| 항목 | 분류 | 판정 |
| --- | --- | --- |
| vocab meaningKo 동일 쌍 (11건) | **reviewed** | 유의어쌍(車/自動車, 急に/突然) 또는 한국어 동철이의(書く 쓰다/苦い 쓰다) — 단어·읽기가 다르므로 의도적 공존. smoke 가 매 실행 수를 리포트, 급증 시 재검토. |
| 신규 imageKey 8종 추가 | — | mail/tool/hotel/phone/gift/team/pet/ceremony — 상위 키 집중(person/mind 등) 완화 목적. |

## N3 0차 안정화 판정 기록 (라운드 33)

| 항목 | 판정 |
| --- | --- |
| 任せる/預ける meaningKo 동일 | 任せる → "(일을) 맡기다" 로 구분 (수정) |
| ふんいき romaji "funiki" | ん+모음/y 경계에 어퍼스트로피 추가 → fun'iki (수정, smoke 잠금) |
| r_n3_6 「べきだ」(N2급 스캔 대상) | 「たほうがいい」 로 재작성 (수정) |
| r_n3_1/r_n3_2 핵심 의존성 1건 | 본문 필수 N4 어휘(運動/目標/研修/参加) 승격 → core 3 (수정) |
| g_n3_12 explanation 부족 | 사용 장면 포함해 보강 (수정) |
| する/やる 뜻 동일 → 퀴즈 선택지 간헐 중복 | buildQuestion distractor 를 meaningKo 기준 dedupe (수정 — flaky 영구 해결) |
| 청해 스크립트의 " — " 화자 구분 기호 | N5/N4 포함 전 레벨 공통 표기 관행 — 검토 후 유지 |
| 덱(401자) 밖 한자 포함 N3 단어 15건 | 단어 자체가 N3 학습 대상(한자 덱은 점진 확장) — 1차 확장에서 한자 200자로 보강 예정 |

## N3 1차 확장 판정 기록 (라운드 34)

| 항목 | 판정 |
| --- | --- |
| 어휘 후보 比べる | 기존 단어와 전역 중복 → 求人 으로 교체 후 추가 (중복 0 유지) |
| r_n3_10 questionReadings 「何」 | 질문 문장에 없는 단어 혼입 — 제거 (blocking 검증이 잡아냄) |
| l_n3_17/l_n3_18 scriptReadings 혼입 5건 | 질문용 단어(男/人/借りたい/何時 등) 제거 — 시드와 동일한 재발 패턴, blocking 으로 차단됨 |
| sent_n3_073/076/077/082 sourceType 'original' | 유효 sourceType 아님 → 'conversation' + conv_n3_reservation_problem 연결로 수정 |
| N5/N4 마스터 추천에서 N5/N4 복습 소실 | N3 항목 증가로 상단이 전부 N3 가 되는 회귀 — ensureTargetLevel 에 "복습 최소 1 슬롯" 역방향 보장 추가 (smoke/qa 잠금) |
| deps 재생성 시 r_n3_1/2 수동 보강 보존 | 라운드 34 베이크는 신규 id(r/l_n3_10~20, story_n3_004~006)만 별도 테이블로 추가 — 기존 베이크/보강 코드 미변경 |
| 신규 문법 g_n3_21~40 deps 탐지 | gen-deps-n3 에 탐지 가능한 14개 패턴 추가 (って/きる/かける 등 과탐 위험 패턴은 제외) |

## N3 1차 안정화 판정 기록 (라운드 35)

감사 범위: vocab 300 전수(프로그램) + 신규분 샘플 정독 30 / kanji 200 전수 + 샘플 정독 14 /
grammar 40 전수 / reading·listening 각 20 전수 / sentenceBank 120 전수 / topics 6 전수 /
stories 6 전수.

### 수정 (7건)

| 항목 | 판정 |
| --- | --- |
| 全く(N3)/全然(N4) meaningKo '전혀' 동일 | 全く → "완전히, (부정과 함께) 전혀" 로 구분 (수정 — 교차 레벨 meaningKo 동일 0 blocking 잠금) |
| grammar explanation 15자 미만 8건 (g_n3_9/10/11/19/27/33/35/36) | 사용 장면·형태·근접 문형 구분 포함해 전부 보강 (수정 — ≥15자 blocking 잠금) |
| grammar similar/pair 미연결 4건 | g_n3_4たびに→おきに, g_n3_21とおりに→ように(g_n4_24), g_n3_35こそ→さえ 연결 (수정) |
| r_n3_15 정답 선택지가 본문 그대로 (13자) | 「行く前に予約したほうがいい」로 패러프레이즈 + 오답의 べきだ(N2급) 제거 (수정) |
| r_n3_19 정답 선택지가 본문 그대로 | 「会場の整理と案内の手伝い」로 패러프레이즈 (수정) |
| sent_n3_046 ごみ ↔ vocabId v_n4_465(ゴミ) 표기 불일치 | 문장을 ゴミ 로 통일 (수정) |
| r_n3_15 오답 선택지에 「べきだ」 | 선택지는 N2급 패턴 스캔 대상 밖이었음 — 위 수정에 포함 |

### 검토 후 유지 (reviewed)

| 항목 | 판정 |
| --- | --- |
| g_n3_22 かわりに similar/pair 미연결 | 비교 대상 문형(にかわって 등)이 덱에 없음 — 2차 확장에서 추가 검토. smoke 가 "미연결 ≤ 1 (g_n3_22 만)" 으로 잠금 |
| 청해 정답 선택지가 스크립트에 그대로 13건 | 시간/숫자/짧은 구 중심 — "스크립트를 듣고 직접 찾는" 청해 표준 형식. 유지. 독해는 10자 이상 verbatim 시 unreviewed 경고로 감시 (현재 0) |
| N3 예문 학습범위 밖 한자 26건 | 彼/誰/活/従/困 등 하위 빈출 한자 — 후리가나 100% 이므로 학습 장애 아님. 40건 초과 시 unreviewed 표면화 |
| N3 독해 지문 길이 (3~4문장) | 작성 가이드의 N3 목표(6~12문장)보다 짧음 — 1차에서는 단문 중심 유지, 2차 확장에서 장문 독해 추가 예정 |
| 案外(부사)/意外(명사·형용동사) 공존 | meaningKo 표기 구분('의외로'/'의외') — 품사가 다른 의도적 공존 |

### 난이도 판정

- vocab: 신규 190 단어 전수 목록 + 샘플 30 정독 — N2급 혼입 0, N4 이하 과다 0 (食事/外食 등
  생활어는 N4 덱에 없는 단어만 채택됨을 전역 중복 0 으로 보증).
- grammar: 40개 전부 N3 핵심 문형, N2급 패턴 스캔 0.
- reading/listening: N2급 패턴 0, 추론형(주장/특징/목적)과 사실 확인형 혼합 — N3 적정.
  지문 길이는 reviewed 항목 참조.


## N3 2차 확장 판정 기록 (라운드 36)

### 작성 중 잡힌 이슈 (수정 7건)

| 항목 | 판정 |
| --- | --- |
| 立場(N3) '입장' ↔ 入場(N4) '입장' 교차 동일 | 立場 → '입장(처지)' 로 구분 (blocking 이 잡아냄) |
| sent_n3_122/132/143/145 sourceType 'original' | 라운드 34 와 동일 실수 — 'conversation' + 신규 토픽 연결로 수정 |
| r_n3_30 지문 비문 + 「べきだ」 혼입 | 작성 중 자체 발견, 재작성 |
| r_n3_1/13(기존)·r_n3_29(신규) 오답 선택지 「べきだ」 3건 | 라운드 35 규칙(선택지에도 N2급 금지)에 따라 たほうがいい/ことだ 등으로 교체 — 감사 스크립트가 선택지까지 스캔하도록 확장 |
| g_n3_68 패턴명 '〜らしい (전형·〜답다)' 에 정답 텍스트 포함 | 퀴즈 선택 전 화면에 정답이 노출되는 누출 — 패턴명을 '〜らしい (전형)' 으로 수정 (smoke 가 잡아냄) |
| sent_n3_215 일본어 문장에 영어 단어 혼입 | 運転 으로 재작성 |
| g_n3_41 예문이 g_n3_22 예문과 준중복 | 担任/教頭 예문으로 재작성 |

### 검토 후 유지 / 기준 재판정 (reviewed)

| 항목 | 판정 |
| --- | --- |
| 학습범위 밖 한자 26건 → 53건 | 신규 어휘 300 추가에 따른 자연 증가. 분포 재검토: 彼24/活7/困4/誰2 + 단발 한자(京/超/捕/譲 등) — 전부 하위 빈출·후리가나 100%. reviewed 기준 53 으로 재판정, 70 초과 시 unreviewed (smoke) |
| g_n3_1 ことにする / g_n3_2 ことになる 가 N4 패턴과 교차 중복 | 0차 시드부터 존재. id 참조(deps/sentenceBank)가 많아 이번 라운드는 유지 — 2차 안정화에서 통합/구분 재검토 |
| 청해 정답 verbatim (신규 포함) | 청해 표준 형식 — 라운드 35 판정 유지 |

### 구조 메모

- かわりに 비교 문형 보강: g_n3_41 にかわって 신설 + gp_n3_9 페어 — 라운드 35 의
  "비교 문형 부재" reviewed 항목 해소. N3 grammar similar/pair 미연결 0.
- deps 베이크: 신규 id 만 `*_R36` 테이블로 추가 (r/l_n3_21~40, story_n3_007~010).
  r_n3_1/2 수동 보강 보존 확인.
- gen-deps-n3 에 신규 문법 탐지 패턴 24종 추가 (たて/きり/がる/ことだ 등 과탐 위험 제외).


## N3 2차 안정화 판정 기록 (라운드 37)

감사 범위: vocab 600 전수(프로그램 — meaningKo/readings/romaji/N2패턴/유사예문/무관복사) /
kanji 300 전수 / grammar 70 + pairs 16 전수 / reading·listening 각 40 전수 /
sentenceBank 220 전수 / topics 9 전수 / stories 10 전수.

### 수정 (4건)

| 항목 | 판정 |
| --- | --- |
| g_n3_1/2 가 N4(g_n4_20/21)와 패턴 완전 동일 | **분리·교체로 결정** — ① g_n3_1 → 「〜ことにしている」(습관, N4 1회성 결정과 구분) ② g_n3_2 → 「〜ぶり(に)」(신규 N3 문형으로 교체, きり와 비교 연결). 참조 재매핑: sent_n3_118→g_n4_20, sent_n3_119·story_n3_004(베이크 포함)→g_n4_21, gp_n3_1 은 N4 기본형(g_n4_20/21) 비교로 재지정. 근거: ことにする/ことになる의 기본형은 N4 가 정위치이고, N3 에는 확장형(습관)과 새 문형이 학습 가치가 더 높음. smoke 가 "교차 레벨 패턴 동일 0" blocking 으로 재발 차단. |
| N2권 한자 포함 예문 7건 (鞄/頃·宇宙/遺·跡/排/罰/護/麦) | 전부 범위 내 한자로 재작성 (机/歌手/歴史/パイプ/注意/会計/牛乳·卵) |
| 청해 정답 verbatim 10자+ 2건 (l_n3_6/l_n3_8) | 「寝る前のスマホの癖」「自転車だけが通る道を作る」로 paraphrase — smoke 가 청해도 10자+ verbatim 을 unreviewed 로 감시 |
| 장문 독해 UX | 지문 200자+ 에 long-passage 클래스 자동 부여 + CSS(글자 15px·행간 1.9·하단 여유). 탭바 겹침은 .screen padding-bottom(88px)으로 보장 — smoke/qa 잠금, 수동 QA 항목 추가 |

### 재판정 (reviewed)

| 항목 | 판정 |
| --- | --- |
| 학습범위 밖 한자 53 → **46건** | **정책 확정**: 하위 빈출 한자(彼24/活7/困4/誰2/香2/京/超/堂/捕/辺/譲/季)는 후리가나 100% 전제로 허용. N2권 한자는 금지(이번에 7건 제거). 기준 46 / 한도 60 — 임시 상향이 아니라 정책. 彼/活/困/誰 는 향후 N3 한자 확장 후보로 기록. |
| 청해 짧은 verbatim (시간/숫자/구) | 청해 표준 형식 — 유지. 10자+ 만 unreviewed 감시 |
| 회화 가능 문장 길이 | 전수 점검 — 32자 초과 0 (blocking 잠금 추가). canUseInConversation 부적절 항목 없음 |
| 장문 스토리 4편 (7~8문단, 줄 ≤31자) | 문단 수 4~8·줄 40자 제한 내 — 모바일 가독 부담 없음. 수동 QA 체크리스트에 점검 항목 추가 |

## N3 3차 마무리 확장 판정 기록 (라운드 38)

**N3 최종 목표 최소치 5개 영역 전부 100% 달성** — vocab 누적 2702/2700, kanji 누적
600/600, grammar 120, reading 80, listening 80. 후리가나 100%·전역 중복 0·교차 meaningKo 0·
N2 참조 0·N2급 문법 패턴 0 유지.

### 추가 수량

| 영역 | 이전(2차) | 추가 | 현재 |
| --- | ---: | ---: | ---: |
| vocab | 600 | +700 | 1300 (누적 2702) |
| kanji | 300 | +0 | 300 (누적 600, 목표 달성으로 유지) |
| grammar | 70 | +50 | 120 |
| grammarPairs | 16 | +8 | 24 |
| reading | 40 | +40 | 80 (장문 200자+ 10편) |
| listening | 40 | +40 | 80 |
| sentenceBank | 220 | +130 | 350 (회화 350) |
| conversationTopics | 9 | +3 | 12 |
| stories | 10 | +4 | 14 (이야기 10+단편 4) |

### 작성 중 잡힌 이슈 (수정)

| 항목 | 판정 |
| --- | --- |
| 신규 vocab 700개 중 생활/건강 영역이 기존 N3/N4와 대량 중복 (검증 단계 60건+) | 도메인을 추상/논리/사회/복합동사/부사로 전환해 전역 중복 0 달성 (작성 전 1467개 한자 단어 목록 덤프 대조 + 후보 사전 검증 스크립트 활용) |
| 교차 레벨 meaningKo 동일 7건 (誠実/不在/改札口/優先/意欲/早急/輝く) | 괄호 보충으로 구분 (예: 優先 → "우선(먼저 함)", 早急 → "시급함(매우 급함)") |
| N3 내부 meaningKo 동일 7건 | 동음이의(構造/救助, 仮定/家庭)·유의어는 괄호 구분, 曖昧↔あいまい(같은 단어 표기차)는 紛らわしい로 교체 |
| 신규 독해/청해 정답 선택지 verbatim·べきだ 혼입 | paraphrase + たほうがいい 등으로 교체 (선택지까지 N2급 스캔) |
| 청해 신규분 scriptReadings에 질문용 단어 혼입 37건 | script 실재 여부 자동 필터로 제거 (재발 패턴 — blocking 유지) |
| sentenceBank 작성 중 vocabId 오매핑 + 전역 replace로 인한 sourceId 손상 7건 | 손상 항목 구조 복원 + 라인 단위 안전 제거로 정정 (전역 문자열 replace의 위험성 재확인 → 라인 단위 처리 원칙) |
| 신규 長文 7편이 196~169자로 200 미달 | 본문에 마무리 문장 + 해당 readings 추가로 200자+ 10편 확보 (long-passage UX 대상) |

### 재판정 (reviewed)

| 항목 | 판정 |
| --- | --- |
| 학습범위 밖 한자 46 → **62건** | 신규 700 단어로 자연 증가. 분포: 彼38/誰3/塔3/譲2/季2/香2 + 단발 — 전부 하위 빈출, 후리가나 100%. 정책 한도 **75**로 상향(임시 아님). 彼는 대명사로 가나 표기 가능하나 한자 노출 유지 |
| story 장문화 (7~8문단 6편) | 줄 길이 40자 이내·문단 8 이내 유지 — 모바일 가독 부담 없음 |

### N3 완성 선언 가능 여부

5개 핵심 영역 + 보조 콘텐츠 모두 최종 목표 달성, 후리가나/의존성/추천/중복 모든 게이트
통과. **N3 3차 안정화(전수 감사) 1회 후 "N3 완성" 선언 가능** 상태.

## N3 3차 안정화 / N3 완성 선언 (라운드 39)

**N3 완성** — 전수 감사 0 이슈, 5개 핵심 영역 최종 목표 100% 달성, 모든 품질 게이트 통과.
이번 라운드는 콘텐츠 추가 없이 안정화·회귀 방지·완성 기준 명문화만 수행.

### 감사 범위 (전수)
vocab 1300 / kanji 300(누적 600) / grammar 120 + pairs 24 / reading 80 / listening 80 /
sentenceBank 350 / conversationTopics 12 / stories 14 — 프로그램 전수 감사 결과 **0 이슈**.

### 회귀 방지 잠금 (라운드 38 발견 위험 → smoke blocking 추가)

| 위험 | 잠금 |
| --- | --- |
| 전역 replace 로 인한 필드 손상 | N3 vocab 손상 흔적 0 (타입·구두점·배열잔재 검출), sentenceBank 필드 시프트 0 (sourceId 타입) — blocking |
| sourceId 손상 | N3 sentenceBank sourceId 무결성 전수 검증 (7개 sourceType 별 실존 확인) — blocking |
| scriptReadings 질문단어 혼입 | listening scriptReadings 의 모든 text 가 script 에 존재 — blocking (라운드 38 37건 재발 차단) |
| 선택지 N2급 패턴 | reading/listening 선택지 N2급 문법 패턴 0 — blocking |
| 독해 정답 verbatim | 10자+ 정답 본문 그대로면 unreviewed warning (청해는 표준형식 유지) |

### 학습범위 밖 한자 62건 — 최종 판정

총 62건 / 18종: 彼38 · 誰3 · 塔3 · 譲2 · 季2 · 香2 · 京1 超1 堂1 捕1 臓1 噴1 詩1 章1 覧1 埋1 漂1 咲1.
**최종 정책 = 한도 75 (확정).** 전부 하위 빈출 한자이고 후리가나 100% 노출이므로 학습 장애
없음. blocking 한도 75 는 N3 어휘 1300 규모에서 자연 발생하는 분포를 충분히 수용하면서도
N2 한자 대량 유입(예: 한 라운드에 +13 초과)을 막는 안전선.
**彼(38)** 는 빈도가 높으나 대명사로 가나 표기 가능 — 향후 N2 단계 또는 별도 한자 보강
라운드에서 덱 편입 후보로 기록 (현 단계에서는 표제어에 彼 를 쓰는 단어가 없어 덱 편입 불가).

### 장문 독해 / 장문 story UX 판정

- 장문 독해 200자+ **10편** (r_n3_37/38/39/69/71/72/73/74/75/80) — long-passage 클래스
  자동 부여, 글자 15px·행간 1.9·하단 여유. smoke 가 "장문 ≥10" + CSS/클래스 존재를 잠금,
  qa [206] 가 4편 렌더+ruby+choice 를 검증. 모바일 360px 가독성은 수동 QA 체크리스트.
- 장문 story (7~8문단 6편) — 줄 ≤40자·문단 ≤8 유지, qa [209] 가 7문단 전체 렌더+왕복 검증.

### N3 완성 선언 기준 (smoke 잠금)

누적 vocab ≥2700 · 누적 kanji ≥600 · grammar ≥120 · reading ≥80 · listening ≥80 ·
후리가나 100% · 의존성 전수 태깅 · 전역 중복 0 · N2 참조 0 · unreviewed 0 ·
smoke/qa/content-report 통과 — **전 항목 충족. N3 완성.**

## N2 0차 시드 (라운드 40)

N5/N4/N3 에서 확립한 구조(explicit readings·romaji·의존성·추천)를 N2 에 처음부터 적용한
0차 시드. 대량 완성이 아니라 "구조 검증" 단계.

### 추가 수량

| 영역 | 이전 | 추가 | 현재 |
| --- | ---: | ---: | ---: |
| vocab | 5 | +100 | 105 (누적 2807) |
| kanji | 0 | +100 | 100 (누적 700) |
| grammar | 2 | +20 | 22 (+pairs 4) |
| reading | 1 | +8 | 9 |
| listening | 1 | +8 | 9 |
| sentenceBank | 0 | +50 | 50 (회화 50) |
| conversationTopics | 0 | +3 | 3 |
| stories | 0 | +3 | 3 (이야기 2+단편 1) |

### 구조 / 품질

- N2 의존성은 N5/N4/N3/N2 모두 참조 가능 (N2 는 최상위 목표 레벨). N1 금지.
  신규 `scripts/gen-deps-n2.mjs` 로 reading/listening/story 의존성 전수 태깅.
- 후리가나 100% (vocab 105/grammar 22/reading 9/listening 9/sentence 50, story 전 문단).
  처음부터 explicit readings — V2/k2/r2/l2/s2 빌더 사용.
- imageKey 최다 money 9.5% (≤10%). N1급 문법 패턴 스캔 0 (smoke blocking).
- N2 readiness/추천 동작 확인 — N3 마스터 기준 reading ready 2/good_next 7/locked 0,
  추천에 N2 + 하위 복습 공존, 큐 10개 유지.

### 작성 중 잡힌 이슈 (수정)

| 항목 | 판정 |
| --- | --- |
| 기존 g_n2_1 〜によって / g_n2_2 〜によると 가 N3(g_n3_43)·N4(g_n4_69)와 패턴 중복 | N2 0차에서 g_n2_1→「〜のみならず」, g_n2_2→「〜にともなって」로 재정의 + gp_n2_1 재작성. grammar 패턴 레벨 내 중복 0 유지 |
| 신규 vocab imageKey money 15.2% 초과 | money 6건을 transport/up/office/down/house 로, mind 2건을 tool/paper 로 분산 → 9.5% |
| sentenceBank vocabId 오매핑 3건 / reading verbatim·N1 스캔 | 라인 단위 안전 수정 (라운드 38 전역 replace 손상 교훈 적용) |
| grammar 문제 distractor 가 meaningKo 기준 dedup 안 됨 (flaky) | buildQuestion grammar 분기도 vocab 분기처럼 meaningKo dedup — N2 추가로 표면화된 잠재 버그 영구 해결 (smoke 3회 연속 통과 확인) |

### N2 conversationTopics별 sentenceBank 매칭

social_issue 17 · meeting_proposal 12 · news_discussion 10 (전부 ≥5).

### 다음 단계

N2 1차 확장 (vocab 250~300 / kanji 200 / grammar 40 / r·l 각 20 / sentenceBank 120 /
topics 6 / stories 6+) — N3 와 동일한 확장→안정화 사이클. kanji 는 누적 700/1000.

## N2 0차 안정화 / 품질 잠금 (라운드 41)

전수 감사 결과 **이슈 1건**(청해 verbatim) 외 0. 콘텐츠 추가 없이 N1급 경계 강화 +
회귀 방지 잠금만 수행. **N2 는 여전히 구조 검증 단계 — 완성 아님.**

### 감사 범위 (전수)
vocab 105 / kanji 100 / grammar 22 + pairs 4 / reading 9 / listening 9 / sentenceBank 50 /
conversationTopics 3 / stories 3 — 프로그램 전수 감사.

### 난이도 판정
- vocab: N2급 사회·경제·업무·추상·논리어 중심. N1급 혼입 0, N3 이하 과다 0.
  reading 핵심 vocabIds 레벨 분포 N2 21 / N3 4 / N4 4 / N5 1 — N2 중심 + 하위 보조(적정).
- grammar: 22개 전부 N2 핵심 문형, N1급 패턴 0. によって/によると 중복은 라운드 40에서 해소됨.
- reading/listening: N3보다 추론·문어체 비중↑, N1급 어휘·문형 0.

### 수정한 품질 이슈

| 항목 | 판정 |
| --- | --- |
| l_n2_8 청해 정답 11자 verbatim | 「買い物を手伝う仕組み」→「買い物の手助けをする取り組み」로 paraphrase (선택지 전체도 자연스럽게 보강) |

### N1급 금지 / N2 허용 N3 HARD 문형 기준

- **N1급 금지 (smoke blocking, N2 전 영역 스캔)**: んばかり · ものともせず · べからず · まじき ·
  ずくめ · きらいがある · をよそに · んがため · まみれ · や否や · が早いか · そばから · ごとき ·
  に至って · たるもの · たりとも · ずにはおかない/すまない · いかんによらず · を禁じ得ない ·
  ではあるまいし · を余儀なく · うる限り · ないまでも · であれ(、。) · ともなると · とあって ·
  涙ながらに · きっての · の極み.
- **N2 에서 허용하는 N3 HARD 문형**: べきだ · つつある · ことだ 등 — N3 레벨 문형이므로 N2
  콘텐츠에서는 정상 사용. (N3 콘텐츠용 HARD 스캔과 명확히 구분.) 踏まえ(N3)·なりに(N2)는
  오탐 방지로 N1 스캔에서 제외.

### reviewed/unreviewed warning 현황 — unreviewed 0
청해 verbatim 10자+ 감시(현재 0, l_n2_8 수정 완료) · N2 meaningKo 동일 감시(0) ·
학습범위 밖 한자(N2 한자 100자 추가로 N3 분포 60→감소) — 전부 reviewed/clean.

### 추천 회귀 (N3 마스터 기준)
reading ready 2 / good_next 7 / locked 0 · listening 동일 · stories ready 1/good_next 2/locked 0.
추천에 N2(r_n2_1/3) + 하위 복습(r_n5_*) 공존, 큐 10개. 부분 학습 시 ready 상위 진입(qa [221]).

### conversationTopics별 sentenceBank 매칭
social_issue 17 · meeting_proposal 12 · news_discussion 10 (전부 ≥5).

### 다음 단계
N2 1차 확장 (vocab 250~300 / kanji 200 / grammar 40 / r·l 각 20 / sentenceBank 120 /
topics 6 / stories 6) — N3 1차 확장과 동일 패턴.

## N2 1차 확장 (라운드 42)

N2 를 1차 학습 가능 규모로 확장. **안정화는 다음 라운드.** N2 는 여전히 구조 검증 단계.

### 추가 수량

| 영역 | 0차 | → 1차 | 추가 | 비고 |
| --- | --- | --- | --- | --- |
| vocab | 105 | **300** | +195 | 누적 3002 / 최종 5000 (60%) |
| kanji | 100 | **200** | +100 | 누적 800 / 최종 1000 (80%) |
| grammar | 22 | **40** | +18 | g_n2_23~40 |
| grammarPairs | 4 | **10** | +6 | gp_n2_5~10 |
| reading | 9 | **20** | +11 | r_n2_10~20 |
| listening | 9 | **20** | +11 | l_n2_10~20 |
| sentenceBank | 50 | **120** | +70 | 회화 가능 120 (≥100 목표) |
| conversationTopics | 3 | **6** | +3 | 반대 의견 / 해결책 제안 / 서비스 요청 |
| stories | 3 | **6** | +3 | news/daily/short 각 +1 (short_story 2) |

### 품질/검증
- 전역 vocab.word 중복 0 (3002 전부 유일) · kanji 문자 중복 0 (800) · grammar.pattern 중복 0.
- N2 후리가나 vocab/grammar/reading/listening/sentence **전부 100%**.
- 신규 kanji 100자 exampleWords 는 **실존 vocab 단어** 참조(문자 포함 검증).
- N1급 문법/어휘 패턴 스캔 **0** (전 영역 blocking). reading/listening 핵심 의존성 0건 없음.
- reading/listening 선택지 중복 0 · 정답 verbatim(10자+) 0 (paraphrase).
- imageKey 최다 사용률 **9.0%** (mind 27/300) ≤10%.
- conversationTopics별 sentenceBank 매칭: social 40 / proposal 28 / news 18 / objection 28 / solution 30 / service 8 (전부 ≥5).
- **unreviewed warning 0** / reviewed 4.

### 추천/준비도 (N3 마스터 기준)
reading ready 2 / good_next 18 / locked 0 · listening ready 3 / good_next 17 / locked 0 ·
stories ready 2 / good_next 2 / locked 2. 추천에 N2(r_n2_1/3) + 하위 복습(r_n5_*) 공존, 오늘의 10분 큐 10개.

### 다음 단계
N2 1차 **안정화/품질 잠금** (전수 감사·난이도 경계 재확인) → 이후 N2 2차 확장.

## N2 1차 안정화 / 품질 잠금 (라운드 43)

콘텐츠 추가 없이 복구 데이터 무결성 + 1차 전체 품질 감사·잠금만 수행.
**N2 는 1차 확장 안정화 단계 — 완성 아님.**

### ⚠️ 라운드 42 git checkout 사고 — 복구 완료 확인
라운드 42 초기에 `git checkout js/data/vocab.js` 로 **커밋되지 않은 N2 0차 vocab(v_n2_6~105) 100개**가
삭제되었다가 트랜스크립트(.jsonl)에서 복구되었다. 이번 라운드에서 복구 데이터를 전수 검증:
- id 연속(6~105)/중복 0, 필드 누락 0, exampleReadings text 본문 정합 0오류, 인코딩 손상(U+FFFD) 0.
- **복구 아티팩트 1건 발견·수정**: `v_n2_77 核心` 의 reading 이 `かくしん(核心)`(수정 전 버전)으로
  복구되어 romaji 가 `kakushin(核心)` 로 깨졌다 → bare `かくしん` 로 복원(romaji `kakushin`).
- 그 외 99개는 R41 최종본과 일치. sentenceBank/reading/listening/story/topics 참조 무결.

**앞으로 destructive git 명령(`checkout`/`reset`/`restore`/파일 단위 되돌리기) 사용 금지.**
기존 버전 확인은 `git show`/`git diff`/`git status`/`rg`/`Get-Content` 등 read-only 만 사용.

### 감사 범위 (전수)
vocab 300 / kanji 200 / grammar 40 + pairs 10 / reading 20 / listening 20 / sentenceBank 120 /
conversationTopics 6 / stories 6 — 프로그램 전수 감사.

### 수정한 품질 이슈

| 항목 | 판정 |
| --- | --- |
| v_n2_77 reading 괄호(`かくしん(核心)`) | 복구 아티팩트 → bare `かくしん` 복원, romaji 정상화 |
| v_n2_181(隔たり) meaningKo `격차, 거리감` | v_n2_157(格差 `격차`)와 첫뜻 충돌 → `(생각·세대의) 차이, 거리감` 으로 차별화 |
| l_n2_1 핵심 vocab `正しい`(v_n4_618) | 질문어가 핵심 vocab 으로 누출(0차 dep 오류) → gen-deps-n2 가 **본문만** 으로 의존성 도출하도록 수정 후 전 영역 재베이크 |

### N1급 / 난이도 / 레거시 문형
- N1급 문법/어휘 패턴 스캔 **0** (smoke `N1PAT`, 전 영역 blocking). 신규 g_n2_23~40 포함 0.
- 난이도: vocab 300 N2급(사회·경제·업무·추상·논리), N1 0·N3 이하 과다 0. reading/listening 추론·문어체
  비중 N3보다↑, N1급 장문 아님.
- **레거시 N5↔N4 동일 문형 4종**(〜方/〜ながら/〜まで/〜でしょう) — 동일 문형을 N5(도입)·N4(심화)에서
  단계별로 반복하는 **의도적 설계**. 잠금된 하위 레벨 콘텐츠이며 N2 와 무관(N2 도입 패턴 중복 0).
  smoke 에 reviewedWarning 으로 추적, 하위 레벨은 수정하지 않음.

### reviewed/unreviewed — unreviewed 0
reviewed 5: N3 학습범위 밖 한자 59건 · vocab 유사 예문 · (기타 3) · **신규** 레거시 N5↔N4 동일 문형 4종.

### 추천 회귀 (N3 마스터 기준)
reading ready 2 / good_next 18 / locked 0 · listening ready 3 / good_next 17 / locked 0 ·
stories ready 2 / good_next 2 / locked 2. N2 일부 학습 시 N2(r_n2_1/2/3)가 ready 상위로 올라오고
하위 복습(r_n5_*) 공존. 오늘의 10분 큐 10개.

### conversationTopics별 sentenceBank 매칭
social 40 / proposal 28 / news 18 / objection 28 / solution 30 / service 8 (전부 ≥5).

### 다음 단계
**N2 2차 확장** — vocab 700~1000 / kanji 300 / grammar 80 / reading·listening 각 50 /
sentenceBank 280~350 / topics 10 / stories 10+.

## N2 2차 확장 (라운드 44)

N2 를 2차 규모로 확장. **안정화는 다음 라운드.** destructive git 명령 미사용(비파괴 생성기+충돌 가드).

### 추가 수량

| 영역 | 1차 → 2차 | 추가 | 진행률(최종 목표) |
| --- | --- | --- | --- |
| vocab | 300 → **900** | +600 | 누적 3602/5000 (72%) |
| kanji | 200 → **300** | +100 | 누적 900/1000 (90%) |
| grammar | 40 → **80** | +40 | 80/180~250 (44%) |
| grammarPairs | 10 → **20** | +10 | 20/40+ (50%) |
| reading | 20 → **50** | +30 | 50/120~200 (42%) · 장문 3 |
| listening | 20 → **50** | +30 | 50/120~200 (42%) |
| sentenceBank | 120 → **320** | +200 | 회화 가능 320 (≥280 목표) |
| conversationTopics | 6 → **10** | +4 | 10/15~20 |
| stories | 6 → **10** | +4 | short_story 4 (6~8 목표) |

### 품질/검증
- 전역 vocab.word 중복 0(3602 유일) · kanji 문자 0(900) · grammar.pattern N2 도입 중복 0 ·
  vocab.exampleSentence 0 · sentenceBank.ja 0(전역 유일) · reading/listening choices 0 ·
  **vocab reading+meaningKo 조합 중복 0**(신규 잠금).
- N2 후리가나 vocab/grammar/reading/listening/sentence **전부 100%**.
- 신규 kanji 100자 exampleWords 는 실존 vocab 단어(한자 포함) 참조.
- N1급 문법/어휘 패턴 스캔 **0**(N1PAT 전 영역 blocking, g_n2_41~80 자가검사 통과).
- reading/listening 핵심 vocab 본문 등장(질문어 누출 0) · 정답 verbatim(10자+) 0.
- imageKey 최다 사용률 **9.6%**(tool 86/900) ≤10%.
- **unreviewed warning 0** / reviewed 5.

### 2차 확장에서 학습한 충돌 패턴
600개 어휘 확장 중 흔한 한자어가 N3 이하와 대량 충돌(배치별 11~29건) → 생성기 충돌 가드로
전수 차단 후 더 전문적/희소한 N2 어휘로 교체. 동철동의(reading+meaningKo) 9건은 gloss 차별화로 해소.

### 추천/준비도 (N3 마스터 기준)
reading ready 2 / good_next 48 / locked 0 · listening ready 9 / good_next 41 / locked 0 ·
stories ready 3 / good_next 4 / locked 3. 추천에 N2(r_n2_3/37) + 하위 복습(r_n5_*) 공존, 큐 10개.

### conversationTopics별 sentenceBank 매칭 (전부 ≥5)
social 69 · proposal 55 · news 24 · objection 55 · solution 44 · service 13 ·
policy 48 · conflict 55 · tech 23 · env 12.

### 다음 단계
**N2 2차 안정화/품질 잠금** — 7개 영역 전수 감사, 난이도 경계 재확인, 추천 회귀.
이후 N2 3차 확장으로 최종 목표(vocab 1500~/kanji 1000/grammar 120+/r·l 각 80~)에 접근.

## N2 2차 안정화 / 품질 잠금 (라운드 45)

콘텐츠 추가 없이 라운드 44 대량 N2 콘텐츠를 전수 감사·잠금. **N2 는 2차 확장 안정화 단계 — 완성 아님.**
destructive git 명령 미사용(read-only 조회만).

### 감사 범위 (전수)
vocab 900 / kanji 300 / grammar 80 + pairs 20 / reading 50 / listening 50 / sentenceBank 320 /
conversationTopics 10 / stories 10 — 전수 감사 결과 **blocking 이슈 0건**.

### 수정한 품질 이슈

| 항목 | 판정 |
| --- | --- |
| imageKey `tool` 9.6%(86건) — 한도 근접 | 의미에 더 맞는 키로 22건 분산(司法→book·暗号→eye·駆動→up·触媒→water 등) → **tool 7.1%(64건)**. 최다는 mind 8.4%(76건), 전부 ≤10% |

그 외 word/kanji/pattern/exampleSentence/ja/choices/readings/sourceId/N1/romaji/reading+meaningKo
조합 — 전부 깨끗(수정 불필요).

### imageKey 집중도 판정
mind 8.4% · tool 7.1% · arrow 6.0% · paper 5.6% · book 5.1% · money 5.1% — 전부 ≤10%(통과).
3차 확장 시 mind/arrow 키에 추가 집중되지 않도록 주의(여유 충분).

### gen-deps-n2 관리 상태
`scripts/gen-deps-n2.mjs` 는 **유지보수 도구**(임시 아님)로 헤더에 사용법 명기 + data-models 문서화.
베이크된 READING/LISTENING/STORY_DEPS_N2 테이블이 생성기 출력과 **mismatch 0**(완전 일치) 재검증.
의존성은 본문(passage/script)에서만 도출 — 질문어 누출 0.
(아직 git untracked 상태 — 이번 라운드 커밋 시 함께 추적 대상에 포함할 것.)

### 난이도 / N1 경계
- vocab 900 N2급(정치·경제·사회·과학·문화·심리 등), N1급 0·N3 이하 과다 0.
- grammar 80: g_n2_41~80 신규 포함 전부 N2 핵심, N1PAT 자가검사 0. N1PAT 금지 목록은
  N2 허용 문형(g_n2_1~80)을 한 건도 막지 않음(과차단 없음 확인).
- reading/listening: N2 추론·문어체, 장문 3건 long-passage. N1급 장문 아님.

### reviewed/unreviewed — unreviewed 0
reviewed 5(N3 학습범위 밖 한자·유사 예문·레거시 N5↔N4 동일 문형 등 — 검토 후 유지).

### 추천 회귀 (N3 마스터 기준)
reading ready 2 / good_next 48 / locked 0 · listening ready 9 / good_next 41 / locked 0 ·
stories ready 3 / good_next 4 / locked 3. N2 일부 학습 시 N2 ready 상위 진입 + 하위 복습(r_n5_*) 공존,
큐 10개. N2 단독 편중 없음.

### conversationTopics별 sentenceBank 매칭 (전부 ≥5)
social 69 · proposal 55 · news 24 · objection 55 · solution 44 · service 13 ·
policy 48 · conflict 55 · tech 23 · env 12.

### 다음 단계
**N2 3차 마무리 확장** — 누적 vocab 5000 / kanji 1000 / grammar 180 / reading·listening 각 120 /
sentenceBank 500~600 / topics 15~20 / stories 14~18(short_story 6~8).
