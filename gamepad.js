// ===== MANDO (PS4 / Gamepad API + teclas de mando de Android) =====
// Fuentes de entrada: (1) Gamepad API del navegador; (2) teclas "de mando" (WebView/APK de Android entrega muchos
// botones como eventos de teclado). Si la disposición no es estándar o nada responde, hay CALIBRACIÓN guiada.
// Los controles se ven siempre en una esquina y el panel muestra en vivo qué señal llega (diagnóstico).
(()=>{
const STD={dodge:0,act:1,light:2,heavy:3,block:4,flask:5,skill:7,ult:6,pause:9,up:12,down:13,left:14,right:15};
const HAT=(vs,alt)=>[{a:9,vs},alt];
const RAW={dodge:1,act:2,light:0,heavy:3,block:4,flask:5,skill:7,ult:6,pause:9,
 up:[...HAT([-1,-.714,1],{a:7,v:-1}),12],down:[...HAT([-.143,.143,.429],{a:7,v:1}),13],
 left:[...HAT([.429,.714,1],{a:6,v:-1}),14],right:[...HAT([-.714,-.428,-.143],{a:6,v:1}),15]};
// teclas de mando: códigos de Android (96…109) y de Chromium (195…210); cruceta también como flechas
const kk=(...a)=>a.map(k=>({k}));
const KEYDEF={dodge:kk('K96','K195'),act:kk('K97','K196'),light:kk('K99','K197'),heavy:kk('K100','K198'),block:kk('K102','K200'),
 flask:kk('K103','K199'),skill:kk('K105','K202'),ult:kk('K104','K201'),pause:kk('K108','K207'),
 up:kk('ArrowUp','K19','K203'),down:kk('ArrowDown','K20','K204'),left:kk('ArrowLeft','K21','K205'),right:kk('ArrowRight','K22','K206')};
const STEPS=[['dodge','✕'],['act','○'],['light','□'],['heavy','△'],['block','L1'],['flask','R1'],['skill','R2'],['ult','L2'],['pause','OPTIONS'],['up','Cruceta ↑'],['down','Cruceta ↓'],['left','Cruceta ←'],['right','Cruceta →']];
const ACTS=['dodge','act','light','heavy','flask','skill','ult'];
const KEY='jur_gpmap:';
const P0={buttons:[],axes:[],id:'teclas',mapping:'',connected:true};   // "mando" que solo envía teclas
let M=STD,curId=null,prevA={},prevB=[],dp={},usingJoy=false,gpOn=false,navT=0,lastDir=0,keep=null,lt=0,wake=false,cal=null,keyMode=false,lastSig='—',isOpen=true;
const kd=new Map(),kq=[],kp=new Set();

// ---- teclas ----
// Android/WebView no siempre entrega code/keyCode de forma coherente ni manda el keyup: se guardan TODOS los
// identificadores de cada evento (code, 'K'+keyCode, 'key:'+key) con la hora, y una tecla sin repetición
// ni keyup caduca sola (así nunca queda "pegada" y siempre hay un nuevo flanco de pulsación).
const ids=e=>{const o=[],c=e.code,k=e.keyCode||e.which||0;if(c&&c!=='Unidentified')o.push(c);if(k)o.push('K'+k);if(e.key&&e.key!=='Unidentified'&&e.key.length>1)o.push('key:'+e.key);return o.length?o:['K0']};
const kid=e=>ids(e)[0];
const padKey=e=>{const c=e.code||'',k=e.keyCode||e.which||0;return/^Gamepad|^Button|^Dpad/i.test(c)||/^(Gamepad|Button)/i.test(e.key||'')||((!c||c==='Unidentified')&&((k>=96&&k<=110)||(k>=195&&k<=210)))};
const KTTL=700,nowMs=()=>performance.now();
const kdOn=id=>{const t=kd.get(id);if(t===undefined)return false;if(nowMs()-t>KTTL){kd.delete(id);return false}return true};
const kdAny=()=>{for(const id of [...kd.keys()])if(kdOn(id))return true;return false};
const evlog=[];
addEventListener('keydown',e=>{
 const L=ids(e),pk=padKey(e);
 lastSig='tecla '+L.join('|')+' ('+(e.key||'?')+' '+(e.keyCode||0)+')';evlog.push(lastSig);if(evlog.length>6)evlog.shift();
 const rep=e.repeat&&L.some(i=>kd.has(i));
 L.forEach(i=>kd.set(i,nowMs()));
 if(!rep)L.forEach(i=>kp.add(i));
 if(pk&&!keyMode)keyMode=true;
 if(cal){if(!rep)kq.push(L);e.preventDefault();e.stopPropagation();return}
 if(pk&&(!e.repeat||keyMode)){e.preventDefault()}
},true);
addEventListener('keyup',e=>{ids(e).forEach(i=>kd.delete(i));if(cal)e.preventDefault()},true);
addEventListener('blur',()=>{kd.clear();kp.clear();kq.length=0});

// ---- panel en una esquina ----
const help=document.createElement('div');help.id='gpHelp';
const row=(k,c,t)=>'<div class="gr"><b style="color:'+c+'">'+k+'</b><span>'+t+'</span></div>';
help.innerHTML='<div class="gh"><span id="gpT">🎮 Pulsa un botón del mando</span><i id="gpS"></i></div><div class="gg" id="gpG">'
 +row('Stick / Cruceta','#cfc6ff','Mover')+row('□','#e79bd6','Ligero')+row('△','#5be0a8','Pesado')+row('✕','#6c9fff','Esquivar')
 +row('○','#ff6b7a','Actuar')+row('L1','#ffd36a','Bloquear')+row('R1','#ffd36a','Frasco')+row('R2','#ffd36a','Onda')
 +row('L2','#ffd36a','Cólera')+row('OPTIONS','#cfc6ff','Pausa')+row('SHARE','#cfc6ff','Plegar')
 +'</div><div class="gm">Menús: cruceta/stick · ✕ aceptar · ○ volver</div><div class="gm" id="gpD"></div>'
 +'<div class="gb"><button id="gpC">Calibrar</button><button id="gpR">Auto</button></div>';
document.body.appendChild(help);
const cal_=document.createElement('div');cal_.id='gpCal';cal_.innerHTML='<div class="gk"><h3>Calibrar mando</h3><p id="gpP"></p><small id="gpN"></small><small id="gpL"></small><button id="gpK">Saltar</button> <button id="gpX">Cancelar</button></div>';
document.body.appendChild(cal_);
const $$=id=>document.getElementById(id);
help.addEventListener('click',e=>{if(e.target.tagName==='BUTTON')return;isOpen=!isOpen;render()});
$$('gpC').addEventListener('click',e=>{e.stopPropagation();startCal()});
$$('gpR').addEventListener('click',e=>{e.stopPropagation();try{if(curId)localStorage.removeItem(KEY+curId)}catch(_){}const p=curPad();M=p?pick(p):STD;$$('gpS').textContent='auto'});
$$('gpX').addEventListener('click',()=>endCal(false));
$$('gpK').addEventListener('click',()=>{if(!cal)return;cal.i++;cal.wait=true;cal.tw=performance.now();kq.length=0;if(cal.i>=STEPS.length){endCal(true)}else calUI()});
const inTitle=()=>typeof G!=='undefined'&&G.mode==='title';
function render(){help.classList.toggle('open',isOpen);help.classList.toggle('on',gpOn||keyMode||inTitle())}
const nPads=()=>navigator.getGamepads?rawPads().length:-1;
const padInfo=()=>rawPads().map(x=>'['+x.index+'] '+String(x.id).slice(0,22)+' b'+x.buttons.length+' e'+x.axes.length+(x.mapping==='standard'?' std':'')).join(' · ');

// ---- lectura de una fuente ----
function rd(p,s){
 if(s==null)return false;
 if(Array.isArray(s))return s.some(x=>rd(p,x));
 if(typeof s==='number'){const b=p.buttons[s];return !!b&&(b.pressed||b.value>.6)}
 if(s.k!==undefined)return Array.isArray(s.k)?s.k.some(kdOn):kdOn(s.k);
 const v=p.axes[s.a];if(v===undefined)return false;
 if(s.vs)return s.vs.some(x=>Math.abs(v-x)<.08);
 return Math.abs(v-s.v)<(Math.abs(s.v)>=.95?.4:.1);
}
const isStd=p=>p.mapping==='standard';
const andr=/android/i.test(navigator.userAgent);
function pick(p){
 try{const s=localStorage.getItem(KEY+p.id);if(s){const m=JSON.parse(s);if(m&&m.dodge!==undefined)return m}}catch(_){}
 if(p===P0)return {};
 return isStd(p)||andr?STD:RAW;
}
const act=(p,a)=>rd(p,M[a])||rd(p,KEYDEF[a]);

// ---- conexión ----
const rawPads=()=>{try{return navigator.getGamepads?Array.from(navigator.getGamepads()).filter(x=>x&&x.connected):[]}catch(_){return[]}};
const restAx=new Map();   // posición de reposo de los ejes de cada dispositivo (primera lectura)
let lead=null;
// Android suele exponer el PS4 como VARIOS dispositivos (mando + panel táctil/sensores): se leen todos.
// Botones: cualquiera pulsado en cualquier dispositivo. Ejes: los del dispositivo "activo" (el último con actividad).
function getPad(){
 const l=rawPads();if(!l.length)return null;if(l.length===1)return l[0];
 for(const x of l){const key=x.id+'#'+x.index;if(!restAx.has(key))restAx.set(key,Array.from(x.axes));
  const r=restAx.get(key),act=x.buttons.some(b=>b&&(b.pressed||b.value>.6))||x.axes.some((v,i)=>i<r.length&&Math.abs(v-r[i])>.5);
  if(act)lead=key}
 const score=x=>(x.mapping==='standard'?1e6:0)+x.buttons.length*100+x.axes.length;
 let L=l.find(x=>x.id+'#'+x.index===lead)||l.slice().sort((a,b)=>score(b)-score(a))[0];
 const n=Math.max(...l.map(x=>x.buttons.length)),buttons=[];
 for(let i=0;i<n;i++){let best=null;for(const x of l){const b=x.buttons[i];if(b&&(!best||(b.pressed&&!best.pressed)||b.value>best.value))best=b}buttons.push(best||{pressed:false,value:0})}
 return{buttons,axes:L.axes,id:l.map(x=>x.id).sort().join('+'),mapping:l.some(x=>x.mapping==='standard')?'standard':L.mapping,connected:true,index:L.index}}
const curPad=()=>getPad()||(keyMode?P0:null);
function on(p){gpOn=true;wake=p!==P0;document.body.classList.add('gp');isOpen=true;$$('gpT').textContent='🎮 Mando conectado';render();
 curId=p.id;M=pick(p);let saved=false;try{saved=!!localStorage.getItem(KEY+p.id)}catch(_){}
 if(!saved&&p!==P0&&!isStd(p)&&!andr)startCal()}
function off(){gpOn=false;document.body.classList.remove('gp');clearOwn();if(window.relAll)relAll();prevA={};prevB=[];$$('gpS').textContent='';$$('gpT').textContent='🎮 Pulsa un botón del mando';endCal(false);curId=null;render()}
function clearOwn(){if(usingJoy){joy.on=false;joy.x=joy.y=0;usingJoy=false}for(const k in dp)if(dp[k]){dp[k]=false;held[k]=0}rel('block')}

// ---- calibración guiada (botones, ejes o teclas) ----
function startCal(){const p=curPad()||P0;if(!curId)curId=p.id;clearOwn();cal={i:0,m:{},base:Array.from(p.axes),wait:true,t0:performance.now(),tw:performance.now()};kq.length=0;cal_.classList.add('on');calUI()}
function calUI(){if(!cal)return;const s=STEPS[cal.i];$$('gpP').textContent=cal.wait?'Suelta todos los botones…':'Pulsa  '+s[1];$$('gpN').textContent=(cal.i+1)+' / '+STEPS.length}
function endCal(ok){
 if(ok&&cal&&curId){try{localStorage.setItem(KEY+curId,JSON.stringify(cal.m))}catch(_){}M=cal.m;$$('gpS').textContent='calibrado'}
 cal=null;cal_.classList.remove('on')}
function calStep(p){
 const anyB=p.buttons.some(b=>b&&(b.pressed||b.value>.6));
 const dAx=p.axes.map((v,i)=>Math.abs(v-cal.base[i])>.5);
 $$('gpL').textContent='Última señal: '+lastSig;
 if(cal.wait){const rel=!anyB&&!kdAny()&&!dAx.some((x,i)=>x&&i>=4);if(rel||performance.now()-cal.tw>1100){cal.wait=false;cal.base=Array.from(p.axes);cal.used=cal.used||new Set(Object.values(cal.m).map(v=>JSON.stringify(v)));cal.skipB=p.buttons.map(b=>!!(b&&(b.pressed||b.value>.6)));kq.length=0;cal.t0=performance.now();calUI()}return}
 const name=STEPS[cal.i][0],dpad=['up','down','left','right'].includes(name);
 let src=null;
 const bi=p.buttons.findIndex((b,i)=>b&&(b.pressed||b.value>.6)&&!(cal.skipB&&cal.skipB[i])&&!cal.used.has(JSON.stringify(i)));
 if(bi>=0)src=bi;
 else if(kq.length){const L=kq.shift();src={k:L.length>1?L:L[0]}}
 else if(dpad){const ai=dAx.findIndex((x,i)=>x&&i>=4);if(ai>=0)src={a:ai,v:+p.axes[ai].toFixed(3)}}
 if(src===null){
  if(cal.i===0&&performance.now()-cal.t0>7000)$$('gpN').textContent='No llega ninguna señal del mando a esta app. '+(nPads()>0?padInfo():'(pads: '+nPads()+')');
  return}
 cal.m[name]=src;cal.used.add(JSON.stringify(src));cal.i++;cal.wait=true;cal.tw=performance.now();
 if(cal.i>=STEPS.length){cal.m=Object.assign({},cal.m);endCal(true);return}
 calUI()}

// ---- menús ----
const vis=e=>e&&e.style.display&&e.style.display!=='none';
function menuNav(cur,down,ay,ax,dt){
 const c=vis($('dlg'))?$('dlg'):$('menu');
 const items=[...c.querySelectorAll('button,input')].filter(e=>e.offsetParent!==null&&!e.disabled);
 if(!items.length)return;
 let i=items.findIndex(e=>e.classList.contains('gpf'));
 if(i<0){i=keep&&performance.now()-keep.t<400?Math.min(keep.i,items.length-1):0}
 const mark=n=>{items.forEach(e=>e.classList.remove('gpf'));items[n].classList.add('gpf');try{items[n].scrollIntoView({block:'nearest'})}catch(e){}i=n};
 const up=cur.up||cur.left||ay<-.5,dn=cur.down||cur.right||ay>.5;
 const dir=up?-1:dn?1:0;
 if(dir){
  if(dir!==lastDir){navT=.32;mark((i+dir+items.length)%items.length)}
  else{navT-=dt;if(navT<=0){navT=.12;mark((i+dir+items.length)%items.length)}}
 }else navT=0;
 lastDir=dir;
 if(!items[i].classList.contains('gpf'))mark(i);
 if(down.dodge){const it=items[i];keep={i,t:performance.now()};if(it.tagName==='INPUT')it.focus();else it.click()}
 if(down.act){const bk=items.find(e=>e.id==='go'||/^Volver$/.test((e.textContent||'').trim()));if(bk)bk.click()}
}

// ---- diagnóstico en vivo ----
function live(p){if(!isOpen)return;
 const bs=[];if(p)p.buttons.forEach((b,i)=>{if(b&&(b.pressed||b.value>.6))bs.push(i)});
 const ax=[];if(p)p.axes.forEach((v,i)=>{if(i>=4||Math.abs(v)>.5)ax.push('e'+i+'='+(+v).toFixed(2))});
 const n=nPads();
 $$('gpD').textContent='pads: '+(n<0?'sin API':n)+(n>0?' '+padInfo():'')+' · botones: '+(bs.join(',')||'-')+' '+ax.join(' ')+' · '+lastSig+(evlog.length?' ['+evlog.slice(-3).join(' / ')+']':'');
 $$('gpS').textContent=cal?'':(!p?'':(p===P0?'teclas':(p.mapping==='standard'?'estándar':'alt.'))+(M===STD||M===RAW?'':' · calibrado'))}

// ---- bucle ----
function poll(t){
 requestAnimationFrame(poll);
 const dt=lt?Math.min(.1,(t-lt)/1000):0;lt=t;
 const p=curPad();
 live(p);
 if(!p){if(gpOn)off();else render();return}
 if(!gpOn)on(p);else if(p.id!==curId){curId=p.id;M=pick(p)}
 if(cal){calStep(p);return}
 const cur={};for(const k in STD)cur[k]=act(p,k);
 const pulse={};for(const k in STD){const d=KEYDEF[k];pulse[k]=!!d&&d.some(x=>kp.has(x.k))||(M[k]&&M[k].k!==undefined&&(Array.isArray(M[k].k)?M[k].k:[M[k].k]).some(i=>kp.has(i)))}
 const down=k=>(cur[k]&&!prevA[k])||pulse[k];
 const sh=!!(p.buttons[8]&&p.buttons[8].pressed)||!!(p.buttons[17]&&p.buttons[17].pressed);
 const shD=sh&&!prevB[0];prevB[0]=sh;
 const save=()=>{prevA=Object.assign({},cur);kp.clear()};
 if(wake){wake=false;prevA=Object.assign({},cur);return}
 if(shD){isOpen=!isOpen;render()}
 const dn={};for(const k in cur)dn[k]=down(k);
 if(dn.pause){
  if(G.mode==='play')openPause();
  else if(G.mode==='menu'){const h=$('menu').querySelector('h1');if(h&&h.textContent==='Pausa')closeM()}
 }
 const ax=p.axes[0]||0,ay=p.axes[1]||0;
 const menu=vis($('menu'))||vis($('dlg'));
 if(menu){clearOwn();menuNav(cur,dn,ay,ax,dt);save();return}
 lastDir=0;navT=0;
 const m=Math.hypot(ax,ay),dz=.25;
 if(m>dz){const k=Math.min(1,(m-dz)/(1-dz));joy.on=true;joy.x=ax/m*k;joy.y=ay/m*k;usingJoy=true}
 else if(usingJoy){joy.on=false;joy.x=joy.y=0;usingJoy=false}
 for(const k of ['up','down','left','right']){if(cur[k]!==!!dp[k]){dp[k]=cur[k];held[k]=cur[k]?1:0}}
 for(const k of ACTS)if(dn[k])press(k);
 if(cur.block!==!!prevA.block)cur.block?press('block'):rel('block');
 save();
}
addEventListener('gamepadconnected',()=>{if(!gpOn&&getPad())on(getPad())});
addEventListener('gamepaddisconnected',()=>{if(!getPad()&&!keyMode)off()});
render();
requestAnimationFrame(poll);
})();
