// ===== PODERES DE JURAMENTO: una habilidad exclusiva por juramento, se activa con la Cólera del Juramento =====
// Sin juramento equipado la Cólera funciona como siempre. Con uno equipado, además de la onda de choque se activa su poder durante 8 s,
// y el Ímpetu se carga un 50% más rápido. Se engancha sobre habilidades.js (startUlt, gain) y el motor (hitE, takeHit, drawP, hud).
(function(){
const DUR=8,IMP=1.5;
const PW={
 guardian:{n:'Égida del Guardián',c:'125,200,255',d:'Égida (8 s): recibes un 60% menos de daño y recuperas un 15% de vida.'},
 blood:{n:'Frenesí de Sangre',c:'255,80,100',d:'Frenesí (8 s): +35% de daño y recuperas como vida el 25% del daño que infliges.'},
 oblivion:{n:'Velo del Olvido',c:'200,150,255',d:'Velo (8 s): 2,5 s intangible; tu castigo desaparece y infliges un 30% más de daño que lo normal.'},
 lealtad:{n:'Voto de Lealtad',c:'255,214,110',d:'Voto (8 s): recuperas un 20% de vida y todo el aguante, y tu daño sube un 20%.'}};
const OP={k:null,t:0,m:DUR,inv:0,ft:0};window.OATHPOW=OP;
const live=()=>OP.t>0&&P&&S.oath===OP.k;
// descripciones en la hoguera
for(const k in PW)if(OATHS[k])OATHS[k][1]+=' Cólera: '+PW[k].d+' Cargas el Ímpetu un 50% más rápido.';
// Ímpetu más rápido con juramento
{const g0=gain;gain=function(n){return g0(S&&S.oath&&PW[S.oath]?n*IMP:n)}}
// activar el poder al lanzar la Cólera (solo si realmente se lanzó)
function healPct(f){const h=Math.round(P.mhp*f);P.hp=Math.min(P.mhp,P.hp+h);ftext(P.x,P.y-40,'+'+h,'#7dff9a');spark(P.x,P.y-10,'#7dff9a',14,12,.7)}
function activate(){const k=S.oath,p=PW[k];OP.k=k;OP.t=OP.m=DUR;OP.inv=k==='oblivion'?2.5:0;OP.ft=0;
 if(k==='guardian')healPct(.15);if(k==='lealtad'){healPct(.2);P.st=P.mst}
 toast(p.n);FX.push({k:'ring',x:P.x,y:P.y,l:.7,m:.7,c:p.c,big:1});spark(P.x,P.y-10,'#ffffff',20,16,1.2);sfx(300,.5,'sine',.06,900)}
{const s0=startUlt;startUlt=function(){const was=P.s,r=s0.apply(this,arguments);if(P.s==='ult'&&was!=='ult'&&S.oath&&PW[S.oath])activate();return r}}
// efectos sobre el daño que haces y el que recibes
{const h=hitE;hitE=function(e,d,k,v){
  if(!live()||!e)return h.call(this,e,d,k,v);
  const o=OP.k;if(o==='blood')d*=1.35;else if(o==='oblivion')d*=1.3/.85;else if(o==='lealtad')d*=1.2;
  const hp0=e.hp,r=h.call(this,e,d,k,v);
  if(o==='blood'){const dealt=hp0-e.hp;if(dealt>0&&P.s!=='dead'){const hl=Math.max(1,Math.round(dealt*.25));P.hp=Math.min(P.mhp,P.hp+hl);ftext(P.x,P.y-30,'+'+hl,'#7dff9a')}}
  return r}}
{const t=takeHit;takeHit=function(d,fx,fy){
  if(live()&&P.s!=='dead'){
   if(OP.k==='oblivion'&&OP.inv>0){if(TM-OP.ft>.5){OP.ft=TM;ftext(P.x,P.y-30,'Olvidado','#c9a0ff')}return}
   if(OP.k==='guardian')d*=.4}
  return t.call(this,d,fx,fy)}}
// temporizador (solo corre jugando)
{const u=update;update=function(dt){u(dt);
  if(OP.t>0&&G.mode==='play'){OP.t-=dt;if(OP.inv>0)OP.inv-=dt;if(P&&P.s==='dead')OP.t=0;if(OP.t<=0){OP.t=0;OP.inv=0;try{toast('Termina '+PW[OP.k].n)}catch(e){}}}}}
// aura alrededor del jugador
{const d0=drawP;drawP=function(){
  if(live()){const c=PW[OP.k].c,r=Math.round((22+4*Math.sin(TM*8))/4)*4;glow(P.x,P.y-10,r,c,.4);
   g.save();g.translate(P.x,P.y);g.scale(1,.5);g.strokeStyle='rgba('+c+','+(.5+.2*Math.sin(TM*6))+')';g.lineWidth=1.5;g.beginPath();g.arc(0,0,13,0,6.283);g.stroke();g.restore()}
  d0()}}
// barra de duración bajo el nombre del jugador
{const h0=hud;hud=function(){h0.apply(this,arguments);
  if(!live())return;if(window.CAIDA&&CAIDA.cut&&CAIDA.cut.hide)return;
  const p=PW[OP.k],w=Math.min(118,P.mst*.8)|0,x=32,y=67;fr(x-1,y-1,w+2,5,'#000');fr(x,y,w,3,'#1a1026');fr(x,y,Math.round(w*OP.t/OP.m),3,'rgb('+p.c+')');tx(p.n.toUpperCase(),x+w+6,y+3,'rgb('+p.c+')','left',5)}}
})();
