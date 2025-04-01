var express = require('express');
var router = express.Router();

const nodemailer = require('../public/javascripts/email');
const contactMail = require('../Controllers/Contact/contact');

const isAuthenticated = require('../middlewares/Auth');

const { handleSendEmail, handleErrorEmail } = require('../public/mocks/Message');

router.get('/contact', isAuthenticated, (req, res, next) => {
  const successSend_Mail = req.session.Message_Send_Mail;
  const failedSend_Mail = req.session.MessageError_Send_Mail;

  req.session.Message_Send_Mail = null;
  req.session.MessageError_Send_Mail = null;

  res.render('contact', { title: 'Contact', user: req.user.username, email: req.user.email, successSend_Mail, failedSend_Mail });
});

router.post('/contact', isAuthenticated, (req, res, next) => {
  try {
    var result = contactMail(req.body.type, req.body.customerName, req.body.customerEmail, req.body.description);

    nodemailer.sendMail(result, (error, info) => {
      if (error) {
        req.session.MessageError_Send_Mail = handleErrorEmail();
      } else {
        req.session.Message_Send_Mail = handleSendEmail();
      }
      res.redirect('/contacts/contact');
    });

  } catch (error) {
    req.session.MessageError_Send_Mail = error.message;
    res.redirect('/contacts/contact');
  }
});

module.exports = router;