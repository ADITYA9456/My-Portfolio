import { useEffect, useRef, useState } from 'react'
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

const BUST_MODEL_URL = '/models/avatar.glb'
const CUT_FRACTION = 0.27
const HIDE_MESHES = /headwear/i

// TODO: replace with the real X profile; the repo had no X link to reuse.
const X_URL = 'https://x.com/'

// Seeded RNG so the ridge is identical on every render and between builds.
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const RIDGE_W = 1600
const RIDGE_H = 300

// Midpoint displacement gives a natural jagged skyline; the envelope keeps the mass on the
// left and right so the centre stays open for the figure.
function buildRidge(seed, scale, steps = 7) {
  const rnd = seeded(seed)
  const n = 2 ** steps + 1
  const noise = new Array(n).fill(0.5)
  let amp = 1
  for (let step = 2 ** steps; step > 1; step /= 2) {
    for (let i = step / 2; i < n; i += step) {
      noise[i] = (noise[i - step / 2] + noise[i + step / 2]) / 2 + (rnd() - 0.5) * amp
    }
    amp *= 0.62
  }
  const bump = (x, c, w) => Math.max(0, 1 - Math.abs(x - c) / w)
  const pts = noise.map((v, i) => {
    const x = i / (n - 1)
    const env = 0.42 * bump(x, 0.09, 0.26) + 0.95 * Math.pow(bump(x, 1.02, 0.46), 1.2)
    const h = Math.max(0, env * (0.55 + 0.9 * Math.min(1, Math.max(0, v)))) * scale
    return `${(x * RIDGE_W).toFixed(1)} ${(RIDGE_H - h * RIDGE_H).toFixed(1)}`
  })
  return `M0 ${RIDGE_H} L${pts.join(' L')} L${RIDGE_W} ${RIDGE_H} Z`
}

const RIDGE_BACK = buildRidge(7, 0.8)
const RIDGE_FRONT = buildRidge(21, 0.9)

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
      <div className="hero-fade" aria-hidden="true" />
      <svg className="hero-rocks" viewBox={`0 0 ${RIDGE_W} ${RIDGE_H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="rock-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#24272b" />
            <stop offset="0.55" stopColor="#101214" />
            <stop offset="1" stopColor="#0f110d" />
          </linearGradient>
          <filter id="rock-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.08" numOctaves="4" seed="4" />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.8 -0.7" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <path d={RIDGE_BACK} fill="#15171a" opacity="0.8" stroke="rgba(228,234,242,0.18)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d={RIDGE_FRONT} fill="url(#rock-fill)" stroke="rgba(228,234,242,0.5)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d={RIDGE_FRONT} fill="#fff" opacity="0.16" filter="url(#rock-grain)" />
      </svg>

      <div className="hero-copy">
        <p className="hero-hi hero-in">Hi, I&apos;m</p>
        <h1 className="hero-name hero-in">
          Aditya <span>Jain</span>
        </h1>
        <p className="hero-role hero-in">Full Stack Developer</p>
        <p className="hero-tagline hero-in">Building intelligent &amp; aesthetic web experiences.</p>
        <a className="hero-cta hero-in" href="#projects">
          Explore My Work <FaArrowRight className="-rotate-45" />
        </a>
      </div>

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
        <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="X">
          <FaXTwitter size={19} />
        </a>
        <a href="mailto:jainaditya2309@gmail.com" aria-label="Email">
          <FaEnvelope size={20} />
        </a>
      </div>
    </div>
  )
}

export default Hero
