import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientHeader from "./ClientHeader.jsx";

function UserEventsPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [feedbacks, setFeedbacks] = useState([]);
  const [events, setEvents] = useState([]);
  const [purchasedEventIds, setPurchasedEventIds] = useState([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    eventId: "",
    rating: "5",
    comment: "",
  });

  useEffect(() => {
    if (!userId) {
      setFeedbackError("Kyçu përsëri për të menaxhuar feedback-un.");
      setFeedbacksLoading(false);
      return;
    }

    setFeedbacksLoading(true);
    Promise.all([
      fetch(`/api/feedback?userId=${encodeURIComponent(userId)}`).then((r) =>
        r.json().then((d) => ({ ok: r.ok, data: d })),
      ),
      fetch("/api/events").then((r) => r.json().then((d) => ({ ok: r.ok, data: d }))),
      fetch(`/api/registrations/me/event-ids?userId=${encodeURIComponent(userId)}`).then((r) =>
        r.json().then((d) => ({ ok: r.ok, data: d })),
      ),
    ])
      .then(([fbRes, evRes, regRes]) => {
        if (!fbRes.ok) throw new Error(fbRes.data.error || "Gabim në feedback");
        setFeedbacks(Array.isArray(fbRes.data) ? fbRes.data : []);
        
        if (evRes.ok && Array.isArray(evRes.data)) {
          setEvents(evRes.data);
        }
        if (regRes.ok && Array.isArray(regRes.data)) {
          setPurchasedEventIds(regRes.data.map(Number));
        }
        setFeedbackError("");
      })
      .catch((err) => {
        setFeedbackError(err.message || "Nuk u ngarkuan të dhënat.");
      })
      .finally(() => setFeedbacksLoading(false));
  }, [userId]);

  function resetForm() {
    setForm({ eventId: "", rating: "5", comment: "" });
    setEditingId(null);
  }

  async function createFeedback() {
    if (!userId) return;
    if (!form.eventId) {
      setFeedbackError("Zgjidh një event.");
      return;
    }
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          event_id: Number(form.eventId),
          vleresimi: Number(form.rating),
          komenti: form.comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setFeedbacks((prev) => [data, ...prev]);
      resetForm();
      setFeedbackMessage("Feedback-u u shtua.");
      setFeedbackError("");
    } catch (err) {
      setFeedbackError(err.message || "Nuk u krijua feedback-u.");
    }
  }

  async function updateFeedback(id) {
    if (!userId) return;
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          vleresimi: Number(form.rating),
          komenti: form.comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setFeedbacks((prev) => prev.map((f) => (f.id === id ? data : f)));
      resetForm();
      setFeedbackMessage("Feedback-u u përditësua.");
      setFeedbackError("");
    } catch (err) {
      setFeedbackError(err.message || "Nuk u përditësua feedback-u.");
    }
  }

  async function deleteFeedback(id) {
    if (!userId) return;
    try {
      const res = await fetch(
        `/api/feedback/${id}?userId=${encodeURIComponent(userId)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      if (editingId === id) resetForm();
      setFeedbackMessage("Feedback-u u fshi.");
      setFeedbackError("");
    } catch (err) {
      setFeedbackError(err.message || "Nuk u fshi feedback-u.");
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      eventId: item.eventId,
      rating: String(item.rating),
      comment: item.comment,
    });
    setFeedbackMessage("");
  }

  return (
    <div className="min-h-screen bg-[#10141d] text-white">
      <ClientHeader subtitle="Events" />

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,80,80,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-14">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              LOGGED IN EXPERIENCE
            </div>
            <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">
              Welcome back, explore and book upcoming events
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-white/65 sm:text-base">
              View every upcoming event individually, leave feedback, and secure your tickets in a few clicks.
            </p>
          </div>
        </section>

        {/* 🚀 UPCOMING EVENTS SECTION RUNNING ON LIVE DB DATA */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
            <p className="text-sm text-white/60">Swipe horizontally and select an event card.</p>
          </div>

          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
            {events.length > 0 ? (
              events.map((event) => {
                const alreadyPurchased = purchasedEventIds.includes(Number(event.id));
                return (
                <article
                  key={event.id}
                  className="min-w-[280px] max-w-[320px] snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20"
                >
                  {/* Fallback pattern graphic or image if database photo field doesn't exist */}
                  <img
                    src={event.imazhi || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80"}
                    alt={event.titulli}
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{event.titulli}</h3>
                    <p className="mt-2 text-sm text-white/70">{event.data_fillimit}</p>
                    <p className="text-sm text-white/70 truncate">{event.lokacioni}</p>
                    <p className="mt-2 text-sm text-emerald-400 font-medium">
                      {event.tickets?.length > 0
                        ? `Nga ${Number(event.tickets[0].cmimi).toFixed(2)} EUR`
                        : "Kontrollo çmimin"}
                    </p>
                    {alreadyPurchased ? (
                      <p className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-xs font-medium text-emerald-300">
                        Bileta e blerë — shiko te My Tickets
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => navigate(alreadyPurchased ? "/my-tickets" : `/events/${event.id}`)}
                      className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-semibold ${
                        alreadyPurchased
                          ? "border border-white/20 bg-white/10 hover:bg-white/15"
                          : "bg-rose-600 hover:bg-rose-500"
                      }`}
                    >
                      {alreadyPurchased ? "My Tickets" : "View Event"}
                    </button>
                  </div>
                </article>
                );
              })
            ) : (
              <div className="w-full text-center py-10 text-white/50 border border-dashed border-white/10 rounded-xl">
                Nuk u gjet asnjë ngjarje e hapur për momentin.
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-14">
          <h2 className="text-2xl font-semibold">Your Feedback</h2>
          <p className="mt-2 text-sm text-white/60">Shkruaj, shiko, përditëso ose fshi feedback-un tënd për eventet.</p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
            {/* Feedback Input Form Workspace */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit feedback" : "New feedback"}
              </h3>

              {!editingId ? (
                <label className="mt-4 block text-sm text-white/80">
                  Event
                  <select
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#11161f] px-3 py-2.5 text-sm outline-none focus:border-rose-500/50"
                    value={form.eventId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, eventId: e.target.value }))
                    }
                  >
                    <option value="">Zgjidh eventin...</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.titulli} {/* 👈 Matches DB payload property */}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="mt-4 text-sm text-white/60">Po përditëson feedback-un për eventin e zgjedhur.</p>
              )}

              <label className="mt-4 block text-sm text-white/80">
                Vlerësimi (1–5)
                <select
                  className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#11161f] px-3 py-2.5 text-sm outline-none focus:border-rose-500/50"
                  value={form.rating}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, rating: e.target.value }))
                  }
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={String(n)}>{n} yje</option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block text-sm text-white/80">
                Komenti
                <textarea
                  className="mt-1.5 min-h-[100px] w-full resize-y rounded-lg border border-white/15 bg-[#11161f] px-3 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-rose-500/50"
                  placeholder="Shkruaj feedback-un tënd..."
                  value={form.comment}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                />
              </label>

              {feedbackError && <p className="mt-3 text-sm text-rose-300">{feedbackError}</p>}
              {feedbackMessage && <p className="mt-3 text-sm text-emerald-300">{feedbackMessage}</p>}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!editingId && !form.eventId}
                  onClick={() => editingId ? updateFeedback(editingId) : createFeedback()}
                  className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingId ? "Ruaj ndryshimet" : "Shto feedback"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
                  >
                    Anulo
                  </button>
                )}
              </div>
            </div>

            {/* Render Saved Feedbacks Dynamic Stack */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Feedback-et e mia ({feedbacks.length})</h3>

              <ul className="mt-4 flex list-none flex-col gap-3 p-0">
                {feedbacksLoading && <li className="text-sm text-white/60">Duke ngarkuar...</li>}
                {!feedbacksLoading && feedbacks.length === 0 && (
                  <li className="text-sm text-white/60">Nuk ke feedback ende. Shto një më sipër.</li>
                )}
                {feedbacks.map((item) => (
                  <li key={item.id} className="rounded-xl border border-white/10 bg-[#161d27] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.eventTitle || "Event"}</p>
                        <p className="mt-1 text-sm text-amber-200/90">
                          {"★".repeat(item.vleresimi || item.rating)}
                          <span className="text-white/50"> ({item.vleresimi || item.rating}/5)</span>
                        </p>
                        <p className="mt-2 text-sm text-white/70">{item.komenti || item.comment || "—"}</p>
                        <p className="mt-1 text-xs text-white/45">{item.date}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="rounded-md border border-white/20 px-3 py-1.5 text-xs hover:bg-white/5"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFeedback(item.id)}
                          className="rounded-md border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserEventsPage;