import { useEffect, useMemo, useState } from "react";

const sidebarLinks = ["Dashboard", "Event List", "Upload Materials", "Calendar", "Statistics", "Profile"];

const upcomingEvents = [
  {
    id: "evt-up-1",
    title: "Digital Business Summit - 2026",
    host: "Event EMS",
    time: "9:00am - 10:30am",
    location: "California, CA",
    date: "Apr 30, 2026",
    status: "Upcoming",
    assignedBy: "Manager",
    requestedOn: "Apr 22, 2026",
  },
  {
    id: "evt-up-2",
    title: "Product Design Conference - 2026",
    host: "Event EMS",
    time: "1:00pm - 2:00pm",
    location: "Los Angeles, CA",
    date: "May 03, 2026",
    status: "Upcoming",
    assignedBy: "Manager",
    requestedOn: "Apr 20, 2026",
  },
  {
    id: "evt-up-3",
    title: "Startup Pitch Night - 2026",
    host: "Event EMS",
    time: "5:00pm - 6:00pm",
    location: "San Francisco, CA",
    date: "May 10, 2026",
    status: "Upcoming",
    assignedBy: "Manager",
    requestedOn: "Apr 19, 2026",
  },
];

const pastEvents = [
  {
    title: "NASA Space Apps Challenge - 2026",
    host: "Event EMS",
    time: "10:00am - 11:00am",
    location: "San Francisco, CA",
    date: "Mar 12, 2026",
    status: "Completed",
    attendees: 420,
    rating: 4.8,
  },
  {
    title: "AI & Healthcare Forum - 2026",
    host: "Event EMS",
    time: "2:00pm - 3:00pm",
    location: "San Diego, CA",
    date: "Feb 27, 2026",
    status: "Completed",
    attendees: 310,
    rating: 4.6,
  },
  {
    title: "Frontend Futures Meetup - 2026",
    host: "Event EMS",
    time: "6:00pm - 7:00pm",
    location: "Remote",
    date: "Jan 19, 2026",
    status: "Completed",
    attendees: 690,
    rating: 4.7,
  },
];

