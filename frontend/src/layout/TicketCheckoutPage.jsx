import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { upcomingEvents } from "./eventsData.js";
import { couponApi } from "../api/couponApi.js";

function TicketCheckoutPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = upcomingEvents.find((item) => item.id === Number(eventId));
  const [message, setMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validating, setValidating] = useState(false);

  const basePrice = event?.price ?? 0;
  const finalPrice = appliedCoupon ? appliedCoupon.finalPrice : basePrice;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/signin");
  };

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
    setMessage("Payment successful. Your ticket has been booked.");
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#10141d] px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-2xl font-semibold">Event not found</h1>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="mt-5 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10141d] text-white">
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
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <img
            src={event.image}
            alt={event.title}
            className="mt-4 h-40 w-full rounded-xl object-cover"
          />
          <h3 className="mt-4 text-xl font-semibold">{event.title}</h3>
          <p className="mt-1 text-sm text-white/70">{event.date}</p>
          <p className="text-sm text-white/70">{event.time}</p>
          <p className="text-sm text-white/70">{event.location}</p>
          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm text-white/70">
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
                className="h-11 w-full rounded-md border border-white/10 bg-[#111925] px-3 text-sm outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/75">Card Number</label>
              <input
                type="text"
                required
                placeholder="1234 5678 9012 3456"
                className="h-11 w-full rounded-md border border-white/10 bg-[#111925] px-3 text-sm outline-none focus:border-rose-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm text-white/75">Expiry Date</label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  className="h-11 w-full rounded-md border border-white/10 bg-[#111925] px-3 text-sm outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/75">CVV</label>
                <input
                  type="password"
                  required
                  placeholder="123"
                  className="h-11 w-full rounded-md border border-white/10 bg-[#111925] px-3 text-sm outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500"
            >
              Pay ${finalPrice.toFixed(2)}
            </button>
          </form>

          {message ? (
            <p className="mt-4 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {message}
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default TicketCheckoutPage;
