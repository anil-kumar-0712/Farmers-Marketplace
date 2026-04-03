const Order = require('../models/Order');
const Crop = require('../models/Crop');

const createOrder = async (req, res) => {
    try {
        console.log('📦 Incoming Order Request:', req.body);
        const { cropId, quantity, shippingAddress } = req.body;

        if (!cropId || !quantity || !shippingAddress) {
            console.error('❌ Missing required fields');
            return res.status(400).json({ success: false, message: 'Missing required order fields' });
        }

        const crop = await Crop.findById(cropId);
        if (!crop) {
            console.error(`❌ Crop not found: ${cropId}`);
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        if (crop.quantity < quantity) {
            console.error(`❌ Insufficient stock: Requested ${quantity}, Available ${crop.quantity}`);
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
        }

        const totalPrice = crop.pricePerKg * quantity;

        const order = await Order.create({
            buyer: req.user._id,
            crop: cropId,
            quantity,
            totalPrice,
            shippingAddress
        });

        console.log('✅ Order Created Successfully:', order._id);

        // Deduct quantity from crop stock
        crop.quantity -= quantity;
        await crop.save();

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        console.error('❌ Order Placement Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id }).populate('crop');
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getFarmerOrders = async (req, res) => {
    try {
        // Find crops belonging to this farmer
        const crops = await Crop.find({ farmer: req.user.id });
        const cropIds = crops.map(c => c._id);
        
        // Find orders for these crops
        const orders = await Order.find({ crop: { $in: cropIds } })
            .populate('buyer', 'name email mobile')
            .populate('crop', 'cropName pricePerKg')
            .sort('-createdAt');
            
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getFarmerOrders
};
