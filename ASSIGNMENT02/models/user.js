const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// Define schema object
const schemaUser = {
    username: { type: String, required: true },
    email: { type: String, required: true },
    oauthId: { type: String },
    oauthProvider: { type: String }
};

// Create mongoose schema
const mongooseSchema = new mongoose.Schema(schemaUser);
//Load the plugin into the mongoose schema before creating the model
mongooseSchema.plugin(plm, { usernameField: 'email' });
// Create and export mongoose model
module.exports = mongoose.model('Users', mongooseSchema);