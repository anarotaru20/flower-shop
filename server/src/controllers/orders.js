const ordersRepo = require("../repo/orders");

async function createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const data = await ordersRepo.createOrder(userId, req.body);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function getOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const data = await ordersRepo.getOrdersByUserId(userId);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrders,
};
