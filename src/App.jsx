import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import SubscribePage from './pages/SubscribePage';
import EPaperPage from './pages/EPaperPage';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
import SearchPage from './pages/SearchPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <div className="app">
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
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
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
