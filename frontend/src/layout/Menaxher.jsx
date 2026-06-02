import { useCallback, useEffect, useMemo, useState } from "react";
import ManagerEditModal from "./ManagerEditModal.jsx";
import ManagerEventCategories from "./ManagerEventCategories.jsx";
import { certificateApi } from "../api/certificateApi.js";
import { couponApi } from "../api/couponApi.js";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const sidebarLinks = [
  "Dashboard",
  "Event Control",
  "Event Categories",
  "User & Role",
  "Schedule Control",
  "Sponsorship Requests",
  "Ticket Management",
  "Feedback",
  "Contact Messages",
  "Certificates",
  "Coupons",
  "Reports",
];

// initialUsers/initialSchedule removed (manager now loads from backend)


function formatPrice(value) {
  if (value == null || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return num.toFixed(2);
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      "Backend API unavailable. Restart the backend (cd backend && npm run dev) and refresh this page.",
    );
  }
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Request failed (${res.status})`);
  }
  return data;
}

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

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [managerFeedbacks, setManagerFeedbacks] = useState([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);
  const [feedbacksError, setFeedbacksError] = useState("");

  const [dashboardStats, setDashboardStats] = useState({
    futureEventsCount: 0,
    soldTickets: 0,
    income: 0,
    futureEvents: [],
  });
  const [dashboardStatsLoading, setDashboardStatsLoading] = useState(true);
  const [dashboardStatsError, setDashboardStatsError] = useState("");

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
    lloji: "Standard",
    cmimi: "",
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

  const loadTickets = useCallback(async () => {
    setTicketsLoading(true);
    try {
      const res = await fetch("/api/tickets");
      if (!res.ok) throw new Error("Failed");
      setTickets(await res.json());
    } catch {
      setEventMessage("Nuk u ngarkuan biletat.");
    } finally {
      setTicketsLoading(false);
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

  const loadManagerFeedbacks = useCallback(async () => {
    setFeedbacksLoading(true);
    setFeedbacksError("");
    try {
      const res = await fetch("/api/manager/feedback");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setManagerFeedbacks(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedbacksError(err.message || "Nuk u ngarkuan feedback-et.");
      setManagerFeedbacks([]);
    } finally {
      setFeedbacksLoading(false);
    }
  }, []);

  const loadDashboardStats = useCallback(async () => {
    setDashboardStatsLoading(true);
    setDashboardStatsError("");
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setDashboardStats(data);
    } catch (err) {
      setDashboardStatsError(
        err.message ||
          "Nuk u lidh me serverin. Nis backend-in (npm run dev në backend).",
      );
      setDashboardStats({
        futureEventsCount: 0,
        soldTickets: 0,
        income: 0,
        futureEvents: [],
      });
    } finally {
      setDashboardStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    loadTickets();
    loadSpeakers();
    loadManagerFeedbacks();
    loadDashboardStats();
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
  }, [
    loadEvents,
    loadTickets,
    loadSpeakers,
    loadManagerFeedbacks,
    loadDashboardStats,
  ]);

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

  const [sponsorshipRequests, setSponsorshipRequests] = useState([]);
  const [sponsorshipLoading, setSponsorshipLoading] = useState(false);
  const [sponsorshipError, setSponsorshipError] = useState("");
  const [sponsorshipStatusFilter, setSponsorshipStatusFilter] = useState("");

  const [certEventId, setCertEventId] = useState("");
  const [certEventData, setCertEventData] = useState({
    totalIssued: 0,
    certificates: [],
    eventTitle: "",
  });
  const [certsLoading, setCertsLoading] = useState(false);
  const [certMessage, setCertMessage] = useState("");
  const [certIssueForm, setCertIssueForm] = useState({
    user_id: "",
    event_id: "",
    kodi: "",
  });

  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponEventFilter, setCouponEventFilter] = useState("");
  const [couponForm, setCouponForm] = useState({
    id: null,
    code: "",
    discount_type: "percentage",
    discount_value: "",
    is_active: true,
    event_id: "",
  });

  const [contactMessages, setContactMessages] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("");
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replySaving, setReplySaving] = useState(false);

  const loadSponsorshipRequests = useCallback(async () => {
    setSponsorshipLoading(true);
    setSponsorshipError("");
    try {
      const url = sponsorshipStatusFilter
        ? `/api/manager/sponsorships?status=${encodeURIComponent(sponsorshipStatusFilter)}`
        : "/api/manager/sponsorships";
      const data = await fetchJson(url);
      setSponsorshipRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setSponsorshipError(err.message || "Nuk u ngarkuan kërkesat e sponsorizimit.");
      setSponsorshipRequests([]);
    } finally {
      setSponsorshipLoading(false);
    }
  }, [sponsorshipStatusFilter]);

  const loadCertEventData = useCallback(async (eventId) => {
    if (!eventId) {
      setCertEventData({ totalIssued: 0, certificates: [], eventTitle: "" });
      return;
    }
    setCertsLoading(true);
    setCertMessage("");
    try {
      const data = await certificateApi.getByEvent(eventId);
      setCertEventData({
        totalIssued: data.totalIssued ?? 0,
        certificates: data.certificates ?? [],
        eventTitle: data.eventTitle ?? "",
      });
    } catch (err) {
      setCertMessage(err.message || "Nuk u lexuan certifikatat.");
      setCertEventData({ totalIssued: 0, certificates: [], eventTitle: "" });
    } finally {
      setCertsLoading(false);
    }
  }, []);

  const loadCoupons = useCallback(async () => {
    setCouponsLoading(true);
    setCouponError("");
    try {
      const data = await couponApi.list();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      setCouponError(err.message || "Nuk u lexuan kuponët.");
      setCoupons([]);
    } finally {
      setCouponsLoading(false);
    }
  }, []);

  const loadContactMessages = useCallback(async () => {
    setContactLoading(true);
    setContactError("");
    try {
      const url = contactStatusFilter
        ? `/api/manager/contact-messages?status=${encodeURIComponent(contactStatusFilter)}`
        : "/api/manager/contact-messages";
      const data = await fetchJson(url);
      setContactMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setContactError(err.message || "Nuk u lexuan mesazhet e kontaktit.");
      setContactMessages([]);
    } finally {
      setContactLoading(false);
    }
  }, [contactStatusFilter]);

  const filteredCoupons = useMemo(() => {
    if (!couponEventFilter) return coupons;
    return coupons.filter(
      (c) => c.eventId === couponEventFilter || c.eventId == null || c.eventId === "",
    );
  }, [coupons, couponEventFilter]);

  useEffect(() => {
    if (activePage === "Sponsorship Requests") {
      loadSponsorshipRequests();
    }
  }, [activePage, loadSponsorshipRequests]);

  useEffect(() => {
    if (activePage === "Coupons") {
      loadCoupons();
    }
  }, [activePage, loadCoupons]);

  useEffect(() => {
    if (activePage === "Contact Messages") {
      loadContactMessages();
    }
  }, [activePage, loadContactMessages]);

  useEffect(() => {
    if (activePage === "Certificates" && certEventId) {
      loadCertEventData(certEventId);
    }
  }, [activePage, certEventId, loadCertEventData]);

  const selectedContact = useMemo(
    () => contactMessages.find((m) => m.id === selectedContactId) || null,
    [contactMessages, selectedContactId],
  );

  useEffect(() => {
    if (selectedContact) {
      setReplyDraft(selectedContact.reply || "");
    } else {
      setReplyDraft("");
    }
  }, [selectedContact]);

  const dashboardCards = useMemo(
    () => [
      {
        label: "Future Events",
        value: dashboardStatsLoading
          ? "…"
          : String(dashboardStats.futureEventsCount ?? 0),
        icon: "📅",
      },
      {
        label: "Sold Tickets",
        value: dashboardStatsLoading
          ? "…"
          : String(dashboardStats.soldTickets ?? 0),
        icon: "🎟",
      },
      {
        label: "Income",
        value: dashboardStatsLoading
          ? "…"
          : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(Number(dashboardStats.income) || 0),
        icon: "💰",
      },
      {
        label: "Total Events",
        value: String(events.length),
        icon: "📋",
      },
    ],
    [dashboardStats, dashboardStatsLoading, events.length],
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
        lloji: eventForm.lloji || "Standard",
        cmimi: eventForm.cmimi !== "" ? Number(eventForm.cmimi) : 0,
        sasia_disponueshme:
          eventForm.kapaciteti !== "" ? Number(eventForm.kapaciteti) : undefined,
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
      await loadTickets();
      await loadDashboardStats();
      setEventForm(emptyEventForm());
      setEventMessage("Eventi dhe bileta u shtuan.");
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
    const ticket = tickets.find((t) => String(t.event_id) === String(ev.id));
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
      ticket_id: ticket?.id ?? null,
      lloji: ticket?.lloji || "Standard",
      cmimi: ticket?.cmimi != null ? String(ticket.cmimi) : "",
      sasia_disponueshme: ticket?.sasia_disponueshme ?? "",
    });
    setEventEditMessage("");
    setEventEditOpen(true);
  };

  async function saveTicketFromEdit(values) {
    const sasia =
      values.sasia_disponueshme !== "" && values.sasia_disponueshme != null
        ? Number(values.sasia_disponueshme)
        : values.kapaciteti !== "" && values.kapaciteti != null
          ? Number(values.kapaciteti)
          : 0;

    if (values.ticket_id) {
      const res = await fetch(`/api/tickets/${values.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lloji: values.lloji || "Standard",
          cmimi: Number(values.cmimi),
          sasia_disponueshme: sasia,
        }),
      });
      if (!res.ok) throw new Error("Bileta nuk u përditësua");
      return;
    }

    if (values.cmimi === "" || values.cmimi == null) return;

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: Number(values.id),
        lloji: values.lloji || "Standard",
        cmimi: Number(values.cmimi),
        sasia_disponueshme: sasia,
      }),
    });
    if (!res.ok) throw new Error("Bileta nuk u krijua");
  }

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
      await saveTicketFromEdit(values);
      await loadTickets();
      setEvents((prev) => prev.map((x) => (x.id === values.id ? { ...x, ...data } : x)));
      setEventEditOpen(false);
      setEventMessage("Eventi dhe bileta u përditësuan.");
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

        {dashboardStatsError ? (
          <p className="my-2 text-sm text-amber-200">{dashboardStatsError}</p>
        ) : null}

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

        <section className="mt-4 rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="m-0 text-xl text-[#f4f7fb]">Upcoming Future Events</h3>
            <button
              type="button"
              className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5"
              onClick={loadDashboardStats}
            >
              Rifresko
            </button>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {dashboardStatsLoading ? (
              <li className="text-[13px] text-[#95a2ba]">Duke ngarkuar eventet...</li>
            ) : null}
            {!dashboardStatsLoading &&
            (dashboardStats.futureEvents?.length ?? 0) === 0 ? (
              <li className="text-[13px] text-[#95a2ba]">Nuk ka evente të ardhshme.</li>
            ) : null}
            {(dashboardStats.futureEvents || []).map((event) => (
              <li
                key={event.id}
                className="flex items-start justify-between gap-3 rounded-[10px] border border-[#293346] bg-[#161d27] p-3"
              >
                <div>
                  <p className="m-0 text-[14px] font-medium text-[#f8fbff]">{event.title}</p>
                  <p className="mt-1 text-[13px] text-[#95a2ba]">
                    {event.host} · {event.date} · {event.time}
                  </p>
                  <p className="mt-1 text-[12px] text-[#8f9ab0]">{event.location}</p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] ${statusPill(event.status)}`}
                >
                  {event.status}
                </span>
              </li>
            ))}
          </ul>
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
              placeholder="Kapaciteti / sasia e biletave"
              value={eventForm.kapaciteti}
              onChange={(e) => setEventForm((p) => ({ ...p, kapaciteti: e.target.value }))}
            />
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Lloji i biletës"
              value={eventForm.lloji}
              onChange={(e) => setEventForm((p) => ({ ...p, lloji: e.target.value }))}
            />
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              type="number"
              min={0}
              step="0.01"
              placeholder="Çmimi i biletës *"
              value={eventForm.cmimi}
              onChange={(e) => setEventForm((p) => ({ ...p, cmimi: e.target.value }))}
              required
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
                    <div className="mt-1">
                      {event.speakers.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between gap-3 text-[12px]"
                        >
                          <p className="text-[#7dd3a8]">
                            🎤 {s.name} ({s.tema}, {s.ora})
                          </p>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] ${
                              s.assignmentStatus === "accepted"
                                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                                : s.assignmentStatus === "declined"
                                  ? "border-rose-400/25 bg-rose-400/10 text-rose-100"
                                  : "border-amber-400/25 bg-amber-400/10 text-amber-100"
                            }`}
                          >
                            {String(s.assignmentStatus || "pending")}
                          </span>
                        </div>
                      ))}
                    </div>
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
                      await loadTickets();
                      setEventMessage("Eventi dhe biletat e tij u fshinë.");
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

  async function updateTicketQuantity(id, sasia) {
    try {
      const res = await fetch(`/api/tickets/${id}/quantity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sasia_disponueshme: Number(sasia) }),
      });
      if (!res.ok) throw new Error("Gabim");
      await loadTickets();
      setEventMessage("Sasia e biletës u përditësua.");
    } catch (err) {
      setEventMessage(err.message || "Nuk u përditësua sasia.");
    }
  }

  async function updateTicketPrice(id, cmimi, ticket) {
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lloji: ticket.lloji,
          cmimi: Number(cmimi),
          sasia_disponueshme: ticket.sasia_disponueshme,
        }),
      });
      if (!res.ok) throw new Error("Gabim");
      await loadTickets();
      setEventMessage("Çmimi i biletës u përditësua.");
    } catch (err) {
      setEventMessage(err.message || "Nuk u përditësua çmimi.");
    }
  }

  async function deleteTicket(id) {
    if (!window.confirm("Fshi këtë biletë?")) return;
    try {
      const res = await fetch(`/api/tickets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gabim");
      await loadTickets();
      setEventMessage("Bileta u fshi.");
    } catch (err) {
      setEventMessage(err.message || "Nuk u fshi bileta.");
    }
  }

  function renderTickets() {
    return (
      <section className="mt-4 rounded-xl border border-[#283143] bg-[#1b212c] p-4">
        <h3 className="m-0 text-xl text-[#f4f7fb]">Ticket Management</h3>
        <p className="mt-1 text-[13px] text-[#95a2ba]">
          Shfaq të gjitha biletat nga databaza. Përditëso sasinë ose fshij.
        </p>
        {ticketsLoading ? (
          <p className="mt-4 text-[13px] text-[#95a2ba]">Duke ngarkuar...</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-[10px] border border-[#2b3446] bg-[#161d27]">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#2b3446] bg-[#11161f] text-[#97a2b6]">
                  <th className="p-3 font-medium">Event</th>
                  <th className="p-3 font-medium">Lloji</th>
                  <th className="p-3 font-medium">Çmimi (€)</th>
                  <th className="p-3 font-medium">Sasia</th>
                  <th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b3446]">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-[#1f2633]/40">
                    <td className="p-3 text-[#f4f7fb]">
                      {ticket.event_name || `Event #${ticket.event_id}`}
                    </td>
                    <td className="p-3 text-[#8f9ab0]">{ticket.lloji}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        defaultValue={formatPrice(ticket.cmimi)}
                        className="w-24 rounded-[8px] border border-[#2b3446] bg-[#11161f] px-2 py-1.5 text-[12px] text-slate-100 outline-none"
                        onBlur={(e) => {
                          const val = e.target.value;
                          if (val !== "" && Number(val) !== Number(ticket.cmimi)) {
                            updateTicketPrice(ticket.id, val, ticket);
                          }
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={0}
                        defaultValue={ticket.sasia_disponueshme}
                        className="w-20 rounded-[8px] border border-[#2b3446] bg-[#11161f] px-2 py-1.5 text-[12px] text-slate-100 outline-none"
                        onBlur={(e) => {
                          const val = e.target.value;
                          if (val !== "" && Number(val) !== ticket.sasia_disponueshme) {
                            updateTicketQuantity(ticket.id, val);
                          }
                        }}
                      />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        className="rounded-[8px] border border-rose-400/30 bg-[#11161f] px-2.5 py-1.5 text-[12px] text-rose-100 hover:bg-white/5"
                        onClick={() => deleteTicket(ticket.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!ticketsLoading && tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[13px] text-[#95a2ba]">
                      Nuk ka bileta. Krijoni një event për të gjeneruar biletën.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }

  function renderFeedback() {
    return (
      <section className="mt-4 rounded-xl border border-[#283143] bg-[#1b212c] p-4">
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Feedback nga përdoruesit</h3>
          <button
            type="button"
            className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5"
            onClick={loadManagerFeedbacks}
          >
            Rifresko
          </button>
        </div>

        {feedbacksError ? (
          <p className="text-[13px] text-rose-300">{feedbacksError}</p>
        ) : null}

        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {feedbacksLoading ? (
            <li className="text-[13px] text-[#95a2ba]">Duke ngarkuar feedback-et...</li>
          ) : null}
          {!feedbacksLoading && managerFeedbacks.length === 0 ? (
            <li className="text-[13px] text-[#95a2ba]">Nuk ka feedback ende.</li>
          ) : null}
          {managerFeedbacks.map((fb) => (
            <li
              key={fb.id}
              className="rounded-[10px] border border-[#293346] bg-[#161d27] p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="m-0 text-[14px] font-medium text-[#f8fbff]">
                    {fb.eventTitle || "Event"}
                    {fb.eventLocation ? (
                      <span className="font-normal text-[#95a2ba]"> · {fb.eventLocation}</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-[12px] text-[#95a2ba]">
                    {fb.userName}
                    {fb.userEmail ? ` · ${fb.userEmail}` : ""}
                  </p>
                  <p className="mt-1 text-[13px] text-amber-200/90">
                    {"★".repeat(fb.rating)}
                    <span className="text-[#95a2ba]"> ({fb.rating}/5)</span>
                  </p>
                  <p className="mt-2 text-[13px] text-[#c5cdd9]">
                    {fb.comment || "—"}
                  </p>
                  <p className="mt-1 text-[11px] text-[#8f9ab0]">{fb.date}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  async function handleSendContactReply(e) {
    e.preventDefault();
    if (!selectedContactId) return;
    setReplySaving(true);
    setContactError("");
    try {
      await fetchJson(
        `/api/manager/contact-messages/${encodeURIComponent(selectedContactId)}/reply`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pergjigja: replyDraft }),
        },
      );
      await loadContactMessages();
      setContactError("");
    } catch (err) {
      setContactError(err.message || "Përgjigja nuk u ruajt.");
    } finally {
      setReplySaving(false);
    }
  }

  async function updateSponsorshipStatus(id, status) {
    setSponsorshipError("");
    try {
      await fetchJson(`/api/manager/sponsorships/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadSponsorshipRequests();
    } catch (err) {
      setSponsorshipError(err.message || "Nuk u përditësua statusi.");
    }
  }

  async function handleIssueCertificate(e) {
    e.preventDefault();
    setCertMessage("");
    if (!certIssueForm.user_id || !certIssueForm.event_id) {
      setCertMessage("Zgjidh përdoruesin dhe eventin.");
      return;
    }
    try {
      const issuedEventId = certIssueForm.event_id;
      await certificateApi.issue({
        user_id: certIssueForm.user_id,
        event_id: issuedEventId,
        kodi: certIssueForm.kodi.trim() || undefined,
      });
      setCertMessage("Certifikata u lëshua.");
      setCertIssueForm({ user_id: "", event_id: "", kodi: "" });
      if (certEventId === issuedEventId) {
        await loadCertEventData(certEventId);
      }
    } catch (err) {
      setCertMessage(err.message || "Nuk u lëshua certifikata.");
    }
  }

  async function handleRevokeCertificate(id) {
    if (!window.confirm("Revoko këtë certifikatë?")) return;
    setCertMessage("");
    try {
      await certificateApi.revoke(id);
      setCertMessage("Certifikata u revokua.");
      if (certEventId) await loadCertEventData(certEventId);
    } catch (err) {
      setCertMessage(err.message || "Nuk u revokua.");
    }
  }

  function resetCouponForm() {
    setCouponForm({
      id: null,
      code: "",
      discount_type: "percentage",
      discount_value: "",
      is_active: true,
      event_id: "",
    });
  }

  async function handleSaveCoupon(e) {
    e.preventDefault();
    setCouponError("");
    const body = {
      code: couponForm.code,
      discount_type: couponForm.discount_type,
      discount_value: Number(couponForm.discount_value),
      is_active: couponForm.is_active,
      event_id: couponForm.event_id || null,
    };
    try {
      if (couponForm.id) {
        await couponApi.update(couponForm.id, body);
      } else {
        await couponApi.create(body);
      }
      resetCouponForm();
      await loadCoupons();
    } catch (err) {
      setCouponError(err.message || "Nuk u ruajt kuponi.");
    }
  }

  async function handleDeleteCoupon(id) {
    if (!window.confirm("Fshi këtë kupon?")) return;
    setCouponError("");
    try {
      await couponApi.delete(id);
      await loadCoupons();
    } catch (err) {
      setCouponError(err.message || "Nuk u fshi kuponi.");
    }
  }

  function renderContactMessages() {
    return (
      <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1.1fr]">
        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="m-0 text-xl text-[#f4f7fb]">Contact Us Inbox</h3>
            <div className="flex gap-2">
              <select
                className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2 text-sm text-slate-100 outline-none"
                value={contactStatusFilter}
                onChange={(e) => setContactStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
              </select>
              <button
                type="button"
                className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] hover:bg-white/5"
                onClick={loadContactMessages}
              >
                Rifresko
              </button>
            </div>
          </div>

          {contactError && !selectedContactId ? (
            <p className="text-[13px] text-rose-300">{contactError}</p>
          ) : null}

          {contactLoading ? (
            <p className="text-[13px] text-[#95a2ba]">Duke ngarkuar...</p>
          ) : (
            <ul className="m-0 flex max-h-[520px] list-none flex-col gap-2 overflow-y-auto p-0">
              {contactMessages.length === 0 ? (
                <li className="text-[13px] text-[#95a2ba]">Nuk ka mesazhe kontakti.</li>
              ) : null}
              {contactMessages.map((msg) => (
                <li key={msg.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedContactId(msg.id)}
                    className={`w-full rounded-[10px] border px-3 py-3 text-left transition ${
                      selectedContactId === msg.id
                        ? "border-[#ff9f1a]/50 bg-[#ff9f1a]/10"
                        : "border-[#293346] bg-[#161d27] hover:bg-[#1c2430]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="m-0 text-[14px] font-medium text-[#f8fbff]">
                        {msg.subject}
                      </p>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${statusPill(
                          msg.status === "replied" ? "Published" : "Draft",
                        )}`}
                      >
                        {msg.statusLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-[#95a2ba]">
                      {msg.name} · {msg.email}
                    </p>
                    <p className="mt-1 text-[11px] text-[#8f9ab0]">{msg.sentAt}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          {!selectedContact ? (
            <p className="text-[13px] text-[#95a2ba]">
              Zgjidh një mesazh nga lista për ta lexuar dhe përgjigjur.
            </p>
          ) : (
            <>
              <h3 className="m-0 text-xl text-[#f4f7fb]">{selectedContact.subject}</h3>
              <p className="mt-2 text-[13px] text-[#95a2ba]">
                From: <span className="text-[#f8fbff]">{selectedContact.name}</span> (
                {selectedContact.email})
              </p>
              <p className="text-[12px] text-[#8f9ab0]">Sent: {selectedContact.sentAt}</p>

              <div className="mt-4 rounded-[10px] border border-[#293346] bg-[#161d27] p-3">
                <p className="m-0 text-[12px] font-medium text-[#95a2ba]">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-[13px] text-[#e8edf5]">
                  {selectedContact.message}
                </p>
              </div>

              <form className="mt-4 grid gap-3" onSubmit={handleSendContactReply}>
                <label className="text-[13px] text-[#95a2ba]">
                  Your reply (manager)
                  <textarea
                    rows={5}
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    placeholder="Shkruaj përgjigjen për klientin..."
                    className="mt-1 w-full rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
                    required
                  />
                </label>
                {contactError && selectedContactId ? (
                  <p className="text-[13px] text-rose-300">{contactError}</p>
                ) : null}
                {selectedContact.status === "replied" && selectedContact.repliedAt ? (
                  <p className="text-[12px] text-emerald-300/90">
                    Replied on {selectedContact.repliedAt}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={replySaving || !replyDraft.trim()}
                  className="w-fit rounded-[10px] bg-[#ff9f1a] px-4 py-2.5 text-sm font-semibold text-[#1f1f1f] hover:brightness-110 disabled:opacity-50"
                >
                  {replySaving
                    ? "Duke ruajtur..."
                    : selectedContact.status === "replied"
                      ? "Përditëso përgjigjen"
                      : "Dërgo përgjigjen"}
                </button>
              </form>
            </>
          )}
        </article>
      </section>
    );
  }

  function renderSponsorshipRequests() {
    return (
      <section className="mt-4 rounded-xl border border-[#283143] bg-[#1b212c] p-4">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Sponsorship Requests</h3>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2 text-sm text-slate-100 outline-none"
              value={sponsorshipStatusFilter}
              onChange={(e) => setSponsorshipStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              type="button"
              className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5"
              onClick={loadSponsorshipRequests}
            >
              Rifresko
            </button>
          </div>
        </div>

        {sponsorshipError ? (
          <p className="text-[13px] text-rose-300">{sponsorshipError}</p>
        ) : null}

        {sponsorshipLoading ? (
          <p className="text-[13px] text-[#95a2ba]">Duke ngarkuar...</p>
        ) : null}

        <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
          {!sponsorshipLoading && sponsorshipRequests.length === 0 ? (
            <li className="text-[13px] text-[#95a2ba]">Nuk ka kërkesa sponsorizimi.</li>
          ) : null}
          {sponsorshipRequests.map((req) => (
            <li
              key={req.id}
              className="rounded-[10px] border border-[#293346] bg-[#161d27] p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="m-0 text-[15px] font-medium text-[#f8fbff]">
                    {req.companyName || "Sponsor"}
                  </p>
                  <p className="mt-1 text-[13px] text-[#95a2ba]">
                    {req.eventTitle} · {req.eventDate}
                    {req.eventLocation ? ` · ${req.eventLocation}` : ""}
                  </p>
                  <p className="mt-1 text-[12px] text-[#8f9ab0]">
                    {req.email}
                    {req.website ? ` · ${req.website}` : ""}
                  </p>
                  <p className="mt-2 text-[13px] text-[#c5cdd9]">
                    Tier: {req.tier || "—"} · Budget: €{formatPrice(req.budget)}
                  </p>
                  {req.message ? (
                    <p className="mt-2 text-[13px] text-[#95a2ba]">{req.message}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] ${statusPill(req.statusLabel)}`}
                  >
                    {req.statusLabel}
                  </span>
                  {req.status === "pending" ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-[8px] border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[12px] text-emerald-100 hover:bg-emerald-500/20"
                        onClick={() => updateSponsorshipStatus(req.id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="rounded-[8px] border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-[12px] text-rose-100 hover:bg-rose-500/20"
                        onClick={() => updateSponsorshipStatus(req.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="rounded-[8px] border border-[#2b3446] bg-[#11161f] px-3 py-1.5 text-[12px] text-[#f3f6fb] hover:bg-white/5"
                      onClick={() => updateSponsorshipStatus(req.id, "pending")}
                    >
                      Reset to pending
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  function renderCertificates() {
    return (
      <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1.2fr]">
        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Issue Certificate</h3>
          {certMessage ? (
            <p className="mt-2 text-[13px] text-[#95a2ba]">{certMessage}</p>
          ) : null}
          <form className="mt-4 grid gap-3" onSubmit={handleIssueCertificate}>
            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              value={certIssueForm.user_id}
              onChange={(e) =>
                setCertIssueForm((p) => ({ ...p, user_id: e.target.value }))
              }
              required
            >
              <option value="">Përdoruesi *</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              value={certIssueForm.event_id}
              onChange={(e) =>
                setCertIssueForm((p) => ({ ...p, event_id: e.target.value }))
              }
              required
            >
              <option value="">Eventi *</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Kodi (opsional)"
              value={certIssueForm.kodi}
              onChange={(e) =>
                setCertIssueForm((p) => ({ ...p, kodi: e.target.value }))
              }
            />
            <button
              type="submit"
              className="rounded-[10px] bg-[#ff9f1a] px-4 py-2.5 text-sm font-semibold text-[#1f1f1f] hover:brightness-110"
            >
              Lësho certifikatën
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="m-0 text-xl text-[#f4f7fb]">Certificates by Event</h3>
            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2 text-sm text-slate-100 outline-none"
              value={certEventId}
              onChange={(e) => setCertEventId(e.target.value)}
            >
              <option value="">Zgjidh eventin</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>

          {!certEventId ? (
            <p className="text-[13px] text-[#95a2ba]">Zgjidh një event për të parë certifikatat.</p>
          ) : null}

          {certEventId ? (
            <>
              <p className="text-[13px] text-[#95a2ba]">
                {certEventData.eventTitle || "Event"} — {certEventData.totalIssued} të lëshuara
              </p>
              {certsLoading ? (
                <p className="mt-3 text-[13px] text-[#95a2ba]">Duke ngarkuar...</p>
              ) : (
                <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
                  {certEventData.certificates.length === 0 ? (
                    <li className="text-[13px] text-[#95a2ba]">Nuk ka certifikata për këtë event.</li>
                  ) : null}
                  {certEventData.certificates.map((cert) => (
                    <li
                      key={cert.id}
                      className="flex items-center justify-between gap-2 rounded-[10px] border border-[#293346] bg-[#161d27] px-3 py-2"
                    >
                      <div>
                        <p className="m-0 text-[13px] font-medium text-[#f8fbff]">
                          {cert.userName || "User"}
                        </p>
                        <p className="mt-0.5 font-mono text-[12px] text-emerald-200/90">
                          {cert.code}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#8f9ab0]">{cert.issuedAt}</p>
                      </div>
                      <button
                        type="button"
                        className="rounded-[8px] border border-rose-400/30 px-2.5 py-1 text-[12px] text-rose-100 hover:bg-rose-500/10"
                        onClick={() => handleRevokeCertificate(cert.id)}
                      >
                        Revoke
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : null}
        </article>
      </section>
    );
  }

  function renderCoupons() {
    return (
      <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1.2fr]">
        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">
            {couponForm.id ? "Edit Coupon" : "Create Coupon"}
          </h3>
          {couponError ? (
            <p className="mt-2 text-[13px] text-rose-300">{couponError}</p>
          ) : null}
          <form className="mt-4 grid gap-3" onSubmit={handleSaveCoupon}>
            <input
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm uppercase text-slate-100 outline-none"
              placeholder="Kodi *"
              value={couponForm.code}
              onChange={(e) =>
                setCouponForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
              }
              required
            />
            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              value={couponForm.discount_type}
              onChange={(e) =>
                setCouponForm((p) => ({ ...p, discount_type: e.target.value }))
              }
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed amount (€)</option>
            </select>
            <input
              type="number"
              min={0}
              step="0.01"
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              placeholder="Vlera e zbritjes *"
              value={couponForm.discount_value}
              onChange={(e) =>
                setCouponForm((p) => ({ ...p, discount_value: e.target.value }))
              }
              required
            />
            <select
              className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
              value={couponForm.event_id}
              onChange={(e) =>
                setCouponForm((p) => ({ ...p, event_id: e.target.value }))
              }
            >
              <option value="">Global (të gjitha eventet)</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-[#95a2ba]">
              <input
                type="checkbox"
                checked={couponForm.is_active}
                onChange={(e) =>
                  setCouponForm((p) => ({ ...p, is_active: e.target.checked }))
                }
              />
              Aktiv
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-[10px] bg-[#ff9f1a] px-4 py-2.5 text-sm font-semibold text-[#1f1f1f] hover:brightness-110"
              >
                {couponForm.id ? "Përditëso" : "Krijo"}
              </button>
              {couponForm.id ? (
                <button
                  type="button"
                  className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-4 py-2.5 text-sm text-[#f3f6fb]"
                  onClick={resetCouponForm}
                >
                  Anulo
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="m-0 text-xl text-[#f4f7fb]">All Coupons</h3>
            <div className="flex gap-2">
              <select
                className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3 py-2 text-sm text-slate-100 outline-none"
                value={couponEventFilter}
                onChange={(e) => setCouponEventFilter(e.target.value)}
              >
                <option value="">Të gjitha</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] hover:bg-white/5"
                onClick={loadCoupons}
              >
                Rifresko
              </button>
            </div>
          </div>

          {couponsLoading ? (
            <p className="text-[13px] text-[#95a2ba]">Duke ngarkuar...</p>
          ) : (
            <div className="overflow-x-auto rounded-[10px] border border-[#2b3446] bg-[#161d27]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2b3446] bg-[#11161f] text-[#97a2b6]">
                    <th className="p-3 font-medium">Kodi</th>
                    <th className="p-3 font-medium">Zbritja</th>
                    <th className="p-3 font-medium">Event</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b3446]">
                  {filteredCoupons.map((c) => (
                    <tr key={c.id} className="hover:bg-[#1f2633]/40">
                      <td className="p-3 font-mono text-emerald-200/90">{c.code}</td>
                      <td className="p-3 text-[#f4f7fb]">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}%`
                          : `€${formatPrice(c.discountValue)}`}
                      </td>
                      <td className="p-3 text-[#8f9ab0]">
                        {c.eventTitle || "Global"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] ${
                            c.isActive ? statusPill("Active") : statusPill("Suspended")
                          }`}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          className="mr-2 rounded-[8px] border border-[#2b3446] px-2.5 py-1 text-[12px] hover:bg-white/5"
                          onClick={() =>
                            setCouponForm({
                              id: c.id,
                              code: c.code,
                              discount_type: c.discountType,
                              discount_value: String(c.discountValue),
                              is_active: c.isActive,
                              event_id: c.eventId || "",
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-[8px] border border-rose-400/30 px-2.5 py-1 text-[12px] text-rose-100 hover:bg-rose-500/10"
                          onClick={() => handleDeleteCoupon(c.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!couponsLoading && filteredCoupons.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[#95a2ba]">
                        Nuk ka kuponë.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    );
  }

  function renderReports() {
    const publishedEvents = events.filter((e) => e.status === "Published").length;
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const totalTicketQty = tickets.reduce(
      (sum, t) => sum + (t.sasia_disponueshme || 0),
      0,
    );

    return (
      <section className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Published Events", value: String(publishedEvents), icon: "✅" },
          { label: "Active Users", value: String(activeUsers), icon: "🧑‍💼" },
          { label: "Total Tickets", value: String(tickets.length), icon: "🎟" },
          { label: "Available Seats", value: String(totalTicketQty), icon: "📈" },
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
    if (activePage === "Sponsorship Requests") return renderSponsorshipRequests();
    if (activePage === "Ticket Management") return renderTickets();
    if (activePage === "Feedback") return renderFeedback();
    if (activePage === "Contact Messages") return renderContactMessages();
    if (activePage === "Certificates") return renderCertificates();
    if (activePage === "Coupons") return renderCoupons();
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
            { key: "kapaciteti", label: "Capacity", required: false, placeholder: "Capacity", type: "number", min: 0 },
            { key: "lloji", label: "Lloji i biletës", placeholder: "Standard" },
            {
              key: "cmimi",
              label: "Çmimi i biletës (€)",
              required: true,
              type: "number",
              min: 0,
              step: "0.01",
              placeholder: "25.00",
            },
            {
              key: "sasia_disponueshme",
              label: "Sasia e biletave",
              type: "number",
              min: 0,
              placeholder: "Sasia",
            },
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

