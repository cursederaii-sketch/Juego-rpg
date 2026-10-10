// ===== ZONAS NUEVAS: Marismas Cenicientas, Cantera Hundida y Torre del Vigía (cada una con su jefe, lore y recompensa) =====
// --- datos: jefes, sprites, reliquias, arma, verdades, notas, diálogos y bestiario ---
BS.madre={n:'La Madre del Fango',mini:1,hp:270,w:18,h:30,c:'#3a5a34',tr:'#9aff7a',sp:30,so:1000,fr:2,dm:1.05,wl:22,drop:{rel:'cieno',tr:'marisma'},ph:[{a:['bov','pounce'],s:1},{a:['bov','bsl','pounce'],s:1.2,adds:2,msg:'El fango se levanta'},{a:['pounce','bov','cinder'],s:1.35,hold:.3,rocks:1,msg:'La marisma la reclama'}]};
BS.capataz={n:'El Capataz de Hierro',mini:1,hp:310,w:18,h:34,c:'#5a4a42',tr:'#ff9a3c',sp:28,so:1100,fr:3,dm:1.15,wl:26,drop:{w:'pico',tr:'cantera'},ph:[{a:['bsl','bov'],s:1,hold:.15},{a:['bov','bov','bstab'],s:1.2,adds:2,addT:'brute',msg:'Alza el pico'},{a:['bov','bsl','bstab'],s:1.4,hold:.3,rocks:1,msg:'La mina se derrumba'}]};
BS.vigia={n:'El Vigía de Ceniza',mini:1,hp:260,w:14,h:32,c:'#6a6a88',tr:'#ffd88a',sp:36,so:1200,fr:3,dm:1.1,wl:22,drop:{rel:'vigia',tr:'torre'},ph:[{a:['arrow','blink','bsl'],s:1},{a:['arrow','arrow','blink','cinder'],s:1.25,adds:2,addT:'archer',msg:'Enciende el faro'},{a:['blink','cinder','arrow','bov'],s:1.45,hold:.3,rocks:1,msg:'El faro se apaga'}]};
Object.assign(KITS,{
 madre:{big:1,bw:15,th:11,lh:8,hw:10,hh:10,A:['#3a5a34','#5a8a4a','#1e3420'],boot:'#14200e',belt:'#2a2a14',buckle:'#9aff7a',head:'hood',hc:['#2a3e22','#46663a','#16240f'],eye:'#9aff7a',cape:'#1e3420',capeE:'#5a8a4a',pauld:2,wp:'staff',skirt:1},
 capataz:{big:1,bw:16,th:12,lh:8,hw:11,hh:10,A:['#5a4a42','#7a665a','#33281f'],boot:'#1c1410',belt:'#2a1a10',buckle:'#ff9a3c',head:'helm',hc:['#4a3a32','#6a5a4e','#2a1e18'],eye:'#ff9a3c',cape:'#33281f',capeE:'#7a665a',pauld:2,wp:'hammer'},
 vigia:{big:1,bw:13,th:11,lh:9,hw:9,hh:9,A:['#6a6a88','#9a9ab8','#3a3a52'],boot:'#1e1e2e',belt:'#2a2a3e',buckle:'#ffd88a',head:'hood',hc:['#3e3e58','#5e5e7e','#26263a'],eye:'#ffd88a',cape:'#3a3a52',capeE:'#9a9ab8',pauld:1,wp:'staff',skirt:1}});
