// ===== CASTILLO DE LA CORONA II: Cocinas y Dependencias, Capilla, Biblioteca y Archivos =====
// Carga DESPUÉS de castillo.js y ANTES de lore.js. Las regiones nuevas van AL FINAL de RG (no se mueven los índices de los guardados).
// Se entra desde el Gran Salón: Biblioteca (ala oeste), Capilla (ala este, arriba) y Cocinas (ala este, abajo).

// ---- temas propios ----
TH.cocinas=Object.assign({},TH.castillo,{k:'cocinas',fl:['#5a4632','#634e38','#4e3c2a'],mo:'#241a10',hi:'#b88a50',wf:['#7a5238','#684530','#563826'],wt:'#180e08',wh:'#2c1a10',ac:'#ff9a3c',amb:[20,8,2,.5],fog:'255,170,90',pt:'ember',bg:'#0a0504'});
TH.capilla=Object.assign({},TH.castillo,{k:'capilla',fl:['#3a3a58','#42426a','#32324c'],mo:'#181830',hi:'#8a8ac8',wf:['#52528a','#464678','#3a3a64'],wt:'#0c0c1c',wh:'#1c1c38',ac:'#9ac8ff',amb:[8,10,30,.55],fog:'150,170,255',pt:'dust',bg:'#04040c'});
TH.biblioteca=Object.assign({},TH.castillo,{k:'biblioteca',fl:['#4a3a2a','#533f2e','#403224'],mo:'#20160e',hi:'#a8844e',wf:['#5e4630','#4e3a28','#3e2e20'],wt:'#120c08',wh:'#241810',ac:'#ffd070',amb:[16,10,4,.55],fog:'210,170,110',pt:'dust',bg:'#080503'});
SPEC.cocinas=['scorch','crack','pebble'];SPEC.capilla=['rune','crack','wax'];SPEC.biblioteca=['scorch','leaf','crack'];
SHAFT.cocinas=['255,170,100',.06];SHAFT.capilla=['170,190,255',.09];SHAFT.biblioteca=['255,210,140',.07];

// ---- objetos nuevos: estantería, banco, altar, caldero y mesa ----
function bakeShelf(t,v){const c=mkc(16,30),x=c.getContext('2d'),R=rngS(v*17+3),cols=['#8a3a3a','#3a5a8a','#4a7a4a','#c9a54a','#6a3a7a','#8a6a3a','#5a5a62'];
 rect(x,0,2,16,26,'#3a2616');rect(x,1,3,14,24,'#1e140c');
 for(let r=0;r<3;r++){const y=4+r*8;let bx=2;while(bx<14){const w=1+(R()*2|0),h=4+(R()*3|0);rect(x,bx,y+7-h,Math.min(w,14-bx),h,cols[(R()*cols.length)|0]);if(R()<.3)rect(x,bx,y+7-h,1,1,'#e8dfc4');bx+=w+(R()<.15?1:0)}rect(x,1,y+7,14,1,'#5a3e24')}
 rect(x,0,2,16,1,'#6a4a30');rect(x,0,28,16,2,'#241810');return finish(c)}
function bakePew(t,v){const c=mkc(16,16),x=c.getContext('2d');rect(x,0,3,16,4,'#4a2e1e');rect(x,0,3,16,1,'#6a4630');rect(x,0,8,16,3,'#6a4630');rect(x,0,8,16,1,'#8a6040');rect(x,1,11,2,4,'#2e1a10');rect(x,13,11,2,4,'#2e1a10');rect(x,0,7,16,1,'#2a180e');return finish(c)}
function bakeAltar(t,v){const c=mkc(16,24),x=c.getContext('2d');rect(x,1,12,14,10,'#6a6478');rect(x,1,12,14,2,'#9a94aa');rect(x,1,20,14,2,'#3a3448');rect(x,2,14,12,5,'#7a1a2e');rect(x,2,14,12,1,'#a02a40');
 rect(x,3,6,2,7,'#e8e0c8');rect(x,11,6,2,7,'#e8e0c8');rect(x,3,4,2,2,'#ffd88a');rect(x,11,4,2,2,'#ffd88a');rect(x,7,8,2,4,'#c9a54a');rect(x,6,7,4,1,'#c9a54a');return finish(c)}
