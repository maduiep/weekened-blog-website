import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Mail, TrendingUp, ShieldCheck } from 'lucide-react';
import ArticleCard from '../components/articles/ArticleCard';
import AdPlacement from '../components/ui/AdPlacement';
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
      <div className="page-header" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, background: 'var(--color-primary)', pointerEvents: 'none' }} />
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>{catInfo?.name || slug}</span>
          </div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {catInfo?.name || slug}
            {slug === 'business' && <TrendingUp size={24} color="var(--color-primary)" />}
          </h1>
          <p>Premium {catInfo?.name?.toLowerCase() || slug} coverage and commercial insights for Botswana.</p>
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
              
              <AdPlacement type="banner" label="Partner Content" />

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
              {/* Commercial Search */}
              <div className="sidebar-widget">
                <h4 className="sidebar-widget-title">Search Insights</h4>
                <div className="search-input-wrapper" style={{ margin: 0 }}>
                  <input type="text" placeholder="Keywords, industries..." className="form-input" style={{ paddingLeft: '16px', borderRadius: 'var(--radius-md)' }} />
                </div>
              </div>

              {/* Secure Subscription Prompt */}
              <div className="sidebar-widget" style={{ background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center' }}>
                <ShieldCheck size={32} style={{ margin: '0 auto var(--space-md)', color: 'var(--color-gold)' }} />
                <h4 style={{ color: 'white', border: 'none', padding: 0, marginBottom: 'var(--space-sm)' }}>Support Quality Journalism</h4>
                <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: 'var(--space-lg)' }}>Get unlimited access to premium business analysis and E-Paper editions.</p>
                <Link to="/subscribe" className="btn btn-gold btn-block btn-sm">Join Now</Link>
              </div>

              <AdPlacement type="sidebar" />

              {/* Trending */}
              <div className="sidebar-widget">
                <h4 className="sidebar-widget-title">Trending in Botswana</h4>
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

              {/* Tags */}
              <div className="sidebar-widget">
                <h4 className="sidebar-widget-title">Market Tags</h4>
                <div className="tags-list">
                  {tags.map(tag => (
                    <Link key={tag} to={`/search?q=${tag}`} className="tag-pill">{tag}</Link>
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
