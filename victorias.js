// ===== VICTORIAS: animación propia para cada jefe derrotado + cinemática para cada final =====
// Se engancha a bossDown() y fin() sin tocar su lógica. Todo es procedural (sin imágenes) y se puede saltar tocando/pulsando.
(function(){
const now=()=>performance.now()/1000,cl01=v=>v<0?0:v>1?1:v,RR=Math.random,rr=(a,b)=>a+RR()*(b-a),pick=a=>a[RR()*a.length|0];
const h2r=c=>{const n=parseInt(c.slice(1),16);return(n>>16)+','+((n>>8)&255)+','+(n&255)};
const rnd=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const ease=t=>{t=cl01(t);return t*t*(3-2*t)};
// ======================= JEFES =======================
let VF=null;
const DUR=5.2;
function mkParts(id,e){const P=[],ex=e.x,ey=e.y-8,add=o=>P.push(Object.assign({age:0,d:0,vx:0,vy:0,gy:0,l:2,w:1,h:1,c:'#fff',gl:null,sw:0,sf:3,ph:RR()*6.28,y0:e.y+4,bn:0},o));
 const burst=(n,o)=>{for(let i=0;i<n;i++){const a=rr(-3.1,.2);const sp=rr(o.s0,o.s1);add(Object.assign({x:ex,y:ey,vx:Math.cos(a)*sp*(o.fx||1),vy:Math.sin(a)*sp-(o.up||0),gy:o.gy||300,l:rr(o.l0,o.l1),c:pick(o.c),w:o.w?o.w+(RR()*2|0):2,h:o.h?o.h+(RR()*2|0):1,bn:o.bn!==undefined?o.bn:1},o.x||{}))}};
 const radial=(n,o)=>{for(let i=0;i<n;i++){const a=RR()*6.283,sp=rr(o.s0,o.s1);add({x:ex,y:ey-(o.dy||0),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-(o.up||0),gy:o.gy||240,l:rr(o.l0,o.l1),d:o.d||0,c:pick(o.c),w:o.w||2,h:o.h||2,gl:o.gl&&RR()<.5?o.gl:null,bn:1})}};
 const rise=(n,o)=>{for(let i=0;i<n;i++)add({x:ex+rr(-o.sx,o.sx),y:ey+rr(0,o.sy||10),vy:-rr(o.v0,o.v1),gy:o.gy||0,sw:o.sw||10,sf:rr(2,5),l:rr(o.l0,o.l1),d:rr(0,o.d||1.5),c:pick(o.c),w:o.w||1,h:o.h||1,gl:o.gl||null})};
 // almas moradas que suben (todos los jefes)
 rise(22,{sx:26,v0:30,v1:70,l0:2.4,l1:3.6,d:1.6,c:['#d09aff','#e8c8ff'],gl:'208,154,255',w:1,h:2});
 if(id==='sepulturero'){burst(46,{s0:60,s1:170,up:30,l0:1.4,l1:2.6,c:['#d8d0b8','#b8b09a','#8a8272'],w:2,h:1});burst(30,{s0:40,s1:120,up:10,l0:1.2,l1:2.2,c:['#4a3a2a','#2a2218','#5a4a34'],w:2,h:2});
  rise(16,{sx:18,v0:16,v1:36,l0:2.6,l1:4,d:1.4,c:['#99bbff','#cfe0ff'],gl:'153,187,255',w:1,h:2,sw:6})}
 else if(id==='pastora'){rise(80,{sx:14,v0:22,v1:84,l0:2,l1:4,d:1.4,c:['#ff9a3c','#ffd27a','#ff6a2a'],gl:'255,150,60',sw:16});burst(14,{s0:60,s1:140,up:30,l0:1.2,l1:2,c:['#ffe0a0','#fff2c8'],w:1,h:2});
  rise(12,{sx:6,v0:10,v1:20,l0:2.4,l1:3.4,d:.6,c:['#6a6068','#8a7f86'],sw:6,w:2,h:2});for(const q of P)if(q.c==='#6a6068'||q.c==='#8a7f86')q.d+=2}
 else if(id==='cazador'){for(let i=0;i<64;i++)add({orb:1,x:ex,y:ey,cx:ex,cy:ey,ang:RR()*6.28,rad:rr(3,10),vr:rr(14,26),va:rr(3.2,6),up:rr(8,26),l:rr(2.2,3.6),d:rr(0,.9),c:pick(['#7a9a3a','#5a7a3a','#a8b84a','#c8d86a']),w:2,h:1});
  burst(16,{s0:70,s1:150,up:30,l0:1.2,l1:2,c:['#e8e0c8','#cfc6ae'],w:1,h:3});
  for(const dx of[-3,3])add({x:ex+dx,y:e.y-18,vy:-12,gy:-1,sw:3,l:3.8,d:.4,c:'#ffe66d',gl:'255,230,109',w:1,h:1});rise(18,{sx:12,v0:20,v1:50,l0:1.6,l1:2.6,d:1,c:['#ffe66d','#fff2b0'],gl:'255,230,109'})}
 else if(id==='caballero'){radial(28,{s0:55,s1:150,up:40,l0:1.6,l1:2.4,c:['#8a8a96','#6a6a78','#aaaab8'],w:3,h:2});
  rise(44,{sx:20,v0:12,v1:44,l0:3,l1:4.4,d:1.4,c:['#7a1a2e','#a0302a','#5a1020'],sw:12,w:2,h:1,gy:6});rise(18,{sx:16,v0:20,v1:50,l0:2,l1:3,d:1.2,c:['#c08aff','#e8c8ff'],gl:'170,90,255'})}
 else if(id==='rey'){radial(64,{s0:40,s1:180,up:30,l0:1.6,l1:2.8,d:1.6,dy:6,c:['#ffe66d','#c9a54a','#fff2b0'],gl:'255,220,109',gy:170});
  rise(96,{sx:64,sy:14,v0:20,v1:84,l0:3,l1:5,d:2.6,c:['#ffe66d','#fff2b0','#ffd24a'],gl:'255,220,109',sw:12});rise(40,{sx:40,v0:16,v1:60,l0:2.6,l1:4,d:2,c:['#b05cff','#d8a8ff'],gl:'176,92,255',sw:10})}
 else{const tc=(BS[id]&&BS[id].tr)||'#ffe66d';radial(46,{s0:40,s1:130,up:34,l0:1.4,l1:2.4,c:[tc,'#fff2b0','#fff'],gl:h2r(tc)});rise(30,{sx:20,v0:20,v1:60,l0:2.2,l1:3.6,d:1.4,c:[tc,'#fff2b0'],gl:h2r(tc),sw:10})}
 return P}
window.__vfStart=e=>{if(!e)return;VF={id:e.id,x:e.x,y:e.y,t0:now(),last:now(),col:(BS[e.id]&&BS[e.id].tr)||'#ffe66d',name:(BS[e.id]&&BS[e.id].n)||'',P:mkParts(e.id,e)}};
const _bd=bossDown;bossDown=function(e){_bd(e);try{window.__vfStart(e)}catch(er){console.error(er)}};
function drawBoss(){const t=now()-VF.t0,dt=Math.min(.05,now()-VF.last);VF.last=now();if(t>DUR){VF=null;return}
 const cx=Math.round(cam.x),cy=Math.round(cam.y),id=VF.id,rgb=h2r(VF.col),ex=VF.x,ey=VF.y-8;
 g.save();g.translate(-cx,-cy);
 // anillos de onda expansiva
 g.lineWidth=2;for(let k=0;k<3;k++){const r=(t-k*.28)*150;if(r<=0||r>130)continue;g.strokeStyle='rgba('+rgb+','+(.7*(1-r/130))+')';g.beginPath();g.ellipse(ex,VF.y,r,r*.45,0,0,6.283);g.stroke()}
 if(id==='caballero'||id==='rey'){for(let k=0;k<2;k++){const r=(t-.5-k*.4)*120;if(r<=0||r>110)continue;g.strokeStyle='rgba('+(id==='rey'?'176,92,255':'170,90,255')+','+(.5*(1-r/110))+')';g.beginPath();g.ellipse(ex,VF.y,r,r*.45,0,0,6.283);g.stroke()}}
 // columna de luz
 if(t>.25&&t<4){const a=Math.sin(Math.PI*cl01((t-.25)/3.75)),w=id==='rey'?24:10;g.globalCompositeOperation='lighter';
  for(const[ww,aa]of[[w,.1],[w*.6,.16],[w*.25,.3]]){g.fillStyle='rgba('+(id==='rey'?'255,226,120':rgb)+','+aa*a+')';g.fillRect(Math.round(ex-ww/2),Math.round(VF.y-170),Math.round(ww),170)}g.globalCompositeOperation='source-over';glow(ex,VF.y,40,rgb,.35*a)}
 // piezas propias de cada jefe
 if(id==='sepulturero'){const k=ease((t-.8)/1.4),a=cl01((4.6-t)/1.2);if(k>0){const h=Math.round(11*k),y=Math.round(VF.y+3-h);g.globalAlpha=a;glow(ex,y,16,'153,187,255',.35*a);fr(ex-1,y,3,h,'#5a4a3a');fr(ex-4,y+3,9,3,'#5a4a3a');fr(ex-1,y,1,h,'#8a7a62');fr(ex-4,y+3,9,1,'#8a7a62');fr(ex-6,VF.y+2,13,2,'#2a2218');g.globalAlpha=1}}
 if(id==='pastora'){const k=1-cl01((t-.2)/2.4);if(k>0){const h=Math.max(1,Math.round(8*k*(.75+.25*Math.sin(t*30)))),y=VF.y-14;glow(ex,y-h/2,18*k+4,'255,150,60',.5*k);for(let c=-2;c<=2;c++){const hh=Math.max(1,Math.round(h*(1-Math.abs(c)*.28)));fr(ex+c,y-hh,1,hh,'#ff7a1c');fr(ex+c,y-Math.round(hh*.6),1,Math.round(hh*.6),'#ffc860')}}
  fr(ex-2,VF.y-14,5,1,'#3a3030');fr(ex-2,VF.y-13,5,3,'#2a2020')}
 if(id==='cazador'){const a=cl01((3.6-t)/1.2);if(t>.3&&a>0){g.globalAlpha=a*.9;const k=ease((t-.3)/1.6);for(const s of[-1,1]){const bx=ex+s*3,by=VF.y-14-k*10;fr(bx,by,1,1,'#ffe66d')}g.globalAlpha=1}}
 if(id==='caballero'&&t<2.4){const k=cl01(t/.35);g.globalAlpha=1-cl01((t-1.6)/.8);g.fillStyle='#8a8a96';for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.5,r=6+t*22;fr(ex+Math.cos(a)*r,ey+Math.sin(a)*r*.7,3,2,'#8a8a96')}g.globalAlpha=1}
 if(id==='rey'){const up=Math.min(t,1.6),cyc=VF.y-22-up*14,a=cl01(1.7-t*1);
  if(t<1.65){const sp=cl01((t-1.2)/.45)*7;g.globalAlpha=1;glow(ex,cyc,26,'255,220,109',.6);for(const s of[-1,1]){const bx=ex+s*sp;fr(bx-(s>0?0:4),cyc,5,2,'#c9a54a');fr(bx-(s>0?0:4),cyc-2,1,2,'#ffe66d');fr(bx+(s>0?2:-2),cyc-3,1,3,'#ffe66d');fr(bx+(s>0?4:-4),cyc-2,1,2,'#ffe66d');fr(bx-(s>0?0:4),cyc,5,1,'#fff2b0')}}}
 // partículas
 for(let i=VF.P.length-1;i>=0;i--){const p=VF.P[i];if(p.d>0){p.d-=dt;continue}p.age+=dt;if(p.age>p.l){VF.P.splice(i,1);continue}
  if(p.orb){p.ang+=p.va*dt;p.rad+=p.vr*dt;p.x=p.cx+Math.cos(p.ang)*p.rad;p.y=p.cy+Math.sin(p.ang)*p.rad*.55-p.age*p.up}
  else{p.vy+=p.gy*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.sw)p.x+=Math.sin(p.age*p.sf+p.ph)*p.sw*dt;if(p.bn&&p.vy>0&&p.y>p.y0){p.y=p.y0;p.vy*=-.35;p.vx*=.6;p.bn--}}
  const a=cl01((p.l-p.age)/(p.l*.45));g.globalAlpha=a;if(p.gl)glow(p.x,p.y,4+p.w*2,p.gl,.5*a);fr(p.x,p.y,p.w,p.h,p.c)}
 g.globalAlpha=1;g.restore();
 // destello blanco
 const fl=Math.max(0,.65-t*2.6)+(id==='rey'?Math.max(0,.5-Math.abs(t-1.65)*3):0);if(fl>0){g.fillStyle='rgba(255,255,255,'+fl+')';g.fillRect(0,0,GW,GH)}
 // rótulo con el nombre del jefe
 if(t>.5&&t<4.6){const a=cl01((t-.5)/.5)*cl01((4.6-t)/.6),nm=VF.name.toUpperCase(),n=Math.min(nm.length,Math.floor((t-.5)*18)),y=Math.round(GH*.27);
  g.globalAlpha=a;const w=Math.min(GW-40,nm.length*9)*cl01((t-.5)/1.2);g.fillStyle='rgba(0,0,0,.45)';g.fillRect(GW/2-w/2-6,y-12,w+12,20);fr(GW/2-w/2-6,y-12,w+12,1,'#e6c26a');fr(GW/2-w/2-6,y+7,w+12,1,'#7a5a1e');
  tx(nm.slice(0,n),GW/2,y+2,'#ffe9a0','center',8);g.globalAlpha=1}}
