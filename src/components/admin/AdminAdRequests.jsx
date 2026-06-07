import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Megaphone, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAdRequests({ adminUser, showToast }) {
  const [adRequests, setAdRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");

  useEffect(() => {
    const loadRequests = () => {
      const stored = JSON.parse(localStorage.getItem("wp_ad_requests") || "[]");
      setAdRequests(stored);
    };
    loadRequests();
    window.addEventListener("storage", loadRequests);
    return () => window.removeEventListener("storage", loadRequests);
  }, []);

  const handleAction = (id, action) => {
    const recs = JSON.parse(localStorage.getItem("wp_ad_requests") || "[]");
    const idx = recs.findIndex((r) => r.id === id);
    if (idx !== -1) {
      recs[idx].status = action === "approve" ? "Approved" : "Rejected";
      recs[idx].reviewedBy = adminUser?.name || "Admin";
      recs[idx].reviewedAt = new Date().toISOString();
      localStorage.setItem("wp_ad_requests", JSON.stringify(recs));
      setAdRequests(recs);

      if (action === "approve") {
        // Push to live inventory
        const inventory = JSON.parse(localStorage.getItem("wp_ad_inventory") || "[]");
        const newLiveAd = {
          id: recs[idx].id,
          type: recs[idx].type,
          category: recs[idx].category === "All" ? null : recs[idx].category,
          advertiser: recs[idx].userName,
          imageUrl: recs[idx].imageUrl,
          title: recs[idx].title,
        };
        localStorage.setItem("wp_ad_inventory", JSON.stringify([newLiveAd, ...inventory]));
      }
      showToast(`Ad Request ${id} ${action === "approve" ? "approved" : "rejected"}.`);
    }
  };

  const filtered = adRequests.filter((r) => r.status === activeTab);

  return (
    <motion.div
      key="adrequests"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div
        className="admin-header-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-xl)",
        }}
      >
        <h2 style={{ fontSize: "var(--text-xl)", margin: 0 }}>Corporate Ad Requests</h2>
        <div className="admin-filters">
          {["Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`btn btn-sm ${
                activeTab === status ? "btn-primary" : "btn-ghost"
              }`}
            >
              {status} (
              {adRequests.filter((r) => r.status === status).length})
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw", paddingBottom: "16px" }}><table className="admin-table">
          <thead>
            <tr>
              <th>Campaign Details</th>
              <th>Placement & Category</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "var(--space-2xl)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <Megaphone
                    size={32}
                    style={{ marginBottom: "var(--space-sm)", opacity: 0.5 }}
                  />
                  <div>No {activeTab.toLowerCase()} advert requests.</div>
                </td>
              </tr>
            ) : (
              filtered.map((ad) => (
                <tr key={ad.id}>
                  <td>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <img
                        src={ad.imageUrl}
                        alt="Ad Creative"
                        style={{
                          width: "60px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid var(--color-border)",
                        }}
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/60x40/f8fafc/94a3b8?text=AD")
                        }
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{ad.title}</div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          By: {ad.userName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, textTransform: "capitalize" }}>
                      {ad.type}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {ad.category}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} />
                      <span style={{ fontSize: "13px" }}>{ad.duration}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background:
                          ad.status === "Pending"
                            ? "#fff7ed"
                            : ad.status === "Approved"
                            ? "#e8f8f5"
                            : "#fee2e2",
                        color:
                          ad.status === "Pending"
                            ? "var(--color-sport-green)"
                            : ad.status === "Approved"
                            ? "#2ecc71"
                            : "var(--color-news-red)",
                      }}
                    >
                      {ad.status}
                    </span>
                  </td>
                  <td>
                    {ad.status === "Pending" ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleAction(ad.id, "approve")}
                          className="btn btn-primary btn-sm"
                          style={{ padding: "4px 8px" }}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(ad.id, "reject")}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "4px 8px", color: "var(--color-news-red)" }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {ad.status} by {ad.reviewedBy || "Admin"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table></div>
      </div>
    </motion.div>
  );
}

