import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Shield, Lock, CheckCircle, ArrowRight, X, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const [demoSms, setDemoSms] = useState(false);
  const navigate = useNavigate();

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
    // For demo: Show simulated SMS after 2 seconds
    setTimeout(() => setDemoSms(true), 1500);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setError('');
    const requiredLength = tab === 'orange' ? 4 : 6;
    if (otp.length < requiredLength) { setError(`Please enter a valid ${requiredLength}-digit code.`); return; }
    setStep('processing');
    setDemoSms(false);
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
        {/* Demo SMS Notification */}
        <AnimatePresence>
          {demoSms && (
            <motion.div
              initial={{ y: -100, opacity: 0, x: '-50%' }}
              animate={{ y: 20, opacity: 1, x: '-50%' }}
              exit={{ y: -100, opacity: 0, x: '-50%' }}
              className="demo-sms-notification"
              style={{
                position: 'fixed',
                left: '50%',
                zIndex: 2000,
                width: '90%',
                maxWidth: '400px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              <div style={{ background: method.color, width: 40, height: 40, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Smartphone size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{method.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Now</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  WP-Payment: Use code <strong style={{ color: 'var(--color-dark)' }}>{tab === 'orange' ? '1234' : '123456'}</strong> to authorise your {plan.name} subscription.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              {/* ── SUCCESS ── (Already updated in previous step) */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  className="payment-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="payment-success-icon"
                  >
                    <CheckCircle size={48} />
                  </motion.div>
                  <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-dark)', fontSize: 'var(--text-2xl)' }}>Payment Successful!</h3>
                  <div style={{ 
                    background: 'var(--color-sport-green)', 
                    color: 'white', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 700, 
                    display: 'inline-block',
                    marginBottom: 'var(--space-lg)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Subscription Active
                  </div>
                  
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-sm)' }}>
                    Your <strong>{plan.name}</strong> access has been activated. You now have unlimited access to all premium content and E-Papers.
                  </p>

                  <div className="receipt-container" style={{ 
                    background: 'var(--color-bg)', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: 'var(--space-lg)', 
                    marginBottom: 'var(--space-xl)',
                    border: '1px dashed var(--color-border)',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-sm)' }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Receipt Details</span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>#{Date.now().toString().slice(-8)}</span>
                    </div>
                    <div className="order-summary-row" style={{ fontSize: 'var(--text-sm)', marginBottom: 8 }}>
                      <span>Plan</span>
                      <span style={{ fontWeight: 600 }}>{plan.name}</span>
                    </div>
                    <div className="order-summary-row" style={{ fontSize: 'var(--text-sm)', marginBottom: 8 }}>
                      <span>Amount Paid</span>
                      <span style={{ fontWeight: 600 }}>{plan.currency}{plan.price}.00</span>
                    </div>
                    <div className="order-summary-row" style={{ fontSize: 'var(--text-sm)', marginBottom: 8 }}>
                      <span>Payment Method</span>
                      <span style={{ fontWeight: 600 }}>{method.name}</span>
                    </div>
                    <div className="order-summary-row" style={{ fontSize: 'var(--text-sm)' }}>
                      <span>Date</span>
                      <span style={{ fontWeight: 600 }}>{new Date().toLocaleDateString('en-BW', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/dashboard')}>
                      Go to Dashboard
                    </button>
                    <button className="btn btn-gold btn-lg btn-block" onClick={onClose}>
                      Start Reading
                    </button>
                  </div>
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
                        onClick={() => { setTab(m.id); setStep('form'); setOtp(''); setError(''); setDemoSms(false); }}
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
                          position: 'relative'
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
                          
                          {!demoSms && (
                             <button 
                               type="button"
                               onClick={() => setDemoSms(true)}
                               style={{ position: 'absolute', top: 5, right: 5, fontSize: '10px', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer' }}
                             >
                               Demo: Resend SMS
                             </button>
                          )}
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
                          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 8 }}>
                            Demo Code: <strong style={{ color: method.color }}>{tab === 'orange' ? '1234' : '123456'}</strong>
                          </p>
                        </div>
                        <button type="submit" className="btn btn-lg btn-block" style={{ background: method.color, color: '#fff', border: 'none' }}>
                          <Lock size={16} /> Confirm & Pay {plan.currency}{plan.price}.00
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-block"
                          style={{ marginTop: 'var(--space-md)' }}
                          onClick={() => { setStep('form'); setOtp(''); setError(''); setDemoSms(false); }}
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
