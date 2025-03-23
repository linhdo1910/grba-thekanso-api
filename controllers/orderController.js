const Order = require('../models/Orders');
const Product = require('../models/Products');

const createOrder = async (req, res, next) => {
  try {
    // Bắt buộc phải có req.user (đã decode từ JWT)
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    const userName = req.user.name || 'Unknown User';

    const {
      billingAddress,
      orderNotes,
      items,
      subtotal,
      discount,
      paymentMethod,
      shippingMethod  
    } = req.body;

    if (!billingAddress || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields or empty cart.' });
    }

    // Tạo đối tượng shipTo dựa trên billingAddress
    const shipTo = {
      fullName: `${billingAddress.firstName} ${billingAddress.lastName}`,
      city: billingAddress.province, // sử dụng province làm city
      district: billingAddress.district,
      ward: billingAddress.ward,
      address: billingAddress.streetAddress,
      email: billingAddress.email,
      phone: billingAddress.phone,
      note: orderNotes || ""
    };

    // Tính toán discountPrice và total
    const discountPrice = discount || 0;
    const computedTotal = subtotal - discountPrice;

    // Map các sản phẩm từ đơn hàng
    const products = items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.coverImage,
      price: item.price,
      quantity: item.quantity
    }));

    // Kiểm tra tồn kho và cập nhật số lượng tồn kho cho từng sản phẩm
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.productStock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product ${product.productName}` });
      }
      product.productStock -= item.quantity;
      await product.save();
    }

    // Kiểm tra shippingMethod, nếu không phải một trong các giá trị cho phép thì trả về lỗi
    const validShippingMethods = ['J&T Express', 'GHN Express'];
    const selectedShippingMethod = validShippingMethods.includes(shippingMethod)
      ? shippingMethod
      : 'J&T Express'; 

    // Xác định Payment Method
    let finalPaymentMethod = 'COD';
    if (paymentMethod === 'bank-transfer') {
      finalPaymentMethod = 'Banking';
    } else if (paymentMethod === 'momo-wallet') {
      finalPaymentMethod = 'Momo';
    }

    const status = 'Order received';

    const transactionHistory = [
      {
        action: 'CREATE_ORDER',
        timestamp: new Date(),
        details: { note: 'Order created from FE' },
        status: status
      }
    ];

    // Tạo đối tượng Order mới
    const newOrder = new Order({
      userName,
      products,
      shipTo,
      subTotal: subtotal,
      discountPrice: discountPrice,
      total: computedTotal,
      orderDate: new Date(),
      paymentMethod: finalPaymentMethod,
      shippingMethod: selectedShippingMethod, 
      status,
      staffNote: orderNotes || '',
      transactionHistory,
      date: new Date()
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    Object.assign(order, req.body);
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchOrders = async (req, res, next) => {
  try {
    const { term } = req.query;
    const orders = await Order.find({ "shipTo.fullName": new RegExp(term, 'i') });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrdersByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const orders = await Order.find({ userName: username });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  searchOrders,
  getOrdersByUsername
};
