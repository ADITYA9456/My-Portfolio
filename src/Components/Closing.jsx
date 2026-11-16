import { motion } from 'framer-motion'
import { FaArrowRight, FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { ease, rise, stagger } from './motionPresets'

const EMAIL = 'jainaditya2309@gmail.com'

const links = [
  { label: 'GitHub', href: 'https://github.com/ADITYA9456', Icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aditya-jain-3211a8257', Icon: FaLinkedin },
  { label: 'WhatsApp', href: 'https://wa.me/+919456266491', Icon: FaWhatsapp },
]

const Closing = () => (
  <motion.section
    id="contact"
    className="relative px-6 py-28 text-center scroll-mt-16"
    variants={stagger(0.12)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.4 }}
  >
    <motion.p variants={rise} className="font-mono text-xs uppercase tracking-[0.2em] text-tech mb-6">
      Available for work
    </motion.p>
    <motion.h2
      variants={rise}
      className="font-serif text-5xl lg:text-7xl leading-[1.05] tracking-tight text-paper max-w-3xl mx-auto"
    >
      Let&apos;s build something together.
    </motion.h2>
    <motion.p variants={rise} className="mt-6 text-paper/60 max-w-md mx-auto">
      Got an idea, a role or a project in mind? Send me a note and let&apos;s talk about it.
    </motion.p>

    <motion.div variants={rise} className="mt-10 flex flex-col items-center gap-8">
      <motion.a
        href={`mailto:${EMAIL}`}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.25, ease }}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-surface text-ink font-medium ring-1 ring-line"
      >
        Say hello <FaArrowRight className="-rotate-45" />
      </motion.a>

      <div className="flex items-center gap-4">
        {links.map(({ label, href, Icon }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ y: -4 }}
            className="p-3 border border-rule rounded-xl text-paper/80 hover:border-tech hover:text-paper transition-colors duration-300"
          >
            <Icon className="text-xl" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  </motion.section>
)

export default Closing
