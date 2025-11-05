import React, { useState, useEffect } from "react";
import sendRequest from "../../utilities/sendRequest";
import { API_ENDPOINTS, getCurrentUser } from "../../utilities/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles.css";

// Map program names to icons
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
    if (name?.includes?.(keyword)) return icon;
  }

  // Default icon
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
      <path d="M2 17l10 5 10-5"></path>
      <path d="M2 12l10 5 10-5"></path>
    </svg>
  );
};

export default function ProgramsPage() {
  // Auth (without AuthContext)
  const token = localStorage.getItem("token");
  const currentUser = getCurrentUser();
  const isAuthenticated = Boolean(token);

  // Heuristic for ministry user (keep flexible with different backends)
  const isMinistryUser =
    Boolean(currentUser?.is_ministry_user) ||
    Boolean(currentUser?.is_staff) ||
    Boolean(currentUser?.is_superuser);

  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // Ministry name (from user's first_name, per your backend)
  const ministryName =
    (isMinistryUser && currentUser?.first_name) ||
    "";

  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    ministry_owner: ministryName || "",
    eligibility_criteria: "",
    application_deadline: "",
    status: "ACTIVE",
  });

  // Keep ministry_owner synced with user
  useEffect(() => {
    if (ministryName) {
      setNewProgram((previous) => ({ ...previous, ministry_owner: ministryName }));
    }
  }, [ministryName]);

  async function fetchPrograms() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // GET programs (public allowed; backend decides visibility)
      const data = await sendRequest(API_ENDPOINTS.PROGRAMS, "GET");

      let programsList = [];
      if (data && data.results) {
        programsList = data.results;
      } else if (Array.isArray(data)) {
        programsList = data;
      }

      if (isMinistryUser && ministryName) {
        programsList = (programsList || []).filter(
          (program) =>
            program.ministry_owner &&
            program.ministry_owner.toLowerCase().includes(ministryName.toLowerCase())
        );
      } else if (!isMinistryUser) {
        programsList = (programsList || []).filter((p) => p.status === "ACTIVE");
      }

      setPrograms(programsList || []);
    } catch (error) {
      console.error("Error fetching programs:", error);
      const message =
        error?.message || error?.error || "Failed to load programs. Please try again later.";
      setErrorMessage(message);
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPrograms();
    // Re-fetch when auth changes or when the ministry name changes
    const onAuthChange = () => fetchPrograms();
    window.addEventListener('sila:auth-changed', onAuthChange);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      window.removeEventListener('sila:auth-changed', onAuthChange);
    };
  }, [isAuthenticated, isMinistryUser, ministryName]);

  async function handleCreateProgram(event) {
    event.preventDefault();
    try {
      const programPayload = {
        ...newProgram,
        ministry_owner: ministryName || newProgram.ministry_owner,
      };

      const response = await sendRequest(
        API_ENDPOINTS.PROGRAMS,
        "POST",
        programPayload
      );

      if (response) {
        setPrograms((previousPrograms) => {
          const filtered = (previousPrograms || []).filter(
            (program) => program.id !== response.id
          );
          return [...filtered, response];
        });
      }

      setIsCreateFormVisible(false);
      setNewProgram({
        name: "",
        description: "",
        ministry_owner: ministryName || "",
        eligibility_criteria: "",
        application_deadline: "",
        status: "ACTIVE",
      });
      setErrorMessage(null);

      await fetchPrograms();
    } catch (error) {
      console.error("Error creating program:", error);
      setErrorMessage(
        error?.error || error?.message || "Failed to create program. Please try again."
      );
    }
  }

  function handleEditProgram(program) {
    setEditingProgram({
      id: program.id,
      name: program.name,
      description: program.description || "",
      ministry_owner: program.ministry_owner || ministryName,
      eligibility_criteria: program.eligibility_criteria || "",
      application_deadline: program.application_deadline || "",
      status: program.status || "ACTIVE",
    });
    setIsCreateFormVisible(false);
  }

  async function handleUpdateProgram(event) {
    event.preventDefault();
    try {
      const response = await sendRequest(
        API_ENDPOINTS.PROGRAM_DETAIL(editingProgram.id),
        "PATCH",
        editingProgram
      );

      if (response) {
        setPrograms((programsList) =>
          (programsList || []).map((p) =>
            p.id === editingProgram.id ? { ...p, ...editingProgram } : p
          )
        );
      }

      setEditingProgram(null);
      setErrorMessage(null);

      await fetchPrograms();
    } catch (error) {
      console.error("Error updating program:", error);
      setErrorMessage(
        error?.error || error?.message || "Failed to update program. Please try again."
      );
    }
  }

  async function handleDeleteProgram(programId) {
    try {
      await sendRequest(API_ENDPOINTS.PROGRAM_DETAIL(programId), "DELETE");

      setPrograms((programsList) => (programsList || []).filter((p) => p.id !== programId));

      setDeleteConfirmationId(null);
      setErrorMessage(null);

      await fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
      setErrorMessage(
        error?.error || error?.message || "Failed to delete program. Please try again."
      );
    }
  }

  return (
    <main className="programs-page">
      <Navbar />

      <section className="programs-page__content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              {isMinistryUser && (
                <div className="dashboard-ministry-info">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ministry-icon">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span className="dashboard-ministry-name">{ministryName || "Ministry"}</span>
                </div>
              )}
              <h2 className="title dashboard-title">
                {isMinistryUser ? "My Programs" : "Available Support Programs"}
              </h2>
              {!isMinistryUser && (
                <p className="dashboard-subtitle">
                  Explore government programs designed to support families and individuals in need.
                </p>
              )}
            </div>
            {isMinistryUser && (
              <div className="dashboard-header-actions">
                <button
                  className="button button--primary"
                  onClick={() => {
                    setIsCreateFormVisible(!isCreateFormVisible);
                    setEditingProgram(null);
                  }}
                >
                  {isCreateFormVisible ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"></path>
                      </svg>
                      Create New Program
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="programs-page__error" style={{ marginBottom: "1.5rem" }}>
              <p>{errorMessage}</p>
            </div>
          )}

          {(isCreateFormVisible || editingProgram) && (
            <div className="program-form-card">
              <h3>{editingProgram ? "Edit Program" : "Create New Program"}</h3>
              <form onSubmit={editingProgram ? handleUpdateProgram : handleCreateProgram}>
                <div className="form-group">
                  <label>Program Name *</label>
                  <input
                    type="text"
                    value={editingProgram ? editingProgram.name : newProgram.name}
                    onChange={(e) =>
                      editingProgram
                        ? setEditingProgram({ ...editingProgram, name: e.target.value })
                        : setNewProgram({ ...newProgram, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ministry Owner *</label>
                  <input
                    type="text"
                    value={editingProgram ? editingProgram.ministry_owner : newProgram.ministry_owner}
                    disabled
                    className="form-input--disabled"
                    placeholder={ministryName || "Ministry Name"}
                  />
                  <small className="form-hint">This is automatically set to your ministry name</small>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={editingProgram ? editingProgram.description : newProgram.description}
                    onChange={(e) =>
                      editingProgram
                        ? setEditingProgram({ ...editingProgram, description: e.target.value })
                        : setNewProgram({ ...newProgram, description: e.target.value })
                    }
                    required
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Eligibility Criteria</label>
                  <textarea
                    value={editingProgram ? editingProgram.eligibility_criteria : newProgram.eligibility_criteria}
                    onChange={(e) =>
                      editingProgram
                        ? setEditingProgram({ ...editingProgram, eligibility_criteria: e.target.value })
                        : setNewProgram({ ...newProgram, eligibility_criteria: e.target.value })
                    }
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Application Deadline</label>
                    <input
                      type="date"
                      value={editingProgram ? editingProgram.application_deadline || "" : newProgram.application_deadline}
                      onChange={(e) =>
                        editingProgram
                          ? setEditingProgram({ ...editingProgram, application_deadline: e.target.value })
                          : setNewProgram({ ...newProgram, application_deadline: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={editingProgram ? editingProgram.status : newProgram.status}
                      onChange={(e) =>
                        editingProgram
                          ? setEditingProgram({ ...editingProgram, status: e.target.value })
                          : setNewProgram({ ...newProgram, status: e.target.value })
                      }
                      required
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="button button--primary">
                    {editingProgram ? "Update Program" : "Create Program"}
                  </button>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => {
                      setIsCreateFormVisible(false);
                      setEditingProgram(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading && (
            <div className="programs-page__loading">
              <div className="loading-spinner"></div>
              <p>Loading programs...</p>
            </div>
          )}

          {!isLoading && !errorMessage && programs.length === 0 && !isCreateFormVisible && !editingProgram && (
            <div className="programs-page__empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              <h3>No Programs Available</h3>
              <p>There are currently no programs available. Please check back later.</p>
            </div>
          )}

          {!isLoading && !errorMessage && programs.length > 0 && (
            <div className="grid programs-page__grid">
              {programs.map((program) => (
                <article key={program.id} className="card programs-page__card">
                  <div className="programs-page__icon-wrapper">
                    <div className="programs-page__icon">{getProgramIcon(program.name)}</div>
                  </div>

                  <div className="programs-page__card-header">
                    <h3 className="programs-page__card-title">{program.name}</h3>
                    <span className={`programs-page__status programs-page__status--${String(program.status || "").toLowerCase()}`}>
                      {program.status}
                    </span>
                  </div>

                  <p className="programs-page__ministry">{program.ministry_owner}</p>
                  <p className="programs-page__description">{program.description}</p>

                  {program.application_count !== undefined && (
                    <div className="programs-page__applications">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span>{program.application_count} applications</span>
                    </div>
                  )}

                  {isMinistryUser && (
                    <div className="programs-page__actions">
                      <button
                        className="button button--secondary"
                        onClick={() => handleEditProgram(program)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        className="button button--danger"
                        onClick={() => setDeleteConfirmationId(program.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {deleteConfirmationId && (
            <div className="delete-confirm-overlay">
              <div className="delete-confirm-dialog">
                <h3>Delete Program</h3>
                <p>Are you sure you want to delete this program? This action cannot be undone.</p>
                <div className="delete-confirm-actions">
                  <button
                    className="button button--danger"
                    onClick={() => handleDeleteProgram(deleteConfirmationId)}
                  >
                    Delete
                  </button>
                  <button
                    className="button button--secondary"
                    onClick={() => setDeleteConfirmationId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
