// ===== IA DE ENEMIGOS: persecución sin atascos y rescate de enemigos incrustados / fuera del mapa =====
// Problemas que corrige:
//  1) Los enemigos iban en línea recta hacia el jugador y se quedaban temblando en la esquina de un objeto (urna, barril, pilar...)
//     porque la vista (W.los) ignora los objetos bajos pero el movimiento sí choca con ellos.
//  2) El buscador de rutas se rendía a las 1800 casillas y no tenía en cuenta el tamaño del enemigo.
//  3) Enemigos que aparecían dentro de un muro/objeto, o acababan fuera del mapa, se quedaban inmóviles para siempre.
// Se engancha a chase / mk / updE sin tocar el resto de la lógica.
(function(){
const DX=[1,-1,0,0,1,1,-1,-1],DY=[0,0,1,-1,1,-1,1,-1];
const okp=(x,y,hw,hh)=>W.ok(x>>4,y>>4)&&!W.hit(x,y,hw,hh);

// punto libre más cercano (anillos crecientes)
function freeSpot(x,y,hw,hh){
 if(okp(x,y,hw,hh))return{x,y};
 for(let r=3;r<=128;r+=3){const n=Math.max(8,Math.round(r/3));for(let a=0;a<n;a++){const t=a/n*6.2832,nx=x+Math.cos(t)*r,ny=y+Math.sin(t)*r;if(okp(nx,ny,hw,hh))return{x:nx,y:ny}}}
 return null}

// ¿puede el cuerpo del enemigo (con su tamaño real) ir en línea recta de A a B?
function clearP(x0,y0,x1,y1,hw,hh){
 const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/5);
 for(let k=1;k<=n;k++){const t=k/n;if(W.hit(x0+(x1-x0)*t,y0+(y1-y0)*t,hw,hh))return false}
 return true}

// BFS por casillas teniendo en cuenta el tamaño del enemigo. Sin límite de casillas.
// Si no hay ruta, devuelve la ruta hacia la casilla alcanzable más cercana al destino.
function route(sx,sy,tx,ty,hw,hh){
 const C=W.cols,Rw=W.rows,s={x:sx>>4,y:sy>>4},t={x:tx>>4,y:ty>>4};
 if(!W.ok(s.x,s.y)||!W.ok(t.x,t.y))return null;
 const ix=(x,y)=>y*C+x,pg=new Uint8Array(C*Rw);
 const pass=(x,y)=>{if(!W.ok(x,y))return false;const i=ix(x,y);if(!pg[i])pg[i]=W.hit(x*16+8,y*16+8,hw,hh)?2:1;return pg[i]===1};
 const prev=new Int32Array(C*Rw).fill(-2),si=ix(s.x,s.y),ti=ix(t.x,t.y),q=[si];
 prev[si]=-1;let best=si,bd=Math.hypot(s.x-t.x,s.y-t.y),found=false;
 for(let h=0;h<q.length;h++){const c=q[h];if(c===ti){found=true;break}
  const cx=c%C,cy=(c/C)|0,d=Math.hypot(cx-t.x,cy-t.y);if(d<bd){bd=d;best=c}
  for(let k=0;k<8;k++){const ax=DX[k],ay=DY[k],nx=cx+ax,ny=cy+ay;if(!W.ok(nx,ny))continue;const ni=ix(nx,ny);if(prev[ni]!==-2)continue;
   if(ni!==ti&&!pass(nx,ny))continue;
   if(ax&&ay&&!(pass(cx+ax,cy)&&pass(cx,cy+ay)))continue;
   prev[ni]=c;q.push(ni)}}
 const end=found?ti:best,path=[];
 for(let c=end;c!==si&&c>=0;c=prev[c])path.push({x:(c%C)*16+8,y:((c/C)|0)*16+8});
 path.reverse();return{path,found}}

// de los primeros nodos de la ruta, el más lejano al que se puede ir en línea recta (evita zigzag y rozar esquinas)
function pick(e,path,hw,hh){
 let k=Math.min(path.length-1,9);
 for(;k>0;k--)if(clearP(e.x,e.y,path[k].x,path[k].y,hw,hh))break;
 return path[k]}

// último recurso: salta al siguiente nodo de la ruta
function rescue(e,tx,ty,hw,hh){
 const r=route(e.x,e.y,tx,ty,hw,hh);
 if(r&&r.path.length){const p=r.path[Math.min(1,r.path.length-1)];if(okp(p.x,p.y,e.hw,e.hh)){e.x=p.x;e.y=p.y;e.kx=e.ky=0}}
 else{const f=freeSpot(e.x,e.y,e.hw,e.hh);if(f){e.x=f.x;e.y=f.y}}}

window.IA={route,clearP,freeSpot,rescue,pick};
chase=function(e,tx,ty,sp,dt){
 const I=e.ia||(e.ia={pt:R()*.3,st:0,px:e.x,py:e.y,side:R()<.5?1:-1,wp:null,force:0,acc:0,exp:0,idle:0});
 const hw=Math.min(e.hw,8),hh=e.hh,step=sp*dt,dx=tx-e.x,dy=ty-e.y,l=Math.hypot(dx,dy)||1;
 // vigilante de progreso: si en medio segundo avanzó menos del 30 % de lo esperado, está atascado
 I.acc+=dt;I.exp+=step;
 if(I.acc>=.5){const mv=Math.hypot(e.x-I.px,e.y-I.py);
  if(I.idle<=0&&mv<I.exp*.3&&l>26){I.st++;I.force=1.2;I.side=-I.side;I.pt=0;if(I.st>=6){rescue(e,tx,ty,hw,hh);I.st=0}}else I.st=0;
  I.px=e.x;I.py=e.y;I.acc=0;I.exp=0}
 I.force-=dt;I.idle-=dt;
 if(I.idle>0){e.mvg=0;return}
 const direct=l<20||(l<320&&clearP(e.x,e.y,tx,ty,hw,hh));
 let gx=tx,gy=ty;
 if(direct&&I.force<=0)I.wp=null;
 else{
  I.pt-=dt;
  if(I.pt<=0||!I.wp){I.pt=.3;const r=route(e.x,e.y,tx,ty,hw,hh);
   if(r&&r.path.length)I.wp=pick(e,r.path,hw,hh);
   else{I.wp=null;if(r&&!r.found){I.idle=.6;e.mvg=0;return}}}   // sin ruta posible y ya en el punto más cercano: espera, no tiembla
  if(I.wp){gx=I.wp.x;gy=I.wp.y;if(Math.hypot(gx-e.x,gy-e.y)<4)I.pt=0}}
 let ax=gx-e.x,ay=gy-e.y;const al=Math.hypot(ax,ay)||1;ax/=al;ay/=al;
 // si justo delante hay un obstáculo, gira hacia el lado libre (y recuerda el lado para no oscilar)
 const look=Math.max(2.5,step*3),free=(c,s)=>!W.hit(e.x+c*look,e.y+s*look,e.hw,e.hh);
 let vx=ax,vy=ay;
 if(!free(ax,ay)){const base=Math.atan2(ay,ax);let done=false;
  for(const da of[.45,.9,1.35,1.8,2.3]){for(const sg of[I.side,-I.side]){const a=base+da*sg,c=Math.cos(a),s=Math.sin(a);if(free(c,s)){vx=c;vy=s;I.side=sg;done=true;break}}if(done)break}}
 W.move(e,vx*step,vy*step,e.hw,e.hh);
 e.mvg=1};

// aparición segura: nada nace dentro de un muro u objeto
{const m0=mk;mk=function(t,x,y,id){const e=m0(t,x,y,id);
 try{if(W&&W.hit&&(W.hit(e.x,e.y,e.hw,e.hh)||!W.ok(e.x>>4,e.y>>4))){const f=freeSpot(e.x,e.y,e.hw,e.hh);if(f){e.x=f.x;e.y=f.y}}}catch(_){}
 e.home={x:e.x,y:e.y};e.lg={x:e.x,y:e.y};return e}}

// rescate permanente: si un enemigo acaba incrustado o fuera del mapa, vuelve a su última posición válida
{const u0=updE;updE=function(e,dt){u0(e,dt);
 if(e.s==='dead'||!W||!W.hit)return;
 e.gt=(e.gt||0)-dt;if(e.gt>0)return;e.gt=.15;
 const bad=!W.ok(e.x>>4,e.y>>4)||W.hit(e.x,e.y,e.hw,e.hh);
 if(!bad){e.lg={x:e.x,y:e.y};return}
 let p=null;
 if(e.lg&&okp(e.lg.x,e.lg.y,e.hw,e.hh))p=e.lg;
 if(!p)p=freeSpot(Math.max(8,Math.min(W.cols*16-8,e.x)),Math.max(8,Math.min(W.rows*16-8,e.y)),e.hw,e.hh);
 if(!p&&e.home&&okp(e.home.x,e.home.y,e.hw,e.hh))p=e.home;
 if(p){e.x=p.x;e.y=p.y;e.kx=e.ky=0;if(e.ia){e.ia.wp=null;e.ia.st=0}}}}
})();
