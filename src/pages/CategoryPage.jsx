import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import ArticleCard from '../components/articles/ArticleCard';
import { articles, getArticlesByCategory, getCategoryInfo, categories } from '../data/articles';

export default function CategoryPage() {
  const { slug } = useParams();
  const catInfo = getCategoryInfo(slug);
  const categoryArticles = getArticlesByCategory(slug);
  const allArticles = categoryArticles.length > 0 ? categoryArticles : articles;

  const trending = articles.slice(0, 5);
  const tags = ['Business', 'Politics', 'Diamond', 'Economy', 'Sport', 'Football', 'Culture', 'Gaborone', 'Parliament', 'Mining'];

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>{catInfo?.name || slug}</span>
          </div>
          <h1>{catInfo?.name || slug}</h1>
          <p>Latest stories and updates from our {catInfo?.name?.toLowerCase() || slug} desk.</p>
        </div>
      </div>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div className="grid-main-sidebar">
            {/* Main Content */}
            <div>
              <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
                {allArticles.slice(0, 2).map(article => (
                  <ArticleCard key={article.id} article={article} large />
                ))}
              </div>
              <div className="grid-3">
                {allArticles.slice(2, 8).map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button className="pagination-btn" aria-label="Previous">‹</button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn">2</button>
                <button className="pagination-btn">3</button>
                <button className="pagination-btn" aria-label="Next">›</button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="sidebar">
              {/* Search */}
              <div className="sidebar-widget">
                <h4 className="sidebar-widget-title">Search</h4>
                <div className="search-input-wrapper" style={{ margin: 0 }}>
                  <input type="text" placeholder="Search articles..." className="form-input" style={{ paddingLeft: '16px', borderRadius: 'var(--radius-md)' }} />
                </div>
              </div>

              {/* Trending */}
              <div className="sidebar-widget">
                <h4 className="sidebar-widget-title">Trending Now</h4>
                {trending.map((article, i) => (
                  <div key={article.id} className="trending-item">
                    <span className="trending-number">0{i + 1}</span>
                    <div>
                      <div className="trending-title">
                        <Link to={`/article/${article.id}`}>{article.title}</Link>
                      </div>
                      <div className="trending-meta">{article.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Newsletter */}
              <div className="sidebar-widget" style={{ background: 'var(--color-dark)', borderColor: 'var(--color-dark)' }}>
                <h4 className="sidebar-widget-title" style={{ color: 'var(--color-white)', borderBottomColor: 'var(--color-primary)' }}>
                  Newsletter
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)' }}>
                  Get daily updates delivered to your inbox.
                </p>
                <form onSubmit={e => e.preventDefault()}>
                  <input type="email" placeholder="Your email" className="form-input" style={{ marginBottom: 'var(--space-md)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
                  <button type="submit" className="btn btn-primary btn-block btn-sm">
                    <Mail size={14} /> Subscribe
                  </button>
                </form>
              </div>

              {/* Tags */}
              <div className="sidebar-widget">
                <h4 className="sidebar-widget-title">Popular Tags</h4>
                <div className="tags-list">
                  {tags.map(tag => (
                    <Link key={tag} to={`/search?q=${tag}`} className="tag-pill">{tag}</Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="sidebar-widget">
                <h4 className="sidebar-widget-title">Categories</h4>
                <div className="footer-links">
                  {categories.filter(c => c.slug !== 'epaper').map(cat => (
                    <Link key={cat.slug} to={`/category/${cat.slug}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{cat.name}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {getArticlesByCategory(cat.slug).length}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
