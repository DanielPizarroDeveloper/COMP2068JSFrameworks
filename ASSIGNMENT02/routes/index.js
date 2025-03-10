var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET product page. */
router.get('/product', function(req, res, next) {
  res.render('product', { title: 'Product' });
});

/* GET service page. */
router.get('/service', function(req, res, next) {
  res.render('service', { title: 'Service' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

/* GET comments page. */
router.get('/comment', function(req, res, next) {
  res.render('comment', { title: 'Comment' });
});

module.exports = router;
