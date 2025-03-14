const Cart = require('../models/Cart');

// Lấy giỏ hàng của người dùng hiện tại (cần token)
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;
    
    // Tìm giỏ hàng của user, nếu chưa có thì tạo mới
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      // Tăng số lượng
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Thêm sản phẩm mới vào giỏ hàng
      cart.items.push({ productId, quantity });
    }
    
    cart.updatedAt = new Date();
    await cart.save();
    res.status(200).json({ success: true, data: cart, message: 'Item added to cart successfully' });
  } catch (error) {
    next(error);
  }
};

// Cập nhật số lượng của một item trong giỏ hàng
exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId, quantity } = req.params;
    const userId = req.user.userId;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    
    cart.items[itemIndex].quantity = Number(quantity);
    cart.updatedAt = new Date();
    await cart.save();
    res.status(200).json({ success: true, data: cart, message: 'Cart updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Xóa một item khỏi giỏ hàng
exports.removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.userId;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    cart.updatedAt = new Date();
    await cart.save();
    res.status(200).json({ success: true, data: cart, message: 'Item removed from cart successfully' });
  } catch (error) {
    next(error);
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();
    res.status(200).json({ success: true, data: cart, message: 'Cart cleared successfully' });
  } catch (error) {
    next(error);
  }
};
