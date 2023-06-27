const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const roleSchema = new Schema({
  name: String,
  canViewItems: Boolean,
  canModifyItems: Boolean,
  canViewAllOrders: Boolean,
  canViewAllUsers: Boolean,
  canAccessStorage: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Role', roleSchema);
