// ================= 追加コンテンツ「COSMIC編」 =================
// 北高の地下にある特殊クラス「コズミック」の物語。パーティは本編と別（上杉だけ共通）。

// ---------- 仲間 ----------
Object.assign(PDEF,{
  takuya:{n:'タクヤ',g:'タ',c:'#8ecbe9',role:'デスゲームの壱・単独部隊',
    base:{hp:62,mp:20,atk:15,def:8,spd:14},grow:{hp:9,mp:3,atk:3.6,def:2,spd:2.8},
    atk:'tk_atk',ex:'tk_ex',learn:[[1,'tk_hell'],[1,'tk_3sec'],[1,'tk_report']],
    bio:'コズミック最強の一人。淡々と任務をこなす。味方部隊はたいていタクヤ一人。'},
  mabo:{n:'マーボ',g:'麻',c:'#ff7b6a',role:'デスゲームの伍・麻婆豆腐',
    base:{hp:80,mp:16,atk:14,def:10,spd:8},grow:{hp:12,mp:2.5,atk:3.3,def:2.5,spd:1.5},
    atk:'mb_atk',ex:'mb_ex',learn:[[1,'mb_spice'],[1,'mb_tag'],[1,'mb_guard']],
    bio:'バブルとタッグを組む。コードネームは「麻婆豆腐」。バブルの作る麻婆豆腐が大好物。'},
  misumae:{n:'ミスマエ',g:'ミ',c:'#b7a6ff',role:'デスゲームの弐・ミスターマエストロ',
    base:{hp:56,mp:28,atk:12,def:7,spd:13},grow:{hp:8,mp:4,atk:2.9,def:1.8,spd:2.6},
    atk:'mm_atk',ex:'mm_ex',learn:[[1,'mm_cresc'],[1,'mm_forte'],[1,'mm_disso']],
    bio:'指揮者気取りの天才。力に溺れて闇堕ちしたが、今はきれいな音色のために指揮棒を振る。ミスマエと略すと怒る。'},
  bubble:{n:'バブル',g:'泡',c:'#9fd8ff',role:'デスゲームの肆・James付与',
    base:{hp:58,mp:26,atk:11,def:8,spd:12},grow:{hp:8.5,mp:3.8,atk:2.6,def:2,spd:2.4},
    atk:'bb_atk',ex:'bb_ex',learn:[[1,'bb_stop'],[1,'bb_tofu'],[1,'bb_shield'],[1,'bb_tag']],
    bio:'マーボの相棒。英語教科書のJamesを付与された能力者。Jamesは「止める」ことができる。'}
});
Object.assign(SK,{
  tk_atk:{n:'ハンドガン',tg:'enemy',dmg:1},
  tk_hell:{n:'お前を地獄に連れていきます',mp:6,tg:'enemy',dmg:2.3,l:'お前を地獄に連れていきます。',d:'単体に大ダメージ'},
  tk_3sec:{n:'３秒だけ時間をやる',mp:8,tg:'enemy',dmg:.95,hits:3,l:'お前に３秒だけ時間をやる。……3、2、1。',d:'3回攻撃'},
  tk_report:{n:'報告は以上です',mp:14,tg:'enemies',dmg:1.45,l:'こちらタクヤ。敵部隊と遭遇。……敵部隊は壊滅、報告は以上です。',d:'敵全体に攻撃'},
  tk_ex:{n:'味方部隊…タクヤ',ex:1,tg:'enemies',dmg:3.6,pierce:1,l:'…ッ…、…あー…ちら…こちらタクヤ…、…敵…暫定100名…味方部隊…タクヤ…',d:'EX：防御無視で敵全体に特大ダメージ'},
  mb_atk:{n:'中華鍋',tg:'enemy',dmg:1},
  mb_spice:{n:'激辛花椒',mp:6,tg:'enemy',dmg:1.2,st:{k:'confuse',ch:.6,t:2},l:'辛さで目ぇ覚ましな！',d:'攻撃＋混乱'},
  mb_tag:{n:'タッグ技・麻婆バブル',mp:10,tg:'enemies',dmg:1.7,tag:'bubble',l:'いくぞバブル！　タッグってやつだ！',d:'敵全体に攻撃（バブルが倒れていると威力半減）'},
  mb_guard:{n:'俺が相手をしてやる',mp:6,tg:'self',taunt:3,buff:{def:1.6},t:3,l:'お前の相手は俺だ。',d:'敵の攻撃を引きつける'},
  mb_ex:{n:'デスゲームの伍「麻婆豆腐」',ex:1,tg:'enemy',dmg:5.5,l:'デスゲームの伍「麻婆豆腐」、いただきます！！',d:'EX：単体に超ダメージ'},
  bb_atk:{n:'泡',tg:'enemy',dmg:1},
  bb_stop:{n:'James、止める',mp:8,tg:'enemy',st:{k:'seal',ch:1,t:2},cd:3,l:'James、止めて。',d:'敵1体を別の世界に2ターン閉じ込める（ボスは50%）。使うと3ターン使えない'},
  bb_tofu:{n:'バブルの麻婆豆腐',mp:10,tg:'allies',heal:.35,l:'はい、麻婆豆腐。食べて。',d:'味方全員のHP回復'},
  bb_shield:{n:'バブルシールド',mp:6,tg:'allies',buff:{def:1.35},t:3,l:'泡で包むよ。',d:'味方全員の防御アップ'},
  bb_tag:{n:'タッグ技・麻婆バブル',mp:10,tg:'enemies',dmg:1.7,tag:'mabo',l:'マーボ、合わせて！',d:'敵全体に攻撃（マーボが倒れていると威力半減）'},
  bb_ex:{n:'James付与',ex:1,tg:'allies',buff:{atk:1.5},t:3,heal:.25,l:'James付与。……みんなに。',d:'EX：味方全員の攻撃アップ＋HP回復'},
  mm_atk:{n:'指揮棒',tg:'enemy',dmg:1},
  mm_cresc:{n:'クレッシェンド',mp:8,tg:'allies',buff:{atk:1.2,spd:1.2},t:3,l:'だんだん強く。……ついてこられるかい？',d:'味方全員の攻撃・素早さアップ'},
  mm_forte:{n:'フォルテッシモ',mp:12,tg:'enemies',dmg:1.4,l:'全楽章、フォルテッシモ！',d:'敵全体に攻撃'},
  mm_disso:{n:'不協和音',mp:7,tg:'enemies',st:{k:'confuse',ch:.45,t:2},l:'汚い音色には、汚い音色で返す。',d:'敵全体を混乱させる'},
  mm_ex:{n:'きれいな音色',ex:1,tg:'allies',heal:.5,revive:.4,l:'……悪くない。これが、僕の聴きたかった音だ。',d:'EX：味方全員を回復＋復活'},
  shiranu:{n:'知らぬといふこと',mp:10,tg:'allies',buff:{atk:1.25,crit:.15},t:3,l:'知らぬといふこと、これ物事の始めとなる。',d:'味方全員の攻撃・会心率アップ'},
  cosmic5:{n:'コズミックは5人',ex:1,tg:'enemies',dmg:4.2,l:'1足す1は2。コズミックは、5人だ！',d:'EX：敵全体に特大ダメージ'}
});

