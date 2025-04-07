import React, { useState } from 'react';
import { useAuth, useLoginForm, useRegisterForm, useSocialLogin } from '../src';

// Login Form Component
const LoginForm = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    formError
  } = useLoginForm();

  return (
    <div className="form-container">
      <h2>Login</h2>
      
      {formError && <div className="error">{formError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

// Registration Form Component
const RegisterForm = () => {
  const {
    formData,
    handleChange,
    handleRegister,
    handleVerifyOtp,
    handleResendOtp,
    isSubmitting,
    formError,
    otpSent
  } = useRegisterForm();

  if (otpSent) {
    return (
      <div className="form-container">
        <h2>Verify OTP</h2>
        
        {formError && <div className="error">{formError}</div>}
        
        <form onSubmit={handleVerifyOtp}>
          <div className="form-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={formData.otp || ''}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleResendOtp} 
            disabled={isSubmitting}
          >
            Resend OTP
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Register</h2>
      
      {formError && <div className="error">{formError}</div>}
      
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

// Social Login Buttons
const SocialLoginButtons = () => {
  const { 
    redirectToGoogle, 
    redirectToGithub, 
    redirectToLinkedin 
  } = useSocialLogin();

  return (
    <div className="social-buttons">
      <h3>Or continue with</h3>
      
      <button 
        onClick={redirectToGoogle} 
        className="btn social-btn google"
      >
        Login with Google
      </button>
      
      <button 
        onClick={redirectToGithub} 
        className="btn social-btn github"
      >
        Login with GitHub
      </button>
      
      <button 
        onClick={redirectToLinkedin} 
        className="btn social-btn linkedin"
      >
        Login with LinkedIn
      </button>
    </div>
  );
};

// User Profile Component
const UserProfile = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      
      <div className="profile-info">
        <div className="profile-field">
          <span>Email:</span> {user.email}
        </div>
        
        {user.mobile && (
          <div className="profile-field">
            <span>Mobile:</span> {user.mobile}
          </div>
        )}
        
        <div className="profile-field">
          <span>Auth Provider:</span> {user.authProvider}
        </div>
        
        <div className="profile-field">
          <span>Verified:</span> {user.isVerified ? 'Yes' : 'No'}
        </div>
      </div>
      
      <button 
        onClick={logout} 
        className="btn logout-btn"
      >
        Logout
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <UserProfile />;
  }
  
  return (
    <div className="auth-container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        
        <button 
          className={`tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
      </div>
      
      <div className="content">
        {activeTab === 'login' ? (
          <>
            <LoginForm />
            <SocialLoginButtons />
          </>
        ) : (
          <RegisterForm />
        )}
      </div>
    </div>
  );
};

export default App; 