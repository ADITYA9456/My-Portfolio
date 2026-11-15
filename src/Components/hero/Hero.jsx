import { useEffect, useRef, useState } from 'react'
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'

const BUST_MODEL_URL = '/models/avatar.glb'
const CUT_FRACTION = 0.27
const HIDE_MESHES = /headwear/i

const RING_DOTS = 96
const RING = Array.from({ length: RING_DOTS }, (_, i) => {
  const angle = (i / RING_DOTS) * Math.PI * 2 - Math.PI / 2
  return {
    cx: Number((92 * Math.cos(angle)).toFixed(2)),
    cy: Number((92 * Math.sin(angle)).toFixed(2)),
  }
})

const Hero = () => {
  const stageRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let disposed = false
    let scene = null
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    import('./bustScene.js')
      .then(({ createBustScene }) => {
        if (disposed) return
        scene = createBustScene({
          container: stageRef.current,
          url: BUST_MODEL_URL,
          cutFraction: CUT_FRACTION,
          hide: HIDE_MESHES,
          reducedMotion,
          onProgress: setProgress,
          onReady: () => setPhase('ready'),
          onError: () => setFailed(true),
        })
      })
      .catch(() => {
        if (!disposed) setFailed(true)
      })

    return () => {
      disposed = true
      if (scene) scene.dispose()
    }
  }, [])

  const percent = Math.round(progress * 100)

  return (
    <div className="hero" data-phase={phase}>
      <div className="hero-stage" ref={stageRef} aria-hidden="true" />
      <div
        className="hero-loader"
        role="progressbar"
        aria-label="Loading the dots"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <svg className="hero-ring" viewBox="-110 -110 220 220">
          {RING.map(({ cx, cy }, i) => (
            <circle key={i} cx={cx} cy={cy} r="1.6" data-on={i / RING_DOTS < progress ? '' : undefined} />
          ))}
        </svg>
        <span className="hero-count" data-error={failed ? '' : undefined}>
          {failed ? 'Could not load' : String(percent).padStart(3, '0')}
        </span>
        <span className="hero-label">{failed ? 'Refresh to try again' : '66,000 dots'}</span>
      </div>
      <svg className="hero-rocks" viewBox="0 0 1600 190" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="rock-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#15170f" />
            <stop offset="1" stopColor="#050604" />
          </linearGradient>
        </defs>
        <path
          d="M0 190 L0 150 L60 138 L120 148 L190 120 L250 132 L310 150 L380 172 L430 190 Z M1030 190 L1090 176 L1160 150 L1240 158 L1310 126 L1380 112 L1450 84 L1520 92 L1600 52 L1600 190 Z"
          fill="url(#rock-fill)"
          stroke="rgba(240,229,200,0.28)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="hero-copy">
        <p className="hero-hi">Hi, I&apos;m</p>
        <h1 className="hero-name">
          Aditya <span>Jain</span>
        </h1>
        <p className="hero-role">Full Stack Developer</p>
        <p className="hero-tagline">Building intelligent &amp; aesthetic web experiences.</p>
        <a className="hero-cta" href="#projects">
          Explore My Work <FaArrowRight className="-rotate-45" />
        </a>
      </div>

      <p className="hero-quote">
        Dream Big.
        <br />
        Code Bigger.&rdquo;
      </p>

      <button
        type="button"
        className="hero-scroll"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <i aria-hidden="true" />
        Scroll to Explore
      </button>

      <div className="hero-social">
        <a href="https://github.com/ADITYA9456" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub size={20} />
        </a>
        <a href="https://www.linkedin.com/in/aditya-jain-3211a8257" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedinIn size={20} />
        </a>
        <a href="https://wa.me/+919456266491" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <FaWhatsapp size={20} />
        </a>
        <a href="mailto:jainaditya2309@gmail.com" aria-label="Email">
          <FaEnvelope size={20} />
        </a>
      </div>
    </div>
  )
}

export default Hero
