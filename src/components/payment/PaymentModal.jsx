import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Shield, Lock, CheckCircle, ArrowRight, X, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PAYMENT_METHODS = {
  orange: {
    id: 'orange',
    name: 'Orange Money',
    desc: 'Botswana\'s #1 mobile wallet — 78% market share',
    icon: <img src="/orange-money.png" alt="Orange Money" style={{ width: 24, height: 24, borderRadius: '50%' }} />,
    color: '#FF6600',
    bg: 'rgba(255,102,0,0.08)',
    placeholder: '+267 7X XXX XXX',
    otpLabel: 'Orange Money PIN',
    otpHint: 'Enter your 4-digit Orange Money PIN to authorise this payment.',
  },
  myzaka: {
    id: 'myzaka',
    name: 'MyZaka (Mascom)',
    desc: 'Mascom\'s mobile wallet — pay from any network',
    icon: <img src="/myzaka.png" alt="MyZaka" style={{ width: 24, height: 24, borderRadius: '20%' }} />,
    color: '#7B2D8B',
    bg: 'rgba(123,45,139,0.08)',
    placeholder: '+267 7X XXX XXX',
    otpLabel: 'MyZaka OTP',
    otpHint: 'An OTP will be sent to your Mascom-registered number.',
  },
};

export default function PaymentModal({ plan, onClose }) {
  const [tab, setTab] = useState(plan?.defaultMethod || 'orange');
  const [step, setStep] = useState('form'); // form | otp | processing | success

  // Update tab if defaultMethod changes (e.g. clicking different method cards)
  useEffect(() => {
    if (plan?.defaultMethod) setTab(plan.defaultMethod);
  }, [plan?.defaultMethod]);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const { grantSubscription, isLoggedIn } = useAuth();

  const method = PAYMENT_METHODS[tab];

  const formatPhone = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    if (digits.startsWith('267') && digits.length > 3) {
      return '+267 ' + digits.slice(3).replace(/(\d{2})(\d{3})?(\d{3})?/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(' ')
      );
    }
    return v;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) { setError('Please enter a valid Botswana phone number.'); return; }
    if (!agreeTerms) { setError('Please accept the Terms of Service.'); return; }
    setStep('otp');
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setError('');
    if (otp.length < 4) { setError('Please enter a valid code.'); return; }
    setStep('processing');
    setTimeout(() => {
      if (isLoggedIn) grantSubscription(plan.id || 'monthly');
      setStep('success');
    }, 2500);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && step !== 'processing' && onClose()}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 2 }}>Complete Payment</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                {plan.name} — {plan.currency}{plan.price}.00{plan.period || ''}
              </p>
            </div>
            {step !== 'processing' && (
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="modal-body">
            <AnimatePresence mode="wait">
              {/* ── SUCCESS ── */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  className="payment-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="payment-success-icon">
                    <CheckCircle size={40} />
                  </div>
                  <h3 style={{ marginBottom: 'var(--space-sm)' }}>Payment Successful!</h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
                    Your <strong>{plan.name}</strong> access has been activated. Enjoy unlimited reading!
                  </p>
                  <div className="order-summary">
                    <div className="order-summary-row" style={{ fontWeight: 700 }}>
                      <span>Amount Paid</span>
                      <span>{plan.currency}{plan.price}.00</span>
                    </div>
                    <div className="order-summary-row">
                      <span>Method</span>
                      <span>{method.name}</span>
                    </div>
                    <div className="order-summary-row">
                      <span>Reference</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                        WP-{Date.now().toString(36).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-block btn-lg" onClick={onClose}>
                    Start Reading
                  </button>
                </motion.div>
              )}

              {/* ── PROCESSING ── */}
              {step === 'processing' && (
                <motion.div
                  key="processing"
                  className="payment-success"
                  style={{ padding: 'var(--space-3xl) var(--space-xl)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div style={{
                    width: 64, height: 64,
                    border: '5px solid var(--color-border)',
                    borderTopColor: method.color,
                    borderRadius: '50%',
                    animation: 'spin 0.9s linear infinite',
                    margin: '0 auto var(--space-xl)',
                  }} />
                  <h3 style={{ marginBottom: 'var(--space-sm)' }}>Processing…</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    Confirming your {method.name} payment. Do not close this window.
                  </p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </motion.div>
              )}

              {/* ── FORM / OTP ── */}
              {(step === 'form' || step === 'otp') && (
                <motion.div key="form-otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Order Summary */}
                  <div className="order-summary">
                    <div className="order-summary-title">Order Summary</div>
                    <div className="order-summary-row">
                      <span>{plan.name}</span>
                      <span>{plan.currency}{plan.price}.00{plan.period || ''}</span>
                    </div>
                    <div className="order-summary-row order-summary-total">
                      <span>Total</span>
                      <span>{plan.currency}{plan.price}.00</span>
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="payment-tabs">
                    {Object.values(PAYMENT_METHODS).map(m => (
                      <button
                        key={m.id}
                        className={`payment-tab ${tab === m.id ? 'active' : ''}`}
                        style={tab === m.id ? { background: m.color, borderColor: m.color } : {}}
                        onClick={() => { setTab(m.id); setStep('form'); setOtp(''); setError(''); }}
                        type="button"
                      >
                        <span style={{ fontSize: '1.1rem' }}>{m.icon}</span>
                        <span className="payment-tab-name">{m.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Method Card */}
                  <div className="payment-method-info" style={{ background: method.bg, borderColor: method.color + '33' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                      <span style={{ fontSize: '1.3rem' }}>{method.icon}</span>
                      <strong style={{ color: method.color }}>{method.name}</strong>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>{method.desc}</p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="payment-error">
                      {error}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {step === 'form' ? (
                      <motion.form
                        key="phone-form"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onSubmit={handleSendOtp}
                      >
                        <div className="form-group">
                          <label className="form-label">
                            <Phone size={14} style={{ display: 'inline', marginRight: 4 }} />
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            className="form-input"
                            placeholder={method.placeholder}
                            value={phone}
                            onChange={e => setPhone(formatPhone(e.target.value))}
                            required
                          />
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 6 }}>
                            Enter the number registered with {method.name}
                          </p>
                        </div>
                        <label className="form-checkbox" style={{ marginBottom: 'var(--space-xl)' }}>
                          <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
                          <span>I agree to the <a href="#" style={{ color: 'var(--color-primary)' }}>Terms of Service</a> and authorise this payment</span>
                        </label>
                        <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ background: method.color, borderColor: method.color }}>
                          Send {tab === 'orange' ? 'Payment Request' : 'OTP'} <ArrowRight size={16} />
                        </button>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="otp-form"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onSubmit={handleConfirmPayment}
                      >
                        <div style={{
                          textAlign: 'center',
                          padding: 'var(--space-lg)',
                          background: method.bg,
                          borderRadius: 'var(--radius-md)',
                          marginBottom: 'var(--space-lg)',
                        }}>
                          <Smartphone size={28} style={{ color: method.color, marginBottom: 6 }} />
                          <p style={{ fontWeight: 700, marginBottom: 4 }}>
                            {tab === 'orange' ? 'Check your phone' : 'OTP Sent!'}
                          </p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            {method.otpHint}
                          </p>
                          <p style={{ fontSize: 'var(--text-xs)', color: method.color, fontWeight: 600, marginTop: 6 }}>
                            {phone}
                          </p>
                        </div>
                        <div className="form-group">
                          <label className="form-label">{method.otpLabel}</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder={tab === 'orange' ? '● ● ● ●' : '● ● ● ● ● ●'}
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, tab === 'orange' ? 4 : 6))}
                            style={{ textAlign: 'center', fontSize: 'var(--text-2xl)', letterSpacing: '10px', fontFamily: 'var(--font-mono)' }}
                            autoFocus
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-lg btn-block" style={{ background: method.color, color: '#fff', border: 'none' }}>
                          <Lock size={16} /> Confirm & Pay {plan.currency}{plan.price}.00
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-block"
                          style={{ marginTop: 'var(--space-md)' }}
                          onClick={() => { setStep('form'); setOtp(''); setError(''); }}
                        >
                          ← Change number
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Trust badges */}
                  <div className="trust-indicators" style={{ marginTop: 'var(--space-lg)' }}>
                    <span className="trust-indicator"><Shield size={13} /> Secure</span>
                    <span className="trust-indicator"><Lock size={13} /> Encrypted</span>
                    <span className="trust-indicator"><CheckCircle size={13} /> Verified</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
