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
 ribera1:['Baranda arrastrada','Un trozo de baranda con restos de cuerda atada. Alguien grabó en la madera: «Lo que brilla llega primero. El agua no sabe lo que vale.»'],
 ribera2:['Caja del barquero','«Cuatro llamas marcan lo que trae el río. Se encienden como llegó todo: el cielo antes que el musgo.»'],
 ribera3:['Urna agrietada','«Lo rojo, lo que aún sangra, llega el último. Si enciendes algo en desorden, el sello te dirá cuántas llamas estaban en su sitio.»'],
 ribera4:['Mojón del vigía','«Cuatro velas, una por esquina, y el viento las gasta deprisa. La primera es la dorada, al sureste. La última es la verde, al suroeste. Por esta orilla nadie cruza en diagonal.»'],
 ribera5:['Registro de esclusas','«Se alzan de arriba abajo: norte, centro, sur. El que alce una de abajo antes que las de arriba inunda la sala, y entonces hay que empezar de nuevo.»'],
 ribera6:['Tabla con nombres','Una tabla clavada en la orilla, con nombres cortados a cuchillo. Los más recientes están sin terminar. Quedan dos huecos libres, uno junto al otro.'],
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
// v8.24: secuencia por código (sin arte nuevo). El puente se captura como piezas sueltas que se rompen de oeste a este,
//        cámara lenta en la caída, salpicadura, cuerpos arrastrados por la corriente y escombros flotando río abajo.
const BX=[26*16,30*16],BY=[19*16,22*16],bridgeOpen=()=>['c1','c2','c3'].every(id=>S.lv['campos:'+id]);
const PU={on:0,t:0,n:[],warn:0,tk:0,sp:0,broke:0,gone:0,pc:[],en:[],sheet:null,fx:null,gl:0};
const PU_T={snap:1.35,fade:5.2,end:6.2};
function puStart(){PU.on=1;PU.t=0;PU.broke=0;PU.gone=0;PU.tk=0;PU.sp=0;PU.gl=0;G.mode='puente';
 PU.n=fol.map(id=>W.npcs.find(q=>q.id===id)).filter(Boolean);
 PU.n.forEach((n,i)=>{n.x=P.x-14-i*14;n.y=P.y+(i?10:-10);n.mv=0;n.when=()=>false});   // los dibuja la secuencia
 P.s='idle';
 // se guarda el aspecto real del puente y el tramo pasa a ser agua: las tablas se dibujan como piezas sueltas encima
 PU.sheet=mkc(64,48);PU.sheet.getContext('2d').drawImage(W.base,BX[0],BY[0],64,48,0,0,64,48);
 for(let y=19;y<22;y++)for(let x=26;x<30;x++){const i=W.i(x,y);W.gd[i]='w';W.on[i]=null}
 W.bake();W._wl=null;S.rv['campos:roto']=1;
 PU.pc=[];
 for(let ty=19;ty<22;ty++)for(let tx=26;tx<30;tx++){if((tx===26&&ty===21)||(tx===29&&ty===19))continue;   // esquinas que ya eran agua
  for(let h=0;h<2;h++){const x=tx*16+h*8;
   PU.pc.push({sx:x-BX[0],sy:ty*16-BY[0],x:x+4,y:ty*16+8,tr:PU_T.snap+((x-BX[0])/64)*.5+R()*.12,s:0,d:0,vd:0,r:0,w:(R()<.5?-1:1)*(3+R()*5),vx:(R()-.5)*34,vy:6+R()*26,tt:0,fl:30+R()*14})}}
 PU.en=[{id:'player',x:P.x,y:P.y,k:0}].concat(PU.n.map((n,i)=>({id:KITS[n.id]?n.id:'aldeano',x:n.x,y:n.y,k:i+1})));
 PU.en.forEach(e=>{e.tf=PU_T.snap+((e.x-BX[0])/64)*.5+.12+(e.k?0:.3);e.st=0;e.d=0;e.vd=0;e.r=0;e.sink=0;e.age=0;e.rg=0;e.dir=e.k%2?-1:1;e.sp=[20,46,38][e.k]||40;e.y0=e.y});
 PU.fx={k:'pu',l:30,m:30};FX.push(PU.fx);
 toast('Las tablas no aguantan…');sfx(70,.6,'sawtooth',.07,40)}
