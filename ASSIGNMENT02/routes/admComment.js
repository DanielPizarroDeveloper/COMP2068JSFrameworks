var express = require('express');
var router = express.Router();

//isAuthenticated
const isAuthenticated = require('../middlewares/Auth');

//Message
const { handleSuccessDelete } = require('../public/mocks/Message');

//CRUD
const { getComments, deleteCommentByID } = require('../Controllers/Comment/comment');

//toUpperCaseUser
const toUpperCaseText = require('../public/javascripts/toUpperCase');

router.get('/panelComment', isAuthenticated, async(req, res, next) => {
  try {
    var displayName = toUpperCaseText(req.user.username);
    const commentsOrderBy = await getComments();
    
    //Delete
    const successDeleteMessage_Panel_Comment = req.session.Message_Delete_Panel_Comment;
    const failedDeleteMessage_Panel_Comment = req.session.MessageError_Delete_Panel_Comment;

    req.session.Message_Delete_Panel_Comment = null;
    req.session.MessageError_Delete_Panel_Comment = null;

    if (commentsOrderBy.length > 0) {
      res.render('panelComment', { 
        title: 'Panel Comment', commentsOrderBy, 
        user: displayName, successDeleteMessage_Panel_Comment, 
        failedDeleteMessage_Panel_Comment, stylesheetADMCommon: '/stylesheets/panel/common.css', stylesheetComment: '/stylesheets/general/comment.css' });
    }
    else {
      res.render('panelComment', { 
        title: 'Panel Comment', commentsOrderBy, 
        user: displayName, successDeleteMessage_Panel_Comment,
        stylesheetADMCommon: '/stylesheets/panel/common.css', stylesheetComment: '/stylesheets/general/comment.css' });
    }
  } catch (error) {
    failedLoadMessage_Comment = error.message;
    res.render('panelComment', { 
      title: 'Panel Comment', user: displayName, 
      failedLoadMessage_Comment, stylesheetADMCommon: '/stylesheets/panel/common.css', stylesheetComment: '/stylesheets/general/comment.css' });
  }
});
  
//Delete Comment
router.get('/panelComment/:_id', async(req, res, next) => {
  try {
    const result = await deleteCommentByID(req.params._id);
    if(result) {
      req.session.Message_Delete_Panel_Comment = handleSuccessDelete();
      res.redirect('/admComment/panelComment');
    }
  } catch (error) {
    req.session.MessageError_Delete_Panel_Comment = error.message;
    res.redirect('/admComment/panelComment');
  }
});
  
module.exports = router;