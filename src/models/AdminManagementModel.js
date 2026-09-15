/**
 * Model: AdminManagementModel
 * Provides administrative data, access protocols, and operational staff directory.
 * Adheres strictly to the Grand Melia Find!t Operations Admin Architecture.
 */

export const INITIAL_ADMINS = [
  {
    id: 'adm-01',
    name: 'Sarah Jenkins',
    role: 'Senior Operations Admin',
    email: 'sarah.j@findit.internal',
    dateAdded: 'Jan 12, 2024',
    lastActive: 'Just now',
    status: 'active',
    isCurrentUser: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'adm-02',
    name: 'Reza Pratama',
    role: 'Operations Specialist',
    email: 'reza.p@findit.internal',
    dateAdded: 'Feb 04, 2024',
    lastActive: '14 mins ago',
    status: 'active',
    isCurrentUser: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'adm-03',
    name: 'Marcus Brody',
    role: 'Intake Supervisor',
    email: 'm.brody@findit.internal',
    dateAdded: 'Mar 19, 2024',
    lastActive: '2 hours ago',
    status: 'active',
    isCurrentUser: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'adm-04',
    name: 'Ananya Sharma',
    role: 'Match Verification Lead',
    email: 'ananya.s@findit.internal',
    dateAdded: 'May 10, 2024',
    lastActive: 'Yesterday',
    status: 'active',
    isCurrentUser: false,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'adm-05',
    name: 'Siti Rahma',
    role: 'Auditor & Catalog Lead',
    email: 'siti.r@findit.internal',
    dateAdded: 'Jun 01, 2024',
    lastActive: '3 days ago',
    status: 'active',
    isCurrentUser: false,
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80'
  }
];

export const ACCESS_PROTOCOL = {
  title: 'EQUAL PRIVILEGE ACCESS PROTOCOL',
  description:
    'All admin accounts have equal access permissions — there are no admin tiers in this system. Every administrator can review matches, moderate reports, and update inventory statuses.',
  policyVersion: 'RBAC v2.4'
};

export const ADMIN_METRICS = {
  authorizedSeats: {
    activeCount: 5,
    totalAllocated: 10
  },
  recentActivity: {
    activeCount: 4,
    unit: 'Accounts'
  },
  securityEnforcement: {
    status: 'MFA Enabled'
  }
};
