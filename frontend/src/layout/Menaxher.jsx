import { useMemo, useState } from "react";

const sidebarLinks = [
  "Dashboard",
  "Event Control",
  "User & Role",
  "Schedule Control",
  "Ticket Management",
  "Reports",
];

const initialEvents = [
  { id: "evt-101", name: "Digital Business Summit", date: "May 24, 2026", venue: "Prishtine", status: "Draft" },
  { id: "evt-102", name: "Design Leaders Conference", date: "Jun 02, 2026", venue: "Tirana", status: "Published" },
  { id: "evt-103", name: "Startup Networking Night", date: "Jun 18, 2026", venue: "Prizren", status: "Published" },
];

const initialUsers = [
  { id: "usr-01", name: "Arta Krasniqi", role: "Speaker", status: "Active" },
  { id: "usr-02", name: "Leon Berisha", role: "Organizer", status: "Active" },
  { id: "usr-03", name: "Albin Gashi", role: "Attendee", status: "Suspended" },
];

const initialSchedule = [
  { id: "sch-1", event: "Digital Business Summit", slot: "09:00 - 09:45", session: "Opening Keynote", speaker: "Arta Krasniqi" },
  { id: "sch-2", event: "Digital Business Summit", slot: "10:00 - 10:45", session: "Scaling Event Ops", speaker: "Leon Berisha" },
  { id: "sch-3", event: "Design Leaders Conference", slot: "13:00 - 13:45", session: "Design Systems Live", speaker: "Nora Deda" },
];

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
  const [events, setEvents] = useState(initialEvents);
  const [users, setUsers] = useState(initialUsers);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [tickets, setTickets] = useState(initialTickets);

  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    venue: "",
  });
  const [userForm, setUserForm] = useState({
    name: "",
    role: "Attendee",
  });
  const [scheduleForm, setScheduleForm] = useState({
    event: "",
    slot: "",
    session: "",
    speaker: "",
  });

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

  function createEvent(e) {
    e.preventDefault();
    if (!eventForm.name || !eventForm.date || !eventForm.venue) return;
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        name: eventForm.name,
        date: eventForm.date,
        venue: eventForm.venue,
        status: "Draft",
      },
      ...prev,
    ]);
    setEventForm({ name: "", date: "", venue: "" });
  }

  function addUser(e) {
    e.preventDefault();
    if (!userForm.name) return;
    setUsers((prev) => [
      {
        id: `usr-${Date.now()}`,
        name: userForm.name,
        role: userForm.role,
        status: "Active",
      },
      ...prev,
    ]);
    setUserForm({ name: "", role: "Attendee" });
  }

  function addSchedule(e) {
    e.preventDefault();
    if (!scheduleForm.event || !scheduleForm.slot || !scheduleForm.session || !scheduleForm.speaker) return;
    setSchedule((prev) => [
      { id: `sch-${Date.now()}`, ...scheduleForm },
      ...prev,
    ]);
    setScheduleForm({ event: "", slot: "", session: "", speaker: "" });
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
          <form className="mt-4 grid gap-3" onSubmit={createEvent}>
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Event Name"
              value={eventForm.name}
              onChange={(e) => setEventForm((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Event Date"
              value={eventForm.date}
              onChange={(e) => setEventForm((p) => ({ ...p, date: e.target.value }))}
            />
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Venue"
              value={eventForm.venue}
              onChange={(e) => setEventForm((p) => ({ ...p, venue: e.target.value }))}
            />
            <button className="rounded-[10px] bg-[#ff8b0f] px-4 py-2.5 text-sm font-semibold text-[#17120c] hover:bg-[#ff9f1a]">
              Add Event
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Event List</h3>
          <ul className="mt-4 flex list-none flex-col gap-3 p-0">
            {events.map((event) => (
              <li key={event.id} className="flex items-center justify-between rounded-[10px] border border-[#293346] bg-[#161d27] p-3">
                <div>
                  <p className="m-0 text-[14px] text-[#f8fbff]">{event.name}</p>
                  <p className="mt-1 text-[12px] text-[#95a2ba]">
                    {event.date} · {event.venue}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusPill(event.status)}`}>{event.status}</span>
                  <button
                    type="button"
                    className="rounded-[8px] border border-[#2b3446] bg-[#11161f] px-2.5 py-1.5 text-[12px] text-[#f3f6fb] hover:bg-white/5"
                    onClick={() =>
                      setEvents((prev) =>
                        prev.map((x) =>
                          x.id === event.id
                            ? { ...x, status: x.status === "Draft" ? "Published" : "Draft" }
                            : x,
                        ),
                      )
                    }
                  >
                    Toggle
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
                    onClick={() =>
                      setUsers((prev) =>
                        prev.map((x) =>
                          x.id === user.id
                            ? { ...x, status: x.status === "Active" ? "Suspended" : "Active" }
                            : x,
                        ),
                      )
                    }
                  >
                    Toggle
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
      </main>
    </div>
  );
}

export default ManagerDashboard;
