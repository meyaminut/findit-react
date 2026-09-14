import { useState, useEffect } from 'react';
import { AuthController } from './AuthController';

/**
 * Controller Hook: useAuthController
 * Exposes reactive controller state and action dispatchers to React Views
 */
export function useAuthController() {
  const [email, setEmail] = useState('admin@findit.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Forgot Password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Authenticated state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check remembered session on mount
  useEffect(() => {
    try {
      const remembered = localStorage.getItem('findit_admin_remember');
      if (remembered) {
        setEmail(remembered);
        setRememberSession(true);
      }
    } catch (e) {}
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const result = await AuthController.login(email, password, rememberSession);
      if (result.success) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
      } else {
        setErrorMessage(result.error || 'Authentication failed.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    AuthController.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSuccessMessage('Secure session ended successfully.');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    setIsForgotLoading(true);

    try {
      const result = await AuthController.requestPasswordReset(forgotEmail);
      if (result.success) {
        setIsForgotPasswordOpen(false);
        setForgotEmail('');
        setSuccessMessage(result.message);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(result.error);
      }
    } catch (err) {
      setErrorMessage('Failed to send reset link.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    // State
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    rememberSession,
    setRememberSession,
    isLoading,
    errorMessage,
    successMessage,
    isForgotPasswordOpen,
    setIsForgotPasswordOpen,
    forgotEmail,
    setForgotEmail,
    isForgotLoading,
    isAuthenticated,
    currentUser,

    // Actions
    handleLogin,
    handleLogout,
    handleForgotPassword
  };
}

export default useAuthController;
