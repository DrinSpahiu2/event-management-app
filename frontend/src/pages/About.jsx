const speakers = [
  {
    name: "Alexander Wise",
    role: "Event Strategist",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Sofia Alvarez",
    role: "Community Lead",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mateo Cruz",
    role: "Product Designer",
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Nadia Brooks",
    role: "Tech Speaker",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
];

const insights = [
  {
    title: "An AI-Ready Event Playbook",
    description: "How to streamline planning, check-ins, and post-event insights.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Data That Makes Events Smarter",
    description: "Turning attendance signals into better sessions and schedules.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Designing for Conference Momentum",
    description: "The UX patterns that keep attendees engaged from start to finish.",
    image:
      "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=900&q=80",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-[#10141d] text-white">
      {/* Top navigation */}
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
            <a className="hover:text-white" href="#">
              Home
            </a>
            <a className="hover:text-white" href="#">
              About
            </a>
            <a className="hover:text-white" href="#speakers">
              Speakers
            </a>
            <a className="hover:text-white" href="#insights">
              Insights
            </a>
            <a className="hover:text-white" href="#">
              Contact
            </a>
          </nav>

          <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
            Get Started
          </button>
        </div>
      </header>

      {/* Page title */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,80,80,0.10),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 text-center">
          <h1 className="text-2xl font-semibold text-white/90 sm:text-3xl">
            About Us
          </h1>
          <div className="mt-2 text-xs text-white/50">
            <span className="opacity-80">Home</span>
            <span className="px-2">/</span>
            <span className="text-white/80">About Us</span>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              DIGITAL CONFERENCE
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold tracking-wide sm:text-2xl">
                  EXPERIENCE A TRUE DIGITAL CONFERENCE
                </h2>
              </div>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65">
                Expovent brings together organizers, creators, and communities with
                an experience that feels effortless: from planning and ticketing to
                live sessions and post-event insights.
              </p>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65">
                Everything is designed around clarity, speed, and engagement—so
                your attendees stay in the moment.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-lg font-semibold">120+</div>
                  <div className="text-xs text-white/55">Sessions</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-lg font-semibold">10K+</div>
                  <div className="text-xs text-white/55">Attendees</div>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#speakers"
                  className="rounded-md bg-red-600 px-5 py-3 text-center text-sm font-semibold hover:bg-red-500"
                >
                  Explore Speakers
                </a>
                <a
                  href="#insights"
                  className="rounded-md border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white/80 hover:bg-white/10"
                >
                  Read Insights
                </a>
              </div>
            </div>
          </div>

          {/* Collage */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  className="h-44 w-full object-cover"
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
                  alt="Conference audience"
                  loading="lazy"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl">
                <img
                  className="h-44 w-full object-cover"
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
                  alt="Workshop"
                  loading="lazy"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl col-span-2">
                <img
                  className="h-52 w-full object-cover"
                  src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80"
                  alt="Speakers"
                  loading="lazy"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl">
                <img
                  className="h-40 w-full object-cover"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
                  alt="Team"
                  loading="lazy"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl">
                <img
                  className="h-40 w-full object-cover"
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
                  alt="Networking"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/30">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9 7V17L17 12L9 7Z"
                    fill="rgba(255,255,255,0.9)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section id="speakers" className="mx-auto max-w-7xl px-6 pb-12">
        <div className="text-center">
          <div className="text-xs font-semibold tracking-widest text-red-500">
            TALENTED SPEAKERS
          </div>
          <div className="mt-2 text-sm text-white/60">
            Industry experts who turn ideas into impact.
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((s) => (
            <article
              key={s.name}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <img
                src={s.image}
                alt={s.name}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-base font-semibold">{s.name}</div>
                <div className="mt-1 text-xs text-white/70">{s.role}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Insights */}
      <section id="insights" className="border-t border-white/10 bg-[#0b0f16]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold tracking-widest text-white/70">
              EXPOVENT INSIGHT
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">
              What’s new in the event world
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
              Short reads for organizers: planning workflows, event design, and analytics.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {insights.map((card) => (
              <article
                key={card.title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="relative">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-white">
                    {card.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {card.description}
                  </p>
                  <a
                    href="#"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-400"
                  >
                    Read more
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                      &rarr;
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
                    EXPONENT
                  </div>
                  <div className="text-xs text-white/50">Event Management</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                A modern platform for planning, running, and learning from events with confidence.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">Useful Links</div>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#speakers" className="hover:text-white">
                    Speakers
                  </a>
                </li>
                <li>
                  <a href="#insights" className="hover:text-white">
                    Insights
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">Events Details</div>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li>Conference Tracks</li>
                <li>Workshops &amp; Talks</li>
                <li>Live Q&amp;A</li>
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
            Copyright &copy; {new Date().getFullYear()} Expovent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;

