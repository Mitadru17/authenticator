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

module.exports = router; 