// 이야기 / 단편 소설 콘텐츠.
//
// 라이선스 / 운영 원칙:
//   - 전부 본 프로젝트용 직접 창작 (original).
//   - 외부 뉴스 기사 복사 / 크롤링 / 상용 학습 콘텐츠 인용 모두 금지.
//   - 단어/문법/한자/예문 데이터와 동일한 자체 생성 원칙.
//
// 메뉴 분리:
//   type === 'daily_story' | 'news_style'  → 이야기 탭 (#stories)
//   type === 'short_story'                  → 단편 소설 탭 (#novels)
//
// 후리가나 정책:
//   - 본문은 renderJa(paragraph, bodyReadings[idx]) 로 렌더.
//   - bodyReadings 미작성 단어는 furigana.js 의 자동 사전 (vocab/kanji/COMMON_FURIGANA) 으로도 매칭됨.
//
// 정답 누출 정책:
//   - 번역 bodyKo 는 본 화면에서 "해석 보기" 버튼 후에만 노출 (storyView 가 책임).

export const stories = [
  {
    id: 'story_n5_001',
    type: 'daily_story',
    level: 'N5',
    titleJa: '私の朝',
    titleKo: '나의 아침',
    summaryKo: '아침에 일어나서 학교에 가기까지의 짧은 이야기.',
    bodyJa: [
      '私は毎日七時に起きます。',
      '朝ご飯はパンとコーヒーです。',
      '八時に家を出て学校へ行きます。',
    ],
    bodyReadings: [
      [{ text: '七時', reading: 'しちじ' }, { text: '起きます', reading: 'おきます' }, { text: '毎日', reading: 'まいにち' }],
      [{ text: '朝ご飯', reading: 'あさごはん' }],
      [{ text: '八時', reading: 'はちじ' }, { text: '家', reading: 'いえ' }, { text: '出て', reading: 'でて' }, { text: '学校', reading: 'がっこう' }, { text: '行きます', reading: 'いきます' }],
    ],
    bodyKo: [
      '나는 매일 일곱 시에 일어납니다.',
      '아침밥은 빵과 커피입니다.',
      '여덟 시에 집을 나와 학교에 갑니다.',
    ],
    vocabularyIds: ['v_n5_85'],
    grammarIds: ['g_n5_1'],
    // 본문 학습용 핵심 어휘/문법 (스토리 학습 플레이어의 "핵심 단어 / 문법" 탭)
    keyVocabularyIds: ['v_n5_51', 'v_n5_24', 'v_n5_2', 'v_n5_6'],   // 起きる/朝/食べる/行く
    keyGrammarIds:    ['g_n5_1'],                                    // 〜は〜です
    // 문단별 하이라이트 — 본문 아래 pill 로 표시 (클릭 시 뜻).
    bodyHighlights: [
      [
        { text: '起きます', reading: 'おきます', meaningKo: '일어납니다', vocabId: 'v_n5_51', kind: 'vocab' },
        { text: '七時',     reading: 'しちじ',   meaningKo: '일곱 시',     kind: 'time' },
      ],
      [
        { text: '朝ご飯', reading: 'あさごはん', meaningKo: '아침밥', vocabId: 'v_n5_24', kind: 'vocab' },
      ],
      [
        { text: '学校', reading: 'がっこう', meaningKo: '학교', vocabId: 'v_n5_4', kind: 'vocab' },
        { text: '行きます', reading: 'いきます', meaningKo: '갑니다', vocabId: 'v_n5_6', kind: 'vocab' },
      ],
    ],
    tags: ['생활', '아침', '학교'],
    estimatedMinutes: 2,
    sourceType: 'original',
  },
  {
    id: 'story_n5_002',
    type: 'news_style',
    level: 'N5',
    titleJa: '公園に新しい花',
    titleKo: '공원에 새로운 꽃',
    summaryKo: '동네 공원에 새로운 꽃이 피었다는 짧은 가상 기사.',
    bodyJa: [
      '町の公園に新しい花が咲きました。',
      '色は赤と白です。子供たちは花を見て喜びました。',
      '公園は朝六時から夜八時まで開いています。',
    ],
    bodyReadings: [
      [{ text: '町', reading: 'まち' }, { text: '公園', reading: 'こうえん' }, { text: '新しい', reading: 'あたらしい' }, { text: '花', reading: 'はな' }, { text: '咲きました', reading: 'さきました' }],
      [{ text: '色', reading: 'いろ' }, { text: '赤', reading: 'あか' }, { text: '白', reading: 'しろ' }, { text: '子供', reading: 'こども' }, { text: '見て', reading: 'みて' }, { text: '喜びました', reading: 'よろこびました' }],
      [{ text: '公園', reading: 'こうえん' }, { text: '朝', reading: 'あさ' }, { text: '六時', reading: 'ろくじ' }, { text: '夜', reading: 'よる' }, { text: '八時', reading: 'はちじ' }, { text: '開いて', reading: 'あいて' }],
    ],
    bodyKo: [
      '동네 공원에 새로운 꽃이 피었습니다.',
      '색은 빨강과 하양입니다. 아이들은 꽃을 보고 기뻐했습니다.',
      '공원은 아침 여섯 시부터 저녁 여덟 시까지 열려 있습니다.',
    ],
    vocabularyIds: [],
    grammarIds: ['g_n5_1'],
    keyVocabularyIds: ['v_n5_43', 'v_n5_30', 'v_n5_7'],   // 公園/花/見る
    keyGrammarIds:    ['g_n5_1'],
    bodyHighlights: [
      [
        { text: '公園', reading: 'こうえん', meaningKo: '공원',  vocabId: 'v_n5_43', kind: 'vocab' },
        { text: '花',   reading: 'はな',     meaningKo: '꽃',     vocabId: 'v_n5_30', kind: 'vocab' },
      ],
      [
        { text: '見て', reading: 'みて', meaningKo: '보고 (見る)', vocabId: 'v_n5_7', kind: 'vocab' },
      ],
      [
        { text: '六時', reading: 'ろくじ', meaningKo: '여섯 시', kind: 'time' },
        { text: '八時', reading: 'はちじ', meaningKo: '여덟 시', kind: 'time' },
      ],
    ],
    tags: ['생활', '공원', '뉴스'],
    estimatedMinutes: 2,
    sourceType: 'original',
  },
  {
    id: 'story_n5_003',
    type: 'short_story',
    level: 'N5',
    titleJa: '春の日曜日',
    titleKo: '봄의 일요일',
    summaryKo: '봄날 일요일, 친구와 공원을 산책하며 보낸 짧은 하루.',
    bodyJa: [
      '日曜日の朝、私は友だちと公園へ行きました。',
      '空は青くて、風はやさしかったです。',
      '私たちは木の下でお茶を飲みながら、たくさん話しました。',
      '夕方、家へ帰る時、空はピンク色になっていました。',
      '今日はとてもいい一日でした。',
    ],
    bodyReadings: [
      [{ text: '日曜日', reading: 'にちようび' }, { text: '朝', reading: 'あさ' }, { text: '友だち', reading: 'ともだち' }, { text: '公園', reading: 'こうえん' }, { text: '行きました', reading: 'いきました' }],
      [{ text: '空', reading: 'そら' }, { text: '青くて', reading: 'あおくて' }, { text: '風', reading: 'かぜ' }],
      [{ text: '木', reading: 'き' }, { text: '下', reading: 'した' }, { text: 'お茶', reading: 'おちゃ' }, { text: '飲みながら', reading: 'のみながら' }, { text: '話しました', reading: 'はなしました' }],
      [{ text: '夕方', reading: 'ゆうがた' }, { text: '家', reading: 'いえ' }, { text: '帰る', reading: 'かえる' }, { text: '時', reading: 'とき' }, { text: '空', reading: 'そら' }, { text: '色', reading: 'いろ' }],
      [{ text: '今日', reading: 'きょう' }, { text: '一日', reading: 'いちにち' }],
    ],
    bodyKo: [
      '일요일 아침, 나는 친구와 공원에 갔습니다.',
      '하늘은 푸르고, 바람은 부드러웠습니다.',
      '우리는 나무 아래에서 차를 마시면서 많이 이야기했습니다.',
      '저녁에 집으로 돌아갈 때, 하늘은 분홍빛으로 변해 있었습니다.',
      '오늘은 정말 좋은 하루였습니다.',
    ],
    vocabularyIds: [],
    grammarIds: ['g_n5_1'],
    keyVocabularyIds: ['v_n5_71', 'v_n5_10', 'v_n5_43', 'v_n5_49'],   // 日曜日/友だち/公園/話す
    keyGrammarIds:    ['g_n5_1'],
    bodyHighlights: [
      [
        { text: '日曜日', reading: 'にちようび', meaningKo: '일요일',  vocabId: 'v_n5_71', kind: 'vocab' },
        { text: '友だち', reading: 'ともだち',   meaningKo: '친구',     vocabId: 'v_n5_10', kind: 'vocab' },
        { text: '公園',   reading: 'こうえん',   meaningKo: '공원',     vocabId: 'v_n5_43', kind: 'vocab' },
      ],
      [
        { text: '空',   reading: 'そら',     meaningKo: '하늘',    vocabId: 'v_n5_123', kind: 'vocab' },
        { text: '風',   reading: 'かぜ',     meaningKo: '바람',    vocabId: 'v_n5_125', kind: 'vocab' },
      ],
      [
        { text: '木',         reading: 'き',         meaningKo: '나무',     vocabId: 'v_n5_213', kind: 'vocab' },
        { text: 'お茶',       reading: 'おちゃ',     meaningKo: '차(음료)',  kind: 'food' },
        { text: '話しました', reading: 'はなしました', meaningKo: '이야기했습니다', vocabId: 'v_n5_49', kind: 'vocab' },
      ],
      [
        { text: '夕方', reading: 'ゆうがた', meaningKo: '저녁',     kind: 'time' },
      ],
      [
        { text: '今日',   reading: 'きょう',     meaningKo: '오늘',  kind: 'time' },
      ],
    ],
    tags: ['생활', '봄', '친구'],
    estimatedMinutes: 4,
    sourceType: 'original',
  },

  // ─── 라운드 13 확장 ────────────────────────────────────────────────────
  {
    id: 'story_n5_004',
    type: 'daily_story',
    level: 'N5',
    titleJa: '雨の朝',
    titleKo: '비 오는 아침',
    summaryKo: '비 오는 아침에 가방에 우산을 넣고 친구와 학교에 가는 짧은 이야기.',
    bodyJa: [
      '今日は朝から雨でした。',
      '私はかばんに傘を入れて、家を出ました。',
      '駅で友だちに会いました。',
      '二人で電車に乗って、学校へ行きました。',
    ],
    bodyReadings: [
      [{ text: '今日', reading: 'きょう' }, { text: '朝', reading: 'あさ' }, { text: '雨', reading: 'あめ' }],
      [{ text: '傘', reading: 'かさ' }, { text: '入れて', reading: 'いれて' }, { text: '家', reading: 'いえ' }, { text: '出ました', reading: 'でました' }],
      [{ text: '駅', reading: 'えき' }, { text: '会いました', reading: 'あいました' }],
      [{ text: '電車', reading: 'でんしゃ' }, { text: '乗って', reading: 'のって' }],
    ],
    bodyKo: [
      '오늘은 아침부터 비가 왔습니다.',
      '나는 가방에 우산을 넣고 집을 나왔습니다.',
      '역에서 친구를 만났습니다.',
      '둘이서 전철을 타고 학교에 갔습니다.',
    ],
    vocabularyIds: [],
    grammarIds: ['g_n5_3'],
    keyVocabularyIds: ['v_n5_15', 'v_n5_24', 'v_n5_40', 'v_n5_10', 'v_n5_4'],
    keyGrammarIds:    ['g_n5_3'],
    bodyHighlights: [
      [
        { text: '雨', reading: 'あめ', meaningKo: '비',     vocabId: 'v_n5_15', kind: 'vocab' },
        { text: '朝', reading: 'あさ', meaningKo: '아침',   vocabId: 'v_n5_24', kind: 'vocab' },
      ],
      [
        { text: '傘', reading: 'かさ', meaningKo: '우산', kind: 'noun' },
      ],
      [
        { text: '駅',     reading: 'えき',     meaningKo: '역',    vocabId: 'v_n5_40', kind: 'vocab' },
        { text: '友だち', reading: 'ともだち', meaningKo: '친구',  vocabId: 'v_n5_10', kind: 'vocab' },
      ],
      [
        { text: '電車', reading: 'でんしゃ', meaningKo: '전철', kind: 'noun' },
        { text: '学校', reading: 'がっこう', meaningKo: '학교', vocabId: 'v_n5_4', kind: 'vocab' },
      ],
    ],
    tags: ['생활', '아침', '비', '학교'],
    estimatedMinutes: 2,
    sourceType: 'original',
  },

  {
    id: 'story_n5_005',
    type: 'daily_story',
    level: 'N5',
    titleJa: 'スーパーで買い物',
    titleKo: '슈퍼에서 장보기',
    summaryKo: '토요일 오후, 어머니와 함께 슈퍼에서 장을 보고 집에서 요리를 만든 이야기.',
    bodyJa: [
      '土曜日の午後、母とスーパーへ行きました。',
      '母は野菜と魚を買いました。',
      '私は安いお茶とパンを買いました。',
      '家でみんなで料理を作りました。',
    ],
    bodyReadings: [
      [{ text: '午後', reading: 'ごご' }, { text: '母', reading: 'はは' }],
      [{ text: '野菜', reading: 'やさい' }, { text: '魚', reading: 'さかな' }, { text: '買いました', reading: 'かいました' }],
      [{ text: '安い', reading: 'やすい' }],
      [{ text: '家', reading: 'いえ' }],
    ],
    bodyKo: [
      '토요일 오후, 어머니와 슈퍼에 갔습니다.',
      '어머니는 야채와 생선을 샀습니다.',
      '나는 싼 차와 빵을 샀습니다.',
      '집에서 다 함께 요리를 만들었습니다.',
    ],
    vocabularyIds: [],
    grammarIds: ['g_n5_3'],
    keyVocabularyIds: ['v_n5_70', 'v_n5_17', 'v_n5_35', 'v_n5_172', 'v_n5_121'],
    keyGrammarIds:    ['g_n5_3', 'g_n5_6'],
    bodyHighlights: [
      [
        { text: '土曜日', reading: 'どようび', meaningKo: '토요일',   vocabId: 'v_n5_70', kind: 'vocab' },
        { text: '母',     reading: 'はは',     meaningKo: '어머니',   vocabId: 'v_n5_17', kind: 'vocab' },
      ],
      [
        { text: '野菜', reading: 'やさい',   meaningKo: '야채', vocabId: 'v_n5_35',  kind: 'vocab' },
        { text: '魚',   reading: 'さかな',   meaningKo: '생선', vocabId: 'v_n5_172', kind: 'vocab' },
      ],
      [
        { text: '安い', reading: 'やすい', meaningKo: '싸다',  vocabId: 'v_n5_12', kind: 'vocab' },
        { text: 'お茶', reading: 'おちゃ', meaningKo: '차(음료)', vocabId: 'v_n5_37', kind: 'vocab' },
      ],
      [
        { text: '料理',     reading: 'りょうり',     meaningKo: '요리',         vocabId: 'v_n5_121', kind: 'vocab' },
        { text: '作りました', reading: 'つくりました', meaningKo: '만들었습니다', vocabId: 'v_n5_235', kind: 'vocab' },
      ],
    ],
    tags: ['생활', '가족', '쇼핑'],
    estimatedMinutes: 2,
    sourceType: 'original',
  },

  {
    id: 'story_n5_006',
    type: 'news_style',
    level: 'N5',
    titleJa: '駅で道を聞きました',
    titleKo: '역에서 길을 물었습니다',
    summaryKo: '아침 역에서 모르는 사람에게 길을 알려준 짧은 가상 기사.',
    bodyJa: [
      '月曜日の朝、駅で知らない人が道を聞きました。',
      '私は地図を見て、ゆっくり教えました。',
      '「ありがとう」と言って、その人は笑いました。',
      '少し元気になりました。',
    ],
    bodyReadings: [
      [{ text: '月曜日', reading: 'げつようび' }, { text: '駅', reading: 'えき' }, { text: '知らない', reading: 'しらない' }, { text: '人', reading: 'ひと' }, { text: '道', reading: 'みち' }, { text: '聞きました', reading: 'ききました' }],
      [{ text: '地図', reading: 'ちず' }, { text: '教えました', reading: 'おしえました' }],
      [{ text: '人', reading: 'ひと' }, { text: '笑いました', reading: 'わらいました' }],
      [{ text: '少し', reading: 'すこし' }],
    ],
    bodyKo: [
      '월요일 아침, 역에서 모르는 사람이 길을 물었습니다.',
      '나는 지도를 보고 천천히 가르쳐 주었습니다.',
      '"고맙습니다"라고 말하며 그 사람은 웃었습니다.',
      '조금 기분이 좋아졌습니다.',
    ],
    vocabularyIds: [],
    grammarIds: ['g_n5_6'],
    keyVocabularyIds: ['v_n5_40', 'v_n5_160', 'v_n5_50', 'v_n5_239', 'v_n5_101'],
    keyGrammarIds:    ['g_n5_6'],
    bodyHighlights: [
      [
        { text: '駅',         reading: 'えき',         meaningKo: '역',           vocabId: 'v_n5_40',  kind: 'vocab' },
        { text: '道',         reading: 'みち',         meaningKo: '길',           vocabId: 'v_n5_160', kind: 'vocab' },
        { text: '聞きました', reading: 'ききました',   meaningKo: '물었습니다',     vocabId: 'v_n5_50',  kind: 'vocab' },
      ],
      [
        { text: '地図',         reading: 'ちず',         meaningKo: '지도', kind: 'noun' },
        { text: '教えました',   reading: 'おしえました', meaningKo: '가르쳐 주었습니다', vocabId: 'v_n5_239', kind: 'vocab' },
      ],
      [
        { text: '笑いました', reading: 'わらいました', meaningKo: '웃었습니다', kind: 'verb' },
      ],
      [
        { text: '元気', reading: 'げんき', meaningKo: '기운/건강', vocabId: 'v_n5_101', kind: 'vocab' },
      ],
    ],
    tags: ['생활', '뉴스', '도움', '역'],
    estimatedMinutes: 2,
    sourceType: 'original',
  },

  {
    id: 'story_n5_007',
    type: 'short_story',
    level: 'N5',
    titleJa: '小さい手紙',
    titleKo: '작은 편지',
    summaryKo: '책상 위에서 발견한 작은 편지가 마음을 따뜻하게 한 짧은 단편.',
    bodyJa: [
      'ある日、机の上に小さい手紙がありました。',
      '「ありがとう」と書いてありました。',
      '私は誰が書いたのか分かりませんでした。',
      'でも、心がとても温かくなりました。',
      'その日、空が青く見えました。',
    ],
    bodyReadings: [
      [{ text: '机', reading: 'つくえ' }, { text: '上', reading: 'うえ' }, { text: '小さい', reading: 'ちいさい' }, { text: '手紙', reading: 'てがみ' }],
      [{ text: '書いて', reading: 'かいて' }],
      [{ text: '誰', reading: 'だれ' }, { text: '書いた', reading: 'かいた' }, { text: '分かりません', reading: 'わかりません' }],
      [{ text: '心', reading: 'こころ' }, { text: '温かく', reading: 'あたたかく' }],
      [{ text: '日', reading: 'ひ' }, { text: '空', reading: 'そら' }, { text: '青く', reading: 'あおく' }, { text: '見えました', reading: 'みえました' }],
    ],
    bodyKo: [
      '어느 날, 책상 위에 작은 편지가 있었습니다.',
      '"고마워"라고 적혀 있었습니다.',
      '나는 누가 썼는지 알 수 없었습니다.',
      '하지만 마음이 매우 따뜻해졌습니다.',
      '그날, 하늘이 푸르게 보였습니다.',
    ],
    vocabularyIds: [],
    grammarIds: ['g_n5_7'],
    keyVocabularyIds: ['v_n5_56', 'v_n5_48', 'v_n5_7', 'v_n5_123', 'v_n5_197'],
    keyGrammarIds:    ['g_n5_7'],
    bodyHighlights: [
      [
        { text: '小さい', reading: 'ちいさい', meaningKo: '작은',   vocabId: 'v_n5_56', kind: 'vocab' },
        { text: '手紙',   reading: 'てがみ',   meaningKo: '편지',   kind: 'noun' },
      ],
      [
        { text: '書いて', reading: 'かいて', meaningKo: '쓰여(있다)', vocabId: 'v_n5_48', kind: 'vocab' },
      ],
      [
        { text: '分かりません', reading: 'わかりません', meaningKo: '모르겠습니다', kind: 'verb' },
      ],
      [
        { text: '温かく', reading: 'あたたかく', meaningKo: '따뜻하게', kind: 'adj' },
      ],
      [
        { text: '空',     reading: 'そら',     meaningKo: '하늘',   vocabId: 'v_n5_123', kind: 'vocab' },
        { text: '青く',   reading: 'あおく',   meaningKo: '푸르게', kind: 'adj' },
      ],
    ],
    tags: ['단편', '감정', '편지'],
    estimatedMinutes: 3,
    sourceType: 'original',
  },

  {
    id: 'story_n5_008',
    type: 'short_story',
    level: 'N5',
    titleJa: '失くした傘',
    titleKo: '잃어버린 우산',
    summaryKo: '비 오는 날 버스에서 우산을 잃어버린 뒤 다시 찾은 짧은 단편.',
    bodyJa: [
      '雨の日、私はバスの中で傘を失くしました。',
      '次の日、バス会社に電話をしました。',
      '「黒くて小さい傘ですか」と聞かれました。',
      '「はい」と答えると、係の人は傘を持ってきました。',
      '本当にありがとうございました。',
    ],
    bodyReadings: [
      [{ text: '雨', reading: 'あめ' }, { text: '日', reading: 'ひ' }, { text: '中', reading: 'なか' }, { text: '傘', reading: 'かさ' }, { text: '失くしました', reading: 'なくしました' }],
      [{ text: '次', reading: 'つぎ' }, { text: '日', reading: 'ひ' }, { text: '電話', reading: 'でんわ' }],
      [{ text: '黒くて', reading: 'くろくて' }, { text: '小さい', reading: 'ちいさい' }, { text: '傘', reading: 'かさ' }, { text: '聞かれました', reading: 'きかれました' }],
      [{ text: '答える', reading: 'こたえる' }, { text: '答えると', reading: 'こたえると' }, { text: '係', reading: 'かかり' }, { text: '人', reading: 'ひと' }, { text: '傘', reading: 'かさ' }, { text: '持って', reading: 'もって' }],
      [{ text: '本当', reading: 'ほんとう' }],
    ],
    bodyKo: [
      '비 오는 날, 나는 버스 안에서 우산을 잃어버렸습니다.',
      '다음 날, 버스 회사에 전화를 했습니다.',
      '"검고 작은 우산입니까?"라고 물어봤습니다.',
      '"네"라고 대답하니, 직원이 우산을 가져왔습니다.',
      '정말 감사했습니다.',
    ],
    vocabularyIds: [],
    grammarIds: ['g_n5_7'],
    keyVocabularyIds: ['v_n5_15', 'v_n5_56', 'v_n5_50', 'v_n5_131', 'v_n5_234'],
    keyGrammarIds:    ['g_n5_7'],
    bodyHighlights: [
      [
        { text: '雨',           reading: 'あめ',         meaningKo: '비',           vocabId: 'v_n5_15', kind: 'vocab' },
        { text: '傘',           reading: 'かさ',         meaningKo: '우산',         kind: 'noun' },
        { text: '失くしました', reading: 'なくしました', meaningKo: '잃어버렸습니다', kind: 'verb' },
      ],
      [
        { text: '電話', reading: 'でんわ', meaningKo: '전화', kind: 'noun' },
      ],
      [
        { text: '黒くて', reading: 'くろくて', meaningKo: '검고', kind: 'adj' },
        { text: '小さい', reading: 'ちいさい', meaningKo: '작은', vocabId: 'v_n5_56', kind: 'vocab' },
      ],
      [
        { text: '係',   reading: 'かかり', meaningKo: '담당자',     kind: 'noun' },
        { text: '持って', reading: 'もって', meaningKo: '가지고/들고', vocabId: 'v_n5_234', kind: 'vocab' },
      ],
      [
        { text: '本当', reading: 'ほんとう', meaningKo: '정말', kind: 'noun' },
      ],
    ],
    tags: ['단편', '비', '버스'],
    estimatedMinutes: 3,
    sourceType: 'original',
  },

  // ─── N4 1차 시드 (라운드 14) ────────────────────────────────────────
  {
    id:'story_n4_001', type:'daily_story', level:'N4',
    titleJa:'新しい職場の一日', titleKo:'새 직장에서의 하루',
    summaryKo:'새 회사에 출근한 첫날의 짧은 이야기.',
    bodyJa:[
      '先週から新しい会社で働き始めました。',
      '初日はとても緊張しましたが、みなさんが優しく教えてくれました。',
      '部長に紹介してもらい、自分の席まで案内されました。',
      '昼休みに同僚とランチへ行き、少し話せて安心しました。',
      '明日からも頑張ろうと思います。',
    ],
    bodyReadings:[
      [{text:'先週',reading:'せんしゅう'},{text:'新しい',reading:'あたらしい'},{text:'会社',reading:'かいしゃ'},{text:'働き始め',reading:'はたらきはじめ'}],
      [{text:'初日',reading:'しょにち'},{text:'緊張',reading:'きんちょう'},{text:'優しく',reading:'やさしく'},{text:'教えて',reading:'おしえて'}],
      [{text:'部長',reading:'ぶちょう'},{text:'紹介',reading:'しょうかい'},{text:'自分',reading:'じぶん'},{text:'席',reading:'せき'},{text:'案内',reading:'あんない'}],
      [{text:'昼休み',reading:'ひるやすみ'},{text:'同僚',reading:'どうりょう'},{text:'少し',reading:'すこし'},{text:'話せて',reading:'はなせて'},{text:'安心',reading:'あんしん'}],
      [{text:'明日',reading:'あした'},{text:'頑張ろう',reading:'がんばろう'},{text:'思います',reading:'おもいます'}],
    ],
    bodyKo:[
      '지난주부터 새 회사에서 일하기 시작했습니다.',
      '첫날은 매우 긴장했지만, 모두가 친절히 가르쳐 주었습니다.',
      '부장님에게 소개받고, 제 자리까지 안내되었습니다.',
      '점심시간에 동료와 점심을 먹으러 가서 조금 얘기할 수 있어 안심했습니다.',
      '내일부터도 열심히 하려고 합니다.',
    ],
    vocabularyIds:[],
    grammarIds:['g_n4_22','g_n4_38'],
    keyVocabularyIds:['v_n4_61','v_n4_39','v_n4_48','v_n4_100','v_n4_193'],
    keyGrammarIds:['g_n4_22','g_n4_38'],
    bodyHighlights:[
      [{text:'先週',reading:'せんしゅう',meaningKo:'지난주',kind:'time'},
       {text:'働き始め',reading:'はたらきはじめ',meaningKo:'일하기 시작',kind:'verb'}],
      [{text:'緊張',reading:'きんちょう',meaningKo:'긴장',kind:'noun'},
       {text:'優しく',reading:'やさしく',meaningKo:'친절히',kind:'adj'}],
      [{text:'部長',reading:'ぶちょう',meaningKo:'부장',vocabId:'v_n4_61',kind:'vocab'},
       {text:'紹介',reading:'しょうかい',meaningKo:'소개',vocabId:'v_n4_39',kind:'vocab'}],
      [{text:'昼休み',reading:'ひるやすみ',meaningKo:'점심시간',vocabId:'v_n4_48',kind:'vocab'},
       {text:'安心',reading:'あんしん',meaningKo:'안심',kind:'noun'}],
      [{text:'頑張ろう',reading:'がんばろう',meaningKo:'열심히 하자',vocabId:'v_n4_100',kind:'vocab'}],
    ],
    tags:['생활','회사','첫날'], estimatedMinutes:3, sourceType:'original',
  },

  {
    id:'story_n4_002', type:'daily_story', level:'N4',
    titleJa:'病院での一日', titleKo:'병원에서의 하루',
    summaryKo:'감기에 걸려 병원에 다녀온 짧은 이야기.',
    bodyJa:[
      '昨日から熱があって、頭も痛かったです。',
      '今朝、近くの病院へ行きました。',
      '受付で保険証を見せて、しばらく待ちました。',
      '医者が「風邪ですね。三日休んでください」と言いました。',
      '薬をもらって、家で寝ました。',
    ],
    bodyReadings:[
      [{text:'昨日',reading:'きのう'},{text:'熱',reading:'ねつ'},{text:'頭',reading:'あたま'},{text:'痛かった',reading:'いたかった'}],
      [{text:'今朝',reading:'けさ'},{text:'近く',reading:'ちかく'},{text:'病院',reading:'びょういん'},{text:'行きました',reading:'いきました'}],
      [{text:'受付',reading:'うけつけ'},{text:'保険証',reading:'ほけんしょう'},{text:'見せて',reading:'みせて'},{text:'待ちました',reading:'まちました'}],
      [{text:'医者',reading:'いしゃ'},{text:'風邪',reading:'かぜ'},{text:'三日',reading:'みっか'},{text:'休んで',reading:'やすんで'},{text:'言いました',reading:'いいました'}],
      [{text:'薬',reading:'くすり'},{text:'家',reading:'いえ'},{text:'寝ました',reading:'ねました'}],
    ],
    bodyKo:[
      '어제부터 열이 있고 머리도 아팠습니다.',
      '오늘 아침, 근처 병원에 갔습니다.',
      '접수처에서 보험증을 보여주고 잠시 기다렸습니다.',
      '의사가 "감기네요. 사흘 쉬세요"라고 말했습니다.',
      '약을 받고 집에서 잤습니다.',
    ],
    vocabularyIds:[],
    grammarIds:['g_n5_13','g_n4_37'],
    keyVocabularyIds:['v_n4_148','v_n4_149','v_n4_147','v_n4_150','v_n4_56'],
    keyGrammarIds:['g_n5_13'],
    bodyHighlights:[
      [{text:'熱',reading:'ねつ',meaningKo:'열',vocabId:'v_n4_148',kind:'vocab'},
       {text:'頭',reading:'あたま',meaningKo:'머리',kind:'noun'},
       {text:'痛かった',reading:'いたかった',meaningKo:'아팠다',kind:'adj'}],
      [{text:'病院',reading:'びょういん',meaningKo:'병원',vocabId:'v_n4_147',kind:'vocab'}],
      [{text:'受付',reading:'うけつけ',meaningKo:'접수처',vocabId:'v_n4_56',kind:'vocab'},
       {text:'保険証',reading:'ほけんしょう',meaningKo:'보험증',kind:'noun'}],
      [{text:'医者',reading:'いしゃ',meaningKo:'의사',kind:'noun'},
       {text:'風邪',reading:'かぜ',meaningKo:'감기',kind:'noun'}],
      [{text:'薬',reading:'くすり',meaningKo:'약',vocabId:'v_n4_150',kind:'vocab'}],
    ],
    tags:['생활','병원','감기'], estimatedMinutes:3, sourceType:'original',
  },

  {
    id:'story_n4_003', type:'news_style', level:'N4',
    titleJa:'駅の新しいルール', titleKo:'역의 새로운 규칙',
    summaryKo:'역에서 시작된 새 안내 규칙에 대한 가상 기사.',
    bodyJa:[
      '来月から駅で新しいルールが始まります。',
      'エスカレーターでは歩かないでください。両側に立ちます。',
      'これは事故を減らすためのルールです。',
      '駅員は「みなさんの安全のために協力してください」と話しています。',
    ],
    bodyReadings:[
      [{text:'来月',reading:'らいげつ'},{text:'駅',reading:'えき'},{text:'新しい',reading:'あたらしい'},{text:'始まり',reading:'はじまり'}],
      [{text:'歩かない',reading:'あるかない'},{text:'両側',reading:'りょうがわ'},{text:'立ちます',reading:'たちます'}],
      [{text:'事故',reading:'じこ'},{text:'減らす',reading:'へらす'}],
      [{text:'駅員',reading:'えきいん'},{text:'安全',reading:'あんぜん'},{text:'協力',reading:'きょうりょく'},{text:'話して',reading:'はなして'}],
    ],
    bodyKo:[
      '다음 달부터 역에서 새 규칙이 시작됩니다.',
      '에스컬레이터에서는 걷지 말아 주세요. 양쪽에 섭니다.',
      '이는 사고를 줄이기 위한 규칙입니다.',
      '역무원은 "모두의 안전을 위해 협력해 주세요"라고 말하고 있습니다.',
    ],
    vocabularyIds:[],
    grammarIds:['g_n4_16','g_n5_13'],
    keyVocabularyIds:['v_n4_157','v_n4_154','v_n4_158','v_n4_208','v_n4_125'],
    keyGrammarIds:['g_n4_16'],
    bodyHighlights:[
      [{text:'駅',reading:'えき',meaningKo:'역',kind:'noun'},
       {text:'新しい',reading:'あたらしい',meaningKo:'새로운',kind:'adj'}],
      [{text:'歩かない',reading:'あるかない',meaningKo:'걷지 않다',kind:'verb'},
       {text:'両側',reading:'りょうがわ',meaningKo:'양쪽',kind:'noun'}],
      [{text:'事故',reading:'じこ',meaningKo:'사고',kind:'noun'},
       {text:'減らす',reading:'へらす',meaningKo:'줄이다',vocabId:'v_n4_208',kind:'vocab'}],
      [{text:'安全',reading:'あんぜん',meaningKo:'안전',vocabId:'v_n4_154',kind:'vocab'},
       {text:'協力',reading:'きょうりょく',meaningKo:'협력',kind:'noun'}],
    ],
    tags:['뉴스','교통','안전'], estimatedMinutes:2, sourceType:'original',
  },

  {
    id:'story_n4_004', type:'daily_story', level:'N4',
    titleJa:'引っ越しの準備', titleKo:'이사 준비',
    summaryKo:'다음 달 이사를 준비하는 짧은 일상 이야기.',
    bodyJa:[
      '来月、駅の近くに引っ越すことになりました。',
      '友だちが手伝ってくれるので、とても助かります。',
      '今、古い家具を全部売ったり、捨てたりしています。',
      '新しい部屋は今より小さいですが、駅に近くて便利です。',
      '楽しみにしています。',
    ],
    bodyReadings:[
      [{text:'来月',reading:'らいげつ'},{text:'駅',reading:'えき'},{text:'近く',reading:'ちかく'},{text:'引っ越す',reading:'ひっこす'}],
      [{text:'友だち',reading:'ともだち'},{text:'手伝って',reading:'てつだって'},{text:'助かり',reading:'たすかり'}],
      [{text:'今',reading:'いま'},{text:'古い',reading:'ふるい'},{text:'家具',reading:'かぐ'},{text:'全部',reading:'ぜんぶ'},{text:'売ったり',reading:'うったり'},{text:'捨てたり',reading:'すてたり'}],
      [{text:'新しい',reading:'あたらしい'},{text:'部屋',reading:'へや'},{text:'小さい',reading:'ちいさい'},{text:'駅',reading:'えき'},{text:'近くて',reading:'ちかくて'},{text:'便利',reading:'べんり'}],
      [{text:'楽しみ',reading:'たのしみ'}],
    ],
    bodyKo:[
      '다음 달, 역 근처로 이사하게 되었습니다.',
      '친구가 도와줘서 정말 도움이 됩니다.',
      '지금은 낡은 가구를 다 팔거나 버리고 있습니다.',
      '새 방은 지금보다 작지만 역에 가까워서 편리합니다.',
      '기대하고 있습니다.',
    ],
    vocabularyIds:[],
    grammarIds:['g_n4_21','g_n4_6'],
    keyVocabularyIds:['v_n4_85','v_n4_86','v_n4_84','v_n4_18','v_n4_135'],
    keyGrammarIds:['g_n4_21','g_n4_6'],
    bodyHighlights:[
      [{text:'引っ越す',reading:'ひっこす',meaningKo:'이사하다',vocabId:'v_n4_86',kind:'vocab'}],
      [{text:'手伝って',reading:'てつだって',meaningKo:'도와줘서',vocabId:'v_n4_18',kind:'vocab'}],
      [{text:'古い',reading:'ふるい',meaningKo:'낡은',kind:'adj'},
       {text:'家具',reading:'かぐ',meaningKo:'가구',vocabId:'v_n4_84',kind:'vocab'},
       {text:'売ったり',reading:'うったり',meaningKo:'팔거나',kind:'verb'}],
      [{text:'新しい',reading:'あたらしい',meaningKo:'새로운',kind:'adj'},
       {text:'便利',reading:'べんり',meaningKo:'편리',kind:'adj'}],
      [{text:'楽しみ',reading:'たのしみ',meaningKo:'기대',kind:'noun'}],
    ],
    tags:['생활','이사'], estimatedMinutes:3, sourceType:'original',
  },

  {
    id:'story_n4_005', type:'short_story', level:'N4',
    titleJa:'最後のバス', titleKo:'마지막 버스',
    summaryKo:'야근 후 마지막 버스를 탔던 늦은 밤의 짧은 단편.',
    bodyJa:[
      '会社の残業が終わったのは夜十時でした。',
      '駅まで急いだけれど、最後のバスはもう出てしまいました。',
      '雨が少し降っていて、寒かったです。',
      'タクシーを呼ぼうかと思いましたが、料金が高すぎます。',
      '結局、コンビニで温かいお茶を買って、ゆっくり歩いて帰りました。',
      '長い夜でしたが、静かな道は少し気持ちよかったです。',
    ],
    bodyReadings:[
      [{text:'会社',reading:'かいしゃ'},{text:'残業',reading:'ざんぎょう'},{text:'終わった',reading:'おわった'},{text:'夜',reading:'よる'},{text:'十時',reading:'じゅうじ'}],
      [{text:'駅',reading:'えき'},{text:'急いだ',reading:'いそいだ'},{text:'最後',reading:'さいご'},{text:'出て',reading:'でて'}],
      [{text:'雨',reading:'あめ'},{text:'少し',reading:'すこし'},{text:'降って',reading:'ふって'},{text:'寒かった',reading:'さむかった'}],
      [{text:'呼ぼう',reading:'よぼう'},{text:'思いました',reading:'おもいました'},{text:'料金',reading:'りょうきん'},{text:'高すぎ',reading:'たかすぎ'}],
      [{text:'結局',reading:'けっきょく'},{text:'温かい',reading:'あたたかい'},{text:'お茶',reading:'おちゃ'},{text:'買って',reading:'かって'},{text:'歩いて',reading:'あるいて'},{text:'帰り',reading:'かえり'}],
      [{text:'長い',reading:'ながい'},{text:'夜',reading:'よる'},{text:'静かな',reading:'しずかな'},{text:'道',reading:'みち'},{text:'気持ちよかった',reading:'きもちよかった'}],
    ],
    bodyKo:[
      '회사 야근이 끝난 것은 밤 10시였습니다.',
      '역까지 서둘렀지만 마지막 버스는 이미 떠나 버렸습니다.',
      '비가 조금 내리고 있어서 추웠습니다.',
      '택시를 부를까 생각했지만, 요금이 너무 비쌌습니다.',
      '결국, 편의점에서 따뜻한 차를 사서 천천히 걸어서 돌아갔습니다.',
      '긴 밤이었지만, 조용한 길은 조금 기분이 좋았습니다.',
    ],
    vocabularyIds:[],
    grammarIds:['g_n4_1','g_n4_12','g_n4_38'],
    keyVocabularyIds:['v_n4_64','v_n4_211','v_n4_193','v_n4_66','v_n4_19'],
    keyGrammarIds:['g_n4_1','g_n4_12'],
    bodyHighlights:[
      [{text:'残業',reading:'ざんぎょう',meaningKo:'야근',vocabId:'v_n4_64',kind:'vocab'}],
      [{text:'最後',reading:'さいご',meaningKo:'마지막',vocabId:'v_n4_211',kind:'vocab'},
       {text:'出て',reading:'でて',meaningKo:'떠나',kind:'verb'}],
      [{text:'雨',reading:'あめ',meaningKo:'비',kind:'noun'},
       {text:'寒かった',reading:'さむかった',meaningKo:'추웠다',kind:'adj'}],
      [{text:'料金',reading:'りょうきん',meaningKo:'요금',kind:'noun'},
       {text:'高すぎ',reading:'たかすぎ',meaningKo:'너무 비싸다',kind:'adj'}],
      [{text:'温かい',reading:'あたたかい',meaningKo:'따뜻한',kind:'adj'},
       {text:'歩いて',reading:'あるいて',meaningKo:'걸어서',kind:'verb'}],
      [{text:'静かな',reading:'しずかな',meaningKo:'조용한',kind:'adj'}],
    ],
    tags:['단편','밤','퇴근'], estimatedMinutes:4, sourceType:'original',
  },

  {
    id:'story_n4_006', type:'short_story', level:'N4',
    titleJa:'祖母の手紙', titleKo:'할머니의 편지',
    summaryKo:'서랍에서 발견한 할머니의 오래된 편지에 대한 단편.',
    bodyJa:[
      '机の引き出しに古い手紙を見つけました。',
      '祖母が私に送ってくれたものでした。',
      '「元気にしていますか。たまには遊びにきてください」と書いてありました。',
      '読み終わったとき、急に祖母に会いたくなりました。',
      '電話をかけたら、祖母はとても喜んでくれました。',
      '今度の週末、祖母の家に行くことにしました。',
    ],
    bodyReadings:[
      [{text:'机',reading:'つくえ'},{text:'引き出し',reading:'ひきだし'},{text:'古い',reading:'ふるい'},{text:'手紙',reading:'てがみ'},{text:'見つけ',reading:'みつけ'}],
      [{text:'祖母',reading:'そぼ'},{text:'私',reading:'わたし'},{text:'送って',reading:'おくって'}],
      [{text:'元気',reading:'げんき'},{text:'遊び',reading:'あそび'},{text:'書いて',reading:'かいて'}],
      [{text:'読み終わった',reading:'よみおわった'},{text:'急に',reading:'きゅうに'},{text:'祖母',reading:'そぼ'},{text:'会いたく',reading:'あいたく'}],
      [{text:'電話',reading:'でんわ'},{text:'喜んで',reading:'よろこんで'}],
      [{text:'今度',reading:'こんど'},{text:'週末',reading:'しゅうまつ'},{text:'家',reading:'いえ'},{text:'行く',reading:'いく'}],
    ],
    bodyKo:[
      '책상 서랍에서 오래된 편지를 발견했습니다.',
      '할머니가 저에게 보내신 것이었습니다.',
      '"잘 지내고 있나요? 가끔은 놀러 와 주세요"라고 적혀 있었습니다.',
      '다 읽었을 때, 갑자기 할머니가 보고 싶어졌습니다.',
      '전화를 걸자 할머니는 정말 기뻐해 주셨습니다.',
      '이번 주말, 할머니 댁에 가기로 했습니다.',
    ],
    vocabularyIds:[],
    grammarIds:['g_n4_25','g_n4_20','g_n4_19'],
    keyVocabularyIds:['v_n4_170','v_n4_16','v_n4_185','v_n4_20','v_n4_175'],
    keyGrammarIds:['g_n4_25','g_n4_20'],
    bodyHighlights:[
      [{text:'机',reading:'つくえ',meaningKo:'책상',kind:'noun'},
       {text:'手紙',reading:'てがみ',meaningKo:'편지',kind:'noun'},
       {text:'見つけ',reading:'みつけ',meaningKo:'발견하다',vocabId:'v_n4_16',kind:'vocab'}],
      [{text:'祖母',reading:'そぼ',meaningKo:'할머니',vocabId:'v_n4_170',kind:'vocab'}],
      [{text:'元気',reading:'げんき',meaningKo:'건강·잘 지냄',vocabId:'v_n4_101',kind:'vocab'}],
      [{text:'急に',reading:'きゅうに',meaningKo:'갑자기',vocabId:'v_n4_245',kind:'vocab'},
       {text:'会いたく',reading:'あいたく',meaningKo:'만나고 싶어',kind:'verb'}],
      [{text:'電話',reading:'でんわ',meaningKo:'전화',kind:'noun'},
       {text:'喜んで',reading:'よろこんで',meaningKo:'기뻐하며',vocabId:'v_n4_185',kind:'vocab'}],
      [{text:'週末',reading:'しゅうまつ',meaningKo:'주말',kind:'time'}],
    ],
    tags:['단편','가족','편지'], estimatedMinutes:4, sourceType:'original',
  },
];

/** 이야기 탭 — daily/news 스타일. */
export function getStoriesForListing() {
  return stories.filter(s => s.type === 'daily_story' || s.type === 'news_style');
}

/** 단편 소설 탭. */
export function getNovelsForListing() {
  return stories.filter(s => s.type === 'short_story');
}

export function findStory(id) {
  return stories.find(s => s.id === id) || null;
}
