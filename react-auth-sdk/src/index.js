import { AuthProvider, useAuth } from './AuthContext';
import AuthApi from './api';
import { 
  useProtectedRoute, 
  useLoginForm, 
  useRegisterForm,
  useSocialLogin
} from './hooks';

// Export public API
export {
  AuthProvider,
  useAuth,
  AuthApi,
  useProtectedRoute,
  useLoginForm,
  useRegisterForm,
  useSocialLogin
};

// Default export
export default AuthProvider; 