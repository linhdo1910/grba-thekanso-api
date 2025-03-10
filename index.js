const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors()); // Thêm dòng này vào trước các route của bạn


const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/orders', paymentRoutes);

const customizeRoutes = require('./routes/customizeRoutes');
app.use('/api/customize', customizeRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
