// ===== REGIONES: mapas de mundo libre (vista cenital). Cada región es una cuadrícula de baldosas de 16px =====
// th=tema, cols/rows=tamaño, m/dm=escala de vida/daño, build(W)=construye el mapa con la API de Mapa
const torches=(W,y,x0,x1,st=5)=>{for(let x=x0;x<=x1;x+=st)W.torch(x,y)};
const grid=(W,nm,xs,ys)=>{for(const y of ys)for(const x of xs)W.o(nm,x,y,1,1)};
// sala cerrada con muros (2 arriba, 1 a los lados y abajo)
const chamber=(W,x,y,w,h,fl)=>{W.o('wall',x-1,y-2,w+2,h+3);W.room(x,y,w,h,fl)};

const RG=[
{id:'cripta',n:'Cripta Olvidada',act:'Acto I — El hombre sin nombre',th:'cripta',cols:64,rows:44,m:1,dm:1,boss:'sepulturero',build(W){
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
 W.en('soldier',31,30);W.en('hollow',38,34);W.en('hollow',30,37);W.en('soldier',35,18);
 W.en('hollow',27,10);W.en('soldier',33,11);W.en('hollow',40,9);
 W.item(40,38,{w:'larga'});W.item(22,13,{f:1});
 W.exit(58,8);
 W.sc('tomb',9,5,28,11,10,{seed:2,gap:2});W.sc('tomb',9,28,25,14,14,{seed:3,gap:2});W.sc('cross',5,5,28,11,10,{seed:4});
 W.sc('urn',6,21,7,24,7,{seed:5});W.sc('rubble',14,4,6,56,34,{seed:6,gap:1});W.sc('barrel',4,28,25,14,14,{seed:7});W.sc('crate',3,28,25,14,14,{seed:8});
 torches(W,26,5,15,5);torches(W,23,28,42,5);torches(W,5,21,45,5);torches(W,4,50,59,4);
}},
{id:'valdora',n:'Valdora en ruinas',act:'Acto I — El hombre sin nombre',th:'valdora',cols:64,rows:48,m:1.3,dm:1.15,boss:'pastora',build(W){
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
 W.en('soldier',24,21);W.en('archer',24,28);W.en('hollow',31,26);W.en('hollow',33,29);W.en('brute',38,22);W.en('archer',41,19);W.en('soldier',43,27);
 W.item(16,35,{w:'lanza'});W.item(55,41,{f:1});
 W.exit(58,19);
 W.o('barr',30,23,1,1);W.o('barr',24,25,1,1);W.o('barrel',33,18,1,1);W.o('crate',32,18,1,1);
 W.o('brazier',52,18,1,1);W.o('brazier',60,18,1,1);W.o('brazier',52,31,1,1);W.o('brazier',60,31,1,1);
 W.sc('dtree',34,3,3,58,42,{avoid:'pfwb',seed:1,gap:3});W.sc('rubble',30,3,3,58,42,{avoid:'pfwb',seed:2,gap:1});
 W.sc('barrel',7,3,3,58,42,{avoid:'pfwb',seed:3});W.sc('crate',6,3,3,58,42,{avoid:'pfwb',seed:4});W.sc('cross',5,3,3,16,42,{avoid:'pfwb',seed:5});W.sc('bush',20,3,3,58,42,{avoid:'pfwb',seed:6,gap:1});
 torches(W,15,52,60,4);
}},
{id:'bosque',n:'Bosque Marchito',act:'Acto II — La verdad del reino',th:'bosque',cols:64,rows:48,m:1.7,dm:1.3,boss:'cazador',build(W){
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
 W.en('hollow',22,39);W.en('hollow',25,36);W.en('archer',34,29);W.en('brute',38,22);W.en('hollow',23,19);W.en('archer',46,36);W.en('brute',44,27);
 W.item(14,12,{w:'mandoble'});W.item(52,38,{f:1});
 W.exit(56,8);
 W.sc('rock',12,3,3,58,42,{avoid:'pw',seed:3,gap:2});W.sc('bush',30,3,3,58,42,{avoid:'pw',seed:4,gap:1});W.sc('rubble',10,3,3,58,42,{avoid:'pw',seed:6,gap:1});
 torches(W,4,46,57,5);
}},
{id:'puertas',n:'Puertas de la Capital',act:'Acto II — La verdad del reino',th:'puertas',cols:60,rows:44,m:2.1,dm:1.45,boss:'caballero',build(W){
 W.fillG('g');W.ring('wall',2);
 W.o('wall',0,0,60,5);W.o('wall',6,0,7,9);W.o('wall',47,0,7,9);
 chamber(W,18,5,24,15,'f');W.clr(29,20,3,1);
 W.setArena({x:18,y:5,w:24,h:15},[[29,20,3,1]],30,11);
 W.path([[4,38],[30,38]],3,'f');W.path([[30,38],[30,21]],3,'f');W.room(24,22,13,5,'f');
 W.fire(6,35);W.fire(34,24);
 W.en('soldier',14,36);W.en('soldier',18,40);W.en('brute',22,34);W.en('archer',28,30);W.en('brute',32,28);W.en('soldier',36,33);
 W.item(46,32,{f:1});
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
 W.en('brute',17,21);W.en('soldier',30,21);W.en('soldier',19,26);W.en('archer',31,27);W.en('brute',26,19);
 W.item(16,28,{f:1});
 W.sc('urn',6,14,18,20,11,{seed:3});W.sc('rubble',8,14,18,20,11,{seed:4,gap:1});
 torches(W,16,15,32,4);torches(W,2,13,34,4);
}}];
