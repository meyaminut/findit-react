/**
 * Service: StorageService
 * Centralized dynamic persistence using browser localStorage.
 * Manages Claim Tickets (#TK-...), Found Items Master Inventory (#LF-...), and Audit Logs.
 * All data now comes from the live API — no more dummy seed data.
 */

import {
  MATCH_STATUS,
  TICKET_STATUS_MAP,
  FOUND_ITEM_STATUS_MAP,
  TICKET_TO_MATCH_STATUS,
  ITEM_TO_MATCH_STATUS
} from '../models/MatchModel';

const TICKETS_KEY = 'findit_claim_tickets';
const FOUND_ITEMS_KEY = 'findit_found_items';
const AUDIT_LOGS_KEY = 'findit_audit_logs';
const SURVEY_GUESTS_KEY = 'findit_survey_guests';
const MATCHES_KEY = 'findit_matches';
const OPERATIONAL_REPORTS_KEY = 'findit_operational_reports';

// Auto-cleanup legacy dummy data from localStorage once so browser is pristine
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  const DUMMY_CLEANUP_KEY = 'findit_dummy_cleaned_v5';
  if (!localStorage.getItem(DUMMY_CLEANUP_KEY)) {
    localStorage.removeItem(TICKETS_KEY);
    localStorage.removeItem(FOUND_ITEMS_KEY);
    localStorage.removeItem(MATCHES_KEY);
    localStorage.removeItem(AUDIT_LOGS_KEY);
    localStorage.removeItem(SURVEY_GUESTS_KEY);
    localStorage.removeItem(OPERATIONAL_REPORTS_KEY);
    localStorage.setItem(DUMMY_CLEANUP_KEY, 'true');
  }
}

