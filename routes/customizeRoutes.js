const express = require('express');
const router = express.Router();
const roomController = require('../controllers/customizeController');

// Route để lưu kích thước phòng và sản phẩm người dùng chọn
router.post('/save-room-dimension', roomController.saveRoomDimension);

module.exports = router;