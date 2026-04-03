const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'anilrongali323@gmail.com'; // Testing with user's email from Register.jsx placeholder
        const mobile = '9676641698'; // Testing with mobile from Register.jsx placeholder

        const userByEmail = await User.findOne({ email });
        const userByMobile = await User.findOne({ mobile });

        console.log('--- USER CHECK ---');
        console.log('Email:', email, 'Found:', !!userByEmail);
        if (userByEmail) console.log('  Role:', userByEmail.role);

        console.log('Mobile:', mobile, 'Found:', !!userByMobile);
        if (userByMobile) console.log('  Role:', userByMobile.role);
        console.log('------------------');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
