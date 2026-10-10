// ================= 共通 =================
const $ = s => document.querySelector(s);
function h(tag, cls, html){ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
const esc = s => String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const rnd = (a,b)=>a+Math.random()*(b-a);
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
let FAST=false, SOUND=true, TAPMODE=true, AC=null;
try{ const o=JSON.parse(localStorage.getItem('marblebeat_opt')||'{}'); if('fast' in o)FAST=o.fast; if('sound' in o)SOUND=o.sound; if('tap' in o)TAPMODE=o.tap; }catch(e){}
function saveOpt(){ try{ localStorage.setItem('marblebeat_opt',JSON.stringify({fast:FAST,sound:SOUND,tap:TAPMODE})); }catch(e){} }

function beep(f=880,d=.06,type='square',v=.04){
  if(!SOUND) return;
  try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f;
    g.gain.setValueAtTime(v,AC.currentTime); g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+d+.02);
  }catch(e){}
}
const SFX = {
  hit:()=>{beep(180,.09,'square',.05)}, kan:()=>beep(1500,.05,'triangle',.06),
  heal:()=>{beep(660,.08,'sine');setTimeout(()=>beep(990,.1,'sine'),70)},
  lv:()=>[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.035),i*90)),
  tick:()=>beep(1300,.012,'square',.012), boom:()=>{beep(90,.3,'sawtooth',.06)}, sel:()=>beep(900,.03,'square',.025)
};

function toast(t){ const e=h('div','toast',esc(t)); $('#app').appendChild(e); setTimeout(()=>e.remove(),3800); }
function redFlash(){ const r=$('#redflash'); r.classList.remove('on'); void r.offsetWidth; r.classList.add('on'); SFX.boom(); }
function show(id){ ['title','hub','scene','battle'].forEach(s=>$('#'+s).hidden=(s!==id)); }

// ================= 状態 =================
let S=null;
const SAVEKEY='marblebeat_v1';
function newState(){ return {ch:0,step:0,chk:0,gold:50,items:{purin:2,natto:1},party:[mkMember('uesugi',1)],dex:{},ending:null,karaoke:0}; }
function mkMember(id,lv){ const m={id,lv,exp:0,eg:0,exOv:null}; m.hp=stat(m,'hp'); m.mp=stat(m,'mp'); return m; }
function stat(m,k){ const d=PDEF[m.id]; return Math.floor(d.base[k]+d.grow[k]*(m.lv-1)); }
function skillsOf(m){ return PDEF[m.id].learn.filter(x=>x[0]<=m.lv).map(x=>x[1]); }
function exOf(m){ return m.exOv||PDEF[m.id].ex; }
function nextExp(lv){ return Math.round(3.2*lv*lv+24); }
function partyLv(){ return Math.max(...S.party.map(m=>m.lv)); }
function fullHeal(){ S.party.forEach(m=>{m.hp=stat(m,'hp'); m.mp=stat(m,'mp');}); }
function save(){ try{ localStorage.setItem(SAVEKEY,JSON.stringify(S)); }catch(e){} }
function loadSave(){ try{ const t=localStorage.getItem(SAVEKEY); return t?JSON.parse(t):null; }catch(e){ return null; } }
function addItem(id,n){ S.items[id]=(S.items[id]||0)+n; }

// ================= タイトル =================
function boot(){
  try{ window.claude?.hot?.snapshot?.(()=>({S})); }catch(e){}
  let hot=null; try{ hot=window.claude?.hot?.data; }catch(e){}
  const saved = (hot&&hot.S) || loadSave();
  $('#btnCont').disabled=!saved;
  if(saved) $('#contInfo').textContent = (saved.ch>8?'クリア済':(CH[saved.ch]?CH[saved.ch].a:''))+' / Lv'+Math.max(...saved.party.map(m=>m.lv));
  $('#btnNew').onclick=()=>{ SFX.sel(); S=newState(); save(); runStory(); };
  $('#btnCont').onclick=()=>{ SFX.sel(); S=saved; showHub(); };
  show('title');
}

