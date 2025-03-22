// require and initialize dotenv
require('dotenv').config();

// create configuration object
const configurations = {
    ConnectionStrings:{
        MongoDB: process.env.CONNECTION_STRING_MONGODB
    }
}

// export configuration object
module.exports = configurations;