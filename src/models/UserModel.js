/**
 * Model: UserModel
 * Represents the `users` table in database `u278523899_findit`
 */
export class UserModel {
  constructor({
    id = null,
    name = '',
    email = '',
    phone = null,
    role = 'user',
    email_verified_at = null,
    remember_token = null,
    created_at = null,
    updated_at = null
  } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.role = role; // 'admin' | 'user'
    this.email_verified_at = email_verified_at;
    this.remember_token = remember_token;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  /**
   * Check if current user has administrator role
   */
  isAdmin() {
    return this.role?.toLowerCase() === 'admin';
  }

  /**
   * Check if user is eligible for internal operations console access
   */
  hasOperationalAccess() {
    return this.isAdmin() && this.email.endsWith('@findit.internal');
  }

  /**
   * Static helper: list of default seeded users
   */
  static getSeedUsers() {
    return [
      new UserModel({
        id: 1,
        name: 'FindIt Operations Lead',
        email: 'admin@findit.internal',
        phone: '+6281234567890',
        role: 'admin',
        email_verified_at: '2026-09-01T08:00:00Z',
        created_at: '2026-09-01T08:00:00Z'
      }),
      new UserModel({
        id: 2,
        name: 'IT Security Officer',
        email: 'security@findit.internal',
        phone: '+6281987654321',
        role: 'admin',
        email_verified_at: '2026-09-02T09:30:00Z',
        created_at: '2026-09-02T09:30:00Z'
      })
    ];
  }
}

export default UserModel;
