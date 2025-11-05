import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./styles.css";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand-section">
            <div className="footer__brand">
              <span className="footer__logo">SILA</span>
            </div>
            <p className="footer__description">
              A national platform connecting charities, ministries, and beneficiaries 
              through transparent, secure, and efficient support networks.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-3h3z"></path>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer__column">
            <h3 className="footer__title">Quick Links</h3>
            <ul className="footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
                <li><HashLink smooth to="/about#mission">Our Mission</HashLink></li>
              <li><Link to="/programs">Programs</Link></li>
                <li><HashLink smooth to="/#how">How It Works</HashLink></li>
            </ul>
          </div>
          
          <div className="footer__column">
            <h3 className="footer__title">Resources</h3>
            <ul className="footer__list">
              <li><Link to="/programs">All Programs</Link></li>
              <li><Link to="/events">Events</Link></li>
                <li><HashLink smooth to="/#impact">Impact</HashLink></li>
              <li><Link to="/register?type=charity">Register Charity</Link></li>
              <li><Link to="/register?type=ministry">Partner With Us</Link></li>
            </ul>
          </div>
          
          <div className="footer__column">
            <h3 className="footer__title">Contact</h3>
            <ul className="footer__list">
              <li className="footer__contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="mailto:info@sila.sa">info@sila.sa</a>
              </li>
              <li className="footer__contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:+966920000000">+966 9200 000 00</a>
              </li>
              <li className="footer__contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Riyadh, Saudi Arabia</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>© {year} SILA Platform. All rights reserved.</p>
          </div>
          <div className="footer__policy">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="footer__divider">|</span>
            <Link to="/terms-of-service">Terms of Service</Link>
            <span className="footer__divider">|</span>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}