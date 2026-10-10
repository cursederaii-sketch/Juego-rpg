// ===== HABILIDADES: Tajo de Onda, movimientos nuevos y Cólera del Juramento (ultimate) =====
// Se engancha sobre el motor con el mismo patrón que animaciones.js: no toca la lógica original.
//
//  · Tajo de Onda  (botón «Onda» / tecla U)  → onda cortante que atraviesa enemigos y frena proyectiles.
//  · Remate        (3.er golpe ligero seguido) → tajo giratorio que golpea a todos a tu alrededor.
//  · Corte fantasma (ligero justo tras esquivar) → estocada con impulso y +50% de daño.
//  · Cólera del Juramento (botón «Cólera» / tecla O) → ultimate de área. Se carga con el Ímpetu
//    (golpear, parar, esquivar y recibir daño) y se mejora en la hoguera con almas (niveles I–IV).

// ---------- ajustes ----------
const SKL={cd:3.2,st:20,dmg:17};            // habilidad: recarga (s), resistencia, daño base
const ULV=[null,                            // ultimate: por nivel, ondas {t:segundo, r:radio, d:daño base}
 {r:'I',  cost:0,    w:[{t:.5,r:60,d:40}],                                                   txt:'Una onda de choque a tu alrededor.'},
 {r:'II', cost:500,  w:[{t:.5,r:76,d:50,stun:1.1}],                                          txt:'Más alcance y daño. Aturde a quienes alcanza.'},
 {r:'III',cost:1100, w:[{t:.5,r:84,d:50,stun:1.1},{t:.85,r:110,d:32}],                       txt:'Una segunda onda, más amplia, sigue a la primera.'},
 {r:'IV', cost:2000, w:[{t:.5,r:92,d:54,stun:1.1},{t:.82,r:118,d:36},{t:1.12,r:148,d:52,heal:18}],txt:'Tres ondas. La última llega lejos y te devuelve aliento.'}];
const ulv=()=>Math.min(4,Math.max(1,S.ul||1));

// ---------- entradas ----------
EDGE.skill=1;EDGE.ult=1;
CFG.keys.skill=CFG.keys.skill||['u'];CFG.keys.ult=CFG.keys.ult||['o'];buildKM();

// ---------- estado ----------
const U={ps:'idle',dodEnd:-9,fired:[],lv:null,rel:false,W:null,pil:null,btnSk:'',btnUl:''};
let WV=[];                                  // ondas del Tajo en vuelo
G.ar=0;G.skcd=0;G.uf=0;G.dm=0;G.ulting=0;G.src=null;

// ---------- Ímpetu (carga de la ultimate) ----------
function gain(n){if(G.ulting||!P||P.s==='dead')return;const was=G.ar>=100;G.ar=Math.min(100,(G.ar||0)+n);
 if(!was&&G.ar>=100){toast('¡Cólera del Juramento lista!');sfx(660,.3,'triangle',.05,1320);FX.push({k:'ring',x:P.x,y:P.y-6,l:.5,m:.5,c:'255,210,74',big:1});spark(P.x,P.y-10,'#ffe66d',14,12)}}
{const h=hitE,t=takeHit,q=hurtP;
 hitE=function(e,d,kb,hv){
  if(!G.ulting&&P&&P.s==='light'&&P.mv==='ghost')d*=1.5;                 // Corte fantasma
  h(e,d,kb,hv);if(!G.ulting)gain(G.src==='wave'?3:hv?8:5)};
 takeHit=function(d,fx,fy){if(P&&P.s==='ult')return;t(d,fx,fy);if(P&&P.s!=='dead')gain(3)};
 hurtP=function(d,e){if(P.s==='ult')return;const pa=S.st.parries;q(d,e);if(S.st.parries>pa)gain(14);else if(P.cnt===1.1)gain(6)}}

// ---------- Tajo de Onda ----------
function aimNow(){const v=inp(),mag=Math.hypot(v.x,v.y);if(mag>.3){P.ax=v.x/mag;P.ay=v.y/mag}else{P.ax=P.fx;P.ay=P.fy}
 if(Math.abs(P.ax)>Math.abs(P.ay)*1.2){P.fx=sgn(P.ax);P.fy=0}else if(Math.abs(P.ay)>Math.abs(P.ax)*1.2){P.fx=0;P.fy=sgn(P.ay)}}
