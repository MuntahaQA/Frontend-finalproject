import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sendRequest from "../../utilities/sendRequest";
import { API_ENDPOINTS } from "../../utilities/api";
import "./styles.css";

const getProgramIcon = (name) => {
  const iconMap = {
    'ضمان': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    'سكني': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    'غذاء': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
      </svg>
    ),
    'تمويل': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    'ترميم': (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
        <path d="M12 6v4"></path>
        <path d="M10 8h4"></path>
      </svg>
    ),
  };

  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (name && name.includes(keyword)) {
      return icon;
    }
  }

  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
      <path d="M2 17l10 5 10-5"></path>
      <path d="M2 12l10 5 10-5"></path>
    </svg>
  );
};

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        
  const data = await sendRequest(API_ENDPOINTS.PROGRAMS, 'GET');
        
        let programsList = [];
        if (data && data.results) {
          programsList = data.results;
        } else if (Array.isArray(data)) {
          programsList = data;
        }
        
        programsList = programsList.filter(p => p.status === 'ACTIVE');
        setPrograms(programsList);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs');
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const formatKPI = (program) => {
    if (program.total_beneficiaries !== undefined && program.total_beneficiaries > 0) {
      return `${program.total_beneficiaries.toLocaleString()} beneficiaries`;
    }
    if (program.application_count !== undefined && program.application_count > 0) {
      return `${program.application_count} applications`;
    }
    if (program.estimated_beneficiaries) {
      return program.estimated_beneficiaries;
    }
    return "Active Program";
  };

  return (
    <section id="programs" className="section programs">
      <div className="container">
        <div className="programs__header">
          <div className="programs__header-content">
            <span className="programs__badge">Our Partners</span>
            <h2 className="title programs__title">Government Programs & Initiatives</h2>
            <p className="programs__subtitle">
              SILA integrates with leading national programs to ensure comprehensive support coverage.
            </p>
            <Link to="/register?type=ministry" className="programs__addLink">
              Join as Partner
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>

        {loading && (
          <div className="programs__loading">
            <p>Loading programs...</p>
          </div>
        )}

        {error && (
          <div className="programs__error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && programs.length === 0 && (
          <div className="programs__empty">
            <p>No active programs available at the moment.</p>
          </div>
        )}

        {!loading && !error && programs.length > 0 && (
          <div className="grid programs__grid">
            {programs.map((program) => (
              <article key={program.id} className="card programs__card">
                <div className="programs__icon-wrapper">
                  <div className="programs__icon">
                    {getProgramIcon(program.name)}
                  </div>
                </div>
                <h3 className="programs__name">{program.name}</h3>
                <p className="programs__ministry">{program.ministry_owner}</p>
                <div className="programs__kpi">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  {formatKPI(program)}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}