// ================= シーン =================
let skipping=false;
function buildScene(){
  const sc=$('#scene'); sc.innerHTML='';
  const stage=h('div','stage'); stage.id='stage';
  stage.append(h('div','place'), h('div','portrait'));
  stage.querySelector('.place').id='place'; stage.querySelector('.portrait').id='portrait';
  const sk=h('button','btn skip','スキップ ≫'); sk.id='skipBtn'; sk.onclick=e=>{e.stopPropagation(); skipping=true; if(tapResolve) tapResolve();};
  stage.appendChild(sk);
  const ch=h('div','choices'); ch.id='choices';
  const dlg=h('div','dialog'); dlg.id='dialog';
  dlg.innerHTML='<div class="who" id="who"></div><div class="txt" id="txt"></div><div class="next">▼ TAP</div>';
  dlg.onclick=()=>{ if(tapResolve) tapResolve(); };
  sc.append(stage,ch,dlg);
}
let tapResolve=null;
function waitTap(){ return new Promise(r=>{ tapResolve=()=>{tapResolve=null; r();}; }); }

async function say(spk,text){
  const who=$('#who'), txt=$('#txt'), por=$('#portrait'), dlg=$('#dialog');
  dlg.hidden=false;
  if(spk){ who.hidden=false; who.textContent=spk; const p=SPK[spk]||[spk[0],'#efeee4'];
    por.hidden=false; por.textContent=p[0]; por.style.color=p[1]; por.classList.remove('pop'); void por.offsetWidth; por.classList.add('pop');
    txt.className='txt';
  } else { who.hidden=true; por.hidden=true; txt.className='txt nar'; }
  if(skipping){ txt.textContent=text; await sleep(10); return; }
  // タイプライター
  let done=false, i=0; txt.textContent='';
  const full=text;
  const p=new Promise(r=>{ tapResolve=()=>{ done=true; }; });
  while(i<full.length && !done){ txt.textContent=full.slice(0,++i); if(i%3===0) SFX.tick(); await sleep(FAST?6:22); }
  txt.textContent=full;
  await sleep(60);
  await waitTap();
}

async function chapterTitle(a,b){
  const st=$('#stage'); $('#portrait').hidden=true; $('#dialog').hidden=true;
  const t=h('div','chtitle',`<div class="a">${esc(a)}</div><div class="b">${esc(b)}</div><div class="tag">TAP</div>`);
  st.appendChild(t); SFX.lv();
  await new Promise(r=>{ t.onclick=r; setTimeout(()=>{ if(skipping) r(); },10); });
  t.remove(); $('#dialog').hidden=false;
}

async function choice(step){
  skipping=false;
  const box=$('#choices');
  while(true){
    await sayNoWait('',step.q);
    const sel = await new Promise(r=>{ box.innerHTML=''; step.o.forEach(o=>{ const b=h('button','btn',esc(o.l)); b.onclick=()=>{SFX.sel(); r(o);}; box.appendChild(b); }); });
    box.innerHTML='';
    for(const s of sel.s) await say(s[0],s[1]);
    if(!sel.bad) return;
  }
}
async function sayNoWait(spk,text){
  $('#who').hidden=true; $('#portrait').hidden=true; const t=$('#txt'); t.className='txt'; t.textContent=text;
}

