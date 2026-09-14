import React, { useState } from 'react';
import AdminLoginView from './views/auth/AdminLoginView';
import AdminDashboardView from './views/dashboard/AdminDashboardView';
import MatchReviewView from './views/match-review/MatchReviewView';

/**
 * Root Application Component
 * Controls active view routing across MVC Views:
 * - 'login' (Admin Login)
 * - 'dashboard' (Control & Dispatch Dashboard)
 * - 'match-review' (Algorithmic Correlation Pipeline)
 */
function App() {
  // Default to 'match-review' to display the requested Match Review screen
  const [activeRoute, setActiveRoute] = useState('match-review');

  const handleLogout = () => {
    setActiveRoute('login');
  };

  const handleLoginSuccess = () => {
    setActiveRoute('dashboard');
  };

  const handleNavChange = (navId) => {
    if (navId === 'Dashboard') {
      setActiveRoute('dashboard');
    } else if (navId === 'Match Review') {
      setActiveRoute('match-review');
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

      {activeRoute === 'match-review' && (
        <MatchReviewView
          activeNav="Match Review"
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