function puTick(dt){
 const sl=(PU.t>PU_T.snap-.05&&PU.t<PU_T.snap+.75)?.45:1;dt*=sl;PU.t+=dt;const t=PU.t,E=PU.en;   // cámara lenta en el momento de la rotura
 cam.x+=(cl(P.x-GW/2,0,W.cols*16-GW)-cam.x)*Math.min(1,dt*6);cam.y+=(cl(P.y-GH/2,0,W.rows*16-GH)-cam.y)*Math.min(1,dt*6);
 if(t<PU_T.snap){   // crujido: cada vez más seguido, polvo y astillas
  const k=t/PU_T.snap;G.shake=Math.max(G.shake,.5+k*3);PU.tk-=dt;
  if(PU.tk<=0){PU.tk=.34-.25*k;sfx(55+R()*60+k*70,.2,'sawtooth',.05,40);const sx=BX[0]+R()*64,sy=BY[0]+R()*48;spark(sx,sy,'#8a6a3a',4,6);spark(sx,sy,'#cdbb94',2,3,.5)}
 }else if(!PU.broke){PU.broke=1;G.shake=10;G.flash=.5;sfx(45,.9,'sawtooth',.09,25);sfx(130,.45,'square',.05,30);toast('¡Se rompe!');
  [0,1,2].forEach(k=>FX.push({k:'ring',x:BX[0]+16+k*16,y:BY[0]+24,l:.9,m:.9,c:'200,230,255',big:1}))}
 // piezas del puente
 PU.pc.forEach(p=>{
  if(p.s===0&&t>=p.tr){p.s=1;spark(p.x,p.y,'#8a6a3a',3,5);spark(p.x,p.y,'#cdbb94',2,3,.5)}
  else if(p.s===1){p.vd+=340*dt;p.d+=p.vd*dt;p.x+=p.vx*dt;p.y+=p.vy*dt*.4;p.r+=p.w*dt;
   if(p.d>=14){p.s=2;p.d=14;p.w*=.35;FX.push({k:'ring',x:p.x,y:p.y+14,l:.45,m:.45,c:'200,230,255'});spark(p.x,p.y+14,'#cfe6ff',4,4);if(R()<.3)sfx(260+R()*160,.14,'triangle',.03,90)}}
  else if(p.s===2){p.tt+=dt;p.y+=p.fl*dt;p.x+=Math.sin(p.tt*2.4+p.sx)*6*dt;p.r+=p.w*dt;p.w*=Math.pow(.25,dt);if(p.tt>3.8)p.s=3}});
 // personajes: caen en orden de oeste a este, el jugador el último
 E.forEach(e=>{
  if(e.st===0){if(t>=e.tf){e.st=1;sfx(210,.3,'sine',.05,80)}}
  else if(e.st===1){e.vd+=300*dt;e.d+=e.vd*dt;e.r+=e.dir*dt*3.4;e.r=cl(e.r,-1.4,1.4);e.x+=e.dir*-6*dt;
   if(e.d>=16){e.st=2;e.d=16;e.age=0;G.shake=Math.max(G.shake,e.k?4:6);FX.push({k:'ring',x:e.x,y:e.y+16,l:.8,m:.8,c:'200,230,255',big:1});FX.push({k:'ring',x:e.x,y:e.y+16,l:.5,m:.5,c:'200,230,255'});
    spark(e.x,e.y+14,'#cfe6ff',18,9);spark(e.x,e.y+14,'#ffffff',8,5,.7);sfx(420,.3,'triangle',.06,110);sfx(90,.5,'sawtooth',.05,40);
    if(!PU.gl){PU.gl=1;toast('¡Mara! ¡Orrin!')}}}
  else if(e.st===2){e.age+=dt;e.y+=e.sp*dt;e.x=cl(e.x+Math.sin(e.age*2.5+e.k)*10*dt,BX[0]+8,BX[1]-8);
   e.r+=(e.dir*1.45-e.r)*Math.min(1,dt*3);e.sink=Math.min(e.k?30:8,e.sink+dt*(e.k?12:2.4));
   e.rg-=dt;if(e.rg<=0){e.rg=.26;FX.push({k:'ring',x:e.x,y:e.y+14,l:.5,m:.5,c:'200,230,255'});if(R()<.5)sfx(150+R()*70,.16,'sine',.03,90)}
   if(e.k&&e.sink>=26){e.st=3;FX.push({k:'ring',x:e.x,y:e.y+14,l:.9,m:.9,c:'200,230,255',big:1});spark(e.x,e.y+14,'#cfe6ff',14,6);sfx(180,.7,'sine',.05,60);
    if(E.every(q=>!q.k||q.st===3))toast('El río se los lleva.')}}});
 P.x=E[0].x;P.y=E[0].y;   // la cámara sigue al jugador, que la corriente arrastra
 if(t>=PU_T.end)puEnd()}
