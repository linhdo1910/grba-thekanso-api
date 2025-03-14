const mongoose = require('mongoose');

const Order = require('../models/Orders');
const Product = require('../models/Products');
const nodemailer = require('nodemailer');

// Retrieve all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.searchOrders = async (req, res) => {
    try {
        const { term } = req.query;
        const orders = await Order.find({
            "shipTo.fullName": new RegExp(term, 'i')
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update an order
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const oldStatus = order.status;
        const newStatus = req.body.status;

        // Thêm transaction history mới
        order.transactionHistory.push({
            action: 'UPDATE_STATUS',
            timestamp: new Date(),
            details: {
                oldStatus,
                newStatus,
                updatedBy: req.body.updatedBy || 'system'
            },
            status: newStatus
        });

        // Cập nhật thông tin đơn hàng
        Object.assign(order, req.body);
        const updatedOrder = await order.save();

        // Gửi email thông báo nếu cần
        if (newStatus && ['Cancelled', 'Delivering', 'Finished'].includes(newStatus) && order.shipTo.email) {
            await sendStatusUpdateEmail(updatedOrder);
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
async function sendStatusUpdateEmail(order) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: "safjvgecdyhbmmyd"
        }
    });
    console.log('Preparing to send status update email...');
    let emailSubject = '';
    let emailHtml = '';

    switch (order.status) {
        case 'Cancelled':
            emailSubject = 'Order Cancellation From Plantique';
            emailHtml = `<h1>Order Cancellation</h1>
            <p>We're sorry to inform you that your order ${order._id} has been cancelled.</p>
            <p>We apologize for any inconvenience this may have caused and hope you'll continue to support us in the future.</p>
            <p>If you have any questions or need further assistance, please feel free to contact us via email at plantiqueshop01@gmail.com.</p>`;
            break;
        case 'Delivering':
            emailSubject = 'Your Order is On the Way';
            emailHtml = `<h1>Your Order is On the Way</h1>
            <p>We're excited to let you know that your order ${order._id} is on its way to your address.</p>
            <p>You should receive your order soonest. Thank you for shopping with us!</p>
            <p>If you have any questions or need further assistance, please feel free to contact us via email at plantiqueshop01@gmail.com.</p>
            `;
            break;
        case 'Finished':
            emailSubject = 'Your Order is Completed';
            emailHtml = `<h1>Order Complete</h1>
            <p>Congratulations! Your order ${order._id} has been successfully delivered.</p>
            <p>We hope you enjoy your products and we're always here to serve you for your next orders.</p>
            <p>Thank you for shopping with us!</p>
            <p>If you have any questions or need further assistance, please feel free to contact us via email at plantiqueshop01@gmail.com.</p>
            `;
            break;
        default:
            console.log(`No email sent for status: ${order.status}`);
            return; // If the status is not one of the above, do not send an email
    }

    const mailOptions = {
        from: "plantiqueshop01@gmail.com",
        to: order.shipTo.email,
        subject: emailSubject,
        html: emailHtml
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Status update email sent successfully.');
    } catch (error) {
        console.error('Failed to send status update email:', error);
    }
}
// POST handler to create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userName, products, shipTo, shippingFee, subTotal, discountPrice, totalPrice, paymentMethod, staffNote } = req.body;

        // Validate and update stock levels
        const stockUpdates = [];
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: "product_not_found", message: `Product with ID ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: "out_of_stock", message: `Not enough stock for product ${product.name}` });
            }
            
            const oldStock = product.stock;
            product.stock -= item.quantity;
            await product.save();
            
            stockUpdates.push({
                productId: item.productId,
                productName: item.productName,
                oldStock,
                newStock: product.stock,
                quantity: item.quantity
            });
        }

        // Generate _id and set orderDate
        const _id = new Date().getTime().toString();
        const orderDate = new Date();

        // Create new order with transaction history
        const newOrder = new Order({
            _id,
            userName,
            products,
            shipTo,
            shippingFee,
            subTotal,
            discountPrice,
            totalPrice,
            orderDate,
            paymentMethod,
            status: 'Pending',
            staffNote,
            transactionHistory: [
                {
                    action: 'CREATE_ORDER',
                    timestamp: orderDate,
                    details: {
                        products: stockUpdates,
                        totalAmount: totalPrice,
                        shippingInfo: shipTo
                    },
                    status: 'Pending'
                }
            ]
        });

        const savedOrder = await newOrder.save();
        
        // Gửi email xác nhận nếu có email
        if (shipTo.email && shipTo.email.trim() !== '') {
            await sendOrderConfirmationEmail(savedOrder);
        }

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: error.message });
    }
};
async function sendOrderConfirmationEmail(order) {
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: "safjvgecdyhbmmyd"
    }
});

const mailOptions = {
    from: "plantiqueshop01@gmail.com",
    to: order.shipTo.email,
    subject: 'Order Confirmation From Plantique',
    html: `<h1>Thank you for your order, ${order.shipTo.fullName}!</h1>
           <p>Your order ID is ${order._id}.</p>
           <h2>Order Details:</h2>
           ${order.products.map(item => 
               `<p>${item.productName} - Quantity: ${item.quantity} - Price: ${item.price}đ</p>`
           ).join('')}
           <p>Shipping Address:${order.shipTo.address}, ${order.shipTo.ward}, ${order.shipTo.district}, ${order.shipTo.city}</p>
           <p>Phone Number: ${order.shipTo.phone}</p>
           <p>Total: ${order.totalPrice}đ</p>
           <p>We are currently processing your order and will inform you when it ships.</p>
           <p>If you have any questions or need further assistance, please feel free to contact us via email at plantiqueshop01@gmail.com.</p>`

};

try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully.');
} catch (error) {
    console.error('Failed to send order confirmation email:', error);
}
}
exports.getOrdersByUsername = async (req, res) => {
    try {
        const { username } = req.params; // Lấy username từ request params
        const orders = await Order.find({ userName: username }); // Tìm các đơn hàng với username tương ứng
        res.json(orders); // Trả về các đơn hàng tìm thấy dưới dạng phản hồi JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi nếu có
    }
};
