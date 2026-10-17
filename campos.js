// ===== CAMPOS DEL EXILIO (zona de prueba · objetivo "reparar / activar") =====
// Carga DESPUÉS de jorge.js. Se entra desde el Valle Sereno.
// Objetivo: el puente sobre el río está bloqueado. Hay que reparar tres puntos (molino, granja y almacén)
// repartidos por la orilla oeste, defendidos por los soldados que quedaron. Al repararlos todos, el puente se abre
// y se accede a la orilla este (hoguera, botín y notas). El progreso se guarda con las palancas (S.lv).
(function(){
Object.assign(NOTES,{
 campos1:['Cartel torcido','«Puente de Valdora. Peaje: un nombre.» Alguien tachó la última palabra con carbón.'],
 campos2:['Diario de un soldado','«Nos ordenaron cortar el puente para que la ceniza no cruzara. Nadie dijo qué hacer con los que estaban al otro lado.»'],
 campos3:['Carreta volcada','Sacos de grano, vacíos. Las marcas en la madera cuentan días, no kilómetros.'],
 campos5:['Muro sin musgo','Todo el muro del norte está cubierto de líquen, menos este tramo. Alguien lo cerró con prisa y lo limpió con las manos.'],
 campos4:['Piedra con grabados','Tres juramentos distintos, tallados por tres manos distintas. Los tres dicen «volveré por ti».']});

RG.push({id:'campos',n:'Campos del Exilio',act:'Un puente cortado y tres promesas rotas',th:'valle',cols:56,rows:40,m:1.4,dm:1.2,out:1,fl:['',' · Orilla este'],mini:'daren',build(W){
 W.fillG('g');W.ring('wall',2);
 // río de norte a sur con un único puente (bloqueado hasta reparar los tres puntos)
 W.g('w',26,2,4,36);W.g('b',26,18,4,4);
 W.path([[3,20],[25,20]],3,'p');W.path([[30,20],[52,20]],3,'p');
 W.path([[10,20],[10,9]],3,'p');W.path([[14,20],[14,31]],3,'p');W.path([[21,20],[21,7]],3,'p');
 // --- punto 1: Molino fortificado (NO) ---
 W.house(6,4,8,5,3);W.o('barrel',8,10,1,1);W.o('crate',12,10,1,1);W.lever(10,10,'c1',{k:'Reparar el cabrestante',m:'Cabrestante reparado'});
 W.en('hollow',9,13);W.en('archer',12,7);W.en('soldier',7,15);
 // --- punto 2: Granja abandonada (SO) ---
 W.house(8,32,7,5,2);W.house(17,33,6,4,3);W.o('crate',12,29,1,1);W.o('barrel',16,30,1,1);W.lever(14,31,'c2',{k:'Colocar la viga',m:'Viga colocada'});
 W.en('hollow',12,26);W.en('hollow',17,28);W.en('brute',19,30);W.en('archer',6,28);
 // --- punto 3: Almacén de suministros (N) ---
 W.house(18,3,7,4,3);W.o('crate',17,8,1,1);W.o('crate',23,8,1,1);W.lever(21,8,'c3',{k:'Engrasar el mecanismo',m:'Mecanismo engrasado'});
 W.en('soldier',19,11);W.en('hollow',23,12);W.en('warden',15,16,{pat:[[12,16],[19,16]]});
 // patrulla cerca del puente y emboscada
 W.en('hollow',22,22);W.en('archer',23,18);
 W.amb('cm1',17,19,7,3,[['hollow',18,18],['soldier',23,22],['archer',20,23]],{souls:200});
 // barricada del puente: se abre al reparar los tres puntos
 W.sgate(27,18,2,4,['c1','c2','c3'],{msg:'El puente vuelve a sostenerse'});
 // --- orilla este: recompensa ---
 // arena del Capitán Daren: cámara cerrada en la orilla este; la puerta se cierra al entrar y se abre al vencerlo
 chamber(W,38,14,12,12,'f');W.clr(37,19,1,3);W.g('f',37,19,1,3);W.setArena({x:38,y:14,w:12,h:12},[[37,19,1,3]],44,19);
 W.o('brazier',38,14,1,1);W.o('brazier',49,14,1,1);W.o('statue',44,15,1,1);
 W.portal('bosque',48,20,{to:'bosque',at:'back',k:'Camino al Bosque Marchito',sx:-22,sy:0,cond:()=>!!S.bk.daren,lock:'El capitán aún guarda el paso'});
 W.item(41,22,{n:3});W.item(46,23,{sou:700});W.item(44,18,{n:2});
 W.en('soldier',34,13);W.en('archer',36,29);W.en('hollow',44,31);
 W.o('tomb',47,16,1,1);W.note(47,16,'campos4');
 // --- recuperar: el diario del capitán, en una sala sellada (muro falso) al norte de la orilla este ---
 chamber(W,40,4,8,5,'f');W.fwall(43,9,2,1,'b');W.o('brazier',40,4,1,1);W.o('brazier',47,4,1,1);W.o('tomb',44,5,1,1);W.item(43,7,{q:'campdiario',k:'Recoger el diario'});
 W.en('hollow',43,10);W.en('archer',47,11);
 W.o('rock',41,11,1,1);W.note(41,11,'campos5');
 W.fire(4,22);W.fire(33,20);
 // --- supervivientes: Mara y Orrin esperan junto al camino de entrada; el que elijas llevar acaba en la orilla este ---
 {const e=S.rv['campos:escolta'];W.npc('mara',e==='mara'?35:7,e==='mara'?22:23);W.npc('orrin',e==='orrin'?35:8,e==='orrin'?22:17)}
 W.portal('back',4,20,{to:'valle',at:'campos',k:'Volver al Valle',sx:22,sy:0});
 // lore
 W.o('cross',6,18,1,1);W.note(6,18,'campos1');W.o('barrel',24,16,1,1);W.note(24,16,'campos2');W.o('crate',20,28,1,1);W.note(20,28,'campos3');
 W.item(16,10,{sou:300});W.item(16,35,{n:1});W.item(15,5,{sou:250});
 W.sc('tree',40,3,3,54,38,{avoid:'pfwbk',seed:41,gap:2});W.sc('bush',40,3,3,54,38,{avoid:'pwb',seed:42,gap:1});W.sc('rubble',24,3,3,54,38,{avoid:'pfwb',seed:43,gap:1});W.sc('rock',10,3,3,54,38,{avoid:'pfwb',seed:44,gap:2});
}});

// ---- recuperar: Diario del capitán (objeto de misión; se entrega a Mara u Orrin) ----
{const p0=pickIt;pickIt=function(it,key){
 if(it.q!=='campdiario')return p0(it,key);
 S.tk[key]=1;S.rv['campos:diario']=1;sfx(520,.25,'sine',.06,880);spark(it.x,it.y,'#ffe66d',16);toast('Diario del capitán · llévaselo a Mara u Orrin');save();
 say(D('Diario del capitán','«Cortamos el puente al amanecer, con gente todavía en la otra orilla. La orden llegó sellada desde la capital: nadie debía contar lo de la noche del pacto. Si alguien lee esto, que sepa que lo hice yo, y que me ordenaron hacerlo. — Daren»'))}}

// ---- decidir quién se salva: Mara u Orrin (el puente reparado solo aguanta a uno más). Sigue al jugador, sin vida propia;
//      si el jugador cae, deja de seguirlo y se puede volver a elegir. La elección queda en S.rv['campos:escolta'] ('mara' | 'orrin'). ----
if(typeof KITS!=='undefined'&&KITS.aldeano){KITS.mara=Object.assign({},KITS.aldeano,{A:['#6a4a2a','#94703e','#3e2a16'],buckle:'#ffd24a'});KITS.orrin=Object.assign({},KITS.aldeano,{A:['#4a4a52','#74747e','#2a2a30'],hc:['#c8c8d0','#e4e4ea','#8a8a94'],buckle:'#9ad0ff'})}
let mf=null;
const SV={mara:'Mara',orrin:'Orrin'},otro=id=>id==='mara'?'orrin':'mara',esc=()=>S.rv['campos:escolta']||'';
const SVT={
 mara:['Mara, superviviente','Salí de Valdora con otros, pero el río se llevó el puente y a casi todos. Mi hermano estaba de guardia en la otra orilla. Orrin y yo somos los únicos que quedamos, y el puente reparado no aguantará a tres. Solo puedo pedirte que me lleves a mí.'],
 orrin:['Orrin, soldado herido','Fui de la guardia del puente. Las piernas ya no me responden, pero vi lo que pasó aquí. Mara y yo somos los únicos que quedamos y el puente no resistirá a tres. Si tienes que elegir, elige con los ojos abiertos.']};
const surv=id=>()=>{
 const o=otro(id),nm=SV[id];S.rv['campos:'+id]=1;let n;
 if(esc()===id)n=D(nm,id==='mara'?'Gracias por traerme. Aquí, al otro lado del río, por fin puedo respirar. Mantendré encendida la hoguera para quien venga detrás.':'Hacía años que no veía este lado del río. Siéntate un momento, forastero; los ojos ya los tienes abiertos.');
 else if(esc()===o)n=D(nm,'Lo entiendo. Alguien tenía que quedarse de este lado. Ve tranquilo: yo cuidaré el camino hasta que vuelvas.');
 else if(mf===id)n=D(nm,'Camino detrás de ti. Si caes, me quedaré donde estoy.');
 else if(mf===o)n=D(nm,'Llévate primero a '+SV[o]+'. Yo esperaré. Pero no tardes.');
 else n=D(SVT[id][0],SVT[id][1],[['Llevar a '+nm,()=>D(nm,'Piénsalo bien: el puente solo aguantará a uno más. Quien se quede aquí tendrá que quedarse. '+(id==='mara'?'Ella te regalaría un frasco de remedios.':'Él te enseñaría a aguantar mejor los golpes.')+' ¿Seguro?',[['Sí, ven conmigo',()=>{mf=id;toast(nm+' te sigue · llévalo a la orilla este');return D(nm,id==='mara'?'Gracias. Iré pisando tus huellas.':'Despacio. Te seguiré como pueda.')}],['Pensarlo',null]])],['Todavía no',null]]);
 if(S.rv['campos:diario']&&!S.rv['campos:diarioOk'])return D(nm,id==='mara'?'Esa letra… es la de mi hermano. ¿Dónde lo encontraste?':'Esa es la letra del capitán Daren. ¿Dónde la encontraste?',
  [['Entregar el diario',()=>{S.rv['campos:diarioOk']=id;S.souls+=400;toast('Diario entregado · +400 almas');save();return D(nm,id==='mara'?'Siempre supe que había cortado él la cuerda. Lo que no sabía es que se lo ordenaron. Gracias por traerme la verdad; es más pesada que el miedo, pero es mía.':'Lo vi atar la cuerda llorando, y no pude decir nada. Ahora hay alguien que puede contarlo. Gracias, forastero.')}]].concat(n.o||[['Cerrar',null]]));
 return n};
NPC.mara=surv('mara');NPC.orrin=surv('orrin');
{const u=update;update=function(dt){u(dt);
 if(!S||!W||!P||rg.id!=='campos'){mf=null;return}
 if(!mf)return; if(P.s==='dead'){mf=null;return} if(G.mode!=='play')return;
 const n=W.npcs.find(q=>q.id===mf);if(!n)return;
 const dx=P.x-n.x,dy=P.y-n.y,d=Math.hypot(dx,dy);
 if(d>26){const sp=(d>90?95:mf==='orrin'?55:68)*dt,vx=dx/d*sp,vy=dy/d*sp;if(!W.hit(n.x+vx,n.y,5,5))n.x+=vx;if(!W.hit(n.x,n.y+vy,5,5))n.y+=vy;n.tx=n.x/16|0;n.ty=n.y/16|0}
 if(Math.hypot(n.x-552,n.y-328)<56&&Math.hypot(P.x-552,P.y-328)<80){const id=mf;mf=null;S.rv['campos:escolta']=id;if(id==='mara'){S.souls+=500;S.fmax++;S.flasks=S.fmax;toast('Mara te regala su frasco de remedios · +1 frasco máximo · +500 almas')}else{S.souls+=300;S.frag+=3;S.A.res++;P.mst=mst();P.st=P.mst;toast('Orrin te enseña a aguantar el golpe · +1 Resistencia · +3 fragmentos')}sfx(500,.4,'sine',.06,900);save()}
}}

// ---- juramento de la zona: cómo se cerró (queda guardado en la partida y se refleja en el Diario y en otros PNJ) ----
const campCierre=()=>esc()||(['c1','c2','c3'].every(id=>S.lv['campos:'+id])?'puente':'');
const campJur=()=>({mara:'Elegir a quien espera: llevaste a Mara a la otra orilla y dejaste a Orrin de este lado.',orrin:'Elegir al testigo: llevaste a Orrin, que lo vio todo, y dejaste a Mara con su pregunta sin responder.',puente:'Reparar lo roto: abriste el puente, pero todavía nadie lo ha cruzado a salvo.','':'Aún sin cerrar: el puente sigue cortado.'})[campCierre()]+(S.rv['campos:diarioOk']?' Recuperaste el diario del capitán y ahora se sabe quién ordenó cortarlo.':'');
if(typeof PERS!=='undefined'){
 const ficha=(id,ofi,pers)=>{const f=[SV[id],()=>!!S.rv['campos:'+id],[]];Object.defineProperty(f,2,{get:()=>[['Ubicación',esc()===id?'Orilla este de los Campos del Exilio':'Orilla oeste de los Campos del Exilio'],['Oficio',ofi],['Personalidad',pers],['Juramento de la zona',campJur()]]});PERS.push(f)};
 ficha('mara','Superviviente de Valdora','Callada y terca. Perdió a casi todos en el río y aun así sigue pensando en el hermano que cortó el puente.');
 ficha('orrin','Soldado de la guardia del puente','Pausado y amargo. Cojea, no se queja y guarda lo que vio como quien guarda una deuda.')}
if(typeof NPC.elda==='function'){const e0=NPC.elda;NPC.elda=()=>{const n=e0();if(esc()&&!S.rv['campos:eldaOk']){const nx0=n.nx;n.nx=()=>{S.rv['campos:eldaOk']=1;return D('Elda',esc()==='mara'?'Una mujer llamada Mara me escribió desde los Campos del Exilio. Dice que alguien eligió llevarla a ella. Hacía mucho que no oía eso de nadie.':'Un viejo soldado llamado Orrin me mandó recado desde los Campos del Exilio. Dice que alguien eligió escucharlo a él. A mí me bastó con saber que alguien quedaba para contarlo.',null,nx0)}}return n}}

// ---- jefe: Capitán Daren (el que cortó el puente por orden de la capital). Mini-jefe de la zona; vencerlo abre el camino al Bosque ----
BS.daren={n:'Capitán Daren',mini:1,hp:330,w:18,h:34,c:'#5a4a3a',tr:'#9ad0ff',sp:34,so:1500,fr:3,dm:1.2,wl:24,
 ph:[{a:['bsl','bstab'],s:1},{a:['bsl','bov','bstab'],s:1.3,adds:2,addT:'soldier',msg:'Llama a quienes cortaron la cuerda'},{a:['bov','bstab','bsl'],s:1.5,hold:.3,msg:'Ya no recuerda a quién obedecía'}]};
if(typeof KITS!=='undefined'&&KITS.caballero)KITS.daren=Object.assign({},KITS.caballero,{A:['#4a3e30','#74644e','#2a2218'],hc:['#5a5048','#8a8070','#2e2a24'],eye:'#9ad0ff',plume:'#6a8aa8',cape:'#2a2218',capeE:'#74644e',buckle:'#9ad0ff',chains:0});
if(typeof WK!=='undefined'&&WK.caballero)WK.daren=WK.caballero;
PRES.daren=()=>[['Capitán Daren',S.rv['campos:diarioOk']?'Alguien leyó mi diario… y aun así vienes a por mí. Bien. Es la última orden que me queda: nadie cruza sin que yo lo decida.':'Nadie cruza sin que yo lo decida. Es la última orden que me quedó, y la voy a cumplir aunque ya no haya nadie a quien proteger.']];
CUT.daren=()=>esc()==='mara'?D('Capitán Daren','(Baja la espada y mira a la orilla.) Mara… ¿eres tú? Corté la cuerda porque me lo ordenaron, y nunca dejé de oír el río. Pasa, forastero. Cuídala.')
 :S.rv['campos:diarioOk']?D('Capitán Daren','(Baja la espada.) Entonces el diario llegó a alguien. Eso basta. Pasa: el bosque está más adelante, y no es más amable que yo.')
 :D('Capitán Daren','(Baja la espada.) Corté la cuerda porque me lo ordenaron, y nadie volvió a preguntarme por qué. Pasa. Ya no queda nada que custodiar.');
BEST.daren=['Capitán Daren','Tajos amplios, embestidas y estocadas. Llama a soldados de la guardia a media pelea.','Capitán de la guardia del puente. Cortó la cuerda con gente todavía en la otra orilla, por una orden sellada desde la capital. Se quedó de este lado, guardando un puente que ya no existía.','Sus tajos son lentos pero cubren mucho: esquiva de lado, no hacia atrás. Cuando pierde la calma, golpea más rápido; no abuses del bloqueo.'];
Object.assign(REGINFO,{campos:['Río con puente bloqueado','Jefe: Capitán Daren','Tres puntos de reparación · dos supervivientes · un diario','Hoguera antes de la arena','Salida al Valle Sereno · camino al Bosque Marchito']});

// ---- acceso desde el Valle Sereno (esquina noroeste) ----
{const v=RG.find(r=>r.id==='valle'),b=v.build;
 v.build=function(W){b.call(this,W);
  W.room(4,4,6,5,'p');W.portal('campos',6,6,{to:'campos',at:'back',k:'Campos del Exilio',sy:22});
  W.o('rock',4,4,1,1);W.o('rock',9,4,1,1)}}

// ---- mapa del reino ----
LAY.campos=[536,1150];LNK.push(['valle','campos',1]);
})();
