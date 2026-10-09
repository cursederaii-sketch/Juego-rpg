// ===== MOTOR =====
const cv=document.getElementById('cv'),g=cv.getContext('2d'),$=id=>document.getElementById(id);
const GW=320,GH=180,GY=146,R=Math.random,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),sgn=v=>v<0?-1:1;
const hash=k=>{const h=Math.sin(k*12.9898)*43758.5453;return h-Math.floor(h)};
// entrada
const held={},buf={},EDGE={light:1,heavy:1,dodge:1,flask:1,act:1};
const KM={a:'left',arrowleft:'left',d:'right',arrowright:'right',j:'light',k:'heavy',l:'dodge',' ':'dodge',shift:'block',i:'block',f:'flask',e:'act'};
const press=k=>{if(EDGE[k])buf[k]=.3;else held[k]=1},rel=k=>{held[k]=0};
addEventListener('keydown',e=>{const k=KM[e.key.toLowerCase()];if(k&&!e.repeat){press(k);e.preventDefault()}});
addEventListener('keyup',e=>{const k=KM[e.key.toLowerCase()];if(k)rel(k)});
// controles táctiles (pointer + fallback touch, anti-menú contextual, suelta todo al perder foco)
const btns=[...document.querySelectorAll('[data-k]')];
const relAll=()=>btns.forEach(b=>{rel(b.dataset.k);b.classList.remove('on')});
btns.forEach(b=>{const k=b.dataset.k;
 const down=e=>{e.preventDefault();if(e.pointerId!=null)try{b.setPointerCapture(e.pointerId)}catch(_){}if(!b.classList.contains('on')){b.classList.add('on');press(k)}};
 const up=()=>{rel(k);b.classList.remove('on')};
 if(window.PointerEvent){b.addEventListener('pointerdown',down);['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,up))}
 else{b.addEventListener('touchstart',down,{passive:false});['touchend','touchcancel'].forEach(ev=>b.addEventListener(ev,up))}
 b.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
 b.addEventListener('contextmenu',e=>e.preventDefault())});
addEventListener('blur',relAll);addEventListener('pagehide',relAll);document.addEventListener('visibilitychange',relAll);
// estado persistente
const DEF=()=>({souls:0,frag:0,ri:0,bf:{r:0,x:60},fires:['0:60'],weapon:'corta',wpns:['corta'],up:{},A:{vig:0,res:0,fue:0},oath:'',oaths:[],mir:0,dorn:0,cab:'',bk:{},tk:{},drop:null,flasks:3});
let S=DEF(),P,E=[],PR=[],RK=[],PT=[],rg=RG[0],cam=0,TM=0;
const G={mode:'title',hs:0,shake:0,msg:'',msgT:0,banner:null,win:0,dieT:0,lock:0,bossOn:false,nd:null};
const save=()=>{try{localStorage.setItem('jur_s',JSON.stringify(S))}catch(e){}};
const load=()=>{try{const s=localStorage.getItem('jur_s');return s?Object.assign(DEF(),JSON.parse(s)):null}catch(e){return null}};
const mhp=()=>100+10*S.A.vig,mst=()=>100+8*S.A.res,WPN=()=>WP[S.weapon],toast=s=>{G.msg=s;G.msgT=2.4};
const spark=(x,y,c,n)=>{for(let i=0;i<n;i++)PT.push({x,y,vx:(R()-.5)*130,vy:-R()*90,l:.3+R()*.3,c})};
// entidades
function mk(t,x,id){const b=id?BS[id]:null,d=b||TY[t],m=b?1:rg.m;return{t,b,id,x,hp:Math.round(d.hp*m),mhp:Math.round(d.hp*m),dm:b?b.dm:rg.dm,so:Math.round(d.so*m),f:-1,s:'walk',tm:0,cd:1,fl:0,cur:null,wt:0,hd:false,stgT:0,rip:false,ph:0,rk:2,aw:!!b,nk:null}}
function spawnEn(){E=[];PR=[];RK=[];G.bossOn=false;G.lock=0;rg.en.forEach(([t,x])=>E.push(mk(t,x)))}
function newP(x){P={x,f:1,hp:mhp(),mhp:mhp(),st:mst(),mst:mst(),sd:0,s:'idle',t:0,hd:false,ex:0,bt:0,dd:1,bonus:0}}
function loadRegion(i,x){S.ri=i;rg=RG[i];rg.bx=rg.w-330;spawnEn();newP(x);cam=cl(x-160,0,rg.w-320);G.banner={t:rg.act,s:rg.n,l:3.5}}
// jugador
const mult=()=>{let m=(1+.08*S.A.fue)*(1+.12*(S.up[S.weapon]||0));if(S.oath==='blood'&&P.bonus<=0)m*=1+(1-P.hp/P.mhp)*.9;if(S.oath==='oblivion')m*=.85;return m};
const spend=n=>{P.st-=n;P.sd=.7;if(P.st<=0){P.st=0;P.ex=.9}};
const dodging=()=>P.s==='dodge'&&P.t>.03&&P.t<.26;
function takeHit(d){const p=P;if(p.s==='dead')return;p.hp-=d;G.shake=4;G.hs=.08;p.sd=.5;spark(p.x,GY-14,'#ff4d6d',10);
 if(p.hp<=0){p.hp=0;p.s='dead';p.t=0;G.mode='dying';G.dieT=1.6;if(S.souls>0)S.drop={r:S.ri,x:p.x,s:S.souls};S.souls=0;return}
 p.s='hit';p.t=0;p.hd=true}
function hurtP(d,e){const p=P;if(dodging()){spark(p.x,GY-14,'#7df9ff',3);return}
 const front=(e.x-p.x)*p.f>0;
 if(p.s==='idle'&&held.block&&p.ex<=0&&front){
  if(p.bt<.2){spark(p.x+p.f*10,GY-16,'#ffe66d',14);G.hs=.12;G.shake=2;p.st=Math.min(p.mst,p.st+20);if(!e.proj){e.s='stg';e.tm=0;e.stgT=1.1;e.rip=true}toast('¡Parada!');return}
  p.st-=d*1.3*(S.oath==='guardian'?.5:1);p.sd=.8;spark(p.x+p.f*8,GY-16,'#8aa3c7',6);G.hs=.05;G.shake=1.5;p.hp-=Math.round(d*.15);
  if(p.hp<=0){takeHit(0);return}
  if(p.st<=0){p.st=0;p.ex=1.2;p.s='hit';p.t=0;p.hd=true}return}
 takeHit(d)}
const objs=()=>{const o=[];[60,rg.bx-40].forEach(x=>o.push({x,k:'Descansar',f:()=>bonfire(x)}));
 rg.npc.forEach(n=>o.push({x:n.x,k:'Hablar',f:()=>say(NPC[n.id]())}));
 rg.it.forEach(it=>{const key=S.ri+':'+it.x;if(!S.tk[key])o.push({x:it.x,k:'Recoger',f:()=>{S.tk[key]=1;if(it.w)getW(it.w);else{S.frag++;toast('Fragmento de memoria')}save()}})});
 if(S.bk[rg.boss]&&S.ri<RG.length-1)o.push({x:rg.w-24,k:'Cruzar',f:door});return o};
const near=()=>objs().filter(o=>Math.abs(P.x-o.x)<22).sort((a,b)=>Math.abs(P.x-a.x)-Math.abs(P.x-b.x))[0];
function door(){loadRegion(S.ri+1,60);S.bf={r:S.ri,x:60};const k=S.ri+':60';if(!S.fires.includes(k))S.fires.push(k);save()}
function bonfire(x){P.hp=P.mhp;P.st=P.mst;S.flasks=3;S.bf={r:S.ri,x};const k=S.ri+':'+x;if(!S.fires.includes(k))S.fires.push(k);spawnEn();save();openRest(false)}
function updP(dt){const p=P,w=WPN(),L=w.l,H=w.h;p.t+=dt;if(p.ex>0)p.ex-=dt;if(p.bonus>0)p.bonus-=dt;p.sd-=dt;
 for(const k in buf)if(buf[k]>0)buf[k]-=dt;
 const blk=held.block&&p.s==='idle'&&p.ex<=0;if(blk)p.bt+=dt;else p.bt=0;
 const xmin=G.lock||12,xmax=rg.w-12;
 if(rg.boss&&!S.bk[rg.boss]&&!G.bossOn&&p.x>rg.bx+8){E.push(mk('boss',rg.w-90,rg.boss));G.bossOn=true;G.lock=rg.bx;toast(BS[rg.boss].n)}
 if(p.s==='idle'&&p.ex<=0){
  if(buf.act>0){buf.act=0;const o=near();if(o){o.f();return}}
  if(buf.dodge>0&&p.st>0){spend(20);p.s='dodge';p.t=0;p.dd=held.left?-1:held.right?1:-p.f;buf.dodge=0}
  else if(buf.heavy>0&&p.st>0){spend(H.c);p.s='heavy';p.t=0;p.hd=false;buf.heavy=0}
  else if(buf.light>0&&p.st>0){spend(L.c);p.s='light';p.t=0;p.hd=false;buf.light=0}
  else if(buf.flask>0&&S.flasks>0){buf.flask=0;if(S.oath==='guardian'&&G.bossOn)toast('El Guardián no puede curarse');else{p.s='flask';p.t=0;p.hd=false}}}
 let v=0;
 if(p.s==='idle'){const d=(held.right?1:0)-(held.left?1:0);if(d)p.f=d;v=d*(blk?30:68)*(p.ex>0?.4:1)}
 else if(p.s==='light'){v=p.t<L.a[1]?p.f*40:0;if(p.t>L.t)p.s='idle'}
 else if(p.s==='heavy'){if(p.t>H.t)p.s='idle'}
 else if(p.s==='dodge'){v=p.dd*170*(1-p.t/.38*.6);if(p.t>.38)p.s='idle'}
 else if(p.s==='flask'){if(p.t>.5&&!p.hd){p.hd=true;S.flasks--;p.hp=Math.min(p.mhp,p.hp+45);p.bonus=6;spark(p.x,GY-16,'#7dff9a',14)}if(p.t>.9)p.s='idle'}
 else if(p.s==='hit'){v=-p.f*40;if(p.t>.3)p.s='idle'}
 p.x=cl(p.x+v*dt,xmin,xmax);
 if(p.sd<=0&&p.st<p.mst&&p.s!=='dodge')p.st=Math.min(p.mst,p.st+(blk?10:32)*dt);
 const A=p.s==='light'?[L.a[0],L.a[1],L.d,L.r,3,0]:p.s==='heavy'?[H.a[0],H.a[1],H.d,H.r,8,1]:null;
 if(A&&!p.hd&&p.t>=A[0]&&p.t<=A[1])for(const e of E)if(e.s!=='dead'){const dx=(e.x-p.x)*p.f,d=e.b||TY[e.t];if(dx>-6&&dx<A[3]+d.w/2){p.hd=true;hitE(e,A[2],A[4],A[5]);break}}}
function hitE(e,d,kb,hv){d*=mult();let rp=false;if(e.s==='stg'&&e.rip){d*=2.5;rp=true;e.rip=false}
 d=Math.round(d);e.hp-=d;e.fl=.12;e.aw=true;e.x=cl(e.x+P.f*kb,G.lock||12,rg.w-12);G.hs=hv||rp?.11:.06;G.shake=hv||rp?3:1.5;spark(e.x,GY-18,rp?'#ffe66d':'#fff',rp?14:6);
 if(e.hp<=0){e.hp=0;e.s='dead';e.tm=0;S.souls+=e.so;spark(e.x,GY-16,'#b05cff',22);if(e.b)bossDown(e);return}
 const arm=(e.b&&e.ph>=1)||(TY[e.t]&&TY[e.t].arm);
 if(rp){e.s='stg';e.tm=0;e.stgT=.7}else if(hv&&!arm){e.s='stg';e.tm=0;e.stgT=.45}else if(!e.b&&!arm&&e.s==='wind'){e.s='stg';e.tm=0;e.stgT=.3}}
function bossDown(e){S.bk[e.id]=1;G.lock=0;G.bossOn=false;G.win=2.5;S.frag+=e.b.fr;RK=[];PR=[];E.forEach(x=>{if(x!==e&&x.s!=='dead'){x.hp=0;x.s='dead';x.tm=0}});if(e.id==='caballero')getW('caballero')}
// enemigos
function updE(e,dt){e.tm+=dt;e.fl-=dt;if(e.s==='dead')return;const b=e.b,d=b||TY[e.t];
 if(!e.aw){if(Math.abs(P.x-e.x)<130&&P.s!=='dead')e.aw=true;else return}
 let ph=null,sp=d.sp;
 if(b){const r=e.hp/e.mhp,n=r>.66?0:r>.33?1:2;
  if(n!==e.ph){e.ph=n;const q=b.ph[n];G.shake=6;G.hs=.2;spark(e.x,GY-30,'#ff4d6d',30);if(q.msg)toast(q.msg);for(let i=0;i<(q.adds||0);i++){const a=mk('hollow',cl(e.x+(i?-70:70),20,rg.w-20));a.aw=true;E.push(a)}}
  ph=b.ph[e.ph];sp*=ph.s;
  if(ph.rocks){e.rk-=dt;if(e.rk<=0){e.rk=2.2;for(let i=0;i<2;i++)RK.push({x:cl(P.x+(R()-.5)*60,Math.max(20,G.lock+8),rg.w-20),t:0})}}}
 const dx=P.x-e.x,ad=Math.abs(dx),xl=G.lock||12;
 if(e.s==='walk'){e.f=sgn(dx);e.cd-=dt;
  if(!e.nk){const l=b?ph.a:d.at;e.nk=l[Math.floor(R()*l.length)]}
  const at=ATK[e.nk];
  if(d.kite&&ad<55&&P.s!=='dead')e.x=cl(e.x-e.f*sp*dt,xl,rg.w-12);
  else if(ad>at.sd*.9&&P.s!=='dead')e.x=cl(e.x+e.f*sp*dt,xl,rg.w-12);
  else if(e.cd<=0&&P.s!=='dead'){e.cur=at;e.nk=null;e.s='wind';e.tm=0;e.wt=at.w/(b?Math.min(1.25,ph.s):1)+(ph&&ph.hold?R()*ph.hold:0)}}
 else if(e.s==='wind'){if(e.tm>=e.wt){e.s='act';e.tm=0;e.hd=false;const c=e.cur;
   if(c.proj){e.hd=true;PR.push({x:e.x+e.f*10,vx:e.f*c.proj,d:Math.round(c.d*e.dm),c:c.proj>100?'#ffe66d':'#ff7a3c'})}
   if(c.tp){e.x=cl(P.x-P.f*28,xl,rg.w-14);e.f=P.f}}}
 else if(e.s==='act'){e.x=cl(e.x+e.f*(e.cur.mv||0)*dt,xl,rg.w-12);
  if(!e.hd){const dist=(P.x-e.x)*e.f;if(dist>-8&&dist<e.cur.rng+6){e.hd=true;hurtP(Math.round(e.cur.d*e.dm),e)}}
  if(e.tm>=e.cur.a){e.s='rec';e.tm=0}}
 else if(e.s==='rec'){if(e.tm>=e.cur.r*(ph&&e.ph===2?.7:1)){e.s='walk';e.cd=.3+R()*.6}}
 else if(e.s==='stg'){if(e.tm>=e.stgT){e.s='walk';e.rip=false;e.cd=.3}}}
// flujo
function update(dt){
 if(G.msgT>0)G.msgT-=dt;if(G.banner){G.banner.l-=dt;if(G.banner.l<=0)G.banner=null}
 PT.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=200*dt;p.l-=dt});PT=PT.filter(p=>p.l>0);
 if(G.mode!=='play'&&G.mode!=='dying')return;
 if(G.hs>0){G.hs-=dt;return}
 if(G.mode==='play')updP(dt);else P.t+=dt;
 E.forEach(e=>updE(e,dt));E=E.filter(e=>!(e.s==='dead'&&e.tm>2&&!e.b));
 PR.forEach(q=>{q.x+=q.vx*dt;if(q.x<0||q.x>rg.w)q.k=1;else if(Math.abs(q.x-P.x)<6&&P.s!=='dead'){q.k=1;hurtP(q.d,{x:q.x-sgn(q.vx)*20,proj:1})}});PR=PR.filter(q=>!q.k);
 RK.forEach(r=>{r.t+=dt;if(r.t>=1){r.d=1;spark(r.x,GY-4,'#ff9a6b',10);G.shake=3;if(Math.abs(P.x-r.x)<10&&!dodging()&&P.s!=='dead')takeHit(20)}});RK=RK.filter(r=>!r.d);
 if(S.drop&&S.drop.r===S.ri&&P.s!=='dead'&&Math.abs(P.x-S.drop.x)<12){S.souls+=S.drop.s;S.drop=null;toast('Almas recuperadas')}
 cam+=(cl(P.x-160,G.lock?G.lock-10:0,rg.w-320)-cam)*Math.min(1,dt*8);
 if(G.win>0){G.win-=dt;if(G.win<=0){G.win=0;save();say(CUT[rg.boss]())}}
 if(G.mode==='dying'){G.dieT-=dt;if(G.dieT<=0){S.flasks=3;loadRegion(S.bf.r,S.bf.x);openRest(true)}}}
