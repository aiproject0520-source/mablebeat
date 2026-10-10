// ================= バトル =================
let B=null;
function refStats(L){ return {HP:60+9*(L-1),ATK:12+3*(L-1),DEF:8+2*(L-1),SPD:10+2*(L-1)}; }
function mkEnemy(id,lvOv,psize){
  const d=E[id], L=lvOv||d.lv, r=refStats(L), m=Object.assign({hp:1,atk:1,def:1,spd:1,exp:1},d.m);
  const def=Math.round(r.DEF*.8*m.def), atk=Math.round((.15*r.HP+.6*r.DEF)*m.atk);
  const hp=Math.round(Math.max(8,r.ATK-.6*def)*3*m.hp*(.55+.15*psize)*(d.boss?.8:1));
  return {id,d,n:d.n,sub:d.sub,g:d.g,c:d.c,boss:!!d.boss,lv:L,hp,max:hp,atk,def,spd:Math.round(r.SPD*m.spd),
    exp:Math.round((.8*L*L+6)*m.exp*(d.boss?5:1)),gold:Math.round((3+L*2)*(d.boss?5:1)),_b:{buffs:{},st:{}},lowDone:false,enemy:true};
}
// 戦闘用ステータス
function base(c,k){ return c.enemy? c[k] : stat(c,k); }
function bs(c,k){ const b=c._b.buffs[k]; return base(c,k)*(b?b.v:1); }
function maxHp(c){ return c.enemy?c.max:stat(c,'hp'); }
function nm(c){ return c.enemy?c.n:PDEF[c.id].n; }
function alive(list){ return list.filter(c=>c.hp>0); }
function critRate(c){ const b=c._b.buffs.crit; return .07+(b?b.v:0); }

function startBattle(ids,opt={}){
  return new Promise(async resolve=>{
    const psize=S.party.length;
    S.party.forEach(m=>{ m._b={buffs:{},st:{}}; });
    B={en:ids.map(id=>mkEnemy(id,opt.lv,psize)),boss:!!opt.boss,guest:opt.guest||null,canFlee:!!opt.canFlee&&!opt.boss,resolve,done:false};
    // 同名の敵に A/B を付ける
    const cnt={}; B.en.forEach(e=>{cnt[e.n]=(cnt[e.n]||0)+1;}); const seen={};
    B.en.forEach(e=>{ if(cnt[e.n]>1){ seen[e.n]=(seen[e.n]||0)+1; e.n=e.n+'ABCD'[seen[e.n]-1]; } });
    show('battle'); buildBattle();
    const first=B.en[0];
    await msg(B.en.length>1?`${B.en.map(e=>e.n).join('、')} があらわれた！`:`${first.n} があらわれた！`,'',700);
    if(first.d.i) await msg(`${first.n}「${first.d.i}」`,'',1400);
    if(B.guest) await msg(`${B.guest.n} が助太刀に来た！`,'',900);
    loop();
  });
}

