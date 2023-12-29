const nodemailer = require('nodemailer');
const { development } = require('../config')

const sendMail = async (recipientEmail, senderEmail, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "ridhamchauhan693@gmail.com",
      pass: "yrnjrpxrybemoiyg",
    },
  });

  const mailOptions = {
    from: senderEmail,
    to: recipientEmail,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send email", error: error.message };
  }
};

module.exports = sendMail;