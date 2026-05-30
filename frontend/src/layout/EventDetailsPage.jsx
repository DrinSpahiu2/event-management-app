import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { upcomingEvents } from "./eventsData.js";
import { certificateApi } from "../api/certificateApi.js";
import { couponApi } from "../api/couponApi.js";

function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [eventCoupons, setEventCoupons] = useState({
    totalActive: 0,
    coupons: [],
  });
  const [couponsLoading, setCouponsLoading] = useState(true);

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
  const [certStats, setCertStats] = useState({
    totalIssued: 0,
    certificates: [],
    eventTitle: "",
  });
  const [certsLoading, setCertsLoading] = useState(true);
  const [certsError, setCertsError] = useState("");

  const event = upcomingEvents.find((item) => item.id === Number(eventId));

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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/signin");
  };

  const handleFeedbackSubmit = (submitEvent) => {
    submitEvent.preventDefault();

    if (!feedback.trim()) {
      setMessage("Please write feedback before submitting.");
      return;
    }

    setMessage("Thanks! Your feedback has been submitted.");
    setFeedback("");
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
              <div className="text-xs text-white/50">Event Details</div>
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

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1.1fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <img src={event.image} alt={event.title} className="h-64 w-full object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-semibold">{event.title}</h1>
            <p className="mt-3 text-sm text-white/70">{event.date}</p>
            <p className="text-sm text-white/70">{event.time}</p>
            <p className="text-sm text-white/70">{event.location}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {event.description}
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="text-xl font-semibold">Ticket: ${event.price}</span>
              <button
                type="button"
                onClick={() => navigate(`/events/${event.id}/checkout`)}
                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500"
              >
                Purchase Ticket
              </button>
            </div>
          </div>
        </section>

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
                      : `$${c.discountValue} off`}
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
            {certsError ? (
              <p className="mt-3 text-sm text-rose-300">{certsError}</p>
            ) : null}
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
              {certsLoading ? (
                <li className="text-sm text-white/60">Loading...</li>
              ) : null}
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
