import React from 'react';
import { Sparkles, SlidersHorizontal, Search } from 'lucide-react';
import useMatchReviewController from '../../controllers/useMatchReviewController';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import QueueSidebar from './components/QueueSidebar';
import ComparisonDetail from './components/ComparisonDetail';
import CorrelationBreakdown from './components/CorrelationBreakdown';
import MatchActionBar from './components/MatchActionBar';
import './MatchReviewView.css';

/**
 * View Component: MatchReviewView ("Algorithmic Correlation Pipeline")
 * Strict MVC View layer rendering the AI candidate comparison and verification workspace.
 */
export function MatchReviewView({ activeNav = 'Match Review', onNavChange, onLogout }) {
  const {
    candidates,
    totalCount,
    activeCandidate,
    selectedId,
    activeFilterTab,
    setActiveFilterTab,
    confidenceThreshold,
    setConfidenceThreshold,
    searchFilter,
    setSearchFilter,
    isLoading,
    toastMessage,
    handleSelectCandidate,
    handleConfirmMatch,
    handleRejectMatch,
    handleFlagInspection
  } = useMatchReviewController();

  return (
    <div className="dashboard-layout-container">
      {/* 1. Left Sidebar Navigation (Logo ONLY, No "Find!t Admin" text) */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Dashboard Area */}
      <div className="dashboard-main-area">
        {/* Global Top Navbar */}
        <TopNavbar
          searchQuery=""
          onSearchChange={() => {}}
        />

        {/* Match Review Workspace Body */}
        <main className="match-review-workspace">
          {/* Pipeline Header */}
          <div className="pipeline-header">
            <div className="pipeline-left-col">
              <div className="pipeline-eyebrow">
                <Sparkles size={14} className="pipeline-eyebrow-icon" />
                <span>ALGORITHMIC CORRELATION PIPELINE</span>
              </div>
              <h1 className="pipeline-title">Match Review</h1>
              <p className="pipeline-subtitle">
                Verify AI-suggested correlation between lost and found item reports.
              </p>
            </div>

            <div className="pipeline-status-col">
              <div className="pipeline-live-pill">
                <span className="live-dot-orange"></span>
                <span>Auto-Processing Active</span>
              </div>
              <span className="latency-metric">
                Engine latency: <strong>142ms</strong>
              </span>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="pipeline-filter-bar">
            {/* Filter Tabs */}
            <div className="filter-tabs-left">
              <button
                type="button"
                className={`review-tab-btn ${activeFilterTab === 'unreviewed' ? 'active' : ''}`}
                onClick={() => setActiveFilterTab('unreviewed')}
              >
                <span>Unreviewed</span>
                <span className="review-count-badge">5</span>
              </button>

              <button
                type="button"
                className={`review-tab-btn ${activeFilterTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilterTab('all')}
              >
                <span>All Matches</span>
                <span className="review-count-badge gray">34</span>
              </button>

              <button
                type="button"
                className={`review-tab-btn ${activeFilterTab === 'confirmed' ? 'active' : ''}`}
                onClick={() => setActiveFilterTab('confirmed')}
              >
                <span>Confirmed</span>
              </button>
            </div>

            {/* Filter Dropdown & Search Controls */}
            <div className="filter-controls-right">
              <select
                className="filter-confidence-select"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(e.target.value)}
              >
                <option value="80">Score &gt; 80% (High Confidence)</option>
                <option value="all">All Confidence Levels</option>
              </select>

              <div className="queue-search-box">
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Filter queue items..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>

              <button type="button" className="filter-tune-icon-btn" title="Filter tuning">
                <SlidersHorizontal size={15} />
              </button>
            </div>
          </div>

          {/* Main 2-Column Split Workspace */}
          <div className="match-review-2col-layout">
            {/* Left Column: Review Queue List */}
            <QueueSidebar
              candidates={candidates}
              selectedId={selectedId}
              onSelectCandidate={handleSelectCandidate}
            />

            {/* Right Column: Comparative Inspection & AI Telemetry */}
            <div className="review-detail-column">
              <ComparisonDetail candidate={activeCandidate} />

              <CorrelationBreakdown aiBreakdown={activeCandidate?.aiBreakdown} />

              <MatchActionBar
                onFlag={handleFlagInspection}
                onReject={handleRejectMatch}
                onConfirm={handleConfirmMatch}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Toast Notifications */}
      {toastMessage && (
        <div className="dashboard-toast-container">
          <div className="dashboard-toast">
            {toastMessage.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchReviewView;