function buildBattle(){
  const bt=$('#battle'); bt.innerHTML='';
  const en=h('div','enemies'); en.id='enemies';
  B.en.forEach((e,i)=>{ const c=h('div','en'+(e.boss?' boss':''));
    c.dataset.i=i; c.innerHTML=`<div class="gl" style="color:${e.c}">${esc(e.g)}</div><div class="nm">${esc(e.n)}</div><div class="sub">${esc(e.sub)}</div><div class="bar hp"><i></i></div><div class="st"></div>`;
    en.appendChild(c); });
  const log=h('div','log'); log.id='log'; log.onclick=()=>{ if(logTap) logTap(); };
  const party=h('div','party'); party.id='party';
  S.party.forEach((m,i)=>{ const c=h('div','pc'); c.dataset.i=i; party.appendChild(c); });
  const cmd=h('div','cmdwrap'); cmd.id='cmd';
  bt.append(en,log,party,cmd);
  refresh();
}
function refresh(active){
  B.en.forEach((e,i)=>{ const c=document.querySelector(`.en[data-i="${i}"]`); if(!c) return;
    c.querySelector('.bar i').style.width=Math.max(0,e.hp/e.max*100)+'%';
    c.classList.toggle('dead',e.hp<=0); c.querySelector('.st').textContent=stText(e); });
  S.party.forEach((m,i)=>{ const c=document.querySelector(`.pc[data-i="${i}"]`); if(!c) return;
    c.classList.toggle('act',active===m); c.classList.toggle('down',m.hp<=0);
    c.innerHTML=`<div class="row"><span class="nm">${esc(PDEF[m.id].n)}</span><span>Lv${m.lv}</span></div>
     <div class="row"><span>HP</span><span>${m.hp}/${stat(m,'hp')}</span></div><div class="bar hp"><i style="width:${m.hp/stat(m,'hp')*100}%"></i></div>
     <div class="row" style="margin-top:3px"><span style="color:var(--blue)">正気 ${m.mp}</span><span style="color:var(--red)">EX ${m.eg}%</span></div><div class="bar eg"><i style="width:${m.eg}%"></i></div>
     <div class="st">${stText(m)}</div>`; });
}
const STN={confuse:'混乱',seal:'封印',sleep:'睡眠',taunt:'挑発',evade:'回避'};
function stText(c){ if(!c._b) return ''; const a=[]; for(const k in c._b.st) if(c._b.st[k]>0) a.push(STN[k]);
  for(const k in c._b.buffs){ const b=c._b.buffs[k]; if(k==='crit') a.push('会心↑'); else a.push(({atk:'攻',def:'防',spd:'速'})[k]+(b.v>1?'↑':'↓')); }
  return a.join(' '); }

let logTap=null;
function msg(q,s='',ms=900){
  const log=$('#log'); if(!log) return Promise.resolve();
  log.innerHTML=`<div class="q">${esc(q)}</div>${s?`<div class="s">${esc(s)}</div>`:''}`;
  return new Promise(r=>{ const t=setTimeout(()=>{logTap=null;r();},FAST?ms*.35:ms); logTap=()=>{clearTimeout(t);logTap=null;r();}; });
}
function elOf(c){ if(c.enemy) return document.querySelector(`.en[data-i="${B.en.indexOf(c)}"]`); return document.querySelector(`.pc[data-i="${S.party.indexOf(c)}"]`); }
function popNum(c,txt,cls){ const e=elOf(c); if(!e) return; const p=h('div','pop-num'+(cls?' '+cls:''),esc(txt)); e.appendChild(p); setTimeout(()=>p.remove(),950); }
function shake(c){ const e=elOf(c); if(!e) return; const t=c.enemy?e.querySelector('.gl'):e; t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); }

// ---------- ダメージ・回復 ----------
async function damage(att,tgt,pow,opt={}){
  if(tgt.hp<=0) return 0;
  if(tgt._b.st.evade>0 && Math.random()<.5){ popNum(tgt,'MISS','miss'); await msg(`${nm(tgt)} はどろろんとかわした！`,'',600); return 0; }
  const A=bs(att,'atk'), D=opt.pierce?0:bs(tgt,'def');
  const crit=Math.random()<critRate(att);
  let v=A*pow*rnd(.9,1.1);
  v = crit? v*1.5 : v-D*.6;
  v=Math.max(v,A*pow*.15);
  if(tgt._guard) v*=.5;
  v=Math.max(1,Math.round(v));
  tgt.hp=Math.max(0,tgt.hp-v);
  SFX.hit(); shake(tgt); popNum(tgt,v);
  if(!tgt.enemy){ tgt.eg=Math.min(100,tgt.eg+Math.round(v/maxHp(tgt)*55)); const r=$('#battle'); r.classList.remove('flashred'); void r.offsetWidth; r.classList.add('flashred'); }
  if(!att.enemy && att!==tgt) att.eg=Math.min(100,att.eg+6);
  if(tgt._b.st.sleep>0 && tgt.enemy) tgt._b.st.sleep=0;
  refresh();
  await msg(`${nm(tgt)} に ${v} のダメージ！`,crit?'会心の一撃！':'',crit?800:560);
  await afterHit(tgt);
  return v;
}
async function afterHit(t){
  if(t.enemy){
    if(t.hp<=0){ await enemyDown(t); return; }
    if(!t.lowDone && t.d.low && t.hp<t.max*.35){ t.lowDone=true; const L=t.d.low;
      await msg(`${t.n}「${L.l}」`,'',1500);
      if(L.into){ redFlash(); const idx=B.en.indexOf(t); const ne=mkEnemy(L.into,null,S.party.length); B.en[idx]=ne; buildBattle();
        await msg(`${ne.n}（${ne.sub}）に変貌した！`,'',900); if(ne.d.i) await msg(`${ne.n}「${ne.d.i}」`,'',1300); }
      else if(L.buff){ t.atk=Math.round(t.atk*L.buff); await msg(`${t.n} の攻撃力が上がった！`,'',700); }
    }
  } else if(t.hp<=0){ refresh(); await msg(`${nm(t)} は倒れた……`,'',800); }
}
async function enemyDown(e){
  refresh(); S.dex[e.id]=1;
  if(e.d.d) await msg(`${e.n}「${e.d.d}」`,'',1500);
  await msg(`${e.n} をたおした！`,'',600);
}
async function heal(t,ratio){
  if(t.hp<=0) return;
  const v=Math.round(maxHp(t)*ratio); t.hp=Math.min(maxHp(t),t.hp+v); SFX.heal(); popNum(t,'+'+v,'heal'); refresh();
  await msg(`${nm(t)} のHPが ${v} 回復した`,'',520);
}
function addBuff(t,k,v,turns){ const cur=t._b.buffs[k];
  if(k==='crit'){ t._b.buffs.crit={v,t:turns}; return; }
  t._b.buffs[k]={v:cur?Math.max(.3,Math.min(2.5,cur.v*v)):v,t:turns}; }
