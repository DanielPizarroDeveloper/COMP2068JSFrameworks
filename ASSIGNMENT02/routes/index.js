var express = require('express');
var router = express.Router();

const Comment = require('../models/comment');
const Product = require('../models/product');
const Service = require('../models/service');
const today = require('../public/javascripts/getToday.js');
const templateMail = require('../public/mocks/template.js');
const nodemailer = require('../public/javascripts/email.js');

const User = require('../models/user');
const passport = require('passport');

const isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

/* GET home page. */
router.get('/', isAuthenticated, (req, res, next) => {
  res.render('index', { title: 'Home', user: req.user.username });
});

/* GET product page. */
router.get('/product', isAuthenticated, async(req, res, next) => {
  const products = await Product.find();
  res.render('product', { title: 'Product', products, user: req.user.username });
});

/* GET service page. */
router.get('/service', isAuthenticated, async(req, res, next) => {
  const services = await Service.find();
  res.render('service', { title: 'Service', services, user: req.user.username });
});

/* GET about page. */
router.get('/about', isAuthenticated, (req, res, next) => {
  res.render('about', { title: 'About', user: req.user.username });
});

/* GET contact page. */
router.get('/contact', isAuthenticated, (req, res, next) => {
  res.render('contact', { title: 'Contact', user: req.user.username, email: req.user.email });
});

