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
  }
}
module.exports = adminController
