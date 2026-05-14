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
          <div className="ad-banner" style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 'var(--space-xl)', textAlign: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 'var(--text-lg)', color: 'var(--color-primary)' }}>Scale Your Brand in Botswana</h3>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Reach Botswana's top decision-makers with premium placements.</p>
            </div>
            <button className="btn btn-sm btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Contact Sales <ExternalLink size={14} />
            </button>
          </div>
        ) : (
          <div className="ad-sidebar" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: 'var(--color-dark)' }}>FNB Business Solutions</h4>
            <div style={{ width: '100%', height: '140px', background: 'linear-gradient(45deg, #007E97, #00AEEF)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 'var(--text-xl)' }}>
              FNB
            </div>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Empowering your business journey with smart banking tools.</p>
            <button className="btn btn-sm btn-primary">Switch to FNB</button>
          </div>
        )}
      </div>
    </div>
  );
}
