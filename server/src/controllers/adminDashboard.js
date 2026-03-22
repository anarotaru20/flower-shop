const adminDashboardRepo = require('../repo/adminDashboard')

async function getOverview(req, res) {
  try {
    const data = await adminDashboardRepo.getOverview()
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea overview-ului din dashboard',
      error: error.message,
    })
  }
}

async function getTotalProducts(req, res) {
  try {
    const totalProducts = await adminDashboardRepo.getTotalProducts()
    return res.status(200).json({ totalProducts })
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea numarului total de produse',
      error: error.message,
    })
  }
}

async function getTotalOrders(req, res) {
  try {
    const totalOrders = await adminDashboardRepo.getTotalOrders()
    return res.status(200).json({ totalOrders })
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea numarului total de comenzi',
      error: error.message,
    })
  }
}

async function getTotalRevenue(req, res) {
  try {
    const totalRevenue = await adminDashboardRepo.getTotalRevenue()
    return res.status(200).json({ totalRevenue })
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea venitului total',
      error: error.message,
    })
  }
}

async function getRecentOrders(req, res) {
  try {
    const limit = Number(req.query.limit) || 5
    const recentOrders = await adminDashboardRepo.getRecentOrders(limit)
    return res.status(200).json(recentOrders)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea comenzilor recente',
      error: error.message,
    })
  }
}

async function getOrdersByMonth(req, res) {
  try {
    const year = Number(req.query.year) || new Date().getFullYear()
    const result = await adminDashboardRepo.getOrdersByMonth(year)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea comenzilor pe luni',
      error: error.message,
    })
  }
}

async function getRevenueByMonth(req, res) {
  try {
    const year = Number(req.query.year) || new Date().getFullYear()
    const result = await adminDashboardRepo.getRevenueByMonth(year)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea veniturilor pe luni',
      error: error.message,
    })
  }
}

module.exports = {
  getOverview,
  getTotalProducts,
  getTotalOrders,
  getTotalRevenue,
  getRecentOrders,
  getOrdersByMonth,
  getRevenueByMonth,
}