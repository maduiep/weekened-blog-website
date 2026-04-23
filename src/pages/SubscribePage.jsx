import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Star, HelpCircle, ChevronDown, ChevronUp, Smartphone, CreditCard } from 'lucide-react';
import PaymentModal from '../components/payment/PaymentModal';
import { subscriptionPlans } from '../data/articles';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SubscribePage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const { isLoggedIn, isSubscribed } = useAuth();
  const navigate = useNavigate();

  const faqs = [
    { q: 'Can I cancel my subscription at any time?', a: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.' },
    { q: 'What payment methods are accepted?', a: 'We accept Orange Money (Botswana\'s #1 mobile wallet) and MyZaka by Mascom. Both methods are secure and widely used across Botswana.' },
    { q: 'Do I get access to E-Papers with my subscription?', a: 'Monthly and Annual subscribers get full access to all E-Paper editions. Weekly subscribers can upgrade anytime to access E-Papers.' },
    { q: 'Can I share my subscription?', a: 'Each subscription is for individual use. We offer group and corporate subscriptions — contact us at editor@weekendpost.co.bw for details.' },
    { q: 'How do I download E-books?', a: 'Annual subscribers can download E-books directly from the E-Paper section. After a successful payment, the PDF will be saved to your device automatically.' },
  ];

  const handlePlanClick = (plan) => {
    if (!isLoggedIn) {
      const authUrl = redirect ? `/auth?tab=signup&redirect=${encodeURIComponent(redirect)}` : '/auth?tab=signup';
      navigate(authUrl);
      return;
    }
    setSelectedPlan(plan);
  };

  return (
    <>
      {/* Hero */}
      <section className="subscribe-hero">
        <div className="container">
          <motion.span className="badge badge-default" style={{ marginBottom: 'var(--space-lg)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Premium Access
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Choose Your Plan
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {isSubscribed
              ? "You're already subscribed! Enjoy unlimited access to all Weekend Post content."
              : "Unlock unlimited access to Botswana's most trusted journalism. Get breaking news, in-depth analysis, E-Papers, and exclusive content."
            }
          </motion.p>
          {isSubscribed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <span className="badge badge-default" style={{ background: 'var(--color-sport-green)', marginTop: 'var(--space-md)' }}>
                ✓ Active Subscriber
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: 'var(--space-xl) 0 var(--space-3xl)' }}>
        <div className="container">
          <div className="pricing-grid">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={!plan.popular ? { y: -8, transition: { duration: 0.2 } } : {}}
              >
                {plan.popular && <span className="pricing-badge">Most Popular</span>}
                <div className="pricing-name">{plan.name}</div>
                <div className="pricing-amount">
                  <span className="currency">{plan.currency}</span>
                  {plan.price}
                </div>
                <div className="pricing-period">{plan.period}</div>
                <div className="pricing-features">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="pricing-feature">
                      <Check size={18} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                {isSubscribed ? (
                  <div className="btn btn-block" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', border: '2px solid var(--color-border)', textAlign: 'center', padding: '10px' }}>
                    Already Subscribed
                  </div>
                ) : (
                  <button
                    className={`btn btn-block btn-lg ${plan.popular ? 'btn-gold' : 'btn-primary'}`}
                    onClick={() => handlePlanClick(plan)}
                  >
                    {isLoggedIn ? 'Subscribe Now' : 'Get Started'}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
          {!isLoggedIn && (
            <motion.p
              style={{ textAlign: 'center', marginTop: 'var(--space-xl)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              You'll be asked to create a free account before completing payment.
            </motion.p>
          )}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="payment-methods-section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <motion.h3 className="payment-methods-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Accepted Payment Methods
          </motion.h3>
          <div className="payment-methods-grid">
            <motion.div 
              className="payment-method-card" 
              whileHover={{ scale: 1.04 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!isLoggedIn) {
                  const authUrl = redirect ? `/auth?tab=signup&redirect=${encodeURIComponent(redirect)}` : '/auth?tab=signup';
                  navigate(authUrl);
                  return;
                }
                const monthlyPlan = subscriptionPlans.find(p => p.id === 'monthly');
                setSelectedPlan({ ...monthlyPlan, defaultMethod: 'orange' });
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="payment-method-icon" style={{ background: 'rgba(255,102,0,0.1)', color: '#FF6600', fontSize: '2rem' }}><img src="/orange-money.png" alt="Orange Money" style={{ width: 48, height: 48, borderRadius: '50%' }} /></div>
              <div className="payment-method-name">Orange Money</div>
              <div className="payment-method-desc">Botswana's #1 mobile wallet — 78% market share</div>
            </motion.div>
            <motion.div 
              className="payment-method-card" 
              whileHover={{ scale: 1.04 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!isLoggedIn) {
                  const authUrl = redirect ? `/auth?tab=signup&redirect=${encodeURIComponent(redirect)}` : '/auth?tab=signup';
                  navigate(authUrl);
                  return;
                }
                const monthlyPlan = subscriptionPlans.find(p => p.id === 'monthly');
                setSelectedPlan({ ...monthlyPlan, defaultMethod: 'myzaka' });
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="payment-method-icon" style={{ background: 'rgba(123,45,139,0.1)', color: '#7B2D8B', fontSize: '2rem' }}><img src="/myzaka.png" alt="MyZaka" style={{ width: 48, height: 48, borderRadius: '20%' }} /></div>
              <div className="payment-method-name">MyZaka (Mascom)</div>
              <div className="payment-method-desc">Mascom mobile wallet — pay from any network</div>
            </motion.div>
          </div>
          <motion.div className="trust-indicators" style={{ marginTop: 'var(--space-xl)' }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="trust-indicator"><Shield size={14} /> 256-bit SSL Encryption</span>
            <span className="trust-indicator"><Check size={14} /> PCI DSS Compliant</span>
            <span className="trust-indicator"><Star size={14} /> Trusted by 10,000+ readers</span>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header" style={{ justifyContent: 'center', borderBottom: 'none' }}>
            <h2 className="section-title">What Our Readers Say</h2>
          </div>
          <div className="grid-2" style={{ gap: 'var(--space-xl)' }}>
            {[
              { name: 'Tebogo M.', text: 'Weekend Post keeps me informed about everything happening in Botswana. The E-paper feature is incredibly convenient.', role: 'Business Owner, Gaborone' },
              { name: 'Naledi K.', text: 'Finally a Botswana news source I can trust with in-depth reporting. The annual subscription is great value.', role: 'Teacher, Francistown' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{ padding: 'var(--space-xl)', background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', borderLeft: '4px solid var(--color-gold)' }}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: 'var(--space-md)', color: 'var(--color-gold)' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', fontSize: 'var(--text-md)' }}>
                  "{t.text}"
                </p>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{t.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="section-header" style={{ justifyContent: 'center', borderBottom: 'none' }}>
            <h2 className="section-title">
              <HelpCircle size={24} style={{ color: 'var(--color-primary)' }} />
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-lg)', fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--color-dark)', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 var(--space-lg) var(--space-lg)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.8 }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          redirect={redirect}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </>
  );
}
