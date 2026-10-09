// ===== DATOS DEL JUEGO: añade aquí armas, enemigos, jefes y regiones =====
const OATHS={guardian:['Juramento del Guardián','Bloqueas con la mitad de resistencia. Mientras un jefe esté activo, no puedes usar frascos.'],blood:['Juramento de Sangre','Más daño cuanto menos vida tienes. Curarte anula la bonificación durante 6 s.'],oblivion:['Juramento del Olvido','Ves cada zona de ataque desde que empieza. Infliges un 15% menos de daño. Quien te conocía puede dejar de reconocerte.']};
const ATK={slash:{w:.55,a:.12,r:.6,d:14,rng:26,sd:22},lunge:{w:.4,a:.22,r:.55,d:12,rng:20,sd:46,mv:150},smash:{w:.9,a:.2,r:1,d:26,rng:34,sd:26},
 bsl:{w:.8,a:.15,r:.8,d:22,rng:50,sd:40},bov:{w:1,a:.15,r:.9,d:30,rng:38,sd:32},bstab:{w:.5,a:.15,r:.5,d:18,rng:60,sd:55,mv:120},
 pounce:{w:.45,a:.28,r:.5,d:20,rng:30,sd:90,mv:260},blink:{w:.55,a:.15,r:.6,d:24,rng:40,sd:200,tp:1},
 arrow:{w:.5,a:.1,r:.6,d:12,proj:150,sd:140},cinder:{w:.7,a:.1,r:.8,d:16,proj:90,sd:130}};
const TY={soldier:{hp:40,sp:26,at:['slash'],w:12,h:22,c:'#6d7a8c',tr:'#ffb347',so:30,wl:14},
 hollow:{hp:26,sp:44,at:['lunge'],w:10,h:19,c:'#4a3f66',tr:'#ff4d6d',so:20,wl:12},
 archer:{hp:24,sp:30,at:['arrow'],w:10,h:20,c:'#355e4a',tr:'#ffe66d',so:25,wl:8,kite:1},
 brute:{hp:95,sp:20,at:['smash'],w:18,h:26,c:'#6a3a3a',tr:'#ff9a3c',so:70,wl:16,arm:1}};
// jefes: 3 fases (a=ataques, s=velocidad, hold=retraso extra, rocks=derrumbe, adds=invocados)
const BS={
 sepulturero:{n:'El Sepulturero',hp:160,w:16,h:30,c:'#5a5240',tr:'#99bbff',sp:34,so:250,fr:1,dm:.85,wl:24,ph:[{a:['bov','bsl'],s:1},{a:['bov','bsl'],s:1.2,msg:'Alza su pala'},{a:['bov','bsl','bstab'],s:1.3,rocks:1,msg:'Cava su propia tumba'}]},
 pastora:{n:'La Pastora de Ceniza',hp:210,w:14,h:32,c:'#6b4a4a',tr:'#ff9a3c',sp:30,so:400,fr:1,dm:1,wl:22,ph:[{a:['cinder','bsl'],s:1},{a:['cinder','cinder','bsl'],s:1.3,adds:2,msg:'Invoca a su rebaño'},{a:['cinder','blink','bsl'],s:1.4,hold:.3,rocks:1,msg:'Llueve ceniza'}]},
 cazador:{n:'El Cazador Hueco',hp:250,w:14,h:28,c:'#244a3a',tr:'#ffe66d',sp:42,so:550,fr:2,dm:1.05,wl:20,ph:[{a:['pounce','bsl'],s:1},{a:['pounce','arrow','bstab'],s:1.3,msg:'Cambia de presa'},{a:['pounce','arrow','blink'],s:1.5,hold:.4,msg:'Ya no distingue presa de cazador'}]},
 caballero:{n:'El Caballero que No Murió',hp:320,w:18,h:34,c:'#3a2d55',tr:'#ff4d6d',sp:32,so:800,fr:2,dm:1.1,wl:28,ch:1,ph:[{a:['bsl','bov'],s:1},{a:['bsl','bov','bstab'],s:1.5,hold:.4,msg:'Rompe sus cadenas'},{a:['bsl','bov','bstab'],s:1.5,hold:.4,rocks:1,msg:'La arena se resquebraja'}]},
 rey:{n:'El Rey sin Nombre',hp:400,w:18,h:36,c:'#241238',tr:'#ffe66d',sp:36,so:2000,fr:3,dm:1.2,wl:30,ph:[{a:['bsl','bov','cinder','bstab'],s:1.1},{a:['bsl','blink','bstab','cinder'],s:1.4,hold:.3,msg:'Su corona se parte'},{a:['blink','bov','bstab','cinder'],s:1.6,hold:.4,rocks:1,adds:2,msg:'El reino lo olvida'}]}};
