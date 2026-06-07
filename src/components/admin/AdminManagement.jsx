import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, UserPlus, Trash2, History, X } from "lucide-react";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");

  // History modal state
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem("wp_admin_records") || "[]");
    if (loaded.length === 0) {
      // Seed default admin
      const seed = [
        {
          id: "admin-001",
          name: "Super Admin",
          email: "admin@weekendpost.co.bw",
          role: "Super Admin",
          status: "Active",
          history: [
            {
              action: "Created as Super Admin",
              date: new Date().toISOString(),
            },
          ],
        },
      ];
      localStorage.setItem("wp_admin_records", JSON.stringify(seed));
      setAdmins(seed);
    } else {
      setAdmins(loaded);
    }
  }, []);

  const saveAdmins = (newAdmins) => {
    setAdmins(newAdmins);
    localStorage.setItem("wp_admin_records", JSON.stringify(newAdmins));
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const newAdmin = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'adm-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36),
      name,
      email,
      role,
      status: "Active",
      history: [
        { action: `Assigned role: ${role}`, date: new Date().toISOString() },
      ],
    };
    saveAdmins([...admins, newAdmin]);
    setShowAddForm(false);
    setName("");
    setEmail("");
    setRole("Editor");
  };

  const handleDeleteAdmin = (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    const updated = admins.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          status: "Deleted",
          history: [
            ...a.history,
            {
              action: "Revoked access (Deleted)",
              date: new Date().toISOString(),
            },
          ],
        };
      }
      return a;
    });
    saveAdmins(updated);
  };

  const handleRestoreAdmin = (id) => {
    const updated = admins.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          status: "Active",
          history: [
            ...a.history,
            { action: "Access Restored", date: new Date().toISOString() },
          ],
        };
      }
      return a;
    });
    saveAdmins(updated);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          padding: "var(--space-xl)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "var(--text-lg)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={20} /> Admin Roles & Permissions
          </h3>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            Manage staff members, roles, and view access history.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {showAddForm ? (
            "Cancel"
          ) : (
            <>
              <UserPlus size={16} /> Add Admin
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div
          style={{
            padding: "var(--space-xl)",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-bg)",
          }}
        >
          <form
            onSubmit={handleAddAdmin}
            style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}
          >
            <div style={{ flex: '1 1 200px' }}>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
                placeholder="e.g. John Doe"
              />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
                placeholder="john@weekendpost.com"
              />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  appearance: "none",
                  WebkitAppearance: "none",
                  backgroundColor: "white",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  backgroundSize: "16px",
                  cursor: "pointer",
                }}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Editor">Editor</option>
                <option value="Writer">Writer</option>
                <option value="Moderator">Moderator</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "10px 20px", height: "42px", flex: '1 1 150px' }}
            >
              Save Admin
            </button>
          </form>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw", paddingBottom: "16px" }}><table
          style={{
            width: "100%",
            borderCollapse: "collapse", minWidth: "600px",
            fontSize: "var(--text-sm)",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-bg-alt)",
                textAlign: "left",
              }}
            >
              <th
                style={{
                  padding: "16px var(--space-xl)",
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                }}
              >
                Admin User
              </th>
              <th
                style={{
                  padding: "16px var(--space-xl)",
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                }}
              >
                Role
              </th>
              <th
                style={{
                  padding: "16px var(--space-xl)",
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "16px var(--space-xl)",
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr
                key={admin.id}
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <td style={{ padding: "16px var(--space-xl)" }}>
                  <div style={{ fontWeight: 600 }}>{admin.name}</div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {admin.email}
                  </div>
                </td>
                <td style={{ padding: "16px var(--space-xl)" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      background:
                        admin.role === "Super Admin"
                          ? "rgba(0,0,0,0.8)"
                          : "rgba(0,126,151,0.1)",
                      color:
                        admin.role === "Super Admin"
                          ? "white"
                          : "var(--color-primary)",
                    }}
                  >
                    {admin.role}
                  </span>
                </td>
                <td style={{ padding: "16px var(--space-xl)" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color:
                        admin.status === "Active"
                          ? "var(--color-sport-green)"
                          : "var(--color-news-red)",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background:
                          admin.status === "Active"
                            ? "var(--color-sport-green)"
                            : "var(--color-news-red)",
                      }}
                    />
                    {admin.status}
                  </span>
                </td>
                <td style={{ padding: "16px var(--space-xl)" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setSelectedAdmin(admin)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-text-muted)",
                      }}
                      title="View History"
                    >
                      <History size={18} />
                    </button>
                    {admin.status === "Active" && admin.id !== "admin-001" && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-news-red)",
                        }}
                        title="Revoke Access"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {admin.status === "Pending" && (
                      <button
                        onClick={() => {
                          const updated = admins.map((a) =>
                            a.id === admin.id
                              ? {
                                  ...a,
                                  status: "Active",
                                  history: [
                                    ...a.history,
                                    {
                                      action: "Approved by Super Admin",
                                      date: new Date().toISOString(),
                                    },
                                  ],
                                }
                              : a,
                          );
                          saveAdmins(updated);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-sport-green)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                        }}
                        title="Approve"
                      >
                        Approve
                      </button>
                    )}
                    {admin.status === "Deleted" && (
                      <button
                        onClick={() => handleRestoreAdmin(admin.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-sport-green)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                        }}
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      {/* History Modal */}
      {selectedAdmin && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "white",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "500px",
              padding: "var(--space-2xl)",
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
              <h3 style={{ margin: 0 }}>Role History: {selectedAdmin.name}</h3>
              <button
                onClick={() => setSelectedAdmin(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {selectedAdmin.history.map((entry, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "var(--color-primary)",
                      marginTop: "6px",
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>
                      {entry.action}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {new Date(entry.date).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}




