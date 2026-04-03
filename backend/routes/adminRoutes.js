const express = require('express');
const {
    getUsers,
    updateUserStatus,
    deleteUser,
    getDashboardStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protection and admin authorization to all routes in this file
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/stats', getDashboardStats);

module.exports = router;
