// ===== CALIDAD GRÁFICA: temas nuevos, objetos nuevos, pulido del terreno horneado, luz volumétrica y viñeta =====
Object.assign(TH,{
 marisma:{fl:['#2a3a36','#2f4240','#243230'],mo:'#121c1a',hi:'#4a6a60',wf:['#3a4c44','#2f3e38','#26322e'],wt:'#0a1210',wh:'#152420',ac:'#9aff7a',amb:[4,14,10,.6],fog:'110,170,130',pt:'leaf',grass:['#243a2a','#2b4630','#1c2e22'],gd:'#0f2016',gl:'#5a8a4a',dirt:['#4a4430','#3f3a28','#585036'],bg:'#020805'},
 cantera:{fl:['#4a4048','#40373f','#554a52'],mo:'#221b22',hi:'#7a6a78',wf:['#6a5448','#58443a','#463530'],wt:'#140e12',wh:'#2a1c1c',ac:'#5ad8ff',amb:[10,8,18,.62],fog:'120,170,220',pt:'dust',dirt:['#5a4838','#4c3c2e','#685442'],bg:'#050308'},
 torre:{fl:['#46506a','#3e485e','#505a76'],mo:'#1c2236',hi:'#8090b8',wf:['#6270a0','#525e88','#444e72'],wt:'#101628',wh:'#1e2840',ac:'#ffd88a',amb:[12,14,32,.52],fog:'170,190,240',pt:'dust',dirt:['#4a4a52','#3e3e46','#585862'],bg:'#04060e'}});
for(const k of['marisma','cantera','torre'])TH[k].k=k;

// ---- objetos nuevos ----
const shadeC=(h,f)=>{const n=parseInt(h.slice(1),16),r=Math.min(255,(n>>16&255)*f|0),g_=Math.min(255,(n>>8&255)*f|0),b=Math.min(255,(n&255)*f|0);return'rgb('+r+','+g_+','+b+')'};
function bakeCrystal(t,v){const c=mkc(16,26),x=c.getContext('2d'),dk=shadeC(t.ac,.38),md=shadeC(t.ac,.7),lt=t.ac;
 x.fillStyle='#14101a';x.fillRect(2,21,12,3);x.fillStyle='#2a2232';x.fillRect(3,20,10,2);x.fillStyle='#3a3042';x.fillRect(4,19,6,1);
 const shard=(cx,top,h,hw0,hl)=>{for(let y=0;y<h;y++){const hw=Math.min(hw0,1+(y>>1));x.fillStyle=dk;x.fillRect(cx-hw,top+y,hw,1);x.fillStyle=md;x.fillRect(cx,top+y,hw,1);if(y>1&&y<h-2){x.fillStyle=hl;x.fillRect(cx-hw,top+y,1,1)}}x.fillStyle='rgba(255,255,255,.75)';x.fillRect(cx,top+1,1,Math.max(2,h>>1));x.fillStyle=lt;x.fillRect(cx,top,1,1)};
 shard(8,3+(v&1),17,3,lt);shard(4,10,10,2,lt);shard(12,12+(v>>1&1),8,2,lt);return c}
function bakeMushroom(t,v){const c=mkc(16,24),x=c.getContext('2d'),ac=t.ac;x.fillStyle='#14101a';x.fillRect(4,20,8,2);
 x.fillStyle='#cfc6a8';x.fillRect(6,13,4,8);x.fillStyle='#a89e82';x.fillRect(9,13,1,8);x.fillStyle='#e8dfc4';x.fillRect(6,13,1,8);
 const rows=[[5,6],[3,10],[2,12],[1,14],[1,14]];rows.forEach(([o,w],i)=>{x.fillStyle=i<2?shadeC(ac,.75):shadeC(ac,.55);x.fillRect(o,5+i,w,1);});
 x.fillStyle=shadeC(ac,.4);x.fillRect(1,10,14,1);x.fillStyle='rgba(255,255,255,.8)';[[5,6],[9,7],[7,9],[12,9]].forEach(([a,b])=>x.fillRect(a,b,2,1));x.fillStyle=ac;x.fillRect(6,5,3,1);return c}
function bakeLamp(t,v){const c=mkc(16,34),x=c.getContext('2d');x.fillStyle='#14101a';x.fillRect(4,30,8,3);x.fillStyle='#2a2630';x.fillRect(7,10,2,21);x.fillStyle='#4a4458';x.fillRect(7,10,1,21);x.fillRect(5,28,6,2);
 x.fillStyle='#1c1824';x.fillRect(3,1,10,2);x.fillRect(3,9,10,2);x.fillRect(3,3,1,6);x.fillRect(12,3,1,6);x.fillStyle='#ffd88a';x.fillRect(4,3,8,6);x.fillStyle='#fff3c4';x.fillRect(6,4,4,4);x.fillStyle='#7a5a1e';x.fillRect(7,0,2,1);return c}
