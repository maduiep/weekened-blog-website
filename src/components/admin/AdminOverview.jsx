import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, CreditCard, Eye, ShieldCheck, DollarSign, Database, Download } from "lucide-react";

export default function AdminOverview({ adminUser, showToast, allUsers, subscribers, activeReaders, corporateSubs, enterpriseSubs, mtdRevenue, adminUsersCount }) {
  return (
    <>

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
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <h1 style={{ fontSize: "var(--text-2xl)", margin: 0 }}>
                Business Overview
              </h1>
              <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "14px" }}>
                Welcome back, {adminUser?.name || "Admin"}. Here's what's happening today.
              </p>
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
        
    </>
  );
}



