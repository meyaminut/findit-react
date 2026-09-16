import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AdminLoginView from './views/auth/AdminLoginView';
import AdminDashboardView from './views/dashboard/AdminDashboardView';
import MatchReviewView from './views/match-review/MatchReviewView';
import HandoverView from './views/handover/HandoverView';
import AllReportsView from './views/reports/AllReportsView';
import NewClaimTicketView from './views/claim-ticket/NewClaimTicketView';
import PostCheckoutSurveyView from './views/survey/PostCheckoutSurveyView';
import ClaimTicketsListView from './views/claim-tickets/ClaimTicketsListView';

import UserOnboarding from './views/auth/UserOnboarding';
import UserLogin from './views/auth/UserLogin';
import UserRegister from './views/auth/UserRegister';
import UserSuccessWelcome from './views/auth/UserSuccessWelcome';
import UserDashboard from './views/dashboard/UserDashboard';

import UserSurveyLanding from './views/user/UserSurveyLanding';
import UserReportForm from './views/user/UserReportForm';
import UserReportConfirmation from './views/user/UserReportConfirmation';
import UserThanksScreen from './views/user/UserSuccessWelcome';

/**
 * Root Application Component.
 *
 * Routing (React Router):
 * - `/user` | `/user/onboarding` -> UserOnboarding (halaman pertama user)
 * - `/user/login`                -> UserLogin
 * - `/user/register`             -> UserRegister
 * - `/user/welcome`              -> UserSuccessWelcome
 * - `/user/welcome`              -> UserSuccessWelcome
 * - `/user/dashboard`            -> UserDashboard (tanpa Admin Layout)
 * - `/user/survey`               -> UserSurveyLanding
 * - `/user/report-form`          -> UserReportForm
 * - `/user/confirmation`         -> UserReportConfirmation
 * - `/user/thanks`               -> UserSuccessWelcome (Thank You, views/user)
 * - semua path lain              -> AdminShell (state-driven, existing behavior)
 *
 * Route user dirender mandiri, TIDAK dibungkus Admin Layout/Sidebar.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---- User Portal (standalone pages, no admin layout) ---- */}
        <Route path="/user" element={<UserOnboarding />} />
        <Route path="/user/onboarding" element={<UserOnboarding />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/welcome" element={<UserSuccessWelcome />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/survey" element={<UserSurveyLanding />} />
        <Route path="/user/report-form" element={<UserReportForm />} />
        <Route path="/user/confirmation" element={<UserReportConfirmation />} />
        <Route path="/user/thanks" element={<UserThanksScreen />} />

        {/* ---- Admin Portal (state-driven, existing behavior) ---- */}
        <Route path="*" element={<AdminShell />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Admin Portal shell. Kept state-driven to avoid breaking the existing
 * admin flow (login -> dashboard -> claim-tickets -> ...).
 */
function AdminShell() {
  // Default route to 'claim-tickets' to inspect the newly created admin view
  const [activeRoute, setActiveRoute] = useState('claim-tickets');

  const handleLogout = () => {
    setActiveRoute('login');
  };

  const handleLoginSuccess = () => {
    setActiveRoute('dashboard');
  };

  const handleNavChange = (navId) => {
    if (navId === 'Dashboard') {
      setActiveRoute('dashboard');
    } else if (navId === 'Tiket Klaim' || navId === 'claim-tickets') {
      setActiveRoute('claim-tickets');
    } else if (navId === 'Buat Laporan Tamu') {
      setActiveRoute('new-claim');
    } else if (navId === 'Verifikasi & Pencocokan' || navId === 'Match Review') {
      setActiveRoute('match-review');
    } else if (navId === 'Handover') {
      setActiveRoute('handover');
    } else if (navId === 'Barang Temuan' || navId === 'All Reports') {
      setActiveRoute('all-reports');
    } else if (navId === 'Survei Pasca-Checkout' || navId === 'survei-checkout') {
      setActiveRoute('survei-checkout');
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
          onLogout={handleLogout}
          onNavChange={handleNavChange}
        />
      )}

      {activeRoute === 'new-claim' && (
        <NewClaimTicketView
          onLogout={handleLogout}
          onNavChange={handleNavChange}
        />
      )}

      {activeRoute === 'match-review' && (
        <MatchReviewView
          activeNav="Verifikasi & Pencocokan"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
          onProceedToHandover={() => setActiveRoute('handover')}
        />
      )}

      {activeRoute === 'handover' && (
        <HandoverView
          activeNav="Handover"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      )}

      {activeRoute === 'all-reports' && (
        <AllReportsView
          activeNav="Barang Temuan"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      )}

      {activeRoute === 'survei-checkout' && (
        <PostCheckoutSurveyView
          activeNav="Survei Pasca-Checkout"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      )}

      {activeRoute === 'claim-tickets' && (
        <ClaimTicketsListView
          activeNav="Tiket Klaim"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;