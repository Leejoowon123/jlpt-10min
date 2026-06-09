# N5 콘텐츠 확장 — 완료 기록 + 다음 라운드

본 문서는 N5 콘텐츠 라운드의 **완료 기록** 과 **다음 단계** 만 유지한다.
상세 카테고리 분배·작성 원칙은 [content-authoring-guide.md](./content-authoring-guide.md) 참조.
전체 로드맵은 [next-roadmap.md](./next-roadmap.md) 참조.

---

## 현재 상태 (N5 대량1차 완료)

| 영역 | 현재 | 다음 (N5 대량2차) | 권장 학습량 |
| --- | --- | --- | --- |
| 단어 | **250** | 500 | 500 |
| 문법 | **45** | 60 | 40~60 |
| 독해 | **25** | 50 | 40~60 |
| 청해 | **25** | 50 | 40~60 |
| 회화 주제 | **10** | 15+ | — |
| 문법 비교 페어 | 8 | 15+ | — |
| sentenceBank (N5) | **150** | 300+ | — |
| mnemonic palette imageKey | 185+ | 220+ | — |

`smoke.mjs` 가 현재 임계치 (단어 250 / 문법 45 / 독해·청해 25 / 회화 10 / sentenceBank 150 / unique imageKey 110 / max share ≤8%) 를 매 실행 시 강제.

---

## 완료 라운드 기록

| 라운드 | 상태 | 결과 |
| --- | --- | --- |
| 1차 (초기) | ✅ | 단어 61 / 문법 21 / 독해·청해 8 / sentenceBank 50 |
| 2.1 | ✅ | 단어 101 / 문법 31 / 독해·청해 12 / sentenceBank 70 (+40 vocab / +10 grammar / +4 reading / +4 listening / +20 sentence) |
| 2.2 | ✅ | 단어 130 / 문법 35 / 독해·청해 16 / sentenceBank 85 (+29 vocab / +4 grammar / +4 reading / +4 listening / +15 sentence) |
| 대량1차 | ✅ | 단어 **250** / 문법 **45** / 독해·청해 **25** / 회화 주제 **10** / sentenceBank **150** (+120 vocab / +10 grammar / +9 reading / +9 listening / +4 conv / +65 sentence + mnemonic palette +90 imageKey) |

### 회화 주제별 relatedSentenceCount (대량1차 후)

```
conv_n5_self_intro       47
conv_n5_family           48
conv_n5_cafe             38
conv_n5_directions       29
conv_n5_appointment      27
conv_n5_weather_routine  55
conv_n5_school_life      78   (신규)
conv_n5_shopping         73   (신규)
conv_n5_phone            22   (신규)
conv_n5_hospital         56   (신규)
```

### N5 imageKey 분포 (대량1차 후)

```
N5 vocab: 250
unique imageKey: 185
duplicate groups (≥2): 35
words in dup groups: 100
duplicate beyond first: 65
max share: family 8 (3.2%) — ≤8% 임계치 통과

TOP 5 (다음 확장 시 피해야 할 키): family · time · person · arrow · food
```

---

## ⏭ 다음 라운드 — N5 대량 2차 (250 → 500)

권장 학습량 (어휘 500 / 문법 60) 까지 마지막 단계.

**임계치 (smoke 상향 예정)**

| 영역 | 현재 | 2차 목표 | 추가량 |
| --- | --- | --- | --- |
| 단어 | 250 | **500** | +250 |
| 문법 | 45 | **60** | +15 |
| 독해 | 25 | **50** | +25 |
| 청해 | 25 | **50** | +25 |
| 회화 주제 | 10 | **15+** | +5 (직장·여행·집안일·자연·취미 심화) |
| sentenceBank | 150 | **300+** | +150 |
| mnemonic palette | 185+ | **220+** | +35 |

**작성 제약 (대량1차에서 유지)**
- 새 단어는 family/time/person/arrow/food 등 상위 키 회피 — `mnemonic.js` 신규 키 또는 저빈도 키 우선.
- max imageKey share ≤ 8% 유지.
- sentenceBank ↔ 회화 주제 매칭 ≥ 5/주제 유지.
- 모든 추가 문장은 기존 또는 추가 vocab/grammar/conv 위에서만.

**작업 순서 권장**
1. mnemonic.js 신규 imageKey ~35개 추가 (분야: 가족 확장 / 직장 / 여행 / 집안일 / 추상 개념 / 동사 활용형 등)
2. vocab +250 — 카테고리별 다양화. 카테고리 분배는 [content-authoring-guide](./content-authoring-guide.md) N5 카테고리 가이드 참조.
3. grammar +15 — 〜たり〜たり / 〜なくてもいい(이미 N4) 등 N5 영역 검토.
4. reading +25 / listening +25 — 학교·직장·가족·여행·병원·기상·일상 다양화.
5. conversationTopics +5 — 직장 인사·여행·집안일·취미 심화·이벤트 초대 등.
6. sentenceBank +150.
7. smoke 임계치 상향 → 실행 → 모두 통과 확인.
8. qa.mjs 회귀 + [browser-qa-checklist](./browser-qa-checklist.md) 점검.

---

## 이후 단계 (간략)

전체 로드맵은 [next-roadmap.md](./next-roadmap.md) 참조:

3. **한자 데이터 모델 도입** — `KanjiItem` + 한자 카드 학습 모드
4. **N4 1차 확장** — N5 1차 임계치 패턴 재사용 (어휘 60+ / 문법 20+ 등)
5. **N3 / N2 확장**
6. **모바일 앱 전환 검토**