// dibujo
function fig(x,f,w,h,col,tr,ang,wl,al=1){g.globalAlpha=al;const y=GY-h;
 g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-w/2-1,GY-1,w+2,2);
 g.fillStyle=col;g.fillRect(x-w/2,y+h*.3,w,h*.7);g.fillRect(x-w*.32,y,w*.64,h*.3);
 g.fillStyle='rgba(255,255,255,.14)';g.fillRect(x-w/2,y+h*.3,w,2);g.fillStyle=tr;g.fillRect(x+f*w*.12-1,y+h*.1,3,2);
 if(wl){g.save();g.translate(x,y+h*.45);g.scale(f,1);g.rotate(ang);g.fillStyle='#5a4630';g.fillRect(0,-1,4,3);g.fillStyle='#d6dde9';g.fillRect(4,-1,wl,2);g.restore()}g.globalAlpha=1}
function bg(){const b=E.some(e=>e.b&&e.ph===2&&e.s!=='dead'),gr=g.createLinearGradient(0,0,0,GY);
 gr.addColorStop(0,b?'#2a0a1e':rg.sky[0]);gr.addColorStop(1,b?'#4a1226':rg.sky[1]);g.fillStyle=gr;g.fillRect(0,0,GW,GH);
 g.fillStyle='rgba(232,228,255,.8)';g.beginPath();g.arc(250,34,12,0,6.28);g.fill();
 const o=cam*.5;g.fillStyle=g.strokeStyle=rg.co;
 if(rg.dc==='arc'){g.lineWidth=8;for(let i=-1;i<7;i++){const x=i*64-o%64;g.fillRect(x-4,56,8,GY-56);g.beginPath();g.arc(x+32,70,28,3.14,6.28);g.stroke()}}
 else{const gi=Math.floor(o/36);for(let i=-1;i<10;i++){const k=gi+i,x=k*36-o,h=30+hash(k)*(rg.dc==='tree'?70:50);
  if(rg.dc==='tree'){g.fillRect(x,GY-h-20,7,h+20);g.beginPath();g.arc(x+3,GY-h-20,16,0,6.28);g.fill()}
  else{g.fillStyle=rg.co;g.fillRect(x,GY-h,30,h);g.fillStyle='rgba(255,154,60,.35)';g.fillRect(x+8,GY-h+8,5,6);g.fillStyle=rg.co}}}
 g.fillStyle=rg.fl;g.fillRect(0,GY,GW,GH-GY);g.fillStyle='#3a2d5c';g.fillRect(0,GY,GW,1);
 g.fillStyle='rgba(0,0,0,.25)';for(let x=-(cam%24);x<GW;x+=24)g.fillRect(x,GY+1,1,GH-GY);
 g.fillStyle='rgba(180,160,255,.06)';g.fillRect(0,GY-16+Math.sin(TM)*4,GW,16)}
