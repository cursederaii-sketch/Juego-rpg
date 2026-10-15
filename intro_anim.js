// ===== INTRO ANIMADA: sustituye a los diálogos de prólogo (Crónica de Valdora + despertar) por una secuencia animada =====
// Se carga después de cronica.js/story.js. newGame() sigue igual; aquí solo se silencian sus diálogos iniciales y se lanza la animación.
// Controles: clic / Enter / Espacio = siguiente escena · Esc o «Saltar» = saltar todo. Solo se ve al empezar partida nueva.
(function(){
const W=320,H=180,TAU=6.2832,rnd=Math.random;
const scenes=()=>[
 {k:'door',L:['Hubo un reino llamado Valdora, y una puerta al norte que nadie debía abrir.','Tras ella, decían los ancianos, dormía el miedo de todo un pueblo.']},
 {k:'close',L:['La noche en que llegó la ceniza, el rey mandó cerrar la puerta con su gente aún fuera.','Después ordenó algo peor: que todos olvidaran.','Quien olvida deja de ser, y de los que dejaron de ser nacieron los Huecos.']},
 {k:'forget',L:['Desde entonces el reino vive sin memoria.','Nadie recuerda por qué se cerró la puerta, quién la abrió ni quién pidió el olvido.','Solo la piedra guarda lo que los vivos soltaron.']},
 {k:'wake',L:['Despiertas sobre piedra fría. No recuerdas quién eres ni cómo llegaste a esta cripta.','Solo un nombre te viene a los labios: «'+(S.name||'')+'».','En el muro, raspada con una espada: «No permitas que el mundo vuelva a olvidarte».']},
 {k:'road',L:['Para saber quién fuiste deberás llegar a la capital y averiguar por qué regresaste de entre los muertos.','Cada jefe guarda un recuerdo tuyo... pero los recuerdos no siempre coinciden.','Descansa en las hogueras con «Actuar».']}];
const STEP=2.7,LEAD=.6,TAIL=3.4,FADE=.7;
let ov,cv,cx,tbox,raf,run=0,sc,si,st,last,parts,keyH,pxs=[];
const dur=s=>LEAD+(s.L.length-1)*STEP+TAIL;
function mkDom(){
 ov=document.createElement('div');ov.id='introAnim';
 ov.innerHTML='<canvas width="'+W+'" height="'+H+'"></canvas><div class="itx"></div><button class="isk">Saltar ›</button><div class="ihint">clic / Enter: siguiente</div>';
 document.body.appendChild(ov);cv=ov.querySelector('canvas');cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;tbox=ov.querySelector('.itx');
 ov.addEventListener('pointerdown',e=>{if(e.target.className==='isk')return;next()});
 ov.querySelector('.isk').addEventListener('click',e=>{e.stopPropagation();finish()});
 keyH=e=>{const k=e.key;if(k==='Escape'){e.stopPropagation();e.preventDefault();finish()}else if(k==='Enter'||k===' '||k==='e'||k==='E'){e.stopPropagation();e.preventDefault();if(!e.repeat)next()}else{e.stopPropagation()}};
 addEventListener('keydown',keyH,true);addEventListener('keyup',e=>{if(run)e.stopPropagation()},true)}
function setScene(i){si=i;sc=scenes()[i];st=0;parts=[];
 tbox.innerHTML='';sc.L.forEach(t=>{const p=document.createElement('p');p.textContent=t;tbox.appendChild(p)})}
function next(){if(!run)return;const d=dur(sc);if(st<d-FADE)st=d-FADE;else{}}
function finish(){if(!run)return;run=0;cancelAnimationFrame(raf);removeEventListener('keydown',keyH,true);
 ov.style.transition='opacity .6s';ov.style.opacity=0;setTimeout(()=>{ov.remove()},650);
 G.mode='play';try{relAll()}catch(_){}save()}
// ---------- dibujo ----------
const R_=(c,x,y,w,h)=>{cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),w,h)};
function ash(n,wind,col){ // ceniza que cae
 while(parts.length<n)parts.push({x:rnd()*W,y:rnd()*H,v:6+rnd()*14,s:rnd()<.2?2:1,p:rnd()*9});
 for(const p of parts){p.y+=p.v*dt_;p.x+=(wind+Math.sin(st*.8+p.p)*5)*dt_;if(p.y>H){p.y=-2;p.x=rnd()*W}if(p.x>W)p.x=0;if(p.x<0)p.x=W;
  cx.globalAlpha=.35+.4*((p.p*7)%1);R_(col||'#b9b0c4',p.x,p.y,p.s,p.s)}cx.globalAlpha=1}
