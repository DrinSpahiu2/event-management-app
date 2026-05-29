import { useCallback, useEffect, useMemo, useState } from "react";
import ManagerEditModal from "./ManagerEditModal.jsx";
import ManagerEventCategories from "./ManagerEventCategories.jsx";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const sidebarLinks = [
  "Dashboard",
  "Event Control",
  "Event Categories",
  "User & Role",
  "Schedule Control",
  "Ticket Management",
  "Reports",
];

// initialUsers/initialSchedule removed (manager now loads from backend)


const initialTickets = [
  { id: "tkt-1", event: "Digital Business Summit", type: "Standard", sold: 380, capacity: 500, status: "Open" },
  { id: "tkt-2", event: "Design Leaders Conference", type: "VIP", sold: 72, capacity: 100, status: "Open" },
  { id: "tkt-3", event: "Startup Networking Night", type: "Early Bird", sold: 140, capacity: 140, status: "Closed" },
];

function statusPill(status) {
  if (status === "Published" || status === "Active" || status === "Open") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
  }
  if (status === "Draft" || status === "Suspended") {
    return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  }
  if (status === "Closed") {
    return "border-rose-400/25 bg-rose-400/10 text-rose-100";
  }
  return "border-[#2b3446] bg-[#11161f] text-[#b6c0cf]";
}

function ManagerDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventMessage, setEventMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [tickets, setTickets] = useState(initialTickets);

  const emptyEventForm = () => ({
    titulli: "",
    pershkrimi: "",
    data_fillimit: null,
    data_perfundimit: null,
    lokacioni: "",
    kapaciteti: "",
    statusi: "aktiv",
    publication_status: "draft",
    organizer_id: localStorage.getItem("userId") || "",
    imazhi: "",
    speaker_id: "",
    tema: "",
    ora: "",
  });

  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [speakers, setSpeakers] = useState([]);

  const loadSpeakers = useCallback(async () => {
    try {
      const res = await fetch("/api/manager/speakers");
      if (!res.ok) throw new Error("Failed");
      setSpeakers(await res.json());
    } catch {
      setEventMessage("Nuk u ngarkuan speakerët.");
    }
  }, []);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const res = await fetch("/api/manager/events");
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data);
    } catch {
      setEventMessage("Nuk u ngarkuan eventet nga serveri.");
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    loadSpeakers();
    // Load manager users + schedule
    (async () => {
      try {
        const [uRes, sRes] = await Promise.all([
          fetch("/api/manager/users"),
          fetch("/api/manager/schedule"),
        ]);
        if (uRes.ok) setUsers(await uRes.json());
        if (sRes.ok) setSchedule(await sRes.json());
      } catch {
        // Keep empty arrays if backend isn't wired yet.
      }
    })();
  }, [loadEvents, loadSpeakers]);

  const [userForm, setUserForm] = useState({
    name: "",
    role: "Attendee",
    email: "",
    passwordi: "",
    telefoni: "",
    fotoja: "",
  });

  const [scheduleForm, setScheduleForm] = useState({
    event: "",
    slot: "",
    session: "",
    speaker: "",
  });

  const [eventEditOpen, setEventEditOpen] = useState(false);
  const [eventEditLoading, setEventEditLoading] = useState(false);
  const [eventEditMessage, setEventEditMessage] = useState("");
  const [eventEditValues, setEventEditValues] = useState(null);

  const [userEditOpen, setUserEditOpen] = useState(false);
  const [userEditLoading, setUserEditLoading] = useState(false);
  const [userEditMessage, setUserEditMessage] = useState("");
  const [userEditValues, setUserEditValues] = useState(null);



  const dashboardCards = useMemo(
    () => [
      { label: "Total Events", value: String(events.length), icon: "📅" },
      { label: "Total Users", value: String(users.length), icon: "👥" },
      { label: "Schedule Slots", value: String(schedule.length), icon: "🕒" },
      {
        label: "Tickets Sold",
        value: String(tickets.reduce((sum, t) => sum + t.sold, 0)),
        icon: "🎟",
      },
    ],
    [events.length, users.length, schedule.length, tickets],
  );

  async function createEvent(e) {
    e.preventDefault();
    if (
      !eventForm.titulli ||
      !eventForm.data_fillimit ||
      !eventForm.data_perfundimit ||
      !eventForm.lokacioni
    ) {
      return;
    }
    if (eventForm.speaker_id && (!eventForm.tema || !eventForm.ora)) {
      setEventMessage("Për speaker-in plotëso temën dhe orën.");
      return;
    }
    setEventMessage("");
    try {
      const body = {
        titulli: eventForm.titulli,
        pershkrimi: eventForm.pershkrimi,
        data_fillimit: eventForm.data_fillimit ? format(eventForm.data_fillimit, "yyyy-MM-dd'T'HH:mm:ss") : null,
        data_perfundimit: eventForm.data_perfundimit ? format(eventForm.data_perfundimit, "yyyy-MM-dd'T'HH:mm:ss") : null,
        lokacioni: eventForm.lokacioni,
        kapaciteti:
          eventForm.kapaciteti !== "" ? Number(eventForm.kapaciteti) : null,
        statusi: eventForm.statusi,
        publication_status: eventForm.publication_status,
        organizer_id:
          eventForm.organizer_id !== "" ? Number(eventForm.organizer_id) : null,
        imazhi: eventForm.imazhi,
      };
      if (eventForm.speaker_id) {
        body.speaker_id = Number(eventForm.speaker_id);
        body.tema = eventForm.tema;
        body.ora = eventForm.ora;
      }

      const res = await fetch("/api/manager/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setEvents((prev) => [data, ...prev]);
      setEventForm(emptyEventForm());
      setEventMessage("Eventi u shtua.");
    } catch (err) {
      setEventMessage(err.message || "Nuk u shtua eventi.");
    }
  }

  const eventCrudEndpoint = (id) => `/api/manager/events-crud/${id}`;
  const userCrudEndpoint = (id) => `/api/manager/users-crud/${id}`;

  async function toggleEventStatus(eventId) {
    setEventMessage("");
    try {
      const res = await fetch(`/api/manager/events/${eventId}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setEvents((prev) => prev.map((x) => (x.id === eventId ? data : x)));
    } catch (err) {
      setEventMessage(err.message || "Nuk u ndryshua statusi.");
    }
  }

  async function addUser(e) {
    e.preventDefault();
    if (!userForm.name) return;
    setEventMessage("");
    try {
      const res = await fetch("/api/manager/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userForm.name,
          role: userForm.role,
          email: userForm.email,
          passwordi: userForm.passwordi,
          telefoni: userForm.telefoni || null,
          fotoja: userForm.fotoja || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setUsers((prev) => [data, ...prev]);
      setUserForm({
        name: "",
        role: "Attendee",
        email: "",
        passwordi: "",
        telefoni: "",
        fotoja: "",
      });
    } catch (err) {
      setEventMessage(err.message || "Nuk u shtua user");
    }
  }


  const openEventEdit = (ev) => {
    setEventEditValues({
      id: ev.id,
      titulli: ev.name,
      pershkrimi: ev.pershkrimi || "",
      data_fillimit: ev.data_fillimit || "",
      data_perfundimit: ev.data_perfundimit || "",
      lokacioni: ev.venue,
      kapaciteti: ev.kapaciteti || "",
      statusi: ev.statusi || "aktiv",
      publication_status: ev.publication_status || "draft",
    });
    setEventEditMessage("");
    setEventEditOpen(true);
  };

  const saveEventEdit = async (values) => {
    if (!values?.id) return;
    setEventEditLoading(true);
    setEventEditMessage("");
    try {
      const res = await fetch(eventCrudEndpoint(values.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulli: values.titulli,
          pershkrimi: values.pershkrimi,
          lokacioni: values.lokacioni,
          kapaciteti:
            values.kapaciteti !== "" && values.kapaciteti != null
              ? Number(values.kapaciteti)
              : null,
          statusi: values.statusi,
          publication_status: values.publication_status,
          data_fillimit: values.data_fillimit
            ? new Date(values.data_fillimit)
            : undefined,
          data_perfundimit: values.data_perfundimit
            ? new Date(values.data_perfundimit)
            : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setEvents((prev) => prev.map((x) => (x.id === values.id ? { ...x, ...data } : x)));
      setEventEditOpen(false);
    } catch (err) {
      setEventEditMessage(err.message || "Nuk u përditësua eventi");
    } finally {
      setEventEditLoading(false);
    }
  };

  const openUserEdit = (u) => {
    setUserEditValues({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      status: u.status,
    });
    setUserEditMessage("");
    setUserEditOpen(true);
  };

  const saveUserEdit = async (values) => {
    if (!values?.id) return;
    setUserEditLoading(true);
    setUserEditMessage("");
    try {
      const res = await fetch(userCrudEndpoint(values.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          role: values.role,
          name: values.name,
          status: values.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setUsers((prev) => prev.map((x) => (x.id === values.id ? { ...x, ...data } : x)));
      setUserEditOpen(false);
    } catch (err) {
      setUserEditMessage(err.message || "Nuk u përditësua user");
    } finally {
      setUserEditLoading(false);
    }
  };

  async function addSchedule(e) {
    e.preventDefault();
    if (!scheduleForm.event || !scheduleForm.session || !scheduleForm.slot) return;
    // UI currently doesn't collect exact timestamps; derive from slot string.
    // Expected slot format is free text, so we do a minimal best-effort:
    // if slot looks like "HH:mm - HH:mm" use today's date.
    const today = new Date();
    const parts = String(scheduleForm.slot).split("-").map((s) => s.trim());
    const [startStr, endStr] = parts;
    const parseTime = (v) => {
      if (!v) return null;
      const t = v.slice(0, 5);
      const [hh, mm] = t.split(":").map(Number);
      if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
      const d = new Date(today);
      d.setHours(hh, mm, 0, 0);
      return d;
    };
    const start = parseTime(startStr);
    const end = parseTime(endStr);
    if (!start || !end) {
      setEventMessage("Për agjendë, 'slot' duhet të jetë HH:mm - HH:mm");
      return;
    }

    setEventMessage("");
    try {
      const res = await fetch("/api/manager/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: scheduleForm.event,
          session: scheduleForm.session,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");

      // Reload schedule list from server to reflect DB state
      const sRes = await fetch("/api/manager/schedule");
      if (sRes.ok) setSchedule(await sRes.json());

      setScheduleForm({ event: "", slot: "", session: "", speaker: "" });
    } catch (err) {
      setEventMessage(err.message || "Nuk u shtua orari");
    }
  }


  function renderDashboard() {
    return (
      <>
        <section className="my-4 text-sm text-[#97a2b6]">
          <p>Home / Manager / Dashboard</p>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {dashboardCards.map((card) => (
            <article
              key={card.label}
              className="flex items-center justify-between rounded-xl border border-[#283143] bg-[#1b212c] p-4"
            >
              <div>
                <h2 className="m-0 text-[34px] leading-none text-white">{card.value}</h2>
                <p className="mt-1.5 text-sm text-[#9ca6b7]">{card.label}</p>
              </div>
              <span className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#2b3446] text-lg">
                {card.icon}
              </span>
            </article>
          ))}
        </section>
      </>
    );
  }

  function renderEventControl() {
    return (
      <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Create Event</h3>
          {eventMessage ? (
            <p className="mt-2 text-[13px] text-[#95a2ba]">{eventMessage}</p>
          ) : null}
          <form className="mt-4 grid gap-3" onSubmit={createEvent}>
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Titulli *"
              value={eventForm.titulli}
              onChange={(e) => setEventForm((p) => ({ ...p, titulli: e.target.value }))}
              required
            />
            <textarea
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Përshkrimi"
              rows={3}
              value={eventForm.pershkrimi}
              onChange={(e) => setEventForm((p) => ({ ...p, pershkrimi: e.target.value }))}
            />
            <DatePicker
              className="w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholderText="Data e fillimit *"
              selected={eventForm.data_fillimit}
              onChange={(date) => setEventForm((p) => ({ ...p, data_fillimit: date }))}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              required
            />
            <DatePicker
              className="w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholderText="Data e perfundimit *"
              selected={eventForm.data_perfundimit}
              onChange={(date) => setEventForm((p) => ({ ...p, data_perfundimit: date }))}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              required
            />
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Lokacioni *"
              value={eventForm.lokacioni}
              onChange={(e) => setEventForm((p) => ({ ...p, lokacioni: e.target.value }))}
              required
            />
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              type="number"
              min={1}
              placeholder="Kapaciteti"
              value={eventForm.kapaciteti}
              onChange={(e) => setEventForm((p) => ({ ...p, kapaciteti: e.target.value }))}
            />
            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              value={eventForm.statusi}
              onChange={(e) => setEventForm((p) => ({ ...p, statusi: e.target.value }))}
            >
              <option value="aktiv">Aktiv</option>
              <option value="anuluar">Anuluar</option>
              <option value="perfunduar">Përfunduar</option>
            </select>
            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              value={eventForm.publication_status}
              onChange={(e) =>
                setEventForm((p) => ({ ...p, publication_status: e.target.value }))
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              type="number"
              placeholder="Organizer ID"
              value={eventForm.organizer_id}
              onChange={(e) => setEventForm((p) => ({ ...p, organizer_id: e.target.value }))}
            />
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="URL imazhi"
              value={eventForm.imazhi}
              onChange={(e) => setEventForm((p) => ({ ...p, imazhi: e.target.value }))}
            />
            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              value={eventForm.speaker_id}
              onChange={(e) => setEventForm((p) => ({ ...p, speaker_id: e.target.value }))}
            >
              <option value="">— Speaker (opsional) —</option>
              {speakers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {eventForm.speaker_id ? (
              <>
                <input
                  className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
                  placeholder="Tema e prezantimit *"
                  value={eventForm.tema}
                  onChange={(e) => setEventForm((p) => ({ ...p, tema: e.target.value }))}
                />
                <input
                  className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
                  type="time"
                  value={eventForm.ora}
                  onChange={(e) => setEventForm((p) => ({ ...p, ora: e.target.value }))}
                  required
                />
              </>
            ) : null}
            <button
              type="submit"
              className="rounded-[10px] bg-[#ff8b0f] px-4 py-2.5 text-sm font-semibold text-[#17120c] hover:bg-[#ff9f1a]"
            >
              Add Event
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Event List</h3>
          {eventsLoading ? (
            <p className="mt-4 text-[13px] text-[#95a2ba]">Duke ngarkuar...</p>
          ) : null}
          <ul className="mt-4 flex list-none flex-col gap-3 p-0">
            {events.map((event) => (
              <li key={event.id} className="flex items-center justify-between rounded-[10px] border border-[#293346] bg-[#161d27] p-3">
                <div>
                  <p className="m-0 text-[14px] text-[#f8fbff]">{event.name}</p>
                  <p className="mt-1 text-[12px] text-[#95a2ba]">
                    {event.date} · {event.venue}
                  </p>
                  {event.speakers?.length > 0 ? (
                    <p className="mt-1 text-[12px] text-[#7dd3a8]">
                      🎤{" "}
                      {event.speakers
                        .map((s) => `${s.name} (${s.tema}, ${s.ora})`)
                        .join(" · ")}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusPill(event.status)}`}>{event.status}</span>
                  <button
                    type="button"
                    className="rounded-[8px] border border-[#2b3446] bg-[#11161f] px-2.5 py-1.5 text-[12px] text-[#f3f6fb] hover:bg-white/5 disabled:opacity-40"
                    onClick={() => toggleEventStatus(event.id)}
                    disabled={event.status === "Published"}
                    title={event.status === "Published" ? "Toggle disabled for Published" : undefined}
                  >
                    Toggle
                  </button>

                  <button
                    type="button"
                    className="rounded-[8px] border border-amber-400/30 bg-[#11161f] px-2.5 py-1.5 text-[12px] text-amber-100 hover:bg-white/5"
                    onClick={() => openEventEdit(event)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="rounded-[8px] border border-rose-400/30 bg-[#11161f] px-2.5 py-1.5 text-[12px] text-rose-100 hover:bg-white/5"
                    onClick={async () => {
                      const ok = window.confirm("Delete event?" );
                      if (!ok) return;
                      const res = await fetch(eventCrudEndpoint(event.id), { method: "DELETE" });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) throw new Error(data.error || "Gabim");
                      setEvents((prev) => prev.filter((x) => x.id !== event.id));
                      setEventMessage("");
                    }}
                  >
                    Delete
                  </button>

                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    );
  }

  function renderUserRole() {
    return (
      <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Add User</h3>
          <form className="mt-4 grid gap-3" onSubmit={addUser}>
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Full Name"
              value={userForm.name}
              onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))}
              required
            />

            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              value={userForm.role}
              onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}
            >
              <option>Attendee</option>
              <option>Speaker</option>
              <option>Organizer</option>
              <option>Manager</option>
            </select>

            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Email *"
              value={userForm.email}
              onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))}
              type="email"
              required
            />

            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Password *"
              value={userForm.passwordi}
              onChange={(e) => setUserForm((p) => ({ ...p, passwordi: e.target.value }))}
              type="password"
              required
            />

            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Phone (optional)"
              value={userForm.telefoni}
              onChange={(e) => setUserForm((p) => ({ ...p, telefoni: e.target.value }))}
            />

            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Foto URL (optional)"
              value={userForm.fotoja}
              onChange={(e) => setUserForm((p) => ({ ...p, fotoja: e.target.value }))}
            />

            <button className="rounded-[10px] bg-[#ff8b0f] px-4 py-2.5 text-sm font-semibold text-[#17120c] hover:bg-[#ff9f1a]">
              Add User
            </button>
          </form>

        </article>

        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">User & Role List</h3>
          <ul className="mt-4 flex list-none flex-col gap-3 p-0">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between rounded-[10px] border border-[#293346] bg-[#161d27] p-3">
                <div>
                  <p className="m-0 text-[14px] text-[#f8fbff]">{user.name}</p>
                  <p className="mt-1 text-[12px] text-[#95a2ba]">Role: {user.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusPill(user.status)}`}>{user.status}</span>
                  <button
                    type="button"
                    className="rounded-[8px] border border-[#2b3446] bg-[#11161f] px-2.5 py-1.5 text-[12px] text-[#f3f6fb] hover:bg-white/5"
                    onClick={async () => {
                      const nextStatus = user.status === "Active" ? "Suspended" : "Active";
                      try {
                        const res = await fetch(`/api/manager/users/${user.id}/status`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: nextStatus }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || "Gabim");
                        setUsers((prev) =>
                          prev.map((x) => (x.id === user.id ? { ...x, status: data.status } : x)),
                        );
                      } catch (err) {
                        setEventMessage(err.message || "Nuk u ndryshua statusi");
                      }
                    }}
                  >
                    Toggle
                  </button>

                  <button
                    type="button"
                    className="rounded-[8px] border border-amber-400/30 bg-[#11161f] px-2.5 py-1.5 text-[12px] text-amber-100 hover:bg-white/5 disabled:opacity-40"
                    onClick={() => openUserEdit(user)}
                    disabled={user.role === "SuperAdmin"}
                    title={user.role === "SuperAdmin" ? "Managers cannot edit SuperAdmin" : undefined}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="rounded-[8px] border border-rose-400/30 bg-[#11161f] px-2.5 py-1.5 text-[12px] text-rose-100 hover:bg-white/5 disabled:opacity-40"
                    onClick={async () => {
                      const ok = window.confirm("Delete user?" );
                      if (!ok) return;
                      const res = await fetch(userCrudEndpoint(user.id), { method: "DELETE" });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) throw new Error(data.error || "Gabim");
                      setUsers((prev) => prev.filter((x) => x.id !== user.id));
                      setEventMessage("");
                    }}
                    disabled={user.role === "SuperAdmin"}
                    title={user.role === "SuperAdmin" ? "Managers cannot delete SuperAdmin" : undefined}
                  >
                    Delete
                  </button>


                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    );
  }

  function renderScheduleControl() {
    return (
      <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Create Schedule Slot</h3>
          <form className="mt-4 grid gap-3" onSubmit={addSchedule}>
            {[
              ["Event", "event"],
              ["Time Slot", "slot"],
              ["Session Title", "session"],
              ["Speaker Name", "speaker"],
            ].map(([label, key]) => (
              <input
                key={key}
                className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
                placeholder={label}
                value={scheduleForm[key]}
                onChange={(e) => setScheduleForm((p) => ({ ...p, [key]: e.target.value }))}
              />
            ))}
            <button className="rounded-[10px] bg-[#ff8b0f] px-4 py-2.5 text-sm font-semibold text-[#17120c] hover:bg-[#ff9f1a]">
              Add Slot
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Schedule List</h3>
          <ul className="mt-4 flex list-none flex-col gap-3 p-0">
            {schedule.map((slot) => (
              <li key={slot.id} className="rounded-[10px] border border-[#293346] bg-[#161d27] p-3">
                <p className="m-0 text-[14px] text-[#f8fbff]">{slot.session}</p>
                <p className="mt-1 text-[12px] text-[#95a2ba]">
                  {slot.event} · {slot.slot} · {slot.speaker}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    );
  }

  function renderTickets() {
    return (
      <section className="mt-4 rounded-xl border border-[#283143] bg-[#1b212c] p-4">
        <h3 className="m-0 text-xl text-[#f4f7fb]">Ticket Management</h3>
        <ul className="mt-4 flex list-none flex-col gap-3 p-0">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="flex flex-col gap-2 rounded-[10px] border border-[#293346] bg-[#161d27] p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="m-0 text-[14px] text-[#f8fbff]">
                  {ticket.event} · {ticket.type}
                </p>
                <p className="mt-1 text-[12px] text-[#95a2ba]">
                  Sold: {ticket.sold} / {ticket.capacity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusPill(ticket.status)}`}>{ticket.status}</span>
                <button
                  type="button"
                  className="rounded-[8px] border border-[#2b3446] bg-[#11161f] px-2.5 py-1.5 text-[12px] text-[#f3f6fb] hover:bg-white/5"
                  onClick={() =>
                    setTickets((prev) =>
                      prev.map((x) =>
                        x.id === ticket.id
                          ? { ...x, status: x.status === "Open" ? "Closed" : "Open" }
                          : x,
                      ),
                    )
                  }
                >
                  Toggle
                </button>
                <button
                  type="button"
                  className="rounded-[8px] border border-[#2b3446] bg-[#11161f] px-2.5 py-1.5 text-[12px] text-[#f3f6fb] hover:bg-white/5"
                  onClick={() =>
                    setTickets((prev) =>
                      prev.map((x) =>
                        x.id === ticket.id && x.sold < x.capacity
                          ? { ...x, sold: x.sold + 1 }
                          : x,
                      ),
                    )
                  }
                >
                  + Sale
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  function renderReports() {
    const publishedEvents = events.filter((e) => e.status === "Published").length;
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const soldTotal = tickets.reduce((sum, t) => sum + t.sold, 0);
    const capacityTotal = tickets.reduce((sum, t) => sum + t.capacity, 0);
    const occupancy = capacityTotal === 0 ? 0 : Math.round((soldTotal / capacityTotal) * 100);

    return (
      <section className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Published Events", value: String(publishedEvents), icon: "✅" },
          { label: "Active Users", value: String(activeUsers), icon: "🧑‍💼" },
          { label: "Tickets Sold", value: String(soldTotal), icon: "🎟" },
          { label: "Occupancy", value: `${occupancy}%`, icon: "📈" },
        ].map((card) => (
          <article key={card.label} className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
            <p className="m-0 text-sm text-[#9ca6b7]">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#f8fbff]">{card.value}</p>
            <p className="mt-2 text-lg">{card.icon}</p>
          </article>
        ))}
      </section>
    );
  }

  function renderMain() {
    if (activePage === "Event Control") return renderEventControl();
    if (activePage === "Event Categories") return <ManagerEventCategories />;
    if (activePage === "User & Role") return renderUserRole();
    if (activePage === "Schedule Control") return renderScheduleControl();
    if (activePage === "Ticket Management") return renderTickets();
    if (activePage === "Reports") return renderReports();
    return renderDashboard();
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

        <nav className="flex flex-col gap-2.5" aria-label="Manager Navigation">
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
              placeholder="Search manager items . . ."
              aria-label="Search manager items"
            />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-sm text-[#b6c0cf]">
            <span>English</span>
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-[#44b7ff] to-[#6ad3ff] text-[13px] font-bold text-[#04131f]">
              MG
            </span>
            <span className="text-sm text-[#f3f6fb]">Manager</span>
          </div>
        </header>

        {activePage !== "Dashboard" ? (
          <section className="my-4 text-sm text-[#97a2b6]">
            <p>Home / Manager / {activePage}</p>
          </section>
        ) : null}

        {renderMain()}

        {/* Event Edit Modal */}
        <ManagerEditModal
          open={eventEditOpen}
          title="Edit Event"
          loading={eventEditLoading}
          message={eventEditMessage}
          initialValues={eventEditValues || {}}
          fields={[
            { key: "titulli", label: "Title", required: true, placeholder: "Event title" },
            { key: "pershkrimi", label: "Description", placeholder: "Description", type: "textarea" },
            { key: "data_fillimit", label: "Start (display)", required: false, placeholder: "YYYY-MM-DD HH:mm" },
            { key: "data_perfundimit", label: "End (display)", required: false, placeholder: "YYYY-MM-DD HH:mm" },
            { key: "lokacioni", label: "Venue", required: true, placeholder: "Location" },
            { key: "kapaciteti", label: "Capacity", required: false, placeholder: "Capacity" },
            {
              key: "publication_status",
              label: "Publication",
              required: true,
              type: "select",
              options: ["draft", "published"],
            },
            {
              key: "statusi",
              label: "Status",
              required: true,
              type: "select",
              options: ["aktiv", "anuluar", "perfunduar"],
            },
          ]}
          submitLabel="Save Event"
          onClose={() => {
            setEventEditOpen(false);
            setEventEditMessage("");
          }}
          onSubmit={(values) => saveEventEdit(values)}
        />

        {/* User Edit Modal */}
        <ManagerEditModal
          open={userEditOpen}
          title="Edit User"
          loading={userEditLoading}
          message={userEditMessage}
          initialValues={userEditValues || {}}
          fields={[
            { key: "name", label: "Full name", required: true, placeholder: "Name" },
            { key: "email", label: "Email", required: true, placeholder: "Email" },
            {
              key: "role",
              label: "Role",
              required: true,
              type: "select",
              options: [
                "Attendee",
                "Speaker",
                "Organizer",
                "Manager",
              ],
            },
            {
              key: "status",
              label: "Status",
              required: true,
              type: "select",
              options: ["Active", "Suspended"],
            },
          ]}
          submitLabel="Save User"
          onClose={() => {
            setUserEditOpen(false);
            setUserEditMessage("");
          }}
          onSubmit={(values) => saveUserEdit(values)}
        />
      </main>
    </div>
  );
}

export default ManagerDashboard;

