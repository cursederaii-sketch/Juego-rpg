// ===== HISTORIA: diálogos, decisiones y finales =====
const D=(n,t,o,nx)=>({n,t,o,nx});
const short=k=>OATHS[k][0].replace('Juramento del ','').replace('Juramento de ','');
const oath=k=>{if(!S.oaths.includes(k)){S.oaths.push(k);if(!S.oath)S.oath=k;toast('Juramento: '+short(k))}};
const getW=id=>{if(!S.wpns.includes(id)){S.wpns.push(id);toast('Obtienes: '+WP[id].n)}};
const INTRO=D('','Despiertas sobre piedra fría. No recuerdas tu nombre ni cómo llegaste a esta cripta. En el muro, raspada con una espada, una inscripción: «No permitas que el mundo vuelva a olvidarte».',null,
 D('','El reino de Valdora se borra de la memoria de quienes lo habitaron. Para saber quién fuiste deberás llegar a la capital y averiguar por qué regresaste de entre los muertos. Descansa en las hogueras con «Actuar».'));
const NPC={
 sombra:()=>S.oaths.includes('guardian')?D('Sombra del Guardián','Que tu escudo no caiga, sin nombre.'):
  D('Sombra del Guardián','Fui guardián de esta cripta. El rey prometió que nadie olvidaría a quienes caímos con él. Mintió. Te ofrezco mi juramento: tus bloqueos serán firmes, pero mientras un jefe te acose no podrás curarte.',[['Aceptar el juramento',()=>{oath('guardian');return D('Sombra del Guardián','Un escudo no huye. Recuérdalo.')}],['Ahora no']]),
 mirela:()=>{
  if(S.mir===1)return D('Mirela','Sigo creyendo en ti, aunque no recuerdes. Termina lo que empezó el rey.');
  if(S.mir===-2)return D('Mirela','Perdona, forastero... ¿nos conocemos? Tengo la sensación de que debería.');
  if(S.mir===-1)return D('Mirela','Ya elegiste dudar de mí. No tengo más que decirte.');
  return D('Mirela','Reconozco tu rostro, escudero. Caíste defendiendo al rey la noche en que llegó la ceniza. Quienes te acusan de traición mienten.',[
   ['Creerle',()=>{S.mir=1;let t='Entonces aún queda esperanza para Valdora.';if(S.dorn===1){S.dorn=-1;t+=' El capitán Dorn no te perdonará esto.'}return D('Mirela',t)}],
   ['Dudar de ella',()=>{S.mir=-1;return D('Mirela','Los vivos desconfían. Los muertos, a veces, también.')}]])},
 dorn:()=>{
  if(S.dorn===1)return D('Capitán Dorn','Cuando el reino sea nuestro, nadie volverá a cuestionarnos.');
  if(S.dorn===-1)return D('Capitán Dorn','No eres uno de los míos. Aparta.');
  return D('Capitán Dorn','Tú. El traidor que abrió las puertas a la ceniza. El rey ordenó tu ejecución y aun así regresas. Si me sigues, yo mismo te devolveré el honor... y el trono vacío será nuestro.',[
   ['Aliarte con Dorn',()=>{S.dorn=1;let t='Sabía que entenderías cómo funciona el poder.';if(S.mir===1){S.mir=-1;t+=' Mirela te mira desde lejos con tristeza.'}return D('Capitán Dorn',t)}],
   ['Rechazarlo',()=>{S.dorn=-1;return D('Capitán Dorn','Entonces serás un estorbo.')}]])},
 brenna:()=>S.oaths.includes('blood')?D('Brenna','Cuanto más cerca de la muerte, más afilado. No lo olvides.'):
  D('Brenna','Cacé maldiciones diez años. Aprendí que el miedo afila el acero. Mi juramento: golpearás más fuerte cuanto menos vida te quede. Pero beber del frasco rompe el hechizo un rato.',[['Aceptar el juramento',()=>{oath('blood');return D('Brenna','Que la sangre te recuerde.')}],['Ahora no']]),
 voz:()=>{
  if(S.oaths.includes('oblivion'))return D('La Voz','Olvidar es otra forma de recordar.');
  return D('La Voz','El reino no cayó: lo hicieron caer. El rey ordenó borrar la memoria de su pueblo para detener la ceniza. Quien olvida, ve. Te ofrezco el Juramento del Olvido: verás cada golpe antes de que llegue, pero los que te conocían dejarán de reconocerte.',[
   ['Aceptar el juramento',()=>{oath('oblivion');let t='Ahora ves.';if(S.mir===1){S.mir=-2;t+=' En Valdora, Mirela ya no sabrá quién eres.'}return D('La Voz',t)}],['Ahora no']])}};
