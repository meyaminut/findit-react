import { StorageService } from '../services/StorageService';

/**
 * Model: MatchReviewModel
 * Dynamically computes candidate pairings between guest ClaimTickets and
 * Housekeeping FoundItems from StorageService with rule-based confidence scoring.
 */
export class MatchReviewModel {
  /**
   * Calculate rule-based confidence score and breakdown between a claim ticket and a found item.
   */
  static calculateScore(ticket, item) {
    let score = 15; // Baseline score
    let locationScore = 20;
    let locationDesc = 'Lokasi dan area penemuan belum sinkron';
    let timeScore = 20;
    let timeDesc = 'Waktu penemuan berjarak lebih dari 7 hari dari pelaporan';
    let featureScore = 20;
    let featureDesc = 'Deskripsi umum belum terverifikasi';

    // 1. Kategori (Category match) - Bobot s.d. 35
    const ticketCat = (ticket.category || '').toLowerCase().trim();
    const itemCat = (item.category || '').toLowerCase().trim();
    if (ticketCat && itemCat && (ticketCat === itemCat || ticketCat.includes(itemCat) || itemCat.includes(ticketCat))) {
      score += 35;
      featureScore = 95;
      featureDesc = `Kategori cocok sempurna (${ticket.category})`;
    } else {
      featureScore = 35;
      featureDesc = `Kategori berbeda: klaim '${ticket.category || '-'}' vs fisik '${item.category || '-'}'`;
    }

    // 2. Ciri Kata Kunci / Warna / Merek - Bobot s.d. 10
    const ticketWords = `${ticket.itemName || ''} ${ticket.brand || ''} ${ticket.color || ''}`.toLowerCase();
    const itemWords = `${item.name || ''} ${item.category || ''}`.toLowerCase();
    const colors = ['hitam', 'putih', 'biru', 'merah', 'emas', 'silver', 'cokelat', 'abu', 'black', 'white', 'blue', 'gold'];
    const matchedColor = colors.find((c) => ticketWords.includes(c) && itemWords.includes(c));
    if (matchedColor) {
      score += 10;
      featureDesc += ` • Warna '${matchedColor}' terkonfirmasi`;
    }

    // 3. Lokasi / Kamar (Location / Room) - Bobot s.d. 35
    const ticketRoom = (ticket.roomNumber || '').toString().trim().replace(/[^0-9a-zA-Z]/g, '');
    const itemRoom = (item.roomNumber || '').toString().trim().replace(/[^0-9a-zA-Z]/g, '');
    const ticketLoc = (ticket.locationLost || '').toLowerCase();
    const itemLoc = (item.locationFound || '').toLowerCase();

    if (ticketRoom && itemRoom && ticketRoom.toLowerCase() === itemRoom.toLowerCase()) {
      score += 35;
      locationScore = 98;
      locationDesc = `Kamar identik: Kamar ${ticket.roomNumber}`;
    } else if (ticketRoom && itemRoom && ticketRoom[0] === itemRoom[0]) {
      score += 15;
      locationScore = 75;
      locationDesc = `Lantai sama (${ticketRoom[0]}), area berdekatan`;
    } else if (ticketLoc && itemLoc && (ticketLoc.includes(itemLoc) || itemLoc.includes(ticketLoc))) {
      score += 20;
      locationScore = 85;
      locationDesc = `Area penemuan sinkron (${ticket.locationLost || item.locationFound})`;
    }

    // 4. Rentang Waktu (Date range) - Bobot s.d. 20
    const ticketTime = new Date(ticket.createdAt || ticket.reportedAt || Date.now()).getTime();
    const itemTime = new Date(item.createdAt || item.foundAt || Date.now()).getTime();
    const diffHours = isNaN(ticketTime) || isNaN(itemTime) ? 48 : Math.abs(ticketTime - itemTime) / (1000 * 60 * 60);

    if (diffHours <= 24) {
      score += 20;
      timeScore = 95;
      timeDesc = 'Ditemukan dalam rentang 24 jam dari waktu pelaporan';
    } else if (diffHours <= 72) {
      score += 15;
      timeScore = 85;
      timeDesc = 'Ditemukan dalam rentang 3 hari dari waktu pelaporan';
    } else if (diffHours <= 168) {
      score += 10;
      timeScore = 70;
      timeDesc = 'Ditemukan dalam rentang 7 hari dari waktu pelaporan';
    } else {
      timeScore = 40;
      timeDesc = 'Ditemukan lebih dari 7 hari setelah pelaporan';
    }

    const confidenceScore = Math.min(Math.max(score, 15), 99);

    return {
      confidenceScore,
      breakdown: {
        locationProximity: { score: locationScore, desc: locationDesc },
        timeDelta: { score: timeScore, desc: timeDesc },
        featureSimilarity: { score: featureScore, desc: featureDesc }
      }
    };
  }

