// ===== SPRITES: objetos del mundo y personajes (horneados a canvas con contorno + luz de borde) =====
for(const k in TH)TH[k].k=k;
const pline=(x,x0,y0,x1,y1,c,t=1)=>{x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);x.fillStyle=c;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy,n=0;for(;;){x.fillRect(x0,y0,t,t);if((x0===x1&&y0===y1)||n++>200)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}};
const disc=(x,cx,cy,r,c)=>{x.fillStyle=c;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r+r*.7)x.fillRect((cx+i)|0,(cy+j)|0,1,1)};

// ---- objetos altos / decoración sólida ----
function bakeTree(t,v,dead){const W=48,H=64,c=mkc(W,H),x=c.getContext('2d'),R=rngS(v*131+(dead?7:3)),cx=24,by=H-3,burnt=t===TH.valdora;
 const tw=dead?5:7,trunkTop=by-(dead?30:20);
 rect(x,cx-tw/2,trunkTop,tw,by-trunkTop,'#3a2a20');rect(x,cx-tw/2,trunkTop,2,by-trunkTop,'#5a4030');rect(x,cx+tw/2-2,trunkTop,2,by-trunkTop,'#241812');
 rect(x,cx-tw/2-2,by-3,2,3,'#3a2a20');rect(x,cx+tw/2,by-3,2,3,'#241812');for(let i=0;i<5;i++)dot(x,cx-tw/2+1+R()*(tw-2),trunkTop+R()*(by-trunkTop),'#241812');
 if(dead){const bc=burnt?'#1a1210':'#2c2018',bl=burnt?'#2e221c':'#4a3626';
  const br=[[-1,-14,-16],[1,-18,-10],[-1,-8,-20],[1,-4,-18]];br.forEach(([s,dx,dy],i)=>{const sy=trunkTop+4+i*4;pline(x,cx+s*2,sy,cx+s*2+dx*.6,sy+dy*.6,bc,2);pline(x,cx+s*2+dx*.6,sy+dy*.6,cx+s*2+dx,sy+dy,bc,1);pline(x,cx+s*2+dx*.6,sy+dy*.6,cx+s*2+dx*.8+s*3,sy+dy-3,bl,1)});
  pline(x,cx,trunkTop,cx-4,trunkTop-12,bc,2);pline(x,cx,trunkTop,cx+5,trunkTop-14,bc,2);pline(x,cx+5,trunkTop-14,cx+9,trunkTop-20,bl,1);pline(x,cx-4,trunkTop-12,cx-7,trunkTop-19,bl,1);
  if(!burnt)for(let i=0;i<9;i++){const X=cx-14+R()*28,Y=trunkTop-18+R()*20;disc(x,X,Y,1+(R()<.4?1:0),R()<.5?'#5a5a2c':'#3e4a2a')}}
 else{const g=t.grass?['#1c3a2a','#2d5a3e','#13281c']:['#2a4a2a','#3d6a3a','#183018'];
  for(let i=0;i<7;i++){const X=cx+(R()-.5)*22,Y=by-36-R()*14;disc(x,X|0,Y|0,8+(R()*5|0),g[2])}
  for(let i=0;i<7;i++){const X=cx+(R()-.5)*20,Y=by-38-R()*12;disc(x,X|0,Y|0,6+(R()*4|0),g[0])}
  for(let i=0;i<6;i++){const X=cx-3+(R()-.5)*16,Y=by-42-R()*8;disc(x,X|0,Y|0,3+(R()*3|0),g[1])}
  for(let i=0;i<10;i++)dot(x,cx-14+R()*28,by-50+R()*22,'#7aa86a')}
 return finish(c)}
