/* eslint-disable consistent-return */
const User = require('../model/User.js');
const bcrypt = require('bcrypt');

//Login user if the password is correct
const login = async (req, res) => {
  const saltRounds = 10;
  const { username, password } = req.body;
  try {
    const account = await User.findOne({ userName: username }).populate('role');
    if (account.password === password) {
      const newToken = account._id.toString();
      account.token.push(newToken);
      const isSaved = await account.save();
      if (!isSaved) {
        return res.status(500).json({ error: 'Can\'t create token' });
      }
      res.status(202).json({
        token: newToken,
        canModifyItems: account.role.canModifyItems,
        canViewAllOrders: account.role.canViewAllOrders,
        canViewAllUsers: account.role.canViewAllUsers,
        canModifyRoles: account.role.canModifyRoles,
        canAccessStorage: account.role.canAccessStorage,
      });
    } else {
      res.status(401).json({ error: 'Wrong password' });
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

const logout = async (req, res) => {
  const token = req.headers.token;
  const user = req.user;
  user.token = user.token.filter((item) => item !== token);
  const savedUser = await user.save();
  if (!savedUser) {
    res.status(404).json({success: false, error: 'No such user'});
  }
  res.status(202).json({success: true, message: 'User session is over'});
};

module.exports = {
  login,
  logout,
};
