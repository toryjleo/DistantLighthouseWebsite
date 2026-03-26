import { motion } from 'framer-motion'

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
  ],
  [
    'Reporting automation',
    'Embedded systems & hardware software',
    'Simulation and visualization tools',
    'Custom algorithms',
  ],
]

export default function Services() {
  return (
    <motion.section
      className="mx-auto max-w-6xl px-6 py-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mb-12 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Services
        </p>
        <h2 className="text-3xl font-semibold sm:text-4xl">
          What we build.
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {serviceColumns.map((column, index) => (
          <motion.div
            key={`service-column-${index}`}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
            whileHover={{ y: -4, boxShadow: '0 0 20px rgba(255,255,255,0.08)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.ul
              className="space-y-3 text-sm text-white/70"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.08 }}
            >
              {column.map((item) => (
                <motion.li
                  key={item}
                  variants={{
                    hidden: { opacity: 0, x: -15 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-20">
        <div className="mb-12 space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Workflow
          </p>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            How engagements work.
          </h2>
        </div>
        <motion.ol
          className="flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            'Initial consultation (no obligation)',
            'Problem definition and feature assessment',
            'Feature/progress definition in work tracking software',
            'Development with feedback',
            'Deployment and support',
          ].map((step, i) => (
            <motion.li
              key={step}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-lg text-white/70"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -4, boxShadow: '0 0 20px rgba(255,255,255,0.08)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="font-semibold text-white">{i + 1}.</span> {step}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </motion.section>
  )
}
