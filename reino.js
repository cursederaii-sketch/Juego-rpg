// ===== REINO: temas de Puerto/Valle, lore, PNJ, disposición del mapa general y MAPA ILUSTRADO de Valdorra =====
// Carga DESPUÉS de calidad.js y cronica.js.
TH.puerto=Object.assign({},TH.marisma,{amb:[10,22,36,.46],fog:'120,170,210'});
TH.valle=Object.assign({},TH.bosque,{amb:[44,70,44,.16],fog:'210,255,200'});
SPEC.puerto=SPEC.marisma||SPEC.puertas;SPEC.valle=SPEC.bosque;SHAFT.puerto=SHAFT.marisma||SHAFT.puertas;SHAFT.valle=SHAFT.bosque;

Object.assign(NOTES,{
 jardin1:['Tumba cubierta de flores','Nadie recuerda quién descansa aquí, pero alguien repone las flores cada semana.'],
 jardin2:['Urna en la cripta','Dentro hay un pétalo seco y una nota: «Para cuando volvamos a vernos».'],
 jardin3:['Placa de la fuente','«Mientras el agua corra, el jardín recordará». El agua aún corre.'],
 capital1:['Placa de la estatua','«A quien custodió la puerta». Un martillazo borra justo el nombre.'],
 capital2:['Campana rota','Antes de fundirlas, las campanas de la catedral sonaban una vez por cada nombre perdido. Esta tiene cientos de muescas.'],
 puerto1:['Bitácora del estibador','«Doce barcos, doce listas. Subió solo quien no preguntó adónde iban. Yo pregunté. Me quedé en el muelle.»'],
 puerto2:['Libro de embarque','Un único nombre aparece tachado en todas las listas. Debajo, con otra letra: «Prometió volver por ellos».'],
 valle1:['Cruz del camino','Alguien grabó en la cruz: «Aquí todavía nos acordamos». La talla es reciente.'],
 valle2:['Lápida sin cuerpo','«Aquí no descansa la reina. Descansa su promesa». Bajo la piedra, una espada vieja y sin filo, envuelta en lino.']});

if(typeof KITS!=='undefined'&&KITS.aldeano){KITS.soledad=Object.assign({},KITS.aldeano,{A:['#7a3a5a','#a85a80','#4a2038'],buckle:'#ffd24a'});KITS.andro=Object.assign({},KITS.aldeano,{A:['#2a4a7a','#4a72a8','#1a2e50'],buckle:'#7df9ff'})}
NPC.soledad=()=>{const n=D('Soledad','Cuido este jardín como puedo. Algunas flores no se marchitan porque alguien las recuerda.');
 n.nx=once('soledad')?(S.frag++,toast('+1 fragmento de memoria'),D('Soledad','Llévate una flor para el camino. Guarda un recuerdo dentro.')):D('Soledad','Descansa en la glorieta cuando quieras. Aquí el tiempo corre más despacio.');return n};
NPC.marinero=()=>{const n=D('Tomás, marinero',S.oath==='oblivion'?'No te recuerdo, forastero. Pero llevas el mismo paso de quien se fue en el último barco.':'La noche de la ceniza zarparon doce barcos. Subió solo quien no hacía preguntas. Uno volvió vacío; lo amarré yo mismo.');
 n.nx=S.bk.pastora?D('Tomás, marinero','La Pastora sacó a medio pueblo por estos muelles antes de volver a por el resto. No volvió. Dicen que el rebaño la espera todavía.'):D('Tomás, marinero','Si buscas respuestas, no mires el mar. Mira el libro de embarque del almacén. Dicen que hay una puerta que no se ve.');return n};
