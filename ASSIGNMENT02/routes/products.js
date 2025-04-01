var express = require('express');
var router = express.Router();

const isAuthenticated = require('../middlewares/Auth');
const { getProduct } = require('../Controllers/Product/product');

router.get('/product', isAuthenticated, async(req, res, next) => {
  try {
    const products = await getProduct();
    if(products.length > 0) {
      res.render('product', { title: 'Product', products, user: req.user.username });
    }
  } catch (error) {
    const failedReadMessage_Product = error.message;
    res.render('product', { title: 'Service', user: req.user.username, failedReadMessage_Product });
  }
});

module.exports = router;