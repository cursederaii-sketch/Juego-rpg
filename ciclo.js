// ===== CICLO: día y noche reales + efectos de sol, nubes, pájaros y luciérnagas =====
// El reino ya no está siempre de noche: un reloj (S.clk, 0..1) recorre amanecer → día → atardecer → noche.
// Solo afecta a regiones exteriores (out:1); criptas y salas del trono conservan su penumbra. El Jardín Derruido es siempre de día.
// S.night se mantiene sincronizado con el reloj, así que PNJ nocturnos, textos y "Esperar" siguen funcionando.
(function(){
const DAY=420;                                   // segundos por ciclo completo
const KEYS=[[0,[255,172,128],.20],[.07,[255,238,205],.07],[.50,[255,242,210],.04],[.58,[255,150,92],.20],[.66,[44,30,96],.55],[.73,[4,6,32],.84],[.93,[4,6,32],.84],[1,[255,172,128],.20]];
const lerp=(a,b,t)=>a+(b-a)*t,cl01=v=>v<0?0:v>1?1:v;
function sky(t){let i=0;while(i<KEYS.length-2&&t>=KEYS[i+1][0])i++;const A=KEYS[i],B=KEYS[i+1],k=cl01((t-A[0])/(B[0]-A[0])),s=k*k*(3-2*k);
 const rgb=[0,1,2].map(j=>Math.round(lerp(A[1][j],B[1][j],s))),al=lerp(A[2],B[2],s);return{rgb,al,d:cl01((.84-al)/.8)}}
const clk=()=>{if(S.clk==null)S.clk=S.night?.8:.2;return S.clk};
window.skyD=()=>(rg&&rg.day)?1:sky(clk()).d;
// ambiente exterior: mezcla el cielo con el color propio de cada región para no perder su identidad
window.skyAmb=a=>{const c=sky(clk()),d=c.d,th=[a[0],a[1],a[2]],m=.22*d;
 return{rgb:[0,1,2].map(j=>Math.round(lerp(c.rgb[j],th[j],m))).join(','),al:c.al+a[3]*.12*d}};
// ---- reloj ----
const _up=update;let lastN=null;
update=function(dt){_up(dt);if(!S||!W||G.mode==='title')return;
 if(G.mode==='play')S.clk=(clk()+dt/DAY)%1;
 const n=sky(clk()).d<.35?1:0;if(S.night!==n){S.night=n;if(lastN!==null&&G.mode==='play'&&rg&&rg.out&&!rg.day)toast(n?'Cae la noche sobre el reino':'Amanece');}
 lastN=n};
// esperar en la hoguera salta a la siguiente fase
const _wt=waitTime;waitTime=function(){_wt();S.clk=S.night?.70:.03};
// ---- sprites cacheados ----
let RAY=null,CLOUD=null;
const raySpr=()=>RAY||(RAY=(()=>{const wd=34,c=mkc(wd,GH),x=c.getContext('2d'),q=x.createLinearGradient(0,0,wd,0);q.addColorStop(0,'rgba(255,255,255,0)');q.addColorStop(.5,'rgba(255,255,255,1)');q.addColorStop(1,'rgba(255,255,255,0)');
 x.fillStyle=q;x.beginPath();x.moveTo(0,0);x.lineTo(wd,0);x.lineTo(wd-70,GH);x.lineTo(-70,GH);x.closePath();x.fill();
 const f=x.createLinearGradient(0,0,0,GH);x.globalCompositeOperation='destination-in';f.addColorStop(0,'rgba(0,0,0,1)');f.addColorStop(1,'rgba(0,0,0,.15)');x.fillStyle=f;x.fillRect(0,0,wd,GH);return c})());
const cloudSpr=()=>CLOUD||(CLOUD=(()=>{const c=mkc(120,56),x=c.getContext('2d');
 for(const[cx,cy,r]of[[34,30,22],[58,24,24],[82,30,20],[50,38,18],[72,38,17],[96,34,12]]){const q=x.createRadialGradient(cx,cy,0,cx,cy,r);q.addColorStop(0,'rgba(10,14,40,.55)');q.addColorStop(1,'rgba(10,14,40,0)');x.fillStyle=q;x.fillRect(cx-r,cy-r,r*2,r*2)}return c})());
const rnd=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const wrap=(v,m)=>((v%m)+m)%m;
// ---- efectos dentro del bucle de iluminación ----
const _li=lighting;lighting=function(L){_li(L);
 if(!rg||!rg.out&&!rg.day)return;const lv=PERF.lv,t=clk(),c=sky(t),d=rg.day?1:c.d,n=1-d,rgb=rg.day?[255,238,200]:c.rgb,rs=rgb.join(',');
 g.save();
 // resplandor del sol: cruza la parte alta de la pantalla de izquierda a derecha durante el día
 if(d>.08){const p=cl01((t-.0)/.6),sx=-40+(GW+80)*p,gl=d*d;glow(sx,-8,150,rs,.34*gl);glow(sx,-8,60,'255,250,225',.30*gl);
  if(lv<2){for(const[k,r,a]of[[.28,9,.07],[.5,15,.05],[.74,8,.07],[1,22,.04]])glow(sx+(GW/2-sx)*k,-8+(GH/2+8)*k,r,rs,a*gl)}}
 // rayos de luz que se desplazan lentamente
 if(d>.2&&lv<1){g.globalCompositeOperation='lighter';const sw=GW+180;for(let i=0;i<5;i++){const bx=wrap(i*104+TM*5-cam.x*.3,sw)-90;g.globalAlpha=.075*d*(.6+.4*Math.sin(TM*.6+i*1.3));g.fillStyle='#fff';
   g.drawImage(tint1(raySpr(),rs),Math.round(bx),0)}g.globalAlpha=1;g.globalCompositeOperation='source-over'}
 // sombras de nubes sobre el suelo
 if(d>.25&&lv<2){g.globalAlpha=.34*d;const sp=cloudSpr();for(let i=0;i<4;i++){const x=wrap(i*171+TM*(6+i*2.2)-cam.x,GW+300)-150,y=wrap(i*97+TM*1.5-cam.y,GH+160)-80;g.drawImage(sp,0,0,120,56,Math.round(x-60),Math.round(y-28),240,112)}g.globalAlpha=1}
 // bandada de pájaros que cruza de vez en cuando
 if(d>.6&&lv<2){const u=(TM%48)/13;if(u<1){for(let i=0;i<6;i++){const bx=-20+(GW+60)*u-i*9+(i&1)*4,by=48+i*8+(i&1)*5+Math.sin(TM*2+i)*3,f=((TM*9+i)|0)&1;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(Math.round(bx)-2,Math.round(by)+f,2,1);g.fillRect(Math.round(bx),Math.round(by)+1-f,1,1);g.fillRect(Math.round(bx)+1,Math.round(by)+f,2,1)}}}
 // noche: luz de luna y luciérnagas
 if(n>.3){glow(GW-70,-10,150,'150,175,255',.16*n);
  if(lv<2&&W.th.grass){const N=18;for(let i=0;i<N;i++){const bx=wrap(rnd(i)*(GW+80)+Math.sin(TM*.4+i)*18-cam.x,GW+80)-40,by=wrap(rnd(i+50)*(GH+60)+Math.cos(TM*.5+i*1.7)*12-cam.y,GH+60)-30,bl=.5+.5*Math.sin(TM*2.2+i*3.1);
    if(bl>.15){glow(bx,by,7,'205,255,120',.5*bl*n);g.fillStyle='rgba(235,255,170,'+(.9*bl*n)+')';g.fillRect(Math.round(bx),Math.round(by),1,1)}}}}
 // polen y motas de luz durante el día
 else if(d>.5&&lv<2){for(let i=0;i<14;i++){const bx=wrap(rnd(i+9)*(GW+60)+TM*(4+rnd(i)*5)-cam.x,GW+60)-30,by=wrap(rnd(i+70)*(GH+40)+Math.sin(TM*.8+i*2)*8-cam.y*.9,GH+40)-20;g.fillStyle='rgba(255,246,190,'+(.35+.25*Math.sin(TM*2+i))*d+')';g.fillRect(Math.round(bx),Math.round(by),1,1)}}
 g.restore()};
// tiñe un sprite blanco con el color del cielo (cacheado por color)
const TC={};function tint1(sp,rs){const k=rs;if(TC[k])return TC[k];const c=mkc(sp.width,sp.height),x=c.getContext('2d');x.drawImage(sp,0,0);x.globalCompositeOperation='source-in';x.fillStyle='rgb('+rs+')';x.fillRect(0,0,c.width,c.height);return TC[k]=c}
// ---- reloj solar en el HUD ----
const _dr=draw;draw=function(){_dr.apply(this,arguments);
 if(!W||!P||G.mode==='title'||G.mode==='end'||window.__cine)return;const t=clk(),c=sky(rg.day?.3:t),day=(rg.day||c.d>=.35);
 const x0=GW-108,y0=6,w=36,h=29;uiPanel(x0,y0,w,h,.82);const cx=x0+w/2,cy=y0+21,r=13;
 for(let i=0;i<=12;i++){const a=Math.PI*i/12;fr(cx-Math.cos(a)*r,cy-Math.sin(a)*r,1,1,i%3?'rgba(201,165,74,.35)':'rgba(255,233,160,.8)')}fr(cx-r-1,cy+1,r*2+3,1,'rgba(201,165,74,.5)');
 const pr=rg.day?.35:day?cl01(t/.6):cl01(wrap(t-.66,1)/.36),a=Math.PI*pr,sx=cx-Math.cos(a)*r,sy=cy-Math.sin(a)*r;
 if(day){glow(sx,sy,8,'255,220,120',.5);g.fillStyle='#ffd24a';g.fillRect(Math.round(sx)-1,Math.round(sy)-1,3,3);fr(sx,sy-3,1,1,'#ffe9a0');fr(sx,sy+3,1,1,'#ffe9a0');fr(sx-3,sy,1,1,'#ffe9a0');fr(sx+3,sy,1,1,'#ffe9a0')}
 else{glow(sx,sy,8,'160,180,255',.4);g.fillStyle='#dfe6ff';g.fillRect(Math.round(sx)-1,Math.round(sy)-2,3,5);g.fillRect(Math.round(sx)-2,Math.round(sy)-1,5,3);g.fillStyle='#2a2f5a';g.fillRect(Math.round(sx),Math.round(sy)-1,2,3)}
 const hr=(5.5+t*24)%24,hh=Math.floor(hr),mm=Math.floor((hr-hh)*60/10)*10;tx((hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm,cx,y0+27,rg.day?'#ffe9a0':'#a89cc8','center',5)};
})();
