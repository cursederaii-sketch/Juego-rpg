// ===== BAUTI: el panchito. NPC que camina por la capital y aparece en el cráter cuando el Rey ya cayó =====
(function(){
// sprites (frente / perfil derecho / espalda) incrustados, ya reducidos al tamaño del juego
const SPR={};
const SRC={f:'data:image/png;base64,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',
s:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAFAklEQVR42m2Va4xdZRWGn/V9+9zPmX3O3Dqd9MbMMOLQKbRFJSlStS2iQAJtqpEmcrHBWyQxBgIhpjZpTPhBUqIC0eAPiT+M8Y8iKKRpjG1ouLWppmEatbSDnTl02jlnzpzr3t+3/HGGKVNcyZesH2u/39rvft93C9eUtUmyyUDzqSzGgiAoIEaInWehsUij1ZKP5pebbDZLby6v+UyGTCYgMBaLRYyiSzPqoR3HzC8ucn5mVpYB+goFVg30aTGbxXuPw4PSPQLoEoSCiGCt5b9zV7hQLktgsfSXQg1zGaIoRuXqaiLLz4GCMRbFE8cxq4ohjUZTTVjIaSGXxcUOkavvpB87IgIilCsV6s021hisNSRTSYwNLIEsU9G9GQgCi7UWj5JIBJQvV7l926e4adNa3r94Cec96hWbT6d/UizkV34JES5dqdJqdwhzWWr1FmExxfPP7Ofh795Fbz7Ba0f+SbXRxESRJ4o80mULAWqtJt/ev4u777yZD2YvU2vU+elT32D9ljGePvQSWzaPM7SmSLVek2C+viCDrVD7i3kUiDpK7D2PPHAH4ehacj98jlOnz7Lzri1orc7fT5xl4tMj7Ni+ieNvn+lyNlAq6ereEo2WJ5VoU1tc4ObN49y3ZyfbJtcTFpL09RdQF3Nxtsa6zaO8+Owf2f+jX0hw4AAcPDgv6aTqN3cF7NhqyaZ7aHbKmNQUrx6d54ufG2NwbBh8zFuvvsPxU+f4x3sfdEk3Av3FAoceKui+LysX5zyJwJJOGBptx+ANe/j1n+oUwgzDq/sw6RR/fvkkh3/5BzHSZY7PT/boi4+HnJtVxtd6KtUO0x8q168PCPMhU/ZrHP7er/jqUIFDJ2eY9nUxInhVDMBtkylyGU8ptFypOI5MTfC+3c1f3u2hUV9g47qY8a03cEsp4ME9RRjM4XxX3gYgk4JkoIwMRhw73WZk8nZ+8OT95Nd8hb+eqNEfehY1TWWozAOPRoyCisD27UsAqoJXaEVKMmEQ7eBcjTWre1ioKySEoGNZvatOrqzoh4muXP+2BOCcwyuogPeKix3WWuIYrAFUSBeF6Zd7KE0Y9j0qoHDMLgHETsErSVHaUUzsunY21nSd7AVSjurJPDM/C7luo1/2jek2BkSYqVqMCGIAUdTHqPfgI1xHsQNN+vdWqF+Kl30TdAE8Yiwz8wEiSfCuGyLqSSYMoEQVGLxjgfx1Cc5+PQTqqJfuBkFgQZWtYx2QiNh5tN7i1s+MU4mHaSw4ciVL7VgPcTXJmt2NJRUu6aDRgsgprUhJJRztjkXSPaSyBWotMAZSeUtzJsuFw72EI/Fy6AQAb0zFfF8zeG1z43g/p88d4cBjZ7DRIjs2zaGJLNFim6DgSG7w2OBqdgSqsHYoKS+9jj5yT5ooEnZsnMfHc3jXYGLrlzg110/zzSkm7ofSvVWmXwj4RKxDyOP7Qv3CTTAybGnWqqRKI1Syd/LO706w4d8X2NBrKC8K3zk+y7/cvOxl71UAkY/SO2TTqNedt00wuG6M/5w+z2fPT3PLUC+XI8cL5+f4feuiHPgWHDx4zV/p6NHtXYOYLK/89sf63omf6yu/eUJHV/XptoFQJwdKes3aK/rlyqQCBsKMYgExtNtKudqGuC1GwCsrhXRtOQfDQyGZtBC5rtTTQYP5iuhCu7Xi0v+7QTJZIJ9RtXicekSEdkfxzkij01gx+z8LBib+kyD9gQAAAABJRU5ErkJggg==',
b:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAeCAYAAADD0FVVAAAFU0lEQVR42oWWTYwdRxHHf9U9M+/77Vvv2utl1ysSFGJjO3I2hmADcZwcUBKBsIVDhIADByROfJzCKVFuSJw5cIAL4gAHcgARCQEXExwFOIAUWRGSSQiOvV9vve9zuqe7OMzb9duwC61pqWem6q+aqn/9a4RDlsXSaTS0Us1QjRgREIsIOOfoDgfivT/QVz74IEmqLM/NaLNWpZpVSRIDREQERBCgCJGxc/SHY253uzIejw8HbVQaLB2b1aOdFiEqGpWoigiAltYKgmCMwRgY5o71rQFr3a644AAw06CL8x09NjuD84EQI8ou4P4IFAgx4nxBvZKRWoMRo7t2e6CtelM77SYhBER2AXRvl+Cy7+NEDL4IHJltkGb340v2DqbcUXUK7P5SlUNKKiRGMFLaX5uONKgSVEH1A06G/7c0Qozy3x4j5+TuxjbGmAmumXptDiIKqkpiLRvb9+iNCgH4xTSo957Nez0ZOU+WlXzU/xGdAFlqyb1nbacHuMN5enxuTlvVDu2GpVY1xKiEeB/eGkFEcF7ZGRR0+13WultyYMKuXZsc0igXzvapZTv88/aAjW2H80LuIfewvu14b21EjDtcOD1ktl0RgEuXDiC/CKg2+cmL8/rVzwpv3vS8dmPMe2vwt1tKmkCMysdPWRZmlM+cq3L6gSq//lPkG9+/Ky4O9mpc9oqWoC882dHvfW2ef63nnHvQk6aCL6A3ilhb0qpVA2uUooC33kn58ELCSz/u8bPfb8oujgFIbFnJZl1o1kcszHrGHrq9wDAPZKlSFAJRGA6V7b4yzCMPLObMthzH5hQRIbFTOS0CiAh3Nz2tSmCmXhBjwFoFFawoWzuWd9ctWQZGSvsiCAr0eh5VpQiTRlJVjDF84rFVPbHUZTzugVqCQiigmipFEBbnPargivuVMAKucCzMHeHiow+rMX8W1Zcw1hpUlavPPsbckQZjV5AlkbdvJ6zfS0gSRRViUCgvElMCRlWcD7RbFb585VPM1OoY8womRuWRkyv67OWzOJcjtqTPyWXPiaOe3JcdplpW36Bs7hi6fcEawYqlPxrz1BMf45PnT6mqljl97unznHxokdw5rBiMGAQlRsHsaukUS0I0yC7FRRjlnhNLHS5fOLNbKMtzT68SQ0BjKcRRdK8vXGGY5rIPcHTG024UhFhOAmMs3udceWaVTrOp5itXP62PX3yYnf4QpeTgbu6sUW7dgUFuMKKTDb6AGAHi3kDo94c8eHaZ57/wOCZGSGaaNBs1BEt3kIIoaKQIkY8ueWppQBXuDSzOC2ZKDYNGrAjtdh070yBNUpI/vPG2fPfbP9ReLyffGrA1qHKEEdU0gMgkj4KIYW074UPzBRWJhAhFodRbMBqP+c4rP2W+U+N31/8h+9Tl8uq8/uCbNVbmc8au5GTQiMFgEUwS8TECQpZCPVXubNZ58UcjfvXGhuwTFNWfA9cQET7/xHG9eiFSNzkfWVZq9QpBDEWMiDVUJOJdzs1bke6wym/etLx6/a7oRE1eflnKGSXy/J6Si4jYxiX91tef5LXX/8hfbrzF8VGkUasy8AXvJwlnzp9i9dFH+O0v/8qr11+Xid/BAyiZKEI1UxZXlnjmc1c4/tA5btwcwXaDv98cc/rcRb74pRc4e/4Ms+3KPr9DlX9htq31hsF7T5YKqgm3/r29Z7e82NJ6xeB9wCYZ/UHBnY2dfTjJ9E2WJaysNKnXE0KhZNbw/vqoNDIGiZFq1XBisU3hA8bCcAy9Qa6DUS4HRtpsNmk1jZbdVf4suDwyyL0452g0GmRWtZIKOmldYy2jEbLd6+3h/Ad69o4yOx0dTgAAAABJRU5ErkJggg=='};
for(const k in SRC){const im=new Image();im.src=SRC[k];SPR[k]=im}

// ---- cuerpo: dibuja el sprite de Bauti en lugar del cuerpo procedural ----
KITS.bauti=KITS.aldeano;
{const b0=body;body=function(id,x,y,fx,fy,pose,fr_,o){
  if(id!=='bauti')return b0.apply(this,arguments);
  o=o||{};const dk=dirOf(fx,fy),im=SPR[dk==='d'?'f':dk==='u'?'b':'s'];if(!im||!im.naturalWidth)return;
  const bob=pose==='walk'?((fr_&1)?-1:0):0,ox=Math.round(x-im.width/2),oy=Math.round(y-(im.height-3)+bob+(o.dy||0));
  if(o.al!=null)g.globalAlpha=o.al;
  if(dk==='l'){g.save();g.translate(ox+im.width,oy);g.scale(-1,1);g.drawImage(im,0,0);g.restore()}else g.drawImage(im,ox,oy);
  g.globalAlpha=1}}

// ---- diálogos ----
const PAN=()=>{if(!S.pancho){S.pancho=1;toast('Obtienes: Pancho (decorativo)')}};
NPC.bauti=()=>{
  if(rg.id==='crater')return D('Bauti','que panchito el rey',null,()=>{PAN()});
  if(!S.bauti)return D('Bauti','hola soy bauti y soy panchito, no te sirvo de nada, pero soy panchito',null,()=>{S.bauti=1;PAN();return D('Bauti','Toma, un pancho.')});
  return D('Bauti','Soy panchito.')};

// ---- aparece en la capital y en el cráter (solo tras vencer al Rey) ----
const free=(W,tx,ty)=>{for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const x=(tx+dx)*16+8,y=(ty+dy)*16+8;if(W.hit(x,y,4,3)||W.chasmAt(x,y))return false}return true};
const spot=(W,tx,ty)=>{for(let r=0;r<14;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=tx+dx,y=ty+dy;if(x>2&&y>2&&x<W.cols-2&&y<W.rows-2&&free(W,x,y))return[x,y]}return[tx,ty]};
const addTo=(id,tx,ty,o)=>{const r=RG.find(q=>q.id===id);if(!r)return;const b0=r.build;
  r.build=function(W){b0.call(this,W);const p=spot(W,tx,ty);W.npc('bauti',p[0],p[1],Object.assign({wander:1},o||{}))}};
addTo('valdora',64,48);
addTo('crater',23,27,{when:()=>!!(S.rey&&S.rey.done)});

// ---- camina: merodea cerca de su sitio (solo mientras juegas) ----
function wander(n,dt){
  if(n.hx===undefined){n.hx=n.x;n.hy=n.y}
  if(n.wt>0&&!n.go){n.wt-=dt;n.mv=0;return}
  if(!n.go){const a=Math.random()*6.283,d=16+Math.random()*52;n.go={x:n.hx+Math.cos(a)*d,y:n.hy+Math.sin(a)*d*.7}}
  const dx=n.go.x-n.x,dy=n.go.y-n.y,l=Math.hypot(dx,dy);
  if(l<2){n.go=null;n.wt=1.2+Math.random()*2.6;n.mv=0;return}
  const s=Math.min(l,22*dt),nx=n.x+dx/l*s,ny=n.y+dy/l*s;
  if(W.chasmAt(nx,ny)||W.hit(nx,ny,4,3)){n.go=null;n.wt=.5;n.mv=0;return}
  if(P&&Math.hypot(P.x-nx,P.y-ny)<14){n.mv=0;return}
  n.x=nx;n.y=ny;n.wx=dx;n.wy=dy;n.mv=1;n.tx=nx>>4;n.ty=ny>>4}
{const u=update;update=function(dt){u(dt);
  if(G.mode!=='play'||!W||!W.npcs)return;
  for(const n of W.npcs)if(n.wander&&!(n.when&&!n.when()))wander(n,dt)}}

// ---- el pancho decorativo se ve en la pausa ----
{const op=openPause;openPause=function(){const r=op.apply(this,arguments);
  if(S&&S.pancho&&G.mode==='menu'){const c=$('menu').querySelector('.card');
   if(c){const ps=c.querySelectorAll('p'),p=ps[1]||ps[0];if(p&&!p.querySelector('.pan'))p.insertAdjacentHTML('beforeend','<span class="pan"> · Pancho (decorativo)</span>')}}
  return r}}
})();
