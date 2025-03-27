const mongoose = require('mongoose');

// Define schema object
const schemaComment = {
    responsable: { type: String, required: true},
    title: { type: String, required: true},
    date: { type: String, required: true},
    bodydescription: { type: String, required: true},
    initials: { type: String, required: true}
}

// Create mongoose schema
const mongooseSchema = new mongoose.Schema(schemaComment);
// Create and export mongoose model
module.exports = mongoose.model('Comment', mongooseSchema, 'comments');