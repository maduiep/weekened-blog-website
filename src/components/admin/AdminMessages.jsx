import { motion } from 'framer-motion';
import { Search, CheckCircle, Eye, Mail } from 'lucide-react';

export default function AdminMessages({ contactMessages, setContactMessages, setSelectedMessage, showToast, setModalOpen, setModalType }) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
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
                  <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw", paddingBottom: "16px" }}><table
                    className="admin-table"
                    style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "var(--color-bg)",
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <th
                          style={{
                            padding: "var(--space-md)",
                            textAlign: "left",
                            fontSize: "12px",
                            color: "var(--color-text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            padding: "var(--space-md)",
                            textAlign: "left",
                            fontSize: "12px",
                            color: "var(--color-text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          User
                        </th>
                        <th
                          style={{
                            padding: "var(--space-md)",
                            textAlign: "left",
                            fontSize: "12px",
                            color: "var(--color-text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Subject
                        </th>
                        <th
                          style={{
                            padding: "var(--space-md)",
                            textAlign: "center",
                            fontSize: "12px",
                            color: "var(--color-text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            padding: "var(--space-md)",
                            textAlign: "right",
                            fontSize: "12px",
                            color: "var(--color-text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessages.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            style={{
                              padding: "var(--space-2xl)",
                              textAlign: "center",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            No user requests found.
                          </td>
                        </tr>
                      ) : (
                        contactMessages.map((msg) => (
                          <tr
                            key={msg.id}
                            style={{
                              borderBottom: "1px solid var(--color-border)",
                            }}
                          >
                            <td
                              style={{
                                padding: "var(--space-md)",
                                fontSize: "14px",
                                color: "var(--color-text-muted)",
                              }}
                            >
                              {formatDate(msg.date)}
                            </td>
                            <td style={{ padding: "var(--space-md)" }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "var(--color-dark)",
                                  fontSize: "14px",
                                }}
                              >
                                {msg.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "var(--color-text-muted)",
                                }}
                              >
                                {msg.email}
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "var(--space-md)",
                                fontSize: "14px",
                              }}
                            >
                              {msg.subject}
                            </td>
                            <td
                              style={{
                                padding: "var(--space-md)",
                                textAlign: "center",
                              }}
                            >
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "100px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  background:
                                    msg.status === "Resolved"
                                      ? "rgba(39,174,96,0.1)"
                                      : "rgba(243,156,18,0.1)",
                                  color:
                                    msg.status === "Resolved"
                                      ? "var(--color-sport-green)"
                                      : "var(--color-gold)",
                                }}
                              >
                                {msg.status}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "var(--space-md)",
                                textAlign: "right",
                              }}
                            >
                              <button
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
                                  whiteSpace: "nowrap",
                                  cursor: "pointer",
                                }}
                              >
                                Full Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table></div>
                </div>
              </div>
            </motion.div>
  );
}


