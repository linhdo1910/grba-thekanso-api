const mongoose = require('mongoose');

const roomDimensionSchema = new mongoose.Schema({
  shape: String,
  length: Number,
  width: Number,
  height: Number,
  area: Number,
  selectedProducts: [{
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }]
});

module.exports = mongoose.model('customize', roomDimensionSchema);
