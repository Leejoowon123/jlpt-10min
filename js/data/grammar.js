// GrammarItem: { id, level, pattern, meaningKo, explanation, examples[], similarGrammarIds[], tags[] }
// examples: [{ ja, ko }]
export const grammar = [
  // ---------- N5 ----------
  { id:'g_n5_1', level:'N5', pattern:'〜は〜です', meaningKo:'〜은/는 〜입니다',
    explanation:'주제를 나타내는 「は」와 단정의 「です」 조합. 자기소개 등 기본 문형.',
    examples:[
      { ja:'私は学生です。', ko:'저는 학생입니다.' },
      { ja:'これは本です。',  ko:'이것은 책입니다.' },
    ],
    similarGrammarIds:['g_n5_2'], tags:['기본문형'] },

  { id:'g_n5_2', level:'N5', pattern:'〜が〜です', meaningKo:'〜이/가 〜입니다 (소개·식별)',
    explanation:'「が」는 새롭게 등장하거나 식별이 필요한 주어에 붙어 그 자체에 초점을 둠. 「は」가 주제(이미 아는 것)에 가깝다면 「が」는 신정보·식별을 강조.',
    examples:[
      { ja:'あの人が田中さんです。', ko:'저 사람이 다나카 씨입니다.' },
      { ja:'雨が降っています。', ko:'비가 내리고 있습니다.' },
    ],
    similarGrammarIds:['g_n5_1'], tags:['기본문형','조사'] },

  { id:'g_n5_3', level:'N5', pattern:'〜に行く', meaningKo:'〜에 가다',
    explanation:'장소+に+行く 형태로 어디로 가는지를 나타냄. 도착점에 초점.',
    examples:[
      { ja:'学校に行きます。', ko:'학교에 갑니다.' },
      { ja:'日本に行きたいです。', ko:'일본에 가고 싶습니다.' },
    ],
    similarGrammarIds:['g_n5_4'], tags:['조사'] },

  { id:'g_n5_4', level:'N5', pattern:'〜で〜する', meaningKo:'〜에서/〜로 〜하다',
    explanation:'동작이 일어나는 장소나 수단을 나타냄. 「に」가 도착점·존재 위치라면 「で」는 동작의 장소/수단.',
    examples:[
      { ja:'図書館で本を読みます。', ko:'도서관에서 책을 읽습니다.' },
      { ja:'電車で行きます。',       ko:'전철로 갑니다.' },
    ],
    similarGrammarIds:['g_n5_3'], tags:['조사'] },

  { id:'g_n5_5', level:'N5', pattern:'〜ています', meaningKo:'〜하고 있습니다 (진행/상태)',
    explanation:'동작 진행 또는 결과 상태를 나타냄. 「待っています」는 "기다리고 있다", 「結婚しています」는 "결혼한 상태이다".',
    examples:[
      { ja:'今、ご飯を食べています。', ko:'지금 밥을 먹고 있습니다.' },
      { ja:'彼は東京に住んでいます。', ko:'그는 도쿄에 살고 있습니다.' },
    ],
    similarGrammarIds:[], tags:['동사활용'] },

  // --- N5 확장 ---
  { id:'g_n5_6', level:'N5', pattern:'〜を〜ます', meaningKo:'〜을/를 〜합니다 (목적어)',
    explanation:'타동사의 목적어는 「を」로 표시. 동작의 대상에 붙는 조사.',
    examples:[
      { ja:'パンを食べます。', ko:'빵을 먹습니다.' },
      { ja:'手紙を書きます。', ko:'편지를 씁니다.' },
    ],
    similarGrammarIds:[], tags:['조사','기본문형'] },

  { id:'g_n5_7', level:'N5', pattern:'〜があります', meaningKo:'〜이/가 있습니다 (무생물·식물)',
    explanation:'움직이지 않는 사물·식물·추상물의 존재. 동물·사람에게는 「います」를 쓴다.',
    examples:[
      { ja:'机の上に本があります。', ko:'책상 위에 책이 있습니다.' },
      { ja:'公園に花があります。', ko:'공원에 꽃이 있습니다.' },
    ],
    similarGrammarIds:['g_n5_8'], tags:['존재'] },

  { id:'g_n5_8', level:'N5', pattern:'〜がいます', meaningKo:'〜이/가 있습니다 (사람·동물)',
    explanation:'사람이나 동물 등 움직이는 생물의 존재. 「あります」와 의미는 같으나 대상이 다름.',
    examples:[
      { ja:'部屋に猫がいます。', ko:'방에 고양이가 있습니다.' },
      { ja:'公園に子供がいます。', ko:'공원에 아이가 있습니다.' },
    ],
    similarGrammarIds:['g_n5_7'], tags:['존재'] },

  { id:'g_n5_9', level:'N5', pattern:'〜ません', meaningKo:'〜하지 않습니다 (정중 부정)',
    explanation:'동사「ます」형의 부정. 정중하게 "안 한다"는 의미.',
    examples:[
      { ja:'お酒は飲みません。', ko:'술은 마시지 않습니다.' },
      { ja:'肉を食べません。', ko:'고기를 먹지 않습니다.' },
    ],
    similarGrammarIds:[], tags:['동사활용'] },

  { id:'g_n5_10', level:'N5', pattern:'〜ましょう', meaningKo:'〜합시다 (적극적 제안)',
    explanation:'함께 하자는 권유·제안. 「〜ましょうか」는 좀 더 부드러운 권유.',
    examples:[
      { ja:'一緒に行きましょう。', ko:'같이 갑시다.' },
      { ja:'お茶を飲みましょう。', ko:'차를 마십시다.' },
    ],
    similarGrammarIds:['g_n5_11'], tags:['제안'] },

  { id:'g_n5_11', level:'N5', pattern:'〜ませんか', meaningKo:'〜하지 않겠습니까 (부드러운 권유)',
    explanation:'상대 의사를 묻듯 부드럽게 권유. 「〜ましょう」보다 강요감이 적음.',
    examples:[
      { ja:'一緒にご飯を食べませんか。', ko:'같이 밥 먹지 않을래요?' },
      { ja:'映画を見ませんか。', ko:'영화 보지 않을래요?' },
    ],
    similarGrammarIds:['g_n5_10'], tags:['제안'] },

  { id:'g_n5_12', level:'N5', pattern:'〜たいです', meaningKo:'〜하고 싶습니다 (희망)',
    explanation:'화자 자신의 희망. 동사 ます형에서 ます를 빼고 たい를 붙임.',
    examples:[
      { ja:'日本へ行きたいです。', ko:'일본에 가고 싶습니다.' },
      { ja:'水が飲みたいです。', ko:'물이 마시고 싶습니다.' },
    ],
    similarGrammarIds:['g_n5_21'], tags:['희망'] },

  { id:'g_n5_13', level:'N5', pattern:'〜てください', meaningKo:'〜해 주세요 (정중한 의뢰)',
    explanation:'동사 て형 + ください. 정중한 부탁/지시.',
    examples:[
      { ja:'ここに名前を書いてください。', ko:'여기에 이름을 써 주세요.' },
      { ja:'もう一度言ってください。', ko:'한 번 더 말해 주세요.' },
    ],
    similarGrammarIds:[], tags:['의뢰'] },

  { id:'g_n5_14', level:'N5', pattern:'〜てもいいです', meaningKo:'〜해도 됩니다 (허락)',
    explanation:'동사 て형 + もいいです. 허가/허락. 의문형은 「〜てもいいですか」.',
    examples:[
      { ja:'写真を撮ってもいいですか。', ko:'사진을 찍어도 됩니까?' },
      { ja:'ここに座ってもいいです。', ko:'여기 앉아도 됩니다.' },
    ],
    similarGrammarIds:['g_n5_15'], tags:['허락'] },

  { id:'g_n5_15', level:'N5', pattern:'〜てはいけません', meaningKo:'〜해서는 안 됩니다 (금지)',
    explanation:'동사 て형 + はいけません. 금지. 회화체로는 「〜ちゃだめ」.',
    examples:[
      { ja:'ここでタバコを吸ってはいけません。', ko:'여기서 담배를 피우면 안 됩니다.' },
      { ja:'授業中、寝てはいけません。', ko:'수업 중에 자면 안 됩니다.' },
    ],
    similarGrammarIds:['g_n5_14'], tags:['금지'] },

  { id:'g_n5_16', level:'N5', pattern:'〜から (이유)', meaningKo:'〜이기 때문에 (이유)',
    explanation:'원인·이유를 나타냄. 보통체/정중체 모두 가능. 같은 「から」 가 시작점을 나타내는 용법과 구별 필요.',
    examples:[
      { ja:'寒いから、家にいます。', ko:'추워서 집에 있습니다.' },
      { ja:'忙しいから、行けません。', ko:'바빠서 갈 수 없습니다.' },
    ],
    similarGrammarIds:['g_n5_17'], tags:['이유'] },

  { id:'g_n5_17', level:'N5', pattern:'〜まで', meaningKo:'〜까지 (시간·장소의 종착점)',
    explanation:'끝나는 지점/시점을 나타냄. 「〜から〜まで」로 짝지어 자주 씀.',
    examples:[
      { ja:'駅まで歩きます。', ko:'역까지 걷습니다.' },
      { ja:'9時から5時まで働きます。', ko:'9시부터 5시까지 일합니다.' },
    ],
    similarGrammarIds:['g_n5_16'], tags:['조사'] },

  { id:'g_n5_18', level:'N5', pattern:'〜の〜', meaningKo:'〜의 〜 (소유·수식)',
    explanation:'명사가 명사를 수식할 때 「の」로 잇는다. 소유·소속·종류 모두 표현.',
    examples:[
      { ja:'これは私の本です。', ko:'이건 제 책입니다.' },
      { ja:'日本語の先生です。', ko:'일본어 선생님입니다.' },
    ],
    similarGrammarIds:[], tags:['조사','수식'] },

  { id:'g_n5_19', level:'N5', pattern:'〜と (전부 나열)', meaningKo:'〜와/과 (전부 열거)',
    explanation:'대상을 모두 열거. 「や」가 일부 예시라면 「と」는 빠짐없는 전부 열거.',
    examples:[
      { ja:'りんごとバナナを買いました。', ko:'사과와 바나나를 샀습니다.' },
      { ja:'母と一緒に行きます。', ko:'어머니와 함께 갑니다.' },
    ],
    similarGrammarIds:['g_n5_20'], tags:['조사'] },

  { id:'g_n5_20', level:'N5', pattern:'〜や (예시 나열)', meaningKo:'〜이나/등 (예시 열거)',
    explanation:'몇 가지를 예로 들어 열거. "그 외에도 더 있다"는 뉘앙스. 「など」와 자주 함께.',
    examples:[
      { ja:'冷蔵庫に牛乳やジュースなどがあります。', ko:'냉장고에 우유랑 주스 등이 있습니다.' },
    ],
    similarGrammarIds:['g_n5_19'], tags:['조사'] },

  { id:'g_n5_21', level:'N5', pattern:'〜が好きです', meaningKo:'〜을/를 좋아합니다',
    explanation:'좋아하는 대상은 「が」로 표시. 한국어 "을/를"과 조사가 달라 자주 헷갈림.',
    examples:[
      { ja:'私は猫が好きです。', ko:'저는 고양이를 좋아합니다.' },
      { ja:'音楽が好きじゃありません。', ko:'음악을 좋아하지 않습니다.' },
    ],
    similarGrammarIds:['g_n5_12'], tags:['감정','조사'] },

  // --- N5 2.1 라운드 확장 ---
  { id:'g_n5_22', level:'N5', pattern:'〜も', meaningKo:'〜도 (역시·첨가)',
    explanation:'이미 말한 항목에 추가/포함을 나타냄. 「は」자리에 「も」를 두면 "역시"의 의미.',
    examples:[
      { ja:'私も学生です。', ko:'저도 학생입니다.' },
      { ja:'弟も来ます。', ko:'남동생도 옵니다.' },
    ],
    similarGrammarIds:['g_n5_1'], tags:['조사'] },

  { id:'g_n5_23', level:'N5', pattern:'〜か', meaningKo:'〜입니까 (의문)',
    explanation:'정중체 문장 끝에 「か」를 붙여 의문문을 만듦. 한국어의 "?"와 유사한 역할.',
    examples:[
      { ja:'あなたは学生ですか。', ko:'당신은 학생입니까?' },
      { ja:'これは本ですか。', ko:'이건 책입니까?' },
    ],
    similarGrammarIds:[], tags:['조사','의문'] },

  { id:'g_n5_24', level:'N5', pattern:'〜ね', meaningKo:'〜네요/군요 (공감·확인)',
    explanation:'상대와의 공감이나 확인을 구할 때 문장 끝에 붙임. 부드러운 회화 표현.',
    examples:[
      { ja:'いい天気ですね。', ko:'날씨가 좋네요.' },
      { ja:'暑いですね。', ko:'덥네요.' },
    ],
    similarGrammarIds:['g_n5_25'], tags:['종조사','회화'] },

  { id:'g_n5_25', level:'N5', pattern:'〜よ', meaningKo:'〜에요 (강조·알림)',
    explanation:'상대가 모를 만한 정보를 알려줄 때 강조적으로 붙임.',
    examples:[
      { ja:'あの店、おいしいですよ。', ko:'저 가게, 맛있어요.' },
      { ja:'もう遅いですよ。', ko:'벌써 늦었어요.' },
    ],
    similarGrammarIds:['g_n5_24'], tags:['종조사','회화'] },

  { id:'g_n5_26', level:'N5', pattern:'〜より〜のほうが', meaningKo:'〜보다 〜쪽이 (비교)',
    explanation:'두 대상의 비교에서 어느 한쪽을 강조. 「Aより Bのほうが+형용사」 형태가 기본.',
    examples:[
      { ja:'犬より猫のほうが好きです。', ko:'개보다 고양이가 더 좋습니다.' },
      { ja:'山より海のほうがいいです。', ko:'산보다 바다가 좋습니다.' },
    ],
    similarGrammarIds:[], tags:['비교'] },

  { id:'g_n5_27', level:'N5', pattern:'〜がほしいです', meaningKo:'〜이/가 갖고 싶습니다',
    explanation:'명사 대상을 갖고 싶다는 희망. 「〜たいです」는 동사용, 「〜がほしいです」는 명사용.',
    examples:[
      { ja:'新しい本がほしいです。', ko:'새 책을 갖고 싶습니다.' },
      { ja:'時間がほしいです。', ko:'시간이 필요합니다.' },
    ],
    similarGrammarIds:['g_n5_12'], tags:['희망'] },

  { id:'g_n5_28', level:'N5', pattern:'〜前に', meaningKo:'〜전에',
    explanation:'동사 사전형 + 前に / 명사 + の前に. 어떤 동작 이전을 나타냄.',
    examples:[
      { ja:'食事の前に手を洗います。', ko:'식사 전에 손을 씻습니다.' },
      { ja:'寝る前に本を読みます。', ko:'자기 전에 책을 읽습니다.' },
    ],
    similarGrammarIds:['g_n5_29'], tags:['시간'] },

  { id:'g_n5_29', level:'N5', pattern:'〜後で', meaningKo:'〜후에',
    explanation:'동사 た형 + 後で / 명사 + の後で. 어떤 동작 이후를 나타냄.',
    examples:[
      { ja:'食事の後で散歩します。', ko:'식사 후에 산책합니다.' },
      { ja:'食べた後で歯を磨きます。', ko:'먹은 후에 이를 닦습니다.' },
    ],
    similarGrammarIds:['g_n5_28'], tags:['시간'] },

  { id:'g_n5_30', level:'N5', pattern:'〜ながら', meaningKo:'〜하면서 (동시 동작)',
    explanation:'동사 ます형에서 ます를 빼고 ながら 를 붙여 "A하면서 B한다" 의 동시 동작.',
    examples:[
      { ja:'音楽を聞きながら勉強します。', ko:'음악을 들으면서 공부합니다.' },
      { ja:'歩きながら話します。', ko:'걸으면서 이야기합니다.' },
    ],
    similarGrammarIds:[], tags:['동사활용'] },

  { id:'g_n5_31', level:'N5', pattern:'〜だけ', meaningKo:'〜만 (한정)',
    explanation:'대상을 한정해서 "그것만"의 의미. 명사·수량사 뒤에 붙임.',
    examples:[
      { ja:'一つだけください。', ko:'하나만 주세요.' },
      { ja:'私だけ来ました。', ko:'저만 왔습니다.' },
    ],
    similarGrammarIds:[], tags:['조사','한정'] },

  // --- N5 2.2 라운드 확장 ---
  { id:'g_n5_32', level:'N5', pattern:'〜とき', meaningKo:'〜할 때',
    explanation:'어떤 동작·상태의 시점. 동사 사전형/た형/명사+の/형용사+とき 형태로 결합.',
    examples:[
      { ja:'勉強するとき、音楽を聞きます。', ko:'공부할 때 음악을 듣습니다.' },
      { ja:'子供のとき、よく遊びました。', ko:'아이일 때 자주 놀았습니다.' },
    ],
    similarGrammarIds:[], tags:['시간'] },

  { id:'g_n5_33', level:'N5', pattern:'〜くらい/〜ぐらい', meaningKo:'〜정도/약 (대략)',
    explanation:'수량이나 정도의 대략을 나타냄. 회화에서는 「くらい」「ぐらい」를 거의 같게 사용.',
    examples:[
      { ja:'駅まで十分くらいです。', ko:'역까지 10분 정도입니다.' },
      { ja:'三人ぐらい来ます。', ko:'세 명 정도 옵니다.' },
    ],
    similarGrammarIds:[], tags:['수량','정도'] },

  { id:'g_n5_34', level:'N5', pattern:'〜になる', meaningKo:'〜이/가 되다 (변화)',
    explanation:'명사·な형용사 어간 + になる, い형용사는 어간 + くなる. 상태의 변화를 나타냄.',
    examples:[
      { ja:'もうすぐ夏になります。', ko:'곧 여름이 됩니다.' },
      { ja:'寒くなりました。', ko:'추워졌습니다.' },
    ],
    similarGrammarIds:[], tags:['변화'] },

  { id:'g_n5_35', level:'N5', pattern:'〜でしょう', meaningKo:'〜이겠지요 (가벼운 추측/확인)',
    explanation:'가벼운 추측이나 청자에게 동의를 구할 때. 일기예보·확인 회화에 자주 등장.',
    examples:[
      { ja:'明日は晴れるでしょう。', ko:'내일은 맑겠지요.' },
      { ja:'これはあなたの本でしょう。', ko:'이건 당신 책이지요?' },
    ],
    similarGrammarIds:[], tags:['추측','회화'] },

  // --- N5 대량 확장 1차 ---
  { id:'g_n5_36', level:'N5', pattern:'〜は〜ですか', meaningKo:'〜은/는 〜입니까? (의문 기본형)',
    explanation:'주제 + 단정 + 의문 종조사 か. 가장 기본적인 의문문 구조.',
    examples:[
      { ja:'これは何ですか。', ko:'이것은 무엇입니까?' },
      { ja:'あの人は学生ですか。', ko:'저 사람은 학생입니까?' },
    ],
    similarGrammarIds:['g_n5_1','g_n5_23'], tags:['기본문형','의문'] },

  { id:'g_n5_37', level:'N5', pattern:'〜じゃありません', meaningKo:'〜이/가 아닙니다 (정중 부정)',
    explanation:'명사·な형용사 정중 부정. 「〜ではありません」의 회화체. 더 정중하면 「〜ではございません」.',
    examples:[
      { ja:'これは私のじゃありません。', ko:'이건 제 것이 아닙니다.' },
      { ja:'学生じゃありません。', ko:'학생이 아닙니다.' },
    ],
    similarGrammarIds:['g_n5_1'], tags:['기본문형','부정'] },

  { id:'g_n5_38', level:'N5', pattern:'〜けど', meaningKo:'〜지만/그런데 (회화 역접)',
    explanation:'역접·전제. 「〜けれども」의 회화체. 정중체에서는 「〜ですけど」.',
    examples:[
      { ja:'高いけど、買います。', ko:'비싸지만 사겠습니다.' },
      { ja:'すみませんけど、駅はどこですか。', ko:'죄송한데요, 역은 어디입니까?' },
    ],
    similarGrammarIds:['g_n5_39'], tags:['역접','회화'] },

  { id:'g_n5_39', level:'N5', pattern:'〜が (역접)', meaningKo:'〜이지만 (역접)',
    explanation:'문장과 문장을 잇는 역접의 「が」. 「けど」와 의미는 같으나 문어체에 가까움.',
    examples:[
      { ja:'寒いですが、出かけます。', ko:'춥지만 외출합니다.' },
      { ja:'勉強しましたが、忘れました。', ko:'공부했지만 잊어버렸습니다.' },
    ],
    similarGrammarIds:['g_n5_38'], tags:['역접'] },

  { id:'g_n5_40', level:'N5', pattern:'まだ〜ません', meaningKo:'아직 〜하지 않았습니다',
    explanation:'어떤 동작이 아직 일어나지 않았음을 나타냄. 「もう」(이미)와 짝.',
    examples:[
      { ja:'まだ食べていません。', ko:'아직 먹지 않았습니다.' },
      { ja:'宿題はまだ終わりません。', ko:'숙제는 아직 끝나지 않았습니다.' },
    ],
    similarGrammarIds:['g_n5_41'], tags:['시간','부정'] },

  { id:'g_n5_41', level:'N5', pattern:'もう〜ました', meaningKo:'이미/벌써 〜했습니다',
    explanation:'어떤 동작이 이미 완료됐음을 나타냄. 「まだ」와 반대.',
    examples:[
      { ja:'もう食べました。', ko:'이미 먹었습니다.' },
      { ja:'もう宿題が終わりました。', ko:'벌써 숙제가 끝났습니다.' },
    ],
    similarGrammarIds:['g_n5_40'], tags:['시간','완료'] },

  { id:'g_n5_42', level:'N5', pattern:'〜たち', meaningKo:'〜들 (사람 복수)',
    explanation:'사람을 가리키는 명사에 붙어 복수를 나타냄. 私たち, 子供たち, 友だち(이미 복수 포함) 등.',
    examples:[
      { ja:'子供たちが遊んでいます。', ko:'아이들이 놀고 있습니다.' },
      { ja:'私たちは学生です。', ko:'우리는 학생입니다.' },
    ],
    similarGrammarIds:[], tags:['복수'] },

  { id:'g_n5_43', level:'N5', pattern:'〜方', meaningKo:'〜하는 법/방법',
    explanation:'동사 ます형에서 ます를 빼고 「方(かた)」를 붙여 "~하는 법". 예: 読み方·書き方.',
    examples:[
      { ja:'この漢字の読み方を教えてください。', ko:'이 한자의 읽는 법을 알려 주세요.' },
      { ja:'作り方は簡単です。', ko:'만드는 법은 간단합니다.' },
    ],
    similarGrammarIds:[], tags:['방법'] },

  { id:'g_n5_44', level:'N5', pattern:'あまり〜ない', meaningKo:'그다지 〜않다',
    explanation:'정도가 낮음. 부정형과 함께 사용. 「あまり好きじゃありません」 등.',
    examples:[
      { ja:'あまり辛くないです。', ko:'그다지 맵지 않습니다.' },
      { ja:'あまり時間がありません。', ko:'시간이 별로 없습니다.' },
    ],
    similarGrammarIds:['g_n5_45'], tags:['정도','부정'] },

  { id:'g_n5_45', level:'N5', pattern:'全然〜ない', meaningKo:'전혀 〜않다',
    explanation:'완전 부정. 부정형과 짝. 회화에서 매우 자주 등장.',
    examples:[
      { ja:'全然わかりません。', ko:'전혀 모릅니다.' },
      { ja:'全然辛くないです。', ko:'전혀 맵지 않습니다.' },
    ],
    similarGrammarIds:['g_n5_44'], tags:['정도','부정'] },

  // ---------- N4 ----------
  { id:'g_n4_1', level:'N4', pattern:'〜てしまう', meaningKo:'〜해 버리다 (완료/유감)',
    explanation:'동작의 완료 또는 의도치 않은 결과(유감)를 나타냄. 회화에서는 「〜ちゃう」로 줄여 씀.',
    examples:[
      { ja:'宿題を忘れてしまいました。', ko:'숙제를 잊어버렸습니다.' },
      { ja:'全部食べてしまった。', ko:'전부 먹어 버렸다.' },
    ],
    similarGrammarIds:['g_n4_2'], tags:['보조동사'] },

  { id:'g_n4_2', level:'N4', pattern:'〜ておく', meaningKo:'〜해 두다 (사전 준비)',
    explanation:'미래를 위해 미리 어떤 동작을 해 두는 것을 나타냄. 회화에서는 「〜とく」로 줄여 씀.',
    examples:[
      { ja:'明日のために準備しておきます。', ko:'내일을 위해 준비해 둡니다.' },
      { ja:'冷蔵庫に入れておいて。', ko:'냉장고에 넣어 둬.' },
    ],
    similarGrammarIds:['g_n4_1'], tags:['보조동사'] },

  { id:'g_n4_3', level:'N4', pattern:'〜なければならない', meaningKo:'〜하지 않으면 안 된다',
    explanation:'의무·필요. 회화에서는 「〜なきゃ」「〜ないと」로 줄임.',
    examples:[
      { ja:'毎日勉強しなければなりません。', ko:'매일 공부해야 합니다.' },
      { ja:'もう帰らなきゃ。', ko:'이제 가야 해.', readings:[{text:'帰らなきゃ',reading:'かえらなきゃ'}] },
    ],
    similarGrammarIds:['g_n4_4'], tags:['의무'] },

  { id:'g_n4_4', level:'N4', pattern:'〜なくてもいい', meaningKo:'〜하지 않아도 된다',
    explanation:'불필요·허락. 「〜なければならない」의 반대 표현.',
    examples:[
      { ja:'明日は来なくてもいいです。', ko:'내일은 오지 않아도 됩니다.' },
      { ja:'急がなくてもいいよ。', ko:'서두르지 않아도 돼.', readings:[{text:'急がなくて',reading:'いそがなくて'}] },
    ],
    similarGrammarIds:['g_n4_3'], tags:['허락'] },

  // ─── N4 1차 시드 확장 (라운드 14) ───────────────────────────────────
  { id:'g_n4_5', level:'N4', pattern:'〜ことがある', meaningKo:'〜한 적이 있다 (경험)',
    explanation:'과거의 경험을 나타냄. 동사 た형 + ことがある.',
    examples:[
      { ja:'日本に行ったことがあります。', ko:'일본에 간 적이 있습니다.',
        readings:[{text:'日本',reading:'にほん'},{text:'行った',reading:'いった'}] },
      { ja:'すしを食べたことがある。', ko:'초밥을 먹은 적이 있다.',
        readings:[{text:'食べた',reading:'たべた'}] },
    ], similarGrammarIds:[], tags:['경험'] },

  { id:'g_n4_6', level:'N4', pattern:'〜たり〜たりする', meaningKo:'〜하기도 하고 〜하기도 하다',
    explanation:'여러 동작을 나열할 때 사용. 동사 た형 + り.',
    examples:[
      { ja:'週末は本を読んだり映画を見たりします。', ko:'주말에는 책을 읽기도 하고 영화를 보기도 합니다.',
        readings:[{text:'週末',reading:'しゅうまつ'},{text:'本',reading:'ほん'},{text:'読んだり',reading:'よんだり'},{text:'映画',reading:'えいが'},{text:'見たり',reading:'みたり'}] },
      { ja:'公園で歩いたり走ったりした。', ko:'공원에서 걷기도 하고 뛰기도 했다.',
        readings:[{text:'公園',reading:'こうえん'},{text:'歩いたり',reading:'あるいたり'},{text:'走ったり',reading:'はしったり'}] },
    ], similarGrammarIds:[], tags:['나열'] },

  { id:'g_n4_7', level:'N4', pattern:'〜てみる', meaningKo:'〜해 보다 (시도)',
    explanation:'어떤 동작을 시험 삼아 해 보는 것을 나타냄.',
    examples:[
      { ja:'新しい料理を作ってみました。', ko:'새 요리를 만들어 봤습니다.',
        readings:[{text:'新しい',reading:'あたらしい'},{text:'料理',reading:'りょうり'},{text:'作って',reading:'つくって'}] },
      { ja:'この服を着てみてください。', ko:'이 옷을 입어 보세요.',
        readings:[{text:'服',reading:'ふく'},{text:'着て',reading:'きて'}] },
    ], similarGrammarIds:[], tags:['시도'] },

  { id:'g_n4_8', level:'N4', pattern:'〜そうです (전문)', meaningKo:'〜라고 합니다 (전해 들음)',
    explanation:'들은 정보를 전달. 동사·형용사 보통형 + そうです.',
    examples:[
      { ja:'明日は雨だそうです。', ko:'내일은 비가 온다고 합니다.',
        readings:[{text:'明日',reading:'あした'},{text:'雨',reading:'あめ'}] },
      { ja:'彼は来ないそうだ。', ko:'그는 오지 않는다고 한다.',
        readings:[{text:'彼',reading:'かれ'},{text:'来ない',reading:'こない'}] },
    ], similarGrammarIds:['g_n4_9'], tags:['전문'] },

  { id:'g_n4_9', level:'N4', pattern:'〜そうです (양태)', meaningKo:'〜할 것 같다 (보고 판단)',
    explanation:'겉으로 보이는 모습으로 추측. 동사 ます형/형용사 어간 + そうです.',
    examples:[
      { ja:'雨が降りそうです。', ko:'비가 올 것 같습니다.',
        readings:[{text:'雨',reading:'あめ'},{text:'降り',reading:'ふり'}] },
      { ja:'このケーキはおいしそうだ。', ko:'이 케이크는 맛있어 보인다.' },
    ], similarGrammarIds:['g_n4_8'], tags:['추측'] },

  { id:'g_n4_10', level:'N4', pattern:'〜ようです', meaningKo:'〜인 것 같다 (관찰·근거)',
    explanation:'정황으로 보아 그렇다고 판단. 「ようだ」.',
    examples:[
      { ja:'誰か来たようです。', ko:'누군가 온 것 같습니다.',
        readings:[{text:'誰',reading:'だれ'},{text:'来た',reading:'きた'}] },
      { ja:'彼は元気のようだ。', ko:'그는 건강한 것 같다.',
        readings:[{text:'彼',reading:'かれ'},{text:'元気',reading:'げんき'}] },
    ], similarGrammarIds:['g_n4_11'], tags:['추측'] },

  { id:'g_n4_11', level:'N4', pattern:'〜らしい', meaningKo:'〜인 것 같다 (들은 정보·추측)',
    explanation:'간접 정보·추측. 「ようだ」보다 객관적.',
    examples:[
      { ja:'明日は休みらしいです。', ko:'내일은 휴일인 것 같습니다.',
        readings:[{text:'明日',reading:'あした'},{text:'休み',reading:'やすみ'}] },
      { ja:'彼は学生らしい。', ko:'그는 학생인 것 같다.',
        readings:[{text:'彼',reading:'かれ'},{text:'学生',reading:'がくせい'}] },
    ], similarGrammarIds:['g_n4_10'], tags:['추측'] },

  { id:'g_n4_12', level:'N4', pattern:'〜すぎる', meaningKo:'너무 〜하다',
    explanation:'정도가 지나침. 동사 ます형/형용사 어간 + すぎる.',
    examples:[
      { ja:'食べすぎました。', ko:'너무 많이 먹었습니다.',
        readings:[{text:'食べ',reading:'たべ'}] },
      { ja:'この問題は難しすぎる。', ko:'이 문제는 너무 어렵다.',
        readings:[{text:'問題',reading:'もんだい'},{text:'難し',reading:'むずかし'}] },
    ], similarGrammarIds:[], tags:['정도'] },

  { id:'g_n4_13', level:'N4', pattern:'〜やすい', meaningKo:'〜하기 쉽다',
    explanation:'동작이 쉬움. 동사 ます형 + やすい.',
    examples:[
      { ja:'この本は読みやすいです。', ko:'이 책은 읽기 쉽습니다.',
        readings:[{text:'本',reading:'ほん'},{text:'読み',reading:'よみ'}] },
      { ja:'分かりやすい説明でした。', ko:'알기 쉬운 설명이었습니다.',
        readings:[{text:'分かり',reading:'わかり'},{text:'説明',reading:'せつめい'}] },
    ], similarGrammarIds:['g_n4_14'], tags:['난이도'] },

  { id:'g_n4_14', level:'N4', pattern:'〜にくい', meaningKo:'〜하기 어렵다',
    explanation:'동작이 어려움. 동사 ます형 + にくい.',
    examples:[
      { ja:'この字は読みにくいです。', ko:'이 글자는 읽기 어렵습니다.',
        readings:[{text:'字',reading:'じ'},{text:'読み',reading:'よみ'}] },
      { ja:'歩きにくい道だった。', ko:'걷기 어려운 길이었다.',
        readings:[{text:'歩き',reading:'あるき'},{text:'道',reading:'みち'}] },
    ], similarGrammarIds:['g_n4_13'], tags:['난이도'] },

  { id:'g_n4_15', level:'N4', pattern:'〜方', meaningKo:'〜하는 방법',
    explanation:'방법·방식. 동사 ます형 + 方(かた).',
    examples:[
      { ja:'使い方を教えてください。', ko:'사용법을 알려 주세요.',
        readings:[{text:'使い方',reading:'つかいかた'},{text:'教えて',reading:'おしえて'}] },
      { ja:'作り方は簡単です。', ko:'만드는 법은 간단합니다.',
        readings:[{text:'作り方',reading:'つくりかた'},{text:'簡単',reading:'かんたん'}] },
    ], similarGrammarIds:[], tags:['방법'] },

  { id:'g_n4_16', level:'N4', pattern:'〜ために', meaningKo:'〜를 위해 / 〜때문에',
    explanation:'목적·이유. 동사 사전형/명사 の + ために.',
    examples:[
      { ja:'試験のために勉強します。', ko:'시험을 위해 공부합니다.',
        readings:[{text:'試験',reading:'しけん'},{text:'勉強',reading:'べんきょう'}] },
      { ja:'雨のために試合が中止になった。', ko:'비 때문에 시합이 중지되었다.',
        readings:[{text:'雨',reading:'あめ'},{text:'試合',reading:'しあい'},{text:'中止',reading:'ちゅうし'}] },
    ], similarGrammarIds:['g_n4_24'], tags:['목적','이유'] },

  { id:'g_n4_17', level:'N4', pattern:'〜ので', meaningKo:'〜이므로 / 〜때문에 (객관적 이유)',
    explanation:'객관적 이유·정중. 「から」보다 부드러움.',
    examples:[
      { ja:'寒いので、上着を着ます。', ko:'추워서 겉옷을 입습니다.',
        readings:[{text:'寒い',reading:'さむい'},{text:'上着',reading:'うわぎ'},{text:'着ます',reading:'きます'}] },
      { ja:'忙しいので、行けません。', ko:'바빠서 갈 수 없습니다.',
        readings:[{text:'忙しい',reading:'いそがしい'},{text:'行けません',reading:'いけません'}] },
    ], similarGrammarIds:[], tags:['이유'] },

  { id:'g_n4_18', level:'N4', pattern:'〜のに', meaningKo:'〜인데 / 〜인데도',
    explanation:'역접·예상과 다름.',
    examples:[
      { ja:'勉強したのに、合格しなかった。', ko:'공부했는데도 합격하지 못했다.',
        readings:[{text:'勉強',reading:'べんきょう'},{text:'合格',reading:'ごうかく'}] },
      { ja:'高いのに、おいしくない。', ko:'비싼데 맛이 없다.',
        readings:[{text:'高い',reading:'たかい'}] },
    ], similarGrammarIds:[], tags:['역접'] },

  { id:'g_n4_19', level:'N4', pattern:'〜かもしれない', meaningKo:'〜일지도 모른다',
    explanation:'추측·가능성.',
    examples:[
      { ja:'明日は雨かもしれません。', ko:'내일은 비가 올지도 모릅니다.',
        readings:[{text:'明日',reading:'あした'},{text:'雨',reading:'あめ'}] },
      { ja:'彼は来ないかもしれない。', ko:'그는 오지 않을지도 모른다.',
        readings:[{text:'彼',reading:'かれ'},{text:'来ない',reading:'こない'}] },
    ], similarGrammarIds:[], tags:['추측'] },

  { id:'g_n4_20', level:'N4', pattern:'〜ことにする', meaningKo:'〜하기로 하다 (결정)',
    explanation:'자신의 의지로 결정.',
    examples:[
      { ja:'明日から早く起きることにしました。', ko:'내일부터 일찍 일어나기로 했습니다.',
        readings:[{text:'明日',reading:'あした'},{text:'早く',reading:'はやく'},{text:'起きる',reading:'おきる'}] },
      { ja:'運動を始めることにする。', ko:'운동을 시작하기로 한다.',
        readings:[{text:'運動',reading:'うんどう'},{text:'始める',reading:'はじめる'}] },
    ], similarGrammarIds:['g_n4_21'], tags:['결정'] },

  { id:'g_n4_21', level:'N4', pattern:'〜ことになる', meaningKo:'〜하게 되다 (결과)',
    explanation:'외부 결정·결과.',
    examples:[
      { ja:'来月転勤することになりました。', ko:'다음 달 전근하게 되었습니다.',
        readings:[{text:'来月',reading:'らいげつ'},{text:'転勤',reading:'てんきん'}] },
      { ja:'結婚することになった。', ko:'결혼하게 되었다.',
        readings:[{text:'結婚',reading:'けっこん'}] },
    ], similarGrammarIds:['g_n4_20'], tags:['결정'] },

  { id:'g_n4_22', level:'N4', pattern:'〜ようにする', meaningKo:'〜하도록 하다 (습관·노력)',
    explanation:'의식적으로 그렇게 하려 함.',
    examples:[
      { ja:'毎日運動するようにしています。', ko:'매일 운동하려고 하고 있습니다.',
        readings:[{text:'毎日',reading:'まいにち'},{text:'運動',reading:'うんどう'}] },
      { ja:'忘れないようにメモする。', ko:'잊지 않도록 메모한다.', readings:[{text:'忘れない',reading:'わすれない'}] },
    ], similarGrammarIds:['g_n4_23'], tags:['습관'] },

  { id:'g_n4_23', level:'N4', pattern:'〜ようになる', meaningKo:'〜할 수 있게 되다',
    explanation:'능력·습관 변화.',
    examples:[
      { ja:'日本語が話せるようになりました。', ko:'일본어를 말할 수 있게 되었습니다.',
        readings:[{text:'日本語',reading:'にほんご'},{text:'話せる',reading:'はなせる'}] },
      { ja:'早く起きるようになった。', ko:'일찍 일어나게 되었다.',
        readings:[{text:'早く',reading:'はやく'},{text:'起きる',reading:'おきる'}] },
    ], similarGrammarIds:['g_n4_22'], tags:['변화'] },

  { id:'g_n4_24', level:'N4', pattern:'〜ように', meaningKo:'〜하도록',
    explanation:'목적·기원.',
    examples:[
      { ja:'よく聞こえるように、大きい声で話します。', ko:'잘 들리도록 큰 소리로 말합니다.',
        readings:[{text:'聞こえる',reading:'きこえる'},{text:'大きい',reading:'おおきい'},{text:'声',reading:'こえ'},{text:'話します',reading:'はなします'}] },
      { ja:'病気が治るように祈ります。', ko:'병이 낫도록 빕니다.',
        readings:[{text:'病気',reading:'びょうき'},{text:'治る',reading:'なおる'},{text:'祈ります',reading:'いのります'}] },
    ], similarGrammarIds:['g_n4_16'], tags:['목적'] },

  { id:'g_n4_25', level:'N4', pattern:'〜てある', meaningKo:'〜되어 있다 (사람의 행위 결과)',
    explanation:'사람이 한 행위가 남아 있는 상태. 타동사 + てある.',
    examples:[
      { ja:'壁に絵がかけてあります。', ko:'벽에 그림이 걸려 있습니다.',
        readings:[{text:'壁',reading:'かべ'},{text:'絵',reading:'え'}] },
      { ja:'メモが書いてある。', ko:'메모가 적혀 있다.',
        readings:[{text:'書いて',reading:'かいて'}] },
    ], similarGrammarIds:['g_n4_2'], tags:['상태'] },

  { id:'g_n4_26', level:'N4', pattern:'〜ところ', meaningKo:'(막) 〜하는 참 / 곳',
    explanation:'시점·장면을 나타냄. 사전형 + ところ = 막 시작하려는 참.',
    examples:[
      { ja:'今、出かけるところです。', ko:'지금 막 외출하려는 참입니다.',
        readings:[{text:'今',reading:'いま'},{text:'出かける',reading:'でかける'}] },
      { ja:'食事中のところすみません。', ko:'식사 중에 죄송합니다.',
        readings:[{text:'食事中',reading:'しょくじちゅう'}] },
    ], similarGrammarIds:[], tags:['시점'] },

  { id:'g_n4_27', level:'N4', pattern:'〜ば', meaningKo:'〜하면 (가정)',
    explanation:'일반적·자연 조건. 동사 가정형.',
    examples:[
      { ja:'雨が降れば中止です。', ko:'비가 오면 중지입니다.',
        readings:[{text:'雨',reading:'あめ'},{text:'降れば',reading:'ふれば'},{text:'中止',reading:'ちゅうし'}] },
      { ja:'お金があれば旅行に行く。', ko:'돈이 있으면 여행을 간다.',
        readings:[{text:'金',reading:'かね'},{text:'旅行',reading:'りょこう'},{text:'行く',reading:'いく'}] },
    ], similarGrammarIds:['g_n4_28'], tags:['가정'] },

  { id:'g_n4_28', level:'N4', pattern:'〜なら', meaningKo:'〜라면 (조건·조언)',
    explanation:'상대의 말을 받아 조언. 「ば」와 달리 화자의 판단·제안에 자주.',
    examples:[
      { ja:'日本に行くならぜひ京都へ。', ko:'일본에 간다면 꼭 교토로.',
        readings:[{text:'日本',reading:'にほん'},{text:'行く',reading:'いく'},{text:'京都',reading:'きょうと'}] },
      { ja:'寒いならコートを着て。', ko:'추우면 코트를 입어.',
        readings:[{text:'寒い',reading:'さむい'},{text:'着て',reading:'きて'}] },
    ], similarGrammarIds:['g_n4_27'], tags:['가정'] },

  { id:'g_n4_29', level:'N4', pattern:'〜ても', meaningKo:'〜해도 / 〜라도',
    explanation:'역접 가정. 「〜ても」「〜でも」.',
    examples:[
      { ja:'雨が降っても行きます。', ko:'비가 와도 갑니다.',
        readings:[{text:'雨',reading:'あめ'},{text:'降って',reading:'ふって'},{text:'行きます',reading:'いきます'}] },
      { ja:'高くても買います。', ko:'비싸도 삽니다.',
        readings:[{text:'高くて',reading:'たかくて'},{text:'買います',reading:'かいます'}] },
    ], similarGrammarIds:[], tags:['역접'] },

  { id:'g_n4_30', level:'N4', pattern:'〜ながら', meaningKo:'〜하면서',
    explanation:'두 동작 동시 진행. 동사 ます형 + ながら.',
    examples:[
      { ja:'音楽を聞きながら勉強します。', ko:'음악을 들으면서 공부합니다.',
        readings:[{text:'音楽',reading:'おんがく'},{text:'聞き',reading:'きき'},{text:'勉強',reading:'べんきょう'}] },
      { ja:'歌いながら歩いた。', ko:'노래하면서 걸었다.',
        readings:[{text:'歌い',reading:'うたい'},{text:'歩いた',reading:'あるいた'}] },
    ], similarGrammarIds:[], tags:['동시'] },

  { id:'g_n4_31', level:'N4', pattern:'〜し', meaningKo:'〜고 / 〜기도 하고',
    explanation:'이유·열거.',
    examples:[
      { ja:'安いし、おいしいです。', ko:'싸고 맛있습니다.',
        readings:[{text:'安い',reading:'やすい'}] },
      { ja:'時間もないし、お金もない。', ko:'시간도 없고 돈도 없다.',
        readings:[{text:'時間',reading:'じかん'},{text:'金',reading:'かね'}] },
    ], similarGrammarIds:[], tags:['열거'] },

  { id:'g_n4_32', level:'N4', pattern:'〜たがる', meaningKo:'(제3자가) 〜하고 싶어 하다',
    explanation:'제3자 희망. ます형 + たがる.',
    examples:[
      { ja:'子供は外で遊びたがります。', ko:'아이는 밖에서 놀고 싶어 합니다.',
        readings:[{text:'子供',reading:'こども'},{text:'外',reading:'そと'},{text:'遊び',reading:'あそび'}] },
      { ja:'彼は行きたがっている。', ko:'그는 가고 싶어 하고 있다.',
        readings:[{text:'彼',reading:'かれ'},{text:'行き',reading:'いき'}] },
    ], similarGrammarIds:[], tags:['희망'] },

  { id:'g_n4_33', level:'N4', pattern:'〜ばかり', meaningKo:'〜만 / 막 〜한 참',
    explanation:'한정·직후. 「〜たばかり」는 막 ~한 참.',
    examples:[
      { ja:'テレビばかり見ています。', ko:'TV만 보고 있습니다.',
        readings:[{text:'見て',reading:'みて'}] },
      { ja:'今着いたばかりです。', ko:'지금 막 도착한 참입니다.',
        readings:[{text:'今',reading:'いま'},{text:'着いた',reading:'ついた'}] },
    ], similarGrammarIds:[], tags:['한정'] },

  { id:'g_n4_34', level:'N4', pattern:'〜ずつ', meaningKo:'〜씩',
    explanation:'분배·등량.',
    examples:[
      { ja:'一人三つずつ取ってください。', ko:'한 사람당 세 개씩 가져 주세요.',
        readings:[{text:'一人',reading:'ひとり'},{text:'三つ',reading:'みっつ'},{text:'取って',reading:'とって'}] },
      { ja:'毎日少しずつ勉強する。', ko:'매일 조금씩 공부한다.',
        readings:[{text:'毎日',reading:'まいにち'},{text:'少し',reading:'すこし'},{text:'勉強',reading:'べんきょう'}] },
    ], similarGrammarIds:[], tags:['분배'] },

  { id:'g_n4_35', level:'N4', pattern:'〜まで', meaningKo:'〜까지',
    explanation:'시간·장소의 한계.',
    examples:[
      { ja:'駅まで歩きます。', ko:'역까지 걸어갑니다.',
        readings:[{text:'駅',reading:'えき'},{text:'歩きます',reading:'あるきます'}] },
      { ja:'夜十時まで店は開いています。', ko:'밤 10시까지 가게는 열려 있습니다.',
        readings:[{text:'夜',reading:'よる'},{text:'十時',reading:'じゅうじ'},{text:'店',reading:'みせ'},{text:'開いて',reading:'あいて'}] },
    ], similarGrammarIds:[], tags:['한정'] },

  { id:'g_n4_36', level:'N4', pattern:'〜から〜まで', meaningKo:'〜부터 〜까지',
    explanation:'범위.',
    examples:[
      { ja:'九時から五時まで働きます。', ko:'9시부터 5시까지 일합니다.',
        readings:[{text:'九時',reading:'くじ'},{text:'五時',reading:'ごじ'},{text:'働きます',reading:'はたらきます'}] },
      { ja:'駅から学校まで歩いた。', ko:'역에서 학교까지 걸었다.',
        readings:[{text:'駅',reading:'えき'},{text:'学校',reading:'がっこう'},{text:'歩いた',reading:'あるいた'}] },
    ], similarGrammarIds:[], tags:['범위'] },

  { id:'g_n4_37', level:'N4', pattern:'〜のだ/〜んです', meaningKo:'〜인 것이다 (강조·이유)',
    explanation:'설명·강조. 회화에서는 「〜んです」.',
    examples:[
      { ja:'忙しいんです。', ko:'바쁘거든요.',
        readings:[{text:'忙しい',reading:'いそがしい'}] },
      { ja:'頭が痛いんです。', ko:'머리가 아파요.',
        readings:[{text:'頭',reading:'あたま'},{text:'痛い',reading:'いたい'}] },
    ], similarGrammarIds:[], tags:['설명'] },

  { id:'g_n4_38', level:'N4', pattern:'〜と思う', meaningKo:'〜라고 생각하다',
    explanation:'추측·의견.',
    examples:[
      { ja:'明日は晴れると思います。', ko:'내일은 맑을 거라고 생각합니다.',
        readings:[{text:'明日',reading:'あした'},{text:'晴れる',reading:'はれる'},{text:'思います',reading:'おもいます'}] },
      { ja:'いい考えだと思う。', ko:'좋은 생각이라고 본다.',
        readings:[{text:'考え',reading:'かんがえ'},{text:'思う',reading:'おもう'}] },
    ], similarGrammarIds:[], tags:['추측'] },

  { id:'g_n4_39', level:'N4', pattern:'〜つもり', meaningKo:'〜할 작정/생각',
    explanation:'의도·예정.',
    examples:[
      { ja:'夏休みに旅行するつもりです。', ko:'여름방학에 여행할 작정입니다.',
        readings:[{text:'夏休み',reading:'なつやすみ'},{text:'旅行',reading:'りょこう'}] },
      { ja:'明日早く起きるつもりだ。', ko:'내일 일찍 일어날 작정이다.',
        readings:[{text:'明日',reading:'あした'},{text:'早く',reading:'はやく'},{text:'起きる',reading:'おきる'}] },
    ], similarGrammarIds:[], tags:['의도'] },

  { id:'g_n4_40', level:'N4', pattern:'〜のが/〜のは', meaningKo:'(동사) 〜하는 것이/은',
    explanation:'명사화. 동사 사전형 + のが/のは.',
    examples:[
      { ja:'歌うのが好きです。', ko:'노래하는 것이 좋습니다.',
        readings:[{text:'歌う',reading:'うたう'},{text:'好き',reading:'すき'}] },
      { ja:'走るのは難しい。', ko:'달리는 것은 어렵다.',
        readings:[{text:'走る',reading:'はしる'},{text:'難しい',reading:'むずかしい'}] },
    ], similarGrammarIds:[], tags:['명사화'] },


  // ---------- N4 1차 B (라운드 26) — 수수/수동/사역/가능 ----------
  { id:'g_n4_41', level:'N4', pattern:'〜てあげる', meaningKo:'〜해 주다 (내가 남에게)',
    explanation:'내가(또는 화자 쪽이) 남을 위해 어떤 행위를 해 줌. 윗사람에게는 직접 쓰지 않는 것이 자연스러움.',
    examples:[
      { ja:'弟に本を読んであげました。', ko:'남동생에게 책을 읽어 주었습니다.',
        readings:[{text:'弟',reading:'おとうと'},{text:'本',reading:'ほん'},{text:'読んで',reading:'よんで'}] },
      { ja:'友だちに写真を撮ってあげました。', ko:'친구에게 사진을 찍어 주었습니다.',
        readings:[{text:'友',reading:'とも'},{text:'写真',reading:'しゃしん'},{text:'撮って',reading:'とって'}] },
    ], similarGrammarIds:['g_n4_42','g_n4_43'], tags:['수수표현'] },

  { id:'g_n4_42', level:'N4', pattern:'〜てくれる', meaningKo:'〜해 주다 (남이 나에게)',
    explanation:'남이 나(또는 내 쪽 사람)를 위해 행위를 해 줌. 고마움의 뉘앙스.',
    examples:[
      { ja:'先輩が仕事を教えてくれました。', ko:'선배가 일을 가르쳐 주었습니다.',
        readings:[{text:'先輩',reading:'せんぱい'},{text:'仕事',reading:'しごと'},{text:'教えて',reading:'おしえて'}] },
      { ja:'母が弁当を作ってくれます。', ko:'어머니가 도시락을 만들어 줍니다.',
        readings:[{text:'母',reading:'はは'},{text:'弁当',reading:'べんとう'},{text:'作って',reading:'つくって'}] },
    ], similarGrammarIds:['g_n4_41','g_n4_43'], tags:['수수표현'] },

  { id:'g_n4_43', level:'N4', pattern:'〜てもらう', meaningKo:'〜해 받다 (남에게 부탁해서)',
    explanation:'남에게 부탁하거나 호의로 행위를 받음. 주어는 받는 사람.',
    examples:[
      { ja:'友だちに手伝ってもらいました。', ko:'친구에게 도움을 받았습니다.',
        readings:[{text:'友',reading:'とも'},{text:'手伝って',reading:'てつだって'}] },
      { ja:'店員に在庫を確認してもらいました。', ko:'점원에게 재고를 확인 받았습니다.',
        readings:[{text:'店員',reading:'てんいん'},{text:'在庫',reading:'ざいこ'},{text:'確認',reading:'かくにん'}] },
    ], similarGrammarIds:['g_n4_41','g_n4_42'], tags:['수수표현'] },

  { id:'g_n4_44', level:'N4', pattern:'〜(ら)れる (수동)', meaningKo:'〜당하다/〜되다 (수동)',
    explanation:'수동 입문. 1그룹은 あ단+れる, 2그룹은 られる. 피해의 뉘앙스로도 사용.',
    examples:[
      { ja:'先生に褒められました。', ko:'선생님에게 칭찬받았습니다.',
        readings:[{text:'先生',reading:'せんせい'},{text:'褒められました',reading:'ほめられました'}] },
      { ja:'雨に降られて、服が濡れました。', ko:'비를 맞아서 옷이 젖었습니다.',
        readings:[{text:'雨',reading:'あめ'},{text:'降られて',reading:'ふられて'},{text:'服',reading:'ふく'},{text:'濡れました',reading:'ぬれました'}] },
    ], similarGrammarIds:['g_n4_46'], tags:['수동'] },

  { id:'g_n4_45', level:'N4', pattern:'〜(さ)せる (사역)', meaningKo:'〜하게 하다 (사역)',
    explanation:'사역 입문. 1그룹은 あ단+せる, 2그룹은 させる. 시킴/허용 두 용법.',
    examples:[
      { ja:'母は弟に野菜を食べさせました。', ko:'어머니는 남동생에게 채소를 먹게 했습니다.',
        readings:[{text:'母',reading:'はは'},{text:'弟',reading:'おとうと'},{text:'野菜',reading:'やさい'},{text:'食べさせました',reading:'たべさせました'}] },
      { ja:'子供を公園で遊ばせます。', ko:'아이를 공원에서 놀게 합니다.',
        readings:[{text:'子供',reading:'こども'},{text:'公園',reading:'こうえん'},{text:'遊ばせます',reading:'あそばせます'}] },
    ], similarGrammarIds:['g_n4_58'], tags:['사역'] },

  { id:'g_n4_46', level:'N4', pattern:'〜(ら)れる (가능)', meaningKo:'〜할 수 있다 (가능형)',
    explanation:'가능형. 1그룹은 え단+る, 2그룹은 られる. を가 が로 바뀌는 경우가 많음.',
    examples:[
      { ja:'漢字が読めますか。', ko:'한자를 읽을 수 있습니까?',
        readings:[{text:'漢字',reading:'かんじ'},{text:'読めます',reading:'よめます'}] },
      { ja:'明日なら来られます。', ko:'내일이라면 올 수 있습니다.',
        readings:[{text:'明日',reading:'あした'},{text:'来られます',reading:'こられます'}] },
    ], similarGrammarIds:['g_n4_44'], tags:['가능'] },

  { id:'g_n4_47', level:'N4', pattern:'〜ように言う', meaningKo:'〜하라고 말하다 (지시 전달)',
    explanation:'지시·명령을 간접적으로 전달. 「言う」 대신 「伝える」도 가능.',
    examples:[
      { ja:'医者は早く寝るように言いました。', ko:'의사는 일찍 자라고 말했습니다.',
        readings:[{text:'医者',reading:'いしゃ'},{text:'早く',reading:'はやく'},{text:'寝る',reading:'ねる'},{text:'言いました',reading:'いいました'}] },
    ], similarGrammarIds:['g_n4_48'], tags:['전달'] },

  { id:'g_n4_48', level:'N4', pattern:'〜ように頼む', meaningKo:'〜해 달라고 부탁하다',
    explanation:'의뢰의 간접 전달. 「頼む」 외에 「お願いする」도 사용.',
    examples:[
      { ja:'友だちに窓を閉めるように頼みました。', ko:'친구에게 창문을 닫아 달라고 부탁했습니다.',
        readings:[{text:'友',reading:'とも'},{text:'窓',reading:'まど'},{text:'閉める',reading:'しめる'},{text:'頼みました',reading:'たのみました'}] },
    ], similarGrammarIds:['g_n4_47'], tags:['전달'] },

  { id:'g_n4_49', level:'N4', pattern:'〜はず', meaningKo:'(분명) 〜할 터/〜일 것',
    explanation:'근거 있는 확신. 「はずがない」는 강한 부정.',
    examples:[
      { ja:'彼は今日来るはずです。', ko:'그는 오늘 올 것입니다.',
        readings:[{text:'彼',reading:'かれ'},{text:'今日',reading:'きょう'},{text:'来る',reading:'くる'}] },
      { ja:'そんなはずがありません。', ko:'그럴 리가 없습니다.',
        readings:[] },
    ], similarGrammarIds:['g_n4_39'], tags:['추측'] },

  { id:'g_n4_50', level:'N4', pattern:'〜予定', meaningKo:'〜할 예정',
    explanation:'공식적·객관적인 계획. つもり보다 확정된 느낌.',
    examples:[
      { ja:'三時に出発する予定です。', ko:'3시에 출발할 예정입니다.',
        readings:[{text:'三時',reading:'さんじ'},{text:'出発',reading:'しゅっぱつ'},{text:'予定',reading:'よてい'}] },
    ], similarGrammarIds:['g_n4_39'], tags:['계획'] },

  { id:'g_n4_51', level:'N4', pattern:'〜かどうか', meaningKo:'〜인지 어떤지',
    explanation:'불확실한 내용을 문장 안에 넣을 때. 의문사가 없는 의문문의 간접화.',
    examples:[
      { ja:'行けるかどうか、まだ分かりません。', ko:'갈 수 있을지 어떨지 아직 모르겠습니다.',
        readings:[{text:'行ける',reading:'いける'},{text:'分かりません',reading:'わかりません'}] },
    ], similarGrammarIds:[], tags:['표현'] },

  { id:'g_n4_52', level:'N4', pattern:'〜でしょう', meaningKo:'〜겠지요 (추측/확인)',
    explanation:'추측(내림조)과 확인(올림조). 정중한 단정 완화.',
    examples:[
      { ja:'明日は晴れるでしょう。', ko:'내일은 맑겠지요.',
        readings:[{text:'明日',reading:'あした'},{text:'晴れる',reading:'はれる'}] },
    ], similarGrammarIds:['g_n4_19'], tags:['추측'] },

  { id:'g_n4_53', level:'N4', pattern:'〜(よ)うと思う', meaningKo:'〜하려고 생각하다',
    explanation:'의지형 + と思う. 화자의 의지·계획.',
    examples:[
      { ja:'週末、部屋を掃除しようと思います。', ko:'주말에 방을 청소하려고 합니다.',
        readings:[{text:'週末',reading:'しゅうまつ'},{text:'部屋',reading:'へや'},{text:'掃除',reading:'そうじ'},{text:'思います',reading:'おもいます'}] },
    ], similarGrammarIds:['g_n4_38','g_n4_39'], tags:['의지'] },

  { id:'g_n4_54', level:'N4', pattern:'〜ているところ', meaningKo:'지금 〜하는 중',
    explanation:'동작의 진행 국면을 강조. 「今〜ているところです」 형태가 많음.',
    examples:[
      { ja:'今、資料を作っているところです。', ko:'지금 자료를 만들고 있는 중입니다.',
        readings:[{text:'今',reading:'いま'},{text:'資料',reading:'しりょう'},{text:'作って',reading:'つくって'}] },
    ], similarGrammarIds:['g_n4_26','g_n4_55'], tags:['시점'] },

  { id:'g_n4_55', level:'N4', pattern:'〜たところ', meaningKo:'막 〜한 참',
    explanation:'동작 직후의 시점. 「ちょうど〜たところです」.',
    examples:[
      { ja:'今、駅に着いたところです。', ko:'지금 막 역에 도착한 참입니다.',
        readings:[{text:'今',reading:'いま'},{text:'駅',reading:'えき'},{text:'着いた',reading:'ついた'}] },
    ], similarGrammarIds:['g_n4_54','g_n4_56'], tags:['시점'] },

  { id:'g_n4_56', level:'N4', pattern:'〜たばかり', meaningKo:'막 〜했다 (시간이 얼마 안 됨)',
    explanation:'동작 후 시간이 짧다는 화자의 기분. たところ보다 폭이 넓음.',
    examples:[
      { ja:'日本に来たばかりです。', ko:'일본에 온 지 얼마 안 되었습니다.',
        readings:[{text:'日本',reading:'にほん'},{text:'来た',reading:'きた'}] },
    ], similarGrammarIds:['g_n4_55','g_n4_33'], tags:['시점'] },

  { id:'g_n4_57', level:'N4', pattern:'〜間に', meaningKo:'〜하는 사이에',
    explanation:'어떤 상태·동작이 계속되는 동안에 다른 일이 일어남.',
    examples:[
      { ja:'寝ている間に、雨が降りました。', ko:'자는 사이에 비가 내렸습니다.',
        readings:[{text:'寝て',reading:'ねて'},{text:'間',reading:'あいだ'},{text:'雨',reading:'あめ'},{text:'降りました',reading:'ふりました'}] },
    ], similarGrammarIds:[], tags:['시점'] },

  { id:'g_n4_58', level:'N4', pattern:'〜させてください', meaningKo:'〜하게 해 주세요 (허락 요청)',
    explanation:'사역형 + てください. 정중한 허락 요청.',
    examples:[
      { ja:'少し考えさせてください。', ko:'조금 생각하게 해 주세요.',
        readings:[{text:'少し',reading:'すこし'},{text:'考えさせて',reading:'かんがえさせて'}] },
    ], similarGrammarIds:['g_n4_45'], tags:['사역','의뢰'] },

  { id:'g_n4_59', level:'N4', pattern:'〜たほうがいい', meaningKo:'〜하는 편이 좋다 (조언)',
    explanation:'조언·권고. 부정은 「〜ないほうがいい」.',
    examples:[
      { ja:'早く病院へ行ったほうがいいですよ。', ko:'빨리 병원에 가는 편이 좋아요.',
        readings:[{text:'早く',reading:'はやく'},{text:'病院',reading:'びょういん'},{text:'行った',reading:'いった'}] },
    ], similarGrammarIds:[], tags:['조언'] },

  { id:'g_n4_60', level:'N4', pattern:'〜なさい', meaningKo:'〜하렴/〜하세요 (부드러운 명령)',
    explanation:'ます형 어간 + なさい. 부모→아이, 교사→학생 등.',
    examples:[
      { ja:'早く寝なさい。', ko:'일찍 자렴.',
        readings:[{text:'早く',reading:'はやく'},{text:'寝なさい',reading:'ねなさい'}] },
    ], similarGrammarIds:[], tags:['명령'] },


  // ---------- N4 완성 C (라운드 27) ----------
  { id:'g_n4_61', level:'N4', pattern:'〜ていただけませんか', meaningKo:'〜해 주시지 않겠습니까 (매우 정중한 부탁)',
    explanation:'てもらう의 겸양 가능형. てくれませんか보다 정중.',
    examples:[
      { ja:'もう一度説明していただけませんか。', ko:'한 번 더 설명해 주시지 않겠습니까?',
        readings:[{text:'一度',reading:'いちど'},{text:'説明',reading:'せつめい'}] },
      { ja:'写真を撮っていただけませんか。', ko:'사진을 찍어 주시지 않겠습니까?',
        readings:[{text:'写真',reading:'しゃしん'},{text:'撮って',reading:'とって'}] },
    ], similarGrammarIds:['g_n4_43'], tags:['의뢰','경어'] },

  { id:'g_n4_62', level:'N4', pattern:'〜ことになっている', meaningKo:'〜하게 되어 있다 (규칙/관례)',
    explanation:'규칙·예정으로 정해져 있는 일. 개인 의지가 아닌 결정.',
    examples:[
      { ja:'ゴミは月曜日に出すことになっています。', ko:'쓰레기는 월요일에 내놓게 되어 있습니다.',
        readings:[{text:'月曜日',reading:'げつようび'},{text:'出す',reading:'だす'}] },
    ], similarGrammarIds:['g_n4_21'], tags:['규칙'] },

  { id:'g_n4_63', level:'N4', pattern:'〜場合', meaningKo:'〜할 경우',
    explanation:'가정의 상황을 나타냄. 공지·안내문에서 자주 사용.',
    examples:[
      { ja:'雨の場合は中止になります。', ko:'비가 올 경우는 중지됩니다.',
        readings:[{text:'雨',reading:'あめ'},{text:'場合',reading:'ばあい'},{text:'中止',reading:'ちゅうし'}] },
    ], similarGrammarIds:['g_n4_27'], tags:['가정'] },

  { id:'g_n4_64', level:'N4', pattern:'〜はずがない', meaningKo:'〜일 리가 없다',
    explanation:'근거를 바탕으로 한 강한 부정 추측. はず의 부정형.',
    examples:[
      { ja:'彼が嘘をつくはずがありません。', ko:'그가 거짓말을 할 리가 없습니다.',
        readings:[{text:'彼',reading:'かれ'},{text:'嘘',reading:'うそ'}] },
    ], similarGrammarIds:['g_n4_49'], tags:['추측'] },

  { id:'g_n4_65', level:'N4', pattern:'〜わけではない', meaningKo:'(반드시) 〜인 것은 아니다',
    explanation:'부분 부정. 전면 부정이 아니라 일부를 부정.',
    examples:[
      { ja:'肉が嫌いなわけではありません。', ko:'고기를 싫어하는 것은 아닙니다.',
        readings:[{text:'肉',reading:'にく'},{text:'嫌い',reading:'きらい'}] },
    ], similarGrammarIds:['g_n4_64'], tags:['부정'] },

  { id:'g_n4_66', level:'N4', pattern:'〜という', meaningKo:'〜라는',
    explanation:'이름·내용을 인용해 명사를 수식.',
    examples:[
      { ja:'「さくら」という店を知っていますか。', ko:'"사쿠라"라는 가게를 알고 있나요?',
        readings:[{text:'店',reading:'みせ'},{text:'知って',reading:'しって'}] },
    ], similarGrammarIds:[], tags:['인용'] },

  { id:'g_n4_67', level:'N4', pattern:'〜ような/〜ように (비유)', meaningKo:'〜같은/〜처럼',
    explanation:'비유. ような+명사 / ように+동사·형용사.',
    examples:[
      { ja:'夢のような話ですね。', ko:'꿈같은 이야기네요.',
        readings:[{text:'夢',reading:'ゆめ'},{text:'話',reading:'はなし'}] },
      { ja:'鳥のように空を飛びたいです。', ko:'새처럼 하늘을 날고 싶습니다.',
        readings:[{text:'鳥',reading:'とり'},{text:'空',reading:'そら'},{text:'飛びたい',reading:'とびたい'}] },
    ], similarGrammarIds:['g_n4_10'], tags:['비유'] },

  { id:'g_n4_68', level:'N4', pattern:'〜ため (원인)', meaningKo:'〜때문에 (원인/이유)',
    explanation:'원인·이유의 딱딱한 표현. 공지문에서 자주 사용. 목적의 ために(g_n4_16)와 구별.',
    examples:[
      { ja:'事故のため、電車が遅れています。', ko:'사고 때문에 전철이 지연되고 있습니다.',
        readings:[{text:'事故',reading:'じこ'},{text:'電車',reading:'でんしゃ'},{text:'遅れて',reading:'おくれて'}] },
    ], similarGrammarIds:['g_n4_16','g_n4_17'], tags:['원인'] },

  { id:'g_n4_69', level:'N4', pattern:'〜によると〜そうだ', meaningKo:'〜에 의하면 〜라고 한다',
    explanation:'정보의 출처(によると) + 전문(そうだ)의 결합. 뉴스·예보 전달.',
    examples:[
      { ja:'天気予報によると、明日は雨だそうです。', ko:'일기예보에 의하면 내일은 비라고 합니다.',
        readings:[{text:'天気予報',reading:'てんきよほう'},{text:'明日',reading:'あした'},{text:'雨',reading:'あめ'}] },
    ], similarGrammarIds:['g_n4_8'], tags:['전문'] },

  { id:'g_n4_70', level:'N4', pattern:'〜そうにない', meaningKo:'〜할 것 같지 않다',
    explanation:'양태 そうだ의 부정. 실현 가능성이 낮아 보임.',
    examples:[
      { ja:'今日中に終わりそうにないです。', ko:'오늘 안에 끝날 것 같지 않습니다.',
        readings:[{text:'今日中',reading:'きょうじゅう'},{text:'終わり',reading:'おわり'}] },
    ], similarGrammarIds:['g_n4_9'], tags:['추측'] },

  { id:'g_n4_71', level:'N4', pattern:'お/ご〜ください', meaningKo:'〜해 주십시오 (정중한 지시)',
    explanation:'お+ます형/ご+한자어+ください. 안내문의 정중한 지시.',
    examples:[
      { ja:'白い線の内側でお待ちください。', ko:'흰 선 안쪽에서 기다려 주십시오.',
        readings:[{text:'白い',reading:'しろい'},{text:'線',reading:'せん'},{text:'内側',reading:'うちがわ'},{text:'待ち',reading:'まち'}] },
    ], similarGrammarIds:['g_n5_13'], tags:['경어','지시'] },

  { id:'g_n4_72', level:'N4', pattern:'〜てばかりいる', meaningKo:'〜하고만 있다',
    explanation:'같은 행동의 반복을 비판적으로 말할 때.',
    examples:[
      { ja:'弟はゲームをしてばかりいます。', ko:'남동생은 게임만 하고 있습니다.',
        readings:[{text:'弟',reading:'おとうと'}] },
    ], similarGrammarIds:['g_n4_33'], tags:['반복'] },

  { id:'g_n4_73', level:'N4', pattern:'〜まま', meaningKo:'〜한 채',
    explanation:'상태가 변하지 않고 계속됨. た형+まま / の+まま.',
    examples:[
      { ja:'電気をつけたまま寝てしまいました。', ko:'불을 켠 채 자 버렸습니다.',
        readings:[{text:'電気',reading:'でんき'},{text:'寝て',reading:'ねて'}] },
    ], similarGrammarIds:[], tags:['상태'] },

  { id:'g_n4_74', level:'N4', pattern:'〜ずに', meaningKo:'〜하지 않고',
    explanation:'ないで의 문어적 표현. する→せずに.',
    examples:[
      { ja:'朝ご飯を食べずに出かけました。', ko:'아침을 먹지 않고 외출했습니다.',
        readings:[{text:'朝',reading:'あさ'},{text:'飯',reading:'はん'},{text:'食べ',reading:'たべ'},{text:'出かけました',reading:'でかけました'}] },
    ], similarGrammarIds:[], tags:['부정'] },

  { id:'g_n4_75', level:'N4', pattern:'〜なくてはいけない', meaningKo:'〜하지 않으면 안 된다',
    explanation:'의무. なければならない의 회화체 변형. 회화에서는 なくちゃ로 줄임.',
    examples:[
      { ja:'今日中にレポートを出さなくてはいけません。', ko:'오늘 안에 리포트를 내지 않으면 안 됩니다.',
        readings:[{text:'今日中',reading:'きょうじゅう'},{text:'出さ',reading:'ださ'}] },
    ], similarGrammarIds:['g_n4_3'], tags:['의무'] },


  // ---------- N4 완성 D (라운드 28) ----------
  { id:'g_n4_76', level:'N4', pattern:'〜始める', meaningKo:'〜하기 시작하다',
    explanation:'ます형 어간 + 始める. 동작의 개시.',
    examples:[
      { ja:'去年から日本語を習い始めました。', ko:'작년부터 일본어를 배우기 시작했습니다.',
        readings:[{text:'去年',reading:'きょねん'},{text:'日本語',reading:'にほんご'},{text:'習い始めました',reading:'ならいはじめました'}] },
    ], similarGrammarIds:['g_n4_79'], tags:['복합동사'] },

  { id:'g_n4_77', level:'N4', pattern:'〜終わる', meaningKo:'다 〜하다 (완료)',
    explanation:'ます형 어간 + 終わる. 동작의 완료.',
    examples:[
      { ja:'やっとレポートを書き終わりました。', ko:'드디어 리포트를 다 썼습니다.',
        readings:[{text:'書き終わりました',reading:'かきおわりました'}] },
    ], similarGrammarIds:['g_n4_76'], tags:['복합동사'] },

  { id:'g_n4_78', level:'N4', pattern:'〜続ける', meaningKo:'계속 〜하다',
    explanation:'ます형 어간 + 続ける. 동작의 지속.',
    examples:[
      { ja:'三時間も歩き続けました。', ko:'세 시간이나 계속 걸었습니다.',
        readings:[{text:'三時間',reading:'さんじかん'},{text:'歩き続けました',reading:'あるきつづけました'}] },
    ], similarGrammarIds:['g_n4_76'], tags:['복합동사'] },

  { id:'g_n4_79', level:'N4', pattern:'〜出す', meaningKo:'갑자기 〜하기 시작하다',
    explanation:'ます형 어간 + 出す. 갑작스러운 개시. 始める보다 돌발적.',
    examples:[
      { ja:'急に雨が降り出しました。', ko:'갑자기 비가 내리기 시작했습니다.',
        readings:[{text:'急に',reading:'きゅうに'},{text:'雨',reading:'あめ'},{text:'降り出しました',reading:'ふりだしました'}] },
    ], similarGrammarIds:['g_n4_76'], tags:['복합동사'] },

  { id:'g_n4_80', level:'N4', pattern:'〜にする', meaningKo:'〜로 하다 (선택)',
    explanation:'선택·결정. 메뉴 주문 등에서 빈출.',
    examples:[
      { ja:'飲み物はコーヒーにします。', ko:'음료는 커피로 하겠습니다.',
        readings:[{text:'飲み物',reading:'のみもの'}] },
    ], similarGrammarIds:['g_n4_20'], tags:['선택'] },

  { id:'g_n4_81', level:'N4', pattern:'〜がする', meaningKo:'(소리/냄새/맛)이 나다',
    explanation:'감각 표현. 音/声/匂い/味 + がする.',
    examples:[
      { ja:'隣の部屋から変な音がします。', ko:'옆방에서 이상한 소리가 납니다.',
        readings:[{text:'隣',reading:'となり'},{text:'部屋',reading:'へや'},{text:'変',reading:'へん'},{text:'音',reading:'おと'}] },
    ], similarGrammarIds:[], tags:['감각'] },

  { id:'g_n4_82', level:'N4', pattern:'〜ばよかった', meaningKo:'〜했으면 좋았을 텐데 (후회)',
    explanation:'ば형 + よかった. 하지 않은 일에 대한 후회.',
    examples:[
      { ja:'もっと早く予約すればよかったです。', ko:'더 일찍 예약했으면 좋았을 텐데요.',
        readings:[{text:'早く',reading:'はやく'},{text:'予約',reading:'よやく'}] },
    ], similarGrammarIds:['g_n4_27'], tags:['후회'] },

  { id:'g_n4_83', level:'N4', pattern:'〜中(ちゅう/じゅう)', meaningKo:'〜중 / 〜내내',
    explanation:'ちゅう=진행 중(会議中), じゅう=기간 전체(一日中).',
    examples:[
      { ja:'課長は今、会議中です。', ko:'과장님은 지금 회의 중입니다.',
        readings:[{text:'課長',reading:'かちょう'},{text:'今',reading:'いま'},{text:'会議中',reading:'かいぎちゅう'}] },
      { ja:'一日中、家で休みました。', ko:'하루 종일 집에서 쉬었습니다.',
        readings:[{text:'一日中',reading:'いちにちじゅう'},{text:'家',reading:'いえ'},{text:'休みました',reading:'やすみました'}] },
    ], similarGrammarIds:[], tags:['시점'] },

  { id:'g_n4_84', level:'N4', pattern:'〜たら〜た (발견)', meaningKo:'〜했더니 〜했다 (발견/의외)',
    explanation:'たら + 과거형. 행동 후 의외의 발견.',
    examples:[
      { ja:'箱を開けたら、猫が寝ていました。', ko:'상자를 열었더니 고양이가 자고 있었습니다.',
        readings:[{text:'箱',reading:'はこ'},{text:'開けたら',reading:'あけたら'},{text:'猫',reading:'ねこ'},{text:'寝て',reading:'ねて'}] },
    ], similarGrammarIds:['g_n4_27'], tags:['발견'] },

  { id:'g_n4_85', level:'N4', pattern:'お〜になる', meaningKo:'〜하시다 (존경 입문)',
    explanation:'お + ます형 어간 + になる. 기본 존경 표현.',
    examples:[
      { ja:'先生はもうお帰りになりました。', ko:'선생님은 벌써 돌아가셨습니다.',
        readings:[{text:'先生',reading:'せんせい'},{text:'帰り',reading:'かえり'}] },
    ], similarGrammarIds:['g_n4_71'], tags:['경어'] },

  // ---------- N3 ----------
  // 라운드 37 재검토 — N4(g_n4_20/21)와 패턴이 완전히 겹치던 ことにする/ことになる를
  // N3 확장 형태로 분리: ことにしている(습관) / ぶり(に)(신규 문형으로 교체).
  { id:'g_n3_1', level:'N3', pattern:'〜ことにしている', meaningKo:'〜하기로 하고 있다 (습관)',
    explanation:'스스로 정한 일을 습관으로 계속하고 있음 — 「毎朝走ることにしている」. 1회성 결정인 ことにする(N4)와 달리, 결정이 생활 규칙으로 정착한 상태를 말한다.',
    examples:[
      { ja:'健康のために、毎朝走ることにしています。', ko:'건강을 위해 매일 아침 달리기로 하고 있습니다.',
        readings:[{text:'健康',reading:'けんこう'},{text:'毎朝',reading:'まいあさ'},{text:'走る',reading:'はしる'}] },
    ],
    similarGrammarIds:['g_n4_20'], tags:['습관'] },

  { id:'g_n3_2', level:'N3', pattern:'〜ぶり(に)', meaningKo:'〜만에 (다시)',
    explanation:'그만큼의 시간이 지난 뒤 같은 일이 다시 일어남 — 「三年ぶりに会う」. 마지막을 끝으로 이어지지 않는 きり와 반대 방향의 표현.',
    examples:[
      { ja:'五年ぶりに昔の友人に会いました。', ko:'5년 만에 옛 친구를 만났습니다.',
        readings:[{text:'五年',reading:'ごねん'},{text:'昔',reading:'むかし'},{text:'友人',reading:'ゆうじん'},{text:'会いました',reading:'あいました'}] },
    ],
    similarGrammarIds:['g_n3_52'], tags:['시간'] },


  // ---------- N3 0차 시드 (라운드 32) ----------
  { id:'g_n3_3', level:'N3', pattern:'〜うちに', meaningKo:'〜하는 동안에/〜하기 전에',
    explanation:'상태가 변하기 전에 행동함. 「冷めないうちに」 형태가 빈출.',
    examples:[
      { ja:'温かいうちに食べてください。', ko:'따뜻할 때 드세요.',
        readings:[{text:'温かい',reading:'あたたかい'},{text:'食べて',reading:'たべて'}] },
    ], similarGrammarIds:['g_n4_57'], tags:['시점'] },

  { id:'g_n3_4', level:'N3', pattern:'〜たびに', meaningKo:'〜할 때마다',
    explanation:'반복되는 일마다 같은 일이 일어남.',
    examples:[
      { ja:'この歌を聞くたびに、田舎を思い出します。', ko:'이 노래를 들을 때마다 시골이 생각납니다.',
        readings:[{text:'歌',reading:'うた'},{text:'聞く',reading:'きく'},{text:'田舎',reading:'いなか'},{text:'思い出します',reading:'おもいだします'}] },
    ], similarGrammarIds:['g_n3_25'], tags:['반복'] },

  { id:'g_n3_5', level:'N3', pattern:'〜おかげで', meaningKo:'〜덕분에',
    explanation:'좋은 결과의 원인. 감사의 뉘앙스.',
    examples:[
      { ja:'先生のおかげで合格できました。', ko:'선생님 덕분에 합격할 수 있었습니다.',
        readings:[{text:'先生',reading:'せんせい'},{text:'合格',reading:'ごうかく'}] },
    ], similarGrammarIds:['g_n3_6'], tags:['원인'] },

  { id:'g_n3_6', level:'N3', pattern:'〜せいで', meaningKo:'〜탓에',
    explanation:'나쁜 결과의 원인. 비난·불만의 뉘앙스.',
    examples:[
      { ja:'渋滞のせいで遅刻しました。', ko:'정체 탓에 지각했습니다.',
        readings:[{text:'渋滞',reading:'じゅうたい'},{text:'遅刻',reading:'ちこく'}] },
    ], similarGrammarIds:['g_n3_5'], tags:['원인'] },

  { id:'g_n3_7', level:'N3', pattern:'〜くせに', meaningKo:'〜인 주제에',
    explanation:'비난·불만을 담은 역접. のに보다 감정적.',
    examples:[
      { ja:'知っているくせに、教えてくれません。', ko:'알고 있는 주제에 가르쳐 주지 않습니다.',
        readings:[{text:'知って',reading:'しって'},{text:'教えて',reading:'おしえて'}] },
    ], similarGrammarIds:['g_n4_18'], tags:['역접'] },

  { id:'g_n3_8', level:'N3', pattern:'〜たとたん(に)', meaningKo:'〜하자마자',
    explanation:'동작 직후 예상 밖의 일이 일어남.',
    examples:[
      { ja:'窓を開けたとたん、雨が降り出しました。', ko:'창문을 열자마자 비가 내리기 시작했습니다.',
        readings:[{text:'窓',reading:'まど'},{text:'開けた',reading:'あけた'},{text:'雨',reading:'あめ'},{text:'降り出しました',reading:'ふりだしました'}] },
    ], similarGrammarIds:['g_n4_55'], tags:['시점'] },

  { id:'g_n3_9', level:'N3', pattern:'〜ば〜ほど', meaningKo:'〜하면 할수록',
    explanation:'한쪽 정도가 커질수록 다른 쪽도 함께 커짐. 같은 동사를 ば형+사전형으로 반복 — 「練習すればするほど」.',
    examples:[
      { ja:'練習すればするほど上手になります。', ko:'연습하면 할수록 능숙해집니다.',
        readings:[{text:'練習',reading:'れんしゅう'},{text:'上手',reading:'じょうず'}] },
    ], similarGrammarIds:['g_n4_27'], tags:['정도'] },

  { id:'g_n3_10', level:'N3', pattern:'〜にとって', meaningKo:'〜에게 있어',
    explanation:'"〜의 입장에서 보면" — 평가·판단의 기준이 되는 사람/조직을 명시. 중요도·감상을 말할 때 빈출 (「私にとって」「学生にとって」).',
    examples:[
      { ja:'私にとって家族が一番大切です。', ko:'저에게 있어 가족이 가장 소중합니다.',
        readings:[{text:'私',reading:'わたし'},{text:'家族',reading:'かぞく'},{text:'一番',reading:'いちばん'},{text:'大切',reading:'たいせつ'}] },
    ], similarGrammarIds:['g_n3_11'], tags:['입장'] },

  { id:'g_n3_11', level:'N3', pattern:'〜について', meaningKo:'〜에 대해',
    explanation:'말하거나 조사하는 화제·대상을 명시 — "〜에 대해 말하다/조사하다/쓰다". 입장을 나타내는 にとって와 달리 내용 그 자체를 가리킨다.',
    examples:[
      { ja:'環境問題について意見を述べました。', ko:'환경 문제에 대해 의견을 진술했습니다.',
        readings:[{text:'環境問題',reading:'かんきょうもんだい'},{text:'意見',reading:'いけん'},{text:'述べました',reading:'のべました'}] },
    ], similarGrammarIds:['g_n3_10'], tags:['화제'] },

  { id:'g_n3_12', level:'N3', pattern:'〜に比べて', meaningKo:'〜에 비해',
    explanation:'비교의 기준을 명시. 「AはBに比べて〜」 형태로, 통계·변화 설명에 빈출.',
    examples:[
      { ja:'去年に比べて観光客が増加しました。', ko:'작년에 비해 관광객이 증가했습니다.',
        readings:[{text:'去年',reading:'きょねん'},{text:'比べて',reading:'くらべて'},{text:'観光客',reading:'かんこうきゃく'},{text:'増加',reading:'ぞうか'}] },
    ], similarGrammarIds:['g_n5_26'], tags:['비교'] },

  { id:'g_n3_13', level:'N3', pattern:'〜みたいだ', meaningKo:'〜인 것 같다 (회화체)',
    explanation:'ようだ의 회화체. 추측·비유.',
    examples:[
      { ja:'外は雨が降っているみたいです。', ko:'밖은 비가 내리고 있는 것 같습니다.',
        readings:[{text:'外',reading:'そと'},{text:'雨',reading:'あめ'},{text:'降って',reading:'ふって'}] },
    ], similarGrammarIds:['g_n4_10'], tags:['추측'] },

  { id:'g_n3_14', level:'N3', pattern:'〜っぽい', meaningKo:'〜같다/〜스럽다',
    explanation:'경향·인상. 「子供っぽい」「忘れっぽい」.',
    examples:[
      { ja:'彼は怒りっぽい性格です。', ko:'그는 화를 잘 내는 성격입니다.',
        readings:[{text:'彼',reading:'かれ'},{text:'怒りっぽい',reading:'おこりっぽい'},{text:'性格',reading:'せいかく'}] },
    ], similarGrammarIds:['g_n4_11'], tags:['경향'] },

  { id:'g_n3_15', level:'N3', pattern:'〜がち', meaningKo:'〜하기 일쑤/자주 〜함',
    explanation:'바람직하지 않은 경향이 잦음.',
    examples:[
      { ja:'冬は風邪をひきがちです。', ko:'겨울에는 감기에 걸리기 일쑤입니다.',
        readings:[{text:'冬',reading:'ふゆ'},{text:'風邪',reading:'かぜ'}] },
    ], similarGrammarIds:['g_n3_14'], tags:['경향'] },

  { id:'g_n3_16', level:'N3', pattern:'〜気味', meaningKo:'〜기미/〜기운',
    explanation:'약간 그런 상태. 「風邪気味」「疲れ気味」.',
    examples:[
      { ja:'最近、疲れ気味で集中できません。', ko:'요즘 피곤한 기미가 있어 집중이 안 됩니다.',
        readings:[{text:'最近',reading:'さいきん'},{text:'疲れ気味',reading:'つかれぎみ'},{text:'集中',reading:'しゅうちゅう'}] },
    ], similarGrammarIds:['g_n3_15'], tags:['경향'] },

  { id:'g_n3_17', level:'N3', pattern:'〜はずだった', meaningKo:'〜할 예정이었다 (그러나 못함)',
    explanation:'예정·기대가 실현되지 않음.',
    examples:[
      { ja:'今日は休みのはずだったのに、出勤しました。', ko:'오늘은 쉬는 날이었는데 출근했습니다.',
        readings:[{text:'今日',reading:'きょう'},{text:'休み',reading:'やすみ'},{text:'出勤',reading:'しゅっきん'}] },
    ], similarGrammarIds:['g_n4_49'], tags:['기대'] },

  { id:'g_n3_18', level:'N3', pattern:'〜ところだった', meaningKo:'하마터면 〜할 뻔했다',
    explanation:'위험한 일이 일어나기 직전이었음.',
    examples:[
      { ja:'寝坊して、遅刻するところでした。', ko:'늦잠을 자서 하마터면 지각할 뻔했습니다.',
        readings:[{text:'寝坊',reading:'ねぼう'},{text:'遅刻',reading:'ちこく'}] },
    ], similarGrammarIds:['g_n4_26'], tags:['시점'] },

  { id:'g_n3_19', level:'N3', pattern:'〜ことはない', meaningKo:'〜할 필요 없다',
    explanation:'"〜할 필요 없다"고 상대를 안심시키는 조언. 동사 사전형 + ことはない. 금지(〜てはいけない)가 아니라 불필요를 말한다.',
    examples:[
      { ja:'心配することはありません。', ko:'걱정할 필요 없습니다.',
        readings:[{text:'心配',reading:'しんぱい'}] },
    ], similarGrammarIds:['g_n4_4'], tags:['조언'] },

  { id:'g_n3_20', level:'N3', pattern:'〜わけにはいかない', meaningKo:'〜할 수는 없다',
    explanation:'사정상 그렇게 할 수 없음.',
    examples:[
      { ja:'大事な会議なので、休むわけにはいきません。', ko:'중요한 회의라서 쉴 수는 없습니다.',
        readings:[{text:'大事',reading:'だいじ'},{text:'会議',reading:'かいぎ'},{text:'休む',reading:'やすむ'}] },
    ], similarGrammarIds:['g_n4_65'], tags:['불가'] },


  // ---------- N3 1차 확장 (라운드 34) ----------
  { id:'g_n3_21', level:'N3', pattern:'〜とおりに', meaningKo:'〜대로',
    explanation:'들은/배운 그대로 따라 함. 「説明のとおりに」.',
    examples:[
      { ja:'説明書のとおりに組み立てました。', ko:'설명서대로 조립했습니다.',
        readings:[{text:'説明書',reading:'せつめいしょ'},{text:'組み立てました',reading:'くみたてました'}] },
    ], similarGrammarIds:['g_n4_24'], tags:['방법'] },

  { id:'g_n3_22', level:'N3', pattern:'〜かわりに', meaningKo:'〜대신에',
    explanation:'대체·교환 — 「AのかわりにB」(A 대신 B). 대가(반대하는 대신 안을 낸다)에도 쓴다. 역할 대행만 뜻하는 にかわって와 구분.',
    examples:[
      { ja:'部長のかわりに私が会議に出ます。', ko:'부장님 대신 제가 회의에 나갑니다.',
        readings:[{text:'部長',reading:'ぶちょう'},{text:'私',reading:'わたし'},{text:'会議',reading:'かいぎ'},{text:'出ます',reading:'でます'}] },
    ], similarGrammarIds:['g_n3_41'], tags:['대체'] },

  { id:'g_n3_23', level:'N3', pattern:'〜最中に', meaningKo:'한창 〜하는 중에',
    explanation:'동작이 한창일 때 다른 일이 일어남.',
    examples:[
      { ja:'発表の最中に停電が起こりました。', ko:'발표가 한창일 때 정전이 일어났습니다.',
        readings:[{text:'発表',reading:'はっぴょう'},{text:'最中',reading:'さいちゅう'},{text:'停電',reading:'ていでん'},{text:'起こりました',reading:'おこりました'}] },
    ], similarGrammarIds:['g_n3_3','g_n4_57'], tags:['시점'] },

  { id:'g_n3_24', level:'N3', pattern:'〜うえに', meaningKo:'〜인 데다가',
    explanation:'첨가. 같은 방향(좋음+좋음/나쁨+나쁨)의 내용을 더함.',
    examples:[
      { ja:'この店は安いうえに、品質もいいです。', ko:'이 가게는 싼 데다가 품질도 좋습니다.',
        readings:[{text:'店',reading:'みせ'},{text:'安い',reading:'やすい'},{text:'品質',reading:'ひんしつ'}] },
    ], similarGrammarIds:['g_n4_31'], tags:['첨가'] },

  { id:'g_n3_25', level:'N3', pattern:'〜おきに', meaningKo:'〜걸러/간격으로',
    explanation:'일정 간격의 반복. 「一日おきに」.',
    examples:[
      { ja:'一日おきにジョギングをしています。', ko:'하루걸러 조깅을 하고 있습니다.',
        readings:[{text:'一日',reading:'いちにち'}] },
    ], similarGrammarIds:['g_n4_34'], tags:['빈도'] },

  { id:'g_n3_26', level:'N3', pattern:'〜ほど', meaningKo:'〜정도/만큼',
    explanation:'정도의 강조. 「泣くほど嬉しい」.',
    examples:[
      { ja:'泣きたいほど嬉しかったです。', ko:'울고 싶을 만큼 기뻤습니다.',
        readings:[{text:'泣きたい',reading:'なきたい'},{text:'嬉しかった',reading:'うれしかった'}] },
    ], similarGrammarIds:['g_n5_33'], tags:['정도'] },

  { id:'g_n3_27', level:'N3', pattern:'〜ほど〜はない', meaningKo:'〜만큼 〜한 것은 없다',
    explanation:'"〜만큼 〜한 것은 없다" — 비교 대상 가운데 으뜸임을 나타내는 최상급 표현. ほど 뒤에 반드시 부정(はない/はいない)이 온다.',
    examples:[
      { ja:'家族ほど大切なものはありません。', ko:'가족만큼 소중한 것은 없습니다.',
        readings:[{text:'家族',reading:'かぞく'},{text:'大切',reading:'たいせつ'}] },
    ], similarGrammarIds:['g_n3_26'], tags:['정도'] },

  { id:'g_n3_28', level:'N3', pattern:'〜ということだ', meaningKo:'〜라고 한다 (전문)',
    explanation:'전해 들은 정보. そうだ보다 객관적·문어적.',
    examples:[
      { ja:'来月から物価が上がるということです。', ko:'다음 달부터 물가가 오른다고 합니다.',
        readings:[{text:'来月',reading:'らいげつ'},{text:'物価',reading:'ぶっか'},{text:'上がる',reading:'あがる'}] },
    ], similarGrammarIds:['g_n4_8'], tags:['전문'] },

  { id:'g_n3_29', level:'N3', pattern:'〜って (인용)', meaningKo:'〜래/〜라고 (회화체 인용)',
    explanation:'と言っていた/という의 회화체 축약.',
    examples:[
      { ja:'田中さん、今日は来られないって。', ko:'다나카 씨, 오늘은 못 온대.',
        readings:[{text:'田中',reading:'たなか'},{text:'今日',reading:'きょう'},{text:'来られない',reading:'こられない'}] },
    ], similarGrammarIds:['g_n3_28'], tags:['전문','회화'] },

  { id:'g_n3_30', level:'N3', pattern:'〜きる/〜きれない', meaningKo:'다 〜하다 / 다 〜할 수 없다',
    explanation:'완수·한계. 「食べきる」「数えきれない」.',
    examples:[
      { ja:'こんなに多くては食べきれません。', ko:'이렇게 많아서는 다 먹을 수 없습니다.',
        readings:[{text:'多くて',reading:'おおくて'},{text:'食べきれません',reading:'たべきれません'}] },
    ], similarGrammarIds:['g_n4_77'], tags:['완수'] },

  { id:'g_n3_31', level:'N3', pattern:'〜かける', meaningKo:'〜하다 말다/〜하기 시작하다',
    explanation:'동작의 미완료. 「読みかけの本」.',
    examples:[
      { ja:'読みかけの本が机の上にあります。', ko:'읽다 만 책이 책상 위에 있습니다.',
        readings:[{text:'読みかけ',reading:'よみかけ'},{text:'本',reading:'ほん'},{text:'机',reading:'つくえ'},{text:'上',reading:'うえ'}] },
    ], similarGrammarIds:['g_n4_76'], tags:['미완료'] },

  { id:'g_n3_32', level:'N3', pattern:'〜づらい', meaningKo:'〜하기 괴롭다/어렵다',
    explanation:'심리적·신체적으로 하기 힘듦. にくい보다 주관적.',
    examples:[
      { ja:'本当のことは言いづらいです。', ko:'사실은 말하기 어렵습니다.',
        readings:[{text:'本当',reading:'ほんとう'},{text:'言いづらい',reading:'いいづらい'}] },
    ], similarGrammarIds:['g_n4_14'], tags:['난이'] },

  { id:'g_n3_33', level:'N3', pattern:'〜ば〜のに', meaningKo:'〜했더라면 〜했을 텐데',
    explanation:'실제로 하지 않은 일을 가정하며 아쉬움·후회를 나타냄 — 「〜ばよかったのに」. 상대의 행동에 쓰면 가벼운 비난 뉘앙스가 된다.',
    examples:[
      { ja:'もっと早く出発すればよかったのに。', ko:'더 일찍 출발했으면 좋았을 텐데.',
        readings:[{text:'早く',reading:'はやく'},{text:'出発',reading:'しゅっぱつ'}] },
    ], similarGrammarIds:['g_n4_82'], tags:['후회'] },

  { id:'g_n3_34', level:'N3', pattern:'〜さえ', meaningKo:'〜조차/〜만',
    explanation:'극단의 예시(조차), 조건의 최소(〜さえ〜ば).',
    examples:[
      { ja:'忙しくて食事をする時間さえありません。', ko:'바빠서 식사할 시간조차 없습니다.',
        readings:[{text:'忙しくて',reading:'いそがしくて'},{text:'食事',reading:'しょくじ'},{text:'時間',reading:'じかん'}] },
    ], similarGrammarIds:['g_n5_22'], tags:['강조'] },

  { id:'g_n3_35', level:'N3', pattern:'〜こそ', meaningKo:'〜야말로',
    explanation:'앞말을 특별히 내세워 강조 — "이번에야말로/이것이야말로". 결심·재도전 장면에서 빈출 (「今年こそ」「今度こそ」). さえ가 극단의 예를 드는 데 비해 こそ는 긍정적으로 내세운다.',
    examples:[
      { ja:'今年こそ合格したいです。', ko:'올해야말로 합격하고 싶습니다.',
        readings:[{text:'今年',reading:'ことし'},{text:'合格',reading:'ごうかく'}] },
    ], similarGrammarIds:['g_n3_34'], tags:['강조'] },

  { id:'g_n3_36', level:'N3', pattern:'〜しかない', meaningKo:'〜할 수밖에 없다',
    explanation:'다른 선택지가 없어 어쩔 수 없이 함 — 동사 사전형 + しかない. わけにはいかない가 "사정상 못 한다"라면 しかない는 "그것만 가능하다".',
    examples:[
      { ja:'終電がないので、歩いて帰るしかありません。', ko:'막차가 없어서 걸어서 돌아갈 수밖에 없습니다.',
        readings:[{text:'終電',reading:'しゅうでん'},{text:'歩いて',reading:'あるいて'},{text:'帰る',reading:'かえる'}] },
    ], similarGrammarIds:['g_n3_20'], tags:['불가피'] },

  { id:'g_n3_37', level:'N3', pattern:'〜はもちろん', meaningKo:'〜은 물론',
    explanation:'당연한 것에 더해 다른 것도.',
    examples:[
      { ja:'平日はもちろん、週末も勤務があります。', ko:'평일은 물론 주말에도 근무가 있습니다.',
        readings:[{text:'平日',reading:'へいじつ'},{text:'週末',reading:'しゅうまつ'},{text:'勤務',reading:'きんむ'}] },
    ], similarGrammarIds:['g_n3_24'], tags:['첨가'] },

  { id:'g_n3_38', level:'N3', pattern:'〜てほしい', meaningKo:'〜해 주길 바라다',
    explanation:'타인에 대한 희망. 자신의 희망(たい)과 구별.',
    examples:[
      { ja:'もっと早く連絡してほしかったです。', ko:'더 일찍 연락해 주길 바랐습니다.',
        readings:[{text:'早く',reading:'はやく'},{text:'連絡',reading:'れんらく'}] },
    ], similarGrammarIds:['g_n5_12'], tags:['희망'] },

  { id:'g_n3_39', level:'N3', pattern:'〜ようとする', meaningKo:'〜하려고 하다 (시도/직전)',
    explanation:'의지형 + とする. 시도 또는 동작 직전.',
    examples:[
      { ja:'出かけようとしたら、雨が降り出しました。', ko:'나가려고 했더니 비가 내리기 시작했습니다.',
        readings:[{text:'出かけよう',reading:'でかけよう'},{text:'雨',reading:'あめ'},{text:'降り出しました',reading:'ふりだしました'}] },
    ], similarGrammarIds:['g_n4_53'], tags:['의지'] },

  { id:'g_n3_40', level:'N3', pattern:'〜にしては', meaningKo:'〜치고는',
    explanation:'기준에서 예상되는 것과 다름.',
    examples:[
      { ja:'初めてにしては上手にできました。', ko:'처음치고는 잘했습니다.',
        readings:[{text:'初めて',reading:'はじめて'},{text:'上手',reading:'じょうず'}] },
    ], similarGrammarIds:['g_n3_12'], tags:['평가'] },


  // ---------- N3 2차 확장 (라운드 36) ----------
  { id:'g_n3_41', level:'N3', pattern:'〜にかわって', meaningKo:'〜을 대신하여',
    explanation:'본래 그 역할을 하는 사람/것을 대신함 — 「部長にかわって私が説明します」. かわりに가 교환·대가에도 쓰이는 데 비해, にかわって는 역할의 대행에 쓴다.',
    examples:[
      { ja:'担任の先生にかわって、教頭が授業をしました。', ko:'담임 선생님을 대신하여 교감이 수업을 했습니다.',
        readings:[{text:'担任',reading:'たんにん'},{text:'先生',reading:'せんせい'},{text:'教頭',reading:'きょうとう'},{text:'授業',reading:'じゅぎょう'}] },
    ], similarGrammarIds:['g_n3_22'], tags:['대행'] },

  { id:'g_n3_42', level:'N3', pattern:'〜に対して', meaningKo:'〜에 대해/〜에 맞서',
    explanation:'행위·감정이 향하는 상대를 명시 — 「客に対して丁寧に」. について가 내용·화제를 가리키는 데 비해, に対して는 상대 그 자체를 향한다.',
    examples:[
      { ja:'お客様に対して、丁寧に対応しましょう。', ko:'손님에 대해 정중하게 대응합시다.',
        readings:[{text:'客様',reading:'きゃくさま'},{text:'対して',reading:'たいして'},{text:'丁寧',reading:'ていねい'},{text:'対応',reading:'たいおう'}] },
    ], similarGrammarIds:['g_n3_11'], tags:['대상'] },

  { id:'g_n3_43', level:'N3', pattern:'〜によって', meaningKo:'〜에 따라/〜에 의해',
    explanation:'원인·수단·주체·경우에 따른 차이를 나타냄 — 「国によって違う」「火事によって」. 전문의 によると(〜라고 한다)와 형태가 비슷하니 주의.',
    examples:[
      { ja:'国によって、挨拶の仕方が異なります。', ko:'나라에 따라 인사 방법이 다릅니다.',
        readings:[{text:'国',reading:'くに'},{text:'挨拶',reading:'あいさつ'},{text:'仕方',reading:'しかた'},{text:'異なります',reading:'ことなります'}] },
    ], similarGrammarIds:['g_n4_69'], tags:['원인'] },

  { id:'g_n3_44', level:'N3', pattern:'〜にしたがって', meaningKo:'〜함에 따라',
    explanation:'한쪽의 변화에 맞춰 다른 쪽도 단계적으로 변함 — 「上に行くにしたがって寒くなる」. 지시·규칙을 따르다(従う)의 뜻으로도 쓴다.',
    examples:[
      { ja:'山を登るにしたがって、気温が下がります。', ko:'산을 오름에 따라 기온이 내려갑니다.',
        readings:[{text:'山',reading:'やま'},{text:'登る',reading:'のぼる'},{text:'気温',reading:'きおん'},{text:'下がります',reading:'さがります'}] },
    ], similarGrammarIds:['g_n3_45'], tags:['변화'] },

  { id:'g_n3_45', level:'N3', pattern:'〜につれて', meaningKo:'〜함에 따라 (점점)',
    explanation:'한쪽이 진행되면서 자연스럽게 다른 쪽도 변함 — 「年を取るにつれて」. にしたがって보다 자연적·연속적 변화에 어울린다.',
    examples:[
      { ja:'時間が経つにつれて、痛みが軽くなりました。', ko:'시간이 지남에 따라 통증이 가벼워졌습니다.',
        readings:[{text:'時間',reading:'じかん'},{text:'経つ',reading:'たつ'},{text:'痛み',reading:'いたみ'},{text:'軽く',reading:'かるく'}] },
    ], similarGrammarIds:['g_n3_44'], tags:['변화'] },

  { id:'g_n3_46', level:'N3', pattern:'〜とともに', meaningKo:'〜와 함께/〜함과 동시에',
    explanation:'사람·것과 함께함, 또는 두 변화·동작이 동시에 일어남 — 「家族とともに」「発展とともに」. 문어적이고 격식 있는 표현.',
    examples:[
      { ja:'技術の発達とともに、生活も変わりました。', ko:'기술의 발달과 함께 생활도 바뀌었습니다.',
        readings:[{text:'技術',reading:'ぎじゅつ'},{text:'発達',reading:'はったつ'},{text:'生活',reading:'せいかつ'},{text:'変わりました',reading:'かわりました'}] },
    ], similarGrammarIds:['g_n3_45'], tags:['동시'] },

  { id:'g_n3_47', level:'N3', pattern:'〜向け', meaningKo:'〜대상/〜용 (의도된)',
    explanation:'만든 쪽이 의도한 대상을 나타냄 — 「子供向けの本」(아이를 위해 만든 책). 성질이 맞는다는 向き와 구분.',
    examples:[
      { ja:'これは初心者向けの講座です。', ko:'이것은 초보자 대상 강좌입니다.',
        readings:[{text:'初心者向け',reading:'しょしんしゃむけ'},{text:'講座',reading:'こうざ'}] },
    ], similarGrammarIds:['g_n3_48'], tags:['대상'] },

  { id:'g_n3_48', level:'N3', pattern:'〜向き', meaningKo:'〜에 적합함',
    explanation:'의도와 상관없이 성질이 그 대상에 맞음 — 「夏向きの服」(여름에 어울리는 옷). 의도를 나타내는 向け와 구분.',
    examples:[
      { ja:'この料理は辛くないので、子供向きです。', ko:'이 요리는 맵지 않아서 아이에게 적합합니다.',
        readings:[{text:'料理',reading:'りょうり'},{text:'辛くない',reading:'からくない'},{text:'子供向き',reading:'こどもむき'}] },
    ], similarGrammarIds:['g_n3_47'], tags:['적합'] },

  { id:'g_n3_49', level:'N3', pattern:'〜っぱなし', meaningKo:'〜한 채로 (방치)',
    explanation:'해야 할 처리를 하지 않고 그대로 둠 — 「窓を開けっぱなし」. 비난의 뉘앙스가 있는 점이 중립적인 まま와 다르다.',
    examples:[
      { ja:'電気をつけっぱなしで寝てしまいました。', ko:'불을 켜 둔 채로 자 버렸습니다.',
        readings:[{text:'電気',reading:'でんき'},{text:'寝て',reading:'ねて'}] },
    ], similarGrammarIds:['g_n4_73'], tags:['상태'] },

  { id:'g_n3_50', level:'N3', pattern:'〜だらけ', meaningKo:'〜투성이',
    explanation:'바람직하지 않은 것이 가득함 — 「泥だらけ」「間違いだらけ」. 성질이 그렇게 보인다는 っぽい와 달리 양의 많음을 말한다.',
    examples:[
      { ja:'子供は泥だらけになって帰ってきました。', ko:'아이는 진흙투성이가 되어 돌아왔습니다.',
        readings:[{text:'子供',reading:'こども'},{text:'泥',reading:'どろ'},{text:'帰って',reading:'かえって'}] },
    ], similarGrammarIds:['g_n3_14'], tags:['상태'] },

  { id:'g_n3_51', level:'N3', pattern:'〜たて', meaningKo:'갓 〜한',
    explanation:'동작이 끝난 직후의 신선한 상태 — 「焼きたてのパン」. 동작 직후를 객관적으로 말하는 たばかり와 달리, 좋은 상태임을 강조한다.',
    examples:[
      { ja:'焼きたてのパンはやわらかいです。', ko:'갓 구운 빵은 부드럽습니다.',
        readings:[{text:'焼きたて',reading:'やきたて'}] },
    ], similarGrammarIds:['g_n4_56'], tags:['시점'] },

  { id:'g_n3_52', level:'N3', pattern:'〜きり', meaningKo:'〜한 채/〜뿐',
    explanation:'그것을 마지막으로 다음이 이어지지 않음 — 「出かけたきり戻らない」. 한정(二人きり)의 용법도 있다.',
    examples:[
      { ja:'彼とは去年会ったきりです。', ko:'그와는 작년에 만난 것이 마지막입니다.',
        readings:[{text:'彼',reading:'かれ'},{text:'去年',reading:'きょねん'},{text:'会った',reading:'あった'}] },
    ], similarGrammarIds:['g_n3_49'], tags:['상태'] },

  { id:'g_n3_53', level:'N3', pattern:'〜として', meaningKo:'〜로서 (자격)',
    explanation:'자격·입장·명목을 나타냄 — 「代表として参加する」. 평가의 기준을 말하는 にとって와 혼동하기 쉽다.',
    examples:[
      { ja:'クラスの代表として大会に出ました。', ko:'반 대표로서 대회에 나갔습니다.',
        readings:[{text:'代表',reading:'だいひょう'},{text:'大会',reading:'たいかい'},{text:'出ました',reading:'でました'}] },
    ], similarGrammarIds:['g_n3_10'], tags:['자격'] },

  { id:'g_n3_54', level:'N3', pattern:'〜とすれば', meaningKo:'〜라고 한다면',
    explanation:'어떤 내용을 사실로 가정하고 판단함 — 「本当だとすれば大変だ」. 조건의 なら보다 논리적 가정의 느낌이 강하다.',
    examples:[
      { ja:'このうわさが本当だとすれば、大変です。', ko:'이 소문이 사실이라고 한다면 큰일입니다.',
        readings:[{text:'本当',reading:'ほんとう'},{text:'大変',reading:'たいへん'}] },
    ], similarGrammarIds:['g_n4_28'], tags:['가정'] },

  { id:'g_n3_55', level:'N3', pattern:'〜としても', meaningKo:'설령 〜라 해도',
    explanation:'가정을 인정해도 결론은 변하지 않음 — 「行けたとしても遅れる」. ても의 가정을 한층 강조한 형태.',
    examples:[
      { ja:'急いだとしても、間に合わないでしょう。', ko:'서둘렀다 해도 시간에 맞추지 못할 것입니다.',
        readings:[{text:'急いだ',reading:'いそいだ'},{text:'間に合わない',reading:'まにあわない'}] },
    ], similarGrammarIds:['g_n4_29'], tags:['가정'] },

  { id:'g_n3_56', level:'N3', pattern:'〜わりに(は)', meaningKo:'〜에 비해서(는)',
    explanation:'예상되는 정도와 실제가 어긋남 — 「値段のわりに美味しい」. 기준이 명확한 にしては보다 막연한 기대와의 차이에 쓴다.',
    examples:[
      { ja:'この店は値段のわりに量が多いです。', ko:'이 가게는 가격에 비해 양이 많습니다.',
        readings:[{text:'店',reading:'みせ'},{text:'値段',reading:'ねだん'},{text:'量',reading:'りょう'},{text:'多い',reading:'おおい'}] },
    ], similarGrammarIds:['g_n3_40'], tags:['비교'] },

  { id:'g_n3_57', level:'N3', pattern:'〜ところに/ところへ', meaningKo:'마침 〜하던 참에',
    explanation:'어떤 상황이 진행되는 바로 그때 다른 일이 일어남 — 「出かけるところに電話が来た」. 진행 시점의 ているところ와 세트로 익힌다.',
    examples:[
      { ja:'出かけるところに、雨が降り出しました。', ko:'나가려던 참에 비가 내리기 시작했습니다.',
        readings:[{text:'出かける',reading:'でかける'},{text:'雨',reading:'あめ'},{text:'降り出しました',reading:'ふりだしました'}] },
    ], similarGrammarIds:['g_n4_54'], tags:['시점'] },

  { id:'g_n3_58', level:'N3', pattern:'〜ばかりでなく', meaningKo:'〜뿐만 아니라',
    explanation:'앞의 것에 더해 뒤의 것까지 범위가 넓어짐 — 「学生ばかりでなく大人も」. はもちろん·だけでなく과 비슷한 추가 표현.',
    examples:[
      { ja:'彼は英語ばかりでなく、中国語も話せます。', ko:'그는 영어뿐만 아니라 중국어도 말할 수 있습니다.',
        readings:[{text:'彼',reading:'かれ'},{text:'英語',reading:'えいご'},{text:'中国語',reading:'ちゅうごくご'},{text:'話せます',reading:'はなせます'}] },
    ], similarGrammarIds:['g_n3_37'], tags:['추가'] },

  { id:'g_n3_59', level:'N3', pattern:'〜せいか', meaningKo:'〜탓인지',
    explanation:'확실하지 않은 원인을 추측해 말함 — 「年のせいか疲れやすい」. 원인을 단정하는 せいで보다 완곡하다.',
    examples:[
      { ja:'寝不足のせいか、頭が重いです。', ko:'수면 부족 탓인지 머리가 무겁습니다.',
        readings:[{text:'寝不足',reading:'ねぶそく'},{text:'頭',reading:'あたま'},{text:'重い',reading:'おもい'}] },
    ], similarGrammarIds:['g_n3_6'], tags:['원인'] },

  { id:'g_n3_60', level:'N3', pattern:'〜つもりだった', meaningKo:'〜할 생각이었다',
    explanation:'의도했지만 실현되지 않았음 — 「早く出るつもりだった」. 예정이 어긋난 はずだった(객관적 예정)와 의도(주관)의 차이에 주의.',
    examples:[
      { ja:'早く帰るつもりだったのに、残業になりました。', ko:'일찍 돌아갈 생각이었는데 야근이 되었습니다.',
        readings:[{text:'早く',reading:'はやく'},{text:'帰る',reading:'かえる'},{text:'残業',reading:'ざんぎょう'}] },
    ], similarGrammarIds:['g_n3_17'], tags:['의도'] },

  { id:'g_n3_61', level:'N3', pattern:'〜がる', meaningKo:'〜워하다 (3인칭 감정)',
    explanation:'다른 사람의 감정·감각을 밖에서 본 모습으로 말함 — 「寒がる」「嫌がる」. 욕구의 たがる를 형용사 전반으로 넓힌 형태.',
    examples:[
      { ja:'犬は大きな音を怖がります。', ko:'개는 큰 소리를 무서워합니다.',
        readings:[{text:'犬',reading:'いぬ'},{text:'大きな',reading:'おおきな'},{text:'音',reading:'おと'},{text:'怖がります',reading:'こわがります'}] },
    ], similarGrammarIds:['g_n4_32'], tags:['감정'] },

  { id:'g_n3_62', level:'N3', pattern:'〜ふりをする', meaningKo:'〜하는 척하다',
    explanation:'사실과 다른 모습을 일부러 보임 — 「知らないふりをする」. 추측의 みたいだ와 달리 의도적인 연기를 뜻한다.',
    examples:[
      { ja:'彼は寝ているふりをしていました。', ko:'그는 자고 있는 척을 하고 있었습니다.',
        readings:[{text:'彼',reading:'かれ'},{text:'寝て',reading:'ねて'}] },
    ], similarGrammarIds:['g_n3_13'], tags:['태도'] },

  { id:'g_n3_63', level:'N3', pattern:'〜ことだ', meaningKo:'〜하는 것이 좋다 (조언)',
    explanation:'상대에게 가장 좋은 행동을 단언하듯 조언함 — 「早く寝ることだ」. 불필요를 말하는 ことはない와 세트로 익히면 좋다.',
    examples:[
      { ja:'風邪のときは、ゆっくり休むことです。', ko:'감기일 때는 푹 쉬는 것이 좋습니다.',
        readings:[{text:'風邪',reading:'かぜ'},{text:'休む',reading:'やすむ'}] },
    ], similarGrammarIds:['g_n3_19'], tags:['조언'] },

  { id:'g_n3_64', level:'N3', pattern:'〜ないことはない', meaningKo:'〜못할 것도 없다',
    explanation:'완전히 부정하지 않고 가능성을 남김 — 「食べられないことはない」. 이중 부정으로 소극적인 긍정을 나타낸다.',
    examples:[
      { ja:'辛い物も、食べられないことはないです。', ko:'매운 것도 못 먹을 것은 없습니다.',
        readings:[{text:'辛い',reading:'からい'},{text:'物',reading:'もの'},{text:'食べられない',reading:'たべられない'}] },
    ], similarGrammarIds:['g_n3_19'], tags:['완곡'] },

  { id:'g_n3_65', level:'N3', pattern:'〜一方だ', meaningKo:'〜하기만 한다 (단방향 변화)',
    explanation:'변화가 한 방향으로만 계속 진행됨 — 「物価は上がる一方だ」. 주로 바람직하지 않은 변화에 쓴다.',
    examples:[
      { ja:'都会の家賃は上がる一方です。', ko:'도시의 집세는 오르기만 합니다.',
        readings:[{text:'都会',reading:'とかい'},{text:'家賃',reading:'やちん'},{text:'上がる',reading:'あがる'},{text:'一方',reading:'いっぽう'}] },
    ], similarGrammarIds:['g_n3_66'], tags:['변화'] },

  { id:'g_n3_66', level:'N3', pattern:'〜一方で', meaningKo:'〜하는 한편',
    explanation:'하나의 사물이 가진 두 가지 면을 대비함 — 「便利な一方で危険もある」. 단방향 변화의 一方だ와 형태가 비슷하니 구분.',
    examples:[
      { ja:'この薬はよく効く一方で、眠くなります。', ko:'이 약은 잘 듣는 한편 졸음이 옵니다.',
        readings:[{text:'薬',reading:'くすり'},{text:'効く',reading:'きく'},{text:'一方',reading:'いっぽう'},{text:'眠く',reading:'ねむく'}] },
    ], similarGrammarIds:['g_n3_65'], tags:['대비'] },

  { id:'g_n3_67', level:'N3', pattern:'〜だけでなく', meaningKo:'〜뿐 아니라',
    explanation:'범위를 더 넓혀 뒤의 것까지 포함함 — 「形だけでなく色も」. ばかりでなく보다 회화에서 더 자주 쓰는 형태.',
    examples:[
      { ja:'この公園は昼だけでなく、夜も人が多いです。', ko:'이 공원은 낮뿐 아니라 밤에도 사람이 많습니다.',
        readings:[{text:'公園',reading:'こうえん'},{text:'昼',reading:'ひる'},{text:'夜',reading:'よる'},{text:'人',reading:'ひと'},{text:'多い',reading:'おおい'}] },
    ], similarGrammarIds:['g_n3_58'], tags:['추가'] },

  { id:'g_n3_68', level:'N3', pattern:'〜らしい (전형)', meaningKo:'〜답다',
    explanation:'그것의 전형적인 성질을 잘 갖추고 있음 — 「春らしい天気」「彼らしい答え」. 전문·추측의 らしい(N4)와 형태가 같아 문맥으로 구분한다.',
    examples:[
      { ja:'今日は春らしい暖かい一日でした。', ko:'오늘은 봄다운 따뜻한 하루였습니다.',
        readings:[{text:'今日',reading:'きょう'},{text:'春',reading:'はる'},{text:'暖かい',reading:'あたたかい'},{text:'一日',reading:'いちにち'}] },
    ], similarGrammarIds:['g_n4_11'], tags:['성질'] },

  { id:'g_n3_69', level:'N3', pattern:'〜うえで', meaningKo:'〜한 후에/〜하는 데 있어',
    explanation:'「확인したうえで」처럼 먼저 한 뒤 다음을 함, 또는 「学ぶうえで大切」처럼 목적의 전제를 나타냄. 첨가의 うえに와 구분.',
    examples:[
      { ja:'内容を確認したうえで、サインしてください。', ko:'내용을 확인한 후에 사인해 주세요.',
        readings:[{text:'内容',reading:'ないよう'},{text:'確認',reading:'かくにん'}] },
    ], similarGrammarIds:['g_n3_24'], tags:['순서'] },

  { id:'g_n3_70', level:'N3', pattern:'〜とは限らない', meaningKo:'〜라고는 할 수 없다',
    explanation:'일반적으로 그렇다고 여겨지는 것에 예외가 있음 — 「高い物がいいとは限らない」. 부분 부정의 わけではない와 비슷하다.',
    examples:[
      { ja:'高い物が必ずいいとは限りません。', ko:'비싼 물건이 반드시 좋다고는 할 수 없습니다.',
        readings:[{text:'高い',reading:'たかい'},{text:'物',reading:'もの'},{text:'必ず',reading:'かならず'},{text:'限りません',reading:'かぎりません'}] },
    ], similarGrammarIds:['g_n4_65'], tags:['부분부정'] },


  // ---------- N3 3차 확장 (라운드 38) ----------
  { id:'g_n3_71', level:'N3', pattern:'〜ものだ', meaningKo:'〜인 법이다 (본성·진리)',
    explanation:'일반적인 진리·당연함이나 본래의 성질을 말함 — 「子供は遊びたがるものだ」. 과거형 「〜たものだ」는 회상.',
    examples:[ { ja:'年を取ると、昔が懐かしく感じるものです。', ko:'나이를 먹으면 옛날이 그리워지는 법입니다.',
      readings:[{text:'年',reading:'とし'},{text:'取る',reading:'とる'},{text:'昔',reading:'むかし'},{text:'懐かしく',reading:'なつかしく'},{text:'感じる',reading:'かんじる'}] } ],
    similarGrammarIds:['g_n3_72'], tags:['진리'] },
  { id:'g_n3_72', level:'N3', pattern:'〜ものの', meaningKo:'〜이기는 하지만',
    explanation:'앞 내용을 인정하면서 뒤에서 예상과 다른 사실을 말하는 역접 — 「申し込んだものの、まだ返事がない」. のに보다 문어적.',
    examples:[ { ja:'試験は終わったものの、結果が心配です。', ko:'시험은 끝났지만 결과가 걱정입니다.',
      readings:[{text:'試験',reading:'しけん'},{text:'終わった',reading:'おわった'},{text:'結果',reading:'けっか'},{text:'心配',reading:'しんぱい'}] } ],
    similarGrammarIds:['g_n3_7'], tags:['역접'] },
  { id:'g_n3_73', level:'N3', pattern:'〜やら〜やら', meaningKo:'〜며 〜며 (여러 가지)',
    explanation:'여러 일이 뒤섞여 있음을 예시로 나열 — 「掃除やら洗濯やらで忙しい」. 부정적·번잡한 느낌에 자주 쓴다.',
    examples:[ { ja:'引っ越しは荷造りやら手続きやらで大変でした。', ko:'이사는 짐 싸기며 수속이며 힘들었습니다.',
      readings:[{text:'引っ越し',reading:'ひっこし'},{text:'荷造り',reading:'にづくり'},{text:'手続き',reading:'てつづき'},{text:'大変',reading:'たいへん'}] } ],
    similarGrammarIds:['g_n3_74'], tags:['나열'] },
  { id:'g_n3_74', level:'N3', pattern:'〜だの〜だの', meaningKo:'〜느니 〜느니',
    explanation:'불만·비난을 담아 예를 나열 — 「高いだの遠いだの文句が多い」. やら〜やら보다 불평의 뉘앙스가 강하다.',
    examples:[ { ja:'弟は暑いだの疲れただのと文句ばかり言います。', ko:'남동생은 덥다느니 피곤하다느니 불평만 합니다.',
      readings:[{text:'弟',reading:'おとうと'},{text:'暑い',reading:'あつい'},{text:'疲れた',reading:'つかれた'},{text:'文句',reading:'もんく'},{text:'言います',reading:'いいます'}] } ],
    similarGrammarIds:['g_n3_73'], tags:['나열'] },
  { id:'g_n3_75', level:'N3', pattern:'〜あまり', meaningKo:'너무 〜한 나머지',
    explanation:'정도가 지나쳐 어떤 결과가 생김 — 「緊張のあまり声が出なかった」. 감정·상태 명사 + のあまり, 또는 동사 사전형 + あまり.',
    examples:[ { ja:'驚きのあまり、言葉が出ませんでした。', ko:'놀란 나머지 말이 나오지 않았습니다.',
      readings:[{text:'驚き',reading:'おどろき'},{text:'言葉',reading:'ことば'},{text:'出ません',reading:'でません'}] } ],
    similarGrammarIds:['g_n3_76'], tags:['정도'] },
  { id:'g_n3_76', level:'N3', pattern:'〜あげく', meaningKo:'〜한 끝에 (결국)',
    explanation:'여러 일을 거친 끝에 (주로 나쁜) 결과에 이름 — 「迷ったあげく買わなかった」. 동사 た형 + あげく.',
    examples:[ { ja:'長く悩んだあげく、引っ越すことに決めました。', ko:'오래 고민한 끝에 이사하기로 결정했습니다.',
      readings:[{text:'長く',reading:'ながく'},{text:'悩んだ',reading:'なやんだ'},{text:'引っ越す',reading:'ひっこす'},{text:'決めました',reading:'きめました'}] } ],
    similarGrammarIds:['g_n3_77'], tags:['결과'] },
  { id:'g_n3_77', level:'N3', pattern:'〜末に', meaningKo:'〜한 끝에',
    explanation:'오랜 과정·노력의 결과 — 「長い議論の末に決まった」. あげく가 나쁜 결과에 치우치는 데 비해 末に는 중립적.',
    examples:[ { ja:'何度も話し合った末に、合意しました。', ko:'몇 번이나 의논한 끝에 합의했습니다.',
      readings:[{text:'何度',reading:'なんど'},{text:'話し合った',reading:'はなしあった'},{text:'末',reading:'すえ'},{text:'合意',reading:'ごうい'}] } ],
    similarGrammarIds:['g_n3_76'], tags:['결과'] },
  { id:'g_n3_78', level:'N3', pattern:'〜くらいなら', meaningKo:'〜할 바에는',
    explanation:'그렇게 할 정도라면 차라리 다른 쪽을 택함 — 「捨てるくらいなら人にあげる」. 뒤에 「ほうがましだ/方がいい」가 자주 온다.',
    examples:[ { ja:'並んで待つくらいなら、別の店に行きます。', ko:'줄 서서 기다릴 바에는 다른 가게에 갑니다.',
      readings:[{text:'並んで',reading:'ならんで'},{text:'待つ',reading:'まつ'},{text:'別',reading:'べつ'},{text:'店',reading:'みせ'},{text:'行きます',reading:'いきます'}] } ],
    similarGrammarIds:['g_n3_79'], tags:['비교'] },
  { id:'g_n3_79', level:'N3', pattern:'〜ばかりに', meaningKo:'〜한 탓에',
    explanation:'단지 그것 하나가 원인이 되어 나쁜 결과가 생김 — 「確認しなかったばかりに失敗した」. せいで보다 "그 사소한 것 때문에"라는 후회가 강하다.',
    examples:[ { ja:'道を間違えたばかりに、会議に遅れました。', ko:'길을 잘못 든 탓에 회의에 늦었습니다.',
      readings:[{text:'道',reading:'みち'},{text:'間違えた',reading:'まちがえた'},{text:'会議',reading:'かいぎ'},{text:'遅れました',reading:'おくれました'}] } ],
    similarGrammarIds:['g_n3_6'], tags:['원인'] },
  { id:'g_n3_80', level:'N3', pattern:'〜だけに', meaningKo:'〜인 만큼',
    explanation:'그런 사정이 있으니 당연히 그렇다 — 「専門家だけに説明がうまい」. 이유에 걸맞은 결과를 강조한다.',
    examples:[ { ja:'長く練習しただけに、本番はうまくいきました。', ko:'오래 연습한 만큼 실전은 잘되었습니다.',
      readings:[{text:'長く',reading:'ながく'},{text:'練習',reading:'れんしゅう'},{text:'本番',reading:'ほんばん'}] } ],
    similarGrammarIds:['g_n3_81'], tags:['이유'] },
  { id:'g_n3_81', level:'N3', pattern:'〜ことから', meaningKo:'〜인 데서/때문에',
    explanation:'판단·명칭의 근거를 나타냄 — 「窓が割れていたことから、泥棒に入られたと分かった」.',
    examples:[ { ja:'煙が出ていたことから、火事に気づきました。', ko:'연기가 나고 있던 데서 화재를 알아챘습니다.',
      readings:[{text:'煙',reading:'けむり'},{text:'出て',reading:'でて'},{text:'火事',reading:'かじ'},{text:'気づきました',reading:'きづきました'}] } ],
    similarGrammarIds:['g_n3_82'], tags:['근거'] },
  { id:'g_n3_82', level:'N3', pattern:'〜ことだから', meaningKo:'〜이니까 (성격상)',
    explanation:'잘 아는 사람·대상의 성질을 근거로 추측 — 「まじめな彼のことだから、必ず来る」.',
    examples:[ { ja:'いつも早い田中さんのことだから、もう着いているでしょう。', ko:'늘 빠른 다나카 씨니까 벌써 도착해 있겠죠.',
      readings:[{text:'早い',reading:'はやい'},{text:'田中',reading:'たなか'},{text:'着いて',reading:'ついて'}] } ],
    similarGrammarIds:['g_n3_81'], tags:['추측'] },
  { id:'g_n3_83', level:'N3', pattern:'〜どおり', meaningKo:'〜대로 (명사+)',
    explanation:'명사에 붙어 "그대로" — 「予定どおり」「説明どおり」. 동사에 붙는 とおりに와 짝을 이룬다.',
    examples:[ { ja:'計画どおりに作業が進みました。', ko:'계획대로 작업이 진행되었습니다.',
      readings:[{text:'計画',reading:'けいかく'},{text:'作業',reading:'さぎょう'},{text:'進みました',reading:'すすみました'}] } ],
    similarGrammarIds:['g_n3_21'], tags:['방법'] },
  { id:'g_n3_84', level:'N3', pattern:'〜次第', meaningKo:'〜하는 대로 (즉시)',
    explanation:'어떤 일이 끝나는 즉시 다음을 함 — 「到着し次第、連絡します」. 동사 ます형 + 次第, 격식 있는 표현.',
    examples:[ { ja:'準備ができ次第、始めます。', ko:'준비가 되는 대로 시작하겠습니다.',
      readings:[{text:'準備',reading:'じゅんび'},{text:'始めます',reading:'はじめます'}] } ],
    similarGrammarIds:['g_n3_85'], tags:['시점'] },
  { id:'g_n3_85', level:'N3', pattern:'〜次第だ', meaningKo:'〜에 달려 있다/나름이다',
    explanation:'결과가 그것에 의해 정해짐 — 「成功は努力次第だ」. 명사 + 次第だ/次第で.',
    examples:[ { ja:'明日の予定は天気次第です。', ko:'내일 예정은 날씨에 달려 있습니다.',
      readings:[{text:'明日',reading:'あした'},{text:'予定',reading:'よてい'},{text:'天気',reading:'てんき'}] } ],
    similarGrammarIds:['g_n3_84'], tags:['조건'] },
  { id:'g_n3_86', level:'N3', pattern:'〜反面', meaningKo:'〜인 반면',
    explanation:'한 사물의 상반된 두 면을 대비 — 「便利な反面、運動不足になる」. 一方で와 비슷하나 더 명확히 양면 대비.',
    examples:[ { ja:'この仕事は給料がいい反面、休みが少ないです。', ko:'이 일은 급여가 좋은 반면 휴일이 적습니다.',
      readings:[{text:'仕事',reading:'しごと'},{text:'給料',reading:'きゅうりょう'},{text:'反面',reading:'はんめん'},{text:'休み',reading:'やすみ'},{text:'少ない',reading:'すくない'}] } ],
    similarGrammarIds:['g_n3_66'], tags:['대비'] },
  { id:'g_n3_87', level:'N3', pattern:'〜たところが', meaningKo:'〜했더니 (예상 밖)',
    explanation:'했더니 예상과 다른 결과가 나옴 — 「電話したところが、留守だった」. 발견의 たら와 비슷하나 역접 뉘앙스.',
    examples:[ { ja:'店に行ったところが、休みでした。', ko:'가게에 갔더니 휴일이었습니다.',
      readings:[{text:'店',reading:'みせ'},{text:'行った',reading:'いった'},{text:'休み',reading:'やすみ'}] } ],
    similarGrammarIds:['g_n4_84'], tags:['발견'] },
  { id:'g_n3_88', level:'N3', pattern:'〜ながらも', meaningKo:'〜하면서도',
    explanation:'동작·상태를 인정하면서 그와 다른 결과 — 「狭いながらも快適な部屋」. ながら의 역접 강조.',
    examples:[ { ja:'危ないと知りながらも、急いで道を渡りました。', ko:'위험한 줄 알면서도 서둘러 길을 건넜습니다.',
      readings:[{text:'危ない',reading:'あぶない'},{text:'知り',reading:'しり'},{text:'急いで',reading:'いそいで'},{text:'道',reading:'みち'},{text:'渡りました',reading:'わたりました'}] } ],
    similarGrammarIds:['g_n3_89'], tags:['역접'] },
  { id:'g_n3_89', level:'N3', pattern:'〜つつ', meaningKo:'〜하면서 (동시)',
    explanation:'두 동작이 동시에 일어남, 또는 「つつも」로 역접 — 「悪いと思いつつ、つい食べた」. ながら의 문어체.',
    examples:[ { ja:'景色を楽しみつつ、ゆっくり歩きました。', ko:'경치를 즐기면서 천천히 걸었습니다.',
      readings:[{text:'景色',reading:'けしき'},{text:'楽しみ',reading:'たのしみ'},{text:'歩きました',reading:'あるきました'}] } ],
    similarGrammarIds:['g_n4_30'], tags:['동시'] },
  { id:'g_n3_90', level:'N3', pattern:'〜得る', meaningKo:'〜할 수 있다 (가능성)',
    explanation:'그런 일이 일어날 가능성이 있음 — 「だれにでも起こり得る」. 동사 ます형 + 得る(える/うる).',
    examples:[ { ja:'準備しても、失敗はあり得ます。', ko:'준비해도 실패는 있을 수 있습니다.',
      readings:[{text:'準備',reading:'じゅんび'},{text:'失敗',reading:'しっぱい'},{text:'得ます',reading:'えます'}] } ],
    similarGrammarIds:['g_n3_91'], tags:['가능'] },
  { id:'g_n3_91', level:'N3', pattern:'〜かねる', meaningKo:'〜하기 어렵다',
    explanation:'사정상 그렇게 하기 어렵다 (정중한 거절) — 「その件は分かりかねます」. 동사 ます형 + かねる.',
    examples:[ { ja:'こちらでは決めかねますので、確認します。', ko:'여기서는 정하기 어려우므로 확인하겠습니다.',
      readings:[{text:'決め',reading:'きめ'},{text:'確認',reading:'かくにん'}] } ],
    similarGrammarIds:['g_n3_92'], tags:['곤란'] },
  { id:'g_n3_92', level:'N3', pattern:'〜かねない', meaningKo:'〜할 수도 있다 (나쁜 가능성)',
    explanation:'나쁜 일이 일어날 가능성이 있음 — 「無理をすると倒れかねない」. かねる(어렵다)와 반대로 부정적 가능성.',
    examples:[ { ja:'寝不足が続くと、病気になりかねません。', ko:'수면 부족이 계속되면 병이 날 수도 있습니다.',
      readings:[{text:'寝不足',reading:'ねぶそく'},{text:'続く',reading:'つづく'},{text:'病気',reading:'びょうき'}] } ],
    similarGrammarIds:['g_n3_91'], tags:['가능성'] },
  { id:'g_n3_93', level:'N3', pattern:'〜がたい', meaningKo:'〜하기 어렵다 (감정·판단)',
    explanation:'마음·도덕상 그렇게 하기 힘듦 — 「信じがたい話」「許しがたい」. 물리적 곤란의 づらい와 달리 심리적.',
    examples:[ { ja:'彼の態度は理解しがたいです。', ko:'그의 태도는 이해하기 어렵습니다.',
      readings:[{text:'彼',reading:'かれ'},{text:'態度',reading:'たいど'},{text:'理解',reading:'りかい'}] } ],
    similarGrammarIds:['g_n3_32'], tags:['곤란'] },
  { id:'g_n3_94', level:'N3', pattern:'〜ようがない', meaningKo:'〜할 도리가 없다',
    explanation:'방법이 전혀 없음 — 「連絡先が分からず、知らせようがない」. 동사 ます형 + ようがない.',
    examples:[ { ja:'壊れ方がひどくて、直しようがありません。', ko:'고장이 심해서 고칠 도리가 없습니다.',
      readings:[{text:'壊れ方',reading:'こわれかた'},{text:'直し',reading:'なおし'}] } ],
    similarGrammarIds:['g_n3_36'], tags:['불가능'] },
  { id:'g_n3_95', level:'N3', pattern:'〜っこない', meaningKo:'〜할 리 없다',
    explanation:'절대 그럴 리 없다는 강한 부정 (회화체) — 「そんなの分かりっこない」. 동사 ます형 + っこない.',
    examples:[ { ja:'今から走っても、間に合いっこないです。', ko:'지금 뛰어도 시간에 맞출 리 없습니다.',
      readings:[{text:'今',reading:'いま'},{text:'走って',reading:'はしって'},{text:'間に合い',reading:'まにあい'}] } ],
    similarGrammarIds:['g_n4_64'], tags:['부정'] },
  { id:'g_n3_96', level:'N3', pattern:'〜どころではない', meaningKo:'〜할 상황이 아니다',
    explanation:'사정이 있어 그럴 여유가 전혀 없음 — 「忙しくて、休むどころではない」.',
    examples:[ { ja:'仕事が山ほどあって、旅行どころではありません。', ko:'일이 산더미라서 여행할 상황이 아닙니다.',
      readings:[{text:'仕事',reading:'しごと'},{text:'山',reading:'やま'},{text:'旅行',reading:'りょこう'}] } ],
    similarGrammarIds:['g_n3_20'], tags:['부정'] },
  { id:'g_n3_97', level:'N3', pattern:'〜とは', meaningKo:'〜라니 (놀람·감탄)',
    explanation:'예상 밖의 일에 대한 놀람 — 「彼が来ないとは思わなかった」. 뒤에 놀람·감탄이 생략되기도 한다.',
    examples:[ { ja:'こんなに早く完成するとは驚きました。', ko:'이렇게 빨리 완성될 줄은 놀랐습니다.',
      readings:[{text:'早く',reading:'はやく'},{text:'完成',reading:'かんせい'},{text:'驚きました',reading:'おどろきました'}] } ],
    similarGrammarIds:['g_n3_98'], tags:['놀람'] },
  { id:'g_n3_98', level:'N3', pattern:'〜なんて', meaningKo:'〜하다니/〜따위',
    explanation:'놀람·가벼운 무시·뜻밖을 나타내는 회화 표현 — 「遅れるなんて珍しい」「失敗なんて気にしない」.',
    examples:[ { ja:'まさか優勝できるなんて、夢のようです。', ko:'설마 우승할 수 있다니 꿈만 같습니다.',
      readings:[{text:'優勝',reading:'ゆうしょう'},{text:'夢',reading:'ゆめ'}] } ],
    similarGrammarIds:['g_n3_97'], tags:['놀람'] },
  { id:'g_n3_99', level:'N3', pattern:'〜ことか', meaningKo:'얼마나 〜한지',
    explanation:'감정의 정도가 큼을 강조 — 「どんなに心配したことか」. 의문사(どんなに·何度)와 함께 쓴다.',
    examples:[ { ja:'合格の知らせを、どんなに待っていたことか。', ko:'합격 소식을 얼마나 기다렸는지 모릅니다.',
      readings:[{text:'合格',reading:'ごうかく'},{text:'知らせ',reading:'しらせ'},{text:'待って',reading:'まって'}] } ],
    similarGrammarIds:['g_n3_100'], tags:['강조'] },
  { id:'g_n3_100', level:'N3', pattern:'〜ことに', meaningKo:'〜하게도 (감정 강조)',
    explanation:'감정을 나타내는 말 + ことに로 화자의 심정을 앞세움 — 「驚いたことに」「残念なことに」.',
    examples:[ { ja:'うれしいことに、全員が合格しました。', ko:'기쁘게도 전원이 합격했습니다.',
      readings:[{text:'全員',reading:'ぜんいん'},{text:'合格',reading:'ごうかく'}] } ],
    similarGrammarIds:['g_n3_99'], tags:['감정'] },
  { id:'g_n3_101', level:'N3', pattern:'〜ように (기원·전달)', meaningKo:'〜하도록/〜하기를',
    explanation:'기원·바람이나 간접적인 지시·전달 — 「早く治りますように」「遅れないようにと言われた」.',
    examples:[ { ja:'みんなが元気でありますように。', ko:'모두가 건강하기를.',
      readings:[{text:'元気',reading:'げんき'}] } ],
    similarGrammarIds:['g_n4_24'], tags:['기원'] },
  { id:'g_n3_102', level:'N3', pattern:'〜ついでに', meaningKo:'〜하는 김에',
    explanation:'어떤 일을 하는 기회에 다른 일도 함 — 「買い物のついでに郵便局に寄る」.',
    examples:[ { ja:'散歩のついでに、パンを買ってきました。', ko:'산책하는 김에 빵을 사 왔습니다.',
      readings:[{text:'散歩',reading:'さんぽ'},{text:'買って',reading:'かって'}] } ],
    similarGrammarIds:['g_n3_25'], tags:['기회'] },
  { id:'g_n3_103', level:'N3', pattern:'〜際(に)', meaningKo:'〜할 때 (격식)',
    explanation:'어떤 특별한 상황·기회를 나타내는 격식 표현 — 「お降りの際は足元にご注意ください」. とき의 격식체.',
    examples:[ { ja:'ご利用の際は、会員証をお見せください。', ko:'이용하실 때는 회원증을 보여 주세요.',
      readings:[{text:'利用',reading:'りよう'},{text:'際',reading:'さい'},{text:'会員証',reading:'かいいんしょう'},{text:'見せ',reading:'みせ'}] } ],
    similarGrammarIds:['g_n3_23'], tags:['시점'] },
  { id:'g_n3_104', level:'N3', pattern:'〜をもとに', meaningKo:'〜을 바탕으로',
    explanation:'그것을 근거·재료로 삼아 — 「事実をもとに記事を書く」.',
    examples:[ { ja:'調査の結果をもとに、計画を立てます。', ko:'조사 결과를 바탕으로 계획을 세웁니다.',
      readings:[{text:'調査',reading:'ちょうさ'},{text:'結果',reading:'けっか'},{text:'計画',reading:'けいかく'},{text:'立てます',reading:'たてます'}] } ],
    similarGrammarIds:['g_n3_105'], tags:['근거'] },
  { id:'g_n3_105', level:'N3', pattern:'〜を中心に', meaningKo:'〜을 중심으로',
    explanation:'어떤 것을 가운데 두고 — 「若者を中心に人気だ」.',
    examples:[ { ja:'駅を中心に、店が広がっています。', ko:'역을 중심으로 가게가 퍼져 있습니다.',
      readings:[{text:'駅',reading:'えき'},{text:'中心',reading:'ちゅうしん'},{text:'店',reading:'みせ'},{text:'広がって',reading:'ひろがって'}] } ],
    similarGrammarIds:['g_n3_104'], tags:['범위'] },
  { id:'g_n3_106', level:'N3', pattern:'〜をはじめ', meaningKo:'〜을 비롯해',
    explanation:'대표적인 예를 먼저 들고 그 외에도 있음 — 「東京をはじめ、各地で行われる」.',
    examples:[ { ja:'校長先生をはじめ、多くの先生が集まりました。', ko:'교장 선생님을 비롯해 많은 선생님이 모였습니다.',
      readings:[{text:'校長',reading:'こうちょう'},{text:'先生',reading:'せんせい'},{text:'多く',reading:'おおく'},{text:'集まりました',reading:'あつまりました'}] } ],
    similarGrammarIds:['g_n3_37'], tags:['예시'] },
  { id:'g_n3_107', level:'N3', pattern:'〜において', meaningKo:'〜에서/〜에 있어 (격식)',
    explanation:'장소·상황·분야를 나타내는 문어 표현 — 「会議室において行われる」. で의 격식체.',
    examples:[ { ja:'この分野において、彼は有名です。', ko:'이 분야에 있어 그는 유명합니다.',
      readings:[{text:'分野',reading:'ぶんや'},{text:'彼',reading:'かれ'},{text:'有名',reading:'ゆうめい'}] } ],
    similarGrammarIds:['g_n3_108'], tags:['장면'] },
  { id:'g_n3_108', level:'N3', pattern:'〜における', meaningKo:'〜에서의 (격식)',
    explanation:'명사를 수식하는 において의 형태 — 「現代社会における問題」.',
    examples:[ { ja:'学校における安全が大切です。', ko:'학교에서의 안전이 중요합니다.',
      readings:[{text:'学校',reading:'がっこう'},{text:'安全',reading:'あんぜん'},{text:'大切',reading:'たいせつ'}] } ],
    similarGrammarIds:['g_n3_107'], tags:['장면'] },
  { id:'g_n3_109', level:'N3', pattern:'〜にかけて', meaningKo:'〜에 걸쳐',
    explanation:'대략의 시간·범위의 끝을 나타냄. 「AからBにかけて」형태로 빈출 — 「夜から朝にかけて雨」.',
    examples:[ { ja:'今夜から明日にかけて、雪が降るでしょう。', ko:'오늘 밤부터 내일에 걸쳐 눈이 내리겠습니다.',
      readings:[{text:'今夜',reading:'こんや'},{text:'明日',reading:'あした'},{text:'雪',reading:'ゆき'},{text:'降る',reading:'ふる'}] } ],
    similarGrammarIds:['g_n4_36'], tags:['범위'] },
  { id:'g_n3_110', level:'N3', pattern:'〜をこめて', meaningKo:'〜을 담아',
    explanation:'마음·감정을 담아서 — 「感謝をこめて贈る」「心をこめて作る」.',
    examples:[ { ja:'感謝をこめて、手紙を書きました。', ko:'감사를 담아 편지를 썼습니다.',
      readings:[{text:'感謝',reading:'かんしゃ'},{text:'手紙',reading:'てがみ'},{text:'書きました',reading:'かきました'}] } ],
    similarGrammarIds:['g_n3_111'], tags:['감정'] },
  { id:'g_n3_111', level:'N3', pattern:'〜をきっかけに', meaningKo:'〜을 계기로',
    explanation:'어떤 일을 계기로 변화가 시작됨 — 「入院をきっかけに、生活を見直した」.',
    examples:[ { ja:'旅行をきっかけに、写真が趣味になりました。', ko:'여행을 계기로 사진이 취미가 되었습니다.',
      readings:[{text:'旅行',reading:'りょこう'},{text:'写真',reading:'しゃしん'},{text:'趣味',reading:'しゅみ'}] } ],
    similarGrammarIds:['g_n3_104'], tags:['계기'] },
  { id:'g_n3_112', level:'N3', pattern:'〜抜きで', meaningKo:'〜을 빼고/없이',
    explanation:'어떤 것을 제외하고 — 「冗談抜きで話そう」「朝食抜きで出かけた」.',
    examples:[ { ja:'今日は仕事の話抜きで、楽しみましょう。', ko:'오늘은 일 얘기는 빼고 즐깁시다.',
      readings:[{text:'今日',reading:'きょう'},{text:'仕事',reading:'しごと'},{text:'話',reading:'はなし'},{text:'楽しみましょう',reading:'たのしみましょう'}] } ],
    similarGrammarIds:['g_n4_75'], tags:['제외'] },
  { id:'g_n3_113', level:'N3', pattern:'〜限り', meaningKo:'〜하는 한',
    explanation:'그 상태가 계속되는 동안·범위 — 「体が動く限り働きたい」.',
    examples:[ { ja:'私が知る限り、彼は正直な人です。', ko:'제가 아는 한 그는 정직한 사람입니다.',
      readings:[{text:'私',reading:'わたし'},{text:'知る',reading:'しる'},{text:'限り',reading:'かぎり'},{text:'彼',reading:'かれ'},{text:'正直',reading:'しょうじき'},{text:'人',reading:'ひと'}] } ],
    similarGrammarIds:['g_n3_114'], tags:['범위'] },
  { id:'g_n3_114', level:'N3', pattern:'〜ない限り', meaningKo:'〜하지 않는 한',
    explanation:'그 조건이 충족되지 않으면 결과도 없음 — 「謝らない限り、許さない」.',
    examples:[ { ja:'雨が降らない限り、試合は行われます。', ko:'비가 오지 않는 한 시합은 열립니다.',
      readings:[{text:'雨',reading:'あめ'},{text:'降らない',reading:'ふらない'},{text:'限り',reading:'かぎり'},{text:'試合',reading:'しあい'},{text:'行われます',reading:'おこなわれます'}] } ],
    similarGrammarIds:['g_n3_113'], tags:['조건'] },
  { id:'g_n3_115', level:'N3', pattern:'〜はともかく', meaningKo:'〜은 차치하고',
    explanation:'그것은 일단 제쳐 두고 다른 것을 우선 — 「値段はともかく、味はいい」.',
    examples:[ { ja:'結果はともかく、最後まで頑張りました。', ko:'결과는 차치하고 끝까지 노력했습니다.',
      readings:[{text:'結果',reading:'けっか'},{text:'最後',reading:'さいご'},{text:'頑張りました',reading:'がんばりました'}] } ],
    similarGrammarIds:['g_n3_116'], tags:['화제'] },
  { id:'g_n3_116', level:'N3', pattern:'〜に限って', meaningKo:'〜에 한해서/하필 〜에',
    explanation:'특정한 경우만 다름, 또는 하필 그때 — 「急ぐ日に限って電車が遅れる」.',
    examples:[ { ja:'私が休みの日に限って、いい天気になります。', ko:'하필 제가 쉬는 날에 좋은 날씨가 됩니다.',
      readings:[{text:'私',reading:'わたし'},{text:'休み',reading:'やすみ'},{text:'日',reading:'ひ'},{text:'限って',reading:'かぎって'},{text:'天気',reading:'てんき'}] } ],
    similarGrammarIds:['g_n3_115'], tags:['한정'] },
  { id:'g_n3_117', level:'N3', pattern:'〜つもりはない', meaningKo:'〜할 생각은 없다',
    explanation:'그렇게 할 의지가 전혀 없음 — 「あきらめるつもりはない」.',
    examples:[ { ja:'今の仕事を辞めるつもりはありません。', ko:'지금 일을 그만둘 생각은 없습니다.',
      readings:[{text:'今',reading:'いま'},{text:'仕事',reading:'しごと'},{text:'辞める',reading:'やめる'}] } ],
    similarGrammarIds:['g_n3_60'], tags:['의도'] },
  { id:'g_n3_118', level:'N3', pattern:'〜くせして', meaningKo:'〜인 주제에 (회화)',
    explanation:'くせに의 회화체로 비난·불만이 강함 — 「知っているくせして教えない」.',
    examples:[ { ja:'できるくせして、やろうとしません。', ko:'할 수 있는 주제에 하려고 하지 않습니다.',
      readings:[{text:'できる',reading:'できる'}] } ],
    similarGrammarIds:['g_n3_7'], tags:['비난'] },
  { id:'g_n3_119', level:'N3', pattern:'〜だけあって', meaningKo:'〜인 만큼 (역시)',
    explanation:'그만한 가치·이유가 있어 당연히 — 「人気店だけあって、おいしい」. だけに와 비슷하나 감탄이 강하다.',
    examples:[ { ja:'毎日練習しただけあって、上手になりました。', ko:'매일 연습한 만큼 능숙해졌습니다.',
      readings:[{text:'毎日',reading:'まいにち'},{text:'練習',reading:'れんしゅう'},{text:'上手',reading:'じょうず'}] } ],
    similarGrammarIds:['g_n3_80'], tags:['이유'] },
  { id:'g_n3_120', level:'N3', pattern:'〜ことなく', meaningKo:'〜하는 일 없이',
    explanation:'한 번도 그렇게 하지 않고 — 「休むことなく働き続けた」. 문어적인 ないで.',
    examples:[ { ja:'彼は最後まであきらめることなく走りました。', ko:'그는 끝까지 포기하는 일 없이 달렸습니다.',
      readings:[{text:'彼',reading:'かれ'},{text:'最後',reading:'さいご'},{text:'走りました',reading:'はしりました'}] } ],
    similarGrammarIds:['g_n4_75'], tags:['부정'] },
  // ---------- N2 ----------
  { id:'g_n2_1', level:'N2', pattern:'〜のみならず', meaningKo:'〜뿐만 아니라',
    explanation:'앞의 범위에 그치지 않고 더 넓은 범위까지 미침을 나타내는 문어 표현 — 「国内のみならず海外でも」. だけでなく의 격식체.',
    examples:[
      { ja:'この問題は会社のみならず、社会全体に関わる。', ko:'이 문제는 회사뿐만 아니라 사회 전체에 관계된다.',
        readings:[{text:'問題',reading:'もんだい'},{text:'会社',reading:'かいしゃ'},{text:'社会',reading:'しゃかい'},{text:'全体',reading:'ぜんたい'},{text:'関わる',reading:'かかわる'}] },
    ], similarGrammarIds:['g_n3_67'], tags:['추가'] },

  { id:'g_n2_2', level:'N2', pattern:'〜にともなって', meaningKo:'〜에 따라/〜에 동반하여',
    explanation:'한쪽의 변화·진행과 함께 다른 쪽도 변함 — 「人口の増加にともなって」. 명사·동사에 붙으며, につれて보다 격식 있는 문어체.',
    examples:[
      { ja:'都市化にともなって、緑が減っている。', ko:'도시화에 따라 녹지가 줄고 있다.',
        readings:[{text:'都市化',reading:'としか'},{text:'緑',reading:'みどり'},{text:'減って',reading:'へって'}] },
    ], similarGrammarIds:['g_n3_45'], tags:['변화'] },

  // ---------- N2 0차 시드 (라운드 40) ----------
  { id:'g_n2_3', level:'N2', pattern:'〜にあたって', meaningKo:'〜할 때/〜에 즈음하여',
    explanation:'중요한 일을 시작하는 시점·기회를 나타내는 격식 표현 — 「開会にあたって一言」. 일상적 とき보다 의례적·공식적 장면에 쓴다.',
    examples:[
      { ja:'新しい事業を始めるにあたって、計画を立てた。', ko:'새 사업을 시작할 때 계획을 세웠다.',
        readings:[{text:'新しい',reading:'あたらしい'},{text:'事業',reading:'じぎょう'},{text:'始める',reading:'はじめる'},{text:'計画',reading:'けいかく'},{text:'立てた',reading:'たてた'}] },
    ], similarGrammarIds:['g_n3_103'], tags:['시점'] },

  { id:'g_n2_4', level:'N2', pattern:'〜に応じて', meaningKo:'〜에 따라/〜에 맞춰',
    explanation:'상황·조건의 변화에 맞춰 다른 것도 달라짐 — 「収入に応じて税が変わる」. によって보다 "맞춰 대응한다"는 능동적 뉘앙스.',
    examples:[
      { ja:'客の希望に応じて、商品を選ぶ。', ko:'손님의 희망에 맞춰 상품을 고른다.',
        readings:[{text:'客',reading:'きゃく'},{text:'希望',reading:'きぼう'},{text:'応じて',reading:'おうじて'},{text:'商品',reading:'しょうひん'},{text:'選ぶ',reading:'えらぶ'}] },
    ], similarGrammarIds:['g_n2_2'], tags:['대응'] },

  { id:'g_n2_5', level:'N2', pattern:'〜に先立って', meaningKo:'〜에 앞서',
    explanation:'어떤 일을 하기 전에 미리 다른 일을 함 — 「会議に先立って資料を配る」. 시간적 전후를 격식 있게 나타낸다.',
    examples:[
      { ja:'発表に先立って、簡単に趣旨を説明する。', ko:'발표에 앞서 간단히 취지를 설명한다.',
        readings:[{text:'発表',reading:'はっぴょう'},{text:'先立って',reading:'さきだって'},{text:'簡単',reading:'かんたん'},{text:'趣旨',reading:'しゅし'},{text:'説明',reading:'せつめい'}] },
    ], similarGrammarIds:['g_n3_69'], tags:['시점'] },

  { id:'g_n2_6', level:'N2', pattern:'〜を契機に', meaningKo:'〜을 계기로',
    explanation:'어떤 일을 전환점으로 삼아 변화가 시작됨 — 「入院を契機に生活を見直す」. をきっかけに의 격식체.',
    examples:[
      { ja:'転職を契機に、新しい資格の勉強を始めた。', ko:'이직을 계기로 새 자격 공부를 시작했다.',
        readings:[{text:'転職',reading:'てんしょく'},{text:'契機',reading:'けいき'},{text:'新しい',reading:'あたらしい'},{text:'資格',reading:'しかく'},{text:'勉強',reading:'べんきょう'},{text:'始めた',reading:'はじめた'}] },
    ], similarGrammarIds:['g_n3_111'], tags:['계기'] },

  { id:'g_n2_7', level:'N2', pattern:'〜からすると', meaningKo:'〜로 보면/〜로 판단하면',
    explanation:'어떤 입장·근거에서 판단함 — 「結果からすると成功だ」. 「〜からすれば」도 같은 뜻. 판단의 출발점을 제시한다.',
    examples:[
      { ja:'今の情勢からすると、回復には時間がかかる。', ko:'지금 정세로 보면 회복에는 시간이 걸린다.',
        readings:[{text:'今',reading:'いま'},{text:'情勢',reading:'じょうせい'},{text:'回復',reading:'かいふく'},{text:'時間',reading:'じかん'}] },
    ], similarGrammarIds:['g_n3_10'], tags:['판단'] },

  { id:'g_n2_8', level:'N2', pattern:'〜ことなしに', meaningKo:'〜하지 않고는',
    explanation:'그것을 하지 않으면 뒤의 일도 이루어지지 않음 — 「努力することなしに成功はない」. 문어적인 ないで의 강조.',
    examples:[
      { ja:'人と関わることなしに、成長はできない。', ko:'사람과 관계하지 않고는 성장할 수 없다.',
        readings:[{text:'人',reading:'ひと'},{text:'関わる',reading:'かかわる'},{text:'成長',reading:'せいちょう'}] },
    ], similarGrammarIds:['g_n3_120'], tags:['조건'] },

  { id:'g_n2_9', level:'N2', pattern:'〜抜きには', meaningKo:'〜없이는',
    explanation:'그것을 빼고는 성립하지 않음 — 「協力抜きには進められない」. 「〜抜きで」의 강조 형태로, 필수 조건을 나타낸다.',
    examples:[
      { ja:'みんなの協力抜きには、この計画は実現できない。', ko:'모두의 협력 없이는 이 계획은 실현할 수 없다.',
        readings:[{text:'協力',reading:'きょうりょく'},{text:'計画',reading:'けいかく'},{text:'実現',reading:'じつげん'}] },
    ], similarGrammarIds:['g_n3_112'], tags:['조건'] },

  { id:'g_n2_10', level:'N2', pattern:'〜にこたえて', meaningKo:'〜에 부응하여',
    explanation:'요구·기대에 맞춰 행동함 — 「期待にこたえて結果を出す」. 요청·성원에 응답한다는 긍정적 뉘앙스.',
    examples:[
      { ja:'住民の要望にこたえて、施設を増やした。', ko:'주민의 요망에 부응하여 시설을 늘렸다.',
        readings:[{text:'住民',reading:'じゅうみん'},{text:'要望',reading:'ようぼう'},{text:'施設',reading:'しせつ'},{text:'増やした',reading:'ふやした'}] },
    ], similarGrammarIds:['g_n2_4'], tags:['대응'] },

  { id:'g_n2_11', level:'N2', pattern:'〜をもって', meaningKo:'〜로써/〜로 (수단·시점)',
    explanation:'수단·기준, 또는 일이 끝나는 시점을 격식 있게 나타냄 — 「本日をもって終了」「実力をもって示す」.',
    examples:[
      { ja:'本日をもって、受付を終了します。', ko:'오늘로써 접수를 종료합니다.',
        readings:[{text:'本日',reading:'ほんじつ'},{text:'受付',reading:'うけつけ'},{text:'終了',reading:'しゅうりょう'}] },
    ], similarGrammarIds:['g_n2_4'], tags:['수단'] },

  { id:'g_n2_12', level:'N2', pattern:'〜にわたって', meaningKo:'〜에 걸쳐',
    explanation:'시간·범위·횟수의 전체에 미침 — 「三日にわたって行われた」. にかけて보다 "전 범위에 두루"라는 폭을 강조.',
    examples:[
      { ja:'調査は半年にわたって続けられた。', ko:'조사는 반년에 걸쳐 계속되었다.',
        readings:[{text:'調査',reading:'ちょうさ'},{text:'半年',reading:'はんとし'},{text:'続けられた',reading:'つづけられた'}] },
    ], similarGrammarIds:['g_n3_109'], tags:['범위'] },

  { id:'g_n2_13', level:'N2', pattern:'〜を問わず', meaningKo:'〜을 불문하고',
    explanation:'그것에 관계없이 모두 해당됨 — 「年齢を問わず参加できる」. 조건을 따지지 않음을 나타낸다.',
    examples:[
      { ja:'経験を問わず、誰でも応募できます。', ko:'경험을 불문하고 누구나 응모할 수 있습니다.',
        readings:[{text:'経験',reading:'けいけん'},{text:'誰',reading:'だれ'},{text:'応募',reading:'おうぼ'}] },
    ], similarGrammarIds:['g_n3_13'], tags:['무관'] },

  { id:'g_n2_14', level:'N2', pattern:'〜はもとより', meaningKo:'〜은 물론',
    explanation:'당연한 것에 더해 다른 것까지 미침 — 「子供はもとより大人も楽しめる」. はもちろん의 문어체.',
    examples:[
      { ja:'味はもとより、見た目も大切だ。', ko:'맛은 물론 겉모습도 중요하다.',
        readings:[{text:'味',reading:'あじ'},{text:'見た目',reading:'みため'},{text:'大切',reading:'たいせつ'}] },
    ], similarGrammarIds:['g_n3_37'], tags:['추가'] },

  { id:'g_n2_15', level:'N2', pattern:'〜ところを', meaningKo:'〜인데(도)/〜하는 중에',
    explanation:'상대의 사정에 양해를 구하거나, 어떤 상황의 한가운데를 나타냄 — 「お忙しいところをすみません」.',
    examples:[
      { ja:'お忙しいところを、ありがとうございます。', ko:'바쁘신데도 감사합니다.',
        readings:[{text:'忙しい',reading:'いそがしい'}] },
    ], similarGrammarIds:['g_n3_57'], tags:['배려'] },

  { id:'g_n2_16', level:'N2', pattern:'〜ずにはいられない', meaningKo:'〜하지 않을 수 없다',
    explanation:'감정·충동을 억누르지 못하고 그렇게 함 — 「感動して泣かずにはいられない」. 자연스레 그리 된다는 강한 심정.',
    examples:[
      { ja:'あの映画は、もう一度見ずにはいられない。', ko:'그 영화는 한 번 더 보지 않을 수 없다.',
        readings:[{text:'映画',reading:'えいが'},{text:'一度',reading:'いちど'},{text:'見ず',reading:'みず'}] },
    ], similarGrammarIds:['g_n3_36'], tags:['심정'] },

  { id:'g_n2_17', level:'N2', pattern:'〜てからでないと', meaningKo:'〜하고 나서가 아니면',
    explanation:'먼저 그것을 하지 않으면 다음이 불가능 — 「確認してからでないと進めない」. 전제 조건을 나타낸다.',
    examples:[
      { ja:'内容を把握してからでないと、判断できない。', ko:'내용을 파악하고 나서가 아니면 판단할 수 없다.',
        readings:[{text:'内容',reading:'ないよう'},{text:'把握',reading:'はあく'},{text:'判断',reading:'はんだん'}] },
    ], similarGrammarIds:['g_n3_84'], tags:['조건'] },

  { id:'g_n2_18', level:'N2', pattern:'〜以上(は)', meaningKo:'〜한 이상(은)',
    explanation:'그렇게 된 이상 당연히 그래야 함 — 「約束した以上は守る」. からには와 비슷한 결의·당연의 뉘앙스.',
    examples:[
      { ja:'引き受けた以上、最後まで責任を持つ。', ko:'맡은 이상 끝까지 책임을 진다.',
        readings:[{text:'引き受けた',reading:'ひきうけた'},{text:'以上',reading:'いじょう'},{text:'最後',reading:'さいご'},{text:'責任',reading:'せきにん'},{text:'持つ',reading:'もつ'}] },
    ], similarGrammarIds:['g_n3_113'], tags:['당연'] },

  { id:'g_n2_19', level:'N2', pattern:'〜とはいえ', meaningKo:'〜라고는 해도',
    explanation:'앞을 인정하면서도 그것만으로는 부족함을 나타내는 역접 — 「春とはいえ、まだ寒い」.',
    examples:[
      { ja:'便利だとはいえ、使いすぎには注意したい。', ko:'편리하다고는 해도 너무 많이 쓰는 것은 주의하고 싶다.',
        readings:[{text:'便利',reading:'べんり'},{text:'使いすぎ',reading:'つかいすぎ'},{text:'注意',reading:'ちゅうい'}] },
    ], similarGrammarIds:['g_n3_72'], tags:['역접'] },

  { id:'g_n2_20', level:'N2', pattern:'〜つつも', meaningKo:'〜하면서도',
    explanation:'그렇게 생각·행동하면서도 반대되는 결과가 됨 — 「悪いと知りつつも続けた」. つつ의 역접 강조.',
    examples:[
      { ja:'やめようと思いつつも、つい続けてしまう。', ko:'그만두려고 생각하면서도 그만 계속하게 된다.',
        readings:[{text:'思い',reading:'おもい'},{text:'続けて',reading:'つづけて'}] },
    ], similarGrammarIds:['g_n3_88'], tags:['역접'] },

  { id:'g_n2_21', level:'N2', pattern:'〜だけのことはある', meaningKo:'〜할 만하다/과연 〜답다',
    explanation:'그만한 가치·이유가 있어 납득됨 — 「人気があるだけのことはある」. 감탄·평가의 뉘앙스.',
    examples:[
      { ja:'長年練習しただけのことはある、見事な演奏だ。', ko:'오랜 세월 연습한 만큼, 훌륭한 연주다.',
        readings:[{text:'長年',reading:'ながねん'},{text:'練習',reading:'れんしゅう'},{text:'見事',reading:'みごと'},{text:'演奏',reading:'えんそう'}] },
    ], similarGrammarIds:['g_n3_119'], tags:['평가'] },

  { id:'g_n2_22', level:'N2', pattern:'〜ものなら', meaningKo:'〜할 수 있다면',
    explanation:'실현이 어려운 일을 가정함 — 「戻れるものなら戻りたい」. 가능 동사에 붙어 강한 바람·아쉬움을 나타낸다.',
    examples:[
      { ja:'できるものなら、もう一度やり直したい。', ko:'할 수 있다면 한 번 더 다시 하고 싶다.',
        readings:[{text:'一度',reading:'いちど'},{text:'直したい',reading:'なおしたい'}] },
    ], similarGrammarIds:['g_n3_33'], tags:['가정'] },

  { id:'g_n2_23', level:'N2', pattern:'〜ないことには', meaningKo:'〜하지 않고서는',
    explanation:'어떤 일을 하지 않으면 그 다음이 성립하지 않음 — 「やってみないことには分からない」. 부정 조건.',
    examples:[
      { ja:'実際に使ってみないことには、良さは分からない。', ko:'실제로 써 보지 않고서는 좋은 점을 알 수 없다.',
        readings:[{text:'実際',reading:'じっさい'},{text:'使って',reading:'つかって'},{text:'良さ',reading:'よさ'},{text:'分からない',reading:'わからない'}] },
    ], similarGrammarIds:['g_n2_8'], tags:['조건'] },

  { id:'g_n2_24', level:'N2', pattern:'〜にもかかわらず', meaningKo:'〜에도 불구하고',
    explanation:'예상과 반대되는 결과가 일어남 — 「努力したにもかかわらず」. 강한 역접.',
    examples:[
      { ja:'雨にもかかわらず、大勢の人が集まった。', ko:'비에도 불구하고 많은 사람이 모였다.',
        readings:[{text:'雨',reading:'あめ'},{text:'大勢',reading:'おおぜい'},{text:'人',reading:'ひと'},{text:'集まった',reading:'あつまった'}] },
    ], similarGrammarIds:['g_n2_19'], tags:['역접'] },

  { id:'g_n2_25', level:'N2', pattern:'〜どころか', meaningKo:'〜은커녕',
    explanation:'예상을 크게 벗어나 정반대임을 강조 — 「楽になるどころか」.',
    examples:[
      { ja:'楽になるどころか、仕事が増えてしまった。', ko:'편해지기는커녕 일이 늘어 버렸다.',
        readings:[{text:'楽',reading:'らく'},{text:'仕事',reading:'しごと'},{text:'増えて',reading:'ふえて'}] },
    ], similarGrammarIds:['g_n2_30'], tags:['대조'] },

  { id:'g_n2_26', level:'N2', pattern:'〜かのようだ', meaningKo:'마치 〜인 것 같다',
    explanation:'사실이 아닌데 그런 것처럼 보이거나 행동함 — 「まるで夢かのようだ」. 비유.',
    examples:[
      { ja:'彼はまるで何も知らなかったかのように話した。', ko:'그는 마치 아무것도 몰랐던 것처럼 말했다.',
        readings:[{text:'彼',reading:'かれ'},{text:'何',reading:'なに'},{text:'知らなかった',reading:'しらなかった'},{text:'話した',reading:'はなした'}] },
    ], similarGrammarIds:['g_n2_7'], tags:['비유'] },

  { id:'g_n2_27', level:'N2', pattern:'〜に限らず', meaningKo:'〜에 한하지 않고',
    explanation:'그것만이 아니라 더 넓은 범위에 해당함 — 「週末に限らず」.',
    examples:[
      { ja:'この店は週末に限らず、平日も混んでいる。', ko:'이 가게는 주말뿐 아니라 평일도 붐빈다.',
        readings:[{text:'店',reading:'みせ'},{text:'週末',reading:'しゅうまつ'},{text:'限らず',reading:'かぎらず'},{text:'平日',reading:'へいじつ'},{text:'混んで',reading:'こんで'}] },
    ], similarGrammarIds:['g_n2_13','g_n2_14'], tags:['범위'] },

  { id:'g_n2_28', level:'N2', pattern:'〜次第で', meaningKo:'〜에 따라/〜나름으로',
    explanation:'무엇에 좌우되어 결과가 달라짐 — 「考え方次第で」.',
    examples:[
      { ja:'やり方次第で、結果は大きく変わる。', ko:'방식에 따라 결과는 크게 달라진다.',
        readings:[{text:'方',reading:'かた'},{text:'結果',reading:'けっか'},{text:'大きく',reading:'おおきく'},{text:'変わる',reading:'かわる'}] },
    ], similarGrammarIds:['g_n2_4'], tags:['조건'] },

  { id:'g_n2_29', level:'N2', pattern:'〜上で', meaningKo:'〜한 뒤에/〜함에 있어서',
    explanation:'먼저 어떤 일을 하고 그 결과를 바탕으로 함 — 「確認した上で」.',
    examples:[
      { ja:'内容をよく確認した上で、署名してください。', ko:'내용을 잘 확인한 뒤에 서명해 주세요.',
        readings:[{text:'内容',reading:'ないよう'},{text:'確認',reading:'かくにん'},{text:'署名',reading:'しょめい'}] },
    ], similarGrammarIds:['g_n2_3'], tags:['순서'] },

  { id:'g_n2_30', level:'N2', pattern:'〜ばかりか', meaningKo:'〜뿐만 아니라 (게다가)',
    explanation:'그것만이 아니라 더한 것까지 더해짐 — 「失敗したばかりか」. 점층.',
    examples:[
      { ja:'彼は遅刻したばかりか、謝りもしなかった。', ko:'그는 지각했을 뿐만 아니라 사과조차 하지 않았다.',
        readings:[{text:'彼',reading:'かれ'},{text:'遅刻',reading:'ちこく'},{text:'謝り',reading:'あやまり'}] },
    ], similarGrammarIds:['g_n2_25','g_n2_14'], tags:['점층'] },

  { id:'g_n2_31', level:'N2', pattern:'〜にしろ', meaningKo:'〜이든/〜라 하더라도',
    explanation:'어느 쪽이든 상관없이 성립함 — 「行くにしろ行かないにしろ」.',
    examples:[
      { ja:'行くにしろ行かないにしろ、連絡はすべきだ。', ko:'가든 안 가든 연락은 해야 한다.',
        readings:[{text:'行く',reading:'いく'},{text:'行かない',reading:'いかない'},{text:'連絡',reading:'れんらく'}] },
    ], similarGrammarIds:['g_n2_32'], tags:['양보'] },

  { id:'g_n2_32', level:'N2', pattern:'〜にせよ', meaningKo:'〜이든/〜라 할지라도',
    explanation:'어떤 경우라도 마찬가지임 — 「いずれにせよ」. にしろ의 문어형.',
    examples:[
      { ja:'どんな理由にせよ、暴力は許されない。', ko:'어떤 이유든 폭력은 용납되지 않는다.',
        readings:[{text:'理由',reading:'りゆう'},{text:'暴力',reading:'ぼうりょく'},{text:'許されない',reading:'ゆるされない'}] },
    ], similarGrammarIds:['g_n2_31'], tags:['양보'] },

  { id:'g_n2_33', level:'N2', pattern:'〜のもとで', meaningKo:'〜하에서/〜아래서',
    explanation:'어떤 조건·영향·지도 아래에서 — 「先生の指導のもとで」.',
    examples:[
      { ja:'専門家の指導のもとで、研究を進めた。', ko:'전문가의 지도 아래 연구를 진행했다.',
        readings:[{text:'専門家',reading:'せんもんか'},{text:'指導',reading:'しどう'},{text:'研究',reading:'けんきゅう'},{text:'進めた',reading:'すすめた'}] },
    ], similarGrammarIds:['g_n2_38'], tags:['조건'] },

  { id:'g_n2_34', level:'N2', pattern:'〜にもまして', meaningKo:'〜보다 더욱',
    explanation:'이전이나 다른 것보다 한층 더함 — 「以前にもまして」.',
    examples:[
      { ja:'今年は去年にもまして暑い。', ko:'올해는 작년보다 더욱 덥다.',
        readings:[{text:'今年',reading:'ことし'},{text:'去年',reading:'きょねん'},{text:'暑い',reading:'あつい'}] },
    ], similarGrammarIds:['g_n2_35'], tags:['비교'] },

  { id:'g_n2_35', level:'N2', pattern:'〜にひきかえ', meaningKo:'〜와는 반대로',
    explanation:'앞의 것과 크게 대조됨 — 「兄にひきかえ弟は」.',
    examples:[
      { ja:'去年の不調にひきかえ、今年は好調だ。', ko:'작년의 부진과는 반대로 올해는 호조다.',
        readings:[{text:'去年',reading:'きょねん'},{text:'不調',reading:'ふちょう'},{text:'今年',reading:'ことし'},{text:'好調',reading:'こうちょう'}] },
    ], similarGrammarIds:['g_n2_34'], tags:['대조'] },

  { id:'g_n2_36', level:'N2', pattern:'〜とあれば', meaningKo:'〜라면 (특별한 상황)',
    explanation:'특별한 사정이나 조건이라면 당연히 그렇게 함 — 「子供のためとあれば」.',
    examples:[
      { ja:'お客様のためとあれば、休日でも対応する。', ko:'손님을 위해서라면 휴일이라도 대응한다.',
        readings:[{text:'客様',reading:'きゃくさま'},{text:'休日',reading:'きゅうじつ'},{text:'対応',reading:'たいおう'}] },
    ], similarGrammarIds:['g_n2_18'], tags:['조건'] },

  { id:'g_n2_37', level:'N2', pattern:'〜てこそ', meaningKo:'〜해야 비로소',
    explanation:'그렇게 해야만 진정한 의미·가치가 있음 — 「努力してこそ」.',
    examples:[
      { ja:'苦労してこそ、成功の喜びがわかる。', ko:'고생을 해야 비로소 성공의 기쁨을 안다.',
        readings:[{text:'苦労',reading:'くろう'},{text:'成功',reading:'せいこう'},{text:'喜び',reading:'よろこび'}] },
    ], similarGrammarIds:['g_n2_17'], tags:['강조'] },

  { id:'g_n2_38', level:'N2', pattern:'〜にあって', meaningKo:'〜에 처해/〜인 상황에서',
    explanation:'특별한 시기·장소·상황에 놓여 — 「非常時にあって」.',
    examples:[
      { ja:'この困難な時期にあって、冷静さが求められる。', ko:'이 어려운 시기에 처해 냉정함이 요구된다.',
        readings:[{text:'困難',reading:'こんなん'},{text:'時期',reading:'じき'},{text:'冷静',reading:'れいせい'},{text:'求められる',reading:'もとめられる'}] },
    ], similarGrammarIds:['g_n2_33'], tags:['상황'] },

  { id:'g_n2_39', level:'N2', pattern:'〜ところに', meaningKo:'〜하는 참에/〜하던 차에',
    explanation:'마침 그 순간에 다른 일이 일어남 — 「出かけるところに」.',
    examples:[
      { ja:'出かけようとしたところに、電話が鳴った。', ko:'나가려던 참에 전화가 울렸다.',
        readings:[{text:'出かけ',reading:'でかけ'},{text:'電話',reading:'でんわ'},{text:'鳴った',reading:'なった'}] },
    ], similarGrammarIds:['g_n2_15'], tags:['시점'] },

  { id:'g_n2_40', level:'N2', pattern:'〜ことだし', meaningKo:'〜하기도 하니',
    explanation:'여러 이유 중 하나를 가볍게 들어 근거로 삼음 — 「天気もいいことだし」.',
    examples:[
      { ja:'雨も止んだことだし、そろそろ出かけよう。', ko:'비도 그쳤으니 슬슬 나가자.',
        readings:[{text:'雨',reading:'あめ'},{text:'止んだ',reading:'やんだ'},{text:'出かけ',reading:'でかけ'}] },
    ], similarGrammarIds:['g_n3_88'], tags:['이유'] },

  { id:'g_n2_41', level:'N2', pattern:'〜に際して', meaningKo:'〜할 때에/〜에 즈음하여',
    explanation:'중요한 일을 하는 그 시점을 나타냄 — 「開会に際して」. 격식체.',
    examples:[
      { ja:'開会に際して、一言ごあいさつを申し上げます。', ko:'개회에 즈음하여 한 말씀 인사드립니다.',
        readings:[{text:'開会',reading:'かいかい'},{text:'一言',reading:'ひとこと'},{text:'申し上げます',reading:'もうしあげます'}] },
    ], similarGrammarIds:['g_n2_3'], tags:['시점'] },

  { id:'g_n2_42', level:'N2', pattern:'〜に基づいて', meaningKo:'〜에 근거하여',
    explanation:'어떤 것을 토대·근거로 삼음 — 「事実に基づいて」.',
    examples:[
      { ja:'調査の結果に基づいて、対策を立てる。', ko:'조사 결과에 근거하여 대책을 세운다.',
        readings:[{text:'調査',reading:'ちょうさ'},{text:'結果',reading:'けっか'},{text:'基づいて',reading:'もとづいて'},{text:'対策',reading:'たいさく'},{text:'立てる',reading:'たてる'}] },
    ], similarGrammarIds:['g_n2_7'], tags:['근거'] },

  { id:'g_n2_43', level:'N2', pattern:'〜をめぐって', meaningKo:'〜을 둘러싸고',
    explanation:'어떤 일을 중심으로 대립·논의가 일어남 — 「制度をめぐって」.',
    examples:[
      { ja:'新しい制度をめぐって、議論が続いている。', ko:'새 제도를 둘러싸고 논의가 계속되고 있다.',
        readings:[{text:'新しい',reading:'あたらしい'},{text:'制度',reading:'せいど'},{text:'議論',reading:'ぎろん'},{text:'続いて',reading:'つづいて'}] },
    ], similarGrammarIds:['g_n3_11'], tags:['주제'] },

  { id:'g_n2_44', level:'N2', pattern:'〜にかけては', meaningKo:'〜에 관해서는(능력)',
    explanation:'그 분야의 능력만큼은 뛰어남 — 「料理にかけては」.',
    examples:[
      { ja:'記憶力にかけては、誰にも負けない。', ko:'기억력에 관해서는 누구에게도 지지 않는다.',
        readings:[{text:'記憶力',reading:'きおくりょく'},{text:'誰',reading:'だれ'},{text:'負けない',reading:'まけない'}] },
    ], similarGrammarIds:['g_n2_7'], tags:['능력'] },

  { id:'g_n2_45', level:'N2', pattern:'〜にしたがい', meaningKo:'〜에 따라',
    explanation:'한쪽의 변화에 맞춰 다른 쪽도 변함 — 「進むにしたがい」.',
    examples:[
      { ja:'時代が進むにしたがい、価値観も変わる。', ko:'시대가 진행됨에 따라 가치관도 변한다.',
        readings:[{text:'時代',reading:'じだい'},{text:'進む',reading:'すすむ'},{text:'価値観',reading:'かちかん'},{text:'変わる',reading:'かわる'}] },
    ], similarGrammarIds:['g_n2_2'], tags:['변화'] },

  { id:'g_n2_46', level:'N2', pattern:'〜につき', meaningKo:'〜당/〜이므로',
    explanation:'단위당 또는 이유를 나타냄 — 「一人につき」.',
    examples:[
      { ja:'一人につき二枚まで配る。', ko:'한 사람당 두 장까지 나눠 준다.',
        readings:[{text:'一人',reading:'ひとり'},{text:'二枚',reading:'にまい'},{text:'配る',reading:'くばる'}] },
    ], similarGrammarIds:['g_n3_6'], tags:['기준'] },

  { id:'g_n2_47', level:'N2', pattern:'〜ぶり', meaningKo:'〜만에/〜하는 모습',
    explanation:'시간 간격이나 모습·방식을 나타냄 — 「三年ぶり」.',
    examples:[
      { ja:'三年ぶりに故郷へ帰った。', ko:'3년 만에 고향에 돌아갔다.',
        readings:[{text:'三年',reading:'さんねん'},{text:'故郷',reading:'こきょう'},{text:'帰った',reading:'かえった'}] },
    ], similarGrammarIds:['g_n2_47'], tags:['시간'] },

  { id:'g_n2_48', level:'N2', pattern:'〜かたわら', meaningKo:'〜하는 한편',
    explanation:'주된 일을 하면서 다른 일도 병행함 — 「仕事のかたわら」. 문어적.',
    examples:[
      { ja:'会社で働くかたわら、小説を書いている。', ko:'회사에서 일하는 한편 소설을 쓰고 있다.',
        readings:[{text:'会社',reading:'かいしゃ'},{text:'働く',reading:'はたらく'},{text:'小説',reading:'しょうせつ'},{text:'書いて',reading:'かいて'}] },
    ], similarGrammarIds:['g_n3_89'], tags:['병행'] },

  { id:'g_n2_49', level:'N2', pattern:'〜がてら', meaningKo:'〜하는 김에',
    explanation:'한 동작을 하는 김에 다른 일도 함 — 「散歩がてら」.',
    examples:[
      { ja:'散歩がてら、買い物をしてきた。', ko:'산책하는 김에 장을 보고 왔다.',
        readings:[{text:'散歩',reading:'さんぽ'},{text:'買い物',reading:'かいもの'}] },
    ], similarGrammarIds:['g_n2_49'], tags:['겸용'] },

  { id:'g_n2_50', level:'N2', pattern:'〜かたがた', meaningKo:'〜할 겸',
    explanation:'한 가지 목적과 함께 다른 목적도 겸함 — 「お礼かたがた」. 격식체.',
    examples:[
      { ja:'お礼かたがた、ご報告に伺います。', ko:'감사 인사 겸 보고하러 찾아뵙겠습니다.',
        readings:[{text:'礼',reading:'れい'},{text:'報告',reading:'ほうこく'},{text:'伺います',reading:'うかがいます'}] },
    ], similarGrammarIds:['g_n2_49'], tags:['겸용'] },

  { id:'g_n2_51', level:'N2', pattern:'〜わけだ', meaningKo:'〜인 셈이다',
    explanation:'앞 내용으로부터 당연한 결론·이유를 납득함 — 「道理で寒いわけだ」.',
    examples:[
      { ja:'雪が降っている。道理で寒いわけだ。', ko:'눈이 내리고 있다. 어쩐지 추운 셈이다.',
        readings:[{text:'雪',reading:'ゆき'},{text:'降って',reading:'ふって'},{text:'道理',reading:'どうり'},{text:'寒い',reading:'さむい'}] },
    ], similarGrammarIds:['g_n2_52'], tags:['결론'] },

  { id:'g_n2_52', level:'N2', pattern:'〜わけがない', meaningKo:'〜할 리가 없다',
    explanation:'그럴 가능성이 전혀 없음을 강하게 부정 — 「できるわけがない」.',
    examples:[
      { ja:'そんな簡単な話であるわけがない。', ko:'그렇게 간단한 이야기일 리가 없다.',
        readings:[{text:'簡単',reading:'かんたん'},{text:'話',reading:'はなし'}] },
    ], similarGrammarIds:['g_n2_51'], tags:['부정'] },

  { id:'g_n2_53', level:'N2', pattern:'〜まい', meaningKo:'〜하지 않겠다/〜하지 않을 것이다',
    explanation:'부정의 의지나 부정의 추측 — 「二度と行くまい」. 문어적.',
    examples:[
      { ja:'同じ失敗は二度とするまいと誓う。', ko:'같은 실수는 두 번 다시 하지 않겠다고 다짐한다.',
        readings:[{text:'同じ',reading:'おなじ'},{text:'失敗',reading:'しっぱい'},{text:'二度と',reading:'にどと'},{text:'誓う',reading:'ちかう'}] },
    ], similarGrammarIds:['g_n2_22'], tags:['의지'] },

  { id:'g_n2_54', level:'N2', pattern:'〜ものがある', meaningKo:'〜한 데가 있다',
    explanation:'어떤 느낌·가치가 분명히 느껴짐 — 「心を打つものがある」.',
    examples:[
      { ja:'彼の演奏には心を打つものがある。', ko:'그의 연주에는 마음을 울리는 데가 있다.',
        readings:[{text:'彼',reading:'かれ'},{text:'演奏',reading:'えんそう'},{text:'心',reading:'こころ'},{text:'打つ',reading:'うつ'}] },
    ], similarGrammarIds:['g_n2_21'], tags:['평가'] },

  { id:'g_n2_55', level:'N2', pattern:'〜に限る', meaningKo:'〜이 최고다/〜에 한한다',
    explanation:'그것이 가장 좋다는 단정, 또는 한정 — 「疲れたら寝るに限る」.',
    examples:[
      { ja:'夏は冷たい飲み物に限る。', ko:'여름에는 차가운 음료가 최고다.',
        readings:[{text:'夏',reading:'なつ'},{text:'冷たい',reading:'つめたい'},{text:'飲み物',reading:'のみもの'}] },
    ], similarGrammarIds:['g_n2_27'], tags:['한정'] },

  { id:'g_n2_56', level:'N2', pattern:'〜にすぎない', meaningKo:'〜에 지나지 않는다',
    explanation:'단지 그 정도일 뿐이라고 낮춤 — 「言い訳にすぎない」.',
    examples:[
      { ja:'それは口実にすぎない。', ko:'그것은 핑계에 지나지 않는다.',
        readings:[{text:'口実',reading:'こうじつ'}] },
    ], similarGrammarIds:['g_n2_57'], tags:['한정'] },

  { id:'g_n2_57', level:'N2', pattern:'〜にほかならない', meaningKo:'바로 〜이다',
    explanation:'다름 아닌 그것이라고 단정 — 「努力の成果にほかならない」.',
    examples:[
      { ja:'成功は努力の成果にほかならない。', ko:'성공은 다름 아닌 노력의 결과다.',
        readings:[{text:'成功',reading:'せいこう'},{text:'努力',reading:'どりょく'},{text:'成果',reading:'せいか'}] },
    ], similarGrammarIds:['g_n2_56'], tags:['단정'] },

  { id:'g_n2_58', level:'N2', pattern:'〜ともなく', meaningKo:'무심코 〜하다',
    explanation:'뚜렷한 의도 없이 어떤 동작을 함 — 「見るともなく見る」.',
    examples:[
      { ja:'見るともなく外を眺めていた。', ko:'무심코 밖을 바라보고 있었다.',
        readings:[{text:'見る',reading:'みる'},{text:'外',reading:'そと'},{text:'眺めて',reading:'ながめて'}] },
    ], similarGrammarIds:['g_n2_39'], tags:['양태'] },

  { id:'g_n2_59', level:'N2', pattern:'〜にしてみれば', meaningKo:'〜의 입장에서는',
    explanation:'상대의 입장·관점에서 보면 — 「子供にしてみれば」.',
    examples:[
      { ja:'親にしてみれば、心配なのは当然だ。', ko:'부모 입장에서는 걱정인 것이 당연하다.',
        readings:[{text:'親',reading:'おや'},{text:'心配',reading:'しんぱい'},{text:'当然',reading:'とうぜん'}] },
    ], similarGrammarIds:['g_n2_7'], tags:['관점'] },

  { id:'g_n2_60', level:'N2', pattern:'〜たって', meaningKo:'〜해도/〜라고 해도',
    explanation:'「ても」의 회화체 역접 — 「急いだって間に合わない」.',
    examples:[
      { ja:'今さら謝ったって、もう遅い。', ko:'이제 와서 사과해도 이미 늦었다.',
        readings:[{text:'今さら',reading:'いまさら'},{text:'謝った',reading:'あやまった'},{text:'遅い',reading:'おそい'}] },
    ], similarGrammarIds:['g_n2_19'], tags:['역접'] },

  { id:'g_n2_61', level:'N2', pattern:'〜ところで', meaningKo:'〜해 봤자',
    explanation:'아무리 해도 소용없음을 나타냄 — 「急いだところで」.',
    examples:[
      { ja:'いくら悔やんだところで、結果は変わらない。', ko:'아무리 후회해 봤자 결과는 바뀌지 않는다.',
        readings:[{text:'悔やんだ',reading:'くやんだ'},{text:'結果',reading:'けっか'},{text:'変わらない',reading:'かわらない'}] },
    ], similarGrammarIds:['g_n2_60'], tags:['역접'] },

  { id:'g_n2_62', level:'N2', pattern:'〜ぐるみ', meaningKo:'〜째/〜전체',
    explanation:'전체를 통째로 포함함 — 「家族ぐるみ」「町ぐるみ」.',
    examples:[
      { ja:'地域ぐるみで子供を見守る。', ko:'지역 전체가 아이를 돌본다.',
        readings:[{text:'地域',reading:'ちいき'},{text:'子供',reading:'こども'},{text:'見守る',reading:'みまもる'}] },
    ], similarGrammarIds:['g_n2_12'], tags:['범위'] },

  { id:'g_n2_63', level:'N2', pattern:'〜ずにすむ', meaningKo:'〜하지 않고 끝나다',
    explanation:'다행히 어떤 일을 하지 않아도 되게 됨 — 「払わずにすむ」.',
    examples:[
      { ja:'早めに直したので、大事にならずにすんだ。', ko:'일찍 고쳐서 큰일이 되지 않고 끝났다.',
        readings:[{text:'早めに',reading:'はやめに'},{text:'直した',reading:'なおした'},{text:'大事',reading:'おおごと'}] },
    ], similarGrammarIds:['g_n2_8'], tags:['결과'] },

  { id:'g_n2_64', level:'N2', pattern:'〜ないではいられない', meaningKo:'〜하지 않을 수 없다',
    explanation:'감정·충동을 억누르지 못함 — 「応援しないではいられない」.',
    examples:[
      { ja:'この光景を見ると、感動しないではいられない。', ko:'이 광경을 보면 감동하지 않을 수 없다.',
        readings:[{text:'光景',reading:'こうけい'},{text:'見る',reading:'みる'},{text:'感動',reading:'かんどう'}] },
    ], similarGrammarIds:['g_n2_16'], tags:['감정'] },

  { id:'g_n2_65', level:'N2', pattern:'〜に即して', meaningKo:'〜에 입각하여',
    explanation:'실정·규칙에 맞춰 — 「実情に即して」.',
    examples:[
      { ja:'現実に即して計画を見直す。', ko:'현실에 입각하여 계획을 재검토한다.',
        readings:[{text:'現実',reading:'げんじつ'},{text:'計画',reading:'けいかく'},{text:'見直す',reading:'みなおす'}] },
    ], similarGrammarIds:['g_n2_42'], tags:['근거'] },

  { id:'g_n2_66', level:'N2', pattern:'〜をおいて', meaningKo:'〜을 제외하고는',
    explanation:'그것 말고 달리 없음 — 「彼をおいてほかにいない」.',
    examples:[
      { ja:'この役は彼をおいて、ほかにいない。', ko:'이 역할은 그 사람 말고는 달리 없다.',
        readings:[{text:'役',reading:'やく'},{text:'彼',reading:'かれ'}] },
    ], similarGrammarIds:['g_n2_55'], tags:['한정'] },

  { id:'g_n2_67', level:'N2', pattern:'〜なりに', meaningKo:'〜나름대로',
    explanation:'그 입장·능력에 맞는 방식으로 — 「自分なりに」.',
    examples:[
      { ja:'子供なりに一生懸命考えた。', ko:'아이 나름대로 열심히 생각했다.',
        readings:[{text:'子供',reading:'こども'},{text:'一生懸命',reading:'いっしょうけんめい'},{text:'考えた',reading:'かんがえた'}] },
    ], similarGrammarIds:['g_n2_68'], tags:['양태'] },

  { id:'g_n2_68', level:'N2', pattern:'〜なりの', meaningKo:'〜나름의',
    explanation:'그에 어울리는 — 「それなりの理由」.',
    examples:[
      { ja:'新人には新人なりの良さがある。', ko:'신입에게는 신입 나름의 장점이 있다.',
        readings:[{text:'新人',reading:'しんじん'},{text:'良さ',reading:'よさ'}] },
    ], similarGrammarIds:['g_n2_67'], tags:['양태'] },

  { id:'g_n2_69', level:'N2', pattern:'〜ならではの', meaningKo:'〜만의/〜다운',
    explanation:'그것이 아니면 불가능한 고유함 — 「老舗ならではの味」.',
    examples:[
      { ja:'この店ならではの味が楽しめる。', ko:'이 가게만의 맛을 즐길 수 있다.',
        readings:[{text:'店',reading:'みせ'},{text:'味',reading:'あじ'},{text:'楽しめる',reading:'たのしめる'}] },
    ], similarGrammarIds:['g_n2_52'], tags:['고유'] },

  { id:'g_n2_70', level:'N2', pattern:'〜にかかわる', meaningKo:'〜에 관계되는/〜이 걸린',
    explanation:'중대한 일에 관련됨 — 「命にかかわる」.',
    examples:[
      { ja:'これは信用にかかわる問題だ。', ko:'이것은 신용이 걸린 문제다.',
        readings:[{text:'信用',reading:'しんよう'},{text:'問題',reading:'もんだい'}] },
    ], similarGrammarIds:['g_n3_11'], tags:['관련'] },

  { id:'g_n2_71', level:'N2', pattern:'〜にして', meaningKo:'〜이면서/〜에 이르러',
    explanation:'어떤 단계·자격에서 비로소 — 「五十にして」.',
    examples:[
      { ja:'三度目にして、ようやく成功した。', ko:'세 번째에 이르러 비로소 성공했다.',
        readings:[{text:'三度目',reading:'さんどめ'},{text:'成功',reading:'せいこう'}] },
    ], similarGrammarIds:['g_n2_37'], tags:['시점'] },

  { id:'g_n2_72', level:'N2', pattern:'〜と相まって', meaningKo:'〜와 어우러져',
    explanation:'두 요소가 서로 작용해 효과를 냄 — 「天候と相まって」.',
    examples:[
      { ja:'努力が才能と相まって、成果を生んだ。', ko:'노력이 재능과 어우러져 성과를 낳았다.',
        readings:[{text:'努力',reading:'どりょく'},{text:'才能',reading:'さいのう'},{text:'成果',reading:'せいか'},{text:'生んだ',reading:'うんだ'}] },
    ], similarGrammarIds:['g_n2_14'], tags:['상호작용'] },

  { id:'g_n2_73', level:'N2', pattern:'〜うる', meaningKo:'〜할 수 있다',
    explanation:'가능성이 있음을 나타냄 — 「あり得る」「考えうる」. 문어적.',
    examples:[
      { ja:'誰にでも起こりうる問題だ。', ko:'누구에게나 일어날 수 있는 문제다.',
        readings:[{text:'誰',reading:'だれ'},{text:'起こり',reading:'おこり'},{text:'問題',reading:'もんだい'}] },
    ], similarGrammarIds:['g_n3_90'], tags:['가능'] },

  { id:'g_n2_74', level:'N2', pattern:'〜とばかり', meaningKo:'〜라는 듯이',
    explanation:'말은 안 해도 그런 기색을 강하게 드러냄 — 「待っていたとばかり」.',
    examples:[
      { ja:'チャンスとばかりに前へ出た。', ko:'기회라는 듯이 앞으로 나섰다.',
        readings:[{text:'前',reading:'まえ'},{text:'出た',reading:'でた'}] },
    ], similarGrammarIds:['g_n2_26'], tags:['양태'] },

  { id:'g_n2_75', level:'N2', pattern:'〜ゆえに', meaningKo:'〜때문에',
    explanation:'이유·원인을 나타내는 문어체 — 「若さゆえに」.',
    examples:[
      { ja:'経験が浅いゆえに、失敗も多い。', ko:'경험이 적기 때문에 실패도 많다.',
        readings:[{text:'経験',reading:'けいけん'},{text:'浅い',reading:'あさい'},{text:'失敗',reading:'しっぱい'},{text:'多い',reading:'おおい'}] },
    ], similarGrammarIds:['g_n3_6'], tags:['이유'] },

  { id:'g_n2_76', level:'N2', pattern:'〜のことだから', meaningKo:'〜이니까(평소 성격상)',
    explanation:'그 사람의 평소 성격을 근거로 추측 — 「彼のことだから」.',
    examples:[
      { ja:'まじめな彼のことだから、必ず来る。', ko:'성실한 그 사람이니까 반드시 온다.',
        readings:[{text:'彼',reading:'かれ'},{text:'必ず',reading:'かならず'},{text:'来る',reading:'くる'}] },
    ], similarGrammarIds:['g_n2_40'], tags:['이유'] },

  { id:'g_n2_77', level:'N2', pattern:'〜なくして', meaningKo:'〜없이는',
    explanation:'그것이 없으면 성립하지 않음 — 「努力なくして成功なし」. 문어적.',
    examples:[
      { ja:'信頼なくして協力は得られない。', ko:'신뢰 없이는 협력을 얻을 수 없다.',
        readings:[{text:'信頼',reading:'しんらい'},{text:'協力',reading:'きょうりょく'},{text:'得られない',reading:'えられない'}] },
    ], similarGrammarIds:['g_n2_23'], tags:['조건'] },

  { id:'g_n2_78', level:'N2', pattern:'〜であろうと', meaningKo:'〜라 할지라도',
    explanation:'어떤 경우라도 상관없음 — 「どんな理由であろうと」.',
    examples:[
      { ja:'どんな立場であろうと、規則は守るべきだ。', ko:'어떤 입장이라 할지라도 규칙은 지켜야 한다.',
        readings:[{text:'立場',reading:'たちば'},{text:'規則',reading:'きそく'},{text:'守る',reading:'まもる'}] },
    ], similarGrammarIds:['g_n2_32'], tags:['양보'] },

  { id:'g_n2_79', level:'N2', pattern:'〜とはいうものの', meaningKo:'〜라고는 하지만',
    explanation:'앞을 인정하면서 실제는 다름 — 「便利とはいうものの」.',
    examples:[
      { ja:'休みとはいうものの、仕事が気になる。', ko:'휴일이라고는 하지만 일이 신경 쓰인다.',
        readings:[{text:'休み',reading:'やすみ'},{text:'仕事',reading:'しごと'},{text:'気になる',reading:'きになる'}] },
    ], similarGrammarIds:['g_n2_19'], tags:['역접'] },

  { id:'g_n2_80', level:'N2', pattern:'〜に至るまで', meaningKo:'〜에 이르기까지',
    explanation:'범위가 끝까지 미침을 강조 — 「服装から言葉に至るまで」.',
    examples:[
      { ja:'服装から言葉づかいに至るまで指導する。', ko:'복장부터 말투에 이르기까지 지도한다.',
        readings:[{text:'服装',reading:'ふくそう'},{text:'言葉',reading:'ことば'},{text:'指導',reading:'しどう'}] },
    ], similarGrammarIds:['g_n2_12'], tags:['범위'] },
  { id:'g_n2_81', level:'N2', pattern:'〜あげく(に)', meaningKo:'〜한 끝에',
    explanation:'오랜 과정 끝의 (대개 부정적) 결과 — 「悩んだあげく」.',
    examples:[ { ja:'さんざん悩んだあげく、退職を決めた。', ko:'한참 고민한 끝에 퇴직을 결정했다.', readings:[{text:'悩',reading:'なや'},{text:'退職',reading:'たいしょく'},{text:'決',reading:'き'}] } ], similarGrammarIds:[], tags:['결과'] },
  { id:'g_n2_82', level:'N2', pattern:'〜さえ〜ば', meaningKo:'〜만 〜하면',
    explanation:'그 조건만 갖추면 충분 — 「資料さえあれば」.',
    examples:[ { ja:'資料さえあれば説明できる。', ko:'자료만 있으면 설명할 수 있다.', readings:[ {text:'資料',reading:'しりょう'}, {text:'説明',reading:'せつめい'} ] } ], similarGrammarIds:['g_n2_88'], tags:['조건'] },
  { id:'g_n2_83', level:'N2', pattern:'〜にかかっている', meaningKo:'〜에 달려 있다',
    explanation:'성패가 그것에 좌우됨 — 「君の努力にかかっている」.',
    examples:[ { ja:'成功は事前の準備にかかっている。', ko:'성공은 사전 준비에 달려 있다.', readings:[{text:'成功',reading:'せいこう'},{text:'事前',reading:'じぜん'},{text:'準備',reading:'じゅんび'}] } ], similarGrammarIds:['g_n2_82'], tags:['조건'] },
  { id:'g_n2_84', level:'N2', pattern:'〜にしたところで', meaningKo:'〜라고 해 봤자',
    explanation:'그렇게 해도 결과는 마찬가지 — 「急いだにしたところで」.',
    examples:[ { ja:'今から急いだにしたところで間に合わない。', ko:'지금부터 서둘러 봤자 시간에 못 맞춘다.', readings:[{text:'今',reading:'いま'},{text:'急',reading:'いそ'},{text:'間',reading:'ま'},{text:'合',reading:'あ'}] } ], similarGrammarIds:[], tags:['양보'] },
  { id:'g_n2_85', level:'N2', pattern:'〜上に', meaningKo:'〜인 데다가',
    explanation:'어떤 것에 더해 — 「安い上に」.',
    examples:[ { ja:'この店は安い上に味も良い。', ko:'이 가게는 싼 데다 맛도 좋다.', readings:[ {text:'店',reading:'みせ'}, {text:'安',reading:'やす'}, {text:'味',reading:'あじ'}, {text:'良',reading:'よ'} ] } ], similarGrammarIds:[], tags:['추가'] },
  { id:'g_n2_86', level:'N2', pattern:'〜もかまわず', meaningKo:'〜도 아랑곳없이',
    explanation:'신경 써야 할 것을 개의치 않음 — 「人目もかまわず」.',
    examples:[ { ja:'人目もかまわず大声で泣いた。', ko:'남의 시선도 아랑곳없이 큰 소리로 울었다.', readings:[{text:'人目',reading:'ひとめ'},{text:'大声',reading:'おおごえ'},{text:'泣',reading:'な'}] } ], similarGrammarIds:[], tags:['무시'] },
  { id:'g_n2_87', level:'N2', pattern:'〜ものと見て', meaningKo:'〜라고 보고',
    explanation:'그렇게 판단하여 — 「事故と見て」.',
    examples:[ { ja:'警察は事件性があるものと見て調べている。', ko:'경찰은 사건성이 있다고 보고 조사하고 있다.', readings:[{text:'警察',reading:'けいさつ'},{text:'事件性',reading:'じけんせい'},{text:'調',reading:'しら'}] } ], similarGrammarIds:[], tags:['추정'] },
  { id:'g_n2_88', level:'N2', pattern:'〜ないかぎり', meaningKo:'〜하지 않는 한',
    explanation:'그 조건이 안 되면 — 「謝らないかぎり」.',
    examples:[ { ja:'本人が謝らないかぎり解決しない。', ko:'본인이 사과하지 않는 한 해결되지 않는다.', readings:[ {text:'本人',reading:'ほんにん'}, {text:'謝',reading:'あやま'}, {text:'解決',reading:'かいけつ'} ] } ], similarGrammarIds:['g_n2_82'], tags:['조건'] },
  { id:'g_n2_89', level:'N2', pattern:'〜越しに', meaningKo:'〜너머로',
    explanation:'사이에 두고 — 「窓越しに」.',
    examples:[ { ja:'ガラス越しに中の様子が見えた。', ko:'유리 너머로 안의 모습이 보였다.', readings:[{text:'越',reading:'こ'},{text:'中',reading:'なか'},{text:'様子',reading:'ようす'},{text:'見',reading:'み'}] } ], similarGrammarIds:[], tags:['상태'] },
  { id:'g_n2_90', level:'N2', pattern:'〜げ', meaningKo:'〜한 듯한',
    explanation:'겉으로 드러나는 기색 — 「不安げ」.',
    examples:[ { ja:'彼女は寂しげな表情をした。', ko:'그녀는 쓸쓸한 듯한 표정을 지었다.', readings:[{text:'彼女',reading:'かのじょ'},{text:'寂',reading:'さび'},{text:'表情',reading:'ひょうじょう'}] } ], similarGrammarIds:[], tags:['양태'] },
  { id:'g_n2_91', level:'N2', pattern:'〜がちだ', meaningKo:'〜하기 일쑤',
    explanation:'그런 경향이 잦음 (부정적) — 「忘れがち」.',
    examples:[ { ja:'最近は曇りがちな天気が続く。', ko:'요즘은 흐린 날씨가 자주 이어진다.', readings:[{text:'最近',reading:'さいきん'},{text:'曇',reading:'くも'},{text:'天気',reading:'てんき'},{text:'続',reading:'つづ'}] } ], similarGrammarIds:[], tags:['경향'] },
  { id:'g_n2_92', level:'N2', pattern:'〜としたら', meaningKo:'〜라고 한다면',
    explanation:'가정 — 「優勝するとしたら」.',
    examples:[ { ja:'もし優勝するとしたら誰だろう。', ko:'만약 우승한다면 누구일까.', readings:[ {text:'優勝',reading:'ゆうしょう'}, {text:'誰',reading:'だれ'} ] } ], similarGrammarIds:['g_n2_96'], tags:['가정'] },
  { id:'g_n2_93', level:'N2', pattern:'〜ためしがない', meaningKo:'〜한 적이 없다',
    explanation:'그런 예가 없음 — 「成功したためしがない」.',
    examples:[ { ja:'彼の予想が当たったためしがない。', ko:'그의 예상이 맞은 적이 없다.', readings:[{text:'彼',reading:'かれ'},{text:'予想',reading:'よそう'},{text:'当',reading:'あ'}] } ], similarGrammarIds:[], tags:['경험'] },
  { id:'g_n2_94', level:'N2', pattern:'〜恐れがある', meaningKo:'〜할 우려가 있다',
    explanation:'부정적 가능성 — 「氾濫する恐れ」.',
    examples:[ { ja:'大雨で川が氾濫する恐れがある。', ko:'폭우로 강이 범람할 우려가 있다.', readings:[ {text:'大雨',reading:'おおあめ'}, {text:'川',reading:'かわ'}, {text:'氾濫',reading:'はんらん'}, {text:'恐',reading:'おそ'} ] } ], similarGrammarIds:[], tags:['가능성'] },
  { id:'g_n2_95', level:'N2', pattern:'〜かけだ', meaningKo:'〜하다 만',
    explanation:'동작이 도중인 상태 — 「読みかけ」.',
    examples:[ { ja:'読みかけの本が机にある。', ko:'읽다 만 책이 책상에 있다.', readings:[ {text:'読',reading:'よ'}, {text:'本',reading:'ほん'}, {text:'机',reading:'つくえ'} ] } ], similarGrammarIds:['g_n2_117'], tags:['상태'] },
  { id:'g_n2_96', level:'N2', pattern:'〜にしたら', meaningKo:'〜의 입장에서는',
    explanation:'상대 입장을 헤아림 — 「親にしたら」.',
    examples:[ { ja:'親にしたら子の将来が心配だ。', ko:'부모 입장에서는 자식의 장래가 걱정이다.', readings:[ {text:'親',reading:'おや'}, {text:'子',reading:'こ'}, {text:'将来',reading:'しょうらい'}, {text:'心配',reading:'しんぱい'} ] } ], similarGrammarIds:['g_n2_92'], tags:['입장'] },
  { id:'g_n2_97', level:'N2', pattern:'〜とみえて', meaningKo:'〜인 듯(보아하니)',
    explanation:'정황으로 미루어 — 「疲れているとみえて」.',
    examples:[ { ja:'疲れているとみえて、彼は無口だった。', ko:'피곤한 듯 그는 말이 없었다.', readings:[{text:'疲',reading:'つか'},{text:'彼',reading:'かれ'},{text:'無口',reading:'むくち'}] } ], similarGrammarIds:['g_n2_105'], tags:['추정'] },
  { id:'g_n2_98', level:'N2', pattern:'〜ものと思われる', meaningKo:'〜라고 여겨진다',
    explanation:'객관적 추정 — 「事故によるものと思われる」.',
    examples:[ { ja:'原因は不注意によるものと思われる。', ko:'원인은 부주의에 의한 것으로 여겨진다.', readings:[{text:'原因',reading:'げんいん'},{text:'不注意',reading:'ふちゅうい'},{text:'思',reading:'おも'}] } ], similarGrammarIds:[], tags:['추정'] },
  { id:'g_n2_99', level:'N2', pattern:'〜ことに(は)', meaningKo:'〜하게도',
    explanation:'말하는 이의 감정을 앞세움 — 「驚いたことに」.',
    examples:[ { ja:'驚いたことに、彼が一位だった。', ko:'놀랍게도 그가 1위였다.', readings:[{text:'驚',reading:'おどろ'},{text:'彼',reading:'かれ'},{text:'一位',reading:'いちい'}] } ], similarGrammarIds:[], tags:['감정'] },
  { id:'g_n2_100', level:'N2', pattern:'〜に関して', meaningKo:'〜에 관해서',
    explanation:'대상 한정 — 「環境に関して」.',
    examples:[ { ja:'環境問題に関して討論した。', ko:'환경 문제에 관해 토론했다.', readings:[ {text:'環境',reading:'かんきょう'}, {text:'問題',reading:'もんだい'}, {text:'関',reading:'かん'}, {text:'討論',reading:'とうろん'} ] } ], similarGrammarIds:['g_n2_130'], tags:['대상'] },
  { id:'g_n2_101', level:'N2', pattern:'〜を中心として', meaningKo:'〜을 중심으로',
    explanation:'중심을 두고 — 「若者を中心として」.',
    examples:[ { ja:'若者を中心として人気が高い。', ko:'젊은이를 중심으로 인기가 높다.', readings:[ {text:'若者',reading:'わかもの'}, {text:'中心',reading:'ちゅうしん'}, {text:'人気',reading:'にんき'}, {text:'高',reading:'たか'} ] } ], similarGrammarIds:['g_n2_159'], tags:['범위'] },
  { id:'g_n2_102', level:'N2', pattern:'〜というものだ', meaningKo:'그야말로 〜이다',
    explanation:'단정적 평가 — 「それは無理というものだ」.',
    examples:[ { ja:'それは身勝手というものだ。', ko:'그건 그야말로 제멋대로다.', readings:[{text:'身勝手',reading:'みがって'}] } ], similarGrammarIds:[], tags:['단정'] },
  { id:'g_n2_103', level:'N2', pattern:'〜というものではない', meaningKo:'〜인 것은 아니다',
    explanation:'부분 부정 — 「高ければいいというものではない」.',
    examples:[ { ja:'努力すれば成功するというものではない。', ko:'노력하면 성공하는 것은 아니다.', readings:[{text:'努力',reading:'どりょく'},{text:'成功',reading:'せいこう'}] } ], similarGrammarIds:[], tags:['부분부정'] },
  { id:'g_n2_104', level:'N2', pattern:'〜に決まっている', meaningKo:'분명 〜이다',
    explanation:'화자의 강한 확신 — 「うそに決まっている」.',
    examples:[ { ja:'こんな時間に来ないに決まっている。', ko:'이런 시간에 안 올 게 분명하다.', readings:[{text:'時間',reading:'じかん'},{text:'来',reading:'こ'}] } ], similarGrammarIds:['g_n2_105'], tags:['확신'] },
  { id:'g_n2_105', level:'N2', pattern:'〜に違いない', meaningKo:'〜임에 틀림없다',
    explanation:'근거 있는 추측 — 「彼が犯人に違いない」.',
    examples:[ { ja:'彼はもう知っているに違いない。', ko:'그는 이미 알고 있음에 틀림없다.', readings:[{text:'彼',reading:'かれ'},{text:'知',reading:'し'}] } ], similarGrammarIds:['g_n2_104'], tags:['추측'] },
  { id:'g_n2_106', level:'N2', pattern:'〜どおり(に)', meaningKo:'〜대로',
    explanation:'앞말과 똑같이 — 「予定どおり」.',
    examples:[ { ja:'計画どおりに工事が進んだ。', ko:'계획대로 공사가 진행되었다.', readings:[{text:'計画',reading:'けいかく'},{text:'工事',reading:'こうじ'},{text:'進',reading:'すす'}] } ], similarGrammarIds:[], tags:['일치'] },
  { id:'g_n2_107', level:'N2', pattern:'〜とたん(に)', meaningKo:'〜한 순간',
    explanation:'직후에 갑자기 — 「立ったとたん」.',
    examples:[ { ja:'ドアを開けたとたん、犬が飛び出した。', ko:'문을 연 순간 개가 뛰쳐나왔다.', readings:[{text:'開',reading:'あ'},{text:'犬',reading:'いぬ'},{text:'飛',reading:'と'},{text:'出',reading:'だ'}] } ], similarGrammarIds:['g_n2_111'], tags:['시간'] },
  { id:'g_n2_108', level:'N2', pattern:'〜かと思うと', meaningKo:'〜하는가 싶더니',
    explanation:'직후에 다른 일이 — 「泣いたかと思うと」.',
    examples:[ { ja:'晴れたかと思うと、また雨が降り出した。', ko:'갰는가 싶더니 또 비가 내리기 시작했다.', readings:[{text:'晴',reading:'は'},{text:'雨',reading:'あめ'},{text:'降',reading:'ふ'},{text:'出',reading:'だ'}] } ], similarGrammarIds:['g_n2_109'], tags:['시간'] },
  { id:'g_n2_109', level:'N2', pattern:'〜と思いきや', meaningKo:'〜인 줄 알았더니',
    explanation:'예상과 달리 — 「楽勝と思いきや」.',
    examples:[ { ja:'楽勝と思いきや、苦戦した。', ko:'낙승인 줄 알았더니 고전했다.', readings:[{text:'楽勝',reading:'らくしょう'},{text:'思',reading:'おも'},{text:'苦戦',reading:'くせん'}] } ], similarGrammarIds:['g_n2_108'], tags:['의외'] },
  { id:'g_n2_110', level:'N2', pattern:'〜てからというもの', meaningKo:'〜한 이후로(쭉)',
    explanation:'그 이후 계속 — 「引っ越してからというもの」.',
    examples:[ { ja:'禁煙してからというもの体調がいい。', ko:'금연한 이후로 컨디션이 좋다.', readings:[{text:'禁煙',reading:'きんえん'},{text:'体調',reading:'たいちょう'}] } ], similarGrammarIds:[], tags:['시간'] },
  { id:'g_n2_111', level:'N2', pattern:'〜つもりで', meaningKo:'〜할 셈치고',
    explanation:'마음가짐·의도 — 「新人のつもりで」.',
    examples:[ { ja:'新人のつもりで一から学ぶ。', ko:'신입이라는 셈치고 처음부터 배운다.', readings:[ {text:'新人',reading:'しんじん'}, {text:'一',reading:'いち'}, {text:'学',reading:'まな'} ] } ], similarGrammarIds:['g_n2_118'], tags:['의도'] },
  { id:'g_n2_112', level:'N2', pattern:'〜となると', meaningKo:'〜하게 되면',
    explanation:'그런 상황·단계가 되면 — 「いざとなると」.',
    examples:[ { ja:'いざ発表となると緊張する。', ko:'막상 발표라면 긴장된다.', readings:[{text:'発表',reading:'はっぴょう'},{text:'緊張',reading:'きんちょう'}] } ], similarGrammarIds:['g_n2_113'], tags:['조건'] },
  { id:'g_n2_113', level:'N2', pattern:'〜となれば', meaningKo:'〜라고 하면',
    explanation:'가정·전제 — 「留学するとなれば」.',
    examples:[ { ja:'留学するとなれば準備が必要だ。', ko:'유학할 거라면 준비가 필요하다.', readings:[{text:'留学',reading:'りゅうがく'},{text:'準備',reading:'じゅんび'},{text:'必要',reading:'ひつよう'}] } ], similarGrammarIds:['g_n2_112'], tags:['조건'] },
  { id:'g_n2_114', level:'N2', pattern:'〜あまり(に)', meaningKo:'너무 〜한 나머지',
    explanation:'정도가 지나쳐 그 결과 — 「緊張のあまり」.',
    examples:[ { ja:'喜びのあまり言葉が出なかった。', ko:'너무 기쁜 나머지 말이 안 나왔다.', readings:[{text:'喜',reading:'よろこ'},{text:'言葉',reading:'ことば'},{text:'出',reading:'で'}] } ], similarGrammarIds:[], tags:['정도'] },
  { id:'g_n2_115', level:'N2', pattern:'〜を込めて', meaningKo:'〜을 담아서',
    explanation:'마음을 담아 — 「感謝を込めて」.',
    examples:[ { ja:'感謝を込めて手紙を書いた。', ko:'감사를 담아 편지를 썼다.', readings:[ {text:'感謝',reading:'かんしゃ'}, {text:'込',reading:'こ'}, {text:'手紙',reading:'てがみ'}, {text:'書',reading:'か'} ] } ], similarGrammarIds:[], tags:['감정'] },
  { id:'g_n2_116', level:'N2', pattern:'〜ものか', meaningKo:'〜할까 보냐',
    explanation:'강한 부정 의지 — 「負けるものか」.',
    examples:[ { ja:'こんなことで負けるものか。', ko:'이런 일로 질까 보냐.', readings:[ {text:'負',reading:'ま'} ] } ], similarGrammarIds:['g_n2_179'], tags:['의지'] },
  { id:'g_n2_117', level:'N2', pattern:'〜きる', meaningKo:'다 〜하다',
    explanation:'끝까지 완수 — 「読みきる」.',
    examples:[ { ja:'長い小説を一日で読みきった。', ko:'긴 소설을 하루에 다 읽었다.', readings:[ {text:'長',reading:'なが'}, {text:'小説',reading:'しょうせつ'}, {text:'一日',reading:'いちにち'}, {text:'読',reading:'よ'} ] } ], similarGrammarIds:['g_n2_95'], tags:['완료'] },
  { id:'g_n2_118', level:'N2', pattern:'〜とおりだ', meaningKo:'〜한 대로다',
    explanation:'예상·지시와 같음 — 「予想したとおり」.',
    examples:[ { ja:'結果は予想したとおりだ。', ko:'결과는 예상한 대로다.', readings:[ {text:'結果',reading:'けっか'}, {text:'予想',reading:'よそう'} ] } ], similarGrammarIds:['g_n2_111'], tags:['기준'] },
  { id:'g_n2_119', level:'N2', pattern:'〜からこそ', meaningKo:'바로 〜이기에',
    explanation:'이유의 강조 — 「あなただからこそ」.',
    examples:[ { ja:'本気だからこそ厳しく言う。', ko:'진심이기에 엄하게 말한다.', readings:[{text:'本気',reading:'ほんき'},{text:'厳',reading:'きび'},{text:'言',reading:'い'}] } ], similarGrammarIds:[], tags:['강조'] },
  { id:'g_n2_120', level:'N2', pattern:'〜からといって', meaningKo:'〜라고 해서',
    explanation:'이유가 있어도 결론은 다름 — 「安いからといって」.',
    examples:[ { ja:'安いからといって質が悪いとは言えない。', ko:'싸다고 해서 질이 나쁘다고는 할 수 없다.', readings:[{text:'安',reading:'やす'},{text:'質',reading:'しつ'},{text:'悪',reading:'わる'},{text:'言',reading:'い'}] } ], similarGrammarIds:['g_n2_121'], tags:['역접'] },
  { id:'g_n2_121', level:'N2', pattern:'〜からには', meaningKo:'〜한 이상',
    explanation:'그렇게 된 이상 당연히 — 「約束したからには」.',
    examples:[ { ja:'引き受けたからには最後までやる。', ko:'맡은 이상 끝까지 한다.', readings:[{text:'引',reading:'ひ'},{text:'受',reading:'う'},{text:'最後',reading:'さいご'}] } ], similarGrammarIds:['g_n2_122','g_n2_120'], tags:['결의'] },
  { id:'g_n2_122', level:'N2', pattern:'〜上は', meaningKo:'〜한 이상은',
    explanation:'결정된 이상 마땅히 — 「こうなった上は」.',
    examples:[ { ja:'社長が決めた上は従うしかない。', ko:'사장이 정한 이상은 따를 수밖에 없다.', readings:[{text:'社長',reading:'しゃちょう'},{text:'決',reading:'き'},{text:'従',reading:'したが'}] } ], similarGrammarIds:['g_n2_121'], tags:['결의'] },
  { id:'g_n2_123', level:'N2', pattern:'〜限り(は)', meaningKo:'〜하는 한',
    explanation:'그 조건이 유지되는 동안 — 「生きている限り」.',
    examples:[ { ja:'体が健康な限り働き続けたい。', ko:'몸이 건강한 한 계속 일하고 싶다.', readings:[{text:'体',reading:'からだ'},{text:'健康',reading:'けんこう'},{text:'働',reading:'はたら'},{text:'続',reading:'つづ'}] } ], similarGrammarIds:['g_n2_124'], tags:['조건'] },
  { id:'g_n2_124', level:'N2', pattern:'〜限りでは', meaningKo:'〜하는 한에서는',
    explanation:'아는 범위 안에서 — 「調べた限りでは」.',
    examples:[ { ja:'私が知る限りでは問題ない。', ko:'내가 아는 한에서는 문제없다.', readings:[{text:'私',reading:'わたし'},{text:'知',reading:'し'},{text:'問題',reading:'もんだい'}] } ], similarGrammarIds:['g_n2_123'], tags:['범위'] },
  { id:'g_n2_125', level:'N2', pattern:'〜をはじめとして', meaningKo:'〜을 비롯하여',
    explanation:'대표 예시 — 「社長をはじめとして」.',
    examples:[ { ja:'社長をはじめとして全員が出席した。', ko:'사장을 비롯하여 전원이 출석했다.', readings:[ {text:'社長',reading:'しゃちょう'}, {text:'全員',reading:'ぜんいん'}, {text:'出席',reading:'しゅっせき'} ] } ], similarGrammarIds:['g_n2_168'], tags:['예시'] },
  { id:'g_n2_126', level:'N2', pattern:'〜てしょうがない', meaningKo:'〜해서 견딜 수 없다',
    explanation:'감정·감각이 매우 강함 — 「眠くてしょうがない」.',
    examples:[ { ja:'合格発表が気になってしょうがない。', ko:'합격 발표가 신경 쓰여서 견딜 수 없다.', readings:[{text:'合格',reading:'ごうかく'},{text:'発表',reading:'はっぴょう'},{text:'気',reading:'き'}] } ], similarGrammarIds:['g_n2_127','g_n2_128'], tags:['정도'] },
  { id:'g_n2_127', level:'N2', pattern:'〜てたまらない', meaningKo:'〜해서 참을 수 없다',
    explanation:'참기 힘들 정도 — 「暑くてたまらない」.',
    examples:[ { ja:'故郷に帰りたくてたまらない。', ko:'고향에 돌아가고 싶어서 참을 수 없다.', readings:[{text:'故郷',reading:'こきょう'},{text:'帰',reading:'かえ'}] } ], similarGrammarIds:['g_n2_126'], tags:['정도'] },
  { id:'g_n2_128', level:'N2', pattern:'〜てならない', meaningKo:'〜해서 어쩔 수 없다',
    explanation:'자연히 그렇게 느껴짐 — 「残念でならない」.',
    examples:[ { ja:'将来が不安でならない。', ko:'장래가 불안해서 어쩔 수 없다.', readings:[{text:'将来',reading:'しょうらい'},{text:'不安',reading:'ふあん'}] } ], similarGrammarIds:['g_n2_126'], tags:['정도'] },
  { id:'g_n2_129', level:'N2', pattern:'〜というより', meaningKo:'〜라기보다',
    explanation:'더 적절한 표현으로 정정 — 「趣味というより」.',
    examples:[ { ja:'趣味というより仕事に近い。', ko:'취미라기보다 일에 가깝다.', readings:[ {text:'趣味',reading:'しゅみ'}, {text:'仕事',reading:'しごと'}, {text:'近',reading:'ちか'} ] } ], similarGrammarIds:[], tags:['비교'] },
  { id:'g_n2_130', level:'N2', pattern:'〜に関する', meaningKo:'〜에 관한',
    explanation:'대상 한정(명사 수식) — 「環境に関する」.',
    examples:[ { ja:'環境に関する報告書を読む。', ko:'환경에 관한 보고서를 읽는다.', readings:[ {text:'環境',reading:'かんきょう'}, {text:'関',reading:'かん'}, {text:'報告書',reading:'ほうこくしょ'}, {text:'読',reading:'よ'} ] } ], similarGrammarIds:['g_n2_100'], tags:['대상'] },
  { id:'g_n2_131', level:'N2', pattern:'〜に対する', meaningKo:'〜에 대한',
    explanation:'대상·대조(명사 수식) — 「顧客に対する」.',
    examples:[ { ja:'顧客に対する対応を見直す。', ko:'고객에 대한 대응을 재검토한다.', readings:[ {text:'顧客',reading:'こきゃく'}, {text:'対',reading:'たい'}, {text:'対応',reading:'たいおう'}, {text:'見直',reading:'みなお'} ] } ], similarGrammarIds:['g_n2_130'], tags:['대상'] },
  { id:'g_n2_132', level:'N2', pattern:'〜ざるを得ない', meaningKo:'〜하지 않을 수 없다',
    explanation:'어쩔 수 없이 그래야 함 — 「認めざるを得ない」.',
    examples:[ { ja:'証拠がある以上、認めざるを得ない。', ko:'증거가 있는 이상 인정하지 않을 수 없다.', readings:[{text:'証拠',reading:'しょうこ'},{text:'以上',reading:'いじょう'},{text:'認',reading:'みと'}] } ], similarGrammarIds:[], tags:['강제'] },
  { id:'g_n2_133', level:'N2', pattern:'〜向きだ', meaningKo:'〜에 적합하다',
    explanation:'성질이 그쪽에 맞음 — 「初心者向き」.',
    examples:[ { ja:'この部屋は南向きで明るい。', ko:'이 방은 남향이라 밝다.', readings:[{text:'部屋',reading:'へや'},{text:'南向',reading:'みなみむ'},{text:'明',reading:'あか'}] } ], similarGrammarIds:['g_n2_134'], tags:['적합'] },
  { id:'g_n2_134', level:'N2', pattern:'〜向けだ', meaningKo:'〜을 대상으로 하다',
    explanation:'특정 대상을 겨냥 — 「子ども向け」.',
    examples:[ { ja:'この雑誌は若者向けに作られている。', ko:'이 잡지는 젊은이를 대상으로 만들어졌다.', readings:[{text:'雑誌',reading:'ざっし'},{text:'若者',reading:'わかもの'},{text:'作',reading:'つく'}] } ], similarGrammarIds:['g_n2_133'], tags:['대상'] },
  { id:'g_n2_135', level:'N2', pattern:'〜といい〜といい', meaningKo:'〜며 〜며(모두)',
    explanation:'여러 면에서 모두 — 「色といい形といい」.',
    examples:[ { ja:'味といい量といい大満足だ。', ko:'맛이며 양이며 모두 대만족이다.', readings:[{text:'味',reading:'あじ'},{text:'量',reading:'りょう'},{text:'大満足',reading:'だいまんぞく'}] } ], similarGrammarIds:[], tags:['열거'] },
  { id:'g_n2_136', level:'N2', pattern:'〜であれ〜であれ', meaningKo:'〜든 〜든',
    explanation:'어느 쪽이든 상관없이 — 「晴れであれ雨であれ」.',
    examples:[ { ja:'大人であれ子どもであれ規則は同じだ。', ko:'어른이든 아이든 규칙은 같다.', readings:[{text:'大人',reading:'おとな'},{text:'子',reading:'こ'},{text:'規則',reading:'きそく'},{text:'同',reading:'おな'}] } ], similarGrammarIds:['g_n2_137'], tags:['선택'] },
  { id:'g_n2_137', level:'N2', pattern:'〜ようが〜まいが', meaningKo:'〜하든 말든',
    explanation:'하든 안 하든 무관 — 「行こうが行くまいが」.',
    examples:[ { ja:'信じようが信じまいが事実は変わらない。', ko:'믿든 말든 사실은 변하지 않는다.', readings:[{text:'信',reading:'しん'},{text:'事実',reading:'じじつ'},{text:'変',reading:'か'}] } ], similarGrammarIds:['g_n2_136','g_n2_138'], tags:['선택'] },
  { id:'g_n2_138', level:'N2', pattern:'〜うが〜うが', meaningKo:'〜하든 〜하든',
    explanation:'어느 쪽이든 무관 — 「笑おうが泣こうが」.',
    examples:[ { ja:'笑おうが泣こうが結果は同じだ。', ko:'웃든 울든 결과는 같다.', readings:[{text:'笑',reading:'わら'},{text:'泣',reading:'な'},{text:'結果',reading:'けっか'},{text:'同',reading:'おな'}] } ], similarGrammarIds:['g_n2_137'], tags:['선택'] },
  { id:'g_n2_139', level:'N2', pattern:'〜なり〜なり', meaningKo:'〜든지 〜든지',
    explanation:'예시 중 택일 — 「電話なりメールなり」.',
    examples:[ { ja:'電話なりメールなりで連絡してほしい。', ko:'전화든 메일이든 연락해 주었으면 한다.', readings:[{text:'電話',reading:'でんわ'},{text:'連絡',reading:'れんらく'}] } ], similarGrammarIds:[], tags:['선택'] },
  { id:'g_n2_140', level:'N2', pattern:'〜につけ', meaningKo:'〜할 때마다',
    explanation:'자연히 그렇게 됨 — 「見るにつけ」.',
    examples:[ { ja:'その写真を見るにつけ思い出す。', ko:'그 사진을 볼 때마다 떠오른다.', readings:[ {text:'写真',reading:'しゃしん'}, {text:'見',reading:'み'}, {text:'思',reading:'おも'}, {text:'出',reading:'だ'} ] } ], similarGrammarIds:[], tags:['반복'] },
  { id:'g_n2_141', level:'N2', pattern:'〜なくはない', meaningKo:'〜하지 않는 것도 아니다',
    explanation:'약한 긍정 — 「分からなくはない」.',
    examples:[ { ja:'その意見も理解できなくはない。', ko:'그 의견도 이해 못 할 것도 아니다.', readings:[{text:'意見',reading:'いけん'},{text:'理解',reading:'りかい'}] } ], similarGrammarIds:['g_n2_142'], tags:['부분긍정'] },
  { id:'g_n2_142', level:'N2', pattern:'〜ないものでもない', meaningKo:'〜못할 것도 없다',
    explanation:'조건부 가능 — 「考えないものでもない」.',
    examples:[ { ja:'条件によっては引き受けないものでもない。', ko:'조건에 따라서는 맡지 못할 것도 없다.', readings:[{text:'条件',reading:'じょうけん'},{text:'引',reading:'ひ'},{text:'受',reading:'う'}] } ], similarGrammarIds:['g_n2_141'], tags:['부분긍정'] },
  { id:'g_n2_143', level:'N2', pattern:'〜ないとも限らない', meaningKo:'〜하지 않으리란 법도 없다',
    explanation:'가능성을 배제 못 함 — 「失敗しないとも限らない」.',
    examples:[ { ja:'急に雨が降らないとも限らない。', ko:'갑자기 비가 안 온다고도 할 수 없다.', readings:[{text:'急',reading:'きゅう'},{text:'雨',reading:'あめ'},{text:'降',reading:'ふ'},{text:'限',reading:'かぎ'}] } ], similarGrammarIds:[], tags:['가능성'] },
  { id:'g_n2_144', level:'N2', pattern:'〜に越したことはない', meaningKo:'〜보다 나은 것은 없다',
    explanation:'그렇게 하는 편이 최선 — 「安いに越したことはない」.',
    examples:[ { ja:'用心するに越したことはない。', ko:'조심하는 것보다 나은 것은 없다.', readings:[{text:'用心',reading:'ようじん'},{text:'越',reading:'こ'}] } ], similarGrammarIds:['g_n2_145'], tags:['최선'] },
  { id:'g_n2_145', level:'N2', pattern:'〜までもない', meaningKo:'〜할 것까지도 없다',
    explanation:'그렇게 할 필요가 없음 — 「言うまでもない」.',
    examples:[ { ja:'言うまでもなく健康が一番だ。', ko:'말할 것도 없이 건강이 제일이다.', readings:[{text:'言',reading:'い'},{text:'健康',reading:'けんこう'},{text:'一番',reading:'いちばん'}] } ], similarGrammarIds:['g_n2_144','g_n2_146'], tags:['불필요'] },
  { id:'g_n2_146', level:'N2', pattern:'〜までのことだ', meaningKo:'〜하면 그만이다',
    explanation:'그렇게 하면 끝 — 「だめならやり直すまでだ」.',
    examples:[ { ja:'だめなら一からやり直すまでのことだ。', ko:'안 되면 처음부터 다시 하면 그만이다.', readings:[{text:'一',reading:'いち'},{text:'直',reading:'なお'}] } ], similarGrammarIds:['g_n2_145'], tags:['결의'] },
  { id:'g_n2_147', level:'N2', pattern:'〜てはじめて', meaningKo:'〜하고서야 비로소',
    explanation:'그 경험을 통해 처음 — 「失ってはじめて」.',
    examples:[ { ja:'親になってはじめて親心が分かった。', ko:'부모가 되고서야 비로소 부모 마음을 알았다.', readings:[{text:'親',reading:'おや'},{text:'親心',reading:'おやごころ'},{text:'分',reading:'わ'}] } ], similarGrammarIds:[], tags:['계기'] },
  { id:'g_n2_148', level:'N2', pattern:'〜てばかりはいられない', meaningKo:'〜만 하고 있을 수 없다',
    explanation:'계속 그러고 있을 수 없음 — 「泣いてばかりは」.',
    examples:[ { ja:'いつまでも悲しんでばかりはいられない。', ko:'언제까지나 슬퍼하고만 있을 수는 없다.', readings:[{text:'悲',reading:'かな'}] } ], similarGrammarIds:[], tags:['전환'] },
  { id:'g_n2_149', level:'N2', pattern:'〜ないものか', meaningKo:'〜할 수 없을까',
    explanation:'강한 바람·아쉬움 — 「何とかならないものか」.',
    examples:[ { ja:'何とか解決できないものか。', ko:'어떻게든 해결할 수 없을까.', readings:[{text:'何',reading:'なん'},{text:'解決',reading:'かいけつ'}] } ], similarGrammarIds:[], tags:['바람'] },
  { id:'g_n2_150', level:'N2', pattern:'〜ても始まらない', meaningKo:'〜해도 소용없다',
    explanation:'해 봐야 의미 없음 — 「悔やんでも始まらない」.',
    examples:[ { ja:'今さら焦っても始まらない。', ko:'이제 와서 초조해해도 소용없다.', readings:[{text:'今',reading:'いま'},{text:'焦',reading:'あせ'},{text:'始',reading:'はじ'}] } ], similarGrammarIds:[], tags:['무용'] },
  { id:'g_n2_151', level:'N2', pattern:'〜ようでは', meaningKo:'〜해서는',
    explanation:'그런 상태면 (부정적 결론) — 「すぐ諦めるようでは」.',
    examples:[ { ja:'すぐ諦めるようでは成功しない。', ko:'금방 포기해서는 성공하지 못한다.', readings:[{text:'諦',reading:'あきら'},{text:'成功',reading:'せいこう'}] } ], similarGrammarIds:[], tags:['조건'] },
  { id:'g_n2_152', level:'N2', pattern:'〜くらいのものだ', meaningKo:'〜정도가 고작이다',
    explanation:'그 정도뿐임 — 「彼くらいのものだ」.',
    examples:[ { ja:'文句を言うのは彼くらいのものだ。', ko:'불평하는 건 그 정도가 고작이다.', readings:[{text:'文句',reading:'もんく'},{text:'言',reading:'い'},{text:'彼',reading:'かれ'}] } ], similarGrammarIds:['g_n2_153'], tags:['한정'] },
  { id:'g_n2_153', level:'N2', pattern:'〜ほどだ', meaningKo:'〜할 정도다',
    explanation:'정도를 비유 — 「立てないほどだ」.',
    examples:[ { ja:'足が痛くて立てないほどだ。', ko:'발이 아파 설 수 없을 정도다.', readings:[ {text:'足',reading:'あし'}, {text:'痛',reading:'いた'}, {text:'立',reading:'た'} ] } ], similarGrammarIds:[], tags:['정도'] },
  { id:'g_n2_154', level:'N2', pattern:'〜気味だ', meaningKo:'〜기색이다',
    explanation:'그런 경향·기미 — 「疲れ気味」.',
    examples:[ { ja:'最近少し疲れ気味だ。', ko:'요즘 조금 피곤한 기색이다.', readings:[ {text:'最近',reading:'さいきん'}, {text:'少',reading:'すこ'}, {text:'疲',reading:'つか'} ] } ], similarGrammarIds:[], tags:['경향'] },
  { id:'g_n2_155', level:'N2', pattern:'〜ながらに', meaningKo:'〜한 채로',
    explanation:'그 상태 그대로 — 「生まれながらに」.',
    examples:[ { ja:'彼は生まれながらに音楽の才能があった。', ko:'그는 태어날 때부터 음악 재능이 있었다.', readings:[{text:'彼',reading:'かれ'},{text:'生まれ',reading:'うまれ'},{text:'音楽',reading:'おんがく'},{text:'才能',reading:'さいのう'}] } ], similarGrammarIds:['g_n2_156'], tags:['상태'] },
  { id:'g_n2_156', level:'N2', pattern:'〜ながらの', meaningKo:'〜그대로의',
    explanation:'옛 모습 그대로 — 「昔ながらの」.',
    examples:[ { ja:'昔ながらの製法を守っている。', ko:'옛날 그대로의 제법을 지키고 있다.', readings:[{text:'昔',reading:'むかし'},{text:'製法',reading:'せいほう'},{text:'守',reading:'まも'}] } ], similarGrammarIds:['g_n2_155'], tags:['상태'] },
  { id:'g_n2_157', level:'N2', pattern:'〜ようとも', meaningKo:'〜하더라도',
    explanation:'어떤 경우라도 — 「何が起ころうとも」.',
    examples:[ { ja:'何が起ころうとも前に進む。', ko:'무슨 일이 일어나더라도 앞으로 나아간다.', readings:[{text:'何',reading:'なに'},{text:'起',reading:'お'},{text:'前',reading:'まえ'},{text:'進',reading:'すす'}] } ], similarGrammarIds:['g_n2_136'], tags:['양보'] },
  { id:'g_n2_158', level:'N2', pattern:'〜ぬく', meaningKo:'끝까지 〜하다',
    explanation:'마지막까지 해냄 — 「走りぬく」.',
    examples:[ { ja:'最後まで走りぬいた。', ko:'끝까지 달려냈다.', readings:[ {text:'最後',reading:'さいご'}, {text:'走',reading:'はし'} ] } ], similarGrammarIds:['g_n2_117'], tags:['완수'] },
  { id:'g_n2_159', level:'N2', pattern:'〜をめぐる', meaningKo:'〜을 둘러싼',
    explanation:'대립·논의의 초점 — 「制度をめぐる」.',
    examples:[ { ja:'制度をめぐる議論が続く。', ko:'제도를 둘러싼 논의가 이어진다.', readings:[ {text:'制度',reading:'せいど'}, {text:'議論',reading:'ぎろん'}, {text:'続',reading:'つづ'} ] } ], similarGrammarIds:['g_n2_101'], tags:['대상'] },
  { id:'g_n2_160', level:'N2', pattern:'〜にとどまらず', meaningKo:'〜에 그치지 않고',
    explanation:'범위가 더 넓어짐 — 「国内にとどまらず」.',
    examples:[ { ja:'被害は一社にとどまらず業界全体に及んだ。', ko:'피해는 한 회사에 그치지 않고 업계 전체에 미쳤다.', readings:[{text:'被害',reading:'ひがい'},{text:'一社',reading:'いっしゃ'},{text:'業界',reading:'ぎょうかい'},{text:'全体',reading:'ぜんたい'},{text:'及',reading:'およ'}] } ], similarGrammarIds:[], tags:['범위'] },
  { id:'g_n2_161', level:'N2', pattern:'〜をきっかけとして', meaningKo:'〜을 계기로',
    explanation:'시작의 계기 — 「留学をきっかけとして」.',
    examples:[ { ja:'留学をきっかけとして視野が広がった。', ko:'유학을 계기로 시야가 넓어졌다.', readings:[ {text:'留学',reading:'りゅうがく'}, {text:'視野',reading:'しや'}, {text:'広',reading:'ひろ'} ] } ], similarGrammarIds:['g_n2_6'], tags:['계기'] },
  { id:'g_n2_162', level:'N2', pattern:'〜すら', meaningKo:'〜조차',
    explanation:'극단적인 예 — 「名前すら」.',
    examples:[ { ja:'忙しくて食事をする時間すらない。', ko:'바빠서 식사할 시간조차 없다.', readings:[{text:'忙',reading:'いそが'},{text:'食事',reading:'しょくじ'},{text:'時間',reading:'じかん'}] } ], similarGrammarIds:[], tags:['강조'] },
  { id:'g_n2_163', level:'N2', pattern:'〜ようによっては', meaningKo:'〜하기에 따라서는',
    explanation:'보기·생각하기 나름 — 「考えようによっては」.',
    examples:[ { ja:'考えようによっては好機だ。', ko:'생각하기에 따라서는 호기다.', readings:[ {text:'考',reading:'かんが'}, {text:'好機',reading:'こうき'} ] } ], similarGrammarIds:[], tags:['관점'] },
  { id:'g_n2_164', level:'N2', pattern:'〜からして', meaningKo:'〜부터가',
    explanation:'대표적 예로 판단 — 「態度からして」.',
    examples:[ { ja:'態度からして真剣だ。', ko:'태도부터가 진지하다.', readings:[ {text:'態度',reading:'たいど'}, {text:'真剣',reading:'しんけん'} ] } ], similarGrammarIds:[], tags:['예시'] },
  { id:'g_n2_165', level:'N2', pattern:'〜ても差し支えない', meaningKo:'〜해도 무방하다',
    explanation:'문제 없이 허용됨 — 「使っても差し支えない」.',
    examples:[ { ja:'写真は撮っても差し支えない。', ko:'사진은 찍어도 무방하다.', readings:[{text:'写真',reading:'しゃしん'},{text:'撮',reading:'と'},{text:'差',reading:'さ'},{text:'支',reading:'つか'}] } ], similarGrammarIds:[], tags:['허가'] },
  { id:'g_n2_166', level:'N2', pattern:'〜をもとに(して)', meaningKo:'〜을 토대로',
    explanation:'자료·소재로 삼아 — 「事実をもとに」.',
    examples:[ { ja:'調査結果をもとに対策を立てた。', ko:'조사 결과를 토대로 대책을 세웠다.', readings:[{text:'調査',reading:'ちょうさ'},{text:'結果',reading:'けっか'},{text:'対策',reading:'たいさく'},{text:'立',reading:'た'}] } ], similarGrammarIds:[], tags:['근거'] },
  { id:'g_n2_167', level:'N2', pattern:'〜をたよりに', meaningKo:'〜에 의지해',
    explanation:'그것에 기대어 — 「記憶をたよりに」.',
    examples:[ { ja:'地図をたよりに目的地へ向かった。', ko:'지도에 의지해 목적지로 향했다.', readings:[{text:'地図',reading:'ちず'},{text:'目的地',reading:'もくてきち'},{text:'向',reading:'む'}] } ], similarGrammarIds:[], tags:['의지'] },
  { id:'g_n2_168', level:'N2', pattern:'〜をはじめ(として)', meaningKo:'〜을 비롯하여',
    explanation:'대표 예를 들어 — 「東京をはじめ」.',
    examples:[ { ja:'社長をはじめ全社員が出席した。', ko:'사장을 비롯해 전 사원이 출석했다.', readings:[{text:'社長',reading:'しゃちょう'},{text:'全社員',reading:'ぜんしゃいん'},{text:'出席',reading:'しゅっせき'}] } ], similarGrammarIds:[], tags:['열거'] },
  { id:'g_n2_169', level:'N2', pattern:'〜を通じて', meaningKo:'〜을 통해',
    explanation:'수단·기간 전체에 걸쳐 — 「テレビを通じて」.',
    examples:[ { ja:'友人を通じて彼女と知り合った。', ko:'친구를 통해 그녀와 알게 되었다.', readings:[{text:'友人',reading:'ゆうじん'},{text:'彼女',reading:'かのじょ'},{text:'知',reading:'し'},{text:'合',reading:'あ'}] } ], similarGrammarIds:[], tags:['수단'] },
  { id:'g_n2_170', level:'N2', pattern:'〜に沿って', meaningKo:'〜을 따라',
    explanation:'방침·길을 따라 — 「方針に沿って」.',
    examples:[ { ja:'川に沿って遊歩道が続く。', ko:'강을 따라 산책로가 이어진다.', readings:[{text:'川',reading:'かわ'},{text:'沿',reading:'そ'},{text:'遊歩道',reading:'ゆうほどう'},{text:'続',reading:'つづ'}] } ], similarGrammarIds:[], tags:['기준'] },
  { id:'g_n2_171', level:'N2', pattern:'〜に反して', meaningKo:'〜에 반하여',
    explanation:'기대·예상과 반대 — 「予想に反して」.',
    examples:[ { ja:'期待に反して結果は振るわなかった。', ko:'기대에 반해 결과는 신통치 않았다.', readings:[{text:'期待',reading:'きたい'},{text:'反',reading:'はん'},{text:'結果',reading:'けっか'},{text:'振',reading:'ふ'}] } ], similarGrammarIds:[], tags:['역접'] },
  { id:'g_n2_172', level:'N2', pattern:'〜に加えて', meaningKo:'〜에 더하여',
    explanation:'추가 — 「雨に加えて風も強い」.',
    examples:[ { ja:'給料に加えて手当も支給される。', ko:'급여에 더해 수당도 지급된다.', readings:[{text:'給料',reading:'きゅうりょう'},{text:'加',reading:'くわ'},{text:'手当',reading:'てあて'},{text:'支給',reading:'しきゅう'}] } ], similarGrammarIds:[], tags:['추가'] },
  { id:'g_n2_173', level:'N2', pattern:'〜ことだろう', meaningKo:'얼마나 〜일까',
    explanation:'감정·정도의 추측 강조 — 「喜ぶことだろう」.',
    examples:[ { ja:'どんなに喜ぶことだろう。', ko:'얼마나 기뻐할까.', readings:[ {text:'喜',reading:'よろこ'} ] } ], similarGrammarIds:['g_n2_140'], tags:['감탄'] },
  { id:'g_n2_174', level:'N2', pattern:'〜かと思えば', meaningKo:'〜인가 싶더니',
    explanation:'직후에 다른 일/대조 — 「泣いたかと思えば」.',
    examples:[ { ja:'晴れたかと思えばすぐ雨が降る。', ko:'갰는가 싶더니 곧 비가 온다.', readings:[{text:'晴',reading:'は'},{text:'雨',reading:'あめ'},{text:'降',reading:'ふ'}] } ], similarGrammarIds:['g_n2_108'], tags:['시간'] },
  { id:'g_n2_175', level:'N2', pattern:'〜にとっては', meaningKo:'〜에게 있어서는',
    explanation:'입장·관점 — 「私にとっては」.',
    examples:[ { ja:'私にとっては家族が一番だ。', ko:'나에게 있어서는 가족이 제일이다.', readings:[ {text:'私',reading:'わたし'}, {text:'家族',reading:'かぞく'}, {text:'一番',reading:'いちばん'} ] } ], similarGrammarIds:[], tags:['관점'] },
  { id:'g_n2_176', level:'N2', pattern:'〜は別として', meaningKo:'〜은 별도로 하고',
    explanation:'일단 제외하고 — 「冗談は別として」.',
    examples:[ { ja:'結果は別として努力は認める。', ko:'결과는 별도로 하고 노력은 인정한다.', readings:[{text:'結果',reading:'けっか'},{text:'別',reading:'べつ'},{text:'努力',reading:'どりょく'},{text:'認',reading:'みと'}] } ], similarGrammarIds:['g_n2_177'], tags:['제외'] },
  { id:'g_n2_177', level:'N2', pattern:'〜はさておき', meaningKo:'〜은 제쳐두고',
    explanation:'일단 미뤄두고 본론으로 — 「冗談はさておき」.',
    examples:[ { ja:'詳細はさておき、結論を述べます。', ko:'상세한 것은 제쳐두고 결론을 말하겠습니다.', readings:[{text:'詳細',reading:'しょうさい'},{text:'結論',reading:'けつろん'},{text:'述',reading:'の'}] } ], similarGrammarIds:['g_n2_176'], tags:['제외'] },
  { id:'g_n2_178', level:'N2', pattern:'〜ともなれば', meaningKo:'〜쯤 되면',
    explanation:'그런 입장·시기가 되면 당연히 — 「責任者ともなれば」.',
    examples:[ { ja:'責任者ともなれば判断も重い。', ko:'책임자쯤 되면 판단도 무겁다.', readings:[{text:'責任者',reading:'せきにんしゃ'},{text:'判断',reading:'はんだん'},{text:'重',reading:'おも'}] } ], similarGrammarIds:['g_n2_113'], tags:['입장'] },
  { id:'g_n2_179', level:'N2', pattern:'〜ものではない', meaningKo:'〜하는 게 아니다',
    explanation:'충고·일반 규범 — 「判断するものではない」.',
    examples:[ { ja:'人を見た目で判断するものではない。', ko:'사람을 겉모습으로 판단하는 게 아니다.', readings:[ {text:'人',reading:'ひと'}, {text:'見',reading:'み'}, {text:'目',reading:'め'}, {text:'判断',reading:'はんだん'} ] } ], similarGrammarIds:['g_n2_116'], tags:['충고'] },
  { id:'g_n2_180', level:'N2', pattern:'〜にしたって', meaningKo:'〜라고 해도',
    explanation:'양보 (구어) — 「いくら忙しいにしたって」.',
    examples:[ { ja:'急ぐにしたって限度がある。', ko:'서두른다고 해도 한도가 있다.', readings:[{text:'急',reading:'いそ'},{text:'限度',reading:'げんど'}] } ], similarGrammarIds:[], tags:['양보'] },
];
