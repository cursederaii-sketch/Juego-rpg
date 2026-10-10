// ===== DATOS DEL JUEGO: añade aquí armas, enemigos, jefes y regiones =====
const OATHS={guardian:['Juramento del Guardián','Bloqueas con la mitad de resistencia. Mientras un jefe esté activo, no puedes usar frascos.'],blood:['Juramento de Sangre','Más daño cuanto menos vida tienes. Curarte anula la bonificación durante 6 s.'],oblivion:['Juramento del Olvido','Ves cada zona de ataque desde que empieza. Infliges un 15% menos de daño. Quien te conocía puede dejar de reconocerte.']};
const ATK={slash:{w:.55,a:.12,r:.6,d:14,rng:26,sd:22},lunge:{w:.4,a:.22,r:.55,d:12,rng:20,sd:46,mv:150},smash:{w:.9,a:.2,r:1,d:26,rng:34,sd:26},
 bsl:{w:.8,a:.15,r:.8,d:22,rng:50,sd:40},bov:{w:1,a:.15,r:.9,d:30,rng:38,sd:32},bstab:{w:.5,a:.15,r:.5,d:18,rng:60,sd:55,mv:120},
 pounce:{w:.45,a:.28,r:.5,d:20,rng:30,sd:90,mv:260},blink:{w:.55,a:.15,r:.6,d:24,rng:40,sd:200,tp:1},
 arrow:{w:.5,a:.1,r:.6,d:12,proj:150,sd:140},cinder:{w:.7,a:.1,r:.8,d:16,proj:90,sd:130}};
const TY={soldier:{hp:40,sp:26,at:['slash'],w:12,h:22,c:'#6d7a8c',tr:'#ffb347',so:30,wl:14},
 hollow:{hp:26,sp:44,at:['lunge'],w:10,h:19,c:'#4a3f66',tr:'#ff4d6d',so:20,wl:12},
 archer:{hp:24,sp:30,at:['arrow'],w:10,h:20,c:'#355e4a',tr:'#ffe66d',so:25,wl:8,kite:1},
 warden:{hp:46,sp:26,at:['slash'],w:12,h:22,c:'#7a6a40',tr:'#ffe66d',so:40,wl:14,pat:1},
 brute:{hp:95,sp:20,at:['smash'],w:18,h:26,c:'#6a3a3a',tr:'#ff9a3c',so:70,wl:16,arm:1}};
// jefes: 3 fases (a=ataques, s=velocidad, hold=retraso extra, rocks=derrumbe, adds=invocados)
const BS={
 sepulturero:{n:'El Sepulturero',hp:160,w:16,h:30,c:'#5a5240',tr:'#99bbff',sp:34,so:250,fr:1,dm:.85,wl:24,ph:[{a:['bov','bsl'],s:1},{a:['bov','bsl'],s:1.2,msg:'Alza su pala'},{a:['bov','bsl','bstab'],s:1.3,rocks:1,msg:'Cava su propia tumba'}]},
 pastora:{n:'La Pastora de Ceniza',hp:210,w:14,h:32,c:'#6b4a4a',tr:'#ff9a3c',sp:30,so:400,fr:1,dm:1,wl:22,ph:[{a:['cinder','bsl'],s:1},{a:['cinder','cinder','bsl'],s:1.3,adds:2,msg:'Invoca a su rebaño'},{a:['cinder','blink','bsl'],s:1.4,hold:.3,rocks:1,msg:'Llueve ceniza'}]},
 cazador:{n:'El Cazador Hueco',hp:250,w:14,h:28,c:'#244a3a',tr:'#ffe66d',sp:42,so:550,fr:2,dm:1.05,wl:20,ph:[{a:['pounce','bsl'],s:1},{a:['pounce','arrow','bstab'],s:1.3,msg:'Cambia de presa'},{a:['pounce','arrow','blink'],s:1.5,hold:.4,msg:'Ya no distingue presa de cazador'}]},
 caballero:{n:'El Caballero que No Murió',hp:320,w:18,h:34,c:'#3a2d55',tr:'#ff4d6d',sp:32,so:800,fr:2,dm:1.1,wl:28,ch:1,ph:[{a:['bsl','bov'],s:1},{a:['bsl','bov','bstab'],s:1.5,hold:.4,msg:'Rompe sus cadenas'},{a:['bsl','bov','bstab'],s:1.5,hold:.4,rocks:1,msg:'La arena se resquebraja'}]},
 rey:{n:'El Rey sin Nombre',hp:400,w:18,h:36,c:'#241238',tr:'#ffe66d',sp:36,so:2000,fr:3,dm:1.2,wl:30,ph:[{a:['bsl','bov','cinder','bstab'],s:1.1},{a:['bsl','blink','bstab','cinder'],s:1.4,hold:.3,msg:'Su corona se parte'},{a:['blink','bov','bstab','cinder'],s:1.6,hold:.4,rocks:1,adds:2,msg:'El reino lo olvida'}]}};