function drawE(e){const d=e.b||TY[e.t];
 if(e.s==='dead'){g.globalAlpha=Math.max(0,1-e.tm/1.2);g.fillStyle=d.c;g.fillRect(e.x-d.h/2,GY-5,d.h,5);g.globalAlpha=1;return}
 let ang=.9;const c=e.cur;
 if(e.s==='wind')ang=.9-3.2*Math.min(1,e.tm/e.wt);else if(e.s==='act')ang=-2.3+3.7*Math.min(1,e.tm/c.a);else if(e.s==='rec')ang=1.4;
 let col=e.fl>0?'#fff':d.c;if(e.s==='wind'&&e.tm/e.wt>.7&&Math.floor(e.tm*28)%2)col='#ff8a8a';
 if(S.oath==='oblivion'&&e.s==='wind'&&!c.proj){const z=c.rng+6;g.fillStyle='rgba(255,60,90,'+(.12+.2*e.tm/e.wt)+')';g.fillRect(e.f>0?e.x:e.x-z,GY-28,z,28)}
 if(e.b){if(e.b.ch&&e.ph===0){g.strokeStyle='#8a8a9a';g.lineWidth=1;g.setLineDash([2,2]);g.beginPath();g.moveTo(e.x-4,GY-20);g.lineTo(e.x-34,GY-3);g.moveTo(e.x+4,GY-20);g.lineTo(e.x+34,GY-3);g.stroke();g.setLineDash([])}
  g.fillStyle='#c0243c';g.fillRect(e.x-3,GY-d.h-6,6,6)}
 fig(e.x,e.f,d.w,d.h,col,d.tr,ang,d.wl,e.cur&&e.cur.tp&&e.s==='wind'?.35:1);
 if(e.s==='stg'&&e.rip){g.fillStyle='#ffe66d';g.font='bold 10px monospace';g.textAlign='center';g.fillText('!',e.x,GY-d.h-10)}}
