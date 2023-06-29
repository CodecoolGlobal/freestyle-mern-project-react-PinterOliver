
const bcrypt = require('bcrypt');
const User = require('./model/User');
/* eslint-disable require-atomic-updates */
/* eslint-disable camelcase */
require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

const main = async () => {
  console.log('Connecting to DB');
  await mongoose.connect(mongoUrl);
  console.log('Successfully connected to DB');

  await hopp();

  await mongoose.disconnect();
  console.log('Disconnected from DB');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function hopp() {

  const users = await User.find({});
  const newUsers = await Promise.all(users.map(async (user) => {
    const salt = user.salt;
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;
    return await user.save();
  }));
  console.log(newUsers);
}


