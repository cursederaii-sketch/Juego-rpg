// ===== LA PASTORA DE CENIZA: ahora vale la pena pelearla (ya no bloquea el camino al Bosque) =====
// Carga DESPUÉS de arrabales.js. Premio: reliquia propia + más almas y fragmentos.
//   Brasa de la Pastora: cada enemigo derrotado te devuelve 8 de resistencia; los jefes dan un 25% más de almas.
(function(){
RELS.brasa=['Brasa de la Pastora','Cada enemigo derrotado te devuelve 8 de resistencia. Los jefes dan un 25% más de almas. Tu Onda dispara tres brasas rojas en abanico (+3% de daño en total).'];
RELSRC.brasa='La conserva la Pastora de Ceniza';
if(typeof BS!=='undefined'&&BS.pastora){BS.pastora.so=900;BS.pastora.fr=3;BS.pastora.drop=Object.assign({},BS.pastora.drop||{},{rel:'brasa'})}
{const k=onKill;onKill=function(e){k(e);
 if(typeof hasR==='function'&&hasR('brasa')){P.st=Math.min(P.mst,P.st+8);if(e&&e.b)S.souls+=Math.round((e.so||0)*.25)}}}
})();
