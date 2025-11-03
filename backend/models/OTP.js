const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 120 // 2 minutes in seconds
    }
});

module.exports = mongoose.model('OTP', OTPSchema);