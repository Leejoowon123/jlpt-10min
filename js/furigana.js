// 후리가나 렌더 공용 유틸.
//
// 정책:
//   1. 사용자가 명시한 readings: [{text, reading}] 가 최우선 — 잘못된 매칭을 덮어쓸 수 있음.
//   2. vocab.word→reading / kanji.exampleWords[].word→reading 으로 자동 사전 구성.
//   3. 추가 COMMON_FURIGANA — vocab 에 없지만 N5 콘텐츠에 자주 등장하는 표현.
//   4. 매칭은 "긴 단어 우선" 그리디 — 日本語 가 日本 보다 먼저 처리되도록.
//   5. HTML 이스케이프는 ruby/rt 안에서 항상 수행 → XSS 방지.
//   6. 한자가 없는 텍스트(가나만)는 그대로 escape 만 적용.
//
// 모든 출력은 HTML 문자열. innerHTML 에 그대로 삽입 가능.
import { vocab } from './data/vocab.js';
import { kanji } from './data/kanji.js';

// vocab/kanji 외에 자주 등장하는데 vocab 표제어로 잡히지 않는 표현들.
// 라이선스: 모두 본 프로젝트용 창작 사전. 외부 사전 데이터 미사용.
const COMMON_FURIGANA = {
  // 자기지칭
  '私': 'わたし',
  '私たち': 'わたしたち',
  '僕': 'ぼく',
  '皆さん': 'みなさん',
  // 직업·신분
  '会社員': 'かいしゃいん',
  '会社': 'かいしゃ',
  '会議': 'かいぎ',
  '会社員です': 'かいしゃいんです',
  '中学生': 'ちゅうがくせい',
  '高校生': 'こうこうせい',
  '中学校': 'ちゅうがっこう',
  '小学校': 'しょうがっこう',
  '高校': 'こうこう',
  // 자주 등장 명사·어구
  '時間': 'じかん',
  '一杯': 'いっぱい',
  '一緒': 'いっしょ',
  '一日': 'いちにち',
  '一週間': 'いっしゅうかん',
  '一つ': 'ひとつ',
  '二人': 'ふたり',
  '三人': 'さんにん',
  '何': 'なに',
  '何時': 'なんじ',
  '何曜日': 'なんようび',
  '何人': 'なんにん',
  '何ですか': 'なんですか',
  '誰': 'だれ',
  '何の': 'なんの',
  // 자주 동사 활용형
  '降ります': 'ふります',
  '降って': 'ふって',
  '降る': 'ふる',
  '住んで': 'すんで',
  '住んでいます': 'すんでいます',
  '泳ぎ': 'およぎ',
  '泳ぎます': 'およぎます',
  '飼って': 'かって',
  '渡ります': 'わたります',
  '出ました': 'でました',
  '始まります': 'はじまります',
  '集まります': 'あつまります',
  '変えて': 'かえて',
  '出して': 'だして',
  '出します': 'だします',
  '取りました': 'とりました',
  '撮りました': 'とりました',
  '優しい': 'やさしい',
  '元気': 'げんき',
  '元気です': 'げんきです',
  // 시간 관련
  '今朝': 'けさ',
  '今週': 'こんしゅう',
  '今月': 'こんげつ',
  '来週': 'らいしゅう',
  '来月': 'らいげつ',
  '先週': 'せんしゅう',
  '夏休み': 'なつやすみ',
  '冬休み': 'ふゆやすみ',
  '休み': 'やすみ',
  '休みます': 'やすみます',
  // 장소·인명
  '東京': 'とうきょう',
  '京都': 'きょうと',
  '田中': 'たなか',
  '山田': 'やまだ',
  '富士山': 'ふじさん',
  // 형용사/표현
  '静か': 'しずか',
  '静かです': 'しずかです',
  '便利': 'べんり',
  '一番': 'いちばん',
  '楽しかった': 'たのしかった',
  '寒かった': 'さむかった',
  '暑かった': 'あつかった',
  '美味しかった': 'おいしかった',
  '痛い': 'いたい',
  // 가족 추가
  '兄弟': 'きょうだい',
  '姉妹': 'しまい',
  // 동사 활용형 자주 등장 (개별 한자 단독은 본 사전이 아닌 vocab/kanji 우선)
  '見せて': 'みせて',
  '見えます': 'みえます',
  '見つけました': 'みつけました',
  '聞こえます': 'きこえます',
  '聞いて': 'きいて',
  '言って': 'いって',
  '入って': 'はいって',
  '帰って': 'かえって',
  '来て': 'きて',
  '来ます': 'きます',
  '行って': 'いって',
  // 자주 등장 어휘 보강
  '冷蔵庫': 'れいぞうこ',
  '冷えました': 'ひえました',
  '新聞': 'しんぶん',
  '英語': 'えいご',
  '韓国語': 'かんこくご',
  '中国': 'ちゅうごく',
  '中国語': 'ちゅうごくご',
  // 가격/수량 자주 조합
  '五百円': 'ごひゃくえん',
  '千円': 'せんえん',
  '千二百': 'せんにひゃく',
  '千二百円': 'せんにひゃくえん',
  '一万円': 'いちまんえん',
  // 자주 보조 명사
  '本屋': 'ほんや',
  '事務室': 'じむしつ',
  '上手': 'じょうず',
  '下手': 'へた',
  '映画館': 'えいがかん',
  '中学': 'ちゅうがく',
  '中で': 'なかで',
  // 자주 동사 ます 폼 (vocab 사전형 'X' 와 ます폼 'Xます' 둘 다 매칭되도록)
  '食べました': 'たべました',
  '食べます': 'たべます',
  '食べて': 'たべて',
  '飲みます': 'のみます',
  '飲んで': 'のんで',
  '飲みません': 'のみません',
  '行きました': 'いきました',
  '行きます': 'いきます',
  '見ます': 'みます',
  '見ました': 'みました',
  '見て': 'みて',
  '聞きます': 'ききます',
  '読みます': 'よみます',
  '書きます': 'かきます',
  '話します': 'はなします',
  '買いました': 'かいました',
  '買います': 'かいます',
  '使います': 'つかいます',
  '作ります': 'つくります',
  '作りました': 'つくりました',
  '勉強': 'べんきょう',
  '勉強します': 'べんきょうします',
  '勉強して': 'べんきょうして',
  '勉強しています': 'べんきょうしています',
  '注文': 'ちゅうもん',
  '注文しました': 'ちゅうもんしました',
  '練習': 'れんしゅう',
  '散歩': 'さんぽ',
  '散歩します': 'さんぽします',
  '旅行': 'りょこう',
  '旅行に': 'りょこうに',
  '料理': 'りょうり',
  '質問': 'しつもん',
  '質問が': 'しつもんが',
  '宿題': 'しゅくだい',
  '試験': 'しけん',
  '授業': 'じゅぎょう',
  // 라운드 5 보강 — vocab 표제어가 가나/카타카나거나 사전형이라 자동 매칭이 잡지 못한 항목.
  '天気': 'てんき',
  '好き': 'すき',
  '好きです': 'すきです',
  '好きでした': 'すきでした',
  '寝る': 'ねる',
  '寝ます': 'ねます',
  '寝て': 'ねて',
  '寝ました': 'ねました',
  '閉める': 'しめる',
  '閉めます': 'しめます',
  '閉めました': 'しめました',
  '閉めて': 'しめて',
  '立つ': 'たつ',
  '立ちます': 'たちます',
  '立って': 'たって',
  '立ち': 'たち',
  '持つ': 'もつ',
  '持ちます': 'もちます',
  '持って': 'もって',
  '持ちました': 'もちました',
  '前': 'まえ',
  '前に': 'まえに',
  '吸う': 'すう',
  '吸って': 'すって',
  '吸います': 'すいます',
  '吸ってはいけません': 'すってはいけません',
  '辛く': 'からく',
  '辛くない': 'からくない',
  '辛くないです': 'からくないです',
  '辛い': 'からい',
  '全然': 'ぜんぜん',
};

