import { motion } from 'framer-motion'
import { FaArrowRight, FaExternalLinkAlt, FaGithub, FaRocket } from 'react-icons/fa'

const projects = [
  {
    title: 'EduOrbit',
    image: 'gif/edunexes.gif',
    description: 'AI-powered modern EdTech platform for coding contests, video learning, leaderboards, and profiles.',
    tags: ['Next.js', 'Supabase', 'NextAuth.js'],
    accent: 'from-sky-400 to-indigo-500',
    glow: 'shadow-[0_0_40px_rgba(56,189,248,0.35)]',
    button: 'from-blue-600/90 to-indigo-600/90 border-blue-300/40',
    sourceLink: 'https://github.com/ADITYA9456/EduOrbit',
    liveLink: 'https://edu-orbit-alpha.vercel.app/home'
  },
  {
    title: 'BuildupX',
    image: 'gif/build.gif',
    description: 'AI-powered fitness and nutrition app with analytics, meal logging, and personalized diet planning.',
    tags: ['React', 'MongoDB', 'Tailwind CSS'],
    accent: 'from-emerald-400 to-teal-500',
    glow: 'shadow-[0_0_45px_rgba(52,211,153,0.35)]',
    button: 'from-emerald-600/90 to-teal-600/90 border-emerald-300/40',
    sourceLink: 'https://github.com/ADITYA9456/BuildupX',
    liveUnavailable: true
  },
  {
    title: 'OptiFlow',
    image: 'gif/optiflow.gif',
    description: 'Task management SaaS with JWT auth, roles, and powerful admin/user productivity workflows.',
    tags: ['Next.js', 'Node.js', 'MongoDB'],
    accent: 'from-fuchsia-400 to-pink-500',
    glow: 'shadow-[0_0_45px_rgba(232,121,249,0.35)]',
    button: 'from-fuchsia-600/90 to-pink-600/90 border-fuchsia-300/40',
    sourceLink: 'https://github.com/ADITYA9456/optiflow',
    liveUnavailable: true
  }
]

