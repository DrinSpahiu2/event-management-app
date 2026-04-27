import { useMemo, useState } from "react";

const sidebarLinks = ["Dashboard", "Sponsors", "Schedule List", "Upcoming Event"];

const events = [
  {
    id: "evt_digital_business_summit_2026",
    title: "Digital Business Summit - 2026",
    date: "Jan 23, 2026",
    time: "9:00am - 5:00pm",
    location: "California, CA",
    attendees: 1200,
    audience: ["Founders", "Operators", "Investors"],
  },
  {
    id: "evt_nasa_space_apps_2026",
    title: "NASA Space Apps Challenge - 2026",
    date: "Feb 9, 2026",
    time: "10:00am - 3:00pm",
    location: "San Francisco, CA",
    attendees: 800,
    audience: ["Developers", "Designers", "Researchers"],
  },
  {
    id: "evt_product_design_conf_2026",
    title: "Product Design Conference - 2026",
    date: "Mar 12, 2026",
    time: "8:00am - 1:00pm",
    location: "Los Angeles, CA",
    attendees: 650,
    audience: ["Designers", "PMs", "UX Researchers"],
  },
];

const tiers = [
  {
    id: "starter",
    name: "Starter",
    priceLabel: "$500",
    blurb: "Perfect for small teams testing the waters.",
    perks: ["Logo on sponsors wall", "1 social media mention", "1 attendee pass"],
    accent: "from-[#44b7ff] to-[#6ad3ff]",
  },
  {
    id: "growth",
    name: "Growth",
    priceLabel: "$1,500",
    blurb: "Get stronger visibility and more attendees.",
    perks: ["Medium logo placement", "3 social media mentions", "3 attendee passes"],
    accent: "from-[#ef4360] to-[#f58b63]",
    featured: true,
  },
  {
    id: "headline",
    name: "Headline",
    priceLabel: "$5,000",
    blurb: "Top placement + stage shout-out.",
    perks: [
      "Top logo placement",
      "Stage shout-out",
      "Booth space",
      "10 attendee passes",
    ],
    accent: "from-[#ff9f1a] to-[#ff7a00]",
  },
];

