const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')
router.get('/products/create', adminController.createProduct)
router.get('/products/:id/edit', adminController.editProduct)
router.get('/products/:id', adminController.getProduct)
router.put('/products/:id', upload.single('image'), adminController.putProduct)
router.delete('/products/:id', adminController.deleteProduct)

router.get('/products', adminController.getProducts)
router.post('/products', upload.single('image'), adminController.postProduct)

router.get('/', (req, res) => res.redirect('/admin/products'))
module.exports = router
