var createError = require('http-errors');
var express = require('express');
var path = require('path');
const hbs = require('hbs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Auth
const { Auth_Options } = require('./middlewares/AuthLocal');

//MongoDB Connect
const { connections_Mongo_DB } = require('./Database/connection');

//Routing Rules
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/comment');
var contactRouter = require('./routes/contact');
var productRouter = require('./routes/products');
var serviceRouter = require('./routes/services');
var productADMRouter = require('./routes/admProducts');
var serviceADMRouter = require('./routes/admServices');
var commentADMRouter = require('./routes/admComment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentications...
Auth_Options(app);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/comments', commentRouter);
app.use('/contacts', contactRouter);
app.use('/services', serviceRouter);
app.use('/admProducts', productADMRouter);
app.use('/admServices', serviceADMRouter);
app.use('/admComment', commentADMRouter);

//Connect to MongoDB
connections_Mongo_DB();

hbs.registerHelper('eq', function(a, b) {
  return a === b;
});

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