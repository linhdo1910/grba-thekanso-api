const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productSubName: { type: String },
  productPrice: { type: Number, required: true },
  productDescription: { type: String },
  productStock: { type: Number, default: 0 },
  productCategory: { type: String },
  productSubCategory: { type: String },
  coverImage: { type: String },
  images: [{ type: String }],
  color: { type: String },
  size: { type: String },
  materials: { type: String },
  sort: { type: String },
  status: { type: Number, required: true, default: 1 },
  rating : { type: Number, required: false},
  discount : { type : Number, default: 0, required: false},
  previousPrice: { type: Number, required: false },
  // Các trường khác nếu cần...
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