BS.guardiana={n:'La Guardiana del Osario',mini:1,hp:190,w:14,h:30,c:'#6a6a58',tr:'#99ffcc',sp:40,so:700,fr:2,dm:1,wl:20,drop:{ab:'leap',tr:'osario'},ph:[{a:['bsl','pounce'],s:1},{a:['bsl','bstab','pounce'],s:1.25,adds:2,msg:'Los huesos se levantan'},{a:['bsl','bov','pounce'],s:1.4,hold:.3,rocks:1,msg:'Ya no recuerda a quién protegía'}]};
BS.heraldo={n:'El Heraldo Mudo',mini:1,hp:240,w:14,h:32,c:'#8a6a2a',tr:'#ff9a3c',sp:30,so:900,fr:3,dm:1.05,wl:22,drop:{ab:'dash',rel:'alma',tr:'fosa'},ph:[{a:['cinder','arrow','bsl'],s:1},{a:['cinder','cinder','blink','bsl'],s:1.25,adds:2,msg:'Llama a los suyos'},{a:['blink','cinder','bov','arrow'],s:1.4,hold:.3,rocks:1,msg:'Grita sin voz'}]};
BS.capdorn={n:'Capitán Dorn',mini:1,hp:280,w:14,h:30,c:'#6a5a3a',tr:'#ffb347',sp:36,so:900,fr:3,dm:1.1,wl:22,drop:{w:'estoque'},ph:[{a:['bsl','bstab'],s:1},{a:['bsl','bov','bstab'],s:1.3,adds:2,addT:'soldier',msg:'Llama a sus hombres'},{a:['bov','bstab','bsl'],s:1.5,hold:.3,msg:'Ya no queda honor'}]};
const WP={
 corta:{n:'Espada corta',d:'Rápida y barata en resistencia.',lore:['Arma de los escuderos de Valdora. Ligera, pensada para quien debía correr junto al caballero y no estorbar.','En el pomo hay una marca: tres rayas, una por cada juramento que su dueño rompió.','Alguien grabó bajo la guarda: «Para que vuelvas». No dice a quién.'],wl:11,l:{d:10,c:9,r:24,t:.3,a:[.08,.16]},h:{d:22,c:22,r:28,t:.65,a:[.3,.4]}},
 larga:{n:'Espada larga',d:'Equilibrada en todo.',lore:['Espada de la guardia de la cripta. Nadie sabe quién la dejó junto a la última tumba.','Su filo está gastado por un solo lado: la usó alguien que siempre se defendía.','El acero recuerda un nombre, pero se niega a decirlo en voz alta.'],wl:15,l:{d:13,c:12,r:28,t:.38,a:[.1,.2]},h:{d:31,c:28,r:34,t:.85,a:[.38,.5]}},
 lanza:{n:'Lanza de Valdora',d:'Gran alcance, golpes rápidos.',lore:['Las lanzas de Valdora defendían las murallas. Esta quedó clavada en un portón, la noche de la ceniza.','Su asta tiene muescas: una por cada persona que sacó por la puerta norte antes de que se cerrara.','En el cuero del agarre se lee «Mirela». Ella nunca la reclamó.'],wl:26,l:{d:11,c:11,r:44,t:.42,a:[.12,.22]},h:{d:26,c:25,r:52,t:.8,a:[.34,.46]}},
 mandoble:{n:'Mandoble del Vacío',d:'Lento y devastador.',lore:['Forjado con el hierro de las campanas que el rey mandó fundir para callar la alarma.','Pesa más de lo que debería: carga con todo lo que el reino prefirió no decir.','Cuando lo alzas del todo, el silencio que lo rodea parece un nombre pronunciado al revés.'],wl:20,l:{d:19,c:17,r:34,t:.5,a:[.16,.28]},h:{d:44,c:36,r:42,t:1.05,a:[.5,.64]}},
 caballero:{n:'Espada del Caballero',d:'Reliquia con memoria propia. Cada golpe te devuelve un poco de aliento.',fx:'vigor',lore:['La espada de Aldric, el Caballero que No Murió. Aún vibra cuando oye pasos en la puerta.','Las cadenas que la ataban dejaron una huella en la hoja: un nudo de tres vueltas.','Quien la empuña no recuerda mejor, pero sí extraña mejor. Es casi lo mismo.'],wl:24,l:{d:17,c:13,r:36,t:.4,a:[.1,.22]},h:{d:40,c:30,r:46,t:.85,a:[.35,.5]}}};
