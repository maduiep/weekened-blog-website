import { useNavigate, Link } from 'react-router-dom';
import { Download, Lock, FileText, CheckCircle } from 'lucide-react';
import { ePapers } from '../data/articles';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function EPaperPage() {
  const { isSubscribed, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(null);

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
      // In a real app, this would be: window.open(ep.pdfUrl);
      alert(`Success! ${ep.title} PDF download started.`);
    }, 1500);
  };
  return (
    <>
      {/* Page Header */}
      <div className="page-header" style={{
        background: 'linear-gradient(135deg, var(--color-dark) 0%, #1a3a44 100%)',
        color: '#fff',
        padding: 'var(--space-3xl) 0',
        borderBottom: 'none',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-epaper" style={{ marginBottom: 'var(--space-lg)' }}>E-Paper</span>
          <h1 style={{ color: '#fff' }}>Digital E-Paper Archive</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            Read the complete Weekend Post digital edition. Available as downloadable PDF 
            for subscribers. Browse our full archive below.
          </p>
        </div>
      </div>

      {/* Latest Edition (Featured) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent" style={{ background: 'var(--color-gold)' }} />
              Latest Edition
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: 'var(--space-2xl)',
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-2xl)',
            marginBottom: 'var(--space-2xl)',
          }}>
            {ePapers[0].image ? (
              <div style={{ 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden', 
                boxShadow: 'var(--shadow-lg)' 
              }}>
                <img src={ePapers[0].image} alt={ePapers[0].title} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-2xl)',
                color: '#fff',
                minHeight: '360px',
                boxShadow: 'var(--shadow-lg)',
              }}>
                <FileText size={64} style={{ opacity: 0.3, marginBottom: 'var(--space-lg)' }} />
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-2xl)', fontWeight: 700, textAlign: 'center' }}>
                  Weekend Post
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', opacity: 0.6, marginTop: 'var(--space-sm)' }}>
                  {ePapers[0].date}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="badge badge-epaper" style={{ width: 'fit-content', marginBottom: 'var(--space-md)' }}>Latest Issue</span>
              <h2 style={{ marginBottom: 'var(--space-md)' }}>{ePapers[0].title}</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-xl)', lineHeight: 1.8 }}>
                The complete digital edition of the Weekend Post, featuring all articles, 
                columns, sports coverage, and business analysis. Download as a high-quality 
                PDF to read offline on any device.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleDownload(ePapers[0])} 
                  className={`btn btn-lg ${isSubscribed ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={downloading === ePapers[0].id}
                >
                  {downloading === ePapers[0].id ? 'Preparing...' : (
                    <><Download size={16} /> {isSubscribed ? 'Download PDF' : 'Unlock PDF'}</>
                  )}
                </button>
                {!isSubscribed && (
                  <Link to="/subscribe" className="btn btn-gold btn-lg">
                    Subscribe for Full Access
                  </Link>
                )}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                {isSubscribed ? (
                  <><CheckCircle size={12} style={{ color: '#2ecc71' }} /> Included with your subscription</>
                ) : (
                  <><Lock size={12} /> Available to Monthly and Annual subscribers</>
                )}
              </p>
            </div>
          </div>

          {/* Archive Grid */}
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent" />
              Archive
            </h2>
          </div>
          <div className="grid-4">
            {ePapers.slice(1).map(ep => (
              <div key={ep.id} className="epaper-card">
                <div className="epaper-card-image">
                  {ep.image ? (
                    <img src={ep.image} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="epaper-cover">
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>📰</div>
                      Weekend Post
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
                      isSubscribed ? <><Download size={12} /> Download</> : <><Lock size={12} /> Unlock</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe CTA */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-dark) 0%, #2a2a2a 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-2xl)',
            textAlign: 'center',
            marginTop: 'var(--space-2xl)',
            color: '#fff',
          }}>
            <h3 style={{ color: '#fff', marginBottom: 'var(--space-sm)' }}>
              Unlock the Full Digital Archive
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
              Subscribe to access all past editions and download them as PDFs. Starting from just P9 per week.
            </p>
            <Link to="/subscribe" className="btn btn-gold btn-lg">
              View Subscription Plans
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
