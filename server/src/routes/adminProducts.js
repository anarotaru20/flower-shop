const express = require('express')
const router = express.Router()
const adminProductsController = require('../controllers/adminProducts')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')

router.use(auth, isAdmin)

router.get('/', adminProductsController.getAllProducts)
router.post('/', adminProductsController.createProduct)
router.put('/:id', adminProductsController.updateProduct)
router.delete('/:id', adminProductsController.deleteProduct)

module.exports = router