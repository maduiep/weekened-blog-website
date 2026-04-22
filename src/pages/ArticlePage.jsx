import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Share2, BookOpen, Lock, Download, ArrowRight } from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '../components/ui/SocialIcons';
import ArticleCard from '../components/articles/ArticleCard';
import PaymentModal from '../components/payment/PaymentModal';
import { getArticleById, articles, getCategoryInfo } from '../data/articles';

export default function ArticlePage() {
  const { id } = useParams();
  const article = getArticleById(id);
  const [progress, setProgress] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
          <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const catInfo = getCategoryInfo(article.category);
  const related = articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
  const visibleContent = article.content?.slice(0, 3) || [];
  const hiddenContent = article.content?.slice(3) || [];

  return (
    <>
      {/* Reading Progress */}
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

            {/* Paywall */}
            {hiddenContent.length > 0 && !showPaywall && (
              <div className="paywall-overlay">
                <div className="paywall-fade" />
                <div className="paywall-card">
                  <div className="paywall-icon">
                    <Lock />
                  </div>
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
                    <Link to="/subscribe" className="btn btn-primary btn-lg">
                      Subscribe Now
                    </Link>
                    <button className="btn btn-ghost btn-lg" onClick={() => setShowPaywall(true)}>
                      Preview Full Article
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showPaywall && hiddenContent.map((paragraph, i) => (
              <p key={`h-${i}`}>{paragraph}</p>
            ))}

            {/* E-book CTA */}
            <div className="ebook-cta">
              <div className="ebook-cover">
                <BookOpen size={48} />
              </div>
              <div className="ebook-info">
                <h4>Get the Full E-book Edition</h4>
                <p>Download the complete Weekend Post edition as a convenient PDF. Read offline anywhere, anytime.</p>
                <div className="ebook-price">P60.00</div>
                <button className="btn btn-gold" onClick={() => setShowPayment(true)}>
                  <Download size={16} /> Purchase & Download
                </button>
              </div>
            </div>

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
              <div className="author-bio-avatar">
                {article.author.charAt(0)}
              </div>
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
                  More <ArrowRight />
                </Link>
              </div>
              <div className="grid-3">
                {related.map(a => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          plan={{ name: 'E-book Edition', price: 60, currency: 'P', period: '' }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}
