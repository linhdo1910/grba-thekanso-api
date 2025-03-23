const DiscountCode = require('../models/DiscountCode');

// Lấy danh sách discount code
exports.getDiscountCodes = async (req, res, next) => {
  try {
    // Dùng DiscountCode.find() thay vì find() do import
    const codes = await DiscountCode.find();
    res.status(200).json({
      success: true,
      data: codes,
      message: 'Discount codes retrieved',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

// Tạo discount code mới
exports.createDiscountCode = async (req, res, next) => {
  try {
    // Dùng DiscountCode.create()
    const newCode = await DiscountCode.create(req.body);
    res.status(201).json({
      success: true,
      data: newCode,
      message: 'Discount code created successfully',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật discount code
exports.updateDiscountCode = async (req, res, next) => {
  try {
    // Dùng DiscountCode.findByIdAndUpdate()
    const updatedCode = await DiscountCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCode) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Discount code not found',
        error: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      data: updatedCode,
      message: 'Discount code updated successfully',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

// Xóa discount code
exports.deleteDiscountCode = async (req, res, next) => {
  try {
    // Dùng DiscountCode.findByIdAndDelete()
    const deletedCode = await DiscountCode.findByIdAndDelete(req.params.id);
    if (!deletedCode) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Discount code not found',
        error: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      data: deletedCode,
      message: 'Discount code deleted successfully',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};
