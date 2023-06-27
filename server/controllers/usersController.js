/* eslint-disable consistent-return */
const User = require('../model/User');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({userName: -1});
    res.status(200).json({users: users});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//GET one user
const getOneUser = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({user: user});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//CREATE a new user (registration)
const addOneUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({user: newUser});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//DELETE one user
const deleteOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({error: 'No such User exists to delete'});
    }
    res.status(200).json({user: user});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE one user
const updateOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, {
      ...req.body,
    }, {returnDocument: 'after'});
    if (!user) {
      return res.status(404).json({error: 'No such User exists to update'});
    }
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
