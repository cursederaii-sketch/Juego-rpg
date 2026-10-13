// ===== CRÓNICA: prólogo, sueños en las hogueras, presentaciones de jefes, reacciones de PNJ, códice y epílogos =====
// Se engancha a lo existente (bonfire, startBoss, NPC, openDiary, fin) sin cambiar su lógica. Todo lo que se vea una sola vez se guarda en S.nx.
const NX=()=>S.nx||(S.nx={});
const once=k=>{const n=NX();if(n[k])return false;n[k]=1;return true};
const chain=(arr,end)=>{const mk=i=>i>=arr.length?(end?end():null):D(arr[i][0],arr[i][1],null,()=>mk(i+1));return mk(0)};
const nBoss=()=>['sepulturero','pastora','cazador','caballero','rey'].filter(k=>S.bk[k]||(k==='rey'&&S.reyDone)).length;

// ---- PRÓLOGO ----
const PROLOGO=()=>chain([
 ['Crónica de Valdora','Hubo un reino llamado Valdora, y una puerta al norte que nadie debía abrir. Tras ella, decían los ancianos, dormía el miedo de todo un pueblo.'],
 ['Crónica de Valdora','La noche en que llegó la ceniza, el rey mandó cerrar la puerta con su gente aún fuera. Después ordenó algo peor que cerrarla: que todos olvidaran. Quien olvida deja de ser, y de los que dejaron de ser nacieron los Huecos.'],
 ['Crónica de Valdora','Desde entonces el reino vive sin memoria. Nadie recuerda por qué se cerró la puerta, quién la abrió ni quién pidió el olvido. Solo la piedra guarda lo que los vivos soltaron.']],()=>INTRO0());

// ---- SUEÑOS: se viven al descansar en una hoguera (uno por descanso, en orden) ----
const SUE=[
 ['d1',()=>S.bk.sepulturero,[['Sueño','Un pasillo de piedra y, en la oscuridad, alguien que tararea una nana. «Cuenta hasta tres y no mires atrás», dice la voz. Cuentas. Al llegar a tres te llama por un nombre que no es el tuyo... o que lo fue.']]],
 ['d2',()=>S.bk.pastora,[['Sueño','Una mujer con una corona sin joyas te toma las manos. «Soy Maelis», dice, como quien se presenta ante un extraño. «Si el rey cierra la puerta, ¿tú la abrirías?» No contestas. Ella sonríe: ya conoce la respuesta.']]],
 ['d3',()=>S.bk.cazador,[['Sueño','Los Huecos se han reunido en una plaza y se miran las manos. No lloran. Les preguntas qué pidieron. «Que doliera menos», responden a coro. «Pedimos demasiado.»']]],
 ['d4',()=>S.bk.caballero,[['Sueño','Dos jóvenes comparten una hogaza en lo alto de una torre. «Si abres, yo cargo con la culpa.» «Y yo volveré por ti.» Uno de los dos miente. Al despertar no sabes cuál.']]],
 ['d5',()=>nTruth()>=2||nMem()>=4,[['Sueño','Un pergamino con dos firmas. Una es del rey. La otra es tuya, escrita con la letra de alguien más joven y más asustado.']]],
 ['d6',()=>S.ri>=4&&S.bk.caballero,[['Sueño','Maelis te entrega una espada vieja y señala el muro de la cripta. «El rey borrará a todos. Pero quien conoce el miedo puede conservar una frase.» Raspas: «No permitas que el mundo vuelva a olvidarte». No fue tu orden. Fue su ruego.'],['Sueño','Al fondo del salón, el trono vacío espera con una corona partida y una llave. Entiendes que no te aguarda solo una batalla, sino una pregunta.']]]];
{const f=bonfire;bonfire=x=>{const d=SUE.find(s=>!NX()[s[0]]&&s[1]());if(!d){f(x);return}NX()[d[0]]=1;say(chain(d[2],()=>{f(x)}))}}

// ---- PRESENTACIONES DE JEFE (primera vez) ----
const PRES={
 sepulturero:()=>[['El Sepulturero','Otro que viene a ser enterrado... o a enterrar. Tengo la pala lista para ambos.']],
 pastora:()=>[['La Pastora de Ceniza','Mi rebaño ya no me reconoce. Dime, '+nm()+': ¿tú te reconoces?']],
 cazador:()=>[['El Cazador Hueco','(Olfatea el aire.) Hueles a alguien que aún conserva su nombre. Qué raro. Qué caro.']],
 caballero:()=>[['El Caballero que No Murió',S.aldric?'Esa voz... Hermano. ¿Vienes a cumplir tu promesa o a romperla otra vez?':'No sé quién eres. Pero mi cadena sí te conoce.']],
 rey:()=>[['El Rey sin Nombre','Llegaste con los recuerdos que quisiste conservar, '+nm()+'. ¿Cuántos son ciertos? '+(nMem()>=5?'Reuniste los cinco. Entonces sabes lo que pediste.':'Te faltan piezas. No importa: la pregunta es la misma.')]],
 guardiana:()=>[['La Guardiana del Osario','Duerme, forastero. Es lo único que aún sé dar.']],
 capdorn:()=>[['Capitán Dorn','Te lo advertí. Los muertos tampoco perdonan.']]};
{const sb=startBoss;startBoss=function(){sb();try{const id=AB(),f=PRES[id];if(f&&once('i'+id))say(chain(f()))}catch(e){}}}

