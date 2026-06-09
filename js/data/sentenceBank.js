// 학습 문장 은행 (Sentence Bank).
//
// 목적: 회화 엔진/단어 학습/예문 풀에서 "사용자가 배운 문장만" 골라 쓰기 위한
// 인덱스. 모든 문장은 다른 데이터(vocab/grammar/reading/listening/conversation)에
// 이미 존재하거나 그 데이터에서 자연스럽게 파생된 문장 — 새 어휘/문법을 도입하지
// 않는다.
//
// SentenceItem:
//   id                     — 'sent_n5_001' 등
//   level                  — 'N5' | 'N4' | 'N3' | 'N2'
//   ja, ko                 — 일본어 / 한국어
//   sourceType             — 'vocab' | 'grammar' | 'reading' | 'listening' | 'conversation'
//   sourceId               — 해당 데이터셋의 실제 id (smoke 가 무결성 검증)
//   vocabIds   : string[]  — 문장이 사용하는 vocab id 들 (실제 vocab id)
//   grammarIds : string[]  — 문장이 사용하는 grammar id 들 (실제 grammar id)
//   situationTags : string[]  — 상황 분류 ('자기소개','가족','일상' …)
//   canUseInConversation : boolean  — 회화 엔진의 모범 답안/예시로 사용 가능한가
//
// 참조 무결성은 smoke.mjs 가 매번 강제. 라이선스: 본 프로젝트 창작.

