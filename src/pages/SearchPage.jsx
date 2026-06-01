import { useState, useEffect, useCallback } from 'react';
import { Search, X, Clock, User, TrendingUp, Calendar, ArrowRight, Bookmark } from 'lucide-react';
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
  const [filter, setFilter] = useState('all'); // all | latest | popular

  // Sync URL with query
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedQuery, setSearchParams]);

  const rawResults = debouncedQuery.trim()
    ? articles.filter(a =>
        a.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (a.excerpt || '').toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        a.author.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (a.content || []).some(p => p.toLowerCase().includes(debouncedQuery.toLowerCase()))
      )
    : [];

  const results = [...rawResults].sort((a, b) => {
    if (filter === 'latest') return new Date(b.date) - new Date(a.date);
    return 0; // Default relevance
  });

  const handleTagClick = useCallback((tag) => setQuery(tag), []);
  const handleClear = useCallback(() => setQuery(''), []);

  return (
    <div className="search-page-container" style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Search Hero */}
      <div className="search-hero" style={{ background: 'white', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: '8px' }}>Archive Explorer</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)' }}>Discover Botswana's most impactful stories, past and present.</p>
          </motion.div>

          <div className="search-input-wrapper" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <Search size={22} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
            <input
              type="text"
              placeholder="Enter keywords, topics, or names..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '18px 60px 18px 60px', borderRadius: '40px', border: '2px solid var(--color-border)', fontSize: 'var(--text-lg)', outline: 'none', transition: 'border-color 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              onFocus={e => e.target.parentElement.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.parentElement.style.borderColor = 'var(--color-border)'}
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={handleClear}
                  style={{ position: 'absolute', right: 20, top: '50%', marginTop: '-16px', background: 'var(--color-bg-alt)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="search-tags" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: 'var(--space-lg)' }}>
            {POPULAR_TAGS.map(tag => (
              <button key={tag} className={`tag-pill ${query === tag ? 'active' : ''}`} onClick={() => handleTagClick(tag)} style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--color-border)', background: query === tag ? 'var(--color-primary)' : 'white', color: query === tag ? 'white' : 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-3xl)' }} className="search-layout">
            {/* Results Column */}
            <div className="search-results-column">
              <AnimatePresence mode="wait">
                {debouncedQuery.trim() ? (
                  <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-border)' }}>
                      <p className="search-results-count" style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
                        Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "{debouncedQuery}"
                      </p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px', background: 'white', fontWeight: 600, outline: 'none' }}>
                          <option value="all">Relevance</option>
                          <option value="latest">Newest First</option>
                        </select>
                      </div>
                    </div>

                    {results.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                        {results.map((article, i) => (
                          <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <ArticleCard article={article} layout="horizontal" />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: 'var(--space-4xl) 0', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)', opacity: 0.2 }}>🕵️‍♂️</div>
                        <h3>No matches for your query</h3>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '300px', margin: '0 auto' }}>Try using broader keywords or checking for spelling errors.</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="section-header">
                      <h2 className="section-title"><Clock size={20} style={{ color: 'var(--color-primary)', marginRight: 8 }} /> Recently Published</h2>
                    </div>
                    <div className="grid-2">
                      {articles.slice(0, 4).map((article, i) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Column */}
            <aside className="search-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
              {/* Trending */}
              <div style={{ background: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 'var(--text-md)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}>
                  <TrendingUp size={18} color="var(--color-gold)" /> Trending Now
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {articles.slice(2, 6).map((art, i) => (
                    <Link key={art.id} to={`/article/${art.id}`} style={{ textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'black' }}>0{i+1}</span>
                      <div>
                        <h4 style={{ fontSize: '13px', margin: '0 0 4px', color: 'var(--color-dark)', lineHeight: 1.4 }}>{art.title}</h4>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{art.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Specialized Reports CTA */}
              <div style={{ background: 'var(--color-primary)', color: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }}>
                <Bookmark size={40} style={{ position: 'absolute', top: -10, right: -10, opacity: 0.1 }} />
                <h3 style={{ color: 'white', fontSize: 'var(--text-md)', marginBottom: '8px' }}>Market Intelligence</h3>
                <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: 'var(--space-lg)', lineHeight: 1.5 }}>Access high-value Botswana economic and industrial reports.</p>
                <Link to="/solutions" className="btn btn-sm btn-gold btn-block" style={{ fontSize: '11px' }}>Explore Solutions <ArrowRight size={14} /></Link>
              </div>

              {/* Help/Support */}
              <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>Can't find what you're looking for?</p>
                <Link to="/contact" style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>Contact our Archivist</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .search-layout { grid-template-columns: 1fr !important; }
          .search-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
