// ===== PERSONAJES: fichas de PNJ en el Diario (Soledad y Andro) =====
const PERS=[
 ['Soledad',()=>(S.ly||0)>=1,[['Ubicación','Jardín Derruido'],['Oficio','Guardián'],
  ['Personalidad','Cariñoso, sereno y protector. Siempre está pendiente de Andro, aunque a veces se preocupa tanto por él que termina exagerando cualquier peligro.'],
  ['Apariencia','Ropa de viajero oscura, una capa gastada y un pequeño accesorio compartido con Andro: un anillo de casamiento.']]],
 ['Andro',()=>(S.ly||0)>=1,[['Ubicación','Jardín Derruido, siempre junto a Soledad'],['Oficio','Viajero'],
  ['Personalidad','Alegre, bromista y afectuoso. Le encanta molestar cariñosamente a Soledad cuando se pone demasiado protector, pero confía plenamente en él.'],
  ['Apariencia','Vestimenta de viajero con detalles claros y el mismo accesorio que lleva Soledad. Están casados.']]]];
const persHTML=()=>{const n=PERS.filter(p=>p[1]()).length;return '<h2>Personajes · '+n+'/'+PERS.length+'</h2>'+PERS.map(p=>p[1]()?'<div class="ent ok"><b>'+p[0]+'</b>'+p[2].map(r=>'<span><u>'+r[0]+':</u> '+esc(r[1])+'</span>').join('')+'</div>':'<div class="ent lock"><b>???</b><span>Aún no has conocido a este personaje.</span></div>').join('')};
TABS.push(['pers','Personajes']);
{const od=openDiary;openDiary=function(tab,from){
 if(tab!=='pers'){od(tab,from);const t=$('menu').querySelector('.tabs');if(t&&!t.querySelector('[data-pers]'))t.insertAdjacentHTML('beforeend','<button data-pers="1" onclick="openDiary(\'pers\')">Personajes</button>');return}
 if(from)diaryFrom=from;G.mode='menu';const m=$('menu');m.style.display='flex';m.classList.remove('tt');clearTimeout(mapAnim);
 m.innerHTML='<div class="card"><h1>Diario</h1><div class="tabs">'+TABS.map(t=>'<button class="'+(t[0]==='pers'?'sel':'')+'" onclick="openDiary(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>'+persHTML()+'<button id="go" onclick="'+(diaryFrom==='rest'?'openRest()':'openPause()')+'">Volver</button></div>'}}
