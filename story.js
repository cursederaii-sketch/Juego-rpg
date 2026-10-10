// ===== HISTORIA: diálogos, recuerdos, misiones, decisiones y finales =====
const D=(n,t,o,nx)=>({n,t,o,nx});
const short=k=>OATHS[k][0].replace('Juramento del ','').replace('Juramento de ','');
const nm=()=>S.oath==='oblivion'?'forastero':S.name;
const oath=k=>{if(!S.oaths.includes(k)){S.oaths.push(k);if(!S.oath)S.oath=k;toast('Juramento: '+short(k))}};
const getW=id=>{if(!S.wpns.includes(id)){S.wpns.push(id);toast('Obtienes: '+WP[id].n)}};
const giveRel=id=>{if(!S.relOwn.includes(id)){S.relOwn.push(id);toast('Reliquia: '+RELS[id][0]);if(S.relOwn.length>=3)ach('coleccion');if(S.rel.length<2)S.rel.push(id)}};
const giveAb=id=>{if(!S.ab[id]){S.ab[id]=1;toast('Habilidad: '+ABIL[id][0]);if(window.W&&W.cols)W.applyDyn&&0}};
const KEYN={archivo:'Llave del Archivo'};
const giveKey=id=>{if(!S.keys[id]){S.keys[id]=1;toast('Obtienes: '+KEYN[id])}};
const nNotes=()=>Object.keys(S.notes).length,nTruth=()=>Object.keys(S.tr).length,nMem=()=>Object.keys(S.mem).length;
const doneQ=()=>{S.st.quests++;ach('quest')};

const INTRO=()=>D('','Despiertas sobre piedra fría. No recuerdas quién eres ni cómo llegaste a esta cripta. Solo un nombre te viene a los labios, y lo repites sin saber si es el tuyo: «'+S.name+'». En el muro, raspada con una espada, una inscripción: «No permitas que el mundo vuelva a olvidarte».',null,
 D('','El reino de Valdora se borra de la memoria de quienes lo habitaron. Para saber quién fuiste deberás llegar a la capital y averiguar por qué regresaste de entre los muertos. Cada jefe guarda un recuerdo tuyo... pero los recuerdos no siempre coinciden. Descansa en las hogueras con «Actuar».'));

// ---- RECUERDOS (uno por jefe; se contradicen hasta el final) ----
const MEM={
 sepulturero:['La noche del juramento','Te arrodillas ante el rey. Su mano, fría, descansa sobre tu hombro. «Serás mi escudero. Nadie abrirá esa puerta mientras vivas», dice. Juras. Lo recuerdas con orgullo y con un frío que no sabes explicar.'],
 pastora:['La llave en tu mano','Una puerta enorme, un reino entero detrás. La llave está en tu mano. Sientes la ceniza llegar por el norte y, sin dudarlo, la giras. Alguien grita tu nombre. No sabes si de rabia o de súplica.'],
 cazador:['La orden desde la muralla','El rey, sobre la muralla, ordena cerrar la puerta con la gente aún fuera. Tú corres hacia él con las manos vacías. Nunca tuviste la llave. Pero entonces... ¿qué giraste?'],
 caballero:['El hermano de armas','Un hombre con armadura se ríe a tu lado, en la torre de guardia. «Si abres, yo cargaré con la culpa», dice. Le prometes que volverás por él. Dices que sí. O no lo dices. El recuerdo cambia cada vez que lo miras.'],
 rey:['Lo que pediste',()=>'La cripta, antes de todo. El rey, sin corona, arrodillado junto a ti. La ceniza no venía del norte: venía de dentro, del miedo de un reino que no podía olvidar. Giraste la llave para dejar salir a la gente. Y fue tuya la idea del pacto: que todos olvidaran, para que la ceniza no tuviera de qué alimentarse. Tú raspaste la inscripción del muro. «No permitas que el mundo vuelva a olvidarte» no era una súplica: era una advertencia.'+(nTruth()>=3?' Y entonces lo recuerdas: el nombre que susurraste al despertar no fue un accidente. Era el tuyo: «'+S.name+'».':' Quedan huecos que no logras llenar. Quizá en rincones que no visitaste hay voces que sabrían decirte quién eras.')]};
