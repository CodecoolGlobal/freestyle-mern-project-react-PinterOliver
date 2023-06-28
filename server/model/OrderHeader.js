const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const headerSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  totalPrice: Number,
  state: String,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('OrderHeader', headerSchema);
