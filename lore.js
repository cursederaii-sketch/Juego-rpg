// ===== LORE AMPLIADO: notas ambientales, Crónica, sueños, últimas palabras de jefes y la Segunda Voz =====
// Basado en Juramento_Lore_Ampliado.docx. Se engancha a lo existente sin cambiar su lógica.

// ---- 1. NOTAS NUEVAS (pistas ambientales: muestran, no explican) ----
Object.assign(NOTES,{
 cripta5:['Raspaduras en la piedra','Las inscripciones de esta cripta están incompletas, raspadas con una herramienta de punta fina. Los trazos se parecen a los de la frase del muro del fondo.'],
 valdora4:['Mesa preparada','Una mesa puesta para seis. Hay una séptima silla, apartada, mirando a la pared donde antes colgaba un retrato.'],
 valdora5:['Puerta reforzada','Las tablas están clavadas por el lado de dentro. Alguien no quería que entraran... o alguien no quería salir.'],
 valdora6:['Marco sin rostros','Tres siluetas en un retrato. Los rostros fueron raspados con cuidado, no con rabia: quien lo hizo sabía exactamente a quién borraba.'],
 bosque4:['Trampas orientadas','Las trampas no guardan ningún tesoro. Apuntan al sendero, como si marcaran por dónde debía pasar la gente.'],
 bosque5:['El claro que se repite','Reconoces este claro: lo cruzaste hace un momento. Las voces del bosque nunca terminan la misma frase de la misma manera.'],
 puertas3:['Cadenas por ambos lados','Las cadenas fueron reparadas desde dentro y desde fuera. Hay huellas de manos a alturas distintas: unos tiraban para abrir, otros para cerrar.'],
 trono1:['Marcos vacíos','Los retratos fueron retirados sin tocar los marcos. Cada ausencia está limpia: alguien se tomó el trabajo de que no quedara polvo.'],
 trono2:['Lista de reyes','Entre dos nombres de la lista hay un espacio en blanco del ancho exacto de un nombre. Nadie intentó rellenarlo.'],
 osario2:['Silla frente a la ventana','Una silla orientada hacia una ventana desde la que se veía la Puerta Norte. En la repisa, cartas sin quemar y una lista de nombres escrita por muchas manos.'],
 osario3:['Cintas cortadas','Montones de cinta funeraria, cortada con una hoz de filo corto. Marcaban tumbas que ya no se podían proteger.'],
 archivos3:['Estantes vacíos','El fuego se ensañó con estantes enteros, pero dos hojas se salvaron bajo una misma tapa: dos firmas, dos letras distintas.'],
 fosa2:['Filas marcadas','El suelo guarda surcos en filas ordenadas. Alguien enseñó aquí a una multitud cuándo inclinar la cabeza y cuándo avanzar.'],
 marisma3:['Marcas bajo el barro','Un zapato de niño, una taza, una llave: todo con una marca de propiedad bajo el fango. Alguien necesitaba que fueran de nadie.'],
 cantera3:['Picos hacia la compuerta','Las herramientas descansan orientadas hacia la compuerta. Los trabajadores intentaron salir. La compuerta se cerró desde fuera.'],
 torre3:['Aceite repuesto','El depósito del faro fue rellenado después de la hora oficial de apagado. Alguien mantuvo una luz mínima mientras pudo.'],
 puerto3:['Campana rota','Una campana a medio fundir. Su badajo conserva tres golpes de uso: duelo, evacuación y silencio. El último es el más gastado.']});
const LORE_NOTES={cripta:[[17,33,'cripta5']],valdora:[[16,34,'valdora4'],[7,45,'valdora5'],[6,19,'valdora6']],bosque:[[18,39,'bosque4'],[14,32,'bosque5']],puertas:[[15,26,'puertas3']],
 trono:[[6,33,'trono1'],[49,33,'trono2']],osario:[[10,24,'osario2'],[24,3,'osario3']],archivos:[[12,20,'archivos3']],fosa:[[18,20,'fosa2']],marisma:[[15,26,'marisma3']],
 cantera:[[8,27,'cantera3']],torre:[[26,40,'torre3']],puerto:[[46,26,'puerto3']]};
