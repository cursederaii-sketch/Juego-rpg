// ===== LOBBY GLOBAL · plaza social previa a las partidas =====
// Se carga después de net.js y chat.js. Botón "Unirse al servidor global" dentro de Multijugador.
// Mundo pixel-art generado por código (sin imágenes): plaza central, castillo (Entrada al mundo), Regiones,
// Misiones/Eventos, Sala de juegos y Zona social. Los jugadores conectados se ven caminando; chat global.
// Servidor: ver server/server.js (mensajes hub / hs / hc / rl).
(function () {
'use strict';
const NET = window.NET; if (!NET || !NET.openSocket) return;
const W = 384, H = 256, FONT = '"Press Start 2P",monospace';
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
let seed = 11; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const F = (g, c, x, y, w, h) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
const ACC = ['#7df9ff', '#ffe66d', '#7dff9a', '#ff9a6b', '#c08cff', '#ff7a8a'];

// ------------------------------------------------------------------ estado
const HB = { on: false, id: -1, ws: null, slot: 1, name: '', online: 0, rooms: [], pub: true, fire: '', err: '', panel: '', near: null };
const others = new Map(), lines = [], bub = {};
const me = { x: 192, y: 176, fx: 0, fy: 1, mv: false, tx: null, ty: null, goal: null, stuck: 0, roll: 0, rcd: 0, rx: 0, ry: 1 };
const keys = {};
let sc = null, raf = 0, lastT = 0, tAcc = 0, sendT = 0, lastSent = '', S_ = 1, root = null;

// ------------------------------------------------------------------ puntos de interés
const HS = [
  { id: 'world', t: 'ENTRADA AL MUNDO', s: '(Seleccionar región)', lx: 192, ly: 38, px: 192, py: 63, r: 20 },
  { id: 'regions', t: 'REGIONES', s: '(Ver y unirse a partidas)', lx: 84, ly: 56, px: 100, py: 80, r: 22 },
  { id: 'events', t: 'MISIONES / EVENTOS', s: '(Cooperativo / Tareas · pronto)', lx: 296, ly: 34, px: 284, py: 80, r: 22 },
  { id: 'games', t: 'SALA DE JUEGOS', s: '(PvP / Minijuegos · pronto)', lx: 70, ly: 186, px: 90, py: 207, r: 20 },
  { id: 'social', t: 'ZONA SOCIAL', s: '(Chat / Jugadores)', lx: 192, ly: 238, px: 192, py: 223, r: 18 }
];

// ------------------------------------------------------------------ pintura del mundo
const TH = {
  grass: { top: ['#386b3a', '#4a8a46', '#2c5430'], hi: '#86c25e', lo: '#1f3d24', rock: ['#6a5a6e', '#4a3e52', '#30283a'] },
  snow: { top: ['#dfe9f5', '#f4f9ff', '#b6c8de'], hi: '#ffffff', lo: '#8aa0bd', rock: ['#7a7a98', '#55556f', '#383850'] },
  dark: { top: ['#4a4268', '#5b5280', '#38325a'], hi: '#a07af0', lo: '#1c1830', rock: ['#5a4c72', '#40345a', '#2a2040'] },
  sea: { top: ['#17407a', '#2160a8', '#102f5c'], hi: '#5fb4ff', lo: '#0a1f40', rock: ['#4a3e52', '#30283a', '#201a28'] },
  far: { top: ['#1d1a4a', '#25225a', '#16143a'], hi: '#2f2c6a', lo: '#100e2c', rock: ['#1a1840', '#141232', '#0e0c24'] }
};
function island(g, m, cx, cy, rx, ry, dp, th, walk) {
  const T = TH[th], bot = ry + dp;
  for (let y = cy; y <= cy + bot; y++) {
    const t = (y - cy) / bot, hw = Math.floor(rx * Math.sqrt(Math.max(0, 1 - t * t)) * (1 + (rnd() - .5) * .05));
    for (let x = cx - hw; x <= cx + hw; x++) {
      let i = rnd() < .2 ? 0 : rnd() < .7 ? 1 : 2; if (t > .55) i = Math.min(2, i + 1);
      if (x - (cx - hw) < 3) i = 0; else if ((cx + hw) - x < 3) i = 2; else if ((x * 7 + y) % 13 === 0 && rnd() < .6) i = 2;
      F(g, T.rock[i], x, y, 1, 1);
    }
  }
  for (let k = 0; k < Math.max(3, rx / 12 | 0); k++) { // estalactitas
    const x = Math.round(cx + (rnd() - .5) * rx * 1.2), u = (x - cx) / rx, yb = cy + bot * Math.sqrt(Math.max(0, 1 - u * u)), L = 4 + rnd() * 7 | 0;
    for (let j = 0; j < L; j++) F(g, T.rock[2], x - 1 + (j > L * .6 ? 1 : 0), yb + j - 2, 3 - (j * 3 / L | 0), 1);
  }
  const c2 = cy - 4;
  for (let y = c2 - ry; y <= c2 + ry; y++) for (let x = cx - rx; x <= cx + rx; x++) {
    const d = ((x - cx) / rx) ** 2 + ((y - c2) / ry) ** 2; if (d > 1) continue;
    let col; const v = rnd();
    if (d > .86) col = (y < c2 || x < cx - rx * .8) ? T.hi : T.lo; else col = v < .12 ? T.top[1] : v < .24 ? T.top[2] : T.top[0];
    if (th === 'grass' && d < .8 && rnd() < .012) col = rnd() < .5 ? '#e8d27a' : '#d98adb';
    F(g, col, x, y, 1, 1);
  }
  if (walk && m) { m.fillStyle = '#fff'; m.beginPath(); m.ellipse(cx, c2, rx - 1, ry - 1, 0, 0, 7); m.fill(); }
}
function brick(g, x, y, w, h, c1, c2, c3) { // muro de piedra
  F(g, c1, x, y, w, h);
  for (let r = 0; r < h; r += 4) { F(g, c3, x, y + r, w, 1); for (let k = (r / 4 & 1) * 3; k < w; k += 6) { F(g, c3, x + k, y + r, 1, 4); if (rnd() < .25) F(g, c2, x + k + 1, y + r + 1, 4, 2); } }
}
function pine(snow) {
  const c = mkc(16, 28), g = c.getContext('2d'); F(g, '#4a3322', 7, 21, 2, 7);
  const cols = snow ? ['#2f5a4e', '#3d7360'] : ['#1c4428', '#2c6a3a'];
  for (let k = 0; k < 3; k++) { const y0 = 1 + k * 6, mx = 3 + k * 2; for (let r = 0; r < 9; r++) { const hw = 1 + Math.round(r / 8 * mx); F(g, cols[0], 8 - hw, y0 + r, hw * 2, 1); F(g, cols[1], 8 - hw, y0 + r, Math.max(1, hw - 1), 1); if (snow && r < 3 + (k ? 0 : 1)) F(g, '#eef6ff', 8 - hw + (r > 1 ? 1 : 0), y0 + r, hw * 2 - (r > 1 ? 2 : 0), 1); } }
  return c;
}
function deadTree() {
  const c = mkc(22, 32), g = c.getContext('2d'), k = '#2b2133';
  F(g, k, 10, 14, 3, 18); F(g, k, 9, 28, 5, 4); F(g, k, 7, 10, 2, 6); F(g, k, 5, 6, 2, 5); F(g, k, 13, 9, 2, 6); F(g, k, 15, 4, 2, 6); F(g, k, 11, 3, 2, 12); F(g, k, 3, 3, 2, 4); F(g, k, 17, 1, 2, 4); F(g, '#40335a', 10, 14, 1, 16);
  return c;
}
function crystal(col, hi) { const c = mkc(10, 18), g = c.getContext('2d'); for (let r = 0; r < 16; r++) { const hw = r < 5 ? 1 + r * .8 : 5 - (r - 5) * .35; F(g, col, 5 - hw, r, hw * 2, 1); F(g, hi, 5 - hw, r, 1, 1); } F(g, hi, 3, 3, 1, 6); return c; }
function post(h) { const c = mkc(8, h + 4), g = c.getContext('2d'); F(g, '#3a2c20', 3, 4, 2, h); F(g, '#6a5236', 1, 2, 6, 3); F(g, '#241a14', 2, 4, 4, 1); return c; }
function bench() { const c = mkc(18, 8), g = c.getContext('2d'); F(g, '#6a4a2e', 0, 2, 18, 4); F(g, '#8a6440', 0, 2, 18, 1); F(g, '#3a2818', 1, 6, 2, 2); F(g, '#3a2818', 15, 6, 2, 2); return c; }
function barrel() { const c = mkc(8, 9), g = c.getContext('2d'); F(g, '#6a4a2e', 1, 0, 6, 9); F(g, '#8a6440', 1, 0, 2, 9); F(g, '#2a2030', 1, 2, 6, 1); F(g, '#2a2030', 1, 6, 6, 1); return c; }
function banner(h) { const c = mkc(10, h), g = c.getContext('2d'); F(g, '#3a2c20', 0, 0, 10, 1); F(g, '#1d3f8f', 1, 1, 8, h - 4); F(g, '#2d5cc8', 1, 1, 2, h - 4); for (let i = 0; i < 4; i++) F(g, '#1d3f8f', 1 + i * 2, h - 3 + (i % 2), 2, 2); F(g, '#d8e4ff', 4, 4, 2, 9); F(g, '#d8e4ff', 2, 6, 6, 2); return c; }

function buildScene() {
  seed = 11;
  const sky = mkc(W, H), sg = sky.getContext('2d');
  const stops = [[0, [8, 6, 28]], [.45, [22, 16, 58]], [1, [50, 34, 96]]];
  for (let y = 0; y < H; y += 3) { const t = y / H; let a = stops[0], b = stops[1]; if (t > stops[1][0]) { a = stops[1]; b = stops[2]; } const u = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
    F(sg, 'rgb(' + a[1].map((v, i) => Math.round(v + (b[1][i] - v) * u)).join(',') + ')', 0, y, W, 3); }
  const far = [[18, 122, 16, 5], [368, 116, 16, 5], [22, 24, 14, 4], [364, 22, 16, 5], [356, 226, 18, 6], [128, 248, 10, 3], [270, 246, 12, 4], [28, 240, 12, 4], [340, 170, 10, 3]];
  far.forEach(a => { island(sg, null, a[0], a[1], a[2], a[3], a[3] * 3, 'far', false); F(sg, '#12102c', a[0] - 1, a[1] - a[3] - 7, 3, 6); F(sg, '#ffd36a', a[0], a[1] - a[3] - 5, 1, 1); });
  const world = mkc(W, H), g = world.getContext('2d'), mk = mkc(W, H), m = mk.getContext('2d');
  // islas
  island(g, m, 74, 70, 44, 26, 34, 'snow', true);
  island(g, m, 310, 70, 44, 26, 34, 'dark', true);
  island(g, m, 192, 150, 118, 70, 58, 'grass', true);
  island(g, m, 192, 200, 64, 32, 30, 'grass', true);
  island(g, m, 192, 84, 70, 36, 30, 'grass', true);
  island(g, m, 66, 214, 56, 22, 26, 'sea', false);
  // puentes
  const bridge = (x1, y1, x2, y2) => { const n = Math.hypot(x2 - x1, y2 - y1) | 0; for (let i = 0; i <= n; i++) { const x = x1 + (x2 - x1) * i / n, y = y1 + (y2 - y1) * i / n; F(g, i % 4 < 3 ? '#8a6440' : '#4a3422', x - 3, y - 2, 7, 5); F(g, '#a87c50', x - 3, y - 2, 7, 1); } F(g, '#3a2c20', x1 - 4, y1 - 4, 1, 1); m.strokeStyle = '#fff'; m.lineWidth = 9; m.beginPath(); m.moveTo(x1, y1); m.lineTo(x2, y2); m.stroke(); };
  bridge(112, 76, 134, 86); bridge(272, 76, 252, 86);
  // senderos y plaza
  const path = (pts, r, c1, c2) => { for (let k = 0; k < pts.length - 1; k++) { const a = pts[k], b = pts[k + 1], n = Math.hypot(b[0] - a[0], b[1] - a[1]) | 0; for (let i = 0; i <= n; i++) { const x = a[0] + (b[0] - a[0]) * i / n, y = a[1] + (b[1] - a[1]) * i / n; for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) F(g, rnd() < .2 ? c2 : c1, x + dx, y + dy, 1, 1); } } };
  path([[150, 168], [138, 186], [128, 200]], 4, '#6b5a44', '#7c6a52'); path([[142, 126], [132, 104], [130, 88]], 3, '#6b5a44', '#7c6a52'); path([[242, 126], [252, 104], [254, 88]], 3, '#6b5a44', '#7c6a52');
  const stoneC = ['#6e6a86', '#7f7a98', '#55516a'];
  const cob = (x0, y0, x1, y1, inside) => { for (let y = y0; y < y1; y += 3) for (let x = x0 + ((y / 3 & 1) * 3); x < x1; x += 6) { if (inside && !inside(x + 3, y + 1)) continue; F(g, stoneC[rnd() * 3 | 0], x, y, 5, 2); F(g, '#3c3850', x + 5, y, 1, 3); F(g, '#3c3850', x, y + 2, 6, 1); } };
  cob(184, 52, 200, 122); cob(184, 182, 200, 200);
  cob(130, 116, 254, 190, (x, y) => ((x - 192) / 60) ** 2 + ((y - 152) / 36) ** 2 <= 1);
  // fuente
  const el = (c, x, y, rx, ry) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
  el('#2a2638', 192, 154, 15, 9); el('#8a84a0', 192, 153, 14, 8); el('#2a6cc8', 192, 152, 11, 6); el('#5fb4ff', 192, 151, 8, 4); el('#2160a8', 192, 152, 3, 2);
  // castillo
  brick(g, 164, 4, 56, 46, '#3b3646', '#4a4458', '#2a2634'); brick(g, 150, 12, 18, 38, '#34303f', '#443f52', '#25222f'); brick(g, 216, 12, 18, 38, '#34303f', '#443f52', '#25222f'); brick(g, 176, 0, 32, 8, '#403b4e', '#4f4a60', '#2a2634');
  [[150, 12, 18], [216, 12, 18], [164, 4, 56], [176, 0, 32]].forEach(a => { for (let x = a[0]; x < a[0] + a[2]; x += 6) F(g, '#2a2634', x + 2, a[1] - 3, 3, 3); });
  const win = (x, y, w, h) => { F(g, '#14101c', x - 1, y - 1, w + 2, h + 2); F(g, '#ffd36a', x, y, w, h); F(g, '#fff1b0', x + 1, y + 1, 1, h - 3); };
  win(171, 18, 4, 8); win(209, 18, 4, 8); win(190, 8, 5, 10); win(155, 22, 3, 6); win(225, 22, 3, 6); win(171, 34, 4, 6); win(209, 34, 4, 6);
  F(g, '#0a0812', 183, 29, 18, 21); F(g, '#0a0812', 185, 27, 14, 3); F(g, '#0a0812', 187, 25, 10, 3);
  for (let i = 0; i < 4; i++) { F(g, i % 2 ? '#5a546a' : '#6a647a', 176 - i * 2, 50 + i * 2, 40 + i * 4, 2); }
  g.drawImage(banner(22), 158, 24); g.drawImage(banner(22), 220, 24); g.drawImage(banner(22), 170, 10); g.drawImage(banner(22), 214, 10);
  // cabaña (nieve)
  F(g, '#4a3322', 62, 48, 28, 16); for (let x = 62; x < 90; x += 4) F(g, '#6a4a2e', x, 48, 3, 16); F(g, '#241a14', 62, 62, 28, 2);
  for (let r = 0; r < 12; r++) { F(g, '#6a4030', 59 + (r > 8 ? 0 : 0) + (r >> 1), 38 + r, 34 - (r >> 1) * 2, 1); F(g, '#eef6ff', 59 + (r >> 1), 38 + r, 34 - (r >> 1) * 2, r < 4 ? 2 : 1); }
  F(g, '#ffd36a', 66, 52, 5, 5); F(g, '#14101c', 68, 52, 1, 5); F(g, '#14101c', 66, 54, 5, 1); F(g, '#2a1a10', 78, 53, 6, 11); F(g, '#ffd36a', 82, 58, 1, 1);
  F(g, '#4a3322', 80, 33, 5, 8); F(g, '#eef6ff', 79, 32, 7, 2);
  // ruinas (isla oscura)
  [[296, 36, 6, 28], [320, 40, 6, 24], [308, 24, 4, 14]].forEach(a => { brick(g, a[0], a[1], a[2], a[3], '#3a3548', '#4a4560', '#262234'); });
  F(g, '#3a3548', 296, 34, 30, 4); F(g, '#262234', 296, 38, 30, 1); F(g, '#9a6aff', 299, 44, 2, 6); F(g, '#9a6aff', 323, 46, 2, 5);
  // puerto: ancla de madera
  F(g, '#4a3322', 52, 197, 84, 18); for (let x = 52; x < 136; x += 6) { F(g, '#8a6440', x, 197, 5, 18); F(g, '#a87c50', x, 197, 5, 1); F(g, '#2a1e14', x + 5, 197, 1, 18); }
  F(g, '#4a3422', 56, 215, 4, 12); F(g, '#4a3422', 76, 215, 4, 10); F(g, '#4a3422', 104, 215, 4, 10);
  m.fillStyle = '#fff'; m.fillRect(54, 199, 82, 14);
  for (let k = 0; k < 40; k++) F(g, '#5fb4ff', 14 + rnd() * 34, 204 + rnd() * 26, 3, 1);
  // barco
  for (let r = 0; r < 12; r++) { const w = 38 - Math.abs(r - 0) * 1.2 - (r > 8 ? (r - 8) * 3 : 0); F(g, '#5a3a22', 8 + (r > 8 ? (r - 8) * 1.5 : 0), 214 + r, w, 1); F(g, '#7a5232', 8, 214 + r, 3, 1); }
  F(g, '#3a2418', 8, 214, 38, 2); F(g, '#3a2c20', 27, 186, 3, 30);
  for (let r = 0; r < 22; r++) { const w = 4 + r * 0.8; F(g, '#e8dcc0', 30, 190 + r, w, 1); F(g, '#c8b898', 30, 190 + r, 2, 1); }
  F(g, '#8a2030', 27, 183, 8, 3);
  // fogata (zona social)
  [[186, 214], [198, 214], [192, 218]].forEach(a => { F(g, '#2a2638', a[0] - 3, a[1], 6, 3); F(g, '#6a6484', a[0] - 3, a[1], 6, 1); });
  F(g, '#4a3322', 187, 211, 10, 3); F(g, '#6a4a2e', 189, 209, 6, 3);
  // paisaje: sombra suave bajo las islas
  const walkImg = m.getImageData(0, 0, W, H).data, walk = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) walk[i] = walkImg[i * 4 + 3] > 140 ? 1 : 0;
  for (let y = 0; y < 54; y++) for (let x = 140; x < 246; x++) walk[y * W + x] = 0; // el castillo no se pisa
  // props (árboles y decorado), ordenados por y al dibujar
  const P = [], obst = [];
  const pg = pine(false), ps = pine(true), dt = deadTree(), cp = crystal('#9a6aff', '#d8c0ff'), pst = post(14), bn = bench(), br = barrel();
  const add = (img, x, y, r, extra) => { P.push(Object.assign({ img, x, y }, extra)); if (r) obst.push({ x, y: y - 1, r }); };
  [[84, 138], [96, 150], [106, 128], [92, 166], [112, 160], [78, 152], [120, 140], [124, 178], [262, 138], [276, 150], [286, 128], [270, 166], [296, 156], [304, 144], [258, 182], [244, 196], [150, 192], [146, 100], [238, 100], [142, 74], [244, 74], [172, 190], [212, 190], [158, 132], [228, 132]].forEach(a => add(pg, a[0], a[1], 3));
  [[48, 62], [56, 82], [100, 56], [38, 74], [104, 80], [86, 88], [64, 47]].forEach(a => add(ps, a[0], a[1], 3));
  [[284, 56], [334, 62], [300, 90], [330, 84], [350, 70]].forEach(a => add(dt, a[0], a[1], 3));
  [[330, 54], [344, 78], [282, 70]].forEach(a => add(cp, a[0], a[1], 3, { glow: '154,106,255' }));
  add(bn, 170, 222, 0); add(bn, 214, 222, 0);
  [[116, 210], [120, 202]].forEach(a => add(br, a[0], a[1], 3));
  [[178, 52], [206, 52], [160, 124], [224, 124], [160, 180], [224, 180]].forEach(a => add(pst, a[0], a[1], 2, { torch: 1 }));
  [[58, 212], [132, 212]].forEach(a => add(pst, a[0], a[1], 0, { torch: 1 }));
  // obstáculos fijos
  obst.push({ x: 59, y: 36, w: 34, h: 30 }, { x: 294, y: 22, w: 36, h: 32 }, { x: 52, y: 214, w: 84, h: 3 });
  obst.push({ x: 192, y: 154, r: 14 }, { x: 192, y: 211, r: 6 });
  [[170, 222], [214, 222]].forEach(a => obst.push({ x: a[0] - 8, y: a[1] - 4, w: 16, h: 6 }));
  return { sky, world, walk, props: P, obst, stars: Array.from({ length: 80 }, () => ({ x: rnd() * W, y: rnd() * H * .75, p: rnd() * 6.28, s: .6 + rnd() })), clouds: Array.from({ length: 7 }, () => ({ x: rnd() * W, y: 20 + rnd() * 210, w: 40 + rnd() * 60, v: 2 + rnd() * 4 })) };
}

