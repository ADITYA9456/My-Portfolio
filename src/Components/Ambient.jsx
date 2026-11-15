import { useEffect, useRef } from 'react'

const PARTICLES = 70
const MAX_DPR = 1.5

// Faint drifting dots plus two slow glows, fixed behind everything below the hero.
// It only runs while the hero is scrolled out of view and the tab is visible.
const Ambient = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

    let width = 0
    let height = 0
    let rafId = 0
    let last = 0
    let heroHidden = false

    const dots = Array.from({ length: PARTICLES }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.004,
      vy: -0.004 - Math.random() * 0.008,
      a: 0.1 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
    }))

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now) => {
      rafId = 0
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#dfe6dc'
      for (const d of dots) {
        d.x += d.vx * dt
        d.y += d.vy * dt
        if (d.y < -0.02) d.y = 1.02
        if (d.x < -0.02) d.x = 1.02
        if (d.x > 1.02) d.x = -0.02
        const twinkle = 0.65 + 0.35 * Math.sin(now / 1800 + d.phase)
        ctx.globalAlpha = d.a * twinkle
        ctx.beginPath()
        ctx.arc(d.x * width, d.y * height, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
      schedule()
    }

    const schedule = () => {
      if (rafId || !heroHidden || document.hidden) return
      rafId = requestAnimationFrame(draw)
    }

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      last = 0
    }

    const sync = () => (heroHidden && !document.hidden ? schedule() : stop())

    // The hero is exactly one screen tall and opaque, so the field is only visible once the
    // page has scrolled past the top. A scroll check is enough and avoids waiting for the lazy hero.
    const onScroll = () => {
      const pastHero = window.scrollY >= 24
      if (pastHero === heroHidden) return
      heroHidden = pastHero
      sync()
    }
    heroHidden = window.scrollY >= 24
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', sync)
    sync()

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <div className="ambient" aria-hidden="true">
      <span className="ambient-glow ambient-glow-a" />
      <span className="ambient-glow ambient-glow-b" />
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Ambient
