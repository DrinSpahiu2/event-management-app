import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminUsersList from "./AdminUsersList.jsx"; //

import AdminEvents from "./AdminEvents.jsx";
import ManagerPurchases from "./ManagerPurchases.jsx";

const clearSession = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
};
const sidebarLinks = ["Dashboard", "Users List", "Upcoming Event", "Purchases"];

function formatIncome(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function AdminDashboard() {
  const [activeView, setActiveView] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    futureEventsCount: 0,
    soldTickets: 0,
    income: 0,
    futureEvents: [],
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    loadDashboardStats();
  }, []);

  async function loadDashboardStats() {
    setStatsLoading(true);

    setStatsError("");
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setDashboardStats(data);
    } catch (err) {
      setStatsError(
        err.message ||
          "Nuk u lidh me serverin. Nis backend-in (npm run dev në backend).",
      );
    } finally {
      setStatsLoading(false);
    }
  }

  const statCards = useMemo(
    () => [
      {
        label: "Future Events",
        value: statsLoading
          ? "…"
          : String(dashboardStats.futureEventsCount ?? 0),
        icon: "📅",
      },
      {
        label: "Sold Tickets",
        value: statsLoading ? "…" : String(dashboardStats.soldTickets ?? 0),
        icon: "🎟",
      },
      {
        label: "Income",
        value: statsLoading ? "…" : formatIncome(dashboardStats.income),
        icon: "💰",
      },
      {
        label: "Upcoming Listed",
        value: statsLoading
          ? "…"
          : String(dashboardStats.futureEvents?.length ?? 0),
        icon: "📋",
      },
    ],
    [dashboardStats, statsLoading],
  );
  return (
    <div className="min-h-screen grid grid-cols-1 bg-[#10141d] text-slate-100 lg:grid-cols-[250px_1fr]">
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-300 lg:relative lg:z-auto lg:h-auto lg:w-auto lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col gap-7 bg-gradient-to-b from-[#ff9f1a] to-[#ff7a00] p-5 lg:p-4`}
      >
        <div className="flex items-center justify-between">
          <h1 className="m-0 flex items-center gap-2 text-2xl font-semibold text-[#1f1f1f] lg:text-[24px]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1f1f1f] text-base text-[#ff9f1a]">
              ◎
            </span>
            <span>Event EMS</span>
          </h1>
          <button
            onClick={() => setMenuOpen(false)}
            className="lg:hidden rounded-md p-1 text-[#1f1f1f] hover:bg-white/20"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2.5" aria-label="Sidebar Navigation">
          {sidebarLinks.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveView(item);
                setMenuOpen(false);
              }}
              className={`rounded-[10px] border-0 px-3 py-2.5 text-left text-[15px] text-[#fff6e8] transition hover:bg-white/15 ${
                item === activeView
                  ? "bg-[#10141d]/20 font-semibold text-white"
                  : ""
              }`}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="relative bg-[#151a23] p-4 sm:p-5 lg:p-6">
        {/* Keep logout always visible (also works if something pushes content down) */}
        <header className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 w-full max-w-[520px]">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden rounded-md p-2 text-white hover:bg-white/10 bg-white/5 border border-white/10"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 000 2h12a1 1 0 100-2H4z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <input
              className="w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
              type="text"
              placeholder="Search Here . . ."
              aria-label="Search"
            />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-sm text-[#b6c0cf] w-full">
            <span>English</span>
            <span className="hidden sm:inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-[#44b7ff] to-[#6ad3ff] text-[13px] font-bold text-[#04131f]">
              JS
            </span>
            <span className="hidden sm:inline text-sm text-[#f3f6fb]">
              Jhon Smith
            </span>
            <button
              type="button"
              onClick={() => {
                clearSession();
                navigate("/signin");
              }}
              className="ml-0 sm:ml-3 rounded-md bg-red-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-500 transition"
            >
              Logout
            </button>
          </div>
        </header>
        
        <section className="my-4 text-xs sm:text-sm text-[#97a2b6]">
          <p>Home / {activeView}</p>
        </section>

        {/* 🚀 Dynamic Rendering Area */}
        {activeView === "Users List" ? (
          <AdminUsersList />
        ) : activeView === "Upcoming Event" ? (
          <AdminEvents />
        ) : activeView === "Purchases" ? (
          <ManagerPurchases />
        ) : activeView === "Dashboard" ? (
          <>
            {statsError ? (
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <p className="m-0 text-sm text-rose-300">{statsError}</p>
                <button
                  type="button"
                  onClick={loadDashboardStats}
                  className="rounded-md border border-rose-400/30 px-3 py-1.5 text-sm text-rose-100 hover:bg-rose-500/10"
                >
                  Rifresko
                </button>
              </div>
            ) : null}
            <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <article
                  key={card.label}
                  className="flex items-center justify-between rounded-xl border border-[#283143] bg-[#1b212c] p-4"
                >
                  <div>
                    <h2 className="m-0 text-[34px] leading-none text-white">
                      {card.value}
                    </h2>
                    <p className="mt-1.5 text-sm text-[#9ca6b7]">
                      {card.label}
                    </p>
                  </div>
                  <span
                    className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#2b3446] text-lg"
                    aria-hidden="true"
                  >
                    {card.icon}
                  </span>
                </article>
              ))}
            </section>

            {/* Your original graph & traffic display */}
            <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.15fr_1fr]">
              <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
                <div className="mb-3.5 flex items-center justify-between">
                  <h3 className="m-0 text-xl text-[#f4f7fb]">Web Traffic</h3>
                  <p className="m-0 text-[13px] text-[#8f9ab0]">January 2026</p>
                </div>
                <div className="relative h-[300px] overflow-hidden rounded-[10px] border border-[#2b3446] bg-[#171d27]">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:100%_48px]"></div>
                  <div
                    className="absolute inset-x-0 bottom-0 h-[72%] rounded-t-xl bg-[linear-gradient(180deg,rgba(252,52,93,0.56),rgba(252,52,93,0.1))]"
                    style={{
                      clipPath:
                        "polygon(0 85%, 8% 74%, 18% 77%, 29% 54%, 42% 63%, 55% 45%, 68% 52%, 80% 24%, 90% 28%, 100% 12%, 100% 100%, 0 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-x-0 bottom-0 h-[72%] rounded-t-xl bg-[linear-gradient(180deg,rgba(255,129,156,0.56),rgba(255,129,156,0.12))]"
                    style={{
                      clipPath:
                        "polygon(0 88%, 12% 78%, 24% 66%, 38% 58%, 50% 69%, 62% 59%, 76% 41%, 88% 50%, 100% 47%, 100% 100%, 0 100%)",
                    }}
                  ></div>
                </div>
              </article>
              <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
                <div className="mb-3.5 flex items-center justify-between">
                  <h3 className="m-0 text-xl text-[#f4f7fb]">Future Events</h3>
                  <button
                    type="button"
                    onClick={loadDashboardStats}
                    className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5"
                  >
                    Rifresko
                  </button>
                </div>
                <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                  {statsLoading ? (
                    <li className="text-[13px] text-[#95a2ba]">
                      Duke ngarkuar...
                    </li>
                  ) : null}
                  {!statsLoading &&
                  (dashboardStats.futureEvents?.length ?? 0) === 0 ? (
                    <li className="text-[13px] text-[#95a2ba]">
                      Nuk ka evente të ardhshme.
                    </li>
                  ) : null}
                  {(dashboardStats.futureEvents || []).map((event) => (
                    <li
                      key={event.id}
                      className="flex items-center gap-2.5 rounded-[10px] border border-[#293346] bg-[#161d27] p-2.5"
                    >
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#ef4360] to-[#f58b63] text-[17px] font-bold text-white">
                        {event.host?.[0] || "E"}
                      </div>
                      <div>
                        <h4 className="m-0 text-[15px] text-[#f8fbff]">
                          {event.title}
                        </h4>
                        <p className="mt-1 text-[13px] text-[#95a2ba]">
                          {event.host} · {event.date} · {event.time} ·{" "}
                          {event.location}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>{" "}
            </section>
          </>
        ) : (
          /* Fallback view for other undeveloped tabs */
          <div className="p-10 border border-[#283143] bg-[#1b212c] rounded-xl text-center text-[#95a2ba]">
            {activeView} content section coming soon...
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
