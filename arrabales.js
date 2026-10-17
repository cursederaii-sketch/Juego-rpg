// ===== ARRABALES DE VALDORA: calle exterior con barricadas, antes de las puertas de la ciudad =====
// Carga DESPUÉS de camposanto.js. La puerta principal está cerrada; para abrirla hacen falta TRES cosas:
//   LLAVE      -> en el puesto de guardia del norte (peleando)
//   PERMISO    -> el escriba lo firma si le mostrás el pase de la mina (Camposanto) o le traés su registro (ayudando)
//   TESTIMONIO -> Tilda, atrapada en una casa al suroeste: hay que escoltarla hasta la puerta (rescate corto)
// Progreso: S.lv['arrabales:llave' | 'arrabales:permiso' | 'arrabales:testimonio'], S.rv['arrabales:registro'].
(function(){
const REQ=['llave','permiso','testimonio'];
const nReq=()=>REQ.filter(k=>S.lv['arrabales:'+k]).length;
const setReq=(id,msg)=>{S.lv['arrabales:'+id]=1;if(W&&rg&&rg.id==='arrabales')W.applyState();const n=nReq();toast(n>=3?'La puerta de Valdora cede':msg+' ('+n+'/3)');sfx(520,.3,'sine',.06,880);G.shake=n>=3?3:1.5;save()};
const GX=54*16+8,GY=22*16+8; // punto seguro de la escolta (frente a la puerta)
let follow=false;

Object.assign(NOTES,{
 arrabales0:['Cartel de la Guardia','«Puerta Principal cerrada por orden. Se admite: portador de llave, permiso sellado y un vecino que dé fe de él. Sin excepciones.» Alguien agregó con carbón: «salvo los que mandan».'],
 arrabales1:['Barricada con muebles','Camas, puertas y un reloj de pared. Gente que quiso cerrar la calle con lo que tenía en casa.'],
 arrabales2:['Pared con nombres','Cientos de nombres escritos con tiza, la mayoría tachados. Al final, uno sin tachar: «Tilda. Sigo en la casa de la esquina.»'],
 arrabales3:['Carro de la guardia','Una orden sin firmar: «Que nadie del camposanto llegue a las puertas. Si llegan, que no los vean entrar.»']
});
Object.assign(REGINFO,{
 arrabales:['Puerta principal con tres requisitos','Llave (puesto de guardia) · permiso (escriba) · testimonio (Tilda)','Se pueden resolver peleando, ayudando o hablando','Hoguera a la entrada · salida a la Capital de Valdora']
});
if(typeof KITS!=='undefined'&&KITS.aldeano){
 KITS.tilda=Object.assign({},KITS.aldeano,{A:['#5a3a4a','#84586a','#321e2a'],buckle:'#ffb0c8'});
 KITS.escriba=Object.assign({},KITS.aldeano,{A:['#3a4a5a','#58708a','#1e2a36'],hc:['#c8c8c0','#e4e4dc','#8a8a84'],buckle:'#e6d9a0'})}

RG.push({id:'arrabales',n:'Arrabales de Valdora',act:'Acto I — El hombre sin nombre',th:'valdora',cols:64,rows:44,m:1.25,dm:1.15,out:1,fl:[''],build(W){
 W.th=Object.assign({},W.th,{amb:[40,34,34,.4],fog:'190,150,130',pt:'ash'});
 W.fillG('g');W.ring('wall',2);
 // calle principal y ramales
 W.path([[4,22],[56,22]],3,'p');
 W.path([[28,22],[28,12]],3,'p');          // al puesto de guardia (norte)
 W.path([[40,22],[40,32]],3,'p');          // a la casa del registro (sur)
 W.path([[15,22],[15,31]],3,'p');          // a la casa de Tilda (suroeste)
 W.portal('back',4,22,{to:'camposanto',at:'valdora',k:'Volver al Camposanto',sx:22,sy:0});
 W.fire(7,26);
 W.o('crate',9,19,1,1);W.note(9,19,'arrabales0');
 // ---- muralla y puerta principal ----
 W.o('wall',57,2,3,19);W.o('wall',57,24,3,18);
 W.sgate(57,21,3,3,REQ,{msg:'La puerta de Valdora cede'});
 W.room(60,19,2,7,'p');W.portal('valdora',61,22,{to:'valdora',k:'Entrar a Valdora',sx:-22,sy:0});
 W.torch(57,20);W.torch(59,20);
 // ---- barricadas de la calle (con huecos) ----
 W.o('barr',21,20,1,2,1);W.note(21,20,'arrabales1');W.o('barr',21,24,1,2,1);
 W.o('barr',34,19,1,2,1);W.o('barr',34,24,1,3,1);
 W.o('barr',47,20,1,2,1);W.o('barr',47,24,1,2,1);
 // ---- LLAVE: puesto de guardia, norte ----
 W.room(22,6,14,6,'g');
 W.o('crate',23,7,1,1);W.o('barrel',34,7,1,1);W.o('barrel',23,10,1,1);W.o('cross',35,10,1,1);W.note(35,10,'arrabales3');
 W.item(29,7,{q:'llave',k:'Tomar la llave'});
 W.en('soldier',26,9);W.en('soldier',32,9);W.en('archer',24,7);W.en('brute',29,10);W.en('hollow',28,14);
 W.amb('ab1',24,8,10,4,[['hollow',24,10],['soldier',33,8]],{souls:250});
 // ---- PERMISO: el escriba junto a la calle; su registro está en una casa tomada, al sur ----
 W.npc('escriba',19,19);
 W.o('crate',18,19,1,1);W.o('barrel',20,18,1,1);
 W.room(34,29,14,8,'g');
 W.house(35,27,5,3,2);
 W.item(44,33,{q:'registro',k:'Recoger el registro'});
 W.en('hollow',38,31);W.en('hollow',42,34);W.en('soldier',45,31);W.en('archer',36,35);
 // ---- TESTIMONIO: Tilda, atrapada en una casa del suroeste ----
 {const free=S.lv['arrabales:testimonio'];W.npc('tilda',free?54:15,free?22:34)}
 W.room(9,30,13,8,'g');
 W.o('barr',9,30,13,1,1);W.clr(14,30,2,1);W.o('cross',10,36,1,1);W.note(10,36,'arrabales2');
 W.en('hollow',12,33);W.en('hollow',19,32);W.en('hollow',11,36);W.en('soldier',18,36);
 // ---- botín y soldados sueltos ----
 W.item(30,26,{sou:250});W.item(50,28,{n:1});W.item(26,16,{sou:200});W.item(8,33,{n:2});
 W.en('soldier',24,23);W.en('hollow',31,20);W.en('archer',37,20);W.en('hollow',44,24);W.en('soldier',50,20);W.en('warden',44,22,{pat:[[43,22],[53,22]]});
 W.amb('ab2',44,21,8,3,[['hollow',45,20],['soldier',52,24],['archer',50,21]],{souls:200});
 W.sc('rubble',20,3,3,54,40,{avoid:'pb',seed:81,gap:1});W.sc('dtree',8,3,3,54,40,{avoid:'pb',seed:82,gap:3});
 W.sc('crate',5,3,3,54,40,{avoid:'pb',seed:83,gap:2});W.sc('rock',8,3,3,54,40,{avoid:'pb',seed:84,gap:2});
}});

// ---- objetos de misión ----
{const p0=pickIt;pickIt=function(it,key){
 if(it.q==='llave'){S.tk[key]=1;spark(it.x,it.y,'#ffe66d',14);setReq('llave','Llave del puesto de guardia');return}
 if(it.q==='registro'){S.tk[key]=1;S.rv['arrabales:registro']=1;sfx(520,.25,'sine',.06,880);spark(it.x,it.y,'#ffe66d',14);toast('Registro recuperado · llévaselo al escriba');save();return}
 return p0(it,key)}}

// ---- el escriba: firma el permiso ----
NPC.escriba=()=>{
 if(S.lv['arrabales:permiso'])return D('Escriba','Tu permiso está sellado. Que no te vean usándolo en voz alta.');
 const o=[];
 if(S.rv['camposanto:pista'])o.push(['Mostrar el pase de la mina',()=>{setReq('permiso','Permiso sellado');return D('Escriba','(Examina el sello con una lupa.) El de las Puertas de la Capital. Alguien quiso que llegaras hasta aquí. Firmo, y no pregunto.')}]);
 if(S.rv['arrabales:registro'])o.push(['Entregar el registro',()=>{setReq('permiso','Permiso sellado');return D('Escriba','Mi registro... creí que lo habían quemado con la casa. Toma, firmado y sellado. Es lo menos que puedo hacer.')}]);
 o.push(['Solo pasaba',null]);
 return D('Escriba','Sin permiso sellado no abren la puerta. Yo podría firmarlo, pero mi registro quedó en una casa tomada, al sur, y sin él mi firma no vale. '+(S.rv['camposanto:pista']?'Aunque ese pase que traes... déjame verlo.':'Tráemelo y firmo.'),o)};

// ---- Tilda: el testimonio (escolta corta hasta la puerta) ----
NPC.tilda=()=>{
 if(S.lv['arrabales:testimonio'])return D('Tilda','Dire a la guardia que te vi pelear por esta calle. No me creerán, pero haré ruido hasta que me escuchen.');
 if(follow)return D('Tilda','Voy detrás de ti. Si me pierdes, espero donde estoy.');
 return D('Tilda, vecina de los Arrabales','Llevo tres noches escondida aquí. Conozco a todos los que quedan en esta calle. Si me llevas hasta la puerta, daré fe de ti ante la guardia. No les gusta que lo diga, pero me creen.',
  [['Acompañarme a la puerta',()=>{follow=true;toast('Tilda te sigue · llévala hasta la puerta de Valdora');return D('Tilda','Gracias. Iré pisando tus huellas.')}],['Todavía no',null]])};
{const u=update;update=function(dt){u(dt);
 if(!S||!W||!P||rg.id!=='arrabales'){follow=false;return}
 if(!follow)return;if(P.s==='dead'){follow=false;return}if(G.mode!=='play')return;
 const n=W.npcs.find(q=>q.id==='tilda');if(!n)return;
 const dx=P.x-n.x,dy=P.y-n.y,d=Math.hypot(dx,dy);
 if(d>26){const sp=(d>90?95:68)*dt,vx=dx/d*sp,vy=dy/d*sp;if(!W.hit(n.x+vx,n.y,5,5))n.x+=vx;if(!W.hit(n.x,n.y+vy,5,5))n.y+=vy;n.tx=n.x/16|0;n.ty=n.y/16|0}
 if(Math.hypot(n.x-GX,n.y-GY)<56&&Math.hypot(P.x-GX,P.y-GY)<80){follow=false;S.souls+=200;setReq('testimonio','Tilda dará fe de ti');toast('+200 almas')}
}}

// ---- el Camposanto ahora sale a los Arrabales (y estos a Valdora) ----
{const C=RG.find(r=>r.id==='camposanto');if(C){const b=C.build;C.build=function(W){b.call(this,W);const q=W.portals.find(p=>p.id==='valdora');if(q){q.to='arrabales';q.at='back';q.k='Camino a los Arrabales'}}}}

// ---- mapa del reino ----
LAY.arrabales=[90,OY+160];
{const i=LNK.findIndex(l=>l[0]==='camposanto'&&l[1]==='valdora');if(i>=0)LNK.splice(i,1,['camposanto','arrabales'],['arrabales','valdora']);else LNK.push(['camposanto','arrabales'],['arrabales','valdora'])}
})();
