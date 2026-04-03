const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise for INR)
            currency,
            receipt
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
        }

        res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId // Our internal MongoDB Order ID
        } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Payment verified
            const order = await Order.findById(orderId).populate([
                { path: 'crop', populate: { path: 'farmer' } },
                { path: 'buyer' }
            ]);

            if (!order) {
                return res.status(404).json({ success: false, message: 'Internal Order not found' });
            }

            order.paymentStatus = 'completed';
            order.razorpayOrderId = razorpay_order_id;
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature;
            await order.save();

            // Send Email to Farmer (Non-blocking for faster payment response)
            const farmer = order.crop.farmer;
            sendEmail({
                email: farmer.email,
                subject: 'New Order Received - Farmers Marketplace',
                message: `Hello ${farmer.name},\n\nYou have received a new order for ${order.quantity}kg of ${order.crop.cropName}.\nTotal Amount: ₹${order.totalPrice}\nBuyer: ${order.buyer.name}\n\nPlease log in to your dashboard to manage the order.`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #2e7d32;">New Order Received!</h2>
                        <p>Hello <strong>${farmer.name}</strong>,</p>
                        <p>You have received a new order on Farmers Marketplace.</p>
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Crop:</strong> ${order.crop.cropName}</p>
                            <p><strong>Quantity:</strong> ${order.quantity} kg</p>
                            <p><strong>Total Amount:</strong> ₹${order.totalPrice}</p>
                            <p><strong>Buyer:</strong> ${order.buyer.name} (${order.buyer.mobile})</p>
                        </div>
                        <p>Please log in to your dashboard to process this order.</p>
                        <br/>
                        <p>Best Regards,<br/>Farmers Marketplace Team</p>
                    </div>
                `
            }).catch(emailErr => {
                console.error('❌ Failed to send email to farmer:', emailErr.message);
            });

            return res.status(200).json({ success: true, message: 'Payment verified and notification sent' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getRazorpayKey = async (req, res) => {
    res.status(200).json({ success: true, keyId: process.env.RAZORPAY_KEY_ID });
};

module.exports = {
    createRazorpayOrder,
    verifyPayment,
    getRazorpayKey
};
