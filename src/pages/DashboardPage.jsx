import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User as UserIcon, CreditCard, Settings, Clock, Star, Download, Database } from 'lucide-react';
import { articles } from '../data/articles';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user: authUser, isSubscribed } = useAuth();
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (ebook) => {
    if (!isSubscribed) {
      alert('Subscription required to download E-Papers.');
      return;
    }
    setDownloading(ebook.id);
    setTimeout(() => {
      setDownloading(null);
      alert(`Success! ${ebook.title} PDF download started.`);
    }, 1500);
  };

  // Use real auth user data, fall back to display defaults
  const user = {
    name: authUser?.name || 'Reader',
    email: authUser?.email || '',
    avatar: authUser?.avatar || authUser?.name?.charAt(0) || 'R',
    memberSince: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
    subscription: {
      status: authUser?.isSubscribed ? 'Active' : 'Free',
      plan: authUser?.subscriptionPlan
        ? authUser.subscriptionPlan.charAt(0).toUpperCase() + authUser.subscriptionPlan.slice(1) + ' Digital Access'
        : 'No Active Plan',
      price: authUser?.subscriptionPlan === 'weekly' ? 'P9.00' : authUser?.subscriptionPlan === 'annual' ? 'P330.00' : 'P60.00',
      nextBilling: authUser?.subscriptionExpiry
        ? new Date(authUser.subscriptionExpiry).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })
        : '—',
    },
    savedArticles: articles.slice(0, 3),
    ebooks: [
      { id: 'ep-0422', title: '18 April 2026 Publication', date: 'April 18, 2026' },
      { id: 'ep-0415', title: '11 April 2026 Publication', date: 'April 11, 2026' },
    ],
  };

  const tabs = [
    { id: 'overview',      label: 'Overview',          icon: <UserIcon size={18} /> },
    { id: 'subscription',  label: 'Plan & Billing',    icon: <CreditCard size={18} /> },
    { id: 'library',       label: 'My Library',        icon: <BookOpen size={18} /> },
    { id: 'settings',      label: 'Account Settings',  icon: <Settings size={18} /> },
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-layout">

          {/* ── Sidebar ── */}
          <aside className="dashboard-sidebar">
            <div className="dashboard-profile">
              <div className="dashboard-avatar">{user.avatar}</div>
              <h3 className="dashboard-name">{user.name}</h3>
              <p className="dashboard-email">{user.email}</p>
              {authUser?.isSubscribed && (
                <span className="dashboard-sub-chip">✓ {authUser.subscriptionPlan} subscriber</span>
              )}
            </div>

            {/* Mobile: horizontal tab bar; Desktop: vertical nav */}
            <nav className="dashboard-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`dashboard-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Main Content ── */}
          <main className="dashboard-content">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <h1 className="dashboard-heading">Welcome back, {user.name.split(' ')[0]}</h1>

                <div className="dashboard-stats">
                  <div className="dashboard-stat-card" style={{ borderLeft: '4px solid var(--color-gold)' }}>
                    <div className="dashboard-stat-label">Subscription Status</div>
                    <div className="dashboard-stat-value" style={{ color: authUser?.isSubscribed ? '#2ecc71' : 'var(--color-text-muted)' }}>
                      <span className="dashboard-dot" style={{ background: authUser?.isSubscribed ? '#2ecc71' : 'var(--color-border)' }} />
                      {user.subscription.status}
                    </div>
                    <div className="dashboard-stat-meta">
                      {authUser?.isSubscribed ? `Renews ${user.subscription.nextBilling}` : 'Subscribe to unlock full access'}
                    </div>
                  </div>

                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-label">Purchased E-Papers</div>
                    <div className="dashboard-stat-value">{user.ebooks.length} Issues</div>
                    <Link to="/epaper" className="dashboard-stat-link">Browse archive →</Link>
                  </div>

                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-label">Saved Articles</div>
                    <div className="dashboard-stat-value">{user.savedArticles.length} Articles</div>
                    <div className="dashboard-stat-meta">Read later queue</div>
                  </div>
                </div>

                {/* Recent Saved Articles */}
                <div className="dashboard-card">
                  <h3 className="dashboard-card-title">Recent Saved Articles</h3>
                  <div className="dashboard-article-list">
                    {user.savedArticles.map(article => (
                      <div key={article.id} className="dashboard-article-row">
                        <img src={article.image} alt="" className="dashboard-article-thumb" />
                        <div className="dashboard-article-info">
                          <Link to={`/article/${article.id}`} className="dashboard-article-title">
                            {article.title}
                          </Link>
                          <div className="dashboard-article-meta">
                            <Clock size={12} /> Saved recently
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab('library')} className="btn btn-ghost btn-block" style={{ marginTop: 'var(--space-md)' }}>
                    View All Saved Content
                  </button>
                </div>

                {/* API & System Integration - NEW SECTION */}
                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', borderLeft: '4px solid var(--color-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                    <h3 className="dashboard-card-title" style={{ margin: 0 }}>
                      <Database size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      API Connectivity & Platform Health
                    </h3>
                    <span className="badge badge-news" style={{ fontSize: '9px', background: '#2ecc71', animation: 'pulse 2s infinite' }}>Live Connection</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                    <div style={{ padding: 'var(--space-md)', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>BSE Data Feed</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71', fontWeight: 700, fontSize: '13px' }}>
                        <div style={{ width: '6px', height: '6px', background: '#2ecc71', borderRadius: '50%' }} /> Connected
                      </div>
                    </div>
                    <div style={{ padding: 'var(--space-md)', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Payment Gateway</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71', fontWeight: 700, fontSize: '13px' }}>
                        <div style={{ width: '6px', height: '6px', background: '#2ecc71', borderRadius: '50%' }} /> Active
                      </div>
                    </div>
                    <div style={{ padding: 'var(--space-md)', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Archive API</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71', fontWeight: 700, fontSize: '13px' }}>
                        <div style={{ width: '6px', height: '6px', background: '#2ecc71', borderRadius: '50%' }} /> v2.4 Online
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscribe CTA if not subscribed */}
                {!authUser?.isSubscribed && (
                  <div className="dashboard-cta-card">
                    <h3>Unlock Full Access</h3>
                    <p>Subscribe to read unlimited articles, download E-Papers, and get exclusive content.</p>
                    <Link to="/subscribe" className="btn btn-primary btn-lg">
                      View Plans & Subscribe
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* PLAN & BILLING */}
            {activeTab === 'subscription' && (
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Plan & Billing</h2>

                <div className="dashboard-plan-box">
                  <div className="dashboard-plan-header">
                    <div>
                      <h3 style={{ color: 'var(--color-primary)' }}>{user.subscription.plan}</h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{user.subscription.price} per billing cycle</p>
                    </div>
                    <span className="badge" style={{ background: authUser?.isSubscribed ? '#e8f8f5' : 'var(--color-bg-alt)', color: authUser?.isSubscribed ? '#2ecc71' : 'var(--color-text-muted)' }}>
                      {user.subscription.status}
                    </span>
                  </div>
                  {authUser?.isSubscribed && (
                    <div className="dashboard-plan-note">
                      Your next charge of <strong>{user.subscription.price}</strong> is on <strong>{user.subscription.nextBilling}</strong>.
                    </div>
                  )}
                  <div className="dashboard-plan-actions">
                    {authUser?.isSubscribed
                      ? <button className="btn btn-primary">Update Payment Method</button>
                      : <Link to="/subscribe" className="btn btn-primary">Subscribe Now</Link>
                    }
                    {authUser?.isSubscribed && (
                      <button className="btn btn-ghost" style={{ color: 'var(--color-news-red)' }}>Cancel Subscription</button>
                    )}
                  </div>
                </div>

                <h3 style={{ margin: 'var(--space-xl) 0 var(--space-md)', fontSize: 'var(--text-lg)' }}>Billing History</h3>
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {authUser?.isSubscribed
                        ? ['April 12, 2026', 'March 12, 2026', 'February 12, 2026'].map((date, i) => (
                            <tr key={i}>
                              <td style={{ color: 'var(--color-text-muted)' }}>{date}</td>
                              <td style={{ fontWeight: 500 }}>{user.subscription.plan}</td>
                              <td>{user.subscription.price}</td>
                              <td style={{ color: '#2ecc71', fontWeight: 600 }}>Paid</td>
                            </tr>
                          ))
                        : (
                          <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-xl)' }}>No billing history yet</td></tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LIBRARY */}
            {activeTab === 'library' && (
              <>
                <h2 className="dashboard-heading">My Library</h2>

                <div className="dashboard-card">
                  <h3 className="dashboard-card-title">
                    <BookOpen size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    E-Papers Collection
                  </h3>
                  <div className="dashboard-ebooks-grid">
                    {user.ebooks.map((ebook, i) => (
                      <div key={i} className="dashboard-ebook-card">
                        <div className="dashboard-ebook-cover">
                          <BookOpen size={40} style={{ opacity: 0.2 }} />
                        </div>
                        <h4 className="dashboard-ebook-title">{ebook.title}</h4>
                        <div className="dashboard-ebook-date">Purchased: {ebook.date}</div>
                        <button 
                          onClick={() => handleDownload(ebook)}
                          disabled={downloading === ebook.id}
                          className="btn btn-ghost btn-sm btn-block" 
                          style={{ border: '1px solid currentColor', marginTop: 'var(--space-sm)' }}
                        >
                          {downloading === ebook.id ? 'Preparing...' : <><Download size={14} /> Download PDF</>}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3 className="dashboard-card-title">
                    <Star size={20} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                    Saved Articles
                  </h3>
                  <div className="dashboard-article-list">
                    {user.savedArticles.map(article => (
                      <div key={article.id} className="dashboard-article-row">
                        <img src={article.image} alt="" className="dashboard-article-thumb dashboard-article-thumb-lg" />
                        <div className="dashboard-article-info">
                          <Link to={`/category/${article.category}`} className="dashboard-article-cat">{article.category}</Link>
                          <Link to={`/article/${article.id}`} className="dashboard-article-title">{article.title}</Link>
                          <div className="dashboard-article-meta">
                            <Clock size={12} /> {article.readTime} • Saved recently
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Account Settings</h2>
                <form onSubmit={e => e.preventDefault()} className="dashboard-settings-form">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" defaultValue={user.name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" defaultValue={user.email} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" placeholder="+267 7X XXX XXX" />
                  </div>

                  <h3 style={{ margin: 'var(--space-xl) 0 var(--space-md)', fontSize: 'var(--text-lg)' }}>Change Password</h3>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" />
                  </div>

                  <h3 style={{ margin: 'var(--space-xl) 0 var(--space-md)', fontSize: 'var(--text-lg)' }}>Email Preferences</h3>
                  <label className="form-checkbox"><input type="checkbox" defaultChecked /><span>Daily News Briefing</span></label>
                  <label className="form-checkbox"><input type="checkbox" defaultChecked /><span>Weekly E-Paper Alerts</span></label>
                  <label className="form-checkbox" style={{ marginBottom: 'var(--space-xl)' }}><input type="checkbox" /><span>Partner Offers</span></label>

                  <button type="submit" className="btn btn-primary btn-lg">Save Settings</button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
