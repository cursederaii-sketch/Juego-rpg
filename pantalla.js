// ===== PANTALLA COMPLETA + HORIZONTAL =====
(()=>{
const el=document.documentElement,coarse=matchMedia('(pointer:coarse)').matches;
const can=!!(el.requestFullscreen||el.webkitRequestFullscreen);
const isFS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
async function enter(){
 try{const f=el.requestFullscreen||el.webkitRequestFullscreen;if(f)await f.call(el,{navigationUI:'hide'})}catch(e){}
 try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape')}catch(e){}
}
function exit(){
 try{const f=document.exitFullscreen||document.webkitExitFullscreen;if(f)f.call(document)}catch(e){}
 try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}
}
// botón junto a la pausa
if(can){
 const b=document.createElement('button');b.id='fs';b.setAttribute('aria-label','Pantalla completa');
 const ic=()=>{b.innerHTML=isFS()
  ?'<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>'
  :'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'};
 ic();$('stage').appendChild(b);
 b.addEventListener('click',()=>isFS()?exit():enter());
 b.addEventListener('touchstart',e=>e.stopPropagation());
 document.addEventListener('fullscreenchange',ic);document.addEventListener('webkitfullscreenchange',ic);
}
// en móvil/tablet: entra en pantalla completa con el primer toque (una sola vez)
if(can&&coarse){
 let done=0;
 addEventListener('pointerup',()=>{if(done||isFS())return;done=1;enter()},true);
}
// aviso "gira el dispositivo": tocarlo intenta bloquear horizontal
const rot=$('rot');if(rot)rot.addEventListener('click',()=>{if(can)enter()});
// si se pone en vertical jugando, pausa
const por=matchMedia('(orientation:portrait) and (pointer:coarse)');
const chk=()=>{if(por.matches&&G.mode==='play')openPause()};
(por.addEventListener?por.addEventListener('change',chk):por.addListener(chk));
})();
