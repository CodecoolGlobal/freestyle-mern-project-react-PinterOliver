const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const headerSchema = new Schema({
  user: mongoose.Types.ObjectId,
  totalPrice: Number,
  state: String,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('OrderHeader', headerSchema);
