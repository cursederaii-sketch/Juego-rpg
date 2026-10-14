// ===== EL REY POR FASES: barra de jefe propia + sprites distintos en cada fase =====
// Se carga después de caida.js. No modifica la lógica del combate: solo engancha hud(), body() y bakeBody().
//   Fase I   (100–75 %)  Rey con su aspecto original.
//   Fase III (75–35 %)   Rey herido: capa raída, ropa apagada, corona agrietada, grietas de brasa en el pecho.
//   Fase IV  (35–0 %)    Rey desatado: violeta, capa ensanchada, corona rota, grietas luminosas y aura.
(function(){
const lerp=(a,b,t)=>a+(b-a)*t;
const hx=c=>[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];

// ---------- 1. kits de sprite por fase (se hornean con el mismo bakeBody de cuerpos.js) ----------
if(typeof KITS==='undefined'||!KITS.rey)return;
KITS.rey1=Object.assign({},KITS.rey,{reyPh:1,
 A:['#2a1230','#42204f','#140a1c'],cape:'#2e1230',capeE:'#8a5a2a',trim:'#8a5a2a',buckle:'#8a5a2a',
 ermine:'#b0a4b8',eye:'#ff9a4d',belt:'#3a2a10'});
KITS.rey2=Object.assign({},KITS.rey,{reyPh:2,flare:3,
 A:['#2a0f3e','#4d1a72','#12061c'],hc:['#160a24','#2c1648','#0a0412'],
 cape:'#1c0a30',capeE:'#b05cff',trim:'#b05cff',buckle:'#d09aff',
 ermine:'#8a6ac0',eye:'#e8d0ff',belt:'#2a1048'});

// ---------- 2. retoque del sprite horneado: corona + grietas ----------
// La corona usa colores fijos del dibujo base (oro y rubí); se localiza por color dentro de la franja superior del sprite.
const CROWN={
 1:{gold:[176,138,58],gem:[255,154,77],crack:[42,26,12]},
 2:{gold:[160,112,224],gem:[255,255,255],crack:[36,18,64],stub:[26,12,40]}};
const CRACK1=[[0,0],[1,1],[1,2],[2,3],[2,4],[3,5],[3,6],[4,7]];
const CRACK2=[[0,0],[-1,1],[-1,2],[0,3],[0,4],[-1,5]];
const CRACK3=[[0,0],[1,1],[2,1],[2,2],[3,3]];
function decor(c,ph){
 const W=c.width,H=c.height,x=c.getContext('2d'),im=x.getImageData(0,0,W,H),d=im.data,cx=W>>1,cf=CROWN[ph];
 let minY=H;
 for(let Y=0;Y<H&&minY===H;Y++)for(let X=0;X<W;X++)if(d[(Y*W+X)*4+3]>0){minY=Y;break}
 if(minY===H)return c;
 const band=minY+7;
 for(let Y=minY;Y<=band&&Y<H;Y++)for(let X=0;X<W;X++){
  const i=(Y*W+X)*4;if(d[i+3]<200)continue;
  const r=d[i],g_=d[i+1],b=d[i+2];
  const gold=r>=150&&g_>=110&&b<=130&&r-b>=70&&g_-b>=30,gem=r>=190&&g_<=130&&r-g_>=90;
  let col=null;
  if(gem)col=cf.gem;
  else if(gold){
   const f=((r+g_+b)/3)/164;col=[Math.min(255,cf.gold[0]*f),Math.min(255,cf.gold[1]*f),Math.min(255,cf.gold[2]*f)];
   if(X===cx&&Y>=minY+3)col=cf.crack;                                   // grieta central de la corona
   if(ph===2&&Y<=minY+2&&X>cx+1)col=cf.stub;                            // púas de la derecha rotas
  }
  if(col){d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2]}
 }
 x.putImageData(im,0,0);
 // grietas luminosas sobre el torso (solo se pintan sobre píxeles del sprite)
 const t0=minY+13,P=(arr,ox,oy,col)=>{x.fillStyle=col;for(const[a,b]of arr)x.fillRect(ox+a,oy+b,1,1)};
 x.save();x.globalCompositeOperation='source-atop';
 if(ph===1){P(CRACK1,cx-5,t0,'#ffa040');P(CRACK3,cx+2,t0+5,'#ffb858')}
 else{P(CRACK1,cx-5,t0,'#d9a8ff');P(CRACK2,cx+3,t0+1,'#d9a8ff');P(CRACK3,cx-1,t0+7,'#d9a8ff');
  P([[2,3],[3,5]],cx-5,t0,'#ffffff');P([[0,2]],cx+3,t0+1,'#ffffff')}
 x.restore();
 return c}
{const bb=bakeBody;bakeBody=function(k,dir,pose,fr){const c=bb.apply(this,arguments);
 if(k&&k.reyPh&&dir!=='u'){try{return decor(c,k.reyPh)}catch(e){if(!bakeBody.err){bakeBody.err=1;console.error(e)}}}
 return c}}
// los sprites del Rey ya horneados se descartan por si algún script los creó antes
for(const k in ART)if(k.startsWith('brey'))delete ART[k];

// ---------- 3. body(): usa la variante según la fase del Rey (también en la cinemática) ----------
{const b0=body;body=function(id,x,y,fx,fy,pose,fr_,o){
 if(id==='rey'){const e=E.find(q=>q.id==='rey'&&q.b),ph=e?(e.ph|0):0;
  if(ph>=1){
   if(ph>=2&&e.s!=='dead'&&!(o&&o.rot))glow(x,y-16,32,'176,92,255',.16+.06*Math.sin(TM*5));
   id=ph>=2?'rey2':'rey1'}}
 return b0.call(this,id,x,y,fx,fy,pose,fr_,o)}}

// ---------- 4. barra de vida del Rey ----------
const PC=[['#e0344c','#6a0e20','224,52,76','#f0e6ff'],['#ff9a3c','#7a2a08','255,154,60','#ffd9a8'],['#b05cff','#3c1070','176,92,255','#e8d0ff']];
const PL=['FASE I · EL SALÓN','FASE III · EL CRÁTER','FASE IV · EL JURAMENTO'];
const BAR={e:null,gh:0,ph:0,fl:0,lt:null};
function pip(cx,cy,col){fr(cx,cy-2,1,5,col);fr(cx-2,cy,5,1,col);fr(cx-1,cy-1,3,3,col)}
function reyBar(b){
 const dt=BAR.lt==null?0:Math.min(.1,Math.max(0,TM-BAR.lt));BAR.lt=TM;
 const ph=Math.min(2,b.ph|0),r=b.hp/b.mhp;
 if(BAR.e!==b){BAR.e=b;BAR.gh=b.hp;BAR.ph=ph;BAR.fl=0}
 if(ph!==BAR.ph){BAR.ph=ph;BAR.fl=.9}
 BAR.fl=Math.max(0,BAR.fl-dt);
 if(b.hp>BAR.gh)BAR.gh=b.hp;else BAR.gh=Math.max(b.hp,BAR.gh-b.mhp*.25*dt);
 const c=PC[ph],w=280,x=GW/2-w/2,y=GH-20,px=GW/2-160,py=GH-46,flash=BAR.fl>0&&Math.floor(TM*20)%2;
 uiPanel(px,py,320,40,.82);
 if(BAR.fl>0)glow(GW/2,GH-26,120,c[2],BAR.fl*.35);
 // pips de fase
 for(let i=0;i<3;i++)pip(px+9+i*8,GH-33,i<=ph?'rgb('+PC[i][2]+')':'#3a2a44');
 const sh=BAR.fl>0?Math.round(Math.sin(TM*60)*1.5):0;
 tx(b.b&&b.b.n||'El Rey',GW/2+sh,GH-33,c[3],'center',8);
 tx(PL[ph],GW/2,GH-25,'rgb('+c[2]+')','center',5);
 const pulse=ph===2&&r<.1&&Math.floor(TM*6)%2;
 uiBar(x,y,w,6,r,BAR.gh/b.mhp,c[0],c[1],0,flash||pulse);
 // marcas de cambio de fase (75 % y 35 %): se apagan al cruzarlas
 for(const t of[.75,.35]){const nx=Math.round(x+w*t),done=r<t,col=done?'#5a4a3a':'#ffe9a0';
  fr(nx,y-4,1,14,'#000');fr(nx,y-3,1,12,col);fr(nx-1,y-4,3,1,col);fr(nx-1,y+9,3,1,col)}}

{const h=hud;hud=function(){
 let b=null,sv;
 try{b=E.find(e=>e.b&&e.id==='rey'&&e.s!=='dead'&&e.aw)}catch(e){}
 const CA=window.CAIDA,hidden=(CA&&CA.cut&&CA.cut.hide)||(typeof BI!=='undefined'&&BI&&BI.on);
 if(b&&!hidden){sv=b.aw;b.aw=false}                    // la barra genérica no se dibuja; la sustituye reyBar
 try{h.apply(this,arguments)}finally{if(sv!==undefined)b.aw=sv}
 if(b&&!hidden&&!(CA&&CA.cut)){try{reyBar(b)}catch(er){if(!reyBar.err){reyBar.err=1;console.error(er)}}}}}
})();
