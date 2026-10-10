// ===== SISTEMAS: diario (recuerdos, bestiario, logros) y mapa =====
let diaryFrom='pause',mapSel=null;const mapCache={};
const esc=t=>String(t).replace(/</g,'&lt;');
function openDiary(tab,from){if(from)diaryFrom=from;tab=tab||'mem';G.mode='menu';const m=$('menu');m.style.display='flex';m.classList.remove('tt');
 const T=[['mem','Memorias'],['bes','Bestiario'],['ach','Logros'],['map','Mapa']];
 let h='<div class="card"><h1>Diario</h1><div class="tabs">'+T.map(t=>'<button class="'+(t[0]===tab?'sel':'')+'" onclick="openDiary(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>';
 h+=tab==='mem'?dMem():tab==='bes'?dBes():tab==='ach'?dAch():dMap();
 m.innerHTML=h+'<button id="go" onclick="'+(diaryFrom==='rest'?'openRest()':'openPause()')+'">Volver</button></div>';if(tab==='map')drawMap(mapSel||rg.id)}
function dMem(){let h='<h2>Recuerdos · '+nMem()+'/5</h2>';
 ['sepulturero','pastora','cazador','caballero','rey'].forEach(k=>{const m=MEM[k];h+=S.mem[k]?'<div class="ent"><b>'+m[0]+'</b><span>'+esc(typeof m[1]==='function'?m[1]():m[1])+'</span></div>':'<div class="ent lock"><b>???</b><span>Un jefe guarda este recuerdo.</span></div>'});
 if(nMem()>=2&&nMem()<5)h+='<p class="hint">Los recuerdos no coinciden entre sí. ¿Quién giró la llave?</p>';
 const hint={osario:'Algo duerme bajo la cripta.',archivos:'Hay un registro quemado en Valdora.',fosa:'Un heraldo calló más allá del bosque.'};
 h+='<h2>Verdades ocultas · '+nTruth()+'/3</h2>';for(const k in TRU)h+=S.tr[k]?'<div class="ent ok"><b>'+TRU[k][0]+'</b><span>'+esc(TRU[k][1])+'</span></div>':'<div class="ent lock"><b>???</b><span>'+hint[k]+'</span></div>';
 const ns=Object.keys(S.notes);h+='<h2>Lápidas · '+ns.length+'</h2>'+(ns.length?ns.map(k=>'<div class="ent"><b>'+NOTES[k][0]+'</b><span>'+esc(NOTES[k][1])+'</span></div>').join(''):'<p class="hint">Busca lápidas con un brillo tenue.</p>');
 const ab=Object.keys(S.ab);if(ab.length)h+='<h2>Habilidades</h2>'+ab.map(k=>'<div class="ent ok"><b>'+ABIL[k][0]+'</b><span>'+ABIL[k][1]+'</span></div>').join('');
 return h}
function dBes(){let h='<h2>Bestiario</h2>';for(const k in BEST){const b=BEST[k],e=S.be[k];if(!e){h+='<div class="ent lock"><b>???</b><span>Aún no te has cruzado con él.</span></div>';continue}
  h+='<div class="ent"><b>'+b[0]+(e.k?' · derrotado '+e.k+'×':'')+'</b><span>'+b[1]+'</span>'+(e.k>=1?'<span style="margin-top:4px;color:#9a8bc5">'+b[2]+'</span>':'')+(e.k>=3||(BS[k]&&e.k>=1)?'<span style="margin-top:4px;color:#7dff9a">Consejo: '+b[3]+'</span>':'')+'</div>'}return h}
function dAch(){const n=Object.keys(S.ach).length;return '<h2>Logros · '+n+'/'+ACH.length+'</h2>'+ACH.map(a=>S.ach[a[0]]?'<div class="ent ok"><b>'+a[1]+'</b><span>'+a[2]+'</span></div>':'<div class="ent lock"><b>'+a[1]+'</b><span>'+a[2]+'</span></div>').join('')}
function dMap(){const vis=RG.filter(r=>r.id===rg.id||S.seen[r.id]);const cur=mapSel||rg.id;
 return '<div class="row" style="flex-wrap:wrap;margin:8px 0">'+vis.map(r=>'<button class="'+(r.id===cur?'sel':'')+'" style="flex:1 1 45%;height:34px;font-size:11px" onclick="mapSel=\''+r.id+'\';openDiary(\'map\')">'+r.n+'</button>').join('')+'</div><canvas id="mapc"></canvas><div class="legend">Naranja: hoguera · Celeste: pasaje · Violeta: salida · Dorado: puerta cerrada · Blanco: tú</div>'}
function mapW(id){if(id===rg.id)return W;const i=RG.findIndex(r=>r.id===id),c=mapCache[id];if(c&&c.v===S.seen[id])return c.w;const w=new Mapa(RG[i]);RG[i].build(w);w.applyState();w.bake();w.initSeen(S.seen[id]);mapCache[id]={w,v:S.seen[id]};return w}
function drawMap(id){const w=mapW(id),c=$('mapc');if(!c)return;const k=4;c.width=w.cols*k;c.height=w.rows*k;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#05030a';x.fillRect(0,0,c.width,c.height);x.drawImage(w.mmv,0,0,c.width,c.height);
 const sn=(a,b)=>w.seen[w.i(a,b)],mk=(tx_,ty_,col,r)=>{x.fillStyle=col;x.fillRect(tx_*k-r+k/2,ty_*k-r+k/2,r*2,r*2)};
 w.fires.forEach(f=>sn(f.tx,f.ty)&&mk(f.tx,f.ty,'#ff9a3c',4));w.portals.forEach(q=>sn(q.tx,q.ty)&&mk(q.tx,q.ty,'#7dd8ff',4));if(w.exitP&&sn(w.exitP.tx,w.exitP.ty))mk(w.exitP.tx,w.exitP.ty,'#b05cff',4);
 w.lds.forEach(d=>sn(d.x,d.y)&&!S.dl[d.id]&&mk(d.x,d.y,'#ffd24a',3));w.npcs.forEach(n=>sn(n.tx,n.ty)&&!(n.night&&!S.night)&&mk(n.tx,n.ty,'#9ad0ff',2));
 if(id===rg.id)mk(P.x/16|0,P.y/16|0,'#fff',4)}
