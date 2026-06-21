// 오프라인 AI 회화 모듈이 사용할 주제별 데이터.
//
// 본 파일은 *데이터 / 인터페이스 준비* 단계이고, 실제 STT/LLM/TTS 는 아직 붙이지 않음.
// 회화 엔진의 제약:
//   - 질문/예시 답변은 사용자가 학습할 수 있는 N5 어휘·문법 안에서만 구성.
//   - requiredVocabIds / requiredGrammarIds 는 반드시 실제 data/vocab.js / data/grammar.js
//     의 id 를 참조해야 한다 (smoke.mjs 가 자동 검증).
//
// 필드:
//   id, level, titleKo, situationTags[]
//   requiredVocabIds[]      — 이 주제를 수행하려면 알아야 할 어휘 id
//   requiredGrammarIds[]    — 이 주제에 필요한 문법 id
//   starterQuestions[]      — AI 가 먼저 던질 질문 후보
//     { ja, ko, expectedPatterns[], sampleAnswers[{ja,ko}] }
//   repairHints[]           — 사용자 답변에서 자주 발생할 수 있는 오류와 교정 힌트
//     { issue, ko, exampleJa }

export const conversationTopics = [
  {
    id: 'conv_n5_self_intro',
    level: 'N5',
    titleKo: '자기소개',
    situationTags: ['인사','이름','국적','공부'],
    requiredVocabIds:   ['v_n5_20', 'v_n5_19', 'v_n5_18', 'v_n5_39'], // 名前 学生 先生 大学
    requiredGrammarIds: ['g_n5_1', 'g_n5_18'],                         // 〜は〜です / 〜の〜
    starterQuestions: [
      {
        ja: 'お名前は何ですか。',
        ko: '이름이 무엇입니까?',
        expectedPatterns: ['〜は〜です'],
        sampleAnswers: [
          { ja: '私はミンです。',           ko: '저는 민입니다.' },
          { ja: '私の名前はミンです。',     ko: '제 이름은 민입니다.' },
        ],
      },
      {
        ja: '学生ですか。',
        ko: '학생입니까?',
        expectedPatterns: ['はい、〜です','いいえ、〜じゃありません'],
        sampleAnswers: [
          { ja: 'はい、学生です。',         ko: '네, 학생입니다.' },
          { ja: 'いいえ、会社員です。',     ko: '아니요, 회사원입니다.' },
        ],
      },
    ],
    repairHints: [
      { issue: 'missing_desu',
        ko: '문장 끝에 です를 붙이면 더 정중하고 자연스럽습니다.',
        exampleJa: '私はミンです。' },
      { issue: 'use_no_possessive',
        ko: '소유 관계는 「の」로 표시합니다.',
        exampleJa: '私の名前はミンです。' },
    ],
  },

  {
    id: 'conv_n5_family',
    level: 'N5',
    titleKo: '가족',
    situationTags: ['가족','수','반려동물'],
    requiredVocabIds:   ['v_n5_16', 'v_n5_17', 'v_n5_31', 'v_n5_32'],  // 父 母 犬 猫
    requiredGrammarIds: ['g_n5_7', 'g_n5_8', 'g_n5_1'],                 // あります います 〜は〜です
    starterQuestions: [
      {
        ja: 'ご家族は何人ですか。',
        ko: '가족은 몇 명입니까?',
        expectedPatterns: ['〜人です','〜は〜です'],
        sampleAnswers: [
          { ja: '四人です。父と母と妹と私です。', ko: '4명입니다. 아버지, 어머니, 여동생, 저입니다.' },
        ],
      },
      {
        ja: 'ペットがいますか。',
        ko: '반려동물이 있습니까?',
        expectedPatterns: ['〜がいます','〜はいません'],
        sampleAnswers: [
          { ja: 'はい、犬がいます。',       ko: '네, 개가 있습니다.' },
          { ja: 'いいえ、いません。',       ko: '아니요, 없습니다.' },
        ],
      },
    ],
    repairHints: [
      { issue: 'arimasu_vs_imasu',
        ko: '사람·동물의 존재는 「います」, 사물·식물은 「あります」를 씁니다.',
        exampleJa: '犬がいます。' },
    ],
  },

  {
    id: 'conv_n5_cafe',
    level: 'N5',
    titleKo: '카페 주문',
    situationTags: ['주문','음식점','음료'],
    requiredVocabIds:   ['v_n5_3', 'v_n5_37', 'v_n5_46'],   // 飲む お茶 買う
    requiredGrammarIds: ['g_n5_13', 'g_n5_6'],               // 〜てください 〜を〜ます
    starterQuestions: [
      {
        ja: 'ご注文は何にしますか。',
        ko: '주문은 무엇으로 하시겠습니까?',
        expectedPatterns: ['〜をください','〜をお願いします'],
        sampleAnswers: [
          { ja: 'コーヒーをください。',         ko: '커피 주세요.' },
          { ja: 'お茶を一つお願いします。',     ko: '차 한 잔 부탁합니다.' },
        ],
      },
      {
        ja: 'お砂糖は入れますか。',
        ko: '설탕은 넣을까요?',
        expectedPatterns: ['はい','いいえ'],
        sampleAnswers: [
          { ja: 'はい、お願いします。',     ko: '네, 부탁합니다.' },
          { ja: 'いいえ、結構です。',       ko: '아니요, 괜찮습니다.' },
        ],
      },
    ],
    repairHints: [
      { issue: 'use_kudasai',
        ko: '주문할 때는 「〜をください」가 가장 자연스럽습니다.',
        exampleJa: 'コーヒーをください。' },
    ],
  },

  {
    id: 'conv_n5_directions',
    level: 'N5',
    titleKo: '길 묻기',
    situationTags: ['길안내','장소','위치'],
    requiredVocabIds:   ['v_n5_40', 'v_n5_43', 'v_n5_42', 'v_n5_41', 'v_n5_44'], // 駅 公園 病院 銀行 店
    requiredGrammarIds: ['g_n5_7', 'g_n5_4'],                                     // あります 〜で〜する
    starterQuestions: [
      {
        ja: 'すみません、駅はどこですか。',
        ko: '실례합니다, 역은 어디입니까?',
        expectedPatterns: ['〜にあります','あそこです'],
        sampleAnswers: [
          { ja: '駅はあそこです。',                       ko: '역은 저쪽입니다.' },
          { ja: 'あの公園の隣にあります。',               ko: '저 공원 옆에 있습니다.' },
        ],
      },
    ],
    repairHints: [
      { issue: 'koko_soko_asoko',
        ko: '거리에 따라 ここ(여기) / そこ(거기) / あそこ(저기) 를 구분합니다.',
        exampleJa: '駅はあそこです。' },
    ],
  },

  {
    id: 'conv_n5_appointment',
    level: 'N5',
    titleKo: '약속 정하기',
    situationTags: ['약속','시간','권유'],
    requiredVocabIds:   ['v_n5_21', 'v_n5_22', 'v_n5_26', 'v_n5_10', 'v_n5_6'],  // 今日 明日 月曜日 友だち 行く
    requiredGrammarIds: ['g_n5_3', 'g_n5_11', 'g_n5_10'],                          // 〜に行く 〜ませんか 〜ましょう
    starterQuestions: [
      {
        ja: '明日、一緒に映画を見ませんか。',
        ko: '내일 같이 영화 보지 않을래요?',
        expectedPatterns: ['はい〜ましょう','いいですね'],
        sampleAnswers: [
          { ja: 'はい、見ましょう。',           ko: '네, 봅시다.' },
          { ja: 'いいですね、行きましょう。',   ko: '좋네요, 갑시다.' },
        ],
      },
      {
        ja: '何時に会いましょうか。',
        ko: '몇 시에 만날까요?',
        expectedPatterns: ['〜時に'],
        sampleAnswers: [
          { ja: '三時はどうですか。',           ko: '3시는 어떻습니까?' },
        ],
      },
    ],
    repairHints: [
      { issue: 'masen_ka_for_invite',
        ko: '권유할 때는 「〜ませんか」가 부드러운 어감입니다.',
        exampleJa: '一緒に映画を見ませんか。' },
    ],
  },

  {
    id: 'conv_n5_weather_routine',
    level: 'N5',
    titleKo: '날씨·하루 일과',
    situationTags: ['날씨','일과','시간'],
    requiredVocabIds:   ['v_n5_15', 'v_n5_57', 'v_n5_58', 'v_n5_24', 'v_n5_51', 'v_n5_52'], // 雨 暑い 寒い 朝 起きる 寝る
    requiredGrammarIds: ['g_n5_5', 'g_n5_1'],                                                  // 〜ています 〜は〜です
    starterQuestions: [
      {
        ja: '今日の天気はどうですか。',
        ko: '오늘 날씨는 어떻습니까?',
        expectedPatterns: ['〜です','〜ています'],
        sampleAnswers: [
          { ja: '今日は暑いです。',             ko: '오늘은 덥습니다.' },
          { ja: '雨が降っています。',           ko: '비가 내리고 있습니다.' },
        ],
      },
      {
        ja: '毎朝、何時に起きますか。',
        ko: '매일 아침 몇 시에 일어납니까?',
        expectedPatterns: ['〜時に起きます'],
        sampleAnswers: [
          { ja: '七時に起きます。',             ko: '7시에 일어납니다.' },
        ],
      },
    ],
    repairHints: [
      { issue: 'use_te_imasu_for_progress',
        ko: '진행 중인 상태는 「〜ています」로 표현합니다.',
        exampleJa: '雨が降っています。' },
    ],
  },

  // ── N5 대량 확장 1차 — 4 신규 주제 ─────────────────────────────
  {
    id: 'conv_n5_school_life',
    level: 'N5',
    titleKo: '학교 생활',
    situationTags: ['학교','수업','공부','일상'],
    requiredVocabIds:   ['v_n5_4','v_n5_19','v_n5_18','v_n5_82','v_n5_85','v_n5_119','v_n5_84','v_n5_189'], // 学校 学생 先생 교실 공부 수업 숙제 영어
    requiredGrammarIds: ['g_n5_1','g_n5_3','g_n5_6'],
    starterQuestions: [
      {
        ja: '何の授業がありますか。',
        ko: '무슨 수업이 있습니까?',
        expectedPatterns: ['〜は〜です','〜が〜です'],
        sampleAnswers: [
          { ja: '英語の授業があります。',     ko: '영어 수업이 있습니다.' },
          { ja: '日本語の授業です。',         ko: '일본어 수업입니다.' },
        ],
      },
      {
        ja: '宿題はもう終わりましたか。',
        ko: '숙제는 벌써 끝났습니까?',
        expectedPatterns: ['もう〜ました','まだ〜ません'],
        sampleAnswers: [
          { ja: 'はい、もう終わりました。',   ko: '네, 벌써 끝났습니다.' },
          { ja: 'いいえ、まだです。',         ko: '아니요, 아직입니다.' },
        ],
      },
    ],
    repairHints: [
      { issue: 'use_no_for_modifier',
        ko: '명사를 명사가 수식할 때는 「の」로 잇습니다.',
        exampleJa: '英語の授業' },
    ],
  },

  {
    id: 'conv_n5_shopping',
    level: 'N5',
    titleKo: '쇼핑',
    situationTags: ['쇼핑','가격','선택'],
    requiredVocabIds:   ['v_n5_46','v_n5_80','v_n5_81','v_n5_44','v_n5_177','v_n5_178','v_n5_179','v_n5_182'], // 買う お金 円 店 デパート 切符 値段 セール
    requiredGrammarIds: ['g_n5_1','g_n5_6','g_n5_36'],
    starterQuestions: [
      {
        ja: '何を買いますか。',
        ko: '무엇을 살 겁니까?',
        expectedPatterns: ['〜を〜ます'],
        sampleAnswers: [
          { ja: '本を買います。',             ko: '책을 삽니다.' },
          { ja: 'シャツを買いたいです。',     ko: '셔츠를 사고 싶습니다.' },
        ],
      },
      {
        ja: 'これはいくらですか。',
        ko: '이것은 얼마입니까?',
        expectedPatterns: ['〜は〜です','〜は〜ですか'],
        sampleAnswers: [
          { ja: '五百円です。',               ko: '500엔입니다.' },
          { ja: '千円です。',                 ko: '1000엔입니다.' },
        ],
      },
    ],
    repairHints: [
      { issue: 'price_units',
        ko: '가격은 「数字+円」 형태로 말합니다.',
        exampleJa: '千円です。' },
    ],
  },

  {
    id: 'conv_n5_phone',
    level: 'N5',
    titleKo: '전화하기',
    situationTags: ['전화','약속','시간'],
    requiredVocabIds:   ['v_n5_22','v_n5_10','v_n5_53','v_n5_72','v_n5_105','v_n5_107','v_n5_108','v_n5_150'], // 明日 友だち 来る 今 一時 半 後 時
    requiredGrammarIds: ['g_n5_10','g_n5_11','g_n5_36'],
    starterQuestions: [
      {
        ja: 'もしもし、田中さんですか。',
        ko: '여보세요, 다나카 씨입니까?',
        expectedPatterns: ['〜は〜です','はい、〜です'],
        sampleAnswers: [
          { ja: 'はい、田中です。',           ko: '네, 다나카입니다.' },
          { ja: 'いいえ、違います。',         ko: '아니요, 아닙니다.' },
        ],
      },
      {
        ja: '明日、何時に会いましょうか。',
        ko: '내일 몇 시에 만날까요?',
        expectedPatterns: ['〜時に','〜ましょう','〜時半'],
        sampleAnswers: [
          { ja: '三時に会いましょう。',       ko: '3시에 만납시다.' },
          { ja: '三時半はどうですか。',       ko: '3시 반은 어떻습니까?' },
        ],
      },
    ],
    repairHints: [
      { issue: 'phone_greeting',
        ko: '전화 첫인사는 「もしもし」.',
        exampleJa: 'もしもし、田中です。' },
    ],
  },

  {
    id: 'conv_n5_hospital',
    level: 'N5',
    titleKo: '병원·약국',
    situationTags: ['병원','건강','몸','약'],
    requiredVocabIds:   ['v_n5_42','v_n5_229','v_n5_230','v_n5_221','v_n5_227','v_n5_228','v_n5_223'], // 病院 의사 약 目 頭 体 口
    requiredGrammarIds: ['g_n5_1','g_n5_5','g_n5_13'],
    starterQuestions: [
      {
        ja: 'どこが痛いですか。',
        ko: '어디가 아픕니까?',
        expectedPatterns: ['〜が〜です','〜は〜です'],
        sampleAnswers: [
          { ja: '頭が痛いです。',             ko: '머리가 아픕니다.' },
          { ja: 'お腹が痛いです。',           ko: '배가 아픕니다.' },
        ],
      },
      {
        ja: 'いつから痛いですか。',
        ko: '언제부터 아픕니까?',
        expectedPatterns: ['〜から','〜です'],
        sampleAnswers: [
          { ja: '昨日からです。',             ko: '어제부터입니다.' },
          { ja: '今朝からです。',             ko: '오늘 아침부터입니다.' },
        ],
      },
    ],
    repairHints: [
      { issue: 'body_part_subject',
        ko: '몸의 부위 + 「が」 + 형용사 「痛い」 형태로 말합니다.',
        exampleJa: '頭が痛いです。' },
    ],
  },

  // ─── N4 1차 시드 (라운드 14) — 6개 주제 ─────────────────────────
  {
    id:'conv_n4_appt_change', level:'N4', titleKo:'약속 변경',
    situationTags:['약속','일정','사과'],
    requiredVocabIds:['v_n4_37','v_n4_36','v_n4_26','v_n4_245','v_n4_63'],
    requiredGrammarIds:['g_n4_1','g_n4_17','g_n4_29','g_n5_13'],
    starterQuestions:[
      { ja:'明日の約束、時間を変えてもいいですか。', ko:'내일 약속, 시간을 바꿔도 될까요?',
        expectedPatterns:['〜てもいいですか','〜ので'],
        sampleAnswers:[
          { ja:'はい、いいですよ。何時にしますか。', ko:'네, 좋아요. 몇 시로 할까요?' },
          { ja:'すみません、五時に変えていただけますか。', ko:'5시로 바꿔 주실 수 있을까요?' },
        ] },
      { ja:'急に仕事が入ってしまいました。', ko:'갑자기 일이 생겨 버렸습니다.',
        expectedPatterns:['〜てしまう','〜なら'],
        sampleAnswers:[
          { ja:'では、来週にしましょう。', ko:'그럼 다음 주로 합시다.' },
          { ja:'明日の夜なら大丈夫です。', ko:'내일 밤이라면 괜찮습니다.' },
        ] },
    ],
    repairHints:[{ issue:'polite_request', ko:'정중 변경은 「〜ていただけますか」.',
      exampleJa:'五時に変えていただけますか。' }],
  },

  {
    id:'conv_n4_hospital_symptom', level:'N4', titleKo:'병원에서 증상 설명',
    situationTags:['병원','건강','증상'],
    requiredVocabIds:['v_n4_148','v_n4_149','v_n4_147','v_n5_230','v_n4_38'],
    requiredGrammarIds:['g_n4_17','g_n4_3','g_n5_5'],
    starterQuestions:[
      { ja:'今日はどうしましたか。', ko:'오늘은 어떻게 오셨습니까?',
        expectedPatterns:['〜が痛いです','〜があります'],
        sampleAnswers:[
          { ja:'熱があって、頭も痛いです。', ko:'열이 나고 머리도 아픕니다.' },
          { ja:'三日前から咳が出ています。', ko:'사흘 전부터 기침이 나고 있습니다.' },
        ] },
      { ja:'薬は飲んでいますか。', ko:'약은 먹고 있습니까?',
        expectedPatterns:['〜ています','まだ〜ていません'],
        sampleAnswers:[
          { ja:'はい、毎日飲んでいます。', ko:'네, 매일 먹고 있습니다.' },
          { ja:'いいえ、まだ飲んでいません。', ko:'아니요, 아직 먹지 않았습니다.' },
        ] },
    ],
    repairHints:[{ issue:'body_part_subject', ko:'부위+が+痛い 형태.', exampleJa:'お腹が痛いです。' }],
  },

  {
    id:'conv_n4_work_meeting', level:'N4', titleKo:'회사 회의 일정',
    situationTags:['회사','회의','일정'],
    requiredVocabIds:['v_n4_57','v_n4_59','v_n4_60','v_n4_63','v_n4_1'],
    requiredGrammarIds:['g_n4_2','g_n4_17','g_n5_5'],
    starterQuestions:[
      { ja:'明日の会議は何時からですか。', ko:'내일 회의는 몇 시부터입니까?',
        expectedPatterns:['〜時から','〜です'],
        sampleAnswers:[
          { ja:'十時からです。', ko:'10시부터입니다.' },
          { ja:'十時から二階の会議室です。', ko:'10시부터 2층 회의실입니다.' },
        ] },
      { ja:'資料の準備はもう終わりましたか。', ko:'자료 준비는 이미 끝났습니까?',
        expectedPatterns:['〜ておく','まだ〜ていません'],
        sampleAnswers:[
          { ja:'はい、もう準備しておきました。', ko:'네, 이미 준비해 두었습니다.' },
          { ja:'いいえ、今日中に作ります。', ko:'아니요, 오늘 안에 만들겠습니다.' },
        ] },
    ],
    repairHints:[{ issue:'plain_preparation', ko:'사전 준비는 「〜ておく」.', exampleJa:'資料を準備しておきます。' }],
  },

  {
    id:'conv_n4_travel_plan', level:'N4', titleKo:'여행 계획',
    situationTags:['여행','계획','경험'],
    requiredVocabIds:['v_n5_109','v_n5_164','v_n4_124','v_n4_35','v_n4_106'],
    requiredGrammarIds:['g_n4_5','g_n4_7','g_n4_19','g_n5_12'],
    starterQuestions:[
      { ja:'休みにどこかへ行ったことがありますか。', ko:'휴가에 어딘가 간 적이 있습니까?',
        expectedPatterns:['〜たことがある'],
        sampleAnswers:[
          { ja:'はい、京都に行ったことがあります。', ko:'네, 교토에 간 적이 있습니다.' },
          { ja:'いいえ、まだありません。', ko:'아니요, 아직 없습니다.' },
        ] },
      { ja:'今度の旅行はどこへ行きたいですか。', ko:'이번 여행은 어디로 가고 싶습니까?',
        expectedPatterns:['〜たいです','〜てみたい'],
        sampleAnswers:[
          { ja:'北海道へ行ってみたいです。', ko:'홋카이도에 가 보고 싶습니다.' },
          { ja:'沖縄で泳ぎたいです。', ko:'오키나와에서 수영하고 싶습니다.' },
        ] },
    ],
    repairHints:[{ issue:'use_experience', ko:'경험은 「〜たことがある」.', exampleJa:'日本に行ったことがあります。' }],
  },

  {
    id:'conv_n4_shopping_exchange', level:'N4', titleKo:'쇼핑·교환 문의',
    situationTags:['쇼핑','교환','문의'],
    requiredVocabIds:['v_n4_74','v_n5_179','v_n4_53','v_n4_67','v_n4_70'],
    requiredGrammarIds:['g_n5_13','g_n4_17','g_n4_29'],
    starterQuestions:[
      { ja:'この商品を交換してもらえますか。', ko:'이 상품을 교환해 주실 수 있을까요?',
        expectedPatterns:['〜てもらえますか'],
        sampleAnswers:[
          { ja:'はい、レシートを見せてください。', ko:'네, 영수증을 보여 주세요.' },
          { ja:'すみません、サイズが合いません。', ko:'죄송합니다, 사이즈가 안 맞습니다.' },
        ] },
      { ja:'袋は要りますか。', ko:'봉지가 필요합니까?',
        expectedPatterns:['はい、お願いします','いいえ、要りません'],
        sampleAnswers:[
          { ja:'はい、お願いします。', ko:'네, 부탁합니다.' },
          { ja:'いいえ、結構です。', ko:'아니요, 괜찮습니다.' },
        ] },
    ],
    repairHints:[{ issue:'polite_request', ko:'정중 요청 「〜てもらえますか」.', exampleJa:'交換してもらえますか。' }],
  },

  {
    id:'conv_n4_hobby_experience', level:'N4', titleKo:'취미와 경험 이야기',
    situationTags:['취미','경험','자기소개'],
    requiredVocabIds:['v_n4_106','v_n4_107','v_n4_108','v_n4_103','v_n5_247'],
    requiredGrammarIds:['g_n4_5','g_n4_6','g_n4_40'],
    starterQuestions:[
      { ja:'趣味は何ですか。', ko:'취미는 무엇입니까?',
        expectedPatterns:['〜は〜です','〜のは〜です'],
        sampleAnswers:[
          { ja:'趣味は写真を撮ることです。', ko:'취미는 사진을 찍는 것입니다.' },
          { ja:'音楽を聞くのが好きです。', ko:'음악을 듣는 것을 좋아합니다.' },
        ] },
      { ja:'休みの日は何をしますか。', ko:'쉬는 날은 무엇을 합니까?',
        expectedPatterns:['〜たり〜たりする'],
        sampleAnswers:[
          { ja:'本を読んだり、散歩したりします。', ko:'책을 읽기도 하고 산책하기도 합니다.' },
          { ja:'友だちと映画を見たりします。', ko:'친구와 영화를 보기도 합니다.' },
        ] },
    ],
    repairHints:[{ issue:'nominalize', ko:'동사 명사화는 「〜のが/〜のは」.', exampleJa:'歌うのが好きです。' }],
  },

  // ─── N4 완성 C (라운드 27) — 신규 토픽 2 ────────────────────────────
  {
    id:'conv_n4_restaurant_reserve', level:'N4', titleKo:'레스토랑 예약',
    situationTags:['예약','식당','전화'],
    requiredVocabIds:['v_n4_35','v_n4_319','v_n4_320','v_n4_620','v_n4_307'],
    requiredGrammarIds:['g_n4_61','g_n4_37','g_n4_51'],
    starterQuestions:[
      { ja:'金曜日の七時に予約したいのですが。', ko:'금요일 7시에 예약하고 싶은데요.',
        expectedPatterns:['〜たいのですが'],
        sampleAnswers:[
          { ja:'何名様ですか。', ko:'몇 분이십니까?' },
          { ja:'四人でお願いします。', ko:'네 명 부탁합니다.' },
        ] },
      { ja:'席が空いているかどうか、教えていただけませんか。', ko:'자리가 비어 있는지 알려 주시지 않겠습니까?',
        expectedPatterns:['〜かどうか','〜ていただけませんか'],
        sampleAnswers:[
          { ja:'七時は満席ですが、八時なら空いています。', ko:'7시는 만석이지만 8시라면 비어 있습니다.' },
          { ja:'はい、ご予約できます。', ko:'네, 예약하실 수 있습니다.' },
        ] },
    ],
    repairHints:[{ issue:'polite-request', ko:'정중한 부탁은 「〜ていただけませんか」.', exampleJa:'時間を変更していただけませんか。' }],
  },
  {
    id:'conv_n4_lost_item', level:'N4', titleKo:'분실물 문의',
    situationTags:['분실물','문의','역'],
    requiredVocabIds:['v_n4_387','v_n4_388','v_n4_386','v_n4_323','v_n4_624'],
    requiredGrammarIds:['g_n4_1','g_n4_37','g_n4_61'],
    starterQuestions:[
      { ja:'電車に傘を忘れてしまったんですが。', ko:'전철에 우산을 두고 내렸는데요.',
        expectedPatterns:['〜てしまったんですが'],
        sampleAnswers:[
          { ja:'何時の電車ですか。', ko:'몇 시 전철입니까?' },
          { ja:'どんな傘ですか。', ko:'어떤 우산입니까?' },
        ] },
      { ja:'見つかったら、連絡していただけませんか。', ko:'찾으면 연락해 주시지 않겠습니까?',
        expectedPatterns:['〜たら','〜ていただけませんか'],
        sampleAnswers:[
          { ja:'はい、連絡先を書いてください。', ko:'네, 연락처를 적어 주세요.' },
          { ja:'届いたらお電話します。', ko:'들어오면 전화드리겠습니다.' },
        ] },
    ],
    repairHints:[{ issue:'regret', ko:'실수·유감은 「〜てしまいました」.', exampleJa:'財布を無くしてしまいました。' }],
  },

  // ─── N4 완성 D (라운드 28) — 신규 토픽 2 ────────────────────────────
  {
    id:'conv_n4_hotel_stay', level:'N4', titleKo:'호텔·숙소 이용',
    situationTags:['호텔','여행','예약'],
    requiredVocabIds:['v_n4_342','v_n4_386','v_n4_285','v_n4_767','v_n4_35'],
    requiredGrammarIds:['g_n4_61','g_n4_46','g_n4_1'],
    starterQuestions:[
      { ja:'チェックインをお願いします。', ko:'체크인을 부탁합니다.',
        expectedPatterns:['〜をお願いします'],
        sampleAnswers:[
          { ja:'お名前をお願いします。', ko:'성함을 부탁드립니다.' },
          { ja:'予約した田中です。', ko:'예약한 다나카입니다.' },
        ] },
      { ja:'荷物を預かっていただけませんか。', ko:'짐을 맡아 주시지 않겠습니까?',
        expectedPatterns:['〜ていただけませんか'],
        sampleAnswers:[
          { ja:'はい、夕方までお預かりできます。', ko:'네, 저녁까지 보관해 드릴 수 있습니다.' },
          { ja:'こちらの紙にお名前を書いてください。', ko:'이 종이에 성함을 적어 주세요.' },
        ] },
    ],
    repairHints:[{ issue:'polite-request', ko:'호텔에서는 「〜ていただけませんか」가 정중하다.', exampleJa:'タオルを取り替えていただけませんか。' }],
  },
  {
    id:'conv_n4_office_phone', level:'N4', titleKo:'회사 전화 응대',
    situationTags:['전화','회사','문의'],
    requiredVocabIds:['v_n4_842','v_n4_625','v_n4_306','v_n4_840','v_n4_851'],
    requiredGrammarIds:['g_n4_83','g_n4_2','g_n4_71'],
    starterQuestions:[
      { ja:'山田部長をお願いします。', ko:'야마다 부장님을 부탁합니다.',
        expectedPatterns:['〜をお願いします'],
        sampleAnswers:[
          { ja:'ただいま外出中です。', ko:'지금 외출 중입니다.' },
          { ja:'少々お待ちください。', ko:'잠시 기다려 주십시오.' },
        ] },
      { ja:'伝言をお願いできますか。', ko:'메시지를 부탁드릴 수 있을까요?',
        expectedPatterns:['〜をお願いできますか'],
        sampleAnswers:[
          { ja:'はい、どうぞ。', ko:'네, 말씀하세요.' },
          { ja:'戻りましたら、伝えておきます。', ko:'돌아오면 전해 놓겠습니다.' },
        ] },
    ],
    repairHints:[{ issue:'humble', ko:'회사 전화에서는 자기 쪽 사람에게 경칭을 붙이지 않는다 (「山田は外出中です」).', exampleJa:'山田はただいま外出中です。' }],
  },

  // ─── N3 0차 시드 (라운드 32) — 토픽 3 ───────────────────────────────
  {
    id:'conv_n3_work_schedule', level:'N3', titleKo:'직장 일정 조정',
    situationTags:['직장','일정'],
    requiredVocabIds:['v_n3_10','v_n3_12','v_n3_18','v_n4_319','v_n4_841'],
    requiredGrammarIds:['g_n4_61','g_n3_20','g_n4_75'],
    starterQuestions:[
      { ja:'会議の日程を変更していただけませんか。', ko:'회의 일정을 변경해 주시지 않겠습니까?',
        expectedPatterns:['〜ていただけませんか'],
        sampleAnswers:[
          { ja:'はい、いつがよろしいですか。', ko:'네, 언제가 좋으십니까?' },
          { ja:'取引先の都合で予定が変わりました。', ko:'거래처 사정으로 예정이 바뀌었습니다.' },
        ] },
      { ja:'資料の提出はいつまでですか。', ko:'자료 제출은 언제까지입니까?',
        expectedPatterns:['〜までです','〜てください'],
        sampleAnswers:[
          { ja:'資料は前日までに提出してください。', ko:'자료는 전날까지 제출해 주세요.' },
          { ja:'金曜日までにお願いします。', ko:'금요일까지 부탁합니다.' },
        ] },
    ],
    repairHints:[{ issue:'polite-request', ko:'일정 변경 부탁은 「〜ていただけませんか」가 정중하다.', exampleJa:'日程を変更していただけませんか。' }],
  },
  {
    id:'conv_n3_travel_trouble', level:'N3', titleKo:'여행 문제 해결',
    situationTags:['여행','문제'],
    requiredVocabIds:['v_n3_6','v_n3_7','v_n3_82','v_n3_105','v_n3_78'],
    requiredGrammarIds:['g_n3_6','g_n4_1','g_n5_10'],
    starterQuestions:[
      { ja:'飛行機が欠航になったら、どうしますか。', ko:'비행기가 결항되면 어떻게 하겠습니까?',
        expectedPatterns:['〜たら','〜ましょう'],
        sampleAnswers:[
          { ja:'慌てないで、まず状況を整理しましょう。', ko:'당황하지 말고 먼저 상황을 정리합시다.' },
          { ja:'日程の変更は無料でできますか。', ko:'일정 변경은 무료로 가능한가요?' },
        ] },
      { ja:'困った時は、誰に相談しますか。', ko:'곤란할 때는 누구에게 상담하겠습니까?',
        expectedPatterns:['〜に相談します','〜に頼る'],
        sampleAnswers:[
          { ja:'困った時は、駅の案内所に頼るといいですよ。', ko:'곤란할 때는 역 안내소에 의지하면 좋아요.' },
          { ja:'ホテルに事情を説明して、助かりました。', ko:'호텔에 사정을 설명해서 도움이 됐습니다.' },
        ] },
    ],
    repairHints:[{ issue:'regret', ko:'곤란한 결과는 「〜てしまいました」로 표현.', exampleJa:'予定が全部変わってしまいました。' }],
  },
  {
    id:'conv_n3_opinion', level:'N3', titleKo:'의견 말하기·추천하기',
    situationTags:['의견','추천','소통'],
    requiredVocabIds:['v_n3_61','v_n3_93','v_n3_102','v_n4_612','v_n4_613'],
    requiredGrammarIds:['g_n3_10','g_n3_11','g_n3_12'],
    starterQuestions:[
      { ja:'環境問題について、どう思いますか。', ko:'환경 문제에 대해 어떻게 생각하세요?',
        expectedPatterns:['〜と思います','〜について'],
        sampleAnswers:[
          { ja:'私にとって、これは大切な問題です。', ko:'저에게 있어 이것은 중요한 문제입니다.' },
          { ja:'具体的な例を挙げて説明します。', ko:'구체적인 예를 들어 설명하겠습니다.' },
        ] },
      { ja:'おすすめの店はありますか。', ko:'추천하는 가게가 있나요?',
        expectedPatterns:['〜ので、おすすめです'],
        sampleAnswers:[
          { ja:'この店は雰囲気がいいので、おすすめです。', ko:'이 가게는 분위기가 좋아서 추천합니다.' },
          { ja:'実際に使ってみて、効果を感じました。', ko:'실제로 써 보고 효과를 느꼈습니다.' },
        ] },
    ],
    repairHints:[{ issue:'opinion', ko:'의견은 「〜と思います」로 부드럽게 마무리.', exampleJa:'続けることが大切だと思います。' }],
  },

  // ── N3 1차 확장 (라운드 34) ──
  {
    id:'conv_n3_meeting_opinion', level:'N3', titleKo:'회의에서 의견 내기',
    situationTags:['회의','의견'],
    requiredVocabIds:['v_n3_61','v_n3_195','v_n3_196','v_n3_197','v_n3_153'],
    requiredGrammarIds:['g_n3_21','g_n3_22','g_n3_23','g_n3_37'],
    starterQuestions:[
      { ja:'この計画について、意見を聞かせてください。', ko:'이 계획에 대해 의견을 들려주세요.',
        expectedPatterns:['〜と思います','〜について'],
        sampleAnswers:[
          { ja:'会議で自分の意見をはっきり述べました。', ko:'회의에서 자신의 의견을 분명히 말했습니다.' },
          { ja:'確かに費用の問題はありますが、効果も大きいです。', ko:'확실히 비용 문제는 있지만, 효과도 큽니다.' },
        ] },
      { ja:'結論はいつまでに出しますか。', ko:'결론은 언제까지 냅니까?',
        expectedPatterns:['〜ことはない','〜ましょう'],
        sampleAnswers:[
          { ja:'結論を急ぐことはないと思います。', ko:'결론을 서두를 필요는 없다고 생각합니다.' },
          { ja:'全体の意見をまとめてから決めませんか。', ko:'전체 의견을 모은 후에 정하지 않을래요?' },
        ] },
    ],
    repairHints:[{ issue:'soft-disagree', ko:'반대할 때는 「反対するかわりに、別の案を出す」처럼 대안을 곁들이면 부드럽다.', exampleJa:'反対するかわりに、別の案を出してください。' }],
  },
  {
    id:'conv_n3_school_presentation', level:'N3', titleKo:'학교 발표 준비',
    situationTags:['학교','발표'],
    requiredVocabIds:['v_n3_158','v_n3_63','v_n3_65','v_n3_175','v_n3_150'],
    requiredGrammarIds:['g_n3_9','g_n3_18','g_n3_26','g_n3_35'],
    starterQuestions:[
      { ja:'発表の準備はどうですか。', ko:'발표 준비는 어때요?',
        expectedPatterns:['〜ば〜ほど','〜てもらいました'],
        sampleAnswers:[
          { ja:'発表の前に、先生に確かめてもらいました。', ko:'발표 전에 선생님께 확인을 받았습니다.' },
          { ja:'練習すればするほど、上手になります。', ko:'연습하면 할수록 능숙해집니다.' },
        ] },
      { ja:'人の前で話すのは緊張しませんか。', ko:'사람들 앞에서 말하는 건 긴장되지 않나요?',
        expectedPatterns:['〜ほど〜ない','〜ところでした'],
        sampleAnswers:[
          { ja:'みんなの前で話すのは、思ったほど怖くなかったです。', ko:'모두 앞에서 말하는 것은 생각만큼 무섭지 않았습니다.' },
          { ja:'緊張して、声が出ないところでした。', ko:'긴장해서 목소리가 안 나올 뻔했습니다.' },
        ] },
    ],
    repairHints:[{ issue:'prepare', ko:'준비 과정은 「〜できるように準備します」로 목적을 붙여 말한다.', exampleJa:'質問に冷静に対応できるように準備します。' }],
  },
  {
    id:'conv_n3_reservation_problem', level:'N3', titleKo:'예약·일정 문제 해결',
    situationTags:['예약','문제'],
    requiredVocabIds:['v_n3_74','v_n3_223','v_n3_249','v_n3_67','v_n3_271'],
    requiredGrammarIds:['g_n3_28','g_n3_36'],
    starterQuestions:[
      { ja:'予約の変更はできますか。', ko:'예약 변경은 가능한가요?',
        expectedPatterns:['〜までに','〜場合は'],
        sampleAnswers:[
          { ja:'日にちを変更する場合は、前日までに連絡してください。', ko:'날짜를 변경할 경우에는 전날까지 연락해 주세요.' },
          { ja:'満席だったので、翌日に変更してもらいました。', ko:'만석이었기 때문에 다음 날로 변경해 받았습니다.' },
        ] },
      { ja:'キャンセルしたいのですが、どうすればいいですか。', ko:'취소하고 싶은데 어떻게 하면 되나요?',
        expectedPatterns:['〜ということだ','〜しかない'],
        sampleAnswers:[
          { ja:'キャンセル料がかかるということです。', ko:'취소 수수료가 든다고 합니다.' },
          { ja:'急に予定が変わって、予約を断るしかありませんでした。', ko:'갑자기 예정이 바뀌어 예약을 거절할 수밖에 없었습니다.' },
        ] },
    ],
    repairHints:[{ issue:'apologize', ko:'문제를 알릴 때는 사과 한마디를 먼저 — 「ご迷惑をおかけしました」.', exampleJa:'こちらのミスで、ご迷惑をおかけしました。' }],
  },

  // ── N3 2차 확장 (라운드 36) ──
  {
    id:'conv_n3_work_conflict', level:'N3', titleKo:'직장 갈등 조정',
    situationTags:['직장','갈등'],
    requiredVocabIds:['v_n3_356','v_n3_388','v_n3_488','v_n3_389','v_n3_175'],
    requiredGrammarIds:['g_n3_11','g_n3_41','g_n3_63'],
    starterQuestions:[
      { ja:'仕事の量について、不満があるんですが。', ko:'업무량에 대해 불만이 있는데요.',
        expectedPatterns:['〜について','〜気がします'],
        sampleAnswers:[
          { ja:'私だけ残業が多い気がします。', ko:'저만 야근이 많은 것 같습니다.' },
          { ja:'仕事の分担について、話し合いませんか。', ko:'일 분담에 대해 이야기하지 않을래요?' },
        ] },
      { ja:'意見がぶつかったとき、どうしますか。', ko:'의견이 부딪힐 때 어떻게 합니까?',
        expectedPatterns:['〜ことが大切です','〜ましょう'],
        sampleAnswers:[
          { ja:'感情的にならないで、冷静に話しましょう。', ko:'감정적으로 되지 말고 침착하게 이야기합시다.' },
          { ja:'お互いの立場を理解することが大切です。', ko:'서로의 입장을 이해하는 것이 중요합니다.' },
        ] },
    ],
    repairHints:[{ issue:'soft-claim', ko:'불만은 「〜気がします」로 부드럽게 꺼내면 갈등이 줄어든다.', exampleJa:'私だけ残業が多い気がします。' }],
  },
  {
    id:'conv_n3_social_opinion', level:'N3', titleKo:'사회 문제에 의견 말하기',
    situationTags:['사회','의견'],
    requiredVocabIds:['v_n3_136','v_n3_426','v_n3_400','v_n3_375','v_n3_305'],
    requiredGrammarIds:['g_n3_43','g_n3_67','g_n3_70'],
    starterQuestions:[
      { ja:'物価の上昇について、どう感じていますか。', ko:'물가 상승에 대해 어떻게 느끼고 있습니까?',
        expectedPatterns:['〜について','〜と思います'],
        sampleAnswers:[
          { ja:'物価の上昇は、生活に大きな負担です。', ko:'물가 상승은 생활에 큰 부담입니다.' },
          { ja:'若者だけでなく、全ての世代に関係がある問題です。', ko:'젊은이뿐 아니라 모든 세대에 관계가 있는 문제입니다.' },
        ] },
      { ja:'環境のために、何かしていますか。', ko:'환경을 위해 무언가 하고 있습니까?',
        expectedPatterns:['〜ようにしています','〜しだい'],
        sampleAnswers:[
          { ja:'環境問題は、一人一人の意識しだいだと思います。', ko:'환경 문제는 한 사람 한 사람의 의식에 달렸다고 생각합니다.' },
          { ja:'ごみを減らす取り組みが盛んになっています。', ko:'쓰레기를 줄이는 노력이 활발해지고 있습니다.' },
        ] },
    ],
    repairHints:[{ issue:'fact-opinion', ko:'사실과 의견을 나눠 말하면 설득력이 생긴다 — 「事実と意見を区切って」.', exampleJa:'事実と意見を区切って話すことが大切です。' }],
  },
  {
    id:'conv_n3_service_complaint', level:'N3', titleKo:'서비스 불만·요청',
    situationTags:['서비스','불만'],
    requiredVocabIds:['v_n3_150','v_n3_337','v_n3_491','v_n3_318','v_n3_315'],
    requiredGrammarIds:['g_n3_38','g_n3_28','g_n3_36'],
    starterQuestions:[
      { ja:'どのようなご用件でしょうか。', ko:'어떤 용건이신가요?',
        expectedPatterns:['〜がまだ〜ていません','〜ようです'],
        sampleAnswers:[
          { ja:'注文した商品がまだ届いていません。', ko:'주문한 상품이 아직 도착하지 않았습니다.' },
          { ja:'料金の請求に誤りがあるようです。', ko:'요금 청구에 잘못이 있는 것 같습니다.' },
        ] },
      { ja:'ご希望の対応をお聞かせください。', ko:'원하시는 대응을 들려주세요.',
        expectedPatterns:['〜を要求します','〜てください'],
        sampleAnswers:[
          { ja:'交換ではなく、返金を要求します。', ko:'교환이 아니라 환불을 요구합니다.' },
          { ja:'今後の対策を聞かせてください。', ko:'앞으로의 대책을 들려주세요.' },
        ] },
    ],
    repairHints:[{ issue:'polite-complaint', ko:'불만도 사실 → 요청 순서로 정중하게 — 「〜ようです。〜てください」.', exampleJa:'対応が遅れた理由を教えてください。' }],
  },

  // ── N3 3차 확장 (라운드 38) ──
  {
    id:'conv_n3_social_debate', level:'N3', titleKo:'사회 이슈 토론',
    situationTags:['사회','토론'],
    requiredVocabIds:['v_n3_1104','v_n3_1105','v_n3_1108','v_n3_1003','v_n3_400'],
    requiredGrammarIds:['g_n3_104','g_n3_11','g_n3_70'],
    starterQuestions:[
      { ja:'高齢化について、どう考えますか。', ko:'고령화에 대해 어떻게 생각하세요?',
        expectedPatterns:['〜について','〜と思います'],
        sampleAnswers:[
          { ja:'少子化は社会全体の問題だと思います。', ko:'저출산은 사회 전체의 문제라고 생각합니다.' },
          { ja:'高齢化について、どう考えますか。', ko:'고령화에 대해 어떻게 생각하세요?' },
        ] },
      { ja:'意見の根拠は何ですか。', ko:'의견의 근거는 무엇입니까?',
        expectedPatterns:['〜をもとに','〜とは限らない'],
        sampleAnswers:[
          { ja:'証拠をもとに、意見を述べるべきです。', ko:'증거를 바탕으로 의견을 말해야 합니다.' },
          { ja:'主観ではなく、客観の事実を見ましょう。', ko:'주관이 아니라 객관적 사실을 봅시다.' },
        ] },
    ],
    repairHints:[{ issue:'evidence', ko:'주장에는 근거를 — 「〜をもとに」로 객관성을 보이면 설득력이 커진다.', exampleJa:'証拠をもとに、意見を述べるべきです。' }],
  },
  {
    id:'conv_n3_workplace_solution', level:'N3', titleKo:'직장 문제 해결',
    situationTags:['직장','해결'],
    requiredVocabIds:['v_n3_826','v_n3_1046','v_n3_672','v_n3_899','v_n3_1274'],
    requiredGrammarIds:['g_n3_71','g_n3_84','g_n3_119'],
    starterQuestions:[
      { ja:'残業が多くて困っているんです。', ko:'야근이 많아서 곤란합니다.',
        expectedPatterns:['〜を減らす','〜ましょう'],
        sampleAnswers:[
          { ja:'残業を減らす対応策を考えましょう。', ko:'야근을 줄이는 대응책을 생각합시다.' },
          { ja:'業務の手順を見直す必要があります。', ko:'업무 절차를 재검토할 필요가 있습니다.' },
        ] },
      { ja:'人間関係に悩んでいます。', ko:'인간관계로 고민하고 있습니다.',
        expectedPatterns:['〜ことだ','〜たほうがいい'],
        sampleAnswers:[
          { ja:'人間関係の悩みは、一人で抱えないことです。', ko:'인간관계 고민은 혼자 떠안지 않는 것입니다.' },
          { ja:'問題が生じたら、すぐ相談してください。', ko:'문제가 생기면 바로 상담해 주세요.' },
        ] },
    ],
    repairHints:[{ issue:'share', ko:'고민은 혼자 떠안지 말고 — 「一人で抱えないことだ」처럼 조언하면 좋다.', exampleJa:'一人で抱えないことです。' }],
  },
  {
    id:'conv_n3_local_event', level:'N3', titleKo:'지역 행사 제안',
    situationTags:['지역','제안'],
    requiredVocabIds:['v_n3_1103','v_n3_719','v_n3_945','v_n3_805','v_n3_310'],
    requiredGrammarIds:['g_n3_104','g_n3_105','g_n3_111'],
    starterQuestions:[
      { ja:'町を元気にする行事を考えませんか。', ko:'마을을 활기차게 할 행사를 생각해 보지 않을래요?',
        expectedPatterns:['〜を中心に','〜はどうでしょう'],
        sampleAnswers:[
          { ja:'広場を中心に、屋台を並べてはどうでしょう。', ko:'광장을 중심으로 노점을 늘어놓는 건 어떨까요.' },
          { ja:'地域社会のつながりを深める行事を提案します。', ko:'지역 사회의 연결을 깊게 하는 행사를 제안합니다.' },
        ] },
      { ja:'準備で気をつけることは何ですか。', ko:'준비에서 주의할 점은 무엇입니까?',
        expectedPatterns:['〜をもとに','〜につれて'],
        sampleAnswers:[
          { ja:'住民の要望をもとに、計画を立てます。', ko:'주민의 요망을 바탕으로 계획을 세웁니다.' },
          { ja:'参加者が増えるにつれて、準備も大変になります。', ko:'참가자가 늘어남에 따라 준비도 힘들어집니다.' },
        ] },
    ],
    repairHints:[{ issue:'propose', ko:'제안은 「〜てはどうでしょう」로 부드럽게 — 상대의 동의를 끌어낸다.', exampleJa:'屋台を並べてはどうでしょう。' }],
  },

  // ── N2 0차 시드 (라운드 40) ──
  {
    id:'conv_n2_social_issue', level:'N2', titleKo:'사회 문제에 의견 말하기',
    situationTags:['사회','의견'],
    requiredVocabIds:['v_n3_1104','v_n3_1007','v_n3_1008','v_n2_83','v_n2_102'],
    requiredGrammarIds:['g_n2_1','g_n2_13','g_n3_104'],
    starterQuestions:[
      { ja:'高齢化について、どう考えますか。', ko:'고령화에 대해 어떻게 생각하세요?',
        expectedPatterns:['〜と考えます','〜のみならず'],
        sampleAnswers:[
          { ja:'高齢化は社会全体の課題だと考えます。', ko:'고령화는 사회 전체의 과제라고 생각합니다.' },
          { ja:'この問題は一部の地域のみならず、全国に広がっています。', ko:'이 문제는 일부 지역뿐만 아니라 전국에 퍼지고 있습니다.' },
        ] },
      { ja:'意見の根拠は何ですか。', ko:'의견의 근거는 무엇입니까?',
        expectedPatterns:['〜をもとに','〜ではなく'],
        sampleAnswers:[
          { ja:'証拠をもとに、客観的に判断するべきです。', ko:'증거를 바탕으로 객관적으로 판단해야 합니다.' },
          { ja:'主観ではなく、事実をもとに議論したいです。', ko:'주관이 아니라 사실을 바탕으로 논의하고 싶습니다.' },
        ] },
    ],
    repairHints:[{ issue:'evidence', ko:'주장에는 근거를 — 「証拠をもとに」로 객관성을 보이면 설득력이 커진다.', exampleJa:'証拠をもとに、客観的に判断するべきです。' }],
  },
  {
    id:'conv_n2_meeting_proposal', level:'N2', titleKo:'직장 회의에서 제안하기',
    situationTags:['직장','제안'],
    requiredVocabIds:['v_n2_28','v_n2_32','v_n2_42','v_n2_36','v_n3_847'],
    requiredGrammarIds:['g_n2_4','g_n2_5','g_n2_17'],
    starterQuestions:[
      { ja:'業務の改善について、提案はありますか。', ko:'업무 개선에 대해 제안이 있습니까?',
        expectedPatterns:['〜を提案します','〜てはどうでしょうか'],
        sampleAnswers:[
          { ja:'業務の効率化を提案したいと思います。', ko:'업무의 효율화를 제안하고 싶습니다.' },
          { ja:'導入に先立って、一度試してはどうでしょうか。', ko:'도입에 앞서 한번 시험해 보는 것은 어떨까요.' },
        ] },
      { ja:'進め方について、気をつける点は何ですか。', ko:'진행 방식에서 주의할 점은 무엇입니까?',
        expectedPatterns:['〜てから','〜に応じて'],
        sampleAnswers:[
          { ja:'現状を正しく把握してから、対策を立てましょう。', ko:'현황을 정확히 파악하고 나서 대책을 세웁시다.' },
          { ja:'お客様の要望に応じて、対応を変えます。', ko:'고객의 요망에 맞춰 대응을 바꿉니다.' },
        ] },
    ],
    repairHints:[{ issue:'soft-proposal', ko:'제안은 「〜てはどうでしょうか」로 부드럽게, 근거를 곁들이면 통과 가능성이 높아진다.', exampleJa:'一度試してはどうでしょうか。' }],
  },
  {
    id:'conv_n2_news_discussion', level:'N2', titleKo:'뉴스 주제 토론하기',
    situationTags:['뉴스','토론'],
    requiredVocabIds:['v_n2_100','v_n2_72','v_n2_74','v_n2_47','v_n2_102'],
    requiredGrammarIds:['g_n4_69','g_n2_7','g_n3_35'],
    starterQuestions:[
      { ja:'最近のニュースで、気になる話題はありますか。', ko:'최근 뉴스에서 신경 쓰이는 화제가 있습니까?',
        expectedPatterns:['〜によると','〜つつある'],
        sampleAnswers:[
          { ja:'調査によると、景気は回復の兆候を見せています。', ko:'조사에 의하면 경기는 회복의 징후를 보이고 있습니다.' },
          { ja:'世論は、この政策に否定的な見方を示しています。', ko:'여론은 이 정책에 부정적인 시각을 보이고 있습니다.' },
        ] },
      { ja:'意見が分かれる話題は、どう話し合えばいいですか。', ko:'의견이 갈리는 화제는 어떻게 논의하면 됩니까?',
        expectedPatterns:['〜こそ','〜を避け'],
        sampleAnswers:[
          { ja:'賛否が分かれる話題こそ、冷静な議論が必要です。', ko:'찬반이 갈리는 화제일수록 침착한 논의가 필요합니다.' },
          { ja:'感情的な批判は避け、論点を整理しましょう。', ko:'감정적인 비판은 피하고 논점을 정리합시다.' },
        ] },
    ],
    repairHints:[{ issue:'calm-debate', ko:'토론은 「感情的な批判は避け、論点を整理」 — 사실과 의견을 나눠 말하면 건설적이 된다.', exampleJa:'感情的な批判は避け、論点を整理しましょう。' }],
  },
  {
    id:'conv_n2_meeting_objection', level:'N2', titleKo:'직장 회의에서 반대 의견 말하기',
    situationTags:['직장','반대'],
    requiredVocabIds:['v_n2_244','v_n2_228','v_n2_227','v_n2_254','v_n2_274'],
    requiredGrammarIds:['g_n2_31','g_n2_19','g_n2_23'],
    starterQuestions:[
      { ja:'この提案について、気になる点はありますか。', ko:'이 제안에 대해 신경 쓰이는 점이 있습니까?',
        expectedPatterns:['〜にしろ','〜があります'],
        sampleAnswers:[
          { ja:'賛成はできますが、導入の時期には異議があります。', ko:'찬성은 하지만 도입 시기에는 이의가 있습니다.' },
          { ja:'効率は上がるにしろ、現場の負担が増える点が心配です。', ko:'효율은 오르더라도 현장의 부담이 느는 점이 걱정입니다.' },
        ] },
      { ja:'反対の意見は、どう伝えればいいですか。', ko:'반대 의견은 어떻게 전하면 됩니까?',
        expectedPatterns:['〜ないことには','〜とはいえ'],
        sampleAnswers:[
          { ja:'現場の声を聞かないことには、賛成しかねます。', ko:'현장의 목소리를 듣지 않고서는 찬성하기 어렵습니다.' },
          { ja:'コストが下がるとはいえ、品質の低下は見過ごせません。', ko:'비용이 내려간다 해도 품질 저하는 못 본 척할 수 없습니다.' },
        ] },
    ],
    repairHints:[{ issue:'soft-objection', ko:'반대는 먼저 인정 후 「〜にしろ/とはいえ」로 부드럽게 — 근거를 들면 감정 충돌을 피한다.', exampleJa:'効率は上がるにしろ、負担が増える点が心配です。' }],
  },
  {
    id:'conv_n2_problem_solution', level:'N2', titleKo:'사회 문제 해결책 제안하기',
    situationTags:['사회','해결'],
    requiredVocabIds:['v_n2_261','v_n2_262','v_n2_157','v_n2_263','v_n2_169'],
    requiredGrammarIds:['g_n2_29','g_n2_27','g_n2_8'],
    starterQuestions:[
      { ja:'この問題の解決には、何が必要だと思いますか。', ko:'이 문제 해결에는 무엇이 필요하다고 생각합니까?',
        expectedPatterns:['〜が必要です','〜には'],
        sampleAnswers:[
          { ja:'この課題には、現実的な打開策が必要です。', ko:'이 과제에는 현실적인 타개책이 필요합니다.' },
          { ja:'格差を是正するには、教育への助成が欠かせません。', ko:'격차를 시정하려면 교육에 대한 지원이 빼놓을 수 없습니다.' },
        ] },
      { ja:'具体的には、どう進めればいいですか。', ko:'구체적으로는 어떻게 진행하면 됩니까?',
        expectedPatterns:['〜た上で','〜次第で'],
        sampleAnswers:[
          { ja:'まず原因を把握した上で、対策を立てるべきです。', ko:'우선 원인을 파악한 뒤에 대책을 세워야 합니다.' },
          { ja:'予算次第で、実施できる措置が変わってきます。', ko:'예산에 따라 실시할 수 있는 조치가 달라집니다.' },
        ] },
    ],
    repairHints:[{ issue:'realistic-plan', ko:'해결책은 「原因을 把握한 上で」 근거→대책 순서로 — 재원·조건을 함께 말하면 설득력이 커진다.', exampleJa:'原因を把握した上で、対策を立てるべきです。' }],
  },
  {
    id:'conv_n2_service_request', level:'N2', titleKo:'서비스 개선 요청하기',
    situationTags:['서비스','요청'],
    requiredVocabIds:['v_n2_264','v_n2_298','v_n2_300','v_n2_287','v_n2_277'],
    requiredGrammarIds:['g_n2_4','g_n2_10','g_n3_89'],
    starterQuestions:[
      { ja:'サービスについて、要望はありますか。', ko:'서비스에 대해 요망이 있습니까?',
        expectedPatterns:['〜に応じて','〜てほしい'],
        sampleAnswers:[
          { ja:'利用者の声に応じて、手順を見直してほしいです。', ko:'이용자의 목소리에 맞춰 절차를 재검토해 주셨으면 합니다.' },
          { ja:'説明が不十分なので、もう少し配慮をお願いします。', ko:'설명이 불충분하니 좀 더 배려를 부탁드립니다.' },
        ] },
      { ja:'改善を求めるとき、どう伝えますか。', ko:'개선을 요구할 때 어떻게 전합니까?',
        expectedPatterns:['〜にこたえて','〜ていただけますか'],
        sampleAnswers:[
          { ja:'問い合わせへの対応を、徹底していただきたいです。', ko:'문의에 대한 대응을 철저히 해 주셨으면 합니다.' },
          { ja:'要望にこたえて、サービスを拡充していただけると助かります。', ko:'요망에 부응해 서비스를 확충해 주시면 도움이 됩니다.' },
        ] },
    ],
    repairHints:[{ issue:'polite-request', ko:'요청은 「〜ていただけますか/てほしいです」로 정중하게 — 이유를 곁들이면 받아들여지기 쉽다.', exampleJa:'対応を徹底していただきたいです。' }],
  },
  {
    id:'conv_n2_policy_opinion', level:'N2', titleKo:'정책·제도에 의견 말하기',
    situationTags:['정책','의견'],
    requiredVocabIds:['v_n2_375','v_n2_311','v_n2_157','v_n2_301','v_n2_154'],
    requiredGrammarIds:['g_n2_3','g_n2_23','g_n2_1'],
    starterQuestions:[
      { ja:'この政策について、どう考えますか。', ko:'이 정책에 대해 어떻게 생각하세요?',
        expectedPatterns:['〜べきだ','〜にあたって'],
        sampleAnswers:[
          { ja:'この政策の是非を冷静に議論すべきだ。', ko:'이 정책의 가부를 냉정하게 논의해야 한다.' },
          { ja:'制度の改正にあたって、住民の声を聞くべきだ。', ko:'제도 개정에 즈음하여 주민의 목소리를 들어야 한다.' },
        ] },
      { ja:'実現のために、何が必要だと思いますか。', ko:'실현을 위해 무엇이 필요하다고 생각합니까?',
        expectedPatterns:['〜ないことには','〜なくして'],
        sampleAnswers:[
          { ja:'財源を確保しないことには、実現は難しい。', ko:'재원을 확보하지 않고서는 실현이 어렵다.' },
          { ja:'公正な手続きなくして、信頼は得られない。', ko:'공정한 절차 없이는 신뢰를 얻을 수 없다.' },
        ] },
    ],
    repairHints:[{ issue:'evidence-policy', ko:'정책 의견은 근거와 함께 — 「財源」「手続き」 등 구체적 조건을 들면 설득력이 커진다.', exampleJa:'財源を確保しないことには、実現は難しい。' }],
  },
  {
    id:'conv_n2_workplace_conflict', level:'N2', titleKo:'직장 갈등 해결하기',
    situationTags:['직장','갈등'],
    requiredVocabIds:['v_n2_293','v_n2_845','v_n2_298','v_n2_842','v_n2_233'],
    requiredGrammarIds:['g_n2_37','g_n2_77','g_n2_42'],
    starterQuestions:[
      { ja:'意見が対立したとき、どうしますか。', ko:'의견이 대립할 때 어떻게 합니까?',
        expectedPatterns:['〜より〜方がよい','〜てこそ'],
        sampleAnswers:[
          { ja:'対立を避けるより、論点を整理する方がよい。', ko:'대립을 피하기보다 논점을 정리하는 편이 낫다.' },
          { ja:'非を認めてこそ、信頼は回復する。', ko:'잘못을 인정해야 비로소 신뢰가 회복된다.' },
        ] },
      { ja:'関係を改善するには、何が大切ですか。', ko:'관계를 개선하려면 무엇이 중요합니까?',
        expectedPatterns:['〜なくして','〜に配慮する'],
        sampleAnswers:[
          { ja:'譲歩なくして、合意には至らない。', ko:'양보 없이는 합의에 이르지 못한다.' },
          { ja:'相手の立場に配慮した言い方を心がける。', ko:'상대 입장을 배려한 말투를 유념한다.' },
        ] },
    ],
    repairHints:[{ issue:'calm-conflict', ko:'갈등은 「感情的にならず、率直に」 — 사실과 논점을 분리해 말하면 풀린다.', exampleJa:'感情的にならず、率直に話し合おう。' }],
  },
  {
    id:'conv_n2_tech_life', level:'N2', titleKo:'기술 변화와 생활 이야기하기',
    situationTags:['기술','생활'],
    requiredVocabIds:['v_n2_544','v_n2_541','v_n2_556','v_n2_547','v_n2_685'],
    requiredGrammarIds:['g_n2_2','g_n2_56','g_n2_73'],
    starterQuestions:[
      { ja:'技術の進歩で、暮らしはどう変わりましたか。', ko:'기술의 진보로 생활은 어떻게 바뀌었습니까?',
        expectedPatterns:['〜にともなって','〜さえ〜ば'],
        sampleAnswers:[
          { ja:'技術の進歩にともなって、暮らしが変わった。', ko:'기술의 진보에 따라 생활이 바뀌었다.' },
          { ja:'端末さえあれば、どこでも働ける。', ko:'단말만 있으면 어디서나 일할 수 있다.' },
        ] },
      { ja:'技術とどう付き合うべきだと思いますか。', ko:'기술과 어떻게 어울려야 한다고 생각합니까?',
        expectedPatterns:['〜にすぎない','〜うる'],
        sampleAnswers:[
          { ja:'技術はあくまで手段にすぎない。', ko:'기술은 어디까지나 수단에 지나지 않는다.' },
          { ja:'便利さの裏には、新たな負担もありうる。', ko:'편리함 뒤에는 새로운 부담도 있을 수 있다.' },
        ] },
    ],
    repairHints:[{ issue:'tech-balance', ko:'기술은 「手段にすぎない」 관점으로 — 목적(무엇을 위해)을 함께 말하면 균형 잡힌 의견이 된다.', exampleJa:'何のために使うかを問い直すべきだ。' }],
  },
  {
    id:'conv_n2_env_health', level:'N2', titleKo:'환경·건강 문제 제안하기',
    situationTags:['환경','건강'],
    requiredVocabIds:['v_n2_501','v_n2_169','v_n2_508','v_n2_574','v_n2_573'],
    requiredGrammarIds:['g_n3_89','g_n2_37','g_n2_27'],
    starterQuestions:[
      { ja:'環境のために、何ができると思いますか。', ko:'환경을 위해 무엇을 할 수 있다고 생각합니까?',
        expectedPatterns:['〜べきだ','〜には'],
        sampleAnswers:[
          { ja:'温室効果ガスの排出を抑えるべきだ。', ko:'온실 효과 가스 배출을 억제해야 한다.' },
          { ja:'廃棄物を減らすには、分別が欠かせない。', ko:'폐기물을 줄이려면 분리수거가 빠질 수 없다.' },
        ] },
      { ja:'健康を保つために、心がけていることは。', ko:'건강을 지키기 위해 유념하는 것은?',
        expectedPatterns:['〜ことが大切だ','〜には'],
        sampleAnswers:[
          { ja:'十分な休養を取ることが、回復を早める。', ko:'충분한 휴양을 취하는 것이 회복을 앞당긴다.' },
          { ja:'過労を防ぐには、働き方の見直しが要る。', ko:'과로를 막으려면 일하는 방식의 재검토가 필요하다.' },
        ] },
    ],
    repairHints:[{ issue:'concrete-proposal', ko:'제안은 「分別」「再利用」 등 구체적 행동으로 — 효과를 함께 말하면 설득력이 커진다.', exampleJa:'資源を再利用し、循環させる社会を作る。' }],
  },
  {
    id:'conv_n2_policy_debate', level:'N2', titleKo:'사회 정책 찬반 토론하기',
    situationTags:['정책','찬반'],
    requiredVocabIds:['v_n2_21','v_n2_14','v_n3_1104'],
    requiredGrammarIds:['g_n2_32','g_n2_19','g_n2_37'],
    starterQuestions:[
      { ja:'この政策に賛成ですか、反対ですか。', ko:'이 정책에 찬성입니까, 반대입니까?',
        expectedPatterns:['〜にせよ〜にせよ','〜べきだ'],
        sampleAnswers:[
          { ja:'多くの人が公平に利益を受けられるので賛成です。', ko:'많은 사람이 공평하게 이익을 받을 수 있어 찬성입니다.' },
          { ja:'現場の声を聞かないことには、賛成しかねます。', ko:'현장의 목소리를 듣지 않고서는 찬성하기 어렵습니다.' },
        ] },
      { ja:'賛否が分かれる点は何だと思いますか。', ko:'찬반이 갈리는 점은 무엇이라고 생각합니까?',
        expectedPatterns:['〜とはいえ','〜をもとに'],
        sampleAnswers:[
          { ja:'費用の負担が大きい点が、賛否の分かれるところです。', ko:'비용 부담이 큰 점이 찬반이 갈리는 부분입니다.' },
          { ja:'立場が違っても、事実をもとに議論すべきです。', ko:'입장이 달라도 사실을 바탕으로 논의해야 합니다.' },
        ] },
    ],
    repairHints:[{ issue:'show-grounds', ko:'찬반은 「根拠をもとに」 — 사실과 근거를 들어 말하면 설득력이 커진다.', exampleJa:'賛成にせよ反対にせよ、根拠を示すべきです。' }],
  },
  {
    id:'conv_n2_conflict_resolution', level:'N2', titleKo:'직장 갈등 조정하기',
    situationTags:['직장','조정'],
    requiredVocabIds:['v_n2_71','v_n2_73','v_n3_1009'],
    requiredGrammarIds:['g_n2_37','g_n2_44','g_n2_24'],
    starterQuestions:[
      { ja:'職場で意見が対立したとき、どうしますか。', ko:'직장에서 의견이 대립했을 때 어떻게 합니까?',
        expectedPatterns:['〜てこそ','〜からこそ'],
        sampleAnswers:[
          { ja:'感情的にならず、率直に話し合います。', ko:'감정적이 되지 말고 솔직하게 이야기합니다.' },
          { ja:'相手の立場を理解してこそ、信頼が生まれます。', ko:'상대의 입장을 이해해야 신뢰가 생깁니다.' },
        ] },
      { ja:'対立を解決するために何が大切ですか。', ko:'대립을 해결하기 위해 무엇이 중요합니까?',
        expectedPatterns:['〜より','〜上で'],
        sampleAnswers:[
          { ja:'相手を責めるより、解決策を考えます。', ko:'상대를 탓하기보다 해결책을 생각합니다.' },
          { ja:'立場の違いを認めた上で、調整を図ります。', ko:'입장 차이를 인정한 다음 조정을 도모합니다.' },
        ] },
    ],
    repairHints:[{ issue:'calm-conflict', ko:'갈등은 「感情的にならず、率直に」 — 사실과 논점을 분리해 말하면 풀린다.', exampleJa:'感情を抑え、事実だけを淡々と伝えます。' }],
  },
  {
    id:'conv_n2_tech_ethics', level:'N2', titleKo:'기술 변화와 윤리 이야기하기',
    situationTags:['기술','윤리'],
    requiredVocabIds:['v_n2_544','v_n2_556','v_n2_547'],
    requiredGrammarIds:['g_n2_2','g_n2_30','g_n2_20'],
    starterQuestions:[
      { ja:'技術とどう付き合うべきだと思いますか。', ko:'기술과 어떻게 어울려야 한다고 생각합니까?',
        expectedPatterns:['〜にすぎない','〜つつも'],
        sampleAnswers:[
          { ja:'技術はあくまで手段にすぎません。', ko:'기술은 어디까지나 수단에 지나지 않습니다.' },
          { ja:'恩恵を受けつつも、危うさを忘れたくありません。', ko:'혜택을 받으면서도 위험을 잊고 싶지 않습니다.' },
        ] },
      { ja:'技術の進歩で生じる課題は何ですか。', ko:'기술 진보로 생기는 과제는 무엇입니까?',
        expectedPatterns:['〜にともなって','〜ばかりか'],
        sampleAnswers:[
          { ja:'技術の進歩にともなって、新しい課題も生まれます。', ko:'기술 진보에 따라 새로운 과제도 생깁니다.' },
          { ja:'便利さばかりか、危うさにも目を向けるべきです。', ko:'편리함뿐 아니라 위험에도 눈을 돌려야 합니다.' },
        ] },
    ],
    repairHints:[{ issue:'tech-balance', ko:'기술은 「手段にすぎない」 관점으로 — 목적을 함께 말하면 균형 잡힌 의견이 된다.', exampleJa:'何のために使うのかを、問い直すべきです。' }],
  },
  {
    id:'conv_n2_env_proposal', level:'N2', titleKo:'환경 문제 제안하기',
    situationTags:['환경','제안'],
    requiredVocabIds:['v_n2_501','v_n3_33','v_n2_169'],
    requiredGrammarIds:['g_n2_75','g_n2_37','g_n2_27'],
    starterQuestions:[
      { ja:'環境のために、何ができると思いますか。', ko:'환경을 위해 무엇을 할 수 있다고 생각합니까?',
        expectedPatterns:['〜なくして','〜には'],
        sampleAnswers:[
          { ja:'資源を再利用し、循環させる社会を作りましょう。', ko:'자원을 재이용해 순환시키는 사회를 만듭시다.' },
          { ja:'小さな心がけなくして、大きな変化は望めません。', ko:'작은 마음가짐 없이 큰 변화는 바랄 수 없습니다.' },
        ] },
      { ja:'身近にできる取り組みは何ですか。', ko:'가까이서 할 수 있는 노력은 무엇입니까?',
        expectedPatterns:['〜てこそ','〜べきだ'],
        sampleAnswers:[
          { ja:'廃棄物を減らすには、分別が欠かせません。', ko:'폐기물을 줄이려면 분리수거가 빠질 수 없습니다.' },
          { ja:'住民が協力してこそ、清掃活動は続きます。', ko:'주민이 협력해야 청소 활동이 이어집니다.' },
        ] },
    ],
    repairHints:[{ issue:'concrete-proposal', ko:'제안은 「分別」「再利用」 등 구체적 행동으로 — 효과를 함께 말하면 설득력이 커진다.', exampleJa:'資源を節約することが、環境保全につながります。' }],
  },
  {
    id:'conv_n2_education_reform', level:'N2', titleKo:'교육 제도 개선 이야기하기',
    situationTags:['교육','제도'],
    requiredVocabIds:['v_n3_1058','v_n2_136','v_n3_191'],
    requiredGrammarIds:['g_n2_37','g_n2_56','g_n2_73'],
    starterQuestions:[
      { ja:'教育で最も大切なことは何だと思いますか。', ko:'교육에서 가장 중요한 것은 무엇이라고 생각합니까?',
        expectedPatterns:['〜だけではない','〜こそ'],
        sampleAnswers:[
          { ja:'教育の目的は、知識を詰め込むことだけではありません。', ko:'교육의 목적은 지식을 채워 넣는 것만이 아닙니다.' },
          { ja:'自ら考える力を育てることが、教育の本質です。', ko:'스스로 생각하는 힘을 기르는 것이 교육의 본질입니다.' },
        ] },
      { ja:'教育制度をどう改善すべきだと思いますか。', ko:'교육 제도를 어떻게 개선해야 한다고 생각합니까?',
        expectedPatterns:['〜てこそ','〜には'],
        sampleAnswers:[
          { ja:'教育制度の改善は、現場の声を聞いてこそ進みます。', ko:'교육 제도 개선은 현장의 목소리를 들어야 나아갑니다.' },
          { ja:'一人ひとりの個性を尊重する指導が求められます。', ko:'한 사람 한 사람의 개성을 존중하는 지도가 요구됩니다.' },
        ] },
    ],
    repairHints:[{ issue:'education-essence', ko:'교육은 「考える力を育てる」 본질로 — 구체적 방법을 함께 말하면 좋다.', exampleJa:'宿題は量より、中身が大切だと思います。' }],
  },
  {
    id:'conv_n2_local_issue', level:'N2', titleKo:'지역 문제 해결 제안하기',
    situationTags:['지역','제안'],
    requiredVocabIds:['v_n2_181','v_n3_1104','v_n2_289'],
    requiredGrammarIds:['g_n2_70','g_n2_77','g_n2_37'],
    starterQuestions:[
      { ja:'地域の活性化には何が必要だと思いますか。', ko:'지역 활성화에는 무엇이 필요하다고 생각합니까?',
        expectedPatterns:['〜ならではの','〜なくして'],
        sampleAnswers:[
          { ja:'地域ならではの魅力を生かしたいと思います。', ko:'지역 고유의 매력을 살리고 싶습니다.' },
          { ja:'地域の課題は、住民の参加なくして解決しません。', ko:'지역의 과제는 주민 참여 없이 해결되지 않습니다.' },
        ] },
      { ja:'地域の問題をどう解決しますか。', ko:'지역 문제를 어떻게 해결합니까?',
        expectedPatterns:['〜てこそ','〜だけでなく'],
        sampleAnswers:[
          { ja:'行政と住民が協働してこそ、町は良くなります。', ko:'행정과 주민이 협동해야 마을이 좋아집니다.' },
          { ja:'外から人を呼ぶだけでなく、住む人の誇りが大切です。', ko:'밖에서 사람을 부르는 것뿐 아니라 사는 사람의 자긍심이 중요합니다.' },
        ] },
    ],
    repairHints:[{ issue:'sustainable-system', ko:'지역 문제는 「続けられる仕組み」로 — 지속 가능한 방안을 제시하면 좋다.', exampleJa:'続けられる仕組みづくりが、何より大切です。' }],
  },
  {
    id:'conv_n2_consumer_complaint', level:'N2', titleKo:'소비자 불만 조정하기',
    situationTags:['소비','불만'],
    requiredVocabIds:['v_n3_584','v_n2_43','v_n2_28'],
    requiredGrammarIds:['g_n2_14','g_n2_24','g_n2_37'],
    starterQuestions:[
      { ja:'商品に問題があったとき、どう伝えますか。', ko:'상품에 문제가 있을 때 어떻게 전합니까?',
        expectedPatterns:['〜ように','〜ところ'],
        sampleAnswers:[
          { ja:'説明と違う点について、納得がいきません。', ko:'설명과 다른 점에 대해 납득이 가지 않습니다.' },
          { ja:'未使用なら、返品に応じてもらえますか。', ko:'미사용이라면 반품에 응해 주실 수 있나요?' },
        ] },
      { ja:'不満をどう解消したいですか。', ko:'불만을 어떻게 해소하고 싶습니까?',
        expectedPatterns:['〜たところ','〜てほしい'],
        sampleAnswers:[
          { ja:'要望を伝えたところ、すぐに対応してくれました。', ko:'요망을 전했더니 바로 대응해 주었습니다.' },
          { ja:'丁寧な説明があれば、不満も解消されます。', ko:'정중한 설명이 있으면 불만도 해소됩니다.' },
        ] },
    ],
    repairHints:[{ issue:'calm-complaint', ko:'불만은 「事実+要望」으로 — 구체적으로 무엇을 바라는지 함께 말하면 조정이 쉽다.', exampleJa:'品質の改善を、強く求めたいと思います。' }],
  },
  {
    id:'conv_n2_news_opinion', level:'N2', titleKo:'뉴스 기사에 대한 의견 말하기',
    situationTags:['뉴스','의견'],
    requiredVocabIds:['v_n3_1007','v_n3_1008','v_n2_73'],
    requiredGrammarIds:['g_n2_44','g_n2_25','g_n2_37'],
    starterQuestions:[
      { ja:'ニュース記事をどう読むべきだと思いますか。', ko:'뉴스 기사를 어떻게 읽어야 한다고 생각합니까?',
        expectedPatterns:['〜だけで','〜べきだ'],
        sampleAnswers:[
          { ja:'一つの記事だけで、判断するのは危険です。', ko:'하나의 기사만으로 판단하는 것은 위험합니다.' },
          { ja:'事実と書き手の意見を、区別して読みたいです。', ko:'사실과 글쓴이의 의견을 구별해서 읽고 싶습니다.' },
        ] },
      { ja:'情報とどう向き合いますか。', ko:'정보와 어떻게 마주합니까?',
        expectedPatterns:['〜からこそ','〜ずに'],
        sampleAnswers:[
          { ja:'情報があふれる時代だからこそ、慎重に選びたいです。', ko:'정보가 넘치는 시대이기에 신중하게 고르고 싶습니다.' },
          { ja:'複数の出所を、照らし合わせて確かめます。', ko:'여러 출처를 대조해서 확인합니다.' },
        ] },
    ],
    repairHints:[{ issue:'verify-sources', ko:'뉴스는 「出所を確かめる」 자세로 — 사실과 의견을 구별해 말하면 좋다.', exampleJa:'報道の内容を、うのみにしてはいけません。' }],
  },
];
