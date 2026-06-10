# QA / 리뷰 가이드

테스트 체계와 코드 리뷰 포인트의 source of truth.

## 테스트 3층 구조

| 층 | 명령 | 역할 |
| --- | --- | --- |
| smoke | `node smoke.mjs` | 데이터 무결성·참조 검증·후리가나 커버율·정적 검사·보안 패턴 스캔 |
| qa | `node qa.mjs` | jsdom 기반 DOM 시나리오 (139개 시나리오 / 670+ 어서션) — 화면 마운트·클릭·정답 누출 방지 회귀 |
| 수동 | [browser-qa-checklist.md](./browser-qa-checklist.md) | jsdom 이 못 보는 것: 실제 TTS/STT, 레이아웃, 테마 색 대비, Firebase 실연결 |

CI: PR → main / push → main 에서 smoke+qa 자동 실행 ([development-workflow.md](./development-workflow.md)).

## 브라우저 수동 QA 가 필요한 이유

- jsdom 은 utterance `onend` 를 fire 하지 않음 → 연속 재생/700ms pause 는 실기기 확인.
- 레이아웃 미실행 → 360px overflow/겹침은 체크리스트로.
- CDN ESM(Firebase) 로드 불가 → 연결 상태 배지·로그 테스트 버튼은 실브라우저에서.

## 리뷰(Codex 등) 시 특히 볼 부분


1. **선택 전 해설 누출 없음** — [questionView.js](../js/views/questionView.js) 의 `result` div 가 비어 있다가 `onPick()` 후에만 채워짐. context.ko / mnemonic / explanation 어디에도 답이 미리 노출되지 않는지. smoke 가 자동 검증.
2. **SRS ↔ 실패 노트 일관성** — [srs.js#recordResult](../js/srs.js) 가 같은 `update()` 안에서 둘을 같이 갱신. 정답 후 실패 노트 자동 제거는 안 함(사용자가 ✓로 직접 해소 — README 의도 명시).
3. **TTS 폴백 2중망** — `ttsAvailable()` 동기 + `hasJaVoice()` 비동기 + `speak()` 재시도. 위 표 참조.
4. **커리큘럼 채움** — 2차 `fillers` + 3차 `finalFillers` 가 빈 슬롯을 메우는지. 콜드스타트 10/10 확인은 smoke 통과.
5. **markStudiedToday 호출 시점** — `today.js` 는 **호출하지 않음**(import도 없음). `questionView.js#onPick` 과 `grammarCompare.js#pick` 의 답 제출 시점에서만 호출.
6. **자주 볼 단어 vocab 한정** — UI(`questionView` favBtn), 큐레이션(`pickFavorite`), 복습 탭(`favoritesList`) 모두에서 일관되게 vocab 필터.
7. **레벨 필터** — `curriculum.js#byLevelOrEasier` 가 목표 레벨 **이하**까지 포함. `study.js`/`compare.js` chip 은 정확히 한 레벨.
8. **XSS** — 모든 콘텐츠는 [ui.js#escape](../js/ui.js) / [mnemonic.js#escapeXml](../js/mnemonic.js) 통과. innerHTML 사용 위치들이 동적 입력을 escape 하는지.
9. **모바일 폭** — `.app { max-width:480px }`, 탭바 fixed + transform 중앙. `.row .main .t` 가 `flex-wrap:wrap`+`word-break:keep-all` 로 일본어 길이 폭주 방지.


## 회귀 위험 영역 (변경 시 반드시 qa 재실행)

- **정답 누출 방지** — 선택 전 meaningKo/번역/연상 DOM 부재 (qa 1,7,33,40 등)
- **이미지 카드 단계형** — 학습 기록은 quiz 답변 시점에만 (smoke 정적 + qa 48–56)
- **스토리 플레이어 타이머** — pause timer cleanup / route 이동 시 stopStoryAudio (qa 84,96)
- **storyProgress 객체 aliasing** — getStoryProgress 는 live 객체 반환 (라운드 19 버그 사례)
- **module-level 상태** — storyView listState / study currentMethod 등은 시나리오 간 sticky
- **contentRepository overrides** — reset 세대(generation) 가드
- **actionLogger** — fire-and-forget 격리: 실패가 recordResult/markStudiedToday 를 막으면 안 됨

## PR 체크리스트

- [ ] `node smoke.mjs` 통과
- [ ] `node qa.mjs` 통과
- [ ] 새 데이터에 readings/bodyRomaji 등 필수 필드 (smoke 가 잡지만 사전 확인)
- [ ] 새 이미지는 [asset-licenses.md](./asset-licenses.md) 기록
- [ ] 비밀키/서비스 계정 미포함
- [ ] UI 변경 시 [browser-qa-checklist.md](./browser-qa-checklist.md) 해당 섹션 갱신
