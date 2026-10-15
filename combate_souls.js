// ===== COMBATE SOULSLIKE · motor (lee los parámetros de DIF en dificultad.js) =====
// Capa por envoltorios (mismo estilo que ia.js): NO reemplaza funciones, solo las envuelve. Con DIF.on=0 no se instala nada.
// Cargar DESPUÉS de ia.js, habilidades.js, juramentos.js, caida.js y render.js (envuelve updE, mk, spawnEn, hurtP, takeHit, update, drawE).
// Qué hace:
//  1) Muerte/almas: el depósito nunca queda en una grieta/muro; avisa al perder el depósito anterior; sanea partidas antiguas.
//  2) Curación con riesgo: un golpe mientras bebes (antes de curar) hace más daño (DIF.flaskPunish).
//  3) IA normal: secuencias rápido↔lento (DIF.pat), tope de atacantes simultáneos, castigo con retardo humano a errores del jugador,
//     recuperación extra si el ataque FALLA (o se esquiva), arqueros que presionan al jugador quieto, margen al nacer despierto.
//  4) Élites por parámetros (DIF.elite) y combos con pausa para élites y jefes (DIF.boss / comboWind / comboK).
//  5) Lectura moderada del jugador por parte de los jefes (DIF.read): solo reacciona a lo YA ocurrido.
//  6) Golpes de área (aoe) y embestidas (charge) con telegráfico visible.
(function(){
if(typeof DIF==='undefined'||!DIF.on)return;
const rnd=(a,b)=>a+R()*(b-a);
DIF.applyPh(); // caida.js redefine las fases del Rey: se reponen aquí los ataques nuevos (quake/charge)
// ---------- observación del jugador (solo pasado) ----------
const C={ps:'',lt:[],dd:[],still:0,t:0,hv:false,ex:false};
function err(range,rad){ // el jugador cometió un error: los enemigos cercanos reaccionan tras un retardo humano
 for(const e of E){if(e.s==='dead'||!e.aw||e.s!=='walk')continue;
  const bs=!!e.b,d=Math.hypot(P.x-e.x,P.y-e.y);
  if(d<(bs?DIF.punishRBoss:DIF.punishR)){e.pun=rnd.apply(null,bs?DIF.reactBoss:DIF.react)}}}
function watch(dt){
 if(!P||G.mode!=='play')return;
 C.t+=dt;const s=P.s;
 if(s!==C.ps){if(s==='light')C.lt.push(C.t);if(s==='dodge')C.dd.push(C.t);if(s==='flask')err();C.ps=s}
 const H=WPN().h;
 if(s==='heavy'&&!P.hd&&P.t>H.a[1]){if(!C.hv){C.hv=true;err()}}else if(s!=='heavy')C.hv=false;
 if(P.ex>0){if(!C.ex){C.ex=true;err()}}else C.ex=false;
 C.still=(s==='idle'&&!P.mvg&&!held.block)?C.still+dt:0;
 while(C.lt.length&&C.t-C.lt[0]>6)C.lt.shift();while(C.dd.length&&C.t-C.dd[0]>6)C.dd.shift()}
const cnt=(a,w)=>a.filter(t=>C.t-t<=w).length;

// ---------- depósito de almas ----------
function fixDrop(had){
 const d=S.drop;if(!d||d===had)return;
 // si murió sobre una grieta/muro (caída), el depósito va a la última posición segura para que sea recuperable
 let bad=false;try{bad=!W.ok(d.x>>4,d.y>>4)||W.hit(d.x,d.y,3,3)||W.chasmAt(d.x,d.y)}catch(_){}
 if(bad&&P&&P.safe){d.x=P.safe.x;d.y=P.safe.y}
 if(had&&had.s>0)toast('Las almas que no recuperaste se perdieron para siempre')}
{const t0=takeHit;takeHit=function(d,fx,fy){const had=S.drop,was=P&&P.s==='dead';t0.call(this,d,fx,fy);if(P&&P.s==='dead'&&!was)fixDrop(had)}}
// curarse en mal momento: daño extra si te golpean mientras bebes (antes de que cure) + marca de esquiva para castigar el fallo
{const h0=hurtP;hurtP=function(d,e){
 if(e&&!e.proj)e.dod=dodging();
 if(P.s==='flask'&&!P.hd&&!e.proj)d=Math.round(d*DIF.flaskPunish);
 return h0.call(this,d,e)}}

// ---------- creación de enemigos: presión de daño ligada al escalado regional (una sola vez) ----------
{const m0=mk;mk=function(t,x,y,id){const e=m0.call(this,t,x,y,id);
 if(!e.b){const o=(DIF.region&&rg&&DIF.region[rg.id])||{},pr=o.press!==undefined?o.press:DIF.press;
  e.dm*=1+pr*cl((rg.m-1)/DIF.pressRamp,0,1)}
 return e}}
// élites: se tiran una vez por zona al poblarla (no en oleadas/emboscadas/invocados)
{const s0=spawnEn;spawnEn=function(){s0.apply(this,arguments);const q=DIF.elite;if(!q||!rg||rg.m<q.minM)return;
 for(const e of E){if(e.b||!q.types.includes(e.t)||R()>=q.chance)continue;
  e.el=1;e.mhp=e.hp=Math.round(e.mhp*q.hp);e.dm*=q.dm;e.so=Math.round(e.so*q.so)}}}

// ---------- IA ----------
function born(e){ // un enemigo que nace despierto no aparece encima del jugador y tarda en atacar
 if(e.b||!e.aw||!P)return;e.grace=DIF.spawnGrace;
 const d=Math.hypot(P.x-e.x,P.y-e.y);if(d>=DIF.spawnSafe)return;
 const base=d>.5?Math.atan2(e.y-P.y,e.x-P.x):R()*6.283;
 for(const r of[DIF.spawnSafe+2,DIF.spawnSafe+14])for(let k=0;k<16;k++){const a=base+((k+1)>>1)*.4*(k%2?1:-1),nx=P.x+Math.cos(a)*r,ny=P.y+Math.sin(a)*r;
  if(W.ok(nx>>4,ny>>4)&&!W.hit(nx,ny,e.hw,e.hh)){e.x=nx;e.y=ny;return}}}
const from=(list,prefs)=>prefs.find(p=>list.includes(p));
function readP(e,dist,dt){ // lectura moderada: castiga patrones repetidos ya vistos (nunca inputs futuros)
 const Rd=DIF.read;if(!Rd||!Rd.on||e.cmb||C.t-(e.rdT||-99)<Rd.cool)return;
 const list=e.b.ph[e.ph].a;let nk=null,why='';
 if(cnt(C.lt,Rd.lightWin)>=Rd.lightSpam&&dist<70){nk=from(list,['bov','bsl','quake','smash']);why='luz'}
 else if(cnt(C.dd,Rd.dodgeWin)>=Rd.dodgeSpam){nk=from(list,['bstab','pounce','arrow','cinder']);why='esq';e.dly=.28} // golpe retardado: castiga esquivar demasiado pronto
 else{e.farT=dist>Rd.far?(e.farT||0)+dt:0;if(e.farT>Rd.farT){nk=from(list,['pounce','charge','arrow','cinder','blink']);why='lejos';e.farT=0}}
 if(!nk||!ATK[nk]){e.dly=0;return}
 e.nk=nk;e.cd=Math.min(e.cd,Rd.delay);e.rdT=C.t;ftext(e.x,e.y-e.b.h-14,'...','#ff9a9a')}
function pre(e,dt){
 if(!e.bn){e.bn=1;born(e)}
 if(e.grace>0){e.grace-=dt;if(e.s==='walk')e.cd=Math.max(e.cd,.12)}
 if(e.s==='dead'||!e.aw||!P||P.s==='dead')return;
 const b=e.b,dx=P.x-e.x,dy=P.y-e.y,dist=Math.hypot(dx,dy)||1,ux=dx/dist,uy=dy/dist;
 if(e.pun>0){e.pun-=dt;if(e.pun<=0&&e.s==='walk'&&dist<(b?DIF.punishRBoss:DIF.punishR)*1.6)e.cd=0} // castigo al error, con retardo humano
 e.sgd=0;
 if(e.s!=='walk')return;
 if(b){readP(e,dist,dt);return}
 const pat=DIF.pat[e.t];
 if(pat&&!e.nk)e.nk=pat[(e.pq||0)%pat.length];
 if(e.cd<=0){ // tope de atacantes simultáneos: el resto espera su turno
  const sh=e.t==='archer';let n=0;for(const o of E)if(o!==e&&o.aw&&!o.b&&(o.s==='wind'||o.s==='act')&&(o.t==='archer')===sh)n++;
  if(n>=(sh?DIF.maxShoot:DIF.maxAtk))e.cd=.2+R()*.25}
 if(e.t==='archer'){const A=DIF.archer;
  if(C.still>=A.still&&e.cd>A.fast&&dist<150)e.cd=A.fast; // jugador inmóvil → presión
  if(dist>=60&&dist<=110&&e.cd>0){ // reposicionarse en vez de quedarse plantado
   const sp=TY.archer.sp*(G.chase?1.2:1);e.sg=e.sg||(R()<.5?1:-1);e.sgT=(e.sgT||0)-dt;if(e.sgT<=0){e.sgT=rnd(1.2,2.2);e.sg=-e.sg}
   W.move(e,-uy*e.sg*sp*A.strafe*dt,ux*e.sg*sp*A.strafe*dt,e.hw,e.hh);e.sgd=1}}}
function comboCfg(e){
 if(e.b){const t=DIF.boss[e.id];if(t)return t[Math.min(e.ph||0,t.length-1)];
  const q=DIF.bossDef[Math.min(e.ph||0,DIF.bossDef.length-1)],l=(e.b.ph[e.ph||0].a||[]).filter(k=>ATK[k]&&!ATK[k].tp);return l.length?{c:q.c,n:q.n,p:q.p,nx:l}:null}
 if(e.el){const q=DIF.elite;return{c:q.c,n:1,nx:q.nx[e.t]||[],p:q.p}}return null}
{const u0=updE;updE=function(e,dt){
 pre(e,dt);const s0=e.s;u0.call(this,e,dt);
 if(e.s==='dead'||!P)return;
 if(e.sgd)e.mvg=1;
 const b=e.b;
 if(s0==='walk'&&e.s==='wind'){ // empieza un ataque
  if(!b&&DIF.pat[e.t])e.pq=(e.pq||0)+1;
  e.dod=false;
  if(e.dly){e.wt+=e.dly;e.dly=0}
  if(e.el)e.wt=Math.max(.3,e.wt*DIF.elite.wind)}
 if(s0==='act'&&e.s==='rec'&&e.cur){ // termina un ataque
  const miss=!e.cur.proj&&(!e.hd||e.dod);
  if(miss)e.tm=-e.cur.r*(b?DIF.failRecBoss:(DIF.failRecBy[e.t]!==undefined?DIF.failRecBy[e.t]:DIF.failRec)); // recuperación extra: ventana de contraataque
  if(e.cmb&&e.cmb.fu)e.cmb.fu=false;
  else if(!e.cmb){const q=comboCfg(e);if(q&&q.c>0&&q.nx&&q.nx.length&&R()<q.c)e.cmb={n:q.n,nx:q.nx,p:q.p,fu:false}}}
 if(e.s==='stg')e.cmb=null; // parada/aturdimiento: el combo se rompe
 if(s0==='rec'&&e.s==='walk'&&e.cmb){ // fin de la recuperación: seguimiento rápido o pausa final del combo
  const q=e.cmb,dx=P.x-e.x,dy=P.y-e.y,dist=Math.hypot(dx,dy)||1;
  const at=q.n>0&&P.s!=='dead'?ATK[q.nx[Math.floor(R()*q.nx.length)]]:null;
  if(at&&(at.proj||dist<at.sd*1.4)){q.n--;q.fu=true;e.cur=at;e.nk=null;e.s='wind';e.tm=0;e.wt=Math.max(DIF.comboWind,at.w*DIF.comboK);e.ax=dx/dist;e.ay=dy/dist;e.hd=false;e.dod=false}
  else{e.cd+=q.p;e.cmb=null}}
 // golpe de área: alcanza en círculo (sin importar hacia dónde mire)
 if(e.s==='act'&&e.cur&&e.cur.aoe&&!e.hd&&P.s!=='dead'){
  if(Math.hypot(P.x-e.x,P.y-e.y)<e.cur.rng+7){e.hd=true;hurtP(Math.round(e.cur.d*e.dm),e)}}}}

// ---------- fases/estado ----------
{const up=update;update=function(dt){
 if(S&&S.drop&&!(isFinite(S.drop.x)&&isFinite(S.drop.y)&&S.drop.s>0&&S.drop.r>=0))S.drop=null; // partidas antiguas/corruptas
 watch(dt);return up.call(this,dt)}}

// ---------- telegráficos (área, embestida) y marca de élite ----------
{const d0=drawE;drawE=function(e){
 if(e.s!=='dead'){
  if(e.el){glow(e.x,e.y-10,15,'255,210,90',.22)}
  const c=e.cur;
  if(e.s==='wind'&&c&&(c.aoe||c.mv>=200)){
   const q=Math.min(1,e.tm/e.wt),ax=e.ax!==undefined?e.ax:e.fx,ay=e.ay!==undefined?e.ay:e.fy;
   g.save();g.translate(e.x,e.y);
   if(c.aoe){const r=c.rng+6;g.fillStyle='rgba(255,70,60,'+(.07+.22*q)+')';g.beginPath();g.arc(0,0,r,0,6.283);g.fill();g.strokeStyle='rgba(255,150,120,'+(.35+.4*q)+')';g.lineWidth=1;g.beginPath();g.arc(0,0,r*q,0,6.283);g.stroke()}
   else{g.rotate(Math.atan2(ay,ax));const L=c.mv*c.a+c.rng;g.fillStyle='rgba(255,70,60,'+(.07+.22*q)+')';g.fillRect(0,-7,L,14);g.fillStyle='rgba(255,150,120,'+(.3+.4*q)+')';g.fillRect(0,-7,L*q,14)}
   g.restore()}}
 d0.call(this,e);
 if(e.el&&e.s!=='dead'){const d=TY[e.t];fr(e.x-3,e.y-(d?d.h:22)-14,6,2,'#ffd45c')}}}
})();
