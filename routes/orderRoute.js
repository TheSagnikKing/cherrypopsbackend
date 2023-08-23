const express = require("express")
const { createOrder, checkout, paymentverification } = require("../controllers/orderController")
const router = express.Router()

router.route("/order").post(createOrder)

//Razorpay
router.route('/checkout').post(checkout)
router.route("/paymentverification/:slug").post(paymentverification);

module.exports = router