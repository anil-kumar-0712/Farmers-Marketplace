const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

require('./models/User'); // Load User model for population
const Crop = require('./models/Crop');
const connectDB = require('./config/db');

const checkCrops = async () => {
    try {
        await connectDB();
        const crops = await Crop.find().populate('farmer', 'name role');
        console.log('🌾 Current Crops in DB:');
        if (crops.length === 0) {
            console.log('No crops found.');
        }
        crops.forEach(c => {
            console.log(`- ${c.cropName}: ${c.quantity} kg, $${c.pricePerKg}/kg (Farmer: ${c.farmer?.name}, Role: ${c.farmer?.role})`);
        });
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

checkCrops();
