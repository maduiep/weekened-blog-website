import { motion } from 'framer-motion';
import { Mail, Search, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminNewsletters({ showToast }) {
  const [subscribers, setSubscribers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubs = () => {
      const raw = localStorage.getItem("wp_newsletter_subs");
      if (raw) {
        try {
          setSubscribers(JSON.parse(raw));
        } catch(e) {}
      }
    };
    fetchSubs();

    const onStorage = (e) => {
      if (e.key && e.key !== "wp_newsletter_subs") return;
      fetchSubs();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleDelete = (email) => {
    if (!confirm(`Remove ${email} from newsletter list?`)) return;
    const newSubs = subscribers.filter(s => s.email !== email);
    setSubscribers(newSubs);
    localStorage.setItem("wp_newsletter_subs", JSON.stringify(newSubs));
    showToast(`Removed ${email}`);
  };

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ background: "white", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ padding: "var(--space-xl)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "10px 16px 10px 40px", borderRadius: "10px", border: "1px solid var(--color-border)", outline: "none", fontSize: "var(--text-sm)" }}
            />
          </div>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-muted)" }}>
            Total Subscribers: <span style={{ color: "var(--color-dark)" }}>{subscribers.length}</span>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Subscribed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "var(--space-2xl)", color: "var(--color-text-muted)" }}>
                    No newsletter subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub, i) => (
                  <tr key={i} className="admin-table-row">
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Mail size={16} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: "var(--text-sm)" }}>{sub.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{new Date(sub.date).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(sub.email)} className="btn btn-ghost" style={{ padding: "6px", color: "var(--color-news-red)" }}>
                        <Trash2 size={16} />
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
  );
}
