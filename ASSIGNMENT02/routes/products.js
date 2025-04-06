var express = require('express');
var router = express.Router();

//isAuthenticated
const isAuthenticated = require('../middlewares/Auth');

//CRUD
const { getProduct } = require('../Controllers/Product/product');

//toUpperCaseUser
const toUpperCaseText = require('../public/javascripts/toUpperCase');

router.get('/product', isAuthenticated, async(req, res, next) => {
  try {
    var displayName = toUpperCaseText(req.user.username);
    const products = await getProduct();

    if(products.length > 0) {
      res.render('product', { title: 'Product', products, user: displayName });
    }
  } catch (error) {
    const failedReadMessage_Product = error.message;
    res.render('product', { title: 'Service', user: displayName, failedReadMessage_Product });
  }
});

module.exports = router;