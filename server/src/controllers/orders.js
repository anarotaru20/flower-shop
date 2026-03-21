const ordersRepo = require("../repo/orders");

async function createOrder(req, res) {
  try {
    const user_id = req.user.id;
    const { items } = req.body;

    const result = await ordersRepo.createOrder(user_id, items);

    res.json({
      message: "Order created",
      order_id: result.order.id,
      total: result.total,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function getOrders(req, res) {
  try {
    const user_id = req.user.id;

    const data = await ordersRepo.getOrders(user_id);

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { createOrder, getOrders };
