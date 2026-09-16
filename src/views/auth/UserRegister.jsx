import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Check, Eye, EyeOff, Lock, Mail, Phone, RefreshCw, User } from 'lucide-react';
import finditLogo from '../../assets/logo-light.png';
import { apiPost, ApiError } from '../../services/api';
import './UserRegister.css';

/**
 * View Component: UserRegister
 * Pendaftaran berbasis kredensial teks ke backend (POST /register).
 * Urutan field: Nama Lengkap, Email, No. Telepon/WhatsApp,
 * Kata Sandi, Konfirmasi Kata Sandi.
 * Flow: "Daftar Akun" -> /user/login (email ter-prefill),
 *       "Masuk" -> /user/login.
 */
export default function UserRegister() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isEmailValid = email.includes('@') && email.includes('.');
  const phoneDigits = phone.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 14;
  const isPasswordValid = password.length >= 8;
  const isConfirmValid = confirmPassword.length > 0 && confirmPassword === password;

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabel =
    passwordStrength >= 3 ? 'Kata sandi kuat' : passwordStrength === 2 ? 'Kata sandi baik' : 'Kata sandi lemah';

  const isFormValid =
    fullName.trim().length >= 2 &&
    isEmailValid &&
    isPhoneValid &&
    isPasswordValid &&
    isConfirmValid &&
    agreeTerms;

  const translateValidationError = (message) => {
    if (!message) return 'Registrasi gagal. Silakan coba lagi.';
    if (message.includes('registerInput.Name') || message.includes('Field validation for \'Name\'')) {
      return 'Nama lengkap wajib diisi.';
    }
    if (message.includes('registerInput.Email') || message.includes('Field validation for \'Email\'')) {
      return 'Format email tidak valid. Gunakan email yang benar.';
    }
    if (message.includes('registerInput.Password') || message.includes('Field validation for \'Password\'')) {
      return 'Kata sandi terlalu pendek. Minimal 8 karakter.';
    }
    if (message.includes('registerInput.Phone') || message.includes('Field validation for \'Phone\'')) {
      return 'Nomor telepon tidak valid.';
    }
    return message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const userData = {
        Name: fullName.trim(),
        Email: email.trim().toLowerCase(),
        Password: password,
        Phone: phoneDigits,
      };
      const result = await apiPost('/register', userData);
      if (result?.status === 'success') {
        // Backend register tidak mengembalikan token: arahkan ke login
        // dengan email ter-prefill supaya tamu langsung bisa masuk.
        window.sessionStorage.setItem('findit-registered-email', userData.Email);
        navigate('/user/login', { state: { registeredEmail: userData.Email, registered: true } });
        return;
      }
      setErrorMessage(result?.message || 'Registrasi gagal. Silakan coba lagi.');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setErrorMessage('Email sudah terdaftar. Silakan masuk atau gunakan email lain.');
        } else if (err.status === 400) {
          setErrorMessage(translateValidationError(err.message));
        } else {
          setErrorMessage(err.message || 'Registrasi gagal. Silakan coba lagi.');
        }
      } else {
        setErrorMessage('Terjadi kesalahan jaringan. Periksa koneksi Anda dan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-register-page">
      <div className="user-register-frame">
        {/* Header */}
        <header className="ur-header">
          <button type="button" className="back-btn" onClick={() => navigate('/user/login')} aria-label="Back">
            <ArrowLeft size={20} />
          </button>
          <div className="ur-header-inner">
            <span className="ur-step-badge">
              <span className="ur-step-dot" />
              PENDAFTARAN TAMU GRAND MELIÁ
            </span>
            <img src={finditLogo} alt="FindIt!" className="logo-img" />
            <p className="ur-header-subtitle">Daftar untuk melacak barang tertinggal Anda kapan saja.</p>
          </div>
        </header>

        {/* Form Card */}
        <main className="ur-form-card">
          <h1 className="ur-heading">Buat Akun Baru</h1>

          <form className="ur-form" onSubmit={handleSubmit}>
            {/* Alert Error */}
            {errorMessage && (
              <div className="ur-alert-error" role="alert">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Nama Lengkap */}
            <div className="ur-field">
              <label htmlFor="ur-name" className="ur-label">
                NAMA LENGKAP
              </label>
              <div className="ur-input-wrap">
                <span className={`ur-input-icon ${fullName.trim().length >= 2 ? 'valid' : ''}`}>
                  <User size={18} />
                </span>
                <input
                  id="ur-name"
                  type="text"
                  className="ur-input"
                  placeholder="Nama lengkap Anda"
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
                ALAMAT EMAIL
              </label>
              <div className="ur-input-wrap">
                <span className={`ur-input-icon ${isEmailValid ? 'valid' : ''}`}>
                  <Mail size={18} />
                </span>
                <input
                  id="ur-email"
                  type="email"
                  className="ur-input"
                  placeholder="nama@email.com"
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

            {/* Nomor Telepon / WhatsApp */}
            <div className="ur-field">
              <label htmlFor="ur-phone" className="ur-label">
                NOMOR WHATSAPP / TELEPON ACTIVE
              </label>
              <div className="ur-input-wrap">
                <span className={`ur-input-icon ${isPhoneValid ? 'valid' : ''}`}>
                  <Phone size={18} />
                </span>
                <input
                  id="ur-phone"
                  type="tel"
                  inputMode="numeric"
                  className="ur-input"
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                  autoComplete="tel"
                  required
                />
                {isPhoneValid && (
                  <span className="ur-input-icon valid">
                    <Check size={18} />
                  </span>
                )}
              </div>
            </div>

            {/* Kata Sandi */}
            <div className="ur-field">
              <label htmlFor="ur-password" className="ur-label">
                KATA SANDI
              </label>
              <div className="ur-input-wrap">
                <span className="ur-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="ur-password"
                  type={showPassword ? 'text' : 'password'}
                  className="ur-input"
                  placeholder="Buat kata sandi yang kuat"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="ur-show-btn"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
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
                    <span className="ur-strength-count">{password.length} karakter</span>
                  </span>
                </div>
              )}
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div className="ur-field">
              <label htmlFor="ur-confirm" className="ur-label">
                KONFIRMASI KATA SANDI
              </label>
              <div className="ur-input-wrap">
                <span className={`ur-input-icon ${isConfirmValid ? 'valid' : ''}`}>
                  <RefreshCw size={18} />
                </span>
                <input
                  id="ur-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="ur-input"
                  placeholder="Ulangi kata sandi Anda"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="ur-show-btn"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
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

            {/* Syarat & Ketentuan */}
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
                Saya menyetujui{' '}
                <button
                  type="button"
                  className="ur-terms-btn"
                  onClick={(e) => e.preventDefault()}
                >
                  Syarat &amp; Ketentuan
                </button>{' '}
                dan{' '}
                <button
                  type="button"
                  className="ur-terms-btn"
                  onClick={(e) => e.preventDefault()}
                >
                  Kebijakan Privasi
                </button>
                .
              </span>
            </label>

            {/* Submit */}
            <button type="submit" className="ur-submit-btn" disabled={isLoading || !isFormValid}>
              {isLoading ? 'Memproses...' : (
                <>
                  Daftar Akun <span className="ur-btn-arrow">&rarr;</span>
                </>
              )}
            </button>

            {/* Info privasi */}
            <div className="ur-privacy-box">
              <span className="ur-privacy-icon">
                <Lock size={18} />
              </span>
              <span className="ur-privacy-text">
                Data kontak Anda tetap rahasia hingga tercocokkan dengan barang yang hilang.
              </span>
            </div>
          </form>

          {/* Footer */}
          <p className="ur-footer">
            Sudah punya akun?{' '}
            <button type="button" className="ur-footer-btn" onClick={() => navigate('/user/login')}>
              Masuk
            </button>
          </p>
        </main>
      </div>
    </div>
  );
}