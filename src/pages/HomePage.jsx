import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, ArrowRight, Mail, Play, Shield, Globe, Award, Target, Zap, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleCard from '../components/articles/ArticleCard';
import AdPlacement from '../components/ui/AdPlacement';
import { articles, categories, getArticlesByCategory, ePapers } from '../data/articles';

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const featured = articles.filter(a => a.featured);
  const heroArticles = featured.length > 0 ? featured : articles.slice(0, 3);
  const [liveUpdates, setLiveUpdates] = useState([
    { id: 1, time: '2 mins ago', text: 'BSE indices see marginal gain in early trading session.', category: 'Business' },
    { id: 2, time: '15 mins ago', text: 'BFA announces new developmental coaching initiative.', category: 'Sport' },
    { id: 3, time: '40 mins ago', text: 'Parliamentary session on budget highlights energy sector.', category: 'News' },
  ]);

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
              <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
                <Link to={`/category/${article.category}`} className="badge badge-business">
                  {categories.find(c => c.slug === article.category)?.name || article.category}
                </Link>
                {article.videoUrl && (
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Play size={12} fill="currentColor" /> Video Story
                  </span>
                )}
              </div>
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

      {/* Commercial Solution Banner & Live Ticker */}
      <section className="commercial-banner" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', color: 'white', padding: 'var(--space-2xl) 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-xl)' }}>
            <div style={{ flex: '1', minWidth: '280px' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-sm)', color: 'white' }}>The Digital Solution for Botswana's Leaders</h2>
              <p style={{ opacity: 0.9, margin: 0 }}>Commercial insights, premium journalism, and e-paper access.</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-xl)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>100K+</div>
                <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>Weekly Readers</div>
              </div>
              <div style={{ textAlign: 'center', paddingLeft: 'var(--space-lg)', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>24/7</div>
                <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>Live Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout Grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-3xl)' }} className="main-home-grid">
            {/* Left Column: Top Stories */}
            <div>
              <div className="section-header">
                <h2 className="section-title"><span className="title-accent" /> Top Stories</h2>
                <Link to="/category/news" className="section-link">View All <ArrowRight size={16} /></Link>
              </div>
              <div className="grid-2" style={{ gap: 'var(--space-2xl)' }}>
                {articles.slice(0, 4).map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              <div style={{ marginTop: 'var(--space-3xl)' }}>
                <AdPlacement type="banner" />
              </div>

              {/* Business Section */}
              <div style={{ marginTop: 'var(--space-3xl)' }}>
                <div className="section-header">
                  <h2 className="section-title"><span className="title-accent" style={{ background: 'var(--color-business-blue)' }} /> Business Intelligence</h2>
                  <Link to="/category/business" className="section-link">More Business <ArrowRight size={16} /></Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
                  {businessArticles.slice(0, 3).map(article => (
                    <ArticleCard key={article.id} article={article} horizontal />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Newsroom & Commercial CTAs */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
              {/* Live Newsroom Widget */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--color-news-red)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={16} fill="white" />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Newsroom Live</span>
                  <div className="pulse-dot" style={{ width: 8, height: 8, background: 'white', borderRadius: '50%', marginLeft: 'auto' }} />
                </div>
                <div style={{ padding: 'var(--space-lg)' }}>
                  {liveUpdates.map((update, i) => (
                    <div key={update.id} style={{ padding: '12px 0', borderBottom: i === liveUpdates.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase' }}>{update.category}</span>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {update.time}</span>
                      </div>
                      <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.4, color: 'var(--color-dark)', fontWeight: 600 }}>{update.text}</p>
                    </div>
                  ))}
                  <Link to="/news" className="btn btn-ghost btn-sm btn-block" style={{ marginTop: '12px', fontSize: '11px', textAlign: 'center', display: 'block' }}>Full Coverage Archive</Link>
                </div>
              </div>

              {/* Trending Topics */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-xl)' }}>
                <h3 style={{ fontSize: 'var(--text-md)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}>
                  <TrendingUp size={18} color="var(--color-gold)" /> Popular Now
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {articles.slice(4, 8).map((art, i) => (
                    <Link key={art.id} to={`/article/${art.id}`} style={{ textDecoration: 'none', color: 'var(--color-dark)', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', WebkitTextStroke: '1px #e2e8f0' }}>0{i+1}</span>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }}>{art.title}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Commercial CTA Card */}
              <div style={{ background: 'var(--color-dark)', color: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'var(--color-primary)', opacity: 0.1, borderRadius: '50%' }} />
                <h3 style={{ color: 'white', fontSize: 'var(--text-md)', marginBottom: 8 }}>Partner with Us</h3>
                <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: 16 }}>Reach 100,000+ weekly readers across Botswana with our digital solutions.</p>
                <Link to="/solutions" className="btn btn-primary btn-sm btn-block">Explore Advertising</Link>
              </div>

              <AdPlacement type="sidebar" />
            </aside>
          </div>
        </div>
      </section>

      {/* Video Highlights Section */}
      <section className="section" style={{ background: '#0f172a', color: '#fff', padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <div className="section-header" style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
            <h2 className="section-title" style={{ color: '#fff' }}><span className="title-accent" style={{ background: 'var(--color-news-red)' }} /> Media Highlights</h2>
            <Link to="/search" className="section-link" style={{ color: 'rgba(255,255,255,0.6)' }}>More Videos <ArrowRight size={16} /></Link>
          </div>
          <div className="grid-2" style={{ gap: 'var(--space-xl)' }}>
            {articles.filter(a => a.videoUrl).slice(0, 2).map(article => (
              <div key={article.id} className="video-card-premium" style={{ position: 'relative', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
                <Link to={`/article/${article.id}`}>
                  <div style={{ aspectRatio: '16/9' }}><img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'var(--space-2xl)' }}>
                    <div style={{ width: 50, height: 50, background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><Play size={24} fill="white" /></div>
                    <h3 style={{ color: 'white', margin: 0 }}>{article.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Paper & Newsletter */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-3xl)' }}>
            {/* E-Paper */}
            <div>
              <div className="section-header">
                <h2 className="section-title"><span className="title-accent" style={{ background: 'var(--color-gold)' }} /> Weekend E-Paper</h2>
                <Link to="/epaper" className="section-link">Archive <ArrowRight size={16} /></Link>
              </div>
              <div style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
                <div style={{ width: '120px', height: '160px', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '12px' }}>
                  <FileText size={40} color="var(--color-primary)" />
                  <span style={{ fontSize: '10px', marginTop: 8, fontWeight: 700 }}>Weekend Post</span>
                  <span style={{ fontSize: '8px', opacity: 0.6 }}>{ePapers[0].date}</span>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 8px' }}>{ePapers[0].title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 16 }}>Access the full print replica with high-resolution archival features.</p>
                  <Link to="/epaper" className="btn btn-primary btn-sm">Read Edition</Link>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <div className="section-header">
                <h2 className="section-title"><span className="title-accent" /> Daily Briefing</h2>
              </div>
              <div style={{ background: 'var(--color-dark)', color: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: 20 }}>Get Botswana's most impactful stories delivered to your inbox daily.</p>
                <form style={{ display: 'flex', gap: 8 }} onSubmit={e => e.preventDefault()}>
                  <input type="email" placeholder="email@address.com" style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none', fontSize: '13px' }} required />
                  <button className="btn btn-primary btn-sm">Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .pulse-dot { animation: pulse 2s infinite; }
        @media (max-width: 900px) {
          .main-home-grid { grid-template-columns: 1fr !important; }
          aside { display: none !important; }
        }
      `}</style>
    </>
  );
}

const FileText = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);
