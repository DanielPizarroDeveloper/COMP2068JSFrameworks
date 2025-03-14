const mongoose = require('mongoose');

// Define schema object
const schemaProduct = {
    title: { type: String },
    detail: { type: String },
    quantity: { type: Number },
    unit: { type: String },
    publication: { type: String },
    price: { type: Number },
    imgProduct: { type: String }
}

// Create mongoose schema
const mongooseSchema = new mongoose.Schema(schemaProduct);
// Create and export mongoose model
module.exports = mongoose.model('Products', mongooseSchema, 'products');