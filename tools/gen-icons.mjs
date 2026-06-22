// PWA 아이콘 생성기 — 순수 Node(zlib)로 PNG 인코딩. 외부 라이브러리/API 없음.
// 디자인: 네이비(#0f172a) 배경 + 흰 원(학습 타깃) + 빨간 점(일본어 느낌, 국기 아님).
// 출력: assets/icons/icon-{192,512}.png + icon-{192,512}-maskable.png
// 재실행: node tools/gen-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

// JLPT10M 브랜드 아이콘 — 먹(ink) 배경 + 종이(washi) 원 + 주홍(vermilion) 점 (印/seal 느낌).
// 공식 JLPT/일본 국기/후지산/벚꽃 사용 안 함 — 추상 도형만.
const BG = [27, 24, 21, 255];       // #1b1815 먹색
const WHITE = [241, 232, 214, 255]; // #f1e8d6 종이
const RED = [216, 67, 46, 255];     // #d8432e 주홍
const CLEAR = [0, 0, 0, 0];

function lerp(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)); }

// (fx,fy) 한 점의 색 — maskable 여부에 따라 안전영역/모서리 처리.
function colorAt(fx, fy, S, maskable) {
  const cx = S / 2, cy = S / 2;
  const d = Math.hypot(fx - cx, fy - cy);
  const whiteR = S * (maskable ? 0.27 : 0.33);
  const discR = S * (maskable ? 0.15 : 0.18);
  // 비-maskable: 둥근 모서리 바깥은 투명(OS 마스킹 없이도 아이콘 모양)
  if (!maskable) {
    const cr = S * 0.22;
    const inX = Math.min(fx, S - fx), inY = Math.min(fy, S - fy);
    if (inX < cr && inY < cr) {
      const cd = Math.hypot(cr - inX, cr - inY);
      if (cd > cr) return CLEAR;
    }
  }
  if (d <= discR) return RED;
  if (d <= whiteR) return WHITE;
  return maskable ? BG : BG;
}

// 2x2 슈퍼샘플로 부드러운 경계.
function pixel(px, py, S, maskable) {
  let r = 0, g = 0, b = 0, a = 0;
  for (const ox of [0.25, 0.75]) for (const oy of [0.25, 0.75]) {
    const c = colorAt(px + ox, py + oy, S, maskable);
    r += c[0]; g += c[1]; b += c[2]; a += c[3];
  }
  return [Math.round(r / 4), Math.round(g / 4), Math.round(b / 4), Math.round(a / 4)];
}

// ── PNG 인코딩 (color type 6 = RGBA, 8-bit) ──
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(S, maskable) {
  const raw = Buffer.alloc(S * (S * 4 + 1));
  let o = 0;
  for (let y = 0; y < S; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < S; x++) {
      const p = pixel(x, y, S, maskable);
      raw[o++] = p[0]; raw[o++] = p[1]; raw[o++] = p[2]; raw[o++] = p[3];
    }
  }
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(S, 0); ihdr.writeUInt32BE(S, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync(new URL('../assets/icons/', import.meta.url), { recursive: true });
const out = (name) => new URL(`../assets/icons/${name}`, import.meta.url);
const jobs = [
  ['icon-192.png', 192, false],
  ['icon-512.png', 512, false],
  ['icon-192-maskable.png', 192, true],
  ['icon-512-maskable.png', 512, true],
];
for (const [name, S, maskable] of jobs) {
  writeFileSync(out(name), encodePNG(S, maskable));
  console.log('wrote', name, `(${S}px${maskable ? ', maskable' : ''})`);
}
console.log('done.');