async function addSt(t,k,ch,turns){
  if(t.hp<=0) return false;
  if(t.enemy&&t.boss) ch*=.5;
  if(Math.random()<ch){ t._b.st[k]=Math.max(t._b.st[k]||0,turns); refresh(); await msg(`${nm(t)} は${STN[k]}状態になった！`,'',650); return true; }
  await msg(`${nm(t)} には効かなかった`,'',500); return false;
}

// ---------- 味方のスキル・アイテム ----------
async function useEffect(user,eff,target,label){
  if(eff.l) await msg(`${nm(user)}「${eff.l}」`,label||'',1300);
  else if(label) await msg(label,'',650);
  const ens=()=>alive(B.en);
  let tg=[];
  if(eff.tg==='enemy'){ tg=[target&&target.hp>0?target:pick(ens())]; }
  else if(eff.tg==='enemies') tg=ens();
  else if(eff.tg==='ally') tg=[target];
  else if(eff.tg==='allies') tg=eff.revive?S.party.slice():alive(S.party);
  else if(eff.tg==='self') tg=[user];
  else if(eff.tg==='dead') tg=[target];
  tg=tg.filter(Boolean);

  if(eff.spacha){ const spend=Math.max(10,Math.floor(S.gold*.1)); if(S.gold<10){ await msg('お金がない！ クレカ凍結されてるんだが！？','',900); return; }
    S.gold-=spend; await msg(`${spend}円をスパチャした！`,'',600);
    await damage(user,tg[0],1+Math.min(3.5,spend/(user.lv*4))); return; }

  let gambleWin=null;
  if(eff.gamble){ gambleWin=Math.random()<eff.gamble.p;
    if(!gambleWin){ if(eff.gamble.lose>0){ await msg('また負け！ また負け！ 人生大負け！！','',800); const v=Math.round(maxHp(user)*eff.gamble.lose); user.hp=Math.max(1,user.hp-v); popNum(user,v); shake(user); refresh(); }
      else await msg('外れた。今やチリ紙よりも意味を持たない紙切れだ……','',900);
      return; }
    await msg('差した！！ 差したぞぉぉおお！','',650); }

  for(const t of tg){
    if(B.done) break;
    if(eff.revive && t.hp<=0){ t.hp=Math.round(maxHp(t)*eff.revive); SFX.heal(); refresh(); await msg(`${nm(t)} が復活した！`,'',700); if(eff.tg==='dead') continue; }
    if(eff.dmg!=null){ const hits=eff.hits||1; for(let k=0;k<hits;k++){ if(t.hp<=0) break; const p=Array.isArray(eff.dmg)?rnd(eff.dmg[0],eff.dmg[1]):eff.dmg; await damage(user,t,p,{pierce:eff.pierce}); if(checkEnd()) return; } }
    if(gambleWin){ await damage(user,t,eff.gamble.win); if(checkEnd()) return; }
    if(eff.heal && t.hp>0) await heal(t,eff.heal);
    if(eff.mpheal){ t.mp=Math.min(stat(t,'mp'),t.mp+eff.mpheal); refresh(); await msg(`${nm(t)} の正気が ${eff.mpheal} 回復した`,'',520); }
    if(eff.buff){ for(const k in eff.buff) addBuff(t,k,eff.buff[k],eff.t||3); refresh(); await msg(`${nm(t)} の${Object.keys(eff.buff).map(k=>({atk:'攻撃',def:'防御',spd:'素早さ',crit:'会心率'})[k]).join('・')}が上がった！`,'',600); }
    if(eff.deb && t.hp>0){ for(const k in eff.deb) addBuff(t,k,eff.deb[k],eff.t||3); refresh(); await msg(`${nm(t)} の${Object.keys(eff.deb).map(k=>({atk:'攻撃',def:'防御'})[k]).join('・')}が下がった！`,'',600); }
    if(eff.st && t.hp>0) await addSt(t,eff.st.k,eff.st.ch,eff.st.t);
    if(eff.evade){ t._b.st.evade=eff.evade; refresh(); await msg(`${nm(t)} はどろろんの構えをとった`,'',600); }
    if(eff.taunt){ t._b.st.taunt=eff.taunt; refresh(); }
    if(eff.sleep){ t._b.st.sleep=eff.sleep; refresh(); await msg(`${nm(t)} は眠りについた`,'',600); }
  }
  if(eff.recoil){ const v=Math.round(maxHp(user)*eff.recoil); user.hp=Math.max(1,user.hp-v); popNum(user,v); refresh(); await msg(`反動で ${nm(user)} は ${v} のダメージ`,'',700); }
}