function bakeReed(t,v){const c=mkc(16,18),x=c.getContext('2d'),R=rngS(v*31+5);for(let i=0;i<7;i++){const bx=1+i*2+(R()*2|0),h=8+(R()*8|0),lean=(R()*3|0)-1;x.fillStyle=i%2?'#4a6a38':'#5a7e44';for(let y=0;y<h;y++)x.fillRect(bx+(y>h*.6?lean:0),17-y,1,1);
  if(R()<.6){x.fillStyle='#6a4a2a';x.fillRect(bx+lean,17-h-1,1,3)}}return c}
Object.assign(OBJ,{crystal:(v,t)=>bakeCrystal(t,v),mushroom:(v,t)=>bakeMushroom(t,v),lamp:(v,t)=>bakeLamp(t,v),reed:(v,t)=>bakeReed(t,v)});
Object.assign(COL,{crystal:[3,5,13,16],mushroom:[5,6,11,16],lamp:[6,8,10,16]});
['crystal','mushroom','lamp'].forEach(k=>SOLID_OBJ.add(k));NOSOLID_OBJ.add('reed');
function objLight(n,wx,wy,cx,cy){const t=W.th;if(n==='crystal')return{x:wx-cx,y:wy-cy-10,r:46,i:.7,c:t.ac.length===7?[...t.ac.slice(1).match(/../g)].map(h=>parseInt(h,16)).join(','):'120,200,255',a:.16};
 if(n==='mushroom')return{x:wx-cx,y:wy-cy-8,r:40,i:.6,c:'150,255,160',a:.14};if(n==='lamp')return{x:wx-cx,y:wy-cy-24,r:72,i:.9,c:'255,216,138',a:.16};return null}
function objFx(n,wx,wy,tx_,ty_){if(n==='crystal')glow(wx,wy-10,12,'120,200,255',.1+.06*Math.sin(TM*2+tx_));if(n==='mushroom')glow(wx,wy-9,10,'150,255,160',.1+.05*Math.sin(TM*1.6+ty_));if(n==='lamp')glow(wx,wy-24,12,'255,216,138',.14+.05*Math.sin(TM*5+tx_))}
Object.assign(WK,{madre:['staff',22,'154,255,122'],capataz:['hammer',24,'255,154,60'],vigia:['staff',22,'255,216,138']});

// ---- pulido del terreno horneado ----
const aoStrip=(()=>{const mk=(w,h,fn)=>{const c=mkc(w,h),x=c.getContext('2d'),q=fn(x);x.fillStyle=q;x.fillRect(0,0,w,h);return c};
 const gr=(x,x0,y0,x1,y1,a)=>{const q=x.createLinearGradient(x0,y0,x1,y1);q.addColorStop(0,'rgba(0,0,0,'+a+')');q.addColorStop(1,'rgba(0,0,0,0)');return q};
 return{s:mk(16,6,x=>gr(x,0,0,0,6,.3)),w:mk(6,16,x=>gr(x,0,0,6,0,.3)),e:mk(6,16,x=>gr(x,6,0,0,0,.3))}})();
