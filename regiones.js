// ===== REGIONES: mapas de mundo libre (vista cenital). Cada región es una cuadrícula de baldosas de 16px =====
// th=tema, cols/rows=tamaño, m/dm=escala de vida/daño, build(W)=construye el mapa con la API de Mapa
const torches=(W,y,x0,x1,st=5)=>{for(let x=x0;x<=x1;x+=st)W.torch(x,y)};
const grid=(W,nm,xs,ys)=>{for(const y of ys)for(const x of xs)W.o(nm,x,y,1,1)};
// sala cerrada con muros (2 arriba, 1 a los lados y abajo)
const chamber=(W,x,y,w,h,fl)=>{W.o('wall',x-1,y-2,w+2,h+3);W.room(x,y,w,h,fl)};

const hut=(W,x,y,w,h,dx,dy)=>{chamber(W,x,y,w,h,'f');W.clr(dx,dy,1,1);W.g('f',dx,dy,1,1)};
const RG=[
{id:'cripta',n:'Cripta Olvidada',act:'Acto I — El hombre sin nombre',th:'cripta',cols:64,rows:44,m:1,dm:1,boss:'sepulturero',nx:'valdora',build(W){
 const sb=S.bk.sepulturero;if(sb)W.th=Object.assign({},W.th,{amb:[7,4,20,.5]});
 W.fillO('wall');
 W.room(4,27,13,12,'f');           // sala de inicio
 W.room(17,32,10,3,'f');           // pasillo
 W.room(27,24,16,16,'f');          // sala de las tumbas
 W.room(34,14,3,10,'f');           // pasillo norte
 W.room(20,6,26,9,'f');            // cámara de guardia
 W.room(46,9,3,3,'f');             // acceso al jefe
 W.room(49,5,12,13,'f');           // arena del Sepulturero
 W.setArena({x:49,y:5,w:12,h:13},[[48,9,1,3]],56,11);
 W.fire(8,31);W.fire(43,12);
 W.npc('sombra',13,30);
 grid(W,'pillar',[30,39],[27,32,37]);grid(W,'pillar',[23,42],[8,12]);grid(W,'bpillar',[51,59],[7,15]);
 W.o('brazier',21,7,1,1);W.o('brazier',44,7,1,1);W.o('brazier',5,28,1,1);W.o('brazier',15,28,1,1);
 W.o('statue',27,6,1,1);W.o('statue',38,6,1,1);
 W.en('soldier',31,30);W.en('hollow',38,34);W.en('hollow',30,37);if(!sb)W.en('soldier',35,18);
 if(!sb)W.en('hollow',27,10);W.en('soldier',33,11);if(!sb)W.en('hollow',40,9);
 W.item(40,38,{w:'larga'});W.item(22,13,{f:1});
 // --- ampliación: lápidas, secretos, puzzle de cirios, grieta, emboscada ---
 W.o('tomb',5,37,1,1);W.note(5,37,'cripta1');W.o('tomb',29,26,1,1);W.note(29,26,'cripta2');W.o('tomb',41,26,1,1);W.note(41,26,'cripta3');W.o('tomb',36,18,1,1);W.note(36,18,'cripta4');
 W.room(19,38,7,4,'f');W.fwall(21,35,2,3,'a');W.o('brazier',19,38,1,1);W.o('brazier',25,38,1,1);W.o('tomb',20,40,1,1);W.note(20,40,'cripta_sec');W.item(23,40,{rel:'paso'});
 W.room(7,20,6,5,'f');W.owall(9,25,2,2,'guardian');W.o('statue',7,20,1,1);W.o('statue',12,20,1,1);W.item(9,22,{rel:'espejo'});
 W.room(12,8,6,5,'f');W.fwall(18,9,2,3,'b');W.portal('osario',14,9,{to:'osario',at:'arriba',k:'Descender',sy:24});W.o('brazier',13,12,1,1);W.o('brazier',16,12,1,1);
 W.room(43,28,6,5,'f');W.chasm(43,28,1,5);W.item(47,29,{sou:300});W.item(47,31,{n:2});
 W.room(23,17,8,4,'f');W.puzzle('cripta',[[26,9,0],[29,9,1],[32,9,2],[35,9,3]],[0,2,1,3],[26,15,2,2]);W.item(25,19,{n:2});W.item(29,19,{sou:250});W.o('brazier',23,17,1,1);W.o('brazier',30,17,1,1);
 W.amb('cr1',36,34,7,6,[['hollow',35,33],['hollow',41,33],['soldier',34,38]],{souls:150});
 if(sb){W.o('brazier',9,28,1,1);W.o('brazier',11,37,1,1)}
 W.exit(58,8);
 W.sc('tomb',9,5,28,11,10,{seed:2,gap:2});W.sc('tomb',9,28,25,14,14,{seed:3,gap:2});W.sc('cross',5,5,28,11,10,{seed:4});
 W.sc('urn',6,21,7,24,7,{seed:5});W.sc('rubble',14,4,6,56,34,{seed:6,gap:1});W.sc('barrel',4,28,25,14,14,{seed:7});W.sc('crate',3,28,25,14,14,{seed:8});
 torches(W,26,5,15,5);torches(W,23,28,42,5);torches(W,5,21,45,5);torches(W,4,50,59,4);
}},
{id:'valdora',n:'Valdora en ruinas',act:'Acto I — El hombre sin nombre',th:'valdora',cols:64,rows:48,m:1.3,dm:1.15,boss:'pastora',nx:'bosque',out:1,build(W){
 W.fillG('g');
 W.g('w',18,0,3,48);W.ring('wall',2);
 W.path([[4,24],[17,24]],3,'p');W.path([[21,24],[48,24]],3,'p');W.g('b',18,23,3,3);
 W.path([[4,40],[17,40]],3,'p');W.path([[21,40],[46,40]],3,'p');W.g('b',18,39,3,3);
 W.path([[46,25],[46,40]],3,'p');
 W.room(28,17,13,14,'f');W.o('well',34,24,1,1);
 // casas del norte (puertas al sur) y del sur
 W.house(7,8,8,6,3);W.path([[10,15],[10,23]],3,'p');
 W.house(22,8,9,6,4);W.path([[26,15],[26,23]],3,'p');
 W.house(44,8,8,6,3);W.path([[47,15],[47,23]],3,'p');
 W.house(6,32,8,6,3);W.path([[9,38],[9,40]],3,'p');
 W.house(24,32,8,6,4);W.path([[28,38],[28,40]],3,'p');
 W.house(36,32,7,6,3);W.path([[39,38],[39,40]],3,'p');
 // arena de la Pastora
 chamber(W,51,17,10,15,'f');W.clr(50,23,1,3);
 W.setArena({x:51,y:17,w:10,h:15},[[50,23,1,3]],57,24);
 W.fire(6,21);W.fire(45,21);
 W.npc('mirela',10,21);W.npc('dorn',31,20);W.npc('brenna',49,28);
 const dn=S.dorn===1,pb=S.bk.pastora;if(pb)W.th=Object.assign({},W.th,{amb:[18,8,6,.38],pt:'dust'});
 if(!dn&&!pb)W.en('soldier',24,21);W.en('archer',24,28);W.en('hollow',31,26);if(!pb)W.en('hollow',33,29);W.en('brute',38,22);if(!pb)W.en('archer',41,19);if(!dn)W.en('soldier',43,27);
 W.item(16,35,{w:'lanza'});W.item(55,41,{f:1});
 // --- ampliación: casas visitables, Archivo, isla de la grieta, notas ---
 W.portal('back',3,21,{to:'cripta',at:'exit',k:'Volver',sy:0});
 hut(W,4,28,7,3,11,29);W.item(5,29,{q:'retrato'});W.o('urn',9,28,1,1);W.note(9,28,'valdora2');
 hut(W,24,4,6,3,30,5);W.item(26,5,{q:'retrato'});
 hut(W,52,36,6,3,51,37);W.item(55,37,{q:'retrato'});
 chamber(W,34,6,7,5,'f');W.clr(37,11,1,1);W.g('f',37,11,1,1);W.path([[37,12],[37,16]],3,'p');W.ldoor(37,11,1,1,'archivo');W.portal('archivo',37,8,{to:'archivos',at:'arriba',k:'Descender',sy:22});W.o('brazier',34,6,1,1);W.o('brazier',40,6,1,1);
 W.g('k',11,3,5,5);W.g('g',12,4,3,3);W.item(13,5,{key:'archivo'});
 W.o('cross',29,19,1,1);W.note(29,19,'valdora1');W.o('tomb',9,44,1,1);W.note(9,44,'valdora3');
 chamber(W,55,3,5,3,'f');W.owall(57,6,1,1,'oblivion');W.item(57,4,{n:3});
 W.npc('anselmo',14,22);W.npc('ysolde',35,27,{night:1});
 if(pb){W.npc('aldea1',30,22);W.npc('aldea2',37,26)}
 W.exit(58,19);
 W.o('barr',30,23,1,1);W.o('barr',24,25,1,1);W.o('barrel',33,18,1,1);W.o('crate',32,18,1,1);
 W.o('brazier',52,18,1,1);W.o('brazier',60,18,1,1);W.o('brazier',52,31,1,1);W.o('brazier',60,31,1,1);
 W.sc('dtree',34,3,3,58,42,{avoid:'pfwb',seed:1,gap:3});W.sc('rubble',30,3,3,58,42,{avoid:'pfwb',seed:2,gap:1});
 W.sc('barrel',7,3,3,58,42,{avoid:'pfwb',seed:3});W.sc('crate',6,3,3,58,42,{avoid:'pfwb',seed:4});W.sc('cross',5,3,3,16,42,{avoid:'pfwb',seed:5});W.sc('bush',20,3,3,58,42,{avoid:'pfwb',seed:6,gap:1});
 torches(W,15,52,60,4);
}},
{id:'bosque',n:'Bosque Marchito',act:'Acto II — La verdad del reino',th:'bosque',cols:64,rows:48,m:1.7,dm:1.3,boss:'cazador',nx:'puertas',out:1,build(W){
 W.fillG('g');W.ring('wall',1);
 W.o('tree',1,1,62,3);W.o('tree',1,44,62,3);W.o('tree',1,1,3,46);W.o('tree',60,1,3,46);
 W.sc('tree',230,3,3,58,42,{gap:2,seed:5});W.sc('dtree',44,3,3,58,42,{gap:2,seed:9});
 // claros y senderos
 W.room(3,36,10,8,'g');W.room(29,24,9,7,'g');W.room(11,9,9,8,'g');W.room(48,34,9,8,'g');W.room(11,25,9,7,'g');
 W.path([[8,39],[20,39],[26,34],[32,30],[36,24],[51,24],[51,20]],3,'p');
 W.path([[32,30],[26,20],[16,13]],3,'p');W.path([[36,24],[44,32],[52,38]],3,'p');
 W.g('w',12,26,7,5);
 chamber(W,44,5,15,14,'f');W.clr(50,19,3,1);
 W.setArena({x:44,y:5,w:15,h:14},[[50,19,3,1]],51,10);
 W.fire(7,40);W.fire(51,22);
 W.npc('voz',33,27);
 W.o('bpillar',30,25,1,1);W.o('pillar',36,25,1,1);W.o('bpillar',30,29,1,1);W.o('pillar',36,29,1,1);
 grid(W,'bpillar',[46,56],[7,16]);
 const cb=S.bk.cazador;if(cb)W.th=Object.assign({},W.th,{amb:[2,14,12,.42]});
 W.en('hollow',22,39);W.en('hollow',25,36);W.en('archer',34,29);W.en('brute',38,22);W.en('hollow',23,19);if(!cb)W.en('archer',46,36);if(!cb)W.en('brute',44,27);
 W.item(14,12,{w:'mandoble'});W.item(52,38,{f:1});
 // --- ampliación ---
 W.portal('back',4,40,{to:'valdora',at:'exit',k:'Volver',sy:0});
 W.room(55,22,5,6,'g');W.path([[51,24],[58,25]],3,'p');W.portal('fosa',58,25,{to:'fosa',at:'arriba',k:'Descender',sx:-24,sy:0});W.o('cross',56,23,1,1);W.note(56,23,'bosque3');
 W.item(54,39,{q:'estandarte',when:()=>S.q.dorn===1});
 W.room(4,10,5,4,'g');W.owall(9,11,2,2,'blood');W.item(6,12,{rel:'sed'});W.item(5,11,{n:2});
 W.box('tree',3,29,10,7);W.room(4,30,8,5,'g');W.room(6,35,3,1,'g');W.chasm(7,30,2,5);W.item(10,31,{sou:500});W.item(10,33,{n:3});
 W.amb('bq1',12,10,8,6,[['hollow',13,14],['hollow',18,14],['archer',19,10]],{souls:200});
 if(S.dorn===-1)W.amb('dorn1',36,24,9,9,[['boss',40,28,'capdorn'],['soldier',38,26],['soldier',42,30]],{souls:300,msg:'¡Dorn y sus hombres te cierran el paso!'});
 W.o('cross',12,38,1,1);W.note(12,38,'bosque1');W.o('tomb',35,28,1,1);W.note(35,28,'bosque2');
 W.exit(56,8);
 W.sc('rock',12,3,3,58,42,{avoid:'pw',seed:3,gap:2});W.sc('bush',30,3,3,58,42,{avoid:'pw',seed:4,gap:1});W.sc('rubble',10,3,3,58,42,{avoid:'pw',seed:6,gap:1});
 torches(W,4,46,57,5);
}},
{id:'puertas',n:'Puertas de la Capital',act:'Acto II — La verdad del reino',th:'puertas',cols:60,rows:44,m:2.1,dm:1.45,boss:'caballero',nx:'trono',out:1,build(W){
 W.fillG('g');W.ring('wall',2);
 W.o('wall',0,0,60,5);W.o('wall',6,0,7,9);W.o('wall',47,0,7,9);
 chamber(W,18,5,24,15,'f');W.clr(29,20,3,1);
 W.setArena({x:18,y:5,w:24,h:15},[[29,20,3,1]],30,11);
 W.path([[4,38],[30,38]],3,'f');W.path([[30,38],[30,21]],3,'f');W.room(24,22,13,5,'f');
 W.fire(6,35);W.fire(34,24);
 W.en('soldier',14,36);W.en('soldier',18,40);W.en('brute',22,34);W.en('archer',28,30);W.en('brute',32,28);W.en('soldier',36,33);
 W.item(46,32,{f:1});
 // --- ampliación ---
 W.portal('back',4,35,{to:'bosque',at:'exit',k:'Volver',sy:0});
 if(S.mir===1)W.npc('mirela2',9,36);if(S.dorn===1)W.npc('dorn2',10,38);
 W.o('tomb',14,33,1,1);W.note(14,33,'puertas1');W.o('tomb',26,23,1,1);W.note(26,23,'puertas2');
 chamber(W,50,30,6,4,'f');W.owall(52,34,1,1,'oblivion');W.item(52,31,{n:3});W.item(54,32,{sou:400});
 W.exit(30,6);
 grid(W,'statue',[26,34],[28,33]);grid(W,'pillar',[22,38],[8,13,17]);
 W.o('barr',20,38,1,1);W.o('barr',24,39,1,1);W.o('brazier',27,22,1,1);W.o('brazier',33,22,1,1);
 W.sc('tree',40,3,22,54,20,{avoid:'f',seed:2,gap:2});W.sc('rock',14,3,22,54,20,{avoid:'f',seed:3,gap:2});W.sc('bush',24,3,22,54,20,{avoid:'f',seed:4,gap:1});
 W.sc('crate',5,3,22,54,20,{avoid:'f',seed:5});W.sc('rubble',12,3,22,54,20,{avoid:'f',seed:6,gap:1});
 torches(W,4,19,40,4);torches(W,19,19,40,6);
}},
{id:'trono',n:'Salón del Trono',act:'Acto III — El último juramento',th:'trono',cols:48,rows:40,m:2.6,dm:1.6,boss:'rey',build(W){
 W.fillO('wall');
 W.room(12,3,24,10,'f');W.room(21,13,6,4,'f');W.room(14,17,20,13,'f');
 W.g('c',22,3,4,27);
 W.setArena({x:12,y:3,w:24,h:10},[[21,13,6,1]],24,7);
 W.fire(24,27);W.fire(23,22);
 grid(W,'pillar',[16,31],[19,23,27]);grid(W,'pillar',[14,33],[5,9]);
 W.o('statue',14,3,1,1);W.o('statue',33,3,1,1);
 W.o('brazier',20,3,1,1);W.o('brazier',27,3,1,1);W.o('brazier',15,28,1,1);W.o('brazier',32,28,1,1);
 if(S.cab==='lib')W.th=Object.assign({},W.th,{amb:[22,2,20,.7],pt:'ash'});
 W.portal('back',28,29,{to:'puertas',at:'exit',k:'Volver',sy:0});if(S.cab==='rec')W.npc('aldric',21,26);
 W.en('brute',17,21);W.en('soldier',30,21);if(S.cab!=='tom'){W.en('soldier',19,26);W.en('archer',31,27);W.en('brute',26,19)}
 W.item(16,28,{f:1});
 W.sc('urn',6,14,18,20,11,{seed:3});W.sc('rubble',8,14,18,20,11,{seed:4,gap:1});
 torches(W,16,15,32,4);torches(W,2,13,34,4);
}}];
