import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  User as UserIcon,
  CreditCard,
  Settings,
  Clock,
  Star,
  Download,
  Database,
} from "lucide-react";
import { articles } from "../data/articles";
import { useAuth } from "../context/AuthContext";
import { Megaphone, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user: authUser, isSubscribed } = useAuth();
  const [downloading, setDownloading] = useState(null);
  
  // Advert Request States
  const [adRequests, setAdRequests] = useState(() => {
    return JSON.parse(localStorage.getItem('wp_ad_requests') || '[]')
      .filter(ad => ad.userId === authUser?.uid);
  });
  const [adForm, setAdForm] = useState({ title: '', category: 'Business', type: 'banner', duration: '1 week', imageUrl: '' });
  const [adSubmitting, setAdSubmitting] = useState(false);

  const transactions = JSON.parse(localStorage.getItem('wp_transactions') || '[]')
    .filter(t => t.email === authUser?.email || !t.email)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDownload = (ebook) => {
    if (!isSubscribed) {
      alert("Subscription required to download E-Papers.");
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
    name: authUser?.name || "Reader",
    email: authUser?.email || "",
    avatar: authUser?.avatar || authUser?.name?.charAt(0) || "R",
    memberSince: authUser?.createdAt
      ? new Date(authUser.createdAt).toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
    subscription: {
      status: authUser?.isSubscribed ? "Active" : "Free",
      plan: authUser?.subscriptionTier
        ? `${authUser.subscriptionTier} Access`
        : authUser?.subscriptionPlan === "storypass"
          ? "One Story Pass"
          : authUser?.subscriptionPlan
            ? authUser.subscriptionPlan.charAt(0).toUpperCase() +
              authUser.subscriptionPlan.slice(1) +
              " Digital Access"
            : "No Active Plan",
      price:
        authUser?.subscriptionPlan === "storypass"
          ? "P15.00"
          : authUser?.subscriptionPlan === "corporate"
            ? "P1,250.00"
            : authUser?.subscriptionPlan === "enterprise"
              ? "P2,400.00"
              : "—",
      nextBilling: authUser?.subscriptionExpiry
        ? new Date(authUser.subscriptionExpiry).toLocaleDateString("en-GB", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "—",
    },
    savedArticles: articles.slice(0, 3),
    ebooks: [
      {
        id: "ep-0422",
        title: "18 April 2026 Publication",
        date: "April 18, 2026",
      },
      {
        id: "ep-0415",
        title: "11 April 2026 Publication",
        date: "April 11, 2026",
      },
    ],
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <UserIcon size={18} /> },
    {
      id: "subscription",
      label: "Plan & Billing",
      icon: <CreditCard size={18} />,
    },
    { id: "library", label: "My Library", icon: <BookOpen size={18} /> },
    { id: "settings", label: "Account Settings", icon: <Settings size={18} /> },
    { id: "api", label: "Developer API", icon: <Database size={18} /> },
  ];

  if (authUser?.subscriptionPlan === 'corporate' || authUser?.subscriptionPlan === 'enterprise') {
    tabs.splice(2, 0, { id: "adverts", label: "Adverts & Corporate", icon: <Megaphone size={18} /> });
  }

  const handleAdSubmit = (e) => {
    e.preventDefault();
    setAdSubmitting(true);
    setTimeout(() => {
      const newAd = {
        id: `ADREQ-${Date.now().toString().slice(-6)}`,
        userId: authUser?.uid,
        userName: authUser?.name || 'Corporate User',
        date: new Date().toISOString(),
        status: 'Pending',
        ...adForm
      };
      const allAds = JSON.parse(localStorage.getItem('wp_ad_requests') || '[]');
      localStorage.setItem('wp_ad_requests', JSON.stringify([newAd, ...allAds]));
      setAdRequests([newAd, ...adRequests]);
      setAdSubmitting(false);
      setAdForm({ title: '', category: 'Business', type: 'banner', duration: '1 week', imageUrl: '' });
      alert("Advert request submitted successfully! It is now pending admin approval.");
    }, 1500);
  };

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
                <span className="dashboard-sub-chip">
                  ✓ {authUser.subscriptionPlan} subscriber
                </span>
              )}
            </div>

            {/* Mobile: horizontal tab bar; Desktop: vertical nav */}
            <nav className="dashboard-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`dashboard-nav-btn ${activeTab === tab.id ? "active" : ""}`}
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
            {activeTab === "overview" && (
              <>
                <h1 className="dashboard-heading">
                  Welcome back, {user.name.split(" ")[0]}
                </h1>

                <div className="dashboard-stats">
                  <div
                    className="dashboard-stat-card"
                    style={{ borderLeft: "4px solid var(--color-gold)" }}
                  >
                    <div className="dashboard-stat-label">
                      Subscription Status
                    </div>
                    <div
                      className="dashboard-stat-value"
                      style={{
                        color: authUser?.isSubscribed
                          ? "#2ecc71"
                          : "var(--color-text-muted)",
                      }}
                    >
                      <span
                        className="dashboard-dot"
                        style={{
                          background: authUser?.isSubscribed
                            ? "#2ecc71"
                            : "var(--color-border)",
                        }}
                      />
                      {user.subscription.status}
                    </div>
                    <div className="dashboard-stat-meta">
                      {authUser?.isSubscribed
                        ? `Renews ${user.subscription.nextBilling}`
                        : "Subscribe to unlock full access"}
                    </div>
                  </div>

                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-label">
                      Purchased E-Papers
                    </div>
                    <div className="dashboard-stat-value">
                      {user.ebooks.length} Issues
                    </div>
                    <Link to="/epaper" className="dashboard-stat-link">
                      Browse archive →
                    </Link>
                  </div>

                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-label">Saved Articles</div>
                    <div className="dashboard-stat-value">
                      {user.savedArticles.length} Articles
                    </div>
                    <div className="dashboard-stat-meta">Read later queue</div>
                  </div>

                  <div
                    className="dashboard-stat-card"
                    style={{ borderLeft: "4px solid var(--color-primary)" }}
                  >
                    <div className="dashboard-stat-label">
                      Purchased Stories
                    </div>
                    <div className="dashboard-stat-value">
                      {(authUser?.purchasedStories || []).length} Stories
                    </div>
                    <div className="dashboard-stat-meta">
                      {(authUser?.purchasedStories || []).length > 0
                        ? "Pay-per-story purchases"
                        : "No stories purchased yet"}
                    </div>
                  </div>
                </div>

                {/* Recent Saved Articles */}
                <div className="dashboard-card">
                  <h3 className="dashboard-card-title">
                    Recent Saved Articles
                  </h3>
                  <div className="dashboard-article-list">
                    {user.savedArticles.map((article) => (
                      <div key={article.id} className="dashboard-article-row">
                        <img
                          src={article.image}
                          alt=""
                          className="dashboard-article-thumb"
                        />
                        <div className="dashboard-article-info">
                          <Link
                            to={`/article/${article.id}`}
                            className="dashboard-article-title"
                          >
                            {article.title}
                          </Link>
                          <div className="dashboard-article-meta">
                            <Clock size={12} /> Saved recently
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("library")}
                    className="btn btn-ghost btn-block"
                    style={{ marginTop: "var(--space-md)" }}
                  >
                    View All Saved Content
                  </button>
                </div>

                {/* API & System Integration - NEW SECTION */}
                <div
                  className="dashboard-card"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                    borderLeft: "4px solid var(--color-primary)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "var(--space-lg)",
                    }}
                  >
                    <h3 className="dashboard-card-title" style={{ margin: 0 }}>
                      <Database
                        size={20}
                        style={{ color: "var(--color-primary)", flexShrink: 0 }}
                      />
                      API Connectivity & Platform Health
                    </h3>
                    <span
                      className="badge badge-news"
                      style={{
                        fontSize: "9px",
                        background: "#2ecc71",
                        animation: "pulse 2s infinite",
                      }}
                    >
                      Live Connection
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "var(--space-md)",
                    }}
                  >
                    <div
                      style={{
                        padding: "var(--space-md)",
                        background: "white",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        BSE Data Feed
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#2ecc71",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#2ecc71",
                            borderRadius: "50%",
                          }}
                        />{" "}
                        Connected
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "var(--space-md)",
                        background: "white",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Payment Gateway
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#2ecc71",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#2ecc71",
                            borderRadius: "50%",
                          }}
                        />{" "}
                        Active
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "var(--space-md)",
                        background: "white",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Archive API
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#2ecc71",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#2ecc71",
                            borderRadius: "50%",
                          }}
                        />{" "}
                        v2.4 Online
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscribe CTA if not subscribed */}
                {!authUser?.isSubscribed && (
                  <div className="dashboard-cta-card">
                    <h3>Unlock Full Access</h3>
                    <p>
                      Subscribe to read unlimited articles, download E-Papers,
                      and get exclusive content.
                    </p>
                    <Link to="/subscribe" className="btn btn-primary btn-lg">
                      View Plans & Subscribe
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* PLAN & BILLING */}
            {activeTab === "subscription" && (
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Plan & Billing</h2>

                <div className="dashboard-plan-box">
                  <div className="dashboard-plan-header">
                    <div>
                      <h3 style={{ color: "var(--color-primary)" }}>
                        {user.subscription.plan}
                      </h3>
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        {user.subscription.price} per billing cycle
                      </p>
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: authUser?.isSubscribed
                          ? "#e8f8f5"
                          : "var(--color-bg-alt)",
                        color: authUser?.isSubscribed
                          ? "#2ecc71"
                          : "var(--color-text-muted)",
                      }}
                    >
                      {user.subscription.status}
                    </span>
                  </div>
                  {authUser?.isSubscribed && (
                    <div className="dashboard-plan-note">
                      Your next charge of{" "}
                      <strong>{user.subscription.price}</strong> is on{" "}
                      <strong>{user.subscription.nextBilling}</strong>.
                    </div>
                  )}
                  <div className="dashboard-plan-actions">
                    {authUser?.isSubscribed ? (
                      <button className="btn btn-primary">
                        Update Payment Method
                      </button>
                    ) : (
                      <Link to="/subscribe" className="btn btn-primary">
                        Subscribe Now
                      </Link>
                    )}
                    {authUser?.isSubscribed && (
                      <button
                        className="btn btn-ghost"
                        style={{ color: "var(--color-news-red)" }}
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>

                <h3
                  style={{
                    margin: "var(--space-xl) 0 var(--space-md)",
                    fontSize: "var(--text-lg)",
                  }}
                >
                  Billing History
                </h3>
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
                      {transactions.length > 0 ? (
                        transactions.map((t, i) => (
                          <tr key={i}>
                            <td style={{ color: "var(--color-text-muted)" }}>
                              {new Date(t.date).toLocaleDateString()}
                            </td>
                            <td style={{ fontWeight: 500 }}>
                              {t.planName || t.type}
                            </td>
                            <td>{t.amount || user.subscription.price}</td>
                            <td style={{ color: "#2ecc71", fontWeight: 600 }}>
                              {t.status || 'Paid'}
                            </td>
                          </tr>
                        ))
                      ) : authUser?.isSubscribed ? (
                        [
                          "April 12, 2026",
                          "March 12, 2026",
                          "February 12, 2026",
                        ].map((date, i) => (
                          <tr key={`mock-${i}`}>
                            <td style={{ color: "var(--color-text-muted)" }}>
                              {date}
                            </td>
                            <td style={{ fontWeight: 500 }}>
                              {user.subscription.plan}
                            </td>
                            <td>{user.subscription.price}</td>
                            <td style={{ color: "#2ecc71", fontWeight: 600 }}>
                              Paid
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              textAlign: "center",
                              color: "var(--color-text-muted)",
                              padding: "var(--space-xl)",
                            }}
                          >
                            No billing history yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ADVERTS & CORPORATE */}
            {activeTab === "adverts" && (
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Corporate Adverts Management</h2>
                <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>
                  As a Corporate or Enterprise subscriber, you can request custom advertisements to be placed on the Weekend Post. Submit your creative below, and our team will review and approve it.
                </p>

                <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
                  
                  {/* Submission Form */}
                  <div style={{ background: "var(--color-bg-alt)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
                    <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-md)" }}>Submit New Advert Request</h3>
                    <form onSubmit={handleAdSubmit} className="dashboard-settings-form">
                      <div className="form-group">
                        <label className="form-label">Advert Campaign Title</label>
                        <input type="text" className="form-input" required value={adForm.title} onChange={e => setAdForm({...adForm, title: e.target.value})} placeholder="e.g., Summer Promotion 2026" />
                      </div>
                      <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <div>
                          <label className="form-label">Target Category</label>
                          <select className="form-input" value={adForm.category} onChange={e => setAdForm({...adForm, category: e.target.value})}>
                            <option value="Business">Business & Economy</option>
                            <option value="Politics">Politics & Governance</option>
                            <option value="Sports">Sports</option>
                            <option value="Entertainment">Entertainment & Culture</option>
                            <option value="Global">Global News</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Placement Type</label>
                          <select className="form-input" value={adForm.type} onChange={e => setAdForm({...adForm, type: e.target.value})}>
                            <option value="banner">Top Banner (728x90)</option>
                            <option value="sidebar">Sidebar (300x250)</option>
                            <option value="popup">Popup / Overlay</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Desired Duration</label>
                        <select className="form-input" value={adForm.duration} onChange={e => setAdForm({...adForm, duration: e.target.value})}>
                          <option value="1 week">1 Week</option>
                          <option value="2 weeks">2 Weeks</option>
                          <option value="1 month">1 Month</option>
                          <option value="Ongoing">Ongoing (Enterprise Only)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Ad Image URL</label>
                        <input type="url" className="form-input" required value={adForm.imageUrl} onChange={e => setAdForm({...adForm, imageUrl: e.target.value})} placeholder="https://example.com/banner.png" />
                      </div>
                      <button type="submit" className="btn btn-primary btn-block" disabled={adSubmitting}>
                        {adSubmitting ? 'Submitting Request...' : 'Submit Advert Request'}
                      </button>
                    </form>
                  </div>

                  {/* History & Status */}
                  <div>
                    <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-md)" }}>Your Active & Past Requests</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {adRequests.length === 0 ? (
                        <div style={{ padding: "var(--space-xl)", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)", color: "var(--color-text-muted)" }}>
                          You have no advert requests yet.
                        </div>
                      ) : (
                        adRequests.map((ad, idx) => (
                          <div key={idx} style={{ padding: "var(--space-md)", background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", display: 'flex', gap: 'var(--space-md)' }}>
                            <img src={ad.imageUrl} alt={ad.title} style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "4px", background: "var(--color-bg-alt)" }} onError={(e) => e.target.src="https://placehold.co/80x60/f8fafc/94a3b8?text=AD"} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "4px" }}>
                                <strong style={{ fontSize: "14px" }}>{ad.title}</strong>
                                <span className="badge" style={{ 
                                  background: ad.status === 'Approved' ? '#e8f8f5' : ad.status === 'Rejected' ? '#fee2e2' : 'var(--color-bg-alt)',
                                  color: ad.status === 'Approved' ? '#2ecc71' : ad.status === 'Rejected' ? 'var(--color-news-red)' : 'var(--color-text-muted)'
                                }}>{ad.status}</span>
                              </div>
                              <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                                {ad.type.toUpperCase()} • {ad.category} • {ad.duration}
                              </div>
                              <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>
                                Submitted: {new Date(ad.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LIBRARY */}
            {activeTab === "library" && (
              <>
                <h2 className="dashboard-heading">My Library</h2>

                <div className="dashboard-card">
                  <h3 className="dashboard-card-title">
                    <BookOpen
                      size={20}
                      style={{ color: "var(--color-primary)", flexShrink: 0 }}
                    />
                    E-Papers Collection
                  </h3>
                  <div className="dashboard-ebooks-grid">
                    {user.ebooks.map((ebook, i) => (
                      <div key={i} className="dashboard-ebook-card">
                        <div className="dashboard-ebook-cover">
                          <BookOpen size={40} style={{ opacity: 0.2 }} />
                        </div>
                        <h4 className="dashboard-ebook-title">{ebook.title}</h4>
                        <div className="dashboard-ebook-date">
                          Purchased: {ebook.date}
                        </div>
                        <button
                          onClick={() => handleDownload(ebook)}
                          disabled={downloading === ebook.id}
                          className="btn btn-ghost btn-sm btn-block"
                          style={{
                            border: "1px solid currentColor",
                            marginTop: "var(--space-sm)",
                          }}
                        >
                          {downloading === ebook.id ? (
                            "Preparing..."
                          ) : (
                            <>
                              <Download size={14} /> Download PDF
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3 className="dashboard-card-title">
                    <Star
                      size={20}
                      style={{ color: "var(--color-gold)", flexShrink: 0 }}
                    />
                    Saved Articles
                  </h3>
                  <div className="dashboard-article-list">
                    {user.savedArticles.map((article) => (
                      <div key={article.id} className="dashboard-article-row">
                        <img
                          src={article.image}
                          alt=""
                          className="dashboard-article-thumb dashboard-article-thumb-lg"
                        />
                        <div className="dashboard-article-info">
                          <Link
                            to={`/category/${article.category}`}
                            className="dashboard-article-cat"
                          >
                            {article.category}
                          </Link>
                          <Link
                            to={`/article/${article.id}`}
                            className="dashboard-article-title"
                          >
                            {article.title}
                          </Link>
                          <div className="dashboard-article-meta">
                            <Clock size={12} /> {article.readTime} • Saved
                            recently
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Account Settings</h2>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="dashboard-settings-form"
                >
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      defaultValue={user.name}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      defaultValue={user.email}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+267 7X XXX XXX"
                    />
                  </div>

                  <h3
                    style={{
                      margin: "var(--space-xl) 0 var(--space-md)",
                      fontSize: "var(--text-lg)",
                    }}
                  >
                    Change Password
                  </h3>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" />
                  </div>

                  <h3
                    style={{
                      margin: "var(--space-xl) 0 var(--space-md)",
                      fontSize: "var(--text-lg)",
                    }}
                  >
                    Email Preferences
                  </h3>
                  <label className="form-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Daily News Briefing</span>
                  </label>
                  <label className="form-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Weekly E-Paper Alerts</span>
                  </label>
                  <label
                    className="form-checkbox"
                    style={{ marginBottom: "var(--space-xl)" }}
                  >
                    <input type="checkbox" />
                    <span>Partner Offers</span>
                  </label>

                  <button type="submit" className="btn btn-primary btn-lg">
                    Save Settings
                  </button>
                </form>
              </div>
            )}

            {/* API ACCESS */}
            {activeTab === "api" && (
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">API Integration</h2>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    marginBottom: "var(--space-xl)",
                  }}
                >
                  Access our core application APIs for custom enterprise
                  integrations. Your API key provides access to our live
                  newsroom data, financial insights, and user analytics
                  endpoints.
                </p>

                <div
                  style={{
                    background: "var(--color-bg-alt)",
                    padding: "var(--space-lg)",
                    borderRadius: "var(--radius-lg)",
                    marginBottom: "var(--space-xl)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "var(--text-md)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    Your API Key
                  </h3>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      className="form-input"
                      readOnly
                      value={
                        authUser?.isSubscribed
                          ? `sk_live_${authUser.uid || "demo"}_${Math.random().toString(36).substr(2, 9)}`
                          : "••••••••••••••••••••••••••••••••"
                      }
                      style={{
                        flex: 1,
                        fontFamily: "var(--font-mono)",
                        fontSize: "14px",
                        background: "white",
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => alert("API Key Copied!")}
                      disabled={!authUser?.isSubscribed}
                    >
                      Copy Key
                    </button>
                  </div>
                  {!authUser?.isSubscribed && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--color-news-red)",
                        marginTop: "8px",
                      }}
                    >
                      * Premium subscription required to generate live API keys.
                    </p>
                  )}
                </div>

                <h3
                  style={{
                    fontSize: "var(--text-md)",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  Available Endpoints
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <span
                      style={{
                        background: "var(--color-sport-green)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      GET
                    </span>
                    <code
                      style={{
                        fontSize: "13px",
                        color: "var(--color-primary)",
                      }}
                    >
                      /api/v1/news/latest
                    </code>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Fetch live updates
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <span
                      style={{
                        background: "var(--color-sport-green)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      GET
                    </span>
                    <code
                      style={{
                        fontSize: "13px",
                        color: "var(--color-primary)",
                      }}
                    >
                      /api/v1/market/reports
                    </code>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Corporate insights
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <span
                      style={{
                        background: "var(--color-gold)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      POST
                    </span>
                    <code
                      style={{
                        fontSize: "13px",
                        color: "var(--color-primary)",
                      }}
                    >
                      /api/v1/users/auth
                    </code>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      SSO verification
                    </span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
