const { body, validationResult } = require('express-validator');

// Validation rules for registration
const registerValidationRules = () => {
  return [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('mobile')
      .optional()
      .matches(/^\+[1-9]\d{1,14}$/)
      .withMessage('Please provide a valid mobile number with country code (e.g., +123456789)'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
    body()
      .custom((value) => {
        // Either email or mobile is required
        if (!value.email && !value.mobile) {
          throw new Error('Either email or mobile is required');
        }
        return true;
      })
  ];
};

// Validation rules for OTP verification
const otpValidationRules = () => {
  return [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('mobile')
      .optional()
      .matches(/^\+[1-9]\d{1,14}$/)
      .withMessage('Please provide a valid mobile number with country code (e.g., +123456789)'),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be 6 digits')
      .isNumeric()
      .withMessage('OTP must contain only numbers'),
    body()
      .custom((value) => {
        // Either email or mobile is required
        if (!value.email && !value.mobile) {
          throw new Error('Either email or mobile is required');
        }
        return true;
      })
  ];
};

// Validation rules for login
const loginValidationRules = () => {
  return [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('mobile')
      .optional()
      .matches(/^\+[1-9]\d{1,14}$/)
      .withMessage('Please provide a valid mobile number with country code (e.g., +123456789)'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    body()
      .custom((value) => {
        // Either email or mobile is required
        if (!value.email && !value.mobile) {
          throw new Error('Either email or mobile is required');
        }
        return true;
      })
  ];
};

// Middleware to validate the request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json({
    success: false,
    errors: extractedErrors
  });
};

module.exports = {
  registerValidationRules,
  otpValidationRules,
  loginValidationRules,
  validate
}; 