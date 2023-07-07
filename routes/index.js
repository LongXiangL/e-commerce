const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const productController = require('../controllers/product-controller')
const userController = require('../controllers/user-controller')
const cartController = require('../controllers/cart-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/homepage', productController.getHomepage, cartController.postCart)

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/products/:id', productController.getProduct)
router.get('/products', authenticated, cartController.getCart, productController.getProducts)
router.post('/cart', authenticated, cartController.postCart)

router.post('/cartItem/:productId/add', authenticated, cartController.addCartItem)
router.post('/cartItem/:productId/sub', authenticated, cartController.subCartItem)

router.delete('/cartItem/:productId', authenticated, cartController.deleteCartItem)

router.use('/', (req, res) => res.redirect('/products'))
router.use('/', generalErrorHandler)

module.exports = router
