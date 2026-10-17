// ===== PUZZLES v2: deducción, lógica, memoria y tiempo (en vez de "lee la nota y enciende en ese orden") =====
// Carga DESPUÉS de cripta2.js y castillo2.js. Reescribe pistas y reglas, y saca los enemigos de las salas de puzzle
// (los fallos ya no invocan monstruos: el castigo es perder el progreso).
//
//  CRIPTA (1ª)      -> tutorial: combinar DOS pistas (orden de la jornada + color de cada momento).
//  CÁMARAS          -> 5 llamas ATADAS entre sí (tipo "apagar luces"). Solución única de 3 toques; se aprende probando
//                      (al tocar una llama saltan chispas en las que arrastra) y razonando (el orden no importa, 2 toques = 0).
//  CAPILLA SUBT.    -> razonamiento espacial + RELOJ: 1ª y última dadas, el resto por adyacencia; las velas se consumen en 45 s.
//  BIBLIOTECA       -> 5 tomos, 5 fichas repartidas en dos archivos (solución única) y feedback tipo Mastermind
//                      («N tomos en su lugar») para poder cruzar pistas con pruebas.
(function(){
const clearEn=(W,x0,y0,x1,y1)=>{W.ens=W.ens.filter(e=>!(e.tx>=x0&&e.tx<=x1&&e.ty>=y0&&e.ty<=y1))};
const zOf=(W,id)=>W.pzs.find(z=>z.id===id);
const hook=(id,fn)=>{const r=RG.find(q=>q.id===id);if(!r)return;const b=r.build;r.build=function(W){b.call(this,W);fn(W)}};
const addTorch=(W,z,x,y,c)=>{W.o('ptorch',x,y,1,1);z.t.push({i:z.t.length,tx:x,ty:y,x:x*16+8,y:y*16+8,c})};

// ---------- pistas ----------
Object.assign(NOTES,{
 // Cripta: dos mitades de un mismo dato
 cripta1:['Lápida de un guardia','Aquí yace quien cerró la puerta cuando se lo ordenaron. Y no preguntó por qué. Alrededor, cuatro marcas de color raspadas con una daga: «Alba, el azul del cielo limpio. Mediodía, el oro de la corona. Ocaso, la sangre del día. Noche, el verde de lo que apaga las lámparas».'],
 cripta3:['Orden de los cirios','Los cuatro cirios de la cámara de guardia se encienden como pasa la jornada: desde que el sol se levanta hasta que cae la noche. El que se salta un momento, vuelve a empezar.'],
 // Cámaras: reglas, no solución
 camaras1:['Grabado, celda oeste','«Cada llama está atada a otras, y ninguna está atada igual que su hermana. Tocar una despierta o duerme a todas las suyas de golpe.»'],
 camaras2:['Grabado, celda este','«El orden no importa: tocar A y luego B es lo mismo que B y luego A. Lo que importa es cuáles tocas.»'],
 camaras3:['Grabado, celda norte','«Tocar dos veces la misma llama es no haberla tocado. Si te pierdes, deshaz lo hecho y mira qué arrastra cada una.»'],
 camaras4:['Grabado, sala central','«Son cinco llamas y el sello pide tres manos. Ni una más, ni una menos.»'],
 // Capilla subterránea: geometría + tiempo
 capsub0:['Capilla subterránea','«Aquí se juraba en voz baja, para que la piedra fuera la única testigo.» Las huellas gastadas van de nicho en nicho por el borde de la nave; ninguna cruza el aire en diagonal. Las velas no duran: tras la primera, las demás deben seguirla antes de consumirse.'],
 capsub1:['Vitral de las cuatro luces','Cuatro luces sostienen el juramento. La primera en arder es la del mediodía, dorada. La última es la de la noche, verde. Cada luz arde en el nicho vecino de la anterior, nunca en el opuesto.'],
 // Biblioteca: cinco fichas, una sola solución. Los tomos se encienden en el orden en que se leyeron.
 biblioteca1:['Catálogo sin páginas','Cada ficha conduce a un estante vacío. Alguien arrancó los registros en orden alfabético. Solo sobrevive una, con letra de bibliotecaria: «Entre el tomo azul y el violeta caben exactamente dos más». Debajo: «Se leyeron en fila; enciéndelos como se leyeron».'],
 biblioteca2:['Orden de los tomos','Anotado a lápiz en un lomo: «El rojo se leyó antes que el dorado. Los demás, que cada cual los ordene».'],
 biblioteca3:['Plumas rotas','Una docena de plumas partidas por la mitad, todas con la misma marca de dientes. En el reverso de una, a tinta: «El violeta, antes que el verde. Siempre».'],
 biblioteca4:['Marcapáginas','Una tira de cuero entre dos tomos que nadie volvió a separar: «El azul va justo después del verde. Si ves uno, el otro está pegado».'],
 biblioteca5:['Hoja suelta','«El rojo no abre ni cierra la fila: siempre tiene un tomo antes y otro después.» La letra tiembla en la última palabra.']
});
Object.assign(REGINFO,{
 camaras:['5 llamas atadas entre sí: deduce cuáles tocar','Las reglas están grabadas en las tres celdas y la sala central','Sin enemigos en la sala del puzzle','Sello de las Cámaras'],
 capsub:['Cuatro velas en cuatro nichos, y se consumen (45 s)','Razonamiento espacial: primera y última dadas, el resto se deduce','Sin enemigos en la nave ni en los nichos','Sello de la Capilla · hueco del altar'],
 biblioteca:['Pasillos de estanterías y mesas de lectura','Cinco fichas en los archivos laterales (oeste y este)','Deducción con feedback: ordenar los cinco tomos','Mini-jefe: La Archivista Mayor (pluma de hierro)']
});

// ---------- puzzles ----------
hook('cripta',W=>{clearEn(W,20,6,45,14)});

// CÁMARAS: 5 llamas. Tocar la llama i alterna el conjunto links[i]. Solución única: tocar 2, 3 y 4.
hook('camaras',W=>{
 const z=zOf(W,'camaras');if(!z)return;
 addTorch(W,z,29,30,4);
 z.kind='toggle';z.punish=null;z.order=[0,1,2,3,4];
 z.links=[[0,1,4],[0,1],[0,2,3],[1,3],[3,4]];
 clearEn(W,22,22,35,35);
});

// CAPILLA SUBTERRÁNEA: dorado(SO) -> azul(NO) -> rojo(NE) -> verde(SE) con las velas consumiéndose
hook('capsub',W=>{
 const z=zOf(W,'capilla');if(!z)return;
 z.kind='timed';z.limit=45;z.order=[2,0,1,3];z.punish=null;
 clearEn(W,16,10,36,37);
 W.en('soldier',8,30);
});

// BIBLIOTECA: violeta, rojo, verde, azul, dorado. Cinco pistas, una solución. Feedback tipo Mastermind.
hook('biblioteca',W=>{
 const z=zOf(W,'biblioteca');if(!z)return;
 addTorch(W,z,25,17,4);
 z.kind='mm';z.order=[4,1,3,0,2];z.punish=null;
 clearEn(W,8,15,43,20);clearEn(W,2,21,7,31);clearEn(W,45,21,50,31);
 W.o('urn',4,27,1,1);W.note(4,27,'biblioteca4');
 W.o('crate',47,27,1,1);W.note(47,27,'biblioteca5');
});

// ---------- motor ----------
const solve=(z,msg)=>{S.pz[z.id]=1;W.clearT(z.door);toast(msg||'Algo antiguo recuerda... y se abre');ach('puzzle');G.shake=3;sfx(120,.7,'sawtooth',.07,60);save()};
{const prev=lightT;
 lightT=function(z,t){
  // 1) interruptores enlazados
  if(z.kind==='toggle'){
   const L=z.links[t.i]||[t.i];
   L.forEach(i=>{const k=z.lit.indexOf(i);if(k>=0)z.lit.splice(k,1);else z.lit.push(i);const q=z.t[i];if(q&&i!==t.i)spark(q.x,q.y-8,'#9ad0ff',8,12)});
   spark(t.x,t.y-8,'#ffe66d',10,14);
   if(z.lit.length>=z.t.length)solve(z,'Las cinco llamas arden a la vez... y la puerta cede');
   else{sfx(300+z.lit.length*90,.25,'sine',.06,600);toast('Llamas encendidas: '+z.lit.length+'/'+z.t.length)}
   return}
  // 2) tomos con feedback: se elige el orden completo y el sello responde cuántos están bien
  if(z.kind==='mm'){
   z.lit.push(t.i);z.prog=z.lit.length;spark(t.x,t.y-8,'#ffe66d',12,14);
   if(z.lit.length<z.order.length){sfx(380+z.prog*70,.25,'sine',.06,700);toast('Tomo '+z.prog+'/'+z.order.length);return}
   const hits=z.lit.filter((c,k)=>c===z.order[k]).length;
   if(hits===z.order.length)solve(z,'Los cinco tomos encajan... el Gran Archivo se abre');
   else{toast('Los tomos vuelven a su estante: '+hits+' de '+z.order.length+' en su sitio');sfx(120,.3,'sawtooth',.05,60);z.lit=[];z.prog=0}
   return}
  // 3) velas que se consumen
  if(z.kind==='timed'){
   const first=z.prog===0;
   prev(z,t);
   if(S.pz[z.id]){clearTimeout(z.tm);return}
   if(z.prog===0){clearTimeout(z.tm);return}
   if(first){z.t0=Date.now();clearTimeout(z.tm);
    z.tm=setTimeout(()=>{if(W&&W.pzs&&W.pzs.includes(z)&&!S.pz[z.id]&&z.prog>0){z.lit=[];z.prog=0;toast('Las velas se consumen... empieza de nuevo');sfx(120,.4,'sawtooth',.05,60)}},z.limit*1000)}
   toast('Vela '+z.prog+'/'+z.order.length+' · quedan '+Math.max(0,Math.round(z.limit-(Date.now()-z.t0)/1000))+' s');
   return}
  return prev(z,t);
 }}
})();