  static formatTimeAgo(dateInput) {
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

  /**
   * Retrieves dynamically generated candidate pairings from StorageService.
   * If ticketId is provided, returns scored candidates specifically paired with that ticket.
   * Format is backward-compatible with UI expectations.
   */
  static getCandidates(targetTicketId = null) {
    const tickets = StorageService.getTickets();
    const foundItems = StorageService.getFoundItems();

    if (!tickets.length || !foundItems.length) {
      return [];
    }

    // Filter tickets if specific target provided
    const relevantTickets = targetTicketId
      ? tickets.filter((t) => t.id === targetTicketId)
      : tickets;

    const candidates = [];

    relevantTickets.forEach((ticket) => {
      foundItems.forEach((item) => {
        const { confidenceScore, breakdown } = this.calculateScore(ticket, item);
        const cleanTicketId = (ticket.id || '').replace(/[^0-9]/g, '') || '0';
        const cleanItemId = (item.id || '').replace(/[^0-9]/g, '') || '0';
        const pairId = `M-${cleanTicketId.slice(-4)}-${cleanItemId.slice(-4)}`;

        const candidate = {
          id: pairId,
          matchId: pairId,
          lost_report_id: ticket.id,
          found_report_id: item.id,
          ticketId: ticket.id,
          itemId: item.id,
          status: 'pending',
          tag: confidenceScore >= 85 ? 'High Confidence' : confidenceScore >= 70 ? 'Auto-Paired' : 'Potential Match',
          tagType: confidenceScore >= 85 ? 'amber' : 'navy',
          timeAgo: this.formatTimeAgo(item.createdAt || ticket.createdAt),
          confidenceScore,
          category: ticket.category || item.category,

          // Format for QueueSidebar & ComparisonDetail
          lostReport: {
            id: ticket.id,
            title: ticket.itemName || 'Barang Hilang',
            category: ticket.category || '-',
            colorFinish: [ticket.brand, ticket.color].filter(Boolean).join(' • ') || ticket.color || '-',
            location: ticket.locationLost ? `${ticket.locationLost} (Kamar ${ticket.roomNumber})` : `Kamar ${ticket.roomNumber || '-'}`,
            dateTime: ticket.reportedAt || ticket.createdAt || '-',
            distinguishingMarkings: ticket.secretDetail || '-',
            contactName: ticket.guestName || 'Tamu Hotel',
            contactEmail: ticket.email || '-',
            image: ticket.photoUrl || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
            imageTag: 'Laporan Tamu'
          },
          foundReport: {
            id: item.id,
            title: item.name || 'Barang Temuan',
            category: item.category || '-',
            colorFinish: item.name || '-',
            location: item.locationFound ? `${item.locationFound} (Kamar ${item.roomNumber})` : `Kamar ${item.roomNumber || '-'}`,
            dateTime: item.foundAt || item.createdAt || '-',
            distinguishingMarkings: `Disimpan di: ${item.storageLocation || 'Brankas FO'}`,
            finderInfo: item.finderName ? `Staf: ${item.finderName}` : 'Housekeeping Team',
            image: item.photoUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
            imageTag: 'Log Fisik Housekeeping'
          },
          aiBreakdown: breakdown,

          // Direct FoundItem properties for HousekeepingCandidatesCard compatibility
          name: item.name,
          roomNumber: item.roomNumber || ticket.roomNumber,
          storageLocation: item.storageLocation,
          finderName: item.finderName,
          locationFound: item.locationFound,
          foundAt: item.foundAt,
          photoUrl: item.photoUrl,
          score: confidenceScore,
          rawTicket: ticket,
          rawItem: item
        };

        candidates.push(candidate);
      });
    });

    // Sort descending by confidence score
    candidates.sort((a, b) => b.confidenceScore - a.confidenceScore);

    return candidates;
  }
}

export default MatchReviewModel;
