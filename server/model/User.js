/* eslint-disable camelcase */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  security: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
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
