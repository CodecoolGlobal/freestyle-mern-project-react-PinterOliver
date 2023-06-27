/* eslint-disable consistent-return */
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
const addOneUser = async (req, res) => {
  try {
    const userName = await User.findOne({userName: req.body.userName});
      if (userName) {
        return res.status(403).json({error: 'There is already a User with this Username'});
      }
      const userEmail = await User.findOne({email: req.body.email});
      if (userEmail) {
        return res.status(403).json({error: 'This email address is already used'});
      }
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({error: error.message});
    }
};

//DELETE one user
const deleteOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({_id: id});
    if (!user) {
      return res.status(404).json({error: 'No such User'});
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE one user
const updateOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndUpdate({_id: id}, {
      ...req.body,
    });
    if (!user) {
      return res.status(404).json({error: 'No such User'});
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
