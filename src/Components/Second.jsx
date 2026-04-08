import { motion } from 'framer-motion'
import { FaAward, FaAws, FaBrain, FaCode, FaLaptopCode, FaMedal, FaMicrochip, FaPython, FaReact, FaRobot, FaServer } from 'react-icons/fa'
import { SiGeeksforgeeks, SiHackerrank, SiLeetcode } from 'react-icons/si'

import aiBadgeImg from '../../Certificate/Ai.png'
import awsCertificatePdf from '../../Certificate/AWS.pdf'
import frontendReactCertificatePdf from '../../Certificate/frontend_developer_react certificate.pdf'
import pythonCertificatePdf from '../../Certificate/Python.pdf'
import roboticsBadgeImg from '../../Certificate/Robotics.png'

const badges = [
  { title: 'Python', status: 'View Certificate', href: pythonCertificatePdf, Icon: FaPython },
  { title: 'Frontend Development', status: 'View Certificate', href: frontendReactCertificatePdf, Icon: FaReact },
  { title: 'AWS', status: 'View Certificate', href: awsCertificatePdf, Icon: FaAws },
  { title: 'Robotics', status: 'View Certificate', href: roboticsBadgeImg, Icon: FaRobot },
  { title: 'Generative AI', status: 'View Certificate', href: aiBadgeImg, Icon: FaMicrochip },
  {
    title: 'Problem Solver',
    Icon: FaBrain,
    links: [
      {
        label: 'LeetCode',
        href: 'https://leetcode.com/u/jainadi2309/',
        Icon: SiLeetcode,
        className: 'from-amber-400/25 via-orange-500/20 to-yellow-300/25 border-amber-300/50 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.35)] hover:shadow-[0_0_24px_rgba(249,115,22,0.55)]'
      },
      {
        label: 'GFG',
        href: 'https://www.geeksforgeeks.org/profile/jainaditrmzz?tab=activity',
        Icon: SiGeeksforgeeks,
        className: 'from-emerald-400/25 via-green-500/20 to-lime-300/25 border-emerald-300/50 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:shadow-[0_0_24px_rgba(34,197,94,0.55)]'
      }
    ]
  },
  {
    title: 'Badges',
    Icon: FaMedal,
    links: [
      {
        label: 'Hackerrank',
        href: 'https://www.hackerrank.com/profile/jainaditya2309',
        Icon: SiHackerrank,
        className: 'from-emerald-400/25 via-green-500/20 to-teal-300/25 border-emerald-300/50 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:shadow-[0_0_24px_rgba(16,185,129,0.55)]'
      },
      {
        label: 'Credly',
        href: 'https://www.credly.com/users/aditya-jain.611d9b0a/edit#credly',
        Icon: FaAward,
        className: 'from-sky-400/25 via-cyan-500/20 to-blue-300/25 border-sky-300/50 text-sky-100 shadow-[0_0_18px_rgba(56,189,248,0.35)] hover:shadow-[0_0_24px_rgba(59,130,246,0.55)]'
      }
    ]
  },
]

const skillJourney = [
  {
    title: 'Frontend',
    description: 'I turn ideas into interactive web experiences using HTML, CSS, JavaScript, and modern frameworks like React and Next.js. I enjoy crafting interfaces that feel smooth, intuitive, and actually enjoyable to use, not just something that looks good on screen.',
    Icon: FaLaptopCode,
  },
  {
    title: 'Backend',
    description: 'I develop scalable backend systems using Node.js and Express.js, with a strong focus on API design and performance. Skilled in managing databases like MongoDB, MySQL, and Supabase. I have hands-on experience integrating authentication, payment systems, and AI-driven features to build complete, production-ready applications.',
    Icon: FaServer,
  },
  {
    title: 'Coding Skills',
    description: 'I work with Java and Python to solve problems and build practical solutions. I have a good understanding of core concepts like logic building, object-oriented programming, and basic data structures. I try to keep my code simple, readable, and easy to manage.',
    Icon: FaCode,
  },
  {
    title: 'Robotic Engineering',
    description: 'Experienced in designing and programming robotic systems using embedded systems and IoT technologies. Skilled in integrating sensors, actuators, and microcontrollers to create intelligent and connected automation solutions.',
    Icon: FaRobot,
  },
]

const Second = () => {
  return (
    <motion.section
      id="skills"
      className="scroll-mt-24 relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 sm:px-6 lg:px-20 py-14 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-r from-purple-600/16 to-pink-600/16 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            rotate: -360,
            scale: [1.15, 1, 1.4, 1.15],
            x: [0, -80, 0],
            y: [0, 100, 0]
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-r from-violet-500/14 to-indigo-500/14 rounded-full blur-3xl"
        />

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`skills-particle-${i}`}
            className="absolute w-2 h-2 bg-purple-300/40 rounded-full"
            animate={{
              x: [0, Math.random() * 300 - 150],
              y: [0, Math.random() * 300 - 150],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
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
            backgroundSize: '60px 60px'
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [0, 3.5],
            opacity: [0.3, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        >
          <div className="w-32 h-32 border border-purple-400/20 rounded-full" />
        </motion.div>
      </div>

      <div className="relative max-w-6xl mx-auto text-center space-y-3">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Skills & Achievements</h2>
        <p className="text-gray-200 max-w-3xl mx-auto text-sm sm:text-base">
          Mastering tech skills and earning certifications through dedicated learning and hands-on projects.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {badges.map(({ title, status, href, links, Icon }, index) => (
          <motion.div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-center shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] min-h-[196px] flex flex-col"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(196,181,253,0.6)', boxShadow: '0 18px 40px -22px rgba(129,140,248,0.55)' }}
          >
            <motion.div
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/15 text-2xl"
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Icon />
            </motion.div>
            <h3 className="text-lg font-bold min-h-[56px] flex items-center justify-center leading-tight">{title}</h3>
            {links ? (
              <div className="mt-auto pt-2 flex flex-col gap-2 w-full">
                {links.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex w-full items-center justify-center gap-1.5 text-[10px] tracking-[0.04em] uppercase px-2 py-1.5 rounded-md border bg-gradient-to-r transition-all duration-300 ${item.className}`}
                  >
                    {item.Icon ? <item.Icon className="text-[11px]" /> : null}
                    {item.label}
                  </a>
                ))}
              </div>
            ) : href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-2 inline-flex mx-auto text-[11px] tracking-wide text-indigo-100 uppercase px-3 py-1.5 rounded-md border border-white/15 bg-white/5 hover:border-indigo-300/60"
              >
                {status}
              </a>
            ) : (
              <p className="mt-1 text-[11px] tracking-wide text-indigo-100 uppercase">{status}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto mt-10 bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-md shadow-[0_25px_60px_-40px_rgba(99,102,241,0.55)]">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-semibold">Skill Journey</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillJourney.map(({ title, description, Icon }, index) => (
            <motion.div
              key={title}
              className="group h-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-[0_20px_50px_-35px_rgba(0,0,0,0.6)] transition hover:-translate-y-1 hover:border-indigo-300/60"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(129,140,248,0.65)', boxShadow: '0 18px 45px -22px rgba(129,140,248,0.5)' }}
            >
              <div className="flex items-center gap-2 mb-3 text-indigo-200">
                <motion.span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-400/30"
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon />
                </motion.span>
              </div>
              <h4 className="text-lg font-semibold mb-2">{title}</h4>
              <p className="text-sm text-gray-200 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Second