const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const itemSchema = new Schema({
  item: mongoose.Types.ObjectId,
  order: mongoose.Types.ObjectId,
  amount: Number,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('OrderItem', itemSchema);
