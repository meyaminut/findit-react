import { ReportModel } from './ReportModel';
import { MatchModel } from './MatchModel';
import { UserModel } from './UserModel';

/**
 * Model: DashboardModel
 * Represents operational dashboard telemetry, metrics, and queue pairings
 * backed by database `u278523899_findit`.
 */
export class DashboardModel {
  static getKpiMetrics() {
    return {
      totalReports: {
        value: '1,428',
        label: 'TOTAL REPORTS',
        subtitle: 'All time submitted records',
        changeText: '+12% vs past month',
        changeType: 'positive'
      },
      pendingMatches: {
        value: 18,
        label: 'PENDING MATCHES',
        badge: 'Action Required',
        subtitle: 'Awaiting administrative verification',
        escalationText: '+5 escalated today',
        isCritical: true
      },
      confirmedMonth: {
        value: 86,
        label: 'CONFIRMED THIS MONTH',
        subtitle: 'High-confidence matches approved',
        changeText: '+18% vs baseline period',
        changeType: 'positive'
      },
      returnedOwners: {
        value: 64,
        label: 'RETURNED TO OWNERS',
        subtitle: 'Custody handoffs finished',
        efficiencyText: '88.4% resolution efficiency'
      }
    };
  }

  static getInitialQueueItems() {
    return [
      {
        id: 'M-4091',
        type: 'match',
        tag: 'Auto-Paired',
        tagType: 'navy',
        category: 'Electronics',
        icon: 'smartphone',
        location: 'Terminal 3 Gate 42',
        title: 'iPhone 15 Pro Max (Titanium Blue)',
        counterpartTitle: 'Found: iPhone Clean Screen, Black Ringke Case',
        confidenceScore: 94,
        dateReported: 'Today, 10:15 AM',
        lostReportId: 1042,
        foundReportId: 2011,
        owner: 'David K.',
        finder: 'Terminal Custodian Staff'
      },
      {
        id: 'M-4088',
        type: 'match',
        tag: 'Matched',
        tagType: 'navy',
        category: 'Personal Item',
        icon: 'wallet',
        location: 'Departures Food Court',
        title: 'Leather Bellroy Wallet (Caramel)',
        counterpartTitle: 'Found: Brown Leather Wallet with ID cards',
        confidenceScore: 88,
        dateReported: 'Today, 09:30 AM',
        lostReportId: 1039,
        foundReportId: 2008,
        owner: 'Siti Rahma',
        finder: 'Cafe Barista'
      },
      {
        id: 'R-8812',
        type: 'report',
        tag: 'New Report',
        tagType: 'gray',
        category: 'Electronics',
        icon: 'laptop',
        location: 'Gate B12 Charging Station',
        title: 'Silver MacBook Pro 14" M3 Pro',
        timeAgo: 'Reported 25m ago',
        description: "Has sticker of 'Tech Summit 2024' on the top shell casing.",
        lostReportId: 1045
      },
      {
        id: 'M-4075',
        type: 'match',
        tag: 'Matched',
        tagType: 'navy',
        category: 'Luggage',
        icon: 'luggage',
        location: 'Carousel 4 Area',
        title: 'Samsonite Hard Case (Navy)',
        counterpartTitle: 'Found: Dark Blue Rolling Case with TSA Lock',
        confidenceScore: 82,
        dateReported: 'Today, 08:00 AM',
        lostReportId: 1031,
        foundReportId: 1998,
        owner: 'Michael Chen',
        finder: 'Baggage Handling Lead'
      },
      {
        id: 'R-8803',
        type: 'report',
        tag: 'New Report',
        tagType: 'gray',
        category: 'Audio',
        icon: 'headphones',
        location: 'Security Checkpoint West',
        title: 'AirPods Pro 2 in Spigen Case',
        timeAgo: 'Reported 1h ago',
        description: "Engraving on underside reads 'ALEX-2023'.",
        lostReportId: 1040
      }
    ];
  }

  static getSystemDiagnostic() {
    return {
      matchingEnginePrecision: '99.8% precision',
      queueThroughput: '0ms delay',
      onDutyAgents: '4 active'
    };
  }
}

export default DashboardModel;
