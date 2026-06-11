// 단어 연상용 SVG 이미지 동적 생성. imageKey 별 색/이모지/도형.
// 유료 이미지 생성 API 미사용. 모든 그림은 인라인 SVG.
//
// 이미지 다양성 — N5 단어가 늘어남에 따라 같은 imageKey가 과도하게 반복되지 않도록
// 카테고리/의미별로 80여 종의 키를 제공한다. 모자란 키는 default 로 폴백.

const PALETTE = {
  // ── 기본 카테고리 (유지) ─────────────────────────────────────────────
  food:     { bg:'#fde68a', fg:'#92400e', ic:'🍙' },
  drink:    { bg:'#bae6fd', fg:'#075985', ic:'🥤' },
  school:   { bg:'#c4b5fd', fg:'#312e81', ic:'🎒' },
  book:     { bg:'#fecaca', fg:'#7f1d1d', ic:'📖' },
  arrow:    { bg:'#a7f3d0', fg:'#064e3b', ic:'➡️' },
  eye:      { bg:'#fbcfe8', fg:'#831843', ic:'👁️' },
  water:    { bg:'#bfdbfe', fg:'#1e3a8a', ic:'💧' },
  time:     { bg:'#e9d5ff', fg:'#4c1d95', ic:'⏰' },
  person:   { bg:'#fed7aa', fg:'#7c2d12', ic:'🧑' },
  transport:{ bg:'#a5f3fc', fg:'#155e75', ic:'🚆' },
  money:    { bg:'#bbf7d0', fg:'#14532d', ic:'💴' },
  mountain: { bg:'#d9f99d', fg:'#365314', ic:'⛰️' },
  sparkle:  { bg:'#fef08a', fg:'#713f12', ic:'✨' },
  weather:  { bg:'#c7d2fe', fg:'#312e81', ic:'☔' },
  mind:     { bg:'#fbcfe8', fg:'#831843', ic:'💭' },
  map:      { bg:'#fde68a', fg:'#78350f', ic:'🗺️' },
  house:    { bg:'#fcd34d', fg:'#78350f', ic:'🏠' },
  animal:   { bg:'#fecaca', fg:'#7f1d1d', ic:'🐾' },

  // ── 가족·인사·감정 ────────────────────────────────────────────────
  family:    { bg:'#fed7aa', fg:'#7c2d12', ic:'👨‍👩‍👧' },
  thanks:    { bg:'#fbcfe8', fg:'#831843', ic:'🙏' },
  apology:   { bg:'#fdba74', fg:'#9a3412', ic:'🙇' },
  health:    { bg:'#bbf7d0', fg:'#14532d', ic:'💪' },

  // ── 달력/요일 — 각 요일 고유 색·아이콘 ─────────────────────────────
  calendar:  { bg:'#e9d5ff', fg:'#4c1d95', ic:'📅' },
  mon:       { bg:'#ddd6fe', fg:'#3730a3', ic:'🌙' },   // 月 (moon)
  tue:       { bg:'#fecaca', fg:'#991b1b', ic:'🔥' },   // 火 (fire)
  wed:       { bg:'#bfdbfe', fg:'#1e3a8a', ic:'💧' },   // 水 (water)
  thu:       { bg:'#bbf7d0', fg:'#14532d', ic:'🌳' },   // 木 (wood)
  fri:       { bg:'#fcd34d', fg:'#78350f', ic:'💰' },   // 金 (gold)
  sat:       { bg:'#d6d3d1', fg:'#44403c', ic:'🪨' },   // 土 (earth)
  sun:       { bg:'#fde68a', fg:'#92400e', ic:'☀️' },   // 日 (sun)

  // ── 시간대·계절 ───────────────────────────────────────────────────
  morning:   { bg:'#fed7aa', fg:'#7c2d12', ic:'🌅' },
  night:     { bg:'#c4b5fd', fg:'#312e81', ic:'🌃' },
  summer:    { bg:'#fcd34d', fg:'#78350f', ic:'🏖️' },
  winter:    { bg:'#bfdbfe', fg:'#1e3a8a', ic:'⛄' },
  snow:      { bg:'#e0f2fe', fg:'#0c4a6e', ic:'❄️' },

  // ── 자연/동물 ─────────────────────────────────────────────────────
  sea:       { bg:'#a5f3fc', fg:'#155e75', ic:'🌊' },
  river:     { bg:'#bae6fd', fg:'#075985', ic:'🏞️' },
  flower:    { bg:'#fbcfe8', fg:'#831843', ic:'🌸' },
  dog:       { bg:'#fed7aa', fg:'#7c2d12', ic:'🐕' },
  cat:       { bg:'#fce7f3', fg:'#831843', ic:'🐈' },

  // ── 음식 디테일 ───────────────────────────────────────────────────
  rice:      { bg:'#fef3c7', fg:'#92400e', ic:'🍚' },
  meat:      { bg:'#fecaca', fg:'#7f1d1d', ic:'🍖' },
  vegetable: { bg:'#bbf7d0', fg:'#14532d', ic:'🥦' },
  fruit:     { bg:'#fed7aa', fg:'#7c2d12', ic:'🍎' },
  tea:       { bg:'#a7f3d0', fg:'#14532d', ic:'🍵' },
  bread:     { bg:'#fde68a', fg:'#92400e', ic:'🥖' },
  coffee:    { bg:'#fde68a', fg:'#78350f', ic:'☕' },
  yummy:     { bg:'#fde68a', fg:'#92400e', ic:'😋' },

  // ── 장소·이동 ─────────────────────────────────────────────────────
  shop:      { bg:'#fde68a', fg:'#92400e', ic:'🏪' },
  shopping:  { bg:'#fbcfe8', fg:'#831843', ic:'🛍️' },
  station:   { bg:'#a5f3fc', fg:'#155e75', ic:'🚉' },
  train:     { bg:'#bae6fd', fg:'#075985', ic:'🚆' },
  car:       { bg:'#e9d5ff', fg:'#4c1d95', ic:'🚗' },
  hospital:  { bg:'#fecaca', fg:'#7f1d1d', ic:'🏥' },
  park:      { bg:'#bbf7d0', fg:'#14532d', ic:'🌳' },
  library:   { bg:'#fecaca', fg:'#7f1d1d', ic:'📚' },
  toilet:    { bg:'#e0f2fe', fg:'#0c4a6e', ic:'🚽' },
  room:      { bg:'#fcd34d', fg:'#78350f', ic:'🚪' },
  yen:       { bg:'#fde68a', fg:'#78350f', ic:'💴' },

  // ── 학습 ───────────────────────────────────────────────────────────
  classroom: { bg:'#ddd6fe', fg:'#3730a3', ic:'🏫' },
  exam:      { bg:'#fcd34d', fg:'#78350f', ic:'📝' },
  homework:  { bg:'#bbf7d0', fg:'#14532d', ic:'📓' },
  study:     { bg:'#c4b5fd', fg:'#312e81', ic:'📚' },

  // ── 행동/동사 ─────────────────────────────────────────────────────
  read:      { bg:'#fecaca', fg:'#7f1d1d', ic:'📖' },
  write:     { bg:'#bbf7d0', fg:'#14532d', ic:'✏️' },
  listen:    { bg:'#fbcfe8', fg:'#831843', ic:'👂' },
  speak:     { bg:'#fed7aa', fg:'#7c2d12', ic:'🗣️' },
  sleep:     { bg:'#c4b5fd', fg:'#312e81', ic:'😴' },
  wake:      { bg:'#fcd34d', fg:'#78350f', ic:'⏰' },
  return:    { bg:'#a7f3d0', fg:'#064e3b', ic:'🔄' },
  photo:     { bg:'#cbd5e1', fg:'#0f172a', ic:'📷' },
  movie:     { bg:'#d4d4d4', fg:'#0f172a', ic:'🎬' },
  music:     { bg:'#fbcfe8', fg:'#831843', ic:'🎵' },
  travel:    { bg:'#bae6fd', fg:'#075985', ic:'✈️' },
  walk:      { bg:'#bbf7d0', fg:'#14532d', ic:'🚶' },
  do:        { bg:'#e9d5ff', fg:'#4c1d95', ic:'💫' },
  use:       { bg:'#fde68a', fg:'#78350f', ic:'🛠️' },

  // ── 형용사 ────────────────────────────────────────────────────────
  big:       { bg:'#d9f99d', fg:'#365314', ic:'🏔️' },
  small:     { bg:'#fbcfe8', fg:'#831843', ic:'🔬' },
  hot:       { bg:'#fecaca', fg:'#7f1d1d', ic:'🥵' },
  cold:      { bg:'#bfdbfe', fg:'#1e3a8a', ic:'🥶' },
  new:       { bg:'#fef08a', fg:'#713f12', ic:'🆕' },
  good:      { bg:'#bbf7d0', fg:'#14532d', ic:'👍' },
  bright:    { bg:'#fde68a', fg:'#92400e', ic:'💡' },
  heavy:     { bg:'#cbd5e1', fg:'#0f172a', ic:'🏋️' },

  // ── 방향 ──────────────────────────────────────────────────────────
  up:        { bg:'#bbf7d0', fg:'#14532d', ic:'⬆️' },
  down:      { bg:'#fecaca', fg:'#7f1d1d', ic:'⬇️' },

  // ── N5 2.2 추가 ───────────────────────────────────────────────────
  office:    { bg:'#a5f3fc', fg:'#155e75', ic:'🏢' },   // 회사
  sports:    { bg:'#bbf7d0', fg:'#14532d', ic:'⚽' },   // 스포츠
  mail:      { bg:'#bae6fd', fg:'#0c4a6e', ic:'✉️' },   // 우편/메일
  tool:      { bg:'#e5e7eb', fg:'#374151', ic:'🔧' },   // 도구/수리
  hotel:     { bg:'#ddd6fe', fg:'#4c1d95', ic:'🏨' },   // 호텔/숙소
  phone:     { bg:'#a5f3fc', fg:'#155e75', ic:'📞' },   // 전화
  gift:      { bg:'#fecdd3', fg:'#881337', ic:'🎁' },   // 선물/축하
  team:      { bg:'#fde68a', fg:'#78350f', ic:'👥' },   // 팀/모임
  pet:       { bg:'#fed7aa', fg:'#7c2d12', ic:'🐾' },   // 반려동물
  ceremony:  { bg:'#fef3c7', fg:'#92400e', ic:'🎓' },   // 행사/식
  art:       { bg:'#fbcfe8', fg:'#831843', ic:'🎨' },   // 그림

  // ── N5 대량 확장 1차 (가족·사람) ─────────────────────────────────
  baby:        { bg:'#fbcfe8', fg:'#831843', ic:'👶' },
  husband:     { bg:'#bfdbfe', fg:'#1e3a8a', ic:'🤵' },
  wife:        { bg:'#fbcfe8', fg:'#831843', ic:'👰' },
  grandpa:     { bg:'#d6d3d1', fg:'#44403c', ic:'👴' },
  grandma:     { bg:'#fce7f3', fg:'#831843', ic:'👵' },
  father:      { bg:'#bae6fd', fg:'#075985', ic:'👨' },
  mother:      { bg:'#fbcfe8', fg:'#831843', ic:'👩' },

  // 숫자
  num_one:     { bg:'#fef3c7', fg:'#92400e', ic:'1️⃣' },
  num_two:     { bg:'#fed7aa', fg:'#7c2d12', ic:'2️⃣' },
  num_three:   { bg:'#fecaca', fg:'#7f1d1d', ic:'3️⃣' },
  num_five:    { bg:'#bfdbfe', fg:'#1e3a8a', ic:'5️⃣' },
  num_seven:   { bg:'#bbf7d0', fg:'#14532d', ic:'7️⃣' },
  num_ten:     { bg:'#e9d5ff', fg:'#4c1d95', ic:'🔟' },
  num_hundred: { bg:'#fcd34d', fg:'#78350f', ic:'💯' },
  num_thousand:{ bg:'#a5f3fc', fg:'#155e75', ic:'🔢' },
  num_10k:     { bg:'#bbf7d0', fg:'#14532d', ic:'💰' },

  // 시간 단위
  clock:       { bg:'#e9d5ff', fg:'#4c1d95', ic:'🕐' },
  week:        { bg:'#fde68a', fg:'#92400e', ic:'📅' },
  moon_month:  { bg:'#ddd6fe', fg:'#3730a3', ic:'🌑' },
  year:        { bg:'#fef3c7', fg:'#92400e', ic:'🗓' },
  noon:        { bg:'#fde68a', fg:'#7c2d12', ic:'🌞' },
  evening:     { bg:'#c4b5fd', fg:'#312e81', ic:'🌆' },

  // 장소·교통
  street:      { bg:'#d6d3d1', fg:'#44403c', ic:'🛣' },
  bus:         { bg:'#fef3c7', fg:'#92400e', ic:'🚌' },
  taxi:        { bg:'#fde68a', fg:'#78350f', ic:'🚕' },
  bicycle:     { bg:'#bbf7d0', fg:'#14532d', ic:'🚲' },
  ship:        { bg:'#bae6fd', fg:'#075985', ic:'🚢' },
  supermarket: { bg:'#fed7aa', fg:'#7c2d12', ic:'🛒' },
  ticket:      { bg:'#fbcfe8', fg:'#831843', ic:'🎫' },

  // 음식·쇼핑
  milk:        { bg:'#e0f2fe', fg:'#0c4a6e', ic:'🥛' },
  juice:       { bg:'#fed7aa', fg:'#7c2d12', ic:'🧃' },
  beer:        { bg:'#fcd34d', fg:'#78350f', ic:'🍺' },
  egg:         { bg:'#fef3c7', fg:'#92400e', ic:'🥚' },
  fish:        { bg:'#bfdbfe', fg:'#1e3a8a', ic:'🐟' },
  cake:        { bg:'#fbcfe8', fg:'#831843', ic:'🍰' },
  sushi:       { bg:'#fed7aa', fg:'#7c2d12', ic:'🍣' },
  ramen:       { bg:'#fef3c7', fg:'#92400e', ic:'🍜' },
  restaurant:  { bg:'#fde68a', fg:'#78350f', ic:'🍽' },
  menu:        { bg:'#fecaca', fg:'#7f1d1d', ic:'📋' },
  sale:        { bg:'#fed7aa', fg:'#7c2d12', ic:'🏷' },

  // 학교·공부
  notebook:    { bg:'#bfdbfe', fg:'#1e3a8a', ic:'📒' },
  paper:       { bg:'#fef3c7', fg:'#92400e', ic:'📄' },
  question:    { bg:'#fcd34d', fg:'#78350f', ic:'❓' },
  answer:      { bg:'#bbf7d0', fg:'#14532d', ic:'✅' },
  kanji:       { bg:'#c4b5fd', fg:'#312e81', ic:'漢' },
  word:        { bg:'#fbcfe8', fg:'#831843', ic:'💬' },
  english:     { bg:'#bfdbfe', fg:'#1e3a8a', ic:'🔤' },
  japanese:    { bg:'#fecaca', fg:'#7f1d1d', ic:'あ' },
  hiragana:    { bg:'#fbcfe8', fg:'#831843', ic:'ひ' },
  student:     { bg:'#c4b5fd', fg:'#312e81', ic:'🧑‍🎓' },

  // 집·생활
  kitchen:     { bg:'#fde68a', fg:'#92400e', ic:'🍳' },
  bedroom:     { bg:'#c4b5fd', fg:'#312e81', ic:'🛏' },
  bathroom:    { bg:'#a5f3fc', fg:'#155e75', ic:'🛁' },
  chair:       { bg:'#fed7aa', fg:'#7c2d12', ic:'🪑' },
  desk:        { bg:'#fcd34d', fg:'#78350f', ic:'📐' },
  window:      { bg:'#bfdbfe', fg:'#1e3a8a', ic:'🪟' },
  door:        { bg:'#bbf7d0', fg:'#14532d', ic:'🚪' },

  // 취미
  game:        { bg:'#c4b5fd', fg:'#312e81', ic:'🎮' },
  tv:          { bg:'#cbd5e1', fg:'#0f172a', ic:'📺' },
  sing:        { bg:'#fbcfe8', fg:'#831843', ic:'🎤' },
  swim:        { bg:'#a5f3fc', fg:'#155e75', ic:'🏊' },
  run:         { bg:'#bbf7d0', fg:'#14532d', ic:'🏃' },
  draw:        { bg:'#fef3c7', fg:'#92400e', ic:'🖌' },
  party:       { bg:'#fbcfe8', fg:'#831843', ic:'🎉' },

  // 자연
  tree:        { bg:'#bbf7d0', fg:'#14532d', ic:'🌲' },
  grass:       { bg:'#d9f99d', fg:'#365314', ic:'🌿' },
  cloudy:      { bg:'#cbd5e1', fg:'#0f172a', ic:'☁' },
  sunny:       { bg:'#fde68a', fg:'#92400e', ic:'🌤' },
  pond:        { bg:'#a5f3fc', fg:'#155e75', ic:'💦' },

  // 몸·건강
  nose:        { bg:'#fed7aa', fg:'#7c2d12', ic:'👃' },
  mouth:       { bg:'#fecaca', fg:'#7f1d1d', ic:'👄' },
  ear:         { bg:'#fbcfe8', fg:'#831843', ic:'👂' },
  hand:        { bg:'#fcd34d', fg:'#78350f', ic:'✋' },
  foot:        { bg:'#fed7aa', fg:'#7c2d12', ic:'🦶' },
  head:        { bg:'#fef3c7', fg:'#92400e', ic:'🤔' },
  body:        { bg:'#cbd5e1', fg:'#0f172a', ic:'🩻' },
  doctor:      { bg:'#bfdbfe', fg:'#1e3a8a', ic:'👨‍⚕️' },
  medicine:    { bg:'#bbf7d0', fg:'#14532d', ic:'💊' },

  // 동사
  stand:       { bg:'#a7f3d0', fg:'#064e3b', ic:'🧍' },
  sit:         { bg:'#fed7aa', fg:'#7c2d12', ic:'💺' },
  exit:        { bg:'#fecaca', fg:'#7f1d1d', ic:'🚪' },
  hold:        { bg:'#fcd34d', fg:'#78350f', ic:'🤲' },
  make:        { bg:'#fed7aa', fg:'#7c2d12', ic:'🔨' },
  end:         { bg:'#cbd5e1', fg:'#0f172a', ic:'⏹' },
  open:        { bg:'#bbf7d0', fg:'#14532d', ic:'🔓' },
  close:       { bg:'#fecaca', fg:'#7f1d1d', ic:'🔒' },
  teach:       { bg:'#c4b5fd', fg:'#312e81', ic:'🧑‍🏫' },

  // 색·형용사
  black:       { bg:'#cbd5e1', fg:'#0f172a', ic:'⬛' },
  white:       { bg:'#fef3c7', fg:'#92400e', ic:'⬜' },
  red:         { bg:'#fecaca', fg:'#7f1d1d', ic:'🔴' },
  blue:        { bg:'#bfdbfe', fg:'#1e3a8a', ic:'🔵' },
  yellow:      { bg:'#fcd34d', fg:'#78350f', ic:'🟡' },
  old:         { bg:'#d6d3d1', fg:'#44403c', ic:'🕰' },
  fun:         { bg:'#fde68a', fg:'#92400e', ic:'😄' },
  sad:         { bg:'#bfdbfe', fg:'#1e3a8a', ic:'😢' },
  busy:        { bg:'#fed7aa', fg:'#7c2d12', ic:'🏃' },
  short:       { bg:'#fbcfe8', fg:'#831843', ic:'⏬' },

  // ── 폴백 ──────────────────────────────────────────────────────────
  default:   { bg:'#cbd5e1', fg:'#0f172a', ic:'📝' },
};

export function mnemonicSvg(imageKey, word) {
  const p = PALETTE[imageKey] || PALETTE.default;
  const safe = (word || '').slice(0, 4);
  // 84x84 카드: 배경 + 이모지 + 단어
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84" aria-hidden="true">
  <rect width="84" height="84" rx="10" fill="${p.bg}"/>
  <text x="50%" y="42%" text-anchor="middle" font-size="30" dominant-baseline="middle">${p.ic}</text>
  <text x="50%" y="78%" text-anchor="middle" font-size="14" font-weight="700" fill="${p.fg}">${escapeXml(safe)}</text>
</svg>`.trim();
}

/** 등록된 imageKey 들의 집합 — 검증용. */
export function knownImageKeys() {
  return new Set(Object.keys(PALETTE));
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, c => ({
    '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;',
  }[c]));
}