function bakePillar(t,v,broken){const c=mkc(20,52),x=c.getContext('2d'),R=rngS(v+41),b=52-3,top=broken?18+(v%3)*5:4;
 rect(x,3,b-5,14,5,t.wf[1]);rect(x,3,b-5,14,1,t.hi);rect(x,3,b-1,14,1,t.mo);
 rect(x,5,top+4,10,b-top-9,t.wf[0]);for(let i=0;i<4;i++){rect(x,5+i*3,top+4,1,b-top-9,i%2?t.wf[2]:t.hi)}
 rect(x,5,top+4,2,b-top-9,mixc(t.wf[0],t.hi,.6));rect(x,13,top+4,2,b-top-9,t.wf[2]);
 if(!broken){rect(x,3,top,14,4,t.wf[1]);rect(x,3,top,14,1,t.hi);rect(x,5,top+4,10,1,t.mo);rect(x,4,top+4,12,1,t.wf[2])}
 else{for(let i=0;i<10;i++)rect(x,5+i,top+3-(R()*3|0),1,3,t.wf[R()<.5?0:2]);pline(x,7,top+6,10,top+14,t.mo)}
 for(let i=0;i<6;i++)dot(x,5+R()*10,top+6+R()*(b-top-12),t.mo);return finish(c)}
function bakeStatue(t,v){const c=mkc(20,44),x=c.getContext('2d'),s=t.wf,b=44-3;
 rect(x,3,b-7,14,7,s[1]);rect(x,3,b-7,14,1,t.hi);rect(x,4,b-8,12,1,s[2]);
 rect(x,6,b-22,8,15,s[0]);rect(x,6,b-22,2,15,t.hi);rect(x,12,b-22,2,15,s[2]);rect(x,4,b-20,3,8,s[0]);rect(x,13,b-20,3,8,s[2]);
 rect(x,7,b-31,6,9,s[0]);rect(x,7,b-31,6,2,t.hi);rect(x,8,b-27,4,2,t.mo);rect(x,9,b-23,2,1,s[2]);
 rect(x,9,b-18,2,16,t.hi);rect(x,8,b-16,4,1,t.hi);pline(x,10,b-10,10,b-4,'#8a96ac');return finish(c)}
function bakeTomb(t,v){const c=mkc(20,24),x=c.getContext('2d'),b=21,R=rngS(v+5);
 rect(x,3,b-3,14,3,'#2a2018');for(let i=0;i<8;i++)dot(x,3+R()*14,b-3+R()*3,'#3a2e22');
 rect(x,5,b-15,10,13,t.wf[0]);rect(x,6,b-16,8,1,t.wf[0]);rect(x,7,b-17,6,1,t.wf[0]);rect(x,5,b-15,2,13,t.hi);rect(x,13,b-15,2,13,t.wf[2]);
 rect(x,9,b-13,2,7,t.mo);rect(x,7,b-11,6,2,t.mo);if(v%2)for(let i=0;i<4;i++)dot(x,6+R()*8,b-14+R()*10,'#4a7a4a');return finish(c)}
function bakeCross(t,v){const c=mkc(18,26),x=c.getContext('2d'),b=23;rect(x,3,b-2,12,2,'#2a2018');rect(x,8,b-20,3,19,'#5a4a3a');rect(x,8,b-20,1,19,'#7a6a58');rect(x,4,b-16,11,3,'#5a4a3a');rect(x,4,b-16,11,1,'#7a6a58');if(v%2)pline(x,9,b-14,6,b-8,'#3a2e22');return finish(c)}
function bakeBarrel(t,v){const c=mkc(18,20),x=c.getContext('2d'),b=17;rect(x,3,b-13,12,13,'#6a4a2e');rect(x,2,b-10,14,8,'#6a4a2e');rect(x,3,b-13,3,13,'#8a6a42');rect(x,12,b-13,3,13,'#4a321e');rect(x,2,b-11,14,1,'#2a2a30');rect(x,2,b-4,14,1,'#2a2a30');rect(x,4,b-14,10,1,'#3a2a1a');if(v%2){rect(x,6,b-8,4,3,'#241810')}return finish(c)}
function bakeCrate(t,v){const c=mkc(18,20),x=c.getContext('2d'),b=17;rect(x,2,b-13,14,13,'#7a5a38');rect(x,2,b-13,14,2,'#9a7a50');rect(x,2,b-13,2,13,'#5a3e24');rect(x,14,b-13,2,13,'#5a3e24');pline(x,3,b-12,15,b-1,'#5a3e24');pline(x,15,b-12,3,b-1,'#4a321e');rect(x,2,b-1,14,1,'#2a1c10');return finish(c)}
function bakeRock(t,v){const c=mkc(20,18),x=c.getContext('2d'),R=rngS(v*9+2),b=15,g=t.grass?['#5a5a60','#74747c','#3e3e46']:['#4a4458','#625b72','#2e2a3a'];
 disc(x,10,b-6,6,g[2]);disc(x,9,b-7,5,g[0]);disc(x,8,b-9,3,g[1]);rect(x,4,b-1,12,2,g[2]);for(let i=0;i<4;i++)dot(x,5+R()*10,b-10+R()*8,g[2]);return finish(c)}
