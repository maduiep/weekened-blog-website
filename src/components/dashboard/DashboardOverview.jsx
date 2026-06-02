import { Link } from "react-router-dom";
import { Clock, Database } from "lucide-react";

export default function DashboardOverview({ user, authUser, setActiveTab }) {
  return (
    <>
                <h1 className="dashboard-heading">
                  Welcome back, {user.name.split(" ")[0]}
                </h1>

                <div className="dashboard-stats">
                  <div
                    className="dashboard-stat-card"
                    style={{ borderLeft: "4px solid var(--color-gold)" }}
                  >
                    <div className="dashboard-stat-label">
                      Subscription Status
                    </div>
                    <div
                      className="dashboard-stat-value"
                      style={{
                        color: authUser?.isSubscribed
                          ? "#2ecc71"
                          : "var(--color-text-muted)",
                      }}
                    >
                      <span
                        className="dashboard-dot"
                        style={{
                          background: authUser?.isSubscribed
                            ? "#2ecc71"
                            : "var(--color-border)",
                        }}
                      />
                      {user.subscription.status}
                    </div>
                    <div className="dashboard-stat-meta">
                      {authUser?.isSubscribed
                        ? `Renews ${user.subscription.nextBilling}`
                        : "Subscribe to unlock full access"}
                    </div>
                  </div>

                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-label">
                      Purchased E-Papers
                    </div>
                    <div className="dashboard-stat-value">
                      {user.ebooks.length} Issues
                    </div>
                    <Link to="/epaper" className="dashboard-stat-link">
                      Browse archive â†’
                    </Link>
                  </div>

                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-label">Saved Articles</div>
                    <div className="dashboard-stat-value">
                      {user.savedArticles.length} Articles
                    </div>
                    <div className="dashboard-stat-meta">Read later queue</div>
                  </div>

                  <div
                    className="dashboard-stat-card"
                    style={{ borderLeft: "4px solid var(--color-primary)" }}
                  >
                    <div className="dashboard-stat-label">
                      Purchased Stories
                    </div>
                    <div className="dashboard-stat-value">
                      {(authUser?.purchasedStories || []).length} Stories
                    </div>
                    <div className="dashboard-stat-meta">
                      {(authUser?.purchasedStories || []).length > 0
                        ? "Pay-per-story purchases"
                        : "No stories purchased yet"}
                    </div>
                  </div>
                </div>

                {/* Recent Saved Articles */}
                <div className="dashboard-card">
                  <h3 className="dashboard-card-title">
                    Recent Saved Articles
                  </h3>
                  <div className="dashboard-article-list">
                    {user.savedArticles.map((article) => (
                      <div key={article.id} className="dashboard-article-row">
                        <img
                          src={article.image}
                          alt=""
                          className="dashboard-article-thumb"
                        />
                        <div className="dashboard-article-info">
                          <Link
                            to={`/article/${article.id}`}
                            className="dashboard-article-title"
                          >
                            {article.title}
                          </Link>
                          <div className="dashboard-article-meta">
                            <Clock size={12} /> Saved recently
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("library")}
                    className="btn btn-ghost btn-block"
                    style={{ marginTop: "var(--space-md)" }}
                  >
                    View All Saved Content
                  </button>
                </div>

                {/* API & System Integration - NEW SECTION */}
                <div
                  className="dashboard-card"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                    borderLeft: "4px solid var(--color-primary)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "var(--space-lg)",
                    }}
                  >
                    <h3 className="dashboard-card-title" style={{ margin: 0 }}>
                      <Database
                        size={20}
                        style={{ color: "var(--color-primary)", flexShrink: 0 }}
                      />
                      API Connectivity & Platform Health
                    </h3>
                    <span
                      className="badge badge-news"
                      style={{
                        fontSize: "9px",
                        background: "#2ecc71",
                        animation: "pulse 2s infinite",
                      }}
                    >
                      Live Connection
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "var(--space-md)",
                    }}
                  >
                    <div
                      style={{
                        padding: "var(--space-md)",
                        background: "white",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        BSE Data Feed
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#2ecc71",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#2ecc71",
                            borderRadius: "50%",
                          }}
                        />{" "}
                        Connected
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "var(--space-md)",
                        background: "white",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Payment Gateway
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#2ecc71",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#2ecc71",
                            borderRadius: "50%",
                          }}
                        />{" "}
                        Active
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "var(--space-md)",
                        background: "white",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Archive API
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#2ecc71",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#2ecc71",
                            borderRadius: "50%",
                          }}
                        />{" "}
                        v2.4 Online
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscribe CTA if not subscribed */}
                {!authUser?.isSubscribed && (
                  <div className="dashboard-cta-card">
                    <h3>Unlock Full Access</h3>
                    <p>
                      Subscribe to read unlimited articles, download E-Papers,
                      and get exclusive content.
                    </p>
                    <Link to="/subscribe" className="btn btn-primary btn-lg">
                      View Plans & Subscribe
                    </Link>
                  </div>
                )}
    </>
  );
}
