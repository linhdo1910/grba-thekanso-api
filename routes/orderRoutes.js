const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.get('/search', orderController.searchOrders);
router.get('/username/:username', orderController.getOrdersByUsername);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);

module.exports = router;
