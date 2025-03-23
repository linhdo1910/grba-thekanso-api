const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authMiddleware');

// Các route đơn hàng
router.post('/', authenticateToken, orderController.createOrder);
router.get('/', authenticateToken, orderController.getOrders);
router.get('/search', authenticateToken, orderController.searchOrders);
router.get('/username/:username', authenticateToken, orderController.getOrdersByUsername);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.put('/:id', authenticateToken, orderController.updateOrder);

module.exports = router;