const nzMap=(sx,sy,seed)=>{const r=rngS(seed),n=mkc(sx,sy),q=n.getContext('2d');for(let j=0;j<sy;j++)for(let i=0;i<sx;i++){const v=104+r()*48|0;q.fillStyle='rgb('+v+','+v+','+v+')';q.fillRect(i,j,1,1)}return n};
const SPEC={cripta:['bone','wax','rune','crack'],valdora:['scorch','leaf','puddle','crack'],bosque:['flower','mush','leaf','moss'],puertas:['crack','moss','feather','pebble'],trono:['rune','crackG','ember'],marisma:['puddle','algae','bubble','mush'],cantera:['ore','pebble','crack','ore'],torre:['feather','crack','cloth','pebble']};
function decalAt(x,k,X,Y,R,T){const px=(a,b,c,w=1,h=1)=>{x.fillStyle=c;x.fillRect(X+a,Y+b,w,h)},ri=n=>R()*n|0;
 switch(k){
  case'crack':{let cx=2+ri(10),cy=1+ri(4);for(let s=0;s<7+ri(5)&&cy<15;s++){px(cx,cy,'rgba(0,0,0,.5)');if(R()<.3)px(cx+1,cy,'rgba(255,255,255,.07)');cx+=R()<.4?(R()<.5?-1:1):0;cy++}break}
  case'crackG':{let cx=2+ri(10),cy=1+ri(4);for(let s=0;s<8&&cy<15;s++){px(cx,cy,'rgba(208,154,255,.55)');cx+=R()<.4?(R()<.5?-1:1):0;cy++}break}
  case'pebble':for(let s=0;s<2+ri(3);s++){const a=1+ri(13),b=2+ri(12);px(a,b,'rgba(0,0,0,.35)',2,1);px(a,b-1,'rgba(255,255,255,.18)',1,1)}break;
  case'bone':{const a=3+ri(8),b=4+ri(8);px(a,b,'#d8d0b8',4,1);px(a,b-1,'#d8d0b8');px(a+3,b+1,'#d8d0b8');px(a,b+1,'rgba(0,0,0,.35)',4,1);break}
  case'wax':{const a=3+ri(9),b=4+ri(8);px(a,b,'#e8e0c8',3,2);px(a+1,b-1,'#fff3c4');break}
  case'rune':{const a=5+ri(5),b=5+ri(5),c=T.ac;px(a,b,c,1,3);px(a-1,b+1,c,3,1);x.globalAlpha=.4;x.globalAlpha=1;break}
  case'scorch':for(let s=0;s<9;s++)px(2+ri(11),2+ri(11),'rgba(0,0,0,.28)',2,1);break;
  case'leaf':for(let s=0;s<3;s++)px(1+ri(13),1+ri(13),['#a8642a','#8a4a1e','#c98a3a'][ri(3)]);break;
  case'puddle':{const a=2+ri(6),b=4+ri(6),w=5+ri(5);px(a,b,'rgba(80,110,150,.35)',w,3);px(a+1,b-1,'rgba(80,110,150,.25)',w-2,1);px(a+1,b+3,'rgba(80,110,150,.2)',w-2,1);px(a+1,b,'rgba(255,255,255,.2)',2,1);break}
  case'flower':for(let s=0;s<3;s++){const a=2+ri(11),b=2+ri(11),c=['#ff8aa8','#ffe66d','#9ac8ff','#ffffff'][ri(4)];px(a,b,c);px(a,b+1,'#2a5a30')}break;
  case'mush':{const a=3+ri(9),b=5+ri(7);px(a,b,'#e8dfc4',1,2);px(a-1,b-1,'#c0243c',3,1);px(a,b-1,'#fff',1,1);break}
  case'moss':for(let s=0;s<7;s++)px(1+ri(13),1+ri(13),'rgba(70,130,70,.42)',2,1);break;
  case'feather':{const a=3+ri(9),b=4+ri(8);px(a,b,'#e8eef8',3,1);px(a+1,b+1,'#b8c4d8',2,1);break}
  case'ember':for(let s=0;s<3;s++)px(2+ri(12),2+ri(12),'#ff7a3c');break;
  case'algae':for(let s=0;s<6;s++)px(1+ri(13),1+ri(13),'rgba(120,200,90,.4)',2,1);break;
  case'bubble':{const a=3+ri(9),b=3+ri(9);px(a,b,'rgba(200,255,200,.5)');px(a+1,b+1,'rgba(200,255,200,.3)');break}
  case'ore':{const a=2+ri(11),b=3+ri(9);px(a,b,T.ac);px(a+1,b+1,'#fff');px(a,b+1,'rgba(0,0,0,.4)');break}
  case'cloth':{const a=3+ri(9),b=4+ri(8);px(a,b,'#3a4a8a',4,2);px(a+1,b,'#6a7ac0',2,1);break}
  case'tuft':{const a=2+ri(11),b=4+ri(9),c=T.gl||'#4a7a50';px(a,b,c);px(a+1,b-1,c);px(a+1,b,c);px(a+2,b,c);px(a+2,b-2,'rgba(255,255,255,.15)');break}}}