function bakeBush(t,v){const c=mkc(20,18),x=c.getContext('2d'),R=rngS(v*7+1),b=15,g=t.grass?[t.grass[2],t.gl,t.gd]:['#1a2a1a','#2a4a2a','#101c10'];
 for(let i=0;i<5;i++)disc(x,6+R()*9|0,b-6-R()*3|0,4+(R()*2|0),g[2]);for(let i=0;i<5;i++)disc(x,6+R()*9|0,b-7-R()*3|0,3+(R()*2|0),g[0]);for(let i=0;i<5;i++)dot(x,5+R()*10,b-11+R()*6,g[1]);return finish(c)}
function bakeRubble(t,v){const c=mkc(20,14),x=c.getContext('2d'),R=rngS(v*3+8);for(let i=0;i<6;i++){const X=3+R()*11|0,Y=4+R()*5|0,w=3+R()*4|0;rect(x,X,Y,w,3,t.wf[R()*3|0]);rect(x,X,Y,w,1,t.hi)}return finish(c)}
function bakeBrazier(t){const c=mkc(20,26),x=c.getContext('2d');pline(x,5,23,8,13,'#3a3440');pline(x,15,23,12,13,'#3a3440');pline(x,10,23,10,13,'#4a4450');rect(x,3,10,14,4,'#5a5260');rect(x,3,10,14,1,'#8a82a0');rect(x,4,13,12,2,'#2a2630');rect(x,5,9,10,1,'#2a1410');return finish(c)}
function bakeWell(t){const c=mkc(24,30),x=c.getContext('2d');rect(x,3,16,18,10,'#6a6070');rect(x,3,16,18,2,'#8a8094');rect(x,3,24,18,2,'#3a3440');rect(x,6,18,12,5,'#0a1020');rect(x,7,19,10,2,'#1a3050');rect(x,3,4,2,14,'#4a3624');rect(x,19,4,2,14,'#4a3624');rect(x,2,3,20,3,'#5a2a28');rect(x,2,3,20,1,'#8a4a3c');rect(x,11,8,2,6,'#3a2a1a');return finish(c)}
function bakeBarricade(t,v){const c=mkc(20,22),x=c.getContext('2d'),b=19;for(let i=0;i<4;i++){const X=2+i*4;pline(x,X,b,X+(i%2?2:-1),b-16-(i%2)*3,i%2?'#5a4028':'#4a3420',3)}pline(x,1,b-12,18,b-6,'#6a4a30',2);pline(x,1,b-5,18,b-11,'#5a4028',2);for(let i=0;i<4;i++)dot(x,3+i*4,b-18-(i%2)*3,'#8a8a96');return finish(c)}
function bakeGravel(t,v){return null}
// carteles de zona: lápidas sueltas, jarrones...
function bakeUrn(t,v){const c=mkc(16,18),x=c.getContext('2d'),b=15;rect(x,4,b-9,8,9,'#6a4a3a');rect(x,3,b-7,10,5,'#6a4a3a');rect(x,5,b-11,6,2,'#8a6a52');rect(x,4,b-9,2,9,'#8a6a52');rect(x,10,b-9,2,9,'#3e2a20');return finish(c)}
const OBJ={ // nombre: [fábrica, sólido, altura de sombra]
 wall:0,roof:0,hwall:0,
 tree:v=>bakeTree(TH.bosque,v,false),dtree:(v,t)=>bakeTree(t,v,true),pillar:(v,t)=>bakePillar(t,v,false),bpillar:(v,t)=>bakePillar(t,v,true),statue:(v,t)=>bakeStatue(t,v),
 tomb:(v,t)=>bakeTomb(t,v),cross:(v,t)=>bakeCross(t,v),barrel:(v,t)=>bakeBarrel(t,v),crate:(v,t)=>bakeCrate(t,v),rock:(v,t)=>bakeRock(t,v),bush:(v,t)=>bakeBush(t,v),
 rubble:(v,t)=>bakeRubble(t,v),brazier:(v,t)=>bakeBrazier(t),well:(v,t)=>bakeWell(t),barr:(v,t)=>bakeBarricade(t,v),urn:(v,t)=>bakeUrn(t,v)};
