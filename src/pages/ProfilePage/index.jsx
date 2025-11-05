import React, { useState, useEffect } from "react";
import sendRequest from "../../utilities/sendRequest";
import { getCurrentUser, API_ENDPOINTS } from "../../utilities/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles.css";

export default function ProfilePage() {
  // Auth (no AuthContext)
  const token = localStorage.getItem("token");
  const initialUser = getCurrentUser();
  const isAuthenticated = Boolean(token);
  const isMinistryUser = Boolean(initialUser?.is_superuser);
  const isCharityAdmin = Boolean(initialUser?.charity_admin);

  // Local user state so we can refresh after updates
  const [currentUser, setCurrentUser] = useState(initialUser);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [profileData, setProfileData] = useState({
    ministry_name: "",
    charity_name: "",
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  // Helper: refresh user from API and persist to localStorage
  async function refreshUserFromApi() {
    try {
      const refreshed = await sendRequest(API_ENDPOINTS.USER_PROFILE, "GET");
      if (refreshed) {
        localStorage.setItem("user", JSON.stringify(refreshed));
        setCurrentUser(refreshed);
      }
    } catch {
      // ignore silently
    }
  }

  // Initialize/load profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        const data = await sendRequest(API_ENDPOINTS.USER_PROFILE, "GET");
        if (data) {
          setProfileData({
            ministry_name: isMinistryUser ? String(data.first_name || "") : "",
            charity_name: isCharityAdmin ? String(data.charity_admin?.name || "") : "",
            first_name: (isMinistryUser || isCharityAdmin) ? "" : String(data.first_name || ""),
            last_name: (isMinistryUser || isCharityAdmin) ? "" : String(data.last_name || ""),
            email: String(data.email || ""),
            username: String(data.username || ""),
            password: "",
            confirm_password: "",
          });
        }
      } catch (error) {
        // Fallback to local user if API fails
        if (currentUser) {
          setProfileData({
            ministry_name: isMinistryUser ? String(currentUser.first_name || "") : "",
            charity_name: isCharityAdmin ? String(currentUser.charity_admin?.name || "") : "",
            first_name: (isMinistryUser || isCharityAdmin) ? "" : String(currentUser.first_name || ""),
            last_name: (isMinistryUser || isCharityAdmin) ? "" : String(currentUser.last_name || ""),
            email: String(currentUser.email || ""),
            username: String(currentUser.username || ""),
            password: "",
            confirm_password: "",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated && currentUser) {
      fetchProfile();
    }
  }, [isAuthenticated, currentUser, isMinistryUser, isCharityAdmin]);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfileData((previousState) => ({
      ...previousState,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage(null);
    if (successMessage) setSuccessMessage(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate password if provided
    if (profileData.password) {
      if (profileData.password.length < 8) {
        setErrorMessage("Password must be at least 8 characters long");
        return;
      }
      if (profileData.password !== profileData.confirm_password) {
        setErrorMessage("Passwords do not match");
        return;
      }
    }

    try {
      setIsSaving(true);
      const updatePayload = {
        email: profileData.email,
      };

      if (isMinistryUser) {
        // Ministry name is stored in first_name for ministry accounts
        updatePayload.first_name = profileData.ministry_name;
      } else if (isCharityAdmin) {
        // Charity name updated via custom field handled by backend
        updatePayload.charity_name = profileData.charity_name;
      } else {
        // Regular users
        updatePayload.first_name = profileData.first_name;
        updatePayload.last_name = profileData.last_name;
      }

      if (profileData.password) {
        updatePayload.password = profileData.password;
      }

      await sendRequest(API_ENDPOINTS.USER_PROFILE, "PATCH", updatePayload);

      setSuccessMessage("Profile updated successfully!");
      setProfileData((previousState) => ({
        ...previousState,
        password: "",
        confirm_password: "",
      }));

      await refreshUserFromApi();
    } catch (error) {
      setErrorMessage(
        error?.error || error?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="profile-page">
      <Navbar />

      <section className="profile-page__content">
        <div className="profile-card">
          <div className="profile-page__header">
            <h1 className="profile-page__title">My Profile</h1>
            <p className="profile-page__subtitle">
              Manage your account information and settings
            </p>
          </div>

          {isLoading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading profile...</p>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="profile-message profile-message--error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="profile-message profile-message--success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                  {isMinistryUser ? (
                    <>
                      <div className="form-group">
                        <label htmlFor="ministry_name">
                          Ministry Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="ministry_name"
                          name="ministry_name"
                          value={profileData.ministry_name}
                          onChange={handleChange}
                          required
                          placeholder="Enter ministry name"
                          className={errorMessage && !profileData.ministry_name ? "error" : ""}
                        />
                        {errorMessage && !profileData.ministry_name && (
                          <span className="error-text">Ministry name is required</span>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="email">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                            className={errorMessage && !profileData.email ? "error" : ""}
                          />
                          {errorMessage && !profileData.email && (
                            <span className="error-text">Email is required</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={profileData.username}
                            disabled
                            className="form-input--disabled"
                            placeholder="Username (cannot be changed)"
                          />
                          <small className="form-hint">Username cannot be changed</small>
                        </div>
                      </div>
                    </>
                  ) : isCharityAdmin ? (
                    <>
                      <div className="form-group">
                        <label htmlFor="charity_name">
                          Charity Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="charity_name"
                          name="charity_name"
                          value={profileData.charity_name}
                          onChange={handleChange}
                          required
                          placeholder="Enter charity name"
                          className={errorMessage && !profileData.charity_name ? "error" : ""}
                        />
                        {errorMessage && !profileData.charity_name && (
                          <span className="error-text">Charity name is required</span>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="email">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                            className={errorMessage && !profileData.email ? "error" : ""}
                          />
                          {errorMessage && !profileData.email && (
                            <span className="error-text">Email is required</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={profileData.username}
                            disabled
                            className="form-input--disabled"
                            placeholder="Username (cannot be changed)"
                          />
                          <small className="form-hint">Username cannot be changed</small>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="first_name">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={profileData.first_name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your first name"
                            className={errorMessage && !profileData.first_name ? "error" : ""}
                          />
                          {errorMessage && !profileData.first_name && (
                            <span className="error-text">First name is required</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="last_name">Last Name</label>
                          <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={profileData.last_name}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="email">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                            className={errorMessage && !profileData.email ? "error" : ""}
                          />
                          {errorMessage && !profileData.email && (
                            <span className="error-text">Email is required</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={profileData.username}
                            disabled
                            className="form-input--disabled"
                            placeholder="Username (cannot be changed)"
                          />
                          <small className="form-hint">Username cannot be changed</small>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="form-section">
                  <h3 className="form-section__title">Change Password</h3>
                  <p className="form-section__description">
                    Leave blank if you don't want to change your password
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password">New Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={profileData.password}
                        onChange={handleChange}
                        placeholder="Enter new password (min. 8 characters)"
                        minLength={8}
                        className={
                          errorMessage &&
                            profileData.password &&
                            profileData.password.length < 8
                            ? "error"
                            : ""
                        }
                      />
                      {errorMessage &&
                        profileData.password &&
                        profileData.password.length < 8 && (
                          <span className="error-text">
                            Password must be at least 8 characters
                          </span>
                        )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirm_password">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={profileData.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        minLength={8}
                        className={
                          errorMessage &&
                            profileData.password !== profileData.confirm_password &&
                            profileData.confirm_password
                            ? "error"
                            : ""
                        }
                      />
                      {errorMessage &&
                        profileData.password !== profileData.confirm_password &&
                        profileData.confirm_password && (
                          <span className="error-text">Passwords do not match</span>
                        )}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="button button--primary" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => {
                      setProfileData({
                        ministry_name: isMinistryUser ? String(currentUser?.first_name || "") : "",
                        charity_name: isCharityAdmin ? String(currentUser?.charity_admin?.name || "") : "",
                        first_name: (isMinistryUser || isCharityAdmin) ? "" : String(currentUser?.first_name || ""),
                        last_name: (isMinistryUser || isCharityAdmin) ? "" : String(currentUser?.last_name || ""),
                        email: String(currentUser?.email || ""),
                        username: String(currentUser?.username || ""),
                        password: "",
                        confirm_password: "",
                      });
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
