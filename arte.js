// ===== ARTE PROCEDURAL: tiles, objetos, sprites (todo se dibuja por código, sin imágenes) =====
const TS=16;
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const rngS=s=>{s=(s>>>0)||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}};
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mixc=(a,b,t)=>{const A=hx(a),B=hx(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const ART={};  // caché de sprites
const cached=(k,f)=>ART[k]||(ART[k]=f());
const rect=(x,X,Y,w,h,c)=>{x.fillStyle=c;x.fillRect(X|0,Y|0,w|0,h|0)};
const dot=(x,X,Y,c)=>{x.fillStyle=c;x.fillRect(X|0,Y|0,1,1)};
// contorno + luz de borde (da el aspecto "pixel art pulido")
function finish(c,ol,rim=true){const w=c.width,h=c.height,x=c.getContext('2d'),im=x.getImageData(0,0,w,h),d=im.data,o=new Uint8ClampedArray(d);
 const a=(X,Y)=>X<0||Y<0||X>=w||Y>=h?0:o[(Y*w+X)*4+3];
 if(rim)for(let Y=0;Y<h;Y++)for(let X=0;X<w;X++){const i=(Y*w+X)*4;if(o[i+3]<200)continue;
  const up=a(X,Y-1)<100,lf=a(X-1,Y)<100,dn=a(X,Y+1)<100,rt=a(X+1,Y)<100;
  let k=0;if(up)k+=.2;if(lf)k+=.1;if(dn)k-=.18;if(rt)k-=.12;
  if(k>0){for(let j=0;j<3;j++)d[i+j]=Math.min(255,d[i+j]+(255-d[i+j])*k)}else if(k<0){for(let j=0;j<3;j++)d[i+j]*=1+k}}
 const oc=hx(ol||'#0b0714');const od=new Uint8ClampedArray(d);
 for(let Y=0;Y<h;Y++)for(let X=0;X<w;X++){const i=(Y*w+X)*4;if(od[i+3]>40)continue;
  const n=(X>0&&od[i-4+3]>150)||(X<w-1&&od[i+4+3]>150)||(Y>0&&od[i-w*4+3]>150)||(Y<h-1&&od[i+w*4+3]>150);
  if(n){d[i]=oc[0];d[i+1]=oc[1];d[i+2]=oc[2];d[i+3]=255}}
 x.putImageData(im,0,0);return c}
// silueta blanca (destello de golpe)
function flashOf(c){return cached('fl'+(c._id||(c._id=Math.random())),()=>{const f=mkc(c.width,c.height),x=f.getContext('2d');x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff';x.fillRect(0,0,f.width,f.height);return f})}

// ---- temas por región ----
const TH={
 cripta:{fl:['#2b2540','#332c4a','#262036'],mo:'#171226',hi:'#463c64',wf:['#54496f','#463e60','#383050'],wt:'#100c1c',wh:'#1c1630',ac:'#9a86d8',amb:[7,4,20,.66],fog:'150,130,220',pt:'dust',bg:'#05030a'},
 valdora:{fl:['#4d4249','#43383f','#584c52'],mo:'#271f25',hi:'#74666e',wf:['#7a5648','#664538','#52362c'],wt:'#2a1812',wh:'#3a241c',ac:'#ff9a3c',amb:[30,8,4,.5],fog:'210,130,80',pt:'ash',grass:['#3c3a28','#33311f','#46432e'],gd:'#262614',gl:'#5c5a3c',dirt:['#5a4636','#4e3b2d','#664f3d'],bg:'#0a0505'},
 bosque:{fl:['#2d3a30','#33423a','#283429'],mo:'#16201a',hi:'#4a6050',wf:['#3e4a3e','#334035','#2a352c'],wt:'#0c1410',wh:'#16221b',ac:'#7dff9a',amb:[2,14,12,.58],fog:'120,190,160',pt:'leaf',grass:['#1f3a2c','#244634','#193024'],gd:'#112419',gl:'#3f7a55',dirt:['#4a3a2a','#3e3024','#58452f'],bg:'#020805'},
 puertas:{fl:['#3b4662','#344059','#44516f'],mo:'#1a2236',hi:'#6676a0',wf:['#58668a','#4a5878','#3d4a68'],wt:'#0e1424',wh:'#1a2338',ac:'#9ec0ff',amb:[6,10,30,.5],fog:'140,170,230',pt:'dust',grass:['#2a3a40','#2f4248','#243238'],gd:'#16242a',gl:'#4a6a74',dirt:['#4a4a52','#3e3e46','#585862'],bg:'#03050c'},
 trono:{fl:['#2f1d44','#382350','#291a3c'],mo:'#150c22',hi:'#5a3a80',wf:['#4e2f6e','#412660','#341d4e'],wt:'#0e0818',wh:'#1c1030',ac:'#d09aff',amb:[16,3,28,.6],fog:'190,120,255',pt:'ember',bg:'#06020c'}};

// ---- suelos ----
function bakeStone(t,v){const c=mkc(16,16),x=c.getContext('2d'),R=rngS(v*977+13);
 for(let ry=0;ry<2;ry++){const off=ry?4:0;for(let sx=-1;sx<3;sx++){const x0=sx*8+off;rect(x,x0,ry*8,8,8,t.fl[Math.floor(R()*3)])}}
 for(let ry=0;ry<2;ry++){const off=ry?4:0;rect(x,0,ry*8,16,1,t.mo);for(let sx=-1;sx<3;sx++){const x0=sx*8+off;rect(x,x0,ry*8,1,8,t.mo);x.globalAlpha=.35;rect(x,x0+1,ry*8+1,6,1,t.hi);x.globalAlpha=1}}
 for(let i=0;i<7;i++){dot(x,R()*16,R()*16,R()<.5?t.mo:t.hi)}
 if(v%4===1){let X=3+R()*8,Y=2+R()*3;x.fillStyle=t.mo;for(let i=0;i<9;i++){x.fillRect(X|0,Y|0,1,1);X+=R()<.5?1:0;Y+=1;if(Y>15)break}}
 if(v%5===2&&t.ac){x.globalAlpha=.25;for(let i=0;i<5;i++)dot(x,R()*16,R()*16,'#4a7a4a');x.globalAlpha=1}
 return c}
function bakeCobble(t,v){const c=mkc(16,16),x=c.getContext('2d'),R=rngS(v*733+5);rect(x,0,0,16,16,t.mo);
 for(let gy=0;gy<3;gy++)for(let gx=0;gx<3;gx++){const cx=gx*5.4+2.7+(R()-.5)*1.6+(gy%2?2:0),cy=gy*5.4+2.7+(R()-.5)*1.2,col=t.fl[Math.floor(R()*3)];
  for(const ox of[-16,0,16])for(const oy of[-16,0,16]){const X=Math.round(cx+ox-2.4),Y=Math.round(cy+oy-2.2);if(X>16||Y>16||X<-6||Y<-6)continue;
   rect(x,X+1,Y,3,1,col);rect(x,X,Y+1,5,3,col);rect(x,X+1,Y+4,3,1,col);rect(x,X+1,Y+1,3,1,t.hi);rect(x,X+1,Y+4,3,1,mixc(col,'#000000',.35))}}
 for(let i=0;i<4;i++)dot(x,R()*16,R()*16,'#1a1418');return c}
function bakeGrass(t,v){const c=mkc(16,16),x=c.getContext('2d'),R=rngS(v*421+9),g=t.grass||['#2a4a30','#305638','#244028'];rect(x,0,0,16,16,g[0]);
 for(let i=0;i<256;i++){const r=R();if(r<.2)dot(x,i%16,i>>4,g[1]);else if(r<.3)dot(x,i%16,i>>4,g[2])}
 for(let i=0;i<5;i++){const X=R()*15|0,Y=2+R()*12|0;rect(x,X,Y,1,2,t.gd||'#16301c');dot(x,X,Y-1,t.gl||'#4a7a50')}
 if(t===TH.bosque||t===TH.valdora){if(R()<.35){const X=R()*14|0,Y=R()*14|0;dot(x,X,Y,'#7a6a3a');dot(x,X+1,Y,'#5a4a28')}}else if(R()<.3){const X=R()*14|0,Y=R()*14|0;dot(x,X,Y,'#e8e0a0');dot(x,X+1,Y+1,'#ffffff')}
 return c}
function bakeDirt(t,v){const d=t.dirt||['#5a4636','#4e3b2d','#664f3d'],c=mkc(16,16),x=c.getContext('2d'),R=rngS(v*311+7);rect(x,0,0,16,16,d[0]);
 for(let i=0;i<256;i++){const r=R();if(r<.25)dot(x,i%16,i>>4,d[1]);else if(r<.38)dot(x,i%16,i>>4,d[2])}
 for(let i=0;i<4;i++){const X=R()*14|0,Y=R()*14|0;rect(x,X,Y,2,1,'#8a7a68');dot(x,X,Y+1,'#3a2c20')}return c}
function bakeBoards(t,v){const c=mkc(16,16),x=c.getContext('2d'),R=rngS(v+3);for(let i=0;i<4;i++){rect(x,0,i*4,16,4,['#5a4028','#664a2e','#4e3822'][Math.floor(R()*3)]);rect(x,0,i*4+3,16,1,'#2a1c10');rect(x,0,i*4,16,1,'#7a5a3a')}
 for(let i=0;i<4;i++){dot(x,2,i*4+1,'#2a1c10');dot(x,13,i*4+1,'#2a1c10')}return c}
function bakeCarpet(t,v){const c=mkc(16,16),x=c.getContext('2d');rect(x,0,0,16,16,'#7a1a2e');for(let i=0;i<16;i+=2){rect(x,i,0,1,16,'#8a2238')}rect(x,0,0,2,16,'#c9a54a');rect(x,14,0,2,16,'#c9a54a');rect(x,2,0,1,16,'#4a0e1c');rect(x,13,0,1,16,'#4a0e1c');
 if(v%3===0){rect(x,6,5,4,1,'#c9a54a');rect(x,7,4,2,3,'#c9a54a');rect(x,7,5,2,1,'#7a1a2e')}return c}
function bakeWater(t,f,v){const c=mkc(16,16),x=c.getContext('2d'),dp=t===TH.bosque?['#16302e','#1d3d3a','#2a524c']:['#12294a','#183560','#24508a'];
 for(let Y=0;Y<16;Y++)for(let X=0;X<16;X++){const s=Math.sin((X+f*4)*.55+Y*.4+v)+Math.sin(Y*.9-f*1.57+X*.2);dot(x,X,Y,s>1.3?dp[2]:s>-.2?dp[1]:dp[0])}
 const R=rngS(f*31+v*7);for(let i=0;i<3;i++){const X=R()*14|0,Y=R()*15|0;rect(x,X,Y,2,1,'rgba(220,240,255,.65)')}return c}
// bordes suaves entre tipos de suelo (tira de 3px por lado)
function edgeStrip(col,side,seed){return cached('es'+col+side+seed,()=>{const c=mkc(16,16),x=c.getContext('2d'),R=rngS(seed*17+side.charCodeAt(0));x.fillStyle=col;
 for(let i=0;i<16;i++){const n=1+(R()<.5?1:0)+(R()<.2?1:0);for(let j=0;j<n;j++){if(side==='n')x.fillRect(i,j,1,1);else if(side==='s')x.fillRect(i,15-j,1,1);else if(side==='w')x.fillRect(j,i,1,1);else x.fillRect(15-j,i,1,1)}}return c})}

// ---- muros (vista 3/4): cara frontal, cara superior ----
function bakeWallFront(t,v,plaster){const c=mkc(16,16),x=c.getContext('2d'),R=rngS(v*53+1);
 if(plaster){rect(x,0,0,16,16,'#8a7868');for(let i=0;i<30;i++)dot(x,R()*16,R()*16,R()<.5?'#9a8878':'#766655');
  rect(x,0,0,16,3,'#3a2418');rect(x,0,3,16,1,'#241410');rect(x,0,12,16,4,'#3a2418');rect(x,0,12,16,1,'#5a3a28');rect(x,0,15,16,1,'#1a0e0a');rect(x,0,3,2,9,'#3a2418');rect(x,14,3,2,9,'#3a2418');
  if(v%2===0){rect(x,5,5,6,6,'#0a0508');const l=v%4===0;rect(x,6,6,4,4,l?'#ff9a3c':'#1a1018');if(l){rect(x,6,6,4,1,'#ffd36a');}rect(x,5,5,6,1,'#3a2418');rect(x,7,5,1,6,'#3a2418')}
  if(v%7===3){rect(x,3,6,3,3,'#5a4636');rect(x,10,8,2,2,'#5a4636')}return c}
 for(let ry=0;ry<4;ry++){const off=ry%2?4:0;for(let sx=-1;sx<3;sx++){const x0=sx*8+off;rect(x,x0,ry*4,8,4,t.wf[Math.floor(R()*3)])}}
 for(let ry=0;ry<4;ry++){const off=ry%2?4:0;rect(x,0,ry*4+3,16,1,t.mo);for(let sx=-1;sx<3;sx++){const x0=sx*8+off;rect(x,x0+7,ry*4,1,3,t.mo);x.globalAlpha=.3;rect(x,x0,ry*4,7,1,t.hi);x.globalAlpha=1}}
 rect(x,0,0,16,2,t.hi);rect(x,0,2,16,1,mixc(t.hi,t.wf[0],.5));rect(x,0,15,16,1,t.mo);
 for(let i=0;i<6;i++)dot(x,R()*16,3+R()*12,R()<.5?t.mo:t.wf[0]);
 if(v%6===2){let X=4+R()*8,Y=3;x.fillStyle=t.mo;for(let i=0;i<8;i++){x.fillRect(X|0,Y,1,1);X+=R()<.4?(R()<.5?-1:1):0;Y+=1}}
 if(v%5===3){x.globalAlpha=.4;for(let i=0;i<7;i++)dot(x,R()*16,6+R()*8,'#4a7a4a');x.globalAlpha=1}return c}
function bakeWallTop(t,flags,v){const c=mkc(16,16),x=c.getContext('2d'),R=rngS(v*19+flags);rect(x,0,0,16,16,t.wt);
 for(let i=0;i<24;i++)dot(x,R()*16,R()*16,t.wh);
 if(flags&1){rect(x,0,0,16,3,mixc(t.wf[0],t.hi,.5));rect(x,0,0,16,1,t.hi);rect(x,0,3,16,1,t.wf[2])}
 if(flags&2)rect(x,0,0,1,16,mixc(t.wt,t.hi,.45));
 if(flags&4)rect(x,15,0,1,16,mixc(t.wt,'#000000',.4));return c}
function bakeRoof(t,v){const c=mkc(16,16),x=c.getContext('2d'),R=rngS(v+99);rect(x,0,0,16,16,'#4a2420');
 for(let ry=0;ry<4;ry++){const off=ry%2?4:0;for(let sx=-1;sx<3;sx++){const x0=sx*8+off;rect(x,x0,ry*4,7,3,['#6a342c','#5a2c26','#7a3c30'][Math.floor(R()*3)]);rect(x,x0,ry*4+3,8,1,'#241010');rect(x,x0,ry*4,7,1,'#8a4a3c')}}
 if(v%5===2){rect(x,5,4,5,5,'#1a0a0a');rect(x,6,5,3,3,'#2a1410')}return c}