// ======================= FINALES =======================
let EC=null;const ENDDUR=12.5;
const motes=(ts,n,rgb,sp,dirY,sz,a)=>{for(let i=0;i<n;i++){const x=rnd(i)*GW+Math.sin(ts*.7+i)*8,y0=rnd(i+9)*GH,v=sp*(.5+rnd(i+3)),yy=((dirY>0?y0+ts*v:y0-ts*v)%GH+GH)%GH;const al=a*(.4+.6*Math.abs(Math.sin(ts*1.6+i)));g.fillStyle='rgba('+rgb+','+al+')';g.fillRect(Math.round(x),Math.round(yy),sz||1,sz||1)}};
const SC={
 rest(ts){const a=cl01(ts/3);const q=g.createLinearGradient(0,GH,0,GH*.15);q.addColorStop(0,'rgba(255,170,90,'+.85*a+')');q.addColorStop(.55,'rgba(255,110,80,'+.35*a+')');q.addColorStop(1,'rgba(40,20,80,0)');g.fillStyle=q;g.fillRect(0,0,GW,GH);
  const sy=GH-22-ease(ts/9)*70,sx=GW/2;g.globalCompositeOperation='lighter';glow(sx,sy,110,'255,190,100',.5*a);glow(sx,sy,46,'255,240,200',.6*a);
  for(let i=0;i<16;i++){const an=ts*.25+i*Math.PI/8;g.fillStyle='rgba(255,230,160,'+.12*a+')';g.save();g.translate(sx,sy);g.rotate(an);g.fillRect(14,-1,70+10*Math.sin(ts+i),2);g.restore()}g.globalCompositeOperation='source-over';
  g.fillStyle='#ffe9a0';for(let j=-9;j<=9;j++)for(let i=-9;i<=9;i++)if(i*i+j*j<=70)g.fillRect(Math.round(sx+i),Math.round(sy+j),1,1);
  // las torres de Valdora se reconstruyen
  for(let i=0;i<9;i++){const th=(26+(i*13)%34)*ease((ts-i*.3)/3.2),x=14+i*52,by=GH-26;g.fillStyle='#0c0714';g.fillRect(x,by-th,16,th+26);for(let k=0;k<4;k++)if(th>10)g.fillRect(x+k*5,by-th-3,3,3);
   if(th>20){const wa=cl01((ts-i*.3-3)/1.2);g.fillStyle='rgba(255,210,110,'+wa+')';g.fillRect(x+7,by-th+8,2,4);glow(x+8,by-th+10,8,'255,200,100',.3*wa)}}
  g.fillStyle='#0c0714';g.fillRect(0,GH-26,GW,26);motes(ts,70,'255,220,130',14,-1,1,.8)},
 lib(ts){g.fillStyle='rgba(8,10,30,'+.5*cl01(ts/2)+')';g.fillRect(0,0,GW,GH);const br=ts-3.2;
  for(const ry of[GH*.42,GH*.56]){for(let x=-8;x<GW+8;x+=8){let dx=0,dy=Math.sin(x*.05+ry)*5+(ry>GH*.5?3:-3),al=1;if(br>0){const s=Math.sign(x-GW/2)||1,k=Math.min(br,2.2);dx=s*k*k*34*(.5+Math.abs(x-GW/2)/GW);dy+=k*k*70;al=cl01(1-br/2.4)}else{dy+=Math.sin(ts*30+x)*(ts>2.4?1.2:0)}
    g.globalAlpha=al;g.fillStyle=(x/8|0)%2?'#8a8a96':'#6a6a78';g.fillRect(Math.round(x+dx),Math.round(ry+dy),6,3);g.fillStyle='#b8b8c6';g.fillRect(Math.round(x+dx),Math.round(ry+dy),6,1);g.globalAlpha=1}}
  if(br>0){const f=Math.max(0,1-br*1.1);g.fillStyle='rgba(220,235,255,'+f*.9+')';g.fillRect(0,0,GW,GH);g.globalCompositeOperation='lighter';glow(GW/2,GH/2,60+br*70,'170,200,255',.5*cl01(1-br/5));
   for(let k=0;k<2;k++){const r=(br-k*.5)*110;if(r>0){g.strokeStyle='rgba(190,215,255,'+.6*cl01(1-r/160)+')';g.lineWidth=2;g.beginPath();g.arc(GW/2,GH/2,r,0,6.283);g.stroke()}}g.globalCompositeOperation='source-over'}
  motes(ts,50,br>0?'200,225,255':'150,150,160',16+(br>0?30:0),-1,1,.8)},
 usu(ts){const pu=.3+.1*Math.sin(ts*2.4);g.globalCompositeOperation='lighter';glow(GW/2,GH/2+6,100,'150,40,120',pu);glow(GW/2,GH/2+6,50,'200,60,90',pu*.6);g.globalCompositeOperation='source-over';
  const cx=GW/2,by=GH/2+44;g.fillStyle='#120a1e';g.fillRect(cx-16,by-10,32,10);g.fillRect(cx-12,by-58,24,48);g.fillRect(cx-20,by-24,8,16);g.fillRect(cx+12,by-24,8,16);g.fillRect(cx-8,by-66,16,8);
  g.fillStyle='#5a3a80';g.fillRect(cx-12,by-58,1,48);g.fillRect(cx-20,by-24,1,16);g.fillRect(cx-8,by-66,16,1);g.fillRect(cx-16,by-10,32,1);
  const k=ease(ts/5),y=-24+(by-84)*k;g.globalCompositeOperation='lighter';glow(cx,y+3,34,'255,220,109',.4*k+.1);g.globalCompositeOperation='source-over';
  for(const dx of[-8,-4,0,4,8])g.fillRect(0,0,0,0);
  fr(cx-9,y,18,4,'#c9a54a');fr(cx-9,y,18,1,'#fff2b0');for(const dx of[-9,-4,1,6]){fr(cx+dx,y-4,3,4,'#c9a54a');fr(cx+dx,y-4,1,4,'#ffe66d')}fr(cx-1,y+1,2,2,'#c0243c');
  if(ts>5){const r=(ts-5)*90;if(r<120){g.strokeStyle='rgba(255,220,109,'+.6*(1-r/120)+')';g.lineWidth=2;g.beginPath();g.ellipse(cx,by-84+4,r,r*.4,0,0,6.283);g.stroke()}}
  motes(ts,60,'210,90,150',26,1,1,.7)},
 nom(ts){const nm=(S.name||'Sin nombre').toUpperCase(),cx=GW/2,cy=GH*.46,sz=nm.length>9?10:14,cw=sz*.95,x0=cx-nm.length*cw/2+cw/2;
  g.globalCompositeOperation='lighter';glow(cx,cy,90,'120,170,255',.22*cl01(ts/3));g.globalCompositeOperation='source-over';
  for(let r=0;r<5;r++){const off=((ts*13+r*57)%(GH+30));g.globalAlpha=.1+.04*r%.2;tx(nm,cx+(r%2?-1:1)*(70+r*16),GH+10-off,'#9ad0ff','center',6);tx(nm,cx+(r%2?1:-1)*(110+r*12),GH+30-((off+80)%(GH+30)),'#9ad0ff','center',5)}g.globalAlpha=1;
  for(let i=0;i<nm.length;i++){const k=ease((ts-.5-i*.18)/2.4);if(k<=0)continue;const sx=rnd(i+1)*GW,sy=rnd(i+30)*GH,x=sx+(x0+i*cw-sx)*k,y=sy+(cy-sy)*k;g.globalAlpha=cl01(k*1.5);glow(x,y-3,10,'150,200,255',.35*k);tx(nm[i],x,y,'#fff','center',sz)}g.globalAlpha=1;
  if(ts>3.4)for(let k=0;k<4;k++){const r=((ts-3.4)*38+k*34)%140;g.strokeStyle='rgba(150,200,255,'+.45*(1-r/140)+')';g.lineWidth=1;g.beginPath();g.arc(cx,cy-3,r,0,6.283);g.stroke()}
  motes(ts,40,'170,210,255',10,-1,1,.7)},
 olv(ts){const a=cl01(ts/7);g.fillStyle='rgba(222,222,234,'+a+')';g.fillRect(0,0,GW,GH);
  const fx=-10+ts*20,fy=GH*.62,step=(ts*6)|0;
  for(let i=0;i<30;i++){const x=fx-i*9;if(x<0||x>GW)continue;g.fillStyle='rgba(70,60,90,'+.28*(1-i/30)*(1-a*.5)+')';g.fillRect(Math.round(x),Math.round(fy+7+(i&1)*2),2,1)}
  g.fillStyle='#2a2438';const bob=step&1;g.fillRect(Math.round(fx),Math.round(fy-8+bob),3,3);g.fillRect(Math.round(fx)-1,Math.round(fy-5+bob),5,6);g.fillRect(Math.round(fx),Math.round(fy+1),1,5+(step&1));g.fillRect(Math.round(fx)+2,Math.round(fy+1),1,5+(1-(step&1)));
  g.fillStyle='#4a3e68';g.fillRect(Math.round(fx)-3,Math.round(fy-5+bob),2,7);
  motes(ts,50,'120,110,140',9,-1,1,.6);g.globalAlpha=1}};
