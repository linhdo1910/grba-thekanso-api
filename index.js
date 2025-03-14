// index.js (Merged)

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Đọc biến môi trường
dotenv.config();

// Kết nối DB (chọn 1 file config db phù hợp)
const connectDB = require('./config/db'); 
// Hoặc nếu bạn dùng './configs/db' thì:
// const connectDB = require('./configs/db');

// Import middleware xử lý lỗi
const { errorHandler } = require('./middlewares/errorMiddleware');

// Import middleware xác thực
const authenticateToken = require('./middlewares/authMiddleware');

// Import các routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cartRoutes = require('./routes/cartRoutes');

const productRoutes = require('./routes/productRoutes');

const paymentRoutes = require('./routes/paymentRoutes');

const customizeRoutes = require('./routes/customizeRoutes');

const orderRoutes = require('./routes/orderRoutes');


// Khởi tạo app và kết nối DB
connectDB(); // Nếu connectDB trả về Promise, bạn có thể .then() hoặc await
const app = express();

// Thiết lập middleware
app.use(cors());
app.use(bodyParser.json());

// Đăng ký / Đăng nhập
app.use('/api/auth', authRoutes);

// User (cần token)
app.use('/api/users', authenticateToken, userRoutes);

// Blog (cần token)
app.use('/api/blogs', blogRoutes);

// Liên hệ (cần token)
app.use('/api/contact', authenticateToken, contactRoutes);

// Giỏ hàng (cần token)
app.use('/api/cart', authenticateToken, cartRoutes);

// Quản lý sản phẩm
app.use('/api/products', productRoutes);

// Payment simulation + Orders
app.use('/api/orders', paymentRoutes);    // Payment init, confirm
app.use('/api/orders', authenticateToken, orderRoutes); // Tạo, cập nhật, lấy đơn hàng

// Tùy chỉnh layout
app.use('/api/customize', customizeRoutes);

// Xử lý lỗi toàn cục
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 4002;

// Lắng nghe
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

