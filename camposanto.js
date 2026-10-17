// ===== CAMPOSANTO: zona exterior tras el Sepulturero (entre la Cripta y la Capital) =====
// Carga DESPUÉS de cripta2.js. Primera vez que el jugador ve el mundo: páramo de lápidas, día gris, Valdora a lo lejos.
//   1) Lápidas con nombre: hay que averiguar quién falta (registro del Sepulturero + grabados) y dejar la flor en SU tumba.
//      Si te equivocás, la tierra responde. Con la ofrenda correcta se abre el portón del este.
//   2) Dos caminos: LADERA (combate + botín) o MINA VIEJA (apuntalar la viga + lore). Los dos llegan al camino de Valdora.
// Progreso: S.lv['camposanto:of' | 'camposanto:m1'], S.rv['camposanto:flor' | 'camposanto:pista'].
(function(){
const TOMBS={maren:[27,17],ilse:[35,17],corvo:[31,31]}; // posición de cada tumba (el ítem de ofrenda va 2 casillas más abajo)

Object.assign(NOTES,{
 camposanto0:['Cartel hundido en la tierra','«Camposanto de Valdora. Los nombres, en la piedra; los que no tienen piedra, en la memoria de quien los enterró.» Debajo, alguien rascó la palabra «memoria».'],
 camposanto1:['Registro del Sepulturero','Una libreta mojada. «Tres nombres no pude grabar antes de que me llamaran: Maren, que murió de fiebre y tiene a sus urnas al lado. Ilse, que se fue de pie y descansa bajo la cruz. Y Corvo, el último que enterré. A ese nadie lo lloró.»'],
 camposanto2:['Cruz con un grabado','«Dejá la flor donde no hubo nadie que la dejara.» La letra es la misma de la libreta.'],
 camposanto_maren:['Tumba sin lápida','Tierra removida junto a unas urnas. Alguien dejó una cuchara de madera. No hay nombre, pero la fiebre deja tumbas pequeñas y cuidadas.'],
 camposanto_ilse:['Tumba sin lápida','Tierra firme bajo una cruz. Hay cera derretida: aquí vino gente a rezar, durante años.'],
 camposanto_corvo:['Tumba sin lápida','Tierra seca bajo el árbol muerto. Ninguna flor, ninguna vela. Solo la sombra del árbol, que hace de lápida.'],
 camposanto_porton:['Portón del camposanto','Dos hojas de hierro negro con una cerradura que no es de llave: tiene la forma de una flor. «Solo se abre para quien trae algo que dejar.»'],
 camposanto_vista:['Peña sobre el páramo','Desde aquí se ve Valdora, lejos todavía: una silueta de torres rotas bajo un cielo sin sol. Entre la ciudad y vos hay muros, barricadas y mucha gente que ya no mira el camino.'],
 camposanto_mina:['Diario de un minero','«Apuntalamos cada viga con lo que había. Cuando el camposanto se llenó, vinieron a taparnos la salida. Nos pagaron por callar. Seguimos callados.»'],
 camposanto_mina2:['Carretilla con tierra de tumba','La tierra de la carretilla tiene huesos. Esta mina nunca fue de plata: era para esconder lo que no cabía en el camposanto.']
});
Object.assign(REGINFO,{
 camposanto:['Lápidas sin nombre · una ofrenda · un portón','Dos caminos: la ladera (combate) o la mina vieja (viga + lore)','Hoguera al comienzo y otra al bifurcarse','Salida hacia los Arrabales de Valdora']
});

RG.push({id:'camposanto',n:'Camposanto',act:'Acto I — El hombre sin nombre',th:'valdora',cols:64,rows:44,m:1.15,dm:1.1,out:1,fl:['',' · Ladera',' · Mina vieja'],build(W){
 W.th=Object.assign({},W.th,{amb:[52,56,66,.34],fog:'170,176,190',pt:'dust'}); // día gris
 W.fillG('g');W.ring('wall',2);
 // ---------- OESTE: llegada desde la Cripta ----------
 W.house(4,29,8,5,3);                                   // choza del Sepulturero (puerta en (7,33))
 W.fire(6,37);
 W.path([[7,37],[20,37]],3,'p');W.path([[20,37],[20,24]],3,'p');W.path([[20,24],[41,24]],3,'p');
 W.path([[10,37],[10,22]],3,'p');                       // sendero a la flor
 W.o('crate',9,35,1,1);W.note(9,35,'camposanto1');
 W.o('cross',13,36,1,1);W.note(13,36,'camposanto0');
 // ---------- CAMPO DE LÁPIDAS ----------
 // tumbas candidatas: nota en la tumba + ítem de ofrenda 2 casillas debajo. Referencias: urnas (Maren), cruz (Ilse), árbol seco (Corvo)
 for(const id of Object.keys(TOMBS)){const[x,y]=TOMBS[id];W.item(x,y+2,{q:'ofrenda',oid:id,k:'Dejar la flor'})}
 for(const id of Object.keys(TOMBS)){const[x,y]=TOMBS[id];W.o('tomb',x,y,1,1);W.note(x,y,'camposanto_'+id)}
 W.o('urn',TOMBS.maren[0]+2,TOMBS.maren[1],1,1);W.o('urn',TOMBS.maren[0]-2,TOMBS.maren[1],1,1);
 W.o('cross',TOMBS.ilse[0]+2,TOMBS.ilse[1],1,1);W.note(TOMBS.ilse[0]+2,TOMBS.ilse[1],'camposanto2');
 W.o('dtree',TOMBS.corvo[0]+2,TOMBS.corvo[1]-1,1,1);
 // flor marchita (la ofrenda)
 W.item(10,20,{q:'flor',k:'Recoger la flor'});
 W.o('rock',8,19,1,1);W.o('rock',12,19,1,1);
 // enemigos del campo
 W.en('hollow',11,26);W.en('hollow',9,23);W.en('soldier',12,21);
 W.en('hollow',24,30);W.en('hollow',30,26);W.en('archer',38,29);W.en('soldier',33,20);W.en('hollow',25,14);W.en('archer',38,13);
 W.en('warden',22,30,{pat:[[22,30],[36,30]]});
 W.amb('cs1',28,22,10,5,[['hollow',27,20],['hollow',36,27],['soldier',31,28]],{souls:200});
 // portón (se abre al dejar la ofrenda correcta)
 W.o('wall',42,2,1,20);W.o('wall',42,26,1,16);
 W.sgate(42,22,1,4,['of'],{msg:'El portón del camposanto se abre'});
 W.o('cross',41,21,1,1);W.note(41,21,'camposanto_porton');
 W.item(15,31,{sou:250});W.item(38,34,{n:1});W.item(22,12,{sou:200});
 // ---------- ESTE: bifurcación ----------
 W.o('wall',43,2,19,40);
 W.room(43,20,5,5,'p');                                  // sala de bifurcación
 W.fire(45,22);
 // LADERA (norte): cielo abierto, enemigos y botín
 W.room(44,8,3,12,'g');W.room(44,8,14,5,'g');
 W.o('rock',48,10,1,1);W.o('rock',52,9,1,1);W.o('rock',55,11,1,1);W.o('dtree',50,11,1,1);W.o('dtree',46,9,1,1);
 W.o('rock',56,9,1,1);W.note(56,9,'camposanto_vista');
 W.en('hollow',45,15);W.en('archer',50,9);W.en('soldier',49,12);W.en('hollow',54,10);W.en('brute',55,12);
 W.amb('cs2',46,9,10,4,[['hollow',47,9],['soldier',52,12],['archer',55,9]],{souls:250});
 W.item(52,11,{sou:500});W.item(48,9,{n:3});
 // MINA VIEJA (sur): palanca para apuntalar, luego túnel
 W.room(44,25,3,10,'p');
 W.room(47,27,6,3,'p');W.lever(51,28,'m1',{k:'Apuntalar la viga',m:'La viga aguanta'});
 W.en('hollow',50,27);W.en('soldier',48,29);W.en('archer',52,29);
 W.o('barrel',47,27,1,1);W.o('crate',52,27,1,1);
 W.sgate(44,29,3,1,['m1'],{msg:'El derrumbe cede'});
 W.room(44,35,15,4,'f');W.sgate(57,35,1,4,['m1'],{msg:'La salida de la mina cede'});
 W.o('rock',47,34,1,1);W.o('rock',50,38,1,1);W.o('crate',53,35,1,1);W.note(53,35,'camposanto_mina');
 W.o('cross',49,36,1,1);W.note(49,36,'camposanto_mina2');
 W.item(55,37,{q:'pista',k:'Revisar los restos'});W.item(47,37,{n:2});
 W.en('hollow',47,36);W.en('hollow',54,36);W.en('soldier',51,37);
 W.torch(44,34);W.torch(50,34);W.torch(56,34);W.torch(48,39);W.torch(54,39);
 // CAMINO COMÚN hacia Valdora
 W.room(58,8,3,31,'g');
 W.o('dtree',59,14,1,1);W.o('rock',60,30,1,1);
 W.portal('valdora',60,22,{to:'valdora',k:'Camino a los Arrabales',sx:-22,sy:0});
 // decorado de campo
 W.sc('tomb',26,22,4,36,32,{avoid:'pb',seed:71,gap:2});W.sc('cross',10,22,4,36,32,{avoid:'pb',seed:72,gap:2});
 W.sc('dtree',10,3,3,60,40,{avoid:'pbf',seed:73,gap:3});W.sc('bush',20,3,3,40,40,{avoid:'pb',seed:74,gap:1});W.sc('rubble',14,3,3,40,40,{avoid:'pb',seed:75,gap:1});
}});

// ---- objetos de misión: la flor y las ofrendas ----
{const p0=pickIt;pickIt=function(it,key){
 if(it.q==='flor'){S.tk[key]=1;S.rv['camposanto:flor']=1;sfx(520,.25,'sine',.06,880);spark(it.x,it.y,'#ffe66d',14);toast('Flor marchita · hay que dejarla en la tumba que falta');save();return}
 if(it.q==='ofrenda'){
  if(!S.rv['camposanto:flor']){toast('No traes nada que dejar');return}
  const bad=it.oid!=='corvo';
  S.tk[key]=1;
  if(bad){toast('Esta tumba ya tiene quien la llore...');sfx(120,.4,'sawtooth',.05,60);spark(it.x,it.y,'#666',10);G.shake=2;
   const[tx,ty]=TOMBS[it.oid];E.push(mk('hollow',(tx-2)*16+8,(ty+3)*16+8),mk('hollow',(tx+2)*16+8,(ty+3)*16+8));S.rv['camposanto:flor']=1;save();
   // la flor no se pierde: se puede volver a intentar en otra tumba
   return}
  S.rv['camposanto:flor']=0;S.lv['camposanto:of']=1;W.applyState();S.souls+=300;
  toast('Dejas la flor · el portón se abre · +300 almas');sfx(520,.4,'sine',.06,880);spark(it.x,it.y,'#b0d8ff',18);G.shake=3;save();
  say(D('Tumba de Corvo','(Un nombre aparece grabado en la piedra, despacio, como si alguien lo escribiera desde dentro.) «Corvo». Es la primera vez que ves un nombre aparecer en lugar de borrarse.'));return}
 if(it.q==='pista'){S.tk[key]=1;S.rv['camposanto:pista']=1;S.frag+=2;sfx(520,.25,'sine',.06,880);spark(it.x,it.y,'#9ad0ff',14);toast('Pista · +2 fragmentos de memoria');save();
  say(D('Restos en la mina','Un uniforme de la guardia, sin insignia. En el bolsillo, un pase sellado con el emblema de las Puertas de la Capital: «Para entrar sin ser visto». Alguien lo dejó aquí a propósito.'));return}
 return p0(it,key)}}

// ---- la Cripta ahora sale al Camposanto (y el Camposanto a Valdora) ----
{const C=RG.find(r=>r.id==='cripta');if(C)C.nx='camposanto'}

// ---- mapa del reino ----
LAY.camposanto=[150,OY+104];
{const i=LNK.findIndex(l=>l[0]==='cripta'&&l[1]==='valdora');if(i>=0)LNK.splice(i,1,['cripta','camposanto'],['camposanto','valdora']);else LNK.push(['cripta','camposanto'],['camposanto','valdora'])}
})();