const TRU={
 osario:['Lo que rogó la reina','La Guardiana te lo muestra: la reina rogó al rey que no cerrara la puerta. Tú estabas en la sala. Fuiste el único que la escuchó... y el único que se atrevió a decir que sí.'],
 archivos:['El registro quemado','En el manuscrito, dos firmas bajo un mismo pacto: la del rey y una letra que reconoces. Es la misma que raspó la inscripción de la cripta. Alguien pidió olvidar. Alguien pagó para lograrlo.'],
 fosa:['El decreto del olvido','El Heraldo anunció el decreto al pueblo sin voz, con la boca abierta. Ahora lo oyes, completo: «A petición del escudero». Tú pediste que olvidaran. Tú, para salvarlos.']};
const memD=(id,nx)=>{if(!S.mem[id]){S.mem[id]=1;if(nMem()>=5)ach('rompecabezas')}const m=MEM[id];return D('Recuerdo · '+m[0],typeof m[1]==='function'?m[1]():m[1],null,nx)};
const truD=(id,nx)=>{if(!S.tr[id]){S.tr[id]=1;if(nTruth()>=3)ach('verdad')}const m=TRU[id];return D('Verdad · '+m[0],m[1],null,nx)};

// ---- LÁPIDAS Y NOTAS ----
const NOTES={
 cripta1:['Lápida de un guardia','Aquí yace quien cerró la puerta cuando se lo ordenaron. Y no preguntó por qué.'],
 cripta2:['Lápida sin nombre','Quien duerme aquí pidió que borraran su nombre de la piedra. Alguien cumplió el pedido con demasiado cuidado.'],
 cripta3:['Orden de los cirios','Los cuatro cirios de la cámara de guardia se encienden en el orden de la jornada: primero el azul del alba, luego el dorado del mediodía, después el rojo del ocaso y, por último, el verde de la noche.'],
 cripta4:['Nota de un cavador','Al oeste de la cámara de guardia la piedra suena a hueco. El rey ordenó tapiar el osario. No era lugar para muertos.'],
 cripta_sec:['Dedicatoria','Para quien me encuentre: el anillo no te hará más fuerte, solo menos visible para la muerte. Paciencia: el que se esquiva dos veces, vive tres.'],
 valdora1:['Cartel de la plaza','Se busca a un escudero por abrir la puerta norte. Se ofrece recompensa. La firma del cartel fue raspada.'],
 valdora2:['Diario de una vecina','Mi hija dice que vio a un hombre sin nombre bajo la ceniza, girando una llave con lágrimas en la cara. Le dije que se callara. Aún no sé si hice bien.'],
 valdora3:['Lápida del campanario','Aquí yace la última campana. Su sonido era un aviso. Por eso la fundieron.'],
 bosque1:['Marca de cazador','Las presas ya no huyen. Se acercan. Quien nos caza no distingue entre bosque y reino.'],
 bosque2:['Piedra de la Voz','No se oye a quien susurra al olvido, porque él mismo lo pidió.'],
 bosque3:['Grito en la corteza','El Foso del Rebaño está al este, bajo los pinos. Quien lo cruza sin miedo sale con la voz perdida.'],
 puertas1:['Lápida de un legionario','Aldric era el nombre de su capitán. Juró cargar con la culpa de quien abriera la puerta. Nunca supo que quien abría era su hermano.'],
 puertas2:['Orden fechada','Orden de cierre de las puertas. Firma: el rey. Fecha: la noche de la ceniza. Anexo, en otra letra: «El escudero se opuso».'],
 arch1:['Registro de entradas','Libro de entradas del Archivo: la última página fue arrancada. Queda el borde, manchado de hollín y de dedos.'],
 arch2:['Aviso a los vigilantes','Quien entre al Archivo no debe ser visto. Quien se lleve el manuscrito no debe salir. Que suenen las campanas.'],
 osario1:['Epitafio de la Guardiana','Guardé a la reina hasta que la reina me pidió que dejara de guardarla. Obedecí. Ya nadie me ordena nada.'],
 fosa1:['Cuerno roto','«Que no se oiga. Que nadie sepa quién lo pidió.» — palabras del decreto, tal como las anunció el Heraldo, hasta que perdió la voz.']};