function drawP(){const p=P,w=WPN();
 if(p.s==='dead'){g.fillStyle='#1a1a2e';g.fillRect(p.x-11,GY-6,22,6);g.fillStyle='#7df9ff';g.fillRect(p.x+p.f*6,GY-5,3,2);return}
 let ang=.9,al=1,h=22;const L=w.l,H=w.h,lt=(t,a)=>t<a[0]?-1.5:t<a[1]?-1.5+(t-a[0])/(a[1]-a[0])*2.7:1.1;
 if(p.s==='light')ang=lt(p.t,L.a);else if(p.s==='heavy')ang=p.t<H.a[0]?-2.3:p.t<H.a[1]?-2.3+(p.t-H.a[0])/(H.a[1]-H.a[0])*3.7:1.4;
 else if(p.s==='dodge'){al=.45;h=17}else if(p.s==='flask')ang=1.4;
 fig(p.x,p.f,11,h,p.s==='hit'?'#ff6b6b':'#1c1c38','#7df9ff',ang,w.wl,al);
 const A=p.s==='light'?[L.a[0],L.a[1],L.r]:p.s==='heavy'?[H.a[0],H.a[1],H.r]:null;
 if(A&&p.t>=A[0]&&p.t<=A[1]+.05){g.save();g.translate(p.x,GY-14);g.scale(p.f,1);g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=2;g.beginPath();g.arc(0,0,A[2]-6,-1.2,1);g.stroke();g.restore()}
 if(held.block&&p.s==='idle'&&p.ex<=0){g.fillStyle=p.bt<.2?'#ffe66d':'#8aa3c7';g.fillRect(p.x+p.f*7-2,GY-22,4,16)}
 if(p.s==='flask'){g.fillStyle='#7dff9a';g.fillRect(p.x+p.f*8-2,GY-20,4,5)}}
function draw(){
 g.save();if(G.shake>0){g.translate((R()-.5)*G.shake*2,(R()-.5)*G.shake*2);G.shake*=.85;if(G.shake<.2)G.shake=0}
 bg();g.save();g.translate(-Math.round(cam),0);
 [60,rg.bx-40].forEach(x=>{g.fillStyle='#6b5a4a';g.fillRect(x-5,GY-5,10,5);g.fillStyle='#ff9a3c';const fh=10+Math.sin(TM*14+x)*3;g.fillRect(x-3,GY-5-fh,6,fh);g.fillStyle='#ffe66d';g.fillRect(x-1,GY-5-fh*.6,2,fh*.6)});
 rg.npc.forEach(n=>fig(n.x,P.x<n.x?-1:1,11,22,'#4a3a5a','#ffe66d',0,0));
 rg.it.forEach(it=>{if(!S.tk[S.ri+':'+it.x]){g.fillStyle=it.w?'#7df9ff':'#ffe66d';const y=GY-12+Math.sin(TM*4)*2;g.fillRect(it.x-3,y-3,6,6)}});
 if(S.bk[rg.boss]&&S.ri<RG.length-1){g.fillStyle='#07040f';g.fillRect(rg.w-36,GY-40,24,40);g.strokeStyle='#7a3cff';g.lineWidth=2;g.strokeRect(rg.w-36,GY-40,24,40)}
 if(G.lock){g.fillStyle='rgba(150,60,255,'+(.3+Math.sin(TM*4)*.1)+')';g.fillRect(G.lock-6,GY-60,6,60)}
 if(S.drop&&S.drop.r===S.ri){g.fillStyle='#ffe66d';g.fillRect(S.drop.x-3,GY-9+Math.sin(TM*4)*2,6,6)}
 RK.forEach(r=>{g.fillStyle='rgba(255,70,90,'+(.25+.3*Math.sin(r.t*30)**2)+')';g.fillRect(r.x-10,GY-1,20,2);if(r.t>.7){g.fillStyle='#6b5a4a';g.fillRect(r.x-6,GY-(1-r.t)*400,12,12)}});
 E.forEach(drawE);PR.forEach(q=>{g.fillStyle=q.c;g.fillRect(q.x-3,GY-16,6,3)});drawP();
 if(G.mode==='play'&&P.s==='idle'){const o=near();if(o){g.fillStyle='#fff';g.font='bold 8px monospace';g.textAlign='center';g.fillText('['+o.k+']',o.x,GY-42)}}
 PT.forEach(p=>{g.globalAlpha=Math.min(1,p.l*3);g.fillStyle=p.c;g.fillRect(p.x,p.y,2,2)});g.globalAlpha=1;
 g.restore();g.restore();hud()}
function hud(){const p=P;g.textAlign='left';g.font='8px monospace';
 g.fillStyle='rgba(0,0,0,.6)';g.fillRect(6,6,104,8);g.fillStyle='#c0243c';g.fillRect(7,7,Math.min(102,102*p.hp/Math.max(p.mhp,100)),6);
 g.fillStyle='rgba(0,0,0,.6)';g.fillRect(6,16,84,6);g.fillStyle=p.ex>0&&Math.floor(TM*10)%2?'#ff9a3c':'#4cd964';g.fillRect(7,17,Math.min(82,82*p.st/Math.max(p.mst,100)),4);
 for(let i=0;i<S.flasks;i++){g.fillStyle='#7dff9a';g.fillRect(7+i*8,25,5,7)}
 g.fillStyle='#bfa8ff';g.fillText((S.oath?short(S.oath):'Sin juramento')+' · '+WPN().n,7,41);
 g.textAlign='right';g.fillStyle='#ffe66d';g.fillText('✦ '+S.souls+'  ◆ '+S.frag,GW-8,13);
 const b=E.find(e=>e.b&&e.s!=='dead'&&e.aw);
 if(b){g.textAlign='center';g.fillStyle='#fff';g.fillText(b.b.n,GW/2,GH-20);g.fillStyle='rgba(0,0,0,.6)';g.fillRect(60,GH-16,200,7);g.fillStyle='#8a1c2e';g.fillRect(61,GH-15,198*b.hp/b.mhp,5)}
 if(G.banner){g.globalAlpha=Math.min(1,G.banner.l);g.textAlign='center';g.fillStyle='#bfa8ff';g.font='8px monospace';g.fillText(G.banner.t,GW/2,GH/2-28);g.fillStyle='#fff';g.font='bold 16px monospace';g.fillText(G.banner.s,GW/2,GH/2-12);g.globalAlpha=1}
 if(G.msgT>0){g.globalAlpha=Math.min(1,G.msgT);g.textAlign='center';g.font='bold 10px monospace';g.fillStyle='#000';g.fillText(G.msg,GW/2+1,71);g.fillStyle='#ffe66d';g.fillText(G.msg,GW/2,70);g.globalAlpha=1}
 if(G.mode==='dying'){g.fillStyle='rgba(0,0,0,'+Math.min(.7,(1.6-G.dieT)*.6)+')';g.fillRect(0,0,GW,GH);g.fillStyle='#c0243c';g.textAlign='center';g.font='bold 18px monospace';g.fillText('HAS CAÍDO',GW/2,GH/2)}
 if(G.win>0){g.fillStyle='rgba(255,230,109,'+Math.min(.5,(2.5-G.win)*.4)+')';g.fillRect(0,0,GW,GH);g.fillStyle='#fff';g.textAlign='center';g.font='bold 16px monospace';g.fillText('JEFE DERROTADO',GW/2,GH/2)}}
