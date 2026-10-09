// ===== MUNDO: mapa en baldosas, colisión, búsqueda de caminos y horneado del terreno =====
const GW=384,GH=216;
const WALLISH=new Set(['wall','roof','hwall']);
// rectángulos de colisión dentro de la baldosa (1 = baldosa completa)
const COL={wall:1,roof:1,hwall:1,gate:1,tree:[4,3,12,16],dtree:[5,3,11,16],pillar:[3,4,13,16],bpillar:[3,5,13,16],statue:[3,4,13,16],tomb:[3,5,13,16],cross:[5,6,11,16],barrel:[3,5,13,16],crate:[2,4,14,16],rock:[2,5,14,16],brazier:[3,6,13,16],well:[0,4,16,16],barr:[1,6,15,16],urn:[4,5,12,16]};
const SIGHT=new Set(['wall','roof','hwall','gate','tree','dtree','pillar','statue','well']);
class Mapa{
 constructor(rg){this.rg=rg;this.th=TH[rg.th];this.cols=rg.cols;this.rows=rg.rows;const n=this.cols*this.rows;this.gd=new Array(n).fill('f');this.on=new Array(n).fill(null);this.ov=new Uint8Array(n);
  this.water=[];this.fires=[];this.npcs=[];this.items=[];this.ens=[];this.torches=[];this.decs=[];this.arena=null;this.exitP=null;this.gateOn=false;this.R=rngS(rg.cols*131+rg.rows*7+rg.id.length*31);this.walkT=0}
 i(x,y){return y*this.cols+x}ok(x,y){return x>=0&&y>=0&&x<this.cols&&y<this.rows}
 fillG(c){this.gd.fill(c)}fillO(nm){for(let i=0;i<this.on.length;i++){this.on[i]=nm;this.ov[i]=this.R()*255|0}}
 g(c,x,y,w,h){for(let j=y;j<y+h;j++)for(let k=x;k<x+w;k++)if(this.ok(k,j))this.gd[this.i(k,j)]=c}
 o(nm,x,y,w,h){for(let j=y;j<y+h;j++)for(let k=x;k<x+w;k++)if(this.ok(k,j)){const i=this.i(k,j);this.on[i]=nm;this.ov[i]=this.R()*255|0}}
 clr(x,y,w,h){for(let j=y;j<y+h;j++)for(let k=x;k<x+w;k++)if(this.ok(k,j))this.on[this.i(k,j)]=null}
 room(x,y,w,h,c){this.clr(x,y,w,h);if(c)this.g(c,x,y,w,h)}
 box(nm,x,y,w,h){this.o(nm,x,y,w,1);this.o(nm,x,y+h-1,w,1);this.o(nm,x,y,1,h);this.o(nm,x+w-1,y,1,h)}
 ring(nm,t){this.o(nm,0,0,this.cols,t);this.o(nm,0,this.rows-t,this.cols,t);this.o(nm,0,0,t,this.rows);this.o(nm,this.cols-t,0,t,this.rows)}
 path(pts,w,c){const r=Math.floor(w/2);for(let s=0;s<pts.length-1;s++){let[x0,y0]=pts[s];const[x1,y1]=pts[s+1],n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let k=0;k<=n;k++){const px=Math.round(x0+(x1-x0)*k/n),py=Math.round(y0+(y1-y0)*k/n);this.room(px-r,py-r,w,w,c)}}}
 sc(nm,n,x,y,w,h,op={}){const R=rngS((op.seed||1)*7919+this.cols),gap=op.gap||2,av=op.avoid||'';let placed=0;
  for(let a=0;a<n*40&&placed<n;a++){const tx=x+(R()*w|0),ty=y+(R()*h|0);if(!this.ok(tx,ty)||this.on[this.i(tx,ty)])continue;if(av.includes(this.gd[this.i(tx,ty)]))continue;
   let bad=false;for(let j=-(gap-1);j<=gap-1&&!bad;j++)for(let k=-(gap-1);k<=gap-1;k++){if(this.ok(tx+k,ty+j)&&this.on[this.i(tx+k,ty+j)]&&!NOSOLID_OBJ.has(this.on[this.i(tx+k,ty+j)])){bad=true;break}}
   if(bad)continue;if(this.fires.concat(this.npcs,this.items,this.ens).some(e=>Math.abs(e.tx-tx)<2&&Math.abs(e.ty-ty)<2))continue;
   const i=this.i(tx,ty);this.on[i]=nm;this.ov[i]=R()*255|0;placed++}}
 house(x,y,w,h,door){for(let j=0;j<h-1;j++)this.o('roof',x,y+j,w,1);this.o('hwall',x,y+h-1,w,1);if(door>=0){this.clr(x+door,y+h-1,1,1);this.decs.push({n:'door',tx:x+door,ty:y+h-1})}}
 softClr(tx,ty,r){for(let j=-r;j<=r;j++)for(let k=-r;k<=r;k++)if(this.ok(tx+k,ty+j)){const i=this.i(tx+k,ty+j),n=this.on[i];if(n&&!WALLISH.has(n))this.on[i]=null}}
 torch(x,y){if(this.ok(x,y)&&this.on[this.i(x,y)]==='wall'&&this.ok(x,y+1)&&!WALLISH.has(this.on[this.i(x,y+1)]||''))this.torches.push({tx:x,ty:y,x:x*16+8,y:y*16+10})}
 ent(a,tx,ty,o){this.softClr(tx,ty,1);return Object.assign({tx,ty,x:tx*16+8,y:ty*16+8},o||{},a||{})}
 fire(x,y){this.fires.push(this.ent({id:this.fires.length},x,y))}
 npc(id,x,y){this.npcs.push(this.ent({id},x,y))}
 item(x,y,sp){this.items.push(this.ent({},x,y,sp))}
 en(t,x,y){this.ens.push(this.ent({t},x,y))}
 exit(x,y){this.softClr(x,y,1);this.exitP={tx:x,ty:y,x:x*16+8,y:y*16+8}}
 setArena(r,gates,bx,by){this.arena={x:r.x,y:r.y,w:r.w,h:r.h,gates,bx,by}}
 setGate(on){this.gateOn=on;if(!this.arena)return;this.arena.gates.forEach(([x,y,w,h])=>{for(let j=y;j<y+h;j++)for(let k=x;k<x+w;k++){const i=this.i(k,j);this.on[i]=on?'gate':null}})}
 // --- consulta ---
 col(tx,ty){if(!this.ok(tx,ty))return 1;const i=this.i(tx,ty);if(this.gd[i]==='w')return 1;const n=this.on[i];return n?(COL[n]||0):0}
 hit(x,y,hw,hh){const x0=Math.floor((x-hw)/16),x1=Math.floor((x+hw-.01)/16),y0=Math.floor((y-hh)/16),y1=Math.floor((y+hh-.01)/16);
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const c=this.col(tx,ty);if(!c)continue;if(c===1)return true;const rx=tx*16,ry=ty*16;if(x+hw>rx+c[0]&&x-hw<rx+c[2]&&y+hh>ry+c[1]&&y-hh<ry+c[3])return true}return false}
 move(e,dx,dy,hw,hh){hw=hw||e.hw||5;hh=hh||e.hh||3;const ox=e.x,oy=e.y;if(dx&&!this.hit(e.x+dx,e.y,hw,hh))e.x+=dx;if(dy&&!this.hit(e.x,e.y+dy,hw,hh))e.y+=dy;return Math.abs(e.x-ox)+Math.abs(e.y-oy)}
 sight(tx,ty){if(!this.ok(tx,ty))return true;const n=this.on[this.i(tx,ty)];return !!n&&SIGHT.has(n)}
 los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/6);for(let k=1;k<n;k++){const t=k/n;if(this.sight(Math.floor((x0+(x1-x0)*t)/16),Math.floor((y0+(y1-y0)*t)/16)))return false}return true}
 free(tx,ty){return this.col(tx,ty)!==1&&!(this.on[this.i(tx,ty)]&&COL[this.on[this.i(tx,ty)]])}
 // BFS (8 vecinos): devuelve el centro de la siguiente baldosa hacia el destino
 next(sx,sy,tx,ty,lim=1800){const C=this.cols,s=this.i(sx,sy),t=this.i(tx,ty);if(s===t)return null;const prev=new Int32Array(C*this.rows).fill(-2),q=[s];prev[s]=-1;let found=false,n=0;
  for(let h=0;h<q.length&&n++<lim;h++){const c=q[h],cx=c%C,cy=(c/C)|0;if(c===t){found=true;break}
   for(let d=0;d<8;d++){const ax=[1,-1,0,0,1,1,-1,-1][d],ay=[0,0,1,-1,1,-1,1,-1][d],nx=cx+ax,ny=cy+ay;if(!this.ok(nx,ny))continue;const ni=this.i(nx,ny);if(prev[ni]!==-2)continue;if(this.col(nx,ny)===1||(this.on[ni]&&COL[this.on[ni]]&&ni!==t))continue;
    if(ax&&ay&&(this.col(cx+ax,cy)||this.col(cx,cy+ay)))continue;prev[ni]=c;q.push(ni)}}
  if(!found)return null;let c=t,p=prev[c];while(p!==s&&p>=0){c=p;p=prev[c]}return{x:(c%C)*16+8,y:((c/C)|0)*16+8}}
 // --- horneado: suelo + muros + sombras en un solo canvas ---
 bake(){const T=this.th,C=this.cols,Rw=this.rows,cv=mkc(C*16,Rw*16),x=cv.getContext('2d'),isW=(tx,ty)=>this.ok(tx,ty)&&WALLISH.has(this.on[this.i(tx,ty)]||'');
  const stone=T.grass&&this.rg.th==='valdora'?bakeCobble:bakeStone,gAt=(tx,ty)=>this.ok(tx,ty)?this.gd[this.i(tx,ty)]:'x';
  const st=[0,1,2,3].map(v=>stone(T,v)),gr=[0,1,2,3,4].map(v=>bakeGrass(T,v)),di=[0,1,2].map(v=>bakeDirt(T,v)),bo=bakeBoards(T,0);
  for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){const i=this.i(tx,ty),c=this.gd[i],h=(tx*7+ty*13+tx*ty)%5,X=tx*16,Y=ty*16;
   let art=c==='g'?gr[h]:c==='p'?di[h%3]:c==='b'?bo:c==='c'?cached('car'+T.k+(h%3),()=>bakeCarpet(T,h)):c==='w'?null:st[h%4];
   if(art)x.drawImage(art,X,Y);else x.drawImage(bakeWater(T,0,h),X,Y);
   // bordes entre tipos de suelo
   const sides=[['n',0,-1],['s',0,1],['w',-1,0],['e',1,0]];
   for(const[sd,ax,ay]of sides){const nb=gAt(tx+ax,ty+ay);if(nb==='x'||nb===c)continue;let col=null,al=1;
    if((c==='p')&&nb==='g')col=T.grass[0];else if((c==='f')&&T.grass&&nb==='g'&&this.rg.th!=='trono')col=T.grass[0];else if(c==='g'&&nb==='w')col='#0a1018';else if(c==='w'&&nb!=='w')col='#9ac8e8';else if(c==='p'&&nb==='w')col='#1a1410';
    if(col){x.globalAlpha=c==='w'?.55:c==='g'&&nb==='w'?.5:1;x.drawImage(edgeStrip(col,sd,h),X,Y);x.globalAlpha=1}}}
  // muros y tejados
  for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){const i=this.i(tx,ty),n=this.on[i],v=this.ov[i],X=tx*16,Y=ty*16;if(!WALLISH.has(n||''))continue;
   if(n==='roof'){x.drawImage(bakeRoof(T,v%4),X,Y);if(!isW(tx,ty-1)||this.on[this.i(tx,ty-1)]!=='roof'){x.fillStyle='rgba(255,200,160,.18)';x.fillRect(X,Y,16,1)}if(this.on[this.i(tx,ty+1)]==='hwall'){x.fillStyle='rgba(0,0,0,.4)';x.fillRect(X,Y+13,16,3)}continue}
   if(n==='hwall'){x.drawImage(bakeWallFront(T,v,true),X,Y);continue}
   const south=isW(tx,ty+1);if(!south)x.drawImage(cached('wf'+T.k+(v%8),()=>bakeWallFront(T,v%8)),X,Y);
   else{const fl=(isW(tx,ty-1)?0:1)|(isW(tx-1,ty)?0:2)|(isW(tx+1,ty)?0:4);x.drawImage(cached('wt'+T.k+fl+(v%4),()=>bakeWallTop(T,fl,v%4)),X,Y)}}
  // sombras de muro sobre el suelo y contacto de objetos
  for(let ty=1;ty<Rw;ty++)for(let tx=0;tx<C;tx++){if(isW(tx,ty))continue;const above=this.on[this.i(tx,ty-1)];if(above==='wall'&&!isW(tx,ty-2)||above==='wall'||above==='hwall'){x.fillStyle='rgba(0,0,0,.34)';x.fillRect(tx*16,ty*16,16,3);x.fillStyle='rgba(0,0,0,.16)';x.fillRect(tx*16,ty*16+3,16,2)}}
  for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){const n=this.on[this.i(tx,ty)];if(!n||WALLISH.has(n)||n==='gate')continue;const w=n==='tree'||n==='dtree'?11:n==='well'||n==='barr'?15:n==='rubble'||n==='bush'?10:9,cx=tx*16+8,cy=ty*16+14;x.fillStyle='rgba(0,0,0,.28)';x.fillRect(cx-w/2+2,cy-1,w-4,1);x.fillRect(cx-w/2,cy,w,1);x.fillRect(cx-w/2+2,cy+1,w-4,1)}
  this.water=[];for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){if(this.gd[this.i(tx,ty)]!=='w')continue;const e=[];for(const[sd,ax,ay]of[['n',0,-1],['s',0,1],['w',-1,0],['e',1,0]]){const nb=gAt(tx+ax,ty+ay);if(nb!=='x'&&nb!=='w')e.push([sd,'#9ac8e8'])}this.water.push({tx,ty,v:(tx*7+ty*13+tx*ty)%5,e})}
  this.base=cv;
  // minimapa 1px por baldosa
  const mm=mkc(C,Rw),m=mm.getContext('2d');for(let ty=0;ty<Rw;ty++)for(let tx=0;tx<C;tx++){const n=this.on[this.i(tx,ty)],c=this.gd[this.i(tx,ty)];m.fillStyle=WALLISH.has(n||'')?'#0e0a18':c==='w'?'#1a3a6a':n==='tree'||n==='dtree'?'#1f3a2a':n?'#3a3250':c==='p'?'#6a5a42':c==='c'?'#7a1a2e':c==='g'?'#2a3a2e':'#4a4560';m.fillRect(tx,ty,1,1)}this.mini=mm}
}
