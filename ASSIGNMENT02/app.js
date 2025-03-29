var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Import configurations file and mongoose to connect to DB
var configs = require('./configs/globals');
var mongoose = require('mongoose');
//import passport express-session
var passport = require('passport');
var session = require('express-session');
//Import model and package for authentication strategies
var User = require('./models/user');
var githubStrategy = require('passport-github2').Strategy;
//Routing Rules
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Use express-session and passport
app.use(session(
  {
    secret: 'TapiceriaLeone',
    resave: false,
    saveUninitialized: false
  }
));

app.use(passport.initialize());
app.use(passport.session());
passport.use('local', User.createStrategy());
passport.use('github',
  new githubStrategy ({
    clientID: configs.GitHub.clientId,
    clientSecret: configs.GitHub.clientSecret,
    callbackURL: configs.GitHub.callback
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ oauthId: profile.id });
    if (user) {
      return done(null, user);
    }
    else {
      const newUser = new User({
        username: profile.displayName,
        email: profile.username,
        oauthId: profile.id,
        oauthProvider: 'GitHub'
      });
      const savedUser = await newUser.save();
      return done(null, savedUser);
    }
  }
));

// Implement basic authentication strategy with passport-local and mongoose models.
passport.use('local', User.createStrategy()); //out-of-the-box strategy initialization code from plm
passport.serializeUser(User.serializeUser()); //out-of-the-box serializeUser code from plm
passport.deserializeUser(User.deserializeUser()); //out-of-the-box deserializeUser code from plm

app.use('/', indexRouter);
app.use('/users', usersRouter);
//Connect to MongoDB
mongoose.connect(configs.ConnectionStrings.MongoDB)
  .then(() => { console.log('Connected to MongoDB!'); })
  .catch((err) => { console.log('Error connecting to MongoDB!', err); });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;