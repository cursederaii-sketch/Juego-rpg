// ===== REGIONES OPCIONALES: Osario (mini jefe), Archivo (sigilo y persecución), Foso (supervivencia) =====
RG.push(
{id:'osario',n:'Osario Hundido',act:'Pasaje oculto',th:'cripta',cols:48,rows:40,m:1.4,dm:1.2,mini:'guardiana',fl:['',' · antes de la Guardiana'],build(W){
 W.fillO('wall');
 W.room(4,4,11,9,'f');W.room(8,13,3,8,'f');W.room(4,21,15,12,'f');W.room(19,26,8,3,'f');W.room(27,18,16,16,'f');
 W.room(33,11,3,7,'f');W.room(22,2,20,9,'f');W.room(15,8,7,2,'f');
 W.setArena({x:22,y:2,w:20,h:9},[[33,11,3,1]],32,6);
 W.fire(8,9);W.fire(31,19);
 W.portal('arriba',8,5,{to:'cripta',at:'osario',k:'Ascender',sy:22});
 // dos palancas abren el paso al jefe; una tercera abre el atajo de vuelta
 W.lever(6,23,'o1');W.room(44,19,3,3,'f');W.fwall(43,19,1,3,'c');W.lever(45,20,'o2');W.sgate(33,14,3,1,['o1','o2']);
 W.lever(24,4,'o3');W.sgate(17,8,1,2,['o3']);
 W.en('hollow',8,24);W.en('hollow',13,24);W.en('hollow',15,29);W.en('hollow',7,29);W.en('soldier',16,31);
 W.en('soldier',30,22);W.en('soldier',38,24);W.en('hollow',30,30);W.en('hollow',36,30);W.en('archer',40,31);W.en('archer',29,26);
 W.item(5,31,{n:1});W.item(41,19,{sou:200});W.o('tomb',28,19,1,1);W.note(28,19,'osario1');
 W.o('brazier',4,4,1,1);W.o('brazier',4,21,1,1);W.o('brazier',18,21,1,1);W.o('brazier',27,18,1,1);W.o('brazier',42,18,1,1);W.o('brazier',22,2,1,1);W.o('brazier',41,2,1,1);
 grid(W,'bpillar',[26,37],[4,8]);
 W.sc('tomb',5,4,4,12,9,{seed:11,gap:2});W.sc('tomb',6,6,23,12,9,{seed:12,gap:2});W.sc('rubble',8,27,19,15,14,{seed:13,gap:1});
 torches(W,3,5,13,4);torches(W,20,6,17,5);torches(W,17,29,41,6);
}},
{id:'archivos',n:'Archivo Quemado',act:'Registro del olvido',th:'valdora',cols:52,rows:40,m:1.5,dm:1.2,fl:[''],build(W){
 W.th=Object.assign({},W.th,{amb:[18,6,4,.6]});
 W.fillO('wall');
 W.room(3,30,10,8,'f');W.room(7,22,2,8,'f');W.room(3,14,20,8,'f');W.room(23,17,8,2,'f');W.room(31,10,16,15,'f');
 W.room(40,8,2,2,'f');W.room(36,2,11,6,'f');
 W.room(13,33,20,2,'f');W.room(31,25,2,8,'f');          // atajo de vuelta
 W.fire(5,34);
 W.portal('arriba',5,31,{to:'valdora',at:'archivo',k:'Salir',sy:22});
 // vigilantes con cono de visión: golpéalos por sorpresa o rodéalos
 W.en('warden',5,17,{pat:[[5,17],[20,17]]});W.en('warden',38,14,{pat:[[38,14]]});W.en('warden',34,21,{pat:[[34,21],[44,21]]});W.en('warden',44,12,{pat:[[44,12],[44,17]]});
 grid(W,'bpillar',[8,14,19],[15,20]);grid(W,'bpillar',[35,39,42],[13,17]);
 W.o('tomb',10,36,1,1);W.note(10,36,'arch1');W.o('tomb',44,3,1,1);W.note(44,3,'arch2');
 W.item(41,4,{tr:'archivos'});W.item(38,4,{rel:'sombra'});W.lever(44,5,'a1');W.sgate(13,33,1,2,['a1']);
 W.chaseSp=[['hollow',8,27],['hollow',8,25],['soldier',7,24]];
 W.o('brazier',3,30,1,1);W.o('brazier',12,30,1,1);W.o('brazier',36,2,1,1);W.o('brazier',46,2,1,1);
 W.sc('crate',6,4,14,18,7,{seed:21,gap:2});W.sc('barrel',4,32,11,14,12,{seed:22});W.sc('rubble',10,4,14,43,22,{seed:23,gap:1});
 torches(W,29,4,11,4);torches(W,13,4,21,5);torches(W,9,32,45,5);torches(W,1,37,45,4);
}},
{id:'fosa',n:'Foso del Rebaño',act:'Los que pastoreaban el olvido',th:'bosque',cols:44,rows:36,m:1.8,dm:1.3,mini:'heraldo',out:1,fl:[''],waves:[['hollow','hollow','hollow'],['archer','soldier','hollow','hollow'],['brute','archer','hollow']],build(W){
 W.fillG('g');W.ring('wall',1);W.o('tree',1,1,42,3);W.o('tree',1,32,42,3);W.o('tree',1,1,3,34);W.o('tree',40,1,3,34);
 W.sc('tree',120,3,3,38,30,{gap:2,seed:3});W.sc('dtree',30,3,3,38,30,{gap:2,seed:4});
 W.room(3,24,9,8,'g');W.path([[11,28],[22,28],[22,24]],3,'p');
 chamber(W,12,5,22,17,'g');W.clr(21,22,3,1);
 W.setArena({x:12,y:5,w:22,h:17},[[21,22,3,1]],23,12);
 W.fire(6,28);
 W.portal('arriba',4,26,{to:'bosque',at:'fosa',k:'Salir',sy:20});
 W.en('hollow',17,28);W.en('soldier',22,27);
 grid(W,'bpillar',[15,30],[8,17]);
 W.item(23,9,{n:3,when:()=>S.bk.heraldo});
 W.o('tomb',5,30,1,1);W.note(5,30,'fosa1');
 torches(W,4,14,31,5);
}});
