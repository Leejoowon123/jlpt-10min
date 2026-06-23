// Capacitor webDir 빌드 — 정적 앱(빌드 단계 없음)을 www/ 로 복사.
// Capacitor 가 webDir(www) 내용을 android/app/src/main/assets/public 으로 동기화한다.
// 루트 전체를 webDir 로 쓰면 node_modules/android/docs 까지 들어가므로, 필요한 자산만 www/ 로 추린다.
// 실행: node tools/build-www.mjs  (npm run cap:copy 로도 호출)
import { rmSync, mkdirSync, cpSync, existsSync, readdirSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const WWW = new URL('../www/', import.meta.url);

// 앱 실행에 필요한 정적 자산만 — GitHub Pages 와 동일 상대경로 구조 유지.
const FILES = ['index.html', 'privacy.html', 'styles.css', 'manifest.json', 'service-worker.js'];
const DIRS = ['js', 'data', 'assets'];

// www 초기화(이전 산출물 제거 — 안전: www 는 빌드 산출물 전용, .gitignore 됨)
rmSync(WWW, { recursive: true, force: true });
mkdirSync(WWW, { recursive: true });

let copied = 0;
for (const f of FILES) {
  const src = new URL(f, ROOT);
  if (!existsSync(src)) { console.warn('skip(없음):', f); continue; }
  cpSync(src, new URL(f, WWW));
  copied++;
}
for (const d of DIRS) {
  const src = new URL(d + '/', ROOT);
  if (!existsSync(src)) { console.warn('skip(없음):', d); continue; }
  cpSync(src, new URL(d + '/', WWW), { recursive: true });
  copied++;
}

// 검증 — 필수 진입 파일/디렉터리 존재
const must = ['index.html', 'js', 'data', 'assets', 'manifest.json', 'service-worker.js', 'styles.css'];
const missing = must.filter(m => !existsSync(new URL(m, WWW)));
if (missing.length) { console.error('FAIL: www 누락', missing); process.exit(1); }

const top = readdirSync(WWW);
console.log('www/ 빌드 완료 —', copied, '항목 복사. 최상위:', top.join(', '));
