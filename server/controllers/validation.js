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
  if (!role.canModifyItems) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const orderAdminValidation = async (req, res, next) => {
  const user = req.user;
  const role = await Role.findById(user.role);
  if (role.canViewAllOrders) req.search = {};
  else req.search = {_id: user._id};
  next();
};

const userAdminValidation = async (req, res, next) => {
  const user = req.user;
  const role = await Role.findById(user.role);
  if (!role.canViewAllUsers) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const orderValidation = async (req, res, next) => {
  console.log(req.headers.method);
  const id = req.params.id;
  const order = await OrderHeader.findById(id);
  for (const key in req.headers) {
    console.log(`${key}: ${req.headers[key]}`);
  }
  if (!order) {
    switch (req.headers.method) {
    case 'PATCH':
      return res.status(405).json({rightMethod: 'POST'});
    case 'DELETE':
      return res.status(404).json({error: 'No such order exists to delete'});
    }
  }
  const forbiddenStates = ['transferred_to_shipping', 'order_completed'];
  if (forbiddenStates.includes(order.state)) {
    return res.status(403).json({error: 'You can\'t access this order anymore'});
  }
  req.order = order;
  next();
};

const bookValidation = async (req, res, next) => {
  const isExist = await Book.findOne({title: req.body.title});
  if (isExist && req.headers.method === 'POST') {
    return res.status(405).json({
      error: 'There is already a book with this title',
      rightMethod: 'PATCH',
    });
  }
  if (!isExist && req.headers.method === 'PATCH') {
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

module.exports = {
  idValidation,
  userValidation,
  bookAdminValidation,
  orderAdminValidation,
  userAdminValidation,
  orderValidation,
  bookValidation,
  userDataValidation,
};
