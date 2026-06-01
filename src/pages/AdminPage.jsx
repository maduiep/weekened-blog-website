import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CreditCard,
  ShieldCheck,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  BarChart2,
  UserPlus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Play,
  Filter,
  Download,
  LayoutDashboard,
  Settings,
  Database,
  FileText,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CMSEditor from "../components/admin/CMSEditor";
import AdminManagement from "../components/admin/AdminManagement";
import { Link } from "react-router-dom";

const PLAN_COLORS = {
  weekly: "var(--color-sport-green)",
  monthly: "var(--color-primary)",
  annual: "var(--color-gold)",
  corporate: "var(--color-business-blue)",
  enterprise: "var(--color-news-red)",
};

const RANGE_COLORS = {
  monthly: "#007e97", // Deep Teal
  weekly: "#f39c12", // Vibrant Orange/Gold
  daily: "#27ae60", // Emerald Green
};

const RANGE_BG = {
  monthly: "rgba(0, 126, 151, 0.1)",
  weekly: "rgba(243, 156, 18, 0.1)",
  daily: "rgba(39, 174, 96, 0.1)",
};

export default function AdminPage() {
  const {
    getAllUsers,
    getAdminLogs,
    revokeSubscription,
    disconnectUser,
    assignRole,
    deleteUser,
    user: adminUser,
  } = useAuth();
  const [activeTab, setActiveTab] = useState("analytics"); // Default to analytics for "WOW" factor
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const allUsers = getAllUsers();
  const subscribers = allUsers.filter((u) => u.isSubscribed);
  const adminUsersCount = allUsers.filter((u) => u.isAdmin).length;
  const adminLogs = getAdminLogs();

  const filtered = allUsers.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "subscribed" && u.isSubscribed) ||
      (filterStatus === "free" && !u.isSubscribed) ||
      (filterStatus === "admin" && u.isAdmin);
    return matchesSearch && matchesFilter;
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRevoke = (uid, name) => {
    if (!confirm(`Revoke subscription for ${name}?`)) return;
    revokeSubscription(uid);
    showToast(`Subscription revoked for ${name}`);
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Mock Analytics Data with timeframe support
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeReaders, setActiveReaders] = useState(0);
  const [mtdRevenue, setMtdRevenue] = useState(0);

  // Track active readers using the same key as AuthContext
  useEffect(() => {
    const KEY = "wp_active_sessions";
    const read = () => {
      try {
        const raw = localStorage.getItem(KEY);
        const obj = raw ? JSON.parse(raw) : {};
        setActiveReaders(Object.keys(obj).length);
      } catch (e) {
        setActiveReaders(0);
      }
    };

    read();

    const calcRevenue = () => {
      try {
        const txs = JSON.parse(localStorage.getItem('wp_transactions') || '[]');
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let total = 0;
        for (const t of txs) {
          if (!t.date || !t.amount) continue;
          const d = new Date(t.date);
          if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            total += Number(t.amount);
          }
        }
        setMtdRevenue(total);
      } catch (e) {
        setMtdRevenue(0);
      }
    };
    calcRevenue();

    const readMessages = () => {
      try {
        const msgs = JSON.parse(localStorage.getItem('wp_contact_messages') || '[]');
        setContactMessages(Array.isArray(msgs) ? msgs : []);
      } catch (e) {
        setContactMessages([]);
      }
    };
    readMessages();

    const onStorage = (e) => {
      if (e.key && e.key !== KEY && e.key !== 'wp_transactions' && e.key !== 'wp_contact_messages') return;
      read();
      calcRevenue();
      readMessages();
    };
    window.addEventListener("storage", onStorage);

    const poll = setInterval(read, 10000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(poll);
    };
  }, []);

  const totalSubscribers = subscribers.length;
  const corporateSubs = subscribers.filter(
    (u) =>
      u.subscriptionPlan === "corporate" || u.subscriptionTier === "Corporate",
  ).length;
  const enterpriseSubs = subscribers.filter(
    (u) =>
      u.subscriptionPlan === "enterprise" ||
      u.subscriptionTier === "Enterprise",
  ).length;

  const analyticsData = {
    monthly: [
      { label: "Jan", value: 4500, count: 75 },
      { label: "Feb", value: 5200, count: 88 },
      { label: "Mar", value: 4800, count: 82 },
      { label: "Apr", value: 6100, count: 104 },
      { label: "May", value: 7500, count: totalSubscribers }, // Automated linked value
    ],
    weekly: [
      { label: "Week 1", value: 1200, count: 15 },
      { label: "Week 2", value: 1800, count: 22 },
      { label: "Week 3", value: 1500, count: 18 },
      { label: "Week 4", value: 2100, count: 28 },
    ],
    daily: [
      { label: "Mon", value: 300, count: 4 },
      { label: "Tue", value: 450, count: 6 },
      { label: "Wed", value: 380, count: 5 },
      { label: "Thu", value: 520, count: 8 },
      { label: "Fri", value: 600, count: 10 },
      { label: "Sat", value: 400, count: 5 },
      { label: "Sun", value: 350, count: 4 },
    ],
    conversionFunnel: [
      {
        stage: "Site Visits",
        count: 15400,
        percent: 100,
        color: "var(--color-primary)",
      },
      {
        stage: "Article Views",
        count: 12200,
        percent: 79,
        color: "var(--color-primary)",
      },
      {
        stage: "Sign Ups",
        count: 3100,
        percent: 20,
        color: "var(--color-gold)",
      },
      {
        stage: "Subscribers",
        count: 840,
        percent: 5,
        color: "var(--color-sport-green)",
      },
    ],
    topArticles: [
      {
        title: "Oil price dip masks supply issues",
        views: "12.4K",
        engagement: "85%",
        revenue: "P1,240",
      },
      {
        title: "Household Loan Defaults Surge",
        views: "10.1K",
        engagement: "92%",
        revenue: "P980",
      },
      {
        title: "Sports Infrastructure Letdown",
        views: "8.2K",
        engagement: "78%",
        revenue: "P750",
      },
    ],
  };

  const feedbackData = {
    score: 4.7,
    nps: 65,
    positiveMentions: "82%",
    responseRate: "74%",
    sentimentTrend: "+8%",
  };

  const activeChartData = analyticsData[timeRange];
  const maxValue = Math.max(...activeChartData.map((d) => d.value));

  return (
    <div
      className="admin-page"
      style={{ background: "#f8fafc", minHeight: "100vh" }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`admin-toast ${toast.type}`}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 1000,
              background: "var(--color-dark)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} color="var(--color-sport-green)" />
            ) : (
              <XCircle size={18} color="var(--color-news-red)" />
            )}
            <span style={{ fontWeight: 600 }}>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container" style={{ padding: "var(--space-2xl) 0" }}>
        {/* Page Header */}
        <div
          className="admin-header"
          style={{
            marginBottom: "var(--space-2xl)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-lg)",
          }}
        >
          <div style={{ minWidth: "280px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "var(--color-primary)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                <LayoutDashboard size={20} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    color: "var(--color-primary)",
                  }}
                >
                  Platform Control
                </span>
                <h1 style={{ fontSize: "var(--text-2xl)", margin: 0 }}>
                  Business Overview
                </h1>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "var(--space-md)",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <button
              className="btn btn-ghost btn-sm btn-block"
              style={{ background: "white" }}
              onClick={() =>
                showToast("Report generation started...", "success")
              }
            >
              <Download size={14} /> Export CSV
            </button>
            <Link to="/" className="btn btn-primary btn-sm btn-block">
              View Site
            </Link>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div
          className="admin-stats-grid"
          style={{ marginBottom: "var(--space-2xl)" }}
        >
          {[
            {
              icon: <Users size={20} />,
              label: "Total Users",
              value: allUsers.length,
              change: "+12%",
              color: "var(--color-primary)",
            },
            {
              icon: <CreditCard size={20} />,
              label: "Active Subs",
              value: subscribers.length,
              change: "+8%",
              color: "var(--color-sport-green)",
            },
            {
              icon: <Eye size={20} />,
              label: "Active Readers",
              value: activeReaders,
              change: "+0%",
              color: "var(--color-opinion-purple)",
            },
            {
              icon: <ShieldCheck size={20} />,
              label: "Enterprise Licenses",
              value: `${corporateSubs + enterpriseSubs}`,
              change: "+5%",
              color: "var(--color-business-blue)",
            },
            {
              icon: <DollarSign size={20} />,
              label: "MTD Revenue",
              value: `P${mtdRevenue.toLocaleString()}`,
              change: "Live",
              color: "var(--color-gold)",
            },
            {
              icon: <Database size={20} />,
              label: "Data Points",
              value: "42.8K",
              change: "+1.2K",
              color: "var(--color-opinion-purple)",
            },
            {
              icon: <ShieldCheck size={20} />,
              label: "Total Admins",
              value: adminUsersCount,
              change: "Active",
              color: "var(--color-sport-green)",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="admin-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "white",
                border: "1px solid var(--color-border)",
                padding: "var(--space-xl)",
                borderRadius: "var(--radius-xl)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    color: stat.color,
                    background: "rgba(0,126,151,0.1)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: stat.color,
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <div
                style={{
                  fontSize: "var(--text-2xl)",
                  fontWeight: 800,
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div
          className="admin-tabs"
          style={{
            display: "flex",
            gap: "var(--space-md)",
            background: "rgba(0,0,0,0.03)",
            padding: "8px",
            borderRadius: "12px",
            width: "fit-content",
            marginBottom: "var(--space-xl)",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setActiveTab("analytics")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "analytics" ? "white" : "transparent",
              color:
                activeTab === "analytics"
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <BarChart2 size={16} /> Insights
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "messages" ? "white" : "transparent",
              color:
                activeTab === "messages"
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              position: "relative"
            }}
          >
            <Mail size={16} /> User Requests
            {contactMessages.filter(m => m.status === 'Unread').length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-news-red)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {contactMessages.filter(m => m.status === 'Unread').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "users" ? "white" : "transparent",
              color:
                activeTab === "users"
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Users size={16} /> Customers
          </button>
          <button
            onClick={() => setActiveTab("cms")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "cms" ? "white" : "transparent",
              color:
                activeTab === "cms"
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FileText size={16} /> CMS / Articles
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "admins" ? "white" : "transparent",
              color:
                activeTab === "admins"
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ShieldCheck size={16} /> Admin Roles
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "logs" ? "white" : "transparent",
              color:
                activeTab === "logs"
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ShieldCheck size={16} /> Security & Logs
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "analytics" ? (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="admin-analytics-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: "auto 1fr",
                  gap: "var(--space-xl)",
                }}
              >
                {/* Revenue Breakdown (top-left) */}
                <div
                  className="admin-card"
                  style={{
                    background: "white",
                    padding: "var(--space-xl)",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-sm)",
                    gridColumn: "1 / 2",
                    gridRow: "1 / 2",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "var(--space-xl)",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "var(--text-lg)",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <TrendingUp
                          size={18}
                          color="var(--color-sport-green)"
                        />{" "}
                        Revenue Breakdown
                      </h3>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--color-text-muted)",
                          marginTop: 4,
                        }}
                      >
                        Live financial performance and subscriber growth.
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          background: "#f1f5f9",
                          padding: "3px",
                          borderRadius: "8px",
                        }}
                      >
                        {["monthly", "weekly", "daily"].map((range) => (
                          <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            style={{
                              padding: "4px 12px",
                              border: "none",
                              borderRadius: "6px",
                              background:
                                timeRange === range ? "white" : "transparent",
                              color:
                                timeRange === range
                                  ? "var(--color-primary)"
                                  : "var(--color-text-muted)",
                              fontSize: "10px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              boxShadow:
                                timeRange === range
                                  ? "0 1px 3px rgba(0,0,0,0.1)"
                                  : "none",
                            }}
                          >
                            {range.charAt(0)}
                          </button>
                        ))}
                      </div>
                      <button
                        className="btn btn-sm"
                        style={{
                          padding: "4px 10px",
                          fontSize: "10px",
                          background: "var(--color-primary)",
                          color: "white",
                        }}
                        onClick={() =>
                          showToast(
                            "Financial report downloading...",
                            "success",
                          )
                        }
                      >
                        <Download size={12} /> Export Report
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      height: "240px",
                      gap: "12px",
                      padding: "20px 0 10px",
                      position: "relative",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {/* Y-Axis Guideline */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "20px",
                        borderTop: "1px dashed #f1f5f9",
                        zIndex: 0,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "50%",
                        borderTop: "1px dashed #f1f5f9",
                        zIndex: 0,
                      }}
                    />

                    {activeChartData.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          height: "100%",
                          justifyContent: "flex-end",
                          zIndex: 1,
                        }}
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: `${Math.max(5, (item.value / (maxValue || 1)) * 100)}%`,
                          }}
                          transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 100,
                            delay: i * 0.05,
                          }}
                          style={{
                            width: "100%",
                            background: RANGE_COLORS[timeRange],
                            borderRadius: "6px 6px 0 0",
                            position: "relative",
                            boxShadow: `0 4px 15px -2px ${RANGE_COLORS[timeRange]}66`,
                            display: "block",
                            minHeight: "10px",
                          }}
                          className="bar-hover"
                        >
                          <div
                            className="bar-tooltip"
                            style={{
                              position: "absolute",
                              top: "-45px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: "var(--color-dark)",
                              color: "white",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              fontSize: "10px",
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              opacity: 0,
                              transition: "opacity 0.2s",
                              pointerEvents: "none",
                              boxShadow: "var(--shadow-md)",
                              zIndex: 10,
                            }}
                          >
                            <div
                              style={{
                                color: RANGE_COLORS[timeRange],
                                marginBottom: 2,
                                filter: "brightness(1.5)",
                              }}
                            >
                              P{item.value.toLocaleString()}
                            </div>
                            <div style={{ opacity: 0.8 }}>
                              {item.count} Subscribers
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                bottom: "-4px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                borderLeft: "4px solid transparent",
                                borderRight: "4px solid transparent",
                                borderTop: "4px solid var(--color-dark)",
                              }}
                            />
                          </div>
                        </motion.div>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "var(--color-text-muted)",
                            textAlign: "center",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "24px",
                      marginTop: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "10px",
                        color: "var(--color-text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          background: RANGE_COLORS[timeRange],
                          borderRadius: "2px",
                        }}
                      />{" "}
                      Revenue (Pula)
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "10px",
                        color: "var(--color-text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          background: "#cbd5e1",
                          borderRadius: "2px",
                        }}
                      />{" "}
                      Baseline
                    </div>
                  </div>
                </div>

                <div
                  className="admin-card"
                  style={{
                    background: "white",
                    padding: "var(--space-2xl)",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--color-border)",
                    gridColumn: "2 / 3",
                    gridRow: "1 / 2",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "var(--text-lg)",
                      marginBottom: "var(--space-xl)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <DollarSign size={18} color="var(--color-primary)" /> Reader
                    Feedback
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "16px",
                    }}
                  >
                    <button
                      onClick={() => {
                        setModalType("average");
                        setModalOpen(true);
                      }}
                      style={{
                        background: "var(--color-bg-alt)",
                        borderRadius: "16px",
                        padding: "20px",
                        textAlign: "left",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginBottom: "8px",
                        }}
                      >
                        Average Rating
                      </span>
                      <strong style={{ fontSize: "2rem" }}>
                        {feedbackData.score}
                      </strong>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        Based on recent subscriber feedback.
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setModalType("nps");
                        setModalOpen(true);
                      }}
                      style={{
                        background: "var(--color-bg-alt)",
                        borderRadius: "16px",
                        padding: "20px",
                        textAlign: "left",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginBottom: "8px",
                        }}
                      >
                        NPS Score
                      </span>
                      <strong style={{ fontSize: "2rem" }}>
                        {feedbackData.nps}
                      </strong>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        Trending {feedbackData.sentimentTrend} month-over-month.
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setModalType("positive");
                        setModalOpen(true);
                      }}
                      style={{
                        background: "var(--color-bg-alt)",
                        borderRadius: "16px",
                        padding: "20px",
                        textAlign: "left",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginBottom: "8px",
                        }}
                      >
                        Positive Mentions
                      </span>
                      <strong style={{ fontSize: "2rem" }}>
                        {feedbackData.positiveMentions}
                      </strong>
                    </button>
                    <button
                      onClick={() => {
                        setModalType("response");
                        setModalOpen(true);
                      }}
                      style={{
                        background: "var(--color-bg-alt)",
                        borderRadius: "16px",
                        padding: "20px",
                        textAlign: "left",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          marginBottom: "8px",
                        }}
                      >
                        Response Rate
                      </span>
                      <strong style={{ fontSize: "2rem" }}>
                        {feedbackData.responseRate}
                      </strong>
                    </button>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div
                  className="admin-card"
                  style={{
                    background: "white",
                    padding: "var(--space-2xl)",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--color-border)",
                    gridColumn: "1 / -1",
                    gridRow: "2 / 3",
                    height: "100%",
                    overflow: "visible",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "var(--text-lg)",
                      marginBottom: "var(--space-xl)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Filter size={18} color="var(--color-gold)" /> Conversion
                    Funnel
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {analyticsData.conversionFunnel.map((step, i) => (
                      <div key={i}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                            fontSize: "12px",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{step.stage}</span>
                          <span style={{ color: "var(--color-text-muted)" }}>
                            {step.count.toLocaleString()} ({step.percent}%)
                          </span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "12px",
                            background: "var(--color-bg-alt)",
                            borderRadius: "6px",
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${step.percent}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            style={{ height: "100%", background: step.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Modal */}
              <AnimatePresence>
                {modalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0,0,0,0.45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2000,
                      padding: "24px",
                    }}
                    onClick={() => setModalOpen(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.98 }}
                      style={{
                        background: "white",
                        borderRadius: "12px",
                        width: "min(900px,100%)",
                        maxHeight: "80vh",
                        overflow: "auto",
                        padding: "20px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <h3 style={{ margin: 0, fontSize: "18px" }}>
                          {modalType === "average" && "Average Rating Details"}
                          {modalType === "nps" && "NPS Score Breakdown"}
                          {modalType === "positive" && "Positive Mentions"}
                          {modalType === "response" && "Response Rate"}
                          {modalType === "messageDetail" && "User Request Detail"}
                        </h3>
                        <button
                          className="btn btn-ghost"
                          onClick={() => setModalOpen(false)}
                        >
                          Close
                        </button>
                      </div>
                      <div>
                        {modalType === "average" && (
                          <div>
                            <p>Average score over time:</p>
                            <svg
                              width="100%"
                              height="120"
                              viewBox="0 0 400 120"
                            >
                              <polyline
                                fill="none"
                                stroke="#0b7285"
                                strokeWidth="3"
                                points="0,90 60,70 120,50 180,60 240,40 300,30 360,35"
                              />
                            </svg>
                          </div>
                        )}
                        {modalType === "nps" && (
                          <div>
                            <p>NPS distribution:</p>
                            <svg
                              width="100%"
                              height="120"
                              viewBox="0 0 400 120"
                            >
                              <rect
                                x="10"
                                y="30"
                                width="100"
                                height="50"
                                fill="#f6c85f"
                              />
                              <rect
                                x="120"
                                y="20"
                                width="120"
                                height="60"
                                fill="#0b7285"
                              />
                              <rect
                                x="250"
                                y="45"
                                width="120"
                                height="35"
                                fill="#d3d3d3"
                              />
                            </svg>
                          </div>
                        )}
                        {modalType === "positive" && (
                          <div
                            style={{
                              display: "flex",
                              gap: 16,
                              alignItems: "center",
                            }}
                          >
                            <svg
                              width="120"
                              height="120"
                              viewBox="0 0 42 42"
                              style={{ flex: "none" }}
                            >
                              <circle
                                r="15.9155"
                                cx="21"
                                cy="21"
                                fill="#f1f5f9"
                              />
                              <circle
                                r="15.9155"
                                cx="21"
                                cy="21"
                                fill="transparent"
                                stroke="#0b7285"
                                strokeWidth="6"
                                strokeDasharray="82 18"
                                strokeDashoffset="25"
                                transform="rotate(-90 21 21)"
                              />
                            </svg>
                            <div>
                              <p
                                style={{
                                  margin: 0,
                                  fontWeight: 700,
                                  fontSize: 24,
                                }}
                              >
                                {feedbackData.positiveMentions}
                              </p>
                              <p style={{ marginTop: 8 }}>
                                Share of positive mentions in recent responses.
                              </p>
                            </div>
                          </div>
                        )}
                        {modalType === "response" && (
                          <div>
                            <p>Response rate progress:</p>
                            <div
                              style={{
                                background: "#f1f5f9",
                                borderRadius: 8,
                                height: 18,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: feedbackData.responseRate,
                                  height: "100%",
                                  background: "#0b7285",
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {modalType === "messageDetail" && selectedMessage && (
                          <div style={{ color: "var(--color-text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
                            <div style={{ marginBottom: "var(--space-md)" }}>
                              <strong>From:</strong> {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                              <br />
                              <strong>Date:</strong> {formatDate(selectedMessage.date)}
                              <br />
                              <strong>Subject:</strong> {selectedMessage.subject}
                              <br />
                              <strong>Status:</strong> {selectedMessage.status}
                            </div>
                            <div style={{ background: "rgba(0,0,0,0.03)", padding: "var(--space-md)", borderRadius: "8px", border: "1px solid var(--color-border)", minHeight: "100px", whiteSpace: "pre-wrap" }}>
                              {selectedMessage.message}
                            </div>
                            <div style={{ marginTop: "var(--space-lg)", display: "flex", justifyContent: "flex-end" }}>
                              {selectedMessage.status !== "Resolved" && (
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    const msgs = [...contactMessages];
                                    const idx = msgs.findIndex(m => m.id === selectedMessage.id);
                                    if (idx !== -1) {
                                      msgs[idx].status = "Resolved";
                                      setContactMessages(msgs);
                                      localStorage.setItem('wp_contact_messages', JSON.stringify(msgs));
                                      showToast("Message marked as resolved!");
                                      setModalOpen(false);
                                    }
                                  }}
                                  style={{ background: "var(--color-sport-green)", border: "none" }}
                                >
                                  Mark as Resolved
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className="admin-card"
                style={{
                  background: "white",
                  padding: "var(--space-2xl)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--color-border)",
                  gridColumn: "1 / -1",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "var(--space-lg)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "var(--text-lg)",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Database size={18} color="var(--color-primary)" /> Top
                    Content Performance
                  </h3>
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
                          <td style={{ fontWeight: 700, fontSize: "13px" }}>
                            {art.title}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <Eye size={14} /> {art.views}
                            </div>
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: "60px",
                                  height: "6px",
                                  background: "#f1f5f9",
                                  borderRadius: "3px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: art.engagement,
                                    height: "100%",
                                    background: "var(--color-primary)",
                                  }}
                                />
                              </div>
                              <span
                                style={{ fontSize: "11px", fontWeight: 600 }}
                              >
                                {art.engagement}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              color: "var(--color-sport-green)",
                              fontWeight: 700,
                            }}
                          >
                            {art.revenue}
                          </td>
                          <td>
                            <span
                              className="badge badge-default"
                              style={{ fontSize: "10px" }}
                            >
                              Viral
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "var(--space-xl)",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{ position: "relative", flex: 1, maxWidth: "400px" }}
                  >
                    <Search
                      size={16}
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--color-text-muted)",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search customers by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 16px 10px 40px",
                        borderRadius: "10px",
                        border: "1px solid var(--color-border)",
                        outline: "none",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["all", "subscribed", "free"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilterStatus(f)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border:
                            "1px solid " +
                            (filterStatus === f
                              ? "var(--color-primary)"
                              : "var(--color-border)"),
                          background:
                            filterStatus === f
                              ? "var(--color-primary)"
                              : "white",
                          color:
                            filterStatus === f
                              ? "white"
                              : "var(--color-text-muted)",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
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
                        <th>Role</th>
                        <th>Plan</th>
                        <th>Active Device</th>
                        <th>Expiry</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u) => (
                        <tr key={u.uid} className="admin-table-row">
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "10px",
                                  background: "var(--color-bg-alt)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  color: "var(--color-primary)",
                                }}
                              >
                                {u.avatar || u.name.charAt(0)}
                              </div>
                              <div
                                style={{ fontWeight: 700, fontSize: "13px" }}
                              >
                                {u.name}
                              </div>
                            </div>
                          </td>
                          <td
                            style={{
                              fontSize: "13px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {u.email}
                          </td>
                          <td>
                            {u.isAdmin ? (
                              <span style={{ color: 'var(--color-sport-green)', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>Admin</span>
                            ) : (
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>User</span>
                            )}
                          </td>
                          <td>
                            {u.isSubscribed ? (
                              <span
                                style={{
                                  color:
                                    PLAN_COLORS[u.subscriptionPlan] ||
                                    "var(--color-primary)",
                                  fontWeight: 800,
                                  textTransform: "uppercase",
                                  fontSize: "10px",
                                }}
                              >
                                {u.subscriptionTier ||
                                  (u.subscriptionPlan === "storypass"
                                    ? "Story Pass"
                                    : u.subscriptionPlan
                                      ? u.subscriptionPlan
                                          .charAt(0)
                                          .toUpperCase() +
                                        u.subscriptionPlan.slice(1)
                                      : "Free")}
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "var(--color-text-muted)",
                                  fontSize: "10px",
                                }}
                              >
                                Free Tier
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {u.activeSessionId ? "1 (Active)" : "None"}
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {formatDate(u.subscriptionExpiry)}
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {formatDate(u.createdAt)}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {u.uid !== adminUser.uid && (
                                <button
                                  className="admin-action-btn"
                                  title={u.isAdmin ? "Remove Admin" : "Make Admin"}
                                  onClick={() => {
                                    if (!confirm(`Change role of ${u.name} to ${u.isAdmin ? 'User' : 'Admin'}?`)) return;
                                    assignRole(u.uid, u.isAdmin ? 'user' : 'admin');
                                    showToast(`${u.name} is now ${u.isAdmin ? 'User' : 'Admin'}`);
                                  }}
                                  style={{
                                    color: u.isAdmin ? "var(--color-news-red)" : "var(--color-sport-green)",
                                    background: u.isAdmin ? "rgba(239,68,68,0.05)" : "rgba(39,174,96,0.05)",
                                  }}
                                >
                                  <ShieldCheck size={14} />
                                </button>
                              )}
                              {u.activeSessionId && !u.isAdmin && (
                                <button
                                  className="admin-action-btn admin-action-revoke"
                                  title="Disconnect Device"
                                  onClick={() => {
                                    if (
                                      !confirm(
                                        `Disconnect ${u.name}'s active device?`,
                                      )
                                    )
                                      return;
                                    disconnectUser(u.uid);
                                    showToast(
                                      `${u.name} was disconnected from the active session.`,
                                    );
                                  }}
                                  style={{
                                    background: "rgba(255,235,238,0.9)",
                                    color: "var(--color-news-red)",
                                  }}
                                >
                                  <XCircle size={14} />
                                </button>
                              )}
                              {u.isSubscribed && !u.isAdmin && (
                                <button
                                  className="admin-action-btn admin-action-revoke"
                                  title="Revoke Access"
                                  onClick={() => handleRevoke(u.uid, u.name)}
                                >
                                  <CreditCard size={14} />
                                </button>
                              )}
                              {u.uid !== adminUser.uid && (
                                <button
                                  className="admin-action-btn admin-action-revoke"
                                  title="Delete User"
                                  onClick={() => {
                                    if (!confirm(`Are you sure you want to completely DELETE ${u.name}'s account? This action cannot be undone.`)) return;
                                    deleteUser(u.uid);
                                    showToast(`${u.name}'s account was deleted.`);
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              <button
                                className="admin-action-btn"
                                title="View Details"
                                style={{
                                  color: "var(--color-primary)",
                                  background: "rgba(0,126,151,0.05)",
                                }}
                              >
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
          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="admin-card"
                style={{
                  background: "white",
                  padding: "var(--space-2xl)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "var(--space-xl)",
                  }}
                >
                  <h3 style={{ margin: 0, color: "var(--color-dark)" }}>
                    User Requests
                  </h3>
                </div>

                <div className="table-responsive" style={{ overflowX: "auto" }}>
                  <table
                    className="admin-table"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "var(--color-bg)",
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <th style={{ padding: "var(--space-md)", textAlign: "left", fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</th>
                        <th style={{ padding: "var(--space-md)", textAlign: "left", fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>User</th>
                        <th style={{ padding: "var(--space-md)", textAlign: "left", fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Subject</th>
                        <th style={{ padding: "var(--space-md)", textAlign: "center", fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                        <th style={{ padding: "var(--space-md)", textAlign: "right", fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessages.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: "var(--space-2xl)", textAlign: "center", color: "var(--color-text-muted)" }}>
                            No user requests found.
                          </td>
                        </tr>
                      ) : (
                        contactMessages.map((msg) => (
                          <tr
                            key={msg.id}
                            style={{ borderBottom: "1px solid var(--color-border)" }}
                          >
                            <td style={{ padding: "var(--space-md)", fontSize: "14px", color: "var(--color-text-muted)" }}>
                              {formatDate(msg.date)}
                            </td>
                            <td style={{ padding: "var(--space-md)" }}>
                              <div style={{ fontWeight: 600, color: "var(--color-dark)", fontSize: "14px" }}>{msg.name}</div>
                              <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{msg.email}</div>
                            </td>
                            <td style={{ padding: "var(--space-md)", fontSize: "14px" }}>
                              {msg.subject}
                            </td>
                            <td style={{ padding: "var(--space-md)", textAlign: "center" }}>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "100px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  background: msg.status === "Resolved" ? "rgba(39,174,96,0.1)" : "rgba(243,156,18,0.1)",
                                  color: msg.status === "Resolved" ? "var(--color-sport-green)" : "var(--color-gold)",
                                }}
                              >
                                {msg.status}
                              </span>
                            </td>
                            <td style={{ padding: "var(--space-md)", textAlign: "right" }}>
                              <button
                                className="admin-action-btn"
                                title="Full Detail"
                                onClick={() => {
                                  setSelectedMessage(msg);
                                  setModalType("messageDetail");
                                  setModalOpen(true);
                                }}
                                style={{
                                  background: "rgba(0,126,151,0.05)",
                                  color: "var(--color-primary)",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  border: "none",
                                  cursor: "pointer"
                                }}
                              >
                                Full Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "cms" && (
            <motion.div
              key="cms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CMSEditor />
            </motion.div>
          )}
          {activeTab === "admins" && (
            <motion.div
              key="admins"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminManagement />
            </motion.div>
          )}
          {activeTab === "logs" && (
            <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="admin-card" style={{ background: "white", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
                <div style={{ padding: "var(--space-xl)", borderBottom: "1px solid var(--color-border)" }}>
                  <h3 style={{ fontSize: "var(--text-lg)", margin: 0 }}>Security Audit Logs</h3>
                  <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>History of all role changes and account deletions.</p>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Action</th>
                        <th>Performed By</th>
                        <th>Target User</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminLogs.map((log) => (
                        <tr key={log.id} className="admin-table-row">
                          <td style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td>
                            <span style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              fontSize: "10px", 
                              fontWeight: 700, 
                              textTransform: "uppercase",
                              background: log.action.includes('DELETED') ? "rgba(239,68,68,0.1)" : "rgba(39,174,96,0.1)",
                              color: log.action.includes('DELETED') ? "var(--color-news-red)" : "var(--color-sport-green)"
                            }}>
                              {log.action.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, fontSize: "13px" }}>{log.adminName}</td>
                          <td style={{ fontSize: "13px" }}>{log.targetName} <span style={{ color: "var(--color-text-muted)", fontSize: "10px" }}>({log.targetUid.substring(0,8)})</span></td>
                          <td style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{log.details}</td>
                        </tr>
                      ))}
                      {adminLogs.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
                            No security logs found. Actions like promoting admins or deleting users will appear here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .admin-analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-xl); margin-bottom: var(--space-xl); }
        @media (max-width: 600px) {
          .admin-analytics-grid { grid-template-columns: 1fr; }
          .admin-header { text-align: center; justify-content: center; }
          .admin-header > div { width: 100%; display: flex; justify-content: center; }
          .admin-header h1 { font-size: var(--text-xl); }
        }
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
