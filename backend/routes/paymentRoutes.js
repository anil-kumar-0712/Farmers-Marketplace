const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, getRazorpayKey } = require('../controllers/paymentController');

// Assume protect middleware exists for authentication
const { protect } = require('../middleware/authMiddleware');

router.get('/get-key', protect, getRazorpayKey);
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
