import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import ManagerEditModal from "./ManagerEditModal.jsx";

function statusPill(status) {
  if (status === "published" || status === "Published" || status === "aktiv") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
  }
  if (status === "draft" || status === "Draft") {
    return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  }
  return "border-[#2b3446] bg-[#11161f] text-[#b6c0cf]";
}

const emptyEventForm = () => ({
  titulli: "",
  pershkrimi: "",
  data_fillimit: null,
  data_perfundimit: null,
  lokacioni: "",
  kapaciteti: "",
  statusi: "aktiv",
  publication_status: "published",
  organizer_id: "",
  venue_id: "",
});

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [eventForm, setEventForm] = useState(emptyEventForm);

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editValues, setEditValues] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setMessage("Nuk u ngarkuan ngjarjet nga serveri.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  async function createEvent(e) {
    e.preventDefault();
    if (!eventForm.titulli || !eventForm.data_fillimit || !eventForm.data_perfundimit || !eventForm.lokacioni) {
      return;
    }
    setMessage("");
    try {
      const payload = {
        titulli: eventForm.titulli,
        pershkrimi: eventForm.pershkrimi,
        data_fillimit: format(eventForm.data_fillimit, "yyyy-MM-dd"),
        data_perfundimit: format(eventForm.data_perfundimit, "yyyy-MM-dd"),
        lokacioni: eventForm.lokacioni,
        kapaciteti: eventForm.kapaciteti !== "" ? Number(eventForm.kapaciteti) : 0,
        statusi: eventForm.statusi,
        publication_status: eventForm.publication_status,
        organizer_id: eventForm.organizer_id !== "" ? Number(eventForm.organizer_id) : 4,
        venue_id: eventForm.venue_id !== "" ? Number(eventForm.venue_id) : null,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gabim gjatë krijimit të ngjarjes");
      await fetchEvents();
      setEventForm(emptyEventForm());
      setMessage("Ngjarja u shtua me sukses.");
    } catch (err) {
      setMessage(err.message || "Nuk u shtua ngjarja.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("A jeni i sigurt që dëshironi ta fshini këtë ngjarje?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fshirja dështoi");
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setMessage("Ngjarja u fshi.");
    } catch (err) {
      setMessage(err.message || "Nuk u fshi ngjarja.");
    }
  }

  function openEdit(event) {
    setEditValues({
      id: event.id,
      titulli: event.titulli || "",
      pershkrimi: event.pershkrimi || "",
      data_fillimit: event.data_fillimit ? event.data_fillimit.split(" ")[0] : "",
      data_perfundimit: event.data_perfundimit ? event.data_perfundimit.split(" ")[0] : "",
      lokacioni: event.lokacioni || "",
      kapaciteti: event.kapaciteti ?? "",
      statusi: event.statusi || "aktiv",
      publication_status: event.publication_status || "published",
      organizer_id: event.organizer_id ?? "",
      venue_id: event.venue_id ?? "",
    });
    setEditMessage("");
    setEditOpen(true);
  }

  async function saveEdit(values) {
    if (!values?.id) return;
    setEditLoading(true);
    setEditMessage("");
    try {
      const res = await fetch(`/api/events/${values.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulli: values.titulli,
          pershkrimi: values.pershkrimi,
          data_fillimit: values.data_fillimit,
          data_perfundimit: values.data_perfundimit,
          lokacioni: values.lokacioni,
          kapaciteti: values.kapaciteti !== "" ? Number(values.kapaciteti) : 0,
          statusi: values.statusi,
          publication_status: values.publication_status,
          organizer_id: values.organizer_id !== "" ? Number(values.organizer_id) : 4,
          venue_id: values.venue_id !== "" ? Number(values.venue_id) : null,
        }),
      });
      if (!res.ok) throw new Error("Përditësimi dështoi");
      await fetchEvents();
      setEditOpen(false);
      setMessage("Ngjarja u përditësua.");
    } catch (err) {
      setEditMessage(err.message || "Nuk u përditësua ngjarja.");
    } finally {
      setEditLoading(false);
    }
  }

  const upcomingEvents = events.filter((ev) => {
    if (!ev.data_perfundimit) return true;
    return new Date(ev.data_perfundimit) >= new Date();
  });

  return (
    <>
      <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Create Event</h3>
          {message ? (
            <p className="mt-2 text-[13px] text-[#95a2ba]">{message}</p>
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
              placeholderText="Data e përfundimit *"
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
              <option value="jo-aktiv">Jo-aktiv</option>
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
              type="number"
              placeholder="Venue ID (opsional)"
              value={eventForm.venue_id}
              onChange={(e) => setEventForm((p) => ({ ...p, venue_id: e.target.value }))}
            />
            <button
              type="submit"
              className="rounded-[10px] bg-[#ff8b0f] px-4 py-2.5 text-sm font-semibold text-[#17120c] hover:bg-[#ff9f1a]"
            >
              Add Event
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Upcoming Events</h3>
          {loading ? (
            <p className="mt-4 text-[13px] text-[#95a2ba]">Duke ngarkuar...</p>
          ) : null}
          <ul className="mt-4 flex list-none flex-col gap-3 p-0">
            {upcomingEvents.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between rounded-[10px] border border-[#293346] bg-[#161d27] p-3"
              >
                <div>
                  <p className="m-0 text-[14px] text-[#f8fbff]">{event.titulli}</p>
                  <p className="mt-1 text-[12px] text-[#95a2ba]">
                    {event.data_fillimit} · {event.lokacioni}
                  </p>
                  {event.kapaciteti ? (
                    <p className="mt-1 text-[12px] text-[#7dd3a8]">
                      Kapaciteti: {event.kapaciteti} vendesh
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] ${statusPill(event.publication_status || event.statusi)}`}
                  >
                    {event.publication_status || event.statusi}
                  </span>
                  <button
                    type="button"
                    className="rounded-[8px] border border-amber-400/30 bg-[#11161f] px-2.5 py-1.5 text-[12px] text-amber-100 hover:bg-white/5"
                    onClick={() => openEdit(event)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-[8px] border border-rose-400/30 bg-[#11161f] px-2.5 py-1.5 text-[12px] text-rose-100 hover:bg-white/5"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {!loading && upcomingEvents.length === 0 ? (
              <li className="rounded-[10px] border border-[#293346] bg-[#161d27] p-6 text-center text-[13px] text-[#95a2ba]">
                Nuk ka ngjarje të ardhshme.
              </li>
            ) : null}
          </ul>
        </article>
      </section>

      <ManagerEditModal
        open={editOpen}
        title="Edit Event"
        loading={editLoading}
        message={editMessage}
        initialValues={editValues || {}}
        fields={[
          { key: "titulli", label: "Title", required: true, placeholder: "Event title" },
          { key: "pershkrimi", label: "Description", placeholder: "Description", type: "textarea" },
          { key: "data_fillimit", label: "Start date", required: true, placeholder: "YYYY-MM-DD" },
          { key: "data_perfundimit", label: "End date", required: true, placeholder: "YYYY-MM-DD" },
          { key: "lokacioni", label: "Venue", required: true, placeholder: "Location" },
          { key: "kapaciteti", label: "Capacity", placeholder: "Capacity" },
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
            options: ["aktiv", "jo-aktiv"],
          },
        ]}
        submitLabel="Save Event"
        onClose={() => {
          setEditOpen(false);
          setEditMessage("");
        }}
        onSubmit={(values) => saveEdit(values)}
      />
    </>
  );
}
