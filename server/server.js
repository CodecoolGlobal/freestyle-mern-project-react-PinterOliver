require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ws = require('ws');
const app = express();
const apiRouter = require('./routes/api');
const cookieParser = require('cookie-parser');

const { MONGO_URL, PORT } = process.env;

if (!MONGO_URL) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

app.use(express.json());
app.use(cookieParser());
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
      console.log(message);

      if (message.type === 'clientIdPost') {
        client.id = message.content;
      }
      if (message.type === 'newMessage') {
        broadcast(message.content, client.id);
      }
    });
  });

  const broadcast = (msg, clientId) => {
    for (const client of wss.clients) {
      if (client.id === clientId) {
        client.send(JSON.stringify({ type: 'newMessage', content: msg }));
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
  return `${s4() + s4()  }-${  s4()}`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
