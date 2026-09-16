import { useState, useEffect, useCallback } from 'react';
import { 
  PostCheckoutSurveyModel,
  hospitalityInsights 
} from '../models/PostCheckoutSurveyModel';
import { StorageService } from '../services/StorageService';

/**
 * Controller: usePostCheckoutSurveyController
 * Manages state and dispatch interactions for Screen 10: Survei Pasca-Checkout.
 * Follows strict MVC separation of concerns, reading from and persisting to StorageService.
 */
export function usePostCheckoutSurveyController() {
  const [metrics, setMetrics] = useState(() => PostCheckoutSurveyModel.getKpiMetrics());
  const [incomingResponses, setIncomingResponses] = useState(() => PostCheckoutSurveyModel.getIncomingSurveyResponses());
  const [guests, setGuests] = useState(() => PostCheckoutSurveyModel.getCheckoutGuestsList());
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatGuest, setActiveChatGuest] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState('12:45 WIB');

  const refreshData = useCallback(() => {
    setGuests(PostCheckoutSurveyModel.getCheckoutGuestsList());
    setIncomingResponses(PostCheckoutSurveyModel.getIncomingSurveyResponses());
    setMetrics(PostCheckoutSurveyModel.getKpiMetrics());
  }, []);

  useEffect(() => {
    const handleUpdate = () => refreshData();
    window.addEventListener('findit_survey_updated', handleUpdate);
    return () => window.removeEventListener('findit_survey_updated', handleUpdate);
  }, [refreshData]);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleSendMassSurveys = () => {
    const updated = guests.map((g) => {
      if (g.status === 'unseen') {
        return {
          ...g,
          status: 'sent-email',
          statusLabel: 'Terkirim via WA & Email',
          sentBadge: 'Terkirim Baru Saja'
        };
      }
      return g;
    });

    setGuests(updated);
    StorageService.saveSurveyGuests(updated);

    setMetrics((prev) => ({
      ...prev,
      surveysSent: prev.surveysSent + 2
    }));

    showToast('Survei proaktif massal berhasil dikirim ke seluruh tamu baru check-out via WhatsApp & Email!');
  };

  const handleSendSingleEmail = (guest) => {
    const updated = guests.map((g) => {
      if (g.id === guest.id) {
        return {
          ...g,
          status: 'sent-email',
          statusLabel: 'Terkirim via Email',
          sentBadge: 'Email Terkirim'
        };
      }
      return g;
    });
    setGuests(updated);
    StorageService.saveSurveyGuests(updated);
    showToast(`Survei pengingat dikirim ke email ${guest.email || guest.name}!`);
  };

  const handleSendSingleWhatsApp = (guest) => {
    const updated = guests.map((g) => {
      if (g.id === guest.id) {
        return {
          ...g,
          status: 'sent-wa',
          statusLabel: 'Terkirim via WhatsApp',
          sentBadge: 'WA Terkirim'
        };
      }
      return g;
    });
    setGuests(updated);
    StorageService.saveSurveyGuests(updated);
    showToast(`Pesan proaktif WhatsApp terkirim ke ${guest.phone || guest.name}!`);
  };

  const handleOpenChatRoom = (guest) => {
    setActiveChatGuest(guest);
    setIsChatModalOpen(true);
  };

  const handleSyncPMS = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
    setLastSyncTime(timeStr);
    refreshData();
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
