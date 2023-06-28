require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
import apiRouter from './routes/api';

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

app.use(express.json());
app.use('/api', apiRouter);

const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
