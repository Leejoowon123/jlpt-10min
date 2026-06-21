// 레벨별 vocab JSON 추출기 — js/data/vocab.js(단일 진실원)에서 data/<level>/vocab.json 생성.
// 스키마/필드/순서 그대로 분리. drift 는 smoke.mjs 가 매 실행 검증.
// 재생성: node tools/gen-vocab-json.mjs
import { vocab } from '../js/data/vocab.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const LEVELS = ['N5', 'N4', 'N3', 'N2'];
let total = 0;
for (const lv of LEVELS) {
  const items = vocab.filter(v => v.level === lv);   // filter 는 원본 순서 보존
  const dir = new URL(`../data/${lv.toLowerCase()}/`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  const out = new URL(`vocab.json`, dir);
  // 2-space pretty — diff 가독성. 필드/값은 원본 그대로(JSON.stringify 가 동일 직렬화).
  writeFileSync(out, JSON.stringify(items, null, 2) + '\n', 'utf-8');
  console.log(`data/${lv.toLowerCase()}/vocab.json  ${items.length} items`);
  total += items.length;
}
console.log(`total ${total} (js vocab.length=${vocab.length})`);
if (total !== vocab.length) { console.error('MISMATCH: 레벨 합계 != 전체'); process.exit(1); }
console.log('done.');
