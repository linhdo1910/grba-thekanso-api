const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 }
});

const shipToSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  note: { type: String }
});

  const transactionSchema = new mongoose.Schema({
    action: {
      type: String,
      required: true,
      enum: ['CREATE_ORDER', 'UPDATE_STATUS', 'UPDATE_SHIPPING', 'CANCEL_ORDER']
    },
    timestamp: { type: Date, default: Date.now },
    details: { type: Object, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Order received', 'Processing', 'On the way', 'Delivered','Cancelled']
    }
  });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userName: { type: String, required: true },
  products: {
    type: [orderProductSchema],
    required: true,
    validate: [arr => arr.length > 0, 'Order must have at least one product']
  },
  shipTo: { type: shipToSchema, required: true },
  subTotal: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, required: true, min: 0, default: 0 },
  total: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(value) {
        return value === this.subTotal - this.discountPrice;
      },
      message: 'Total must equal subTotal - discountPrice'
    }
  },
  orderDate: { type: Date, default: Date.now, required: true },
  paymentMethod: { type: String, required: true, enum: ['Banking', 'Momo', 'COD'] },
  status: { type: String, required: true, enum: ['Order received', 'Processing', 'On the way', 'Delivered','Cancelled'], default: 'Order received' },
  staffNote: { type: String },
  transactionHistory: [transactionSchema],
  // Nếu FE cần trường "date" để hiển thị, ta đặt alias bằng orderDate:
  date: { type: Date, default: Date.now }
}, { timestamps: true });

orderSchema.index({ userName: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