// diálogo y menús
function say(n){if(!n)return;G.mode='dlg';G.nd=n;const d=$('dlg');d.style.display='block';
 d.innerHTML=(n.n?'<b>'+n.n+'</b>':'')+'<p>'+n.t+'</p>'+(n.o?n.o.map((o,i)=>'<button onclick="pick('+i+')">'+o[0]+'</button>').join(''):'<button onclick="pick(-1)">Continuar</button>')}
function pick(i){const n=G.nd;$('dlg').style.display='none';G.mode='play';const f=i>=0?n.o[i][1]:null;let nx=f?f():(i<0?n.nx:null);if(typeof nx==='function')nx=nx();if(nx)say(nx);save()}
function closeM(){$('menu').style.display='none';G.mode='play';save()}
function openRest(dead){G.mode='menu';const m=$('menu'),lv=60+40*(S.A.vig+S.A.res+S.A.fue),uc=(S.up[S.weapon]||0)+1;m.style.display='flex';
 let h='<div class="card"><h1>'+(dead?'Has caído':'Hoguera')+'</h1><p>Almas '+S.souls+' · Fragmentos '+S.frag+'</p><h2>Juramento</h2>';
 for(const k in OATHS){const ok=S.oaths.includes(k);h+='<button class="oath'+(S.oath===k?' sel':'')+'" '+(ok?'':'disabled ')+'onclick="eqO(\''+k+'\')"><b>'+OATHS[k][0]+'</b>'+(ok?OATHS[k][1]:'Aún no descubierto')+'</button>'}
 h+='<button class="oath" onclick="eqO(\'\')">Sin juramento</button><h2>Atributos · '+lv+' almas</h2><div class="row">'+[['vig','Vida +10'],['res','Resist. +8'],['fue','Fuerza +8%']].map(a=>'<button '+(S.souls<lv?'disabled ':'')+'onclick="buy(\''+a[0]+'\')">'+a[1]+' ('+S.A[a[0]]+')</button>').join('')+'</div><h2>Arma</h2>';
 h+=S.wpns.map(w=>'<button class="oath'+(S.weapon===w?' sel':'')+'" onclick="eqW(\''+w+'\')"><b>'+WP[w].n+' +'+(S.up[w]||0)+'</b>'+WP[w].d+'</button>').join('');
 h+='<button '+(S.frag<uc||uc>5?'disabled ':'')+'onclick="upg()">Mejorar arma (+12% daño) · '+uc+' fragmento(s)</button><h2>Viajar</h2>';
 h+=S.fires.map(f=>{const[r,x]=f.split(':');return '<button class="oath" onclick="trav('+r+','+x+')">'+RG[r].n+(x==60?'':' · antes del jefe')+'</button>'}).join('');
 m.innerHTML=h+'<button id="go" onclick="closeM()">Continuar</button></div>'}
const eqO=k=>{S.oath=k;openRest()},eqW=w=>{S.weapon=w;openRest()},upg=()=>{const u=(S.up[S.weapon]||0)+1;S.frag-=u;S.up[S.weapon]=u;openRest()};
const buy=a=>{const lv=60+40*(S.A.vig+S.A.res+S.A.fue);if(S.souls>=lv){S.souls-=lv;S.A[a]++;const h=P.hp/P.mhp;P.mhp=mhp();P.mst=mst();P.hp=P.mhp;P.st=P.mst;openRest()}};
const trav=(r,x)=>{S.flasks=3;loadRegion(r,x);closeM()};
function title(){G.mode='title';const m=$('menu');m.style.display='flex';
 m.innerHTML='<div class="card"><h1>Juramento</h1><p>Un reino que olvida. Un guerrero sin nombre.</p><button id="go" onclick="newGame()">Nueva partida</button>'+(load()?'<button class="oath" onclick="cont()"><b>Continuar</b>Retoma desde tu última hoguera</button>':'')+'<p class="hint">Teclado: A/D mover · J ligero · K pesado · L esquiva · Shift bloquear (al inicio = parada) · F frasco · E actuar. En móvil, mejor en horizontal.</p></div>'}
function newGame(){S=DEF();loadRegion(0,60);closeM();say(INTRO)}
function cont(){S=load();loadRegion(S.bf.r,S.bf.x);closeM()}
function fin(k){const e=ENDS[k];G.mode='end';const m=$('menu');m.style.display='flex';
 m.innerHTML='<div class="card"><h2>Final</h2><h1>'+e[0]+'</h1><p>'+e[1]+'</p><button id="go" onclick="title()">Volver al título</button></div>'}
// ===== RENDER v2: sprites, parallax, luces, HUD =====
const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
const mix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),A=p(a),B=p(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join()+')'};
const glow=(x,y,rad,rgb,a)=>{const q=g.createRadialGradient(x,y,0,x,y,rad);q.addColorStop(0,'rgba('+rgb+','+a+')');q.addColorStop(1,'rgba('+rgb+',0)');g.save();g.globalCompositeOperation='lighter';g.fillStyle=q;g.fillRect(x-rad,y-rad,rad*2,rad*2);g.restore()};
const tx=(s,x,y,c,al)=>{g.textAlign=al||'left';g.fillStyle='#000';g.fillText(s,x+1,y+1);g.fillStyle=c;g.fillText(s,x,y)};
let AC;const sfx=(f,d,t,v,f2)=>{try{AC=AC||new AudioContext();AC.resume();const T=AC.currentTime,o=AC.createOscillator(),a=AC.createGain();o.type=t||'square';o.frequency.setValueAtTime(f,T);if(f2)o.frequency.exponentialRampToValueAtTime(f2,T+d);a.gain.setValueAtTime(v||.04,T);a.gain.exponentialRampToValueAtTime(.0001,T+d);o.connect(a);a.connect(AC.destination);o.start();o.stop(T+d)}catch(e){}};
{const h=hitE,t=takeHit,b=bossDown,f=bonfire,hp=hurtP;
 hitE=(e,d,k,v)=>{sfx(240,.12,'sawtooth',.05,70);h(e,d,k,v)};takeHit=d=>{sfx(130,.3,'sawtooth',.08,40);t(d)};
 bossDown=e=>{sfx(110,1.2,'triangle',.1,520);b(e)};bonfire=x=>{sfx(330,.5,'sine',.06,660);f(x)};
 hurtP=(d,e)=>{if(held.block&&P.bt<.2&&!dodging())sfx(900,.15,'triangle',.06,1500);hp(d,e)}}
