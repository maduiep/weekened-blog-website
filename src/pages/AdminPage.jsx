import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, ShieldCheck, Trash2, CheckCircle, XCircle, Search, BarChart2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const PLAN_COLORS = {
  weekly: 'var(--color-sport-green)',
  monthly: 'var(--color-primary)',
  annual: 'var(--color-gold)',
};

export default function AdminPage() {
  const { getAllUsers, revokeSubscription, user: adminUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState(null);

  const allUsers = getAllUsers();
  const subscribers = allUsers.filter(u => u.isSubscribed);
  const recentUsers = [...allUsers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  const filtered = allUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'subscribed' && u.isSubscribed) ||
      (filterStatus === 'free' && !u.isSubscribed) ||
      (filterStatus === 'admin' && u.isAdmin);
    return matchesSearch && matchesFilter;
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRevoke = (uid, name) => {
    if (!confirm(`Revoke subscription for ${name}?`)) return;
    revokeSubscription(uid);
    showToast(`Subscription revoked for ${name}`);
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="admin-page">
      {/* Toast */}
      {toast && (
        <motion.div
          className={`admin-toast ${toast.type}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle size={16} /> {toast.msg}
        </motion.div>
      )}

      <div className="container">
        {/* Page Header */}
        <div className="admin-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
              <ShieldCheck size={20} style={{ color: 'var(--color-opinion-purple)' }} />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-opinion-purple)' }}>
                Admin Panel
              </span>
            </div>
            <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)' }}>User Management</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              Signed in as <strong>{adminUser?.email}</strong>
            </p>
          </div>
          <Link to="/" className="btn btn-ghost btn-sm">← Back to Site</Link>
        </div>

        {/* Stats Row */}
        <div className="admin-stats-grid">
          {[
            { icon: <Users size={22} />, label: 'Total Users', value: allUsers.length, color: 'var(--color-primary)' },
            { icon: <CreditCard size={22} />, label: 'Active Subscribers', value: subscribers.length, color: 'var(--color-sport-green)' },
            { icon: <UserPlus size={22} />, label: 'Free Users', value: allUsers.length - subscribers.length, color: 'var(--color-gold)' },
            { icon: <BarChart2 size={22} />, label: 'Conversion Rate', value: allUsers.length > 0 ? `${Math.round((subscribers.length / allUsers.length) * 100)}%` : '0%', color: 'var(--color-opinion-purple)' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="admin-stat-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="admin-stat-icon" style={{ color: stat.color, background: stat.color + '18' }}>
                {stat.icon}
              </div>
              <div className="admin-stat-value">{stat.value}</div>
              <div className="admin-stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Signups */}
        <div className="admin-section">
          <h2 className="admin-section-title">Recent Signups</h2>
          <div className="admin-recent-grid">
            {recentUsers.map((u, i) => (
              <motion.div
                key={u.uid}
                className="admin-recent-card"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="admin-user-avatar">{u.avatar || u.name.charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', truncate: true }}>{u.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {u.isSubscribed
                    ? <span className="admin-badge admin-badge-sub">✓ {u.subscriptionPlan}</span>
                    : <span className="admin-badge admin-badge-free">Free</span>
                  }
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 3 }}>{formatDate(u.createdAt)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Full Users Table */}
        <div className="admin-section">
          <div className="admin-table-header">
            <h2 className="admin-section-title">All Users</h2>
            <div className="admin-controls">
              {/* Filter */}
              <div className="admin-filter-pills">
                {['all', 'subscribed', 'free', 'admin'].map(f => (
                  <button
                    key={f}
                    className={`admin-filter-pill ${filterStatus === f ? 'active' : ''}`}
                    onClick={() => setFilterStatus(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              {/* Search */}
              <div className="admin-search">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search users…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Plan</th>
                  <th>Expires</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>No users found</td></tr>
                ) : filtered.map((u, i) => (
                  <motion.tr
                    key={u.uid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="admin-table-row"
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <div className="admin-user-avatar admin-user-avatar-sm">{u.avatar || u.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{u.name}</div>
                          {u.isAdmin && <span style={{ fontSize: 10, color: 'var(--color-opinion-purple)', fontWeight: 700 }}>ADMIN</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                    <td>
                      {u.isSubscribed
                        ? <span className="admin-badge admin-badge-sub"><CheckCircle size={12} /> Active</span>
                        : <span className="admin-badge admin-badge-free"><XCircle size={12} /> Free</span>
                      }
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)' }}>
                      {u.subscriptionPlan
                        ? <span style={{ color: PLAN_COLORS[u.subscriptionPlan] || 'inherit', fontWeight: 600, textTransform: 'capitalize' }}>
                            {u.subscriptionPlan}
                          </span>
                        : <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                      }
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDate(u.subscriptionExpiry)}</td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                        {u.isSubscribed && !u.isAdmin && (
                          <button
                            className="admin-action-btn admin-action-revoke"
                            onClick={() => handleRevoke(u.uid, u.name)}
                            title="Revoke subscription"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        {u.isAdmin && (
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Protected</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)' }}>
            Showing {filtered.length} of {allUsers.length} users
          </p>
        </div>
      </div>
    </div>
  );
}
