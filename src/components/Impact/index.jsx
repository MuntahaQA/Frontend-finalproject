import "./styles.css";

const stats = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    label: "Registered Beneficiaries",
    value: "48,200+"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
    ),
    label: "Active Programs",
    value: "120+"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    label: "Partners",
    value: "85+"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    label: "Cities Covered",
    value: "50+"
  }
];

export default function Impact() {
  return (
    <section id="impact" className="section impact">
      <div className="container">
        <div className="impact__header">
          <span className="impact__badge">Our Impact</span>
          <h2 className="title impact__title">Making a Real Difference</h2>
          <p className="impact__subtitle">
            Numbers that reflect our commitment to connecting communities and transforming lives.
          </p>
        </div>
        <div className="grid impact__grid">
          {stats.map((s, i) => (
            <div key={i} className="card impact__card">
              <div className="impact__icon">{s.icon}</div>
              <div className="impact__value">{s.value}</div>
              <div className="impact__label text-dim">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}