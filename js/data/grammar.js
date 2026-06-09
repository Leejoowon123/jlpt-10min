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
      { ja:'もう帰らなきゃ。', ko:'이제 가야 해.' },
    ],
    similarGrammarIds:['g_n4_4'], tags:['의무'] },

  { id:'g_n4_4', level:'N4', pattern:'〜なくてもいい', meaningKo:'〜하지 않아도 된다',
    explanation:'불필요·허락. 「〜なければならない」의 반대 표현.',
    examples:[
      { ja:'明日は来なくてもいいです。', ko:'내일은 오지 않아도 됩니다.' },
      { ja:'急がなくてもいいよ。', ko:'서두르지 않아도 돼.' },
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
      { ja:'忘れないようにメモする。', ko:'잊지 않도록 메모한다.' },
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

  // ---------- N3 ----------
  { id:'g_n3_1', level:'N3', pattern:'〜ことにする', meaningKo:'〜하기로 하다 (스스로 결정)',
    explanation:'자기 의지로 결정한 일. 자신의 결심.',
    examples:[
      { ja:'毎朝走ることにしました。', ko:'매일 아침 달리기로 했습니다.' },
    ],
    similarGrammarIds:['g_n3_2'], tags:['결정'] },

  { id:'g_n3_2', level:'N3', pattern:'〜ことになる', meaningKo:'〜하게 되다 (외부 결정)',
    explanation:'자신의 의지와 관계없이 그렇게 정해짐을 나타냄.',
    examples:[
      { ja:'来月、大阪に転勤することになりました。', ko:'다음 달 오사카로 전근하게 되었습니다.' },
    ],
    similarGrammarIds:['g_n3_1'], tags:['결정'] },

  // ---------- N2 ----------
  { id:'g_n2_1', level:'N2', pattern:'〜によって', meaningKo:'〜에 의해/〜에 따라',
    explanation:'원인·수단·기준·차이를 나타냄. 수동문에서는 행위자.',
    examples:[
      { ja:'国によって文化が違います。', ko:'나라에 따라 문화가 다릅니다.' },
      { ja:'この建物は有名な建築家によって設計された。', ko:'이 건물은 유명한 건축가에 의해 설계되었다.' },
    ],
    similarGrammarIds:['g_n2_2'], tags:['표현'] },

  { id:'g_n2_2', level:'N2', pattern:'〜によると', meaningKo:'〜에 의하면 (정보 출처)',
    explanation:'정보의 출처를 나타낼 때 사용. 문말에 「〜そうだ/〜らしい」가 따라오는 경우가 많음.',
    examples:[
      { ja:'天気予報によると、明日は雨だそうだ。', ko:'일기예보에 의하면 내일은 비라고 한다.' },
    ],
    similarGrammarIds:['g_n2_1'], tags:['표현','전문'] },
];
