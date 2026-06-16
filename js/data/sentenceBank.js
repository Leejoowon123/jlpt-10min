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
  { id:'sent_n5_091', level:'N5', ja:'ノートに名前を書きましょう。', ko:'노트에 이름을 씁시다.',
    sourceType:'vocab', sourceId:'v_n5_183',
    vocabIds:['v_n5_183','v_n5_20','v_n5_48'], grammarIds:['g_n5_10'],
    situationTags:['학교','일상'], canUseInConversation:true,
    readings:[{text:'名前',reading:'なまえ'},{text:'書きましょう',reading:'かきましょう'}] },
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
  // N5 마무리 (라운드 24)
  ...n5FinalSentences(),
  // N4 1차 B (라운드 26)
  ...n4FinalSentences(),
  // N4 완성 C (라운드 27)
  ...n4SentencesC(),
  // N4 완성 D (라운드 28)
  ...n4SentencesD(),
  // N3 0차 시드 (라운드 32)
  ...n3SeedSentences(),
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
  s('sent_n4_012','頭が痛くて、薬を飲みました。','머리가 아파서 약을 먹었습니다.','vocab','v_n4_149',['v_n4_149','v_n5_230'],[],['병원'],true,[{text:'頭',reading:'あたま'},{text:'痛くて',reading:'いたくて'},{text:'薬',reading:'くすり'},{text:'飲み',reading:'のみ'}]);
  s('sent_n4_013','病院で予約を取りました。','병원에서 예약을 잡았습니다.','vocab','v_n4_35',['v_n4_147','v_n4_35'],[],['병원'],true,[{text:'病院',reading:'びょういん'},{text:'予約',reading:'よやく'},{text:'取り',reading:'とり'}]);
  s('sent_n4_014','風邪が治りました。','감기가 나았습니다.','vocab','v_n4_152',['v_n4_152'],[],['건강'],true,[{text:'風邪',reading:'かぜ'},{text:'治り',reading:'なおり'}]);
  s('sent_n4_015','医者に相談したほうがいいです。','의사에게 상담하는 것이 좋습니다.','vocab','v_n4_38',['v_n4_38'],[],['병원'],true,[{text:'医者',reading:'いしゃ'},{text:'相談',reading:'そうだん'}]);
  s('sent_n4_016','怪我をしないように気をつけてください。','다치지 않도록 조심하세요.','grammar','g_n4_24',['v_n4_151'],['g_n4_24','g_n5_13'],['건강'],true,[{text:'怪我',reading:'けが'},{text:'気',reading:'き'}]);
  s('sent_n4_017','薬を毎日飲まなければなりません。','약을 매일 먹어야 합니다.','grammar','g_n4_3',['v_n5_230'],['g_n4_3'],['건강'],true,[{text:'薬',reading:'くすり'},{text:'毎日',reading:'まいにち'},{text:'飲まなければ',reading:'のまなければ'}]);
  s('sent_n4_018','検査の結果が出ました。','검사 결과가 나왔습니다.','vocab','v_n4_216',['v_n4_216'],[],['병원'],false,[{text:'検査',reading:'けんさ'},{text:'結果',reading:'けっか'}]);
  s('sent_n4_019','調子はどうですか。','컨디션은 어떻습니까?','vocab','v_n4_101',[],[],['건강'],true,[{text:'調子',reading:'ちょうし'}]);
  s('sent_n4_020','たくさん休んでください。','많이 쉬세요.','grammar','g_n5_13',['v_n4_238'],['g_n5_13'],['건강'],true,[{text:'休んで',reading:'やすんで'}]);
  // 학교·회사
  s('sent_n4_021','会議の資料を準備しておきます。','회의 자료를 준비해 둡니다.','grammar','g_n4_2',['v_n4_57','v_n4_59','v_n4_1'],['g_n4_2'],['회사'],true,[{text:'会議',reading:'かいぎ'},{text:'資料',reading:'しりょう'},{text:'準備',reading:'じゅんび'}]);
  s('sent_n4_022','明日の発表は十時からです。','내일 발표는 10시부터입니다.','vocab','v_n4_58',['v_n4_58'],['g_n5_1'],['회사'],true,[{text:'明日',reading:'あした'},{text:'発表',reading:'はっぴょう'},{text:'十時',reading:'じゅうじ'}]);
  s('sent_n4_023','遅刻してしまいました。','지각해 버렸습니다.','grammar','g_n4_1',['v_n4_44'],['g_n4_1'],['학교'],true,[{text:'遅刻',reading:'ちこく'}]);
  s('sent_n4_024','宿題を出しましたか。','숙제를 냈습니까?','vocab','v_n4_92',[],[],['학교'],true,[{text:'宿題',reading:'しゅくだい'},{text:'出しました',reading:'だしました'}]);
  s('sent_n4_025','試験のために毎日勉強しています。','시험을 위해 매일 공부하고 있습니다.','grammar','g_n4_16',['v_n5_83','v_n5_85'],['g_n4_16','g_n5_5'],['학교'],true,[{text:'試験',reading:'しけん'},{text:'毎日',reading:'まいにち'},{text:'勉強',reading:'べんきょう'}]);
  s('sent_n4_026','合格できるように頑張ります。','합격할 수 있도록 노력합니다.','grammar','g_n4_24',['v_n4_97','v_n4_100'],['g_n4_24'],['학교'],true,[{text:'合格',reading:'ごうかく'},{text:'頑張り',reading:'がんばり'}]);
  s('sent_n4_027','部長に相談してみます。','부장님께 상담해 보겠습니다.','grammar','g_n4_7',['v_n4_61','v_n4_38'],['g_n4_7'],['회사'],true,[{text:'部長',reading:'ぶちょう'},{text:'相談',reading:'そうだん'}]);
  s('sent_n4_028','残業が多くて疲れます。','야근이 많아서 피곤합니다.','vocab','v_n4_64',['v_n4_64','v_n4_101'],[],['회사'],true,[{text:'残業',reading:'ざんぎょう'},{text:'多くて',reading:'おおくて'},{text:'疲れ',reading:'つかれ'}]);
  s('sent_n4_029','会議室は二階にあります。','회의실은 2층에 있습니다.','vocab','v_n4_57',['v_n4_57'],['g_n5_7'],['회사'],true,[{text:'会議室',reading:'かいぎしつ'},{text:'二階',reading:'にかい'}]);
  s('sent_n4_030','書類にサインをしてください。','서류에 사인을 해 주세요.','vocab','v_n4_60',['v_n4_60'],['g_n5_13'],['회사'],true,[{text:'書類',reading:'しょるい'}]);
  // 여행·교통
  s('sent_n4_031','京都に行ったことがあります。','교토에 간 적이 있습니다.','grammar','g_n4_5',[],['g_n4_5'],['여행'],true,[{text:'京都',reading:'きょうと'},{text:'行った',reading:'いった'}]);
  s('sent_n4_032','空港まで電車で四十分かかります。','공항까지 전철로 40분 걸립니다.','vocab','v_n5_109',['v_n5_109','v_n4_123'],[],['교통'],true,[{text:'空港',reading:'くうこう'},{text:'電車',reading:'でんしゃ'},{text:'四十分',reading:'よんじゅっぷん'}]);
  s('sent_n4_033','新幹線が一番速いです。','신칸센이 가장 빠릅니다.','vocab','v_n4_124',['v_n4_124'],[],['교통'],true,[{text:'新幹線',reading:'しんかんせん'},{text:'一番',reading:'いちばん'},{text:'速い',reading:'はやい'}]);
  s('sent_n4_034','地下鉄で乗り換えなければなりません。','지하철에서 환승해야 합니다.','grammar','g_n4_3',['v_n4_123','v_n4_33'],['g_n4_3'],['교통'],true,[{text:'地下鉄',reading:'ちかてつ'},{text:'乗り換え',reading:'のりかえ'}]);
  s('sent_n4_035','次の駅で降ります。','다음 역에서 내립니다.','vocab','v_n4_34',['v_n4_34'],['g_n5_4'],['교통'],true,[{text:'次',reading:'つぎ'},{text:'駅',reading:'えき'},{text:'降り',reading:'おり'}]);
  s('sent_n4_036','信号が赤の時は止まってください。','신호가 빨간색일 때는 멈춰 주세요.','vocab','v_n4_126',['v_n4_126'],['g_n5_13'],['교통'],true,[{text:'信号',reading:'しんごう'},{text:'赤',reading:'あか'},{text:'時',reading:'とき'},{text:'止まって',reading:'とまって'}]);
  s('sent_n4_037','道を間違えてしまいました。','길을 잘못 들었습니다.','grammar','g_n4_1',['v_n4_200'],['g_n4_1'],['교통'],true,[{text:'道',reading:'みち'},{text:'間違えて',reading:'まちがえて'}]);
  s('sent_n4_038','次の角を右に曲がってください。','다음 모퉁이에서 오른쪽으로 도세요.','vocab','v_n4_129',['v_n4_129'],['g_n5_13'],['길안내'],true,[{text:'次',reading:'つぎ'},{text:'角',reading:'かど'},{text:'右',reading:'みぎ'},{text:'曲がって',reading:'まがって'}]);
  s('sent_n4_039','真っ直ぐ行くと駅があります。','쭉 가면 역이 있습니다.','grammar','g_n4_27',['v_n4_130'],['g_n4_27','g_n5_7'],['길안내'],true,[{text:'真っ直ぐ',reading:'まっすぐ'},{text:'行く',reading:'いく'},{text:'駅',reading:'えき'}]);
  s('sent_n4_040','地図を見ながら歩きました。','지도를 보면서 걸었습니다.','grammar','g_n4_30',['v_n4_132'],['g_n4_30'],['여행'],true,[{text:'地図',reading:'ちず'},{text:'見ながら',reading:'みながら'},{text:'歩き',reading:'あるき'}]);
  s('sent_n4_041','旅行の予約をしました。','여행 예약을 했습니다.','vocab','v_n4_35',['v_n4_35'],[],['여행'],true,[{text:'旅行',reading:'りょこう'},{text:'予約',reading:'よやく'}]);
  s('sent_n4_042','飛行機の時間に間に合いました。','비행기 시간에 맞췄습니다.','vocab','v_n5_164',['v_n5_164','v_n4_2'],[],['여행'],true,[{text:'飛行機',reading:'ひこうき'},{text:'時間',reading:'じかん'},{text:'間に合い',reading:'まにあい'}]);
  s('sent_n4_043','船で島に行ってみたいです。','배로 섬에 가 보고 싶습니다.','grammar','g_n4_7',['v_n5_165'],['g_n4_7','g_n5_12'],['여행'],true,[{text:'船',reading:'ふね'},{text:'島',reading:'しま'},{text:'行って',reading:'いって'}]);
  s('sent_n4_044','切手はもう買いましたか。','우표는 이미 샀습니까?','vocab','v_n4_139',['v_n4_139'],[],['생활'],true,[{text:'切手',reading:'きって'},{text:'買い',reading:'かい'}]);
  s('sent_n4_045','タクシーを呼びましょう。','택시를 부릅시다.','grammar','g_n5_10',[],['g_n5_10'],['교통'],true,[{text:'呼び',reading:'よび'}]);
  // 쇼핑·돈
  s('sent_n4_046','割引で安く買えました。','할인으로 싸게 살 수 있었습니다.','vocab','v_n4_67',['v_n4_67','v_n4_12'],[],['쇼핑'],true,[{text:'割引',reading:'わりびき'},{text:'安く',reading:'やすく'},{text:'買え',reading:'かえ'}]);
  s('sent_n4_047','袋に入れてください。','봉지에 넣어 주세요.','vocab','v_n4_70',['v_n4_70'],['g_n5_13'],['쇼핑'],true,[{text:'袋',reading:'ふくろ'},{text:'入れて',reading:'いれて'}]);
  s('sent_n4_048','お釣りはいくらですか。','거스름돈은 얼마입니까?','vocab','v_n4_71',['v_n4_71'],[],['쇼핑'],true,[{text:'釣り',reading:'つり'}]);
  s('sent_n4_049','財布を忘れてしまいました。','지갑을 잊어버렸습니다.','grammar','g_n4_1',['v_n4_72','v_n4_225'],['g_n4_1'],['쇼핑'],true,[{text:'財布',reading:'さいふ'},{text:'忘れて',reading:'わすれて'}]);
  s('sent_n4_050','この商品は値段が安いです。','이 상품은 가격이 쌉니다.','vocab','v_n4_74',['v_n4_74','v_n5_179','v_n4_12'],[],['쇼핑'],true,[{text:'商品',reading:'しょうひん'},{text:'値段',reading:'ねだん'},{text:'安い',reading:'やすい'}]);
  s('sent_n4_051','カードで払ってもいいですか。','카드로 결제해도 됩니까?','grammar','g_n5_14',[],['g_n5_14'],['쇼핑'],true,[{text:'払って',reading:'はらって'}]);
  s('sent_n4_052','銀行でお金を引き出しました。','은행에서 돈을 인출했습니다.','vocab','v_n4_144',['v_n4_144'],[],['생활'],true,[{text:'銀行',reading:'ぎんこう'},{text:'金',reading:'かね'},{text:'引き出し',reading:'ひきだし'}]);
  s('sent_n4_053','給料が増えました。','월급이 늘었습니다.','vocab','v_n4_207',['v_n4_65','v_n4_207'],[],['회사'],true,[{text:'給料',reading:'きゅうりょう'},{text:'増え',reading:'ふえ'}]);
  s('sent_n4_054','弁当を一つください。','도시락 하나 주세요.','vocab','v_n4_76',['v_n4_76'],[],['쇼핑'],true,[{text:'弁当',reading:'べんとう'},{text:'一つ',reading:'ひとつ'}]);
  s('sent_n4_055','コーヒーを注文しました。','커피를 주문했습니다.','vocab','v_n5_180',['v_n5_180'],[],['음식'],true,[{text:'注文',reading:'ちゅうもん'}]);
  // 가족·관계
  s('sent_n4_056','家族と旅行に行きたいです。','가족과 여행을 가고 싶습니다.','grammar','g_n5_12',['v_n5_134'],['g_n5_12'],['가족'],true,[{text:'家族',reading:'かぞく'},{text:'旅行',reading:'りょこう'},{text:'行き',reading:'いき'}]);
  s('sent_n4_057','息子は中学生です。','아들은 중학생입니다.','vocab','v_n4_163',['v_n4_163'],['g_n5_1'],['가족'],true,[{text:'息子',reading:'むすこ'},{text:'中学生',reading:'ちゅうがくせい'}]);
  s('sent_n4_058','娘は今年五歳になりました。','딸은 올해 다섯 살이 되었습니다.','vocab','v_n4_164',['v_n4_164'],[],['가족'],true,[{text:'娘',reading:'むすめ'},{text:'今年',reading:'ことし'},{text:'五歳',reading:'ごさい'}]);
  s('sent_n4_059','親に感謝しています。','부모님께 감사하고 있습니다.','grammar','g_n5_5',['v_n4_165','v_n4_176'],['g_n5_5'],['가족'],true,[{text:'親',reading:'おや'},{text:'感謝',reading:'かんしゃ'}]);
  s('sent_n4_060','妻と二人で映画を見ました。','아내와 둘이서 영화를 봤습니다.','vocab','v_n5_136',['v_n5_136'],[],['가족'],true,[{text:'妻',reading:'つま'},{text:'二人',reading:'ふたり'},{text:'映画',reading:'えいが'},{text:'見ました',reading:'みました'}]);
  s('sent_n4_061','友だちを家に招待しました。','친구를 집에 초대했습니다.','vocab','v_n4_40',['v_n4_40'],[],['교제'],true,[{text:'友だち',reading:'ともだち'},{text:'家',reading:'いえ'},{text:'招待',reading:'しょうたい'}]);
  s('sent_n4_062','友だちと喧嘩してしまった。','친구와 싸워 버렸다.','grammar','g_n4_1',['v_n4_180'],['g_n4_1'],['교제'],true,[{text:'友だち',reading:'ともだち'},{text:'喧嘩',reading:'けんか'}]);
  s('sent_n4_063','彼を信じています。','그를 믿고 있습니다.','grammar','g_n5_5',['v_n4_223'],['g_n5_5'],['교제'],true,[{text:'彼',reading:'かれ'},{text:'信じて',reading:'しんじて'}]);
  s('sent_n4_064','結婚することになりました。','결혼하게 되었습니다.','grammar','g_n4_21',['v_n4_173'],['g_n4_21'],['가족'],true,[{text:'結婚',reading:'けっこん'}]);
  s('sent_n4_065','祖母と一緒に住んでいます。','할머니와 함께 살고 있습니다.','grammar','g_n5_5',['v_n5_138'],['g_n5_5'],['가족'],true,[{text:'祖母',reading:'そぼ'},{text:'一緒',reading:'いっしょ'},{text:'住んで',reading:'すんで'}]);
  // 감정·상태
  s('sent_n4_066','とても嬉しいです。','매우 기쁩니다.','vocab','v_n4_188',['v_n4_188'],[],['감정'],true,[{text:'嬉しい',reading:'うれしい'}]);
  s('sent_n4_067','今日は疲れて、早く寝ます。','오늘은 피곤해서 일찍 잡니다.','vocab','v_n4_101',['v_n4_101'],[],['감정'],true,[{text:'今日',reading:'きょう'},{text:'疲れて',reading:'つかれて'},{text:'早く',reading:'はやく'},{text:'寝ます',reading:'ねます'}]);
  s('sent_n4_068','寂しいので、電話しました。','외로워서 전화했습니다.','grammar','g_n4_17',['v_n4_187'],['g_n4_17'],['감정'],true,[{text:'寂しい',reading:'さびしい'},{text:'電話',reading:'でんわ'}]);
  s('sent_n4_069','映画を見て泣きました。','영화를 보고 울었습니다.','vocab','v_n4_183',['v_n4_183'],[],['감정'],true,[{text:'映画',reading:'えいが'},{text:'見て',reading:'みて'},{text:'泣き',reading:'なき'}]);
  s('sent_n4_070','急に怒られて驚きました。','갑자기 혼나서 놀랐습니다.','vocab','v_n4_186',['v_n4_184','v_n4_186'],[],['감정'],true,[{text:'急に',reading:'きゅうに'},{text:'怒られて',reading:'おこられて'},{text:'驚き',reading:'おどろき'}]);
  s('sent_n4_071','楽しかったです。','즐거웠습니다.','vocab','v_n5_247',['v_n5_247'],[],['감정'],true,[{text:'楽しかった',reading:'たのしかった'}]);
  s('sent_n4_072','怖い映画は見ません。','무서운 영화는 안 봅니다.','vocab','v_n4_191',['v_n4_191'],[],['감정'],true,[{text:'怖い',reading:'こわい'},{text:'映画',reading:'えいが'},{text:'見ません',reading:'みません'}]);
  s('sent_n4_073','今日は忙しすぎました。','오늘은 너무 바빴습니다.','grammar','g_n4_12',['v_n5_249'],['g_n4_12'],['감정'],true,[{text:'今日',reading:'きょう'},{text:'忙し',reading:'いそがし'}]);
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
  s('sent_n4_097','空港でカバンが届きました。','공항에서 가방이 도착했습니다.','vocab','v_n4_12',['v_n4_12','v_n5_109'],[],['여행'],true,[{text:'空港',reading:'くうこう'},{text:'届き',reading:'とどき'}]);
  s('sent_n4_098','駅で乗り換えるのは難しいです。','역에서 환승하는 것은 어렵습니다.','grammar','g_n4_40',['v_n4_33'],['g_n4_40'],['교통'],true,[{text:'駅',reading:'えき'},{text:'乗り換える',reading:'のりかえる'},{text:'難しい',reading:'むずかしい'}]);
  s('sent_n4_099','明日のために十分準備しました。','내일을 위해 충분히 준비했습니다.','grammar','g_n4_16',['v_n4_205','v_n4_1'],['g_n4_16'],['일정'],true,[{text:'明日',reading:'あした'},{text:'十分',reading:'じゅうぶん'},{text:'準備',reading:'じゅんび'}]);
  s('sent_n4_100','またチャンスがあるかもしれません。','다시 기회가 있을지도 모릅니다.','grammar','g_n4_19',[],['g_n4_19'],['감정'],true,[]);
  return arr;
}