function bakeCauldron(t,v){const c=mkc(18,20),x=c.getContext('2d');rect(x,3,6,12,9,'#26242c');rect(x,2,8,14,6,'#26242c');rect(x,3,6,12,1,'#4a4652');rect(x,4,7,10,2,'#d8883a');rect(x,6,7,3,1,'#ffd88a');
 rect(x,3,15,2,3,'#14121a');rect(x,13,15,2,3,'#14121a');rect(x,2,9,1,3,'#4a4652');rect(x,15,9,1,3,'#4a4652');return finish(c)}
function bakeTable(t,v){const c=mkc(16,16),x=c.getContext('2d');rect(x,0,5,16,7,'#7a5a38');rect(x,0,5,16,2,'#9a7a50');rect(x,0,11,16,1,'#3a2614');rect(x,1,12,2,4,'#3a2614');rect(x,13,12,2,4,'#3a2614');
 if(v%2===0){rect(x,4,3,4,2,'#d8d0c0');rect(x,10,4,2,1,'#c9a54a')}else{rect(x,5,3,3,2,'#b8582a');rect(x,10,3,3,2,'#d8d0c0')}return finish(c)}
Object.assign(OBJ,{shelf:(v,t)=>bakeShelf(t,v),pew:(v,t)=>bakePew(t,v),altar:(v,t)=>bakeAltar(t,v),cauldron:(v,t)=>bakeCauldron(t,v),table:(v,t)=>bakeTable(t,v)});
Object.assign(COL,{shelf:[0,6,16,16],pew:[0,6,16,16],altar:[1,8,15,16],cauldron:[2,7,14,16],table:[0,6,16,16]});
['shelf','pew','altar','cauldron','table'].forEach(k=>SOLID_OBJ.add(k));
{const _ol=objLight,_of=objFx;
 objLight=function(n,wx,wy,cx,cy){if(n==='cauldron')return{x:wx-cx,y:wy-cy-8,r:52,i:.7,c:'255,150,70',a:.14};if(n==='altar')return{x:wx-cx,y:wy-cy-14,r:60,i:.8,c:'255,216,138',a:.15};return _ol(n,wx,wy,cx,cy)};
 objFx=function(n,wx,wy,tx_,ty_){if(n==='cauldron')glow(wx,wy-9,10,'255,150,70',.12+.06*Math.sin(TM*4+tx_));if(n==='altar')glow(wx,wy-15,10,'255,216,138',.12+.05*Math.sin(TM*3+tx_));return _of(n,wx,wy,tx_,ty_)}}

// ---- armas de los tres mini-jefes ----
WP.cuchilla={n:'Cuchilla del Maestro',d:'Pesada y de golpe seco: sus ataques fuertes parten cualquier guardia.',wl:19,l:{d:15,c:14,r:30,t:.42,a:[.12,.24]},h:{d:38,c:33,r:36,t:.92,a:[.42,.56]},
 lore:['La cuchilla con la que el Maestro de Cocinas troceó doscientos platos cada noche, sin saber ya para quién.','El filo tiene una muesca por cada banquete que nadie comió. El último está sin terminar.','Quien la empuña huele, a veces, a pan recién hecho en una sala sin hornos encendidos.']};
WP.cirial={n:'Cirial del Confesor',d:'Largo alcance y golpes limpios, con el eco de una campana lejana.',wl:24,l:{d:12,c:11,r:42,t:.36,a:[.1,.2]},h:{d:28,c:26,r:50,t:.78,a:[.32,.46]},
 lore:['El bastón de plata con el que el Confesor guiaba a los penitentes hasta la reja del confesionario.','En la punta hay cera derretida de mil cirios. Cada uno ardió por una confesión que no debía repetirse.','Si lo golpeas contra el suelo de la capilla suena a una campana que nadie tocó.']};
