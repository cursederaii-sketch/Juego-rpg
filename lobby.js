// ===== LOBBY GLOBAL · plaza social previa a las partidas =====
// Se carga después de net.js y chat.js. Botón "Unirse al servidor global" dentro de Multijugador.
// Mundo pixel-art generado por código (sin imágenes): plaza central, castillo (Entrada al mundo), Regiones,
// Misiones/Eventos, Sala de juegos y Zona social. Los jugadores conectados se ven caminando; chat global.
// Servidor: ver server/server.js (mensajes hub / hs / hc / rl).
(function () {
'use strict';
const NET = window.NET; if (!NET || !NET.openSocket) return;
const M = window.LOBBYMAP; if (!M) { console.warn('lobby_mapa.js no cargó'); return; }
const W = M.W, H = M.H, FONT = '"Press Start 2P",monospace';
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
let seed = 11; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const F = (g, c, x, y, w, h) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
const ACC = ['#7df9ff', '#ffe66d', '#7dff9a', '#ff9a6b', '#c08cff', '#ff7a8a'];

// ------------------------------------------------------------------ estado
const HB = { on: false, id: -1, ws: null, slot: 1, name: '', online: 0, rooms: [], pub: true, fire: '', err: '', panel: '', near: null };
const others = new Map(), lines = [], bub = {};
const me = { x: 384, y: 332, fx: 0, fy: 1, mv: false, tx: null, ty: null, goal: null, stuck: 0, roll: 0, rcd: 0, rx: 0, ry: 1 };
const keys = {};
// ZOOM = cuántas veces más grande es el mundo respecto al personaje (usa enteros: 2, 3…). CH = alto del lienzo en píxeles.
const ZOOM = 2, CH = 190, CAM = { x: 0, y: 0, vh: CH / ZOOM, vw: 285 / ZOOM };
let sc = null, raf = 0, lastT = 0, tAcc = 0, sendT = 0, lastSent = '', S_ = 1, root = null;

// ------------------------------------------------------------------ mapa (ver lobby_mapa.js)
const HS = M.HS;

// ------------------------------------------------------------------ dibujo dinámico
// Sprite real del juego (kit 'player' de sprites.js), reducido para la escala de la plaza.
const CHS = .6, scache = {};
function scaled(src, key) {
  let c = scache[key];
  if (!c) { c = mkc(Math.max(1, Math.round(src.width * CHS)), Math.max(1, Math.round(src.height * CHS))); const q = c.getContext('2d'); q.imageSmoothingEnabled = true; q.imageSmoothingQuality = 'high'; q.drawImage(src, 0, 0, c.width, c.height); scache[key] = c; }
  return c;
}
function drawChar(g, x, y, c, fx, fy, mv, t, roll) {
  if (typeof bodyArt !== 'function' || typeof rollArt !== 'function') return drawCharOld(g, x, y, c, fx, fy, mv, t);
  x = Math.round(x); y = Math.round(y);
  const ax = Math.abs(fx), ay = Math.abs(fy), dk = ax > ay ? (fx < 0 ? 'l' : 'r') : (fy < 0 ? 'u' : 'd'), kind = dk === 'd' ? 'd' : dk === 'u' ? 'u' : 's';
  g.fillStyle = 'rgba(0,0,0,.38)'; g.fillRect(x - 7, y - 1, 14, 2); g.fillRect(x - 5, y - 2, 10, 1); g.fillRect(x - 5, y + 1, 10, 1);
  if (roll) {
    const f = (t * 16 | 0) & 3, sp = scaled(rollArt('player', f), 'r' + f);
    g.globalAlpha = .9; g.drawImage(sp, Math.round(x - sp.width / 2), Math.round(y - 20 * CHS)); g.globalAlpha = 1; return;
  }
  const pose = mv ? 'walk' : 'idle', fr = mv ? (t * 9 | 0) : (t * 2 | 0), sp = scaled(bodyArt('player', kind, pose, fr), 'b' + kind + pose + (fr & 3));
  const ox = Math.round(x - sp.width / 2), oy = Math.round(y - (sp.height - 3 * CHS));
  if (dk === 'r') { g.save(); g.translate(ox + sp.width, oy); g.scale(-1, 1); g.drawImage(sp, 0, 0); g.restore(); } else g.drawImage(sp, ox, oy);
}
function drawCharOld(g, x, y, c, fx, fy, mv, t) {
  x = Math.round(x); y = Math.round(y); const st = mv ? (Math.floor(t * 8) % 2) : 0, bob = mv && st ? 1 : 0, ac = ACC[c % 6];
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x - 4, y - 1, 9, 2);
  F(g, '#1b1526', x - 2, y - 2 - (st ? 0 : 1), 2, 2); F(g, '#1b1526', x + 1, y - 2 - (st ? 1 : 0), 2, 2);
  F(g, '#2a2140', x - 3, y - 9 - bob, 7, 7); F(g, '#3b2f5c', x - 3, y - 9 - bob, 2, 7); F(g, ac, x - 3, y - 5 - bob, 7, 1); F(g, ac, x - 2, y - 9 - bob, 5, 1);
  F(g, '#e8c9a0', x - 2, y - 13 - bob, 5, 4); F(g, '#241a38', x - 3, y - 14 - bob, 7, 3); F(g, '#241a38', x - 3, y - 12 - bob, 1, 3); F(g, '#241a38', x + 3, y - 12 - bob, 1, 3);
  if (fy >= -.4) { const ex = Math.round(Math.max(-1, Math.min(1, fx * 1.5))); F(g, '#111', x - 1 + ex, y - 11 - bob, 1, 1); F(g, '#111', x + 1 + ex, y - 11 - bob, 1, 1); }
}
function frame(now) {
  raf = requestAnimationFrame(frame); if (!HB.on || !sc) return;
  const dt = Math.min(.05, (now - lastT) / 1000 || 0); lastT = now; tAcc += dt; const t = tAcc;
  step(dt);
  sendT += dt; if (sendT > .1) { sendT = 0; const k = Math.round(me.x) + ',' + Math.round(me.y); if (k !== lastSent) { lastSent = k; send({ t: 'hp', x: Math.round(me.x), y: Math.round(me.y) }); } }
  for (const o of others.values()) { const k = Math.min(1, dt * 10), d = Math.hypot(o.x - o.vx, o.y - o.vy); o.mv = d > .6; if (d > 40) { o.vx = o.x; o.vy = o.y; } else { if (d > .3) { o.fx = o.x - o.vx; o.fy = o.y - o.vy; } o.vx += (o.x - o.vx) * k; o.vy += (o.y - o.vy) * k; } }
  // cámara: sigue al jugador (suavizada) y se limita a los bordes del mapa
  { const tx = CAM.vw >= W ? (W - CAM.vw) / 2 : Math.max(0, Math.min(W - CAM.vw, me.x - CAM.vw / 2)), ty = CAM.vh >= H ? (H - CAM.vh) / 2 : Math.max(0, Math.min(H - CAM.vh, me.y - 5 - CAM.vh / 2)), k = Math.min(1, dt * 8); CAM.x += (tx - CAM.x) * k; CAM.y += (ty - CAM.y) * k; }
  const Z = ZOOM, camx = Math.round(CAM.x * Z) / Z, camy = Math.round(CAM.y * Z) / Z;
  const g = cx_; g.imageSmoothingEnabled = false; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#05030a'; g.fillRect(0, 0, hbcW(), hbcH()); g.setTransform(Z, 0, 0, Z, -camx * Z, -camy * Z);
  g.drawImage(sc.sky, 0, 0);
  for (const s of sc.stars) { g.globalAlpha = .35 + .65 * Math.abs(Math.sin(t * s.s + s.p)); F(g, '#dfe4ff', s.x, s.y, 1, 1); } g.globalAlpha = 1;
  g.fillStyle = 'rgba(150,140,220,.10)'; for (const c of sc.clouds) { c.x += c.v * dt; if (c.x - c.w > W) c.x = -c.w; g.beginPath(); g.ellipse(c.x, c.y, c.w, 5, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(c.x - c.w * .3, c.y - 3, c.w * .5, 4, 0, 0, 7); g.fill(); }
  g.drawImage(sc.world, 0, 0);
  const pu = .5 + .5 * Math.sin(t * 2.2); sc.anim(g, t, pu);
  // sprites y personajes ordenados por y
  const dr = [];
  for (const p of sc.props) dr.push({ y: p.y, f: () => {
    if (p.draw) return p.draw(g, t);
    g.drawImage(p.img, Math.round(p.x - p.img.width / 2), Math.round(p.y - p.img.height));
    if (p.fire) M.flame(g, p.x, p.y - p.fy, t, 1, p.fire);
    if (p.lamp) M.glow(g, p.x, p.y - p.lh, 24, '255,200,110', .5 + .08 * Math.sin(t * 5 + p.x));
    if (p.glow) M.glow(g, p.x, p.y - (p.gy || 8), 18, p.glow, (p.ga || .3) + .12 * pu);
    if (p.beam) { const a = t * .8, bx = p.x, by = p.by; g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,230,150,.16)'; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a) * 150, by + Math.sin(a) * 60 - 14); g.lineTo(bx + Math.cos(a + .22) * 150, by + Math.sin(a + .22) * 60 + 6); g.fill(); g.restore(); M.glow(g, bx, by, 26, '255,220,120', .6); }
    if (p.gz) M.glow(g, p.x, p.y - 26, 22, '110,200,255', .35 + .15 * pu);
  } });
  const chr = (x, y, c, fx, fy, mv, roll) => { const px = Math.round(x * Z) / Z, py = Math.round(y * Z) / Z; g.save(); g.translate(px, py); g.scale(1 / Z, 1 / Z); drawChar(g, 0, 0, c, fx, fy, mv, t, roll); g.restore(); };
  for (const o of others.values()) dr.push({ y: o.vy, f: () => chr(o.vx, o.vy, o.c, o.fx, o.fy, o.mv) });
  dr.push({ y: me.y, f: () => chr(me.x, me.y, HB.id, me.fx, me.fy, me.mv, me.roll > 0) });
  dr.sort((a, b) => a.y - b.y).forEach(d => d.f());
  sc.top(g, t); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(sc.vig, 0, 0, hbcW(), hbcH());
  // texto (resolución del dispositivo)
  const q = tx_, dpr = window.devicePixelRatio || 1, k = S_ * dpr; q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, tc.width, tc.height); q.setTransform(k * Z, 0, 0, k * Z, -camx * k * Z, -camy * k * Z);
  q.textAlign = 'center'; q.textBaseline = 'alphabetic'; q.font = '8.6px ' + FONT;
  const name = (n, x, y, c) => { q.save(); q.translate(x, y); q.scale(1 / Z, 1 / Z); q.lineWidth = 2.6; q.strokeStyle = 'rgba(5,3,10,.9)'; q.strokeText(n, 0, -36); q.fillStyle = c; q.fillText(n, 0, -36); q.restore(); };
  for (const [id, o] of others) { name(o.n, o.vx, o.vy, ACC[o.c % 6]); bubble(q, id, o.vx, o.vy); }
  name(HB.name || 'Tú', me.x, me.y, '#ffe66d'); bubble(q, HB.id, me.x, me.y);
  for (const e of labels) { const h = e.h, lx = (h.lx - camx) * Z * S_, ly = (h.ly - camy) * Z * S_; e.el.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px) translate(-50%,-50%)'; }
  prompt_();
}
function bubble(q, id, x, y) {
  const b = bub[id]; if (!b) return; if (performance.now() - b.t > 6000) { delete bub[id]; return; }
  q.save(); q.translate(x, y); q.scale(1 / Z, 1 / Z); x = 0; y = -43; let s = b.m.length > 34 ? b.m.slice(0, 33) + '…' : b.m; q.font = '7.4px ' + FONT; const w = q.measureText(s).width + 9;
  q.fillStyle = 'rgba(11,7,20,.88)'; q.fillRect(x - w / 2, y - 12, w, 14); q.strokeStyle = '#c9a54a'; q.lineWidth = .8; q.strokeRect(x - w / 2, y - 12, w, 14); q.fillStyle = '#fff'; q.fillText(s, x, y - 2); q.font = '8.6px ' + FONT; q.restore();
}

// ------------------------------------------------------------------ movimiento
function walkable(x, y) {
  if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1 || !sc.walk[(y | 0) * W + (x | 0)]) return false;
  for (const o of sc.obst) { if (o.r !== undefined) { if (Math.hypot(x - o.x, y - o.y) < o.r + 1) return false; } else if (x > o.x - 1 && x < o.x + o.w + 1 && y > o.y - 1 && y < o.y + o.h + 1) return false; }
  return true;
}
function startRoll(dx, dy) {
  if (me.rcd > 0 || me.roll > 0 || HB.panel) return;
  let l = Math.hypot(dx, dy); if (!l) { dx = me.fx; dy = me.fy; l = Math.hypot(dx, dy) || 1; }
  me.rx = dx / l; me.ry = dy / l; me.fx = me.rx; me.fy = me.ry; me.roll = .28; me.rcd = .7; me.tx = null; me.goal = null;
}
function step(dt) {
  if (me.rcd > 0) me.rcd -= dt;
  // botones táctiles / mando: usan los mismos eventos que la sala privada (buf.act = Actuar, buf.dodge = Esquiva)
  if (typeof buf !== 'undefined') {
    if (buf.act > 0) { buf.act = 0; if (!HB.panel && HB.near) openPanel(HB.near.id); }
    if (buf.dodge > 0) { buf.dodge = 0; if (!HB.panel) startRoll(0, 0); }
  }
  if (me.roll > 0) { // rodar: impulso corto en la dirección actual
    me.roll -= dt; me.mv = true; me.tx = null;
    const sp = 215 / ZOOM * dt; let ok = false;
    for (const a of [0, .6, -.6]) { const c = Math.cos(a), s = Math.sin(a), vx = me.rx * c - me.ry * s, vy = me.rx * s + me.ry * c, nx = me.x + vx * sp, ny = me.y + vy * sp; if (walkable(nx, ny)) { me.x = nx; me.y = ny; ok = true; break; } }
    if (!ok) me.roll = 0; if (me.roll <= 0) me.mv = false; return;
  }
  let dx = 0, dy = 0; if (keys.l) dx--; if (keys.r) dx++; if (keys.u) dy--; if (keys.d) dy++;
  if (!(dx || dy) && typeof joy !== 'undefined' && joy.on) { dx = joy.x; dy = joy.y; } // joystick táctil o stick del mando (analógico)
  if (!(dx || dy) && typeof held !== 'undefined') { dx = (held.right ? 1 : 0) - (held.left ? 1 : 0); dy = (held.down ? 1 : 0) - (held.up ? 1 : 0); } // cruceta del mando
  if (dx || dy) { me.tx = null; me.goal = null; }
  else if (me.tx !== null) { const ex = me.tx - me.x, ey = me.ty - me.y, d = Math.hypot(ex, ey); if (d < 3) { me.tx = null; arrive(); } else { dx = ex / d; dy = ey / d; } }
  me.mv = false; if (!(dx || dy) || HB.panel) { if (HB.panel) me.tx = null; return; }
  const l = Math.hypot(dx, dy), sp = 100 / ZOOM * dt * Math.min(1, l); dx /= l; dy /= l; let moved = false;
  for (const a of [0, .6, -.6, 1.1, -1.1]) {
    const c = Math.cos(a), s = Math.sin(a), vx = dx * c - dy * s, vy = dx * s + dy * c, nx = me.x + vx * sp, ny = me.y + vy * sp;
    if (walkable(nx, ny)) { me.x = nx; me.y = ny; me.fx = vx; me.fy = vy; moved = true; break; }
  }
  me.mv = moved;
  if (!moved && me.tx !== null) { me.stuck += dt; if (me.stuck > .35) { me.tx = null; me.stuck = 0; arrive(); } } else me.stuck = 0;
}
const hsOf = id => HS.find(h => h.id === id);
function arrive() { const h = me.goal && hsOf(me.goal); me.goal = null; if (h && Math.hypot(me.x - h.px, me.y - h.py) <= h.r + 6) openPanel(h.id); }
function nearHs() { return HS.find(h => Math.hypot(me.x - h.px, me.y - h.py) < h.r) || null; }
function prompt_() {
  const n = HB.panel ? null : nearHs(); if ((n && n.id) === (HB.near && HB.near.id)) return; HB.near = n;
  const b = $('hbgo'); if (!b) return; if (n) { b.textContent = 'Entrar · ' + n.t; b.style.display = 'block'; } else b.style.display = 'none';
}

