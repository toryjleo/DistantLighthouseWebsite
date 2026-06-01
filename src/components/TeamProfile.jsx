import { motion } from 'framer-motion'

export default function TeamProfile({ image, name, position, description, index }) {
  const isEven = index % 2 === 0

  return (
    <motion.article
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 sm:p-8"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
    >
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className={isEven ? 'order-1' : 'order-1 md:order-2'}>
          <img
            src={image}
            alt={name}
            className="h-full w-full rounded-2xl border border-white/10 object-cover"
            loading="lazy"
          />
        </div>

        <div className={isEven ? 'order-2' : 'order-2 md:order-1'}>
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">{position}</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{name}</h2>
          <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>
        </div>
      </div>
    </motion.article>
  )
}
