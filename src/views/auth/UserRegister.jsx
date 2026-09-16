import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, EyeOff, Lock, Mail, RefreshCw, User } from 'lucide-react';
import { GoogleIcon } from '../components/SocialIcons';
import finditLogo from '../../assets/logo-light.png';
import './UserRegister.css';

/**
 * View Component: UserRegister
 * User portal sign-up screen for the FindIt! application.
 * Flow: "Create Account" success -> /user/welcome, "Log in" -> /user/login.
 */
export default function UserRegister() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 8;
  const isConfirmValid = confirmPassword.length > 0 && confirmPassword === password;

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabel = passwordStrength >= 3 ? 'Strong password ✨' : passwordStrength === 2 ? 'Good password' : 'Weak password';

  const isFormValid =
    fullName.trim().length >= 2 && isEmailValid && isPasswordValid && isConfirmValid && agreeTerms;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      navigate('/user/welcome');
    }, 600);
  };

  return (
    <div className="user-register-page">
      <div className="user-register-frame">
        {/* Header */}
        <header className="ur-header">
          <div className="ur-header-inner">
            <span className="ur-step-badge">
              <span className="ur-step-dot" />
              STEP 1 OF 1 &bull; QUICK SIGNUP
            </span>
            <img src={finditLogo} alt="Find!t" className="logo-img" />
            <p className="ur-header-subtitle">Connecting lost belongings with caring humans everywhere.</p>
          </div>
        </header>

        {/* Form Card */}
        <main className="ur-form-card">
          <h1 className="ur-heading">Join the FindIt! community</h1>

          <form className="ur-form" onSubmit={handleSubmit}>
            {/* Full name */}
            <div className="ur-field">
              <label htmlFor="ur-name" className="ur-label">
                FULL NAME
              </label>
              <div className="ur-input-wrap">
                <span className={`ur-input-icon ${fullName.trim().length >= 2 ? 'valid' : ''}`}>
                  <User size={18} />
                </span>
                <input
                  id="ur-name"
                  type="text"
                  className="ur-input"
                  placeholder="Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                />
                {fullName.trim().length >= 2 && (
                  <span className="ur-input-icon valid">
                    <Check size={18} />
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="ur-field">
              <label htmlFor="ur-email" className="ur-label">
                EMAIL ADDRESS
              </label>
              <div className="ur-input-wrap">
                <span className={`ur-input-icon ${isEmailValid ? 'valid' : ''}`}>
                  <Mail size={18} />
                </span>
                <input
                  id="ur-email"
                  type="email"
                  className="ur-input"
                  placeholder="you@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                {isEmailValid && (
                  <span className="ur-input-icon valid">
                    <Check size={18} />
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="ur-field">
              <label htmlFor="ur-password" className="ur-label">
                PASSWORD
              </label>
              <div className="ur-input-wrap">
                <span className="ul-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="ur-password"
                  type={showPassword ? 'text' : 'password'}
                  className="ur-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="ur-show-btn"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="ur-strength">
                  <div className="ur-strength-bars">
                    {[0, 1, 2].map((bar) => (
                      <span
                        key={bar}
                        className={`ur-strength-bar ${bar < passwordStrength ? `fill-${passwordStrength}` : ''}`}
                      />
                    ))}
                  </div>
                  <span className="ur-strength-info">
                    {strengthLabel}
                    <span className="ur-strength-count">{password.length} characters</span>
                  </span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="ur-field">
              <label htmlFor="ur-confirm" className="ur-label">
                CONFIRM PASSWORD
              </label>
              <div className="ur-input-wrap">
                <span className={`ur-input-icon ${isConfirmValid ? 'valid' : ''}`}>
                  <RefreshCw size={18} />
                </span>
                <input
                  id="ur-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="ur-input"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="ur-show-btn"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {isConfirmValid && (
                  <span className="ur-input-icon valid">
                    <Check size={18} />
                  </span>
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="ur-terms">
              <span
                role="checkbox"
                aria-checked={agreeTerms}
                tabIndex={0}
                className={`ur-checkbox ${agreeTerms ? 'checked' : ''}`}
                onClick={() => setAgreeTerms((value) => !value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setAgreeTerms((value) => !value);
                  }
                }}
              >
                {agreeTerms && <Check size={14} strokeWidth={3} />}
              </span>
              <span className="ur-terms-text">
                I agree to the{' '}
                <button
                  type="button"
                  className="ur-terms-btn"
                  onClick={(e) => e.preventDefault()}
                >
                  Terms of Service
                </button>{' '}
                &amp;{' '}
                <button
                  type="button"
                  className="ur-terms-btn"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>

            {/* Submit */}
            <button type="submit" className="ur-submit-btn" disabled={isLoading || !isFormValid}>
              {isLoading ? 'Creating account...' : (
                <>
                  Create Account <span className="ur-btn-arrow">&rarr;</span>
                </>
              )}
            </button>

            {/* Divider + Social */}
            <div className="ur-divider">OR CONTINUE WITH</div>
            <div className="ur-social-grid">
              <button type="button" className="ur-social-btn" onClick={() => navigate('/user/welcome')}>
                <GoogleIcon size={18} /> Google
              </button>
              <button type="button" className="ur-social-btn" onClick={() => navigate('/user/welcome')}>
                <svg width="18" height="18" viewBox="0 0 384 512" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                  />
                </svg>
                Apple
              </button>
            </div>

            {/* Privacy info */}
            <div className="ur-privacy-box">
              <span className="ur-privacy-icon">
                <Lock size={18} />
              </span>
              <span className="ur-privacy-text">
                Your contact details remain confidential until you confirm a verified match.
              </span>
            </div>
          </form>

          {/* Footer */}
          <p className="ur-footer">
            Already have an account?{' '}
            <button type="button" className="ur-footer-btn" onClick={() => navigate('/user/login')}>
              Log in
            </button>
          </p>
        </main>
      </div>
    </div>
  );
}