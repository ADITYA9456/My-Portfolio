import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { buildBustDots, loadModel } from './bustDots.js'

const TOTAL_DOTS = 66000
const FRAME_BUDGET_MS = 12
const TAN15 = Math.tan(Math.PI / 12)
const ABORT = Symbol('abort')

const rawColor = (hex) => new Color(hex).convertLinearToSRGB()

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

const BUST_VERT = /* glsl */ `
uniform float uTime;
uniform float uAssemble;
uniform float uSize;
uniform float uGlint;
uniform float uShine;
uniform vec2 uHead;
uniform vec3 uLight;
uniform vec3 uRingCenter;
uniform float uRingRadius;
attribute float aRand;
attribute vec2 aShade;
attribute float aPart;
varying float vAlpha;
varying float vBright;
varying float vShine;
varying float vGlint;
varying float vLens;

mat3 rotY(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotX(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

void main() {
  float r2 = fract(sin(aRand * 91.7) * 43758.5453);

  float head = smoothstep(-1.3, -0.6, position.y);
  mat3 rot = rotY(uHead.x * (0.25 + 0.75 * head)) * rotX(uHead.y * head);
  vec3 pivot = vec3(0.0, -1.0, 0.0);
  vec3 home = rot * (position - pivot) + pivot;
  vec3 n = normalize(rot * normal);

  home += n * sin(uTime * 1.4 + aRand * 60.0) * 0.006;

  float t = clamp((uAssemble - aRand * 0.45) / 0.55, 0.0, 1.0);
  float e = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  float ang = aRand * 6.2831853;
  float ringR = uRingRadius * (1.0 + (r2 - 0.5) * 0.06);
  vec3 start = uRingCenter + vec3(sin(ang), cos(ang), 0.0) * ringR;
  vec3 arc = vec3(sin(aRand * 40.0 + uTime * 0.3), cos(aRand * 31.0), 0.9 + r2 * 1.4) * sin(e * 3.14159265) * 0.45;
  vec3 pos = mix(start, home, e) + arc;

  vec3 toLight = uLight - pos;
  float lit = max(dot(n, normalize(toLight)), 0.0) / (1.0 + dot(toLight, toLight) * 0.32);
  float key = max(dot(n, normalize(vec3(-0.5, 0.6, 0.7))), 0.0);
  float facing = normalize(normalMatrix * n).z;
  float rim = pow(1.0 - abs(facing), 3.0);

  float b = 0.3 + key * 0.22 + lit * 1.5 + rim * 0.14;
  b *= mix(0.55, 1.0, smoothstep(-0.3, 0.25, facing));

  float ridge = aShade.x;
  float thin = aShade.y;
  b *= ridge > 0.0 ? 1.0 + ridge * 0.7 : 1.0 + ridge * 0.5;
  b += thin * (0.26 + key * 0.3);

  float isLeaf = step(1.5, aPart) * step(aPart, 2.5);
  float isFrame = step(2.5, aPart) * step(aPart, 3.5);
  float isLens = step(3.5, aPart);
  b *= mix(1.0, 0.9, isLeaf);
  b *= mix(1.0, 0.78, max(isFrame, isLens));
  b *= mix(1.0, 0.7, isLens);
  b *= 0.7 + r2 * 0.5;

  float special = max(isLeaf, max(isFrame, isLens));
  float glint = (1.0 - smoothstep(0.0, 0.09, abs(position.x - uGlint))) * special;
  b += glint * 1.2;

  float band = home.y - home.x * 0.5 - uShine;
  float shine = exp(-band * band * 4.0);
  b += shine * 1.3;

  vAlpha = mix(0.75, 1.0, e);
  vBright = b;
  vShine = shine;
  vGlint = glint;
  vLens = isLens;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.45 + r2 * r2 * 1.3) * (1.0 + shine * 0.6) / -mv.z;
}
`

const BUST_FRAG = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uBlue;
uniform vec3 uCream;
varying float vAlpha;
varying float vBright;
varying float vShine;
varying float vGlint;
varying float vLens;

void main() {
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float alpha = exp(-16.0 * r * r) * vAlpha;
  vec3 ink = mix(uInk, uCream, vShine * 0.6);
  ink = mix(ink, uBlue, vLens * 0.6);
  ink = mix(ink, uBlue, vGlint * 0.7);
  gl_FragColor = vec4(ink * vBright * alpha, 1.0);
}
`

const RING_VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uOn;
uniform float uSpeed;
attribute float aT;
attribute float aRand;
varying float vBright;
void main() {
  float head = fract(aT - uTime * uSpeed);
  float comet = pow(head, 9.0);
  vBright = (0.38 + comet * 1.6 + aRand * 0.15) * uOn;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.4 + comet * 0.9 + aRand * 0.3) / -mv.z;
}
`

