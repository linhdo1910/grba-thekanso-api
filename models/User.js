const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String }, 
  address: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
  action: { type: String, enum: ['edit all', 'account ctrl', 'sales ctrl', 'just view'] },
  profilePicture: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;