import { useState } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import { getToken } from './services/ApiService';
import { getToken as getUserToken } from './services/api';
import AuthController from './controllers/AuthController';

import AdminLoginView from './views/auth/AdminLoginView';
import AdminDashboardView from './views/dashboard/AdminDashboardView';
import MatchReviewView from './views/match-review/MatchReviewView';
import AllReportsView from './views/reports/AllReportsView';
import NewClaimTicketView from './views/claim-ticket/NewClaimTicketView';
import ManageAdminsView from './views/admin-management/ManageAdminsView';
import OperationalReportsView from './views/reports/OperationalReportsView';

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
 * Routing (React Router):
 * - `/` | `/user` -> redirect ke /user/login
 * - `/user/onboarding`         -> UserOnboarding (tour pre-login, diakhiri ke /user/login)
 * - `/user/login`              -> UserLogin
 * - `/user/register`           -> UserRegister
 * - `/user/welcome`            -> UserSuccessWelcome
 * - `/user/dashboard`          -> UserDashboard (tanpa Admin Layout, BUTUH login)
 * - `/user/survey`             -> UserSurveyLanding (BUTUH login)
 * - `/user/report-form`        -> UserReportForm (BUTUH login)
 * - `/user/confirmation`       -> UserReportConfirmation (BUTUH login)
 * - `/user/thanks`             -> UserSuccessWelcome (Thank You, views/user, BUTUH login)
 * - `/admin/login`             -> AdminShell (state 'login' bila tanpa token; sukses -> /admin/dashboard)
 * - `/admin/dashboard`         -> AdminDashboardView (via AdminShell, route eksplisit)
 * - `/admin/*` & semua path lain -> AdminShell (state-driven, operations console)
 *
 * Route user dirender mandiri, TIDAK dibungkus Admin Layout/Sidebar.
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

        {/* ---- Admin Portal (state-driven, operations console) ---- */}
        <Route path="/admin/login" element={<AdminLoginRoute />} />
        <Route path="/admin/dashboard" element={<AdminShell initialRoute="dashboard" />} />
        <Route path="/admin" element={<AdminShell />} />
        <Route path="/admin/*" element={<AdminShell />} />
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
 * Route /admin/login: admin yang sudah login langsung diarahkan ke
 * /admin/dashboard; yang belum login melihat screen login (via AdminShell),
 * lalu setelah sukses login AdminShell redirect ke /admin/dashboard.
 */
function AdminLoginRoute() {
  if (getToken()) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <AdminShell />;
}

/**
 * Admin Portal shell.
 * Controls active view routing across MVC Views:
 * - 'login' (Admin Login Screen)
 * - 'dashboard' (5. Admin Dashboard / Control Console)
 * - 'new-claim' (6. Buat Laporan Tamu / New Claim Ticket)
 * - 'verification' (7 & 8. Klaim & Serah Terima - Master Detail Hub & Handover Drawer)
 * - 'all-reports' (9. Barang Temuan / Log Barang Temuan Master Inventory)
 * - 'reports' (10. Laporan Operasional & Audit Resmi)
 * - 'admin-management' (11. Kelola Admin / Admin Management Console)
 */
function AdminShell({ initialRoute }) {
  const navigate = useNavigate();
  // Gate: akses /admin tanpa token sah -> tampilkan halaman login dulu.
  const [activeRoute, setActiveRoute] = useState(() => {
    if (!getToken()) return 'login';
    return initialRoute || 'dashboard';
  });
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  // Dipakai sebagai `key` view agar state dashboard ter-reset saat navigasi.
  const [routeKey, setRouteKey] = useState(0);

  const handleLogout = () => {
    AuthController.logout();
    setActiveRoute('login');
    setSelectedMatchId(null);
    setRouteKey((prev) => prev + 1);
    navigate('/admin/login', { replace: true });
  };

  const handleLoginSuccess = () => {
    setActiveRoute('dashboard');
    navigate('/admin/dashboard', { replace: true });
    setRouteKey((prev) => prev + 1);
  };

  const handleNavChange = (navId, payload = null) => {
    if (payload?.matchId) {
      setSelectedMatchId(payload.matchId);
    }
    if (navId === 'Dashboard') {
      setSelectedMatchId(null);
      setActiveRoute('dashboard');
      navigate('/admin/dashboard', { replace: true });
      setRouteKey((prev) => prev + 1);
    } else if (
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
      if (payload) {
        setSelectedMatchId(typeof payload === 'string' ? payload : payload.matchId || null);
      }
      setActiveRoute('verification');
    } else if (navId === 'Buat Laporan Tamu' || navId === 'new-claim') {
      setActiveRoute('new-claim');
    } else if (navId === 'Barang Temuan' || navId === 'All Reports' || navId === 'all-reports') {
      setActiveRoute('all-reports');
    } else if (
      navId === 'Laporan' ||
      navId === 'reports' ||
      navId === 'laporan' ||
      navId === 'Follow-up Checkout' ||
      navId === 'Survei Pasca-Checkout' || 
      navId === 'survei-checkout'
    ) {
      setActiveRoute('reports');
    } else if (
      navId === 'Kelola Admin' ||
      navId === 'admin-management' ||
      navId === 'Admin Management'
    ) {
      setActiveRoute('admin-management');
    } else {
      setActiveRoute('dashboard');
    }
  };

  return (
    <div className="app-root-container">
      {activeRoute === 'login' && (
        <AdminLoginView onLoginSuccess={handleLoginSuccess} />
      )}

      {activeRoute === 'dashboard' && (
        <AdminDashboardView
          key={routeKey}
          onLogout={handleLogout}
          onNavChange={handleNavChange}
        />
      )}

      {activeRoute === 'new-claim' && (
        <NewClaimTicketView
          activeNav="Verifikasi"
          onLogout={handleLogout}
          onNavChange={handleNavChange}
        />
      )}

      {activeRoute === 'verification' && (
        <MatchReviewView
          activeNav="Verifikasi"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
          selectedMatchId={selectedMatchId}
        />
      )}

      {activeRoute === 'all-reports' && (
        <AllReportsView
          activeNav="Barang Temuan"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      )}

      {activeRoute === 'reports' && (
        <OperationalReportsView
          activeNav="Laporan"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      )}

      {activeRoute === 'admin-management' && (
        <ManageAdminsView
          activeNav="Kelola Admin"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;