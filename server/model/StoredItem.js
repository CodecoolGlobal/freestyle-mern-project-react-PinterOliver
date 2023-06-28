const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const storageSchema = new Schema({
  item: { type: mongoose.Types.ObjectId, ref: 'Book' },
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('StoredItem', storageSchema);
