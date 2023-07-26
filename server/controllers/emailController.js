const nodemailer = require("nodemailer");

const sendCreateUserEmail = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.rackhost.hu",
      port: "465",
      secure: true,
      auth: {
        user: "valkyrie@danielsproject.hu",
        pass: "Daniel343",
      },
    });
    const info = await transporter.sendMail({
      from: "valkyrie@danielsproject.hu",
      to: req.body.email,
      subject: "Welcome to Valkyrie!",
      html: `
      <img src="http://danielsproject.hu/logo.png" width="150" 
      height="150"></img>
      <h1>Welcome ${req.body.name.first}!</h1>
      <p>Thank you for registering to Valkyrie!</p>
      <p>If you have any questions, feel free to get in contact with us at valkyrie@danielsproject.hu</p>
      <p>We wish you the best,</p>
      <p>-Valkyrie</p>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
  next();
};

const sendCompleteOrderEmail = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.rackhost.hu",
      port: "465",
      secure: true,
      auth: {
        user: "valkyrie@danielsproject.hu",
        pass: "Daniel343",
      },
    });
    const info = await transporter.sendMail({
      from: "valkyrie@danielsproject.hu",
      to: req.body.email,
      subject: "Order confirmed",
      html: `
      <img src="http://danielsproject.hu/logo.png" width="150" 
      height="150"></img>
      <h1>Order received!</h1>
      <p>Thank you for ordering!</p>
      <table>
      <tr>
      <th>Name</th>
      <th>Amount</th>
      <th>Total</th>
    </tr>${req.body.items.map((item) => { 
      `<tr>
        <td>${item.name}</td>
        <td>${item.amount}</td>
        <td>${item}</td>
      </tr>`})}</table>
      <h3>Status: ${req.body.status}</h3>
      <p>Your order's state will soon be changed to confirmed. We will notify you when that happens.</p>
      <p>If you have any questions, feel free to get in contact with us at valkyrie@danielsproject.hu</p>
      <p>We wish you the best,</p>
      <p>-Valkyrie</p>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
  next();
};

const sendChangeOrderStateEmail = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.rackhost.hu",
      port: "465",
      secure: true,
      auth: {
        user: "valkyrie@danielsproject.hu",
        pass: "Daniel343",
      },
    });
    const info = await transporter.sendMail({
      from: "valkyrie@danielsproject.hu",
      to: req.body.email,
      subject: "Order status changed",
      html: `
      <img src="http://danielsproject.hu/logo.png" width="150" 
      height="150"></img>
      <h1>Hello ${req.body.name.first}!</h1>
      <span>Your order's status has been changed to:</span>
      <span>${req.body.status}}</span>
      <p>If you have any questions, feel free to get in contact with us at valkyrie@danielsproject.hu</p>
      <p>We wish you the best,</p>
      <p>-Valkyrie</p>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
  next();
};

const sendPasswordResetEmail = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.rackhost.hu",
      port: "465",
      secure: true,
      auth: {
        user: "valkyrie@danielsproject.hu",
        pass: "Daniel343",
      },
    });
    const info = await transporter.sendMail({
      from: "valkyrie@danielsproject.hu",
      to: req.body.email,
      subject: "Password reset",
      html: `
      <img src="http://danielsproject.hu/logo.png" width="150" 
      height="150"></img>
      <h1>Hello ${req.body.name.first}!</h1>
      <p>To change your password, please click on the link below.</p>
      <p>placeholder.com/change-pass</p>
      <p>If you did not ask to change your password, please ignore our message.</p>
      <p>We wish you the best,</p>
      <p>-Valkyrie</p>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
  next();
};

module.exports = {
  sendCreateUserEmail,
  sendCompleteOrderEmail,
  sendChangeOrderStateEmail,
  sendPasswordResetEmail,
};
