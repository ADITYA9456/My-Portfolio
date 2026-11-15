import { useEffect, useRef, useState } from 'react'

const PORTRAIT_URL = '/images/Me.jpeg'

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
          url: PORTRAIT_URL,
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
      <h1 className="hero-name">Aditya</h1>
      <p className="hero-tagline">Web Developer</p>
      <p className="hero-hint">Move the light</p>
    </div>
  )
}

export default Hero
