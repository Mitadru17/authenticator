# Authentication API

A Node.js + Express backend with MongoDB for user authentication, featuring:

- Email/mobile registration with OTP verification
- Password-based login
- Social login (Google, GitHub, LinkedIn)
- JWT-based authentication

## Features

- User registration with email or mobile
- OTP verification via email
- Password-based login
- Social login with Google, GitHub, and LinkedIn
- JWT-based authentication with access and refresh tokens

## Prerequisites

- Node.js
- MongoDB
- SMTP server for sending emails
- OAuth credentials for social login providers

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
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   BACKEND_URL=http://localhost:5000

   # Email configuration
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=noreply@your-domain.com
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
    "email": "user@example.com", // or "mobile": "1234567890"
    "password": "password123"
  }
  ```

- **POST /api/auth/verify-otp**: Verify OTP to complete registration

  ```json
  {
    "email": "user@example.com", // or "mobile": "1234567890"
    "otp": "123456"
  }
  ```

- **POST /api/auth/resend-otp**: Resend OTP if it expired or wasn't received

  ```json
  {
    "email": "user@example.com" // or "mobile": "1234567890"
  }
  ```

- **POST /api/auth/login**: Login with email/mobile and password
  ```json
  {
    "email": "user@example.com", // or "mobile": "1234567890"
    "password": "password123"
  }
  ```

### Social Login Routes

- **GET /api/auth/google**: Initiate Google OAuth flow
- **GET /api/auth/github**: Initiate GitHub OAuth flow
- **GET /api/auth/linkedin**: Initiate LinkedIn OAuth flow

### Protected Routes

- **GET /api/auth/protected**: Test protected route (requires authentication)

## Email OTP Verification Flow

1. User registers with email and password
2. System generates a 6-digit OTP and sends it to the user's email
3. OTP is stored in the user document with a 10-minute expiry
4. User submits the OTP using the verification endpoint
5. System verifies the OTP and marks the user as verified
6. If the OTP expires, user can request a new one via the resend-otp endpoint

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
│   ├── token.js    # JWT token utilities
│   └── validator.js # Request validation utilities
├── .env            # Environment variables
├── server.js       # Server entry point
└── README.md
```

## Security Considerations

- JWT tokens are signed with secure secrets
- Passwords are hashed using bcrypt
- OTP has a 5-minute expiration
- Input validation for all routes

## Future Improvements

- Email/SMS service integration for OTP delivery
- Rate limiting for auth endpoints
- Password reset functionality
- Role-based access control
