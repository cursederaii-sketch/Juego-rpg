// ===== CASTILLO DE LA CORONA: Valle, Entrada, Gran Salón y Cámara del Trono (ampliada) =====
// Carga DESPUÉS de reino.js y ANTES de lore.js. Las regiones nuevas se añaden AL FINAL de RG para no mover los índices de los guardados.
// Ruta: Puertas de la Capital -> (cruzar portal) Valle de la Corona -> Entrada -> Gran Salón -> Cámara del Trono.

// ---- tema propio del castillo: piedra cálida a la luz de antorchas ----
TH.castillo=Object.assign({},TH.puertas,{k:'castillo',fl:['#4a3238','#53393f','#412b31'],mo:'#1e1216',hi:'#8a5a50',wf:['#6a4048','#5a3640','#4a2c34'],wt:'#140a0e',wh:'#241218',ac:'#ffb86a',amb:[18,6,10,.5],fog:'230,150,110',pt:'ember',bg:'#080306'});
SPEC.castillo=SPEC.trono;SHAFT.castillo=['255,200,140',.06];

// ---- notas ambientales ----
Object.assign(NOTES,{
 corona1:['Camino sin huellas','La hierba está pisada solo hacia arriba. Todos subieron a la escalinata; nadie bajó.'],
 entrada1:['Libro de visitas','Las firmas del último año están tachadas con una sola línea, hecha con la misma pluma. La última página está en blanco, pero ya lleva el sello del rey. Una nota al margen: «La puerta del Gran Salón se sostiene con dos palancas, una en cada galería».'],
 entrada2:['Armadura sin dueño','Cada armadura de la galería tiene el yelmo vuelto hacia la puerta. Ninguna mira hacia el trono.'],
 gransalon1:['Mesa del consejo','Doce sillas y un solo plato servido. Alguien contó los asientos cada noche durante años, hasta que dejó de hacerlo.'],
 gransalon2:['Vitral roto','Un vitral muestra a una mujer entregando una espada a un escudero. El rostro del escudero fue pulido hasta dejarlo en luz.']});

// ---- mini-jefe del Gran Salón ----
BS.mariscal={n:'El Mariscal de la Corona',mini:1,hp:340,w:18,h:34,c:'#5a2a2a',tr:'#ffd24a',sp:34,so:1400,fr:3,dm:1.15,wl:26,
 ph:[{a:['bsl','bov'],s:1},{a:['bsl','bov','bstab'],s:1.35,adds:2,addT:'soldier',msg:'Llama a la guardia'},{a:['bov','bstab','bsl'],s:1.5,hold:.35,msg:'Ya no recuerda a quién sirve'}]};
if(typeof KITS!=='undefined'&&KITS.caballero)KITS.mariscal=Object.assign({},KITS.caballero,{A:['#6a2a2a','#9a4a40','#381616'],hc:['#5a2a2a','#8a4a40','#2e1212'],eye:'#ffd24a',plume:'#c8a030',cape:'#381616',capeE:'#9a4a40',buckle:'#ffd24a',chains:0});
if(WK.caballero)WK.mariscal=WK.caballero;
CUT.mariscal=()=>D('El Mariscal de la Corona','Serví a la Corona hasta que la Corona olvidó mi nombre. Pasa. El trono te espera... y el rey también.');
BEST.mariscal=['El Mariscal de la Corona','Espadazos amplios y llamadas a la guardia.','Juró custodiar la sala hasta que el rey volviera a nombrarlo. El rey no recuerda su nombre.','Cada vez que llama a sus soldados queda expuesto: esquiva el barrido y castiga después. Elimina primero a los soldados invocados.'];