function startSkill(){aimNow();spend(SKL.st);P.s='skill';P.t=0;P.hd=false;U.rel=false;G.skcd=SKL.cd;buf.skill=0;sfx(380,.15,'sawtooth',.03,200)}
function relSkill(){U.rel=true;const a=Math.atan2(P.ay,P.ax),life=.62,w={x:P.x+P.ax*10,y:P.y+P.ay*10,vx:P.ax*190,vy:P.ay*190,age:0,life,hit:new Set()};
 w.fx={k:'wave',x:w.x,y:w.y-10,a,l:life+.15,m:life+.15,tr:[]};FX.push(w.fx);WV.push(w);
 FX.push({k:'arc',x:P.x,y:P.y-10,a,rho:1.5,r:30,l:.22,m:.22,heavy:1});spark(P.x+P.ax*12,P.y-10,'#9ad0ff',10,10);sfx(520,.25,'sawtooth',.045,160);G.shake=Math.max(G.shake,2)}
function stepWaves(dt){
 if(G.hs>0)return;
 for(const w of WV){w.age+=dt;w.x+=w.vx*dt;w.y+=w.vy*dt;W.fly=true;const wall=W.hit(w.x,w.y,2,2);W.fly=false;
  if(w.fx){w.fx.x=w.x;w.fx.y=w.y-10;w.fx.tr.push([w.x,w.y-10]);if(w.fx.tr.length>7)w.fx.tr.shift()}
  if(wall||w.age>=w.life){w.dead=1;if(w.fx)w.fx.l=Math.min(w.fx.l,.14);spark(w.x,w.y-8,'#9ad0ff',wall?10:5,8,.8);continue}
  for(const e of E){if(e.s==='dead'||w.hit.has(e))continue;if(Math.hypot(e.x-w.x,e.y-w.y)<e.r+6){w.hit.add(e);wake(e);G.src='wave';hitE(e,SKL.dmg,5,0);G.src=null}}
  for(const q of PR)if(!q.k&&Math.hypot(q.x-w.x,q.y-w.y)<11){q.k=1;spark(q.x,q.y-8,'#ffe66d',8,10);ftext(q.x,q.y-20,'bloqueado','#9ad0ff')}}
 WV=WV.filter(w=>!w.dead)}

// ---------- movimientos nuevos (Remate y Corte fantasma) ----------
function trackMoves(dt){const p=P,L=WPN().l;
 if(U.ps==='dodge'&&p.s!=='dodge')U.dodEnd=TM;
 if(p.s==='light'&&U.ps!=='light'){p.mv=null;p.mvd=false;
  if(TM-U.dodEnd<.35){p.mv='ghost';ftext(p.x,p.y-34,'Corte fantasma','#9ad0ff')}
  else if(p.cn===2){p.mv='remate';p.hd=true}}                 // hd=true evita el golpe frontal normal: el remate lo sustituye
 if(p.s!=='light')p.mv=null;
 if(p.mv==='ghost'&&p.t<L.a[1]+.06&&!(G.hs>0)){W.move(p,p.ax*150*dt,p.ay*150*dt);
  if(!p._gf||TM-p._gf>.04){p._gf=TM;FX.push({k:'hs',x:p.x-p.ax*6,y:p.y-10,a:Math.atan2(p.ay,p.ax),l:.16,m:.16});PT.push({k:'d',x:p.x,y:p.y,z:2,vx:(R()-.5)*20,vy:(R()-.5)*10,vz:8,l:.3,c:'rgba(154,208,255,.5)'})}}
 if(p.mv==='remate'&&!p.mvd&&p.t>=L.a[0]){p.mvd=true;let n=0;const rad=L.r+12;
  for(const e of E){if(e.s==='dead')continue;if(Math.hypot(e.x-p.x,(e.y-p.y)*1.2)<rad+e.r){wake(e);hitE(e,L.d*1.5,8,1);n++}}
  FX.push({k:'arc',x:p.x,y:p.y-10,a:Math.atan2(p.ay,p.ax),rho:3.1,r:rad+6,l:.26,m:.26,heavy:1});
  ftext(p.x,p.y-34,'¡Remate!','#ffe66d');spark(p.x,p.y-8,'#ffe66d',14,10,1.2);sfx(200,.18,'sawtooth',.04,80);G.shake=Math.max(G.shake,3);
  if(!n)p.hd=false}}                                           // si no toca a nadie, cuenta como golpe fallado

