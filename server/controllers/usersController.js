const mongoose = require('mongoose');
const User = require('../model/User');


// GET all users
const getAllUsers = async (req, res) => {
    try {
      const user = await User.find({}).sort({userName: -1});
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({error: error.message});
    }
  };


module.exports = {
  getAllUsers,
  getOneUser,
  addOneUser,
  deleteOneUser,
  updateOneUser,
};
