// JLPT 레벨별 권장 학습 목표치.
//
// 주의: JLPT 공식은 어휘/한자/문법 목록을 확정 공개하지 않는다.
// 본 파일의 수치는 일반적으로 통용되는 권장 누적 학습량을 본 앱의 *목표치* 로
// 채택한 값이다. "공식 시험 범위" 가 아님을 README 와 화면 안내에서 명시한다.
//
// 누적 어휘/한자 = 해당 레벨까지 누적해야 한다고 알려진 양.
// 영역별 콘텐츠(문법/독해/청해) 는 학습 분량 권장 범위 (min~max).

export const levelTargets = [
  {
    level: 'N5',
    targetVocab: 500,
    targetKanji: 100,
    targetGrammarMin: 40, targetGrammarMax: 60,
    targetReadingMin:  40, targetReadingMax:  60,
    targetListeningMin: 40, targetListeningMax: 60,
    descriptionKo: '기초적인 일본어. 히라가나·가타카나와 기본 한자, 짧고 단순한 문장·인사말 이해.',
  },
  {
    level: 'N4',
    targetVocab: 1400,   // 누적
    targetKanji: 300,    // 누적
    targetGrammarMin: 80, targetGrammarMax: 120,
    targetReadingMin: 60, targetReadingMax: 100,
    targetListeningMin: 60, targetListeningMax: 100,
    descriptionKo: '기본적인 일본어. 일상 화제의 짧은 문장과 일반적 회화 이해.',
  },
  {
    level: 'N3',
    targetVocab: 2700,   // 누적
    targetKanji: 600,    // 누적
    targetGrammarMin: 120, targetGrammarMax: 180,
    targetReadingMin:  80, targetReadingMax:  140,
    targetListeningMin: 80, targetListeningMax: 140,
    descriptionKo: '일상적 화제의 자연스러운 일본어 이해. N4·N2 사이의 가교 단계.',
  },
  {
    level: 'N2',
    targetVocab: 5000,   // 누적
    targetKanji: 1000,   // 누적
    targetGrammarMin: 180, targetGrammarMax: 250,
    targetReadingMin:  120, targetReadingMax:  200,
    targetListeningMin: 120, targetListeningMax: 200,
    descriptionKo: '폭넓은 화제의 일본어 이해. 신문 기사·일반적인 글을 비교적 잘 이해.',
  },
];

/** 레벨로 목표치 찾기. 없으면 null. */
export function targetFor(level) {
  return levelTargets.find(t => t.level === level) || null;
}
