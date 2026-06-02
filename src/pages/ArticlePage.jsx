import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from 'react-markdown';
import {
  Clock,
  User,
  Share2,
  BookOpen,
  Lock,
  Download,
  ArrowRight,
  Play,
  AlertCircle,
  ThumbsUp,
  MessageCircle,
  ShieldCheck,
  Bookmark,
  TrendingUp,
  Calendar,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "../components/ui/SocialIcons";
import ArticleCard from "../components/articles/ArticleCard";
import PaymentModal from "../components/payment/PaymentModal";
import AdPlacement from "../components/ui/AdPlacement";
import AdPopup from "../components/ui/AdPopup";
import { getArticleById, articles, getCategoryInfo } from "../data/articles";
import { useAuth } from "../context/AuthContext";

function CommentSection({ isSubscribed, isLoggedIn, user, articleId }) {
  const canComment =
    isSubscribed || (user?.purchasedStories || []).includes(Number(articleId));
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Mpho Molefe",
      text: "This is a very insightful analysis of the mining sector. We need more of this.",
      date: "2 hours ago",
      likes: 5,
    },
    {
      id: 2,
      user: "Kabelo J.",
      text: "Interesting point about the supply constraints. I wonder how it affects local SMEs.",
      date: "5 hours ago",
      likes: 2,
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const handlePost = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      user: user?.name || "Anonymous",
      text: newComment,
      date: "Just now",
      likes: 0,
    };
    setComments([comment, ...comments]);
    setNewComment("");
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
                fontSize: "12px",
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
                <span style={{ fontWeight: 700, fontSize: "13px" }}>
                  {c.user}
                </span>
                <span
                  style={{ fontSize: "11px", color: "var(--color-text-muted)" }}
                >
                  {c.date}
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text)",
                  lineHeight: 1.5,
                  marginBottom: 8,
                }}
              >
                {c.text}
              </p>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "none",
                  border: "none",
                  color: "var(--color-text-muted)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                <ThumbsUp size={12} /> {c.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const { id } = useParams();
  const article = getArticleById(id);
  const [progress, setProgress] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100) + 50);
  const [isLiked, setIsLiked] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showFloatingVideo, setShowFloatingVideo] = useState(false);
  const {
    isLoggedIn,
    isSubscribed,
    isAdmin,
    user: authUser,
    hasArticleAccess,
  } = useAuth();
  const navigate = useNavigate();

  const storyPassPlan = {
    id: `story:${article?.id}`,
    name: "One-Story Pass",
    price: article?.price || 15,
    currency: "P",
    period: "/story",
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (article) {
      // Track total article views
      const totalViews = parseInt(localStorage.getItem('wp_total_article_views') || '0');
      localStorage.setItem('wp_total_article_views', (totalViews + 1).toString());
      // Track per-article views
      const articleViews = JSON.parse(localStorage.getItem('wp_article_views') || '{}');
      articleViews[article.id] = (articleViews[article.id] || 0) + 1;
      localStorage.setItem('wp_article_views', JSON.stringify(articleViews));
    }

    // Freemium View Tracking
    if (!isSubscribed && !isAdmin) {
      const views = JSON.parse(localStorage.getItem("wp_guest_views") || "{}");
      const today = new Date().toISOString().split("T")[0];
      const monthKey = today.substring(0, 7); // YYYY-MM

      if (!views[monthKey]) views[monthKey] = [];
      if (!views[monthKey].includes(id)) {
        views[monthKey].push(id);
        localStorage.setItem("wp_guest_views", JSON.stringify(views));
      }
      setViewCount(views[monthKey].length);
    }
  }, [id, isSubscribed, isAdmin, article]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isSubscribed || isAdmin) return;
    const adTimer = window.setTimeout(() => setShowAdPopup(true), 12000);
    return () => window.clearTimeout(adTimer);
  }, [isSubscribed, isAdmin]);

  useEffect(() => {
    if (!article?.videoUrl) return;

    const handleFloatingVideo = () => {
      setShowFloatingVideo(window.scrollY > 450);
    };

    window.addEventListener("scroll", handleFloatingVideo, { passive: true });
    handleFloatingVideo();
    return () => window.removeEventListener("scroll", handleFloatingVideo);
  }, [article?.videoUrl]);

  if (!article) {
    return (
      <div
        className="section"
        style={{ textAlign: "center", padding: "6rem 0" }}
      >
        <div className="container">
          <h2>Article not found</h2>
          <p
            style={{ color: "var(--color-text-secondary)", marginTop: "1rem" }}
          >
            The article you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="btn btn-primary"
            style={{ marginTop: "2rem" }}
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const catInfo = getCategoryInfo(article.category);
  const related = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);
  const isMarkdown = typeof article.content === 'string';
  const allContent = isMarkdown ? article.content : (article.content || []);

  const FREE_LIMIT = 3;
  const isOverLimit =
    !hasArticleAccess(article.id) && !isAdmin && viewCount > FREE_LIMIT;
  const hasFullAccess = isAdmin || hasArticleAccess(article.id);
  const isPremiumGate = article.isPremium && !hasArticleAccess(article.id);
  
  let visibleContent;
  if (isMarkdown) {
    visibleContent = (hasFullAccess || !article.isPremium) ? allContent : allContent.substring(0, 300) + '...';
  } else {
    visibleContent = (hasFullAccess || !article.isPremium) ? allContent : allContent.slice(0, 1);
  }
  const isBlurred = isPremiumGate || isOverLimit;

  return (
    <>
      <Helmet>
        <title>{article.title} | Weekend Post</title>
        <meta name="description" content={article.summary || article.title} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary || article.title} />
        {article.image && <meta property="og:image" content={article.image} />}
      </Helmet>

      {/* Premium Reading Progress Bar */}
      <div
        className="reading-progress"
        style={{
          width: `${progress}%`,
          height: "4px",
          background: "var(--color-primary)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 2000,
          transition: "width 0.1s linear",
          boxShadow: "0 0 10px var(--color-primary)",
        }}
      />

      <article className="article-page" style={{ background: "white" }}>
        <div className="container">
          {/* Article Header */}
          <header
            className="article-header"
            style={{ maxWidth: "800px", margin: "0 auto var(--space-2xl)" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-md)",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                {catInfo && (
                  <Link
                    to={`/category/${article.category}`}
                    className={`badge ${catInfo.badge}`}
                  >
                    {catInfo.name}
                  </Link>
                )}
                {article.isSponsored && (
                  <span
                    className="badge"
                    style={{
                      background: "var(--color-bg-alt)",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    Sponsored
                  </span>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--color-sport-green)",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                <ShieldCheck size={14} /> VERIFIED CONTENT
              </div>
            </div>

            <h1
              className="article-page-title"
              style={{
                fontSize: "var(--text-4xl)",
                lineHeight: 1.2,
                fontWeight: 800,
                marginBottom: "var(--space-lg)",
              }}
            >
              {article.title}
            </h1>

            <div
              className="article-meta-bar"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                borderBottom: "1px solid var(--color-border)",
                paddingBottom: "var(--space-lg)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  className="author-avatar"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "var(--color-bg-alt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-primary)",
                    fontWeight: 700,
                  }}
                >
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>
                    {article.author}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Staff Reporter
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: 24,
                  width: 1,
                  background: "var(--color-border)",
                }}
              />
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                  display: "flex",
                  gap: 12,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={14} /> {article.date}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={14} /> {article.readTime}
                </span>
              </div>
            </div>
          </header>

          {/* Hero Media */}
          <div
            className="article-hero-media"
            style={{
              maxWidth: "1000px",
              margin: "0 auto var(--space-3xl)",
              borderRadius: "var(--radius-2xl)",
              overflow: "hidden",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            {article.videoUrl ? (
              <div
                className="video-wrapper"
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "#000",
                }}
              >
                <video
                  controls
                  poster={article.image}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                >
                  <source src={article.videoUrl} type="video/mp4" />
                </video>
                {article.videoDuration && (
                  <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                    {article.videoDuration}
                  </span>
                )}
              </div>
            ) : (
              <img
                src={article.image}
                alt={article.title}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
          </div>

          {showFloatingVideo && article.videoUrl && (
            <div
              className="floating-video-teaser"
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 1500,
                width: "320px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                background: "white",
                border: "1px solid var(--color-border)",
              }}
            >
              <button 
                onClick={() => setShowFloatingVideo(false)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10
                }}
              >
                <X size={14} />
              </button>
              <video
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              >
                <source src={article.videoUrl} type="video/mp4" />
              </video>
              <div
                style={{
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Play size={16} color="var(--color-primary)" />
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    Related Video
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Keep watching while you read.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: "var(--space-3xl)",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
            className="article-layout"
          >
            {/* Article Content Column */}
            <div className="article-content-column">
              <div
                className="article-body"
                style={{
                  fontSize: "var(--text-lg)",
                  lineHeight: 1.8,
                  color: "#334155",
                }}
              >
                {!isOverLimit ? (
                  <div style={{ position: "relative" }}>
                    {isMarkdown ? (
                      <div className="article-content markdown-preview" style={{ fontSize: '18px', lineHeight: 1.8 }}>
                        <ReactMarkdown>{visibleContent}</ReactMarkdown>
                      </div>
                    ) : (
                      visibleContent.map((paragraph, i) => (
                        <p key={i} style={{ marginBottom: "1.5rem" }}>
                          {paragraph}
                        </p>
                      ))
                    )}
                    {isLoggedIn && (
                      <div
                        className="digital-watermark"
                        style={{
                          position: "absolute",
                          top: "10%",
                          left: "5%",
                          opacity: 0.05,
                          fontSize: "12px",
                          pointerEvents: "none",
                          userSelect: "none",
                          transform: "rotate(-45deg)",
                          whiteSpace: "nowrap",
                          color: "var(--color-dark)",
                          zIndex: 5,
                        }}
                      >
                        Licensed to: {authUser?.uid} | {authUser?.email} | DO
                        NOT REDISTRIBUTE
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="limit-reached"
                    style={{
                      padding: "var(--space-2xl)",
                      background: "var(--color-bg-alt)",
                      borderRadius: "var(--radius-xl)",
                      textAlign: "center",
                      border: "1px solid var(--color-border)",
                      marginBottom: "var(--space-xl)",
                    }}
                  >
                    <AlertCircle
                      size={48}
                      style={{
                        color: "var(--color-primary)",
                        marginBottom: "var(--space-md)",
                      }}
                    />
                    <h3 style={{ fontSize: "var(--text-xl)" }}>
                      Access Limited
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)" }}>
                      You've reached your free monthly limit. Join our premium
                      community to continue reading.
                    </p>
                  </div>
                )}

                <AdPlacement type="banner" />

                <AnimatePresence>
                  {isBlurred && (
                    <motion.div
                      className="paywall-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        position: "relative",
                        marginTop: "-100px",
                        zIndex: 10,
                      }}
                    >
                      <div
                        style={{
                          height: "200px",
                          background: "linear-gradient(transparent, white)",
                        }}
                      />
                      <div
                        style={{
                          background: "white",
                          padding: "var(--space-3xl)",
                          borderRadius: "var(--radius-2xl)",
                          border: "1px solid var(--color-border)",
                          boxShadow: "0 -20px 50px rgba(0,0,0,0.1)",
                          textAlign: "center",
                        }}
                      >
                        <Lock
                          size={32}
                          color="var(--color-primary)"
                          style={{ marginBottom: 16 }}
                        />
                        <h3
                          style={{
                            fontSize: "var(--text-2xl)",
                            marginBottom: 12,
                          }}
                        >
                          Unlock the Full Story
                        </h3>
                        <p
                          style={{
                            color: "var(--color-text-secondary)",
                            marginBottom: 24,
                            maxWidth: "400px",
                            margin: "0 auto 24px",
                          }}
                        >
                          This article is exclusive to Weekend Post subscribers.
                          Join 10,000+ readers getting Botswana's best
                          reporting.
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            className="btn btn-secondary btn-lg"
                            style={{
                              background: "var(--color-primary)",
                              color: "white",
                              border: "none",
                            }}
                            onClick={() => {
                              if (!isLoggedIn) {
                                navigate(`/user-auth?tab=signup&redirect=${encodeURIComponent(`/article/${id}`)}`);
                                return;
                              }
                              setSelectedPlan(storyPassPlan);
                              setShowPayment(true);
                            }}
                          >
                            Buy Single Story — P{article?.price || 15}
                          </button>
                          <Link
                            to="/subscribe"
                            className="btn btn-ghost btn-lg"
                          >
                            View Corporate Plans
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interaction Bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--color-border)",
                    borderBottom: "1px solid var(--color-border)",
                    padding: "var(--space-lg) 0",
                    marginTop: "var(--space-3xl)",
                    marginBottom: "var(--space-3xl)",
                  }}
                >
                  <div style={{ display: "flex", gap: "20px" }}>
                    <button
                      onClick={() => {
                        setIsLiked(!isLiked);
                        setLikes((l) => (isLiked ? l - 1 : l + 1));
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: isLiked
                          ? "var(--color-news-red)"
                          : "var(--color-text-muted)",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      <ThumbsUp
                        size={18}
                        fill={isLiked ? "currentColor" : "none"}
                      />{" "}
                      {likes}
                    </button>
                    <button
                      onClick={() =>
                        document
                          .getElementById("comments-section")
                          .scrollIntoView({ behavior: "smooth" })
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--color-text-muted)",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      <MessageCircle size={18} /> 12 Comments
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button className="share-btn-pill">
                      <Share2 size={16} /> Share
                    </button>
                    <button className="share-btn-pill">
                      <Bookmark size={16} /> Save
                    </button>
                  </div>
                </div>
                <div id="comments-section">
                </div>

                {/* Related Videos */}
                {articles.filter(a => a.videoUrl && a.id !== article.id).length > 0 && (
                  <div style={{ marginTop: 'var(--space-2xl)', padding: 'var(--space-xl)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-xl)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-lg)' }}>📺 More Video Stories</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                      {articles.filter(a => a.videoUrl && a.id !== article.id).slice(0, 4).map(a => (
                        <a key={a.id} href={`/article/${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={a.image} alt={a.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</div>
                            </div>
                            {a.videoDuration && <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>{a.videoDuration}</span>}
                          </div>
                          <p style={{ fontSize: '12px', fontWeight: 600, marginTop: '6px', lineHeight: 1.3 }}>{a.title}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <CommentSection
                  isLoggedIn={isLoggedIn}
                  isSubscribed={isSubscribed}
                  user={authUser}
                  articleId={id}
                />
              </div>
            </div>

            {/* Sidebar Column */}
            <aside className="article-sidebar">
              <AdPlacement type="sidebar" />

              <div
                style={{
                  background: "var(--color-bg-alt)",
                  padding: "var(--space-xl)",
                  borderRadius: "var(--radius-xl)",
                  marginTop: "var(--space-xl)",
                }}
              >
                <h4
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <TrendingUp size={18} color="var(--color-primary)" /> Related
                  Topics
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Economy", "Finance", "Gaborone", "Mining"].map((t) => (
                    <span
                      key={t}
                      style={{
                        padding: "4px 12px",
                        background: "white",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 700,
                        border: "1px solid var(--color-border)",
                        cursor: "pointer",
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Footer Related */}
      <section
        className="section"
        style={{
          background: "var(--color-bg-alt)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent" /> Recommended for You
            </h2>
          </div>
          <div className="grid-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          redirect={`/article/${id}`}
          onClose={() => {
            setShowPayment(false);
            setSelectedPlan(null);
          }}
        />
      )}

      <AdPopup open={showAdPopup} onClose={() => setShowAdPopup(false)} />

      <style>{`
        .share-btn-pill { background: white; border: 1px solid var(--color-border); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; alignItems: center; gap: 8px; transition: all 0.2s; }
        .share-btn-pill:hover { background: var(--color-bg-alt); border-color: var(--color-primary); color: var(--color-primary); }
        @media (max-width: 900px) { .article-layout { grid-template-columns: 1fr !important; } .article-sidebar { display: none !important; } }
      `}</style>
    </>
  );
}
