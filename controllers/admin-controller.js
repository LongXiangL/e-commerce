const { Product } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getProducts: (req, res, next) => {
    Product.findAll({
      raw: true
    })
      .then(products => res.render('admin/products', { products }))
      .catch(err => next(err))
  },
  createProduct: (req, res) => {
    return res.render('admin/create-product')
  },
  postProduct: (req, res, next) => {
    const { name, price, image, description } = req.body
    if (!name) throw new Error('Product name is required!')
    const { file } = req
    localFileHandler(file)
      .then(filePath => Product.create({
        name,
        price,
        image: filePath || null || image,
        description
      }))
      .then(() => {
        req.flash('success_messages', 'product was successfully created')
        res.redirect('/admin/products')
      })
      .catch(err => next(err))
  },
  getProduct: (req, res, next) => {
    Product.findByPk(req.params.id, { // 去資料庫用 id 找一筆資料
      raw: true // 找到以後整理格式再回傳
    })
      .then(product => {
        if (!product) throw new Error("Product didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('admin/product', { product })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