// ------------------------------------------------------------------ dibujo dinámico
function flame(g, x, y, t, big) {
  const h = (big ? 7 : 4) + Math.sin(t * 13 + x) * 1.2;
  g.globalCompositeOperation = 'lighter'; const r = big ? 26 : 14, gr = g.createRadialGradient(x, y - 3, 1, x, y - 3, r); gr.addColorStop(0, 'rgba(255,170,70,.35)'); gr.addColorStop(1, 'rgba(255,170,70,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r - 3, r * 2, r * 2); g.globalCompositeOperation = 'source-over';
  F(g, '#ff7a2c', x - (big ? 3 : 1), y - h, big ? 6 : 3, h); F(g, '#ffc24a', x - (big ? 2 : 1), y - h * .7, big ? 4 : 2, h * .7); F(g, '#fff1b0', x, y - h * .4, 1, h * .4);
}
function glow(g, x, y, r, rgb, a) { g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); gr.addColorStop(1, 'rgba(' + rgb + ',0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.globalCompositeOperation = 'source-over'; }
// Sprite real del juego (kit 'player' de sprites.js), reducido para la escala de la plaza.
const CHS = .55, scache = {};
function scaled(src, key) {
  let c = scache[key];
  if (!c) { c = mkc(Math.max(1, Math.round(src.width * CHS)), Math.max(1, Math.round(src.height * CHS))); const q = c.getContext('2d'); q.imageSmoothingEnabled = true; q.imageSmoothingQuality = 'high'; q.drawImage(src, 0, 0, c.width, c.height); scache[key] = c; }
  return c;
}
function drawChar(g, x, y, c, fx, fy, mv, t, roll) {
  if (typeof bodyArt !== 'function' || typeof rollArt !== 'function') return drawCharOld(g, x, y, c, fx, fy, mv, t);
  x = Math.round(x); y = Math.round(y);
  const ax = Math.abs(fx), ay = Math.abs(fy), dk = ax > ay ? (fx < 0 ? 'l' : 'r') : (fy < 0 ? 'u' : 'd'), kind = dk === 'd' ? 'd' : dk === 'u' ? 'u' : 's';
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x - 5, y - 1, 10, 2); g.fillRect(x - 3, y - 2, 6, 1); g.fillRect(x - 3, y + 1, 6, 1);
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
  const g = cx_; g.imageSmoothingEnabled = false;
  g.drawImage(sc.sky, 0, 0);
  for (const s of sc.stars) { g.globalAlpha = .35 + .65 * Math.abs(Math.sin(t * s.s + s.p)); F(g, '#dfe4ff', s.x, s.y, 1, 1); } g.globalAlpha = 1;
  g.fillStyle = 'rgba(150,140,220,.10)'; for (const c of sc.clouds) { c.x += c.v * dt; if (c.x - c.w > W) c.x = -c.w; g.beginPath(); g.ellipse(c.x, c.y, c.w, 5, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(c.x - c.w * .3, c.y - 3, c.w * .5, 4, 0, 0, 7); g.fill(); }
  g.drawImage(sc.world, 0, 0);
  // resplandores del mundo
  const pu = .5 + .5 * Math.sin(t * 2.2);
  glow(g, 192, 142, 44, '80,170,255', .22 + .12 * pu); glow(g, 192, 44, 22, '70,150,255', .35 + .2 * pu); glow(g, 68, 54, 14, '255,200,100', .25); glow(g, 312, 40, 40, '150,90,255', .22 + .1 * pu);
  F(g, '#1a4ab8', 186, 36, 12, 14); F(g, '#3a8aff', 188, 38 + (pu * 2 | 0), 8, 12 - (pu * 2 | 0)); F(g, '#bfe4ff', 190, 42, 4, 8);
  // cristal de la fuente
  const cyb = 146 + Math.sin(t * 1.6) * 1.5;
  for (let r = 0; r < 20; r++) { const hw = r < 6 ? 1 + r * .7 : 5 - (r - 6) * .3; F(g, '#7fe0ff', 192 - hw, cyb - 18 + r, hw * 2, 1); F(g, '#d8f6ff', 192 - hw, cyb - 18 + r, 1, 1); }
  F(g, '#ffffff', 191, cyb - 14, 1, 6);
  flame(g, 192, 211, t, true);
  // sprites y personajes ordenados por y
  const dr = [];
  for (const p of sc.props) dr.push({ y: p.y, f: () => { g.drawImage(p.img, Math.round(p.x - p.img.width / 2), Math.round(p.y - p.img.height)); if (p.torch) flame(g, p.x, p.y - p.img.height + 3, t, false); if (p.glow) glow(g, p.x, p.y - 8, 14, p.glow, .3 + .15 * pu); } });
  for (const o of others.values()) dr.push({ y: o.vy, f: () => drawChar(g, o.vx, o.vy, o.c, o.fx, o.fy, o.mv, t) });
  dr.push({ y: me.y, f: () => { drawChar(g, me.x, me.y, HB.id, me.fx, me.fy, me.mv, t, me.roll > 0); } });
  dr.sort((a, b) => a.y - b.y).forEach(d => d.f());
  // texto (resolución del dispositivo)
  const q = tx_, dpr = window.devicePixelRatio || 1, k = S_ * dpr; q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, tc.width, tc.height); q.setTransform(k, 0, 0, k, 0, 0);
  q.textAlign = 'center'; q.textBaseline = 'alphabetic'; q.font = '4.4px ' + FONT;
  const name = (n, x, y, c) => { q.lineWidth = 1.6; q.strokeStyle = 'rgba(5,3,10,.9)'; q.strokeText(n, x, y); q.fillStyle = c; q.fillText(n, x, y); };
  for (const [id, o] of others) { name(o.n, o.vx, o.vy - 25, ACC[o.c % 6]); bubble(q, id, o.vx, o.vy - 30); }
  name(HB.name || 'Tú', me.x, me.y - 25, '#ffe66d'); bubble(q, HB.id, me.x, me.y - 30);
  prompt_();
}
function bubble(q, id, x, y) {
  const b = bub[id]; if (!b) return; if (performance.now() - b.t > 6000) { delete bub[id]; return; }
  let s = b.m.length > 34 ? b.m.slice(0, 33) + '…' : b.m; q.font = '4px ' + FONT; const w = q.measureText(s).width + 5;
  q.fillStyle = 'rgba(11,7,20,.88)'; q.fillRect(x - w / 2, y - 7, w, 8); q.strokeStyle = '#c9a54a'; q.lineWidth = .5; q.strokeRect(x - w / 2, y - 7, w, 8); q.fillStyle = '#fff'; q.fillText(s, x, y - 1.2); q.font = '4.4px ' + FONT;
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
    const sp = 125 * dt; let ok = false;
    for (const a of [0, .6, -.6]) { const c = Math.cos(a), s = Math.sin(a), vx = me.rx * c - me.ry * s, vy = me.rx * s + me.ry * c, nx = me.x + vx * sp, ny = me.y + vy * sp; if (walkable(nx, ny)) { me.x = nx; me.y = ny; ok = true; break; } }
    if (!ok) me.roll = 0; if (me.roll <= 0) me.mv = false; return;
  }
  let dx = 0, dy = 0; if (keys.l) dx--; if (keys.r) dx++; if (keys.u) dy--; if (keys.d) dy++;
  if (!(dx || dy) && typeof joy !== 'undefined' && joy.on) { dx = joy.x; dy = joy.y; } // joystick táctil o stick del mando (analógico)
  if (!(dx || dy) && typeof held !== 'undefined') { dx = (held.right ? 1 : 0) - (held.left ? 1 : 0); dy = (held.down ? 1 : 0) - (held.up ? 1 : 0); } // cruceta del mando
  if (dx || dy) { me.tx = null; me.goal = null; }
  else if (me.tx !== null) { const ex = me.tx - me.x, ey = me.ty - me.y, d = Math.hypot(ex, ey); if (d < 2.5) { me.tx = null; arrive(); } else { dx = ex / d; dy = ey / d; } }
  me.mv = false; if (!(dx || dy) || HB.panel) { if (HB.panel) me.tx = null; return; }
  const l = Math.hypot(dx, dy), sp = 58 * dt * Math.min(1, l); dx /= l; dy /= l; let moved = false;
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
let cx_ = null, tx_ = null, tc = null;
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
  say('Conectando al servidor global… si estaba dormido puede tardar hasta 1 minuto', 1);
  try { localStorage.setItem('jur_mp_url', v.url); localStorage.setItem('jur_mp_name', v.name); } catch (er) {}
  try { await NET.openSocket(v.url, 0, 70000); } catch (er) { return say(er.message + ' · revisa la dirección y que el servidor esté encendido'); }
  const w = NET.ws, prev = w.onclose; HB.ws = w;
  w.onclose = ev => { if (prev) prev(ev); if (HB.ws === w && !NET.on) { stopHub(); toast_('Conexión perdida con el servidor global'); window.netLobby && window.netLobby(); } };
  send({ t: 'hub', n: HB.name });
  clearTimeout(HB.wt); HB.wt = setTimeout(() => { // el servidor viejo no conoce el lobby y nunca contesta
    if (HB.on || HB.ws !== w) return; HB.ws = null; w.onclose = null; try { w.close(); } catch (er) {} NET.ws = null;
    say('Conectó, pero el servidor no responde al lobby: tiene la versión vieja. Sube el nuevo server/server.js a Render y reintenta.');
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
#hbstage{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}#hubr canvas{position:absolute;left:0;top:0;width:100%;height:100%;image-rendering:pixelated;background:transparent!important;border:0!important;box-shadow:none!important}#hbc{background:#05030a!important}#hbt{image-rendering:auto!important;pointer-events:none}
.hbl{position:absolute;transform:translate(-50%,-50%);text-align:center;padding:.35em .8em;background:rgba(8,6,18,.82);border:1px solid #c9a54a;border-radius:6px;white-space:nowrap;cursor:pointer;font-size:max(8px,calc(var(--s)*3.3px));line-height:1.25;box-shadow:0 0 10px rgba(0,0,0,.6)}
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
@media (max-height:480px){#hbleg,#hbcomp{display:none}#hbtitle em{display:none!important}#hbln .ln:not(:nth-last-child(-n+2)){display:none}#hbchat{width:min(260px,40vw)}}`;
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
  const L = $('hbl'); L.innerHTML = HS.map(h => '<div class="hbl" data-h="' + h.id + '" style="left:' + h.lx / W * 100 + '%;top:' + h.ly / H * 100 + '%"><b>' + h.t + '</b><i>' + h.s + '</i></div>').join('');
  const stg = $('hbstage');
  const aim = e => { const r = $('hbc').getBoundingClientRect(); return [(e.clientX - r.left) / S_, (e.clientY - r.top) / S_]; };
  let down = false;
  stg.addEventListener('pointerdown', e => { if (HB.panel) return; const lb = e.target.closest && e.target.closest('.hbl'); if (lb) { const h = hsOf(lb.dataset.h); me.goal = h.id; me.tx = h.px; me.ty = h.py; if (Math.hypot(me.x - h.px, me.y - h.py) < 3) arrive(); return; } down = true; const a = aim(e); me.tx = a[0]; me.ty = a[1]; me.goal = null; });
  stg.addEventListener('pointermove', e => { if (!down) return; const a = aim(e); me.tx = a[0]; me.ty = a[1]; });
  addEventListener('pointerup', () => { down = false; }); addEventListener('pointercancel', () => { down = false; });
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
  if (!root) return; S_ = Math.min(innerWidth / W, innerHeight / H); const s = $('hbstage'), w = Math.floor(W * S_), h = Math.floor(H * S_); S_ = w / W;
  s.style.width = w + 'px'; s.style.height = h + 'px'; s.style.setProperty('--s', S_); const dpr = window.devicePixelRatio || 1; tc.width = Math.round(w * dpr); tc.height = Math.round(h * dpr);
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
    if (c === 'help') return sys('Comandos: /help · /who (quién hay) · /salir (volver al menú). Toca el suelo para caminar o usa WASD; Enter para chatear.');
    if (c === 'who') return sys('En línea: ' + HB.online + ' · En el lobby: ' + (others.size + 1) + ' (' + [HB.name].concat([...others.values()].map(o => o.n)).join(', ') + ')');
    if (c === 'salir') { stopHub(false); return window.netLobby && window.netLobby(); }
    return sys('Comando desconocido. Escribe /help');
  }
  send({ t: 'hc', m: t });
}
function showHub() {
  clearTimeout(HB.wt); build(); document.body.classList.add('hub'); { const m = $('menu'); if (m && m.style.display && m.style.display !== 'none') { HB.mprev = m.style.display; m.style.display = 'none'; } } HB.on = true; HB.err = ''; HB.panel = ''; root.style.display = 'block'; if (NET.hideLobby) NET.hideLobby(); fit();
  if (!sc) sc = buildScene();
  me.x = 192; me.y = 176; me.tx = null; me.goal = null; for (const k in keys) keys[k] = 0;
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
    const ev = id === 'events';
    h = '<h2>' + (ev ? 'MISIONES / EVENTOS' : 'SALA DE JUEGOS') + '</h2><div class="tw">' + (ev ? 'Aquí aparecerán las misiones cooperativas y los eventos del servidor.' : 'Aquí vivirán el PvP y los minijuegos.') + '<br><br><b style="color:#ffe66d">Próximamente</b></div>' + close;
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
