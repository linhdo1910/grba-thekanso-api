// routes/userRoutes.js
const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router;