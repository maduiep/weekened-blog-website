import { motion } from 'framer-motion';
import { Search, ShieldCheck } from 'lucide-react';

export default function AdminLogs({ adminLogs }) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const backendSessions = [];
  const backendSessionsLoading = false;
  const backendSessionError = null;

  return (
    <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="admin-card"
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
                  }}
                >
                  <h3 style={{ fontSize: "var(--text-lg)", margin: 0 }}>
                    Security Audit Logs
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                      marginTop: "4px",
                    }}
                  >
                    History of all role changes and account deletions.
                  </p>
                </div>
                <div
                  style={{
                    padding: "var(--space-xl)",
                    borderBottom: "1px solid var(--color-border)",
                    background: "var(--color-bg)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: "var(--text-md)" }}>
                        Backend Active Sessions
                      </h4>
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        Login/session details fetched from the backend session
                        store.
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {backendSessions.length} active session
                      {backendSessions.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div style={{ marginTop: "16px", overflowX: "auto" }}>
                    {backendSessionsLoading ? (
                      <p style={{ color: "var(--color-text-muted)" }}>
                        Loading backend session details…
                      </p>
                    ) : backendSessionError ? (
                      <p style={{ color: "var(--color-news-red)" }}>
                        {backendSessionError}
                      </p>
                    ) : backendSessions.length === 0 ? (
                      <p style={{ color: "var(--color-text-muted)" }}>
                        No active backend sessions found.
                      </p>
                    ) : (
                      <table className="admin-table" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>User ID</th>
                            <th>Session Started</th>
                            <th>Last Seen</th>
                            <th>Device Info</th>
                          </tr>
                        </thead>
                        <tbody>
                          {backendSessions.map((session) => (
                            <tr
                              key={session.sessionId}
                              className="admin-table-row"
                            >
                              <td style={{ fontSize: "13px", fontWeight: 600 }}>
                                {session.userId}
                              </td>
                              <td
                                style={{
                                  fontSize: "12px",
                                  color: "var(--color-text-muted)",
                                }}
                              >
                                {new Date(session.createdAt).toLocaleString()}
                              </td>
                              <td
                                style={{
                                  fontSize: "12px",
                                  color: "var(--color-text-muted)",
                                }}
                              >
                                {new Date(session.lastSeen).toLocaleString()}
                              </td>
                              <td
                                style={{
                                  fontSize: "12px",
                                  color: "var(--color-text-muted)",
                                }}
                                title={
                                  typeof session.deviceInfo === "string"
                                    ? session.deviceInfo
                                    : JSON.stringify(session.deviceInfo)
                                }
                              >
                                {typeof session.deviceInfo === "string"
                                  ? session.deviceInfo
                                  : session.deviceInfo.userAgent ||
                                    JSON.stringify(session.deviceInfo)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
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
                          <td
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td>
                            <span
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "10px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                background: log.action.includes("DELETED")
                                  ? "rgba(239,68,68,0.1)"
                                  : "rgba(39,174,96,0.1)",
                                color: log.action.includes("DELETED")
                                  ? "var(--color-news-red)"
                                  : "var(--color-sport-green)",
                              }}
                            >
                              {log.action.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, fontSize: "13px" }}>
                            {log.adminName}
                          </td>
                          <td style={{ fontSize: "13px" }}>
                            {log.targetName}{" "}
                            <span
                              style={{
                                color: "var(--color-text-muted)",
                                fontSize: "10px",
                              }}
                            >
                              ({log.targetUid.substring(0, 8)})
                            </span>
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {log.details}
                          </td>
                        </tr>
                      ))}
                      {adminLogs.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            style={{
                              textAlign: "center",
                              padding: "40px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            No security logs found. Actions like promoting
                            admins or deleting users will appear here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
  );
}