WP.pluma={n:'Pluma de Hierro',d:'Muy rápida y barata en resistencia: la hoja más ligera del castillo.',wl:15,l:{d:9,c:7,r:32,t:.24,a:[.06,.14]},h:{d:20,c:16,r:38,t:.52,a:[.2,.3]},
 lore:['Una pluma de escribir forjada en acero, con la que la Archivista Mayor tachaba nombres del registro.','La punta conserva tinta seca. Si la miras de cerca, la tinta forma una sola palabra repetida: «olvidar».','Es tan ligera que parece escribir en el aire cada vez que ataca.']};

// ---- mini-jefes ----
BS.cocinero={n:'El Maestro de Cocinas',mini:1,hp:380,w:20,h:34,c:'#7a4a2a',tr:'#ff9a3c',sp:30,so:1500,fr:3,dm:1.2,wl:26,drop:{w:'cuchilla'},ph:[{a:['bov','bsl'],s:1,hold:.15},{a:['bov','bstab','bsl'],s:1.25,adds:2,addT:'brute',msg:'Llama a sus pinches'},{a:['bov','bsl','bov'],s:1.45,hold:.3,rocks:1,msg:'El banquete no termina'}]};
BS.confesor={n:'El Confesor de la Corona',mini:1,hp:340,w:16,h:34,c:'#4a4a7a',tr:'#9ac8ff',sp:34,so:1600,fr:3,dm:1.15,wl:24,drop:{w:'cirial'},ph:[{a:['bsl','cinder'],s:1},{a:['cinder','blink','bsl'],s:1.25,adds:2,addT:'hollow',msg:'Convoca a los penitentes'},{a:['blink','cinder','bov','cinder'],s:1.45,hold:.3,rocks:1,msg:'La capilla guarda silencio'}]};
BS.archivista={n:'La Archivista Mayor',mini:1,hp:320,w:14,h:32,c:'#6a4a2a',tr:'#ffd070',sp:38,so:1700,fr:3,dm:1.15,wl:22,drop:{w:'pluma'},ph:[{a:['arrow','blink','bsl'],s:1},{a:['arrow','arrow','blink','cinder'],s:1.25,adds:2,addT:'archer',msg:'Abre los archivos'},{a:['blink','cinder','arrow','bov'],s:1.45,hold:.3,rocks:1,msg:'Todo queda sin registrar'}]};
Object.assign(KITS,{
 cocinero:{big:1,bw:17,th:12,lh:8,hw:11,hh:10,A:['#7a4a2a','#a8683a','#3e2414'],boot:'#1c1008',belt:'#3a2410',buckle:'#ff9a3c',head:'helm',hc:['#d8d0c0','#f0e8d8','#a89e90'],eye:'#ff9a3c',cape:'#3e2414',capeE:'#a8683a',pauld:1,wp:'hammer',apron:'#e8e0d0',lampH:'#ff9a3c'},
 confesor:{big:1,bw:14,th:11,lh:9,hw:9,hh:9,A:['#4a4a7a','#7a7aaa','#26264a'],boot:'#14142a',belt:'#2a2a4a',buckle:'#9ac8ff',head:'hood',hc:['#34345e','#52527e','#1c1c38'],eye:'#9ac8ff',cape:'#26264a',capeE:'#7a7aaa',pauld:1,wp:'staff',skirt:1,robe:1,lamp:'#9ac8ff'},
 archivista:{big:1,bw:13,th:11,lh:9,hw:9,hh:9,A:['#6a4a2a','#9a7442','#3a2814'],boot:'#1c1208',belt:'#2a1c0c',buckle:'#ffd070',head:'hood',hc:['#4e3820','#6e5232','#2c1e10'],eye:'#ffd070',cape:'#3a2814',capeE:'#9a7442',pauld:1,wp:'dagger',skirt:1,robe:1,lamp:'#ffd070'}});
