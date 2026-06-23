// Android 런처 아이콘 주입 — Option B(android/ 미커밋)에서 생성된 프로젝트의
// 기본 Capacitor 아이콘을 JLPT10M 브랜드 아이콘(assets/icons/*)으로 교체한다.
//
// 방식(경량 — 추가 네이티브 툴 없이): 각 mipmap 밀도 폴더의
//   ic_launcher.png / ic_launcher_round.png  ← assets/icons/icon-512.png (전체 아이콘)
//   ic_launcher_foreground.png               ← assets/icons/icon-512-maskable.png (안전영역 패딩 버전)
// 로 덮어쓴다. Android 가 밀도별로 스케일하며, adaptive(v26)는 foreground PNG 를 사용한다.
// (밀도별 최적 리사이즈가 필요하면 @capacitor/assets 도입 — docs/android-release.md 참조.)
//
// 실행: node tools/inject-android-icons.mjs   (android-release.yml 의 cap sync 이후)
import { readdirSync, copyFileSync, existsSync, statSync } from 'node:fs';

const RES = new URL('../android/app/src/main/res/', import.meta.url);
const ICON = new URL('../assets/icons/icon-512.png', import.meta.url);
const ICON_FG = new URL('../assets/icons/icon-512-maskable.png', import.meta.url);

if (!existsSync(RES)) {
  console.error('inject-android-icons: android/app/src/main/res 없음 — cap add/sync 먼저 실행하세요.');
  process.exit(1);
}
if (!existsSync(ICON)) {
  console.error('inject-android-icons: assets/icons/icon-512.png 없음.');
  process.exit(1);
}
const fgSrc = existsSync(ICON_FG) ? ICON_FG : ICON;   // maskable 없으면 일반 아이콘으로 폴백

let replaced = 0;
for (const dir of readdirSync(RES)) {
  if (!/^mipmap-(m|h|xh|xxh|xxxh)dpi$/.test(dir)) continue;   // 밀도 폴더만(anydpi-v26 xml 은 그대로 둠)
  const dirUrl = new URL(`${dir}/`, RES);
  try { if (!statSync(dirUrl).isDirectory()) continue; } catch { continue; }
  const map = [
    ['ic_launcher.png', ICON],
    ['ic_launcher_round.png', ICON],
    ['ic_launcher_foreground.png', fgSrc],
  ];
  for (const [name, src] of map) {
    const dest = new URL(name, dirUrl);
    if (existsSync(dest)) { copyFileSync(src, dest); replaced++; }
  }
}

if (replaced === 0) {
  console.warn('inject-android-icons: ⚠ 교체된 아이콘이 없습니다(생성 구조 변경 가능 — 확인 필요).');
} else {
  console.log(`inject-android-icons: ${replaced}개 런처 아이콘 파일을 JLPT10M 아이콘으로 교체 완료.`);
}