const Second = () => {
  const cardTransition = { duration: 0.45, ease: 'easeOut' }

  return (
    <motion.section
      id="projects"
      className="scroll-mt-24 relative isolate overflow-hidden min-h-screen py-16 px-4 sm:px-6 lg:px-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.28, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-r from-fuchsia-500/15 to-violet-500/15 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            rotate: -360,
            scale: [1.15, 1, 1.45, 1.15],
            x: [0, -80, 0],
            y: [0, 100, 0]
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-500/12 to-purple-500/12 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            rotate: 180,
            scale: [1, 1.35, 1],
            x: [0, -120, 0],
            y: [0, -80, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-500/8 to-fuchsia-500/10 rounded-full blur-2xl"
        />

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`project-particle-${i}`}
            className="absolute w-2 h-2 bg-purple-300/40 rounded-full"
            animate={{
              x: [0, Math.random() * 320 - 160],
              y: [0, Math.random() * 320 - 160],
              opacity: [0, 0.85, 0],
              scale: [0, 1.4, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'easeInOut'
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}

        <motion.div
          animate={{
            rotate: 360,
            x: [0, 200, -100, 0],
            y: [0, -150, 100, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute top-1/4 left-1/4 w-16 h-16 border border-purple-400/20 rotate-45"
        />

        <motion.div
          animate={{
            rotate: -360,
            x: [0, -150, 200, 0],
            y: [0, 100, -80, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-gradient-to-r from-pink-500/15 to-purple-500/15 rounded-full blur-sm"
        />

        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            backgroundImage: `
              linear-gradient(90deg, #8b5cf6 1px, transparent 1px),
              linear-gradient(0deg, #8b5cf6 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [0, 4],
            opacity: [0.35, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        >
          <div className="w-40 h-40 border border-violet-400/20 rounded-full" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ y: 16, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-300/35 bg-violet-500/15 text-violet-100 font-medium">
            <FaRocket className="text-violet-200" />
            <span>Featured Work</span>
          </div>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
            <span className="mr-2 text-3xl align-middle">🚀</span>
            <span className="align-middle">My Projects</span>
          </h2>
          <p className="mt-3 text-gray-200/90 text-lg max-w-2xl mx-auto">A showcase of innovative solutions built using modern technologies</p>
          <div className="mt-5 mx-auto h-1 w-40 rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400" />
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                className={`group relative rounded-3xl border border-white/20 bg-slate-900/35 backdrop-blur-md p-5 overflow-hidden ${project.glow}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...cardTransition, delay: index * 0.12 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.015, borderColor: 'rgba(196,181,253,0.55)' }}
              >
                <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${project.accent}`} />
                <motion.div
                  className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-white/70 border-2 border-slate-900/70"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />

                <motion.div
                  className="rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-slate-900/75 to-slate-800/70 p-2"
                  whileHover={{ boxShadow: '0 20px 40px -20px rgba(139,92,246,0.45)' }}
                >
                  {project.image ? (
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 object-contain rounded-xl"
                      loading="lazy"
                      decoding="async"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    />
                  ) : (
                    <div className={`w-full h-40 flex items-center justify-center bg-gradient-to-br ${project.accent}`}>
                      {project.Icon ? <project.Icon className="text-white text-7xl drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]" /> : null}
                    </div>
                  )}
                </motion.div>

                <motion.h3
                  className={`mt-4 text-4xl font-black bg-gradient-to-r ${project.accent} bg-clip-text text-transparent`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {project.title}
                </motion.h3>
                <p className="mt-3 text-gray-200/90 text-lg leading-relaxed">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full border border-white/20 bg-white/10 text-slate-100 font-semibold"
                      whileHover={{ y: -2, scale: 1.03, borderColor: 'rgba(196,181,253,0.7)' }}
                      transition={{ duration: 0.2 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {project.liveUnavailable ? (
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-gradient-to-r text-white font-semibold cursor-not-allowed opacity-85 ${project.button}`}
                      title="404 Not Found - Available Soon"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      <span>Live Demo (Soon)</span>
                    </button>
                  ) : (
                    <motion.a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-gradient-to-r text-white font-semibold ${project.button}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      <span>Live Demo</span>
                      <FaArrowRight className="text-xs" />
                    </motion.a>
                  )}
                  <motion.a
                    href={project.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300/35 bg-slate-900/60 text-white font-semibold hover:border-violet-300/60 transition-colors"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FaGithub className="text-sm" />
                    <span>Source Code</span>
                  </motion.a>
                </div>
                {project.liveUnavailable ? (
                  <p className="mt-2 text-xs font-semibold text-amber-200/90">404 Not Found - Available Soon</p>
                ) : null}
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="rounded-3xl border border-amber-300/35 bg-gradient-to-br from-slate-900/70 to-slate-800/70 backdrop-blur-md p-6 shadow-[0_0_35px_rgba(251,146,60,0.25)]" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} whileHover={{ y: -8, scale: 1.015, borderColor: 'rgba(252,211,77,0.7)', boxShadow: '0 30px 60px -25px rgba(251,146,60,0.55)' }} transition={{ duration: 0.35, ease: 'easeOut' }}>
            <h3 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">Project Showcase Website</h3>
            <p className="mt-4 text-lg text-gray-200/90 leading-relaxed">A dedicated website featuring <strong>video demos</strong>, <strong>live previews</strong>, <strong>source code</strong>, and detailed documentation for all my projects.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Videos', 'Links', 'Code'].map((item) => (
                <span key={item} className="px-3 py-1 rounded-full border border-white/20 bg-white/10 text-slate-100 text-xs font-semibold">{item}</span>
              ))}
            </div>
            <motion.a
              href="https://my-projects-rho-wine.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-amber-300/45 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 18px 35px -14px rgba(249,115,22,0.65)' }}
              whileTap={{ scale: 0.97 }}
            >
              <FaRocket className="text-sm group-hover:rotate-12 transition-transform duration-300" />
              <span>Visit Showcase</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
          </motion.div>

          <motion.div className="rounded-3xl border border-indigo-300/30 bg-gradient-to-br from-slate-900/70 to-slate-800/70 backdrop-blur-md p-6 shadow-[0_0_35px_rgba(99,102,241,0.25)]" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} whileHover={{ y: -8, scale: 1.015, borderColor: 'rgba(165,180,252,0.72)', boxShadow: '0 30px 60px -25px rgba(99,102,241,0.55)' }} transition={{ duration: 0.35, ease: 'easeOut' }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-600/50 to-violet-600/50 border border-indigo-300/35 flex items-center justify-center">
              <FaGithub className="text-3xl text-indigo-100" />
            </div>
            <h3 className="mt-4 text-4xl font-black text-white">Explore More Projects</h3>
            <p className="mt-3 text-lg text-gray-300">I have created many more projects. Check out complete collection of innovative solutions on GitHub.</p>
            <motion.a
              href="https://github.com/jainaditya2309"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-500 bg-black/55 text-white font-bold transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2, borderColor: 'rgba(165,180,252,0.8)', boxShadow: '0 18px 35px -14px rgba(99,102,241,0.55)' }}
              whileTap={{ scale: 0.97 }}
            >
              <FaGithub className="text-xl group-hover:scale-110 transition-transform duration-300" />
              <span>Visit My GitHub</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default Second