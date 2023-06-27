/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Role = require('../model/Role.js');
const User = require('../model/User.js');
const OrderHeader = require('../model/OrderHeader.js');

// Mongoose validation

const idValidation = (res, req, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'ID is not valid'});
  }
  next();
};

const userValidation = async (res, req, next) => {
  const token = req.header.token;
  const user = await User.findOne({token: token});
  if (!user) {
    return res.status(404).json({error: 'No such user'});
  }
  req.user = user;
  next();
};

const bookAdminValidation = async (res, req, next) => {
  const user = req.user;
  const role = await Role.findOne({name: user.role});
  if (!role.canModifyItems) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const userAdminValidation = async (res, req, next) => {
  const user = req.user;
  const role = await Role.findOne({name: user.role});
  if (!role.canViewAllUsers) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

const orderValidation = async (res, req, next) => {
  const user = req.user;
  const isExist = await OrderHeader.findOne({user: user._id});
  if (isExist && req.header.method === 'POST') {
    return res.status(405).json({success: false, rightMethod: 'PATCH'});
  }
  if (!isExist && req.header.method === 'PATCH') {
    return res.status(405).json({success: false, rightMethod: 'POST'});
  }
  req.order = isExist;
  next();
};

const userOrderValidation = async (res, req, next) => {
  const id = req.params.id;
  const user = req.user;
  const order = await OrderHeader.findById(id);
  if (order.user !== user._id) {
    return res.status(401).json({error: 'You have no right to access'});
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
};
