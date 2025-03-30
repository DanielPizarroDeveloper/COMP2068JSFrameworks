var express = require('express');
var router = express.Router();

const today = require('../public/javascripts/getToday');
const nodemailer = require('../public/javascripts/email');
const contactMail = require('../Controllers/Contact/contact');

const passport = require('passport');

//USER CRUD
const { registerUser } = require('../Controllers/User/user');

//SERVICE CRUD
const { createService, getService, updatedServiceByID, deleteServiceByID } = require('../Controllers/Service/service');

//PRODUCT CRUD
const { createProduct, getProduct, updatedProductByID, deleteProductByID } = require('../Controllers/Product/product');

//COMMENT CRUD
const { createComment, getComments, deleteCommentByID } = require('../Controllers/Comment/comment');

//Message
const { 
  //Account
  handleIncompleteSignup, handleFailedSignIn, handleSigninError,
  //Service - Product 
  handleSuccessCreate, handleSuccessUpdate, handleSuccessDelete,
  //Comment 
  handlerSuccessCreate_Comment, 
  //Contact 
  handleSendEmail, handleErrorEmail } = require('../public/mocks/Message');

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

/* GET service page. */
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

/* GET about page. */
router.get('/about', isAuthenticated, (req, res, next) => {
  res.render('about', { title: 'About', user: req.user.username });
});

/* GET contact page. */
router.get('/contact', isAuthenticated, (req, res, next) => {
  const successSend_Mail = req.session.Message_Send_Mail;
  const failedSend_Mail = req.session.MessageError_Send_Mail;

  req.session.Message_Send_Mail = null;
  req.session.MessageError_Send_Mail = null;

  res.render('contact', { title: 'Contact', user: req.user.username, email: req.user.email, successSend_Mail, failedSend_Mail });
});

/* POST contact page. */
router.post('/contact', isAuthenticated, (req, res, next) => {
  try {
    var result = contactMail(req.body.type, req.body.customerName, req.body.customerEmail, req.body.description);

    nodemailer.sendMail(result, (error, info) => {
      if (error) {
        req.session.MessageError_Send_Mail = handleErrorEmail();
      } else {
        req.session.Message_Send_Mail = handleSendEmail();
      }
      res.redirect('/contact');
    });

  } catch (error) {
    req.session.MessageError_Send_Mail = error.message;
    res.redirect('/contact');
  }
});

/* GET comments page. */
router.get('/comment', isAuthenticated,  async(req, res, next) => {
  try {
    //Create
    const successCreateMessage_Comment = req.session.Message_Create_Comment;
    const failedCreateMessage_Comment = req.session.MessageError_Create_Comment;

    req.session.Message_Create_Comment = null;
    req.session.MessageError_Create_Comment = null;

    const commentsOrderBy = await getComments();
    if (commentsOrderBy.length > 0) {
      res.render('comment', { title: 'Comment', commentsOrderBy, user: req.user.username, successCreateMessage_Comment, failedCreateMessage_Comment });
    }
  } catch (error) {
    req.session.MessageError_Create_Comment = error.message;
    res.redirect('/comment');
  }
});

/* POST comments page. */
router.post('/comment', isAuthenticated,  async(req, res, next) => {
  try {
    const result = await createComment(req.user.username, req.body.title, today(), req.body.opinion);

    if (result) {
      req.session.Message_Create_Comment = handlerSuccessCreate_Comment();
      res.redirect('/comment');
    }
  } catch (error) {
    req.session.MessageError_Create_Comment = error.message;
    res.redirect('/comment');
  }
});

/* Get panelProduct */
router.get('/panelProduct', isAuthenticated, async(req, res, next) => {
  try {
    const productsList = await getProduct();
    if(productsList.length > 0) {
      //Create
      const successCreateMessage_Panel_Product = req.session.Message_Create_Panel_Product;
      const failedCreateMessage_Panel_Product = req.session.MessageError_Create_Panel_Product;
        
      //Update
      const successUpdateMessage_Panel_Product = req.session.Message_Update_Panel_Product;
      const failedUpdateMessage_Panel_Product = req.session.MessageError_Update_Panel_Product;
        
      //Delete
      const successDeleteMessage_Panel_Product = req.session.Message_Delete_Panel_Product;
      const failedDeleteMessage_Panel_Product = req.session.MessageError_Delete_Panel_Product;
        
      //Create
      req.session.Message_Create_Panel_Product = null;
      req.session.MessageError_Create_Panel_Product = null;
        
      //Update
      req.session.Message_Update_Panel_Product = null;
      req.session.MessageError_Update_Panel_Product = null;
        
      //Delete
      req.session.Message_Delete_Panel_Product = null;
      req.session.MessageError_Delete_Panel_Product = null;
        
      res.render('panelProduct', { title: 'Product Administrator', productsList, user: req.user.username, successCreateMessage_Panel_Product, failedCreateMessage_Panel_Product, successUpdateMessage_Panel_Product, failedUpdateMessage_Panel_Product, successDeleteMessage_Panel_Product, failedDeleteMessage_Panel_Product });
    }
  } catch (error) {
    req.session.MessageError_Read = error.message;
    res.redirect('/product');
  }
});

//  CREATE PRODUCT PANEL
router.post('/panelProduct', isAuthenticated, async(req, res, next) => {
  try {
    const result = await createProduct(req.body.productName, req.body.productDescription, req.body.productQuantity, req.body.productUnit, today(), req.body.productPrice, req.body.base64Create);
    
    if(result) {
      req.session.Message_Create_Panel_Product = handleSuccessCreate();
      res.redirect('/panelProduct');
    }

  } catch (error) {
    req.session.MessageError_Create_Panel_Product = error.message;
    res.redirect('/panelProduct');
  }
});

