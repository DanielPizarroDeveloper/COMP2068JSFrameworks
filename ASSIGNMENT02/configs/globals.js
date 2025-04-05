// require and initialize dotenv
require('dotenv').config();

// create configuration object
const configurations = {
    ConnectionStrings: {
        MongoDB: process.env.CONNECTION_STRING_MONGODB
    },
    GitHub: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callback: process.env.GITHUB_CLIENT_CALLBACK
    },
    Google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callback: process.env.GOOGLE_CLIENT_CALLBACK
    }
}

// export configuration object
module.exports = configurations;