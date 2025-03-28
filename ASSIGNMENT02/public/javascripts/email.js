require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = transporter;