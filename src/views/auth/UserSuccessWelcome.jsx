import { useNavigate } from 'react-router-dom';
import { Compass, HeartHandshake, Radar, Sparkles } from 'lucide-react';
import finditLogo from '../../assets/logo-light.png';
import onboarding4 from '../../assets/onboarding-4.png';
import './UserSuccessWelcome.css';

/**
 * View Component: UserSuccessWelcome
 * Post-registration success screen for the FindIt! user portal.
 * Flow: "Go to Home" -> /user/dashboard, quick tour -> /user/onboarding.
 */
export default function UserSuccessWelcome() {
  const navigate = useNavigate();

  return (
    <div className="user-success-page">
      <div className="user-success-frame">
        <img src={finditLogo} alt="Find!t" className="logo-img" />
        {/* Top Badge */}
        <span className="usw-step-badge">STEP 4 OF 4 &bull; COMPLETE 🎉</span>

        {/* Mascot Illustration */}
        <div className="usw-mascot">
          <img
            src={onboarding4}
            alt="FindIt! welcome illustration"
            className="usw-mascot-img"
            draggable={false}
          />
        </div>

        {/* Center Badge */}
        <span className="usw-sync-badge">
          <span className="usw-sync-dot" />
          RADAR SYNC ACTIVE
        </span>

        {/* Heading */}
        <h1 className="usw-title">You're all set! 🎉</h1>
        <p className="usw-subtitle">
          Welcome to FindIt! — ready to recover, search, or reunite what matters most?
        </p>

        {/* Metric Card */}
        <div className="usw-metric-card">
          <span className="usw-metric-icon">
            <HeartHandshake size={24} />
          </span>
          <div>
            <div className="usw-metric-title">12,400+ Reunited THIS MONTH</div>
            <div className="usw-metric-sub">Powered by a 99% honest community recovery</div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="usw-features">
          <span className="usw-feature-badge">
            <Sparkles size={15} /> Smart Visual Match
          </span>
          <span className="usw-feature-badge">
            <Radar size={15} /> Real-Time Radar
          </span>
        </div>

        {/* Actions */}
        <button type="button" className="usw-primary-btn" onClick={() => navigate('/user/dashboard')}>
          Go to Home <span className="usw-btn-arrow">&rarr;</span>
        </button>
        <button type="button" className="usw-secondary-btn" onClick={() => navigate('/user/onboarding')}>
          <Compass size={16} />
          Take a 30-sec quick tour
        </button>
      </div>
    </div>
  );
}