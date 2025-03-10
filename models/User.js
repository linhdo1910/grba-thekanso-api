// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },
  profilePicture: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

// Kiểm tra xem mô hình đã tồn tại chưa
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;