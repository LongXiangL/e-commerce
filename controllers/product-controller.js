const { Product } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const productController = {
  getProducts: (req, res) => {
    // 分頁
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Product.findAndCountAll({
      limit,
      offset,
      nest: true,
      raw: true
    }).then(products => {
      const data = products.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('products', {
        products: data,
        pagination: getPagination(limit, page, products.count)
      })
    })
  }
}
module.exports = productController
