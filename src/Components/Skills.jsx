import { motion } from 'framer-motion'
import { FaAward, FaAws, FaBrain, FaCode, FaLaptopCode, FaMedal, FaMicrochip, FaPython, FaReact, FaRobot, FaServer } from 'react-icons/fa'
import { SiGeeksforgeeks, SiHackerrank, SiLeetcode, SiUdemy } from 'react-icons/si'

const aiBadgeImg = '/Certificate/Ai.png'
const awsCertificatePdf = '/Certificate/AWS.pdf'
const frontendReactCertificatePdf = '/Certificate/frontend_developer_react%20certificate.pdf'
const pythonCertificatePdf = '/Certificate/Python.pdf'
const roboticsBadgeImg = '/Certificate/Robotics.png'
const udemyGenerativeAiCertificatePdf = '/Certificate/udemy%20generative%20ai.pdf'

const badges = [
  { title: 'Python', status: 'View Certificate', href: pythonCertificatePdf, Icon: FaPython },
  { title: 'Frontend Development', status: 'View Certificate', href: frontendReactCertificatePdf, Icon: FaReact },
  { title: 'AWS', status: 'View Certificate', href: awsCertificatePdf, Icon: FaAws },
  { title: 'Robotics', status: 'View Certificate', href: roboticsBadgeImg, Icon: FaRobot },
  {
    title: 'Generative AI',
    Icon: FaMicrochip,
    links: [
      {
        label: 'Certificate',
        href: aiBadgeImg,
        Icon: FaAward,
      },
      {
        label: 'Certificate',
        href: udemyGenerativeAiCertificatePdf,
        Icon: SiUdemy
      }
    ]
  },
  {
    title: 'Problem Solver',
    Icon: FaBrain,
    links: [
      {
        label: 'LeetCode',
        href: 'https://leetcode.com/u/jainadi2309/',
        Icon: SiLeetcode,
      },
      {
        label: 'GFG',
        href: 'https://www.geeksforgeeks.org/profile/jainaditrmzz?tab=activity',
        Icon: SiGeeksforgeeks
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
      },
      {
        label: 'Credly',
        href: 'https://www.credly.com/users/aditya-jain.611d9b0a/edit#credly',
        Icon: FaAward
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

const linkClass = 'inline-flex w-full items-center justify-center gap-1.5 font-mono text-[10px] tracking-[0.04em] uppercase px-2 py-1.5 rounded-md border border-rule text-paper/80 transition-colors duration-300 hover:border-tech hover:text-paper'

const Skills = () => {
  return (
    <motion.section
      id="skills"
      className="scroll-mt-24 relative isolate px-4 sm:px-6 lg:px-20 py-14 text-paper"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 'some', margin: '0px 0px -10% 0px' }}
    >
      <div className="relative max-w-6xl mx-auto text-center space-y-3">
        <h2 className="text-3xl sm:text-5xl font-normal tracking-tight">Skills & Achievements</h2>
        <motion.div className="mx-auto h-px w-32 bg-tech" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
        <p className="text-paper/70 max-w-3xl mx-auto text-sm sm:text-base">
          Mastering tech skills and earning certifications through dedicated learning and hands-on projects.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {badges.map(({ title, status, href, links, Icon }, index) => (
          <motion.div
            key={title}
            className="rounded-2xl border border-rule bg-paper/5 p-4 text-center min-h-[196px] flex flex-col transition-colors duration-300 hover:border-paper/30"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, transition: { duration: 0.25, delay: 0 } }}
          >
            <motion.div
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-rule text-2xl text-dots"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Icon />
            </motion.div>
            <h3 className="text-lg font-medium min-h-[56px] flex items-center justify-center leading-tight">{title}</h3>
            {links ? (
              <div className="mt-auto pt-2 flex flex-col gap-2 w-full">
                {links.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
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
                className="mt-auto pt-2 inline-flex mx-auto font-mono text-[11px] tracking-wide text-paper/80 uppercase px-3 py-1.5 rounded-md border border-rule transition-colors duration-300 hover:border-tech hover:text-paper"
              >
                {status}
              </a>
            ) : (
              <p className="mt-1 font-mono text-[11px] tracking-wide text-paper/80 uppercase">{status}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto mt-10 bg-paper/5 border border-rule rounded-3xl p-5">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-medium">Skill Journey</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillJourney.map(({ title, description, Icon }, index) => (
            <motion.div
              key={title}
              className="group h-full rounded-2xl border border-rule bg-paper/5 p-4 transition-colors duration-300 hover:border-paper/30"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.25, delay: 0 } }}
            >
              <div className="flex items-center gap-2 mb-3 text-dots">
                <motion.span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rule"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Icon />
                </motion.span>
              </div>
              <h4 className="text-lg font-medium mb-2">{title}</h4>
              <p className="text-sm text-paper/70 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Skills