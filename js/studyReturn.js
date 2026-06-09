// 스토리 → 단어/문법 학습 → 스토리 복귀 동선용 보조.
//
// 사용:
//   storyView 가 단어/문법 학습 라우트로 navigate 하기 전에 setStudyReturnRoute('story/<id>') 를 호출.
//   study.js 의 startSingleVocabCard / startSingleGrammar 가 peekStudyReturnRoute() 를 읽어
//   "← 이야기로 돌아가기" 버튼을 화면 상단에 표시.
//   사용자가 그 버튼을 누르면 consumeStudyReturnRoute() 로 한 번 꺼낸 뒤 navigate.
//
// 정책:
//   - 오늘의 10분 / 학습 랜딩 / browse 모드 등 일반 동선은 이 값을 사용하지 않는다.
//   - drawLanding 진입 시 / 카드 학습이 onNext 로 종료될 때 자동 clearStudyReturnRoute() 호출.
//   - 깨진/빈 returnRoute 는 무시.

let returnRoute = null;

export function setStudyReturnRoute(route) {
  if (typeof route === 'string' && route.length > 0) returnRoute = route;
}
export function peekStudyReturnRoute() { return returnRoute; }
export function consumeStudyReturnRoute() {
  const r = returnRoute;
  returnRoute = null;
  return r;
}
export function clearStudyReturnRoute() { returnRoute = null; }
