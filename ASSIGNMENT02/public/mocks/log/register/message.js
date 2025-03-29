function handleIncompleteSignup () {
    return 'Complete all fields to create your account.';
}

function handleExistsAccount () {
    return 'An account with this email already exists.';
}

export default {
    handleIncompleteSignup,
    handleExistsAccount
};