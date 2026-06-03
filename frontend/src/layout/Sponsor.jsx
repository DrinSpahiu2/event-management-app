import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const sidebarLinks = ["Dashboard", "Sponsors", "Schedule List", "Upcoming Event"];

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

function isUpcoming(event) {
  if (!event?.startAt) return true;
  const end = event.endAt ? new Date(event.endAt) : new Date(event.startAt);
  return !Number.isNaN(end.getTime()) && end >= new Date();
}

function formatSubmittedDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatScheduleDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatScheduleTime(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatScheduleSlot(start, end) {
  const a = formatScheduleTime(start);
  const b = formatScheduleTime(end);
  if (a && b) return `${a} - ${b}`;
  return a || b || "";
}

function mapScheduleRow(item) {
  return {
    id: item.id,
    eventId: String(item.eventId ?? item.event_id ?? ""),
    eventTitle: item.eventTitle ?? item.event ?? "Untitled event",
    session: item.session ?? item.title ?? "",
    date: item.date ?? formatScheduleDate(item.start_time),
    slot: item.slot || formatScheduleSlot(item.start_time, item.end_time),
  };
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      "Server returned an invalid response. Make sure the backend is running (port 5000) and restart it after updates.",
    );
  }
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Request failed (${res.status})`);
  }
  return data;
}

function Sponsor() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";

  const clearSession = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
  };


  const [activePage, setActivePage] = useState("Sponsors");
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedTierId, setSelectedTierId] = useState(tiers[1]?.id ?? tiers[0]?.id);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [editingRequest, setEditingRequest] = useState(null);
  const [deletingRequestId, setDeletingRequestId] = useState(null);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError("");
    try {
      const data = await fetchJson("/api/sponsor/events");
      const list = Array.isArray(data) ? data : [];
      setEvents(list);
      setSelectedEventId((prev) => {
        if (prev && list.some((e) => e.id === prev)) return prev;
        return list[0]?.id ?? "";
      });
    } catch (err) {
      setEventsError(err.message || "Failed to load events");
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    if (!userEmail) {
      setRequests([]);
      return;
    }
    setRequestsLoading(true);
    try {
      const data = await fetchJson(
        `/api/sponsor/requests?email=${encodeURIComponent(userEmail)}`,
      );
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, [userEmail]);

  const loadSchedule = useCallback(async () => {
    setScheduleLoading(true);
    setScheduleError("");
    try {
      let data = null;
      try {
        data = await fetchJson("/api/sponsor/schedule");
      } catch {
        data = await fetchJson("/api/manager/schedule");
      }
      setSchedule(Array.isArray(data) ? data.map(mapScheduleRow) : []);
    } catch (err) {
      setScheduleError(err.message || "Failed to load schedule");
      setSchedule([]);
    } finally {
      setScheduleLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    if (activePage === "Schedule List" || activePage === "Dashboard") {
      loadSchedule();
    }
  }, [activePage, loadSchedule]);

  const upcomingEvents = useMemo(
    () => events.filter(isUpcoming),
    [events],
  );

  const filteredEvents = useMemo(() => {
    const source =
      activePage === "Upcoming Event" ? upcomingEvents : events;
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter((e) =>
      [e.title, e.location, e.date].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [query, events, upcomingEvents, activePage]);

  const filteredSchedule = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return schedule;
    return schedule.filter((item) =>
      [item.eventTitle, item.session, item.date, item.slot].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [query, schedule]);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? events[0],
    [selectedEventId, events],
  );

  const selectedTier = useMemo(
    () => tiers.find((t) => t.id === selectedTierId) ?? tiers[0],
    [selectedTierId],
  );

  const statCards = useMemo(
    () => [
      {
        label: "Open events",
        value: String(events.length),
        icon: "📅",
      },
      {
        label: "My requests",
        value: String(requests.length),
        icon: "🤝",
      },
      {
        label: "Upcoming",
        value: String(upcomingEvents.length),
        icon: "🚀",
      },
      {
        label: "Schedule items",
        value: scheduleLoading ? "…" : String(schedule.length),
        icon: "🗓️",
      },
    ],
    [events.length, requests.length, upcomingEvents.length, schedule.length, scheduleLoading],
  );

  const breadcrumb = useMemo(() => `Home / ${activePage}`, [activePage]);

  const showSearch =
    activePage === "Sponsors" ||
    activePage === "Upcoming Event" ||
    activePage === "Schedule List";

  function cancelEdit() {
    setEditingRequest(null);
    setSubmitError("");
    setSubmitMessage("");
  }

  function startEditRequest(req) {
    setEditingRequest(req);
    setSelectedEventId(req.eventId);
    setSelectedTierId(req.tierId || tiers[0]?.id);
    setSubmitError("");
    setSubmitMessage("");
    setActivePage("Sponsors");
  }

  async function deleteRequest(requestId) {
    if (!userEmail) {
      setSubmitError("Sign in again to manage your sponsorships.");
      return;
    }
    if (
      !window.confirm(
        "Delete this sponsorship request? This cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingRequestId(requestId);
    setSubmitError("");
    setSubmitMessage("");
    try {
      const data = await fetchJson(
        `/api/sponsor/requests/${requestId}?email=${encodeURIComponent(userEmail)}`,
        { method: "DELETE" },
      );
      if (editingRequest?.id === requestId) {
        cancelEdit();
      }
      setSubmitMessage(data.message || "Sponsorship request deleted.");
      await loadRequests();
    } catch (err) {
      setSubmitError(err.message || "Failed to delete sponsorship request");
    } finally {
      setDeletingRequestId(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    if (!selectedEventId) {
      setSubmitError("Please select an event to sponsor.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const companyName = String(fd.get("companyName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const website = String(fd.get("website") || "").trim();
    const budget = fd.get("budget");
    const message = String(fd.get("message") || "").trim();

    const payload = {
      eventId: selectedEventId,
      tierId: selectedTierId,
      companyName,
      email,
      website: website || undefined,
      budget: Number(budget),
      message: message || undefined,
    };

    setSubmitting(true);
    try {
      const data = editingRequest
        ? await fetchJson(`/api/sponsor/requests/${editingRequest.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetchJson("/api/sponsor/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      setSubmitMessage(
        data.message ||
          (editingRequest
            ? "Sponsorship request updated successfully."
            : "Sponsorship request submitted successfully."),
      );
      setEditingRequest(null);
      form.reset();
      if (userEmail) {
        const emailInput = form.elements.namedItem("email");
        if (emailInput && "value" in emailInput) {
          emailInput.value = userEmail;
        }
      }
      await loadRequests();
    } catch (err) {
      setSubmitError(
        err.message ||
          (editingRequest
            ? "Failed to update sponsorship request"
            : "Failed to submit sponsorship request"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  function goToSponsors(eventId) {
    if (eventId) setSelectedEventId(eventId);
    cancelEdit();
    setActivePage("Sponsors");
  }

  function renderMySponsorships() {
    return (
      <article className="mt-4 rounded-xl border border-[#283143] bg-[#1b212c] p-4">
        <h2 className="m-0 text-lg text-[#f4f7fb]">Your sponsorship requests</h2>
        <p className="m-0 mt-1 text-[13px] text-[#8f9ab0]">
          Edit or delete requests you have already submitted.
        </p>
        {requestsLoading ? (
          <p className="mt-3 text-sm text-[#8f9ab0]">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="mt-3 text-sm text-[#8f9ab0]">
            No requests yet. Browse events and submit your first sponsorship.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {requests.map((req) => (
              <li
                key={req.id}
                className="flex flex-col gap-2 rounded-[10px] border border-[#293346] bg-[#171d27] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="m-0 text-sm font-medium text-[#f8fbff]">
                    {req.eventTitle}
                  </p>
                    <p className="m-0 mt-0.5 text-[12px] text-[#95a2ba]">
                      {req.tier} · ${req.budget} ·{" "}
                      {formatSubmittedDate(req.submittedAt)}
                    </p>
                    <p className="m-0 mt-1">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[11px] ${
                          req.status === "accepted"
                            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                            : req.status === "rejected"
                              ? "border-rose-400/25 bg-rose-400/10 text-rose-200"
                              : "border-amber-400/25 bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {req.statusLabel || "Pending"}
                      </span>
                    </p>
                  {req.eventLocation ? (
                    <p className="m-0 mt-0.5 text-[12px] text-[#8f9ab0]">
                      {req.eventLocation}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEditRequest(req)}
                    className="rounded-[8px] border border-[#2b3446] bg-[#141a23] px-3 py-1.5 text-[12px] text-[#f3f6fb] hover:border-[#3b4760]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRequest(req.id)}
                    disabled={deletingRequestId === req.id}
                    className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[12px] text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {deletingRequestId === req.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>
    );
  }

  function renderDashboard() {
    return (
      <>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <article
              key={card.label}
              className="rounded-xl border border-[#283143] bg-[#1b212c] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="m-0 text-[13px] text-[#8f9ab0]">{card.label}</p>
                <span className="text-lg" aria-hidden="true">
                  {card.icon}
                </span>
              </div>
              <p className="m-0 mt-2 text-2xl font-semibold text-[#f4f7fb]">
                {card.value}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
          <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <h2 className="m-0 text-lg text-[#f4f7fb]">Quick actions</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActivePage("Sponsors")}
                className="rounded-[10px] bg-gradient-to-b from-[#ff9f1a] to-[#ff7a00] px-4 py-2 text-sm font-semibold text-[#1f1f1f]"
              >
                Request sponsorship
              </button>
              <button
                type="button"
                onClick={() => setActivePage("Upcoming Event")}
                className="rounded-[10px] border border-[#2b3446] bg-[#171d27] px-4 py-2 text-sm text-[#f3f6fb] hover:border-[#3b4760]"
              >
                Browse upcoming events
              </button>
              <button
                type="button"
                onClick={() => setActivePage("Schedule List")}
                className="rounded-[10px] border border-[#2b3446] bg-[#171d27] px-4 py-2 text-sm text-[#f3f6fb] hover:border-[#3b4760]"
              >
                View schedule
              </button>
            </div>
          </article>

          {renderMySponsorships()}
        </div>
      </>
    );
  }

  function renderUpcoming() {
    return (
      <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
        <div className="mb-3.5">
          <h2 className="m-0 text-xl text-[#f4f7fb]">Upcoming events</h2>
          <p className="m-0 mt-1 text-[13px] text-[#8f9ab0]">
            Published events you can still sponsor.
          </p>
        </div>
        {eventsLoading ? (
          <p className="text-sm text-[#8f9ab0]">Loading events...</p>
        ) : eventsError ? (
          <p className="text-sm text-red-400">{eventsError}</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-sm text-[#8f9ab0]">No upcoming events right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="rounded-[12px] border border-[#293346] bg-[#171d27] p-3"
              >
                <h3 className="m-0 text-[15px] text-[#f8fbff]">{ev.title}</h3>
                <p className="mt-1 text-[13px] text-[#95a2ba]">
                  {ev.date}
                  {ev.time ? ` · ${ev.time}` : ""}
                </p>
                <p className="mt-1 text-[13px] text-[#95a2ba]">
                  {ev.location}
                  {ev.attendees ? ` · ${ev.attendees}+ attendees` : ""}
                </p>
                <button
                  type="button"
                  onClick={() => goToSponsors(ev.id)}
                  className="mt-3 rounded-[10px] bg-gradient-to-b from-[#ff9f1a] to-[#ff7a00] px-3 py-2 text-sm font-semibold text-[#1f1f1f]"
                >
                  Sponsor this event
                </button>
              </div>
            ))}
          </div>
        )}
      </article>
    );
  }

  function renderSchedule() {
    return (
      <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
        <div className="mb-3.5">
          <h2 className="m-0 text-xl text-[#f4f7fb]">Event schedule</h2>
          <p className="m-0 mt-1 text-[13px] text-[#8f9ab0]">
            Sessions and time slots for published events.
          </p>
        </div>
        {scheduleLoading ? (
          <p className="text-sm text-[#8f9ab0]">Loading schedule...</p>
        ) : scheduleError ? (
          <p className="text-sm text-red-400">{scheduleError}</p>
        ) : filteredSchedule.length === 0 ? (
          <p className="text-sm text-[#8f9ab0]">
            No schedule items yet. Check back when sessions are added.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#293346] text-[#8f9ab0]">
                  <th className="py-2 pr-3 font-medium">Event</th>
                  <th className="py-2 pr-3 font-medium">Session</th>
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map((item) => (
                  <tr key={item.id} className="border-b border-[#293346]/60">
                    <td className="py-2.5 pr-3 text-[#f8fbff]">{item.eventTitle}</td>
                    <td className="py-2.5 pr-3 text-[#b6c0cf]">{item.session}</td>
                    <td className="py-2.5 pr-3 text-[#95a2ba]">{item.date}</td>
                    <td className="py-2.5 text-[#95a2ba]">{item.slot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    );
  }

  function renderSponsors() {
    return (
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
                className="w-full rounded-[10px] border border-[#2b3446] bg-[#171d27] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-[#3b4760] disabled:opacity-50"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                disabled={eventsLoading || filteredEvents.length === 0}
              >
                {filteredEvents.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {eventsLoading ? (
            <p className="text-sm text-[#8f9ab0]">Loading events...</p>
          ) : eventsError ? (
            <p className="text-sm text-red-400">{eventsError}</p>
          ) : filteredEvents.length === 0 ? (
            <p className="text-sm text-[#8f9ab0]">
              No published events are available for sponsorship right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredEvents.map((ev) => {
                const active = ev.id === selectedEventId;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`text-left rounded-[12px] border p-3 transition ${
                      active
                        ? "border-[#6ad3ff] bg-[#161d27]"
                        : "border-[#293346] bg-[#171d27] hover:border-[#3b4760]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="m-0 text-[15px] text-[#f8fbff]">
                          {ev.title}
                        </h3>
                        <p className="mt-1 text-[13px] text-[#95a2ba]">
                          {ev.date}
                          {ev.time ? ` · ${ev.time}` : ""}
                        </p>
                        <p className="mt-1 text-[13px] text-[#95a2ba]">
                          {ev.location}
                          {ev.attendees ? ` · ${ev.attendees}+ attendees` : ""}
                        </p>
                      </div>
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                          active
                            ? "from-[#44b7ff] to-[#6ad3ff]"
                            : "from-[#2b3446] to-[#1f2735]"
                        } text-[13px] font-bold text-[#04131f]`}
                        aria-hidden="true"
                      >
                        {ev.title[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
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
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="m-0 text-[15px] text-[#f8fbff]">
                  {editingRequest ? "Edit sponsorship" : "Request sponsorship"}
                </h3>
                <p className="m-0 mt-1 text-[13px] text-[#8f9ab0]">
                  Sponsoring:{" "}
                  <span className="text-[#f3f6fb]">
                    {selectedEvent?.title ?? "—"}
                  </span>{" "}
                  · Tier:{" "}
                  <span className="text-[#f3f6fb]">{selectedTier?.name}</span>
                </p>
              </div>
              {editingRequest ? (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-[8px] border border-[#2b3446] bg-[#141a23] px-3 py-1.5 text-[12px] text-[#b6c0cf] hover:border-[#3b4760]"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>

            {submitMessage ? (
              <p className="mt-2 text-sm text-emerald-400">{submitMessage}</p>
            ) : null}
            {submitError ? (
              <p className="mt-2 text-sm text-red-400">{submitError}</p>
            ) : null}

            <form
              key={editingRequest?.id ?? "new-request"}
              className="mt-3 grid grid-cols-1 gap-2.5"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12px] text-[#b6c0cf]">Company name</span>
                  <input
                    required
                    defaultValue={editingRequest?.companyName ?? ""}
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
                    defaultValue={editingRequest?.email || userEmail}
                    readOnly={Boolean(editingRequest)}
                    className="mt-1 w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760] disabled:opacity-70"
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
                    defaultValue={editingRequest?.website ?? ""}
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
                    defaultValue={editingRequest?.budget ?? ""}
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
                  defaultValue={editingRequest?.message ?? ""}
                  className="mt-1 min-h-[90px] w-full resize-none rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
                  placeholder="Tell us what you'd like to get out of sponsoring this event."
                  name="message"
                />
              </label>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="m-0 text-[12px] text-[#8f9ab0]">
                  By submitting, you agree to be contacted by the event team.
                </p>
                <button
                  type="submit"
                  disabled={submitting || eventsLoading || !selectedEventId}
                  className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-b from-[#ff9f1a] to-[#ff7a00] px-4 py-2.5 text-sm font-semibold text-[#1f1f1f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : editingRequest
                      ? "Save changes"
                      : "Submit request"}
                </button>
              </div>
            </form>
          </div>
        </article>

        {renderMySponsorships()}
      </section>
    );
  }

  function renderMain() {
    switch (activePage) {
      case "Dashboard":
        return renderDashboard();
      case "Sponsors":
        return renderSponsors();
      case "Schedule List":
        return renderSchedule();
      case "Upcoming Event":
        return renderUpcoming();
      default:
        return renderDashboard();
    }
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

        <div className="mt-auto rounded-xl bg-black/10 p-3 text-[13px] text-[#1f1f1f]">
          <p className="m-0 font-semibold">Sponsor smarter.</p>
          <p className="m-0 mt-1 text-[#2b2b2b]">
            Choose an event and package, then submit your sponsorship request.
          </p>
        </div>
      </aside>

      <main className="bg-[#151a23] p-4 sm:p-5 lg:p-6">
        <header className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {showSearch ? (
            <div className="w-full max-w-[520px]">
              <input
                className="w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none placeholder:text-[#798194] focus:border-[#3b4760]"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  activePage === "Schedule List"
                    ? "Search schedule by event, session, date..."
                    : "Search events by name, location, date..."
                }
                aria-label="Search"
              />
            </div>
          ) : (
            <div className="w-full max-w-[520px]" />
          )}
          <div className="flex items-center justify-end gap-2.5 text-sm text-[#b6c0cf]">
            <span>English</span>
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-[#44b7ff] to-[#6ad3ff] text-[13px] font-bold text-[#04131f]">
              SP
            </span>
            <span className="text-sm text-[#f3f6fb]">Sponsor Portal</span>
            <button
              type="button"
              onClick={() => {
                clearSession();
                navigate("/signin");
              }}
              className="ml-3 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="my-4 text-sm text-[#97a2b6]">
          <p>{breadcrumb}</p>
        </section>

        {renderMain()}
      </main>
    </div>
  );
}

export default Sponsor;