RG.forEach(r=>{const L=LORE_NOTES[r.id];if(!L)return;const b=r.build;r.build=function(W){b.call(this,W);L.forEach(([x,y,id])=>W.note(x,y,id))}});

// ---- 2. CRÓNICA ampliada (textos más ricos + entradas nuevas) ----
const croSet=(name,txt)=>{const c=CRO.find(e=>e[0]===name);if(c)c[2]=txt};
croSet('El reino de Valdora','Un reino pequeño y terco, de campanas y murallas, que prosperó junto a la Puerta Norte. Sus leyes se heredaban sin preguntar su origen; su lema, tallado sobre cada arco: «Lo que se recuerda, permanece».');
croSet('La Puerta Norte','Una compuerta de piedra más antigua que el reino, sin emblema ni cerradura visible. Los reyes juraban custodiarla sin saber qué protegían. No contenía un ejército: contenía la presión de todo lo que Valdora se negaba a reconocer.');
croSet('La noche de la ceniza','Una niebla tenue sobre los campos. Primero se olvidaba una palabra; luego, a quién se esperaba en casa. Los sacerdotes ordenaron confesiones, los magistrados quemaron archivos, los nobles prohibieron nombrar las derrotas. Cada intento de esconder el dolor lo volvía más fácil para la ceniza.');
croSet('Los Huecos','No son una raza ni una maldición: son personas que pidieron olvidar más de lo que cabía en ellas. Conservan hábitos sin contexto —un soldado guarda una puerta que ya no sabe nombrar— y atacan a lo que aún tiene nombre porque les recuerda que alguna vez lo tuvieron.');
croSet('El decreto del olvido','«Por decreto del rey, a petición del escudero.» Dos firmas lo sellaron: una propuso, otra convirtió la idea en ley. Ninguna aparece en los registros públicos, pero ninguna pudo borrar que fueron dos.');
croSet('La reina Maelis','No era una profeta: escuchaba lo que otros descartaban. Rogó que no cerraran la puerta mientras hubiera gente fuera y, tras el pacto, pidió algo más pequeño y más difícil: que alguien dejara una señal que sobreviviera a la orden de olvidar.');
croSet('Los juramentos','Tres respuestas al miedo: resistir sin ceder, convertir el dolor en fuerza o renunciar a ser reconocido. Cada uno tiene un precio, y ninguno es una maldición: son pactos que cambian la relación entre poder, identidad y renuncia.');
croSet('El Archivo','Allí se escribía lo que el reino debía recordar. Tras el decreto se guardó lo que debía callarse y se quemó el resto. Dos firmas sobrevivieron bajo una misma tapa.');
croSet('Aldric','Capitán de la Puerta y hermano de armas del escudero. Prometió cargar con la culpa si alguien abría contra la orden. La promesa se volvió inmovilidad: mientras él fuera el culpable, nadie tendría que preguntar por el rey ni por el pacto.');
croSet('El Rey sin Nombre','Creyó que gobernar era evitar el pánico a cualquier precio. Amaba a Maelis, pero leyó su advertencia como amenaza al orden. Tras el pacto perdió hasta el nombre que legitimaba su autoridad y conservó solo los hábitos del mando.');
croSet('El escudero','Quien giró el mecanismo para que la gente pudiera salir, quien propuso el pacto y quien raspó la frase en el muro. Un hombre leal, desobediente y compasivo que confundió salvar vidas con decidir por ellas.');
croSet('La ceniza','No viene de fuera: nace de la memoria negada y del miedo colectivo. Nombrar a los muertos, reconocer una culpa o escuchar a una víctima la debilita. No hay victoria militar posible: solo las decisiones cambian lo que significa.');
CRO.push(
 ['Reglas de la ceniza',()=>S.bk.pastora||nTruth()>=1,'Se espesa donde se niega una verdad que sigue condicionando el presente. Puede imitar voces, siluetas y gestos recordados a medias. No siempre intenta matar: a veces atrae hacia lo que nadie se atreve a mirar.'],
 ['El olvido como herramienta',()=>nTruth()>=3||S.mem.rey,'Se presentó como un sacrificio compartido, pero los costes no se repartieron igual. Quienes tenían poder sellaron archivos y movieron guardias; los vulnerables perdieron nombres, hogares y la capacidad de demostrar lo que les habían hecho.'],
 ['El Sepulturero',()=>S.bk.sepulturero,'Enterró a quienes murieron en la cripta como promesa de que alguien conservaría su nombre. Los nombres desaparecieron de las lápidas y siguió cavando. Olvidó reservar una tumba para sí.'],
 ['La Pastora de Ceniza',()=>S.bk.pastora,'Guía de evacuación: llevó familias enteras hacia una salida que creía segura. La niebla la alcanzó antes que a ellas. Repite el único acto que aún comprende: reunir, contar y conducir.'],
 ['El Cazador Hueco',()=>S.bk.cazador,'Recibió la orden de perseguir a quien abandonara los caminos seguros. «Por orden de quien no tiene nombre» sobrevivió al nombre. Las marcas de sus presas coinciden con señales de evacuación.'],
 ['La Voz del bosque',()=>S.bk.cazador||S.oath==='oblivion','Habla como una sola, pero sus frases cambian de ritmo, como si varias personas intentaran terminar la misma oración. Es una acumulación de excusas y súplicas que el pacto no pudo borrar.'],
 ['La Guardiana del Osario',()=>S.bk.guardiana,'Juró proteger el descanso de la reina. Cuando Maelis le pidió que la dejara en paz, ella oyó una prueba más de que estaba en peligro. Confundió fidelidad con desobedecer la última voluntad de a quien amaba.'],
 ['El Heraldo Mudo',()=>S.bk.heraldo,'Anunció el pacto en las plazas hasta que la fórmula sobrevivió a su memoria. Perdió la voz cuando olvidó qué significaba la petición y quién debía cargar con ella.'],
 ['La Madre del Fango',()=>S.bk.madre,'Guarda lo que la ciudad arrojó al pantano: cartas, uniformes, juguetes, documentos. No distingue entre un recuerdo valioso y una prueba peligrosa. Todo lo que cae al fango forma parte de ella.'],
 ['El Capataz de Hierro',()=>S.bk.capataz,'Selló la mina con trabajadores dentro porque temía que desobedecer la convirtiera en otra puerta abierta. Su firma quedó como prueba de una orden que el reino prefirió atribuir a nadie.'],
 ['El Vigía de Ceniza',()=>S.bk.vigia,'Mantuvo el faro tres noches mientras llegaba gente por la costa. Cuando recibió la orden de apagarlo, obedeció. Nunca supo si salvó a los que ya estaban dentro o condenó a los que aún buscaban el camino.'],
 ['La Segunda Voz',()=>nBoss()>=2,'El efecto activo del pacto: una voluntad hecha de órdenes, excusas y temores sin dueño. No quiere conquistar Valdora. Quiere impedir que el reino vuelva a tener una memoria propia.'],
 ['Lo que se le debe al pasado',()=>S.bk.rey||S.reyDone,'Recordar no es siempre valentía ni olvidar siempre cobardía. El problema no fue que Valdora necesitara descanso, sino que una autoridad lo convirtiera en obligación para todos. Cuando olvidemos, tendremos que estar dispuestos a escuchar a quien aún recuerde.']);

