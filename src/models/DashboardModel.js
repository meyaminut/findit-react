/**
 * Model: DashboardModel
 * Provides dynamic dashboard KPI structure, empty ticket arrays, live activity feed,
 * category definitions, and empty unlabeled item slots.
 * All counts are populated dynamically from StorageService at runtime.
 */
export class DashboardModel {
  static getKpiMetrics() {
    return {
      totalFound: {
        value: 0,
        unit: 'Item',
        label: 'Total Barang Temuan (Bulan Ini)',
        trendText: '-',
        trendType: 'neutral'
      },
      pendingVerification: {
        value: 0,
        unit: 'Tiket',
        label: 'Tiket Menunggu Verifikasi',
        badge: 'Butuh Tindakan Segera',
        alertText: '',
        isHighlighted: false
      },
      verifiedMonth: {
        value: 0,
        unit: 'Item',
        label: 'Terverifikasi Bulan Ini',
        statusText: 'Terkonfirmasi Valid'
      },
      resolvedHandover: {
        value: 0,
        unit: 'Dikembalikan',
        label: 'Resolved / Selesai Handover',
        successRate: '0% Rate Sukses',
        targetText: 'Target: 80%'
      }
    };
  }

  static getActionableTickets() {
    return [];
  }

  static getLiveActivities() {
    return [];
  }

  static getCategories() {
    return [
      {
        id: 'cat-1',
        name: 'Elektronik & Gadget',
        percent: 0,
        items: 0,
        color: '#2563eb',
        icon: 'laptop'
      },
      {
        id: 'cat-2',
        name: 'Pakaian & Aksesori',
        percent: 0,
        items: 0,
        color: '#f59e0b',
        icon: 'hanger'
      },
      {
        id: 'cat-3',
        name: 'Dokumen / Kartu ID',
        percent: 0,
        items: 0,
        color: '#10b981',
        icon: 'card'
      },
      {
        id: 'cat-4',
        name: 'Lain-lain / Perlengkapan',
        percent: 0,
        items: 0,
        color: '#94a3b8',
        icon: 'box'
      }
    ];
  }

  static getUnlabeledStorageItems() {
    return [];
  }
}

export default DashboardModel;
