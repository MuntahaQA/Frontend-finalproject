import sendRequest from "./sendRequest";

export const API_BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
    // Auth
    LOGIN: "/users/login/",
    SIGNUP: "/users/signup/",
    USER_PROFILE: "/users/profile/",
    TOKEN_REFRESH: "/users/token/refresh/",
    REGISTER_CHARITY: "/charities/register/",
    REGISTER_MINISTRY: "/ministries/register/",

    // Charities & Beneficiaries
    CHARITIES: "/charities/",
    BENEFICIARIES: "/beneficiaries/",

    // Programs
    PROGRAMS: "/programs/",
    PROGRAM_DETAIL: (id) => `/programs/${id}/`,
    PROGRAM_APPLICATIONS: (id) => `/programs/${id}/applications/`,
    PROGRAM_STATISTICS: (id) => `/programs/${id}/statistics/`,

    // Statistics
    MINISTRY_STATISTICS: "/ministry/statistics/",
    CHARITY_STATISTICS: "/charity/statistics/",

    // Events
    EVENTS: "/events/",
    EVENT_DETAIL: (id) => `/events/${id}/`,
    EVENT_REGISTRATIONS: (id) => `/events/${id}/registrations/`,
    EVENT_REGISTRATION_DETAIL: (eventId, regId) =>
        `/events/${eventId}/registrations/${regId}/`,
};

export function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user || null;
    } catch {
        return null;
    }
}

// Example usage helpers
export async function loginUser(email, password) {
    return sendRequest(API_ENDPOINTS.LOGIN, "POST", { email, password });
}

export async function fetchUserProfile() {
    return sendRequest(API_ENDPOINTS.USER_PROFILE, "GET");
}

export async function fetchPrograms() {
    return sendRequest(API_ENDPOINTS.PROGRAMS, "GET");
}

export async function fetchEvents() {
    return sendRequest(API_ENDPOINTS.EVENTS, "GET");
}

export async function fetchMinistryStatistics(params = "") {
    return sendRequest(`${API_ENDPOINTS.MINISTRY_STATISTICS}${params}`, "GET");
}

export async function fetchCharityStatistics(params = "") {
    return sendRequest(`${API_ENDPOINTS.CHARITY_STATISTICS}${params}`, "GET");
}

// Registration helpers (expect FormData)
export async function registerCharity(formData) {
    return sendRequest(API_ENDPOINTS.REGISTER_CHARITY, "POST", formData);
}

export async function registerMinistry(formData) {
    return sendRequest(API_ENDPOINTS.REGISTER_MINISTRY, "POST", formData);
}
