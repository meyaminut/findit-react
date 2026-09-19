import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Users, 
  LogOut, 
  CheckCheck, 
  Ticket, 
  Package, 
  MessageSquareHeart,
  Inbox
} from 'lucide-react';
import { StorageService } from '../../../services/StorageService';
import './TopNavbar.css';

/**
 * View Component: TopNavbar
 * Renders the top search, interactive operational notification popover,
 * and user administrator profile dropdown.
 */
export function TopNavbar({ 
  searchQuery = '', 
  onSearchChange,
  onProfileClick,
  onNavChange,
  onLogout,
  userName = 'Admin',
  userRole = 'Operations Admin',
  userAvatar = ''
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('findit_read_notifs') || '[]');
    } catch {
      return [];
    }
  });

  const [tickets, setTickets] = useState(() => StorageService.getTickets());
  const [items, setItems] = useState(() => StorageService.getFoundItems());

  const containerRef = useRef(null);

  // Sync tickets and items
  useEffect(() => {
    const handleSync = () => {
      setTickets(StorageService.getTickets());
      setItems(StorageService.getFoundItems());
    };
    window.addEventListener('findit_tickets_updated', handleSync);
    window.addEventListener('findit_items_updated', handleSync);
    return () => {
      window.removeEventListener('findit_tickets_updated', handleSync);
      window.removeEventListener('findit_items_updated', handleSync);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate dynamic operational notifications from real data
  const notifications = useMemo(() => {
    const notifs = [];

    // 1. Pending tickets
    tickets
      .filter((t) => t.status === 'Menunggu Verifikasi')
      .forEach((t) => {
        notifs.push({
          id: `ticket-${t.id}`,
          title: `Klaim Menunggu Verifikasi: ${t.id}`,
          desc: `${t.guestName}${t.roomNumber ? ` (Kamar ${t.roomNumber})` : ''} melapor kehilangan ${t.itemName}.`,
          time: t.reportedAt || 'Baru saja',
          type: 'amber',
          icon: Ticket,
          nav: 'Verifikasi'
        });
      });

    // 2. Found items in safe
    items
      .filter((item) => item.status === 'Di Brankas FO' || !item.status)
      .slice(0, 3)
      .forEach((item) => {
        notifs.push({
          id: `item-${item.id}`,
          title: `Barang Fisik Baru: ${item.id}`,
          desc: `${item.name} ditemukan di ${item.locationFound || 'Kamar'} (${item.storageLocation || 'Brankas FO'}).`,
          time: item.foundAt || 'Hari ini',
          type: 'blue',
          icon: Package,
          nav: 'Barang Temuan'
        });
      });

    // 3. Proactive follow-up notice
    notifs.push({
      id: 'system-checkout-survey',
      title: 'Deteksi Proaktif Pasca-Checkout',
      desc: 'Sistem siap mengirimkan survei follow-up barang tertinggal kepada tamu checkout.',
      time: '10 menit lalu',
      type: 'green',
      icon: MessageSquareHeart,
      nav: 'Follow-up Checkout'
    });

    return notifs;
  }, [tickets, items]);

  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readNotifIds.includes(n.id)).length;
  }, [notifications, readNotifIds]);

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifIds(allIds);
    localStorage.setItem('findit_read_notifs', JSON.stringify(allIds));
  };

  const handleNotifClick = (notif) => {
    if (!readNotifIds.includes(notif.id)) {
      const next = [...readNotifIds, notif.id];
      setReadNotifIds(next);
      localStorage.setItem('findit_read_notifs', JSON.stringify(next));
    }
    setIsNotifOpen(false);
    if (onNavChange && notif.nav) {
      onNavChange(notif.nav);
    }
  };

  return (
    <header className="dashboard-top-navbar">
      {/* Search Input Bar */}
      <div className="top-search-wrapper">
        <Search size={16} className="search-icon-muted" />
        <input
          type="text"
          className="top-search-input"
          placeholder="Press / or search reports, items, ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>

      {/* Right Controls Container */}
      <div className="top-right-controls-wrap" ref={containerRef}>
        {/* Notification Bell Button */}
        <button
          type="button"
          className="notification-bell-btn"
          title={`${unreadCount} Notifikasi Operasional Baru`}
          onClick={() => {
            setIsNotifOpen((prev) => !prev);
            setIsProfileOpen(false);
          }}
        >
          <Bell size={18} className="bell-icon" />
          {unreadCount > 0 && (
            <span className="bell-badge-yellow">{unreadCount}</span>
          )}
        </button>

        {/* Floating Notification Popover */}
        {isNotifOpen && (
          <div className="notification-popover-dropdown">
            <div className="notif-popover-header">
              <div className="notif-title-wrap">
                <span className="notif-title-text">Notifikasi Operasional</span>
                {unreadCount > 0 && (
                  <span className="notif-unread-badge">{unreadCount} baru</span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="btn-mark-all-read"
                  onClick={handleMarkAllRead}
                >
                  <CheckCheck size={13} style={{ marginRight: '3px' }} />
                  Tandai Dibaca
                </button>
              )}
            </div>

            <div className="notif-list-scroll">
              {notifications.length === 0 ? (
                <div className="notif-empty-state">
                  <Inbox size={24} style={{ opacity: 0.4 }} />
                  <span>Tidak ada notifikasi baru saat ini.</span>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.icon;
                  const isUnread = !readNotifIds.includes(n.id);
                  return (
                    <div
                      key={n.id}
                      className={`notif-item ${isUnread ? 'unread' : ''}`}
                      onClick={() => handleNotifClick(n)}
                    >
                      <div className={`notif-icon-circle ${n.type}`}>
                        <Icon size={16} />
                      </div>
                      <div className="notif-text-wrap">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-desc">{n.desc}</span>
                        <span className="notif-item-time">{n.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="notif-popover-footer">
              Semua sistem Grand Melia tersinkronisasi real-time
            </div>
          </div>
        )}

        {/* User Profile Badge */}
        <div 
          className="user-profile-badge" 
          onClick={() => {
            if (onProfileClick) {
              onProfileClick();
            } else {
              setIsProfileOpen((prev) => !prev);
              setIsNotifOpen(false);
            }
          }}
          title="Klik untuk membuka menu administrator"
        >
          <div className="user-avatar-wrap">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="user-profile-img"
              />
            ) : (
              <div className="user-profile-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00164E', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-profile-text">
            <span className="user-full-name">{userName}</span>
            <span className="user-job-role">{userRole}</span>
          </div>
          <ChevronDown size={14} style={{ color: '#94A3B8', marginLeft: '4px' }} />
        </div>

        {/* User Profile Dropdown */}
        {isProfileOpen && (
          <div className="user-profile-dropdown">
            <div className="profile-dropdown-header">
              <span className="profile-name">{userName}</span>
              <span className="profile-role">{userRole}</span>
              <span className="profile-branch">Grand Melia Jakarta</span>
            </div>

            <button
              type="button"
              className="profile-item-btn"
              onClick={() => {
                setIsProfileOpen(false);
                if (onNavChange) onNavChange('Kelola Pekerja');
              }}
            >
              <Users size={15} />
              <span>Kelola Pekerja &amp; Attendant</span>
            </button>

            <button
              type="button"
              className="profile-item-btn danger"
              onClick={() => {
                setIsProfileOpen(false);
                if (onLogout) onLogout();
              }}
            >
              <LogOut size={15} />
              <span>Logout Sistem</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopNavbar;
