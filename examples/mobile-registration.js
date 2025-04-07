/**
 * Example of mobile number registration and verification
 * 
 * This is a demonstration script showing how to:
 * 1. Register a user with a mobile number
 * 2. Verify the OTP
 * 3. Login with the mobile number
 * 
 * To run this script:
 * 1. Make sure the server is running
 * 2. Run `node examples/mobile-registration.js`
 */

const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api/auth';
const MOBILE_NUMBER = '+1234567890'; // Replace with your mobile number
const PASSWORD = 'password123';

let otpCode = '';
let userId = '';

// Register a user with mobile number
async function registerUser() {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: MOBILE_NUMBER,
        password: PASSWORD
      })
    });

    const data = await response.json();
    console.log('Registration response:', data);
    
    if (data.success) {
      userId = data.userId;
      
      // In development environment, the OTP might be returned directly
      if (data.otp) {
        otpCode = data.otp;
        console.log('OTP from response:', otpCode);
      } else {
        // In production, you would need to check your phone for the SMS
        otpCode = prompt('Enter the OTP received on your mobile:');
      }
      
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
}

// Verify OTP
async function verifyOTP() {
  try {
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: MOBILE_NUMBER,
        otp: otpCode
      })
    });

    const data = await response.json();
    console.log('OTP verification response:', data);
    
    if (data.success) {
      // Store the tokens for future authenticated requests
      const { accessToken, refreshToken } = data;
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    return false;
  }
}

// Login with mobile number and password
async function login() {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: MOBILE_NUMBER,
        password: PASSWORD
      })
    });

    const data = await response.json();
    console.log('Login response:', data);
    
    if (data.success) {
      // Store the tokens for future authenticated requests
      const { accessToken, refreshToken } = data;
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

// Run the example
async function runExample() {
  console.log('Starting mobile number registration example...');
  
  // Step 1: Register user
  console.log('\n---- STEP 1: Register User ----');
  const registrationSuccess = await registerUser();
  
  if (!registrationSuccess) {
    console.log('Registration failed. Exiting...');
    return;
  }
  
  // Step 2: Verify OTP
  console.log('\n---- STEP 2: Verify OTP ----');
  const otpVerificationSuccess = await verifyOTP();
  
  if (!otpVerificationSuccess) {
    console.log('OTP verification failed. Exiting...');
    return;
  }
  
  // Step 3: Login
  console.log('\n---- STEP 3: Login ----');
  const loginSuccess = await login();
  
  if (loginSuccess) {
    console.log('Example completed successfully!');
  } else {
    console.log('Login failed.');
  }
}

// Run the example
runExample().catch(console.error); 