const express = require("express");
const router = express.Router();

const paymentsController = require("../controllers/payments");
const authJwt = require("../middleware/auth");

router.post("/create-intent", authJwt, paymentsController.createPaymentIntent);
router.post("/confirm", authJwt, paymentsController.confirmOrderPayment)

module.exports = router;