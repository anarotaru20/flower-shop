const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/auth");

const { createOrder, getOrders } = require("../controllers/orders");

router.post("/", authJwt, createOrder);
router.get("/", authJwt, getOrders);

module.exports = router;