// ---------- 敵 ----------
Object.assign(E,{
  aohei:{n:'青い兵士',sub:'ブルーマン先遣隊',g:'青',c:'#6fa8ff',lv:34,m:{hp:.9,atk:.9},
    acts:[{l:'（青い銃を構えた）',k:'atk',p:1.2,w:2},{l:'（隊列を組む）',k:'buff',stat:'def',v:1.3},{l:'（一斉射撃）',k:'all',p:.75}],
    dex:'平行線の向こうから来た、ブルーマンの先遣隊。何も言わない。'},
  aoheiS:{n:'青い狙撃兵',sub:'ブルーマン先遣隊',g:'狙',c:'#6fa8ff',lv:34,m:{hp:.8,atk:1,spd:1.3},
    acts:[{l:'（遠くから狙っている）',k:'skip'},{l:'（狙撃）',k:'atk',p:1.5,w:2}],
    dex:'先遣隊の狙撃手。一発が重い。'},
  aotaicho:{n:'青い部隊長',sub:'第1話ボス',g:'隊',c:'#6fa8ff',lv:35,boss:1,m:{hp:4.5,atk:.85,def:1.05,exp:1.2},
    i:'ハハッ！やってみろよ',
    acts:[{l:'これは拳でぶん殴って目ぇ覚ますしかねえなあ！！',k:'atk',p:1.8,w:2},
      {l:'フッ、3、2、1、',k:'multi',h:3,p:.6,w:2},
      {l:'部隊、前へ！',k:'call',ids:['aohei'],max:3},
      {l:'ハハッ！やってみろよ',k:'buff',stat:'atk',v:1.25}],
    low:{l:'ゴボォ....',buff:1.25},
    d:'…ぃじょうぶです',dex:'先遣隊の隊長。最後まで人を舐めている。'},
  blueShadow:{n:'ブルーマンの影',sub:'第2話ボス',g:'影',c:'#4a7fd8',lv:38,boss:1,m:{hp:8.5,atk:1.05,def:1.2,exp:1.2},
    i:'……………',
    acts:[{l:'……………',k:'skip'},{l:'（青い拳）',k:'atk',p:1.8,w:2},{l:'（青に染める）',k:'allst',p:.8,st:'confuse',ch:.35,t:2,w:2},{l:'（無言で青くなる）',k:'heal',p:.12}],
    d:'……………',dex:'ブルーマン本体が落とした影。影だけで先遣隊より強い。'},
  bluman:{n:'ブルーマン',sub:'第3話・本体',g:'青',c:'#3a6fe0',lv:40,boss:1,m:{hp:12,atk:1.1,def:1.4,exp:1.5},
    cut:.35,endAt:.5,
    i:'……………',
    acts:[{l:'……………',k:'skip'},{l:'（青い拳）',k:'atk',p:2,w:2},{l:'（屋上ごと殴った）',k:'all',p:1.25,w:2},{l:'（時空がゆがむ）',k:'st',st:'seal',ch:.5,t:2}],
    endLine:'ブルーマンの拳が、屋上を砕いた。',
    dex:'平行線の向こうから来た、何も言わない青い男。攻撃はほとんど通らない。'},
  gakudan:{n:'闇の楽団員',sub:'マエストロの楽団',g:'楽',c:'#b7a6ff',lv:41,m:{hp:.9,atk:.95},
    acts:[{l:'（不協和音を奏でる）',k:'st',st:'confuse',ch:.3,t:1},{l:'（弓で叩く）',k:'atk',p:1.2,w:2},{l:'（マエストロを讃える）',k:'buffboss',stat:'atk',v:1.15,t:3}],
    dex:'ミスマエの影から生まれた楽団。指揮棒が振られる限り演奏をやめない。'},
  maestro:{n:'闇マエストロ',sub:'第4話ボス',g:'ミ',c:'#9b6bff',lv:42,boss:1,m:{hp:7,atk:1,def:1.15,spd:1.2,exp:1.5},
    i:'終わるなら　終わってみせよ　ゴミクズが',
    acts:[{l:'ちっ、、なんて汚い音色なんだ。この僕にこんな音を聴かせるなんて、、、！！',k:'atk',p:2,w:2},
      {l:'（指揮棒を振り上げた）　全楽章、フォルテッシモ！',k:'all',p:1.2,w:2},
      {l:'（不協和音の指揮）',k:'allst',p:.7,st:'confuse',ch:.45,t:2},
      {l:'楽団、もっと僕に力を！',k:'call',ids:['gakudan'],max:3},
      {l:'僕にもっと力を……！',k:'buff',stat:'atk',v:1.3}],
    low:{l:'終わるなら……終わってみせよ……！！',buff:1.3},
    d:'……僕は、ただ……誰かの役に立つ力が欲しかった……',dex:'デスゲームの弐、ミスターマエストロ。漏れ出したブルーマンの力に溺れて闇堕ちした。'},
  jikken:{n:'コズミック実験体',sub:'ツジモトの作品',g:'実',c:'#f3a6c8',lv:42,m:{hp:1,atk:1},
    acts:[{l:'（データを送信している）',k:'buffboss',stat:'def',v:1.2,t:3},{l:'（暴走）',k:'atk',p:1.4,w:2},{l:'（自爆シークエンス）',k:'boom',p:.9}],
    dex:'Dr.ツジモトが作った、デスゲームの番号を持たない実験体。'},
  tsujimoto:{n:'Dr.ツジモト',sub:'コズミック担任',g:'辻',c:'#f3a6c8',lv:43,boss:1,m:{hp:5.5,atk:1,def:1.15,spd:1.1,exp:1.6},
    i:'知らぬといふこと、これ物事の始めとなる。……知ってしまったなら、もう用済みね。',
    acts:[{l:'五億年ボタン、押してあげる。',k:'st',st:'seal',ch:.6,t:2,w:1.5},
      {l:'観測完了。弱点はそこね。',k:'debuff',stat:'def',v:.75},
      {l:'デスゲーム、開始。',k:'all',p:1.25,w:2},
      {l:'実験体、投入。',k:'call',ids:['jikken'],max:3},
      {l:'（注射器を投げた）',k:'atk',p:1.6,w:1.5}],
    low:{l:'いいわ……最終実験よ。',into:'tsujimoto2'},
    dex:'北高の特殊クラス「コズミック」を仕切る女科学者。生徒たちを「デスゲーム」の番号で呼ぶ。'},
  tsujimoto2:{n:'Dr.ツジモト',sub:'最終実験',g:'辻',c:'#ff4f6a',lv:44,boss:1,m:{hp:4.5,atk:1.1,def:1.2,spd:1.2,exp:1.6},
    i:'猿は火花を知らない。あなたたちも、私の本気を知らない。',
    acts:[{l:'五億年ボタン、連打。',k:'st',all:1,st:'seal',ch:.35,t:2},
      {l:'デスゲーム、最終ラウンド。',k:'all',p:1.45,w:2},
      {l:'（自分に薬を打った）',k:'buff',stat:'atk',v:1.3},
      {l:'（メスが飛ぶ）',k:'multi',h:3,p:.6,w:1.5}],
    d:'……いみじきもの、なり……',dex:'自分を実験台にしたDr.ツジモト。'},
  blumanT:{n:'ブルーマン',sub:'五億年帰り',g:'青',c:'#2a5fd0',lv:45,boss:1,m:{hp:11,atk:1.1,def:1.3,spd:1.1,exp:2.5},
    i:'……………',
    acts:[{l:'……………',k:'skip'},{l:'（五億年分の青い拳）',k:'atk',p:2.2,w:2},{l:'（世界ごと青く染める）',k:'allst',p:1,st:'confuse',ch:.35,t:2,w:2},
      {l:'（時空がゆがむ）',k:'st',st:'seal',ch:.5,t:2},{l:'（無言で青くなる）',k:'heal',p:.1}],
    low:{l:'（青が、白くなりはじめた）',buff:1.25},
    d:'……………',dex:'止まった世界でマーボと五億年戦い続けたブルーマン。最後まで何も言わなかった。'}
});

