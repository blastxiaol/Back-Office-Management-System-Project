/*
  Model of category (Table)
 */
const mongoose = require('mongoose')

// Schema (Limitation)
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  parentId: {type: String, required: true, default: '0'}
})

// Create a model (table) which can be operated
const CategoryModel = mongoose.model('categorys', categorySchema)

// export Model
module.exports = CategoryModel