// ─── N5 마무리 확장 (라운드 24) — sent_n5_151 ~ sent_n5_220 ─────────
function n5FinalSentences() {
  const arr = [];
  function s5(num, ja, ko, source, src, gIds, tags, cic, readings) {
    arr.push({ id: 'sent_n5_' + String(num).padStart(3, '0'), level: 'N5', ja, ko,
      sourceType: source, sourceId: src,
      vocabIds: [], grammarIds: gIds,
      situationTags: tags, canUseInConversation: cic,
      readings: readings || [] });
  }
  const T = (text, reading) => ({ text, reading });
  // 인사·자기소개
  s5(151,'初めまして、よろしくお願いします。','처음 뵙겠습니다, 잘 부탁드립니다.','grammar','g_n5_1',[],['인사','자기소개'],true,[T('初めまして','はじめまして'),T('願い','ねがい')]);
  s5(152,'お名前を教えてください。','성함을 알려 주세요.','grammar','g_n5_13',['g_n5_13'],['인사','자기소개'],true,[T('名前','なまえ'),T('教えて','おしえて')]);
  s5(153,'ソウルから来ました。','서울에서 왔습니다.','grammar','g_n5_1',[],['자기소개'],true,[T('来ました','きました')]);
  s5(154,'日本語を勉強しています。','일본어를 공부하고 있습니다.','grammar','g_n5_5',['g_n5_5','g_n5_6'],['자기소개','공부'],true,[T('日本語','にほんご'),T('勉強','べんきょう')]);
  s5(155,'お元気ですか。','잘 지내세요?','grammar','g_n5_36',['g_n5_36'],['인사'],true,[T('元気','げんき')]);
  s5(156,'また明日会いましょう。','내일 또 만나요.','grammar','g_n5_10',['g_n5_10'],['인사','약속'],true,[T('明日','あした'),T('会いましょう','あいましょう')]);
  s5(157,'お先に失礼します。','먼저 실례하겠습니다.','grammar','g_n5_1',[],['인사'],true,[T('先','さき'),T('失礼','しつれい')]);
  // 가족
  s5(158,'家族は四人です。','가족은 네 명입니다.','grammar','g_n5_1',['g_n5_1'],['가족','자기소개'],true,[T('家族','かぞく'),T('四人','よにん')]);
  s5(159,'兄が一人と妹が一人います。','형(오빠)이 한 명, 여동생이 한 명 있습니다.','grammar','g_n5_8',['g_n5_8'],['가족'],true,[T('兄','あに'),T('一人','ひとり'),T('妹','いもうと')]);
  s5(160,'祖母は花が好きです。','할머니는 꽃을 좋아하십니다.','grammar','g_n5_21',['g_n5_21'],['가족','취향'],true,[T('祖母','そぼ'),T('花','はな'),T('好き','すき')]);
  s5(161,'父は今、家にいません。','아버지는 지금 집에 안 계십니다.','grammar','g_n5_9',['g_n5_9'],['가족'],true,[T('父','ちち'),T('今','いま'),T('家','いえ')]);
  s5(162,'週末は家族と過ごします。','주말은 가족과 보냅니다.','grammar','g_n5_19',[],['가족','일상'],true,[T('週末','しゅうまつ'),T('家族','かぞく'),T('過ごします','すごします')]);
  // 음식·식당·카페
  s5(163,'おすすめは何ですか。','추천 메뉴는 뭔가요?','grammar','g_n5_36',['g_n5_36'],['식당','음식'],true,[T('何','なん')]);
  s5(164,'お水をください。','물 좀 주세요.','grammar','g_n5_13',[],['식당','요청'],true,[T('水','みず')]);
  s5(165,'これはとても美味しいですね。','이거 정말 맛있네요.','grammar','g_n5_24',['g_n5_24'],['식당','음식'],true,[T('美味しい','おいしい')]);
  s5(166,'朝ご飯はパンと卵を食べます。','아침은 빵과 달걀을 먹습니다.','grammar','g_n5_19',['g_n5_19','g_n5_6'],['음식','일상'],true,[T('朝ご飯','あさごはん'),T('卵','たまご'),T('食べます','たべます')]);
  s5(167,'コーヒーをもう一杯お願いします。','커피 한 잔 더 부탁합니다.','grammar','g_n5_13',[],['카페','요청'],true,[T('一杯','いっぱい'),T('願い','ねがい')]);
  s5(168,'甘いものが大好きです。','단것을 아주 좋아합니다.','grammar','g_n5_21',['g_n5_21'],['음식','취향'],true,[T('甘い','あまい'),T('大好き','だいすき')]);
  s5(169,'お会計をお願いします。','계산 부탁드립니다.','grammar','g_n5_13',[],['식당','가격'],true,[T('会計','かいけい'),T('願い','ねがい')]);
  s5(170,'辛い料理は食べられますか。','매운 요리는 드실 수 있나요?','grammar','g_n5_23',['g_n5_23'],['식당','음식'],true,[T('辛い','からい'),T('料理','りょうり'),T('食べられます','たべられます')]);
  // 쇼핑·가격
  s5(171,'この帽子はいくらですか。','이 모자는 얼마인가요?','grammar','g_n5_36',['g_n5_36'],['쇼핑','가격'],true,[T('帽子','ぼうし')]);
  s5(172,'もう少し安いのはありますか。','조금 더 싼 것은 있나요?','grammar','g_n5_7',['g_n5_7'],['쇼핑','가격'],true,[T('少し','すこし'),T('安い','やすい')]);
  s5(173,'この靴を履いてみてもいいですか。','이 신발을 신어 봐도 될까요?','grammar','g_n5_14',['g_n5_14'],['쇼핑'],true,[T('靴','くつ'),T('履いて','はいて')]);
  s5(174,'袋をください。','봉투를 주세요.','grammar','g_n5_13',['g_n5_13'],['쇼핑','요청'],true,[T('袋','ふくろ')]);
  s5(175,'カードで払えますか。','카드로 낼 수 있나요?','grammar','g_n5_23',['g_n5_23'],['쇼핑','가격'],true,[T('払えます','はらえます')]);
  s5(176,'スーパーで牛乳と卵を買いました。','슈퍼에서 우유와 달걀을 샀습니다.','grammar','g_n5_4',['g_n5_4','g_n5_19'],['쇼핑','일상'],true,[T('牛乳','ぎゅうにゅう'),T('卵','たまご'),T('買いました','かいました')]);
  s5(177,'青いシャツのほうが好きです。','파란 셔츠 쪽이 더 좋습니다.','grammar','g_n5_26',['g_n5_26','g_n5_21'],['쇼핑','취향'],true,[T('青い','あおい'),T('好き','すき')]);
  // 학교·공부
  s5(178,'もう予習をしました。','벌써 예습을 했습니다.','grammar','g_n5_41',['g_n5_41'],['학교','숙제'],true,[T('予習','よしゅう')]);
  s5(179,'まだ漢字が読めません。','아직 한자를 못 읽습니다.','grammar','g_n5_40',['g_n5_40'],['공부'],true,[T('漢字','かんじ'),T('読めません','よめません')]);
  s5(180,'もう一度言ってください。','한 번 더 말해 주세요.','grammar','g_n5_13',['g_n5_13'],['수업','요청'],true,[T('一度','いちど'),T('言って','いって')]);
  s5(181,'テストの前に復習します。','시험 전에 복습합니다.','grammar','g_n5_28',['g_n5_28'],['공부','학교'],true,[T('前','まえ'),T('復習','ふくしゅう')]);
  s5(182,'授業の後で図書館へ行きます。','수업 후에 도서관에 갑니다.','grammar','g_n5_29',['g_n5_29','g_n5_3'],['학교','일상'],true,[T('授業','じゅぎょう'),T('後','あと'),T('図書館','としょかん'),T('行きます','いきます')]);
  s5(183,'この言葉の意味が分かりません。','이 말의 뜻을 모르겠습니다.','grammar','g_n5_18',['g_n5_18','g_n5_9'],['수업','공부'],true,[T('言葉','ことば'),T('意味','いみ'),T('分かりません','わかりません')]);
  s5(184,'音楽を聞きながら勉強します。','음악을 들으면서 공부합니다.','grammar','g_n5_30',['g_n5_30'],['공부','일상'],true,[T('音楽','おんがく'),T('聞き','きき'),T('勉強','べんきょう')]);
  // 시간·약속
  s5(185,'今日は何曜日ですか。','오늘은 무슨 요일인가요?','grammar','g_n5_36',['g_n5_36'],['시간'],true,[T('今日','きょう'),T('何曜日','なんようび')]);
  s5(186,'土曜日は暇ですか。','토요일은 한가하세요?','grammar','g_n5_36',['g_n5_36'],['약속'],true,[T('土曜日','どようび'),T('暇','ひま')]);
  s5(187,'少し遅れます。すみません。','조금 늦겠습니다. 죄송합니다.','grammar','g_n5_1',[],['약속','전화'],true,[T('少し','すこし'),T('遅れます','おくれます')]);
  s5(188,'駅の前で待っています。','역 앞에서 기다리고 있겠습니다.','grammar','g_n5_5',['g_n5_5','g_n5_18'],['약속','장소'],true,[T('駅','えき'),T('前','まえ'),T('待って','まって')]);
  s5(189,'三時までに来てください。','3시까지 와 주세요.','grammar','g_n5_17',['g_n5_17','g_n5_13'],['약속','시간'],true,[T('三時','さんじ'),T('来て','きて')]);
  s5(190,'映画を見に行きませんか。','영화 보러 가지 않을래요?','grammar','g_n5_11',['g_n5_11'],['권유','약속'],true,[T('映画','えいが'),T('見に','みに'),T('行きませんか','いきませんか')]);
  s5(191,'日曜日の朝はゆっくり寝ます。','일요일 아침은 느긋하게 잡니다.','grammar','g_n5_18',['g_n5_18'],['일상','시간'],true,[T('日曜日','にちようび'),T('朝','あさ'),T('寝ます','ねます')]);
  // 날씨·계절
  s5(192,'今日はいい天気ですね。','오늘은 날씨가 좋네요.','grammar','g_n5_24',['g_n5_24'],['날씨','인사'],true,[T('今日','きょう'),T('天気','てんき')]);
  s5(193,'明日は雨が降るでしょう。','내일은 비가 올 것입니다.','grammar','g_n5_35',['g_n5_35'],['날씨'],true,[T('明日','あした'),T('雨','あめ'),T('降る','ふる')]);
  s5(194,'冬より夏のほうが好きです。','겨울보다 여름을 더 좋아합니다.','grammar','g_n5_26',['g_n5_26','g_n5_21'],['계절','취향'],true,[T('冬','ふゆ'),T('夏','なつ'),T('好き','すき')]);
  s5(195,'風が強いですから、気をつけてください。','바람이 세니까 조심하세요.','grammar','g_n5_16',['g_n5_16','g_n5_13'],['날씨'],true,[T('風','かぜ'),T('強い','つよい'),T('気','き')]);
  s5(196,'春は花がきれいに咲きます。','봄은 꽃이 예쁘게 핍니다.','grammar','g_n5_1',['g_n5_1'],['계절','자연'],true,[T('春','はる'),T('花','はな'),T('咲きます','さきます')]);
  // 교통·길안내
  s5(197,'駅はどこですか。','역은 어디인가요?','grammar','g_n5_36',['g_n5_36'],['길안내','교통'],true,[T('駅','えき')]);
  s5(198,'バスで学校へ行きます。','버스로 학교에 갑니다.','grammar','g_n5_3',['g_n5_3'],['교통','학교'],true,[T('学校','がっこう'),T('行きます','いきます')]);
  s5(199,'あの交差点を左に曲がってください。','저 교차로에서 왼쪽으로 도세요.','grammar','g_n5_13',['g_n5_13'],['길안내'],true,[T('交差点','こうさてん'),T('左','ひだり'),T('曲がって','まがって')]);
  s5(200,'ここから駅まで歩いて十分です。','여기서 역까지 걸어서 10분입니다.','grammar','g_n5_17',['g_n5_17'],['길안내','교통'],true,[T('駅','えき'),T('歩いて','あるいて'),T('十分','じゅっぷん')]);
  s5(201,'タクシーを呼んでください。','택시를 불러 주세요.','grammar','g_n5_13',['g_n5_13'],['교통','요청'],true,[T('呼んで','よんで')]);
  s5(202,'電車の中で電話してはいけません。','전철 안에서 전화하면 안 됩니다.','grammar','g_n5_15',['g_n5_15'],['교통'],true,[T('電車','でんしゃ'),T('中','なか'),T('電話','でんわ')]);
  // 병원·건강
  s5(203,'昨日からお腹が痛いです。','어제부터 배가 아픕니다.','grammar','g_n5_2',['g_n5_2'],['병원','몸'],true,[T('昨日','きのう'),T('腹','なか'),T('痛い','いたい')]);
  s5(204,'風邪を引きました。','감기에 걸렸습니다.','grammar','g_n5_6',[],['병원','건강'],true,[T('風邪','かぜ'),T('引きました','ひきました')]);
  s5(205,'今日は気分がよくないです。','오늘은 컨디션이 좋지 않습니다.','grammar','g_n5_2',[],['건강','일상'],true,[T('今日','きょう'),T('気分','きぶん')]);
  s5(206,'薬はご飯の後で飲んでください。','약은 식사 후에 드세요.','grammar','g_n5_29',['g_n5_29','g_n5_13'],['병원','건강'],true,[T('薬','くすり'),T('飯','はん'),T('後','あと'),T('飲んで','のんで')]);
  s5(207,'早く元気になってください。','빨리 나으세요.','grammar','g_n5_34',['g_n5_34','g_n5_13'],['건강','인사'],true,[T('早く','はやく'),T('元気','げんき')]);
  // 취미·여행
  s5(208,'趣味は絵を描くことです。','취미는 그림 그리기입니다.','grammar','g_n5_1',['g_n5_1'],['취미','자기소개'],true,[T('趣味','しゅみ'),T('絵','え'),T('描く','かく')]);
  s5(209,'夏休みに海へ行きたいです。','여름방학에 바다에 가고 싶습니다.','grammar','g_n5_12',['g_n5_12','g_n5_3'],['여행','계절'],true,[T('夏休み','なつやすみ'),T('海','うみ'),T('行きたい','いきたい')]);
  s5(210,'山に登るのが好きです。','산에 오르는 것을 좋아합니다.','grammar','g_n5_21',['g_n5_21'],['취미'],true,[T('山','やま'),T('登る','のぼる'),T('好き','すき')]);
  s5(211,'新しいカメラがほしいです。','새 카메라를 갖고 싶습니다.','grammar','g_n5_27',['g_n5_27'],['취미','쇼핑'],true,[T('新しい','あたらしい')]);
  s5(212,'温泉に泊まりたいです。','온천에 묵고 싶습니다.','grammar','g_n5_12',['g_n5_12'],['여행'],true,[T('温泉','おんせん'),T('泊まりたい','とまりたい')]);
  s5(213,'ギターを弾くことができます。','기타를 칠 수 있습니다.','grammar','g_n5_6',[],['취미','자기소개'],true,[T('弾く','ひく')]);
  // 일상·집
  s5(214,'毎朝シャワーを浴びます。','매일 아침 샤워를 합니다.','grammar','g_n5_6',['g_n5_6'],['일상','집'],true,[T('毎朝','まいあさ'),T('浴びます','あびます')]);
  s5(215,'部屋を掃除してから出かけます。','방을 청소하고 나서 외출합니다.','grammar','g_n5_6',[],['일상','집'],true,[T('部屋','へや'),T('掃除','そうじ'),T('出かけます','でかけます')]);
  s5(216,'寝る前に歯を磨きます。','자기 전에 이를 닦습니다.','grammar','g_n5_28',['g_n5_28'],['일상','몸'],true,[T('寝る','ねる'),T('前','まえ'),T('歯','は'),T('磨きます','みがきます')]);
  s5(217,'電気を消してください。','불을 꺼 주세요.','grammar','g_n5_13',['g_n5_13'],['집','요청'],true,[T('電気','でんき'),T('消して','けして')]);
  s5(218,'鍵をかけるのを忘れないでください。','문 잠그는 것을 잊지 마세요.','grammar','g_n5_13',['g_n5_13'],['집','일상'],true,[T('鍵','かぎ'),T('忘れないで','わすれないで')]);
  s5(219,'洗濯は週末にします。','빨래는 주말에 합니다.','grammar','g_n5_4',[],['집','일상'],true,[T('洗濯','せんたく'),T('週末','しゅうまつ')]);
  s5(220,'手を洗ってから食べましょう。','손을 씻고 나서 먹읍시다.','grammar','g_n5_10',['g_n5_10'],['일상','건강'],true,[T('手','て'),T('洗って','あらって'),T('食べましょう','たべましょう')]);
  return arr;
}

// ─── N4 1차 B 확장 (라운드 26) — sent_n4_101 ~ sent_n4_180 ───────────
function n4FinalSentences() {
  const arr = [];
  function s4(num, ja, ko, source, src, vIds, gIds, tags, cic, readings) {
    arr.push({ id: 'sent_n4_' + String(num).padStart(3, '0'), level: 'N4', ja, ko,
      sourceType: source, sourceId: src,
      vocabIds: vIds, grammarIds: gIds,
      situationTags: tags, canUseInConversation: cic,
      readings: readings || [] });
  }
  const W = (text, reading) => ({ text, reading });
  // 약속·일정 (수수표현/시점)
  s4(101,'駅まで迎えに来てくれますか。','역까지 마중 나와 줄 수 있나요?','grammar','g_n4_42',[],['g_n4_42'],['약속'],true,[W('駅','えき'),W('迎え','むかえ'),W('来て','きて')]);
  s4(102,'今、家を出たところです。','지금 막 집을 나선 참입니다.','grammar','g_n4_55',[],['g_n4_55'],['약속'],true,[W('今','いま'),W('家','いえ'),W('出た','でた')]);
  s4(103,'着いたら連絡するように頼みました。','도착하면 연락해 달라고 부탁했습니다.','grammar','g_n4_48',['v_n4_306'],['g_n4_48'],['약속'],true,[W('着いたら','ついたら'),W('連絡','れんらく'),W('頼みました','たのみました')]);
  s4(104,'時間を変更させてください。','시간을 변경하게 해 주세요.','grammar','g_n4_58',['v_n4_319'],['g_n4_58'],['약속','사과'],true,[W('時間','じかん'),W('変更','へんこう')]);
  s4(105,'彼は五時に来るはずです。','그는 5시에 올 것입니다.','grammar','g_n4_49',[],['g_n4_49'],['약속'],true,[W('彼','かれ'),W('五時','ごじ'),W('来る','くる')]);
  s4(106,'予約を取り消したいのですが。','예약을 취소하고 싶은데요.','vocab','v_n4_320',['v_n4_320','v_n4_35'],['g_n4_37'],['약속','문의'],true,[W('予約','よやく'),W('取り消したい','とりけしたい')]);
  s4(107,'間に合うかどうか分かりません。','시간에 맞출지 어떨지 모르겠습니다.','grammar','g_n4_51',['v_n4_2'],['g_n4_51'],['약속'],true,[W('間に合う','まにあう'),W('分かりません','わかりません')]);
  s4(108,'来られるなら、早めに教えてください。','올 수 있으면 일찍 알려 주세요.','grammar','g_n4_46',[],['g_n4_46','g_n4_28'],['약속'],true,[W('来られる','こられる'),W('早めに','はやめに'),W('教えて','おしえて')]);
  s4(109,'日曜日に映画を見ようと思います。','일요일에 영화를 보려고 합니다.','grammar','g_n4_53',[],['g_n4_53'],['약속','취미'],true,[W('日曜日','にちようび'),W('映画','えいが'),W('見よう','みよう'),W('思います','おもいます')]);
  s4(110,'友だちが駅まで送ってくれました。','친구가 역까지 바래다주었습니다.','grammar','g_n4_42',[],['g_n4_42'],['교제','교통'],true,[W('友','とも'),W('駅','えき'),W('送って','おくって')]);
  // 병원·건강
  s4(111,'三日前から咳が出ます。','3일 전부터 기침이 납니다.','vocab','v_n4_328',['v_n4_328'],[],['병원','증상'],true,[W('三日前','みっかまえ'),W('咳','せき'),W('出ます','でます')]);
  s4(112,'朝からめまいがします。','아침부터 현기증이 납니다.','vocab','v_n4_329',['v_n4_329'],[],['병원','증상'],true,[W('朝','あさ')]);
  s4(113,'体調が悪いので、早退させてください。','컨디션이 나빠서 조퇴하게 해 주세요.','grammar','g_n4_58',['v_n4_326'],['g_n4_58','g_n4_17'],['병원','회사'],true,[W('体調','たいちょう'),W('悪い','わるい'),W('早退','そうたい')]);
  s4(114,'医者に運動するように言われました。','의사에게 운동하라는 말을 들었습니다.','grammar','g_n4_47',['v_n4_38'],['g_n4_47','g_n4_44'],['병원','건강'],true,[W('医者','いしゃ'),W('運動','うんどう'),W('言われました','いわれました')]);
  s4(115,'熱を測ったほうがいいですよ。','열을 재는 편이 좋아요.','grammar','g_n4_59',['v_n4_148'],['g_n4_59'],['병원','건강'],true,[W('熱','ねつ'),W('測った','はかった')]);
  s4(116,'祖母が入院してしまいました。','할머니가 입원하고 말았습니다.','vocab','v_n4_331',['v_n4_331'],['g_n4_1'],['병원','가족'],true,[W('祖母','そぼ'),W('入院','にゅういん')]);
  s4(117,'検査の結果は明日出るはずです。','검사 결과는 내일 나올 것입니다.','grammar','g_n4_49',['v_n4_335'],['g_n4_49'],['병원'],true,[W('検査','けんさ'),W('結果','けっか'),W('明日','あした'),W('出る','でる')]);
  s4(118,'無理をしないほうがいいです。','무리하지 않는 편이 좋습니다.','grammar','g_n4_59',[],['g_n4_59'],['건강','조언'],true,[W('無理','むり')]);
  // 회사·회의
  s4(119,'資料を確認しておいてください。','자료를 확인해 놓아 주세요.','grammar','g_n4_2',['v_n4_307'],['g_n4_2','g_n5_13'],['회사','회의'],true,[W('資料','しりょう'),W('確認','かくにん')]);
  s4(120,'今、報告書を書いているところです。','지금 보고서를 쓰고 있는 중입니다.','grammar','g_n4_54',['v_n4_305'],['g_n4_54'],['회사'],true,[W('今','いま'),W('報告書','ほうこくしょ'),W('書いて','かいて')]);
  s4(121,'上司に褒められました。','상사에게 칭찬받았습니다.','grammar','g_n4_44',['v_n4_295'],['g_n4_44'],['회사','감정'],true,[W('上司','じょうし'),W('褒められました','ほめられました')]);
  s4(122,'先輩が仕事を教えてくれました。','선배가 일을 가르쳐 주었습니다.','grammar','g_n4_42',['v_n4_292'],['g_n4_42'],['회사'],true,[W('先輩','せんぱい'),W('仕事','しごと'),W('教えて','おしえて')]);
  s4(123,'会議は三時からの予定です。','회의는 3시부터 할 예정입니다.','grammar','g_n4_50',['v_n4_57'],['g_n4_50'],['회사','회의'],true,[W('会議','かいぎ'),W('三時','さんじ'),W('予定','よてい')]);
  s4(124,'締め切りに間に合わせます。','마감에 맞추겠습니다.','vocab','v_n4_304',['v_n4_304','v_n4_2'],[],['회사'],true,[W('締め切り','しめきり'),W('間に合わせます','まにあわせます')]);
  s4(125,'課長は出張中で、明日帰ります。','과장님은 출장 중이고 내일 돌아옵니다.','vocab','v_n4_296',['v_n4_296','v_n4_301'],[],['회사'],true,[W('課長','かちょう'),W('出張中','しゅっちょうちゅう'),W('明日','あした'),W('帰ります','かえります')]);
  s4(126,'面接でとても緊張しました。','면접에서 매우 긴장했습니다.','vocab','v_n4_374',['v_n4_374','v_n4_300'],[],['회사','감정'],true,[W('面接','めんせつ'),W('緊張','きんちょう')]);
  s4(127,'新しい仕事に慣れてきました。','새 일에 익숙해졌습니다.','vocab','v_n4_63',['v_n4_63'],[],['회사'],true,[W('新しい','あたらしい'),W('仕事','しごと'),W('慣れて','なれて')]);
  s4(128,'同僚に手伝ってもらいました。','동료에게 도움을 받았습니다.','grammar','g_n4_43',['v_n4_294'],['g_n4_43'],['회사'],true,[W('同僚','どうりょう'),W('手伝って','てつだって')]);
  // 여행·교통
  s4(129,'飛行機は十時に出発する予定です。','비행기는 10시에 출발할 예정입니다.','grammar','g_n4_50',['v_n4_343'],['g_n4_50'],['여행','교통'],true,[W('飛行機','ひこうき'),W('十時','じゅうじ'),W('出発','しゅっぱつ'),W('予定','よてい')]);
  s4(130,'終電に乗り遅れてしまいました。','막차를 놓치고 말았습니다.','vocab','v_n4_286',['v_n4_286','v_n4_352'],['g_n4_1'],['교통'],true,[W('終電','しゅうでん'),W('乗り遅れて','のりおくれて')]);
  s4(131,'道が渋滞しているかもしれません。','길이 막히고 있을지도 모릅니다.','grammar','g_n4_19',['v_n4_353'],['g_n4_19'],['교통'],true,[W('道','みち'),W('渋滞','じゅうたい')]);
  s4(132,'往復の切符を買ったほうが安いです。','왕복표를 사는 편이 쌉니다.','grammar','g_n4_59',['v_n4_349'],['g_n4_59'],['교통','쇼핑'],true,[W('往復','おうふく'),W('切符','きっぷ'),W('買った','かった'),W('安い','やすい')]);
  s4(133,'改札の前で待っているはずです。','개찰구 앞에서 기다리고 있을 것입니다.','grammar','g_n4_49',['v_n4_350'],['g_n4_49'],['교통','약속'],true,[W('改札','かいさつ'),W('前','まえ'),W('待って','まって')]);
  s4(134,'温泉に泊まろうと思っています。','온천에 묵으려고 생각하고 있습니다.','grammar','g_n4_53',['v_n4_340'],['g_n4_53'],['여행'],true,[W('温泉','おんせん'),W('泊まろう','とまろう'),W('思って','おもって')]);
  s4(135,'景色がきれいな場所を教えてもらいました。','경치가 아름다운 곳을 추천받았습니다.','grammar','g_n4_43',['v_n4_341'],['g_n4_43'],['여행'],true,[W('景色','けしき'),W('場所','ばしょ'),W('教えて','おしえて')]);
  s4(136,'ホテルはもう予約してあります。','호텔은 이미 예약되어 있습니다.','grammar','g_n4_25',['v_n4_35'],['g_n4_25'],['여행'],true,[W('予約','よやく')]);
  s4(137,'日本に来たばかりです。','일본에 온 지 얼마 안 되었습니다.','grammar','g_n4_56',[],['g_n4_56'],['자기소개','여행'],true,[W('日本','にほん'),W('来た','きた')]);
  s4(138,'観光する場所はこれから決めます。','관광할 곳은 이제부터 정합니다.','vocab','v_n4_339',['v_n4_339'],[],['여행','계획'],true,[W('観光','かんこう'),W('場所','ばしょ'),W('決めます','きめます')]);
  // 쇼핑·교환
  s4(139,'これより軽いのはありますか。','이것보다 가벼운 것은 있나요?','vocab','v_n4_225',[],['g_n5_7'],['쇼핑','문의'],true,[W('軽い','かるい')]);
  s4(140,'サイズが合わないので、返品したいです。','사이즈가 안 맞아서 반품하고 싶습니다.','vocab','v_n4_360',['v_n4_360','v_n4_362'],['g_n4_17'],['쇼핑','교환'],true,[W('合わない','あわない'),W('返品','へんぴん')]);
  s4(141,'大きいサイズと取り替えてもらえますか。','큰 사이즈로 교체해 주실 수 있나요?','grammar','g_n4_43',['v_n4_285'],['g_n4_43'],['쇼핑','교환'],true,[W('大きい','おおきい'),W('取り替えて','とりかえて')]);
  s4(142,'試着してみてもいいですか。','입어 봐도 될까요?','grammar','g_n4_7',['v_n4_361'],['g_n4_7','g_n5_14'],['쇼핑'],true,[W('試着','しちゃく')]);
  s4(143,'在庫を確認してもらっています。','재고를 확인 받고 있습니다.','grammar','g_n4_43',['v_n4_363'],['g_n4_43'],['쇼핑','문의'],true,[W('在庫','ざいこ'),W('確認','かくにん')]);
  s4(144,'人気の商品は売り切れるかもしれません。','인기 상품은 다 팔릴지도 모릅니다.','grammar','g_n4_19',['v_n4_287'],['g_n4_19'],['쇼핑'],true,[W('人気','にんき'),W('商品','しょうひん'),W('売り切れる','うりきれる')]);
  s4(145,'レシートを見せてください。','영수증을 보여 주세요.','vocab','v_n4_358',['v_n4_358'],['g_n5_13'],['쇼핑'],true,[W('見せて','みせて')]);
  s4(146,'現金でもカードでも払えます。','현금으로도 카드로도 낼 수 있습니다.','vocab','v_n4_365',['v_n4_365'],['g_n4_46'],['쇼핑'],true,[W('現金','げんきん'),W('払えます','はらえます')]);
  s4(147,'半額になっていたので、買ってしまいました。','반값이 되어 있어서 사 버렸습니다.','grammar','g_n4_1',['v_n4_369'],['g_n4_1','g_n4_17'],['쇼핑'],true,[W('半額','はんがく'),W('買って','かって')]);
  s4(148,'送料は無料だそうです。','배송료는 무료라고 합니다.','grammar','g_n4_8',['v_n4_370'],['g_n4_8'],['쇼핑'],true,[W('送料','そうりょう'),W('無料','むりょう')]);
  // 취미·경험
  s4(149,'ギターを習い始めたばかりです。','기타를 배우기 시작한 지 얼마 안 되었습니다.','grammar','g_n4_56',[],['g_n4_56'],['취미'],true,[W('習い始めた','ならいはじめた')]);
  s4(150,'富士山に登ったことがあります。','후지산에 오른 적이 있습니다.','grammar','g_n4_5',[],['g_n4_5'],['취미','경험'],true,[W('富士山','ふじさん'),W('登った','のぼった')]);
  s4(151,'写真を撮るのが好きになりました。','사진 찍는 것을 좋아하게 되었습니다.','grammar','g_n4_40',[],['g_n4_40','g_n5_34'],['취미'],true,[W('写真','しゃしん'),W('撮る','とる'),W('好き','すき')]);
  s4(152,'暇な時、何をしていますか。','한가할 때 무엇을 하고 있나요?','grammar','g_n5_32',[],['g_n5_32'],['취미','자기소개'],true,[W('暇','ひま'),W('時','とき'),W('何','なに')]);
  s4(153,'料理は母に教えてもらいました。','요리는 어머니에게 배웠습니다.','grammar','g_n4_43',[],['g_n4_43'],['취미','가족'],true,[W('料理','りょうり'),W('母','はは'),W('教えて','おしえて')]);
  s4(154,'絵を描いているところを見られて、恥ずかしかったです。','그림을 그리고 있는 것을 들켜서 부끄러웠습니다.','grammar','g_n4_54',[],['g_n4_54','g_n4_44'],['취미','감정'],true,[W('絵','え'),W('描いて','かいて'),W('見られて','みられて'),W('恥ずかしかった','はずかしかった')]);
  s4(155,'新しい趣味を始めようと思います。','새 취미를 시작하려고 합니다.','grammar','g_n4_53',[],['g_n4_53'],['취미'],true,[W('新しい','あたらしい'),W('趣味','しゅみ'),W('始めよう','はじめよう'),W('思います','おもいます')]);
  // 생활·감정·기타
  s4(156,'鍵を無くしてしまったかもしれません。','열쇠를 잃어버렸을지도 모릅니다.','grammar','g_n4_19',['v_n4_386'],['g_n4_19','g_n4_1'],['생활'],true,[W('鍵','かぎ'),W('無くして','なくして')]);
  s4(157,'電車に忘れ物をしたんですが。','전철에 물건을 두고 내렸는데요.','vocab','v_n4_387',['v_n4_387'],['g_n4_37'],['생활','문의'],true,[W('電車','でんしゃ'),W('忘れ物','わすれもの')]);
  s4(158,'停電で何も見えませんでした。','정전으로 아무것도 보이지 않았습니다.','vocab','v_n4_382',['v_n4_382'],[],['생활'],true,[W('停電','ていでん'),W('何','なに'),W('見えません','みえません')]);
  s4(159,'スマホを充電するのを忘れました。','스마트폰 충전하는 것을 잊었습니다.','vocab','v_n4_385',['v_n4_385','v_n4_4'],['g_n4_40'],['생활'],true,[W('充電','じゅうでん'),W('忘れました','わすれました')]);
  s4(160,'寝ている間に雨が降ったようです。','자는 사이에 비가 온 모양입니다.','grammar','g_n4_57',[],['g_n4_57','g_n4_10'],['생활','날씨'],true,[W('寝て','ねて'),W('間','あいだ'),W('雨','あめ'),W('降った','ふった')]);
  s4(161,'連絡をもらって安心しました。','연락을 받고 안심했습니다.','vocab','v_n4_372',['v_n4_372','v_n4_306'],[],['감정'],true,[W('連絡','れんらく'),W('安心','あんしん')]);
  s4(162,'結果が不安でしたが、合格できました。','결과가 불안했지만 합격할 수 있었습니다.','vocab','v_n4_373',['v_n4_373'],['g_n4_46'],['감정','학습'],true,[W('結果','けっか'),W('不安','ふあん'),W('合格','ごうかく')]);
  s4(163,'その映画に感動して、泣いてしまいました。','그 영화에 감동해서 울고 말았습니다.','vocab','v_n4_378',['v_n4_378'],['g_n4_1'],['감정','취미'],true,[W('映画','えいが'),W('感動','かんどう'),W('泣いて','ないて')]);
  s4(164,'試合に負けて残念でした。','시합에 져서 아쉬웠습니다.','vocab','v_n4_376',['v_n4_376'],[],['감정','스포츠'],true,[W('試合','しあい'),W('負けて','まけて'),W('残念','ざんねん')]);
  s4(165,'久しぶりに先輩に会いました。','오랜만에 선배를 만났습니다.','vocab','v_n4_406',['v_n4_406','v_n4_292'],[],['교제'],true,[W('久しぶり','ひさしぶり'),W('先輩','せんぱい'),W('会いました','あいました')]);
  s4(166,'早く元気になるように祈っています。','빨리 낫기를 빌고 있습니다.','grammar','g_n4_24',[],['g_n4_24'],['건강','교제'],true,[W('早く','はやく'),W('元気','げんき'),W('祈って','いのって')]);
  s4(167,'子供に野菜を食べさせています。','아이에게 채소를 먹이고 있습니다.','grammar','g_n4_45',[],['g_n4_45'],['가족','음식'],true,[W('子供','こども'),W('野菜','やさい'),W('食べさせて','たべさせて')]);
  s4(168,'母に部屋を掃除するように言われました。','어머니에게 방을 청소하라는 말을 들었습니다.','grammar','g_n4_47',[],['g_n4_47','g_n4_44'],['가족','생활'],true,[W('母','はは'),W('部屋','へや'),W('掃除','そうじ'),W('言われました','いわれました')]);
  s4(169,'早く寝なさいと言われました。','일찍 자라는 말을 들었습니다.','grammar','g_n4_60',[],['g_n4_60','g_n4_44'],['가족'],true,[W('早く','はやく'),W('寝なさい','ねなさい'),W('言われました','いわれました')]);
  s4(170,'弟に荷物を運んでもらいました。','남동생에게 짐을 옮겨 받았습니다.','grammar','g_n4_43',[],['g_n4_43'],['가족','생활'],true,[W('弟','おとうと'),W('荷物','にもつ'),W('運んで','はこんで')]);
  s4(171,'パソコンが壊れてしまいました。','컴퓨터가 고장 나 버렸습니다.','vocab','v_n4_256',['v_n4_256'],['g_n4_1'],['생활'],true,[W('壊れて','こわれて')]);
  s4(172,'自転車を直してもらいました。','자전거를 수리 받았습니다.','vocab','v_n4_257',['v_n4_257'],['g_n4_43'],['생활'],true,[W('自転車','じてんしゃ'),W('直して','なおして')]);
  s4(173,'電池を取り替えたら、動きました。','건전지를 갈았더니 움직였습니다.','vocab','v_n4_285',['v_n4_285','v_n4_384','v_n4_271'],[],['생활'],true,[W('電池','でんち'),W('取り替えたら','とりかえたら'),W('動きました','うごきました')]);
  s4(174,'お湯が沸いたら、火を消してください。','물이 끓으면 불을 꺼 주세요.','vocab','v_n4_260',['v_n4_260'],['g_n5_13'],['생활','음식'],true,[W('湯','ゆ'),W('沸いたら','わいたら'),W('火','ひ'),W('消して','けして')]);
  s4(175,'この道は車が多くて危ないです。','이 길은 차가 많아서 위험합니다.','vocab','v_n4_153',[],[],['생활','주의'],true,[W('道','みち'),W('車','くるま'),W('多くて','おおくて'),W('危ない','あぶない')]);
  s4(176,'非常口の場所を確認しておきましょう。','비상구 위치를 확인해 둡시다.','grammar','g_n4_2',['v_n4_394'],['g_n4_2'],['생활','주의'],true,[W('非常口','ひじょうぐち'),W('場所','ばしょ'),W('確認','かくにん')]);
  s4(177,'地震の時はまず火を消してください。','지진 때는 먼저 불을 꺼 주세요.','vocab','v_n4_391',['v_n4_391'],['g_n5_13'],['생활','주의'],true,[W('地震','じしん'),W('時','とき'),W('火','ひ'),W('消して','けして')]);
  s4(178,'やっとレポートが終わりました。','드디어 리포트가 끝났습니다.','vocab','v_n4_398',['v_n4_398','v_n4_313'],[],['학습'],true,[W('終わりました','おわりました')]);
  s4(179,'はっきり言ってくれたほうが助かります。','분명히 말해 주는 편이 도움이 됩니다.','vocab','v_n4_402',['v_n4_402'],['g_n4_42','g_n4_59'],['교제'],true,[W('言って','いって'),W('助かります','たすかります')]);
  s4(180,'やっぱり家で休むことにしました。','역시 집에서 쉬기로 했습니다.','vocab','v_n4_404',['v_n4_404'],['g_n4_20'],['생활'],true,[W('家','いえ'),W('休む','やすむ')]);
  return arr;
}