Object.assign(SPK,{
  'タクヤ':['タ','#8ecbe9'],'マーボ':['麻','#ff7b6a'],'バブル':['泡','#9fd8ff'],'ミスマエ':['ミ','#b7a6ff'],
  'ともぞう':['と','#9be7a8'],'Dr.ツジモト':['辻','#f3a6c8'],'青い部隊長':['隊','#6fa8ff'],'James':['J','#f2d35b']
});

const COSMIC_GUEST_TOMOZO={n:'ともぞう',p:1.0,l:['法を犯すでござんす','絞め殺すでござんす','お口が悪いでござんすね']};
const COSMIC_GUEST_MABO={n:'マーボGG',p:1.5,l:['GG（グッドゲーム）にしようぜ！','五億年ぶんの麻婆豆腐だ！','向こうで五億年、こいつとやり合ってたんだ。慣れたもんよ','デスゲームの伍「麻婆豆腐」、ただいま！']};

const KOBUN='河原に猿のその額に石をのせたるありて佇みけり。通りし牝鹿の尋ねて言ひけることには、「豈にその額に石を乗せたるか。」とあり。猿の答へて曰く、「我火花を知らず。未だ幼子の身なりて、熱きをしらず。また鈍かる身なりて、瞬くをしらず。ここにおひてなり。」牝鹿、頷きて帰る。知らぬといふこと、これ物事の始めとなる。いみじきものなり。';

