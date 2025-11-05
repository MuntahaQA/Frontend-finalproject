import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utilities/api";
import { useState, useEffect } from "react";
import logo from "../../assets/images/Sila-logo.png";
import "./styles.css";

function MenuDropdown({ label, items }) {
  return (
    <div className="dropdown" tabIndex={0} aria-haspopup="true">
      <span className="nav-link with-caret">
        {label}
        <svg
          className="caret"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
      <div className="dropdown-menu" role="menu">
        {items.map((it) => (
          <Link key={it.href} className="dropdown-item" to={it.href} role="menuitem">
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const REGISTER_ITEMS = [
  { label: "Charity", href: "/register?type=charity" },
  { label: "Ministry", href: "/register?type=ministry" },
];

export default function Navbar() {
  const navigate = useNavigate();

  // Local state to trigger re-render when auth changes
  const [authTick, setAuthTick] = useState(0);

  // Auth state (no AuthContext)
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);
  const user = getCurrentUser();
  const isMinistryUser = Boolean(user?.is_superuser);
  const isCharityAdmin = Boolean(user?.charity_admin);

  // Get ministry name from user data
  const getMinistryName = () => {
    if (isMinistryUser && user?.first_name) return user.first_name;
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "Ministry";
    }
    return user?.email?.split("@")[0] || "Ministry";
  };

  // Get charity name from user data
  const getCharityName = () => {
    if (isCharityAdmin && user?.charity_admin) {
      return user.charity_admin.name || user.charity_admin.charity_name || "Charity";
    }
    return "Charity";
  };

  // Logout: clear storage and redirect
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      navigate("/");
    }
  };

  useEffect(() => {
    const onAuth = () => setAuthTick((t) => t + 1);
    window.addEventListener('sila:auth-changed', onAuth);
    return () => window.removeEventListener('sila:auth-changed', onAuth);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <img src={logo} alt="SILA Logo" />
        </Link>

        {isAuthenticated && isMinistryUser ? (
          // Ministry User Navbar
          <>
            <ul className="nav-center">
              <li><Link to="/programs" className="nav-link">Programs</Link></li>
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/profile" className="nav-link">Profile</Link></li>
            </ul>

            <div className="nav-right">
              <span className="ministry-name">{getMinistryName()}</span>
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            </div>
          </>
        ) : isAuthenticated && isCharityAdmin ? (
          // Charity Admin Navbar
          <>
            <ul className="nav-center">
              <li><Link to="/beneficiaries" className="nav-link">Beneficiaries</Link></li>
              <li><Link to="/events" className="nav-link">Events</Link></li>
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/profile" className="nav-link">Profile</Link></li>
            </ul>

            <div className="nav-right">
              <span className="charity-name">{getCharityName()}</span>
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            </div>
          </>
        ) : (
          // Public/Regular User Navbar
          <>
            <ul className="nav-center">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/about" className="nav-link">About</Link></li>
              <li><Link to="/programs" className="nav-link">Programs</Link></li>
              <li><Link to="/events" className="nav-link">Events</Link></li>
              <li><MenuDropdown label="Register" items={REGISTER_ITEMS} /></li>
            </ul>

            <div className="nav-right">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="nav-link">Profile</Link>
                  <button onClick={handleLogout} className="btn-primary">Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn-primary">Login</Link>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
