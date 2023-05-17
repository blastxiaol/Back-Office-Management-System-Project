/*
  Define router modules
*/
const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')
const ProductModel = require('../models/ProductModel')
const RoleModel = require('../models/RoleModel')


// get router object
const router = express.Router()

// Login
router.post('/login', (req, res) => {
  const {username, password} = req.body
  // query users by username and password.
  // If not existed, then return a message,
  // otherwisw, return suceess and user infomation.
  UserModel.findOne({username, password: md5(password)})
    .then(user => {
      if (user) { // success
        // generate a cookie(userid: user._id), and give explore to save
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
        if (user.role_id) {
          RoleModel.findOne({_id: user.role_id})
            .then(role => {
              user._doc.role = role
              console.log('role user', user)
              res.send({status: 0, data: user})
            })
        } else {
          user._doc.role = {menus: []}
          // return success info
          res.send({status: 0, data: user})
        }

      } else {// login fail
        res.send({status: 1, msg: 'Wrong username or password!'})
      }
    })
    .catch(error => {
      console.error('Login failed.', error)
      res.send({status: 1, msg: 'Login failed. Please try again.'})
    })
})

// Add user
router.post('/manage/user/add', (req, res) => {
  const {username, password} = req.body
  // If user is existed, then return failed info
  // otherwisw, save
  UserModel.findOne({username})
    .then(user => {
      // user is existed
      if (user) {
        res.send({status: 1, msg: 'User is existed.'})
        return new Promise(() => {
        })
      } else { 
        // Save
        return UserModel.create({...req.body, password: md5(password || 'default')})
      }
    })
    .then(user => {
      // return user
      res.send({status: 0, data: user})
    })
    .catch(error => {
      console.error('Add user failed', error)
      res.send({status: 1, msg: 'Add user failed. Please try again.'})
    })
})


// Update user
router.post('/manage/user/update', (req, res) => {
  const user = req.body
  UserModel.findOneAndUpdate({_id: user._id}, user)
    .then(oldUser => {
      const data = Object.assign(oldUser, user)
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('Update user failed', error)
      res.send({status: 1, msg: 'Update user failed. Please try again.'})
    })
})

// Delete user
router.post('/manage/user/delete', (req, res) => {
  const {userId} = req.body
  UserModel.deleteOne({_id: userId})
    .then((doc) => {
      res.send({status: 0})
    })
})

// Get all user list
router.get('/manage/user/list', (req, res) => {
  UserModel.find({username: {'$ne': 'admin'}})
    .then(users => {
      RoleModel.find().then(roles => {
        res.send({status: 0, data: {users, roles}})
      })
    })
    .catch(error => {
      console.error('Get user list failed', error)
      res.send({status: 1, msg: 'Get user list failed. Please try again.'})
    })
})


// Add Category
router.post('/manage/category/add', (req, res) => {
  const {categoryName, parentId} = req.body
  CategoryModel.create({name: categoryName, parentId: parentId || '0'})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('Add Category failed', error)
      res.send({status: 1, msg: 'Add Category failed. Please try again.'})
    })
})

// Get category list
router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0'
  CategoryModel.find({parentId})
    .then(categorys => {
      res.send({status: 0, data: categorys})
    })
    .catch(error => {
      console.error('Get category list failed.', error)
      res.send({status: 1, msg: 'Get category list failed. Please try again.'})
    })
})

// Update category name
router.post('/manage/category/update', (req, res) => {
  const {categoryId, categoryName} = req.body
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
    .then(oldCategory => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('Update category name failed.', error)
      res.send({status: 1, msg: 'Update category name failed. Please try again.'})
    })
})

// get category infomation by ID
router.get('/manage/category/info', (req, res) => {
  const categoryId = req.query.categoryId
  CategoryModel.findOne({_id: categoryId})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('Get category infomation failed.', error)
      res.send({status: 1, msg: 'Get category infomation failed. Please try again.'})
    })
})


// Add Product
router.post('/manage/product/add', (req, res) => {
  const product = req.body
  ProductModel.create(product)
    .then(product => {
      res.send({status: 0, data: product})
    })
    .catch(error => {
      console.error('Add product failed.', error)
      res.send({status: 1, msg: 'Add product failed. Please try again.'})
    })
})

// Get product list
router.get('/manage/product/list', (req, res) => {
  const {pageNum, pageSize} = req.query
  ProductModel.find({})
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('Get product list failed.', error)
      res.send({status: 1, msg: 'Get product list failed. Please try again.'})
    })
})

// Search prodeuct list
router.get('/manage/product/search', (req, res) => {
  const {pageNum, pageSize, searchName, productName, productDesc} = req.query
  let contition = {}
  if (productName) {
    contition = {name: new RegExp(`^.*${productName}.*$`)}
  } else if (productDesc) {
    contition = {desc: new RegExp(`^.*${productDesc}.*$`)}
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('Search prodeuct list failed.', error)
      res.send({status: 1, msg: 'Search prodeuct list failed. Please try again.'})
    })
})

// Update product
router.post('/manage/product/update', (req, res) => {
  const product = req.body
  ProductModel.findOneAndUpdate({_id: product._id}, product)
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('Update product failed.', error)
      res.send({status: 1, msg: 'Update product failed. Please try again.'})
    })
})

// update product status
router.post('/manage/product/updateStatus', (req, res) => {
  const {productId, status} = req.body
  ProductModel.findOneAndUpdate({_id: productId}, {status})
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('update product status failed.', error)
      res.send({status: 1, msg: 'Update product status failed. Please try again.'})
    })
})


// Add role
router.post('/manage/role/add', (req, res) => {
  const {roleName} = req.body
  RoleModel.create({name: roleName})
    .then(role => {
      res.send({status: 0, data: role})
    })
    .catch(error => {
      console.error('Add role failed.', error)
      res.send({status: 1, msg: 'Add role failed. Please try again.'})
    })
})

// get role list
router.get('/manage/role/list', (req, res) => {
  RoleModel.find()
    .then(roles => {
      res.send({status: 0, data: roles})
    })
    .catch(error => {
      console.error('Get role list failed.', error)
      res.send({status: 1, msg: 'Get role list failed. Please try again.'})
    })
})

// Update role authority
router.post('/manage/role/update', (req, res) => {
  const role = req.body
  role.auth_time = Date.now()
  RoleModel.findOneAndUpdate({_id: role._id}, role)
    .then(oldRole => {
      // console.log('---', oldRole._doc)
      res.send({status: 0, data: {...oldRole._doc, ...role}})
    })
    .catch(error => {
      console.error('Update role authority failed.', error)
      res.send({status: 1, msg: 'Update authority failed. Please try again.'})
    })
})


/*
  Get a special page's objects
 */
function pageFilter(arr, pageNum, pageSize) {
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = arr.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = start + pageSize <= total ? start + pageSize : total
  const list = []
  for (var i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  }
}

require('./file-upload')(router)

module.exports = router