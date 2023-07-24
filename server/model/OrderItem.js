const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const itemSchema = new Schema({
  item: {
    type: mongoose.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  order: {
    type: mongoose.Types.ObjectId,
    ref: 'OrderHeader',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  bookPrice: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('OrderItem', itemSchema);
