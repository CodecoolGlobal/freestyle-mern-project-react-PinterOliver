/* eslint-disable consistent-return */
const User = require('../model/User');
const Role = require('../model/Role');
const { arraySearch } = require('./filterAndSort');
const bcrypt = require('bcrypt');
const { generateNumber } = require('../populate/generateParts');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const { roles, onlyActive } = req.query;
    let search = req.search;
    if (roles) {
      const roleArray = roles.split(',');
      const roleData = await Promise.all(
        roleArray.map(async (role) => {
          const finalRole = await Role.findOne({ name: role });
          return finalRole._id;
        }),
      );
      search = arraySearch(search, 'role', roleData);
    }
    if (onlyActive) {
      search.token = {};
      search.token = { $not: { $size: 0 } };
    }
    const users = await User.find(search).sort({ userName: -1 }).populate('role');
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//GET one user
const getOneUser = (req, res) => {
  try {
    const user = req.userData;
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//GET one user by email
const getOneUserbyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.status(200).json({ id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//set security code for one user by their ID
const resetSecurityCode = async (req, res, next) => {
  try {
    await User.findOneAndUpdate({ _id: req.params.id }, { security: generateNumber(10000, 99999) });
    res.status(200).json({ message: 'security number reset' });
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//set new password
const changePassword = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(req.body._password, salt);
    const user = await User.findOneAndUpdate(
      {
        $and: [{ _id: req.body._id }, { security: req.body._security }],
      },
      { password: hashedPassword },
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Password successfully changed' });
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Delete security number
const deleteSecurityNumber = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      {
        $and: [{ _id: req.body._id }, { security: req.body._security }],
      },
      { $unset: { security: 1 } },
    );
    res.status(200).json({ message: 'Security number deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//CREATE a new user (registration)
const addOneUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.role) {
      const role = await Role.findOne({ name: 'User' });
      user.role = role._id;
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;
    const newUser = await User.create(user);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//DELETE one user
const deleteOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//UPDATE one user
const updateOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { returnDocument: 'after' },
    );
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  addOneUser,
  deleteOneUser,
  updateOneUser,
  getOneUserbyEmail,
  resetSecurityCode,
  changePassword,
  deleteSecurityNumber,
};
