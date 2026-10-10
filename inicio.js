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
 if(from)setFrom=from;G.mode=G.mode==='play'?'menu':G.mode;const m=$('menu'),sc=m.scrollTop;m.style.display='flex';m.classList.remove('tt');
 const sl=(t,k,a,b,s)=>'<h2>'+t+' <span class="hint">'+CFG[k]+'</span></h2><input type="range" min="'+a+'" max="'+b+'" step="'+s+'" value="'+CFG[k]+'" oninput="setC(\''+k+'\',this.value);this.previousElementSibling.lastChild.textContent=this.value">';
 const tg=(t,k)=>'<button class="oath'+(CFG[k]?' sel':'')+'" onclick="CFG[\''+k+'\']=CFG[\''+k+'\']?0:1;saveCfg();applyCfg();openSettings()"><b>'+t+'</b>'+(CFG[k]?'Activado':'Desactivado')+'</button>';
 const tl={auto:'Automático',on:'Siempre visibles',off:'Ocultos (teclado)'};
 m.innerHTML='<div class="card"><h1 style="font-size:24px">Ajustes</h1>'
  +sl('Volumen general','master',0,100,5)+sl('Efectos','sfx',0,100,5)+sl('Sacudida de cámara','shake',0,1,.25)
  +'<h2>Controles</h2><button class="oath" onclick="CFG.touch=CFG.touch===\'auto\'?\'on\':CFG.touch===\'on\'?\'off\':\'auto\';saveCfg();applyCfg();openSettings()"><b>Botones táctiles</b>'+tl[CFG.touch]+'</button>'
  +sl('Tamaño de botones','tsize',.8,1.4,.1)+sl('Opacidad de botones','topac',30,100,5)
  +tg('Modo zurdo','lefty')+tg('Vibración','vib')
  +'<h2>Pantalla</h2>'+tg('Minimapa','mini')+tg('Indicadores de acción','hints')+tg('Números de daño','dmg')+tg('Filtro CRT','crt')+tg('Suavizar píxeles','smooth')
  +'<button id="go" onclick="'+(setFrom==='title'?'showTitle()':'openPause()')+'">Volver</button></div>';
 m.scrollTop=sc}
function openPause(){
 if(G.mode!=='play'&&G.mode!=='menu')return;relAll();G.mode='menu';const m=$('menu');m.style.display='flex';m.classList.remove('tt');
 m.innerHTML='<div class="card"><h1>Pausa</h1><p>'+rg.n+'</p><button id="go" onclick="closeM()">Continuar</button>'
  +'<p>'+S.name+'</p><button class="oath" onclick="openDiary(\'mem\',\'pause\')"><b>Diario</b>Recuerdos, bestiario, logros y mapa</button>'
  +'<button class="oath" onclick="openSettings(\'pause\')"><b>Ajustes</b>Sonido, controles y pantalla</button>'
  +'<button class="oath" onclick="save();showTitle()"><b>Guardar y salir al título</b></button></div>'}
function showTitle(){
 G.mode='title';relAll();$('dlg').style.display='none';const m=$('menu'),has=!!load();m.style.display='flex';m.classList.add('tt');
 m.innerHTML='<div class="tbtns"><button class="tb" onclick="tPlay()">Jugar</button><button class="tb" onclick="openSettings(\'title\')">Ajustes</button><button class="tb'+(has?'':' off')+'" onclick="tLoad()">Cargar partida</button><div id="tmsg"></div></div>'}
function tMsg(t){const e=$('tmsg');if(e){e.textContent=t;clearTimeout(tMsg.t);tMsg.t=setTimeout(()=>{e.textContent=''},2200)}}
function tLoad(){if(!load())return tMsg('No hay partida guardada');m_off();cont()}
function askName(){G.mode='title';const m=$('menu');m.style.display='flex';m_off();
 m.innerHTML='<div class="card"><h1>Tu nombre</h1><p>Despiertas sin recordar quién eres. Un nombre te viene a los labios... ¿cuál?</p><input id="nm" type="text" maxlength="14" placeholder="Sin nombre" autocomplete="off" spellcheck="false"><button id="go" onclick="startGame()">Despertar</button><button class="oath" onclick="showTitle()" style="text-align:center">Volver</button></div>';
 const i=$('nm');i.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')startGame()});setTimeout(()=>{try{i.focus()}catch(e){}},60)}
function startGame(){const v=(($('nm')||{}).value||'').trim().replace(/[<>&"'`]/g,'').slice(0,14);newGame(v||'Sin nombre')}
function tPlay(){const sv=load();if(!sv){return askName()}
 $('menu').innerHTML='<div class="tbtns"><div id="tq">Ya tienes una partida guardada ('+esc(sv.name||'Sin nombre')+').<br>¿Empezar una nueva y borrarla?</div><button class="tb" onclick="askName()">Sí, empezar de nuevo</button><button class="tb" onclick="m_off();cont()">Continuar la guardada</button><button class="tb" onclick="showTitle()">Volver</button></div>'}
const m_off=()=>$('menu').classList.remove('tt');
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if((k==='escape'||k==='p')&&!e.repeat){if(G.mode==='play')openPause();else if(G.mode==='menu'&&$('menu').querySelector('h1')&&$('menu').querySelector('h1').textContent==='Pausa')closeM()}});
$('pause').addEventListener('click',openPause);
$('pause').addEventListener('touchstart',e=>e.stopPropagation());
// ---- bucle ----
let last=performance.now();
function loop(t){requestAnimationFrame(loop);let dt=(t-last)/1000;last=t;if(!(dt>0))return;dt=Math.min(dt,.05);TM+=dt;try{update(dt);draw()}catch(e){if(!loop.err){loop.err=1;console.error(e)}}}
applyCfg();showTitle();requestAnimationFrame(loop);
