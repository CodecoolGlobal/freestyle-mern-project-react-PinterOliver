import mongoose from 'mongoose';
import express from 'express';
import apiRouter from '../server/routes/api.js';
const app = express();

app.use(express.json());
app.use('/api', apiRouter);

const mongoUsername = '*';
const mongoPassword = '*';

mongoose.connect(`mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.h69pmvj.mongodb.net/?retryWrites=true&w=majority`);

const googleApiKey = 'AIzaSyCZt3uUWjLlYtxfcQgaGsukWEIoiCTWE0g';

console.log(googleApiKey);

const port = 4000;
app.listen(port, () => console.log(`http://127.0.0.1:${port}`));
