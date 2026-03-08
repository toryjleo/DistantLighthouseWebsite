import logoMark from './assets/DistantLightHouse1.png'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="navbar-scene fixed left-0 right-0 top-0 z-40 border-b border-black/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <img
              src={logoMark}
              alt="Distant Lighthouse logo"
              className="h-16 w-16 rounded-full border border-black/15 bg-white object-contain"
            />
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-black">
              Distant Lighthouse
            </div>
          </div>
          <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-black/70 sm:flex">
            <a href="#hero" className="hover:text-black">
              Home
            </a>
            <a href="#services" className="hover:text-black">
              Services
            </a>
            <a href="#about" className="hover:text-black">
              About
            </a>
            <a href="#contact" className="hover:text-black">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        <section
          id="hero"
          className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-6 py-28"
        >
          <div className="max-w-2xl space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Mercer, Maine • Indie Software Studio
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Guidance through unfamiliar technical waters.
            </h1>
            <p className="text-base italic text-white/70">
              “A distant lighthouse guides ships safely through unfamiliar
              waters. Contact us today!”
            </p>
            <p className="text-base text-white/70 sm:text-lg">
              We build custom software, automation, and embedded systems that
              cut manual work and keep your team shipping.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60"
              >
                Start a project
              </a>
              <a
                href="#services"
                className="rounded-full border border-white/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
              >
                View services
              </a>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black to-black" />
        </section>

        <section
          id="services"
          className="mx-auto max-w-6xl px-6 py-20"
        >
          <div className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Services
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Custom systems that keep operations steady.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'Internal Tools',
                body: 'Bespoke dashboards, admin panels, and automation to replace manual workflows.',
              },
              {
                title: 'Mobile Apps',
                body: 'iOS and Android apps that keep teams connected in the field.',
              },
              {
                title: 'APIs & Integrations',
                body: 'Resilient data pipelines, API layers, and system integrations.',
              },
              {
                title: 'Embedded Systems',
                body: 'Hardware + software systems for industrial and edge environments.',
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="mb-3 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-white/70">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="mx-auto max-w-6xl px-6 py-20"
        >
          <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                About
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                A decade of building calm, resilient software.
              </h2>
              <p className="text-base text-white/70">
                Distant Lighthouse is a Mercer, Maine studio focused on
                dependable engineering. We design and build systems that keep
                operators out of spreadsheets and back in control.
              </p>
              <p className="text-base text-white/70">
                From modern web platforms to embedded deployments, we focus on
                reliability, clarity, and long-term maintainability.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50">
                Focus Areas
              </p>
              <ul className="space-y-3">
                <li>Automation-first operations</li>
                <li>Field-ready mobile workflows</li>
                <li>Observability and reliability</li>
                <li>Long-range product stewardship</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="mx-auto max-w-6xl px-6 py-20"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Contact
                </p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                  Ready to map the next build?
                </h2>
                <p className="mt-4 text-base text-white/70">
                  Send a note and we’ll respond with timelines, scoping, and the
                  right technical approach.
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-white/70">toryjleo@distantlighthouse.com</p>
                <p className="text-white/70">(207) 509-8613</p>
                <a
                  href="mailto:toryjleo@distantlighthouse.com"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60"
                >
                  Start the conversation
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        © 2026 Distant Lighthouse. All rights reserved.
      </footer>
    </div>
  )
}

export default App
