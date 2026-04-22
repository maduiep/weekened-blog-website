import { useState } from 'react';
import { Check, CreditCard, Smartphone, Star, Shield, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import PaymentModal from '../components/payment/PaymentModal';
import { subscriptionPlans } from '../data/articles';

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const faqs = [
    {
      q: 'Can I cancel my subscription at any time?',
      a: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.'
    },
    {
      q: 'What payment methods are accepted?',
      a: 'We accept credit and debit cards via DPO Pay, and Orange Money for mobile payments. Both methods are secure and widely used in Botswana.'
    },
    {
      q: 'Do I get access to E-Papers with my subscription?',
      a: 'Monthly and Annual subscribers get full access to all E-Paper editions. Weekly subscribers can upgrade anytime to access E-Papers.'
    },
    {
      q: 'Can I share my subscription?',
      a: 'Each subscription is for individual use. We offer group and corporate subscriptions — contact us at editor@weekendpost.co.bw for details.'
    },
    {
      q: 'How do I download E-books?',
      a: 'Annual subscribers can download E-books directly from the E-Paper section. After a successful payment, the PDF will be saved to your device automatically.'
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* Hero */}
      <section className="subscribe-hero">
        <div className="container">
          <span className="badge badge-default" style={{ marginBottom: 'var(--space-lg)' }}>Premium Access</span>
          <h1>Choose Your Plan</h1>
          <p>
            Unlock unlimited access to Botswana's most trusted journalism. 
            Get breaking news, in-depth analysis, E-Papers, and exclusive content.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: 'var(--space-xl) 0 var(--space-3xl)' }}>
        <div className="container">
          <div className="pricing-grid">
            {subscriptionPlans.map(plan => (
              <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
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
                <button
                  className={`btn btn-block btn-lg ${plan.popular ? 'btn-gold' : 'btn-primary'}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Subscribe Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accepted Payment Methods */}
      <section className="payment-methods-section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <h3 className="payment-methods-title">Accepted Payment Methods</h3>
          <div className="payment-methods-grid">
            <div className="payment-method-card">
              <div className="payment-method-icon" style={{ background: 'rgba(0, 126, 151, 0.1)', color: 'var(--color-primary)' }}>
                <CreditCard size={28} />
              </div>
              <div className="payment-method-name">DPO Pay</div>
              <div className="payment-method-desc">Credit & Debit Cards</div>
            </div>
            <div className="payment-method-card">
              <div className="payment-method-icon" style={{ background: 'rgba(255, 121, 0, 0.1)', color: '#FF7900' }}>
                <Smartphone size={28} />
              </div>
              <div className="payment-method-name">Orange Money</div>
              <div className="payment-method-desc">Mobile Money</div>
            </div>
          </div>
          <div className="trust-indicators" style={{ marginTop: 'var(--space-xl)' }}>
            <span className="trust-indicator"><Shield size={14} /> 256-bit SSL Encryption</span>
            <span className="trust-indicator"><Check size={14} /> PCI DSS Compliant</span>
            <span className="trust-indicator"><Star size={14} /> Trusted by 10,000+ readers</span>
          </div>
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
              <div key={i} style={{
                padding: 'var(--space-xl)',
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-xl)',
                borderLeft: '4px solid var(--color-gold)',
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: 'var(--space-md)', color: 'var(--color-gold)' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', fontSize: 'var(--text-md)' }}>
                  "{t.text}"
                </p>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{t.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t.role}</div>
              </div>
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
              <div key={i} style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-lg)',
                    fontWeight: 600,
                    fontSize: 'var(--text-md)',
                    color: 'var(--color-dark)',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === i && (
                  <div style={{
                    padding: '0 var(--space-lg) var(--space-lg)',
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.8,
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </>
  );
}
