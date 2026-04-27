import { NavLink, useNavigate } from "react-router-dom";
import { upcomingEvents } from "./eventsData.js";

function UserEventsPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-[#10141d] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/90">
              <span className="font-black">E</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-widest text-white/90">
                EVENT EMS
              </div>
              <div className="text-xs text-white/50">Member Area</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <NavLink className="hover:text-white" to="/">
              Home
            </NavLink>
            <NavLink className="hover:text-white" to="/events">
              Events
            </NavLink>
            <NavLink className="hover:text-white" to="/about">
              About
            </NavLink>
            <NavLink className="hover:text-white" to="/contact">
              Contact
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,80,80,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-14">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              LOGGED IN EXPERIENCE
            </div>
            <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">
              Welcome back, explore and book upcoming events
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-white/65 sm:text-base">
              View every upcoming event individually, leave feedback, and secure
              your tickets in a few clicks.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
            <p className="text-sm text-white/60">
              Swipe horizontally and select an event card.
            </p>
          </div>

          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
            {upcomingEvents.map((event) => (
              <article
                key={event.id}
                className="min-w-[280px] max-w-[320px] snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{event.date}</p>
                  <p className="text-sm text-white/70">{event.location}</p>
                  <p className="mt-2 text-sm text-white/60">
                    Ticket from ${event.price}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="mt-4 w-full rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500"
                  >
                    View Event
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserEventsPage;
