const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);
router.get('/', authenticateToken, cartController.getCart);
router.post('/add', authenticateToken, cartController.addToCart);
router.put('/update/:itemId/:quantity', authenticateToken, cartController.updateCartItem);
router.delete('/remove/:itemId', authenticateToken, cartController.removeCartItem);
router.delete('/clear', authenticateToken, cartController.clearCart);

module.exports = router;

