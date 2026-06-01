import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Zap, LogOut, Shield, Briefcase } from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from '../ui/SocialIcons';
import { articles } from '../../data/articles';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.user-menu-wrapper')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'News', path: '/category/news' },
    { label: 'Business', path: '/category/business' },
    { label: 'Sport', path: '/category/sport' },
    { label: 'Opinions', path: '/category/opinion' },
    { label: 'Weekend Life', path: '/category/lifestyle' },
    { label: 'E-Paper', path: '/epaper' },
    { label: 'Solutions', path: '/solutions' },
  ];

  const breakingNews = articles.slice(0, 4);
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Breaking News Ticker */}
      <div className="breaking-news-ticker">
        <div className="ticker-label">
          <Zap size={14} />
          Breaking
        </div>
        <div style={{ flex: 1, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}>
          <div className="ticker-content">
            {[...breakingNews, ...breakingNews].map((article, i) => (
              <span className="ticker-item" key={i}>
                <span className="ticker-dot" />
                <Link to={`/article/${article.id}`}>{article.title}</Link>
              </span>
            ))}
          </div>
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

              {isLoggedIn ? (
                <div className="user-menu-wrapper">
                  <button
                    className="user-avatar-btn"
                    onClick={() => setUserMenuOpen(v => !v)}
                    aria-label="Account menu"
                  >
                    <div className="user-avatar-circle">
                      {user?.avatar || user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="user-name-label">{user?.name?.split(' ')[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-name">{user?.name}</div>
                        <div className="user-dropdown-email">{user?.email}</div>
                        {user?.isSubscribed && (
                          <span className="user-sub-badge">
                            ✓ {user.subscriptionPlan?.charAt(0).toUpperCase() + user.subscriptionPlan?.slice(1)} Subscriber
                          </span>
                        )}
                      </div>
                      <div className="user-dropdown-divider" />
                      {!isAdmin ? (
                        <>
                          <Link to="/dashboard" className="user-dropdown-item">
                            <User size={15} /> My Account
                          </Link>
                          {!user?.isSubscribed && (
                            <Link to="/subscribe" className="user-dropdown-item" style={{ color: 'var(--color-primary)' }}>
                              ⭐ Subscribe Now
                            </Link>
                          )}
                        </>
                      ) : (
                        <Link to="/admin" className="user-dropdown-item" style={{ color: 'var(--color-opinion-purple)' }}>
                          <Shield size={15} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="user-dropdown-divider" />
                      <button className="user-dropdown-item user-dropdown-logout" onClick={handleLogout}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/subscribe" className="btn btn-primary btn-sm">Subscribe</Link>
                  <Link to="/auth" className="btn btn-ghost btn-sm">
                    <User size={14} /> Sign In
                  </Link>
                </>
              )}
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
              {/* Mobile-only auth links */}
              {!isLoggedIn ? (
                <div className="mobile-auth-links" style={{ marginTop: 'var(--space-xl)', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <Link to="/auth" className="btn btn-ghost btn-block">Sign In</Link>
                  <Link to="/subscribe" className="btn btn-primary btn-block">Subscribe Now</Link>
                </div>
              ) : (
                <div className="mobile-auth-links" style={{ marginTop: 'var(--space-xl)' }}>
                  <button className="btn btn-ghost btn-block" onClick={handleLogout}>Sign Out</button>
                </div>
              )}
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
