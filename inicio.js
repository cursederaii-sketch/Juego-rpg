// ---- botones pixel art: marco y texto dibujados a mano (fuente 5x7) ----
const FNT={A:'.###.#...##...#######...##...##...#',B:'####.#...##...#####.#...##...#####.',C:'.#####....#....#....#....#.....####',D:'####.#...##...##...##...##...#####.',E:'######....#....####.#....#....#####',F:'######....#....####.#....#....#....',G:'.#####....#....#.####...##...#.###.',H:'#...##...##...#######...##...##...#',I:'#####..#....#....#....#....#..#####',J:'..###...#....#....#....#.#..#..##..',K:'#...##..#.#.#..##...#.#..#..#.#...#',L:'#....#....#....#....#....#....#####',M:'#...###.###.#.##.#.##...##...##...#',N:'#...###..##.#.##..###...##...##...#',O:'.###.#...##...##...##...##...#.###.',P:'####.#...##...#####.#....#....#....',Q:'.###.#...##...##...##.#.##..#..##.#',R:'####.#...##...#####.#.#..#..#.#...#',S:'.#####....#.....###.....#....#####.',T:'#####..#....#....#....#....#....#..',U:'#...##...##...##...##...##...#.###.',V:'#...##...##...##...##...#.#.#...#..',W:'#...##...##...##.#.##.#.###.###...#',X:'#...##...#.#.#...#...#.#.#...##...#',Y:'#...##...#.#.#...#....#....#....#..',Z:'#####....#...#...#...#...#....#####'};
function pxText(str,sc){const w=[...str].reduce((a,c)=>a+(c===' '?4:6),0)-1,c=mkc(w+1,8),x=c.getContext('2d');let ox=0;
 for(const ch of str){if(ch===' '){ox+=4;continue}const gl=FNT[ch];if(!gl){ox+=6;continue}
  for(const[dx,dy,col]of[[1,1,'#b8780a'],[0,0,'#1a0f00']])for(let i=0;i<35;i++)if(gl[i]==='#'){x.fillStyle=col;x.fillRect(ox+i%5+dx,((i/5)|0)+dy,1,1)}ox+=6}
 const u=c.toDataURL();return{u,w:(w+1)*sc,h:8*sc}}
function pxFrame(dark){const c=mkc(12,12),x=c.getContext('2d'),Y=dark?'#e0a818':'#ffd23c',HI=dark?'#f0c850':'#fff0a0',LO=dark?'#a86a08':'#c8860a';
 for(let j=0;j<12;j++)for(let i=0;i<12;i++){const d=Math.min(i,j,11-i,11-j);let col;
  if(d<2){if(Math.min(i,11-i)===0&&Math.min(j,11-j)===0)continue;col='#000'}
  else if(d===2)col=(i===2||j===2)&&i<=j+0&&j<=i+0?HI:(i===2||j===2)?HI:LO;else col=Y;
  if(d===2&&(i===9||j===9))col=LO;x.fillStyle=col;x.fillRect(i,j,1,1)}
 return c.toDataURL()}
const pb=(t,fn,cls)=>{const p=pxText(t,3);return '<button class="tb'+(cls?' '+cls:'')+'" onclick="'+fn+'"><img src="'+p.u+'" style="width:'+p.w+'px;height:'+p.h+'px" alt="'+t+'"></button>'};
{const d=document.documentElement.style;d.setProperty('--fr','url('+pxFrame(0)+')');d.setProperty('--frd','url('+pxFrame(1)+')')}
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
  +'<button class="oath" onclick="openSettings(\'pause\')"><b>Ajustes</b>Sonido, controles y pantalla</button>'
  +'<button class="oath" onclick="save();showTitle()"><b>Guardar y salir al título</b></button></div>'}
function showTitle(){
 G.mode='title';relAll();$('dlg').style.display='none';const m=$('menu'),has=!!load();m.style.display='flex';m.classList.add('tt');
 m.innerHTML='<div class="tbtns">'+pb('JUGAR','tPlay()')+pb('AJUSTES',"openSettings('title')")+pb('CARGAR PARTIDA','tLoad()',has?'':'off')+'<div id="tmsg"></div></div>'}
function tMsg(t){const e=$('tmsg');if(e){e.textContent=t;clearTimeout(tMsg.t);tMsg.t=setTimeout(()=>{e.textContent=''},2200)}}
function tLoad(){if(!load())return tMsg('No hay partida guardada');m_off();cont()}
function tPlay(){if(!load()){m_off();return newGame()}
 $('menu').innerHTML='<div class="tbtns"><div id="tq">Ya tienes una partida guardada.<br>¿Empezar una nueva y borrarla?</div>'+pb('NUEVA PARTIDA','m_off();newGame()')+pb('CONTINUAR','m_off();cont()')+pb('VOLVER','showTitle()')+'</div>'}
const m_off=()=>$('menu').classList.remove('tt');
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if((k==='escape'||k==='p')&&!e.repeat){if(G.mode==='play')openPause();else if(G.mode==='menu'&&$('menu').querySelector('h1')&&$('menu').querySelector('h1').textContent==='Pausa')closeM()}});
$('pause').addEventListener('click',openPause);
$('pause').addEventListener('touchstart',e=>e.stopPropagation());
// ---- bucle ----
let last=performance.now();
function loop(t){requestAnimationFrame(loop);let dt=(t-last)/1000;last=t;if(!(dt>0))return;dt=Math.min(dt,.05);TM+=dt;try{update(dt);draw()}catch(e){if(!loop.err){loop.err=1;console.error(e)}}}
applyCfg();showTitle();requestAnimationFrame(loop);
