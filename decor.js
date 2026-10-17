// ===== DECORADO DE SUELOS: marcos, rombos, círculos rúnicos y detalles sueltos en las salas de piedra =====
// Antes las salas grandes eran un empedrado liso. Ahora, al hornear la región (Mapa.bake → decorFloor), cada sala de piedra recibe:
//  · un marco de losas oscuras pegado a los muros con una línea de incrustación,
//  · un patrón de rombos incrustados en las losas del interior (en pasillos estrechos queda como una alfombra de rombos),
//  · círculos rúnicos grabados en el centro de las salas amplias,
//  · grietas, huesos, manchas, musgo, cera y piedras sueltas repartidos con semilla fija (siempre iguales).
(function(){
const DECOR_TH=new Set(['cripta','trono','puertas','capilla','biblioteca','cocinas','torre']);
const NOFLOOR=new Set(['g','p','b','k','c','w']);
const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return 'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+a+')'};
// círculo rúnico de 3x3 baldosas (48px): dos anillos, marcas, estrella de ocho puntas y glifos
function bakeRune(T,v){return cached('rune'+(T.k||'')+v,()=>{const S=48,c=mkc(S,S),x=c.getContext('2d'),cx=23.5,cy=23.5,ac=T.ac||'#9a86d8',lo=T.mo||'#120c1e';
 const ring=(r,col,a)=>{x.fillStyle=rgba(col,a);const n=Math.round(r*7);for(let i=0;i<n;i++){const t=i/n*6.2832;x.fillRect(Math.round(cx+Math.cos(t)*r),Math.round(cy+Math.sin(t)*r),1,1)}};
 ring(21,lo,.8);ring(20,ac,.5);ring(15.5,lo,.8);ring(14.5,ac,.42);ring(9,ac,.35);
 for(let i=0;i<16;i++){const t=i/16*6.2832,a=Math.cos(t),b=Math.sin(t),big=i%2===0;x.fillStyle=rgba(ac,big?.6:.35);for(let r=15.5;r<=(big?20:18);r++)x.fillRect(Math.round(cx+a*r),Math.round(cy+b*r),1,1)}
 const star=(r,k,col,al)=>{x.fillStyle=rgba(col,al);for(let i=0;i<8;i++){const t0=i/8*6.2832+(v?.39:0),t1=((i+k)%8)/8*6.2832+(v?.39:0);for(let s=0;s<=1;s+=1/(r*1.6)){const xx=Math.cos(t0)*r*(1-s)+Math.cos(t1)*r*s,yy=Math.sin(t0)*r*(1-s)+Math.sin(t1)*r*s;x.fillRect(Math.round(cx+xx),Math.round(cy+yy),1,1)}}};
 star(14,3,ac,.4);star(14,2,ac,.22);
 x.fillStyle=rgba(ac,.75);x.fillRect(22,22,3,3);x.fillStyle=rgba('#ffffff',.5);x.fillRect(23,23,1,1);
 for(let i=0;i<4;i++){const t=i/4*6.2832+.785,gx=Math.round(cx+Math.cos(t)*17.8),gy=Math.round(cy+Math.sin(t)*17.8);x.fillStyle=rgba(ac,.7);x.fillRect(gx-1,gy,3,1);x.fillRect(gx,gy-1,1,3)}
 return c})}
// detalles sueltos de 16x16
function bakeDecal(T,kind,v){return cached('dc'+(T.k||'')+kind+v,()=>{const c=mkc(16,16),x=c.getContext('2d'),R=rngS(v*131+kind.length*17+7),lo=T.mo||'#120c1e',hi=T.hi||'#463c64';
 if(kind==='crack'){x.fillStyle=lo;let X=2+R()*10,Y=0;const dx=R()<.5?-1:1;for(let i=0;i<16;i++){x.fillRect(X|0,Y|0,1,1);if(R()<.35)x.fillRect((X+dx)|0,Y|0,1,1);X+=R()<.45?dx:0;Y+=1;if(X<1||X>14)break;if(i===7&&R()<.6){let X2=X,Y2=Y;for(let j=0;j<5;j++){X2-=dx;Y2+=1;x.fillRect(X2|0,Y2|0,1,1)}}}
  x.fillStyle=rgba(hi,.5);let X3=3+R()*8;for(let i=0;i<5;i++)x.fillRect((X3+1)|0,2+i*2,1,1)}
 else if(kind==='bones'){const bc='#c9c0ac',bs='#8a8070';const bone=(X,Y,l,vert)=>{x.fillStyle=bs;if(vert){x.fillRect(X,Y,1,l);x.fillRect(X-1,Y,3,1);x.fillRect(X-1,Y+l-1,3,1)}else{x.fillRect(X,Y,l,1);x.fillRect(X,Y-1,1,3);x.fillRect(X+l-1,Y-1,1,3)}x.fillStyle=bc;if(vert)x.fillRect(X,Y+1,1,l-2);else x.fillRect(X+1,Y,l-2,1)};
  bone(3+R()*3|0,4+R()*3|0,6,R()<.5);bone(7+R()*3|0,9+R()*3|0,5,R()<.5);
  if(R()<.6){x.fillStyle=bs;x.fillRect(10,3,4,3);x.fillStyle=bc;x.fillRect(10,3,4,2);x.fillStyle='#120c1e';x.fillRect(11,4,1,1);x.fillRect(13,4,1,1);x.fillRect(11,6,3,1)}}
 else if(kind==='stain'){x.fillStyle='rgba(60,8,18,.5)';const cx=7+R()*3,cy=7+R()*3;for(let i=0;i<40;i++){const a=R()*6.28,r=R()*5.5*R();x.fillRect((cx+Math.cos(a)*r)|0,(cy+Math.sin(a)*r*.8)|0,1,1)}x.fillStyle='rgba(90,14,26,.5)';for(let i=0;i<10;i++)x.fillRect((cx+(R()-.5)*5)|0,(cy+(R()-.5)*4)|0,1,1)}
 else if(kind==='moss'){const m=['rgba(58,96,58,.55)','rgba(40,70,44,.6)','rgba(84,128,72,.45)'];for(let i=0;i<34;i++){const a=R()*6.28,r=R()*6*R();x.fillStyle=m[(R()*3)|0];x.fillRect((8+Math.cos(a)*r)|0,(8+Math.sin(a)*r*.8)|0,1+(R()<.2?1:0),1)}}
 else if(kind==='wax'){x.fillStyle='rgba(222,208,170,.55)';const cx=6+R()*4,cy=6+R()*4;for(let i=0;i<20;i++){x.fillRect((cx+(R()-.5)*7)|0,(cy+(R()-.5)*5)|0,1+(R()<.3?1:0),1)}x.fillStyle='rgba(255,246,214,.7)';x.fillRect(cx|0,cy|0,2,2);x.fillStyle='rgba(120,100,70,.7)';x.fillRect(cx|0,((cy|0)+2),2,1)}
 else{const sc=['#3a3350','#4a4262','#2a2440'];for(let i=0;i<4+((R()*3)|0);i++){const X=1+R()*12|0,Y=2+R()*11|0,w=1+(R()<.5?1:0)+(R()<.2?1:0);x.fillStyle='rgba(0,0,0,.45)';x.fillRect(X,Y+1,w+1,1);x.fillStyle=sc[(R()*3)|0];x.fillRect(X,Y,w+1,1+(w>1?1:0));x.fillStyle=rgba(hi,.7);x.fillRect(X,Y,w,1)}}
 return c})}
// baldosa de rombo incrustado (se dibuja encima de la losa)
function diamond(T,v){return cached('dm'+(T.k||'')+v,()=>{const c=mkc(16,16),x=c.getContext('2d'),lo=T.mo||'#120c1e',hi=T.hi||'#463c64';
 for(let y=0;y<16;y++){const hw=y<8?y:15-y,a=7-hw,b=8+hw;x.fillStyle=rgba(lo,.65);x.fillRect(a,y,1,1);x.fillRect(b,y,1,1);if(hw>1){x.fillStyle=v?rgba(lo,.24):rgba(hi,.2);x.fillRect(a+1,y,b-a-1,1)}}
 x.fillStyle=rgba(hi,.35);for(let y=1;y<7;y++)x.fillRect(7-y+1,y,1,1);return c})}
Mapa.prototype.decorFloor=function(x,T){
 const th=this.rg&&this.rg.th;if(!DECOR_TH.has(th)||T.grass)return;
 const C=this.cols,Rw=this.rows,ok=(tx,ty)=>tx>=0&&ty>=0&&tx<C&&ty<Rw;
 const isF=(tx,ty)=>{if(!ok(tx,ty))return false;const i=this.i(tx,ty),n=this.on[i];if(n&&WALLISH.has(n))return false;if(n==='gate')return false;return !NOFLOOR.has(this.gd[i])};
 // distancia (Chebyshev) de cada baldosa de suelo al muro/abismo/agua más cercano
 const D=new Int16Array(C*Rw).fill(-1),q=[];
 for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){if(!isF(tx,ty))continue;let edge=false;for(let dy=-1;dy<=1&&!edge;dy++)for(let dx=-1;dx<=1;dx++)if((dx||dy)&&!isF(tx+dx,ty+dy)){edge=true;break}if(edge){D[ty*C+tx]=1;q.push(tx,ty)}}
 for(let h=0;h<q.length;h+=2){const tx=q[h],ty=q[h+1],d=D[ty*C+tx];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=tx+dx,ny=ty+dy;if(!isF(nx,ny)||D[ny*C+nx]>=0)continue;D[ny*C+nx]=d+1;q.push(nx,ny)}}
 const dAt=(tx,ty)=>isF(tx,ty)?D[ty*C+tx]:0,ac=T.ac||'#9a86d8',hi=T.hi||'#463c64',lo=T.mo||'#120c1e';
 const occ=(tx,ty)=>{const n=this.on[this.i(tx,ty)];return !!n};
 // 1 · marco y rombos
 for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){const d=dAt(tx,ty);if(d<1)continue;const X=tx*16,Y=ty*16;
  if(d===1){x.fillStyle='rgba(0,0,0,.2)';x.fillRect(X,Y,16,16);x.fillStyle=rgba(hi,.18);x.fillRect(X+1,Y+1,14,1)}
  else{if((tx+ty)%2===0)x.drawImage(diamond(T,(tx*3+ty)%2),X,Y)}
  // línea de incrustación entre el marco y el interior
  if(d===1){const L=rgba(ac,.38);x.fillStyle=L;
   if(dAt(tx,ty-1)>=2)x.fillRect(X,Y,16,1);if(dAt(tx,ty+1)>=2)x.fillRect(X,Y+15,16,1);if(dAt(tx-1,ty)>=2)x.fillRect(X,Y,1,16);if(dAt(tx+1,ty)>=2)x.fillRect(X+15,Y,1,16);
   x.fillStyle=rgba(lo,.6);if(dAt(tx,ty-1)>=2)x.fillRect(X,Y+1,16,1);if(dAt(tx-1,ty)>=2)x.fillRect(X+1,Y,1,16)}}
 // 2 · círculos rúnicos en el centro de las salas amplias (separados entre sí)
 const cs=[];
 for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){const d=dAt(tx,ty);if(d<3)continue;let mx=true;for(let dy=-2;dy<=2&&mx;dy++)for(let dx=-2;dx<=2;dx++)if(dAt(tx+dx,ty+dy)>d){mx=false;break}if(!mx)continue;
  let near=false;for(const c of cs)if(Math.max(Math.abs(c[0]-tx),Math.abs(c[1]-ty))<8){near=true;break}if(near)continue;
  let free=true;for(let dy=-1;dy<=1&&free;dy++)for(let dx=-1;dx<=1;dx++)if(occ(tx+dx,ty+dy)){free=false;break}
  if(!free)continue;cs.push([tx,ty]);
  x.drawImage(bakeRune(T,(tx+ty)%2),tx*16-16,ty*16-16);x.save();x.globalCompositeOperation='lighter';x.globalAlpha=.1;x.fillStyle=ac;x.fillRect(tx*16-14,ty*16-14,44,44);x.restore()}
 this.runes=cs;
 // 3 · detalles sueltos con semilla fija
 for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){const d=dAt(tx,ty);if(d<1||occ(tx,ty))continue;let near=false;for(const c of cs)if(Math.abs(c[0]-tx)<=1&&Math.abs(c[1]-ty)<=1){near=true;break}if(near)continue;
  const R=rngS((tx*73856093^ty*19349663)+Rw*131),r=R(),v=(R()*3)|0,X=tx*16,Y=ty*16;
  const kind=r<.05?'crack':r<.075?'bones':r<.105?'stain':(d===1&&r<.2)?'moss':r<.215?'wax':r<.255?'rubble':null;
  if(kind)x.drawImage(bakeDecal(T,kind,v),X,Y)}
};
})();
