const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productSubName: { type: String },
  productPrice: { type: Number, required: true },
  productDescription: { type: String },
  productStock: { type: Number, default: 0 },
  productCategory: { type: String },
  productSubCategory: { type: String },
  // Ở đây, coverImage sẽ lưu chuỗi Base64 (đã có tiền tố MIME)
  coverImage: { type: String },
  // Nếu có nhiều hình, bạn có thể lưu chúng trong mảng, mỗi phần tử là Base64 string
  images: [{ type: String }],
  color: { type: String },
  size: { type: String },
  materials: { type: String },
  sort: { type: String },
  // Các trường khác nếu cần...
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
