const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')
router.get('/products/create', adminController.createProduct)
router.get('/products', adminController.getProducts)
router.post('/products', upload.single('image'), adminController.postProduct)

router.use('/', (req, res) => res.redirect('/admin/products'))
module.exports = router