// dibujo de la secuencia (espacio de mundo, dentro de la cámara y del temblor)
function puDraw(){if(!PU.on||rg.id!=='campos')return;const t=PU.t,cy=Math.round(cam.y),fa=Math.min(1,Math.max(0,(t-PU_T.snap)/.6));
 if(fa>0){g.globalAlpha=.55*fa;for(let i=0;i<22;i++){const x=BX[0]+((i*53)%64),y=cy+((i*41+t*(38+(i%5)*9))%(GH+20))-10;fr(x,y,2+(i%3),1,'#dcf0ff')}g.globalAlpha=1}   // espuma de la corriente
 const pc=PU.pc;
 for(const p of pc){if(p.s!==2)continue;const al=Math.max(0,1-Math.max(0,p.tt-1.8)/2);g.save();g.globalAlpha=al;g.translate(Math.round(p.x),Math.round(p.y+p.d));g.rotate(p.r);g.drawImage(PU.sheet,p.sx,p.sy,8,16,-4,-8,8,16);g.restore()}
 const amp=Math.pow(Math.min(1,t/PU_T.snap),2);
 for(const p of pc){if(p.s>1)continue;const jy=p.s?0:Math.sin(t*46+p.sx*1.7+p.sy)*amp*.9;g.save();g.translate(Math.round(p.x),Math.round(p.y+p.d+jy));g.rotate(p.r);g.drawImage(PU.sheet,p.sx,p.sy,8,16,-4,-8,8,16);g.restore()}
 [...PU.en].sort((a,b)=>a.y-b.y).forEach(e=>{if(e.st===3)return;
  if(e.st<2){const sh=Math.max(0,1-e.d/16);if(e.st===0||e.d<8)shadow(e.x,e.y,13,.32*sh);body(e.id,e.x,e.y+e.d,1,0,t>PU_T.snap?'hit':'idle',0,{rot:e.r});return}
  // flotando: el cuerpo se hunde tras la línea de agua
  const wl=e.y+14;g.save();g.beginPath();g.rect(e.x-40,e.y-70,80,wl-(e.y-70));g.clip();body(e.id,e.x,e.y+14+e.sink*.6,1,0,'hit',0,{rot:e.r});g.restore();
  g.strokeStyle='rgba(220,240,255,.55)';g.lineWidth=1;g.beginPath();g.ellipse(e.x,wl,9+Math.sin(e.age*5)*1.5,3.5,0,0,6.283);g.stroke()})}