// ---- REACCIONES DE PNJ: cuando no tienen nada nuevo que ofrecer, comentan cómo avanza la historia ----
const REA={
 anselmo:[[1,'Antes de fundir las campanas, la reina pidió que una sonara solo si alguien volvía de entre los muertos. No me atrevo a decirte si sonó.'],[3,'Dicen que los Huecos no son monstruos, sino vecinos que pidieron olvidar más de lo que cabía en ellos. Yo toco por ellos, aunque no oigan.']],
 aldea1:[[2,'Anoche soñé con una nana. Mi madre la cantaba. Hacía años que no la recordaba.'],[4,'Dicen que el Rey sin Nombre llora cuando nadie lo ve. Yo no lloraría por quien nos hizo esto. Pero lo entendería.']],
 aldea2:[[1,'Mi hijo ha empezado a decir nombres otra vez. Los dice mal, pero los dice.'],[3,'La ceniza ya no cae. Es raro: casi la echo de menos. Era lo único que nos recordaba que algo había pasado.']],
 ysolde:[[2,'La luna también olvida: por eso cambia cada noche. Pero siempre vuelve. Quizá recordar es solo volver.'],[4,'Leí tu nombre en una piedra, '+'viajero. No te lo diré. Algunas cosas hay que encontrarlas con los propios ojos.']],
 brenna:[[3,'Cacé tantos Huecos... Uno llevaba el anillo de mi hermana. Ya no cuento muertos. Cuento nombres.']],
 voz:[[4,'El olvido no fue mi juramento, fue el del rey. Yo solo lo guardo como quien guarda una herida abierta.']],
 sombra:[[1,'Si vuelves a la cripta de noche, quizá oigas una nana en los muros. No temas: es de la reina.'],[4,'Mi escudo ya no pesa. Creo que alguien, por fin, ha empezado a recordarnos.']]};
Object.keys(REA).forEach(id=>{const o=NPC[id];if(!o)return;NPC[id]=()=>{const n=o(),m=nBoss();
 if(n&&!n.o&&!n.nx){const r=REA[id].filter(a=>m>=a[0]&&!NX()['r'+id+a[0]]).pop();if(r){NX()['r'+id+r[0]]=1;n.nx=D(n.n,r[1])}}return n}});

// ---- CRÓNICA (códice de lore en el Diario) ----
const CRO=[
 ['El reino de Valdora',()=>1,'Un reino pequeño y terco, de campanas y murallas, que prosperó junto a la Puerta Norte. Su lema, tallado sobre cada arco: «Lo que se recuerda, permanece».'],
 ['La Puerta Norte',()=>S.bk.sepulturero,'Una compuerta de piedra y hierro más antigua que el reino. Se decía que contenía algo; nadie sabía qué. Los escuderos del rey juraban custodiarla con la vida.'],
 ['La noche de la ceniza',()=>S.bk.pastora,'Una niebla gris, sin origen, se arrastró desde el norte. Quien la respiraba empezaba a olvidar quién era, y lo que olvidaba se convertía en más ceniza.'],
 ['Los Huecos',()=>S.st.hollow>=3||S.bk.cazador,'No nacen: se quedan. Son quienes pidieron olvidar más de lo que cabía en ellos. Atacan a lo que aún tiene nombre porque ya no recuerdan lo que es tenerlo.'],
 ['El decreto del olvido',()=>S.tr.fosa||S.bk.cazador,'«Que no se oiga. Que nadie sepa quién lo pidió.» Dos firmas lo sellaron. Ninguna aparece en los registros públicos.'],
 ['La reina Maelis',()=>NX().d2,'Gobernó junto al rey sin tocar la corona. Rogó que no cerraran la puerta. Cuando se decretó el olvido, pidió a un escudero algo pequeño: que alguien conservara una frase.'],
 ['Los juramentos',()=>S.oaths.length,'Pactos con una ventaja y un precio. Nacieron en las criptas, cuando los guardianes aprendieron que la memoria se compra con renuncias.'],
 ['El Archivo',()=>S.keys.archivo||S.tr.archivos,'Allí se escribía todo lo que el reino debía recordar. Tras el decreto se guardó lo que debía callarse. Los vigilantes juraron no dejar salir una sola página.'],
 ['Aldric',()=>S.aldric,'Capitán de la Puerta y hermano de armas del escudero. Prometió cargar con la culpa de quien abriera. Su cadena no es de hierro: es de promesa.'],
 ['El Rey sin Nombre',()=>S.bk.cazador,'Pagó con la memoria de su pueblo para detener la ceniza. Ni él mismo recuerda ya su nombre; solo el peso de la corona.'],
 ['El escudero',()=>S.mem.rey,'Quien giró la llave, quien pidió el olvido y quien raspó la frase en el muro. Un mismo hombre con tres razones y un único miedo: perder a todos.'],
 ['La ceniza',()=>S.mem.rey,'No venía del norte. Venía de dentro: del miedo de un reino que no podía olvidar. Por eso el olvido la apagaba... y por eso volvería si el reino recordara sin aprender a perdonar.']];
