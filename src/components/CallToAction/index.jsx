
import { Link } from "react-router-dom";
import "./styles.css";


export default function CallToAction() {
  return (
    <section id="donate" className="section cta-section">
      <div className="container">
        <div className="cta card">
          <div className="cta__content">
            <span className="cta__badge">Join Us</span>
            <h2 className="title cta__title">Create Impact With Us Today</h2>
            <p className="cta__text">
              Whether you're a charity, ministry, or individual donor, SILA provides the platform 
              to make a meaningful difference. Join our network and help transform lives.
            </p>
            <div className="cta__buttons">
              <Link to="/register?type=charity" className="button button--primary cta__btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <path d="M20 8v6M23 11h-6"></path>
                </svg>
                Register Your Charity
              </Link>
              <Link to="/register?type=ministry" id="partner" className="button cta__btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
                Become a Partner
              </Link>
            </div>
          </div>
          <div className="cta__illustration">
            <svg viewBox="0 0 400 300" className="cta-svg">
              <defs>
                <linearGradient id="ctaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f3aa7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#b39cff" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <circle cx="200" cy="150" r="80" fill="url(#ctaGrad)" opacity="0.4" />
              <path d="M120 150 Q200 100 280 150 Q200 200 120 150" fill="url(#ctaGrad)" opacity="0.5" />
              <circle cx="150" cy="120" r="15" fill="rgba(179, 156, 255, 0.6)" />
              <circle cx="250" cy="120" r="15" fill="rgba(179, 156, 255, 0.6)" />
              <circle cx="200" cy="180" r="20" fill="rgba(179, 156, 255, 0.7)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}