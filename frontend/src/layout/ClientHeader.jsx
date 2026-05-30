import { NavLink, useNavigate } from "react-router-dom";

function navLinkClass({ isActive }) {
  return `transition ${isActive ? "text-white font-semibold" : "text-white/70 hover:text-white"}`;
}

export default function ClientHeader({ subtitle = "Client Area" }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/signin");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/90">
            <span className="font-black">E</span>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-widest text-white/90">EVENT EMS</div>
            <div className="text-xs text-white/50">{subtitle}</div>
          </div>
        </div>

        <nav className="flex items-center gap-5 text-sm">
          <NavLink to="/events" className={navLinkClass} end>
            Events
          </NavLink>
          <NavLink to="/my-tickets" className={navLinkClass}>
            My Tickets
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
