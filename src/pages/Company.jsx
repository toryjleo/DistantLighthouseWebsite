import { motion } from 'framer-motion'
import TeamProfile from '../components/TeamProfile'

const companyMembers = [
  {
    name: 'Tory Leo',
    image: '/Distant Lighthouse_ICON - B&W.jpg',
    position: 'Founder, Software Engineer',
    description:
      '"I love computer graphics. Computer graphics is the computing subject I know the most about. It ties into another interest of mine: algorithms and data structures."',
  },
  {
    name: 'Joe Golden',
    image: '/Distant Lighthouse_ICON - B&W.jpg',
    position: 'Software Engineer',
    description:
      'Joe focuses on building dependable software systems that are practical to ship, maintain, and scale for real client use.',
  },
]

export default function Company() {
  return (
    <motion.section
      className="mx-auto max-w-6xl px-6 py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mb-12 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Company</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Meet Distant Lighthouse</h1>
      </div>

      <div className="space-y-10">
        {companyMembers.map((member, index) => (
          <TeamProfile key={member.name} index={index} {...member} />
        ))}
      </div>
    </motion.section>
  )
}
