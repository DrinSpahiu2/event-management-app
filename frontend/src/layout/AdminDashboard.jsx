import { useState } from "react";
import AdminUsersList from "./AdminUsersList.jsx"; // 👈 Import the clean component here

const sidebarLinks = [
  "Dashboard",
  "Users List",
  "Speaker List",
  "Attendant List",
  "Upcoming Event",
  "Calendar",
  "Venue",
  "Profile",
];

const statCards = [
  { label: "Total Registration", value: "1250+", icon: "👥" },
  { label: "Total Speakers", value: "125+", icon: "🎤" },
  { label: "New Events", value: "35", icon: "📅" },
  { label: "Total Ticket Sold", value: "2560+", icon: "🎟" },
];

const scheduleEvents = [
  {
    title: "Digital Business Summit - 2026",
    host: "Andru Hebo",
    time: "9:00am - 5:00pm",
    location: "California, CA",
  },
  {
    title: "NASA Space Apps Challenge - 2026",
    host: "Tom Cruse",
    time: "10:00am - 3:00pm",
    location: "San Francisco, CA",
  },
  {
    title: "Product Design Conference - 2026",
    host: "Linda Shafer",
    time: "8:00am - 1:00pm",
    location: "Los Angeles, CA",
  },
];

function AdminDashboard() {
  // 👈 Add a tracking state to switch content screens
  const [activeView, setActiveView] = useState("Dashboard");

  return (
    <div className="min-h-screen grid grid-cols-1 bg-[#10141d] text-slate-100 lg:grid-cols-[250px_1fr]">
      <aside className="flex flex-col gap-7 bg-gradient-to-b from-[#ff9f1a] to-[#ff7a00] p-5 lg:p-4">
        <h1 className="m-0 flex items-center gap-2 text-2xl font-semibold text-[#1f1f1f] lg:text-[24px]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1f1f1f] text-base text-[#ff9f1a]">
            ◎
          </span>
          <span>Event EMS</span>
        </h1>

        <nav className="flex flex-col gap-2.5" aria-label="Sidebar Navigation">
          {sidebarLinks.map((item) => (
            <button
              key={item}
              onClick={() => setActiveView(item)} // 👈 Changes view when sidebar item is clicked
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

      <main className="bg-[#151a23] p-4 sm:p-5 lg:p-6">
        <header className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="w-full max-w-[520px]">
            <input
              className="w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
              type="text"
              placeholder="Search Here . . ."
              aria-label="Search"
            />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-sm text-[#b6c0cf]">
            <span>English</span>
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-[#44b7ff] to-[#6ad3ff] text-[13px] font-bold text-[#04131f]">
              JS
            </span>
            <span className="text-sm text-[#f3f6fb]">Jhon Smith</span>
          </div>
        </header>

        <section className="my-4 text-sm text-[#97a2b6]">
          <p>Home / {activeView}</p>
        </section>

        {/* 🚀 Dynamic Rendering Area */}
        {activeView === "Users List" ? (
          <AdminUsersList /> // 👈 Renders your clean separate file component
        ) : activeView === "Dashboard" ? (
          <>
            {/* Your original stats display */}
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
                  <h3 className="m-0 text-xl text-[#f4f7fb]">
                    Schedule Events
                  </h3>
                </div>
                <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                  {scheduleEvents.map((event) => (
                    <li
                      key={event.title}
                      className="flex items-center gap-2.5 rounded-[10px] border border-[#293346] bg-[#161d27] p-2.5"
                    >
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#ef4360] to-[#f58b63] text-[17px] font-bold text-white">
                        {event.host[0]}
                      </div>
                      <div>
                        <h4 className="m-0 text-[15px] text-[#f8fbff]">
                          {event.title}
                        </h4>
                        <p className="mt-1 text-[13px] text-[#95a2ba]">
                          {event.host} · {event.time} · {event.location}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
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
