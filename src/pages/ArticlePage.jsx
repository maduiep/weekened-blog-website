import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, User, Share2, BookOpen, Lock, Download, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '../components/ui/SocialIcons';
import ArticleCard from '../components/articles/ArticleCard';
import PaymentModal from '../components/payment/PaymentModal';
import { getArticleById, articles, getCategoryInfo } from '../data/articles';
import { useAuth } from '../context/AuthContext';

export default function ArticlePage() {
  const { id } = useParams();
  const article = getArticleById(id);
  const [progress, setProgress] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { isLoggedIn, isSubscribed, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

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

  // ── Access control logic ───────────────────────────────────────────────────
  // Admins + subscribers see everything
  const hasFullAccess = isAdmin || isSubscribed;
  // Free preview: 2 paragraphs for guests, 3 for logged-in non-subscribers
  const freeCount = isLoggedIn ? 3 : 2;
  const visibleContent = hasFullAccess ? allContent : allContent.slice(0, freeCount);
  const isBlurred = !hasFullAccess && allContent.length > freeCount;

  const handleSubscribeClick = () => {
    const redirectParam = encodeURIComponent(`/article/${id}`);
    if (!isLoggedIn) {
      navigate(`/auth?redirect=${redirectParam}`);
    } else {
      navigate(`/subscribe?redirect=${redirectParam}`);
    }
  };

  const quickPlan = { id: 'monthly', name: 'Monthly Access', price: 60, currency: 'P', period: '/month' };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <article className="article-page">
        <div className="container">
          {/* Article Header */}
          <header className="article-header">
            {catInfo && (
              <Link to={`/category/${article.category}`} className={`badge ${catInfo.badge}`}>
                {catInfo.name}
              </Link>
            )}
            <h1 className="article-page-title">{article.title}</h1>
            <div className="article-meta-bar">
              <div className="author-avatar" style={{ background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <User size={18} />
              </div>
              <span className="author-name">{article.author}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {article.readTime}
              </span>
            </div>
          </header>

          {/* Hero Image */}
          <div className="article-hero-image">
            <img src={article.image} alt={article.title} />
          </div>

          {/* Article Body */}
          <div className="article-body">
            {visibleContent.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            {/* ── PAYWALL ── */}
            <AnimatePresence>
              {isBlurred && (
                <motion.div
                  className="paywall-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="paywall-fade" />
                  <motion.div
                    className="paywall-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="paywall-icon"><Lock size={24} /></div>

                    {!isLoggedIn ? (
                      <>
                        <h3 className="paywall-title">Create a free account to keep reading</h3>
                        <p className="paywall-text">
                          You've read {freeCount} free paragraphs. Sign up to read more or subscribe for full unlimited access.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button className="btn btn-primary btn-lg" onClick={() => navigate(`/auth?tab=signup&redirect=${encodeURIComponent(`/article/${id}`)}`)}>
                            Create Free Account
                          </button>
                          <button className="btn btn-ghost btn-lg" onClick={() => navigate(`/auth?redirect=${encodeURIComponent(`/article/${id}`)}`)}>
                            Sign In
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="paywall-title">Subscribe to continue reading</h3>
                        <p className="paywall-text">
                          Get unlimited access to all Weekend Post articles, e-papers, and exclusive content.
                        </p>
                        <div className="paywall-pricing">
                          <span className="paywall-price-chip">P9/week</span>
                          <span className="paywall-price-chip popular">P60/month</span>
                          <span className="paywall-price-chip">P330/year</span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-primary btn-lg"
                            onClick={() => { setSelectedPlan(quickPlan); setShowPayment(true); }}
                          >
                            Subscribe Now — P60/month
                          </button>
                          <Link to={`/subscribe?redirect=${encodeURIComponent(`/article/${id}`)}`} className="btn btn-ghost btn-lg">
                            View All Plans <ArrowRight size={16} />
                          </Link>
                        </div>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* E-book CTA (only for subscribers/admins) */}
            {hasFullAccess && (
              <div className="ebook-cta">
                <div className="ebook-cover"><BookOpen size={48} /></div>
                <div className="ebook-info">
                  <h4>Get the Full E-book Edition</h4>
                  <p>Download the complete Weekend Post edition as a convenient PDF.</p>
                  <div className="ebook-price">P60.00</div>
                  <button
                    className="btn btn-gold"
                    onClick={() => { setSelectedPlan({ id: 'ebook', name: 'E-book Edition', price: 60, currency: 'P', period: '' }); setShowPayment(true); }}
                  >
                    <Download size={16} /> Purchase & Download
                  </button>
                </div>
              </div>
            )}

            {/* Share */}
            <div className="share-bar">
              <span className="share-bar-title">Share</span>
              <button className="share-btn" aria-label="Facebook"><FacebookIcon size={16} /></button>
              <button className="share-btn" aria-label="Twitter"><TwitterIcon size={16} /></button>
              <button className="share-btn" aria-label="LinkedIn"><LinkedinIcon size={16} /></button>
              <button className="share-btn" aria-label="Share"><Share2 size={16} /></button>
            </div>

            {/* Author Bio */}
            <div className="author-bio">
              <div className="author-bio-avatar">{article.author.charAt(0)}</div>
              <div>
                <h4 className="author-bio-name">{article.author}</h4>
                <p className="author-bio-text">
                  {article.author} is a seasoned journalist at Weekend Post, covering {catInfo?.name?.toLowerCase() || 'general'} stories
                  with in-depth analysis and a commitment to factual reporting in Botswana.
                </p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
              <div className="section-header" style={{ marginTop: 'var(--space-2xl)' }}>
                <h2 className="section-title">
                  <span className="title-accent" />
                  Related Articles
                </h2>
                <Link to={`/category/${article.category}`} className="section-link">
                  More <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid-3">
                {related.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          redirect={`/article/${id}`}
          onClose={() => { setShowPayment(false); setSelectedPlan(null); }}
        />
      )}
    </>
  );
}
