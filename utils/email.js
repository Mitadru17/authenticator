const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Create a nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send OTP email
 * @param {String} email - Recipient email
 * @param {String} otp - OTP code
 * @returns {Promise} - Email sending result
 */
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Auth Service" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your OTP Verification Code',
      text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #666;">Thank you for registering with our service. Please use the following OTP code to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #f5f5f5; border-radius: 5px; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="font-size: 16px; line-height: 1.5; color: #666;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #999; margin-top: 30px;">If you did not request this verification, please ignore this email.</p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = {
  sendOTPEmail
}; 