const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const multer = require('multer');

// Cấu hình Multer để lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Định nghĩa route để submit review với file upload
router.post('/submit', upload.single('file'), reviewController.submitReview);

module.exports = router;