// ------------------------------------------------------------------ red
let cx_ = null, tx_ = null, tc = null, labels = [];
const hbcW = () => $('hbc').width, hbcH = () => $('hbc').height;
function send(o) { const w = NET.ws; if (w && w.readyState === 1) w.send(JSON.stringify(o)); }
function hubMsg(m) {
  if (!HB.ws) return false;
  switch (m.t) {
    case 'hub': HB.id = m.id; HB.online = m.o; HB.rooms = m.r || []; syncPlayers(m.p); showHub(); return true;
    case 'hs': HB.online = m.o; syncPlayers(m.p); setOnline(); if (HB.panel === 'social') panel('social'); return true;
    case 'rl': HB.rooms = m.r || []; HB.online = m.o; setOnline(); if (HB.panel === 'regions') panel('regions'); return true;
    case 'hc': addLine(m.id, m.n, m.m); bub[m.id] = { m: m.m, t: performance.now() }; return true;
    case 'err': if (HB.on) { HB.err = m.m || 'Error'; if (HB.panel) panel(HB.panel); else sys(HB.err); return true; } return false;
  }
  return false;
}
function syncPlayers(arr) {
  const seen = new Set();
  for (const a of arr || []) { const id = a[0]; if (id === HB.id) continue; seen.add(id); let o = others.get(id); if (!o) { o = { n: a[1], x: a[2], y: a[3], vx: a[2], vy: a[3], c: a[4], fx: 0, fy: 1, mv: false }; others.set(id, o); } o.n = a[1]; o.x = a[2]; o.y = a[3]; o.c = a[4]; }
  for (const id of others.keys()) if (!seen.has(id)) others.delete(id);
}
NET.hubMsg = hubMsg; NET.hubState = { me, HB };
window.netHub = async function () {
  const v = NET.lobbyVals(); let sd = null; try { sd = slotData(v.slot); } catch (e) {}
  HB.slot = v.slot; HB.name = v.name || (sd && sd.name) || 'Sin nombre'; HB.err = '';
  const e = $('mpe'); const say = (t, ok) => { if (e) { e.style.color = ok ? '#c9b8ff' : '#ff7a8a'; e.textContent = t; } };
  if (!v.url) return say('Escribe la dirección del servidor');
  say('Conectando al servidor global…', 1);
  try { localStorage.setItem('jur_mp_url', v.url); localStorage.setItem('jur_mp_name', v.name); } catch (er) {}
  try { await NET.openSocket(v.url, 0, 70000); } catch (er) { return say(er.message + ' · revisa la dirección y que el servidor esté encendido'); }
  const w = NET.ws, prev = w.onclose; HB.ws = w;
  w.onclose = ev => { if (prev) prev(ev); if (HB.ws === w && !NET.on) { stopHub(); toast_('Conexión perdida con el servidor global'); window.netLobby && window.netLobby(); } };
  send({ t: 'hub', n: HB.name });
  clearTimeout(HB.wt); HB.wt = setTimeout(() => { // el servidor viejo no conoce el lobby y nunca contesta
    if (HB.on || HB.ws !== w) return; HB.ws = null; w.onclose = null; try { w.close(); } catch (er) {} NET.ws = null;
    say('El servidor conectó, pero no respondió al lobby. Comprueba que el backend esté actualizado y vuelve a intentarlo.');
  }, 10000);
};
const toast_ = t => { try { tMsg(t); } catch (e) {} };
function stopHub(keepSocket) {
  document.body.classList.remove('hub', 'hubp'); if (!keepSocket && HB.mprev) { const m = $('menu'); if (m) m.style.display = HB.mprev; } HB.mprev = '';
  HB.on = false; cancelAnimationFrame(raf); raf = 0; HB.panel = ''; others.clear();
  if (root) root.style.display = 'none';
  if (!keepSocket && HB.ws) { const w = HB.ws; HB.ws = null; try { w.onclose = null; w.close(); } catch (e) {} NET.ws = null; } else HB.ws = null;
}
NET.sub('start', () => { if (HB.on || HB.ws) stopHub(true); });

