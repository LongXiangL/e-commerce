const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const app = express()
const faker = require('faker')
const flash = require('connect-flash')
const session = require('express-session')

const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs' }))// 樣板引擎，指定副檔名為 .hbs

app.set('view engine', 'hbs')// 設定使用 Handlebars 做為樣板引擎
app.use(express.urlencoded({ extended: true }))// body-parser

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(flash()) // 掛載套件
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  next()
})
app.use(routes)
app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
