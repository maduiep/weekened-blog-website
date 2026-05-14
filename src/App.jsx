import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, X } from 'lucide-react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import SubscribePage from './pages/SubscribePage';
import EPaperPage from './pages/EPaperPage';
import SolutionsPage from './pages/SolutionsPage';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
import SearchPage from './pages/SearchPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import CareersPage from './pages/CareersPage';
import TendersPage from './pages/TendersPage';
import LegalPage from './pages/LegalPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showShortcutTip, setShowShortcutTip] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      
      // / for Search
      if (key === '/') {
        e.preventDefault();
        navigate('/search');
      }
      // h for Home
      if (key === 'h' && e.altKey) {
        navigate('/');
      }
      // s for Subscribe
      if (key === 's' && e.altKey) {
        navigate('/subscribe');
      }
      // e for E-Paper
      if (key === 'e' && e.altKey) {
        navigate('/epaper');
      }
      // k to toggle shortcut help
      if (key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowShortcutTip(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="app">
      {/* Shortcut Tip Overlay */}
      <AnimatePresence>
        {showShortcutTip && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 5000, background: 'var(--color-dark)', color: 'white', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-2xl)', border: '1px solid rgba(255,255,255,0.1)', width: '280px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <h4 style={{ margin: 0, fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-gold)' }}>
                <Command size={16} /> Power User Shortcuts
              </h4>
              <button onClick={() => setShowShortcutTip(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Search Archive</span> <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>/</kbd></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Go to Home</span> <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>Alt + H</kbd></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subscribe</span> <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>Alt + S</kbd></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>E-Paper Archive</span> <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>Alt + E</kbd></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Routes>
        {/* Auth page has its own layout */}
        <Route path="/auth" element={<AuthPage />} />

        {/* All other pages use the standard layout */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/article/:id" element={<ArticlePage />} />
                  <Route path="/subscribe" element={<SubscribePage />} />
                  <Route path="/epaper" element={<EPaperPage />} />
                  <Route path="/solutions" element={<SolutionsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/tenders" element={<TendersPage />} />
                  <Route path="/privacy" element={<LegalPage />} />
                  <Route path="/terms" element={<LegalPage />} />
                  <Route path="/refund" element={<LegalPage />} />
                  <Route path="/cookies" element={<LegalPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