// ------------------------------------------------------------------ interfaz
const CSS = `#hubr{position:fixed;inset:0;z-index:101;background:#05030a;display:none;overflow:hidden;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#e8e0ff;touch-action:none;user-select:none;-webkit-user-select:none}
#hbstage{position:absolute;left:0;top:0;overflow:hidden}#hubr canvas{position:absolute;left:0;top:0;width:100%;height:100%;image-rendering:pixelated;background:transparent!important;border:0!important;box-shadow:none!important}#hbc{background:#05030a!important}#hbt{image-rendering:auto!important;pointer-events:none}
.hbl{position:absolute;left:0;top:0;pointer-events:none;will-change:transform;text-align:center;padding:.35em .8em;background:rgba(8,6,18,.82);border:1px solid #c9a54a;border-radius:6px;white-space:nowrap;font-size:max(8px,calc(var(--s)*6.4px));line-height:1.25;box-shadow:0 0 10px rgba(0,0,0,.6)}
.hbl b{display:block;color:#fff;letter-spacing:.04em}.hbl i{display:block;font-style:normal;color:#b9ade0;font-size:.82em}.hbl:hover,.hbl.on{border-color:#ffe66d;background:rgba(30,20,60,.9)}
.hbx{position:absolute;background:rgba(8,6,18,.82);border:1px solid #6a5226;border-radius:6px;padding:7px 10px;font-size:11px;z-index:3}
#hbtitle{display:flex;align-items:center;gap:8px}#hbtitle{padding-right:14px}#hbtitle b{font:13px ${FONT};color:#fff;letter-spacing:1px;display:block}#hbtitle small{display:block;color:#b9ade0;letter-spacing:3px;font-size:8px;margin-top:3px}
#hbtag{display:none}
#hbtl{position:absolute;left:8px;top:max(8px,env(safe-area-inset-top));z-index:3;display:flex;gap:8px;align-items:stretch}#hbtl .hbx{position:static}#hbback{display:flex;align-items:center;cursor:pointer;color:#ffe9a0;border-color:#c9a54a}
#hbon{right:8px;top:max(8px,env(safe-area-inset-top));font-size:11px}#hbleg{right:8px;bottom:calc(max(8px,env(safe-area-inset-bottom)) + 70px);line-height:1.9;font-size:10px;padding:5px 9px}
#hbleg span{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:7px;vertical-align:-1px}
#hbchat{left:8px;bottom:max(8px,env(safe-area-inset-bottom));width:min(300px,50vw);padding:6px 8px;background:rgba(8,6,18,.72)}#hbchat .ln{font-size:11px;line-height:1.35;margin:0 0 3px;word-break:break-word}#hbchat .ln b{font-weight:600}
#hbchat input{width:100%;box-sizing:border-box;background:#0b0714;border:1px solid #6a5226;border-radius:4px;color:#fff;padding:6px 8px;font-size:12px;margin-top:3px;user-select:text;-webkit-user-select:text;touch-action:auto}
#hbcomp{right:8px;bottom:max(8px,env(safe-area-inset-bottom));width:64px;height:64px;padding:0;border:0;background:none}
#hbgo{position:absolute;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);display:none;z-index:4;padding:12px 18px;background:#3a2a5a;border:1px solid #ffe66d;border-radius:6px;color:#ffe66d;font:10px ${FONT};cursor:pointer}
#hbp{position:absolute;inset:0;z-index:6;display:none;align-items:center;justify-content:center;background:rgba(5,3,10,.72);padding:10px;touch-action:auto}
#hbpc{width:min(470px,100%);max-height:88vh;overflow:auto;box-sizing:border-box;padding:16px;background:linear-gradient(180deg,rgba(24,14,44,.96),rgba(8,4,16,.97));border:1px solid #c9a54a;border-radius:8px;user-select:text;-webkit-user-select:text}
#hbpc h2{font:12px/1.5 ${FONT};color:#ffe9a0;margin:0 0 4px;text-align:center}#hbpc .sub{text-align:center;color:#b9ade0;font-size:12px;margin:0 0 12px}
#hbpc button{font-family:inherit}#hbpc .bt{display:block;width:100%;box-sizing:border-box;text-align:left;margin:6px 0;padding:10px 12px;background:#1a1026;border:1px solid #6a5226;border-radius:6px;color:#fff;font-size:13px;cursor:pointer}
#hbpc .bt.sel{border-color:#ffe66d;background:#3a2a5a}#hbpc .bt.pr{text-align:center;border-color:#ffe66d;color:#ffe66d;font-weight:600}#hbpc .bt:disabled{opacity:.4;cursor:default}
#hbpc .rw{display:flex;align-items:center;gap:8px;margin:6px 0;padding:8px 10px;background:#140c20;border:1px solid #3a2c52;border-radius:6px;font-size:13px}#hbpc .rw .i{flex:1}#hbpc .rw small{display:block;color:#b9ade0}#hbpc .rw button{padding:8px 12px;background:#3a2a5a;border:1px solid #ffe66d;border-radius:5px;color:#ffe66d;cursor:pointer}
#hbpc .er{color:#ff7a8a;min-height:16px;text-align:center;font-size:12px;margin:6px 0}#hbpc input{width:100%;box-sizing:border-box;padding:10px;background:#0b0714;border:1px solid #c9a54a;color:#fff;font:12px ${FONT};text-align:center;letter-spacing:6px;text-transform:uppercase;border-radius:4px;touch-action:auto}
#hbpc .tw{text-align:center;color:#b9ade0;font-size:13px;line-height:1.6;margin:14px 0}#hbpc .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:8px}
body.hub #ui{position:fixed;left:0;right:0;bottom:0;padding:0 max(18px,env(safe-area-inset-right)) max(14px,env(safe-area-inset-bottom)) max(18px,env(safe-area-inset-left));pointer-events:none;z-index:102}body.hub #ui>*{pointer-events:auto}
body.hub #ac{grid-template-columns:repeat(2,calc(58px*var(--ts,1)))}body.hub #ac button:not([data-k=act]):not([data-k=dodge]){display:none}body.hub #ac button[data-k=dodge],body.hub #ac button[data-k=act]{grid-area:auto;top:0}
body.hub:not(.notouch):not(.gp) #hbleg,body.hub:not(.notouch):not(.gp) #hbcomp{display:none}
body.hub:not(.notouch):not(.gp) #hbchat{bottom:calc(max(8px,env(safe-area-inset-bottom)) + 172px*var(--ts,1))}
body.hub:not(.notouch):not(.gp) #hbgo{bottom:calc(max(14px,env(safe-area-inset-bottom)) + 8px)}
body.hub.notouch #ui,body.hub.gp #ui,body.hubp #ui{display:none}
#hbpc,#hbp{z-index:200}#hubr #hbp{z-index:200}
@media (max-height:480px){#hbleg,#hbcomp{display:none}#hbtitle em,#hbtitle svg{display:none!important}#hbtitle b{font-size:9px}#hbtitle small{font-size:6px;letter-spacing:2px;margin-top:2px}#hbtitle{padding:4px 8px}#hbtl .hbx{padding:4px 8px}#hbln .ln:not(:nth-last-child(-n+2)){display:none}#hbchat{width:min(200px,28vw);padding:4px 6px}#hbchat .ln{font-size:10px}#hbchat input{padding:4px 6px;font-size:11px}#hbon{font-size:10px;padding:4px 8px}}`;
const col = c => ACC[c % 6];
function build() {
  if (root) return;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  root = document.createElement('div'); root.id = 'hubr';
  root.innerHTML = '<div id="hbstage"><canvas id="hbc" width="' + W + '" height="' + H + '"></canvas><canvas id="hbt"></canvas><div id="hbl"></div></div>'
    + '<div id="hbtl"><div class="hbx" id="hbtitle"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#ffe9a0" stroke-width="1.2"><path d="M12 1l2.2 8.8L23 12l-8.8 2.2L12 23l-2.2-8.8L1 12l8.8-2.2z"/><circle cx="12" cy="12" r="2"/></svg><div><b>JURAMENTO</b><small>SERVIDOR GLOBAL</small><em style="display:block;font-size:9px;color:#cfc4ee;margin-top:4px">Diferentes caminos, una misma meta.</em></div></div>'
    + '<div class="hbx" id="hbback">‹ Volver</div></div>'
    + '<div class="hbx" id="hbon"></div><div class="hbx" id="hbleg"><span style="background:#7dff9a"></span>Zona segura<br><span style="background:#4aa8ff"></span>Punto de interacción<br><span style="background:#ffe66d"></span>Tú</div>'
    + '<div class="hbx" id="hbchat"><div id="hbln"></div><input id="hbci" maxlength="100" placeholder="Escribe aquí… (/help)" autocomplete="off" enterkeyhint="send"></div>'
    + '<svg class="hbx" id="hbcomp" viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="rgba(8,6,18,.7)" stroke="#6a5226"/><path d="M32 8l5 24-5 24-5-24z" fill="#c9a54a" opacity=".85"/><path d="M8 32l24-5 24 5-24 5z" fill="#c9a54a" opacity=".5"/><g fill="#e8e0ff" font-size="8" font-family="sans-serif" text-anchor="middle"><text x="32" y="8">N</text><text x="32" y="63">S</text><text x="59" y="35">E</text><text x="6" y="35">O</text></g></svg>'
    + '<button id="hbgo"></button><div id="hbp"><div id="hbpc"></div></div>';
  document.body.appendChild(root);
  cx_ = $('hbc').getContext('2d'); tc = $('hbt'); tx_ = tc.getContext('2d');
  const L = $('hbl'); L.innerHTML = HS.map(h => '<div class="hbl" data-h="' + h.id + '"><b>' + h.t + '</b><i>' + h.s + '</i></div>').join(''); labels = HS.map(h => ({ h, el: L.querySelector('[data-h="' + h.id + '"]') }));
  $('hbgo').onclick = () => { if (HB.near) openPanel(HB.near.id); };
  $('hbback').onclick = () => { stopHub(false); window.netLobby && window.netLobby(); };
  const ci = $('hbci'); ci.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); const t = ci.value.trim(); ci.value = ''; if (t) chatSend(t); ci.blur(); } else if (e.key === 'Escape') ci.blur(); });
  const act_ = e => { const k = e.key.toLowerCase(); return (typeof KM !== 'undefined' && KM[k]) || ({ a: 'left', arrowleft: 'left', d: 'right', arrowright: 'right', w: 'up', arrowup: 'up', s: 'down', arrowdown: 'down', e: 'act', ' ': 'dodge', l: 'dodge' })[k] || ''; };
  const dirk = { left: 'l', right: 'r', up: 'u', down: 'd' };
  addEventListener('keydown', e => {
    if (!HB.on || e.ctrlKey || e.metaKey || e.altKey) return; const tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA') return;
    const k = e.key.toLowerCase(), a = act_(e); let h = true;
    if (dirk[a]) keys[dirk[a]] = 1;
    else if (a === 'act') { if (!HB.panel && !e.repeat && HB.near) openPanel(HB.near.id); }
    else if (a === 'dodge') { if (!HB.panel && !e.repeat) startRoll(((keys.r || 0) - (keys.l || 0)), ((keys.d || 0) - (keys.u || 0))); }
    else if (k === 'enter' || k === 't') { if (!HB.panel) $('hbci').focus(); } else if (k === 'escape') { if (HB.panel) closePanel(); } else h = false;
    if (h) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  addEventListener('keyup', e => { if (!HB.on) return; const a = act_(e); if (dirk[a]) keys[dirk[a]] = 0; }, true);
  addEventListener('resize', fit);
  $('hbp').addEventListener('pointerdown', e => { if (e.target.id === 'hbp') closePanel(); });
}
function fit() {
  if (!root) return; const vw = innerWidth, vh = innerHeight; S_ = vh / CH; const cw = Math.max(1, Math.round(vw / S_)); CAM.vw = cw / ZOOM; CAM.vh = CH / ZOOM;
  const c = $('hbc'), s = $('hbstage'); if (c.width !== cw) c.width = cw; if (c.height !== CH) c.height = CH;
  s.style.width = vw + 'px'; s.style.height = vh + 'px'; s.style.setProperty('--s', Math.min(S_, 2.2));
  const dpr = window.devicePixelRatio || 1; tc.width = Math.round(vw * dpr); tc.height = Math.round(vh * dpr);
}
function setOnline() { const e = $('hbon'); if (e) e.innerHTML = '<span style="color:#7dff9a">●</span> Jugadores en línea: <b>' + HB.online + '</b>'; }
function addLine(id, n, m, sysm) { lines.push({ id, n, m, s: sysm, t: Date.now() }); if (lines.length > 60) lines.shift(); drawLines(); }
const sys = m => addLine(0, '', m, 1);
function drawLines() {
  const e = $('hbln'); if (!e) return; const show = lines.slice(-4);
  e.innerHTML = show.map(l => l.s ? '<p class="ln" style="color:#b9ade0">' + esc(l.m) + '</p>' : '<p class="ln"><b style="color:' + col(l.id) + '">' + esc(l.n) + ':</b> ' + esc(l.m) + '</p>').join('');
}
function chatSend(t) {
  if (t[0] === '/') {
    const c = t.slice(1).split(' ')[0].toLowerCase();
    if (c === 'help') return sys('Comandos: /help · /who (quién hay) · /salir (volver al menú). Muévete con WASD / flechas, el joystick o el mando; Enter para chatear.');
    if (c === 'who') return sys('En línea: ' + HB.online + ' · En el lobby: ' + (others.size + 1) + ' (' + [HB.name].concat([...others.values()].map(o => o.n)).join(', ') + ')');
    if (c === 'salir') { stopHub(false); return window.netLobby && window.netLobby(); }
    return sys('Comando desconocido. Escribe /help');
  }
  send({ t: 'hc', m: t });
}
function showHub() {
  clearTimeout(HB.wt); build(); document.body.classList.add('hub'); { const m = $('menu'); if (m && m.style.display && m.style.display !== 'none') { HB.mprev = m.style.display; m.style.display = 'none'; } } HB.on = true; HB.err = ''; HB.panel = ''; root.style.display = 'block'; if (NET.hideLobby) NET.hideLobby(); fit();
  if (!sc) sc = M.build();
  me.x = M.spawn[0]; me.y = M.spawn[1]; me.tx = null; me.goal = null; fit(); CAM.x = Math.max(0, Math.min(W - CAM.vw, me.x - CAM.vw / 2)); CAM.y = Math.max(0, Math.min(H - CAM.vh, me.y - 5 - CAM.vh / 2)); for (const k in keys) keys[k] = 0;
  setOnline(); $('hbp').style.display = 'none';
  if (!lines.length) sys('Bienvenido al servidor global de Juramento. Escribe /help para ver los comandos.'); drawLines();
  lastT = performance.now(); if (!raf) raf = requestAnimationFrame(frame);
}

// ------------------------------------------------------------------ paneles
function openPanel(id) { HB.err = ''; HB.near = null; const b = $('hbgo'); if (b) b.style.display = 'none'; panel(id); }
function closePanel() { document.body.classList.remove('hubp'); HB.panel = ''; HB.near = null; HB.err = ''; $('hbp').style.display = 'none'; }
function regName(k) { const a = String(k).split(':'), r = (typeof RG !== 'undefined') && RG[+a[0]]; return r ? r.n + ((r.fl && r.fl[a[1]]) || (+a[1] === 0 ? '' : ' · antes del jefe')) : String(k); }
function panel(id) {
  HB.panel = id; document.body.classList.add('hubp'); const p = $('hbp'), c = $('hbpc'); p.style.display = 'flex'; let h = '';
  const close = '<button class="bt" data-a="close" style="text-align:center;color:#c9b8ff">Cerrar</button>', err = '<div class="er">' + esc(HB.err || '') + '</div>';
  if (id === 'regions') {
    h = '<h2>REGIONES</h2><p class="sub">Partidas públicas abiertas. Entrarás con tu personaje del slot ' + HB.slot + '.</p>';
    h += HB.rooms.length ? HB.rooms.map(r => '<div class="rw"><div class="i"><b>' + esc(r.n) + '</b><small>' + esc(r.g || 'Región desconocida') + ' · ' + r.p + '/' + r.m + ' jugadores</small></div><button data-j="' + r.c + '"' + (r.p >= r.m ? ' disabled' : '') + '>' + (r.p >= r.m ? 'Llena' : 'Unirse') + '</button></div>').join('')
      : '<div class="tw">No hay partidas públicas ahora mismo.<br>Crea una en la Entrada al mundo.</div>';
    h += '<p class="sub" style="margin-top:14px">¿Tienes un código de sala?</p><input id="hbk" maxlength="4" placeholder="ABCD" autocomplete="off" autocapitalize="characters"><button class="bt pr" data-a="code" style="margin-top:8px">Unirse con código</button>' + err + close;
  } else if (id === 'world') {
    let sd = null; try { sd = slotData(HB.slot); } catch (e) {}
    const fires = sd && sd.fires && sd.fires.length ? sd.fires : ['0:0'];
    if (!HB.fire || !fires.includes(HB.fire)) HB.fire = (sd && sd.bf && fires.includes(sd.bf.r + ':' + sd.bf.x)) ? sd.bf.r + ':' + sd.bf.x : fires[0];
    h = '<h2>ENTRADA AL MUNDO</h2><p class="sub">Personaje: ' + esc(sd ? (sd.name || 'Sin nombre') : HB.name) + (sd ? '' : ' (partida nueva)') + ' · slot ' + HB.slot + '<br>Elige desde dónde empieza tu sala. Serás el anfitrión.</p>';
    h += fires.map(k => '<button class="bt' + (k === HB.fire ? ' sel' : '') + '" data-f="' + esc(k) + '">' + esc(regName(k)) + '</button>').join('');
    h += '<p class="sub" style="margin-top:12px">Visibilidad</p><button class="bt' + (HB.pub ? ' sel' : '') + '" data-v="1">Pública · aparece en Regiones</button><button class="bt' + (!HB.pub ? ' sel' : '') + '" data-v="0">Privada · solo con el código</button>';
    h += '<button class="bt pr" data-a="create" style="margin-top:12px">Crear partida y entrar</button>' + err + close;
  } else if (id === 'social') {
    const all = [{ n: HB.name + ' (tú)', c: HB.id }].concat([...others.values()].map(o => ({ n: o.n, c: o.c })));
    h = '<h2>ZONA SOCIAL</h2><p class="sub">Jugadores en el lobby ahora mismo: ' + all.length + '</p>' + all.map(o => '<div class="rw"><span class="dot" style="background:' + col(o.c) + '"></span><div class="i">' + esc(o.n) + '</div></div>').join('')
      + '<div class="tw">Usa el chat de abajo a la izquierda (Enter o T).<br>El chat de voz se activa dentro de una partida (botón 🎧).</div>' + close;
  } else {
    const cl_ = id === 'clans';
    h = '<h2>' + (cl_ ? 'CLANES' : 'SALA DE JUEGOS') + '</h2><div class="tw">' + (cl_ ? 'Aquí podrás crear un clan, unirte a uno y gestionarlo.' : 'Aquí vivirán el PvP y los minijuegos.') + '<br><br><b style="color:#ffe66d">Próximamente</b></div>' + close;
  }
  c.innerHTML = h;
  c.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { const b = c.querySelector('[data-a=code]'); if (b) b.click(); } }));
  c.querySelectorAll('[data-a=close]').forEach(b => b.onclick = closePanel);
  c.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { HB.fire = b.dataset.f; panel('world'); });
  c.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { HB.pub = b.dataset.v === '1'; panel('world'); });
  c.querySelectorAll('[data-j]').forEach(b => b.onclick = () => { HB.err = ''; NET.begin('join', { slot: HB.slot, name: HB.name, code: b.dataset.j }); });
  const bc = c.querySelector('[data-a=code]'); if (bc) bc.onclick = () => { const k = ($('hbk').value || '').trim().toUpperCase(); if (k.length !== 4) { HB.err = 'El código tiene 4 letras'; return panel('regions'); } HB.err = ''; NET.begin('join', { slot: HB.slot, name: HB.name, code: k }); };
  const cr = c.querySelector('[data-a=create]'); if (cr) cr.onclick = () => { HB.err = ''; const k = HB.fire; NET.begin('create', { slot: HB.slot, name: HB.name, pub: HB.pub, reg: (regName(k) || '').slice(0, 24), fire: k }); };
}
})();