const readNote=id=>{const n=NOTES[id];if(!S.notes[id]){S.notes[id]=1;if(nNotes()>=5)ach('notas')}if(id==='puertas1'){S.aldric=1}return D('Lápida · '+n[0],n[1])};

// ---- PNJ ----
const NPC={
 sombra:()=>S.oaths.includes('guardian')?D('Sombra del Guardián','Que tu escudo no caiga, '+nm()+'. La capilla del norte solo abre a quien jura como yo.'):
  D('Sombra del Guardián','Fui guardián de esta cripta. El rey prometió que nadie olvidaría a quienes caímos con él. Mintió. Te ofrezco mi juramento: tus bloqueos serán firmes, pero mientras un jefe te acose no podrás curarte.',[['Aceptar el juramento',()=>{oath('guardian');return D('Sombra del Guardián','Un escudo no huye. Recuérdalo. Hay una capilla al norte que ahora te abrirá su muro.')}],['Ahora no']]),
 mirela:()=>{
  const n=nm();
  if(S.mir===-2)return D('Mirela','Perdona, forastero... ¿nos conocemos? Tengo la sensación de que debería.');
  if(S.mir===-1)return D('Mirela','Ya elegiste dudar de mí. No tengo más que decirte.');
  if(S.mir===1){const q=S.q.mir;
   if(q===0)return D('Mirela','Sigo creyendo en ti, '+n+'. Y quiero pedirte algo. Mi gente dejó retratos en las casas antes de huir; la ceniza se llevó el resto. Son tres. Si los encuentras, sabremos qué rostros olvidó Valdora.',[['Buscaré los retratos',()=>{S.q.mir=1;return D('Mirela','Gracias. Están en las casas y en las ruinas de la ciudad.')}],['Ahora no']]);
   if(q===1){if(S.rt<3)return D('Mirela','Tienes '+S.rt+' de 3 retratos. Las casas aún guardan secretos.');
    S.q.mir=2;S.aldric=1;giveKey('archivo');S.fmax=Math.max(S.fmax,4);S.flasks=S.fmax;doneQ();
    return D('Mirela','Aldric... en uno de los retratos está Aldric, el Caballero que guarda la capital. Eran como hermanos, tú y él. Si lo enfrentas, dilo en voz alta. Toma también esto: la llave del Archivo, junto a la plaza, y un frasco más. Los vecinos lo dejaron para ti.')}
   return D('Mirela','Termina lo que empezó el rey, '+n+'. Yo te esperaré en Valdora.')}
  return D('Mirela','Reconozco tu rostro, escudero. ¿'+n+'? Ese nombre me suena, aunque no sé de dónde. Caíste defendiendo al rey la noche en que llegó la ceniza. Quienes te acusan de traición mienten.',[
   ['Creerle',()=>{S.mir=1;let t='Entonces aún queda esperanza para Valdora.';if(S.dorn===1){S.dorn=-1;t+=' El capitán Dorn no te perdonará esto.'}return D('Mirela',t)}],
   ['Dudar de ella',()=>{S.mir=-1;return D('Mirela','Los vivos desconfían. Los muertos, a veces, también.')}]])},
 dorn:()=>{
  if(S.dorn===-1)return D('Capitán Dorn','No eres uno de los míos. Aparta.');
  if(S.dorn===1){const q=S.q.dorn;
   if(q===0)return D('Capitán Dorn','Necesito una prueba de lealtad. El estandarte de mi regimiento quedó en el Bosque Marchito, en un claro al sur. Tráemelo y te daré mi estoque y las llaves del Archivo.',[['Lo traeré',()=>{S.q.dorn=1;return D('Capitán Dorn','No me defraudes. Los muertos tampoco perdonan.')}],['Ahora no']]);
   if(q===1){if(!S.est)return D('Capitán Dorn','El estandarte, '+nm()+'. En el bosque, hacia el sur.');
    S.q.dorn=2;giveKey('archivo');getW('estoque');doneQ();return D('Capitán Dorn','Mis colores... Toma mi estoque y la llave del Archivo. Ahora eres de los míos.')}
   return D('Capitán Dorn','Cuando el reino sea nuestro, nadie volverá a cuestionarnos.')}
  return D('Capitán Dorn','Tú. El traidor que abrió las puertas a la ceniza. El rey ordenó tu ejecución y aun así regresas. Si me sigues, yo mismo te devolveré el honor... y el trono vacío será nuestro.',[
   ['Aliarte con Dorn',()=>{S.dorn=1;let t='Sabía que entenderías cómo funciona el poder.';if(S.mir===1){S.mir=-1;t+=' Mirela te mira desde lejos con tristeza.'}return D('Capitán Dorn',t)}],
   ['Rechazarlo',()=>{S.dorn=-1;return D('Capitán Dorn','Entonces serás un estorbo. Mis hombres y yo nos encargaremos de ti en el bosque.')}]])},
 brenna:()=>{
  if(!S.oaths.includes('blood'))return D('Brenna','Cacé maldiciones diez años. Aprendí que el miedo afila el acero. Mi juramento: golpearás más fuerte cuanto menos vida te quede. Pero beber del frasco rompe el hechizo un rato.',[['Aceptar el juramento',()=>{oath('blood');return D('Brenna','Que la sangre te recuerde. Hay un muro de espinas en el bosque que solo cede ante quien jura así.')}],['Ahora no']]);
  const q=S.q.bre;
  if(q===0)return D('Brenna','Hay huecos por todo el reino, y cada uno fue alguien. Mata ocho y te enseñaré el Sello de la Furia.',[['Aceptar la caza',()=>{S.q.bre=1;S.bre0=S.st.hollow;return D('Brenna','Ocho. Ni uno menos.')}],['Ahora no']]);
  if(q===1){const k=S.st.hollow-S.bre0;if(k<8)return D('Brenna','Llevas '+k+' de 8 huecos.');S.q.bre=2;giveRel('furia');S.frag+=3;doneQ();return D('Brenna','Ocho. Toma el Sello, y tres fragmentos que te debía.')}
  return D('Brenna','Cuanto más cerca de la muerte, más afilado. No lo olvides.')},
 voz:()=>{
  if(S.oaths.includes('oblivion'))return D('La Voz','Olvidar es otra forma de recordar. Hay muros que solo existen para quien recuerda... y puertas que solo ve quien olvida.');
  return D('La Voz','El reino no cayó: lo hicieron caer. El rey ordenó borrar la memoria de su pueblo para detener la ceniza. Quien olvida, ve. Te ofrezco el Juramento del Olvido: verás cada golpe antes de que llegue, pero los que te conocían dejarán de reconocerte.',[
   ['Aceptar el juramento',()=>{oath('oblivion');let t='Ahora ves.';if(S.mir===1){S.mir=-2;t+=' En Valdora, Mirela ya no sabrá quién eres.'}return D('La Voz',t)}],['Ahora no']])},
 ysolde:()=>{ach('luna');
  if(S.ab.see)return D('Ysolde','La luna te ve ahora, '+nm()+'. Úsala bien: lo oculto brilla.');
  if(S.q.ys===0)return D('Ysolde','Solo existo cuando el sol se olvida de mí. Los que duermen en las tumbas escribieron cosas que nadie leyó. Lee cinco de sus lápidas y te daré una lente para ver lo que el reino escondió.',[['Aceptar',()=>{S.q.ys=1;return D('Ysolde','Busca lápidas con un brillo tenue, en criptas, ruinas y claros.')}],['Ahora no']]);
  if(nNotes()>=5){giveAb('see');S.q.ys=2;doneQ();return D('Ysolde','Ya leíste lo suficiente. Toma la Lente de Luna.')}
  return D('Ysolde','Has leído '+nNotes()+' de 5 lápidas.')},
 anselmo:()=>S.bk.pastora?D('Anselmo','Valdora respira, '+nm()+'. Ahora hasta las campanas vuelven a soñar. Los retratos de Mirela, si aún no los tienes, están en las casas del norte y entre las ruinas del oeste.'):
  D('Anselmo','Soy el campanero. Mis campanas callaron cuando el rey las fundió. Escucha: las lápidas de la cripta guardan órdenes, un muro hueco esconde un osario, y dicen que de noche Valdora tiene una vecina que no duerme. Cuando te falte un salto, busca la capa de quien cuida los huesos.'),
 aldea1:()=>D('Superviviente','Dicen que volvió alguien de entre los muertos. Si eres tú, gracias... o perdón. No sé cuál.'),
 aldea2:()=>D('Superviviente','Ya no huele a ceniza. Es un milagro pequeño, pero lo es.'),
 aldric:()=>{S.flasks=S.fmax;if(P)P.hp=P.mhp;return D('Aldric','Gracias por pronunciar mi nombre, hermano. Descansa tú también. Te debía esto: que las heridas no duelan, por ahora.')},
 mirela2:()=>{if(!S.aldric){S.aldric=1;return D('Mirela','Pasé por la puerta trasera. El Caballero que guarda la capital se llamaba Aldric. Su cadena no es de acero, es de culpa. Díselo con respeto.')}return D('Mirela','Aldric te espera. Dile quién eres, no quién fuiste.')},
 dorn2:()=>D('Capitán Dorn','Mis hombres no te estorbarán aquí. Los de la capital sí. No te confíes.')};

