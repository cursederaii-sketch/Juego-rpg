// ===== CRIPTA AMPLIADA: tres niveles con puzzles antes del Sepulturero =====
// Carga DESPUÉS de campos.js. Desde la Cámara de Guardia de la Cripta se entra a tres zonas:
//   Cámaras Selladas   -> puzzle de cirios en orden (pistas repartidas en tres celdas + una palanca que abre una compuerta)
//   Ruta Inundada      -> dos compuertas que bajan el agua, tramo a tramo
//   Capilla Subterránea-> cuatro velas en cuatro nichos; el orden está en un vitral
// Cada zona termina en un SELLO. Con los tres rotos se abre la puerta que lleva al Sepulturero.
// El progreso se guarda en S.lv['cripta:cs' | 'cripta:ri' | 'cripta:cp'] (palancas globales de la Cripta).
(function(){
const SEALS=['cs','ri','cp'];
const nSeals=()=>SEALS.filter(k=>S.lv['cripta:'+k]).length;
const tor=(W,y,x0,x1,st)=>{for(let x=x0;x<=x1;x+=st)W.torch(x,y)};
const tomb=(W,x,y,id)=>{W.o('tomb',x,y,1,1);W.note(x,y,id)};
const brz=(W,pts)=>pts.forEach(([x,y])=>W.o('brazier',x,y,1,1));

Object.assign(NOTES,{
 cripta_sellos:['Losa con tres hendiduras','Tres sellos de piedra cierran el paso hasta quien custodia la cripta. Cada uno descansa en una cámara bajo esta sala. Los tres portales se abren al norte.'],
 camaras0:['Umbral de las Cámaras','«Aquí se guardaban los sellos del juramento. Nadie debía romperlos; por eso los escondieron de quien los hizo.»'],
 camaras1:['Grabado, celda oeste','«La noche cierra la puerta que el día dejó abierta. El cirio verde es el primero.»'],
 camaras2:['Grabado, celda este','«Después de la noche, la sangre. El cirio rojo va segundo.»'],
 camaras3:['Grabado, celda norte','«El alba llega cuando ya nadie la espera. El cirio azul va tercero.»'],
 camaras4:['Grabado, sala central','«Lo último en apagarse es lo primero que se recuerda. El cirio dorado cierra.»'],
 camaras5:['Cámara del primer sello','«Quien rompe un sello cumple su juramento a medias.» La frase está tallada con una letra que casi reconocés.'],
 ruta0:['Marca de agua','Las paredes tienen una línea oscura a la altura del pecho. El agua subió hasta aquí y se quedó.'],
 ruta1:['Rueda de compuerta','«Dos compuertas, dos tramos. La primera libera la galería baja; la segunda, el canal del este. Que el agua baje despacio o llevará los nombres consigo.»'],
 ruta2:['Cadáver aferrado a una soga','Murió tirando de una cuerda que nunca llegó a la palanca. Alguien sí llegó después.'],
 ruta3:['Cámara del segundo sello','El sello descansa seco por primera vez en años. A su alrededor, marcas de uñas en la piedra.'],
 capsub0:['Capilla subterránea','«Aquí se juraba en voz baja, para que la piedra fuera la única testigo.»'],
 capsub1:['Vitral de las cuatro luces','Cuatro luces sostienen el juramento. Primero la del mediodía, dorada. Después la del alba, azul. Luego la de la noche, verde. La última, la del ocaso, roja.'],
 capsub2:['Hueco en el altar','Una caja pequeña estuvo aquí. En la tapa, grabado con tu propio pulso: «Que no se abra hasta que yo pueda pagarlo».']
});
Object.assign(REGINFO,{
 camaras:['Puzzle de cirios en orden (4 pistas)','Una palanca abre la compuerta de la celda norte','Reaparecen enemigos si te equivocás','Sello de las Cámaras'],
 ruta:['Dos compuertas que bajan el agua','Tramo seco por el norte hasta la primera palanca','Emboscada en la cámara final','Sello de la Ruta'],
 capsub:['Cuatro velas en cuatro nichos','El orden está en el vitral de la nave','Reaparecen enemigos si te equivocás','Sello de la Capilla · hueco del altar']
});

RG.push(
// ---------- 1 · CÁMARAS SELLADAS ----------
{id:'camaras',n:'Cámaras Selladas',act:'Cuatro cirios, una puerta',th:'cripta',cols:52,rows:40,m:1.05,dm:1.05,fl:[''],build(W){
 W.fillO('wall');
 W.room(4,28,10,8,'f');W.room(14,31,8,2,'f');                 // entrada y pasillo
 W.room(22,22,14,14,'f');                                      // sala central
 W.room(8,19,2,9,'f');W.room(6,12,9,7,'f');                    // celda oeste (palanca + pista)
 W.room(36,28,6,2,'f');W.room(42,26,8,6,'f');                  // celda este (pista)
 W.room(45,17,2,9,'f');W.room(42,10,8,7,'f');                  // celda norte (pista), tras la compuerta
 W.room(28,17,3,5,'f');W.room(22,6,16,11,'f');                 // pasillo y cámara del sello
 W.fire(7,32);
 W.portal('back',6,29,{to:'cripta',at:'camaras',k:'Volver a la Cripta',sy:20});
 // celda oeste: la palanca abre la compuerta del pasillo que lleva a la celda norte
 W.lever(13,14,'x1',{k:'Palanca',m:'La compuerta cruje'});
 W.sgate(45,20,2,1,['x1'],{msg:'Una compuerta se abre al este'});
 // cirios: verde, rojo, azul, dorado (indices 3,1,0,2)
 W.puzzle('camaras',[[25,24,0],[28,24,1],[31,24,2],[34,24,3]],[3,1,0,2],[28,20,3,2]);
 W.pzs[W.pzs.length-1].punish=[['hollow',24,33],['hollow',34,33]];
 tomb(W,5,34,'camaras0');tomb(W,7,14,'camaras1');tomb(W,47,27,'camaras2');tomb(W,44,12,'camaras3');tomb(W,23,34,'camaras4');tomb(W,30,13,'camaras5');
 W.item(30,9,{seal:'cs',k:'Romper el sello'});W.item(24,14,{sou:300});W.item(35,14,{n:2});
 W.item(9,34,{sou:150});W.item(48,30,{n:1});W.item(49,11,{sou:200});
 W.en('hollow',10,31);W.en('hollow',11,34);
 W.en('soldier',11,15);W.en('hollow',8,14);
 W.en('hollow',26,30);W.en('hollow',32,28);W.en('soldier',29,33);
 W.en('archer',47,28);W.en('hollow',44,30);
 W.en('soldier',46,12);W.en('hollow',43,14);W.en('hollow',48,14);
 brz(W,[[5,29],[12,29],[23,23],[34,23],[23,7],[36,7]]);
 W.o('statue',22,6,1,1);W.o('statue',37,6,1,1);
 tor(W,27,5,12,4);tor(W,21,23,34,4);tor(W,5,24,36,4);tor(W,11,8,13,4);tor(W,9,43,48,4);
 W.sc('rubble',6,22,22,14,14,{seed:41,gap:2});W.sc('urn',4,4,28,10,8,{seed:42});W.sc('tomb',3,6,12,9,7,{seed:43,gap:2});
}},
// ---------- 2 · RUTA INUNDADA ----------
{id:'ruta',n:'Ruta Inundada',act:'El agua guarda lo que no quiso salir',th:'cripta',cols:56,rows:40,m:1.1,dm:1.1,fl:[''],build(W){
 W.fillO('wall');
 W.room(4,26,9,8,'f');                                         // entrada
 W.room(7,16,3,10,'f');W.room(4,6,12,10,'f');                  // ruta seca al norte: primera compuerta
 W.room(13,29,12,3,'f');                                       // galería baja (inundada)
 W.room(25,24,12,12,'f');                                      // sala de las ruedas
 W.room(30,14,3,10,'f');W.room(24,6,16,8,'f');                 // ruta al norte: segunda compuerta
 W.room(37,29,10,3,'f');                                       // canal este (inundado)
 W.room(47,22,8,14,'f');                                       // cámara del sello
 W.g('w',13,29,12,3);W.g('w',37,29,10,3);
 W.drain=[{id:'d1',x:13,y:29,w:12,h:3},{id:'d2',x:37,y:29,w:10,h:3}];
 W.fire(6,31);
 W.portal('back',6,27,{to:'cripta',at:'ruta',k:'Volver a la Cripta',sy:20});
 W.lever(10,9,'d1',{k:'Girar la rueda'});W.lever(31,9,'d2',{k:'Girar la rueda'});
 W.item(51,26,{seal:'ri',k:'Romper el sello'});
 W.amb('ri1',47,22,8,14,[['hollow',50,26],['hollow',52,31],['soldier',49,33]],{souls:200});
 tomb(W,5,33,'ruta0');tomb(W,6,8,'ruta1');tomb(W,35,34,'ruta2');tomb(W,53,24,'ruta3');
 W.item(14,12,{sou:200});W.item(27,26,{n:2});W.item(38,10,{sou:250});W.item(9,31,{n:1});
 W.en('hollow',9,28);W.en('hollow',11,32);
 W.en('soldier',8,11);W.en('hollow',12,12);
 W.en('hollow',28,28);W.en('hollow',33,27);W.en('archer',35,32);W.en('soldier',30,33);
 W.en('hollow',28,10);W.en('hollow',35,10);W.en('soldier',33,8);
 brz(W,[[5,27],[12,27],[26,25],[36,25],[5,7],[15,7],[25,7],[38,7],[48,23],[54,23]]);
 tor(W,25,5,12,4);tor(W,5,5,15,5);tor(W,23,26,36,5);tor(W,5,25,38,5);tor(W,21,48,54,3);
 W.sc('rubble',8,26,25,10,10,{seed:51,gap:2});W.sc('urn',4,4,6,12,8,{seed:52});W.sc('tomb',3,24,6,14,6,{seed:53,gap:2});
}},
// ---------- 3 · CAPILLA SUBTERRÁNEA ----------
{id:'capsub',n:'Capilla Subterránea',act:'Aquí se juraba en voz baja',th:'cripta',cols:48,rows:40,m:1.15,dm:1.1,fl:[''],build(W){
 W.fillO('wall');
 W.room(4,24,9,8,'f');W.room(13,27,3,2,'f');                   // entrada y pasillo
 W.room(16,18,20,16,'f');                                      // nave
 W.room(18,16,2,2,'f');W.room(16,10,6,6,'f');                  // nicho noroeste
 W.room(32,16,2,2,'f');W.room(30,10,6,6,'f');                  // nicho noreste
 W.room(19,34,2,1,'f');W.room(17,35,6,3,'f');                  // nicho suroeste
 W.room(31,34,2,1,'f');W.room(29,35,6,3,'f');                  // nicho sureste
 W.room(24,16,4,2,'f');W.room(23,4,6,12,'f');                  // puerta del altar y altar
 W.fire(6,29);
 W.portal('back',6,25,{to:'cripta',at:'capsub',k:'Volver a la Cripta',sy:20});
 // velas: azul(0) noroeste · rojo(1) noreste · dorado(2) suroeste · verde(3) sureste
 // orden del vitral: dorado, azul, verde, rojo = indices 2,0,3,1
 W.puzzle('capilla',[[19,12,0],[33,12,1],[20,36,2],[32,36,3]],[2,0,3,1],[24,16,4,2]);
 W.pzs[W.pzs.length-1].punish=[['hollow',20,26],['hollow',31,26]];
 tomb(W,5,30,'capsub0');tomb(W,25,20,'capsub1');tomb(W,25,6,'capsub2');
 W.item(26,6,{seal:'cp',k:'Romper el sello'});W.item(24,11,{n:2});W.item(27,11,{sou:300});
 W.item(18,32,{sou:200});W.item(34,32,{n:1});
 W.en('hollow',20,22);W.en('hollow',31,22);W.en('soldier',25,28);W.en('hollow',30,30);
 W.en('hollow',18,13);W.en('hollow',33,13);W.en('soldier',19,36);W.en('hollow',32,36);
 W.en('hollow',9,27);
 brz(W,[[5,25],[12,25],[17,19],[34,19],[23,5],[28,5]]);
 W.o('statue',23,10,1,1);W.o('statue',28,10,1,1);
 tor(W,23,5,12,4);tor(W,17,17,34,4);tor(W,9,17,21,4);tor(W,9,31,35,4);
 W.sc('rubble',6,16,18,20,15,{seed:61,gap:2});W.sc('urn',4,4,24,9,8,{seed:62});
}}
);

// ---- ganchos del motor ----
// agua que baja: las rectas de W.drain pasan de 'w' a 'f' cuando su palanca está accionada
{const as=Mapa.prototype.applyState;
 Mapa.prototype.applyState=function(){as.call(this);if(this.drain)for(const d of this.drain)if(S.lv[this.rg.id+':'+d.id])this.g('f',d.x,d.y,d.w,d.h)}}
{const p=pull;
 pull=function(l){p(l);if(W.drain&&W.drain.some(d=>d.id===l.id)){W._wl=null;W.bake();toast('El agua baja y deja un camino al este');sfx(90,.8,'sawtooth',.05,40)}}}
// sellos: el objeto con {seal:id} activa la palanca global de la Cripta
{const p=pickIt;
 pickIt=function(it,key){
  if(it.seal){S.tk[key]=1;S.lv['cripta:'+it.seal]=1;const n=nSeals();toast(n>=3?'Los tres sellos se han roto':'Un sello se rompe ('+n+'/3)');
   sfx(520,.25,'sine',.06,880);spark(it.x,it.y,'#b08cff',18);G.shake=2.5;save();return}
  p(it,key)}}
// castigo de los puzzles: si te equivocás, la cámara responde
{const l=lightT;
 lightT=function(z,t){const bad=t.i!==z.order[z.prog];l(z,t);
  if(bad&&z.punish&&!(S.pz&&S.pz[z.id]))z.punish.forEach(([ty,tx,tyy])=>E.push(mk(ty,tx*16+8,tyy*16+8)))}}

// ---- la Cripta: tres accesos y la puerta de los sellos ----
{const C=RG.find(r=>r.id==='cripta'),b=C.build;
 C.fl=C.fl||[''];
 C.build=function(W){b.call(this,W);
  W.portal('camaras',24,7,{to:'camaras',at:'back',k:'Cámaras Selladas',sy:20});
  W.portal('ruta',33,7,{to:'ruta',at:'back',k:'Ruta Inundada',sy:20});
  W.portal('capsub',42,7,{to:'capsub',at:'back',k:'Capilla Subterránea',sy:20});
  W.o('tomb',31,13,1,1);W.note(31,13,'cripta_sellos');
  if(!S.bk.sepulturero)W.sgate(46,9,1,3,SEALS,{msg:'Los tres sellos se han roto'})}}

// ---- mapa del reino ----
LAY.camaras=[520,34];LAY.ruta=[520,200];LAY.capsub=[520,366];
LNK.push(['cripta','camaras',1],['cripta','ruta',1],['cripta','capsub',1]);
})();