let dt_=.016;
function sky(a,b){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(1,b);cx.fillStyle=g;cx.fillRect(0,0,W,H)}
function mountains(col,base,seed){cx.fillStyle=col;cx.beginPath();cx.moveTo(0,H);for(let x=0;x<=W;x+=8)cx.lineTo(x,base-18*Math.abs(Math.sin(x*.03+seed))-10*Math.sin(x*.11+seed*2));cx.lineTo(W,H);cx.fill()}
function gate(open,glow){ // gran puerta de piedra al norte
 const cxm=W/2,top=44,w=64,h=74;
 const g=cx.createRadialGradient(cxm,top+h*.6,2,cxm,top+h*.6,70);g.addColorStop(0,'rgba(255,150,60,'+glow*.55+')');g.addColorStop(1,'rgba(255,150,60,0)');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 R_('#17121f',cxm-w/2-8,top-8,w+16,h+8);R_('#0a0610',cxm-w/2,top,w,h);
 cx.fillStyle='#17121f';cx.beginPath();cx.arc(cxm,top,w/2+8,Math.PI,0);cx.fill();cx.fillStyle='#0a0610';cx.beginPath();cx.arc(cxm,top,w/2,Math.PI,0);cx.fill();
 // hojas
 const pw=(w/2)*(1-open);R_('#2a2236',cxm-w/2,top,pw,h);R_('#2a2236',cxm+w/2-pw,top,pw,h);
 for(let k=0;k<4;k++){R_('#3c3150',cxm-w/2,top+8+k*17,pw,2);R_('#3c3150',cxm+w/2-pw,top+8+k*17,pw,2)}
 if(pw>2){R_('#c9a54a',cxm-3,top+h/2,3,3);R_('#c9a54a',cxm,top+h/2,3,3)}
 R_('#120d1a',cxm-w/2-14,top+h,w+28,10);return{cxm,top,w,h}}
