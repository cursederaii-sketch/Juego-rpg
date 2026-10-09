// ===== INICIO: título, ajustes, pausa, controles táctiles y bucle principal =====
function applyCfg(){
 const d=document.documentElement.style,b=document.body.classList;
 d.setProperty('--ts',CFG.tsize);d.setProperty('--to',CFG.topac/100);
 const touch=CFG.touch==='on'||(CFG.touch==='auto'&&(('ontouchstart' in window)||(window.matchMedia&&matchMedia('(pointer:coarse)').matches)));
 b.toggle('lefty',!!CFG.lefty);b.toggle('notouch',!touch);b.toggle('crt',!!CFG.crt);
 cv.style.imageRendering=CFG.smooth?'auto':'pixelated';
}
const setC=(k,v)=>{CFG[k]=+v;saveCfg();applyCfg()};
let setFrom='title';
function openSettings(from){
 if(from)setFrom=from;G.mode=G.mode==='play'?'menu':G.mode;const m=$('menu'),sc=m.scrollTop;m.style.display='flex';
 const sl=(t,k,a,b,s)=>'<h2>'+t+' <span class="hint">'+CFG[k]+'</span></h2><input type="range" min="'+a+'" max="'+b+'" step="'+s+'" value="'+CFG[k]+'" oninput="setC(\''+k+'\',this.value);this.previousElementSibling.lastChild.textContent=this.value">';
 const tg=(t,k)=>'<button class="oath'+(CFG[k]?' sel':'')+'" onclick="CFG[\''+k+'\']=CFG[\''+k+'\']?0:1;saveCfg();applyCfg();openSettings()"><b>'+t+'</b>'+(CFG[k]?'Activado':'Desactivado')+'</button>';
 const tl={auto:'Automático',on:'Siempre visibles',off:'Ocultos (teclado)'};
 m.innerHTML='<div class="card"><h1 style="font-size:24px">Ajustes</h1>'
  +sl('Volumen general','master',0,100,5)+sl('Efectos','sfx',0,100,5)+sl('Sacudida de cámara','shake',0,1,.25)
  +'<h2>Controles</h2><button class="oath" onclick="CFG.touch=CFG.touch===\'auto\'?\'on\':CFG.touch===\'on\'?\'off\':\'auto\';saveCfg();applyCfg();openSettings()"><b>Botones táctiles</b>'+tl[CFG.touch]+'</button>'
  +sl('Tamaño de botones','tsize',.8,1.4,.1)+sl('Opacidad de botones','topac',30,100,5)
  +tg('Modo zurdo','lefty')+tg('Vibración','vib')
  +'<h2>Pantalla</h2>'+tg('Minimapa','mini')+tg('Indicadores de acción','hints')+tg('Números de daño','dmg')+tg('Filtro CRT','crt')+tg('Suavizar píxeles','smooth')
  +'<button id="go" onclick="'+(setFrom==='title'?'title()':'openPause()')+'">Volver</button></div>';
 m.scrollTop=sc}
function openPause(){
 if(G.mode!=='play'&&G.mode!=='menu')return;relAll();G.mode='menu';const m=$('menu');m.style.display='flex';
 m.innerHTML='<div class="card"><h1>Pausa</h1><p>'+rg.n+'</p><button id="go" onclick="closeM()">Continuar</button>'
  +'<button class="oath" onclick="openSettings(\'pause\')"><b>Ajustes</b>Sonido, controles y pantalla</button>'
  +'<button class="oath" onclick="save();title()"><b>Guardar y salir al título</b></button></div>'}
function title(){
 G.mode='title';relAll();$('dlg').style.display='none';const m=$('menu'),has=!!load();m.style.display='flex';
 m.innerHTML='<div class="card"><h1>Juramento</h1><p>Soulslike 2D · mundo abierto</p><p class="hint">No permitas que el mundo vuelva a olvidarte.</p>'
  +(has?'<button class="oath" onclick="cont()"><b>Continuar</b>Seguir desde tu última hoguera</button>':'')
  +'<button class="oath" onclick="'+(has?'if(confirm(\'Se borrará tu partida guardada. ¿Empezar de nuevo?\'))':'')+'newGame()"><b>Nueva partida</b>Despertar en la cripta</button>'
  +'<button class="oath" onclick="openSettings(\'title\')"><b>Ajustes</b>Sonido, controles y pantalla</button></div>'}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if((k==='escape'||k==='p')&&!e.repeat){if(G.mode==='play')openPause();else if(G.mode==='menu'&&$('menu').querySelector('h1')&&$('menu').querySelector('h1').textContent==='Pausa')closeM()}});
$('pause').addEventListener('click',openPause);
$('pause').addEventListener('touchstart',e=>e.stopPropagation());
// ---- bucle ----
let last=performance.now();
function loop(t){requestAnimationFrame(loop);let dt=(t-last)/1000;last=t;if(!(dt>0))return;dt=Math.min(dt,.05);TM+=dt;try{update(dt);draw()}catch(e){if(!loop.err){loop.err=1;console.error(e)}}}
applyCfg();title();requestAnimationFrame(loop);
