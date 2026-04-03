const mongoose = require('mongoose');
const User = require('./models/User');
const OTP = require('./models/OTP');
const dotenv = require('dotenv');
dotenv.config();

const testRegistration = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = `test_buyer_${Date.now()}@example.com`;
        const mobile = '1234567890'.split('').sort(() => 0.5 - Math.random()).join('').slice(0, 10);

        console.log('Testing registration with:', email, mobile);

        // Simulate register call logic
        let userByEmail = await User.findOne({ email });
        if (userByEmail) throw new Error('Email exists');

        let userByMobile = await User.findOne({ mobile });
        if (userByMobile) throw new Error('Mobile exists');

        const otpCode = '123456';
        await OTP.create({
            email,
            otp: otpCode,
            registrationData: {
                name: 'Test Buyer',
                email,
                password: 'hashed_password',
                role: 'buyer',
                mobile
            }
        });

        console.log('✅ Registration step 1 (OTP creation) successful');

        // Simulate verifyOTP call logic
        const otpRecord = await OTP.findOne({ email, otp: otpCode });
        if (!otpRecord) throw new Error('OTP not found');

        const user = await User.create({
            ...otpRecord.registrationData,
            isVerified: true
        });

        console.log('✅ Registration step 2 (User creation) successful');
        console.log('User role:', user.role);

        // CLEANUP
        await User.deleteOne({ _id: user._id });
        await OTP.deleteMany({ email });
        console.log('✅ Cleanup successful');

        process.exit(0);
    } catch (err) {
        console.error('❌ Test Failed:', err.message);
        process.exit(1);
    }
};

testRegistration();
