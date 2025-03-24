const Review = require('../models/review'); 
const multer = require('multer');

exports.submitReview = async (req, res) => {
  try {
    const { reviewText, rating, productId, file } = req.body;

    if (!reviewText || !rating || !productId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newReview = new Review({
      reviewText,
      rating,
      productId,
      file, //file ảnh
      createdAt: new Date()
    });

    await newReview.save();
    res.status(200).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
};
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

  