export const sentenceBank = [
  // ── 자기소개 ────────────────────────────────────────────────
  { id:'sent_n5_001', level:'N5', ja:'私は学生です。', ko:'저는 학생입니다.',
    sourceType:'vocab', sourceId:'v_n5_19',
    vocabIds:['v_n5_19'], grammarIds:['g_n5_1'],
    situationTags:['자기소개','학교'], canUseInConversation:true },
  { id:'sent_n5_002', level:'N5', ja:'お名前は何ですか。', ko:'성함이 어떻게 되십니까?',
    sourceType:'vocab', sourceId:'v_n5_20',
    vocabIds:['v_n5_20'], grammarIds:['g_n5_1'],
    situationTags:['자기소개','인사'], canUseInConversation:true },
  { id:'sent_n5_003', level:'N5', ja:'私はミンです。', ko:'저는 민입니다.',
    sourceType:'conversation', sourceId:'conv_n5_self_intro',
    vocabIds:[], grammarIds:['g_n5_1'],
    situationTags:['자기소개'], canUseInConversation:true },
  { id:'sent_n5_004', level:'N5', ja:'はじめまして、田中です。', ko:'처음 뵙겠습니다. 다나카입니다.',
    sourceType:'listening', sourceId:'l_n5_8',
    vocabIds:[], grammarIds:['g_n5_1'],
    situationTags:['자기소개','인사'], canUseInConversation:true },
  { id:'sent_n5_005', level:'N5', ja:'韓国から来ました。', ko:'한국에서 왔습니다.',
    sourceType:'listening', sourceId:'l_n5_8',
    vocabIds:['v_n5_53'], grammarIds:[],
    situationTags:['자기소개'], canUseInConversation:true },

  // ── 가족 ────────────────────────────────────────────────────
  { id:'sent_n5_006', level:'N5', ja:'父は会社員です。', ko:'아버지는 회사원입니다.',
    sourceType:'vocab', sourceId:'v_n5_16',
    vocabIds:['v_n5_16'], grammarIds:['g_n5_1'],
    situationTags:['가족','자기소개'], canUseInConversation:true },
  { id:'sent_n5_007', level:'N5', ja:'母はパンを作ります。', ko:'어머니는 빵을 만듭니다.',
    sourceType:'vocab', sourceId:'v_n5_17',
    vocabIds:['v_n5_17'], grammarIds:['g_n5_6'],
    situationTags:['가족','식음'], canUseInConversation:true },
  { id:'sent_n5_008', level:'N5', ja:'うちの犬は元気です。', ko:'우리 집 개는 건강합니다.',
    sourceType:'vocab', sourceId:'v_n5_31',
    vocabIds:['v_n5_31'], grammarIds:['g_n5_18','g_n5_1'],
    situationTags:['가족','동물'], canUseInConversation:true },
  { id:'sent_n5_009', level:'N5', ja:'兄は大学で勉強しています。', ko:'형은 대학에서 공부하고 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_39',
    vocabIds:['v_n5_39'], grammarIds:['g_n5_4','g_n5_5'],
    situationTags:['가족','학교'], canUseInConversation:true },
  { id:'sent_n5_010', level:'N5', ja:'私の家族は四人です。', ko:'우리 가족은 네 명입니다.',
    sourceType:'reading', sourceId:'r_n5_2',
    vocabIds:[], grammarIds:['g_n5_18','g_n5_1'],
    situationTags:['가족','자기소개'], canUseInConversation:true },

  // ── 시간 / 하루 일과 ───────────────────────────────────────
  { id:'sent_n5_011', level:'N5', ja:'今日は土曜日です。', ko:'오늘은 토요일입니다.',
    sourceType:'vocab', sourceId:'v_n5_21',
    vocabIds:['v_n5_21'], grammarIds:['g_n5_1'],
    situationTags:['시간'], canUseInConversation:true },
  { id:'sent_n5_012', level:'N5', ja:'明日、映画を見ます。', ko:'내일 영화를 봅니다.',
    sourceType:'vocab', sourceId:'v_n5_22',
    vocabIds:['v_n5_22','v_n5_7'], grammarIds:['g_n5_6'],
    situationTags:['시간','취미'], canUseInConversation:true },
  { id:'sent_n5_013', level:'N5', ja:'昨日はとても寒かったです。', ko:'어제는 매우 추웠습니다.',
    sourceType:'vocab', sourceId:'v_n5_23',
    vocabIds:['v_n5_23','v_n5_58'], grammarIds:[],
    situationTags:['시간','날씨'], canUseInConversation:true },
  { id:'sent_n5_014', level:'N5', ja:'朝、コーヒーを飲みます。', ko:'아침에 커피를 마십니다.',
    sourceType:'vocab', sourceId:'v_n5_24',
    vocabIds:['v_n5_24','v_n5_3'], grammarIds:['g_n5_6'],
    situationTags:['일상','식음','시간'], canUseInConversation:true },
  { id:'sent_n5_015', level:'N5', ja:'夜は静かです。', ko:'밤은 조용합니다.',
    sourceType:'vocab', sourceId:'v_n5_25',
    vocabIds:['v_n5_25'], grammarIds:['g_n5_1'],
    situationTags:['시간','일상'], canUseInConversation:true },
  { id:'sent_n5_016', level:'N5', ja:'毎朝6時に起きます。', ko:'매일 아침 6시에 일어납니다.',
    sourceType:'vocab', sourceId:'v_n5_51',
    vocabIds:['v_n5_51'], grammarIds:[],
    situationTags:['일상','시간'], canUseInConversation:true },
  { id:'sent_n5_017', level:'N5', ja:'夜11時に寝ます。', ko:'밤 11시에 잡니다.',
    sourceType:'vocab', sourceId:'v_n5_52',
    vocabIds:['v_n5_25','v_n5_52'], grammarIds:[],
    situationTags:['일상','시간'], canUseInConversation:true },
  { id:'sent_n5_018', level:'N5', ja:'七時に家に帰ります。', ko:'7시에 집에 돌아갑니다.',
    sourceType:'vocab', sourceId:'v_n5_54',
    vocabIds:['v_n5_38','v_n5_54'], grammarIds:[],
    situationTags:['일상','시간'], canUseInConversation:true },

  // ── 음식 / 카페 / 쇼핑 ─────────────────────────────────────
  { id:'sent_n5_019', level:'N5', ja:'お茶を一杯ください。', ko:'차 한 잔 주세요.',
    sourceType:'vocab', sourceId:'v_n5_37',
    vocabIds:['v_n5_37'], grammarIds:[],
    situationTags:['카페','요청','식음'], canUseInConversation:true },
  { id:'sent_n5_020', level:'N5', ja:'コーヒーを一つください。', ko:'커피 하나 주세요.',
    sourceType:'listening', sourceId:'l_n5_2',
    vocabIds:[], grammarIds:[],
    situationTags:['카페','요청'], canUseInConversation:true },
  { id:'sent_n5_021', level:'N5', ja:'野菜を毎日食べます。', ko:'채소를 매일 먹습니다.',
    sourceType:'vocab', sourceId:'v_n5_35',
    vocabIds:['v_n5_35','v_n5_2'], grammarIds:['g_n5_6'],
    situationTags:['식음','일상'], canUseInConversation:true },
  { id:'sent_n5_022', level:'N5', ja:'果物が好きです。', ko:'과일을 좋아합니다.',
    sourceType:'vocab', sourceId:'v_n5_36',
    vocabIds:['v_n5_36'], grammarIds:['g_n5_21'],
    situationTags:['식음','취향'], canUseInConversation:true },
  { id:'sent_n5_023', level:'N5', ja:'もうご飯を食べましたか。', ko:'벌써 밥을 먹었습니까?',
    sourceType:'vocab', sourceId:'v_n5_33',
    vocabIds:['v_n5_33','v_n5_2'], grammarIds:['g_n5_6'],
    situationTags:['식음','일상'], canUseInConversation:true },
  { id:'sent_n5_024', level:'N5', ja:'このケーキは美味しいです。', ko:'이 케이크는 맛있습니다.',
    sourceType:'vocab', sourceId:'v_n5_59',
    vocabIds:['v_n5_59'], grammarIds:['g_n5_1'],
    situationTags:['식음'], canUseInConversation:true },
  { id:'sent_n5_025', level:'N5', ja:'新しい本を買いました。', ko:'새 책을 샀습니다.',
    sourceType:'vocab', sourceId:'v_n5_14',
    vocabIds:['v_n5_14','v_n5_5','v_n5_46'], grammarIds:['g_n5_6'],
    situationTags:['쇼핑','일상'], canUseInConversation:true },

  // ── 장소 / 이동 ────────────────────────────────────────────
  { id:'sent_n5_026', level:'N5', ja:'すみません、駅はどこですか。', ko:'실례합니다. 역은 어디입니까?',
    sourceType:'listening', sourceId:'l_n5_1',
    vocabIds:['v_n5_40'], grammarIds:['g_n5_1'],
    situationTags:['길안내'], canUseInConversation:true },
  { id:'sent_n5_027', level:'N5', ja:'駅まで歩きました。', ko:'역까지 걸었습니다.',
    sourceType:'vocab', sourceId:'v_n5_40',
    vocabIds:['v_n5_40'], grammarIds:['g_n5_17'],
    situationTags:['장소','교통'], canUseInConversation:true },
  { id:'sent_n5_028', level:'N5', ja:'父の車は赤いです。', ko:'아버지의 차는 빨갛습니다.',
    sourceType:'vocab', sourceId:'v_n5_45',
    vocabIds:['v_n5_16','v_n5_45'], grammarIds:['g_n5_18','g_n5_1'],
    situationTags:['가족','쇼핑'], canUseInConversation:true },
  { id:'sent_n5_029', level:'N5', ja:'公園を散歩します。', ko:'공원을 산책합니다.',
    sourceType:'vocab', sourceId:'v_n5_43',
    vocabIds:['v_n5_43'], grammarIds:[],
    situationTags:['일상','장소'], canUseInConversation:true },
  { id:'sent_n5_030', level:'N5', ja:'電車で会社に行きます。', ko:'전철로 회사에 갑니다.',
    sourceType:'vocab', sourceId:'v_n5_11',
    vocabIds:['v_n5_11','v_n5_6'], grammarIds:['g_n5_4','g_n5_3'],
    situationTags:['교통','일상'], canUseInConversation:true },

  // ── 날씨 / 자연 ────────────────────────────────────────────
  { id:'sent_n5_031', level:'N5', ja:'今日は雨が降っています。', ko:'오늘은 비가 내리고 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_15',
    vocabIds:['v_n5_21','v_n5_15'], grammarIds:['g_n5_5'],
    situationTags:['날씨'], canUseInConversation:true },
  { id:'sent_n5_032', level:'N5', ja:'冬は雪が降ります。', ko:'겨울에는 눈이 내립니다.',
    sourceType:'vocab', sourceId:'v_n5_28',
    vocabIds:['v_n5_28'], grammarIds:[],
    situationTags:['날씨','계절'], canUseInConversation:true },
  { id:'sent_n5_033', level:'N5', ja:'夏は海で泳ぎます。', ko:'여름에는 바다에서 수영합니다.',
    sourceType:'vocab', sourceId:'v_n5_27',
    vocabIds:['v_n5_27','v_n5_29'], grammarIds:['g_n5_4'],
    situationTags:['계절','자연'], canUseInConversation:true },
  { id:'sent_n5_034', level:'N5', ja:'天気がいいですね。', ko:'날씨가 좋네요.',
    sourceType:'vocab', sourceId:'v_n5_60',
    vocabIds:['v_n5_60'], grammarIds:[],
    situationTags:['날씨','인사'], canUseInConversation:true },
  { id:'sent_n5_035', level:'N5', ja:'今日はとても暑いです。', ko:'오늘은 매우 덥습니다.',
    sourceType:'vocab', sourceId:'v_n5_57',
    vocabIds:['v_n5_21','v_n5_57'], grammarIds:['g_n5_1'],
    situationTags:['날씨','시간'], canUseInConversation:true },

  // ── 취미 / 일상 동사 ───────────────────────────────────────
  { id:'sent_n5_036', level:'N5', ja:'毎日新聞を読みます。', ko:'매일 신문을 읽습니다.',
    sourceType:'vocab', sourceId:'v_n5_47',
    vocabIds:['v_n5_47'], grammarIds:['g_n5_6'],
    situationTags:['취미','일상'], canUseInConversation:true },
  { id:'sent_n5_037', level:'N5', ja:'ノートに名前を書きます。', ko:'노트에 이름을 씁니다.',
    sourceType:'vocab', sourceId:'v_n5_48',
    vocabIds:['v_n5_20','v_n5_48'], grammarIds:['g_n5_6'],
    situationTags:['일상','학교'], canUseInConversation:true },
  { id:'sent_n5_038', level:'N5', ja:'音楽を聞きます。', ko:'음악을 듣습니다.',
    sourceType:'vocab', sourceId:'v_n5_50',
    vocabIds:['v_n5_50'], grammarIds:['g_n5_6'],
    situationTags:['취미'], canUseInConversation:true },
  { id:'sent_n5_039', level:'N5', ja:'友だちと話します。', ko:'친구와 이야기합니다.',
    sourceType:'vocab', sourceId:'v_n5_10',
    vocabIds:['v_n5_10','v_n5_49'], grammarIds:['g_n5_19'],
    situationTags:['일상','대화'], canUseInConversation:true },
  { id:'sent_n5_040', level:'N5', ja:'テレビを見ます。', ko:'TV를 봅니다.',
    sourceType:'vocab', sourceId:'v_n5_7',
    vocabIds:['v_n5_7'], grammarIds:['g_n5_6'],
    situationTags:['일상','취미'], canUseInConversation:true },
  { id:'sent_n5_041', level:'N5', ja:'駅で友だちを待っています。', ko:'역에서 친구를 기다리고 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_1',
    vocabIds:['v_n5_40','v_n5_10','v_n5_1'], grammarIds:['g_n5_4','g_n5_5'],
    situationTags:['일상','약속'], canUseInConversation:true },

  // ── 회화 권유 / 의뢰 / 허락 / 존재 ───────────────────────
  { id:'sent_n5_042', level:'N5', ja:'一緒に行きましょう。', ko:'같이 갑시다.',
    sourceType:'grammar', sourceId:'g_n5_10',
    vocabIds:['v_n5_6'], grammarIds:['g_n5_10'],
    situationTags:['권유'], canUseInConversation:true },
  { id:'sent_n5_043', level:'N5', ja:'一緒にご飯を食べませんか。', ko:'같이 밥 먹지 않을래요?',
    sourceType:'grammar', sourceId:'g_n5_11',
    vocabIds:['v_n5_33','v_n5_2'], grammarIds:['g_n5_11'],
    situationTags:['권유','식음'], canUseInConversation:true },
  { id:'sent_n5_044', level:'N5', ja:'ここに名前を書いてください。', ko:'여기에 이름을 써 주세요.',
    sourceType:'grammar', sourceId:'g_n5_13',
    vocabIds:['v_n5_20','v_n5_48'], grammarIds:['g_n5_13'],
    situationTags:['의뢰'], canUseInConversation:true },
  { id:'sent_n5_045', level:'N5', ja:'写真を撮ってもいいですか。', ko:'사진을 찍어도 됩니까?',
    sourceType:'grammar', sourceId:'g_n5_14',
    vocabIds:['v_n5_61'], grammarIds:['g_n5_14'],
    situationTags:['허락'], canUseInConversation:true },
  { id:'sent_n5_046', level:'N5', ja:'机の上に本があります。', ko:'책상 위에 책이 있습니다.',
    sourceType:'grammar', sourceId:'g_n5_7',
    vocabIds:['v_n5_5'], grammarIds:['g_n5_7'],
    situationTags:['일상'], canUseInConversation:true },
  { id:'sent_n5_047', level:'N5', ja:'部屋に猫がいます。', ko:'방에 고양이가 있습니다.',
    sourceType:'grammar', sourceId:'g_n5_8',
    vocabIds:['v_n5_32'], grammarIds:['g_n5_8'],
    situationTags:['일상','동물'], canUseInConversation:true },
  { id:'sent_n5_048', level:'N5', ja:'はい、学生です。', ko:'네, 학생입니다.',
    sourceType:'conversation', sourceId:'conv_n5_self_intro',
    vocabIds:['v_n5_19'], grammarIds:['g_n5_1'],
    situationTags:['자기소개','학교'], canUseInConversation:true },
  { id:'sent_n5_049', level:'N5', ja:'日本語の先生は優しいです。', ko:'일본어 선생님은 친절합니다.',
    sourceType:'vocab', sourceId:'v_n5_18',
    vocabIds:['v_n5_18'], grammarIds:['g_n5_18','g_n5_1'],
    situationTags:['학교'], canUseInConversation:true },
  { id:'sent_n5_050', level:'N5', ja:'私は猫が好きです。', ko:'저는 고양이를 좋아합니다.',
    sourceType:'grammar', sourceId:'g_n5_21',
    vocabIds:['v_n5_32'], grammarIds:['g_n5_21'],
    situationTags:['취향','동물'], canUseInConversation:true },

  // ── 2.1 라운드 확장 ──
  { id:'sent_n5_051', level:'N5', ja:'兄は会社で働きます。', ko:'형은 회사에서 일합니다.',
    sourceType:'vocab', sourceId:'v_n5_62',
    vocabIds:['v_n5_62'], grammarIds:['g_n5_4'],
    situationTags:['가족','일상'], canUseInConversation:true },
  { id:'sent_n5_052', level:'N5', ja:'妹は学校が好きです。', ko:'여동생은 학교를 좋아합니다.',
    sourceType:'vocab', sourceId:'v_n5_65',
    vocabIds:['v_n5_65','v_n5_4'], grammarIds:['g_n5_21'],
    situationTags:['가족','학교'], canUseInConversation:true },
  { id:'sent_n5_053', level:'N5', ja:'土曜日に公園へ行きました。', ko:'토요일에 공원에 갔습니다.',
    sourceType:'vocab', sourceId:'v_n5_70',
    vocabIds:['v_n5_70','v_n5_43','v_n5_6'], grammarIds:[],
    situationTags:['일상','약속'], canUseInConversation:true },
  { id:'sent_n5_054', level:'N5', ja:'日曜日は家でゆっくりします。', ko:'일요일에는 집에서 쉽니다.',
    sourceType:'vocab', sourceId:'v_n5_71',
    vocabIds:['v_n5_71','v_n5_38','v_n5_93'], grammarIds:['g_n5_4'],
    situationTags:['일상','시간'], canUseInConversation:true },
  { id:'sent_n5_055', level:'N5', ja:'今、何時ですか。', ko:'지금 몇 시입니까?',
    sourceType:'vocab', sourceId:'v_n5_72',
    vocabIds:['v_n5_72'], grammarIds:['g_n5_23'],
    situationTags:['시간','인사'], canUseInConversation:true },
  { id:'sent_n5_056', level:'N5', ja:'私の部屋は静かです。', ko:'제 방은 조용합니다.',
    sourceType:'vocab', sourceId:'v_n5_73',
    vocabIds:['v_n5_73'], grammarIds:['g_n5_18','g_n5_1'],
    situationTags:['일상','장소'], canUseInConversation:true },
  { id:'sent_n5_057', level:'N5', ja:'図書館で勉強します。', ko:'도서관에서 공부합니다.',
    sourceType:'vocab', sourceId:'v_n5_74',
    vocabIds:['v_n5_74','v_n5_85','v_n5_93'], grammarIds:['g_n5_4'],
    situationTags:['학교','일상'], canUseInConversation:true },
  { id:'sent_n5_058', level:'N5', ja:'トイレはどこですか。', ko:'화장실은 어디입니까?',
    sourceType:'vocab', sourceId:'v_n5_75',
    vocabIds:['v_n5_75'], grammarIds:['g_n5_23'],
    situationTags:['길안내','일상'], canUseInConversation:true },
  { id:'sent_n5_059', level:'N5', ja:'朝、パンを食べます。', ko:'아침에 빵을 먹습니다.',
    sourceType:'vocab', sourceId:'v_n5_78',
    vocabIds:['v_n5_24','v_n5_78','v_n5_2'], grammarIds:['g_n5_6'],
    situationTags:['식음','일상','카페'], canUseInConversation:true },
  { id:'sent_n5_060', level:'N5', ja:'コーヒーを一杯ください。', ko:'커피 한 잔 주세요.',
    sourceType:'vocab', sourceId:'v_n5_79',
    vocabIds:['v_n5_79'], grammarIds:[],
    situationTags:['카페','요청','음식'], canUseInConversation:true },
  { id:'sent_n5_061', level:'N5', ja:'お金がありません。', ko:'돈이 없습니다.',
    sourceType:'vocab', sourceId:'v_n5_80',
    vocabIds:['v_n5_80','v_n5_94'], grammarIds:[],
    situationTags:['일상','쇼핑'], canUseInConversation:true },
  { id:'sent_n5_062', level:'N5', ja:'これは五百円です。', ko:'이것은 500엔입니다.',
    sourceType:'vocab', sourceId:'v_n5_81',
    vocabIds:['v_n5_81'], grammarIds:['g_n5_1'],
    situationTags:['쇼핑','음식'], canUseInConversation:true },
  { id:'sent_n5_063', level:'N5', ja:'明日は試験です。', ko:'내일은 시험입니다.',
    sourceType:'vocab', sourceId:'v_n5_83',
    vocabIds:['v_n5_22','v_n5_83'], grammarIds:['g_n5_1'],
    situationTags:['학교','시간'], canUseInConversation:true },
  { id:'sent_n5_064', level:'N5', ja:'毎日日本語を勉強します。', ko:'매일 일본어를 공부합니다.',
    sourceType:'vocab', sourceId:'v_n5_85',
    vocabIds:['v_n5_85','v_n5_93'], grammarIds:['g_n5_6'],
    situationTags:['학교','일상','자기소개'], canUseInConversation:true },
  { id:'sent_n5_065', level:'N5', ja:'週末に映画を見ます。', ko:'주말에 영화를 봅니다.',
    sourceType:'vocab', sourceId:'v_n5_86',
    vocabIds:['v_n5_86','v_n5_7'], grammarIds:['g_n5_6'],
    situationTags:['취미','일상'], canUseInConversation:true },
  { id:'sent_n5_066', level:'N5', ja:'音楽を聞くのが好きです。', ko:'음악 듣기를 좋아합니다.',
    sourceType:'vocab', sourceId:'v_n5_87',
    vocabIds:['v_n5_87','v_n5_50'], grammarIds:['g_n5_21'],
    situationTags:['취미','취향'], canUseInConversation:true },
  { id:'sent_n5_067', level:'N5', ja:'来月、旅行に行きます。', ko:'다음 달에 여행 갑니다.',
    sourceType:'vocab', sourceId:'v_n5_88',
    vocabIds:['v_n5_88','v_n5_6'], grammarIds:[],
    situationTags:['취미','일상','약속'], canUseInConversation:true },
  { id:'sent_n5_068', level:'N5', ja:'私も学生です。', ko:'저도 학생입니다.',
    sourceType:'grammar', sourceId:'g_n5_22',
    vocabIds:['v_n5_19'], grammarIds:['g_n5_22','g_n5_1'],
    situationTags:['자기소개','학교'], canUseInConversation:true },
  { id:'sent_n5_069', level:'N5', ja:'犬より猫のほうが好きです。', ko:'개보다 고양이가 더 좋습니다.',
    sourceType:'grammar', sourceId:'g_n5_26',
    vocabIds:['v_n5_31','v_n5_32'], grammarIds:['g_n5_26','g_n5_21'],
    situationTags:['취향','동물'], canUseInConversation:true },
  { id:'sent_n5_070', level:'N5', ja:'寝る前に本を読みます。', ko:'자기 전에 책을 읽습니다.',
    sourceType:'grammar', sourceId:'g_n5_28',
    vocabIds:['v_n5_52','v_n5_5','v_n5_47'], grammarIds:['g_n5_28','g_n5_6'],
    situationTags:['일상','시간'], canUseInConversation:true },

  // ── 2.2 라운드 확장 ──
  { id:'sent_n5_071', level:'N5', ja:'公園に子供がいます。', ko:'공원에 아이가 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_102',
    vocabIds:['v_n5_43','v_n5_102'], grammarIds:['g_n5_8'],
    situationTags:['가족','일상'], canUseInConversation:true },
  { id:'sent_n5_072', level:'N5', ja:'男の人が話しています。', ko:'남자가 이야기하고 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_103',
    vocabIds:['v_n5_103','v_n5_49'], grammarIds:['g_n5_2','g_n5_5'],
    situationTags:['일상','자기소개'], canUseInConversation:true },
  { id:'sent_n5_073', level:'N5', ja:'女の人が本を読みます。', ko:'여자가 책을 읽습니다.',
    sourceType:'vocab', sourceId:'v_n5_104',
    vocabIds:['v_n5_104','v_n5_5','v_n5_47'], grammarIds:['g_n5_2','g_n5_6'],
    situationTags:['일상'], canUseInConversation:true },
  { id:'sent_n5_074', level:'N5', ja:'一時に会いましょう。', ko:'1시에 만납시다.',
    sourceType:'vocab', sourceId:'v_n5_105',
    vocabIds:['v_n5_105'], grammarIds:['g_n5_10'],
    situationTags:['약속','시간'], canUseInConversation:true },
  { id:'sent_n5_075', level:'N5', ja:'十分待ってください。', ko:'10분 기다려 주세요.',
    sourceType:'vocab', sourceId:'v_n5_106',
    vocabIds:['v_n5_106','v_n5_1'], grammarIds:['g_n5_13'],
    situationTags:['약속','요청'], canUseInConversation:true },
  { id:'sent_n5_076', level:'N5', ja:'三時半に来ます。', ko:'3시 반에 옵니다.',
    sourceType:'vocab', sourceId:'v_n5_107',
    vocabIds:['v_n5_107','v_n5_53'], grammarIds:[],
    situationTags:['약속','시간'], canUseInConversation:true },
  { id:'sent_n5_077', level:'N5', ja:'食事の後で散歩します。', ko:'식사 후에 산책합니다.',
    sourceType:'grammar', sourceId:'g_n5_29',
    vocabIds:['v_n5_108','v_n5_89'], grammarIds:['g_n5_18','g_n5_29'],
    situationTags:['일상','시간'], canUseInConversation:true },
  { id:'sent_n5_078', level:'N5', ja:'空港まで電車で行きます。', ko:'공항까지 전철로 갑니다.',
    sourceType:'vocab', sourceId:'v_n5_109',
    vocabIds:['v_n5_109','v_n5_11','v_n5_6'], grammarIds:['g_n5_17','g_n5_4','g_n5_3'],
    situationTags:['길안내','교통','여행'], canUseInConversation:true },
  { id:'sent_n5_079', level:'N5', ja:'毎朝会社に行きます。', ko:'매일 아침 회사에 갑니다.',
    sourceType:'vocab', sourceId:'v_n5_110',
    vocabIds:['v_n5_110','v_n5_24','v_n5_6'], grammarIds:['g_n5_3'],
    situationTags:['일상','시간'], canUseInConversation:true },
  { id:'sent_n5_080', level:'N5', ja:'かばんの中に本があります。', ko:'가방 안에 책이 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_111',
    vocabIds:['v_n5_111','v_n5_5'], grammarIds:['g_n5_18','g_n5_7'],
    situationTags:['일상'], canUseInConversation:true },
  { id:'sent_n5_081', level:'N5', ja:'銀行の横に店があります。', ko:'은행 옆에 가게가 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_112',
    vocabIds:['v_n5_112','v_n5_41','v_n5_44'], grammarIds:['g_n5_18','g_n5_7'],
    situationTags:['길안내','장소'], canUseInConversation:true },
  { id:'sent_n5_082', level:'N5', ja:'飲み物は何にしますか。', ko:'음료는 무엇으로 하시겠어요?',
    sourceType:'vocab', sourceId:'v_n5_113',
    vocabIds:['v_n5_113'], grammarIds:['g_n5_23'],
    situationTags:['카페','음식','요청'], canUseInConversation:true },
  { id:'sent_n5_083', level:'N5', ja:'お酒は飲みません。', ko:'술은 마시지 않습니다.',
    sourceType:'vocab', sourceId:'v_n5_114',
    vocabIds:['v_n5_114','v_n5_3'], grammarIds:['g_n5_9'],
    situationTags:['자기소개','음식'], canUseInConversation:true },
  { id:'sent_n5_084', level:'N5', ja:'明日は晴れるでしょう。', ko:'내일은 맑겠지요.',
    sourceType:'grammar', sourceId:'g_n5_35',
    vocabIds:['v_n5_22'], grammarIds:['g_n5_35','g_n5_1'],
    situationTags:['날씨','일상'], canUseInConversation:true },
  { id:'sent_n5_085', level:'N5', ja:'スポーツが好きです。', ko:'스포츠를 좋아합니다.',
    sourceType:'vocab', sourceId:'v_n5_120',
    vocabIds:['v_n5_120'], grammarIds:['g_n5_21'],
    situationTags:['자기소개','취미','취향'], canUseInConversation:true },

  // ── N5 대량 확장 1차 — 학교 생활 (conv_n5_school_life) ─────────
  { id:'sent_n5_086', level:'N5', ja:'英語の授業があります。', ko:'영어 수업이 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_189',
    vocabIds:['v_n5_189','v_n5_119'], grammarIds:['g_n5_18','g_n5_7'],
    situationTags:['학교','수업'], canUseInConversation:true },
  { id:'sent_n5_087', level:'N5', ja:'日本語の授業は楽しいです。', ko:'일본어 수업은 즐겁습니다.',
    sourceType:'vocab', sourceId:'v_n5_190',
    vocabIds:['v_n5_190','v_n5_119','v_n5_247'], grammarIds:['g_n5_18','g_n5_1'],
    situationTags:['학교','수업'], canUseInConversation:true },
  { id:'sent_n5_088', level:'N5', ja:'宿題はもう終わりました。', ko:'숙제는 벌써 끝났습니다.',
    sourceType:'grammar', sourceId:'g_n5_41',
    vocabIds:['v_n5_84','v_n5_236'], grammarIds:['g_n5_41'],
    situationTags:['학교','숙제'], canUseInConversation:true },
  { id:'sent_n5_089', level:'N5', ja:'まだ宿題が終わりません。', ko:'아직 숙제가 끝나지 않았습니다.',
    sourceType:'grammar', sourceId:'g_n5_40',
    vocabIds:['v_n5_84','v_n5_236'], grammarIds:['g_n5_40'],
    situationTags:['학교','숙제'], canUseInConversation:true },
  { id:'sent_n5_090', level:'N5', ja:'漢字を勉強しています。', ko:'한자를 공부하고 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_187',
    vocabIds:['v_n5_187','v_n5_85'], grammarIds:['g_n5_6','g_n5_5'],
    situationTags:['학교','공부'], canUseInConversation:true },
  { id:'sent_n5_091', level:'N5', ja:'ノートに名前を書きます。', ko:'노트에 이름을 씁니다.',
    sourceType:'vocab', sourceId:'v_n5_183',
    vocabIds:['v_n5_183','v_n5_20','v_n5_48'], grammarIds:['g_n5_6'],
    situationTags:['학교','일상'], canUseInConversation:true },
  { id:'sent_n5_092', level:'N5', ja:'質問があります。', ko:'질문이 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_185',
    vocabIds:['v_n5_185'], grammarIds:['g_n5_7'],
    situationTags:['학교','수업'], canUseInConversation:true },

  // ── 쇼핑 (conv_n5_shopping) ─────────────────────────────────────
  { id:'sent_n5_093', level:'N5', ja:'デパートでシャツを買いました。', ko:'백화점에서 셔츠를 샀습니다.',
    sourceType:'vocab', sourceId:'v_n5_177',
    vocabIds:['v_n5_177','v_n5_46'], grammarIds:['g_n5_4','g_n5_6'],
    situationTags:['쇼핑'], canUseInConversation:true },
  { id:'sent_n5_094', level:'N5', ja:'これはいくらですか。', ko:'이것은 얼마입니까?',
    sourceType:'grammar', sourceId:'g_n5_36',
    vocabIds:[], grammarIds:['g_n5_36','g_n5_1'],
    situationTags:['쇼핑','가격'], canUseInConversation:true },
  { id:'sent_n5_095', level:'N5', ja:'切符を一枚ください。', ko:'표 한 장 주세요.',
    sourceType:'vocab', sourceId:'v_n5_178',
    vocabIds:['v_n5_178','v_n5_141'], grammarIds:[],
    situationTags:['쇼핑','교통'], canUseInConversation:true },
  { id:'sent_n5_096', level:'N5', ja:'値段は千円です。', ko:'가격은 1000엔입니다.',
    sourceType:'vocab', sourceId:'v_n5_179',
    vocabIds:['v_n5_179','v_n5_148','v_n5_81'], grammarIds:['g_n5_1'],
    situationTags:['쇼핑','가격'], canUseInConversation:true },
  { id:'sent_n5_097', level:'N5', ja:'今日はセールで安いです。', ko:'오늘은 세일이라 쌉니다.',
    sourceType:'vocab', sourceId:'v_n5_182',
    vocabIds:['v_n5_182','v_n5_21','v_n5_12'], grammarIds:['g_n5_4','g_n5_1'],
    situationTags:['쇼핑'], canUseInConversation:true },
  { id:'sent_n5_098', level:'N5', ja:'スーパーで卵を買います。', ko:'슈퍼에서 계란을 삽니다.',
    sourceType:'vocab', sourceId:'v_n5_166',
    vocabIds:['v_n5_166','v_n5_171','v_n5_46'], grammarIds:['g_n5_4','g_n5_6'],
    situationTags:['쇼핑','음식'], canUseInConversation:true },
  { id:'sent_n5_099', level:'N5', ja:'コンビニでお茶を買いました。', ko:'편의점에서 차를 샀습니다.',
    sourceType:'vocab', sourceId:'v_n5_167',
    vocabIds:['v_n5_167','v_n5_37','v_n5_46'], grammarIds:['g_n5_4','g_n5_6'],
    situationTags:['쇼핑','카페'], canUseInConversation:true },

  // ── 전화하기 (conv_n5_phone) ───────────────────────────────────
  { id:'sent_n5_100', level:'N5', ja:'もしもし、田中さんですか。', ko:'여보세요, 다나카 씨입니까?',
    sourceType:'conversation', sourceId:'conv_n5_phone',
    vocabIds:[], grammarIds:['g_n5_1','g_n5_36'],
    situationTags:['전화','인사'], canUseInConversation:true },
  { id:'sent_n5_101', level:'N5', ja:'明日、三時に会いましょう。', ko:'내일 3시에 만납시다.',
    sourceType:'vocab', sourceId:'v_n5_143',
    vocabIds:['v_n5_22','v_n5_143'], grammarIds:['g_n5_10'],
    situationTags:['전화','약속','시간'], canUseInConversation:true },
  { id:'sent_n5_102', level:'N5', ja:'一時はちょっと忙しいです。', ko:'1시는 좀 바쁩니다.',
    sourceType:'vocab', sourceId:'v_n5_249',
    vocabIds:['v_n5_105','v_n5_249'], grammarIds:['g_n5_1'],
    situationTags:['전화','약속'], canUseInConversation:true },
  { id:'sent_n5_103', level:'N5', ja:'後で電話します。', ko:'나중에 전화하겠습니다.',
    sourceType:'vocab', sourceId:'v_n5_108',
    vocabIds:['v_n5_108'], grammarIds:[],
    situationTags:['전화','약속'], canUseInConversation:true },
  { id:'sent_n5_104', level:'N5', ja:'今、忙しいですか。', ko:'지금 바쁩니까?',
    sourceType:'vocab', sourceId:'v_n5_72',
    vocabIds:['v_n5_72','v_n5_249'], grammarIds:['g_n5_36'],
    situationTags:['전화','시간'], canUseInConversation:true },
  { id:'sent_n5_105', level:'N5', ja:'明日、来てください。', ko:'내일 와주세요.',
    sourceType:'vocab', sourceId:'v_n5_53',
    vocabIds:['v_n5_22','v_n5_53'], grammarIds:['g_n5_13'],
    situationTags:['전화','약속'], canUseInConversation:true },

  // ── 병원·약국 (conv_n5_hospital) ───────────────────────────────
  { id:'sent_n5_106', level:'N5', ja:'頭が痛いです。', ko:'머리가 아픕니다.',
    sourceType:'vocab', sourceId:'v_n5_227',
    vocabIds:['v_n5_227'], grammarIds:['g_n5_2','g_n5_1'],
    situationTags:['병원','건강','몸'], canUseInConversation:true },
  { id:'sent_n5_107', level:'N5', ja:'目が痛いです。', ko:'눈이 아픕니다.',
    sourceType:'vocab', sourceId:'v_n5_221',
    vocabIds:['v_n5_221'], grammarIds:['g_n5_2','g_n5_1'],
    situationTags:['병원','건강','몸'], canUseInConversation:true },
  { id:'sent_n5_108', level:'N5', ja:'薬を飲んでください。', ko:'약을 먹어주세요.',
    sourceType:'vocab', sourceId:'v_n5_230',
    vocabIds:['v_n5_230','v_n5_3'], grammarIds:['g_n5_13','g_n5_6'],
    situationTags:['병원','건강'], canUseInConversation:true },
  { id:'sent_n5_109', level:'N5', ja:'医者に行きます。', ko:'의사에게 갑니다.',
    sourceType:'vocab', sourceId:'v_n5_229',
    vocabIds:['v_n5_229','v_n5_6'], grammarIds:['g_n5_3'],
    situationTags:['병원','건강'], canUseInConversation:true },
  { id:'sent_n5_110', level:'N5', ja:'口を開けてください。', ko:'입을 벌려주세요.',
    sourceType:'vocab', sourceId:'v_n5_223',
    vocabIds:['v_n5_223','v_n5_237'], grammarIds:['g_n5_13','g_n5_6'],
    situationTags:['병원','몸'], canUseInConversation:true },
  { id:'sent_n5_111', level:'N5', ja:'昨日から体が痛いです。', ko:'어제부터 몸이 아픕니다.',
    sourceType:'vocab', sourceId:'v_n5_228',
    vocabIds:['v_n5_23','v_n5_228'], grammarIds:['g_n5_2','g_n5_1'],
    situationTags:['병원','건강','시간'], canUseInConversation:true },

  // ── 가족 보강 ───────────────────────────────────────────────────
  { id:'sent_n5_112', level:'N5', ja:'家族と一緒に住んでいます。', ko:'가족과 함께 살고 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_134',
    vocabIds:['v_n5_134'], grammarIds:['g_n5_19','g_n5_5'],
    situationTags:['가족','자기소개'], canUseInConversation:true },
  { id:'sent_n5_113', level:'N5', ja:'お父さんは会社員です。', ko:'아버님은 회사원입니다.',
    sourceType:'vocab', sourceId:'v_n5_139',
    vocabIds:['v_n5_139'], grammarIds:['g_n5_1'],
    situationTags:['가족','자기소개'], canUseInConversation:true },
  { id:'sent_n5_114', level:'N5', ja:'祖父は元気です。', ko:'할아버지는 건강합니다.',
    sourceType:'vocab', sourceId:'v_n5_137',
    vocabIds:['v_n5_137','v_n5_101'], grammarIds:['g_n5_1'],
    situationTags:['가족'], canUseInConversation:true },
  { id:'sent_n5_115', level:'N5', ja:'赤ちゃんが寝ています。', ko:'아기가 자고 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_133',
    vocabIds:['v_n5_133','v_n5_52'], grammarIds:['g_n5_2','g_n5_5'],
    situationTags:['가족','일상'], canUseInConversation:true },

  // ── 카페·식음 보강 ─────────────────────────────────────────────
  { id:'sent_n5_116', level:'N5', ja:'コーヒーと牛乳をください。', ko:'커피와 우유 주세요.',
    sourceType:'vocab', sourceId:'v_n5_168',
    vocabIds:['v_n5_79','v_n5_168'], grammarIds:['g_n5_19'],
    situationTags:['카페','음식'], canUseInConversation:true },
  { id:'sent_n5_117', level:'N5', ja:'ジュースを飲みますか。', ko:'주스를 마시겠습니까?',
    sourceType:'vocab', sourceId:'v_n5_169',
    vocabIds:['v_n5_169','v_n5_3'], grammarIds:['g_n5_6','g_n5_23'],
    situationTags:['카페','음식'], canUseInConversation:true },
  { id:'sent_n5_118', level:'N5', ja:'ラーメンを注文しました。', ko:'라면을 주문했습니다.',
    sourceType:'vocab', sourceId:'v_n5_175',
    vocabIds:['v_n5_175','v_n5_180'], grammarIds:['g_n5_6'],
    situationTags:['식당'], canUseInConversation:true },
  { id:'sent_n5_119', level:'N5', ja:'メニューを見せてください。', ko:'메뉴를 보여주세요.',
    sourceType:'vocab', sourceId:'v_n5_181',
    vocabIds:['v_n5_181','v_n5_7'], grammarIds:['g_n5_13','g_n5_6'],
    situationTags:['식당'], canUseInConversation:true },
  { id:'sent_n5_120', level:'N5', ja:'寿司が一番好きです。', ko:'초밥을 가장 좋아합니다.',
    sourceType:'vocab', sourceId:'v_n5_174',
    vocabIds:['v_n5_174'], grammarIds:['g_n5_21'],
    situationTags:['식당','취향'], canUseInConversation:true },

  // ── 길안내·교통 보강 ──────────────────────────────────────────
  { id:'sent_n5_121', level:'N5', ja:'バスで会社に行きます。', ko:'버스로 회사에 갑니다.',
    sourceType:'vocab', sourceId:'v_n5_161',
    vocabIds:['v_n5_161','v_n5_110','v_n5_6'], grammarIds:['g_n5_4','g_n5_3'],
    situationTags:['길안내','교통','일상'], canUseInConversation:true },
  { id:'sent_n5_122', level:'N5', ja:'自転車で公園へ行きます。', ko:'자전거로 공원에 갑니다.',
    sourceType:'vocab', sourceId:'v_n5_163',
    vocabIds:['v_n5_163','v_n5_43','v_n5_6'], grammarIds:['g_n5_4'],
    situationTags:['길안내','교통','취미'], canUseInConversation:true },
  { id:'sent_n5_123', level:'N5', ja:'道をまっすぐ行ってください。', ko:'길을 똑바로 가세요.',
    sourceType:'vocab', sourceId:'v_n5_160',
    vocabIds:['v_n5_160','v_n5_6'], grammarIds:['g_n5_13'],
    situationTags:['길안내'], canUseInConversation:true },
  { id:'sent_n5_124', level:'N5', ja:'タクシーで駅へ行きます。', ko:'택시로 역에 갑니다.',
    sourceType:'vocab', sourceId:'v_n5_162',
    vocabIds:['v_n5_162','v_n5_40','v_n5_6'], grammarIds:['g_n5_4'],
    situationTags:['길안내','교통'], canUseInConversation:true },

  // ── 약속·시간 보강 ─────────────────────────────────────────────
  { id:'sent_n5_125', level:'N5', ja:'三時半に駅で会いましょう。', ko:'3시 반에 역에서 만납시다.',
    sourceType:'vocab', sourceId:'v_n5_107',
    vocabIds:['v_n5_143','v_n5_107','v_n5_40'], grammarIds:['g_n5_4','g_n5_10'],
    situationTags:['약속','시간'], canUseInConversation:true },
  { id:'sent_n5_126', level:'N5', ja:'午前十時に出かけます。', ko:'오전 10시에 외출합니다.',
    sourceType:'vocab', sourceId:'v_n5_154',
    vocabIds:['v_n5_154','v_n5_146','v_n5_240'], grammarIds:[],
    situationTags:['약속','시간','일상'], canUseInConversation:true },
  { id:'sent_n5_127', level:'N5', ja:'午後は雨が降ります。', ko:'오후에는 비가 내립니다.',
    sourceType:'vocab', sourceId:'v_n5_155',
    vocabIds:['v_n5_155','v_n5_15'], grammarIds:['g_n5_2'],
    situationTags:['날씨','시간'], canUseInConversation:true },
  { id:'sent_n5_128', level:'N5', ja:'今週は忙しいです。', ko:'이번 주는 바쁩니다.',
    sourceType:'vocab', sourceId:'v_n5_151',
    vocabIds:['v_n5_151','v_n5_249'], grammarIds:['g_n5_1'],
    situationTags:['약속','시간'], canUseInConversation:true },

  // ── 날씨·자연 보강 ─────────────────────────────────────────────
  { id:'sent_n5_129', level:'N5', ja:'今日は晴れです。', ko:'오늘은 맑음입니다.',
    sourceType:'vocab', sourceId:'v_n5_217',
    vocabIds:['v_n5_21','v_n5_217'], grammarIds:['g_n5_1'],
    situationTags:['날씨'], canUseInConversation:true },
  { id:'sent_n5_130', level:'N5', ja:'明日は曇りでしょう。', ko:'내일은 흐리겠지요.',
    sourceType:'vocab', sourceId:'v_n5_216',
    vocabIds:['v_n5_22','v_n5_216'], grammarIds:['g_n5_35'],
    situationTags:['날씨'], canUseInConversation:true },
  { id:'sent_n5_131', level:'N5', ja:'春は暖かいです。', ko:'봄은 따뜻합니다.',
    sourceType:'vocab', sourceId:'v_n5_218',
    vocabIds:['v_n5_218'], grammarIds:['g_n5_1'],
    situationTags:['날씨','계절'], canUseInConversation:true },
  { id:'sent_n5_132', level:'N5', ja:'秋は涼しいです。', ko:'가을은 시원합니다.',
    sourceType:'vocab', sourceId:'v_n5_219',
    vocabIds:['v_n5_219'], grammarIds:['g_n5_1'],
    situationTags:['날씨','계절'], canUseInConversation:true },
  { id:'sent_n5_133', level:'N5', ja:'夜空に月と星が見えます。', ko:'밤하늘에 달과 별이 보입니다.',
    sourceType:'vocab', sourceId:'v_n5_152',
    vocabIds:['v_n5_25','v_n5_152','v_n5_124','v_n5_7'], grammarIds:['g_n5_19'],
    situationTags:['자연','날씨'], canUseInConversation:true },

  // ── 몸·건강·일상 ───────────────────────────────────────────────
  { id:'sent_n5_134', level:'N5', ja:'手を洗います。', ko:'손을 씻습니다.',
    sourceType:'vocab', sourceId:'v_n5_225',
    vocabIds:['v_n5_225'], grammarIds:['g_n5_6'],
    situationTags:['일상','건강'], canUseInConversation:true },
  { id:'sent_n5_135', level:'N5', ja:'足が痛いから、休みます。', ko:'발이 아파서 쉽니다.',
    sourceType:'vocab', sourceId:'v_n5_226',
    vocabIds:['v_n5_226'], grammarIds:['g_n5_16'],
    situationTags:['건강','일상'], canUseInConversation:true },
  { id:'sent_n5_136', level:'N5', ja:'毎朝走ります。', ko:'매일 아침 달립니다.',
    sourceType:'vocab', sourceId:'v_n5_209',
    vocabIds:['v_n5_209','v_n5_24'], grammarIds:[],
    situationTags:['취미','일상','건강'], canUseInConversation:true },
  { id:'sent_n5_137', level:'N5', ja:'夏に海で泳ぎます。', ko:'여름에 바다에서 수영합니다.',
    sourceType:'vocab', sourceId:'v_n5_208',
    vocabIds:['v_n5_27','v_n5_29','v_n5_208'], grammarIds:['g_n5_4'],
    situationTags:['취미','계절'], canUseInConversation:true },

  // ── 집·생활·일상 ───────────────────────────────────────────────
  { id:'sent_n5_138', level:'N5', ja:'部屋の窓を開けます。', ko:'방의 창문을 엽니다.',
    sourceType:'vocab', sourceId:'v_n5_199',
    vocabIds:['v_n5_73','v_n5_199','v_n5_237'], grammarIds:['g_n5_18','g_n5_6'],
    situationTags:['집','일상'], canUseInConversation:true },
  { id:'sent_n5_139', level:'N5', ja:'夜にお風呂に入ります。', ko:'밤에 목욕을 합니다.',
    sourceType:'vocab', sourceId:'v_n5_195',
    vocabIds:['v_n5_25','v_n5_195','v_n5_127'], grammarIds:[],
    situationTags:['집','일상'], canUseInConversation:true },
  { id:'sent_n5_140', level:'N5', ja:'キッチンで料理を作ります。', ko:'부엌에서 요리를 만듭니다.',
    sourceType:'vocab', sourceId:'v_n5_193',
    vocabIds:['v_n5_193','v_n5_121','v_n5_235'], grammarIds:['g_n5_4','g_n5_6'],
    situationTags:['집','음식','일상'], canUseInConversation:true },
  { id:'sent_n5_141', level:'N5', ja:'ドアを閉めてください。', ko:'문을 닫아주세요.',
    sourceType:'vocab', sourceId:'v_n5_202',
    vocabIds:['v_n5_202','v_n5_238'], grammarIds:['g_n5_13'],
    situationTags:['집','요청'], canUseInConversation:true },
  { id:'sent_n5_142', level:'N5', ja:'椅子に座ってください。', ko:'의자에 앉아주세요.',
    sourceType:'vocab', sourceId:'v_n5_196',
    vocabIds:['v_n5_196','v_n5_232'], grammarIds:['g_n5_13'],
    situationTags:['집','요청'], canUseInConversation:true },

  // ── 취미·일상 보강 ─────────────────────────────────────────────
  { id:'sent_n5_143', level:'N5', ja:'カラオケで歌います。', ko:'노래방에서 노래합니다.',
    sourceType:'vocab', sourceId:'v_n5_207',
    vocabIds:['v_n5_207'], grammarIds:['g_n5_4'],
    situationTags:['취미'], canUseInConversation:true },
  { id:'sent_n5_144', level:'N5', ja:'夜、テレビを見ます。', ko:'밤에 텔레비전을 봅니다.',
    sourceType:'vocab', sourceId:'v_n5_204',
    vocabIds:['v_n5_25','v_n5_204','v_n5_7'], grammarIds:['g_n5_6'],
    situationTags:['취미','일상','시간'], canUseInConversation:true },
  { id:'sent_n5_145', level:'N5', ja:'毎日新聞を読んでいます。', ko:'매일 신문을 읽고 있습니다.',
    sourceType:'vocab', sourceId:'v_n5_205',
    vocabIds:['v_n5_205','v_n5_47'], grammarIds:['g_n5_6','g_n5_5'],
    situationTags:['일상','취미'], canUseInConversation:true },

  // ── 자기소개·인사 ──────────────────────────────────────────────
  { id:'sent_n5_146', level:'N5', ja:'私は留学生です。', ko:'저는 유학생입니다.',
    sourceType:'vocab', sourceId:'v_n5_192',
    vocabIds:['v_n5_192'], grammarIds:['g_n5_1'],
    situationTags:['자기소개','학교'], canUseInConversation:true },
  { id:'sent_n5_147', level:'N5', ja:'こんにちは、元気ですか。', ko:'안녕하세요, 잘 지내세요?',
    sourceType:'vocab', sourceId:'v_n5_130',
    vocabIds:['v_n5_130','v_n5_101'], grammarIds:['g_n5_36'],
    situationTags:['인사','자기소개'], canUseInConversation:true },
  { id:'sent_n5_148', level:'N5', ja:'おはようございます。', ko:'안녕하세요 (아침).',
    sourceType:'vocab', sourceId:'v_n5_129',
    vocabIds:['v_n5_129'], grammarIds:[],
    situationTags:['인사','일상'], canUseInConversation:true },

  // ── 색·일상 보강 ───────────────────────────────────────────────
  { id:'sent_n5_149', level:'N5', ja:'空が青いです。', ko:'하늘이 파랗습니다.',
    sourceType:'vocab', sourceId:'v_n5_244',
    vocabIds:['v_n5_123','v_n5_244'], grammarIds:['g_n5_2','g_n5_1'],
    situationTags:['날씨','자연'], canUseInConversation:true },
  { id:'sent_n5_150', level:'N5', ja:'赤い花がきれいです。', ko:'빨간 꽃이 예쁩니다.',
    sourceType:'vocab', sourceId:'v_n5_243',
    vocabIds:['v_n5_243','v_n5_30'], grammarIds:['g_n5_2','g_n5_1'],
    situationTags:['자연','일상'], canUseInConversation:true },

  // ─── N4 1차 시드 (라운드 14) — 100건 ───────────────────────────────
  ...n4SentenceBank(),
];

