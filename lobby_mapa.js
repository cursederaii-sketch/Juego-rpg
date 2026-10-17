// ===== MAPA DEL LOBBY · mundo pixel-art generado por código (sin imágenes) =====
// Lo usa lobby.js:  const M = window.LOBBYMAP;  sc = M.build();
(function () {
'use strict';
const W = 768, H = 512;
let seed = 11; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const F = (g, c, x, y, w, h) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
const H2 = (x, y, s) => { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 1274126177); h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; };
function vn(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = H2(xi, yi, s), b = H2(xi + 1, yi, s), c = H2(xi, yi + 1, s), d = H2(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
const fbm = (x, y, s) => vn(x * .045, y * .045, s) * .55 + vn(x * .11, y * .11, s + 1) * .3 + vn(x * .27, y * .27, s + 2) * .15;
const cl = (v, a, b) => v < a ? a : v > b ? b : v;
const _pk = {};
function pk(c, a) { const k = c + (a == null ? '' : a); let v = _pk[k]; if (v !== undefined) return v; const n = parseInt(c.slice(1), 16); v = (((a == null ? 255 : a) << 24) | ((n & 255) << 16) | (n & 0xff00) | (n >> 16 & 255)) >>> 0; return _pk[k] = v; }
const hx = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mixc = (a, b, t) => { const p = hx(a), q = hx(b); return '#' + [0, 1, 2].map(i => Math.round(p[i] + (q[i] - p[i]) * t).toString(16).padStart(2, '0')).join(''); };

// ------------------------------------------------------------------ paletas
const PAL = {
  grass: { top: ['#223f2a', '#2a4f31', '#325d37', '#3a6b3c', '#467c42'], hi: '#7fb862', lipHi: '#5f9a4c', lipLo: '#14281a', rock: ['#8a7a82', '#6a5c6c', '#51445a', '#3b3248', '#282036'], vine: ['#2f6a38', '#4a9a48'] },
  snow: { top: ['#b4c6de', '#c6d6ea', '#d8e5f3', '#e8f1fa', '#f6fafe'], hi: '#ffffff', lipHi: '#f4f9ff', lipLo: '#6f86a8', rock: ['#8c92b0', '#6c7396', '#525a7c', '#3c4262', '#292d48'], vine: ['#cfe3f8', '#ffffff'] },
  dark: { top: ['#1e1934', '#262040', '#2e2750', '#373060', '#413a72'], hi: '#8a6ae0', lipHi: '#7358c8', lipLo: '#120e22', rock: ['#6a5890', '#52447a', '#3e3262', '#2c2348', '#1d1632'], vine: ['#6a3ad0', '#b48aff'] },
  red: { top: ['#1f0d11', '#2a1318', '#351820', '#411e22', '#522822'], hi: '#c0583a', lipHi: '#a8442c', lipLo: '#12080a', rock: ['#6a3a3a', '#522a2c', '#3c1e22', '#2a1418', '#1c0c10'], vine: ['#ff6a2a', '#ffc24a'] },
  sea: { top: ['#0e2e60', '#123a78', '#164a94', '#1c5aaa', '#2a70c0'], hi: '#8ad0ff', lipHi: '#6ab8f0', lipLo: '#0a1c3c', rock: ['#8a7a82', '#6a5c6c', '#51445a', '#3b3248', '#282036'], vine: ['#2f6a38', '#4a9a48'] },
  far: { top: ['#171540', '#1d1a52', '#232064', '#2a2678', '#322e8a'], hi: '#4a44a8', lipHi: '#3c3898', lipLo: '#0e0c2a', rock: ['#2a2670', '#221e5c', '#1a1648', '#141036', '#0e0c26'], vine: ['#1a1648', '#221e5c'] }
};
const FLOWERS = ['#ffe66d', '#ff9ac8', '#ffffff', '#9ad0ff', '#ffb070'];

// ------------------------------------------------------------------ isla: acantilado + superficie con textura
// ells: [{cx,cy,rx,ry,dp}]  (cx,cy = centro de la superficie).  Devuelve máscara de la superficie.
function landmass(bd, th, ells, sd) {
  const P = PAL[th], top = new Uint8Array(W * H), own = new Uint8Array(W * H); sd = sd || 1;
  const tm = (x, y) => x >= 0 && y >= 0 && x < W && y < H && top[y * W + x] === 1;
  // superficie
  ells.forEach((e, k) => {
    const y0 = Math.max(0, Math.floor(e.cy - e.ry * 1.3)), y1 = Math.min(H - 1, Math.ceil(e.cy + e.ry * 1.3)), x0 = Math.max(0, Math.floor(e.cx - e.rx * 1.3)), x1 = Math.min(W - 1, Math.ceil(e.cx + e.rx * 1.3));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const d0 = ((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2; if (d0 > 1.2) continue; if (d0 < .84) { top[y * W + x] = 1; continue; }
      if (d0 + (fbm(x, y, sd * 7 + k) - .5) * (e.wob == null ? .42 : e.wob) < 1) top[y * W + x] = 1;
    }
  });
  // acantilado
  ells.forEach((e, k) => {
    for (let x = Math.max(0, Math.floor(e.cx - e.rx)); x <= Math.min(W - 1, Math.ceil(e.cx + e.rx)); x++) {
      const u = (x - e.cx) / e.rx; if (Math.abs(u) >= 1) continue;
      let yb = -1; for (let y = Math.min(H - 1, Math.ceil(e.cy + e.ry * 1.2)); y >= Math.floor(e.cy); y--) if (top[y * W + x]) { yb = y; break; }
      if (yb < 0) continue;
      const q = 1 - u * u; let dep = e.dp * Math.pow(q, .6) * (.8 + .4 * vn(x * .07, e.cx * .1 + k, 7));
      dep += (H2(x >> 1, e.cy, 2) < .1 ? 5 + H2(x, e.cx, 3) * 9 : 0) * q;
      const ym = Math.min(H - 1, Math.floor(yb + dep));
      for (let y = yb - 3; y <= ym; y++) {
        const t = (y - yb) / Math.max(1, dep);
        const s = vn(x * .05, y * .42, 11 + sd) * 1.4 + (H2(x, y, 12) - .5) * .45;
        let i = Math.floor(t * 2.4 + (s - .7) * 1.3 + (H2(x >> 2, e.cx, 14) - .5) * 1.5 + (x < e.cx ? -.3 : .3));
        if (H2(x >> 1, 0, 13) < .07 && t > .15) i++;
        if (t < .06) i = Math.max(i, 3); // sombra bajo el borde
        if (Math.abs(u) > .93) i += x < e.cx ? -1 : 1;
        i = cl(i, 0, 4); let c = P.rock[i];
        if (th === 'grass' && t < .1 && H2(x, y, 24) < .8) c = H2(x, y, 25) < .5 ? '#4a3626' : '#5a4430';
        if ((th === 'grass' || th === 'sea') && t < .3 && vn(x * .09, y * .3, 21) > .56 && H2(x, y, 22) < .8) c = H2(x, y, 23) < .5 ? '#2f6034' : '#3b7a3e';
        if (th === 'red' && t > .1 && vn(x * .12, y * .5, 31) > .8 && H2(x, y, 32) < .9) c = H2(x, y, 33) < .5 ? '#c8461c' : '#ff7a2c';
        if (th === 'dark' && t > .1 && vn(x * .1, y * .5, 41) > .82) c = '#8a5aff';
        let a = 255; if (t > .9 && H2(x, y, 5) < .5) a = 200;
        bd[y * W + x] = pk(c, a); own[y * W + x] = 1;
      }
      // enredaderas / carámbanos / raíces
      if (H2(x, e.cy, 9) < (th === 'far' ? 0 : .16)) {
        const L = 3 + H2(x, e.cx, 10) * (th === 'red' ? 16 : 13) | 0;
        for (let j = 0; j < L; j++) { const yy = yb + j; if (yy >= H) break; bd[yy * W + x] = pk(P.vine[j > L * .55 || (th === 'snow' && j > L * .4) ? 1 : 0]); own[yy * W + x] = 1; if (j % 3 === 1 && (th === 'grass' || th === 'sea')) { const lx = x + (j & 2 ? 1 : -1); bd[yy * W + lx] = pk(P.vine[1]); own[yy * W + lx] = 1; } }
      }
    }
  });
  // superficie: color y borde
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (!top[i]) continue; own[i] = 1;
    let c;
    if (!tm(x, y + 1)) c = P.lipLo;
    else if (!tm(x, y - 1) || !tm(x - 1, y) || !tm(x + 1, y)) c = P.lipHi;
    else if (!tm(x, y - 2) || !tm(x - 2, y)) c = P.hi;
    else {
      const n = vn(x * .05, y * .05, sd * 5 + 1) * .3 + vn(x * .13, y * .13, sd * 5 + 2) * .4 + vn(x * .31, y * .31, sd * 5 + 3) * .3 + (H2(x, y, 1) - .5) * .12; let k = n < .36 ? 0 : n < .45 ? 1 : n < .55 ? 2 : n < .64 ? 3 : 4;
      if (!tm(x, y + 3) || !tm(x, y + 2)) k = Math.max(0, k - 1); else if (!tm(x, y - 4) || !tm(x - 4, y)) k = Math.min(4, k + 1);
      c = P.top[k];
      const r = H2(x, y, 3);
      if (th === 'grass') {
        if (r < .004) c = FLOWERS[(H2(x, y, 4) * 5) | 0]; else if (r < .05) c = P.top[Math.min(4, k + 1)]; else if (r < .075 && k > 1) { bd[(y - 1) * W + x] = pk(P.top[Math.min(4, k + 1)]); }
      } else if (th === 'snow') { if (r < .012) c = '#ffffff'; else if (r < .05) c = P.top[Math.min(4, k + 1)]; }
      else if (th === 'dark') { if (r < .003) c = '#b48aff'; else if (r < .04) c = P.top[Math.max(0, k - 1)]; }
      else if (th === 'red') { if (r < .006) c = '#ff7a2c'; else if (r < .04) c = P.top[Math.max(0, k - 1)]; }
    }
    bd[i] = pk(c);
  }
  // contorno oscuro
  const oc = pk(th === 'far' ? '#0a0818' : '#0a0716');
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (own[i] || bd[i]) continue;
    if ((x > 0 && own[i - 1]) || (x < W - 1 && own[i + 1]) || (y > 0 && own[i - W]) || (y < H - 1 && own[i + W])) bd[i] = oc;
  }
  return top;
}

// ------------------------------------------------------------------ cielo
function buildSky() {
  const sky = mkc(W, H), sg = sky.getContext('2d');
  const gr = sg.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#05031a'); gr.addColorStop(.3, '#0f0b3e'); gr.addColorStop(.62, '#241a68'); gr.addColorStop(1, '#4a3494'); sg.fillStyle = gr; sg.fillRect(0, 0, W, H);
  const blob = (x, y, r, rgb, a) => { const q = sg.createRadialGradient(x, y, 1, x, y, r); q.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); q.addColorStop(1, 'rgba(' + rgb + ',0)'); sg.fillStyle = q; sg.fillRect(x - r, y - r, r * 2, r * 2); };
  blob(110, 250, 160, '90,60,200', .22); blob(660, 230, 170, '60,90,220', .18); blob(384, 60, 190, '70,90,230', .16); blob(384, 470, 260, '120,70,200', .3); blob(40, 460, 140, '40,100,220', .22); blob(730, 470, 150, '210,70,60', .18);
  // luna
  const mx = 62, my = 34; blob(mx, my, 46, '170,190,255', .35);
  sg.fillStyle = '#dfe8ff'; sg.beginPath(); sg.arc(mx, my, 12, 0, 7); sg.fill(); sg.fillStyle = '#b8c6ee'; sg.beginPath(); sg.arc(mx + 4, my + 2, 9, 0, 7); sg.fill(); sg.fillStyle = '#f4f8ff'; sg.beginPath(); sg.arc(mx - 3, my - 3, 6, 0, 7); sg.fill();
  sg.fillStyle = '#a8b6e0'; [[mx + 4, my + 5, 2], [mx - 4, my + 3, 1.5], [mx + 7, my - 3, 1.2]].forEach(a => { sg.beginPath(); sg.arc(a[0], a[1], a[2], 0, 7); sg.fill(); });
  // islas lejanas
  const fb = new Uint32Array(W * H);
  const far = [[26, 214, 20, 7, 20], [742, 196, 22, 8, 22], [30, 360, 16, 5, 16], [738, 352, 18, 6, 18], [250, 22, 16, 5, 14], [520, 20, 18, 6, 16], [120, 492, 20, 6, 18], [650, 500, 20, 6, 16], [300, 500, 12, 4, 10], [470, 502, 14, 4, 12]];
  far.forEach((a, k) => landmass(fb, 'far', [{ cx: a[0], cy: a[1], rx: a[2], ry: a[3], dp: a[4], wob: .2 }], 30 + k));
  const fc = mkc(W, H); fc.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(fb.buffer), W, H), 0, 0); sg.drawImage(fc, 0, 0);
  [[26, 214, 20, 7], [742, 196, 22, 8], [738, 352, 18, 6], [30, 360, 16, 5]].forEach((a, k) => { // torrecillas lejanas
    const x = a[0], y = a[1] - a[3] - 2; F(sg, '#0e0c2e', x - 3, y - 14, 6, 14); F(sg, '#0e0c2e', x - 4, y - 16, 8, 3); F(sg, '#0e0c2e', x - 1, y - 20, 2, 5); F(sg, '#ffd36a', x, y - 9, 1, 2);
    F(sg, '#0e0c2e', x + 7, y - 6, 4, 6); F(sg, '#0e0c2e', x - 9, y - 4, 3, 4);
  });
  // barco volador lejano
  F(sg, '#0e0c2e', 560, 4, 16, 3); F(sg, '#0e0c2e', 566, -4, 2, 8); F(sg, '#1c1a52', 568, -2, 6, 6);
  // nubes bajas (pixeladas)
  const cc = mkc(W / 3 | 0, H / 3 | 0), cg = cc.getContext('2d');
  const puff = (x, y, rx, ry, a, col) => { cg.fillStyle = 'rgba(' + col + ',' + a + ')'; cg.beginPath(); cg.ellipse(x, y, rx, ry, 0, 0, 7); cg.fill(); };
  seed = 77;
  for (let k = 0; k < 70; k++) { const bx = rnd() < .5 ? rnd() * 90 : 166 + rnd() * 90, by = 120 + rnd() * 52; puff(bx, by + 2, 14 + rnd() * 16, 5 + rnd() * 5, .5, '84,66,170'); puff(bx - 2, by - 1, 10 + rnd() * 12, 3 + rnd() * 4, .45, '150,130,220'); }
  for (let k = 0; k < 36; k++) { const bx = rnd() * 256, by = 150 + rnd() * 22; puff(bx, by, 12 + rnd() * 20, 4 + rnd() * 5, .55, '96,76,190'); puff(bx - 1, by - 2, 8 + rnd() * 14, 2.5 + rnd() * 3, .5, '168,148,236'); }
  for (let k = 0; k < 18; k++) { const bx = rnd() * 256, by = 40 + rnd() * 90; puff(bx, by, 10 + rnd() * 16, 2 + rnd() * 3, .12, '170,150,240'); }
  sg.imageSmoothingEnabled = false; sg.drawImage(cc, 0, 0, W, H);
  return sky;
}

