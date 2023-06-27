/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Role = require('../model/Role.js');
const User = require('../model/User.js');
const OrderHeader = require('../model/OrderHeader.js');
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
  console.log(role);
  if (!role.canModifyItems) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const userAdminValidation = async (req, res, next) => {
  const user = req.user;
  const role = await Role.findById(user.role);
  console.log(role);
  if (!role.canViewAllUsers) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const orderValidation = async (req, res, next) => {
  const user = req.user;
  const isExist = await OrderHeader.findOne({user: user._id});
  if (isExist && req.headers.method === 'POST') {
    return res.status(405).json({success: false, rightMethod: 'PATCH'});
  }
  if (!isExist && req.headers.method === 'PATCH') {
    return res.status(405).json({success: false, rightMethod: 'POST'});
  }
  req.order = isExist;
  next();
};

const bookValidation = async (req, res, next) => {
  const isExist = await Book.findOne({title: req.body.title});
  if (isExist && req.headers.method === 'POST') {
    return res.status(405).json({
      error: 'There is already a book with this title',
      success: false,
      rightMethod: 'PATCH',
    });
  }
  if (!isExist && req.headers.method === 'PATCH') {
    return res.status(405).json({
      error: 'There is no book with this title',
      success: false,
      rightMethod: 'POST',
    });
  }
  req.book = isExist;
  next();
};

const userOrderValidation = async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;
  const order = await OrderHeader.findById(id);
  if (Object.values(order.user)[0] !== Object.values(user._id)[0]) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  const forbiddenStates = ['transferred_to_shipping', 'order_completed'];
  if (forbiddenStates.includes(order.state)) {
    return res.status(403).json({error: 'You can\'t access this order anymore'});
  }
  req.order = order;
  next();
};

module.exports = {
  idValidation,
  userValidation,
  bookAdminValidation,
  userAdminValidation,
  orderValidation,
  userOrderValidation,
  bookValidation,
};
