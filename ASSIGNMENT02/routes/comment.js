var express = require('express');
var router = express.Router();

//isAuthenticated
const isAuthenticated = require('../middlewares/Auth');

//DateNow
const today = require('../public/javascripts/getToday');

//Message
const { handlerSuccessCreate_Comment } = require('../public/mocks/Message');

//CRUD
const { createComment, getComments } = require('../Controllers/Comment/comment');

//toUpperCaseUser
const toUpperCaseText = require('../public/javascripts/toUpperCase');

router.get('/comment', isAuthenticated,  async(req, res, next) => {
  try {
    var displayName = toUpperCaseText(req.user.username);

    //Create
    const successCreateMessage_Comment = req.session.Message_Create_Comment;
    const failedCreateMessage_Comment = req.session.MessageError_Create_Comment;

    req.session.Message_Create_Comment = null;
    req.session.MessageError_Create_Comment = null;

    const commentsOrderBy = await getComments();
    if (commentsOrderBy.length > 0) {
      res.render('comment', { title: 'Comment', commentsOrderBy, user: displayName, successCreateMessage_Comment, failedCreateMessage_Comment });
    }
  } catch (error) {
    req.session.MessageError_Create_Comment = error.message;
    res.redirect('/comments/comment');
  }
});
  
/* POST comments page. */
router.post('/comment', isAuthenticated,  async(req, res, next) => {
  try {
    const result = await createComment(displayName, req.body.title, today(), req.body.opinion);

    if (result) {
      req.session.Message_Create_Comment = handlerSuccessCreate_Comment();
      res.redirect('/comments/comment');
    }
  } catch (error) {
    req.session.MessageError_Create_Comment = error.message;
    res.redirect('/comments/comment');
  }
});

module.exports = router;