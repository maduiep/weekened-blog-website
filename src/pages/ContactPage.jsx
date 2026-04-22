import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <div className="page-header" style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: 'center' }}>
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Contact Us</span>
          </div>
          <h1>Get in Touch</h1>
          <p style={{ maxWidth: '500px', margin: '0 auto' }}>
            Have a news tip, feedback, or business inquiry? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container">
        <div className="contact-grid">
          {/* Contact Form */}
          <div>
            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Send Us a Message</h3>
            <form onSubmit={e => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-input">
                  <option value="">Select a subject</option>
                  <option>News Tip</option>
                  <option>Advertising Inquiry</option>
                  <option>Subscription Support</option>
                  <option>General Feedback</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={6} placeholder="Your message..." style={{ resize: 'vertical', minHeight: '140px' }} required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Contact Information</h3>
            <div className="contact-info-cards">
              <div className="contact-info-card">
                <div className="contact-icon"><MapPin /></div>
                <div>
                  <div className="contact-label">Office Address</div>
                  <div className="contact-value">
                    Plot 125 Unit 13, Finance Park,<br />
                    Kgale Mews, Gaborone, Botswana
                  </div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon"><Phone /></div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">(+267) 390 8849</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon"><Mail /></div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">editor@weekendpost.co.bw</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon" style={{ background: 'var(--color-gold)' }}><Clock /></div>
                <div>
                  <div className="contact-label">Office Hours</div>
                  <div className="contact-value">
                    Mon – Fri: 8:00 AM – 5:00 PM<br />
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                      Saturday & Sunday: Closed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div style={{
              marginTop: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: '220px',
              background: 'linear-gradient(135deg, var(--color-bg), var(--color-border))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-sm)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <MapPin size={32} style={{ marginBottom: 'var(--space-sm)', opacity: 0.4 }} />
                <br />
                Kgale Mews, Gaborone
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
