import React from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import useAuthController from '../../controllers/useAuthController';
import Logo from '../components/Logo';
import OperationalDashboardView from '../dashboard/OperationalDashboardView';
import './AdminLoginView.css';

/**
 * View Component: AdminLoginView
 * Follows strict MVC separation: pure visual presentation & user interaction triggers,
 * delegating all state, validation, and session logic to `useAuthController`.
 */
export default function AdminLoginView({ onLoginSuccess }) {
  const {
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
    handleLogin,
    handleLogout,
    handleForgotPassword
  } = useAuthController();

  React.useEffect(() => {
    if (isAuthenticated && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

  return (
    <div className="admin-login-page">
      {/* Top Bar Header */}
      <header className="admin-topbar">
        <span className="topbar-title">Admin Login</span>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {!isAuthenticated ? (
          <>
            {/* The Login Card */}
            <div className="login-card">
              {/* Card Header with Official Find!t Logo & Tag */}
              <div className="card-header">
                {/* Official Find!t Logo Component */}
                <Logo size="medium" showAdminBadge={true} />

                {/* Operations Portal Pill */}
                <div className="portal-pill">
                  <span className="portal-dot"></span>
                  <span>OPERATIONS PORTAL</span>
                </div>

                {/* Heading & Subheading */}
                <h1 className="card-title">Sign in to Admin Console</h1>
                <p className="card-subtitle">
                  Enter your operational credentials to continue
                </p>
              </div>

              {/* Status/Error Notification */}
              {errorMessage && (
                <div className="login-alert error">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="login-alert success">
                  <CheckCircle2 size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form className="login-form" onSubmit={handleLogin}>
                {/* Work Email Field */}
                <div className="form-group">
                  <label htmlFor="work-email" className="form-label">
                    Work Email
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon-left">
                      <Mail size={18} />
                    </span>
                    <input
                      id="work-email"
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@findit.internal"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="admin-password" className="form-label">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon-left">
                      <Lock size={18} />
                    </span>
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={togglePasswordVisibility}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Session & Forgot Password Row */}
                <div className="form-options-row">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                    />
                    <span className="remember-text">Remember session</span>
                  </label>

                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setIsForgotPasswordOpen(true)}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Log In Button */}
                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In</span>
                      <span className="btn-arrow-icon">
                        <ArrowRight size={17} />
                      </span>
                    </>
                  )}
                </button>

                {/* Security Footer Box inside Card */}
                <div className="security-notice-box">
                  <ShieldCheck size={18} className="security-icon" />
                  <span className="security-text">
                    256-bit encrypted operational session
                  </span>
                </div>
              </form>
            </div>

            {/* Subtitle Disclaimer outside Card */}
            <p className="admin-disclaimer">
              Admin access only. Contact your team lead or IT security if you need an authorized account.
            </p>
          </>
        ) : (
          /* Operational Session View after Successful Login */
          <OperationalDashboardView 
            user={currentUser} 
            onLogout={handleLogout} 
          />
        )}
      </main>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="modal-backdrop" onClick={() => setIsForgotPasswordOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setIsForgotPasswordOpen(false)}
            >
              <X size={18} />
            </button>
            <div className="modal-header">
              <h3>Reset Operational Credentials</h3>
              <p>
                Enter your authorized <code>@findit.internal</code> email address. 
                Security will transmit a one-time OTP to your internal communication device.
              </p>
            </div>
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="form-label">Internal Email</label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    className="form-input"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@findit.internal"
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setIsForgotPasswordOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isForgotLoading}
                >
                  {isForgotLoading ? 'Sending OTP...' : 'Send Recovery OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
