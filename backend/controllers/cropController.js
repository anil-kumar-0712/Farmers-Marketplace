const Crop = require('../models/Crop');

// @desc    Get current user's crops
// @route   GET /api/crops/my
// @access  Private (Farmer)
exports.getMyCrops = async (req, res, next) => {
    try {
        const crops = await Crop.find({ farmer: req.user.id });
        res.status(200).json({ success: true, count: crops.length, data: crops });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all crops
// @route   GET /api/crops
// @access  Public
exports.getCrops = async (req, res, next) => {
    try {
        const crops = await Crop.find().populate({
            path: 'farmer',
            select: 'name email mobile'
        });
        res.status(200).json({ success: true, count: crops.length, data: crops });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new crop
// @route   POST /api/crops
// @access  Private (Farmer)
exports.createCrop = async (req, res, next) => {
    try {
        console.log('--- CROP CREATION ATTEMPT ---');
        console.log('User ID:', req.user.id);
        console.log('User Role:', req.user.role);
        console.log('Request Body:', req.body);

        // Add user to req.body
        req.body.farmer = req.user.id;

        const crop = await Crop.create(req.body);

        res.status(201).json({ success: true, data: crop });
    } catch (err) {
        console.error('❌ CROP CREATION FAILED');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.errors) {
            console.error('Validation Errors:', Object.keys(err.errors).map(k => `${k}: ${err.errors[k].message}`));
        }
        next(err);
    }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private (Farmer)
exports.updateCrop = async (req, res, next) => {
    try {
        let crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({ success: false, error: 'Crop not found' });
        }

        // Make sure user is crop owner
        if (crop.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this crop' });
        }

        crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: crop });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private (Farmer)
exports.deleteCrop = async (req, res, next) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({ success: false, error: 'Crop not found' });
        }

        // Make sure user is crop owner
        if (crop.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this crop' });
        }

        await crop.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
