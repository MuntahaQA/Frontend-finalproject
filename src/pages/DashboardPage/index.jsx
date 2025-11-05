import React, { useState, useEffect } from "react";
import {
  getCurrentUser,
  API_ENDPOINTS,
  API_BASE_URL,
} from "../../utilities/api";
import sendRequest from "../../utilities/sendRequest";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./styles.css";

export default function DashboardPage() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const user = getCurrentUser();
  const isMinistryUser = !!user?.is_superuser;
  const isCharityAdmin = !!user?.charity_admin;

  const [ministryStatistics, setMinistryStatistics] = useState(null);
  const [charityStatistics, setCharityStatistics] = useState(null);

  const [programsList, setProgramsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filtersState, setFiltersState] = useState({
    program_id: "",
    event_id: "",
    status: "",
    date_from: "",
    date_to: "",
  });

  // ===== Helpers
  const getMinistryName = () => (user?.first_name ? user.first_name : "Ministry");
  const ministryDisplayName = getMinistryName();

  const buildQueryString = (entriesObj) => {
    const params = new URLSearchParams();
    Object.entries(entriesObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        params.append(key, value);
      }
    });
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  const fetchProgramsList = async () => {
    try {
      const data = await sendRequest(API_ENDPOINTS.PROGRAMS, "GET");
      let list = Array.isArray(data) ? data : data?.results || [];

      const currentMinistryName = getMinistryName();
      if (currentMinistryName && currentMinistryName !== "Ministry") {
        list = list.filter(
          (program) =>
            program.ministry_owner &&
            program.ministry_owner
              .toLowerCase()
              .includes(currentMinistryName.toLowerCase())
        );
      }
      setProgramsList(list);
    } catch (error) {
      console.error("Error fetching programs:", error);
      setProgramsList([]);
    }
  };

  const fetchEventsList = async () => {
    try {
      const data = await sendRequest(API_ENDPOINTS.EVENTS, "GET");
      const list = Array.isArray(data) ? data : data?.results || [];
      setEventsList(list);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEventsList([]);
    }
  };

  const fetchMinistryStatistics = async () => {
    try {
      setPageError(null);
      const queryString = buildQueryString({
        program_id: filtersState.program_id,
        status: filtersState.status,
        date_from: filtersState.date_from,
        date_to: filtersState.date_to,
      });
      const result = await sendRequest(
        `${API_ENDPOINTS.MINISTRY_STATISTICS}${queryString}`,
        "GET"
      );
      setMinistryStatistics(result);
    } catch (error) {
      console.error("Error fetching ministry statistics:", error);
      setPageError("Failed to load statistics. Please try again.");
      setMinistryStatistics(null);
    }
  };

  const fetchCharityStatistics = async () => {
    try {
      setPageError(null);
      const queryString = buildQueryString({
        event_id: filtersState.event_id,
        status: filtersState.status,
        date_from: filtersState.date_from,
        date_to: filtersState.date_to,
      });
      const result = await sendRequest(
        `${API_ENDPOINTS.CHARITY_STATISTICS}${queryString}`,
        "GET"
      );
      setCharityStatistics(result);
    } catch (error) {
      console.error("Error fetching charity statistics:", error);
      setPageError("Failed to load statistics. Please try again.");
      setCharityStatistics(null);
    }
  };

  // ===== Export
  const handleExportReport = async () => {
    try {
      const endpoint = isMinistryUser
        ? `${API_BASE_URL}${API_ENDPOINTS.MINISTRY_STATISTICS}`
        : `${API_BASE_URL}${API_ENDPOINTS.CHARITY_STATISTICS}`;

      const bodyPayload = {
        ...filtersState,
        export_type: "all",
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        let message = "Failed to export data";
        try {
          const errJson = await response.json();
          message = errJson?.error || message;
        } catch (_) { }
        setPageError(message);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const fileName = isMinistryUser
        ? `ministry_report_${new Date().toISOString().split("T")[0]}.csv`
        : `charity_report_${new Date().toISOString().split("T")[0]}.csv`;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(anchor);
    } catch (error) {
      console.error("Error exporting data:", error);
      setPageError("Failed to export data. Please try again.");
    }
  };

  // ===== Initial load
  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    const loaders = [];

    if (isMinistryUser) {
      loaders.push(fetchProgramsList(), fetchMinistryStatistics());
    } else if (isCharityAdmin) {
      loaders.push(fetchEventsList(), fetchCharityStatistics());
    }

    Promise.all(loaders)
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, isMinistryUser, isCharityAdmin]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const timeoutId = setTimeout(() => {
      if (isMinistryUser) {
        fetchMinistryStatistics();
      } else if (isCharityAdmin) {
        fetchCharityStatistics();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    filtersState.program_id,
    filtersState.event_id,
    filtersState.status,
    filtersState.date_from,
    filtersState.date_to,
    isAuthenticated,
    isMinistryUser,
    isCharityAdmin,
  ]);

  if (!isAuthenticated || (!isMinistryUser && !isCharityAdmin)) {
    return (
      <main className="dashboard-page">
        <Navbar />
        <div className="dashboard-page__unauthorized">
          <h2>Access Denied</h2>
          <p>You must be a ministry user or charity admin to access this dashboard.</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <Navbar />

      <section className="dashboard-analytics">
        <div className="container">
          <div className="dashboard-header">
            <div>
              {isMinistryUser ? (
                <>
                  <div className="dashboard-ministry-info">
                    <i className="fas fa-building ministry-icon"></i>
                    <span className="dashboard-ministry-name">
                      {ministryDisplayName || "Ministry"}
                    </span>
                  </div>
                  <h2 className="title dashboard-title">Ministry Dashboard</h2>
                </>
              ) : (
                <>
                  <div className="dashboard-ministry-info">
                    <i className="fas fa-users ministry-icon"></i>
                    <span className="dashboard-ministry-name">
                      {charityStatistics?.charity_name ||
                        user?.charity_admin?.name ||
                        "Charity"}
                    </span>
                  </div>
                  <h2 className="title dashboard-title">Charity Dashboard</h2>
                </>
              )}
            </div>

            <div className="dashboard-header-actions">
              <button
                className="button button--secondary"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                <i className="fas fa-filter"></i>
                Filters
              </button>
              <button className="button button--secondary" onClick={handleExportReport}>
                <i className="fas fa-download"></i>
                Export Report
              </button>
            </div>
          </div>

          {isFiltersOpen && (
            <div className="filters-panel">
              <div className="filters-panel-header">
                <h3>Filter Statistics</h3>
                <button
                  className="button-icon"
                  onClick={() => {
                    setFiltersState({
                      program_id: "",
                      event_id: "",
                      status: "",
                      date_from: "",
                      date_to: "",
                    });
                    setIsFiltersOpen(false);
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="filters-panel-content">
                <div className="filter-row">
                  {isMinistryUser ? (
                    <div className="filter-group">
                      <label>Program</label>
                      <select
                        value={filtersState.program_id}
                        onChange={(e) =>
                          setFiltersState({
                            ...filtersState,
                            program_id: e.target.value,
                          })
                        }
                      >
                        <option value="">All Programs</option>
                        {programsList.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="filter-group">
                      <label>Event</label>
                      <select
                        value={filtersState.event_id}
                        onChange={(e) =>
                          setFiltersState({
                            ...filtersState,
                            event_id: e.target.value,
                          })
                        }
                      >
                        <option value="">All Events</option>
                        {eventsList.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="filter-group">
                    <label>Application Status</label>
                    <select
                      value={filtersState.status}
                      onChange={(e) =>
                        setFiltersState({ ...filtersState, status: e.target.value })
                      }
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                  </div>
                </div>

                <div className="filter-row">
                  <div className="filter-group">
                    <label>Date From</label>
                    <input
                      type="date"
                      value={filtersState.date_from}
                      onChange={(e) =>
                        setFiltersState({ ...filtersState, date_from: e.target.value })
                      }
                    />
                  </div>
                  <div className="filter-group">
                    <label>Date To</label>
                    <input
                      type="date"
                      value={filtersState.date_to}
                      onChange={(e) =>
                        setFiltersState({ ...filtersState, date_to: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="filters-panel-actions">
                  <button
                    className="button button--secondary"
                    onClick={() =>
                      setFiltersState({
                        program_id: "",
                        event_id: "",
                        status: "",
                        date_from: "",
                        date_to: "",
                      })
                    }
                  >
                    Clear Filters
                  </button>
                  <button
                    className="button button--primary"
                    onClick={() => setIsFiltersOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {pageError && <div className="error-message">{pageError}</div>}

          <div className="dashboard-stats-section">
            {isLoading ? (
              <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading statistics...</p>
              </div>
            ) : (isMinistryUser && ministryStatistics) ||
              (isCharityAdmin && charityStatistics) ? (
              <div className="stats-cards-grid">
                {isMinistryUser && ministryStatistics ? (
                  <>
                    <div className="stat-card">
                      <div className="stat-card-icon stat-card-icon--programs">
                        <i className="fas fa-layer-group"></i>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-card-value">
                          {ministryStatistics.total_programs || 0}
                        </div>
                        <div className="stat-card-label">Total Programs</div>
                        <div className="stat-card-sub-label">
                          {ministryStatistics.active_programs || 0} Active
                        </div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-card-icon stat-card-icon--beneficiaries">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-card-value">
                          {ministryStatistics.unique_beneficiaries || 0}
                        </div>
                        <div className="stat-card-label">
                          Registered Beneficiaries
                        </div>
                        <div className="stat-card-sub-label">Across all programs</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-card-icon stat-card-icon--applications">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-card-value">
                          {ministryStatistics.total_applications || 0}
                        </div>
                        <div className="stat-card-label">Total Applications</div>
                        <div className="stat-card-sub-label">
                          {ministryStatistics.applications_by_status?.find(
                            (s) => s.status === "APPROVED"
                          )?.count || 0}{" "}
                          Approved
                        </div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-card-icon stat-card-icon--approval">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-card-value">
                          {ministryStatistics.total_applications > 0
                            ? Math.round(
                              ((ministryStatistics.applications_by_status?.find(
                                (s) => s.status === "APPROVED"
                              )?.count || 0) /
                                ministryStatistics.total_applications) *
                              100
                            )
                            : 0}
                          %
                        </div>
                        <div className="stat-card-label">Approval Rate</div>
                        <div className="stat-card-sub-label">
                          {ministryStatistics.applications_by_status?.find(
                            (s) => s.status === "PENDING"
                          )?.count || 0}{" "}
                          Pending
                        </div>
                      </div>
                    </div>

                    {ministryStatistics.avg_processing_days !== null &&
                      ministryStatistics.avg_processing_days !== undefined && (
                        <div className="stat-card">
                          <div className="stat-card-icon stat-card-icon--time">
                            <i className="fas fa-clock"></i>
                          </div>
                          <div className="stat-card-content">
                            <div className="stat-card-value">
                              {ministryStatistics.avg_processing_days || 0}
                            </div>
                            <div className="stat-card-label">
                              Avg Processing Time
                            </div>
                            <div className="stat-card-sub-label">Days to review</div>
                          </div>
                        </div>
                      )}
                  </>
                ) : isCharityAdmin && charityStatistics ? (
                  <>
                    <div className="stat-card">
                      <div className="stat-card-icon stat-card-icon--beneficiaries">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-card-value">
                          {charityStatistics.total_beneficiaries || 0}
                        </div>
                        <div className="stat-card-label">Total Beneficiaries</div>
                        <div className="stat-card-sub-label">
                          {charityStatistics.active_beneficiaries || 0} Active
                        </div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-card-icon stat-card-icon--events">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-card-value">
                          {charityStatistics.total_events || 0}
                        </div>
                        <div className="stat-card-label">Total Events</div>
                        <div className="stat-card-sub-label">
                          {charityStatistics.active_events || 0} Active
                        </div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-card-icon stat-card-icon--registrations">
                        <i className="fas fa-user-plus"></i>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-card-value">
                          {charityStatistics.total_registrations || 0}
                        </div>
                        <div className="stat-card-label">Event Registrations</div>
                        <div className="stat-card-sub-label">
                          {charityStatistics.attended_registrations || 0} Attended
                        </div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-card-icon stat-card-icon--approval">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-card-value">
                          {charityStatistics.attendance_rate || 0}%
                        </div>
                        <div className="stat-card-label">Attendance Rate</div>
                        <div className="stat-card-sub-label">Event attendance</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-card-icon stat-card-icon--applications">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div className="stat-card-content">
                        <div className="stat-card-value">
                          {charityStatistics.total_applications || 0}
                        </div>
                        <div className="stat-card-label">Program Applications</div>
                        <div className="stat-card-sub-label">By beneficiaries</div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            ) : (
              <div className="dashboard-empty">
                <p>No statistics available</p>
              </div>
            )}
          </div>

          {/* Charts */}
          {(ministryStatistics || charityStatistics) && (
            <div className="charts-section">
              <h3 className="dashboard-stats-title">Analytics & Charts</h3>
              <div className="charts-grid">
                {isMinistryUser && ministryStatistics && (
                  <>
                    {Array.isArray(ministryStatistics.applications_by_status) &&
                      ministryStatistics.applications_by_status.length > 0 ? (
                      <div className="chart-card">
                        <h3 className="chart-title">Applications by Status</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={ministryStatistics.applications_by_status.map(
                                (item) => ({
                                  name: item.status || "Unknown",
                                  value: item.count || 0,
                                })
                              )}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value, percent }) =>
                                `${name}: ${value} (${(percent * 100).toFixed(
                                  0
                                )}%)`
                              }
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {ministryStatistics.applications_by_status.map(
                                (_, index) => {
                                  const colors = [
                                    "#4f3aa7",
                                    "#6d4fc7",
                                    "#b39cff",
                                    "#ef4444",
                                    "#ff9800",
                                  ];
                                  return (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={colors[index % colors.length]}
                                    />
                                  );
                                }
                              )}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="chart-card">
                        <h3 className="chart-title">Applications by Status</h3>
                        <div className="chart-empty">
                          <p>No applications data available</p>
                        </div>
                      </div>
                    )}

                    {Array.isArray(ministryStatistics.applications_by_program) &&
                      ministryStatistics.applications_by_program.length > 0 ? (
                      <div className="chart-card">
                        <h3 className="chart-title">Applications by Program</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={ministryStatistics.applications_by_program.map(
                              (item) => ({
                                name: item.program__name || "Unknown Program",
                                applications: item.count || 0,
                              })
                            )}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="applications"
                              fill="#4f3aa7"
                              name="Applications"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="chart-card">
                        <h3 className="chart-title">Applications by Program</h3>
                        <div className="chart-empty">
                          <p>No applications by program data available</p>
                        </div>
                      </div>
                    )}

                    {Array.isArray(ministryStatistics.programs_summary) &&
                      ministryStatistics.programs_summary.length > 0 ? (
                      <div className="chart-card chart-card--wide">
                        <h3 className="chart-title">Programs Performance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={ministryStatistics.programs_summary}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="total_applications"
                              fill="#4f3aa7"
                              name="Applications"
                            />
                            <Bar
                              dataKey="unique_beneficiaries"
                              fill="#b39cff"
                              name="Beneficiaries"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="chart-card chart-card--wide">
                        <h3 className="chart-title">Programs Performance</h3>
                        <div className="chart-empty">
                          <p>No programs performance data available</p>
                        </div>
                      </div>
                    )}

                    {Array.isArray(ministryStatistics.applications_over_time) &&
                      ministryStatistics.applications_over_time.length > 0 ? (
                      <div className="chart-card">
                        <h3 className="chart-title">
                          Applications Trend (Last 30 Days)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={ministryStatistics.applications_over_time}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                              dataKey="day"
                              tick={{ fontSize: 10 }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#4f3aa7"
                              strokeWidth={2}
                              name="Applications"
                              dot={{ fill: "#4f3aa7", r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="chart-card">
                        <h3 className="chart-title">
                          Applications Trend (Last 30 Days)
                        </h3>
                        <div className="chart-empty">
                          <p>No trend data available</p>
                        </div>
                      </div>
                    )}

                    {Array.isArray(ministryStatistics.applications_by_charity) &&
                      ministryStatistics.applications_by_charity.length > 0 ? (
                      <div className="chart-card">
                        <h3 className="chart-title">Top Charities by Applications</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={ministryStatistics.applications_by_charity.map(
                              (item) => ({
                                name:
                                  item["beneficiary__charity__name"] || "Unknown",
                                applications: item.count || 0,
                              })
                            )}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis
                              type="category"
                              dataKey="name"
                              tick={{ fontSize: 11 }}
                              width={150}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="applications"
                              fill="#6d4fc7"
                              name="Applications"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="chart-card">
                        <h3 className="chart-title">Top Charities by Applications</h3>
                        <div className="chart-empty">
                          <p>No charity data available</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isCharityAdmin && charityStatistics && (
                  <>
                    {Array.isArray(charityStatistics.applications_by_status) &&
                      charityStatistics.applications_by_status.length > 0 ? (
                      <div className="chart-card">
                        <h3 className="chart-title">Applications by Status</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={charityStatistics.applications_by_status.map(
                                (item) => ({
                                  name: item.status || "Unknown",
                                  value: item.count || 0,
                                })
                              )}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value, percent }) =>
                                `${name}: ${value} (${(percent * 100).toFixed(
                                  0
                                )}%)`
                              }
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {charityStatistics.applications_by_status.map(
                                (_, index) => {
                                  const colors = [
                                    "#4f3aa7",
                                    "#6d4fc7",
                                    "#b39cff",
                                    "#ef4444",
                                    "#ff9800",
                                  ];
                                  return (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={colors[index % colors.length]}
                                    />
                                  );
                                }
                              )}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="chart-card">
                        <h3 className="chart-title">Applications by Status</h3>
                        <div className="chart-empty">
                          <p>No applications data available</p>
                        </div>
                      </div>
                    )}

                    {Array.isArray(charityStatistics.registrations_by_event) &&
                      charityStatistics.registrations_by_event.length > 0 ? (
                      <div className="chart-card">
                        <h3 className="chart-title">Registrations by Event</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={charityStatistics.registrations_by_event.map(
                              (item) => ({
                                name: item.event__title || "Unknown Event",
                                registrations: item.count || 0,
                              })
                            )}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="registrations"
                              fill="#4f3aa7"
                              name="Registrations"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="chart-card">
                        <h3 className="chart-title">Registrations by Event</h3>
                        <div className="chart-empty">
                          <p>No registrations data available</p>
                        </div>
                      </div>
                    )}

                    {Array.isArray(charityStatistics.registrations_over_time) &&
                      charityStatistics.registrations_over_time.length > 0 ? (
                      <div className="chart-card">
                        <h3 className="chart-title">
                          Registrations Trend (Last 30 Days)
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={charityStatistics.registrations_over_time}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                              dataKey="day"
                              tick={{ fontSize: 10 }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#4f3aa7"
                              strokeWidth={2}
                              name="Registrations"
                              dot={{ fill: "#4f3aa7", r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="chart-card">
                        <h3 className="chart-title">
                          Registrations Trend (Last 30 Days)
                        </h3>
                        <div className="chart-empty">
                          <p>No trend data available</p>
                        </div>
                      </div>
                    )}

                    {Array.isArray(charityStatistics.applications_by_program) &&
                      charityStatistics.applications_by_program.length > 0 ? (
                      <div className="chart-card">
                        <h3 className="chart-title">Applications by Program</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={charityStatistics.applications_by_program.map(
                              (item) => ({
                                name: item.program__name || "Unknown Program",
                                applications: item.count || 0,
                              })
                            )}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis
                              type="category"
                              dataKey="name"
                              tick={{ fontSize: 11 }}
                              width={150}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="applications"
                              fill="#6d4fc7"
                              name="Applications"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="chart-card">
                        <h3 className="chart-title">Applications by Program</h3>
                        <div className="chart-empty">
                          <p>No applications by program data available</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {isMinistryUser &&
            ministryStatistics &&
            Array.isArray(ministryStatistics.programs_summary) &&
            ministryStatistics.programs_summary.length > 0 && (
              <div className="programs-summary-section">
                <h3 className="dashboard-stats-title">Programs Breakdown</h3>
                <div className="programs-summary-grid">
                  {ministryStatistics.programs_summary.map((program) => (
                    <div key={program.id} className="program-summary-card">
                      <h4>{program.name}</h4>
                      <div className="program-summary-stats">
                        <div className="summary-stat">
                          <span className="summary-stat-value">
                            {program.total_applications || 0}
                          </span>
                          <span className="summary-stat-label">Applications</span>
                        </div>
                        <div className="summary-stat">
                          <span className="summary-stat-value">
                            {program.unique_beneficiaries || 0}
                          </span>
                          <span className="summary-stat-label">Beneficiaries</span>
                        </div>
                        <div className="summary-stat">
                          <span
                            className={`summary-stat-status summary-stat-status--${String(
                              program.status || ""
                            ).toLowerCase()}`}
                          >
                            {program.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {isCharityAdmin && charityStatistics && (
            <>
              {Array.isArray(charityStatistics.events_summary) &&
                charityStatistics.events_summary.length > 0 && (
                  <div className="programs-summary-section">
                    <h3 className="dashboard-stats-title">Events Summary</h3>
                    <div className="programs-summary-grid">
                      {charityStatistics.events_summary.map((event) => (
                        <div key={event.id} className="program-summary-card">
                          <h4>{event.title}</h4>
                          <div className="program-summary-stats">
                            <div className="summary-stat">
                              <span className="summary-stat-value">
                                {event.total_registrations || 0}
                              </span>
                              <span className="summary-stat-label">
                                Registrations
                              </span>
                            </div>
                            <div className="summary-stat">
                              <span className="summary-stat-value">
                                {event.attended_count || 0}
                              </span>
                              <span className="summary-stat-label">Attended</span>
                            </div>
                            <div className="summary-stat">
                              <span
                                className={`summary-stat-status summary-stat-status--${event.is_active ? "active" : "inactive"
                                  }`}
                              >
                                {event.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                          <div
                            style={{
                              marginTop: "0.5rem",
                              fontSize: "0.9rem",
                              color: "#666",
                            }}
                          >
                            Capacity: {event.current_registrations || 0} /{" "}
                            {event.max_capacity || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {Array.isArray(charityStatistics.upcoming_events) &&
                charityStatistics.upcoming_events.length > 0 && (
                  <div className="programs-summary-section">
                    <h3 className="dashboard-stats-title">
                      Upcoming Events (Next 7 Days)
                    </h3>
                    <div className="programs-summary-grid">
                      {charityStatistics.upcoming_events.map((event) => (
                        <div key={event.id} className="program-summary-card">
                          <h4>{event.title}</h4>
                          <div className="program-summary-stats">
                            <div className="summary-stat">
                              <span className="summary-stat-value">
                                {new Date(event.event_date).toLocaleDateString()}
                              </span>
                              <span className="summary-stat-label">Date</span>
                            </div>
                            <div className="summary-stat">
                              <span className="summary-stat-value">
                                {event.location}
                              </span>
                              <span className="summary-stat-label">Location</span>
                            </div>
                            <div className="summary-stat">
                              <span className="summary-stat-value">
                                {event.current_registrations || 0} /{" "}
                                {event.max_capacity || 0}
                              </span>
                              <span className="summary-stat-label">
                                Registrations
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
