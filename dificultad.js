// ===== DIFICULTAD SOULSLIKE · PARÁMETROS DE BALANCE =====
// Capa pequeña y opcional. Se carga justo después de data.js (antes que game.js) y SOLO contiene números y datos:
//   · DIF  → todos los parámetros ajustables (el motor los lee en game.js y en combate_souls.js).
//   · Añade ataques nuevos a ATK y completa las listas de ataques de TY / BS (data.js) sin borrar nada.
// Para volver al juego original basta con poner DIF.on=0 (la lógica nueva de combate_souls.js no se instala)
// y los valores de DIF que lee game.js equivalen a los antiguos si se ponen como abajo ("original").
//
// ESCALADO REGIONAL (auditado): cada región ya multiplica vida (rg.m: 1 → 2.6) y daño (rg.dm: 1 → 1.6) de sus enemigos en mk().
// NO se añade un segundo multiplicador de vida. Solo hay una pequeña "presión" extra sobre el daño de enemigos normales
// que crece con rg.m (0 en la primera zona, DIF.press en las más duras), aplicada una única vez en mk().
const DIF={
 on:1,
 // ---- jugador: resistencia, esquiva, curación ----
 regen:22,            // resistencia/s en reposo (original 25)
 regenDelay:.8,       // pausa tras gastar resistencia antes de regenerar (original .7)
 regenBlock:9,        // resistencia/s con el escudo alzado (sin cambios)
 dodgeChainCost:5,    // coste extra por esquivar otra vez dentro de la ventana (se acumula)
 dodgeChainWin:1,     // s desde el inicio de la esquiva anterior para contar como cadena
 dodgeChainMax:3,     // máximo de escalones (coste máx. extra = 3×5 = 15)
 heavyWhiff:1.5,      // multiplicador de duración del golpe pesado si FALLA (original 1.35)
 flaskHeal:.55,       // s hasta que la poción cura (original .5)
 flaskEnd:.95,        // s totales de la animación de beber (original .9)
 flaskPunish:1.25,    // daño recibido si te golpean mientras bebes (antes de que cure)
 // ---- enemigos normales ----
 press:.06,           // presión global extra al daño de enemigos normales (5–10 % de la especificación)
 pressRamp:1.2,       // la presión llega al máximo cuando rg.m = 1 + pressRamp (m=2.2)
 region:{},           // ajuste fino por id de región, p. ej. {archivos:{press:0}} (opcional)
 react:[.22,.42],     // retardo humano (s) antes de que un enemigo castigue un error del jugador
 reactBoss:[.32,.5],  // ídem para jefes (más lentos en reaccionar)
 punishR:80,          // distancia máxima para castigar un error (enemigos)
 punishRBoss:100,     // ídem jefes
 maxAtk:2,            // enemigos normales con ataque cuerpo a cuerpo simultáneo (el resto espera)
 maxShoot:2,          // arqueros disparando a la vez
 failRec:.35,         // recuperación extra = r × esto cuando un ataque normal FALLA
 failRecBy:{brute:.5,hollow:.45},   // por tipo (brutos y huecos quedan más abiertos al fallar)
 failRecBoss:.22,     // jefes: recuperación extra al fallar
 spawnSafe:44,        // un enemigo que nace despierto no puede aparecer a menos de esto del jugador
 spawnGrace:.9,       // s sin atacar tras nacer despierto (oleadas, emboscadas, invocados)
 alertR:150,          // radio en que un vigilante alerta a sus compañeros (original 110)
 pat:{                // secuencias de ataques (rápido ↔ lento) en vez de elección al azar
  soldier:['jab','chop','slash','jab','slash'],
  warden:['slash','jab','slash','chop'],
  brute:['smash','smash','crush']},
 archer:{still:.9,fast:.35,strafe:.5},  // jugador quieto ≥ still s → dispara en ≤ fast s; strafe = velocidad lateral relativa
 // ---- élites (por parámetros, mismas rutinas que los normales) ----
 elite:{chance:.12,minM:1.5,types:['soldier','warden','brute'],hp:1.35,dm:1.1,so:2.2,wind:.9,
  nx:{soldier:['jab'],warden:['jab'],brute:['smash']},c:.5,p:.55},
 // ---- combos (jefes y élites): tras un ataque, posible seguimiento rápido y luego pausa de recuperación ----
 comboWind:.38,       // aviso mínimo (s) de cada golpe de seguimiento
 comboK:.8,           // aviso del seguimiento = w del ataque × comboK
 // c=probabilidad, n=golpes de seguimiento máx., nx=ataques posibles, p=pausa extra (s) al terminar el combo
 boss:{
  sepulturero:[{c:0},{c:.35,n:1,nx:['bsl'],p:.5},{c:.5,n:1,nx:['bsl','bov'],p:.55}],
  pastora:[{c:.25,n:1,nx:['cinder'],p:.5},{c:.4,n:2,nx:['cinder'],p:.55},{c:.45,n:1,nx:['cinder','bsl'],p:.6}],
  cazador:[{c:.3,n:1,nx:['arrow'],p:.5},{c:.45,n:1,nx:['pounce','arrow'],p:.55},{c:.5,n:2,nx:['pounce','bstab'],p:.65}],
  caballero:[{c:.3,n:1,nx:['bov'],p:.5},{c:.45,n:1,nx:['bsl','bstab'],p:.55},{c:.5,n:2,nx:['bsl','bov'],p:.65}],
  rey:[{c:.3,n:1,nx:['bsl'],p:.5},{c:.45,n:1,nx:['bstab','bov'],p:.6},{c:.5,n:2,nx:['bsl','bstab'],p:.7}],
  guardiana:[{c:.25,n:1,nx:['bsl'],p:.5},{c:.4,n:1,nx:['bstab','pounce'],p:.55},{c:.45,n:1,nx:['bsl'],p:.6}],
  heraldo:[{c:.2,n:1,nx:['arrow'],p:.5},{c:.35,n:1,nx:['cinder'],p:.55},{c:.4,n:2,nx:['arrow','cinder'],p:.6}],
  capdorn:[{c:.3,n:1,nx:['bstab'],p:.5},{c:.45,n:1,nx:['bsl','bstab'],p:.55},{c:.5,n:2,nx:['bov','bstab'],p:.65}]},
 // ---- lectura moderada del jugador (solo mira lo YA ocurrido; nunca inputs futuros) ----
 read:{on:1,cool:3,lightSpam:3,lightWin:2.2,dodgeSpam:3,dodgeWin:3,delay:.32,far:120,farT:2.2}
};
// ---- ataques nuevos (mismo formato que los de data.js; el dibujo usa e.cur, no el nombre) ----
// jab: golpe rápido · chop: golpe lento y pesado · crush: golpe brutal (bruto) · quake: golpe de área circular (aoe) · charge: embestida larga
Object.assign(ATK,{
 jab:{w:.34,a:.1,r:.45,d:11,rng:24,sd:20},
 chop:{w:.9,a:.18,r:.9,d:21,rng:28,sd:24},
 crush:{w:1.15,a:.22,r:1.15,d:30,rng:36,sd:30},
 quake:{w:1.1,a:.18,r:1.05,d:22,rng:54,sd:44,aoe:1},
 charge:{w:1,a:.5,r:.95,d:24,rng:26,sd:110,mv:230}});
