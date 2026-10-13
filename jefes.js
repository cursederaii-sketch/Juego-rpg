// ===== ENTRADAS DE JEFE: cada jefe aparece con su propia animación antes de que empiece el combate =====
// Se engancha a startBoss sin cambiar su lógica: crea al jefe como siempre, congela la acción (G.mode='intro'),
// mueve la cámara hacia él, dibuja barras de cine y el título, y al terminar devuelve el control (y el diálogo de presentación).
(function(){
const BI={on:null,ty:0,al:null};
window.BOSSINTRO=BI;
const C=v=>v<0?0:v>1?1:v,rp=(p,a,b)=>C((p-a)/(b-a)),ez=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,eo=t=>1-Math.pow(1-t,3);
const dust=(x,y,n,c,sp,z)=>{for(let i=0;i<n;i++){const a=R()*6.283,v=(14+R()*44)*(sp||1);PT.push({k:'d',x:x+(R()-.5)*8,y,z:z==null?2:z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.5,vz:6+R()*20,l:.25+R()*.15,c})}};
const ring=(x,y,c,big,l)=>FX.push({k:'ring',x,y,l:l||.6,m:l||.6,c,big:big?1:0});

// d = duración (s) · ep = epíteto · v(p) = transformación visual · fx = partículas/sonido · ov = capa de pantalla
const ENT={
 sepulturero:{d:2.8,ep:'Guardián de las tumbas',
  v:(p,e)=>({ty:(1-ez(rp(p,.12,.7)))*(e.b.h+6),clip:[-34,-90,68,92]}),
  fx(e,p,dt,I){if(I.once('s',0)){sfx(70,1.2,'sawtooth',.08,38);G.shake=2}
   if(I.once('r',.12))ring(e.x,e.y,'150,120,80',1,.9);
   if(p>.12&&p<.7&&I.every('d',dt,.05)){dust(e.x,e.y+1,3,'#6b5a46',.8,1);spark(e.x+(R()-.5)*14,e.y,'#4a3c2e',2,2,.6)}
   if(I.once('t',.7)){G.shake=5;sfx(110,.4,'triangle',.1,50);dust(e.x,e.y,10,'#8a7a62',1.2);ring(e.x,e.y,'176,92,255',1,.9)}}},
 pastora:{d:3,ep:'Pastora de almas perdidas',
  v:p=>{const a=rp(p,.2,.8);return{a:ez(a),ty:(1-a)*-8}},
  fx(e,p,dt,I){if(I.once('s',0))sfx(180,1.6,'sine',.05,420);
   if(p<.8&&I.every('e',dt,.03))for(let i=0;i<2;i++){const an=R()*6.283,r=50+R()*30;PT.push({k:'a',x:e.x+Math.cos(an)*r,y:e.y-6+Math.sin(an)*r*.5,z:4+R()*20,vx:-Math.cos(an)*r/.9,vy:-Math.sin(an)*r*.5/.9,vz:10,l:.9,c:R()<.5?'rgba(255,140,60,.9)':'rgba(255,200,120,.9)'})}
   if(I.once('b',.8)){ring(e.x,e.y,'255,154,60',1,.9);spark(e.x,e.y-14,'#ff9a3c',18,14,1);G.shake=3;sfx(130,.5,'triangle',.08,260);I.fl=.35}}},
 cazador:{d:2.5,ep:'Rastreador sin rostro',
  v:p=>{const t=rp(p,0,.5),sy=p<.5?1:.8+.2*eo(rp(p,.5,.9));return{ty:p<.5?-(1-t*t)*150:0,sy,sx:1+(1-sy)*.5}},
  fx(e,p,dt,I){if(I.once('s',0))sfx(500,.8,'sawtooth',.04,120);
   if(I.once('i',.5)){G.shake=8;ring(e.x,e.y,'255,230,109',1,.7);ring(e.x,e.y,'36,74,58',1,1);dust(e.x,e.y,14,'#8a8a6a',1.3);sfx(70,.4,'square',.12,30);I.fl=.25}}},
 caballero:{d:3,ep:'El que prometió volver',
  v:(p,e,I)=>({a:rp(p,0,.18),tx:p<.55?Math.sin(I.t*55)*(.3+1.7*rp(p,.1,.55)):0,sy:p<.55?1:1+.07*Math.sin(Math.PI*rp(p,.55,.8))}),
  fx(e,p,dt,I){if(p<.55&&I.every('c',dt,.17)){sfx(1200+R()*400,.04,'square',.02,600);spark(e.x,e.y-14,'#9aa0b0',3,14,.5)}
   if(I.once('i',.55)){I.fl=1;G.shake=9;spark(e.x,e.y-14,'#9aa0b0',16,16,1.6);spark(e.x,e.y-14,'#d8dce8',8,16,1.2);ring(e.x,e.y,'255,77,109',1,.7);ring(e.x,e.y,'200,200,220',1,1);sfx(900,.3,'square',.07,180);sfx(60,.5,'sawtooth',.1,30)}}},
 rey:{d:3.4,ep:'El último juramento',
  v:p=>{const a=rp(p,.25,.8);return{a:ez(a),ty:(1-a)*-16}},
  ov(p,sx,sy){const L=rp(p,.03,.3)*(1-rp(p,.85,1));g.fillStyle='rgba(2,0,12,'+(.45*L)+')';g.fillRect(0,0,GW,GH);
   const gr=g.createLinearGradient(sx-28,0,sx+28,0);gr.addColorStop(0,'rgba(255,224,130,0)');gr.addColorStop(.5,'rgba(255,236,170,'+(.55*L)+')');gr.addColorStop(1,'rgba(255,224,130,0)');g.fillStyle=gr;g.fillRect(sx-28,0,56,sy+3)},
  fx(e,p,dt,I){if(I.once('s',0))sfx(55,2.4,'sine',.09,160);
   if(p<.85&&I.every('r',dt,.55))ring(e.x,e.y,'255,230,109',1,.9);
   if(p>.25&&p<.8&&I.every('p',dt,.08))spark(e.x+(R()-.5)*16,e.y,'#ffe66d',1,4+R()*30,.3);
   if(I.once('c',.82)){I.fl=.8;spark(e.x,e.y-20,'#ffe66d',24,24,1.4);G.shake=5;ring(e.x,e.y,'255,230,109',1,1);sfx(660,.6,'triangle',.08,1320)}}},
 guardiana:{d:2.8,ep:'Custodia de los huesos',
  v:p=>{const a=ez(rp(p,.35,.85));return{a,sy:.7+.3*a}},
  fx(e,p,dt,I){if(I.once('s',0))sfx(300,1.4,'sine',.05,120);
   if(p<.8&&I.every('b',dt,.04)){for(let i=0;i<3;i++)PT.push({k:'s',x:e.x+(R()-.5)*60,y:e.y+(R()-.5)*14,z:50+R()*40,vx:(R()-.5)*8,vy:0,vz:0,l:1.1,c:'#d8d2b8'});if(R()<.4)spark(e.x,e.y-12,'#99ffcc',2,10,.5)}
   if(I.once('e',.85)){ring(e.x,e.y,'153,255,204',1,.9);spark(e.x,e.y-14,'#99ffcc',16,14,1);G.shake=2;sfx(200,.5,'triangle',.07,400)}}},
 heraldo:{d:2.6,ep:'Voz que ya no suena',
  v:p=>({a:ez(rp(p,.1,.45)),ty:-Math.sin(Math.PI*rp(p,.1,.6))*4}),
  fx(e,p,dt,I){[.12,.32,.52].forEach((t,i)=>{if(I.once('h'+i,t)){ring(e.x,e.y-8,'255,200,90',1,.8);spark(e.x,e.y-12,'#ffe66d',8,12,1.2);G.shake=2+i;sfx(240+i*60,.5,'sawtooth',.07,160+i*40)}});
   if(I.once('f',.6)){I.fl=.5;ring(e.x,e.y,'255,154,60',1,.9);sfx(120,.6,'triangle',.1,500)}}},
 capdorn:{d:2.6,ep:'Capitán de la Guardia',
  init(e,I){I.dir=e.x>=P.x?1:-1;e.fx=-I.dir;e.fy=0},
  v:(p,e,I)=>{const r=rp(p,0,.55);return{tx:(1-eo(r))*I.dir*110,ty:r<1?-Math.abs(Math.sin(I.t*18))*2:0,sy:p>.55&&p<.7?1-.1*Math.sin(Math.PI*rp(p,.55,.7)):1}},
  fx(e,p,dt,I){const r=rp(p,0,.55);if(r<1&&I.every('d',dt,.06))dust(e.x+I.dir*110*(1-eo(r)),e.y,2,'#8a7a62',.7,1);
   if(I.once('s',0))sfx(110,.9,'square',.05,70);
   if(I.once('k',.5)){G.shake=4;dust(e.x,e.y,12,'#8a7a62',1.2);spark(e.x,e.y-6,'#ffb347',12,6,1.2);ring(e.x,e.y,'255,179,71',1,.7);sfx(160,.3,'square',.08,60);const d=Math.hypot(P.x-e.x,P.y-e.y)||1;e.fx=(P.x-e.x)/d;e.fy=(P.y-e.y)/d}}},
 madre:{d:3,ep:'Señora de las marismas',
  v:p=>{const r=ez(rp(p,.1,.78));return{a:rp(p,.1,.35),sy:.12+.88*r+.06*Math.sin(Math.PI*rp(p,.7,.95)),sx:1+(1-r)*.5}},
  fx(e,p,dt,I){if(I.once('s',0))sfx(90,1.4,'sine',.07,45);
   if(p<.85&&I.every('b',dt,.14)){const x=e.x+(R()-.5)*30,y=e.y+(R()-.5)*8;ring(x,y,'154,255,122',0,.5);spark(x,y,'#5a7a3a',3,3,.5)}
   if(I.once('e',.8)){ring(e.x,e.y,'154,255,122',1,.9);spark(e.x,e.y-10,'#9aff7a',14,10,1);spark(e.x,e.y-10,'#3a5a34',10,10,1);G.shake=3;sfx(70,.5,'triangle',.09,140)}}},
 capataz:{d:3,ep:'Amo de la cantera',
  v:p=>({a:ez(rp(p,.45,.85))}),
  fx(e,p,dt,I){if(p<.85&&I.every('r',dt,.07))PT.push({k:'s',x:e.x+(R()-.5)*60,y:e.y+(R()-.5)*20,z:150,vx:0,vy:0,vz:-40,l:1.2,c:R()<.5?'#5a4a42':'#8a7868'});
   if(p>.2&&p<.85&&I.every('d',dt,.05))dust(e.x+(R()-.5)*40,e.y+(R()-.5)*10,3,'rgba(120,105,90,.55)',.6,4+R()*20);
   [.3,.5,.68].forEach((t,i)=>{if(I.once('k'+i,t)){G.shake=5+i*2;spark(e.x+(R()-.5)*20,e.y,'#ff9a3c',12,4,1.3);ring(e.x,e.y,'255,150,100',1,.6);sfx(220-i*30,.25,'square',.09,70)}});
   if(I.once('e',.85)){dust(e.x,e.y,12,'rgba(140,120,100,.6)',1.3);ring(e.x,e.y,'255,154,60',1,.8)}}},
 vigia:{d:3,ep:'Centinela del faro',
  v:(p,e)=>{const H=e.b.h+16;return{clip:[-34,-H-2,68,H*ez(rp(p,.2,.78))+2]}},
  ov(p,sx,sy,e){const H=e.b.h+16,r=ez(rp(p,.2,.78));if(r>0&&r<1){const ly=sy-H+H*r;g.fillStyle='rgba(255,230,150,.25)';g.fillRect(sx-30,ly-3,60,6);g.fillStyle='rgba(255,246,200,.95)';g.fillRect(sx-30,ly,60,1)}},
  fx(e,p,dt,I){if(I.once('s',0))sfx(520,1.8,'sine',.05,780);
   const r=ez(rp(p,.2,.78));if(r>0&&r<1&&I.every('p',dt,.05))spark(e.x+(R()-.5)*20,e.y,'#ffd88a',1,(e.b.h+16)*r,.4);
   if(I.once('e',.8)){I.fl=.4;ring(e.x,e.y,'255,216,138',1,.9);ring(e.x,e.y,'255,246,200',1,1.2);spark(e.x,e.y-16,'#ffd88a',16,16,1);sfx(520,.5,'sine',.07,1040)}}}
};

function begin(e,dlg){const def=ENT[e.id];if(!def)return false;
 const first=once('e'+e.id),I={e,def,dlg,t:0,p:0,dur:def.d*(first?1:.55),min:first?.9:.3,st:{},acc:{},fl:0,dir:1};
 I.once=(k,p0)=>{if(I.st[k]||I.p<p0)return false;I.st[k]=1;return true};
 I.every=(k,dt,iv)=>{I.acc[k]=(I.acc[k]||0)+dt;if(I.acc[k]>=iv){I.acc[k]-=iv;return true}return false};
 if(def.init)def.init(e,I);
 relAll();if(P.s!=='idle'&&P.s!=='dead'){P.s='idle';P.t=0}
 BI.on=I;G.mode='intro';return true}

function finish(){const I=BI.on;if(!I)return;BI.on=null;BI.ty=0;BI.al=null;g.globalAlpha=1;relAll();
 const e=I.e,d=Math.hypot(P.x-e.x,P.y-e.y)||1;e.fx=(P.x-e.x)/d;e.fy=(P.y-e.y)/d;e.cd=Math.max(e.cd,1.1);
 G.mode='play';if(I.dlg)say(I.dlg)}

// durante la entrada el jefe y el jugador están congelados (update corta en cualquier modo que no sea 'play'); aquí se anima
function tick(dt){const I=BI.on,e=I.e;I.t+=dt;
 if(I.t>I.min&&I.t<I.dur-.4&&(held.light||held.heavy||held.dodge||held.act||buf.light||buf.heavy||buf.dodge||buf.act))I.t=I.dur-.4; // saltar
 I.p=Math.min(1,I.t/I.dur);if(I.def.fx)I.def.fx(e,I.p,dt,I);if(I.fl>0)I.fl=Math.max(0,I.fl-dt*3.5);
 const tx_=cl(e.x-GW/2,0,W.cols*16-GW),ty_=cl(e.y-GH/2+6,0,W.rows*16-GH),k=Math.min(1,dt*4);cam.x+=(tx_-cam.x)*k;cam.y+=(ty_-cam.y)*k;
 if(I.t>=I.dur)finish()}

function overlay(){const I=BI.on;if(!I)return;const e=I.e,p=I.p,sx=e.x-cam.x,sy=e.y-cam.y;
 if(I.def.ov)I.def.ov(p,sx,sy,e);
 const bh=Math.round(24*ez(Math.min(rp(p,0,.1),1-rp(p,.92,1))));g.fillStyle='#000';g.fillRect(0,0,GW,bh);g.fillRect(0,GH-bh,GW,bh);
 const ta=rp(p,.42,.52)*(1-rp(p,.86,.94));
 if(ta>0&&bh>8){g.globalAlpha=ta;fr(GW/2-90,GH-bh-34,180,1,'#c9a54a');tx(e.b.n,GW/2,GH-bh-20,'#f4e2b0','center',12);tx(I.def.ep,GW/2,GH-bh-8,'#c9a54a','center',7);g.globalAlpha=1}
 if(bh>12&&I.t>I.min&&I.t<I.dur-.4)tx('Ataque: saltar',GW-8,bh-8,'#8a8498','right',6);
 if(I.fl>0){g.fillStyle='rgba(255,255,255,'+Math.min(1,I.fl)+')';g.fillRect(0,0,GW,GH)}}

// --- enganches ---
{const sb=startBoss;startBoss=function(){
  const os=say,cap=[];say=function(n){cap.push(n)};   // el diálogo de presentación se guarda y se muestra al terminar la entrada
  try{sb()}finally{say=os}
  const e=E.find(q=>q.b&&q.arena&&q.s!=='dead');
  if(!e||!begin(e,cap[0]))cap.forEach(n=>say(n))}}
{const sa=startAmb;startAmb=function(a){sa(a);   // jefes de emboscada (Capitán Dorn)
  const e=E.find(q=>q.b&&q.amb===a.id&&q.s!=='dead');if(!e)return;let dlg=null;
  try{const f=PRES[e.id];if(f&&once('i'+e.id))dlg=chain(f())}catch(x){}
  if(!begin(e,dlg)&&dlg)say(dlg)}}
{const u=update;update=function(dt){u(dt);if(BI.on&&G.mode==='intro')tick(dt)}}
{const d=draw;draw=function(){d.apply(this,arguments);if(BI.on)overlay()}}
{const h=hud;hud=function(){if(BI.on)return;return h.apply(this,arguments)}}
{const de=drawE;drawE=function(e){const I=BI.on;if(!I||I.e!==e)return de(e);
  const v=I.def.v(I.p,e,I)||{},a=v.a==null?1:v.a;if(a<=.01)return;
  g.save();if(v.clip){g.beginPath();g.rect(Math.round(e.x+v.clip[0]),Math.round(e.y+v.clip[1]),v.clip[2],Math.max(0,Math.round(v.clip[3])));g.clip()}
  g.translate(e.x,e.y);g.scale(v.sx||1,v.sy||1);g.translate(-e.x+(v.tx||0),-e.y+(v.ty||0));
  BI.ty=v.ty||0;BI.al=a;g.globalAlpha=a;
  try{de(e)}finally{BI.ty=0;BI.al=null;g.restore();g.globalAlpha=1}}}
{const s=shadow;shadow=function(x,y,w,a){if(BI.al!=null){const t=BI.ty||0;return s(x,y-t,w*(1-Math.min(.6,Math.abs(t)/220)),a)}return s(x,y,w,a)}}
{const w=weapon;weapon=function(){if(BI.al!=null)g.globalAlpha=BI.al;return w.apply(this,arguments)}}
})();
