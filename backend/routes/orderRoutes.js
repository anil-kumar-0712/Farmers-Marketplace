const express = require('express');
const { createOrder, getMyOrders, getFarmerOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('buyer'), createOrder);
router.get('/my', authorize('buyer'), getMyOrders);
router.get('/farmer', authorize('farmer'), getFarmerOrders);

module.exports = router;
