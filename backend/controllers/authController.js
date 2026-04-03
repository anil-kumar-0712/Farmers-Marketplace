const mongoose = require('mongoose');
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
    try {
        let { name, email, password, role, mobile } = req.body;

        // Normalize data
        if (role) role = role.toLowerCase();
        if (email) email = email.toLowerCase();

        console.log(`[AUTH] Checking existing user for: ${email}`);
        let userByEmail;
        try {
            userByEmail = await User.findOne({ email }).maxTimeMS(5000);
            console.log(`[AUTH] Email check done. Found: ${!!userByEmail}`);
        } catch (dbErr) {
            console.error(`[AUTH] ERROR in Email check: ${dbErr.message}`);
            return res.status(500).json({ success: false, error: 'Database check timed out' });
        }

        if (userByEmail) {
            return res.status(400).json({ success: false, error: 'User already exists with this email' });
        }

        // 2. Check if user already exists (Mobile)
        if (mobile) {
            console.log(`[AUTH] Checking existing mobile: ${mobile}`);
            try {
                let userByMobile = await User.findOne({ mobile }).maxTimeMS(5000);
                console.log(`[AUTH] Mobile check done. Found: ${!!userByMobile}`);
                if (userByMobile) {
                    return res.status(400).json({ success: false, error: 'User already exists with this mobile number' });
                }
            } catch (dbErr) {
                console.error(`[AUTH] ERROR in Mobile check: ${dbErr.message}`);
            }
        }

        console.log(`[AUTH] Clearing old OTPs for: ${email}`);
        try {
            await OTP.deleteMany({ email }).maxTimeMS(5000);
            console.log(`[AUTH] Old OTPs cleared.`);
        } catch (dbErr) {
            console.error(`[AUTH] ERROR in OTP clear: ${dbErr.message}`);
        }

        // 4. Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 5. Hash password before saving to OTP record
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 6. Store data temporarily in OTP collection
        await OTP.create({
            email,
            otp: otpCode,
            registrationData: {
                name,
                email,
                password: hashedPassword,
                role,
                mobile
            }
        });

        // 7. Send OTP via Email (Non-blocking / Background)
        sendEmail({
            email,
            subject: 'Verification Code',
            message: `Your code: ${otpCode}. Valid for 5 minutes.`
        }).catch(mailErr => {
            console.error('❌ Background Mail Error:', mailErr.message);
        });

        // 8. Return response immediately
        res.status(200).json({
            success: true,
            message: 'OTP sent to email. Please verify to complete registration.'
        });


    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Authenticate user & get token
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ success: false, error: 'Please verify your email to login' });
        }

        sendTokenResponse(user, 200, res);

    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Verify OTP & Create User
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, error: 'Please provide email and verification code' });
        }

        // 1. Find OTP record
        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, error: 'Invalid or expired verification code' });
        }

        // 2. Create actual User record
        try {
            const { name, password, role, mobile } = otpRecord.registrationData;
            console.log(`👤 Creating user: ${email} with role: ${role}`);

            const user = await User.create({
                name,
                email,
                password,
                role,
                mobile,
                isVerified: true
            });

            // 3. Delete OTP record
            await OTP.deleteOne({ _id: otpRecord._id });

            // 4. Send token response for auto-login
            sendTokenResponse(user, 201, res);
        } catch (createErr) {
            console.error('❌ User Creation Error:', createErr);
            return res.status(500).json({
                success: false,
                error: 'Registration failed during account creation. ' + (createErr.message || '')
            });
        }

    } catch (err) {
        console.error('❌ Verify OTP Error:', err);
        next(err);
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            mobile: user.mobile
        }
    });
};
