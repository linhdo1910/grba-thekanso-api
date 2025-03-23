const RoomDimension = require('../models/customize');
const Product = require('../models/Products');

exports.saveRoomDimension = async (req, res) => {
  try {
    const { shape, length, width, height, area, selectedProducts } = req.body;

    if (!shape || !length || !width || !selectedProducts || selectedProducts.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Lưu thông tin kích thước phòng
    const newRoomDimension = new RoomDimension({
      shape,
      length,
      width,
      height,
      area,
      selectedProducts
    });

    const savedRoomDimension = await newRoomDimension.save();

    // Lấy thông tin sản phẩm từ cơ sở dữ liệu (tự động lấy các sản phẩm từ DB)
    const productPromises = selectedProducts.map(async ({ productId, quantity }) => {
      const product = await Product.findById(productId);  // Tìm sản phẩm trong DB
      if (product) {
        // Chỉ lưu tên sản phẩm, số lượng và giá sản phẩm vào RoomDimension
        return {
          productName: product.productName,
          quantity,
          price: product.productPrice
        };
      }
    });

    const productsToSave = await Promise.all(productPromises);

    // Cập nhật thông tin sản phẩm đã chọn
    savedRoomDimension.selectedProducts = productsToSave;
    await savedRoomDimension.save();

    res.status(201).json(savedRoomDimension);
  } catch (error) {
    console.error('Error saving room dimension and products:', error);
    res.status(500).json({ message: 'Error saving room dimension and products' });
  }
};
