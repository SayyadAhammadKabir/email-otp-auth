const express = require('express');
const { sendOTP, verifyOTP, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;