const CUT={
 sepulturero:()=>D('El Sepulturero','...Cavé tantas tumbas que olvidé la mía. Valdora aún respira. Pregunta allí quién fuiste.',null,()=>memD('sepulturero',D('','Una puerta se abre hacia la ciudad. Obtienes un fragmento de memoria.'))),
 pastora:()=>D('La Pastora de Ceniza','La ceniza recuerda lo que tú olvidaste: el rey cerró las puertas a su propio pueblo. Busca al Cazador en el bosque... y desconfía de quien te ofrezca un trono.',null,()=>memD('pastora')),
 cazador:()=>D('El Cazador Hueco','Cacé por orden de quien no tiene nombre. La capital te espera. El Caballero que custodia su puerta... te conoce.',null,()=>memD('cazador')),
 caballero:()=>D('El Caballero que No Murió','Hermano... fuiste tú quien abrió la puerta aquella noche. Yo solo obedecí. Mi espada ya no tiene dueño.',null,()=>cabChoice()),
 rey:()=>D('El Rey sin Nombre','Así que regresaste, '+nm()+'. Yo ordené que olvidaras. Mi pueblo fue el precio de detener la ceniza. Ahora decide qué quedará del reino.',null,()=>memD('rey',finalChoice())),
 guardiana:()=>D('La Guardiana del Osario','Descansa, por fin. Llévate mi capa: te enseñará a cruzar lo que otros temen. Y llévate esto...',null,()=>truD('osario')),
 heraldo:()=>D('El Heraldo Mudo','(Mueve los labios sin sonido. Después, por primera vez en años, habla.) «El decreto... lo firmaron dos manos.»',null,()=>truD('fosa')),
 capdorn:()=>D('Capitán Dorn','Debí matarte antes. O seguirte. Quédate con el estoque: no hará lo que yo no hice.')};
