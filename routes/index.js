const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const productController = require('../controllers/product-controller')
const userController = require('../controllers/user-controller')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/products', productController.getProducts)

router.use('/', (req, res) => res.redirect('/products'))

module.exports = router
