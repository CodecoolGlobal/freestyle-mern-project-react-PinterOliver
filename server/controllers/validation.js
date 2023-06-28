/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Role = require('../model/Role.js');
const User = require('../model/User.js');
const OrderHeader = require('../model/OrderHeader.js');
const OrderItem = require('../model/OrderItem.js');
const Book = require('../model/Book');

// Mongoose validation

const idValidation = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'ID is not valid'});
  }
  next();
};

const userValidation = async (req, res, next) => {
  const token = req.headers.token;
  const user = await User.findOne({token: token});
  if (!user) {
    return res.status(404).json({error: 'No such user'});
  }
  req.user = user;
  next();
};

const bookAdminValidation = async (req, res, next) => {
  const user = req.user;
  const role = await Role.findById(user.role);
  if (!role.canModifyItems) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const orderAdminValidation = async (req, res, next) => {
  const user = req.user;
  const role = await Role.findById(user.role);
  if (role.canViewAllOrders) req.search = {};
  else req.search = {user: user._id};
  next();
};

const userAdminValidation = async (req, res, next) => {
  const user = req.user;
  const role = await Role.findById(user.role);
  if (role.canViewAllUsers) {
    req.search = {};
    req.isAdmin = true;
  } else {
    req.search = {_id: user._id};
    req.isAdmin = false;
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
  const order = await OrderItem
    .findOne(search)
    .populate({path: 'order', model: OrderHeader})
    .populate({path: 'item', model: Book});
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
  req.order = order;
  next();
};

const bookValidation = async (req, res, next) => {
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
  next();
};

const userDataValidation = async (req, res, next) => {
  const userName = await User.findOne({userName: req.body.userName});
  if (userName) {
    return res.status(403).json({error: 'There is already a User with this Username'});
  }
  const userEmail = await User.findOne({email: req.body.email});
  if (userEmail) {
    return res.status(403).json({error: 'This email address is already used'});
  }
  next();
};

const userIdValidation = async (req, res, next) => {
  const { id } = req.params;
  const token = req.headers.token;
  const isAdmin = req.isAdmin;
  const user = await User.findById(id);
  if (!user || (!isAdmin && user.token !== token)) {
    return res.status(400).json({error: 'Wrong ID'});
  }
  req.userData = user;
  next();
};

module.exports = {
  idValidation,
  userValidation,
  bookAdminValidation,
  orderAdminValidation,
  userAdminValidation,
  orderHeaderValidation,
  orderItemValidation,
  bookValidation,
  userDataValidation,
  userIdValidation,
};