const cabChoice=()=>D('Aldric','¿Qué harás conmigo?',[
 ['Recordar su nombre en voz alta',()=>{if(!S.aldric)return D('','Buscas su nombre... y no lo encuentras. Quizá alguien en Valdora aún lo recuerde, o esté escrito en alguna piedra del camino.',null,cabChoice);S.cab='rec';return D('','Dices: «Aldric». Por un instante, el Caballero vuelve a ser un hombre y descansa.',null,()=>memD('caballero'))}],
 ['Romper sus cadenas para siempre',()=>{S.cab='lib';return D('','Las cadenas se deshacen en polvo. Con ellas se rompe algo más antiguo.',null,()=>memD('caballero'))}],
 ['Reclamar su mando',()=>{S.cab='tom';return D('','Las legiones que custodian la puerta te reconocen como su señor.',null,()=>memD('caballero'))}]]);
function finalChoice(){const o=[];
 if(S.mir===1||S.cab==='rec')o.push(['Restauración: reconstruir el reino',()=>fin('rest')]);
 if(S.cab==='lib')o.push(['Liberación: destruir el ciclo',()=>fin('lib')]);
 if(S.dorn===1||S.cab==='tom')o.push(['Usurpación: ocupar el trono',()=>fin('usu')]);
 if(nTruth()>=3)o.push(['Nombre: decir quién fuiste',()=>fin('nom')]);
 o.push(['Olvido: dejar que el mundo siga sin ti',()=>fin('olv')]);
 return D('El trono vacío','El trono espera. Lo que pasó antes decide qué caminos siguen abiertos.',o)}