// ------------------------------------------------------------------ adoquines y senderos (sobre el buffer del terreno)
const ST = { st: ['#5d5974', '#6a6584', '#575270', '#76708f'], mort: '#2c2839', hi: '#8c86aa' };
const STR = { st: ['#7a7494', '#8a84a6', '#6f6988', '#9690b2'], mort: '#35314a', hi: '#aaa4c4' };
function cobPx(x, y, pal, salt) {
  const row = Math.floor(y / 5), off = (row & 1) * 5, bx = Math.floor((x + off) / 10), lx = (x + off) % 10, ly = y % 5;
  if (ly === 4 || lx === 9) return pal.mort;
  if (ly === 0 || lx === 0) return pal.hi;
  return pal.st[(H2(bx, row, salt) * pal.st.length) | 0];
}
function dirtPx(x, y) { const r = H2(x, y, 51); return r < .08 ? '#a89870' : r < .3 ? '#8a7556' : r < .6 ? '#7a6648' : r < .8 ? '#9a8564' : '#6a5a40'; }


// ------------------------------------------------------------------ luces y llamas
const _gc = {};
function glowSpr(r, rgb) { const k = r + '|' + rgb; if (_gc[k]) return _gc[k]; const c = mkc(r * 2, r * 2), q = c.getContext('2d'), gr = q.createRadialGradient(r, r, 0, r, r, r); gr.addColorStop(0, 'rgba(' + rgb + ',1)'); gr.addColorStop(.35, 'rgba(' + rgb + ',.4)'); gr.addColorStop(1, 'rgba(' + rgb + ',0)'); q.fillStyle = gr; q.fillRect(0, 0, r * 2, r * 2); return _gc[k] = c; }
function glow(g, x, y, r, rgb, a) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a; g.drawImage(glowSpr(r, rgb), Math.round(x - r), Math.round(y - r)); g.restore(); }
const FL = { warm: ['#ff7a2c', '#ffc24a', '#fff1b0', '255,160,70'], red: ['#c8281e', '#ff5a2a', '#ffc070', '255,70,40'], blue: ['#3a6aff', '#7ac0ff', '#e8f4ff', '90,150,255'], vio: ['#8a3aff', '#c08aff', '#f0e0ff', '150,90,255'] };
function flame(g, x, y, t, sz, k) {
  const P = FL[k || 'warm'], s = sz || 1, h = (4 + 3 * s) + Math.sin(t * 13 + x * 3) * 1.2 * s + Math.sin(t * 7.3 + y) * .8, w = 2 + s * 2;
  glow(g, x, y - h * .5, 12 + s * 14, P[3], .5 + .1 * Math.sin(t * 9 + x));
  F(g, P[0], x - w / 2, y - h, w, h); F(g, P[0], x - w / 2 - 1, y - h * .45, w + 2, h * .45);
  F(g, P[1], x - w / 2 + 1, y - h * .85, Math.max(1, w - 2), h * .85); F(g, P[2], x - 1, y - h * .5, Math.max(1, s), h * .5);
  if (s > 1) { const tt = Math.sin(t * 11 + x) * 2; F(g, P[1], x - 5 + tt, y - h * .6, 2, h * .5); F(g, P[1], x + 4 - tt, y - h * .5, 2, h * .45); }
}

