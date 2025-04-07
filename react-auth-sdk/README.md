# React Auth SDK

A React SDK for the Authentication API with JWT, OTP verification, and social login support.

## Features

- Authentication state management using React Context
- JWT token storage and management
- Automatic token inclusion in API requests
- Login, register, and OTP verification
- Social login with Google, GitHub, and LinkedIn
- Form handling hooks for easy integration
- Protected route utilities

## Installation

```bash
npm install react-auth-sdk
# or
yarn add react-auth-sdk
```

## Quick Start

### Wrap your app with the AuthProvider

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "react-auth-sdk";
import App from "./App";

ReactDOM.render(
  <AuthProvider
    apiConfig={{
      baseURL: "http://localhost:5000/api/auth",
    }}
  >
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
```

### Access auth context in your components

```jsx
import React from "react";
import { useAuth } from "react-auth-sdk";

const Profile = () => {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Account type: {user.authProvider}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
```

## Authentication Forms

### Login Form

```jsx
import React from "react";
import { useLoginForm } from "react-auth-sdk";

const LoginForm = () => {
  const { formData, handleChange, handleSubmit, isSubmitting, formError } =
    useLoginForm();

  return (
    <form onSubmit={handleSubmit}>
      {formError && <div className="error">{formError}</div>}

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
```

### Registration Form with OTP Verification

```jsx
import React from "react";
import { useRegisterForm } from "react-auth-sdk";

const RegisterForm = () => {
  const {
    formData,
    handleChange,
    handleRegister,
    handleVerifyOtp,
    handleResendOtp,
    isSubmitting,
    formError,
    otpSent,
  } = useRegisterForm();

  if (otpSent) {
    return (
      <form onSubmit={handleVerifyOtp}>
        {formError && <div className="error">{formError}</div>}

        <div>
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>

        <button type="button" onClick={handleResendOtp} disabled={isSubmitting}>
          Resend OTP
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleRegister}>
      {formError && <div className="error">{formError}</div>}

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
```

### Social Login Buttons

```jsx
import React from "react";
import { useSocialLogin } from "react-auth-sdk";

const SocialLoginButtons = () => {
  const { redirectToGoogle, redirectToGithub, redirectToLinkedin } =
    useSocialLogin();

  return (
    <div>
      <button onClick={redirectToGoogle}>Login with Google</button>

      <button onClick={redirectToGithub}>Login with GitHub</button>

      <button onClick={redirectToLinkedin}>Login with LinkedIn</button>
    </div>
  );
};

export default SocialLoginButtons;
```

## Protected Routes

```jsx
import React from "react";
import { useProtectedRoute } from "react-auth-sdk";

const ProtectedPage = () => {
  const { shouldRedirect, loading } = useProtectedRoute("/login");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (shouldRedirect) {
    return null; // Will redirect to login
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>This page is only visible to authenticated users.</p>
    </div>
  );
};

export default ProtectedPage;
```

## AuthProvider Configuration

The `AuthProvider` component accepts the following props:

| Prop                | Type     | Default                            | Description                                        |
| ------------------- | -------- | ---------------------------------- | -------------------------------------------------- |
| `apiConfig`         | Object   | `{}`                               | Configuration for the API client                   |
| `apiConfig.baseURL` | String   | `'http://localhost:5000/api/auth'` | Base URL for API requests                          |
| `memoryStorage`     | Boolean  | `false`                            | Use memory storage instead of localStorage         |
| `storageKey`        | String   | `'accessToken'`                    | Storage key for the auth token                     |
| `onLoginSuccess`    | Function | `() => {}`                         | Callback function called after successful login    |
| `onLogout`          | Function | `() => {}`                         | Callback function called after logout              |
| `loadUserOnMount`   | Boolean  | `true`                             | Whether to load user data when the provider mounts |

## API Reference

### Hooks

- `useAuth()` - Access the authentication context
- `useProtectedRoute(redirectUrl)` - Protect routes from unauthenticated access
- `useLoginForm(initialValues)` - Manage login form state and submission
- `useRegisterForm(initialValues)` - Manage registration and OTP verification
- `useSocialLogin()` - Handle social login redirects

### Auth Context

The `useAuth()` hook provides access to:

- `user` - The authenticated user object
- `loading` - Authentication loading state
- `error` - Authentication error
- `isAuthenticated` - Whether the user is authenticated
- `register(credentials)` - Register a new user
- `verifyOtp(params)` - Verify OTP
- `resendOtp(params)` - Resend OTP
- `login(credentials)` - Login with credentials
- `logout()` - Logout the current user
- `socialLoginUrls` - URLs for social login providers
- `handleSocialLoginCallback()` - Process social login callback
- `clearError()` - Clear authentication error
