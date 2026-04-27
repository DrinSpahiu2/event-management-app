import { Navigate, Route, Routes } from "react-router-dom";

import AdminDashboard from "./layout/AdminDashboard.jsx";
import Sponsor from "./layout/Sponsor.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import LandingPage from "./landing/LandingPage.jsx";
import SignIn from "./signin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/sponsor" element={<Sponsor />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

