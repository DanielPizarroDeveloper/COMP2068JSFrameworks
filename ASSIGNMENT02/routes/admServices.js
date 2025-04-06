var express = require('express');
var router = express.Router();

//DateNow
const today = require('../public/javascripts/getToday');

//CRUD
const { createService, getService, updatedServiceByID, deleteServiceByID } = require('../Controllers/Service/service');

//Message
const { handleSuccessCreate, handleSuccessUpdate, handleSuccessDelete, } = require('../public/mocks/Message');

//Sessions
const { checked_Create, checked_Update, checked_Delete } = require('../public/mocks/Message');

//toUpperCaseUser
const toUpperCaseText = require('../public/javascripts/toUpperCase');

//isAuthenticated
const isAuthenticated = require('../middlewares/Auth');

router.get('/panelService', isAuthenticated, async(req, res, next) => {
  var displayName = toUpperCaseText(req.user.username);
  const serviceList = await getService();
  
  if (serviceList.length > 0) {
    //Checked
    const radioChecked = req.session.RadioButton ? req.session.RadioButton : null;;
    req.session.RadioButton = null;
  
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

    res.render('panelService', { 
      title: 'Service Administrator', radioChecked, serviceList, 
      user: displayName, successCreateMessage_Panel_Service, failedCreateMessage_Panel_Service, 
      successUpdateMessage_Panel_Service, failedUpdateMessage_Panel_Service, successDeleteMessage_Panel_Service, 
      failedDeleteMessage_Panel_Service, stylesheetADMCommon: '/stylesheets/panel/common.css', stylesheetADMService: '/stylesheets/panel/service.css' }); 
  }
  else {
    res.render('panelService', { 
      title: 'Service Administrator', radioChecked, 
      serviceList, user: displayName, 
      successDeleteMessage_Panel_Service, stylesheetADMCommon: '/stylesheets/panel/common.css', stylesheetADMService: '/stylesheets/panel/service.css' });
  }
});
  
router.post('/panelService', isAuthenticated, async(req, res, next) => {
  try {
    const result = await createService(req.body.serviceName, req.body.serviceDescription, req.body.servicePrice, req.body.base64Create, today());
    
    if(result) {
      req.session.Message_Create_Panel_Service = handleSuccessCreate();
    }
  } catch (error) {
    req.session.MessageError_Create_Panel_Service = error.message;
  }

  req.session.RadioButton = checked_Create();
  res.redirect('/admServices/panelService');
});
  
router.post('/panelService/:_id', isAuthenticated, async(req, res, next) => {
  try {
    const result = await updatedServiceByID(req.params._id, req.body.serviceName, req.body.description, req.body.price, req.body.base64Update, today());
    
    if(result) {
      req.session.Message_Update_Panel_Service = handleSuccessUpdate();
      
    }
  } catch (error) {
    req.session.MessageError_Update_Panel_Service = error.message;
    
  }
  req.session.RadioButton = checked_Update();
  res.redirect('/admServices/panelService');
});
  
router.get('/panelService/:_id', async(req, res, next) => {
  try {
    const result = await deleteServiceByID(req.params._id);

    if(result) {
      req.session.Message_Delete_Panel_Service = handleSuccessDelete();
      
    }
  } catch (error) {
    req.session.MessageError_Delete_Panel_Service = error.message;
    
  }
  req.session.RadioButton = checked_Delete();
  res.redirect('/admServices/panelService');
});

module.exports = router;