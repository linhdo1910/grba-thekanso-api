// configs/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dauback';
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        });
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

module.exports = {
    connect
};