import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, User, Share2, BookOpen, Lock, Download, ArrowRight, Play, AlertCircle, ThumbsUp, MessageCircle, ShieldCheck, Bookmark, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '../components/ui/SocialIcons';
import ArticleCard from '../components/articles/ArticleCard';
import PaymentModal from '../components/payment/PaymentModal';
import AdPlacement from '../components/ui/AdPlacement';
import { getArticleById, articles, getCategoryInfo } from '../data/articles';
import { useAuth } from '../context/AuthContext';

export default function ArticlePage() {
  const { id } = useParams();
  const article = getArticleById(id);
  const [progress, setProgress] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100) + 50);
  const [isLiked, setIsLiked] = useState(false);
  const { isLoggedIn, isSubscribed, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { 
    window.scrollTo(0, 0); 
    
    // Freemium View Tracking
    if (!isSubscribed && !isAdmin) {
      const views = JSON.parse(localStorage.getItem('wp_guest_views') || '{}');
      const today = new Date().toISOString().split('T')[0];
      const monthKey = today.substring(0, 7); // YYYY-MM
      
      if (!views[monthKey]) views[monthKey] = [];
      if (!views[monthKey].includes(id)) {
        views[monthKey].push(id);
        localStorage.setItem('wp_guest_views', JSON.stringify(views));
      }
      setViewCount(views[monthKey].length);
    }
  }, [id, isSubscribed, isAdmin]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!article) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="container">
          <h2>Article not found</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
            The article you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Return Home</Link>
        </div>
      </div>
    );
  }

  const catInfo = getCategoryInfo(article.category);
  const related = articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
  const allContent = article.content || [];

  const FREE_LIMIT = 3;
  const isOverLimit = !isSubscribed && !isAdmin && viewCount > FREE_LIMIT;
  const hasFullAccess = isAdmin || isSubscribed;
  const freeCount = isLoggedIn ? 3 : 2;
  const visibleContent = hasFullAccess ? allContent : allContent.slice(0, freeCount);
  const isBlurred = (!hasFullAccess && allContent.length > freeCount) || isOverLimit;

  const quickPlan = { id: 'monthly', name: 'Monthly Access', price: 60, currency: 'P', period: '/month' };

  return (
    <>
      {/* Premium Reading Progress Bar */}
      <div 
        className="reading-progress" 
        style={{ 
          width: `${progress}%`, 
          height: '4px', 
          background: 'var(--color-primary)', 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          zIndex: 2000, 
          transition: 'width 0.1s linear',
          boxShadow: '0 0 10px var(--color-primary)'
        }} 
      />

      <article className="article-page" style={{ background: 'white' }}>
        <div className="container">
          {/* Article Header */}
          <header className="article-header" style={{ maxWidth: '800px', margin: '0 auto var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {catInfo && (
                  <Link to={`/category/${article.category}`} className={`badge ${catInfo.badge}`}>
                    {catInfo.name}
                  </Link>
                )}
                {article.isSponsored && (
                  <span className="badge" style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                    Sponsored
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-sport-green)', fontSize: '11px', fontWeight: 700 }}>
                <ShieldCheck size={14} /> VERIFIED CONTENT
              </div>
            </div>
            
            <h1 className="article-page-title" style={{ fontSize: 'var(--text-4xl)', lineHeight: 1.2, fontWeight: 800, marginBottom: 'var(--space-lg)' }}>
              {article.title}
            </h1>

            <div className="article-meta-bar" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="author-avatar" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 700 }}>
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{article.author}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Staff Reporter</div>
                </div>
              </div>
              <div style={{ height: 24, width: 1, background: 'var(--color-border)' }} />
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', gap: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {article.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {article.readTime}</span>
              </div>
            </div>
          </header>

          {/* Hero Media */}
          <div className="article-hero-media" style={{ maxWidth: '1000px', margin: '0 auto var(--space-3xl)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            {article.videoUrl ? (
              <div className="video-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
                <video controls poster={article.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                  <source src={article.videoUrl} type="video/mp4" />
                </video>
              </div>
            ) : (
              <img src={article.image} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-3xl)', maxWidth: '1100px', margin: '0 auto' }} className="article-layout">
            {/* Article Content Column */}
            <div className="article-content-column">
              <div className="article-body" style={{ fontSize: 'var(--text-lg)', lineHeight: 1.8, color: '#334155' }}>
                {!isOverLimit ? (
                  visibleContent.map((paragraph, i) => (
                    <p key={i} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
                  ))
                ) : (
                  <div className="limit-reached" style={{ padding: 'var(--space-2xl)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--color-border)', marginBottom: 'var(--space-xl)' }}>
                    <AlertCircle size={48} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-md)' }} />
                    <h3 style={{ fontSize: 'var(--text-xl)' }}>Access Limited</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>You've reached your free monthly limit. Join our premium community to continue reading.</p>
                  </div>
                )}

                <AdPlacement type="banner" />

                <AnimatePresence>
                  {isBlurred && (
                    <motion.div className="paywall-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative', marginTop: '-100px', zIndex: 10 }}>
                      <div style={{ height: '200px', background: 'linear-gradient(transparent, white)' }} />
                      <div style={{ background: 'white', padding: 'var(--space-3xl)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border)', boxShadow: '0 -20px 50px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <Lock size={32} color="var(--color-primary)" style={{ marginBottom: 16 }} />
                        <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 12 }}>Unlock the Full Story</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, maxWidth: '400px', margin: '0 auto 24px' }}>
                          This article is exclusive to Weekend Post subscribers. Join 10,000+ readers getting Botswana's best reporting.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button className="btn btn-primary btn-lg" onClick={() => { setSelectedPlan(quickPlan); setShowPayment(true); }}>
                            Unlock Now — P60/mo
                          </button>
                          <Link to="/subscribe" className="btn btn-ghost btn-lg">View Plans</Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interaction Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-lg) 0', marginTop: 'var(--space-3xl)', marginBottom: 'var(--space-3xl)' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <button 
                      onClick={() => { setIsLiked(!isLiked); setLikes(l => isLiked ? l - 1 : l + 1); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: isLiked ? 'var(--color-news-red)' : 'var(--color-text-muted)', fontWeight: 600, fontSize: '14px' }}
                    >
                      <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} /> {likes}
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '14px' }}>
                      <MessageCircle size={18} /> 12 Comments
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="share-btn-pill"><Share2 size={16} /> Share</button>
                    <button className="share-btn-pill"><Bookmark size={16} /> Save</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <aside className="article-sidebar">
              <AdPlacement type="sidebar" />
              
              <div style={{ background: 'var(--color-bg-alt)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', marginTop: 'var(--space-xl)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><TrendingUp size={18} color="var(--color-primary)" /> Related Topics</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Economy', 'Finance', 'Gaborone', 'Mining'].map(t => (
                    <span key={t} style={{ padding: '4px 12px', background: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 700, border: '1px solid var(--color-border)', cursor: 'pointer' }}>#{t}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Footer Related */}
      <section className="section" style={{ background: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title"><span className="title-accent" /> Recommended for You</h2>
          </div>
          <div className="grid-3">
            {related.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          redirect={`/article/${id}`}
          onClose={() => { setShowPayment(false); setSelectedPlan(null); }}
        />
      )}

      <style>{`
        .share-btn-pill { background: white; border: 1px solid var(--color-border); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; alignItems: center; gap: 8px; transition: all 0.2s; }
        .share-btn-pill:hover { background: var(--color-bg-alt); border-color: var(--color-primary); color: var(--color-primary); }
        @media (max-width: 900px) { .article-layout { grid-template-columns: 1fr !important; } .article-sidebar { display: none !important; } }
      `}</style>
    </>
  );
}
