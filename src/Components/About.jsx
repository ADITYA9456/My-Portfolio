import { motion } from 'framer-motion'

const skills = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Node.js',
  'NextJS',
  'Express',
  'Tailwind CSS',
  'MongoDB',
  'IoT',
  'Embedded Systems',
  'Java',
  'Python',
  'REST APIs',
  'MySQL',
  'Supabase',
  'Data Structures & Algorithms (DSA)',
  'Generative AI',
  'Agentic AI',
  'Git',
  'GitHub',
  'Postman',
  'Vercel',
  'VS Code',
  'NextAuth.js',
  'Razorpay'
]

const About = () => {
  const handleScrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const riseVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  }

  const paragraphClass = "p-6 rounded-xl border border-rule bg-paper/5"
  const highlightClass = "font-medium text-dots"

  return (
    <motion.section 
      id="about"
      className="min-h-screen py-16 px-6 lg:px-20 relative"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Section - Content */}
          <motion.div 
            className="w-full lg:w-3/5 space-y-8"
            variants={riseVariants}
          >
            {/* Heading */}
            <motion.div 
              className="text-center lg:text-left"
              variants={riseVariants}
            >
              <h1 className="text-4xl lg:text-6xl font-normal tracking-tight text-paper mb-4">
                About{' '}
                <span className="text-dots">
                  Me
                </span>
              </h1>
              <div className="h-px w-24 bg-tech mx-auto lg:mx-0" />
            </motion.div>

            {/* Introduction Paragraph */}
            <motion.div 
              className="space-y-6 text-paper/70 text-lg leading-relaxed"
              variants={riseVariants}
            >
              <p className={paragraphClass}>
                Hello! <span className={highlightClass}>Aditya Jain</span> here. A technology fanatic! 
                Currently, I am enrolled in the Department of <span className={highlightClass}>Electronics and Communication Engineering</span> at 
                Lakshmi Narain College of Technology, BHOPAL (M.P). My early education was completed from Young Scholars&apos; Academy Shikohabad (U.P).
              </p>

              <p className={paragraphClass}>
                I am a passionate and driven developer with expertise in both <span className={highlightClass}>front-end and back-end technologies</span>. 
                My journey in the world of technology has allowed me to gain proficiency in modern web development technologies and frameworks.
              </p>

              <p className={paragraphClass}>
                I also have hands-on experience in database management using <span className={highlightClass}>MongoDB</span>, enabling me to create scalable and efficient web applications. 
                Beyond software development, I specialize in <span className={highlightClass}>Embedded Systems and IoT</span>, showcasing my versatility in blending software with hardware.
              </p>

              <p className={paragraphClass}>
                As someone deeply committed to <span className={highlightClass}>continuous learning and problem-solving</span>, I thrive on tackling challenges and bringing creative ideas to life. 
                Feel free to explore my work and reach out—I&apos;d love to collaborate on exciting projects!
              </p>
            </motion.div>

            {/* Skills Section */}
            <motion.div 
              className="mt-12"
              variants={riseVariants}
            >
              <h3 className="text-2xl font-normal text-paper mb-6 text-center lg:text-left">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 border border-dots/30 text-dots rounded-full font-mono text-xs tracking-wide hover:border-dots hover:bg-dots/10 transition-colors duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - Image */}
          <motion.div 
            className="w-full lg:w-2/5 flex flex-col items-center lg:-mt-8"
            variants={riseVariants}
          >
            <img 
              className="w-80 h-80 lg:w-96 lg:h-96 object-cover object-top rounded-full border border-rule" 
              src="images/Me.jpeg" 
              alt="Aditya Jain - Web Developer"
              loading="lazy"
              decoding="async"
            />

            <div className="mt-6 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted mb-3">
                Open to opportunities & collaborations
              </p>
              <button
                type="button"
                onClick={handleScrollToContact}
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-paper border border-paper/30 hover:border-paper hover:bg-paper/10 transition-colors duration-300"
              >
                Let&apos;s Work Together
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default About
