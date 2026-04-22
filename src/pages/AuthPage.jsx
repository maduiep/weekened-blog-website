import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react';

export default function AuthPage() {
  const [tab, setTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);

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
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)', opacity: 0.8 }}>
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

          {tab === 'signin' ? (
            <form onSubmit={e => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="email" className="form-input" placeholder="you@example.com" style={{ paddingLeft: 40 }} required />
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
                <input type="checkbox" />
                <span>Remember me for 30 days</span>
              </label>
              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Sign In
              </button>
              <div className="auth-footer">
                Don't have an account?{' '}
                <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit' }}>
                  Create one
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={e => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="text" className="form-input" placeholder="Your full name" style={{ paddingLeft: 40 }} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="email" className="form-input" placeholder="you@example.com" style={{ paddingLeft: 40 }} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="password" className="form-input" placeholder="Create a password" style={{ paddingLeft: 40 }} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input type="password" className="form-input" placeholder="Confirm your password" style={{ paddingLeft: 40 }} required />
                </div>
              </div>
              <label className="form-checkbox" style={{ marginBottom: 'var(--space-xl)' }}>
                <input type="checkbox" required />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>
              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Create Account
              </button>
              <div className="auth-footer">
                Already have an account?{' '}
                <button onClick={() => setTab('signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit' }}>
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
