const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

console.log("Product routes loaded");

// Các route chuyên biệt cần được khai báo trước
router.get('/search', productController.searchProducts);
router.get('/bySubCategory', productController.getProductsBySubCategory);
router.get('/byColor', productController.getProductsByColor);
router.get('/filters', productController.getFilterOptions);

// Các route chung
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/rating/:id', productController.updateRating);

module.exports = router;
