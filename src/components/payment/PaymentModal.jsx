import { useState } from 'react';
import { CreditCard, Smartphone, Shield, Lock, CheckCircle, ArrowRight, X } from 'lucide-react';

export default function PaymentModal({ plan, onClose }) {
  const [tab, setTab] = useState('dpo');
  const [step, setStep] = useState('form'); // form | otp | processing | success
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    phone: '',
    otp: '',
    agreeTerms: false,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'orange' && step === 'form') {
      setStep('otp');
      return;
    }
    setStep('processing');
    setTimeout(() => setStep('success'), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Complete Your Purchase</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>

        <div className="modal-body">
          {step === 'success' ? (
            <div className="payment-success">
              <div className="payment-success-icon">
                <CheckCircle />
              </div>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Payment Successful!</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                Your {plan.name} has been activated. {plan.period ? 'Enjoy unlimited access!' : 'Your download will start shortly.'}
              </p>
              <div className="order-summary">
                <div className="order-summary-row" style={{ fontWeight: 700 }}>
                  <span>Amount Paid</span>
                  <span>{plan.currency}{plan.price}.00</span>
                </div>
                <div className="order-summary-row">
                  <span>Payment Method</span>
                  <span>{tab === 'dpo' ? 'DPO Pay' : 'Orange Money'}</span>
                </div>
                <div className="order-summary-row">
                  <span>Transaction ID</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                    TXN-{Date.now().toString(36).toUpperCase()}
                  </span>
                </div>
              </div>
              <button className="btn btn-primary btn-block" onClick={onClose}>
                Done
              </button>
            </div>
          ) : step === 'processing' ? (
            <div className="payment-success" style={{ padding: 'var(--space-3xl)' }}>
              <div style={{
                width: 60, height: 60, border: '4px solid var(--color-border)',
                borderTopColor: 'var(--color-primary)', borderRadius: '50%',
                animation: 'spin 1s linear infinite', margin: '0 auto var(--space-xl)'
              }} />
              <h3 style={{ marginBottom: 'var(--space-sm)' }}>Processing Payment...</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Please do not close this window.</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div className="order-summary">
                <div className="order-summary-title">Order Summary</div>
                <div className="order-summary-row">
                  <span>{plan.name}</span>
                  <span>{plan.currency}{plan.price}.00{plan.period}</span>
                </div>
                <div className="order-summary-row order-summary-total">
                  <span>Total</span>
                  <span>{plan.currency}{plan.price}.00</span>
                </div>
              </div>

              {/* Payment Tabs */}
              <div className="payment-tabs">
                <button
                  className={`payment-tab ${tab === 'dpo' ? 'active' : ''}`}
                  onClick={() => { setTab('dpo'); setStep('form'); }}
                >
                  <CreditCard size={18} />
                  DPO Pay
                </button>
                <button
                  className={`payment-tab ${tab === 'orange' ? 'active' : ''}`}
                  onClick={() => { setTab('orange'); setStep('form'); }}
                >
                  <Smartphone size={18} />
                  Orange Money
                </button>
              </div>

              {/* DPO Pay Form */}
              {tab === 'dpo' && (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Full name on card"
                      value={formData.name}
                      onChange={e => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={e => handleChange('cardNumber', e.target.value)}
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={e => handleChange('expiry', e.target.value)}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={e => handleChange('cvv', e.target.value)}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                  <label className="form-checkbox" style={{ marginBottom: 'var(--space-xl)' }}>
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={e => handleChange('agreeTerms', e.target.checked)}
                      required
                    />
                    <span>I agree to the Terms of Service and Privacy Policy</span>
                  </label>
                  <button type="submit" className="btn btn-primary btn-lg btn-block">
                    <Lock size={16} /> Pay {plan.currency}{plan.price}.00
                  </button>
                </form>
              )}

              {/* Orange Money Form */}
              {tab === 'orange' && step === 'form' && (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Orange Money Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+267 7X XXX XXX"
                      value={formData.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                    A one-time password (OTP) will be sent to your Orange Money registered number to confirm this transaction.
                  </p>
                  <label className="form-checkbox" style={{ marginBottom: 'var(--space-xl)' }}>
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={e => handleChange('agreeTerms', e.target.checked)}
                      required
                    />
                    <span>I agree to the Terms of Service and Privacy Policy</span>
                  </label>
                  <button type="submit" className="btn btn-primary btn-lg btn-block">
                    Send OTP <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {/* Orange Money OTP */}
              {tab === 'orange' && step === 'otp' && (
                <form onSubmit={handleSubmit}>
                  <div style={{
                    textAlign: 'center',
                    padding: 'var(--space-lg) 0',
                    marginBottom: 'var(--space-lg)',
                    borderBottom: '1px solid var(--color-border)'
                  }}>
                    <Smartphone size={32} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }} />
                    <p style={{ fontWeight: 600 }}>OTP Sent Successfully</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                      Enter the 6-digit code sent to {formData.phone || '+267 7X XXX XXX'}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Enter OTP Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={e => handleChange('otp', e.target.value)}
                      maxLength={6}
                      style={{ textAlign: 'center', fontSize: 'var(--text-xl)', letterSpacing: '8px', fontFamily: 'var(--font-mono)' }}
                      required
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg btn-block">
                    <Lock size={16} /> Confirm & Pay {plan.currency}{plan.price}.00
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-block"
                    style={{ marginTop: 'var(--space-md)' }}
                    onClick={() => setStep('form')}
                  >
                    Resend OTP
                  </button>
                </form>
              )}

              {/* Trust Indicators */}
              <div className="trust-indicators" style={{ marginTop: 'var(--space-lg)' }}>
                <span className="trust-indicator">
                  <Shield size={14} /> Secure Payment
                </span>
                <span className="trust-indicator">
                  <Lock size={14} /> SSL Encrypted
                </span>
                <span className="trust-indicator">
                  <CheckCircle size={14} /> PCI Compliant
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
