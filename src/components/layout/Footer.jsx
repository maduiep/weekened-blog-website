import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from '../ui/SocialIcons';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              Weekend<span className="logo-accent">Post</span>
            </div>
            <p className="footer-description">
              Botswana's leading independent newspaper, delivering trusted journalism 
              since 1989. Your source for breaking news, business insights, sports 
              coverage, and cultural commentary.
            </p>
            <div className="footer-contact-item">
              <MapPin size={16} />
              <span>Plot 125 Unit 13, Finance Park, Kgale Mews, Gaborone</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={16} />
              <span>(+267) 390 8849</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} />
              <span>editor@weekendpost.co.bw</span>
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="Twitter"><TwitterIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="YouTube"><YoutubeIcon /></a>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Categories</h4>
            <div className="footer-links">
              <Link to="/category/news">News</Link>
              <Link to="/category/business">Business</Link>
              <Link to="/category/sport">Sport</Link>
              <Link to="/category/opinion">Opinions & Columns</Link>
              <Link to="/category/lifestyle">Weekend Life</Link>
              <Link to="/epaper">E-Paper</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Company</h4>
            <div className="footer-links">
              <Link to="/contact">Contact Us</Link>
              <Link to="/subscribe">Subscribe</Link>
              <Link to="/solutions">Advertise</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/tenders">Tenders & Jobs</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Legal</h4>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/refund">Refund Policy</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Weekend Post. All Rights Reserved.</span>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="#">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