//  PUT PRODUCT PANEL
router.post('/panelProduct/:_id', async (req, res, next) => {
  try {
    const result = await updatedProductByID(req.params._id, req.body.productName, req.body.productDescription, req.body.productQuantity, req.body.productUnit, today(), req.body.productPrice, req.body.base64Create);
    
    if(result) {
      req.session.Message_Update_Panel_Product = handleSuccessUpdate();
      res.redirect('/panelProduct');
    }
  } catch (error) {
    req.session.MessageError_Update_Panel_Product = error.message;
    res.redirect('/panelProduct');
  }
});

//  DELETE PRODUCT PANEL
router.get('/panelProduct/:_id', async (req, res, next) => {
  try {
    const result = await deleteProductByID(req.params._id);

    if(result) {
      req.session.Message_Delete_Panel_Product = handleSuccessDelete();
      res.redirect('/panelProduct');
    }

  } catch (error) {
    req.session.MessageError_Delete_Panel_Product = error.message;
    res.redirect('/panelProduct');
  }
});

// GET SERVICE PANEL
router.get('/panelService', isAuthenticated, async(req, res, next) => {
  const serviceList = await getService();
  const successCreateMessage_Panel_Service = req.session.Message_Create_Panel_Service;
  const failedCreateMessage_Panel_Service = req.session.MessageError_Create_Panel_Service;
  
  //Update
  const successUpdateMessage_Panel_Service = req.session.Message_Update_Panel_Service;
  const failedUpdateMessage_Panel_Service = req.session.MessageError_Update_Panel_Service;
  
  //Delete
  const successDeleteMessage_Panel_Service = req.session.Message_Delete_Panel_Service;
  const failedDeleteMessage_Panel_Service = req.session.MessageError_Delete_Panel_Service;
  
  //Create
  req.session.Message_Create_Panel_Service = null;
  req.session.MessageError_Create_Panel_Service = null;
  
  //Update
  req.session.Message_Update_Panel_Service = null;
  req.session.MessageError_Update_Panel_Service = null;
  
  //Delete
  req.session.Message_Delete_Panel_Service = null;
  req.session.MessageError_Delete_Panel_Service = null;

  if (serviceList > 0) {
    res.render('panelService', { title: 'Service Administrator', serviceList, user: req.user.username, successCreateMessage_Panel_Service, failedCreateMessage_Panel_Service, successUpdateMessage_Panel_Service, failedUpdateMessage_Panel_Service, successDeleteMessage_Panel_Service, failedDeleteMessage_Panel_Service }); 
  }
  else {
    res.render('panelService', { title: 'Service Administrator', serviceList, user: req.user.username, successDeleteMessage_Panel_Service });
  }
});

// POST SERVICE PANEL
router.post('/panelService', isAuthenticated, async(req, res, next) => {
  try {
    const result = await createService(req.body.serviceName, req.body.serviceDescription, req.body.servicePrice, req.body.base64Create, today());
    
    if(result) {
      req.session.Message_Create_Panel_Service = handleSuccessCreate();
      res.redirect('/panelService');
    }
  } catch (error) {
    req.session.MessageError_Create_Panel_Service = error.message;
    res.redirect('/panelService');
  }
});

// PUT SERVICE PANEL
router.post('/panelService/:_id', isAuthenticated, async(req, res, next) => {
  try {
    const result = await updatedServiceByID(req.params._id, req.body.serviceName, req.body.description, req.body.price, req.body.base64Update, today());
    
    if(result) {
      req.session.Message_Update_Panel_Service = handleSuccessUpdate();
      res.redirect('/panelService');
    }
  } catch (error) {
    req.session.MessageError_Update_Panel_Service = error.message;
    res.redirect('/panelService');
  }
});

//  DELETE SERVICE PANEL
router.get('/panelService/:_id', async(req, res, next) => {
  try {
    const result = await deleteServiceByID(req.params._id);

    if(result) {
      req.session.Message_Delete_Panel_Service = handleSuccessDelete();
      res.redirect('/panelService');
    }
  } catch (error) {
    req.session.MessageError_Delete_Panel_Service = error.message;
    res.redirect('/panelService');
  }
});

router.get('/panelComment', isAuthenticated, async(req, res, next) => {
  try {
    const commentsOrderBy = await getComments();
    
    //Delete
    const successDeleteMessage_Panel_Comment = req.session.Message_Delete_Panel_Comment;
    const failedDeleteMessage_Panel_Comment = req.session.MessageError_Delete_Panel_Comment;

    req.session.Message_Delete_Panel_Comment = null;
    req.session.MessageError_Delete_Panel_Comment = null;

    if (commentsOrderBy.length > 0) {
      res.render('panelComment', { title: 'Panel Comment', commentsOrderBy, user: req.user.username, successDeleteMessage_Panel_Comment, failedDeleteMessage_Panel_Comment });
    }
    else {
      res.render('panelComment', { title: 'Panel Comment', commentsOrderBy, user: req.user.username, successDeleteMessage_Panel_Comment });
    }
  } catch (error) {
    failedLoadMessage_Comment = error.message;
    res.render('panelComment', { title: 'Panel Comment', user: req.user.username, failedLoadMessage_Comment });
  }
});

//Delete Comment
router.get('/panelComment/:_id', async(req, res, next) => {
  try {
    const result = await deleteCommentByID(req.params._id);
    if(result) {
      req.session.Message_Delete_Panel_Comment = handleSuccessDelete();
      res.redirect('/panelComment');
    }
  } catch (error) {
    req.session.MessageError_Delete_Panel_Comment = error.message;
    res.redirect('/panelComment');
  }
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
  passport.authenticate('github', { scope: ['user.email']})
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', }),
  (req, res, next) => {
    res.redirect('/')
  }
);

module.exports = router;