// ─── N4 완성 C (라운드 27) — sent_n4_181 ~ sent_n4_230 ───────────────
function n4SentencesC() {
  const arr = [];
  function s4c(num, ja, ko, source, src, vIds, gIds, tags, cic, readings) {
    arr.push({ id: 'sent_n4_' + String(num).padStart(3, '0'), level: 'N4', ja, ko,
      sourceType: source, sourceId: src,
      vocabIds: vIds, grammarIds: gIds,
      situationTags: tags, canUseInConversation: cic,
      readings: readings || [] });
  }
  const W = (text, reading) => ({ text, reading });
  // 레스토랑 예약 (신규 토픽)
  s4c(181,'金曜日の七時に予約したいのですが。','금요일 7시에 예약하고 싶은데요.','grammar','g_n4_37',['v_n4_35'],['g_n4_37','g_n5_12'],['예약','식당'],true,[W('金曜日','きんようび'),W('七時','しちじ'),W('予約','よやく')]);
  s4c(182,'四人で席をお願いします。','네 명 자리를 부탁합니다.','grammar','g_n5_13',[],['g_n5_13'],['예약','식당'],true,[W('四人','よにん'),W('席','せき'),W('願い','ねがい')]);
  s4c(183,'窓側の席にしていただけませんか。','창가 자리로 해 주시지 않겠습니까?','grammar','g_n4_61',[],['g_n4_61'],['예약','식당'],true,[W('窓側','まどがわ'),W('席','せき')]);
  s4c(184,'予約の時間を八時に変更したいです。','예약 시간을 8시로 변경하고 싶습니다.','vocab','v_n4_319',['v_n4_319','v_n4_35'],['g_n5_12'],['예약','전화'],true,[W('予約','よやく'),W('時間','じかん'),W('八時','はちじ'),W('変更','へんこう')]);
  s4c(185,'その日は満席だそうです。','그날은 만석이라고 합니다.','grammar','g_n4_8',[],['g_n4_8'],['예약','식당'],true,[W('日','ひ'),W('満席','まんせき')]);
  s4c(186,'席が空いているかどうか、電話で聞いてみます。','자리가 비어 있는지 전화로 물어보겠습니다.','grammar','g_n4_51',[],['g_n4_51','g_n4_7'],['예약','전화'],true,[W('席','せき'),W('空いて','あいて'),W('電話','でんわ'),W('聞いて','きいて')]);
  s4c(187,'予約を取り消す場合は、前の日までに連絡してください。','예약을 취소할 경우는 전날까지 연락해 주세요.','grammar','g_n4_63',['v_n4_320','v_n4_306'],['g_n4_63','g_n5_13'],['예약','전화'],true,[W('予約','よやく'),W('取り消す','とりけす'),W('場合','ばあい'),W('前','まえ'),W('日','ひ'),W('連絡','れんらく')]);
  s4c(188,'コースの内容を教えていただけませんか。','코스 내용을 알려 주시지 않겠습니까?','grammar','g_n4_61',['v_n4_620'],['g_n4_61'],['예약','식당'],true,[W('内容','ないよう'),W('教えて','おしえて')]);
  // 분실물 문의 (신규 토픽)
  s4c(189,'電車に傘を忘れてしまったんですが。','전철에 우산을 두고 내렸는데요.','grammar','g_n4_1',['v_n5_270'],['g_n4_1','g_n4_37'],['분실물','문의'],true,[W('電車','でんしゃ'),W('傘','かさ'),W('忘れて','わすれて')]);
  s4c(190,'どこで無くしたか、覚えていますか。','어디서 잃어버렸는지 기억하고 있나요?','vocab','v_n4_386',['v_n4_386','v_n4_224'],['g_n4_51'],['분실물','문의'],true,[W('無くした','なくした'),W('覚えて','おぼえて')]);
  s4c(191,'茶色い財布の落とし物は届いていますか。','갈색 지갑 분실물은 들어와 있나요?','vocab','v_n4_388',['v_n4_388','v_n4_72'],[],['분실물','역'],true,[W('茶色い','ちゃいろい'),W('財布','さいふ'),W('落とし物','おとしもの'),W('届いて','とどいて')]);
  s4c(192,'見つかったら、連絡していただけませんか。','찾으면 연락해 주시지 않겠습니까?','grammar','g_n4_61',['v_n4_15','v_n4_306'],['g_n4_61'],['분실물','문의'],true,[W('見つかったら','みつかったら'),W('連絡','れんらく')]);
  s4c(193,'中に現金とカードが入っています。','안에 현금과 카드가 들어 있습니다.','vocab','v_n4_365',['v_n4_365'],['g_n5_5'],['분실물','문의'],true,[W('中','なか'),W('現金','げんきん'),W('入って','はいって')]);
  s4c(194,'駅の窓口に届けておきました。','역 창구에 가져다 놓았습니다.','grammar','g_n4_2',['v_n4_323','v_n4_13'],['g_n4_2'],['분실물','역'],true,[W('駅','えき'),W('窓口','まどぐち'),W('届けて','とどけて')]);
  s4c(195,'連絡先を書いていただけますか。','연락처를 적어 주시겠어요?','vocab','v_n4_624',['v_n4_624'],['g_n4_61'],['분실물','문의'],true,[W('連絡先','れんらくさき'),W('書いて','かいて')]);
  // 신규 문법 활용
  s4c(196,'ここでは靴を脱ぐことになっています。','여기서는 신발을 벗게 되어 있습니다.','grammar','g_n4_62',[],['g_n4_62'],['생활','규칙'],true,[W('靴','くつ'),W('脱ぐ','ぬぐ')]);
  s4c(197,'彼が遅れるはずがありません。','그가 늦을 리가 없습니다.','grammar','g_n4_64',[],['g_n4_64'],['약속'],true,[W('彼','かれ'),W('遅れる','おくれる')]);
  s4c(198,'嫌いなわけではありませんが、あまり食べません。','싫어하는 것은 아니지만 별로 안 먹습니다.','grammar','g_n4_65',[],['g_n4_65'],['음식','취향'],true,[W('嫌い','きらい'),W('食べません','たべません')]);
  s4c(199,'「ひかり」という新幹線に乗りました。','"히카리"라는 신칸센을 탔습니다.','grammar','g_n4_66',['v_n4_124'],['g_n4_66'],['여행','교통'],true,[W('新幹線','しんかんせん'),W('乗りました','のりました')]);
  s4c(200,'今日は夏のように暑いですね。','오늘은 여름처럼 덥네요.','grammar','g_n4_67',[],['g_n4_67'],['날씨'],true,[W('今日','きょう'),W('夏','なつ'),W('暑い','あつい')]);
  s4c(201,'台風のため、飛行機が欠航になりました。','태풍 때문에 비행기가 결항되었습니다.','grammar','g_n4_68',[],['g_n4_68'],['여행','교통'],true,[W('台風','たいふう'),W('飛行機','ひこうき'),W('欠航','けっこう')]);
  s4c(202,'ニュースによると、明日は大雪だそうです。','뉴스에 의하면 내일은 폭설이라고 합니다.','grammar','g_n4_69',[],['g_n4_69'],['날씨'],true,[W('明日','あした'),W('大雪','おおゆき')]);
  s4c(203,'仕事は今日中に終わりそうにないです。','일은 오늘 안에 끝날 것 같지 않습니다.','grammar','g_n4_70',[],['g_n4_70'],['회사'],true,[W('仕事','しごと'),W('今日中','きょうじゅう'),W('終わり','おわり')]);
  s4c(204,'順番にお呼びしますので、お待ちください。','순서대로 부를 테니 기다려 주십시오.','grammar','g_n4_71',['v_n4_580'],['g_n4_71'],['병원','가게'],true,[W('順番','じゅんばん'),W('呼び','よび'),W('待ち','まち')]);
  s4c(205,'休みの日は寝てばかりいます。','쉬는 날은 자고만 있습니다.','grammar','g_n4_72',[],['g_n4_72'],['일상'],true,[W('休み','やすみ'),W('日','ひ'),W('寝て','ねて')]);
  s4c(206,'窓を開けたまま出かけてしまいました。','창문을 연 채 외출해 버렸습니다.','grammar','g_n4_73',[],['g_n4_73','g_n4_1'],['생활'],true,[W('窓','まど'),W('開けた','あけた'),W('出かけて','でかけて')]);
  s4c(207,'朝ご飯を食べずに学校へ行きました。','아침을 먹지 않고 학교에 갔습니다.','grammar','g_n4_74',[],['g_n4_74'],['일상','학교'],true,[W('朝','あさ'),W('飯','はん'),W('食べ','たべ'),W('学校','がっこう'),W('行きました','いきました')]);
  s4c(208,'明日までに返事をしなくてはいけません。','내일까지 답을 하지 않으면 안 됩니다.','grammar','g_n4_75',[],['g_n4_75'],['회사','약속'],true,[W('明日','あした'),W('返事','へんじ')]);
  // 신규 어휘 활용 — 생활/학교/감정
  s4c(209,'ゴミは決められた日に出してください。','쓰레기는 정해진 날에 내놓아 주세요.','vocab','v_n4_465',['v_n4_465'],['g_n4_44','g_n5_13'],['생활','규칙'],true,[W('決められた','きめられた'),W('日','ひ'),W('出して','だして')]);
  s4c(210,'家賃が高いので、引っ越しを考えています。','집세가 비싸서 이사를 생각하고 있습니다.','vocab','v_n4_467',['v_n4_467'],['g_n4_17'],['생활'],true,[W('家賃','やちん'),W('高い','たかい'),W('引っ越し','ひっこし'),W('考えて','かんがえて')]);
  s4c(211,'隣の部屋がうるさくて眠れません。','옆방이 시끄러워서 잠을 잘 수 없습니다.','vocab','v_n4_496',['v_n4_496','v_n4_435'],['g_n4_46'],['생활'],true,[W('隣','となり'),W('部屋','へや'),W('眠れません','ねむれません')]);
  s4c(212,'洗濯機の調子が悪いので、見てもらいたいです。','세탁기 상태가 안 좋아서 봐 줬으면 합니다.','vocab','v_n4_484',['v_n4_484'],['g_n4_43'],['생활','문의'],true,[W('洗濯機','せんたくき'),W('調子','ちょうし'),W('悪い','わるい'),W('見て','みて')]);
  s4c(213,'発音を直していただけませんか。','발음을 교정해 주시지 않겠습니까?','vocab','v_n4_511',['v_n4_511'],['g_n4_61'],['수업','학교'],true,[W('発音','はつおん'),W('直して','なおして')]);
  s4c(214,'単語を覚えるのに時間がかかります。','단어를 외우는 데 시간이 걸립니다.','vocab','v_n4_513',['v_n4_513'],['g_n4_40'],['공부','학교'],true,[W('単語','たんご'),W('覚える','おぼえる'),W('時間','じかん')]);
  s4c(215,'今回のテストで満点を取りました。','이번 시험에서 만점을 받았습니다.','vocab','v_n4_518',['v_n4_518','v_n4_667'],[],['학교','감정'],true,[W('今回','こんかい'),W('満点','まんてん'),W('取りました','とりました')]);
  s4c(216,'放課後、友だちと話し合いました。','방과 후에 친구와 의논했습니다.','vocab','v_n4_531',['v_n4_531','v_n4_463'],[],['학교','교제'],true,[W('放課後','ほうかご'),W('友','とも'),W('話し合いました','はなしあいました')]);
  s4c(217,'喉が痛いので、歯医者ではなく内科へ行きます。','목이 아파서 치과가 아니라 내과에 갑니다.','vocab','v_n4_542',['v_n4_542'],['g_n4_17'],['병원'],true,[W('喉','のど'),W('痛い','いたい'),W('歯医者','はいしゃ'),W('内科','ないか'),W('行きます','いきます')]);
  s4c(218,'健康のために、できるだけ歩いています。','건강을 위해 최대한 걷고 있습니다.','vocab','v_n4_534',['v_n4_534','v_n4_647'],['g_n4_16'],['건강'],true,[W('健康','けんこう'),W('歩いて','あるいて')]);
  s4c(219,'友だちのお見舞いに花を持って行きました。','친구 병문안에 꽃을 들고 갔습니다.','vocab','v_n4_535',['v_n4_535'],[],['병원','교제'],true,[W('友','とも'),W('見舞い','みまい'),W('花','はな'),W('持って','もって'),W('行きました','いきました')]);
  s4c(220,'特急に乗れば、早く着きます。','특급을 타면 빨리 도착합니다.','vocab','v_n4_555',['v_n4_555'],['g_n4_27'],['교통'],true,[W('特急','とっきゅう'),W('乗れば','のれば'),W('早く','はやく'),W('着きます','つきます')]);
  s4c(221,'指定席を予約しておきました。','지정석을 예약해 두었습니다.','vocab','v_n4_560',['v_n4_560','v_n4_35'],['g_n4_2'],['교통','여행'],true,[W('指定席','していせき'),W('予約','よやく')]);
  s4c(222,'帰りにスーパーに寄ってもいいですか。','돌아가는 길에 슈퍼에 들러도 될까요?','vocab','v_n4_571',['v_n4_571'],['g_n5_14'],['일상'],true,[W('帰り','かえり'),W('寄って','よって')]);
  s4c(223,'駅員に行き先を確認しました。','역무원에게 행선지를 확인했습니다.','vocab','v_n4_573',['v_n4_573','v_n4_572','v_n4_307'],[],['교통','역'],true,[W('駅員','えきいん'),W('行き先','いきさき'),W('確認','かくにん')]);
  s4c(224,'プレゼント用に包装をお願いします。','선물용으로 포장을 부탁합니다.','vocab','v_n4_588',['v_n4_588'],['g_n5_13'],['쇼핑'],true,[W('用','よう'),W('包装','ほうそう'),W('願い','ねがい')]);
  s4c(225,'閉店の前に買い物を済ませました。','폐점 전에 장보기를 마쳤습니다.','vocab','v_n4_579',['v_n4_579'],['g_n5_28'],['쇼핑'],true,[W('閉店','へいてん'),W('前','まえ'),W('買い物','かいもの'),W('済ませました','すませました')]);
  s4c(226,'彼は優しくて、真面目な人です。','그는 상냥하고 성실한 사람입니다.','vocab','v_n4_592',['v_n4_592','v_n4_594'],[],['성격','교제'],true,[W('彼','かれ'),W('優しくて','やさしくて'),W('真面目','まじめ'),W('人','ひと')]);
  s4c(227,'冗談を言うのが好きです。','농담하는 것을 좋아합니다.','vocab','v_n4_605',['v_n4_605'],['g_n4_40'],['성격','교제'],true,[W('冗談','じょうだん'),W('言う','いう'),W('好き','すき')]);
  s4c(228,'私はその意見に賛成です。','저는 그 의견에 찬성입니다.','vocab','v_n4_613',['v_n4_613','v_n4_612'],[],['소통','회의'],true,[W('私','わたし'),W('意見','いけん'),W('賛成','さんせい')]);
  s4c(229,'留守の間に荷物が届いたようです。','부재중에 짐이 도착한 모양입니다.','vocab','v_n4_626',['v_n4_626'],['g_n4_57','g_n4_10'],['생활'],true,[W('留守','るす'),W('間','あいだ'),W('荷物','にもつ'),W('届いた','とどいた')]);
  s4c(230,'もうすぐ桜が咲くそうです。','곧 벚꽃이 핀다고 합니다.','vocab','v_n4_643',['v_n4_643'],['g_n4_8'],['계절','자연'],true,[W('桜','さくら'),W('咲く','さく')]);
  return arr;
}

