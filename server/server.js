require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ws = require('ws');
const app = express();
const apiRouter = require('./routes/api');
const { Timestamp } = require('mongodb');

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

app.use(express.json());
app.use('/api', apiRouter);

const main = async () => {
  await mongoose.connect(MONGO_URL);

  const server = app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
  });

  const wss = new ws.WebSocketServer({ server: server, path: '/chat' });

  wss.on('connection', (client) => {
    client.send(JSON.stringify({ type: 'clientIdRequest' }));

    client.on('message', (data) => {
      const message = JSON.parse(data);

      if (message.type === 'clientIdPost') {
        client.id = message.content;
      }
      if (message.type === 'chatMessage') {
        const { clientId, chatMessage, senderName, dateTime } = message.content;
        const timeStamp =
          String(new Date(dateTime).getHours()).padStart(2, '0') +
          ':' +
          String(new Date(dateTime).getMinutes()).padStart(2, '0');

        broadcast(`[${timeStamp}] ${senderName}: ${chatMessage}`, clientId);
      }
    });
  });

  broadcast = (msg, clientId) => {
    for (const client of wss.clients) {
      if (client.id === clientId) {
        client.send(JSON.stringify({ type: 'message', content: msg }));
      }
    }
  };
};

function getUniqueId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
