// 가나 → 로마자(헵번식 근사) 변환 유틸 — 라운드 31.
//
// 용도: 단어 reading(히라가나/가타카나)의 발음 보조 표기.
//   - 시각 보조 전용. TTS 에는 절대 넘기지 않는다 (TTS 는 일본어 원문).
//   - 조사 발음 특수처리(は→wa 등)는 하지 않는다 — 단어 reading 그대로 변환.
//   - 장음 ー 는 직전 모음 반복 (コーヒー → koohii). おう/えい 류는 그대로 ou/ei.
//   - 작은 っ 는 다음 자음 중복 (がっこう → gakkou), ち 앞은 t (ちょっと → chotto... → 't' 중복).
//   - ん 은 n.

const DIGRAPHS = {
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
  'しゃ':'sha','しゅ':'shu','しょ':'sho','じゃ':'ja','じゅ':'ju','じょ':'jo',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho','ぢゃ':'ja','ぢゅ':'ju','ぢょ':'jo',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
  'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','びゃ':'bya','びゅ':'byu','びょ':'byo',
  'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
  // 가타카나 외래어 확장 (자주 쓰는 것만)
  'ふぁ':'fa','ふぃ':'fi','ふぇ':'fe','ふぉ':'fo',
  'てぃ':'ti','でぃ':'di','うぃ':'wi','うぇ':'we','うぉ':'wo',
  'しぇ':'she','ちぇ':'che','じぇ':'je','ヴ':'vu',
};

const MONO = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','ゐ':'i','ゑ':'e','を':'o','ん':'n',
  'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
  'ゔ':'vu','・':' ','、':', ','。':'. ',
};

/** 가타카나 → 히라가나 (코드포인트 -0x60). ー 는 유지. */
function kataToHira(s) {
  let out = '';
  for (const ch of s) {
    const code = ch.codePointAt(0);
    if (code >= 0x30A1 && code <= 0x30F6) out += String.fromCodePoint(code - 0x60);
    else out += ch;
  }
  return out;
}

/**
 * 히라가나/가타카나 → 로마자. 가나가 아닌 문자(한자/영문 등)는 그대로 통과.
 * @param {string} text
 * @returns {string}
 */
export function kanaToRomaji(text) {
  if (typeof text !== 'string' || !text) return '';
  const s = kataToHira(text);
  let out = '';
  let geminate = false; // 직전이 작은 っ
  for (let i = 0; i < s.length; i++) {
    const two = s.slice(i, i + 2);
    const one = s[i];

    if (one === 'っ') { geminate = true; continue; }

    if (one === 'ー') {
      // 장음 — 직전 모음 반복
      const m = out.match(/[aeiou]$/);
      out += m ? m[0] : '-';
      continue;
    }

    let syl = null;
    if (DIGRAPHS[two]) { syl = DIGRAPHS[two]; i++; }
    else if (MONO[one]) { syl = MONO[one]; }

    if (syl === null) { out += one; geminate = false; continue; }

    // ん 뒤에 모음/や행이 오면 음절 경계 표시 (ふんいき → fun'iki)
    if (out.endsWith('n') && /^[aeiouy]/.test(syl) && s[i - 1] === 'ん') {
      out += "'";
    }

    if (geminate) {
      // 다음 자음 중복. ch- 는 t 로 (ちょっと → chotto 는 と의 t 중복이므로 일반 규칙으로 충분,
      // っち 처럼 ch 가 따라올 때만 t 를 붙인다: まっちゃ → matcha.
      out += syl.startsWith('ch') ? 't' : syl[0];
      geminate = false;
    }
    out += syl;
  }
  // 끝이 っ 로 끝나는 비정상 입력 — 무시 (geminate 버림)
  return out;
}

/**
 * vocab 항목의 romaji — optional override(v.romaji) 우선, 없으면 reading 런타임 변환.
 * @param {{reading?:string, romaji?:string}} v
 */
export function getVocabRomaji(v) {
  if (!v) return '';
  if (typeof v.romaji === 'string' && v.romaji) return v.romaji;
  return kanaToRomaji(v.reading || '');
}
