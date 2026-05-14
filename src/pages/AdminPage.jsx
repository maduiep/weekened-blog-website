import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CreditCard, ShieldCheck, Trash2, CheckCircle, XCircle, Search, BarChart2, UserPlus, TrendingUp, TrendingDown, DollarSign, Eye, Play, Filter, Download, LayoutDashboard, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const PLAN_COLORS = {
  weekly: 'var(--color-sport-green)',
  monthly: 'var(--color-primary)',
  annual: 'var(--color-gold)',
};

const RANGE_COLORS = {
  monthly: 'var(--color-primary)',
  weekly: 'var(--color-gold)',
  daily: 'var(--color-sport-green)',
};

export default function AdminPage() {
  const { getAllUsers, revokeSubscription, user: adminUser } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // Default to analytics for "WOW" factor
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState(null);

  const allUsers = getAllUsers();
  const subscribers = allUsers.filter(u => u.isSubscribed);

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

  // Mock Analytics Data with timeframe support
  const [timeRange, setTimeRange] = useState('monthly');
  
  const totalSubscribers = subscribers.length;
  
  const analyticsData = {
    monthly: [
      { label: 'Jan', value: 4500, count: 75 },
      { label: 'Feb', value: 5200, count: 88 },
      { label: 'Mar', value: 4800, count: 82 },
      { label: 'Apr', value: 6100, count: 104 },
      { label: 'May', value: 7500, count: totalSubscribers }, // Automated linked value
    ],
    weekly: [
      { label: 'Week 1', value: 1200, count: 15 },
      { label: 'Week 2', value: 1800, count: 22 },
      { label: 'Week 3', value: 1500, count: 18 },
      { label: 'Week 4', value: 2100, count: 28 },
    ],
    daily: [
      { label: 'Mon', value: 300, count: 4 },
      { label: 'Tue', value: 450, count: 6 },
      { label: 'Wed', value: 380, count: 5 },
      { label: 'Thu', value: 520, count: 8 },
      { label: 'Fri', value: 600, count: 10 },
      { label: 'Sat', value: 400, count: 5 },
      { label: 'Sun', value: 350, count: 4 },
    ],
    conversionFunnel: [
      { stage: 'Site Visits', count: 15400, percent: 100, color: 'var(--color-primary)' },
      { stage: 'Article Views', count: 12200, percent: 79, color: 'var(--color-primary)' },
      { stage: 'Sign Ups', count: 3100, percent: 20, color: 'var(--color-gold)' },
      { stage: 'Subscribers', count: 840, percent: 5, color: 'var(--color-sport-green)' },
    ],
    topArticles: [
      { title: 'Oil price dip masks supply issues', views: '12.4K', engagement: '85%', revenue: 'P1,240' },
      { title: 'Household Loan Defaults Surge', views: '10.1K', engagement: '92%', revenue: 'P980' },
      { title: 'Sports Infrastructure Letdown', views: '8.2K', engagement: '78%', revenue: 'P750' },
    ]
  };

  const activeChartData = analyticsData[timeRange];
  const maxValue = Math.max(...activeChartData.map(d => d.value));

  return (
    <div className="admin-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`admin-toast ${toast.type}`}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, background: 'var(--color-dark)', color: 'white', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-xl)' }}
          >
            {toast.type === 'success' ? <CheckCircle size={18} color="var(--color-sport-green)" /> : <XCircle size={18} color="var(--color-news-red)" />}
            <span style={{ fontWeight: 600 }}>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
        {/* Page Header */}
        <div className="admin-header" style={{ marginBottom: 'var(--space-3xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-xl)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--color-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <LayoutDashboard size={20} />
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--color-primary)' }}>
                  Platform Control
                </span>
                <h1 style={{ fontSize: 'var(--text-3xl)', margin: 0 }}>Business Overview</h1>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
              Performance monitoring for <span style={{ color: 'var(--color-dark)', fontWeight: 700 }}>{adminUser?.email}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <button className="btn btn-ghost btn-sm" style={{ background: 'white' }} onClick={() => showToast('Report generation started...', 'success')}>
              <Download size={14} /> Export CSV
            </button>
            <Link to="/" className="btn btn-primary btn-sm">View Website</Link>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
          {[
            { icon: <Users size={20} />, label: 'Total Users', value: allUsers.length, change: '+12%', color: 'var(--color-primary)' },
            { icon: <CreditCard size={20} />, label: 'Active Subs', value: subscribers.length, change: '+8%', color: 'var(--color-sport-green)' },
            { icon: <DollarSign size={20} />, label: 'MTD Revenue', value: 'P7,500', change: '+24%', color: 'var(--color-gold)' },
            { icon: <Database size={20} />, label: 'Data Points', value: '42.8K', change: '+1.2K', color: 'var(--color-opinion-purple)' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="admin-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ background: 'white', border: '1px solid var(--color-border)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ color: stat.color, background: 'rgba(0,126,151,0.1)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: stat.color }}>{stat.change}</span>
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', background: '#e2e8f0', padding: '4px', borderRadius: '12px', width: 'fit-content', marginBottom: 'var(--space-xl)' }}>
          <button 
            onClick={() => setActiveTab('analytics')}
            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'analytics' ? 'white' : 'transparent', color: activeTab === 'analytics' ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <BarChart2 size={16} /> Insights
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'users' ? 'white' : 'transparent', color: activeTab === 'users' ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Users size={16} /> Customers
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'analytics' ? (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                {/* Revenue Breakdown */}
                <div className="admin-card" style={{ background: 'white', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-lg)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TrendingUp size={18} color="var(--color-sport-green)" /> Revenue Breakdown
                      </h3>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 4 }}>Live financial performance and subscriber growth.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                      <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                        {['monthly', 'weekly', 'daily'].map(range => (
                          <button 
                            key={range}
                            onClick={() => setTimeRange(range)}
                            style={{ padding: '4px 12px', border: 'none', borderRadius: '6px', background: timeRange === range ? 'white' : 'transparent', color: timeRange === range ? 'var(--color-primary)' : 'var(--color-text-muted)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', boxShadow: timeRange === range ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                          >
                            {range.charAt(0)}
                          </button>
                        ))}
                      </div>
                      <button className="btn btn-sm" style={{ padding: '4px 10px', fontSize: '10px', background: 'var(--color-primary)', color: 'white' }} onClick={() => showToast('Financial report downloading...', 'success')}>
                        <Download size={12} /> Export Report
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', height: '240px', gap: '12px', padding: '20px 0 10px', position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
                    {/* Y-Axis Guideline */}
                    <div style={{ position: 'absolute', left: 0, right: 0, top: '20px', borderTop: '1px dashed #f1f5f9', zIndex: 0 }} />
                    <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px dashed #f1f5f9', zIndex: 0 }} />
                    
                    {activeChartData.map((item, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', justifyContent: 'flex-end', zIndex: 1 }}>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(item.value / maxValue) * 100}%` }}
                          transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.05 }}
                          style={{ width: '100%', background: `linear-gradient(to top, ${RANGE_COLORS[timeRange]}, ${RANGE_COLORS[timeRange]}dd)`, borderRadius: '6px 6px 2px 2px', position: 'relative' }} 
                          className="bar-hover"
                        >
                          <div className="bar-tooltip" style={{ position: 'absolute', top: '-45px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-dark)', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap', opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none', boxShadow: 'var(--shadow-md)', zIndex: 10 }}>
                            <div style={{ color: RANGE_COLORS[timeRange], marginBottom: 2, filter: 'brightness(1.5)' }}>P{item.value.toLocaleString()}</div>
                            <div style={{ opacity: 0.8 }}>{item.count} Subscribers</div>
                            <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid var(--color-dark)' }} />
                          </div>
                        </motion.div>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      <div style={{ width: 8, height: 8, background: RANGE_COLORS[timeRange], borderRadius: '2px' }} /> Revenue (Pula)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      <div style={{ width: 8, height: 8, background: '#cbd5e1', borderRadius: '2px' }} /> Baseline
                    </div>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="admin-card" style={{ background: 'white', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 8 }}><Filter size={18} color="var(--color-gold)" /> Conversion Funnel</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analyticsData.conversionFunnel.map((step, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                          <span style={{ fontWeight: 600 }}>{step.stage}</span>
                          <span style={{ color: 'var(--color-text-muted)' }}>{step.count.toLocaleString()} ({step.percent}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '12px', background: 'var(--color-bg-alt)', borderRadius: '6px', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${step.percent}%` }} 
                            transition={{ duration: 1, delay: i * 0.1 }}
                            style={{ height: '100%', background: step.color }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Value Report */}
              <div className="admin-card" style={{ background: 'white', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Database size={18} color="var(--color-primary)" /> Content Value Report</h3>
                  <button className="btn btn-ghost btn-sm">Full Report</button>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Asset Title</th>
                        <th>Impressions</th>
                        <th>Engagement</th>
                        <th>Est. Revenue</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topArticles.map((art, i) => (
                        <tr key={i} className="admin-table-row">
                          <td style={{ fontWeight: 700, fontSize: '13px' }}>{art.title}</td>
                          <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={14} /> {art.views}</div></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: art.engagement, height: '100%', background: 'var(--color-primary)' }} />
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: 600 }}>{art.engagement}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--color-sport-green)', fontWeight: 700 }}>{art.revenue}</td>
                          <td><span className="badge badge-default" style={{ fontSize: '10px' }}>Viral</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-xl)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Search customers by name or email..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '13px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'subscribed', 'free'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setFilterStatus(f)}
                        style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid ' + (filterStatus === f ? 'var(--color-primary)' : 'var(--color-border)'), background: filterStatus === f ? 'var(--color-primary)' : 'white', color: filterStatus === f ? 'white' : 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Contact</th>
                        <th>Plan</th>
                        <th>Expiry</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u) => (
                        <tr key={u.uid} className="admin-table-row">
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>
                                {u.avatar || u.name.charAt(0)}
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '13px' }}>{u.name}</div>
                            </div>
                          </td>
                          <td style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{u.email}</td>
                          <td>
                            {u.isSubscribed ? (
                              <span style={{ color: PLAN_COLORS[u.subscriptionPlan], fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}>
                                {u.subscriptionPlan}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>Free Tier</span>
                            )}
                          </td>
                          <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{formatDate(u.subscriptionExpiry)}</td>
                          <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{formatDate(u.createdAt)}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {u.isSubscribed && !u.isAdmin && (
                                <button className="admin-action-btn admin-action-revoke" title="Revoke Access" onClick={() => handleRevoke(u.uid, u.name)}>
                                  <Trash2 size={14} />
                                </button>
                              )}
                              <button className="admin-action-btn" title="View Details" style={{ color: 'var(--color-primary)', background: 'rgba(0,126,151,0.05)' }}>
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .bar-hover:hover .bar-tooltip { opacity: 1 !important; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted); border-bottom: 1px solid var(--color-border); }
        .admin-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .admin-table-row:hover td { background: #f8fafc; }
        .admin-action-btn { width: 32px; height: 32px; borderRadius: 8px; border: none; background: #fff; border: 1px solid var(--color-border); cursor: pointer; display: flex; alignItems: center; justifyContent: center; transition: all 0.2s; }
        .admin-action-revoke { color: var(--color-news-red); background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.1); }
        .admin-action-revoke:hover { background: var(--color-news-red); color: white; }
      `}</style>
    </div>
  );
}
