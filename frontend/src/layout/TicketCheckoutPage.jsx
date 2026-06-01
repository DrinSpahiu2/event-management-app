import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClientHeader from "./ClientHeader.jsx";
import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { upcomingEvents } from "./eventsData.js";
import { couponApi } from "../api/couponApi.js";

function TicketCheckoutPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [event, setEvent] = useState(null);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validating, setValidating] = useState(false);

  const basePrice = event?.price ?? 0;
  const finalPrice = appliedCoupon ? appliedCoupon.finalPrice : basePrice;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);

    const eventPromise = fetch(`/api/events/${eventId}`).then((res) => {
      if (!res.ok) throw new Error("Ngjarja për këtë biletë nuk ekziston në sistem.");
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
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [eventId, userId]);

  async function handleCheckout(submitEvent) {
  async function handleApplyCoupon(e) {
    e.preventDefault();
    setCouponError("");
    setValidating(true);
    try {
      const result = await couponApi.validate({
        code: couponCode,
        event_id: eventId,
        ticket_price: basePrice,
      });
      setAppliedCoupon(result);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message || "Kuponi nuk është valide.");
    } finally {
      setValidating(false);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  const handleCheckout = (submitEvent) => {
    submitEvent.preventDefault();
    if (!userId) {
      setError("Kyçu përsëri për të blerë biletën.");
      return;
    }
    if (alreadyPurchased) {
      setError("Ke blerë tashmë një biletë për këtë ngjarje.");
      return;
    }

    const ticketId = event?.tickets?.[0]?.id;
    if (!ticketId) {
      setError("Ky event nuk ka biletë të disponueshme.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/registrations/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          eventId: Number(eventId),
          ticketId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Blerja dështoi");

      setMessage("Pagesa u procesua! Bileta u ruajt në llogarinë tënde.");
      setTimeout(() => navigate("/my-tickets"), 1500);
    } catch (err) {
      setError(err.message || "Nuk u përfundua blerja.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141d] flex items-center justify-center text-white">
        <p className="text-lg animate-pulse">Duke ngarkuar...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-[#10141d] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-2xl font-semibold text-rose-400">Event Not Found</h1>
          <p className="text-sm text-white/50 mt-2">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="mt-5 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500 transition"
          >
            Kthehu te Eventet
          </button>
        </div>
      </div>
    );
  }

  const kaBiletë = event.tickets && event.tickets.length > 0;
  const emriBiletes = kaBiletë ? event.tickets[0].lloji : "Standard";
  const cmimiBiletes = kaBiletë ? `${Number(event.tickets[0].cmimi).toFixed(2)} EUR` : "0 EUR";

  return (
    <div className="min-h-screen bg-[#10141d] text-white">
      <ClientHeader subtitle="Checkout" />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/90">
              <span className="font-black">E</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-widest text-white/90">
                EVENT EMS
              </div>
              <div className="text-xs text-white/50">Checkout</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <NavLink className="hover:text-white" to="/">
              Home
            </NavLink>
            <NavLink className="hover:text-white" to="/events">
              Events
            </NavLink>
            <NavLink className="hover:text-white" to="/about">
              About
            </NavLink>
            <NavLink className="hover:text-white" to="/contact">
              Contact
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[1fr_1.2fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 h-fit">
          <h2 className="text-lg font-semibold tracking-wide text-white/90">Përmbledhja e Porosisë</h2>
          <img
            src={event.imazhi || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80"}
            alt={event.titulli}
            className="mt-4 h-40 w-full rounded-xl object-cover border border-white/5"
          />
          <h3 className="mt-4 text-xl font-bold tracking-tight text-white">{event.titulli}</h3>
          <p className="mt-2 text-sm text-white/70">📅 {event.data_fillimit}</p>
          <p className="text-sm text-white/70">📍 {event.lokacioni}</p>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>1x {emriBiletes}</span>
              <span className="text-emerald-400 font-medium">{cmimiBiletes}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-semibold border-t border-white/5 pt-2">
              <span>Totali</span>
              <span className="text-rose-400 text-lg font-bold">{cmimiBiletes}</span>
              <span>1 Ticket</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            {appliedCoupon ? (
              <div className="mt-2 flex items-center justify-between text-sm text-emerald-300">
                <span>Discount ({appliedCoupon.coupon.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            ) : null}
            <div className="mt-2 flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          {alreadyPurchased ? (
            <div className="text-center py-6">
              <p className="text-emerald-300 font-medium">Ke blerë tashmë biletën për këtë event.</p>
              <button
                type="button"
                onClick={() => navigate("/my-tickets")}
                className="mt-4 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500"
              >
                Shko te My Tickets
              </button>
            </div>
          ) : (
          <>
          <h2 className="text-lg font-semibold tracking-wide text-white/90">Detajet e Kartelës Bankare</h2>
          <h2 className="text-lg font-semibold">Coupon Code</h2>
          <form className="mt-3 flex gap-2" onSubmit={handleApplyCoupon}>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="h-11 flex-1 rounded-md border border-white/10 bg-[#111925] px-3 text-sm uppercase outline-none focus:border-rose-400"
            />
            <button
              type="submit"
              disabled={validating || !couponCode.trim()}
              className="rounded-md border border-white/20 bg-white/10 px-4 text-sm font-semibold hover:bg-white/20 disabled:opacity-50"
            >
              {validating ? "..." : "Apply"}
            </button>
          </form>
          {couponError ? (
            <p className="mt-2 text-sm text-rose-300">{couponError}</p>
          ) : null}
          {appliedCoupon ? (
            <div className="mt-3 flex items-center justify-between rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              <span>
                {appliedCoupon.coupon.code} applied — you save $
                {discountAmount.toFixed(2)}
              </span>
              <button type="button" className="text-white/70 underline" onClick={removeCoupon}>
                Remove
              </button>
            </div>
          ) : null}

          <h2 className="mt-6 text-lg font-semibold">Credit Card Details</h2>
          <form className="mt-4 space-y-4" onSubmit={handleCheckout}>
            <div>
              <label className="mb-1 block text-sm text-white/75">Cardholder Name</label>
              <input
                type="text"
                required
                placeholder="John Smith"
                className="h-11 w-full rounded-md border border-white/10 bg-[#111925] px-3 text-sm outline-none focus:border-rose-400 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/75">Card Number</label>
              <input
                type="text"
                required
                placeholder="1234 5678 9012 3456"
                className="h-11 w-full rounded-md border border-white/10 bg-[#111925] px-3 text-sm outline-none focus:border-rose-400 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm text-white/75">Expiry Date</label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  className="h-11 w-full rounded-md border border-white/10 bg-[#111925] px-3 text-sm outline-none focus:border-rose-400 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/75">CVV</label>
                <input
                  type="password"
                  required
                  placeholder="123"
                  className="h-11 w-full rounded-md border border-white/10 bg-[#111925] px-3 text-sm outline-none focus:border-rose-400 text-white"
                />
              </div>
            </div>

            {error ? (
              <p className="text-sm text-rose-300">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting || !kaBiletë}
              className="w-full rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold hover:bg-rose-500 transition disabled:opacity-50"
            >
              {submitting ? "Duke procesuar..." : `Paguaj ${cmimiBiletes}`}
              Pay ${finalPrice.toFixed(2)}
            </button>
          </form>

          {message ? (
            <p className="mt-4 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {message}
            </p>
          ) : null}
          </>
          )}
        </section>
      </main>
    </div>
  );
}

export default TicketCheckoutPage;
