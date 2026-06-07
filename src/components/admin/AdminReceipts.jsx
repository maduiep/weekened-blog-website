import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Upload, Clock, Image, CheckCircle, XCircle, X, FileText, Download, AlertCircle } from 'lucide-react';

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

export default function AdminReceipts({ 
  paymentReceipts, 
  setPaymentReceipts, 
  receiptFilter, 
  setReceiptFilter, 
  previewReceipt, 
  setPreviewReceipt, 
  reviewNote, 
  setReviewNote, 
  adminUser, 
  showToast 
}) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const grantUserSubscription = (receipt) => {
    const users = JSON.parse(localStorage.getItem('wp_users') || '[]');
    const idx = users.findIndex((u) => u.uid === receipt.userId);
    if (idx !== -1) {
      const isStoryPurchase = receipt.planId?.startsWith('story:');
      if (isStoryPurchase) {
        const articleId = Number(receipt.planId.split(':')[1]);
        const currentStories = users[idx].purchasedStories || [];
        if (!currentStories.includes(articleId)) {
          users[idx].purchasedStories = [...currentStories, articleId];
        }
        users[idx].subscriptionPlan = "storypass";
        users[idx].isSubscribed = users[idx].isSubscribed || false;
      } else {
        const expiryMap = {
          weekly: 7,
          monthly: 30,
          annual: 365,
          corporate: 365,
          enterprise: 730,
          storypass: 0,
        };
        const days = expiryMap[receipt.planId] || 30;
        users[idx].isSubscribed = true;
        users[idx].subscriptionPlan = receipt.planId;
        users[idx].subscriptionExpiry = new Date(Date.now() + days * 86400000).toISOString();
        if (receipt.planId === "corporate") users[idx].subscriptionTier = "Corporate";
        if (receipt.planId === "enterprise") users[idx].subscriptionTier = "Enterprise";
      }
      localStorage.setItem('wp_users', JSON.stringify(users));
    }
  };

  return (
    <motion.div
              key="receipts"
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "var(--space-md)",
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
                      <Landmark size={20} color="var(--color-primary)" />
                      Payment Receipts
                    </h3>
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-muted)",
                        marginTop: "4px",
                      }}
                    >
                      Review and verify bank transfer proof-of-payment uploads from subscribers.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["all", "pending", "approved", "rejected"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setReceiptFilter(f)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border: "1px solid var(--color-border)",
                          background: receiptFilter === f ? "var(--color-primary)" : "white",
                          color: receiptFilter === f ? "white" : "var(--color-text-muted)",
                          fontWeight: 700,
                          fontSize: "var(--text-xs)",
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentReceipts.filter(
                  (r) => receiptFilter === "all" || r.status === receiptFilter
                ).length === 0 ? (
                  <div
                    style={{
                      padding: "var(--space-4xl)",
                      textAlign: "center",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <Upload
                      size={48}
                      style={{ marginBottom: 16, opacity: 0.3 }}
                    />
                    <h4 style={{ marginBottom: 8 }}>No Receipts Found</h4>
                    <p style={{ fontSize: "var(--text-sm)" }}>
                      {receiptFilter === "all"
                        ? "No bank transfer receipts have been uploaded yet."
                        : `No ${receiptFilter} receipts to display.`}
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw", paddingBottom: "16px" }}><table className="admin-table">
                      <thead>
                        <tr>
                          <th>Receipt ID</th>
                          <th>User</th>
                          <th>Plan</th>
                          <th>Amount</th>
                          <th>Submitted</th>
                          <th>File</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentReceipts
                          .filter(
                            (r) =>
                              receiptFilter === "all" || r.status === receiptFilter
                          )
                          .map((receipt) => (
                            <tr key={receipt.id} className="admin-table-row">
                              <td>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    fontSize: "var(--text-xs)",
                                    color: "var(--color-primary)",
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {receipt.id}
                                </span>
                              </td>
                              <td>
                                <div>
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      fontSize: "var(--text-sm)",
                                    }}
                                  >
                                    {receipt.userName}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "var(--text-xs)",
                                      color: "var(--color-text-muted)",
                                    }}
                                  >
                                    {receipt.userEmail}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    background:
                                      PLAN_COLORS[receipt.planId] ||
                                      "var(--color-primary)",
                                    color: "white",
                                    fontSize: "10px",
                                    padding: "3px 8px",
                                  }}
                                >
                                  {receipt.planName}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>
                                  {receipt.currency}
                                  {receipt.amount}
                                </span>
                              </td>
                              <td>
                                <div
                                  style={{
                                    fontSize: "var(--text-xs)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <Clock size={12} color="var(--color-text-muted)" />
                                  {formatDate(receipt.submittedAt)}
                                </div>
                              </td>
                              <td>
                                <button
                                  onClick={() => setPreviewReceipt(receipt)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--color-border)",
                                    background: "var(--color-bg-alt)",
                                    cursor: "pointer",
                                    fontSize: "var(--text-xs)",
                                    fontWeight: 600,
                                    color: "var(--color-primary)",
                                  }}
                                >
                                  <Image size={12} /> View
                                </button>
                              </td>
                              <td>
                                <span
                                  style={{
                                    padding: "4px 10px",
                                    borderRadius: "20px",
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    background:
                                      receipt.status === "approved"
                                        ? "rgba(39,174,96,0.1)"
                                        : receipt.status === "rejected"
                                        ? "rgba(239,68,68,0.1)"
                                        : "rgba(243,156,18,0.1)",
                                    color:
                                      receipt.status === "approved"
                                        ? "var(--color-sport-green)"
                                        : receipt.status === "rejected"
                                        ? "var(--color-news-red)"
                                        : "#F5A623",
                                  }}
                                >
                                  {receipt.status === "pending" ? "⏳ Pending" : receipt.status === "approved" ? "✓ Approved" : "✕ Rejected"}
                                </span>
                              </td>
                              <td>
                                {receipt.status === "pending" ? (
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button
                                      onClick={() => {
                                        const recs = JSON.parse(
                                          localStorage.getItem("wp_payment_receipts") || "[]"
                                        );
                                        const idx = recs.findIndex((r) => r.id === receipt.id);
                                        if (idx !== -1) {
                                          recs[idx].status = "approved";
                                          recs[idx].reviewedBy = adminUser?.name || "Admin";
                                          recs[idx].reviewedAt = new Date().toISOString();
                                          localStorage.setItem(
                                            "wp_payment_receipts",
                                            JSON.stringify(recs)
                                          );
                                          grantUserSubscription(receipt);
                                          setPaymentReceipts([...recs]);
                                          showToast(`Receipt ${receipt.id} approved`);
                                        }
                                      }}
                                      style={{
                                        padding: "6px 12px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "var(--color-sport-green)",
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: "var(--text-xs)",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                      }}
                                    >
                                      <CheckCircle size={12} /> Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        const recs = JSON.parse(
                                          localStorage.getItem("wp_payment_receipts") || "[]"
                                        );
                                        const idx = recs.findIndex((r) => r.id === receipt.id);
                                        if (idx !== -1) {
                                          recs[idx].status = "rejected";
                                          recs[idx].reviewedBy = adminUser?.name || "Admin";
                                          recs[idx].reviewedAt = new Date().toISOString();
                                          localStorage.setItem(
                                            "wp_payment_receipts",
                                            JSON.stringify(recs)
                                          );
                                          setPaymentReceipts([...recs]);
                                          showToast(`Receipt ${receipt.id} rejected`, "error");
                                        }
                                      }}
                                      style={{
                                        padding: "6px 12px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "rgba(239,68,68,0.1)",
                                        color: "var(--color-news-red)",
                                        fontWeight: 700,
                                        fontSize: "var(--text-xs)",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                      }}
                                    >
                                      <XCircle size={12} /> Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span
                                    style={{
                                      fontSize: "var(--text-xs)",
                                      color: "var(--color-text-muted)",
                                    }}
                                  >
                                    by {receipt.reviewedBy}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table></div>
                  </div>
                )}
              </div>

              {/* Receipt Preview Modal */}
              <AnimatePresence>
                {previewReceipt && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => { setPreviewReceipt(null); setReviewNote(""); }}
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(4px)",
                      zIndex: 3000,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: "white",
                        borderRadius: "20px",
                        width: "100%",
                        maxWidth: "600px",
                        maxHeight: "90vh",
                        overflow: "auto",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
                      }}
                    >
                      {/* Modal Header */}
                      <div
                        style={{
                          padding: "20px 24px",
                          borderBottom: "1px solid var(--color-border)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h3 style={{ margin: 0, fontSize: "var(--text-lg)" }}>
                            Receipt {previewReceipt.id}
                          </h3>
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: "var(--text-xs)",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            Uploaded by {previewReceipt.userName} ({previewReceipt.userEmail})
                          </p>
                        </div>
                        <button
                          onClick={() => { setPreviewReceipt(null); setReviewNote(""); }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          <X size={24} />
                        </button>
                      </div>

                      {/* Receipt Details */}
                      <div style={{ padding: "20px 24px" }}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                            gap: "12px",
                            marginBottom: "20px",
                          }}
                        >
                          {[
                            { label: "Plan", value: previewReceipt.planName },
                            { label: "Amount", value: `${previewReceipt.currency}${previewReceipt.amount}` },
                            { label: "Submitted", value: formatDate(previewReceipt.submittedAt) },
                            { label: "File", value: previewReceipt.fileName },
                          ].map((item, i) => (
                            <div
                              key={i}
                              style={{
                                background: "var(--color-bg-alt)",
                                padding: "10px 14px",
                                borderRadius: "10px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  color: "var(--color-text-muted)",
                                  textTransform: "uppercase",
                                  marginBottom: "2px",
                                }}
                              >
                                {item.label}
                              </div>
                              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                                {item.value}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* File Preview */}
                        <div
                          style={{
                            border: "1px solid var(--color-border)",
                            borderRadius: "12px",
                            overflow: "hidden",
                            marginBottom: "20px",
                            background: "#f8f9fa",
                          }}
                        >
                          {previewReceipt.fileData &&
                          previewReceipt.fileType?.startsWith("image/") ? (
                            <img
                              src={previewReceipt.fileData}
                              alt="Receipt"
                              style={{
                                width: "100%",
                                maxHeight: "400px",
                                objectFit: "contain",
                                display: "block",
                              }}
                            />
                          ) : previewReceipt.fileData &&
                            previewReceipt.fileType === "application/pdf" ? (
                            <div
                              style={{
                                padding: "40px",
                                textAlign: "center",
                              }}
                            >
                              <FileText
                                size={48}
                                color="var(--color-primary)"
                                style={{ marginBottom: 12 }}
                              />
                              <p style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>
                                {previewReceipt.fileName}
                              </p>
                              <a
                                href={previewReceipt.fileData}
                                download={previewReceipt.fileName}
                                className="btn btn-primary btn-sm"
                                style={{ marginTop: 12, display: "inline-flex" }}
                              >
                                <Download size={14} /> Download PDF
                              </a>
                            </div>
                          ) : (
                            <div
                              style={{
                                padding: "40px",
                                textAlign: "center",
                                color: "var(--color-text-muted)",
                              }}
                            >
                              <AlertCircle
                                size={32}
                                style={{ marginBottom: 8 }}
                              />
                              <p>Preview not available</p>
                            </div>
                          )}
                        </div>

                        {/* Admin Review Actions */}
                        {previewReceipt.status === "pending" && (
                          <div>
                            <label
                              style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: 700,
                                color: "var(--color-text-muted)",
                                display: "block",
                                marginBottom: 6,
                              }}
                            >
                              Review Note (optional)
                            </label>
                            <textarea
                              value={reviewNote}
                              onChange={(e) => setReviewNote(e.target.value)}
                              placeholder="Add a note for this review..."
                              style={{
                                width: "100%",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                border: "1px solid var(--color-border)",
                                fontSize: "var(--text-sm)",
                                minHeight: "60px",
                                resize: "vertical",
                                marginBottom: "16px",
                              }}
                            />
                            <div style={{ display: "flex", gap: 12 }}>
                              <button
                                onClick={() => {
                                  const recs = JSON.parse(
                                    localStorage.getItem("wp_payment_receipts") || "[]"
                                  );
                                  const idx = recs.findIndex(
                                    (r) => r.id === previewReceipt.id
                                  );
                                  if (idx !== -1) {
                                    recs[idx].status = "approved";
                                    recs[idx].reviewedBy = adminUser?.name || "Admin";
                                    recs[idx].reviewedAt = new Date().toISOString();
                                    recs[idx].reviewNote = reviewNote;
                                    localStorage.setItem(
                                      "wp_payment_receipts",
                                      JSON.stringify(recs)
                                    );
                                    grantUserSubscription(previewReceipt);
                                    setPaymentReceipts([...recs]);
                                    setPreviewReceipt(null);
                                    setReviewNote("");
                                    showToast(
                                      `Receipt ${previewReceipt.id} approved`
                                    );
                                  }
                                }}
                                className="btn btn-lg"
                                style={{
                                  flex: 1,
                                  background: "var(--color-sport-green)",
                                  color: "white",
                                  border: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 8,
                                }}
                              >
                                <CheckCircle size={18} /> Approve Payment
                              </button>
                              <button
                                onClick={() => {
                                  const recs = JSON.parse(
                                    localStorage.getItem("wp_payment_receipts") || "[]"
                                  );
                                  const idx = recs.findIndex(
                                    (r) => r.id === previewReceipt.id
                                  );
                                  if (idx !== -1) {
                                    recs[idx].status = "rejected";
                                    recs[idx].reviewedBy = adminUser?.name || "Admin";
                                    recs[idx].reviewedAt = new Date().toISOString();
                                    recs[idx].reviewNote = reviewNote;
                                    localStorage.setItem(
                                      "wp_payment_receipts",
                                      JSON.stringify(recs)
                                    );
                                    setPaymentReceipts([...recs]);
                                    setPreviewReceipt(null);
                                    setReviewNote("");
                                    showToast(
                                      `Receipt ${previewReceipt.id} rejected`,
                                      "error"
                                    );
                                  }
                                }}
                                className="btn btn-lg"
                                style={{
                                  flex: 1,
                                  background: "rgba(239,68,68,0.1)",
                                  color: "var(--color-news-red)",
                                  border: "1px solid rgba(239,68,68,0.2)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 8,
                                }}
                              >
                                <XCircle size={18} /> Reject
                              </button>
                            </div>
                          </div>
                        )}

                        {previewReceipt.status !== "pending" && (
                          <div
                            style={{
                              background:
                                previewReceipt.status === "approved"
                                  ? "rgba(39,174,96,0.08)"
                                  : "rgba(239,68,68,0.08)",
                              borderRadius: "12px",
                              padding: "16px",
                              border: `1px solid ${
                                previewReceipt.status === "approved"
                                  ? "rgba(39,174,96,0.15)"
                                  : "rgba(239,68,68,0.15)"
                              }`,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 8,
                                fontWeight: 700,
                                fontSize: "var(--text-sm)",
                                color:
                                  previewReceipt.status === "approved"
                                    ? "var(--color-sport-green)"
                                    : "var(--color-news-red)",
                              }}
                            >
                              {previewReceipt.status === "approved" ? (
                                <CheckCircle size={18} />
                              ) : (
                                <XCircle size={18} />
                              )}
                              {previewReceipt.status === "approved"
                                ? "Approved"
                                : "Rejected"}
                            </div>
                            <p
                              style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-text-secondary)",
                                margin: 0,
                              }}
                            >
                              Reviewed by {previewReceipt.reviewedBy} on{" "}
                              {formatDate(previewReceipt.reviewedAt)}
                              {previewReceipt.reviewNote &&
                                ` — "${previewReceipt.reviewNote}"`}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
  );
}



