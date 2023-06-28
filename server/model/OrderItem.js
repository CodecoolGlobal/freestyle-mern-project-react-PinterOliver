const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const itemSchema = new Schema({
  item: { type: mongoose.Types.ObjectId, ref: 'Book' },
  order: { type: mongoose.Types.ObjectId, ref: 'OrderHeader' },
  amount: Number,
  bookPrice: Number,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('OrderItem', itemSchema);
