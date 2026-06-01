import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      id: crypto.randomUUID(),
      ...formData,
      date: new Date().toISOString(),
      status: 'Unread'
    };

    const existing = JSON.parse(localStorage.getItem('wp_contact_messages') || '[]');
    localStorage.setItem('wp_contact_messages', JSON.stringify([newMessage, ...existing]));

    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

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
            
            {submitted ? (
              <div style={{ background: 'rgba(39, 174, 96, 0.1)', border: '1px solid var(--color-sport-green)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <CheckCircle size={48} color="var(--color-sport-green)" style={{ margin: '0 auto var(--space-md)' }} />
                <h4 style={{ color: 'var(--color-sport-green)', marginBottom: 'var(--space-sm)' }}>Message Sent Successfully!</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Thank you for reaching out. Our team will review your message and get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Your name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="you@example.com" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select 
                    className="form-input" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="">Select a subject</option>
                    <option value="News Tip">News Tip</option>
                    <option value="Advertising Inquiry">Advertising Inquiry</option>
                    <option value="Subscription Support">Subscription Support</option>
                    <option value="General Feedback">General Feedback</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea 
                    className="form-input" 
                    rows={6} 
                    placeholder="Your message..." 
                    style={{ resize: 'vertical', minHeight: '140px' }} 
                    required 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
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
              height: '300px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
            }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.4851433604313!2d25.903004875348393!3d-24.693121578431872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9508535f29e92b%3A0xc3c5f49f57f5c531!2sKgale%20Mews%2C%20Gaborone!5e0!3m2!1sen!2sbw!4v1715610000000!5m2!1sen!2sbw" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
