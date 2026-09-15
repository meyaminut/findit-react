/**
 * Model: DashboardModel
 * Represents operational dashboard telemetry, actionable tickets, live activities,
 * category distribution, and storage items backed by database `u278523899_findit`.
 */
export class DashboardModel {
  static getKpiMetrics() {
    return {
      totalFound: {
        value: 148,
        unit: 'Item',
        label: 'Total Barang Temuan (Bulan Ini)',
        trendText: '+12% vs bln lalu',
        trendType: 'positive'
      },
      pendingVerification: {
        value: 14,
        unit: 'Tiket',
        label: 'Tiket Menunggu Verifikasi',
        badge: 'Butuh Tindakan Segera',
        alertText: '5 tiket > 24 jam',
        isHighlighted: true
      },
      verifiedMonth: {
        value: 96,
        unit: 'Item',
        label: 'Terverifikasi Bulan Ini',
        statusText: 'Terkonfirmasi Valid'
      },
      resolvedHandover: {
        value: 79,
        unit: 'Dikembalikan',
        label: 'Resolved / Selesai Handover',
        successRate: '82.3% Rate Sukses',
        targetText: 'Target: 80%'
      }
    };
  }

  static getActionableTickets() {
    return [
      {
        id: '#TK-2024-0314',
        ticketNumber: 'TK-2024-0314',
        guestName: 'Ny. Sarah Jenkins',
        isVip: true,
        room: 'Kamar 502 (Deluxe Suite)',
        itemTitle: 'Smartwatch Garmin Hitam',
        category: 'electronics',
        iconType: 'watch',
        locationDetail: 'Area Meja Rias / Samping Kasur',
        reportTime: 'Hari ini, 08:20',
        status: 'Menunggu Verifikasi',
        statusType: 'blue',
        priorityTag: null
      },
      {
        id: '#TK-2024-0312',
        ticketNumber: 'TK-2024-0312',
        guestName: 'Bpk. Hendra Gunawan',
        isVip: false,
        room: 'Kamar 314 (Superior)',
        itemTitle: 'Passport & Dompet Kulit',
        category: 'documents',
        iconType: 'wallet',
        locationDetail: 'Kamar Mandi / Meja Kerja',
        priorityTag: 'Prioritas Tinggi (Dokumen)',
        reportTime: 'Kemarin, 21:40',
        status: 'Baru Masuk',
        statusType: 'gray'
      },
      {
        id: '#TK-2024-0309',
        ticketNumber: 'TK-2024-0309',
        guestName: "Tan Sri Dato' Razak",
        isVip: true,
        room: 'Kamar 810 (Presidential)',
        itemTitle: 'MacBook Air M2 Silver',
        category: 'electronics',
        iconType: 'laptop',
        locationDetail: 'Tertinggal di Brankas Kamar',
        reportTime: 'Kemarin, 17:15',
        status: 'Menunggu Verifikasi',
        statusType: 'blue',
        priorityTag: null
      },
      {
        id: '#TK-2024-0305',
        ticketNumber: 'TK-2024-0305',
        guestName: 'Ibu Dewi Maharani',
        isVip: false,
        room: 'Kamar 204 (Standard)',
        itemTitle: 'Jaket Trench Coat Krem',
        category: 'clothing',
        iconType: 'clothing',
        locationDetail: 'Lemari Pakaian No. 2',
        reportTime: '18 Mar, 14:02',
        status: 'Baru Masuk',
        statusType: 'gray',
        priorityTag: null
      }
    ];
  }

  static getLiveActivities() {
    return [
      {
        id: 1,
        type: 'camera',
        text: 'Siti Aminah (Housekeeping) mencatat temuan Jam Tangan di Kamar 314.',
        time: '5 menit yang lalu'
      },
      {
        id: 2,
        type: 'phone',
        text: 'Order Taker menerima tiket klaim dari tamu Kamar 408 (Telepon Tamu).',
        time: '18 menit yang lalu'
      },
      {
        id: 3,
        type: 'handover',
        text: 'Handover selesai untuk tiket #TK-2024-0310 diserahkan ke kurir GrabExpress.',
        time: '42 menit yang lalu'
      },
      {
        id: 4,
        type: 'safe',
        text: 'Brankas Utama FO dibuka oleh Supervisor Budi Santoso untuk verifikasi fisik.',
        time: '1 jam yang lalu'
      }
    ];
  }

  static getCategories() {
    return [
      {
        id: 'cat-1',
        name: 'Elektronik & Gadget',
        percent: 42,
        items: 62,
        color: '#2563eb',
        icon: 'laptop'
      },
      {
        id: 'cat-2',
        name: 'Pakaian & Aksesori',
        percent: 28,
        items: 41,
        color: '#f59e0b',
        icon: 'hanger'
      },
      {
        id: 'cat-3',
        name: 'Dokumen / Kartu ID',
        percent: 18,
        items: 27,
        color: '#10b981',
        icon: 'card'
      },
      {
        id: 'cat-4',
        name: 'Lain-lain / Perlengkapan',
        percent: 12,
        items: 18,
        color: '#94a3b8',
        icon: 'box'
      }
    ];
  }

  static getUnlabeledStorageItems() {
    return [
      {
        id: 'U-1',
        title: 'Garmin Forerunner',
        roomTag: 'Km. 314',
        time: '08:12 WIB • HK',
        shift: 'Shift A',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'U-2',
        title: 'Dompet Braun Büffel',
        roomTag: 'Km. 502',
        time: '07:45 WIB • HK',
        shift: 'Shift A',
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'U-3',
        title: 'Kacamata RayBan',
        roomTag: 'Lobby Resto',
        time: '06:50 WIB • Resto',
        shift: 'Team',
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'U-4',
        title: 'AirPods Pro Gen 2',
        roomTag: 'Km. 810',
        time: '06:30 WIB • HK',
        shift: 'Shift A',
        imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&auto=format&fit=crop&q=80'
      }
    ];
  }
}

export default DashboardModel;
