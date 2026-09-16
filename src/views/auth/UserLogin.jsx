import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import finditLogo from '../../assets/logo-light.png';
import './UserLogin.css';

/**
 * View Component: UserLogin
 * Login murni berbasis kredensial (Email/Username + Kata Sandi).
 * Flow: "Masuk" -> validasi sederhana -> /user/survey,
 *       "Daftar Akun" -> /user/register.
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
            <img src={finditLogo} alt="FindIt!" className="logo-img" />
            <p className="ul-header-subtitle">Pemulihan barang tertinggal untuk kenyamanan Anda.</p>
          </div>
        </header>

        {/* Form Card */}
        <main className="ul-form-card">
          <div className="ul-heading-wrap">
            <h1 className="ul-heading">Selamat Datang Kembali</h1>
            <p className="ul-heading-sub">Masuk untuk mengelola laporan dan notifikasi barang Anda.</p>
          </div>

          <form className="ul-form" onSubmit={handleSubmit}>
            {/* Email / Username */}
            <div className="ul-field">
              <label htmlFor="ul-email" className="ul-label">
                EMAIL ATAU USERNAME
              </label>
              <div className="ul-input-wrap">
                <span className={`ul-input-icon ${isEmailValid ? 'valid' : ''}`}>
                  <Mail size={18} />
                </span>
                <input
                  id="ul-email"
                  type="email"
                  className="ul-input"
                  placeholder="Masukkan email atau username"
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
                KATA SANDI
              </label>
              <div className="ul-input-wrap">
                <span className="ul-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="ul-password"
                  type={showPassword ? 'text' : 'password'}
                  className="ul-input"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="ul-show-btn"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="ul-submit-btn" disabled={isLoading || !isFormValid}>
              {isLoading ? 'Memproses...' : (
                <>
                  Masuk <span className="ul-btn-arrow">&rarr;</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="ul-footer">
            Belum punya akun?{' '}
            <button type="button" className="ul-footer-btn" onClick={() => navigate('/user/register')}>
              Daftar Akun
            </button>
          </p>
        </main>
      </div>
    </div>
  );
}