function endBars(t){const b=Math.round(28*ease(t/1.2));g.fillStyle='#000';g.fillRect(0,0,GW,b);g.fillRect(0,GH-b,GW,b);fr(0,b,GW,1,'rgba(201,165,74,.6)');fr(0,GH-b-1,GW,1,'rgba(201,165,74,.6)')}
function drawEnd(){const t=now()-EC.t0;if(t>=ENDDUR||EC.skip){finishEnd();return}
 g.save();g.fillStyle='rgba(0,0,0,'+.97*cl01(t/1.4)+')';g.fillRect(0,0,GW,GH);
 const ts=t-1.1;if(ts>0&&SC[EC.k])SC[EC.k](ts);
 endBars(t);
 // título del final
 if(t>6){const nm=EC.name.toUpperCase(),n=Math.min(nm.length,Math.floor((t-6)*13)),a=cl01((t-6)/.8)*cl01((ENDDUR-t)/1.2),dark=EC.k==='olv';
  g.globalAlpha=a;tx('· FINAL ·',GW/2,GH-66,dark?'#6a5a30':'#c9a54a','center',6);const y=GH-48;tx(nm.slice(0,n),GW/2,y,dark?'#2a2438':'#ffe9a0','center',14);
  const w=cl01((t-6.2)/1.6)*Math.min(GW-80,nm.length*14);fr(GW/2-w/2,y+6,w,1,dark?'#6a5a30':'#c9a54a');g.globalAlpha=1}
 // aviso de saltar
 if(t>2&&t<ENDDUR-1){g.globalAlpha=.35+.15*Math.sin(t*3);tx('toca para saltar',GW-6,GH-32,'#a89cc8','right',5);g.globalAlpha=1}
 g.restore();
 const fo=cl01((t-(ENDDUR-1.2))/1.2);if(fo>0){g.fillStyle='rgba(0,0,0,'+fo+')';g.fillRect(0,0,GW,GH)}}
function finishEnd(){const m=EC.m;EC=null;window.__cine=false;m.style.transition='none';m.style.opacity='0';m.style.display='flex';requestAnimationFrame(()=>{m.style.transition='opacity 1.6s';m.style.opacity='1';setTimeout(()=>{m.style.transition='';m.style.opacity=''},1800)})}
const _fin=fin;fin=function(k){_fin(k);try{const m=$('menu'),e=typeof ENDS[k]==='function'?ENDS[k]():ENDS[k];EC={k,m,name:(e&&e[0])||'',t0:now(),skip:false};window.__cine=true;m.style.display='none'}catch(er){console.error(er)}};
const skip=()=>{if(EC&&now()-EC.t0>1.4)EC.skip=true};
addEventListener('pointerdown',skip,true);addEventListener('keydown',skip,true);
// ---- enganche al dibujo ----
const _dr=draw;draw=function(){_dr.apply(this,arguments);if(!W||!P)return;try{if(VF)drawBoss();if(EC)drawEnd()}catch(er){if(!draw.err){draw.err=1;console.error(er)}VF=null}};
})();
