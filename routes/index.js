const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const productController = require('../controllers/product-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/products', productController.getProducts)

router.use('/', (req, res) => res.redirect('/products'))
router.use('/', generalErrorHandler)

module.exports = router
