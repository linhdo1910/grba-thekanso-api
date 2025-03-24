const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Đọc biến môi trường
dotenv.config();

// Kết nối DB
const connectDB = require('./config/db');

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
const discountCodeRoutes = require('./routes/discountCodeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
connectDB();
const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Thay vì 500mb, 10mb là đủ cho hầu hết trường hợp
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes không yêu cầu xác thực
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/discount-codes', discountCodeRoutes);
app.use('/api/customize', customizeRoutes);
app.use('/api/users/logout', userRoutes);
// Các routes cần token
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/contact', authenticateToken, contactRoutes);
app.use('/api/cart', authenticateToken, cartRoutes);

// Các route sản phẩm (không yêu cầu token)
app.use('/api/products', productRoutes);

// Đăng ký endpoint tạo đơn hàng (cho guest hoặc user)
app.use('/api/orders', paymentRoutes);

// Các endpoint khác liên quan đến đơn hàng, yêu cầu token
app.use('/api/orders', authenticateToken, orderRoutes);

// Route tùy chỉnh layout
app.use('/api/customize', customizeRoutes);

//rRoute review
app.use('/api/review', reviewRoutes);

// Xử lý lỗi toàn cục
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
