const Comment = require('../../models/comment');
const { normalize_identifier } = require('../normalize');

const { handleIncompleteForm_Comment, handleNotFoundData, handleFailedDelete } = require('../../public/mocks/Message');

const getInitials = (userName) => {
  let usernameSplit = userName.split(' ');
  let lengthName = usernameSplit.length;
  let initialsUser = null;
    
  switch (lengthName) {
    case 1:
      initialsUser = usernameSplit[0][0];
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

  return initialsUser;
}

const createComment = async(userName, titleComment, today, commentBody) => {
  const initialUser = getInitials(userName);
  if(!userName || !titleComment || !commentBody || commentBody.trim().length === 0){
    throw new Error(handleIncompleteForm_Comment());
  }
  else {
    let newComment = new Comment({
      responsable: userName,
      title: titleComment,
      date: today,
      bodydescription: commentBody,
      initials: initialUser
    });
  
    await newComment.save();
    return true;
  }
}

const getComments = async() => {
  const comments = await Comment.find();    
  if(comments.length > 0) {
      const commentsOrderBy = comments.sort((a, b) => new Date(b.date) - new Date(a.date));
      return commentsOrderBy;
  }
  else {
      throw new Error(handleNotFoundData());
  }
}

const deleteCommentByID = async(ID) => {
  try {
    const commentID = normalize_identifier(ID);
    await Comment.findByIdAndDelete(commentID);
    return true;
  } catch (error) {
      throw new Error(handleFailedDelete());
  }
}

module.exports = {
    createComment,
    getComments,
    deleteCommentByID
}