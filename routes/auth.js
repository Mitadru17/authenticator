const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  registerValidationRules, 
  otpValidationRules, 
  loginValidationRules, 
  validate 
} = require('../utils/validator');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');
const User = require('../models/User');

// Import passport config
require('../config/passport');

// Register route
router.post(
  '/register',
  registerValidationRules(),
  validate,
  authController.register
);

// Verify OTP route
router.post(
  '/verify-otp',
  otpValidationRules(),
  validate,
  authController.verifyOTP
);

// Resend OTP route
router.post(
  '/resend-otp',
  [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('mobile')
      .optional()
      .matches(/^\+[1-9]\d{1,14}$/)
      .withMessage('Please provide a valid mobile number with country code (e.g., +123456789)'),
    body()
      .custom((value) => {
        // Either email or mobile is required
        if (!value.email && !value.mobile) {
          throw new Error('Either email or mobile is required');
        }
        return true;
      }),
    validate
  ],
  authController.resendOTP
);

// Login route
router.post(
  '/login',
  loginValidationRules(),
  validate,
  authController.login
);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/login' }),
  authController.socialLoginCallback
);

// GitHub OAuth routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/api/auth/login' }),
  authController.socialLoginCallback
);

// LinkedIn OAuth routes
router.get(
  '/linkedin',
  passport.authenticate('linkedin')
);

router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', { session: false, failureRedirect: '/api/auth/login' }),
  authController.socialLoginCallback
);

// Add a test protected route
router.get('/protected', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'You have access to protected route',
    user: req.user
  });
});

// Profile route - returns user profile data when authenticated
router.get('/profile', authenticate, async (req, res) => {
  try {
    // req.user contains the decoded JWT payload with user ID
    const userId = req.user.id;
    
    // Find user in database
    const user = await User.findById(userId).select('-password -otp');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Return user profile data
    return res.status(200).json({
      success: true,
      profile: {
        id: user._id,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
});

module.exports = router; 