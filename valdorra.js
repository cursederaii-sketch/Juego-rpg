// ===== VALDORRA: Capital (reconstruida y ampliada), Puerto y Valle Sereno =====
// Carga DESPUÉS de regiones3.js. La Capital sustituye al antiguo "Valdora en ruinas" (mismo id 'valdora'):
// conserva sus portales (Arrabales, Puerto, Valle, Cantera, Jardín, Archivo), NPCs, retratos, notas, llave del Archivo, arena de la Pastora.
// v8.21: capital rehecha a 120x96 con distritos propios: murallas con torres y cuatro puertas, río con tres puentes,
// Plaza Mayor con fuente, Catedral de las Campanas en cruz, Archivo con fachada, Cuartel, Mercado, Fragua, barrio quemado,
// Arena de la Pastora grande y exteriores con carácter (puesto de guardia, Campanario caído, camposanto, santuario).
Object.assign(NOTES,{
 capital3:['Placa de la Fuente','«Aquí se juntaban las tres calles del reino.» Debajo, otra mano añadió con cuchillo: «y aquí se decidió callar».'],
 capital4:['Cartel del Mercado','Precios fijados por orden de la Corona. Última línea: «Se acepta cualquier cosa que alguien aún recuerde».'],
 capital5:['Registro del Cuartel','Turnos de guardia de la noche de la ceniza. Todas las firmas son de la misma letra. Alguien las copió en una sola noche.'],
 capital6:['Fragua de Brenna','Sobre el yunque hay una campana pequeña, a medio fundir. Brenna la dejó así a propósito: «Me niego a terminarla».'],
 capital7:['Lápida del Escribano','«Copió mil leyes y no preguntó por ninguna.» La piedra está pulida donde la gente apoya la mano.'],
 capital8:['Puesto de guardia','El libro de entradas se cortó a media línea. Lo último escrito: «Hoy cerraron el paso a los que no recordaban su nombre».'],
 capital9:['Altar del santuario','Una losa sin nombre. En la piedra, tres marcas de dedo, muy hondas: de alguien que se agarró a ella hasta que olvidó por qué.']});
{const R0=RG.find(r=>r.id==='valdora');
Object.assign(R0,{n:'Capital de Valdorra',cols:120,rows:96,fl:['',' · Plaza Mayor',' · antes de la Pastora',' · Barrio del Río'],build(W){
 const dn=S.dorn===1,pb=S.bk.pastora,wl=(x,y,w,h)=>W.o('wall',x,y,w,h),hs=(x,y,w,h,d)=>W.house(x,y,w,h,d===undefined?w>>1:d);
 W.fillG('g');
 if(pb)W.th=Object.assign({},W.th,{amb:[18,8,6,.38],pt:'dust'});
 // ---------- RÍO (norte→sur), recto dentro de la ciudad y con curvas fuera ----------
 W.path([[53,2],[50,8],[46,15],[45,22]],3,'w');W.g('w',44,22,3,53);W.path([[45,74],[45,80],[49,87],[54,93]],3,'w');
 // ---------- CAMINOS EXTERIORES ----------
 W.path([[4,47],[28,47]],3,'p');W.path([[4,66],[16,66],[16,47]],3,'p');W.path([[91,47],[116,47]],3,'p');W.path([[106,47],[106,29]],3,'p');
 W.path([[75,20],[75,4]],3,'p');W.path([[59,75],[59,91]],3,'p');
 // ---------- SUELO DE LA CIUDAD ----------
 W.g('p',30,22,60,52);W.g('w',44,22,3,52);
 W.g('f',57,56,5,18);W.g('f',50,41,19,15);W.g('f',28,45,16,5);W.g('f',47,45,3,5);W.g('f',69,45,22,5);W.g('f',74,22,3,23);
 W.g('f',30,34,13,5);                       // plaza de los Escribas
 W.g('f',62,50,19,12);                      // mercado
 W.g('b',44,45,3,5);W.g('b',44,34,3,3);W.g('b',44,62,3,3);   // puentes
 // ---------- MURALLA ----------
 W.ring('wall',2);
 wl(28,20,16,2);wl(47,20,27,2);wl(77,20,14,2);wl(28,74,16,2);wl(47,74,11,2);wl(61,74,30,2);
 wl(28,22,2,24);wl(28,49,2,25);wl(90,22,2,24);wl(90,49,2,25);
 [[26,18],[88,18],[26,72],[88,72]].forEach(([x,y])=>wl(x,y,6,6));                       // torres de esquina
 wl(26,40,6,6);wl(26,49,6,6);wl(88,40,6,6);wl(88,49,6,6);                                // puertas O y E
 wl(52,69,6,7);wl(61,69,6,7);wl(68,18,6,6);wl(77,18,6,6);                                // puertas S y N
 wl(84,18,4,6);wl(36,70,4,6);wl(50,70,2,6);wl(70,70,4,6);wl(26,28,6,4);wl(26,62,6,4);wl(88,28,6,4);wl(88,62,6,4);
 // ---------- PLAZA MAYOR: fuente con estatua del rey ----------
 for(let d=-2;d<=2;d++){[[59+d,45],[59+d,49],[57,47+d],[61,47+d]].forEach(([x,y])=>{if(!((x===59&&(y===45||y===49))||(y===47&&(x===57||x===61))))W.g('w',x,y,1,1)})}
 W.o('statue',59,47,1,1);W.note(59,46,'capital1');W.note(61,49,'capital3');
 [[50,41],[68,41],[50,55],[68,55],[54,43],[64,43],[54,53],[64,53]].forEach(([x,y])=>W.o('brazier',x,y,1,1));
 // ---------- CATEDRAL DE LAS CAMPANAS (en cruz) ----------
 wl(47,20,25,19);wl(47,36,6,5);wl(66,36,6,5);
 W.room(54,25,11,13,'f');W.room(48,29,23,6,'f');W.room(56,22,7,3,'f');W.room(58,38,3,2,'f');
 W.g('c',58,25,3,14);W.g('c',58,22,3,3);W.g('c',49,31,21,2);
 [[55,26],[55,28],[63,26],[63,28],[55,36],[63,36],[55,35],[63,35]].forEach(([x,y])=>W.o('pillar',x,y,1,1));
 W.o('statue',59,22,1,1);W.o('brazier',57,23,1,1);W.o('brazier',61,23,1,1);W.o('brazier',49,30,1,1);W.o('brazier',69,30,1,1);W.o('brazier',49,33,1,1);W.o('brazier',69,33,1,1);
 W.o('urn',50,34,1,1);W.note(50,34,'capital2');W.item(68,34,{n:1});W.o('tomb',69,32,1,1);
 torches(W,38,54,64,5);
 // ---------- ARCHIVO (oeste): fachada con puerta de llave y sala con el portal ----------
 wl(30,22,13,12);W.room(32,25,9,5,'f');W.room(35,30,3,3,'f');W.ldoor(35,33,3,1,'archivo');
 W.portal('archivo',36,26,{to:'archivos',at:'arriba',k:'Descender',sy:22});
 [[32,25],[40,25]].forEach(([x,y])=>W.o('brazier',x,y,1,1));[[32,27],[32,28],[40,27],[40,28]].forEach(([x,y])=>W.o('crate',x,y,1,1));
 W.o('statue',33,29,1,1);W.o('statue',39,29,1,1);torches(W,33,31,41,5);
 W.o('statue',31,36,1,1);W.o('statue',41,36,1,1);W.o('brazier',34,35,1,1);W.o('brazier',38,35,1,1);W.o('tomb',32,38,1,1);W.note(32,38,'capital7');
 // ---------- BARRIO OESTE ----------
 hs(30,40,6,5,3);hs(38,40,6,5,2);hs(30,51,6,5,3);hs(39,51,5,5,2);hs(30,65,6,5,3);hs(39,67,5,5,2);
 hut(W,31,58,7,3,34,61);W.item(32,59,{q:'retrato'});W.o('urn',36,58,1,1);W.note(36,58,'valdora2');
 W.g('f',38,57,6,8);W.o('statue',40,59,1,1);W.o('brazier',38,57,1,1);W.o('brazier',43,57,1,1);
 // ---------- BARRIO DEL RÍO (este del río, sur) ----------
 hs(48,57,7,5,3);hut(W,49,65,6,3,48,66);W.item(50,66,{q:'retrato'});W.o('urn',53,65,1,1);W.note(53,65,'valdora4');
 hs(62,64,5,5,2);hs(47,41,3,4,1);
 // ---------- MERCADO ----------
 [[63,51,5],[70,51,5],[76,51,4],[63,57,5],[70,57,5]].forEach(([x,y,w])=>hs(x,y,w,3,-1));
 [[69,55],[75,55],[62,56],[80,55],[69,61],[76,60],[66,60]].forEach(([x,y],i)=>W.o(i%2?'barrel':'crate',x,y,1,1));
 W.o('cross',66,55,1,1);W.note(66,55,'capital4');W.o('brazier',62,50,1,1);W.o('brazier',80,50,1,1);
 // ---------- FRAGUA DE BRENNA ----------
 hut(W,68,64,10,4,72,68);W.o('brazier',68,64,1,1);W.o('brazier',77,64,1,1);W.o('barrel',69,67,1,1);W.o('crate',76,67,1,1);W.o('urn',75,64,1,1);W.note(75,64,'capital6');
 // ---------- BARRIO QUEMADO (sureste) ----------
 hs(82,50,6,5,3);hs(82,57,6,5,3);W.o('barr',85,63,1,1);W.note(85,64,'valdora5');
 hut(W,81,67,6,3,84,70);W.item(83,68,{q:'retrato'});W.o('urn',86,67,1,1);W.note(86,67,'valdora6');
 hs(69,41,4,4,1);hs(78,41,5,4,2);hs(84,41,5,4,2);
 W.sc('rubble',24,80,48,9,24,{avoid:'fgwbk',seed:7,gap:1});W.sc('rubble',10,64,66,10,8,{avoid:'fgwbk',seed:8,gap:1});
 // ---------- CUARTEL (noreste): patio de armas ----------
 wl(78,23,11,17);W.room(79,25,9,12,'p');W.room(78,31,1,3,'p');
 [[80,27],[83,27],[86,27]].forEach(([x,y])=>W.o('barr',x,y,1,1));
 [[79,25],[87,25],[79,36],[87,36]].forEach(([x,y])=>W.o('brazier',x,y,1,1));W.o('crate',80,35,1,1);W.o('crate',81,35,1,1);W.o('barrel',86,35,1,1);W.o('urn',87,27,1,1);W.note(87,27,'capital5');
 W.item(85,36,{w:'lanza'});torches(W,23,80,86,3);
 // ---------- PUERTAS: braseros y estatuas ----------
 [[31,45],[31,49],[88,45],[88,49],[56,73],[62,73],[73,22],[77,22]].forEach(([x,y])=>W.o('brazier',x,y,1,1));
 [[43,44],[47,44],[43,50],[47,50]].forEach(([x,y])=>W.o('statue',x,y,1,1));
 // ---------- EXTERIOR OESTE: puesto de guardia y llegada ----------
 [[21,40],[21,41],[21,42],[21,43],[21,44],[21,50],[21,51],[21,52],[21,53],[21,54]].forEach(([x,y])=>W.o('barr',x,y,1,1));
 hut(W,13,36,6,3,16,39);W.o('urn',17,36,1,1);W.note(17,36,'capital8');W.o('crate',14,36,1,1);W.item(15,37,{sou:150});
 W.o('well',8,50,1,1);W.o('pillar',5,45,1,1);W.o('pillar',5,49,1,1);
 // ---------- CAMPANARIO CAÍDO (noroeste): isla de la grieta con la llave ----------
 W.g('k',12,10,6,6);W.g('g',13,11,4,4);W.item(15,13,{key:'archivo'});
 wl(7,8,2,6);wl(21,9,2,5);wl(10,6,10,2);wl(8,16,3,2);W.o('rubble',9,12,1,1);W.o('rubble',20,12,1,1);W.o('statue',9,18,1,1);W.o('urn',19,18,1,1);
 W.path([[16,19],[16,46]],3,'p');
 // ---------- SANTUARIO OLVIDADO (norte): detrás del juramento del olvido ----------
 chamber(W,56,5,7,3,'f');W.owall(59,8,1,1,'oblivion');W.item(59,6,{n:3});W.o('tomb',57,6,1,1);W.note(57,6,'capital9');
 // ---------- ARENA DE LA PASTORA (noreste, exterior) ----------
 wl(94,6,24,23);W.room(96,13,20,9,'f');W.room(98,10,16,15,'f');W.room(100,8,12,18,'f');W.room(105,26,3,3,'f');
 W.setArena({x:98,y:10,w:16,h:15},[[105,26,3,1]],106,16);
 grid(W,'bpillar',[100,111],[12,22]);[[100,8],[111,8],[96,13],[115,13],[96,21],[115,21]].forEach(([x,y])=>W.o('brazier',x,y,1,1));
 // ---------- SANTUARIO DEL ESTE ----------
 hut(W,102,62,9,4,106,66);W.o('tomb',106,63,1,1);W.o('brazier',102,62,1,1);W.o('brazier',110,62,1,1);W.item(108,64,{n:2});
 // ---------- CAMPOSANTO (suroeste) ----------
 W.sc('tomb',20,6,77,19,14,{seed:2,gap:2});W.sc('cross',12,6,77,19,14,{seed:4,gap:2});
 W.o('tomb',12,81,1,1);W.note(12,81,'valdora3');W.o('cross',10,81,1,1);W.o('cross',14,81,1,1);
 // ---------- CAMINOS CON CARÁCTER: estatuas, posada arruinada y campamento ----------
 [[10],[96],[102],[110]].forEach(([x])=>{W.o('statue',x,45,1,1);W.o('statue',x,49,1,1)});
 hut(W,97,53,9,3,101,56);W.o('barrel',98,53,1,1);W.o('crate',99,53,1,1);W.o('crate',104,55,1,1);W.item(103,54,{n:1});
 W.o('crate',66,82,1,1);W.o('barrel',67,82,1,1);W.o('barr',63,80,1,1);W.o('barr',64,80,1,1);W.o('rubble',70,80,1,1);
 W.o('statue',56,80,1,1);W.o('statue',62,80,1,1);W.o('brazier',56,84,1,1);W.o('brazier',62,84,1,1);
 // ---------- HOGUERAS, PORTALES Y SALIDAS ----------
 W.fire(8,44);W.fire(55,47);W.fire(108,31);W.fire(52,62);
 W.portal('back',3,47,{to:'arrabales',at:'valdora',k:'Volver a los Arrabales',sx:22,sy:0});
 W.portal('puerto',3,66,{to:'puerto',at:'back',k:'Puerto de Valdorra',sx:22,sy:0});
 W.portal('valle',116,47,{to:'valle',at:'back',k:'Valle Sereno',sx:-22,sy:0});
 W.portal('cantera',59,91,{to:'cantera',at:'back',k:'Descender',sy:-22});W.o('pillar',57,91,1,1);W.o('pillar',61,91,1,1);W.o('brazier',57,89,1,1);W.o('brazier',61,89,1,1);
 W.portal('jardin',75,3,{to:'jardin',at:'back',k:'Jardín Derruido',sy:22});W.o('pillar',73,3,1,1);W.o('pillar',77,3,1,1);
 // ---------- PERSONAJES ----------
 W.npc('mirela',34,63);W.npc('dorn',83,31);W.npc('brenna',73,66);W.npc('anselmo',59,33);W.npc('ysolde',54,48,{night:1});
 if(pb){W.npc('aldea1',53,52);W.npc('aldea2',65,44)}
 // ---------- ENEMIGOS ----------
 W.en('archer',22,38);W.en('hollow',12,56);W.en('hollow',24,60);W.en('archer',10,28);W.en('hollow',24,22);W.en('hollow',8,84);W.en('archer',20,88);
 if(!dn&&!pb){W.en('soldier',23,44);W.en('soldier',23,50)}
 W.en('hollow',37,36);W.en('hollow',37,70);W.en('archer',37,53);W.en('hollow',41,47);
 W.en('hollow',56,64);W.en('archer',56,67);W.en('hollow',50,44);W.en('brute',66,62);W.en('hollow',72,56);W.en('archer',78,60);
 W.en('hollow',88,55);W.en('brute',85,60);W.en('hollow',86,64);if(!dn)W.en('soldier',75,47);if(!dn&&!pb)W.en('soldier',83,33);
 W.en('archer',98,34);W.en('hollow',84,10);W.en('hollow',68,10);W.en('archer',90,56);
 W.en('hollow',100,44);W.en('archer',112,52);W.en('brute',110,70);W.en('hollow',96,80);W.en('hollow',86,84);if(!dn)W.en('soldier',104,36);
 W.en('hollow',50,84);W.en('archer',66,86);W.en('brute',76,84);W.en('hollow',30,84);W.en('hollow',36,88);
 if(!pb)W.en('hollow',66,30);W.en('archer',90,86);
 W.amb('cap1',62,79,12,7,[['hollow',64,81],['hollow',72,81],['archer',68,84]],{souls:200});
 // ---------- OBJETOS Y BOTÍN ----------
 W.item(10,30,{sou:250});W.item(100,4,{sou:300});W.item(86,72,{n:1});W.item(30,86,{n:1});W.item(112,86,{sou:200});
 // ---------- ENTORNO ----------
 W.sc('dtree',120,3,3,114,90,{avoid:'pfwbk',seed:1,gap:3});W.sc('rubble',50,3,3,114,90,{avoid:'pfwbk',seed:2,gap:1});W.sc('bush',50,3,3,114,90,{avoid:'pfwbk',seed:6,gap:1});W.sc('rock',24,3,3,114,90,{avoid:'pfwbk',seed:9,gap:2});
 W.sc('barrel',10,30,22,58,50,{avoid:'fgwbk',seed:3,gap:2});W.sc('crate',10,30,22,58,50,{avoid:'fgwbk',seed:5,gap:2});
 torches(W,21,30,86,6);torches(W,75,32,86,6);torches(W,38,54,64,5);
}});}

