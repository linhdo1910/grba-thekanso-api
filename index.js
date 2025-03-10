const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./configs/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoute');
const cartRoutes = require('./routes/cartRoute');
const product = require('./routes/product');
const authenticateToken = require('./middlewares/authMiddleware');
const orderRoutes = require('./routes/orderRoute');
const { seedProducts } = require('./models/ProductData');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/blogs', authenticateToken, blogRoutes);
app.use('/api/contact', authenticateToken, contactRoutes);
app.use('/api/cart', authenticateToken, cartRoutes);
app.use('/api/products', product);
app.use('/api/orders', authenticateToken, orderRoutes);

// Kết nối database và thêm dữ liệu mẫu
db.connect()
    .then(async () => {
        console.log('Connected to MongoDB successfully');
        try {
            await seedProducts();
        } catch (error) {
            console.error('Lỗi khi thêm dữ liệu mẫu:', error);
        }
    })
    .catch(error => {
        console.error('Failed to connect to MongoDB:', error);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});