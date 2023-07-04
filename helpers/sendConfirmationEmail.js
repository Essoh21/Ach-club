const nodemailer = require("nodemailer");
require("dotenv").config();
async function sendConfirmationEmail(email, confirmationCode) {
  // Create a Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.PASS}`,
    },
  });

  // Send confirmation email
  let info = await transporter.sendMail({
    from: `${process.env.EMAIL}`,
    to: email,
    subject: "Email Confirmation",
    text: `Your confirmation code is: ${confirmationCode}`,
  });

  console.log("Email sent:", info.messageId);
}

module.exports = sendConfirmationEmail;
