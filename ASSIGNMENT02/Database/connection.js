// Import configurations file and mongoose to connect to DB
var configs = require('../configs/globals');
var mongoose = require('mongoose');

const connections_Mongo_DB = () => {
    //Connect to MongoDB
    mongoose.connect(configs.ConnectionStrings.MongoDB)
    .then(() => { 
        console.log('Connected to MongoDB!'); 
    })
    .catch((err) => { 
        console.log('Error connecting to MongoDB!', err); 
    });
}

module.exports = { connections_Mongo_DB };