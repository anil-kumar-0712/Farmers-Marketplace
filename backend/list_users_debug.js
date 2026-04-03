const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const listUsers = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'name email mobile role');
        console.log('\n--- ALL REGISTERED USERS ---');
        users.forEach(u => {
            console.log(`- ${u.name} | ${u.email} | ${u.mobile} | ${u.role}`);
        });
        console.log('----------------------------\n');
        process.exit(0);
    } catch (err) {
        console.error('Connection Error:', err.message);
        process.exit(1);
    }
};

listUsers();
