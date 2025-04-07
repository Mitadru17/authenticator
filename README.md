# Authentication API

A Node.js + Express backend with MongoDB for user authentication, featuring:

- Email/mobile registration with OTP verification
- Password-based login
- Social login (Google, GitHub, LinkedIn)
- JWT-based authentication
- Protected routes with profile access

## Features

- User registration with email or mobile
- OTP verification via email and SMS
- Password-based login
- Social login with Google, GitHub, and LinkedIn
- JWT-based authentication with access and refresh tokens
- Protected routes accessible only with valid JWT

## Prerequisites

- Node.js
- MongoDB
- SMTP server for sending emails
- Twilio account for sending SMS
- OAuth credentials for social login providers:
  - Google OAuth credentials from Google Developer Console
  - GitHub OAuth application credentials
  - LinkedIn OAuth application credentials

## Setup

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/authenticator
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   JWT_EXPIRY=1h
   JWT_REFRESH_EXPIRY=7d
   OTP_EXPIRY=600000
   BACKEND_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000

   # OAuth credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

   # Email configuration
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=noreply@your-domain.com

   # Twilio configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. Start the server
   ```
   npm start
   ```

## API Endpoints

### Authentication Routes

- **POST /api/auth/register**: Register with email/mobile and receive OTP

  ```json
  {
    "email": "user@example.com", // or "mobile": "+123456789"
    "password": "password123"
  }
  ```

- **POST /api/auth/verify-otp**: Verify OTP to complete registration

  ```json
  {
    "email": "user@example.com", // or "mobile": "+123456789"
    "otp": "123456"
  }
  ```

- **POST /api/auth/resend-otp**: Resend OTP if it expired or wasn't received

  ```json
  {
    "email": "user@example.com" // or "mobile": "+123456789"
  }
  ```

- **POST /api/auth/login**: Login with email/mobile and password
  ```json
  {
    "email": "user@example.com", // or "mobile": "+123456789"
    "password": "password123"
  }
  ```

### Social Login Routes

- **GET /api/auth/google**: Initiate Google OAuth flow
- **GET /api/auth/google/callback**: Handle Google OAuth callback

- **GET /api/auth/github**: Initiate GitHub OAuth flow
- **GET /api/auth/github/callback**: Handle GitHub OAuth callback

- **GET /api/auth/linkedin**: Initiate LinkedIn OAuth flow
- **GET /api/auth/linkedin/callback**: Handle LinkedIn OAuth callback

### Protected Routes

- **GET /api/auth/protected**: Test protected route (requires authentication)
- **GET /api/auth/profile**: Get the authenticated user's profile data

## OTP Verification Flow

### Email Verification

1. User registers with email and password
2. System generates a 6-digit OTP and sends it to the user's email
3. OTP is stored in the user document with a 10-minute expiry
4. User submits the OTP using the verification endpoint
5. System verifies the OTP and marks the user as verified
6. If the OTP expires, user can request a new one via the resend-otp endpoint

### Mobile Verification

1. User registers with mobile number and password
2. System generates a 6-digit OTP and sends it via SMS using Twilio
3. OTP is stored in the user document with a 10-minute expiry
4. User submits the OTP using the verification endpoint
5. System verifies the OTP and marks the user as verified
6. If the OTP expires, user can request a new one via the resend-otp endpoint

## Social Login Flow

1. User clicks on a social login button (Google, GitHub, or LinkedIn)
2. User is redirected to the provider's authentication page
3. After successful authentication, the provider redirects back to the application's callback URL
4. The system checks if the user already exists by email:
   - If the user exists but used a different auth provider, the system updates the auth provider
   - If the user doesn't exist, a new account is created with the provider's data
5. The user is automatically verified (isVerified = true)
6. JWT tokens (access token and refresh token) are generated and returned
7. The user is considered logged in and can access protected routes

### Setting Up Social Login

#### Google OAuth

1. Go to the [Google Developer Console](https://console.developers.google.com/)
2. Create a new project
3. Set up OAuth consent screen
4. Create OAuth client ID credentials
5. Add authorized JavaScript origins (e.g., http://localhost:5000)
6. Add authorized redirect URIs (e.g., http://localhost:5000/api/auth/google/callback)
7. Copy the Client ID and Client Secret to your .env file

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Register a new OAuth application
3. Set the homepage URL (e.g., http://localhost:3000)
4. Set the callback URL (e.g., http://localhost:5000/api/auth/github/callback)
5. Copy the Client ID and Client Secret to your .env file

#### LinkedIn OAuth

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers)
2. Create a new app
3. Set redirect URLs (e.g., http://localhost:5000/api/auth/linkedin/callback)
4. Request the necessary permissions
5. Copy the Client ID and Client Secret to your .env file

## JWT Authentication

The API uses JSON Web Tokens (JWT) for authentication:

1. When a user logs in successfully (via any method), the server generates:

   - An access token (short-lived, default 1h)
   - A refresh token (longer-lived, default 7d)

2. To access protected routes, the client must include the access token in the Authorization header:

   ```
   Authorization: Bearer [access_token]
   ```

3. The server verifies the token signature and expiration before allowing access to protected resources.

4. If the access token expires, the client should use the refresh token to obtain a new access token.

### Example - Accessing a Protected Route

```javascript
// Get the profile data
async function getProfile() {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      console.log("Profile:", data.profile);
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## Project Structure

```
.
├── config/         # Configuration files
│   └── passport.js # Passport.js configuration for social login
├── controllers/    # Route controllers
│   └── authController.js
├── middleware/     # Custom middleware
│   └── auth.js     # JWT authentication middleware
├── models/         # MongoDB models
│   └── User.js     # User model
├── routes/         # API routes
│   └── auth.js     # Authentication routes
├── utils/          # Utility functions
│   ├── email.js    # Email sending utilities
│   ├── sms.js      # SMS sending utilities
│   ├── token.js    # JWT token utilities
│   └── validator.js # Request validation utilities
├── examples/       # Example code for implementation
│   ├── mobile-registration.js # Mobile OTP flow example
│   ├── social-login.js # Social login flow example
│   ├── profile-access.js # JWT authentication example
│   ├── social-login.html # Social login demo page
│   ├── auth-callback.html # OAuth callback handler
│   └── profile-page.html # JWT authentication demo page
├── .env            # Environment variables
├── server.js       # Server entry point
└── README.md
```

## Security Considerations

- JWT tokens are signed with secure secrets
- Passwords are hashed using bcrypt
- OTP has a 10-minute expiration
- Input validation for all routes
- Mobile numbers must include country code
- Social login uses secure OAuth 2.0 flow

## Future Improvements

- Rate limiting for auth endpoints
- Password reset functionality
- Role-based access control
- Session management with token rotation
- Implement PKCE flow for OAuth security