Object.assign(WK,{cocinero:['sword',20,'255,154,60'],confesor:['staff',22,'154,200,255'],archivista:['dagger',13,'255,208,112']});
Object.assign(CUT,{
 cocinero:()=>D('El Maestro de Cocinas','Sigo sirviendo. Nadie me dijo que podía parar. Llévate la cuchilla: ya no hay nada más que trocear.'),
 confesor:()=>D('El Confesor de la Corona','Escuché todo y no repetí nada. Es la única penitencia que me dejaron. Llévate el cirial; que alguien más cargue el silencio.'),
 archivista:()=>D('La Archivista Mayor','Taché cada nombre con mi propia mano. El último fue el mío. Toma la pluma: escribe mejor de lo que yo callé.')});
Object.assign(BEST,{
 cocinero:['El Maestro de Cocinas','Tajos amplios y llamadas a sus pinches.','Mantuvo el banquete de la Corona hasta que no quedó ningún invitado vivo.','Sus golpes son lentos: esquiva hacia un lado y castiga. Cuando llama a los pinches, elimínalos primero.'],
 confesor:['El Confesor de la Corona','Lanza llamas de cirio y se teletransporta.','Guardó todas las confesiones del reino, incluida la del rey.','Tras cada teletransporte golpea cerca: gira y bloquea. Rompe a los penitentes antes de que te rodeen.'],
 archivista:['La Archivista Mayor','Dispara plumas desde lejos y se desplaza.','Tachó del registro a todos los que el rey pidió olvidar.','Mantén la distancia corta: le cuesta más acertar. Los arqueros que invoca caen primero.']});

// ---- notas ambientales ----
Object.assign(NOTES,{
 cocinas1:['Libro de pedidos','«Banquete de la Coronación: doscientos cubiertos. Banquete de la Ceniza: doscientos cubiertos.» El rey ordenó que el banquete no se interrumpiera aunque ya no quedaran invitados.'],
 cocinas2:['Delantales colgados','Cada delantal lleva un nombre cosido. Faltan muchos ganchos. El último dice, con letra apresurada: «Hoy cocino por los que no volvieron».'],
 cocinas3:['Despensa abierta desde dentro','Los sacos están rasgados por dentro, no por fuera. Alguien se escondió aquí cuando cerraron las puertas del castillo.'],
 capilla1:['Confesionario','Del lado del penitente hay marcas de uñas en la madera. Del lado del confesor no hay ni una.'],
 capilla2:['Cirios apagados de golpe','Cientos de cirios, todos cortados a la misma altura. Quien los apagó lo hizo con prisa, pero sin dejar caer ni una gota de cera.'],
 capilla3:['Libro de plegarias','La última entrada no es una oración, sino una lista de lo que el rey pidió no recordar. Tu nombre está tachado dos veces.'],
 biblioteca1:['Catálogo sin páginas','Cada ficha conduce a un estante vacío. Alguien arrancó los registros en orden alfabético, empezando por la letra de tu nombre.'],
 biblioteca2:['Orden de los tomos','Anotado a lápiz en un lomo: «Rojo, verde, azul, amarillo. Así los ordenó la Archivista, y así se abren sus puertas».'],
 biblioteca3:['Plumas rotas','Una docena de plumas partidas por la mitad, todas con la misma marca de dientes. Quien escribía aquí lo hacía mordiéndose los labios.']});

