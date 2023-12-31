const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  canViewItems: {
    type: Boolean,
    default: false,
  },
  canModifyItems: {
    type: Boolean,
    default: false,
  },
  canViewAllOrders: {
    type: Boolean,
    default: false,
  },
  canViewAllUsers: {
    type: Boolean,
    default: false,
  },
  canModifyRoles: {
    type: Boolean,
    default: false,
  },
  canAccessStorage: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Role', roleSchema);
