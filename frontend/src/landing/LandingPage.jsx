import { NavLink } from "react-router-dom";

const featureCards = [
  {
    title: "Plan Faster",
    description:
      "Build schedules, assign speakers, and manage tracks with an organized dashboard.",
  },
  {
    title: "Engage Attendees",
    description:
      "Deliver announcements, reminders, and live updates to keep every session active.",
  },
  {
    title: "Measure Impact",
    description:
      "Track registrations, attendance, and post-event insights in one place.",
  },
];

const events = [
  {
    name: "Tech Leadership Summit",
    date: "May 24, 2026",
    location: "Prishtine",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Creative Product Day",
    date: "June 02, 2026",
    location: "Tirana",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Startup Networking Night",
    date: "June 18, 2026",
    location: "Prizren",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80",
  },
];

function LandingPage() {
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
              <div className="text-xs text-white/50">Event Management</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex text-sm text-white/70">
            <NavLink className="hover:text-white" to="/">
              Home
            </NavLink>
            <NavLink className="hover:text-white" to="/about">
              About
            </NavLink>
            <NavLink className="hover:text-white" to="/about#speakers">
              Speakers
            </NavLink>
            <NavLink className="hover:text-white" to="/about#insights">
              Insights
            </NavLink>
            <NavLink className="hover:text-white" to="/contact">
              Contact
            </NavLink>
          </nav>

          <NavLink
            to="/signin"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Get Started
          </NavLink>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,80,80,0.12),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              MODERN EVENT EXPERIENCE
            </div>

            <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-5xl">
              Manage events with confidence and style
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              From registration to post-event analytics, Event EMS gives your team
              everything needed to run engaging conferences and community events.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <NavLink
                to="/about"
                className="rounded-md bg-red-600 px-5 py-3 text-center text-sm font-semibold hover:bg-red-500"
              >
                Explore Platform
              </NavLink>
              <NavLink
                to="/contact"
                className="rounded-md border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white/80 hover:bg-white/10"
              >
                Contact Team
              </NavLink>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-4">
                <div className="text-xl font-semibold">350+</div>
                <div className="text-xs text-white/55">Events</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-4">
                <div className="text-xl font-semibold">25K+</div>
                <div className="text-xs text-white/55">Attendees</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-4">
                <div className="text-xl font-semibold">99%</div>
                <div className="text-xs text-white/55">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <img
              src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80"
              alt="Conference presentation"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <div className="text-xs font-semibold tracking-widest text-red-500">
            WHY EVENT EMS
          </div>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Built for teams that run great events
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0f16]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold tracking-widest text-red-500">
                UPCOMING EVENTS
              </div>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                Discover what is coming next
              </h2>
            </div>
            <NavLink
              to="/about"
              className="text-sm font-semibold text-white/70 hover:text-white"
            >
              View all events &rarr;
            </NavLink>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.name}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <h3 className="text-base font-semibold">{event.name}</h3>
                  <div className="mt-2 text-sm text-white/65">{event.date}</div>
                  <div className="text-sm text-white/50">{event.location}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#07142e]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/90">
                  <span className="font-black">E</span>
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-widest text-white/90">
                    EVENT EMS
                  </div>
                  <div className="text-xs text-white/50">Event Management</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                A modern platform for planning, running, and learning from events
                with confidence.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">Useful Links</div>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li>
                  <NavLink to="/" className="hover:text-white">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className="hover:text-white">
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className="hover:text-white">
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">Events Details</div>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li>Conference Tracks</li>
                <li>Workshops &amp; Talks</li>
                <li>Networking Sessions</li>
                <li>Post-event Reports</li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">Subscribe</div>
              <p className="mt-3 text-sm text-white/60">
                Get updates about events and platform improvements.
              </p>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/60"
                />
                <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500">
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
            Copyright &copy; {new Date().getFullYear()} Event EMS. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
