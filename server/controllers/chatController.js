const ChatMessage = require('../model/ChatMessage.js');

const getOwnMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    /* const limit = req.query.limit; */
    const message = await ChatMessage.find({ user: userId }).sort({ createdAt: 'desc' });

    res.status(200).json({ messages: message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const message = await ChatMessage.create({
      user: userId,
      senderName: req.user.userName,
      text: req.body.text,
    });
    res.status(200).json({ message: message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getOwnMessages, postMessage };
