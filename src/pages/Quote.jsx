import { motion } from 'framer-motion'

export default function Quote() {
  return (
    <motion.section
      className="mx-auto max-w-5xl px-6 py-24"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
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
    </motion.section>
  )
}
