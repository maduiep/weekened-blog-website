import { useNavigate, Link } from 'react-router-dom';
import { Download, Lock, FileText, CheckCircle, Calendar, ChevronDown, Search } from 'lucide-react';
import { ePapers } from '../data/articles';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EPaperPage() {
  const { isSubscribed, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');

  const years = ['2024', '2023', '2022', '2021'];

  const handleDownload = (ep) => {
    if (!isLoggedIn) {
      navigate('/auth?tab=signup');
      return;
    }
    if (!isSubscribed) {
      navigate('/subscribe');
      return;
    }

    setDownloading(ep.id);
    // Simulate download delay
    setTimeout(() => {
      setDownloading(null);
      alert(`Success! ${ep.title} PDF download started.`);
    }, 1500);
  };

  return (
    <div className="epaper-page">
      {/* Page Header */}
      <div className="page-header" style={{
        background: 'linear-gradient(135deg, var(--color-dark) 0%, #1a3a44 100%)',
        color: '#fff',
        padding: 'var(--space-4xl) 0',
        borderBottom: 'none',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge badge-epaper" 
            style={{ marginBottom: 'var(--space-lg)' }}
          >
            Digital Solution
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: '#fff', fontSize: 'var(--text-5xl)' }}
          >
            The E-Paper Archive
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: 'var(--space-md) auto 0', fontSize: 'var(--text-lg)' }}
          >
            The complete print heritage of Botswana's most trusted voice, reimagined for the digital age.
          </motion.p>
        </div>
      </div>

      {/* Archive Strategy Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: '70px', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) 0' }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <Calendar size={18} color="var(--color-primary)" />
            <div style={{ display: 'flex', gap: '4px' }}>
              {years.map(year => (
                <button 
                  key={year} 
                  onClick={() => setSelectedYear(year)}
                  style={{ 
                    padding: '6px 16px', 
                    borderRadius: '20px', 
                    border: '1px solid ' + (selectedYear === year ? 'var(--color-primary)' : 'var(--color-border)'),
                    background: selectedYear === year ? 'var(--color-primary)' : 'white',
                    color: selectedYear === year ? 'white' : 'var(--color-text-muted)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-bg-alt)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
            <Search size={14} color="var(--color-text-muted)" />
            <input type="text" placeholder="Search editions..." style={{ background: 'none', border: 'none', fontSize: '12px', outline: 'none' }} />
          </div>
        </div>
      </div>

      {/* Latest Edition (Featured) */}
      <section className="section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-2xl)',
              background: 'var(--color-bg-alt)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-2xl)',
              marginBottom: 'var(--space-3xl)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div style={{ 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}>
              {ePapers[0].image ? (
                <img src={ePapers[0].image} alt={ePapers[0].title} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-2xl)',
                  color: '#fff',
                  minHeight: '400px',
                }}>
                  <FileText size={80} style={{ opacity: 0.2, marginBottom: 'var(--space-lg)' }} />
                  <div style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-3xl)', fontWeight: 800 }}>Weekend Post</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', opacity: 0.7, marginTop: 'var(--space-sm)' }}>{ePapers[0].date}</div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-md)' }}>
                <span className="badge badge-epaper">Current Edition</span>
                <span className="badge" style={{ background: 'var(--color-gold)', color: 'white' }}>Premium</span>
              </div>
              <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-md)' }}>{ePapers[0].title}</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-xl)', lineHeight: 1.8 }}>
                Experience the full print layout with interactive digital features. 
                The Weekend Post E-Paper is Botswana's definitive record of the week's 
                events, politics, and business landscape.
              </p>
              
              <div style={{ background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>File Type</span>
                  <strong style={{ fontWeight: 700 }}>High-Res PDF</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Page Count</span>
                  <strong style={{ fontWeight: 700 }}>48 Pages</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleDownload(ePapers[0])} 
                  className={`btn btn-lg ${isSubscribed ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={downloading === ePapers[0].id}
                  style={{ flex: 1, minWidth: '160px' }}
                >
                  {downloading === ePapers[0].id ? 'Processing...' : (
                    <><Download size={18} /> {isSubscribed ? 'Download PDF' : 'Unlock Edition'}</>
                  )}
                </button>
                {!isSubscribed && (
                  <Link to="/subscribe" className="btn btn-gold btn-lg" style={{ flex: 1, minWidth: '160px' }}>
                    Subscribe
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* Archive Grid */}
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent" />
              {selectedYear} Archive
            </h2>
          </div>
          <div className="grid-4">
            {ePapers.slice(1).map(ep => (
              <motion.div 
                key={ep.id} 
                className="epaper-card"
                whileHover={{ y: -5 }}
              >
                <div className="epaper-card-image">
                  {ep.image ? (
                    <img src={ep.image} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="epaper-cover">
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>📰</div>
                      <span style={{ fontSize: '14px', fontWeight: 800 }}>Weekend Post</span>
                      <span className="epaper-cover-date">{ep.date}</span>
                    </div>
                  )}
                </div>
                <div className="epaper-card-body">
                  <h4 className="epaper-card-title">{ep.title}</h4>
                  <span className="epaper-card-date">{ep.date}</span>
                  <button 
                    onClick={() => handleDownload(ep)}
                    className={`btn btn-sm btn-block ${isSubscribed ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={downloading === ep.id}
                  >
                    {downloading === ep.id ? '...' : (
                      isSubscribed ? <><Download size={14} /> Download</> : <><Lock size={14} /> Unlock</>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solution CTA */}
          <div style={{
            background: 'var(--color-dark)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-3xl)',
            textAlign: 'center',
            marginTop: 'var(--space-4xl)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'var(--color-primary)', opacity: 0.1, borderRadius: '50%', transform: 'translate(150px, -150px)' }} />
            <h2 style={{ color: '#fff', marginBottom: 'var(--space-md)' }}>Corporate E-Paper Access</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-2xl)', maxWidth: '600px', margin: '0 auto var(--space-2xl)', fontSize: 'var(--text-lg)' }}>
              Enable your entire organization with multi-user digital access to our weekly editions and archival research tools.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/solutions" className="btn btn-primary btn-lg">Enterprise Solutions</Link>
              <Link to="/contact" className="btn btn-ghost btn-lg">Request a Demo</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