function puEnd(){PU.on=0;if(PU.fx)PU.fx.l=0;PU.sheet=null;PU.pc=[];PU.en=[];fol=[];S.rv['campos:escolta']='';S.rv['campos:muertos']=1;
 loadRegion(RG.findIndex(r=>r.id==='ribera'),0);
 P.x=6*16+8;P.y=8*16+8;P.fx=1;P.fy=0;P.ax=1;P.ay=0;cam.x=cl(P.x-GW/2,0,W.cols*16-GW);cam.y=cl(P.y-GH/2,0,W.rows*16-GH);W.reveal(P.x,P.y);
 P.hp=Math.max(1,Math.round(P.mhp*.4));P.st=P.mst;G.mode='play';save();
 say(D('El río','Frío. Barro. Un banco de arena bajo un cielo gris. La corriente te escupió río abajo; a Mara y a Orrin no los devolvió. El puente ya no existe, y no hay vuelta atrás. Si quieres llegar a la orilla este, tendrás que dar la vuelta por aquí.'))}
{const dp=drawP;drawP=function(){if(PU.on)return;dp()}}   // durante la secuencia el jugador lo dibuja puDraw
{const dx=drawFX;drawFX=function(f){if(f.k==='pu'){puDraw();return}dx(f)}}
{const d=draw;draw=function(){d();if(!PU.on)return;
 const b=Math.round(Math.min(1,PU.t/.5)*20);g.fillStyle='#000';g.fillRect(0,0,GW,b);g.fillRect(0,GH-b,GW,b);   // bandas de cine
 if(PU.t>PU_T.fade){g.fillStyle='rgba(0,0,0,'+Math.min(1,(PU.t-PU_T.fade)/.9)+')';g.fillRect(0,0,GW,GH)}}}

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
// ---- Remanso del Río: donde despiertas si el puente cae (v8.24: nivel propio, puzzle y no combate) ----
// Tres obstáculos en cadena, de oeste a este, con solo tres enemigos y UNA hoguera (a mitad de camino):
//   1) Orilla oeste  · 4 llamas (Mastermind). Tres notas dan el orden por deducción; el sello dice cuántas están en su sitio. Abre el puente del canal oeste.
//   2) Orilla central · 4 velas con tiempo, una por esquina; sin diagonales y con un arquero apuntándote. Abre la sala de esclusas.
//   3) Tres esclusas en orden norte → centro → sur. Si alzas una de abajo antes, la sala se inunda y se deshace TODO. Abre la compuerta del canal este.
// Después: hoguera, un bruto que guarda la salida y la subida a la orilla este. Pierdes a tus compañeros y el río no te regala nada.
RG.push({id:'ribera',n:'Remanso del Río',act:'Lo que el río devuelve',th:'valle',cols:56,rows:32,m:1.6,dm:1.3,out:1,fl:['',''],build(W){
 W.fillG('g');W.ring('wall',2);
 // --- caminos primero (el agua y los puentes los pisan después) ---
 W.path([[4,8],[10,8]],3,'p');W.path([[10,8],[10,27]],3,'p');                        // arranque y columna de la orilla oeste
 W.path([[10,10],[16,10]],3,'p');W.path([[10,19],[6,19]],3,'p');W.path([[10,25],[16,25]],3,'p');W.path([[10,27],[8,27]],3,'p');W.path([[4,27],[10,27]],3,'p');
 W.path([[10,16],[18,16]],3,'p');                                                   // hacia el canal oeste
 W.path([[22,16],[36,16]],3,'p');W.path([[24,8],[24,26]],3,'p');W.path([[35,8],[35,26]],3,'p');W.path([[24,26],[35,26]],3,'p');W.path([[24,14],[35,14]],3,'p');
 W.path([[30,13],[30,16]],3,'p');W.path([[24,20],[27,20]],3,'p');W.path([[35,24],[32,24]],3,'p');
 W.path([[40,16],[52,16]],3,'p');W.room(41,11,5,3,'p');W.room(48,18,5,4,'p');
 // --- agua: el río del norte y dos canales que parten el remanso en tres orillas ---
 W.g('w',2,2,52,3);
 W.g('w',19,5,3,25);W.g('b',19,15,3,3);                                              // canal oeste (puente con puerta de sello)
 W.g('w',37,5,3,25);W.g('b',37,15,3,3);                                              // canal este (compuerta de esclusa)
 // --- 1) ORILLA OESTE: cuatro llamas, orden por deducción ---
 W.puzzle('ribera_a',[[6,19,0],[16,10,1],[8,27,2],[16,25,3]],[2,0,3,1],[20,15,1,3]);
 {const z=W.pzs[W.pzs.length-1];z.kind='mm';z.punish=null}
 W.o('cross',6,10,1,1);W.note(6,10,'ribera1');W.o('crate',13,13,1,1);W.note(13,13,'ribera2');W.o('urn',13,23,1,1);W.note(13,23,'ribera3');
 W.en('hollow',13,19);
 W.item(7,8,{sou:150});W.item(14,27,{sou:250});
 W.portal('oeste',4,27,{to:'campos',at:'ribera_o',k:'Subir a la orilla oeste',sx:22,sy:0});
 // --- 2) ORILLA CENTRAL: cuatro velas con tiempo y sala de esclusas cerrada ---
 chamber(W,28,8,6,4,'f');W.g('f',30,12,1,1);
 W.puzzle('ribera_b',[[24,8,0],[35,8,1],[35,26,2],[24,26,3]],[2,1,0,3],[30,12,1,1]);
 {const z=W.pzs[W.pzs.length-1];z.kind='timed';z.limit=28;z.punish=null}
 W.o('rock',23,13,1,1);W.note(23,13,'ribera4');
 W.en('archer',32,20);
 // --- 3) ESCLUSAS: norte (dentro de la sala), centro y sur; solo valen en ese orden ---
 W.lever(30,9,'r1',{k:'Alzar la esclusa del norte',m:'Esclusa norte alzada'});
 W.lever(27,20,'r2',{k:'Alzar la esclusa del centro',m:'Esclusa central alzada'});
 W.lever(32,24,'r3',{k:'Alzar la esclusa del sur',m:'Esclusa sur alzada'});
 W.o('crate',26,19,1,1);W.note(26,19,'ribera5');
 W.sgate(38,15,1,3,['r1','r2','r3'],{msg:'La compuerta del canal este se alza'});
 // --- ORILLA ESTE: respiro, un guardián y la salida ---
 W.fire(43,12);
 W.o('tomb',45,12,1,1);W.note(45,12,'ribera6');
 W.en('brute',48,15);
 W.item(50,19,{n:2});W.item(51,21,{sou:600});
 W.portal('este',52,16,{to:'campos',at:'ribera_e',k:'Subir a la orilla este',sx:-22,sy:0});
 W.sc('tree',34,3,5,50,24,{avoid:'pfwbk',seed:51,gap:2});W.sc('bush',22,3,5,50,24,{avoid:'pwb',seed:52,gap:1});W.sc('rock',10,3,5,50,24,{avoid:'pfwb',seed:53,gap:2});
}});
// esclusas: alzar una de abajo antes que las de arriba inunda la sala y deshace todo el progreso
{const p1=pull;pull=function(l){if(rg.id==='ribera'&&/^r[123]$/.test(l.id)&&!S.lv['ribera:'+l.id]){const req={r2:'r1',r3:'r2'}[l.id];
  if(req&&!S.lv['ribera:'+req]){['r1','r2','r3'].forEach(i=>{S.lv['ribera:'+i]=0});toast('La esclusa de abajo inunda la sala: todo vuelve a su sitio');G.shake=6;sfx(70,.6,'sawtooth',.07,40);
   spark(l.x,l.y-8,'#9fd0ff',16,10);FX.push({k:'ring',x:l.x,y:l.y,l:.8,m:.8,c:'200,230,255',big:1});save();return}}
 p1(l)}}
Object.assign(REGINFO,{ribera:['Remanso aguas abajo del puente caído','Tres obstáculos en cadena: llamas, velas con tiempo y esclusas en orden','Hoguera solo tras cruzar el canal este','Salida a la orilla oeste y a la orilla este de los Campos del Exilio']});
LAY.ribera=[536,1308];LNK.push(['campos','ribera',1]);

})();
