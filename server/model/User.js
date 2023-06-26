const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: String,
  password: String,
  email: String,
  role: mongoose.Types.ObjectId,
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
});

module.exports = model('User', userSchema);
