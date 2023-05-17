/*
1. Start server by express
2. Connect database by express
3. Use middleware
 */
const mongoose = require('mongoose')
const express = require('express')
const app = express() // Generate Application Object

// Declare using static middleware
app.use(express.static('build'))
// Declare using decoding post request's middleware
app.use(express.urlencoded({extended: true})) // parameter of request: name=tom&pwd=123
app.use(express.json()) // parameter of request is a json structure: {name: tom, pwd: 123}
// Declare using decoding cookie data's middleware
const cookieParser = require('cookie-parser')
app.use(cookieParser())
// Declare using routers middleware
const indexRouter = require('./routers')
app.use('/', indexRouter)

// Connect 
mongoose.connect('mongodb://localhost/ManagementSystem', {family: 4})
.then(() => {
    console.log('connection successful')
    app.listen('5000', () => {
      console.log('Server start success, please visit: http://localhost:5000')
    })
})
.catch(error => {
    console.error('connection failed.', error)
})