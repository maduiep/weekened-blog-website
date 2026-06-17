import { motion } from 'framer-motion';
import { Search, ShieldCheck, Mail, CheckCircle, XCircle, CreditCard, Trash2, Eye, X } from 'lucide-react';
import { useState } from 'react';

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

export default function AdminUsers({ searchQuery, setSearchQuery, filterStatus, setFilterStatus, filtered, handleRevoke, PLAN_COLORS, adminUser, deleteUser, disconnectUser, showToast }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
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
                        fontSize: "var(--text-sm)",
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
                          fontSize: "var(--text-xs)",
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
                                style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}
                              >
                                {u.name}
                              </div>
                            </div>
                          </td>
                          <td
                            style={{
                              fontSize: "var(--text-sm)",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {u.email}
                          </td>
                          <td>
                            {u.isAdmin ? (
                              <span
                                style={{
                                  color: "var(--color-sport-green)",
                                  fontWeight: 800,
                                  fontSize: "var(--text-xs)",
                                  textTransform: "uppercase",
                                }}
                              >
                                Admin
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "var(--color-text-muted)",
                                  fontSize: "var(--text-xs)",
                                  textTransform: "uppercase",
                                }}
                              >
                                User
                              </span>
                            )}
                          </td>
                          <td>
                            {u.isSubscribed || u.subscriptionPlan === "pay-per-story" ? (
                              <span
                                style={{
                                  color:
                                    PLAN_COLORS[u.subscriptionPlan] ||
                                    "var(--color-primary)",
                                  fontWeight: 800,
                                  textTransform: "uppercase",
                                  fontSize: "var(--text-xs)",
                                }}
                              >
                                {u.subscriptionTier ||
                                  (u.subscriptionPlan === "pay-per-story"
                                    ? "Pay Per Story"
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
                                  fontSize: "var(--text-xs)",
                                }}
                              >
                                Free Tier
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {u.activeSessionId ? "1 (Active)" : "None"}
                          </td>
                          <td
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {formatDate(u.subscriptionExpiry)}
                          </td>
                          <td
                            style={{
                              fontSize: "var(--text-xs)",
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
                                  title={
                                    u.isAdmin ? "Remove Admin" : "Make Admin"
                                  }
                                  onClick={() => {
                                    if (
                                      !confirm(
                                        `Change role of ${u.name} to ${u.isAdmin ? "User" : "Admin"}?`,
                                      )
                                    )
                                      return;
                                    assignRole(
                                      u.uid,
                                      u.isAdmin ? "user" : "admin",
                                    );
                                    showToast(
                                      `${u.name} is now ${u.isAdmin ? "User" : "Admin"}`,
                                    );
                                  }}
                                  style={{
                                    color: u.isAdmin
                                      ? "var(--color-news-red)"
                                      : "var(--color-sport-green)",
                                    background: u.isAdmin
                                      ? "rgba(239,68,68,0.05)"
                                      : "rgba(39,174,96,0.05)",
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
                                    if (
                                      !confirm(
                                        `Are you sure you want to completely DELETE ${u.name}'s account? This action cannot be undone.`,
                                      )
                                    )
                                      return;
                                    deleteUser(u.uid);
                                    showToast(
                                      `${u.name}'s account was deleted.`,
                                    );
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              <button
                                className="admin-action-btn"
                                title="View Details"
                                onClick={() => setSelectedUser(u)}
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

              {/* User Details Modal */}
              {selectedUser && (
                <div style={{
                  position: "fixed",
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  padding: "var(--space-md)"
                }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: "white",
                      borderRadius: "var(--radius-xl)",
                      width: "100%",
                      maxWidth: "500px",
                      overflow: "hidden",
                      boxShadow: "var(--shadow-xl)"
                    }}
                  >
                    <div style={{
                      padding: "var(--space-lg)",
                      borderBottom: "1px solid var(--color-border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <h3 style={{ fontSize: "var(--text-xl)", margin: 0 }}>User Details</h3>
                      <button 
                        onClick={() => setSelectedUser(null)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--color-border)" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-2xl)", fontWeight: 800 }}>
                          {selectedUser.avatar || selectedUser.name.charAt(0)}
                        </div>
                        <div>
                          <h4 style={{ fontSize: "var(--text-lg)", margin: "0 0 4px 0" }}>{selectedUser.name}</h4>
                          <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", display: "flex", alignItems: "center", gap: 6 }}>
                            <Mail size={14} /> {selectedUser.email}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                        <div>
                          <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Role</label>
                          <div style={{ fontWeight: 600, marginTop: 4 }}>{selectedUser.isAdmin ? "Administrator" : "Standard User"}</div>
                        </div>
                        <div>
                          <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Status</label>
                          <div style={{ fontWeight: 600, marginTop: 4, color: selectedUser.isBlocked ? "var(--color-news-red)" : "var(--color-sport-green)" }}>
                            {selectedUser.isBlocked ? "Suspended" : "Active"}
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Subscription Plan</label>
                          <div style={{ fontWeight: 600, marginTop: 4, color: "var(--color-primary)" }}>
                            {selectedUser.isSubscribed ? (selectedUser.subscriptionPlan ? selectedUser.subscriptionPlan.toUpperCase() : "PAID") : "Free Tier"}
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Active Devices</label>
                          <div style={{ fontWeight: 600, marginTop: 4 }}>{selectedUser.activeSessionId ? "1 Connected" : "None"}</div>
                        </div>
                        <div>
                          <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Joined Date</label>
                          <div style={{ fontWeight: 600, marginTop: 4 }}>{formatDate(selectedUser.createdAt)}</div>
                        </div>
                        <div>
                          <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>User ID</label>
                          <div style={{ fontWeight: 600, marginTop: 4, fontSize: "var(--text-xs)", wordBreak: "break-all" }}>{selectedUser.uid}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
  );
}




