import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientHeader from "./ClientHeader.jsx";
import { certificateApi } from "../api/certificateApi.js";
import { couponApi } from "../api/couponApi.js";

function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [event, setEvent] = useState(null);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [eventCoupons, setEventCoupons] = useState({
    totalActive: 0,
    coupons: [],
  });
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [certStats, setCertStats] = useState({
    totalIssued: 0,
    certificates: [],
    eventTitle: "",
  });
  const [certsLoading, setCertsLoading] = useState(true);
  const [certsError, setCertsError] = useState("");

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);

    const eventPromise = fetch(`/api/events/${eventId}`).then((res) => {
      if (!res.ok) throw new Error("Eventi nuk u gjet ose dështoi lidhja me serverin.");
      return res.json();
    });

    const purchasePromise = userId
      ? fetch(
          `/api/registrations/check?userId=${encodeURIComponent(userId)}&eventId=${encodeURIComponent(eventId)}`,
        ).then((res) => (res.ok ? res.json() : { purchased: false }))
      : Promise.resolve({ purchased: false });

    Promise.all([eventPromise, purchasePromise])
      .then(([data, check]) => {
        setEvent(data);
        setAlreadyPurchased(Boolean(check.purchased));
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching event details:", err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [eventId, userId]);

  useEffect(() => {
    if (!eventId) return;
    setCouponsLoading(true);
    couponApi
      .getByEvent(eventId)
      .then((data) => {
        setEventCoupons({
          totalActive: data.totalActive ?? 0,
          coupons: data.coupons ?? [],
        });
      })
      .catch(() => setEventCoupons({ totalActive: 0, coupons: [] }))
      .finally(() => setCouponsLoading(false));
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    setCertsLoading(true);
    certificateApi
      .getByEvent(eventId)
      .then((data) => {
        setCertStats({
          totalIssued: data.totalIssued ?? 0,
          certificates: data.certificates ?? [],
          eventTitle: data.eventTitle ?? "",
        });
        setCertsError("");
      })
      .catch((err) => {
        setCertsError(err.message || "Nuk u lexuan certifikatat.");
      })
      .finally(() => setCertsLoading(false));
  }, [eventId]);

  function handleFeedbackSubmit(submitEvent) {
    submitEvent.preventDefault();
    if (!feedback.trim()) {
      setMessage("Shkruaj feedback para se të dërgosh.");
      return;
    }
    if (!userId) {
      setMessage("Kyçu përsëri për të dërguar feedback.");
      return;
    }

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Number(userId),
        event_id: Number(eventId),
        vleresimi: 5,
        komenti: feedback.trim(),
      }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Gabim");
        setMessage("Faleminderit! Feedback-u u dërgua.");
        setFeedback("");
      })
      .catch((err) => {
        setMessage(err.message || "Nuk u dërgua feedback-u.");
      });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141d] flex items-center justify-center text-white">
        <p className="text-lg animate-pulse">Duke ngarkuar detajet nga databaza...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#10141d] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-rose-400 font-medium">⚠️ {error || "Eventi nuk ekziston."}</p>
        <button
          type="button"
          onClick={() => navigate("/events")}
          className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
        >
          Kthehu tek Eventet
        </button>
      </div>
    );
  }

  const kaBiletë = event.tickets && event.tickets.length > 0;
  const cmimiBiletes = kaBiletë
    ? `${Number(event.tickets[0].cmimi).toFixed(2)} EUR`
    : "Falas / Pa Çmim";

  return (
    <div className="min-h-screen bg-[#10141d] text-white">
      <ClientHeader subtitle="Event Details" />

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1.1fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <img
            src={
              event.imazhi ||
              "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80"
            }
            alt={event.titulli}
            className="h-64 w-full object-cover border-b border-white/10"
          />

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{event.titulli}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400 uppercase">
                {event.statusi || "aktiv"}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 border-y border-white/10 py-6 text-sm text-white/80">
              <div>
                <p className="text-white/40 uppercase text-xs font-bold tracking-wider">📅 Data</p>
                <p className="mt-1 text-base font-medium">{event.data_fillimit}</p>
              </div>
              <div>
                <p className="text-white/40 uppercase text-xs font-bold tracking-wider">📍 Lokacioni</p>
                <p className="mt-1 text-base font-medium">{event.lokacioni}</p>
              </div>
              <div>
                <p className="text-white/40 uppercase text-xs font-bold tracking-wider">🎟 Kapaciteti</p>
                <p className="mt-1 text-base font-medium text-amber-400">{event.kapaciteti} vende</p>
              </div>
              <div>
                <p className="text-white/40 uppercase text-xs font-bold tracking-wider">💳 Çmimi</p>
                <p className="mt-1 text-base font-medium text-emerald-400 font-semibold">{cmimiBiletes}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold">Përshkrimi i Eventit</h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed whitespace-pre-line">
                {event.pershkrimi || "Nuk ka asnjë përshkrim të shtuar për këtë ngjarje."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
              {alreadyPurchased ? (
                <>
                  <p className="text-sm text-emerald-300 sm:mr-auto">
                    Ke blerë tashmë biletën për këtë ngjarje.
                  </p>
                  <button
                    type="button"
                    className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-semibold hover:bg-white/15 transition"
                    onClick={() => navigate("/my-tickets")}
                  >
                    Shiko biletat e mia
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-500 transition shadow-lg shadow-rose-600/20"
                  onClick={() => navigate(`/events/${event.id}/checkout`)}
                >
                  Bli Biletën Tani
                </button>
              )}
            </div>
          </div>
        </article>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">Available Coupons</h2>
            <p className="mt-2 text-sm text-white/65">
              Kuponë aktivë për këtë event (përdor në checkout).
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-[#111925] p-3">
                <p className="text-xs text-white/50">Active coupons</p>
                <p className="mt-1 text-2xl font-semibold">
                  {couponsLoading ? "…" : eventCoupons.totalActive}
                </p>
              </div>
            </div>
            <ul className="mt-4 max-h-32 space-y-2 overflow-y-auto">
              {couponsLoading ? (
                <li className="text-sm text-white/60">Loading...</li>
              ) : null}
              {!couponsLoading && eventCoupons.coupons.length === 0 ? (
                <li className="text-sm text-white/60">No active coupons.</li>
              ) : null}
              {eventCoupons.coupons.map((c) => (
                <li
                  key={c.id}
                  className="flex justify-between rounded-md border border-white/10 bg-[#111925] px-3 py-2 text-sm"
                >
                  <span className="font-mono text-emerald-300">{c.code}</span>
                  <span className="text-white/70">
                    {c.discountType === "percentage"
                      ? `${c.discountValue}% off`
                      : `${c.discountValue} EUR off`}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">Certificate Stats</h2>
            <p className="mt-2 text-sm text-white/65">
              Certifikata të lëshuara për këtë event nga menaxheri.
            </p>
            {certsError ? <p className="mt-3 text-sm text-rose-300">{certsError}</p> : null}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-[#111925] p-3">
                <p className="text-xs text-white/50">Total issued</p>
                <p className="mt-1 text-2xl font-semibold">
                  {certsLoading ? "…" : certStats.totalIssued}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#111925] p-3">
                <p className="text-xs text-white/50">Event ID</p>
                <p className="mt-1 text-lg font-semibold">{eventId}</p>
              </div>
            </div>
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
              {certsLoading ? <li className="text-sm text-white/60">Loading...</li> : null}
              {!certsLoading && certStats.certificates.length === 0 ? (
                <li className="text-sm text-white/60">No certificates issued yet.</li>
              ) : null}
              {certStats.certificates.map((cert) => (
                <li
                  key={cert.id}
                  className="rounded-md border border-white/10 bg-[#111925] px-3 py-2 text-sm"
                >
                  <span className="font-mono text-emerald-300">{cert.code}</span>
                  <span className="text-white/60"> · {cert.userName}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">Give Feedback</h2>
            <p className="mt-2 text-sm text-white/65">
              Share your thoughts or expectations about this event.
            </p>
            <form className="mt-4 space-y-3" onSubmit={handleFeedbackSubmit}>
              <textarea
                value={feedback}
                onChange={(changeEvent) => setFeedback(changeEvent.target.value)}
                placeholder="Write your feedback..."
                className="min-h-40 w-full rounded-md border border-white/10 bg-[#111925] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
              >
                Submit Feedback
              </button>
            </form>

            {message ? (
              <p className="mt-4 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                {message}
              </p>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}

export default EventDetailsPage;
