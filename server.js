require('dotenv').config();
const express = require('express');
const path = require('path');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname)));

const livekitUrl = process.env.LIVEKIT_URL || '';
const apiKey = process.env.LIVEKIT_API_KEY || '';
const apiSecret = process.env.LIVEKIT_API_SECRET || '';
const configured = Boolean(livekitUrl && apiKey && apiSecret);

app.get('/api/voice/status', (_req, res) => {
  res.json({ configured, provider: 'LiveKit' });
});

app.post('/api/voice/token', async (req, res) => {
  if (!configured) {
    return res.status(503).json({ error: 'Jonli ovoz serveri hali sozlanmagan. Render Environment bo‘limiga LIVEKIT_URL, LIVEKIT_API_KEY va LIVEKIT_API_SECRET kiriting.' });
  }
  const level = Number(req.body && req.body.level);
  const nickname = String((req.body && req.body.nickname) || '').trim().slice(0, 32);
  if (!nickname) return res.status(400).json({ error: 'Avval taxallus yozing.' });
  if (!Number.isInteger(level) || level < 5 || level > 200 || level % 5 !== 0) {
    return res.status(400).json({ error: 'Daraja 5 dan 200 gacha, 5 ga karrali bo‘lishi kerak.' });
  }
  try {
    const roomName = `memora-level-${level}`;
    const identity = `user-${require('crypto').randomUUID()}`;
    const token = new AccessToken(apiKey, apiSecret, {
      identity,
      name: nickname,
      ttl: '1h'
    });
    token.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });
    const jwt = await token.toJwt();
    res.json({ url: livekitUrl, token: jwt, room: roomName });
  } catch (err) {
    console.error('Token generation failed:', err);
    res.status(500).json({ error: 'Ulanish tokenini yaratib bo‘lmadi. Render Logs bo‘limini tekshiring.' });
  }
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, '0.0.0.0', () => console.log(`MEMORA LAB server listening on ${PORT}`));