const WP={
 corta:{n:'Espada corta',d:'Rápida y barata en resistencia.',wl:11,l:{d:10,c:9,r:24,t:.3,a:[.08,.16]},h:{d:22,c:22,r:28,t:.65,a:[.3,.4]}},
 larga:{n:'Espada larga',d:'Equilibrada en todo.',wl:15,l:{d:13,c:12,r:28,t:.38,a:[.1,.2]},h:{d:31,c:28,r:34,t:.85,a:[.38,.5]}},
 lanza:{n:'Lanza de Valdora',d:'Gran alcance, golpes rápidos.',wl:26,l:{d:11,c:11,r:44,t:.42,a:[.12,.22]},h:{d:26,c:25,r:52,t:.8,a:[.34,.46]}},
 mandoble:{n:'Mandoble del Vacío',d:'Lento y devastador.',wl:20,l:{d:19,c:17,r:34,t:.5,a:[.16,.28]},h:{d:44,c:36,r:42,t:1.05,a:[.5,.64]}},
 caballero:{n:'Espada del Caballero',d:'Reliquia con memoria propia.',wl:24,l:{d:17,c:13,r:36,t:.4,a:[.1,.22]},h:{d:40,c:30,r:46,t:.85,a:[.35,.5]}}};
// regiones: w=ancho, en=enemigos, npc, it=objetos (w=arma, f=fragmento), boss; m/dm=escala de vida/daño
const RG=[
 {id:'cripta',n:'Cripta Olvidada',act:'Acto I — El hombre sin nombre',w:1100,m:1,dm:1,sky:['#07050f','#1a1330'],co:'#0f0a1c',fl:'#150f26',dc:'arc',boss:'sepulturero',
  en:[['soldier',340],['hollow',480],['hollow',640],['soldier',860]],npc:[{id:'sombra',x:250}],it:[{x:560,w:'larga'},{x:1000,f:1}]},
 {id:'valdora',n:'Valdora en ruinas',act:'Acto I — El hombre sin nombre',w:1500,m:1.3,dm:1.15,sky:['#150a0a','#4a2418'],co:'#1c0f0f',fl:'#241512',dc:'house',boss:'pastora',
  en:[['soldier',320],['archer',480],['hollow',620],['hollow',700],['brute',900],['archer',1000],['soldier',1100]],npc:[{id:'mirela',x:160},{id:'dorn',x:560},{id:'brenna',x:1000}],it:[{x:880,w:'lanza'},{x:1250,f:1}]},
 {id:'bosque',n:'Bosque Marchito',act:'Acto II — La verdad del reino',w:1500,m:1.7,dm:1.3,sky:['#050f0c','#12301f'],co:'#081a12',fl:'#0f2418',dc:'tree',boss:'cazador',
  en:[['hollow',300],['hollow',380],['archer',520],['brute',700],['hollow',860],['archer',980],['brute',1100]],npc:[{id:'voz',x:420}],it:[{x:760,w:'mandoble'},{x:1200,f:1}]},
 {id:'puertas',n:'Puertas de la Capital',act:'Acto II — La verdad del reino',w:1400,m:2.1,dm:1.45,sky:['#0a0f1c','#2a3a5c'],co:'#0f1626',fl:'#18223a',dc:'arc',boss:'caballero',
  en:[['soldier',300],['soldier',420],['brute',560],['archer',700],['brute',900],['soldier',1000]],npc:[],it:[{x:600,f:1}]},
 {id:'trono',n:'Salón del Trono',act:'Acto III — El último juramento',w:1200,m:2.6,dm:1.6,sky:['#0f0716','#3a1445'],co:'#1a0c26',fl:'#24123a',dc:'arc',boss:'rey',
  en:[['brute',300],['soldier',420],['soldier',520],['archer',640],['brute',760]],npc:[],it:[{x:450,f:1}]}];
