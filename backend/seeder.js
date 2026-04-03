const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');

// Load env vars
dotenv.config();

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB for seeding...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            family: 4
        });

        console.log(`Connected: ${conn.connection.host}`);

        // Check if Admin already exists to avoid duplicates
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });

        if (!adminExists) {
            console.log('Creating default Admin user...');
            await User.create({
                name: 'System Admin',
                email: 'admin@gmail.com',
                password: 'password123',
                role: 'admin',
                mobile: '9999999999',
                status: 'active'
            });
            console.log('✅ Admin user created successfully!');
        } else {
            console.log('ℹ️  Admin user already exists.');
        }

        console.log('\n==================================================');
        console.log('🎉 DATABASE INITIALIZED SUCCESSFULLY');
        console.log('==================================================');
        console.log('Database: farmer_market');
        console.log('Collections Created: users');
        console.log('==================================================\n');

        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
};

seedData();
