import React, { useState } from 'react';
import Sidebar from '../dashboard/components/Sidebar';
import TopNavbar from '../dashboard/components/TopNavbar';
import SurveyProtocolBanner from './components/SurveyProtocolBanner';
import SurveyKpiCards from './components/SurveyKpiCards';
import IncomingSurveyCards from './components/IncomingSurveyCards';
import CheckoutTable from './components/CheckoutTable';
import SurveyModals from './components/SurveyModals';
import usePostCheckoutSurveyController from '../../controllers/usePostCheckoutSurveyController';
import './PostCheckoutSurveyView.css';

/**
 * View Component: PostCheckoutSurveyView (Screen 10)
 * Modularized, clean architecture for post-checkout guest communication.
 */
export function PostCheckoutSurveyView({
  activeNav = 'Follow-up Checkout',
  onNavChange,
  onLogout
}) {
  const {
    metrics,
    incomingResponses,
    guests,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    isChatModalOpen,
    setIsChatModalOpen,
    activeChatGuest,
    toastNotification,
    handleSendMassSurveys,
    handleSendSingleEmail,
    handleSendSingleWhatsApp,
    handleOpenChatRoom
  } = usePostCheckoutSurveyController();

  const [searchQuery, setSearchQuery] = useState('');

  const handleReviewMatch = () => {
    if (onNavChange) {
      onNavChange('Verifikasi & Serah Terima');
    }
  };

  return (
    <div className="survey-app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={onNavChange}
        onLogout={onLogout}
      />

      {/* 2. Main Viewport */}
      <div className="survey-main-viewport">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="survey-scrollable-content">
          {/* Protocol Banner */}
          <SurveyProtocolBanner impactPercentage={metrics.resolutionImpact} />

          {/* 4 KPI Cards */}
          <SurveyKpiCards
            checkoutsToday={metrics.checkoutsToday}
            surveysSent={metrics.surveysSent}
            positiveResponses={metrics.positiveResponses}
            avgResponseTime={metrics.avgResponseTime}
          />

          {/* Incoming Responses */}
          <IncomingSurveyCards
            responses={incomingResponses}
            onReviewMatch={handleReviewMatch}
          />

          {/* Checkout Guests Table */}
          <CheckoutTable
            guests={guests}
            onSendMassSurveys={handleSendMassSurveys}
            onSendSingleEmail={handleSendSingleEmail}
            onSendSingleWhatsApp={handleSendSingleWhatsApp}
            onOpenChatRoom={handleOpenChatRoom}
          />
        </main>
      </div>

      {/* Modals */}
      <SurveyModals
        isTemplateOpen={isTemplateModalOpen}
        onCloseTemplate={() => setIsTemplateModalOpen(false)}
        isChatOpen={isChatModalOpen}
        onCloseChat={() => setIsChatModalOpen(false)}
        activeGuest={activeChatGuest}
      />
    </div>
  );
}

export default PostCheckoutSurveyView;