// ---------- PUERTO DE VALDORRA ----------
RG.push({id:'puerto',n:'Puerto de Valdorra',act:'Donde zarparon los que recordaban',th:'puerto',cols:60,rows:44,m:1.5,dm:1.2,out:1,fl:['',' · Muelle'],build(W){
 W.fillG('f');W.ring('wall',2);W.g('w',2,2,19,40);W.g('g',44,2,14,40);
 W.g('b',14,9,8,3);W.g('b',12,19,10,3);W.g('b',16,29,6,3);          // muelles
 W.path([[22,20],[57,20]],3,'p');W.path([[56,22],[52,22]],3,'p');
 [[14,9],[14,12],[12,19],[12,22],[16,29],[16,32]].forEach(([x,y])=>W.o('lamp',x,y,1,1));
 W.o('crate',17,10,1,1);W.o('barrel',19,10,1,1);W.o('crate',15,20,1,1);W.o('barrel',18,21,1,1);W.o('crate',19,30,1,1);W.o('rock',9,14,1,1);W.o('rock',7,26,1,1);W.o('rock',10,35,1,1);
 // casas del muelle y almacén
 W.house(26,8,8,6,3);W.house(36,8,7,6,3);W.house(46,8,8,6,4);W.house(26,26,7,6,3);W.house(36,27,8,6,4);W.house(46,28,8,6,2);
 W.house(26,36,6,5,2);W.o('well',40,18,1,1);W.o('statue',40,22,1,1);
 // cuarto oculto
 chamber(W,48,38,6,3,'f');W.fwall(47,38,1,2,'a');W.o('brazier',48,38,1,1);W.o('brazier',53,38,1,1);W.item(52,40,{n:3});W.o('tomb',50,39,1,1);W.note(50,39,'puerto2');
 W.fire(52,22);W.fire(24,21);
 W.portal('back',57,22,{to:'valdora',at:'puerto',k:'Volver a la Capital',sx:-22,sy:0});
 W.npc('marinero',23,18);W.npc('cartografa',35,22);
 W.en('hollow',17,20);W.en('hollow',13,21);W.en('archer',20,10);W.en('hollow',18,30);W.en('archer',30,22);W.en('brute',30,34);W.en('hollow',40,34);W.en('hollow',46,26);
 W.en('warden',36,16,{pat:[[30,16],[44,16]]});W.en('soldier',50,14);
 W.amb('pt1',12,19,10,3,[['hollow',13,18],['hollow',20,22],['archer',21,17]],{souls:200});
 W.item(18,30,{n:2});W.item(20,31,{q:'lealtad2',when:()=>S.ly===2});W.item(14,10,{sou:400});W.item(55,6,{sou:250});
 W.o('barrel',34,15,1,1);W.note(34,15,'puerto1');
 W.sc('crate',9,24,3,18,38,{avoid:'wbp',seed:11,gap:2});W.sc('barrel',8,24,3,18,38,{avoid:'wbp',seed:12,gap:2});W.sc('rubble',14,24,3,34,38,{avoid:'wbp',seed:13,gap:1});W.sc('dtree',18,44,3,14,38,{avoid:'pfwb',seed:14,gap:3});
 torches(W,5,6,56,6);
}});

