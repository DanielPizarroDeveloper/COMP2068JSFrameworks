var express = require('express');
var router = express.Router();

//isAuthenticated
const isAuthenticated = require('../middlewares/Auth');

//CRUD
const { getService } = require('../Controllers/Service/service');

//toUpperCaseUser
const toUpperCaseText = require('../public/javascripts/toUpperCase');

router.get('/service', isAuthenticated, async(req, res, next) => {
  try {
    var displayName = toUpperCaseText(req.user.username);
    const services = await getService();

    if (services.length > 0) {
      res.render('service', { title: 'Service', services, user: displayName, stylesheetProductService: '/stylesheets/general/product-service.css'  });
    }
  } catch (error) {
    const failedReadMessage_Service = error.message;
    res.render('service', { title: 'Service', user: displayName, failedReadMessage_Service, stylesheetProductService: '/stylesheets/general/product-service.css'  });
  }
});

module.exports = router;