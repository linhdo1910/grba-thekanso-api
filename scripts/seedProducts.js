const mongoose = require('mongoose');
const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Products');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Hàm chuyển đổi file ảnh thành Base64
function imageToBase64(filePath) {
  const file = fs.readFileSync(filePath);
  const base64 = file.toString('base64');
  // Giả sử ảnh là JPEG; nếu là PNG, hãy thay "jpeg" thành "png"
  return `data:image/jpeg;base64,${base64}`;
}

async function seedProducts() {
  try {
    const jsonArray = await csv().fromFile('./scripts/data/ProductData.csv');
    const transformedData = jsonArray.map(item => {
      // Xây dựng đường dẫn cho ảnh bìa (coverImage)
      const coverImagePath = path.join(__dirname, 'data', 'images', item.coverImage);
      const coverImageBase64 = imageToBase64(coverImagePath);

      // Xử lý cột images: tách theo dấu phẩy và loại bỏ khoảng trắng
      let imagesBase64 = [];
      if (item.images) {
        imagesBase64 = item.images.split(',').map(filename => {
          const filePath = path.join(__dirname, 'data', 'images', filename.trim());
          return imageToBase64(filePath);
        });
      }

      return {
        productName: item.productName,
        brandName: item.brandName,
        productPrice: Number(item.productPrice.replace(/[^0-9.]/g, '')) || 0,
        productDescription: item.productDescription,
        productStock: Number(item.productStock) || 0,
        productCategory: item.productCategory,
        productSubCategory: item.productSubCategory,
        coverImage: coverImageBase64,  // Lưu Base64 string cho ảnh bìa
        images: imagesBase64,          // Lưu mảng Base64 cho ảnh chi tiết
        color: item.Color || '',
        size: item.Size || '',
        materials: item.Materials || '',
        sort: item.Sort || '',
        note:item.note,
        reviews: Number(item.reviews),
        rating: Number(item.rating)
      };
    });

    await Product.insertMany(transformedData);
    console.log("Seeding products completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedProducts();
