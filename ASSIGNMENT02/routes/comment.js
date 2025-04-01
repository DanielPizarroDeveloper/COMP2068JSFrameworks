var express = require('express');
var router = express.Router();

const isAuthenticated = require('../middlewares/Auth');
const today = require('../public/javascripts/getToday');
const { handlerSuccessCreate_Comment } = require('../public/mocks/Message');
const { createComment, getComments } = require('../Controllers/Comment/comment');

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
    res.redirect('/comments/comment');
  }
});
  
/* POST comments page. */
router.post('/comment', isAuthenticated,  async(req, res, next) => {
  try {
    const result = await createComment(req.user.username, req.body.title, today(), req.body.opinion);

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