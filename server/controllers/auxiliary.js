/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Role = require('../model/Role.js');
const User = require('../model/User.js');
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

module.exports = {
  idValidation,
  userValidation,
  bookAdminValidation,
  userAdminValidation,
};
