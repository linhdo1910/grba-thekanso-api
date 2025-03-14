
const Order = require('../models/Orders');
exports.initPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body; 


    switch (paymentMethod.toLowerCase()) {
      case 'bank-transfer':
      case 'bank':
        message = 'You have chosen bank transfer.';
        break;
      case 'momo':
        message = 'You have chosen Momo.';
        break;
      default:
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Invalid payment method',
          error: 'Payment method must be bank-transfer or momo'
        });
    }

    // Trả về message xác nhận
    res.status(200).json({
      success: true,
      data: { paymentMethod },
      message,
      error: ''
    });
  } catch (error) {
    next(error);
  }
};


exports.confirmPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Order not found',
        error: 'Not found'
      });
    }

    // Cập nhật trạng thái
    order.status = 'paid';
    await order.save();

    return res.status(200).json({
      success: true,
      data: { orderId },
      message: 'Payment confirmed. Order is now paid.',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};