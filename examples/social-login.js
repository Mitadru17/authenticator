/**
 * Example of social login with Google, GitHub, and LinkedIn
 * 
 * This is a demonstration script showing how to direct users to:
 * 1. Google OAuth login
 * 2. GitHub OAuth login
 * 3. LinkedIn OAuth login
 * 
 * Note: This is client-side code that would typically be used in a frontend application
 */

// Function to redirect to Google OAuth login
function loginWithGoogle() {
  window.location.href = 'http://localhost:5000/api/auth/google';
}

// Function to redirect to GitHub OAuth login
function loginWithGitHub() {
  window.location.href = 'http://localhost:5000/api/auth/github';
}

// Function to redirect to LinkedIn OAuth login
function loginWithLinkedIn() {
  window.location.href = 'http://localhost:5000/api/auth/linkedin';
}

// Example HTML implementation:
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Login Example</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      color: white;
      text-align: center;
    }
    .google {
      background-color: #DB4437;
    }
    .github {
      background-color: #333;
    }
    .linkedin {
      background-color: #0077B5;
    }
  </style>
</head>
<body>
  <h1>Social Login Example</h1>
  
  <button class="btn google" onclick="loginWithGoogle()">
    Login with Google
  </button>
  
  <button class="btn github" onclick="loginWithGitHub()">
    Login with GitHub
  </button>
  
  <button class="btn linkedin" onclick="loginWithLinkedIn()">
    Login with LinkedIn
  </button>
  
  <script>
    // Implementation of the login functions as shown above
    function loginWithGoogle() {
      window.location.href = 'http://localhost:5000/api/auth/google';
    }
    
    function loginWithGitHub() {
      window.location.href = 'http://localhost:5000/api/auth/github';
    }
    
    function loginWithLinkedIn() {
      window.location.href = 'http://localhost:5000/api/auth/linkedin';
    }
    
    // Handle callback from OAuth provider
    // This would be on a different page, usually /auth/callback
    function handleAuthCallback() {
      // Parse URL parameters to get tokens
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');
      
      if (accessToken && refreshToken) {
        // Store tokens in localStorage or sessionStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Redirect to dashboard or home page
        window.location.href = '/dashboard';
      } else {
        // Show error
        console.error('Authentication failed');
      }
    }
  </script>
</body>
</html>
*/

// Node.js example of processing the callback on the backend
const processAuthCallback = async (req, res) => {
  try {
    // This would be handled by the socialLoginCallback function in authController.js
    const { accessToken, refreshToken } = req.query;
    
    // Verify tokens...
    
    // Store user session...
    
    // Redirect to frontend dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error processing auth callback:', error);
    res.redirect('/login?error=authentication_failed');
  }
}; 