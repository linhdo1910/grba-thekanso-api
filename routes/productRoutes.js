const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


console.log("Product routes loaded");

router.get('/', productController.getAllProducts);      // GET /api/products
router.get('/search', productController.searchProducts); //GET /api/products/search?keyword=...
router.get('/:id', productController.getProductById);   // GET /api/products/:id
router.post('/', productController.createProduct);       // POST /api/products
router.put('/:id', productController.updateProduct);     // PUT /api/products/:id
router.delete('/:id', productController.deleteProduct);  // DELETE /api/products/:id

module.exports = router;