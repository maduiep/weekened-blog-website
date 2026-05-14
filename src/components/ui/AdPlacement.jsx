import { useState, useEffect } from 'react';
import { Info, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdPlacement({ type = 'banner', label = 'Advertisement' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Simulate ad loading delay
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isDismissed) return null;

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

        {type === 'banner' ? (
          <div className="ad-banner" style={{ 
            padding: 'var(--space-2xl)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 'var(--space-xl)', 
            textAlign: 'left',
            background: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            minHeight: '160px'
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 'var(--text-2xl)', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Scale Your Brand in Botswana</h3>
              <p style={{ margin: 0, fontSize: 'var(--text-md)', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Reach Botswana's top decision-makers with premium digital placements.</p>
            </div>
            <button className="btn btn-lg btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              Contact Sales <ExternalLink size={16} />
            </button>
          </div>
        ) : (
          <div className="ad-sidebar" style={{ padding: '0', display: 'flex', flexDirection: 'column', textAlign: 'center', background: 'white' }}>
            <div style={{ width: '100%', height: '220px', backgroundImage: 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ padding: 'var(--space-lg)' }}>
              <h4 style={{ margin: '0 0 8px', color: 'var(--color-dark)', fontSize: 'var(--text-lg)' }}>FNB Business Solutions</h4>
              <p style={{ margin: '0 0 16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Empowering your business journey with smart banking tools and dedicated support.</p>
              <button className="btn btn-sm btn-primary" style={{ width: '100%' }}>Switch to FNB</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
