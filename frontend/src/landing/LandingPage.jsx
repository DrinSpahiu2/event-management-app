import { useEffect, useMemo, useState } from 'react'
import heroImg from '../assets/hero.png'
import './LandingPage.css'

function Logo() {
  return (
    <div className="lp-logo" aria-label="Expovent logo">
      <span className="lp-logo-mark" aria-hidden="true" />
      <span className="lp-logo-text">Expovent</span>
    </div>
  )
}

function PrimaryButton({ children, onClick }) {
  return (
    <button type="button" className="lp-btn lp-btn--primary" onClick={onClick}>
      {children}
    </button>
  )
}

function TagButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      className={`lp-tag ${active ? 'lp-tag--active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function CircleAvatar({ index, name }) {
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/).slice(0, 2)
    return parts.map((p) => p[0]?.toUpperCase()).join('')
  }, [name])

  return (
    <div className="lp-avatar" style={{ ['--i']: index }} aria-label={name}>
      <div className="lp-avatar__ring" aria-hidden="true" />
      <div className="lp-avatar__img" aria-hidden="true" />
      <div className="lp-avatar__label">{initials}</div>
    </div>
  )
}

export default function LandingPage() {
  const scheduleDays = ['Day 1', 'Day 2', 'Day 3']
  const [activeDay, setActiveDay] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  const testimonials = useMemo(
    () => [
      {
        name: 'Alex Johnson',
        quote:
          'This event exceeded expectations. The sessions were practical, and the networking was truly valuable.',
      },
      {
        name: 'Sophia Lee',
        quote:
          'Everything felt organized and engaging. I left with new ideas and contacts I can keep building on.',
      },
      {
        name: 'Michael Brown',
        quote:
          "Great speakers, smooth schedule, and a friendly atmosphere. I'm already looking forward to next year.",
      },
      {
        name: 'Emma Wilson',
        quote:
          'A top-notch conference experience. The talks were clear and the platform made collaboration effortless.',
      },
    ],
    []
  )

  const schedule = useMemo(
    () => [
      [
        { time: '09:00 AM', title: 'Opening & Keynote Session', speaker: 'Dr. Anna Stone', track: 'Main Hall' },
        { time: '11:00 AM', title: 'Designing Scalable Systems', speaker: 'John Carter', track: 'Workshop Room' },
        { time: '02:00 PM', title: 'Future of Product Engineering', speaker: 'Mira Patel', track: 'Main Hall' },
      ],
      [
        { time: '10:00 AM', title: 'Community Meetup & Panels', speaker: 'Team Effort', track: 'Community Space' },
        { time: '12:30 PM', title: 'Security & Best Practices', speaker: 'Sam Rivera', track: 'Main Hall' },
        { time: '03:00 PM', title: 'Hands-on: Modern Frontend', speaker: 'Taylor Kim', track: 'Workshop Room' },
      ],
      [
        { time: '09:30 AM', title: 'Customer-Centric Innovation', speaker: 'Cleo Martinez', track: 'Main Hall' },
        { time: '11:30 AM', title: 'Scaling Teams with Process', speaker: 'Chris Walker', track: 'Workshop Room' },
        { time: '02:30 PM', title: 'Closing Remarks & Awards', speaker: 'Expovent Team', track: 'Main Hall' },
      ],
    ],
    []
  )

  useEffect(() => {
    const t = setInterval(() => {
      setTestimonialIndex((v) => (v + 1) % testimonials.length)
    }, 4500)
    return () => clearInterval(t)
  }, [testimonials.length])

  const t = testimonials[testimonialIndex]
  const peopleNames = ['Chris Wright', 'Maya Evans', 'Noah Baker', 'Isabella Clark', 'Liam Hall', 'Zoe Turner', 'Olivia Scott']

  return (
    <div id="lp-root">
      <a className="lp-skip" href="#lp-content">
        Skip to content
      </a>

      <header className="lp-header">
        <div className="lp-container lp-header__inner">
          <Logo />

          <nav className="lp-nav" aria-label="Main navigation">
            <a href="#lp-about" className="lp-nav__link">
              About
            </a>
            <a href="#lp-tickets" className="lp-nav__link">
              Tickets
            </a>
            <a href="#lp-schedule" className="lp-nav__link">
              Schedule
            </a>
            <a href="#lp-speakers" className="lp-nav__link">
              Speakers
            </a>
            <a href="#lp-blog" className="lp-nav__link">
              Blog
            </a>
          </nav>

          <div className="lp-header__cta">
            <PrimaryButton
              onClick={() => {
                const el = document.getElementById('lp-tickets')
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              Buy Tickets
            </PrimaryButton>
          </div>
        </div>
      </header>

      <main id="lp-content">
        <section className="lp-hero" aria-label="Hero">
          <div className="lp-hero__overlay" aria-hidden="true" />
          <div className="lp-container lp-hero__inner">
            <div className="lp-hero__left">
              <div className="lp-hero__badge" aria-hidden="true" />
              <div className="lp-hero__eyebrow">CONFERENCE</div>
              <div className="lp-hero__title">
                DIGITAL THINKERS
                <br />
                CONFERENCE
              </div>
              <p className="lp-hero__subtitle">February 09 - 2023 - Online + In-person</p>
              <div className="lp-hero__actions">
                <PrimaryButton
                  onClick={() => {
                    const el = document.getElementById('lp-tickets')
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  Get Ticket Now
                </PrimaryButton>
                <button
                  type="button"
                  className="lp-btn lp-btn--ghost"
                  onClick={() => {
                    const el = document.getElementById('lp-video')
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  Watch Trailer
                </button>
              </div>
              <div className="lp-hero__dots" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="lp-hero__right">
              <div className="lp-heroMedia" style={{ backgroundImage: `url(${heroImg})` }}>
                <div className="lp-heroMedia__slider" aria-hidden="true">
                  <div className="lp-heroMedia__sliderDots" />
                  <div className="lp-heroMedia__sliderLine" />
                </div>

                <div className="lp-heroMedia__dateCard">
                  <div className="lp-heroMedia__dateText">FEB 09 - 2023</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--muted" id="lp-video" aria-label="Video highlight">
          <div className="lp-container lp-twoCol">
            <div className="lp-twoCol__text">
              <div className="lp-section__kicker">Experience a true digital conference</div>
              <h2 className="lp-section__title">Experience a true digital conference</h2>
              <p className="lp-section__desc">
                A modern event built for real learning: talks, workshops, and community - all in one place.
              </p>
              <div className="lp-videoMeta">
                <div className="lp-videoMeta__item">
                  <span className="lp-iconDot" aria-hidden="true" />
                  12+ Sessions
                </div>
                <div className="lp-videoMeta__item">
                  <span className="lp-iconDot lp-iconDot--accent" aria-hidden="true" />
                  Live Networking
                </div>
                <div className="lp-videoMeta__item">
                  <span className="lp-iconDot lp-iconDot--blue" aria-hidden="true" />
                  Expert Speakers
                </div>
              </div>
            </div>

            <div className="lp-twoCol__media">
              <div className="lp-videoCard">
                <div className="lp-videoCard__poster" aria-hidden="true">
                  <div className="lp-videoCard__play" aria-hidden="true">
                    <span />
                  </div>
                </div>
                <div className="lp-videoCard__bar" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--dark" id="lp-about" aria-label="Why join">
          <div className="lp-container">
            <div className="lp-section__header">
              <div className="lp-redUnderline" aria-hidden="true" />
              <div className="lp-section__kicker">WHY YOU SHOULD JOIN THIS EVENT</div>
            </div>

            <div className="lp-featureGrid" role="list">
              {[
                { title: 'Learn from experts', desc: 'Practical sessions you can apply right away.' },
                { title: 'Meet the community', desc: 'Connect with people who share your goals.' },
                { title: 'Hands-on workshops', desc: 'Build skills with guided, real exercises.' },
                { title: 'Get resources', desc: 'Download notes, slides, and templates.' },
              ].map((f, idx) => (
                <div key={f.title} className="lp-featureCard" role="listitem">
                  <div className="lp-featureCard__icon" aria-hidden="true">
                    {idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : '4'}
                  </div>
                  <div className="lp-featureCard__title">{f.title}</div>
                  <div className="lp-featureCard__desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--dark2" aria-label="People's testimonial">
          <div className="lp-container lp-testimonials">
            <div className="lp-section__header lp-testimonials__header">
              <div className="lp-redUnderline" aria-hidden="true" />
              <div className="lp-section__kicker">PEOPLES TESTIMONIAL</div>
            </div>

            <div className="lp-testimonials__stage">
              <div className="lp-testimonials__around" aria-hidden="true">
                {peopleNames.map((n, i) => (
                  <CircleAvatar key={n} index={i} name={n} />
                ))}
              </div>

              <div className="lp-testimonials__quote" role="group" aria-label="Testimonial text">
                <div className="lp-testimonials__quoteText">"{t.quote}"</div>
                <div className="lp-testimonials__quoteName">- {t.name}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--pricing" id="lp-tickets" aria-label="Tickets">
          <div className="lp-container">
            <div className="lp-section__header lp-section__header--center">
              <div className="lp-redUnderline" aria-hidden="true" />
              <div className="lp-section__kicker">GET TICKET NOW</div>
            </div>

            <div className="lp-pricingGrid">
              {[
                { price: '$599', title: 'Starter', desc: 'For beginners who want to try.', features: ['Workshop access', 'Email support', 'Community access'], tone: 'neutral' },
                { price: '$799', title: 'Pro', desc: 'For teams building real skills.', features: ['All sessions', 'Priority seating', 'Resources pack'], tone: 'accent' },
                { price: '$999', title: 'Business', desc: 'For organizations and enterprises.', features: ['Team tickets', 'Exclusive Q&A', 'Dedicated manager'], tone: 'neutral2' },
              ].map((p) => (
                <div key={p.title} className={`lp-pricingCard ${p.tone === 'accent' ? 'lp-pricingCard--accent' : ''}`}>
                  <div className="lp-pricingCard__top">
                    <div className="lp-pricingCard__price">{p.price}</div>
                    <div className="lp-pricingCard__title">{p.title}</div>
                  </div>
                  <div className="lp-pricingCard__desc">{p.desc}</div>
                  <ul className="lp-pricingCard__list">
                    {p.features.map((x) => (
                      <li key={x}>
                        <span className="lp-check" aria-hidden="true" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`lp-btn ${p.tone === 'accent' ? 'lp-btn--primary' : 'lp-btn--ghost'}`}
                    onClick={() => {
                      const el = document.getElementById('lp-tickets')
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    Get Tickets
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--schedule" id="lp-schedule" aria-label="Conference schedule">
          <div className="lp-container">
            <div className="lp-section__header lp-section__header--center">
              <div className="lp-redUnderline" aria-hidden="true" />
              <div className="lp-section__kicker">CONFERENCE SCHEDULE</div>
            </div>

            <div className="lp-scheduleTop">
              {scheduleDays.map((d, idx) => (
                <TagButton key={d} active={idx === activeDay} onClick={() => setActiveDay(idx)}>
                  {d}
                </TagButton>
              ))}
            </div>

            <div className="lp-scheduleList" role="list">
              {schedule[activeDay].map((item) => (
                <div key={`${item.time}-${item.title}`} className="lp-scheduleItem" role="listitem">
                  <div className="lp-scheduleItem__time">{item.time}</div>
                  <div className="lp-scheduleItem__dotWrap" aria-hidden="true">
                    <div className="lp-scheduleItem__dot" />
                    <div className="lp-scheduleItem__line" />
                  </div>
                  <div className="lp-scheduleItem__content">
                    <div className="lp-scheduleItem__title">{item.title}</div>
                    <div className="lp-scheduleItem__speaker">{item.speaker}</div>
                  </div>
                  <div className="lp-scheduleItem__track">{item.track}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--stats" aria-label="Event stats">
          <div className="lp-container lp-statsGrid">
            {[
              { value: '1,030', label: 'Attendees' },
              { value: '1,600', label: 'Speakers' },
              { value: '1,230', label: 'Sessions' },
              { value: '1,070', label: 'Workshops' },
            ].map((s) => (
              <div key={s.label} className="lp-stat">
                <div className="lp-stat__value">{s.value}</div>
                <div className="lp-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-section lp-section--blog" id="lp-blog" aria-label="Expovent Insight">
          <div className="lp-container">
            <div className="lp-section__header lp-section__header--center">
              <div className="lp-redUnderline" aria-hidden="true" />
              <div className="lp-section__kicker">EXPONENT INSIGHT</div>
            </div>

            <div className="lp-blogGrid">
              {[
                { category: 'News', title: 'Event trends for 2023', desc: "What's changing and how to prepare as a speaker." },
                { category: 'Interview', title: 'Designing for the future', desc: 'A quick talk with our product engineering team.' },
                { category: 'Learning', title: 'Practical build guides', desc: 'Reusable checklists to speed up your next project.' },
              ].map((card, i) => (
                <div key={card.title} className="lp-blogCard">
                  <div className="lp-blogCard__img" aria-hidden="true">
                    <div className="lp-blogCard__imgInner" style={{ ['--h']: `${30 + i * 20}%` }} />
                  </div>
                  <div className="lp-blogCard__content">
                    <div className="lp-blogCard__category">{card.category}</div>
                    <div className="lp-blogCard__title">{card.title}</div>
                    <div className="lp-blogCard__desc">{card.desc}</div>
                    <button type="button" className="lp-blogCard__more">
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--partners" aria-label="Organize partners">
          <div className="lp-container">
            <div className="lp-section__header lp-section__header--center">
              <div className="lp-redUnderline" aria-hidden="true" />
              <div className="lp-section__kicker">ORGANIZE PARTNER</div>
            </div>

            <div className="lp-partnerRow" role="list">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((x) => (
                <div key={x} className="lp-partnerLogo" role="listitem" aria-label={`Partner ${x}`}>
                  {x}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section--speakers" id="lp-speakers" aria-label="Talented speakers">
          <div className="lp-container">
            <div className="lp-section__header lp-section__header--center">
              <div className="lp-redUnderline" aria-hidden="true" />
              <div className="lp-section__kicker">TALENTED SPEAKERS</div>
            </div>

            <div className="lp-speakerGrid">
              {[
                { name: 'Emma Carter', color: 'lp-speakerGrid__img--a' },
                { name: 'Noah Patel', color: 'lp-speakerGrid__img--b' },
                { name: 'Sophia Walker', color: 'lp-speakerGrid__img--c' },
                { name: 'Liam Johnson', color: 'lp-speakerGrid__img--d' },
              ].map((s) => (
                <div key={s.name} className="lp-speakerCard">
                  <div className={`lp-speakerGrid__img ${s.color}`} aria-hidden="true" />
                  <div className="lp-speakerCard__name">{s.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="lp-footer" aria-label="Footer">
          <div className="lp-container lp-footer__inner">
            <div className="lp-footer__left">Expovent | Digital Thinkers Conference</div>
            <div className="lp-footer__right">Copyright {new Date().getFullYear()} All rights reserved.</div>
          </div>
        </footer>
      </main>
    </div>
  )
}
