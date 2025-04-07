const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { sendOTPEmail } = require('../utils/email');
const { sendOTPSMS } = require('../utils/sms');

/**
 * Register user with email or mobile and send OTP
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    
    // Check if user already exists
    let user = null;
    
    if (email) {
      const emailExists = await User.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      
      // Create new user with email
      user = new User({ email, password, authProvider: 'local' });
    } else if (mobile) {
      const mobileExists = await User.mobileExists(mobile);
      if (mobileExists) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number already registered'
        });
      }
      
      // Create new user with mobile
      user = new User({ mobile, password, authProvider: 'local' });
    }
    
    // Generate OTP
    const otp = user.generateOTP();
    
    // Save user
    await user.save();
    
    // Send OTP via appropriate channel (email or SMS)
    let otpSent = false;
    
    if (email) {
      try {
        await sendOTPEmail(email, otp);
        otpSent = true;
      } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
      }
    } else if (mobile) {
      try {
        await sendOTPSMS(mobile, otp);
        otpSent = true;
      } catch (smsError) {
        console.error('Failed to send OTP SMS:', smsError);
      }
    }
    
    return res.status(201).json({
      success: true,
      message: `Registration successful. ${otpSent ? 'An OTP has been sent for verification.' : 'Failed to send OTP, please request a new one.'}`,
      otp: process.env.NODE_ENV === 'production' ? undefined : otp, // Only include OTP in development
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * Verify OTP and complete registration
 * @route POST /api/auth/verify-otp
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;
    
    // Find user by email or mobile
    const user = email 
      ? await User.findOne({ email }) 
      : await User.findOne({ mobile });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Mark user as verified
    user.isVerified = true;
    
    // Clear OTP
    user.otp = { code: null, expiry: null };
    
    // Save user
    await user.save();
    
    // Generate tokens
    const payload = { id: user._id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    return res.status(200).json({
      success: true,
      message: 'Account verified successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * Login with email/mobile and password
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    
    // Find user by email or mobile
    const user = email 
      ? await User.findOne({ email }) 
      : await User.findOne({ mobile });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is using local auth
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.authProvider} authentication. Please login using that method.`
      });
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP for unverified user
      const otp = user.generateOTP();
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: 'Account not verified. A new OTP has been sent.',
        otp: process.env.NODE_ENV === 'production' ? undefined : otp, // Only include OTP in development
        userId: user._id
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
    
    // Generate tokens
    const payload = { id: user._id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * Handle social login callback
 */
const socialLoginCallback = (req, res) => {
  try {
    const user = req.user;
    
    // Generate tokens
    const payload = { id: user._id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    // Redirect to frontend with tokens
    // In a real app, this should redirect to your frontend app with tokens
    // For now, just return the tokens in the response
    
    return res.status(200).json({
      success: true,
      message: 'Social login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Social login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Social login failed',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * Resend OTP for email or mobile verification
 * @route POST /api/auth/resend-otp
 */
const resendOTP = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    
    // Find user by email or mobile
    const user = email 
      ? await User.findOne({ email }) 
      : await User.findOne({ mobile });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }
    
    // Generate new OTP
    const otp = user.generateOTP();
    
    // Save user
    await user.save();
    
    // Send OTP via appropriate channel
    let otpSent = false;
    
    if (email) {
      try {
        await sendOTPEmail(email, otp);
        otpSent = true;
      } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
      }
    } else if (mobile) {
      try {
        await sendOTPSMS(mobile, otp);
        otpSent = true;
      } catch (smsError) {
        console.error('Failed to send OTP SMS:', smsError);
      }
    }
    
    return res.status(200).json({
      success: true,
      message: otpSent ? 'OTP has been resent.' : 'Failed to send OTP, please try again.',
      otp: process.env.NODE_ENV === 'production' ? undefined : otp, // Only include OTP in development
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resend OTP',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

module.exports = {
  register,
  verifyOTP,
  login,
  socialLoginCallback,
  resendOTP
}; 