const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    registrationData: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
        mobile: { type: String }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '300s' } // 5 minutes expiry
    }
});

module.exports = mongoose.model('OTP', OTPSchema);
