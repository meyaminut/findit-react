/**
 * Model: AllReportsModel
 * Represents reports database records from table `reports` joined with reporter contacts
 * backed by `u278523899_findit`.
 */
export class AllReportsModel {
  static getMetrics() {
    return {
      totalSubmissions: {
        val: '1,428',
        label: 'TOTAL SUBMISSIONS',
        subtitle: '+12% vs previous period',
        icon: 'folder'
      },
      awaitingVerification: {
        val: '184',
        label: 'AWAITING VERIFICATION',
        subtitle: 'Requires desk audit',
        icon: 'hourglass'
      },
      matchedConfirmed: {
        val: '542',
        label: 'MATCHED & CONFIRMED',
        subtitle: '38 pending claimant pickup',
        icon: 'handshake'
      },
      resolvedReturned: {
        val: '702',
        label: 'RESOLVED & RETURNED',
        subtitle: '49.1% recovery rate',
        icon: 'shield'
      }
    };
  }

  static getReports() {
    return [
      {
        id: 'R-8904',
        title: 'MacBook Air M2 Midnight',
        type: 'lost',
        category: 'Laptops',
        reporter: {
          name: 'David Kim',
          badge: 'Verified Phone',
          badgeType: 'verified'
        },
        location: 'Gate B7 Departure Concourse',
        timestamp: 'Oct 24, 11:42 AM',
        status: 'new',
        statusLabel: 'New',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'R-8901',
        title: 'iPhone 15 Pro Blue',
        type: 'lost',
        category: 'Mobile Phones',
        reporter: {
          name: 'Alex Wright',
          badge: 'Verified Phone',
          badgeType: 'verified'
        },
        location: 'Terminal 3 Security Checkpoint',
        timestamp: 'Oct 23, 16:30 PM',
        status: 'matched',
        statusLabel: 'Matched',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'R-8895',
        title: 'Bellroy Slim Wallet',
        type: 'found',
        category: 'Personal Accessories',
        reporter: {
          name: 'Cafe Barista Team',
          badge: 'Staff Registered',
          badgeType: 'staff'
        },
        location: 'Central Hub Espresso Lounge',
        timestamp: 'Oct 23, 09:15 AM',
        status: 'confirmed',
        statusLabel: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'R-8870',
        title: 'Hydro Flask 32oz Yellow',
        type: 'found',
        category: 'Everyday Carry',
        reporter: {
          name: 'Security Post 2',
          badge: 'Field Officer',
          badgeType: 'officer'
        },
        location: 'Security Check Annex B',
        timestamp: 'Oct 22, 14:05 PM',
        status: 'returned',
        statusLabel: 'Returned',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'R-8862',
        title: 'Rimowa Classic Cabin',
        type: 'lost',
        category: 'Luggage',
        reporter: {
          name: 'Caroline Vance',
          badge: 'Verified Phone',
          badgeType: 'verified'
        },
        location: 'International Baggage Hall Car. 4',
        timestamp: 'Oct 21, 20:10 PM',
        status: 'matched',
        statusLabel: 'Matched',
        image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'R-8850',
        title: 'Ray-Ban Wayfarer',
        type: 'lost',
        category: 'Eyewear',
        reporter: {
          name: 'Kevin Tan',
          badge: 'Verified Phone',
          badgeType: 'verified'
        },
        location: 'Passenger Rest Area A Level 2',
        timestamp: 'Oct 20, 15:45 PM',
        status: 'returned',
        statusLabel: 'Returned',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&auto=format&fit=crop&q=80'
      }
    ];
  }
}

export default AllReportsModel;
