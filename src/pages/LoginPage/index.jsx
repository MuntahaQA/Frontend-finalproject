import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as api from "../../utilities/api";
import "./styles.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to add a timeout to a promise
  const withTimeout = (p, ms = 5000) =>
    Promise.race([
      p,
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
    ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.loginUser(email, password);

      // support different token key names returned by various backends
      const token = result?.access || result?.token || result?.accessToken || null;
      if (token) {
        localStorage.setItem("token", token);
        if (result?.refresh) localStorage.setItem("refreshToken", result.refresh);

        // Get user either from login response or from profile endpoint
        let user = result?.user || null;
        if (!user) {
          try {
            user = await withTimeout(api.fetchUserProfile(), 5000);
          } catch (e) {
            // don't fail the whole login if profile is slow/unavailable
            console.warn("Could not fetch user profile after login (or timed out):", e);
            user = null;
          }
        }

        if (user) {
          try {
            localStorage.setItem("user", JSON.stringify(user));
          } catch (e) {
            /* ignore storage errors */
          }
        }

        // notify other components to re-fetch/update their state
        try {
          window.dispatchEvent(new Event("sila:auth-changed"));
        } catch (e) {
          /* ignore */
        }

        const isMinistry =
          Boolean(user?.is_ministry_user) ||
          Boolean(user?.isMinistryUser) ||
          Boolean(user?.is_staff) ||
          Boolean(user?.is_superuser);

        if (isMinistry) navigate("/dashboard");
        else navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Link to="/" className="login-back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Home</span>
      </Link>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h2>Login to SILA</h2>
          <p className="login-subtitle">Welcome back! Please enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinner">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                <span>Login</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register?type=charity" className="login-link">Charity</Link>{' '}
            or{' '}
            <Link to="/register?type=ministry" className="login-link">Ministry</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
