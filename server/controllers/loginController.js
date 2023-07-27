/* eslint-disable consistent-return */
const User = require('../model/User.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const daysToMilliSeconds = (days) => {
  return days * 24 * 60 * 60 * 1000;
};

const daysToDate = (days) => {
  const date = new Date();
  date.setTime(new Date().getTime() + (daysToMilliSeconds(days)));
  return date;
};

//Login user if the password is correct
const login = async (req, res) => {
  try {
    const tokenExpireDays = 1;
    const { username, password } = req.body;
    const account = await User.findOne({ userName: username }).populate('role');
    if (!account) {
      return res.status(404).json({error: 'There is no account with this username'});
    }
    if (bcrypt.compare(password, account.password)) {
      const numberOfBytes = 32;
      const randomBytes = crypto.randomBytes(numberOfBytes);
      const randomHex = randomBytes.toString('hex');
      const newToken = randomHex;
      account.token.push(newToken);
      const isSaved = await account.save();
      if (!isSaved) {
        return res.status(500).json({ error: 'Can\'t create token' });
      }
      res
        .status(200)
        .cookie(
          'token',
          newToken,
          {
            expires: daysToDate(tokenExpireDays),
            httpOnly: true,
            sameSite: true,
          },
        )
        .json({
          success: true,
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

const checkToken = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({success: false, error: 'No such user'});
    }
    res.status(200).json({
      id: user._id,
      success: true,
      canModifyItems: user.role.canModifyItems,
      canViewAllOrders: user.role.canViewAllOrders,
      canViewAllUsers: user.role.canViewAllUsers,
      canModifyRoles: user.role.canModifyRoles,
      canAccessStorage: user.role.canAccessStorage,
    });
  } catch (error) {
    res.status(400).json({success: false, error: error.message});
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.token;
    const user = req.user;
    user.token = user.token.filter((item) => item !== token);
    const savedUser = await user.save();
    if (!savedUser) {
      res.status(404).json({success: false, error: 'No such user'});
    }
    res.status(200).clearCookie('token').json({success: true, message: 'User session is over'});
  } catch (error) {
    res.status(400).json({success: false, error: error.message});
  }
};

module.exports = {
  login,
  checkToken,
  logout,
};