// listas de reserva (el motor usa DIF.pat; esto solo mantiene coherencia si DIF.on=0)
TY.soldier.at=['slash','jab','chop'];TY.warden.at=['slash','jab'];TY.brute.at=['smash','crush'];
// ---- fases de jefe con mecánicas distintas (no solo más vida/velocidad): golpes de área, embestidas y combos ----
// [id, fase, ...ataques]: se añaden SOLO si faltan (idempotente). combate_souls.js lo vuelve a llamar tras cargar caida.js,
// que redefine las fases del Rey y habría borrado los añadidos.
DIF.phAdd=[['sepulturero',1,'quake'],['sepulturero',2,'quake'],['pastora',2,'quake'],['caballero',1,'charge'],['caballero',2,'quake','charge'],
 ['rey',1,'quake'],['rey',2,'quake','charge'],['guardiana',1,'quake'],['guardiana',2,'charge'],['heraldo',2,'quake'],['capdorn',1,'charge'],['capdorn',2,'quake'],
 ['mariscal',2,'quake'],['cocinero',2,'quake'],['capataz',2,'charge','quake'],['madre',2,'quake']];
DIF.applyPh=()=>{for(const [id,ph,...a] of DIF.phAdd){const p=BS[id]&&BS[id].ph[ph];if(p)for(const k of a)if(!p.a.includes(k))p.a.push(k)}};
if(DIF.on)DIF.applyPh();
// combo genérico para jefes que no están en DIF.boss (mini-jefes de castillo y zonas opcionales): por fase
DIF.bossDef=[{c:.2,n:1,p:.5},{c:.35,n:1,p:.55},{c:.45,n:2,p:.65}];