function Sponsor() {
  const [query, setQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? "");
  const [selectedTierId, setSelectedTierId] = useState(tiers[1]?.id ?? tiers[0]?.id);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      [e.title, e.location, e.date].some((v) => v.toLowerCase().includes(q)),
    );
  }, [query]);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? events[0],
    [selectedEventId],
  );

  const selectedTier = useMemo(
    () => tiers.find((t) => t.id === selectedTierId) ?? tiers[0],
    [selectedTierId],
  );

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
              className={`rounded-[10px] border-0 px-3 py-2.5 text-left text-[15px] text-[#fff6e8] transition hover:bg-white/15 ${
                item === "Sponsors" ? "bg-[#10141d]/20 font-semibold" : ""
              }`}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-xl bg-black/10 p-3 text-[13px] text-[#1f1f1f]">
          <p className="m-0 font-semibold">Sponsor smarter.</p>
          <p className="m-0 mt-1 text-[#2b2b2b]">
            Choose an event and package, then submit your sponsorship request.
          </p>
        </div>
      </aside>

      <main className="bg-[#151a23] p-4 sm:p-5 lg:p-6">
        <header className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="w-full max-w-[520px]">
            <input
              className="w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events by name, location, date..."
              aria-label="Search events"
            />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-sm text-[#b6c0cf]">
            <span>English</span>
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-[#44b7ff] to-[#6ad3ff] text-[13px] font-bold text-[#04131f]">
              SP
            </span>
            <span className="text-sm text-[#f3f6fb]">Sponsor Portal</span>
          </div>
        </header>

        <section className="my-4 text-sm text-[#97a2b6]">
          <p>Home / Sponsors</p>
        </section>

        <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-start justify-between gap-3">
              <div>
                <h2 className="m-0 text-xl text-[#f4f7fb]">Choose an event</h2>
                <p className="m-0 mt-1 text-[13px] text-[#8f9ab0]">
                  Pick the event you want to sponsor.
                </p>
              </div>
              <div className="min-w-[220px]">
                <label className="sr-only" htmlFor="eventSelect">
                  Select event
                </label>
                <select
                  id="eventSelect"
                  className="w-full rounded-[10px] border border-[#2b3446] bg-[#171d27] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-[#3b4760]"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {filteredEvents.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredEvents.map((e) => {
                const active = e.id === selectedEventId;
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setSelectedEventId(e.id)}
                    className={`text-left rounded-[12px] border p-3 transition ${
                      active
                        ? "border-[#6ad3ff] bg-[#161d27]"
                        : "border-[#293346] bg-[#171d27] hover:border-[#3b4760]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="m-0 text-[15px] text-[#f8fbff]">
                          {e.title}
                        </h3>
                        <p className="mt-1 text-[13px] text-[#95a2ba]">
                          {e.date} · {e.time}
                        </p>
                        <p className="mt-1 text-[13px] text-[#95a2ba]">
                          {e.location} · {e.attendees}+ attendees
                        </p>
                      </div>
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                          active ? "from-[#44b7ff] to-[#6ad3ff]" : "from-[#2b3446] to-[#1f2735]"
                        } text-[13px] font-bold text-[#04131f]`}
                        aria-hidden="true"
                      >
                        {e.title[0]}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {e.audience.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#2b3446] bg-[#141a23] px-2 py-0.5 text-[12px] text-[#b6c0cf]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-start justify-between gap-3">
              <div>
                <h2 className="m-0 text-xl text-[#f4f7fb]">Sponsorship package</h2>
                <p className="m-0 mt-1 text-[13px] text-[#8f9ab0]">
                  Select a tier, then submit your details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tiers.map((t) => {
                const active = t.id === selectedTierId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTierId(t.id)}
                    className={`rounded-[12px] border p-3 text-left transition ${
                      active
                        ? "border-[#6ad3ff] bg-[#161d27]"
                        : "border-[#293346] bg-[#171d27] hover:border-[#3b4760]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${t.accent} text-[12px] font-bold text-[#04131f]`}
                            aria-hidden="true"
                          >
                            {t.name[0]}
                          </span>
                          <h3 className="m-0 text-[15px] text-[#f8fbff]">
                            {t.name}
                            {t.featured ? (
                              <span className="ml-2 rounded-full bg-[#ff9f1a]/20 px-2 py-0.5 text-[12px] font-semibold text-[#ffd7a3]">
                                Popular
                              </span>
                            ) : null}
                          </h3>
                        </div>
                        <p className="m-0 mt-1 text-[13px] text-[#95a2ba]">{t.blurb}</p>
                      </div>
                      <div className="text-right">
                        <p className="m-0 text-[18px] font-semibold text-white">
                          {t.priceLabel}
                        </p>
                        <p className="m-0 mt-0.5 text-[12px] text-[#8f9ab0]">
                          per event
                        </p>
                      </div>
                    </div>
                    <ul className="mt-2.5 list-disc pl-5 text-[13px] text-[#b6c0cf]">
                      {t.perks.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-[12px] border border-[#2b3446] bg-[#171d27] p-3">
              <h3 className="m-0 text-[15px] text-[#f8fbff]">Request sponsorship</h3>
              <p className="m-0 mt-1 text-[13px] text-[#8f9ab0]">
                Sponsoring: <span className="text-[#f3f6fb]">{selectedEvent?.title}</span>{" "}
                · Tier: <span className="text-[#f3f6fb]">{selectedTier?.name}</span>
              </p>

              <form
                className="mt-3 grid grid-cols-1 gap-2.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  // UI-only: integrate an API call here when backend endpoint is available.
                  alert("Sponsorship request submitted (demo).");
                }}
              >
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[12px] text-[#b6c0cf]">Company name</span>
                    <input
                      required
                      className="mt-1 w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
                      placeholder="Acme Inc."
                      type="text"
                      name="companyName"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px] text-[#b6c0cf]">Email</span>
                    <input
                      required
                      className="mt-1 w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
                      placeholder="you@company.com"
                      type="email"
                      name="email"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[12px] text-[#b6c0cf]">Website (optional)</span>
                    <input
                      className="mt-1 w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
                      placeholder="https://company.com"
                      type="url"
                      name="website"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px] text-[#b6c0cf]">Budget (USD)</span>
                    <input
                      required
                      min={0}
                      className="mt-1 w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
                      placeholder={selectedTier?.priceLabel?.replace("$", "") ?? "1500"}
                      type="number"
                      name="budget"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[12px] text-[#b6c0cf]">Message (optional)</span>
                  <textarea
                    className="mt-1 min-h-[90px] w-full resize-none rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
                    placeholder="Tell us what you’d like to get out of sponsoring this event."
                    name="message"
                  />
                </label>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="m-0 text-[12px] text-[#8f9ab0]">
                    By submitting, you agree to be contacted by the event team.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-b from-[#ff9f1a] to-[#ff7a00] px-4 py-2.5 text-sm font-semibold text-[#1f1f1f] transition hover:brightness-110"
                  >
                    Submit request
                  </button>
                </div>
              </form>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Sponsor;
