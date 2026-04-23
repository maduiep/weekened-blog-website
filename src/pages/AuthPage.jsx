import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sign in form
  const [signInData, setSignInData] = useState({ email: '', password: '', remember: false });
  // Sign up form
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', confirm: '', agree: false });

  const { login, signup, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [tab]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(signInData.email, signInData.password);
      navigate(redirect || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (signUpData.password !== signUpData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(signUpData.name, signUpData.email, signUpData.password);
      setSuccess('Account created! Redirecting…');
      const subUrl = redirect ? `/subscribe?redirect=${encodeURIComponent(redirect)}` : '/subscribe';
      setTimeout(() => navigate(subUrl), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Visual Side */}
      <div className="auth-visual">
        <div className="auth-visual-content">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2>Weekend<span style={{ color: 'var(--color-primary)' }}>Post</span></h2>
          </Link>
          <p>
            Botswana's most trusted source for news, business insights, and independent journalism since 1989.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-2xl)',
            textAlign: 'left',
            maxWidth: '320px',
          }}>
            {[
              'Unlimited access to all articles',
              'Downloadable E-Paper editions',
              'Exclusive content & analysis',
              'Bookmarks & reading history',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)', opacity: 0.85 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-container">
        <div className="auth-form">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
              onClick={() => setTab('signin')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => setTab('signup')}
            >
              Create Account
            </button>
          </div>

          {/* Error / Success */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="auth-alert auth-alert-error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                className="auth-alert auth-alert-success"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle size={16} /> {success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {tab === 'signin' ? (
              <motion.form
                key="signin"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                onSubmit={handleSignIn}
              >
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      style={{ paddingLeft: 40 }}
                      value={signInData.email}
                      onChange={e => setSignInData(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Password
                    <a href="#" style={{ fontSize: 'var(--text-xs)', fontWeight: 400 }}>Forgot password?</a>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter your password"
                      style={{ paddingLeft: 40, paddingRight: 44 }}
                      value={signInData.password}
                      onChange={e => setSignInData(p => ({ ...p, password: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <label className="form-checkbox" style={{ marginBottom: 'var(--space-xl)' }}>
                  <input type="checkbox" checked={signInData.remember} onChange={e => setSignInData(p => ({ ...p, remember: e.target.checked }))} />
                  <span>Remember me for 30 days</span>
                </label>
                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>

                {/* Demo hint */}
                <div className="demo-hint">
                  <strong>Demo Admin:</strong> admin@weekendpost.co.bw / Admin@1234
                </div>

                <div className="auth-footer">
                  Don't have an account?{' '}
                  <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit' }}>
                    Create one
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                onSubmit={handleSignUp}
              >
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your full name"
                      style={{ paddingLeft: 40 }}
                      value={signUpData.name}
                      onChange={e => setSignUpData(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      style={{ paddingLeft: 40 }}
                      value={signUpData.email}
                      onChange={e => setSignUpData(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Create a password (min 6 chars)"
                      style={{ paddingLeft: 40, paddingRight: 44 }}
                      value={signUpData.password}
                      onChange={e => setSignUpData(p => ({ ...p, password: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Confirm your password"
                      style={{ paddingLeft: 40 }}
                      value={signUpData.confirm}
                      onChange={e => setSignUpData(p => ({ ...p, confirm: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <label className="form-checkbox" style={{ marginBottom: 'var(--space-xl)' }}>
                  <input
                    type="checkbox"
                    checked={signUpData.agree}
                    onChange={e => setSignUpData(p => ({ ...p, agree: e.target.checked }))}
                    required
                  />
                  <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
                </label>
                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
                <div className="auth-footer">
                  Already have an account?{' '}
                  <button onClick={() => setTab('signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit' }}>
                    Sign in
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