// ---------- Cólera del Juramento ----------
const crackLines=()=>{const ls=[],n=9;for(let i=0;i<n;i++){let a=i/n*6.283+R()*.5;const pts=[[0,0]];for(let k=1;k<=6;k++){a+=(R()-.5)*.4;pts.push([Math.cos(a)*k/6,Math.sin(a)*k/6])}ls.push(pts)}return ls};
function startUlt(){
 if(!E.some(e=>e.s!=='dead'&&Math.hypot(e.x-P.x,e.y-P.y)<200)){buf.ult=0;toast('Nada a tu alrededor');return}
 buf.ult=0;G.ar=0;G.ulting=1;U.fired=[];U.lv=ULV[ulv()];P.s='ult';P.t=0;P.hd=true;P.kx=P.ky=0;
 U.pil={k:'pillar',x:P.x,y:P.y,l:U.lv.w[U.lv.w.length-1].t+.7,m:U.lv.w[U.lv.w.length-1].t+.7};FX.push(U.pil);
 FX.push({k:'ring',x:P.x,y:P.y,l:.5,m:.5,c:'255,214,110',big:1});
 sfx(160,.55,'sawtooth',.07,640);ftext(P.x,P.y-40,'Cólera '+U.lv.r,'#ffe66d')}
function ultBlast(w,i){const p=P,hit=[];
 for(const e of E){if(e.s==='dead')continue;const dx=e.x-p.x,dy=e.y-p.y;if(Math.hypot(dx,dy/.7)<w.r+e.r*.5&&(Math.hypot(dx,dy)<26||W.los(p.x,p.y,e.x,e.y)))hit.push(e)}
 const last=i===U.lv.w.length-1;
 FX.push({k:'shock',x:p.x,y:p.y,R:w.r,l:.55,m:.55,c:last&&i>0?'255,236,160':'255,214,110'});
 FX.push({k:'shock',x:p.x,y:p.y,R:w.r*.7,l:.4,m:.4,c:'255,255,255'});
 if(i===0)FX.push({k:'crack',x:p.x,y:p.y,R:U.lv.w[U.lv.w.length-1].r*.9,l:1.5,m:1.5,ls:crackLines()});
 spark(p.x,p.y-6,'#ffe66d',26,8,1.7);spark(p.x,p.y-6,'#b05cff',14,8,1.3);
 G.shake=Math.max(G.shake,6+i*1.5);G.uf=i===0?.28:.16;buzz(50+i*20);sfx(70,.7,'sawtooth',.12,28);sfx(900,.45,'triangle',.05,180);
 for(const e of hit){wake(e);hitE(e,w.d,16,1);if(w.stun&&!e.b&&e.s!=='dead'){e.s='stg';e.tm=0;e.stgT=w.stun;e.rip=false}}
 if(w.heal){p.hp=Math.min(p.mhp,p.hp+w.heal);ftext(p.x,p.y-30,'+'+w.heal,'#7dff9a');spark(p.x,p.y-10,'#7dff9a',16,14,.7)}}
function tickUlt(dt){const p=P;
 if(p.s==='ult'){const t=p.t,lv=U.lv,last=lv.w[lv.w.length-1].t;
  if(U.pil){U.pil.x=p.x;U.pil.y=p.y}
  if(t<lv.w[0].t){for(let i=0;i<3;i++){const a=R()*6.283,d=34+R()*14;PT.push({k:'s',x:p.x+Math.cos(a)*d,y:p.y+Math.sin(a)*d*.7,z:2+R()*16,vx:-Math.cos(a)*d*2.2,vy:-Math.sin(a)*d*1.5,vz:10+R()*20,l:.28,c:R()<.5?'#ffe66d':'#fff3b0'})}G.shake=Math.max(G.shake,t*3)}
  lv.w.forEach((w,i)=>{if(!U.fired[i]&&t>=w.t){U.fired[i]=1;ultBlast(w,i)}});
  if(t>=last+.4){p.s='idle';p.hd=false;p.dl=.1;G.ulting=0}
  G.dm+=((t>last?0:1)-G.dm)*Math.min(1,dt*9)}
 else{if(G.ulting)G.ulting=0;G.dm+=(0-G.dm)*Math.min(1,dt*9)}}

// ---------- bucle ----------
function preTick(){
 if(!P||!W||G.mode!=='play'||G.hs>0)return;
 if(U.W!==W){U.W=W;WV=[]}
 if(P.s!=='idle')return;
 if(buf.ult>0){if(G.ar>=100)startUlt();else{buf.ult=0;toast('Cólera '+Math.floor(G.ar)+'%')}}
 else if(buf.skill>0&&P.ex<=0&&G.skcd<=0&&P.st>=12)startSkill()}