// ================= ストーリー進行 =================
async function runStory(){
  if(S.ch>8){ return endingChoice(); }
  const ch=CH[S.ch];
  show('scene'); buildScene(); skipping=false;
  let place=''; $('#place').textContent='';
  for(let i=S.step;i<ch.s.length;i++){
    const st=ch.s[i];
    if(Array.isArray(st)){ await say(st[0],st[1]); continue; }
    switch(st.t){
      case 'title': await chapterTitle(st.a,st.b); break;
      case 'place': place=st.v; $('#place').textContent=st.v; break;
      case 'fx': if(!skipping) redFlash(); break;
      case 'join': { if(!S.party.find(m=>m.id===st.id)){ const m=mkMember(st.id,partyLv()); S.party.push(m);} SFX.lv(); break; }
      case 'learn': { const m=S.party.find(x=>x.id===st.id); if(m) m.exOv=st.ex; break; }
      case 'gold': S.gold+=st.n; toast(`${st.n}円 手に入れた`); break;
      case 'item': addItem(st.id,st.n); toast(`${IT[st.id].n} ×${st.n} 手に入れた`); break;
      case 'choice': await choice(st); break;
      case 'hub': S.step=i+1; S.chk=i+1; save(); showHub(); return;
      case 'end': S.step=i; save(); return endingChoice();
      case 'battle': {
        skipping=false;
        const r = await startBattle(st.e,{boss:!!st.boss,guest:st.guest,story:true});
        if(r==='lose'){ S.step=S.chk; save(); return gameOver(); }
        show('scene'); buildScene(); $('#place').textContent=place; S.step=i+1; save();
        break;
      }
    }
  }
  // 章クリア
  S.ch++; S.step=0; S.chk=0; fullHeal(); save();
  toast('章クリア！ HPと正気が全回復した');
  showHub();
}

async function endingChoice(){
  show('scene'); buildScene(); skipping=false;
  $('#place').textContent='徳川の蔵';
  await say('米津','さあ、回しなさい。ダイヤルをね。どこに合わせるかはね、えー、君たちが決めることなんですね。');
  const box=$('#choices');
  await sayNoWait('','えぐさ調節機のダイヤルを……');
  const k = await new Promise(r=>{ box.innerHTML='';
    [['zero','0にする（えぐさのない世界）'],['just','ちょうどいいところに合わせる'],['max','全開のままにする']].forEach(([id,l])=>{ const b=h('button','btn',l); b.onclick=()=>{SFX.sel(); r(id);}; box.appendChild(b); }); });
  box.innerHTML='';
  for(const st of ENDINGS[k]){
    if(Array.isArray(st)){ await say(st[0],st[1]); continue; }
    if(st.t==='ending'){ await endCard(st.k,st.v,k); }
  }
  S.ch=9; S.ending=S.ending==='TRUE END'?'TRUE END':ENDINGS[k].slice(-1)[0].k; save();
  showHub();
}
async function endCard(k,v,id){
  const st=$('#stage'); $('#portrait').hidden=true; $('#dialog').hidden=true;
  const t=h('div','chtitle',`<div class="a">${esc(k)}</div><div class="b">${esc(v)}</div><p class="tag" style="line-height:1.9;max-width:300px">marble beat<br>原案・ネタ帳：北高の皆さん<br>エグミリティ計測：あなた<br><br>(c)Egmlity(c)</p><div class="tag">TAP</div>`);
  st.appendChild(t); SFX.lv(); await new Promise(r=>t.onclick=r); t.remove(); $('#dialog').hidden=false;
}

async function gameOver(){
  show('scene'); buildScene(); skipping=false;
  $('#place').textContent='ゲームオーバー';
  await say('中神','今LPが１の人。まだまだ大逆転、狙っていって、いいんですよ？');
  await say('','パーティは保健室に運ばれた。');
  fullHeal(); S.gold=Math.floor(S.gold*0.8); save(); showHub();
}