// ---- 3. SUEÑOS: segunda parte de cada sueño, con imágenes recurrentes ----
const sueMore={
 d1:['Sueño','Después, golpes. Primero llegan de fuera, luego de dentro. No ves quién llama; solo entiendes que los dos lados tienen razones para golpear.'],
 d2:['Sueño','Detrás de ella, una sala con sillas que alguien está ordenando una por una. Hay demasiados asientos. Al despertar solo recuerdas eso: que sobraban sillas.'],
 d3:['Sueño','Un río en el que alguien intenta pronunciar nombres. Cada uno se deshace antes de terminar. Sabes que son los mismos nombres que los Huecos ya no pueden decir.'],
 d4:['Sueño','Entre los dos jóvenes suena el roce de una cadena. En el sueño todavía no hay cadena. Pero el sonido se adelanta siempre.'],
 d5:['Sueño','Una mano firma el decreto y otra sostiene la vela. Cuando intentas ver cuál es la tuya, la vela se apaga.'],
 d6:['Sueño','En el muro raspas la frase y te detienes antes de la última palabra, como si temieras dejar una instrucción demasiado clara. La escribes de todos modos.']};
SUE.forEach(s=>{const m=sueMore[s[0]];if(m)s[2].push(m)});

// ---- 4. ÚLTIMAS PALABRAS: la función humana de cada jefe, antes de la memoria ----
const lastW={
 sepulturero:['El Sepulturero','(Mira los montículos de tierra.) Nadie me dijo cuándo parar. Mientras las tumbas estuvieran en orden, aún había justicia. Eso creía.'],
 pastora:['La Pastora de Ceniza','(Cuenta en voz baja, una figura tras otra.) Faltaba uno. Siempre faltaba uno. ¿Los cuentas tú, por favor?'],
 cazador:['El Cazador Hueco','Mis presas no huían de mí: seguían las señales que yo marqué para que no se perdieran. Después olvidé para qué las marcaba.'],
 caballero:['El Caballero que No Murió','(Las cadenas tintinean.) Cargué con la culpa para que nadie preguntara por el rey. Funcionó. Ese fue el problema.'],
 guardiana:['La Guardiana del Osario','Ella me pidió que la dejara descansar y yo oí una amenaza. Dime, escudero: ¿cuánto cuesta aprender a dejar de proteger?'],
 heraldo:['El Heraldo Mudo','(Un susurro.) «A petición... a petición...» Lo repetí hasta que perdió sentido. Nadie preguntó de quién.'],
 madre:['La Madre del Fango','(Del barro asoman cartas y juguetes.) Todo lo que me arrojaron me pesa igual. Ya no sé qué era una prueba y qué era un recuerdo.'],
 capataz:['El Capataz de Hierro','(Deja caer el pico.) No sabía si la amenaza era real. Temí que desobedecer convirtiera la mina en otra puerta abierta.'],
 vigia:['El Vigía de Ceniza','(Sostiene un farol apagado.) Tres noches lo mantuve encendido. Cuando ordenaron apagarlo, obedecí. Nunca supe a quién dejé en el camino.'],
 capdorn:['Capitán Dorn','(Baja el estoque.) No quería destruir la ciudad. Quería que sobreviviera. Es distinto, ¿verdad? Eso me dije siempre.']};
