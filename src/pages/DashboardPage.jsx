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

import DashboardOverview from "../components/dashboard/DashboardOverview";
import DashboardSubscription from "../components/dashboard/DashboardSubscription";
import DashboardAdverts from "../components/dashboard/DashboardAdverts";
import DashboardLibrary from "../components/dashboard/DashboardLibrary";
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
              <DashboardOverview user={user} authUser={authUser} setActiveTab={setActiveTab} />
            )}
            {activeTab === "subscription" && (
              <DashboardSubscription user={user} authUser={authUser} transactions={transactions} />
            )}
            {activeTab === "adverts" && (
              <DashboardAdverts 
                adForm={adForm} setAdForm={setAdForm} 
                adRequests={adRequests} handleAdSubmit={handleAdSubmit} 
                adSubmitting={adSubmitting} 
              />
            )}
            {activeTab === "library" && (
              <DashboardLibrary user={user} downloading={downloading} handleDownload={handleDownload} />
            )}
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
                          ? `sk_live_${authUser.uid || "demo"}_${"RANDOM_STR".substr(2, 9)}`
                          : "••••••••••••••••••••••••••••••••"
                      }
                      style={{
                        flex: 1,
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-sm)",
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
                        fontSize: "var(--text-xs)",
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
                        fontSize: "var(--text-xs)",
                        fontWeight: "bold",
                      }}
                    >
                      GET
                    </span>
                    <code
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-primary)",
                      }}
                    >
                      /api/v1/news/latest
                    </code>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "var(--text-xs)",
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
                        fontSize: "var(--text-xs)",
                        fontWeight: "bold",
                      }}
                    >
                      GET
                    </span>
                    <code
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-primary)",
                      }}
                    >
                      /api/v1/market/reports
                    </code>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "var(--text-xs)",
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
                        fontSize: "var(--text-xs)",
                        fontWeight: "bold",
                      }}
                    >
                      POST
                    </span>
                    <code
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-primary)",
                      }}
                    >
                      /api/v1/users/auth
                    </code>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "var(--text-xs)",
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

