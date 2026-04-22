import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '4px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
