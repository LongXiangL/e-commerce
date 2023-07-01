const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const app = express()
const faker = require('faker')

const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))// 樣板引擎，指定副檔名為 .hbs

app.set('view engine', 'hbs')// 設定使用 Handlebars 做為樣板引擎
app.use(express.urlencoded({ extended: true }))// body-parser
app.use(routes)
app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
