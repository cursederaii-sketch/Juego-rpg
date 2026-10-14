// ===== LA CAÍDA DE VALDORRA: batalla final en cuatro fases (documento de diseño narrativo) =====
// Fase I   · Salón del trono: duelo contra el Rey (umbral 100–75 %).
// Cinemática · El poder desborda el castillo, el protagonista sale por la ventana, el Rey salta tras él y ambos se estrellan en la capital.
// Fase III · Cráter: grietas, cadenas, derrumbes y decretos de Azrael (75–35 %).
// Fase IV  · La Voz ofrece el Juramento de los Olvidados (35–0 %): aperturas en el vínculo y una única sentencia que se puede sobrevivir.
// Se engancha a update/draw/spawnEn/hitE/bossDown/hud sin tocar la lógica de los demás jefes. Todo procedural.
(function(){
const C=v=>v<0?0:v>1?1:v,rp=(p,a,b)=>C((p-a)/(b-a)),ez=t=>{t=C(t);return t*t*(3-2*t)},rn=(a,b)=>a+R()*(b-a);
const hsh=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const AIR=[2.9,3.15,3.4,3.6,3.8,4.0,4.2,4.4];
const CA={on:0,cut:null,hz:[],ch:[],gv:[],sc:[],dr:[],sub:null,dec:null,sen:null,ap:0,free:0,p2:0,b1:0,apS:0,dk:0,sh:0,tm:{},musOld:null};
window.CAIDA=CA;
const RY=()=>S.rey||(S.rey={});
const CRI=()=>RG.findIndex(r=>r.id==='crater');
const snd=(k,gn,f,d,t,v,f2)=>{try{if(window.playSfx&&playSfx(k,gn))return}catch(e){}sfx(f||100,d||.3,t||'square',v||.05,f2)};
const lerp=(a,b,t)=>a+(b-a)*t;
// encuadre de la llegada al cráter: la cámara baja FRM px para que el Rey (y su silueta) quede entero en pantalla, sin cortarse arriba
const FRM=37,FIGX=GW/2,FIGY=GH/2-76+FRM;
// durante la cinemática se ocultan pausa, pantalla completa y todos los controles táctiles (body.cine en style.css)
let cineOn=false;function cineUI(on){if(on===cineOn)return;cineOn=on;document.body.classList.toggle('cine',on)}
// sin botones en pantalla: un toque en cualquier sitio cuenta como pulsación para saltar la cinemática
try{$('stage').addEventListener('pointerdown',()=>{if(CA.cut&&G.mode==='caida')CA.tap=1},{passive:true})}catch(e){}
function lockCam(){const c=CA.cut;if(c&&c.lk&&c.t<c.end){cam.x=c.lk.x;cam.y=c.lk.y}}
// glow con radio cuantizado: el juego cachea un sprite por radio entero; con radios que cambian cada fotograma se creaban cientos de degradados (tirones)
const glowQ=(x,y,r,c,a)=>{const st=r>90?24:8;glow(x,y,Math.max(st,Math.round(r/st)*st),c,a)};
const WARM=[['255,224,130',8,136,8],['255,120,60',120,216,24],['255,120,50',48,48,8],['255,220,140',32,32,8],['255,240,190',8,40,8],['255,246,200',24,24,8],['255,246,210',24,40,8]];
function warmQ(){const q=[];for(const w of WARM)for(let r=w[1];r<=w[2];r+=w[3])q.push([w[0],r]);return q}
const hx=c=>[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];
const mixc=(a,b,t)=>{const A=hx(a),B=hx(b);return 'rgb('+A.map((v,i)=>Math.round(lerp(v,B[i],t))).join(',')+')'};

// ---------- datos: el Rey con cuatro fases, el cráter y los finales ----------
// vida y resistencia del Rey: REY_HP es la vida total; REY_RES es el daño que recibe en cada fase (1 = normal)
const REY_HP=1400,REY_RES=[.75,.7,.65];
Object.assign(BS.rey,{hp:REY_HP,pf:r=>(rg&&rg.id==='trono')?0:r>.75?0:r>.35?1:2,
 ph:[{a:['bsl','bov','bstab'],s:1.05},
     {a:['bsl','blink','bstab','bov','cinder'],s:1.35,hold:.3,msg:'El juramento lo devora'},
     {a:['blink','bov','bstab','cinder','bsl'],s:1.55,hold:.35,msg:'Azrael empuña su voluntad'}]});
BEST.rey[2]='Pagó con la memoria de su pueblo y selló el pacto con Azrael, el Ángel del Último Umbral.';
BEST.rey[3]='Cuatro tramos: el salón, la caída, el cráter y el último juramento. Lee los avisos: grietas, cadenas, derrumbes y la sentencia.';
TH.crater=Object.assign({},TH.trono,{k:'crater',fl:['#3a2a34','#43313c','#32232c'],mo:'#1a1016',hi:'#7a5a62',wf:['#5a3a44','#4c3038','#3e262e'],wt:'#120a0e',wh:'#241218',ac:'#ffb06a',amb:[26,6,10,.5],fog:'230,140,110',pt:'ember',bg:'#080306',dirt:['#43332f','#382a27','#52403a']});
RG.push({id:'crater',n:'Cráter de Valdorra',act:'Acto III — El último juramento',th:'crater',cols:40,rows:34,m:2.6,dm:1.6,fl:['',''],build(W){
 W.fillO('wall');W.room(2,2,36,30,'f');
 for(let y=2;y<32;y++)for(let x=2;x<38;x++){const dx=(x-20)/15,dy=(y-17)/12;if(dx*dx+dy*dy<1)W.g('p',x,y,1,1)}
 [[6,9,3,1],[30,8,3,1],[7,24,3,1],[29,25,3,1]].forEach(([x,y,w,h])=>W.chasm(x,y,w,h));
 W.house(3,3,6,4,-1);W.house(31,3,6,4,-1);W.house(3,26,6,4,-1);W.house(31,26,6,4,-1);
 W.clr(5,3,2,1);W.clr(33,4,2,1);W.clr(4,27,2,1);W.clr(34,26,1,1);   // tejados hundidos
 [[10,10],[30,12],[10,23],[30,22]].forEach(([x,y])=>W.o('pillar',x,y,1,1));
 [[14,4],[26,4],[14,30],[26,30]].forEach(([x,y])=>W.o('brazier',x,y,1,1));
 W.o('statue',19,4,1,1);W.o('statue',21,4,1,1);
 W.sc('rubble',26,3,3,34,28,{seed:5,gap:1,avoid:'p'});W.sc('rock',9,3,3,34,28,{seed:6,gap:3,avoid:'p'});W.sc('crate',3,3,3,34,28,{seed:7,gap:3,avoid:'p'});
 W.fire(20,29);
 W.setArena({x:3,y:3,w:34,h:28},[],20,12);
}});
Object.assign(LAY,{crater:[510,1640]});LNK.push(['trono','crater']);NUMR.crater=9;
Object.assign(REGINFO,{crater:['Cráter abierto por la caída del Rey','Calles hundidas y casas derribadas','Jefe final: fases III y IV','Hoguera al borde del cráter']});
Object.assign(ENDS,{
 pacto:['Romper el pacto','El vínculo entre el Rey y Azrael se parte. Valdorra queda libre de la autoridad divina, pero pierde la protección artificial que la sostenía. La memoria regresa con la verdad y con todo lo que costó. La victoria no borra el sufrimiento que hizo falta para mantenerla.'],
 manten:['Mantener el pacto','Decides preservar el juramento. Valdorra sobrevivirá bajo el mismo orden, pero el ciclo del olvido continúa. Has vencido con la espada y no has resuelto nada: la estabilidad tiene un precio, y lo sabes mientras lo pagas.'],
 guarda:['Guardián de los recuerdos','Cargas con lo que el reino quiso olvidar. No dejas que Azrael conserve su autoridad ni devuelves toda la carga a Valdorra: te conviertes en quien recuerda, para que el mismo pacto no vuelva a firmarse. El coste es tuyo, y es el centro de tu final.']});
CUT.rey=()=>{const o=RY().oath;return D('El Rey sin Nombre',o===1?'«Yo juré que Valdorra jamás caería... y la derribé yo mismo. Ahora que su voz calla, solo oigo las calles que rompí.»<br>Decide qué quedará del reino.':'«Yo juré que Valdorra jamás caería. Cumplí el juramento, y el reino cayó igual.»<br>Decide qué quedará del reino.',null,()=>memD('rey',finalChoice()))};
{const fc=finalChoice;finalChoice=function(){const d=fc(),o=RY().oath,add=[['Romper el pacto: que Valdorra recuerde',()=>fin('pacto')],['Mantener el pacto: preservar el orden',()=>fin('manten')]];
 if(o===1)add.push(['Guardián de los recuerdos: cargarlos tú',()=>fin('guarda')]);
 d.n='El cráter de Valdorra';d.o=add.concat(d.o||[]);return d}}

// ---------- subtítulos de combate (la Voz, Azrael, el Rey) ----------
function sub(w,t,l){CA.sub={w,t,l:l||3,m:l||3}}
function wrap(s,w,sz){g.font=(sz||6)+'px '+FONT;const ws=s.split(' '),L=[];let c='';for(const x of ws){const t=c?c+' '+x:x;if(g.measureText(t).width>w&&c){L.push(c);c=x}else c=t}if(c)L.push(c);return L}

// ---------- el Rey en el cráter ----------
function resetHaz(){CA.hz=[];CA.ch=[];CA.gv=[];CA.dr=[];CA.sc=[];CA.dec=null;CA.sen=null;CA.ap=0;CA.free=0;CA.b1=0;CA.apS=0;CA.sub=null;CA.tm={cr:2.6,ch:6,gv:8,dr:4.5,dc:7,sn:9}}
function mkBoss(){const R_=RY();if(R_.done)return;resetHaz();CA.on=1;CA.p2=(R_.hpf||.75)<=.35?1:0;
 const be=mk('boss',20*16+8,12*16+8,'rey');be.arena=1;be.hp=Math.max(1,Math.round(be.mhp*(R_.hpf||.75)));be.ph=CA.p2?2:1;see(be);be.s='stg';be.tm=0;be.stgT=1.3;be.cd=1.2;be.fell=1;E.push(be);G.bossOn=true;W.setGate(true);
 if(P)P.sur=R_.oath===1?1:0}
{const se=spawnEn;spawnEn=function(){se();CA.on=0;if(rg&&rg.id==='crater')mkBoss()}}
{const lr=loadRegion;loadRegion=function(i,fi,at){if(RG[i].id!=='crater')CA.on=0;const r_=lr(i,fi,at);if(rg.id==='crater'&&CA.on)P.sur=RY().oath===1?1:0;return r_}}

function pseg(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy||1,t=C(((px-x1)*dx+(py-y1)*dy)/l2),qx=x1+dx*t,qy=y1+dy*t;return Math.hypot(px-qx,py-qy)}
function hurt(d,fx,fy){if(P.s==='dead'||dodging())return false;takeHit(d,fx,fy);return true}
function crack(e,n){const a0=Math.atan2(P.y-e.y,P.x-e.x);snd('rumble',.45,180,.6,'sawtooth',.05,360);
 for(let i=0;i<n;i++){const a=a0+(n>1?(i-(n-1)/2)*.42:(R()-.5)*.22),L=250;CA.hz.push({x1:e.x,y1:e.y-4,x2:e.x+Math.cos(a)*L,y2:e.y-4+Math.sin(a)*L,t:0,tel:n>1?.92:1.05,w:10,f:0,sd:R()*99})}}
function chain(){const o=R()<.5?'h':'v',p=o==='h'?P.y:P.x,s=R()<.5?-1:1;snd('alarm',.3,260,.5,'sawtooth',.04,520);CA.ch.push({o,p,t:0,tel:1.2,f:0},{o,p:p+s*64,t:0,tel:1.2,f:0})}
function gravity(){const a=W.arena,ang=R()*6.283,d=rn(26,60),x=cl(P.x+Math.cos(ang)*d,(a.x+3)*16,(a.x+a.w-3)*16),y=cl(P.y+Math.sin(ang)*d,(a.y+3)*16,(a.y+a.h-3)*16);
 snd('magic',.4,500,.7,'sine',.04,260);CA.gv.push({x,y,t:0,tel:1,dur:3.6,r:46,tk:0})}
function derrumbe(){const a=W.arena,x=cl(P.x+(R()-.5)*100,(a.x+2)*16,(a.x+a.w-2)*16),y=cl(P.y+(R()-.5)*80,(a.y+2)*16,(a.y+a.h-2)*16),r={x,y,t:0};RK.push(r);CA.dr.push(r)}
function decree(e){const k=(CA.dk=(CA.dk+1)%2)?'flask':'aliento',tx_=k==='flask'?'«Ningún frasco será bebido.»':'«El aliento te será quitado.»';snd('bell',.6,240,.9,'sine',.07,300);
 if(RY().oath===1&&e.ph===2){CA.ap=3;toast('Resistes la voluntad de Azrael');FX.push({k:'ring',x:P.x,y:P.y,l:.7,m:.7,c:'255,230,109',big:1});snd('chime_up',.6,600,1,'sine',.06,1200);
  if(!CA.apS){CA.apS=1;sub('La Voz','¡El vínculo se abre! ¡Golpéalo ahora!',3.2)}else sub('Azrael',tx_,2.2)}
 else{CA.dec={k,l:6,m:6};sub('Azrael',tx_,2.6)}}
function offer(e){CA.hz=[];CA.ch=[];CA.gv=[];CA.sen=null;CA.dec=null;CA.ap=0;RK.length=0;PR.length=0;e.s='stg';e.tm=0;e.stgT=.8;
 say(D('La Voz','«No puedo vencerlo por ti.»<br><i>'+nm()+':</i> «Entonces, ¿qué puedes darme?»<br>«La libertad de desobedecerlo. Pero tendrás que recordar lo que el reino quiso olvidar.»',[
  ['Aceptar el Juramento de los Olvidados',()=>{const R_=RY();R_.oath=1;R_.hpf=.35;P.sur=1;FX.push({k:'ring',x:P.x,y:P.y,l:1.1,m:1.1,c:'255,230,109',big:1});spark(P.x,P.y-10,'#ffe66d',26,18,1.4);G.shake=5;snd('choir',.8,150,1.2,'sine',.08,300);toast('Juramento de los Olvidados');
    return D('La Voz','Entonces recuerda. Cuando Azrael imponga su voluntad, resistirás y el vínculo del Rey se abrirá un instante: golpéalo. Y una vez, solo una, la promesa te sostendrá frente a su sentencia.')}],
  ['Rechazarlo: no cargaré con eso',()=>{const R_=RY();R_.oath=-1;R_.hpf=.35;toast('Rechazas el juramento');return D('La Voz','Entonces lucharás solo. Que el reino no te lo reproche.')}]]))}
function free(e){CA.free=1;CA.ap=0;CA.hz=[];CA.ch=[];CA.gv=[];CA.sen=null;CA.dec=null;RK.length=0;e.s='stg';e.tm=0;e.stgT=1.6;G.shake=8;G.hs=.25;CA.fl=.8;
 FX.push({k:'ring',x:e.x,y:e.y,l:1.2,m:1.2,c:'255,230,109',big:1});spark(e.x,e.y-16,'#ffe66d',34,20,1.6);snd('boom_long',.7,60,1,'sawtooth',.1,30);toast('El vínculo se rompe');
 sub('La Voz','El vínculo cede. Ahora solo queda él.',3.6)}
function sentencia(){CA.sen={x:P.x,y:P.y,t:0,lock:2.1,fire:2.8,f:0};snd('bell',.9,240,.9,'sine',.07,300);sub('Azrael','«Todo juramento se cumple.»',2.6)}

function updHaz(dt){
 for(const h of CA.hz){h.t+=dt;if(!h.f&&h.t>=h.tel){h.f=1;G.shake=Math.max(G.shake,5);snd('boom',.55,70,.5,'sawtooth',.1,40);
   for(let i=0;i<8;i++){const q=Math.random();spark(lerp(h.x1,h.x2,q),lerp(h.y1,h.y2,q),'#ffd070',2,6,.9)}
   if(pseg(P.x,P.y,h.x1,h.y1,h.x2,h.y2)<h.w*.5+3)hurt(24,P.x-h.x1,P.y-h.y1);
   CA.sc.push({x1:h.x1,y1:h.y1,x2:h.x2,y2:h.y2,sd:h.sd,a:1});if(CA.sc.length>14)CA.sc.shift()}}
 CA.hz=CA.hz.filter(h=>h.t<h.tel+.4);
 for(const c of CA.ch){c.t+=dt;if(!c.f&&c.t>=c.tel){c.f=1;G.shake=Math.max(G.shake,4);snd('metal',.5,1000,.2,'square',.04);
   if(Math.abs((c.o==='h'?P.y:P.x)-c.p)<8)hurt(20,c.o==='h'?0:P.x-c.p,c.o==='h'?P.y-c.p:0)}}
 CA.ch=CA.ch.filter(c=>c.t<c.tel+.45);
 for(const z of CA.gv){z.t+=dt;if(z.t>z.tel){const d=Math.hypot(z.x-P.x,z.y-P.y);if(d<z.r&&P.s!=='dead'&&P.s!=='dodge'){const k=(1-d/z.r*.5)*46*dt/(d||1);W.move(P,(z.x-P.x)*k,(z.y-P.y)*k,P.hw,P.hh);
    if(d<9){z.tk-=dt;if(z.tk<=0){z.tk=.6;hurt(7,P.x-z.x,P.y-z.y)}}}}}
 CA.gv=CA.gv.filter(z=>z.t<z.tel+z.dur);
 for(const r of CA.dr){if(r.d&&!r.p){r.p=1;const tx_=r.x>>4,ty_=r.y>>4,i=W.i(tx_,ty_);
   if(W.ok(tx_,ty_)&&!W.on[i]&&W.gd[i]!=='k'&&Math.hypot(P.x-(tx_*16+8),P.y-(ty_*16+8))>14&&!E.some(q=>q.s!=='dead'&&Math.hypot(q.x-(tx_*16+8),q.y-(ty_*16+8))<16)){W.on[i]=R()<.55?'rock':'pillar';W.ov[i]=R()*255|0}}}
 CA.dr=CA.dr.filter(r=>!r.p);
 const s=CA.sen;if(s){s.t+=dt;if(s.t<s.lock){s.x+=(P.x-s.x)*Math.min(1,dt*2.4);s.y+=(P.y-s.y)*Math.min(1,dt*2.4)}
  if(!s.f&&s.t>=s.fire){s.f=1;G.shake=9;G.hs=.12;snd('ult',.9,70,1.2,'sawtooth',.12,35);spark(s.x,s.y,'#ffe66d',30,10,1.5);
   if(Math.hypot(P.x-s.x,P.y-s.y)<26&&P.s!=='dead'&&!dodging()){if(P.sur>0){P.sur=0;takeHit(Math.max(0,P.hp-1),P.x-s.x,P.y-s.y);CA.fl=.6;toast('La promesa te sostiene');sub('La Voz','Una vez. Solo una.',2.4);snd('choir',.9,150,1.2,'sine',.08,300)}else takeHit(9999,P.x-s.x,P.y-s.y)}}
  if(s.t>s.fire+.5)CA.sen=null}
 if(CA.dec){CA.dec.l-=dt;if(CA.dec.k==='aliento')P.sd=Math.max(P.sd,.5);if(CA.dec.l<=0)CA.dec=null}
 if(CA.ap>0)CA.ap-=dt;
 if(CA.sub){CA.sub.l-=dt;if(CA.sub.l<=0)CA.sub=null}
 if(CA.fl>0)CA.fl-=dt*2}
function rey(dt){const e=E.find(q=>q.id==='rey'&&q.b);if(!e||e.s==='dead')return;
 if(rg.id==='trono'){if(!e.fell&&e.aw&&P.s!=='dead'&&e.hp/e.mhp<=.75){e.fell=1;startCut(e)}return}
 if(rg.id!=='crater'||!CA.on)return;
 updHaz(dt);
 const R_=RY(),r=e.hp/e.mhp,ph=e.ph,m=CA.tm,fast=ph===2;
 if(ph>=1&&!CA.b1&&r<.62){CA.b1=1;sub('La Voz','Ese poder no es suyo: es el precio de su promesa.',4.2)}
 if(ph===2&&!CA.p2){CA.p2=1;if(R_.oath==null){offer(e);return}}
 if(fast&&R_.oath===1&&!CA.free&&r<=.1){free(e);return}
 if(CA.free)return;
 if((m.cr-=dt)<=0){m.cr=fast?2.7:3.5;crack(e,fast?2:1)}
 if((r<.58||fast)&&(m.ch-=dt)<=0){m.ch=fast?6:7.5;chain()}
 if(fast&&(m.gv-=dt)<=0){m.gv=11;gravity()}
 if((m.dr-=dt)<=0){m.dr=fast?6.5:7;derrumbe()}
 if((r<.62||fast)&&(m.dc-=dt)<=0){m.dc=fast?9:15;decree(e)}
 if(fast&&!CA.sen&&(m.sn-=dt)<=0){m.sn=17;sentencia()}}

// ---------- daño al Rey: autoridad de Azrael y aperturas del vínculo ----------
{const h=hitE;hitE=function(e,d,k,v){if(e&&e.id==='rey'&&e.b&&rg.id==='crater'&&e.ph===2&&RY().oath===1&&!CA.free)d*=CA.ap>0?1.8:.3;return h.call(this,e,d,k,v)}}
// resistencia del Rey: recibe menos daño según la fase y los golpes pesados ya no lo aturden (la parada y la contra sí)
{const h=hitE;hitE=function(e,d,k,v){if(!(e&&e.id==='rey'&&e.b))return h.call(this,e,d,k,v);const s0=e.s,t0=e.tm,g0=e.stgT,r0=e.rip;d*=REY_RES[Math.min(2,e.ph|0)];const o=h.call(this,e,d,k,v);if(s0!=='stg'&&e.s==='stg'&&!r0&&e.hp>0){e.s=s0;e.tm=t0;e.stgT=g0}return o}}
{const b=bossDown;bossDown=function(e){if(e&&e.id==='rey'){CA.on=0;CA.hz=[];CA.ch=[];CA.gv=[];CA.sen=null;CA.dec=null;RY().done=1}return b.apply(this,arguments)}}

// ---------- cinemática: el poder desborda, la caída y el impacto ----------
function startCut(e){const f=!RY().seenFall;relAll();if(P.s!=='idle'&&P.s!=='dead'){P.s='idle';P.t=0}
 CA.cut={t:0,re:0,spd:f?1:1.55,hpf:e.hp/e.mhp,st:{},hide:1,end:10,wq:warmQ(),sk:0,pr:1};G.mode='caida';RY().seenFall=1;
 if(CFG.music!=null){CA.musOld=CFG.music}}
function arrive(){const c=CA.cut,hp=P.hp,st=P.st,i=CRI(),R_=RY();R_.hpf=c.hpf>.75?.75:c.hpf;R_.done=0;
 const k=i+':0';if(!S.fires.includes(k))S.fires.push(k);S.bf={r:i,x:0};
 loadRegion(i,0);P.hp=Math.max(1,Math.min(P.mhp,hp));P.st=st;P.x=20*16+8;P.y=17*16+4;P.fx=0;P.fy=-1;P.ax=0;P.ay=-1;cam.x=cl(P.x-GW/2,0,W.cols*16-GW);cam.y=cl(P.y-GH/2-FRM,0,W.rows*16-GH);c.lk={x:cam.x,y:cam.y};save()}
function endDialog(){
 say(D('La Voz','«El juramento está devorándolo.»<br><i>'+nm()+':</i> «¿Qué le hizo?»<br>«Le concedió el poder para preservar su reino. Nunca le prometió que sabría salvarlo.»',null,()=>D('El Rey sin Nombre','«Yo juré que Valdorra jamás caería.»<br><i>La Voz:</i> «Y nosotros juramos que jamás seríamos olvidados.»<br>«No comprendéis lo que ocurrirá cuando él se marche.»<br><i>La Voz:</i> «Lo comprendemos. Fuimos nosotros quienes tuvimos que vivirlo.»')))}
function tickCut(dt){const c=CA.cut;c.re+=dt;
 for(let i=0;i<3&&c.wq.length;i++){const w=c.wq.shift();try{glowSpr(w[0],w[1])}catch(e){}}c.t+=dt*c.spd;let t=c.t;const once=(k,t0)=>{if(c.st[k]||t<t0)return false;c.st[k]=1;return true};
 {const any=!!(held.light||held.heavy||held.dodge||held.act||buf.light||buf.heavy||buf.dodge||buf.act||CA.tap);CA.tap=0;if(c.sk>0)c.sk-=dt;
  if(any&&!c.pr&&c.re>3&&t<7){if(c.sk>0){c.t=t=7;c.sk=0;relAll()}else c.sk=2}c.pr=any}
 if(t<2.45)G.shake=Math.max(G.shake,.6+4.6*rp(t,0,2.3));
 if(once('s0',0)){snd('rumble',.7,60,2,'sine',.09,40)}
 if(once('s1',.6)){G.shake=7;snd('boom',.8,70,.6,'sawtooth',.1,40)}
 if(once('s2',1.3)){snd('rumble',.8,90,1.2,'sine',.08,45)}
 if(once('s3',2.15)){G.shake=10;snd('boom_long',1,60,1,'sawtooth',.12,30)}
 if(t<2.4&&t>.2){c.acc=(c.acc||0)+dt;if(c.acc>.07){c.acc=0;PT.push({k:'s',x:cam.x+R()*GW,y:cam.y+R()*GH*.7,z:90+R()*90,vx:(R()-.5)*20,vy:0,vz:-30,l:.9,c:R()<.5?'#5a4a62':'#8a7a92'})}}
 if(once('c0',2.7)){snd('metal',.5,1200,.3,'square',.04,500)}
 if(once('c1',3.4)){snd('roar',.7,90,.6,'sawtooth',.08,60)}
 AIR.forEach((q,i)=>{if(once('k'+i,q+2.5)){if(i%2)snd('parry',.7,1000,.15,'triangle',.05,1500);else snd('slam',.6,120,.2,'sawtooth',.07,60)}});
 if(once('imp',7)){G.shake=0;snd('boom_long',1,50,1.4,'sawtooth',.14,28);snd('slam',.9,70,.4,'sawtooth',.1,40);try{CFG.music=0}catch(e){}}
 if(once('arr',8)){arrive()}
 if(once('mus',8.6)){try{if(CA.musOld!=null)CFG.music=CA.musOld}catch(e){}}
 if(t>=8.5){G.shake=0}
 c.hide=t<9.2;
 if(t>=9.2&&G.mode==='caida'){G.mode='play';relAll();endDialog()}
 if(t>=c.end){CA.cut=null;try{if(CA.musOld!=null)CFG.music=CA.musOld}catch(e){}}}
// ---- dibujo de la cinemática ----
// ---------- cráter en el suelo (se dibuja DEBAJO de los personajes) y figura blanca de la nueva fase ----------
const CR={x:20*16+8,y:15*16+12,rx:92,ry:44};
let crSpr=null;
function craterSpr(){if(crSpr)return crSpr;const W_=CR.rx*2+40,H_=CR.ry*2+30,c=mkc(W_,H_),x=c.getContext('2d'),cx=W_/2,cy=H_/2;
 x.fillStyle='rgba(36,24,26,.55)';x.beginPath();x.ellipse(cx,cy,CR.rx+14,CR.ry+8,0,0,6.283);x.fill();            // polvo y escombro alrededor
 for(let i=0;i<70;i++){const a=hsh(i)*6.283,r=.85+hsh(i+3)*.25,px=cx+Math.cos(a)*(CR.rx+6)*r,py=cy+Math.sin(a)*(CR.ry+3)*r;x.fillStyle=hsh(i+9)<.5?'#4a3a38':'#2a1c1e';x.fillRect(Math.round(px),Math.round(py),2+hsh(i+5)*3|0,2)}
 for(let i=0;i<16;i++){const a=i/16*6.283+hsh(i)*.3,l=18+hsh(i+7)*30;x.strokeStyle='#08030a';x.lineWidth=2;x.beginPath();let X=cx+Math.cos(a)*CR.rx*.8,Y=cy+Math.sin(a)*CR.ry*.8;x.moveTo(X,Y);
  for(let s_=1;s_<=6;s_++){X+=Math.cos(a)*l/6+(hsh(i*7+s_)-.5)*5;Y+=Math.sin(a)*l/6*.5+(hsh(i*5+s_)-.5)*3;x.lineTo(X,Y)}x.stroke();x.strokeStyle='rgba(255,140,70,.55)';x.lineWidth=1;x.stroke()}
 const q=x.createRadialGradient(cx,cy,4,cx,cy,CR.rx);q.addColorStop(0,'#05020a');q.addColorStop(.7,'#14080c');q.addColorStop(1,'#2a1a1c');
 x.fillStyle=q;x.beginPath();x.ellipse(cx,cy,CR.rx*.84,CR.ry*.84,0,0,6.283);x.fill();
 x.strokeStyle='#6a4a44';x.lineWidth=2;x.beginPath();x.ellipse(cx,cy,CR.rx*.84,CR.ry*.84,0,0,6.283);x.stroke();
 x.strokeStyle='rgba(255,150,80,.5)';x.lineWidth=1;x.beginPath();x.ellipse(cx,cy,CR.rx*.84-2,CR.ry*.84-1,0,0,6.283);x.stroke();
 return crSpr=c}
function drawCrater(){if(!CA.on||!rg||rg.id!=='crater')return;const s=craterSpr();g.drawImage(s,Math.round(CR.x-s.width/2),Math.round(CR.y-s.height/2));
 g.save();g.globalCompositeOperation='lighter';g.fillStyle='rgba(255,110,50,'+(.05+.03*Math.sin(TM*3))+')';g.beginPath();g.ellipse(CR.x,CR.y,CR.rx*.6,CR.ry*.6,0,0,6.283);g.fill();g.restore()}
window.GROUND=drawCrater;
// cráter que se abre en el polvo durante la cinemática (coordenadas de pantalla; centro = donde quedará el real)
function craterFx(t,al){const k=ez(rp(t,7.0,7.9)),cx=GW/2,cy=GH/2+(CR.y-276)+FRM,rx=CR.rx*k,ry=CR.ry*k;if(k<=0||al<=0)return;
 g.save();g.globalAlpha=al;const q=g.createRadialGradient(cx,cy,2,cx,cy,Math.max(3,rx));q.addColorStop(0,'#05020a');q.addColorStop(.8,'#14080c');q.addColorStop(1,'#3a2a2a');
 g.fillStyle=q;g.beginPath();g.ellipse(cx,cy,rx*.84,ry*.84,0,0,6.283);g.fill();g.strokeStyle='#8a6a5e';g.lineWidth=2;g.stroke();
 g.strokeStyle='rgba(255,150,80,.6)';g.lineWidth=1;for(let i=0;i<14;i++){const a=i/14*6.283+hsh(i)*.3,l=(16+hsh(i+7)*34)*k;g.beginPath();g.moveTo(cx+Math.cos(a)*rx*.84,cy+Math.sin(a)*ry*.84);g.lineTo(cx+Math.cos(a)*(rx*.84+l),cy+Math.sin(a)*(ry*.84+l*.5));g.stroke()}
 g.restore()}
// la figura blanca y brillante que sale del cráter: anuncia la nueva fase del jefe
function figFx(t,fx,fy){const a=rp(t,7.5,8.3)*(1-rp(t,9.0,9.8));if(a<=0)return;const pu=.5+.5*Math.sin(t*14),sc=1+.12*rp(t,7.5,9),up=rp(t,7.5,9)*10;
 g.save();g.globalCompositeOperation='lighter';
 const col=g.createLinearGradient(0,fy-220,0,fy+4);col.addColorStop(0,'rgba(255,255,255,0)');col.addColorStop(.7,'rgba(255,250,235,'+.32*a+')');col.addColorStop(1,'rgba(255,255,255,'+.55*a+')');
 g.fillStyle=col;g.fillRect(fx-16-8*pu,fy-220,32+16*pu,224);g.fillStyle='rgba(255,255,255,'+.5*a+')';g.fillRect(fx-3,fy-220,6,224);
 for(let i=0;i<3;i++){const r=((t*1.1+i/3)%1);g.strokeStyle='rgba(255,252,240,'+.7*a*(1-r)+')';g.lineWidth=2;g.beginPath();g.ellipse(fx,fy,10+90*r,4+34*r,0,0,6.283);g.stroke()}
 g.restore();glowQ(fx,fy-28,72+30*pu,'255,255,255',.55*a);
 g.save();g.globalAlpha=a;g.translate(fx,fy);g.scale(sc,sc);g.translate(-fx,-fy);body('rey1',fx,fy-up/sc,0,1,'idle',(t*3|0),{tint:'#ffffff'});g.restore();
 g.save();g.globalCompositeOperation='lighter';g.globalAlpha=a*.6;g.translate(fx,fy);g.scale(sc,sc);g.translate(-fx,-fy);body('rey1',fx,fy-up/sc,0,1,'idle',(t*3|0),{tint:'#ffffff'});g.restore();
 for(let i=0;i<22;i++){const ph=(t*.9+hsh(i))%1,x=fx+(hsh(i+3)-.5)*70,y=fy-ph*150;g.fillStyle='rgba(255,252,235,'+a*(1-ph)*.9+')';g.fillRect(Math.round(x),Math.round(y),2,2)}
 if(a>.15)cap('FASE III',a,GH-34)}

function bars(h){if(h>0){g.fillStyle='#000';g.fillRect(0,0,GW,h);g.fillRect(0,GH-h,GW,h);fr(0,h,GW,1,'rgba(201,165,74,.5)');fr(0,GH-h-1,GW,1,'rgba(201,165,74,.5)')}}
function cap(s,a,y){if(a<=0)return;g.globalAlpha=a;tx(s,GW/2,y||GH-8,'#f4e2b0','center',7);g.globalAlpha=1}
function house(x,by,w,h,col,roof,lit,sd){fr(x,by-h,w,h,col);g.fillStyle=roof;g.beginPath();g.moveTo(x-2,by-h);g.lineTo(x+w/2,by-h-w*.38);g.lineTo(x+w+2,by-h);g.fill();
 for(let j=0;j<3;j++)for(let i=0;i<Math.floor(w/9);i++){if(hsh(sd+i*7+j*3)<.55)continue;const lt=hsh(sd+i+j*11)<.5;fr(x+3+i*9,by-h+5+j*10,3,5,lt?lit:'#0a0510')}}
function drawA(c){const t=c.t,e=E.find(q=>q.id==='rey'),sx=e?e.x-cam.x:GW/2,sy=e?e.y-cam.y:GH/2;
 g.fillStyle='rgba(12,0,24,'+.38*rp(t,0,2)+')';g.fillRect(0,0,GW,GH);
 const k=rp(t,.2,2.2);glowQ(sx,sy-18,40+90*k,'255,224,130',.12+.45*k);
 for(let i=0;i<3;i++){const r=(t*80+i*55)%170;g.strokeStyle='rgba(255,226,140,'+.5*(1-r/170)*k+')';g.lineWidth=2;g.beginPath();g.ellipse(sx,sy,r,r*.5,0,0,6.283);g.stroke()}
 g.strokeStyle='rgba(0,0,0,.8)';g.lineWidth=1;
 for(let i=0;i<9;i++){const gr=rp(t,.35+i*.12,1.9);if(gr<=0)continue;let x=hsh(i)*GW,y=i%2?GH:0;const dir=i%2?-1:1;g.beginPath();g.moveTo(x,y);for(let s=1;s<=14*gr;s++){x+=(hsh(i*9+s)-.5)*14;y+=dir*(7+hsh(i*5+s)*7);g.lineTo(x,y)}g.stroke();g.strokeStyle='rgba(255,200,110,.35)';g.stroke();g.strokeStyle='rgba(0,0,0,.8)'}
 const b=Math.round(22*ez(t/.4));bars(b);
 cap('El trono se rompe.',rp(t,.5,.7)*(1-rp(t,1.5,1.7)));cap('Una onda de energía atraviesa el salón.',rp(t,1.7,1.9)*(1-rp(t,2.2,2.4)));
 const fl=rp(t,2.1,2.4)*(t<2.5?1:0);if(fl>0){g.fillStyle='rgba(255,252,235,'+fl+')';g.fillRect(0,0,GW,GH)}}
function drawFull(c){const t=c.t,u=Math.min(4.5,Math.max(0,t-2.5)),k=u/4.5,gk=ez(k);
 g.save();const shk=t>=7&&t<7.4?9*(1-(t-7)/.4):0,cl_=AIR.reduce((a,x)=>a+Math.max(0,1-Math.abs(u-x)*8),0);g.translate(Math.round((hsh(TM*37)-.5)*(shk*2+cl_*3)),Math.round((hsh(TM*53)-.5)*(shk*2+cl_*3)));
 const q=g.createLinearGradient(0,0,0,GH);q.addColorStop(0,'#0c0618');q.addColorStop(.55,'#2a1030');q.addColorStop(1,mixc('#6a2a22','#d0602a',k));g.fillStyle=q;g.fillRect(-12,-12,GW+24,GH+24);
 glowQ(GW*.55,GH,120+80*k,'255,120,60',.15+.25*k);
 // ceniza y brasas que suben (velocidad de caída)
 for(let i=0;i<48;i++){const sp=140+hsh(i+7)*260,x=hsh(i)*GW,y=((hsh(i+3)*GH*2-u*sp*(.5+k))%(GH+50)+GH+50)%(GH+50)-20;g.fillStyle='rgba(255,'+(170+hsh(i)*60|0)+',120,'+(.1+hsh(i+9)*.2)+')';g.fillRect(Math.round(x),Math.round(y),1,Math.round(4+sp*.04))}
 // castillo que se derrumba (a la izquierda, sube y desaparece)
 const cy=-(u*u*26+u*80);
 for(let j=0;j<6;j++){const x=j*30-14,w=28,h=150+hsh(j+4)*90,top=cy+(j%2?44:0)-(j===2?30:0);fr(x,top,w,h+400,'#12081e');fr(x,top,2,h+400,'#2a1840');for(let s=0;s<4;s++)if(hsh(j*5+s)<.7)fr(x+s*7,top-4,5,4,'#12081e');
  for(let wy=0;wy<9;wy++)for(let wx=0;wx<3;wx++){if(hsh(j*31+wy*3+wx)<.45)continue;fr(x+4+wx*9,top+16+wy*22,3,6,hsh(j*13+wy)<.3?'#ff9a3c':'#2a1a3a')}
  glowQ(x+w/2,top+h*.4,48,'255,120,50',.08+.1*k)}
 const wxp=92,wyp=cy+120;if(u<1.4){g.fillStyle='#05020a';g.beginPath();g.moveTo(wxp-9,wyp+36);g.lineTo(wxp-9,wyp+8);g.arc(wxp,wyp+8,9,Math.PI,0);g.lineTo(wxp+9,wyp+36);g.fill();glowQ(wxp,wyp+16,34,'255,220,140',.35*(1-u/1.4))}
 for(let i=0;i<18;i++){const ti=hsh(i)*3.4;if(u<ti)continue;const dt_=u-ti,x=20+hsh(i+2)*170+dt_*16,y=40+hsh(i+8)*130+dt_*dt_*70-(cy<0?cy*.35:0),s=4+hsh(i+5)*7;g.save();g.translate(x,y);g.rotate(dt_*(2+hsh(i)*3));fr(-s/2,-s/2,s,s*.8,'#3a2a44');fr(-s/2,-s/2,s,1,'#6a5a7a');g.restore()}
 for(let i=0;i<10;i++){const ti=.05+hsh(i+20)*.5,dt_=u-ti;if(dt_<0||dt_>1.4)continue;const ang=hsh(i)*6.283,sp=60+hsh(i+3)*120,x=wxp+Math.cos(ang)*sp*dt_,y=wyp+8+Math.sin(ang)*sp*dt_*.6+dt_*dt_*50;g.fillStyle='rgba(220,235,255,'+(1-dt_/1.4)+')';g.fillRect(Math.round(x),Math.round(y),3,2)}
 // la capital que sube al encuentro
 for(let L=0;L<2;L++){const sc=(L?1:.6)*(1+gk*(L?1.7:1)),by=GH+(L?60:20)*(1-gk*.0)+(1-gk)*(L?170:110)+gk*(L?40:0);g.save();g.translate(GW*.55,by);g.scale(sc,sc);
  for(let i=0;i<14;i++){const x=(i-7)*40+(hsh(i+L*9)-.5)*10,h=34+hsh(i+L*4)*50;house(x,0,32,h,L?'#1a0e20':'#100816',L?'#24122c':'#160c1e','#ffb050',i*13+L)}
  g.restore()}
 if(k>.45){const pk=rp(k,.45,1);g.save();g.translate(GW*.55,GH-8-(1-gk)*20);g.strokeStyle='rgba(255,170,100,'+.5*pk+')';g.lineWidth=1;g.beginPath();g.ellipse(0,0,60*pk,16*pk,0,0,6.283);g.stroke();g.restore()}
 // los dos cuerpos: el Rey en fase III (sin arma) y nosotros se baten en el aire mientras caen
 const FS=AIR,fight=u>=2.9,met=rp(u,.9,2.9);
 const lung=w=>{let m=0;for(let i=0;i<FS.length;i++){if(i%2!==w)continue;const d=u-FS[i];if(d>=0&&d<.3)m=Math.max(m,Math.sin(d/.3*Math.PI))}return m};
 const lk=fight?lung(0):0,lp=fight?lung(1):0;
 let sw=0;for(let i=1;i<FS.length;i+=2){const d=u-FS[i];if(d>=0&&d<.3)sw=C(d/.2)}
 const px0=lerp(104,GW*.55,ez(u/2.8)),py0=lerp(70,GH*.64,gk)+Math.sin(u*6)*3,
  px=px0-(fight?14:0)+lp*20-lk*5,py=py0+(fight?Math.sin(u*9)*3-lp*3:0),
  kx=lerp(88,px0+16,ez(met))-lk*20+lp*5,ky=fight?py0-4+Math.sin(u*7)*4-lk*3:lerp(-50,py0-4,ez(met)),
  dive=u>4.1?Math.pow(u-4.1,2)*260:0;
 const SZ=2.1,big=(x,y,f)=>{g.save();g.translate(x,y);g.scale(SZ,SZ);g.translate(-x,-y);f();g.restore()};
 if(u>.8)big(kx,ky+dive,()=>body('rey1',kx,ky+dive,-1,0,lk>.05?'act':'wind',(TM*8|0),{rot:lerp(.55,-.12,met)-lk*.4+(fight?Math.sin(u*6)*.08:0)}));
 big(px,py+dive,()=>{body('player',px,py+dive,1,0,lp>.05?'act':'hit',(TM*6|0),{rot:(1-met)*Math.sin(u*3)*1.2+(fight?.12+lp*.35+Math.sin(u*5)*.06:0)});
  weapon('sword',px+5,py+dive-11,fight?(sw>0?-1.3+2.4*sw:.2+Math.sin(u*8)*.3):.5+Math.sin(u*8)*.5,14,{glow:'125,249,255'})});
 // choques en el aire: destello, rayos y arco del golpe (par = golpe del Rey, impar = el nuestro)
 for(let i=0;i<FS.length;i++){const d=u-FS[i];if(d<0||d>.35)continue;const f=1-d/.35,mx=(px+kx)/2,my=(py+ky)/2-6+dive,kg=i%2===0;
  glowQ(mx,my,30*f+8,kg?'255,200,120':'200,245,255',.6*f);g.strokeStyle='rgba(255,246,210,'+f+')';g.lineWidth=1;
  for(let s_=0;s_<9;s_++){const a=s_*.7+FS[i]*3;g.beginPath();g.moveTo(mx+Math.cos(a)*5,my+Math.sin(a)*5);g.lineTo(mx+Math.cos(a)*(10+30*(1-f)),my+Math.sin(a)*(10+30*(1-f)));g.stroke()}
  g.save();g.globalCompositeOperation='lighter';g.strokeStyle=kg?'rgba(255,170,90,'+f+')':'rgba(150,240,255,'+f+')';g.lineWidth=3*f+1;g.beginPath();
  g.arc(kg?px:kx,kg?py+dive-8:ky+dive-8,26+10*(1-f),kg?-.9:Math.PI-.9+1.8*0,kg?.9:Math.PI+.9);g.stroke();g.restore()}
 for(let i=0;i<10;i++){const x=hsh(i+40)*GW,y=((hsh(i+50)*GH*2-u*420)%(GH+80)+GH+80)%(GH+80)-40;fr(x,y,1,18+hsh(i)*16,'rgba(255,255,255,.1)')}
 g.restore();
 cap('LA CAÍDA DE VALDORRA',rp(u,.5,.9)*(1-rp(u,2.2,2.6)),44);cap('El Rey los alcanza en el aire.',rp(u,3,3.2)*(1-rp(u,4.2,4.4)),GH-30);
 const fa=t<2.9?1-rp(t,2.5,2.9):0;if(fa>0){g.fillStyle='rgba(255,252,235,'+fa+')';g.fillRect(0,0,GW,GH)}
 bars(22);
 if(t>=7){const f=1-rp(t,7,7.4);if(f>0){g.fillStyle='rgba(255,252,235,'+f+')';g.fillRect(0,0,GW,GH)}}
 if(t>=7.4){const a=rp(t,7.4,7.55);g.fillStyle='rgba(58,44,40,'+a+')';g.fillRect(0,0,GW,GH);craterFx(t,a);dustFx(t,a*.7);bars(22);figFx(t,FIGX,FIGY)}}
function drawFallback(c){const t=c.t,k=rp(t,2.5,7);g.setTransform&&0;g.fillStyle='#0c0618';g.fillRect(0,0,GW,GH);const q=g.createLinearGradient(0,0,0,GH);q.addColorStop(0,'#0c0618');q.addColorStop(1,mixc('#6a2a22','#d0602a',k));g.fillStyle=q;g.fillRect(0,0,GW,GH);
 cap('LA CAÍDA DE VALDORRA',rp(t,2.8,3.2)*(1-rp(t,4.6,5)),GH/2);bars(22);if(CA.derr)tx(CA.derr.slice(0,60),4,GH-26,'#ff8080','left',5);if(t>=7){const f=1-rp(t,7,7.4);if(f>0){g.fillStyle='rgba(255,252,235,'+f+')';g.fillRect(0,0,GW,GH)}}if(t>=7.4){const a=rp(t,7.4,7.7);g.fillStyle='rgba(58,44,40,'+a+')';g.fillRect(0,0,GW,GH)}}
function skipHint(c){if(c.sk>0&&c.t<7)cap('Pulsa de nuevo para saltar',Math.min(1,c.sk*2),GH-34)}
function dustFx(t,a){for(let i=0;i<70;i++){const x=((hsh(i)*GW+t*(8+hsh(i+5)*14))%(GW+40))-20,y=hsh(i+9)*GH+Math.sin(t*1.3+i)*5,s=2+hsh(i+2)*5;g.fillStyle='rgba(120,98,86,'+a*.35+')';g.fillRect(Math.round(x),Math.round(y),s,Math.max(1,s*.6))}}
function overlayCut(c){const t=c.t;
 if(t<2.5){drawA(c);return}
 if(t>=8){const a=t<8.5?1:1-rp(t,8.5,10),e=E.find(q=>q.id==='rey'&&q.b);g.fillStyle='rgba(58,44,40,'+a+')';g.fillRect(0,0,GW,GH);craterFx(t,a);dustFx(t,a*.7);bars(Math.round(22*(1-ez(rp(t,8.5,9.2)))));figFx(t,FIGX,FIGY)}}
{const d=draw;draw=function(){const c=CA.cut;cineUI(!!(c&&c.hide&&G.mode==='caida'));
  if(c&&c.t>=2.5&&c.t<8.0){const tf=g.getTransform(),ga=g.globalAlpha,gc=g.globalCompositeOperation;try{drawFull(c)}catch(er){CA.derr=String(er&&er.message||er);if(!draw.err){draw.err=1;console.error(er)}g.setTransform(tf);g.globalAlpha=ga;g.globalCompositeOperation=gc;g.setLineDash([]);try{drawFallback(c)}catch(e2){}}skipHint(c);return}
  d.apply(this,arguments);
  if(c){try{overlayCut(c);skipHint(c)}catch(er){if(!draw.err2){draw.err2=1;console.error(er)}}}
  try{if(CA.on&&!c)overlayHud()}catch(er){if(!draw.err3){draw.err3=1;console.error(er)}}}}
{const h=hud;hud=function(){if(CA.cut&&CA.cut.hide)return;return h.apply(this,arguments)}}
{const u=update;update=function(dt){const c=CA.cut;
  if(c&&G.mode==='caida'){u(dt);tickCut(dt);lockCam();return}
  if(c&&G.mode!=='caida'){c.t+=dt*c.spd;if(c.t>=c.end){CA.cut=null;try{if(CA.musOld!=null)CFG.music=CA.musOld}catch(e){}}}
  if(CA.dec&&CA.dec.k==='flask'&&buf.flask){buf.flask=0;toast('Azrael prohíbe los frascos')}
  u(dt);lockCam();
  if(G.mode==='play'&&G.hs<=0)rey(dt)}}

// ---------- peligros dibujados en el mundo (dentro de la transformación de cámara) ----------
function crackPath(x1,y1,x2,y2,sd,seg){g.beginPath();g.moveTo(x1,y1);const n=seg||12,nx=-(y2-y1),ny=x2-x1,nl=Math.hypot(nx,ny)||1;for(let i=1;i<=n;i++){const q=i/n,o=(hsh(sd+i)-.5)*(i<n?9:0);g.lineTo(lerp(x1,x2,q)+nx/nl*o,lerp(y1,y2,q)+ny/nl*o)}}
function drawHaz(){if(!CA.on)return;const a=W.arena,e=E.find(q=>q.id==='rey'&&q.b&&q.s!=='dead');
 for(const s of CA.sc){crackPath(s.x1,s.y1,s.x2,s.y2,s.sd);g.strokeStyle='rgba(8,3,6,.85)';g.lineWidth=4;g.stroke();g.strokeStyle='rgba(255,150,80,'+(.22+.1*Math.sin(TM*3+s.sd))+')';g.lineWidth=1;g.stroke()}
 for(const h of CA.hz){const p=C(h.t/h.tel);if(!h.f){const pu=.25+.35*Math.sin(h.t*(10+14*p))**2;crackPath(h.x1,h.y1,h.x2,h.y2,h.sd);g.strokeStyle='rgba(255,90,60,'+pu*.7+')';g.lineWidth=h.w*(.4+.6*p);g.stroke();g.strokeStyle='rgba(255,220,150,'+(.3+.5*p)+')';g.lineWidth=1;g.stroke()}
  else{const f=1-C((h.t-h.tel)/.4);g.save();g.globalCompositeOperation='lighter';crackPath(h.x1,h.y1,h.x2,h.y2,h.sd);g.strokeStyle='rgba(255,210,120,'+f+')';g.lineWidth=h.w*f+2;g.stroke();g.strokeStyle='rgba(255,255,230,'+f+')';g.lineWidth=2;g.stroke();g.restore()}}
 for(const c of CA.ch){const p=C(c.t/c.tel),x0=c.o==='h'?(a.x+1)*16:c.p,y0=c.o==='h'?c.p:(a.y+1)*16,x1=c.o==='h'?(a.x+a.w-1)*16:c.p,y1=c.o==='h'?c.p:(a.y+a.h-1)*16;
  if(!c.f){g.strokeStyle='rgba(255,200,90,'+(.15+.3*p)+')';g.lineWidth=16;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();g.setLineDash([4,5]);g.strokeStyle='rgba(255,236,170,'+(.4+.5*p)+')';g.lineWidth=2;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();g.setLineDash([])}
  else{const f=1-C((c.t-c.tel)/.45),n=Math.floor(Math.hypot(x1-x0,y1-y0)/6);for(let i=0;i<n;i++){const q=i/n,x=lerp(x0,x1,q),y=lerp(y0,y1,q);g.fillStyle=i%2?'rgba(210,200,230,'+f+')':'rgba(255,240,190,'+f+')';if(i%2)g.fillRect(x-1,y-3,3,6);else g.fillRect(x-3,y-1,6,3)}g.save();g.globalCompositeOperation='lighter';g.strokeStyle='rgba(255,220,140,'+f*.5+')';g.lineWidth=10;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();g.restore()}}
 for(const z of CA.gv){const act=z.t>z.tel,al=act?1-C((z.t-z.tel-z.dur+.5)/.5):.5;g.save();g.translate(z.x,z.y);g.scale(1,.5);
  g.strokeStyle='rgba(176,92,255,'+al*.8+')';g.lineWidth=2;if(!act)g.setLineDash([3,4]);g.beginPath();g.arc(0,0,z.r,0,6.283);g.stroke();g.setLineDash([]);
  if(act){for(let i=0;i<3;i++){const r=z.r*(1-((TM*.9+i/3)%1));g.strokeStyle='rgba(208,154,255,'+al*.5*(r/z.r)+')';g.beginPath();g.arc(0,0,r,0,6.283);g.stroke()}g.fillStyle='rgba(60,10,90,'+al*.35+')';g.beginPath();g.arc(0,0,z.r,0,6.283);g.fill()}g.restore();if(act)glowQ(z.x,z.y,18,'176,92,255',.35*al)}
 const s=CA.sen;if(s){const lk=s.t>=s.lock,fr_=s.t>=s.fire,al=fr_?1-C((s.t-s.fire)/.5):1;g.save();g.translate(s.x,s.y);g.scale(1,.55);
  const rr=lk?26:26+16*(1-C(s.t/s.lock)),col=lk?'255,255,240':'255,210,100';g.strokeStyle='rgba('+col+','+al+')';g.lineWidth=2;g.beginPath();g.arc(0,0,rr,0,6.283);g.stroke();g.lineWidth=1;
  g.rotate(TM*(lk?.5:1.4));g.beginPath();for(let i=0;i<3;i++){const an=i*2.094;g.lineTo(Math.cos(an)*rr*.9,Math.sin(an)*rr*.9)}g.closePath();g.stroke();g.beginPath();g.arc(0,0,rr*.45,0,6.283);g.stroke();g.restore();
  if(fr_){g.save();g.globalCompositeOperation='lighter';g.fillStyle='rgba(255,246,200,'+al*.6+')';g.fillRect(s.x-9,s.y-220,18,224);g.fillStyle='rgba(255,255,255,'+al+')';g.fillRect(s.x-3,s.y-220,6,224);g.restore()}
  else glowQ(s.x,s.y-4,30,lk?'255,255,240':'255,210,100',.3+.25*Math.sin(TM*12))}
 if(e&&RY().oath===1&&e.ph===2&&!CA.free){const ap=CA.ap>0;
  if(!ap){glowQ(e.x,e.y-16,34,'255,210,110',.22+.06*Math.sin(TM*4));g.strokeStyle='rgba(255,220,140,.45)';g.lineWidth=1;g.beginPath();g.ellipse(e.x,e.y-16,16,24,0,0,6.283);g.stroke()}
  else{g.save();g.globalCompositeOperation='lighter';g.strokeStyle='rgba(255,236,170,'+(.5+.4*Math.sin(TM*30))+')';g.lineWidth=2;g.beginPath();g.moveTo(e.x,e.y-36);for(let i=1;i<=9;i++)g.lineTo(e.x+(hsh(i+Math.floor(TM*14))-.5)*10,e.y-36-i*22);g.stroke();g.restore();glowQ(e.x,e.y-34,26,'255,246,200',.5)}}
 if(e&&e.ph>=1&&!CA.free)glowQ(e.x,e.y-14,24,'255,200,110',.1)}
{const dg=drawGates;drawGates=function(){dg();try{drawHaz()}catch(er){if(!drawGates.err){drawGates.err=1;console.error(er)}}}}

// ---------- interfaz de combate: subtítulos, decretos, vínculo y promesa ----------
function overlayHud(){const e=E.find(q=>q.id==='rey'&&q.b&&q.s!=='dead'),R_=RY();
 if(CA.fl>0){g.fillStyle='rgba(255,246,210,'+Math.min(.7,CA.fl)+')';g.fillRect(0,0,GW,GH)}
 if(CA.dec){const d=CA.dec,txt=d.k==='flask'?'SIN FRASCOS':'SIN ALIENTO';fr(GW/2-62,80,124,13,'rgba(20,10,4,.8)');fr(GW/2-62,80,124,1,'#c9a54a');fr(GW/2-62,92,124,1,'#c9a54a');tx('AZRAEL · '+txt,GW/2,90,'#ffd070','center',6);fr(GW/2-60,93,120*C(d.l/d.m),1,'#ffd070')}
 if(e&&R_.oath===1&&e.ph===2&&!CA.free){const ap=CA.ap>0,w=132,x=GW/2-w/2,y=GH-52;fr(x-1,y-1,w+2,7,'#0a0610');fr(x,y,w,5,'#2a1a10');
  if(ap){fr(x,y,w*C(CA.ap/3),5,'#ffe66d');tx('VÍNCULO EXPUESTO',GW/2,y-4,'#fff2b0','center',6)}else{fr(x,y,w,5,'rgba(255,170,60,.45)');tx('AUTORIDAD DE AZRAEL',GW/2,y-4,'#c9a54a','center',5)}}
 if(P&&P.sur>0){const x=12,y=76;g.fillStyle='#ffe66d';g.beginPath();g.moveTo(x,y-4);g.lineTo(x+4,y);g.lineTo(x,y+4);g.lineTo(x-4,y);g.fill();glowQ(x,y,10,'255,230,109',.3);tx('Promesa',x+8,y+2,'#ffe66d','left',5)}
 if(CA.sub){const s=CA.sub,al=Math.min(1,s.l*3,(s.m-s.l)*4+.01),L=wrap(s.t,330,6),h=L.length*9+10,col=s.w==='Azrael'?'#ffd070':s.w==='La Voz'?'#9ad0ff':'#c9b8ff',y=GH-62-h;g.globalAlpha=al;fr(GW/2-170,y,340,h,'rgba(8,4,14,.78)');fr(GW/2-170,y,2,h,col);tx(s.w.toUpperCase(),GW/2-162,y+9,col,'left',5);L.forEach((l,i)=>tx(l,GW/2-162,y+19+i*9,'#f4ecff','left',6));g.globalAlpha=1}}
})();