// ---- regiones ----
const CP2='Acto III — El último juramento';
RG.push(
{id:'cocinas',n:'Cocinas y Dependencias',act:'Los que servían a la Corona',th:'cocinas',cols:56,rows:44,m:2.5,dm:1.55,mini:'cocinero',fl:['',' · antes del Maestro de Cocinas'],build(W){
 W.fillO('wall');
 W.room(8,35,40,7,'b');W.room(3,22,9,13,'b');W.room(44,22,9,13,'b');W.room(25,28,6,7,'b');
 W.room(13,13,30,15,'b');W.room(6,15,7,5,'b');W.room(43,15,7,5,'b');
 W.room(26,11,4,2,'b');W.room(16,2,24,9,'b');
 // la despensa de la cocina principal se abre con dos palancas, una en cada ala de servicio
 W.sgate(25,28,6,2,['c1','c2']);W.lever(4,23,'c1');W.lever(51,23,'c2');
 W.setArena({x:16,y:2,w:24,h:9},[[26,11,4,1]],28,6);
 // cocina principal: mesas largas, calderos y hogares
 grid(W,'table',[16,17,18,19,20,21],[17,23]);grid(W,'table',[34,35,36,37,38,39],[17,23]);
 W.o('cauldron',14,14,1,1);W.o('cauldron',41,14,1,1);W.o('cauldron',14,26,1,1);W.o('cauldron',41,26,1,1);
 W.o('brazier',18,13,1,1);W.o('brazier',23,13,1,1);W.o('brazier',32,13,1,1);W.o('brazier',37,13,1,1);
 W.o('barrel',13,22,1,1);W.o('barrel',13,23,1,1);W.o('crate',42,22,1,1);W.o('crate',42,23,1,1);
 // vestíbulo de servicio
 W.o('barrel',10,36,1,1);W.o('barrel',11,36,1,1);W.o('crate',45,36,1,1);W.o('crate',46,36,1,1);
 W.o('barrel',12,36,1,1);W.note(12,36,'cocinas1');
 W.o('brazier',24,41,1,1);W.o('brazier',31,41,1,1);
 // gran horno (arena)
 W.o('brazier',16,2,1,1);W.o('brazier',39,2,1,1);W.o('brazier',16,10,1,1);W.o('brazier',39,10,1,1);
 W.o('cauldron',20,3,1,1);W.o('cauldron',35,3,1,1);grid(W,'pillar',[21,34],[6]);
 // alas de servicio y despensas
 W.o('urn',5,33,1,1);W.note(5,33,'cocinas2');W.o('urn',50,33,1,1);W.note(50,33,'cocinas3');
 W.sc('crate',4,3,24,8,9,{seed:61,gap:2});W.sc('barrel',4,45,24,7,9,{seed:62,gap:2});W.sc('rubble',6,14,14,28,12,{seed:63,gap:1});
 W.fire(20,38);W.fire(29,26);
 W.portal('back',28,40,{to:'gransalon',at:'cocinas',k:'Volver al Gran Salón',sy:-22});
 // enemigos: personal de cocina (brutos), guardia y penitentes
 W.en('soldier',14,38);W.en('soldier',42,38);W.en('hollow',22,37);W.en('hollow',34,37);
 W.en('soldier',6,26);W.en('hollow',9,30);W.en('hollow',5,28);
 W.en('brute',47,26);W.en('soldier',50,30);W.en('archer',48,24);
 W.en('brute',24,20);W.en('brute',31,20);W.en('soldier',28,16);W.en('hollow',15,15);W.en('hollow',40,25);W.en('archer',27,26);W.en('warden',22,15,{pat:[[17,15],[30,15]]});
 W.en('hollow',9,17);W.en('soldier',47,17);
 W.item(7,17,{sou:600});W.item(48,17,{f:1});W.item(10,33,{n:2});W.item(49,31,{sou:400});W.item(28,22,{n:2});
 torches(W,12,14,41,3);torches(W,34,12,24,4);torches(W,34,32,43,4);torches(W,21,3,11,4);torches(W,21,44,52,4);torches(W,1,17,38,4);torches(W,14,6,12,3);torches(W,14,43,49,3);
}},
{id:'capilla',n:'Capilla',act:'Lo que se rezó en voz baja',th:'capilla',cols:52,rows:44,m:2.5,dm:1.55,mini:'confesor',fl:['',' · antes del Confesor'],build(W){
 W.fillO('wall');
 W.room(18,37,16,5,'f');W.room(14,14,24,23,'f');
 W.room(3,20,9,12,'f');W.room(11,24,3,4,'f');W.room(40,20,9,12,'f');W.room(38,24,2,4,'f');
 W.room(24,11,4,3,'f');W.room(12,2,28,9,'f');
 W.g('c',24,2,4,40);
 // la puerta de la sacristía solo se abre con la llave del ala este
 W.ldoor(24,12,4,1,'sacristia','Puerta de la sacristía');
 W.setArena({x:12,y:2,w:28,h:9},[[24,11,4,1]],26,6);
 // nave: bancos a ambos lados del pasillo
 grid(W,'pew',[16,17,18,19,20,21],[18,21,24,27,30,33]);grid(W,'pew',[30,31,32,33,34,35],[18,21,24,27,30,33]);
 grid(W,'pillar',[15,36],[16,22,28,34]);
 W.o('brazier',22,14,1,1);W.o('brazier',29,14,1,1);W.o('brazier',20,37,1,1);W.o('brazier',31,37,1,1);
 // presbiterio (arena)
 W.o('altar',26,3,1,1);W.o('altar',25,3,1,1);
 W.o('statue',14,3,1,1);W.o('statue',37,3,1,1);W.o('brazier',12,2,1,1);W.o('brazier',39,2,1,1);W.o('brazier',12,10,1,1);W.o('brazier',39,10,1,1);
 grid(W,'pillar',[17,34],[5,8]);
 // capillas laterales
 W.o('tomb',4,21,1,1);W.o('tomb',6,21,1,1);W.o('cross',8,21,1,1);W.o('urn',5,30,1,1);W.note(5,30,'capilla1');
 W.o('tomb',42,21,1,1);W.o('urn',47,30,1,1);W.note(47,30,'capilla2');W.o('tomb',45,21,1,1);
 W.o('cross',10,22,1,1);W.note(10,22,'capilla3');
 W.sc('rubble',8,14,14,22,20,{seed:71,gap:1});
 W.fire(20,39);W.fire(45,28);
 W.portal('back',26,40,{to:'gransalon',at:'capilla',k:'Volver al Gran Salón',sy:-22});
 W.en('hollow',22,38);W.en('hollow',30,38);W.en('soldier',26,34);
 W.en('hollow',5,26);W.en('hollow',9,29);W.en('soldier',7,23);W.en('archer',4,30);
 W.en('soldier',44,26);W.en('brute',46,23);W.en('hollow',42,30);W.en('archer',47,28);
 W.en('warden',26,26,{pat:[[24,30],[24,20]]});W.en('soldier',23,17);W.en('soldier',29,17);W.en('hollow',22,24);W.en('hollow',28,31);W.en('archer',26,15);
 W.item(4,24,{sou:700});W.item(10,30,{n:2});W.item(46,25,{key:'sacristia'});W.item(48,23,{sou:500});W.item(26,35,{f:1});
 torches(W,13,15,36,3);torches(W,19,4,10,3);torches(W,19,41,47,3);torches(W,1,13,38,3);
}},
{id:'biblioteca',n:'Biblioteca y Archivos',act:'Lo que se escribió y se calló',th:'biblioteca',cols:52,rows:44,m:2.5,dm:1.55,mini:'archivista',fl:['',' · antes de la Archivista'],build(W){
 W.fillO('wall');
 W.room(18,38,16,4,'f');W.room(24,36,4,2,'f');W.room(8,16,36,20,'f');
 W.room(2,21,5,11,'f');W.room(7,25,1,3,'f');W.room(45,21,5,11,'f');W.room(44,25,1,3,'f');
 W.room(24,12,4,4,'f');W.room(14,2,24,10,'f');
 W.g('c',24,12,4,26);
 // puzzle de los cuatro tomos: la puerta del Gran Archivo se abre con el orden correcto
 W.puzzle('biblioteca',[[14,17,0],[20,17,1],[31,17,2],[37,17,3]],[1,3,0,2],[24,13,4,1]);
 W.setArena({x:14,y:2,w:24,h:10},[[24,12,4,1]],26,6);
 // pasillos de estanterías
 for(const xs of[[12,13],[17,18],[33,34],[38,39]])grid(W,'shelf',xs,[20,21,22,23,24,27,28,29,30,31]);
 W.o('table',22,26,1,1);W.o('table',23,26,1,1);W.o('table',28,26,1,1);W.o('table',29,26,1,1);
 W.o('lamp',21,19,1,1);W.o('lamp',30,19,1,1);W.o('lamp',21,33,1,1);W.o('lamp',30,33,1,1);
 W.o('brazier',20,38,1,1);W.o('brazier',31,38,1,1);
 // gran archivo (arena)
 grid(W,'shelf',[15,16,17,35,36,37],[2]);W.o('lamp',16,4,1,1);W.o('lamp',35,4,1,1);W.o('lamp',16,10,1,1);W.o('lamp',35,10,1,1);
 W.o('brazier',14,2,1,1);W.o('brazier',37,2,1,1);grid(W,'pillar',[19,32],[6]);
 // archivos laterales
 grid(W,'shelf',[2,3,4,5,6],[21]);grid(W,'shelf',[45,46,47,48,49],[21]);
 W.o('urn',3,30,1,1);W.note(3,30,'biblioteca1');W.o('crate',6,23,1,1);W.note(6,23,'biblioteca2');W.o('urn',48,30,1,1);W.note(48,30,'biblioteca3');
 W.sc('rubble',7,9,17,34,18,{seed:81,gap:1});W.sc('crate',3,9,32,34,3,{seed:82,gap:2});
 W.fire(22,40);W.fire(9,34);
 W.portal('back',26,40,{to:'gransalon',at:'biblioteca',k:'Volver al Gran Salón',sy:-22});
 W.en('hollow',22,39);W.en('hollow',30,39);W.en('soldier',26,34);
 W.en('hollow',15,26);W.en('hollow',36,25);W.en('archer',22,19);W.en('archer',29,19);W.en('warden',25,29,{pat:[[19,29],[32,29]]});
 W.en('soldier',20,24);W.en('soldier',31,29);W.en('brute',25,22);W.en('hollow',10,33);W.en('hollow',41,18);
 W.en('hollow',4,26);W.en('archer',5,30);W.en('hollow',47,26);W.en('soldier',48,29);
 W.item(3,23,{sou:700});W.item(48,24,{f:1});W.item(10,18,{n:2});W.item(42,34,{sou:500});W.item(26,24,{n:2});
 torches(W,15,9,42,4);torches(W,35,9,42,4);torches(W,20,3,6,2);torches(W,20,46,49,2);torches(W,1,15,36,4);
}});

