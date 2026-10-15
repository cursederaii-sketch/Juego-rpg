// ===== CONSOLA DE COMANDOS (solo disponible en partidas cuyo nombre sea "pancho") =====
// Abrir: tecla ` (acento grave) o F2 en PC · en móvil: Pausa → botón «Consola».
// Comandos: ayuda · maxear [nivel] · desbloquear · tp [zona] [hoguera] · cerrar
(function(){
const NAME='pancho';
const ok=()=>{try{return !!S&&String(S.name||'').trim().toLowerCase()===NAME}catch(e){return false}};
const norm=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

// ---------- interfaz ----------
const st=document.createElement('style');
st.textContent='#cons{display:none;position:fixed;inset:0;z-index:95;flex-direction:column;box-sizing:border-box;padding:max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:rgba(4,2,10,.94);font:13px/1.5 monospace;color:#d9ffe3;touch-action:auto}'
+'#cons .ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;color:#ffe66d;letter-spacing:2px;font-size:12px}'
+'#cons .cl{flex:1;overflow:auto;white-space:pre-wrap;word-break:break-word;padding:8px;border:1px solid rgba(255,230,109,.35);border-radius:6px;background:rgba(0,0,0,.45);-webkit-overflow-scrolling:touch}'
+'#cons .cl i{font-style:normal;color:#9a8bc5}#cons .cl u{text-decoration:none;color:#ff7a8a}#cons .cl b{font-weight:400;color:#ffe66d}'
+'#cons .cr{display:flex;gap:6px;margin-top:8px}'
+'#cons input{flex:1;min-width:0;box-sizing:border-box;margin:0;padding:12px;font:inherit;font-size:16px;letter-spacing:0;text-align:left;color:#fff;background:#0b0714;border:1px solid #ffe66d;border-radius:6px}'
+'#cons button{height:auto;min-height:42px;padding:0 14px;font:inherit;color:#ffe66d;background:#1a1226;border:1px solid rgba(255,230,109,.5);border-radius:6px;touch-action:manipulation}';
document.head.appendChild(st);
const box=document.createElement('div');box.id='cons';
box.innerHTML='<div class="ch"><span>CONSOLA</span><button type="button" id="cx">Cerrar</button></div><div class="cl" id="clog"></div>'
 +'<form class="cr" id="cf" autocomplete="off"><input id="ci" type="text" placeholder="ayuda" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send"><button type="submit">Enviar</button></form>';
document.body.appendChild(box);
const log=box.querySelector('#clog'),inp_=box.querySelector('#ci');
const esc_=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const out=(t,c)=>{const d=document.createElement('div');d.innerHTML=c==='e'?'<u>'+esc_(t)+'</u>':c==='i'?'<i>'+esc_(t)+'</i>':esc_(t);log.appendChild(d);log.scrollTop=log.scrollHeight};
const isOpen=()=>box.style.display==='flex';
function hide(){box.style.display='none';try{inp_.blur()}catch(e){}}
function show(){
 if(!ok())return false;
 if(G.mode==='play')openPause();
 if(G.mode!=='menu')return false;
 box.style.display='flex';
 if(!log.childNodes.length){out('Consola de Juramento. Escribe «ayuda» para ver los comandos.','i')}
 setTimeout(()=>{try{inp_.focus()}catch(e){}},60);return true}
// el teclado de la consola no debe mover al personaje ni abrir la pausa
inp_.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();hide()}else if(e.key==='Enter'){e.preventDefault();send()}});
inp_.addEventListener('keyup',e=>e.stopPropagation());
box.querySelector('#cx').addEventListener('click',hide);
box.addEventListener('pointerdown',e=>e.stopPropagation());
addEventListener('keydown',e=>{
 const t=e.target;if(t&&t.tagName==='INPUT'&&t!==inp_)return;
 if(e.code==='Backquote'||e.key==='`'||e.key==='F2'){
  if(isOpen()){e.preventDefault();hide();return}
  if(ok()){e.preventDefault();show()}}},true);

// botón «Consola» dentro de la pausa (sirve en móvil)
{const op=openPause;
 try{$('pause').removeEventListener('click',op)}catch(e){}
 openPause=function(){const r=op.apply(this,arguments);
  if(ok()&&G.mode==='menu'){const c=$('menu').querySelector('.card');
   if(c&&!c.querySelector('#bcons'))c.insertAdjacentHTML('beforeend','<button id="bcons" class="oath" onclick="CONSOLA.open()"><b>Consola</b>Comandos de desarrollador</button>')}
  return r};
 $('pause').addEventListener('click',()=>openPause())}

// ---------- utilidades de zonas ----------
const fireCount=i=>{try{const w=mapW(RG[i].id);return Math.max(1,(w&&w.fires&&w.fires.length)||1)}catch(e){return 1}};
const fireName=(i,x)=>{const f=RG[i].fl&&RG[i].fl[x];return f?f.replace(/^\s*·\s*/,''):(x===0?'inicio':'hoguera '+(x+1))};
function findRegion(q){
 const s=norm(q);if(!s)return -1;
 if(/^\d+$/.test(s)){const n=+s-1;return n>=0&&n<RG.length?n:-1}
 let i=RG.findIndex(r=>norm(r.id)===s);if(i>=0)return i;
 i=RG.findIndex(r=>norm(r.n)===s);if(i>=0)return i;
 const m=RG.map((r,k)=>k).filter(k=>norm(RG[k].id).startsWith(s)||norm(RG[k].n).includes(s));
 return m.length===1?m[0]:(m.length>1?-2:-1)}