const ENDS={
 rest:['Restauración','Reconstruyes Valdora piedra a piedra, con Mirela y los supervivientes. No borras el pasado: lo aceptas, incluso las leyes del antiguo rey. El reino vuelve a tener nombre, y tú también.'],
 lib:['Liberación','Rompes el poder que mantenía al reino atrapado en su ciclo de olvido. La ceniza se disipa y las cadenas caen, pero el mundo que conocías se desvanece. Lo que venga será nuevo y sin dueño.'],
 usu:['Usurpación','Te sientas en el trono. Dorn y las legiones juran lealtad. Prometes ser distinto al rey, pero la corona pesa, y la primera orden que firmas es la de olvidar.'],
 olv:['Olvido','Das la espalda a la verdad y a la corona. El mundo sigue sin ti y nadie recuerda tu nombre. Quizás es justo lo que pediste en aquella cripta.'],
 nom:()=>['El Nombre','Recuerdas, por fin, y no huyes de ello. Pronuncias «'+S.name+'» frente al trono vacío, y el reino entero, piedra a piedra, lo repite. No restauras ni destruyes: devuelves a cada olvidado el nombre que el pacto le quitó, el tuyo primero. Valdora despierta sabiendo lo que costó. Es el único final en el que nadie tiene que perdonarte para que seas libre.']};

