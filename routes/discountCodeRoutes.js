const express = require('express');
const router = express.Router();
const discountCodeController = require('../controllers/discountCodeController');

console.log("DiscountCode routes loaded");

// Lấy danh sách discount codes
router.get('/', discountCodeController.getDiscountCodes);

// Tạo discount code mới
router.post('/', discountCodeController.createDiscountCode);

// Cập nhật discount code
router.put('/:id', discountCodeController.updateDiscountCode);

// Xóa discount code
router.delete('/:id', discountCodeController.deleteDiscountCode);

module.exports = router;
