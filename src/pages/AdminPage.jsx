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
  Upload,
  Landmark,
  Clock,
  X,
  AlertCircle,
  Image,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CMSEditor from "../components/admin/CMSEditor";
import AdminManagement from "../components/admin/AdminManagement";
import PlatformSettings from "../components/admin/PlatformSettings";
import { Link } from "react-router-dom";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminUsers from "../components/admin/AdminUsers";
import AdminMessages from "../components/admin/AdminMessages";
import AdminReceipts from "../components/admin/AdminReceipts";
import AdminLogs from "../components/admin/AdminLogs";
import AdminComments from "../components/admin/AdminComments";
import AdminAdRequests from "../components/admin/AdminAdRequests";
import { Megaphone } from "lucide-react";

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
  const [adminRecords, setAdminRecords] = useState([]);
  const [paymentReceipts, setPaymentReceipts] = useState([]);
  const [receiptFilter, setReceiptFilter] = useState("all");
  const [previewReceipt, setPreviewReceipt] = useState(null);
  const [reviewNote, setReviewNote] = useState("");

  const allUsers = getAllUsers();
  const subscribers = allUsers.filter((u) => u.isSubscribed);
  const adminUsersCount = allUsers.filter((u) => u.isAdmin).length;
  const adminLogs = getAdminLogs();
  const [backendSessions, setBackendSessions] = useState([]);
  const [backendSessionError, setBackendSessionError] = useState(null);
  const [backendSessionsLoading, setBackendSessionsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchBackendSessions = async () => {
      setBackendSessionError(null);
      setBackendSessionsLoading(true);

      try {
        const res = await fetch("http://localhost:3001/api/sessions/active");
        if (!res.ok) throw new Error("Failed to load backend sessions");
        const data = await res.json();
        if (active && Array.isArray(data.activeSessions)) {
          setBackendSessions(data.activeSessions);
        }
      } catch (error) {
        if (active) {
          setBackendSessionError(
            "Unable to load backend session details from the backend.",
          );
          setBackendSessions([]);
        }
      } finally {
        if (active) setBackendSessionsLoading(false);
      }
    };

    fetchBackendSessions();
    const interval = setInterval(fetchBackendSessions, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

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
        const txs = JSON.parse(localStorage.getItem("wp_transactions") || "[]");
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let total = 0;
        for (const t of txs) {
          if (!t.date || !t.amount) continue;
          const d = new Date(t.date);
          if (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
          ) {
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
        const msgs = JSON.parse(
          localStorage.getItem("wp_contact_messages") || "[]",
        );
        setContactMessages(Array.isArray(msgs) ? msgs : []);
      } catch (e) {
        setContactMessages([]);
      }
    };
    readMessages();

    const readAdminRecords = () => {
      try {
        const admins = JSON.parse(
          localStorage.getItem("wp_admin_records") || "[]",
        );
        setAdminRecords(Array.isArray(admins) ? admins : []);
      } catch (e) {
        setAdminRecords([]);
      }
    };
    readAdminRecords();

    const readReceipts = () => {
      try {
        const recs = JSON.parse(localStorage.getItem("wp_payment_receipts") || "[]");
        setPaymentReceipts(Array.isArray(recs) ? recs : []);
      } catch (e) {
        setPaymentReceipts([]);
      }
    };
    readReceipts();

    const onStorage = (e) => {
      if (
        e.key &&
        e.key !== KEY &&
        e.key !== "wp_transactions" &&
        e.key !== "wp_contact_messages" &&
        e.key !== "wp_admin_records" &&
        e.key !== "wp_payment_receipts"
      )
        return;
      read();
      calcRevenue();
      readMessages();
      readAdminRecords();
      readReceipts();
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
              position: "relative",
            }}
          >
            <Mail size={16} /> User Requests
            {contactMessages.filter((m) => m.status === "Unread").length >
              0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--color-news-red)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {contactMessages.filter((m) => m.status === "Unread").length}
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
              position: "relative",
            }}
          >
            <ShieldCheck size={16} /> Admin Roles
            {adminRecords.filter((a) => a.status === "Pending").length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--color-news-red)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {adminRecords.filter((a) => a.status === "Pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "settings" ? "white" : "transparent",
              color:
                activeTab === "settings"
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
            <Settings size={16} /> Platform Settings
          </button>
          <button
            onClick={() => setActiveTab("receipts")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "receipts" ? "white" : "transparent",
              color:
                activeTab === "receipts"
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              position: "relative",
            }}
          >
            <Upload size={16} /> Receipts
            {paymentReceipts.filter((r) => r.status === "pending").length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--color-news-red)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {paymentReceipts.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "comments" ? "white" : "transparent",
              color:
                activeTab === "comments"
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              position: "relative",
            }}
          >
            <MessageSquare size={16} /> Comments
            {(() => {
              const count = JSON.parse(localStorage.getItem("wp_article_comments") || "[]").length;
              if (count > 0) {
                return (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      background: "var(--color-primary)",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {count}
                  </span>
                );
              }
              return null;
            })()}
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
          <button
            onClick={() => setActiveTab("adrequests")}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "adrequests" ? "white" : "transparent",
              color:
                activeTab === "adrequests"
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              position: "relative",
            }}
          >
            <Megaphone size={16} /> Ad Requests
            {(() => {
              const count = JSON.parse(localStorage.getItem("wp_ad_requests") || "[]").filter(r => r.status === 'Pending').length;
              if (count > 0) {
                return (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      background: "var(--color-news-red)",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {count}
                  </span>
                );
              }
              return null;
            })()}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "adrequests" && (
            <AdminAdRequests adminUser={adminUser} showToast={showToast} />
          )}
          {activeTab === "analytics" && (
            <AdminAnalytics 
              showToast={showToast} 
              setModalType={setModalType} 
              setModalOpen={setModalOpen} 
              totalSubscribers={totalSubscribers} 
            />
          )}
          {activeTab === "users" && (
            <AdminUsers 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filtered={filtered}
              handleRevoke={handleRevoke}
              PLAN_COLORS={PLAN_COLORS}
              adminUser={adminUser}
              deleteUser={deleteUser}
              disconnectUser={disconnectUser}
              showToast={showToast}
            />
          )}
          {activeTab === "messages" && (
            <AdminMessages 
              contactMessages={contactMessages}
              setContactMessages={setContactMessages}
              setSelectedMessage={setSelectedMessage}
              showToast={showToast}
            />
          )}
          {activeTab === "cms" && (
            <motion.div key="cms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CMSEditor />
            </motion.div>
          )}
          {activeTab === "admins" && (
            <motion.div key="admins" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminManagement />
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PlatformSettings />
            </motion.div>
          )}
          {activeTab === "receipts" && (
            <AdminReceipts 
              paymentReceipts={paymentReceipts}
              setPaymentReceipts={setPaymentReceipts}
              receiptFilter={receiptFilter}
              setReceiptFilter={setReceiptFilter}
              previewReceipt={previewReceipt}
              setPreviewReceipt={setPreviewReceipt}
              reviewNote={reviewNote}
              setReviewNote={setReviewNote}
              adminUser={adminUser}
              showToast={showToast}
            />
          )}
          {activeTab === "logs" && (
            <AdminLogs adminLogs={adminLogs} />
          )}
          {activeTab === "comments" && (
            <AdminComments 
              adminUser={adminUser}
              showToast={showToast}
            />
          )}
        </AnimatePresence>

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
                    <svg width="100%" height="120" viewBox="0 0 400 120">
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
                    <svg width="100%" height="120" viewBox="0 0 400 120">
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
                      <circle r="15.9155" cx="21" cy="21" fill="#f1f5f9" />
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
                  <div
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    <div style={{ marginBottom: "var(--space-md)" }}>
                      <strong>From:</strong> {selectedMessage.name} &lt;
                      {selectedMessage.email}&gt;
                      <br />
                      <strong>Date:</strong> {formatDate(selectedMessage.date)}
                      <br />
                      <strong>Subject:</strong> {selectedMessage.subject}
                      <br />
                      <strong>Status:</strong> {selectedMessage.status}
                    </div>
                    <div
                      style={{
                        background: "rgba(0,0,0,0.03)",
                        padding: "var(--space-md)",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)",
                        minHeight: "100px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {selectedMessage.message}
                    </div>
                    <div
                      style={{
                        marginTop: "var(--space-lg)",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {selectedMessage.status !== "Resolved" && (
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            const msgs = [...contactMessages];
                            const idx = msgs.findIndex(
                              (m) => m.id === selectedMessage.id,
                            );
                            if (idx !== -1) {
                              msgs[idx].status = "Resolved";
                              setContactMessages(msgs);
                              localStorage.setItem(
                                "wp_contact_messages",
                                JSON.stringify(msgs),
                              );
                              showToast("Message marked as resolved!");
                              setModalOpen(false);
                            }
                          }}
                          style={{
                            background: "var(--color-sport-green)",
                            border: "none",
                          }}
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