RELS.cieno=['Corazón de Cieno','Una esquiva perfecta te devuelve 20 de resistencia en vez de 8.'];RELSRC.cieno='Cae de la Madre del Fango';
RELS.vigia=['Farol del Vigía','La ventana de parada perfecta es un 40% más larga.'];RELSRC.vigia='Cae del Vigía de Ceniza';
WP.pico={n:'Pico del Cantero',d:'Lento y contundente: sus golpes pesados parten cualquier guardia.',wl:21,l:{d:16,c:15,r:30,t:.46,a:[.14,.26]},h:{d:40,c:34,r:38,t:.95,a:[.44,.58]},lore:['La herramienta de quienes sacaban cristal de la cantera para encender los faroles del reino.','El mango está pulido por años de manos, y una de esas manos dejó una marca de quemadura en forma de dedo.','Dicen que el último cantero la dejó clavada en la roca para que alguien, algún día, abriera lo que habían sellado.']};
Object.assign(TRU,{
 marisma:['Lo que el pantano se tragó','El reino arrojó aquí lo que quería olvidar: nombres, cartas, una corona rota. Entre los papeles que la Madre sostiene hay una carta tuya, sin enviar: «Si vuelvo, que no me reconozcan».'],
 cantera:['El precio de la piedra','Los picos no cavaban hierro: cavaban un lugar donde guardar lo olvidado. El Capataz recibió la orden de sellar la mina con quienes aún recordaban. En el sello brilla una firma: la tuya.'],
 torre:['La última guardia','Desde esta torre se vio arder el reino. El Vigía dio la alarma tres noches seguidas. El rey ordenó apagar el faro, y tú llevaste la orden escrita. Él la cumplió. Nunca se perdonó haberlo hecho.']});
Object.assign(NOTES,{
 marisma1:['Cruz hundida','Aquí se enterró sin nombre a quien aún recordaba. El agua subió igual, como si el pantano quisiera devolverlo.'],
 marisma2:['Carta mojada','«No me busquen en el pueblo. Si preguntan, nunca estuve.» La tinta se corrió; el nombre ya no se lee.'],
 cantera1:['Cuaderno del cantero','Tres turnos por semana. Tallamos los cristales que encienden los faroles. Hoy el capataz dijo que sellarán la galería sur. Nadie preguntó por qué.'],
 cantera2:['Vagoneta vacía','Alguien dibujó con carbón una puerta en la roca, con una sola palabra encima: «Salida».'],
 torre1:['Bitácora del Vigía','Noche uno: humo al este. Noche dos: humo al oeste. Noche tres: ya no queda a quién avisar. Mantengo el faro encendido por si acaso.'],
 torre2:['Orden sellada','«Apagad el faro. Que nadie vea lo que ardió.» Firmado con tres iniciales que no te atreves a leer en voz alta.']});
Object.assign(CUT,{
 madre:()=>D('La Madre del Fango','Qué pesado es recordar... Llévate esto: te hará firme donde otros resbalan.',null,()=>truD('marisma')),
 capataz:()=>D('El Capataz de Hierro','Sellé la mina como me ordenaron. Ahora ábrela tú, que la cerraste. Llévate mi pico.',null,()=>truD('cantera')),
 vigia:()=>D('El Vigía de Ceniza','Sigo vigilando por costumbre. Ya no queda reino que avisar. Que mi farol te alumbre la parada.',null,()=>truD('torre'))});
Object.assign(BEST,{
 madre:['La Madre del Fango','Se hunde y emerge con golpes aplastantes.','Guardiana de lo que el reino arrojó al pantano.','Sus golpes tienen un aviso largo: esquiva hacia un lado y castiga. Cuidado con los huecos que invoca.'],
 capataz:['El Capataz de Hierro','Golpes de pico lentos y enormes; llama a brutos.','Cumplió la orden de sellar la mina con gente dentro.','Los golpes pesados le rompen el ritmo: ataca tras su recuperación y no te quedes bajo el derrumbe.'],
 vigia:['El Vigía de Ceniza','Dispara desde lejos y se teletransporta.','Mantuvo el faro tres noches hasta que le ordenaron apagarlo.','Tras cada teletransporte golpea por la espalda: gira y bloquea. Los arqueros que llama caen primero.']});