// ---- accesos desde el Gran Salón ----
{const gs=RG.find(r=>r.id==='gransalon'),b=gs.build;gs.build=function(W){b.call(this,W);
 W.portal('biblioteca',3,34,{to:'biblioteca',at:'back',k:'Entrar a la Biblioteca y Archivos',sy:22});W.o('brazier',2,34,1,1);W.o('brazier',4,34,1,1);
 W.portal('capilla',52,34,{to:'capilla',at:'back',k:'Entrar a la Capilla',sy:22});W.o('brazier',51,34,1,1);W.o('brazier',53,34,1,1);
 W.portal('cocinas',49,47,{to:'cocinas',at:'back',k:'Entrar a las Cocinas y Dependencias',sy:-22});W.o('brazier',48,47,1,1);W.o('brazier',50,47,1,1)}}

// ---- mapa general ----
Object.assign(LAY,{biblioteca:[10,1410],capilla:[510,1640],cocinas:[270,1680]});
LNK.push(['gransalon','biblioteca',1],['gransalon','capilla',1],['gransalon','cocinas',1]);
Object.assign(REGINFO,{
 cocinas:['Cocina principal con mesas largas y calderos','Alas de servicio (oeste) y bodega (este)','Dos palancas abren la despensa central','Mini-jefe: El Maestro de Cocinas (cuchilla)'],
 capilla:['Nave con bancos y pasillo de alfombra','Capillas laterales con tumbas','La llave de la sacristía está en el ala este','Mini-jefe: El Confesor de la Corona (cirial)'],
 biblioteca:['Pasillos de estanterías y mesas de lectura','Archivos laterales con notas','Puzzle de los cuatro tomos abre el Gran Archivo','Mini-jefe: La Archivista Mayor (pluma de hierro)']});