// ---------- 敵の行動 ----------
function pickAct(e){ const acts=e.d.acts, tot=acts.reduce((s,a)=>s+(a.w||1),0); let r=Math.random()*tot; for(const a of acts){ r-=(a.w||1); if(r<=0) return a; } return acts[0]; }
function pickAlly(){ const a=alive(S.party); const t=a.filter(m=>m._b.st.taunt>0); if(t.length&&Math.random()<.75) return t[0]; return pick(a); }
function quote(e,l){ return /^[（『]/.test(l)? `${e.n}${l}` : `${e.n}「${l}」`; }
async function enemyAct(e){
  if(!alive(S.party).length) return;
  if(e._b.st.seal>0){ await msg(`${e.n} は封じられていて動けない`,'',600); return; }
  if(e._b.st.sleep>0){ await msg(`${e.n} は眠っている`,'',600); return; }
  if(e._b.st.confuse>0 && Math.random()<.5){ const t=pick(alive(B.en)); await msg(`${e.n} はわけがわからなくなっている！`,'',600); await damage(e,t,.9); return; }
  const a=pickAct(e);
  await msg(quote(e,a.l),'',a.l.length>40?1700:1100);
  switch(a.k){
    case 'atk': await damage(e,pickAlly(),a.p); break;
    case 'all': for(const t of alive(S.party)){ await damage(e,t,a.p*.8); if(checkEnd()) return; } break;
    case 'multi': for(let i=0;i<a.h;i++){ const t=pickAlly(); if(!t) break; await damage(e,t,a.p); if(checkEnd()) return; } break;
    case 'heal': { const tg=a.ally?alive(B.en):[e]; for(const t of tg) await heal(t,a.p); break; }
    case 'buff': { const tg=a.ally?alive(B.en):[e]; tg.forEach(t=>addBuff(t,a.stat,a.v,3)); refresh(); await msg(`${a.ally?'敵全体':e.n} の${({atk:'攻撃',def:'防御',spd:'素早さ'})[a.stat]}が上がった！`,'',600); break; }
    case 'debuff': for(const t of alive(S.party)) addBuff(t,a.stat,a.v,3); refresh(); await msg(`味方全員の${({atk:'攻撃',def:'防御'})[a.stat]}が下がった！`,'',650); break;
    case 'st': { const tg=a.all?alive(S.party):[pickAlly()]; for(const t of tg) await addSt(t,a.st,a.ch,a.t); break; }
    case 'skip': break;
    case 'ko': e.hp=0; refresh(); S.dex[e.id]=1; await msg(`${e.n} は勝手に倒れた……`,S.party.some(m=>m.id==='doron')?'Mr.どろろん「あっ！ 死んでるよこれ！ なかなか見れないよこれ！」':'',1200); break;
    case 'selfhit': { const v=Math.round(e.max*.12); e.hp=Math.max(1,e.hp-v); shake(e); popNum(e,v); refresh(); await msg(`${e.n} は自分を殴った！ ${v} のダメージ`,'',700); await afterHit(e); break; }
    case 'steal': { const v=Math.min(S.gold,Math.round(e.lv*3+rnd(0,10))); S.gold-=v; await msg(`${v}円 持っていかれた！`,'',700); break; }
    case 'flee': e.hp=0; e.fled=1; refresh(); S.dex[e.id]=1; await msg(`${e.n} は帰っていった`,'',800); break;
    case 'boom': { for(const t of alive(S.party)){ await damage(e,t,a.p*.8); if(checkEnd()) return; }
      if(!a.keep){ e.hp=0; refresh(); S.dex[e.id]=1; await msg(`${e.n} は弾け飛んだ`,'',700); } break; }
  }
}