const croHTML=()=>{const n=CRO.filter(c=>c[1]()).length;return '<h2>Crónica · '+n+'/'+CRO.length+'</h2>'+CRO.map(c=>c[1]()?'<div class="ent ok"><b>'+c[0]+'</b><span>'+esc(c[2])+'</span></div>':'<div class="ent lock"><b>???</b><span>Aún no sabes lo suficiente.</span></div>').join('')};
const TABS=[['mem','Memorias'],['bes','Bestiario'],['ach','Logros'],['map','Mapa'],['cro','Crónica']];
{const od=openDiary;openDiary=function(tab,from){
 if(tab!=='cro'){od(tab,from);const t=$('menu').querySelector('.tabs');if(t&&!t.querySelector('[data-cro]'))t.insertAdjacentHTML('beforeend','<button data-cro="1" onclick="openDiary(\'cro\')">Crónica</button>');return}
 if(from)diaryFrom=from;G.mode='menu';const m=$('menu');m.style.display='flex';m.classList.remove('tt');clearTimeout(mapAnim);
 m.innerHTML='<div class="card"><h1>Diario</h1><div class="tabs">'+TABS.map(t=>'<button class="'+(t[0]==='cro'?'sel':'')+'" onclick="openDiary(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>'+croHTML()+'<button id="go" onclick="'+(diaryFrom==='rest'?'openRest()':'openPause()')+'">Volver</button></div>'}}

// ---- EPÍLOGOS: qué fue de cada personaje según tus decisiones ----
function epi(k){const L=[],f=(n,t)=>L.push('<div class="ent"><b>'+n+'</b><span>'+t+'</span></div>');
 f('Mirela',S.mir===1?(k==='usu'?'Se marchó de Valdora antes de tu primera orden. Dejó un retrato tuyo en la plaza, boca abajo.':'Abrió una escuela en la plaza: allí se enseña a leer lápidas y a llamar a las cosas por su nombre.'):S.mir===-2?'No volvió a reconocerte, pero dejó una vela encendida en tu ventana cada noche.':'Preguntó por un escudero a todos los viajeros. Nadie supo darle respuesta.');
 f('Capitán Dorn',S.dorn===1?(k==='usu'?'Gobierna a tu lado y te vigila: es el único que sabe lo que costó.':'Perdió su regimiento y custodia la Puerta Norte, por si acaso.'):'Nunca te perdonó. Dicen que murió sin soltar su estandarte.');
 f('Aldric',S.cab==='rec'?'Descansa bajo una lápida con su nombre. Alguien deja flores cada primavera.':S.cab==='lib'?'Sin cadena, caminó hacia el norte sin mirar atrás.':S.cab==='tom'?'Sus legiones te siguen. Su mirada, no.':'La puerta sigue sin su capitán.');
 f('Ysolde','Siguió viviendo bajo la luna. Escribió un libro de lápidas que nadie se atreve a abrir de día.');
 f('Brenna',S.oaths.includes('blood')?'Colgó la espada. Dice que ya no tiene nada que cazar, aunque sigue contando huecos en sueños.':'Siguió cazando. Algún día encontrará el último.');
 f('Anselmo','Hizo sonar una campana nueva, una sola vez. Nadie supo si fue por ti.');
 f('La Voz',S.oaths.includes('oblivion')?'Calló. Ya no tiene a quién ofrecer el olvido.':'Sigue susurrando en el bosque, esperando a otro que pregunte.');
 f('Maelis',k==='olv'?'La frase raspada en el muro se desvaneció. Nadie la echó de menos.':'Apareció, bajo la corona partida, una frase en la piedra: «Gracias por recordar».');
 return L.join('')}
{const fn=fin;fin=function(k){fn(k);const c=$('menu').querySelector('.card'),p=c&&c.querySelector('p');if(p)p.insertAdjacentHTML('afterend','<h2>Qué fue de ellos</h2>'+epi(k))}}
