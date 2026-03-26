import { motion } from 'framer-motion'

export default function Contact() {
  const handleConsultSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()
    const bodyLines = [
      `Name: ${name || 'Not provided'}`,
      `Email: ${email || 'Not provided'}`,
      '',
      message || 'No project details provided.',
    ]
    const mailto = [
      'mailto:toryjleo@distantlighthouse.com',
      `?subject=${encodeURIComponent('Consultation request')}`,
      `&body=${encodeURIComponent(bodyLines.join('\n'))}`,
    ].join('')
    window.location.href = mailto
  }

  return (
    <motion.section
      className="mx-auto max-w-6xl px-6 py-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
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
            <div className="hidden pt-4 text-sm text-white/60 lg:block">
              <a
                href="https://linkedin.com/company/distant-lighthouse-llc/"
                className="inline-flex items-center text-white underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                <img
                  src="/Badges/LI-Logo.png"
                  alt="LinkedIn"
                  className="h-4 w-auto"
                />
              </a>
            </div>
          </div>
          <form className="w-full max-w-md space-y-4" onSubmit={handleConsultSubmit}>
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40"
            />
            <textarea
              rows="4"
              placeholder="Tell us about your project"
              name="message"
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40"
            />
            <button
              type="submit"
              className="w-full rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60"
            >
              Request a consult
            </button>
            <div className="pt-2 text-center text-sm text-white/60 lg:hidden">
              <a
                href="https://linkedin.com/company/distant-lighthouse-llc/"
                className="inline-flex items-center justify-center text-white underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                <img
                  src="/Badges/LI-Logo.png"
                  alt="LinkedIn"
                  className="h-4 w-auto"
                />
              </a>
            </div>
          </form>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <blockquote className="quote-block text-sm text-white/70">
            "A stormy wind may drive sleet against inland meadows sufficiently
            to arouse sympathy for the men who patrol the streets; but seldom
            on such nights do thoughts of people nowadays drift to the men
            in solitary outposts of the seaboard who are confined to the
            narrow cabin of a lightship, or to those who watch in the towers
            of lighthouses perched on the bleak headlands of the coast or on
            sunken ledges. These men keep a quiet but effective watch which
            makes a naturally inhospitable coast at least a navigable one.
            Remote and unknown, they are the guardians of the coast; and man
            must still keep constant vigil against the treachery of wind and
            water."
          </blockquote>
          <p className="mt-4 text-xs text-white/50">
            LIGHTHOUSES OF THE MAINE COAST — Robert T. Sterling.
          </p>
        </div>
      </div>
    </motion.section>
  )
}