// ---------- 勝敗 ----------
function checkEnd(){ if(B.done) return true;
  if(alive(B.en).length===0){ B.done='win'; return true; }
  if(alive(S.party).length===0){ B.done='lose'; return true; }
  return false; }

async function finish(){
  const r=B.done; $('#cmd').innerHTML='';
  S.party.forEach(m=>{ delete m._b; delete m._guard; });
  if(r==='flee'){ B.resolve('flee'); return; }
  if(r==='lose'){ await msg('パーティは全滅した……','',1400); B.resolve('lose'); return; }
  // 勝利
  const eLv=B.en.reduce((s,e)=>s+e.lv,0)/B.en.length, pLv=S.party.reduce((s,m)=>s+m.lv,0)/S.party.length;
  const mul=1+Math.max(0,eLv-pLv)*.35;
  const exp=Math.round(B.en.filter(e=>!e.fled).reduce((s,e)=>s+e.exp,0)*mul + B.en.filter(e=>e.fled).reduce((s,e)=>s+e.exp*.5,0));
  const gold=Math.round(B.en.reduce((s,e)=>s+e.gold,0)*rnd(.9,1.2));
  S.gold+=gold;
  SFX.lv();
  await msg(`計測完了！ ${exp} の経験値と ${gold}円 を手に入れた`,'',1300);
  for(const m of S.party){
    if(m.hp<=0) m.hp=1;
    m.exp+=exp; let up=false;
    while(m.exp>=nextExp(m.lv)){ m.exp-=nextExp(m.lv); m.lv++; up=true; }
    if(up){ const before=skillsOf({id:m.id,lv:m.lv-1});
      m.hp=Math.min(stat(m,'hp'),m.hp+Math.round(stat(m,'hp')*.3)); m.mp=Math.min(stat(m,'mp'),m.mp+Math.round(stat(m,'mp')*.3));
      refresh(); SFX.lv(); await msg(`${PDEF[m.id].n} はレベル${m.lv}になった！`,'えぐさ①〜④が上がった',1000);
      for(const s of PDEF[m.id].learn) if(s[0]<=m.lv && s[0]>m.lv-5 && !before.includes(s[1]) && skillsOf(m).includes(s[1])) await msg(`${PDEF[m.id].n} は「${SK[s[1]].n}」をおぼえた！`,'',1000);
    }
  }
  if(Math.random()<.18){ const id=pick(['purin','natto','baken','purin','salt']); addItem(id,1); await msg(`${IT[id].n} を拾った`,'',800); }
  B.resolve('win');
}