const CP='castillo';
RG.push(
{id:'valcor',n:'Valle de la Corona',act:'Acto III — El último juramento',th:'puertas',cols:36,rows:60,m:2.2,dm:1.5,out:1,fl:['',' · Antes de la escalinata'],build(W){
 W.fillG('g');W.fillO('wall');
 // valle estrecho que solo avanza hacia arriba
 W.room(10,46,16,10,'g');W.room(13,38,12,8,'g');W.room(8,30,14,9,'g');W.room(16,22,14,9,'g');W.room(10,14,16,9,'g');W.room(8,4,20,11,'g');
 W.path([[18,53],[18,40],[14,34],[22,26],[18,18],[18,8]],3,'p');
 // escalinata y puerta del castillo
 W.room(14,5,8,8,'f');W.room(16,2,4,3,'f');
 grid(W,'pillar',[13,22],[5,8,11]);W.o('brazier',15,13,1,1);W.o('brazier',20,13,1,1);W.o('statue',11,7,1,1);W.o('statue',24,7,1,1);
 W.fire(18,52);W.fire(25,12);
 W.portal('gate',18,2,{to:'entrada',at:'back',k:'Entrar al castillo',sy:20});
 W.en('hollow',16,41);W.en('archer',22,42);
 W.en('soldier',11,33);W.en('hollow',19,35);W.en('archer',9,31);
 W.en('brute',26,26);W.en('archer',28,24);W.en('soldier',19,25);
 W.en('soldier',13,18);W.en('hollow',22,17);
 W.amb('corona',9,6,18,9,[['soldier',11,8],['soldier',25,8],['brute',18,7]],{souls:500,msg:'¡La guardia de la Corona te cierra el paso!'});
 W.item(9,35,{sou:300});W.item(27,24,{f:1});W.item(11,17,{n:1});W.item(24,12,{sou:400});
 W.o('cross',14,44,1,1);W.note(14,44,'corona1');
 W.sc('tree',60,2,3,34,56,{avoid:'pf',seed:31,gap:2});W.sc('rock',16,2,3,34,56,{avoid:'pf',seed:32,gap:2});W.sc('bush',20,2,3,34,56,{avoid:'pf',seed:33,gap:1});
 torches(W,3,9,26,3);
}},
{id:'entrada',n:'Entrada del Castillo',act:'Acto III — El último juramento',th:CP,cols:56,rows:46,m:2.3,dm:1.5,fl:['',' · Galería oeste',' · Galería este'],build(W){
 W.fillO('wall');
 W.room(18,6,20,34,'f');W.room(24,40,8,4,'f');W.room(25,2,6,5,'f');
 W.room(5,10,11,24,'f');W.room(40,10,11,24,'f');
 W.room(16,18,3,4,'f');W.room(37,18,3,4,'f');W.room(16,28,3,3,'f');W.room(37,28,3,3,'f');
 W.g('c',26,2,4,42);
 // la puerta del Gran Salón se abre con dos palancas, una en cada galería
 W.sgate(25,5,6,2,['lw','le']);W.lever(6,33,'lw');W.lever(49,33,'le');
 grid(W,'pillar',[20,35],[10,16,22,28]);
 grid(W,'statue',[7,13],[12,16,24,28,32]);grid(W,'statue',[42,48],[12,16,24,28,32]);
 W.o('brazier',24,41,1,1);W.o('brazier',31,41,1,1);W.o('brazier',24,7,1,1);W.o('brazier',31,7,1,1);
 W.fire(22,38);W.fire(7,11);W.fire(48,11);
 W.portal('back',28,43,{to:'valcor',at:'gate',k:'Salir al valle',sy:-20});
 W.portal('gran',28,2,{to:'gransalon',at:'back',k:'Entrar al Gran Salón',sy:20});
 W.en('brute',28,24);W.en('soldier',22,14);W.en('soldier',34,14);W.en('hollow',22,30);W.en('hollow',34,30);
 W.en('soldier',9,14);W.en('soldier',10,26);W.en('archer',8,31);
 W.en('soldier',46,14);W.en('soldier',45,26);W.en('brute',46,31);
 W.item(6,31,{sou:500});W.item(49,12,{n:2});W.item(35,36,{f:1});
 W.o('urn',10,20,1,1);W.note(10,20,'entrada1');W.o('urn',45,20,1,1);W.note(45,20,'entrada2');
 W.sc('rubble',6,6,12,48,30,{avoid:'c',seed:41,gap:2});
 torches(W,1,25,30,3);torches(W,9,5,15,3);torches(W,9,40,50,3);torches(W,5,18,24,3);torches(W,5,31,37,3);
}},
{id:'gransalon',n:'Gran Salón',act:'Acto III — El último juramento',th:CP,cols:56,rows:62,m:2.5,dm:1.55,mini:'mariscal',fl:['',' · Salones Reales',' · Capilla'],
 waves:[['soldier','soldier','hollow'],['archer','brute','soldier'],['brute','archer','soldier','hollow']],build(W){
 W.fillO('wall');
 W.room(12,4,32,22,'f');W.room(24,26,8,4,'f');W.room(10,30,36,24,'f');W.room(24,54,8,4,'f');W.room(25,1,6,3,'f');
 W.room(2,34,7,14,'f');W.room(8,39,3,4,'f');W.room(47,34,7,14,'f');W.room(45,39,3,4,'f');
 W.g('c',26,1,4,57);
 W.setArena({x:12,y:4,w:32,h:22},[[24,26,8,1]],28,14);
 grid(W,'pillar',[16,39],[7,12,17,22]);grid(W,'pillar',[14,20,35,41],[34,40,46,51]);grid(W,'brazier',[11,44],[32,38,44,50]);
 W.fire(22,52);W.fire(5,36);W.fire(50,36);
 W.portal('back',28,57,{to:'entrada',at:'gran',k:'Volver a la Entrada',sy:-20});
 W.portal('trono',28,2,{to:'trono',at:'back',k:'Subir a la Cámara del Trono',sy:20,cond:()=>!!S.bk.mariscal,lock:'Las puertas del trono siguen selladas.'});
 W.en('soldier',18,46);W.en('soldier',37,46);W.en('brute',28,40);W.en('archer',15,36);W.en('archer',40,36);W.en('hollow',20,44);
 W.en('hollow',4,38);W.en('hollow',6,44);W.en('archer',50,38);W.en('warden',50,44);
 W.item(4,46,{sou:700});W.item(5,35,{n:2});W.item(51,46,{n:3});W.item(50,35,{f:1});
 W.o('urn',3,41,1,1);W.note(3,41,'gransalon1');W.o('cross',52,41,1,1);W.note(52,41,'gransalon2');
 W.sc('rubble',8,11,32,34,20,{avoid:'c',seed:51,gap:2});
 torches(W,3,13,42,3);torches(W,29,11,23,3);torches(W,29,32,44,3);torches(W,33,3,7,3);torches(W,33,48,52,3);
}});

