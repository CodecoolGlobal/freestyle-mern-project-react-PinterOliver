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

//GET one user
const getOneUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({error: 'No such User'});
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({error: error.message});
    }
  };

//CREATE a new user (registration)

//DELETE one user
const deleteOneUser = async (req, res) => {
    try {
      const { id } = req.params
      const user = await User.findOneAndDelete({_id: id})
      if (!user) {
          return res.status(404).json({error: 'No such book'})
      }
      res.status(200).json(user)
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
