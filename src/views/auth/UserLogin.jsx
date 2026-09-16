import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Check, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import finditLogo from '../../assets/logo-light.png';
import { apiPost, ApiError, setSession } from '../../services/api';
import './UserLogin.css';

/**
 * View Component: UserLogin
 * Login berbasis kredensial (Email + Kata Sandi) ke backend (POST /login).
 * Sukses -> setSession(token, user) -> /user/survey.
 * "Daftar Akun" -> /user/register.
 */
export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const registeredEmail = location.state?.registeredEmail || window.sessionStorage.getItem('findit-registered-email') || '';
  const [email, setEmail] = useState(registeredEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.registered ? 'Akun berhasil dibuat! Silakan masuk.' : null
  );

  const isEmailValid = email.includes('@') && email.includes('.');
  const isFormValid = isEmailValid && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      const result = await apiPost('/login', {
        Email: email.trim().toLowerCase(),
        Password: password,
      });
      if (result?.status === 'success' && result?.data?.token) {
        window.sessionStorage.removeItem('findit-registered-email');
        setSession(result.data.token, result.data.user);
        navigate('/user/survey');
        return;
      }
      setErrorMessage(result?.message || 'Login gagal. Silakan coba lagi.');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setErrorMessage('Email atau password salah. Periksa kembali kredensial Anda.');
        } else if (err.status === 400) {
          setErrorMessage('Email dan password wajib diisi.');
        } else {
          setErrorMessage(err.message || 'Login gagal. Silakan coba lagi.');
        }
      } else {
        setErrorMessage('Terjadi kesalahan jaringan. Periksa koneksi Anda dan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
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
            {/* Alert Error */}
            {errorMessage && (
              <div className="ul-alert ul-alert-error" role="alert">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Alert Sukses (baru saja register) */}
            {successMessage && (
              <div className="ul-alert ul-alert-success" role="status">
                <Check size={16} />
                <span>{successMessage}</span>
              </div>
            )}

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