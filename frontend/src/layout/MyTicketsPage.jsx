import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientHeader from "./ClientHeader.jsx";

function formatPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return `${num.toFixed(2)} EUR`;
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status) {
  if (status === "confirmed") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
  }
  if (status === "cancelled") {
    return "border-rose-400/30 bg-rose-500/10 text-rose-300";
  }
  return "border-amber-400/30 bg-amber-500/10 text-amber-200";
}

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("Kyçu përsëri për të parë biletat e tua.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/registrations/me?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Gabim në ngarkim");
        setTickets(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Nuk u ngarkuan biletat.");
        setTickets([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#10141d] text-white">
      <ClientHeader subtitle="My Tickets" />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">My Purchased Tickets</h1>
          <p className="mt-2 text-sm text-white/60">
            Të gjitha biletat që ke blerë përmes platformës.
          </p>
        </div>

        {loading ? (
          <p className="text-white/60 animate-pulse">Duke ngarkuar biletat...</p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        {!loading && !error && tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
            <p className="text-white/70">Nuk ke blerë asnjë biletë ende.</p>
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="mt-4 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500 transition"
            >
              Shiko Eventet
            </button>
          </div>
        ) : null}

        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {tickets.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:flex-row"
            >
              <img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80"
                }
                alt={item.eventTitle}
                className="h-40 w-full object-cover sm:h-auto sm:w-48"
              />
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="m-0 text-xl font-semibold">{item.eventTitle}</h2>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs uppercase ${statusBadge(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">📅 {formatDate(item.eventDate)}</p>
                  <p className="text-sm text-white/70">📍 {item.location}</p>
                  <p className="mt-2 text-sm text-white/60">
                    {item.ticketType} · {formatPrice(item.price)}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Blerë më: {formatDate(item.purchaseDate)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/events/${item.eventId}`)}
                  className="mt-4 w-fit rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/5 transition"
                >
                  Shiko Eventin
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
