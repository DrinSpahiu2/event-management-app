import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "./assets/hero.png";

function IconEmail(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6.5 7.5 12 12l5.5-4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLock(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M7.5 10V8a4.5 4.5 0 0 1 9 0v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.75 10h10.5A2.75 2.75 0 0 1 20 12.75v4.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25v-4.5A2.75 2.75 0 0 1 6.75 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 14.25v2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGoogle(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.8h5.3c-.2 1.2-1.5 3.6-5.3 3.6-3.2 0-5.8-2.6-5.8-5.9S8.8 5.8 12 5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.4 14.6 2.3 12 2.3 6.9 2.3 2.8 6.5 2.8 11.7S6.9 21 12 21c6 0 7.9-4.2 7.9-6.3 0-.4 0-.7-.1-1H12Z"
      />
      <path
        fill="#34A853"
        d="M3.7 7.5l3.1 2.3c.8-1.6 2.4-2.7 4.2-2.7 1.1 0 2 .4 2.7 1l2.6-2.5C15.7 3.4 13.9 2.6 12 2.6c-3.4 0-6.4 2-8.3 4.9Z"
      />
      <path
        fill="#4A90E2"
        d="M12 21c2.6 0 4.8-.8 6.4-2.2l-3.1-2.4c-.8.6-1.9 1-3.3 1-1.8 0-3.4-1.1-4.2-2.7l-3.1 2.4C5.6 19.7 8.6 21 12 21Z"
      />
      <path
        fill="#FBBC05"
        d="M4.1 15.4l3.1-2.4c-.2-.6-.3-1.1-.3-1.8 0-.6.1-1.2.3-1.8L4 7.9C3.3 9.2 3 10.6 3 12s.3 2.8 1.1 3.9Z"
      />
    </svg>
  );
}

export default function SignIn() {
  const navigate = useNavigate();
  const rememberId = useId();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    passwordi: "",
    emri: "",
    mbiemri: "",
    telefoni: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          passwordi: formData.passwordi,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign in failed");
      }

      // Save user session details
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userRole", data.role); // Save text string instead of numeric ID

      setMessage("✅ Sign in successful!");

      // Route them smoothly based on their clean database string name
      setTimeout(() => {
        switch (data.role) {
          case "SuperAdmin":
            navigate("/admin");
            break;
          case "Manager":
            navigate("/menaxher");
            break;
          case "Speaker":
            navigate("/speaker");
            break;
          case "Sponsor":
            navigate("/sponsors");
            break;
          case "Client":
            navigate("/events");
            break;
          default:
            navigate("/");
        }
      }, 1500);
    } catch (error) {
      setErrorMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      if (
        !formData.emri ||
        !formData.mbiemri ||
        !formData.email ||
        !formData.passwordi
      ) {
        throw new Error("Please fill in all required fields");
      }

      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      setMessage("✅ Account created successfully! Signing you in...");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userRole", "Client"); // Default text role for newly signed-up accounts

      setTimeout(() => navigate("/events"), 1500);
    } catch (error) {
      setErrorMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage("");
    setMessage("");
    setFormData({
      email: "",
      passwordi: "",
      emri: "",
      mbiemri: "",
      telefoni: "",
    });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-stretch px-4 py-8 md:py-12">
        <div className="grid w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 shadow-2xl shadow-black/40 md:grid-cols-2">
          <section className="flex flex-col px-6 py-7 sm:px-10 sm:py-10">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400">
                  <span className="text-sm font-semibold text-black">e</span>
                </div>
                <span className="text-sm font-semibold tracking-wide">
                  EventEMS
                </span>
              </div>
              <nav className="flex items-center gap-5 text-sm text-white/70">
                <button
                  type="button"
                  onClick={() => isSignUp && handleToggleMode()}
                  className={`hover:text-white ${!isSignUp ? "text-white" : ""}`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => !isSignUp && handleToggleMode()}
                  className={`hover:text-white ${isSignUp ? "text-white" : ""}`}
                >
                  Sign Up
                </button>
              </nav>
            </header>

            <div className="mt-10">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {isSignUp ? "Create Account" : "Welcome To EventEMS"}
              </h1>
              <p className="mt-2 text-sm text-white/55">
                {isSignUp
                  ? "Sign up to get started with EventEMS"
                  : "The faster you fill up, the faster you get a ticket"}
              </p>
            </div>

            {message && (
              <div className="mt-4 rounded-md bg-green-500/20 border border-green-500/50 p-3 text-sm text-green-400">
                {message}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 rounded-md bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
                {errorMessage}
              </div>
            )}

            <form
              className="mt-8 space-y-4 max-h-96 overflow-y-auto"
              onSubmit={isSignUp ? handleSignUp : handleSignIn}
            >
              {isSignUp && (
                <>
                  <input
                    type="text"
                    name="emri"
                    placeholder="First Name"
                    value={formData.emri}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-md border border-white/12 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/7"
                  />
                  <input
                    type="text"
                    name="mbiemri"
                    placeholder="Last Name"
                    value={formData.mbiemri}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-md border border-white/12 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/7"
                  />
                  <input
                    type="tel"
                    name="telefoni"
                    placeholder="Phone Number (optional)"
                    value={formData.telefoni}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-md border border-white/12 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/7"
                  />
                </>
              )}

              <div className="relative">
                <IconEmail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 w-full rounded-md border border-white/12 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/7"
                />
              </div>

              <div className="relative">
                <IconLock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="passwordi"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="••••••"
                  value={formData.passwordi}
                  onChange={handleInputChange}
                  className="h-12 w-full rounded-md border border-white/12 bg-white/5 pl-10 pr-24 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/7"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-white/70 hover:bg-white/8 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between text-sm">
                  <label
                    htmlFor={rememberId}
                    className="flex select-none items-center gap-2 text-white/70"
                  >
                    <input
                      id={rememberId}
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-white/5 accent-rose-500"
                    />{" "}
                    Remember Me
                  </label>
                  <a className="text-white/70 hover:text-white" href="#">
                    Forget Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-md bg-gradient-to-r from-rose-500 to-orange-400 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign in"}
              </button>

              {!isSignUp && (
                <button
                  type="button"
                  className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-md border border-white/12 bg-white/5 text-sm font-semibold text-white/90 transition hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <IconGoogle className="h-5 w-5" /> Sign In With Google
                </button>
              )}
            </form>

            <p className="mt-8 text-center text-sm text-white/55">
              {isSignUp
                ? "Already have an account? "
                : "Don't Have An Account? "}
              <button
                type="button"
                onClick={handleToggleMode}
                className="font-semibold text-white hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </section>

          <aside className="relative hidden md:block">
            <img
              src={heroImg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-neutral-950/20 via-neutral-950/30 to-neutral-950/90" />
          </aside>
        </div>
      </div>
    </main>
  );
}