function fig(x,f,w,h,col,tr,ang,wl,al=1){g.globalAlpha=al;const y=GY-h,pl=tr==='#7df9ff',bs=w>=14&&h>=28,bob=Math.sin(TM*5+x*.1)*.6,mv=Math.round(Math.sin(x*.4)*2),dk=mix(col,'#000000',.45),lt=mix(col,'#ffffff',.28),sw=Math.sin(TM*4+x*.2)*2;
 g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.ellipse(x,GY,w*.8,2.2,0,0,6.28);g.fill();
 if(bs)glow(x,y+h/2,34,'255,60,90',.12);
 g.fillStyle=pl?'#24386a':dk;g.beginPath();g.moveTo(x-f*w*.3,y+h*.3+bob);g.lineTo(x-f*(w*.9+sw+3),y+h*.98);g.lineTo(x-f*w*.05,y+h*.92);g.fill();
 if(pl){r(x-f*(w*.5+3+sw),y+h*.22+bob,4,2,'#7df9ff');r(x-f*(w*.5+6+sw*1.5),y+h*.26+bob,3,2,'#4aa8c8')}
 r(x-w*.3,y+h*.68,w*.26,h*.32,dk);r(x+w*.04,y+h*.68,w*.26,h*.32,dk);r(x-w*.3+mv,y+h-3,w*.28,3,'#14101c');r(x+w*.04-mv,y+h-3,w*.28,3,'#14101c');
 r(x-w/2,y+h*.3+bob,w,h*.4,col);r(x-w/2,y+h*.3+bob,w,1,lt);r(x-w/2,y+h*.3+bob,2,h*.4,lt);r(x+w/2-2,y+h*.3+bob,2,h*.4,dk);
 r(x-w/2,y+h*.62+bob,w,2,'#3a2a1a');r(x-1,y+h*.62+bob,2,2,'#c9a54a');
 r(x-w*.62,y+h*.28+bob,w*.38,3,lt);r(x+w*.24,y+h*.28+bob,w*.38,3,lt);if(bs){r(x-w*.62,y+h*.2+bob,2,4,lt);r(x+w*.56,y+h*.2+bob,2,4,lt)}
 const hc=pl?'#1c1c38':col;r(x-w*.3,y+bob,w*.6,h*.3,hc);r(x-w*.3,y+bob,w*.6,1,lt);
 if(pl){r(x-w*.34,y+bob-1,w*.68,2,'#2c2c58');r(x+f*w*.02,y+h*.1+bob,w*.26,3,'#05050c')}
 r(x+f*w*.06,y+h*.12+bob,w*.24,2,tr);glow(x+f*w*.18,y+h*.14+bob,7,pl?'125,249,255':'255,120,80',.35);
 if(bs){g.fillStyle=lt;g.beginPath();g.moveTo(x-w*.3,y+bob);g.lineTo(x-w*.5,y-6+bob);g.lineTo(x-w*.12,y+bob);g.moveTo(x+w*.3,y+bob);g.lineTo(x+w*.5,y-6+bob);g.lineTo(x+w*.12,y+bob);g.fill()}
 else if(!pl&&wl)r(x-1,y-2+bob,2,3,tr);
 if(wl){g.save();g.translate(x,y+h*.45+bob);g.scale(f,1);g.rotate(ang);r(-2,-1,6,3,'#5a4630');r(4,-3,2,7,'#c9a54a');r(6,-1,wl,3,'#8d98ad');r(6,-1,wl,1,'#f4f8ff');r(6+wl,0,2,1,'#f4f8ff');g.restore()}
 g.globalAlpha=1}
function fire(x){const s=Math.sin;g.fillStyle='#4a3e34';g.beginPath();g.ellipse(x,GY-1,8,3,0,0,6.28);g.fill();r(x-6,GY-5,12,3,'#6b5a4a');r(x-1,GY-22,2,18,'#aab4c6');r(x-4,GY-17,8,2,'#c9a54a');
 for(let i=-1;i<=1;i++){const h=11+s(TM*11+i*2+x)*3+(i?0:5);g.fillStyle='#ff6a1c';g.beginPath();g.moveTo(x+i*3-3,GY-5);g.lineTo(x+i*3+s(TM*7+i)*1.5,GY-5-h);g.lineTo(x+i*3+3,GY-5);g.fill();g.fillStyle='#ffd36a';g.beginPath();g.moveTo(x+i*3-1.5,GY-5);g.lineTo(x+i*3,GY-5-h*.6);g.lineTo(x+i*3+1.5,GY-5);g.fill()}
 for(let i=0;i<6;i++){const t=(TM*.6+i*.17)%1;r(x+s(TM*2+i*3)*6+i-3,GY-10-t*46,1,1,'rgba(255,'+(150+i*15)+',60,'+(1-t)+')')}}