const SOLID_OBJ=new Set(['wall','roof','hwall','tree','dtree','pillar','bpillar','statue','tomb','cross','barrel','crate','rock','brazier','well','barr','urn','gate']);
const NOSOLID_OBJ=new Set(['bush','rubble']);// decorativos: se pueden cruzar
const objArt=(n,v,t)=>cached('ob'+n+v+t.k,()=>{const f=OBJ[n];return f?(n==='tree'?bakeTree(t,v,false):f(v,t)):null});

// ---- personajes ----
const KITS={
 player:{bw:10,th:8,lh:7,hw:8,hh:8,A:['#26264a','#3c3c72','#14142c'],boot:'#10101e',belt:'#3a2a1a',buckle:'#c9a54a',head:'hood',hc:['#1c1c38','#2c2c58','#0f0f22'],eye:'#7df9ff',cape:'#1a2a5a',capeE:'#4aa8c8',pauld:1,emblem:'#7df9ff',wp:'sword'},
 soldier:{bw:11,th:8,lh:7,hw:8,hh:8,A:['#6d7a8c','#93a1b6','#434d5c'],boot:'#2c323c',belt:'#3a2a1a',buckle:'#c9a54a',head:'helm',hc:['#8c9ab0','#b0bccc','#58647a'],eye:'#ffb347',pauld:1,plume:'#a0302a',wp:'sword'},
 hollow:{bw:9,th:7,lh:6,hw:8,hh:7,A:['#4a3f66','#6a5c8c','#2c2440'],boot:'#1e1830',belt:'#2c2440',head:'hood',hc:['#3a3054','#52456f','#241c38'],eye:'#ff4d6d',hunch:1,arm:2,wp:'claw'},
 archer:{bw:9,th:8,lh:7,hw:8,hh:8,A:['#355e4a','#4f8566','#1f3a2c'],boot:'#1c2a20',belt:'#4a3a22',head:'hood',hc:['#2c5040','#42705a','#1a3226'],eye:'#ffe66d',cape:'#244a38',capeE:'#3a7a5a',wp:'bow'},
 brute:{big:1,bw:15,th:11,lh:8,hw:10,hh:9,A:['#6a3a3a','#8e5252','#3e2020'],boot:'#2a1414',belt:'#2a1a10',buckle:'#8a8a96',head:'helm',hc:['#7a4a40','#9a6258','#4a2a26'],eye:'#ff9a3c',pauld:2,horns:1,wp:'hammer'},
 sepulturero:{big:1,bw:15,th:11,lh:8,hw:10,hh:9,A:['#5a5240','#7a705a','#363024'],boot:'#241e14',belt:'#2a2216',buckle:'#8a8a96',head:'hat',hc:['#3a3426','#524a38','#241e16'],eye:'#99bbff',face:'#b8b0a0',cape:'#2a2418',capeE:'#524a38',pauld:1,wp:'shovel'},
 pastora:{big:1,bw:13,th:11,lh:9,hw:9,hh:9,A:['#6b4a4a','#8f6666','#3e2a2a'],boot:'#2a1a1a',belt:'#2a1a1a',head:'hood',hc:['#5a5a64','#7a7a88','#38383e'],eye:'#ff9a3c',cape:'#4a3a3a',capeE:'#8a6a5a',wp:'staff',skirt:1},
 cazador:{big:1,bw:13,th:11,lh:9,hw:9,hh:9,A:['#244a3a','#3a7058','#14281f'],boot:'#101e18',belt:'#2a2216',head:'skull',hc:['#d8d0b8','#f0e8d0','#948c78'],eye:'#ffe66d',cape:'#2a3a2a',capeE:'#5a7a5a',pauld:2,wp:'dagger'},
 caballero:{big:1,bw:16,th:12,lh:9,hw:10,hh:10,A:['#3a2d55','#5a4a80','#201833'],boot:'#150f22',belt:'#2a1e40',buckle:'#8a8a96',head:'helm',hc:['#4a3a6a','#6a5a90','#2a2044'],eye:'#ff4d6d',pauld:2,plume:'#7a1a2e',cape:'#201833',capeE:'#4a3a6a',wp:'greatsword',chains:1},
 rey:{big:1,bw:16,th:12,lh:9,hw:10,hh:10,A:['#241238','#40235c','#120a1e'],boot:'#0e0818',belt:'#4a3a10',buckle:'#c9a54a',head:'crown',hc:['#1c0e2c','#34204a','#0e0618'],eye:'#ffe66d',cape:'#3a1a5a',capeE:'#c9a54a',pauld:2,wp:'greatsword',skirt:1},
 sombra:{bw:11,th:9,lh:0,hw:9,hh:8,A:['#5a6a8a','#8aa0c8','#34405a'],boot:'#34405a',head:'helm',hc:['#7a8aaa','#a8bcd8','#46546e'],eye:'#bfe0ff',pauld:1,ghost:.62,skirt:1,wp:'none'},
 mirela:{bw:10,th:8,lh:7,hw:8,hh:8,A:['#8a4a6a','#b06a8a','#52283f'],boot:'#2a1420',belt:'#3a2a1a',buckle:'#c9a54a',head:'hood',hc:['#7a3a5a','#a05a7a','#4a2036'],eye:'#3a2230',face:'#e0b898',cape:'#6a2a4a',capeE:'#a05a7a',wp:'none'},
 dorn:{bw:12,th:9,lh:7,hw:8,hh:8,A:['#6a5a3a','#8f7d50','#3e3320'],boot:'#241c10',belt:'#3a2a1a',buckle:'#c9a54a',head:'helm',hc:['#7a6a46','#a08c5a','#4a3e26'],eye:'#ffb347',pauld:2,plume:'#a0302a',cape:'#7a1a1a',capeE:'#a0302a',wp:'none'},
 brenna:{bw:10,th:8,lh:7,hw:8,hh:8,A:['#7a3a3a','#a05252','#4a2020'],boot:'#2a1414',belt:'#3a2a1a',buckle:'#c9a54a',head:'hood',hc:['#5a2a2a','#7a4040','#3a1a1a'],eye:'#3a2230',face:'#d8a888',cape:'#4a2a2a',capeE:'#a05252',wp:'none'},
 voz:{bw:11,th:10,lh:0,hw:9,hh:8,A:['#4a3a7a','#6a58a8','#2a2048'],boot:'#2a2048',head:'hood',hc:['#3a2c64','#58468e','#201838'],eye:'#d8b8ff',ghost:.7,skirt:1,wp:'none'}};
