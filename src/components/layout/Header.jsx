import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Zap } from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from '../ui/SocialIcons';
import { articles } from '../../data/articles';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'News', path: '/category/news' },
    { label: 'Business', path: '/category/business' },
    { label: 'Sport', path: '/category/sport' },
    { label: 'Opinions', path: '/category/opinion' },
    { label: 'Weekend Life', path: '/category/lifestyle' },
    { label: 'E-Paper', path: '/epaper' },
  ];

  const breakingNews = articles.slice(0, 4);
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <>
      {/* Breaking News Ticker */}
      <div className="breaking-news-ticker">
        <div className="ticker-label">
          <Zap size={14} />
          Breaking
        </div>
        <div className="ticker-content">
          {[...breakingNews, ...breakingNews].map((article, i) => (
            <span className="ticker-item" key={i}>
              <span className="ticker-dot" />
              <Link to={`/article/${article.id}`}>{article.title}</Link>
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-top">
            <div className="header-brand">
              <Link to="/" className="header-logo">
                Weekend<span className="logo-accent">Post</span>
              </Link>
              <span className="header-date">{today}</span>
            </div>
            <div className="header-actions">
              <div className="header-social">
                <a href="#" aria-label="Facebook"><FacebookIcon /></a>
                <a href="#" aria-label="Twitter"><TwitterIcon /></a>
                <a href="#" aria-label="Instagram"><InstagramIcon /></a>
                <a href="#" aria-label="YouTube"><YoutubeIcon /></a>
              </div>
              <Link to="/subscribe" className="btn btn-primary btn-sm">Subscribe</Link>
              <Link to="/auth" className="btn btn-ghost btn-sm" style={{ display: 'none' }}>
                <User size={14} /> Sign In
              </Link>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">
                <User size={14} /> My Account
              </Link>
            </div>
          </div>

          <nav className="main-nav" role="navigation">
            <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="nav-right">
              <Link to="/search" className="btn btn-ghost btn-sm">
                <Search size={16} />
              </Link>
              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
