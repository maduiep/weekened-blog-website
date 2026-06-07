import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Lock, ThumbsUp, ShieldCheck } from "lucide-react";

export default function CommentSection({ isSubscribed, isLoggedIn, user, articleId, articleTitle }) {
  const canComment =
    isSubscribed || (user?.purchasedStories || []).includes(Number(articleId));
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState(new Set());

  useEffect(() => {
    const loadComments = () => {
      const stored = localStorage.getItem("wp_article_comments");
      if (stored) {
        const allComments = JSON.parse(stored);
        setComments(allComments.filter(c => c.articleId == articleId));
      } else {
        const mockComments = [
          {
            id: 1,
            articleId: 1,
            articleTitle: "Oil price dip masks supply issues",
            user: "Mpho Molefe",
            userId: "usr_mock1",
            text: "This is a very insightful analysis of the mining sector. We need more of this.",
            date: "2 hours ago",
            likes: 5,
            replies: []
          },
          {
            id: 2,
            articleId: 1,
            articleTitle: "Oil price dip masks supply issues",
            user: "Kabelo J.",
            userId: "usr_mock2",
            text: "Interesting point about the supply constraints. I wonder how it affects local SMEs.",
            date: "5 hours ago",
            likes: 2,
            replies: []
          }
        ];
        localStorage.setItem("wp_article_comments", JSON.stringify(mockComments));
        setComments(mockComments.filter(c => c.articleId == articleId));
      }
    };
    loadComments();
    window.addEventListener("storage", loadComments);
    return () => window.removeEventListener("storage", loadComments);
  }, [articleId]);

  const handlePost = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      articleId: Number(articleId),
      articleTitle: articleTitle || "Article",
      user: user?.name || "Anonymous",
      userId: user?.uid || "usr_anon",
      text: newComment,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
      }),
      likes: 0,
      replies: []
    };
    
    const stored = localStorage.getItem("wp_article_comments");
    const allComments = stored ? JSON.parse(stored) : [];
    const newAllComments = [comment, ...allComments];
    localStorage.setItem("wp_article_comments", JSON.stringify(newAllComments));
    
    setComments([comment, ...comments]);
    setNewComment("");
    
    window.dispatchEvent(new Event("storage"));
  };

  const handleLike = (commentId) => {
    let updatedLikes = new Set(likedComments);
    const isLiked = updatedLikes.has(commentId);
    
    if (isLiked) {
      updatedLikes.delete(commentId);
    } else {
      updatedLikes.add(commentId);
    }
    setLikedComments(updatedLikes);

    const stored = localStorage.getItem("wp_article_comments");
    if (stored) {
      const allComments = JSON.parse(stored);
      const updatedAllComments = allComments.map(c => {
        if (c.id === commentId) {
          return { ...c, likes: isLiked ? c.likes - 1 : c.likes + 1 };
        }
        return c;
      });
      localStorage.setItem("wp_article_comments", JSON.stringify(updatedAllComments));
      setComments(updatedAllComments.filter(c => c.articleId == articleId));
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div
      className="comment-section"
      style={{
        marginTop: "var(--space-3xl)",
        padding: "var(--space-xl)",
        background: "var(--color-bg-alt)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h3
        style={{
          fontSize: "var(--text-xl)",
          marginBottom: "var(--space-lg)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <MessageCircle size={20} color="var(--color-primary)" /> Join the
        Conversation
      </h3>

      {!canComment ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-xl)",
            background: "white",
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--color-primary)",
            marginBottom: "var(--space-xl)",
          }}
        >
          <Lock
            size={24}
            color="var(--color-primary)"
            style={{ marginBottom: 12 }}
          />
          <h4 style={{ marginBottom: 8 }}>Subscriber Exclusive</h4>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
              marginBottom: 16,
            }}
          >
            Only subscribers can post comments. Join our community to share your
            thoughts.
          </p>
          <Link to="/subscribe" className="btn btn-primary btn-sm">
            Subscribe to Comment
          </Link>
        </div>
      ) : (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              marginBottom: "12px",
              resize: "vertical",
              fontSize: "var(--text-sm)",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className="btn btn-primary"
              onClick={handlePost}
              disabled={!newComment.trim()}
            >
              Post Comment
            </button>
          </div>
        </div>
      )}

      <div
        className="comments-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-lg)",
        }}
      >
        {comments.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 12 }}>
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
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {c.user.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}>
                  {c.user}
                </span>
                <span
                  style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}
                >
                  {c.date}
                </span>
              </div>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text)",
                  lineHeight: 1.5,
                  marginBottom: 8,
                }}
              >
                {c.text}
              </p>
              <button
                onClick={() => handleLike(c.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "none",
                  border: "none",
                  color: likedComments.has(c.id) ? "var(--color-primary)" : "var(--color-text-muted)",
                  fontSize: "var(--text-xs)",
                  cursor: "pointer",
                }}
              >
                <ThumbsUp size={12} fill={likedComments.has(c.id) ? "var(--color-primary)" : "none"} /> {c.likes}
              </button>
              
              {c.replies && c.replies.length > 0 && (
                <div style={{ marginTop: 12, paddingLeft: 12, borderLeft: "2px solid var(--color-border)" }}>
                  {c.replies.map((r, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: 4 }}>
                          <ShieldCheck size={12} /> {r.user}
                        </span>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{r.date}</span>
                      </div>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text)", margin: 0 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
