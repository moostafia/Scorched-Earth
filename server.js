#!/usr/bin/env node
/* ============================================================
   SCORCHED EARTH — LAN server
   Zero dependencies. Needs only Node.js (v14+).
   Run:   node server.js
   Then every device on the SAME Wi-Fi opens the URL it prints.
   It serves the game and relays WebSocket messages between players.
   ============================================================ */
const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const GAME_FILE = path.join(__dirname, 'scorched-earth.html');

/* ---------- static HTTP: serve the game ---------- */
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html' || req.url.startsWith('/?')) {
    fs.readFile(GAME_FILE, (err, buf) => {
      if (err) { res.writeHead(500); res.end('Cannot read scorched-earth.html — keep it next to server.js'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(buf);
    });
  } else if (req.url === '/health') {
    res.writeHead(200); res.end('ok');
  } else {
    res.writeHead(404); res.end('not found');
  }
});

/* ---------- minimal RFC6455 WebSocket (no deps) ---------- */
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
let nextId = 1;
const clients = new Map(); // id -> { socket, name, buf }
let hostId = null;

function send(sock, obj) {
  const data = Buffer.from(JSON.stringify(obj));
  const len = data.length;
  let header;
  if (len < 126) {
    header = Buffer.alloc(2); header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4); header[1] = 126; header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10); header[1] = 127;
    header.writeUInt32BE(Math.floor(len / 4294967296), 2);
    header.writeUInt32BE(len >>> 0, 6);
  }
  header[0] = 0x81; // FIN + text
  try { sock.write(Buffer.concat([header, data])); } catch (e) {}
}
function broadcast(obj, exceptId) {
  for (const [id, c] of clients) if (id !== exceptId) send(c.socket, obj);
}
function roster() {
  return { t: 'roster', host: hostId,
    players: [...clients.entries()].map(([id, c]) => ({ id, name: c.name || ('Player ' + id), host: id === hostId })) };
}

server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) { socket.destroy(); return; }
  const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\nConnection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: ' + accept + '\r\n\r\n');

  const id = nextId++;
  clients.set(id, { socket, name: null, buf: Buffer.alloc(0) });
  if (hostId === null) hostId = id;
  send(socket, { t: 'welcome', id, host: hostId });

  socket.on('data', (chunk) => {
    const c = clients.get(id); if (!c) return;
    c.buf = Buffer.concat([c.buf, chunk]);
    parseFrames(id);
  });
  const drop = () => {
    if (!clients.has(id)) return;
    clients.delete(id);
    const wasHost = (id === hostId);
    if (wasHost) hostId = clients.size ? Math.min(...clients.keys()) : null;
    broadcast({ t: 'peerleft', id, newHost: hostId });
    broadcast(roster());
  };
  socket.on('close', drop);
  socket.on('error', drop);
});

function parseFrames(id) {
  const c = clients.get(id); if (!c) return;
  let buf = c.buf;
  while (buf.length >= 2) {
    const fin = (buf[0] & 0x80) !== 0;
    const opcode = buf[0] & 0x0f;
    const masked = (buf[1] & 0x80) !== 0;
    let len = buf[1] & 0x7f;
    let off = 2;
    if (len === 126) { if (buf.length < 4) break; len = buf.readUInt16BE(2); off = 4; }
    else if (len === 127) { if (buf.length < 10) break; len = buf.readUInt32BE(6); off = 10; }
    if (buf.length < off + (masked ? 4 : 0) + len) break;
    let payload;
    if (masked) {
      const mask = buf.slice(off, off + 4); off += 4;
      payload = Buffer.alloc(len);
      for (let i = 0; i < len; i++) payload[i] = buf[off + i] ^ mask[i & 3];
    } else {
      payload = buf.slice(off, off + len);
    }
    off += len;
    buf = buf.slice(off);

    if (opcode === 0x8) { try { c.socket.end(); } catch (e) {} return; }       // close
    else if (opcode === 0x9) { sendPong(c.socket, payload); }                  // ping
    else if (opcode === 0x1) { handleMessage(id, payload.toString('utf8')); }  // text
  }
  c.buf = buf;
}
function sendPong(sock, payload) {
  const header = Buffer.from([0x8a, payload.length & 0x7f]);
  try { sock.write(Buffer.concat([header, payload])); } catch (e) {}
}

function handleMessage(id, text) {
  let msg; try { msg = JSON.parse(text); } catch (e) { return; }
  const c = clients.get(id); if (!c) return;
  if (msg.t === 'join') {
    c.name = String(msg.name || '').slice(0, 16) || ('Player ' + id);
    send(c.socket, roster());
    broadcast(roster());
    return;
  }
  // relay everything else, tagging the sender
  msg.from = id;
  if (msg.to === 'all' || msg.to === undefined) broadcast(msg, id);
  else { const dst = clients.get(msg.to); if (dst) send(dst.socket, msg); }
}

/* ---------- print LAN address ---------- */
function lanIPs() {
  const out = [];
  const ifs = os.networkInterfaces();
  for (const name of Object.keys(ifs))
    for (const ni of ifs[name])
      if (ni.family === 'IPv4' && !ni.internal) out.push(ni.address);
  return out;
}
server.listen(PORT, () => {
  const ips = lanIPs();
  console.log('\n  SCORCHED EARTH server running.\n');
  console.log('  On THIS computer:      http://localhost:' + PORT);
  if (ips.length) {
    console.log('  On other devices (same Wi-Fi):');
    ips.forEach(ip => console.log('      http://' + ip + ':' + PORT));
  } else {
    console.log('  (No LAN address found — make sure Wi-Fi/Ethernet is connected.)');
  }
  console.log('\n  First device to open the page is the HOST and sets up the match.');
  console.log('  Press Ctrl+C to stop.\n');
});