// ---- BESTIARIO: [nombre, descripción (al verlo), historia (1ª muerte), consejo (3 muertes)] ----
const BEST={
 soldier:['Soldado de Valdora','Guardia con espada y armadura ligera.','Servían a la ciudad. Ahora obedecen a una orden que ya nadie recuerda.','Sus tajos son lentos: esquiva hacia un lado y castiga la recuperación.'],
 hollow:['Hueco','Una sombra encorvada que embiste con garras.','Un vecino al que el olvido le quitó el rostro. Ataca a lo que aún tiene nombre.','Sus embestidas son rápidas pero cortas: espera la zancada y retrocede.'],
 archer:['Arquero Marchito','Mantiene la distancia y dispara saetas.','Cazaba ciervos en el bosque. Ahora caza recuerdos.','Parar una saeta con el escudo en el último instante la deja sin efecto.'],
 brute:['Bruto Acorazado','Enorme, con un martillo que parte piedra.','Vigilaba las murallas. Su armadura pesa lo que pesa su culpa.','Los golpes pesados no lo aturden: usa ligeros y la esquiva tras su golpe.'],
 warden:['Vigilante del Archivo','Patrulla con una linterna; ve en cono frente a sí.','Los vigilantes del Archivo juraron no dejar salir lo escrito. Aún patrullan.','Golpéalo por sorpresa antes de que te note: hace mucho más daño.'],
 sepulturero:['El Sepulturero','Cava tumbas con una pala ancha.','Enterró a los suyos y olvidó cavar la propia.','Cuando alza la pala, el golpe es lento: esquiva y castiga.'],
 pastora:['La Pastora de Ceniza','Dispara brasas y llama a su rebaño.','Guio al pueblo fuera de las murallas. La ceniza la alcanzó a ella primero.','Las brasas se esquivan de lado; en la fase final llueve ceniza: no te quedes quieto.'],
 cazador:['El Cazador Hueco','Salta sobre su presa y cambia de objetivo.','Cazaba por orden de quien no tiene nombre.','Sus saltos tienen un breve aviso: esquiva atravesándolo.'],
 caballero:['El Caballero que No Murió','Un hermano de armas encadenado a su puerta.','Aldric. Cargó con una culpa que no era suya.','Aprovecha sus pausas tras el golpe amplio; en la última fase la arena se rompe.'],
 rey:['El Rey sin Nombre','Gobierna un reino que ya no lo recuerda.','Pagó con la memoria de su pueblo para detener la ceniza.','Tiene todos los ataques del reino. Paciencia: cada fase tiene un ritmo.'],
 guardiana:['La Guardiana del Osario','Salta entre huesos que se levantan.','Guardó a la reina hasta que esta se lo pidió.','Se lanza en saltos: espera el aviso y contraataca.'],
 heraldo:['El Heraldo Mudo','Teletransportes, brasas y gritos sin voz.','Anunció el decreto del olvido y perdió la voz.','Tras cada teletransporte golpea por la espalda: gira y bloquea.'],
 capdorn:['Capitán Dorn','Espadachín veloz con sus hombres.','Un capitán que prefirió el poder a la pregunta.','Elimina antes a sus soldados: el estoque es rápido pero corto.']};

// ---- LOGROS ----
const ACH=[
 ['sangre','Primera sangre','Derrota a un enemigo.'],['parada','Reflejos','Realiza 10 paradas perfectas.'],['jefe','Algo que recordar','Derrota a tu primer jefe.'],
 ['secreto','Ojo atento','Descubre un muro falso.'],['notas','Lector de tumbas','Lee 5 lápidas.'],['salto','Un salto de fe','Cruza una grieta con la esquiva.'],
 ['sigilo','Como una sombra','Realiza 5 golpes de sorpresa.'],['oleadas','Sobreviviente','Termina las oleadas del Foso.'],['coleccion','Coleccionista','Consigue 3 reliquias.'],
 ['luna','Luz de luna','Conoce a Ysolde.'],['rompecabezas','Rompecabezas','Reúne los 5 recuerdos.'],['verdad','Verdad incómoda','Reúne las 3 verdades ocultas.'],
 ['puzzle','Memoria de fuego','Resuelve el puzzle de los cirios.'],['terco','Terco','Cae 10 veces.'],['quest','Amigo del reino','Completa una misión de un PNJ.'],['fin','El final de un camino','Alcanza cualquier final.']];
function ach(id){if(S.ach[id])return;S.ach[id]=1;const a=ACH.find(x=>x[0]===id);if(a)toast('Logro: '+a[1])}
function checkAch(){const t=S.st;if(t.kills>=1)ach('sangre');if(t.parries>=10)ach('parada');if(t.sneak>=5)ach('sigilo');if(t.deaths>=10)ach('terco');if(S.relOwn.length>=3)ach('coleccion')}