// ---------- VALLE SERENO ----------
RG.push({id:'valle',n:'Valle Sereno',act:'Donde la ceniza no llegó',th:'valle',cols:60,rows:44,m:1.3,dm:1.1,out:1,fl:['',' · Molino'],build(W){
 W.fillG('g');W.ring('wall',2);
 W.g('w',2,28,56,2);W.g('b',24,28,3,2);W.g('b',46,28,3,2);
 // cultivos
 [[10,8],[10,14],[36,34],[44,34]].forEach(([x,y])=>{W.g('p',x,y,9,5);for(let j=0;j<5;j+=2)for(let i=0;i<9;i+=2)W.o('bush',x+i,y+j,1,1)});
 W.path([[3,22],[56,22]],3,'p');W.path([[25,22],[25,38]],3,'p');W.path([[47,22],[47,38]],3,'p');W.path([[35,22],[35,15]],3,'p');
 // molino y casas
 W.house(30,8,6,6,3);W.o('bpillar',32,6,1,2);W.o('bpillar',34,6,1,2);W.house(40,10,7,5,3); W.house(14,25,7,3,1);W.house(50,8,7,5,3);W.house(28,34,6,5,2);
 // capilla de la reina
 chamber(W,8,33,6,4,'f');W.clr(10,37,1,1);W.g('f',10,37,1,1);
 W.o('statue',9,34,1,1);W.o('brazier',12,34,1,1);W.o('tomb',11,35,1,1);W.note(11,35,'valle2');W.item(12,36,{n:1});
 W.fire(7,23);W.fire(46,23);
 W.portal('back',3,22,{to:'valdora',at:'valle',k:'Volver a la Capital',sx:22,sy:0});
 W.npc('elda',20,20);W.npc('bruno',35,16);
 W.en('hollow',50,38);W.en('hollow',54,16);W.en('archer',40,38);W.en('hollow',8,12);
 W.item(33,15,{n:2});W.item(38,17,{q:'lealtad1',when:()=>S.ly===2});W.item(53,40,{sou:350});W.item(17,38,{sou:200});
 W.o('cross',44,14,1,1);W.note(44,14,'valle1');
 W.sc('tree',70,3,3,54,40,{avoid:'pfwbk',seed:21,gap:2});W.sc('bush',40,3,3,54,40,{avoid:'pwb',seed:22,gap:1});W.sc('rock',10,3,3,54,40,{avoid:'pfwb',seed:23,gap:2});
 torches(W,3,4,54,8);
}});

