import { useEffect, useState } from "react";
import { managerPurchasesApi } from "../api/managerPurchasesApi";

function formatMoney(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "0.00";
  return n.toFixed(2);
}

function formatDateTime(value) {
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
  const s = String(status || "").toLowerCase();
  if (s === "confirmed") return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
  if (s === "cancelled") return "border-rose-400/30 bg-rose-500/10 text-rose-300";
  return "border-amber-400/30 bg-amber-500/10 text-amber-200";
}

export default function ManagerPurchases() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await managerPurchasesApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Nuk u ngarkuan blerjet.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Purchases</h2>
        <button
          type="button"
          onClick={load}
          className="rounded-md border border-[#2b3446] bg-[#11161f] px-3 py-2 text-[13px] text-[#f3f6fb] transition hover:bg-white/5"
        >
          Rifresko
        </button>
      </div>

      {loading ? <p className="text-sm text-[#95a2ba]">Duke ngarkuar...</p> : null}
      {error ? (
        <p className="text-sm text-rose-300 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2">{error}</p>
      ) : null}

      {!loading && !error && rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
          <p className="text-white/70">Nuk ka blerje ende.</p>
        </div>
      ) : null}

      {!loading && !error ? (
        <ul className="m-0 flex list-none flex-col gap-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-white font-semibold truncate">{r.event?.title || "Event"}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs uppercase ${statusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#95a2ba]">👤 {r.user?.name || "Unknown"}</p>
                  <p className="text-sm text-[#95a2ba]">📅 {formatDateTime(r.purchaseDate)}</p>
                  <p className="text-sm text-[#95a2ba]">📍 {r.event?.location || ""}</p>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm text-white/70">
                    🎟 {r.ticket?.type || "Standard"} · €{formatMoney(r.ticket?.price)}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Payment: {r.payment?.status || "—"}
                    {r.payment?.paidAt ? ` · ${formatDateTime(r.payment.paidAt)}` : ""}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

