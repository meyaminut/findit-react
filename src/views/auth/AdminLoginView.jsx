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
  X,
  Clock,
  Headphones
} from 'lucide-react';
import useAuthController from '../../controllers/useAuthController';
import Logo from '../components/Logo';
import OperationalDashboardView from '../dashboard/OperationalDashboardView';
import './AdminLoginView.css';

/**
 * View Component: AdminLoginView
 * Redesigned to pixel-perfect match the official Grand Melia Front Desk & Order Taker
 * operations screen mockup while preserving the signature deep blue gradient background.
 * Follows strict MVC separation of concerns.
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
      {/* Top subtle bar */}
      <header className="admin-topbar">
        <span className="topbar-title">Admin Login Screen</span>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {!isAuthenticated ? (
          <>
            {/* The Login Card (Light Area -> Uses Dark Brand Logo) */}
            <div className="login-card">
              {/* Top Gradient Accent Bar */}
              <div className="card-top-accent-bar" />

              {/* Card Body Container */}
              <div className="card-body-content">
                {/* Official Find!t Adaptive Dark Logo on White Surface */}
                <div className="login-brand-header" style={{ marginBottom: '16px' }}>
                  <Logo variant="dark" withSubtitle={true} size="large" />
                </div>

                {/* Operations Portal Pill */}
                <div className="portal-pill">
                  <span className="portal-dot"></span>
                  <span>OPERATIONAL PORTAL</span>
                </div>

                {/* Headings */}
                <h1 className="login-card-title">Front Desk & Order Taker</h1>
                <p className="login-card-subtitle">
                  Grand Melia Jakarta • Property #ID-JKT08
                </p>

                {/* Active Operational Window Banner */}
                <div className="operational-window-box">
                  <div className="window-info-col">
                    <Clock size={16} className="window-clock-icon" />
                    <div className="window-text">
                      <span className="window-label">ACTIVE OPERATIONAL WINDOW</span>
                      <span className="window-time">Shift Pagi: 07:00 – 15:00 WIB</span>
                    </div>
                  </div>
                  <span className="window-status-badge">Online</span>
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
                  {/* Email / Username Field */}
                  <div className="form-group">
                    <label htmlFor="work-email" className="form-label">
                      Email / Username Karyawan
                    </label>
                    <div className="input-wrapper email-input-wrapper">
                      <span className="input-icon-left">
                        <Mail size={17} />
                      </span>
                      <input
                        id="work-email"
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama.user@grandmelia.co.id"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  {/* Password / PIN Field */}
                  <div className="form-group">
                    <label htmlFor="admin-password" className="form-label">
                      Password / PIN Keamanan
                    </label>
                    <div className="input-wrapper password-input-wrapper">
                      <span className="input-icon-left">
                        <Lock size={17} />
                      </span>
                      <input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
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
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Session & Forgot Password Row */}
                  <div className="form-options-row">
                    <label className="remember-session-label">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={rememberSession}
                        onChange={(e) => setRememberSession(e.target.checked)}
                      />
                      <span className="remember-text">Ingat Sesi Kerja (8 Jam)</span>
                    </label>

                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={() => setIsForgotPasswordOpen(true)}
                    >
                      Lupa Password?
                    </button>
                  </div>

                  {/* Submit Button (Vibrant Gold/Yellow with Black Text) */}
                  <button
                    type="submit"
                    className="login-submit-gold-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="btn-spinner"></div>
                        <span>Memverifikasi Sesi...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk ke Admin Panel</span>
                        <ArrowRight size={17} className="btn-arrow" />
                      </>
                    )}
                  </button>

                  {/* Housekeeping Dispatch Line */}
                  <div className="dispatch-contact-info">
                    <Headphones size={14} className="dispatch-headset-icon" />
                    <span>Housekeeping Dispatch: Ext. 402</span>
                  </div>
                </form>
              </div>

              {/* Bottom Security Footer Box */}
              <div className="card-security-footer">
                <ShieldCheck size={16} className="footer-shield-icon" />
                <span className="footer-shield-text">
                  256-Bit SSL Encrypted • Restricted Access for Authorized Hotel Staff Only
                </span>
              </div>
            </div>

            {/* Outside Card Footer Text */}
            <p className="login-legal-footer">
              Find It! v4.2.1-lts • Hospitality Integrity Cloud • GDPR & PDP Compliant
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
                Masukkan email staf Grand Melia <code>@grandmelia.co.id</code>. 
                Sistem keamanan akan mengirimkan tautan reset & OTP ke terminal Anda.
              </p>
            </div>
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="form-label">Email Karyawan</label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <Mail size={17} />
                  </span>
                  <input
                    type="email"
                    className="form-input"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama.user@grandmelia.co.id"
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
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isForgotLoading}
                >
                  {isForgotLoading ? 'Mengirim...' : 'Kirim OTP Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