const NC={sombra:['#5a6a8a',.6],mirela:['#8a4a6a',1],dorn:['#6a5a3a',1],brenna:['#7a3a3a',1],voz:['#4a3a7a',.65]};
function bg(){const b=E.some(e=>e.b&&e.ph===2&&e.s!=='dead'),gr=g.createLinearGradient(0,0,0,GY);gr.addColorStop(0,b?'#2a0a1e':rg.sky[0]);gr.addColorStop(1,b?'#5a1630':rg.sky[1]);g.fillStyle=gr;g.fillRect(0,0,GW,GH);
 for(let i=0;i<46;i++){const x=((hash(i)*GW*1.4-cam*.04)%GW+GW)%GW;r(x,hash(i+99)*90,1,1,'rgba(255,255,255,'+(.2+.5*Math.abs(Math.sin(TM*1.5+i)))+')')}
 glow(250,34,46,'190,170,255',.25);g.fillStyle='#ece8ff';g.beginPath();g.arc(250,34,12,0,6.28);g.fill();g.fillStyle='rgba(120,110,170,.35)';[[246,30,3],[255,38,2.5],[251,27,1.5]].forEach(c=>{g.beginPath();g.arc(c[0],c[1],c[2],0,6.28);g.fill()});
 const o1=cam*.15;g.fillStyle=mix(rg.sky[1],rg.co,.35);g.beginPath();g.moveTo(-8,GY);for(let k=Math.floor(o1/10);k<Math.floor(o1/10)+36;k++)g.lineTo(k*10-o1,GY-34-hash(k*.37)*42-(k%3)*3);g.lineTo(GW+20,GY);g.fill();
 const o2=cam*.3;g.fillStyle=mix(rg.sky[1],rg.co,.65);for(let k=Math.floor(o2/48);k<Math.floor(o2/48)+9;k++){const x=k*48-o2,h=40+hash(k*1.7)*40;g.fillRect(x,GY-h,10,h);g.beginPath();g.moveTo(x-2,GY-h);g.lineTo(x+5,GY-h-14);g.lineTo(x+12,GY-h);g.fill()}
 const o=cam*.5,L=mix(rg.co,'#a090d0',.18);g.fillStyle=g.strokeStyle=rg.co;
 if(rg.dc==='arc'){for(let i=-1;i<7;i++){const x=i*64-o%64;g.lineWidth=8;g.fillRect(x-4,56,8,GY-56);g.beginPath();g.arc(x+32,70,28,3.14,6.28);g.stroke();r(x-6,52,12,4,L);r(x-6,GY-6,12,6,L);r(x-4,56,1,GY-56,L);
  r(x+27,76,10,26,'#05030a');g.fillStyle='rgba(255,170,80,'+(.12+.05*Math.sin(TM*3+i))+')';g.fillRect(x+28,77,8,24);g.fillStyle=rg.co;r(x+31,77,2,24,rg.co);r(x+27,86,10,2,rg.co)}}
 else if(rg.dc==='house'){const gi=Math.floor(o/36);for(let i=-1;i<10;i++){const k=gi+i,x=k*36-o,h=34+hash(k)*50,ww=30;g.fillStyle=rg.co;g.fillRect(x,GY-h,ww,h);g.beginPath();g.moveTo(x-3,GY-h);g.lineTo(x+(hash(k+3)>.5?6:20),GY-h-12-hash(k+5)*8);g.lineTo(x+ww+3,GY-h+(hash(k+7)>.5?0:6));g.fill();r(x,GY-h,ww,1,L);r(x+ww-2,GY-h,2,h,'rgba(0,0,0,.35)');
  for(let j=0;j<Math.floor(h/18);j++)if(hash(k*9+j)>.35){r(x+6,GY-h+8+j*17,6,8,'#05030a');r(x+6,GY-h+8+j*17,6,8,'rgba(255,154,60,'+(.35+.15*Math.sin(TM*9+k+j))+')')}
  if(hash(k+11)>.6){r(x+ww-8,GY-h-14,3,14,rg.co);r(x+ww-9,GY-h-16,5,3,L)}}}
 else{const gi=Math.floor(o/36);for(let i=-1;i<10;i++){const k=gi+i,x=k*36-o,h=34+hash(k)*70;g.fillStyle=rg.co;g.fillRect(x,GY-h-20,7,h+20);g.lineWidth=3;g.beginPath();g.moveTo(x+3,GY-h*.6);g.lineTo(x-14,GY-h-6);g.moveTo(x+4,GY-h*.8);g.lineTo(x+22,GY-h-18);g.moveTo(x+3,GY-h-10);g.lineTo(x-6,GY-h-34);g.stroke();
  g.beginPath();g.arc(x+3,GY-h-24,15,0,6.28);g.fill();r(x+2,GY-h-20,1,h*.4,L);for(let j=0;j<3;j++)r(x-12+j*10+hash(k+j)*6,GY-h-12,1,6+hash(k*3+j)*8,'rgba(70,110,80,.5)')}}
 for(let i=0;i<3;i++){const x=((TM*(6+i*3)+i*130)%(GW+160))-80;g.fillStyle='rgba(170,160,220,'+(.05+i*.01)+')';g.beginPath();g.ellipse(x,GY-14+i*4+Math.sin(TM+i)*3,90,9,0,0,6.28);g.fill()}
 const fg=g.createLinearGradient(0,GY,0,GH);fg.addColorStop(0,mix(rg.fl,'#ffffff',.08));fg.addColorStop(1,mix(rg.fl,'#000000',.55));g.fillStyle=fg;g.fillRect(0,GY,GW,GH-GY);r(0,GY,GW,1,mix(rg.fl,'#ffffff',.3));r(0,GY+1,GW,1,'rgba(0,0,0,.35)');
 for(let row=0;row<3;row++){const yy=GY+3+row*11;r(0,yy+10,GW,1,'rgba(0,0,0,.35)');for(let k=Math.floor((cam+row*9)/26);k<Math.floor((cam+row*9)/26)+14;k++)r(k*26-cam-row*9,yy,1,10,'rgba(0,0,0,.3)')}
 for(let k=Math.floor(cam/17);k<Math.floor(cam/17)+20;k++){const x=k*17-cam,q=hash(k*2.3);if(q>.7)r(x,GY-2,1,2,'#3d6a48');else if(q>.5)r(x,GY+3+hash(k)*30,3,2,'rgba(120,110,140,.35)');else if(q<.04)r(x,GY-2,5,1,'#cfc8b4')}}
