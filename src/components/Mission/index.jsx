import "./styles.css";

const items = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    title: "Empowerment",
    text: "Connect beneficiaries with the right support programs quickly and efficiently, ensuring no one is left behind."
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    title: "Transparency",
    text: "Verified charities, tracked outcomes, and measurable impact to build trust and accountability across the ecosystem."
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    title: "Integration",
    text: "Seamless data exchange between charities, ministries, and partners through secure, standardized protocols."
  }
];

export default function Mission() {
  return (
    <section id="mission" className="section mission">
      <div className="container">
        <div className="mission__header">
          <span className="mission__badge">Our Mission</span>
          <h2 className="title mission__title">Building a Connected Support Ecosystem</h2>
          <p className="mission__subtitle">
            SILA unites charities, ministries, and communities to create a transparent, efficient, 
            and impactful support network for those in need.
          </p>
        </div>
        <div className="grid mission__grid">
          {items.map((m, i) => (
            <div key={i} className="card mission__card">
              <div className="mission__icon">{m.icon}</div>
              <h3 className="mission__cardTitle">{m.title}</h3>
              <p className="text-dim mission__cardText">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}