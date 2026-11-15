import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'

const menuItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' }
]

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // The bar stays transparent over the hero and turns solid once the hero is behind it.
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > window.innerHeight - 96)
  })

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
            className="font-serif text-[26px] leading-none text-paper opacity-90 hover:opacity-100 focus-visible:opacity-100 hover:underline focus-visible:underline underline-offset-4 transition-opacity duration-300"
          >
            Aditya&apos;s Portfolio
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
                    className="px-2 py-2 text-sm text-paper/70 hover:text-paper transition-colors duration-300"
                  >
                    {item.name}
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

      {/* Floating Contact Button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50"
      >
        <a
          href="#footer"
          className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-surface text-ink rounded-full ring-1 ring-line shadow-[0_10px_24px_-12px_#0006] transition-opacity duration-300 hover:opacity-90"
          aria-label="Contact Me"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>

          {/* Tooltip */}
          <span className="pointer-events-none absolute right-20 hidden sm:block bg-surface text-ink font-mono text-xs tracking-wide px-3 py-2 rounded-md whitespace-nowrap ring-1 ring-line opacity-0 translate-x-2 transition duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
            Contact Me
          </span>
        </a>
      </motion.div>

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