/* POST contact page. */
router.post('/contact', isAuthenticated, async (req, res, next) => {
  var result = templateMail(req.body.type, req.body.customerName, req.body.customerEmail, req.body.description);

  nodemailer.sendMail(result, (error, info) => {
    if (error) {
      console.error('Error al enviar:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
  
  res.render('contact', { title: 'Contact', user: req.user.username });
});


/* GET comments page. */
router.get('/comment', isAuthenticated,  async(req, res, next) => {
  const comments = await Comment.find();
  const commentsOrderBy = comments.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('comment', { title: 'Comment', commentsOrderBy, user: req.user.username });
});

/* POST comments page. */
router.post('/comment', isAuthenticated,  async(req, res, next) => {
  try {
    let usernameSplit = req.user.username.split(' ');
    let lengthName = usernameSplit.length;
    let initialsUser = null;

    switch (lengthName) {
      case 1:
        initialsUser = usernameSplit[0][0];
        console.log('Case 1');
        break;
      case 2:
        initialsUser = usernameSplit[0][0] + usernameSplit[1][0];
        break;
      case 3:
        initialsUser = usernameSplit[0][0] + usernameSplit[2][0];
        break;
      default:
        initialsUser = 'NN';
        break;
    }

    let newComment = new Comment({
      responsable: req.user.username,
      title: req.body.title,
      date: today(),
      bodydescription: req.body.opinion,
      initials: initialsUser
    });

    await newComment.save();
    res.redirect('/comment');

  } catch (error) {
    console.error('Msj: ', error);
  }
});

/* GET panel comments page. */
router.get('/panelComment', isAuthenticated,  async(req, res, next) => {
  const comments = await Comment.find();
  const commentsOrderBy = comments.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('panelComment', { title: 'panel Comment', commentsOrderBy, user: req.user.username });
});

/* GET panel comments page. */
router.get('/panelComment/:_id', isAuthenticated,  async(req, res, next) => {
  try {
    let commentID = req.params._id.replace(':', '').replace('_', '');

    await Comment.findByIdAndDelete(commentID);
    res.redirect('/panelComment');
    
  } catch (error) {
    console.error('Msj: ', error);
  }
});

/* Get panelProduct */
router.get('/panelProduct', isAuthenticated, async(req, res, next) => {
  const productsList = await Product.find();

  res.render('panelProduct', { title: 'Product Administrator', productsList, user: req.user.username });
});

//  CREATE PRODUCT PANEL
router.post('/panelProduct', isAuthenticated, async(req, res, next) => {
  try {
    let newProduct = new Product({
      title: req.body.productName,
      detail: req.body.productDescription,
      quantity: req.body.productQuantity,
      unit: req.body.productUnit,
      publication: today(),
      price: req.body.productPrice,
      imgProduct: req.body.base64Create
    });

    await newProduct.save();
    res.redirect('/panelProduct');

  } catch (error) {
    console.error('Msj: ', error);
  }
});

//  PUT PRODUCT PANEL
router.post('/panelProduct/:_id', async (req, res, next) => {
  try {
    let path = req.body.base64Update;
    let productID = req.params._id.replace(':', '').replace('_', '');

    if (path.length !== 0) {
      await Product.findByIdAndUpdate(
        { _id: productID },
        {
          title: req.body.productUpdateName,
          detail: req.body.productUpdateDescription,
          quantity: req.body.productUpdateQuantity,
          publication: today(),
          price: req.body.productUpdatePrice,
          imgProduct: req.body.base64Update
        }
      )
    } else {
      await Product.findByIdAndUpdate(
        { _id: productID },
        {
          title: req.body.productUpdateName,
          detail: req.body.productUpdateDescription,
          quantity: req.body.productUpdateQuantity,
          publication: today(),
          price: req.body.productUpdatePrice
        }
      )
    }

    res.redirect('/panelProduct');

  } catch (error) {
    console.error('Msj: ', error);
  }
});

//  DELETE PRODUCT PANEL
router.get('/panelProduct/:_id', async (req, res, next) => {
  try {
      let productID = req.params._id.replace(':', '').replace('_', '');
      await Product.findByIdAndDelete(productID);
      res.redirect('/panelProduct');

  } catch (error) {
    console.error('Msj: ', error);
  }
});

// GET SERVICE PANEL
router.get('/panelService', isAuthenticated, async(req, res, next) => {
  const serviceList = await Service.find();
  res.render('panelService', { title: 'Service Administrator', serviceList, user: req.user.username });
});

// POST SERVICE PANEL
router.post('/panelService', isAuthenticated, async(req, res, next) => {
  try {
    let newService = new Service({
      title: req.body.serviceName,
      detail: req.body.serviceDescription,
      price: req.body.servicePrice,
      imgService: req.body.base64Create
    });

    await newService.save();
    res.redirect('/panelService');

  } catch (error) {
    console.error('Msj: ', error);
  }
});

// PUT SERVICE PANEL
router.post('/panelService/:_id', isAuthenticated, async(req, res, next) => {
  try {
    let path = req.body.base64Update;
    let serviceID = req.params._id.replace(':', '').replace('_', '');

    if (path.length !== 0) {
      await Service.findByIdAndUpdate(
        { _id: serviceID },
        {
          title: req.body.serviceName,
          detail: req.body.description,
          price: req.body.price,
          imgService: req.body.base64Update
        }
      )
    } else {
      await Service.findByIdAndUpdate(
        { _id: serviceID },
        {
          title: req.body.serviceName,
          detail: req.body.description,
          price: req.body.price
        }
      )
    }

    res.redirect('/panelService');

  } catch (error) {
    console.error('Msj: ', error);
  }
});

//  DELETE PRODUCT PANEL
router.get('/panelService/:_id', async (req, res, next) => {
  try {
      let serviceID = req.params._id.replace(':', '').replace('_', '');
      await Service.findByIdAndDelete(serviceID);
      res.redirect('/panelService');

  } catch (error) {
    console.error('Msj: ', error);
  }
});

router.get('/panelComment', isAuthenticated, (req, res, next) => {
  res.render('panelComment', { title: 'Comment Administrator', user: req.user.username });
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
  failureMessage: 'Invalid Credentials' //additional message for login failure
}));

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/* POST register page. */
router.post('/register', function(req, res, next) {
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email
    }),
    req.body.password,
    (error, newUser) => {
      if(error) {
        console.error(error);
        return res.redirect('/register');
      }

      req.login(newUser, (error) => {
        res.redirect('/');
      })
    }
  );
})

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
  passport.authenticate('github', { scope: ['user.email']})
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', }),
  (req, res, next) => {
    res.redirect('/')
  }
);

module.exports = router;