// ================= ハブ =================
function showHub(){
  show('hub'); const hub=$('#hub'); hub.innerHTML='';
  const ch=CH[Math.min(S.ch,8)];
  const head=h('div','hubhead',`<div><div class="tag">北高・エグミリティ計測課</div><h2>${S.ch>8?'すべての章をクリア':esc(ch.a+'　'+ch.b)}</h2></div><div class="money">${S.gold}円</div>`);
  const mp=h('div','mini-party');
  S.party.forEach(m=>{ mp.appendChild(h('div','mpc',`<div class="nm">${esc(PDEF[m.id].n)}</div>Lv${m.lv}<div class="bar hp"><i style="width:${m.hp/stat(m,'hp')*100}%"></i></div><div class="bar mp"><i style="width:${m.mp/stat(m,'mp')*100}%"></i></div>`)); });
  const body=h('div','hubbody');
  const sb=h('button','btn story-btn');
  if(S.ch>8){ sb.innerHTML=`<span class="big">もう一度ダイヤルを回す</span><small>エンディング：${esc(S.ending||'')}</small>`; }
  else { const plv=partyLv(); sb.innerHTML=`<span class="big">${S.step>0?'つづきを進める':'物語をはじめる'}</span><small>${esc(ch.a)}「${esc(ch.b)}」　推奨Lv${ch.lv}　${plv<ch.lv-1?'<span style="color:var(--red)">レベル不足かも</span>':''}</small>`; }
  sb.onclick=()=>{ SFX.sel(); runStory(); };
  const g=h('div','grid2');
  const add=(label,sub,fn,cls)=>{ const b=h('button','btn'+(cls?' '+cls:''),`${label}<small>${sub}</small>`); b.onclick=()=>{SFX.sel(); fn();}; g.appendChild(b); };
  add('見回り','戦闘でLv上げ',patrol);
  add('保健室','全回復・無料',infirmary);
  add('購買','ますみーみ校長',shop);
  add('カラオケ','20円',karaoke);
  add('パーティ','えぐさを見る',partyView);
  add('図鑑',`${Object.keys(S.dex).length}/${Object.keys(E).length}`,dexView);
  body.append(sb,g);
  const opt=h('button','btn','設定 <small>音・速さ・データ</small>'); opt.onclick=settings; body.appendChild(opt);
  hub.append(head,h('hr','chalk-line'),mp,body);
}

async function patrol(){
  const ci=Math.min(S.ch,8), pool=POOL[ci], lv=CH[ci].lv;
  const n = ci===0?1:(Math.random()<.35?1:(Math.random()<.6?2:3));
  const ids=[]; for(let i=0;i<n;i++) ids.push(pick(pool));
  const r=await startBattle(ids,{lv,canFlee:true});
  if(r==='lose') return gameOver();
  save(); showHub();
}

function overlay(title, buildBody){
  const ov=h('div','ov'); const top=h('div','hubhead',`<h2>${esc(title)}</h2>`);
  const close=h('button','btn','閉じる'); close.style.minHeight='40px'; close.onclick=()=>{ ov.remove(); showHub(); };
  top.appendChild(close);
  const body=h('div','body'); ov.append(top,h('hr','chalk-line'),body); $('#app').appendChild(ov);
  buildBody(body,ov); return ov;
}

const WAKE=[
  [['','「そろばん王子くん！ 朝ですよ！？ 早く起きなさい！！？」'],['','「分かったパチー」']],
  [['','「パチンコチ◯コくん！ 早く起きてーー！！！！？」'],['','「分かったパチー」'],['','貧富の差はあれど、そこに変わらぬ物が一つ…']],
  [['千田母','こら圭太起きなさい！！'],['千田','あとじゅっっっっぷぅぅぅぅん！！！']],
  [['','保健室のベッドで休んだ。どこかで「カンカンカン」と音がする。']]
];
function infirmary(){
  fullHeal(); save();
  overlay('保健室',body=>{
    const w=pick(WAKE); w.forEach(([s,t])=>body.appendChild(h('div','card',`${s?`<h3>${esc(s)}</h3>`:''}<p>${esc(t)}</p>`)));
    body.appendChild(h('p','tag','HPと正気が全回復した。'));
  });
  SFX.heal();
}