function Badge({ tone = "neutral", children }) {
  const toneStyles =
    tone === "success"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : tone === "warning"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
        : "border-[#2b3446] bg-[#11161f] text-[#b6c0cf]";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] ${toneStyles}`}>
      {children}
    </span>
  );
}

function SpeakerDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [assignedUpcomingEvents, setAssignedUpcomingEvents] = useState(
    upcomingEvents.map((e) => ({
      ...e,
      assignmentStatus: "Pending", // Pending | Accepted | Declined
      checkedIn: false,
    })),
  );
  const [materials, setMaterials] = useState([
    { name: "Keynote Deck.pdf", type: "Slides", updated: "Apr 14, 2026", url: null },
    { name: "Demo Repo.zip", type: "Code", updated: "Apr 18, 2026", url: null },
    { name: "Speaker Bio.docx", type: "Docs", updated: "Apr 22, 2026", url: null },
  ]);
  const [materialObjectUrls, setMaterialObjectUrls] = useState([]);

  useEffect(() => {
    return () => {
      materialObjectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [materialObjectUrls]);

  const acceptedUpcoming = useMemo(
    () => assignedUpcomingEvents.filter((e) => e.assignmentStatus === "Accepted"),
    [assignedUpcomingEvents],
  );
  const pendingUpcoming = useMemo(
    () => assignedUpcomingEvents.filter((e) => e.assignmentStatus === "Pending"),
    [assignedUpcomingEvents],
  );

  const statsFromPastEvents = useMemo(() => {
    const totalAttendees = pastEvents.reduce((sum, e) => sum + (e.attendees ?? 0), 0);
    const avgRating =
      pastEvents.length === 0
        ? 0
        : pastEvents.reduce((sum, e) => sum + (e.rating ?? 0), 0) / pastEvents.length;
    return {
      totalAttendees,
      avgRating: Number.isFinite(avgRating) ? avgRating : 0,
      eventsCount: pastEvents.length,
    };
  }, []);

  const speakerStatCards = useMemo(
    () => [
      { label: "Upcoming Talks", value: String(acceptedUpcoming.length), icon: "🎤" },
      { label: "Materials Uploaded", value: String(materials.length), icon: "📎" },
      { label: "Past Events", value: String(pastEvents.length), icon: "✅" },
      { label: "Avg. Rating", value: statsFromPastEvents.avgRating.toFixed(1), icon: "⭐" },
    ],
    [acceptedUpcoming.length, materials.length, statsFromPastEvents.avgRating],
  );

  const breadcrumb = useMemo(() => `Home / Speaker / ${activePage}`, [activePage]);

  const calendarDays = useMemo(() => {
    const labels = ["S", "M", "T", "W", "T", "F", "S"];
    const days = Array.from({ length: 35 }, (_, i) => i + 1);
    return { labels, days };
  }, []);

  function assignmentTone(status) {
    if (status === "Accepted") return "success";
    if (status === "Pending") return "warning";
    return "neutral";
  }

  function assignmentLabel(status) {
    if (status === "Accepted") return "Accepted";
    if (status === "Pending") return "Pending approval";
    return "Declined";
  }

  function acceptAssignment(eventId) {
    setAssignedUpcomingEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, assignmentStatus: "Accepted" } : e)),
    );
  }

  function declineAssignment(eventId) {
    setAssignedUpcomingEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, assignmentStatus: "Declined" } : e)),
    );
  }

  function checkIn(eventId) {
    setAssignedUpcomingEvents((prev) =>
      prev.map((e) =>
        e.id === eventId && e.assignmentStatus === "Accepted" ? { ...e, checkedIn: true } : e,
      ),
    );
  }

  function renderMain() {
    if (activePage === "Event List") {
      return (
        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Upcoming Events (Assigned to you)</h3>
              <div className="flex items-center gap-2">
                <Badge tone="warning">{pendingUpcoming.length} pending</Badge>
                <Badge tone="success">{acceptedUpcoming.length} accepted</Badge>
              </div>
            </div>
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {assignedUpcomingEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-start justify-between gap-3 rounded-[10px] border border-[#293346] bg-[#161d27] p-3"
                >
                  <div className="min-w-0">
                    <h4 className="m-0 truncate text-[15px] text-[#f8fbff]">{event.title}</h4>
                    <p className="mt-1 text-[13px] text-[#95a2ba]">
                      {event.date} · {event.time} · {event.location}
                    </p>
                    <p className="mt-1 text-[13px] text-[#95a2ba]">
                      Assigned by {event.assignedBy} · Requested {event.requestedOn}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge tone={assignmentTone(event.assignmentStatus)}>
                      {assignmentLabel(event.assignmentStatus)}
                    </Badge>
                    {event.assignmentStatus === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          className="rounded-[10px] border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-[13px] text-emerald-100 transition hover:bg-emerald-400/15"
                          type="button"
                          onClick={() => acceptAssignment(event.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="rounded-[10px] border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-[13px] text-rose-100 transition hover:bg-rose-400/15"
                          type="button"
                          onClick={() => declineAssignment(event.id)}
                        >
                          Refuse
                        </button>
                      </div>
                    ) : null}
                    {event.assignmentStatus === "Accepted" ? (
                      <button
                        className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        onClick={() => checkIn(event.id)}
                        disabled={event.checkedIn}
                      >
                        {event.checkedIn ? "Checked in" : "Check in"}
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Past Events</h3>
              <Badge tone="success">{pastEvents.length} completed</Badge>
            </div>
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {pastEvents.map((event) => (
                <li
                  key={event.title}
                  className="flex items-start justify-between gap-3 rounded-[10px] border border-[#293346] bg-[#161d27] p-3"
                >
                  <div className="min-w-0">
                    <h4 className="m-0 truncate text-[15px] text-[#f8fbff]">{event.title}</h4>
                    <p className="mt-1 text-[13px] text-[#95a2ba]">
                      {event.date} · {event.time} · {event.location}
                    </p>
                    <p className="mt-1 text-[13px] text-[#95a2ba]">
                      {event.attendees} attendees · {event.rating} rating
                    </p>
                  </div>
                  <Badge tone="success">Completed</Badge>
                </li>
              ))}
            </ul>
          </article>
        </section>
      );
    }

    if (activePage === "Upload Materials") {
      return (
        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Upload Materials</h3>
              <Badge>PDF · PPTX · ZIP · MP4</Badge>
            </div>

            <div className="rounded-[10px] border border-[#2b3446] bg-[#171d27] p-4">
              <p className="m-0 text-[13px] text-[#95a2ba]">
                Upload slides, code, handouts, and demo assets for your upcoming sessions.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  className="w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-[#2b3446] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-100 hover:file:bg-[#3b4760]"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length === 0) return;
                    const createdUrls = [];
                    const next = files.map((f) => {
                      const url = URL.createObjectURL(f);
                      createdUrls.push(url);
                      return {
                        name: f.name,
                        type: f.type || "File",
                        updated: new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }),
                        url,
                      };
                    });
                    setMaterials((prev) => [...next, ...prev]);
                    setMaterialObjectUrls((prev) => [...prev, ...createdUrls]);
                    e.target.value = "";
                  }}
                  aria-label="Upload materials"
                />
              </div>
              <p className="mt-3 text-[12px] text-[#8f9ab0]">
                Tip: keep file names short so attendees can find them quickly.
              </p>
            </div>
          </article>

          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Your Materials</h3>
              <Badge>{materials.length} files</Badge>
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {materials.map((m) => (
                <li
                  key={`${m.name}-${m.updated}`}
                  className="flex items-center justify-between gap-3 rounded-[10px] border border-[#293346] bg-[#161d27] p-3"
                >
                  <div className="min-w-0">
                    <p className="m-0 truncate text-[14px] text-[#f8fbff]">{m.name}</p>
                    <p className="mt-1 text-[12px] text-[#95a2ba]">
                      {m.type} · Updated {m.updated}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      className={`rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5 ${
                        m.url ? "" : "pointer-events-none opacity-60"
                      }`}
                      href={m.url ?? undefined}
                      download={m.name}
                    >
                      Download
                    </a>
                    <button
                      className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5"
                      type="button"
                      onClick={() => {
                        if (m.url) {
                          URL.revokeObjectURL(m.url);
                          setMaterialObjectUrls((prev) => prev.filter((u) => u !== m.url));
                        }
                        setMaterials((prev) => prev.filter((x) => x !== m));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      );
    }

    if (activePage === "Calendar") {
      return (
        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.15fr_1fr]">
          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Calendar</h3>
              <p className="m-0 text-[13px] text-[#8f9ab0]">April 2026</p>
            </div>

            <div className="rounded-[10px] border border-[#2b3446] bg-[#171d27] p-4">
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.labels.map((d) => (
                  <div key={d} className="text-center text-[12px] font-semibold text-[#8f9ab0]">
                    {d}
                  </div>
                ))}
                {calendarDays.days.map((day) => {
                  const isHighlighted = day === 30;
                  return (
                    <div
                      key={day}
                      className={`flex h-10 items-center justify-center rounded-lg border text-[13px] ${
                        isHighlighted
                          ? "border-[#ff9f1a]/40 bg-[#ff9f1a]/15 text-[#fff6e8]"
                          : "border-[#2b3446] bg-[#11161f] text-[#b6c0cf]"
                      }`}
                    >
                      {day <= 30 ? day : ""}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[12px] text-[#8f9ab0]">
                Highlighted day indicates your next scheduled talk.
              </p>
            </div>
          </article>

          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Next Sessions</h3>
              <Badge tone="warning">{acceptedUpcoming.length > 0 ? "Accepted" : "No accepted yet"}</Badge>
            </div>
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {(acceptedUpcoming.length ? acceptedUpcoming : assignedUpcomingEvents)
                .slice(0, 3)
                .map((event) => (
                <li
                  key={event.id}
                  className="flex items-start justify-between gap-3 rounded-[10px] border border-[#293346] bg-[#161d27] p-3"
                >
                  <div className="min-w-0">
                    <h4 className="m-0 truncate text-[15px] text-[#f8fbff]">{event.title}</h4>
                    <p className="mt-1 text-[13px] text-[#95a2ba]">
                      {event.date} · {event.time}
                    </p>
                  </div>
                  <Badge tone={assignmentTone(event.assignmentStatus)}>
                    {assignmentLabel(event.assignmentStatus)}
                  </Badge>
                </li>
              ))}
            </ul>
          </article>
        </section>
      );
    }

    if (activePage === "Statistics") {
      return (
        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.15fr_1fr]">
          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Past Event Stats</h3>
              <p className="m-0 text-[13px] text-[#8f9ab0]">Last 3 events</p>
            </div>

            <div className="relative h-[300px] overflow-hidden rounded-[10px] border border-[#2b3446] bg-[#171d27]">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:100%_48px]"></div>
              <div
                className="absolute inset-x-0 bottom-0 h-[72%] rounded-t-xl bg-[linear-gradient(180deg,rgba(68,183,255,0.55),rgba(68,183,255,0.08))]"
                style={{
                  clipPath:
                    "polygon(0 78%, 10% 76%, 22% 60%, 35% 66%, 48% 48%, 60% 55%, 72% 33%, 84% 40%, 100% 22%, 100% 100%, 0 100%)",
                }}
              ></div>
              <div
                className="absolute inset-x-0 bottom-0 h-[72%] rounded-t-xl bg-[linear-gradient(180deg,rgba(255,159,26,0.55),rgba(255,159,26,0.10))]"
                style={{
                  clipPath:
                    "polygon(0 88%, 13% 80%, 26% 72%, 39% 62%, 52% 70%, 66% 58%, 78% 52%, 90% 48%, 100% 44%, 100% 100%, 0 100%)",
                }}
              ></div>
            </div>
          </article>

          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Summary</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-[10px] border border-[#293346] bg-[#161d27] p-3">
                <p className="m-0 text-[13px] text-[#95a2ba]">Total attendees (past)</p>
                <p className="mt-1 text-[26px] font-semibold text-[#f8fbff]">
                  {statsFromPastEvents.totalAttendees.toLocaleString("en-US")}
                </p>
              </div>
              <div className="rounded-[10px] border border-[#293346] bg-[#161d27] p-3">
                <p className="m-0 text-[13px] text-[#95a2ba]">Average rating</p>
                <p className="mt-1 text-[26px] font-semibold text-[#f8fbff]">
                  {statsFromPastEvents.avgRating.toFixed(1)}
                </p>
              </div>
              <div className="rounded-[10px] border border-[#293346] bg-[#161d27] p-3">
                <p className="m-0 text-[13px] text-[#95a2ba]">Past events counted</p>
                <p className="mt-1 text-[26px] font-semibold text-[#f8fbff]">
                  {statsFromPastEvents.eventsCount}
                </p>
              </div>
            </div>
          </article>
        </section>
      );
    }

    // Dashboard (default)
    return (
      <>
        <section className="my-4 text-sm text-[#97a2b6]">
          <p>{breadcrumb}</p>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {speakerStatCards.map((card) => (
            <article
              key={card.label}
              className="flex items-center justify-between rounded-xl border border-[#283143] bg-[#1b212c] p-4"
            >
              <div>
                <h2 className="m-0 text-[34px] leading-none text-white">{card.value}</h2>
                <p className="mt-1.5 text-sm text-[#9ca6b7]">{card.label}</p>
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

        <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.15fr_1fr]">
          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Speaker Progress</h3>
              <p className="m-0 text-[13px] text-[#8f9ab0]">2026</p>
            </div>
            <div className="relative h-[300px] overflow-hidden rounded-[10px] border border-[#2b3446] bg-[#171d27]">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:100%_48px]"></div>
              <div
                className="absolute inset-x-0 bottom-0 h-[72%] rounded-t-xl bg-[linear-gradient(180deg,rgba(255,159,26,0.55),rgba(255,159,26,0.10))]"
                style={{
                  clipPath:
                    "polygon(0 86%, 10% 76%, 22% 78%, 34% 60%, 48% 66%, 60% 54%, 72% 52%, 84% 40%, 92% 46%, 100% 32%, 100% 100%, 0 100%)",
                }}
              ></div>
              <div
                className="absolute inset-x-0 bottom-0 h-[72%] rounded-t-xl bg-[linear-gradient(180deg,rgba(68,183,255,0.50),rgba(68,183,255,0.10))]"
                style={{
                  clipPath:
                    "polygon(0 90%, 12% 82%, 26% 70%, 40% 66%, 52% 74%, 64% 62%, 76% 56%, 88% 52%, 100% 48%, 100% 100%, 0 100%)",
                }}
              ></div>
            </div>
          </article>

          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="m-0 text-xl text-[#f4f7fb]">Upcoming Sessions</h3>
              <button
                className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5"
                type="button"
                onClick={() => setActivePage("Event List")}
              >
                View all
              </button>
            </div>
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {assignedUpcomingEvents.slice(0, 3).map((event) => (
                <li
                  key={event.id}
                  className="flex items-start justify-between gap-3 rounded-[10px] border border-[#293346] bg-[#161d27] p-3"
                >
                  <div className="min-w-0">
                    <h4 className="m-0 truncate text-[15px] text-[#f8fbff]">{event.title}</h4>
                    <p className="mt-1 text-[13px] text-[#95a2ba]">
                      {event.date} · {event.time} · {event.location}
                    </p>
                    <p className="mt-1 text-[13px] text-[#95a2ba]">
                      {event.assignmentStatus === "Pending"
                        ? "Waiting for your response"
                        : event.assignmentStatus === "Accepted"
                          ? event.checkedIn
                            ? "You are checked in"
                            : "Accepted · Check in when ready"
                          : "You declined this assignment"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge tone={assignmentTone(event.assignmentStatus)}>
                      {assignmentLabel(event.assignmentStatus)}
                    </Badge>
                    {event.assignmentStatus === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          className="rounded-[10px] border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-[13px] text-emerald-100 transition hover:bg-emerald-400/15"
                          type="button"
                          onClick={() => acceptAssignment(event.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="rounded-[10px] border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-[13px] text-rose-100 transition hover:bg-rose-400/15"
                          type="button"
                          onClick={() => declineAssignment(event.id)}
                        >
                          Refuse
                        </button>
                      </div>
                    ) : null}
                    {event.assignmentStatus === "Accepted" ? (
                      <button
                        className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        onClick={() => checkIn(event.id)}
                        disabled={event.checkedIn}
                      >
                        {event.checkedIn ? "Checked in" : "Check in"}
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </>
    );
  }

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
                item === activePage ? "bg-[#10141d]/20 font-semibold" : ""
              }`}
              type="button"
              onClick={() => setActivePage(item)}
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
              SP
            </span>
            <span className="text-sm text-[#f3f6fb]">Speaker</span>
          </div>
        </header>

        {activePage === "Dashboard" ? (
          renderMain()
        ) : (
          <>
            <section className="my-4 text-sm text-[#97a2b6]">
              <p>{breadcrumb}</p>
            </section>
            {renderMain()}
          </>
        )}
      </main>
    </div>
  );
}

export default SpeakerDashboard;
