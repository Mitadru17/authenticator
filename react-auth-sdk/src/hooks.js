import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

/**
 * A hook to use with protected components or routes
 * It redirects unauthenticated users to the login page
 */
export const useProtectedRoute = (redirectUrl = '/login') => {
  const { isAuthenticated, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShouldRedirect(true);
      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    }
  }, [isAuthenticated, loading, redirectUrl]);
  
  return { shouldRedirect, loading };
};

/**
 * A hook to manage login form state
 */
export const useLoginForm = (initialValues = { email: '', password: '' }) => {
  const [formData, setFormData] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const { login, error, clearError } = useAuth();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear form error when user types
    if (formError) {
      setFormError(null);
    }
    
    // Clear auth error when user types
    if (error) {
      clearError();
    }
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate form
    if (!formData.email && !formData.mobile) {
      setFormError('Email or mobile number is required');
      return;
    }
    
    if (!formData.password) {
      setFormError('Password is required');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const response = await login(formData);
      return response;
    } catch (error) {
      setFormError(error.message || 'Login failed');
      return { success: false, message: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    formError,
    setFormError,
    setFormData,
  };
};

/**
 * A hook to manage registration form state
 */
export const useRegisterForm = (initialValues = { email: '', mobile: '', password: '' }) => {
  const [formData, setFormData] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const { register, verifyOtp, resendOtp, error, clearError } = useAuth();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear form error when user types
    if (formError) {
      setFormError(null);
    }
    
    // Clear auth error when user types
    if (error) {
      clearError();
    }
  };
  
  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    
    // Validate form
    if (!formData.email && !formData.mobile) {
      setFormError('Email or mobile number is required');
      return;
    }
    
    if (!formData.password) {
      setFormError('Password is required');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const response = await register(formData);
      
      if (response.success) {
        setOtpSent(true);
        setUserId(response.userId);
      }
      
      return response;
    } catch (error) {
      setFormError(error.message || 'Registration failed');
      return { success: false, message: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.otp) {
      setFormError('OTP is required');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const verifyData = {
        otp: formData.otp,
        ...(formData.email ? { email: formData.email } : {}),
        ...(formData.mobile ? { mobile: formData.mobile } : {})
      };
      
      const response = await verifyOtp(verifyData);
      return response;
    } catch (error) {
      setFormError(error.message || 'OTP verification failed');
      return { success: false, message: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendOtp = async () => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const resendData = {
        ...(formData.email ? { email: formData.email } : {}),
        ...(formData.mobile ? { mobile: formData.mobile } : {})
      };
      
      const response = await resendOtp(resendData);
      
      if (response.success) {
        setOtpSent(true);
      }
      
      return response;
    } catch (error) {
      setFormError(error.message || 'Failed to resend OTP');
      return { success: false, message: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    handleChange,
    handleRegister,
    handleVerifyOtp,
    handleResendOtp,
    isSubmitting,
    formError,
    otpSent,
    userId,
    setFormData,
    setFormError,
    setOtpSent,
  };
};

/**
 * A hook to handle social login redirects and callbacks
 */
export const useSocialLogin = () => {
  const { socialLoginUrls, handleSocialLoginCallback } = useAuth();
  
  const redirectToGoogle = () => {
    if (typeof window !== 'undefined') {
      window.location.href = socialLoginUrls.google;
    }
  };
  
  const redirectToGithub = () => {
    if (typeof window !== 'undefined') {
      window.location.href = socialLoginUrls.github;
    }
  };
  
  const redirectToLinkedin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = socialLoginUrls.linkedin;
    }
  };
  
  return {
    redirectToGoogle,
    redirectToGithub,
    redirectToLinkedin,
    handleSocialLoginCallback,
  };
}; 