// ---------- JARDÍN DERRUIDO (opcional, tranquilo: pocos enemigos, 2 PNJ, 2 cofres) ----------
RG.push({id:'jardin',n:'Jardín Derruido',act:'Un lugar donde el tiempo se detuvo',th:'bosque',cols:64,rows:56,m:1.2,dm:1.1,out:1,day:1,fl:['',' · Glorieta'],build(W){
 W.fillG('g');W.ring('wall',2);W.g('w',58,4,2,48);
 W.path([[32,10],[32,50]],3,'p');W.path([[8,28],[56,28]],3,'p');
 // fuente central con cuatro estanques
 W.room(29,25,7,7,'f');W.o('statue',32,28,1,1);W.note(32,28,'jardin3');
 [[24,20],[36,20],[24,32],[36,32]].forEach(([x,y])=>W.g('w',x,y,5,5));
 // arco norte cerrado (en ruinas) y arco sur (entrada)
 W.room(28,4,9,5,'f');W.o('pillar',30,4,1,1);W.o('pillar',34,4,1,1);W.o('brazier',29,8,1,1);W.o('brazier',35,8,1,1);
 W.o('pillar',30,52,1,1);W.o('pillar',34,52,1,1);
 W.portal('back',32,53,{to:'valdora',at:'jardin',k:'Volver a la Capital',sy:-22});
 W.fire(35,50);W.fire(48,30);
 // ruina NO: cofre
 chamber(W,10,12,11,8,'f');W.clr(21,15,1,3);W.g('f',21,15,1,3);W.path([[22,16],[31,16]],3,'p');
 W.o('brazier',10,12,1,1);W.o('brazier',20,12,1,1);W.o('statue',15,13,1,1);W.item(14,16,{n:2});W.item(17,17,{sou:300});
 // cripta SO (sin enemigos)
 chamber(W,8,37,12,7,'f');W.clr(20,39,1,3);W.g('f',20,39,1,3);W.path([[21,40],[31,40]],3,'p');
 W.o('urn',17,38,1,1);W.note(17,38,'jardin2');W.item(10,42,{sou:350});W.item(18,42,{q:'lealtad3',when:()=>S.ly===2});W.o('brazier',8,37,1,1);
 
 // santuario SE: cofre
 chamber(W,43,40,11,7,'f');W.clr(42,43,1,3);W.g('f',42,43,1,3);W.path([[33,44],[41,44]],3,'p');
 W.o('tomb',48,41,1,1);W.note(48,41,'jardin1');W.item(47,44,{n:2});W.item(51,45,{sou:250});W.o('brazier',43,40,1,1);W.o('brazier',53,40,1,1);
 // glorieta este (PNJ)
 W.room(44,22,9,7,'f');grid(W,'bpillar',[44,52],[22,26]);W.o('brazier',48,22,1,1);
 W.npc('diego',48,25);W.npc('andro',50,25,{when:()=>S.ly>=1||(typeof lyW!=='undefined'&&lyW.on)});W.npc('soledad',45,26);
 
 [[31,12],[33,20],[31,36],[33,44]].forEach(([x,y])=>W.o('lamp',x,y,1,1));
 W.sc('tree',150,3,3,56,50,{avoid:'pfwbk',seed:31,gap:2});W.sc('bush',70,3,3,56,50,{avoid:'pwb',seed:32,gap:1});W.sc('rubble',26,3,3,56,50,{avoid:'pfwb',seed:33,gap:1});
 torches(W,1,6,56,8);
}});