// ------------------------------------------------------------------ sprites con contorno
function outline(c, col, ex) {
  const w = c.width + 2, h = c.height + 2, o = mkc(w, h), q = o.getContext('2d'); q.drawImage(c, 1, 1);
  const d = q.getImageData(0, 0, w, h), a = d.data, src = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) src[i] = a[i * 4 + 3] > 40 ? 1 : 0;
  const cc = hx(col || '#0b0716');
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (src[i]) continue; if ((x > 0 && src[i - 1]) || (x < w - 1 && src[i + 1]) || (y > 0 && src[i - w]) || (y < h - 1 && src[i + w])) { a[i * 4] = cc[0]; a[i * 4 + 1] = cc[1]; a[i * 4 + 2] = cc[2]; a[i * 4 + 3] = 235; } }
  q.putImageData(d, 0, 0); return o;
}
function pine(h, snow, sd) {
  const w = Math.round(h * .62), c = mkc(w, h), g = c.getContext('2d'), T = 4, cx = w / 2;
  const cols = snow ? ['#3c7a64', '#2c6050', '#1c4438'] : ['#3a8a50', '#27663a', '#184a2a'];
  F(g, '#3a2818', cx - 2, h - Math.round(h * .16), 4, Math.round(h * .16)); F(g, '#5a4028', cx - 2, h - Math.round(h * .16), 1, Math.round(h * .16));
  for (let k = T - 1; k >= 0; k--) {
    const y0 = Math.round(k * h * .19), th = Math.round(h * .36), hw = (w / 2 - 1) * (.42 + .58 * (k + 1) / T);
    for (let r = 0; r < th; r++) {
      const f = Math.pow(r / (th - 1), .85), half = Math.max(1, hw * f + (H2(r, k, sd + 3) - .5) * 1.4), x0 = Math.round(cx - half), ww = Math.round(half * 2), y = y0 + r;
      F(g, cols[1], x0, y, ww, 1); F(g, cols[0], x0, y, Math.max(1, Math.round(ww * .4)), 1); F(g, cols[2], x0 + Math.round(ww * .72), y, Math.max(1, Math.round(ww * .28)), 1);
      if (r % 5 === 4) { F(g, cols[2], x0 + 1, y, ww - 2, 1); }
      if (snow && r < 2 + (k === 0 ? 3 : 1)) F(g, r < 1 ? '#ffffff' : '#dfeaf8', x0 + (r > 0 ? 1 : 0), y, ww - (r > 0 ? 2 : 0), 1);
    }
  }
  return outline(c, snow ? '#10261f' : '#0a2014');
}
function oak(h, sd) {
  const w = Math.round(h * .95), c = mkc(w, h), g = c.getContext('2d', { willReadFrequently: true }), cx = w / 2, ch = Math.round(h * .72);
  F(g, '#3a2818', cx - 3, ch - 6, 6, h - ch + 6); F(g, '#5a4028', cx - 3, ch - 6, 2, h - ch + 6); F(g, '#241810', cx - 4, h - 3, 8, 3);
  const bl = [[0, 0, .46], [-.3, .08, .34], [.3, .08, .34], [-.16, -.2, .3], [.18, -.18, .3], [0, .2, .3]].map(b => [cx + b[0] * w, ch * .52 + b[1] * ch, b[2] * w * .5 + 1]);
  const lx = cx - w * .22, ly = ch * .22;
  for (let y = 0; y < ch; y++) for (let x = 0; x < w; x++) {
    let inn = false; for (const b of bl) if ((x - b[0]) ** 2 + (y - b[1]) ** 2 <= b[2] ** 2 * (1 + (H2(x, y, sd + 1) - .5) * .35)) { inn = true; break; } if (!inn) continue;
    const dl = Math.hypot(x - lx, y - ly) / (w * .62), v = dl + (H2(x, y, sd + 2) - .5) * .28; const k = v < .28 ? 0 : v < .52 ? 1 : v < .8 ? 2 : 3;
    F(g, ['#5ab45a', '#3f9446', '#2c7038', '#1e5230'][k], x, y, 1, 1);
  }
  for (let k = 0; k < w * 1.2; k++) { const x = H2(k, 1, sd) * w | 0, y = H2(k, 2, sd) * ch | 0, p = g.getImageData(x, y, 1, 1).data; if (p[3] > 200) F(g, '#86d27a', x, y, 2, 1); }
  return outline(c, '#0a2014');
}
function bush(w, fl) {
  const h = Math.round(w * .62), c = mkc(w, h), g = c.getContext('2d', { willReadFrequently: true });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const d = ((x - w / 2 + .5) / (w / 2)) ** 2 + ((y - h * .62) / (h * .62)) ** 2 + (H2(x, y, 5) - .5) * .25; if (d > 1) continue; const v = Math.hypot(x - w * .35, y - h * .3) / w + (H2(x, y, 6) - .5) * .25; F(g, v < .22 ? '#5ab45a' : v < .42 ? '#3f9446' : v < .62 ? '#2c7038' : '#1e5230', x, y, 1, 1); }
  if (fl) for (let k = 0; k < w / 3; k++) { const x = 2 + H2(k, 7, w) * (w - 5) | 0, y = 2 + H2(k, 8, w) * (h - 5) | 0; if (g.getImageData(x, y, 1, 1).data[3] > 200) F(g, fl[k % fl.length], x, y, 1, 1); }
  return outline(c, '#0a2014');
}
function deadTree(h) {
  const w = Math.round(h * .8), c = mkc(w, h), g = c.getContext('2d'), k = ['#2b2133', '#40335a', '#1a1424'], cx = w / 2;
  F(g, k[0], cx - 2, h * .35, 5, h * .65); F(g, k[1], cx - 2, h * .35, 1, h * .65); F(g, k[0], cx - 4, h - 4, 9, 4);
  const br = [[-1, .5, 12, .3], [1, .42, 14, .35], [-1, .3, 10, .28], [1, .22, 9, .22], [0, .1, 8, .12]];
  br.forEach(b => { let x = cx, y = h * b[1]; for (let i = 0; i < b[2]; i++) { x += b[0] * .8; y -= .6 + (i % 3 === 0 ? .5 : 0); F(g, k[0], x, y, 2, 2); if (i % 2 === 0) F(g, k[1], x, y, 1, 1); if (i > 4 && i % 4 === 0) F(g, k[0], x + b[0] * 2, y - 3, 1, 3); } });
  F(g, k[0], cx - 1, 2, 3, h * .35);
  return outline(c, '#0a0612');
}
function crystal(h, col, hi) {
  const w = Math.round(h * .55), c = mkc(w, h), g = c.getContext('2d'), cx = w / 2;
  for (let r = 0; r < h; r++) { const f = r / h, hw = f < .35 ? 1 + f / .35 * (w / 2 - 2) : (w / 2 - 1) * (1 - (f - .35) / .65 * .55); F(g, col, cx - hw, r, hw * 2, 1); F(g, hi, cx - hw, r, Math.max(1, hw * .5), 1); F(g, mixc(col, '#000000', .35), cx + hw * .45, r, Math.max(1, hw * .55), 1); }
  F(g, '#ffffff', cx - 2, h * .25, 1, h * .3);
  return outline(c, '#120a24');
}
function lamp() {
  const c = mkc(12, 34), g = c.getContext('2d'); F(g, '#2a2638', 5, 8, 2, 26); F(g, '#46405c', 5, 8, 1, 26); F(g, '#2a2638', 3, 31, 6, 3); F(g, '#46405c', 3, 31, 6, 1);
  F(g, '#2a2638', 2, 6, 8, 2); F(g, '#fff1b0', 3, 0, 6, 6); F(g, '#ffd36a', 3, 3, 6, 3); F(g, '#2a2638', 3, 0, 6, 1); F(g, '#2a2638', 2, 0, 1, 6); F(g, '#2a2638', 9, 0, 1, 6); F(g, '#2a2638', 4, -0, 4, 1);
  return outline(c, '#0b0716');
}
function brazier() {
  const c = mkc(16, 24), g = c.getContext('2d'); F(g, '#3a3650', 5, 12, 6, 12); F(g, '#55506c', 5, 12, 2, 12); F(g, '#2a2638', 3, 22, 10, 2); F(g, '#2a2638', 2, 8, 12, 4); F(g, '#55506c', 2, 8, 12, 1); F(g, '#1a1424', 3, 12, 10, 1);
  return outline(c, '#0b0716');
}
function bench(w) {
  w = w || 24; const c = mkc(w, 12), g = c.getContext('2d'); F(g, '#8a6440', 0, 0, w, 3); F(g, '#a87c50', 0, 0, w, 1); F(g, '#5a4028', 0, 4, w, 3); F(g, '#a87c50', 0, 4, w, 1); F(g, '#3a2818', 2, 7, 3, 5); F(g, '#3a2818', w - 5, 7, 3, 5); F(g, '#5a4028', 1, 3, 2, 4); F(g, '#5a4028', w - 3, 3, 2, 4);
  return outline(c, '#120a06');
}
function barrel() { const c = mkc(12, 14), g = c.getContext('2d'); F(g, '#6a4a2e', 1, 1, 10, 12); F(g, '#8a6440', 1, 1, 3, 12); F(g, '#4a3220', 8, 1, 3, 12); F(g, '#2a2030', 1, 4, 10, 1); F(g, '#2a2030', 1, 9, 10, 1); F(g, '#8a6440', 2, 0, 8, 2); F(g, '#3a2818', 3, 0, 6, 1); return outline(c, '#120a06'); }
function crate() { const c = mkc(14, 13), g = c.getContext('2d'); F(g, '#7a5836', 0, 0, 14, 13); F(g, '#a07a48', 0, 0, 14, 1); F(g, '#4a3220', 0, 12, 14, 1); F(g, '#5a4028', 1, 1, 2, 11); F(g, '#5a4028', 11, 1, 2, 11); F(g, '#5a4028', 1, 5, 12, 2); F(g, '#a07a48', 1, 5, 12, 1); return outline(c, '#120a06'); }
function stump(w) { w = w || 12; const c = mkc(w, 12), g = c.getContext('2d'); F(g, '#5a4028', 0, 3, w, 8); F(g, '#7a5836', 0, 3, 3, 8); F(g, '#3a2818', w - 3, 3, 3, 8); g.fillStyle = '#a07a48'; g.beginPath(); g.ellipse(w / 2, 3, w / 2, 3, 0, 0, 7); g.fill(); g.fillStyle = '#c49a64'; g.beginPath(); g.ellipse(w / 2, 3, w / 2 - 2, 2, 0, 0, 7); g.fill(); F(g, '#8a6440', w / 2 - 1, 2, 2, 1); return outline(c, '#120a06'); }
function bannerPole(col, hi) {
  const c = mkc(16, 46), g = c.getContext('2d'); F(g, '#3a2c20', 7, 0, 2, 46); F(g, '#5a4028', 1, 3, 14, 2); F(g, col, 2, 5, 12, 30); F(g, hi, 2, 5, 3, 30); for (let i = 0; i < 4; i++) F(g, col, 2 + i * 3, 35 + (i % 2) * 3, 3, 3 + (i % 2));
  F(g, '#e8f0ff', 7, 12, 2, 14); F(g, '#e8f0ff', 4, 16, 8, 2); F(g, '#c9a54a', 7, 0, 2, 2);
  return outline(c, '#0b0716');
}
function statue() {
  const c = mkc(18, 44), g = c.getContext('2d'), s = ['#8a86a2', '#6a6684', '#4a4660'];
  F(g, s[1], 1, 36, 16, 8); F(g, s[0], 1, 36, 16, 1); F(g, s[2], 1, 43, 16, 1); F(g, s[1], 3, 32, 12, 4); F(g, s[0], 3, 32, 12, 1);
  F(g, s[1], 6, 12, 6, 20); F(g, s[0], 6, 12, 2, 20); F(g, s[2], 10, 12, 2, 20); F(g, s[1], 4, 14, 10, 4); F(g, s[0], 4, 14, 10, 1); F(g, s[1], 6, 4, 6, 8); F(g, s[0], 6, 4, 2, 8); F(g, s[2], 9, 6, 2, 3); F(g, s[1], 5, 1, 8, 4); F(g, s[0], 5, 1, 8, 1);
  F(g, s[0], 14, 6, 2, 28); F(g, '#d8d4ee', 14, 6, 1, 26); F(g, s[1], 12, 18, 6, 2);
  return outline(c, '#0b0716');
}
function tent(col, hi) { const w = 40, h = 30, c = mkc(w, h), g = c.getContext('2d'); for (let r = 0; r < h; r++) { const hw = r / h * (w / 2 - 1); F(g, col, w / 2 - hw, r, hw * 2, 1); F(g, hi, w / 2 - hw, r, Math.max(1, hw * .6), 1); } F(g, '#1a1020', w / 2 - 5, h - 12, 10, 12); F(g, '#0a0610', w / 2 - 3, h - 10, 6, 10); F(g, '#3a2818', w / 2 - 1, 0, 2, 4); for (let r = 0; r < h; r += 6) F(g, mixc(col, '#000000', .3), w / 2 - r / h * (w / 2 - 1), r, 1, 2); return outline(c, '#0b0716'); }
function rock(w, col) { const h = Math.round(w * .6), c = mkc(w, h), g = c.getContext('2d'); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const d = ((x - w / 2 + .5) / (w / 2)) ** 2 + ((y - h * .7) / (h * .7)) ** 2 + (H2(x, y, 9) - .5) * .3; if (d > 1 || y > h - 1) continue; const v = Math.hypot(x - w * .3, y - h * .25) / w + (H2(x, y, 10) - .5) * .2; F(g, mixc(col, '#ffffff', v < .25 ? .3 : v < .5 ? .1 : -.15), x, y, 1, 1); } return outline(c, '#0b0716'); }
function mushroom(h, col, hi) { const w = Math.round(h * 1.1), c = mkc(w, h), g = c.getContext('2d'); F(g, '#d8d0e8', w / 2 - 2, h * .45, 4, h * .55); F(g, '#a89cc4', w / 2 + 1, h * .45, 1, h * .55); g.fillStyle = col; g.beginPath(); g.ellipse(w / 2, h * .4, w / 2, h * .4, 0, Math.PI, 0); g.fill(); F(g, hi, w * .25, h * .18, 2, 2); F(g, hi, w * .6, h * .12, 2, 2); F(g, hi, w * .45, h * .28, 1, 1); return outline(c, '#0b0716'); }
function fence(n, snow) { const w = n * 8, c = mkc(w, 14), g = c.getContext('2d'); F(g, '#5a4028', 0, 4, w, 2); F(g, '#5a4028', 0, 9, w, 2); for (let i = 0; i <= n; i++) { const x = Math.min(w - 3, i * 8); F(g, '#7a5836', x, 0, 3, 14); F(g, '#a07a48', x, 0, 1, 14); if (snow) F(g, '#ffffff', x, 0, 3, 2); } if (snow) { F(g, '#e8f1fa', 0, 3, w, 1); } return outline(c, '#120a06'); }

