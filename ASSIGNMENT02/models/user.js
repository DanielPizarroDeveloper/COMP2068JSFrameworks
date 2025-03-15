const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// Define schema object
const schemaUser = {
    name: { type: String, required: true },
    email: { type: String, required: true }
}

// Create mongoose schema
const mongooseSchema = new mongoose.Schema(schemaUser);
//Load the plugin into the mongoose schema before creating the model
mongooseSchema.plugin(plm, { usernameField: 'email' });
// Create and export mongoose model
module.exports = mongoose.model('Users', mongooseSchema);