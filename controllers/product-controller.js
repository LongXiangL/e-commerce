const { Product } = require('../models')

const productController = {
  getProducts: (req, res) => {
    return Product.findAll({
      nest: true,
      raw: true
    }).then(products => {
      const data = products.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('products', {
        products: data
      })
    })
  }
}
module.exports = productController
