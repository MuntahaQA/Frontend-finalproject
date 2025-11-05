import React from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../utilities/api";
import "./styles.css";

export default function Hero() {
  // Auth (no Context)
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);
  const user = getCurrentUser(); // لو احتجته لاحقًا للأدوار/عرض اسم

  return (
    <section id="home" className="hero section">
      {/* Charity-themed Background with SILA colors */}
      <div className="hero__charity-bg">
        <div className="hero__gradient-overlay"></div>
        <div className="hero__pattern-overlay"></div>
      </div>

      <div className="hero__inner">
        <div className="hero__content">
          <div className="hero__text">
            {/* Sub-headline */}
            <p className="hero__badge fade-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              National Platform for Charitable Support
            </p>

            {/* Main Headline */}
            <h1 className="hero__title title fade-in-delay-1">
              Connecting Communities,
              <span className="hero__title-highlight"> Transforming Lives</span>
            </h1>

            {/* Description */}
            <p className="hero__description fade-in-delay-2">
              SILA bridges the gap between charities, ministries, and those in need.
              A unified platform ensuring transparency, trust, and efficient support delivery for our communities.
            </p>

            {/* CTA Buttons */}
            {!isAuthenticated ? (
              <div className="hero__actions fade-in-delay-3">
                <Link to="/register?type=charity" className="button button--primary hero__cta-primary">
                  <span>Get Started</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
                <Link to="/programs" className="button button--secondary hero__cta-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8h.01"></path>
                  </svg>
                  <span>Explore Programs</span>
                </Link>
              </div>
            ) : (
              <div className="hero__actions fade-in-delay-3">
                <Link to="/programs" className="button button--primary hero__cta-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8h.01"></path>
                  </svg>
                  <span>Explore Programs</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Illustration moved to grid */}
        <div className="hero__illustration">
          <svg viewBox="0 0 600 600" className="charity-svg">
            <defs>
              <linearGradient id="silaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f3aa7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b39cff" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="silaGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b39cff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4f3aa7" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="silaGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b39cff" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Central connection circle */}
            <circle cx="300" cy="300" r="100" fill="url(#silaGrad1)" opacity="0.4" />
            <circle cx="300" cy="300" r="80" fill="url(#silaGrad2)" opacity="0.3" />

            {/* People around the center - helping hands */}
            <g transform="translate(300, 150)">
              <circle cx="0" cy="0" r="30" fill="url(#silaGrad3)" opacity="0.8" />
              <ellipse cx="0" cy="40" rx="25" ry="50" fill="url(#silaGrad3)" opacity="0.7" />
              <ellipse cx="-20" cy="65" rx="8" ry="25" fill="url(#silaGrad3)" opacity="0.6" transform="rotate(-30)" />
              <ellipse cx="20" cy="65" rx="8" ry="25" fill="url(#silaGrad3)" opacity="0.6" transform="rotate(30)" />
            </g>

            <g transform="translate(150, 300)">
              <circle cx="0" cy="0" r="28" fill="url(#silaGrad3)" opacity="0.8" />
              <ellipse cx="0" cy="35" rx="22" ry="45" fill="url(#silaGrad3)" opacity="0.7" />
              <ellipse cx="30" cy="20" rx="8" ry="20" fill="url(#silaGrad3)" opacity="0.6" transform="rotate(45)" />
            </g>

            <g transform="translate(450, 300)">
              <circle cx="0" cy="0" r="28" fill="url(#silaGrad3)" opacity="0.8" />
              <ellipse cx="0" cy="35" rx="22" ry="45" fill="url(#silaGrad3)" opacity="0.7" />
              <ellipse cx="-30" cy="20" rx="8" ry="20" fill="url(#silaGrad3)" opacity="0.6" transform="rotate(-45)" />
            </g>

            <g transform="translate(300, 450)">
              <circle cx="0" cy="0" r="32" fill="url(#silaGrad3)" opacity="0.85" />
              <ellipse cx="0" cy="45" rx="28" ry="55" fill="url(#silaGrad3)" opacity="0.75" />
              <ellipse cx="-25" cy="-20" rx="8" ry="25" fill="url(#silaGrad3)" opacity="0.6" transform="rotate(-40)" />
              <ellipse cx="25" cy="-20" rx="8" ry="25" fill="url(#silaGrad3)" opacity="0.6" transform="rotate(40)" />
            </g>

            {/* Connecting lines */}
            <path d="M300 150 Q300 220 300 300" stroke="rgba(179, 156, 255, 0.3)" strokeWidth="3" fill="none" strokeDasharray="5,5" />
            <path d="M150 300 Q225 300 300 300" stroke="rgba(179, 156, 255, 0.3)" strokeWidth="3" fill="none" strokeDasharray="5,5" />
            <path d="M300 300 Q375 300 450 300" stroke="rgba(179, 156, 255, 0.3)" strokeWidth="3" fill="none" strokeDasharray="5,5" />
            <path d="M300 300 Q300 375 300 450" stroke="rgba(179, 156, 255, 0.3)" strokeWidth="3" fill="none" strokeDasharray="5,5" />

            {/* Heart at center */}
            <g transform="translate(300, 300)">
              <path
                d="M0,-20 C-15,-35 -30,-25 -30,-10 C-30,0 -15,10 0,25 C15,10 30,0 30,-10 C30,-25 15,-35 0,-20 Z"
                fill="url(#silaGrad1)"
                opacity="0.6"
              />
            </g>

            {/* Floating particles */}
            <circle cx="100" cy="200" r="4" fill="#b39cff" opacity="0.6" className="particle" />
            <circle cx="500" cy="200" r="4" fill="#b39cff" opacity="0.6" className="particle" />
            <circle cx="100" cy="400" r="4" fill="#b39cff" opacity="0.6" className="particle" />
            <circle cx="500" cy="400" r="4" fill="#b39cff" opacity="0.6" className="particle" />
            <circle cx="200" cy="100" r="3" fill="#4f3aa7" opacity="0.5" className="particle" />
            <circle cx="400" cy="100" r="3" fill="#4f3aa7" opacity="0.5" className="particle" />
          </svg>
        </div>
      </div>
    </section>
  );
}
