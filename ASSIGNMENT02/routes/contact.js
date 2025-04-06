var express = require('express');
var router = express.Router();

//SendMail
const nodemailer = require('../public/javascripts/email');
const contactMail = require('../Controllers/Contact/contact');

//isAuthenticated
const isAuthenticated = require('../middlewares/Auth');

//Message
const { handleSendEmail, handleErrorEmail } = require('../public/mocks/Message');

//toUpperCaseUser
const toUpperCaseText = require('../public/javascripts/toUpperCase');

router.get('/contact', isAuthenticated, (req, res, next) => {
  var displayName = toUpperCaseText(req.user.username);

  const successSend_Mail = req.session.Message_Send_Mail;
  const failedSend_Mail = req.session.MessageError_Send_Mail;

  req.session.Message_Send_Mail = null;
  req.session.MessageError_Send_Mail = null;

  res.render('contact', { 
    title: 'Contact', user: displayName, 
    email: req.user.email, successSend_Mail, 
    failedSend_Mail, stylesheetContact: '/stylesheets/general/contact.css' });
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