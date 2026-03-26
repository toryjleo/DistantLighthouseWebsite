import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section
      className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-20"
    >
      <motion.div
        className="max-w-2xl space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">
          Mercer, Maine • Software Contracting
        </p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Clear, Durable Custom Software.
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
          <p>We hire top talent from:</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="inline-flex items-center rounded bg-white px-2 py-1.5">
              <img
                src="/Badges/AMD_Logo.svg.png"
                alt="AMD"
                className="h-8 w-auto"
              />
            </span>
            <img
              src="/Badges/ANSYS Logo.png"
              alt="ANSYS"
              className="h-10 w-auto"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/contact"
            className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60"
          >
            Start a project
          </Link>
          <Link
            to="/services"
            className="rounded-full border border-white/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
          >
            View services
          </Link>
        </div>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black to-black" />
    </section>
  )
}
