import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LegalPage() {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Legal Information';
  let content = [];

  if (path === '/privacy') {
    title = 'Privacy Policy';
    content = [
      'At Weekend Post, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.',
      '1. Information Collection: We collect information you provide directly to us when you create an account, subscribe to our newsletter, or contact us.',
      '2. Use of Information: We use the information we collect to provide, maintain, and improve our services, and to communicate with you.',
      '3. Information Sharing: We do not share your personal information with third parties except as described in this privacy policy.'
    ];
  } else if (path === '/terms') {
    title = 'Terms of Service';
    content = [
      'Welcome to Weekend Post. By accessing or using our website, you agree to be bound by these Terms of Service.',
      '1. User Conduct: You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of, restrict or inhibit anyone else\'s use and enjoyment of the website.',
      '2. Intellectual Property: All content on this website, including text, graphics, logos, and images, is the property of Weekend Post and is protected by copyright laws.',
      '3. Limitation of Liability: Weekend Post shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use our services.'
    ];
  } else if (path === '/refund') {
    title = 'Refund Policy';
    content = [
      'Our goal is to ensure you are completely satisfied with your subscription.',
      '1. Digital Subscriptions: We offer a 7-day money-back guarantee for all new digital subscriptions. If you are not satisfied, contact our support team within 7 days of purchase for a full refund.',
      '2. Print Subscriptions: Print subscriptions can be canceled at any time, and you will receive a prorated refund for the remaining issues.',
      '3. Processing Refunds: Refunds will be processed to the original method of payment within 5-10 business days.'
    ];
  } else if (path === '/cookies') {
    title = 'Cookie Policy';
    content = [
      'This Cookie Policy explains how Weekend Post uses cookies and similar technologies to recognize you when you visit our website.',
      '1. What are cookies? Cookies are small data files that are placed on your computer or mobile device when you visit a website.',
      '2. Why do we use cookies? We use essential cookies to make our website work. We also use analytics cookies to help us improve our website by collecting and reporting information on how you use it.',
      '3. Managing cookies: You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies.'
    ];
  }

  return (
    <div className="legal-page" style={{ padding: 'var(--space-4xl) 0', minHeight: '60vh', background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'var(--text-4xl)', color: 'var(--color-dark)', marginBottom: 'var(--space-2xl)', borderBottom: '2px solid var(--color-border)', paddingBottom: 'var(--space-md)' }}
        >
          {title}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: 'var(--text-md)' }}
        >
          <p style={{ marginBottom: 'var(--space-xl)' }}>Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          {content.map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: 'var(--space-lg)' }}>
              {paragraph}
            </p>
          ))}

          <div style={{ marginTop: 'var(--space-4xl)', padding: 'var(--space-xl)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}>
            <h4 style={{ color: 'var(--color-dark)', marginBottom: 'var(--space-sm)' }}>Questions?</h4>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>If you have any questions about these policies, please contact us at <a href="mailto:legal@weekendpost.co.bw" style={{ color: 'var(--color-primary)' }}>legal@weekendpost.co.bw</a></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
