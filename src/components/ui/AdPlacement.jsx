import { useState, useEffect } from 'react';
import { Info, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adCreatives, trackAdImpression, trackAdClick } from '../../data/adInventory';
import { useAuth } from '../../context/AuthContext';

export default function AdPlacement({ type = 'banner', label = 'Advertisement', category = null }) {
  const { isSubscribed } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const liveInventory = JSON.parse(localStorage.getItem("wp_ad_inventory") || "[]").map(ad => ({
      ...ad,
      image: ad.imageUrl || ad.image,
      targetCategories: ad.category ? [ad.category] : [],
      cta: 'Learn More',
      ctaUrl: ad.link || '#',
      color: 'var(--color-primary)'
    }));
    const combinedCreatives = [...liveInventory, ...adCreatives];

    const pool = combinedCreatives.filter(ad => {
      if (ad.type !== type) return false;
      if (category && ad.targetCategories && ad.targetCategories.length > 0 && !ad.targetCategories.includes(category)) return false;
      return true;
    });
    if (pool.length === 0) {
      const fallback = combinedCreatives.find(ad => ad.type === type) || combinedCreatives[0];
      if (fallback) pool.push(fallback);
    }
    setAds(pool);
    if (pool.length > 0) {
      trackAdImpression(pool[0].id);
    }
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, [type, category]);

  useEffect(() => {
    if (!isVisible || ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % ads.length;
        trackAdImpression(ads[next].id);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible, ads]);

  const ad = ads[currentIndex];

  if (isDismissed || isSubscribed) return null;

  if (!isVisible) {
    return (
      <div 
        className={`ad-placeholder ${type}`} 
        style={{ 
          minHeight: type === 'banner' ? '120px' : '300px', 
          background: 'var(--color-bg-alt)',
          borderRadius: 'var(--radius-lg)',
          margin: 'var(--space-xl) 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Loading Solution...
      </div>
    );
  }

  return (
    <div className={`ad-container ${type}`} style={{ margin: 'var(--space-xl) 0', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span className="ad-label" style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '1px' }}>
          {label}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
            title="Ad Information"
          >
            <Info size={12} />
          </button>
          <button 
            onClick={() => setIsDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
            title="Hide Ad"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="ad-content" style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-lg)', textAlign: 'center', backdropFilter: 'blur(4px)' }}
            >
              <p style={{ fontSize: '11px', color: 'var(--color-dark)', fontWeight: 600, marginBottom: '8px' }}>Why am I seeing this?</p>
              <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>This content is delivered by Weekend Post's Digital Solutions Network based on your interests.</p>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowInfo(false)}>Close</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={ad?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {type === 'banner' ? (
              <div className="ad-banner" style={{ 
                padding: 'var(--space-2xl)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap', 
                gap: 'var(--space-xl)', 
                textAlign: 'left',
                background: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url("${ad?.image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                minHeight: '160px'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 'var(--text-2xl)', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{ad?.title}</h3>
                  <p style={{ margin: 0, fontSize: 'var(--text-md)', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{ad?.description}</p>
                </div>
                <button onClick={() => { trackAdClick(ad?.id); window.location.href = ad?.ctaUrl; }} className="btn btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', background: ad?.color, color: 'white', border: 'none' }}>
                  {ad?.cta} <ExternalLink size={16} />
                </button>
              </div>
            ) : (
              <div className="ad-sidebar" style={{ padding: '0', display: 'flex', flexDirection: 'column', textAlign: 'center', background: 'white' }}>
                <div style={{ width: '100%', height: '220px', backgroundImage: `url("${ad?.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: 'var(--space-lg)' }}>
                  <h4 style={{ margin: '0 0 8px', color: 'var(--color-dark)', fontSize: 'var(--text-lg)' }}>{ad?.title}</h4>
                  <p style={{ margin: '0 0 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{ad?.description}</p>
                  <button onClick={() => { trackAdClick(ad?.id); window.location.href = ad?.ctaUrl; }} className="btn btn-sm btn-primary" style={{ width: '100%', background: ad?.color, border: 'none' }}>{ad?.cta}</button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        {ads.length > 1 && (
          <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
            {ads.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  trackAdImpression(ads[idx].id);
                }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  padding: 0,
                  border: 'none',
                  background: idx === currentIndex ? 'var(--color-primary)' : 'rgba(150, 150, 150, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
