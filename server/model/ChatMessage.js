const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  text: String,
  sentAt: Date,
  isAdminAnswer: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('ChatMessage', messageSchema);