// ------------------------------------------------------------------ estructuras
function wall(g, x, y, w, h, P, salt, rh, cw) {
  rh = rh || 6; cw = cw || 12;
  for (let r = 0; r * rh < h; r++) {
    const yy = y + r * rh, hh = Math.min(rh, y + h - yy), off = (r & 1) * (cw >> 1);
    for (let bx = -off; bx < w; bx += cw) {
      const x0 = Math.max(0, bx), x1 = Math.min(w, bx + cw); if (x1 <= x0) continue;
      const k = H2(bx + r * 7, r, salt), idx = 1 + ((k * 3) | 0);
      F(g, P[idx], x + x0, yy, x1 - x0, hh); F(g, P[Math.min(4, idx + 1)], x + x0, yy, x1 - x0, 1); F(g, P[0], x + x0, yy + hh - 1, x1 - x0, 1); if (bx >= 0) F(g, P[0], x + bx, yy, 1, hh);
      if (k > .82) F(g, P[Math.min(4, idx + 1)], x + x0 + 2, yy + 2, 3, 1);
    }
  }
}
function shade(g, x, y, w, h, a) { a = a || 1; g.fillStyle = 'rgba(255,236,190,' + .07 * a + ')'; g.fillRect(x, y, Math.max(1, w * .14), h); g.fillStyle = 'rgba(2,0,14,' + .26 * a + ')'; g.fillRect(x + w * .84, y, w * .16, h); const q = g.createLinearGradient(0, y + h * .7, 0, y + h); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(0,0,10,' + .32 * a + ')'); g.fillStyle = q; g.fillRect(x, y + h * .7, w, h * .3); }
function crenels(g, x, y, w, P) { for (let i = x; i < x + w - 5; i += 12) { F(g, P[2], i + 2, y, 7, 6); F(g, P[4], i + 2, y, 7, 1); F(g, P[0], i + 2, y + 5, 7, 1); F(g, P[1], i + 8, y, 1, 6); } }
function cone(g, cx, y0, y1, hw, C) {
  for (let y = y0; y <= y1; y++) { const f = (y - y0) / (y1 - y0), half = Math.max(1, hw * f), x0 = Math.round(cx - half), w = Math.round(half * 2); F(g, C[1], x0, y, w, 1); F(g, C[2], x0, y, Math.max(1, Math.round(w * .38)), 1); F(g, C[0], x0 + Math.round(w * .74), y, Math.max(1, Math.round(w * .26)), 1); if ((y - y0) % 5 === 4) F(g, C[0], x0, y, w, 1); }
  F(g, C[3], Math.round(cx - hw - 3), y1, Math.round(hw * 2 + 6), 2); F(g, C[0], Math.round(cx - hw - 3), y1 + 2, Math.round(hw * 2 + 6), 1);
}
function archWin(g, x, y, w, h, lit) {
  F(g, '#0a0812', x - 1, y - 1, w + 2, h + 2); g.fillStyle = '#0a0812'; g.beginPath(); g.arc(x + w / 2, y, w / 2 + 1, Math.PI, 0); g.fill();
  const c = lit === false ? '#2a3a6a' : '#ffcf5a'; F(g, c, x, y, w, h); g.fillStyle = c; g.beginPath(); g.arc(x + w / 2, y, w / 2, Math.PI, 0); g.fill();
  if (lit !== false) { F(g, '#fff4c0', x + 1, y - 1, Math.max(1, w * .35), h - 1); F(g, '#7a4a18', x, y + h - 2, w, 2); }
  F(g, '#0a0812', x + w / 2 - .5, y - w / 2, 1, h + w / 2); F(g, '#0a0812', x, y + h * .4, w, 1);
  if (lit !== false) glow(g, x + w / 2, y + h / 2, 16, '255,200,90', .22);
}
function drawCastle(g) {
  const P = ['#262234', '#332f46', '#3f3a56', '#4d4868', '#625b82'], PD = ['#1c192a', '#262234', '#2f2b42', '#3a3650', '#48435f'], R = ['#16204a', '#22306a', '#2f4288', '#4258a8'];
  // alas
  wall(g, 262, 76, 244, 52, PD, 1); crenels(g, 262, 70, 244, PD); shade(g, 262, 76, 244, 52, .8);
  // torres laterales
  [[278, 2], [442, 3]].forEach(a => {
    const x = a[0]; wall(g, x, 36, 48, 92, P, a[1], 6, 10); shade(g, x, 36, 48, 92); F(g, P[1], x - 4, 30, 56, 8); wall(g, x - 4, 30, 56, 8, P, a[1] + 9, 4, 8); F(g, P[0], x - 4, 38, 56, 2);
    cone(g, x + 24, 8, 32, 34, R); F(g, '#3a2c20', x + 23, 0, 2, 10); F(g, '#2f4288', x + 25, 1, 9, 4); F(g, '#4258a8', x + 25, 1, 9, 1);
  });
  // torre central + torreón
  wall(g, 350, 0, 68, 64, P, 5, 6, 12); shade(g, 350, 0, 68, 64); F(g, P[1], 346, 14, 76, 6); crenels(g, 346, 8, 76, P); F(g, P[1], 346, 20, 76, 3);
  wall(g, 326, 24, 116, 104, P, 4, 6, 12); shade(g, 326, 24, 116, 104); crenels(g, 324, 18, 120, P); F(g, P[0], 326, 24, 116, 2); F(g, P[3], 326, 24, 116, 1);
  // ventanas
  [[340, 46], [368, 46], [396, 46], [424, 46]].forEach(a => archWin(g, a[0], a[1], 6, 12)); archWin(g, 381, 34, 6, 10);
  archWin(g, 299, 56, 6, 12); archWin(g, 299, 90, 6, 12); archWin(g, 463, 56, 6, 12); archWin(g, 463, 90, 6, 12); archWin(g, 381, 6, 6, 10, false);
  // pendones
  [[329, 60], [425, 60]].forEach(a => { F(g, '#2a2036', a[0] - 1, a[1] - 3, 18, 3); F(g, '#1b2f7a', a[0], a[1], 16, 46); F(g, '#2d4cb8', a[0], a[1], 4, 46); F(g, '#1b2f7a', a[0] + 4, a[1] + 46, 4, 4); F(g, '#1b2f7a', a[0], a[1] + 46, 3, 3); F(g, '#1b2f7a', a[0] + 12, a[1] + 46, 4, 3); F(g, '#dfe8ff', a[0] + 7, a[1] + 8, 2, 20); F(g, '#dfe8ff', a[0] + 3, a[1] + 13, 10, 2); F(g, '#c9a54a', a[0] + 7, a[1] + 28, 2, 2); });
  // portal (arco)
  g.fillStyle = '#7a7498'; g.beginPath(); g.moveTo(360, 128); g.lineTo(360, 100); g.arc(384, 100, 24, Math.PI, 0); g.lineTo(408, 128); g.fill();
  g.fillStyle = '#4d4868'; g.beginPath(); g.moveTo(364, 128); g.lineTo(364, 100); g.arc(384, 100, 20, Math.PI, 0); g.lineTo(404, 128); g.fill();
  g.fillStyle = '#06040c'; g.beginPath(); g.moveTo(367, 128); g.lineTo(367, 100); g.arc(384, 100, 17, Math.PI, 0); g.lineTo(401, 128); g.fill();
  for (let a = 0; a < 9; a++) { const an = Math.PI + a * Math.PI / 8; F(g, a % 2 ? '#8c86aa' : '#6a6484', 384 + Math.cos(an) * 22 - 1, 100 + Math.sin(an) * 22 - 1, 3, 3); }
  // musgo en la base
  for (let k = 0; k < 120; k++) { const x = 262 + H2(k, 1, 90) * 244 | 0, y = 108 + H2(k, 2, 90) * 20 | 0; F(g, H2(k, 3, 90) < .5 ? '#2f6a38' : '#3f8a46', x, y, 2, 1 + (k & 1)); }
  const q = g.createLinearGradient(0, 118, 0, 134); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(0,0,0,.42)'); g.fillStyle = q; g.fillRect(262, 118, 244, 16);
  // escalones del portal
  for (let i = 0; i < 3; i++) { F(g, i % 2 ? '#6a6484' : '#7a7494', 354 - i * 2, 128 + i * 4, 60 + i * 4, 4); F(g, '#2a2638', 354 - i * 2, 131 + i * 4, 60 + i * 4, 1); }
}
function drawStairs(g) {
  const P = ['#262234', '#332f46', '#3f3a56', '#4d4868', '#625b82'];
  [[290, 70], [412, 70]].forEach(a => { wall(g, a[0], 174, a[1], 14, P, 20, 5, 10); F(g, P[4], a[0], 172, a[1], 3); F(g, P[3], a[0], 175, a[1], 1); shade(g, a[0], 174, a[1], 14, .6); });
  for (let i = 0; i < 7; i++) { const y = 172 + i * 5, x0 = 356 - i, w = 56 + i * 2; F(g, i % 2 ? '#6a6484' : '#7c7698', x0, y, w, 3); F(g, '#a29cc0', x0, y, w, 1); F(g, '#2e2a40', x0, y + 3, w, 2); }
  F(g, P[2], 352, 172, 4, 36); F(g, P[4], 352, 172, 4, 1); F(g, P[2], 412, 172, 4, 36); F(g, P[4], 412, 172, 4, 1);
}
function drawCabin(g) {
  // nieve en el suelo bajo la cabaña
  g.fillStyle = 'rgba(210,225,245,.7)'; g.beginPath(); g.ellipse(150, 138, 56, 8, 0, 0, 7); g.fill();
  // troncos
  for (let r = 0; r < 7; r++) { const y = 102 + r * 5; for (let x = 118; x < 184; x++) { F(g, r % 2 ? '#7a5836' : '#8a6844', x, y, 1, 4); } F(g, '#a07a48', 118, y, 66, 1); F(g, '#3a2418', 118, y + 4, 66, 1); F(g, '#5a4028', 118, y + 3, 66, 1); for (let x = 120; x < 182; x += 9) if (H2(x, r, 8) < .4) F(g, '#5a4028', x, y + 1, 3, 1); g.fillStyle = '#b08850'; g.beginPath(); g.arc(118, y + 2, 2.5, 0, 7); g.arc(183, y + 2, 2.5, 0, 7); g.fill(); }
  shade(g, 118, 102, 66, 35, .7);
  // chimenea
  wall(g, 168, 64, 12, 26, ['#2a2630', '#3a3644', '#4a4658', '#5a566c', '#6a667e'], 4, 4, 6); F(g, '#eef6ff', 166, 61, 16, 4); F(g, '#b4c6e0', 166, 65, 16, 1);
  // tejado
  for (let r = 0; r < 32; r++) { const y = 74 + r, hw = 22 + r * .72, x0 = Math.round(150 - hw), w = Math.round(hw * 2); for (let x = x0; x < x0 + w; x++) { const sl = 14 + 5 * vn(x * .3, 3, 4) + (r < 3 ? 2 : 0), rr = r; let c; if (rr < sl) c = rr < 2 ? '#ffffff' : (rr > sl - 3 ? '#b4c6e0' : '#e6eef8'); else c = ((r + (x >> 3 & 1) * 2) % 4 === 3) ? '#2a1812' : ((x >> 3) % 2 ? '#5a3a2a' : '#6a4632'); F(g, c, x, y, 1, 1); } }
  F(g, '#2a1812', 108, 105, 84, 2); F(g, '#eef6ff', 108, 103, 84, 2); for (let x = 112; x < 190; x += 7) if (H2(x, 1, 6) < .6) F(g, '#cfe3f8', x, 107, 2, 3 + (x % 3));
  // ventanas y puerta
  [[124, 112], [166, 112]].forEach(a => { F(g, '#3a2418', a[0] - 2, a[1] - 2, 14, 14); F(g, '#ffcf5a', a[0], a[1], 10, 10); F(g, '#fff4c0', a[0], a[1], 3, 10); F(g, '#3a2418', a[0] + 4, a[1], 2, 10); F(g, '#3a2418', a[0], a[1] + 4, 10, 2); F(g, '#eef6ff', a[0] - 2, a[1] - 3, 14, 2); F(g, '#6a4a2e', a[0] - 3, a[1] + 11, 16, 3); glow(g, a[0] + 5, a[1] + 5, 22, '255,200,90', .25); });
  F(g, '#2a1a10', 142, 112, 16, 25); g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(150, 112, 8, Math.PI, 0); g.fill(); F(g, '#ffcf5a', 147, 112, 8, 24); F(g, '#fff4c0', 147, 112, 3, 24); F(g, '#5a3c22', 142, 114, 5, 23); F(g, '#7a5836', 142, 114, 1, 23); F(g, '#c9a54a', 145, 126, 1, 2); F(g, '#6a4a2e', 138, 135, 24, 3); F(g, '#8a6844', 138, 135, 24, 1);
  glow(g, 150, 140, 26, '255,200,90', .3);
  // leña
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4 - i; j++) { F(g, '#6a4a2e', 186 + j * 5 + i * 2, 126 - i * 4 + 8, 5, 4); F(g, '#c49a64', 186 + j * 5 + i * 2, 126 - i * 4 + 8, 2, 4); } F(g, '#eef6ff', 185, 118, 20, 3);
}
function iceBit(g, cx, cy, rx, ry) { g.fillStyle = '#6a8ab8'; g.beginPath(); g.ellipse(cx, cy + 1, rx + 1, ry + 1, 0, 0, 7); g.fill(); g.fillStyle = '#a8c8ec'; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.fill(); g.fillStyle = '#d4e8fa'; g.beginPath(); g.ellipse(cx - 2, cy - 1, rx * .6, ry * .5, 0, 0, 7); g.fill(); g.strokeStyle = '#ffffff'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - rx * .6, cy); g.lineTo(cx - rx * .1, cy + 2); g.lineTo(cx + rx * .3, cy - 1); g.stroke(); }
function drawRuins(g) {
  const P = ['#1c1830', '#282244', '#342d58', '#443a70', '#564a88'];
  const t = mkc(150, 90), q = t.getContext('2d', { willReadFrequently: true });
  wall(q, 8, 22, 84, 60, P, 31, 6, 11); shade(q, 8, 22, 84, 60);
  wall(q, 100, 4, 22, 78, P, 32, 6, 9); shade(q, 100, 4, 22, 78); wall(q, 0, 40, 10, 42, P, 33, 6, 9); wall(q, 124, 52, 14, 30, P, 34, 6, 9);
  q.globalCompositeOperation = 'destination-out';
  for (let x = 8; x < 92; x++) { const h = 14 + 12 * vn(x * .22, 1, 8) + (H2(x, 1, 9) < .2 ? 4 : 0); q.fillRect(x, 0, 1, h + 8); }
  for (let x = 100; x < 122; x++) q.fillRect(x, 0, 1, 4 + 20 * vn(x * .3, 2, 8)); for (let x = 0; x < 10; x++) q.fillRect(x, 20, 1, 24 + 6 * H2(x, 3, 8)); for (let x = 124; x < 138; x++) q.fillRect(x, 30, 1, 26 + H2(x, 5, 8) * 8);
  [[22, 40], [48, 40], [74, 40]].forEach(a => { q.beginPath(); q.moveTo(a[0] - 7, 70); q.lineTo(a[0] - 7, a[1] + 8); q.arc(a[0], a[1] + 8, 7, Math.PI, 0); q.lineTo(a[0] + 7, 70); q.fill(); });
  q.globalCompositeOperation = 'source-over';
  [[22, 40], [48, 40], [74, 40]].forEach(a => { q.fillStyle = '#0a0618'; q.beginPath(); q.moveTo(a[0] - 7, 70); q.lineTo(a[0] - 7, a[1] + 8); q.arc(a[0], a[1] + 8, 7, Math.PI, 0); q.lineTo(a[0] + 7, 70); q.fill(); q.fillStyle = 'rgba(150,90,255,.55)'; q.fillRect(a[0] - 2, a[1] + 8, 4, 22); q.fillStyle = 'rgba(200,160,255,.7)'; q.fillRect(a[0] - 1, a[1] + 10, 2, 14); });
  for (let k = 0; k < 40; k++) { const x = H2(k, 1, 50) * 140 | 0, y = 30 + H2(k, 2, 50) * 52 | 0; if (q.getImageData(x, y, 1, 1).data[3] > 200) F(q, H2(k, 3, 50) < .5 ? '#3a2a5a' : '#6a3ad0', x, y, 2, 1); }
  g.drawImage(outline(t, '#0a0616'), 590, 40);
}
function drawFort(g) {
  const P = ['#1c0e12', '#2a1418', '#38191f', '#4a202a', '#60303a'], C = ['#4a1210', '#7a1e1c', '#a82a26', '#c84038'];
  wall(g, 636, 384, 64, 40, P, 41, 6, 11); shade(g, 636, 384, 64, 40); crenels(g, 634, 378, 68, P);
  [[622, 0], [686, 1]].forEach(a => { const x = a[0]; wall(g, x, 368, 28, 56, P, 42 + a[1], 6, 9); shade(g, x, 368, 28, 56); F(g, P[1], x - 3, 364, 34, 6); cone(g, x + 14, 340, 366, 20, C); F(g, '#3a2c20', x + 13, 330, 2, 12); F(g, '#c8281e', x + 15, 331, 8, 4); archWin(g, x + 11, 388, 6, 10); });
  g.fillStyle = '#060206'; g.beginPath(); g.moveTo(656, 424); g.lineTo(656, 402); g.arc(668, 402, 12, Math.PI, 0); g.lineTo(680, 424); g.fill();
  g.fillStyle = 'rgba(255,90,40,.6)'; g.fillRect(660, 404, 16, 20); g.fillStyle = 'rgba(255,190,90,.7)'; g.fillRect(664, 410, 8, 14);
  for (let x = 657; x < 680; x += 4) F(g, '#1a1014', x, 394, 1, 30); for (let y = 398; y < 424; y += 8) F(g, '#1a1014', 656, y, 24, 1);
  g.strokeStyle = '#7a6a78'; g.lineWidth = 2; g.beginPath(); g.moveTo(656, 424); g.lineTo(656, 402); g.arc(668, 402, 12, Math.PI, 0); g.lineTo(680, 424); g.stroke();
  [[640, 390], [688, 390]].forEach(a => { F(g, '#2a2036', a[0] - 1, a[1] - 3, 14, 3); F(g, '#8a1818', a[0], a[1], 12, 30); F(g, '#b82a2a', a[0], a[1], 3, 30); F(g, '#8a1818', a[0], a[1] + 30, 3, 3); F(g, '#8a1818', a[0] + 8, a[1] + 30, 4, 3); F(g, '#f0d8d0', a[0] + 5, a[1] + 6, 2, 14); F(g, '#f0d8d0', a[0] + 2, a[1] + 10, 8, 2); });
  const q = g.createLinearGradient(0, 414, 0, 428); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(0,0,0,.4)'); g.fillStyle = q; g.fillRect(622, 414, 92, 14);
  // fragua
  wall(g, 704, 392, 26, 18, P, 47, 5, 8); F(g, '#06020a', 710, 398, 14, 10); F(g, '#ff7a2c', 711, 402, 12, 6); F(g, '#ffc24a', 713, 404, 8, 4); F(g, '#4a202a', 702, 388, 30, 5); F(g, '#60303a', 702, 388, 30, 1); F(g, '#2a1418', 714, 376, 8, 13); F(g, '#4a202a', 714, 376, 2, 13);
  // río de lava
  const lv = [[716, 412], [722, 424], [726, 436], [733, 448]];
  for (let k = 0; k < lv.length - 1; k++) { const a = lv[k], b = lv[k + 1], n = 20; for (let j = 0; j <= n; j++) { const x = a[0] + (b[0] - a[0]) * j / n, y = a[1] + (b[1] - a[1]) * j / n; g.fillStyle = '#1a0a0c'; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); } }
  for (let k = 0; k < lv.length - 1; k++) { const a = lv[k], b = lv[k + 1], n = 20; for (let j = 0; j <= n; j++) { const x = a[0] + (b[0] - a[0]) * j / n, y = a[1] + (b[1] - a[1]) * j / n; g.fillStyle = '#c8461c'; g.beginPath(); g.arc(x, y, 3.4, 0, 7); g.fill(); g.fillStyle = '#ff7a2c'; g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill(); g.fillStyle = '#ffc24a'; g.fillRect(Math.round(x - 1), Math.round(y - 1), 2, 1); } }
  return lv;
}
// ------------------------------------------------------------------ muelle, barco, faro, glorieta
function plankRect(g, x, y, w, h, vertical) {
  for (let i = 0; i < (vertical ? h : w); i += 5) { const n = H2(i + x, y, 70), c = n < .3 ? '#8a6440' : n < .65 ? '#7a5836' : '#96704a'; if (vertical) { F(g, c, x, y + i, w, 4); F(g, '#a87c50', x, y + i, w, 1); F(g, '#3a2818', x, y + i + 4, w, 1); } else { F(g, c, x + i, y, 4, h); F(g, '#a87c50', x + i, y, 1, h); F(g, '#3a2818', x + i + 4, y, 1, h); } }
  F(g, '#4a3422', x, y, vertical ? 1 : w, vertical ? h : 1); F(g, '#2a1c12', x, y + h - 1, w, 1);
}
function drawDock(g) {
  const sh = (x, y, w, h) => { g.fillStyle = 'rgba(4,10,30,.45)'; g.fillRect(x + 2, y + 4, w, h); };
  sh(40, 392, 232, 22); sh(100, 414, 96, 36);
  // pilotes
  for (let x = 52; x < 262; x += 26) { F(g, '#2a1c12', x, 412, 5, 12); F(g, '#4a3422', x, 412, 2, 12); }
  for (let x = 104; x < 196; x += 30) { F(g, '#2a1c12', x, 446, 5, 10); F(g, '#4a3422', x, 446, 2, 10); }
  plankRect(g, 40, 392, 232, 22, false); plankRect(g, 100, 414, 96, 36, false);
  // barandilla
  F(g, '#4a3422', 40, 392, 232, 3); F(g, '#a87c50', 40, 392, 232, 1);
  for (let x = 44; x < 270; x += 26) { F(g, '#5a4028', x, 384, 4, 12); F(g, '#a87c50', x, 384, 1, 12); }
  F(g, '#3a2818', 44, 388, 226, 1);
  F(g, '#4a3422', 100, 449, 96, 3); F(g, '#a87c50', 100, 449, 96, 1); F(g, '#4a3422', 100, 414, 3, 38); for (let y = 418; y < 450; y += 12) { F(g, '#5a4028', 99, y, 4, 8); }
  for (let x = 104; x < 196; x += 24) { F(g, '#5a4028', x, 443, 4, 10); F(g, '#a87c50', x, 443, 1, 10); }
  // cuerdas y amarras
  F(g, '#c8b898', 42, 410, 4, 4); F(g, '#8a7a60', 43, 411, 2, 2);
  // plataforma: marca de duelo (espadas cruzadas)
  g.save(); g.translate(150, 432); g.strokeStyle = 'rgba(40,24,14,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 13, 0, 7); g.stroke(); g.beginPath(); g.moveTo(-9, -9); g.lineTo(9, 9); g.moveTo(9, -9); g.lineTo(-9, 9); g.stroke(); g.restore();
}
function ship() {
  const w = 104, h = 92, c = mkc(w, h), g = c.getContext('2d');
  // palos y velas
  F(g, '#3a2c20', 45, 10, 3, 52); F(g, '#3a2c20', 24, 62, 3, 0); F(g, '#5a4028', 22, 18, 52, 2); F(g, '#5a4028', 28, 40, 40, 2);
  const sail = (x0, y0, x1, y1, ww) => { for (let y = y0; y < y1; y++) { const f = (y - y0) / (y1 - y0), bul = Math.sin(f * Math.PI) * 3; for (let x = x0; x < x1; x++) { const u = (x - x0) / (x1 - x0); F(g, u < .3 ? '#f2e8d0' : u < .7 ? '#dccfb0' : '#b8a888', x + (u > .5 ? bul * .6 : 0), y, 1, 1); } } F(g, '#a89868', x0, y1 - 1, x1 - x0, 1); for (let y = y0 + 6; y < y1; y += 8) F(g, 'rgba(120,100,70,.4)', x0, y, x1 - x0, 1); };
  sail(24, 21, 70, 38, 46); sail(30, 43, 64, 58, 34); F(g, '#8a1020', 45, 2, 12, 6); F(g, '#c82a3a', 45, 2, 12, 2);
  g.strokeStyle = 'rgba(40,30,20,.8)'; g.lineWidth = 1; g.beginPath(); g.moveTo(46, 10); g.lineTo(8, 60); g.moveTo(46, 10); g.lineTo(88, 60); g.moveTo(46, 10); g.lineTo(98, 52); g.stroke();
  // casco
  g.fillStyle = '#4a2c1a'; g.beginPath(); g.moveTo(4, 56); g.lineTo(100, 52); g.quadraticCurveTo(94, 84, 52, 88); g.quadraticCurveTo(12, 84, 4, 56); g.fill();
  g.save(); g.clip(); for (let y = 56; y < 90; y += 5) { F(g, y % 10 === 1 ? '#6a4228' : '#5a3822', 0, y, w, 4); F(g, '#2a1810', 0, y + 4, w, 1); } F(g, 'rgba(0,0,0,.28)', 60, 52, 44, 40); F(g, 'rgba(255,220,160,.12)', 0, 52, 30, 40); g.restore();
  F(g, '#c9a54a', 4, 54, 96, 2); F(g, '#8a6a28', 4, 56, 96, 1); F(g, '#3a2418', 6, 50, 92, 4); F(g, '#6a4228', 6, 50, 92, 1);
  for (let x = 8; x < 96; x += 6) { F(g, '#3a2418', x, 46, 2, 5); } F(g, '#3a2418', 8, 46, 90, 1);
  // castillo de popa
  F(g, '#5a3822', 72, 36, 28, 16); F(g, '#7a4a2e', 72, 36, 28, 2); F(g, '#2a1810', 72, 50, 28, 2); F(g, '#ffcf5a', 78, 41, 5, 6); F(g, '#ffcf5a', 90, 41, 5, 6); F(g, '#2a1810', 80, 41, 1, 6); F(g, '#2a1810', 92, 41, 1, 6); F(g, '#8a1020', 71, 32, 30, 4);
  // mascarón
  F(g, '#5a3822', 0, 52, 6, 4); F(g, '#c9a54a', 0, 50, 3, 3);
  return outline(c, '#0a0610');
}
function lighthouse() {
  const w = 40, h = 102, c = mkc(w, h), g = c.getContext('2d'), cx = w / 2;
  for (let y = 36; y < h - 4; y++) { const f = (y - 36) / (h - 40), hw = 8 + f * 6, band = ((y - 36) / 11 | 0) % 2; for (let x = cx - hw; x < cx + hw; x++) { const u = (x - (cx - hw)) / (hw * 2); let col = band ? ['#c8404a', '#a82a38', '#7a1c2c'] : ['#f0e8e0', '#d4c8c0', '#a89c98']; F(g, u < .3 ? col[0] : u < .7 ? col[1] : col[2], x, y, 1, 1); } }
  F(g, '#2a2638', cx - 15, h - 6, 30, 6); F(g, '#46405c', cx - 15, h - 6, 30, 1);
  F(g, '#3a3650', cx - 11, 32, 22, 5); F(g, '#55506c', cx - 11, 32, 22, 1);
  F(g, '#2a2638', cx - 8, 16, 16, 16); F(g, '#fff1b0', cx - 6, 18, 12, 12); F(g, '#ffd36a', cx - 6, 24, 12, 6); F(g, '#2a2638', cx - 1, 18, 2, 12);
  cone(g, cx, 4, 16, 11, ['#2a1018', '#6a1c28', '#8a2a38', '#a8404c']); F(g, '#c9a54a', cx - 1, 0, 2, 5);
  F(g, '#2a2638', cx - 9, 36, 3, 3); F(g, '#2a2638', cx + 6, 36, 3, 3); F(g, '#1a1424', cx - 3, h - 18, 6, 12);
  return outline(c, '#0a0610');
}
function gazebo() {
  const w = 76, h = 66, c = mkc(w, h), g = c.getContext('2d'), cx = w / 2;
  g.fillStyle = '#4a4660'; g.beginPath(); g.ellipse(cx, h - 8, 34, 12, 0, 0, 7); g.fill(); g.fillStyle = '#7a7494'; g.beginPath(); g.ellipse(cx, h - 10, 34, 12, 0, 0, 7); g.fill(); g.fillStyle = '#5d5974'; g.beginPath(); g.ellipse(cx, h - 10, 28, 9, 0, 0, 7); g.fill();
  [[10, 48], [22, 54], [54, 54], [66, 48]].forEach((p, i) => { const x = p[0], yb = p[1]; F(g, '#4a4660', x - 2, yb - 36, 5, 36); F(g, '#7a7494', x - 2, yb - 36, 2, 36); F(g, '#2a2638', x + 2, yb - 36, 1, 36); F(g, '#8a84a8', x - 3, yb - 38, 7, 3); F(g, '#8a84a8', x - 3, yb - 2, 7, 3); });
  cone(g, cx, 2, 24, 36, ['#162050', '#22306a', '#2f4288', '#4258a8']); F(g, '#c9a54a', cx - 1, 0, 2, 4);
  glow(g, cx, 40, 14, '120,190,255', .0); g.fillStyle = '#7fe0ff'; g.beginPath(); g.arc(cx, 38, 4, 0, 7); g.fill(); g.fillStyle = '#d8f6ff'; g.fillRect(cx - 2, 36, 2, 2);
  return outline(c, '#0a0610');
}
function fountainBasin() {
  const w = 76, h = 44, c = mkc(w, h), g = c.getContext('2d'), cx = w / 2;
  const el = (col, x, y, rx, ry) => { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
  el('#1c1830', cx, 34, 36, 13); el('#4a4660', cx, 32, 36, 12); el('#8a84a8', cx, 30, 35, 11); el('#5d5974', cx, 31, 31, 9); el('#1a4a90', cx, 31, 29, 8);
  for (let a = 0; a < 22; a++) { const an = a / 22 * 6.283; F(g, a % 2 ? '#6a6484' : '#9a94b8', cx + Math.cos(an) * 33 - 1, 30 + Math.sin(an) * 10 - 1, 3, 2); }
  F(g, '#4a4660', cx - 8, 22, 16, 10); F(g, '#8a84a8', cx - 8, 22, 16, 2); F(g, '#5d5974', cx - 5, 18, 10, 6); F(g, '#8a84a8', cx - 5, 18, 10, 1);
  return outline(c, '#0a0610');
}

// ------------------------------------------------------------------ puntos de interés
const HS = [
  { id: 'world', t: 'ENTRADA AL MUNDO', s: '(Seleccionar región)', lx: 384, ly: 70, px: 384, py: 152, r: 26 },
  { id: 'regions', t: 'REGIONES', s: '(Ver y unirse a partidas)', lx: 150, ly: 66, px: 150, py: 152, r: 24 },
  { id: 'games', t: 'SALA DE JUEGOS', s: '(PvP / Minijuegos · pronto)', lx: 226, ly: 380, px: 150, py: 432, r: 24 },
  { id: 'social', t: 'ZONA SOCIAL', s: '(Chat / Jugadores)', lx: 384, ly: 468, px: 384, py: 428, r: 30 },
  { id: 'clans', t: 'CLANES', s: '(Crear / Unirse · pronto)', lx: 668, ly: 318, px: 668, py: 440, r: 24 }
];

function bridge(g, x1, y1, x2, y2, w) {
  const dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n, nx = -uy, ny = ux;
  g.fillStyle = 'rgba(4,2,16,.4)'; g.beginPath(); g.moveTo(x1 + nx * (w + 1), y1 + ny * (w + 1) + 7); g.lineTo(x2 + nx * (w + 1), y2 + ny * (w + 1) + 7); g.lineTo(x2 - nx * (w + 1), y2 - ny * (w + 1) + 7); g.lineTo(x1 - nx * (w + 1), y1 - ny * (w + 1) + 7); g.fill();
  for (let i = 0; i <= n; i += .5) for (let j = -w; j <= w; j += .5) {
    const p = Math.floor(i / 4), seam = (i % 4) >= 3, edge = Math.abs(j) > w - 1.2; let c = seam ? '#3a2818' : edge ? '#5a4028' : (H2(p, 7, 70) < .35 ? '#8a6440' : H2(p, 7, 70) < .7 ? '#7a5836' : '#96704a'); if (!seam && !edge && (i % 4) < 1) c = '#a87c50';
    F(g, c, x1 + ux * i + nx * j, y1 + uy * i + ny * j, 1, 1);
  }
  for (let i = 0; i <= n; i += 14) for (const s of [-1, 1]) { const px = x1 + ux * i + nx * (w + 1) * s, py = y1 + uy * i + ny * (w + 1) * s; F(g, '#2a1c12', px - 1, py - 7, 3, 8); F(g, '#8a6440', px - 1, py - 7, 1, 8); F(g, '#a87c50', px - 1, py - 8, 3, 1); }
  for (const s of [-1, 1]) { g.strokeStyle = '#5a4028'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x1 + nx * (w + 1) * s, y1 + ny * (w + 1) * s - 6); g.lineTo(x2 + nx * (w + 1) * s, y2 + ny * (w + 1) * s - 6); g.stroke(); }
}

