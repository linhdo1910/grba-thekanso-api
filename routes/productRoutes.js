const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const Product = require('../models/Products'); 

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

// Route lấy nhiều sản phẩm theo productIds
router.post('/multiple', async (req, res) => {
    const { productIds } = req.body; // Lấy danh sách productIds từ body của request
    try {
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ message: 'No valid product IDs provided' });
      }

      // Truy vấn cơ sở dữ liệu để lấy thông tin các sản phẩm có ID nằm trong danh sách productIds
      const products = await Product.find({ '_id': { $in: productIds } });

      // Kiểm tra nếu không tìm thấy sản phẩm nào
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found for the provided IDs' });
      }

      // Trả về dữ liệu sản phẩm
      res.json({ data: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
});

module.exports = router;
