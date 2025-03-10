// models/productData.js
const mongoose = require('mongoose');
const Product = require('./Product');

const productData = [
    {
        productName: "Laptop Gaming Asus ROG",
        price: 25000000,
        description: "Laptop gaming cao cấp với CPU Intel Core i7, RAM 16GB, SSD 512GB",
        status: 1, // 1 = Available
        stock: 10,
        categoryId: "GAMING",
        image: "https://example.com/laptop-rog.jpg",
        rating: 4.5,
        discount: 5,
        previousPrice: 26000000
    },
    {
        productName: "iPhone 15 Pro Max",
        price: 32000000,
        description: "iPhone 15 Pro Max mới nhất với camera 48MP, chip A17 Pro",
        status: 1,
        stock: 15,
        categoryId: "PHONE",
        image: "https://example.com/iphone-15.jpg",
        rating: 4.8,
        discount: 0,
        previousPrice: null
    }
];

// Hàm để thêm dữ liệu mẫu vào database
const seedProducts = async () => {
    try {
        // Kiểm tra xem đã có sản phẩm trong database chưa
        const existingProducts = await Product.find();
        
        // Nếu chưa có sản phẩm nào, thêm dữ liệu mẫu
        if (existingProducts.length === 0) {
            const createdProducts = await Product.insertMany(productData);
            console.log('Đã thêm thành công các sản phẩm mẫu:', createdProducts);
            return createdProducts;
        } else {
            console.log('Đã có sản phẩm trong database, không cần thêm dữ liệu mẫu');
            return existingProducts;
        }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm mẫu:', error);
        throw error;
    }
};

module.exports = {
    productData,
    seedProducts
};