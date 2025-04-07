import axios from 'axios';

class AuthApi {
  constructor(config = {}) {
    this.baseURL = config.baseURL || 'http://localhost:5000/api/auth';
    this.tokenStorage = config.tokenStorage || localStorage;
    this.storageKey = config.storageKey || 'accessToken';
    
    // Create axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
          this.clearToken();
          // Optionally redirect to login
          if (typeof window !== 'undefined' && config.onUnauthorized) {
            config.onUnauthorized();
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  // Token management
  setToken(token) {
    this.tokenStorage.setItem(this.storageKey, token);
  }
  
  getToken() {
    return this.tokenStorage.getItem(this.storageKey);
  }
  
  clearToken() {
    this.tokenStorage.removeItem(this.storageKey);
  }
  
  isAuthenticated() {
    return !!this.getToken();
  }
  
  // Auth API endpoints
  
  // Register with email or mobile
  async register({ email, mobile, password }) {
    try {
      const response = await this.api.post('/register', {
        email,
        mobile,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Verify OTP
  async verifyOtp({ email, mobile, otp }) {
    try {
      const response = await this.api.post('/verify-otp', {
        email,
        mobile,
        otp,
      });
      
      if (response.data.success && response.data.accessToken) {
        this.setToken(response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Resend OTP
  async resendOtp({ email, mobile }) {
    try {
      const response = await this.api.post('/resend-otp', {
        email,
        mobile,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Login with email/mobile and password
  async login({ email, mobile, password }) {
    try {
      const response = await this.api.post('/login', {
        email,
        mobile,
        password,
      });
      
      if (response.data.success && response.data.accessToken) {
        this.setToken(response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Logout (client-side only)
  async logout() {
    this.clearToken();
    return { success: true };
  }
  
  // Get user profile
  async getProfile() {
    try {
      const response = await this.api.get('/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Helper for social login redirect
  getGoogleLoginUrl() {
    return `${this.baseURL}/google`;
  }
  
  getGithubLoginUrl() {
    return `${this.baseURL}/github`;
  }
  
  getLinkedinLoginUrl() {
    return `${this.baseURL}/linkedin`;
  }
  
  // Error handling
  handleError(error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: error.message || 'Unknown error occurred' };
  }
}

export default AuthApi; 