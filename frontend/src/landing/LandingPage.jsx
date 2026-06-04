import { NavLink } from "react-router-dom";
import { useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#10141d] text-white overflow-x-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#10141d]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600/90">
              <span className="font-black">E</span>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest text-white/90 sm:text-sm">
                EVENT EMS
              </div>
              <div className="text-[10px] text-white/50 sm:text-xs">Event Management</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex text-sm text-white/70">
            <NavLink className="hover:text-white" to="/">Home</NavLink>
            <NavLink className="hover:text-white" to="/about">About</NavLink>
            <NavLink className="hover:text-white" to="/about#speakers">Speakers</NavLink>
            <NavLink className="hover:text-white" to="/about#insights">Insights</NavLink>
            <NavLink className="hover:text-white" to="/contact">Contact</NavLink>
          </nav>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-2 sm:gap-4">
            <NavLink
              to="/signin"
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 sm:px-4 sm:py-2 sm:text-sm"
            >
              Get Started
            </NavLink>
            
            {/* Mobile Burger Trigger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="rounded-md p-2 text-white hover:bg-white/10 bg-white/5 border border-white/10 md:hidden"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 000 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <nav className="absolute left-0 right-0 top-full z-40 border-b border-white/10 bg-[#10141d] md:hidden shadow-xl animate-fadeIn">
            <div className="px-4 py-4 space-y-1">
              <NavLink to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/5 text-sm">Home</NavLink>
              <NavLink to="/about" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/5 text-sm">About</NavLink>
              <NavLink to="/about#speakers" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/5 text-sm">Speakers</NavLink>
              <NavLink to="/about#insights" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/5 text-sm">Insights</NavLink>
              <NavLink to="/contact" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/5 text-sm">Contact</NavLink>
            </div>
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,80,80,0.12),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-2 sm:px-6 lg:py-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] tracking-wider text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              MODERN EVENT EXPERIENCE
            </div>

            <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Manage events with confidence and style
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              From registration to post-event analytics, Event EMS gives your
              team everything needed to run engaging conferences and community events.
            </p>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <NavLink to="/about" className="rounded-md bg-red-600 px-5 py-3 text-center text-sm font-semibold hover:bg-red-500 w-full sm:w-auto">
                Explore Platform
              </NavLink>
              <NavLink to="/contact" className="rounded-md border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white/80 hover:bg-white/10 w-full sm:w-auto">
                Contact Team
              </NavLink>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid w-full grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-3 sm:py-4">
                <div className="text-lg font-semibold sm:text-xl">350+</div>
                <div className="text-[10px] text-white/55 sm:text-xs">Events</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-3 sm:py-4">
                <div className="text-lg font-semibold sm:text-xl">25K+</div>
                <div className="text-[10px] text-white/55 sm:text-xs">Attendees</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-3 sm:py-4">
                <div className="text-lg font-semibold sm:text-xl">99%</div>
                <div className="text-[10px] text-white/55 sm:text-xs">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Hero Image Wrapper */}
          <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-2 sm:p-3 max-w-lg mx-auto lg:max-w-none">
            <img
              src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80"
              alt="Conference presentation"
              className="h-48 w-full rounded-xl object-cover sm:h-64 md:h-80 lg:h-full"
            />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="text-center">
          <div className="text-[11px] font-semibold tracking-widest text-red-500">
            WHY EVENT EMS
          </div>
          <h2 className="mt-3 text-xl font-semibold sm:text-2xl lg:text-3xl">
            Built for teams that run great events
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {featureCards.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <h3 className="text-base font-semibold sm:text-lg">{feature.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section className="border-y border-white/10 bg-[#0b0f16]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <div className="text-[11px] font-semibold tracking-widest text-red-500">
                UPCOMING EVENTS
              </div>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl lg:text-3xl">
                Discover what is coming next
              </h2>
            </div>
            <NavLink to="/about" className="text-xs font-semibold text-white/70 hover:text-white sm:text-sm">
              View all events &rarr;
            </NavLink>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article key={event.name} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 mx-auto w-full max-w-sm sm:max-w-none">
                <img
                  src={event.image}
                  alt={event.name}
                  className="h-40 w-full object-cover sm:h-44"
                  loading="lazy"
                />
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-semibold sm:text-base">{event.name}</h3>
                  <div className="mt-2 text-xs text-white/65 sm:text-sm">{event.date}</div>
                  <div className="text-xs text-white/50 sm:text-sm">{event.location}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#07142e]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Branding Column */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/90">
                  <span className="font-black">E</span>
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-widest text-white/90">EVENT EMS</div>
                  <div className="text-xs text-white/50">Event Management</div>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/60 sm:text-sm">
                A modern platform for planning, running, and learning from events with confidence.
              </p>
            </div>

            {/* Links Column */}
            <div>
              <div className="text-sm font-semibold text-white">Useful Links</div>
              <ul className="mt-3 space-y-2 text-xs text-white/60 sm:text-sm">
                <li><NavLink to="/" className="hover:text-white">Home</NavLink></li>
                <li><NavLink to="/about" className="hover:text-white">About Us</NavLink></li>
                <li><NavLink to="/contact" className="hover:text-white">Contact</NavLink></li>
              </ul>
            </div>

            {/* Details Column */}
            <div>
              <div className="text-sm font-semibold text-white">Events Details</div>
              <ul className="mt-3 space-y-2 text-xs text-white/60 sm:text-sm">
                <li>Conference Tracks</li>
                <li>Workshops &amp; Talks</li>
                <li>Networking Sessions</li>
                <li>Post-event Reports</li>
              </ul>
            </div>

            {/* Subscribe Column */}
            <div>
              <div className="text-sm font-semibold text-white">Subscribe</div>
              <p className="mt-2 text-xs text-white/60 sm:text-sm">
                Get updates about events and platform improvements.
              </p>
              <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/60"
                />
                <button className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold hover:bg-red-500 sm:text-sm shrink-0">
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-[11px] text-white/50">
            Copyright &copy; {new Date().getFullYear()} Event EMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;