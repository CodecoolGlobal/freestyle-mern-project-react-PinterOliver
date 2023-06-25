const mongoose = require('mongoose');
const express = require('express');
const app = express();
const apiRouter = require('./routes/api');

app.use(express.json());
app.use('/api', apiRouter);

const mongoUsername = '*';
const mongoPassword = '*';

mongoose.connect(`mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.h69pmvj.mongodb.net/?retryWrites=true&w=majority`);

const port = 4000;
app.listen(port, () => console.log(`http://127.0.0.1:${port}`));
