// ===== VALDORRA: Capital (reconstruida y ampliada), Puerto y Valle Sereno =====
// Carga DESPUÉS de regiones3.js. La Capital sustituye al antiguo "Valdora en ruinas" (mismo id 'valdora'):
// conserva sus portales (cripta, Archivo, Cantera), NPCs, retratos, notas, llave del Archivo, arena de la Pastora y salida al Bosque.
{const R0=RG.find(r=>r.id==='valdora');
Object.assign(R0,{n:'Capital de Valdorra',cols:96,rows:72,fl:['',' · Plaza de la Capital',' · antes de la Pastora'],build(W){
 const dn=S.dorn===1,pb=S.bk.pastora,wl=(x,y,w,h)=>W.o('wall',x,y,w,h);
 W.fillG('g');W.ring('wall',2);W.g('w',47,0,3,72);
 if(pb)W.th=Object.assign({},W.th,{amb:[18,8,6,.38],pt:'dust'});
 // --- muralla de la ciudad: puertas N(38-40) S(58-60) O(y34-36) E(y34-36); el río la cruza por 47-49 ---
 wl(22,12,16,2);wl(41,12,6,2);wl(50,12,24,2);wl(22,57,25,2);wl(50,57,8,2);wl(61,57,13,2);
 wl(22,14,2,20);wl(22,37,2,20);wl(72,14,2,20);wl(72,37,2,20);
 W.g('f',24,14,23,43);W.g('f',50,14,22,43);W.g('w',47,14,3,43);
 W.g('b',47,18,3,3);W.g('b',47,30,3,3);W.g('b',47,42,3,3);
 // --- caminos exteriores ---
 W.path([[39,11],[39,5],[9,5]],3,'p');W.path([[23,35],[7,35]],3,'p');W.path([[7,35],[7,45],[4,45]],3,'p');
 W.path([[59,58],[59,66]],3,'p');W.path([[73,35],[91,35]],3,'p');W.path([[75,35],[75,16]],3,'p');W.path([[40,6],[56,6],[61,6],[61,9]],3,'p');
 // --- plazas ---
 W.o('well',40,34,1,1);W.o('statue',56,34,1,1);
 [[36,29],[44,29],[36,39],[44,39],[52,29],[60,29],[52,39],[60,39]].forEach(([x,y])=>W.o('brazier',x,y,1,1));
 // --- barrio oeste: Archivo (puerta con llave), casa de Mirela y calles ---
 chamber(W,28,18,9,5,'f');W.clr(32,23,1,1);W.g('f',32,23,1,1);W.ldoor(32,23,1,1,'archivo');W.portal('archivo',32,20,{to:'archivos',at:'arriba',k:'Descender',sy:22});
 W.o('brazier',28,18,1,1);W.o('brazier',36,18,1,1);
 W.house(39,16,7,6,3);W.house(25,44,7,6,3);W.house(34,44,7,6,4);W.house(26,51,6,5,2);W.house(35,51,7,5,3);W.house(43,51,3,5,1);
 hut(W,26,30,6,3,32,31);W.item(27,31,{q:'retrato'});W.o('urn',30,30,1,1);W.note(30,30,'valdora2');
 // --- barrio este: Catedral de las campanas, cuartel, casas ---
 chamber(W,55,17,12,5,'f');W.clr(60,22,1,1);W.g('f',60,22,1,1);
 W.o('statue',58,18,1,1);W.o('statue',63,18,1,1);W.o('brazier',55,17,1,1);W.o('brazier',66,17,1,1);W.item(60,18,{n:1});W.o('urn',61,20,1,1);W.note(61,20,'capital2');
 W.house(68,24,4,5,1);W.house(64,29,7,6,3);W.house(64,38,7,6,3);W.house(52,51,6,5,2);W.house(61,52,7,4,3);
 hut(W,52,45,6,3,58,46);W.item(53,46,{q:'retrato'});hut(W,62,46,6,3,61,47);W.item(66,47,{q:'retrato'});
 W.note(56,34,'capital1');W.o('cross',44,24,1,1);W.note(44,24,'valdora1');
 // --- Arena de la Pastora (este, fuera de la muralla) ---
 chamber(W,78,10,12,14,'f');W.clr(77,15,1,3);W.g('f',77,15,1,3);W.setArena({x:78,y:10,w:12,h:14},[[77,15,1,3]],85,17);
 grid(W,'bpillar',[80,87],[12,20]);W.o('brazier',78,10,1,1);W.o('brazier',89,10,1,1);
 // --- hogueras, portales y salida ---
 W.fire(8,36);W.fire(43,38);W.fire(74,16);
 W.portal('back',3,33,{to:'cripta',at:'exit',k:'Volver',sx:22,sy:0});
 W.portal('puerto',3,45,{to:'puerto',at:'back',k:'Puerto de Valdorra',sx:22,sy:0});
 W.portal('valle',92,35,{to:'valle',at:'back',k:'Valle Sereno',sx:-22,sy:0});
 W.portal('cantera',59,67,{to:'cantera',at:'back',k:'Descender',sy:-22});
 W.portal('jardin',52,3,{to:'jardin',at:'back',k:'Jardín Derruido',sy:22});W.o('pillar',51,3,1,1);W.o('pillar',53,3,1,1);
 W.exit(9,6);
 // --- personajes ---
 W.npc('mirela',33,33);W.npc('dorn',53,32);W.npc('brenna',76,38);W.npc('anselmo',60,24);W.npc('ysolde',38,38,{night:1});
 if(pb){W.npc('aldea1',30,40);W.npc('aldea2',55,40)}
 // --- enemigos ---
 W.en('archer',12,28);W.en('hollow',15,41);if(!dn&&!pb)W.en('soldier',16,33);
 W.en('archer',30,7);W.en('hollow',24,9);if(!pb)W.en('soldier',56,7);W.en('hollow',68,8);
 if(!pb)W.en('hollow',30,60);W.en('hollow',36,64);W.en('archer',42,61);W.en('brute',54,63);if(!dn)W.en('soldier',66,62);
 W.en('hollow',80,34);W.en('archer',84,41);W.en('brute',86,49);W.en('hollow',78,55);if(!dn)W.en('soldier',80,62);
 W.en('hollow',28,26);if(!pb)W.en('hollow',33,48);W.en('archer',55,50);W.en('hollow',44,48);
 W.amb('cap1',68,60,9,6,[['hollow',69,61],['hollow',75,61],['archer',72,64]],{souls:200});
 // --- objetos, secretos y lore ---
 W.item(33,62,{w:'lanza'});W.item(88,66,{n:1});W.item(12,60,{sou:250});W.item(88,5,{sou:300});
 W.g('k',12,14,6,6);W.g('g',13,15,4,4);W.item(15,17,{key:'archivo'});
 chamber(W,60,4,5,3,'f');W.owall(62,7,1,1,'oblivion');W.item(62,5,{n:3});
 W.o('tomb',12,52,1,1);W.note(12,52,'valdora3');W.o('cross',10,52,1,1);W.o('cross',14,52,1,1);
 W.sc('dtree',90,3,3,90,66,{avoid:'pfwbk',seed:1,gap:3});W.sc('rubble',44,3,3,90,66,{avoid:'pfwbk',seed:2,gap:1});W.sc('bush',40,3,3,90,66,{avoid:'pfwbk',seed:6,gap:1});
 W.sc('barrel',10,25,15,46,40,{avoid:'pgwbk',seed:3});W.sc('crate',9,25,15,46,40,{avoid:'pgwbk',seed:4});W.sc('barr',6,25,15,46,40,{avoid:'pgwbk',seed:5});
 torches(W,13,24,45,5);torches(W,13,51,70,5);torches(W,15,56,66,5);
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
