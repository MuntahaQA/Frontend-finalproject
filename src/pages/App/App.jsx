import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "../HomePage";
import AboutPage from "../AboutPage";
import ProgramsPage from "../ProgramsPage";
import EventsPage from "../EventsPage";
import BeneficiariesPage from "../BeneficiariesPage";
import LoginPage from "../LoginPage";
import SignupPage from "../SignupPage";
import ProfilePage from "../ProfilePage";
import DashboardPage from "../DashboardPage";
import { getCurrentUser } from "../../utilities/api";
import "./App.css";

function isAuthenticated() {
  const token = localStorage.getItem("token");
  return Boolean(token);
}

function getRoleFlags() {
  const user = getCurrentUser();
  const isMinistryUser = Boolean(user?.is_superuser);
  const isCharityAdmin = Boolean(user?.charity_admin);
  return { user, isMinistryUser, isCharityAdmin };
}

function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function RoleRoute({ children, allowMinistry, allowCharityAdmin }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const { isMinistryUser, isCharityAdmin } = getRoleFlags();

  const isAllowed =
    (allowMinistry && isMinistryUser) ||
    (allowCharityAdmin && isCharityAdmin);

  if (!isAllowed) {
    return <Navigate to="/"/>;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />

      {/* Authenticated (any user) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Role-protected */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute allowMinistry allowCharityAdmin>
            <DashboardPage />
          </RoleRoute>
        }
      />
      <Route
        path="/beneficiaries"
        element={
          <RoleRoute allowCharityAdmin>
            <BeneficiariesPage />
          </RoleRoute>
        }
      />
      <Route path="/events" element={<EventsPage />} />

      <Route path="*" element={<Navigate to="/"/>} />
    </Routes>
  );
}
