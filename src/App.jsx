import { useState } from 'react'
import logoMark from './assets/DistantLightHouse1.png'
import WaterShader from './components/WaterShader'

function App() {
  const [shaderDebug, setShaderDebug] = useState({
    paused: false,
    showUV: false,
    lowQuality: false,
    timeScale: 0.65,
    alpha: 0.95,
    depth: 0.62,
    edge: 0.12,
    height: 0.0,
    w1Scale: 10.0,
    w2Scale: 4.0,
    w3Scale: 16.0,
  })

  const projects = [
    {
      name: 'YBWY',
      description:
        'A custom platform that blends automation, data clarity, and a tailored workflow for fast-moving teams.',
      theme: {
        primary: '#f8efe2',
        secondary: '#e7a14f',
        text: '#1f1207',
      },
      media: [
        { label: 'Screenshot 01' },
        { label: 'Screenshot 02' },
        { label: 'Workflow Demo' },
      ],
    },
  ]

  const whyChoose = [
    'Personal attention — You work directly with the engineer building your system.',
    'Custom solutions — Designed specifically for your business, not generic templates.',
    'Technical depth — Capable of handling complex or unusual requirements.',
    'Clear communication — No jargon required.',
    'Local understanding — We work with real-world businesses, not just tech companies.',
  ]

  const exampleProblems = [
    '“We track everything in spreadsheets and it’s breaking down.”',
    '“Our staff wastes hours on manual paperwork.”',
    '“We need a system tailored to our exact workflow.”',
    '“We have data but no way to use it.”',
    '“We need an app to log field data.”',
  ]

  const serviceColumns = [
    [
      'Custom internal tools',
      'Inventory management',
      'Data dashboards & reporting tools',
      'Customer portals',
      'Booking and reservation systems',
    ],
    [
      'iOS and Android apps',
      'Windows / macOS / Linux applications',
      'API development',
      'System integrations',
      'Data migration and cleanup',
      'Reporting automation',
      'Embedded systems & hardware software',
      'Simulation and visualization tools',
      'Custom algorithms',
    ],
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {import.meta.env.DEV && (
        <div className="fixed bottom-6 right-6 z-50 w-72 rounded-lg border border-white/10 bg-black/80 p-4 text-xs text-white/70 backdrop-blur">
          <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-white/50">
            Shader Dev
          </p>
          <label className="flex items-center justify-between gap-2">
            <span>Pause time</span>
            <input
              type="checkbox"
              checked={shaderDebug.paused}
              onChange={(event) =>
                setShaderDebug((prev) => ({
                  ...prev,
                  paused: event.target.checked,
                }))
              }
            />
          </label>
          <label className="mt-2 flex items-center justify-between gap-2">
            <span>Show UVs</span>
            <input
              type="checkbox"
              checked={shaderDebug.showUV}
              onChange={(event) =>
                setShaderDebug((prev) => ({
                  ...prev,
                  showUV: event.target.checked,
                }))
              }
            />
          </label>
          <label className="mt-2 flex items-center justify-between gap-2">
            <span>Low quality</span>
            <input
              type="checkbox"
              checked={shaderDebug.lowQuality}
              onChange={(event) =>
                setShaderDebug((prev) => ({
                  ...prev,
                  lowQuality: event.target.checked,
                }))
              }
            />
          </label>
          <div className="mt-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Surface
            </p>
            <label className="flex items-center justify-between gap-3">
              <span>Time scale</span>
              <input
                className="w-32"
                type="range"
                min="0.05"
                max="2"
                step="0.01"
                value={shaderDebug.timeScale}
                onChange={(event) =>
                  setShaderDebug((prev) => ({
                    ...prev,
                    timeScale: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Alpha</span>
              <input
                className="w-32"
                type="range"
                min="0.05"
                max="1"
                step="0.01"
                value={shaderDebug.alpha}
                onChange={(event) =>
                  setShaderDebug((prev) => ({
                    ...prev,
                    alpha: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Depth</span>
              <input
                className="w-32"
                type="range"
                min="0.1"
                max="0.95"
                step="0.01"
                value={shaderDebug.depth}
                onChange={(event) =>
                  setShaderDebug((prev) => ({
                    ...prev,
                    depth: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Edge</span>
              <input
                className="w-32"
                type="range"
                min="0.01"
                max="0.3"
                step="0.005"
                value={shaderDebug.edge}
                onChange={(event) =>
                  setShaderDebug((prev) => ({
                    ...prev,
                    edge: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Height</span>
              <input
                className="w-32"
                type="range"
                min="-0.3"
                max="0.3"
                step="0.005"
                value={shaderDebug.height}
                onChange={(event) =>
                  setShaderDebug((prev) => ({
                    ...prev,
                    height: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Waves
            </p>
            <label className="flex items-center justify-between gap-3">
              <span>Wave 1</span>
              <input
                className="w-32"
                type="range"
                min="2"
                max="24"
                step="0.1"
                value={shaderDebug.w1Scale}
                onChange={(event) =>
                  setShaderDebug((prev) => ({
                    ...prev,
                    w1Scale: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Wave 2</span>
              <input
                className="w-32"
                type="range"
                min="2"
                max="24"
                step="0.1"
                value={shaderDebug.w2Scale}
                onChange={(event) =>
                  setShaderDebug((prev) => ({
                    ...prev,
                    w2Scale: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Wave 3</span>
              <input
                className="w-32"
                type="range"
                min="2"
                max="24"
                step="0.1"
                value={shaderDebug.w3Scale}
                onChange={(event) =>
                  setShaderDebug((prev) => ({
                    ...prev,
                    w3Scale: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>
        </div>
      )}
      <header className="navbar-scene fixed left-0 right-0 top-0 z-40 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24">
          <WaterShader
            paused={shaderDebug.paused}
            timeScale={shaderDebug.timeScale}
            alpha={shaderDebug.alpha}
            depth={shaderDebug.depth}
            edge={shaderDebug.edge}
            height={shaderDebug.height}
            w1Scale={shaderDebug.w1Scale}
            w2Scale={shaderDebug.w2Scale}
            w3Scale={shaderDebug.w3Scale}
            className="h-full w-full"
          />
        </div>
        <div className="mx-auto max-w-6xl px-6 pt-4 text-[11px] italic text-black/70">
          “A distant lighthouse guides ships safely through unfamiliar waters.
          Contact us today!”
        </div>
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-6 pt-4">
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
            <a href="#projects" className="hover:text-black">
              Projects
            </a>
            <a href="#problems" className="hover:text-black">
              Problems
            </a>
            <a href="#services" className="hover:text-black">
              Services
            </a>
            <a href="#workflow" className="hover:text-black">
              Workflow
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
              Mercer, Maine • Software Contracting
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              This website was created in 3 hours.
            </h1>
            <div className="space-y-4 text-base text-white/70 sm:text-lg">
              <p>
                Based in Mercer, Maine, Distant Lighthouse is an independent
                software development firm with 10 years of computer science and
                software engineering experience. We offer faster solutions with
                cutting edge AI development practices.
              </p>
              <p>
                We specialize in solving problems that off-the-shelf software
                cannot.
              </p>
              <p>
                We partner with organizations of all sizes — from small local
                businesses to technical teams — and can collaborate with our
                partners at{' '}
                <a
                  href="https://goldensoft.llc"
                  className="text-white underline decoration-white/30 underline-offset-4 transition hover:text-white"
                >
                  Goldensoft
                </a>{' '}
                when projects require additional scale.
              </p>
            </div>
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

        <section id="projects" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Custom Projects
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Easily expandable projects with bespoke theming.
            </h2>
          </div>
          <div className="space-y-10">
            {projects.map((project) => (
              <article
                key={project.name}
                className="rounded-lg border p-8"
                style={{
                  background: `linear-gradient(135deg, ${project.theme.primary}, ${project.theme.secondary})`,
                  borderColor: project.theme.secondary,
                  color: project.theme.text,
                }}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                      Featured Project
                    </p>
                    <h3 className="text-2xl font-semibold sm:text-3xl">
                      {project.name}
                    </h3>
                    <p className="text-base text-black/70">
                      {project.description}
                    </p>
                  </div>
                  <div className="text-sm text-black/60">
                    Custom theming with two brand colors.
                  </div>
                </div>
                <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                  {project.media.map((item) => (
                    <div
                      key={item.label}
                      className="min-w-[220px] flex-1 rounded-md border border-black/10 bg-white/70 p-4 text-sm text-black/70"
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="problems" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Problems
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Build what off-the-shelf software cannot.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-3 text-lg font-semibold">The Problem</h3>
              <p className="text-sm text-white/70">
                Spreadsheet sprawl, manual paperwork, and scattered systems
                slow down teams and hide critical data.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-3 text-lg font-semibold">The Solution</h3>
              <p className="text-sm text-white/70">
                Purpose-built software that matches your workflows, connects
                systems, and turns data into actions.
              </p>
            </div>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Why Choose Distant Lighthouse</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {whyChoose.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Example Problems We Solve</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {exampleProblems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="text-sm text-white/70">
                If your organization says “There must be a better way,” we can
                build it.
              </p>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Services
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              What we build.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {serviceColumns.map((column, index) => (
              <div
                key={`service-column-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <ul className="space-y-3 text-sm text-white/70">
                  {column.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Workflow
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              How engagements work.
            </h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-2">
            {[
              'Initial consultation (no obligation)',
              'Problem definition and feature assessment',
              'Feature/progress definition in work tracking software',
              'Development with feedback',
              'Deployment and support',
            ].map((step) => (
              <li
                key={step}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70"
              >
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Contact
                </p>
                <h2 className="text-3xl font-semibold sm:text-4xl">
                  Ready to map the next build?
                </h2>
                <p className="text-base text-white/70">
                  Contact us for timelines, scoping, and the right technical
                  approach.
                </p>
                <div className="space-y-2 text-sm text-white/70">
                  <p>toryjleo@distantlighthouse.com</p>
                  <p>(207) 509-8613</p>
                  <a
                    href="mailto:toryjleo@distantlighthouse.com"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60"
                  >
                    Start the conversation
                  </a>
                </div>
                <div className="pt-4 text-sm text-white/60">
                  Social:{' '}
                  <a
                    href="https://linkedin.com/distant-lighthouse-llc"
                    className="text-white underline decoration-white/30 underline-offset-4 transition hover:text-white"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
              <form className="w-full max-w-md space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40"
                />
                <textarea
                  rows="4"
                  placeholder="Tell us about your project"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40"
                />
                <button
                  type="button"
                  className="w-full rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60"
                >
                  Request a consult
                </button>
              </form>
            </div>
            <div className="mt-12 border-t border-white/10 pt-8">
              <blockquote className="quote-block text-sm text-white/70">
                A stormy wind may drive sleet against inland meadows sufficiently
                to arouse sympathy for the men who patrol the streets; but seldom
                on such nights do thoughts of people nowadays drift to the men
                in solitary outposts of the seaboard who are confined to the
                narrow cabin of a lightship, or to those who watch in the towers
                of lighthouses perched on the bleak headlands of the coast or on
                sunken ledges. These men keep a quiet but effective watch which
                makes a naturally inhospitable coast at least a navigable one.
                Remote and unknown, they are the guardians of the coast; and man
                must still keep constant vigil against the treachery of wind and
                water.
              </blockquote>
              <p className="mt-4 text-xs text-white/50">
                LIGHTHOUSES OF THE MAINE COAST — Robert T. Sterling. 2nd edition,
                3rd printing. Copyright 1935, Steven Daye Press. Designed by
                John Hooper. Printed by Steven Daye Press, Brattleboro,
                Vermont, USA.
              </p>
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
