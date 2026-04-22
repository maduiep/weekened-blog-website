import { useState, useEffect, useCallback } from 'react';
import { Search, X, Clock, User } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleCard from '../components/articles/ArticleCard';
import { articles } from '../data/articles';

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const POPULAR_TAGS = ['Diamond Market', 'BFA', 'Parliament', 'Economy', 'Football', 'Budget', 'Energy', 'Gaborone'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 280);

  // Sync URL with query
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedQuery, setSearchParams]);

  const results = debouncedQuery.trim()
    ? articles.filter(a =>
        a.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (a.excerpt || '').toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        a.author.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (a.content || []).some(p => p.toLowerCase().includes(debouncedQuery.toLowerCase()))
      )
    : [];

  const handleTagClick = useCallback((tag) => setQuery(tag), []);
  const handleClear = useCallback(() => setQuery(''), []);

  return (
    <>
      {/* Search Hero */}
      <div className="search-hero">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Search Articles
          </motion.h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto var(--space-lg)' }}>
            Find the stories that matter to you across all of Weekend Post's coverage.
          </p>
          <div className="search-input-wrapper">
            <Search size={22} />
            <input
              type="text"
              placeholder="Search for articles, topics, or authors…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              aria-label="Search articles"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={handleClear}
                  style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                  }}
                  aria-label="Clear search"
                >
                  <X size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Popular tags */}
          <div className="search-tags">
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag}
                className={`tag-pill ${query === tag ? 'tag-pill-active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="section">
        <div className="container">
          <AnimatePresence mode="wait">
            {debouncedQuery.trim() ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="search-results-count">
                  Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for&nbsp;
                  "<em>{debouncedQuery}</em>"
                </p>
                {results.length > 0 ? (
                  <div className="grid-3">
                    {results.map((article, i) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <ArticleCard article={article} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}
                  >
                    <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-lg)', opacity: 0.3 }}>🔍</div>
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>No results found for "{debouncedQuery}"</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
                      Try different keywords or browse our categories below.
                    </p>
                    <div className="search-tags" style={{ justifyContent: 'center' }}>
                      {POPULAR_TAGS.map(tag => (
                        <button key={tag} className="tag-pill" onClick={() => handleTagClick(tag)}>{tag}</button>
                      ))}
                    </div>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--space-xl)' }}>
                      Browse All Articles
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Recent Articles */}
                <div className="section-header" style={{ marginBottom: 'var(--space-xl)' }}>
                  <h2 className="section-title">
                    <span className="title-accent" /> Recent Articles
                  </h2>
                </div>
                <div className="grid-3">
                  {articles.slice(0, 6).map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
