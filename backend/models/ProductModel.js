/*
  Product Table
*/
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    categoryId: {type: String, required: true}, // category id
    pCategoryId: {type: String, required: true}, // parent category id
    name: {type: String, required: true}, 
    price: {type: Number, required: true},
    desc: {type: String},       // description
    status: {type: Number, default: 1}, // product status: 1:for sale, 2: off shore
    imgs: {type: Array, default: []}, // an array saving N images JSON string name
    detail: {type: String}
})

const ProductModel = mongoose.model('products', productSchema)
module.exports = ProductModel