const CUT={
 sepulturero:()=>D('El Sepulturero','...Cavé tantas tumbas que olvidé la mía. Valdora aún respira. Pregunta allí quién fuiste.',null,D('','Una puerta se abre hacia la ciudad. Obtienes un fragmento de memoria.')),
 pastora:()=>D('La Pastora de Ceniza','La ceniza recuerda lo que tú olvidaste: el rey cerró las puertas a su propio pueblo. Busca al Cazador en el bosque... y desconfía de quien te ofrezca un trono.'),
 cazador:()=>D('El Cazador Hueco','Cacé por orden de quien no tiene nombre. La capital te espera. El Caballero que custodia su puerta... te conoce.'),
 caballero:()=>D('El Caballero que No Murió','Hermano... fuiste tú quien abrió la puerta aquella noche. Yo solo obedecí. Mi espada ya no tiene dueño.',[
  ['Recordar su nombre en voz alta',()=>{S.cab='rec';return D('','Pronuncias su nombre. Por un instante, el Caballero vuelve a ser un hombre y descansa.')}],
  ['Romper sus cadenas para siempre',()=>{S.cab='lib';return D('','Las cadenas se deshacen en polvo. Con ellas se rompe algo más antiguo.')}],
  ['Reclamar su mando',()=>{S.cab='tom';return D('','Las legiones que custodian la puerta te reconocen como su señor.')}]],null),
 rey:()=>D('El Rey sin Nombre','Así que regresaste. Yo ordené que olvidaras. Mi pueblo fue el precio de detener la ceniza. Ahora decide qué quedará del reino.',null,finalChoice())};
function finalChoice(){const o=[];
 if(S.mir===1||S.cab==='rec')o.push(['Restauración: reconstruir el reino',()=>fin('rest')]);
 if(S.cab==='lib')o.push(['Liberación: destruir el ciclo',()=>fin('lib')]);
 if(S.dorn===1||S.cab==='tom')o.push(['Usurpación: ocupar el trono',()=>fin('usu')]);
 o.push(['Olvido: dejar que el mundo siga sin ti',()=>fin('olv')]);
 return D('El trono vacío','El trono espera. Lo que pasó antes decide qué caminos siguen abiertos.',o)}
const ENDS={
 rest:['Restauración','Reconstruyes Valdora piedra a piedra, con Mirela y los supervivientes. No borras el pasado: lo aceptas, incluso las leyes del antiguo rey. El reino vuelve a tener nombre, y tú también.'],
 lib:['Liberación','Rompes el poder que mantenía al reino atrapado en su ciclo de olvido. La ceniza se disipa y las cadenas caen, pero el mundo que conocías se desvanece. Lo que venga será nuevo y sin dueño.'],
 usu:['Usurpación','Te sientas en el trono. Dorn y las legiones juran lealtad. Prometes ser distinto al rey, pero la corona pesa, y la primera orden que firmas es la de olvidar.'],
 olv:['Olvido','Das la espalda a la verdad y a la corona. El mundo sigue sin ti y nadie recuerda tu nombre. Quizás es justo lo que pediste en aquella cripta.']};
