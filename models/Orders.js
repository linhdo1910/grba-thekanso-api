const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    productImage: { type: String },
    productName: { type: String, required: true }
});

const shipToSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
    ward: { type: String, required: true }
});

const transactionSchema = new mongoose.Schema({
    action: { 
        type: String, 
        required: true,
        enum: ['CREATE_ORDER', 'UPDATE_STATUS', 'UPDATE_SHIPPING', 'CANCEL_ORDER']
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    details: { 
        type: Object, 
        required: true 
    },
    status: { 
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Delivering', 'Finished', 'Cancelled']
    }
});

const orderSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    userName: { type: String, required: true },
    products: { 
        type: [productSchema],
        required: true,
        validate: [array => array.length > 0, 'Order must have at least one product']
    },
    shipTo: { 
        type: shipToSchema,
        required: true
    },
    shippingFee: { 
        type: Number,
        required: true,
        min: 0
    },
    subTotal: { 
        type: Number,
        required: true,
        min: 0
    },
    discountPrice: { 
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    totalPrice: { 
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(value) {
                return value === this.subTotal + this.shippingFee - this.discountPrice;
            },
            message: 'Total price must equal subTotal + shippingFee - discountPrice'
        }
    },
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    paymentMethod: { 
        type: String,
        required: true,
        enum: ['COD', 'Banking', 'Momo', 'ZaloPay']
    },
    status: { 
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Delivering', 'Finished', 'Cancelled'],
        default: 'Pending'
    },
    staffNote: { type: String },
    transactionHistory: [transactionSchema]
});

// Thêm index để tối ưu tìm kiếm
orderSchema.index({ userName: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
