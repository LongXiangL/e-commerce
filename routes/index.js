const express = require('express')
const router = express.Router()
const productController = require('../controllers/product-controller')

router.get('/products', productController.getProducts)

router.use('/', (req, res) => res.redirect('/products'))

module.exports = router
