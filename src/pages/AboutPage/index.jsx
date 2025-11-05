import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles.css";

export default function AboutPage() {
  return (
    <main className="about-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About SILA</h1>
          <p>Connecting communities and creating positive change</p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-content">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-vision-card">
              <div className="mission-vision-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h2>Our Mission</h2>
              <p>
                SILA is a unified platform that connects charities, ministries, and beneficiaries 
                to streamline social support programs and create measurable impact in our communities.
              </p>
            </div>

            <div className="mission-vision-card">
              <div className="mission-vision-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h2>Our Vision</h2>
              <p>
                To create a transparent, efficient, and accessible ecosystem where those in need 
                can easily access support programs and services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>Transparency</h3>
              <p>Ensuring clear and open communication across all stakeholders</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Accessibility</h3>
              <p>Making support programs easily reachable for everyone in need</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3>Efficiency</h3>
              <p>Streamlining processes to maximize impact and minimize delays</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>Leveraging technology to improve social support delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="about-how-it-works">
        <div className="container">
          <h2 className="section-title">How SILA Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Ministries Create Programs</h3>
              <p>Government ministries register and create support programs for beneficiaries</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Charities Register Beneficiaries & Create Events</h3>
              <p>Registered charities identify and register beneficiaries, and create charity events for the community</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Beneficiaries Register Independently</h3>
              <p>Beneficiaries can register themselves directly in any program or event through the platform</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Review & Approval</h3>
              <p>Ministries access beneficiaries registered in their programs through unified data from all charities, enabling efficient review and approval</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
