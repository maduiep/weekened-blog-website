import { Link } from "react-router-dom";
import { BookOpen, Star, Clock, Download } from "lucide-react";

export default function DashboardLibrary({ user, downloading, handleDownload }) {
  return (
    <>
      <h2 className="dashboard-heading">My Library</h2>

                <div className="dashboard-card">
                  <h3 className="dashboard-card-title">
                    <BookOpen
                      size={20}
                      style={{ color: "var(--color-primary)", flexShrink: 0 }}
                    />
                    E-Papers Collection
                  </h3>
                  <div className="dashboard-ebooks-grid">
                    {user.ebooks.map((ebook, i) => (
                      <div key={i} className="dashboard-ebook-card">
                        <div className="dashboard-ebook-cover">
                          <BookOpen size={40} style={{ opacity: 0.2 }} />
                        </div>
                        <h4 className="dashboard-ebook-title">{ebook.title}</h4>
                        <div className="dashboard-ebook-date">
                          Purchased: {ebook.date}
                        </div>
                        <button
                          onClick={() => handleDownload(ebook)}
                          disabled={downloading === ebook.id}
                          className="btn btn-ghost btn-sm btn-block"
                          style={{
                            border: "1px solid currentColor",
                            marginTop: "var(--space-sm)",
                          }}
                        >
                          {downloading === ebook.id ? (
                            "Preparing..."
                          ) : (
                            <>
                              <Download size={14} /> Download PDF
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3 className="dashboard-card-title">
                    <Star
                      size={20}
                      style={{ color: "var(--color-gold)", flexShrink: 0 }}
                    />
                    Saved Articles
                  </h3>
                  <div className="dashboard-article-list">
                    {user.savedArticles.map((article) => (
                      <div key={article.id} className="dashboard-article-row">
                        <img
                          src={article.image}
                          alt=""
                          className="dashboard-article-thumb dashboard-article-thumb-lg"
                        />
                        <div className="dashboard-article-info">
                          <Link
                            to={`/category/${article.category}`}
                            className="dashboard-article-cat"
                          >
                            {article.category}
                          </Link>
                          <Link
                            to={`/article/${article.id}`}
                            className="dashboard-article-title"
                          >
                            {article.title}
                          </Link>
                          <div className="dashboard-article-meta">
                            <Clock size={12} /> {article.readTime} • Saved
                            recently
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
    </>
  );
}