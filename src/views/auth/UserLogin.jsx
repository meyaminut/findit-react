import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { GoogleIcon } from '../components/SocialIcons';
import finditLogo from '../../assets/logo-light.png';
import './UserLogin.css';

/**
 * View Component: UserLogin
 * User portal sign-in screen for the FindIt! application.
 * Flow: "Log In" success -> /user/survey, "Create an account" -> /user/register.
 */
export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = email.includes('@') && email.includes('.');
  const isFormValid = isEmailValid && password.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      navigate('/user/survey');
    }, 600);
  };

  return (
    <div className="user-login-page">
      <div className="user-login-frame">
        {/* Header */}
        <header className="ul-header">
          <div className="ul-header-inner">
            <span className="ul-radar-badge">
              <span className="ul-radar-dot" />
              RADAR SMI ACTIVE
            </span>
            <img src={finditLogo} alt="Find!t" className="logo-img" />
            <p className="ul-header-subtitle">Reuniting 12,400+ campus items daily</p>
          </div>
        </header>

        {/* Form Card */}
        <main className="ul-form-card">
          <div className="ul-heading-wrap">
            <h1 className="ul-heading">Welcome back! 👋</h1>
            <p className="ul-heading-sub">Sign in to track your items and active alerts.</p>
          </div>

          <form className="ul-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="ul-field">
              <label htmlFor="ul-email" className="ul-label">
                EMAIL ADDRESS
              </label>
              <div className="ul-input-wrap">
                <span className={`ul-input-icon ${isEmailValid ? 'valid' : ''}`}>
                  <Mail size={18} />
                </span>
                <input
                  id="ul-email"
                  type="email"
                  className="ul-input"
                  placeholder="you@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                {isEmailValid && (
                  <span className="ul-input-icon valid">
                    <Check size={18} />
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="ul-field">
              <label htmlFor="ul-password" className="ul-label">
                PASSWORD
              </label>
              <div className="ul-input-wrap">
                <span className="ul-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="ul-password"
                  type={showPassword ? 'text' : 'password'}
                  className="ul-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="ul-show-btn"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="ul-forgot-row">
              <button
                type="button"
                className="ul-forgot-btn"
                onClick={() => {}}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="ul-submit-btn" disabled={isLoading || !isFormValid}>
              {isLoading ? 'Signing in...' : (
                <>
                  Log In <span className="ul-btn-arrow">&rarr;</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="ul-divider">OR CONTINUE WITH</div>

            {/* Social */}
            <div className="ul-social-grid">
              <button type="button" className="ul-social-btn" onClick={() => navigate('/user/survey')}>
                <GoogleIcon size={18} /> Google
              </button>
              <button type="button" className="ul-social-btn" onClick={() => navigate('/user/survey')}>
                <svg width="18" height="18" viewBox="0 0 384 512" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                  />
                </svg>
                Apple
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="ul-footer">
            New here?{' '}
            <button type="button" className="ul-footer-btn" onClick={() => navigate('/user/register')}>
              Create an account
            </button>
          </p>
        </main>
      </div>
    </div>
  );
}