function polishBase(w){const T=w.th,C=w.cols,Rw=w.rows,cv=w.base,x=cv.getContext('2d'),R=rngS(C*977+Rw*31+w.rg.id.length*131+7),Wd=C*16,Hd=Rw*16;
 const isW=(tx,ty)=>w.ok(tx,ty)&&WALLISH.has(w.on[w.i(tx,ty)]||'');
 // 1) variación de tono a gran escala: rompe la repetición de baldosas
 x.save();x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.globalCompositeOperation='overlay';
 x.globalAlpha=.6;x.drawImage(nzMap(Math.ceil(C/3)+2,Math.ceil(Rw/3)+2,C*13+Rw),0,0,Wd,Hd);x.globalAlpha=.3;x.drawImage(nzMap(Math.ceil(C/1.3),Math.ceil(Rw/1.3),C*29+Rw*3),0,0,Wd,Hd);x.restore();
 // 2) oclusión ambiental junto a muros y detalles sueltos
 const spec=SPEC[T.k]||['crack','pebble'];
 for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){const i=w.i(tx,ty),g=w.gd[i],n=w.on[i],X=tx*16,Y=ty*16;if(isW(tx,ty))continue;
  if(g!=='w'&&g!=='k'){if(isW(tx,ty+1))x.drawImage(aoStrip.s,X,Y+10);if(isW(tx-1,ty))x.drawImage(aoStrip.w,X,Y);if(isW(tx+1,ty))x.drawImage(aoStrip.e,X+10,Y);
   if(isW(tx-1,ty-1)&&!isW(tx-1,ty)&&!isW(tx,ty-1)){x.fillStyle='rgba(0,0,0,.2)';x.fillRect(X,Y,3,3)}}
  if(n||g==='w'||g==='k'||g==='c'&&0)continue;
  const r=R();if(g==='g'){if(r<.34)decalAt(x,'tuft',X,Y,R,T);else if(r<.4)decalAt(x,spec[R()*spec.length|0],X,Y,R,T)}
  else if(g==='p'){if(r<.16)decalAt(x,'pebble',X,Y,R,T)}
  else if(g==='f'||g==='b'){if(r<.045)decalAt(x,'crack',X,Y,R,T);else if(r<.1)decalAt(x,spec[R()*spec.length|0],X,Y,R,T)}}
 // 3) sombra suave de los objetos (luz desde arriba a la izquierda)
 for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){const n=w.on[w.i(tx,ty)];if(!n||WALLISH.has(n)||n==='gate'||n==='bush'||n==='rubble'||n==='reed')continue;const tall=n==='tree'||n==='dtree'||n==='lamp'||n==='pillar'||n==='bpillar'||n==='statue',rx=tall?9:6,cx=tx*16+8+(tall?4:2),cy=ty*16+14;
  const q=x.createRadialGradient(cx,cy,1,cx,cy,rx);q.addColorStop(0,'rgba(0,0,0,.32)');q.addColorStop(1,'rgba(0,0,0,0)');x.save();x.translate(cx,cy);x.scale(1,.38);x.translate(-cx,-cy);x.fillStyle=q;x.fillRect(cx-rx,cy-rx,rx*2,rx*2);x.restore()}
 // 4) gradación de color del tema
 x.save();x.globalCompositeOperation='soft-light';const gq=x.createLinearGradient(0,0,0,Hd);gq.addColorStop(0,'rgba('+T.fog+',.2)');gq.addColorStop(1,'rgba(0,0,0,.1)');x.fillStyle=gq;x.fillRect(0,0,Wd,Hd);x.restore()}
const _bakeM=Mapa.prototype.bake;Mapa.prototype.bake=function(){_bakeM.call(this);try{polishBase(this)}catch(e){console.error('polishBase',e)}};

// ---- luz: halos, rayos volumétricos, niebla baja, viñeta y gradación ----
const SHAFT={cripta:['150,130,220',.05],valdora:['255,190,130',.06],bosque:['200,255,200',.08],puertas:['200,220,255',.06],marisma:['180,255,200',.06],cantera:['140,190,255',.05],torre:['255,240,200',.08]};
const _lighting=lighting;lighting=function(L){_lighting(L);const T=W.th;g.save();
 for(const l of L)if(l.c)glow(l.x,l.y,l.r*1.3,l.c,(l.a||.16)*.45);
 const sh=SHAFT[T.k];if(sh){g.globalCompositeOperation='lighter';const sw=GW+180;for(let i=0;i<4;i++){const bx=(((i*118+TM*7-cam.x*.35)%sw)+sw)%sw-90,wd=24+i*7,al=sh[1]*(.7+.3*Math.sin(TM*.7+i*1.7)),q=g.createLinearGradient(bx,0,bx+wd,0);
  q.addColorStop(0,'rgba('+sh[0]+',0)');q.addColorStop(.5,'rgba('+sh[0]+','+al+')');q.addColorStop(1,'rgba('+sh[0]+',0)');g.fillStyle=q;g.beginPath();g.moveTo(bx,0);g.lineTo(bx+wd,0);g.lineTo(bx+wd-80,GH);g.lineTo(bx-80,GH);g.closePath();g.fill()}}
 g.globalCompositeOperation='source-over';
 for(let i=0;i<3;i++){const fx=(((i*190+TM*(5+i*2)-cam.x*.5)%(GW+240))+GW+240)%(GW+240)-120,fy=GH-26-i*16+Math.sin(TM*.5+i)*4,q=g.createRadialGradient(fx,fy,4,fx,fy,95);q.addColorStop(0,'rgba('+T.fog+',.07)');q.addColorStop(1,'rgba('+T.fog+',0)');g.fillStyle=q;g.fillRect(fx-95,fy-60,190,120)}
 const vq=g.createRadialGradient(GW/2,GH/2,GH*.38,GW/2,GH/2,GW*.62);vq.addColorStop(0,'rgba(0,0,0,0)');vq.addColorStop(1,'rgba(0,0,0,.48)');g.fillStyle=vq;g.fillRect(0,0,GW,GH);
 g.restore()};
