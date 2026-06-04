import { useState } from "react";
import { NavLink } from "react-router-dom";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", text: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Mesazhi nuk u dërgua.");
      }
      setStatus({
        type: "success",
        text: data.message || "Mesazhi u dërgua me sukses!",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        text:
          err.message ||
          "Nuk u lidh me serverin. Sigurohu që backend-i është duke punuar.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10141d] text-white">
      {/* Top navigation */}
      <header className="relative sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/90">
              <span className="font-black">E</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-widest text-white/90">
                EVENT EMS
              </div>
              <div className="text-xs text-white/50">Event Management</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex text-sm text-white/70">
            <NavLink className="hover:text-white" to="/">
              Home
            </NavLink>
            <NavLink className="hover:text-white" to="/about">
              About
            </NavLink>
            <NavLink className="hover:text-white" to="/about#speakers">
              Speakers
            </NavLink>
            <NavLink className="hover:text-white" to="/about#insights">
              Insights
            </NavLink>
            <NavLink className="hover:text-white" to="/contact">
              Contact
            </NavLink>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden rounded-md p-2 text-white hover:bg-white/6 bg-white/5 border border-white/10"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 000 2h12a1 1 0 100-2H4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <NavLink
            to="/signin"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Get Started
          </NavLink>
        </div>

        {menuOpen && (
          <nav className="md:hidden absolute left-0 right-0 top-full z-40 border-t border-white/10 bg-black/80 backdrop-blur">
            <div className="mx-auto max-w-7xl px-6 py-4">
              <ul className="flex flex-col gap-2">
                <li>
                  <NavLink
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-white/5"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-white/5"
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about#speakers"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-white/5"
                  >
                    Speakers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about#insights"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-white/5"
                  >
                    Insights
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-white/5"
                  >
                    Contact
                  </NavLink>
                </li>
                <li className="pt-2">
                  <NavLink
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                  >
                    Get Started
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        )}
      </header>

      {/* Page title */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,80,80,0.10),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 text-center">
          <h1 className="text-2xl font-semibold text-white/90 sm:text-3xl">
            Contact Us
          </h1>
          <div className="mt-2 text-xs text-white/50">
            <span className="opacity-80">Home</span>
            <span className="px-2">/</span>
            <span className="text-white/80">Contact Us</span>
          </div>
        </div>
      </section>

      {/* Contact content */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white/90 sm:text-3xl">
            Feel Free Contact Us
          </h2>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  value={form.name}
                  placeholder="Your Name"
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/60"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="Your Email"
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/60"
                />
              </div>

              <input
                name="subject"
                value={form.subject}
                placeholder="Subject"
                onChange={handleChange}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/60"
              />

              <textarea
                name="message"
                value={form.message}
                placeholder="Your Message"
                onChange={handleChange}
                rows={6}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/60"
              />

              {status.text ? (
                <p
                  className={`text-sm ${
                    status.type === "success"
                      ? "text-emerald-300"
                      : "text-rose-300"
                  }`}
                >
                  {status.text}
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-xs text-white/50">
                  We reply within 24 hours.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </section>

          {/* Info */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-widest text-white/70">
              CONTACT
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              Reach out anytime
            </h3>

            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold">Location</div>
                  <div className="mt-1 text-sm text-white/60">Prishtine</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4h16v16H4V4z"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M4 7l8 6 8-6"
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold">Email</div>
                  <div className="mt-1 text-sm text-white/60">
                    info@eventems.com
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.5 3.5l3 1.5-1.2 3.3c1.1 2.1 2.8 3.8 5 5l3.3-1.2 1.5 3c.3.6.1 1.3-.4 1.7-1.2 1-2.7 1.5-4.3 1.3-6.2-.7-11.2-5.7-11.9-11.9-.2-1.6.3-3.1 1.3-4.3.4-.5 1.1-.7 1.7-.4z"
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold">Phone</div>
                  <div className="mt-1 text-sm text-white/60">
                    +383 42 234 567
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
                aria-label="Twitter"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M19 7.2c.01.2.01.4.01.6 0 6-4.6 10.3-10.3 10.3-2.1 0-4-.6-5.7-1.6.3 0 .6.1 1 .1 1.7 0 3.3-.6 4.5-1.6-1.6-.1-2.9-1.1-3.3-2.5.2.1.5.1.8.1.3 0 .7 0 1-.1-1.7-.3-3-1.8-3-3.6v-.1c.5.3 1.2.6 1.9.6-1-.7-1.6-1.8-1.6-3.1 0-.7.2-1.4.6-1.9 1.8 2.2 4.5 3.6 7.5 3.8-.1-.3-.1-.7-.1-1 0-1.8 1.5-3.3 3.3-3.3 1 0 1.8.4 2.4 1.1.7-.1 1.4-.4 2-.8-.2.8-.7 1.4-1.4 1.8.6-.1 1.2-.2 1.7-.5-.4.6-.9 1.2-1.5 1.6z"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
                aria-label="Facebook"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1z"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z"
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 17a5 5 0 100-10 5 5 0 000 10z"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M17.5 6.5h.01"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#07142e]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/90">
                  <span className="font-black">E</span>
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-widest text-white/90">
                    EVENT EMS
                  </div>
                  <div className="text-xs text-white/50">Event Management</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                A modern platform for planning, running, and learning from
                events with confidence.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">
                Useful Links
              </div>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li>
                  <NavLink to="/about" className="hover:text-white">
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about#speakers" className="hover:text-white">
                    Speakers
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about#insights" className="hover:text-white">
                    Insights
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className="hover:text-white">
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">
                Events Details
              </div>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li>Conference Tracks</li>
                <li>Workshops &amp; Talks</li>
                <li>Live Q&amp;A</li>
                <li>Post-event Reports</li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-white">Subscribe</div>
              <p className="mt-3 text-sm text-white/60">
                Get updates about events and platform improvements.
              </p>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/60"
                />
                <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500">
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
            Copyright &copy; {new Date().getFullYear()} Expovent. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
