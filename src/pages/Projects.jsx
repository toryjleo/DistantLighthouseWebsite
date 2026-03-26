import { motion } from 'framer-motion'
import ProjectCard from '../components/Projects/ProjectCard'
import projects from '../data/projects'

export default function Projects() {
  return (
    <motion.section
      className="mx-auto max-w-6xl px-6 py-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mb-12 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Customer Projects
        </p>
        <h2 className="text-3xl font-semibold sm:text-4xl"></h2>
      </div>
      <div className="space-y-10">
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            name={project.name}
            description={project.description}
            details={project.details}
            theme={project.theme}
            media={project.media}
            links={project.links}
          />
        ))}
      </div>
    </motion.section>
  )
}