// ---------- ストーリー ----------
const COSMIC={
  title:'COSMIC編',sub:'デスゲームの教室',lv:[35,38,40,42,44],
  ep:[
  {a:'COSMIC　第1話',b:'コズミック',s:[
    {t:'title',a:'COSMIC　第1話',b:'コズミック'},
    {t:'place',v:'北高・英語科準備室（夜）'},
    ['','平行線の事件から数日後の夜。黒板に、白いチョークで勝手に文字が浮かび上がった。'],
    ['','「コズミック招集　デスゲームの参　上杉」'],
    ['上杉','……デスゲームの、参？　1足す1とは……いや、なんだこれ。頭が痛い。'],
    {t:'fx'},
    {t:'place',v:'北高・地下　コズミック教室'},
    ['','気がつくと、上杉は知らない教室にいた。北高の地下に、こんな場所があることを誰も知らない。'],
    ['','黒板には、古い文章が書かれている。'],
    ['',KOBUN],
    ['Dr.ツジモト','おかえりなさい、デスゲームの参。記憶の封印、思ったより早く解けたわね。'],
    ['上杉','辻本先生……？　いや、その白衣……'],
    ['Dr.ツジモト','ここではドクターツジモトと呼びなさい。北高の特殊クラス「コズミック」の担任よ。あなたもその一人。'],
    ['Dr.ツジモト','米津先生にニューロンをいじってもらったのは、あなたの力を眠らせておくためだったの。'],
    ['上杉','じゃあ「おっほーん」は……'],
    ['Dr.ツジモト','副作用ね。'],
    ['','教室の隅で、ひとりの生徒が無言で銃の手入れをしている。'],
    ['タクヤ','デスゲームの壱、タクヤです。任務の説明を。'],
    ['Dr.ツジモト','平行線の向こうから、青い部隊が北高に入りこんでいる。「ブルーマン」の先遣隊よ。タクヤ、参を連れて行きなさい。'],
    ['タクヤ','了解。足手まといなら置いていきます。'],
    {t:'join',id:'takuya'},
    ['','タクヤが仲間になった！　コズミック編のパーティは本編とは別です（上杉だけ共通）。'],
    {t:'place',v:'北高・裏門'},
    ['','裏門の外に、青い服の兵士が二人立っていた。顔がない。ただ青い。'],
    {t:'battle',e:['aohei','aohei']},
    ['タクヤ','次。'],
    {t:'place',v:'北高・旧校舎'},
    ['','旧校舎の廊下に、青い兵士がずらりと並んでいる。その真ん中で、青い隊長が笑っていた。'],
    ['タクヤ','お前を地獄に連れていきます。'],
    ['青い部隊長','ハハッ！やってみろよ'],
    ['青い部隊長','これは拳でぶん殴って目ぇ覚ますしかねえなあ！！'],
    {t:'battle',e:['aohei','aotaicho'],boss:1},
    ['青い部隊長','ゴボォ....'],
    ['タクヤ','お前に３秒だけ時間をやる、何か言い残したことはあるか'],
    ['青い部隊長','フッ、3、2、1、'],
    ['','ドンっっっ'],
    ['青い部隊長','…ぃじょうぶです'],
    ['','ドドンっっっっ'],
    ['タクヤ','っ…どこまでも舐めた野郎だ'],
    ['','タクヤは無線を取り出した。'],
    ['タクヤ','…ッ…、…あー…ちら…こちらタクヤ…、…敵部隊と…遭遇…敵…暫定100名…味方部隊…タクヤ…敵部隊は壊滅、…報告は以上です…'],
    ['上杉','味方部隊……タクヤって、一人じゃん。'],
    ['タクヤ','一人で足ります。……参、さっきの動きは悪くなかった。'],
    ['','上杉の頭の中で、黒板の古文の最後の一文がひびいた。'],
    {t:'learn',id:'shiranu'},
    ['','上杉は「知らぬといふこと」を思い出した！（味方全員の攻撃・会心率アップ）']
  ]},
  {a:'COSMIC　第2話',b:'麻婆豆腐',s:[
    {t:'title',a:'COSMIC　第2話',b:'麻婆豆腐'},
    {t:'place',v:'北高・食堂（放課後）'},
    ['','放課後の食堂。厨房から、むせるほど辛い匂いがしてくる。'],
    ['バブル','はい、麻婆豆腐。デスゲームの肆、バブル。こっちは伍のマーボ。'],
    ['マーボ','おう、お前が参か！　食え食え、バブルの麻婆豆腐はコズミックで一番うまい兵器だ。'],
    ['上杉','か、からっ……でも、うまい……！'],
    ['マーボ','だろ？　俺のコードネームが「麻婆豆腐」なのは、こいつのせいだ。'],
    ['バブル','タッグだからね。二人でひとつ。……James、あいさつして。'],
    ['','バブルの背後に、ぼんやりと人の形をした泡が浮かんだ。英語の教科書に出てくるような、几帳面な顔の男だ。'],
    ['James','Nice to meet you. I play.'],
    ['上杉','教科書のJames……！？'],
    ['バブル','James付与。僕の力だよ。Jamesは「止める」ことができる。'],
    ['','食堂の入口で、白い手袋の生徒が耳をふさいでいた。'],
    ['ミスマエ','麻婆豆腐をすする音……品がないね。デスゲームの弐、ミスターマエストロ。ミスマエと略すのは許さない。'],
    ['マーボ','ミスマエ、お前も食えよ。'],
    ['ミスマエ','僕は指揮棒より重いものは持たない。……この教室には力が足りないんだ。僕にもっと力があれば。'],
    {t:'join',id:'mabo'},{t:'join',id:'bubble'},
    ['','マーボとバブルが仲間になった！'],
    {t:'place',v:'北高・グラウンド（夜）'},
    ['','夜のグラウンドに、また青い兵士が湧いて出た。'],
    {t:'battle',e:['aohei','aoheiS','aohei']},
    ['','青い兵士たちの向こうで、空が青く裂けた。'],
    ['Dr.ツジモト','（無線）観測した。ブルーマン本体の影が出てくるわ。データを取りなさい。'],
    {t:'battle',e:['blueShadow'],boss:1},
    ['マーボ','影でこれかよ……本体はどんだけなんだ。'],
    ['バブル','……マーボ、怖い顔してる。'],
    ['マーボ','腹が減ってるだけだ。帰ったら麻婆豆腐な。']
  ]},
  {a:'COSMIC　第3話',b:'止める',s:[
    {t:'title',a:'COSMIC　第3話',b:'止める'},
    {t:'place',v:'北高・屋上（深夜）'},
    ['','深夜。北高の上空に、巨大な青い男が立っていた。何も言わない。ただ青い。'],
    ['Dr.ツジモト','（無線）ブルーマン本体よ。こちらの攻撃は、ほとんど通らないと思って。'],
    ['タクヤ','任務は。'],
    ['Dr.ツジモト','（無線）生き残ること。'],
    {t:'battle',e:['bluman'],boss:1},
    ['','ブルーマンの拳が屋上を砕いた。上杉もタクヤも、もう立てない。'],
    ['マーボ','……バブル。'],
    {t:'place',v:'回想・食堂'},
    ['マーボ','うめぇ！　なんだこれ、うめぇ！　バブル、お前天才だろ！'],
    ['バブル','大げさだよ。ただの麻婆豆腐。'],
    ['マーボ','決めた。俺のコードネーム、「麻婆豆腐」にする。'],
    {t:'place',v:'北高・屋上（深夜）'},
    ['マーボ','ごめんな、バブル。\n俺はここまでみたいだ。\nお前にはたくさん世話になったな。'],
    ['マーボ','あの時の麻婆豆腐、スゲぇうまかった。\nそれは本当、夢見たいで。'],
    ['マーボ','…っとまあこんな事、戦場で話す事じゃないよな。'],
    ['マーボ','やれ。バブル。「止める」だ。\nあいつは時の止まった世界で俺が相手をしてやる。'],
    ['マーボ','まあ、もうこの世界に未練も無いし、無限の世界ってのも悪くないかもな。'],
    ['マーボ','じゃあ一寸行って来ますか。\nなあに、長い修学旅行だ。孰れまた会えるさ。'],
    ['マーボ','…デスゲームの伍「麻婆豆腐」\n元気でな。'],
    ['バブル','……James。止めて。'],
    {t:'fx'},
    ['','Jamesの手が、マーボとブルーマンに触れた。二人の姿は写真のように止まり、そして消えた。'],
    ['バブル','これで'],
    ['','屋上には、食べかけの麻婆豆腐の容器だけが残っていた。'],
    {t:'leave',id:'mabo'},
    ['','マーボがパーティから外れた。']
  ]},
  {a:'COSMIC　第4話',b:'マエストロ',s:[
    {t:'title',a:'COSMIC　第4話',b:'マエストロ'},
    {t:'place',v:'北高・地下　コズミック教室'},
    ['','バブルは、黒板の古文をじっと見ていた。誰も声をかけられなかった。'],
    ['Dr.ツジモト','落ち込んでいる暇はないわ。止めた世界の座標が乱れている。ブルーマンの力が、こちらに漏れ出しているの。'],
    ['','その時、音楽室の方角から、ひどく乱れた旋律が聞こえてきた。'],
    {t:'place',v:'北高・音楽室'},
    ['','指揮台の上で、ミスマエが青黒い光を浴びていた。漏れ出したブルーマンの力を、指揮棒で吸い上げている。'],
    ['ミスマエ','見ていたよ、屋上。マーボは弱かったから消えた。それだけのことさ。'],
    ['バブル','……取り消して。'],
    ['ミスマエ','僕は違う。この力があれば、もう誰にも負けない。'],
    ['タクヤ','その力は任務の邪魔です。止めます。'],
    ['','タクヤの無線から、ノイズまじりの音が流れた。'],
    ['ミスマエ','ちっ、、なんて汚い音色なんだ。\nこの僕にこんな音を聴かせるなんて、、、！！'],
    {t:'fx'},
    ['','ミスマエの影がふくれあがり、闇の楽団が音もなく席についた。'],
    ['','……その時、音楽室の窓から、ひとりの生徒がよじのぼってきた。'],
    ['ともぞう','待つでござんす。'],
    ['ともぞう','コズミック番外、ともぞうでござんす。俳句の授業をサボって来たでござんす。'],
    ['ミスマエ','終わるなら\n終わってみせよ\nゴミクズが'],
    ['ともぞう','終わるはものの\n終わらぬなりけり'],
    ['ともぞう','ともぞう心の俳句'],
    ['ともぞう','お口が悪いでござんすね'],
    {t:'battle',e:['gakudan','maestro','gakudan'],boss:1,guest:'tomozo'},
    ['ミスマエ','……僕は、ただ……マーボみたいに、誰かの役に立つ力が欲しかった……'],
    ['バブル','なら、手伝って。マーボを取り戻す。'],
    ['ミスマエ','取り戻す……？　止めた世界からは、誰も戻れないはずだ。'],
    ['Dr.ツジモト','（無線）……そうとは限らないわ。全員、教室に戻りなさい。'],
    ['ミスマエ','……指揮棒、もう一度振らせてくれないか。今度は、きれいな音色のために。'],
    {t:'join',id:'misumae'},
    ['','ミスマエが仲間になった！']
  ]},
  {a:'COSMIC　最終話',b:'デスゲーム',s:[
    {t:'title',a:'COSMIC　最終話',b:'デスゲーム'},
    {t:'place',v:'北高・地下　コズミック教室'},
    ['Dr.ツジモト','Jamesの「止める」について、話しておくことがあるの。'],
    ['Dr.ツジモト','「止める」は、本当は時間を止める技じゃない。この世界と全く影響の無い別の世界に、対象物を一時的に閉じ込める技よ。'],
    ['Dr.ツジモト','五億年ボタンを想像すると分かり易いわね。向こうでどれだけ時間が流れても、こちらでは一瞬。'],
    ['バブル','じゃあ、マーボは……'],
    ['Dr.ツジモト','生きている。向こうで、ブルーマンと五億年戦い続けているかもしれないけれど。'],
    ['上杉','一時的に……ってことは、出せるんですか。'],
    ['Dr.ツジモト','出せるわ。そのためにコズミックを作ったんだもの。'],
    ['Dr.ツジモト','デスゲームの壱から伍。あなたたちは、閉じた世界の扉を開けるために集めた実験体。……そして扉を開けたら、中のブルーマンの力は私がいただく。'],
    ['タクヤ','任務内容に虚偽あり。'],
    ['ミスマエ','……僕に力を流したのも、あなただったのか。'],
    ['Dr.ツジモト','知らぬといふこと、これ物事の始めとなる。……知ってしまったなら、あなたたちはもう用済みね。'],
    ['','黒板の古文が、青く光った。'],
    ['上杉','猿は火花を知らないから、額に石を乗せてた……。俺も知らなかったから、「1足す1とは」で止まってた。'],
    ['上杉','でも、もう知ってる。1足す1は2だ。コズミックは、5人だ。'],
    {t:'learnEx',id:'cosmic5'},
    ['','上杉のEX技が「コズミックは5人」に変わった！（コズミック編のあいだ）'],
    {t:'battle',e:['jikken','tsujimoto','jikken'],boss:1},
    ['Dr.ツジモト','……データは、取れたわ……扉は……開く……'],
    {t:'fx'},
    ['','黒板の平行線が開き、止まった世界から、青い光と、ひとりの男が転がり出てきた。'],
    ['マーボ','……あー。こちら麻婆豆腐。五億年ぶりの、ただいま。'],
    ['バブル','マーボ！！'],
    ['マーボ','腹減った。……って、言ってる場合じゃねえな。あいつも出てきちまった。'],
    ['','マーボの後ろで、ブルーマンが立ち上がる。五億年の戦いで、その青はさらに深くなっていた。'],
    ['マーボ','向こうで五億年、こいつとやり合ってた。決着はまだだ。……今度は全員でいくぞ。GG（グッドゲーム）にしようぜ。'],
    ['ミスマエ','……今度は、きれいな音色で頼むよ。'],
    ['ともぞう','終わるはものの　終わらぬなりけり、でござんす。'],
    ['','バブルが、あたたかい麻婆豆腐を全員に配った。'],
    {t:'heal'},
    ['','全員のHPと正気が回復した！'],
    {t:'battle',e:['blumanT'],boss:1,guest:'mabo'},
    ['','ブルーマンは、最後まで何も言わなかった。青が少しずつ白くなって、消えた。'],
    ['マーボ','GG。'],
    {t:'place',v:'北高・食堂'},
    ['バブル','はい、麻婆豆腐。五億年ぶん。'],
    ['マーボ','……うめぇ。やっぱこれだ。夢見たいだ。'],
    ['タクヤ','こちらタクヤ。敵部隊は壊滅。味方部隊、コズミック、全員帰還。……報告は以上です。'],
    ['ミスマエ','……悪くない音色だ。'],
    ['ともぞう','麻婆の\n湯気の向こうに\n五億年　　……ともぞう心の俳句でござんす。'],
    ['上杉','えぐい。'],
    {t:'join',id:'mabo'}
  ]}
  ]
};

