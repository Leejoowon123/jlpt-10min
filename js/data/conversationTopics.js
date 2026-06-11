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
];