// ---------- メインループ ----------
async function loop(){
  while(!B.done){
    const plan=[];
    for(const m of S.party){
      if(m.hp<=0) continue;
      m._guard=false;
      if(m._b.st.sleep>0||m._b.st.seal>0){ plan.push({who:m,type:'none'}); continue; }
      if(m._b.st.confuse>0&&Math.random()<.5){ plan.push({who:m,type:'confused'}); continue; }
      const c=await command(m);
      if(c.type==='flee'){
        if(Math.random()<.65){ await msg('うまく逃げ切れた！','',700); B.done='flee'; break; }
        await msg('逃げられなかった！','',700); plan.length=0; break;
      }
      if(c.type==='guard') m._guard=true;
      plan.push(c);
    }
    if(B.done) break;
    $('#cmd').innerHTML=''; refresh();
    const order=[...plan.map(p=>({c:p.who,p,s:bs(p.who,'spd')*rnd(.8,1.2)})),...alive(B.en).map(e=>({c:e,s:bs(e,'spd')*rnd(.8,1.2)}))].sort((a,b)=>b.s-a.s);
    for(const o of order){
      if(B.done||checkEnd()) break;
      if(o.c.hp<=0) continue;
      if(o.c.enemy) await enemyAct(o.c);
      else await doPlan(o.p);
      checkEnd();
    }
    if(!B.done && B.guest && alive(B.en).length){ const t=pick(alive(B.en)); await msg(`${B.guest.n}「${pick(B.guest.l)}」`,'',1000); SFX.kan(); setTimeout(SFX.kan,90); setTimeout(SFX.kan,180);
      const fake={enemy:false,_b:{buffs:{},st:{}},id:'guest',atk:0}; const L=Math.max(partyLv(),20); const A=refStats(L).ATK*B.guest.p;
      const v=Math.max(1,Math.round(A*rnd(.9,1.1)-t.def*.6)); t.hp=Math.max(0,t.hp-v); shake(t); popNum(t,v); refresh(); await msg(`${t.n} に ${v} のダメージ！`,'',600); await afterHit(t); checkEnd(); }
    // ターン終了
    [...S.party,...B.en].forEach(c=>{ if(!c._b) return;
      for(const k in c._b.st){ if(c._b.st[k]>0) c._b.st[k]--; if(c._b.st[k]<=0) delete c._b.st[k]; }
      for(const k in c._b.buffs){ c._b.buffs[k].t--; if(c._b.buffs[k].t<=0) delete c._b.buffs[k]; } });
    refresh();
  }
  await finish();
}

async function doPlan(p){
  const m=p.who;
  if(p.type==='none'){ await msg(`${nm(m)} は${m._b.st.sleep>0?'眠っている……「あとじゅっぷん…」':'封じられて動けない'}`,'',650); return; }
  if(p.type==='confused'){ await msg(`${nm(m)}「1足す1とは？ おっほーん」`,'混乱して味方を攻撃した！',900); await damage(m,pick(alive(S.party)),.7); return; }
  if(p.type==='guard'){ m.eg=Math.min(100,m.eg+8); await msg(`${nm(m)} は身を守っている`,'',500); return; }
  if(p.type==='skill'){ const sk=SK[p.sk];
    if(sk.ex){ if(m.eg<100) return; m.eg=0; redFlash(); }
    else { if(m.mp<(sk.mp||0)){ await msg(`${nm(m)} は正気が足りない！`,'',600); return; } m.mp-=(sk.mp||0); }
    refresh();
    const label = p.sk===PDEF[m.id].atk? '' : (sk.ex?`★EX ${sk.n}`:sk.n);
    if(p.sk===PDEF[m.id].atk) await msg(`${nm(m)} の${sk.n}！`,'',450);
    await useEffect(m,p.sk===PDEF[m.id].atk?{...sk,l:null}:sk,p.target,label);
    if(!sk.ex) m.eg=Math.min(100,m.eg+6); refresh(); return; }
  if(p.type==='item'){ const it=IT[p.it]; if(!(S.items[p.it]>0)){ await msg('もう持っていない','',500); return; }
    S.items[p.it]--; await useEffect(m,it,p.target,`${nm(m)} は ${it.n} を使った！`); }
}

