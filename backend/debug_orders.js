const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Order = require('./models/Order');
const connectDB = require('./config/db');

const debugDB = async () => {
    try {
        await connectDB();
        const count = await Order.countDocuments();
        console.log(`📊 Total Orders in DB: ${count}`);

        if (count > 0) {
            const lastOrders = await Order.find().sort({ createdAt: -1 }).limit(3).populate('buyer crop');
            console.log('📝 Recent Orders:', JSON.stringify(lastOrders, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Debug Error:', err);
        process.exit(1);
    }
};

debugDB();
