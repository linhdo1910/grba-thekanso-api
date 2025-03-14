const Product = require('../models/Products');

// GET /api/products - Lấy danh sách sản phẩm, hỗ trợ lọc và tìm kiếm
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, subCategory, color, size, sort, priceOrder, minPrice, maxPrice, keyword } = req.query;
    let filter = {};
    if (category) filter.productCategory = category;
    if (subCategory) filter.productSubCategory = subCategory;
    if (color) filter.color = color;
    if (size) filter.size = size;
    if (sort) filter.sort = sort;
    if (minPrice && maxPrice) {
      filter.productPrice = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filter.productPrice = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filter.productPrice = { $lte: Number(maxPrice) };
    }
    if (keyword) {
      const words = keyword.split(' ').filter(w => w.trim() !== '');
      const andConditions = words.map(word => ({
        $or: [
          { productName: { $regex: word, $options: 'i' } },
          { productSubName: { $regex: word, $options: 'i' } },
          { productDescription: { $regex: word, $options: 'i' } },
          { color: { $regex: word, $options: 'i' } },
          { materials: { $regex: word, $options: 'i' } },
          { productCategory: { $regex: word, $options: 'i' } },
          { productSubCategory: { $regex: word, $options: 'i' } }
        ]
      }));
      filter.$and = andConditions;
    }
    let query = Product.find(filter);
    if (priceOrder) {
      query = query.sort({ productPrice: priceOrder === 'desc' ? -1 : 1 });
    }
    const products = await query;
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products retrieved',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id - Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Product not found',
        error: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product details retrieved',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products - Tạo sản phẩm mới
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: { productId: product._id },
      message: 'Product created successfully',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id - Cập nhật sản phẩm
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Product not found',
        error: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      data: { productId: product._id },
      message: 'Product updated successfully',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id - Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Product not found',
        error: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      data: null,
      message: 'Product deleted successfully',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/search?keyword=... - Tìm kiếm sản phẩm
exports.searchProducts = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Keyword is required',
        error: 'Missing keyword'
      });
    }
    const words = keyword.split(' ').filter(w => w.trim() !== '');
    const andConditions = words.map(word => ({
      $or: [
        { productName: { $regex: word, $options: 'i' } },
        { productSubName: { $regex: word, $options: 'i' } },
        { productDescription: { $regex: word, $options: 'i' } },
        { color: { $regex: word, $options: 'i' } },
        { materials: { $regex: word, $options: 'i' } },
        { productCategory: { $regex: word, $options: 'i' } },
        { productSubCategory: { $regex: word, $options: 'i' } }
      ]
    }));
    const products = await Product.find({ $and: andConditions });
    res.status(200).json({
      success: true,
      data: products,
      message: 'Search results retrieved',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/rating/:id - Cập nhật đánh giá sản phẩm
exports.updateRating = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
