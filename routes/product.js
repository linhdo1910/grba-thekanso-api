// productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// Lấy sản phẩm theo ID
router.get('/:id', productController.getProductById);

// Thêm sản phẩm mới
router.post('/', productController.addProduct);

// Cập nhật sản phẩm
router.put('/:id', productController.updateProduct);

// Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

// Tìm kiếm sản phẩm
router.get('/search/:id', productController.searchProducts);

// Cập nhật đánh giá
router.put('/rating/:id', productController.updateRating);

module.exports = router;
