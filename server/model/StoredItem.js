const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const storageSchema = new Schema({
  item: mongoose.Types.ObjectId,
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('StoredItem', storageSchema);