let _autoCache = null;

/** vocab + kanji.exampleWords + COMMON_FURIGANA 를 결합한 자동 사전. */
function getAutoDict() {
  if (_autoCache) return _autoCache;
  const m = new Map();
  // 명시 매핑 먼저 (덮어쓰기 가능하도록)
  for (const [w, r] of Object.entries(COMMON_FURIGANA)) {
    if (containsKanji(w)) m.set(w, r);
  }
  // vocab.word → reading
  for (const v of vocab) {
    if (containsKanji(v.word) && !m.has(v.word)) {
      m.set(v.word, v.reading);
    }
  }
  // kanji.exampleWords
  for (const k of kanji) {
    for (const w of (k.exampleWords || [])) {
      if (w.word && w.reading && containsKanji(w.word) && !m.has(w.word)) {
        m.set(w.word, w.reading);
      }
    }
  }
  _autoCache = m;
  return _autoCache;
}

/** 테스트용 — 자동 사전 캐시 무효화. */
export function _resetFuriganaCache() { _autoCache = null; }

const KANJI_RE = /[一-鿿㐀-䶿]/;

export function containsKanji(s) {
  return typeof s === 'string' && KANJI_RE.test(s);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function buildDict(readings) {
  // 자동 사전 + 명시 readings 병합. 명시가 우선.
  const dict = new Map(getAutoDict());
  for (const r of (readings || [])) {
    if (r && r.text && r.reading && containsKanji(r.text)) {
      dict.set(r.text, r.reading);
    }
  }
  // 긴 단어 우선
  return Array.from(dict.entries()).sort((a, b) => b[0].length - a[0].length);
}

/**
 * 일본어 텍스트에 ruby 후리가나를 입혀 HTML 반환.
 * - readings[] 의 명시 매칭 + 자동 사전 매칭. 긴 단어 우선.
 * - 매칭 안 된 글자는 escape 만 적용.
 * - 같은 문장에 같은 단어가 여러 번 나와도 모두 처리됨.
 * @returns {string} HTML
 */
export function renderFuriganaText(text, readings = []) {
  if (!text) return '';
  if (typeof text !== 'string') return escapeHtml(text);
  const entries = buildDict(readings);
  const out = [];
  let i = 0;
  while (i < text.length) {
    let matched = false;
    // 한자가 아닌 글자는 즉시 escape
    if (!KANJI_RE.test(text[i])) {
      out.push(escapeHtml(text[i]));
      i++;
      continue;
    }
    for (const [w, r] of entries) {
      if (text.startsWith(w, i)) {
        out.push(`<ruby>${escapeHtml(w)}<rt>${escapeHtml(r)}</rt></ruby>`);
        i += w.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // 매칭 안 된 단일 한자
      out.push(escapeHtml(text[i]));
      i++;
    }
  }
  return out.join('');
}

/** 텍스트에 후리가나가 한 곳이라도 들어갈 수 있는지 (커버율 측정용). */
export function hasFurigana(text, readings = []) {
  if (!containsKanji(text)) return false;
  const entries = buildDict(readings);
  for (const [w] of entries) {
    if (text.includes(w)) return true;
  }
  return false;
}

/** 텍스트가 한자를 포함하면 furigana, 아니면 escape only. */
export function safeJa(text, readings) {
  return renderFuriganaText(text, readings);
}

export { escapeHtml as plainJa };

// ─── 설정 기반 렌더 (런타임 토글) ────────────────────────────────────────
// renderFuriganaText 는 항상 ruby/rt 를 붙이는 순수 함수로 유지.
// 화면에서 사용하는 진입점은 renderJa — state.getFuriganaEnabled() 결과에 따라
//   ON  → renderFuriganaText 호출 (ruby/rt 포함 HTML)
//   OFF → 일본어 원문을 escape 만 한 plain text 반환
// 한자 카드의 hiragana 필드는 별도 학습 정보이므로 본 토글과 무관 — kanjiView 는 그대로.
//
// 의존 사이클 방지를 위해 state.js 를 동적 import 하지 않고 lazy require 패턴 사용.
// state.js → storage.js (단순) 라 정적 import 도 무방.
import { getFuriganaEnabled } from './state.js';

/**
 * 후리가나 토글 ON 이면 ruby/rt HTML, OFF 면 escape 만.
 * 모든 view 는 이 함수를 사용한다.
 */
export function renderJa(text, readings = []) {
  if (!text) return '';
  if (typeof text !== 'string') return escapeHtml(text);
  if (getFuriganaEnabled()) return renderFuriganaText(text, readings);
  return escapeHtml(text);
}