const LIGHT_VERT = /* glsl */ `
uniform vec3 uLight;
uniform float uSize;
uniform float uOn;
void main() {
  vec4 mv = viewMatrix * vec4(uLight, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uOn / -mv.z;
}
`

const LIGHT_FRAG = /* glsl */ `
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  if (r > 1.0) discard;
  float core = 1.0 - smoothstep(0.08, 0.14, r);
  float glow = exp(-4.0 * r) * 0.45 + exp(-12.0 * r) * 0.7;
  gl_FragColor = vec4(vec3(core + glow), 1.0);
}
`

const DUST_VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uOn;
attribute float aRand;
varying float vBright;
void main() {
  vec3 p = position;
  p.y = mod(p.y + uTime * (0.03 + aRand * 0.05) + 6.0, 12.0) - 6.0;
  p.x += sin(uTime * 0.2 + aRand * 40.0) * 0.15;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.5 + aRand) / -mv.z;
  vBright = (0.1 + aRand * 0.18) * uOn;
}
`

const DUST_FRAG = /* glsl */ `
uniform vec3 uInk;
varying float vBright;
void main() {
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float alpha = exp(-16.0 * r * r);
  gl_FragColor = vec4(uInk * vBright * alpha, 1.0);
}
`

export function createBustScene({ container, url, cutFraction, hide, reducedMotion, onProgress, onReady, onError }) {
  let disposed = false
  const abort = new AbortController()
  const cleanups = []
  const disposables = []

  const slice = (() => {
    let start = performance.now()
    return async () => {
      if (disposed) throw ABORT
      if (performance.now() - start > FRAME_BUDGET_MS) {
        await tick()
        if (disposed) throw ABORT
        start = performance.now()
      }
    }
  })()

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let renderer = null

  const dispose = () => {
    if (disposed) return
    disposed = true
    abort.abort()
    for (const fn of cleanups.splice(0)) fn()
    for (const d of disposables.splice(0)) d.dispose()
    if (renderer) {
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      renderer = null
    }
  }

  const run = async () => {
    onProgress(0.1)
    const gltf = await loadModel(url, abort.signal)
    if (disposed) return
    onProgress(0.4)
    const data = await buildBustDots(gltf, TOTAL_DOTS, slice, cutFraction, hide)
    if (disposed) return

    renderer = new WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x0f110d, 1)
    container.appendChild(renderer.domElement)

    onProgress(1)
    if (!reducedMotion) {
      await new Promise((resolve) => setTimeout(resolve, 380))
      if (disposed) return
    }

    const scene = new Scene()
    const camera = new PerspectiveCamera(30, 1, 0.1, 100)
    const target = new Vector3(0, -0.15, 0)

    const lightPos = new Vector3(-1.4, 1.2, 1.6)
    const ringCenter = new Vector3(0, -0.15, 0)
    const head = new Vector2()
    const uHead = new Vector2()
    const ink = rawColor('#c9d4b8')

    const bustGeo = new BufferGeometry()
    bustGeo.setAttribute('position', new Float32BufferAttribute(data.pos, 3))
    bustGeo.setAttribute('normal', new Float32BufferAttribute(data.nor, 3))
    bustGeo.setAttribute('aRand', new Float32BufferAttribute(data.rand, 1))
    bustGeo.setAttribute('aShade', new Float32BufferAttribute(data.shade, 2))
    bustGeo.setAttribute('aPart', new Float32BufferAttribute(data.part, 1))
    const bustUniforms = {
      uTime: { value: 0 },
      uAssemble: { value: reducedMotion ? 1 : 0 },
      uSize: { value: 26 * dpr },
      uGlint: { value: -9 },
      uShine: { value: 99 },
      uHead: { value: uHead },
      uLight: { value: lightPos },
      uRingCenter: { value: ringCenter },
      uRingRadius: { value: 1 },
      uInk: { value: ink },
      uBlue: { value: rawColor('#7fa8a3') },
      uCream: { value: rawColor('#f0e5c8') },
    }
    const blend = { transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending }
    const bustMat = new ShaderMaterial({ uniforms: bustUniforms, vertexShader: BUST_VERT, fragmentShader: BUST_FRAG, ...blend })
    const bust = new Points(bustGeo, bustMat)
    bust.frustumCulled = false

    const lightGeo = new BufferGeometry()
    lightGeo.setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3))
    const lightUniforms = { uLight: { value: lightPos }, uSize: { value: 240 * dpr }, uOn: { value: reducedMotion ? 1 : 0 } }
    const lightMat = new ShaderMaterial({ uniforms: lightUniforms, vertexShader: LIGHT_VERT, fragmentShader: LIGHT_FRAG, ...blend })
    const lightPoint = new Points(lightGeo, lightMat)
    lightPoint.frustumCulled = false

    const DUST = 1500
    const dustPos = new Float32Array(DUST * 3)
    const dustRand = new Float32Array(DUST)
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() * 2 - 1) * 9
      dustPos[i * 3 + 1] = (Math.random() * 2 - 1) * 6
      dustPos[i * 3 + 2] = -6 + Math.random() * 8
      dustRand[i] = Math.random()
    }
    const dustGeo = new BufferGeometry()
    dustGeo.setAttribute('position', new Float32BufferAttribute(dustPos, 3))
    dustGeo.setAttribute('aRand', new Float32BufferAttribute(dustRand, 1))
    const dustUniforms = {
      uTime: bustUniforms.uTime,
      uSize: { value: 22 * dpr },
      uOn: { value: reducedMotion ? 1 : 0 },
      uInk: { value: ink },
    }
    const dustMat = new ShaderMaterial({ uniforms: dustUniforms, vertexShader: DUST_VERT, fragmentShader: DUST_FRAG, ...blend })
    const dustPoints = new Points(dustGeo, dustMat)
    dustPoints.frustumCulled = false

    const makeRing = ({ cx, cy, cz, rx, ry, rotY, rotZ, from = 0, to = 1, count = 2200, speed = 0.05 }) => {
      const p = new Float32Array(count * 3)
      const tt = new Float32Array(count)
      const rr = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        const u = i / count
        const a = (from + (to - from) * u) * Math.PI * 2
        p[i * 3] = Math.cos(a) * rx + (Math.random() - 0.5) * 0.012
        p[i * 3 + 1] = Math.sin(a) * ry + (Math.random() - 0.5) * 0.012
        p[i * 3 + 2] = (Math.random() - 0.5) * 0.012
        tt[i] = u
        rr[i] = Math.random()
      }
      const geo = new BufferGeometry()
      geo.setAttribute('position', new Float32BufferAttribute(p, 3))
      geo.setAttribute('aT', new Float32BufferAttribute(tt, 1))
      geo.setAttribute('aRand', new Float32BufferAttribute(rr, 1))
      const mat = new ShaderMaterial({
        uniforms: {
          uTime: bustUniforms.uTime,
          uSize: { value: 20 * dpr },
          uOn: dustUniforms.uOn,
          uSpeed: { value: speed },
          uInk: { value: ink },
        },
        vertexShader: RING_VERT,
        fragmentShader: DUST_FRAG,
        ...blend,
      })
      const pts = new Points(geo, mat)
      pts.frustumCulled = false
      pts.position.set(cx, cy, cz)
      pts.rotation.set(0, rotY, rotZ)
      disposables.push(geo, mat)
      return pts
    }
    const orbitA = makeRing({ cx: 0.35, cy: 0.45, cz: 0, rx: 3.3, ry: 0.85, rotY: 0.3, rotZ: 0.3, speed: 0.045 })
    const orbitB = makeRing({ cx: 0.4, cy: -1.05, cz: 0, rx: 3.6, ry: 0.8, rotY: 0.25, rotZ: 0.2, speed: -0.06 })
    const orbitC = makeRing({ cx: -0.4, cy: 0.9, cz: -1.2, rx: 3.5, ry: 3.5, rotY: 0, rotZ: 0, from: 0.5, to: 0.8, count: 900, speed: 0.02 })
    const orbits = [orbitA, orbitB, orbitC]

    scene.add(dustPoints, bust, lightPoint, ...orbits)
    disposables.push(bustGeo, bustMat, lightGeo, lightMat, dustGeo, dustMat)

    let width = 1
    let height = 1
    const resize = () => {
      width = Math.max(1, container.clientWidth)
      height = Math.max(1, container.clientHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      const distance = Math.max(2.35 / TAN15, 1.7 / (TAN15 * camera.aspect))
      const shift = camera.aspect > 1.25 ? 0.95 : 0
      target.x = -shift
      camera.position.set(-shift, -0.15, distance)
      camera.lookAt(target)
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
      bustUniforms.uRingRadius.value = 92 * ((2 * distance * TAN15) / height)
      dirty = true
    }

    const pointer = { has: false, down: false, x: 0, y: 0, type: 'mouse', lastTouch: -Infinity }
    const ndc = new Vector3()
    const dir = new Vector3()
    const goal = new Vector3()
    const headGoal = new Vector2()

    let t = 0
    let last = 0
    let rafId = 0
    let inView = true
    let started = false
    let readyFired = false
    let dirty = true

    const render = () => renderer.render(scene, camera)

    const update = (dt, now) => {
      if (!reducedMotion) t += dt
      bustUniforms.uTime.value = reducedMotion ? 0 : t
      const assemble = reducedMotion ? 1 : Math.min(1, t / 2.6)
      bustUniforms.uAssemble.value = assemble

      if (!reducedMotion) {
        const lk = 1 - Math.exp(-dt * 4)
        lightUniforms.uOn.value += (Math.min(1, 1.6 * assemble) - lightUniforms.uOn.value) * lk
        dustUniforms.uOn.value += (1 - dustUniforms.uOn.value) * (1 - Math.exp(-dt * 0.8))

        let shine = 99
        if (t >= 2.34 && t <= 4.54) {
          const s = (t - 2.34) / 2.2
          shine = 2.8 - (1 - (1 - s) * (1 - s)) * 7.4
        }
        bustUniforms.uShine.value = shine
        let glint = -9
        if (t >= 4.6) {
          const ph = (t - 4.6) % 4.2
          if (ph < 0.9) {
            const a = data.nonBustMinX - 0.15
            const b = data.nonBustMaxX + 0.15
            glint = a + (b - a) * (ph / 0.9)
          }
        }
        bustUniforms.uGlint.value = glint
      }

      let active = false
      if (pointer.has) {
        const rect = container.getBoundingClientRect()
        ndc.set(((pointer.x - rect.left) / rect.width) * 2 - 1, -((pointer.y - rect.top) / rect.height) * 2 + 1, 0.5)
        const touchOk = pointer.type !== 'touch' || pointer.down || now - pointer.lastTouch < 1500
        active = touchOk && Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1
      }
      const orbitT = reducedMotion ? 0 : t
      if (active) {
        dir.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize()
        goal.copy(camera.position).addScaledVector(dir, (2.6 - camera.position.z) / dir.z)
        headGoal.set(0.5 * ndc.x, 0.18 * ndc.y)
        const lk = reducedMotion ? 1 : 1 - Math.exp(-dt * 5)
        lightPos.lerp(goal, lk)
        if (!reducedMotion) head.lerp(headGoal, 1 - Math.exp(-dt * 3))
      } else {
        goal.set(1.9 * Math.sin(0.45 * orbitT), 0.5 + 0.8 * Math.cos(0.33 * orbitT), 2.6)
        const lk = reducedMotion ? 1 : 1 - Math.exp(-dt * 5)
        lightPos.lerp(goal, lk)
        if (!reducedMotion) {
          headGoal.set(0.35 * Math.sin(0.45 * orbitT), 0.12 * Math.cos(0.33 * orbitT))
          head.lerp(headGoal, 1 - Math.exp(-dt * 1.5))
        }
      }
      uHead.set(head.x + 0.14, -head.y - 0.12)
      return assemble
    }

    const frame = (now) => {
      rafId = 0
      if (disposed || !canRun()) return
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      const assemble = update(dt, now)
      dirty = false
      render()
      if (!readyFired && assemble > 0.55) {
        readyFired = true
        onReady()
      }
      if (!reducedMotion) rafId = requestAnimationFrame(frame)
    }

    const canRun = () => started && inView && !document.hidden
    const sync = () => {
      if (canRun()) {
        if (!rafId && (!reducedMotion || dirty)) rafId = requestAnimationFrame(frame)
      } else {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = 0
        last = 0
      }
    }
    const requestFrame = () => {
      dirty = true
      sync()
    }

    resize()
    // Compile shaders without blocking, then upload buffers while the canvas is hidden.
    if (renderer.extensions.has('KHR_parallel_shader_compile')) {
      await renderer.compileAsync(scene, camera)
      if (disposed) return
    }
    renderer.domElement.style.visibility = 'hidden'
    render()
    renderer.domElement.style.visibility = ''

    const ro = new ResizeObserver(() => {
      resize()
      requestFrame()
    })
    ro.observe(container)
    const io = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting
      sync()
    })
    io.observe(container)
    const onVisibility = () => sync()
    const onMove = (e) => {
      pointer.has = true
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.type = e.pointerType || 'mouse'
      if (pointer.type === 'touch') {
        pointer.down = e.type !== 'pointerup' && e.type !== 'pointercancel'
        pointer.lastTouch = performance.now()
      }
      if (reducedMotion && inView) requestFrame()
    }
    const onUp = (e) => {
      if (e.pointerType === 'touch') {
        pointer.down = false
        pointer.lastTouch = performance.now()
      }
    }
    const onLeave = () => {
      pointer.has = false
      if (reducedMotion && inView) requestFrame()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    cleanups.push(() => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    })

    started = true
    sync()
  }

  run().catch((err) => {
    if (disposed || err === ABORT || err?.name === 'AbortError') return
    console.error('[hero] failed to start', err)
    onError()
    dispose()
  })

  return { dispose }
}