NPC.cartografa=()=>{const n=D('Cartógrafa Ilse',S.oath==='oblivion'?'Eres difícil de dibujar: quien olvida no deja sombra. Pero el reino te recuerda en los bordes del mapa.':'Dibujo el reino de memoria, y la memoria me falla en los bordes. Cuando vuelvas de un sitio, cuéntamelo: lo marcaré en tu diario.');
 const hint=!S.seen.marisma?'Al oeste del bosque hay un pantano que los mapas se niegan a dibujar. Dicen que el agua se traga los nombres.':!S.seen.cantera?'Al sur de la Capital hay una mina sellada. Los canteros sacaban cristal para los faroles del reino.':!S.seen.torre?'Sobre las Puertas hay una torre cuyo faro no se vuelve a encender.':'Ya has visto casi todo lo que sé dibujar. Lo que falta no está en mi mapa: está en ti.';
 if(once('ilse')){S.frag++;toast('+1 fragmento de memoria');n.nx=D('Cartógrafa Ilse','Toma este fragmento: lo hallé entre mapas viejos. Es de quien aún recuerda dónde empezó todo. '+hint)}else n.nx=D('Cartógrafa Ilse',hint);return n};
NPC.elda=()=>{const n=D('Elda, granjera',S.oath==='oblivion'?'Llevas el Olvido encima, lo noto. A mí no me engañas: te conozco. Eres el escudero.':'Aquí nadie olvidó nada. La ceniza no cruzó el río, o el río no la dejó.');
 n.nx=D('Elda, granjera','Una noche vino la reina, sin corona, y me pidió prestada una espada vieja. Dijo que era para que alguien no se perdiera. No me la devolvió.');return n};
NPC.bruno=()=>D('Bruno, molinero','El molino sigue girando aunque ya no hay trigo. Mientras el agua mueva las aspas, decía mi padre, el reino se acuerda de sí mismo.',null,D('Bruno, molinero','La capilla del sur no guarda ningún cuerpo, solo una piedra y una promesa. Ve a verla, si quieres entender por qué esta tierra sigue en pie.'));

// ---- Sprites de los PNJ del Puerto y del Valle (antes no tenían kit: el dibujo fallaba y la pantalla quedaba congelada) ----
if(typeof KITS!=='undefined'&&KITS.aldeano){
 KITS.marinero=Object.assign({},KITS.aldeano,{A:['#2a4a6a','#4a7090','#1a3048'],hc:['#1e2e44','#34506e','#121e2e'],buckle:'#ffd24a'});
 KITS.cartografa=Object.assign({},KITS.aldeano,{A:['#7a5a2e','#a8844a','#4a3418'],hc:['#6a4a24','#94703c','#3e2a12'],buckle:'#ffd24a'});
 KITS.elda=Object.assign({},KITS.aldeano,{A:['#8a5a3a','#b07c56','#563620'],hc:['#7a4c2e','#a06c48','#4a2c18']});
 KITS.bruno=Object.assign({},KITS.aldeano,{A:['#8a8a7a','#b4b4a2','#58584c'],hc:['#76766a','#9c9c8c','#4a4a40']});
}

