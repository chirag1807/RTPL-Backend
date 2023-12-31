const nodemailer = require('nodemailer');

const sendMail = async (recipientEmail, senderEmail, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "risegrowgroup@gmail.com",
      pass: "bsxouctwugofjdje",
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