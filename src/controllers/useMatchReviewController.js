import { useState, useMemo } from 'react';
import { MatchReviewController } from './MatchReviewController';

/**
 * Controller Hook: useMatchReviewController
 * Manages reactive selection, filter queue, and review dispatching
 */
export function useMatchReviewController() {
  const [candidates, setCandidates] = useState(() => MatchReviewController.getCandidates());
  const [selectedId, setSelectedId] = useState('M-4091');
  const [activeFilterTab, setActiveFilterTab] = useState('unreviewed'); // 'unreviewed' | 'all' | 'confirmed'
  const [confidenceThreshold, setConfidenceThreshold] = useState('80'); // '> 80%' | 'all'
  const [searchFilter, setSearchFilter] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered list
  const filteredCandidates = useMemo(() => {
    return candidates.filter((item) => {
      // Threshold check
      if (confidenceThreshold === '80' && item.confidenceScore < 80) {
        return false;
      }

      // Search query check
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchId = item.id.toLowerCase().includes(q);
        const lostTitle = item.lostReport.title.toLowerCase().includes(q);
        const foundTitle = item.foundReport.title.toLowerCase().includes(q);
        return matchId || lostTitle || foundTitle;
      }

      return true;
    });
  }, [candidates, confidenceThreshold, searchFilter]);

  // Active candidate object
  const activeCandidate = useMemo(() => {
    return (
      candidates.find((c) => c.id === selectedId) ||
      filteredCandidates[0] ||
      candidates[0] ||
      null
    );
  }, [candidates, selectedId, filteredCandidates]);

  // Actions
  const handleSelectCandidate = (id) => {
    setSelectedId(id);
  };

  const handleConfirmMatch = async () => {
    if (!activeCandidate) return;
    setIsLoading(true);
    const res = await MatchReviewController.confirmMatch(activeCandidate.id);
    setIsLoading(false);

    if (res.success) {
      showToast(res.message, 'success');
      // Advance to next candidate
      const remaining = candidates.filter((c) => c.id !== activeCandidate.id);
      setCandidates(remaining);
      if (remaining.length > 0) {
        setSelectedId(remaining[0].id);
      }
    }
  };

  const handleRejectMatch = async () => {
    if (!activeCandidate) return;
    setIsLoading(true);
    const res = await MatchReviewController.rejectMatch(activeCandidate.id);
    setIsLoading(false);

    if (res.success) {
      showToast(res.message, 'warning');
      const remaining = candidates.filter((c) => c.id !== activeCandidate.id);
      setCandidates(remaining);
      if (remaining.length > 0) {
        setSelectedId(remaining[0].id);
      }
    }
  };

  const handleFlagInspection = async () => {
    if (!activeCandidate) return;
    setIsLoading(true);
    const res = await MatchReviewController.flagForInspection(activeCandidate.id);
    setIsLoading(false);

    if (res.success) {
      showToast(res.message, 'info');
    }
  };

  return {
    candidates: filteredCandidates,
    totalCount: candidates.length,
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
  };
}

export default useMatchReviewController;