// ---------- 進行データ ----------
function cosmicState(){
  if(!S.cosmic) S.cosmic={ep:0,step:0,party:[],m:{},clear:0};
  return S.cosmic;
}
function cosmicParty(){
  const C=cosmicState(), u=S.party.find(m=>m.id==='uesugi');
  return [u,...C.party.map(id=>C.m[id]).filter(Boolean)];
}
function cosmicHeal(){ cosmicParty().forEach(m=>{ m.hp=stat(m,'hp'); m.mp=stat(m,'mp'); }); }
// コズミックの面々で戦う。本編のパーティは S._main に避難させ、セーブ時は本編側を保存する
async function cosmicBattle(ids,opt={}){
  const main=S.party, C=cosmicState(), u=main.find(m=>m.id==='uesugi');
  const keepEx=u.exOv; if(C.uEx) u.exOv=C.uEx;
  S._main=main; S.party=cosmicParty();
  try{ return await startBattle(ids,opt); }
  finally{ S.party=main; delete S._main; u.exOv=keepEx; }
}

// ---------- メニュー ----------
function cosmicMenu(){
  const C=cosmicState();
  overlay('COSMIC編',body=>{
    const done=C.ep>=COSMIC.ep.length;
    body.appendChild(h('div','card',`<h3>${esc(COSMIC.sub)}</h3><p class="q">北高の地下にある特殊クラス「コズミック」の物語。本編とは別のパーティで戦います（上杉だけ共通）。</p><p>${done?`全5話クリア${C.clear>1?` ×${C.clear}`:''}`:`進行：第${C.ep+1}話 / 全5話`}</p>`));
    const ep=COSMIC.ep[Math.min(C.ep,COSMIC.ep.length-1)];
    const sb=h('button','btn story-btn cosmic-btn');
    sb.innerHTML=done?`<span class="big">もう一度最終話を見る</span><small>${esc(ep.a)}「${esc(ep.b)}」</small>`
      :`<span class="big">${C.step>0?'つづきから':'物語を進める'}</span><small>${esc(ep.a)}「${esc(ep.b)}」　推奨Lv${COSMIC.lv[C.ep]}</small>`;
    sb.onclick=()=>{ SFX.sel(); document.querySelector('.ov')?.remove(); runCosmic(done); };
    body.appendChild(sb);
    const g=h('div','grid2');
    const tr=h('button','btn',`訓練<small>コズミックで戦う</small>`); tr.onclick=()=>{ SFX.sel(); document.querySelector('.ov')?.remove(); cosmicTraining(); };
    const he=h('button','btn',`休む<small>全回復・無料</small>`); he.onclick=()=>{ SFX.sel(); cosmicHeal(); save(); toast('コズミックのメンバーが全回復した'); };
    g.append(tr,he); body.appendChild(g);
    const party=cosmicParty();
    party.forEach(m=>{ const d=PDEF[m.id];
      const ex=(m.id==='uesugi'&&C.uEx)?C.uEx:exOf(m);
      const sk=skillsOf(m).map(id=>`<p>・${esc(SK[id].n)}（正気${SK[id].mp||0}）<span class="q">${esc(SK[id].d||'')}</span></p>`).join('');
      body.appendChild(h('div','card',`<h3>${esc(d.n)}　Lv${m.lv}</h3><div class="tag">${esc(m.id==='uesugi'?'デスゲームの参':d.role)}</div>
        <div class="stats"><span>HP ${m.hp}/${stat(m,'hp')}</span><span>正気 ${m.mp}/${stat(m,'mp')}</span><span>攻撃 ${stat(m,'atk')}</span><span>防御 ${stat(m,'def')}</span></div>${sk}<p>★EX：${esc(SK[ex].n)}</p>`));
    });
  });
}