Object.keys(lastW).forEach(id=>{const o=CUT[id],w=lastW[id];CUT[id]=()=>{const b=o?o():null;const x=D(w[0],w[1],null,b?()=>b:null);return x}});

// ---- 5. LA SEGUNDA VOZ: manifestaciones graduales al avanzar la historia ----
const SV={
 1:['Una voz sin dueño','Una campana suena en alguna parte. Nadie la tocó. Ninguno de los que quedan recuerda qué anunciaba.'],
 2:['La Segunda Voz','«Déjalo estar. Estabas cansado, ¿no?» Es la voz de alguien que conoces, pero la frase no termina igual que la última vez que la oíste.'],
 3:['La Segunda Voz','Un camino que estaba limpio aparece cubierto de ceniza. Algo no quiere que sigas pisándolo.'],
 4:['La Segunda Voz','«No quiero conquistar nada. Quiero que el reino no vuelva a tener memoria. Duele menos así.» Nadie habla, pero la oyes.']};
const SVO=['La Segunda Voz','Todo está tranquilo. Demasiado. Los caminos parecen más seguros y los rostros, menos familiares. Es el precio de no ser reconocido.'];
{const lr=loadRegion;loadRegion=function(i,fi,at){const r=lr(i,fi,at);try{const n=nBoss();if(n>=1&&rg.id!=='cripta'&&G.mode!=='title'){
  const k=S.oath==='oblivion'&&n>=2?'svo':'sv'+Math.min(n,4);
  if(!NX()[k])setTimeout(()=>{if(G.mode==='play'&&rg===RG[i]&&once(k)){const m=k==='svo'?SVO:SV[Math.min(n,4)];say(D(m[0],m[1]))}},3200)}}catch(e){}return r}}
