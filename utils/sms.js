const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

// Create Twilio client
const createClient = () => {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
};

/**
 * Send OTP via SMS using Twilio
 * @param {String} mobile - Recipient mobile number (with country code)
 * @param {String} otp - OTP code
 * @returns {Promise} - SMS sending result
 */
const sendOTPSMS = async (mobile, otp) => {
  try {
    const client = createClient();
    
    const message = await client.messages.create({
      body: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile
    });
    
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send OTP SMS');
  }
};

module.exports = {
  sendOTPSMS
}; 