function listZones(){out('Zonas (usa: tp <número|id|nombre> [hoguera])','i');
 RG.forEach((r,i)=>{const n=fireCount(i);out((i+1)+'. '+r.id+' — '+r.n+(n>1?'  ['+Array.from({length:n},(_,x)=>x+':'+fireName(i,x)).join(', ')+']':''))})}

// ---------- comandos ----------
function cmdMax(a){
 let n=a[0]===undefined?30:parseInt(a[0],10);if(!(n>=1))n=30;n=Math.min(99,n);
 S.A.vig=S.A.res=S.A.fue=n;
 for(const k in WP)S.up[k]=5;
 S.ul=4;S.fmax=Math.max(S.fmax||3,6);S.flasks=S.fmax;
 S.souls=Math.max(S.souls||0,99999);S.frag=Math.max(S.frag||0,99);
 if(P){P.mhp=mhp();P.mst=mst();P.hp=P.mhp;P.st=P.mst}
 save();
 out('Personaje maxeado: Vida/Resistencia/Fuerza '+n+' · todas las armas +5 · Cólera nivel IV · '+S.fmax+' frascos · 99999 almas · 99 fragmentos.')}
function cmdUnlock(){
 const add=(arr,k)=>{if(!arr.includes(k))arr.push(k)};
 for(const k in WP)add(S.wpns,k);
 for(const k in RELS)add(S.relOwn,k);
 for(const k in ABIL)S.ab[k]=1;
 for(const k in OATHS)add(S.oaths,k);if(!S.oath&&S.oaths.length)S.oath=S.oaths[0];
 for(const k in KEYN)S.keys[k]=1;
 for(let i=0;i<RG.length;i++)for(let x=0;x<fireCount(i);x++)add(S.fires,i+':'+x);
 for(const k in MEM)S.mem[k]=1;
 for(const k in TRU)S.tr[k]=1;
 for(const k in NOTES)S.notes[k]=1;
 ACH.forEach(a=>{S.ach[a[0]]=1});
 for(const k in BEST){const b=S.be[k]=S.be[k]||{k:0};if(b.k<3)b.k=3}
 save();
 out('Desbloqueado: '+Object.keys(WP).length+' armas · '+Object.keys(RELS).length+' reliquias · '+Object.keys(ABIL).length+' habilidades · '+Object.keys(OATHS).length+' juramentos · llaves · hogueras de las '+RG.length+' zonas · recuerdos, verdades, lápidas, logros y bestiario.');
 out('Las reliquias se equipan (máx. 2) desde la hoguera.','i')}
function cmdTp(a){
 if(!a.length)return listZones();
 const i=findRegion(a[0]);
 if(i===-2)return out('Nombre ambiguo: sé más específico o usa el número. Escribe «tp» para ver la lista.','e');
 if(i<0)return out('No encuentro esa zona. Escribe «tp» para ver la lista.','e');
 const n=fireCount(i);let x=0;
 if(a[1]!==undefined){x=parseInt(a[1],10);if(!(x>=0&&x<n))return out('Esa zona tiene hogueras 0 a '+(n-1)+'.','e')}
 const k=i+':'+x;if(!S.fires.includes(k))S.fires.push(k);
 out('Teletransportando a '+RG[i].n+' · '+fireName(i,x)+'...');
 S.flasks=S.fmax;hide();loadRegion(i,x);closeM();save()}
const CMD={
 ayuda:()=>{out('Comandos:','i');out('  maxear [nivel]    Stats al máximo (por defecto 30, hasta 99), armas +5, Cólera IV, frascos, almas.');
  out('  desbloquear       Armas, reliquias, habilidades, juramentos, llaves, hogueras, recuerdos, logros...');
  out('  tp                Lista las zonas.');out('  tp <zona> [n]     Te lleva a una zona (número, id o nombre) y a su hoguera n.');
  out('  cerrar            Cierra la consola (también Esc o ` ).');out('  limpiar           Borra la pantalla.')},
 maxear:cmdMax,max:cmdMax,desbloquear:cmdUnlock,unlock:cmdUnlock,tp:cmdTp,
 cerrar:hide,salir:hide,limpiar:()=>{log.innerHTML=''},clear:()=>{log.innerHTML=''}};
function run(line){
 line=line.trim();if(!line)return;out('> '+line,'i');
 if(!ok())return out('Consola no disponible.','e');
 const p=line.split(/\s+/),c=norm(p[0]),f=CMD[c];
 if(!f)return out('Comando desconocido: '+p[0]+'. Escribe «ayuda».','e');
 try{f(p.slice(1))}catch(e){console.error(e);out('Error: '+(e&&e.message||e),'e')}}
function send(){const v=inp_.value;inp_.value='';run(v);if(isOpen())setTimeout(()=>{try{inp_.focus()}catch(_){}},0)}
box.querySelector('#cf').addEventListener('submit',e=>{e.preventDefault();send()});
window.CONSOLA={open:show,close:hide,run};
})();
