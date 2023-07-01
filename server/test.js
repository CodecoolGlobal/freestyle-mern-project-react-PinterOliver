const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./model/User');
const bcrypt = require('bcrypt');

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

const main = async () => {
  console.log('Connecting to DB');
  await mongoose.connect(mongoUrl);
  console.log('Successfully connected to DB');

  modifyUser('DanDan');

  console.log('Disconnected from DB');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function modifyUser(username) {
  const user = await User.findOne({userName: username});
  const password = 'dfg4567&$@dGF';
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  user.salt = salt;
  user.password = hashedPassword;
  await user.save();
  const usertext = `${username}\n${password}`;
  console.log(usertext);
}
