require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ws = require('ws');
const app = express();
const apiRouter = require('./routes/api');
let server;

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

app.use(express.json());
app.use('/api', apiRouter);

const main = async () => {
  await mongoose.connect(MONGO_URL);

  server = app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
  });

  const wss = new ws.WebSocketServer({ server: server, path: '/chat' });

  wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      console.log('wss received: %s', data);
    });

    ws.send('something');
  });
};

function getWebSocketResKey(reqKey) {
  const shasum = crypto.createHash('sha1');
  const magicString = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  return shasum.update(reqKey + magicString).digest('base64');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
