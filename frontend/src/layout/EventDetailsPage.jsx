import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientHeader from "./ClientHeader.jsx";

function EventDetailsPage() {
  const { eventId } = useParams(); // 🚀 Matches ':eventId' from App.jsx exactly!
  const navigate = useNavigate();
  
  const userId = localStorage.getItem("userId");
  const [event, setEvent] = useState(null);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);

    const eventPromise = fetch(`/api/events/${eventId}`).then((res) => {
      if (!res.ok) throw new Error("Eventi nuk u gjet ose dështoi lidhja me serverin.");
      return res.json();
    });

    const purchasePromise =
      userId
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
        console.error("❌ Error fetching event details:", err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [eventId, userId]);

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
          onClick={() => navigate("/events")} 
          className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
        >
          Kthehu tek Eventet
        </button>
      </div>
    );
  }

  // Extract price safely from your nested eager-loaded Tickets relation model
  const kaBiletë = event.tickets && event.tickets.length > 0;
  const cmimiBiletes = kaBiletë ? `${event.tickets[0].cmimi} EUR` : "Falas / Pa Çmim";

  return (
    <div className="min-h-screen bg-[#10141d] text-white">
      <ClientHeader subtitle="Event Details" />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {/* Main Banner Image */}
          <img
            src={event.imazhi || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80"}
            alt={event.titulli}
            className="h-80 w-full object-cover border-b border-white/10"
          />

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{event.titulli}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400 uppercase">
                {event.statusi || "aktiv"}
              </span>
            </div>

            {/* Event Meta Specifications */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-4 border-y border-white/10 py-6 text-sm text-white/80">
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

            {/* Description Text block */}
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
      </main>
    </div>
  );
}

export default EventDetailsPage;