async function cosmicTraining(){
  const C=cosmicState();
  const pool=['aohei','aoheiS'].concat(C.ep>=3?['gakudan']:[]).concat(C.ep>=4?['jikken']:[]);
  const lv=COSMIC.lv[Math.min(C.ep,4)]-1;
  const n=Math.random()<.4?2:3, ids=[]; for(let i=0;i<n;i++) ids.push(pick(pool));
  const r=await cosmicBattle(ids,{lv,canFlee:true});
  if(r==='lose'){ cosmicHeal(); toast('コズミック教室に運ばれた'); }
  save(); showHub(); cosmicMenu();
}

// ---------- 物語の再生 ----------
async function runCosmic(replayLast){
  const C=cosmicState();
  if(replayLast){ C.ep=COSMIC.ep.length-1; C.step=0; C.replay=1; C.party=C.party.filter(x=>x!=='mabo'); }
  const ep=COSMIC.ep[C.ep];
  show('scene'); buildScene(); skipping=false; setPlace('');
  let place='';
  for(let i=C.step;i<ep.s.length;i++){
    const st=ep.s[i];
    if(Array.isArray(st)){ await say(st[0],st[1]); continue; }
    switch(st.t){
      case 'title': await chapterTitle(st.a,st.b); break;
      case 'place': place=st.v; setPlace(st.v); break;
      case 'fx': if(!skipping) redFlash(); break;
      case 'join': if(!C.party.includes(st.id)){
          if(!C.m[st.id]) C.m[st.id]=mkMember(st.id,S.party.find(m=>m.id==='uesugi').lv);
          C.party.push(st.id); SFX.lv(); } break;
      case 'leave': C.party=C.party.filter(x=>x!==st.id); break;
      case 'learn': { const u=S.party.find(m=>m.id==='uesugi'); u.extra=u.extra||[]; if(!u.extra.includes(st.id)) u.extra.push(st.id); break; }
      case 'learnEx': C.uEx=st.id; break;
      case 'heal': cosmicHeal(); SFX.heal(); break;
      case 'battle': {
        skipping=false; C.step=i; save();
        const guest=st.guest==='tomozo'?COSMIC_GUEST_TOMOZO:st.guest==='mabo'?COSMIC_GUEST_MABO:null;
        const r=await cosmicBattle(st.e,{boss:!!st.boss,guest});
        if(r==='lose'){ cosmicHeal(); save(); show('scene'); buildScene(); setPlace('コズミック教室');
          await say('Dr.ツジモト','回収したわ。データは取れたから、もう一度行きなさい。'); showHub(); cosmicMenu(); return; }
        show('scene'); buildScene(); setPlace(place); C.step=i+1; save(); break; }
    }
  }
  // 話のクリア
  cosmicHeal();
  const last=C.ep===COSMIC.ep.length-1;
  if(last){
    const first=!C.clear; C.clear=(C.clear||0)+1;
    if(first && !C.replay){ S.gold+=5000; addItem('kokumin',3); addItem('rumando',3);
      await say('','COSMIC編クリア！\n5000円・国民栄誉賞×3・ルマンド×3 を手に入れた。'); }
    C.ep=COSMIC.ep.length; delete C.replay;
  } else { C.ep++; toast(`${ep.a}クリア！`); }
  C.step=0; save(); showHub(); cosmicMenu();
}
