/**
 * Service: StorageService
 * Centralized dynamic persistence using browser localStorage.
 * Manages Claim Tickets (#TK-...), Found Items Master Inventory (#LF-...), and Audit Logs.
 * Eliminates static dummy data and enables end-to-end functionality across all views.
 */

const TICKETS_KEY = 'findit_claim_tickets';
const FOUND_ITEMS_KEY = 'findit_found_items';
const AUDIT_LOGS_KEY = 'findit_audit_logs';
const SURVEY_GUESTS_KEY = 'findit_survey_guests';

// Clean initial state (starts empty as requested by user)
export const StorageService = {
  // 1. CLAIM TICKETS
  getTickets() {
    try {
      const data = localStorage.getItem(TICKETS_KEY);
      return data ? JSON.parse(data) : [];
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
      status: 'Menunggu Verifikasi', // 'Menunggu Verifikasi' | 'Terverifikasi' | 'Selesai Handover'
      reportedAt: `${dateStr}, ${timeStr} WIB`,
      createdAt: new Date().toISOString()
    };

    tickets.unshift(newTicket);
    this.saveTickets(tickets);
    this.addAuditLog(`Tiket baru ${newId} (${newTicket.itemName}) berhasil dibuat untuk tamu ${newTicket.guestName}.`);
    return newTicket;
  },

  updateTicketStatus(ticketId, nextStatus) {
    const tickets = this.getTickets();
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return { ...t, status: nextStatus, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    this.saveTickets(updated);
    this.addAuditLog(`Status tiket ${ticketId} diperbarui menjadi: ${nextStatus}.`);
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
      return data ? JSON.parse(data) : [];
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
      status: 'Di Brankas FO', // 'Di Brankas FO' | 'Sudah Diambil' | 'Dalam Proses'
      photoUrl: itemData.photoUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    items.unshift(newItem);
    this.saveFoundItems(items);
    this.addAuditLog(`Barang temuan ${newId} (${newItem.name}) disimpan di ${newItem.storageLocation}.`);
    return newItem;
  },

  updateFoundItemStatus(itemId, nextStatus) {
    const items = this.getFoundItems();
    const updated = items.map((i) => {
      if (i.id === itemId) {
        return { ...i, status: nextStatus };
      }
      return i;
    });
    this.saveFoundItems(updated);
    this.addAuditLog(`Status barang ${itemId} diubah menjadi: ${nextStatus}.`);
  },

  deleteFoundItem(itemId) {
    const items = this.getFoundItems().filter((i) => i.id !== itemId);
    this.saveFoundItems(items);
    this.addAuditLog(`Barang temuan ${itemId} dihapus dari master inventaris.`);
  },

  // 3. SURVEY GUESTS
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

  // 4. AUDIT LOGS
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

  // 5. EXPORT CSV UTILITY
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

  // 6. SAMPLE DATA SEEDER (ONLY FOR MANUAL TESTING BY USER)
  seedSampleData() {
    const sampleTickets = [
      {
        id: '#TK-2024-0001',
        guestName: 'Hendra Gunawan',
        roomNumber: '314',
        roomType: 'Deluxe Suite',
        phone: '0812-9876-5432',
        email: 'hendra.g@gmail.com',
        itemName: 'Smartwatch Garmin Venu SQ Hitam',
        category: 'Elektronik',
        brand: 'Garmin',
        color: 'Hitam Matte',
        locationLost: 'Meja Nakas Kanan',
        secretDetail: 'Ada goresan halus sudut kiri atas, wallpaper foto anjing golden retriever',
        priority: 'VIP',
        status: 'Menunggu Verifikasi',
        reportedAt: 'Hari ini, 10:50 WIB',
        createdAt: new Date().toISOString()
      },
      {
        id: '#TK-2024-0002',
        guestName: 'Ibu Dian Pratiwi',
        roomNumber: '510',
        roomType: 'Deluxe King',
        phone: '0811-2345-6789',
        email: 'dian.pratiwi@outlook.com',
        itemName: 'Cincin Emas Kuning 18K',
        category: 'Perhiasan & Jam',
        brand: 'Custom Jeweler',
        color: 'Emas Kuning',
        locationLost: 'Wastafel Kamar Mandi',
        secretDetail: 'Grafir inisial D & R di lingkar dalam cincin',
        priority: 'Reguler',
        status: 'Terverifikasi',
        reportedAt: 'Hari ini, 11:45 WIB',
        createdAt: new Date().toISOString()
      }
    ];

    const sampleFound = [
      {
        id: '#LF-2024-0001',
        name: 'Smartwatch Garmin Venu SQ Hitam',
        roomNumber: '314',
        category: 'Elektronik',
        locationFound: 'Meja Nakas Kanan',
        storageLocation: 'Loker FO B-12',
        finderName: 'Siti Aminah (HK)',
        foundAt: 'Hari ini, 11:20 WIB',
        status: 'Di Brankas FO',
        photoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: '#LF-2024-0002',
        name: 'Cincin Emas Kuning 18K',
        roomNumber: '510',
        category: 'Perhiasan & Jam',
        locationFound: 'Wastafel Kamar Mandi',
        storageLocation: 'Brankas Utama FO',
        finderName: 'Siti Aminah (HK)',
        foundAt: 'Hari ini, 14:10 WIB',
        status: 'Di Brankas FO',
        photoUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      }
    ];

    const sampleGuests = [
      {
        id: 'g-01',
        name: 'Bpk. Bambang Sutrisno',
        roomNumber: '204',
        roomType: 'Superior Twin',
        checkoutTime: '12:05 WIB',
        checkoutAgo: '40 menit lalu',
        status: 'unseen',
        statusLabel: 'Belum Terkirim',
        hkLog: 'Kamar belum dibersihkan',
        hkTicket: null
      },
      {
        id: 'g-02',
        name: 'Ibu Dian Pratiwi',
        roomNumber: '510',
        roomType: 'Deluxe King',
        checkoutTime: '11:40 WIB',
        checkoutAgo: '1 jam 5 mnt lalu',
        status: 'replied',
        statusLabel: 'Telah Dibalas',
        hkLog: 'Mengklaim Cincin Emas',
        hkTicket: 'Tiket #TK-2024-0002 terbit'
      }
    ];

    this.saveTickets(sampleTickets);
    this.saveFoundItems(sampleFound);
    this.saveSurveyGuests(sampleGuests);
    this.addAuditLog('Data sampel pengujian dimuat.');
  },

  clearAllData() {
    localStorage.removeItem(TICKETS_KEY);
    localStorage.removeItem(FOUND_ITEMS_KEY);
    localStorage.removeItem(AUDIT_LOGS_KEY);
    localStorage.removeItem(SURVEY_GUESTS_KEY);
    window.dispatchEvent(new Event('findit_tickets_updated'));
    window.dispatchEvent(new Event('findit_items_updated'));
    window.dispatchEvent(new Event('findit_survey_updated'));
  }
};

export default StorageService;
