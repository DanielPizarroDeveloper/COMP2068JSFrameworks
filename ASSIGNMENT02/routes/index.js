var express = require('express');
var router = express.Router();
const usersRouter = require('./users');

//isAuthenticated
const isAuthenticated = require('../middlewares/Auth');

//toUpperCaseUser
const toUpperCaseText = require('../public/javascripts/toUpperCase');

router.get('/', isAuthenticated, (req, res, next) => {
  var displayName = toUpperCaseText(req.user.username);
  res.render('index', { title: 'Home', user: displayName });
});

router.get('/about', isAuthenticated, (req, res, next) => {
  var displayName = toUpperCaseText(req.user.username);
  res.render('about', { title: 'About', user: displayName });
});

router.use('/', usersRouter);

module.exports = router;