function postTick(dt){
 if(!P||!W||G.mode==='title')return;
 if(G.uf>0)G.uf-=dt;
 if(P.s==='dead'){G.ar=0;G.skcd=0}
 if(G.mode==='play'&&G.skcd>0)G.skcd-=dt;
 if(G.mode==='play'||G.mode==='dying'){
  if(P.s==='skill'){if(!U.rel&&P.t>=.16)relSkill();if(P.t>=.42)P.s='idle'}
  trackMoves(dt);tickUlt(dt);stepWaves(dt)}
 U.ps=P.s;syncBtns()}
{const u=update;update=function(dt){preTick();u(dt);postTick(dt)}}

// botones táctiles: recarga de la habilidad y carga de la ultimate
const bSk=document.querySelector('[data-k=skill]'),bUl=document.querySelector('[data-k=ult]');
function syncBtns(){
 const cd=G.skcd>0?cl(Math.ceil(G.skcd/SKL.cd*100),0,100):0,ch=Math.round(G.ar||0),rdy=ch>=100;
 if(bSk){const k=''+cd;if(k!==U.btnSk){U.btnSk=k;bSk.style.setProperty('--cd',cd);bSk.classList.toggle('cd',cd>0)}}
 if(bUl){const k=ch+'|'+rdy;if(k!==U.btnUl){U.btnUl=k;bUl.style.setProperty('--ch',ch);bUl.classList.toggle('rdy',rdy)}}}

// ---------- dibujo ----------
{const w0=weapon;weapon=function(k,ox,oy,a,len,o){
  if(G.pdraw&&k==='sword'){
   if(P.s==='ult'){a=-Math.PI/2+Math.sin(P.t*34)*.05;o=Object.assign({},o,{glow:'255,214,110'});glow(ox,oy-len-6,16+Math.min(1,P.t/.5)*10,'255,214,110',.5)}
   else if(P.s==='skill'){a=Math.atan2(P.ay,P.ax)-1.4+2.8*cl(P.t/.2,0,1);o=Object.assign({},o,{glow:'154,208,255'})}}
  return w0.call(this,k,ox,oy,a,len,o)}}
{const d0=drawP;drawP=function(){const p=P;
  if(p.s==='ult'){const k=Math.min(1,p.t/.5);glow(p.x,p.y-10,26+k*22+Math.sin(TM*30)*2,'255,214,110',.3+.3*k);
   g.save();g.translate(p.x,p.y);g.scale(1,.7);g.strokeStyle='rgba(255,230,140,'+(.3+.4*k)+')';g.lineWidth=1.2;g.setLineDash([4,4]);g.lineDashOffset=-TM*30;g.beginPath();g.arc(0,0,16+(1-k)*26,0,6.283);g.stroke();g.setLineDash([]);g.restore()}
  G.pdraw=true;try{d0()}finally{G.pdraw=false}}}
{const f0=drawFX;drawFX=function(f){const p=1-f.l/f.m;
  if(f.k==='shock'){const e=1-Math.pow(1-p,3),rr=Math.max(1,f.R*e),al=1-p;g.save();g.translate(f.x,f.y);g.scale(1,.7);g.globalCompositeOperation='lighter';
   const q=g.createRadialGradient(0,0,rr*.55,0,0,rr+.1);q.addColorStop(0,'rgba('+f.c+',0)');q.addColorStop(.8,'rgba('+f.c+','+.28*al+')');q.addColorStop(1,'rgba('+f.c+','+.7*al+')');
   g.fillStyle=q;g.beginPath();g.arc(0,0,rr,0,6.283);g.fill();g.globalCompositeOperation='source-over';
   g.strokeStyle='rgba(255,255,255,'+al+')';g.lineWidth=2.5*(1-p)+.8;g.beginPath();g.arc(0,0,rr,0,6.283);g.stroke();g.restore();return}
  if(f.k==='crack'){const e=Math.min(1,p*5),al=p<.6?1:1-(p-.6)/.4;g.save();g.translate(f.x,f.y);g.scale(1,.7);g.lineJoin='round';
   for(const pts of f.ls){g.strokeStyle='rgba(10,4,18,'+.85*al+')';g.lineWidth=2.4;g.beginPath();pts.forEach((q,i)=>{const X=q[0]*f.R*e,Y=q[1]*f.R*e;i?g.lineTo(X,Y):g.moveTo(X,Y)});g.stroke();
    g.strokeStyle='rgba(255,214,110,'+.9*al+')';g.lineWidth=1;g.stroke()}
   g.restore();return}
  if(f.k==='pillar'){const a=Math.sin(Math.min(1,p)*Math.PI),h=96,w=12*(1-p*.5);g.save();g.globalCompositeOperation='lighter';
   const q=g.createLinearGradient(0,f.y-h,0,f.y);q.addColorStop(0,'rgba(255,230,140,0)');q.addColorStop(1,'rgba(255,230,140,'+.5*a+')');
   g.fillStyle=q;g.fillRect(f.x-w/2,f.y-h,w,h);g.fillStyle='rgba(255,255,255,'+.5*a+')';g.fillRect(f.x-1,f.y-h*.8,2,h*.8);g.restore();glow(f.x,f.y-4,26,'255,214,110',.45*a);return}
  if(f.k==='wave'){const al=Math.min(1,f.l/f.m*2.2);
   f.tr.forEach((t,i)=>{const k=(i+1)/f.tr.length;glow(t[0],t[1],7*k+3,'154,208,255',.22*k*al)});
   g.save();g.translate(f.x,f.y);g.rotate(f.a);g.globalAlpha=al;g.fillStyle='rgba(225,240,255,.85)';g.beginPath();g.arc(0,0,12,-1.05,1.05);g.arc(0,0,7,1.05,-1.05,true);g.closePath();g.fill();
   g.strokeStyle='#9ad0ff';g.lineWidth=1.2;g.beginPath();g.arc(0,0,12,-1.05,1.05);g.stroke();g.restore();glow(f.x,f.y,16,'154,208,255',.4*al);return}
  return f0(f)}}

