const User = require('../models/User');
const Crop = require('../models/Crop');
const Prediction = require('../models/Prediction');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort('-createdAt');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user status (block/unblock)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['active', 'blocked'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCrops = await Crop.countDocuments();
        const totalPredictions = await Prediction.countDocuments();
        
        const farmerCount = await User.countDocuments({ role: 'farmer' });
        const buyerCount = await User.countDocuments({ role: 'buyer' });

        // Get some recent activity
        const recentCrops = await Crop.find().sort('-createdAt').limit(5).populate('farmer', 'name');

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalCrops,
                totalPredictions,
                roles: {
                    farmers: farmerCount,
                    buyers: buyerCount
                },
                recentCrops
            }
        });
    } catch (err) {
        next(err);
    }
};