function draw(){g.save();if(G.shake>0){g.translate((R()-.5)*G.shake*2,(R()-.5)*G.shake*2);G.shake*=.85;if(G.shake<.2)G.shake=0}
 bg();const fx=[60,rg.bx-40];g.save();g.translate(-Math.round(cam),0);
 fx.forEach(fire);
 rg.npc.forEach(n=>{const c=NC[n.id]||['#4a3a5a',1];glow(n.x,GY-16,18,'255,230,140',.12);fig(n.x,P.x<n.x?-1:1,11,22,c[0],'#ffe66d',0,0,c[1])});
 rg.it.forEach(it=>{if(!S.tk[S.ri+':'+it.x]){const y=GY-14+Math.sin(TM*3)*2,w=it.w;glow(it.x,y,16,w?'125,249,255':'255,230,109',.4);g.fillStyle=w?'#7df9ff':'#ffe66d';g.beginPath();g.moveTo(it.x,y-5);g.lineTo(it.x+4,y);g.lineTo(it.x,y+5);g.lineTo(it.x-4,y);g.fill();r(it.x-1,y-3,1,3,'#fff')}});
 if(S.bk[rg.boss]&&S.ri<RG.length-1){const x=rg.w-36;r(x-3,GY-46,30,46,'#2a2238');r(x,GY-42,24,42,'#05030a');const q=g.createLinearGradient(x,0,x+24,0);q.addColorStop(0,'rgba(122,60,255,.1)');q.addColorStop(.5,'rgba(190,140,255,.55)');q.addColorStop(1,'rgba(122,60,255,.1)');g.fillStyle=q;g.fillRect(x,GY-42,24,42);for(let i=0;i<5;i++)r(x+4+((TM*20+i*9)%16),GY-8-((TM*14+i*23)%34),2,2,'rgba(255,255,255,.7)');glow(x+12,GY-20,30,'150,90',.3)}
 if(G.lock){const x=G.lock-6;for(let i=0;i<10;i++){g.fillStyle='rgba('+(150+i*8)+',60,255,'+(.16+.1*Math.sin(TM*4+i))+')';g.fillRect(x+Math.sin(TM*3+i)*2,GY-70+i*7,6,7)}}
 if(S.drop&&S.drop.r===S.ri){const y=GY-10+Math.sin(TM*4)*2;glow(S.drop.x,y,18,'255,230,109',.45);r(S.drop.x-3,y-3,6,6,'#ffe66d')}
 RK.forEach(r2=>{g.fillStyle='rgba(255,70,90,'+(.2+.3*Math.sin(r2.t*30)**2)+')';g.beginPath();g.ellipse(r2.x,GY,12,2.5,0,0,6.28);g.fill();if(r2.t>.6){const y=GY-(1-r2.t)*400;r(r2.x-6,y-12,12,12,'#5a4a42');r(r2.x-6,y-12,12,3,'#8a7868');r(r2.x+3,y-9,3,9,'#3a2e28')}});
 E.forEach(drawE);PR.forEach(q=>{if(q.c==='#ffe66d'){glow(q.x,GY-15,10,'255,230,109',.4);r(q.x-Math.sign(q.vx)*6,GY-15,10,1,'rgba(255,230,109,.5)');r(q.x-3,GY-16,6,2,'#fff2b0')}else{glow(q.x,GY-15,14,'255,110,40',.6);g.fillStyle='#ff7a1c';g.beginPath();g.arc(q.x,GY-15,3.5,0,6.28);g.fill();r(q.x-1,GY-16,2,2,'#ffe9a0')}});
 drawP();if(P.lt!==undefined);
 if(G.mode==='play'&&P.s==='idle'){const o=near();if(o){g.font='bold 8px monospace';const tw=g.measureText('['+o.k+']').width+8;r(o.x-tw/2,GY-52,tw,12,'rgba(10,6,20,.85)');g.strokeStyle='#c9a54a';g.lineWidth=1;g.strokeRect(o.x-tw/2+.5,GY-51.5,tw-1,11);tx('['+o.k+']',o.x,GY-43,'#fff','center')}}
 PT.forEach(p=>{g.globalAlpha=Math.min(1,p.l*3);r(p.x,p.y,2,2,p.c)});g.globalAlpha=1;g.restore();
 fx.forEach(x=>glow(x-cam,GY-14,72,'255,140,50',.2+.05*Math.sin(TM*13+x)));glow(P.x-cam,GY-16,50,'140,170,255',.07);
 const vg=g.createRadialGradient(GW/2,GH/2,GH*.45,GW/2,GH/2,GW*.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,10,.62)');g.fillStyle=vg;g.fillRect(-4,-4,GW+8,GH+8);
 if(P.hp/P.mhp<.3&&P.s!=='dead'){g.fillStyle='rgba(160,0,30,'+(.08+.05*Math.sin(TM*6))+')';g.fillRect(0,0,GW,GH)}
 g.restore();hud()}
function hud(){const p=P;g.font='8px monospace';
 const bar=(x,y,w,h,v,a,b)=>{r(x-2,y-2,w+4,h+4,'#c9a54a');r(x-1,y-1,w+2,h+2,'#0a0610');r(x,y,w,h,'#2a1424');const q=g.createLinearGradient(0,y,0,y+h);q.addColorStop(0,a);q.addColorStop(1,b);g.fillStyle=q;g.fillRect(x,y,Math.max(0,w*cl(v,0,1)),h);r(x,y,w*cl(v,0,1),1,'rgba(255,255,255,.35)')};
 bar(8,8,Math.min(130,p.mhp*.9),7,p.hp/p.mhp,'#e8384f','#7a1020');bar(8,19,Math.min(110,p.mst*.8),4,p.st/p.mst,p.ex>0&&Math.floor(TM*10)%2?'#ffb060':'#6be88a','#2a8a4a');
 for(let i=0;i<3;i++){const x=9+i*9,on=i<S.flasks;r(x+1,29,3,2,on?'#8a6a3a':'#3a3030');r(x,31,5,7,on?'#2f9a52':'#2a2430');if(on){r(x+1,32,1,4,'#9dffb8');glow(x+2,35,8,'90,255,140',.18)}}
 g.fillStyle='#bfa8ff';tx((S.oath?short(S.oath):'Sin juramento')+' · '+WPN().n,9,48,'#c9b8ff');
 g.font='bold 9px monospace';glow(GW-64,11,14,'176,92,255',.5);g.fillStyle='#d09aff';g.beginPath();g.arc(GW-64,11,3,0,6.28);g.fill();tx(String(S.souls),GW-8,14,'#ffe66d','right');g.font='8px monospace';g.fillStyle='#ffe66d';g.beginPath();g.moveTo(GW-64,20);g.lineTo(GW-61,23);g.lineTo(GW-64,26);g.lineTo(GW-67,23);g.fill();tx(String(S.frag),GW-8,26,'#ffe66d','right');
 const b=E.find(e=>e.b&&e.s!=='dead'&&e.aw);
 if(b){g.font='bold 9px monospace';tx(b.b.n,GW/2,GH-23,'#f0e6ff','center');bar(60,GH-17,200,5,b.hp/b.mhp,'#c0243c','#5a0e1e');for(const s of[-1,1]){r(GW/2+s*104-3,GH-20,6,10,'#c9a54a');r(GW/2+s*104-1,GH-19,2,8,'#0a0610')}}
 if(G.banner){const a=Math.min(1,G.banner.l);g.globalAlpha=a;r(0,GH/2-40,GW,36,'rgba(0,0,0,.55)');r(40,GH/2-39,GW-80,1,'#c9a54a');r(40,GH/2-5,GW-80,1,'#c9a54a');g.font='8px monospace';tx(G.banner.t,GW/2,GH/2-28,'#bfa8ff','center');g.font='bold 16px monospace';tx(G.banner.s,GW/2,GH/2-12,'#fff','center');g.globalAlpha=1}
 if(G.msgT>0){g.globalAlpha=Math.min(1,G.msgT);g.font='bold 10px monospace';tx(G.msg,GW/2,70,'#ffe66d','center');g.globalAlpha=1}
 if(G.mode==='dying'){g.fillStyle='rgba(0,0,0,'+Math.min(.75,(1.6-G.dieT)*.6)+')';g.fillRect(0,0,GW,GH);g.globalAlpha=Math.min(1,(1.6-G.dieT)*.8);g.font='bold 22px serif';glow(GW/2,GH/2,90,'192,36,60',.35);tx('HAS CAÍDO',GW/2,GH/2+6,'#c0243c','center');g.globalAlpha=1}
 if(G.win>0){const a=Math.min(.5,(2.5-G.win)*.4);g.fillStyle='rgba(255,230,109,'+a+')';g.fillRect(0,GH/2-22,GW,36);g.font='bold 18px serif';tx('JEFE DERROTADO',GW/2,GH/2+2,'#fff','center')}}

RG.forEach(q=>q.bx=q.w-330);
newP(60);spawnEn();title();
let last=performance.now();
(function loop(n){const dt=Math.min(.033,(n-last)/1000);last=n;TM+=dt;requestAnimationFrame(loop);try{update(dt);draw()}catch(e){console.error(e)}})(last);
