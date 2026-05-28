import { Navigate, Route, Routes } from "react-router-dom";

import AdminDashboard from "./layout/AdminDashboard.jsx";
import EventDetailsPage from "./layout/EventDetailsPage.jsx";
import Sponsor from "./layout/Sponsor.jsx";
import TicketCheckoutPage from "./layout/TicketCheckoutPage.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import LandingPage from "./landing/LandingPage.jsx";
import SignIn from "./signin.jsx";
import UserEventsPage from "./layout/UserEventsPage.jsx";
import Menaxher from "./layout/Menaxher.jsx";
import SpeakerDashboard from "./layout/SpeakerDashboard.jsx";

// Protected Route Component that handles permissions
function ProtectedRoute({ children, allowedRoles }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole"); // Reads 'SuperAdmin', 'Manager', etc.

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Kicks unauthorized users back to the home page
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* 👑 SuperAdmin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["SuperAdmin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 💼 Manager Dashboard */}
      <Route
        path="/menaxher"
        element={
          <ProtectedRoute allowedRoles={["Manager"]}>
            <Menaxher />
          </ProtectedRoute>
        }
      />

      {/* 🎤 Speaker Dashboard */}
      <Route
        path="/speaker"
        element={
          <ProtectedRoute allowedRoles={["Speaker"]}>
            <SpeakerDashboard />
          </ProtectedRoute>
        }
      />

      {/* 🤝 Sponsor Dashboard */}
      <Route
        path="/sponsors"
        element={
          <ProtectedRoute allowedRoles={["Sponsor"]}>
            <Sponsor />
          </ProtectedRoute>
        }
      />

      {/* 👥 Client / Attendee Ecosystem */}
      <Route
        path="/events"
        element={
          <ProtectedRoute allowedRoles={["Client", "SuperAdmin"]}>
            <UserEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:eventId"
        element={
          <ProtectedRoute allowedRoles={["Client", "SuperAdmin"]}>
            <EventDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:eventId/checkout"
        element={
          <ProtectedRoute allowedRoles={["Client", "SuperAdmin"]}>
            <TicketCheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Global Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
