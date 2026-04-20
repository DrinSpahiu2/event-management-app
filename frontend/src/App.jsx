import { Navigate, Route, Routes } from "react-router-dom";

import AdminDashboard from "./layout/AdminDashboard.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import SignIn from "./signin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

