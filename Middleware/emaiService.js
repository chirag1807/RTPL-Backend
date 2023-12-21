const nodemailer = require('nodemailer');
const {development} = require('../config')
// Create a transporter using your email service provider details
exports.SendEmailService = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
  //service:development.NODEMAILER.SERVICE,
  auth: {
    user: development.NODEMAILER.PROVIDER_EMAIL,
    pass: development.NODEMAILER.PROVIDER_PASSWAORD,
  },
});
