import { useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { getToken } from './services/ApiService';
import { getToken as getUserToken } from './services/api';
import AuthController from './controllers/AuthController';

import AdminLoginView from './views/auth/AdminLoginView';
import AdminDashboardView from './views/dashboard/AdminDashboardView';
import MatchReviewView from './views/match-review/MatchReviewView';
import AllReportsView from './views/reports/AllReportsView';
import ManageAdminsView from './views/admin-management/ManageAdminsView';
import OperationalReportsView from './views/reports/OperationalReportsView';
import NewLostReportView from './views/reports/NewLostReportView';

import UserLogin from './views/auth/UserLogin';
import UserRegister from './views/auth/UserRegister';
import UserSuccessWelcome from './views/auth/UserSuccessWelcome';
import UserOnboarding from './views/auth/UserOnboarding';

import UserSurveyLanding from './views/user/UserSurveyLanding';
import UserReportForm from './views/user/UserReportForm';
import UserReportConfirmation from './views/user/UserReportConfirmation';
import UserThanksScreen from './views/user/UserSuccessWelcome';
import UserDashboard from './views/dashboard/UserDashboard';

/**
 * Root Application Component.
 *
 * Routing (React Router) — Admin Portal kini URL-driven (bukan lagi state-driven),
 * sehingga back/forward/refresh selalu membuka halaman yang benar:
 *   - `/user/*`              -> portal tamu (halaman mandiri, tanpa Admin Layout)
 *   - `/admin`               -> Dashboard
 *   - `/admin/login`         -> Admin Login (gate: tanpa token)
 *   - `/admin/verifikasi`    -> MatchReviewView (Master-Detail Hub & Handover)
 *   - `/admin/barang-temuan` -> AllReportsView (Log Barang Temuan)
 *   - `/admin/laporan`       -> OperationalReportsView (arsip laporan)
 *   - `/admin/laporan/baru`  -> NewLostReportView (form laporan full-page,
 *                                reuse ReportLostForm)
 *   - `/admin/kelola-admin`  -> ManageAdminsView
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---- User Portal (standalone pages, no admin layout) ---- */}
        <Route path="/" element={<Navigate to="/user/login" replace />} />
        <Route path="/user" element={<Navigate to="/user/login" replace />} />
        <Route
          path="/user/login"
          element={
            <RedirectIfUserAuthed>
              <UserLogin />
            </RedirectIfUserAuthed>
          }
        />
        <Route
          path="/user/register"
          element={
            <RedirectIfUserAuthed>
              <UserRegister />
            </RedirectIfUserAuthed>
          }
        />
        <Route path="/user/welcome" element={<UserSuccessWelcome />} />
        <Route path="/user/onboarding" element={<UserOnboarding />} />
        <Route
          path="/user/dashboard"
          element={
            <RequireUserAuth>
              <UserDashboard />
            </RequireUserAuth>
          }
        />
        <Route
          path="/user/survey"
          element={
            <RequireUserAuth>
              <UserSurveyLanding />
            </RequireUserAuth>
          }
        />
        <Route
          path="/user/report-form"
          element={
            <RequireUserAuth>
              <UserReportForm />
            </RequireUserAuth>
          }
        />
        <Route
          path="/user/confirmation"
          element={
            <RequireUserAuth>
              <UserReportConfirmation />
            </RequireUserAuth>
          }
        />
        <Route
          path="/user/thanks"
          element={
            <RequireUserAuth>
              <UserThanksScreen />
            </RequireUserAuth>
          }
        />

        {/* ---- Admin Portal (explicit URL-driven routes) ---- */}
        <Route path="/admin" element={<AdminShell />} />
        <Route path="/admin/*" element={<AdminShell />} />
        <Route path="/admin/login" element={<AdminShell />} />
        <Route path="*" element={<AdminShell />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Guard route User Portal: tanpa sesi user yang sah -> redirect ke login.
 * Sesi user disimpan via services/api (findit_admin_token / findit_admin_user).
 */
function RequireUserAuth({ children }) {
  if (!getUserToken()) {
    return <Navigate to="/user/login" replace />;
  }
  return children;
}

/**
 * Guard route for /user/login & /user/register: tamu yang sudah punya
 * sesi sah langsung diarahkan ke /user/dashboard (bukan form login lagi
 * dan BUKAN ke /user/survey).
 */
function RedirectIfUserAuthed({ children }) {
  if (getUserToken()) {
    return <Navigate to="/user/dashboard" replace />;
  }
  return children;
}

/**
 * Resolve id navigasi lama (label string) -> path URL baru.
 * Ini menjaga onNavChange dari Sidebar/TopNavbar/aksi tombol tetap bekerja.
 */
function resolveNavPath(navId) {
  if (navId === 'Dashboard') return '/admin';
  if (
    navId === 'Verifikasi' ||
    navId === 'Klaim & Serah Terima' ||
    navId === 'Tiket Klaim' ||
    navId === 'Tiket Klaim Tamu' ||
    navId === 'claim-tickets' ||
    navId === 'Verifikasi & Serah Terima' ||
    navId === 'Verifikasi & Pencocokan' ||
    navId === 'Match Review' ||
    navId === 'match-review' ||
    navId === 'Handover' ||
    navId === 'handover' ||
    navId === 'verification'
  ) {
    return '/admin/verifikasi';
  }
  if (
    navId === 'Buat Laporan' ||
    navId === 'Buat Laporan Tamu' ||
    navId === 'new-claim'
  ) {
    return '/admin/laporan/baru';
  }
  if (navId === 'Barang Temuan' || navId === 'All Reports' || navId === 'all-reports') {
    return '/admin/barang-temuan';
  }
  if (
    navId === 'Laporan' ||
    navId === 'reports' ||
    navId === 'laporan' ||
    navId === 'Follow-up Checkout' ||
    navId === 'Survei Pasca-Checkout' ||
    navId === 'survei-checkout'
  ) {
    return '/admin/laporan';
  }
  if (
    navId === 'Kelola Admin' ||
    navId === 'admin-management' ||
    navId === 'Admin Management'
  ) {
    return '/admin/kelola-admin';
  }
  if (navId === 'login') return '/admin/login';
  return '/admin';
}

/**
 * Admin Portal shell (URL-driven).
 * Melakukan gate autentikasi lalu me-render view sesuai path yang aktif.
 */
function AdminShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const token = getToken();

  const segments = location.pathname.replace(/^\/admin/, '').split('/').filter(Boolean);
  const current = (segments[0] || '').toLowerCase();
  const sub = (segments[1] || '').toLowerCase();

  const handleLogout = () => {
    AuthController.logout();
    navigate('/admin/login', { replace: true });
  };

  const handleLoginSuccess = () => {
    navigate('/admin', { replace: true });
  };

  const handleNavChange = (navId, payload = null) => {
    if (payload?.matchId) {
      setSelectedMatchId(payload.matchId);
    }
    navigate(resolveNavPath(navId));
  };

  // Gate autentikasi: tanpa token, semua halaman admin -> login.
  if (!token) {
    if (current === 'login') {
      return (
        <div className="app-root-container">
          <AdminLoginView onLoginSuccess={handleLoginSuccess} />
        </div>
      );
    }
    return <Navigate to="/admin/login" replace />;
  }

  let content;
  if (current === '' || current === 'dashboard') {
    content = <AdminDashboardView onLogout={handleLogout} onNavChange={handleNavChange} />;
  } else if (current === 'login') {
    content = <Navigate to="/admin" replace />;
  } else if (current === 'verifikasi') {
    content = (
      <MatchReviewView
        activeNav="Verifikasi"
        onNavChange={handleNavChange}
        onLogout={handleLogout}
        selectedMatchId={selectedMatchId}
      />
    );
  } else if (current === 'barang-temuan') {
    content = (
      <AllReportsView
        activeNav="Barang Temuan"
        onNavChange={handleNavChange}
        onLogout={handleLogout}
      />
    );
  } else if (current === 'laporan') {
    content =
      sub === 'baru' ? (
        <NewLostReportView onNavChange={handleNavChange} onLogout={handleLogout} />
      ) : (
        <OperationalReportsView
          activeNav="Laporan"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      );
  } else if (current === 'kelola-admin') {
    content = (
      <ManageAdminsView
        activeNav="Kelola Admin"
        onNavChange={handleNavChange}
        onLogout={handleLogout}
      />
    );
  } else {
    content = <Navigate to="/admin" replace />;
  }

  return <div className="app-root-container">{content}</div>;
}

export default App;