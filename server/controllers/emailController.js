const nodemailer = require("nodemailer");

const sendCreateUserEmail = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.rackhost.hu',
      port: '465',
      secure: true,
      auth: {
        user: 'valkyrie@danielsproject.hu',
        pass: 'Daniel343'
      }
    });
      const info = await transporter.sendMail({
        from: 'valkyrie@danielsproject.hu', 
        to: "danthe34@gmail.com", 
        subject: "Hello ✔", 
        text: "Hello world?", 
      });
      console.log("Message sent: %s", info.messageId);

  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
  next();
};

module.exports = {
  sendCreateUserEmail
};