// ─── N4 완성 D (라운드 28) — sent_n4_231 ~ sent_n4_300 ───────────────
function n4SentencesD() {
  const arr = [];
  function s4d(num, ja, ko, source, src, vIds, gIds, tags, cic, readings) {
    arr.push({ id: 'sent_n4_' + String(num).padStart(3, '0'), level: 'N4', ja, ko,
      sourceType: source, sourceId: src,
      vocabIds: vIds, grammarIds: gIds,
      situationTags: tags, canUseInConversation: cic,
      readings: readings || [] });
  }
  const W = (text, reading) => ({ text, reading });
  // 호텔/숙소 (신규 토픽)
  s4d(231,'チェックインをお願いします。','체크인을 부탁합니다.','grammar','g_n5_13',[],['g_n5_13'],['호텔','여행'],true,[W('願い','ねがい')]);
  s4d(232,'荷物を預かっていただけませんか。','짐을 맡아 주시지 않겠습니까?','grammar','g_n4_61',[],['g_n4_61'],['호텔','여행'],true,[W('荷物','にもつ'),W('預かって','あずかって')]);
  s4d(233,'朝ご飯は何時から食べられますか。','아침은 몇 시부터 먹을 수 있나요?','grammar','g_n4_46',[],['g_n4_46'],['호텔','여행'],true,[W('朝','あさ'),W('飯','はん'),W('何時','なんじ'),W('食べられます','たべられます')]);
  s4d(234,'部屋の鍵を無くしてしまいました。','방 열쇠를 잃어버리고 말았습니다.','vocab','v_n4_386',['v_n4_386'],['g_n4_1'],['호텔','분실물'],true,[W('部屋','へや'),W('鍵','かぎ'),W('無くして','なくして')]);
  s4d(235,'もう一泊できますか。','하루 더 묵을 수 있나요?','grammar','g_n4_46',[],['g_n4_46'],['호텔','여행'],true,[W('一泊','いっぱく')]);
  s4d(236,'タオルを取り替えていただけますか。','수건을 갈아 주시겠어요?','vocab','v_n4_285',['v_n4_285'],['g_n4_61'],['호텔'],true,[W('取り替えて','とりかえて')]);
  s4d(237,'静かな部屋にしていただけませんか。','조용한 방으로 해 주시지 않겠습니까?','grammar','g_n4_61',[],['g_n4_61','g_n4_80'],['호텔','예약'],true,[W('静か','しずか'),W('部屋','へや')]);
  // 회사 전화 (신규 토픽)
  s4d(238,'お電話ありがとうございます。','전화 주셔서 감사합니다.','grammar','g_n5_1',[],[],['전화','회사'],true,[W('電話','でんわ')]);
  s4d(239,'担当者に代わりますので、少々お待ちください。','담당자를 바꿔 드릴 테니 잠시 기다려 주십시오.','vocab','v_n4_842',['v_n4_842'],['g_n4_71'],['전화','회사'],true,[W('担当者','たんとうしゃ'),W('代わります','かわります'),W('少々','しょうしょう'),W('待ち','まち')]);
  s4d(240,'ただいま外出中です。','지금 외출 중입니다.','grammar','g_n4_83',[],['g_n4_83'],['전화','회사'],true,[W('外出中','がいしゅつちゅう')]);
  s4d(241,'伝言をお願いできますか。','메시지를 부탁드릴 수 있을까요?','vocab','v_n4_625',['v_n4_625'],[],['전화','회사'],true,[W('伝言','でんごん'),W('願い','ねがい')]);
  s4d(242,'後ほどこちらからお電話します。','나중에 이쪽에서 전화드리겠습니다.','grammar','g_n5_1',[],[],['전화','회사'],true,[W('後','のち'),W('電話','でんわ')]);
  s4d(243,'お名前をもう一度お願いします。','성함을 한 번 더 부탁드립니다.','grammar','g_n5_13',[],[],['전화','문의'],true,[W('名前','なまえ'),W('一度','いちど'),W('願い','ねがい')]);
  s4d(244,'戻りましたら、伝えておきます。','돌아오면 전해 놓겠습니다.','grammar','g_n4_2',['v_n4_409','v_n4_91'],['g_n4_2'],['전화','회사'],true,[W('戻りましたら','もどりましたら'),W('伝えて','つたえて')]);
  // 신규 문법 활용
  s4d(245,'日本語を習い始めたばかりです。','일본어를 배우기 시작한 지 얼마 안 됐습니다.','grammar','g_n4_76',[],['g_n4_76','g_n4_56'],['자기소개','학습'],true,[W('日本語','にほんご'),W('習い始めた','ならいはじめた')]);
  s4d(246,'この本をやっと読み終わりました。','이 책을 드디어 다 읽었습니다.','grammar','g_n4_77',[],['g_n4_77'],['취미','학습'],true,[W('本','ほん'),W('読み終わりました','よみおわりました')]);
  s4d(247,'一年間、日記を書き続けています。','1년간 일기를 계속 쓰고 있습니다.','grammar','g_n4_78',[],['g_n4_78'],['생활','학습'],true,[W('一年間','いちねんかん'),W('日記','にっき'),W('書き続けて','かきつづけて')]);
  s4d(248,'赤ちゃんが急に泣き出しました。','아기가 갑자기 울기 시작했습니다.','grammar','g_n4_79',[],['g_n4_79'],['가족','생활'],true,[W('赤ちゃん','あかちゃん'),W('急に','きゅうに'),W('泣き出しました','なきだしました')]);
  s4d(249,'私はそばにします。','저는 메밀국수로 하겠습니다.','grammar','g_n4_80',['v_n4_753'],['g_n4_80'],['식당','주문'],true,[W('私','わたし')]);
  s4d(250,'隣の家からピアノの音がします。','옆집에서 피아노 소리가 납니다.','grammar','g_n4_81',['v_n4_877'],['g_n4_81'],['생활'],true,[W('隣','となり'),W('家','いえ'),W('音','おと')]);
  s4d(251,'もっと早く出発すればよかったです。','더 일찍 출발했으면 좋았을 텐데요.','grammar','g_n4_82',['v_n4_343'],['g_n4_82'],['교통','후회'],true,[W('早く','はやく'),W('出発','しゅっぱつ')]);
  s4d(252,'今、食事中なので、後でかけ直します。','지금 식사 중이라 나중에 다시 걸겠습니다.','grammar','g_n4_83',[],['g_n4_83'],['전화','일상'],true,[W('今','いま'),W('食事中','しょくじちゅう'),W('後','あと'),W('直します','なおします')]);
  s4d(253,'窓を開けたら、虹が見えました。','창문을 열었더니 무지개가 보였습니다.','grammar','g_n4_84',['v_n4_891'],['g_n4_84'],['생활','자연'],true,[W('窓','まど'),W('開けたら','あけたら'),W('虹','にじ'),W('見えました','みえました')]);
  s4d(254,'先生は何時にお帰りになりますか。','선생님은 몇 시에 돌아가십니까?','grammar','g_n4_85',[],['g_n4_85'],['학교','경어'],true,[W('先生','せんせい'),W('何時','なんじ'),W('帰り','かえり')]);
  // 신규 어휘 활용 — 생활
  s4d(255,'寝坊して、朝ご飯を食べられませんでした。','늦잠 자서 아침을 못 먹었습니다.','vocab','v_n4_708',['v_n4_708'],['g_n4_46'],['생활'],true,[W('寝坊','ねぼう'),W('朝','あさ'),W('飯','はん'),W('食べられません','たべられません')]);
  s4d(256,'洗濯物を干してから出かけます。','빨래를 널고 나서 외출합니다.','vocab','v_n4_703',['v_n4_703'],[],['생활','집'],true,[W('洗濯物','せんたくもの'),W('干して','ほして'),W('出かけます','でかけます')]);
  s4d(257,'ゴミを出すのを忘れないでください。','쓰레기 내놓는 것을 잊지 마세요.','vocab','v_n4_465',['v_n4_465'],['g_n4_40'],['생활','집'],true,[W('出す','だす'),W('忘れないで','わすれないで')]);
  s4d(258,'冷めないうちに食べてください。','식기 전에 드세요.','vocab','v_n4_687',['v_n4_687'],['g_n5_13'],['음식','가족'],true,[W('冷めない','さめない'),W('食べて','たべて')]);
  s4d(259,'スープを温め直しました。','수프를 다시 데웠습니다.','vocab','v_n4_688',['v_n4_688'],[],['음식','집'],true,[W('温め直しました','あたためなおしました')]);
  s4d(260,'喉が渇いたので、冷たい水をください。','목이 말라서 차가운 물을 주세요.','vocab','v_n4_697',['v_n4_697','v_n4_761'],['g_n4_17'],['식당','일상'],true,[W('喉','のど'),W('渇いた','かわいた'),W('冷たい','つめたい'),W('水','みず')]);
  s4d(261,'熱いので、気をつけてください。','뜨거우니까 조심하세요.','vocab','v_n4_760',['v_n4_760'],['g_n4_17'],['식당','주의'],true,[W('熱い','あつい'),W('気','き')]);
  s4d(262,'デザートは別々に頼みましょう。','디저트는 따로따로 시킵시다.','vocab','v_n4_742',['v_n4_742','v_n4_790'],['g_n5_10'],['식당','주문'],true,[W('別々','べつべつ'),W('頼みましょう','たのみましょう')]);
  s4d(263,'ご飯のお代わりは無料です。','밥 리필은 무료입니다.','vocab','v_n4_754',['v_n4_754','v_n4_68'],[],['식당'],true,[W('飯','はん'),W('代わり','かわり'),W('無料','むりょう')]);
  s4d(264,'味が薄かったら、塩を足してください。','맛이 싱거우면 소금을 더하세요.','vocab','v_n4_759',['v_n4_759','v_n4_428'],['g_n5_13'],['음식','집'],true,[W('味','あじ'),W('薄かったら','うすかったら'),W('塩','しお'),W('足して','たして')]);
  // 학교/행사/소통
  s4d(265,'入学式は四月の初めにあります。','입학식은 4월 초에 있습니다.','vocab','v_n4_856',['v_n4_856'],[],['학교','행사'],true,[W('入学式','にゅうがくしき'),W('四月','しがつ'),W('初め','はじめ')]);
  s4d(266,'運動会で百メートル走に出ます。','운동회에서 100미터 달리기에 나갑니다.','vocab','v_n4_858',['v_n4_858'],[],['학교','행사'],true,[W('運動会','うんどうかい'),W('百','ひゃく'),W('走','そう'),W('出ます','でます')]);
  s4d(267,'時間割が新しくなりました。','시간표가 새로워졌습니다.','vocab','v_n4_862',['v_n4_862'],['g_n5_34'],['학교'],true,[W('時間割','じかんわり'),W('新しく','あたらしく')]);
  s4d(268,'スピーチのテーマを決めましたか。','스피치 주제를 정했나요?','vocab','v_n4_909',['v_n4_909','v_n4_882'],[],['학교','발표'],true,[W('決めました','きめました')]);
  s4d(269,'アンケートにご協力ください。','설문에 협조해 주십시오.','vocab','v_n4_910',['v_n4_910'],['g_n4_71'],['소통'],true,[W('協力','きょうりょく')]);
  s4d(270,'招待状をもらって、嬉しかったです。','초대장을 받아서 기뻤습니다.','vocab','v_n4_847',['v_n4_847'],[],['행사','감정'],true,[W('招待状','しょうたいじょう'),W('嬉しかった','うれしかった')]);
  s4d(271,'お祝いに花束を贈りました。','축하 선물로 꽃다발을 보냈습니다.','vocab','v_n4_846',['v_n4_846','v_n4_915'],[],['행사','교제'],true,[W('祝い','いわい'),W('花束','はなたば'),W('贈りました','おくりました')]);
  s4d(272,'記念に写真を撮りませんか。','기념으로 사진을 찍지 않을래요?','vocab','v_n4_907',['v_n4_907'],['g_n5_11'],['여행','교제'],true,[W('記念','きねん'),W('写真','しゃしん'),W('撮りません','とりません')]);
  // 교통/장소
  s4d(273,'朝の電車は満員で大変です。','아침 전철은 만원이라 힘듭니다.','vocab','v_n4_887',['v_n4_887'],[],['교통'],true,[W('朝','あさ'),W('電車','でんしゃ'),W('満員','まんいん'),W('大変','たいへん')]);
  s4d(274,'駅の手前で降ろしてください。','역 바로 앞에서 내려 주세요.','vocab','v_n4_821',['v_n4_821'],['g_n5_13'],['교통','택시'],true,[W('駅','えき'),W('手前','てまえ'),W('降ろして','おろして')]);
  s4d(275,'トイレは店の奥にあります。','화장실은 가게 안쪽에 있습니다.','vocab','v_n4_820',['v_n4_820'],['g_n5_7'],['가게','안내'],true,[W('店','みせ'),W('奥','おく')]);
  s4d(276,'銀行の向かいで待っています。','은행 맞은편에서 기다리고 있겠습니다.','vocab','v_n4_823',['v_n4_823'],['g_n5_5'],['약속','길안내'],true,[W('銀行','ぎんこう'),W('向かい','むかい'),W('待って','まって')]);
  s4d(277,'坂を上がると、公園があります。','언덕을 오르면 공원이 있습니다.','vocab','v_n4_828',['v_n4_828','v_n4_673'],['g_n5_7'],['길안내'],true,[W('坂','さか'),W('上がる','あがる'),W('公園','こうえん')]);
  s4d(278,'市役所はこの通りの真ん中にあります。','시청은 이 거리 한가운데에 있습니다.','vocab','v_n4_810',['v_n4_810','v_n4_826'],[],['길안내','장소'],true,[W('市役所','しやくしょ'),W('通り','とおり'),W('真ん中','まんなか')]);
  // 일/회사/취미
  s4d(279,'三時から打ち合わせがあります。','3시부터 미팅이 있습니다.','vocab','v_n4_841',['v_n4_841'],['g_n5_7'],['회사','일정'],true,[W('三時','さんじ'),W('打ち合わせ','うちあわせ')]);
  s4d(280,'新人の時は、毎日緊張していました。','신입 때는 매일 긴장했었습니다.','vocab','v_n4_840',['v_n4_840','v_n4_374'],['g_n5_32'],['회사','감정'],true,[W('新人','しんじん'),W('時','とき'),W('毎日','まいにち'),W('緊張','きんちょう')]);
  s4d(281,'アルバイトの時給が上がりました。','아르바이트 시급이 올랐습니다.','vocab','v_n4_843',['v_n4_843','v_n4_673'],[],['일'],true,[W('時給','じきゅう'),W('上がりました','あがりました')]);
  s4d(282,'スケジュールを確認してから返事します。','스케줄을 확인하고 나서 답하겠습니다.','vocab','v_n4_870',['v_n4_870','v_n4_307'],[],['회사','약속'],true,[W('確認','かくにん'),W('返事','へんじ')]);
  s4d(283,'チームで話し合って決めましょう。','팀에서 의논해서 정합시다.','vocab','v_n4_867',['v_n4_867','v_n4_463'],['g_n5_10'],['회사','회의'],true,[W('話し合って','はなしあって'),W('決めましょう','きめましょう')]);
  s4d(284,'毎週、テニスのレッスンを受けています。','매주 테니스 레슨을 받고 있습니다.','vocab','v_n4_873',['v_n4_873','v_n4_881','v_n4_680'],['g_n5_5'],['취미'],true,[W('毎週','まいしゅう'),W('受けて','うけて')]);
  s4d(285,'コンサートのチケットが取れました。','콘서트 티켓을 구했습니다.','vocab','v_n4_879',['v_n4_879','v_n4_880'],['g_n4_46'],['취미'],true,[W('取れました','とれました')]);
  s4d(286,'どんな番組をよく見ますか。','어떤 프로그램을 자주 보나요?','vocab','v_n4_911',['v_n4_911'],[],['취미','자기소개'],true,[W('番組','ばんぐみ'),W('見ます','みます')]);
  s4d(287,'アニメで覚えた言葉がたくさんあります。','애니메이션으로 익힌 말이 많이 있습니다.','vocab','v_n4_914',['v_n4_914'],['g_n5_7'],['취미','학습'],true,[W('覚えた','おぼえた'),W('言葉','ことば')]);
  s4d(288,'うちでは猫と金魚を飼っています。','우리 집에서는 고양이와 금붕어를 기르고 있습니다.','vocab','v_n4_699',['v_n4_699','v_n4_903'],['g_n5_5'],['생활','동물'],true,[W('猫','ねこ'),W('金魚','きんぎょ'),W('飼って','かって')]);
  // 감정/조언/기타
  s4d(289,'決して無理をしないでください。','결코 무리하지 마세요.','vocab','v_n4_780',['v_n4_780'],[],['건강','조언'],true,[W('決して','けっして'),W('無理','むり')]);
  s4d(290,'しっかり休んでくださいね。','푹 쉬세요.','vocab','v_n4_781',['v_n4_781'],['g_n5_13'],['건강','교제'],true,[W('休んで','やすんで')]);
  s4d(291,'うっかり傘を電車に忘れました。','깜빡 우산을 전철에 두고 내렸습니다.','vocab','v_n4_788',['v_n4_788'],[],['분실물','생활'],true,[W('傘','かさ'),W('電車','でんしゃ'),W('忘れました','わすれました')]);
  s4d(292,'わざわざ駅まで迎えに来てくれました。','일부러 역까지 마중 나와 주었습니다.','vocab','v_n4_785',['v_n4_785','v_n4_433'],['g_n4_42'],['교제'],true,[W('駅','えき'),W('迎え','むかえ'),W('来て','きて')]);
  s4d(293,'ぜひうちに遊びに来てください。','꼭 우리 집에 놀러 오세요.','vocab','v_n4_786',['v_n4_786'],['g_n5_13'],['교제','권유'],true,[W('遊び','あそび'),W('来て','きて')]);
  s4d(294,'発表の前はちっとも眠れませんでした。','발표 전에는 조금도 잘 수 없었습니다.','vocab','v_n4_789',['v_n4_789','v_n4_435'],['g_n4_46'],['감정','학교'],true,[W('発表','はっぴょう'),W('前','まえ'),W('眠れません','ねむれません')]);
  s4d(295,'歌は苦手ですが、ダンスは得意です。','노래는 잘 못하지만 댄스는 잘합니다.','vocab','v_n4_773',['v_n4_773','v_n4_772','v_n4_876'],['g_n5_39'],['취미','자기소개'],true,[W('歌','うた'),W('苦手','にがて'),W('得意','とくい')]);
  s4d(296,'大切なものは金庫に入れてください。','소중한 것은 금고에 넣어 주세요.','vocab','v_n4_767',['v_n4_767'],['g_n5_13'],['호텔','주의'],true,[W('大切','たいせつ'),W('金庫','きんこ'),W('入れて','いれて')]);
  s4d(297,'梅雨は洗濯物が乾きにくいです。','장마철에는 빨래가 잘 안 마릅니다.','vocab','v_n4_890',['v_n4_890','v_n4_449'],['g_n4_14'],['생활','계절'],true,[W('梅雨','つゆ'),W('洗濯物','せんたくもの'),W('乾きにくい','かわきにくい')]);
  s4d(298,'雷が鳴ったら、建物の中に入ってください。','천둥이 치면 건물 안으로 들어가세요.','vocab','v_n4_892',['v_n4_892'],['g_n5_13'],['주의','자연'],true,[W('雷','かみなり'),W('鳴ったら','なったら'),W('建物','たてもの'),W('中','なか'),W('入って','はいって')]);
  s4d(299,'未来のことは誰にも分かりません。','미래의 일은 누구도 모릅니다.','vocab','v_n4_803',['v_n4_803'],[],['생활'],true,[W('未来','みらい'),W('誰','だれ'),W('分かりません','わかりません')]);
  s4d(300,'早めに予約したほうがいいですよ。','일찌감치 예약하는 편이 좋아요.','vocab','v_n4_791',['v_n4_791','v_n4_35'],['g_n4_59'],['예약','조언'],true,[W('早めに','はやめに'),W('予約','よやく')]);
  return arr;
}

