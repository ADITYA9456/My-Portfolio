import { motion } from 'framer-motion'
import { FaAws, FaBrain, FaCode, FaLaptopCode, FaMicrochip, FaPython, FaReact, FaRobot, FaServer } from 'react-icons/fa'
import { SiGeeksforgeeks, SiLeetcode } from 'react-icons/si'

import aiBadgeImg from '../../Certificate/Ai.png'
import awsCertificatePdf from '../../Certificate/AWS.pdf'
import frontendReactCertificatePdf from '../../Certificate/frontend_developer_react certificate.pdf'
import pythonCertificatePdf from '../../Certificate/Python.pdf'
import roboticsBadgeImg from '../../Certificate/Robotics.png'
import Second from './Project'

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
]

const skillJourney = [
  {
    title: 'Frontend Developer',
    description: 'Skilled in creating responsive, user-friendly web interfaces using HTML, CSS, JavaScript, and modern frameworks like React. I focus on delivering visually appealing and optimized designs for seamless user experiences.',
    Icon: FaLaptopCode,
  },
  {
    title: 'Backend Developer',
    description: 'Experienced in building secure, scalable, and efficient server-side applications. Proficient in languages like Node.js, Python, or PHP, with expertise in databases and APIs to ensure seamless functionality.',
    Icon: FaServer,
  },
  {
    title: 'Coding Skills',
    description: 'Familiar with Java fundamentals, including syntax, object-oriented programming concepts, loops, conditional statements, and basic exception handling. Capable of writing efficient programs.',
    Icon: FaCode,
  },
  {
    title: 'Robotic Engineering',
    description: 'Experienced in designing and programming robotic systems using embedded systems and IoT technologies. Skilled in integrating sensors, actuators, and microcontrollers to create intelligent and connected automation solutions.',
    Icon: FaRobot,
  },
]

const MySkillsSection = () => {
  return (
    <motion.section
      id="skills"
      className="scroll-mt-24 relative overflow-hidden bg-transparent px-4 sm:px-6 lg:px-20 py-14 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-10 w-72 h-72 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute -bottom-24 right-6 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center space-y-3">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Skills & Achievements</h2>
        <p className="text-gray-200 max-w-3xl mx-auto text-sm sm:text-base">
          Mastering tech skills and earning certifications through dedicated learning and hands-on projects.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
              <div className="mt-auto pt-2 flex justify-center gap-2">
                {links.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-md border bg-gradient-to-r transition-all duration-300 ${item.className}`}
                  >
                    {item.Icon ? <item.Icon className="text-xs" /> : null}
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