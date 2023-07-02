const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')
router.get('//products', authenticatedAdmin, adminController.getProducts)
router.use('/', (req, res) => res.redirect('/admin/products'))
module.exports = router
