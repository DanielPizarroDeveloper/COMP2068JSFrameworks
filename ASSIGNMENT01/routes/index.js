var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'home' });
});

router.get('/experience', function(req, res, next) {
  res.render('experience', { title: 'experience' });
});

router.get('/programming', function(req, res, next) {
  res.render('programming', { title: 'programming' });
});


router.get('/aboutMe', function(req, res, next) {
  res.render('aboutMe', { title: 'aboutMe' });
});

router.get('/project', function(req, res, next) {
  res.render('project', { title: 'project' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'contact'})
})

module.exports = router;
