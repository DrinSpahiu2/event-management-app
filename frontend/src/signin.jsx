import { useId, useState } from 'react'
import heroImg from './assets/hero.png'

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
  )
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
  )
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
  )
}

export default function SignIn() {
  const rememberId = useId()
  const [showPassword, setShowPassword] = useState(false)

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
                <a className="hover:text-white" href="#">
                  Sign in
                </a>
                <a className="hover:text-white" href="#">
                  Sign Up
                </a>
              </nav>
            </header>

            <div className="mt-10">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome To EventEMS
              </h1>
              <p className="mt-2 text-sm text-white/55">
                The faster you fill up, the faster you get a ticket
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <IconEmail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="admin@eventems.com"
                  className="h-12 w-full rounded-md border border-white/12 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/7"
                />
              </div>

              <div className="relative">
                <IconLock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••"
                  className="h-12 w-full rounded-md border border-white/12 bg-white/5 pl-10 pr-24 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/7"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-white/70 hover:bg-white/8 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label
                  htmlFor={rememberId}
                  className="flex select-none items-center gap-2 text-white/70"
                >
                  <input
                    id={rememberId}
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-rose-500"
                  />
                  Remember Me
                </label>
                <a className="text-white/70 hover:text-white" href="#">
                  Forget Password?
                </a>
              </div>

              <button
                type="submit"
                className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-md bg-gradient-to-r from-rose-500 to-orange-400 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
              >
                Sign in
              </button>

              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-md border border-white/12 bg-white/5 text-sm font-semibold text-white/90 transition hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <IconGoogle className="h-5 w-5" />
                Sign In With Google
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/55">
              Don&apos;t Have An Account?{' '}
              <a href="#" className="font-semibold text-white hover:underline">
                Sign up
              </a>
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
  )
}
