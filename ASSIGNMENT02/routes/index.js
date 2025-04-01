var express = require('express');
var router = express.Router();
const usersRouter = require('./users');

const isAuthenticated = require('../middlewares/Auth');

router.get('/', isAuthenticated, (req, res, next) => {
  res.render('index', { title: 'Home', user: req.user.username });
});

router.get('/about', isAuthenticated, (req, res, next) => {
  res.render('about', { title: 'About', user: req.user.username });
});

router.use('/', usersRouter);

module.exports = router;