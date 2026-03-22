const adminOrdersRepo = require('../repo/adminOrders')

async function getAllOrders(req, res) {
  try {
    const orders = await adminOrdersRepo.getAllOrders()
    return res.status(200).json(orders)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea comenzilor',
      error: error.message,
    })
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params
    const order = await adminOrdersRepo.getOrderById(id)
    return res.status(200).json(order)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea comenzii',
      error: error.message,
    })
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await adminOrdersRepo.updateOrderStatus(id, status)

    return res.status(200).json(order)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la actualizarea statusului comenzii',
      error: error.message,
    })
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
}