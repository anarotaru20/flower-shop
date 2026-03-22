const express = require('express')
const router = express.Router()
const adminOrdersController = require('../controllers/adminOrders')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')

router.use(auth, isAdmin)

router.get('/', adminOrdersController.getAllOrders)
router.get('/:id', adminOrdersController.getOrderById)
router.put('/:id/status', adminOrdersController.updateOrderStatus)

module.exports = router