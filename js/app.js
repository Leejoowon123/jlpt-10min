// 엔트리. 라우터 등록 + 레벨 칩 + 첫 화면.
import { register, start, navigate } from './router.js';
import { renderHome } from './views/home.js';
import { renderToday } from './views/today.js';
import { renderStudy } from './views/study.js';
import { renderReview } from './views/review.js';
import { renderCompare } from './views/grammarCompare.js';
import { renderConversation } from './views/conversation.js';
import { renderStories, renderNovels, renderStoryDetail } from './views/storyView.js';
import { renderSettings } from './views/settings.js';
import { renderLevelPill } from './ui.js';
import { initTheme } from './theme.js';
import { logAction } from './actionLogger.js';

// 주요 탭
register('home',         renderHome);
register('study',        renderStudy);
register('review',       renderReview);
register('stories',      renderStories);
register('novels',       renderNovels);

// 보조/하위 라우트
register('today',        renderToday);              // 홈 시작 버튼 → 오늘의 10분
register('settings',     renderSettings);           // 톱니바퀴 진입
register('story',        renderStoryDetail);        // #story/<id>
register('compare',      renderCompare);            // #study/grammar/compare 가 navigate('compare') 함
register('conversation', renderConversation);       // 직접 라우트만 (탭에서는 제거)

initTheme();          // 테마 동적 전환 + system 모드 OS 변경 감지
logAction('app_open');   // 하루 1회만 기록 (actionLogger 내부에서 제한)
renderLevelPill();
// 톱니바퀴 → 설정
const gear = document.getElementById('settingsBtn');
if (gear) gear.addEventListener('click', () => navigate('settings'));
start();
