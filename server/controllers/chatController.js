const ChatMessage = require('../model/ChatMessage.js');

const getOwnMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = req.query.limit;
    const message = await ChatMessage.find({ user: userId }).sort({ sentAt: 'desc' });

    res.status(200).json({ messages: message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getOwnMessages };
