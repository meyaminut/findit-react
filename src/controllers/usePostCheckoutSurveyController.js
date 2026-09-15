import { useState } from 'react';
import { 
  surveyKpiMetrics, 
  incomingSurveyResponses, 
  checkoutGuestsList, 
  hospitalityInsights 
} from '../models/PostCheckoutSurveyModel';

/**
 * Controller: usePostCheckoutSurveyController
 * Manages state and dispatch interactions for Screen 10: Survei Pasca-Checkout.
 * Follows strict MVC separation of concerns.
 */
export function usePostCheckoutSurveyController() {
  const [metrics, setMetrics] = useState(surveyKpiMetrics);
  const [incomingResponses, setIncomingResponses] = useState(incomingSurveyResponses);
  const [guests, setGuests] = useState(checkoutGuestsList);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatGuest, setActiveChatGuest] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState('12:45 WIB');

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleSendMassSurveys = () => {
    setGuests(prev => prev.map(g => {
      if (g.status === 'unseen') {
        return {
          ...g,
          status: 'sent-email',
          statusLabel: 'Terkirim via WA & Email',
          sentBadge: 'Terkirim Baru Saja'
        };
      }
      return g;
    }));

    setMetrics(prev => ({
      ...prev,
      surveysSent: prev.surveysSent + 2
    }));

    showToast('Survei proaktif massal berhasil dikirim ke seluruh tamu baru check-out via WhatsApp & Email!');
  };

  const handleSendSingleEmail = (guest) => {
    setGuests(prev => prev.map(g => {
      if (g.id === guest.id) {
        return {
          ...g,
          status: 'sent-email',
          statusLabel: 'Terkirim via Email',
          sentBadge: 'Email Terkirim'
        };
      }
      return g;
    }));
    showToast(`Survei pengingat dikirim ke email ${guest.email}!`);
  };

  const handleSendSingleWhatsApp = (guest) => {
    setGuests(prev => prev.map(g => {
      if (g.id === guest.id) {
        return {
          ...g,
          status: 'sent-wa',
          statusLabel: 'Terkirim via WhatsApp',
          sentBadge: 'WA Terkirim'
        };
      }
      return g;
    }));
    showToast(`Pesan proaktif WhatsApp terkirim ke ${guest.phone}!`);
  };

  const handleOpenChatRoom = (guest) => {
    setActiveChatGuest(guest);
    setIsChatModalOpen(true);
  };

  const handleSyncPMS = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
    setLastSyncTime(timeStr);
    showToast(`Sinkronisasi Opera Cloud berhasil diperbarui pada ${timeStr}!`);
  };

  return {
    metrics,
    incomingResponses,
    guests,
    insights: hospitalityInsights,
    lastSyncTime,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    isChatModalOpen,
    setIsChatModalOpen,
    activeChatGuest,
    toastNotification,
    handleSendMassSurveys,
    handleSendSingleEmail,
    handleSendSingleWhatsApp,
    handleOpenChatRoom,
    handleSyncPMS,
    showToast
  };
}

export default usePostCheckoutSurveyController;