function person(x,y,al,col){cx.globalAlpha=al;R_(col||'#07040c',x-1,y-7,3,5);R_(col||'#07040c',x-2,y-2,5,7);cx.globalAlpha=1}
const DRAW={
 door(){sky('#0b0716','#1c1030');for(let i=0;i<40;i++){cx.globalAlpha=.4+.4*Math.sin(st*2+i);R_('#fff',(i*53)%W,(i*29)%70,1,1)}cx.globalAlpha=1;
  mountains('#0f0a1a',128,1);mountains('#0a0612',150,4);gate(1,.6+.2*Math.sin(st*3));
  R_('#05030a',0,H-22,W,22);ash(25,4)},
 close(){const k=Math.min(1,Math.max(0,(st-1.2)/4));sky('#1a1014','#2a1418');mountains('#150a10',128,2);mountains('#0e060a',150,5);
  const gt=gate(1-k,.7*(1-k));R_('#05030a',0,H-22,W,22);
  // gente fuera de la puerta
  for(let i=0;i<9;i++){const x=70+i*22+Math.sin(i*3)*4,y=H-14+((i*5)%7);person(x,y,Math.max(0,1-Math.max(0,st-4.5)/3),'#0a0508')}
  // Huecos: ojos rojos que nacen donde estaba la gente
  if(st>5){for(let i=0;i<9;i++){const x=70+i*22+Math.sin(i*3)*4,y=H-14+((i*5)%7)-4,a=Math.min(1,(st-5-i*.25)/1.5);if(a>0){cx.globalAlpha=a*(.6+.4*Math.sin(st*5+i));R_('#ff4d6d',x-2,y,1,1);R_('#ff4d6d',x+1,y,1,1);cx.globalAlpha=1}}}
  ash(70,14,'#c8b8b8')},
 forget(){sky('#0e0a14','#1a1424');const f=Math.max(0,1-st/9);
  mountains('#0f0a18',140,3);
  // casas que se desvanecen y se vuelven polvo
  for(let i=0;i<7;i++){const x=24+i*42,y=H-34;cx.globalAlpha=Math.max(0,f-i*.04);R_('#1c1626',x,y,26,18);cx.fillStyle='#2a2036';cx.beginPath();cx.moveTo(x-3,y);cx.lineTo(x+13,y-12);cx.lineTo(x+29,y);cx.fill();R_('#ffb347',x+10,y+6,4,5);cx.globalAlpha=1}
  R_('#07040c',0,H-16,W,16);
  // polvo ascendente
  while(parts.length<60)parts.push({x:rnd()*W,y:H-30+rnd()*14,v:-(4+rnd()*10),s:1,p:rnd()*9});
  for(const p of parts){p.y+=p.v*dt_;p.x+=Math.sin(st+p.p)*4*dt_;if(p.y<-3){p.y=H-26;p.x=rnd()*W}cx.globalAlpha=.3+.4*((p.p*5)%1);R_('#a99bc4',p.x,p.y,1,1)}cx.globalAlpha=1;
  const vg=cx.createRadialGradient(W/2,H/2,30,W/2,H/2,190);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,'+(.3+.5*(1-f))+')');cx.fillStyle=vg;cx.fillRect(0,0,W,H)},
 wake(){R_('#07050c',0,0,W,H);
  // muro de piedra
  for(let y=0;y<H;y+=12)for(let x=((y/12)%2)*10-10;x<W;x+=20){const s=(x*7+y*3)%3;R_(['#241c30','#2a2138','#1e1728'][s],x+1,y+1,18,10)}
  // tumbas
  for(let i=0;i<4;i++){const x=40+i*80,y=104;R_('#0f0b16',x,y,22,40);R_('#1a1424',x+1,y+1,20,38);R_('#3a3050',x+9,y+8,4,14);R_('#3a3050',x+5,y+12,12,3)}
  R_('#0b0710',0,H-30,W,30);
  // hoguera
  const fx=W/2,fy=H-34,fl=.7+.3*Math.sin(st*9)+.1*Math.sin(st*23);
  const g=cx.createRadialGradient(fx,fy-6,2,fx,fy-6,95*fl);g.addColorStop(0,'rgba(255,170,70,.55)');g.addColorStop(1,'rgba(255,170,70,0)');cx.fillStyle=g;cx.fillRect(0,0,W,H);
  R_('#3a2a1a',fx-8,fy+2,16,3);R_('#ff9a3c',fx-3,fy-8*fl,6,8*fl);R_('#ffe66d',fx-1,fy-5*fl,2,5*fl);
  // figura despertando (se incorpora)
  const up=Math.min(1,st/6);cx.globalAlpha=1;R_('#0a0610',fx+22,H-32-up*8,20,6+up*8);R_('#161022',fx+34,H-36-up*10,7,7);
  ash(18,3,'#ffb347');
  // párpado que se abre
  const o=Math.min(1,st/3.2),eh=(1-o)*H/2;R_('#000',0,0,W,eh);R_('#000',0,H-eh,W,eh);
  if(o<1){const bl=cx.createLinearGradient(0,eh,0,eh+16);bl.addColorStop(0,'rgba(0,0,0,.8)');bl.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=bl;cx.fillRect(0,eh,W,16)}},
 road(){sky('#10091c','#3a1c2a');for(let i=0;i<30;i++){cx.globalAlpha=.3+.4*Math.sin(st*2+i);R_('#fff',(i*47)%W,(i*23)%60,1,1)}cx.globalAlpha=1;
  mountains('#150c22',120,2);mountains('#0c0716',140,6);
  // capital lejana con luz
  const kx=W/2+10,ky=96;const g=cx.createRadialGradient(kx,ky,2,kx,ky,60);g.addColorStop(0,'rgba(255,200,120,.45)');g.addColorStop(1,'rgba(255,200,120,0)');cx.fillStyle=g;cx.fillRect(0,0,W,H);
  R_('#07040c',kx-26,ky,52,24);for(const [dx,h] of [[-26,16],[-14,26],[0,36],[12,22],[22,14]]){R_('#07040c',kx+dx,ky-h,10,h)}R_('#ffb347',kx+3,ky-24,2,3);R_('#ffb347',kx-11,ky-14,2,3);
  // camino
  cx.fillStyle='#0a0610';cx.beginPath();cx.moveTo(W/2-60,H);cx.lineTo(W/2+60,H);cx.lineTo(kx+6,ky+22);cx.lineTo(kx-6,ky+22);cx.fill();
  // viajero caminando hacia la capital
  const t=Math.min(1,st/10),px=W/2-6*(1-t)*0-2,py=H-14-t*50,sc_=1-t*.55;cx.save();cx.translate(px,py);cx.scale(sc_,sc_);R_('#000',-2,-12,4,12);R_('#1c1428',-3,-18,6,7);cx.restore();
  ash(20,6,'#ffb347')}};
function frame(ts){
 if(!run)return;raf=requestAnimationFrame(frame);
 dt_=Math.min(.05,(ts-last)/1000||.016);last=ts;st+=dt_;
 const d=dur(sc);
 if(st>=d){if(si+1>=scenes().length){finish();return}setScene(si+1)}
 const a=Math.max(0,Math.min(1,st/FADE,(d-st)/FADE));
 cx.globalAlpha=1;R_('#000',0,0,W,H);cx.globalAlpha=a;
 cx.save();const z=1+.05*(st/d);cx.translate(W/2,H/2);cx.scale(z,z);cx.translate(-W/2,-H/2);
 DRAW[sc.k]();cx.restore();cx.globalAlpha=1;
 // textos: aparecen uno a uno
 const ps=tbox.children,fo=st>d-FADE?a:1;for(let i=0;i<ps.length;i++)ps[i].style.opacity=Math.min(fo,Math.max(0,Math.min(1,(st-LEAD-i*STEP)/1.2)))}
function start(){
 if(run)return;run=1;G.mode='dlg';G.nd=null;mkDom();setScene(0);last=performance.now();raf=requestAnimationFrame(frame);
 try{sfx(70,2.5,'sine',.05,50)}catch(_){}}
// newGame: se silencian sus diálogos de prólogo y se lanza la animación
{const ng=newGame;newGame=function(name){const os=say;say=function(){};try{ng.apply(this,arguments)}finally{say=os}start()}}
window.IntroAnim={start,finish};
})();
