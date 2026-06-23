// release 서명 주입 — Option B(android/ 미커밋, CI 가 cap add 로 매번 생성)에서
// 생성된 android/app/build.gradle 에 signingConfigs.release 를 멱등하게 주입한다.
//
// 비밀값은 코드/저장소에 넣지 않는다 — CI 가 android/key.properties(secrets 기반) 를 만들고,
// build.gradle 은 그 파일을 읽도록 패치한다. keystore 자체는 android/app/release.keystore 로 복원한다.
//
// 실행: node tools/inject-signing.mjs   (android-release.yml 의 cap sync 이후 단계에서 호출)
// 멱등: 이미 주입돼 있으면 아무것도 하지 않는다.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const GRADLE = new URL('../android/app/build.gradle', import.meta.url);
if (!existsSync(GRADLE)) {
  console.error('inject-signing: android/app/build.gradle 없음 — cap add/sync 먼저 실행해야 함');
  process.exit(1);
}

let src = readFileSync(GRADLE, 'utf8');

if (src.includes('signingConfigs.release')) {
  console.log('inject-signing: 이미 주입됨 — skip');
  process.exit(0);
}

// 1) android { 바로 뒤에 signingConfigs 블록 삽입. key.properties(rootProject=android/)를 읽어 적용.
const SIGNING_BLOCK = `
    signingConfigs {
        release {
            def kpFile = rootProject.file("key.properties")
            if (kpFile.exists()) {
                def kp = new Properties()
                kpFile.withInputStream { kp.load(it) }
                storeFile file(kp['storeFile'])
                storePassword kp['storePassword']
                keyAlias kp['keyAlias']
                keyPassword kp['keyPassword']
            }
        }
    }
`;

const androidIdx = src.search(/\bandroid\s*\{/);
if (androidIdx === -1) {
  console.error('inject-signing: android { 블록을 찾지 못함');
  process.exit(1);
}
const braceIdx = src.indexOf('{', androidIdx);
src = src.slice(0, braceIdx + 1) + SIGNING_BLOCK + src.slice(braceIdx + 1);

// 2) buildTypes { ... release { ... } 에 signingConfig 적용.
//    release { 바로 뒤에 한 줄 삽입(중복 방지는 위 signingConfigs.release 가드로 충분).
const relMatch = src.match(/buildTypes\s*\{[\s\S]*?release\s*\{/);
if (relMatch) {
  const insertAt = relMatch.index + relMatch[0].length;
  src = src.slice(0, insertAt) + `\n            signingConfig signingConfigs.release` + src.slice(insertAt);
} else {
  // buildTypes/release 가 없으면 buildTypes 자체를 추가(드묾 — 방어적).
  const closeIdx = src.lastIndexOf('}');
  src = src.slice(0, closeIdx) + `
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
` + src.slice(closeIdx);
}

writeFileSync(GRADLE, src);
console.log('inject-signing: signingConfigs.release 주입 완료');
