const Contact = require('../models/Contact');
const AppError = require('../utils/appError');

exports.createContact = async (req, res) => {
    const { name, phone, email, message } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !phone || !email || !message) {
        return next(new AppError("All fields are required.", 400)); // Sử dụng AppError
    }

    try {
        const newContact = new Contact({
            name,
            phone,
            email,
            message
        });
        await newContact.save(); // Lưu thông tin liên hệ mới vào database
        res.status(201).json({ success: true, message: "Contact created successfully.", data: newContact });
    } catch (error) {
        console.error("Error creating contact:", error);
        return next(new AppError(error.message, 500)); // Sử dụng AppError
    }
};

// Phương thức lấy tất cả contacts
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ sentDate: -1 });
        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        console.error("Error retrieving contacts:", error);
        return next(new AppError(error.message, 500)); // Sử dụng AppError
    }
};