// ---- La Cámara del Trono, ampliada (mismo id y jefe: los guardados y el final siguen funcionando) ----
Object.assign(RG.find(r=>r.id==='trono'),{cols:56,rows:52,fl:['',' · Salones Reales oeste',' · Salones Reales este'],build(W){
 W.fillO('wall');
 W.room(14,3,28,16,'f');W.room(24,19,8,5,'f');W.room(12,24,32,22,'f');W.room(24,46,8,4,'f');
 W.room(2,28,8,14,'f');W.room(9,33,4,4,'f');W.room(46,28,8,14,'f');W.room(43,33,4,4,'f');
 W.g('c',26,3,4,47);
 W.setArena({x:14,y:3,w:28,h:16},[[24,19,8,1]],28,8);
 W.fire(22,44);W.fire(5,30);W.fire(50,30);
 grid(W,'pillar',[17,38],[6,11,16]);grid(W,'pillar',[16,22,33,39],[27,33,39]);
 W.o('statue',15,3,1,1);W.o('statue',40,3,1,1);W.o('statue',27,3,1,1);W.o('statue',30,3,1,1);
 W.o('brazier',22,3,1,1);W.o('brazier',33,3,1,1);W.o('brazier',15,17,1,1);W.o('brazier',40,17,1,1);W.o('brazier',14,44,1,1);W.o('brazier',41,44,1,1);
 if(S.cab==='lib')W.th=Object.assign({},W.th,{amb:[22,2,20,.7],pt:'ash'});
 W.portal('back',28,49,{to:'gransalon',at:'trono',k:'Volver al Gran Salón',sy:-20});
 if(S.cab==='rec')W.npc('aldric',24,41);
 W.en('brute',18,30);W.en('soldier',37,31);
 if(S.cab!=='tom'){W.en('soldier',19,38);W.en('archer',38,38);W.en('brute',28,34);W.en('soldier',28,27)}
 W.en('hollow',5,34);W.en('hollow',50,34);
 W.item(16,44,{f:1});W.item(4,40,{sou:800});W.item(51,40,{n:3});
 W.o('urn',6,33,1,1);W.o('urn',49,33,1,1);
 W.sc('urn',6,14,24,40,20,{seed:3});W.sc('rubble',8,14,24,40,20,{seed:4,gap:1});
 torches(W,2,15,40,5);torches(W,23,13,42,4);torches(W,27,3,8,4);torches(W,27,47,52,4);
}});

// ---- el camino cambia: las Puertas ya no llevan directo al trono ----
RG.find(r=>r.id==='puertas').nx='valcor';

// ---- mapa general ----
Object.assign(LAY,{valcor:[270,1150],entrada:[440,1150],gransalon:[270,1410],trono:[510,1410]});
{const i=LNK.findIndex(l=>l[0]==='puertas'&&l[1]==='trono');if(i>=0)LNK.splice(i,1)}
LNK.push(['puertas','valcor'],['valcor','entrada'],['entrada','gransalon'],['gransalon','trono']);
Object.assign(NUMR,{valcor:5,entrada:6,gransalon:7,trono:8});
Object.assign(REGINFO,{
 valcor:['Valle estrecho: solo se avanza hacia arriba','Escalinata y puerta del castillo','Emboscada de la guardia de la Corona','Se llega cruzando el portal de las Puertas'],
 entrada:['Vestíbulo central con alfombra','Galerías de los Caballeros (oeste y este)','Dos palancas abren la puerta del Gran Salón','2 puntos de descanso en las galerías'],
 gransalon:['Gran Salón con arena de oleadas','Mini-jefe: El Mariscal de la Corona','Salones Reales (oeste) y Capilla (este)','Sube a la Cámara del Trono al vencerlo'],
 trono:['Cámara del Trono ampliada','Sala de audiencias con salones laterales','Dais del trono: jefe final','Acceso desde el Gran Salón']});

// ---- el trono cambió de tamaño: se invalida la niebla antigua ----
{const lr=loadRegion;loadRegion=function(i,fi,at){if(RG[i].id==='trono'&&S.cv!==1){delete S.seen.trono;S.cv=1}return lr(i,fi,at)}}
