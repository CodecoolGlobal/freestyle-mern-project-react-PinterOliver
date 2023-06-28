/* eslint-disable consistent-return */
const User = require('../model/User.js');

//Login user if the password is correct
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const account = await User.findOne({ userName: username });
    if (account.password === password) {
      account.token = account._id.toString();
      const isSaved = await account.save();
      if (!isSaved) {
        return res.status(500).json({ error: "Can't create token" });
      }
      res.status(202).json({ token: account.token });
    } else {
      res.status(401).json({ error: 'Wrong password' });
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  login,
};
