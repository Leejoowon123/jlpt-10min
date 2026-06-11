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
  s4d(289,'決して無理をしないでください。','결코 무리하지 마세요.','vocab','v_n4_780',['v_n4_780','v_n4_770'],[],['건강','조언'],true,[W('決して','けっして'),W('無理','むり')]);
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
