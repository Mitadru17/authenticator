/**
 * Example of accessing a protected profile route using JWT authentication
 * 
 * This is a demonstration script showing how to:
 * 1. Log in and get a JWT token
 * 2. Use the token to access a protected profile route
 * 
 * Note: This is client-side code that would typically be used in a frontend application
 */

// Replace with actual values for testing
const API_URL = 'http://localhost:5000/api/auth';
const USER_EMAIL = 'user@example.com';
const USER_PASSWORD = 'password123';

// Login and get the JWT token
async function login() {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: USER_EMAIL,
        password: USER_PASSWORD
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Login successful');
      return data.accessToken;
    } else {
      console.error('Login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

// Access the protected profile route
async function getProfile(token) {
  try {
    if (!token) {
      console.error('No access token provided');
      return null;
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Profile retrieved successfully');
      return data.profile;
    } else {
      console.error('Failed to retrieve profile:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
}

// Run the example
async function runExample() {
  console.log('Starting JWT authentication example...');
  
  // Step 1: Login and get token
  console.log('\n---- STEP 1: Login and get JWT token ----');
  const token = await login();
  
  if (!token) {
    console.log('Failed to get token. Make sure the user exists and credentials are correct.');
    return;
  }
  
  console.log('Token received:', token);
  
  // Step 2: Access protected profile route
  console.log('\n---- STEP 2: Access protected profile route ----');
  const profile = await getProfile(token);
  
  if (profile) {
    console.log('User profile:', profile);
    console.log('Example completed successfully!');
  } else {
    console.log('Failed to retrieve profile. The token might be invalid or expired.');
  }
}

// For Node.js environment
if (typeof window === 'undefined') {
  const fetch = require('node-fetch');
  runExample().catch(console.error);
} else {
  // For browser environment
  document.addEventListener('DOMContentLoaded', () => {
    // Create buttons
    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'Login';
    loginBtn.onclick = async () => {
      const token = await login();
      if (token) {
        localStorage.setItem('accessToken', token);
        alert('Login successful! Token stored in localStorage');
      }
    };
    
    const getProfileBtn = document.createElement('button');
    getProfileBtn.textContent = 'Get Profile';
    getProfileBtn.onclick = async () => {
      const token = localStorage.getItem('accessToken');
      const profile = await getProfile(token);
      if (profile) {
        alert('Profile retrieved! Check console for details');
        console.log(profile);
      }
    };
    
    // Append to document
    document.body.appendChild(loginBtn);
    document.body.appendChild(document.createTextNode(' '));
    document.body.appendChild(getProfileBtn);
  });
} 