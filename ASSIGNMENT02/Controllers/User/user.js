const User = require('../../models/user');
const { handleExistsAccount } = require('../../public/mocks/Message');

const findUser = async(userEmail) => {
    return accountData = await User.findOne({ email: userEmail });
}

const registerUser = async(userName, userEmail, userPassword) => {
    var userAccount = await findUser(userEmail);

    if(userAccount === null) {
      return new Promise((resolve, reject) => {
          User.register(
            new User({
              username: userName,
              email: userEmail
            }),
            userPassword,
            (error, newUser) => {
              if(error) {
                return reject(error);
              }
              resolve(newUser);
            }
          );
      });
    }
    else {
      throw new Error(handleExistsAccount());
    }
}

module.exports = {
    registerUser
}