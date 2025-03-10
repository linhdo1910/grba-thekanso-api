// controllers/productController.js
const Product = require('../models/productModel');

exports.getAllProducts = async (req, res, next) => {
  try {
    // Lấy các query param
    const {
      category,        
      subCategory,    
      color,           
      size,            
      sort,            
      priceOrder,      
      minPrice,        
      maxPrice         
    } = req.query;

    // Tạo object filter để lọc dữ liệu
    let filter = {};

    // Lọc theo category
    if (category) {
      filter.productCategory = category;
    }

    // Lọc theo subCategory (nếu bạn có trường productSubCategory)
    if (subCategory) {
      filter.productSubCategory = subCategory;
    }

    // Lọc theo color
    if (color) {
      filter.color = color;
    }

    // Lọc theo size
    if (size) {
      filter.size = size;
    }

    // Lọc theo sort (nếu bạn dùng "sort" làm 1 trường cho sản phẩm, ví dụ: "new", "popular")
    if (sort) {
      filter.sort = sort;
    }

    // Lọc theo khoảng giá (productPrice)
    if (minPrice && maxPrice) {
      filter.productPrice = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice)
      };
    } else if (minPrice) {
      filter.productPrice = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filter.productPrice = { $lte: Number(maxPrice) };
    }

    // Bắt đầu query với filter
    let query = Product.find(filter);

    // Sắp xếp theo giá (priceOrder) - nếu có
    // "asc" => sắp xếp tăng dần, "desc" => giảm dần
    if (priceOrder) {
      query = query.sort({
        productPrice: priceOrder === 'desc' ? -1 : 1
      });
    }

    // Thực hiện truy vấn
    const products = await query;

    return res.status(200).json({
      success: true,
      data: products,
      message: 'Products retrieved',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

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
  


// Tạo sản phẩm mới
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: { productId: product._id }, message: 'Product created successfully', error: '' });
  } catch (error) {
    next(error);
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: { productId: product._id }, message: 'Product updated successfully', error: '' });
  } catch (error) {
    next(error);
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: null, message: 'Product deleted successfully', error: '' });
  } catch (error) {
    next(error);
  }
};

//Search sản phẩm
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
    
    // Tách từ khóa thành các từ riêng biệt, loại bỏ khoảng trắng thừa
    const words = keyword.split(' ').filter(w => w.trim() !== '');
    
    // Với mỗi từ, tạo ra một điều kiện $or, sau đó kết hợp bằng $and
    const andConditions = words.map(word => ({
      $or: [
        { productName: { $regex: word, $options: 'i' } },
        { productSubName: { $regex: word, $options: 'i' } },
        { productDescription: { $regex: word, $options: 'i' } },
        { color: { $regex: word, $options: 'i' } },
        { materials: { $regex: word, $options: 'i' } },
        { productCategory: { $regex: keyword, $options: 'i' } },
        { productSubCategory: { $regex: keyword, $options: 'i' } }

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
