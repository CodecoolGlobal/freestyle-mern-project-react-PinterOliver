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
  const id = req.header.token;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'User ID is not valid'});
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({error: 'No such user'});
  }
  const role = await Role.findOne({name: user.role});
  if (!role.canModifyItems) {
    return res.status(401).json({error: 'You have no right to access'});
  }
  next();
};

module.exports = {
  idValidation,
  userValidation,
};
