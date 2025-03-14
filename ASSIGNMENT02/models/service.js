const mongoose = require('mongoose');

// Define schema object
const schemaService = {
    title: { type: String },
    detail: { type: String },
    price: { type: Number },
    imgService: { type: String }
}

// Create mongoose schema
const mongooseSchema = new mongoose.Schema(schemaService);
// Create and export mongoose model
module.exports = mongoose.model('Services', mongooseSchema, 'services');