function n4SentenceBank() {
  const arr = [];
  function s(id, ja, ko, source, src, vIds, gIds, tags, cic, readings) {
    arr.push({ id, level:'N4', ja, ko,
      sourceType:source, sourceId:src,
      vocabIds:vIds, grammarIds:gIds,
      situationTags:tags, canUseInConversation:cic,
      readings: readings || [] });
  }
  // 약속·일정
  s('sent_n4_001','明日の約束を変えてもいいですか。','내일 약속을 바꿔도 될까요?','grammar','g_n4_29',['v_n4_37','v_n4_26'],['g_n4_29','g_n5_13'],['약속'],true,[{text:'明日',reading:'あした'},{text:'約束',reading:'やくそく'},{text:'変えて',reading:'かえて'}]);
  s('sent_n4_002','急に仕事が入ってしまいました。','갑자기 일이 생겨 버렸습니다.','grammar','g_n4_1',['v_n4_63','v_n4_245'],['g_n4_1'],['약속','회사'],true,[{text:'急に',reading:'きゅうに'},{text:'仕事',reading:'しごと'},{text:'入って',reading:'はいって'}]);
  s('sent_n4_003','五時に会えますか。','5시에 만날 수 있을까요?','grammar','g_n4_27',['v_n4_36'],['g_n4_27'],['약속'],true,[{text:'五時',reading:'ごじ'},{text:'会え',reading:'あえ'}]);
  s('sent_n4_004','明日は予定があるので行けません。','내일은 예정이 있어서 못 갑니다.','grammar','g_n4_17',['v_n4_36'],['g_n4_17'],['약속'],true,[{text:'明日',reading:'あした'},{text:'予定',reading:'よてい'},{text:'行け',reading:'いけ'}]);
  s('sent_n4_005','早く準備しておきましょう。','일찍 준비해 둡시다.','grammar','g_n4_2',['v_n4_1'],['g_n4_2','g_n5_10'],['일정'],true,[{text:'早く',reading:'はやく'},{text:'準備',reading:'じゅんび'}]);
  s('sent_n4_006','約束を忘れてしまいました。','약속을 잊어버렸습니다.','grammar','g_n4_1',['v_n4_37','v_n4_225'],['g_n4_1'],['약속'],true,[{text:'約束',reading:'やくそく'},{text:'忘れて',reading:'わすれて'}]);
  s('sent_n4_007','時間に間に合わないかもしれません。','시간에 못 맞출지도 모르겠습니다.','grammar','g_n4_19',['v_n4_2'],['g_n4_19'],['약속'],true,[{text:'時間',reading:'じかん'},{text:'間に合わない',reading:'まにあわない'}]);
  s('sent_n4_008','会議は三時に始まります。','회의는 3시에 시작됩니다.','vocab','v_n4_22',['v_n4_57','v_n4_22'],['g_n5_4'],['회사'],true,[{text:'会議',reading:'かいぎ'},{text:'三時',reading:'さんじ'},{text:'始まり',reading:'はじまり'}]);
  s('sent_n4_009','早めに連絡してください。','일찍 연락 주세요.','grammar','g_n5_13',[],['g_n5_13'],['약속'],true,[{text:'早めに',reading:'はやめに'},{text:'連絡',reading:'れんらく'}]);
  s('sent_n4_010','遅れてすみません。','늦어서 죄송합니다.','vocab','v_n4_45',['v_n4_45'],[],['약속','사과'],true,[{text:'遅れて',reading:'おくれて'}]);
  // 병원·건강
  s('sent_n4_011','熱があるので、休みます。','열이 있어서 쉽니다.','grammar','g_n4_17',['v_n4_148'],['g_n4_17'],['병원'],true,[{text:'熱',reading:'ねつ'},{text:'休み',reading:'やすみ'}]);
  s('sent_n4_012','頭が痛くて、薬を飲みました。','머리가 아파서 약을 먹었습니다.','vocab','v_n4_149',['v_n4_149','v_n4_150'],[],['병원'],true,[{text:'頭',reading:'あたま'},{text:'痛くて',reading:'いたくて'},{text:'薬',reading:'くすり'},{text:'飲み',reading:'のみ'}]);
  s('sent_n4_013','病院で予約を取りました。','병원에서 예약을 잡았습니다.','vocab','v_n4_35',['v_n4_147','v_n4_35'],[],['병원'],true,[{text:'病院',reading:'びょういん'},{text:'予約',reading:'よやく'},{text:'取り',reading:'とり'}]);
  s('sent_n4_014','風邪が治りました。','감기가 나았습니다.','vocab','v_n4_152',['v_n4_152'],[],['건강'],true,[{text:'風邪',reading:'かぜ'},{text:'治り',reading:'なおり'}]);
  s('sent_n4_015','医者に相談したほうがいいです。','의사에게 상담하는 것이 좋습니다.','vocab','v_n4_38',['v_n4_38'],[],['병원'],true,[{text:'医者',reading:'いしゃ'},{text:'相談',reading:'そうだん'}]);
  s('sent_n4_016','怪我をしないように気をつけてください。','다치지 않도록 조심하세요.','grammar','g_n4_24',['v_n4_151'],['g_n4_24','g_n5_13'],['건강'],true,[{text:'怪我',reading:'けが'},{text:'気',reading:'き'}]);
  s('sent_n4_017','薬を毎日飲まなければなりません。','약을 매일 먹어야 합니다.','grammar','g_n4_3',['v_n4_150'],['g_n4_3'],['건강'],true,[{text:'薬',reading:'くすり'},{text:'毎日',reading:'まいにち'},{text:'飲まなければ',reading:'のまなければ'}]);
  s('sent_n4_018','検査の結果が出ました。','검사 결과가 나왔습니다.','vocab','v_n4_216',['v_n4_216'],[],['병원'],false,[{text:'検査',reading:'けんさ'},{text:'結果',reading:'けっか'}]);
  s('sent_n4_019','調子はどうですか。','컨디션은 어떻습니까?','vocab','v_n4_101',[],[],['건강'],true,[{text:'調子',reading:'ちょうし'}]);
  s('sent_n4_020','たくさん休んでください。','많이 쉬세요.','grammar','g_n5_13',['v_n4_238'],['g_n5_13'],['건강'],true,[]);
  // 학교·회사
  s('sent_n4_021','会議の資料を準備しておきます。','회의 자료를 준비해 둡니다.','grammar','g_n4_2',['v_n4_57','v_n4_59','v_n4_1'],['g_n4_2'],['회사'],true,[{text:'会議',reading:'かいぎ'},{text:'資料',reading:'しりょう'},{text:'準備',reading:'じゅんび'}]);
  s('sent_n4_022','明日の発表は十時からです。','내일 발표는 10시부터입니다.','vocab','v_n4_58',['v_n4_58'],['g_n5_1'],['회사'],true,[{text:'明日',reading:'あした'},{text:'発表',reading:'はっぴょう'},{text:'十時',reading:'じゅうじ'}]);
  s('sent_n4_023','遅刻してしまいました。','지각해 버렸습니다.','grammar','g_n4_1',['v_n4_44'],['g_n4_1'],['학교'],true,[{text:'遅刻',reading:'ちこく'}]);
  s('sent_n4_024','宿題を出しましたか。','숙제를 냈습니까?','vocab','v_n4_92',[],[],['학교'],true,[{text:'宿題',reading:'しゅくだい'},{text:'出しました',reading:'だしました'}]);
  s('sent_n4_025','試験のために毎日勉強しています。','시험을 위해 매일 공부하고 있습니다.','grammar','g_n4_16',['v_n4_96','v_n5_85'],['g_n4_16','g_n5_5'],['학교'],true,[{text:'試験',reading:'しけん'},{text:'毎日',reading:'まいにち'},{text:'勉強',reading:'べんきょう'}]);
  s('sent_n4_026','合格できるように頑張ります。','합격할 수 있도록 노력합니다.','grammar','g_n4_24',['v_n4_97','v_n4_100'],['g_n4_24'],['학교'],true,[{text:'合格',reading:'ごうかく'},{text:'頑張り',reading:'がんばり'}]);
  s('sent_n4_027','部長に相談してみます。','부장님께 상담해 보겠습니다.','grammar','g_n4_7',['v_n4_61','v_n4_38'],['g_n4_7'],['회사'],true,[{text:'部長',reading:'ぶちょう'},{text:'相談',reading:'そうだん'}]);
  s('sent_n4_028','残業が多くて疲れます。','야근이 많아서 피곤합니다.','vocab','v_n4_64',['v_n4_64','v_n4_101'],[],['회사'],true,[{text:'残業',reading:'ざんぎょう'},{text:'多くて',reading:'おおくて'},{text:'疲れ',reading:'つかれ'}]);
  s('sent_n4_029','会議室は二階にあります。','회의실은 2층에 있습니다.','vocab','v_n4_57',['v_n4_57'],['g_n5_7'],['회사'],true,[{text:'会議室',reading:'かいぎしつ'},{text:'二階',reading:'にかい'}]);
  s('sent_n4_030','書類にサインをしてください。','서류에 사인을 해 주세요.','vocab','v_n4_60',['v_n4_60'],['g_n5_13'],['회사'],true,[{text:'書類',reading:'しょるい'}]);
  // 여행·교통
  s('sent_n4_031','京都に行ったことがあります。','교토에 간 적이 있습니다.','grammar','g_n4_5',[],['g_n4_5'],['여행'],true,[{text:'京都',reading:'きょうと'},{text:'行った',reading:'いった'}]);
  s('sent_n4_032','空港まで電車で四十分かかります。','공항까지 전철로 40분 걸립니다.','vocab','v_n4_119',['v_n4_119','v_n4_123'],[],['교통'],true,[{text:'空港',reading:'くうこう'},{text:'電車',reading:'でんしゃ'},{text:'四十分',reading:'よんじゅっぷん'}]);
  s('sent_n4_033','新幹線が一番速いです。','신칸센이 가장 빠릅니다.','vocab','v_n4_124',['v_n4_124'],[],['교통'],true,[{text:'新幹線',reading:'しんかんせん'},{text:'一番',reading:'いちばん'},{text:'速い',reading:'はやい'}]);
  s('sent_n4_034','地下鉄で乗り換えなければなりません。','지하철에서 환승해야 합니다.','grammar','g_n4_3',['v_n4_123','v_n4_33'],['g_n4_3'],['교통'],true,[{text:'地下鉄',reading:'ちかてつ'},{text:'乗り換え',reading:'のりかえ'}]);
  s('sent_n4_035','次の駅で降ります。','다음 역에서 내립니다.','vocab','v_n4_34',['v_n4_34'],['g_n5_4'],['교통'],true,[{text:'次',reading:'つぎ'},{text:'駅',reading:'えき'},{text:'降り',reading:'おり'}]);
  s('sent_n4_036','信号が赤の時は止まってください。','신호가 빨간색일 때는 멈춰 주세요.','vocab','v_n4_126',['v_n4_126'],['g_n5_13'],['교통'],true,[{text:'信号',reading:'しんごう'},{text:'赤',reading:'あか'},{text:'時',reading:'とき'},{text:'止まって',reading:'とまって'}]);
  s('sent_n4_037','道を間違えてしまいました。','길을 잘못 들었습니다.','grammar','g_n4_1',['v_n4_200'],['g_n4_1'],['교통'],true,[{text:'道',reading:'みち'},{text:'間違えて',reading:'まちがえて'}]);
  s('sent_n4_038','次の角を右に曲がってください。','다음 모퉁이에서 오른쪽으로 도세요.','vocab','v_n4_129',['v_n4_129'],['g_n5_13'],['길안내'],true,[{text:'次',reading:'つぎ'},{text:'角',reading:'かど'},{text:'右',reading:'みぎ'},{text:'曲がって',reading:'まがって'}]);
  s('sent_n4_039','真っ直ぐ行くと駅があります。','쭉 가면 역이 있습니다.','grammar','g_n4_27',['v_n4_130'],['g_n4_27','g_n5_7'],['길안내'],true,[{text:'真っ直ぐ',reading:'まっすぐ'},{text:'行く',reading:'いく'},{text:'駅',reading:'えき'}]);
  s('sent_n4_040','地図を見ながら歩きました。','지도를 보면서 걸었습니다.','grammar','g_n4_30',['v_n4_132'],['g_n4_30'],['여행'],true,[{text:'地図',reading:'ちず'},{text:'見ながら',reading:'みながら'},{text:'歩き',reading:'あるき'}]);
  s('sent_n4_041','旅行の予約をしました。','여행 예약을 했습니다.','vocab','v_n4_35',['v_n4_35'],[],['여행'],true,[{text:'旅行',reading:'りょこう'},{text:'予約',reading:'よやく'}]);
  s('sent_n4_042','飛行機の時間に間に合いました。','비행기 시간에 맞췄습니다.','vocab','v_n4_120',['v_n4_120','v_n4_2'],[],['여행'],true,[{text:'飛行機',reading:'ひこうき'},{text:'時間',reading:'じかん'},{text:'間に合い',reading:'まにあい'}]);
  s('sent_n4_043','船で島に行ってみたいです。','배로 섬에 가 보고 싶습니다.','grammar','g_n4_7',['v_n4_121'],['g_n4_7','g_n5_12'],['여행'],true,[{text:'船',reading:'ふね'},{text:'島',reading:'しま'},{text:'行って',reading:'いって'}]);
  s('sent_n4_044','切手はもう買いましたか。','우표는 이미 샀습니까?','vocab','v_n4_139',['v_n4_139'],[],['생활'],true,[{text:'切手',reading:'きって'},{text:'買い',reading:'かい'}]);
  s('sent_n4_045','タクシーを呼びましょう。','택시를 부릅시다.','grammar','g_n5_10',[],['g_n5_10'],['교통'],true,[{text:'呼び',reading:'よび'}]);
  // 쇼핑·돈
  s('sent_n4_046','割引で安く買えました。','할인으로 싸게 살 수 있었습니다.','vocab','v_n4_67',['v_n4_67','v_n4_12'],[],['쇼핑'],true,[{text:'割引',reading:'わりびき'},{text:'安く',reading:'やすく'},{text:'買え',reading:'かえ'}]);
  s('sent_n4_047','袋に入れてください。','봉지에 넣어 주세요.','vocab','v_n4_70',['v_n4_70'],['g_n5_13'],['쇼핑'],true,[{text:'袋',reading:'ふくろ'},{text:'入れて',reading:'いれて'}]);
  s('sent_n4_048','お釣りはいくらですか。','거스름돈은 얼마입니까?','vocab','v_n4_71',['v_n4_71'],[],['쇼핑'],true,[{text:'釣り',reading:'つり'}]);
  s('sent_n4_049','財布を忘れてしまいました。','지갑을 잊어버렸습니다.','grammar','g_n4_1',['v_n4_72','v_n4_225'],['g_n4_1'],['쇼핑'],true,[{text:'財布',reading:'さいふ'},{text:'忘れて',reading:'わすれて'}]);
  s('sent_n4_050','この商品は値段が安いです。','이 상품은 가격이 쌉니다.','vocab','v_n4_74',['v_n4_74','v_n4_66','v_n4_12'],[],['쇼핑'],true,[{text:'商品',reading:'しょうひん'},{text:'値段',reading:'ねだん'},{text:'安い',reading:'やすい'}]);
  s('sent_n4_051','カードで払ってもいいですか。','카드로 결제해도 됩니까?','grammar','g_n5_14',[],['g_n5_14'],['쇼핑'],true,[{text:'払って',reading:'はらって'}]);
  s('sent_n4_052','銀行でお金を引き出しました。','은행에서 돈을 인출했습니다.','vocab','v_n4_144',['v_n4_144'],[],['생활'],true,[{text:'銀行',reading:'ぎんこう'},{text:'金',reading:'かね'},{text:'引き出し',reading:'ひきだし'}]);
  s('sent_n4_053','給料が増えました。','월급이 늘었습니다.','vocab','v_n4_207',['v_n4_65','v_n4_207'],[],['회사'],true,[{text:'給料',reading:'きゅうりょう'},{text:'増え',reading:'ふえ'}]);
  s('sent_n4_054','弁当を一つください。','도시락 하나 주세요.','vocab','v_n4_76',['v_n4_76'],[],['쇼핑'],true,[{text:'弁当',reading:'べんとう'},{text:'一つ',reading:'ひとつ'}]);
  s('sent_n4_055','コーヒーを注文しました。','커피를 주문했습니다.','vocab','v_n4_75',['v_n4_75'],[],['음식'],true,[{text:'注文',reading:'ちゅうもん'}]);
  // 가족·관계
  s('sent_n4_056','家族と旅行に行きたいです。','가족과 여행을 가고 싶습니다.','grammar','g_n5_12',['v_n4_162'],['g_n5_12'],['가족'],true,[{text:'家族',reading:'かぞく'},{text:'旅行',reading:'りょこう'},{text:'行き',reading:'いき'}]);
  s('sent_n4_057','息子は中学生です。','아들은 중학생입니다.','vocab','v_n4_163',['v_n4_163'],['g_n5_1'],['가족'],true,[{text:'息子',reading:'むすこ'},{text:'中学生',reading:'ちゅうがくせい'}]);
  s('sent_n4_058','娘は今年五歳になりました。','딸은 올해 다섯 살이 되었습니다.','vocab','v_n4_164',['v_n4_164'],[],['가족'],true,[{text:'娘',reading:'むすめ'},{text:'今年',reading:'ことし'},{text:'五歳',reading:'ごさい'}]);
  s('sent_n4_059','親に感謝しています。','부모님께 감사하고 있습니다.','grammar','g_n5_5',['v_n4_165','v_n4_176'],['g_n5_5'],['가족'],true,[{text:'親',reading:'おや'},{text:'感謝',reading:'かんしゃ'}]);
  s('sent_n4_060','妻と二人で映画を見ました。','아내와 둘이서 영화를 봤습니다.','vocab','v_n4_168',['v_n4_168'],[],['가족'],true,[{text:'妻',reading:'つま'},{text:'二人',reading:'ふたり'},{text:'映画',reading:'えいが'},{text:'見ました',reading:'みました'}]);
  s('sent_n4_061','友だちを家に招待しました。','친구를 집에 초대했습니다.','vocab','v_n4_40',['v_n4_40'],[],['교제'],true,[{text:'友だち',reading:'ともだち'},{text:'家',reading:'いえ'},{text:'招待',reading:'しょうたい'}]);
  s('sent_n4_062','友だちと喧嘩してしまった。','친구와 싸워 버렸다.','grammar','g_n4_1',['v_n4_180'],['g_n4_1'],['교제'],true,[{text:'友だち',reading:'ともだち'},{text:'喧嘩',reading:'けんか'}]);
  s('sent_n4_063','彼を信じています。','그를 믿고 있습니다.','grammar','g_n5_5',['v_n4_223'],['g_n5_5'],['교제'],true,[{text:'彼',reading:'かれ'},{text:'信じて',reading:'しんじて'}]);
  s('sent_n4_064','結婚することになりました。','결혼하게 되었습니다.','grammar','g_n4_21',['v_n4_173'],['g_n4_21'],['가족'],true,[{text:'結婚',reading:'けっこん'}]);
  s('sent_n4_065','祖母と一緒に住んでいます。','할머니와 함께 살고 있습니다.','grammar','g_n5_5',['v_n4_170'],['g_n5_5'],['가족'],true,[{text:'祖母',reading:'そぼ'},{text:'一緒',reading:'いっしょ'},{text:'住んで',reading:'すんで'}]);
  // 감정·상태
  s('sent_n4_066','とても嬉しいです。','매우 기쁩니다.','vocab','v_n4_188',['v_n4_188'],[],['감정'],true,[{text:'嬉しい',reading:'うれしい'}]);
  s('sent_n4_067','今日は疲れて、早く寝ます。','오늘은 피곤해서 일찍 잡니다.','vocab','v_n4_101',['v_n4_101'],[],['감정'],true,[{text:'今日',reading:'きょう'},{text:'疲れて',reading:'つかれて'},{text:'早く',reading:'はやく'},{text:'寝ます',reading:'ねます'}]);
  s('sent_n4_068','寂しいので、電話しました。','외로워서 전화했습니다.','grammar','g_n4_17',['v_n4_187'],['g_n4_17'],['감정'],true,[{text:'寂しい',reading:'さびしい'},{text:'電話',reading:'でんわ'}]);
  s('sent_n4_069','映画を見て泣きました。','영화를 보고 울었습니다.','vocab','v_n4_183',['v_n4_183'],[],['감정'],true,[{text:'映画',reading:'えいが'},{text:'見て',reading:'みて'},{text:'泣き',reading:'なき'}]);
  s('sent_n4_070','急に怒られて驚きました。','갑자기 혼나서 놀랐습니다.','vocab','v_n4_186',['v_n4_184','v_n4_186'],[],['감정'],true,[{text:'急に',reading:'きゅうに'},{text:'怒られて',reading:'おこられて'},{text:'驚き',reading:'おどろき'}]);
  s('sent_n4_071','楽しかったです。','즐거웠습니다.','vocab','v_n4_189',['v_n4_189'],[],['감정'],true,[{text:'楽しかった',reading:'たのしかった'}]);
  s('sent_n4_072','怖い映画は見ません。','무서운 영화는 안 봅니다.','vocab','v_n4_191',['v_n4_191'],[],['감정'],true,[{text:'怖い',reading:'こわい'},{text:'映画',reading:'えいが'},{text:'見ません',reading:'みません'}]);
  s('sent_n4_073','今日は忙しすぎました。','오늘은 너무 바빴습니다.','grammar','g_n4_12',['v_n4_193'],['g_n4_12'],['감정'],true,[{text:'今日',reading:'きょう'},{text:'忙し',reading:'いそがし'}]);
  s('sent_n4_074','少し休憩したいです。','조금 쉬고 싶습니다.','grammar','g_n5_12',['v_n4_102','v_n4_239'],['g_n5_12'],['생활'],true,[{text:'少し',reading:'すこし'},{text:'休憩',reading:'きゅうけい'}]);
  s('sent_n4_075','大変な一日でした。','힘든 하루였습니다.','vocab','v_n4_195',['v_n4_195'],[],['감정'],true,[{text:'大変',reading:'たいへん'},{text:'一日',reading:'いちにち'}]);
  s('sent_n4_076','プレゼントをもらって喜びました。','선물을 받고 기뻤습니다.','vocab','v_n4_185',['v_n4_185'],[],['감정'],true,[{text:'喜び',reading:'よろこび'}]);
  s('sent_n4_077','問題が簡単で安心しました。','문제가 간단해서 안심했습니다.','grammar','g_n4_17',['v_n4_196'],['g_n4_17'],['감정'],true,[{text:'問題',reading:'もんだい'},{text:'簡単',reading:'かんたん'},{text:'安心',reading:'あんしん'}]);
  s('sent_n4_078','早起きが好きになりました。','일찍 일어나는 게 좋아졌습니다.','grammar','g_n4_23',['v_n4_46'],['g_n4_23'],['생활'],true,[{text:'早起き',reading:'はやおき'},{text:'好き',reading:'すき'}]);
  s('sent_n4_079','日本語が話せるようになりました。','일본어를 말할 수 있게 되었습니다.','grammar','g_n4_23',[],['g_n4_23'],['학습'],true,[{text:'日本語',reading:'にほんご'},{text:'話せる',reading:'はなせる'}]);
  s('sent_n4_080','毎日少しずつ覚えています。','매일 조금씩 외우고 있습니다.','grammar','g_n4_34',['v_n4_224'],['g_n4_34','g_n5_5'],['학습'],true,[{text:'毎日',reading:'まいにち'},{text:'少し',reading:'すこし'},{text:'覚え',reading:'おぼえ'}]);
  // 취미·일상
  s('sent_n4_081','趣味は写真を撮ることです。','취미는 사진을 찍는 것입니다.','vocab','v_n4_106',['v_n4_106'],['g_n4_40'],['취미'],true,[{text:'趣味',reading:'しゅみ'},{text:'写真',reading:'しゃしん'},{text:'撮る',reading:'とる'}]);
  s('sent_n4_082','音楽を聞きながら走ります。','음악을 들으면서 달립니다.','grammar','g_n4_30',['v_n4_103'],['g_n4_30'],['취미'],true,[{text:'音楽',reading:'おんがく'},{text:'聞き',reading:'きき'},{text:'走り',reading:'はしり'}]);
  s('sent_n4_083','スポーツに興味があります。','스포츠에 흥미가 있습니다.','vocab','v_n4_107',['v_n4_107'],['g_n5_7'],['취미'],true,[{text:'興味',reading:'きょうみ'}]);
  s('sent_n4_084','試合に勝ちました。','시합에 이겼습니다.','vocab','v_n4_104',['v_n4_104'],[],['스포츠'],true,[{text:'試合',reading:'しあい'},{text:'勝ち',reading:'かち'}]);
  s('sent_n4_085','選手たちは頑張っています。','선수들은 노력하고 있습니다.','grammar','g_n5_5',['v_n4_105','v_n4_100'],['g_n5_5'],['스포츠'],true,[{text:'選手',reading:'せんしゅ'},{text:'頑張って',reading:'がんばって'}]);
  s('sent_n4_086','本を読んだり、絵を描いたりします。','책을 읽기도 하고 그림을 그리기도 합니다.','grammar','g_n4_6',[],['g_n4_6'],['취미'],true,[{text:'本',reading:'ほん'},{text:'読んだり',reading:'よんだり'},{text:'絵',reading:'え'},{text:'描いたり',reading:'かいたり'}]);
  s('sent_n4_087','旅行の経験を話しました。','여행 경험을 이야기했습니다.','vocab','v_n4_108',['v_n4_108'],[],['취미'],true,[{text:'旅行',reading:'りょこう'},{text:'経験',reading:'けいけん'},{text:'話し',reading:'はなし'}]);
  s('sent_n4_088','料理を作るのが上手です。','요리를 만드는 것이 능숙합니다.','grammar','g_n4_40',[],['g_n4_40'],['생활'],true,[{text:'料理',reading:'りょうり'},{text:'作る',reading:'つくる'},{text:'上手',reading:'じょうず'}]);
  s('sent_n4_089','歌うのが好きです。','노래하는 것이 좋습니다.','grammar','g_n4_40',[],['g_n4_40'],['취미'],true,[{text:'歌う',reading:'うたう'},{text:'好き',reading:'すき'}]);
  s('sent_n4_090','友だちと一緒に散歩します。','친구와 함께 산책합니다.','vocab','v_n5_10',['v_n5_10'],[],['취미'],true,[{text:'友だち',reading:'ともだち'},{text:'一緒',reading:'いっしょ'},{text:'散歩',reading:'さんぽ'}]);
  // 그 외
  s('sent_n4_091','財布が見つかりました。','지갑을 찾았습니다.','vocab','v_n4_15',['v_n4_15','v_n4_72'],[],['생활'],true,[{text:'財布',reading:'さいふ'},{text:'見つかり',reading:'みつかり'}]);
  s('sent_n4_092','大切な手紙を届けました。','중요한 편지를 전달했습니다.','vocab','v_n4_13',['v_n4_13','v_n4_203'],[],['생활'],true,[{text:'大切',reading:'たいせつ'},{text:'手紙',reading:'てがみ'},{text:'届け',reading:'とどけ'}]);
  s('sent_n4_093','安全に気をつけてください。','안전에 주의해 주세요.','vocab','v_n4_154',['v_n4_154','v_n4_156'],['g_n5_13'],['주의'],true,[{text:'安全',reading:'あんぜん'},{text:'気',reading:'き'}]);
  s('sent_n4_094','約束を必ず守ります。','약속을 반드시 지킵니다.','vocab','v_n4_158',['v_n4_37','v_n4_158','v_n4_246'],[],['약속'],true,[{text:'約束',reading:'やくそく'},{text:'必ず',reading:'かならず'},{text:'守り',reading:'まもり'}]);
  s('sent_n4_095','住所を教えてください。','주소를 알려 주세요.','vocab','v_n4_133',['v_n4_133'],['g_n5_13'],['생활'],true,[{text:'住所',reading:'じゅうしょ'},{text:'教えて',reading:'おしえて'}]);
  s('sent_n4_096','荷物を預けたいです。','짐을 맡기고 싶습니다.','grammar','g_n5_12',['v_n4_142','v_n4_143'],['g_n5_12'],['여행'],true,[{text:'荷物',reading:'にもつ'},{text:'預け',reading:'あずけ'}]);
  s('sent_n4_097','空港でカバンが届きました。','공항에서 가방이 도착했습니다.','vocab','v_n4_12',['v_n4_12','v_n4_119'],[],['여행'],true,[{text:'空港',reading:'くうこう'},{text:'届き',reading:'とどき'}]);
  s('sent_n4_098','駅で乗り換えるのは難しいです。','역에서 환승하는 것은 어렵습니다.','grammar','g_n4_40',['v_n4_33'],['g_n4_40'],['교통'],true,[{text:'駅',reading:'えき'},{text:'乗り換える',reading:'のりかえる'},{text:'難しい',reading:'むずかしい'}]);
  s('sent_n4_099','明日のために十分準備しました。','내일을 위해 충분히 준비했습니다.','grammar','g_n4_16',['v_n4_205','v_n4_1'],['g_n4_16'],['일정'],true,[{text:'明日',reading:'あした'},{text:'十分',reading:'じゅうぶん'},{text:'準備',reading:'じゅんび'}]);
  s('sent_n4_100','またチャンスがあるかもしれません。','다시 기회가 있을지도 모릅니다.','grammar','g_n4_19',[],['g_n4_19'],['감정'],true,[]);
  return arr;
}
