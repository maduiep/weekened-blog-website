import { motion } from 'framer-motion';
import { Shield, Globe, Award, Target, Users, BarChart, Smartphone, Lock, Briefcase, FileText, TrendingUp, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SolutionsPage() {
  const solutions = [
    {
      icon: <Target size={32} />,
      title: 'Digital Advertising',
      desc: 'Reach Botswana\'s decision-makers through high-impact display ads, sponsored content, and section takeovers.',
      features: ['100k+ Weekly Impressions', 'Audience Segmentation', 'Real-time Analytics']
    },
    {
      icon: <Award size={32} />,
      title: 'E-Paper Strategy',
      desc: 'Get your brand in front of premium subscribers who read the digital replica of our print edition every weekend.',
      features: ['Full Page Placements', 'Interactive PDF Links', 'Archive Integration']
    },
    {
      icon: <BarChart size={32} />,
      title: 'Corporate Insights',
      desc: 'Custom business reporting and market analysis tailored for corporate decision-makers and investors.',
      features: ['Deep Market Analysis', 'Industrial Trends', 'Economic Forecasts']
    }
  ];

  const premiumReports = [
    { title: 'Mining Sector Outlook 2024', price: 'P2,400', tag: 'High Value', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400' },
    { title: 'Botswana Fintech Report', price: 'P1,800', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400' },
    { title: 'Commercial Real Estate', price: 'P3,100', tag: 'New', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400' },
  ];

  const trustMarkers = [
    { icon: <Shield size={24} />, title: 'Bank-Grade Security', desc: 'Secure payment gateways and data protection.' },
    { icon: <Smartphone size={24} />, title: 'Device-Agnostic', desc: 'Optimized for mobile, tablet, and desktop.' },
    { icon: <Lock size={24} />, title: 'Verified Privacy', desc: 'Unique user validation and encryption.' }
  ];

  return (
    <div className="solutions-page">
      {/* Hero */}
      <section className="page-header" style={{ background: 'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', padding: 'var(--space-4xl) 0', textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{ color: 'white', fontSize: 'var(--text-5xl)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Digital & Market Intelligence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            style={{ fontSize: 'var(--text-xl)', color: 'white', fontWeight: 500, maxWidth: '750px', margin: 'var(--space-md) auto 0', textShadow: '0 4px 15px rgba(0,0,0,1)', background: 'rgba(0,0,0,0.3)', padding: 'var(--space-md) var(--space-lg)', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(4px)' }}
          >
            Beyond reporting: We provide the data, audience, and platforms that drive Botswana's commercial future.
          </motion.p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title"><span className="title-accent" /> Core Services</h2>
          </div>
          <div className="grid-3" style={{ gap: 'var(--space-2xl)' }}>
            {solutions.map((s, i) => (
              <motion.div 
                key={i} 
                className="solution-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                style={{ background: 'white', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)', transition: 'all 0.3s' }}
              >
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-lg)' }}>{s.icon}</div>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>{s.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{s.desc}</p>
                <ul style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', padding: 0, listStyle: 'none' }}>
                  {s.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                      <span style={{ color: 'var(--color-primary)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Intelligence Reports */}
      <section className="section section-alt" style={{ background: '#f0f4f8' }}>
        <div className="container">
          <div className="section-header" style={{ borderBottom: 'none' }}>
            <div>
              <h2 className="section-title"><TrendingUp size={24} style={{ color: 'var(--color-primary)', marginRight: 12 }} /> Market Intelligence Store</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>Premium data-driven reports for institutional investors and local leaders.</p>
            </div>
            <Link to="/contact" className="btn btn-ghost btn-sm">View All Reports <ArrowRight size={14} /></Link>
          </div>
          
          <div className="grid-3" style={{ marginTop: 'var(--space-2xl)' }}>
            {premiumReports.map((report, i) => (
              <motion.div 
                key={i}
                className="report-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
              >
                <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                  <img src={report.image} alt={report.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--color-gold)', color: 'white', fontSize: "var(--text-xs)", fontWeight: 800, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {report.tag}
                  </div>
                </div>
                <div style={{ padding: 'var(--space-lg)' }}>
                  <h4 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-sm)' }}>{report.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-lg)' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 'var(--text-lg)' }}>{report.price}</span>
                    <button className="btn btn-sm btn-primary" style={{ padding: '6px 12px' }}>Download <FileText size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', borderBottom: 'none' }}>
            <h2 className="section-title">Institutional Grade Infrastructure</h2>
          </div>
          <div className="grid-3" style={{ marginTop: 'var(--space-2xl)' }}>
            {trustMarkers.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(0,126,151,0.1)', color: 'var(--color-primary)', padding: '12px', borderRadius: '12px' }}>{m.icon}</div>
                <div>
                  <h4 style={{ fontSize: 'var(--text-md)', marginBottom: '4px' }}>{m.title}</h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Integrations Roadmap */}
      <section className="section section-alt" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8ecf1 100%)' }}>
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', borderBottom: 'none' }}>
            <h2 className="section-title"><Globe size={24} style={{ color: 'var(--color-primary)', marginRight: 12 }} /> Future System Integrations</h2>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', maxWidth: '650px', margin: '0 auto var(--space-2xl)', fontSize: 'var(--text-md)', lineHeight: 1.7 }}>
            Weekend Post is built for interoperability. Our platform is designed to seamlessly integrate with existing enterprise systems and future technology partners.
          </p>

          <div className="grid-3" style={{ gap: 'var(--space-xl)' }}>
            {[
              {
                icon: <FileText size={28} />,
                title: 'WordPress CMS Migration',
                desc: 'Full editorial migration to WordPress with custom theme, plugin ecosystem, and headless API for future mobile apps.',
                status: 'In Progress',
                statusColor: '#F5A623',
              },
              {
                icon: <BarChart size={28} />,
                title: 'ERP & SAP Integration',
                desc: 'Connect revenue, subscriptions, and advertiser billing directly to SAP or Oracle ERP for automated financial reconciliation.',
                status: 'Planned Q3 2026',
                statusColor: 'var(--color-primary)',
              },
              {
                icon: <Smartphone size={28} />,
                title: 'SMS & USSD Gateway',
                desc: 'Mobile-first payment confirmations, breaking news alerts, and subscription management via Orange/Mascom USSD channels.',
                status: 'Planned Q4 2026',
                statusColor: 'var(--color-primary)',
              },
              {
                icon: <Shield size={28} />,
                title: 'Enterprise SSO / SAML',
                desc: 'Single sign-on integration for corporate clients via Azure AD, Okta, or Google Workspace for seamless team access.',
                status: 'Planned Q3 2026',
                statusColor: 'var(--color-primary)',
              },
              {
                icon: <Globe size={28} />,
                title: 'Social Media & Analytics',
                desc: 'Auto-publish to Facebook, X (Twitter), and LinkedIn. Consolidated social analytics dashboard for editors.',
                status: 'Planned Q4 2026',
                statusColor: 'var(--color-primary)',
              },
              {
                icon: <Smartphone size={28} />,
                title: 'Native Mobile Apps',
                desc: 'iOS and Android apps with offline reading, push notifications, and biometric-secured login for subscribers.',
                status: 'Planned 2027',
                statusColor: '#94a3b8',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: 'white',
                  padding: 'var(--space-xl)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-md)',
                  right: 'var(--space-md)',
                  background: item.statusColor,
                  color: 'white',
                  fontSize: "var(--text-xs)",
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {item.status}
                </div>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-md)' }}>{item.icon}</div>
                <h4 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-sm)' }}>{item.title}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section" style={{ paddingBottom: 'var(--space-4xl)' }}>
        <div className="container">
          <div style={{ background: 'var(--color-dark)', color: 'white', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-4xl)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, background: 'var(--color-primary)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }} />
            <h2 style={{ color: 'white', marginBottom: 'var(--space-md)', position: 'relative', zIndex: 1 }}>Accelerate Your Commercial Journey</h2>
            <p style={{ opacity: 0.7, marginBottom: 'var(--space-2xl)', maxWidth: '600px', margin: '0 auto var(--space-2xl)', fontSize: 'var(--text-md)', position: 'relative', zIndex: 1 }}>
              Join Botswana's leading financial institutions and corporations who leverage our network for growth.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              <Link to="/contact" className="btn btn-primary btn-lg">
                <Briefcase size={18} /> Request Partner Kit <ExternalLink size={14} />
              </Link>
              <Link to="/subscribe?plan=enterprise" className="btn btn-gold btn-lg">
                <Users size={18} /> Enterprise Licensing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

