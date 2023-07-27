/* eslint-disable consistent-return */
const User = require('../model/User');
const Role = require('../model/Role');
const {
  arraySearch,
} = require('./filterAndSort');
const bcrypt = require('bcrypt');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const { roles } = req.query;
    let search = req.search;
    if (roles) {
      const roleArray = roles.split(',');
      const roleData = await Promise.all(roleArray.map(async (role) => {
        const finalRole = await Role.findOne({name: role});
        return finalRole._id;
      }));
      search = arraySearch(search, 'role', roleData);
    }
    const users = await User.find(search).sort({userName: -1}).populate('role');
    res.status(200).json({users: users});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//GET one user
const getOneUser = (req, res) => {
  try {
    const user = req.userData;
    res.status(200).json({user: user});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//CREATE a new user (registration)
const addOneUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.role) {
      const role = await Role.findOne({name: 'User'});
      user.role = role._id;
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;
    const newUser = await User.create(user);
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
    res.status(200).json({user: user});
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
