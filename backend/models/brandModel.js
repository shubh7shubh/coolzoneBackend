// models/brand.js
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
