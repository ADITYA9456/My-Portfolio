import { FaDownload, FaExternalLinkAlt, FaGithub } from 'react-icons/fa'

const Button = () => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* Resume Button */}
            <a
                href="https://resume-tawny-six-40.vercel.app/"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-surface text-ink rounded-xl font-medium ring-1 ring-line transition-opacity duration-300 hover:opacity-90"
            >
                <FaDownload className="text-lg" />
                <span>Resume</span>
                <FaExternalLinkAlt className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            {/* GitHub Button */}
            <a
                href="https://github.com/ADITYA9456"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 border border-paper/30 text-paper rounded-xl font-medium hover:border-paper hover:bg-paper/10 transition-colors duration-300"
            >
                <FaGithub className="text-lg" />
                <span>Visit GitHub</span>
                <FaExternalLinkAlt className="text-sm text-tech opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
        </div>
    )
}

export default Button
