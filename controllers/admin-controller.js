const { Product } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
    const { name, price, image, description, inventory } = req.body
    if (!name) throw new Error('Product name is required!')
    const { file } = req
    imgurFileHandler(file)
      .then(filePath => Product.create({
        name,
        price,
        image: filePath || null || image,
        description,
        inventory
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
  },
  editProduct: (req, res, next) => {
    Product.findByPk(req.params.id, {
      raw: true
    })
      .then(product => {
        if (!product) throw new Error("Product didn't exist!")
        res.render('admin/edit-product', { product })
      })
      .catch(err => next(err))
  },
  putProduct: (req, res, next) => {
    const { name, price, image, description, inventory } = req.body
    if (!name) throw new Error('Product name is required!')
    const { file } = req
    Promise.all([
      Product.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([product, filePath]) => {
        if (!product) throw new Error("Product didn't exist!")
        return product.update({
          name,
          price,
          image: filePath || product.image || image,
          description,
          inventory
        })
      })
      .then(() => {
        req.flash('success_messages', 'product was successfully to update')
        res.redirect('/admin/products')
      })
      .catch(err => next(err))
  },
  deleteProduct: (req, res, next) => {
    return Product.findByPk(req.params.id)
      .then(product => {
        if (!product) throw new Error("product didn't exist!")
        return product.destroy()
      })
      .then(() => {
        req.flash('success_messages', `Product Id:${req.params.id} Delete Success!`)
        res.redirect('/admin/products')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
