var express = require('express');
var router = express.Router();
const passport = require('passport');

//USER CRUD
const { registerUser } = require('../Controllers/User/user');

//Message
const { handleIncompleteSignup, handleFailedSignIn, handleSigninError } = require('../public/mocks/Message');

const isAuthenticated = require('../middlewares/Auth');

/* GET home page. */
router.get('/', isAuthenticated, (req, res, next) => {
  res.render('index', { title: 'Home', user: req.user.username });
});

/* GET about page. */
router.get('/about', isAuthenticated, (req, res, next) => {
  res.render('about', { title: 'About', user: req.user.username });
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
  failureMessage: handleSigninError() //additional message for login failure
}));

/* GET register page. */
router.get('/register', function(req, res, next) {
  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = null;
  res.render('register', { title: 'Register', errorMessage });
});

/* POST register page. */
router.post('/register', async(req, res, next) => {
  try {
    if(!req.body.username || !req.body.email || !req.body.password) {
      throw new Error(handleIncompleteSignup());
    } 
    else {
      const newUser = await registerUser(req.body.username, req.body.email, req.body.password);
      req.login(newUser, (error) => {
        if(error) {
          throw new Error (handleFailedSignIn());
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

/* GET logout */
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    res.redirect('/login');
  });
});

/* Get Account */
router.get('/account', isAuthenticated, (req, res, next) => {
  res.render('account', { title: 'Account', user: req.user.username, email: req.user.email });
});

/* Get GitHub */
router.get('/github',
  passport.authenticate('github', { scope: ['profile', 'email']})
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', }),
  (req, res, next) => {
    res.redirect('/')
  }
);

/* Get Google */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', }),
  (req, res, next) => {
    res.redirect('/')
  }
);

module.exports = router;