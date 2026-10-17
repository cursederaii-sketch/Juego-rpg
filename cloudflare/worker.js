import { DurableObject } from 'cloudflare:workers';

const MAX_PLAYERS = 4;
const MAX_MESSAGE_CHARS = 256 * 1024;
const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

function cleanName(value) {
  return String(value || '').replace(/[<>&"'`]/g, '').trim().slice(0, 14) || 'Sin nombre';
}
function cleanText(value, max = 100) {
  return String(value || '').replace(/[<>`]/g, '').trim().slice(0, max);
}
function tx(ws, message) {
  try {
    if (ws && ws.readyState === 1) ws.send(JSON.stringify(message));
  } catch (_) { /* El socket puede cerrarse entre la comprobación y el envío. */ }
}
function safeAttachment(ws) {
  try { return ws.deserializeAttachment() || {}; }
  catch (_) { return {}; }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/health' && request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('ok · Juramento Cloudflare multiplayer', {
        status: 200,
        headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
      });
    }

    // El cliente actual de Juramento conecta al origen raíz con ws:// o wss://.
    // Aceptamos cualquier ruta WebSocket para mantener compatibles también los enlaces existentes.
    if (request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
      const id = env.JURAMENTO_HUB.idFromName('juramento-global');
      return env.JURAMENTO_HUB.get(id).fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};

/**
 * Coordinador compatible con el protocolo que ya utiliza net.js y lobby.js.
 * Un único objeto global conserva el lobby y enruta todas las sesiones de una beta pequeña.
 * La información mínima de cada socket viaja en su attachment para sobrevivir a hibernación.
 */
export class JuramentoHub extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
    this.env = env;
  }

  async fetch(request) {
    if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('Se requiere WebSocket', { status: 426 });
    }
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ role: null });
    return new Response(null, { status: 101, webSocket: client });
  }

  sockets() {
    return this.ctx.getWebSockets().filter(ws => ws.readyState === 1);
  }
  data(ws) { return safeAttachment(ws); }
  save(ws, data) {
    try { ws.serializeAttachment(data); } catch (_) { /* Socket cerrado. */ }
  }
  sendAll(sockets, message) {
    const wire = JSON.stringify(message);
    for (const ws of sockets) {
      try { if (ws.readyState === 1) ws.send(wire); } catch (_) {}
    }
  }
  hubs() {
    return this.sockets().filter(ws => this.data(ws).role === 'hub');
  }
  roomSockets(code) {
    return this.sockets().filter(ws => {
      const a = this.data(ws);
      return a.role === 'room' && a.room === code;
    });
  }
  hubPlayers() {
    return this.hubs().map(ws => {
      const a = this.data(ws);
      return [a.hid, a.name, a.x ?? 192, a.y ?? 176, a.hid];
    });
  }
  publicRooms() {
    const out = [];
    for (const ws of this.sockets()) {
      const a = this.data(ws);
      if (a.role !== 'room' || a.pid !== 0 || !a.pub) continue;
      const members = this.roomSockets(a.room);
      out.push({ c: a.room, n: a.name, g: a.reg || '', p: members.length, m: a.max || MAX_PLAYERS });
    }
    return out.slice(0, 40);
  }
  publishHubState() {
    const hubs = this.hubs();
    if (hubs.length) this.sendAll(hubs, { t: 'hs', o: this.sockets().length, p: this.hubPlayers() });
  }
  publishRoomList() {
    const hubs = this.hubs();
    if (hubs.length) this.sendAll(hubs, { t: 'rl', o: this.sockets().length, r: this.publicRooms() });
  }
  roomHost(code) {
    return this.roomSockets(code).find(ws => this.data(ws).pid === 0) || null;
  }
  newRoomCode() {
    for (let attempt = 0; attempt < 80; attempt++) {
      let code = '';
      for (let i = 0; i < 4; i++) code += ROOM_ALPHABET[Math.floor(Math.random() * ROOM_ALPHABET.length)];
      if (!this.roomHost(code)) return code;
    }
    return null;
  }

  async webSocketMessage(ws, rawMessage) {
    if (typeof rawMessage !== 'string' || rawMessage.length > MAX_MESSAGE_CHARS) {
      tx(ws, { t: 'err', m: 'Mensaje no válido o demasiado grande' });
      return;
    }
    let message;
    try { message = JSON.parse(rawMessage); } catch (_) { return; }
    if (!message || typeof message.t !== 'string') return;

    const a = this.data(ws);
    switch (message.t) {
      case 'hub': {
        if (a.role === 'hub' || a.role === 'room') return;
        const used = this.hubs().map(s => this.data(s).hid).filter(Number.isFinite);
        const hid = used.length ? Math.max(...used) + 1 : 1;
        this.save(ws, { role: 'hub', hid, name: cleanName(message.n), x: 192, y: 176, lastChat: 0 });
        tx(ws, { t: 'hub', id: hid, o: this.sockets().length, r: this.publicRooms(), p: this.hubPlayers() });
        this.publishHubState();
        return;
      }
      case 'hp': {
        if (a.role !== 'hub') return;
        const x = Number(message.x), y = Number(message.y);
        if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 384 || y < 0 || y > 256) return;
        this.save(ws, { ...a, x: Math.round(x), y: Math.round(y) });
        this.publishHubState();
        return;
      }
      case 'hc': {
        if (a.role !== 'hub') return;
        const text = cleanText(message.m, 100);
        if (!text) return;
        const now = Date.now();
        if (now - (a.lastChat || 0) < 700) return;
        this.save(ws, { ...a, lastChat: now });
        this.sendAll(this.hubs(), { t: 'hc', id: a.hid, n: a.name, m: text });
        return;
      }
      case 'create': {
        if (a.role === 'room') return;
        const code = this.newRoomCode();
        if (!code) { tx(ws, { t: 'err', m: 'No hay códigos libres; inténtalo de nuevo' }); return; }
        const host = {
          role: 'room', room: code, pid: 0, name: cleanName(message.n),
          pub: message.pub === undefined ? 0 : (message.pub ? 1 : 0),
          reg: cleanText(message.reg, 24), max: MAX_PLAYERS,
        };
        this.save(ws, host);
        tx(ws, { t: 'room', c: code, id: 0, max: MAX_PLAYERS });
        this.publishHubState();
        this.publishRoomList();
        return;
      }
      case 'join': {
        if (a.role === 'room') return;
        const code = String(message.c || '').toUpperCase().trim();
        const host = this.roomHost(code);
        if (!host) { tx(ws, { t: 'err', m: 'Esa sala no existe' }); return; }
        const members = this.roomSockets(code);
        const used = new Set(members.map(s => this.data(s).pid));
        let pid = -1;
        for (let i = 1; i < MAX_PLAYERS; i++) if (!used.has(i)) { pid = i; break; }
        if (pid < 0) { tx(ws, { t: 'err', m: 'Sala llena' }); return; }
        const guest = { role: 'room', room: code, pid, name: cleanName(message.n), pub: 0, reg: '', max: MAX_PLAYERS };
        this.save(ws, guest);
        tx(ws, { t: 'room', c: code, id: pid, max: MAX_PLAYERS });
        tx(host, { t: 'peer+', id: pid, n: guest.name });
        this.publishHubState();
        this.publishRoomList();
        return;
      }
      case 'g': {
        if (a.role !== 'room') return;
        const members = this.roomSockets(a.room);
        const host = members.find(s => this.data(s).pid === 0);
        if (!host) { tx(ws, { t: 'closed' }); return; }
        if (a.pid === 0) {
          const to = message.to;
          delete message.to;
          const wire = JSON.stringify(message);
          const recipients = to == null
            ? members.filter(s => s !== ws && this.data(s).pid !== 0)
            : members.filter(s => this.data(s).pid === Number(to));
          for (const recipient of recipients) {
            try { if (recipient.readyState === 1) recipient.send(wire); } catch (_) {}
          }
        } else {
          message.from = a.pid;
          tx(host, message);
        }
        return;
      }
      default:
        return;
    }
  }

  async webSocketClose(ws) { this.leave(ws); }
  async webSocketError(ws) { this.leave(ws); }

  leave(ws) {
    const a = this.data(ws);
    if (!a.role) return;
    this.save(ws, { role: null });

    if (a.role === 'hub') {
      this.publishHubState();
      this.publishRoomList();
      return;
    }

    if (a.role !== 'room' || !a.room) return;
    const members = this.roomSockets(a.room);
    if (a.pid === 0) {
      // Si se va el anfitrión, avisar y cerrar los invitados de esa sala.
      for (const peer of members) {
        const pa = this.data(peer);
        if (pa.pid === 0) continue;
        tx(peer, { t: 'closed' });
        this.save(peer, { role: null });
        try { peer.close(1000, 'El anfitrión salió de la sala'); } catch (_) {}
      }
    } else {
      const host = members.find(peer => this.data(peer).pid === 0);
      if (host) tx(host, { t: 'peer-', id: a.pid });
    }
    this.publishHubState();
    this.publishRoomList();
  }
}
