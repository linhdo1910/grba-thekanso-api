// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

console.log("Payment routes loaded");

// Endpoint để ghi nhận phương thức thanh toán
router.post('/:orderId/init', paymentController.initPayment);

// Endpoint xác nhận thanh toán thành công (Payment Success)
router.post('/:orderId/confirm', paymentController.confirmPayment);

module.exports = router;
