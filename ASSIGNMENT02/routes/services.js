var express = require('express');
var router = express.Router();

const isAuthenticated = require('../middlewares/Auth');

const { getService } = require('../Controllers/Service/service');

router.get('/service', isAuthenticated, async(req, res, next) => {
  try {
    const services = await getService();
    if (services.length > 0) {
      res.render('service', { title: 'Service', services, user: req.user.username });
    }
  } catch (error) {
    const failedReadMessage_Service = error.message;
    res.render('service', { title: 'Service', user: req.user.username, failedReadMessage_Service });
  }
});

module.exports = router;