WP.hoz={n:'Hoz del Osario',d:'Tus golpes pesados barren en círculo y alcanzan a todos a tu alrededor.',fx:'sweep',wl:22,l:{d:12,c:11,r:32,t:.42,a:[.1,.22]},h:{d:30,c:30,r:40,t:.9,a:[.35,.5]},lore:['La Guardiana la usaba para segar los huesos que se alzaban contra su reina.','La hoja es de hueso pulido. Cada muesca es un nombre que alguien pagó para que no se olvidara.','Dicen que, al segar en círculo, la hoz dibuja el contorno de una corona.']};
WP.estoque={n:'Estoque de Dorn',d:'Embistes al atacar. Las paradas se castigan con el triple de daño.',fx:'lunge',wl:17,l:{d:11,c:9,r:30,t:.3,a:[.08,.16]},h:{d:24,c:20,r:36,t:.6,a:[.25,.36]},lore:['El estoque del capitán. Fino, rápido, pensado para ganar un duelo antes de que empiece.','En la empuñadura hay un escudo borrado a lima. Dorn juró que lo hizo por vergüenza, no por rabia.','Quien lo empuñe sabrá que el honor de Dorn nunca estuvo en la espada, sino en lo que dejó de preguntar.']};
// reliquias: se equipan hasta 2 y cambian cómo juegas
const RELS={
 paso:['Anillo del Paso Fantasma','Tu esquiva dura más en el aire y gasta menos resistencia.'],
 sed:['Colmillo Sediento','Al derrotar a un enemigo recuperas 5 de vida.'],
 espejo:['Escudo Espejo','Una parada perfecta te cura 6 y te devuelve toda la resistencia.'],
 furia:['Sello de la Furia','Cada quinto golpe seguido, sin que te toquen, hace un 60% más de daño.'],
 sombra:['Manto de Sombra','Los enemigos te notan desde la mitad de distancia. Los golpes de sorpresa hacen más daño.'],
 alma:['Cuenco de Almas','Obtienes un 35% más de almas de cada enemigo.']};
const RELSRC={paso:'Oculta en la cripta',sed:'Donde la sangre abre caminos',espejo:'Donde el escudo abre caminos',furia:'Recompensa de una cazadora',sombra:'Entre los archivos de Valdora',alma:'Cae del Heraldo Mudo'};
// habilidades de exploración
const ABIL={
 leap:['Capa de Ceniza','Al esquivar cruzas las grietas del suelo.'],
 dash:['Botas del Alba','Tu esquiva recorre un 60% más. Cruza grietas anchas.'],
 see:['Lente de Luna','Ves muros falsos, tesoros ocultos y a quienes ya no están.']};