function shopList(){ const l=['purin','natto','baken']; if(S.ch>=1)l.push('salt'); if(S.ch>=2)l.push('protein'); if(S.ch>=3)l.push('rumando'); return l; }
function shop(){
  overlay('購買',(body,ov)=>{
    const draw=()=>{
      body.innerHTML='';
      body.appendChild(h('div','card',`<h3>ますみーみ校長</h3><p>${esc(pick(['いらっしゃいだえ〜。','超上級国民の購買だえ〜。','エク◯ペディアで予約もできるだえ〜。']))}</p><p class="money">所持金 ${S.gold}円</p>`));
      shopList().forEach(id=>{ const it=IT[id];
        const b=h('button','btn',`<span>${esc(it.n)}<br><small>${esc(it.d)}　所持${S.items[id]||0}</small></span><span class="money">${it.price}円</span>`);
        if(S.gold<it.price) b.disabled=true;
        b.onclick=()=>{ S.gold-=it.price; addItem(id,1); SFX.sel(); save(); draw(); };
        body.appendChild(b); });
    }; draw();
  });
}

function karaoke(){
  overlay('カラオケ',(body)=>{
    const draw=(res)=>{
      body.innerHTML='';
      if(res) body.appendChild(res);
      body.appendChild(h('p','tag',`1曲20円　所持金 ${S.gold}円`));
      [['kimi','君が代'],['hero','歌姫の名曲（ヒーロー）'],['walz','子犬のワルツ（歌詞なし）']].forEach(([k,l])=>{
        const b=h('button','btn',`${l}<small>20円</small>`); if(S.gold<20) b.disabled=true;
        b.onclick=()=>{ S.gold-=20; S.karaoke++; const singer=pick(S.party); let sc=Math.floor(rnd(15,104)); if(Math.random()<.07) sc=Math.floor(rnd(100,121));
          const c=h('div','card'); let txt=`${PDEF[singer.id].n}が歌った。……${sc}点！`, sub='';
          if(k==='kimi'&&sc<30) sub='非国民よねっちゃん「カラオケで君が代は20点っっっ！！！」';
          else if(sc>=100){ sub=k==='kimi'?'上級国民とくにいさん「カラオケで君が代は１００オーバー！！お陰で国民栄誉賞！！」':'100オーバー！ 国民栄誉賞が授与された！'; addItem('kokumin',1); }
          else if(k==='hero') sub='超上級国民ますみーみ「おい歌姫。君だけのための〜？？？………ノリがわるいえ〜。そこは『ヒーロー』だえ〜www」';
          else if(k==='walz') sub='（コニタンの精神が崩壊し、延々と子犬のワルツが流れる）';
          c.innerHTML=`<h3>${esc(txt)}</h3>${sub?`<p>${esc(sub)}</p>`:''}`;
          singer.mp=Math.min(stat(singer,'mp'),singer.mp+10);
          SFX.lv(); save(); draw(c);
        };
        body.appendChild(b);
      });
      body.appendChild(h('p','tag','歌った人の正気が少し回復する。100点以上で国民栄誉賞（復活アイテム）。'));
    }; draw();
  });
}

function partyView(){
  overlay('パーティ',body=>{
    body.appendChild(h('p','tag','エグミリティ評価基準：1.えぐさ 2.えぐさ 3.えぐさ 4.えぐさ'));
    S.party.forEach(m=>{ const d=PDEF[m.id];
      const sk=skillsOf(m).map(id=>`<p>・${esc(SK[id].n)}（正気${SK[id].mp||0}）<span class="q">${esc(SK[id].d||'')}</span></p>`).join('');
      body.appendChild(h('div','card',`<h3>${esc(d.n)}　Lv${m.lv}</h3><div class="tag">${esc(d.role)}　次のLvまで ${nextExp(m.lv)-m.exp}</div>
       <div class="stats"><span>えぐさ①(体力) ${m.hp}/${stat(m,'hp')}</span><span>正気 ${m.mp}/${stat(m,'mp')}</span><span>えぐさ②(攻撃) ${stat(m,'atk')}</span><span>えぐさ③(防御) ${stat(m,'def')}</span><span>えぐさ④(素早さ) ${stat(m,'spd')}</span><span>EXゲージ ${m.eg}%</span></div>
       ${sk}<p>★EX：${esc(SK[exOf(m)].n)}<span class="q">　${esc(SK[exOf(m)].d)}</span></p><p class="q">${esc(d.bio)}</p>`));
    });
    const its=Object.entries(S.items).filter(([k,n])=>n>0).map(([k,n])=>`${IT[k].n}×${n}`).join('　')||'なし';
    body.appendChild(h('div','card',`<h3>もちもの</h3><p>${esc(its)}</p>`));
  });
}