// ─── N3 0차 시드 (라운드 32) — sent_n3_001 ~ sent_n3_050 ─────────────
function n3SeedSentences() {
  const arr = [];
  function s3(num, ja, ko, source, src, vIds, gIds, tags, cic, readings) {
    arr.push({ id: 'sent_n3_' + String(num).padStart(3, '0'), level: 'N3', ja, ko,
      sourceType: source, sourceId: src,
      vocabIds: vIds, grammarIds: gIds,
      situationTags: tags, canUseInConversation: cic,
      readings: readings || [] });
  }
  const Y = (text, reading) => ({ text, reading });
  // 직장 일정 조정 (토픽 1)
  s3(1,'会議の日程を変更していただけませんか。','회의 일정을 변경해 주시지 않겠습니까?','grammar','g_n4_61',['v_n4_319'],['g_n4_61'],['직장','일정'],true,[Y('会議','かいぎ'),Y('日程','にってい'),Y('変更','へんこう')]);
  s3(2,'資料は前日までに提出してください。','자료는 전날까지 제출해 주세요.','vocab','v_n3_10',['v_n3_10','v_n4_795'],['g_n5_13'],['직장','일정'],true,[Y('資料','しりょう'),Y('前日','ぜんじつ'),Y('提出','ていしゅつ')]);
  s3(3,'取引先の都合で予定が変わりました。','거래처 사정으로 예정이 바뀌었습니다.','vocab','v_n3_12',['v_n3_12'],[],['직장','일정'],true,[Y('取引先','とりひきさき'),Y('都合','つごう'),Y('予定','よてい'),Y('変わりました','かわりました')]);
  s3(4,'この仕事は私に任せてください。','이 일은 저에게 맡겨 주세요.','vocab','v_n3_64',['v_n3_64'],['g_n5_13'],['직장'],true,[Y('仕事','しごと'),Y('私','わたし'),Y('任せて','まかせて')]);
  s3(5,'大事な会議なので、休むわけにはいきません。','중요한 회의라서 쉴 수는 없습니다.','grammar','g_n3_20',[],['g_n3_20'],['직장','일정'],true,[Y('大事','だいじ'),Y('会議','かいぎ'),Y('休む','やすむ')]);
  s3(6,'部長の指示を確かめてから進めます。','부장님 지시를 확인하고 나서 진행하겠습니다.','vocab','v_n3_63',['v_n3_63','v_n3_18','v_n3_81'],[],['직장','일정'],true,[Y('部長','ぶちょう'),Y('指示','しじ'),Y('確かめて','たしかめて'),Y('進めます','すすめます')]);
  s3(7,'忙しいうちは、無理をしないでください。','바쁠 때는 무리하지 마세요.','grammar','g_n3_3',[],['g_n3_3'],['직장','조언'],true,[Y('忙しい','いそがしい'),Y('無理','むり')]);
  s3(8,'締め切りが近いので、急がなくてはいけません。','마감이 가까워서 서두르지 않으면 안 됩니다.','grammar','g_n4_75',['v_n4_304'],['g_n4_75'],['직장','일정'],true,[Y('締め切り','しめきり'),Y('近い','ちかい'),Y('急がなくて','いそがなくて')]);
  // 여행 문제 해결 (토픽 2)
  s3(9,'台風の影響で飛行機が欠航になりました。','태풍의 영향으로 비행기가 결항되었습니다.','vocab','v_n3_6',['v_n3_6'],[],['여행','문제'],true,[Y('台風','たいふう'),Y('影響','えいきょう'),Y('飛行機','ひこうき'),Y('欠航','けっこう')]);
  s3(10,'日程の変更は無料でできますか。','일정 변경은 무료로 가능한가요?','vocab','v_n4_319',['v_n4_319','v_n4_68'],[],['여행','문제'],true,[Y('日程','にってい'),Y('変更','へんこう'),Y('無料','むりょう')]);
  s3(11,'状況を確認して、すぐに連絡します。','상황을 확인하고 바로 연락드리겠습니다.','vocab','v_n3_7',['v_n3_7','v_n4_307','v_n4_306'],[],['여행','문제'],true,[Y('状況','じょうきょう'),Y('確認','かくにん'),Y('連絡','れんらく')]);
  s3(12,'別の方法を考えましょう。','다른 방법을 생각해 봅시다.','vocab','v_n3_105',['v_n3_105'],['g_n5_10'],['여행','문제'],true,[Y('別','べつ'),Y('方法','ほうほう'),Y('考えましょう','かんがえましょう')]);
  s3(13,'困った時は、駅の案内所に頼るといいですよ。','곤란할 때는 역 안내소에 의지하면 좋아요.','vocab','v_n3_76',['v_n3_76','v_n4_591'],['g_n5_32'],['여행','조언'],true,[Y('困った','こまった'),Y('時','とき'),Y('駅','えき'),Y('案内所','あんないじょ'),Y('頼る','たよる')]);
  s3(14,'慌てないで、まず状況を整理しましょう。','당황하지 말고 먼저 상황을 정리합시다.','vocab','v_n3_82',['v_n3_82','v_n3_7'],['g_n5_10'],['여행','문제'],true,[Y('慌てないで','あわてないで'),Y('状況','じょうきょう'),Y('整理','せいり')]);
  s3(15,'ホテルに事情を説明して、助かりました。','호텔에 사정을 설명해서 도움이 됐습니다.','vocab','v_n3_41',['v_n3_41','v_n3_78'],[],['여행','문제'],true,[Y('事情','じじょう'),Y('説明','せつめい'),Y('助かりました','たすかりました')]);
  s3(16,'雨のせいで、予定が全部変わってしまいました。','비 탓에 예정이 전부 바뀌고 말았습니다.','grammar','g_n3_6',[],['g_n3_6','g_n4_1'],['여행','문제'],true,[Y('雨','あめ'),Y('予定','よてい'),Y('全部','ぜんぶ'),Y('変わって','かわって')]);
  // 의견 말하기 / 추천 (토픽 3)
  s3(17,'私の意見を述べてもいいですか。','제 의견을 말해도 될까요?','vocab','v_n3_61',['v_n3_61','v_n4_612'],['g_n5_14'],['의견','소통'],true,[Y('私','わたし'),Y('意見','いけん'),Y('述べて','のべて')]);
  s3(18,'その提案に賛成です。','그 제안에 찬성입니다.','vocab','v_n3_11',['v_n3_11','v_n4_613'],[],['의견','소통'],true,[Y('提案','ていあん'),Y('賛成','さんせい')]);
  s3(19,'具体的な例を挙げて説明します。','구체적인 예를 들어 설명하겠습니다.','vocab','v_n3_93',['v_n3_93','v_n4_621'],[],['의견','소통'],true,[Y('具体的','ぐたいてき'),Y('例','れい'),Y('挙げて','あげて'),Y('説明','せつめい')]);
  s3(20,'私にとって、これは大切な問題です。','저에게 있어 이것은 중요한 문제입니다.','grammar','g_n3_10',[],['g_n3_10'],['의견'],true,[Y('私','わたし'),Y('大切','たいせつ'),Y('問題','もんだい')]);
  s3(21,'環境問題について、どう思いますか。','환경 문제에 대해 어떻게 생각하세요?','grammar','g_n3_11',['v_n3_33'],['g_n3_11','g_n4_38'],['의견','소통'],true,[Y('環境問題','かんきょうもんだい'),Y('思います','おもいます')]);
  s3(22,'去年に比べて、状況はよくなっています。','작년에 비해 상황은 좋아지고 있습니다.','grammar','g_n3_12',['v_n3_7'],['g_n3_12'],['의견'],true,[Y('去年','きょねん'),Y('比べて','くらべて'),Y('状況','じょうきょう')]);
  s3(23,'この店は雰囲気がいいので、おすすめです。','이 가게는 분위기가 좋아서 추천합니다.','vocab','v_n3_59',['v_n3_59'],['g_n4_17'],['의견','추천'],true,[Y('店','みせ'),Y('雰囲気','ふんいき')]);
  s3(24,'実際に使ってみて、効果を感じました。','실제로 써 보고 효과를 느꼈습니다.','vocab','v_n3_102',['v_n3_102','v_n3_30'],['g_n4_7'],['의견','추천'],true,[Y('実際','じっさい'),Y('使って','つかって'),Y('効果','こうか'),Y('感じました','かんじました')]);
  s3(25,'反対の意見も聞いてみましょう。','반대 의견도 들어 봅시다.','vocab','v_n4_614',['v_n4_614','v_n4_612'],['g_n5_10'],['의견','소통'],true,[Y('反対','はんたい'),Y('意見','いけん'),Y('聞いて','きいて')]);
  // 일반 N3 문형/어휘 활용
  s3(26,'温かいうちに食べましょう。','따뜻할 때 먹읍시다.','grammar','g_n3_3',[],['g_n3_3','g_n5_10'],['음식','일상'],true,[Y('温かい','あたたかい'),Y('食べましょう','たべましょう')]);
  s3(27,'この歌を聞くたびに、学生時代を思い出します。','이 노래를 들을 때마다 학생 시절이 생각납니다.','grammar','g_n3_4',[],['g_n3_4'],['취미','일상'],true,[Y('歌','うた'),Y('聞く','きく'),Y('学生時代','がくせいじだい'),Y('思い出します','おもいだします')]);
  s3(28,'先生のおかげで、自信がつきました。','선생님 덕분에 자신감이 생겼습니다.','grammar','g_n3_5',['v_n4_381'],['g_n3_5'],['학교','감사'],true,[Y('先生','せんせい'),Y('自信','じしん')]);
  s3(29,'寝坊したせいで、会議に遅刻しました。','늦잠 잔 탓에 회의에 지각했습니다.','grammar','g_n3_6',['v_n4_708'],['g_n3_6'],['직장'],true,[Y('寝坊','ねぼう'),Y('会議','かいぎ'),Y('遅刻','ちこく')]);
  s3(30,'練習すればするほど上手になります。','연습하면 할수록 능숙해집니다.','grammar','g_n3_9',[],['g_n3_9'],['학습','조언'],true,[Y('練習','れんしゅう'),Y('上手','じょうず')]);
  s3(31,'外は雨が降っているみたいです。','밖은 비가 내리고 있는 것 같습니다.','grammar','g_n3_13',[],['g_n3_13'],['날씨','일상'],true,[Y('外','そと'),Y('雨','あめ'),Y('降って','ふって')]);
  s3(32,'最近、忘れっぽくなりました。','요즘 잘 잊어버리게 되었습니다.','grammar','g_n3_14',[],['g_n3_14'],['일상'],true,[Y('最近','さいきん'),Y('忘れっぽく','わすれっぽく')]);
  s3(33,'冬は風邪をひきがちなので、気をつけましょう。','겨울에는 감기에 걸리기 쉬우니 조심합시다.','grammar','g_n3_15',[],['g_n3_15','g_n5_10'],['건강','조언'],true,[Y('冬','ふゆ'),Y('風邪','かぜ'),Y('気','き')]);
  s3(34,'疲れ気味の時は、早く寝るのが一番です。','피곤한 기미가 있을 때는 일찍 자는 게 최고입니다.','grammar','g_n3_16',[],['g_n3_16'],['건강','조언'],true,[Y('疲れ気味','つかれぎみ'),Y('時','とき'),Y('早く','はやく'),Y('寝る','ねる'),Y('一番','いちばん')]);
  s3(35,'今日は休みのはずだったのに、出勤しました。','오늘은 쉬는 날이었는데 출근했습니다.','grammar','g_n3_17',['v_n4_504'],['g_n3_17'],['직장'],true,[Y('今日','きょう'),Y('休み','やすみ'),Y('出勤','しゅっきん')]);
  s3(36,'危なく転ぶところでした。','하마터면 넘어질 뻔했습니다.','grammar','g_n3_18',['v_n4_455'],['g_n3_18'],['일상'],true,[Y('危なく','あぶなく'),Y('転ぶ','ころぶ')]);
  s3(37,'心配することはありませんよ。','걱정할 필요 없어요.','grammar','g_n3_19',[],['g_n3_19'],['조언','소통'],true,[Y('心配','しんぱい')]);
  s3(38,'窓を開けたとたん、猫が入ってきました。','창문을 열자마자 고양이가 들어왔습니다.','grammar','g_n3_8',[],['g_n3_8'],['일상'],true,[Y('窓','まど'),Y('開けた','あけた'),Y('猫','ねこ'),Y('入って','はいって')]);
  s3(39,'アルバイトに応募したいのですが。','아르바이트에 응모하고 싶은데요.','vocab','v_n3_9',['v_n3_9'],['g_n4_37'],['직장','문의'],true,[Y('応募','おうぼ')]);
  s3(40,'面接の結果は来週知らせるそうです。','면접 결과는 다음 주에 알려 준다고 합니다.','vocab','v_n4_300',['v_n4_300'],['g_n4_8'],['직장'],true,[Y('面接','めんせつ'),Y('結果','けっか'),Y('来週','らいしゅう'),Y('知らせる','しらせる')]);
  s3(41,'情報を集めてから決めましょう。','정보를 모으고 나서 정합시다.','vocab','v_n3_42',['v_n3_42'],['g_n5_10'],['소통','조언'],true,[Y('情報','じょうほう'),Y('集めて','あつめて'),Y('決めましょう','きめましょう')]);
  s3(42,'彼は真剣な態度で話を聞いていました。','그는 진지한 태도로 이야기를 듣고 있었습니다.','vocab','v_n3_90',['v_n3_90','v_n3_57'],[],['소통'],true,[Y('彼','かれ'),Y('真剣','しんけん'),Y('態度','たいど'),Y('話','はなし'),Y('聞いて','きいて')]);
  s3(43,'毎月、少しずつ貯金しています。','매달 조금씩 저금하고 있습니다.','vocab','v_n3_112',['v_n3_112'],['g_n4_34'],['생활'],true,[Y('毎月','まいつき'),Y('少し','すこし'),Y('貯金','ちょきん')]);
  s3(44,'費用は全部でいくらかかりますか。','비용은 전부 얼마나 드나요?','vocab','v_n3_110',['v_n3_110'],[],['생활','문의'],true,[Y('費用','ひよう'),Y('全部','ぜんぶ')]);
  s3(45,'普段は電車で通勤しています。','평소에는 전철로 통근하고 있습니다.','vocab','v_n3_104',['v_n3_104','v_n4_505'],['g_n5_5'],['직장','일상'],true,[Y('普段','ふだん'),Y('電車','でんしゃ'),Y('通勤','つうきん')]);
  s3(46,'環境のためにゴミを減らしましょう。','환경을 위해 쓰레기를 줄입시다.','vocab','v_n3_33',['v_n3_33','v_n4_465'],['g_n4_16','g_n5_10'],['사회','조언'],true,[Y('環境','かんきょう'),Y('減らしましょう','へらしましょう')]);
  s3(47,'この地域は自然が豊かで、暮らしやすいです。','이 지역은 자연이 풍부해서 살기 좋습니다.','vocab','v_n3_36',['v_n3_36','v_n3_34','v_n3_96','v_n3_84'],['g_n4_13'],['생활','지역'],true,[Y('地域','ちいき'),Y('自然','しぜん'),Y('豊か','ゆたか'),Y('暮らしやすい','くらしやすい')]);
  s3(48,'ニュースによると、人口が減少しているそうです。','뉴스에 의하면 인구가 감소하고 있다고 합니다.','vocab','v_n3_27',['v_n3_27','v_n3_35'],['g_n4_69'],['뉴스','사회'],true,[Y('人口','じんこう'),Y('減少','げんしょう')]);
  s3(49,'買い物のついでに、薬局に寄ってきます。','장 보는 김에 약국에 들렀다 오겠습니다.','vocab','v_n3_99',['v_n3_99','v_n4_696'],[],['일상'],true,[Y('買い物','かいもの'),Y('薬局','やっきょく'),Y('寄って','よって')]);
  s3(50,'思わず笑ってしまいました。','엉겁결에 웃고 말았습니다.','vocab','v_n3_100',['v_n3_100'],['g_n4_1'],['감정','일상'],true,[Y('思わず','おもわず'),Y('笑って','わらって')]);
  // ── N3 1차 확장 (라운드 34) — sent_n3_051 ~ 120 ──
  // 회의·의견 (신규 토픽 conv_n3_meeting_opinion)
  s3(51,'会議で自分の意見をはっきり述べました。','회의에서 자신의 의견을 분명히 말했습니다.','vocab','v_n3_61',['v_n3_61'],[],['회의','의견'],true,[Y('会議','かいぎ'),Y('自分','じぶん'),Y('意見','いけん'),Y('述べました','のべました')]);
  s3(52,'私の主張は、資料のとおりに説明します。','제 주장은 자료대로 설명하겠습니다.','grammar','g_n3_21',['v_n3_195'],['g_n3_21'],['회의','의견'],true,[Y('私','わたし'),Y('主張','しゅちょう'),Y('資料','しりょう'),Y('説明','せつめい')]);
  s3(53,'その提案には反対の意見もあります。','그 제안에는 반대 의견도 있습니다.','vocab','v_n3_11',['v_n3_11'],[],['회의','의견'],true,[Y('提案','ていあん'),Y('反対','はんたい'),Y('意見','いけん')]);
  s3(54,'議論を進める前に、課題を整理しましょう。','논의를 진행하기 전에 과제를 정리합시다.','vocab','v_n3_197',['v_n3_197','v_n3_81','v_n3_157','v_n3_207'],[],['회의','의견'],true,[Y('議論','ぎろん'),Y('進める','すすめる'),Y('前','まえ'),Y('課題','かだい'),Y('整理','せいり')]);
  s3(55,'結論を急ぐことはないと思います。','결론을 서두를 필요는 없다고 생각합니다.','grammar','g_n3_19',['v_n3_196'],['g_n3_19'],['회의','의견'],true,[Y('結論','けつろん'),Y('急ぐ','いそぐ'),Y('思います','おもいます')]);
  s3(56,'全体の意見をまとめてから決めませんか。','전체 의견을 모은 후에 정하지 않을래요?','vocab','v_n3_193',['v_n3_193'],[],['회의','의견'],true,[Y('全体','ぜんたい'),Y('意見','いけん'),Y('決めませんか','きめませんか')]);
  s3(57,'効率を上げる方法について話し合いましょう。','효율을 올릴 방법에 대해 의논합시다.','grammar','g_n3_11',['v_n3_153','v_n3_105'],['g_n3_11'],['회의','직장'],true,[Y('効率','こうりつ'),Y('上げる','あげる'),Y('方法','ほうほう'),Y('話し合いましょう','はなしあいましょう')]);
  s3(58,'確かに費用の問題はありますが、効果も大きいです。','확실히 비용 문제는 있지만, 효과도 큽니다.','vocab','v_n3_191',['v_n3_191','v_n3_110','v_n3_30'],[],['회의','의견'],true,[Y('確かに','たしかに'),Y('費用','ひよう'),Y('問題','もんだい'),Y('効果','こうか'),Y('大きい','おおきい')]);
  s3(59,'この計画はもちろん、予算もまだ決まっていません。','이 계획은 물론이고 예산도 아직 정해지지 않았습니다.','grammar','g_n3_37',[],['g_n3_37'],['회의','직장'],true,[Y('計画','けいかく'),Y('予算','よさん'),Y('決まって','きまって')]);
  s3(60,'会議の最中にスマホを見るのはやめましょう。','회의 도중에 스마트폰을 보는 것은 그만둡시다.','grammar','g_n3_23',['v_n3_261'],['g_n3_23'],['회의','직장'],true,[Y('会議','かいぎ'),Y('最中','さいちゅう'),Y('見る','みる')]);
  s3(61,'反対するかわりに、別の案を出してください。','반대하는 대신에 다른 안을 내 주세요.','grammar','g_n3_22',[],['g_n3_22'],['회의','의견'],true,[Y('反対','はんたい'),Y('別','べつ'),Y('案','あん'),Y('出して','だして')]);
  s3(62,'部長の説明を聞いて、疑問が残りました。','부장님의 설명을 듣고 의문이 남았습니다.','vocab','v_n3_184',['v_n3_184'],[],['회의','의견'],true,[Y('部長','ぶちょう'),Y('説明','せつめい'),Y('聞いて','きいて'),Y('疑問','ぎもん'),Y('残りました','のこりました')]);
  // 학교·발표 (신규 토픽 conv_n3_school_presentation)
  s3(63,'来週、研究の結果を発表します。','다음 주에 연구 결과를 발표합니다.','vocab','v_n3_158',['v_n3_158'],[],['학교','발표'],true,[Y('来週','らいしゅう'),Y('研究','けんきゅう'),Y('結果','けっか'),Y('発表','はっぴょう')]);
  s3(64,'緊張して、声が出ないところでした。','긴장해서 목소리가 안 나올 뻔했습니다.','grammar','g_n3_18',[],['g_n3_18'],['학교','발표'],true,[Y('緊張','きんちょう'),Y('声','こえ'),Y('出ない','でない')]);
  s3(65,'練習すればするほど、上手になります。','연습하면 할수록 능숙해집니다.','grammar','g_n3_9',[],['g_n3_9'],['학교','발표'],true,[Y('練習','れんしゅう'),Y('上手','じょうず')]);
  s3(66,'発表の前に、先生に確かめてもらいました。','발표 전에 선생님께 확인을 받았습니다.','vocab','v_n3_63',['v_n3_63'],[],['학교','발표'],true,[Y('発表','はっぴょう'),Y('前','まえ'),Y('先生','せんせい'),Y('確かめて','たしかめて')]);
  s3(67,'資料は図やグラフを加えると分かりやすいです。','자료는 그림이나 그래프를 더하면 이해하기 쉽습니다.','vocab','v_n3_65',['v_n3_65'],[],['학교','발표'],true,[Y('資料','しりょう'),Y('図','ず'),Y('加える','くわえる'),Y('分かりやすい','わかりやすい')]);
  s3(68,'質問に冷静に対応できるように準備します。','질문에 침착하게 대응할 수 있도록 준비합니다.','vocab','v_n3_175',['v_n3_175','v_n3_150'],[],['학교','발표'],true,[Y('質問','しつもん'),Y('冷静','れいせい'),Y('対応','たいおう'),Y('準備','じゅんび')]);
  s3(69,'みんなの前で話すのは、思ったほど怖くなかったです。','모두 앞에서 말하는 것은 생각만큼 무섭지 않았습니다.','grammar','g_n3_26',[],['g_n3_26'],['학교','발표'],true,[Y('前','まえ'),Y('話す','はなす'),Y('思った','おもった'),Y('怖く','こわく')]);
  s3(70,'先輩の発表こそ、いいお手本です。','선배의 발표야말로 좋은 본보기입니다.','grammar','g_n3_35',[],['g_n3_35'],['학교','발표'],true,[Y('先輩','せんぱい'),Y('発表','はっぴょう'),Y('手本','てほん')]);
  s3(71,'テーマについて、もう一度調べ直します。','주제에 대해 한 번 더 다시 조사하겠습니다.','grammar','g_n3_11',[],['g_n3_11'],['학교','학습'],true,[Y('一度','いちど'),Y('調べ直します','しらべなおします')]);
  s3(72,'進路について先生と相談しました。','진로에 대해 선생님과 상담했습니다.','vocab','v_n3_163',['v_n3_163'],['g_n3_11'],['학교','상담'],true,[Y('進路','しんろ'),Y('先生','せんせい'),Y('相談','そうだん')]);
  // 예약·문제 (신규 토픽 conv_n3_reservation_problem)
  s3(73,'予約の時間に間に合いそうにありません。','예약 시간에 맞춰 가지 못할 것 같습니다.','conversation','conv_n3_reservation_problem',[],[],['예약','문제'],true,[Y('予約','よやく'),Y('時間','じかん'),Y('間に合い','まにあい')]);
  s3(74,'急に予定が変わって、予約を断るしかありませんでした。','갑자기 예정이 바뀌어 예약을 거절할 수밖에 없었습니다.','grammar','g_n3_36',['v_n3_74'],['g_n3_36'],['예약','문제'],true,[Y('急','きゅう'),Y('予定','よてい'),Y('変わって','かわって'),Y('予約','よやく'),Y('断る','ことわる')]);
  s3(75,'設備が壊れていたので、部屋を変えてもらいました。','설비가 고장 나 있어서 방을 바꿔 받았습니다.','vocab','v_n3_271',['v_n3_271'],[],['예약','문제'],true,[Y('設備','せつび'),Y('壊れて','こわれて'),Y('部屋','へや'),Y('変えて','かえて')]);
  s3(76,'日にちを変更する場合は、前日までに連絡してください。','날짜를 변경할 경우에는 전날까지 연락해 주세요.','conversation','conv_n3_reservation_problem',[],[],['예약','문제'],true,[Y('日にち','ひにち'),Y('変更','へんこう'),Y('場合','ばあい'),Y('前日','ぜんじつ'),Y('連絡','れんらく')]);
  s3(77,'人数が増えたことを伝えるのを忘れていました。','인원이 늘어난 것을 전하는 것을 잊고 있었습니다.','conversation','conv_n3_reservation_problem',[],[],['예약','문제'],true,[Y('人数','にんずう'),Y('増えた','ふえた'),Y('伝える','つたえる'),Y('忘れて','わすれて')]);
  s3(78,'キャンセル料がかかるということです。','취소 수수료가 든다고 합니다.','grammar','g_n3_28',[],['g_n3_28'],['예약','문제'],true,[Y('料','りょう')]);
  s3(79,'予約をやり直すために、もう一度電話しました。','예약을 다시 하기 위해 한 번 더 전화했습니다.','vocab','v_n3_223',['v_n3_223'],[],['예약','문제'],true,[Y('予約','よやく'),Y('やり直す','やりなおす'),Y('一度','いちど'),Y('電話','でんわ')]);
  s3(80,'満席だったので、翌日に変更してもらいました。','만석이었기 때문에 다음 날로 변경해 받았습니다.','vocab','v_n3_249',['v_n3_249'],[],['예약','문제'],true,[Y('満席','まんせき'),Y('翌日','よくじつ'),Y('変更','へんこう')]);
  s3(81,'間違いを防ぐため、メールでも確認します。','실수를 막기 위해 메일로도 확인합니다.','vocab','v_n3_67',['v_n3_67'],[],['예약','문제'],true,[Y('間違い','まちがい'),Y('防ぐ','ふせぐ'),Y('確認','かくにん')]);
  s3(82,'こちらのミスで、ご迷惑をおかけしました。','저희 실수로 폐를 끼쳤습니다.','conversation','conv_n3_reservation_problem',[],[],['예약','문제'],true,[Y('迷惑','めいわく')]);
  // 일상·생활·건강·사회 (신규 어휘/문법 활용)
  s3(83,'普段から栄養と睡眠に気をつけています。','평소부터 영양과 수면에 신경 쓰고 있습니다.','vocab','v_n3_104',['v_n3_104','v_n3_242','v_n3_243'],[],['건강','일상'],true,[Y('普段','ふだん'),Y('栄養','えいよう'),Y('睡眠','すいみん'),Y('気','き')]);
  s3(84,'食べかけのパンを机に置いたまま出かけました。','먹다 만 빵을 책상에 둔 채 나갔습니다.','grammar','g_n3_31',[],['g_n3_31'],['일상'],true,[Y('食べかけ','たべかけ'),Y('机','つくえ'),Y('置いた','おいた'),Y('出かけました','でかけました')]);
  s3(85,'この靴は歩きづらいので、買い替えたいです。','이 신발은 걷기 불편해서 새로 사고 싶습니다.','grammar','g_n3_32',[],['g_n3_32'],['쇼핑','일상'],true,[Y('靴','くつ'),Y('歩き','あるき'),Y('買い替えたい','かいかえたい')]);
  s3(86,'一か月おきに病院で検査を受けています。','한 달 걸러 병원에서 검사를 받고 있습니다.','grammar','g_n3_25',[],['g_n3_25'],['건강'],true,[Y('一か月','いっかげつ'),Y('病院','びょういん'),Y('検査','けんさ'),Y('受けて','うけて')]);
  s3(87,'走り出したとたんに、雨が降ってきました。','달리기 시작한 순간 비가 내리기 시작했습니다.','grammar','g_n3_8',[],['g_n3_8'],['일상','날씨'],true,[Y('走り出した','はしりだした'),Y('雨','あめ'),Y('降って','ふって')]);
  s3(88,'漢字をすべて覚えきるのは大変です。','한자를 전부 다 외우는 것은 힘듭니다.','grammar','g_n3_30',[],['g_n3_30'],['학습'],true,[Y('漢字','かんじ'),Y('覚え','おぼえ'),Y('大変','たいへん')]);
  s3(89,'お金さえあれば幸せだとは限りません。','돈만 있으면 행복하다고는 할 수 없습니다.','grammar','g_n3_34',[],['g_n3_34'],['의견','일상'],true,[Y('お金','おかね'),Y('幸せ','しあわせ'),Y('限りません','かぎりません')]);
  s3(90,'早く言えばよかったのにと後悔しました。','빨리 말했으면 좋았을 텐데 하고 후회했습니다.','grammar','g_n3_33',['v_n3_170'],['g_n3_33'],['감정'],true,[Y('早く','はやく'),Y('言えば','いえば'),Y('後悔','こうかい')]);
  s3(91,'兄は年齢にしては若く見えます。','형은 나이치고는 젊어 보입니다.','grammar','g_n3_40',['v_n3_285'],['g_n3_40'],['일상'],true,[Y('兄','あに'),Y('年齢','ねんれい'),Y('若く','わかく'),Y('見えます','みえます')]);
  s3(92,'ドアを開けようとしたら、鍵がかかっていました。','문을 열려고 했더니 잠겨 있었습니다.','grammar','g_n3_39',[],['g_n3_39'],['일상'],true,[Y('開けよう','あけよう'),Y('鍵','かぎ')]);
  s3(93,'弟が大学に合格したって聞きました。','남동생이 대학에 합격했다고 들었습니다.','grammar','g_n3_29',[],['g_n3_29'],['일상','소통'],true,[Y('弟','おとうと'),Y('大学','だいがく'),Y('合格','ごうかく'),Y('聞きました','ききました')]);
  s3(94,'健康ほど大切なものはありません。','건강만큼 소중한 것은 없습니다.','grammar','g_n3_27',[],['g_n3_27'],['건강','의견'],true,[Y('健康','けんこう'),Y('大切','たいせつ')]);
  s3(95,'もっと早く相談してほしかったです。','좀 더 빨리 상담해 주길 바랐습니다.','grammar','g_n3_38',[],['g_n3_38'],['소통','조언'],true,[Y('早く','はやく'),Y('相談','そうだん')]);
  s3(96,'無駄な買い物を減らして、貯金を増やします。','쓸데없는 쇼핑을 줄이고 저금을 늘립니다.','vocab','v_n3_294',['v_n3_294','v_n3_112'],[],['생활','일상'],true,[Y('無駄','むだ'),Y('買い物','かいもの'),Y('減らして','へらして'),Y('貯金','ちょきん'),Y('増やします','ふやします')]);
  s3(97,'引っ越してから、生活の習慣が変わりました。','이사하고 나서 생활 습관이 바뀌었습니다.','vocab','v_n3_239',['v_n3_239'],[],['생활'],true,[Y('引っ越して','ひっこして'),Y('生活','せいかつ'),Y('習慣','しゅうかん'),Y('変わりました','かわりました')]);
  s3(98,'外食が続くと、体の調子が悪くなりがちです。','외식이 계속되면 몸 상태가 나빠지기 쉽습니다.','grammar','g_n3_15',['v_n3_241','v_n3_20'],['g_n3_15'],['건강','일상'],true,[Y('外食','がいしょく'),Y('続く','つづく'),Y('体','からだ'),Y('調子','ちょうし'),Y('悪く','わるく')]);
  s3(99,'最近、少し疲れ気味です。','요즘 조금 피곤한 기색입니다.','grammar','g_n3_16',[],['g_n3_16'],['건강'],true,[Y('最近','さいきん'),Y('少し','すこし'),Y('疲れ気味','つかれぎみ')]);
  s3(100,'地域の行事に家族で参加しました。','지역 행사에 가족이 참가했습니다.','vocab','v_n3_139',['v_n3_36','v_n3_139'],[],['지역','일상'],true,[Y('地域','ちいき'),Y('行事','ぎょうじ'),Y('家族','かぞく'),Y('参加','さんか')]);
  s3(101,'ごみを減らす取り組みが盛んになっています。','쓰레기를 줄이는 노력이 활발해지고 있습니다.','vocab','v_n3_296',['v_n3_296','v_n3_198'],[],['사회','지역'],true,[Y('減らす','へらす'),Y('取り組み','とりくみ'),Y('盛ん','さかん')]);
  s3(102,'環境を守るために、資源を大切に使いましょう。','환경을 지키기 위해 자원을 소중히 씁시다.','vocab','v_n3_33',['v_n3_33','v_n3_135'],[],['사회'],true,[Y('環境','かんきょう'),Y('守る','まもる'),Y('資源','しげん'),Y('大切','たいせつ'),Y('使いましょう','つかいましょう')]);
  s3(103,'物価が上がって、生活が大変だという声が多いです。','물가가 올라 생활이 힘들다는 목소리가 많습니다.','vocab','v_n3_136',['v_n3_136'],[],['사회','뉴스'],true,[Y('物価','ぶっか'),Y('上がって','あがって'),Y('生活','せいかつ'),Y('大変','たいへん'),Y('声','こえ'),Y('多い','おおい')]);
  s3(104,'新しい制度については、議論が続いています。','새 제도에 대해서는 논의가 계속되고 있습니다.','vocab','v_n3_113',['v_n3_113','v_n3_197'],['g_n3_11'],['사회','뉴스'],true,[Y('新しい','あたらしい'),Y('制度','せいど'),Y('議論','ぎろん'),Y('続いて','つづいて')]);
  s3(105,'選挙は国民の大切な権利です。','선거는 국민의 소중한 권리입니다.','vocab','v_n3_114',['v_n3_114','v_n3_32','v_n3_130'],[],['사회'],true,[Y('選挙','せんきょ'),Y('国民','こくみん'),Y('大切','たいせつ'),Y('権利','けんり')]);
  s3(106,'この製品は品質がいいうえに、値段も安いです。','이 제품은 품질이 좋은 데다가 가격도 쌉니다.','grammar','g_n3_24',['v_n3_155','v_n3_156'],['g_n3_24'],['쇼핑','리뷰'],true,[Y('製品','せいひん'),Y('品質','ひんしつ'),Y('値段','ねだん'),Y('安い','やすい')]);
  s3(107,'説明書のとおりに組み立ててください。','설명서대로 조립해 주세요.','grammar','g_n3_21',[],['g_n3_21'],['생활'],true,[Y('説明書','せつめいしょ'),Y('組み立てて','くみたてて')]);
  s3(108,'一度引き受けた仕事は、最後までやりきります。','한번 맡은 일은 끝까지 해냅니다.','vocab','v_n3_199',['v_n3_199'],['g_n3_30'],['직장'],true,[Y('一度','いちど'),Y('引き受けた','ひきうけた'),Y('仕事','しごと'),Y('最後','さいご')]);
  s3(109,'効率よく作業を進める方法を考えています。','효율적으로 작업을 진행할 방법을 생각하고 있습니다.','vocab','v_n3_145',['v_n3_153','v_n3_145','v_n3_81','v_n3_105'],[],['직장'],true,[Y('効率','こうりつ'),Y('作業','さぎょう'),Y('進める','すすめる'),Y('方法','ほうほう'),Y('考えて','かんがえて')]);
  s3(110,'部下を信頼して、仕事を任せました。','부하를 신뢰해서 일을 맡겼습니다.','vocab','v_n3_183',['v_n3_183','v_n3_64'],[],['직장'],true,[Y('部下','ぶか'),Y('信頼','しんらい'),Y('仕事','しごと'),Y('任せました','まかせました')]);
  s3(111,'申請の手続きは、ホームページからできます。','신청 절차는 홈페이지에서 할 수 있습니다.','vocab','v_n3_148',['v_n3_148','v_n3_147'],[],['생활','문의'],true,[Y('申請','しんせい'),Y('手続き','てつづき')]);
  s3(112,'期限までに書類を提出するのを忘れないでください。','기한까지 서류를 제출하는 것을 잊지 마세요.','vocab','v_n3_140',['v_n3_140','v_n3_10'],[],['직장','생활'],true,[Y('期限','きげん'),Y('書類','しょるい'),Y('提出','ていしゅつ'),Y('忘れないで','わすれないで')]);
  s3(113,'困っている人を見ると、思わず声をかけてしまいます。','곤란해하는 사람을 보면 무심코 말을 걸게 됩니다.','vocab','v_n3_100',['v_n3_100'],[],['일상','감정'],true,[Y('困って','こまって'),Y('人','ひと'),Y('見る','みる'),Y('思わず','おもわず'),Y('声','こえ')]);
  s3(114,'失敗を恐れず、挑戦することが大切です。','실패를 두려워하지 말고 도전하는 것이 중요합니다.','vocab','v_n3_231',['v_n3_231'],[],['조언','의견'],true,[Y('失敗','しっぱい'),Y('恐れず','おそれず'),Y('挑戦','ちょうせん'),Y('大切','たいせつ')]);
  s3(115,'互いに協力すれば、早く終わります。','서로 협력하면 빨리 끝납니다.','vocab','v_n3_259',['v_n3_259','v_n3_126'],[],['직장','조언'],true,[Y('互いに','たがいに'),Y('協力','きょうりょく'),Y('早く','はやく'),Y('終わります','おわります')]);
  s3(116,'昔の写真を見て、学生時代を振り返りました。','옛날 사진을 보고 학창 시절을 돌아봤습니다.','vocab','v_n3_200',['v_n3_200','v_n3_246'],[],['일상','감정'],true,[Y('昔','むかし'),Y('写真','しゃしん'),Y('見て','みて'),Y('学生時代','がくせいじだい'),Y('振り返りました','ふりかえりました')]);
  s3(117,'運動を続けたおかげで、体力が回復しました。','운동을 계속한 덕분에 체력이 회복되었습니다.','grammar','g_n3_5',['v_n3_277','v_n3_276'],['g_n3_5'],['건강'],true,[Y('運動','うんどう'),Y('続けた','つづけた'),Y('体力','たいりょく'),Y('回復','かいふく')]);
  s3(118,'寝る前にスマホを見るのは、やめることにしました。','자기 전에 스마트폰을 보는 것은 그만두기로 했습니다.','grammar','g_n4_20',[],['g_n4_20'],['건강','일상'],true,[Y('寝る','ねる'),Y('前','まえ'),Y('見る','みる')]);
  s3(119,'来月から海外で勤務することになりました。','다음 달부터 해외에서 근무하게 되었습니다.','grammar','g_n4_21',['v_n3_142'],['g_n4_21'],['직장'],true,[Y('来月','らいげつ'),Y('海外','かいがい'),Y('勤務','きんむ')]);
  s3(120,'この経験は、将来きっと役立つはずです。','이 경험은 장래에 분명 도움이 될 것입니다.','vocab','v_n3_79',['v_n3_79'],[],['조언','의견'],true,[Y('経験','けいけん'),Y('将来','しょうらい'),Y('役立つ','やくだつ')]);
  // ── N3 2차 확장 (라운드 36) — sent_n3_121 ~ 170 ──
  // 직장 갈등 조정 (신규 토픽 conv_n3_work_conflict)
  s3(121,'仕事の分担について、話し合いませんか。','일 분담에 대해 이야기하지 않을래요?','vocab','v_n3_356',['v_n3_356'],['g_n3_11'],['직장','갈등'],true,[Y('仕事','しごと'),Y('分担','ぶんたん'),Y('話し合いませんか','はなしあいませんか')]);
  s3(122,'私だけ残業が多い気がします。','저만 야근이 많은 것 같습니다.','conversation','conv_n3_work_conflict',[],[],['직장','갈등'],true,[Y('私','わたし'),Y('残業','ざんぎょう'),Y('多い','おおい'),Y('気','き')]);
  s3(123,'お互いの立場を理解することが大切です。','서로의 입장을 이해하는 것이 중요합니다.','vocab','v_n3_388',['v_n3_388','v_n3_488'],[],['직장','갈등'],true,[Y('互い','たがい'),Y('立場','たちば'),Y('理解','りかい'),Y('大切','たいせつ')]);
  s3(124,'感情的にならないで、冷静に話しましょう。','감정적으로 되지 말고 침착하게 이야기합시다.','vocab','v_n3_175',['v_n3_55','v_n3_175'],[],['직장','갈등'],true,[Y('感情的','かんじょうてき'),Y('冷静','れいせい'),Y('話しましょう','はなしましょう')]);
  s3(125,'誤解があったなら、謝ります。','오해가 있었다면 사과하겠습니다.','vocab','v_n3_389',['v_n3_389'],[],['직장','갈등'],true,[Y('誤解','ごかい'),Y('謝ります','あやまります')]);
  s3(126,'命令ではなく、相談として聞いてください。','명령이 아니라 상담으로 들어 주세요.','vocab','v_n3_146',['v_n3_146'],[],['직장','갈등'],true,[Y('命令','めいれい'),Y('相談','そうだん'),Y('聞いて','きいて')]);
  s3(127,'役目の範囲をはっきり決めましょう。','맡은 일의 범위를 분명히 정합시다.','vocab','v_n3_480',['v_n3_355','v_n3_480'],[],['직장','갈등'],true,[Y('役目','やくめ'),Y('範囲','はんい'),Y('決めましょう','きめましょう')]);
  s3(128,'別の部署に意見を求めるのはどうですか。','다른 부서에 의견을 구하는 것은 어떻습니까?','vocab','v_n3_71',['v_n3_71'],[],['직장','갈등'],true,[Y('別','べつ'),Y('部署','ぶしょ'),Y('意見','いけん'),Y('求める','もとめる')]);
  s3(129,'怒鳴るのは、解決にはなりません。','호통치는 것은 해결이 되지 않습니다.','vocab','v_n3_597',['v_n3_597','v_n3_2'],[],['직장','갈등'],true,[Y('怒鳴る','どなる'),Y('解決','かいけつ')]);
  s3(130,'課長にかわって、私が謝りに行きます。','과장님을 대신해 제가 사과하러 가겠습니다.','grammar','g_n3_41',[],['g_n3_41'],['직장','갈등'],true,[Y('課長','かちょう'),Y('私','わたし'),Y('謝り','あやまり'),Y('行きます','いきます')]);
  s3(131,'納得できるまで、議論しましょう。','납득할 수 있을 때까지 논의합시다.','vocab','v_n3_390',['v_n3_390','v_n3_197'],[],['직장','갈등'],true,[Y('納得','なっとく'),Y('議論','ぎろん')]);
  s3(132,'一度決めたことを、すぐ変えるのはよくないです。','한번 정한 것을 바로 바꾸는 것은 좋지 않습니다.','conversation','conv_n3_work_conflict',[],[],['직장','갈등'],true,[Y('一度','いちど'),Y('決めた','きめた'),Y('変える','かえる')]);
  // 사회 문제에 의견 말하기 (신규 토픽 conv_n3_social_opinion)
  s3(133,'物価の上昇は、生活に大きな負担です。','물가 상승은 생활에 큰 부담입니다.','vocab','v_n3_375',['v_n3_136','v_n3_375'],[],['사회','의견'],true,[Y('物価','ぶっか'),Y('上昇','じょうしょう'),Y('生活','せいかつ'),Y('大きな','おおきな'),Y('負担','ふたん')]);
  s3(134,'環境問題は、一人一人の意識しだいだと思います。','환경 문제는 한 사람 한 사람의 의식에 달렸다고 생각합니다.','vocab','v_n3_426',['v_n3_33','v_n3_426'],[],['사회','의견'],true,[Y('環境問題','かんきょうもんだい'),Y('一人一人','ひとりひとり'),Y('意識','いしき'),Y('思います','おもいます')]);
  s3(135,'高齢の方への支援を増やすことに賛成です。','고령자 지원을 늘리는 것에 찬성합니다.','vocab','v_n3_464',['v_n3_464','v_n3_127'],[],['사회','의견'],true,[Y('高齢','こうれい'),Y('方','かた'),Y('支援','しえん'),Y('増やす','ふやす'),Y('賛成','さんせい')]);
  s3(136,'ニュースによって意見が異なるので、比較して読みます。','뉴스에 따라 의견이 다르므로 비교해서 읽습니다.','grammar','g_n3_43',['v_n3_571','v_n3_29'],['g_n3_43'],['사회','의견'],true,[Y('意見','いけん'),Y('異なる','ことなる'),Y('比較','ひかく'),Y('読みます','よみます')]);
  s3(137,'若者だけでなく、全ての世代に関係がある問題です。','젊은이뿐 아니라 모든 세대에 관계가 있는 문제입니다.','grammar','g_n3_67',['v_n3_465','v_n3_286'],['g_n3_67'],['사회','의견'],true,[Y('若者','わかもの'),Y('全て','すべて'),Y('世代','せだい'),Y('関係','かんけい'),Y('問題','もんだい')]);
  s3(138,'事実と意見を区切って話すことが大切です。','사실과 의견을 구분해서 말하는 것이 중요합니다.','vocab','v_n3_400',['v_n3_400','v_n3_563'],[],['사회','의견'],true,[Y('事実','じじつ'),Y('意見','いけん'),Y('区切って','くぎって'),Y('話す','はなす'),Y('大切','たいせつ')]);
  s3(139,'選挙の投票には必ず行くようにしています。','선거 투표에는 꼭 가도록 하고 있습니다.','vocab','v_n3_305',['v_n3_114','v_n3_305'],[],['사회','의견'],true,[Y('選挙','せんきょ'),Y('投票','とうひょう'),Y('必ず','かならず'),Y('行く','いく')]);
  s3(140,'騒音の問題は、住民の話し合いで解決したいです。','소음 문제는 주민의 대화로 해결하고 싶습니다.','vocab','v_n3_407',['v_n3_407','v_n3_322','v_n3_2'],[],['사회','의견'],true,[Y('騒音','そうおん'),Y('問題','もんだい'),Y('住民','じゅうみん'),Y('話し合い','はなしあい'),Y('解決','かいけつ')]);
  s3(141,'制度を変えるとすれば、時間がかかるでしょう。','제도를 바꾼다고 한다면 시간이 걸릴 것입니다.','grammar','g_n3_54',['v_n3_113'],['g_n3_54'],['사회','의견'],true,[Y('制度','せいど'),Y('変える','かえる'),Y('時間','じかん')]);
  s3(142,'便利さがいいこととは限りません。','편리함이 좋은 것이라고는 할 수 없습니다.','grammar','g_n3_70',[],['g_n3_70'],['사회','의견'],true,[Y('便利さ','べんりさ'),Y('限りません','かぎりません')]);
  // 서비스 불만/요청 (신규 토픽 conv_n3_service_complaint)
  s3(143,'注文した商品がまだ届いていません。','주문한 상품이 아직 도착하지 않았습니다.','conversation','conv_n3_service_complaint',[],[],['서비스','불만'],true,[Y('注文','ちゅうもん'),Y('商品','しょうひん'),Y('届いて','とどいて')]);
  s3(144,'説明と実際のサービスが違います。','설명과 실제 서비스가 다릅니다.','vocab','v_n3_102',['v_n3_102'],[],['서비스','불만'],true,[Y('説明','せつめい'),Y('実際','じっさい'),Y('違います','ちがいます')]);
  s3(145,'責任者の方とお話しできますか。','책임자분과 이야기할 수 있을까요?','conversation','conv_n3_service_complaint',[],[],['서비스','불만'],true,[Y('責任者','せきにんしゃ'),Y('方','かた'),Y('話し','はなし')]);
  s3(146,'対応が遅れた理由を教えてください。','대응이 늦어진 이유를 알려 주세요.','vocab','v_n3_150',['v_n3_150'],[],['서비스','불만'],true,[Y('対応','たいおう'),Y('遅れた','おくれた'),Y('理由','りゆう'),Y('教えて','おしえて')]);
  s3(147,'料金の請求に誤りがあるようです。','요금 청구에 잘못이 있는 것 같습니다.','vocab','v_n3_337',['v_n3_337'],[],['서비스','불만'],true,[Y('料金','りょうきん'),Y('請求','せいきゅう'),Y('誤り','あやまり')]);
  s3(148,'交換ではなく、返金を要求します。','교환이 아니라 환불을 요구합니다.','vocab','v_n3_491',['v_n3_491'],[],['서비스','불만'],true,[Y('交換','こうかん'),Y('返金','へんきん'),Y('要求','ようきゅう')]);
  s3(149,'今後の対策を聞かせてください。','앞으로의 대책을 들려주세요.','vocab','v_n3_315',['v_n3_248','v_n3_315'],[],['서비스','불만'],true,[Y('今後','こんご'),Y('対策','たいさく'),Y('聞かせて','きかせて')]);
  s3(150,'丁寧に対応していただいて、助かりました。','정중하게 대응해 주셔서 도움이 되었습니다.','vocab','v_n3_78',['v_n3_78','v_n3_150'],[],['서비스','감사'],true,[Y('丁寧','ていねい'),Y('対応','たいおう'),Y('助かりました','たすかりました')]);
  s3(151,'同じ問題が二度と起こらないようにお願いします。','같은 문제가 두 번 다시 일어나지 않도록 부탁합니다.','vocab','v_n3_228',['v_n3_228'],[],['서비스','불만'],true,[Y('同じ','おなじ'),Y('問題','もんだい'),Y('二度','にど'),Y('起こらない','おこらない'),Y('願い','ねがい')]);
  s3(152,'保証の期間内なら、無料で修理できますか。','보증 기간 내라면 무료로 수리할 수 있나요?','vocab','v_n3_318',['v_n3_318'],[],['서비스','문의'],true,[Y('保証','ほしょう'),Y('期間内','きかんない'),Y('無料','むりょう'),Y('修理','しゅうり')]);
  // 신규 문법 활용 (일상/직장)
  s3(153,'説明書にしたがって、操作してください。','설명서에 따라 조작해 주세요.','grammar','g_n3_44',[],['g_n3_44'],['생활','조언'],true,[Y('説明書','せつめいしょ'),Y('操作','そうさ')]);
  s3(154,'駅に近づくにつれて、人が増えてきました。','역에 가까워짐에 따라 사람이 늘어났습니다.','grammar','g_n3_45',[],['g_n3_45'],['일상'],true,[Y('駅','えき'),Y('近づく','ちかづく'),Y('人','ひと'),Y('増えて','ふえて')]);
  s3(155,'家族とともに、新しい年を迎えました。','가족과 함께 새해를 맞이했습니다.','grammar','g_n3_46',[],['g_n3_46'],['생활','가족'],true,[Y('家族','かぞく'),Y('新しい','あたらしい'),Y('年','とし'),Y('迎えました','むかえました')]);
  s3(156,'これは大人向けの講座ですが、高校生も参加できます。','이것은 성인 대상 강좌이지만 고등학생도 참가할 수 있습니다.','grammar','g_n3_47',['v_n3_380'],['g_n3_47'],['학습'],true,[Y('大人向け','おとなむけ'),Y('講座','こうざ'),Y('高校生','こうこうせい'),Y('参加','さんか')]);
  s3(157,'この公園は散歩向きの静かな道が多いです。','이 공원은 산책에 알맞은 조용한 길이 많습니다.','grammar','g_n3_48',[],['g_n3_48'],['생활'],true,[Y('公園','こうえん'),Y('散歩向き','さんぽむき'),Y('静か','しずか'),Y('道','みち'),Y('多い','おおい')]);
  s3(158,'水を出しっぱなしにしないでください。','물을 틀어 놓은 채로 두지 마세요.','grammar','g_n3_49',[],['g_n3_49'],['생활','조언'],true,[Y('水','みず'),Y('出し','だし')]);
  s3(159,'机の上が書類だらけで、作業できません。','책상 위가 서류투성이라 작업할 수 없습니다.','grammar','g_n3_50',['v_n3_145'],['g_n3_50'],['직장'],true,[Y('机','つくえ'),Y('上','うえ'),Y('書類','しょるい'),Y('作業','さぎょう')]);
  s3(160,'焼きたてのパンの香りが店に広がっています。','갓 구운 빵 냄새가 가게에 퍼지고 있습니다.','grammar','g_n3_51',['v_n3_584'],['g_n3_51'],['생활'],true,[Y('焼きたて','やきたて'),Y('香り','かおり'),Y('店','みせ'),Y('広がって','ひろがって')]);
  s3(161,'祖父には正月に会ったきりです。','할아버지와는 설날에 만난 것이 마지막입니다.','grammar','g_n3_52',[],['g_n3_52'],['가족'],true,[Y('祖父','そふ'),Y('正月','しょうがつ'),Y('会った','あった')]);
  s3(162,'代表として、会議で発言しました。','대표로서 회의에서 발언했습니다.','grammar','g_n3_53',['v_n3_478','v_n3_282'],['g_n3_53'],['직장','회의'],true,[Y('代表','だいひょう'),Y('会議','かいぎ'),Y('発言','はつげん')]);
  s3(163,'雪だとしても、電車は動くでしょう。','눈이 온다 해도 전철은 움직일 것입니다.','grammar','g_n3_55',[],['g_n3_55'],['교통'],true,[Y('雪','ゆき'),Y('電車','でんしゃ'),Y('動く','うごく')]);
  s3(164,'この弁当は値段のわりに、おかずが豊かです。','이 도시락은 가격에 비해 반찬이 풍성합니다.','grammar','g_n3_56',['v_n3_96'],['g_n3_56'],['생활'],true,[Y('弁当','べんとう'),Y('値段','ねだん'),Y('豊か','ゆたか')]);
  s3(165,'出かけるところに、宅配が届きました。','나가려던 참에 택배가 도착했습니다.','grammar','g_n3_57',[],['g_n3_57'],['생활'],true,[Y('出かける','でかける'),Y('宅配','たくはい'),Y('届きました','とどきました')]);
  s3(166,'この店は味ばかりでなく、雰囲気もいいです。','이 가게는 맛뿐만 아니라 분위기도 좋습니다.','grammar','g_n3_58',['v_n3_59'],['g_n3_58'],['생활','추천'],true,[Y('店','みせ'),Y('味','あじ'),Y('雰囲気','ふんいき')]);
  s3(167,'年のせいか、朝早く目が覚めます。','나이 탓인지 아침 일찍 잠이 깹니다.','grammar','g_n3_59',[],['g_n3_59'],['건강'],true,[Y('年','とし'),Y('朝早く','あさはやく'),Y('目','め'),Y('覚めます','さめます')]);
  s3(168,'連休は旅行するつもりだったのに、風邪をひきました。','연휴에 여행할 생각이었는데 감기에 걸렸습니다.','grammar','g_n3_60',['v_n3_357'],['g_n3_60'],['생활'],true,[Y('連休','れんきゅう'),Y('旅行','りょこう'),Y('風邪','かぜ')]);
  s3(169,'弟は犬を見ると、いつも怖がります。','남동생은 개를 보면 항상 무서워합니다.','grammar','g_n3_61',[],['g_n3_61'],['가족'],true,[Y('弟','おとうと'),Y('犬','いぬ'),Y('見る','みる'),Y('怖がります','こわがります')]);
  s3(170,'聞こえないふりをしないでください。','안 들리는 척하지 마세요.','grammar','g_n3_62',[],['g_n3_62'],['소통'],true,[Y('聞こえない','きこえない')]);
  // ── N3 2차 확장 (라운드 36) — sent_n3_171 ~ 220 ──
  s3(171,'迷ったら、基本に戻ることです。','망설여지면 기본으로 돌아가는 것이 좋습니다.','grammar','g_n3_63',['v_n3_312'],['g_n3_63'],['조언'],true,[Y('迷ったら','まよったら'),Y('基本','きほん'),Y('戻る','もどる')]);
  s3(172,'今からでも、間に合わないことはないです。','지금부터라도 못 맞출 것은 없습니다.','grammar','g_n3_64',[],['g_n3_64'],['조언'],true,[Y('今','いま'),Y('間に合わない','まにあわない')]);
  s3(173,'最近、運動の不足で体重が増える一方です。','요즘 운동 부족으로 체중이 늘기만 합니다.','grammar','g_n3_65',['v_n3_408'],['g_n3_65'],['건강'],true,[Y('最近','さいきん'),Y('運動','うんどう'),Y('不足','ふそく'),Y('体重','たいじゅう'),Y('増える','ふえる'),Y('一方','いっぽう')]);
  s3(174,'働く一方で、夜は学校に通っています。','일하는 한편 밤에는 학교에 다니고 있습니다.','grammar','g_n3_66',[],['g_n3_66'],['생활'],true,[Y('働く','はたらく'),Y('一方','いっぽう'),Y('夜','よる'),Y('学校','がっこう'),Y('通って','かよって')]);
  s3(175,'今日は秋らしい涼しい風が吹いています。','오늘은 가을다운 시원한 바람이 불고 있습니다.','grammar','g_n3_68',[],['g_n3_68'],['날씨'],true,[Y('今日','きょう'),Y('秋','あき'),Y('涼しい','すずしい'),Y('風','かぜ'),Y('吹いて','ふいて')]);
  s3(176,'よく考えたうえで、返事をします。','잘 생각한 후에 답을 하겠습니다.','grammar','g_n3_69',[],['g_n3_69'],['소통'],true,[Y('考えた','かんがえた'),Y('返事','へんじ')]);
  s3(177,'有名な店が美味しいとは限りません。','유명한 가게가 맛있다고는 할 수 없습니다.','grammar','g_n3_70',[],['g_n3_70'],['의견'],true,[Y('有名','ゆうめい'),Y('店','みせ'),Y('美味しい','おいしい'),Y('限りません','かぎりません')]);
  // 신규 어휘 활용 — 생활/직장/사회
  s3(178,'万一に備えて、水と食料を保管しています。','만일에 대비해 물과 식량을 보관하고 있습니다.','vocab','v_n3_565',['v_n3_533','v_n3_565'],[],['생활'],true,[Y('万一','まんいち'),Y('備えて','そなえて'),Y('水','みず'),Y('食料','しょくりょう'),Y('保管','ほかん')]);
  s3(179,'引っ越しの費用を節約したいです。','이사 비용을 절약하고 싶습니다.','vocab','v_n3_328',['v_n3_328','v_n3_110'],[],['생활'],true,[Y('引っ越し','ひっこし'),Y('費用','ひよう'),Y('節約','せつやく')]);
  s3(180,'毎月、給料の一部を貯金に振り込みます。','매달 월급의 일부를 저금으로 입금합니다.','vocab','v_n3_558',['v_n3_558','v_n3_112'],[],['생활'],true,[Y('毎月','まいつき'),Y('給料','きゅうりょう'),Y('一部','いちぶ'),Y('貯金','ちょきん'),Y('振り込みます','ふりこみます')]);
  s3(181,'集中したいときは、図書館を利用します。','집중하고 싶을 때는 도서관을 이용합니다.','vocab','v_n3_391',['v_n3_391','v_n3_335'],[],['학습'],true,[Y('集中','しゅうちゅう'),Y('図書館','としょかん'),Y('利用','りよう')]);
  s3(182,'試験の範囲が広くて、計画的な学習が必要です。','시험 범위가 넓어서 계획적인 학습이 필요합니다.','vocab','v_n3_379',['v_n3_480','v_n3_379'],[],['학습'],true,[Y('試験','しけん'),Y('範囲','はんい'),Y('広くて','ひろくて'),Y('計画的','けいかくてき'),Y('学習','がくしゅう'),Y('必要','ひつよう')]);
  s3(183,'発音は録音して聞き返すと上達します。','발음은 녹음해서 다시 들으면 향상됩니다.','vocab','v_n3_352',['v_n3_507','v_n3_545','v_n3_352'],[],['학습'],true,[Y('発音','はつおん'),Y('録音','ろくおん'),Y('聞き返す','ききかえす'),Y('上達','じょうたつ')]);
  s3(184,'分からない言葉は、簡単に言い換えてください。','모르는 말은 쉽게 바꿔 말해 주세요.','vocab','v_n3_547',['v_n3_547'],[],['소통'],true,[Y('分からない','わからない'),Y('言葉','ことば'),Y('簡単','かんたん'),Y('言い換えて','いいかえて')]);
  s3(185,'彼の話に、みんなが頷きました。','그의 말에 모두가 고개를 끄덕였습니다.','vocab','v_n3_599',['v_n3_599'],[],['소통'],true,[Y('彼','かれ'),Y('話','はなし'),Y('頷きました','うなずきました')]);
  s3(186,'要点に印をつけながら読みます。','요점에 표시를 하면서 읽습니다.','vocab','v_n3_428',['v_n3_428'],[],['학습'],true,[Y('要点','ようてん'),Y('印','しるし'),Y('読みます','よみます')]);
  s3(187,'この資格は就職にも役立ちます。','이 자격은 취직에도 도움이 됩니다.','vocab','v_n3_413',['v_n3_413','v_n3_79'],[],['직장'],true,[Y('資格','しかく'),Y('就職','しゅうしょく'),Y('役立ちます','やくだちます')]);
  s3(188,'新しい技術を取り入れて、能率を高めました。','새 기술을 도입해 능률을 높였습니다.','vocab','v_n3_550',['v_n3_550','v_n3_374','v_n3_586'],[],['직장'],true,[Y('新しい','あたらしい'),Y('技術','ぎじゅつ'),Y('取り入れて','とりいれて'),Y('能率','のうりつ'),Y('高めました','たかめました')]);
  s3(189,'仕事を頼むときは、期限も伝えましょう。','일을 부탁할 때는 기한도 전합시다.','vocab','v_n3_594',['v_n3_594','v_n3_140'],[],['직장'],true,[Y('仕事','しごと'),Y('頼む','たのむ'),Y('期限','きげん'),Y('伝えましょう','つたえましょう')]);
  s3(190,'今日の会議の進行は私が担当します。','오늘 회의 진행은 제가 담당합니다.','vocab','v_n3_364',['v_n3_364'],[],['직장','회의'],true,[Y('今日','きょう'),Y('会議','かいぎ'),Y('進行','しんこう'),Y('私','わたし'),Y('担当','たんとう')]);
  s3(191,'締め切りの延長をお願いできますか。','마감 연장을 부탁할 수 있을까요?','vocab','v_n3_365',['v_n3_365'],[],['직장'],true,[Y('締め切り','しめきり'),Y('延長','えんちょう'),Y('願い','ねがい')]);
  s3(192,'作業は予定より早く完了しました。','작업은 예정보다 빨리 완료되었습니다.','vocab','v_n3_371',['v_n3_145','v_n3_371'],[],['직장'],true,[Y('作業','さぎょう'),Y('予定','よてい'),Y('早く','はやく'),Y('完了','かんりょう')]);
  s3(193,'今年の目標を達成できて、嬉しいです。','올해 목표를 달성할 수 있어서 기쁩니다.','vocab','v_n3_372',['v_n3_372'],[],['직장','감정'],true,[Y('今年','ことし'),Y('目標','もくひょう'),Y('達成','たっせい'),Y('嬉しい','うれしい')]);
  s3(194,'報告書を今日中に仕上げます。','보고서를 오늘 안에 마무리하겠습니다.','vocab','v_n3_555',['v_n3_555'],[],['직장'],true,[Y('報告書','ほうこくしょ'),Y('今日中','きょうじゅう'),Y('仕上げます','しあげます')]);
  s3(195,'困難を乗り越えて、チームが強くなりました。','어려움을 극복하고 팀이 강해졌습니다.','vocab','v_n3_561',['v_n3_561'],[],['직장','감정'],true,[Y('困難','こんなん'),Y('乗り越えて','のりこえて'),Y('強く','つよく')]);
  s3(196,'採用の候補として、三人が残りました。','채용 후보로 세 명이 남았습니다.','vocab','v_n3_306',['v_n3_306'],[],['직장'],true,[Y('採用','さいよう'),Y('候補','こうほ'),Y('三人','さんにん'),Y('残りました','のこりました')]);
  s3(197,'評価の基準を先に説明します。','평가 기준을 먼저 설명하겠습니다.','vocab','v_n3_346',['v_n3_346','v_n3_311'],[],['직장'],true,[Y('評価','ひょうか'),Y('基準','きじゅん'),Y('先','さき'),Y('説明','せつめい')]);
  s3(198,'この店は配送が速いと評判です。','이 가게는 배송이 빠르다고 평판이 좋습니다.','vocab','v_n3_347',['v_n3_344','v_n3_347'],[],['쇼핑'],true,[Y('店','みせ'),Y('配送','はいそう'),Y('速い','はやい'),Y('評判','ひょうばん')]);
  s3(199,'支払いの方法を選択してください。','지불 방법을 선택해 주세요.','vocab','v_n3_304',['v_n3_338','v_n3_304'],[],['쇼핑'],true,[Y('支払い','しはらい'),Y('方法','ほうほう'),Y('選択','せんたく')]);
  s3(200,'送料を含めた合計を確認しました。','배송료를 포함한 합계를 확인했습니다.','vocab','v_n3_392',['v_n3_569','v_n3_392'],[],['쇼핑'],true,[Y('送料','そうりょう'),Y('含めた','ふくめた'),Y('合計','ごうけい'),Y('確認','かくにん')]);
  s3(201,'発売の直後で、店は混んでいました。','발매 직후라 가게는 붐볐습니다.','vocab','v_n3_342',['v_n3_342','v_n3_518'],[],['쇼핑'],true,[Y('発売','はつばい'),Y('直後','ちょくご'),Y('店','みせ'),Y('混んで','こんで')]);
  s3(202,'臨時のバスが駅前から出ています。','임시 버스가 역 앞에서 출발하고 있습니다.','vocab','v_n3_517',['v_n3_517'],[],['교통'],true,[Y('臨時','りんじ'),Y('駅前','えきまえ'),Y('出て','でて')]);
  s3(203,'雨の日は、いつもより速度を落とします。','비 오는 날은 평소보다 속도를 줄입니다.','vocab','v_n3_263',['v_n3_263'],[],['교통'],true,[Y('雨','あめ'),Y('日','ひ'),Y('速度','そくど'),Y('落とします','おとします')]);
  s3(204,'夕食の後は、のんびり音楽を聞きます。','저녁 식사 후에는 느긋하게 음악을 듣습니다.','vocab','v_n3_440',['v_n3_359','v_n3_440'],[],['생활'],true,[Y('夕食','ゆうしょく'),Y('後','あと'),Y('音楽','おんがく'),Y('聞きます','ききます')]);
  s3(205,'徹夜はやめて、ぐっすり寝ましょう。','밤샘은 그만두고 푹 잡시다.','vocab','v_n3_458',['v_n3_458','v_n3_444'],[],['건강','조언'],true,[Y('徹夜','てつや'),Y('寝ましょう','ねましょう')]);
  s3(206,'正しい姿勢を保つと、疲れにくいです。','바른 자세를 유지하면 덜 피곤합니다.','vocab','v_n3_459',['v_n3_459','v_n3_566'],[],['건강'],true,[Y('正しい','ただしい'),Y('姿勢','しせい'),Y('保つ','たもつ'),Y('疲れにくい','つかれにくい')]);
  s3(207,'深い呼吸をして、緊張を抑えました。','깊은 호흡을 해서 긴장을 가라앉혔습니다.','vocab','v_n3_460',['v_n3_460'],[],['건강'],true,[Y('深い','ふかい'),Y('呼吸','こきゅう'),Y('緊張','きんちょう'),Y('抑えました','おさえました')]);
  s3(208,'定期的な検査で、病気を予防しましょう。','정기적인 검사로 병을 예방합시다.','vocab','v_n3_275',['v_n3_516','v_n3_275'],[],['건강'],true,[Y('定期的','ていきてき'),Y('検査','けんさ'),Y('病気','びょうき'),Y('予防','よぼう')]);
  s3(209,'祖母の看病で、家族が協力しています。','할머니 간병으로 가족이 협력하고 있습니다.','vocab','v_n3_462',['v_n3_462','v_n3_126'],[],['가족','건강'],true,[Y('祖母','そぼ'),Y('看病','かんびょう'),Y('家族','かぞく'),Y('協力','きょうりょく')]);
  s3(210,'兄に赤ちゃんが生まれて、家族の誕生を祝いました。','형에게 아기가 태어나 가족의 탄생을 축하했습니다.','vocab','v_n3_468',['v_n3_468','v_n3_470'],[],['가족','행사'],true,[Y('兄','あに'),Y('赤ちゃん','あかちゃん'),Y('生まれて','うまれて'),Y('家族','かぞく'),Y('誕生','たんじょう'),Y('祝いました','いわいました')]);
  s3(211,'お世話になった方に、贈り物を選んでいます。','신세 진 분께 드릴 선물을 고르고 있습니다.','vocab','v_n3_472',['v_n3_472'],[],['행사'],true,[Y('世話','せわ'),Y('方','かた'),Y('贈り物','おくりもの'),Y('選んで','えらんで')]);
  s3(212,'まるで夏のような暑さですね。','마치 여름 같은 더위네요.','vocab','v_n3_529',['v_n3_529'],[],['날씨'],true,[Y('夏','なつ'),Y('暑さ','あつさ')]);
  s3(213,'今日は蒸し暑いので、水分を取ってください。','오늘은 무더우니 수분을 섭취하세요.','vocab','v_n3_593',['v_n3_593'],[],['날씨','조언'],true,[Y('今日','きょう'),Y('蒸し暑い','むしあつい'),Y('水分','すいぶん'),Y('取って','とって')]);
  s3(214,'空気が乾燥しているので、火に注意しましょう。','공기가 건조하니 불조심합시다.','vocab','v_n3_591',['v_n3_591'],[],['날씨','조언'],true,[Y('空気','くうき'),Y('乾燥','かんそう'),Y('火','ひ'),Y('注意','ちゅうい')]);
  s3(215,'運転の前に、天気の最新の情報を確認します。','운전 전에 최신 날씨 정보를 확인합니다.','vocab','v_n3_510',['v_n3_510','v_n3_42'],[],['생활'],true,[Y('運転','うんてん'),Y('前','まえ'),Y('天気','てんき'),Y('最新','さいしん'),Y('情報','じょうほう'),Y('確認','かくにん')]);
  s3(216,'いよいよ明日、結果が発表されます。','드디어 내일 결과가 발표됩니다.','vocab','v_n3_447',['v_n3_447'],[],['감정'],true,[Y('明日','あした'),Y('結果','けっか'),Y('発表','はっぴょう')]);
  s3(217,'ますます日本語が好きになりました。','점점 더 일본어가 좋아졌습니다.','vocab','v_n3_446',['v_n3_446'],[],['감정','학습'],true,[Y('日本語','にほんご'),Y('好き','すき')]);
  s3(218,'駅でばったり昔の先生に会いました。','역에서 옛 선생님을 딱 마주쳤습니다.','vocab','v_n3_443',['v_n3_443'],[],['일상'],true,[Y('駅','えき'),Y('昔','むかし'),Y('先生','せんせい'),Y('会いました','あいました')]);
  s3(219,'夜空を見上げて、深呼吸しました。','밤하늘을 올려다보고 심호흡했습니다.','vocab','v_n3_543',['v_n3_543'],[],['일상'],true,[Y('夜空','よぞら'),Y('見上げて','みあげて'),Y('深呼吸','しんこきゅう')]);
  s3(220,'たとえ失敗しても、挑戦する価値があります。','설령 실패해도 도전할 가치가 있습니다.','vocab','v_n3_528',['v_n3_528','v_n3_231','v_n3_269'],[],['조언','의견'],true,[Y('失敗','しっぱい'),Y('挑戦','ちょうせん'),Y('価値','かち')]);
  // ── N3 3차 확장 (라운드 38) — sent_n3_221 ~ 290 ──
  // 사회 이슈 토론 (신규 토픽 conv_n3_social_debate)
  s3(221,'高齢化について、どう考えますか。','고령화에 대해 어떻게 생각하세요?','vocab','v_n3_1104',['v_n3_1104'],['g_n3_11'],['사회','토론'],true,[Y('高齢化','こうれいか'),Y('考えますか','かんがえますか')]);
  s3(222,'少子化は社会全体の問題だと思います。','저출산은 사회 전체의 문제라고 생각합니다.','vocab','v_n3_1105',['v_n3_1105'],[],['사회','토론'],true,[Y('少子化','しょうしか'),Y('社会','しゃかい'),Y('全体','ぜんたい'),Y('問題','もんだい'),Y('思います','おもいます')]);
  s3(223,'温暖化の影響は、年々大きくなっています。','온난화의 영향은 해마다 커지고 있습니다.','vocab','v_n3_1108',['v_n3_1108','v_n3_6'],[],['사회','토론'],true,[Y('温暖化','おんだんか'),Y('影響','えいきょう'),Y('年々','ねんねん'),Y('大きく','おおきく')]);
  s3(224,'証拠をもとに、意見を述べるべきです。','증거를 바탕으로 의견을 말해야 합니다.','grammar','g_n3_104',['v_n3_1007','v_n3_61'],['g_n3_104'],['사회','토론'],true,[Y('証拠','しょうこ'),Y('意見','いけん'),Y('述べる','のべる')]);
  s3(225,'環境を守るには、一人一人の意識が大切です。','환경을 지키려면 한 사람 한 사람의 의식이 중요합니다.','vocab','v_n3_1089',['v_n3_33','v_n3_426'],[],['사회','토론'],true,[Y('環境','かんきょう'),Y('守る','まもる'),Y('一人一人','ひとりひとり'),Y('意識','いしき'),Y('大切','たいせつ')]);
  s3(226,'主観ではなく、客観の事実を見ましょう。','주관이 아니라 객관적 사실을 봅시다.','vocab','v_n3_1009',['v_n3_1008','v_n3_1009','v_n3_400'],[],['사회','토론'],true,[Y('主観','しゅかん'),Y('客観','きゃっかん'),Y('事実','じじつ'),Y('見ましょう','みましょう')]);
  s3(227,'差別のない社会を目指したいと考えます。','차별 없는 사회를 지향해야 한다고 생각합니다.','vocab','v_n3_716',['v_n3_716'],[],['사회','토론'],true,[Y('差別','さべつ'),Y('社会','しゃかい'),Y('目指したい','めざしたい'),Y('考えます','かんがえます')]);
  s3(228,'観点を変えれば、別の答えが見えてきます。','관점을 바꾸면 다른 답이 보입니다.','vocab','v_n3_1003',['v_n3_1003'],[],['사회','토론'],true,[Y('観点','かんてん'),Y('変えれば','かえれば'),Y('別','べつ'),Y('答え','こたえ'),Y('見えて','みえて')]);
  s3(229,'物価の上昇は、生活に直接、影響します。','물가 상승은 생활에 직접 영향을 줍니다.','vocab','v_n3_1090',['v_n3_136','v_n3_6'],['g_n3_43'],['사회','토론'],true,[Y('物価','ぶっか'),Y('上昇','じょうしょう'),Y('生活','せいかつ'),Y('直接','ちょくせつ'),Y('影響','えいきょう')]);
  s3(230,'問題点を整理してから、議論を始めましょう。','문제점을 정리하고 나서 논의를 시작합시다.','vocab','v_n3_1043',['v_n3_1043','v_n3_197'],[],['사회','토론'],true,[Y('問題点','もんだいてん'),Y('整理','せいり'),Y('議論','ぎろん'),Y('始めましょう','はじめましょう')]);
  s3(231,'肯定する人もいれば、否定する人もいます。','긍정하는 사람도 있고 부정하는 사람도 있습니다.','vocab','v_n3_1042',['v_n3_1042','v_n3_1041'],[],['사회','토론'],true,[Y('肯定','こうてい'),Y('人','ひと'),Y('否定','ひてい')]);
  s3(232,'この案には賛同しかねます。','이 안에는 찬동하기 어렵습니다.','grammar','g_n3_91',['v_n3_1040','v_n3_894'],['g_n3_91'],['사회','토론'],true,[Y('案','あん'),Y('賛同','さんどう')]);
  // 직장 문제 해결 (신규 토픽 conv_n3_workplace_solution)
  s3(233,'業務の手順を見直す必要があります。','업무 절차를 재검토할 필요가 있습니다.','vocab','v_n3_826',['v_n3_831','v_n3_826'],[],['직장','해결'],true,[Y('業務','ぎょうむ'),Y('手順','てじゅん'),Y('見直す','みなおす'),Y('必要','ひつよう')]);
  s3(234,'残業を減らす対応策を考えましょう。','야근을 줄이는 대응책을 생각합시다.','vocab','v_n3_1046',['v_n3_1046'],[],['직장','해결'],true,[Y('残業','ざんぎょう'),Y('減らす','へらす'),Y('対応策','たいおうさく'),Y('考えましょう','かんがえましょう')]);
  s3(235,'効率を重視して、無駄な作業を省きます。','효율을 중시해 쓸데없는 작업을 줄입니다.','vocab','v_n3_1051',['v_n3_1051'],[],['직장','해결'],true,[Y('効率','こうりつ'),Y('重視','じゅうし'),Y('無駄','むだ'),Y('作業','さぎょう'),Y('省きます','はぶきます')]);
  s3(236,'担当を明確に分けると、混乱が減ります。','담당을 명확히 나누면 혼란이 줄어듭니다.','vocab','v_n3_1228',['v_n3_726','v_n3_356'],[],['직장','해결'],true,[Y('担当','たんとう'),Y('明確','めいかく'),Y('分ける','わける'),Y('混乱','こんらん'),Y('減ります','へります')]);
  s3(237,'人間関係の悩みは、一人で抱えないことです。','인간관계 고민은 혼자 떠안지 않는 것입니다.','vocab','v_n3_672',['v_n3_672','v_n3_691'],['g_n3_71'],['직장','해결'],true,[Y('人間関係','にんげんかんけい'),Y('悩み','なやみ'),Y('一人','ひとり'),Y('抱えない','かかえない')]);
  s3(238,'要点をまとめて、上司に報告します。','요점을 정리해 상사에게 보고합니다.','vocab','v_n3_847',['v_n3_847'],[],['직장','해결'],true,[Y('要点','ようてん'),Y('上司','じょうし'),Y('報告','ほうこく')]);
  s3(239,'問題が生じたら、すぐ相談してください。','문제가 생기면 바로 상담해 주세요.','vocab','v_n3_1097',['v_n3_1097'],[],['직장','해결'],true,[Y('問題','もんだい'),Y('生じたら','しょうじたら'),Y('相談','そうだん')]);
  s3(240,'交渉の結果、家賃を下げてもらえました。','교섭 결과 집세를 내려 받았습니다.','vocab','v_n3_899',['v_n3_899'],[],['직장','해결'],true,[Y('交渉','こうしょう'),Y('結果','けっか'),Y('家賃','やちん'),Y('下げて','さげて')]);
  s3(241,'みんなで合意できる方策を探します。','다 함께 합의할 수 있는 방책을 찾습니다.','vocab','v_n3_897',['v_n3_897','v_n3_1047'],[],['직장','해결'],true,[Y('合意','ごうい'),Y('方策','ほうさく'),Y('探します','さがします')]);
  s3(242,'責任を果たすために、最後まで努力します。','책임을 다하기 위해 끝까지 노력합니다.','vocab','v_n3_1274',['v_n3_1274'],[],['직장','해결'],true,[Y('責任','せきにん'),Y('果たす','はたす'),Y('最後','さいご'),Y('努力','どりょく')]);
  s3(243,'焦らず、段取りを立てて進めましょう。','초조해하지 말고 절차를 세워 진행합시다.','vocab','v_n3_1166',['v_n3_1059','v_n3_1166'],[],['직장','해결'],true,[Y('焦らず','あせらず'),Y('段取り','だんどり'),Y('立てて','たてて'),Y('進めましょう','すすめましょう')]);
  // 지역 행사 제안 (신규 토픽 conv_n3_local_event)
  s3(244,'地域社会のつながりを深める行事を提案します。','지역 사회의 연결을 깊게 하는 행사를 제안합니다.','vocab','v_n3_1103',['v_n3_1103','v_n3_11'],[],['지역','제안'],true,[Y('地域社会','ちいきしゃかい'),Y('深める','ふかめる'),Y('行事','ぎょうじ'),Y('提案','ていあん')]);
  s3(245,'夏祭りをきっかけに、交流を促進したいです。','여름 축제를 계기로 교류를 촉진하고 싶습니다.','grammar','g_n3_111',['v_n3_1129','v_n3_138'],['g_n3_111'],['지역','제안'],true,[Y('夏祭り','なつまつり'),Y('交流','こうりゅう'),Y('促進','そくしん')]);
  s3(246,'ボランティアを募集して、町を清掃します。','자원봉사를 모집해 마을을 청소합니다.','vocab','v_n3_719',['v_n3_719','v_n3_8'],[],['지역','제안'],true,[Y('募集','ぼしゅう'),Y('町','まち'),Y('清掃','せいそう')]);
  s3(247,'子供から高齢者まで、誰もが参加できます。','아이부터 고령자까지 누구나 참가할 수 있습니다.','vocab','v_n3_464',['v_n3_464'],[],['지역','제안'],true,[Y('子供','こども'),Y('高齢者','こうれいしゃ'),Y('誰','だれ'),Y('参加','さんか')]);
  s3(248,'住民の要望をもとに、計画を立てます。','주민의 요망을 바탕으로 계획을 세웁니다.','grammar','g_n3_104',['v_n3_805','v_n3_322'],['g_n3_104'],['지역','제안'],true,[Y('住民','じゅうみん'),Y('要望','ようぼう'),Y('計画','けいかく'),Y('立てます','たてます')]);
  s3(249,'広場を中心に、屋台を並べてはどうでしょう。','광장을 중심으로 노점을 늘어놓는 건 어떨까요.','grammar','g_n3_105',[],['g_n3_105'],['지역','제안'],true,[Y('広場','ひろば'),Y('中心','ちゅうしん'),Y('屋台','やたい'),Y('並べて','ならべて')]);
  s3(250,'予算次第で、規模を変えられます。','예산에 따라 규모를 바꿀 수 있습니다.','grammar','g_n3_85',['v_n3_329','v_n3_310'],['g_n3_85'],['지역','제안'],true,[Y('予算','よさん'),Y('規模','きぼ'),Y('変えられます','かえられます')]);
  s3(251,'参加者が増えるにつれて、準備も大変になります。','참가자가 늘어남에 따라 준비도 힘들어집니다.','grammar','g_n3_45',['v_n3_744'],['g_n3_45'],['지역','제안'],true,[Y('参加者','さんかしゃ'),Y('増える','ふえる'),Y('準備','じゅんび'),Y('大変','たいへん')]);
  s3(252,'集会で出た意見を、計画に反映します。','집회에서 나온 의견을 계획에 반영합니다.','vocab','v_n3_1090',['v_n3_774','v_n3_1090'],[],['지역','제안'],true,[Y('集会','しゅうかい'),Y('出た','でた'),Y('意見','いけん'),Y('計画','けいかく'),Y('反映','はんえい')]);
  s3(253,'今年こそ、過去最高の祭りにしたいです。','올해야말로 역대 최고의 축제로 만들고 싶습니다.','grammar','g_n3_35',['v_n3_483'],['g_n3_35'],['지역','제안'],true,[Y('今年','ことし'),Y('過去','かこ'),Y('最高','さいこう'),Y('祭り','まつり')]);
  s3(254,'地元の名物を生かした催しを開きます。','지역 명물을 살린 행사를 엽니다.','vocab','v_n3_945',['v_n3_709','v_n3_945','v_n3_937'],[],['지역','제안'],true,[Y('地元','じもと'),Y('名物','めいぶつ'),Y('生かした','いかした'),Y('催し','もよおし'),Y('開きます','ひらきます')]);
  // 생활 습관 조언 (기존 토픽 + 신규 어휘 보강)
  s3(255,'規則正しい生活を心がけることだ。','규칙적인 생활을 유의하는 것이 좋다.','grammar','g_n3_63',[],['g_n3_63'],['건강','조언'],true,[Y('規則正しい','きそくただしい'),Y('生活','せいかつ'),Y('心がける','こころがける')]);
  s3(256,'早寝早起きを続けると、体調が良くなります。','일찍 자고 일찍 일어나기를 계속하면 컨디션이 좋아집니다.','vocab','v_n4_326',['v_n4_326'],[],['건강','조언'],true,[Y('早寝早起き','はやねはやおき'),Y('続ける','つづける'),Y('体調','たいちょう'),Y('良く','よく')]);
  s3(257,'食事の栄養が偏らないようにしましょう。','식사 영양이 치우치지 않도록 합시다.','grammar','g_n3_99',['v_n3_1099'],[],['건강','조언'],true,[Y('食事','しょくじ'),Y('栄養','えいよう'),Y('偏らない','かたよらない')]);
  s3(258,'適度な運動は、心にも体にもいいです。','적당한 운동은 마음에도 몸에도 좋습니다.','vocab','v_n3_1061',['v_n3_1061'],[],['건강','조언'],true,[Y('適度','てきど'),Y('運動','うんどう'),Y('心','こころ'),Y('体','からだ')]);
  s3(259,'寝不足が続くと、集中できなくなります。','수면 부족이 계속되면 집중할 수 없게 됩니다.','vocab','v_n3_391',['v_n3_391'],[],['건강','조언'],true,[Y('寝不足','ねぶそく'),Y('続く','つづく'),Y('集中','しゅうちゅう')]);
  s3(260,'疲労がたまったら、無理せず休むことだ。','피로가 쌓이면 무리하지 말고 쉬는 것이 좋다.','grammar','g_n3_63',[],['g_n3_63'],['건강','조언'],true,[Y('疲労','ひろう'),Y('無理','むり'),Y('休む','やすむ')]);
  s3(261,'部屋を換気して、清潔に保ちましょう。','방을 환기해서 청결하게 유지합시다.','vocab','v_n3_566',['v_n3_566'],[],['건강','조언'],true,[Y('部屋','へや'),Y('換気','かんき'),Y('清潔','せいけつ'),Y('保ちましょう','たもちましょう')]);
  s3(262,'手洗いは、衛生の基本です。','손 씻기는 위생의 기본입니다.','vocab','v_n3_312',['v_n3_312'],[],['건강','조언'],true,[Y('手洗い','てあらい'),Y('衛生','えいせい'),Y('基本','きほん')]);
  s3(263,'徹夜はやめて、ぐっすり眠ったほうがいいです。','밤샘은 그만두고 푹 자는 게 좋습니다.','vocab','v_n3_458',['v_n3_458'],['g_n4_59'],['건강','조언'],true,[Y('徹夜','てつや'),Y('眠った','ねむった')]);
  s3(264,'姿勢を正すだけで、疲れにくくなります。','자세를 바로잡는 것만으로 덜 피곤해집니다.','vocab','v_n3_459',['v_n3_459'],[],['건강','조언'],true,[Y('姿勢','しせい'),Y('正す','ただす'),Y('疲れ','つかれ')]);
  // 신규 문법 활용 — 일상/추상
  s3(265,'考えれば考えるほど、迷ってしまいます。','생각하면 할수록 망설여집니다.','grammar','g_n3_9',[],['g_n3_9'],['일상'],true,[Y('考えれば','かんがえれば'),Y('考える','かんがえる'),Y('迷って','まよって')]);
  s3(266,'急いだあげく、忘れ物をしました。','서두른 끝에 물건을 두고 왔습니다.','grammar','g_n3_76',[],['g_n3_76'],['일상'],true,[Y('急いだ','いそいだ'),Y('忘れ物','わすれもの')]);
  s3(267,'長く悩んだ末に、留学を決めました。','오래 고민한 끝에 유학을 결정했습니다.','grammar','g_n3_77',['v_n3_692'],['g_n3_77'],['추상'],true,[Y('長く','ながく'),Y('悩んだ','なやんだ'),Y('末','すえ'),Y('留学','りゅうがく'),Y('決めました','きめました')]);
  s3(268,'並んで待つくらいなら、別の日に来ます。','줄 서서 기다릴 바엔 다른 날에 오겠습니다.','grammar','g_n3_78',[],['g_n3_78'],['생활'],true,[Y('並んで','ならんで'),Y('待つ','まつ'),Y('別','べつ'),Y('日','ひ'),Y('来ます','きます')]);
  s3(269,'確認しなかったばかりに、失敗しました。','확인하지 않은 탓에 실패했습니다.','grammar','g_n3_79',[],['g_n3_79'],['직장'],true,[Y('確認','かくにん'),Y('失敗','しっぱい')]);
  s3(270,'毎日練習しただけに、結果が出ました。','매일 연습한 만큼 결과가 나왔습니다.','grammar','g_n3_80',[],['g_n3_80'],['학습'],true,[Y('毎日','まいにち'),Y('練習','れんしゅう'),Y('結果','けっか'),Y('出ました','でました')]);
  s3(271,'まじめな彼のことだから、必ず来ます。','성실한 그이니까 반드시 옵니다.','grammar','g_n3_82',[],['g_n3_82'],['관계'],true,[Y('彼','かれ'),Y('必ず','かならず'),Y('来ます','きます')]);
  s3(272,'予定どおりに作業が進んでいます。','예정대로 작업이 진행되고 있습니다.','grammar','g_n3_83',['v_n3_145'],['g_n3_83'],['직장'],true,[Y('予定','よてい'),Y('作業','さぎょう'),Y('進んで','すすんで')]);
  s3(273,'準備ができ次第、ご連絡します。','준비가 되는 대로 연락드리겠습니다.','grammar','g_n3_84',[],['g_n3_84'],['직장'],true,[Y('準備','じゅんび'),Y('次第','しだい'),Y('連絡','れんらく')]);
  s3(274,'この仕事は給料がいい反面、休みが少ないです。','이 일은 급여가 좋은 반면 휴일이 적습니다.','grammar','g_n3_86',['v_n3_881'],['g_n3_86'],['직장'],true,[Y('仕事','しごと'),Y('給料','きゅうりょう'),Y('反面','はんめん'),Y('休み','やすみ'),Y('少ない','すくない')]);
  s3(275,'店に行ったところが、閉まっていました。','가게에 갔더니 닫혀 있었습니다.','grammar','g_n3_87',[],['g_n3_87'],['생활'],true,[Y('店','みせ'),Y('行った','いった'),Y('閉まって','しまって')]);
  s3(276,'忙しいと知りながらも、つい頼んでしまいました。','바쁜 줄 알면서도 그만 부탁해 버렸습니다.','grammar','g_n3_88',['v_n3_594'],['g_n3_88'],['관계'],true,[Y('忙しい','いそがしい'),Y('知り','しり'),Y('頼んで','たのんで')]);
  s3(277,'景色を楽しみつつ、ゆっくり歩きました。','경치를 즐기면서 천천히 걸었습니다.','grammar','g_n3_89',[],['g_n3_89'],['여행'],true,[Y('景色','けしき'),Y('楽しみ','たのしみ'),Y('歩きました','あるきました')]);
  s3(278,'準備しても、失敗はあり得ます。','준비해도 실패는 있을 수 있습니다.','grammar','g_n3_90',[],['g_n3_90'],['추상'],true,[Y('準備','じゅんび'),Y('失敗','しっぱい'),Y('得ます','えます')]);
  s3(279,'無理を続けると、倒れかねません。','무리를 계속하면 쓰러질 수도 있습니다.','grammar','g_n3_92',[],['g_n3_92'],['건강'],true,[Y('無理','むり'),Y('続ける','つづける'),Y('倒れ','たおれ')]);
  s3(280,'彼の態度は理解しがたいです。','그의 태도는 이해하기 어렵습니다.','grammar','g_n3_93',['v_n3_388'],['g_n3_93'],['관계'],true,[Y('彼','かれ'),Y('態度','たいど'),Y('理解','りかい')]);
  s3(281,'連絡先が分からず、知らせようがありません。','연락처를 몰라서 알릴 도리가 없습니다.','grammar','g_n3_94',[],['g_n3_94'],['소통'],true,[Y('連絡先','れんらくさき'),Y('分からず','わからず'),Y('知らせよう','しらせよう')]);
  s3(282,'今から急いでも、間に合いっこないです。','지금 서둘러도 시간에 맞출 리 없습니다.','grammar','g_n3_95',[],['g_n3_95'],['일상'],true,[Y('今','いま'),Y('急いで','いそいで'),Y('間に合い','まにあい')]);
  s3(283,'忙しくて、旅行どころではありません。','바빠서 여행할 상황이 아닙니다.','grammar','g_n3_96',[],['g_n3_96'],['생활'],true,[Y('忙しくて','いそがしくて'),Y('旅行','りょこう')]);
  s3(284,'こんなに早く完成するとは驚きました。','이렇게 빨리 완성될 줄은 놀랐습니다.','grammar','g_n3_97',['v_n3_654'],['g_n3_97'],['감정'],true,[Y('早く','はやく'),Y('完成','かんせい'),Y('驚きました','おどろきました')]);
  s3(285,'まさか優勝できるなんて、夢のようです。','설마 우승할 수 있다니 꿈만 같습니다.','grammar','g_n3_98',[],['g_n3_98'],['감정'],true,[Y('優勝','ゆうしょう'),Y('夢','ゆめ')]);
  s3(286,'うれしいことに、全員が合格しました。','기쁘게도 전원이 합격했습니다.','grammar','g_n3_100',[],['g_n3_100'],['감정'],true,[Y('全員','ぜんいん'),Y('合格','ごうかく')]);
  s3(287,'内容を確認したうえで、サインします。','내용을 확인한 후에 사인합니다.','grammar','g_n3_69',[],['g_n3_69'],['생활'],true,[Y('内容','ないよう'),Y('確認','かくにん')]);
  s3(288,'私が知る限り、彼は正直な人です。','제가 아는 한 그는 정직한 사람입니다.','grammar','g_n3_113',[],['g_n3_113'],['관계'],true,[Y('私','わたし'),Y('知る','しる'),Y('限り','かぎり'),Y('彼','かれ'),Y('正直','しょうじき'),Y('人','ひと')]);
  s3(289,'許可が出ない限り、中には入れません。','허가가 나지 않는 한 안에 들어갈 수 없습니다.','grammar','g_n3_114',[],['g_n3_114'],['생활'],true,[Y('許可','きょか'),Y('出ない','でない'),Y('限り','かぎり'),Y('中','なか'),Y('入れません','はいれません')]);
  s3(290,'結果はともかく、最後まで頑張りました。','결과는 차치하고 끝까지 노력했습니다.','grammar','g_n3_115',[],['g_n3_115'],['감정'],true,[Y('結果','けっか'),Y('最後','さいご'),Y('頑張りました','がんばりました')]);
  // ── N3 3차 확장 (라운드 38) — sent_n3_291 ~ 350 ──
  s3(291,'私が休みの日に限って、いい天気になります。','하필 제가 쉬는 날에 좋은 날씨가 됩니다.','grammar','g_n3_116',[],['g_n3_116'],['일상'],true,[Y('私','わたし'),Y('休み','やすみ'),Y('日','ひ'),Y('限って','かぎって'),Y('天気','てんき')]);
  s3(292,'今の仕事を辞めるつもりはありません。','지금 일을 그만둘 생각은 없습니다.','grammar','g_n3_117',[],['g_n3_117'],['직장'],true,[Y('今','いま'),Y('仕事','しごと'),Y('辞める','やめる')]);
  s3(293,'毎日練習しただけあって、上手になりました。','매일 연습한 만큼 능숙해졌습니다.','grammar','g_n3_119',[],['g_n3_119'],['학습'],true,[Y('毎日','まいにち'),Y('練習','れんしゅう'),Y('上手','じょうず')]);
  s3(294,'彼は休むことなく走り続けました。','그는 쉬는 일 없이 계속 달렸습니다.','grammar','g_n3_120',[],['g_n3_120'],['감정'],true,[Y('彼','かれ'),Y('休む','やすむ'),Y('走り続けました','はしりつづけました')]);
  s3(295,'年を取ると、昔が懐かしく感じるものです。','나이를 먹으면 옛날이 그리워지는 법입니다.','grammar','g_n3_71',[],['g_n3_71'],['추상'],true,[Y('年','とし'),Y('取る','とる'),Y('昔','むかし'),Y('懐かしく','なつかしく'),Y('感じる','かんじる')]);
  s3(296,'試験は終わったものの、結果が心配です。','시험은 끝났지만 결과가 걱정입니다.','grammar','g_n3_72',[],['g_n3_72'],['학교'],true,[Y('試験','しけん'),Y('終わった','おわった'),Y('結果','けっか'),Y('心配','しんぱい')]);
  s3(297,'引っ越しは荷造りやら手続きやらで大変でした。','이사는 짐 싸기며 수속이며 힘들었습니다.','grammar','g_n3_73',[],['g_n3_73'],['생활'],true,[Y('引っ越し','ひっこし'),Y('荷造り','にづくり'),Y('手続き','てつづき'),Y('大変','たいへん')]);
  s3(298,'地震に備えて、水と食料を蓄えています。','지진에 대비해 물과 식량을 비축하고 있습니다.','vocab','v_n3_1267',['v_n3_1267','v_n3_565'],[],['생활','조언'],true,[Y('地震','じしん'),Y('備えて','そなえて'),Y('水','みず'),Y('食料','しょくりょう'),Y('蓄えて','たくわえて')]);
  s3(299,'むだな手間を省いて、効率を上げます。','쓸데없는 수고를 줄여 효율을 올립니다.','vocab','v_n3_1266',['v_n3_1266','v_n3_153'],[],['직장'],true,[Y('手間','てま'),Y('省いて','はぶいて'),Y('効率','こうりつ'),Y('上げます','あげます')]);
  s3(300,'地域の問題は、住民の協力で乗り越えられます。','지역 문제는 주민의 협력으로 극복할 수 있습니다.','vocab','v_n3_322',['v_n3_322','v_n3_126','v_n3_561'],[],['사회','지역'],true,[Y('地域','ちいき'),Y('問題','もんだい'),Y('住民','じゅうみん'),Y('協力','きょうりょく'),Y('乗り越えられます','のりこえられます')]);
  s3(301,'新しい技術を取り入れて、品質を高めました。','새 기술을 도입해 품질을 높였습니다.','vocab','v_n3_550',['v_n3_550','v_n3_156','v_n3_586'],[],['직장'],true,[Y('新しい','あたらしい'),Y('技術','ぎじゅつ'),Y('取り入れて','とりいれて'),Y('品質','ひんしつ'),Y('高めました','たかめました')]);
  s3(302,'予想外の結果に、みんなが驚きました。','예상 밖의 결과에 모두가 놀랐습니다.','vocab','v_n3_1076',['v_n3_1076','v_n3_654'],[],['감정'],true,[Y('予想外','よそうがい'),Y('結果','けっか'),Y('驚きました','おどろきました')]);
  s3(303,'危機感を持って、対策を考えています。','위기감을 가지고 대책을 생각하고 있습니다.','vocab','v_n3_1081',['v_n3_1081','v_n3_315'],[],['사회'],true,[Y('危機感','ききかん'),Y('持って','もって'),Y('対策','たいさく'),Y('考えて','かんがえて')]);
  s3(304,'完成した時の達成感は、何よりの喜びです。','완성했을 때의 성취감은 무엇보다 큰 기쁨입니다.','vocab','v_n3_1082',['v_n3_1082','v_n3_171'],[],['감정'],true,[Y('完成','かんせい'),Y('時','とき'),Y('達成感','たっせいかん'),Y('何','なに'),Y('喜び','よろこび')]);
  s3(305,'相手の立場を尊重することが大切です。','상대의 입장을 존중하는 것이 중요합니다.','vocab','v_n3_610',['v_n3_488','v_n3_610'],[],['관계'],true,[Y('相手','あいて'),Y('立場','たちば'),Y('尊重','そんちょう'),Y('大切','たいせつ')]);
  s3(306,'落ち込む友だちを、そっと慰めました。','풀이 죽은 친구를 조용히 위로했습니다.','vocab','v_n3_614',['v_n3_438','v_n3_614'],[],['관계'],true,[Y('落ち込む','おちこむ'),Y('友','とも'),Y('慰めました','なぐさめました')]);
  s3(307,'選手を大きな声で励ましました。','선수를 큰 소리로 격려했습니다.','vocab','v_n3_615',['v_n3_615'],[],['관계'],true,[Y('選手','せんしゅ'),Y('大きな','おおきな'),Y('声','こえ'),Y('励ましました','はげましました')]);
  s3(308,'喧嘩した友だちと、無事に仲直りしました。','싸운 친구와 무사히 화해했습니다.','vocab','v_n3_607',['v_n3_607'],[],['관계'],true,[Y('友','とも'),Y('無事','ぶじ'),Y('仲直り','なかなおり')]);
  s3(309,'約束を守って、信用を得ました。','약속을 지켜 신용을 얻었습니다.','vocab','v_n3_619',['v_n3_619'],[],['관계'],true,[Y('約束','やくそく'),Y('守って','まもって'),Y('信用','しんよう'),Y('得ました','えました')]);
  s3(310,'思いやりのある言葉に、救われました。','배려 있는 말에 구원받았습니다.','vocab','v_n3_688',['v_n3_688'],[],['관계'],true,[Y('思いやり','おもいやり'),Y('言葉','ことば'),Y('救われました','すくわれました')]);
  s3(311,'本音で話せる友人は、本当に貴重です。','속마음으로 이야기할 수 있는 친구는 정말 귀중합니다.','vocab','v_n3_627',['v_n3_627','v_n3_1218'],[],['관계'],true,[Y('本音','ほんね'),Y('話せる','はなせる'),Y('友人','ゆうじん'),Y('本当','ほんとう'),Y('貴重','きちょう')]);
  s3(312,'失敗を恐れず、挑戦することが大事です。','실패를 두려워하지 않고 도전하는 것이 중요합니다.','vocab','v_n3_231',['v_n3_435','v_n3_231'],[],['조언'],true,[Y('失敗','しっぱい'),Y('恐れず','おそれず'),Y('挑戦','ちょうせん'),Y('大事','だいじ')]);
  s3(313,'努力を重ねて、ついに目標を達成しました。','노력을 거듭해 마침내 목표를 달성했습니다.','vocab','v_n3_1269',['v_n3_1269','v_n3_372'],[],['감정'],true,[Y('努力','どりょく'),Y('重ねて','かさねて'),Y('目標','もくひょう'),Y('達成','たっせい')]);
  s3(314,'小さな練習を積み重ねることが、上達の近道です。','작은 연습을 쌓는 것이 향상의 지름길입니다.','vocab','v_n3_1270',['v_n3_1270','v_n3_352','v_n3_981'],[],['학습'],true,[Y('小さな','ちいさな'),Y('練習','れんしゅう'),Y('積み重ねる','つみかさねる'),Y('上達','じょうたつ'),Y('近道','ちかみち')]);
  s3(315,'自分の長所も短所も、よく分かっています。','자신의 장점도 단점도 잘 알고 있습니다.','vocab','v_n3_645',['v_n3_645','v_n3_646'],[],['추상'],true,[Y('自分','じぶん'),Y('長所','ちょうしょ'),Y('短所','たんしょ'),Y('分かって','わかって')]);
  s3(316,'彼女には絵の才能があります。','그녀에게는 그림 재능이 있습니다.','vocab','v_n3_647',['v_n3_647'],[],['추상'],true,[Y('彼女','かのじょ'),Y('絵','え'),Y('才能','さいのう')]);
  s3(317,'娘は読書に夢中です。','딸은 독서에 푹 빠져 있습니다.','vocab','v_n3_651',['v_n3_651'],[],['관계'],true,[Y('娘','むすめ'),Y('読書','どくしょ'),Y('夢中','むちゅう')]);
  s3(318,'深い呼吸をして、緊張をほぐします。','깊은 호흡을 해서 긴장을 풉니다.','vocab','v_n3_460',['v_n3_460'],[],['건강'],true,[Y('深い','ふかい'),Y('呼吸','こきゅう'),Y('緊張','きんちょう')]);
  s3(319,'夜空を見上げると、星が輝いていました。','밤하늘을 올려다보니 별이 빛나고 있었습니다.','vocab','v_n3_1285',['v_n3_543','v_n3_1285'],[],['자연'],true,[Y('夜空','よぞら'),Y('見上げる','みあげる'),Y('星','ほし'),Y('輝いて','かがやいて')]);
  s3(320,'秋になると、葉が赤や黄色に染まります。','가을이 되면 잎이 빨강이나 노랑으로 물듭니다.','vocab','v_n3_1288',['v_n3_1288'],[],['자연'],true,[Y('秋','あき'),Y('葉','は'),Y('赤','あか'),Y('黄色','きいろ'),Y('染まります','そまります')]);
  s3(321,'今朝は急に冷え込みました。','오늘 아침은 갑자기 쌀쌀해졌습니다.','vocab','v_n3_1292',['v_n3_1292'],[],['자연'],true,[Y('今朝','けさ'),Y('急','きゅう'),Y('冷え込みました','ひえこみました')]);
  s3(322,'雨が少なくて、市は節水を呼びかけています。','비가 적어서 시는 절수를 호소하고 있습니다.','vocab','v_n3_559',['v_n3_559'],[],['사회'],true,[Y('雨','あめ'),Y('少なくて','すくなくて'),Y('市','し'),Y('節水','せっすい'),Y('呼びかけて','よびかけて')]);
  s3(323,'森林を守る活動が、各地に広がっています。','삼림을 지키는 활동이 각지에 퍼지고 있습니다.','vocab','v_n3_1120',['v_n3_1120','v_n3_520'],[],['사회'],true,[Y('森林','しんりん'),Y('守る','まもる'),Y('活動','かつどう'),Y('各地','かくち'),Y('広がって','ひろがって')]);
  s3(324,'古い服を集めて、新しい製品に作り変えます。','헌 옷을 모아 새 제품으로 만들어 바꿉니다.','vocab','v_n3_1113',['v_n3_155'],[],['사회'],true,[Y('古い','ふるい'),Y('服','ふく'),Y('集めて','あつめて'),Y('新しい','あたらしい'),Y('製品','せいひん'),Y('作り変えます','つくりかえます')]);
  s3(325,'地域の高齢化が、年々進んでいます。','지역의 고령화가 해마다 진행되고 있습니다.','vocab','v_n3_1104',['v_n3_1104'],[],['사회'],true,[Y('地域','ちいき'),Y('高齢化','こうれいか'),Y('年々','ねんねん'),Y('進んで','すすんで')]);
  s3(326,'証明できるものを持って、窓口へ行きます。','증명할 수 있는 것을 가지고 창구로 갑니다.','vocab','v_n3_319',['v_n3_319'],[],['생활'],true,[Y('証明','しょうめい'),Y('持って','もって'),Y('窓口','まどぐち'),Y('行きます','いきます')]);
  s3(327,'更新の手続きは、来月までにしてください。','갱신 절차는 다음 달까지 해 주세요.','vocab','v_n3_784',['v_n3_784','v_n3_147'],[],['생활'],true,[Y('更新','こうしん'),Y('手続き','てつづき'),Y('来月','らいげつ')]);
  s3(328,'用紙に名前と住所を記入します。','용지에 이름과 주소를 기입합니다.','vocab','v_n3_786',['v_n3_787','v_n3_786'],[],['생활'],true,[Y('用紙','ようし'),Y('名前','なまえ'),Y('住所','じゅうしょ'),Y('記入','きにゅう')]);
  s3(329,'落とし物の持ち主が、無事に見つかりました。','분실물 주인을 무사히 찾았습니다.','vocab','v_n3_780',['v_n3_780'],[],['생활'],true,[Y('落とし物','おとしもの'),Y('持ち主','もちぬし'),Y('無事','ぶじ'),Y('見つかりました','みつかりました')]);
  s3(330,'メールに写真を添付して送信しました。','메일에 사진을 첨부해 송신했습니다.','vocab','v_n3_862',['v_n3_862','v_n3_863'],[],['생활'],true,[Y('写真','しゃしん'),Y('添付','てんぷ'),Y('送信','そうしん')]);
  s3(331,'件名を見れば、内容がすぐ分かります。','제목을 보면 내용을 바로 알 수 있습니다.','vocab','v_n3_874',['v_n3_874'],[],['직장'],true,[Y('件名','けんめい'),Y('見れば','みれば'),Y('内容','ないよう'),Y('分かります','わかります')]);
  s3(332,'明日までに返信をお願いします。','내일까지 답신을 부탁합니다.','vocab','v_n3_865',['v_n3_865'],[],['직장'],true,[Y('明日','あした'),Y('返信','へんしん'),Y('願い','ねがい')]);
  s3(333,'操作はとても簡単で、すぐ慣れました。','조작은 매우 간단해서 금방 익숙해졌습니다.','vocab','v_n3_868',['v_n3_868'],[],['생활'],true,[Y('操作','そうさ'),Y('簡単','かんたん'),Y('慣れました','なれました')]);
  s3(334,'山では通信が悪くなることがあります。','산에서는 통신이 나빠질 때가 있습니다.','vocab','v_n3_871',['v_n3_871'],[],['생활'],true,[Y('山','やま'),Y('通信','つうしん'),Y('悪く','わるく')]);
  s3(335,'料理の動画を見ながら作りました。','요리 동영상을 보면서 만들었습니다.','vocab','v_n3_873',['v_n3_873'],[],['생활'],true,[Y('料理','りょうり'),Y('動画','どうが'),Y('見ながら','みながら'),Y('作りました','つくりました')]);
  s3(336,'土曜日は定休日なので、店は閉まっています。','토요일은 정기 휴일이라 가게는 닫혀 있습니다.','vocab','v_n3_877',['v_n3_877'],[],['생활'],true,[Y('土曜日','どようび'),Y('定休日','ていきゅうび'),Y('店','みせ'),Y('閉まって','しまって')]);
  s3(337,'三十分ごとに、係の人が交代します。','30분마다 담당자가 교대합니다.','vocab','v_n3_879',['v_n3_879'],[],['직장'],true,[Y('三十分','さんじゅっぷん'),Y('係','かかり'),Y('人','ひと'),Y('交代','こうたい')]);
  s3(338,'時間に余裕を持って、家を出ました。','시간에 여유를 갖고 집을 나왔습니다.','vocab','v_n3_888',['v_n3_888'],[],['생활'],true,[Y('時間','じかん'),Y('余裕','よゆう'),Y('持って','もって'),Y('家','いえ'),Y('出ました','でました')]);
  s3(339,'予備の電池を、かばんに入れておきます。','예비 전지를 가방에 넣어 둡니다.','vocab','v_n3_887',['v_n3_887'],[],['생활'],true,[Y('予備','よび'),Y('電池','でんち'),Y('入れて','いれて')]);
  s3(340,'まとめて買うと、得になります。','한꺼번에 사면 이득이 됩니다.','vocab','v_n3_889',['v_n3_889'],[],['쇼핑'],true,[Y('買う','かう'),Y('得','とく')]);
  s3(341,'人気の色は、すぐ品切れになりました。','인기 색상은 금방 품절되었습니다.','vocab','v_n3_892',['v_n3_892'],[],['쇼핑'],true,[Y('人気','にんき'),Y('色','いろ'),Y('品切れ','しなぎれ')]);
  s3(342,'予約の取り消しは、前日までにお願いします。','예약 취소는 전날까지 부탁합니다.','vocab','v_n3_893',['v_n3_893'],[],['생활'],true,[Y('予約','よやく'),Y('取り消し','とりけし'),Y('前日','ぜんじつ'),Y('願い','ねがい')]);
  s3(343,'二つの案を比べて、いいほうを選びます。','두 안을 비교해서 좋은 쪽을 고릅니다.','vocab','v_n3_894',['v_n3_894'],[],['직장'],true,[Y('二つ','ふたつ'),Y('案','あん'),Y('比べて','くらべて'),Y('選びます','えらびます')]);
  s3(344,'行き先は多数決で決めました。','행선지는 다수결로 정했습니다.','vocab','v_n3_895',['v_n3_895'],[],['사회'],true,[Y('行き先','いきさき'),Y('多数決','たすうけつ'),Y('決めました','きめました')]);
  s3(345,'反論があれば、遠慮なく言ってください。','반론이 있으면 사양 말고 말해 주세요.','vocab','v_n3_896',['v_n3_896','v_n3_181'],[],['사회'],true,[Y('反論','はんろん'),Y('遠慮','えんりょ'),Y('言って','いって')]);
  s3(346,'日程の調整に、少し時間がかかりました。','일정 조정에 조금 시간이 걸렸습니다.','vocab','v_n3_898',['v_n3_823','v_n3_898'],[],['직장'],true,[Y('日程','にってい'),Y('調整','ちょうせい'),Y('少し','すこし'),Y('時間','じかん')]);
  s3(347,'来月、駅前で展覧会が開催されます。','다음 달 역 앞에서 전람회가 개최됩니다.','vocab','v_n3_901',['v_n3_901'],[],['행사'],true,[Y('来月','らいげつ'),Y('駅前','えきまえ'),Y('展覧会','てんらんかい'),Y('開催','かいさい')]);
  s3(348,'出発の日が、ようやく確定しました。','출발 날짜가 드디어 확정되었습니다.','vocab','v_n3_902',['v_n3_902'],[],['여행'],true,[Y('出発','しゅっぱつ'),Y('日','ひ'),Y('確定','かくてい')]);
  s3(349,'こつこつ努力を続けるしかありません。','꾸준히 노력을 계속할 수밖에 없습니다.','grammar','g_n3_36',['v_n3_216'],['g_n3_36'],['조언'],true,[Y('努力','どりょく'),Y('続ける','つづける')]);
  s3(350,'迷ったときは、基本に戻ることだ。','망설여질 때는 기본으로 돌아가는 것이 좋다.','grammar','g_n3_63',['v_n3_312'],['g_n3_63'],['조언'],true,[Y('迷った','まよった'),Y('基本','きほん'),Y('戻る','もどる')]);
  return arr;
}
