import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const AdminDashboard = lazy(() => import("./layout/AdminDashboard.jsx"));
const EventDetailsPage = lazy(() => import("./layout/EventDetailsPage.jsx"));
const Sponsor = lazy(() => import("./layout/Sponsor.jsx"));
const TicketCheckoutPage = lazy(() => import("./layout/TicketCheckoutPage.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const LandingPage = lazy(() => import("./landing/LandingPage.jsx"));
const SignIn = lazy(() => import("./signin.jsx"));
const UserEventsPage = lazy(() => import("./layout/UserEventsPage.jsx"));
const MyTicketsPage = lazy(() => import("./layout/MyTicketsPage.jsx"));
const Menaxher = lazy(() => import("./layout/Menaxher.jsx"));
const SpeakerDashboard = lazy(() => import("./layout/SpeakerDashboard.jsx"));

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
    <Suspense fallback={null}>
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

      {/* 👥 Client area */}
      <Route
        path="/events"
        element={
          <ProtectedRoute allowedRoles={["Client"]}>
            <UserEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tickets"
        element={
          <ProtectedRoute allowedRoles={["Client"]}>
            <MyTicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:eventId"
        element={
          <ProtectedRoute allowedRoles={["Client"]}>
            <EventDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:eventId/checkout"
        element={
          <ProtectedRoute allowedRoles={["Client"]}>
            <TicketCheckoutPage />
          </ProtectedRoute>
        }
      />
      

      {/* Global Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

