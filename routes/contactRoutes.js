// routes/contactRoute.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route để tạo mới contact
router.post('/', contactController.createContact);

// Route để lấy tất cả contacts
router.get('/', contactController.getAllContacts);

module.exports = router;