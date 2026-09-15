import React, { useState } from 'react';
import AdminLoginView from './views/auth/AdminLoginView';
import AdminDashboardView from './views/dashboard/AdminDashboardView';
import MatchReviewView from './views/match-review/MatchReviewView';
import HandoverView from './views/handover/HandoverView';
import AllReportsView from './views/reports/AllReportsView';
import NewClaimTicketView from './views/claim-ticket/NewClaimTicketView';
import PostCheckoutSurveyView from './views/survey/PostCheckoutSurveyView';
import ClaimTicketsListView from './views/claim-tickets/ClaimTicketsListView';

/**
 * Root Application Component
 * Controls active view routing across MVC Views:
 * - 'login' (Admin Login Screen)
 * - 'dashboard' (5. Admin Dashboard / Control Console)
 * - 'claim-tickets' (Daftar Tiket Klaim Tamu)
 * - 'new-claim' (6. Buat Laporan Tamu / New Claim Ticket)
 * - 'match-review' (7. Verifikasi & Pencocokan / Match Review)
 * - 'handover' (8. Handover Screen / Proses Handover & Penyelesaian)
 * - 'all-reports' (9. Barang Temuan / Log Barang Temuan Master Inventory)
 * - 'survei-checkout' (10. Survei Pasca-Checkout & Deteksi Proaktif)
 */
function App() {
  // Set default route to 'claim-tickets' to inspect the newly created view
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