// --- regiones ---
RG.push(
{id:'marisma',n:'Marismas Cenicientas',act:'Donde el reino arrojó sus nombres',th:'marisma',cols:56,rows:44,m:1.6,dm:1.25,mini:'madre',out:1,fl:['',' · antes de la Madre'],build(W){
 W.fillG('g');W.ring('wall',1);W.o('dtree',1,1,54,3);W.o('dtree',1,40,54,3);W.o('dtree',1,1,3,42);W.o('dtree',52,1,3,42);
 W.g('w',6,6,16,8);W.g('w',24,3,8,7);W.g('w',3,20,50,3);W.g('w',9,28,10,8);W.g('w',34,28,14,9);W.g('w',46,8,0,0);
 W.g('b',14,20,3,3);W.g('b',27,20,2,3);W.g('b',40,20,3,3);
 W.sc('dtree',46,3,3,50,38,{gap:2,seed:5,avoid:'wbp'});W.sc('bush',30,3,3,50,38,{gap:1,seed:6,avoid:'wbp'});W.sc('reed',60,3,3,50,38,{gap:1,seed:7,avoid:'bp'});
 W.sc('mushroom',14,3,3,50,38,{gap:2,seed:8,avoid:'wbp'});W.sc('rock',12,3,3,50,38,{gap:2,seed:9,avoid:'wbp'});W.sc('rubble',8,3,3,50,38,{gap:1,seed:10,avoid:'wbp'});
 W.room(35,3,17,13,'p');chamber(W,36,4,15,12,'p');W.clr(35,9,1,3);W.g('p',35,9,1,3);W.g('p',34,9,1,3);
 W.path([[5,36],[8,38],[15,33],[15,24],[15,19],[15,16],[28,16],[33,11],[34,10]],3,'p');W.path([[15,33],[28,33],[28,24],[28,16]],3,'p');W.path([[41,19],[41,24],[33,31],[28,33]],3,'p');W.path([[41,19],[41,14]],2,'p');
 W.g('b',14,20,3,3);W.g('b',27,20,3,3);W.g('b',40,20,3,3);
 W.setArena({x:36,y:4,w:15,h:12},[[35,9,1,3]],44,9);
 W.fire(7,36);W.fire(28,18);
 W.portal('back',4,37,{to:'bosque',at:'marisma',k:'Volver',sy:22});
 W.en('hollow',10,36);W.en('hollow',13,31);W.en('hollow',21,30);W.en('hollow',24,35);W.en('archer',18,26);W.en('archer',30,31);W.en('soldier',22,33);
 W.en('hollow',18,15);W.en('hollow',22,12);W.en('hollow',30,16);W.en('archer',12,17);W.en('archer',26,14);W.en('brute',31,13);W.en('brute',42,17);
 W.item(8,25,{sou:250});W.item(47,26,{n:2});W.item(10,17,{sou:200});
 W.o('cross',10,38,1,1);W.note(10,38,'marisma1');W.o('cross',30,17,1,1);W.note(30,17,'marisma2');
}},
{id:'cantera',n:'Cantera Hundida',act:'El precio de la piedra',th:'cantera',cols:52,rows:40,m:1.6,dm:1.25,mini:'capataz',fl:['',' · antes del Capataz'],build(W){
 W.fillO('wall');
 W.room(3,30,10,8,'f');W.room(7,21,3,9,'f');W.room(3,9,22,12,'f');W.room(13,33,22,3,'f');W.room(34,4,14,30,'f');
 W.chasm(34,12,14,12);W.g('b',40,12,2,12);
 W.setArena({x:34,y:4,w:14,h:7},[[40,11,2,1]],41,7);
 W.fire(5,34);W.fire(12,15);W.fire(37,30);
 W.portal('back',5,31,{to:'valdora',at:'cantera',k:'Salir',sy:22});
 W.en('hollow',9,26);W.en('hollow',8,23);W.en('soldier',9,13);W.en('soldier',18,12);W.en('brute',14,17);W.en('archer',22,18);W.en('hollow',6,15);W.en('hollow',20,15);
 W.en('warden',24,34,{pat:[[16,34],[28,34]]});W.en('hollow',12,35);
 W.en('archer',38,28);W.en('archer',44,28);W.en('soldier',40,26);W.en('soldier',44,25);W.en('hollow',36,31);W.en('brute',42,31);
 W.item(22,11,{sou:300});W.item(5,11,{n:2});W.item(45,32,{sou:200});
 W.o('tomb',4,36,1,1);W.note(4,36,'cantera1');W.o('crate',46,26,1,1);W.note(46,26,'cantera2');
 W.o('brazier',4,30,1,1);W.o('brazier',12,30,1,1);W.o('brazier',3,9,1,1);W.o('brazier',24,9,1,1);W.o('brazier',34,24,1,1);W.o('brazier',47,24,1,1);W.o('brazier',34,4,1,1);W.o('brazier',47,4,1,1);
 W.sc('crystal',16,4,10,20,10,{seed:31,gap:2});W.sc('crystal',8,35,25,12,8,{seed:32,gap:2});W.sc('crate',5,4,31,8,6,{seed:33,gap:2});W.sc('barrel',4,14,34,18,1,{seed:34});W.sc('rubble',10,4,10,20,10,{seed:35,gap:1});
 grid(W,'pillar',[8,14,20],[12,17]);
 torches(W,8,4,23,5);torches(W,29,4,11,4);torches(W,32,14,34,5);torches(W,3,35,46,4);
}},
{id:'torre',n:'Torre del Vigía',act:'La última guardia',th:'torre',cols:44,rows:48,m:1.6,dm:1.25,mini:'vigia',fl:['',' · antes del Vigía'],build(W){
 W.fillO('wall');
 W.room(14,39,16,7,'f');W.room(21,32,2,7,'f');W.room(8,23,26,9,'f');W.room(3,24,5,7,'f');W.room(34,24,5,7,'f');W.room(21,13,2,10,'f');W.room(10,2,24,11,'f');
 W.sgate(21,19,2,1,['t1','t2']);W.lever(4,25,'t1');W.lever(37,25,'t2');
 W.setArena({x:10,y:2,w:24,h:11},[[21,13,2,1]],21,6);
 W.fire(17,42);W.fire(10,26);
 W.portal('back',21,40,{to:'puertas',at:'torre',k:'Descender',sy:22});
 W.en('soldier',18,43);W.en('soldier',26,43);W.en('warden',21,35,{pat:[[21,33],[21,37]]});
 W.en('warden',14,26,{pat:[[10,26],[22,26]]});W.en('warden',28,28,{pat:[[24,28],[32,28]]});W.en('archer',10,25);W.en('archer',32,25);W.en('archer',20,30);W.en('soldier',14,28);W.en('soldier',28,25);W.en('brute',21,26);
 W.en('hollow',5,28);W.en('hollow',6,26);W.en('hollow',36,28);W.en('hollow',37,26);
 W.item(4,30,{n:2});W.item(37,30,{sou:300});W.item(16,44,{sou:150});
 W.o('tomb',31,2,1,1);W.note(31,2,'torre1');W.o('cross',12,29,1,1);W.note(12,29,'torre2');
 W.o('brazier',14,39,1,1);W.o('brazier',29,39,1,1);W.o('brazier',8,23,1,1);W.o('brazier',33,23,1,1);
 grid(W,'bpillar',[12,17,25,30],[25,29]);grid(W,'pillar',[13,29],[4,10]);
 W.o('lamp',11,3,1,1);W.o('lamp',32,3,1,1);W.o('lamp',11,11,1,1);W.o('lamp',32,11,1,1);W.o('lamp',20,41,1,1);W.o('lamp',23,41,1,1);
 W.sc('crystal',5,12,4,20,8,{seed:41,gap:3});W.sc('crate',4,9,24,8,6,{seed:42,gap:2});W.sc('rubble',8,9,24,24,6,{seed:43,gap:1});
 torches(W,22,9,32,5);torches(W,38,15,28,5);torches(W,1,12,32,5);
}});

// --- accesos desde las regiones existentes ---
const addToRegion=(id,fn)=>{const r=RG.find(r=>r.id===id),b=r.build;r.build=function(W){b.call(this,W);fn(W)}};
addToRegion('bosque',W=>{W.room(4,25,5,5,'g');W.portal('marisma',6,27,{to:'marisma',at:'back',k:'Descender',sy:22});W.o('brazier',4,26,1,1);W.o('brazier',8,26,1,1)});
addToRegion('valdora',W=>{W.room(4,42,6,3,'g');W.portal('cantera',6,44,{to:'cantera',at:'back',k:'Descender',sy:-22});W.o('pillar',5,44,1,1);W.o('pillar',7,44,1,1);W.o('brazier',4,43,1,1);W.o('brazier',8,43,1,1)});
addToRegion('puertas',W=>{W.portal('torre',4,6,{to:'torre',at:'back',k:'Ascender',sy:22});W.o('brazier',3,8,1,1);W.o('brazier',6,8,1,1)});
