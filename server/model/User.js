/* eslint-disable camelcase */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  userName: String,
  name: {
    first: String,
    last: String,
  },
  password: String,
  salt: String,
  hashedpassword: String,
  email: String,
  role: { type: mongoose.Types.ObjectId, ref: 'Role' },
  delivery: {
    country: String,
    city: String,
    address: String,
    post_code: String,
  },
  telephone_number: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  token: [String],
});

module.exports = model('User', userSchema);