function dexView(){
  overlay('えぐさ図鑑',body=>{
    Object.entries(E).forEach(([id,e])=>{
      if(S.dex[id]){ const q=e.i||e.acts[0].l;
        body.appendChild(h('div','card',`<h3>${esc(e.n)} <span class="tag">${esc(e.sub)}</span></h3><p>${esc(e.dex||'')}</p><p class="q">「${esc(q)}」</p>`)); }
      else body.appendChild(h('div','card','<h3>？？？</h3><p class="q">まだ計測していない</p>'));
    });
  });
}

function settings(){
  overlay('設定',(body)=>{
    const draw=()=>{ body.innerHTML='';
      const s=h('button','btn',`効果音 <small>${SOUND?'ON':'OFF'}</small>`); s.onclick=()=>{SOUND=!SOUND; saveOpt(); draw();};
      const f=h('button','btn',`文字と戦闘の速さ <small>${FAST?'はやい':'ふつう'}</small>`); f.onclick=()=>{FAST=!FAST; saveOpt(); draw();};
      const tp=h('button','btn',`戦闘のセリフ送り <small>${TAPMODE?'タップで進む':'自動で進む'}</small>`); tp.onclick=()=>{TAPMODE=!TAPMODE; saveOpt(); draw();};
      const t=h('button','btn','タイトルへ戻る'); t.onclick=()=>{ document.querySelector('.ov')?.remove(); boot(); };
      const r=h('button','btn r','セーブデータを消す'); let armed=false;
      r.onclick=()=>{ if(!armed){ armed=true; r.innerHTML='本当に消す？ もう一度押すと消えます'; return; }
        try{localStorage.removeItem(SAVEKEY)}catch(e){} document.querySelector('.ov')?.remove(); boot(); };
      // セーブの書き出し・読み込み
      const code=(()=>{ try{ return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }catch(e){ return ''; } })();
      const card=h('div','card','<h3>セーブの引っ越し</h3><p class="q">機種変更やホーム画面アプリの入れ直しの前に、このコードをメモ帳などに保存しておくと進行を戻せます。</p>');
      const out=h('textarea','code'); out.id='saveOut'; out.readOnly=true; out.value=code;
      const cp=h('button','btn y','コードをコピー'); cp.onclick=()=>{ navigator.clipboard.writeText(code).then(()=>{cp.textContent='コピーしました';}).catch(()=>{ out.select(); cp.textContent='選択したのでコピーしてください'; }); };
      const inp=h('textarea','code'); inp.id='saveIn'; inp.placeholder='保存しておいたコードを貼り付け';
      const ld=h('button','btn','コードから読み込む'); const note=h('p','tag','');
      ld.onclick=()=>{ try{ const d=JSON.parse(decodeURIComponent(escape(atob(inp.value.trim())))); if(!d||!d.party) throw 0; S=d; save(); note.textContent='読み込みました。'; setTimeout(()=>{ document.querySelector('.ov')?.remove(); showHub(); },600); }catch(e){ note.textContent='コードが正しくありません。最後まで貼り付けたか確認してください。'; } };
      card.append(out,cp,inp,ld,note);
      body.append(s,f,tp,card,t,r,h('p','tag','進行はこの端末のブラウザに自動保存されます。'));
    }; draw();
  });
}
