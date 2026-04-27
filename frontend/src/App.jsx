import { Navigate, Route, Routes } from "react-router-dom";

import AdminDashboard from "./layout/AdminDashboard.jsx";
import EventDetailsPage from "./layout/EventDetailsPage.jsx";
import TicketCheckoutPage from "./layout/TicketCheckoutPage.jsx";
import UserEventsPage from "./layout/UserEventsPage.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import LandingPage from "./landing/LandingPage.jsx";
import SignIn from "./signin.jsx";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <UserEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:eventId"
        element={
          <ProtectedRoute>
            <EventDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:eventId/checkout"
        element={
          <ProtectedRoute>
            <TicketCheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

