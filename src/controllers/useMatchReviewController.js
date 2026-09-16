import { useState, useEffect, useMemo } from 'react';
import { MatchReviewController } from './MatchReviewController';
import ApiService from '../services/ApiService';

/**
 * Controller Hook: useMatchReviewController
 * Manages reactive selection, filter queue, and review dispatching.
 * Now fetches live match data from the API on mount.
 */
export function useMatchReviewController() {
  const [candidates, setCandidates] = useState(() => MatchReviewController.getCandidates());
  const [selectedId, setSelectedId] = useState(null);
  const [activeFilterTab, setActiveFilterTab] = useState('unreviewed'); // 'unreviewed' | 'all' | 'confirmed'
  const [confidenceThreshold, setConfidenceThreshold] = useState('80'); // '> 80%' | 'all'
  const [searchFilter, setSearchFilter] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ──── Set initial selectedId ────
  useEffect(() => {
    if (!selectedId && candidates.length > 0) {
      setSelectedId(candidates[0].id);
    }
  }, [candidates, selectedId]);

  // ──── Fetch live API match data on mount ────
  useEffect(() => {
    let cancelled = false;

    async function loadApiMatches() {
      try {
        const apiMatches = await ApiService.getMatches();
        if (cancelled) return;

        if (Array.isArray(apiMatches) && apiMatches.length > 0) {
          // Also fetch reports to enrich match data
          const allReports = await ApiService.getReports();
          if (cancelled) return;

          const reportsMap = {};
          if (Array.isArray(allReports)) {
            allReports.forEach(r => {
              reportsMap[r.id || r.ID] = r;
            });
          }

          const apiCandidates = apiMatches.map((m) => {
            const lostReport = reportsMap[m.lost_report_id] || {};
            const foundReport = reportsMap[m.found_report_id] || {};

            return {
              id: `M-API-${m.id || m.ID}`,
              _apiId: m.id || m.ID,
              matchId: `M-API-${m.id || m.ID}`,
              lost_report_id: m.lost_report_id,
              found_report_id: m.found_report_id,
              status: m.status || 'pending',
              tag: m.status === 'verified' ? 'Verified' : m.status === 'pending' ? 'Pending' : m.status,
              tagType: m.status === 'verified' ? 'green' : 'amber',
              timeAgo: m.created_at ? formatTimeAgo(m.created_at) : 'Baru saja',
              confidenceScore: m.similarity_score || 75,
              category: foundReport.category || lostReport.category || 'Lainnya',

              lostReport: {
                id: `RPT-${m.lost_report_id}`,
                title: lostReport.title || `Laporan Kehilangan #${m.lost_report_id}`,
                category: lostReport.category || '-',
                colorFinish: lostReport.description || '-',
                location: lostReport.location || '-',
                dateTime: lostReport.created_at
                  ? new Date(lostReport.created_at).toLocaleDateString('id-ID')
                  : '-',
                distinguishingMarkings: lostReport.description || '-',
                contactName: lostReport.user?.name || 'Tamu',
                contactEmail: lostReport.user?.email || '-',
                image: lostReport.photo_url || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
                imageTag: 'Laporan Tamu'
              },
              foundReport: {
                id: `RPT-${m.found_report_id}`,
                title: foundReport.title || `Barang Temuan #${m.found_report_id}`,
                category: foundReport.category || '-',
                colorFinish: foundReport.description || '-',
                location: foundReport.location || '-',
                dateTime: foundReport.created_at
                  ? new Date(foundReport.created_at).toLocaleDateString('id-ID')
                  : '-',
                distinguishingMarkings: foundReport.activity_note || '-',
                finderInfo: foundReport.user?.name || 'Staf Hotel',
                image: foundReport.photo_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
                imageTag: 'Log Fisik'
              },
              aiBreakdown: {
                locationProximity: { score: 70, desc: 'Data dari API' },
                timeDelta: { score: 80, desc: 'Data dari API' },
                featureSimilarity: { score: m.similarity_score || 75, desc: 'Score dari API' }
              },
              _source: 'api',
            };
          });

          setCandidates((prev) => {
            const localOnly = prev.filter(c => c._source !== 'api');
            const merged = [...apiCandidates, ...localOnly];
            return merged;
          });
        }
      } catch (err) {
        console.warn('[MatchReview] Failed to fetch API matches:', err.message);
      }
    }

    loadApiMatches();
    return () => { cancelled = true; };
  }, []);

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
        const matchId = (item.id || '').toLowerCase().includes(q);
        const lostTitle = (item.lostReport?.title || '').toLowerCase().includes(q);
        const foundTitle = (item.foundReport?.title || '').toLowerCase().includes(q);
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

    // Try API first if it's an API match
    if (activeCandidate._source === 'api' && activeCandidate._apiId) {
      try {
        await ApiService.verifyMatch(activeCandidate._apiId, 1, 'front_desk');
        setIsLoading(false);
        showToast(`Match #${activeCandidate.id} berhasil diverifikasi via API.`, 'success');
        const remaining = candidates.filter((c) => c.id !== activeCandidate.id);
        setCandidates(remaining);
        if (remaining.length > 0) setSelectedId(remaining[0].id);
        return;
      } catch (err) {
        console.warn('[MatchReview] API verify failed, falling back to local:', err.message);
      }
    }

    // Fallback: local
    const res = await MatchReviewController.confirmMatch(activeCandidate.id);
    setIsLoading(false);

    if (res.success) {
      showToast(res.message, 'success');
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

function formatTimeAgo(dateInput) {
  if (!dateInput) return 'Baru saja';
  const time = new Date(dateInput).getTime();
  if (isNaN(time)) return 'Baru saja';
  const diffMinutes = Math.floor((Date.now() - time) / (1000 * 60));
  if (diffMinutes < 5) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes}m yang lalu`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}j yang lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari yang lalu`;
}

export default useMatchReviewController;
