// ===== CHAT DE TEXTO Y DE VOZ (cooperativo) =====
// Se carga después de net.js. Usa sus ganchos: NET.ext (mensajes), NET.sub (eventos), NET.send / NET.sendTo.
//  · Texto: el invitado envía {k:'chat'}; el anfitrión lo valida (largo, ritmo) y lo reparte a todos.
//  · Voz: audio directo entre jugadores (WebRTC, malla de hasta 4). La sala solo reenvía la señalización:
//    invitado -> anfitrión -> destinatario ({k:'sig'}). Quien tiene el id menor es quien ofrece la conexión.
//  · Teclas: Enter o T = escribir · V = silenciar/activar micrófono. Botones arriba en el centro.
(function () {
'use strict';
const NET = window.NET; if (!NET) return;
const $_ = id => document.getElementById(id);
const ICE = (() => { try { const s = JSON.parse(localStorage.getItem('jur_mp_ice') || 'null'); if (Array.isArray(s) && s.length) return s; } catch (e) {} return [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }]; })();
const me = () => NET.id;
const isHost = () => NET.on && NET.host;

// ============================================================= TEXTO
const LINES = [], MAXL = 8, TTL = 12000, lastMsg = {};
let log = null, box = null, inp = null, bar = null, typing = false;
function ui() {
  if (bar) return;
  const css = document.createElement('style');
  css.textContent = '#mpbar{position:fixed;z-index:31;top:calc(max(4px,env(safe-area-inset-top)) + 22px);left:50%;transform:translateX(-50%);display:none;gap:6px}'
    + '#mpbar button{width:34px;height:34px;border-radius:50%;border:1px solid #7a5a1e;background:rgba(11,7,20,.78);color:#ffe9a0;font-size:15px;line-height:1;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}'
    + '#mpbar button.on{background:#1d4d2c;border-color:#7dff9a}#mpbar button.off{background:#5a1e26;border-color:#ff7a8a}#mpbar button.talk{box-shadow:0 0 0 3px rgba(125,255,154,.55)}'
    + '#mpchat{position:fixed;z-index:30;left:50%;transform:translateX(-50%);bottom:max(8px,env(safe-area-inset-bottom));width:min(62vw,420px);display:none;pointer-events:none;font:10px/1.35 "Press Start 2P",monospace}'
    + '#mpchat div{background:rgba(5,3,10,.62);color:#e8e0ff;padding:3px 6px;margin-top:2px;word-break:break-word;text-shadow:1px 1px 0 #000;transition:opacity .6s}'
    + '#mpchat b{font-weight:normal}'
    + '#mpci{position:fixed;z-index:32;top:calc(max(4px,env(safe-area-inset-top)) + 62px);left:50%;transform:translateX(-50%);width:min(88vw,420px);box-sizing:border-box;display:none;padding:9px;background:#0b0714;border:1px solid #c9a54a;color:#fff;font:10px "Press Start 2P",monospace;border-radius:2px}';
  document.head.appendChild(css);
  bar = document.createElement('div'); bar.id = 'mpbar';
  bar.innerHTML = '<button id="mpb-c" title="Chat (Enter)">💬</button><button id="mpb-v" title="Unirse al chat de voz">🎧</button><button id="mpb-m" title="Silenciar micrófono (V)" style="display:none">🎤</button>';
  document.body.appendChild(bar);
  log = document.createElement('div'); log.id = 'mpchat'; document.body.appendChild(log);
  inp = document.createElement('input'); inp.id = 'mpci'; inp.maxLength = 120; inp.placeholder = 'Escribe y pulsa Enter'; inp.autocomplete = 'off'; inp.setAttribute('enterkeyhint', 'send'); document.body.appendChild(inp);
  inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); const t = inp.value; closeInput(); if (t.trim()) sendChat(t); } else if (e.key === 'Escape') { e.preventDefault(); closeInput(); } });
  inp.addEventListener('blur', () => { setTimeout(closeInput, 120); });
  $_('mpb-c').onclick = () => (typing ? closeInput() : openInput());
  $_('mpb-v').onclick = () => (V.on ? leaveVoice() : joinVoice());
  $_('mpb-m').onclick = toggleMute;
}
function openInput() { if (!NET.on) return; ui(); typing = true; try { relAll(); } catch (e) {} inp.style.display = 'block'; inp.value = ''; inp.focus(); render(); }
function closeInput() { if (!typing) return; typing = false; if (inp) { inp.style.display = 'none'; inp.blur(); } render(); }
function addLine(id, name, text, sys) {
  ui(); LINES.push({ id, name, text, sys, t: Date.now() }); if (LINES.length > 40) LINES.shift(); render();
  if (!sys && id !== me() && window.sfx) { try { sfx('ui'); } catch (e) {} }
}
function render() {
  if (!log) return; const now = Date.now(); log.textContent = '';
  const show = LINES.filter(l => typing || now - l.t < TTL).slice(typing ? -MAXL * 2 : -MAXL);
  for (const l of show) {
    const d = document.createElement('div');
    if (l.sys) { d.textContent = l.text; d.style.color = '#a89cc8'; }
    else { const b = document.createElement('b'); b.textContent = l.name + ': '; b.style.color = NET.col(l.id); d.appendChild(b); d.appendChild(document.createTextNode(l.text)); }
    if (!typing && now - l.t > TTL - 1500) d.style.opacity = '.35';
    log.appendChild(d);
  }
  log.style.display = NET.on && show.length ? 'block' : 'none';
}
const clean = s => String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
function sendChat(t) {
  t = clean(t); if (!t || !NET.on) return;
  if (isHost()) { addLine(0, NET.name, t); NET.send({ k: 'chat', id: 0, n: NET.name, m: t }); }
  else NET.send({ k: 'chat', m: t });
}
window.netChat = sendChat;
NET.ext.chat = m => {
  if (isHost()) { // llega de un invitado
    const id = m.from, now = Date.now(), t = clean(m.m); if (id == null || !t || now - (lastMsg[id] || 0) < 400) return; lastMsg[id] = now;
    const n = NET.nameOf(id); addLine(id, n, t); NET.send({ k: 'chat', id, n, m: t });
  } else addLine(m.id, String(m.n || '').slice(0, 14), clean(m.m)); // el anfitrión también devuelve el propio mensaje
};
setInterval(() => { if (log && !typing && LINES.length) render(); }, 1000);
addEventListener('keydown', e => {
  if (!NET.on || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA') return;
  const k = e.key.toLowerCase();
  if ((k === 'enter' || k === 't') && (G.mode === 'play' || G.mode === 'menu')) { e.preventDefault(); e.stopPropagation(); openInput(); }
  else if (k === 'v' && V.on) { e.preventDefault(); toggleMute(); }
}, true);

// ============================================================= VOZ
const V = { on: false, mute: false, stream: null, pcs: {}, aud: {}, pend: {}, vox: new Set(), ac: null, an: {}, timer: 0, hold: {} };
const secure = () => window.isSecureContext !== false;
function setBtns() {
  if (!bar) return; const b = $_('mpb-v'), m = $_('mpb-m');
  b.className = V.on ? 'on' : ''; b.title = V.on ? 'Salir del chat de voz' : 'Unirse al chat de voz'; b.textContent = V.on ? '📞' : '🎧';
  m.style.display = V.on ? '' : 'none'; m.className = V.mute ? 'off' : (NET.speak[me()] ? 'talk on' : 'on'); m.textContent = V.mute ? '🔇' : '🎤';
}
async function joinVoice() {
  if (V.on || !NET.on) return;
  if (!secure() || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { addLine(0, '', 'El micrófono necesita abrir el juego con HTTPS (o en localhost).', true); return; }
  if (typeof RTCPeerConnection === 'undefined') { addLine(0, '', 'Este navegador no admite chat de voz.', true); return; }
  try { V.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false }); }
  catch (e) { addLine(0, '', 'No se pudo usar el micrófono (¿permiso denegado?).', true); return; }
  if (!NET.on) { stopStream(); return; }
  V.on = true; V.mute = false; V.vox.add(me());
  announce(true);
  for (const id of V.vox) if (id !== me() && me() < id) connect(id);
  V.timer = setInterval(meter, 110); setBtns(); addLine(0, '', 'Chat de voz activado. Usa auriculares para evitar el eco.', true);
}
function stopStream() { if (V.stream) { V.stream.getTracks().forEach(t => { try { t.stop(); } catch (e) {} }); V.stream = null; } }
function leaveVoice(silent) {
  if (!V.on && !V.stream) return;
  const was = V.on; V.on = false; clearInterval(V.timer); stopStream();
  for (const id of Object.keys(V.pcs)) closePeer(+id);
  V.vox.delete(me()); NET.speak = {}; for (const k in V.an) delete V.an[k];
  if (was && !silent && NET.on) announce(false);
  setBtns();
}
function toggleMute() {
  if (!V.on || !V.stream) return; V.mute = !V.mute; V.stream.getAudioTracks().forEach(t => { t.enabled = !V.mute; }); if (V.mute) NET.speak[me()] = false; setBtns();
}
function announce(on) {
  if (isHost()) { if (on) V.vox.add(0); else V.vox.delete(0); NET.send({ k: 'vx', id: 0, on: on ? 1 : 0 }); }
  else NET.send({ k: 'vx', on: on ? 1 : 0 });
}
NET.ext.vx = m => {
  if (isHost()) { // de un invitado: se anota y se reparte
    const id = m.from; if (id == null) return; if (m.on) V.vox.add(id); else { V.vox.delete(id); closePeer(id); }
    NET.send({ k: 'vx', id, on: m.on ? 1 : 0 }); if (m.on && V.on && me() < id) connect(id);
  } else {
    if (m.id === me()) return; if (m.on) { V.vox.add(m.id); if (V.on && me() < m.id) connect(m.id); } else { V.vox.delete(m.id); closePeer(m.id); }
  }
};
NET.ext.vxl = m => { if (!isHost()) { (m.ids || []).forEach(i => { if (i !== me()) V.vox.add(i); }); if (V.on) for (const id of V.vox) if (me() < id && id !== me()) connect(id); } };
function sig(to, d) { if (isHost()) NET.sendTo(to, { k: 'sig', from: 0, d }); else NET.send({ k: 'sig', to, d }); }
NET.ext.sig = m => {
  if (isHost()) { if (m.to === 0 || m.to == null) onSig(m.from, m.d); else NET.sendTo(m.to, { k: 'sig', from: m.from, d: m.d }); }
  else onSig(m.from, m.d);
};
function mkPc(id) {
  const pc = new RTCPeerConnection({ iceServers: ICE }); V.pcs[id] = pc; V.pend[id] = [];
  if (V.stream) V.stream.getTracks().forEach(t => pc.addTrack(t, V.stream));
  pc.onicecandidate = e => { if (e.candidate) sig(id, { t: 'ice', c: e.candidate.toJSON ? e.candidate.toJSON() : e.candidate }); };
  pc.ontrack = e => attach(id, e.streams && e.streams[0] ? e.streams[0] : new MediaStream([e.track]));
  pc.onconnectionstatechange = () => { if (pc.connectionState === 'failed' || pc.connectionState === 'closed') { if (V.pcs[id] === pc) closePeer(id); } };
  return pc;
}
async function connect(id) {
  if (!V.on || V.pcs[id]) return;
  const pc = mkPc(id);
  try { const o = await pc.createOffer(); await pc.setLocalDescription(o); sig(id, { t: 'offer', sdp: pc.localDescription || o }); }
  catch (e) { closePeer(id); }
}
async function onSig(from, d) {
  if (from == null || !d || !V.on) return;
  try {
    if (d.t === 'offer') {
      if (V.pcs[from]) closePeer(from);
      const pc = mkPc(from); await pc.setRemoteDescription(d.sdp); await flush(from);
      const a = await pc.createAnswer(); await pc.setLocalDescription(a); sig(from, { t: 'answer', sdp: pc.localDescription || a });
    } else if (d.t === 'answer') { const pc = V.pcs[from]; if (pc) { await pc.setRemoteDescription(d.sdp); await flush(from); } }
    else if (d.t === 'ice') { const pc = V.pcs[from]; if (!pc) return; if (pc.remoteDescription) { try { await pc.addIceCandidate(d.c); } catch (e) {} } else (V.pend[from] = V.pend[from] || []).push(d.c); }
  } catch (e) { closePeer(from); }
}
async function flush(id) { const pc = V.pcs[id], q = V.pend[id] || []; V.pend[id] = []; for (const c of q) { try { await pc.addIceCandidate(c); } catch (e) {} } }
function attach(id, stream) {
  let a = V.aud[id]; if (!a) { a = V.aud[id] = new Audio(); a.autoplay = true; a.playsInline = true; }
  a.srcObject = stream; const p = a.play(); if (p && p.catch) p.catch(() => {});
  tap(id, stream);
}
function closePeer(id) {
  const pc = V.pcs[id]; if (pc) { delete V.pcs[id]; try { pc.onconnectionstatechange = null; pc.close(); } catch (e) {} }
  const a = V.aud[id]; if (a) { try { a.pause(); a.srcObject = null; } catch (e) {} delete V.aud[id]; }
  delete V.pend[id]; delete V.an[id]; NET.speak[id] = false;
}
// ---- quién está hablando (medidor de nivel)
function ctx() { if (!V.ac) { const C = window.AudioContext || window.webkitAudioContext; if (C) V.ac = new C(); } if (V.ac && V.ac.state === 'suspended') V.ac.resume(); return V.ac; }
function tap(id, stream) {
  try { const c = ctx(); if (!c) return; const src = c.createMediaStreamSource(stream), an = c.createAnalyser(); an.fftSize = 256; src.connect(an); V.an[id] = { an, buf: new Uint8Array(an.fftSize) }; } catch (e) {}
}
function meter() {
  const now = Date.now();
  if (V.stream && !V.an[me()]) tap(me(), V.stream);
  for (const id in V.an) {
    const o = V.an[id]; if (!o.an.getByteTimeDomainData) continue; o.an.getByteTimeDomainData(o.buf);
    let s = 0; for (let i = 0; i < o.buf.length; i++) { const v = (o.buf[i] - 128) / 128; s += v * v; }
    const lvl = Math.sqrt(s / o.buf.length) || 0;
    if (lvl > .035 && !(+id === me() && V.mute)) V.hold[id] = now + 280;
    NET.speak[id] = (V.hold[id] || 0) > now;
  }
  setBtns();
}
document.addEventListener('click', () => { if (V.ac && V.ac.state === 'suspended') V.ac.resume(); for (const id in V.aud) { const p = V.aud[id].play && V.aud[id].play(); if (p && p.catch) p.catch(() => {}); } }, true);

// ============================================================= ciclo de vida
NET.sub('start', () => { ui(); bar.style.display = 'flex'; LINES.length = 0; render(); setBtns(); });
NET.sub('leave', () => { leaveVoice(true); V.vox.clear(); closeInput(); LINES.length = 0; if (bar) bar.style.display = 'none'; if (log) log.style.display = 'none'; });
NET.sub('peer+', id => { addLine(0, '', NET.nameOf(id) + ' se une a la sala', true); if (isHost() && V.vox.size) NET.sendTo(id, { k: 'vxl', ids: [...V.vox] }); });
NET.sub('peer-', id => { addLine(0, '', 'Un jugador abandona la sala', true); V.vox.delete(id); closePeer(id); if (isHost()) NET.send({ k: 'vx', id, on: 0 }); });
setInterval(() => { // limpieza: pares que ya no están en la sala
  if (!NET.on || !V.on) return; const ids = NET.allIds();
  for (const id of Object.keys(V.pcs)) if (!ids.includes(+id)) { V.vox.delete(+id); closePeer(+id); }
}, 3000);
window.netVoice = { join: joinVoice, leave: () => leaveVoice(), mute: toggleMute, state: V };
})();
