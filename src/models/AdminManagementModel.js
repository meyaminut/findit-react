/**
 * Model: AdminManagementModel
 * Provides administrative data, access protocols, and operational staff directory.
 * Starts empty — real admin data is managed via the UI.
 */

export const INITIAL_ADMINS = [];

export const ACCESS_PROTOCOL = {
  title: 'EQUAL PRIVILEGE ACCESS PROTOCOL',
  description:
    'All admin accounts have equal access permissions — there are no admin tiers in this system. Every administrator can review matches, moderate reports, and update inventory statuses.',
  policyVersion: 'RBAC v2.4'
};

export const ADMIN_METRICS = {
  authorizedSeats: {
    activeCount: 0,
    totalAllocated: 10
  },
  recentActivity: {
    activeCount: 0,
    unit: 'Accounts'
  },
  securityEnforcement: {
    status: 'MFA Enabled'
  }
};