function build() {
  seed = 11;
  const sky = buildSky(), bd = new Uint32Array(W * H);
  const mS = landmass(bd, 'snow', [{ cx: 140, cy: 120, rx: 98, ry: 50, dp: 44 }, { cx: 92, cy: 138, rx: 62, ry: 34, dp: 36 }], 2);
  const mD = landmass(bd, 'dark', [{ cx: 630, cy: 120, rx: 98, ry: 50, dp: 44 }, { cx: 682, cy: 138, rx: 60, ry: 34, dp: 34 }], 3);
  const mM = landmass(bd, 'grass', [{ cx: 384, cy: 140, rx: 170, ry: 44, dp: 36 }, { cx: 384, cy: 292, rx: 262, ry: 122, dp: 84 }, { cx: 384, cy: 396, rx: 120, ry: 46, dp: 44 }], 1);
  const mL = landmass(bd, 'grass', [{ cx: 50, cy: 292, rx: 40, ry: 22, dp: 40 }], 6);
  const mE = landmass(bd, 'grass', [{ cx: 720, cy: 292, rx: 40, ry: 22, dp: 40 }], 7);
  const mW = landmass(bd, 'sea', [{ cx: 96, cy: 412, rx: 100, ry: 52, dp: 40 }], 4);
  const mR = landmass(bd, 'red', [{ cx: 668, cy: 418, rx: 92, ry: 48, dp: 44 }, { cx: 716, cy: 404, rx: 50, ry: 32, dp: 36 }], 5);
  // plaza
  const PX = 384, PY = 292, PRX = 132, PRY = 66;
  for (let y = PY - PRY - 6; y <= PY + PRY + 6; y++) for (let x = PX - PRX - 6; x <= PX + PRX + 6; x++) {
    const i = y * W + x; if (!mM[i]) continue; const d = ((x - PX) / PRX) ** 2 + ((y - PY) / PRY) ** 2 + (vn(x * .1, y * .1, 61) - .5) * .06; if (d >= 1) continue;
    let c = d > .84 ? cobPx(x, y, STR, 71) : cobPx(x, y, ST, 72);
    if (d > .97) c = '#2c2839'; else if (d > .93 && H2(x, y, 73) < .3) c = '#3c7a3e'; if (d > .28 && d < .34) c = cobPx(x, y, STR, 74); bd[i] = pk(c);
  }
  const ROADS = [];
  const stamp = (x, y, r, f, mask) => { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const dd = Math.hypot(dx, dy); if (dd > r) continue; const px = Math.round(x + dx), py = Math.round(y + dy); if (px < 0 || py < 0 || px >= W || py >= H) continue; const i = py * W + px; if (mask && !mask[i]) continue; bd[i] = pk(f(px, py, dd, r)); } };
  const road = (pts, r, kind) => { ROADS.push({ pts, r }); const cob = kind === 'cob';
    for (let pass = 0; pass < 2; pass++) for (let k = 0; k < pts.length - 1; k++) { const a = pts[k], b = pts[k + 1], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])); for (let j = 0; j <= n; j++) stamp(a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n, pass ? r - 1.4 : r, (x, y) => pass ? (cob ? cobPx(x, y, ST, 75) : dirtPx(x, y)) : (cob ? '#2c2839' : (H2(x, y, 52) < .6 ? '#6a5a40' : '#7a6a4e')), mM); } };
  road([[384, 236], [384, 172]], 11, 'cob'); road([[384, 140], [384, 172]], 15, 'cob');
  road([[300, 250], [278, 226], [268, 200]], 5, 'dirt'); road([[468, 250], [490, 226], [500, 200]], 5, 'dirt');
  road([[300, 330], [280, 372], [272, 398]], 5, 'dirt'); road([[470, 332], [530, 346], [560, 350]], 5, 'dirt');
  road([[262, 292], [126, 292]], 5, 'dirt'); road([[506, 292], [642, 292]], 5, 'dirt'); road([[384, 350], [384, 396]], 9, 'cob');
  // máscara de paso
  const walk = new Uint8Array(W * H), er = (m, r) => { for (let y = r; y < H - r; y++) for (let x = r; x < W - r; x++) { const i = y * W + x; if (m[i] && m[i - r] && m[i + r] && m[i - r * W] && m[i + r * W]) walk[i] = 1; } };
  [mS, mD, mM, mL, mE, mR].forEach(m => er(m, 4));
  const world = mkc(W, H), g = world.getContext('2d'); g.putImageData(new ImageData(new Uint8ClampedArray(bd.buffer), W, H), 0, 0);
  const wk = (x, y, r, v) => { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) { const px = Math.round(x + dx), py = Math.round(y + dy); if (px >= 0 && py >= 0 && px < W && py < H) walk[py * W + px] = v; } };
  const wkLine = (a, b, r) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1])); for (let i = 0; i <= n; i++) wk(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n, r, 1); };
  const wkRect = (x, y, w, h, v) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < W && j < H) walk[j * W + i] = v; };
  const obst = [], P = [], occ = [];
  const ob = (o) => { obst.push(o); };
  // ---- estructuras
  drawStairs(g); drawCastle(g);
  g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(384, 138, 40, 6, 0, 0, 7); g.fill();
  drawCabin(g); iceBit(g, 88, 150, 24, 9); drawRuins(g.canvas ? g : g); const lava = drawFort(g);
  wkRect(262, 0, 244, 134, 0); wkRect(290, 172, 66, 16, 0); wkRect(412, 172, 70, 16, 0); wkRect(352, 172, 4, 36, 0); wkRect(412, 172, 4, 36, 0);
  ob({ x: 106, y: 96, w: 92, h: 42 }); ob({ x: 598, y: 62, w: 86, h: 62 }); ob({ x: 690, y: 40, w: 24, h: 82 }); ob({ x: 620, y: 340, w: 96, h: 86 }); ob({ x: 700, y: 374, w: 34, h: 40 });
  for (let k = 0; k < lava.length - 1; k++) { const a = lava[k], b = lava[k + 1]; for (let j = 0; j <= 3; j++) ob({ x: a[0] + (b[0] - a[0]) * j / 3, y: a[1] + (b[1] - a[1]) * j / 3, r: 7 }); }
  // puentes
  const BR = [[200, 146, 268, 200, 5], [568, 146, 500, 200, 5], [128, 292, 82, 292, 5], [640, 292, 688, 292, 5], [558, 350, 604, 408, 5]];
  BR.forEach(b => { bridge(g, b[0], b[1], b[2], b[3], b[4]); wkLine([b[0], b[1]], [b[2], b[3]], b[4] - 1); });
  // muelle
  drawDock(g); wkRect(40, 394, 236, 22, 1); wkRect(102, 414, 92, 34, 1); wkRect(262, 394, 20, 18, 1);
  // estanque y arroyo (sureste)
  const pondX = 484, pondY = 382; g.fillStyle = '#1a1424'; g.beginPath(); g.ellipse(pondX, pondY + 1, 25, 11, 0, 0, 7); g.fill(); g.fillStyle = '#5a5470'; g.beginPath(); g.ellipse(pondX, pondY, 24, 10, 0, 0, 7); g.fill(); g.fillStyle = '#1a58a8'; g.beginPath(); g.ellipse(pondX, pondY, 21, 8, 0, 0, 7); g.fill(); g.fillStyle = '#2a78d0'; g.beginPath(); g.ellipse(pondX - 2, pondY - 1, 14, 5, 0, 0, 7); g.fill();
  for (let a = 0; a < 16; a++) { const an = a / 16 * 6.283; F(g, a % 2 ? '#6a6484' : '#8a84a8', pondX + Math.cos(an) * 23 - 1, pondY + Math.sin(an) * 9.5 - 1, 3, 2); }
  ob({ x: pondX - 24, y: pondY - 10, w: 48, h: 20 });
  // ---- sombra suave
  const shad = (x, y, rx, ry) => { g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
  // ---- props
  const add = (img, x, y, extra) => { const o = Object.assign({ img, x, y }, extra); P.push(o); if (o.r) obst.push({ x, y: y - 1, r: o.r }); if (!o.noocc) occ.push([x, y, (o.rr || o.r || 6)]); if (o.sh !== 0) shad(x, y - 1, (img.width * (o.shw || .36)), 3); return o; };
  const SP = { pg: [pine(40, 0, 1), pine(46, 0, 2), pine(54, 0, 3), pine(34, 0, 4)], ps: [pine(36, 1, 5), pine(42, 1, 6), pine(50, 1, 7)], oak: [oak(40, 1), oak(46, 2), oak(34, 3)], bush: [bush(16, FLOWERS), bush(14, null), bush(18, FLOWERS)], dead: [deadTree(46), deadTree(38), deadTree(54)] };
  const spLamp = lamp(), spBr = brazier(), spBench = bench(), spBarrel = barrel(), spCrate = crate(), spStump = stump(), spStatue = statue();
  const lampP = (x, y) => add(spLamp, x, y, { r: 2, lamp: 1, lh: 30 });
  const brazP = (x, y, k) => add(spBr, x, y, { r: 3, fire: k || 'warm', fy: 24 });
  // plaza
  [[268, 266], [268, 322], [500, 266], [500, 322], [326, 238], [442, 238], [326, 346], [442, 346]].forEach(a => lampP(a[0], a[1]));
  [[318, 276], [450, 276], [318, 316], [450, 316]].forEach(a => add(spBench, a[0], a[1], { sh: 1 }));
  [[344, 216], [424, 216]].forEach(a => add(spStatue, a[0], a[1], { r: 5 }));
  [[300, 214], [468, 214], [350, 374], [418, 374]].forEach((a, i) => add(bannerPole(i < 2 ? '#1d3f8f' : '#1d3f8f', '#2d5cc8'), a[0], a[1], { r: 2, shw: .3 }));
  // terraza del castillo
  brazP(346, 140); brazP(422, 140); brazP(338, 172); brazP(430, 172); lampP(294, 170); lampP(476, 170); lampP(300, 150); lampP(468, 150);
  [[236, 130], [228, 152], [534, 130], [542, 152], [258, 146], [510, 146]].forEach((a, i) => add(i % 2 ? SP.bush[i % 3] : SP.pg[i % 4], a[0], a[1], { r: 3 }));
  add(bannerPole('#1d3f8f', '#2d5cc8'), 274, 150, { r: 2 }); add(bannerPole('#1d3f8f', '#2d5cc8'), 494, 150, { r: 2 });
  // isla de nieve
  [[60, 108], [74, 94], [48, 126], [64, 134], [214, 118], [226, 134], [204, 98], [218, 92], [196, 152], [118, 90], [100, 160], [40, 112], [180, 82], [232, 108]].forEach((a, i) => { if (mS[a[1] * W + a[0]]) add(SP.ps[i % 3], a[0], a[1], { r: 3 }); });
  add(fence(4, true), 118, 166, { r: 0, sh: 0 }); add(fence(3, true), 170, 168, { r: 0, sh: 0 });
  { const c = mkc(14, 20), q = c.getContext('2d'); q.fillStyle = '#e6eef8'; q.beginPath(); q.ellipse(7, 15, 6, 5, 0, 0, 7); q.fill(); q.beginPath(); q.ellipse(7, 8, 4.5, 4, 0, 0, 7); q.fill(); F(q, '#ff8a3a', 7, 8, 4, 1); F(q, '#222', 5, 6, 1, 1); F(q, '#222', 8, 6, 1, 1); F(q, '#b4c6e0', 3, 15, 3, 2); F(q, '#c83a3a', 3, 11, 8, 2); add(outline(c, '#1a2a44'), 206, 146, { r: 3 }); }
  // isla oscura
  [[578, 138, 34], [690, 140, 38], [566, 112, 28], [706, 120, 30]].forEach((a, i) => add(crystal(a[2], i % 2 ? '#9a6aff' : '#7a4ae0', '#d8c0ff'), a[0], a[1], { r: 4, glow: '154,106,255', gy: a[2] * .5 }));
  [[566, 102, 0], [712, 152, 1], [556, 130, 2], [698, 110, 0]].forEach(a => add(SP.dead[a[2]], a[0], a[1], { r: 3 }));
  [[612, 160], [650, 160], [684, 158], [592, 140]].forEach((a, i) => add(mushroom(10 + (i & 1) * 4, '#7a3ad0', '#e8c8ff'), a[0], a[1], { r: 2, glow: '170,110,255', gy: 5, ga: .35 }));
  add(rock(18, '#4a4068'), 560, 148, { r: 5 }); add(rock(14, '#4a4068'), 706, 160, { r: 4 });
  // isla roja
  brazP(644, 432, 'red'); brazP(692, 432, 'red'); add(rock(20, '#5a2a2c'), 612, 440, { r: 6 }); add(rock(16, '#5a2a2c'), 728, 424, { r: 5 }); add(rock(14, '#5a2a2c'), 640, 392, { r: 4 });
  add(spBarrel, 708, 424, { r: 3 }); add(spCrate, 722, 428, { r: 4 });
  { const c = mkc(26, 16), q = c.getContext('2d'); F(q, '#3a3648', 2, 8, 22, 4); F(q, '#6a6684', 2, 8, 22, 1); F(q, '#3a3648', 5, 4, 16, 4); F(q, '#8a86a2', 5, 4, 16, 1); F(q, '#3a3648', 20, 5, 6, 2); F(q, '#2a2638', 8, 12, 10, 4); add(outline(c, '#0b0716'), 726, 414, { r: 5 }); }
  // muelle
  [[58, 402], [67, 406]].forEach(a => add(spBarrel, a[0], a[1], { r: 3 })); add(spCrate, 82, 404, { r: 4 }); add(spCrate, 244, 402, { r: 4 }); add(spBarrel, 256, 405, { r: 3 });
  for (let x = 46; x < 270; x += 26) if ((x - 46) % 52 === 0) add((() => { const c = mkc(3, 3); return c; })(), x + 2, 392, { noocc: 1, sh: 0, dock: 1 });
  { const tb = (() => { const c = mkc(24, 16), q = c.getContext('2d'); F(q, '#5a4028', 2, 6, 20, 8); F(q, '#8a6440', 0, 3, 24, 4); F(q, '#a87c50', 0, 3, 24, 1); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) F(q, (i + j) % 2 ? '#2a1810' : '#e8dcc0', 4 + i * 4, 4 + j * 2, 4, 2); F(q, '#c83a3a', 17, 3, 2, 2); return outline(c, '#120a06'); })(); add(tb, 126, 436, { r: 6 }); add(tb, 176, 438, { r: 6 }); }
  add(bannerPole('#7a1c2c', '#a82a3c'), 106, 424, { r: 2 }); add(bannerPole('#7a1c2c', '#a82a3c'), 194, 424, { r: 2 });
  add(ship(), 62, 472, { noocc: 1, sh: 0, ship: 1 });
  // faro, glorieta
  add(lighthouse(), 50, 298, { r: 10, rr: 12, sh: 0, beam: 1, by: 230 }); add(gazebo(), 720, 304, { r: 14, rr: 16, gz: 1 });
  [[34, 300], [66, 304]].forEach(a => lampP(a[0], a[1])); add(spBench, 700, 312, {}); add(spBench, 742, 312, {});
  // zona social
  add(spStump, 352, 418, {}); add(spStump, 416, 418, {}); add(spBench, 360, 436, {}); add(spBench, 408, 436, {});
  add(tent('#2a4a8a', '#3f6ac0'), 318, 424, { r: 12, rr: 14, tent: 1 }); add(tent('#7a2a3a', '#a8405a'), 452, 424, { r: 12, rr: 14, tent: 1 });
  add(spCrate, 340, 392, { r: 4 }); add(spBarrel, 348, 396, { r: 3 }); add(spBarrel, 426, 396, { r: 3 });
  add((() => { const c = mkc(8, 36), q = c.getContext('2d'); F(q, '#3a2c20', 3, 2, 2, 34); F(q, '#5a4028', 0, 4, 8, 3); return outline(c, '#120a06'); })(), 336, 390, { r: 2, pole: 1 }); add((() => { const c = mkc(8, 36), q = c.getContext('2d'); F(q, '#3a2c20', 3, 2, 2, 34); F(q, '#5a4028', 0, 4, 8, 3); return outline(c, '#120a06'); })(), 432, 390, { r: 2, pole: 1 });
  // hoguera social y fuente
  P.push({ draw: (q, t) => { F(q, '#2a2638', 372, 410, 24, 6); [[374, 408], [384, 413], [394, 408], [379, 405], [389, 405]].forEach(a => { F(q, '#3a3650', a[0] - 3, a[1] - 2, 7, 4); F(q, '#6a6484', a[0] - 3, a[1] - 2, 7, 1); }); F(q, '#4a3322', 376, 404, 16, 4); F(q, '#6a4a2e', 378, 402, 12, 3); flame(q, 384, 404, t, 2); }, x: 384, y: 413 }); ob({ x: 384, y: 411, r: 12 });
  const basin = fountainBasin();
  P.push({ x: 384, y: 300, draw: (q, t) => { q.drawImage(basin, 384 - 39, 300 - 40); const cx = 384, wy = 291;
    q.save(); q.beginPath(); q.ellipse(cx, wy + 1, 27, 8, 0, 0, 7); q.clip(); for (let k = 0; k < 8; k++) { const a = t * .8 + k * .8, rx = 6 + 18 * ((k * .37 + t * .12) % 1); q.strokeStyle = 'rgba(180,230,255,' + (.5 - rx / 60) + ')'; q.lineWidth = 1; q.beginPath(); q.ellipse(cx + Math.sin(a) * 3, wy + 1, rx, rx * .3, 0, 0, 7); q.stroke(); } q.restore();
    const cy = 262 + Math.sin(t * 1.6) * 2; glow(q, cx, cy + 4, 46, '90,190,255', .55 + .15 * Math.sin(t * 2.2));
    for (let r = 0; r < 34; r++) { const f = r / 34, hw = f < .3 ? 1 + f / .3 * 8 : 9 - (f - .3) / .7 * 7.5; F(q, '#58d0ff', cx - hw, cy - 22 + r, hw * 2, 1); F(q, '#c8f4ff', cx - hw, cy - 22 + r, Math.max(1, hw * .45), 1); F(q, '#2a86d8', cx + hw * .4, cy - 22 + r, Math.max(1, hw * .6), 1); }
    F(q, '#ffffff', cx - 3, cy - 12, 1, 12); for (let k = 0; k < 8; k++) { const a = t * 1.3 + k * .8, rr = 10 + 6 * Math.sin(t * 2 + k), px = cx + Math.cos(a) * rr, py = cy - 6 + Math.sin(a * 2) * 8; F(q, '#d8f6ff', px, py, 1, 1); }
    for (let k = 0; k < 7; k++) { const p = (t * .9 + k / 7) % 1, a = k * .9 + 1; F(q, '#9adcff', cx + Math.cos(a) * (6 + 20 * p), wy - 14 * Math.sin(p * 3.14) + 14 * p * p * 0 - 6 + 16 * p, 1, 1); } } }); ob({ x: 384, y: 296, r: 26 });
  // ---- bosque
  const near = (x, y, d) => { for (const o of occ) if (Math.hypot(o[0] - x, o[1] - y) < d + o[2]) return true; return false; };
  const roadNear = (x, y, m) => { for (const r of ROADS) for (let k = 0; k < r.pts.length - 1; k++) { const a = r.pts[k], b = r.pts[k + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy, t = cl(((x - a[0]) * dx + (y - a[1]) * dy) / L, 0, 1); if (Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t) < r.r + m) return true; } return false; };
  const hsNear = (x, y) => HS.some(h => Math.hypot(x - h.px, y - h.py) < h.r + 12);
  const free = (x, y, m) => !roadNear(x, y, m) && !hsNear(x, y) && !(x > 250 && x < 520 && y < 214) && !(x > 330 && x < 440 && y > 376 && y < 456);
  let nt = 0, nb = 0; seed = 4242;
  for (let tries = 0; tries < 6000 && (nt < 96 || nb < 70); tries++) {
    const x = 120 + rnd() * 540 | 0, y = 150 + rnd() * 270 | 0, i = y * W + x; if (!mM[i] || !walk[i] || !mM[i + 12] || !mM[i - 12] || !mM[(y + 12) * W + x] || !mM[(y - 10) * W + x]) continue;
    const d = ((x - PX) / PRX) ** 2 + ((y - PY) / PRY) ** 2; if (d < 1.22 || !free(x, y, 10)) continue;
    const edge = !mM[(y + 22) * W + x] || !mM[(y + 22) * W + x - 22] || !mM[(y + 22) * W + x + 22];
    if (rnd() < .56 && nt < 96) { if (near(x, y, 11)) continue; const k = rnd(); add(k < .55 ? SP.pg[(rnd() * 4) | 0] : SP.oak[(rnd() * 3) | 0], x, y, { r: 3 }); nt++; }
    else if (nb < 70) { if (near(x, y, 7)) continue; add(SP.bush[(rnd() * 3) | 0], x, y, { r: 0, sh: 1 }); nb++; }
  }
  // parterres alrededor de la plaza
  for (let a = 0; a < 360; a += 12) { const rad = a * Math.PI / 180, x = PX + Math.cos(rad) * (PRX + 12), y = PY + Math.sin(rad) * (PRY + 9); if (!mM[(y | 0) * W + (x | 0)] || roadNear(x, y, 6) || near(x, y, 5)) continue; add(SP.bush[(a / 12 | 0) % 3], x | 0, y | 0, { r: 0 }); }
  // paso final: obstáculos de tronco ya añadidos; bloqueo de props en el mapa de paso se hace en lobby.js
  // ---- luciérnagas y brillos
  const ff = Array.from({ length: 40 }, () => { let x, y, n = 0; do { x = 120 + rnd() * 540; y = 150 + rnd() * 280; n++; } while (!walk[(y | 0) * W + (x | 0)] && n < 50); return { x, y, p: rnd() * 6.28, s: .4 + rnd() * .8, r: 4 + rnd() * 10 }; });
  const smoke = Array.from({ length: 7 }, (_, k) => k);
  const ripples = []; for (let k = 0; k < 90; k++) { const x = 4 + rnd() * 190 | 0, y = 364 + rnd() * 96 | 0; if (mW[y * W + x] && !(y > 388 && y < 416 && x > 36) && !(y > 412 && y < 452 && x > 98 && x < 198) && !(x < 112 && y > 420)) ripples.push({ x, y, p: rnd() * 6.28, s: .5 + rnd() }); }
  const bulbs = []; for (const [ax, bx] of [[336, 432]]) for (let k = 0; k <= 12; k++) { const u = k / 12, x = ax + (bx - ax) * u, y = 358 + 11 * Math.sin(u * Math.PI); bulbs.push([x, y, k]); }
  g.strokeStyle = 'rgba(30,20,14,.9)'; g.lineWidth = 1; g.beginPath(); bulbs.forEach((b, i) => i ? g.lineTo(b[0], b[1]) : g.moveTo(b[0], b[1])); g.stroke();
  const wf = [{ x: 486, y: 424, h: 70, w: 8 }, { x: 150, y: 456, h: 56, w: 10 }, { x: 330, y: 452, h: 56, w: 6 }];
  // viñeta
  const vig = mkc(W, H), vg = vig.getContext('2d'), rg = vg.createRadialGradient(W / 2, H * .5, H * .38, W / 2, H * .5, H * .95); rg.addColorStop(0, 'rgba(4,2,16,0)'); rg.addColorStop(1, 'rgba(4,2,16,.62)'); vg.fillStyle = rg; vg.fillRect(0, 0, W, H);
  // luz cálida sobre la plaza (estática)
  glow(g, 384, 292, 150, '255,200,120', .1);
  // ---- animación del mundo (antes de los sprites)
  const anim = (q, t, pu) => {
    // portal
    q.save(); q.beginPath(); q.moveTo(367, 128); q.lineTo(367, 100); q.arc(384, 100, 17, Math.PI, 0); q.lineTo(401, 128); q.clip();
    const gr = q.createLinearGradient(0, 84, 0, 128); gr.addColorStop(0, '#0c2a78'); gr.addColorStop(.5, '#1c5ad8'); gr.addColorStop(1, '#6ab8ff'); q.fillStyle = gr; q.fillRect(366, 82, 36, 48);
    for (let k = 0; k < 6; k++) { const x = 369 + k * 6 + Math.sin(t * 1.4 + k) * 2; q.fillStyle = 'rgba(190,230,255,' + (.25 + .2 * Math.sin(t * 2 + k * 1.7)) + ')'; q.fillRect(x, 90 + Math.sin(t + k) * 4, 2, 38); }
    q.fillStyle = 'rgba(255,255,255,.5)'; q.fillRect(382, 96 + (pu * 2 | 0), 4, 30); q.restore();
    glow(q, 384, 118, 52, '70,150,255', .45 + .2 * pu); glow(q, 384, 150, 40, '70,150,255', .18 + .1 * pu);
    // ventanas del castillo (parpadeo leve)
    // agua del mar
    for (const r of ripples) { const a = .25 + .35 * Math.abs(Math.sin(t * r.s + r.p)); q.globalAlpha = a; F(q, '#9adcff', r.x + Math.sin(t * .6 + r.p) * 2, r.y, 3 + (r.p > 3 ? 2 : 0), 1); } q.globalAlpha = 1;
    // estanque
    for (let k = 0; k < 5; k++) { const a = .25 + .3 * Math.abs(Math.sin(t * 1.2 + k)); q.globalAlpha = a; F(q, '#bfe8ff', pondX - 14 + k * 6 + Math.sin(t + k) * 2, pondY - 3 + (k % 2) * 3, 3, 1); } q.globalAlpha = 1;
    // cascadas
    for (const f of wf) { for (let j = 0; j < f.w; j++) { const x = f.x - f.w / 2 + j; for (let y = 0; y < f.h; y += 3) { const yy = f.y + ((y + t * 46 + j * 5) % f.h); const fade = 1 - (yy - f.y) / f.h; q.globalAlpha = Math.max(0, .85 * fade + .1); F(q, (j + y) % 3 ? '#8ad0ff' : '#e8f8ff', x, yy, 1, 3); } } q.globalAlpha = 1; for (let k = 0; k < 7; k++) { const p = (t * .5 + k / 7) % 1; q.globalAlpha = .35 * (1 - p); F(q, '#cfeaff', f.x - 8 + k * 3 + Math.sin(t * 2 + k) * 4, f.y + f.h - 2 + p * 6, 6, 2); } q.globalAlpha = 1; }
    // lava
    for (let k = 0; k < lava.length; k++) glow(q, lava[k][0], lava[k][1], 24, '255,90,30', .3 + .15 * Math.sin(t * 2 + k)); glow(q, 668, 414, 30, '255,70,30', .45 + .15 * Math.sin(t * 3)); glow(q, 716, 402, 26, '255,120,40', .45 + .15 * Math.sin(t * 4));
    for (let k = 0; k < 14; k++) { const p = (t * .3 + k / 14) % 1, a = lava[(k % (lava.length - 1))]; q.globalAlpha = 1 - p; F(q, '#ffc24a', a[0] + Math.sin(k * 3 + t) * 6, a[1] - p * 22, 1, 1); } q.globalAlpha = 1;
    // círculo ritual
    q.save(); q.translate(630, 146); q.scale(1, .38); q.strokeStyle = 'rgba(170,110,255,' + (.55 + .3 * pu) + ')'; q.lineWidth = 2; q.beginPath(); q.arc(0, 0, 30, 0, 7); q.stroke(); q.lineWidth = 1; q.beginPath(); q.arc(0, 0, 22, 0, 7); q.stroke(); q.rotate(t * .4); for (let k = 0; k < 8; k++) { q.rotate(Math.PI / 4); q.fillStyle = 'rgba(210,170,255,' + (.6 + .3 * Math.sin(t * 2 + k)) + ')'; q.fillRect(24, -1, 5, 2); } q.restore(); glow(q, 630, 146, 40, '150,90,255', .3 + .15 * pu);
    glow(q, 636, 106, 30, '150,90,255', .22);
    // humo de la chimenea
    for (const k of smoke) { const p = (t * .14 + k / 7) % 1; q.globalAlpha = .55 * (1 - p); const r = 2 + p * 5; q.fillStyle = '#d8e4f4'; q.beginPath(); q.arc(174 + Math.sin(p * 6 + k) * 4 + p * 12, 60 - p * 38, r, 0, 7); q.fill(); } q.globalAlpha = 1;
    // luces de colores
    for (const b of bulbs) { const on = .55 + .45 * Math.sin(t * 2.4 + b[2] * 1.3), col = ['255,120,120', '255,220,110', '130,230,150', '130,190,255'][b[2] % 4]; glow(q, b[0], b[1] + 1, 7, col, .7 * on); F(q, '#fff6d0', b[0], b[1], 1, 2); }
    // antorchas del muelle
    for (let x = 46; x < 270; x += 52) flame(q, x + 2, 383, t, 1);
    glow(q, 150, 432, 50, '255,200,120', .12);
  };
  const top = (q, t) => { // luciérnagas
    for (const f of ff) { const x = f.x + Math.sin(t * f.s + f.p) * f.r, y = f.y + Math.cos(t * f.s * .8 + f.p * 2) * f.r * .6, a = .35 + .65 * Math.abs(Math.sin(t * 1.5 + f.p)); glow(q, x, y, 5, '200,255,140', .6 * a); F(q, '#f4ffc8', x, y, 1, 1); }
  };
  const stars = Array.from({ length: 120 }, () => ({ x: rnd() * W, y: rnd() * H * .8, p: rnd() * 6.28, s: .5 + rnd() * 1.2 }));
  const clouds = Array.from({ length: 7 }, () => ({ x: rnd() * W, y: 24 + rnd() * 420, w: 60 + rnd() * 90, v: 2 + rnd() * 4 }));
  return { sky, world, walk, props: P, obst, stars, clouds, anim, top, vig, lava };
}
window.LOBBYMAP = { W, H, HS, build, flame, glow, spawn: [384, 332] };
})();
