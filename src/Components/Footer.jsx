import { motion } from 'framer-motion'
import { FaArrowUp, FaEnvelope, FaHeart, FaLinkedin, FaRocket, FaWhatsapp } from "react-icons/fa"

const socialClass = "p-3 border border-rule rounded-xl text-paper/80 hover:border-tech hover:text-paper transition-colors duration-300"

const Footer = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    }

    return (
        <motion.footer 
            id="footer"
            className="relative border-t border-rule"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <motion.div 
                        className="text-center md:text-left"
                        variants={itemVariants}
                    >
                        <h3 className="font-serif text-3xl text-paper mb-4">
                            Aditya&apos;s Portfolio
                        </h3>
                        <p className="text-paper/60 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                            Passionate about creating innovative solutions and bringing ideas to life through code.
                        </p>
                        
                        {/* Achievement badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-rule rounded-full text-tech font-mono text-xs uppercase tracking-[0.12em] mt-4">
                            <FaRocket />
                            <span>Always Building</span>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div 
                        className="text-center"
                        variants={itemVariants}
                    >
                        <h4 className="text-lg font-medium text-paper mb-6">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {['Home', 'About', 'Projects', 'Skills'].map((link) => (
                                <li key={link}>
                                    <a
                                        href={`#${link.toLowerCase()}`}
                                        className="text-paper/60 hover:text-paper transition-colors duration-300 inline-block"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Connect Section */}
                    <motion.div 
                        className="text-center md:text-right"
                        variants={itemVariants}
                    >
                        <h4 className="text-lg font-medium text-paper mb-6">
                            Let&apos;s Connect
                        </h4>
                        <div className="flex justify-center md:justify-end gap-6 mb-6">
                            <motion.a whileHover={{ y: -5, scale: 1.08 }} whileTap={{ scale: 0.94 }}
                                href="https://wa.me/+919456266491"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className={socialClass}
                            >
                                <FaWhatsapp className="text-xl" />
                            </motion.a>
                            <motion.a whileHover={{ y: -5, scale: 1.08 }} whileTap={{ scale: 0.94 }}
                                href="https://www.linkedin.com/in/aditya-jain-3211a8257"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className={socialClass}
                            >
                                <FaLinkedin className="text-xl" />
                            </motion.a>
                            <motion.a whileHover={{ y: -5, scale: 1.08 }} whileTap={{ scale: 0.94 }}
                                href="mailto:jainaditya2309@gmail.com"
                                aria-label="Email"
                                className={socialClass}
                            >
                                <FaEnvelope className="text-xl" />
                            </motion.a>
                        </div>
                        <p className="text-muted text-sm">
                            Open for opportunities and collaborations
                        </p>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-rule mb-8" />

                {/* Bottom Section */}
                <motion.div 
                    className="flex flex-col md:flex-row justify-between items-center gap-4"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-2 text-muted text-sm">
                        <span>&copy; 2026 Aditya Jain</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted text-sm">
                        <span>Made with</span>
                        <motion.span className="inline-flex" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}><FaHeart className="text-paper" /></motion.span>
                        <span>and lots of ☕</span>
                    </div>
                    <a href="#home" className="inline-flex items-center gap-2 text-muted text-sm hover:text-paper transition-colors duration-300">
                        <FaArrowUp /> Back to top
                    </a>
                </motion.div>
            </div>
        </motion.footer>
    )
}

export default Footer