// ===== MANDO (PS4 por Bluetooth / Gamepad API) =====
// Se conecta solo: al pulsar cualquier botón del mando aparece el panel de controles.
// SHARE (o el panel táctil) vuelve a mostrar/ocultar la ayuda.
(()=>{
const ACT={0:'dodge',1:'act',2:'light',3:'heavy',5:'flask',7:'skill',6:'ult'};
const DIRS=[[12,'up'],[13,'down'],[14,'left'],[15,'right']];
let prev=[],dp={},usingJoy=false,gpOn=false,navT=0,lastDir=0,keep=null,helpT=0,lt=0;

// ---- panel de ayuda ----
const help=document.createElement('div');help.id='gpHelp';
const row=(k,c,t)=>'<div class="gr"><b style="color:'+c+'">'+k+'</b><span>'+t+'</span></div>';
help.innerHTML='<div class="gc"><h2>🎮 Mando conectado</h2><div class="gg">'
 +row('Stick izq. / Cruceta','#cfc6ff','Mover')
 +row('□','#e79bd6','Ataque ligero')
 +row('△','#5be0a8','Ataque pesado')
 +row('✕','#6c9fff','Esquivar')
 +row('○','#ff6b7a','Actuar / hablar')
 +row('L1','#ffd36a','Bloquear (mantener)')
 +row('R1','#ffd36a','Frasco')
 +row('R2','#ffd36a','Tajo de Onda')
 +row('L2','#ffd36a','Cólera del Juramento')
 +row('OPTIONS','#cfc6ff','Pausa')
 +row('SHARE','#cfc6ff','Ver / ocultar controles')
 +'</div><p>En menús: cruceta o stick para elegir, ✕ aceptar, ○ volver.</p><p class="gs">Pulsa un botón para cerrar</p></div>';
document.body.appendChild(help);
help.addEventListener('click',()=>hideHelp());
const isHelp=()=>help.classList.contains('on');
function showHelp(ms){help.classList.add('on');clearTimeout(helpT);if(ms)helpT=setTimeout(hideHelp,ms)}
function hideHelp(){help.classList.remove('on');clearTimeout(helpT)}

// ---- conexión ----
const getPad=()=>{const l=navigator.getGamepads?navigator.getGamepads():[];for(const p of l)if(p&&p.connected)return p;return null};
function on(){gpOn=true;document.body.classList.add('gp');showHelp(9000)}
function off(){gpOn=false;document.body.classList.remove('gp');hideHelp();clearOwn();if(window.relAll)relAll();prev=[]}
function clearOwn(){if(usingJoy){joy.on=false;joy.x=joy.y=0;usingJoy=false}for(const k in dp)if(dp[k]){dp[k]=false;held[k]=0}rel('block')}

// ---- menús ----
const vis=e=>e&&e.style.display&&e.style.display!=='none';
function menuNav(p,b,down,ay,dt){
 const c=vis($('dlg'))?$('dlg'):$('menu');
 const items=[...c.querySelectorAll('button,input')].filter(e=>e.offsetParent!==null&&!e.disabled);
 if(!items.length)return;
 let i=items.findIndex(e=>e.classList.contains('gpf'));
 if(i<0){i=keep&&performance.now()-keep.t<400?Math.min(keep.i,items.length-1):0}
 const mark=n=>{items.forEach(e=>e.classList.remove('gpf'));items[n].classList.add('gpf');try{items[n].scrollIntoView({block:'nearest'})}catch(e){}i=n};
 const dir=(b(12)||ay<-.5)?-1:(b(13)||ay>.5)?1:0;
 if(dir){
  if(dir!==lastDir){navT=.32;mark((i+dir+items.length)%items.length)}
  else{navT-=dt;if(navT<=0){navT=.12;mark((i+dir+items.length)%items.length)}}
 }else navT=0;
 lastDir=dir;
 if(!items[i].classList.contains('gpf'))mark(i);
 if(down(0)){const it=items[i];keep={i,t:performance.now()};if(it.tagName==='INPUT')it.focus();else it.click()}
 if(down(1)){const bk=items.find(e=>e.id==='go'||/^Volver$/.test((e.textContent||'').trim()));if(bk)bk.click()}
}

// ---- bucle de lectura ----
function poll(t){
 requestAnimationFrame(poll);
 const dt=lt?Math.min(.1,(t-lt)/1000):0;lt=t;
 const p=getPad();
 if(!p){if(gpOn)off();return}
 if(!gpOn)on();
 const b=i=>!!(p.buttons[i]&&p.buttons[i].pressed),down=i=>b(i)&&!prev[i];
 const save=()=>{prev=Array.from(p.buttons,x=>x.pressed)};
 const ax=p.axes[0]||0,ay=p.axes[1]||0;
 // ayuda: SHARE / panel táctil alternan; cualquier otro botón la cierra
 if(down(8)||down(17)){isHelp()?hideHelp():showHelp();save();return}
 if(isHelp()){if(p.buttons.some((x,i)=>x.pressed&&!prev[i])){hideHelp();save();return}}
 // pausa
 if(down(9)){
  if(G.mode==='play')openPause();
  else if(G.mode==='menu'){const h=$('menu').querySelector('h1');if(h&&h.textContent==='Pausa')closeM()}
 }
 const menu=vis($('menu'))||vis($('dlg'));
 if(menu){clearOwn();menuNav(p,b,down,ay,dt);save();return}
 lastDir=0;navT=0;
 // movimiento: stick analógico + cruceta
 const m=Math.hypot(ax,ay),dz=.25;
 if(m>dz){const k=Math.min(1,(m-dz)/(1-dz));joy.on=true;joy.x=ax/m*k;joy.y=ay/m*k;usingJoy=true}
 else if(usingJoy){joy.on=false;joy.x=joy.y=0;usingJoy=false}
 for(const [i,k] of DIRS){const v=b(i);if(v!==!!dp[k]){dp[k]=v;held[k]=v?1:0}}
 // acciones
 for(const i in ACT)if(down(+i))press(ACT[i]);
 if(b(4)!==!!prev[4])b(4)?press('block'):rel('block');
 save();
}
addEventListener('gamepadconnected',()=>{if(!gpOn&&getPad())on()});
addEventListener('gamepaddisconnected',()=>{if(!getPad())off()});
requestAnimationFrame(poll);
})();