export const StorageService = {
  // 1. CLAIM TICKETS
  getTickets() {
    try {
      const data = localStorage.getItem(TICKETS_KEY);
      const tickets = data ? JSON.parse(data) : [];
      const matches = this.getMatches();

      return tickets.map((ticket) => {
        const linkedMatch = matches.find(
          (m) => m.lost_report_id === ticket.id && m.status !== MATCH_STATUS.REJECTED
        );
        const canonicalMatchStatus = linkedMatch
          ? linkedMatch.status
          : ticket.match_status || TICKET_TO_MATCH_STATUS[ticket.status] || MATCH_STATUS.PENDING;
        const displayStatus = TICKET_STATUS_MAP[canonicalMatchStatus] || ticket.status || 'Menunggu Verifikasi';

        return {
          ...ticket,
          match_status: canonicalMatchStatus,
          status: displayStatus
        };
      });
    } catch {
      return [];
    }
  },

  saveTickets(tickets) {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    window.dispatchEvent(new Event('findit_tickets_updated'));
  },

  addTicket(ticketData) {
    const tickets = this.getTickets();
    const count = tickets.length + 1;
    const newId = `#TK-2024-${String(count).padStart(4, '0')}`;
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newTicket = {
      id: newId,
      guestName: ticketData.guestName || 'Tamu Hotel',
      roomNumber: ticketData.roomNumber || '-',
      roomType: ticketData.roomType || 'Deluxe Room',
      phone: ticketData.phone || '-',
      email: ticketData.email || '-',
      itemName: ticketData.itemName || 'Barang Berharga',
      category: ticketData.category || 'Elektronik',
      brand: ticketData.brand || '-',
      color: ticketData.color || '-',
      locationLost: ticketData.locationLost || 'Kamar Tidur',
      secretDetail: ticketData.secretDetail || '-',
      priority: ticketData.priority || 'Reguler',
      match_status: MATCH_STATUS.PENDING,
      status: 'Menunggu Verifikasi',
      reportedAt: `${dateStr}, ${timeStr} WIB`,
      createdAt: new Date().toISOString()
    };

    tickets.unshift(newTicket);
    this.saveTickets(tickets);
    this.addAuditLog(`Tiket baru ${newId} (${newTicket.itemName}) berhasil dibuat untuk tamu ${newTicket.guestName}.`);
    return newTicket;
  },

  updateTicketStatus(ticketId, nextStatus) {
    const canonicalStatus = TICKET_TO_MATCH_STATUS[nextStatus] || MATCH_STATUS.PENDING;
    const matches = this.getMatches();
    const linkedMatch = matches.find((m) => m.lost_report_id === ticketId);

    if (linkedMatch) {
      this.updateMatchStatus(linkedMatch.id, canonicalStatus);
      return;
    }

    const tickets = this.getTickets();
    const ticketLabel = TICKET_STATUS_MAP[canonicalStatus] || nextStatus;
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          match_status: canonicalStatus,
          status: ticketLabel,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    this.saveTickets(updated);
    this.addAuditLog(`Status tiket ${ticketId} diperbarui menjadi: ${ticketLabel} (match: ${canonicalStatus}).`);
  },

  deleteTicket(ticketId) {
    const tickets = this.getTickets().filter((t) => t.id !== ticketId);
    this.saveTickets(tickets);
    this.addAuditLog(`Tiket ${ticketId} dihapus dari antrean.`);
  },

  // 2. FOUND ITEMS (MASTER INVENTORY)
  getFoundItems() {
    try {
      const data = localStorage.getItem(FOUND_ITEMS_KEY);
      const items = data ? JSON.parse(data) : [];
      const matches = this.getMatches();

      return items.map((item) => {
        const linkedMatch = matches.find(
          (m) => m.found_report_id === item.id && m.status !== MATCH_STATUS.REJECTED
        );
        const canonicalMatchStatus = linkedMatch
          ? linkedMatch.status
          : item.match_status || ITEM_TO_MATCH_STATUS[item.status] || MATCH_STATUS.PENDING;
        const displayStatus = FOUND_ITEM_STATUS_MAP[canonicalMatchStatus] || item.status || 'Di Brankas FO';

        return {
          ...item,
          match_status: canonicalMatchStatus,
          status: displayStatus
        };
      });
    } catch {
      return [];
    }
  },

  saveFoundItems(items) {
    localStorage.setItem(FOUND_ITEMS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('findit_items_updated'));
  },

  addFoundItem(itemData) {
    const items = this.getFoundItems();
    const count = items.length + 1;
    const newId = `#LF-2024-${String(count).padStart(4, '0')}`;
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newItem = {
      id: newId,
      name: itemData.name || 'Barang Temuan',
      roomNumber: itemData.roomNumber || '-',
      category: itemData.category || 'Elektronik',
      locationFound: itemData.locationFound || 'Kamar Tamu',
      storageLocation: itemData.storageLocation || 'Brankas Utama FO',
      finderName: itemData.finderName || 'Staf Housekeeping',
      foundAt: `${dateStr}, ${timeStr} WIB`,
      match_status: MATCH_STATUS.PENDING,
      status: 'Di Brankas FO',
      photoUrl: itemData.photoUrl || '',
      createdAt: new Date().toISOString()
    };

    items.unshift(newItem);
    this.saveFoundItems(items);
    this.addAuditLog(`Barang temuan ${newId} (${newItem.name}) disimpan di ${newItem.storageLocation}.`);
    return newItem;
  },

  updateFoundItemStatus(itemId, nextStatus) {
    const canonicalStatus = ITEM_TO_MATCH_STATUS[nextStatus] || MATCH_STATUS.PENDING;
    const matches = this.getMatches();
    const linkedMatch = matches.find((m) => m.found_report_id === itemId);

    if (linkedMatch) {
      this.updateMatchStatus(linkedMatch.id, canonicalStatus);
      return;
    }

    const items = this.getFoundItems();
    const itemLabel = FOUND_ITEM_STATUS_MAP[canonicalStatus] || nextStatus;
    const updated = items.map((i) => {
      if (i.id === itemId) {
        return {
          ...i,
          match_status: canonicalStatus,
          status: itemLabel
        };
      }
      return i;
    });
    this.saveFoundItems(updated);
    this.addAuditLog(`Status barang ${itemId} diubah menjadi: ${itemLabel} (match: ${canonicalStatus}).`);
  },

  deleteFoundItem(itemId) {
    const items = this.getFoundItems().filter((i) => i.id !== itemId);
    this.saveFoundItems(items);
    this.addAuditLog(`Barang temuan ${itemId} dihapus dari master inventaris.`);
  },

  // 3. MATCHES
  getMatches() {
    try {
      const data = localStorage.getItem(MATCHES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMatches(matches) {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
    window.dispatchEvent(new Event('findit_matches_updated'));
  },

  addMatch(matchData = {}) {
    const matches = this.getMatches();
    const count = matches.length + 1;
    const newId = matchData.id || `#M-2024-${String(count).padStart(4, '0')}`;

    const newMatch = {
      id: newId,
      lost_report_id: matchData.lost_report_id || matchData.ticketId || null,
      found_report_id: matchData.found_report_id || matchData.itemId || null,
      status: matchData.status || 'pending',
      confidence_score: matchData.confidenceScore || matchData.confidence_score || 0,
      verified_by: matchData.verified_by || null,
      handover_method: matchData.handover_method || null,
      contact_shared_at: matchData.contact_shared_at || null,
      activity_note: matchData.activity_note || '',
      createdAt: matchData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...matchData
    };

    if (!matchData.status) {
      newMatch.status = 'pending';
    }

    matches.unshift(newMatch);
    this.saveMatches(matches);
    this.addAuditLog(`Match baru ${newId} (Klaim ${newMatch.lost_report_id || '-'} ↔ Temuan ${newMatch.found_report_id || '-'}) dicatat.`);
    return newMatch;
  },

  updateMatchStatus(matchId, nextStatus, extra = {}) {
    const matches = this.getMatches();
    let updatedMatch = null;
    let found = false;

    const updated = matches.map((m) => {
      if (m.id === matchId) {
        found = true;
        updatedMatch = {
          ...m,
          ...extra,
          status: nextStatus,
          updatedAt: new Date().toISOString()
        };
        return updatedMatch;
      }
      return m;
    });

    if (!found) {
      updatedMatch = {
        id: matchId,
        lost_report_id: extra.lost_report_id || null,
        found_report_id: extra.found_report_id || null,
        status: nextStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...extra
      };
      matches.unshift(updatedMatch);
      this.saveMatches(matches);
    } else {
      this.saveMatches(updated);
    }

    // SINKRONISASI OTOMATIS: Single Source of Truth
    const ticketId = updatedMatch.lost_report_id;
    if (ticketId) {
      try {
        const rawData = localStorage.getItem(TICKETS_KEY);
        const tickets = rawData ? JSON.parse(rawData) : [];
        const ticketLabel = TICKET_STATUS_MAP[nextStatus] || 'Menunggu Verifikasi';
        const syncedTickets = tickets.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              match_status: nextStatus,
              status: ticketLabel,
              updatedAt: new Date().toISOString()
            };
          }
          return t;
        });
        localStorage.setItem(TICKETS_KEY, JSON.stringify(syncedTickets));
        window.dispatchEvent(new Event('findit_tickets_updated'));
      } catch (e) {
        console.error('Failed to sync ticket status from match:', e);
      }
    }

    const itemId = updatedMatch.found_report_id;
    if (itemId) {
      try {
        const rawData = localStorage.getItem(FOUND_ITEMS_KEY);
        const items = rawData ? JSON.parse(rawData) : [];
        const itemLabel = FOUND_ITEM_STATUS_MAP[nextStatus] || 'Di Brankas FO';
        const syncedItems = items.map((i) => {
          if (i.id === itemId) {
            return {
              ...i,
              match_status: nextStatus,
              status: itemLabel,
              updatedAt: new Date().toISOString()
            };
          }
          return i;
        });
        localStorage.setItem(FOUND_ITEMS_KEY, JSON.stringify(syncedItems));
        window.dispatchEvent(new Event('findit_items_updated'));
      } catch (e) {
        console.error('Failed to sync found item status from match:', e);
      }
    }

    this.addAuditLog(`Status match ${matchId} diperbarui menjadi '${nextStatus}' (tersinkron ke tiket ${ticketId || '-'} & barang ${itemId || '-'}).`);
    return updatedMatch;
  },

  // 4. SURVEY GUESTS
  getSurveyGuests() {
    try {
      const data = localStorage.getItem(SURVEY_GUESTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSurveyGuests(guests) {
    localStorage.setItem(SURVEY_GUESTS_KEY, JSON.stringify(guests));
    window.dispatchEvent(new Event('findit_survey_updated'));
  },

  updateSurveyGuestStatus(guestId, status, statusLabel) {
    const guests = this.getSurveyGuests();
    const updated = guests.map((g) => {
      if (g.id === guestId) {
        return { ...g, status, statusLabel };
      }
      return g;
    });
    this.saveSurveyGuests(updated);
  },

  // 5. AUDIT LOGS
  getAuditLogs() {
    try {
      const data = localStorage.getItem(AUDIT_LOGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addAuditLog(actionText) {
    const logs = this.getAuditLogs();
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    logs.unshift({
      id: `log-${Date.now()}`,
      time: `${timeStr} WIB`,
      text: actionText,
      timestamp: Date.now()
    });
    if (logs.length > 50) logs.pop();
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  },

  // 6. OPERATIONAL REPORTS
  getReports() {
    try {
      const data = localStorage.getItem(OPERATIONAL_REPORTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveReports(reports) {
    localStorage.setItem(OPERATIONAL_REPORTS_KEY, JSON.stringify(reports));
    window.dispatchEvent(new Event('findit_reports_updated'));
  },

  addReport(reportData) {
    const reports = this.getReports();
    const count = reports.length + 1;
    const newId = `#LAP-2024-${String(count).padStart(4, '0')}`;
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newReport = {
      id: newId,
      title: reportData.title || 'Laporan Operasional Baru',
      reportType: reportData.reportType || 'found_item',
      category: reportData.category || 'Elektronik & Gadget',
      reporterName: reportData.reporterName || 'Staf Front Office',
      reporterContact: reportData.reporterContact || 'Dept. FO',
      location: reportData.location || 'Area Hotel',
      priority: reportData.priority || 'Normal',
      description: reportData.description || 'Deskripsi rincian laporan belum diisi.',
      officialOfficer: reportData.officialOfficer || 'Admin On Duty',
      status: reportData.status || 'Diterbitkan',
      dateFormatted: `${dateStr}, ${timeStr} WIB`,
      createdAt: new Date().toISOString()
    };

    reports.unshift(newReport);
    this.saveReports(reports);
    this.addAuditLog(`Laporan baru ${newId} ("${newReport.title}") berhasil diterbitkan.`);
    return newReport;
  },

  deleteReport(reportId) {
    const reports = this.getReports().filter((r) => r.id !== reportId);
    this.saveReports(reports);
    this.addAuditLog(`Laporan ${reportId} dihapus dari arsip operasional.`);
  },

  // 7. EXPORT CSV UTILITY
  exportToCSV(dataArray, filename = 'export.csv') {
    if (!dataArray || !dataArray.length) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    const headers = Object.keys(dataArray[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of dataArray) {
      const values = headers.map((header) => {
        const escaped = ('' + (row[header] || '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // 8. SEED (DISABLED — All data from live API)
  seedSampleData() {
    // No-op: All data comes from the live API.
  },

  // 9. CLEAR ALL LOCAL DATA
  clearAllData() {
    localStorage.removeItem(TICKETS_KEY);
    localStorage.removeItem(FOUND_ITEMS_KEY);
    localStorage.removeItem(AUDIT_LOGS_KEY);
    localStorage.removeItem(SURVEY_GUESTS_KEY);
    localStorage.removeItem(MATCHES_KEY);
    localStorage.removeItem(OPERATIONAL_REPORTS_KEY);
    window.dispatchEvent(new Event('findit_tickets_updated'));
    window.dispatchEvent(new Event('findit_items_updated'));
    window.dispatchEvent(new Event('findit_matches_updated'));
    window.dispatchEvent(new Event('findit_survey_updated'));
    window.dispatchEvent(new Event('findit_reports_updated'));
  }
};

export default StorageService;