// HUD: oscurecer alrededor durante la ultimate, barra de Ímpetu y destello
function ultHud(){const bx=32,w=Math.min(118,P.mst*.8)|0,y=44,v=cl(G.ar/100,0,1),rd=G.ar>=100;
 fr(bx-1,y-1,w+2,5,'#000');fr(bx,y,w,3,'#1a1026');const c=rd?(Math.floor(TM*8)%2?'#fff3b0':'#ffd24a'):'#b05cff';fr(bx,y,Math.round(w*v),3,c);fr(bx,y,Math.round(w*v),1,'rgba(255,255,255,.45)');
 if(rd){glow(bx+w/2,y+1,w*.6,'255,210,90',.18+.08*Math.sin(TM*8));tx('CÓLERA LISTA',bx+w+6,y+4,'#ffe66d','left',5)}}
{const h0=hud;hud=function(){
  if(P&&G.dm>.01){const x=P.x-cam.x,y=P.y-cam.y-8,q=g.createRadialGradient(x,y,24,x,y,GW*.6);q.addColorStop(0,'rgba(20,6,30,0)');q.addColorStop(1,'rgba(12,2,22,'+.62*G.dm+')');g.fillStyle=q;g.fillRect(0,0,GW,GH)}
  h0();if(!P)return;ultHud();
  if(G.uf>0){g.fillStyle='rgba(255,236,170,'+Math.min(.36,G.uf*1.3)+')';g.fillRect(0,0,GW,GH)}}}

// ---------- hoguera: mejora de la ultimate ----------
function upUlt(){const L=ulv(),nx=ULV[L+1];if(!nx||S.souls<nx.cost)return;S.souls-=nx.cost;S.ul=L+1;sfx(440,.4,'sine',.06,990);save();openRest()}
{const o0=openRest;openRest=function(dead){o0(dead);const m=$('menu'),h=[...m.querySelectorAll('h2')].find(x=>x.textContent.indexOf('Reliquias')===0);if(!h)return;
  const L=ulv(),nx=ULV[L+1];
  let t='<h2>Cólera del Juramento · Nv '+ULV[L].r+'</h2><div class="ent ok"><b>Ultimate · '+ULV[L].r+'</b><span>'+ULV[L].txt+'</span><span class="lore">El Ímpetu se carga al golpear, parar, esquivar y recibir daño. Cuando está lleno, pulsa Cólera (tecla O).</span></div>';
  t+=nx?'<button style="width:100%;height:auto;padding:9px 10px" '+(S.souls<nx.cost?'disabled ':'')+'onclick="upUlt()">Mejorar a '+nx.r+' · '+nx.cost+' almas<br><small style="font-weight:400;letter-spacing:0;font-size:11px">'+nx.txt+'</small></button>':'<p class="hint">La Cólera del Juramento está al máximo.</p>';
  t+='<p class="hint">Onda (tecla U): lanza un tajo que atraviesa enemigos y detiene proyectiles. El tercer golpe ligero seguido es un Remate giratorio. Atacar justo tras esquivar es un Corte fantasma.</p>';
  h.insertAdjacentHTML('beforebegin',t)}}
