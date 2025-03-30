//System
const handleErrorSystem = () => {
    return '🚨 Something went wrong. Please try again later or contact support if the issue persists.'
}

const handleNotFoundData = () => {
    return 'ℹ️ There are no records available at the moment.';
}

//Service - Product
const handleSuccessCreate = () => {
    return '🎉 Congratulations. The record has been successfully created';
}

const handleFailedCreate = () => {
    return '⚠️ Oops, something went wrong. The record could not be created. Please try again';
}

const handleSuccessUpdate = () => {
    return '🎉 Congratulations. The record has been successfully updated';
}

const handleFailedUpdate = () => {
    return '⚠️ Oops, something went wrong. The record could not be updated. Please try again';
}

const handleSuccessDelete = () => {
    return '🎉 Congratulations. The record has been successfully deleted';
}

const handleFailedDelete = () => {
    return '⚠️ Oops, something went wrong. The record could not be deleted. Please try again';
}

const handleIncompleteForm = () => {
    return '⚠️ Oops, something went wrong. Please complete the form to create an element.';
}

//Account
//Login
const handleIncompleteSignup = () => {
    return '⚠️ Complete all fields to create your account.';
}

const handleSigninError = () => {
    return '⚠️ Invalid credentials. Please check and try again.';
}

//Register
const handleExistsAccount = () => {
    return '⚠️ An account with this email already exists.';
}

const handleFailedSignIn = () => {
    return '⚠️ Error logging in after registration.';
}

//Comment
const handlerSuccessCreate_Comment = () => {
    return '🎉 Congratulations. Your comment has been posted successfully.';
}

const handleIncompleteForm_Comment = () => {
    return '⚠️ Oops, something went wrong. Please complete the form to create a comment';
}

//Contact
const handleSendEmail = () => {
    return '🎉 Your email was sent! We\'ll reply soon.';
}

const handleErrorEmail = () => {
    return '⚠️ Failed to send your email. Please try again later.';
}


module.exports = {
    handleSuccessCreate,
    handleFailedCreate,
    handleNotFoundData,
    handleSuccessUpdate,
    handleFailedUpdate,
    handleSuccessDelete,
    handleFailedDelete,
    handleIncompleteForm,
    handleErrorSystem,
    handleIncompleteSignup,
    handleExistsAccount,
    handleFailedSignIn,
    handlerSuccessCreate_Comment,
    handleIncompleteForm_Comment,
    handleSigninError,
    handleSendEmail,
    handleErrorEmail
}