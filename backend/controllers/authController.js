const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configure Brevo email transporter - FIXED THE TYPO HERE
const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: process.env.BREVO_SMTP_PORT,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});

// Send OTP to email
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash OTP before storing
        const hashedOTP = await bcrypt.hash(otp, 10);

        // Save OTP to database (automatically expires in 2 minutes)
        await OTP.create({
            email: email,
            otp: hashedOTP
        });

        // Send email via Brevo
        await transporter.sendMail({
            from: '"Your App" <kabir67435@gmail.com>',
            to: email,
            subject: 'Your Login OTP Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2 style="color: #333;">Your Login Code</h2>
                    <p>Use the following OTP to login to your account:</p>
                    <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #333;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 14px; margin-top: 20px;">
                        This OTP will expire in 2 minutes. If you didn't request this, please ignore this email.
                    </p>
                </div>
            `
        });

        res.json({
            success: true,
            message: 'OTP sent to your email successfully'
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP'
        });
    }
};

// Verify OTP and login
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the most recent OTP for this email
        const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired or invalid'
            });
        }

        // Verify OTP
        const isvalidOTP = await bcrypt.compare(otp, otpRecord.otp);

        if (!isvalidOTP) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            // For demo - you might want a separate signup flow
            user = await User.create({
                email: email,
                name: email.split('@')[0] // Simple name from email
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Delete the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

// Get user profile (protected route)
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-__v');
        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
};

module.exports = { sendOTP, verifyOTP, getProfile };