var express = require('express');
var router = express.Router();

const Comment = require('../models/comment');
const Product = require('../models/product');
const Service = require('../models/service');

const User = require('../models/user');
const passport = require('passport');

const isAuthenticated = (req, res, next) => {
  var user = null;
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

/* GET home page. */
router.get('/', isAuthenticated, (req, res, next) => {
  res.render('index', { title: 'Home', user: req.user.name });
});

/* GET product page. */
router.get('/product', isAuthenticated, async(req, res, next) => {
  const products = await Product.find();
  res.render('product', { title: 'Product', products, user: req.user.name });
});

/* GET service page. */
router.get('/service', isAuthenticated, async(req, res, next) => {
  const services = await Service.find();
  res.render('service', { title: 'Service', services, user: req.user.name });
});

/* GET about page. */
router.get('/about', isAuthenticated, (req, res, next) => {
  res.render('about', { title: 'About', user: req.user.name });
});

/* GET contact page. */
router.get('/contact', isAuthenticated, (req, res, next) => {
  res.render('contact', { title: 'Contact', user: req.user.name });
});

/* GET comments page. */
router.get('/comment', isAuthenticated,  async(req, res, next) => {
  const comments = await Comment.find();
  res.render('comment', { title: 'Comment', comments, user: req.user.name });
});

/* Get Account */
router.get('/account', isAuthenticated, (req, res, next) => {
  var user = null;
  if(req.isAuthenticated()) {
    user = req.user.name;
  }
  res.render('account', { title: 'Account', user: req.user.name, email: req.user.email });
});

/* Get Account */
router.get('/panelProduct', isAuthenticated, async(req, res, next) => {
  var user = null;
  if(req.isAuthenticated()) {
    user = req.user.name;
  }

  const products = await Product.find();

  res.render('panelProduct', { title: 'Product Administrator', products, user: req.user.name });
});

router.get('/panelService', isAuthenticated, async(req, res, next) => {
  var user = null;
  if(req.isAuthenticated()) {
    user = req.user.name;
  }
  const services = await Service.find();
  res.render('panelService', { title: 'Service Administrator', services, user: req.user.name });
});

router.get('/panelComment', isAuthenticated, (req, res, next) => {
  var user = null;
  if(req.isAuthenticated()) {
    user = req.user.name;
  }
  res.render('panelComment', { title: 'Comment Administrator', user: req.user.name });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  //handle session message
  let messages = req.session.messages || []; //extract messages, or set to empty if undefined
  req.session.messages = []; // clear message
  res.render('login', { title: 'Login', messages: messages });
});

/* POST login page. */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // where to go if login is successful
  failureRedirect: '/login', // where to go if login fails
  failureMessage: 'Invalid Credentials' //additional message for login failure
}));

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/* POST register page. */
router.post('/register', function(req, res, next) {
  User.register(
    new User({
      name: req.body.username,
      email: req.body.email
    }),
    req.body.password,
    (error, newUser) => {
      if(error) {
        console.log(error);
        return res.redirect('/register');
      }

      req.login(newUser, (error) => {
        res.redirect('/');
      })
    }
  );
})

/* GET logout */
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    res.redirect('/login');
  });
});

module.exports = router;