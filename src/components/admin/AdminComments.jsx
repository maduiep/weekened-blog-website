import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, Reply, CheckCircle, Search, ExternalLink } from "lucide-react";

export default function AdminComments({ adminUser, showToast }) {
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const loadComments = () => {
    const stored = localStorage.getItem("wp_article_comments");
    if (stored) {
      setComments(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadComments();
    window.addEventListener("storage", loadComments);
    return () => window.removeEventListener("storage", loadComments);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    const newComments = comments.filter((c) => c.id !== id);
    localStorage.setItem("wp_article_comments", JSON.stringify(newComments));
    setComments(newComments);
    showToast("Comment deleted successfully");
    window.dispatchEvent(new Event("storage"));
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    const newComments = comments.map((c) => {
      if (c.id === replyingTo.id) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              user: "Admin",
              text: replyText,
              date: new Date().toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
              })
            }
          ]
        };
      }
      return c;
    });

    localStorage.setItem("wp_article_comments", JSON.stringify(newComments));
    setComments(newComments);
    setReplyingTo(null);
    setReplyText("");
    showToast("Reply posted successfully");
    window.dispatchEvent(new Event("storage"));
  };

  const filteredComments = comments.filter((c) => 
    c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.articleTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      key="comments"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "var(--text-2xl)",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <MessageSquare size={28} color="var(--color-primary)" />
            Article Comments
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Monitor and moderate reader discussions across the platform
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#f1f5f9",
              padding: "8px 16px",
              borderRadius: "8px",
            }}
          >
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "13px",
              }}
            />
          </div>
          <div
            style={{
              padding: "8px 16px",
              background: "rgba(37, 99, 235, 0.1)",
              color: "var(--color-primary)",
              borderRadius: "8px",
              fontWeight: 700,
            }}
          >
            Total: {comments.length}
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw", paddingBottom: "16px" }}><table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Article</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.map((c) => (
              <tr key={c.id} className="admin-table-row">
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "var(--color-primary)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {c.user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.user}</div>
                      <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>{c.userId}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <a 
                    href={`/article/${c.articleId}`} 
                    target="_blank"
                    style={{ color: "var(--color-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontSize: "13px" }}
                  >
                    {c.articleTitle.substring(0, 40)}{c.articleTitle.length > 40 ? "..." : ""}
                    <ExternalLink size={12} />
                  </a>
                </td>
                <td>
                  <div style={{ maxWidth: 300 }}>
                    <div style={{ fontSize: "13px", lineHeight: 1.4, marginBottom: c.replies?.length > 0 ? 8 : 0 }}>
                      {c.text}
                    </div>
                    {c.replies?.length > 0 && (
                      <div style={{ paddingLeft: 8, borderLeft: "2px solid var(--color-border)", fontSize: "12px", color: "var(--color-text-muted)" }}>
                        <strong style={{ color: "var(--color-primary)" }}>Admin:</strong> {c.replies[c.replies.length - 1].text}
                        {c.replies.length > 1 && <span style={{ marginLeft: 4 }}>(+{c.replies.length - 1} more)</span>}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                  {c.date}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="admin-action-btn"
                      onClick={() => setReplyingTo(c)}
                      title="Reply"
                    >
                      <Reply size={16} />
                    </button>
                    <button
                      className="admin-action-btn admin-action-revoke"
                      onClick={() => handleDelete(c.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredComments.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
                  No comments found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      </div>

      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              padding: "24px",
            }}
            onClick={() => setReplyingTo(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                width: "min(500px, 100%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Reply size={20} color="var(--color-primary)" /> Reply to {replyingTo.user}
              </h3>
              
              <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", borderLeft: "3px solid var(--color-border)" }}>
                "{replyingTo.text}"
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply as Admin..."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  marginBottom: "16px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  className="btn"
                  style={{ background: "#f1f5f9", color: "var(--color-text)" }}
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                >
                  Post Reply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