// ---------- コマンド入力 ----------
function command(m){
  return new Promise(resolve=>{
    refresh(m);
    const cmd=$('#cmd');
    const top=()=>{
      cmd.innerHTML=`<div class="cmdhead"><span>${esc(PDEF[m.id].n)} のこうどう</span><span>正気 ${m.mp}/${stat(m,'mp')}</span></div>`;
      const g=h('div','cmd');
      const b=(l,fn,cls,dis)=>{ const x=h('button','btn'+(cls?' '+cls:''),l); if(dis) x.disabled=true; x.onclick=()=>{SFX.sel(); fn();}; g.appendChild(x); };
      b('こうげき',()=>target('enemy',t=>resolve({who:m,type:'skill',sk:PDEF[m.id].atk,target:t}),top));
      b('スキル',skills); b('アイテム',items);
      b('ぼうぎょ',()=>resolve({who:m,type:'guard'}));
      const ex=SK[exOf(m)]; b(m.eg>=100?'★EX':`EX ${m.eg}%`,()=>useSk(exOf(m)),'r',m.eg<100);
      b('にげる',()=>resolve({who:m,type:'flee'}),'',!B.canFlee);
      cmd.appendChild(g);
    };
    const useSk=id=>{ const sk=SK[id]; if(['enemy','ally','dead'].includes(sk.tg)) target(sk.tg,t=>resolve({who:m,type:'skill',sk:id,target:t}),skills); else resolve({who:m,type:'skill',sk:id}); };
    const skills=()=>{
      cmd.innerHTML=`<div class="cmdhead"><span>スキル</span><span>正気 ${m.mp}</span></div>`; const l=h('div','list');
      skillsOf(m).forEach(id=>{ const sk=SK[id]; const x=h('button','btn',`<span>${esc(sk.n)}<br><small>${esc(sk.d||'')}</small></span><small>正気${sk.mp||0}</small>`); if(m.mp<(sk.mp||0)) x.disabled=true; x.onclick=()=>{SFX.sel(); useSk(id);}; l.appendChild(x); });
      const back=h('button','btn','もどる'); back.onclick=top; l.appendChild(back); cmd.appendChild(l);
    };
    const items=()=>{
      cmd.innerHTML=`<div class="cmdhead"><span>アイテム</span><span class="money">${S.gold}円</span></div>`; const l=h('div','list');
      const have=Object.entries(S.items).filter(([k,n])=>n>0);
      if(!have.length) l.appendChild(h('p','tag','なにも持っていない'));
      have.forEach(([id,n])=>{ const it=IT[id]; const x=h('button','btn',`<span>${esc(it.n)}<br><small>${esc(it.d)}</small></span><small>×${n}</small>`);
        x.onclick=()=>{ SFX.sel(); if(['enemy','ally','dead'].includes(it.tg)) target(it.tg,t=>resolve({who:m,type:'item',it:id,target:t}),items); else resolve({who:m,type:'item',it:id}); }; l.appendChild(x); });
      const back=h('button','btn','もどる'); back.onclick=top; l.appendChild(back); cmd.appendChild(l);
    };
    const target=(kind,done,back)=>{
      const cands = kind==='enemy'? alive(B.en) : kind==='dead'? S.party.filter(x=>x.hp<=0) : alive(S.party);
      if(kind==='dead'&&!cands.length){ cmd.innerHTML='<div class="cmdhead"><span>倒れている仲間がいない</span></div>'; const x=h('button','btn','もどる'); x.onclick=back; cmd.appendChild(x); return; }
      if(cands.length===1&&kind==='enemy'){ done(cands[0]); return; }
      cmd.innerHTML=`<div class="cmdhead"><span>${kind==='enemy'?'どの敵に？':'だれに？'}（タップで選ぶ）</span></div>`;
      const els=cands.map(c=>{ const e=elOf(c); e.classList.add('pick'); const f=()=>{ clear(); SFX.sel(); done(c); }; e.onclick=f; return e; });
      const clear=()=>els.forEach(e=>{ e.classList.remove('pick'); e.onclick=null; });
      const x=h('button','btn','もどる'); x.onclick=()=>{ clear(); back(); }; cmd.appendChild(x);
    };
    top();
  });
}
