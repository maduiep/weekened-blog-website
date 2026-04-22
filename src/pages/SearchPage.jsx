import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/articles/ArticleCard';
import { articles } from '../data/articles';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const results = query.trim()
    ? articles.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase()) ||
        a.author.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Search Hero */}
      <div className="search-hero">
        <div className="container">
          <h1>Search Articles</h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Find the stories that matter to you across all of Weekend Post's coverage.
          </p>
          <div className="search-input-wrapper">
            <Search />
            <input
              type="text"
              placeholder="Search for articles, topics, or authors..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                }}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="section">
        <div className="container">
          {query.trim() ? (
            <>
              <p className="search-results-count">
                Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "{query}"
              </p>
              {results.length > 0 ? (
                <div className="grid-3">
                  {results.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)', opacity: 0.3 }}>🔍</div>
                  <h3 style={{ marginBottom: 'var(--space-md)' }}>No results found</h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
                    Try different keywords or browse our categories.
                  </p>
                  <Link to="/" className="btn btn-primary">Browse All Articles</Link>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
              <h3 style={{ marginBottom: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
                Popular Searches
              </h3>
              <div className="tags-list" style={{ justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
                {['Diamond Market', 'BFA', 'Parliament', 'Economy', 'Football', 'Budget', 'Energy', 'Gaborone'].map(tag => (
                  <button
                    key={tag}
                    className="tag-pill"
                    onClick={() => setQuery(tag)}
                    style={{ cursor: 'pointer' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Recent Articles */}
              <div style={{ marginTop: 'var(--space-3xl)', textAlign: 'left' }}>
                <div className="section-header">
                  <h2 className="section-title">
                    <span className="title-accent" />
                    Recent Articles
                  </h2>
                </div>
                <div className="grid-3">
                  {articles.slice(0, 6).map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
