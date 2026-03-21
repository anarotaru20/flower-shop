const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/orders");
const authJwt = require("../middleware/auth");

router.post("/", authJwt, ordersController.createOrder);
router.get("/", authJwt, ordersController.getOrders);
router.put("/:id/cancel", authJwt, ordersController.cancelOrder);

module.exports = router;
