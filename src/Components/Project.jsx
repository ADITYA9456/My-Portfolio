import { motion } from 'framer-motion'
import { FaArrowRight, FaExternalLinkAlt, FaGithub, FaRocket } from 'react-icons/fa'

const projects = [
  {
    title: 'EduOrbit',
    image: 'gif/edunexes.gif',
    description: 'AI-powered modern EdTech platform for coding contests, video learning, leaderboards, and profiles.',
    tags: ['Next.js', 'Supabase', 'NextAuth.js'],
    sourceLink: 'https://github.com/ADITYA9456/EduOrbit',
    liveLink: 'https://edu-orbit-alpha.vercel.app/home'
  },
  {
    title: 'BuildupX',
    image: 'gif/build.gif',
    description: 'AI-powered fitness and nutrition app with analytics, meal logging, and personalized diet planning.',
    tags: ['React', 'MongoDB', 'Tailwind CSS'],
    sourceLink: 'https://github.com/ADITYA9456/BuildupX',
    liveUnavailable: true
  },
  {
    title: 'OptiFlow',
    image: 'gif/optiflow.gif',
    description: 'Task management SaaS with JWT auth, roles, and powerful admin/user productivity workflows.',
    tags: ['Next.js', 'Node.js', 'MongoDB'],
    sourceLink: 'https://github.com/ADITYA9456/optiflow',
    liveLink: 'https://optiflow-steel.vercel.app/'
  }
]

const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
}

const cardClass = 'rounded-2xl border border-rule bg-paper/5 p-6 transition-colors duration-300 hover:border-paper/30'
const tagClass = 'px-3 py-1 font-mono text-xs rounded-full border border-rule text-paper/80'
const primaryButtonClass = 'inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface text-ink font-medium ring-1 ring-line transition-opacity duration-300 hover:opacity-90'
const ghostButtonClass = 'inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-paper/30 text-paper font-medium hover:border-paper hover:bg-paper/10 transition-colors duration-300'

const Second = () => {
  const cardTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] }

  return (
    <motion.section
      id="projects"
      className="scroll-mt-24 relative isolate min-h-screen py-16 px-4 sm:px-6 lg:px-20 text-paper"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div className="text-center mb-10" {...rise}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rule text-tech font-mono text-xs uppercase tracking-[0.12em]">
            <FaRocket />
            <span>Featured Work</span>
          </div>
          <h2 className="mt-4 text-4xl sm:text-5xl font-normal tracking-tight text-paper">
            My Projects
          </h2>
          <p className="mt-3 text-paper/70 text-lg max-w-2xl mx-auto">A showcase of innovative solutions built using modern technologies</p>
          <div className="mt-5 mx-auto h-px w-40 bg-tech" />
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                className={`group relative overflow-hidden ${cardClass}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...cardTransition, delay: index * 0.12 }}
                viewport={{ once: true }}
              >
                <div className="rounded-xl overflow-hidden border border-rule bg-night p-2">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 object-contain rounded-lg"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-paper/5">
                      {project.Icon ? <project.Icon className="text-dots text-7xl" /> : null}
                    </div>
                  )}
                </div>

                <h3 className="mt-4 text-4xl font-normal tracking-tight text-paper">
                  {project.title}
                </h3>
                <p className="mt-3 text-paper/70 text-lg leading-relaxed">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className={tagClass}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {project.liveUnavailable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-paper/20 text-paper/60 font-medium cursor-not-allowed"
                      title="404 Not Found - Available Soon"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      <span>Live Demo (Soon)</span>
                    </button>
                  ) : (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={primaryButtonClass}
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      <span>Live Demo</span>
                      <FaArrowRight className="text-xs" />
                    </a>
                  )}
                  <a
                    href={project.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ghostButtonClass}
                  >
                    <FaGithub className="text-sm" />
                    <span>Source Code</span>
                  </a>
                </div>
                {project.liveUnavailable ? (
                  <p className="mt-2 font-mono text-xs text-muted">404 Not Found - Available Soon</p>
                ) : null}
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className={cardClass} {...rise} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <h3 className="text-4xl font-normal tracking-tight text-paper">Project Showcase Website</h3>
            <p className="mt-4 text-lg text-paper/70 leading-relaxed">A dedicated website featuring <strong className="font-medium text-paper">video demos</strong>, <strong className="font-medium text-paper">live previews</strong>, <strong className="font-medium text-paper">source code</strong>, and detailed documentation for all my projects.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Videos', 'Links', 'Code'].map((item) => (
                <span key={item} className={tagClass}>{item}</span>
              ))}
            </div>
            <a
              href="https://my-projects-rho-wine.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group mt-5 px-5 py-3 ${primaryButtonClass}`}
            >
              <FaRocket className="text-sm" />
              <span>Visit Showcase</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </motion.div>

          <motion.div className={cardClass} {...rise} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <div className="w-16 h-16 rounded-2xl border border-rule flex items-center justify-center">
              <FaGithub className="text-3xl text-dots" />
            </div>
            <h3 className="mt-4 text-4xl font-normal tracking-tight text-paper">Explore More Projects</h3>
            <p className="mt-3 text-lg text-paper/70">I have created many more projects. Check out complete collection of innovative solutions on GitHub.</p>
            <a
              href="https://github.com/jainaditya2309"
              target="_blank"
              rel="noopener noreferrer"
              className={`group mt-5 px-5 py-3 ${ghostButtonClass}`}
            >
              <FaGithub className="text-xl" />
              <span>Visit My GitHub</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default Second