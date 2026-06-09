// 히라가나 / 가타카나 표 데이터. 학습 보조 자료.
// 라이선스: 본 파일은 공개 일본어 음운 사실(문자·로마자 매핑)만 담고 있으며 외부 사전 자료를 복사하지 않았다.
// romaji 는 헵번식 표기.
//
// 표는 5열 그리드를 기본으로, 빈 칸(やゆよ 행 등)은 null 로 둔다.

const X = null;

export const kanaChart = {
  // 5×11 기본 50음 (히라가나)
  hiraganaBase: [
    [{ ch:'あ', ro:'a' }, { ch:'い', ro:'i' }, { ch:'う', ro:'u' }, { ch:'え', ro:'e' }, { ch:'お', ro:'o' }],
    [{ ch:'か', ro:'ka' }, { ch:'き', ro:'ki' }, { ch:'く', ro:'ku' }, { ch:'け', ro:'ke' }, { ch:'こ', ro:'ko' }],
    [{ ch:'さ', ro:'sa' }, { ch:'し', ro:'shi' }, { ch:'す', ro:'su' }, { ch:'せ', ro:'se' }, { ch:'そ', ro:'so' }],
    [{ ch:'た', ro:'ta' }, { ch:'ち', ro:'chi' }, { ch:'つ', ro:'tsu' }, { ch:'て', ro:'te' }, { ch:'と', ro:'to' }],
    [{ ch:'な', ro:'na' }, { ch:'に', ro:'ni' }, { ch:'ぬ', ro:'nu' }, { ch:'ね', ro:'ne' }, { ch:'の', ro:'no' }],
    [{ ch:'は', ro:'ha' }, { ch:'ひ', ro:'hi' }, { ch:'ふ', ro:'fu' }, { ch:'へ', ro:'he' }, { ch:'ほ', ro:'ho' }],
    [{ ch:'ま', ro:'ma' }, { ch:'み', ro:'mi' }, { ch:'む', ro:'mu' }, { ch:'め', ro:'me' }, { ch:'も', ro:'mo' }],
    [{ ch:'や', ro:'ya' }, X, { ch:'ゆ', ro:'yu' }, X, { ch:'よ', ro:'yo' }],
    [{ ch:'ら', ro:'ra' }, { ch:'り', ro:'ri' }, { ch:'る', ro:'ru' }, { ch:'れ', ro:'re' }, { ch:'ろ', ro:'ro' }],
    [{ ch:'わ', ro:'wa' }, X, X, X, { ch:'を', ro:'wo' }],
    [{ ch:'ん', ro:'n' }, X, X, X, X],
  ],

  // 5×11 기본 50음 (가타카나)
  katakanaBase: [
    [{ ch:'ア', ro:'a' }, { ch:'イ', ro:'i' }, { ch:'ウ', ro:'u' }, { ch:'エ', ro:'e' }, { ch:'オ', ro:'o' }],
    [{ ch:'カ', ro:'ka' }, { ch:'キ', ro:'ki' }, { ch:'ク', ro:'ku' }, { ch:'ケ', ro:'ke' }, { ch:'コ', ro:'ko' }],
    [{ ch:'サ', ro:'sa' }, { ch:'シ', ro:'shi' }, { ch:'ス', ro:'su' }, { ch:'セ', ro:'se' }, { ch:'ソ', ro:'so' }],
    [{ ch:'タ', ro:'ta' }, { ch:'チ', ro:'chi' }, { ch:'ツ', ro:'tsu' }, { ch:'テ', ro:'te' }, { ch:'ト', ro:'to' }],
    [{ ch:'ナ', ro:'na' }, { ch:'ニ', ro:'ni' }, { ch:'ヌ', ro:'nu' }, { ch:'ネ', ro:'ne' }, { ch:'ノ', ro:'no' }],
    [{ ch:'ハ', ro:'ha' }, { ch:'ヒ', ro:'hi' }, { ch:'フ', ro:'fu' }, { ch:'ヘ', ro:'he' }, { ch:'ホ', ro:'ho' }],
    [{ ch:'マ', ro:'ma' }, { ch:'ミ', ro:'mi' }, { ch:'ム', ro:'mu' }, { ch:'メ', ro:'me' }, { ch:'モ', ro:'mo' }],
    [{ ch:'ヤ', ro:'ya' }, X, { ch:'ユ', ro:'yu' }, X, { ch:'ヨ', ro:'yo' }],
    [{ ch:'ラ', ro:'ra' }, { ch:'リ', ro:'ri' }, { ch:'ル', ro:'ru' }, { ch:'レ', ro:'re' }, { ch:'ロ', ro:'ro' }],
    [{ ch:'ワ', ro:'wa' }, X, X, X, { ch:'ヲ', ro:'wo' }],
    [{ ch:'ン', ro:'n' }, X, X, X, X],
  ],

  // 탁음 / 반탁음 (히라가나)
  hiraganaDakuten: [
    [{ ch:'が', ro:'ga' }, { ch:'ぎ', ro:'gi' }, { ch:'ぐ', ro:'gu' }, { ch:'げ', ro:'ge' }, { ch:'ご', ro:'go' }],
    [{ ch:'ざ', ro:'za' }, { ch:'じ', ro:'ji' }, { ch:'ず', ro:'zu' }, { ch:'ぜ', ro:'ze' }, { ch:'ぞ', ro:'zo' }],
    [{ ch:'だ', ro:'da' }, { ch:'ぢ', ro:'ji' }, { ch:'づ', ro:'zu' }, { ch:'で', ro:'de' }, { ch:'ど', ro:'do' }],
    [{ ch:'ば', ro:'ba' }, { ch:'び', ro:'bi' }, { ch:'ぶ', ro:'bu' }, { ch:'べ', ro:'be' }, { ch:'ぼ', ro:'bo' }],
    [{ ch:'ぱ', ro:'pa' }, { ch:'ぴ', ro:'pi' }, { ch:'ぷ', ro:'pu' }, { ch:'ぺ', ro:'pe' }, { ch:'ぽ', ro:'po' }],
  ],

  // 탁음 / 반탁음 (가타카나)
  katakanaDakuten: [
    [{ ch:'ガ', ro:'ga' }, { ch:'ギ', ro:'gi' }, { ch:'グ', ro:'gu' }, { ch:'ゲ', ro:'ge' }, { ch:'ゴ', ro:'go' }],
    [{ ch:'ザ', ro:'za' }, { ch:'ジ', ro:'ji' }, { ch:'ズ', ro:'zu' }, { ch:'ゼ', ro:'ze' }, { ch:'ゾ', ro:'zo' }],
    [{ ch:'ダ', ro:'da' }, { ch:'ヂ', ro:'ji' }, { ch:'ヅ', ro:'zu' }, { ch:'デ', ro:'de' }, { ch:'ド', ro:'do' }],
    [{ ch:'バ', ro:'ba' }, { ch:'ビ', ro:'bi' }, { ch:'ブ', ro:'bu' }, { ch:'ベ', ro:'be' }, { ch:'ボ', ro:'bo' }],
    [{ ch:'パ', ro:'pa' }, { ch:'ピ', ro:'pi' }, { ch:'プ', ro:'pu' }, { ch:'ペ', ro:'pe' }, { ch:'ポ', ro:'po' }],
  ],

  // 요음 (히라가나)
  hiraganaYouon: [
    [{ ch:'きゃ', ro:'kya' }, { ch:'きゅ', ro:'kyu' }, { ch:'きょ', ro:'kyo' }],
    [{ ch:'しゃ', ro:'sha' }, { ch:'しゅ', ro:'shu' }, { ch:'しょ', ro:'sho' }],
    [{ ch:'ちゃ', ro:'cha' }, { ch:'ちゅ', ro:'chu' }, { ch:'ちょ', ro:'cho' }],
    [{ ch:'にゃ', ro:'nya' }, { ch:'にゅ', ro:'nyu' }, { ch:'にょ', ro:'nyo' }],
    [{ ch:'ひゃ', ro:'hya' }, { ch:'ひゅ', ro:'hyu' }, { ch:'ひょ', ro:'hyo' }],
    [{ ch:'みゃ', ro:'mya' }, { ch:'みゅ', ro:'myu' }, { ch:'みょ', ro:'myo' }],
    [{ ch:'りゃ', ro:'rya' }, { ch:'りゅ', ro:'ryu' }, { ch:'りょ', ro:'ryo' }],
  ],

  // 요음 (가타카나)
  katakanaYouon: [
    [{ ch:'キャ', ro:'kya' }, { ch:'キュ', ro:'kyu' }, { ch:'キョ', ro:'kyo' }],
    [{ ch:'シャ', ro:'sha' }, { ch:'シュ', ro:'shu' }, { ch:'ショ', ro:'sho' }],
    [{ ch:'チャ', ro:'cha' }, { ch:'チュ', ro:'chu' }, { ch:'チョ', ro:'cho' }],
    [{ ch:'ニャ', ro:'nya' }, { ch:'ニュ', ro:'nyu' }, { ch:'ニョ', ro:'nyo' }],
    [{ ch:'ヒャ', ro:'hya' }, { ch:'ヒュ', ro:'hyu' }, { ch:'ヒョ', ro:'hyo' }],
    [{ ch:'ミャ', ro:'mya' }, { ch:'ミュ', ro:'myu' }, { ch:'ミョ', ro:'myo' }],
    [{ ch:'リャ', ro:'rya' }, { ch:'リュ', ro:'ryu' }, { ch:'リョ', ro:'ryo' }],
  ],
};