// ---- MISIÓN SECUNDARIA «Hasta que el camino termine» (Jardín Derruido): Soledad y Andro → Juramento de Lealtad ----
OATHS.lealtad=['⚭ Juramento de Lealtad','Un vínculo que no exige ser invencible, sino seguir adelante. Al bajar del 30% de vida, la resistencia se recupera un 15% más rápido unos segundos (una vez por combate). Los objetos curativos restauran un 5% menos.'];
if(typeof KITS!=='undefined'&&KITS.aldeano){KITS.diego=Object.assign({},KITS.aldeano,{A:['#1c1c28','#34344a','#101018'],cape:'#2a2a3a',capeE:'#4a4a62',buckle:'#ffd24a'});KITS.andro=Object.assign({},KITS.aldeano,{A:['#d8d0b8','#f0e8d0','#9a9078'],buckle:'#ffd24a'})}
const LYO={lealtad1:'Cuchara de campaña',lealtad2:'Cuaderno de viaje',lealtad3:'Brújula gastada'};
const lyN=()=>Object.keys(S.lo||{}).length;
{const pi=pickIt;pickIt=function(it,key){if(it.q&&LYO[it.q]){S.tk[key]=1;(S.lo||(S.lo={}))[it.q]=1;toast(lyN()===3?'Tienes los tres objetos. Vuelve con Soledad y Andro.':LYO[it.q]+' · '+lyN()+'/3');sfx(520,.25,'sine',.06,880);spark(it.x,it.y,'#ffd24a',16);save();return}pi(it,key)}}
const lyD=(t,nx,o)=>D('Soledad',t,o||null,nx),lyA=(t,nx,o)=>D('Andro',t,o||null,nx);
const lyHint=()=>!(S.lo||{}).lealtad1?'La cuchara se me cayó cerca del molino del Valle Sereno.':!(S.lo||{}).lealtad2?'El cuaderno se lo llevó el viento hacia los muelles del Puerto.':'La brújula se quedó entre las ruinas del suroeste, aquí en el jardín.';
const lyAccept=()=>{S.ly=2;return lyD('No es que los objetos sean valiosos. Es que cada uno estuvo con nosotros durante una parte del camino. Supongo que quiero conservar algo de los días en los que todavía podíamos reír sin mirar por encima del hombro.',()=>lyA('¡Y porque Soledad se pone insoportable cuando pierde algo! Una vez perdió una cuchara y organizó una búsqueda de tres horas. ¡La cuchara estaba en su bolsillo!',()=>lyD('¡Era una cuchara importante!',()=>lyA('Era una cuchara, amor.',()=>lyA('Son tres: una cuchara de campaña, un cuaderno de viaje y una brújula. '+lyHint())))))};
const lyOffer=()=>lyA('Por cierto... ¿nos ayudarías con algo pequeño? Perdimos tres objetos durante el viaje. Nada mágico: solo nuestros.',null,[['Ayudarles',lyAccept],['Más tarde']]);
const lyFinal=()=>D('','Soledad toma la mano de Andro mientras ambos contemplan los objetos recuperados.',null,()=>lyD('No sé cuánto nos queda de camino. Pero quiero recorrerlo contigo, ¿sabes?',()=>lyA('Pues procura no volver a perder la cuchara.',()=>lyD('Bro, arruinas mi frase romántica.',()=>lyA('JAJA. Te amo, precioso.',()=>lyD('Yo te amo más.',()=>D('','Ambos se vuelven hacia ti y te entregan el Juramento de Lealtad.',null,()=>lyA('No es una promesa de que todo saldrá bien. Nadie puede prometerte eso.',()=>lyD('Es una promesa de que lo que elijas proteger tendrá valor, incluso cuando el camino se vuelva difícil.',()=>{S.ly=3;oath('lealtad');toast('⚭ Juramento de Lealtad');save();return null}))))))))) ;
const lyTalk=who=>{const f=S.ly;
 if(f===1)return lyOffer();
 if(f===2)return lyN()<3?D(who,'Llevas '+lyN()+' de 3. '+lyHint()):lyFinal();
 const L=S.oath==='lealtad';
 return who==='Soledad'?lyD(L?'Llevas el juramento. Cuídalo... y cuídate. Andro dice que exagero, pero tengo razón.':'Cuando te veo cruzar el jardín sé que el camino sigue. Gracias por devolvernos esas cosas.'):lyA(L?'Mira, a ti el anillo te queda mejor que a Soledad la cuchara.':'No te preocupes por nosotros. Tú sigue protegiendo lo que importa; Soledad y yo seguiremos molestándonos. Es nuestra forma de cuidarnos.')};
