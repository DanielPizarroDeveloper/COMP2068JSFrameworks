var express = require('express');
var router = express.Router();

const today = require('../public/javascripts/getToday');
const { createProduct, getProduct, updatedProductByID, deleteProductByID } = require('../Controllers/Product/product');

//Sessions

//Message
const { handleSuccessCreate, handleSuccessUpdate, handleSuccessDelete } = require('../public/mocks/Message');

//Sessions
const { checked_Create, checked_Update, checked_Delete } = require('../public/mocks/Message');

//Auth
const isAuthenticated = require('../middlewares/Auth');

router.get('/panelProduct', isAuthenticated, async(req, res, next) => {
  try {
    const productsList = await getProduct();

    if(productsList.length > 0) {
      //Checked
      const radioChecked = req.session.RadioButton ? req.session.RadioButton : null;;
      req.session.RadioButton = null;

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
      res.render('panelProduct', { title: 'Product Administrator', radioChecked, productsList, user: req.user.username, successCreateMessage_Panel_Product, failedCreateMessage_Panel_Product, successUpdateMessage_Panel_Product, failedUpdateMessage_Panel_Product, successDeleteMessage_Panel_Product, failedDeleteMessage_Panel_Product });
    }
  } catch (error) {
    req.session.MessageError_Read = error.message;
    res.redirect('/admProducts/panelProduct');
  }
});

router.post('/panelProduct', isAuthenticated, async(req, res, next) => {
  try {
    const result = await createProduct(req.body.productName, req.body.productDescription, req.body.productQuantity, req.body.productUnit, today(), req.body.productPrice, req.body.base64Create); 
    
    if(result) {
      req.session.Message_Create_Panel_Product = handleSuccessCreate();
    }
  } catch (error) {
    req.session.MessageError_Create_Panel_Product = error.message;
  }

  req.session.RadioButton = checked_Create();
  res.redirect('/admProducts/panelProduct');
});
  
router.post('/panelProduct/:_id', async (req, res, next) => {
  try {
    const result = await updatedProductByID(req.params._id, req.body.productUpdateName, req.body.productUpdateDescription, req.body.productUpdateQuantity, today(), req.body.productUpdatePrice, req.body.base64Update); 
    if(result) {
      req.session.Message_Update_Panel_Product = handleSuccessUpdate();
    }
  } catch (error) {
    req.session.MessageError_Update_Panel_Product = error.message;
  }

  req.session.RadioButton = checked_Update();
  res.redirect('/admProducts/panelProduct');
});
  
router.get('/panelProduct/:_id', async (req, res, next) => {
  try {
    const result = await deleteProductByID(req.params._id);

    if(result) {
      req.session.Message_Delete_Panel_Product = handleSuccessDelete();
    }

  } catch (error) {
    req.session.MessageError_Delete_Panel_Product = error.message;
  }

  req.session.RadioButton = checked_Delete();
  res.redirect('/admProducts/panelProduct');
});

module.exports = router;