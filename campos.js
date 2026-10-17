// ===== CAMPOS DEL EXILIO (zona de prueba · objetivo "reparar / activar") =====
// Carga DESPUÉS de jorge.js. Se entra desde el Valle Sereno.
// Objetivo (PUZZLE, pocos enemigos): el puente sobre el río está roto. Hay que reparar tres puntos EN ORDEN
// (cabrestante → viga → mecanismo; el plano del carpintero lo dice) repartidos por la orilla oeste. Al repararlos todos,
// el puente se abre (frágil, con tablas que faltan) y se accede a la orilla este. El progreso se guarda con las palancas (S.lv).
// DECISIÓN MORAL: el puente solo aguanta a UNO más. Si cruzas con Mara y Orrin a la vez, cede: caen al río, se los lleva
// la corriente y tú apareces en el Remanso del Río (mapa nuevo). El puente queda destruido (S.rv['campos:roto']) y la única
// ruta a la orilla este pasa por el Remanso. Pierdes las dos recompensas (frasco de Mara y resistencia de Orrin).
(function(){
Object.assign(NOTES,{
 campos1:['Cartel torcido','«Puente de Valdora. Peaje: un nombre.» Alguien tachó la última palabra con carbón.'],
 campos2:['Diario de un soldado','«Nos ordenaron cortar el puente para que la ceniza no cruzara. Nadie dijo qué hacer con los que estaban al otro lado.»'],
 campos3:['Carreta volcada','Sacos de grano, vacíos. Las marcas en la madera cuentan días, no kilómetros.'],
 campos5:['Muro sin musgo','Todo el muro del norte está cubierto de líquen, menos este tramo. Alguien lo cerró con prisa y lo limpió con las manos.'],
 campos6:['Plano del carpintero','«Primero el cabrestante, que levanta el peso. Después la viga, que lo sostiene. Al final se engrasa el mecanismo, o se atasca. Y ojo: el puente aguanta a uno más, no a tres.»'],
 ribera1:['Baranda arrastrada','Un trozo de baranda con restos de cuerda atada. El río devuelve lo que no se quedó.'],
 ribera2:['Compuerta del molinero','«Si el canal se desborda, alzad la compuerta. No la toquéis si alguien duerme río abajo.»'],
 campos4:['Piedra con grabados','Tres juramentos distintos, tallados por tres manos distintas. Los tres dicen «volveré por ti».']});

RG.push({id:'campos',n:'Campos del Exilio',act:'Un puente cortado y tres promesas rotas',th:'valle',cols:56,rows:40,m:1.4,dm:1.2,out:1,fl:['',' · Orilla este'],mini:'daren',build(W){
 W.fillG('g');W.ring('wall',2);
 // río de norte a sur con un único puente (bloqueado hasta reparar los tres puntos)
 const roto=!!S.rv['campos:roto'];
 W.g('w',26,2,4,36);if(!roto){W.g('b',26,19,4,3);W.g('w',26,21,1,1);W.g('w',29,19,1,1)}   // puente frágil: faltan tablas en las esquinas
 W.o('rubble',25,18,1,1);W.o('rubble',30,22,1,1);if(roto){W.o('rubble',25,22,1,1);W.o('rubble',30,18,1,1)}
 W.path([[3,20],[25,20]],3,'p');W.path([[30,20],[52,20]],3,'p');
 W.path([[10,20],[10,9]],3,'p');W.path([[14,20],[14,31]],3,'p');W.path([[21,20],[21,7]],3,'p');
 // --- punto 1: Molino fortificado (NO) ---
 W.house(6,4,8,5,3);W.o('barrel',8,10,1,1);W.o('crate',12,10,1,1);W.lever(10,10,'c1',{k:'Reparar el cabrestante',m:'Cabrestante reparado'});
 W.en('hollow',9,13);
 // --- punto 2: Granja abandonada (SO) ---
 W.house(8,32,7,5,2);W.house(17,33,6,4,3);W.o('crate',12,29,1,1);W.o('barrel',16,30,1,1);W.lever(14,31,'c2',{k:'Colocar la viga',m:'Viga colocada'});
 W.en('hollow',12,26);
 // --- punto 3: Almacén de suministros (N) ---
 W.house(18,3,7,4,3);W.o('crate',17,8,1,1);W.o('crate',23,8,1,1);W.lever(21,8,'c3',{k:'Engrasar el mecanismo',m:'Mecanismo engrasado'});
 W.en('soldier',19,11);
 // sin patrullas ni emboscada: aquí se piensa, no se pelea. Plano del carpintero junto al puente (pista del orden)
 W.o('crate',24,23,1,1);W.note(24,23,'campos6');
 // barricada del puente: se abre al reparar los tres puntos
 if(!roto)W.sgate(27,19,2,3,['c1','c2','c3'],{msg:'El puente vuelve a sostenerse… por ahora'});
 // --- orilla este: recompensa ---
 // arena del Capitán Daren: cámara cerrada en la orilla este; la puerta se cierra al entrar y se abre al vencerlo
 chamber(W,38,14,12,12,'f');W.clr(37,19,1,3);W.g('f',37,19,1,3);W.setArena({x:38,y:14,w:12,h:12},[[37,19,1,3]],44,19);
 W.o('brazier',38,14,1,1);W.o('brazier',49,14,1,1);W.o('statue',44,15,1,1);
 W.portal('bosque',48,20,{to:'bosque',at:'back',k:'Camino al Bosque Marchito',sx:-22,sy:0,cond:()=>!!S.bk.daren,lock:'El capitán aún guarda el paso'});
 W.item(41,22,{n:3});W.item(46,23,{sou:700});W.item(44,18,{n:2});
 W.en('archer',36,29);
 W.o('tomb',47,16,1,1);W.note(47,16,'campos4');
 // --- recuperar: el diario del capitán, en una sala sellada (muro falso) al norte de la orilla este ---
 chamber(W,40,4,8,5,'f');W.fwall(43,9,2,1,'b');W.o('brazier',40,4,1,1);W.o('brazier',47,4,1,1);W.o('tomb',44,5,1,1);W.item(43,7,{q:'campdiario',k:'Recoger el diario'});
 
 W.o('rock',41,11,1,1);W.note(41,11,'campos5');
 W.fire(4,22);W.fire(33,20);
 // --- supervivientes: Mara y Orrin esperan junto al camino de entrada; el que elijas llevar acaba en la orilla este ---
 if(!S.rv['campos:muertos']){const e=S.rv['campos:escolta'];W.npc('mara',e==='mara'?35:7,e==='mara'?22:23);W.npc('orrin',e==='orrin'?35:8,e==='orrin'?22:17)}
 W.portal('back',4,20,{to:'valle',at:'campos',k:'Volver al Valle',sx:22,sy:0});
 // tras la caída del puente, la única ruta a la orilla este baja por el Remanso del Río (una entrada en cada orilla)
 if(roto){W.room(22,29,4,3,'p');W.portal('ribera_o',24,30,{to:'ribera',at:'oeste',k:'Bajar al Remanso del Río',sx:-22,sy:0});
  W.room(30,32,4,3,'p');W.portal('ribera_e',32,33,{to:'ribera',at:'este',k:'Bajar al Remanso del Río',sx:22,sy:0})}
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
let fol=[];   // quiénes te siguen (máx. 2). Con uno el puente aguanta; con los dos, cede.
const SV={mara:'Mara',orrin:'Orrin'},otro=id=>id==='mara'?'orrin':'mara',esc=()=>S.rv['campos:escolta']||'';
const SVT={
 mara:['Mara, superviviente','Salí de Valdora con otros, pero el río se llevó el puente y a casi todos. Mi hermano estaba de guardia en la otra orilla. Orrin y yo somos los únicos que quedamos, y el puente reparado no aguantará a tres. Solo puedo pedirte que me lleves a mí.'],
 orrin:['Orrin, soldado herido','Fui de la guardia del puente. Las piernas ya no me responden, pero vi lo que pasó aquí. Mara y yo somos los únicos que quedamos y el puente no resistirá a tres. Si tienes que elegir, elige con los ojos abiertos.']};
const surv=id=>()=>{
 const o=otro(id),nm=SV[id];S.rv['campos:'+id]=1;let n;
 if(esc()===id)n=D(nm,id==='mara'?'Gracias por traerme. Aquí, al otro lado del río, por fin puedo respirar. Mantendré encendida la hoguera para quien venga detrás.':'Hacía años que no veía este lado del río. Siéntate un momento, forastero; los ojos ya los tienes abiertos.');
 else if(esc()===o)n=D(nm,'Lo entiendo. Alguien tenía que quedarse de este lado. Ve tranquilo: yo cuidaré el camino hasta que vuelvas.');
 else if(fol.includes(id))n=D(nm,'Camino detrás de ti. Si caes, me quedaré donde estoy.'+(fol.length>1?' Y este puente no está hecho para tres, ya lo sabes.':''),[['Espera aquí',()=>{fol=fol.filter(q=>q!==id);toast(nm+' se queda esperando');return D(nm,'Aquí estaré.')}],['Seguir',null]]);
 else if(fol.includes(o))n=D(SVT[id][0],'Veo que '+SV[o]+' ya va contigo. Yo también quiero cruzar. El puente reparado no aguantará a tres, pero no voy a pedirte que me abandones: eso lo decides tú.',[['Llevarnos a los dos',()=>D(nm,'Piénsalo bien. Si el puente cede, no habrá segunda oportunidad para ninguno de los tres. ¿Seguro?',[['Sí, vengan los dos',()=>{fol.push(id);toast('Mara y Orrin te siguen · el puente no aguantará a tres');return D(nm,'Entonces cruzaremos juntos. Que el puente decida.')}],['Pensarlo',null]])],['Todavía no',null]]);
 else n=D(SVT[id][0],SVT[id][1],[['Llevar a '+nm,()=>D(nm,'Piénsalo bien: el puente solo aguantará a uno más. Quien se quede aquí tendrá que quedarse. '+(id==='mara'?'Ella te regalaría un frasco de remedios.':'Él te enseñaría a aguantar mejor los golpes.')+' ¿Seguro?',[['Sí, ven conmigo',()=>{fol=[id];toast(nm+' te sigue · llévalo a la orilla este');return D(nm,id==='mara'?'Gracias. Iré pisando tus huellas.':'Despacio. Te seguiré como pueda.')}],['Pensarlo',null]])],['Todavía no',null]]);
 if(S.rv['campos:diario']&&!S.rv['campos:diarioOk'])return D(nm,id==='mara'?'Esa letra… es la de mi hermano. ¿Dónde lo encontraste?':'Esa es la letra del capitán Daren. ¿Dónde la encontraste?',
  [['Entregar el diario',()=>{S.rv['campos:diarioOk']=id;S.souls+=400;toast('Diario entregado · +400 almas');save();return D(nm,id==='mara'?'Siempre supe que había cortado él la cuerda. Lo que no sabía es que se lo ordenaron. Gracias por traerme la verdad; es más pesada que el miedo, pero es mía.':'Lo vi atar la cuerda llorando, y no pude decir nada. Ahora hay alguien que puede contarlo. Gracias, forastero.')}]].concat(n.o||[['Cerrar',null]]));
 return n};
NPC.mara=surv('mara');NPC.orrin=surv('orrin');

// ---- orden de reparación: cabrestante (c1) → viga (c2) → mecanismo (c3). El plano del carpintero junto al puente lo cuenta ----
{const p0=pull;pull=function(l){if(rg.id==='campos'&&!S.lv['campos:'+l.id]){const req={c2:'c1',c3:'c2'}[l.id];
  if(req&&!S.lv['campos:'+req]){toast(l.id==='c2'?'La viga no se sostiene sin el cabrestante':'El mecanismo se atascaría: antes va la viga');sfx(90,.2,'square',.04,70);return}}
 p0(l)}}

// ---- consecuencia: cruzar con los dos. El puente cede, caen al río, la corriente se los lleva y despiertas en el Remanso ----
const BX=[26*16,30*16],BY=[19*16,22*16],bridgeOpen=()=>['c1','c2','c3'].every(id=>S.lv['campos:'+id]);
const PU={on:0,t:0,n:[],warn:0,tk:0,sp:0,broke:0,gone:0};
function puStart(){PU.on=1;PU.t=0;PU.broke=0;PU.gone=0;PU.tk=0;PU.sp=0;G.mode='puente';
 PU.n=fol.map(id=>W.npcs.find(q=>q.id===id)).filter(Boolean);
 PU.n.forEach((n,i)=>{n.x=P.x-14-i*14;n.y=P.y+(i?10:-10);n.mv=0});
 PU.p0=PU.n.map(n=>({x:n.x,y:n.y}));PU.q0={x:P.x,y:P.y};P.s='idle';toast('¡El puente cede!');sfx(70,.6,'sawtooth',.07,40)}
function puTick(dt){PU.t+=dt;const t=PU.t,all=()=>[P].concat(PU.n);
 cam.x+=(cl(P.x-GW/2,0,W.cols*16-GW)-cam.x)*Math.min(1,dt*6);cam.y+=(cl(P.y-GH/2,0,W.rows*16-GH)-cam.y)*Math.min(1,dt*6);
 if(t<1.4){G.shake=Math.max(G.shake,1+t*2.5);PU.tk-=dt;if(PU.tk<=0){PU.tk=.25;sfx(60+R()*50,.22,'sawtooth',.05,40);spark(BX[0]+R()*64,BY[0]+R()*48,'#8a6a3a',5,6)}return}
 if(!PU.broke){PU.broke=1;   // las tablas se rompen: el tramo pasa a ser agua
  for(let y=19;y<22;y++)for(let x=26;x<30;x++){const i=W.i(x,y);W.gd[i]='w';W.on[i]=null}
  W.bake();W._wl=null;S.rv['campos:roto']=1;
  G.shake=9;G.flash=.5;sfx(45,.9,'sawtooth',.09,25);[0,1,2].forEach(k=>FX.push({k:'ring',x:BX[0]+16+k*16,y:BY[0]+24,l:.9,m:.9,c:'200,230,255',big:1}));
  spark(P.x,P.y,'#8a6a3a',24,12);spark(P.x,P.y,'#cfe6ff',16,6)}
 const f=t-1.4;   // caída y arrastre: el río corre hacia el sur
 all().forEach((e,k)=>{const sp=k?[40,34][k-1]:26,o0=k?PU.p0[k-1]:PU.q0;e.y=o0.y+f*sp;e.x=cl(o0.x+Math.sin(f*3+k*2)*5,BX[0]+8,BX[1]-8)});
 PU.sp-=dt;if(PU.sp<=0){PU.sp=.18;all().forEach(e=>{if(e.when&&!e.when())return;FX.push({k:'ring',x:e.x,y:e.y,l:.5,m:.5,c:'200,230,255'});spark(e.x,e.y,'#cfe6ff',3,4)})}
 if(t>3.3&&!PU.gone){PU.gone=1;PU.n.forEach(n=>{FX.push({k:'ring',x:n.x,y:n.y,l:.9,m:.9,c:'200,230,255',big:1});spark(n.x,n.y,'#cfe6ff',14,6);n.when=()=>false});sfx(180,.7,'sine',.05,60);toast('El río se los lleva.')}
 if(t>4.6)puEnd()}
function puEnd(){PU.on=0;fol=[];S.rv['campos:escolta']='';S.rv['campos:muertos']=1;
 loadRegion(RG.findIndex(r=>r.id==='ribera'),0);
 P.x=6*16+8;P.y=8*16+8;P.fx=1;P.fy=0;P.ax=1;P.ay=0;cam.x=cl(P.x-GW/2,0,W.cols*16-GW);cam.y=cl(P.y-GH/2,0,W.rows*16-GH);W.reveal(P.x,P.y);
 P.hp=Math.max(1,Math.round(P.mhp*.4));P.st=P.mst;G.mode='play';save();
 say(D('El río','Frío. Barro. Un banco de arena bajo un cielo gris. La corriente te escupió río abajo; a Mara y a Orrin no los devolvió. El puente ya no existe, y no hay vuelta atrás. Si quieres llegar a la orilla este, tendrás que dar la vuelta por aquí.'))}
{const d=draw;draw=function(){d();if(!PU.on||PU.t<3.5)return;g.fillStyle='rgba(0,0,0,'+Math.min(1,(PU.t-3.5)/1)+')';g.fillRect(0,0,GW,GH)}}

{const u=update;update=function(dt){u(dt);
 if(PU.on){puTick(dt);return}
 if(!S||!W||!P||rg.id!=='campos'){fol=[];PU.warn=0;return}
 if(!fol.length)return; if(P.s==='dead'){fol=[];return} if(G.mode!=='play')return;
 fol.forEach((id,k)=>{const n=W.npcs.find(q=>q.id===id);if(!n)return;const l=(k&&W.npcs.find(q=>q.id===fol[0]))||P,dx=l.x-n.x,dy=l.y-n.y,d=Math.hypot(dx,dy);
  if(d>26){const sp=(d>90?95:id==='orrin'?55:68)*dt,vx=dx/d*sp,vy=dy/d*sp;if(!W.hit(n.x+vx,n.y,5,5))n.x+=vx;if(!W.hit(n.x,n.y+vy,5,5))n.y+=vy;n.tx=n.x/16|0;n.ty=n.y/16|0}});
 const onB=P.x>BX[0]-8&&P.x<BX[1]+8&&P.y>BY[0]&&P.y<BY[1];
 if(fol.length===2&&bridgeOpen()&&!S.rv['campos:roto']){
  if(onB&&P.x<27*16+2&&!PU.warn){PU.warn=1;toast('Las tablas crujen bajo el peso de tres…');G.shake=3;sfx(80,.4,'sawtooth',.05,50)}
  if(!onB)PU.warn=0;
  if(onB&&P.x>=27*16+12){puStart();return}   // pasada la primera tabla ya no hay vuelta atrás
 }
 if(fol.length===1){const id=fol[0],n=W.npcs.find(q=>q.id===id);if(!n)return;
  if(Math.hypot(n.x-552,n.y-328)<56&&Math.hypot(P.x-552,P.y-328)<80){fol=[];S.rv['campos:escolta']=id;if(id==='mara'){S.souls+=500;S.fmax++;S.flasks=S.fmax;toast('Mara te regala su frasco de remedios · +1 frasco máximo · +500 almas')}else{S.souls+=300;S.frag+=3;S.A.res++;P.mst=mst();P.st=P.mst;toast('Orrin te enseña a aguantar el golpe · +1 Resistencia · +3 fragmentos')}sfx(500,.4,'sine',.06,900);save()}}
}}

// ---- juramento de la zona: cómo se cerró (queda guardado en la partida y se refleja en el Diario y en otros PNJ) ----
const campCierre=()=>S.rv['campos:muertos']?'ambos':esc()||(['c1','c2','c3'].every(id=>S.lv['campos:'+id])?'puente':'');
const campJur=()=>({mara:'Elegir a quien espera: llevaste a Mara a la otra orilla y dejaste a Orrin de este lado.',orrin:'Elegir al testigo: llevaste a Orrin, que lo vio todo, y dejaste a Mara con su pregunta sin responder.',ambos:'Querer salvar a todos: cruzaste con Mara y con Orrin a la vez y el puente no aguantó. El río se los llevó, y a ti con ellos.',puente:'Reparar lo roto: abriste el puente, pero todavía nadie lo ha cruzado a salvo.','':'Aún sin cerrar: el puente sigue cortado.'})[campCierre()]+(S.rv['campos:diarioOk']?' Recuperaste el diario del capitán y ahora se sabe quién ordenó cortarlo.':'');
if(typeof PERS!=='undefined'){
 const ficha=(id,ofi,pers)=>{const f=[SV[id],()=>!!S.rv['campos:'+id],[]];Object.defineProperty(f,2,{get:()=>[['Ubicación',S.rv['campos:muertos']?'Arrastrado por el río, aguas abajo del puente':esc()===id?'Orilla este de los Campos del Exilio':'Orilla oeste de los Campos del Exilio'],['Oficio',ofi],['Personalidad',pers],['Juramento de la zona',campJur()]]});PERS.push(f)};
 ficha('mara','Superviviente de Valdora','Callada y terca. Perdió a casi todos en el río y aun así sigue pensando en el hermano que cortó el puente.');
 ficha('orrin','Soldado de la guardia del puente','Pausado y amargo. Cojea, no se queja y guarda lo que vio como quien guarda una deuda.')}
if(typeof NPC.elda==='function'){const e0=NPC.elda;NPC.elda=()=>{const n=e0();if(esc()&&!S.rv['campos:eldaOk']){const nx0=n.nx;n.nx=()=>{S.rv['campos:eldaOk']=1;return D('Elda',esc()==='mara'?'Una mujer llamada Mara me escribió desde los Campos del Exilio. Dice que alguien eligió llevarla a ella. Hacía mucho que no oía eso de nadie.':'Un viejo soldado llamado Orrin me mandó recado desde los Campos del Exilio. Dice que alguien eligió escucharlo a él. A mí me bastó con saber que alguien quedaba para contarlo.',null,nx0)}}return n}}

// ---- jefe: Capitán Daren (el que cortó el puente por orden de la capital). Mini-jefe de la zona; vencerlo abre el camino al Bosque ----
BS.daren={n:'Capitán Daren',mini:1,hp:330,w:18,h:34,c:'#5a4a3a',tr:'#9ad0ff',sp:34,so:1500,fr:3,dm:1.2,wl:24,
 ph:[{a:['bsl','bstab'],s:1},{a:['bsl','bov','bstab'],s:1.3,adds:2,addT:'soldier',msg:'Llama a quienes cortaron la cuerda'},{a:['bov','bstab','bsl'],s:1.5,hold:.3,msg:'Ya no recuerda a quién obedecía'}]};
if(typeof KITS!=='undefined'&&KITS.caballero)KITS.daren=Object.assign({},KITS.caballero,{A:['#4a3e30','#74644e','#2a2218'],hc:['#5a5048','#8a8070','#2e2a24'],eye:'#9ad0ff',plume:'#6a8aa8',cape:'#2a2218',capeE:'#74644e',buckle:'#9ad0ff',chains:0});
if(typeof WK!=='undefined'&&WK.caballero)WK.daren=WK.caballero;
PRES.daren=()=>[['Capitán Daren',S.rv['campos:diarioOk']?'Alguien leyó mi diario… y aun así vienes a por mí. Bien. Es la última orden que me queda: nadie cruza sin que yo lo decida.':'Nadie cruza sin que yo lo decida. Es la última orden que me quedó, y la voy a cumplir aunque ya no haya nadie a quien proteger.']];
CUT.daren=()=>S.rv['campos:muertos']?D('Capitán Daren','(Baja la espada.) Vi caer el puente desde esta orilla, otra vez sin poder hacer nada. Pasa, forastero. Y perdóname: yo también corté una cuerda.')
 :esc()==='mara'?D('Capitán Daren','(Baja la espada y mira a la orilla.) Mara… ¿eres tú? Corté la cuerda porque me lo ordenaron, y nunca dejé de oír el río. Pasa, forastero. Cuídala.')
 :S.rv['campos:diarioOk']?D('Capitán Daren','(Baja la espada.) Entonces el diario llegó a alguien. Eso basta. Pasa: el bosque está más adelante, y no es más amable que yo.')
 :D('Capitán Daren','(Baja la espada.) Corté la cuerda porque me lo ordenaron, y nadie volvió a preguntarme por qué. Pasa. Ya no queda nada que custodiar.');
BEST.daren=['Capitán Daren','Tajos amplios, embestidas y estocadas. Llama a soldados de la guardia a media pelea.','Capitán de la guardia del puente. Cortó la cuerda con gente todavía en la otra orilla, por una orden sellada desde la capital. Se quedó de este lado, guardando un puente que ya no existía.','Sus tajos son lentos pero cubren mucho: esquiva de lado, no hacia atrás. Cuando pierde la calma, golpea más rápido; no abuses del bloqueo.'];
Object.assign(REGINFO,{campos:['Río con puente bloqueado','Jefe: Capitán Daren','Tres reparaciones en orden · dos supervivientes · un diario · el puente no aguanta a tres','Hoguera antes de la arena','Salida al Valle Sereno · camino al Bosque Marchito']});

// ---- acceso desde el Valle Sereno (esquina noroeste) ----
{const v=RG.find(r=>r.id==='valle'),b=v.build;
 v.build=function(W){b.call(this,W);
  W.room(4,4,6,5,'p');W.portal('campos',6,6,{to:'campos',at:'back',k:'Campos del Exilio',sy:22});
  W.o('rock',4,4,1,1);W.o('rock',9,4,1,1)}}

// ---- mapa del reino ----
LAY.campos=[536,1150];LNK.push(['valle','campos',1]);
// ---- Remanso del Río: donde despiertas si el puente cae. Mapa pequeño, sin atajos: la única ruta a la orilla este ----
RG.push({id:'ribera',n:'Remanso del Río',act:'Lo que el río devuelve',th:'valle',cols:50,rows:24,m:1.5,dm:1.25,out:1,fl:['',''],build(W){
 W.fillG('g');W.ring('wall',2);
 W.g('w',2,2,46,5);                                       // el río que te trajo
 W.path([[4,8],[16,8]],3,'p');W.path([[16,8],[16,15]],3,'p');W.path([[5,15],[46,15]],3,'p');
 W.g('w',33,8,2,13);W.g('b',33,14,2,3);W.sgate(33,14,2,3,['r1'],{msg:'La compuerta se alza'});   // canal con compuerta cerrada
 W.path([[26,15],[26,10]],3,'p');W.lever(26,10,'r1',{k:'Alzar la compuerta',m:'Compuerta alzada'});
 W.room(37,11,10,9,'p');
 W.fire(20,12);
 W.o('cross',6,9,1,1);W.note(6,9,'ribera1');W.o('crate',28,10,1,1);W.note(28,10,'ribera2');
 W.en('hollow',12,15);W.en('archer',30,13);W.en('hollow',23,18);W.en('soldier',29,12);W.en('soldier',41,13);
 W.item(8,9,{sou:200});W.item(27,18,{sou:400});W.item(44,18,{n:1});
 W.portal('oeste',4,15,{to:'campos',at:'ribera_o',k:'Subir a la orilla oeste',sx:22,sy:0});
 W.portal('este',46,15,{to:'campos',at:'ribera_e',k:'Subir a la orilla este',sx:-22,sy:0});
 W.sc('tree',16,3,10,44,11,{avoid:'pfwbk',seed:51,gap:2});W.sc('bush',14,3,10,44,11,{avoid:'pwb',seed:52,gap:1});W.sc('rock',8,3,10,44,11,{avoid:'pfwb',seed:53,gap:2});
}});
Object.assign(REGINFO,{ribera:['Remanso aguas abajo del puente caído','Compuerta cerrada · un solo camino','Hoguera junto al cruce','Salida a la orilla oeste y a la orilla este de los Campos del Exilio']});
LAY.ribera=[536,1308];LNK.push(['campos','ribera',1]);

})();
