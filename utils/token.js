const jwt = require('jsonwebtoken');

/**
 * Generate an access token
 * @param {Object} payload - Token payload
 * @returns {String} Access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '1h' }
  );
};

/**
 * Generate a refresh token
 * @param {Object} payload - Token payload
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @param {String} secret - Secret key to use for verification
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
}; 