// 화면별 사용 매뉴얼(도움말 카드) — 라운드 30.
// settings.helpEnabled 가 true 일 때만 각 화면 상단에 접이식 카드로 노출.
// 장황한 설명 금지 — 화면당 2~4줄 실용 안내만.
import { getHelpEnabled } from './state.js';

const HELP = {
  home: {
    title: '시작하기',
    lines: [
      '「오늘의 10분」으로 매일 10문제를 풀어 보세요.',
      '하단 탭: 학습(분야별 공부) · 복습(틀린 것 다시) · 이야기/단편(읽기) · 우측 상단 ⚙(설정).',
    ],
  },
  study: {
    title: '학습 사용법',
    lines: [
      '① 분야(단어/문법/한자/독해/청해) → ② 난이도 → ③ 학습법 순서로 고릅니다.',
      '「찾아보기」는 목록·검색, 「이미지 카드」는 단계형 암기 학습입니다.',
    ],
  },
  vocabCard: {
    title: '이미지 카드 학습',
    lines: [
      '단계형 ON: 보기 → 회상(몇 초간 떠올리기) → 확인 → 퀴즈 순서로 진행됩니다.',
      '단계형 OFF: 단어를 한 번 본 뒤 바로 퀴즈를 풉니다.',
      '「다음 단어」는 기록 없이 건너뛰기입니다.',
    ],
  },
  grammar: {
    title: '문법 학습',
    lines: [
      '퀴즈로 문형을 익히고, 「비교」에서는 헷갈리는 문법 쌍의 차이를 확인합니다.',
    ],
  },
  readingListening: {
    title: '독해·청해',
    lines: [
      '목록의 「준비도 N%」 배지는 본문에 필요한 단어/문법을 얼마나 배웠는지입니다.',
      '준비도가 낮아도 풀 수 있지만, 먼저 관련 단어를 학습하면 더 쉽습니다.',
      '청해는 음성을 듣고 풉니다 — 음성이 없는 환경에서는 스크립트가 표시됩니다.',
    ],
  },
  review: {
    title: '복습 사용법',
    lines: [
      '「오늘 복습」은 SRS 가 고른 항목, 「실패 노트」는 틀린 문제 모음입니다.',
      '「자주 볼 단어」는 ☆ 로 저장한 단어를 다시 보는 곳입니다.',
    ],
  },
  story: {
    title: '이야기 읽기',
    lines: [
      '문장을 탭하면 그 문장만, ▶ 는 전체를 이어서 재생합니다 (속도 0.75~1.25x).',
      '색이 칠해진 단어를 누르면 뜻과 「단어 학습」 버튼이 나옵니다 — 학습 후 자동 복귀.',
    ],
  },
  conversation: {
    title: '회화 연습',
    lines: [
      '주제별 준비도와 「배운 표현」 수를 보고 시작하세요.',
      '답하면 사용한 단어/문형을 평가하고, 배운 문장 기반 모범답안을 보여 줍니다.',
    ],
  },
};

/**
 * 도움말 카드 DOM 생성 — helpEnabled OFF 또는 알 수 없는 키면 null.
 * details/summary 접이식 — 기본 접힘, 화면을 가리지 않는다.
 */
export function helpCard(screenKey) {
  if (!getHelpEnabled()) return null;
  const h = HELP[screenKey];
  if (!h) return null;
  const el = document.createElement('details');
  el.className = 'help-card';
  el.innerHTML = `
    <summary class="help-card-summary">❓ ${h.title}</summary>
    <div class="help-card-body">
      ${h.lines.map(l => `<p class="help-card-line">${l}</p>`).join('')}
    </div>
  `;
  return el;
}

export const _helpKeys = Object.keys(HELP); // smoke 검증용
