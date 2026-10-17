// ===== ANIMACIONES DE SUEÑO (v8.27): una escena animada por cada sueño de las hogueras =====
// Los sueños (d1..d6, definidos en cronica.js) se viven al descansar en una hoguera. Aquí se engancha bonfire(): si ese descanso
// disparó un sueño nuevo, una animación procedural (sin arte externo, 320x180 pixelado, con ondulación de sueño) se superpone
// al diálogo del sueño y desaparece sola (o al tocar / Enter / Esc). El diálogo y el descanso siguen exactamente igual debajo.
// Reutiliza el estilo #introAnim de style.css. Cargar DESPUÉS de cronica.js y lore.js. Consola: SueAnim.start('d1'..'d6').
(function(){
const W=320,H=180,TAU=Math.PI*2,rnd=Math.random,FADE=.9,DK=['d1','d2','d3','d4','d5','d6'];
const C=(v,a,b)=>v<a?a:v>b?b:v,ez=t=>{t=C(t,0,1);return t*t*(3-2*t)},lp=(a,b,t)=>a+(b-a)*t;
let ov,cv,cx,ob,ox,tbox,raf,run=0,st=0,last=0,cur=null,keyH,upH,cues=[],parts=[],vig;
const R_=(c,x,y,w,h)=>{ox.fillStyle=c;ox.fillRect(Math.round(x),Math.round(y),w,h)};
const poly=(c,p)=>{ox.fillStyle=c;ox.beginPath();ox.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ox.lineTo(p[i][0],p[i][1]);ox.closePath();ox.fill()};
const disc=(c,x,y,rx,ry)=>{ox.fillStyle=c;ox.beginPath();ox.ellipse(x,y,rx,ry==null?rx:ry,0,0,TAU);ox.fill()};
const rad=(x,y,r,rgb,a)=>{if(a<=0)return;const g=ox.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');ox.fillStyle=g;ox.fillRect(x-r,y-r,r*2,r*2)};
const bg=(a,b)=>{const g=ox.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(1,b);ox.fillStyle=g;ox.fillRect(0,0,W,H)};
// figura humana de silueta: pies en (x,y), escala s, inclinación de cabeza bow (px hacia abajo)
function fig(x,y,s,col,bow){bow=bow||0;ox.fillStyle=col;ox.beginPath();ox.moveTo(x-3*s,y-12*s);ox.lineTo(x+3*s,y-12*s);ox.lineTo(x+4.5*s,y);ox.lineTo(x-4.5*s,y);ox.closePath();ox.fill();
 disc(col,x,y-15.5*s+bow*s,2.6*s,2.8*s)}
function motes(n,vy,rgb,spread){while(parts.length<n)parts.push({x:rnd()*W,y:rnd()*H,v:(.5+rnd())*vy,p:rnd()*9,a:.2+rnd()*.5});
 for(const p of parts){p.y-=p.v*dt_;p.x+=Math.sin(st*.9+p.p)*(spread||6)*dt_;if(p.y<-2){p.y=H+2;p.x=rnd()*W}if(p.y>H+3){p.y=-2}if(p.x<0)p.x=W;if(p.x>W)p.x=0;
  ox.globalAlpha=p.a*(.6+.4*Math.sin(st*3+p.p));R_('rgb('+rgb+')',p.x,p.y,1,1)}ox.globalAlpha=1}
let dt_=.016;
// dígitos 3x5 para la cuenta del primer sueño
const DIG={1:'010110010010111',2:'111001111100111',3:'111001111001111'};
function digit(n,x,y,s,a){ox.globalAlpha=a;for(let i=0;i<15;i++)if(DIG[n][i]==='1')R_('#c9d4ff',x+(i%3)*s,y+((i/3)|0)*s,s,s);ox.globalAlpha=1}
function note(x,y,a){ox.globalAlpha=a;R_('#a9b8ff',x,y,3,2);R_('#a9b8ff',x+2,y-6,1,7);R_('#a9b8ff',x+3,y-6,2,1);ox.globalAlpha=1}

// ---------- escenas ----------
const SC={
// I · La nana: pasillo de piedra, una voz que cuenta hasta tres
d1(){const t=st;bg('#05040a','#0a0810');
 const vx=W/2,vy=84,bw=34,bh=40,L=vx-bw/2,Rr=vx+bw/2,T=vy-bh/2,B=vy+bh/2;
 poly('#15121c',[[0,H],[W,H],[Rr,B],[L,B]]);poly('#0b0911',[[0,0],[W,0],[Rr,T],[L,T]]);
 poly('#1b1724',[[0,0],[L,T],[L,B],[0,H]]);poly('#171320',[[W,0],[Rr,T],[Rr,B],[W,H]]);R_('#07050c',L,T,bw,bh);
 ox.strokeStyle='#0d0a14';ox.lineWidth=1;for(let k=1;k<7;k++){const f=k/7;ox.beginPath();ox.moveTo(0,lp(0,H,f));ox.lineTo(L,lp(T,B,f));ox.moveTo(W,lp(0,H,f));ox.lineTo(Rr,lp(T,B,f));ox.stroke()}
 for(let k=0;k<6;k++){const f=1-k/6,z=f*f;ox.beginPath();ox.moveTo(lp(L,0,z),lp(T,0,z));ox.lineTo(lp(L,0,z),lp(B,H,z));ox.moveTo(lp(Rr,W,z),lp(T,0,z));ox.lineTo(lp(Rr,W,z),lp(B,H,z));ox.stroke()}
 rad(vx,vy+6,70,'150,170,255',.2+.05*Math.sin(t*2));
 const lurch=t>7.2?(t-7.2)*.9:0,s=1+Math.min(1,t/9)*.5+lurch;fig(vx,B,s,'#030208',t>7.2?-1:2);
 if(t>7.2){const a=C((t-7.2)*3,0,1);R_('rgba(255,255,255,'+a+')',vx-2*s,B-17*s,1,1);R_('rgba(255,255,255,'+a+')',vx+1*s,B-17*s,1,1)}
 if(!parts.q)parts.q=[];if(t<7.6&&rnd()<dt_*1.6)parts.q.push({x:vx+rnd()*10-5,y:B-18,v:10+rnd()*8,p:rnd()*TAU,l:0});
 for(const n of parts.q){n.l+=dt_;n.y-=n.v*dt_;n.x+=Math.sin(n.p+n.l*2)*14*dt_;note(n.x,n.y,C(1-n.l/4.5,0,1)*.8)}parts.q=parts.q.filter(n=>n.l<4.5);
 [[2.4,1],[4.4,2],[6.4,3]].forEach(([a,n])=>{const k=t-a;if(k>0&&k<1.8)digit(n,vx-7,24,5,Math.min(1,k*3,(1.8-k)*2)*.9)});
 if(t>7.2&&t<8.1)R_('rgba(255,255,255,'+(.9*(1-(t-7.2)/.9))+')',0,0,W,H)},
// II · Maelis: corona sin joyas, las manos que se ofrecen
d2(){const t=st,mx=W/2;bg('#0b0714','#150d22');rad(mx,62,120,'255,196,110',.22+.04*Math.sin(t*1.5));motes(26,8,'255,214,140',5);
 poly('#241a33',[[mx-70,H],[mx-30,112],[mx+30,112],[mx+70,H]]);poly('#1a1226',[[mx-30,112],[mx-14,100],[mx+14,100],[mx+30,112]]);
 R_('#cfc3d8',mx-4,92,8,12);poly('#120c1c',[[mx-22,56],[mx-30,110],[mx-18,108],[mx-16,70]]);poly('#120c1c',[[mx+22,56],[mx+30,110],[mx+18,108],[mx+16,70]]);
 disc('#ddd2e4',mx,70,14,18);poly('#120c1c',[[mx-15,60],[mx,52],[mx+15,60],[mx+12,66],[mx,60],[mx-12,66]]);
 const op=ez((t-1.2)/1.2);R_('#3b2f55',mx-8,68,6,2);R_('#3b2f55',mx+2,68,6,2);if(op>0){ox.globalAlpha=op;R_('#0a0610',mx-7,68,4,2);R_('#0a0610',mx+3,68,4,2);R_('#ddd2e4',mx-8,67,6,1);R_('#ddd2e4',mx+2,67,6,1);ox.globalAlpha=1}
 const sm=ez((t-5.2)/1.4);ox.strokeStyle='#5a3a4e';ox.lineWidth=1;ox.beginPath();ox.moveTo(mx-5,79);ox.quadraticCurveTo(mx,79+3*sm,mx+5,79-sm*1.5);ox.stroke();
 // corona: aro dorado con engastes vacíos
 R_('#c9a54a',mx-17,50,34,4);for(let i=0;i<5;i++){R_('#c9a54a',mx-17+i*8,44-(i%2?0:2),3,6)}
 for(let i=0;i<7;i++){const f=.5+.5*Math.sin(t*2.2+i*1.7);R_('#0a0610',mx-14+i*4.6,51,2,2);ox.globalAlpha=.25*f;R_('#ffe9a8',mx-14+i*4.6,51,2,2);ox.globalAlpha=1}
 // manos que se acercan
 const hk=ez((t-2.4)/2.6);for(const sd of[-1,1]){const x=mx+sd*lp(100,22,hk),y=146+Math.sin(t*1.3)*1.5;R_('#241a33',sd>0?x+8:x-60,y-1,52,12);R_('#cfc3d8',x-9,y,18,8);for(let k=0;k<4;k++)R_('#cfc3d8',x-9+k*5,y-4-(k%2),3,5);R_('#cfc3d8',x+(sd>0?-12:9),y+1,3,5)}},
// III · La plaza: los Huecos se miran las manos
d3(){const t=st;bg('#15141c','#26242e');disc('#201e28',W/2,126,150,40);
 ox.strokeStyle='#2c2a36';ox.lineWidth=1;for(let k=0;k<6;k++){ox.beginPath();ox.ellipse(W/2,126,30+k*24,8+k*6,0,0,TAU);ox.stroke()}
 disc('#2f2c3a',W/2,122,17,5);disc('#0e0d14',W/2,121,12,3);R_('#2f2c3a',W/2-2,108,4,14);
 const N=14,up=ez((t-5.6)/1.6),list=[];for(let i=0;i<N;i++){const a=i/N*TAU+.2,x=W/2+Math.cos(a)*108,y=126+Math.sin(a)*30;list.push({x,y,a,i})}list.sort((p,q)=>p.y-q.y);
 for(const f of list){const s=.8+(f.y-96)/60,bow=lp(4,-1,up);fig(f.x,f.y,s,'#08060c',bow);
  if(f.x<W/2+60&&f.x>W/2-60||true){R_('#c9c0d0',f.x-1*s,f.y-8*s,2*s,2*s)}
  if(t>3.8&&t<7.6&&rnd()<dt_*3)parts.push({x:f.x,y:f.y-8*s,v:6+rnd()*8,a:.8,k:1});
  if(up>.3){const e=Math.min(1,(up-.3)*2);R_('rgba(255,77,109,'+e+')',f.x-1.5*s,f.y-16*s+bow*s,1,1);R_('rgba(255,77,109,'+e+')',f.x+.8*s,f.y-16*s+bow*s,1,1)}}
 for(const p of parts){if(!p.k)continue;p.y-=p.v*dt_;p.a-=dt_*.35;if(p.a>0){ox.globalAlpha=p.a;R_('#d8d0e0',p.x,p.y,1,1);ox.globalAlpha=1}}parts=parts.filter(p=>!p.k||p.a>0);
 for(let i=0;i<40;i++){const x=(i*47+t*(5+i%4))%W,y=(i*29+t*(9+i%5))%H;ox.globalAlpha=.4;R_('#b9b0c4',x,y,1,1)}ox.globalAlpha=1;
 if(t>6)rad(W/2,126,130,'255,77,109',.07*Math.min(1,(t-6)))},
// IV · La torre: dos jóvenes, una hogaza, la cadena que suena antes de existir
d4(){const t=st,cd=t>7.6?0:t>6.6?.5+.5*Math.sin(t*40):1;bg('#07061a','#1a1230');
 for(let i=0;i<50;i++){ox.globalAlpha=.35+.35*Math.sin(t*1.5+i);R_('#fff',(i*53)%W,(i*31)%80,1,1)}ox.globalAlpha=1;disc('#e8e2c8',262,34,9);disc('#07061a',266,31,8);
 R_('#171421',0,112,W,H-112);for(let x=0;x<W;x+=22)R_('#171421',x,100,14,14);R_('#0e0c16',0,112,W,3);
 rad(160,122,110,'255,170,80',.3*cd);
 // sombras en el parapeto (la del derecho no coincide: guarda algo a la espalda)
 ox.globalAlpha=.55*cd;disc('#05040a',118,96,8,10);R_('#05040a',111,100,14,14);disc('#05040a',204,92,9,12);R_('#05040a',196,98,16,16);R_('#05040a',211,100,12,2);R_('#05040a',221,98,2,8);ox.globalAlpha=1;
 fig(134,150,1.9,'#0a0810',3);fig(188,150,1.9,'#0a0810',3);R_('#3a2a44',128,126,12,3);R_('#2a3a44',182,126,12,3);
 disc('#c8964a',160,138,10,4);R_('#e0b46a',156,135,8,2);R_('#8a6020',158,140,5,1);
 R_('#d9d0b0',159,126,3,8);if(cd>0){disc('#ffd36a',160.5,124,1.5,2.5*cd)}
 // la cadena desciende antes de que exista
 const cl=C((t-3.6)*38,0,92);ox.strokeStyle='#6a6a7c';ox.lineWidth=1;for(let y=0;y<cl;y+=5){ox.beginPath();ox.ellipse(160+Math.sin(y*.3+t)*1.2,y,1.6,2.6,0,0,TAU);ox.stroke()}
 if(t>7.6){ox.fillStyle='rgba(2,1,8,'+C((t-7.6)*1.6,0,.55)+')';ox.fillRect(0,0,W,H)}
 motes(14,5,'255,200,120',4)},
// V · Dos firmas: la del rey y la tuya, de un yo más joven y asustado
d5(){const t=st,cd=t>7?C(1-(t-7)*1.4,0,1):1;ox.fillStyle='#120b07';ox.fillRect(0,0,W,H);for(let y=0;y<H;y+=6)R_('#17100a',0,y,W,1);
 rad(250,38,150,'255,170,80',.28*cd);R_('#cdbb8c',46,28,228,126);R_('#d9c79a',50,32,220,118);
 for(let i=0;i<7;i++){R_('#a6945f',64,48+i*10,(i%3===2?110:170)-((i*37)%30),1)}
 R_('#a6945f',56,34,1,114);R_('#b8a672',266,34,1,114);
 const sig=(x0,y0,w,seed,jit,p)=>{ox.strokeStyle='#2a140a';ox.lineWidth=jit?1:1.6;ox.beginPath();const n=Math.floor(60*p);for(let i=0;i<=n;i++){const f=i/60,x=x0+f*w,y=y0+Math.sin(f*TAU*(2+seed)+seed)*8*(1-f*.4)+Math.sin(f*TAU*7)*2+(jit?(rnd()-.5)*jit:0);if(i===0)ox.moveTo(x,y);else ox.lineTo(x,y)}ox.stroke();
  if(n>0){const f=n/60;return[x0+f*w,y0+Math.sin(f*TAU*(2+seed)+seed)*8*(1-f*.4)]}return[x0,y0]};
 const p1=ez((t-.8)/2.8),p2=ez((t-4)/2.6);R_('#8a6a30',72,150-12,70,1);R_('#8a6a30',184,150-12,70,1);
 const a=sig(72,130,86,1.2,0,p1),b=sig(186,132,64,.6,3.2,p2);
 const pen=t<3.8?a:b;if(t>.8&&t<6.8){R_('#0a0604',pen[0],pen[1]-2,2,2);ox.strokeStyle='#0a0604';ox.lineWidth=2;ox.beginPath();ox.moveTo(pen[0],pen[1]-2);ox.lineTo(pen[0]+22,pen[1]-24);ox.stroke()}
 if(t>7.4){const k=C((t-7.4)/1.4,0,1);ox.globalAlpha=.35*k;disc('#2a140a',b[0]-10,b[1]+2,10*k,5*k);ox.globalAlpha=1}
 R_('#6a1f1a',150,56,0,0);disc('#6a1f1a',162,142,6,6);disc('#8a2a22',161,141,3,3);
 rad(250,38,50,'255,200,110',.5*cd);R_('#e8d9a8',248,34,4,16*cd+1);if(cd>0)disc('#ffe08a',250,32,2,3*cd);
 ox.fillStyle='rgba(0,0,0,'+(t>7?C((t-7)*.18,0,.45):0)+')';ox.fillRect(0,0,W,H)},
// VI · El último muro: la frase raspada, el trono vacío con la corona partida
d6(){const t=st;
 if(t<7.2){ox.fillStyle='#17131d';ox.fillRect(0,0,W,H);for(let y=0;y<H;y+=18){R_('#0f0c14',0,y,W,1);for(let x=((y/18)%2)*20;x<W;x+=40)R_('#0f0c14',x,y,1,18)}
  rad(40,40,150,'255,150,70',.3+.05*Math.sin(t*9));
  const l1='NO PERMITAS QUE EL MUNDO',l2='VUELVA A OLVIDARTE',n=Math.max(0,Math.floor((t-.8)*7.5));ox.font='8px "Press Start 2P",monospace';ox.textBaseline='top';ox.fillStyle='#d8d0e8';ox.globalAlpha=.9;
  ox.fillText(l1.slice(0,n),16,64);if(n>l1.length)ox.fillText(l2.slice(0,n-l1.length),52,84);ox.globalAlpha=1;
  const ln=n>l1.length?2:1,tx=n>l1.length?52+ox.measureText(l2.slice(0,n-l1.length)).width:16+ox.measureText(l1.slice(0,n)).width,ty=(ln===2?84:64)+9;
  if(t>.8&&t<6.4){ox.strokeStyle='#8a8aa0';ox.lineWidth=3;ox.beginPath();ox.moveTo(tx,ty);ox.lineTo(tx+70,ty+90);ox.stroke();ox.strokeStyle='#cfd0e0';ox.lineWidth=1;ox.beginPath();ox.moveTo(tx,ty);ox.lineTo(tx+14,ty+18);ox.stroke();
   R_('#6a4a2a',tx+60,ty+80,16,5);if(rnd()<dt_*14)parts.push({x:tx,y:ty,vx:(rnd()-.5)*40,vy:-rnd()*30,l:.4})}
  for(const p of parts){p.l-=dt_;p.x+=p.vx*dt_;p.y+=p.vy*dt_;p.vy+=90*dt_;if(p.l>0){R_('#ffd36a',p.x,p.y,1,1)}}parts=parts.filter(p=>p.l>0)}
 if(t>6){const a=ez((t-6)/1.4);ox.globalAlpha=a;const mx=W/2;bg('#0a0610','#16101c');
  poly('#2a0f18',[[mx-10,70],[mx+10,70],[mx+56,H],[mx-56,H]]);
  for(const sd of[-1,1]){for(let k=0;k<3;k++){const x=mx+sd*(48+k*28),h=100-k*18;R_('#1c1626',x-5,70-k*6,10,h);R_('#2a2238',x-6,66-k*6,12,3)}}
  R_('#1a1424',mx-17,22,34,50);poly('#1a1424',[[mx-20,22],[mx-14,10],[mx-8,22]]);poly('#1a1424',[[mx+20,22],[mx+14,10],[mx+8,22]]);poly('#1a1424',[[mx-4,22],[mx,6],[mx+4,22]]);R_('#241c30',mx-12,60,24,10);R_('#120d1a',mx-14,70,28,8);
  rad(mx,58,40,'255,200,110',.45+.1*Math.sin(t*2.4));
  R_('#d9b44a',mx-9,55,7,4);R_('#d9b44a',mx-9,52,2,3);R_('#d9b44a',mx-5,51,2,4);R_('#d9b44a',mx+3,56,6,3);R_('#d9b44a',mx+6,53,2,3);
  const ky=94+Math.sin(t*1.8)*2;rad(mx,ky,22,'255,224,140',.5);disc('#e8c85a',mx-3,ky,3);R_('#e8c85a',mx-1,ky,10,2);R_('#e8c85a',mx+6,ky,2,4);R_('#e8c85a',mx+9,ky,2,3);
  motes(24,10,'255,220,150',4);ox.globalAlpha=1}}
};
// ---------- datos de cada sueño: título, duración y sonidos ----------
const rep=(a,b,s,f)=>{const o=[];for(let t=a;t<b;t+=s)o.push([t,f]);return o};
const sf=(f,d,ty,v,f2)=>()=>{try{sfx(f,d,ty,v,f2)}catch(e){}};
const DR={
 d1:{n:'I · La nana',d:9.6,cues:[[0,sf(55,6,'sine',.05,48)],[2.4,sf(330,.7,'sine',.05)],[4.4,sf(294,.7,'sine',.05)],[6.4,sf(262,.9,'sine',.05)],[7.2,sf(80,.9,'sawtooth',.07,38)]]},
 d2:{n:'II · Maelis',d:9.2,cues:[[.6,sf(660,1.6,'sine',.04,990)],[3,sf(520,1.6,'sine',.04,780)],[5.4,sf(780,1.8,'sine',.04,1170)],[0,sf(110,8,'triangle',.025,100)]]},
 d3:{n:'III · La plaza',d:9.4,cues:[[0,sf(96,8,'triangle',.035,84)],[5.6,sf(72,1.6,'sawtooth',.04,110)]]},
 d4:{n:'IV · La torre',d:9.4,cues:[[0,sf(70,7,'sine',.03,64)]].concat(rep(4,7.4,.38,sf(1500,.05,'square',.012,1200)),[[7.6,sf(60,1.2,'sine',.05,40)]])},
 d5:{n:'V · Dos firmas',d:9.4,cues:[[0,sf(60,8,'sine',.025,55)]].concat(rep(.9,3.6,.16,sf(1100,.07,'sawtooth',.012,900)),rep(4.1,6.6,.17,sf(1000,.07,'sawtooth',.012,800)),[[7.4,sf(70,1,'sine',.04,40)]])},
 d6:{n:'VI · El último muro',d:11.4,cues:rep(.9,6.3,.2,sf(1250,.09,'sawtooth',.014,900)).concat([[6.2,sf(98,5,'sine',.045,110)],[7.6,sf(880,2,'sine',.04,1320)]])}
};
// ---------- overlay ----------
function mkDom(){
 ov=document.createElement('div');ov.id='introAnim';
 ov.innerHTML='<canvas width="'+W+'" height="'+H+'"></canvas><div class="itx"><p></p></div><button class="isk">Saltar ›</button>';
 document.body.appendChild(ov);cv=ov.querySelector('canvas');cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;tbox=ov.querySelector('.itx p');
 if(!ob){ob=document.createElement('canvas');ob.width=W;ob.height=H}ox=ob.getContext('2d');
 vig=cx.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.62);vig.addColorStop(0,'rgba(0,0,0,0)');vig.addColorStop(1,'rgba(0,0,0,.75)');
 const skip=()=>{if(st>1.2)finish()};
 ov.addEventListener('pointerdown',skip);ov.querySelector('.isk').addEventListener('click',e=>{e.stopPropagation();finish()});
 keyH=e=>{e.stopPropagation();if(e.key==='Escape'||e.key==='Enter'||e.key===' '||e.key==='e'||e.key==='E'){e.preventDefault();if(!e.repeat)skip()}};
 upH=e=>{if(run)e.stopPropagation()};addEventListener('keydown',keyH,true);addEventListener('keyup',upH,true)}
function finish(){if(!run)return;run=0;cancelAnimationFrame(raf);removeEventListener('keydown',keyH,true);removeEventListener('keyup',upH,true);
 const o=ov;o.style.transition='opacity .6s';o.style.opacity=0;setTimeout(()=>{o.remove()},650);try{relAll()}catch(e){}}
function frame(ts){
 if(!run)return;raf=requestAnimationFrame(frame);dt_=Math.min(.05,(ts-last)/1000||.016);last=ts;st+=dt_;
 const d=cur.d;if(st>=d){finish();return}
 const a=C(Math.min(st/FADE,(d-st)/FADE),0,1);
 while(cues.length&&cues[0][0]<=st){cues.shift()[1]()}
 ox.globalAlpha=1;ox.fillStyle='#000';ox.fillRect(0,0,W,H);ox.save();SC[cur.id]();ox.restore();ox.globalAlpha=1;
 cx.globalAlpha=1;cx.fillStyle='#000';cx.fillRect(0,0,W,H);cx.globalAlpha=a;
 const amp=1.3*Math.min(1,st/1.5,(d-st)/1.5)+.3;for(let y=0;y<H;y+=4)cx.drawImage(ob,0,y,W,4,Math.sin(y*.09+st*1.7)*amp,y,W,4);
 cx.fillStyle=vig;cx.fillRect(0,0,W,H);cx.globalAlpha=1;
 tbox.style.opacity=C(Math.min((st-.7)/1,(d-st-.4)/1,1),0,1)*(st<4.2||d-st<1.4?1:.0)}
function start(id){
 if(run||!SC[id])return;cur=Object.assign({id:id},DR[id]);run=1;st=0;parts=[];cues=cur.cues.slice().sort((p,q)=>p[0]-q[0]);
 mkDom();tbox.textContent=cur.n;tbox.style.opacity=0;last=performance.now();raf=requestAnimationFrame(frame)}
// ---------- enganche: al descansar, si ese descanso trajo un sueño nuevo, se muestra su animación ----------
{const f=bonfire;bonfire=function(x){const b=Object.assign({},NX());const r=f.apply(this,arguments);
 try{const id=DK.find(k=>NX()[k]&&!b[k]);if(id)start(id)}catch(e){}return r}}
window.SueAnim={start,finish,ids:DK};
})();
