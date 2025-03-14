const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

console.log("Product routes loaded");

// Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// Tìm kiếm sản phẩm theo query (ví dụ: /api/products/search?keyword=... )
router.get('/search', productController.searchProducts);

// Lấy sản phẩm theo ID
router.get('/:id', productController.getProductById);

// Tạo sản phẩm mới
router.post('/', productController.createProduct);

// Cập nhật sản phẩm
router.put('/:id', productController.updateProduct);

// Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

// Cập nhật đánh giá 
router.put('/rating/:id', productController.updateRating);

module.exports = router;
