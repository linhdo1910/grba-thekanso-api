const Product = require('../models/Products');

// GET /api/products - Lấy danh sách sản phẩm, hỗ trợ lọc và tìm kiếm
exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      productSubCategory,
      color,
      size,
      sort,
      priceOrder,
      minPrice,
      maxPrice,
      keyword
    } = req.query;

    let filter = {};

    // Lọc theo productSubCategory (không phân biệt hoa thường)
    if (productSubCategory) {
      const regex = new RegExp(productSubCategory, 'i');
      filter.productSubCategory = regex;
    }

    // Lọc theo color
    if (color) {
      filter.color = color;
    }

    // Lọc theo size
    if (size) {
      filter.size = size;
    }

    // Lọc theo giá
    if (minPrice && maxPrice) {
      filter.productPrice = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filter.productPrice = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filter.productPrice = { $lte: Number(maxPrice) };
    }

    // Tìm kiếm bằng keyword
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

    // Nếu có tham số sort (ví dụ "New" hoặc "Popular"), lọc sản phẩm có trường sort bằng giá trị đó
    if (sort) {
      filter.sort = sort;
    }

    // Tạo truy vấn với filter đã xây dựng
    let query = Product.find(filter);

    // Nếu có priceOrder, sắp xếp theo productPrice
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

// GET /api/products/bySubCategory?productSubCategory=... - Tìm sản phẩm theo productSubCategory
exports.getProductsBySubCategory = async (req, res, next) => {
  try {
    const subCategory = req.query.productSubCategory;
    if (!subCategory) {
      return res.status(400).json({ success: false, message: "productSubCategory is required" });
    }
    const regex = new RegExp(subCategory, 'i');
    const products = await Product.find({ productSubCategory: regex });
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found in this subcategory' });
    }
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error in getProductsBySubCategory:', error);
    next(error);
  }
};

// GET /api/products/byColor?color=... - Tìm sản phẩm theo color
exports.getProductsByColor = async (req, res, next) => {
  try {
    const color = req.query.color;
    if (!color) {
      return res.status(400).json({ success: false, message: "Color is required" });
    }
    const products = await Product.find({ color: { $in: [color.trim()] } });
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this color" });
    }
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/filters - Lấy các giá trị filter distinct
exports.getFilterOptions = async (req, res, next) => {
  try {
    const categories = await Product.distinct('productSubCategory');
    const colors = await Product.distinct('color'); 
    const sizes = await Product.distinct('size');
    res.status(200).json({
      success: true,
      data: { categories, colors, sizes },
      message: 'Filter options retrieved',
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
      return res.status(404).json({ success: false, data: null, message: 'Product not found', error: 'Not found' });
    }
    res.status(200).json({ success: true, data: { productId: product._id }, message: 'Product updated successfully', error: '' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id - Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, data: null, message: 'Product not found', error: 'Not found' });
    }
    res.status(200).json({ success: true, data: null, message: 'Product deleted successfully', error: '' });
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
