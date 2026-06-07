import { LayoutDashboard, BarChart2, Mail, Users, FileText, ShieldCheck, Settings, Upload, MessageSquare, Megaphone } from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab, contactMessages, adminRecords, paymentReceipts, adminUsersCount }) {
  return (
    <aside
      className="admin-sidebar-container"
      style={{
        background: "white",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        flexShrink: 0,
        padding: "var(--space-xl) var(--space-md)",
      }}
    >
          <div className="admin-sidebar-header" style={{ marginBottom: "var(--space-2xl)", padding: "0 var(--space-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
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
                <h1 style={{ fontSize: "16px", margin: 0, fontWeight: 700 }}>
                  Admin Dashboard
                </h1>
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { id: "analytics", label: "Insights", icon: BarChart2 },
              { id: "messages", label: "User Requests", icon: Mail, badge: contactMessages.filter((m) => m.status === "Unread").length },
              { id: "users", label: "Customers", icon: Users },
              { id: "cms", label: "CMS / Articles", icon: FileText },
              { id: "admins", label: "Admin Roles", icon: ShieldCheck, badge: adminRecords.filter((a) => a.status === "Pending").length },
              { id: "settings", label: "Platform Settings", icon: Settings },
              { id: "receipts", label: "Receipts", icon: Upload, badge: paymentReceipts.filter((r) => r.status === "pending").length },
              { id: "comments", label: "Comments", icon: MessageSquare, badge: JSON.parse(localStorage.getItem("wp_article_comments") || "[]").length },
              { id: "logs", label: "Security & Logs", icon: ShieldCheck },
              { id: "adrequests", label: "Ad Requests", icon: Megaphone, badge: JSON.parse(localStorage.getItem("wp_ad_requests") || "[]").filter(r => r.status === 'Pending').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: activeTab === tab.id ? "rgba(0,126,151,0.08)" : "transparent",
                  color: activeTab === tab.id ? "var(--color-primary)" : "var(--color-text-muted)",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "14px",
                  position: "relative",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <tab.icon size={18} style={{ color: activeTab === tab.id ? "var(--color-primary)" : "var(--color-text-muted)" }} />
                  {tab.label}
                </div>
                {tab.badge > 0 && (
                  <span
                    style={{
                      background: tab.id === "messages" || tab.id === "admins" || tab.id === "receipts" || tab.id === "adrequests" ? "var(--color-news-red)" : "var(--color-primary)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "2px 8px",
                      borderRadius: "100px",
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>
  );
}
