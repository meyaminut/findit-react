import { useState } from 'react';
import { ClaimTicketController } from './ClaimTicketController';

/**
 * Controller Hook: useClaimTicketController
 * Manages form state, loyalty tiers, confidential verification details,
 * and auto-match preview for "6. Buat Laporan Tamu".
 */
export function useClaimTicketController() {
  const [formData, setFormData] = useState(() => ClaimTicketController.getInitialClaim());
  const [categories] = useState(() => ClaimTicketController.getCategories());
  const [quickLocations] = useState(() => ClaimTicketController.getQuickLocations());
  const [autoMatchCandidate] = useState(() => ClaimTicketController.getAutoMatch());

  const [isMatchPreviewOpen, setIsMatchPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 4000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      category
    }));
  };

  const handleLoyaltyChange = (loyaltyTier) => {
    setFormData((prev) => ({
      ...prev,
      loyaltyTier
    }));
  };

  const handleQuickLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      lostLocation: prev.lostLocation ? `${prev.lostLocation}, dekat ${location}` : location
    }));
  };

  const handleResetForm = () => {
    setFormData({
      ticketNumber: '#CLM-2024-0093',
      guestName: '',
      phoneNumber: '',
      email: '',
      roomNumber: 'Kamar 314 - Deluxe King (Lantai 3)',
      checkoutDate: '',
      loyaltyTier: 'regular',
      category: 'electronics',
      brandAndModel: '',
      colorAndFeatures: '',
      lostLocation: '',
      secretProof: ''
    });
    showToast('Formulir berhasil direset.', 'info');
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const res = await ClaimTicketController.saveDraft(formData);
    setIsSubmitting(false);
    if (res.success) {
      showToast(res.message, 'success');
    }
  };

  const handleSubmit = async (e, onSuccess) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    const res = await ClaimTicketController.submitClaim(formData);
    setIsSubmitting(false);
    if (res.success) {
      showToast(res.message, 'success');
      if (onSuccess) onSuccess(res);
    }
  };

  return {
    formData,
    categories,
    quickLocations,
    autoMatchCandidate,
    isMatchPreviewOpen,
    setIsMatchPreviewOpen,
    isSubmitting,
    toastNotification,
    handleInputChange,
    handleCategoryChange,
    handleLoyaltyChange,
    handleQuickLocationSelect,
    handleResetForm,
    handleSaveDraft,
    handleSubmit
  };
}

export default useClaimTicketController;
