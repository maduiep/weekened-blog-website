import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Mail } from 'lucide-react';
import ArticleCard from '../components/articles/ArticleCard';
import { articles, categories, getArticlesByCategory, ePapers } from '../data/articles';

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const featured = articles.filter(a => a.featured);
  const heroArticles = featured.length > 0 ? featured : articles.slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroArticles.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroArticles.length]);

  const newsArticles = getArticlesByCategory('news');
  const businessArticles = getArticlesByCategory('business');
  const sportArticles = getArticlesByCategory('sport');
  const opinionArticles = getArticlesByCategory('opinion');
  const lifestyleArticles = getArticlesByCategory('lifestyle');

  return (
    <>
      {/* Hero Slider */}
      <section className="hero-section" id="hero">
        {heroArticles.map((article, i) => (
          <div key={article.id} className={`hero-slide ${i === heroIndex ? 'active' : ''}`}>
            <img className="hero-slide-image" src={article.image} alt={article.title} />
            <div className="hero-overlay" />
            <div className="hero-content container">
              <Link to={`/category/${article.category}`} className="badge badge-business">
                {categories.find(c => c.slug === article.category)?.name || article.category}
              </Link>
              <h1 className="hero-title">
                <Link to={`/article/${article.id}`}>{article.title}</Link>
              </h1>
              <p className="hero-excerpt">{article.excerpt}</p>
              <div className="hero-meta">
                <span>{article.author}</span>
                <span>•</span>
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="hero-nav">
          <button onClick={() => setHeroIndex(prev => (prev - 1 + heroArticles.length) % heroArticles.length)} aria-label="Previous">
            <ChevronLeft />
          </button>
          <button onClick={() => setHeroIndex(prev => (prev + 1) % heroArticles.length)} aria-label="Next">
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="section" id="featured-stories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent" />
              Top Stories
            </h2>
            <Link to="/category/news" className="section-link">
              View All <ArrowRight />
            </Link>
          </div>
          <div className="grid-3">
            {articles.slice(0, 3).map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="section section-alt" id="business-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent" style={{ background: 'var(--color-business-blue)' }} />
              Business
            </h2>
            <Link to="/category/business" className="section-link">
              View All <ArrowRight />
            </Link>
          </div>
          <div className="grid-3">
            {businessArticles.slice(0, 3).map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section" id="newsletter">
        <div className="container">
          <div className="newsletter-inner">
            <h2 className="newsletter-title">Stay Informed</h2>
            <p className="newsletter-subtitle">
              Get the latest news and insights from Weekend Post delivered straight to your inbox every morning.
            </p>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-primary">
                <Mail size={16} /> Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* News + Sport Side by Side */}
      <section className="section" id="news-sport">
        <div className="container">
          <div className="grid-2">
            {/* News Column */}
            <div>
              <div className="section-header">
                <h2 className="section-title">
                  <span className="title-accent" style={{ background: 'var(--color-news-red)' }} />
                  News
                </h2>
                <Link to="/category/news" className="section-link">
                  More <ArrowRight />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                {newsArticles.slice(0, 3).map(article => (
                  <ArticleCard key={article.id} article={article} horizontal />
                ))}
              </div>
            </div>

            {/* Sport Column */}
            <div>
              <div className="section-header">
                <h2 className="section-title">
                  <span className="title-accent" style={{ background: 'var(--color-sport-green)' }} />
                  Sport
                </h2>
                <Link to="/category/sport" className="section-link">
                  More <ArrowRight />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                {sportArticles.slice(0, 3).map(article => (
                  <ArticleCard key={article.id} article={article} horizontal />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opinions */}
      {opinionArticles.length > 0 && (
        <section className="section section-alt" id="opinions-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-accent" style={{ background: 'var(--color-opinion-purple)' }} />
                Opinions &amp; Columns
              </h2>
              <Link to="/category/opinion" className="section-link">
                View All <ArrowRight />
              </Link>
            </div>
            <div className="grid-3">
              {opinionArticles.slice(0, 3).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* E-Paper Preview */}
      <section className="section" id="epaper-preview">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent" style={{ background: 'var(--color-gold)' }} />
              Latest E-Paper
            </h2>
            <Link to="/epaper" className="section-link">
              View Archive <ArrowRight />
            </Link>
          </div>
          <div className="grid-4">
            {ePapers.slice(0, 4).map(ep => (
              <div key={ep.id} className="epaper-card">
                <div className="epaper-card-image">
                  {ep.image ? (
                    <img src={ep.image} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="epaper-cover">
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>📰</div>
                      Weekend Post
                      <span className="epaper-cover-date">{ep.date}</span>
                    </div>
                  )}
                </div>
                <div className="epaper-card-body">
                  <h4 className="epaper-card-title">{ep.title}</h4>
                  <span className="epaper-card-date">{ep.date}</span>
                  <Link to={ep.latest ? '/epaper' : '/subscribe'} className="btn btn-primary btn-sm btn-block">
                    {ep.latest ? 'Read Now' : 'Subscribe to Read'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekend Life */}
      {lifestyleArticles.length > 0 && (
        <section className="section section-alt" id="lifestyle-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-accent" style={{ background: 'var(--color-lifestyle-pink)' }} />
                Weekend Life
              </h2>
              <Link to="/category/lifestyle" className="section-link">
                View All <ArrowRight />
              </Link>
            </div>
            <div className="grid-3">
              {lifestyleArticles.slice(0, 3).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
