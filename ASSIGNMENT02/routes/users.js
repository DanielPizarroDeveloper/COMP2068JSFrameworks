var express = require('express');
var router = express.Router();
const passport = require('passport');

//isAuthenticated
const isAuthenticated = require('../middlewares/Auth');

//CRUD
const { registerUser } = require('../Controllers/User/user');

//Message
const { handleIncompleteSignup, handleFailedSignIn, handleSigninError } = require('../public/mocks/Message');

//toUpperCaseUser
const toUpperCaseText = require('../public/javascripts/toUpperCase');

router.get('/login', function(req, res, next) {
  //handle session message
  let messages = req.session.messages || []; //extract messages, or set to empty if undefined
  req.session.messages = []; // clear message
  res.render('login', { title: 'Login', messages: messages, stylesheetLogin: '/stylesheets/Accounts/login-register.css' });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // where to go if login is successful
  failureRedirect: '/login', // where to go if login fails
  failureMessage: handleSigninError() //additional message for login failure
}));

router.get('/register', function(req, res, next) {
  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = null;
  res.render('register', { title: 'Register', errorMessage, stylesheetRegister: '/stylesheets/Accounts/login-register.css' });
});

router.post('/register', async(req, res, next) => {
  try {
    if(!req.body.username || !req.body.email || !req.body.password) {
      req.session.errorMessage = handleIncompleteSignup();
      res.redirect('/register');
    } 
    else {
      const newUser = await registerUser(req.body.username, req.body.email, req.body.password);
      req.login(newUser, (error) => {
        if(error) {
          req.session.errorMessage = handleFailedSignIn();
          res.redirect('/register');
        }
        res.redirect('/');
      });
    }
  }
  catch(error) {
    req.session.errorMessage = error.message;
    res.redirect('/register');
  }
});

router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    res.redirect('/login');
  });
});

router.get('/account', isAuthenticated, (req, res, next) => {
  var displayName = toUpperCaseText(req.user.username);

  res.render('account', { title: 'Account', user: displayName, email: req.user.email, stylesheetAccount: '/stylesheets/Accounts/account.css' });
});

router.get('/github',
  passport.authenticate('github', { scope: ['profile', 'email']})
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', }),
  (req, res, next) => {
    res.redirect('/')
  }
);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', }),
  (req, res, next) => {
    res.redirect('/');
  }
);

module.exports = router;