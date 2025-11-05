import "./styles.css";

const steps = [
  {
    n: 1,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <path d="M20 8v6M23 11h-6"></path>
      </svg>
    ),
    title: "Sign Up",
    text: "Create an account and verify your identity and documents through our secure verification process."
  },
  {
    n: 2,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
    ),
    title: "Smart Matching",
    text: "Our AI-powered engine analyzes your profile and suggests the best support programs tailored to your needs."
  },
  {
    n: 3,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    title: "Referral & Approval",
    text: "Partners and ministries review applications quickly through streamlined workflows and automated processes."
  },
  {
    n: 4,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    ),
    title: "Track Impact",
    text: "Monitor outcomes with real-time dashboards, KPIs, and detailed analytics showing measurable results."
  }
];

export default function HowItWorks() {
  return (
    <section id="how" className="section how">
      <div className="container">
        <div className="how__header">
          <span className="how__badge-header">Process</span>
          <h2 className="title how__title">How It Works</h2>
          <p className="how__subtitle">
            A simple, transparent process connecting those in need with the right support programs.
          </p>
        </div>
        <ol className="grid how__grid">
          {steps.map((s) => (
            <li key={s.n} className="card how__step">
              <div className="how__step-header">
                <span className="how__badge">{s.n}</span>
                <div className="how__icon">{s.icon}</div>
              </div>
              <h3 className="how__title-step">{s.title}</h3>
              <p className="text-dim how__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
