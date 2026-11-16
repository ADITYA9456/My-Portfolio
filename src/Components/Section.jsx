import { motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import Button from './Button'
import { float, rise as riseVariants, stagger } from './motionPresets'
import TypeScript from './TypeScript'

const Hero = lazy(() => import('./hero/Hero.jsx'))

const stats = [
  { number: "Fresher", label: "Years Experience" },
  { number: "15+", label: "Projects Done" },
  { number: "Ready", label: "To Work" }
]

const containerVariants = stagger(0.1)

const Section = () => {
  return (
    <section id="home">
      <Suspense fallback={<div className="hero-fallback" />}>
        <Hero />
      </Suspense>

      <motion.div
        className="intro relative flex flex-col lg:flex-row justify-center items-center px-6 lg:px-20 pt-20 pb-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="leftSection w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 lg:pr-12"
          variants={riseVariants}
        >
          <motion.div className="mb-8" variants={riseVariants}>
            <h2 className="text-4xl lg:text-6xl font-normal tracking-tight leading-tight text-paper">
              Hello, I&apos;m <span className="text-dots">Aditya</span>
            </h2>

            <motion.div className="mt-4 text-2xl lg:text-3xl text-muted font-normal" variants={riseVariants}>
              I&apos;m a <span className="text-paper">Web Developer</span>
            </motion.div>

            <motion.div className="mt-4 font-mono text-base lg:text-lg text-tech" variants={riseVariants}>
              <TypeScript />
            </motion.div>
          </motion.div>

          <motion.div className="mb-8 text-paper/70 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0" variants={riseVariants}>
            <p>
              Passionate about creating beautiful, functional, and user-friendly web experiences. 
              I love turning ideas into reality through code.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            variants={riseVariants}
          >
            <div>
              <Button />
            </div>
            <motion.a
              href="#projects"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-6 py-3 border border-paper/30 text-paper hover:border-paper hover:bg-paper/10 transition-colors duration-300 rounded-xl font-medium"
            >
              View My Work
            </motion.a>
          </motion.div>

          <motion.div className="flex justify-center lg:justify-start space-x-6" variants={riseVariants}>
            {stats.map((stat) => (
              <motion.div key={stat.label} className="text-center" whileHover={{ y: -4 }}>
                <div className="text-2xl font-medium text-dots">{stat.number}</div>
                <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="rightSection w-full lg:w-1/2 flex justify-center lg:justify-end"
          variants={riseVariants}
        >
          <motion.div {...float(12, 6)}>
            <img
              className="w-80 h-96 lg:w-96 lg:h-[28rem] object-cover rounded-lg border border-rule"
              src="images/img3.png"
              alt="Aditya - Web Developer"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </motion.div>

        <button
          type="button"
          aria-label="Scroll to About"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex cursor-pointer"
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <span className="w-6 h-10 border border-paper/40 rounded-full flex justify-center">
            <motion.span
              className="w-1 h-3 bg-dots rounded-full mt-2"
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </button>
      </motion.div>
    </section>
  )
}

export default Section
