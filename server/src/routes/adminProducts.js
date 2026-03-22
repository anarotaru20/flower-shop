const express = require('express')
const router = express.Router()
const adminDashboardController = require('../controllers/adminDashboard')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')

router.use(auth, isAdmin)

router.get('/overview', adminDashboardController.getOverview)
router.get('/total-products', adminDashboardController.getTotalProducts)
router.get('/total-orders', adminDashboardController.getTotalOrders)
router.get('/total-revenue', adminDashboardController.getTotalRevenue)
router.get('/recent-orders', adminDashboardController.getRecentOrders)
router.get('/orders-by-month', adminDashboardController.getOrdersByMonth)
router.get('/revenue-by-month', adminDashboardController.getRevenueByMonth)

module.exports = router