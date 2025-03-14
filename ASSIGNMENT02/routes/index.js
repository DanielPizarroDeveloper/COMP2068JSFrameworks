var express = require('express');
var router = express.Router();

const Comment = require('../models/comment');
const Product = require('../models/product');
const Service = require('../models/service');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET product page. */
router.get('/product', async function(req, res, next) {
  const products = await Product.find();
  res.render('product', { title: 'Product', products });
});

/* GET service page. */
router.get('/service', async function(req, res, next) {
  const services = await Service.find();
  res.render('service', { title: 'Service', services });
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
router.get('/comment', async function(req, res, next) {
  const comments = await Comment.find();
  res.render('comment', { title: 'Comment', comments });
});

module.exports = router;