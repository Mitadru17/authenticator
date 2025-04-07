import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import AuthApi from './api';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ 
  children, 
  apiConfig = {},
  memoryStorage = false,
  storageKey = 'accessToken',
  onLoginSuccess = () => {},
  onLogout = () => {},
  loadUserOnMount = true
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Configure token storage (localStorage or memory)
  const tokenStorage = useMemo(() => {
    if (memoryStorage) {
      // Create an in-memory storage object
      let token = null;
      return {
        getItem: () => token,
        setItem: (key, value) => { token = value; },
        removeItem: () => { token = null; }
      };
    }
    return localStorage;
  }, [memoryStorage]);
  
  // Initialize the API with config
  const api = useMemo(() => {
    return new AuthApi({
      ...apiConfig,
      tokenStorage,
      storageKey,
      onUnauthorized: () => {
        setUser(null);
        onLogout();
      }
    });
  }, [apiConfig, tokenStorage, storageKey, onLogout]);
  
  // Parse user from token
  const parseUserFromToken = (token) => {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  
  // Load the user on mount
  useEffect(() => {
    if (loadUserOnMount) {
      const loadUser = async () => {
        setLoading(true);
        setError(null);
        
        try {
          // Check if token exists
          const token = api.getToken();
          
          if (token) {
            // If there is a token, try to fetch user profile
            const response = await api.getProfile();
            
            if (response.success) {
              setUser(response.profile);
            } else {
              // If profile fetch fails, token may be invalid or expired
              api.clearToken();
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } catch (e) {
          setError(e.message || 'Failed to load user');
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      
      loadUser();
    } else {
      setLoading(false);
    }
  }, [api, loadUserOnMount]);
  
  // Auth methods
  const register = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.register(credentials);
      return response;
    } catch (e) {
      setError(e.message || 'Registration failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  const verifyOtp = async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.verifyOtp(params);
      
      if (response.success) {
        // Fetch user profile after OTP verification
        const userResponse = await api.getProfile();
        if (userResponse.success) {
          setUser(userResponse.profile);
          onLoginSuccess(userResponse.profile);
        }
      }
      
      return response;
    } catch (e) {
      setError(e.message || 'OTP verification failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  const resendOtp = async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.resendOtp(params);
      return response;
    } catch (e) {
      setError(e.message || 'Failed to resend OTP');
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.login(credentials);
      
      if (response.success) {
        // Fetch user profile after login
        const userResponse = await api.getProfile();
        if (userResponse.success) {
          setUser(userResponse.profile);
          onLoginSuccess(userResponse.profile);
        }
      }
      
      return response;
    } catch (e) {
      setError(e.message || 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    
    try {
      await api.logout();
      setUser(null);
      onLogout();
      return { success: true };
    } catch (e) {
      setError(e.message || 'Logout failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  // Social login URLs
  const socialLoginUrls = {
    google: api.getGoogleLoginUrl(),
    github: api.getGithubLoginUrl(),
    linkedin: api.getLinkedinLoginUrl(),
  };
  
  // Handle social login callback
  const handleSocialLoginCallback = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get tokens from URL parameters or hash
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      
      if (accessToken) {
        // Store the token
        api.setToken(accessToken);
        
        // Fetch user profile
        const userResponse = await api.getProfile();
        if (userResponse.success) {
          setUser(userResponse.profile);
          onLoginSuccess(userResponse.profile);
          return { success: true, user: userResponse.profile };
        }
      }
      
      return { success: false, message: 'No access token found in URL' };
    } catch (e) {
      setError(e.message || 'Social login callback processing failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    verifyOtp,
    resendOtp,
    login,
    logout,
    socialLoginUrls,
    handleSocialLoginCallback,
    clearError: () => setError(null),
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 