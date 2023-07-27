/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Role = require('../model/Role.js');
const User = require('../model/User.js');
const OrderHeader = require('../model/OrderHeader.js');
const OrderItem = require('../model/OrderItem.js');
const Book = require('../model/Book');
const StoredItem = require('../model/StoredItem.js');

// Mongoose validation

const idValidation = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'ID is not valid'});
  }
  next();
};

const userValidation = async (req, res, next) => {
  const token = req.cookies.token;
  const user = await User.findOne({token: token}).populate('role');
  if (!user) {
    return res.status(404).json({success: false, error: 'No such user'});
  }
  req.user = user;
  next();
};

const bookAdminValidation = (req, res, next) => {
  const role = req.user.role;
  if (!role.canModifyItems) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const storedItemAdminValidation = (req, res, next) => {
  const role = req.user.role;
  if (!role.canAccessStorage) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const orderAdminValidation = (req, _res, next) => {
  const user = req.user;
  const role = user.role;
  if (role.canViewAllOrders) req.search = {};
  else req.search = {user: user._id};
  next();
};

const userAdminValidation = (req, res, next) => {
  const user = req.user;
  const role = user.role;
  if (role.canViewAllUsers) {
    req.search = {};
    req.isAdmin = true;
  } else {
    req.search = {_id: user._id};
    req.isAdmin = false;
  }
  next();
};

const roleAdminValidation = (req, res, next) => {
  const role = req.user.role;
  if (!role.canModifyRoles) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const orderHeaderValidation = async (req, res, next) => {
  const search = req.search;
  const id = req.params.id;
  search._id = id;
  const order = await OrderHeader.findOne(search);
  if (!order) {
    switch (req.method) {
    case 'PATCH':
      return res.status(405).json({error: 'No such order exists to update', rightMethod: 'POST'});
    case 'GET':
      return res.status(404).json({error: 'No such order exists'});
    case 'DELETE':
      return res.status(404).json({error: 'No such order exists to delete'});
    case 'POST':
      return res.status(404).json({error: 'No such order exists to add item to'});
    }
  }
  const forbiddenStates = ['transferred_to_shipping', 'order_completed'];
  if (req.method !== 'GET' && forbiddenStates.includes(order.state)) {
    return res.status(403).json({error: 'You can\'t access this order anymore'});
  }
  req.order = order;
  next();
};

const orderItemValidation = async (req, res, next) => {
  const search = req.search;
  const id = req.params.id;
  search._id = id;
  const order = await OrderItem.findOne(search).populate('order').populate('item');
  if (!order) {
    switch (req.method) {
    case 'PATCH':
      return res.status(405).json({error: 'No such order exists to update', rightMethod: 'POST'});
    case 'GET':
      return res.status(404).json({error: 'No such order exists'});
    case 'DELETE':
      return res.status(404).json({error: 'No such order exists to delete'});
    }
  }
  if (!order.order && req.method !== 'DELETE') {
    return res
      .status(405)
      .json({orderitem: order, error: 'Orderhead is not valid', rightMethod: 'DELETE'});
  }
  const forbiddenStates = ['transferred_to_shipping', 'order_completed'];
  if (order.order && req.method !== 'GET' && forbiddenStates.includes(order.order.state)) {
    return res.status(403).json({error: 'You can\'t access this order anymore'});
  }
  req.order = order;
  next();
};

const bookValidation = async (req, res, next) => {
  if (req.body.title) {
    const isExist = await Book.findOne({title: req.body.title});
    if (isExist && req.method === 'POST') {
      return res.status(405).json({
        error: 'There is already a book with this title',
        rightMethod: 'PATCH',
      });
    }
    if (!isExist && req.method === 'PATCH') {
      return res.status(405).json({
        error: 'There is no book with this title',
        rightMethod: 'POST',
      });
    }
    req.book = isExist;
  }
  next();
};

const storedItemValidation = async (req, res, next) => {
  const { id } = req.params;
  const storedItem = await StoredItem.findOne({item: id}).populate('item');
  if (!storedItem) {
    return res.status(404).json({error: 'There is no storedItem'});
  }
  req.storedItem = storedItem;
  next();
};

const userDataValidation = async (req, res, next) => {
  const userName = await User.findOne({userName: req.body.username});
  if (userName) {
    return res.status(403).json({error: 'There is already a User with this Username'});
  }
  const userEmail = await User.findOne({email: req.body.email});
  if (userEmail) {
    return res.status(403).json({error: 'This email address is already used'});
  }
  next();
};

const roleDataValidation = async (req, res, next) => {
  const name = await Role.findOne({name: req.body.name});
  if (name) {
    return res.status(403).json({error: 'There is already a Role with this name'});
  }
  next();
};

const userIdValidation = async (req, res, next) => {
  const { id } = req.params;
  const token = req.headers.token;
  const isAdmin = req.isAdmin;
  const user = await User.findById(id);
  if (!user || (!isAdmin && !user.token.includes(token))) {
    return res.status(400).json({error: 'Wrong ID'});
  }
  req.userData = user;
  next();
};

module.exports = {
  idValidation,
  userValidation,
  bookAdminValidation,
  storedItemAdminValidation,
  orderAdminValidation,
  userAdminValidation,
  roleAdminValidation,
  orderHeaderValidation,
  orderItemValidation,
  bookValidation,
  storedItemValidation,
  userDataValidation,
  userIdValidation,
  roleDataValidation,
};