function bakeBody(k,dir,pose,fr){const big=!!k.big,W=big?52:36,H=big?64:44,c=mkc(W,H),x=c.getContext('2d'),cx=W>>1,fy=H-3;
 const {bw,th,lh,hw,hh,A}=k,s=[0,1,0,-1][fr&3],hun=k.hunch?1:0;let dy=0,lA=0,lB=0,aA=0,aB=0,aR=0;
 if(pose==='idle'){dy=(fr&1)?1:0}else if(pose==='walk'){dy=(fr&1)?0:-1;lA=s>0?2:0;lB=s<0?2:0;aA=-s;aB=s}
 else if(pose==='wind'){dy=-1;aR=4}else if(pose==='act'){dy=1;aR=-1}else if(pose==='rec'){dy=1}
 else if(pose==='hit'||pose==='stg'){dy=1;aA=-2;aB=-2}else if(pose==='flask'){aR=5}
 const legTop=fy-lh,tTop=legTop-th+dy+(hun?1:0),hTop=tTop-hh+2+(hun?1:0);
 const cape=(side)=>{if(!k.cape)return;const cw=side?5:bw+2,X=side?cx+bw*.3:cx-bw/2-1,ln=th+lh-1+(k.skirt?1:0);rect(x,X,tTop+1,cw,ln,k.cape);rect(x,X,tTop+1,1,ln,k.capeE);rect(x,X+cw-1,tTop+1,1,ln,mixc(k.cape,'#000000',.4));const sw=(fr&1)?1:0;rect(x,X+(side?sw:0),tTop+ln,cw-(side?0:0),1,k.capeE)};
 const legs=()=>{if(!lh){const rw=bw+4;for(let i=0;i<lh+8;i++){const wv=Math.round(Math.sin((fr+i)*.9)*1);const ww=Math.max(4,rw-i*1);rect(x,cx-ww/2+wv,legTop+i-3,ww,1,i%2?A[2]:A[0])}return}
  if(dir==='s'){const lw=Math.max(3,Math.round(bw*.4)),st=pose==='walk'?s*3:0;rect(x,cx-lw/2+st,legTop,lw,lh-lB,A[2]);rect(x,cx-lw/2+st,fy-2-lB,lw+1,2,k.boot);rect(x,cx-lw/2-st,legTop,lw,lh-lA,A[0]);rect(x,cx-lw/2-st-1,fy-2-lA,lw+2,2,k.boot)}
  else{const lw=Math.floor(bw/2)-1;rect(x,cx-lw-1,legTop,lw,lh-lA,A[0]);rect(x,cx+1,legTop,lw,lh-lB,A[2]);rect(x,cx-lw-1,fy-2-lA,lw,2,k.boot);rect(x,cx+1,fy-2-lB,lw,2,k.boot);rect(x,cx-lw-1,legTop,1,lh-lA,A[1])}
  if(k.skirt){rect(x,cx-bw/2,legTop-2,bw,5,A[0]);rect(x,cx-bw/2,legTop+2,bw,1,A[2])}};
 const torso=(side)=>{const w=side?Math.round(bw*.62):bw,X=cx-w/2;rect(x,X,tTop,w,legTop-tTop,A[0]);rect(x,X,tTop,2,legTop-tTop,A[1]);rect(x,X+w-2,tTop,2,legTop-tTop,A[2]);rect(x,X,tTop,w,1,A[1]);
  if(k.belt){rect(x,X,legTop-2,w,2,k.belt);if(k.buckle&&!side&&dir==='d')rect(x,cx-1,legTop-2,2,2,k.buckle)}
  if(k.emblem&&dir==='d')rect(x,cx-1,tTop+2,2,2,k.emblem);if(k.chains&&dir==='d'){pline(x,X,tTop+1,X+w-1,legTop-3,'#8a8a96');pline(x,X+w-1,tTop+1,X,legTop-3,'#6a6a78')}
  if(k.pauld){const p=k.pauld;if(!side){rect(x,X-2,tTop-1,3+p,3+p,A[1]);rect(x,X+w-1-p,tTop-1,3+p,3+p,A[0]);rect(x,X-2,tTop-1,3+p,1,mixc(A[1],'#ffffff',.3))}else{rect(x,cx-2,tTop-1,4+p,3+p,A[1]);rect(x,cx-2,tTop-1,4+p,1,mixc(A[1],'#ffffff',.3))}}};
 const arm=(X,y,len,col,hand)=>{rect(x,X,y,2,len,col);rect(x,X,y+len,2,2,hand||k.face||'#c9a888')};
 const alen=th-3+(k.arm||0);
 const arms=(side)=>{const gl=k.A[2],yy=tTop+2;
  if(pose==='block'){if(side){rect(x,cx-bw*.5-1,yy+1,4,alen-1,A[1]);rect(x,cx-bw*.5-1,yy+alen-1,3,2,gl)}else{rect(x,cx-bw/2-1,yy+1,bw+2,3,A[1]);rect(x,cx-bw/2-1,yy+4,bw+2,2,A[0])}return}
  if(side){arm(cx-2,yy+aA,alen,A[1],gl);return}
  arm(cx-bw/2-2,yy+aA-(dir==='u'?0:0),alen,A[1],gl);arm(cx+bw/2,yy+aB-aR,alen+(aR>0?-1:0),A[2],gl)};
 const head=()=>{const X=cx-hw/2+(hun&&dir==='s'?-1:0),Y=hTop+(hun?1:0),hc=k.hc,eyeY=Y+Math.round(hh*.5),side=dir==='s',back=dir==='u';
  const base=(col,lt,dk)=>{rect(x,X,Y+1,hw,hh-1,col);rect(x,X+1,Y,hw-2,1,col);rect(x,X+1,Y,hw-2,1,lt);rect(x,X,Y+1,1,hh-1,lt);rect(x,X+hw-1,Y+1,1,hh-1,dk)};
  if(k.head==='hood'){base(hc[0],hc[1],hc[2]);rect(x,X+hw/2-1,Y-1,2,1,hc[0]);
   if(!back){const fx=side?X+1:X+1,fw=side?hw-4:hw-2;rect(x,fx,Y+2,fw,hh-3,k.face?k.face:'#0a0612');if(k.face){rect(x,fx,Y+2,fw,2,k.hc[0]);dot(x,side?X+2:X+hw/2-2,eyeY,k.eye);if(!side)dot(x,X+hw/2+1,eyeY,k.eye);dot(x,side?X+1:X+hw/2,eyeY+2,'#a07858')}
   else{if(side)rect(x,X+1,eyeY,2,1,k.eye);else{rect(x,X+hw/2-3,eyeY,2,1,k.eye);rect(x,X+hw/2+1,eyeY,2,1,k.eye)}}}}
  else if(k.head==='helm'||k.head==='crown'){base(hc[0],hc[1],hc[2]);rect(x,X,Y+hh-2,hw,2,hc[2]);
   if(!back){const sx=side?X:X+1,sw=side?hw/2+1:hw-2;rect(x,sx,eyeY-1,sw,2,'#0a0612');if(side)dot(x,X+1,eyeY-1,k.eye);else{dot(x,X+hw/2-2,eyeY-1,k.eye);dot(x,X+hw/2+1,eyeY-1,k.eye)}rect(x,side?X+1:X+hw/2-1,eyeY+1,1,hh-(eyeY-Y)-2,hc[2])}
   if(k.plume){rect(x,cx-1,Y-3,2,3,k.plume);rect(x,cx,Y-4,2,1,k.plume);if(side||back)rect(x,cx+1,Y-2,3,2,k.plume)}
   if(k.horns){pline(x,X,Y+1,X-3,Y-3,'#d8d0b8',2);pline(x,X+hw-1,Y+1,X+hw+2,Y-3,'#d8d0b8',2)}
   if(k.head==='crown'){rect(x,X-1,Y-2,hw+2,3,'#c9a54a');for(let i=0;i<4;i++)rect(x,X-1+i*Math.round((hw+1)/3),Y-4,2,2,'#c9a54a');rect(x,X-1,Y-2,hw+2,1,'#ffe9a0');dot(x,cx,Y-1,'#ff4d6d')}}
  else if(k.head==='skull'){base(hc[0],hc[1],hc[2]);if(!back){rect(x,X+1,eyeY-1,3,3,'#1a1410');rect(x,X+hw-4,eyeY-1,3,3,'#1a1410');dot(x,X+2,eyeY,k.eye);dot(x,X+hw-3,eyeY,k.eye);for(let i=0;i<hw-2;i+=2)dot(x,X+1+i,Y+hh-1,'#1a1410')}pline(x,X+1,Y+1,X-2,Y-3,'#d8d0b8',1);pline(x,X+hw-2,Y+1,X+hw+1,Y-3,'#d8d0b8',1)}
  else if(k.head==='hat'){rect(x,X+1,Y+1,hw-2,hh-1,k.face);rect(x,X,Y+2,hw,hh-2,k.face);rect(x,X+hw-1,Y+2,1,hh-2,'#8a8272');if(!back){rect(x,X+2,eyeY,2,1,'#1a1410');rect(x,X+hw-4,eyeY,2,1,'#1a1410');dot(x,X+2,eyeY,k.eye);dot(x,X+hw-3,eyeY,k.eye);rect(x,X+2,Y+hh-1,hw-4,1,'#3a3426')}
   rect(x,X-3,Y+1,hw+6,2,hc[1]);rect(x,X-3,Y+2,hw+6,1,hc[2]);rect(x,X+1,Y-3,hw-2,4,hc[0]);rect(x,X+1,Y-3,hw-2,1,hc[1]);rect(x,X+1,Y,hw-2,1,'#7a4a2a')}};
 // orden de dibujo por orientación
 if(dir==='d'){cape(0);legs();torso(0);arms(0);head()}
 else if(dir==='u'){legs();torso(0);if(k.cape){rect(x,cx-bw/2-1,tTop+1,bw+2,th+lh-1+(k.skirt?1:0),k.cape);rect(x,cx-bw/2-1,tTop+1,1,th+lh,k.capeE);rect(x,cx+bw/2,tTop+1,1,th+lh,mixc(k.cape,'#000',.4));rect(x,cx,tTop+2,1,th+lh-2,mixc(k.cape,'#000',.25));rect(x,cx-bw/2-1,tTop+th+lh-(k.skirt?0:1),bw+2,1,k.capeE)}else if(k.wp==='sword')pline(x,cx+3,tTop,cx-3,legTop,'#5a4630',2);arms(0);head()}
 else{ // lateral (mira a la izquierda)
  const hand=k.A[2];rect(x,cx+1,tTop+3+aB,2,alen,A[2]);rect(x,cx+1,tTop+3+aB+alen,2,2,hand);
  cape(1);legs();torso(1);arms(1);head()}
 return finish(c,k.ghost?'#1a2438':'#0b0714')}
// rodar (esquiva): bola con capa, 4 giros
function bakeRoll(k,fr){const c=mkc(30,30),x=c.getContext('2d'),A=k.A;x.translate(15,15);x.rotate(fr*Math.PI/2);x.translate(-15,-15);
 disc(x,15,17,7,A[0]);disc(x,14,15,5,A[1]);rect(x,9,19,12,3,A[2]);rect(x,20,12,5,7,k.cape||A[2]);rect(x,24,14,3,3,k.capeE||A[1]);rect(x,9,10,4,3,k.hc[0]);dot(x,10,12,k.eye);dot(x,11,12,k.eye);rect(x,12,21,6,2,k.boot);
 x.setTransform(1,0,0,1,0,0);return finish(c)}
const bodyArt=(id,dir,pose,fr)=>cached('b'+id+dir+pose+(fr&3),()=>bakeBody(KITS[id],dir,pose,fr));
const rollArt=(id,fr)=>cached('r'+id+(fr&3),()=>bakeRoll(KITS[id],fr));
