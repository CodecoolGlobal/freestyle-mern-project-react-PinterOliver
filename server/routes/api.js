const Book = require('../model/Book.js');
const OrderHeader = require('../model/OrderHeader.js');
const OrderItem = require('../model/OrderItem.js');
const Role = require('../model/Role.js');
const StoredItem = require('../model/StoredItem.js');
const User = require('../model/User.js');
const express = require('express');
const router = express.Router();

console.log([Book, OrderHeader, OrderItem, Role, StoredItem, User]);

export default router;
