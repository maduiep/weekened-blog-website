import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Shield, Lock, CheckCircle, ArrowRight, X, Phone, Info, Upload, Landmark, AlertCircle, Copy, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PAYMENT_METHODS = {
  flutterwave: {
    id: 'flutterwave',
    name: 'Flutterwave',
    desc: 'Instant online payment via Cards, Bank Transfer & Mobile Money',
    icon: <img src="/flutterwave.png" alt="Flutterwave" style={{ width: 24, height: 24, borderRadius: '4px' }} />,
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.08)',
    placeholder: 'Card Number or Mobile Number',
    otpLabel: 'Verification Code',
    otpHint: 'An OTP will be sent to your registered device for authorisation.',
  },
  direct: {
    id: 'direct',
    name: 'Direct Deposit',
    desc: 'Pay via Bank Transfer / EFT — Manual verification required',
    icon: <Landmark size={22} />,
    color: '#007E97',
    bg: 'rgba(0,126,151,0.08)',
    bankInfo: {
      bank: 'First National Bank (FNB)',
      accName: 'Weekend Post (Pty) Ltd',
      accNum: '6288 4567 123',
      branch: '281467 (Main Branch)',
      ref: 'WP-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    }
  },
};

export default function PaymentModal({ plan, onClose, redirect }) {
  const [tab, setTab] = useState(plan?.defaultMethod || 'flutterwave');
  const [step, setStep] = useState('form'); // form | otp | processing | success | upload
  const [demoSms, setDemoSms] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { grantSubscription, isLoggedIn } = useAuth();

  useEffect(() => {
    if (plan?.defaultMethod) setTab(plan.defaultMethod);
  }, [plan?.defaultMethod]);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  
  const isArticle = redirect && redirect.startsWith('/article/');
  const successRedirect = redirect || '/article/1';

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'flutterwave') {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10) { setError('Please enter a valid Botswana phone number.'); return; }
    }
    if (!agreeTerms) { setError('Please accept the Terms of Service.'); return; }
    
    if (tab === 'direct') {
      setStep('upload');
    } else {
      setStep('otp');
      setTimeout(() => setDemoSms(true), 1500);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
    }
  };

  const handleSubmitProof = () => {
    if (!proofFile) { setError('Please upload a proof of payment.'); return; }
    setUploading(true);
    setTimeout(() => {
      setStep('processing');
      setUploading(false);
      setTimeout(() => {
        if (isLoggedIn) grantSubscription(plan.id || 'monthly');
        setStep('success');
      }, 2000);
    }, 1500);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) { setError(`Please enter a valid 6-digit code.`); return; }
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
                  WP-Payment: Use code <strong style={{ color: 'var(--color-dark)' }}>123456</strong> to authorise your {plan.name} subscription.
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
                    {tab === 'direct' ? 'Verification Pending' : 'Subscription Active'}
                  </div>
                  
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-sm)' }}>
                    {tab === 'direct' 
                      ? 'Your proof of payment has been uploaded. Our team will verify it shortly and activate your access.'
                      : `Your ${plan.name} access has been activated. You now have unlimited access to all premium content and E-Papers.`
                    }
                  </p>

                  <div className="payment-receipt">
                    <div className="payment-receipt-header">
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

                  <div className="payment-success-actions">
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/dashboard')}>
                      Go to Dashboard
                    </button>
                    <button className="btn btn-gold btn-lg btn-block" onClick={() => { onClose(); navigate(successRedirect); }}>
                      {isArticle ? 'Continue Reading' : 'Start Reading'}
                    </button>
                  </div>
                </motion.div>
              )}

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

              {(step === 'form' || step === 'otp' || step === 'upload') && (
                <motion.div key="main-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

                  {step === 'form' && (
                    <div className="payment-tabs" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      {Object.values(PAYMENT_METHODS).map(m => (
                        <button
                          key={m.id}
                          className={`payment-tab ${tab === m.id ? 'active' : ''}`}
                          style={{
                            ...(tab === m.id ? { background: m.color, borderColor: m.color } : {}),
                            position: 'relative'
                          }}
                          onClick={() => { setTab(m.id); setStep('form'); setError(''); setProofFile(null); }}
                          type="button"
                        >
                          <span style={{ fontSize: '1.1rem' }}>{m.icon}</span>
                          <span className="payment-tab-name">{m.name}</span>
                          {m.id === 'direct' && (
                            <div style={{ 
                              position: 'absolute', 
                              top: 6, 
                              right: 6, 
                              opacity: tab === m.id ? 1 : 0.5,
                              background: tab === m.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                              borderRadius: '50%',
                              padding: '2px'
                            }}>
                              <Info size={10} color={tab === m.id ? '#fff' : m.color} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="payment-method-info" style={{ background: method.bg, borderColor: method.color + '33' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                      <span style={{ fontSize: '1.3rem' }}>{method.icon}</span>
                      <strong style={{ color: method.color }}>{method.name}</strong>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>{method.desc}</p>
                  </div>

                  {error && <div className="payment-error">{error}</div>}

                  <AnimatePresence mode="wait">
                    {step === 'form' && (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onSubmit={handleSendOtp}
                      >
                        {tab === 'flutterwave' ? (
                          <div className="form-group">
                            <label className="form-label"><Phone size={14} style={{ display: 'inline', marginRight: 4 }} /> Mobile Number</label>
                            <input
                              type="tel"
                              className="form-input"
                              placeholder={method.placeholder}
                              value={phone}
                              onChange={e => setPhone(formatPhone(e.target.value))}
                              required
                            />
                          </div>
                        ) : (
                          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: method.color, marginBottom: '12px' }}>
                              <Info size={18} />
                              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Payment Instructions</span>
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span>Bank:</span> <strong>{method.bankInfo.bank}</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span>Account:</span> <strong>{method.bankInfo.accNum}</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span>Branch:</span> <strong>{method.bankInfo.branch}</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: '4px', background: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '4px' }}>
                                <span>Reference:</span> 
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <strong style={{ color: 'var(--color-dark)' }}>{method.bankInfo.ref}</strong>
                                  <button type="button" onClick={() => copyToClipboard(method.bankInfo.ref)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: method.color }}><Copy size={12} /></button>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <label className="form-checkbox" style={{ marginBottom: 'var(--space-xl)' }}>
                          <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
                          <span>I agree to the <a href="#" style={{ color: 'var(--color-primary)' }}>Terms of Service</a></span>
                        </label>
                        
                        <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ background: method.color, borderColor: method.color }}>
                          {tab === 'direct' ? 'I Have Made the Payment' : 'Proceed to Payment'} <ArrowRight size={16} />
                        </button>
                      </motion.form>
                    )}

                    {step === 'otp' && (
                      <motion.form
                        key="otp"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onSubmit={handleConfirmPayment}
                      >
                        <div style={{ textAlign: 'center', padding: 'var(--space-lg)', background: method.bg, borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                          <Smartphone size={28} style={{ color: method.color, marginBottom: 6 }} />
                          <p style={{ fontWeight: 700, marginBottom: 4 }}>OTP Sent!</p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>{method.otpHint}</p>
                          <p style={{ fontSize: 'var(--text-xs)', color: method.color, fontWeight: 600, marginTop: 6 }}>{phone}</p>
                        </div>
                        <div className="form-group">
                          <label className="form-label">{method.otpLabel}</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="● ● ● ● ● ●"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            style={{ textAlign: 'center', fontSize: 'var(--text-2xl)', letterSpacing: '10px', fontFamily: 'var(--font-mono)' }}
                            autoFocus
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-lg btn-block" style={{ background: method.color, color: '#fff', border: 'none' }}>
                          <Lock size={16} /> Confirm Payment
                        </button>
                        <button type="button" className="btn btn-ghost btn-block" onClick={() => setStep('form')} style={{ marginTop: 'var(--space-md)' }}>
                          ← Go back
                        </button>
                      </motion.form>
                    )}

                    {step === 'upload' && (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ textAlign: 'center' }}
                      >
                        <div style={{ padding: 'var(--space-xl)', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', background: '#fafafa', cursor: 'pointer', marginBottom: 'var(--space-lg)' }} onClick={() => fileInputRef.current.click()}>
                          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*,.pdf" />
                          {proofFile ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <FileText size={40} style={{ color: method.color, marginBottom: '12px' }} />
                              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-dark)' }}>{proofFile.name}</strong>
                              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{(proofFile.size / 1024).toFixed(1)} KB</span>
                              <button type="button" onClick={(e) => { e.stopPropagation(); setProofFile(null); }} style={{ marginTop: '12px', fontSize: 'var(--text-xs)', color: 'var(--color-news-red)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove file</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <Upload size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }} />
                              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-dark)' }}>Upload Proof of Payment</strong>
                              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Click to select a photo of your receipt or PDF</p>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(0,126,151,0.05)', borderRadius: '8px', marginBottom: 'var(--space-xl)', textAlign: 'left' }}>
                          <AlertCircle size={16} style={{ color: method.color, flexShrink: 0 }} />
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Please ensure the <strong>Reference</strong> is visible on your proof.
                          </p>
                        </div>

                        <button className="btn btn-primary btn-lg btn-block" disabled={!proofFile || uploading} onClick={handleSubmitProof} style={{ background: method.color, borderColor: method.color }}>
                          {uploading ? 'Uploading...' : 'Submit for Verification'}
                        </button>
                        <button type="button" className="btn btn-ghost btn-block" onClick={() => setStep('form')} style={{ marginTop: 'var(--space-md)' }}>
                          ← View Instructions
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