NPC.diego=()=>!S.ly?(lyStart(),lyD('Ah, hola. ¿Has visto a Andro? Estaba aquí hace un momento..., ¡oh! Ahí está. Perdona, es que me gusta saber que está cerca. Este lugar ya tiene suficientes cosas horribles como para perder de vista a alguien tan importante.',()=>{S.ly=1;spark(P.x+30,P.y,'#ffd24a',12);return lyA('¡Ah, otro aventurero! No te preocupes, Soledad siempre mira a todos como si fueran a atacarme. Ya le expliqué que no necesito que me proteja de una mariposa, pero todavía estamos negociando ese asunto...',()=>lyOffer())})):lyTalk('Soledad');
NPC.andro=()=>lyTalk('Andro');
// efectos del Juramento de Lealtad
{const up=updP;updP=function(dt){const h0=P.hp,hd0=P.hd;up(dt);
 if(S.oath==='lealtad'&&P&&P.s!=='dead'){
  if(P.s==='flask'&&P.hd&&!hd0&&P.hp>h0)P.hp=Math.max(h0,P.hp-Math.max(1,Math.round((P.hp-h0)*.05)));
  const cmb=E.some(e=>e.aw&&e.s!=='dead');
  if(!cmb){P.lyC=(P.lyC||0)+dt;if(P.lyC>4)P.lyU=0}else P.lyC=0;
  if(!P.lyU&&cmb&&P.hp>0&&P.hp<P.mhp*.3){P.lyU=1;P.lyT=4;toast('Lealtad: recuperas el aliento más rápido');spark(P.x,P.y,'#ffd24a',14)}
  if(P.lyT>0){P.lyT-=dt;if(P.st<P.mst&&P.s!=='dodge')P.st=Math.min(P.mst,P.st+3.75*dt)}}}}

// ---- disposición del mapa general (Diario > Mapa > El Reino) con las dos zonas nuevas ----
Object.assign(LAY,{jardin:[4,1150],cripta:[30,34],osario:[310,34],puerto:[4,230],valdora:[254,230],bosque:[4,534],valle:[270,534],fosa:[520,534],puertas:[4,726],trono:[254,726],archivos:[456,726],marisma:[4,938],cantera:[238,938],torre:[456,938]});
LNK.push(['valdora','jardin',1],['valdora','puerto',1],['valdora','valle',1]);
Object.assign(REGINFO,{valdora:['Capital amurallada de 4 puertas, río y 3 puentes','Plaza Mayor con fuente','Catedral de las Campanas','Archivo (llave en el Campanario caído)','Cuartel, Mercado y Fragua','Arena de la Pastora','Accesos a Arrabales, Puerto, Valle, Cantera y Jardín'],
 jardin:['Fuente central y glorieta','2 cofres','Cripta con pocos enemigos','Soledad (jardinera), Soledad y Andro','Misión: Hasta que el camino termine'],puerto:['Muelles sobre el mar','Almacén con muro falso','Cartógrafa Ilse','Acceso desde la Capital'],valle:['Campos y molino','Capilla de la reina','Remanso sin ceniza','Acceso desde la Capital']});

// ---- las regiones cambian de sitio en el mapa: se invalida la niebla antigua de la Capital (otro tamaño) ----
{const lr=loadRegion;loadRegion=function(i,fi,at){if(RG[i].id==='valdora'&&S.vdv!==3){delete S.seen.valdora;S.vdv=3}return lr(i,fi,at)}}


// ---- Andro llega caminando (ya no aparece de golpe): entra desde el sur de la glorieta mientras Soledad habla ----
let lyW={};
const lyStart=()=>{if(lyW.on||(S.ly||0)>=1||!W)return;const n=W.npcs.find(q=>q.id==='andro');if(!n)return;
 lyW={on:1,walk:1,n,fx:n.x,fy:n.y};n.y=n.y+160;n.mv=1;n.wx=0;n.wy=-1};
{const u=update;update=function(dt){u(dt);const w=lyW;if(!w.on||!w.walk)return;const n=w.n,dx=w.fx-n.x,dy=w.fy-n.y,d=Math.hypot(dx,dy);
 if(d<=1.5){n.x=w.fx;n.y=w.fy;n.mv=0;w.walk=0;return}
 const s=Math.min(d,55*dt);n.x+=dx/d*s;n.y+=dy/d*s;n.wx=dx;n.wy=dy;n.mv=1}}
{const lr2=loadRegion;loadRegion=function(i,fi,at){lyW={};return lr2(i,fi,at)}}
