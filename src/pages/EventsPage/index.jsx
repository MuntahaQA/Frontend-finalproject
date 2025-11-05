import React, { useState, useEffect } from "react";
import sendRequest from "../../utilities/sendRequest";
import { API_ENDPOINTS, getCurrentUser } from "../../utilities/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles.css";

export default function EventsPage() {
  const [currentUserState, setCurrentUserState] = useState(() => getCurrentUser());
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);
  const isCharityAdmin = Boolean(currentUserState?.charity_admin);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    city: "",
    max_capacity: "",
    is_active: true,
  });

  function canManageEvents() {
    return isCharityAdmin;
  }

  async function fetchEvents() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await sendRequest(API_ENDPOINTS.EVENTS, "GET");

      let eventsList = [];
      if (data && data.results) {
        eventsList = data.results;
      } else if (Array.isArray(data)) {
        eventsList = data;
      }
      if (isCharityAdmin && currentUserState?.charity_admin) {
        const charityObj = currentUserState.charity_admin;
        const charityId =
          (charityObj && (charityObj.id || charityObj.charity_id)) ||
          currentUserState.charity_id ||
          null;
        const charityName =
          (charityObj && (charityObj.name || charityObj.charity_name)) ||
          currentUserState.charity_name ||
          "";

        eventsList = (eventsList || []).filter((ev) => {
          if (charityId) {
            const evCharityId = ev.charity && typeof ev.charity === 'object' ? ev.charity.id : ev.charity;
            const evOrganizerId = ev.organizer && typeof ev.organizer === 'object' ? ev.organizer.id : ev.organizer;
            if (evCharityId && Number(evCharityId) === Number(charityId)) return true;
            if (evOrganizerId && Number(evOrganizerId) === Number(charityId)) return true;
          }

          if (charityName && charityName.trim() !== "") {
            const lcName = charityName.toLowerCase();
            const organizer = (ev.organizer || ev.charity || ev.charity_name || ev.organizer_name || "").toString().toLowerCase();
            if (organizer.includes(lcName)) return true;
          }

          return false;
        });
      } else {
        eventsList = (eventsList || []).filter((e) =>
          e.is_active === undefined ? (e.status ? e.status === 'ACTIVE' : true) : e.is_active
        );
      }
      setEvents(eventsList || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      const message =
        error?.message || error?.error || "Failed to load events. Please try again later.";
      setErrorMessage(message);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [isAuthenticated, currentUserState?.charity_admin?.id, currentUserState?.id]);

  useEffect(() => {
    const onAuthChange = () => {
      setCurrentUserState(getCurrentUser());
    };
    window.addEventListener("sila:auth-changed", onAuthChange);
    return () => window.removeEventListener("sila:auth-changed", onAuthChange);
  }, []);

  async function handleCreateEvent(event) {
    event.preventDefault();
    try {
      const payload = {
        ...newEvent,
        max_capacity: parseInt(newEvent.max_capacity, 10),
        event_date: newEvent.event_date,
      };

  const response = await sendRequest(API_ENDPOINTS.EVENTS, "POST", payload);

      if (response) {
        setEvents((previousEvents) => {
          const filtered = (previousEvents || []).filter((e) => e.id !== response.id);
          return [response, ...filtered];
        });
      }

      setIsCreateFormVisible(false);
      setNewEvent({
        title: "",
        description: "",
        event_date: "",
        location: "",
        city: "",
        max_capacity: "",
        is_active: true,
      });
      setErrorMessage(null);

      // Re-sync with server
      await fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      setErrorMessage(error?.error || error?.message || "Failed to create event. Please try again.");
    }
  }

  function handleEditEvent(eventItem) {
    const eventDate = new Date(eventItem.event_date);
    // toISOString returns Z time; slice(0,16) fits input[type="datetime-local"]
    const dateTimeString = eventDate.toISOString().slice(0, 16);

    setEditingEvent({
      id: eventItem.id,
      title: eventItem.title || "",
      description: eventItem.description || "",
      event_date: dateTimeString,
      location: eventItem.location || "",
      city: eventItem.city || "",
      max_capacity: eventItem.max_capacity || "",
      is_active: typeof eventItem.is_active === "boolean" ? eventItem.is_active : true,
    });
    setIsCreateFormVisible(false);
  }

  async function handleUpdateEvent(event) {
    event.preventDefault();
    try {
      const payload = {
        title: editingEvent.title,
        description: editingEvent.description,
        event_date: editingEvent.event_date,
        location: editingEvent.location,
        city: editingEvent.city,
        max_capacity: parseInt(editingEvent.max_capacity, 10),
        is_active: Boolean(editingEvent.is_active),
      };

      const response = await sendRequest(
        API_ENDPOINTS.EVENT_DETAIL(editingEvent.id),
        "PUT",
        payload
      );

      if (response) {
        setEvents((previousEvents) =>
          (previousEvents || []).map((e) => (e.id === editingEvent.id ? response : e))
        );
      }

      setEditingEvent(null);
      setErrorMessage(null);

      await fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      setErrorMessage(error?.error || error?.message || "Failed to update event. Please try again.");
    }
  }

  async function handleDeleteEvent(eventId) {
    try {
      await sendRequest(API_ENDPOINTS.EVENT_DETAIL(eventId), "DELETE");

      setEvents((previousEvents) => (previousEvents || []).filter((e) => e.id !== eventId));

      setDeleteConfirmationId(null);
      setErrorMessage(null);

      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      setErrorMessage(error?.error || error?.message || "Failed to delete event. Please try again.");
    }
  }

  return (
    <main className="events-page">
      <Navbar />

      <section className="events-page__content">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h2 className="title dashboard-title">
                {canManageEvents() ? "Manage Events" : "Upcoming Events"}
              </h2>
              {!canManageEvents() && (
                <p className="dashboard-subtitle">
                  Browse and register for charity events in your area.
                </p>
              )}
            </div>

            {canManageEvents() && (
              <div className="dashboard-header-actions">
                <button
                  className="button button--primary"
                  onClick={() => {
                    setIsCreateFormVisible(!isCreateFormVisible);
                    setEditingEvent(null);
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
                      Create New Event
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="events-page__error" style={{ marginBottom: "1.5rem" }}>
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Create/Edit Event Form */}
          {(isCreateFormVisible || editingEvent) && canManageEvents() && (
            <div className="event-form-card">
              <h3>{editingEvent ? "Edit Event" : "Create New Event"}</h3>
              <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}>
                <div className="form-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    value={editingEvent ? editingEvent.title : newEvent.title}
                    onChange={(e) =>
                      editingEvent
                        ? setEditingEvent({ ...editingEvent, title: e.target.value })
                        : setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={editingEvent ? editingEvent.description : newEvent.description}
                    onChange={(e) =>
                      editingEvent
                        ? setEditingEvent({ ...editingEvent, description: e.target.value })
                        : setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    required
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Event Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={editingEvent ? editingEvent.event_date : newEvent.event_date}
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({ ...editingEvent, event_date: e.target.value })
                          : setNewEvent({ ...newEvent, event_date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Capacity *</label>
                    <input
                      type="number"
                      min="1"
                      value={editingEvent ? editingEvent.max_capacity : newEvent.max_capacity}
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({ ...editingEvent, max_capacity: e.target.value })
                          : setNewEvent({ ...newEvent, max_capacity: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      value={editingEvent ? editingEvent.location : newEvent.location}
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({ ...editingEvent, location: e.target.value })
                          : setNewEvent({ ...newEvent, location: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={editingEvent ? editingEvent.city : newEvent.city}
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({ ...editingEvent, city: e.target.value })
                          : setNewEvent({ ...newEvent, city: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editingEvent ? editingEvent.is_active : newEvent.is_active}
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({ ...editingEvent, is_active: e.target.checked })
                          : setNewEvent({ ...newEvent, is_active: e.target.checked })
                      }
                    />
                    {" "}Active Event
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="button button--primary">
                    {editingEvent ? "Update Event" : "Create Event"}
                  </button>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => {
                      setIsCreateFormVisible(false);
                      setEditingEvent(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading && (
            <div className="events-page__loading">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          )}

          {!isLoading && !errorMessage && events.length === 0 && !isCreateFormVisible && !editingEvent && (
            <div className="events-page__empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3>No Events Available</h3>
              <p>There are currently no events available. Please check back later.</p>
            </div>
          )}

          {!isLoading && !errorMessage && events.length > 0 && (
            <div className="grid events-page__grid">
              {events.map((eventItem) => {
                const eventDate = new Date(eventItem.event_date);
                const currentRegistrations = Number(eventItem.current_registrations || 0);
                const maxCapacity = Number(eventItem.max_capacity || 0);
                const availableSpots = Math.max(maxCapacity - currentRegistrations, 0);

                return (
                  <article key={eventItem.id} className="card events-page__card">
                    <div className="events-page__card-header">
                      <h3 className="events-page__card-title">{eventItem.title}</h3>
                      {canManageEvents() && (
                        <span
                          className={`events-page__status ${eventItem.is_active ? "events-page__status--active" : "events-page__status--inactive"
                            }`}
                        >
                          {eventItem.is_active ? "Active" : "Inactive"}
                        </span>
                      )}
                    </div>

                    {eventItem.charity_name && (
                      <p className="events-page__charity">{eventItem.charity_name}</p>
                    )}

                    <p className="events-page__description">{eventItem.description}</p>

                    <div className="events-page__details">
                      <div className="events-page__detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>
                          {eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="events-page__detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{eventItem.location}, {eventItem.city}</span>
                      </div>

                      <div className="events-page__detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>{currentRegistrations} / {maxCapacity} registered</span>
                        {availableSpots > 0 && (
                          <span className="events-page__spots-available">
                            ({availableSpots} spots available)
                          </span>
                        )}
                      </div>
                    </div>

                    {canManageEvents() && (
                      <div className="events-page__actions">
                        <button
                          className="button button--secondary"
                          onClick={() => handleEditEvent(eventItem)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          className="button button--danger"
                          onClick={() => setDeleteConfirmationId(eventItem.id)}
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
                );
              })}
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {deleteConfirmationId && (
            <div className="delete-confirm-overlay">
              <div className="delete-confirm-dialog">
                <h3>Delete Event</h3>
                <p>Are you sure you want to delete this event? This action cannot be undone.</p>
                <div className="delete-confirm-actions">
                  <button
                    className="button button--danger"
                    onClick={() => handleDeleteEvent(deleteConfirmationId)}
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
