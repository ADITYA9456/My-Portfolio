import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

const menuItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#footer' }
]

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const { scrollY, scrollYProgress } = useScroll()
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  // The bar stays transparent over the hero and turns solid once the hero is behind it.
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > window.innerHeight - 96)
  })

  useEffect(() => {
    const ids = menuItems.map((item) => item.href.slice(1))
    const onScroll = () => {
      const line = window.innerHeight * 0.4
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'footer'
      setActive('#' + current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const riseVariants = {
    initial: { y: 12, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.08 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    })
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  }

  return (
    <>
      <motion.nav
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        className={`fixed top-0 w-full z-50 transition-colors duration-500 border-b ${
          isScrolled || isMobileMenuOpen
            ? 'bg-night/95 border-rule'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="flex justify-between items-center h-16 px-6 lg:px-12">
          {/* Logo */}
          <a
            href="#home"
            className="font-serif text-[34px] leading-none tracking-tight text-paper opacity-90 hover:opacity-100 focus-visible:opacity-100 hover:underline focus-visible:underline underline-offset-4 transition-opacity duration-300"
          >
            AJ
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-8">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  variants={riseVariants}
                  initial="initial"
                  animate="animate"
                  custom={index}
                >
                  <a
                    href={item.href}
                    aria-current={active === item.href ? 'true' : undefined}
                    className={`relative px-2 py-2 text-sm transition-colors duration-300 hover:text-paper ${active === item.href ? 'text-paper' : 'text-paper/60'}`}
                  >
                    {item.name}
                    {active === item.href && (
                      <motion.span layoutId="nav-underline" className="absolute left-0 right-0 -bottom-0.5 h-px bg-paper" />
                    )}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col justify-center items-center w-8 h-8 cursor-pointer relative z-10"
            >
              <span
                className={`w-6 h-0.5 bg-paper block transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-[6px] rotate-45' : ''}`}
              />
              <span
                className={`w-6 h-0.5 bg-paper block mt-1 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`w-6 h-0.5 bg-paper block mt-1 transition-transform duration-300 ${isMobileMenuOpen ? '-translate-y-[6px] -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-tech"
          style={{ scaleX: progressScale }}
        />

        {/* Mobile Menu */}
        <motion.div
          variants={mobileMenuVariants}
          initial="closed"
          animate={isMobileMenuOpen ? "open" : "closed"}
          className="md:hidden overflow-hidden bg-night border-t border-rule"
        >
          <ul className="flex flex-col py-4">
            {menuItems.map((item) => (
              <li key={item.name} className="mx-4 my-1">
                <a
                  href={item.href}
                  className="block px-6 py-3 text-paper/80 hover:text-paper transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.nav>

      {/* Contact Button for Mobile Menu */}
      <motion.div
        variants={mobileMenuVariants}
        initial="closed"
        animate={isMobileMenuOpen ? "open" : "closed"}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 md:hidden overflow-hidden"
      >
        <a
          href="#footer"
          className="block px-8 py-3 bg-surface text-ink rounded-full font-medium ring-1 ring-line"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Contact Me
        </a>
      </motion.div>
    </>
  )
}

export default Navbar
